import { expect, test, type Page } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const evidenceDir = resolve(process.cwd(), 'outputs/brain-map-v4/screenshots');
mkdirSync(evidenceDir, { recursive: true });

async function openApp(page: Page, viewport = { width: 1440, height: 960 }): Promise<void> {
  await page.setViewportSize(viewport);
  const html = readFileSync(resolve(process.cwd(), 'brain-map-v4.html'), 'utf8');
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() =>
    Boolean((window as unknown as { brainMapV4?: unknown }).brainMapV4),
  );
}

async function api(page: Page, command: string, value?: string): Promise<unknown> {
  return page.evaluate(
    ({ command, value }) => {
      const runtime = (
        window as unknown as { brainMapV4: Record<string, (...args: string[]) => unknown> }
      ).brainMapV4;
      return runtime[command]?.(...(value === undefined ? [] : [value]));
    },
    { command, value },
  );
}

test.describe('semantic-zoom operator-surface visual matrix', () => {
  test('desktop overview renders the 26/36/7 command surface', async ({ page }) => {
    await openApp(page);
    const snapshot = (await api(page, 'snapshot')) as {
      nodes: number;
      edges: number;
      clusters: number;
    };
    expect(snapshot).toMatchObject({ nodes: 26, edges: 36, clusters: 7 });
    await expect(page.getByTestId('priority-command-queue')).toBeVisible();
    await expect(page.getByTestId('operation-timeline')).toBeVisible();
    const canvasSize = await page.locator('#main-canvas').evaluate((canvas) => ({
      width: (canvas as HTMLCanvasElement).width,
      height: (canvas as HTMLCanvasElement).height,
    }));
    expect(canvasSize.width).toBeGreaterThan(700);
    expect(canvasSize.height).toBeGreaterThan(400);
    await page.screenshot({ path: resolve(evidenceDir, '01-overview-light.png'), fullPage: true });
  });

  test('neighborhood, detail, explain, and act are distinct states', async ({ page }) => {
    await openApp(page);
    await api(page, 'selectNode', 'ib');
    await api(page, 'setZoom', 'neighborhood');
    await expect(page.locator('#status')).toContainText('neighborhood');
    await page.screenshot({
      path: resolve(evidenceDir, '02-neighborhood-focus.png'),
      fullPage: true,
    });
    await api(page, 'setZoom', 'detail');
    await api(page, 'setMode', 'explain');
    await expect(page.locator('#status')).toContainText('explain mode, detail zoom');
    await page.screenshot({ path: resolve(evidenceDir, '03-detail-explain.png'), fullPage: true });
    await page.getByRole('button', { name: 'Act', exact: true }).click();
    await expect(page.getByLabel('Context inspector').getByText('Dispatch blocked')).toBeVisible();
    await expect(
      page.getByLabel('Context inspector').getByRole('button', { name: 'Execute mutation' }),
    ).toBeDisabled();
    await page.screenshot({ path: resolve(evidenceDir, '04-act-blocked.png'), fullPage: true });
  });

  test('light, dark, and reduced-motion states remain functional', async ({ page }) => {
    await openApp(page);
    await api(page, 'setTheme', 'dark');
    await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'dark');
    await page.screenshot({ path: resolve(evidenceDir, '05-dark.png'), fullPage: true });
    await page.getByRole('button', { name: 'Pause all motion' }).click();
    await expect(page.getByRole('button', { name: 'Pause all motion' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await page.screenshot({ path: resolve(evidenceDir, '06-reduced-motion.png'), fullPage: true });
  });

  test('unknown, stale, unavailable, error, loading, and empty states are explicit', async ({
    page,
  }) => {
    await openApp(page);
    for (const preset of ['unknown', 'stale', 'unavailable', 'error', 'loading', 'empty']) {
      await api(page, 'setPreset', preset);
      await expect(page.locator('.app-shell')).toHaveAttribute('data-preset', preset);
      if (preset === 'empty') {
        await expect
          .poll(async () => ((await api(page, 'snapshot')) as { nodes: number }).nodes)
          .toBe(0);
        await expect(page.locator('#semantic-tree [role="treeitem"]')).toHaveCount(0);
      }
      await page.screenshot({ path: resolve(evidenceDir, `state-${preset}.png`), fullPage: true });
    }
  });

  test('operator workbench executes saved-view, watchlist, scenario, report, and dry-run workflows', async ({
    page,
  }) => {
    await openApp(page);
    await api(page, 'selectNode', 'ib');
    await page.getByRole('button', { name: 'Open operator workbench' }).click();
    const dialog = page.getByRole('dialog', { name: 'Operator workbench' });
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: 'Save current view' }).click();
    await expect(page.getByTestId('saved-view-count')).toHaveText('1');
    await page.getByRole('button', { name: 'Watch selected entity' }).click();
    await expect(page.getByTestId('watch-state')).toContainText('ib');
    await page.getByRole('tab', { name: 'Scenarios' }).click();
    await expect(page.getByTestId('scenario-comparison')).toContainText('Pareto');
    await dialog.getByRole('tab', { name: 'Actions' }).click();
    await page.getByRole('button', { name: 'Prepare governed dry run' }).click();
    await expect(page.getByTestId('dry-run-state')).toContainText('sha256-');
    await expect(page.getByRole('button', { name: 'Execute governed action' })).toBeDisabled();
  });

  test('dense stress fixture renders 250 entities and 600 edges', async ({ page }) => {
    await openApp(page);
    await api(page, 'setPreset', 'dense');
    const snapshot = (await api(page, 'snapshot')) as { nodes: number; edges: number };
    expect(snapshot).toMatchObject({ nodes: 250, edges: 600 });
    expect(snapshot).toMatchObject({ projection: 'territory-aggregate' });
    await page.screenshot({ path: resolve(evidenceDir, 'state-dense-250.png'), fullPage: true });
  });

  test('revision-bound worker is deterministic and rejects stale results', async ({ page }) => {
    await openApp(page);
    const proof = await api(page, 'workerProof');
    expect(proof).toEqual({
      worker: true,
      deterministic: true,
      staleRejected: true,
      transferredCoordinates: 6,
    });
  });

  test('1,000-node stress estate stays aggregated, windowed, and worker-bound', async ({
    page,
  }) => {
    await openApp(page);
    await api(page, 'setPreset', 'stress');
    await api(page, 'setZoom', 'overview');
    const snapshot = await api(page, 'snapshot');
    expect(snapshot).toMatchObject({ nodes: 1000, edges: 3000, projection: 'territory-aggregate' });
    const worker = (await api(page, 'productionWorkerProof')) as {
      accepted: boolean;
      nodeCount: number;
      rendererNodeCount: number;
      revision: string;
      inputHash: string;
    };
    expect(worker).toMatchObject({ accepted: true, nodeCount: 1000, rendererNodeCount: 1000 });
    expect(worker.revision).toMatch(/^sha256-[a-f0-9]{64}$/);
    expect(worker.inputHash).toMatch(/^sha256-[a-f0-9]{64}$/);
    await expect(page.locator('#tree-list .mobile-node')).toHaveCount(80);
    await expect(page.locator('#tree-list .projection-window-note')).toContainText(
      'Showing 80 of 1000',
    );
  });

  test('narrow viewport uses list-first projection and preserves inspectable detail', async ({
    page,
  }) => {
    await openApp(page, { width: 390, height: 844 });
    await expect(page.locator('.mobile-projection')).toBeVisible();
    await expect(page.locator('.graph-stage')).toBeHidden();
    await expect(page.locator('#mobile-list .mobile-node')).toHaveCount(26);
    await page.locator('#mobile-list .mobile-node').filter({ hasText: 'Infinite Brain' }).click();
    await expect(page.locator('#mobile-detail')).toBeVisible();
    await expect(page.locator('#mobile-detail').getByRole('tab')).toHaveCount(3);
    await page.locator('#mobile-detail').getByRole('tab', { name: 'Actions' }).click();
    await expect(page.locator('#mobile-detail').getByText('Dispatch blocked')).toBeVisible();
    const lastNode = page.locator('#mobile-list .mobile-node').last();
    await lastNode.scrollIntoViewIfNeeded();
    await expect(lastNode).toBeVisible();
    await page.screenshot({ path: resolve(evidenceDir, '07-mobile-list.png'), fullPage: true });
  });

  test('semantic tree keyboard navigation and capability ledger are complete', async ({ page }) => {
    await openApp(page);
    await expect(page.locator('#semantic-tree [role="treeitem"]')).toHaveCount(26);
    await page.locator('#semantic-tree [role="treeitem"]').first().focus();
    await page.keyboard.press('ArrowDown');
    const focusedText = await page.evaluate(() => document.activeElement?.textContent);
    expect(focusedText).toBeTruthy();
    await page.getByRole('button', { name: 'Open 100 item capability ledger' }).click();
    await expect(page.locator('#capability-list .capability-row')).toHaveCount(100);
    await page.screenshot({
      path: resolve(evidenceDir, '08-capability-ledger.png'),
      fullPage: true,
    });
  });
});
