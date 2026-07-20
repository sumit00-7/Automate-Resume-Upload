import { test, expect } from '@playwright/test';

test('upload resume', async ({ page }) => {
  await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'networkidle' });
  
  console.log('Title:', await page.title());
  console.log('URL:', page.url());

  await page.screenshot({
    path: 'headless-login.png',
    fullPage: true,
  });

  // Check whether the login field exists
  console.log(
    'Username field exists:',
    await page.locator('#usernameField').count()
  );

  
  // Fill in the login form and submit
  await page.locator('#usernameField').fill(process.env.NAUKRI_USERNAME!);
  await page.locator('#passwordField').fill(process.env.NAUKRI_PASSWORD!);
  await page.locator("//button[normalize-space()='Login']").click();

  await expect(page.getByText('Sumit Bhatt', { exact: true })).toBeVisible({timeout: 30000});

  // Click on the "View profile" link
  await page.getByRole('link', { name: 'View profile' }).click();
  await page.waitForLoadState('networkidle');

  const filePath = `${process.cwd()}/uploads/Sumit_Bhatt_QA_Resume.pdf`;

  await page.locator('#attachCV').setInputFiles(filePath);

  await expect(
      page.locator('text=Uploaded on')
  ).toBeVisible();

  await expect(
      page.getByTitle('Sumit_Bhatt_QA_Resume.pdf')
  ).toBeVisible();

});
