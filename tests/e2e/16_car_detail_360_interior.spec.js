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

    // Verify floating HUD bar is removed for clean immersive panorama viewing
    const hud = page.locator('#cockpit-hud');
    await expect(hud).toHaveCount(0);

    // Verify Drag Hint pill is present
    const dragHint = page.locator('#cockpit-drag-hint');
    await expect(dragHint).toBeVisible();

    // Verify interactive drag on stage
    const box = await interiorStage.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    // Verify Fullscreen button is strictly 1:1 circular
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
