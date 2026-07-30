import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { performance } from 'node:perf_hooks';

const projectDir = resolve(import.meta.dirname, '..');
const repositoryDir = resolve(projectDir, '..');
const outputDir = join(projectDir, 'outputs', 'brain-map-v4', 'certification');
const logsDir = join(outputDir, 'logs');
const reviewsDir = join(outputDir, 'reviews');
const freezePath = join(outputDir, 'candidate-freeze.json');
const evidencePath = join(projectDir, 'outputs', 'brain-map-v4', 'certify-evidence.json');
const finalPath = join(outputDir, 'final-certificate.json');
const planPath = join(
  repositoryDir,
  '.hermes',
  'plans',
  '2026-07-30_022735-brain-map-v4-100-improvement-plan.md',
);
const expectedV3Sha256 = '46796901a2f5b51b88d3dbb21c8df76806396b963bee7dbc5160c645842b2888';
const requiredReviewers = [
  'architecture',
  'product-plan',
  'truth-security',
  'accessibility-visual',
  'performance-offline',
  'anti-fake-release',
];
const excludedDirectories = new Set([
  'node_modules',
  'dist',
  'outputs',
  'test-results',
  'playwright-report',
]);
const excludedFiles = new Set(['brain-map-v4.html', '.DS_Store']);

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value);
}

async function fileEvidence(path) {
  const body = await readFile(path);
  return { path: relative(repositoryDir, path), bytes: body.length, sha256: sha256(body) };
}

async function collectSourceFiles(directory = projectDir) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
    if (entry.name.startsWith('.') && entry.name !== '.eslintrc.json') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name)) continue;
      files.push(...(await collectSourceFiles(path)));
    } else if (!excludedFiles.has(entry.name)) {
      files.push(path);
    }
  }
  return files;
}

async function sourceManifest() {
  const files = await collectSourceFiles();
  const evidence = await Promise.all(files.map(fileEvidence));
  evidence.sort((left, right) => left.path.localeCompare(right.path));
  const digest = sha256(
    evidence.map((entry) => `${entry.path}\0${entry.bytes}\0${entry.sha256}\n`).join(''),
  );
  return { sha256: digest, files: evidence };
}

