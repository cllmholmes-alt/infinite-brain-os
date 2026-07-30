import { describe, expect, it } from 'vitest';
import { EventLedger } from '../../src/events/ledger';
import { diffSnapshots } from '../../src/events/diff';
import { emptyGraph, upsertNode } from '../../src/graph/document';
import { compactEvents } from '../../src/events/retention';
import { defaultRuntimeState } from '../../src/graph/runtime';

const timestamp = '2026-07-30T00:00:00.000Z';

describe('temporal-ledger event ledger', () => {
  it('replays events in order', () => {
    const ledger = new EventLedger([
      {
        id: 'e1',
        type: 'graph-edit',
        timestamp,
        actorId: 'actor',
        targetId: 't',
        data: {
          action: 'upsert-node',
          node: {
            id: 'n1',
            aliases: [],
            class: 'service',
            name: 'One',
            lifecycle: 'active',
            createdAt: timestamp,
            updatedAt: timestamp,
            sensitivity: 'internal',
            facts: {},
          },
        },
      },
    ]);

    const snapshot = ledger.replay(
      emptyGraph(),
      { ...defaultRuntimeState, lastUpdatedAt: timestamp },
      '3000-01-01T00:00:00.000Z',
    );
    expect(snapshot.graph.nodes).toHaveLength(1);
    expect(snapshot.hash).toMatch(/^sha256-[a-f0-9]{64}$/);
  });

  it('supports compacting by time and count', () => {
    const source = [
      {
        id: 'a',
        type: 'graph-edit',
        timestamp: '2026-07-29T00:00:00.000Z',
        actorId: 'a',
        targetId: 'a',
        data: {},
      },
      {
        id: 'b',
        type: 'graph-edit',
        timestamp: '2026-07-30T00:00:00.000Z',
        actorId: 'a',
        targetId: 'a',
        data: {},
      },
    ] as const;
    expect(compactEvents([...source], { maxEvents: 1, maxAgeDays: 1 }).length).toBeLessThanOrEqual(
      1,
    );
  });

  it('diffs snapshots', () => {
    const a = emptyGraph();
    const b = upsertNode(a, {
      id: 'n1',
      aliases: [],
      class: 'service',
      name: 'Node',
      lifecycle: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
      sensitivity: 'public',
      facts: {},
    });

    const changed = diffSnapshots(a, b);
    expect(changed.nodesAdded).toEqual(['n1']);
  });

  it('diffs sources, clusters, facts, schema, and runtime facts without key-order false positives', () => {
    const before = emptyGraph();
    const source = {
      id: 'source',
      label: 'Source',
      kind: 'human' as const,
      owner: 'operator',
      authorityRank: 1,
      activeSince: timestamp,
    };
    const fact = {
      value: { a: 1, b: 2 },
      evidence: {
        sourceId: 'source',
        observedAt: timestamp,
        collectedAt: timestamp,
        expiresAt: null,
        method: 'test',
        confidence: 'high' as const,
        authority: 'observed' as const,
        collectorVersion: '1',
        environment: 'test',
        evidenceHandle: 'ev',
      },
    };
    const reordered = { ...before, sources: [source], facts: { ordered: fact } };
    const sameMeaning = structuredClone(reordered);
    sameMeaning.facts.ordered.value = { b: 2, a: 1 };
    expect(diffSnapshots(reordered, sameMeaning).factsChanged).toEqual([]);
    const changed = diffSnapshots(before, {
      ...before,
      schemaVersion: '4.0.1',
      sources: [source],
      clusters: [{ id: 'cluster', label: 'Cluster', nodeIds: [], summary: 'Empty' }],
      facts: reordered.facts,
      runtimeFacts: reordered.facts,
    });
    expect(changed.schemaChanged).toBe(true);
    expect(changed.sourcesChanged).toEqual(['source']);
    expect(changed.clustersChanged).toEqual(['cluster']);
    expect(changed.factsChanged).toEqual(['ordered']);
    expect(changed.runtimeFactsChanged).toEqual(['ordered']);
  });

  it('is immutable, rejects duplicate IDs, and binds graph and runtime to replay hash', () => {
    const source = {
      id: 'immutable-event',
      type: 'graph-edit' as const,
      timestamp,
      actorId: 'operator-a',
      targetId: 'n1',
      data: { action: 'remove-node', nodeId: 'n1' },
    };
    const ledger = new EventLedger([source]);
    source.actorId = 'attacker';
    source.data.nodeId = 'other';
    const listed = ledger.list();
    listed[0]!.actorId = 'attacker-2';
    expect(ledger.list()[0]).toMatchObject({ actorId: 'operator-a', data: { nodeId: 'n1' } });
    expect(() => ledger.append({ ...source, actorId: 'operator-a' })).toThrow('duplicate-event-id');

    const runtime = { ...defaultRuntimeState, lastUpdatedAt: timestamp };
    const base = emptyGraph();
    const first = ledger.replay(base, runtime, timestamp);
    const second = ledger.replay(base, runtime, timestamp);
    expect(second).toEqual(first);
    expect(ledger.replay(base, { ...runtime, mode: 'act' }, timestamp).hash).not.toBe(first.hash);
    expect(
      ledger.replay({ ...emptyGraph(), manifestVersion: 'different' }, runtime, timestamp).hash,
    ).not.toBe(first.hash);
  });

  it('changes the digest when material event payload changes', () => {
    const event = {
      id: 'e-hash',
      type: 'graph-edit' as const,
      timestamp,
      actorId: 'operator-a',
      targetId: 'n1',
      data: { action: 'remove-node', nodeId: 'n1' },
    };
    const runtime = { ...defaultRuntimeState, lastUpdatedAt: timestamp };
    const first = new EventLedger([event]).replay(emptyGraph(), runtime, timestamp);
    const changed = new EventLedger([
      { ...event, data: { action: 'remove-node', nodeId: 'n2' } },
    ]).replay(emptyGraph(), runtime, timestamp);
    expect(changed.hash).not.toBe(first.hash);
  });
});
