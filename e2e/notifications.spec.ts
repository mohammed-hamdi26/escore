import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Notifications Management', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to notifications page', async ({ page }) => {
    await page.goto('/en/dashboard/notifications');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to send notification page', async ({ page }) => {
    await page.goto('/en/dashboard/notifications/send');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();

    const hasForm = await page.locator('form, input, textarea').first().isVisible().catch(() => false);
    expect(hasForm).toBeTruthy();
  });

  test('should navigate to devices page', async ({ page }) => {
    await page.goto('/en/dashboard/notifications/devices');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });
});
