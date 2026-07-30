import { GraphDocument, RuntimeState } from '../schema/types';
import { computeRisk } from './risk';

export interface Recommendation {
  id: string;
  title: string;
  action: string;
  confidence: 'high' | 'medium' | 'low';
  state: 'act-now' | 'schedule' | 'monitor' | 'dismiss';
  assumptions: string[];
  affectedPaths: string[];
}

function confidenceFromScore(score: number): 'high' | 'medium' | 'low' {
  if (score >= 75) {
    return 'high';
  }
  if (score >= 45) {
    return 'medium';
  }
  return 'low';
}

export function computeRecommendations(
  graph: GraphDocument,
  state: RuntimeState,
): Recommendation[] {
  const risks = computeRisk(graph, state.unknownItems, state.staleItems, state.conflictItems);

  const recommendations: Recommendation[] = [];

  if (risks.unknownRatio > 0.3) {
    recommendations.push({
      id: 'rec-unknown-observability',
      title: 'Repair unknown facts through explicit collection',
      action: 'Run local collector pass with explicit failures logged',
      confidence: confidenceFromScore(100 - risks.unknownRatio * 100),
      state: 'act-now',
      assumptions: [
        'read-only adapters are authorized in local mode',
        'fixtures exist for baseline health',
      ],
      affectedPaths: ['operations-observability', 'decision-log'],
    });
  }

  if (risks.conflictCount > 0) {
    recommendations.push({
      id: 'rec-conflict-resolution',
      title: 'Open source precedence conflict review',
      action: 'Route conflicts to decision corridor and mark source authority',
      confidence: confidenceFromScore(80),
      state: 'schedule',
      assumptions: ['authority map is complete', 'owners can be contacted'],
      affectedPaths: ['decision', 'trust-score'],
    });
  }

  if (risks.staleRatio > 0.2) {
    recommendations.push({
      id: 'rec-stale-checks',
      title: 'Increase collection cadence around stale nodes',
      action: 'Enable adaptive collection budgets for selected high-impact nodes',
      confidence: confidenceFromScore(65),
      state: 'act-now',
      assumptions: ['canary checks are enabled'],
      affectedPaths: ['collection-health', 'operational-drift'],
    });
  }

  return recommendations.sort((a, b) => {
    const scoreA = a.confidence === 'high' ? 3 : a.confidence === 'medium' ? 2 : 1;
    const scoreB = b.confidence === 'high' ? 3 : b.confidence === 'medium' ? 2 : 1;
    return scoreB - scoreA;
  });
}

export interface RecommendationScenario {
  recommendation: Recommendation;
  score: number;
  rationale: string;
}

export function rankRecommendations(rec: Recommendation[]): RecommendationScenario[] {
  return rec.map((entry, index) => ({
    recommendation: entry,
    score: entry.confidence === 'high' ? 3 : entry.confidence === 'medium' ? 2 : 1,
    rationale: `score-${index + 1}`,
  }));
}

export function toScenarioPayload(
  entries: RecommendationScenario[],
): (Recommendation | (Recommendation & { score?: number; rationale?: string }))[] {
  return entries.map((entry) => ({
    id: entry.recommendation.id,
    title: entry.recommendation.title,
    action: entry.recommendation.action,
    confidence: entry.recommendation.confidence,
    state: entry.recommendation.state,
    assumptions: entry.recommendation.assumptions,
    affectedPaths: entry.recommendation.affectedPaths,
    score: entry.score,
    rationale: entry.rationale,
  }));
}

export function recommendationQueue(recommendations: Recommendation[]): Recommendation[] {
  const byPriority = {
    'act-now': 0,
    schedule: 1,
    monitor: 2,
    dismiss: 3,
  };

  return [...recommendations].sort((a, b) => byPriority[a.state] - byPriority[b.state]);
}
