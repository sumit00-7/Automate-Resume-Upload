import { test, expect } from '@playwright/test';
import path from 'path';
 
test('upload resume', async ({ page }) => {
  const username = process.env.NAUKRI_USERNAME;
  const password = process.env.NAUKRI_PASSWORD;
 
  if (!username || !password) {
    throw new Error('NAUKRI_USERNAME and NAUKRI_PASSWORD env vars must be set');
  }
 
  // Go to login page - avoid 'networkidle', it hangs on pages with polling/analytics
  await page.goto('https://www.naukri.com/nlogin/login', {
    waitUntil: 'domcontentloaded',
  });
 
  console.log('Title:', await page.title());
  console.log('URL:', page.url());
 
 
  // Wait for the username field to actually be visible before interacting
  const usernameField = page.locator('#usernameField');
  await expect(usernameField).toBeVisible({ timeout: 15000  });
 
  console.log('Username field exists:', await usernameField.count());
 
  // Fill in the login form and submit
  await usernameField.fill(username);
  await page.locator('#passwordField').fill(password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
 
    /// Confirm login succeeded
  await expect(page.getByText('Sumit Bhatt', { exact: true })).toBeVisible({ timeout: 30000 });

  // Dismiss the chatbot overlay if it's blocking the page
  const chatbotOverlay = page.locator('.chatbot_Overlay.show');
  if (await chatbotOverlay.isVisible().catch(() => false)) {
    // The snapshot shows "Maybe later" as a dismiss option in the chat widget
    const maybeLater = page.getByText('Maybe later', { exact: true });
    if (await maybeLater.isVisible().catch(() => false)) {
      await maybeLater.click();
    }
    await expect(chatbotOverlay).toBeHidden({ timeout: 5000 }).catch(() => {});
  }

  // Click on the "View profile" link
  await page.getByRole('link', { name: 'View profile' }).click();
 
  // Wait for the upload control to be ready instead of relying on networkidle
  const attachCV = page.locator('#attachCV');
  await expect(attachCV).toBeAttached({ timeout: 30000 });
 
  const filePath = path.join(process.cwd(), 'uploads', 'Sumit_Bhatt_QA_Resume.pdf');
 
  await attachCV.setInputFiles(filePath);

  await page.waitForTimeout(3000);

 
  // Give upload confirmation elements a generous timeout - server-side processing takes time
  // await expect(page.getByText('Uploaded on')).toBeVisible({ timeout: 30000 });
 
  // await expect(
  //   page.getByTitle('Sumit_Bhatt_QA_Resume.pdf')
  // ).toBeVisible({ timeout: 30000 });
});
 
