const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Add Car 5-Step Modular Multi-Page Architecture & CRUD Sync', () => {

  test.beforeEach(async ({ page }) => {
    // Inject valid admin session
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

  test('Index entrypoint auto-forwards to Step 1: Spesifikasi & Harga', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car/index.html');
    await page.waitForURL('**/admin/pages/car/add-car/step1_spesifikasi.html');
    expect(page.url()).toContain('step1_spesifikasi.html');

    // Verify Stepper Capsule Step 1 is active
    const step1Pill = page.locator('.pill-btn:has-text("Maklumat Asas"), .pill-btn:has-text("Basic Info")');
    await expect(step1Pill.first()).toBeVisible();
  });

  test('Step 1: Specifications form inputs, AI suggestions, and formula pricing', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car/step1_spesifikasi.html');
    await page.waitForLoadState('networkidle');

    // Select Brand and Fill details
    await page.selectOption('#inputBrand', 'Honda');
    await page.fill('#inputModel', 'Civic');
    await page.fill('#inputVariant', '1.5 TC-P');
    await page.fill('#inputPlate', 'WKL 9988');

    // Verify AI Auto Generate Button
    const aiBtn = page.locator('#aiAutoGenerateBtn');
    await expect(aiBtn).toBeVisible();

    // Verify Daily Rate and Weekly Rate inputs exist
    await expect(page.locator('#inputDailyRate')).toBeVisible();
    await expect(page.locator('#inputWeeklyRate')).toBeVisible();

    // Navigate to Step 2 via bottom dock
    const nextBtn = page.locator('a[href="step2_studio360.html"]').last();
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForURL('**/admin/pages/car/add-car/step2_studio360.html');
    expect(page.url()).toContain('step2_studio360.html');
  });

  test('Step 2: Visual Studio 360 viewer, photo slots, and progression to Step 3', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car/step2_studio360.html');
    await page.waitForLoadState('networkidle');

    // Verify 360 Turntable Viewport
    await expect(page.locator('#turntableViewport')).toBeVisible();
    await expect(page.locator('#photoUploadSlotsGrid')).toBeVisible();

    // Navigate to Step 3
    const nextBtn = page.locator('a[href="step3_pengesahan.html"]').last();
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();
    await page.waitForURL('**/admin/pages/car/add-car/step3_pengesahan.html');
    expect(page.url()).toContain('step3_pengesahan.html');
  });

  test('Full 5-step modular journey: Step 1 -> Step 2 -> Step 3 -> Step 4 -> Step 5 -> Registration & CRUD sync to cars list', async ({ page }) => {
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // 1. Step 1: Input Details
    await page.goto('/admin/pages/car/add-car/step1_spesifikasi.html');
    await page.waitForLoadState('networkidle');

    const testPlate = 'WDR ' + Math.floor(1000 + Math.random() * 9000);
    await page.selectOption('#inputBrand', 'Honda');
    await page.fill('#inputModel', 'City');
    await page.fill('#inputPlate', testPlate);

    // Save and advance to Step 2
    const toStep2 = page.locator('a[href="step2_studio360.html"]').last();
    await toStep2.click();
    await page.waitForURL('**/admin/pages/car/add-car/step2_studio360.html');

    // 2. Step 2 -> Advance to Step 3
    const toStep3 = page.locator('a[href="step3_pengesahan.html"]').last();
    await toStep3.click();
    await page.waitForURL('**/admin/pages/car/add-car/step3_pengesahan.html');

    // 3. Step 3 -> Advance to Step 4 (Lihat Sebagai Pelanggan)
    const toStep4 = page.locator('#btnViewAsCustomer');
    await expect(toStep4).toBeVisible();
    await toStep4.click();
    await page.waitForURL('**/admin/pages/car/add-car/step4_pandangan_pelanggan.html');

    // 4. Step 4: Verify Customer Spotlight Card & Advance to Step 5
    await expect(page.locator('#customerSpotlightCard')).toBeVisible();
    const toStep5 = page.locator('a[href="step5_tempahan.html"]').last();
    await toStep5.click();
    await page.waitForURL('**/admin/pages/car/add-car/step5_tempahan.html');

    // 5. Step 5: Final Registration Submit
    await expect(page.locator('#step5Title')).toBeVisible();
    const submitBtn = page.locator('#btn-final-register');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    await page.waitForURL('**/admin/pages/car/cars.html', { timeout: 10000 });
    await page.waitForSelector('#car-grid');

    // Search for the newly created car by plate number
    await page.fill('#fl-search', testPlate);
    await page.waitForTimeout(500);

    // Check that the car-grid contains the registered plate
    const carListing = page.locator('#car-grid');
    await expect(carListing).toContainText(testPlate);
  });

});
