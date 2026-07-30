import { GraphDocument, RuntimeState } from '../schema/types';
import { layoutNodes } from './seed';

export interface MeridianPosition {
  x: number;
  y: number;
  radius: number;
  zone: number;
  cluster?: string | undefined;
  clusterIndex: number;
  label?: string | undefined;
}

export interface MeridianLayoutResult {
  positions: Record<string, MeridianPosition>;
  clusters: Array<{
    id: string;
    label: string;
    summary: string;
    bounds: { x1: number; y1: number; x2: number; y2: number };
    nodeCount: number;
  }>;
}

const ZONES = ['overview', 'neighborhood', 'detail'];

function parseZoomLevel(value: RuntimeState['zoomLevel']): number {
  return ZONES.indexOf(value);
}

function deriveSeed(graph: GraphDocument): string {
  return `${graph.schemaVersion}-${graph.generatedAt}-${graph.nodes.length}-${graph.edges.length}-${graph.clusters.length}`;
}

export function meridianLayout(
  graph: GraphDocument,
  width: number,
  height: number,
  runtime: RuntimeState,
): MeridianLayoutResult {
  const clusterIndexById = new Map(graph.clusters.map((cluster, index) => [cluster.id, index]));
  const clusterByNode = Object.fromEntries(
    graph.nodes.map((node) => [node.id, node.clusterId ?? 'unclustered']),
  );

  const positionSeed = deriveSeed(graph);
  const positions = layoutNodes(
    graph.nodes.map((node) => node.id),
    {
      width: Math.max(240, width),
      height: Math.max(240, height),
      iterations: runtime.mode === 'act' ? 70 : 90,
      seedText: `${positionSeed}-${runtime.zoomLevel}-${runtime.environment}-${runtime.activeLenses.join(',')}`,
      clusteringRadius: Math.min(width, height) * 0.2,
      minimumSpacing: runtime.mode === 'act' ? 30 : 34,
      clusterByNode,
      links: graph.edges
        .filter((edge) => !['retired', 'archived', 'proposed'].includes(edge.lifecycle))
        .map((edge) => ({
          source: edge.source,
          target: edge.target,
          strength:
            edge.relationStrength ??
            ({ low: 0.25, medium: 0.5, high: 0.75, critical: 1 } as const)[edge.criticality],
        })),
    },
  );

  const zone = parseZoomLevel(runtime.zoomLevel);
  const zoneScale = zone <= 0 ? 1 : zone === 1 ? 0.96 : 0.92;

  const out: Record<string, MeridianPosition> = {};
  const clusterBounds = new Map<
    string,
    {
      id: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      label: string;
      summary: string;
      count: number;
    }
  >();

  graph.clusters.forEach((cluster) => {
    clusterBounds.set(cluster.id, {
      id: cluster.id,
      x1: Infinity,
      y1: Infinity,
      x2: -Infinity,
      y2: -Infinity,
      label: cluster.label,
      summary: cluster.summary,
      count: 0,
    });
  });

  graph.nodes.forEach((node, index) => {
    const point = positions[node.id];
    if (!point) {
      return;
    }

    const clusterId = node.clusterId ?? 'unclustered';
    const clusterIndex = clusterIndexById.get(clusterId) ?? graph.clusters.length;
    const radius =
      runtime.zoomLevel === 'overview' ? 8 : runtime.zoomLevel === 'neighborhood' ? 10 : 12;

    const x = Math.max(12, Math.min(width - 12, point.x * zoneScale));
    const y = Math.max(12, Math.min(height - 12, point.y * zoneScale));

    const selectedLabel = graph.nodes[index]?.name;
    const entry = clusterBounds.get(clusterId) ?? {
      id: clusterId,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      label: clusterId,
      summary: 'No summary available',
      count: 0,
    };

    entry.x1 = Math.min(entry.x1, x - 36);
    entry.y1 = Math.min(entry.y1, y - 30);
    entry.x2 = Math.max(entry.x2, x + 36);
    entry.y2 = Math.max(entry.y2, y + 30);
    entry.count += 1;
    clusterBounds.set(clusterId, entry);

    out[node.id] = {
      x,
      y,
      radius,
      zone,
      cluster: clusterId,
      clusterIndex,
      label: selectedLabel,
    };
  });

  return {
    positions: out,
    clusters: Array.from(clusterBounds.values()).map((entry) => ({
      id: entry.id,
      label: entry.label,
      summary: entry.summary,
      nodeCount: entry.count,
      bounds: {
        x1: entry.x1,
        y1: entry.y1,
        x2: Math.max(entry.x1, entry.x2),
        y2: Math.max(entry.y1, entry.y2),
      },
    })),
  };
}
