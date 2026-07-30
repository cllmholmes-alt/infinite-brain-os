import { readFile, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectDir = resolve(__dirname, '..');
const sourceDir = resolve(projectDir, 'src');

async function sourceFiles() {
  const entries = await readdir(sourceDir, { recursive: true });
  return entries.filter((entry) => /\.(?:ts|tsx|js|mjs)$/.test(entry));
}

async function run() {
  const files = await sourceFiles();
  const issues = [];
  let innerHtmlCount = 0;
  let reviewedSinkCount = 0;
  const dangerous = [
    [/\b(?:eval|Function)\s*\(/, 'dynamic-code'],
    [/\b(?:outerHTML|insertAdjacentHTML|document\.write)\b/, 'dangerous-dom-sink'],
    [/setAttribute\s*\(\s*['"]on/i, 'inline-handler-assignment'],
    [/<[^>]+\son(?:click|error|load|mouseover|focus)\s*=/i, 'inline-handler-markup'],
  ];
  const secrets = [
    [/\bghp_[A-Za-z0-9]{20,}\b/, 'github-token'],
    [/\bsk_live_[A-Za-z0-9]{16,}\b/, 'stripe-live-key'],
    [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, 'private-key'],
    [/\bxox[baprs]-[A-Za-z0-9-]{20,}\b/, 'slack-token'],
  ];

  for (const relative of files) {
    const text = await readFile(resolve(sourceDir, relative), 'utf8');
    innerHtmlCount += (text.match(/\.innerHTML\s*=/g) ?? []).length;
    reviewedSinkCount += (text.match(/SECURITY_REVIEWED_DOM_SINK/g) ?? []).length;
    for (const [pattern, label] of dangerous) {
      if (pattern.test(text)) issues.push(`${relative}: ${label}`);
    }
    for (const [pattern, label] of secrets) {
      if (pattern.test(text)) issues.push(`${relative}: ${label}`);
    }
  }

  if (innerHtmlCount !== 1 || reviewedSinkCount !== 1) {
    issues.push(
      `reviewed DOM sink contract failed: innerHTML=${innerHtmlCount} markers=${reviewedSinkCount}`,
    );
  }

  const artifactPath = resolve(projectDir, 'brain-map-v4.html');
  const artifact = await readFile(artifactPath, 'utf8');
  if (!artifact.includes("connect-src 'none'"))
    issues.push('artifact CSP does not block network connections');
  if (artifact.includes("'unsafe-eval'")) issues.push('artifact CSP permits unsafe-eval');
  if (/\b(?:src|href)=["']https?:/i.test(artifact))
    issues.push('artifact contains an external asset URL');
  if (artifact.includes('{{SCRIPT'))
    issues.push('artifact contains an unresolved build placeholder');
  if ((artifact.match(/<script\b/gi) ?? []).length !== 1)
    issues.push('artifact must contain exactly one inline script');
  if (!/<script type="module">[\s\S]+<\/script>/.test(artifact))
    issues.push('artifact inline module is missing');

  if (issues.length) {
    console.error(JSON.stringify({ status: 'FAIL', issues }, null, 2));
    process.exit(1);
  }
  console.log(
    `security PASS files=${files.length} reviewedDomSinks=${innerHtmlCount} externalAssets=0`,
  );
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
