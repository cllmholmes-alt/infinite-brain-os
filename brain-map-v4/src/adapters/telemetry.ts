import type { AdapterResult } from './contract';
import { digestCanonical } from '../security/integrity';

export function buildCollectionHealth(results: readonly AdapterResult<unknown>[]): {
  total: number;
  successful: number;
  failed: number;
  unavailable: number;
  health: 'healthy' | 'degraded' | 'unavailable' | 'unknown';
  failedSourceIds: string[];
  latestCollectedAt: string | null;
} {
  const successful = results.filter((result) => result.status === 'success').length;
  const failed = results.filter((result) => result.status === 'error').length;
  const unavailable = results.filter((result) => result.status === 'unavailable').length;
  const latestCollectedAt =
    results
      .map((result) => result.collectedAt)
      .filter((value) => Number.isFinite(Date.parse(value)))
      .sort()
      .at(-1) ?? null;
  const health = !results.length
    ? 'unknown'
    : successful === results.length
      ? 'healthy'
      : successful > 0
        ? 'degraded'
        : unavailable === results.length
          ? 'unavailable'
          : 'degraded';
  return {
    total: results.length,
    successful,
    failed,
    unavailable,
    health,
    failedSourceIds: results
      .filter((result) => result.status !== 'success')
      .map((result) => result.sourceId)
      .sort(),
    latestCollectedAt,
  };
}

export function evaluateCollectionSlo(
  result: AdapterResult<unknown>,
  budget: { maxLatencyMs: number; maxAgeMs: number },
  now = Date.now(),
): { passed: boolean; violations: string[]; ageMs: number | null; latencyMs: number } {
  const violations: string[] = [];
  if (result.status !== 'success') violations.push('collection-failed');
  if (!Number.isFinite(result.durationMs) || result.durationMs > budget.maxLatencyMs) {
    violations.push('latency-budget');
  }
  const collectedAt = Date.parse(result.collectedAt);
  const ageMs = Number.isFinite(collectedAt) && collectedAt <= now ? now - collectedAt : null;
  if (ageMs === null) violations.push('collection-timestamp-invalid');
  else if (ageMs > budget.maxAgeMs) violations.push('freshness-budget');
  return { passed: violations.length === 0, violations, ageMs, latencyMs: result.durationMs };
}

