import { type AdapterCollector, type AdapterResult, buildAdapterEvidence } from '../contract';
import { isAllowedLoopbackHttpUrl } from '../../security/sanitize';

interface HttpFacts {
  status: number;
  url: string;
  ok: boolean;
}

const ALLOWED_METHODS = new Set(['GET', 'HEAD']);

export class HttpHealthCollector implements AdapterCollector<HttpFacts> {
  id = 'collector.http.health';
  label = 'Local http endpoint check';
  sourceKind = 'http';
  private method: string;

  constructor(
    private url: string,
    method = 'GET',
    private timeoutMs = 5_000,
  ) {
    this.method = method.toUpperCase();
  }

  async collect(): Promise<AdapterResult<HttpFacts>> {
    const requestedAt = new Date().toISOString();
    const started = Date.now();
    const failure = (error: string): AdapterResult<HttpFacts> => ({
      sourceId: this.id,
      requestedAt,
      collectedAt: new Date().toISOString(),
      durationMs: Date.now() - started,
      status: 'unavailable',
      error,
    });

    if (!isAllowedLoopbackHttpUrl(this.url)) return failure('http-target-not-local');
    if (!ALLOWED_METHODS.has(this.method)) return failure('http-method-not-allowed');
    if (!Number.isFinite(this.timeoutMs) || this.timeoutMs < 1 || this.timeoutMs > 30_000) {
      return failure('http-timeout-invalid');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort('http-timeout'), this.timeoutMs);
    try {
      const response = await fetch(this.url, {
        method: this.method,
        redirect: 'manual',
        signal: controller.signal,
        credentials: 'omit',
        cache: 'no-store',
      });
      if (response.status >= 300 && response.status < 400) {
        await response.body?.cancel();
        return failure('http-redirect-denied');
      }
      const collectedAt = new Date().toISOString();
      const value = { status: response.status, url: this.url, ok: response.ok };
      await response.body?.cancel();
      return {
        sourceId: this.id,
        requestedAt,
        collectedAt,
        durationMs: Date.now() - started,
        status: 'success',
        value,
        evidence: [
          buildAdapterEvidence(
            this.id,
            collectedAt,
            `http.${this.method.toLowerCase()}`,
            response.ok ? 'high' : 'medium',
          ),
        ],
      };
    } catch (error) {
      const reason = controller.signal.aborted ? 'http-timeout' : (error as Error).message;
      return failure(reason);
    } finally {
      clearTimeout(timeout);
    }
  }
}
