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
});
