import { blastRadius, bottleneckEdges, computeGraphAnalysis } from '../analytics/algorithms';
import { computeRecommendations, recommendationQueue } from '../analytics/recommendations';
import { planCapabilities } from '../capabilities/plan.generated';
import { buildRuntimeTruthState, TruthState } from '../domain/truth';
import { redactGraph } from '../export/redaction';
import { baseGraph, denseGraph, stressGraph } from '../fixtures';
import {
  defaultRuntimeState,
  setMode,
  setSelectedNode,
  setZoomLevel,
  withRuntimeState,
} from '../graph/runtime';
import { MeridianRenderer } from '../render/meridian';
import { GraphDocument, NodeRecord, RuntimeState } from '../schema/types';
import { digestCanonical } from '../security/integrity';
import { parseViewState } from '../security/view-state';
import { buildEvidenceDrawerModel } from '../visualization/evidence-drawer';
import { appStyles } from './styles';
import { OperatorWorkbench, type WorkbenchContext } from './workbench';
import {
  acceptBoundWorkerResult,
  runLayoutWorker,
  verifyLayoutWorker,
  type LayoutWorkerRequest,
} from '../workers/graph-worker';

interface AppState {
  graph: GraphDocument;
  runtime: RuntimeState;
  lens: RuntimeState['activeLenses'][number];
  theme: RuntimeState['environment'];
  preset: string;
  inspectorTab: 'evidence' | 'impact' | 'actions';
  query: string;
}

const params = new URLSearchParams(location.search);
const safeView = parseViewState(location.search);
const initialTheme = ['light', 'dark', 'reduced-motion'].includes(params.get('theme') ?? '')
  ? (params.get('theme') as RuntimeState['environment'])
  : 'light';
const emptyGraph: GraphDocument = {
  ...structuredClone(baseGraph),
  nodes: [],
  edges: [],
  clusters: [],
  facts: {},
  runtimeFacts: {},
  health: {},
};
const initialGraph =
  safeView.preset === 'stress'
    ? stressGraph
    : safeView.preset === 'dense'
      ? denseGraph
      : safeView.preset === 'empty'
        ? emptyGraph
        : baseGraph;
const initialSelected = initialGraph.nodes.some((node) => node.id === safeView.selected)
  ? (safeView.selected ?? null)
  : null;

const state: AppState = {
  graph: initialGraph,
  runtime: withRuntimeState(defaultRuntimeState, {
    mode: safeView.mode,
    zoomLevel: safeView.zoom,
    environment: initialTheme,
    selectedNodeId: initialSelected,
    focusNodeId: initialSelected,
  }),
  lens: safeView.lens,
  theme: initialTheme,
  preset: safeView.preset,
  inspectorTab: 'evidence',
  query: '',
};

let renderer: MeridianRenderer | null = null;
let cachedAnalysisGraph: GraphDocument | null = null;
let cachedAnalysis: ReturnType<typeof computeGraphAnalysis> | null = null;
let lastRenderProfile: Record<string, number> = {};
const truthStates: TruthState[] = ['fresh', 'aging', 'stale', 'unknown', 'unavailable', 'conflict'];
const workbench = new OperatorWorkbench();
let modalReturnFocus: HTMLElement | null = null;
let productionWorkerPromise: Promise<{
  accepted: boolean;
  nodeCount: number;
  rendererNodeCount: number;
  revision: string;
  inputHash: string;
}> | null = null;

