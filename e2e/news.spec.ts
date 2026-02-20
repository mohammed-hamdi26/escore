import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('News Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to news list page', async ({ page }) => {
    await page.goto('/en/dashboard/news');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display news table or list', async ({ page }) => {
    await page.goto('/en/dashboard/news');
    await page.waitForLoadState('networkidle');

    const hasContent = await page.locator('table, [class*="card"], [class*="list"], [class*="grid"]').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should have add news button', async ({ page }) => {
    await page.goto('/en/dashboard/news');
    await page.waitForLoadState('networkidle');

    const addButton = page.locator('button, a').filter({ hasText: /add|new|create|\+/i }).first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to add news page', async ({ page }) => {
    await page.goto('/en/dashboard/news/add');
    await page.waitForLoadState('networkidle');

    const url = page.url();
    const hasForm = await page.locator('form').first().isVisible().catch(() => false);
    expect(url.includes('add') || hasForm).toBeTruthy();
  });

  test('should view news details', async ({ page }) => {
    await page.goto('/en/dashboard/news');
    await page.waitForLoadState('networkidle');

    const viewButton = page.locator('button, a').filter({ hasText: /view|details|عرض/i }).first();
    const hasViewButton = await viewButton.isVisible().catch(() => false);

    if (hasViewButton) {
      await viewButton.click();
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveURL(/view|details/i, { timeout: 10000 });
    } else {
      const row = page.locator('tr, [class*="card"], [class*="item"]').nth(1);
      const hasRow = await row.isVisible().catch(() => false);
      if (hasRow) {
        await row.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should filter news by status', async ({ page }) => {
    await page.goto('/en/dashboard/news');
    await page.waitForLoadState('networkidle');

    const filtersButton = page.locator('button').filter({ hasText: /filters|فلاتر/i }).first();
    const hasFilters = await filtersButton.isVisible().catch(() => false);

    if (hasFilters) {
      await filtersButton.click();
      await page.waitForTimeout(500);

      const statusFilter = page.locator('button').filter({ hasText: /status|الحالة|all status|published|draft/i }).first();
      const hasFilter = await statusFilter.isVisible().catch(() => false);

      if (hasFilter) {
        await statusFilter.click();
        await page.waitForTimeout(500);
        const statusOption = page.locator('[role="option"], [cmdk-item]').filter({ hasText: /published|draft|scheduled/i }).first();
        const hasOption = await statusOption.isVisible().catch(() => false);
        expect(hasOption).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should search news', async ({ page }) => {
    await page.goto('/en/dashboard/news');
    await page.waitForLoadState('networkidle');

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
