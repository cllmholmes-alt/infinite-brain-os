import { describe, expect, it } from 'vitest';
import { paretoRank } from '../../src/analytics/scenarios';

describe('scenario Pareto comparison', () => {
  it('removes a strictly dominated scenario instead of ranking the worst first', () => {
    const safe = { scenario: 'safe', affectedCount: 1, severity: 10, expectedCost: 'low' };
    const dominated = {
      scenario: 'dominated',
      affectedCount: 9,
      severity: 90,
      expectedCost: 'high',
    };
    expect(paretoRank([dominated, safe])).toEqual([safe]);
  });
});
