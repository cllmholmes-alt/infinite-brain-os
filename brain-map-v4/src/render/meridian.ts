import { GraphDocument, RuntimeState } from '../schema/types';
import { meridianLayout, type MeridianLayoutResult } from '../layout/meridian';
import type { LayoutWorkerResult } from '../workers/graph-worker';

type TruthState = 'fresh' | 'aging' | 'stale' | 'unknown' | 'unavailable' | 'conflict';

interface CanvasPoint {
  x: number;
  y: number;
  radius: number;
}

interface RenderState {
  width: number;
  height: number;
  dpr: number;
}

interface RenderNodeMeta {
  selected: boolean;
  visible: boolean;
  muted: boolean;
}

const QUALITY_COLORS = {
  fresh: '#0f766e',
  aging: '#d97706',
  stale: '#b91c1c',
  unknown: '#6b7280',
  unavailable: '#111827',
  conflict: '#7c3aed',
};

const EDGE_STYLES = {
  critical: { hue: 0, alpha: 0.9, width: 2.2 },
  high: { hue: 18, alpha: 0.75, width: 1.9 },
  medium: { hue: 32, alpha: 0.56, width: 1.55 },
  low: { hue: 206, alpha: 0.42, width: 1.1 },
};

const RELATION_PRIORITY = {
  calls: 1,
  deploysTo: 2,
  storesIn: 2,
  routes: 3,
  tokens: 3,
  fallback: 4,
  income: 4,
} as const;

function toRenderState(
  graph: GraphDocument,
  runtime: RuntimeState,
): { visible: Set<string>; related: Set<string> } {
  const selected = runtime.selectedNodeId;
  const visible = new Set<string>();
  const related = new Set<string>();

  if (!selected) {
    return { visible, related };
  }

  visible.add(selected);

  const firstHops = graph.edges.filter(
    (edge) => edge.source === selected || edge.target === selected,
  );
  firstHops.forEach((edge) => {
    related.add(edge.source);
    related.add(edge.target);
  });

  graph.edges
    .filter((edge) => related.has(edge.source) || related.has(edge.target))
    .forEach((edge) => {
      related.add(edge.source);
      related.add(edge.target);
    });

  related.forEach((nodeId) => visible.add(nodeId));
  return { visible, related };
}

function styleBackground(environment: RuntimeState['environment']): string {
  if (environment === 'dark') {
    return '#0f172a';
  }
  if (environment === 'low-stimulation') {
    return '#eff2f1';
  }
  if (environment === 'reduced-motion') {
    return '#f5f5f2';
  }
  return '#f6f0e5';
}

function styleText(environment: RuntimeState['environment']): string {
  if (environment === 'dark' || environment === 'low-stimulation') {
    return '#e5e7eb';
  }
  return '#0f172a';
}

function stylePaper(environment: RuntimeState['environment']): string {
  if (environment === 'dark') {
    return '#1f2937';
  }
  if (environment === 'low-stimulation') {
    return '#faf7ee';
  }
  return '#fff9f0';
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  const r = Math.min(radius, Math.max(2, Math.min(width / 2, height / 2)));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function roundedClusterPath(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void {
  const width = Math.max(40, x2 - x1);
  const height = Math.max(30, y2 - y1);
  drawRoundedRect(ctx, x1, y1, width, height, 10);
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): void {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLength = 10;
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 7),
    toY - headLength * Math.sin(angle - Math.PI / 7),
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 7),
    toY - headLength * Math.sin(angle + Math.PI / 7),
  );
  ctx.closePath();
  ctx.fill();
}

function relationOrder(a: string, b: string): number {
  const aPriority = (RELATION_PRIORITY as Record<string, number>)[a] ?? 999;
  const bPriority = (RELATION_PRIORITY as Record<string, number>)[b] ?? 999;
  return aPriority - bPriority;
}

