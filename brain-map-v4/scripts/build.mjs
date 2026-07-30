import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(__dirname, '..');
const repositoryDir = resolve(projectDir, '..');
const sourceDate = process.env.SOURCE_DATE_EPOCH ?? '2026-07-30T00:00:00.000Z';

const pwaTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#d96135" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; form-action 'none'" />
    <title>Brain Map v4</title>
    <link rel="manifest" href="./manifest.webmanifest" />
  </head>
  <body>
    <div id="app-root"></div>
    <script type="module" src="./assets/brain-map-v4-bundle.js"></script>
  </body>
</html>
`;

const shellTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#d96135" />
    <meta http-equiv="cache-control" content="no-store" />
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src '{{SCRIPT_HASH}}'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; worker-src blob:; object-src 'none'; base-uri 'none'; form-action 'none'" />
    <title>Brain Map v4 · Evidence-bound ecosystem</title>
  </head>
  <body>
    <div id="app-root"></div>
    <script type="module">{{SCRIPT}}</script>
  </body>
</html>
`;

async function run() {
  const outDir = resolve(projectDir, 'dist');
  const assetsDir = resolve(outDir, 'assets');
  await mkdir(assetsDir, { recursive: true });

  const result = await build({
    entryPoints: [resolve(projectDir, 'src/main.ts')],
    bundle: true,
    minify: true,
    sourcemap: false,
    format: 'esm',
    target: ['es2022'],
    platform: 'browser',
    outfile: resolve(assetsDir, 'brain-map-v4-bundle.js'),
    legalComments: 'none',
  });

  const bundlePath = resolve(assetsDir, 'brain-map-v4-bundle.js');
  const bundleText = await readFile(bundlePath, 'utf8');
  const safeBundle = bundleText.replaceAll('</script', '<\\/script');
  const scriptHash = `sha256-${createHash('sha256').update(safeBundle).digest('base64')}`;
  const shell = shellTemplate
    .replace('{{SCRIPT_HASH}}', scriptHash)
    .replace('{{SCRIPT}}', safeBundle);
  const projectArtifact = resolve(projectDir, 'brain-map-v4.html');
  const repositoryArtifact = resolve(repositoryDir, 'brain-map-v4.html');
  await Promise.all([
    writeFile(resolve(outDir, 'index.html'), pwaTemplate),
    writeFile(projectArtifact, shell),
    writeFile(repositoryArtifact, shell),
  ]);

  const manifest = {
    name: 'Brain Map v4',
    short_name: 'Brain Map',
    start_url: './index.html',
    scope: './',
    display: 'standalone',
    background_color: '#f2efe8',
    theme_color: '#d96135',
    icons: [],
  };
  await writeFile(resolve(outDir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));

  const serviceWorker = `const CACHE='brain-map-v4-${createHash('sha256').update(bundleText).digest('hex').slice(0, 12)}';\nconst ASSETS=['./','./index.html','./manifest.webmanifest','./assets/brain-map-v4-bundle.js'];\nself.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));\nself.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))));\nself.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));});\n`;
  await writeFile(resolve(outDir, 'service-worker.js'), serviceWorker);

  const artifactHash = createHash('sha256').update(shell).digest('hex');
  const bundleHash = createHash('sha256').update(bundleText).digest('hex');
  await writeFile(
    resolve(outDir, 'dist-info.json'),
    JSON.stringify(
      {
        sourceDate,
        artifactHash,
        bundleHash,
        warnings: result.warnings,
        files: [
          'index.html',
          'manifest.webmanifest',
          'service-worker.js',
          'assets/brain-map-v4-bundle.js',
          '../brain-map-v4.html',
          '../../brain-map-v4.html',
        ],
      },
      null,
      2,
    ),
  );
  console.log(`Build completed. artifact sha256 ${artifactHash}`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
