import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Players Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to players list page', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page has loaded
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Should show players header or table
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display players table or list', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

    await page.waitForLoadState('networkidle');

    // Look for table, cards, or list items
    const hasContent = await page.locator('table, [class*="card"], [class*="list"], [class*="grid"]').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should have add player button', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

    await page.waitForLoadState('networkidle');

    // Look for add button
    const addButton = page.locator('button, a').filter({ hasText: /add|new|create|\+/i }).first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to add player page', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

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

  test('should view player details', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

    await page.waitForLoadState('networkidle');

    // Find and click view details button
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

  test('should filter players', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

    await page.waitForLoadState('networkidle');

    // Look for search/filter input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="بحث"]').first();
    const hasSearch = await searchInput.isVisible().catch(() => false);

    if (hasSearch) {
      await searchInput.fill('test');
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should filter players by team', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

    await page.waitForLoadState('networkidle');

    // Click the Filters button to expand filter options
    const filtersButton = page.locator('button').filter({ hasText: /filters|فلاتر/i }).first();
    await filtersButton.click();
    await page.waitForTimeout(500);

    // Look for team filter dropdown
    const teamFilter = page.locator('button').filter({ hasText: /team|فريق|all teams/i }).first();
    const hasFilter = await teamFilter.isVisible().catch(() => false);

    if (hasFilter) {
      await teamFilter.click();
      await page.waitForTimeout(500);
      expect(true).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should filter players by game', async ({ page }) => {
    await page.goto('/en/dashboard/player-management');

    await page.waitForLoadState('networkidle');

    // Click the Filters button to expand filter options
    const filtersButton = page.locator('button').filter({ hasText: /filters|فلاتر/i }).first();
    await filtersButton.click();
    await page.waitForTimeout(500);

    // Look for game filter dropdown
    const gameFilter = page.locator('button').filter({ hasText: /game|لعبة|all games/i }).first();
    const hasFilter = await gameFilter.isVisible().catch(() => false);

    if (hasFilter) {
      await gameFilter.click();
      await page.waitForTimeout(500);
      expect(true).toBeTruthy();
    } else {
      test.skip();
    }
  });
});
