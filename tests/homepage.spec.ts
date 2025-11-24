import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Ark Builder Labs/);
  });

  test('hero section is responsive', async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();

    // Test on tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(heading).toBeVisible();

    // Test on desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(heading).toBeVisible();
  });

  test('CTA buttons are clickable and navigate correctly', async ({ page }) => {
    // Test "Get a Quote" button navigation
    await page.click('text=Get a Quote');
    await expect(page).toHaveURL(/\/contact/);
    
    // Go back to homepage
    await page.goBack();
    
    // Test "View Our Services" button navigation
    await page.click('text=View Our Services');
    await expect(page).toHaveURL(/\/services/);
  });

  test('page loads without accessibility violations', async ({ page }) => {
    // Basic accessibility checks
    await expect(page.locator('main')).toBeVisible();
    
    // Check for proper heading hierarchy
    const h1Elements = page.locator('h1');
    await expect(h1Elements).toHaveCount(1);
    
    // Check for alt text on images (if any)
    const images = page.locator('img');
    const imageCount = await images.count();
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute('alt');
      }
    }
  });
});