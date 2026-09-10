const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE - Studio 360° Native Exterior Turntable with SpinCar / Carsome CDN', () => {
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

  test('should load Nissan Navara (#394) with native 360 turntable frames and no iframe', async ({ page }) => {
    await page.goto('/admin/pages/car/car-detail/car-detail.html?id=394');
    await page.waitForLoadState('networkidle');

    // Verify car name
    const carName = page.locator('#cd-name');
    await expect(carName).toContainText('Nissan Navara');

    // Verify 360 Exterior tab is active and visible
    const tabExterior = page.locator('#tab-exterior');
    await expect(tabExterior).toBeVisible();

    // Verify canvas stage image is visible and loaded
    const stageImg = page.locator('#studio-canvas-stage');
    await expect(stageImg).toBeVisible({ timeout: 10000 });

    // Ensure NO iframe is injected (pure native Apple HIG turntable canvas/image)
    const iframe = page.locator('#studio-exterior-iframe');
    await expect(iframe).toHaveCount(0);

    // Verify stage image src points to CDN ec frame
    const src = await stageImg.getAttribute('src');
    expect(src).toMatch(/impel\.io.*ec\/0-\d+\.jpg|carsome.*ec\/0-\d+\.jpg/);

    // Verify angle indicator pill
    const anglePill = page.locator('#studio-angle-pill');
    await expect(anglePill).toBeVisible();
    const angleText = page.locator('#studio-angle-text');
    await expect(angleText).toContainText('0°');

    // Test drag-to-rotate interaction
    const stage = page.locator('#studio-exterior-stage');
    const box = await stage.boundingBox();
    expect(box).not.toBeNull();

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 120, box.y + box.height / 2, { steps: 5 });
    await page.mouse.up();
    await page.waitForTimeout(300);

    // After drag, angle text degrees should have changed
    const newAngleText = await angleText.textContent();
    expect(newAngleText).not.toBe('0° · Pandangan Hadapan');

    // Verify Fullscreen button is strictly 1:1 circular
    const fsBtn = stage.locator('.studio-fullscreen-btn');
    await expect(fsBtn).toBeVisible();
    const fsBox = await fsBtn.boundingBox();
    expect(fsBox).not.toBeNull();
    expect(Math.abs(fsBox.width - fsBox.height)).toBeLessThanOrEqual(0.5);
  });

  test('Step 2 Studio 360: parses Carsome link into 36 frames and displays progress animation on save', async ({ page }) => {
    // Setup initial draft in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify({
        make: 'Nissan',
        model: 'Navara PRO-4X',
        year: 2022,
        plate: 'JAA 2044',
        rate: 280,
        type: '4x4',
        step: 2,
        timestamp: Date.now()
      }));
    });

    await page.goto('/admin/pages/car/add-car/step2_studio360.html');
    await page.waitForLoadState('networkidle');

    // Input SpinCar/Carsome CDN URL
    const cdnInput = page.locator('#cdnUrlInput');
    await expect(cdnInput).toBeVisible();
    await cdnInput.fill('https://cdn.impel.io/spincar-static/20190909/?_=d552e39523c808#!customer=Carsome!vin=mntccnd23z0011880!disableautospin!issaleslink#!n=true!hideExpandBtn!region=eu');

    // Click Jana Studio AI button
    const btnGenerate = page.locator('#btnGenerate3D');
    await btnGenerate.click();

    // Verify badge updates with 36 turntable frames
    const badgeText = page.locator('#cdnStatusText');
    await expect(badgeText).toContainText(/36|Turntable/i, { timeout: 10000 });

    // Verify Simpan Visual button is enabled
    const btnSave = page.locator('#btnSaveToDb');
    await expect(btnSave).toBeEnabled();

    // Click Simpan Visual and observe progress box
    await btnSave.click();
    const progressBox = page.locator('#saveDbProgressBox');
    await expect(progressBox).toBeVisible();

    // Verify progress bar reaches 100%
    const percentText = page.locator('#downloadPercentText');
    await expect(percentText).toHaveText('100%', { timeout: 8000 });

    // Verify draft now contains exterior_frames
    const draftJson = await page.evaluate(() => localStorage.getItem('wedrive_new_car_draft'));
    const draft = JSON.parse(draftJson);
    expect(Array.isArray(draft.exterior_frames)).toBe(true);
    expect(draft.exterior_frames.length).toBe(36);
  });
});
