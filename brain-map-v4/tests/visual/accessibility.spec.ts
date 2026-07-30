import { AxeBuilder } from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

async function load(page: Page): Promise<void> {
  const html = readFileSync(resolve(process.cwd(), 'brain-map-v4.html'), 'utf8');
  await page.setContent(html, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() =>
    Boolean((window as unknown as { brainMapV4?: unknown }).brainMapV4),
  );
}

test.describe('release-gate accessibility', () => {
  test('has no serious or critical Axe violations', async ({ page }) => {
    await load(page);
    const result = await new AxeBuilder({ page }).analyze();
    const blocking = result.violations.filter(
      (item) => item.impact === 'serious' || item.impact === 'critical',
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('dark theme has no serious or critical Axe violations', async ({ page }) => {
    await load(page);
    await page.evaluate(() =>
      (window as unknown as { brainMapV4: { setTheme(value: string): void } }).brainMapV4.setTheme(
        'dark',
      ),
    );
    const results = await new AxeBuilder({ page }).analyze();
    const blocking = results.violations.filter(
      (item) => item.impact === 'serious' || item.impact === 'critical',
    );
    expect(blocking, JSON.stringify(blocking, null, 2)).toEqual([]);
  });

  test('exposes graph meaning through a synchronized semantic tree', async ({ page }) => {
    await load(page);
    await expect(page.locator('[role="tree"]')).toHaveCount(1);
    await expect(page.locator('[role="treeitem"]')).toHaveCount(26);
    await expect(page.getByRole('button', { name: 'Pause all motion' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open semantic tree' })).toBeVisible();
    await page.evaluate(() =>
      (window as unknown as { brainMapV4: { selectNode(id: string): void } }).brainMapV4.selectNode(
        'ib',
      ),
    );
    await expect(page.locator('[role="treeitem"][data-tree-node="ib"]')).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  test('keeps every visible interactive control at least 44 by 44 CSS pixels', async ({ page }) => {
    await load(page);
    const sizes = await page.locator('button:visible, input:visible').evaluateAll((controls) =>
      controls.map((control) => {
        const rect = control.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );
    expect(sizes.every((size) => size.width >= 44 && size.height >= 44)).toBe(true);
  });

  test('traps modal focus, closes with Escape, and restores the opener', async ({ page }) => {
    await load(page);
    const opener = page.getByRole('button', { name: 'Open 100 item capability ledger' });
    await opener.focus();
    await opener.click();
    await expect(page.locator('#ledger-modal')).toHaveAttribute('aria-hidden', 'false');
    await page.keyboard.press('Shift+Tab');
    await expect(page.locator('#ledger-modal')).toContainText('100-item capability ledger');
    await page.keyboard.press('Escape');
    await expect(page.locator('#ledger-modal')).toHaveAttribute('aria-hidden', 'true');
    await expect(opener).toBeFocused();
  });

  test('remains usable at 200 percent zoom and in forced colors', async ({ page }) => {
    await load(page);
    await page.evaluate(() => {
      document.documentElement.style.zoom = '2';
    });
    await expect(page.getByRole('heading', { name: /Brain Map/ })).toBeVisible();
    await page.emulateMedia({ forcedColors: 'active' });
    await expect(page.getByRole('button', { name: 'Open operator workbench' })).toBeVisible();
  });
});
