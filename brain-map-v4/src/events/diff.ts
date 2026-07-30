import type { GraphDocument } from '../schema/types';
import { canonicalizeGraph } from '../graph/document';
import { digestCanonical } from '../security/integrity';

export interface SnapshotDiff {
  nodesAdded: string[];
  nodesRemoved: string[];
  nodesChanged: string[];
  edgesAdded: string[];
  edgesRemoved: string[];
  edgesChanged: string[];
  healthChanged: string[];
  sourcesChanged: string[];
  clustersChanged: string[];
  factsChanged: string[];
  runtimeFactsChanged: string[];
  schemaChanged: boolean;
  generatedAtChanged: boolean;
}

function changedMapKeys(before: Record<string, unknown>, after: Record<string, unknown>): string[] {
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  return [...keys]
    .filter((key) => digestCanonical(before[key]) !== digestCanonical(after[key]))
    .sort();
}

function changedArrayIds(
  before: Array<{ id: string }>,
  after: Array<{ id: string }>,
): { added: string[]; removed: string[]; changed: string[] } {
  const beforeMap = new Map(before.map((entry) => [entry.id, entry]));
  const afterMap = new Map(after.map((entry) => [entry.id, entry]));
  const added = [...afterMap.keys()].filter((id) => !beforeMap.has(id)).sort();
  const removed = [...beforeMap.keys()].filter((id) => !afterMap.has(id)).sort();
  const changed = [...afterMap.keys()]
    .filter((id) => {
      const previous = beforeMap.get(id);
      return previous && digestCanonical(previous) !== digestCanonical(afterMap.get(id));
    })
    .sort();
  return { added, removed, changed };
}

export function diffSnapshots(before: GraphDocument, after: GraphDocument): SnapshotDiff {
  const canonicalBefore = canonicalizeGraph(before);
  const canonicalAfter = canonicalizeGraph(after);
  const nodes = changedArrayIds(canonicalBefore.nodes, canonicalAfter.nodes);
  const edges = changedArrayIds(canonicalBefore.edges, canonicalAfter.edges);
  const sourceDiff = changedArrayIds(canonicalBefore.sources, canonicalAfter.sources);
  const clusterDiff = changedArrayIds(canonicalBefore.clusters, canonicalAfter.clusters);

  return {
    nodesAdded: nodes.added,
    nodesRemoved: nodes.removed,
    nodesChanged: nodes.changed,
    edgesAdded: edges.added,
    edgesRemoved: edges.removed,
    edgesChanged: edges.changed,
    healthChanged: changedMapKeys(canonicalBefore.health, canonicalAfter.health),
    sourcesChanged: [...sourceDiff.added, ...sourceDiff.removed, ...sourceDiff.changed].sort(),
    clustersChanged: [...clusterDiff.added, ...clusterDiff.removed, ...clusterDiff.changed].sort(),
    factsChanged: changedMapKeys(canonicalBefore.facts, canonicalAfter.facts),
    runtimeFactsChanged: changedMapKeys(
      canonicalBefore.runtimeFacts ?? {},
      canonicalAfter.runtimeFacts ?? {},
    ),
    schemaChanged:
      canonicalBefore.schemaVersion !== canonicalAfter.schemaVersion ||
      canonicalBefore.manifestVersion !== canonicalAfter.manifestVersion,
    generatedAtChanged: canonicalBefore.generatedAt !== canonicalAfter.generatedAt,
  };
}
