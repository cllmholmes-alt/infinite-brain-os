interface SeededRng {
  (): number;
}

function xorshift(seed: number): SeededRng {
  let value = seed >>> 0;
  return () => {
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    return (value >>> 0) / 0xffffffff;
  };
}

function hashSeed(input: string): number {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export interface Point {
  x: number;
  y: number;
}

export interface LayoutOptions {
  width: number;
  height: number;
  iterations?: number;
  seedText?: string;
  clusteringRadius?: number;
  minimumSpacing?: number;
  damping?: number;
  links?: Array<{ source: string; target: string; strength?: number }>;
  clusterByNode?: Record<string, string>;
}

export interface ClusterLayout {
  nodeId: string;
  clusterIndex: number;
}

export function layoutNodes(nodeIds: string[], options: LayoutOptions): Record<string, Point> {
  const width = options.width > 0 ? options.width : 1000;
  const height = options.height > 0 ? options.height : 700;
  const baseSeed = hashSeed(`${options.seedText ?? 'brain-map-v4'}-${width}-${height}`);
  const rand = xorshift(baseSeed);
  const minimumSpacing = options.minimumSpacing ?? 34;
  const iterations = options.iterations ?? 80;
  const damping = options.damping ?? 0.12;

  const sortedIds = [...nodeIds].sort();
  const points: Record<string, Point> = {};

  if (sortedIds.length === 0) {
    return points;
  }

  const fallbackClusterCount = Math.max(1, Math.ceil(Math.sqrt(sortedIds.length / 2)));
  const assignedClusters = options.clusterByNode
    ? sortedIds.map((nodeId) => options.clusterByNode?.[nodeId] ?? 'unclustered')
    : sortedIds.map((_, index) => `cluster-${index % fallbackClusterCount}`);
  const clusterIds = [...new Set(assignedClusters)].sort();
  const clusterCount = clusterIds.length;
  const clusterRadius = options.clusteringRadius ?? Math.min(width, height) * 0.25;

  const clusterCenters = Array.from({ length: clusterCount }, (_, index) => {
    const angle = (2 * Math.PI * index) / clusterCount;
    const radius = clusterRadius;
    return {
      x: width / 2 + Math.cos(angle + 0.11 * (index + 1)) * radius,
      y: height / 2 + Math.sin(angle + 0.11 * (index + 1)) * radius,
    };
  });

  const sortedMap = sortedIds.map((nodeId, index) => ({
    nodeId,
    clusterIndex: Math.max(0, clusterIds.indexOf(assignedClusters[index]!)),
  }));

  sortedMap.forEach(({ nodeId, clusterIndex }) => {
    const cluster = clusterCenters[clusterIndex] ??
      clusterCenters[0] ?? { x: width / 2, y: height / 2 };
    const seedAngle = rand() * Math.PI * 2;
    const radius = Math.min(width, height) * (0.08 + rand() * 0.3);
    points[nodeId] = {
      x: Math.max(16, Math.min(width - 16, cluster.x + Math.cos(seedAngle) * radius)),
      y: Math.max(16, Math.min(height - 16, cluster.y + Math.sin(seedAngle) * radius)),
    };
  });

  const attraction = Math.min(width, height) * 0.015;

  for (let step = 0; step < iterations; step += 1) {
    const moves: Array<[string, number, number]> = [];

    for (const entry of sortedMap) {
      const point = points[entry.nodeId]!;
      const cluster = clusterCenters[entry.clusterIndex] ??
        clusterCenters[0] ?? { x: width / 2, y: height / 2 };
      const pullX = (cluster.x - point.x) * 0.001;
      const pullY = (cluster.y - point.y) * 0.001;
      moves.push([entry.nodeId, pullX, pullY]);
    }

    for (let i = 0; i < sortedMap.length; i += 1) {
      const from = sortedMap[i]!;
      const fromPoint = points[from.nodeId]!;
      for (let j = i + 1; j < sortedMap.length; j += 1) {
        const to = sortedMap[j]!;
        const toPoint = points[to.nodeId]!;
        const dx = toPoint.x - fromPoint.x;
        const dy = toPoint.y - fromPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const overlap = minimumSpacing - distance;

        if (overlap > 0) {
          const correction = (overlap / distance) * 0.5;
          const adjustX = (dx / distance) * correction;
          const adjustY = (dy / distance) * correction;
          fromPoint.x -= adjustX * damping;
          fromPoint.y -= adjustY * damping;
          toPoint.x += adjustX * damping;
          toPoint.y += adjustY * damping;
        }
      }
    }

    for (const link of [...(options.links ?? [])].sort(
      (left, right) =>
        left.source.localeCompare(right.source) || left.target.localeCompare(right.target),
    )) {
      const source = points[link.source];
      const target = points[link.target];
      if (!source || !target) continue;
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      const desired = minimumSpacing * 2.4;
      const force = (distance - desired) * 0.012 * Math.max(0.1, Math.min(1, link.strength ?? 0.5));
      const adjustX = (dx / distance) * force * damping;
      const adjustY = (dy / distance) * force * damping;
      source.x += adjustX;
      source.y += adjustY;
      target.x -= adjustX;
      target.y -= adjustY;
    }

    for (const [nodeId, moveX, moveY] of moves) {
      const point = points[nodeId]!;
      point.x += (moveX + (rand() - 0.5) * attraction) * 0.1;
      point.y += (moveY + (rand() - 0.5) * attraction) * 0.1;
      point.x = Math.max(10, Math.min(width - 10, point.x));
      point.y = Math.max(10, Math.min(height - 10, point.y));
    }
  }

  return points;
}

export function clusterLayoutInfo(nodeIds: string[], clusterCount: number): ClusterLayout[] {
  const sortedIds = [...nodeIds].sort();
  const count = Math.max(1, clusterCount);
  return sortedIds.map((nodeId, index) => ({
    nodeId,
    clusterIndex: index % count,
  }));
}
