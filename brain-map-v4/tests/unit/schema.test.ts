import { describe, expect, it } from 'vitest';
import { IdentityRegistry } from '../../src/identity/registry';
import {
  graphHash,
  canonicalizeGraph,
  emptyGraph,
  upsertNode,
  upsertEdge,
} from '../../src/graph/document';
import { baseGraph } from '../../src/fixtures';

describe('identity registry', () => {
  it('resolves stable ids and aliases', () => {
    const registry = new IdentityRegistry([
      {
        id: 'service.dashboard',
        canonicalAlias: 'service/dashboard',
        aliases: ['dashboard', 'bm-dashboard'],
        lifecycleState: 'active',
        createdAt: '2026-07-30T00:00:00.000Z',
        updatedAt: '2026-07-30T00:00:00.000Z',
      },
    ]);

    expect(registry.resolve('bm-dashboard')?.id).toBe('service.dashboard');
    expect(registry.has('service.dashboard')).toBe(true);
  });

  it('rejects alias collisions and isolates stored identities from mutation', () => {
    const first = {
      id: 'a',
      canonicalAlias: 'service/a',
      aliases: ['shared'],
      lifecycleState: 'active' as const,
      createdAt: '2026-07-30T00:00:00.000Z',
      updatedAt: '2026-07-30T00:00:00.000Z',
    };
    const registry = new IdentityRegistry([first]);
    first.aliases.push('late-mutation');
    expect(registry.has('late-mutation')).toBe(false);
    expect(() =>
      registry.register({
        ...first,
        id: 'b',
        canonicalAlias: 'service/b',
        aliases: ['shared'],
      }),
    ).toThrow('identity-alias-collision');
    const resolved = registry.resolve('a')!;
    resolved.aliases.push('returned-mutation');
    expect(registry.has('returned-mutation')).toBe(false);
  });
});

describe('graph document contract', () => {
  it('normalizes and hashes', () => {
    const canonical = canonicalizeGraph(baseGraph);
    const expected = baseGraph.nodes.map((node) => node.id).sort();
    const actual = canonical.nodes.map((node) => node.id);
    expect(actual).toEqual(expected);
    expect(graphHash(baseGraph).startsWith('g-')).toBe(true);
  });

  it('upserts node and edge ids', () => {
    const graph = emptyGraph();
    const next = upsertNode(graph, {
      id: 'n1',
      aliases: [],
      class: 'service',
      name: 'Node 1',
      lifecycle: 'active',
      createdAt: '2026-07-30T00:00:00.000Z',
      updatedAt: '2026-07-30T00:00:00.000Z',
      sensitivity: 'public',
      facts: {},
    });

    const up = upsertEdge(next, {
      id: 'e1',
      source: 'n1',
      target: 'n1',
      relation: 'calls',
      direction: 'inbound',
      criticality: 'low',
      confidence: 'high',
      evidenceId: 'ev-1',
      lifecycle: 'active',
    });

    expect(up.nodes).toHaveLength(1);
    expect(up.edges).toHaveLength(1);
  });

  it('rejects duplicate IDs, dangling references, and unsupported schema versions', () => {
    expect(() =>
      canonicalizeGraph({ ...baseGraph, nodes: [baseGraph.nodes[0]!, ...baseGraph.nodes] }),
    ).toThrow('graph-duplicate-node-id');
    expect(() =>
      canonicalizeGraph({
        ...baseGraph,
        edges: [{ ...baseGraph.edges[0]!, target: 'missing-node' }, ...baseGraph.edges.slice(1)],
      }),
    ).toThrow('graph-dangling-edge');
    expect(() => canonicalizeGraph({ ...baseGraph, schemaVersion: 'unsupported' })).toThrow(
      'graph-schema-version-unsupported',
    );
  });
});
