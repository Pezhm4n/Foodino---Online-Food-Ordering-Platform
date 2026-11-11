import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 }, isMobile: true, hasTouch: true });

test('keeps one compact announcement and dismisses it in either direction or with Close', async ({ page }) => {
  await page.goto('/restaurants/green-salad');
  const add = page.getByRole('button', {
    name: 'افزودن سالاد سزار با مرغ کبابی به سبد خرید',
    exact: true,
  });
  const notification = page.getByRole('group', { name: 'پیام موقت', exact: true });
  const announcement = notification.getByText('به سبد خرید اضافه شد', { exact: false });
  const close = page.getByRole('button', { name: 'بستن پیام موقت', exact: true });
  const input = await page.context().newCDPSession(page);

  await add.tap();
  await add.tap();
  await add.tap();
  await expect(announcement).toHaveCount(1);
  const notice = await notification.boundingBox();
  expect(notice?.x).toBeGreaterThanOrEqual(16);
  expect(notice && notice.x + notice.width).toBeLessThanOrEqual(359);
  expect(notice?.height).toBeLessThanOrEqual(64);
  const header = await page.getByRole('banner').boundingBox();
  expect(notice?.y).toBeGreaterThanOrEqual(header ? header.y + header.height : 0);

  for (const direction of [-1, 1]) {
    await expect(announcement).toBeVisible();
    const message = await announcement.boundingBox();
    if (!message) throw new Error('Announcement has no touch surface');
    const x = message.x + message.width / 2;
    const y = message.y + message.height / 2;
    await input.send('Input.synthesizeScrollGesture', {
      x, y, xDistance: 78 * direction, yDistance: 0,
      speed: 600, gestureSourceType: 'touch', preventFling: true,
    });
    await expect(announcement).toHaveCount(0, { timeout: 1000 });
    await add.tap();
  }

  await add.focus();
  await close.press('Enter');
  await expect(announcement).toHaveCount(0);
  await expect(add).toBeFocused();
  await add.press('Enter');
  await expect(announcement).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(announcement).toHaveCount(0);
  await expect(add).toBeFocused();
  await add.press('Enter');
  await expect(announcement).toBeVisible();
  await close.press('Escape');
  await expect(announcement).toHaveCount(0);
  await expect(add).toBeFocused();
});
