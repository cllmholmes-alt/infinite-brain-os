import { describe, expect, it } from 'vitest';
import { diffSnapshots } from '../../src/events/diff';
import { EventLedger } from '../../src/events/ledger';
import { runTemporalQuery } from '../../src/events/query';
import { compactEvents } from '../../src/events/retention';
import {
  buildIncidentPlayback,
  createReleaseTopologyView,
  exportEvidenceBoundHistory,
  SnapshotStore,
  validateLifecycleTransition,
} from '../../src/events/temporal';
import { baseGraph } from '../../src/fixtures';
import { defaultRuntimeState } from '../../src/graph/runtime';
import type { ObservableEvent } from '../../src/schema/types';

const at = '2026-07-30T10:00:00.000Z';
const event = (
  id: string,
  timestamp: string,
  patch: Partial<ObservableEvent> = {},
): ObservableEvent => ({
  id,
  type: 'deploy',
  timestamp,
  actorId: 'release-manager',
  targetId: 'fusion',
  sourceEventId: `provider-${id}`,
  causeIds: ['commit-abc'],
  data: { releaseId: 'v4', evidenceHandle: `ev-${id}` },
  ...patch,
});

describe('Brain Map temporal memory 11-20', () => {
  it('plan-011: append-only event log rejects duplicates and isolates stored history from mutation', () => {
    const ledger = new EventLedger();
    const mutable = event('e1', at);
    ledger.append(mutable);
    mutable.data.releaseId = 'mutated';
    expect(ledger.list()[0]!.data.releaseId).toBe('v4');
    expect(() => ledger.append(event('e1', at))).toThrow('duplicate-event-id');
  });

  it('plan-012: deterministic snapshot builder reconstructs the same graph and hash at a timestamp', () => {
    const ledger = new EventLedger([event('e1', at)]);
    const first = ledger.replay(baseGraph, defaultRuntimeState, at);
    const second = ledger.replay(baseGraph, defaultRuntimeState, at);
    expect(second).toEqual(first);
    expect(first.hash).toMatch(/^sha256-/);
    const store = new SnapshotStore({ maxSnapshots: 2, maxAgeMs: 60_000 });
    expect(store.capture(first.graph, first.runtime, at).hash).toMatch(/^sha256-/);
  });

  it('plan-013: before-after diff detects topology, ownership, and health changes without key-order noise', () => {
    const after = structuredClone(baseGraph);
    after.nodes[0] = { ...after.nodes[0]!, ownerId: 'new-owner' };
    after.health['new-probe'] = {
      namespace: after.nodes[0].id,
      value: 'green',
      freshness: 'fresh',
      evidenceId: 'ev-probe',
      sourceId: baseGraph.sources[0]!.id,
    };
    const diff = diffSnapshots(baseGraph, after);
    expect(diff.nodesChanged).toContain(after.nodes[0].id);
    expect(diff.healthChanged).toContain('new-probe');
    expect(diffSnapshots(baseGraph, structuredClone(baseGraph))).toMatchObject({
      nodesChanged: [],
      edgesChanged: [],
      factsChanged: [],
    });
  });

  it('plan-014: change attribution preserves actor, provider event, causes, target, and evidence', () => {
    const attributed = event('e1', at);
    const ledger = new EventLedger([attributed]);
    expect(ledger.list()[0]).toMatchObject({
      actorId: 'release-manager',
      targetId: 'fusion',
      sourceEventId: 'provider-e1',
      causeIds: ['commit-abc'],
      data: { evidenceHandle: 'ev-e1' },
    });
  });

  it('plan-015: named release topology view freezes graph, runtime, evidence, and reproducible hash', () => {
    const view = createReleaseTopologyView({
      releaseId: 'brain-map-v4',
      capturedAt: at,
      graph: baseGraph,
      runtime: defaultRuntimeState,
      evidenceHandles: ['ev-build', 'ev-git'],
    });
    expect(view.hash).toMatch(/^sha256-/);
    expect(
      createReleaseTopologyView({
        releaseId: 'brain-map-v4',
        capturedAt: at,
        graph: baseGraph,
        runtime: defaultRuntimeState,
        evidenceHandles: ['ev-git', 'ev-build'],
      }).hash,
    ).toBe(view.hash);
  });

  it('plan-016: incident reconstruction returns only the bounded window in deterministic order', () => {
    const playback = buildIncidentPlayback(
      [
        {
          id: 'after',
          timestamp: '2026-07-30T10:03:00.000Z',
          kind: 'health',
          evidenceHandle: 'e3',
        },
        {
          id: 'before',
          timestamp: '2026-07-30T09:59:00.000Z',
          kind: 'deploy',
          evidenceHandle: 'e1',
        },
        {
          id: 'during',
          timestamp: '2026-07-30T10:01:00.000Z',
          kind: 'incident',
          evidenceHandle: 'e2',
        },
      ],
      '2026-07-30T10:00:00.000Z',
      '2026-07-30T10:02:00.000Z',
    );
    expect(playback.map((entry) => entry.id)).toEqual(['during']);
  });

  it('plan-017: temporal query filters attributed history by time, type, actor, and target', () => {
    const events = [
      event('e1', '2026-07-30T09:59:00.000Z'),
      event('e2', '2026-07-30T10:01:00.000Z', { type: 'incident', actorId: 'observer' }),
    ];
    expect(
      runTemporalQuery(events, {
        after: at,
        type: 'incident',
        actorId: 'observer',
        targetId: 'fusion',
      }).map((entry) => entry.id),
    ).toEqual(['e2']);
  });

  it('plan-018: lifecycle model allows explicit attributed transitions and rejects invalid jumps', () => {
    expect(
      validateLifecycleTransition({
        entityId: 'fusion',
        from: 'experimental',
        to: 'active',
        timestamp: at,
        actorId: 'owner',
        evidenceHandle: 'ev-transition',
      }),
    ).toEqual({ valid: true });
    expect(
      validateLifecycleTransition({
        entityId: 'fusion',
        from: 'archived',
        to: 'active',
        timestamp: at,
        actorId: 'owner',
        evidenceHandle: 'ev-transition',
      }),
    ).toEqual({ valid: false, reason: 'transition-not-allowed' });
  });

  it('plan-019: retention policy compacts noisy history to a bounded deterministic event set', () => {
    const compacted = compactEvents(
      [
        event('e1', '2026-07-30T10:00:00.000Z'),
        event('e2', '2026-07-30T10:01:00.000Z'),
        event('e3', '2026-07-30T10:02:00.000Z'),
      ],
      { maxEvents: 2 },
    );
    expect(compacted.map((entry) => entry.id)).toEqual(['e2', 'e3']);
  });

  it('plan-020: historical export binds release, timestamps, redaction, source manifest, and hash', () => {
    const view = createReleaseTopologyView({
      releaseId: 'brain-map-v4',
      capturedAt: at,
      graph: baseGraph,
      runtime: defaultRuntimeState,
      evidenceHandles: ['ev-build'],
    });
    const exported = exportEvidenceBoundHistory(view, 'public');
    expect(exported).toMatchObject({
      releaseId: 'brain-map-v4',
      capturedAt: at,
      policy: 'public',
      sourceManifest: ['ev-build'],
    });
    expect(exported.hash).toMatch(/^sha256-/);
    expect(exported.graph.nodes.every((node) => node.sensitivity === 'public')).toBe(true);
  });
});