function graphAnalysis(): ReturnType<typeof computeGraphAnalysis> {
  if (cachedAnalysisGraph !== state.graph || !cachedAnalysis) {
    cachedAnalysisGraph = state.graph;
    cachedAnalysis = computeGraphAnalysis(state.graph);
  }
  return cachedAnalysis;
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function truthFor(node: NodeRecord): TruthState {
  if (state.preset === 'unknown') return 'unknown';
  if (state.preset === 'stale') return 'stale';
  if (state.preset === 'unavailable' || state.preset === 'error') return 'unavailable';
  if (state.preset === 'conflict') return 'conflict';
  return buildRuntimeTruthState(node.facts);
}

function truthMap(): Map<string, TruthState> {
  return new Map(state.graph.nodes.map((node) => [node.id, truthFor(node)]));
}

function truthCounts(): Record<TruthState, number> {
  const counts = Object.fromEntries(truthStates.map((item) => [item, 0])) as Record<
    TruthState,
    number
  >;
  state.graph.nodes.forEach((node) => {
    counts[truthFor(node)] += 1;
  });
  return counts;
}

function currentNode(): NodeRecord | null {
  return state.runtime.selectedNodeId
    ? (state.graph.nodes.find((node) => node.id === state.runtime.selectedNodeId) ?? null)
    : null;
}

function productRuntime(): RuntimeState {
  const entries = state.graph.nodes.map((node) => ({ id: node.id, truth: truthFor(node) }));
  const unknownItems = entries
    .filter((entry) => entry.truth === 'unknown')
    .map((entry) => entry.id);
  const staleItems = entries.filter((entry) => entry.truth === 'stale').map((entry) => entry.id);
  const conflictItems = entries
    .filter((entry) => entry.truth === 'conflict')
    .map((entry) => entry.id);
  const unavailableItems = entries
    .filter((entry) => entry.truth === 'unavailable')
    .map((entry) => entry.id);
  return withRuntimeState(state.runtime, {
    unknownItems,
    staleItems,
    conflictItems,
    unavailableItems,
    exceptionQueue: [...conflictItems, ...unavailableItems, ...unknownItems, ...staleItems],
  });
}

function workbenchContext(): WorkbenchContext {
  return {
    graph: state.graph,
    runtime: productRuntime(),
    lens: state.lens,
    selectedNodeId: state.runtime.selectedNodeId,
  };
}

function renderWorkbench(): void {
  setReviewedHtml(document.getElementById('workbench-body'), workbench.render(workbenchContext()));
}

function scheduleProductionWorker(graph: GraphDocument): void {
  renderer?.setWorkerLayout(null);
  if (graph.nodes.length < 100) {
    productionWorkerPromise = Promise.resolve({
      accepted: false,
      nodeCount: graph.nodes.length,
      rendererNodeCount: 0,
      revision: 'not-required',
      inputHash: 'not-required',
    });
    return;
  }
  const nodeIds = graph.nodes.map((node) => node.id).sort();
  const revision = `sha256-${digestCanonical({
    schemaVersion: graph.schemaVersion,
    generatedAt: graph.generatedAt,
    nodes: graph.nodes.length,
    edges: graph.edges.length,
  })}`;
  const inputHash = `sha256-${digestCanonical({
    nodeIds,
    edges: graph.edges.map((edge) => [edge.id, edge.source, edge.target, edge.direction]),
  })}`;
  const request: LayoutWorkerRequest = {
    type: 'layout',
    jobId: `layout-${revision.slice(7, 19)}`,
    revision,
    inputHash,
    seed: 0xb4a1c0de,
    nodeIds,
  };
  const requestedGraph = graph;
  productionWorkerPromise = runLayoutWorker(request).then((result) => {
    const accepted = requestedGraph === state.graph && acceptBoundWorkerResult(request, result);
    if (accepted) {
      renderer?.setWorkerLayout(result);
      renderCanvas();
    }
    return {
      accepted,
      nodeCount: result.nodeIds.length,
      rendererNodeCount: accepted ? (renderer?.workerLayoutNodeCount() ?? 0) : 0,
      revision,
      inputHash,
    };
  });
}

function relatedCount(nodeId: string): number {
  return state.graph.edges.filter((edge) => edge.source === nodeId || edge.target === nodeId)
    .length;
}

function iconLabel(lens: AppState['lens']): string {
  return {
    operations: 'OP',
    deployment: 'DP',
    data: 'DT',
    security: 'SC',
    governance: 'GV',
    'user-path': 'UX',
  }[lens];
}

function setReviewedHtml(target: Element | null, markup: string): void {
  if (!target) return;
  // SECURITY_REVIEWED_DOM_SINK: all external graph text is escaped before this boundary.
  target.innerHTML = markup;
}

function shell(root: HTMLElement): void {
  const style = document.createElement('style');
  style.textContent = appStyles;
  document.head.appendChild(style);
  setReviewedHtml(
    root,
    `
    <div class="app-shell" data-theme="${escapeHtml(state.theme)}" data-preset="${escapeHtml(state.preset)}" data-mode="${escapeHtml(state.runtime.mode)}">
      <header class="topbar">
        <div class="brand"><div class="brand-mark" aria-hidden="true"></div><div class="brand-copy"><div class="eyebrow">Operator system map</div><h1>Brain Map <span style="color:var(--ink-3);font-weight:500">v4</span></h1></div></div>
        <div class="mode-switch" role="group" aria-label="Operating mode">
          ${(['observe', 'explain', 'act'] as const).map((mode) => `<button data-mode="${mode}" aria-pressed="${state.runtime.mode === mode}">${mode[0]!.toUpperCase() + mode.slice(1)}</button>`).join('')}
        </div>
        <div class="top-actions">
          <div class="snapshot-chip" data-testid="snapshot-status"><span class="pulse"></span><span>Reference snapshot · evidence mixed</span></div>
          <button class="icon-button" id="motion-toggle" aria-label="Pause all motion" title="Pause all motion">Ⅱ</button>
          <button class="icon-button" id="theme-toggle" aria-label="Toggle light and dark theme" title="Toggle theme">◐</button>
          <button class="icon-button" id="list-toggle" aria-label="Open semantic tree" title="Semantic tree">☷</button>
          <button class="icon-button" id="workbench-toggle" aria-label="Open operator workbench" title="Operator workbench">WB</button>
          <button class="icon-button" id="ledger-toggle" aria-label="Open 100 item capability ledger" title="Capability ledger">100</button>
        </div>
      </header>
      <div class="workspace">
        <nav class="lens-rail" aria-label="Graph lenses">
          ${(['operations', 'deployment', 'data', 'security', 'governance', 'user-path'] as const).map((lens) => `<button class="lens-button" data-lens="${lens}" aria-label="${lens} lens" aria-pressed="${state.lens === lens}">${iconLabel(lens)}</button>`).join('')}
          <div class="lens-spacer"></div>
          <button class="lens-button" id="export-view" aria-label="Export redacted view">EX</button>
        </nav>
        <section class="graph-stage" aria-label="Ecosystem graph workspace">
          <div class="stage-head">
            <div class="stage-title"><div class="stage-title-row"><span class="lens-chip" id="lens-chip">${escapeHtml(state.lens)}</span><h2 id="stage-heading">Ecosystem topology</h2></div><p id="stage-subtitle">26 canonical entities · 36 typed relationships · 7 territories</p></div>
            <div class="stage-tools">
              <label class="search-box"><span class="sr-only">Search entities</span><input id="graph-search" type="search" autocomplete="off" placeholder="Find an entity or alias" value="${escapeHtml(state.query)}"></label>
              <div class="zoom-switch" role="group" aria-label="Semantic zoom">
                ${(['overview', 'neighborhood', 'detail'] as const).map((zoom) => `<button data-zoom="${zoom}" aria-pressed="${state.runtime.zoomLevel === zoom}">${zoom === 'neighborhood' ? 'Near' : zoom[0]!.toUpperCase()}</button>`).join('')}
              </div>
            </div>
          </div>
          <div class="canvas-shell" data-testid="graph-shell">
            <div class="canvas-grid"></div>
            <canvas id="main-canvas" role="img" aria-label="Brain Map ecosystem graph. Use the semantic tree for a text alternative."></canvas>
            <div class="canvas-kpis" id="canvas-kpis"></div>
            <div class="state-banner" id="state-banner"></div>
            <div class="minimap-card"><div class="minimap-label"><span>Territory map</span><span id="map-scale">100%</span></div><canvas id="mini-canvas" aria-label="Minimap viewport"></canvas></div>
            <div class="map-controls" aria-label="Map controls"><button id="select-core" aria-label="Focus core node">◎</button><button id="clear-focus" aria-label="Clear focus">×</button></div>
            <div class="command-queue" data-testid="priority-command-queue"></div>
            <div class="legend" aria-label="Evidence state legend"><span class="legend-item"><i class="legend-dot aging"></i>Aging</span><span class="legend-item"><i class="legend-dot stale"></i>Stale</span><span class="legend-item"><i class="legend-dot"></i>Unknown</span><span class="legend-item"><i class="legend-dot conflict"></i>Conflict</span></div>
          </div>
          <div class="timeline-strip" data-testid="operation-timeline">
            <div class="timeline-title"><b>Operation timeline</b><span>Append-only reference events</span></div>
            <div class="timeline-track"><div class="timeline-event"><b>Topology loaded</b>10:00</div><div class="timeline-event alert"><b>Evidence expired</b>10:12</div><div class="timeline-event"><b>Conflict retained</b>10:18</div><div class="timeline-event alert"><b>Collector unavailable</b>10:24</div></div>
            <div class="timeline-actions"><button class="secondary-action" id="incident-toggle">Incident view</button><button class="secondary-action" id="resume-view">Resume focus</button></div>
          </div>
        </section>
        <aside class="inspector" aria-label="Context inspector">
          <div class="inspector-head" id="inspector-head"></div>
          <div class="inspector-tabs" role="tablist"><button data-tab="evidence" role="tab">Evidence</button><button data-tab="impact" role="tab">Impact</button><button data-tab="actions" role="tab">Actions</button></div>
          <div class="inspector-body" id="inspector-body"></div>
        </aside>
      </div>
      <section class="mobile-projection" aria-label="List-first ecosystem view"><div class="mobile-head"><div class="eyebrow">List-first projection</div><h2>Ecosystem evidence</h2><p>Graph meaning without spatial navigation.</p></div><div id="mobile-detail" class="mobile-detail" hidden></div><div id="mobile-list"></div></section>
      <ul id="semantic-tree" role="tree" aria-label="Ecosystem semantic tree" class="sr-only"></ul>
      <div id="status" role="status" aria-live="polite" class="sr-only"></div>
    </div>
    <div class="modal-backdrop" id="ledger-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="ledger-title"><div class="capability-modal"><div class="modal-head"><div><div class="eyebrow">Acceptance evidence</div><h2 id="ledger-title">100-item capability ledger</h2></div><button class="icon-button" data-close-modal aria-label="Close capability ledger">×</button></div><div class="capability-list" id="capability-list"></div></div></div>
    <div class="modal-backdrop" id="tree-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="tree-title"><div class="capability-modal"><div class="modal-head"><div><div class="eyebrow">Accessible projection</div><h2 id="tree-title">Semantic entity list</h2></div><button class="icon-button" data-close-tree aria-label="Close semantic list">×</button></div><div class="capability-list" id="tree-list"></div></div></div>
    <div class="modal-backdrop" id="workbench-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="workbench-title"><div class="capability-modal workbench-modal"><div class="modal-head"><div><div class="eyebrow">Observe · Explain · Act</div><h2 id="workbench-title">Operator workbench</h2></div><button class="icon-button" data-close-workbench aria-label="Close operator workbench">×</button></div><div id="workbench-body"></div></div></div>
  `,
  );
}

function renderCanvas(): void {
  if (!renderer) return;
  renderer.render(state.graph, state.runtime, truthMap());
}

function renderHeader(): void {
  const counts = truthCounts();
  const observed = state.graph.nodes.filter((node) => Object.keys(node.facts).length > 0).length;
  const analysis = graphAnalysis();
  const kpis = document.getElementById('canvas-kpis');
  if (kpis)
    setReviewedHtml(
      kpis,
      `
    <div class="kpi"><b>${state.graph.nodes.length}</b><span>Entities</span></div>
    <div class="kpi"><b>${observed}/${state.graph.nodes.length}</b><span>With evidence</span></div>
    <div class="kpi"><b>${analysis.articulationPoints.length}</b><span>Cut points</span></div>`,
    );
  const banner = document.getElementById('state-banner');
  if (banner)
    setReviewedHtml(
      banner,
      `<strong>${counts.stale + counts.unknown + counts.unavailable + counts.conflict} exceptions</strong> · ${counts.fresh} fresh · ${counts.stale} stale · ${counts.unknown} unknown · ${counts.conflict} conflict`,
    );
  const heading = document.getElementById('stage-heading');
  const subtitle = document.getElementById('stage-subtitle');
  const chip = document.getElementById('lens-chip');
  if (chip) chip.textContent = state.lens;
  if (heading)
    heading.textContent =
      state.runtime.mode === 'observe'
        ? 'Ecosystem topology'
        : state.runtime.mode === 'explain'
          ? 'Dependency explanation'
          : 'Governed action surface';
  if (subtitle)
    subtitle.textContent = `${state.graph.nodes.length} canonical entities · ${state.graph.edges.length} typed relationships · ${state.graph.clusters.length} territories`;
}

function queueMarkup(): string {
  const priority: Record<TruthState, number> = {
    conflict: 0,
    unavailable: 1,
    unknown: 2,
    stale: 3,
    aging: 4,
    fresh: 5,
  };
  const entries = state.graph.nodes
    .map((node) => ({ node, truth: truthFor(node) }))
    .filter((entry) => entry.truth !== 'fresh')
    .sort(
      (left, right) =>
        priority[left.truth] - priority[right.truth] || left.node.id.localeCompare(right.node.id),
    )
    .slice(0, 3);
  return `<div class="command-head"><b>Priority command queue</b><span class="count-chip">${entries.length} exceptions</span></div>${
    entries.length
      ? entries
          .map(
            ({ node, truth }) =>
              `<button class="command-item" data-select-node="${escapeHtml(node.id)}"><i class="command-severity"></i><span><b>${escapeHtml(node.name)}</b><small>${escapeHtml(node.id)} · evidence state ${escapeHtml(truth)}</small></span><span class="command-state">${escapeHtml(truth)}</span></button>`,
          )
          .join('')
      : '<p>No evidence exceptions in the current projection.</p>'
  }`;
}

function evidenceRows(node: NodeRecord): string {
  const drawer = buildEvidenceDrawerModel(state.graph, node.id);
  return drawer.records.length
    ? drawer.records
        .map(
          (record) =>
            `<div class="truth-row"><i class="truth-marker"></i><div><b>${escapeHtml(record.field)}</b><small>${escapeHtml(record.sourceLabel)} · ${escapeHtml(record.observedAt ?? 'not observed')}<br>${escapeHtml(record.evidenceHandle)} · ${escapeHtml(record.confidence)} confidence</small></div><span class="truth-state">inspectable</span></div>`,
        )
        .join('')
    : '<p style="color:var(--ink-3);line-height:1.5">No evidence is attached. The state remains unknown.</p>';
}

function overviewInspector(): string {
  const analysis = graphAnalysis();
  const bottlenecks = bottleneckEdges(state.graph, 3);
  const recommendations = recommendationQueue(
    computeRecommendations(state.graph, state.runtime),
  ).slice(0, 3);
  if (state.runtime.mode === 'act' || state.inspectorTab === 'actions') return actionPanel(null);
  if (state.runtime.mode === 'explain' || state.inspectorTab === 'impact')
    return `
    <section class="panel-section"><div class="panel-label"><span>Decision cockpit</span><span>Evidence-limited</span></div><div class="panel-card"><div class="metric-grid"><div class="metric"><b>${analysis.articulationPoints.length}</b><span>Cut points</span></div><div class="metric"><b>${analysis.bridges.length}</b><span>Bridges</span></div><div class="metric"><b>${analysis.redundancyScore}%</b><span>Redundancy</span></div></div></div></section>
    <section class="panel-section"><div class="panel-label"><span>Scenario comparison</span><span>Dry run</span></div><div class="panel-card"><b style="font-size:11px">If the VPS evidence becomes unavailable</b><p style="color:var(--ink-3);font-size:10px;line-height:1.45">Transitive impact is shown as a model with reduced confidence. No mutation is performed.</p>${bottlenecks.map((item) => `<div class="provenance-line"><code>${escapeHtml(item.edgeId)}</code><p>${escapeHtml(item.source)} → ${escapeHtml(item.target)} · impact ${item.impact} · confidence ${item.confidence}</p></div>`).join('')}</div></section>`;
  return `
    <section class="panel-section"><div class="panel-label"><span>Truth quality</span><span>Unknown over green</span></div><div class="panel-card">${state.graph.sources.map((source) => `<div class="truth-row"><i class="truth-marker"></i><div><b>${escapeHtml(source.label)}</b><small>${escapeHtml(source.kind)} · authority rank ${source.authorityRank}</small></div><span class="truth-state">inspectable</span></div>`).join('')}</div></section>
    <section class="panel-section"><div class="panel-label"><span>Exception inbox</span><span>${recommendations.length}</span></div><div class="panel-card">${recommendations.map((item) => `<div class="provenance-line"><code>${escapeHtml(item.state)}</code><p><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.action)}</p></div>`).join('')}</div></section>
    <section class="panel-section"><div class="panel-label"><span>Goal alignment</span><span>Declared</span></div><div class="panel-card"><div class="truth-row"><i class="truth-marker" style="background:var(--ember)"></i><div><b>Reliable operator control plane</b><small>18 supporting entities · 3 unresolved constraints</small></div><span class="truth-state">review</span></div><div class="truth-row"><i class="truth-marker"></i><div><b>ADHD-OS submission readiness</b><small>4 supporting entities · owner attestation required</small></div><span class="truth-state">blocked</span></div></div></section>`;
}

