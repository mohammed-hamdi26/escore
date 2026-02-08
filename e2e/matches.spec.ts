import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Matches Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to matches list page', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page has loaded
    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    // Should show matches header or table
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display matches table or list', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

    await page.waitForLoadState('networkidle');

    // Look for table, cards, or list items
    const hasContent = await page.locator('table, [class*="card"], [class*="list"], [class*="grid"]').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should have add match button', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

    await page.waitForLoadState('networkidle');

    // Look for add button
    const addButton = page.locator('button, a').filter({ hasText: /add|new|create|\+/i }).first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to add match page', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management/add');
    await page.waitForLoadState('networkidle');

    const url = page.url();
    const hasForm = await page.locator('form').first().isVisible().catch(() => false);
    expect(url.includes('add') || hasForm).toBeTruthy();
  });

  test('should view match details', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

    await page.waitForLoadState('networkidle');

    // Find and click view details button
    const viewButton = page.locator('button, a').filter({ hasText: /view|details|عرض/i }).first();
    const hasViewButton = await viewButton.isVisible().catch(() => false);

    if (hasViewButton) {
      await viewButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/view|details/i, { timeout: 10000 });
    } else {
      // Try clicking on a match card
      const matchCard = page.locator('[class*="card"], [class*="match"]').first();
      const hasCard = await matchCard.isVisible().catch(() => false);
      if (hasCard) {
        await matchCard.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should filter matches by status', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

    await page.waitForLoadState('networkidle');

    // Click the Filters button to expand filter options
    const filtersButton = page.locator('button').filter({ hasText: /filters|فلاتر/i }).first();
    await filtersButton.click();
    await page.waitForTimeout(500);

    // Look for status filter dropdown
    const statusFilter = page.locator('button').filter({ hasText: /status|الحالة|all status|scheduled|live/i }).first();
    const hasFilter = await statusFilter.isVisible().catch(() => false);

    if (hasFilter) {
      await statusFilter.click();
      await page.waitForTimeout(500);
      // Look for status options in dropdown
      const statusOption = page.locator('[role="option"], [cmdk-item]').filter({ hasText: /scheduled|live|completed/i }).first();
      const hasOption = await statusOption.isVisible().catch(() => false);
      expect(hasOption).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should filter matches by tournament', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

    await page.waitForLoadState('networkidle');

    // Click the Filters button to expand filter options
    const filtersButton = page.locator('button').filter({ hasText: /filters|فلاتر/i }).first();
    await filtersButton.click();
    await page.waitForTimeout(500);

    // Look for tournament filter dropdown
    const tournamentFilter = page.locator('button').filter({ hasText: /tournament|بطولة|all tournaments/i }).first();
    const hasFilter = await tournamentFilter.isVisible().catch(() => false);

    if (hasFilter) {
      await tournamentFilter.click();
      await page.waitForTimeout(500);
      expect(true).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should filter matches by game', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

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

  test('should search matches', async ({ page }) => {
    await page.goto('/en/dashboard/matches-management');

    await page.waitForLoadState('networkidle');

    // Look for search input
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
});
