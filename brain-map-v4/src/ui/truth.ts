import { EvidenceEnvelope } from '../schema/types';
import { deriveTruthState } from '../evidence/truth';
import { combineTruthStates } from '../domain/truth';

export type TruthState = 'fresh' | 'aging' | 'stale' | 'unknown' | 'unavailable' | 'conflict';

export function buildRuntimeTruthState(
  facts: Record<string, { value: unknown; evidence: EvidenceEnvelope }>,
  now = Date.now(),
): TruthState {
  const values = Object.values(facts);
  if (values.length === 0) {
    return 'unknown';
  }

  const states = values.map((fact) => deriveTruthState(fact.evidence, now).state);
  return combineTruthStates(states);
}

export function buildRuntimeTruthSummary(
  graph: { facts?: Record<string, { value: unknown; evidence: EvidenceEnvelope }> },
  selectedNodeId: string,
): string {
  if (!graph.facts || selectedNodeId === 'global') {
    return 'no global facts';
  }

  return `facts ${Object.keys(graph.facts).length}`;
}