function actionPanel(node: NodeRecord | null): string {
  const name = node?.name ?? 'ecosystem';
  return `
    <section class="panel-section"><div class="panel-label"><span>Action boundary</span><span>Read-only</span></div><div class="blocked-action"><strong>Dispatch blocked</strong><p>No verified actor authority, semantic canary, versioned runbook, or automatic rollback proof is attached for ${escapeHtml(name)}.</p><button class="primary-action" disabled>Execute mutation</button></div></section>
    <section class="panel-section"><div class="panel-label"><span>Dry-run preview</span><span>Non-mutating</span></div><div class="panel-card"><div class="provenance-line"><code>Binding</code><p>Source revision: ${escapeHtml(state.graph.schemaVersion)} at ${escapeHtml(state.graph.generatedAt)}. Normalized parameter hash is absent, so this preview cannot authorize dispatch.</p></div><div class="provenance-line"><code>Consequence</code><p>No mutation is dispatched. Directed blast radius is advisory until evidence and target revision are bound.</p></div><div class="provenance-line"><code>Reversibility</code><p>Rollback is unproven. A versioned rollback trigger and semantic canary are required.</p></div><div class="provenance-line"><code>Approval</code><p>Owner approval and independent verifier evidence are missing.</p></div></div></section>
    <section class="panel-section"><div class="panel-label"><span>Handoff packet</span><span>Ready</span></div><button class="secondary-action" id="copy-handoff">Copy exact blocker request</button></section>`;
}

