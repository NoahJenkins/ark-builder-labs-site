import { test, expect } from '@playwright/test';

test.describe('Blog System', () => {
  test('blog listing renders featured content', async ({ page }) => {
    await page.goto('/blog');
    await expect(page).toHaveURL('/blog');
    await expect(page.getByRole('heading', { name: /insights & updates/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /read more/i }).first()).toBeVisible();
  });

  test('blog listing opens a post and back navigation returns to the listing', async ({ page }) => {
    await page.goto('/blog');
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    await expect(firstPostLink).toBeVisible();

    await firstPostLink.click();

    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('link', { name: /back to blog/i })).toBeVisible();

    await page.getByRole('link', { name: /back to blog/i }).click();
    await expect(page).toHaveURL('/blog');
  });
});
