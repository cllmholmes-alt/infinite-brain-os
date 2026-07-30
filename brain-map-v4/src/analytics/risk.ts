import { GraphDocument } from '../schema/types';
import { computeGraphAnalysis, blastRadius, bottleneckEdges } from './algorithms';

export interface RiskProfile {
  overallScore: number;
  unknownRatio: number;
  staleRatio: number;
  conflictCount: number;
  recommendationTags: string[];
}

export function computeRisk(
  graph: GraphDocument,
  runtimeUnknowns: string[],
  stale: string[],
  conflicts: string[],
): RiskProfile {
  const total = graph.nodes.length || 1;
  const unknownRatio = runtimeUnknowns.length / total;
  const staleRatio = stale.length / total;
  const conflictsCount = conflicts.length;

  const analysis = computeGraphAnalysis(graph);
  const conflictRatio = conflictsCount / total;
  const articulationRatio = analysis.articulationPoints.length / total;
  const bridgeRatio = analysis.bridges.length / Math.max(1, graph.edges.length);
  const penalty =
    unknownRatio * 45 +
    staleRatio * 25 +
    conflictRatio * 40 +
    articulationRatio * 20 +
    bridgeRatio * 10;
  const overallScore = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  const recommendationTags = [
    analysis.articulationPoints.length > 2 ? 'reinforce-critical-path' : 'stable',
    conflictsCount > 0 ? 'resolve-conflict' : 'normal',
    staleRatio > 0.2 ? 'increase-collection-frequency' : 'monitor',
  ];

  return {
    overallScore,
    unknownRatio,
    staleRatio,
    conflictCount: conflictsCount,
    recommendationTags,
  };
}

export function blastRadiusFromFailure(
  graph: GraphDocument,
  failedNodeIds: string[],
): {
  affected: string[];
  severity: number;
  expectedCost: string;
} {
  const outcome = blastRadius(graph, failedNodeIds);
  const expectedCost = outcome.severity > 60 ? 'high' : outcome.severity > 30 ? 'medium' : 'low';

  return {
    affected: outcome.affectedNodes,
    severity: outcome.severity,
    expectedCost,
  };
}

export function topBottlenecks(graph: GraphDocument) {
  return bottleneckEdges(graph, 3);
}
