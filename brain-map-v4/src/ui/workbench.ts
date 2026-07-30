import { compareScenarios } from '../analytics/scenarios';
import {
  ActionRegistry,
  buildApprovalPack,
  createDryRunPreview,
  type GovernedActionDefinition,
} from '../actions/governance';
import {
  SavedViewStore,
  WatchlistStore,
  buildDecisionCockpit,
  buildExecutiveBriefing,
  buildOperationsInbox,
  exportExecutiveReport,
} from '../product/collaboration';
import {
  buildRiskRegister,
  evaluateGoalProgress,
  evaluateLaunchReadiness,
  findTechnicalDebtHotspots,
} from '../product/operations';
import type { GraphDocument, RuntimeState } from '../schema/types';

export type WorkbenchTab = 'overview' | 'scenarios' | 'operations' | 'collaboration' | 'actions';

export interface WorkbenchContext {
  graph: GraphDocument;
  runtime: RuntimeState;
  lens: RuntimeState['activeLenses'][number];
  selectedNodeId: string | null;
}

const referenceAction: GovernedActionDefinition = {
  kind: 'request-evidence-refresh',
  title: 'Request evidence refresh',
  requiredAuthority: 'operator',
  requiredCapabilities: ['evidence:refresh'],
  risk: 'high',
  runbookId: 'runbook-evidence-refresh-v1',
  canaryRequired: true,
  rollbackRequired: true,
};

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export class OperatorWorkbench {
  private readonly savedViews = new SavedViewStore();
  private readonly watchlists = new WatchlistStore();
  private savedViewCount = 0;
  private watchedNodeId: string | null = null;
  private dryRunHash: string | null = null;
  private approvalIntegrity: string | null = null;
  private reportIntegrity: string | null = null;
  private incidentStatus: 'not-opened' | 'open' = 'not-opened';
  private tab: WorkbenchTab = 'overview';

  setTab(tab: string): void {
    const allowed: WorkbenchTab[] = [
      'overview',
      'scenarios',
      'operations',
      'collaboration',
      'actions',
    ];
    if (!allowed.includes(tab as WorkbenchTab)) throw new Error('workbench-tab-invalid');
    this.tab = tab as WorkbenchTab;
  }

  saveCurrentView(context: WorkbenchContext): void {
    const id = `view-${this.savedViewCount + 1}`;
    this.savedViews.save({
      id,
      title: `Brain Map view ${this.savedViewCount + 1}`,
      createdAt: context.runtime.lastUpdatedAt,
      mode: context.runtime.mode,
      zoom: context.runtime.zoomLevel,
      focusNodeId: context.selectedNodeId,
      lenses: [context.lens],
    });
    this.savedViewCount += 1;
  }

  watchSelected(context: WorkbenchContext): void {
    if (!context.selectedNodeId) throw new Error('workbench-watch-target-missing');
    this.watchlists.watch({
      id: 'selected-entity',
      nodeIds: [context.selectedNodeId],
      channels: ['in-app'],
    });
    this.watchedNodeId = context.selectedNodeId;
  }

  prepareDryRun(context: WorkbenchContext): void {
    const target = context.selectedNodeId ?? context.graph.nodes[0]?.id;
    if (!target) throw new Error('workbench-dry-run-target-missing');
    const preview = createDryRunPreview(
      referenceAction,
      { nodeId: target, requestedBy: 'local-viewer' },
      context.graph,
      context.runtime.lastUpdatedAt,
    );
    const pack = buildApprovalPack(
      referenceAction,
      preview,
      [`graph:${context.graph.schemaVersion}`, `target:${target}`],
      context.runtime.lastUpdatedAt,
    );
    this.dryRunHash = preview.previewHash;
    this.approvalIntegrity = pack.integrity;
  }

  generateReport(context: WorkbenchContext): ReturnType<typeof exportExecutiveReport> {
    const report = exportExecutiveReport(
      context.graph,
      context.runtime,
      'internal',
      context.runtime.lastUpdatedAt,
    );
    this.reportIntegrity = report.integrity;
    return report;
  }

  openIncident(): void {
    this.incidentStatus = 'open';
  }

  snapshot(): {
    tab: WorkbenchTab;
    savedViewCount: number;
    watchedNodeId: string | null;
    dryRunHash: string | null;
    reportIntegrity: string | null;
    incidentStatus: 'not-opened' | 'open';
  } {
    return {
      tab: this.tab,
      savedViewCount: this.savedViewCount,
      watchedNodeId: this.watchedNodeId,
      dryRunHash: this.dryRunHash,
      reportIntegrity: this.reportIntegrity,
      incidentStatus: this.incidentStatus,
    };
  }

  render(context: WorkbenchContext): string {
    const briefing = buildExecutiveBriefing(context.graph, context.runtime);
    const inbox = buildOperationsInbox(context.graph, context.runtime);
    const risks = buildRiskRegister(context.graph, context.runtime).slice(0, 5);
    const readiness = evaluateLaunchReadiness(context.graph, context.runtime);
    const goals = evaluateGoalProgress(context.graph);
    const debt = findTechnicalDebtHotspots(context.graph).slice(0, 5);
    const scenarioInputs = context.graph.nodes.slice(0, 2).map((node, index) => ({
      graph: context.graph,
      failures: [node.id],
      name: index === 0 ? `Lose ${node.name}` : `Degrade ${node.name}`,
    }));
    const scenarios = compareScenarios(scenarioInputs);
    const cockpit = buildDecisionCockpit(scenarios, [`graph:${context.graph.schemaVersion}`]);
    const actionRegistry = new ActionRegistry();
    actionRegistry.register(referenceAction);
    const authorization = actionRegistry.authorize(referenceAction.kind, 'viewer', []);
    const tabs: WorkbenchTab[] = [
      'overview',
      'scenarios',
      'operations',
      'collaboration',
      'actions',
    ];
    const tablist = `<div class="workbench-tabs" role="tablist" aria-label="Workbench sections">${tabs
      .map(
        (tab) =>
          `<button role="tab" data-workbench-tab="${tab}" aria-selected="${this.tab === tab}">${tab[0]!.toUpperCase() + tab.slice(1)}</button>`,
      )
      .join('')}</div>`;

    let panel: string;
    if (this.tab === 'overview') {
      panel = `<div role="tabpanel" class="workbench-grid">
        <section class="workbench-card"><div class="panel-label"><span>Executive briefing</span><span>${escapeHtml(briefing.generatedAt)}</span></div><h3>${escapeHtml(briefing.headline)}</h3><div class="metric-grid">${briefing.metrics.map((metric) => `<div class="metric"><b>${escapeHtml(metric.value ?? '—')}</b><span>${escapeHtml(metric.label)} · ${escapeHtml(metric.truthState)}</span></div>`).join('')}</div></section>
        <section class="workbench-card"><div class="panel-label"><span>Operations inbox</span><span>${inbox.length}</span></div>${
          inbox.length
            ? inbox
                .slice(0, 8)
                .map(
                  (item) =>
                    `<button class="workbench-row" data-select-node="${escapeHtml(item.entityId)}"><b>${escapeHtml(item.kind)}</b><span>${escapeHtml(item.entityId)}</span><code>P${item.priority}</code></button>`,
                )
                .join('')
            : '<p>No evidence exceptions in this projection.</p>'
        }</section>
        <section class="workbench-card"><div class="panel-label"><span>Risk register</span><span>${risks.length}</span></div>${risks.map((risk) => `<div class="workbench-row"><b>${escapeHtml(risk.title)}</b><span>${escapeHtml(risk.state)}</span><code>${risk.score}</code></div>`).join('')}</section>
        <section class="workbench-card"><div class="panel-label"><span>Release readiness</span><span>${readiness.state}</span></div><p>${readiness.blockers.length ? `${readiness.blockers.length} evidence-bound blockers remain.` : 'No blockers in the current projection.'}</p><code>${escapeHtml(readiness.graphRevision)}</code></section>
      </div>`;
    } else if (this.tab === 'scenarios') {
      panel = `<section role="tabpanel" class="workbench-card" data-testid="scenario-comparison"><div class="panel-label"><span>Scenario comparison</span><span>Pareto ${cockpit.pareto.length}/${scenarios.length}</span></div>${scenarios.length ? scenarios.map((scenario) => `<div class="workbench-row"><b>${escapeHtml(scenario.scenario)}</b><span>${scenario.affectedCount} affected · ${escapeHtml(scenario.expectedCost)} cost</span><code>${scenario.severity}</code></div>`).join('') : '<p>No entities are available for scenario analysis.</p>'}<p>${escapeHtml(cockpit.assumptions.join('; '))}.</p></section>`;
    } else if (this.tab === 'operations') {
      panel = `<div role="tabpanel" class="workbench-grid"><section class="workbench-card"><div class="panel-label"><span>Goal progress</span><span>${goals.length}</span></div>${goals.length ? goals.map((goal) => `<div class="workbench-row"><b>${escapeHtml(goal.nodeId)}</b><span>${escapeHtml(goal.state)}</span><code>${goal.progress ?? '—'}</code></div>`).join('') : '<p>No goal entities are present; progress remains unknown.</p>'}</section><section class="workbench-card"><div class="panel-label"><span>Technical debt</span><span>${debt.length}</span></div>${debt.length ? debt.map((item) => `<button class="workbench-row" data-select-node="${escapeHtml(item.nodeId)}"><b>${escapeHtml(item.nodeId)}</b><span>${escapeHtml(item.reasons.join(', '))}</span><code>${item.score}</code></button>`).join('') : '<p>No modeled debt hotspots.</p>'}</section><section class="workbench-card"><div class="panel-label"><span>Incident workspace</span><span>${this.incidentStatus}</span></div><p>Incident state is local and evidence-bound; opening it performs no external mutation.</p><button id="open-incident" class="secondary-action">Open local incident workspace</button></section></div>`;
    } else if (this.tab === 'collaboration') {
      panel = `<div role="tabpanel" class="workbench-grid"><section class="workbench-card"><div class="panel-label"><span>Saved views</span><span>${this.savedViewCount}</span></div><p>Current view state is validated before local storage.</p></section><section class="workbench-card"><div class="panel-label"><span>Watchlist</span><span>${escapeHtml(this.watchedNodeId ?? 'none')}</span></div><p>Notifications remain in-app unless an authorized channel is configured.</p></section><section class="workbench-card"><div class="panel-label"><span>Executive report</span><span>${this.reportIntegrity ? 'generated' : 'not generated'}</span></div><button id="generate-report" class="secondary-action">Generate internal report</button>${this.reportIntegrity ? `<code>${escapeHtml(this.reportIntegrity)}</code>` : ''}</section></div>`;
    } else {
      panel = `<section role="tabpanel" class="workbench-card"><div class="panel-label"><span>Governed action</span><span>${authorization.authorized ? 'authorized' : 'blocked'}</span></div><h3>${escapeHtml(referenceAction.title)}</h3><p>Viewer authority cannot dispatch. A dry run binds parameters to the current graph revision without mutating anything.</p><button id="prepare-dry-run" class="secondary-action">Prepare governed dry run</button><div data-testid="dry-run-state"><code>${escapeHtml(this.dryRunHash ?? 'not prepared')}</code>${this.approvalIntegrity ? `<p>Approval pack: ${escapeHtml(this.approvalIntegrity)}</p>` : ''}</div><button class="primary-action" aria-label="Execute governed action" disabled>Execute governed action</button><p>${escapeHtml(authorization.reasons.join(', '))}</p></section>`;
    }
    const quickActions = `<div class="workbench-quick"><button id="save-current-view" class="secondary-action">Save current view</button><span data-testid="saved-view-count">${this.savedViewCount}</span><button id="watch-selected" class="secondary-action" ${context.selectedNodeId ? '' : 'disabled'}>Watch selected entity</button><span data-testid="watch-state">${escapeHtml(this.watchedNodeId ?? 'none')}</span></div>`;
    return `${tablist}${quickActions}<div class="workbench-body">${panel}</div>`;
  }
}
