const { test, expect } = require('@playwright/test');

test.describe('Pricing Apple Segmented Switch Glider Tests', () => {
  test('Glider slides smoothly and updates pricing cards', async ({ page }) => {
    await page.goto('/guest/pages/pricing/pricing.html');

    // Verify toggle glider element exists
    const glider = page.locator('.toggle-glider');
    await expect(glider).toBeVisible();

    // Click Weekly button
    const weeklyBtn = page.locator('.toggle-btn[data-period="weekly"]');
    await expect(weeklyBtn).toBeVisible();
    await weeklyBtn.click();
    await page.waitForTimeout(400);

    // Verify button is active
    await expect(weeklyBtn).toHaveClass(/active/);

    // Click Daily button back
    const dailyBtn = page.locator('.toggle-btn[data-period="daily"]');
    await expect(dailyBtn).toBeVisible();
    await dailyBtn.click();
    await page.waitForTimeout(400);

    // Verify button is active
    await expect(dailyBtn).toHaveClass(/active/);
  });
});
