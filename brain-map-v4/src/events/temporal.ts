import type { GraphDocument, LifecycleState, RuntimeState } from '../schema/types';
import { redactGraph } from '../export/redaction';
import { digestCanonical } from '../security/integrity';
import { isSafeCollectorPayload } from '../security/sanitize';

export interface RawObservation {
  id: string;
  sourceId: string;
  observedAt: string;
  evidenceHandle: string;
  payload: unknown;
}

export class ObservationLog {
  private observations: RawObservation[] = [];

  append(observation: RawObservation): void {
    if (this.observations.some((entry) => entry.id === observation.id)) {
      throw new Error('duplicate-observation-id');
    }
    if (
      !observation.id.trim() ||
      !observation.sourceId.trim() ||
      !observation.evidenceHandle.trim() ||
      !Number.isFinite(Date.parse(observation.observedAt)) ||
      !isSafeCollectorPayload(observation.payload)
    ) {
      throw new Error('observation-invalid');
    }
    this.observations.push(structuredClone(observation));
  }

  list(): RawObservation[] {
    return structuredClone(this.observations).sort(
      (left, right) =>
        Date.parse(left.observedAt) - Date.parse(right.observedAt) ||
        left.id.localeCompare(right.id),
    );
  }
}

export interface LifecycleTransition {
  entityId: string;
  from: LifecycleState;
  to: LifecycleState;
  timestamp: string;
  actorId: string;
  evidenceHandle: string;
}

const TRANSITIONS: Record<LifecycleState, LifecycleState[]> = {
  proposed: ['experimental', 'active', 'archived'],
  experimental: ['active', 'degraded', 'deprecated', 'archived'],
  active: ['degraded', 'deprecated', 'retired'],
  degraded: ['active', 'deprecated', 'retired'],
  deprecated: ['retired', 'archived'],
  retired: ['archived'],
  archived: [],
};

export function validateLifecycleTransition(
  transition: LifecycleTransition,
): { valid: true } | { valid: false; reason: string } {
  if (
    !transition.entityId.trim() ||
    !transition.actorId.trim() ||
    !transition.evidenceHandle.trim() ||
    !Number.isFinite(Date.parse(transition.timestamp))
  ) {
    return { valid: false, reason: 'transition-attribution-invalid' };
  }
  if (!TRANSITIONS[transition.from].includes(transition.to)) {
    return { valid: false, reason: 'transition-not-allowed' };
  }
  return { valid: true };
}

export interface TemporalSnapshot {
  createdAt: string;
  graph: GraphDocument;
  runtime: RuntimeState;
  hash: string;
}

export class SnapshotStore {
  private snapshots: TemporalSnapshot[] = [];

  constructor(private policy: { maxSnapshots: number; maxAgeMs: number }) {
    if (policy.maxSnapshots < 1 || policy.maxAgeMs < 0) throw new Error('snapshot-policy-invalid');
  }

  capture(graph: GraphDocument, runtime: RuntimeState, createdAt: string): TemporalSnapshot {
    const now = Date.parse(createdAt);
    if (!Number.isFinite(now)) throw new Error('snapshot-timestamp-invalid');
    const body = {
      createdAt,
      graph: structuredClone(graph),
      runtime: structuredClone(runtime),
    };
    const snapshot = { ...body, hash: `sha256-${digestCanonical(body)}` };
    this.snapshots.push(snapshot);
    this.snapshots = this.snapshots
      .filter((entry) => now - Date.parse(entry.createdAt) <= this.policy.maxAgeMs)
      .sort(
        (left, right) =>
          Date.parse(left.createdAt) - Date.parse(right.createdAt) ||
          left.hash.localeCompare(right.hash),
      )
      .slice(-this.policy.maxSnapshots);
    return structuredClone(snapshot);
  }

  list(): TemporalSnapshot[] {
    return structuredClone(this.snapshots);
  }

  at(timestamp: string): TemporalSnapshot | null {
    const target = Date.parse(timestamp);
    if (!Number.isFinite(target)) throw new Error('time-travel-timestamp-invalid');
    const snapshot = [...this.snapshots]
      .filter((entry) => Date.parse(entry.createdAt) <= target)
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))[0];
    return snapshot ? structuredClone(snapshot) : null;
  }
}

