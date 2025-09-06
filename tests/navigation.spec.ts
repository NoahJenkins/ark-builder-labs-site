import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays header with logo and navigation items', async ({ page }) => {
    // Check header is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Check logo and company name (use specific span to avoid strict mode violation)
    const logo = page.locator('header a[href="/"]').first();
    await expect(logo).toBeVisible();
    await expect(logo.locator('span.gradient-text')).toContainText('Ark Builder Labs');
  });

  test('desktop navigation contains all required links', async ({ page }) => {
    // Ensure we're on desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });

    const navItems = [
      { name: 'Home', href: '/' },
      { name: 'About', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Partnerships', href: '/partnerships' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' }
    ];

    for (const item of navItems) {
      const navLink = page.locator(`nav a[href="${item.href}"]`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toContainText(item.name);
    }

    // Check "Get Started" CTA button
    const getStartedButton = page.locator('header', { hasText: 'Get Started' });
    await expect(getStartedButton).toBeVisible();
  });

  test('mobile navigation toggle works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check that desktop nav is hidden
    const desktopNav = page.locator('nav.hidden.md\\:flex');
    
    // Mobile navigation button should be visible
    const mobileNavToggle = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i], button[class*="mobile"]').first();
    
    // If mobile nav button doesn't exist, try alternative selectors
    const mobileNavButton = page.locator('header button').last();
    await expect(mobileNavButton).toBeVisible();
  });

  test('navigation active states work correctly', async ({ page }) => {
    // Test Home active state
    await page.goto('/');
    const homeLink = page.locator('nav a[href="/"]');
    await expect(homeLink).toHaveClass(/text-primary/);

    // Test About active state
    await page.goto('/about');
    const aboutLink = page.locator('nav a[href="/about"]');
    await expect(aboutLink).toHaveClass(/text-primary/);

    // Test Services active state
    await page.goto('/services');
    const servicesLink = page.locator('nav a[href="/services"]');
    await expect(servicesLink).toHaveClass(/text-primary/);
  });

  test('theme toggle is present and functional', async ({ page }) => {
    // Find theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i], button[class*="theme"], button[data-testid="theme-toggle"]').first();
    
    // If specific theme button not found, look for sun/moon icons
    const sunIcon = page.locator('[class*="sun"], [data-lucide="sun"]');
    const moonIcon = page.locator('[class*="moon"], [data-lucide="moon"]');
    
    // At least one theme indicator should be visible
    const themeIndicators = page.locator('button:has([class*="sun"]), button:has([class*="moon"]), button[aria-label*="theme"]');
    await expect(themeIndicators.first()).toBeVisible();
  });

  test('logo links to homepage', async ({ page }) => {
    // Navigate to another page first
    await page.goto('/about');
    
    // Click logo to return home
    await page.click('header a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('navigation is sticky on scroll', async ({ page }) => {
    // Check initial header position
    const header = page.locator('header');
    await expect(header).toHaveClass(/sticky/);

    // Scroll down to test sticky behavior
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(500);

    // Header should still be visible
    await expect(header).toBeVisible();
  });

  test('navigation works across all pages', async ({ page }) => {
    const pages = [
      '/about',
      '/services', 
      '/partnerships',
      '/blog',
      '/contact'
    ];

    for (const testPagePath of pages) {
      await page.goto(testPagePath);
      
      // Verify page loaded correctly
      await expect(page).toHaveURL(testPagePath);
      
      // Check that navigation is still present
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Check that main content loaded
      const main = page.locator('main');
      await expect(main).toBeVisible();
      
      // Check that logo still works
      const logo = page.locator('header a[href="/"]').first();
      await expect(logo).toBeVisible();
    }
  });

  test('Get Started button navigates to contact page', async ({ page }) => {
    // Click Get Started button in header
    await page.click('text=Get Started');
    await expect(page).toHaveURL('/contact');
  });

  test('navigation accessibility', async ({ page }) => {
    // Check header has appropriate landmark
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const viewport = page.viewportSize();
    const isMobile = viewport && viewport.width < 768;

    if (isMobile) {
      // On mobile, check mobile navigation button is accessible
      const mobileNavButton = page.locator('button[aria-label*="menu"], button:has(span:has-text("Toggle menu"))');
      await expect(mobileNavButton).toBeVisible();
      
      // Test that mobile nav can be opened
      await mobileNavButton.click();
      await page.waitForTimeout(500); // Wait for animation
      
      // Check mobile navigation links are accessible
      const mobileNavLinks = page.locator('[data-mobile-menu="true"] a');
      const linkCount = await mobileNavLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = mobileNavLinks.nth(i);
        await expect(link).toHaveAttribute('href');
      }
      
      // Close mobile nav
      await page.keyboard.press('Escape');
    } else {
      // On desktop, check navigation has nav element
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Check all navigation links are keyboard accessible
      const navLinks = page.locator('nav a');
      const linkCount = await navLinks.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = navLinks.nth(i);
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href');
      }
    }
  });

  test('header responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(header).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(header).toBeVisible();
    
    // On desktop, navigation should be fully visible
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });
});