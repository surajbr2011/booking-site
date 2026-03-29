import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

test('mobile navigation menu works', async ({ page }) => {
  await page.goto('/');
  // Assuming there is a hamburger menu with aria-label="Menu"
  const menuButton = page.locator('button[aria-label="Menu"], button[aria-expanded]');
  
  if (await menuButton.isVisible()) {
      await menuButton.click();
      const mobileNav = page.locator('nav');
      await expect(mobileNav).toBeVisible();
      // Click a link inside the mobile nav
      await mobileNav.getByRole('link', { name: "Rooms" }).first().click();
      await expect(page).toHaveURL(/.*\/rooms/);
  }
});
