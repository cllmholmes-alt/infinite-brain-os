import { describe, expect, it } from 'vitest';
import {
  computeGraphAnalysis,
  criticalPaths,
  bottleneckEdges,
  blastRadius,
  probabilisticBlastRadius,
} from '../../src/analytics/algorithms';
import { baseGraph } from '../../src/fixtures';
import { computeRisk, topBottlenecks } from '../../src/analytics/risk';

describe('graph-intelligence analytics', () => {
  const firstNode = baseGraph.nodes[0];
  const secondNode = baseGraph.nodes[1];

  it('computes core analysis', () => {
    expect(firstNode).toBeDefined();
    expect(secondNode).toBeDefined();
    const result = computeGraphAnalysis(baseGraph);
    expect(result.weaklyConnectedComponents.length).toBeGreaterThan(0);
    expect(result.articulationPoints.length).toBeGreaterThanOrEqual(0);
  });

  it('computes path and bottlenecks', () => {
    const from = firstNode?.id;
    const to = secondNode?.id;
    const paths = criticalPaths(baseGraph, from ? [from] : [], to ? [to] : []);
    expect(Array.isArray(paths)).toBe(true);
    const bottlenecks = bottleneckEdges(baseGraph);
    expect(Array.isArray(bottlenecks)).toBe(true);
  });

  it('estimates blast radius and risk', () => {
    const start = firstNode?.id ?? '';
    const blast = blastRadius(baseGraph, start ? [start] : []);
    expect(blast.affectedNodes).toContain(start);
    const risk = computeRisk(baseGraph, start ? [start] : [], [], []);
    expect(risk.overallScore).toBeGreaterThanOrEqual(0);
    expect(topBottlenecks(baseGraph).length).toBeGreaterThanOrEqual(0);
  });

  it('keeps risk scores within 0 to 100 and penalizes conflicts', () => {
    const clean = computeRisk(baseGraph, [], [], []);
    const conflicted = computeRisk(baseGraph, [], [], ['conflict-1']);
    expect(clean.overallScore).toBeGreaterThanOrEqual(0);
    expect(clean.overallScore).toBeLessThanOrEqual(100);
    expect(conflicted.overallScore).toBeLessThan(clean.overallScore);
  });

  it('uses relationship semantics for failure propagation and excludes monitoring edges', () => {
    const [a, b, c] = baseGraph.nodes;
    const graph = {
      ...baseGraph,
      nodes: [a!, b!, c!],
      edges: [
        {
          ...baseGraph.edges[0]!,
          id: 'calls',
          source: a!.id,
          target: b!.id,
          relation: 'calls' as const,
          direction: 'outbound' as const,
        },
        {
          ...baseGraph.edges[1]!,
          id: 'monitors',
          source: c!.id,
          target: b!.id,
          relation: 'monitors' as const,
          direction: 'outbound' as const,
        },
      ],
      clusters: [],
    };
    expect(blastRadius(graph, [b!.id]).affectedNodes).toEqual([a!.id, b!.id].sort());
    expect(blastRadius(graph, [a!.id]).affectedNodes).toEqual([a!.id]);
  });

  it('treats explicit bidirectional dependency edges as affecting both sides', () => {
    const [a, b] = baseGraph.nodes;
    const graph = {
      ...baseGraph,
      nodes: [a!, b!],
      edges: [
        {
          ...baseGraph.edges[0]!,
          id: 'bidirectional-hosting',
          source: a!.id,
          target: b!.id,
          relation: 'hosts' as const,
          direction: 'bidirectional' as const,
        },
      ],
      clusters: [],
    };
    expect(blastRadius(graph, [b!.id]).affectedNodes).toEqual([a!.id, b!.id].sort());
  });

  it('does not report parallel edges as bridges and measures bottlenecks by removal impact', () => {
    const [a, b, c] = baseGraph.nodes;
    const graph = {
      ...baseGraph,
      nodes: [a!, b!, c!],
      edges: [
        { ...baseGraph.edges[0]!, id: 'parallel-a', source: a!.id, target: b!.id },
        { ...baseGraph.edges[0]!, id: 'parallel-b', source: a!.id, target: b!.id },
        { ...baseGraph.edges[0]!, id: 'only-c', source: b!.id, target: c!.id },
      ],
      clusters: [],
    };
    const analysis = computeGraphAnalysis(graph);
    expect(analysis.bridges).toEqual(['only-c']);
    const bottlenecks = bottleneckEdges(graph, 3);
    expect(bottlenecks.find((edge) => edge.edgeId === 'only-c')!.impact).toBeGreaterThan(
      bottlenecks.find((edge) => edge.edgeId === 'parallel-a')!.impact,
    );
  });

  it('returns confidence-bound probabilities rather than certainty for inferred blast radius', () => {
    const [a, b] = baseGraph.nodes;
    const graph = {
      ...baseGraph,
      nodes: [a!, b!],
      edges: [
        {
          ...baseGraph.edges[0]!,
          id: 'low-confidence-call',
          source: a!.id,
          target: b!.id,
          relation: 'calls' as const,
          confidence: 'low' as const,
        },
      ],
      clusters: [],
    };
    const result = probabilisticBlastRadius(graph, [b!.id]);
    expect(result.probabilityByNode[b!.id]).toBe(1);
    expect(result.probabilityByNode[a!.id]).toBeGreaterThan(0);
    expect(result.probabilityByNode[a!.id]).toBeLessThan(1);
  });
});
