import { type EvidenceEnvelope, type FreshnessState } from '../schema/types';
import { digestCanonical } from '../security/integrity';

export interface DerivedTruthState {
  state: FreshnessState;
  ageMs: number | null;
  reason: string;
}

function parseDate(value: string | null): number | null {
  if (!value) return null;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : null;
}

export function deriveTruthState(evidence: EvidenceEnvelope, now = Date.now()): DerivedTruthState {
  if (evidence.observedAt === null) {
    return { state: 'unknown', ageMs: null, reason: 'observation-missing' };
  }

  if (evidence.authority === 'unknown') {
    return { state: 'unknown', ageMs: null, reason: 'unsupported-authority-class' };
  }

  const observedAt = parseDate(evidence.observedAt);
  if (observedAt === null) {
    return { state: 'unknown', ageMs: null, reason: 'invalid-observation-timestamp' };
  }

  if (observedAt > now) {
    return { state: 'unknown', ageMs: null, reason: 'future-observation-timestamp' };
  }

  const collectedAt = parseDate(evidence.collectedAt);
  if (collectedAt === null || collectedAt < observedAt || collectedAt > now) {
    return { state: 'unknown', ageMs: null, reason: 'invalid-collection-timestamp' };
  }

  const ageMs = Math.max(0, now - observedAt);
  const freshnessMs = evidence.expiresAfterMs ?? 300_000;

  if (evidence.expiresAt) {
    const expiry = parseDate(evidence.expiresAt);
    if (expiry === null) {
      return { state: 'unknown', ageMs: null, reason: 'invalid-expiry-timestamp' };
    }
    if (now > expiry) {
      return { state: 'stale', ageMs, reason: 'expires-at-expired' };
    }
  }

  if (ageMs > freshnessMs) {
    return { state: 'stale', ageMs, reason: 'freshness-expired' };
  }

  if (ageMs > freshnessMs * 0.8) {
    return { state: 'aging', ageMs, reason: 'aging-towards-expiry' };
  }

  return { state: 'fresh', ageMs, reason: 'observed-within-policy' };
}

export function deriveTruthStateWithUnavailable(
  evidence: EvidenceEnvelope | null,
  now = Date.now(),
): DerivedTruthState {
  if (!evidence) {
    return { state: 'unavailable', ageMs: null, reason: 'evidence-missing' };
  }

  return deriveTruthState(evidence, now);
}

export function evidenceHash(envelope: EvidenceEnvelope): string {
  return `sha256-${digestCanonical(envelope)}`;
}

function conservativeState(states: FreshnessState[]): FreshnessState {
  const precedence: FreshnessState[] = [
    'conflict',
    'unavailable',
    'unknown',
    'stale',
    'aging',
    'fresh',
  ];
  return precedence.find((state) => states.includes(state)) ?? 'unknown';
}

export function buildTruthScore(values: Array<EvidenceEnvelope | null>): {
  score: number;
  state: FreshnessState;
} {
  if (values.length === 0) {
    return { score: 0, state: 'unavailable' };
  }

  let freshnessSum = 0;
  let unavailable = 0;

  values.forEach((value) => {
    const truth = deriveTruthStateWithUnavailable(value);
    if (truth.state === 'fresh') {
      freshnessSum += 1;
    } else if (truth.state === 'aging') {
      freshnessSum += 0.7;
    } else if (truth.state === 'stale') {
      freshnessSum += 0.3;
    } else if (truth.state === 'conflict') {
      freshnessSum += 0.2;
    } else {
      unavailable += 1;
    }
  });

  const score = Math.round((freshnessSum / values.length) * 100);
  const state = conservativeState(
    values.map((value) => deriveTruthStateWithUnavailable(value).state),
  );
  return { score, state: unavailable === values.length ? 'unavailable' : state };
}

export function deriveTruthStateFromFacts(
  facts: Array<{ evidence: EvidenceEnvelope }>,
): DerivedTruthState {
  if (facts.length === 0) {
    return { state: 'unavailable', ageMs: null, reason: 'no-facts' };
  }

  const states = facts.map((fact) => deriveTruthState(fact.evidence));
  const state = conservativeState(states.map((entry) => entry.state));
  return {
    state,
    ageMs:
      state === 'unknown' || state === 'unavailable'
        ? null
        : Math.max(...states.map((entry) => entry.ageMs ?? 0)),
    reason: `conservative-${state}`,
  };
}