export class MeridianRenderer {
  private onNodePick: ((id: string) => void) | null = null;
  private lastState: RenderState | null = null;
  private workerLayout: LayoutWorkerResult | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private minimap: HTMLCanvasElement | null,
  ) {}

  setNodePickHandler(handler: (id: string) => void): void {
    this.onNodePick = handler;
  }

  setWorkerLayout(result: LayoutWorkerResult | null): void {
    this.workerLayout = result;
  }

  workerLayoutNodeCount(): number {
    return this.workerLayout?.nodeIds.length ?? 0;
  }

  render(graph: GraphDocument, runtime: RuntimeState, truthMap: Map<string, TruthState>): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const renderRect = this.canvas.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.canvas.width = Math.max(320, Math.floor(renderRect.width * dpr));
    this.canvas.height = Math.max(220, Math.floor(renderRect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.lastState = { width: renderRect.width, height: renderRect.height, dpr };

    const width = renderRect.width;
    const height = renderRect.height;

    const selected = runtime.selectedNodeId;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = styleBackground(runtime.environment);
    ctx.fillRect(0, 0, width, height);

    if (graph.nodes.length >= 100 && runtime.zoomLevel === 'overview' && !selected) {
      const aggregateLayout: MeridianLayoutResult = {
        positions: {},
        clusters: graph.clusters.map((cluster) => ({
          id: cluster.id,
          label: cluster.label,
          summary: cluster.summary,
          nodeCount: cluster.nodeIds.length,
          bounds: { x1: 0, y1: 0, x2: 0, y2: 0 },
        })),
      };
      const clusterPositions = this.renderDenseOverview(
        ctx,
        graph,
        aggregateLayout,
        runtime,
        truthMap,
        width,
        height,
      );
      this.renderDenseMiniMap(clusterPositions, runtime, width, height);
      this.attachPositions({});
      return;
    }

    const layout = meridianLayout(graph, width, height, runtime);
    if (
      graph.nodes.length >= 100 &&
      this.workerLayout &&
      this.workerLayout.nodeIds.length === graph.nodes.length
    ) {
      this.workerLayout.nodeIds.forEach((id, index) => {
        const current = layout.positions[id];
        if (!current) return;
        layout.positions[id] = {
          ...current,
          x: this.workerLayout!.positions[index * 2]! * width,
          y: this.workerLayout!.positions[index * 2 + 1]! * height,
        };
      });
    }
    const visibleState = toRenderState(graph, runtime);
    const directNeighbors = new Set<string>();
    if (selected) {
      directNeighbors.add(selected);
      graph.edges
        .filter((edge) => edge.source === selected || edge.target === selected)
        .forEach((edge) => {
          directNeighbors.add(edge.source);
          directNeighbors.add(edge.target);
        });
    }

    const selectedCluster = selected
      ? graph.nodes.find((node) => node.id === selected)?.clusterId
      : null;

    for (const cluster of layout.clusters) {
      const { x1, y1, x2, y2 } = cluster.bounds;
      const cx = x1;
      const cy = y1;

      const baseAlpha = selectedCluster && selectedCluster !== cluster.id ? 0.14 : 0.24;
      ctx.fillStyle = `${stylePaper(runtime.environment)}80`;
      ctx.strokeStyle = `rgba(0,0,0,${baseAlpha})`;
      ctx.lineWidth = 1;
      ctx.globalAlpha = runtime.environment === 'low-stimulation' ? 0.3 : baseAlpha;
      roundedClusterPath(ctx, cx - 8, cy - 8, x2 + 8, y2 + 8);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.stroke();

      if (runtime.zoomLevel === 'detail' && runtime.environment !== 'reduced-motion') {
        ctx.fillStyle = styleText(runtime.environment);
        ctx.font = '12px Georgia, serif';
        ctx.fillText(`${cluster.label} (${cluster.nodeCount})`, cx + 4, cy + 10);
      }
    }

    const sortedEdges = [...graph.edges].sort((a, b) => {
      const priority = relationOrder(a.relation, b.relation);
      if (priority !== 0) {
        return priority;
      }
      return a.id.localeCompare(b.id);
    });

    for (const edge of sortedEdges) {
      const from = layout.positions[edge.source];
      const to = layout.positions[edge.target];
      if (!from || !to) {
        continue;
      }

      const fromState = truthMap.get(edge.source) ?? 'unknown';
      const toState = truthMap.get(edge.target) ?? 'unknown';
      const muted =
        runtime.mode === 'act' ? fromState === 'unavailable' || toState === 'unavailable' : false;

      const style = EDGE_STYLES[edge.criticality];
      const hue = style.hue;
      const alpha = muted ? Math.min(0.3, style.alpha * 0.35) : style.alpha;
      ctx.strokeStyle = `hsla(${hue}, 72%, 50%, ${alpha})`;
      ctx.lineWidth = style.width;
      ctx.globalAlpha = runtime.environment === 'reduced-motion' ? 0.42 : 1;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();

      ctx.fillStyle = ctx.strokeStyle;
      drawArrow(ctx, from.x, from.y, to.x, to.y);

      if (
        runtime.zoomLevel === 'detail' &&
        edge.criticality !== 'low' &&
        (!selected || edge.source === selected || edge.target === selected)
      ) {
        const midX = (from.x + to.x) / 2;
        const midY = (from.y + to.y) / 2;
        const label = `${edge.relation} ${edge.criticality}`;
        ctx.fillStyle = `rgba(255,255,255,${runtime.environment === 'dark' ? 0.15 : 0.74})`;
        ctx.fillRect(midX - 36, midY - 10, label.length * 6.5, 16);
        ctx.fillStyle = styleText(runtime.environment);
        ctx.font = '11px Georgia, serif';
        ctx.fillText(label, midX - 34, midY + 3);
      }
    }

    const nodeMeta = new Map<string, RenderNodeMeta>();
    for (const node of graph.nodes) {
      const visible =
        !runtime.selectedNodeId ||
        visibleState.visible.has(node.id) ||
        visibleState.visible.size === 0;
      const isSelected = node.id === selected;
      const muted = !visible || runtime.mode === 'act' ? false : false;

      nodeMeta.set(node.id, {
        selected: isSelected,
        visible: visible,
        muted: muted && !isSelected,
      });
    }

    const selectedNodeId = runtime.selectedNodeId;
    for (const node of graph.nodes) {
      const point = layout.positions[node.id];
      if (!point) {
        continue;
      }

      const meta = nodeMeta.get(node.id);
      if (!meta) {
        continue;
      }

      const state = truthMap.get(node.id) ?? 'unknown';
      const isVisible = meta.visible || runtime.environment === 'low-stimulation';
      if (!isVisible) {
        ctx.globalAlpha = 0.2;
      } else if (meta.muted) {
        ctx.globalAlpha = 0.35;
      } else {
        ctx.globalAlpha = 1;
      }

      if (runtime.focusTunnelDepth > 0 && selectedNodeId && node.id !== selectedNodeId) {
        const isNeighbor = visibleState.related.has(node.id);
        if (
          visibleState.related.size > 0 &&
          !isNeighbor &&
          !runtime.selectedPath.includes(node.id)
        ) {
          ctx.globalAlpha = 0.22;
        }
      }

      ctx.fillStyle = QUALITY_COLORS[state] ?? '#6b7280';
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      ctx.fill();

      if (meta.selected || runtime.selectedPath.includes(node.id)) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, point.radius + 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (
        runtime.zoomLevel !== 'overview' &&
        (!selected || node.id === selected || directNeighbors.has(node.id))
      ) {
        ctx.fillStyle = `${stylePaper(runtime.environment)}c0`;
        const tag = node.aliases[0] ?? node.id;
        const name = `${node.name} `;
        const labelWidth = Math.max(44, name.length * 7 + 12);
        const px = point.x + point.radius + 4;
        const py = point.y - 1;
        ctx.fillRect(px - 4, py - 11, labelWidth, 20);

        ctx.fillStyle = styleText(runtime.environment);
        ctx.font = `12px Georgia, serif`;
        ctx.fillText(name, px, py + 5);

        if (runtime.zoomLevel === 'detail') {
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.fillText(tag, px, py + 16);
        }
      }

      ctx.globalAlpha = 1;
    }

    if (selectedNodeId && runtime.zoomLevel !== 'overview') {
      const selectedPoint = layout.positions[selectedNodeId];
      if (selectedPoint) {
        ctx.beginPath();
        ctx.arc(selectedPoint.x, selectedPoint.y, selectedPoint.radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    this.renderMiniMap(graph, layout, runtime, width, height);
    this.attachPositions(layout.positions);
  }

  bindPicking(): void {
    this.canvas.addEventListener('click', (event) => {
      if (!this.onNodePick) {
        return;
      }

      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const candidate = Object.entries(this.canvasPositions).find(([, value]) => {
        const dx = value.x - x;
        const dy = value.y - y;
        const threshold = value.radius + 5;
        return dx * dx + dy * dy <= threshold * threshold;
      });
      if (candidate) {
        this.onNodePick(candidate[0]);
      }
    });
  }

  private canvasPositions: Record<string, CanvasPoint> = {};

  private attachPositions(
    positions: Record<string, { x: number; y: number; radius: number }>,
  ): void {
    this.canvasPositions = positions;
  }

  private renderDenseOverview(
    ctx: CanvasRenderingContext2D,
    graph: GraphDocument,
    layout: MeridianLayoutResult,
    runtime: RuntimeState,
    truthMap: Map<string, TruthState>,
    width: number,
    height: number,
  ): Map<string, { x: number; y: number }> {
    const clusters = [...layout.clusters].sort((a, b) => a.id.localeCompare(b.id));
    const columns = Math.min(3, Math.max(1, clusters.length));
    const rows = Math.ceil(clusters.length / columns);
    const leftMargin = Math.min(150, width * 0.16);
    const rightMargin = Math.min(260, width * 0.27);
    const marginY = Math.min(120, height * 0.18);
    const availableWidth = Math.max(1, width - leftMargin - rightMargin);
    const availableHeight = Math.max(1, height - marginY * 2);
    const positions = new Map<string, { x: number; y: number }>();
    clusters.forEach((cluster, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const rowCount = Math.min(columns, clusters.length - row * columns);
      const centeredColumn = column + (columns - rowCount) / 2;
      positions.set(cluster.id, {
        x:
          leftMargin +
          (columns === 1 ? availableWidth / 2 : (centeredColumn * availableWidth) / (columns - 1)),
        y: marginY + (rows === 1 ? availableHeight / 2 : (row * availableHeight) / (rows - 1)),
      });
    });

    const nodeCluster = new Map(
      graph.nodes.map((node) => [node.id, node.clusterId ?? 'unclustered']),
    );
    const aggregateEdges = new Map<string, number>();
    graph.edges.forEach((edge) => {
      const source = nodeCluster.get(edge.source);
      const target = nodeCluster.get(edge.target);
      if (
        !source ||
        !target ||
        source === target ||
        !positions.has(source) ||
        !positions.has(target)
      )
        return;
      const key = source < target ? `${source}\u0000${target}` : `${target}\u0000${source}`;
      aggregateEdges.set(key, (aggregateEdges.get(key) ?? 0) + 1);
    });

    aggregateEdges.forEach((count, key) => {
      const [sourceId, targetId] = key.split('\u0000');
      const source = sourceId ? positions.get(sourceId) : undefined;
      const target = targetId ? positions.get(targetId) : undefined;
      if (!source || !target) return;
      ctx.strokeStyle =
        runtime.environment === 'dark' ? 'rgba(255,139,98,.48)' : 'rgba(158,61,33,.38)';
      ctx.lineWidth = Math.min(6, 1 + Math.log2(count + 1));
      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      ctx.fillStyle = stylePaper(runtime.environment);
      ctx.beginPath();
      ctx.arc(midX, midY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = styleText(runtime.environment);
      ctx.font = '700 9px ui-sans-serif, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(String(count), midX, midY + 3);
    });

    clusters.forEach((cluster) => {
      const point = positions.get(cluster.id);
      if (!point) return;
      const nodes = graph.nodes.filter((node) => node.clusterId === cluster.id);
      const exceptions = nodes.filter(
        (node) => (truthMap.get(node.id) ?? 'unknown') !== 'fresh',
      ).length;
      const cardWidth = Math.min(170, Math.max(130, availableWidth / columns - 18));
      const cardHeight = 76;
      ctx.fillStyle = stylePaper(runtime.environment);
      ctx.strokeStyle =
        runtime.environment === 'dark' ? 'rgba(242,239,232,.22)' : 'rgba(29,33,31,.22)';
      ctx.lineWidth = 1;
      drawRoundedRect(
        ctx,
        point.x - cardWidth / 2,
        point.y - cardHeight / 2,
        cardWidth,
        cardHeight,
        10,
      );
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = exceptions > 0 ? QUALITY_COLORS.aging : QUALITY_COLORS.fresh;
      ctx.beginPath();
      ctx.arc(point.x - cardWidth / 2 + 18, point.y - 13, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.textAlign = 'left';
      ctx.fillStyle = styleText(runtime.environment);
      ctx.font = '700 12px Georgia, serif';
      ctx.fillText(cluster.label, point.x - cardWidth / 2 + 31, point.y - 9);
      ctx.fillStyle = runtime.environment === 'dark' ? '#bbc1bc' : '#565d58';
      ctx.font = '700 9px ui-sans-serif, sans-serif';
      ctx.fillText(
        `${nodes.length} entities · ${exceptions} exceptions`,
        point.x - cardWidth / 2 + 14,
        point.y + 15,
      );
      ctx.fillText(
        'Select through search or semantic list',
        point.x - cardWidth / 2 + 14,
        point.y + 29,
      );
    });

    ctx.textAlign = 'left';
    ctx.fillStyle = styleText(runtime.environment);
    ctx.font = '700 11px ui-sans-serif, sans-serif';
    ctx.fillText(
      `${clusters.length} territories · ${graph.nodes.length} entities · ${graph.edges.length} edges summarized`,
      18,
      height - 18,
    );
    return positions;
  }

  private renderDenseMiniMap(
    positions: Map<string, { x: number; y: number }>,
    runtime: RuntimeState,
    width: number,
    height: number,
  ): void {
    if (!this.minimap) return;
    const ctx = this.minimap.getContext('2d');
    if (!ctx) return;
    const mapRect = this.minimap.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.minimap.width = Math.max(150, Math.floor(mapRect.width * dpr));
    this.minimap.height = Math.max(90, Math.floor(mapRect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, mapRect.width, mapRect.height);
    ctx.fillStyle = stylePaper(runtime.environment);
    ctx.fillRect(0, 0, mapRect.width, mapRect.height);
    ctx.fillStyle = runtime.environment === 'stable' ? '#9e3d21' : '#ff9b75';
    for (const point of positions.values()) {
      ctx.beginPath();
      ctx.arc(
        (point.x / Math.max(1, width)) * mapRect.width,
        (point.y / Math.max(1, height)) * mapRect.height,
        4,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  private renderMiniMap(
    graph: GraphDocument,
    layout: ReturnType<typeof meridianLayout>,
    runtime: RuntimeState,
    width: number,
    height: number,
  ): void {
    if (!this.minimap) {
      return;
    }

    const ctx = this.minimap.getContext('2d');
    if (!ctx) {
      return;
    }

    const mapRect = this.minimap.getBoundingClientRect();
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    this.minimap.width = Math.max(150, Math.floor(mapRect.width * dpr));
    this.minimap.height = Math.max(90, Math.floor(mapRect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mapWidth = mapRect.width;
    const mapHeight = mapRect.height;
    const mapMargin = 6;

    const bounds = { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity };
    Object.values(layout.positions).forEach((point) => {
      bounds.x = Math.min(bounds.x, point.x);
      bounds.y = Math.min(bounds.y, point.y);
      bounds.x2 = Math.max(bounds.x2, point.x);
      bounds.y2 = Math.max(bounds.y2, point.y);
    });

    const scaleX = (mapWidth - mapMargin * 2) / Math.max(1, bounds.x2 - bounds.x);
    const scaleY = (mapHeight - mapMargin * 2) / Math.max(1, bounds.y2 - bounds.y);
    const scale = Math.min(scaleX, scaleY);

    ctx.fillStyle = stylePaper(runtime.environment);
    ctx.fillRect(0, 0, mapWidth, mapHeight);

    for (const cluster of layout.clusters) {
      const { x1, y1, x2, y2 } = cluster.bounds;
      const cx = mapMargin + (x1 - bounds.x) * scale;
      const cy = mapMargin + (y1 - bounds.y) * scale;
      const cw = Math.max(8, (x2 - x1) * scale);
      const ch = Math.max(8, (y2 - y1) * scale);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      roundedClusterPath(ctx, cx, cy, cx + cw, cy + ch);
      ctx.stroke();
    }

    Object.values(layout.positions).forEach((point) => {
      const x = mapMargin + (point.x - bounds.x) * scale;
      const y = mapMargin + (point.y - bounds.y) * scale;
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(x, y, 1.7, 0, Math.PI * 2);
      ctx.fill();
    });

    const viewportX =
      mapMargin +
      (runtime.selectedNodeId
        ? (layout.positions[runtime.selectedNodeId]?.x ?? 0 - bounds.x) * scale
        : 0);
    const viewportY =
      mapMargin +
      (runtime.selectedNodeId
        ? (layout.positions[runtime.selectedNodeId]?.y ?? 0 - bounds.y) * scale
        : 0);

    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1;
    const vw = Math.max(6, (width / Math.max(1, graph.nodes.length + 2)) * scale);
    const vh = Math.max(6, (height / Math.max(1, graph.nodes.length + 2)) * scale);
    ctx.strokeRect(viewportX - vw / 2, viewportY - vh / 2, vw, vh);

    this.renderMiniMapLabel(ctx, mapWidth, mapHeight, graph.nodes.length);
  }

  private renderMiniMapLabel(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    nodes: number,
  ): void {
    ctx.fillStyle = '#0f172a';
    ctx.font = '10px Georgia, serif';
    ctx.fillText(`${nodes} nodes`, 6, height - 4);
  }
}
