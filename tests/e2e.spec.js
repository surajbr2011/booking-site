import { test, expect } from '@playwright/test';

test('homepage has correct title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Exotica Agonda/);
});

test('navigate to rooms page', async ({ page }) => {
  await page.goto('/');
  // Usually there's a link to Rooms
  const roomsLink = page.getByRole('link', { name: "Rooms" }).first();
  if (await roomsLink.isVisible()) {
      await roomsLink.click();
      await expect(page).toHaveURL(/.*\/rooms/);
  }
});
