import { describe, expect, it } from 'vitest';
import {
  dryRunCapability,
  resolveCapability,
  verifyActionAttemptBinding,
} from '../../src/actions/capability';
import { appendEvent, createTrace } from '../../src/actions/timeline';

describe('action governance', () => {
  it('plan-51 action-governance: blocks a preview with no authority or verification contract', () => {
    const capability = resolveCapability('service', 'restart');
    expect(capability).toBeDefined();
    const attempt = dryRunCapability(capability!, 'fusion-api');
    expect(attempt.approved).toBe(false);
    expect(attempt.details).toContain('blocked');
    expect(attempt.details).not.toContain('predicted success');
  });

  it('plan-52 action-governance: approves only a non-mutating preview with complete evidence', () => {
    const capability = resolveCapability('service', 'restart');
    const attempt = dryRunCapability(capability!, 'fusion-api', {
      actorId: 'operator-1',
      actorRole: 'operator',
      ownerApprovalId: 'approval-1',
      runbookVersion: 'restart-v2',
      canaryId: 'stream-canary-v1',
      rollbackId: 'release-rollback-v1',
      sourceRevision: 'rev-1',
      normalizedParametersHash: 'params-1',
    });
    expect(attempt.approved).toBe(true);
    expect(attempt.dryRun).toBe(true);
    expect(attempt.blockedReasons).toEqual([]);
  });

  it('action-governance invalidates approval after a target revision or parameter change', () => {
    const capability = resolveCapability('service', 'restart');
    const attempt = dryRunCapability(capability!, 'fusion-api', {
      actorId: 'operator-1',
      actorRole: 'operator',
      ownerApprovalId: 'approval-1',
      runbookVersion: 'runbook-v1',
      canaryId: 'canary-1',
      rollbackId: 'rollback-1',
      sourceRevision: 'rev-1',
      normalizedParametersHash: 'params-1',
    });
    expect(
      verifyActionAttemptBinding(attempt, {
        sourceRevision: 'rev-2',
        normalizedParametersHash: 'params-1',
      }),
    ).toBe(false);
    expect(
      verifyActionAttemptBinding(attempt, {
        sourceRevision: 'rev-1',
        normalizedParametersHash: 'params-2',
      }),
    ).toBe(false);
    expect(
      verifyActionAttemptBinding(attempt, {
        sourceRevision: 'rev-1',
        normalizedParametersHash: 'params-1',
      }),
    ).toBe(true);
  });

  it('does not claim authorization for blocked attempts and appends immutably', () => {
    const capability = resolveCapability('service', 'restart')!;
    const blocked = dryRunCapability(capability, 'fusion-api');
    const trace = createTrace(blocked);
    expect(trace.events.some((event) => event.type === 'authorized')).toBe(false);
    const next = appendEvent(trace, {
      type: 'failed',
      timestamp: blocked.createdAt,
      message: 'blocked before dispatch',
    });
    expect(trace.events).toHaveLength(2);
    expect(next.events).toHaveLength(3);
    expect(next.events).not.toBe(trace.events);
  });
});
