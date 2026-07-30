import { GraphDocument } from '../schema/types';
import { blastRadiusFromFailure } from './risk';

export interface ScenarioInput {
  graph: GraphDocument;
  failures: string[];
  name: string;
}

export interface ScenarioResult {
  scenario: string;
  affectedCount: number;
  severity: number;
  expectedCost: string;
}

export function evaluateScenario(input: ScenarioInput): ScenarioResult {
  const blast = blastRadiusFromFailure(input.graph, input.failures);
  return {
    scenario: input.name,
    affectedCount: blast.affected.length,
    severity: blast.severity,
    expectedCost: blast.expectedCost,
  };
}

export function compareScenarios(inputs: ScenarioInput[]): ScenarioResult[] {
  return inputs.map((input) => evaluateScenario(input));
}

export function paretoRank(results: ScenarioResult[]): ScenarioResult[] {
  const costRank = (cost: string): number => ({ low: 1, medium: 2, high: 3 })[cost] ?? 4;
  const dominates = (left: ScenarioResult, right: ScenarioResult): boolean => {
    const noWorse =
      left.severity <= right.severity &&
      left.affectedCount <= right.affectedCount &&
      costRank(left.expectedCost) <= costRank(right.expectedCost);
    const strictlyBetter =
      left.severity < right.severity ||
      left.affectedCount < right.affectedCount ||
      costRank(left.expectedCost) < costRank(right.expectedCost);
    return noWorse && strictlyBetter;
  };

  return results
    .filter((candidate, index) =>
      results.every((other, otherIndex) => otherIndex === index || !dominates(other, candidate)),
    )
    .sort(
      (left, right) =>
        left.severity - right.severity ||
        left.affectedCount - right.affectedCount ||
        left.scenario.localeCompare(right.scenario),
    );
}
