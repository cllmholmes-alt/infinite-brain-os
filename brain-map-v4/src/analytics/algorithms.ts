import { EdgeRecord, FreshnessState, GraphDocument, NodeRecord } from '../schema/types';
import { buildRuntimeTruthState } from '../domain/truth';

export interface GraphAnalysisResult {
  articulationPoints: string[];
  bridges: string[];
  redundancyScore: number;
  sccCount: number;
  weaklyConnectedComponents: string[][];
}

export interface BottleneckEdge {
  edgeId: string;
  source: string;
  target: string;
  impact: number;
  confidence: number;
}

function ids(graph: GraphDocument): string[] {
  return graph.nodes.map((node) => node.id).sort();
}

function uniqueSorted(values: Iterable<string>): string[] {
  return [...new Set(values)].sort();
}

function undirected(graph: GraphDocument, omittedEdgeId?: string): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>(ids(graph).map((id) => [id, new Set<string>()]));
  for (const edge of graph.edges) {
    if (edge.id === omittedEdgeId) continue;
    map.get(edge.source)?.add(edge.target);
    map.get(edge.target)?.add(edge.source);
  }
  return map;
}

function directed(graph: GraphDocument, omittedEdgeId?: string): Map<string, string[]> {
  const map = new Map<string, string[]>(ids(graph).map((id) => [id, []]));
  for (const edge of [...graph.edges].sort((a, b) => a.id.localeCompare(b.id))) {
    if (edge.id === omittedEdgeId) continue;
    const both = edge.isDirected === false || edge.direction === 'bidirectional';
    const from = edge.direction === 'inbound' ? edge.target : edge.source;
    const to = edge.direction === 'inbound' ? edge.source : edge.target;
    map.get(from)?.push(to);
    if (both) map.get(to)?.push(from);
  }
  for (const neighbors of map.values()) neighbors.sort();
  return map;
}

const TARGET_FAILURE_AFFECTS_SOURCE = new Set([
  'calls',
  'imports',
  'authenticates-through',
  'stores-in',
  'reads',
  'searches',
  'fallback',
  'token-proxy',
  'tokens',
  'inference',
]);
const SOURCE_FAILURE_AFFECTS_TARGET = new Set([
  'hosts',
  'proxy',
  'routes',
  'blocks',
  'feeds',
  'lead-flow',
]);
const PROPAGATING_LIFECYCLES = new Set(['experimental', 'active', 'degraded']);

function failureArcs(edge: EdgeRecord): [string, string][] {
  if (!PROPAGATING_LIFECYCLES.has(edge.lifecycle)) return [];
  const propagates =
    TARGET_FAILURE_AFFECTS_SOURCE.has(edge.relation) ||
    SOURCE_FAILURE_AFFECTS_TARGET.has(edge.relation);
  if (!propagates) return [];
  if (edge.direction === 'bidirectional' || edge.isDirected === false) {
    return [
      [edge.source, edge.target],
      [edge.target, edge.source],
    ];
  }
  if (TARGET_FAILURE_AFFECTS_SOURCE.has(edge.relation)) return [[edge.target, edge.source]];
  return [[edge.source, edge.target]];
}

function failureAdjacency(graph: GraphDocument, omittedEdgeId?: string): Map<string, string[]> {
  const map = new Map<string, string[]>(ids(graph).map((id) => [id, []]));
  for (const edge of [...graph.edges].sort((left, right) => left.id.localeCompare(right.id))) {
    if (edge.id === omittedEdgeId) continue;
    for (const [from, to] of failureArcs(edge)) map.get(from)?.push(to);
  }
  for (const neighbors of map.values()) {
    neighbors.splice(0, neighbors.length, ...uniqueSorted(neighbors));
  }
  return map;
}

function traverse(adjacency: Map<string, Iterable<string>>, starts: string[]): Set<string> {
  const seen = new Set<string>();
  const queue = uniqueSorted(starts);
  while (queue.length) {
    const id = queue.shift();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    for (const next of adjacency.get(id) ?? []) if (!seen.has(next)) queue.push(next);
    queue.sort();
  }
  return seen;
}

export function toAdjacency(graph: GraphDocument): Map<string, Set<string>> {
  return undirected(graph);
}

export function components(graph: GraphDocument): string[][] {
  const adjacency = undirected(graph);
  const seen = new Set<string>();
  const out: string[][] = [];
  for (const id of ids(graph)) {
    if (seen.has(id)) continue;
    const component = uniqueSorted(traverse(adjacency, [id]));
    component.forEach((member) => seen.add(member));
    out.push(component);
  }
  return out;
}

