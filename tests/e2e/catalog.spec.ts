import { test, expect } from '@playwright/test';

test.describe('Catalog Discovery and Navigation', () => {
  test('browses restaurants and views restaurant detail', async ({ page }) => {
    await page.goto('/restaurants');
    await expect(page).toHaveTitle(/رستوران/);
    
    // Check that seeded restaurants appear
    const bestPizzaLink = page.locator('a[href="/restaurants/best-pizza"]');
    await expect(bestPizzaLink).toBeVisible();

    // Click to restaurant detail
    await bestPizzaLink.click();
    await expect(page).toHaveURL(/\/restaurants\/best-pizza/);
    await expect(page.locator('h1')).toContainText('پیتزا برتر');
  });

  test('searches restaurants by keyword', async ({ page }) => {
    await page.goto('/restaurants?q=%D9%BE%DB%8C%D8%AA%D8%B2%D8%A7');
    await expect(page.locator('a[href="/restaurants/best-pizza"]')).toBeVisible();
  });

  test('filters restaurants by category', async ({ page }) => {
    await page.goto('/restaurants?category=pizza');
    await expect(page.locator('a[href="/restaurants/best-pizza"]')).toBeVisible();
  });

  test('redirects legacy routes to canonical URLs', async ({ page }) => {
    // Legacy restaurant
    await page.goto('/restaurant/1');
    await expect(page).toHaveURL(/\/restaurants\/best-pizza/);

    // Legacy category
    await page.goto('/category/1');
    await expect(page).toHaveURL(/\/categories\/pizza/);

    // Legacy product
    await page.goto('/product/1');
    await expect(page).toHaveURL(/\/products\/best-pizza-special/);

    // Legacy search
    await page.goto('/search?q=%D9%BE%DB%8C%D8%AA%D8%B2%D8%A7');
    await expect(page).toHaveURL(/\/restaurants\?q=%D9%BE%DB%8C%D8%AA%D8%B2%D8%A7/);
  });

  test('shows 404 for nonexistent restaurant slug', async ({ page }) => {
    const res = await page.goto('/restaurants/non-existent-restaurant-404');
    expect(res?.status()).toBe(200); // Streaming fallback in App Router
    await expect(page.locator('body')).toContainText(/رستوران یافت نشد|صفحه پیدا نشد/);
  });
});
