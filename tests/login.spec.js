// @ts-check
const { test, expect } = require('@playwright/test');

const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const DASHBOARD_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';

test.describe('OrangeHRM Login', () => {

  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto(LOGIN_URL, { waitUntil: 'networkidle' });
  });

  // TC-01: Positive — valid credentials redirect to dashboard
  test('TC-01: successful login with valid credentials', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL(DASHBOARD_URL, { timeout: 15000 });
  });

  // TC-02: Negative — wrong password shows error alert
  test('TC-02: login fails with incorrect password', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
    await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.oxd-alert-content-text')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(LOGIN_URL);
  });

  // TC-03: Negative — empty credentials shows required field errors
  test('TC-03: login fails when both fields are empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.oxd-input-field-error-message').first()).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.oxd-input-field-error-message')).toHaveCount(2);
    await expect(page).toHaveURL(LOGIN_URL);
  });

  // TC-04: Negative — wrong username shows error alert
  test('TC-04: login fails with non-existent username', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('nonexistentuser');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.oxd-alert-content-text')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(LOGIN_URL);
  });

  // TC-05: Edge — username with leading/trailing spaces fails login
  test('TC-05: login fails when username has leading and trailing spaces', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Username' }).fill('  Admin  ');
    await page.getByRole('textbox', { name: 'Password' }).fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.locator('.oxd-alert-content-text')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
    await expect(page).toHaveURL(LOGIN_URL);
  });

});
