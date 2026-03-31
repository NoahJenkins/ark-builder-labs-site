import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contact', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true, message: 'Mock response - form not actually submitted' })
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true, message: 'Mock response - form not actually submitted' })
      });
    });

    await page.goto('/contact');
  });

  test('form submission works with valid data', async ({ page }) => {
    await page.fill('input[name="name"]', 'John Doe');
    await page.fill('input[name="email"]', 'john@example.com');
    await page.fill('input[name="company"]', 'Test Company');
    await page.selectOption('select[name="service"]', 'web-mobile');
    await page.fill('textarea[name="message"]', 'This is a test message for the contact form.');

    await page.click('button[type="submit"]');

    await expect(page.getByText("Thank you! We'll get back to you within 24 hours.")).toBeVisible();
  });

  test('form shows rate limiting protection', async ({ page }) => {
    let submissionCount = 0;
    await page.route('**/api/contact', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        submissionCount++;
        if (submissionCount > 1) {
          await route.fulfill({
            status: 429,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' })
          });
        } else {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ success: true, message: 'Mock response - form not actually submitted' })
          });
        }
      } else {
        await route.continue();
      }
    });

    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.selectOption('select[name="service"]', 'general');
    await page.fill('textarea[name="message"]', 'Test message');
    await page.click('button[type="submit"]');

    await expect(page.getByText("Thank you! We'll get back to you within 24 hours.")).toBeVisible();

    await page.fill('input[name="name"]', 'Test User 2');
    await page.fill('input[name="email"]', 'test2@example.com');
    await page.selectOption('select[name="service"]', 'general');
    await page.fill('textarea[name="message"]', 'Test message 2');
    await page.click('button[type="submit"]');

    await expect(page.getByText('Rate limit exceeded')).toBeVisible();
  });
});
