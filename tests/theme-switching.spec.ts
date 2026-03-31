import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('theme toggle persists across reloads @cross-browser', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
    });
    await page.reload();
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();
    await expect
      .poll(async () => page.evaluate(() => document.documentElement.classList.contains('dark')))
      .toBe(true);

    await page.reload();
    await expect
      .poll(async () => page.evaluate(() => localStorage.getItem('theme')))
      .toBe('dark');
  });
});
