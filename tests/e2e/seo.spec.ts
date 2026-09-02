import { test, expect } from '@playwright/test';

test.describe('SEO, Robots and Sitemap', () => {
  test('serves robots.txt with correct directives', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('User-Agent: *');
    expect(text).toContain('Disallow: /api/');
    expect(text).toContain('Sitemap:');
  });

  test('serves sitemap.xml with seeded urls', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain('http://www.sitemaps.org/schemas/sitemap/0.9');
    expect(text).toContain('/restaurants');
    expect(text).toContain('/categories');
  });

  test('product and restaurant pages include structured JSON-LD', async ({ page }) => {
    await page.goto('/products/best-pizza-special');
    const ldJsonText = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ldJsonText).toBeTruthy();
    const parsed = JSON.parse(ldJsonText || '{}');
    expect(parsed['@type']).toBe('Product');
    expect(parsed.name).toBe('پیتزا مخصوص');
  });
});
