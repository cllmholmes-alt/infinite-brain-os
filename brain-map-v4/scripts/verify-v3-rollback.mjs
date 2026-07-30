import { createHash } from 'node:crypto';
import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);
const projectDir = resolve(import.meta.dirname, '..');
const repositoryDir = resolve(projectDir, '..');
const v3Path = resolve(repositoryDir, 'brain-map-v3.html');
const expectedSha256 = '46796901a2f5b51b88d3dbb21c8df76806396b963bee7dbc5160c645842b2888';
const deliveredCommit = 'f89e12f586df813e0355afb77b8fb8446cafaca6';
const current = await readFile(v3Path);
const { stdout: delivered } = await execFile(
  'git',
  ['show', `${deliveredCommit}:brain-map-v3.html`],
  { cwd: repositoryDir, encoding: 'buffer', maxBuffer: 2 * 1024 * 1024 },
);
const currentHash = createHash('sha256').update(current).digest('hex');
const deliveredHash = createHash('sha256').update(delivered).digest('hex');
const currentLines = (current.toString('utf8').match(/\n/g) ?? []).length;
const checks = {
  canonicalHash: currentHash === expectedSha256,
  deliveredHash: deliveredHash === expectedSha256,
  byteIdenticalToDeliveredCommit: current.equals(delivered),
  expectedBytes: current.length === 149533,
  expectedLines: currentLines === 3936,
};
const report = {
  schema: 'brain-map-v4.v3-rollback-certification.v1',
  v3Path,
  deliveredCommit,
  expectedSha256,
  currentSha256: currentHash,
  deliveredSha256: deliveredHash,
  bytes: current.length,
  lines: currentLines,
  checks,
  status: Object.values(checks).every(Boolean) ? 'PASS' : 'FAIL',
};
const outputDir = resolve(projectDir, 'outputs', 'brain-map-v4', 'certification');
await mkdir(outputDir, { recursive: true });
const outputPath = resolve(outputDir, 'v3-rollback.json');
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: report.status, outputPath, checks }, null, 2));
if (report.status !== 'PASS') process.exit(1);
