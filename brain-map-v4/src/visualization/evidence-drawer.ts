import type { GraphDocument } from '../schema/types';

export function buildEvidenceDrawerModel(
  graph: GraphDocument,
  nodeId: string,
): {
  anchorNodeId: string;
  records: Array<{
    field: string;
    value: unknown;
    sourceId: string;
    sourceLabel: string;
    observedAt: string | null;
    evidenceHandle: string;
    confidence: string;
  }>;
} {
  const node = graph.nodes.find((entry) => entry.id === nodeId);
  if (!node) throw new Error('evidence-drawer-node-not-found');
  const sources = new Map(graph.sources.map((source) => [source.id, source]));
  const records = Object.entries(node.facts).flatMap(([field, factSet]) =>
    (Array.isArray(factSet) ? factSet : [factSet]).map((fact) => ({
      field,
      value: structuredClone(fact.value),
      sourceId: fact.evidence.sourceId,
      sourceLabel: sources.get(fact.evidence.sourceId)?.label ?? 'Unknown source',
      observedAt: fact.evidence.observedAt,
      evidenceHandle: fact.evidence.evidenceHandle,
      confidence: fact.evidence.confidence,
    })),
  );
  records.sort(
    (left, right) =>
      left.field.localeCompare(right.field) ||
      left.sourceId.localeCompare(right.sourceId) ||
      left.evidenceHandle.localeCompare(right.evidenceHandle),
  );
  return { anchorNodeId: nodeId, records };
}
