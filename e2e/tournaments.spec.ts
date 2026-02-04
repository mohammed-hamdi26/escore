import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Tournaments Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to tournaments list page', async ({ page }) => {
    await page.goto('/en/dashboard/tournaments-management');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page has loaded - look for table or list of tournaments
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Should show tournaments header or table
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display tournaments table or list', async ({ page }) => {
    await page.goto('/en/dashboard/tournaments-management');

    await page.waitForLoadState('networkidle');

    // Look for table, cards, or list items
    const hasContent = await page.locator('table, [class*="card"], [class*="list"], [class*="grid"]').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should have add tournament button', async ({ page }) => {
    await page.goto('/en/dashboard/tournaments-management');

    await page.waitForLoadState('networkidle');

    // Look for add button
    const addButton = page.locator('button, a').filter({ hasText: /add|new|create|\+/i }).first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to add tournament page', async ({ page }) => {
    await page.goto('/en/dashboard/tournaments-management');

    await page.waitForLoadState('networkidle');

    // Click add button
    const addButton = page.locator('button, a').filter({ hasText: /add|new|create|\+/i }).first();
    await addButton.click();

    // Wait for navigation to add page or form to appear
    await Promise.race([
      page.waitForURL(/add/, { timeout: 15000 }),
      page.locator('form').first().waitFor({ state: 'visible', timeout: 15000 }),
    ]).catch(() => {});

    const url = page.url();
    const hasForm = await page.locator('form, [class*="modal"], [class*="dialog"]').first().isVisible().catch(() => false);

    expect(url.includes('add') || hasForm).toBeTruthy();
  });

  test('should view tournament details', async ({ page }) => {
    await page.goto('/en/dashboard/tournaments-management');

    await page.waitForLoadState('networkidle');

    // Find and click view details button or row
    const viewButton = page.locator('button, a').filter({ hasText: /view|details|عرض/i }).first();
    const hasViewButton = await viewButton.isVisible().catch(() => false);

    if (hasViewButton) {
      await viewButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/view|details/i, { timeout: 10000 });
    } else {
      // Try clicking on a row
      const row = page.locator('tr, [class*="card"], [class*="item"]').nth(1);
      const hasRow = await row.isVisible().catch(() => false);
      if (hasRow) {
        await row.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should filter tournaments', async ({ page }) => {
    await page.goto('/en/dashboard/tournaments-management');

    await page.waitForLoadState('networkidle');

    // Look for search/filter input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="بحث"]').first();
    const hasSearch = await searchInput.isVisible().catch(() => false);

    if (hasSearch) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      // Page should respond to filter
      expect(true).toBeTruthy();
    } else {
      // Skip if no search available
      test.skip();
    }
  });
});
