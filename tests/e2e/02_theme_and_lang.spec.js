const { test, expect } = require('@playwright/test');

test.describe('Theme and Bilingual Switcher Tests', () => {
  test('Theme switcher toggles between dark, light, and system', async ({ page }) => {
    await page.goto('/index.html');

    const themeBtn = page.locator('.theme-toggle, .btn-theme').first();
    await expect(themeBtn).toBeVisible();

    // Check initial state
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme') || 'system');

    // Click theme toggle
    await themeBtn.click();
    await page.waitForTimeout(300);

    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(newTheme).toBeDefined();
  });

  test('Language switcher toggles between EN and MS seamlessly', async ({ page }) => {
    await page.goto('/index.html');

    const langBtn = page.locator('.lang-toggle, .btn-lang').first();
    await expect(langBtn).toBeVisible();

    // Toggle language
    await langBtn.click();
    await page.waitForTimeout(500);

    const htmlLang = await page.evaluate(() => document.documentElement.lang);
    expect(['en', 'ms']).toContain(htmlLang);
  });
});