function nodeInspector(node: NodeRecord): string {
  if (state.runtime.mode === 'act' || state.inspectorTab === 'actions') return actionPanel(node);
  if (state.runtime.mode === 'explain' || state.inspectorTab === 'impact') {
    const blast = blastRadius(state.graph, [node.id]);
    const connections = state.graph.edges.filter(
      (edge) => edge.source === node.id || edge.target === node.id,
    );
    return `<section class="panel-section"><div class="panel-label"><span>Directed impact</span><span>${blast.confidence} confidence</span></div><div class="panel-card"><div class="metric-grid"><div class="metric"><b>${connections.length}</b><span>Relations</span></div><div class="metric"><b>${blast.affectedNodes.length - 1}</b><span>Downstream</span></div><div class="metric"><b>${blast.severity}</b><span>Severity</span></div></div></div></section><section class="panel-section"><div class="panel-label"><span>Why connected</span><span>Typed</span></div><div class="panel-card">${connections.map((edge) => `<div class="provenance-line"><code>${escapeHtml(edge.relation)}</code><p>${escapeHtml(edge.source)} → ${escapeHtml(edge.target)} · ${escapeHtml(edge.criticality)} · ${escapeHtml(edge.direction)}</p></div>`).join('')}</div></section>`;
  }
  return `<section class="panel-section"><div class="panel-label"><span>Evidence envelope</span><span>${truthFor(node)}</span></div><div class="panel-card">${evidenceRows(node)}</div></section><section class="panel-section"><div class="panel-label"><span>Identity registry</span><span>Canonical</span></div><div class="panel-card"><div class="provenance-line"><code>${escapeHtml(node.id)}</code><p>Aliases: ${escapeHtml(node.aliases.join(', '))}<br>Lifecycle: ${escapeHtml(node.lifecycle)} · sensitivity: ${escapeHtml(node.sensitivity)}</p></div></div></section>`;
}

