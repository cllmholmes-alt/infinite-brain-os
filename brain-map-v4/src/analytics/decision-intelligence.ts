import type { GraphDocument } from '../schema/types';

export function buildOutcomeGraph(graph: GraphDocument): {
  goalIds: string[];
  outcomeIds: string[];
  paths: string[][];
  unlinkedWorkIds: string[];
} {
  const goalIds = graph.nodes
    .filter((node) => node.class === 'goal')
    .map((node) => node.id)
    .sort();
  const outcomeIds = graph.nodes
    .filter((node) => node.class === 'outcome')
    .map((node) => node.id)
    .sort();
  const goals = new Set(goalIds);
  const outcomes = new Set(outcomeIds);
  const allowedRelations = new Set(['feeds', 'governs', 'depends-on', 'lead-flow']);
  const adjacency = new Map<string, string[]>();
  for (const node of graph.nodes) adjacency.set(node.id, []);
  for (const edge of graph.edges) {
    if (!allowedRelations.has(edge.relation) || edge.lifecycle === 'retired') continue;
    adjacency.get(edge.source)?.push(edge.target);
  }
  for (const targets of adjacency.values()) targets.sort();
  const paths: string[][] = [];
  for (const node of graph.nodes) {
    if (goals.has(node.id) || outcomes.has(node.id)) continue;
    const walk = (current: string, path: string[], seen: Set<string>): void => {
      if (path.length > 8) return;
      if (goals.has(current) && path.some((id) => outcomes.has(id))) {
        paths.push(path);
        return;
      }
      for (const next of adjacency.get(current) ?? []) {
        if (seen.has(next)) continue;
        walk(next, [...path, next], new Set([...seen, next]));
      }
    };
    walk(node.id, [node.id], new Set([node.id]));
  }
  paths.sort((left, right) => left.join('\u0000').localeCompare(right.join('\u0000')));
  const linked = new Set(paths.flat());
  return {
    goalIds,
    outcomeIds,
    paths,
    unlinkedWorkIds: graph.nodes
      .filter((node) => !goals.has(node.id) && !outcomes.has(node.id) && !linked.has(node.id))
      .map((node) => node.id)
      .sort(),
  };
}

export interface RiskSignal {
  id: string;
  nodeIds: string[];
  evidenceHandles: string[];
}

export function clusterCorrelatedRisk(signals: RiskSignal[]): Array<{
  id: string;
  riskIds: string[];
  sharedNodeIds: string[];
  sharedEvidenceHandles: string[];
}> {
  const parent = signals.map((_, index) => index);
  const find = (value: number): number => {
    while (parent[value] !== value) {
      parent[value] = parent[parent[value]!]!;
      value = parent[value]!;
    }
    return value;
  };
  const union = (left: number, right: number): void => {
    const a = find(left);
    const b = find(right);
    if (a !== b) parent[b] = a;
  };
  for (let left = 0; left < signals.length; left += 1) {
    for (let right = left + 1; right < signals.length; right += 1) {
      const leftSignal = signals[left]!;
      const rightSignal = signals[right]!;
      const sharedNode = leftSignal.nodeIds.some((id) => rightSignal.nodeIds.includes(id));
      const sharedEvidence = leftSignal.evidenceHandles.some((id) =>
        rightSignal.evidenceHandles.includes(id),
      );
      if (sharedNode || sharedEvidence) union(left, right);
    }
  }
  const groups = new Map<number, RiskSignal[]>();
  signals.forEach((signal, index) =>
    (groups.get(find(index)) ?? groups.set(find(index), []).get(find(index))!).push(signal),
  );
  return [...groups.values()]
    .map((group) => {
      const nodeCounts = new Map<string, number>();
      const evidenceCounts = new Map<string, number>();
      for (const signal of group) {
        signal.nodeIds.forEach((id) => nodeCounts.set(id, (nodeCounts.get(id) ?? 0) + 1));
        signal.evidenceHandles.forEach((id) =>
          evidenceCounts.set(id, (evidenceCounts.get(id) ?? 0) + 1),
        );
      }
      const riskIds = group.map((signal) => signal.id).sort();
      return {
        id: `risk-cluster:${riskIds.join('+')}`,
        riskIds,
        sharedNodeIds: [...nodeCounts]
          .filter(([, count]) => count > 1)
          .map(([id]) => id)
          .sort(),
        sharedEvidenceHandles: [...evidenceCounts]
          .filter(([, count]) => count > 1)
          .map(([id]) => id)
          .sort(),
      };
    })
    .sort(
      (left, right) =>
        right.riskIds.length - left.riskIds.length || left.id.localeCompare(right.id),
    );
}

