import type { GraphDocument, RuntimeState } from '../schema/types';
import type { SnapshotDiff } from '../events/diff';
import type { ScenarioResult } from '../analytics/scenarios';
import { paretoRank } from '../analytics/scenarios';
import { redactGraph } from '../export/redaction';
import { digestCanonical } from '../security/integrity';
import { buildRiskRegister, evaluateLaunchReadiness } from './operations';

export interface SavedView {
  id: string;
  title: string;
  createdAt: string;
  mode: 'observe' | 'explain' | 'act';
  zoom: 'overview' | 'neighborhood' | 'detail';
  focusNodeId: string | null;
  lenses: string[];
}

function validateSavedView(view: SavedView): void {
  if (!view.id.trim() || !view.title.trim() || !Number.isFinite(Date.parse(view.createdAt))) {
    throw new Error('saved-view-invalid');
  }
  if (!['observe', 'explain', 'act'].includes(view.mode))
    throw new Error('saved-view-mode-invalid');
  if (!['overview', 'neighborhood', 'detail'].includes(view.zoom)) {
    throw new Error('saved-view-zoom-invalid');
  }
  if (view.lenses.some((lens) => !/^[a-z0-9-]{1,40}$/i.test(lens))) {
    throw new Error('saved-view-lens-invalid');
  }
}

export class SavedViewStore {
  private views = new Map<string, SavedView>();

  save(view: SavedView): void {
    validateSavedView(view);
    this.views.set(view.id, structuredClone(view));
  }

  get(id: string): SavedView | undefined {
    const view = this.views.get(id);
    return view ? structuredClone(view) : undefined;
  }

  shareUrl(id: string, baseUrl: string): string {
    const view = this.views.get(id);
    if (!view) throw new Error('saved-view-missing');
    const url = new URL(baseUrl);
    url.searchParams.set('view', JSON.stringify(view));
    return url.toString();
  }

  restoreFromUrl(value: string): SavedView {
    const raw = new URL(value).searchParams.get('view');
    if (!raw || raw.length > 4_096) throw new Error('saved-view-payload-invalid');
    const parsed = JSON.parse(raw) as SavedView;
    validateSavedView(parsed);
    return structuredClone(parsed);
  }
}

export interface AnnotationComment {
  id: string;
  threadId: string;
  parentId?: string;
  actorId: string;
  createdAt: string;
  body: string;
  nodeId: string;
  evidenceHandle: string;
}

export class AnnotationThreadStore {
  private comments: AnnotationComment[] = [];

  append(comment: AnnotationComment): void {
    if (this.comments.some((entry) => entry.id === comment.id))
      throw new Error('duplicate-comment-id');
    if (!comment.threadId.trim() || !comment.actorId.trim() || !comment.nodeId.trim()) {
      throw new Error('comment-attribution-invalid');
    }
    if (!Number.isFinite(Date.parse(comment.createdAt)))
      throw new Error('comment-timestamp-invalid');
    if (!comment.body.trim() || comment.body.length > 2_000 || !comment.evidenceHandle.trim()) {
      throw new Error('comment-content-invalid');
    }
    if (
      comment.parentId &&
      !this.comments.some(
        (entry) => entry.id === comment.parentId && entry.threadId === comment.threadId,
      )
    ) {
      throw new Error('comment-parent-missing');
    }
    this.comments.push(structuredClone(comment));
  }

  thread(threadId: string): AnnotationComment[] {
    return structuredClone(this.comments.filter((comment) => comment.threadId === threadId));
  }
}

export function buildDecisionCockpit(
  scenarios: ScenarioResult[],
  evidenceHandles: string[],
): {
  scenarios: ScenarioResult[];
  pareto: ScenarioResult[];
  recommendation: ScenarioResult | null;
  assumptions: string[];
  evidenceHandles: string[];
  decisionStatus: 'unrecorded';
} {
  if (!evidenceHandles.length) throw new Error('decision-cockpit-evidence-required');
  const pareto = paretoRank(scenarios);
  return {
    scenarios: structuredClone(scenarios),
    pareto,
    recommendation: pareto[0] ?? null,
    assumptions: [
      'severity and affected count are minimized',
      'cost categories are ordinal and evidence-bound',
    ],
    evidenceHandles: [...new Set(evidenceHandles)].sort(),
    decisionStatus: 'unrecorded',
  };
}

