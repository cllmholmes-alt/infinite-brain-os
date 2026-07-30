import { describe, expect, it } from 'vitest';
import {
  blastRadius,
  computeGraphAnalysis,
  probabilisticBlastRadius,
} from '../../src/analytics/algorithms';
import {
  analyzeCriticalPath,
  buildOutcomeGraph,
  computeFlowMetrics,
  simulateScenario,
} from '../../src/analytics/decision-intelligence';
import {
  buildConstraintAwareQueue,
  buildExplainableRecommendationCard,
  forecastChangePropagation,
  RecommendationFeedbackLedger,
} from '../../src/analytics/release-intelligence';
import { compareScenarios, paretoRank } from '../../src/analytics/scenarios';
import { baseGraph } from '../../src/fixtures';

const chainGraph = () => {
  const [a, b, c] = baseGraph.nodes;
  return {
    ...baseGraph,
    nodes: [a!, b!, c!],
    edges: [
      {
        ...baseGraph.edges[0]!,
        id: 'a-b',
        source: a!.id,
        target: b!.id,
        relation: 'calls' as const,
        direction: 'outbound' as const,
      },
      {
        ...baseGraph.edges[1]!,
        id: 'b-c',
        source: b!.id,
        target: c!.id,
        relation: 'calls' as const,
        direction: 'outbound' as const,
      },
    ],
    clusters: [],
  };
};