export interface ReleaseTopologyView {
  releaseId: string;
  capturedAt: string;
  graph: GraphDocument;
  runtime: RuntimeState;
  evidenceHandles: string[];
  hash: string;
}

export function createReleaseTopologyView(input: {
  releaseId: string;
  capturedAt: string;
  graph: GraphDocument;
  runtime: RuntimeState;
  evidenceHandles: string[];
}): ReleaseTopologyView {
  if (!input.releaseId.trim() || !Number.isFinite(Date.parse(input.capturedAt))) {
    throw new Error('release-topology-identity-invalid');
  }
  const evidenceHandles = [...new Set(input.evidenceHandles)].sort();
  if (!evidenceHandles.length || evidenceHandles.some((handle) => !handle.trim())) {
    throw new Error('release-topology-evidence-required');
  }
  const payload = {
    releaseId: input.releaseId,
    capturedAt: input.capturedAt,
    graph: structuredClone(input.graph),
    runtime: structuredClone(input.runtime),
    evidenceHandles,
  };
  return { ...payload, hash: `sha256-${digestCanonical(payload)}` };
}

export function exportEvidenceBoundHistory(
  view: ReleaseTopologyView,
  policy: 'public' | 'internal' | 'confidential',
): {
  releaseId: string;
  capturedAt: string;
  policy: string;
  sourceManifest: string[];
  graph: GraphDocument;
  hash: string;
} {
  const graph = redactGraph(view.graph, policy);
  const payload = {
    releaseId: view.releaseId,
    capturedAt: view.capturedAt,
    policy,
    sourceManifest: [...view.evidenceHandles],
    graph,
  };
  return { ...payload, hash: `sha256-${digestCanonical(payload)}` };
}

export interface PlaybackEvent {
  id: string;
  timestamp: string;
  kind: string;
  evidenceHandle: string;
}

export function buildIncidentPlayback(
  events: PlaybackEvent[],
  from: string,
  to: string,
): PlaybackEvent[] {
  const start = Date.parse(from);
  const end = Date.parse(to);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    throw new Error('playback-window-invalid');
  }
  return structuredClone(events)
    .filter((event) => {
      const timestamp = Date.parse(event.timestamp);
      if (!Number.isFinite(timestamp) || !event.evidenceHandle.trim()) {
        throw new Error('playback-event-invalid');
      }
      return timestamp >= start && timestamp <= end;
    })
    .sort(
      (left, right) =>
        Date.parse(left.timestamp) - Date.parse(right.timestamp) || left.id.localeCompare(right.id),
    );
}

export interface DeterministicCommand {
  id: string;
  revision: string;
  inputHash: string;
  seed: number;
  parameters: Record<string, unknown>;
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nested]) => [key, normalize(nested)]),
  );
}

export class DeterministicCommandExecutor {
  run<T>(
    command: DeterministicCommand,
    currentRevision: string,
    currentInputHash: string,
    execute: (input: DeterministicCommand) => T,
  ): { commandId: string; output: T; outputHash: string } {
    if (command.revision !== currentRevision) throw new Error('command-revision-stale');
    if (command.inputHash !== currentInputHash) throw new Error('command-input-stale');
    if (!Number.isInteger(command.seed) || !isSafeCollectorPayload(command.parameters)) {
      throw new Error('command-input-invalid');
    }
    const normalized = {
      ...structuredClone(command),
      parameters: normalize(command.parameters) as Record<string, unknown>,
    };
    const output = execute(structuredClone(normalized));
    if (!isSafeCollectorPayload(output)) throw new Error('command-output-invalid');
    return {
      commandId: command.id,
      output: structuredClone(output),
      outputHash: `sha256-${digestCanonical({
        revision: command.revision,
        inputHash: command.inputHash,
        seed: command.seed,
        parameters: normalized.parameters,
        output,
      })}`,
    };
  }
}

