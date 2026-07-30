import type { RuntimeState, GraphDocument } from '../schema/types';
import { diffSnapshots } from '../events/diff';

export function buildOperationalBriefing(
  before: GraphDocument,
  after: GraphDocument,
  runtime: RuntimeState,
): {
  generatedAt: string;
  summary: string;
  changes: string[];
  unresolvedTruth: string[];
  evidenceAt: string[];
} {
  const diff = diffSnapshots(before, after);
  const afterById = new Map(after.nodes.map((node) => [node.id, node]));
  const changes = [
    ...diff.nodesAdded.map((id) => `Entity added: ${afterById.get(id)?.name ?? id}.`),
    ...diff.nodesRemoved.map((id) => `Entity removed: ${id}.`),
    ...diff.nodesChanged.map(
      (id) => `Ownership or facts changed for ${afterById.get(id)?.name ?? id}.`,
    ),
    ...diff.edgesAdded.map((id) => `Relationship added: ${id}.`),
    ...diff.edgesRemoved.map((id) => `Relationship removed: ${id}.`),
    ...diff.healthChanged.map((id) => `Health evidence changed: ${id}.`),
  ];
  const unresolvedTruth = [
    ...runtime.conflictItems.map((id) => `conflict:${id}`),
    ...runtime.unavailableItems.map((id) => `unavailable:${id}`),
    ...runtime.unknownItems.map((id) => `unknown:${id}`),
    ...runtime.staleItems.map((id) => `stale:${id}`),
  ];
  return {
    generatedAt: after.generatedAt,
    summary: changes.length
      ? `${changes.length} evidence-bound changes.`
      : 'No evidence-bound changes.',
    changes,
    unresolvedTruth,
    evidenceAt: [...new Set([before.generatedAt, after.generatedAt])].sort(),
  };
}