function runGate(name, executable, args) {
  const startedAt = new Date().toISOString();
  const start = performance.now();
  const result = spawnSync(executable, args, {
    cwd: projectDir,
    encoding: 'utf8',
    env: { ...process.env, CI: '1' },
    maxBuffer: 20 * 1024 * 1024,
  });
  const record = {
    name,
    command: [executable, ...args].join(' '),
    startedAt,
    durationMs: Number((performance.now() - start).toFixed(2)),
    exitCode: result.status ?? 1,
    signal: result.signal ?? null,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
  return record;
}

async function writeGateLog(record) {
  const path = join(logsDir, `${record.name}.json`);
  await writeFile(path, `${JSON.stringify(record, null, 2)}\n`);
  return fileEvidence(path);
}

async function latestBoundReport(directory, prefix, artifactSha256) {
  const expectedPrefix = `${prefix}-${artifactSha256.slice(0, 12)}`;
  const names = (await readdir(directory)).filter(
    (name) => name.startsWith(expectedPrefix) && name.endsWith('.json'),
  );
  if (names.length !== 1) throw new Error(`${prefix}-report-not-unique-for-artifact`);
  const path = join(directory, names[0]);
  const parsed = JSON.parse(await readFile(path, 'utf8'));
  if (parsed.status !== 'PASS' || parsed.candidate?.artifactSha256 !== artifactSha256) {
    throw new Error(`${prefix}-report-not-bound-pass`);
  }
  return fileEvidence(path);
}

async function candidateEvidence(gateLogs = []) {
  const source = await sourceManifest();
  const artifact = await fileEvidence(join(projectDir, 'brain-map-v4.html'));
  const repositoryArtifact = await fileEvidence(join(repositoryDir, 'brain-map-v4.html'));
  if (artifact.sha256 !== repositoryArtifact.sha256) throw new Error('artifact-copies-diverged');
  const plan = await fileEvidence(planPath);
  const v3 = await fileEvidence(join(repositoryDir, 'brain-map-v3.html'));
  if (v3.sha256 !== expectedV3Sha256) throw new Error('v3-rollback-hash-mismatch');
  const coveragePath = join(projectDir, 'outputs', 'brain-map-v4', 'plan-coverage.json');
  const coverage = JSON.parse(await readFile(coveragePath, 'utf8'));
  if (
    coverage.planSha256 !== plan.sha256 ||
    coverage.verified !== 100 ||
    coverage.executableTests !== 100 ||
    coverage.failed !== 0
  ) {
    throw new Error('plan-coverage-not-bound-pass');
  }
  const performanceReport = await latestBoundReport(
    join(projectDir, 'outputs', 'brain-map-v4', 'performance'),
    'performance',
    artifact.sha256,
  );
  const offlineReport = await latestBoundReport(
    join(projectDir, 'outputs', 'brain-map-v4', 'offline'),
    'offline',
    artifact.sha256,
  );
  const v3ReportPath = join(outputDir, 'v3-rollback.json');
  const v3Report = JSON.parse(await readFile(v3ReportPath, 'utf8'));
  if (v3Report.status !== 'PASS' || v3Report.currentSha256 !== expectedV3Sha256) {
    throw new Error('v3-rollback-report-not-pass');
  }
  return {
    source,
    artifact,
    repositoryArtifact,
    plan,
    v3,
    planCoverage: await fileEvidence(coveragePath),
    performanceReport,
    offlineReport,
    v3Report: await fileEvidence(v3ReportPath),
    gateLogs,
  };
}

async function prepare() {
  await mkdir(logsDir, { recursive: true });
  await mkdir(reviewsDir, { recursive: true });
  const gates = [
    ['validate-plan', 'npm', ['run', 'validate:plan']],
    ['generate-plan', 'npm', ['run', 'generate:plan']],
    ['format', 'npm', ['run', 'format:check']],
    ['typecheck', 'npm', ['run', 'typecheck']],
    ['lint', 'npm', ['run', 'lint']],
    ['unit', 'npm', ['test']],
    ['security', 'npm', ['run', 'security']],
    ['dependency-audit', 'npm', ['audit', '--omit=optional', '--audit-level=high']],
    ['build', 'npm', ['run', 'build']],
    ['browser', 'npm', ['run', 'test:e2e']],
    ['performance', 'npm', ['run', 'benchmark']],
    ['offline', 'npm', ['run', 'offline']],
    ['v3-rollback', 'npm', ['run', 'verify:v3']],
  ];
  const gateLogs = [];
  for (const [name, executable, args] of gates) {
    const record = runGate(name, executable, args);
    gateLogs.push(await writeGateLog(record));
    if (record.exitCode !== 0) {
      const failure = {
        schema: 'brain-map-v4.certification.v2',
        phase: 'prepare',
        status: 'FAIL',
        failedGate: name,
        gateLogs,
      };
      await writeFile(evidencePath, `${JSON.stringify(failure, null, 2)}\n`);
      throw new Error(`certification-gate-failed:${name}`);
    }
  }
  const candidate = await candidateEvidence(gateLogs);
  const freezeBody = {
    schema: 'brain-map-v4.candidate-freeze.v2',
    createdAt: new Date().toISOString(),
    candidate,
    requiredReviewers,
    status: 'PREFREEZE_PASS',
  };
  const freezeSha256 = sha256(stableStringify(freezeBody));
  const freeze = { ...freezeBody, freezeSha256 };
  await writeFile(freezePath, `${JSON.stringify(freeze, null, 2)}\n`);
  await writeFile(
    evidencePath,
    `${JSON.stringify(
      {
        schema: 'brain-map-v4.certification.v2',
        phase: 'prepare',
        status: 'BLOCKED_PENDING_INDEPENDENT_REVIEWS',
        freezeSha256,
        freezePath: relative(repositoryDir, freezePath),
        candidate,
      },
      null,
      2,
    )}\n`,
  );
  console.log(
    JSON.stringify(
      {
        status: 'PREFREEZE_PASS',
        freezeSha256,
        sourceManifest: candidate.source.sha256,
        artifactSha256: candidate.artifact.sha256,
        requiredReviewers,
      },
      null,
      2,
    ),
  );
}

async function finalize() {
  const freeze = JSON.parse(await readFile(freezePath, 'utf8'));
  const { freezeSha256, ...freezeBody } = freeze;
  if (sha256(stableStringify(freezeBody)) !== freezeSha256) {
    throw new Error('freeze-integrity-invalid');
  }
  const current = await candidateEvidence(freeze.candidate.gateLogs);
  const driftChecks = {
    source: current.source.sha256 === freeze.candidate.source.sha256,
    artifact: current.artifact.sha256 === freeze.candidate.artifact.sha256,
    repositoryArtifact:
      current.repositoryArtifact.sha256 === freeze.candidate.repositoryArtifact.sha256,
    plan: current.plan.sha256 === freeze.candidate.plan.sha256,
    v3: current.v3.sha256 === freeze.candidate.v3.sha256,
    planCoverage: current.planCoverage.sha256 === freeze.candidate.planCoverage.sha256,
    performance: current.performanceReport.sha256 === freeze.candidate.performanceReport.sha256,
    offline: current.offlineReport.sha256 === freeze.candidate.offlineReport.sha256,
    v3Report: current.v3Report.sha256 === freeze.candidate.v3Report.sha256,
  };
  if (!Object.values(driftChecks).every(Boolean)) throw new Error('candidate-drift-after-freeze');

  const names = (await readdir(reviewsDir)).filter((name) => name.endsWith('.json')).sort();
  const reviews = [];
  for (const name of names) {
    const path = join(reviewsDir, name);
    const review = JSON.parse(await readFile(path, 'utf8'));
    if (
      !requiredReviewers.includes(review.reviewer) ||
      review.freezeSha256 !== freezeSha256 ||
      review.status !== 'PASS' ||
      !Array.isArray(review.findings) ||
      review.findings.length !== 0
    ) {
      throw new Error(`independent-review-invalid:${basename(path)}`);
    }
    reviews.push({ ...review, evidence: await fileEvidence(path) });
  }
  const reviewerIds = new Set(reviews.map((review) => review.reviewer));
  if (
    reviews.length !== requiredReviewers.length ||
    !requiredReviewers.every((reviewer) => reviewerIds.has(reviewer))
  ) {
    throw new Error('independent-review-set-incomplete');
  }
  const certificateBody = {
    schema: 'brain-map-v4.final-certificate.v2',
    createdAt: new Date().toISOString(),
    freezeSha256,
    candidate: freeze.candidate,
    driftChecks,
    reviews,
    status: 'PASS',
    releaseAuthorization: 'CERTIFIED_FOR_COMMIT_PUSH_AND_VERIFIED_TARGET_PUBLICATION',
  };
  const certificateSha256 = sha256(stableStringify(certificateBody));
  const certificate = { ...certificateBody, certificateSha256 };
  await writeFile(finalPath, `${JSON.stringify(certificate, null, 2)}\n`);
  await writeFile(evidencePath, `${JSON.stringify(certificate, null, 2)}\n`);
  await writeFile(join(outputDir, 'freeze.json'), `${JSON.stringify(freeze, null, 2)}\n`);
  console.log(
    JSON.stringify(
      {
        status: 'PASS',
        freezeSha256,
        certificateSha256,
        sourceManifest: freeze.candidate.source.sha256,
        artifactSha256: freeze.candidate.artifact.sha256,
        reviewers: [...reviewerIds].sort(),
      },
      null,
      2,
    ),
  );
}

const mode = process.argv[2] ?? 'prepare';
try {
  if (mode === 'prepare') await prepare();
  else if (mode === 'finalize') await finalize();
  else throw new Error('usage: node scripts/certify.mjs [prepare|finalize]');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
