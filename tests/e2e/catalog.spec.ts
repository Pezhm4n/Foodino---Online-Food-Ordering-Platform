import { test, expect } from '@playwright/test';

test('submits the homepage search before React hydration', async ({ page }) => {
  await page.route(/\/_next\/static\/.*\.js(?:\?|$)/, (route) => route.abort());
  await page.goto('/');
  const main = page.getByRole('main');
  await expect(main.getByRole('button', { name: 'نمایش غذای بعدی در ویترین' })).toHaveCSS('opacity', '1');
  await expect(main.getByRole('link', { name: 'مشاهده منو و سفارش' })).toBeVisible();
  await main.getByRole('searchbox', { name: 'جست‌وجوی غذا یا رستوران' }).fill('پپرونی');
  await main.getByRole('button', { name: 'جستجو', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'پیتزا برتر', exact: true })).toBeVisible();
});

test('suggests matching dishes and rejects an oversized query', async ({ request }) => {
  const matches = await request.get('/api/catalog/suggestions', { params: { q: 'پپرونی' } });
  expect(matches.ok()).toBe(true);
  expect((await matches.json()).products.map((product: { slug: string }) => product.slug))
    .toContain('best-pizza-pepperoni');
  const invalid = await request.get('/api/catalog/suggestions', { params: { q: 'a'.repeat(121) } });
  expect(invalid.status()).toBe(400);
});

test('keeps typing and focus in the homepage search', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('main').getByRole('searchbox', { name: 'جست‌وجوی غذا یا رستوران' });
  await search.press('/');
  await expect(search).toBeFocused();
  await expect(search).toHaveValue('/');
});

test('opens featured details and only confirms accepted quick additions', async ({ page }) => {
  await page.goto('/');
  const featured = page.getByRole('region', { name: 'پیشنهادات ویژه روز' });
  const details = featured.getByRole('button', { name: 'جزئیات پیتزا مخصوص', exact: true });
  await details.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'پیتزا مخصوص' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'بستن جزئیات غذا' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(details).toBeFocused();

  await details.press('Enter');
  const addFromDialog = dialog.getByRole('button', { name: 'افزودن به سبد خرید', exact: true });
  await addFromDialog.evaluate((button: HTMLButtonElement) => {
    button.click();
    button.click();
  });
  await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('cart') ?? '{}').items?.[0]?.quantity)).toBe(1);

  const pizza = featured.getByRole('button', { name: 'افزودن پیتزا مخصوص به سبد خرید', exact: true });
  await pizza.click();
  await expect(pizza).toHaveText('افزوده شد');
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('cart') ?? '{}').items?.[0]?.quantity)).toBe(2);
  const burger = featured.getByRole('button', { name: 'افزودن برگر کلاسیک دست‌ساز به سبد خرید', exact: true });
  await burger.click();
  await expect(burger).toHaveText('افزودن');
  await expect(page.getByLabel('پیام موقت', { exact: true }).getByText(/سبد خرید شما شامل غذا از/)).toBeVisible();
});

test('shows a quantity limit when a featured dish is already at the cart maximum', async ({ page }) => {
  await page.addInitScript(() => {
    const restaurantId = '20000000-0000-4000-8000-000000000001';
    localStorage.setItem('cart', JSON.stringify({
      version: 1,
      restaurantId,
      restaurantName: 'پیتزا برتر',
      items: [{
        productId: '30000000-0000-4000-8000-000000000001',
        restaurantId,
        addonIds: [],
        quantity: 99,
        name: 'پیتزا مخصوص',
        price: 145000,
      }],
    }));
  });
  await page.goto('/');
  const pizza = page.getByRole('button', { name: 'افزودن پیتزا مخصوص به سبد خرید', exact: true });
  await pizza.click();
  await expect(pizza).toHaveText('افزودن');
  await expect(page.getByLabel('پیام موقت', { exact: true }).getByText(/حداکثر تعداد مجاز/)).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('cart') ?? '{}').items?.[0]?.quantity)).toBe(99);
});

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
