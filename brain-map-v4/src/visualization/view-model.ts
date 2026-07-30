import type { Confidence, FreshnessState, GraphDocument, RuntimeState } from '../schema/types';

export function buildFocusTunnel(
  graph: GraphDocument,
  focusNodeId: string,
  depth: 0 | 1 | 2,
): { nodeIds: string[]; edgeIds: string[]; depthByNode: Record<string, number> } {
  const valid = new Set(graph.nodes.map((node) => node.id));
  if (!valid.has(focusNodeId)) return { nodeIds: [], edgeIds: [], depthByNode: {} };
  const adjacency = new Map(
    graph.nodes.map((node) => [node.id, [] as Array<{ nodeId: string; edgeId: string }>]),
  );
  for (const edge of graph.edges) {
    adjacency.get(edge.source)?.push({ nodeId: edge.target, edgeId: edge.id });
    adjacency.get(edge.target)?.push({ nodeId: edge.source, edgeId: edge.id });
  }
  const depthByNode: Record<string, number> = { [focusNodeId]: 0 };
  const edgeIds = new Set<string>();
  const queue = [focusNodeId];
  while (queue.length) {
    const current = queue.shift()!;
    const currentDepth = depthByNode[current]!;
    if (currentDepth >= depth) continue;
    for (const adjacent of [...(adjacency.get(current) ?? [])].sort((left, right) =>
      left.nodeId.localeCompare(right.nodeId),
    )) {
      edgeIds.add(adjacent.edgeId);
      if (depthByNode[adjacent.nodeId] !== undefined) continue;
      depthByNode[adjacent.nodeId] = currentDepth + 1;
      queue.push(adjacent.nodeId);
    }
  }
  return { nodeIds: Object.keys(depthByNode).sort(), edgeIds: [...edgeIds].sort(), depthByNode };
}

export function buildSemanticViewModel(
  graph: GraphDocument,
  zoom: RuntimeState['zoomLevel'],
  focusNodeId: string | null,
  now = Date.now(),
): {
  kind: 'territories' | 'neighborhood' | 'entity-detail';
  nodeIds: string[];
  edgeIds: string[];
  territoryIds: string[];
  visibleFactKeys: string[];
  labelDensity: number;
} {
  if (zoom === 'overview') {
    return {
      kind: 'territories',
      nodeIds: graph.nodes.map((node) => node.id).sort(),
      edgeIds: [],
      territoryIds: graph.clusters.map((cluster) => cluster.id).sort(),
      visibleFactKeys: [],
      labelDensity: 0.2,
    };
  }
  const focus =
    focusNodeId && graph.nodes.some((node) => node.id === focusNodeId)
      ? focusNodeId
      : (graph.nodes[0]?.id ?? null);
  if (zoom === 'neighborhood') {
    const tunnel = focus ? buildFocusTunnel(graph, focus, 2) : { nodeIds: [], edgeIds: [] };
    return {
      kind: 'neighborhood',
      nodeIds: tunnel.nodeIds,
      edgeIds: tunnel.edgeIds,
      territoryIds: [],
      visibleFactKeys: [],
      labelDensity: 0.65,
    };
  }
  const node = graph.nodes.find((entry) => entry.id === focus);
  const tunnel = focus ? buildFocusTunnel(graph, focus, 1) : { nodeIds: [], edgeIds: [] };
  const visibleFactKeys = node
    ? Object.entries(node.facts)
        .filter(([, factSet]) => {
          const facts = Array.isArray(factSet) ? factSet : [factSet];
          return facts.some((fact) => {
            const observedAt = fact.evidence.observedAt
              ? Date.parse(fact.evidence.observedAt)
              : Number.NaN;
            if (!Number.isFinite(observedAt)) return false;
            const explicitExpiry = fact.evidence.expiresAt
              ? Date.parse(fact.evidence.expiresAt)
              : Number.NaN;
            const derivedExpiry =
              fact.evidence.expiresAfterMs === null || fact.evidence.expiresAfterMs === undefined
                ? Number.POSITIVE_INFINITY
                : observedAt + fact.evidence.expiresAfterMs;
            const expiresAt = Number.isFinite(explicitExpiry) ? explicitExpiry : derivedExpiry;
            return expiresAt >= now;
          });
        })
        .map(([key]) => key)
        .sort()
    : [];
  return {
    kind: 'entity-detail',
    nodeIds: tunnel.nodeIds,
    edgeIds: tunnel.edgeIds,
    territoryIds: [],
    visibleFactKeys,
    labelDensity: 1,
  };
}

export interface HullPoint {
  x: number;
  y: number;
}

