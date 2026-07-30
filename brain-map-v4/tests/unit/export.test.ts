import { describe, expect, it } from 'vitest';
import { exportManifest, redactGraph } from '../../src/export/redaction';
import { shareableSnapshot } from '../../src/export/share';
import { baseGraph } from '../../src/fixtures';

describe('export-governance export and redaction', () => {
  it('creates public export manifest', () => {
    const manifest = exportManifest(baseGraph, 'public');
    expect(manifest.policy).toBe('public');
    expect(manifest.redactionApplied).toBe(true);
    expect(typeof manifest.exportedAt).toBe('string');
  });

  it('redacts node facts in public mode', () => {
    const graph = structuredClone(baseGraph);
    graph.nodes[0]!.sensitivity = 'public';
    const redacted = redactGraph(graph, 'public');
    const publicNode = redacted.nodes.find((node) => node.id === graph.nodes[0]!.id);
    expect(publicNode?.aliases).toHaveLength(0);
    expect(redacted.nodes.every((node) => node.sensitivity === 'public')).toBe(true);
  });

  it('builds share snapshots with checksum', () => {
    const share = shareableSnapshot(baseGraph, 'internal');
    expect(typeof share.checksum).toBe('string');
    expect(share.urlSafeText.includes('"policy":"internal"')).toBe(true);
  });

  it('public export removes prohibited nodes, secret-like keys, and private evidence handles', () => {
    const graph = structuredClone(baseGraph);
    const node = graph.nodes[0]!;
    node.sensitivity = 'prohibited';
    node.facts.credentials = {
      value: {
        token: 'TOKEN-LEAK',
        apiKey: 'API-LEAK',
        password: 'PASSWORD-LEAK',
        endpoint: 'file:///Users/operator/private/evidence',
      },
      evidence: {
        sourceId: 'collector.test',
        authority: 'observed',
        observedAt: '2026-07-30T00:00:00.000Z',
        collectedAt: '2026-07-30T00:00:01.000Z',
        expiresAt: null,
        expiresAfterMs: 300_000,
        confidence: 'high',
        method: 'test.fixture',
        collectorVersion: '1.0.0',
        environment: 'test',
        evidenceHandle: 'file:///Users/operator/private/evidence',
      },
    };

    const output = JSON.stringify(exportManifest(graph, 'public'));
    expect(output).not.toContain(node.id);
    expect(output).not.toContain('TOKEN-LEAK');
    expect(output).not.toContain('API-LEAK');
    expect(output).not.toContain('PASSWORD-LEAK');
    expect(output).not.toContain('file:///Users/operator/private/evidence');
  });
});
