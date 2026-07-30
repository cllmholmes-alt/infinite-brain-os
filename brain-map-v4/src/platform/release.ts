import type { GraphDocument, RuntimeState } from '../schema/types';

export interface SourceModuleEntry {
  path: string;
  hash: string;
  kind: string;
}

export function createModuleReleaseManifest(
  modules: SourceModuleEntry[],
  artifact: { path: string; hash: string; networkRequests: number },
): {
  sourceCount: number;
  sourceKinds: string[];
  artifactPath: string;
  artifactHash: string;
  standalone: true;
} {
  if (artifact.networkRequests !== 0) throw new Error('release-network-dependency');
  if (!artifact.path.endsWith('.html') || !artifact.hash.startsWith('sha256-')) {
    throw new Error('release-artifact-invalid');
  }
  if (!modules.length) throw new Error('release-modules-required');
  const paths = new Set<string>();
  for (const module of modules) {
    if (
      !module.path.startsWith('src/') ||
      !module.path.endsWith('.ts') ||
      !module.hash.startsWith('sha256-')
    ) {
      throw new Error('release-module-invalid');
    }
    if (paths.has(module.path)) throw new Error('release-module-duplicate');
    paths.add(module.path);
  }
  return {
    sourceCount: modules.length,
    sourceKinds: [...new Set(modules.map((module) => module.kind))].sort(),
    artifactPath: artifact.path,
    artifactHash: artifact.hash,
    standalone: true,
  };
}

export interface Renderer {
  id: string;
  render(graph: GraphDocument, runtime: RuntimeState): { drawnNodes: number; drawnEdges: number };
}

export class RendererRegistry {
  private renderers = new Map<string, Renderer>();

  register(renderer: Renderer): void {
    if (!renderer.id.trim() || this.renderers.has(renderer.id))
      throw new Error('renderer-registration-invalid');
    this.renderers.set(renderer.id, renderer);
  }

  get(id: string): Renderer | undefined {
    return this.renderers.get(id);
  }
}

export function evaluateRendererBenchmark(
  frameDurationsMs: number[],
  budget: { p95Ms: number; maxLongTasks: number },
  longTasks: number,
): { passed: boolean; p95Ms: number; longTasks: number; samples: number } {
  if (
    !frameDurationsMs.length ||
    frameDurationsMs.some((value) => !Number.isFinite(value) || value < 0)
  ) {
    throw new Error('renderer-benchmark-samples-invalid');
  }
  const sorted = [...frameDurationsMs].sort((left, right) => left - right);
  const p95Ms = sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)]!;
  return {
    passed: p95Ms <= budget.p95Ms && longTasks <= budget.maxLongTasks,
    p95Ms,
    longTasks,
    samples: sorted.length,
  };
}