export interface BriefingMetric {
  id: string;
  label: string;
  value: number | string | null;
  truthState: 'fresh' | 'unknown' | 'unavailable' | 'conflict' | 'stale';
  evidenceAt: string;
}

export function buildExecutiveBriefing(
  graph: GraphDocument,
  runtime: RuntimeState,
): { generatedAt: string; headline: string; metrics: BriefingMetric[]; exceptions: string[] } {
  const healthSignals = Object.values(graph.health);
  const truthState: BriefingMetric['truthState'] = healthSignals.length ? 'fresh' : 'unknown';
  return {
    generatedAt: graph.generatedAt,
    headline: healthSignals.length
      ? `${graph.nodes.length} entities with ${runtime.exceptionQueue.length} queued exceptions`
      : `${graph.nodes.length} entities; global health unknown`,
    metrics: [
      {
        id: 'estate',
        label: 'Entities',
        value: graph.nodes.length,
        truthState: 'fresh',
        evidenceAt: graph.generatedAt,
      },
      {
        id: 'health',
        label: 'Health signals',
        value: healthSignals.length || null,
        truthState,
        evidenceAt: graph.generatedAt,
      },
      {
        id: 'decisions',
        label: 'Recorded decisions',
        value: runtime.decisionLog.length,
        truthState: 'fresh',
        evidenceAt: runtime.lastUpdatedAt,
      },
    ],
    exceptions: [...runtime.exceptionQueue],
  };
}

export interface InboxItem {
  id: string;
  kind: 'conflict' | 'unavailable' | 'unknown' | 'stale';
  priority: number;
  entityId: string;
}

export function buildOperationsInbox(_graph: GraphDocument, runtime: RuntimeState): InboxItem[] {
  const groups: Array<[InboxItem['kind'], number, string[]]> = [
    ['conflict', 0, runtime.conflictItems],
    ['unavailable', 1, runtime.unavailableItems],
    ['unknown', 2, runtime.unknownItems],
    ['stale', 3, runtime.staleItems],
  ];
  return groups
    .flatMap(([kind, priority, ids]) =>
      [...new Set(ids)].map((entityId) => ({
        id: `${kind}:${entityId}`,
        kind,
        priority,
        entityId,
      })),
    )
    .sort(
      (left, right) =>
        left.priority - right.priority || left.entityId.localeCompare(right.entityId),
    );
}

export interface WatchDefinition {
  id: string;
  nodeIds: string[];
  channels: Array<'in-app' | 'email' | 'webhook'>;
}

export interface WatchNotification {
  watchId: string;
  nodeId: string;
  kind: 'node-added' | 'node-removed' | 'node-changed';
  createdAt: string;
  channel: WatchDefinition['channels'][number];
}

export class WatchlistStore {
  private watches = new Map<string, WatchDefinition>();

  watch(definition: WatchDefinition): void {
    if (!definition.id.trim() || !definition.nodeIds.length || !definition.channels.length) {
      throw new Error('watch-definition-invalid');
    }
    this.watches.set(definition.id, {
      ...structuredClone(definition),
      nodeIds: [...new Set(definition.nodeIds)].sort(),
      channels: [...new Set(definition.channels)].sort(),
    });
  }

  notify(diff: SnapshotDiff, createdAt: string): WatchNotification[] {
    if (!Number.isFinite(Date.parse(createdAt))) throw new Error('watch-timestamp-invalid');
    const changes = new Map<string, WatchNotification['kind']>();
    diff.nodesAdded.forEach((id) => changes.set(id, 'node-added'));
    diff.nodesRemoved.forEach((id) => changes.set(id, 'node-removed'));
    diff.nodesChanged.forEach((id) => changes.set(id, 'node-changed'));
    const notifications: WatchNotification[] = [];
    for (const watch of [...this.watches.values()].sort((a, b) => a.id.localeCompare(b.id))) {
      for (const nodeId of watch.nodeIds) {
        const kind = changes.get(nodeId);
        if (!kind) continue;
        for (const channel of watch.channels) {
          notifications.push({ watchId: watch.id, nodeId, kind, createdAt, channel });
        }
      }
    }
    return notifications;
  }
}

