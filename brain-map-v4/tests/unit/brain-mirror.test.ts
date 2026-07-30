import { describe, expect, it } from 'vitest';
import {
  applyUserCorrection,
  buildMirrorExportPreview,
  deleteMirrorRecord,
  toSharedGraphNode,
  validateMirrorRecord,
} from '../../src/shared/graph-contract';

const record = {
  id: 'pattern.focus.window',
  label: 'Focus window after a quiet start',
  kind: 'pattern' as const,
  confidence: 'repeating' as const,
  purpose: 'self-reflection',
  consent: { granted: true, revokedAt: null },
  localOnly: true,
  wording: 'This pattern may be useful to review.',
  detectorEvidence: { revision: 'detector-4', observations: 3 },
  privateAnnotation: 'Personal note',
  rawSignals: ['private-signal'],
};

describe('Brain Map and Brain Mirror shared contract', () => {
  it('plan-81 domain-isolation: projects only platform-pure graph fields', () => {
    const projected = toSharedGraphNode(record, 'brain-mirror');
    expect(projected.domain).toBe('brain-mirror');
    expect(projected).not.toHaveProperty('rawSignals');
    expect(projected).not.toHaveProperty('privateAnnotation');
  });

  it('plan-82 domain-isolation: rejects revoked consent and diagnostic wording', () => {
    expect(
      validateMirrorRecord({
        ...record,
        consent: { granted: false, revokedAt: '2026-07-30T10:00:00Z' },
      }),
    ).toContain('consent-revoked');
    expect(
      validateMirrorRecord({ ...record, wording: 'This is your diagnosis and you must act now.' }),
    ).toContain('diagnostic-or-urgent-language');
  });

  it('plan-89 domain-isolation: records a correction without rewriting detector evidence', () => {
    const corrected = applyUserCorrection(record, 'not-about-me');
    expect(corrected.detectorEvidence).toEqual(record.detectorEvidence);
    expect(corrected.userCorrection).toBe('not-about-me');
  });

  it('plan-87 domain-isolation: redacts raw signals and supports deletion', () => {
    const preview = buildMirrorExportPreview([record]);
    expect(JSON.stringify(preview)).not.toContain('private-signal');
    expect(JSON.stringify(preview)).not.toContain('Personal note');
    expect(deleteMirrorRecord(record.id)).toEqual({ deletedId: record.id, localDataRemoved: true });
  });
});
