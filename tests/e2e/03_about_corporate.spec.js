const { test, expect } = require('@playwright/test');

test.describe('About Us Corporate Mobility Branding Tests', () => {
  test('Renders corporate sections, rental guarantees, and AI sparkles assistant button', async ({ page }) => {
    await page.goto('/shared/pages/footer/about/about.html');
    await expect(page).toHaveTitle(/About WeDRIVE|Tentang Kami|WeDRIVE/i);

    // Verify Specular Glass Panels exist
    const specularPanels = page.locator('.glass-specular-panel');
    await expect(specularPanels.first()).toBeVisible();

    // Verify 4 Pillar Cards
    const pillarCards = page.locator('.pillar-card');
    await expect(pillarCards).toHaveCount(4);

    // Verify 3 Rental Guarantees exist (Insurance, Delivery, Instant Key)
    const standardItems = page.locator('.standard-item');
    await expect(standardItems).toHaveCount(3);

    // Verify Ask AI Assistant button has auto_awesome icon
    const aiBtn = page.locator('.about-btn-secondary');
    await expect(aiBtn).toBeVisible();
    const aiIcon = aiBtn.locator('.material-icons-round');
    await expect(aiIcon).toHaveText('auto_awesome');

    // Click AI button and verify chatbot opens
    await aiBtn.click();
    await page.waitForTimeout(600);
    const chatbotPanel = page.locator('#chatbot-panel');
    await expect(chatbotPanel).toHaveClass(/open/);
  });
});
