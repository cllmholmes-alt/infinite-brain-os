import { execFileSync } from 'node:child_process';
import { AdapterCollector, AdapterResult, buildAdapterEvidence } from '../contract';

interface GitFacts {
  localCommit: string;
  branch: string;
  status: string;
  remote?: string;
}

function git(cwd: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 5_000,
    maxBuffer: 1_048_576,
  }).trim();
}

export class GitCollector implements AdapterCollector<GitFacts> {
  id = 'collector.git.local';
  label = 'Local git state';
  sourceKind = 'git';

  constructor(private repoPath: string) {
    this.repoPath = repoPath;
  }

  async collect(): Promise<AdapterResult<GitFacts>> {
    const requestedAt = new Date().toISOString();
    const started = Date.now();

    try {
      const cwd = this.repoPath;
      const localCommit = git(cwd, ['rev-parse', 'HEAD']);
      const branch = git(cwd, ['rev-parse', '--abbrev-ref', 'HEAD']);
      const status = git(cwd, ['status', '--short']) || 'clean';
      let remote: string | undefined;
      try {
        remote = git(cwd, ['rev-parse', '--abbrev-ref', '--symbolic-full-name', '@{u}']);
      } catch {
        remote = undefined;
      }

      const value: GitFacts = {
        localCommit,
        branch,
        status,
        ...(remote ? { remote } : {}),
      };

      const collectedAt = new Date().toISOString();
      return {
        sourceId: this.id,
        requestedAt,
        collectedAt,
        durationMs: Date.now() - started,
        status: 'success',
        value,
        evidence: [buildAdapterEvidence(this.id, collectedAt, 'git.read')],
      };
    } catch (error) {
      return {
        sourceId: this.id,
        requestedAt,
        collectedAt: new Date().toISOString(),
        durationMs: Date.now() - started,
        status: 'unavailable',
        error: (error as Error).message,
      };
    }
  }
}