function renderInspector(): void {
  const node = currentNode();
  const head = document.getElementById('inspector-head');
  const body = document.getElementById('inspector-body');
  if (!head || !body) return;
  setReviewedHtml(
    head,
    `<div class="inspector-kicker"><span>${node ? escapeHtml(node.class) : 'decision surface'}</span><span>${node ? escapeHtml(truthFor(node)) : 'reference'}</span></div><div class="inspector-title"><div class="node-glyph">${node ? escapeHtml(node.name.slice(0, 2).toUpperCase()) : 'BM'}</div><div><h3>${node ? escapeHtml(node.name) : 'Ecosystem overview'}</h3><p>${node ? `${escapeHtml(node.clusterId ?? 'unclustered')} · ${relatedCount(node.id)} relationships` : 'Evidence, risk, decisions, and governed action'}</p></div></div>`,
  );
  setReviewedHtml(body, node ? nodeInspector(node) : overviewInspector());
  document
    .querySelectorAll<HTMLButtonElement>('[data-tab]')
    .forEach((tab) =>
      tab.setAttribute('aria-selected', String(tab.dataset.tab === state.inspectorTab)),
    );
}

function renderLists(): void {
  const filtered = state.graph.nodes.filter(
    (node) =>
      !state.query ||
      `${node.name} ${node.id} ${node.aliases.join(' ')}`
        .toLowerCase()
        .includes(state.query.toLowerCase()),
  );
  const windowLimit = state.graph.nodes.length > 250 ? 80 : filtered.length;
  const selected = currentNode();
  const windowed = filtered.slice(0, windowLimit);
  if (selected && filtered.includes(selected) && !windowed.includes(selected)) {
    windowed[windowed.length - 1] = selected;
  }
  const projectionNote =
    filtered.length > windowed.length
      ? `<p class="projection-window-note">Showing ${windowed.length} of ${filtered.length} matching entities. Search by name or alias to inspect the complete graph without rendering 1,000 DOM rows.</p>`
      : '';
  const rows = windowed
    .map(
      (node) =>
        `<button class="mobile-node" data-select-node="${escapeHtml(node.id)}" aria-pressed="${selected?.id === node.id}"><i class="dot"></i><span><b>${escapeHtml(node.name)}</b><small>${escapeHtml(node.clusterId ?? 'unclustered')} · ${relatedCount(node.id)} relations</small></span><span>${truthFor(node)}</span></button>`,
    )
    .join('');
  const mobile = document.getElementById('mobile-list');
  const mobileDetail = document.getElementById('mobile-detail');
  const treeList = document.getElementById('tree-list');
  setReviewedHtml(mobile, `${projectionNote}${rows}`);
  if (mobileDetail) {
    mobileDetail.toggleAttribute('hidden', !selected);
    setReviewedHtml(
      mobileDetail,
      selected
        ? `<div class="mobile-detail-head"><div><div class="eyebrow">Selected entity</div><h3>${escapeHtml(selected.name)}</h3></div><span class="truth-state">${escapeHtml(truthFor(selected))}</span></div><div class="inspector-tabs" role="tablist"><button data-tab="evidence" role="tab" aria-selected="${state.inspectorTab === 'evidence'}">Evidence</button><button data-tab="impact" role="tab" aria-selected="${state.inspectorTab === 'impact'}">Impact</button><button data-tab="actions" role="tab" aria-selected="${state.inspectorTab === 'actions'}">Actions</button></div>${nodeInspector(selected)}`
        : '',
    );
  }
  setReviewedHtml(treeList, `${projectionNote}${rows}` || '<p>No matching entities.</p>');
  const tree = document.getElementById('semantic-tree');
  setReviewedHtml(
    tree,
    `${windowed
      .map(
        (node, index) =>
          `<li role="treeitem" aria-selected="${selected?.id === node.id}" tabindex="${selected ? (selected.id === node.id ? '0' : '-1') : index === 0 ? '0' : '-1'}" data-tree-node="${escapeHtml(node.id)}">${escapeHtml(node.name)}, ${escapeHtml(truthFor(node))}, ${relatedCount(node.id)} relationships</li>`,
      )
      .join('')}`,
  );
}

