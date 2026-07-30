import { describe, expect, it } from 'vitest';
import {
  DomainBoundaryStore,
  MirrorLocalStore,
  ReciprocalLearningLedger,
  applyConsentLens,
  applyUserCorrection,
  buildCalmInteractionProfile,
  buildMirrorExportPreview,
  buildSharedRelationship,
  qualitativeConfidenceLabel,
  toSharedGraphNode,
  validateConstitutionalWording,
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

describe('Brain Map and Brain Mirror privacy boundary 81-90', () => {
  it('plan-081: shared graph projection contains only platform-pure presentation fields', () => {
    const projected = toSharedGraphNode(record, 'brain-mirror');
    expect(projected).toEqual({
      id: record.id,
      label: record.label,
      type: 'pattern',
      domain: 'brain-mirror',
      confidence: 'repeating',
      lifecycle: 'active',
    });
    expect(JSON.stringify(projected)).not.toContain('private-signal');
  });

  it('plan-082: Brain Map and Brain Mirror stores reject cross-domain reads and writes', () => {
    const store = new DomainBoundaryStore();
    store.put('brain-mirror', 'private', { note: 'local' });
    expect(store.get('brain-mirror', 'private')).toEqual({ note: 'local' });
    expect(() => store.get('brain-map', 'private')).toThrow('cross-domain-access-denied');
  });

  it('plan-083: shared visual grammar requires domain-specific relationship meaning', () => {
    const relation = buildSharedRelationship('brain-mirror', 'pattern', 'support', 'may-help-with');
    expect(relation.visual).toEqual({ line: 'curved', arrow: 'soft', weight: 1 });
    expect(relation.semantic).toBe('may-help-with');
    expect(relation.domain).toBe('brain-mirror');
  });

  it('plan-084: confidence remains qualitative and exposes no personal score', () => {
    expect(qualitativeConfidenceLabel('context-dependent')).toBe('Appears in some contexts');
    expect(qualitativeConfidenceLabel('strong')).not.toMatch(/\d/);
  });

  it('plan-085: constitutional wording rejects diagnosis, urgency, certainty, and commands', () => {
    expect(
      validateConstitutionalWording('You definitely have a disorder and must act now.'),
    ).toEqual(
      expect.arrayContaining([
        'diagnostic-language',
        'certainty-language',
        'directive-language',
        'urgency-language',
      ]),
    );
    expect(validateConstitutionalWording(record.wording)).toEqual([]);
  });

  it('plan-086: consent lenses enforce granted consent, purpose, and local-only boundaries', () => {
    expect(
      applyConsentLens(
        [record, { ...record, id: 'other', purpose: 'other' }],
        'self-reflection',
      ).map((item) => item.id),
    ).toEqual([record.id]);
    expect(
      applyConsentLens(
        [{ ...record, consent: { granted: false, revokedAt: null } }],
        'self-reflection',
      ),
    ).toEqual([]);
  });

  it('plan-087: local personal store redacts sharing and deletes annotations and raw signals', () => {
    const store = new MirrorLocalStore();
    store.put(record);
    expect(JSON.stringify(buildMirrorExportPreview(store.list()))).not.toContain('private-signal');
    store.delete(record.id);
    expect(store.list()).toEqual([]);
  });

  it('plan-088: calm-start profile begins with a question and limits stimulation', () => {
    const profile = buildCalmInteractionProfile('What feels useful to look at?', [
      'One',
      'Two',
      'Three',
      'Four',
    ]);
    expect(profile.opening).toBe('What feels useful to look at?');
    expect(profile.suggestions).toHaveLength(3);
    expect(profile.motion).toBe('minimal');
  });

  it('plan-089: user correction preserves detector evidence and makes response exploration optional', () => {
    const corrected = applyUserCorrection(record, 'not-about-me');
    expect(corrected.detectorEvidence).toEqual(record.detectorEvidence);
    expect(corrected.userCorrection).toBe('not-about-me');
    expect(corrected.wording).toBe(record.wording);
  });

  it('plan-090: reciprocal learning records usefulness feedback but requires approval before model change', () => {
    const ledger = new ReciprocalLearningLedger();
    ledger.record({
      id: 'feedback-1',
      recordId: record.id,
      useful: false,
      note: 'Not today',
      createdAt: '2026-07-30T12:00:00.000Z',
    });
    const proposal = ledger.proposeLearning('feedback-1');
    expect(proposal).toMatchObject({ state: 'approval-required', applied: false });
    expect(ledger.list()).toHaveLength(1);
  });
});
