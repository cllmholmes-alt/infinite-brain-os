export type SharedDomain = 'brain-map' | 'brain-mirror';
export type QualitativeConfidence =
  'emerging' | 'repeating' | 'context-dependent' | 'changing' | 'strong';
export type MirrorKind = 'pattern' | 'context' | 'support' | 'reflection';
export type UserCorrection = 'not-about-me' | 'not-useful' | 'rename' | 'hidden';

export interface MirrorConsent {
  granted: boolean;
  revokedAt: string | null;
}

export interface MirrorRecord {
  id: string;
  label: string;
  kind: MirrorKind;
  confidence: QualitativeConfidence;
  purpose: string;
  consent: MirrorConsent;
  localOnly: boolean;
  wording: string;
  detectorEvidence: Record<string, unknown>;
  privateAnnotation?: string | undefined;
  rawSignals?: unknown[] | undefined;
  userCorrection?: UserCorrection | undefined;
}

export interface SharedGraphNode {
  id: string;
  label: string;
  type: string;
  domain: SharedDomain;
  confidence: QualitativeConfidence | 'unknown';
  lifecycle: 'active' | 'hidden' | 'deleted';
}

export function toSharedGraphNode(record: MirrorRecord, domain: SharedDomain): SharedGraphNode {
  return {
    id: record.id,
    label: record.label,
    type: record.kind,
    domain,
    confidence: record.confidence,
    lifecycle: record.userCorrection === 'hidden' ? 'hidden' : 'active',
  };
}

export function validateMirrorRecord(record: MirrorRecord): string[] {
  const issues: string[] = [];
  if (!record.consent.granted || record.consent.revokedAt) issues.push('consent-revoked');
  if (!record.purpose.trim()) issues.push('purpose-missing');
  if (!record.localOnly) issues.push('local-first-boundary-violated');
  if (
    /\b(diagnos(?:is|tic)|disorder|unhealthy|failure|risk score|you must|act now|urgent)\b/i.test(
      record.wording,
    )
  ) {
    issues.push('diagnostic-or-urgent-language');
  }
  return issues;
}

export function applyUserCorrection<T extends MirrorRecord>(
  record: T,
  correction: UserCorrection,
): T & { userCorrection: UserCorrection } {
  return {
    ...record,
    detectorEvidence: structuredClone(record.detectorEvidence),
    userCorrection: correction,
  };
}

export function buildMirrorExportPreview(records: MirrorRecord[]): {
  purpose: string;
  redaction: string;
  records: SharedGraphNode[];
} {
  const valid = records.filter((record) => validateMirrorRecord(record).length === 0);
  return {
    purpose: 'user-reviewed-abstraction',
    redaction: 'raw signals and private annotations excluded',
    records: valid.map((record) => toSharedGraphNode(record, 'brain-mirror')),
  };
}

export function deleteMirrorRecord(id: string): { deletedId: string; localDataRemoved: true } {
  return { deletedId: id, localDataRemoved: true };
}

export class DomainBoundaryStore {
  private stores: Record<SharedDomain, Map<string, unknown>> = {
    'brain-map': new Map(),
    'brain-mirror': new Map(),
  };

  put(domain: SharedDomain, id: string, value: unknown): void {
    if (!id.trim()) throw new Error('domain-record-id-invalid');
    if (this.stores[domain === 'brain-map' ? 'brain-mirror' : 'brain-map'].has(id)) {
      throw new Error('cross-domain-write-denied');
    }
    this.stores[domain].set(id, structuredClone(value));
  }

  get(domain: SharedDomain, id: string): unknown {
    const value = this.stores[domain].get(id);
    if (value !== undefined) return structuredClone(value);
    if (this.stores[domain === 'brain-map' ? 'brain-mirror' : 'brain-map'].has(id)) {
      throw new Error('cross-domain-access-denied');
    }
    return undefined;
  }
}