function renderLedger(): void {
  const target = document.getElementById('capability-list');
  if (!target) return;
  setReviewedHtml(
    target,
    planCapabilities
      .map(
        (item) =>
          `<div class="capability-row"><code>${String(item.id).padStart(3, '0')}</code><div><b>${escapeHtml(item.title)}</b><div style="color:var(--ink-3);font-size:9px;margin-top:3px">${escapeHtml(item.workstream)}</div></div><code>${escapeHtml(item.source)}<br>${escapeHtml(item.testId)}</code><span class="pass">${escapeHtml(item.state)}</span></div>`,
      )
      .join(''),
  );
}

function render(): void {
  const profile: Record<string, number> = {};
  const phase = (name: string, operation: () => void): void => {
    const startedAt = performance.now();
    operation();
    profile[name] = Number((performance.now() - startedAt).toFixed(2));
  };
  const shellNode = document.querySelector<HTMLElement>('.app-shell');
  if (shellNode) {
    shellNode.dataset.theme = state.theme === 'stable' ? 'light' : state.theme;
    shellNode.dataset.preset = state.preset;
    shellNode.dataset.mode = state.runtime.mode;
  }
  document
    .querySelectorAll<HTMLButtonElement>('button[data-mode]')
    .forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.mode === state.runtime.mode)),
    );
  document
    .querySelectorAll<HTMLButtonElement>('[data-zoom]')
    .forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.zoom === state.runtime.zoomLevel)),
    );
  document
    .querySelectorAll<HTMLButtonElement>('[data-lens]')
    .forEach((button) =>
      button.setAttribute('aria-pressed', String(button.dataset.lens === state.lens)),
    );
  const queue = document.querySelector<HTMLElement>('.command-queue');
  phase('queue', () => setReviewedHtml(queue, queueMarkup()));
  phase('header', renderHeader);
  phase('canvas', renderCanvas);
  phase('inspector', renderInspector);
  phase('lists', renderLists);
  if (document.getElementById('workbench-modal')?.classList.contains('open')) {
    phase('workbench', renderWorkbench);
  }
  const status = document.getElementById('status');
  if (status)
    status.textContent = `${state.runtime.mode} mode, ${state.runtime.zoomLevel} zoom, ${state.graph.nodes.length} entities, ${state.runtime.selectedNodeId ? `focused on ${state.runtime.selectedNodeId}` : 'no entity selected'}`;
  lastRenderProfile = profile;
}

