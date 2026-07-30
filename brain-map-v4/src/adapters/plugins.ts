import type { AdapterCollector, AdapterResult } from './contract';

export class AdapterPluginRegistry {
  private plugins = new Map<string, AdapterCollector<unknown>>();

  register(plugin: AdapterCollector<unknown>): void {
    if (!plugin.id.trim() || !plugin.label.trim() || !plugin.sourceKind.trim()) {
      throw new Error('adapter-plugin-invalid');
    }
    if (this.plugins.has(plugin.id)) throw new Error('duplicate-adapter-plugin-id');
    this.plugins.set(plugin.id, plugin);
  }

  list(): string[] {
    return [...this.plugins.keys()].sort();
  }

  async collectAll(): Promise<AdapterResult<unknown>[]> {
    const entries = [...this.plugins.values()].sort((left, right) =>
      left.id.localeCompare(right.id),
    );
    return Promise.all(
      entries.map(async (plugin) => {
        const requestedAt = new Date().toISOString();
        try {
          const result = await plugin.collect();
          if (
            result.status === 'success' &&
            (!result.evidence.length ||
              result.evidence.some(
                (entry) =>
                  !entry.sourceId.trim() ||
                  !entry.evidenceHandle.trim() ||
                  !Number.isFinite(Date.parse(entry.collectedAt)),
              ))
          ) {
            return {
              sourceId: plugin.id,
              requestedAt,
              collectedAt: new Date().toISOString(),
              durationMs: 0,
              status: 'error' as const,
              error: 'adapter-success-evidence-invalid',
            };
          }
          return result;
        } catch (error) {
          return {
            sourceId: plugin.id,
            requestedAt,
            collectedAt: new Date().toISOString(),
            durationMs: 0,
            status: 'error' as const,
            error: (error as Error).message,
          };
        }
      }),
    );
  }
}
