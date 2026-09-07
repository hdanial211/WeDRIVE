const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE - Car Detail 360° Studio & 3D Interior Panorama', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('wedrive_session', JSON.stringify({
        id: 'admin-test-id',
        email: 'admin@wedrive.my',
        role: 'admin',
        username: 'Admin Test',
        name: 'Admin Test',
        timestamp: Date.now()
      }));
    });
  });

  test('should load car-detail.html, switch to interior 3D panorama, and verify controls', async ({ page }) => {
    // Navigate to car detail page
    await page.goto('/admin/pages/car/car-detail/car-detail.html?id=1');

    // Verify page title and header
    await expect(page).toHaveTitle(/BMW 320i M Sport/i);
    const carName = page.locator('#cd-name');
    await expect(carName).toContainText('BMW 320i');

    // Switch to Interior 360 tab
    const tabInterior = page.locator('#tab-interior');
    await tabInterior.click();

    // Verify stage visibility
    const interiorStage = page.locator('#studio-interior-stage');
    await expect(interiorStage).toBeVisible();

    // Verify angle indicator pill
    const anglePill = page.locator('#cockpit-angle-pill');
    await expect(anglePill).toBeVisible();
    const angleText = page.locator('#cockpit-angle-text');
    await expect(angleText).toContainText('Pandangan Hadapan');

    // Verify 6 interior cubemap faces are present
    const faces = page.locator('#cdInteriorCube [data-vehicle-interior-face]');
    await expect(faces).toHaveCount(6);

    // Verify HUD controls are present
    const hud = page.locator('#cockpit-hud');
    await expect(hud).toBeVisible();

    // Test HUD Front snap
    const btnFront = hud.locator('button[onclick*="front"]');
    await btnFront.click();
    await page.waitForTimeout(300);
    await expect(angleText).toContainText('Pandangan Hadapan');

    // Test HUD Look Up (Roof)
    const btnUp = hud.locator('button[onclick*="up"]');
    await btnUp.click();
    await page.waitForTimeout(400);
    await expect(angleText).toContainText('Bumbung');

    // Test HUD Look Down (Console)
    const btnDown = hud.locator('button[onclick*="down"]');
    await btnDown.click();
    await page.waitForTimeout(400);
    await expect(angleText).toContainText('Konsol');

    // Reset to Front
    await btnFront.click();
    await page.waitForTimeout(400);
    await expect(angleText).toContainText('Pandangan Hadapan');

    // Verify Zero Oval Rule on all HUD buttons
    const hudButtons = page.locator('.cockpit-hud-btn');
    const count = await hudButtons.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const btn = hudButtons.nth(i);
      const box = await btn.boundingBox();
      expect(box).not.toBeNull();
      // Expect strictly 1:1 aspect ratio within 0.5px tolerance
      expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(0.5);
    }

    // Verify Fullscreen button is also strictly 1:1 circular
    const fsBtn = interiorStage.locator('.studio-fullscreen-btn');
    await expect(fsBtn).toBeVisible();
    const fsBox = await fsBtn.boundingBox();
    expect(fsBox).not.toBeNull();
    expect(Math.abs(fsBox.width - fsBox.height)).toBeLessThanOrEqual(0.5);
  });

  test('should dynamically resolve and load interior panorama for different models', async ({ page }) => {
    await page.goto('/admin/pages/car/car-detail/car-detail.html?id=2');

    // Should load Mercedes GLA
    await expect(page.locator('#cd-name')).toContainText('Mercedes-Benz GLA');

    // Switch to Interior tab
    await page.locator('#tab-interior').click();

    const stage = page.locator('#studio-interior-stage');
    await expect(stage).toBeVisible();
    await expect(stage).toHaveAttribute('data-vehicle-default-model', 'gla');

    const angleText = page.locator('#cockpit-angle-text');
    await expect(angleText).toContainText('Pandangan Hadapan');

    // Ensure cubemap faces are rendered
    const frontFace = page.locator('#cdInteriorCube [data-vehicle-interior-face="f"]');
    await expect(frontFace).toBeVisible();
  });
});
