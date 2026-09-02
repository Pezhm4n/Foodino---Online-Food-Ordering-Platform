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
});
