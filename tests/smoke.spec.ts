import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ark Builder Labs/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('contact form displays', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });

  test('blog posts exist', async ({ page }) => {
    await page.goto('/blog/welcome-to-our-blog');
    await expect(page.locator('h1').first()).toBeVisible();
  });

  test('theme toggle exists', async ({ page }) => {
    await page.goto('/');
    const themeToggle = page.locator('button:has(.lucide-sun), button:has(.lucide-moon)').first();
    await expect(themeToggle).toBeVisible();
  });
});