function structuralLowLinks(graph: GraphDocument): {
  articulationPoints: string[];
  bridges: string[];
} {
  const adjacency = new Map<string, { nodeId: string; edgeId: string }[]>(
    ids(graph).map((id) => [id, []]),
  );
  for (const edge of [...graph.edges].sort((a, b) => a.id.localeCompare(b.id))) {
    adjacency.get(edge.source)?.push({ nodeId: edge.target, edgeId: edge.id });
    adjacency.get(edge.target)?.push({ nodeId: edge.source, edgeId: edge.id });
  }
  for (const entries of adjacency.values())
    entries.sort((a, b) => a.nodeId.localeCompare(b.nodeId) || a.edgeId.localeCompare(b.edgeId));
  const visited = new Set<string>();
  const discovery = new Map<string, number>();
  const low = new Map<string, number>();
  const cut = new Set<string>();
  const bridges = new Set<string>();
  let time = 0;

  const visit = (id: string, parentEdgeId: string | null): void => {
    visited.add(id);
    discovery.set(id, ++time);
    low.set(id, time);
    let children = 0;
    for (const entry of adjacency.get(id) ?? []) {
      if (entry.edgeId === parentEdgeId) continue;
      const next = entry.nodeId;
      if (!visited.has(next)) {
        children += 1;
        visit(next, entry.edgeId);
        low.set(id, Math.min(low.get(id) ?? time, low.get(next) ?? time));
        if (parentEdgeId === null && children > 1) cut.add(id);
        if (parentEdgeId !== null && (low.get(next) ?? 0) >= (discovery.get(id) ?? 0)) cut.add(id);
        if ((low.get(next) ?? 0) > (discovery.get(id) ?? 0)) bridges.add(entry.edgeId);
      } else {
        low.set(id, Math.min(low.get(id) ?? time, discovery.get(next) ?? time));
      }
    }
  };

  for (const id of ids(graph)) {
    if (visited.has(id)) continue;
    visit(id, null);
  }
  return { articulationPoints: uniqueSorted(cut), bridges: uniqueSorted(bridges) };
}

export function bridgeEdges(graph: GraphDocument): string[] {
  return structuralLowLinks(graph).bridges;
}

function stronglyConnectedCount(graph: GraphDocument): number {
  const adjacency = directed(graph);
  const reversed = new Map<string, string[]>(ids(graph).map((id) => [id, []]));
  for (const [source, targets] of adjacency) {
    for (const target of targets) reversed.get(target)?.push(source);
  }
  for (const values of reversed.values()) values.sort();
  const visited = new Set<string>();
  const order: string[] = [];
  const first = (id: string): void => {
    visited.add(id);
    for (const next of adjacency.get(id) ?? []) if (!visited.has(next)) first(next);
    order.push(id);
  };
  ids(graph).forEach((id) => {
    if (!visited.has(id)) first(id);
  });
  visited.clear();
  let count = 0;
  const second = (id: string): void => {
    visited.add(id);
    for (const next of reversed.get(id) ?? []) if (!visited.has(next)) second(next);
  };
  for (const id of order.reverse()) {
    if (visited.has(id)) continue;
    count += 1;
    second(id);
  }
  return count;
}

function shortestPath(
  graph: GraphDocument,
  start: string,
  goal: string,
  omittedEdgeId?: string,
): string[] | null {
  if (start === goal) return [start];
  const adjacency = directed(graph, omittedEdgeId);
  const queue: string[][] = [[start]];
  const visited = new Set<string>([start]);
  while (queue.length) {
    const path = queue.shift();
    const current = path?.at(-1);
    if (!path || !current) continue;
    for (const next of adjacency.get(current) ?? []) {
      if (visited.has(next)) continue;
      const candidate = [...path, next];
      if (next === goal) return candidate;
      visited.add(next);
      queue.push(candidate);
    }
  }
  return null;
}

export function criticalPaths(graph: GraphDocument, starts: string[], goals: string[]): string[][] {
  const available = new Set(ids(graph));
  const results: string[][] = [];
  for (const start of uniqueSorted(starts)) {
    for (const goal of uniqueSorted(goals)) {
      if (!available.has(start) || !available.has(goal)) continue;
      const path = shortestPath(graph, start, goal);
      if (path && path.length > 1) results.push(path);
    }
  }
  return results.sort((a, b) => a.length - b.length || a.join('/').localeCompare(b.join('/')));
}

function truth(node: NodeRecord): FreshnessState {
  return buildRuntimeTruthState(node.facts);
}

function confidenceFor(state: FreshnessState): number {
  return { fresh: 1, aging: 0.8, stale: 0.5, conflict: 0.3, unknown: 0.2, unavailable: 0.1 }[state];
}

function weight(edge: EdgeRecord): number {
  return { low: 25, medium: 45, high: 70, critical: 90 }[edge.criticality];
}

function redundancy(graph: GraphDocument, bridges: readonly string[]): number {
  if (!graph.edges.length) return 0;
  return Math.round(((graph.edges.length - bridges.length) / graph.edges.length) * 100);
}

export function computeGraphAnalysis(graph: GraphDocument): GraphAnalysisResult {
  const lowLinks = structuralLowLinks(graph);
  return {
    articulationPoints: lowLinks.articulationPoints,
    bridges: lowLinks.bridges,
    redundancyScore: redundancy(graph, lowLinks.bridges),
    sccCount: stronglyConnectedCount(graph),
    weaklyConnectedComponents: components(graph),
  };
}