export function computeConvexHull(points: HullPoint[]): HullPoint[] {
  const unique = [
    ...new Map(points.map((point) => [`${point.x}\u0000${point.y}`, point])).values(),
  ].sort((left, right) => left.x - right.x || left.y - right.y);
  if (unique.length <= 2) return structuredClone(unique);
  const cross = (origin: HullPoint, left: HullPoint, right: HullPoint): number =>
    (left.x - origin.x) * (right.y - origin.y) - (left.y - origin.y) * (right.x - origin.x);
  const lower: HullPoint[] = [];
  for (const point of unique) {
    while (lower.length >= 2 && cross(lower.at(-2)!, lower.at(-1)!, point) <= 0) lower.pop();
    lower.push(point);
  }
  const upper: HullPoint[] = [];
  for (const point of [...unique].reverse()) {
    while (upper.length >= 2 && cross(upper.at(-2)!, upper.at(-1)!, point) <= 0) upper.pop();
    upper.push(point);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

export function buildPathBreadcrumb(
  graph: GraphDocument,
  startNodeId: string,
  goalNodeId: string,
): { nodeIds: string[]; edgeIds: string[]; breadcrumbs: string[] } {
  const adjacency = new Map(
    graph.nodes.map((node) => [node.id, [] as Array<{ nodeId: string; edgeId: string }>]),
  );
  for (const edge of graph.edges) {
    const pairs: Array<[string, string]> =
      edge.direction === 'bidirectional' || edge.isDirected === false
        ? [
            [edge.source, edge.target],
            [edge.target, edge.source],
          ]
        : edge.direction === 'inbound'
          ? [[edge.target, edge.source]]
          : [[edge.source, edge.target]];
    for (const [source, target] of pairs)
      adjacency.get(source)?.push({ nodeId: target, edgeId: edge.id });
  }
  const queue = [startNodeId];
  const previous = new Map<string, { nodeId: string; edgeId: string } | null>([
    [startNodeId, null],
  ]);
  while (queue.length && !previous.has(goalNodeId)) {
    const current = queue.shift()!;
    for (const next of [...(adjacency.get(current) ?? [])].sort((left, right) =>
      left.nodeId.localeCompare(right.nodeId),
    )) {
      if (previous.has(next.nodeId)) continue;
      previous.set(next.nodeId, { nodeId: current, edgeId: next.edgeId });
      queue.push(next.nodeId);
    }
  }
  if (!previous.has(goalNodeId)) return { nodeIds: [], edgeIds: [], breadcrumbs: [] };
  const nodeIds: string[] = [];
  const edgeIds: string[] = [];
  for (let current: string | null = goalNodeId; current;) {
    nodeIds.unshift(current);
    const entry: { nodeId: string; edgeId: string } | null = previous.get(current) ?? null;
    if (!entry) break;
    edgeIds.unshift(entry.edgeId);
    current = entry.nodeId;
  }
  const names = new Map(graph.nodes.map((node) => [node.id, node.name]));
  return { nodeIds, edgeIds, breadcrumbs: nodeIds.map((id) => names.get(id) ?? id) };
}

export type GraphLens = RuntimeState['activeLenses'][number];

const LENS_CLASSES: Record<GraphLens, Set<string>> = {
  operations: new Set(['service', 'agent', 'workflow', 'incident']),
  deployment: new Set(['repository', 'service', 'workflow']),
  data: new Set(['data-store', 'service']),
  security: new Set(['external-provider', 'service', 'incident']),
  governance: new Set(['goal', 'outcome', 'capability']),
  'user-path': new Set(['goal', 'outcome', 'service']),
};

export function applyGraphLenses(
  graph: GraphDocument,
  lenses: GraphLens[],
): {
  mode: 'union';
  nodeIds: string[];
  edgeIds: string[];
  reasonsByNode: Record<string, string[]>;
} {
  const reasonsByNode: Record<string, string[]> = {};
  for (const node of graph.nodes) {
    for (const lens of [...new Set(lenses)]) {
      const tagMatch = node.tags?.includes(lens) ?? false;
      if (LENS_CLASSES[lens].has(node.class) || tagMatch)
        (reasonsByNode[node.id] ??= []).push(lens);
    }
  }
  const nodes = new Set(Object.keys(reasonsByNode));
  return {
    mode: 'union',
    nodeIds: [...nodes].sort(),
    edgeIds: graph.edges
      .filter((edge) => nodes.has(edge.source) && nodes.has(edge.target))
      .map((edge) => edge.id)
      .sort(),
    reasonsByNode,
  };
}

export function evidenceVisualEncoding(input: {
  confidence: Confidence;
  freshness: FreshnessState;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}): {
  opacity: number;
  strokeWidth: number;
  pattern: 'solid' | 'dotted' | 'dashed';
  pulse: boolean;
} {
  const opacity = { high: 1, medium: 0.78, low: 0.55, unknown: 0.35 }[input.confidence];
  const strokeWidth = { low: 1, medium: 1.5, high: 2.25, critical: 3 }[input.criticality];
  const pattern = ['unknown', 'unavailable', 'conflict'].includes(input.freshness)
    ? 'dashed'
    : input.freshness === 'stale'
      ? 'dotted'
      : 'solid';
  return {
    opacity,
    strokeWidth,
    pattern,
    pulse: input.criticality === 'critical' && input.freshness === 'fresh',
  };
}

export interface PinnedPerspective {
  id: string;
  nodeId: string;
  x: number;
  y: number;
  view: RuntimeState['zoomLevel'];
}

export class PinStore {
  private pins = new Map<string, PinnedPerspective>();

  pin(perspective: PinnedPerspective): void {
    if (
      !perspective.id.trim() ||
      !perspective.nodeId.trim() ||
      !Number.isFinite(perspective.x) ||
      !Number.isFinite(perspective.y)
    ) {
      throw new Error('pin-invalid');
    }
    this.pins.set(perspective.id, structuredClone(perspective));
  }

  list(): PinnedPerspective[] {
    return structuredClone(
      [...this.pins.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }
}

export function motionPreset(environment: RuntimeState['environment']): {
  animate: boolean;
  durationMs: number;
  particles: number;
  easing: 'linear' | 'ease-out';
} {
  if (environment === 'reduced-motion')
    return { animate: false, durationMs: 0, particles: 0, easing: 'linear' };
  if (environment === 'low-stimulation')
    return { animate: true, durationMs: 180, particles: 0, easing: 'ease-out' };
  return { animate: true, durationMs: 320, particles: 14, easing: 'ease-out' };
}
