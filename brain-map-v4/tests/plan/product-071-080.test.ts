import { describe, expect, it } from 'vitest';
import { baseGraph } from '../../src/fixtures';
import { defaultRuntimeState } from '../../src/graph/runtime';
import { emptyGraph } from '../../src/graph/document';
import {
  AnnotationThreadStore,
  SavedViewStore,
  WatchlistStore,
  buildDecisionCockpit,
  buildExecutiveBriefing,
  buildOperationsInbox,
  createEmbedPayload,
  exportExecutiveReport,
  queryGraph,
} from '../../src/product/collaboration';
import { buildOperationalBriefing } from '../../src/product/briefing';

const now = '2026-07-30T12:00:00.000Z';

describe('Brain Map collaboration and communication 71-80', () => {
  it('plan-071: saves and restores validated shareable view state', () => {
    const store = new SavedViewStore();
    store.save({
      id: 'view-1',
      title: 'Risk focus',
      createdAt: now,
      mode: 'explain',
      zoom: 'detail',
      focusNodeId: baseGraph.nodes[0]!.id,
      lenses: ['risk'],
    });
    const url = store.shareUrl('view-1', 'https://example.com/brain-map');
    expect(store.restoreFromUrl(url)).toMatchObject({
      id: 'view-1',
      mode: 'explain',
      zoom: 'detail',
    });
  });

  it('plan-072: keeps evidence-bound threaded annotations immutable and attributable', () => {
    const store = new AnnotationThreadStore();
    store.append({
      id: 'comment-1',
      threadId: 'thread-1',
      actorId: 'operator',
      createdAt: now,
      body: 'Verify the provider response.',
      nodeId: baseGraph.nodes[0]!.id,
      evidenceHandle: 'ev-1',
    });
    store.append({
      id: 'comment-2',
      threadId: 'thread-1',
      parentId: 'comment-1',
      actorId: 'reviewer',
      createdAt: now,
      body: 'Confirmed.',
      nodeId: baseGraph.nodes[0]!.id,
      evidenceHandle: 'ev-2',
    });
    const comments = store.thread('thread-1');
    comments[0]!.body = 'mutated';
    expect(store.thread('thread-1')).toHaveLength(2);
    expect(store.thread('thread-1')[0]!.body).toBe('Verify the provider response.');
  });

  it('plan-073: compares scenarios and recommends without silently recording a decision', () => {
    const cockpit = buildDecisionCockpit(
      [
        { scenario: 'safe', affectedCount: 1, severity: 10, expectedCost: 'low' },
        { scenario: 'risky', affectedCount: 5, severity: 90, expectedCost: 'high' },
      ],
      ['ev-1'],
    );
    expect(cockpit.pareto.map((item) => item.scenario)).toEqual(['safe']);
    expect(cockpit.recommendation?.scenario).toBe('safe');
    expect(cockpit.decisionStatus).toBe('unrecorded');
  });

  it('plan-074: produces an executive briefing with timestamps and explicit uncertainty', () => {
    const briefing = buildExecutiveBriefing(emptyGraph([], now), defaultRuntimeState);
    expect(briefing.generatedAt).toBe(now);
    expect(briefing.metrics.every((metric) => metric.evidenceAt && metric.truthState)).toBe(true);
    expect(briefing.metrics.find((metric) => metric.id === 'health')?.truthState).toBe('unknown');
  });

  it('plan-075: orders conflicts and unavailable items ahead of unknown and stale inbox work', () => {
    const inbox = buildOperationsInbox(baseGraph, {
      ...defaultRuntimeState,
      conflictItems: ['c'],
      unavailableItems: ['u'],
      unknownItems: ['x'],
      staleItems: ['s'],
    });
    expect(inbox.map((item) => item.kind)).toEqual(['conflict', 'unavailable', 'unknown', 'stale']);
  });

  it('plan-076: watchlists emit deduplicated proactive change notifications only for watched nodes', () => {
    const store = new WatchlistStore();
    const watched = baseGraph.nodes[0]!.id;
    store.watch({ id: 'watch-1', nodeIds: [watched], channels: ['in-app'] });
    const notifications = store.notify(
      {
        nodesAdded: [],
        nodesRemoved: [],
        nodesChanged: [watched, 'other'],
        edgesAdded: [],
        edgesRemoved: [],
        edgesChanged: [],
        healthChanged: [],
        sourcesChanged: [],
        clustersChanged: [],
        factsChanged: [],
        runtimeFactsChanged: [],
        schemaChanged: false,
        generatedAtChanged: true,
      },
      now,
    );
    expect(notifications).toEqual([
      {
        watchId: 'watch-1',
        nodeId: watched,
        kind: 'node-changed',
        createdAt: now,
        channel: 'in-app',
      },
    ]);
  });

  it('plan-077: creates expiring redacted embed payloads without prohibited nodes', () => {
    const graph = structuredClone(baseGraph);
    graph.nodes[0]!.sensitivity = 'public';
    graph.nodes[1]!.sensitivity = 'prohibited';
    const embed = createEmbedPayload(graph, 'public', now, 60_000);
    expect(embed.document.nodes.some((node) => node.sensitivity === 'prohibited')).toBe(false);
    expect(embed.expiresAt).toBe('2026-07-30T12:01:00.000Z');
    expect(embed.integrity).toMatch(/^sha256-/);
  });

  it('plan-078: exports an evidence-bound executive report from a redacted graph', () => {
    const report = exportExecutiveReport(baseGraph, defaultRuntimeState, 'public', now);
    expect(report.generatedAt).toBe(now);
    expect(report.sections.map((section) => section.id)).toEqual(
      expect.arrayContaining(['readiness', 'risk', 'estate']),
    );
    expect(report.document.nodes.every((node) => node.sensitivity === 'public')).toBe(true);
  });

  it('plan-079: read-only graph query API filters, paginates, and does not mutate source', () => {
    const before = structuredClone(baseGraph);
    const result = queryGraph(baseGraph, { class: baseGraph.nodes[0]!.class, limit: 1 });
    expect(result.items).toHaveLength(1);
    expect(result.items[0]!.class).toBe(baseGraph.nodes[0]!.class);
    expect(baseGraph).toEqual(before);
  });

  it('plan-080: operational briefing narrates evidence-bound changes and keeps unresolved truth explicit', () => {
    const before = structuredClone(baseGraph);
    const after = structuredClone(baseGraph);
    after.generatedAt = now;
    after.nodes[0]!.ownerId = 'owner-new';
    const briefing = buildOperationalBriefing(before, after, {
      ...defaultRuntimeState,
      unknownItems: [after.nodes[1]!.id],
      unavailableItems: [after.nodes[2]!.id],
    });
    expect(briefing.generatedAt).toBe(now);
    expect(briefing.changes).toContain(`Ownership or facts changed for ${after.nodes[0]!.name}.`);
    expect(briefing.unresolvedTruth).toEqual([
      `unavailable:${after.nodes[2]!.id}`,
      `unknown:${after.nodes[1]!.id}`,
    ]);
    expect(briefing.evidenceAt).toEqual([before.generatedAt, after.generatedAt].sort());
  });
});
