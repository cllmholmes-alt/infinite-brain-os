import type { EvidenceEnvelope } from '../schema/types';

export interface AdapterCollector<T> {
  id: string;
  label: string;
  sourceKind: string;
  collect(): Promise<AdapterResult<T>>;
}

interface AdapterResultBase {
  sourceId: string;
  requestedAt: string;
  collectedAt: string;
  durationMs: number;
}

export interface AdapterSuccess<T> extends AdapterResultBase {
  status: 'success';
  value: T;
  evidence: [EvidenceEnvelope, ...EvidenceEnvelope[]];
  error?: never;
}

export interface AdapterFailure extends AdapterResultBase {
  status: 'unavailable' | 'error';
  error: string;
  evidence?: EvidenceEnvelope[];
  value?: never;
}

export type AdapterResult<T> = AdapterSuccess<T> | AdapterFailure;

export interface UnsupportedAdapter {
  id: string;
  reason: string;
}

export function buildAdapterEvidence(
  sourceId: string,
  observedAt: string,
  method: string,
  confidence: EvidenceEnvelope['confidence'] = 'high',
): EvidenceEnvelope {
  const expiresAfterMs = 300_000;
  return {
    sourceId,
    observedAt,
    collectedAt: observedAt,
    expiresAt: new Date(Date.parse(observedAt) + expiresAfterMs).toISOString(),
    expiresAfterMs,
    method,
    confidence,
    authority: 'observed',
    collectorVersion: '4.0.0',
    environment: 'local',
    evidenceHandle: `${sourceId}:${observedAt}`,
  };
}

export const readOnlyExecutionMarker = 'read-only';
