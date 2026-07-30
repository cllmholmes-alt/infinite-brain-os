export interface ReleaseEvidence {
  sourceHash: string;
  artifactHash: string;
  v3Hash: string;
  gates: Array<{ id: string; passed: boolean }>;
  reviews: Array<{ id: string; verdict: 'PASS' | 'FAIL'; candidateHash: string }>;
  rollbackVerified: boolean;
  semanticCanaryPassed: boolean;
  sourceUnchanged: boolean;
}

const REQUIRED_GATES = [
  'typecheck',
  'lint',
  'format',
  'unit',
  'browser',
  'axe',
  'security',
  'audit',
  'performance',
  'offline',
];
const REQUIRED_REVIEWS = [
  'architecture',
  'security',
  'accessibility',
  'product',
  'graph',
  'performance',
  'anti-fake',
];

export function evaluateReleaseEvidence(evidence: ReleaseEvidence): {
  passed: boolean;
  blockers: string[];
} {
  const blockers: string[] = [];
  for (const [name, hash] of [
    ['source', evidence.sourceHash],
    ['artifact', evidence.artifactHash],
    ['v3', evidence.v3Hash],
  ] as const) {
    if (!hash.startsWith('sha256-')) blockers.push(`${name}-hash-missing`);
  }
  for (const gateId of REQUIRED_GATES) {
    const gate = evidence.gates.find((entry) => entry.id === gateId);
    if (!gate?.passed) blockers.push(`gate-failed:${gateId}`);
  }
  for (const reviewId of REQUIRED_REVIEWS) {
    const review = evidence.reviews.find((entry) => entry.id === reviewId);
    if (!review || review.verdict !== 'PASS' || review.candidateHash !== evidence.sourceHash) {
      blockers.push(`review-failed:${reviewId}`);
    }
  }
  if (!evidence.rollbackVerified) blockers.push('rollback-unverified');
  if (!evidence.semanticCanaryPassed) blockers.push('semantic-canary-failed');
  if (!evidence.sourceUnchanged) blockers.push('candidate-mutated');
  return { passed: blockers.length === 0, blockers };
}
