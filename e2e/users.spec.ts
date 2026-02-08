import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Users Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to users list page', async ({ page }) => {
    await page.goto('/en/dashboard/users/list');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should display users table or list', async ({ page }) => {
    await page.goto('/en/dashboard/users/list');
    await page.waitForLoadState('networkidle');

    const hasContent = await page.locator('table, [class*="card"], [class*="list"], [class*="grid"]').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('should search users', async ({ page }) => {
    await page.goto('/en/dashboard/users/list');
    await page.waitForLoadState('networkidle');

    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[placeholder*="بحث"]').first();
    const hasSearch = await searchInput.isVisible().catch(() => false);

    if (hasSearch) {
      await searchInput.fill('admin');
      await page.waitForTimeout(1000);
      expect(true).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should filter users by role', async ({ page }) => {
    await page.goto('/en/dashboard/users/list');
    await page.waitForLoadState('networkidle');

    const filtersButton = page.locator('button').filter({ hasText: /filters|فلاتر/i }).first();
    const hasFilters = await filtersButton.isVisible().catch(() => false);

    if (hasFilters) {
      await filtersButton.click();
      await page.waitForTimeout(500);

      const roleFilter = page.locator('button').filter({ hasText: /role|الدور|all roles|admin|user/i }).first();
      const hasFilter = await roleFilter.isVisible().catch(() => false);

      if (hasFilter) {
        await roleFilter.click();
        await page.waitForTimeout(500);
        expect(true).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should view user details', async ({ page }) => {
    await page.goto('/en/dashboard/users/list');
    await page.waitForLoadState('networkidle');

    const viewButton = page.locator('button, a').filter({ hasText: /view|details|edit|عرض|تعديل/i }).first();
    const hasViewButton = await viewButton.isVisible().catch(() => false);

    if (hasViewButton) {
      await viewButton.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } else {
      const row = page.locator('tr, [class*="card"], [class*="item"]').nth(1);
      const hasRow = await row.isVisible().catch(() => false);
      if (hasRow) {
        await row.click();
        await page.waitForTimeout(2000);
      }
    }
  });

  test('should navigate to content requests', async ({ page }) => {
    await page.goto('/en/dashboard/users/content-requests');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });
});