export function createEmbedPayload(
  graph: GraphDocument,
  scope: 'public' | 'internal' | 'confidential',
  generatedAt: string,
  ttlMs: number,
): { document: GraphDocument; generatedAt: string; expiresAt: string; integrity: string } {
  const now = Date.parse(generatedAt);
  if (!Number.isFinite(now) || !Number.isFinite(ttlMs) || ttlMs <= 0 || ttlMs > 86_400_000) {
    throw new Error('embed-expiry-invalid');
  }
  const document = redactGraph(graph, scope);
  return {
    document,
    generatedAt,
    expiresAt: new Date(now + ttlMs).toISOString(),
    integrity: `sha256-${digestCanonical(document)}`,
  };
}

export function exportExecutiveReport(
  graph: GraphDocument,
  runtime: RuntimeState,
  scope: 'public' | 'internal' | 'confidential',
  generatedAt: string,
): {
  generatedAt: string;
  document: GraphDocument;
  sections: Array<{ id: string; title: string; payload: unknown; evidenceAt: string }>;
  integrity: string;
} {
  if (!Number.isFinite(Date.parse(generatedAt))) throw new Error('report-timestamp-invalid');
  const document = redactGraph(graph, scope);
  const sections = [
    {
      id: 'estate',
      title: 'Estate',
      payload: { nodes: document.nodes.length, edges: document.edges.length },
      evidenceAt: graph.generatedAt,
    },
    {
      id: 'risk',
      title: 'Risk register',
      payload: buildRiskRegister(graph, runtime),
      evidenceAt: runtime.lastUpdatedAt,
    },
    {
      id: 'readiness',
      title: 'Release readiness',
      payload: evaluateLaunchReadiness(graph, runtime),
      evidenceAt: runtime.lastUpdatedAt,
    },
  ];
  return {
    generatedAt,
    document,
    sections,
    integrity: `sha256-${digestCanonical({ document, sections })}`,
  };
}

export interface GraphQuery {
  class?: GraphDocument['nodes'][number]['class'];
  lifecycle?: GraphDocument['nodes'][number]['lifecycle'];
  search?: string;
  cursor?: string;
  limit?: number;
}

export function queryGraph(
  graph: GraphDocument,
  query: GraphQuery,
): { items: GraphDocument['nodes']; nextCursor: string | null; total: number } {
  const limit = Math.max(1, Math.min(100, Math.floor(query.limit ?? 25)));
  const offset = query.cursor ? Number.parseInt(query.cursor, 10) : 0;
  if (!Number.isInteger(offset) || offset < 0) throw new Error('query-cursor-invalid');
  const search = query.search?.trim().toLocaleLowerCase() ?? '';
  const matching = graph.nodes
    .filter((node) => !query.class || node.class === query.class)
    .filter((node) => !query.lifecycle || node.lifecycle === query.lifecycle)
    .filter(
      (node) =>
        !search ||
        node.name.toLocaleLowerCase().includes(search) ||
        node.aliases.some((alias) => alias.toLocaleLowerCase().includes(search)),
    )
    .sort((left, right) => left.id.localeCompare(right.id));
  const items = structuredClone(matching.slice(offset, offset + limit));
  const nextOffset = offset + items.length;
  return {
    items,
    nextCursor: nextOffset < matching.length ? String(nextOffset) : null,
    total: matching.length,
  };
}

export function buildNarrativeWalkthrough(
  graph: GraphDocument,
  nodeIds: string[],
): {
  mode: 'presentation';
  steps: Array<{
    index: number;
    nodeId: string;
    title: string;
    available: boolean;
    truthState: 'unknown' | 'available';
  }>;
} {
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  return {
    mode: 'presentation',
    steps: nodeIds.map((nodeId, index) => {
      const node = byId.get(nodeId);
      return {
        index,
        nodeId,
        title: node?.name ?? `Unavailable entity: ${nodeId}`,
        available: Boolean(node),
        truthState: node ? 'available' : 'unknown',
      };
    }),
  };
}
