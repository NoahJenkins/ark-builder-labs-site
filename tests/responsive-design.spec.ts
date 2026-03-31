import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1200, height: 800 }
  ];

  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/about', name: 'About' },
    { path: '/services', name: 'Services' },
    { path: '/blog', name: 'Blog' },
    { path: '/contact', name: 'Contact' }
  ];

  viewports.forEach(viewport => {
    test(`${viewport.name} viewport renders all pages correctly`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      for (const testPage of pages) {
        await page.goto(testPage.path, { waitUntil: 'domcontentloaded' });

        const body = page.locator('body');
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('main')).toBeVisible();

        const bodyWidth = await body.evaluate((el) => el.scrollWidth);
        const clientWidth = await body.evaluate((el) => el.clientWidth);
        expect(bodyWidth).toBeLessThanOrEqual(Math.max(viewport.width + 50, clientWidth + 30));
      }
    });
  });

  test('mobile navigation menu works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const mobileNavTrigger = page.getByRole('button', { name: /toggle menu/i });
    await expect(mobileNavTrigger).toBeVisible();

    await mobileNavTrigger.click();
    const mobileMenu = page.locator('[data-mobile-menu="true"]');
    await expect(mobileMenu).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'About' })).toBeVisible();
  });
});