function selectNode(id: string | null): void {
  state.runtime = setSelectedNode(state.runtime, id);
  if (id) state.runtime = setZoomLevel(state.runtime, 'neighborhood');
  render();
}

function openModal(id: string): void {
  const modal = document.getElementById(id);
  if (!modal) return;
  modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  if (id === 'workbench-modal') renderWorkbench();
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.querySelector<HTMLElement>('.app-shell')?.setAttribute('inert', '');
  modal.querySelector<HTMLElement>('button')?.focus();
}

function closeModal(id: string): void {
  const modal = document.getElementById(id);
  if (!modal?.classList.contains('open')) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal-backdrop.open')) {
    document.querySelector<HTMLElement>('.app-shell')?.removeAttribute('inert');
  }
  const restore = modalReturnFocus;
  modalReturnFocus = null;
  restore?.focus();
}

function downloadJson(payload: unknown, filename: string): void {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(
    new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }),
  );
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function exportView(): void {
  const document = redactGraph(state.graph, 'public');
  const body = {
    document,
    view: { lens: state.lens, mode: state.runtime.mode, zoom: state.runtime.zoomLevel },
    redaction: 'public',
  };
  downloadJson(
    { ...body, integrity: `sha256-${digestCanonical(body)}` },
    'brain-map-v4-public-view.json',
  );
}

