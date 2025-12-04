/**
 * Runtime-safe Playwright config loader:
 * - Try to require '@playwright/test' at runtime.
 * - If it's not installed, fall back to stubs so Node/tsc won't crash.
 *
 * This avoids hard failures when dev dependencies are missing in the environment.
 */
const _playwright = (() => {
  try {
    // Use CommonJS require inside try/catch so missing module doesn't throw at top-level.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // @ts-ignore - runtime require, this file is excluded from tsconfig checks
    return require('@playwright/test');
  } catch (e) {
    return {
      defineConfig: (c: any) => c,
      devices: {
        'Desktop Chrome': { viewport: { width: 1280, height: 720 } },
        'Desktop Firefox': { viewport: { width: 1280, height: 720 } },
        'Desktop Safari': { viewport: { width: 1280, height: 720 } },
        'Pixel 5': { viewport: { width: 393, height: 851 } },
        'iPhone 12': { viewport: { width: 390, height: 844 } },
      },
    };
  }
})();

const { defineConfig, devices } = _playwright;

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 3 : 0,
  /* Reduce workers on CI to prevent overwhelming single server */
  workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Global timeout for each test */
  timeout: 60000, // 60 seconds per test
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Increase timeouts for actions */
    actionTimeout: 15000, // 15 seconds for actions
    navigationTimeout: 30000, // 30 seconds for page navigation
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'pnpm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 180000, // Increase server start timeout
    cwd: '.',
    env: {
      NODE_ENV: 'development'
    }
  },
});