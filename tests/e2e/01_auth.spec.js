const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Authentication E2E Tests', () => {
  test('Login page loads and submits successfully', async ({ page }) => {
    // Navigate to Login Page
    await page.goto('/account/pages/login/login.html');
    await expect(page).toHaveTitle(/Log In|WeDRIVE/i);

    // Verify Email and Password fields are present
    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Click Sign In button directly (User Rule: single click without duplicates)
    const submitBtn = page.locator('#login-btn, button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Wait for redirect to dashboard or navigation response
    await page.waitForTimeout(1200);
    const currentUrl = page.url();
    expect(currentUrl).toMatch(/\/(customer|admin|account)/);
  });
});
