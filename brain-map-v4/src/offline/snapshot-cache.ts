import type { GraphDocument, RuntimeState } from '../schema/types';
import { digestCanonical } from '../security/integrity';

interface CachedSnapshot {
  graph: GraphDocument;
  runtime: RuntimeState;
  savedAt: string;
  expiresAt: string;
  integrity: string;
}

export class OfflineSnapshotCache {
  private snapshot: CachedSnapshot | null = null;

  save(graph: GraphDocument, runtime: RuntimeState, savedAt: string, ttlMs: number): void {
    const timestamp = Date.parse(savedAt);
    if (!Number.isFinite(timestamp) || !Number.isFinite(ttlMs) || ttlMs <= 0)
      throw new Error('offline-snapshot-expiry-invalid');
    const body = {
      graph: structuredClone(graph),
      runtime: structuredClone(runtime),
      savedAt,
      expiresAt: new Date(timestamp + ttlMs).toISOString(),
    };
    this.snapshot = { ...body, integrity: `sha256-${digestCanonical(body)}` };
  }

  boot(now = Date.now()): {
    state: 'offline-fresh' | 'offline-stale' | 'unavailable';
    graph: GraphDocument | null;
    runtime: RuntimeState | null;
    integrity: string | null;
  } {
    if (!this.snapshot)
      return { state: 'unavailable', graph: null, runtime: null, integrity: null };
    const { integrity, ...body } = this.snapshot;
    if (`sha256-${digestCanonical(body)}` !== integrity)
      throw new Error('offline-snapshot-integrity-failed');
    return {
      state: now <= Date.parse(this.snapshot.expiresAt) ? 'offline-fresh' : 'offline-stale',
      graph: structuredClone(this.snapshot.graph),
      runtime: structuredClone(this.snapshot.runtime),
      integrity,
    };
  }
}