function wire(): void {
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const mode = target.closest<HTMLElement>('button[data-mode]')?.dataset.mode as
      RuntimeState['mode'] | undefined;
    const zoom = target.closest<HTMLElement>('[data-zoom]')?.dataset.zoom as
      RuntimeState['zoomLevel'] | undefined;
    const lens = target.closest<HTMLElement>('[data-lens]')?.dataset.lens as
      AppState['lens'] | undefined;
    const node = target.closest<HTMLElement>('[data-select-node]')?.dataset.selectNode;
    const tab = target.closest<HTMLElement>('[data-tab]')?.dataset.tab as
      AppState['inspectorTab'] | undefined;
    const workbenchTab = target.closest<HTMLElement>('[data-workbench-tab]')?.dataset.workbenchTab;
    const actionId = target.closest<HTMLButtonElement>('button')?.id;
    if (workbenchTab) {
      workbench.setTab(workbenchTab);
      renderWorkbench();
    } else if (actionId === 'save-current-view') {
      workbench.saveCurrentView(workbenchContext());
      renderWorkbench();
    } else if (actionId === 'watch-selected') {
      workbench.watchSelected(workbenchContext());
      renderWorkbench();
    } else if (actionId === 'prepare-dry-run') {
      workbench.prepareDryRun(workbenchContext());
      renderWorkbench();
    } else if (actionId === 'generate-report') {
      const report = workbench.generateReport(workbenchContext());
      downloadJson(report, 'brain-map-v4-internal-executive-report.json');
      renderWorkbench();
    } else if (actionId === 'open-incident') {
      workbench.openIncident();
      renderWorkbench();
    } else if (mode) {
      state.runtime = setMode(state.runtime, mode);
      state.inspectorTab = mode === 'act' ? 'actions' : mode === 'explain' ? 'impact' : 'evidence';
      render();
    } else if (zoom) {
      state.runtime = setZoomLevel(state.runtime, zoom);
      render();
    } else if (lens) {
      state.lens = lens;
      state.runtime = withRuntimeState(state.runtime, { activeLenses: [lens] });
      render();
    } else if (node) {
      selectNode(node);
      closeModal('tree-modal');
    } else if (tab) {
      state.inspectorTab = tab;
      renderInspector();
      renderLists();
    }
  });
  document.getElementById('graph-search')?.addEventListener('input', (event) => {
    state.query = (event.target as HTMLInputElement).value;
    renderLists();
  });
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    state.runtime = withRuntimeState(state.runtime, { environment: state.theme });
    render();
  });
  document.getElementById('motion-toggle')?.addEventListener('click', (event) => {
    const button = event.currentTarget as HTMLButtonElement;
    const paused = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!paused));
    state.runtime = withRuntimeState(state.runtime, {
      environment: paused ? state.theme : 'reduced-motion',
    });
    render();
  });
  document
    .getElementById('ledger-toggle')
    ?.addEventListener('click', () => openModal('ledger-modal'));
  document.getElementById('list-toggle')?.addEventListener('click', () => openModal('tree-modal'));
  document
    .getElementById('workbench-toggle')
    ?.addEventListener('click', () => openModal('workbench-modal'));
  document
    .querySelector('[data-close-modal]')
    ?.addEventListener('click', () => closeModal('ledger-modal'));
  document
    .querySelector('[data-close-tree]')
    ?.addEventListener('click', () => closeModal('tree-modal'));
  document
    .querySelector('[data-close-workbench]')
    ?.addEventListener('click', () => closeModal('workbench-modal'));
  document.getElementById('select-core')?.addEventListener('click', () => selectNode('ib'));
  document.getElementById('clear-focus')?.addEventListener('click', () => selectNode(null));
  document
    .getElementById('resume-view')
    ?.addEventListener('click', () =>
      selectNode(localStorage.getItem('brain-map-v4-focus') || 'ib'),
    );
  document.getElementById('incident-toggle')?.addEventListener('click', () => {
    state.lens = 'operations';
    state.preset = 'conflict';
    state.runtime = setMode(state.runtime, 'explain');
    state.inspectorTab = 'impact';
    render();
  });
  document.getElementById('export-view')?.addEventListener('click', exportView);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal('ledger-modal');
      closeModal('tree-modal');
      closeModal('workbench-modal');
    }
    const openDialog = document.querySelector<HTMLElement>('.modal-backdrop.open');
    if (event.key === 'Tab' && openDialog) {
      const focusable = [
        ...openDialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    if (
      (event.key === 'ArrowDown' || event.key === 'ArrowUp') &&
      document.activeElement?.getAttribute('role') === 'treeitem'
    ) {
      event.preventDefault();
      const items = [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')];
      const current = items.indexOf(document.activeElement as HTMLElement);
      const next =
        event.key === 'ArrowDown'
          ? Math.min(items.length - 1, current + 1)
          : Math.max(0, current - 1);
      items[next]?.focus();
    }
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (event.key === 'Enter' && active?.dataset.treeNode) selectNode(active.dataset.treeNode);
  });
}

export function bootstrap(): void {
  const root = document.getElementById('app-root');
  if (!root) return;
  shell(root);
  const main = document.getElementById('main-canvas') as HTMLCanvasElement;
  const mini = document.getElementById('mini-canvas') as HTMLCanvasElement;
  renderer = new MeridianRenderer(main, mini);
  renderer.setNodePickHandler((id) => {
    localStorage.setItem('brain-map-v4-focus', id);
    selectNode(id);
  });
  renderer.bindPicking();
  renderLedger();
  wire();
  render();
  scheduleProductionWorker(state.graph);
  window.addEventListener('resize', renderCanvas);
  (window as unknown as { brainMapV4: unknown }).brainMapV4 = {
    setPreset: (preset: string) => {
      state.preset = preset;
      state.graph =
        preset === 'stress'
          ? stressGraph
          : preset === 'dense'
            ? denseGraph
            : preset === 'empty'
              ? emptyGraph
              : baseGraph;
      state.runtime = setSelectedNode(state.runtime, null);
      render();
      scheduleProductionWorker(state.graph);
    },
    setTheme: (theme: RuntimeState['environment']) => {
      state.theme = theme;
      state.runtime = withRuntimeState(state.runtime, { environment: theme });
      render();
    },
    setZoom: (zoom: RuntimeState['zoomLevel']) => {
      state.runtime = setZoomLevel(state.runtime, zoom);
      render();
    },
    setMode: (mode: RuntimeState['mode']) => {
      state.runtime = setMode(state.runtime, mode);
      render();
    },
    selectNode,
    workerProof: verifyLayoutWorker,
    productionWorkerProof: async () =>
      productionWorkerPromise ?? {
        accepted: false,
        nodeCount: 0,
        rendererNodeCount: 0,
        revision: 'not-scheduled',
        inputHash: 'not-scheduled',
      },
    renderProfile: () => ({ ...lastRenderProfile }),
    snapshot: () => ({
      nodes: state.graph.nodes.length,
      edges: state.graph.edges.length,
      clusters: state.graph.clusters.length,
      projection:
        state.graph.nodes.length >= 100 && state.runtime.zoomLevel === 'overview'
          ? 'territory-aggregate'
          : 'entity-topology',
      counts: truthCounts(),
      mode: state.runtime.mode,
      zoom: state.runtime.zoomLevel,
      theme: state.theme,
      preset: state.preset,
    }),
  };
}

bootstrap();
