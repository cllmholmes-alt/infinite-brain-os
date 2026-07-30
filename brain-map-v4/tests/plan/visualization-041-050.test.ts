import { describe, expect, it } from 'vitest';
import { buildNarrativeWalkthrough } from '../../src/product/collaboration';
import { baseGraph } from '../../src/fixtures';
import { defaultRuntimeState, setMode } from '../../src/graph/runtime';
import { meridianLayout } from '../../src/layout/meridian';
import { buildEvidenceDrawerModel } from '../../src/visualization/evidence-drawer';
import {
  applyGraphLenses,
  buildFocusTunnel,
  buildPathBreadcrumb,
  buildSemanticViewModel,
  computeConvexHull,
  evidenceVisualEncoding,
  motionPreset,
} from '../../src/visualization/view-model';

const now = Date.parse('2026-07-30T10:00:00.000Z');

describe('Brain Map spatial sensemaking 41-50', () => {
  it('plan-041: Observe, Explain, and Act modes are explicit immutable runtime states', () => {
    const observe = setMode(defaultRuntimeState, 'observe');
    const explain = setMode(observe, 'explain');
    const act = setMode(explain, 'act');
    expect([observe.mode, explain.mode, act.mode]).toEqual(['observe', 'explain', 'act']);
    expect(defaultRuntimeState.mode).toBe('observe');
  });

  it('plan-042: semantic zoom changes composition and visible information at overview, neighborhood, and detail', () => {
    const nodeId = baseGraph.nodes[0]!.id;
    const overview = buildSemanticViewModel(baseGraph, 'overview', null, now);
    const neighborhood = buildSemanticViewModel(baseGraph, 'neighborhood', nodeId, now);
    const detail = buildSemanticViewModel(baseGraph, 'detail', nodeId, now);
    expect(overview).toMatchObject({ kind: 'territories', edgeIds: [], visibleFactKeys: [] });
    expect(neighborhood.nodeIds).toContain(nodeId);
    expect(detail.visibleFactKeys.length).toBeGreaterThanOrEqual(
      neighborhood.visibleFactKeys.length,
    );
  });

  it('plan-043: stable mental-map layout is seeded, deterministic, and responds to actual graph links', () => {
    const first = meridianLayout(baseGraph, 1200, 700, defaultRuntimeState);
    const second = meridianLayout(structuredClone(baseGraph), 1200, 700, defaultRuntimeState);
    expect(second).toEqual(first);
    const linked = baseGraph.edges[0]!;
    const source = first.positions[linked.source]!;
    const target = first.positions[linked.target]!;
    expect(Math.hypot(source.x - target.x, source.y - target.y)).toBeLessThan(1200);
  });

  it('plan-044: focus tunnel preserves selected, one-hop, and bounded two-hop context while identifying dimmed nodes', () => {
    const selected = baseGraph.nodes[0]!.id;
    const tunnel = buildFocusTunnel(baseGraph, selected, 2);
    expect(tunnel.nodeIds).toContain(selected);
    expect(tunnel.nodeIds.length).toBeGreaterThan(1);
    expect(Object.keys(tunnel.depthByNode).sort()).toEqual(tunnel.nodeIds);
  });

  it('plan-045: path tracing returns truthful route nodes, typed edges, and breadcrumbs', () => {
    const edge = baseGraph.edges[0]!;
    const path = buildPathBreadcrumb(baseGraph, edge.source, edge.target);
    expect(path.nodeIds).toEqual([edge.source, edge.target]);
    expect(path.edgeIds).toEqual([edge.id]);
    expect(path.breadcrumbs.join(' → ')).toContain('→');
  });

  it('plan-046: question-led lenses compose as an explicit union with reasons and no graph duplication', () => {
    const projection = applyGraphLenses(baseGraph, ['operations', 'security']);
    expect(projection.mode).toBe('union');
    expect(new Set(projection.nodeIds).size).toBe(projection.nodeIds.length);
    expect(Object.keys(projection.reasonsByNode).length).toBe(projection.nodeIds.length);
  });

  it('plan-047: territory and relationship legibility uses deterministic member hulls and separate evidence channels', () => {
    const hull = computeConvexHull([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
      { x: 5, y: 5 },
    ]);
    expect(hull).toEqual([
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
    ]);
    const encoding = evidenceVisualEncoding({
      confidence: 'low',
      freshness: 'stale',
      criticality: 'high',
    });
    expect(typeof encoding.opacity).toBe('number');
    expect(typeof encoding.strokeWidth).toBe('number');
    expect(['solid', 'dotted', 'dashed']).toContain(encoding.pattern);
    expect(typeof encoding.pulse).toBe('boolean');
  });

  it('plan-048: strict motion budget removes motion for reduced motion and particles for low stimulation', () => {
    expect(motionPreset('reduced-motion')).toEqual({
      animate: false,
      durationMs: 0,
      particles: 0,
      easing: 'linear',
    });
    expect(motionPreset('low-stimulation').particles).toBe(0);
    expect(motionPreset('stable').particles).toBeGreaterThan(0);
  });

  it('plan-049: evidence drawer remains anchored to the selected node with source, time, confidence, and handle', () => {
    const node = baseGraph.nodes.find((entry) => Object.keys(entry.facts).length > 0)!;
    const drawer = buildEvidenceDrawerModel(baseGraph, node.id);
    expect(drawer.anchorNodeId).toBe(node.id);
    expect(drawer.records.length).toBeGreaterThan(0);
    const record = drawer.records[0]!;
    expect(typeof record.sourceId).toBe('string');
    expect(typeof record.sourceLabel).toBe('string');
    expect(record.observedAt === null || typeof record.observedAt === 'string').toBe(true);
    expect(typeof record.evidenceHandle).toBe('string');
    expect(typeof record.confidence).toBe('string');
  });

  it('plan-050: narrative walkthrough saves ordered viewpoints, annotations, evidence, and uncertainty', () => {
    const walkthrough = buildNarrativeWalkthrough(baseGraph, [
      baseGraph.nodes[0]!.id,
      baseGraph.nodes[1]!.id,
    ]);
    expect(walkthrough.steps.map((step) => step.index)).toEqual([0, 1]);
    expect(walkthrough.steps[0]!.nodeId).toBe(baseGraph.nodes[0]!.id);
    expect(['unknown', 'available']).toContain(walkthrough.steps[0]!.truthState);
  });
});
