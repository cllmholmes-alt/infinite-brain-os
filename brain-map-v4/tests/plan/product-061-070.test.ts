import { describe, expect, it } from 'vitest';
import { baseGraph } from '../../src/fixtures';
import { defaultRuntimeState } from '../../src/graph/runtime';
import {
  DecisionLedger,
  buildComplianceFlow,
  buildDependencyView,
  buildLivingDocumentationGraph,
  buildRiskRegister,
  buildStewardshipMap,
  detectDocumentationDrift,
  evaluateGoalProgress,
  evaluateLaunchReadiness,
  findTechnicalDebtHotspots,
} from '../../src/product/operations';

const now = '2026-07-30T12:00:00.000Z';

describe('Brain Map product operations 61-70', () => {
  it('plan-061: builds living documentation links and reports orphan references', () => {
    const nodeId = baseGraph.nodes[0]!.id;
    const result = buildLivingDocumentationGraph(baseGraph, [
      { id: 'doc-1', title: 'Runbook', nodeIds: [nodeId, 'missing'], lastReviewedAt: now },
    ]);
    expect(result.links).toContainEqual({ documentId: 'doc-1', nodeId });
    expect(result.orphanReferences).toEqual([{ documentId: 'doc-1', nodeId: 'missing' }]);
  });

  it('plan-062: detects revision, missing-reference, and review-age documentation drift', () => {
    const result = detectDocumentationDrift(
      baseGraph,
      [
        {
          id: 'doc-old',
          title: 'Old',
          nodeIds: ['missing'],
          lastReviewedAt: '2026-01-01T00:00:00.000Z',
          graphRevision: 'wrong',
        },
      ],
      Date.parse(now),
      86_400_000,
    );
    expect(result[0]!.reasons).toEqual([
      'graph-revision',
      'missing-node:missing',
      'review-expired',
    ]);
  });

  it('plan-063: creates a stewardship map without assigning unknown owners', () => {
    const result = buildStewardshipMap(baseGraph);
    expect(result.unownedNodeIds.length).toBeGreaterThan(0);
    expect(Object.values(result.byOwner).flat()).not.toContain(undefined);
  });

  it('plan-064: records append-only evidence-bound decisions and rejects duplicates', () => {
    const ledger = new DecisionLedger();
    ledger.append({
      id: 'decision-1',
      title: 'Ship canary',
      decidedAt: now,
      actorId: 'operator',
      status: 'accepted',
      rationale: 'Evidence supports a bounded canary.',
      evidenceHandles: ['ev-1'],
      affectedNodeIds: [baseGraph.nodes[0]!.id],
    });
    expect(() => ledger.append({ ...ledger.list()[0]! })).toThrow('duplicate-decision-id');
    const external = ledger.list();
    external[0]!.title = 'mutated';
    expect(ledger.list()[0]!.title).toBe('Ship canary');
  });

  it('plan-065: builds an evidence-bound risk register with bounded scores', () => {
    const register = buildRiskRegister(baseGraph, {
      ...defaultRuntimeState,
      unknownItems: [baseGraph.nodes[0]!.id],
    });
    expect(register.every((risk) => risk.score >= 0 && risk.score <= 100)).toBe(true);
    expect(register.some((risk) => risk.evidence.length > 0)).toBe(true);
  });

  it('plan-066: isolates compliance and governance relationships into a flow', () => {
    const flow = buildComplianceFlow(baseGraph);
    expect(flow.edges.every((edge) => ['compliance', 'governs'].includes(edge.relation))).toBe(
      true,
    );
    expect(flow.nodeIds.every((id) => baseGraph.nodes.some((node) => node.id === id))).toBe(true);
  });

  it('plan-067: returns typed upstream and downstream dependency context', () => {
    const edge = baseGraph.edges[0]!;
    const result = buildDependencyView(baseGraph, edge.source);
    expect(
      result.outbound.some((item) => item.edgeId === edge.id && item.nodeId === edge.target),
    ).toBe(true);
  });

  it('plan-068: reports goal progress as unknown when no evidence-backed progress exists', () => {
    const graph = structuredClone(baseGraph);
    graph.nodes[0]!.class = 'goal';
    const goals = evaluateGoalProgress(graph);
    expect(goals[0]).toMatchObject({
      nodeId: graph.nodes[0]!.id,
      state: 'unknown',
      progress: null,
    });
  });

  it('plan-069: ranks degraded and bridge-linked technical debt hotspots', () => {
    const graph = structuredClone(baseGraph);
    graph.nodes[0]!.lifecycle = 'degraded';
    const hotspots = findTechnicalDebtHotspots(graph);
    expect(hotspots[0]!.score).toBeGreaterThan(0);
    expect(hotspots.some((entry) => entry.nodeId === graph.nodes[0]!.id)).toBe(true);
  });

  it('plan-070: launch readiness fails closed on unknown, stale, conflict, or unavailable truth', () => {
    const readiness = evaluateLaunchReadiness(baseGraph, {
      ...defaultRuntimeState,
      unknownItems: ['unknown-node'],
      conflictItems: ['conflict-node'],
    });
    expect(readiness.state).toBe('blocked');
    expect(readiness.blockers).toEqual(
      expect.arrayContaining(['unknown:unknown-node', 'conflict:conflict-node']),
    );
  });
});
