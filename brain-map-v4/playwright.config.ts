import { defineConfig } from '@playwright/test';
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

function cachedChrome(): string {
  const root = join(homedir(), 'Library', 'Caches', 'ms-playwright');
  const versions = existsSync(root)
    ? readdirSync(root)
        .filter((name) => name.startsWith('chromium-'))
        .sort()
        .reverse()
    : [];
  for (const version of versions) {
    const candidate = join(
      root,
      version,
      'chrome-mac-arm64',
      'Google Chrome for Testing.app',
      'Contents',
      'MacOS',
      'Google Chrome for Testing',
    );
    if (existsSync(candidate)) return candidate;
  }
  throw new Error('No cached Chrome executable found. Browser gates cannot be marked PASS.');
}

export default defineConfig({
  testDir: './tests/visual',
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    launchOptions: { executablePath: cachedChrome() },
  },
  expect: { timeout: 10_000 },
  projects: [
    {
      name: 'cached-chrome',
      use: { viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 },
    },
  ],
});