export interface CriticalTask {
  id: string;
  duration: number;
  dependsOn: string[];
}

export function analyzeCriticalPath(tasks: CriticalTask[]): {
  path: string[];
  duration: number;
  slackByTask: Record<string, number>;
} {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  if (byId.size !== tasks.length) throw new Error('duplicate-critical-task-id');
  for (const task of tasks) {
    if (!Number.isFinite(task.duration) || task.duration < 0)
      throw new Error('critical-task-duration-invalid');
    for (const dependency of task.dependsOn) {
      if (!byId.has(dependency)) throw new Error(`critical-task-dependency-missing:${dependency}`);
    }
  }
  const indegree = new Map(tasks.map((task) => [task.id, task.dependsOn.length]));
  const successors = new Map(tasks.map((task) => [task.id, [] as string[]]));
  for (const task of tasks)
    task.dependsOn.forEach((dependency) => successors.get(dependency)!.push(task.id));
  const queue = tasks
    .filter((task) => task.dependsOn.length === 0)
    .map((task) => task.id)
    .sort();
  const order: string[] = [];
  while (queue.length) {
    const id = queue.shift()!;
    order.push(id);
    for (const successor of successors.get(id)!.sort()) {
      indegree.set(successor, indegree.get(successor)! - 1);
      if (indegree.get(successor) === 0) queue.push(successor);
    }
    queue.sort();
  }
  if (order.length !== tasks.length) throw new Error('critical-task-cycle');
  const earliestStart: Record<string, number> = {};
  const earliestFinish: Record<string, number> = {};
  const predecessor: Record<string, string | null> = {};
  for (const id of order) {
    const task = byId.get(id)!;
    const chosen = [...task.dependsOn].sort(
      (left, right) =>
        (earliestFinish[right] ?? 0) - (earliestFinish[left] ?? 0) || left.localeCompare(right),
    )[0];
    earliestStart[id] = chosen ? earliestFinish[chosen]! : 0;
    earliestFinish[id] = earliestStart[id] + task.duration;
    predecessor[id] = chosen ?? null;
  }
  const duration = Math.max(0, ...Object.values(earliestFinish));
  const terminal =
    [...order].sort(
      (left, right) => earliestFinish[right]! - earliestFinish[left]! || left.localeCompare(right),
    )[0] ?? null;
  const path: string[] = [];
  for (let current = terminal; current; current = predecessor[current] ?? null)
    path.unshift(current);
  const latestFinish: Record<string, number> = {};
  const latestStart: Record<string, number> = {};
  for (const id of [...order].reverse()) {
    const following = successors.get(id)!;
    latestFinish[id] = following.length
      ? Math.min(...following.map((next) => latestStart[next]!))
      : duration;
    latestStart[id] = latestFinish[id] - byId.get(id)!.duration;
  }
  return {
    path,
    duration,
    slackByTask: Object.fromEntries(order.map((id) => [id, latestStart[id]! - earliestStart[id]!])),
  };
}

export function scoreOperationalBottlenecks(
  inputs: Array<{
    id: string;
    throughputUtilization: number;
    changeFailureRate: number;
    redundantPaths: number;
  }>,
): Array<{ id: string; score: number; factors: Record<string, number> }> {
  return inputs
    .map((input) => {
      const utilization = Math.max(0, Math.min(1, input.throughputUtilization));
      const changeRisk = Math.max(0, Math.min(1, input.changeFailureRate));
      const redundancy = Math.max(0, Math.floor(input.redundantPaths));
      const score =
        Math.round((utilization * 45 + changeRisk * 35 + 20 / (1 + redundancy)) * 100) / 100;
      return { id: input.id, score, factors: { utilization, changeRisk, redundancy } };
    })
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
}

