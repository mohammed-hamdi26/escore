import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to settings page', async ({ page }) => {
    await page.goto('/en/dashboard/settings');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('should navigate to appearance settings', async ({ page }) => {
    await page.goto('/en/dashboard/settings/apperance');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to language settings', async ({ page }) => {
    await page.goto('/en/dashboard/settings/language');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to links settings', async ({ page }) => {
    await page.goto('/en/dashboard/settings/links');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
    await expect(page.locator('h1, h2, [class*="title"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to privacy policy settings', async ({ page }) => {
    await page.goto('/en/dashboard/settings/privacy-policy');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('should navigate to about settings', async ({ page }) => {
    await page.goto('/en/dashboard/settings/about');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });
});