export interface CollectionBudgetInput {
  sourceId: string;
  risk: number;
  consecutiveFailures: number;
  cost: number;
}

export function allocateCollectionBudget(
  sources: CollectionBudgetInput[],
  totalBudget: number,
): Array<{ sourceId: string; budget: number }> {
  if (!Number.isInteger(totalBudget) || totalBudget < 0)
    throw new Error('collection-budget-invalid');
  if (!sources.length) return [];
  const weighted = sources.map((source) => {
    if (
      !source.sourceId.trim() ||
      !Number.isFinite(source.risk) ||
      !Number.isInteger(source.consecutiveFailures) ||
      !Number.isFinite(source.cost) ||
      source.cost <= 0
    ) {
      throw new Error('collection-budget-source-invalid');
    }
    return {
      sourceId: source.sourceId,
      weight: (Math.max(0, source.risk) + source.consecutiveFailures * 0.25 + 0.01) / source.cost,
    };
  });
  const totalWeight = weighted.reduce((sum, source) => sum + source.weight, 0);
  const rows = weighted.map((source) => {
    const exact = (source.weight / totalWeight) * totalBudget;
    return { sourceId: source.sourceId, budget: Math.floor(exact), remainder: exact % 1 };
  });
  let remaining = totalBudget - rows.reduce((sum, row) => sum + row.budget, 0);
  for (const row of [...rows].sort(
    (left, right) =>
      right.remainder - left.remainder || left.sourceId.localeCompare(right.sourceId),
  )) {
    if (remaining-- <= 0) break;
    row.budget += 1;
  }
  return rows
    .map(({ sourceId, budget }) => ({ sourceId, budget }))
    .sort(
      (left, right) => right.budget - left.budget || left.sourceId.localeCompare(right.sourceId),
    );
}

export function chooseDegradationMode(input: {
  nodes: number;
  edges: number;
  memoryPressure: number;
}): { mode: 'full' | 'aggregate' | 'list'; retainedTruth: true; reasons: string[] } {
  const reasons: string[] = [];
  if (input.nodes > 5_000) reasons.push('node-pressure');
  if (input.edges > 20_000) reasons.push('edge-pressure');
  if (input.memoryPressure > 0.9) reasons.push('memory-pressure-critical');
  else if (input.memoryPressure > 0.75) reasons.push('memory-pressure');
  return {
    mode:
      input.memoryPressure > 0.9 || input.nodes > 8_000 || input.edges > 30_000
        ? 'list'
        : reasons.length
          ? 'aggregate'
          : 'full',
    retainedTruth: true,
    reasons,
  };
}

export class CollectorTrace {
  private finished: {
    status: 'success' | 'error' | 'unavailable';
    finishedAt: string;
    evidenceHandle: string;
    error?: string;
  } | null = null;

  constructor(
    private id: string,
    private sourceId: string,
    private startedAt: string,
  ) {
    if (!id.trim() || !sourceId.trim() || !Number.isFinite(Date.parse(startedAt))) {
      throw new Error('collector-trace-invalid');
    }
  }

  finish(
    status: 'success' | 'error' | 'unavailable',
    finishedAt: string,
    evidenceHandle: string,
    error?: string,
  ): void {
    if (this.finished) throw new Error('collector-trace-already-finished');
    if (
      !Number.isFinite(Date.parse(finishedAt)) ||
      Date.parse(finishedAt) < Date.parse(this.startedAt) ||
      !evidenceHandle.trim() ||
      (status !== 'success' && !error?.trim())
    ) {
      throw new Error('collector-trace-finish-invalid');
    }
    this.finished = { status, finishedAt, evidenceHandle, ...(error ? { error } : {}) };
  }

  snapshot() {
    if (!this.finished) {
      return {
        id: this.id,
        sourceId: this.sourceId,
        startedAt: this.startedAt,
        status: 'running' as const,
      };
    }
    return {
      id: this.id,
      sourceId: this.sourceId,
      startedAt: this.startedAt,
      ...structuredClone(this.finished),
      durationMs: Date.parse(this.finished.finishedAt) - Date.parse(this.startedAt),
    };
  }
}
