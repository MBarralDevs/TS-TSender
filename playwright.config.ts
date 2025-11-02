import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './test/playwright',  // Changed from 'test' to './test/playwright'
  fullyParallel: process.env.CI ? true : false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? parseInt(`${process.env.WORKERS}`, 10) : 1,
  reporter: 'html',
  timeout: 120000, // Increase timeout for wallet operations
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    headless: false, // Set to false to see the browser
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm run dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120000,
  },
});