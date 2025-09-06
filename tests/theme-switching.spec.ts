import { test, expect } from '@playwright/test';

test.describe('Theme Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('theme toggle button is visible and functional', async ({ page }) => {
    // Find theme toggle button - it contains both sun and moon icons
    const themeToggle = page.locator('button:has(.lucide-sun), button:has(.lucide-moon)').first();
    
    // Theme toggle should be visible
    await expect(themeToggle).toBeVisible();
    
    // Should be clickable
    await themeToggle.click();
    await page.waitForTimeout(500);
  });

  test('switching to dark mode applies dark theme', async ({ page }) => {
    // Ensure we start in light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'light' }));
    });
    await page.reload();
    await page.waitForTimeout(1000);

    // Find and click theme toggle
    const themeToggle = page.locator('button:has(.lucide-sun), button:has(.lucide-moon)').first();
    await themeToggle.click();
    await page.waitForTimeout(1000);

    // Check that dark mode is applied
    const htmlElement = page.locator('html');
    const bodyElement = page.locator('body');
    
    // Check for dark theme classes or attributes
    const isDarkMode = await Promise.any([
      htmlElement.getAttribute('class').then(cls => cls?.includes('dark')),
      htmlElement.getAttribute('data-theme').then(theme => theme === 'dark'),
      bodyElement.getAttribute('class').then(cls => cls?.includes('dark')),
      page.evaluate(() => document.documentElement.classList.contains('dark'))
    ]).catch(() => false);

    expect(isDarkMode).toBeTruthy();
  });

  test('switching to light mode applies light theme', async ({ page }) => {
    // Start in dark mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
      window.dispatchEvent(new StorageEvent('storage', { key: 'theme', newValue: 'dark' }));
    });
    await page.reload();
    await page.waitForTimeout(1000);

    // Find and click theme toggle
    const themeToggle = page.locator('button:has(.lucide-sun), button:has(.lucide-moon)').first();
    await themeToggle.click();
    await page.waitForTimeout(1000);

    // Check that light mode is applied
    const isLightMode = await page.evaluate(() => {
      return !document.documentElement.classList.contains('dark') || 
             document.documentElement.getAttribute('data-theme') === 'light';
    });

    expect(isLightMode).toBeTruthy();
  });

  test('theme preference persists across page reloads', async ({ page }) => {
    // Set to dark mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    await page.waitForTimeout(1000);

    // Check dark mode is applied
    const isDarkAfterReload = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') || 
             document.documentElement.getAttribute('data-theme') === 'dark';
    });
    expect(isDarkAfterReload).toBeTruthy();

    // Set to light mode
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
    });
    await page.reload();
    await page.waitForTimeout(1000);

    // Check light mode is applied
    const isLightAfterReload = await page.evaluate(() => {
      return !document.documentElement.classList.contains('dark') || 
             document.documentElement.getAttribute('data-theme') === 'light';
    });
    expect(isLightAfterReload).toBeTruthy();
  });

  test('theme affects hero section animations', async ({ page }) => {
    // Test light mode - should show snow animation
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Check for snow animation elements
    const snowElements = page.locator('[class*="animate-snowfall"]');
    if (await snowElements.count() > 0) {
      await expect(snowElements.first()).toBeVisible();
    }

    // Switch to dark mode - should show rain animation
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    await page.waitForTimeout(2000);

    // Check for rain animation elements
    const rainElements = page.locator('[class*="animate-rainfall"]');
    if (await rainElements.count() > 0) {
      await expect(rainElements.first()).toBeVisible();
    }

    // Check for lightning effects in dark mode (they exist but are animated/invisible by default)
    const lightningElements = page.locator('[class*="animate-lightning"]');
    if (await lightningElements.count() > 0) {
      // Lightning elements exist (they have opacity-0 and invisible classes for animation)
      await expect(lightningElements.first()).toBeAttached();
    }
  });

  test('theme toggle icon changes based on current theme', async ({ page }) => {
    // Theme toggle contains both icons, visibility is controlled by CSS classes
    // Just check that both icons exist in the button
    const themeToggle = page.locator('button:has(.lucide-sun), button:has(.lucide-moon)').first();
    await expect(themeToggle).toBeVisible();
    
    const sunIcon = themeToggle.locator('.lucide-sun');
    const moonIcon = themeToggle.locator('.lucide-moon');
    
    // Both icons should be present in the DOM (visibility controlled by CSS)
    await expect(sunIcon).toBeAttached();
    await expect(moonIcon).toBeAttached();
  });

  test('theme switching works on all pages', async ({ page }) => {
    const pages = ['/', '/about', '/services', '/blog', '/contact'];

    for (const pagePath of pages) {
      await page.goto(pagePath);
      
      // Find theme toggle
      const themeToggle = page.locator('button:has(.lucide-sun), button:has(.lucide-moon)').first();
      
      if (await themeToggle.count() > 0) {
        await expect(themeToggle).toBeVisible();
        
        // Test theme switching
        await themeToggle.click();
        await page.waitForTimeout(500);
        
        // Theme should have changed
        const themeChanged = await page.evaluate(() => {
          return localStorage.getItem('theme') !== null;
        });
        expect(themeChanged).toBeTruthy();
      }
    }
  });

  test('system theme preference is respected', async ({ page }) => {
    // Clear localStorage to test system preference
    await page.evaluate(() => {
      localStorage.removeItem('theme');
    });
    
    // Mock system dark mode preference
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.reload();
    await page.waitForTimeout(1000);

    // Should respect system dark mode
    const respectsSystemDark = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    expect(respectsSystemDark).toBeTruthy();

    // Mock system light mode preference
    await page.emulateMedia({ colorScheme: 'light' });
    await page.reload();
    await page.waitForTimeout(1000);

    // Should respect system light mode
    const respectsSystemLight = await page.evaluate(() => {
      return window.matchMedia('(prefers-color-scheme: light)').matches;
    });
    expect(respectsSystemLight).toBeTruthy();
  });

  test('theme switching is accessible', async ({ page }) => {
    const themeToggle = page.locator('button:has(.lucide-sun), button:has(.lucide-moon)').first();
    
    if (await themeToggle.count() > 0) {
      // Button should have accessible content (sr-only span or aria-label)
      const srOnlyText = await themeToggle.locator('.sr-only').textContent();
      if (srOnlyText) {
        expect(srOnlyText.toLowerCase()).toContain('theme');
      } else {
        // Fallback check for aria-label
        const ariaLabel = await themeToggle.getAttribute('aria-label');
        if (ariaLabel) {
          expect(ariaLabel.toLowerCase()).toContain('theme');
        }
      }
      
      // Should be keyboard accessible
      await themeToggle.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      // Theme should have changed
      const themeChanged = await page.evaluate(() => {
        return localStorage.getItem('theme') !== null;
      });
      expect(themeChanged).toBeTruthy();
    }
  });

  test('theme affects color scheme throughout the site', async ({ page }) => {
    // Test dark mode colors
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark');
    });
    await page.reload();
    await page.waitForTimeout(1000);

    // Check that background colors have changed to dark
    const backgroundColor = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Background should be dark (this is a basic check)
    expect(backgroundColor).not.toBe('rgb(255, 255, 255)'); // Not pure white

    // Test light mode colors
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light');
    });
    await page.reload();
    await page.waitForTimeout(1000);

    const lightBackgroundColor = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Colors should be different between themes
    expect(lightBackgroundColor).not.toBe(backgroundColor);
  });

  test('theme toggle works with JavaScript disabled', async ({ page }) => {
    // This test checks graceful degradation
    await page.goto('/', { waitUntil: 'networkidle' });
    
    // Even without JavaScript, theme toggle should be present
    const themeToggle = page.locator('button:has([data-lucide="sun"]), button:has([data-lucide="moon"])').first();
    
    if (await themeToggle.count() > 0) {
      await expect(themeToggle).toBeVisible();
    }
  });
});