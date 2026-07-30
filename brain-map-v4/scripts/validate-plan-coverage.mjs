import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const planPath = resolve(
  root,
  '../.hermes/plans/2026-07-30_022735-brain-map-v4-100-improvement-plan.md',
);
const evidencePath = resolve(root, 'config/plan-evidence.json');
const outputDirectory = resolve(root, 'outputs/brain-map-v4/certification');
const resultPath = join(outputDirectory, 'plan-test-results.json');
const coveragePath = resolve(root, 'outputs/brain-map-v4/plan-coverage.json');

function fail(message) {
  throw new Error(`plan-coverage-invalid: ${message}`);
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex');
}

function parsePlan(markdown) {
  const section = markdown.split('# The 100 improvements')[1];
  if (!section) fail('authoritative plan section missing');
  const rows = [];
  const seen = new Set();
  for (const line of section.split('\n')) {
    const match = line.match(/^(\d+)\.\s+\*\*(.+?)\*\*/);
    if (!match) continue;
    const id = Number(match[1]);
    if (id < 1 || id > 100 || seen.has(id)) continue;
    seen.add(id);
    rows.push({ id, title: match[2].trim() });
  }
  rows.sort((left, right) => left.id - right.id);
  if (rows.length !== 100 || rows.some((row, index) => row.id !== index + 1)) {
    fail(`expected plan IDs 1-100 exactly; received ${rows.length}`);
  }
  return rows;
}

function collectPlanTestFiles(directory) {
  if (!existsSync(directory)) fail('tests/plan directory missing');
  return readdirSync(directory)
    .filter((name) => name.endsWith('.test.ts'))
    .map((name) => join(directory, name))
    .sort();
}

mkdirSync(outputDirectory, { recursive: true });
const planText = readFileSync(planPath, 'utf8');
const planRows = parsePlan(planText);
const evidenceText = readFileSync(evidencePath, 'utf8');
const evidenceRows = JSON.parse(evidenceText);
if (!Array.isArray(evidenceRows) || evidenceRows.length !== 100) {
  fail(
    `evidence map must contain exactly 100 rows; received ${evidenceRows?.length ?? 'non-array'}`,
  );
}

const planTestFiles = collectPlanTestFiles(resolve(root, 'tests/plan'));
const allTestText = planTestFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
const staticTags = [
  ...allTestText.matchAll(/(?:it|test)\(\s*['"`](plan-(\d{3})):[^'"`]+['"`]/g),
].map((match) => match[1]);
if (staticTags.length !== 100)
  fail(`expected exactly 100 statically declared plan tests; received ${staticTags.length}`);
if (new Set(staticTags).size !== 100) fail('duplicate plan test IDs detected');

const evidenceById = new Map();
for (const row of evidenceRows) {
  if (!Number.isInteger(row.id) || row.id < 1 || row.id > 100 || evidenceById.has(row.id)) {
    fail(`duplicate or invalid evidence ID ${row.id}`);
  }
  const expectedTestId = `plan-${String(row.id).padStart(3, '0')}`;
  if (row.testId !== expectedTestId) fail(`evidence ${row.id} test ID mismatch`);
  if (
    typeof row.source !== 'string' ||
    !row.source.startsWith('src/') ||
    row.source.includes('plan.generated') ||
    typeof row.symbol !== 'string' ||
    !row.symbol.trim()
  ) {
    fail(`evidence ${row.id} has invalid production locator`);
  }
  if (typeof row.testFile !== 'string' || !row.testFile.startsWith('tests/plan/')) {
    fail(`evidence ${row.id} test path is outside tests/plan`);
  }
  const sourcePath = resolve(root, row.source);
  const testPath = resolve(root, row.testFile);
  if (!existsSync(sourcePath)) fail(`evidence ${row.id} source missing: ${row.source}`);
  if (!existsSync(testPath)) fail(`evidence ${row.id} test missing: ${row.testFile}`);
  const sourceText = readFileSync(sourcePath, 'utf8');
  const testText = readFileSync(testPath, 'utf8');
  if (!sourceText.includes(row.symbol)) fail(`evidence ${row.id} symbol missing: ${row.symbol}`);
  const tagPattern = '(?:it|test)\\(\\s*[\'"`]' + expectedTestId + ':';
  const tagMatches = [...testText.matchAll(new RegExp(tagPattern, 'g'))];
  if (tagMatches.length !== 1)
    fail(`evidence ${row.id} must have exactly one tagged test in ${row.testFile}`);
  const expectedImport = `../../${row.source.replace(/\.ts$/, '')}`;
  if (!testText.includes(expectedImport)) {
    fail(`evidence ${row.id} test does not import production source ${row.source}`);
  }
  evidenceById.set(row.id, { ...row, sourcePath, testPath, sourceText, testText });
}

const vitestPath = resolve(root, 'node_modules/vitest/vitest.mjs');
const execution = spawnSync(
  process.execPath,
  [vitestPath, 'run', 'tests/plan', '--reporter=json', `--outputFile=${resultPath}`],
  { cwd: root, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 },
);
if (!existsSync(resultPath)) {
  fail(`Vitest did not write result file; status=${execution.status}; stderr=${execution.stderr}`);
}
const testReport = JSON.parse(readFileSync(resultPath, 'utf8'));
const assertions = testReport.testResults.flatMap((suite) =>
  suite.assertionResults.map((assertion) => ({ ...assertion, suite: relative(root, suite.name) })),
);
const planAssertions = assertions.filter((assertion) => /^plan-\d{3}:/.test(assertion.title));
if (assertions.length !== 100 || planAssertions.length !== 100) {
  fail(
    `plan suite must execute exactly 100 tagged tests; executed ${assertions.length}, tagged ${planAssertions.length}`,
  );
}
if (
  !testReport.success ||
  execution.status !== 0 ||
  planAssertions.some((assertion) => assertion.status !== 'passed')
) {
  const failed = planAssertions
    .filter((assertion) => assertion.status !== 'passed')
    .map((assertion) => assertion.title);
  fail(`plan tests failed: ${failed.join(', ') || execution.stderr || execution.stdout}`);
}
const assertionByTag = new Map();
for (const assertion of planAssertions) {
  const tag = assertion.title.slice(0, 8);
  if (assertionByTag.has(tag)) fail(`runtime duplicate plan test ${tag}`);
  assertionByTag.set(tag, assertion);
}

const rows = planRows.map((plan) => {
  const evidence = evidenceById.get(plan.id);
  const tag = `plan-${String(plan.id).padStart(3, '0')}`;
  const assertion = assertionByTag.get(tag);
  if (!evidence || !assertion) fail(`plan ${plan.id} lacks executed evidence`);
  return {
    id: plan.id,
    title: plan.title,
    state: 'verified',
    source: evidence.source,
    symbol: evidence.symbol,
    sourceSha256: sha256(evidence.sourceText),
    test: evidence.testFile,
    testId: tag,
    testTitle: assertion.title,
    testSha256: sha256(evidence.testText),
    durationMs: assertion.duration ?? null,
  };
});

const report = {
  schemaVersion: 2,
  generatedAt: new Date().toISOString(),
  planPath: relative(resolve(root, '..'), planPath),
  planSha256: sha256(planText),
  evidenceMapSha256: sha256(evidenceText),
  planItems: planRows.length,
  executableTests: planAssertions.length,
  verified: rows.length,
  failed: 0,
  rows,
};
mkdirSync(dirname(coveragePath), { recursive: true });
writeFileSync(coveragePath, `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(
  `${JSON.stringify({ verified: 100, executableTests: 100, planSha256: report.planSha256 })}\n`,
);
