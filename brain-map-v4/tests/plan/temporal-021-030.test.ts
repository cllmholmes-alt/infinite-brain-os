import { describe, expect, it } from 'vitest';
import { GitCollector, HttpHealthCollector, SystemCollector } from '../../src/adapters';
import type { AdapterResult } from '../../src/adapters/contract';
import {
  buildCollectionHealth,
  buildGitCiState,
  correlateOperationalSignals,
  detectConfigurationDrift,
  detectDependencyDrift,
  evaluateLayeredHealth,
  evaluateServiceSlo,
  evaluateUserPathProbe,
  unsupportedProviderState,
} from '../../src/adapters/telemetry';
import { allocateCollectionBudget } from '../../src/events/temporal';

const at = '2026-07-30T10:00:00.000Z';
const result = (
  sourceId: string,
  status: 'success' | 'error' | 'unavailable',
): AdapterResult<unknown> =>
  status === 'success'
    ? {
        sourceId,
        requestedAt: at,
        collectedAt: at,
        durationMs: 10,
        status,
        value: { ok: true },
        evidence: [
          {
            sourceId,
            observedAt: at,
            collectedAt: at,
            expiresAt: null,
            expiresAfterMs: 60_000,
            method: 'test',
            confidence: 'high',
            authority: 'observed',
            collectorVersion: '1',
            environment: 'test',
            evidenceHandle: `ev-${sourceId}`,
          },
        ],
      }
    : {
        sourceId,
        requestedAt: at,
        collectedAt: at,
        durationMs: 10,
        status,
        error: `${status}-reason`,
      };