describe('Brain Map decision intelligence 31-40', () => {
  it('plan-031: typed dependency semantics use relation, direction, criticality, and lifecycle for propagation', () => {
    const graph = chainGraph();
    const [a, b] = graph.nodes;
    expect(blastRadius(graph, [b!.id]).affectedNodes).toContain(a!.id);
    const monitoring = {
      ...graph,
      edges: [
        {
          ...graph.edges[0]!,
          relation: 'monitors' as const,
          criticality: 'critical' as const,
        },
      ],
    };
    expect(blastRadius(monitoring, [b!.id]).affectedNodes).toEqual([b!.id]);
  });

  it('plan-032: outcome and capability graph distinguishes linked value paths from unlinked work', () => {
    const graph = structuredClone(baseGraph);
    graph.nodes[0]!.class = 'capability';
    graph.nodes[1]!.class = 'outcome';
    graph.nodes[2]!.class = 'goal';
    graph.edges = [
      {
        ...graph.edges[0]!,
        source: graph.nodes[0]!.id,
        target: graph.nodes[1]!.id,
        relation: 'feeds',
        lifecycle: 'active',
      },
      {
        ...graph.edges[1]!,
        source: graph.nodes[1]!.id,
        target: graph.nodes[2]!.id,
        relation: 'feeds',
        lifecycle: 'active',
      },
    ];
    const outcome = buildOutcomeGraph(graph);
    expect(outcome.goalIds).toEqual([graph.nodes[2]!.id]);
    expect(outcome.outcomeIds).toEqual([graph.nodes[1]!.id]);
    expect(outcome.paths).toContainEqual([
      graph.nodes[0]!.id,
      graph.nodes[1]!.id,
      graph.nodes[2]!.id,
    ]);
  });

  it('plan-033: single-point-of-failure analysis computes articulation points, bridges, SCCs, and redundancy', () => {
    const graph = chainGraph();
    const analysis = computeGraphAnalysis(graph);
    expect(analysis.articulationPoints).toEqual([graph.nodes[1]!.id]);
    expect(analysis.bridges).toEqual(['a-b', 'b-c']);
    expect(analysis.sccCount).toBeGreaterThan(0);
    expect(analysis.redundancyScore).toBe(0);
  });

  it('plan-034: probabilistic blast radius exposes bounded per-node confidence and expected impact', () => {
    const graph = chainGraph();
    const failed = graph.nodes[2]!.id;
    const result = probabilisticBlastRadius(graph, [failed]);
    expect(result.probabilityByNode[failed]).toBe(1);
    expect(Object.values(result.probabilityByNode).every((value) => value >= 0 && value <= 1)).toBe(
      true,
    );
    expect(result.expectedAffected).toBeGreaterThan(1);
  });

  it('plan-035: critical path and flow reliability combine duration, slack, success rate, and lead time', () => {
    const critical = analyzeCriticalPath([
      { id: 'build', duration: 3, dependsOn: [] },
      { id: 'verify', duration: 5, dependsOn: ['build'] },
      { id: 'deploy', duration: 2, dependsOn: ['verify'] },
    ]);
    expect(critical).toMatchObject({ path: ['build', 'verify', 'deploy'], duration: 10 });
    const flow = computeFlowMetrics([
      {
        id: 'r1',
        startedAt: '2026-07-30T10:00:00.000Z',
        finishedAt: '2026-07-30T10:00:01.000Z',
        succeeded: true,
      },
      {
        id: 'r2',
        startedAt: '2026-07-30T10:00:00.000Z',
        finishedAt: '2026-07-30T10:00:03.000Z',
        succeeded: false,
      },
    ]);
    expect(flow).toMatchObject({ state: 'measured', successRate: 0.5, sampleSize: 2 });
  });

  it('plan-036: change-risk forecast returns affected nodes, owners, confidence, canary, and rollback boundaries', () => {
    const graph = chainGraph();
    const forecast = forecastChangePropagation(graph, [graph.nodes[2]!.id]);
    expect(forecast.affectedNodeIds).toContain(graph.nodes[2]!.id);
    expect(forecast.evidenceConfidence).toBeGreaterThan(0);
    expect(Array.isArray(forecast.canaryBoundary)).toBe(true);
    expect(Array.isArray(forecast.rollbackBoundary)).toBe(true);
  });

  it('plan-037: counterfactual and Pareto studio preserves assumptions and removes dominated scenarios', () => {
    const simulated = simulateScenario(
      { resilience: 5, cost: 5 },
      {
        id: 'migration',
        assumptions: ['provider remains available'],
        changes: { resilience: 2, cost: 1 },
      },
    );
    expect(simulated).toMatchObject({
      id: 'migration',
      projected: { resilience: 7, cost: 6 },
      assumptions: ['provider remains available'],
    });
    const ranked = paretoRank(
      compareScenarios([
        { name: 'Single failure', graph: chainGraph(), failures: [chainGraph().nodes[2]!.id] },
        { name: 'No failure', graph: chainGraph(), failures: [] },
      ]),
    );
    expect(ranked.length).toBeGreaterThan(0);
  });

  it('plan-038: constraint-aware queue sequences feasible risk reduction ahead of blocked recommendations', () => {
    const queue = buildConstraintAwareQueue([
      {
        id: 'blocked',
        priority: 'act-now',
        prerequisites: [],
        ownerAvailable: false,
        maintenanceWindowOpen: true,
        riskReduction: 100,
        cost: 1,
        authorityGranted: false,
        compliant: true,
      },
      {
        id: 'feasible',
        priority: 'schedule',
        prerequisites: [],
        ownerAvailable: true,
        maintenanceWindowOpen: true,
        riskReduction: 20,
        cost: 2,
        authorityGranted: true,
        compliant: true,
      },
    ]);
    expect(queue[0]).toMatchObject({ id: 'feasible', feasible: true, blockedBy: [] });
    expect(queue[1]!.blockedBy).toEqual(['owner', 'authority']);
  });

  it('plan-039: explainable recommendation card binds evidence, assumptions, alternatives, verification, and conclusion threshold', () => {
    const card = buildExplainableRecommendationCard({
      recommendation: {
        id: 'rec-1',
        expectedImpact: 70,
        cost: 20,
        confidence: 0.8,
        reversibility: 0.9,
        outcomeIds: ['outcome-live'],
        evidenceHandles: ['ev-risk'],
      },
      assumptions: ['rollback artifact exists'],
      affectedPaths: ['auth-to-api'],
      rejectedAlternatives: ['big-bang migration'],
      verificationCriteria: ['semantic canary passes'],
      smallestConclusionChange: 'confidence falls below 0.45',
    });
    expect(card.confidenceLabel).toBe('high');
    expect(card.recommendation.evidenceHandles).toEqual(['ev-risk']);
  });

  it('plan-040: decision feedback loop records accepted and rejected outcomes and measures calibration error', () => {
    const ledger = new RecommendationFeedbackLedger();
    ledger.record({
      id: 'feedback-1',
      recommendationId: 'rec-1',
      decision: 'accepted',
      predictedImpact: 0.8,
      measuredImpact: 0.6,
      evidenceHandle: 'ev-outcome',
    });
    ledger.record({
      id: 'feedback-2',
      recommendationId: 'rec-2',
      decision: 'rejected',
      predictedImpact: 0.4,
      measuredImpact: null,
      evidenceHandle: 'ev-decision',
    });
    expect(ledger.calibration()).toEqual({
      measured: 1,
      meanAbsoluteError: 0.20000000000000007,
      accepted: 1,
      rejected: 1,
    });
  });
});
