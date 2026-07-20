import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list']
  ],

  use: {
    headless: true,

    viewport: { width: 1920, height: 1080 },

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    trace: 'retain-on-failure',

    actionTimeout: 30000,

    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});