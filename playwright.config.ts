import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  forbidOnly: isCI,

  // retries: isCI ? 1 : 0,

  workers: isCI ? 1 : undefined,

  reporter: [
    ['html'],
    ['list'],
  ],

  use: {
    headless: true, // GitHub-hosted runners have no display — must stay headless

    viewport: { width: 1920, height: 1080 },

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    actionTimeout: 30000,
    navigationTimeout: 60000,

    // --- reduce obvious automation signals ---
    locale: 'en-IN',
    timezoneId: 'Asia/Kolkata',

    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',

    extraHTTPHeaders: {
      'Accept-Language': 'en-IN,en;q=0.9',
    },

    permissions: ['geolocation'],
    colorScheme: 'light',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          slowMo: isCI ? 150 : 0, // more human-like pacing in CI runs
          args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-dev-shm-usage',
            '--disable-infobars',
          ],
        },
      },
    },
  ],
});