export function blastRadius(
  graph: GraphDocument,
  failureNodeIds: string[],
): {
  affectedNodes: string[];
  severity: number;
  confidence: 'high' | 'medium' | 'low';
} {
  const starts = uniqueSorted(failureNodeIds).filter((id) =>
    graph.nodes.some((node) => node.id === id),
  );
  if (!starts.length) return { affectedNodes: [], severity: 0, confidence: 'low' };
  const affectedNodes = uniqueSorted(traverse(failureAdjacency(graph), starts));
  const evidenceScores = affectedNodes.map((id) => {
    const node = graph.nodes.find((item) => item.id === id);
    return node ? confidenceFor(truth(node)) : 0;
  });
  const averageConfidence =
    evidenceScores.reduce((sum, value) => sum + value, 0) / Math.max(1, evidenceScores.length);
  const severity = Math.round((affectedNodes.length / Math.max(1, graph.nodes.length)) * 100);
  const confidence =
    averageConfidence >= 0.8 ? 'high' : averageConfidence >= 0.45 ? 'medium' : 'low';
  return { affectedNodes, severity, confidence };
}

export function probabilisticBlastRadius(
  graph: GraphDocument,
  failureNodeIds: string[],
): {
  probabilityByNode: Record<string, number>;
  affectedNodes: string[];
  expectedAffected: number;
} {
  const validIds = new Set(ids(graph));
  const probabilities = new Map<string, number>();
  const queue: { id: string; probability: number }[] = [];
  for (const id of uniqueSorted(failureNodeIds)) {
    if (!validIds.has(id)) continue;
    probabilities.set(id, 1);
    queue.push({ id, probability: 1 });
  }

  const confidenceFactor = { high: 0.95, medium: 0.7, low: 0.4, unknown: 0.2 };
  const lifecycleFactor: Record<string, number> = { experimental: 0.55, active: 1, degraded: 0.8 };
  const links = new Map<string, { to: string; probability: number }[]>(
    ids(graph).map((id) => [id, []]),
  );
  for (const edge of graph.edges) {
    const probability =
      confidenceFactor[edge.confidence] *
      (lifecycleFactor[edge.lifecycle] ?? 0) *
      (0.65 + { low: 0.1, medium: 0.2, high: 0.3, critical: 0.35 }[edge.criticality]);
    for (const [from, to] of failureArcs(edge)) links.get(from)?.push({ to, probability });
  }

  while (queue.length) {
    queue.sort(
      (left, right) => right.probability - left.probability || left.id.localeCompare(right.id),
    );
    const current = queue.shift();
    if (!current || current.probability < (probabilities.get(current.id) ?? 0)) continue;
    for (const link of links.get(current.id) ?? []) {
      const candidate = current.probability * link.probability;
      if (candidate <= (probabilities.get(link.to) ?? 0) + Number.EPSILON) continue;
      probabilities.set(link.to, candidate);
      queue.push({ id: link.to, probability: candidate });
    }
  }

  const probabilityByNode = Object.fromEntries(
    [...probabilities.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([id, probability]) => [id, Number(probability.toFixed(4))]),
  );
  return {
    probabilityByNode,
    affectedNodes: Object.keys(probabilityByNode),
    expectedAffected: Number(
      Object.values(probabilityByNode)
        .reduce((sum, probability) => sum + probability, 0)
        .toFixed(3),
    ),
  };
}

export function bottleneckEdges(graph: GraphDocument, top = 5): BottleneckEdge[] {
  const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));
  const bounded = graph.nodes.length > 100;
  const bridges = new Set(bridgeEdges(graph));
  return graph.edges
    .map((edge) => {
      const arcs = failureArcs(edge);
      let lostReachability = bounded && bridges.has(edge.id) ? 1 : 0;
      if (!bounded) {
        for (const [from] of arcs) {
          const before = traverse(failureAdjacency(graph), [from]);
          const after = traverse(failureAdjacency(graph, edge.id), [from]);
          lostReachability += [...before].filter((id) => !after.has(id)).length;
        }
      }
      const source = nodeById.get(edge.source);
      const target = nodeById.get(edge.target);
      const confidence =
        confidenceFor(source ? truth(source) : 'unknown') *
        confidenceFor(target ? truth(target) : 'unknown');
      const lostRatio =
        lostReachability / Math.max(1, graph.nodes.length * Math.max(1, arcs.length));
      const rawImpact = lostRatio * 70 + weight(edge) * 0.3 + (edge.relationStrength ?? 0) * 0.5;
      return {
        edgeId: edge.id,
        source: edge.source,
        target: edge.target,
        impact: Math.min(100, Math.round(rawImpact * confidence)),
        confidence: Number(confidence.toFixed(2)),
      };
    })
    .sort(
      (a, b) =>
        b.impact - a.impact || b.confidence - a.confidence || a.edgeId.localeCompare(b.edgeId),
    )
    .slice(0, top);
}
