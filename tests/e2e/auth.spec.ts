import { test, expect } from '@playwright/test';

test.describe('Authentication Flow and Pages', () => {
  test('renders login and registration tabs', async ({ page }) => {
    await page.goto('/auth');
    await expect(page).toHaveTitle(/ورود|ثبت‌نام|فودینو/);

    // Verify login form elements
    const emailInput = page.locator('input[name="email"]');
    await expect(emailInput).toBeVisible();

    // Verify link to forgot password
    const forgotLink = page.locator('a[href="/auth/forgot-password"]');
    await expect(forgotLink).toBeVisible();

    // Navigate to registration tab
    await page.goto('/auth?tab=register');
    const nameInput = page.locator('input[name="firstName"], input[placeholder*="نام"]').first();
    await expect(nameInput).toBeVisible();
  });

  test('renders forgot password page', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.locator('h1, h2')).toContainText(/بازیابی|فراموشی/);
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });
});