export function computeFlowMetrics(
  executions: Array<{
    id: string;
    startedAt: string;
    finishedAt: string;
    succeeded: boolean;
  }>,
): {
  state: 'measured' | 'unknown';
  successRate: number | null;
  medianLeadTimeMs: number | null;
  p95LeadTimeMs: number | null;
  sampleSize: number;
} {
  if (!executions.length)
    return {
      state: 'unknown',
      successRate: null,
      medianLeadTimeMs: null,
      p95LeadTimeMs: null,
      sampleSize: 0,
    };
  const durations = executions
    .map((execution) => {
      const duration = Date.parse(execution.finishedAt) - Date.parse(execution.startedAt);
      if (!Number.isFinite(duration) || duration < 0)
        throw new Error('flow-execution-timestamp-invalid');
      return duration;
    })
    .sort((left, right) => left - right);
  const percentile = (fraction: number): number =>
    durations[Math.min(durations.length - 1, Math.ceil(durations.length * fraction) - 1)]!;
  return {
    state: 'measured',
    successRate: executions.filter((execution) => execution.succeeded).length / executions.length,
    medianLeadTimeMs: percentile(0.5),
    p95LeadTimeMs: percentile(0.95),
    sampleSize: executions.length,
  };
}

export function simulateScenario<T extends Record<string, number>>(
  baseline: T,
  scenario: { id: string; assumptions: string[]; changes: Partial<Record<keyof T, number>> },
): {
  id: string;
  baseline: T;
  projected: T;
  delta: Partial<Record<keyof T, number>>;
  assumptions: string[];
} {
  if (!scenario.id.trim() || !scenario.assumptions.length)
    throw new Error('scenario-assumptions-required');
  const projected = structuredClone(baseline);
  for (const [key, delta] of Object.entries(scenario.changes) as Array<[keyof T, number]>) {
    const current = projected[key];
    if (!Number.isFinite(delta) || typeof current !== 'number' || !Number.isFinite(current)) {
      throw new Error('scenario-value-invalid');
    }
    const currentNumber = Number(current);
    projected[key] = (currentNumber + delta) as T[keyof T];
  }
  return {
    id: scenario.id,
    baseline: structuredClone(baseline),
    projected,
    delta: structuredClone(scenario.changes),
    assumptions: [...scenario.assumptions],
  };
}

export function backtestForecasts(forecasts: Array<{ probability: number; outcome: 0 | 1 }>): {
  brierScore: number;
  buckets: Array<{
    lower: number;
    upper: number;
    count: number;
    meanProbability: number;
    observedRate: number;
  }>;
} {
  if (!forecasts.length) throw new Error('forecast-sample-required');
  for (const forecast of forecasts) {
    if (
      !Number.isFinite(forecast.probability) ||
      forecast.probability < 0 ||
      forecast.probability > 1
    ) {
      throw new Error('forecast-probability-invalid');
    }
  }
  const brierScore =
    forecasts.reduce((sum, forecast) => sum + (forecast.probability - forecast.outcome) ** 2, 0) /
    forecasts.length;
  const groups = new Map<number, typeof forecasts>();
  for (const forecast of forecasts) {
    const bucket = Math.min(9, Math.floor(forecast.probability * 10));
    (groups.get(bucket) ?? groups.set(bucket, []).get(bucket)!).push(forecast);
  }
  return {
    brierScore,
    buckets: [...groups.entries()]
      .sort(([left], [right]) => left - right)
      .map(([bucket, values]) => ({
        lower: bucket / 10,
        upper: (bucket + 1) / 10,
        count: values.length,
        meanProbability: values.reduce((sum, value) => sum + value.probability, 0) / values.length,
        observedRate: values.reduce((sum, value) => sum + value.outcome, 0) / values.length,
      })),
  };
}

export interface DecisionRecommendation {
  id: string;
  expectedImpact: number;
  cost: number;
  confidence: number;
  reversibility: number;
  outcomeIds: string[];
  evidenceHandles: string[];
}

export function rankDecisionRecommendations(
  recommendations: DecisionRecommendation[],
): Array<DecisionRecommendation & { score: number }> {
  return recommendations
    .map((recommendation) => {
      if (
        !recommendation.evidenceHandles.length ||
        !recommendation.outcomeIds.length ||
        [
          recommendation.expectedImpact,
          recommendation.cost,
          recommendation.confidence,
          recommendation.reversibility,
        ].some((value) => !Number.isFinite(value))
      ) {
        throw new Error('recommendation-evidence-invalid');
      }
      const score =
        recommendation.expectedImpact * 0.45 -
        recommendation.cost * 0.25 +
        recommendation.confidence * 20 +
        recommendation.reversibility * 10;
      return { ...structuredClone(recommendation), score: Math.round(score * 100) / 100 };
    })
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id));
}
