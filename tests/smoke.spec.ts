import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Ark Builder Labs/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Test About navigation
    await page.click('text=About');
    await expect(page).toHaveURL('/about');
    
    // Test Services navigation
    await page.goto('/');
    await page.click('text=Services');
    await expect(page).toHaveURL('/services');
    
    // Test Blog navigation
    await page.goto('/');
    await page.click('text=Blog');
    await expect(page).toHaveURL('/blog');
    
    // Test Contact navigation
    await page.goto('/');
    await page.click('text=Contact');
    await expect(page).toHaveURL('/contact');
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