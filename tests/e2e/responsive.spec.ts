import { test, expect } from '@playwright/test';

test.describe('Mobile Viewport and Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('opens mobile menu and navigates to discovery routes', async ({ page }) => {
    await page.goto('/');

    // Mobile hamburger menu button
    const menuButton = page.locator('button[aria-label="منوی موبایل"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();

    // Mobile nav links
    const restaurantsNavLink = page.locator('a[href="/restaurants"]:visible').first();
    await expect(restaurantsNavLink).toBeVisible();
    await restaurantsNavLink.click();
    await expect(page).toHaveURL(/\/restaurants/);
  });

  test('fits the offer and hero controls and reveals sections on scroll', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 667 });
    await page.goto('/');
    const main = page.getByRole('main');
    const search = main.getByRole('searchbox', { name: 'جست‌وجوی غذا یا رستوران' });
    const promo = page.getByRole('button', { name: 'کپی کد تخفیف FOODINO' }).locator('..');
    expect((await search.boundingBox())?.height).toBeGreaterThanOrEqual(44);
    const searchBounds = await search.locator('..').boundingBox();
    expect(searchBounds?.x).toBeGreaterThanOrEqual(14);
    expect(searchBounds && searchBounds.x + searchBounds.width).toBeLessThanOrEqual(306);
    expect((await promo.boundingBox())?.height).toBeLessThanOrEqual(48);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    await promo.getByText('شرایط', { exact: true }).click();
    await expect(promo.getByText('۲۰٪ تخفیف تا ۵۰ هزار تومان برای خرید از ۱۰۰ هزار تومان.')).toBeVisible();
    await promo.getByText('شرایط', { exact: true }).click();
    await main.getByRole('tab', { name: 'برگر ذغالی', exact: true }).click();
    await expect(main.getByRole('tab', { name: 'برگر ذغالی', exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(main.getByRole('link', { name: 'مشاهده منو و سفارش', exact: true })).toHaveAttribute('href', '/products/burger-land-classic');

    const section = main.locator('[data-landing-reveal]').first();
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute('data-entered', '');
  });

  test('respects reduced motion and leaves landing sections visible', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const section = page.getByRole('heading', { name: 'دسته‌بندی‌های محبوب', exact: true });
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
    await expect(page.locator('[data-landing-reveal][data-entered]')).toHaveCount(0);
  });

  test('restarts the showcase with the keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.clock.install();
    await page.goto('/');
    const stage = page.getByRole('tablist', { name: 'انتخاب غذای نمونه' });
    const selected = stage.locator('[aria-selected="true"]');
    const current = await selected.textContent();
    await page.getByRole('button', { name: 'توقف نمایش خودکار' }).press('Space');
    await page.clock.runFor(6_000);
    await expect(selected).toHaveText(current ?? '');
    await page.getByRole('button', { name: 'شروع نمایش خودکار' }).press('Space');
    await page.clock.runFor(6_000);
    await expect(selected).not.toHaveText(current ?? '');
  });

  test('tilts the showcase on desktop and pauses ambient motion offscreen', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const card = page.locator('[data-motion-paused] > div').first();
    const art = card.locator('.foodino-dish-hero');
    await expect(art).toHaveCSS('animation-play-state', 'running');
    const bounds = await card.boundingBox();
    expect(bounds).not.toBeNull();
    const resting = await card.evaluate((element) => getComputedStyle(element).transform);
    await page.mouse.move(bounds!.x + bounds!.width * 0.8, bounds!.y + bounds!.height * 0.25);
    await expect.poll(() => card.evaluate((element) => getComputedStyle(element).transform)).not.toBe(resting);
    const plate = card.getByRole('button', { name: 'نمایش غذای بعدی در ویترین' });
    // The pointer is over the tray, outside the plate itself.
    await expect.poll(() => plate.evaluate(element => element.matches(':hover'))).toBe(false);
    await expect.poll(() => plate.evaluate(element => Number(getComputedStyle(element).scale))).toBeGreaterThan(1.07);

    await page.getByRole('contentinfo').scrollIntoViewIfNeeded();
    await expect(art).toHaveCSS('animation-play-state', 'paused');
  });

  test('reveals individual cards and keeps hover and keyboard details working', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    const featured = page.getByRole('region', { name: 'پیشنهادات ویژه روز' });
    const cards = featured.locator('article');
    await cards.first().scrollIntoViewIfNeeded();
    await expect(cards.first()).toHaveAttribute('data-card-entered', '');
    const delays = await cards.evaluateAll(elements => elements.map(element => getComputedStyle(element).animationDelay));
    expect(new Set(delays).size).toBeGreaterThan(1);
    await expect.poll(() => cards.first().evaluate(element => element.getAnimations().some(animation => animation.playState === 'running'))).toBe(false);
    const card = cards.first();
    const surface = card.locator(':scope > div').first();
    const resting = await surface.evaluate(element => getComputedStyle(element).transform);
    const bounds = await card.boundingBox();
    if (!bounds) throw new Error('Featured card is not visible');
    await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height - 2);
    await expect.poll(() => surface.evaluate(element => getComputedStyle(element).transform)).not.toBe(resting);
    await expect.poll(() => surface.evaluate(element => element.getAnimations().some(animation => animation.playState === 'running'))).toBe(false);
    expect(await card.evaluate(element => element.matches(':hover'))).toBe(true);
    expect((await card.boundingBox())?.y).toBeCloseTo(bounds.y, 1);
    const details = card.getByRole('button', { name: /^جزئیات / });
    const dishName = (await details.innerText()).trim();
    await details.press('Enter');
    await expect(page.getByRole('dialog', { name: dishName, exact: true })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
  });
});
