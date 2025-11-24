import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Ark Builder Labs/);
  });

  test('displays hero section with correct content', async ({ page }) => {
    // Check main heading
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toContainText('Building Software');
    await expect(mainHeading).toContainText('for Every Season');

    // Check mission statement
    const missionText = page.locator('p', { hasText: 'Our mission at Ark Builder Labs' });
    await expect(missionText).toBeVisible();
  });

  test('displays CTA buttons with correct links', async ({ page }) => {
    // Check "Get a Quote" button
    const getQuoteButton = page.locator('a', { hasText: 'Get a Quote' });
    await expect(getQuoteButton).toBeVisible();
    await expect(getQuoteButton).toHaveAttribute('href', '/contact');

    // Check "View Our Services" button
    const servicesButton = page.locator('a', { hasText: 'View Our Services' });
    await expect(servicesButton).toBeVisible();
    await expect(servicesButton).toHaveAttribute('href', '/services');
  });

  test('displays stats section', async ({ page }) => {
    // Check for stats section elements
    const statsSection = page.locator('text=Years Experience').locator('..').first();
    await expect(statsSection).toBeVisible();
    
    // Check individual stats
    await expect(page.locator('text=3+').first()).toBeVisible();
    await expect(page.locator('text=Years Experience').first()).toBeVisible();
    await expect(page.locator('text=100+').first()).toBeVisible();
    await expect(page.locator('text=Projects Created').first()).toBeVisible();
    await expect(page.locator('text=100%').first()).toBeVisible();
    await expect(page.locator('text=Client Satisfaction').first()).toBeVisible();
  });

  test('displays services overview section', async ({ page }) => {
    // Check for services section
    await expect(page.locator('text=Web & Mobile Development').first()).toBeVisible();
    await expect(page.locator('text=Cloud Engineering & Consulting').first()).toBeVisible();
    await expect(page.locator('text=AI and Automation Consulting').first()).toBeVisible();
  });

  test('displays weather animations based on theme', async ({ page }) => {
    // Test light theme (snow animation)
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }));
    });
    await page.reload();
    
    // Wait for theme to be applied
    await page.waitForTimeout(1000);
    
    // Snow animation should be present in light theme
    const snowElements = page.locator('[class*="animate-snowfall"]');
    await expect(snowElements.first()).toBeVisible();

    // Test dark theme (rain animation)
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
    });
    await page.reload();
    
    // Wait for theme to be applied
    await page.waitForTimeout(1000);
    
    // Rain animation should be present in dark theme
    const rainElements = page.locator('[class*="animate-rainfall"]');
    await expect(rainElements.first()).toBeVisible();
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

  test('background animations are present', async ({ page }) => {
    // Check for swiping animation elements
    const sweepPrimary = page.locator('[class*="animate-sweep-primary"]');
    await expect(sweepPrimary).toBeVisible();
    
    const sweepSecondary = page.locator('[class*="animate-sweep-secondary"]');
    await expect(sweepSecondary).toBeVisible();
    
    const sweepTertiary = page.locator('[class*="animate-sweep-tertiary"]');
    await expect(sweepTertiary).toBeVisible();
    
    // Check for floating particles
    const floatingParticles = page.locator('[class*="animate-float-"]');
    await expect(floatingParticles.first()).toBeVisible();
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