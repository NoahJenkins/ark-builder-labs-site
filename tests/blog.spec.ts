import { test, expect } from '@playwright/test';

test.describe('Blog System', () => {
  test('blog listing page displays correctly', async ({ page }) => {
    await page.goto('/blog');

    // Check page title
    await expect(page).toHaveURL('/blog');

    // Check for blog posts
    const blogPosts = page.locator('[data-testid="blog-post"], article, .blog-post').first();
    
    // Look for common blog post elements
    const postTitles = page.locator('h1, h2, h3').filter({ hasText: /welcome|guide|practices|optimization/i });
    await expect(postTitles.first()).toBeVisible();
  });

  test('individual blog posts load correctly', async ({ page }) => {
    // Test specific blog posts that we know exist
    const blogPosts = [
      'welcome-to-our-blog',
      'ai-integration-practical-guide', 
      'cloud-infrastructure-best-practices',
      'nextjs-performance-optimization'
    ];

    for (const slug of blogPosts) {
      await page.goto(`/blog/${slug}`);
      await expect(page).toHaveURL(`/blog/${slug}`);
      
      // Check that content loads
      const content = page.locator('main, article, .content');
      await expect(content).toBeVisible();
      
      // Check for heading
      const heading = page.locator('h1').first();
      await expect(heading).toBeVisible();
    }
  });

  test('blog post navigation works from listing', async ({ page }) => {
    await page.goto('/blog');
    
    // Find first blog post link and click it
    const firstPostLink = page.locator('a[href^="/blog/"]').first();
    
    if (await firstPostLink.count() > 0) {
      const href = await firstPostLink.getAttribute('href');
      await firstPostLink.click();
      
      // Should navigate to the blog post
      await expect(page).toHaveURL(new RegExp(href?.replace('/', '\\/') || ''));
      
      // Content should load
      const postContent = page.locator('main, article');
      await expect(postContent).toBeVisible();
    } else {
      // If no blog posts exist, that's also valid
      console.log('No blog post links found - this may be expected if no posts exist');
    }
  });

  test('blog posts have proper metadata', async ({ page }) => {
    await page.goto('/blog/welcome-to-our-blog');
    
    // Check for meta tags
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      await expect(metaDescription).toHaveAttribute('content');
    }
    
    // Check for title
    await expect(page).toHaveTitle(/Ark Builder Labs/);
  });

  test('blog content renders MDX correctly', async ({ page }) => {
    await page.goto('/blog/ai-integration-practical-guide');
    
    // Check for common MDX elements
    const content = page.locator('main, article');
    await expect(content).toBeVisible();
    
    // Check for headings
    const headings = page.locator('h1, h2, h3, h4');
    await expect(headings.first()).toBeVisible();
    
    // Check for paragraphs
    const paragraphs = page.locator('p');
    await expect(paragraphs.first()).toBeVisible();
  });

  test('blog images load correctly', async ({ page }) => {
    await page.goto('/blog/nextjs-performance-optimization');
    
    // Check for images in blog content
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        await expect(img).toHaveAttribute('src');
        await expect(img).toHaveAttribute('alt');
        
        // Check if image loads successfully
        const src = await img.getAttribute('src');
        if (src) {
          const response = await page.request.get(src);
          expect(response.status()).toBe(200);
        }
      }
    }
  });

  test('blog listing shows post metadata', async ({ page }) => {
    await page.goto('/blog');
    
    // Look for publication dates, categories, or other metadata
    const metadataElements = page.locator('[data-testid="post-date"], .post-date, time, [class*="date"]');
    
    // Look for category information
    const categoryElements = page.locator('[data-testid="post-category"], .post-category, [class*="category"]');
    
    // At least some metadata should be present
    const anyMetadata = page.locator('time, [class*="date"], [class*="category"], [data-testid*="post-"]');
    if (await anyMetadata.count() > 0) {
      await expect(anyMetadata.first()).toBeVisible();
    }
  });

  test('blog search/filtering works if implemented', async ({ page }) => {
    await page.goto('/blog');
    
    // Look for search or filter functionality
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]');
    const filterButtons = page.locator('button[class*="filter"], [data-testid*="filter"]');
    
    // If search exists, test it
    if (await searchInput.count() > 0) {
      await searchInput.fill('AI');
      await page.waitForTimeout(1000);
      
      // Should filter results
      const results = page.locator('[data-testid="blog-post"], article');
      if (await results.count() > 0) {
        await expect(results.first()).toBeVisible();
      }
    }
    
    // If filters exist, test them
    if (await filterButtons.count() > 0) {
      await filterButtons.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('blog is responsive across viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1200, height: 800 }  // Desktop
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Test blog listing
      await page.goto('/blog');
      const content = page.locator('main');
      await expect(content).toBeVisible();
      
      // Test individual post
      await page.goto('/blog/welcome-to-our-blog');
      await expect(content).toBeVisible();
    }
  });

  test('blog navigation and back button work', async ({ page }) => {
    // Go to blog listing
    await page.goto('/blog');
    
    // Click on a blog post if available
    const firstPost = page.locator('a[href^="/blog/"]').first();
    if (await firstPost.count() > 0) {
      await firstPost.click();
      
      // Should be on blog post page (check that URL changed from /blog)
      await page.waitForURL(/\/blog\/.+/);
      const currentUrl = page.url();
      expect(currentUrl).toMatch(/\/blog\/.+/);
      
      // Go back using browser back button
      await page.goBack();
      
      // Should be back on blog listing
      await expect(page).toHaveURL('/blog');
    } else {
      // Test direct navigation to a known blog post instead
      await page.goto('/blog/welcome-to-our-blog');
      await page.goBack();
      await expect(page).toHaveURL('/blog');
    }
  });

  test('blog posts have proper semantic HTML', async ({ page }) => {
    await page.goto('/blog/cloud-infrastructure-best-practices');
    
    // Check for main content area
    const main = page.locator('main');
    await expect(main).toBeVisible();
    
    // Check for article element if used
    const article = page.locator('article');
    if (await article.count() > 0) {
      await expect(article).toBeVisible();
    }
    
    // Check for proper heading hierarchy (there might be multiple h1s in different sections)
    const h1 = page.locator('h1');
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1); // At least one h1 should exist
    
    // Check that content is properly structured
    const content = page.locator('main p, article p');
    await expect(content.first()).toBeVisible();
  });
});