import { AdapterResult } from '../contract';

export class UnsupportedProviderAdapter {
  constructor(private providerName: string) {}

  async collect(): Promise<AdapterResult<unknown>> {
    return {
      sourceId: `provider.${this.providerName}.unsupported`,
      requestedAt: new Date().toISOString(),
      collectedAt: new Date().toISOString(),
      durationMs: 0,
      status: 'unavailable',
      error: `provider-${this.providerName}-not-supported-in-local-mode`,
    };
  }
}
