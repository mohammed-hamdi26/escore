import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Support Center', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to support center page', async ({ page }) => {
    await page.goto('/en/dashboard/support-center');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('should display support content', async ({ page }) => {
    await page.goto('/en/dashboard/support-center');
    await page.waitForLoadState('networkidle');

    const hasContent = await page.locator('table, [class*="card"], [class*="list"], [class*="grid"], [class*="ticket"]').first().isVisible().catch(() => false);
    expect(hasContent).toBeTruthy();
  });
});