export interface ConfigurationDrift {
  path: string;
  expected: unknown;
  observed: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function detectConfigurationDrift(
  expected: Record<string, unknown>,
  observed: Record<string, unknown>,
): ConfigurationDrift[] {
  const drift: ConfigurationDrift[] = [];
  const visit = (left: unknown, right: unknown, path: string): void => {
    if (isRecord(left) && isRecord(right)) {
      for (const key of [...new Set([...Object.keys(left), ...Object.keys(right)])].sort()) {
        visit(left[key], right[key], path ? `${path}.${key}` : key);
      }
      return;
    }
    if (digestCanonical(left) !== digestCanonical(right)) {
      drift.push({ path, expected: structuredClone(left), observed: structuredClone(right) });
    }
  };
  visit(expected, observed, '');
  return drift;
}

export interface GitFactsInput {
  localCommit: string;
  branch: string;
  dirty: boolean;
  noUpstream: boolean;
  ahead: number | null;
  behind: number | null;
}

export interface CiObservation {
  id: string;
  state: 'passing' | 'failing' | 'pending';
  observedAt: string;
  evidenceHandle: string;
}

export function buildGitCiState(
  git: GitFactsInput,
  checks: CiObservation[],
): {
  git: GitFactsInput;
  ci: { state: 'passing' | 'failing' | 'pending' | 'unknown'; checks: CiObservation[] };
} {
  let state: 'passing' | 'failing' | 'pending' | 'unknown' = 'unknown';
  if (checks.some((check) => check.state === 'failing')) state = 'failing';
  else if (checks.some((check) => check.state === 'pending')) state = 'pending';
  else if (checks.length && checks.every((check) => check.state === 'passing')) state = 'passing';
  return { git: structuredClone(git), ci: { state, checks: structuredClone(checks) } };
}

export function evaluateRuntimeServiceHealth(input: {
  pid: number | null;
  live: boolean | null;
  ready: boolean | null;
  journalErrors: number | null;
  observedAt: string;
}): { state: 'healthy' | 'degraded' | 'unknown'; reasons: string[]; observedAt: string } {
  const reasons: string[] = [];
  if (!input.pid || !Number.isInteger(input.pid) || input.pid < 1) reasons.push('pid-missing');
  if (input.live === null) reasons.push('liveness-unknown');
  else if (!input.live) reasons.push('liveness-failed');
  if (input.ready === null) reasons.push('readiness-unknown');
  else if (!input.ready) reasons.push('readiness-failed');
  if (input.journalErrors === null) reasons.push('journal-unknown');
  else if (input.journalErrors > 0) reasons.push('journal-errors');
  if (!Number.isFinite(Date.parse(input.observedAt))) reasons.push('timestamp-invalid');
  const unknown = reasons.some(
    (reason) =>
      reason.endsWith('unknown') || reason.includes('missing') || reason.includes('timestamp'),
  );
  return {
    state: !reasons.length ? 'healthy' : unknown ? 'unknown' : 'degraded',
    reasons,
    observedAt: input.observedAt,
  };
}

export type HealthLayer =
  'liveness' | 'readiness' | 'semantic-canary' | 'durability' | 'dependency' | 'user-path';

export function evaluateLayeredHealth(
  observations: Array<{
    layer: HealthLayer;
    status: 'pass' | 'fail' | 'unknown';
    evidenceHandle: string;
    observedAt: string;
  }>,
): {
  state: 'healthy' | 'degraded' | 'unknown';
  layers: Record<HealthLayer, 'pass' | 'fail' | 'unknown'>;
  evidenceHandles: string[];
} {
  const required: HealthLayer[] = [
    'liveness',
    'readiness',
    'semantic-canary',
    'durability',
    'dependency',
    'user-path',
  ];
  const layers = Object.fromEntries(required.map((layer) => [layer, 'unknown'])) as Record<
    HealthLayer,
    'pass' | 'fail' | 'unknown'
  >;
  for (const observation of observations) {
    if (
      !Number.isFinite(Date.parse(observation.observedAt)) ||
      !observation.evidenceHandle.trim()
    ) {
      throw new Error('layered-health-evidence-invalid');
    }
    layers[observation.layer] = observation.status;
  }
  const values = Object.values(layers);
  return {
    state: values.includes('fail')
      ? 'degraded'
      : values.includes('unknown')
        ? 'unknown'
        : 'healthy',
    layers,
    evidenceHandles: [...new Set(observations.map((entry) => entry.evidenceHandle))].sort(),
  };
}

export function evaluateServiceSlo(
  sample: {
    goodEvents: number;
    totalEvents: number;
    errorBudgetRemaining: number;
    burnRate: number;
    observedAt: string;
    evidenceHandle: string;
  },
  policy: { target: number; maxBurnRate: number },
): {
  attainment: number | null;
  state: 'passing' | 'breached' | 'unknown';
  reasons: string[];
} {
  if (
    !Number.isFinite(Date.parse(sample.observedAt)) ||
    !sample.evidenceHandle.trim() ||
    !Number.isInteger(sample.goodEvents) ||
    !Number.isInteger(sample.totalEvents) ||
    sample.goodEvents < 0 ||
    sample.totalEvents < 0 ||
    sample.goodEvents > sample.totalEvents
  ) {
    return { attainment: null, state: 'unknown', reasons: ['slo-evidence-invalid'] };
  }
  if (sample.totalEvents === 0) {
    return { attainment: null, state: 'unknown', reasons: ['slo-no-events'] };
  }
  const attainment = sample.goodEvents / sample.totalEvents;
  const reasons: string[] = [];
  if (attainment < policy.target) reasons.push('slo-target-missed');
  if (sample.errorBudgetRemaining < 0) reasons.push('error-budget-exhausted');
  if (sample.burnRate > policy.maxBurnRate) reasons.push('burn-rate-high');
  return { attainment, state: reasons.length ? 'breached' : 'passing', reasons };
}

export function evaluateUserPathProbe(
  pathId: string,
  steps: Array<{
    nodeId: string;
    semanticOutcome: boolean | null;
    durable: boolean | null;
    evidenceHandle: string;
  }>,
): {
  pathId: string;
  state: 'passed' | 'failed' | 'unknown';
  failedNodeIds: string[];
  evidenceHandles: string[];
} {
  if (!pathId.trim() || !steps.length || steps.some((step) => !step.evidenceHandle.trim())) {
    throw new Error('user-path-probe-invalid');
  }
  const failedNodeIds = steps
    .filter((step) => step.semanticOutcome === false || step.durable === false)
    .map((step) => step.nodeId);
  const unknown = steps.some((step) => step.semanticOutcome === null || step.durable === null);
  return {
    pathId,
    state: failedNodeIds.length ? 'failed' : unknown ? 'unknown' : 'passed',
    failedNodeIds,
    evidenceHandles: [...new Set(steps.map((step) => step.evidenceHandle))].sort(),
  };
}

export function detectDependencyDrift(
  expected: Record<string, string>,
  observed: Record<string, string>,
): Array<{
  packageName: string;
  expected: string | null;
  observed: string | null;
  state: 'missing' | 'unexpected' | 'changed';
}> {
  return [...new Set([...Object.keys(expected), ...Object.keys(observed)])]
    .sort()
    .flatMap((packageName) => {
      const wanted = expected[packageName] ?? null;
      const actual = observed[packageName] ?? null;
      if (wanted === actual) return [];
      return [
        {
          packageName,
          expected: wanted,
          observed: actual,
          state:
            wanted === null
              ? ('unexpected' as const)
              : actual === null
                ? ('missing' as const)
                : ('changed' as const),
        },
      ];
    });
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  parentRunId: string | null;
  state: 'queued' | 'running' | 'succeeded' | 'failed' | 'cancelled';
  startedAt: string;
  finishedAt: string | null;
}

export function buildWorkflowExecutionGraph(runs: WorkflowRun[]): {
  nodes: WorkflowRun[];
  edges: Array<{ source: string; target: string }>;
  orphanRunIds: string[];
} {
  const ids = new Set(runs.map((run) => run.id));
  if (ids.size !== runs.length) throw new Error('duplicate-workflow-run-id');
  const edges: Array<{ source: string; target: string }> = [];
  const orphanRunIds: string[] = [];
  for (const run of runs) {
    if (!Number.isFinite(Date.parse(run.startedAt)))
      throw new Error('workflow-run-timestamp-invalid');
    if (!run.parentRunId) continue;
    if (ids.has(run.parentRunId)) edges.push({ source: run.parentRunId, target: run.id });
    else orphanRunIds.push(run.id);
  }
  return {
    nodes: structuredClone(runs).sort((left, right) => left.id.localeCompare(right.id)),
    edges: edges.sort(
      (left, right) =>
        left.source.localeCompare(right.source) || left.target.localeCompare(right.target),
    ),
    orphanRunIds: orphanRunIds.sort(),
  };
}

export function collectSupportedExternalStatus(
  providerId: string,
  observation: {
    state: 'operational' | 'degraded' | 'outage';
    observedAt: string;
    evidenceHandle: string;
  },
  allowlist: string[],
): {
  providerId: string;
  state: 'operational' | 'degraded' | 'outage';
  observedAt: string;
  evidenceHandle: string;
  authority: 'observed';
} {
  if (!allowlist.includes(providerId)) throw new Error('external-provider-unsupported');
  if (!Number.isFinite(Date.parse(observation.observedAt)) || !observation.evidenceHandle.trim()) {
    throw new Error('external-provider-evidence-invalid');
  }
  return { providerId, ...structuredClone(observation), authority: 'observed' };
}

export function unsupportedProviderState(
  providerId: string,
  reason: string,
): {
  providerId: string;
  state: 'unknown';
  reason: string;
  authority: 'unknown';
} {
  if (!providerId.trim() || !reason.trim()) throw new Error('unsupported-provider-invalid');
  return { providerId, state: 'unknown', reason, authority: 'unknown' };
}

export interface OperationalSignal {
  sourceId: string;
  kind: 'collection-failure' | 'stale-evidence' | 'incident';
  timestamp: string;
  evidenceHandle: string;
}

export function correlateOperationalSignals(
  signals: OperationalSignal[],
  windowMs: number,
): Array<{
  sourceId: string;
  kinds: OperationalSignal['kind'][];
  evidenceHandles: string[];
  confidence: 'medium' | 'high';
}> {
  const bySource = new Map<string, OperationalSignal[]>();
  for (const signal of signals) {
    if (!Number.isFinite(Date.parse(signal.timestamp)) || !signal.evidenceHandle.trim()) {
      throw new Error('operational-signal-invalid');
    }
    (bySource.get(signal.sourceId) ?? bySource.set(signal.sourceId, []).get(signal.sourceId)!).push(
      signal,
    );
  }
  const correlations = [];
  for (const [sourceId, entries] of bySource) {
    const ordered = [...entries].sort(
      (left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp),
    );
    const span = Date.parse(ordered.at(-1)!.timestamp) - Date.parse(ordered[0]!.timestamp);
    const kinds = [...new Set(ordered.map((entry) => entry.kind))].sort();
    if (span > windowMs || kinds.length < 2) continue;
    correlations.push({
      sourceId,
      kinds,
      evidenceHandles: [...new Set(ordered.map((entry) => entry.evidenceHandle))].sort(),
      confidence: kinds.length === 3 ? ('high' as const) : ('medium' as const),
    });
  }
  return correlations.sort((left, right) => left.sourceId.localeCompare(right.sourceId));
}
