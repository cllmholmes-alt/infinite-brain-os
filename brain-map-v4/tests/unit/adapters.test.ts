import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { GitCollector, HttpHealthCollector, SystemCollector } from '../../src/adapters';

describe('adapter-contract read-only adapters', () => {
  it('collects local git metadata when available', async () => {
    const result = await new GitCollector(process.cwd()).collect();
    expect(result.status).toBe('success');
    expect(result.sourceId).toBe('collector.git.local');
    expect(result.evidence?.length).toBeGreaterThan(0);
  });

  it('keeps local git evidence available when no upstream is configured', async () => {
    const repo = mkdtempSync(join(tmpdir(), 'brain-map-v4-git-'));
    try {
      execFileSync('git', ['init', '-q'], { cwd: repo });
      execFileSync('git', ['config', 'user.email', 'brain-map@example.invalid'], { cwd: repo });
      execFileSync('git', ['config', 'user.name', 'Brain Map Test'], { cwd: repo });
      writeFileSync(join(repo, 'README.md'), '# fixture\n');
      execFileSync('git', ['add', 'README.md'], { cwd: repo });
      execFileSync('git', ['commit', '-qm', 'fixture'], { cwd: repo });

      const result = await new GitCollector(repo).collect();
      expect(result.status).toBe('success');
      expect(result.value?.remote).toBeUndefined();
      expect(result.value?.localCommit).toMatch(/^[0-9a-f]{40}$/);
    } finally {
      rmSync(repo, { recursive: true, force: true });
    }
  });

  it('collects local system metrics', async () => {
    const result = await new SystemCollector().collect();
    expect(result.status).toBe('success');
    expect(result.value?.nodeVersion).toMatch(/^v/);
    expect(result.evidence?.length).toBeGreaterThan(0);
  });

  it('denies non-local HTTP targets before fetch is called', async () => {
    let calls = 0;
    const originalFetch = globalThis.fetch;
    globalThis.fetch = async () => {
      calls += 1;
      return new Response(null, { status: 200 });
    };
    try {
      const result = await new HttpHealthCollector('http://169.254.169.254/latest').collect();
      expect(result.status).toBe('unavailable');
      expect(result.error).toContain('http-target-not-local');
      expect(calls).toBe(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
