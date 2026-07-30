import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const artifactPath = join(root, 'brain-map-v4.html');
const distDir = join(root, 'dist');
const html = await readFile(artifactPath, 'utf8');
const artifactSha256 = createHash('sha256').update(html).digest('hex');

async function cachedChrome() {
  const cache = join(homedir(), 'Library', 'Caches', 'ms-playwright');
  for (const version of (await readdir(cache))
    .filter((name) => name.startsWith('chromium-'))
    .sort()
    .reverse()) {
    const executable = join(
      cache,
      version,
      'chrome-mac-arm64',
      'Google Chrome for Testing.app',
      'Contents',
      'MacOS',
      'Google Chrome for Testing',
    );
    if (existsSync(executable)) return executable;
  }
  throw new Error('cached-chrome-unavailable');
}

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url ?? '/', 'http://127.0.0.1').pathname;
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const target = normalize(join(distDir, relative));
  if (!target.startsWith(`${distDir}/`) && target !== join(distDir, 'index.html')) {
    response.writeHead(403).end();
    return;
  }
  try {
    const info = await stat(target);
    if (!info.isFile()) throw new Error('not-file');
    response.writeHead(200, {
      'content-type': mime[extname(target)] ?? 'application/octet-stream',
      'cache-control': 'no-store',
      'service-worker-allowed': '/',
    });
    createReadStream(target).pipe(response);
  } catch {
    response.writeHead(404).end('not found');
  }
});
await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('offline-server-address-unavailable');
const origin = `http://127.0.0.1:${address.port}`;

const browser = await chromium.launch({ headless: true, executablePath: await cachedChrome() });
const report = {
  schema: 'brain-map-v4.offline-certification.v1',
  candidate: { artifactPath, artifactSha256 },
  standalone: { externalAssets: [], requests: [], snapshot: null, workbench: false },
  pwa: { initialRequests: [], serviceWorkerControlled: false, offlineSnapshot: null },
  checks: {},
  status: 'FAIL',
};

try {
  const standaloneContext = await browser.newContext({ offline: true });
  const standalonePage = await standaloneContext.newPage();
  standalonePage.on('request', (request) => report.standalone.requests.push(request.url()));
  await standalonePage.setContent(html, { waitUntil: 'load' });
  await standalonePage.waitForFunction(() => Boolean(window.brainMapV4));
  report.standalone.externalAssets = await standalonePage.evaluate(() =>
    [
      ...document.querySelectorAll(
        'script[src],link[href],img[src],source[src],video[src],audio[src],iframe[src]',
      ),
    ].map((element) => ({
      tag: element.tagName,
      url: element.getAttribute('src') ?? element.getAttribute('href'),
    })),
  );
  report.standalone.snapshot = await standalonePage.evaluate(() => window.brainMapV4.snapshot());
  await standalonePage.getByRole('button', { name: 'Open operator workbench' }).click();
  report.standalone.workbench = await standalonePage
    .getByRole('dialog', { name: 'Operator workbench' })
    .isVisible();
  await standaloneContext.close();

  const pwaContext = await browser.newContext();
  const pwaPage = await pwaContext.newPage();
  pwaPage.on('request', (request) => report.pwa.initialRequests.push(request.url()));
  await pwaPage.goto(`${origin}/index.html`, { waitUntil: 'load' });
  await pwaPage.waitForFunction(() => Boolean(window.brainMapV4));
  await pwaPage.evaluate(() => navigator.serviceWorker.ready);
  await pwaPage.reload({ waitUntil: 'load' });
  await pwaPage.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
  report.pwa.serviceWorkerControlled = true;
  await pwaContext.setOffline(true);
  await pwaPage.reload({ waitUntil: 'load' });
  await pwaPage.waitForFunction(() => Boolean(window.brainMapV4));
  report.pwa.offlineSnapshot = await pwaPage.evaluate(() => window.brainMapV4.snapshot());
  await pwaContext.close();
} finally {
  await browser.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}

report.checks = {
  standaloneZeroNetwork: report.standalone.requests.length === 0,
  standaloneNoExternalAssets: report.standalone.externalAssets.length === 0,
  standaloneFunctional:
    report.standalone.workbench === true &&
    report.standalone.snapshot?.nodes === 26 &&
    report.standalone.snapshot?.edges === 36,
  serviceWorkerControlled: report.pwa.serviceWorkerControlled === true,
  pwaRequestsLoopbackOnly: report.pwa.initialRequests.every((url) => url.startsWith(origin)),
  pwaOfflineFunctional:
    report.pwa.offlineSnapshot?.nodes === 26 && report.pwa.offlineSnapshot?.edges === 36,
};
report.status = Object.values(report.checks).every(Boolean) ? 'PASS' : 'FAIL';
const outputDir = join(root, 'outputs', 'brain-map-v4', 'offline');
await mkdir(outputDir, { recursive: true });
const outputPath = join(outputDir, `offline-${artifactSha256.slice(0, 12)}.json`);
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  JSON.stringify(
    { status: report.status, artifactSha256, outputPath, checks: report.checks },
    null,
    2,
  ),
);
if (report.status !== 'PASS') process.exit(1);
