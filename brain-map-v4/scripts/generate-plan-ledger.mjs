import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(__dirname, '..');
const repositoryDir = resolve(projectDir, '..');
const planPath = resolve(
  repositoryDir,
  '.hermes/plans/2026-07-30_022735-brain-map-v4-100-improvement-plan.md',
);
const coveragePath = resolve(projectDir, 'outputs/brain-map-v4/plan-coverage.json');
const outputPath = resolve(projectDir, 'src/capabilities/plan.generated.ts');
const workstreams = [
  'Truth and identity',
  'Adapters and evidence',
  'Temporal memory',
  'Graph intelligence',
  'Spatial sensemaking',
  'Governed actions',
  'Operator operations',
  'Collaboration and reporting',
  'Brain Mirror boundary',
  'Platform and release',
];

async function run() {
  const [planText, coverageText] = await Promise.all([
    readFile(planPath, 'utf8'),
    readFile(coveragePath, 'utf8'),
  ]);
  const coverage = JSON.parse(coverageText);
  const planSha256 = createHash('sha256').update(planText).digest('hex');
  if (
    coverage.planSha256 !== planSha256 ||
    coverage.planItems !== 100 ||
    coverage.executableTests !== 100 ||
    coverage.verified !== 100 ||
    coverage.failed !== 0 ||
    !Array.isArray(coverage.rows) ||
    coverage.rows.length !== 100
  ) {
    throw new Error('plan-coverage-not-current-pass');
  }
  const ids = new Set(coverage.rows.map((row) => row.id));
  const testIds = new Set(coverage.rows.map((row) => row.testId));
  if (ids.size !== 100 || testIds.size !== 100) throw new Error('plan-coverage-not-unique');

  const items = coverage.rows.map((row) => {
    if (
      row.state !== 'verified' ||
      typeof row.title !== 'string' ||
      typeof row.source !== 'string' ||
      typeof row.symbol !== 'string' ||
      typeof row.test !== 'string' ||
      typeof row.testId !== 'string'
    ) {
      throw new Error(`plan-row-invalid-${row.id}`);
    }
    return {
      id: row.id,
      title: row.title,
      workstream: workstreams[Math.floor((row.id - 1) / 10)],
      source: row.source,
      test: row.test,
      testId: row.testId,
      state: 'verified',
      evidenceNote: `${row.testId}: ${row.source}#${row.symbol} is exercised by ${row.test}.`,
    };
  });
  const content = `export interface PlanCapability {
  id: number;
  title: string;
  workstream: string;
  source: string;
  test: string;
  testId: string;
  state: 'verified' | 'blocked';
  evidenceNote: string;
}

export const planCapabilities: PlanCapability[] = ${JSON.stringify(items, null, 2)} as PlanCapability[];
`;
  await writeFile(outputPath, content);
  console.log(
    JSON.stringify({ status: 'PASS', items: items.length, uniqueTests: testIds.size, planSha256 }),
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
