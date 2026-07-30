import { chromium } from '@playwright/test';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { homedir, cpus, totalmem, platform, release } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const artifactPath = join(root, 'brain-map-v4.html');
const html = await readFile(artifactPath, 'utf8');
const artifactBytes = (await stat(artifactPath)).size;
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

function percentile(values, proportion) {
  const sorted = [...values].sort((a, b) => a - b);
  return Number(
    sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * proportion) - 1)].toFixed(2),
  );
}

const browser = await chromium.launch({ headless: true, executablePath: await cachedChrome() });
const consoleErrors = [];
const samples = { load: [], baseline: [], dense: [], stress: [], interaction: [] };
const stressRenderProfiles = [];
const fixtureObservations = { baseline: [], dense: [], stress: [] };
let longTaskCount = 0;
let longestTaskMs = 0;
let longTaskObserverSupported = true;
let workerProof = null;
let productionWorkerProof = null;
let finalCounts = null;

try {
  for (let run = 0; run < 5; run += 1) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', (error) => consoleErrors.push(error.message));
    const loadStart = performance.now();
    await page.setContent(html, { waitUntil: 'load' });
    await page.waitForFunction(() => Boolean(window.brainMapV4));
    samples.load.push(performance.now() - loadStart);
    await page.evaluate(() => {
      window.__brainMapLongTasks = [];
      window.__brainMapLongTaskSupported = false;
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__brainMapLongTasks.push(entry.duration);
        });
        try {
          observer.observe({ type: 'longtask', buffered: true });
          window.__brainMapLongTaskSupported = true;
        } catch {
          window.__brainMapLongTaskSupported = false;
        }
      }
    });
    const measure = async (operation) =>
      page.evaluate(async (op) => {
        const start = performance.now();
        if (op === 'baseline') {
          window.brainMapV4.setPreset('normal');
          window.brainMapV4.setZoom('overview');
        } else if (op === 'dense') {
          window.brainMapV4.setPreset('dense');
          window.brainMapV4.setZoom('overview');
        } else if (op === 'stress') {
          window.brainMapV4.setPreset('stress');
          window.brainMapV4.setZoom('overview');
        } else if (op === 'interaction') {
          window.brainMapV4.setPreset('normal');
          window.brainMapV4.selectNode('infinite-brain');
          window.brainMapV4.setZoom('detail');
          window.brainMapV4.setMode('explain');
        }
        await new Promise((resolveFrame) => requestAnimationFrame(() => resolveFrame()));
        return performance.now() - start;
      }, operation);
    samples.baseline.push(await measure('baseline'));
    fixtureObservations.baseline.push(await page.evaluate(() => window.brainMapV4.snapshot()));
    samples.dense.push(await measure('dense'));
    fixtureObservations.dense.push(await page.evaluate(() => window.brainMapV4.snapshot()));
    samples.stress.push(await measure('stress'));
    fixtureObservations.stress.push(await page.evaluate(() => window.brainMapV4.snapshot()));
    const currentProductionWorkerProof = await page.evaluate(() =>
      window.brainMapV4.productionWorkerProof(),
    );
    if (!productionWorkerProof) productionWorkerProof = currentProductionWorkerProof;
    stressRenderProfiles.push(await page.evaluate(() => window.brainMapV4.renderProfile()));
    samples.interaction.push(await measure('interaction'));
    if (!workerProof) workerProof = await page.evaluate(() => window.brainMapV4.workerProof());
    finalCounts = await page.evaluate(() => {
      window.brainMapV4.setPreset('stress');
      window.brainMapV4.setZoom('overview');
      return window.brainMapV4.snapshot();
    });
    await page.waitForTimeout(100);
    const tasks = await page.evaluate(() => window.__brainMapLongTasks ?? []);
    longTaskObserverSupported &&= await page.evaluate(
      () => window.__brainMapLongTaskSupported === true,
    );
    longTaskCount += tasks.length;
    longestTaskMs = Math.max(longestTaskMs, ...tasks, 0);
    await page.close();
  }
} finally {
  await browser.close();
}

const metrics = Object.fromEntries(
  Object.entries(samples).map(([name, values]) => [
    name,
    {
      samplesMs: values.map((v) => Number(v.toFixed(2))),
      p50Ms: percentile(values, 0.5),
      p95Ms: percentile(values, 0.95),
    },
  ]),
);
const budgets = {
  loadP95Ms: 1500,
  baselineP95Ms: 50,
  denseP95Ms: 150,
  stressP95Ms: 500,
  interactionP95Ms: 100,
  longestTaskMs: 200,
};
const checks = {
  artifactSelfContainedUnder1MiB: artifactBytes < 1024 * 1024,
  load: metrics.load.p95Ms <= budgets.loadP95Ms,
  baseline: metrics.baseline.p95Ms <= budgets.baselineP95Ms,
  dense: metrics.dense.p95Ms <= budgets.denseP95Ms,
  stress: metrics.stress.p95Ms <= budgets.stressP95Ms,
  interaction: metrics.interaction.p95Ms <= budgets.interactionP95Ms,
  longTaskBounded: longestTaskMs <= budgets.longestTaskMs,
  longTaskObserverSupported,
  fixtureObservations:
    fixtureObservations.baseline.every((entry) => entry.nodes === 26 && entry.edges === 36) &&
    fixtureObservations.dense.every((entry) => entry.nodes === 250 && entry.edges === 600) &&
    fixtureObservations.stress.every(
      (entry) =>
        entry.nodes === 1000 && entry.edges === 3000 && entry.projection === 'territory-aggregate',
    ) &&
    finalCounts?.nodes === 1000 &&
    finalCounts?.edges === 3000 &&
    finalCounts?.projection === 'territory-aggregate',
  worker:
    workerProof?.worker === true &&
    workerProof?.deterministic === true &&
    workerProof?.staleRejected === true,
  productionWorker:
    productionWorkerProof?.accepted === true &&
    productionWorkerProof?.nodeCount === 1000 &&
    productionWorkerProof?.rendererNodeCount === 1000,
  consoleClean: consoleErrors.length === 0,
};
const report = {
  schema: 'brain-map-v4.performance-certification.v1',
  candidate: { artifactPath, artifactBytes, artifactSha256 },
  host: {
    platform: platform(),
    release: release(),
    cpu: cpus()[0]?.model ?? 'unknown',
    cores: cpus().length,
    totalMemoryBytes: totalmem(),
  },
  runs: 5,
  fixtures: {
    baseline: { nodes: 26, edges: 36 },
    dense: { nodes: 250, edges: 600 },
    stress: { nodes: 1000, edges: 3000 },
  },
  budgets,
  metrics,
  stressRenderProfiles,
  fixtureObservations,
  longTasks: { count: longTaskCount, longestMs: Number(longestTaskMs.toFixed(2)) },
  workerProof,
  productionWorkerProof,
  checks,
  consoleErrors,
  status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL',
};
const outputDir = join(root, 'outputs', 'brain-map-v4', 'performance');
await mkdir(outputDir, { recursive: true });
const outputPath = join(outputDir, `performance-${artifactSha256.slice(0, 12)}.json`);
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      status: report.status,
      artifactSha256,
      outputPath,
      metrics,
      longTasks: report.longTasks,
      failed: Object.entries(checks)
        .filter(([, pass]) => !pass)
        .map(([name]) => name),
    },
    null,
    2,
  ),
);
if (report.status !== 'PASS') process.exit(1);
