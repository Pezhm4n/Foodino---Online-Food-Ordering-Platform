import { test, expect } from '@playwright/test';

test.describe('Cart and Item Selection', () => {
  test('adds an item to the cart and views it', async ({ page }) => {
    await page.goto('/restaurants/best-pizza');
    
    // Add product to cart
    const addButton = page.locator('button:has-text("افزودن")').first();
    await expect(addButton).toBeVisible();
    await addButton.click();

    // Verify cart count in header
    const cartLink = page.locator('a[href="/cart"]').first();
    await expect(cartLink).toBeVisible();
    await cartLink.click();

    await expect(page).toHaveURL(/\/cart/);
    await expect(page.locator('body')).toContainText('پیتزا مخصوص');
  });

  test('keeps a populated cart inside both gutters on a narrow phone', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/restaurants/green-salad');
    await page.getByRole('button', {
      name: 'افزودن سالاد سزار فیله مرغ گریل به سبد خرید',
      exact: true,
    }).click();
    await page.goto('/cart');

    const main = page.getByRole('main');
    const remove = main.getByRole('button', { name: 'حذف از سبد خرید', exact: true });
    const increase = main.getByRole('button', { name: 'افزایش تعداد', exact: true });
    await expect(increase).toBeVisible();
    await expect.poll(async () => {
      const item = await main.getByRole('heading', { name: 'سالاد سزار فیله مرغ گریل' }).boundingBox();
      const button = await remove.boundingBox();
      return item && button && button.x >= 16 && button.x + button.width <= 359
        && button.y > item.y + item.height;
    }).toBe(true);

    for (const width of [320, 375]) {
      await page.setViewportSize({ width, height: 667 });
      const heading = main.getByRole('heading', { name: 'خلاصه صورت‌حساب' });
      const summary = await heading.locator('..').boundingBox();
      expect(summary?.x).toBeGreaterThanOrEqual(16);
      expect(summary && summary.x + summary.width).toBeLessThanOrEqual(width - 16);
    }

    await increase.click();
    await expect(main.getByText('۲ قلم غذا')).toBeVisible();
    await main.getByRole('button', { name: 'FOODINO', exact: true }).click();
    await expect(main.getByText('۲۴۵٬۰۰۰ تومان', { exact: true }).first()).toBeVisible();
    await main.getByRole('button', { name: 'کاهش تعداد', exact: true }).click();
    await expect(main.getByText('۱۲۷٬۰۰۰ تومان', { exact: true }).first()).toBeVisible();

    await remove.click();
    await expect(main.getByRole('heading', { name: 'سبد خرید شما خالی است' })).toBeVisible();
    await expect(main.getByRole('button', { name: 'ادامه سفارش' })).toHaveCount(0);
  });
});
