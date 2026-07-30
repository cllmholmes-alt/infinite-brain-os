import { EvidenceEnvelope } from '../schema/types';
import { deriveTruthState } from '../evidence/truth';
import { digestCanonical } from '../security/integrity';
export { deriveTruthState } from '../evidence/truth';

export type TruthState = 'fresh' | 'aging' | 'stale' | 'unknown' | 'unavailable' | 'conflict';

export interface FactRecord<T = unknown> {
  value: T;
  evidence: EvidenceEnvelope;
}

export type FactSet<T = unknown> = FactRecord<T> | FactRecord<T>[];

function asArray<T>(values: FactSet<T>): FactRecord<T>[] {
  return Array.isArray(values) ? values : [values];
}

export function combineTruthStates(states: readonly TruthState[]): TruthState {
  if (states.length === 0) return 'unknown';
  const precedence: TruthState[] = [
    'conflict',
    'unavailable',
    'unknown',
    'stale',
    'aging',
    'fresh',
  ];
  return precedence.find((state) => states.includes(state)) ?? 'unknown';
}

export function resolveAuthoritativeFact<T>(facts: FactRecord<T>[]): FactRecord<T> | null {
  const authorityRank: Record<EvidenceEnvelope['authority'], number> = {
    observed: 4,
    declared: 3,
    derived: 2,
    unknown: 0,
  };
  const confidenceRank: Record<EvidenceEnvelope['confidence'], number> = {
    high: 4,
    medium: 3,
    low: 2,
    unknown: 0,
  };
  const ordered = structuredClone(facts).sort(
    (left, right) =>
      authorityRank[right.evidence.authority] - authorityRank[left.evidence.authority] ||
      confidenceRank[right.evidence.confidence] - confidenceRank[left.evidence.confidence] ||
      Date.parse(right.evidence.observedAt ?? '') - Date.parse(left.evidence.observedAt ?? '') ||
      left.evidence.sourceId.localeCompare(right.evidence.sourceId),
  );
  return ordered[0] ?? null;
}

export function buildConflictAwareState<T>(facts: FactRecord<T>[]): {
  state: TruthState;
  candidates: FactRecord<T>[];
  resolved: FactRecord<T> | null;
} {
  const values = structuredClone(facts);
  if (values.length <= 1) {
    const state = deriveTruthState(
      values[0]?.evidence ?? {
        observedAt: null,
        expiresAt: null,
        authority: 'unknown',
        sourceId: 'unknown',
        collectedAt: new Date().toISOString(),
        method: 'derived',
        confidence: 'unknown',
        collectorVersion: '0.0.0',
        environment: 'unknown',
        evidenceHandle: 'generated',
      },
      Date.now(),
    ).state;
    return { state, candidates: values, resolved: values[0] ?? null };
  }

  const signatures = new Set<string>();
  for (const entry of values) {
    signatures.add(digestCanonical(entry.value));
  }

  const states = values.map((entry) => deriveTruthState(entry.evidence, Date.now()).state);
  const merged = combineTruthStates(states);

  if (signatures.size > 1 && merged !== 'conflict') {
    return { state: 'conflict', candidates: values, resolved: null };
  }

  return { state: merged, candidates: values, resolved: resolveAuthoritativeFact(values) };
}

export function deriveTruthStateFromFacts(
  facts: Record<string, FactSet<unknown>> | undefined,
): TruthState {
  if (!facts || Object.keys(facts).length === 0) {
    return 'unknown';
  }

  const factStates = Object.values(facts).map((fact) => {
    const entries = asArray(fact);
    if (entries.length === 0) {
      return 'unknown';
    }

    if (entries.length === 1) {
      const entry = entries[0];
      if (!entry) return 'unknown';
      return deriveTruthState(entry.evidence, Date.now()).state;
    }

    return buildConflictAwareState(entries).state;
  });

  return combineTruthStates(factStates);
}

export function buildRuntimeTruthState(facts: Record<string, FactSet<unknown>>): TruthState {
  return deriveTruthStateFromFacts(facts);
}

export function buildRuntimeTruthSummary(
  graph: { facts?: Record<string, unknown> },
  selectedNodeId: string,
): string {
  if (!graph.facts || selectedNodeId === 'global') {
    return 'no global facts';
  }

  const keys = Object.keys(graph.facts).length;
  return `facts ${keys}`;
}
