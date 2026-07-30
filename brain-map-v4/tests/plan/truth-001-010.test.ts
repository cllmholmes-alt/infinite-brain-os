import { describe, expect, it } from 'vitest';
import {
  buildConflictAwareState,
  combineTruthStates,
  resolveAuthoritativeFact,
} from '../../src/domain/truth';
import { buildTruthScore, deriveTruthState, evidenceHash } from '../../src/evidence/truth';
import { redactGraph } from '../../src/export/redaction';
import { baseGraph } from '../../src/fixtures';
import { canonicalizeGraph } from '../../src/graph/document';
import { IdentityRegistry } from '../../src/identity/registry';
import {
  COMPATIBILITY_MANIFEST,
  importGraphDocument,
  migrateLegacyV3,
} from '../../src/schema/migrations';
import { validateGraphDocument } from '../../src/security/validate';

const now = Date.parse('2026-07-30T12:00:00.000Z');
const envelope = {
  sourceId: 'source-local',
  observedAt: '2026-07-30T11:59:00.000Z',
  collectedAt: '2026-07-30T11:59:01.000Z',
  expiresAt: '2026-07-30T12:01:00.000Z',
  method: 'test',
  confidence: 'high' as const,
  authority: 'observed' as const,
  collectorVersion: '1',
  environment: 'test',
  evidenceHandle: 'ev-1',
};

describe('Brain Map truth and schema foundation 1-10', () => {
  it('plan-001: canonical graph contract validates one versioned language and rejects malformed documents', () => {
    const graph = structuredClone(baseGraph);
    expect(() => validateGraphDocument(graph)).not.toThrow();
    const canonical = canonicalizeGraph(graph);
    expect(canonical.schemaVersion).toBe('4.0.0');
    expect(Array.isArray(canonical.nodes)).toBe(true);
    expect(Array.isArray(canonical.edges)).toBe(true);
    expect(Array.isArray(canonical.clusters)).toBe(true);
    expect(Array.isArray(canonical.sources)).toBe(true);
    const malformed = structuredClone(baseGraph) as unknown as {
      nodes: Array<Record<string, unknown>>;
    };
    delete malformed.nodes[0]!.id;
    expect(() => validateGraphDocument(malformed)).toThrow('graph-node-id-invalid');
  });

  it('plan-002: stable ecosystem identity registry preserves aliases and rejects collisions', () => {
    const registry = new IdentityRegistry([]);
    registry.register({
      id: 'service.api',
      canonicalAlias: 'api',
      aliases: ['backend'],
      lifecycleState: 'active',
      createdAt: envelope.collectedAt,
      updatedAt: envelope.collectedAt,
    });
    expect(registry.resolve('backend')?.id).toBe('service.api');
    expect(() =>
      registry.register({
        id: 'service.other',
        canonicalAlias: 'backend',
        aliases: [],
        lifecycleState: 'active',
        createdAt: envelope.collectedAt,
        updatedAt: envelope.collectedAt,
      }),
    ).toThrow('identity-alias-collision');
  });

  it('plan-003: source-authority hierarchy selects observed evidence over derived and declared claims', () => {
    const resolved = resolveAuthoritativeFact([
      { value: 'declared', evidence: { ...envelope, authority: 'declared' } },
      { value: 'observed', evidence: envelope },
      { value: 'derived', evidence: { ...envelope, authority: 'derived' } },
    ]);
    expect(resolved?.value).toBe('observed');
  });

  it('plan-004: evidence envelope identity is cryptographically bound to every provenance field', () => {
    const hash = evidenceHash(envelope);
    expect(hash).toMatch(/^sha256-/);
    for (const key of [
      'sourceId',
      'observedAt',
      'collectedAt',
      'expiresAt',
      'method',
      'confidence',
      'authority',
      'collectorVersion',
      'environment',
      'evidenceHandle',
    ] as const) {
      expect(evidenceHash({ ...envelope, [key]: `${String(envelope[key])}-changed` })).not.toBe(
        hash,
      );
    }
  });

  it('plan-005: freshness is independent and transitions through aging to stale at explicit expiry', () => {
    expect(deriveTruthState(envelope, now).state).toBe('fresh');
    expect(
      deriveTruthState({ ...envelope, expiresAt: null, expiresAfterMs: 70_000 }, now).state,
    ).toBe('aging');
    expect(deriveTruthState(envelope, Date.parse('2026-07-30T12:02:00.000Z')).state).toBe('stale');
  });

  it('plan-006: unknown-by-default policy prevents fresh evidence from resolving an unknown rollup green', () => {
    expect(combineTruthStates(['fresh', 'unknown'])).toBe('unknown');
    expect(combineTruthStates(['fresh', 'unavailable'])).toBe('unavailable');
  });

  it('plan-007: conflict reconciliation preserves competing claims, evidence, and authority rank', () => {
    const state = buildConflictAwareState([
      { value: 'main', evidence: envelope },
      {
        value: 'release',
        evidence: { ...envelope, authority: 'declared', evidenceHandle: 'ev-2' },
      },
    ]);
    expect(state.state).toBe('conflict');
    expect(state.candidates).toHaveLength(2);
    expect(state.candidates.map((candidate) => candidate.evidence.authority)).toEqual([
      'observed',
      'declared',
    ]);
  });

  it('plan-008: schema migration imports supported v3 deterministically and rejects unsupported majors', () => {
    expect(importGraphDocument(structuredClone(baseGraph))).toEqual(canonicalizeGraph(baseGraph));
    const migrated = migrateLegacyV3({
      schemaVersion: '3.0.0',
      generatedAt: envelope.collectedAt,
      nodes: [{ id: 'legacy', label: 'Legacy API', type: 'service' }],
      links: [],
    });
    expect(migrated).toMatchObject({
      schemaVersion: COMPATIBILITY_MANIFEST.current,
      manifestVersion: 'migration-v3-to-v4-1',
    });
    expect(() => importGraphDocument({ ...baseGraph, schemaVersion: '2.0.0' })).toThrow(
      'graph-import-version-unsupported',
    );
  });

  it('plan-009: redaction policy removes prohibited nodes, dangling topology, handles, and secret values', () => {
    const publicGraph = redactGraph(baseGraph, 'public');
    expect(publicGraph.nodes.every((node) => node.sensitivity === 'public')).toBe(true);
    const visibleIds = new Set(publicGraph.nodes.map((node) => node.id));
    expect(
      publicGraph.edges.every((edge) => visibleIds.has(edge.source) && visibleIds.has(edge.target)),
    ).toBe(true);
    expect(JSON.stringify(publicGraph)).not.toContain('/Users/');
    expect(JSON.stringify(publicGraph)).not.toMatch(/(?:api[-_]?key|password|token)\s*[:=]/i);
  });

  it('plan-010: truth-quality scorecard exposes components and refuses a definitive score without evidence', () => {
    expect(buildTruthScore([])).toEqual({ score: 0, state: 'unavailable' });
    expect(buildTruthScore([null, envelope])).toMatchObject({ state: 'unavailable' });
    expect(buildTruthScore([null, envelope]).score).toBeLessThan(100);
  });
});
