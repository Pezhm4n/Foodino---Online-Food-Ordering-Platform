import { test, expect } from '@playwright/test';

test.describe('Order Tracking', () => {
  test('renders order tracking form and validates token', async ({ page }) => {
    await page.goto('/order-tracking');
    await expect(page.locator('h1')).toContainText('پیگیری سفارش');

    const input = page.locator('#tracking-token');
    await expect(input).toBeVisible();

    // Submit invalid token
    const submit = page.locator('button[type="submit"]:has-text("پیگیری سفارش")');
    await input.fill('short-invalid');
    await submit.click();
    await expect(page.locator('form [role="alert"]')).toContainText('کد رهگیری باید یک رشته ۴۳ حرفی معتبر باشد');

    // Submit valid format token
    const validDummyToken = 'A'.repeat(43);
    await input.fill(validDummyToken);
    await submit.click();
    await expect(page).toHaveURL(new RegExp(`/track/${validDummyToken}`));
  });

  test('legacy order routes redirect properly', async ({ page }) => {
    await page.goto('/order');
    await expect(page).toHaveURL(/\/checkout/);

    await page.goto('/menu');
    await expect(page).toHaveURL(/\/restaurants/);

    await page.goto('/favorite-restaurants');
    await expect(page).toHaveURL(/\/profile/);
  });
});
