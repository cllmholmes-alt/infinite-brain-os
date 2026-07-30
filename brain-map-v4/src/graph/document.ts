import type {
  EdgeRecord,
  GraphDocument,
  NodeRecord,
  ObservableEvent,
  SourceRecord,
} from '../schema/types';
import { digestCanonical } from '../security/integrity';
import { validateGraphDocument } from '../security/validate';

export function canonicalizeGraph(graph: GraphDocument): GraphDocument {
  validateGraphDocument(graph);
  const canonical = structuredClone(graph);
  canonical.nodes.sort((left, right) => left.id.localeCompare(right.id));
  canonical.edges.sort((left, right) => left.id.localeCompare(right.id));
  canonical.sources.sort((left, right) => left.id.localeCompare(right.id));
  canonical.clusters = canonical.clusters
    .map((cluster) => ({ ...cluster, nodeIds: [...cluster.nodeIds].sort() }))
    .sort((left, right) => left.id.localeCompare(right.id));
  return canonical;
}

export function graphHash(graph: GraphDocument): string {
  return `g-sha256-${digestCanonical(canonicalizeGraph(graph))}`;
}

export function emptyGraph(
  sourceRecords: SourceRecord[] = [],
  generatedAt = new Date().toISOString(),
): GraphDocument {
  return {
    schemaVersion: '4.0.0',
    generatedAt,
    nodes: [],
    edges: [],
    clusters: [],
    sources: structuredClone(sourceRecords),
    health: {},
    facts: {},
  };
}

export function upsertNode(graph: GraphDocument, node: NodeRecord): GraphDocument {
  const next = canonicalizeGraph(graph);
  const index = next.nodes.findIndex((entry) => entry.id === node.id);
  if (index >= 0) next.nodes[index] = structuredClone(node);
  else next.nodes.push(structuredClone(node));
  next.generatedAt = new Date().toISOString();
  return canonicalizeGraph(next);
}

export function upsertEdge(graph: GraphDocument, edge: EdgeRecord): GraphDocument {
  const next = canonicalizeGraph(graph);
  const index = next.edges.findIndex((entry) => entry.id === edge.id);
  if (index >= 0) next.edges[index] = structuredClone(edge);
  else next.edges.push(structuredClone(edge));
  next.generatedAt = new Date().toISOString();
  return canonicalizeGraph(next);
}

export function removeEdge(graph: GraphDocument, edgeId: string): GraphDocument {
  const next = canonicalizeGraph(graph);
  next.edges = next.edges.filter((edge) => edge.id !== edgeId);
  next.generatedAt = new Date().toISOString();
  return canonicalizeGraph(next);
}

export function projectEvent(event: ObservableEvent, graph: GraphDocument): GraphDocument {
  const next = canonicalizeGraph(graph);
  if (event.type !== 'graph-edit' || !event.data) return next;

  const data = event.data as {
    action?: 'upsert-node' | 'remove-node' | 'upsert-edge' | 'remove-edge';
    node?: NodeRecord;
    edge?: EdgeRecord;
    nodeId?: string;
    edgeId?: string;
  };
  let projected = next;
  if (data.action === 'upsert-node' && data.node) projected = upsertNode(next, data.node);
  else if (data.action === 'upsert-edge' && data.edge) projected = upsertEdge(next, data.edge);
  else if (data.action === 'remove-edge' && data.edgeId) projected = removeEdge(next, data.edgeId);
  else if (data.action === 'remove-node' && data.nodeId) {
    projected.nodes = projected.nodes.filter((node) => node.id !== data.nodeId);
    projected.edges = projected.edges.filter(
      (edge) => edge.source !== data.nodeId && edge.target !== data.nodeId,
    );
    projected.clusters = projected.clusters.map((cluster) => ({
      ...cluster,
      nodeIds: cluster.nodeIds.filter((nodeId) => nodeId !== data.nodeId),
    }));
  }
  projected.generatedAt = event.timestamp;
  return canonicalizeGraph(projected);
}
