import { loadavg, uptime, freemem, totalmem, cpus, type } from 'node:os';
import { execFileSync } from 'node:child_process';
import { AdapterCollector, AdapterResult, buildAdapterEvidence } from '../contract';

function gitAvailableOnPath(): boolean {
  try {
    execFileSync('git', ['--version'], {
      stdio: ['ignore', 'ignore', 'ignore'],
      timeout: 2_000,
      maxBuffer: 16_384,
    });
    return true;
  } catch {
    return false;
  }
}

interface SystemFacts {
  nodeVersion: string;
  osType: string;
  cpuCount: number;
  uptimeSeconds: number;
  loadAverage: number[];
  memory: {
    free: number;
    total: number;
  };
  gitBinaryAvailable: boolean;
}

export class SystemCollector implements AdapterCollector<SystemFacts> {
  id = 'collector.system.local';
  label = 'Runtime host snapshot';
  sourceKind = 'system';

  async collect(): Promise<AdapterResult<SystemFacts>> {
    const requestedAt = new Date().toISOString();
    const started = Date.now();

    try {
      const value = {
        nodeVersion: process.version,
        osType: type(),
        cpuCount: cpus().length,
        uptimeSeconds: uptime(),
        loadAverage: loadavg(),
        memory: {
          free: freemem(),
          total: totalmem(),
        },
        gitBinaryAvailable: gitAvailableOnPath(),
      };
      const collectedAt = new Date().toISOString();
      return {
        sourceId: this.id,
        requestedAt,
        collectedAt,
        durationMs: Date.now() - started,
        status: 'success',
        value,
        evidence: [buildAdapterEvidence(this.id, collectedAt, 'system.read')],
      };
    } catch (error) {
      return {
        sourceId: this.id,
        requestedAt,
        collectedAt: new Date().toISOString(),
        durationMs: Date.now() - started,
        status: 'error',
        error: (error as Error).message,
      };
    }
  }
}
