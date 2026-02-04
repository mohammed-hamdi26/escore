import { Page } from '@playwright/test';

export async function login(page: Page, email = 'admin@escore.com', password = 'Password123') {
  await page.goto('/en/login');

  // Wait for form to load
  await page.waitForSelector('input[name="email"], input[name="username"]', { timeout: 10000 });

  // Fill login form
  const emailInput = page.locator('input[name="email"], input[name="username"]');
  await emailInput.fill(email);

  const passwordInput = page.locator('input[name="password"], input[type="password"]');
  await passwordInput.fill(password);

  // Submit form
  await page.click('button[type="submit"]');

  // Wait for redirect to dashboard
  await page.waitForURL(/dashboard/, { timeout: 15000 });
}

export async function ensureLoggedIn(page: Page) {
  // Check if already on dashboard
  const url = page.url();
  if (!url.includes('dashboard')) {
    await login(page);
  }
}
