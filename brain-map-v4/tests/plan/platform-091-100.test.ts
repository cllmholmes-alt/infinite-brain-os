import { describe, expect, it } from 'vitest';
import { baseGraph } from '../../src/fixtures';
import { defaultRuntimeState } from '../../src/graph/runtime';
import { GitCollector } from '../../src/adapters';
import { acceptBoundWorkerResult } from '../../src/workers/graph-worker';
import { AdapterPluginRegistry } from '../../src/adapters/plugins';
import { buildAccessibleGraphModel } from '../../src/accessibility/model';
import { CognitiveLoadController } from '../../src/accessibility/cognitive-load';
import { OfflineSnapshotCache } from '../../src/offline/snapshot-cache';
import {
  RendererRegistry,
  createModuleReleaseManifest,
  evaluateRendererBenchmark,
} from '../../src/platform/release';
import { GraphWorkScheduler } from '../../src/platform/scheduler';
import { evaluateThreatModel } from '../../src/security/threat-model';
import { evaluateReleaseEvidence } from '../../src/certification/evidence';

const now = '2026-07-30T12:00:00.000Z';

describe('Brain Map release platform 91-100', () => {
  it('plan-091: binds modular TypeScript sources to one no-network standalone artifact', () => {
    const manifest = createModuleReleaseManifest(
      [
        { path: 'src/domain/truth.ts', hash: 'sha256-a', kind: 'domain' },
        { path: 'src/ui/app.ts', hash: 'sha256-b', kind: 'ui' },
      ],
      { path: 'brain-map-v4.html', hash: 'sha256-c', networkRequests: 0 },
    );
    expect(manifest).toMatchObject({ sourceCount: 2, artifactHash: 'sha256-c', standalone: true });
    expect(() =>
      createModuleReleaseManifest([], {
        path: 'brain-map-v4.html',
        hash: 'sha256-c',
        networkRequests: 1,
      }),
    ).toThrow('release-network-dependency');
  });

  it('plan-092: renderer abstraction selects an implementation and enforces benchmark budgets', () => {
    const registry = new RendererRegistry();
    registry.register({ id: 'canvas', render: () => ({ drawnNodes: 1, drawnEdges: 0 }) });
    expect(registry.get('canvas')?.render(baseGraph, defaultRuntimeState)).toEqual({
      drawnNodes: 1,
      drawnEdges: 0,
    });
    expect(evaluateRendererBenchmark([8, 12, 20], { p95Ms: 25, maxLongTasks: 0 }, 0).passed).toBe(
      true,
    );
  });

  it('plan-093: worker results bind job, revision, input hash, node identity, and finite coordinates', () => {
    const request = {
      type: 'layout' as const,
      jobId: 'job',
      revision: 'rev',
      inputHash: 'hash',
      seed: 1,
      nodeIds: ['a'],
    };
    const result = {
      type: 'layout-result' as const,
      jobId: 'job',
      revision: 'rev',
      inputHash: 'hash',
      nodeIds: ['a'],
      positions: new Float32Array([1, 2]),
    };
    expect(acceptBoundWorkerResult(request, result)).toBe(true);
    expect(acceptBoundWorkerResult(request, { ...result, inputHash: 'stale' })).toBe(false);
  });

  it('plan-094: adapter plugin registry enforces unique IDs and complete successful evidence', async () => {
    const registry = new AdapterPluginRegistry();
    registry.register(new GitCollector(process.cwd()));
    const results = await registry.collectAll();
    expect(results[0]?.sourceId).toBe('collector.git.local');
    if (results[0]?.status === 'success') expect(results[0].evidence.length).toBeGreaterThan(0);
    expect(() => registry.register(new GitCollector(process.cwd()))).toThrow(
      'duplicate-adapter-plugin-id',
    );
  });

  it('plan-095: offline boot uses a verified snapshot and marks expired snapshots stale', () => {
    const cache = new OfflineSnapshotCache();
    cache.save(baseGraph, defaultRuntimeState, now, 60_000);
    expect(cache.boot(Date.parse('2026-07-30T12:00:30.000Z')).state).toBe('offline-fresh');
    expect(cache.boot(Date.parse('2026-07-30T12:02:00.000Z')).state).toBe('offline-stale');
  });

  it('plan-096: graph scheduler stays inside a frame budget and defers excess work', () => {
    const scheduler = new GraphWorkScheduler(10);
    scheduler.enqueue({ id: 'layout', estimatedMs: 7, priority: 1 });
    scheduler.enqueue({ id: 'labels', estimatedMs: 5, priority: 2 });
    const frame = scheduler.nextFrame();
    expect(frame.scheduled.map((task) => task.id)).toEqual(['layout']);
    expect(frame.deferred.map((task) => task.id)).toEqual(['labels']);
  });

  it('plan-097: accessibility graph model provides equivalent tree, list, summary, and focus order', () => {
    const model = buildAccessibleGraphModel(baseGraph, defaultRuntimeState);
    expect(model.list).toHaveLength(baseGraph.nodes.length);
    expect(new Set(model.focusOrder)).toEqual(new Set(baseGraph.nodes.map((node) => node.id)));
    expect(model.summary).toContain(`${baseGraph.nodes.length} nodes`);
  });

  it('plan-098: cognitive-load controls preserve a recovery checkpoint and one dominant action', () => {
    const controller = new CognitiveLoadController(defaultRuntimeState);
    controller.setProfile('calm');
    controller.checkpoint('before-focus');
    const view = controller.view(['Primary', 'Secondary', 'Tertiary']);
    expect(view).toMatchObject({
      profile: 'calm',
      dominantAction: 'Primary',
      hiddenActions: ['Secondary', 'Tertiary'],
      recoveryCheckpoint: 'before-focus',
    });
  });

  it('plan-099: threat model fails closed when any high-risk executable probe is unmitigated', () => {
    const pass = evaluateThreatModel({
      schemaValidation: true,
      prototypeSafety: true,
      xssEscaping: true,
      ssrfBoundary: true,
      exportRedaction: true,
      actionAuthority: true,
      mirrorIsolation: true,
    });
    expect(pass.passed).toBe(true);
    expect(evaluateThreatModel({ ...pass.probes, exportRedaction: false }).passed).toBe(false);
  });

  it('plan-100: release evidence requires frozen hashes, all gates, reviews, rollback, and semantic canary', () => {
    const evidence = {
      sourceHash: 'sha256-source',
      artifactHash: 'sha256-artifact',
      v3Hash: 'sha256-v3',
      gates: [
        'typecheck',
        'lint',
        'format',
        'unit',
        'browser',
        'axe',
        'security',
        'audit',
        'performance',
        'offline',
      ].map((id) => ({ id, passed: true })),
      reviews: [
        'architecture',
        'security',
        'accessibility',
        'product',
        'graph',
        'performance',
        'anti-fake',
      ].map((id) => ({ id, verdict: 'PASS' as const, candidateHash: 'sha256-source' })),
      rollbackVerified: true,
      semanticCanaryPassed: true,
      sourceUnchanged: true,
    };
    expect(evaluateReleaseEvidence(evidence).passed).toBe(true);
    expect(evaluateReleaseEvidence({ ...evidence, artifactHash: '' }).passed).toBe(false);
  });
});
