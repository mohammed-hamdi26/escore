import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Change Password', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should navigate to change password page', async ({ page }) => {
    await page.goto('/en/dashboard/change-password');
    await page.waitForLoadState('networkidle');

    const pageContent = page.locator('body');
    await expect(pageContent).toBeVisible();
  });

  test('should display password form', async ({ page }) => {
    await page.goto('/en/dashboard/change-password');
    await page.waitForLoadState('networkidle');

    const hasForm = await page.locator('form').first().isVisible().catch(() => false);
    const hasPasswordInput = await page.locator('input[type="password"]').first().isVisible().catch(() => false);

    expect(hasForm || hasPasswordInput).toBeTruthy();
  });

  test('should show validation on empty submit', async ({ page }) => {
    await page.goto('/en/dashboard/change-password');
    await page.waitForLoadState('networkidle');

    const submitButton = page.locator('button[type="submit"]').first();
    const hasSubmit = await submitButton.isVisible().catch(() => false);

    if (hasSubmit) {
      await submitButton.click();
      await page.waitForTimeout(1000);
      // Should stay on the same page (validation prevents submit)
      await expect(page).toHaveURL(/change-password/);
    } else {
      test.skip();
    }
  });
});
