import { test, expect } from '@playwright/test';

test.describe('Order Tracking', () => {
  test('stops requesting an unknown order', async ({ page }) => {
    const token = 'A'.repeat(43);
    let requests = 0;
    await page.clock.install();
    await page.route('/api/track/' + token, async (route) => {
      requests += 1;
      await route.fulfill({ status: 404, json: { error: 'TRACKING_NOT_FOUND' } });
    });
    await page.goto('/track/' + token);
    await expect(page.getByRole('main').getByRole('alert')).toContainText('این سفارش پیدا نشد');
    const initialRequests = requests;
    await page.clock.runFor(30_000);
    expect(requests).toBe(initialRequests);
  });

  test('distinguishes ready for delivery from a courier on the way', async ({ page }) => {
    const token = 'B'.repeat(43);
    await page.route('/api/track/' + token, (route) => route.fulfill({
      json: {
        status: 'ready',
        restaurantName: 'پیتزا برتر',
        createdAt: '2026-08-30T10:00:00.000Z',
        updatedAt: '2026-08-30T10:20:00.000Z',
      },
    }));
    await page.goto('/track/' + token);
    await expect(page.locator('li[aria-current="step"]')).toContainText('آماده ارسال');
    await expect(page.getByRole('main').getByRole('status')).toHaveText('آماده ارسال');
  });

  test('renders order tracking form and validates token', async ({ page }) => {
    await page.goto('/order-tracking');
    await expect(page.locator('h1')).toContainText('پیگیری سفارش');

    const input = page.locator('#tracking-token');
    await expect(input).toBeVisible();

    // Submit invalid token
    const submit = page.locator('button[type="submit"]:has-text("پیگیری سفارش")');
    await input.fill('short-invalid');
    await submit.click();
    await expect(page.locator('form [role="alert"]')).toContainText('کد رهگیری درست نیست. آن را از جزئیات سفارش کپی کنید.');

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
    await expect(page).toHaveURL(/\/auth\?next=\/favorite-restaurants$/);
  });
});
