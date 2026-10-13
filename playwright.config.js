// @ts-check
import { defineConfig, devices } from "@playwright/test";

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config = {
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 10 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  timeout: 45000,
  projects: [
    {
      name: "chrome",
      use: {
        browserName: "chromium",
        headless: process.env.CI ? true : false,
        trace: "retain-on-failure",
        ignoreHttpsErrors: true,
        actionTimeout: 10 * 1000,
        navigationTimeout: 30 * 1000,
        screenshot: "on",
        video: "retain-on-failure",
      },
    },
    {
      name: "Safari",
      use: {
        browserName: "webkit",
        headless: process.env.CI ? true : false,
        trace: "retain-on-failure",
        ignoreHttpsErrors: true,
        actionTimeout: 10 * 1000,
        navigationTimeout: 30 * 1000,
        screenshot: "on",
      },
    },
    {
      name: "chrome_mobile",
      use: {
        browserName: "chromium",
        headless: process.env.CI ? true : false,
        trace: "retain-on-failure",
        ignoreHttpsErrors: true,
        actionTimeout: 10 * 1000,
        navigationTimeout: 30 * 1000,
        screenshot: "on",
        ...devices["Galaxy Z Flip 6 Cover landscape"],
      },
    },
    {
      name: "ios_mobile",
      use: {
        browserName: "webkit",
        headless: process.env.CI ? true : false,
        trace: "retain-on-failure",
        ignoreHttpsErrors: true,
        actionTimeout: 10 * 1000,
        navigationTimeout: 30 * 1000,
        screenshot: "on",
        video: "retain-on-failure",
        ...devices["iPhone 17 Pro Max"],
      },
    },
  ],

  /* Configure projects for major browsers */
  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   }

  // {
  //   name: 'firefox',
  //   use: { ...devices['Desktop Firefox'] },
  // },

  // {
  //   name: 'webkit',
  //   use: { ...devices['Desktop Safari'] },
  // },

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
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
};

module.exports = config;
