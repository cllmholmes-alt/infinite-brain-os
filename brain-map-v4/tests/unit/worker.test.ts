import { describe, expect, it } from 'vitest';
import { acceptWorkerResult, type LayoutWorkerResult } from '../../src/workers/graph-worker';

describe('revision-bound worker protocol', () => {
  const result: LayoutWorkerResult = {
    type: 'layout-result',
    jobId: 'job-1',
    revision: 'revision-1',
    inputHash: 'hash-1',
    nodeIds: ['a', 'b'],
    positions: new Float32Array([0.1, 0.2, 0.3, 0.4]),
  };

  it('accepts only a complete result bound to the current revision', () => {
    expect(acceptWorkerResult(result, 'revision-1')).toBe(true);
    expect(acceptWorkerResult({ ...result, revision: 'stale' }, 'revision-1')).toBe(false);
    expect(
      acceptWorkerResult(
        { ...result, positions: new Float32Array([0.1, Number.NaN]) },
        'revision-1',
      ),
    ).toBe(false);
  });
});
