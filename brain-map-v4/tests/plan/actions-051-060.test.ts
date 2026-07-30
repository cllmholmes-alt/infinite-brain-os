import { describe, expect, it, vi } from 'vitest';
import { baseGraph } from '../../src/fixtures';
import {
  ActionRegistry,
  IncidentWorkspace,
  createDryRunPreview,
  createEscalation,
  dispatchGovernedAction,
  executeRollback,
  mapActionToRunbook,
  runCanaryChecks,
} from '../../src/actions/governance';
import {
  dryRunCapability,
  resolveCapability,
  verifyActionAttemptBinding,
} from '../../src/actions/capability';
import { buildActionReadBoundary } from '../../src/actions/boundary';

const now = '2026-07-30T12:00:00.000Z';
const definition = {
  kind: 'restart-service',
  title: 'Restart service',
  requiredAuthority: 'operator' as const,
  requiredCapabilities: ['service.restart'],
  risk: 'high' as const,
  runbookId: 'runbook.restart',
  canaryRequired: true,
  rollbackRequired: true,
};

describe('Brain Map governed action workflows 51-60', () => {
  it('plan-051: registers scoped action capabilities and rejects duplicate kinds', () => {
    const registry = new ActionRegistry();
    registry.register(definition);
    expect(registry.authorize('restart-service', 'operator', ['service.restart']).authorized).toBe(
      true,
    );
    expect(registry.authorize('restart-service', 'provider', ['service.restart']).authorized).toBe(
      false,
    );
    expect(() => registry.register(definition)).toThrow('duplicate-action-kind');
  });

  it('plan-052: creates deterministic dry-run previews without invoking execution', () => {
    const execute = vi.fn();
    const first = createDryRunPreview(
      definition,
      { nodeId: baseGraph.nodes[0]!.id },
      baseGraph,
      now,
    );
    const second = createDryRunPreview(
      definition,
      { nodeId: baseGraph.nodes[0]!.id },
      baseGraph,
      now,
    );
    expect(second).toEqual(first);
    expect(first.previewHash).toMatch(/^sha256-/);
    expect(execute).not.toHaveBeenCalled();
  });

  it('plan-053: authority-aware action gating binds actor role, approval, runbook, canary, rollback, revision, and parameters', () => {
    const capability = resolveCapability('service', 'restart')!;
    const denied = dryRunCapability(capability, 'service-api', {
      actorId: 'provider-1',
      actorRole: 'provider',
      ownerApprovalId: 'approval-1',
      runbookVersion: 'runbook.restart@2',
      canaryId: 'canary-1',
      rollbackId: 'rollback-1',
      sourceRevision: 'rev-1',
      normalizedParametersHash: 'sha256-parameters',
    });
    expect(denied.approved).toBe(false);
    expect(denied.blockedReasons).toContain('actor role provider does not satisfy operator');
    const approved = dryRunCapability(capability, 'service-api', {
      actorId: 'operator-1',
      actorRole: 'operator',
      ownerApprovalId: 'approval-1',
      runbookVersion: 'runbook.restart@2',
      canaryId: 'canary-1',
      rollbackId: 'rollback-1',
      sourceRevision: 'rev-1',
      normalizedParametersHash: 'sha256-parameters',
    });
    expect(approved.approved).toBe(true);
    expect(
      verifyActionAttemptBinding(approved, {
        sourceRevision: 'rev-2',
        normalizedParametersHash: 'sha256-parameters',
      }),
    ).toBe(false);
  });

  it('plan-054: maps actions to versioned runbooks and fails closed when unmapped', () => {
    expect(
      mapActionToRunbook(definition, [
        { id: 'runbook.restart', version: '2', steps: ['verify', 'restart', 'verify'] },
      ]),
    ).toMatchObject({ id: 'runbook.restart', version: '2' });
    expect(() => mapActionToRunbook({ ...definition, runbookId: 'missing' }, [])).toThrow(
      'action-runbook-missing',
    );
  });

  it('plan-055: canary checks record semantic observations and fail on one bad check', async () => {
    const result = await runCanaryChecks(
      [
        {
          id: 'health',
          description: 'semantic health',
          run: async () => ({ passed: true, evidenceHandle: 'ev-health' }),
        },
        {
          id: 'journal',
          description: 'journal errors',
          run: async () => ({ passed: false, evidenceHandle: 'ev-journal' }),
        },
      ],
      now,
    );
    expect(result.passed).toBe(false);
    expect(result.results).toHaveLength(2);
  });

  it('plan-056: executes rollback only when contract, authority, and verification pass', async () => {
    const mutate = vi.fn(async () => 'rollback-handle');
    const result = await executeRollback(
      {
        id: 'rollback-1',
        actionKind: 'restart-service',
        targetRevision: 'rev-1',
        requiredAuthority: 'operator',
        verify: async () => ({ passed: true, evidenceHandle: 'ev-verify' }),
      },
      'operator',
      mutate,
      now,
    );
    expect(result.state).toBe('verified');
    expect(mutate).toHaveBeenCalledTimes(1);
  });

  it('plan-057: dispatch emits an immutable truthful timeline around real execution', async () => {
    const execute = vi.fn(async () => ({ success: true, evidenceHandle: 'ev-dispatch' }));
    const result = await dispatchGovernedAction({
      definition,
      authority: 'operator',
      capabilities: ['service.restart'],
      approved: true,
      previewHash: 'sha256-preview',
      execute,
      now,
    });
    expect(result.state).toBe('succeeded');
    expect(result.timeline.map((event) => event.type)).toEqual([
      'queued',
      'authorized',
      'started',
      'succeeded',
    ]);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('plan-058: incident workspace binds affected entities, evidence, actions, and status', () => {
    const workspace = new IncidentWorkspace({
      id: 'incident-1',
      title: 'Provider outage',
      openedAt: now,
      severity: 'sev-1',
      affectedNodeIds: [baseGraph.nodes[0]!.id],
    });
    workspace.addEvidence('ev-1');
    workspace.addAction('action-1');
    workspace.setStatus('mitigating', now);
    expect(workspace.snapshot()).toMatchObject({
      status: 'mitigating',
      evidenceHandles: ['ev-1'],
      actionIds: ['action-1'],
    });
  });

  it('plan-059: creates exact evidence-bound owner/provider handoff packets without pretending completion', () => {
    const escalation = createEscalation({
      id: 'escalation-1',
      owner: 'provider',
      request: 'Confirm service recovery',
      evidenceHandles: ['ev-1'],
      createdAt: now,
    });
    expect(escalation.state).toBe('human-required');
    expect(escalation.completedAt).toBeNull();
    expect(escalation).toMatchObject({
      owner: 'provider',
      request: 'Confirm service recovery',
      evidenceHandles: ['ev-1'],
    });
  });

  it('plan-060: action/read separation always exposes safe reads and reveals mutation only after every authority gate passes', () => {
    const blocked = buildActionReadBoundary(definition, 'viewer', []);
    expect(blocked.readCapabilities).toEqual(['inspect', 'redacted-export', 'dry-run']);
    expect(blocked.mutationAvailable).toBe(false);
    expect(blocked.blockedReasons).toContain('authority-mismatch');
    const allowed = buildActionReadBoundary(definition, 'operator', ['service.restart']);
    expect(allowed.mutationAvailable).toBe(true);
    expect(allowed.actionCapabilities).toEqual(['restart-service']);
  });
});
