import { test, expect } from '@playwright/test';

test.describe('Auth Pages', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/en/login');

    // Check page title or header
    await expect(page.locator('input[name="email"], input[name="username"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  });

  test('should show validation errors on empty submit', async ({ page }) => {
    await page.goto('/en/login');

    // Wait for form to load
    await page.waitForSelector('button[type="submit"]', { timeout: 10000 });

    // Click submit without filling form
    await page.click('button[type="submit"]');

    // Should show error messages or stay on login page
    await expect(page).toHaveURL(/login/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/en/login');

    // Wait for form to load
    await page.waitForSelector('input[name="email"], input[name="username"]', { timeout: 10000 });

    // Fill login form with test credentials
    const emailInput = page.locator('input[name="email"], input[name="username"]');
    await emailInput.fill('admin@escore.com');

    const passwordInput = page.locator('input[name="password"], input[type="password"]');
    await passwordInput.fill('Password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 15000 });
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/en/login');

    // Wait for form to load
    await page.waitForSelector('input[name="email"], input[name="username"]', { timeout: 10000 });

    // Fill with invalid credentials
    const emailInput = page.locator('input[name="email"], input[name="username"]');
    await emailInput.fill('invalid@test.com');

    const passwordInput = page.locator('input[name="password"], input[type="password"]');
    await passwordInput.fill('wrongpassword');

    // Submit form
    await page.click('button[type="submit"]');

    // Should stay on login page or show error
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/login/);
  });
});