describe('Brain Map adapters and operational evidence 21-30', () => {
  it('plan-021: real adapters execute local Git and system reads while unsupported or nonlocal sources fail closed', async () => {
    const [git, system, denied] = await Promise.all([
      new GitCollector(process.cwd()).collect(),
      new SystemCollector().collect(),
      new HttpHealthCollector('http://169.254.169.254/latest').collect(),
    ]);
    expect(git.status).toBe('success');
    expect(git.evidence?.length).toBeGreaterThan(0);
    expect(system.status).toBe('success');
    expect(system.evidence?.length).toBeGreaterThan(0);
    expect(denied).toMatchObject({ status: 'unavailable', error: 'http-target-not-local' });
    expect(unsupportedProviderState('app-store', 'authority-unavailable')).toMatchObject({
      state: 'unknown',
      authority: 'unknown',
    });
  });

  it('plan-022: collection health plane exposes failures, unavailable observers, and latest collection time', () => {
    const health = buildCollectionHealth([
      result('git', 'success'),
      result('runtime', 'error'),
      result('provider', 'unavailable'),
    ]);
    expect(health).toMatchObject({
      total: 3,
      successful: 1,
      failed: 1,
      unavailable: 1,
      health: 'degraded',
      latestCollectedAt: at,
    });
    expect(health.failedSourceIds).toEqual(['provider', 'runtime']);
  });

  it('plan-023: multi-layer health keeps liveness, readiness, semantic, durability, dependency, and user-path states separate', () => {
    const health = evaluateLayeredHealth([
      { layer: 'liveness', status: 'pass', evidenceHandle: 'e1', observedAt: at },
      { layer: 'readiness', status: 'pass', evidenceHandle: 'e2', observedAt: at },
      { layer: 'semantic-canary', status: 'fail', evidenceHandle: 'e3', observedAt: at },
      { layer: 'durability', status: 'pass', evidenceHandle: 'e4', observedAt: at },
      { layer: 'dependency', status: 'pass', evidenceHandle: 'e5', observedAt: at },
      { layer: 'user-path', status: 'unknown', evidenceHandle: 'e6', observedAt: at },
    ]);
    expect(health.state).toBe('degraded');
    expect(health.layers).toMatchObject({
      liveness: 'pass',
      readiness: 'pass',
      'semantic-canary': 'fail',
      'user-path': 'unknown',
    });
  });

  it('plan-024: service SLO reports attainment, error budget, and burn-rate breaches from evidence', () => {
    const slo = evaluateServiceSlo(
      {
        goodEvents: 970,
        totalEvents: 1000,
        errorBudgetRemaining: -2,
        burnRate: 3,
        observedAt: at,
        evidenceHandle: 'ev-slo',
      },
      { target: 0.99, maxBurnRate: 2 },
    );
    expect(slo).toMatchObject({ attainment: 0.97, state: 'breached' });
    expect(slo.reasons).toEqual(['slo-target-missed', 'error-budget-exhausted', 'burn-rate-high']);
  });

  it('plan-025: configuration drift detector compares declared, Git, build, deployment, and live layers', () => {
    const drift = detectConfigurationDrift(
      { git: { sha: 'a' }, build: { sha: 'a' }, deployment: { sha: 'a' }, live: { sha: 'a' } },
      { git: { sha: 'a' }, build: { sha: 'b' }, deployment: { sha: 'b' }, live: { sha: 'c' } },
    );
    expect(drift.map((entry) => entry.path)).toEqual(['build.sha', 'deployment.sha', 'live.sha']);
  });

  it('plan-026: Git and CI estate preserves dirty/upstream/ahead-behind facts and refuses absent CI as passing', () => {
    const state = buildGitCiState(
      {
        localCommit: 'a'.repeat(40),
        branch: 'feature',
        dirty: true,
        noUpstream: true,
        ahead: null,
        behind: null,
      },
      [],
    );
    expect(state.git).toMatchObject({ dirty: true, noUpstream: true, ahead: null, behind: null });
    expect(state.ci.state).toBe('unknown');
  });

  it('plan-027: dependency and version drift reports changed, missing, and unexpected packages', () => {
    expect(
      detectDependencyDrift(
        { react: '19.0.0', typescript: '5.8.3' },
        { react: '18.0.0', vite: '7.0.0' },
      ),
    ).toEqual([
      { packageName: 'react', expected: '19.0.0', observed: '18.0.0', state: 'changed' },
      { packageName: 'typescript', expected: '5.8.3', observed: null, state: 'missing' },
      { packageName: 'vite', expected: null, observed: '7.0.0', state: 'unexpected' },
    ]);
  });

  it('plan-028: user-path synthetic probe requires semantic and durable success at every evidence-bound hop', () => {
    expect(
      evaluateUserPathProbe('authenticated-stream', [
        { nodeId: 'auth', semanticOutcome: true, durable: true, evidenceHandle: 'e1' },
        { nodeId: 'api', semanticOutcome: true, durable: false, evidenceHandle: 'e2' },
      ]),
    ).toMatchObject({ state: 'failed', failedNodeIds: ['api'] });
    expect(
      evaluateUserPathProbe('unknown-path', [
        { nodeId: 'provider', semanticOutcome: null, durable: true, evidenceHandle: 'e3' },
      ]).state,
    ).toBe('unknown');
  });

  it('plan-029: topology-aware correlation groups collection, freshness, and incident signals without inventing unrelated causes', () => {
    const correlations = correlateOperationalSignals(
      [
        { sourceId: 'fusion', kind: 'collection-failure', timestamp: at, evidenceHandle: 'e1' },
        {
          sourceId: 'fusion',
          kind: 'stale-evidence',
          timestamp: '2026-07-30T10:00:30.000Z',
          evidenceHandle: 'e2',
        },
        {
          sourceId: 'fusion',
          kind: 'incident',
          timestamp: '2026-07-30T10:01:00.000Z',
          evidenceHandle: 'e3',
        },
      ],
      120_000,
    );
    expect(correlations[0]).toMatchObject({ sourceId: 'fusion', confidence: 'high' });
  });

  it('plan-030: adaptive collection budget favors risky failing sources within an exact hard total', () => {
    const budgets = allocateCollectionBudget(
      [
        { sourceId: 'stable', risk: 0.1, consecutiveFailures: 0, cost: 1 },
        { sourceId: 'failing', risk: 1, consecutiveFailures: 4, cost: 1 },
      ],
      10,
    );
    expect(budgets.reduce((sum, entry) => sum + entry.budget, 0)).toBe(10);
    expect(budgets[0]).toMatchObject({ sourceId: 'failing' });
  });
});