export function buildSharedRelationship(
  domain: SharedDomain,
  sourceType: string,
  targetType: string,
  semantic: string,
): {
  domain: SharedDomain;
  sourceType: string;
  targetType: string;
  semantic: string;
  visual: { line: 'curved'; arrow: 'soft'; weight: 1 };
} {
  if (![sourceType, targetType, semantic].every((value) => value.trim())) {
    throw new Error('shared-relationship-semantic-required');
  }
  return {
    domain,
    sourceType,
    targetType,
    semantic,
    visual: { line: 'curved', arrow: 'soft', weight: 1 },
  };
}

export function qualitativeConfidenceLabel(confidence: QualitativeConfidence): string {
  return {
    emerging: 'May be emerging',
    repeating: 'Has repeated',
    'context-dependent': 'Appears in some contexts',
    changing: 'May be changing',
    strong: 'Consistently observed',
  }[confidence];
}

export function validateConstitutionalWording(wording: string): string[] {
  const issues: string[] = [];
  if (/\bdiagnos(?:is|tic)|\bdisorder\b|\bunhealthy\b/i.test(wording))
    issues.push('diagnostic-language');
  if (/\bdefinitely\b|\balways\b|\bnever\b|\bproves?\b/i.test(wording))
    issues.push('certainty-language');
  if (/\bmust\b|\bshould\b|\bdo this\b/i.test(wording)) issues.push('directive-language');
  if (/\bact now\b|\burgent\b|\bimmediately\b/i.test(wording)) issues.push('urgency-language');
  return issues;
}

export function applyConsentLens(records: MirrorRecord[], purpose: string): MirrorRecord[] {
  if (!purpose.trim()) throw new Error('consent-purpose-required');
  return structuredClone(
    records.filter(
      (record) =>
        record.consent.granted &&
        !record.consent.revokedAt &&
        record.localOnly &&
        record.purpose === purpose &&
        validateMirrorRecord(record).length === 0,
    ),
  );
}

export class MirrorLocalStore {
  private records = new Map<string, MirrorRecord>();

  put(record: MirrorRecord): void {
    const issues = validateMirrorRecord(record);
    if (issues.length) throw new Error(`mirror-record-invalid:${issues.join(',')}`);
    this.records.set(record.id, structuredClone(record));
  }

  list(): MirrorRecord[] {
    return structuredClone(
      [...this.records.values()].sort((left, right) => left.id.localeCompare(right.id)),
    );
  }

  delete(id: string): { deletedId: string; localDataRemoved: true } {
    this.records.delete(id);
    return deleteMirrorRecord(id);
  }
}

export function buildCalmInteractionProfile(
  opening: string,
  suggestions: string[],
): {
  opening: string;
  suggestions: string[];
  motion: 'minimal';
  tone: 'question-led';
} {
  if (!opening.trim().endsWith('?')) throw new Error('calm-start-question-required');
  return {
    opening,
    suggestions: suggestions.filter((suggestion) => suggestion.trim()).slice(0, 3),
    motion: 'minimal',
    tone: 'question-led',
  };
}

export interface UsefulnessFeedback {
  id: string;
  recordId: string;
  useful: boolean;
  note: string;
  createdAt: string;
}

export class ReciprocalLearningLedger {
  private feedback: UsefulnessFeedback[] = [];

  record(entry: UsefulnessFeedback): void {
    if (this.feedback.some((item) => item.id === entry.id))
      throw new Error('duplicate-feedback-id');
    if (
      !entry.recordId.trim() ||
      !entry.note.trim() ||
      !Number.isFinite(Date.parse(entry.createdAt))
    ) {
      throw new Error('feedback-invalid');
    }
    this.feedback.push(structuredClone(entry));
  }

  list(): UsefulnessFeedback[] {
    return structuredClone(this.feedback);
  }

  proposeLearning(feedbackId: string): {
    feedbackId: string;
    state: 'approval-required';
    applied: false;
    proposedChange: 'decrease-confidence' | 'reinforce-context';
  } {
    const feedback = this.feedback.find((entry) => entry.id === feedbackId);
    if (!feedback) throw new Error('feedback-missing');
    return {
      feedbackId,
      state: 'approval-required',
      applied: false,
      proposedChange: feedback.useful ? 'reinforce-context' : 'decrease-confidence',
    };
  }
}
