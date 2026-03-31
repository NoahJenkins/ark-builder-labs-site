import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('homepage shell renders core navigation @cross-browser', async ({ page }) => {
    await expect(page).toHaveTitle(/Ark Builder Labs/);

    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.locator('a[href="/"]').first()).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
  });

  test('CTA buttons are clickable and navigate correctly', async ({ page }) => {
    await page.getByRole('link', { name: 'Get a Quote' }).click();
    await expect(page).toHaveURL(/\/contact/);

    await page.goBack();

    await page.getByRole('link', { name: 'View Our Services' }).click();
    await expect(page).toHaveURL(/\/services/);
  });
});
