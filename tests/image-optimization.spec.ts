import { expect, test } from '@playwright/test';

test.describe('Image optimization', () => {
  test('serves the local logo through the Next.js image optimizer', async ({ request }) => {
    const response = await request.get(
      '/_next/image?url=%2Fassets%2Fimages%2Flogo.png&w=640&q=75'
    );

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toMatch(/^image\//);
  });
});
