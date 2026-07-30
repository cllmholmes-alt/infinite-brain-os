import type { GraphDocument } from '../schema/types';
import { bottleneckEdges, probabilisticBlastRadius } from './algorithms';
import type { DecisionRecommendation } from './decision-intelligence';

export function forecastChangePropagation(
  graph: GraphDocument,
  touchedNodeIds: string[],
): {
  affectedNodeIds: string[];
  ownerIds: string[];
  evidenceConfidence: number;
  canaryBoundary: string[];
  rollbackBoundary: string[];
} {
  const blast = probabilisticBlastRadius(graph, touchedNodeIds);
  const affected = new Set(blast.affectedNodes);
  const ownerIds = graph.nodes
    .filter((node) => affected.has(node.id) && node.ownerId)
    .map((node) => node.ownerId!)
    .filter((id, index, values) => values.indexOf(id) === index)
    .sort();
  const canaryBoundary = graph.edges
    .filter(
      (edge) =>
        affected.has(edge.source) !== affected.has(edge.target) && edge.lifecycle !== 'retired',
    )
    .map((edge) => edge.id)
    .sort();
  const rollbackBoundary = bottleneckEdges(graph, 10)
    .filter((edge) => affected.has(edge.source) || affected.has(edge.target))
    .map((edge) => edge.edgeId)
    .sort();
  const probabilities = Object.values(blast.probabilityByNode);
  return {
    affectedNodeIds: blast.affectedNodes,
    ownerIds,
    evidenceConfidence: probabilities.length
      ? Number(
          (probabilities.reduce((sum, value) => sum + value, 0) / probabilities.length).toFixed(3),
        )
      : 0,
    canaryBoundary,
    rollbackBoundary,
  };
}

export interface ConstraintAwareRecommendation {
  id: string;
  priority: 'act-now' | 'schedule' | 'monitor' | 'dismiss';
  prerequisites: string[];
  ownerAvailable: boolean;
  maintenanceWindowOpen: boolean;
  riskReduction: number;
  cost: number;
  authorityGranted: boolean;
  compliant: boolean;
}

export function buildConstraintAwareQueue(
  recommendations: ConstraintAwareRecommendation[],
): Array<ConstraintAwareRecommendation & { feasible: boolean; blockedBy: string[] }> {
  const priority = { 'act-now': 0, schedule: 1, monitor: 2, dismiss: 3 };
  return recommendations
    .map((recommendation) => {
      const blockedBy = [
        ...(recommendation.prerequisites.length ? ['prerequisites'] : []),
        ...(!recommendation.ownerAvailable ? ['owner'] : []),
        ...(!recommendation.maintenanceWindowOpen ? ['maintenance-window'] : []),
        ...(!recommendation.authorityGranted ? ['authority'] : []),
        ...(!recommendation.compliant ? ['compliance'] : []),
      ];
      return { ...structuredClone(recommendation), feasible: blockedBy.length === 0, blockedBy };
    })
    .sort(
      (left, right) =>
        Number(right.feasible) - Number(left.feasible) ||
        priority[left.priority] - priority[right.priority] ||
        right.riskReduction - left.riskReduction ||
        left.cost - right.cost ||
        left.id.localeCompare(right.id),
    );
}

export function buildExplainableRecommendationCard(input: {
  recommendation: DecisionRecommendation;
  assumptions: string[];
  affectedPaths: string[];
  rejectedAlternatives: string[];
  verificationCriteria: string[];
  smallestConclusionChange: string;
}): typeof input & { confidenceLabel: 'high' | 'medium' | 'low' } {
  if (
    !input.assumptions.length ||
    !input.recommendation.evidenceHandles.length ||
    !input.affectedPaths.length ||
    !input.rejectedAlternatives.length ||
    !input.verificationCriteria.length ||
    !input.smallestConclusionChange.trim()
  ) {
    throw new Error('recommendation-explanation-incomplete');
  }
  return {
    ...structuredClone(input),
    confidenceLabel:
      input.recommendation.confidence >= 0.75
        ? 'high'
        : input.recommendation.confidence >= 0.45
          ? 'medium'
          : 'low',
  };
}

export class RecommendationFeedbackLedger {
  private records: Array<{
    id: string;
    recommendationId: string;
    decision: 'accepted' | 'rejected';
    predictedImpact: number;
    measuredImpact: number | null;
    evidenceHandle: string;
  }> = [];

  record(entry: {
    id: string;
    recommendationId: string;
    decision: 'accepted' | 'rejected';
    predictedImpact: number;
    measuredImpact: number | null;
    evidenceHandle: string;
  }): void {
    if (
      this.records.some((record) => record.id === entry.id) ||
      !entry.evidenceHandle.trim() ||
      !Number.isFinite(entry.predictedImpact) ||
      (entry.measuredImpact !== null && !Number.isFinite(entry.measuredImpact))
    ) {
      throw new Error('recommendation-feedback-invalid');
    }
    this.records.push(structuredClone(entry));
  }

  calibration(): {
    measured: number;
    meanAbsoluteError: number | null;
    accepted: number;
    rejected: number;
  } {
    const measured = this.records.filter((record) => record.measuredImpact !== null);
    return {
      measured: measured.length,
      meanAbsoluteError: measured.length
        ? measured.reduce(
            (sum, record) => sum + Math.abs(record.predictedImpact - record.measuredImpact!),
            0,
          ) / measured.length
        : null,
      accepted: this.records.filter((record) => record.decision === 'accepted').length,
      rejected: this.records.filter((record) => record.decision === 'rejected').length,
    };
  }
}
