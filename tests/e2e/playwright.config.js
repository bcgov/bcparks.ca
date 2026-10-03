const { defineConfig, devices } = require('@playwright/test');
const dotenv = require('dotenv');
const path = require('path');

// 1. Determine the environment (defaults to 'prod')
const environment = process.env.ENV || 'prod';

// 2. Load the corresponding .env file from tests/e2e/env
const result = dotenv.config({path: path.resolve(__dirname, `env/.env.${environment}`)});

if (!process.env.BASE_URL) {
  throw new Error(`BASE_URL is not set. Create env/.env.${environment} from env/.env.${environment}.example or set BASE_URL.`);
}

// 3. File the workers share to pause the run on network errors (see
// networkBreaker.js). Workers inherit it from the main process, so the
// whole run uses one file.
process.env.E2E_BREAKER_FILE ??= path.join(require('os').tmpdir(), `bcparks-e2e-breaker-${process.pid}.json`);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: '.',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* The CI variable is set on GitHub Actions runners (any workflow trigger), not locally. */
  /* Fail the run on GitHub Actions runners if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on GitHub Actions runners only */
  retries: process.env.CI ? 1 : 0,
  /* Limit parallel tests on GitHub Actions runners. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters
     On GitHub Actions runners, list prints each result and error as it runs (even if the job is
     cancelled) and github adds failure annotations to the run. */
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,

    /* Fail a click or fill on a missing element instead of waiting for the test timeout */
    actionTimeout: 15000,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    /* Keep full-chromium first: the Playwright MCP server runs seed.spec.js in the first project,
       and the smoke project's @smoke filter would skip it. */
    {
      name: 'full-chromium',
      testIgnore: /strapi-gatsby-comparison\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'smoke',
      grep: /@smoke/,
      use: { ...devices['Desktop Chrome'] },
    },
    /* Compares Strapi API content with the published park pages to detect
       Gatsby local database corruption after a build. */
    {
      name: 'strapi-gatsby-comparison',
      testMatch: /strapi-gatsby-comparison\.spec\.js/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'full-firefox',
      testIgnore: /strapi-gatsby-comparison\.spec\.js/,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'full-webkit',
      testIgnore: /strapi-gatsby-comparison\.spec\.js/,
      use: { ...devices['Desktop Safari'] }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

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
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

