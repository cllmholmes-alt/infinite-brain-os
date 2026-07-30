import { describe, expect, it } from 'vitest';
import { combineTruthStates, deriveTruthState } from '../../src/domain/truth';
import { EvidenceEnvelope } from '../../src/schema/types';

const NOW = Date.parse('2026-07-30T12:00:00.000Z');
const envelope = (patch: Partial<EvidenceEnvelope>): EvidenceEnvelope => ({
  sourceId: 'collector.git.local',
  authority: 'observed',
  observedAt: null,
  collectedAt: '2026-07-30T12:00:00.000Z',
  expiresAt: null,
  expiresAfterMs: 60_000,
  confidence: 'high',
  method: 'git.read',
  collectorVersion: '1.0.0',
  environment: 'test',
  evidenceHandle: 'ev-test',
  ...patch,
});

describe('truth-kernel deriveTruthState', () => {
  it('returns unknown when a fact has no observed timestamp', () => {
    expect(deriveTruthState(envelope({ observedAt: null }), NOW)).toEqual({
      state: 'unknown',
      ageMs: null,
      reason: 'observation-missing',
    });
  });

  it('returns stale when the observation exceeds its freshness policy', () => {
    expect(deriveTruthState(envelope({ observedAt: '2026-07-30T11:58:00.000Z' }), NOW)).toEqual({
      state: 'stale',
      ageMs: 120_000,
      reason: 'freshness-expired',
    });
  });

  it('returns unknown for invalid and future observation timestamps', () => {
    expect(deriveTruthState(envelope({ observedAt: 'not-a-date' }), NOW)).toMatchObject({
      state: 'unknown',
      reason: 'invalid-observation-timestamp',
    });
    expect(
      deriveTruthState(envelope({ observedAt: '2030-01-01T00:00:00.000Z' }), NOW),
    ).toMatchObject({ state: 'unknown', reason: 'future-observation-timestamp' });
  });

  it('uses fail-closed mixed-state precedence independent of insertion order', () => {
    expect(combineTruthStates(['fresh', 'unknown'])).toBe('unknown');
    expect(combineTruthStates(['unknown', 'fresh'])).toBe('unknown');
    expect(combineTruthStates(['fresh', 'unavailable'])).toBe('unavailable');
    expect(combineTruthStates(['stale', 'conflict', 'fresh'])).toBe('conflict');
  });
});
