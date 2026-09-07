const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Add Car 2-Step Stepper & Carlist Cascading Selectors', () => {

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

  test('Cascading selectors auto-fill model, variant, technical specs, and formula pricing', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car.html');
    await page.waitForLoadState('networkidle');

    // 1. Verify Stepper and Step 1 is active
    await expect(page.locator('#step-btn-1')).toHaveClass(/active/);
    await expect(page.locator('#step-1-container')).toBeVisible();
    await expect(page.locator('#step-2-container')).toBeHidden();

    // 2. Select Brand 'Proton'
    await page.selectOption('#car-brand', 'Proton');

    // Verify Models populated with Proton models (S70, X50, X70, etc.)
    const modelSelect = page.locator('#car-model');
    await expect(modelSelect).toContainText('S70');
    await expect(modelSelect).toContainText('X50');

    // 3. Select Model 'X50'
    await page.selectOption('#car-model', 'X50');

    // Verify Variants populated
    const variantSelect = page.locator('#car-variant');
    await expect(variantSelect).toContainText('1.5 TGDi Flagship');

    // 4. Verify Technical specs auto-filled
    await expect(page.locator('#car-type')).toHaveValue('SUV');
    await expect(page.locator('#car-seats')).toHaveValue('5');
    await expect(page.locator('#car-transmission')).toHaveValue('Automatic');
    await expect(page.locator('#car-fuel')).toHaveValue('Petrol');

    // 5. Verify Rate and Deposit calculated by formula
    const rateVal = await page.locator('#car-rate').inputValue();
    expect(parseInt(rateVal, 10)).toBeGreaterThanOrEqual(100);

    const depVal = await page.locator('#car-deposit').inputValue();
    expect(parseInt(depVal, 10)).toBeGreaterThanOrEqual(150);

    // 6. Test 'Lain-lain' Color Option displays custom color input
    await page.selectOption('#car-color-select', 'other');
    await expect(page.locator('#car-color-custom-wrap')).toBeVisible();

    // Select standard color again hides it
    await page.selectOption('#car-color-select', 'Hitam (Midnight / Metallic Black)');
    await expect(page.locator('#car-color-custom-wrap')).toBeHidden();
  });

  test('Stepper transitions between Step 1 and Step 2 smoothly', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car.html');
    await page.waitForLoadState('networkidle');

    // Select brand, model, and plate number
    await page.selectOption('#car-brand', 'Perodua');
    await page.selectOption('#car-model', 'Myvi');
    await page.fill('#car-plate', 'WXY 8899');

    // Click Next to Step 2
    await page.locator('#btn-next-step').click();

    // Verify Step 2 is now active
    await expect(page.locator('#step-btn-2')).toHaveClass(/active/);
    await expect(page.locator('#step-2-container')).toBeVisible();
    await expect(page.locator('#step-1-container')).toBeHidden();
    await expect(page.locator('#card-360-studio')).toBeVisible();

    // Return to Step 1
    await page.locator('button:has-text("Kembali ke Spesifikasi")').first().click();
    await expect(page.locator('#step-btn-1')).toHaveClass(/active/);
    await expect(page.locator('#step-1-container')).toBeVisible();
    await expect(page.locator('#step-2-container')).toBeHidden();
  });

  test('Draft auto-save and exit confirmation modal protect work in progress', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car.html');
    await page.waitForLoadState('networkidle');

    // Fill plate and trigger draft save
    await page.fill('#car-plate', 'DRAFT 1234');
    await page.waitForTimeout(500);

    // Click Batal & verify Exit Confirmation Modal appears
    await page.locator('button:has-text("Batal")').first().click();
    const modal = page.locator('#modal-exit-confirm');
    await expect(modal).toHaveClass(/show/);
    await expect(modal).toContainText('Tinggalkan Pendaftaran Kereta?');

    // Click Stay on page
    await page.locator('button:has-text("Kekal di Halaman Ini")').click();
    await expect(modal).not.toHaveClass(/show/);

    // Reload page to test Draft Resume Banner
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Banner should be visible
    const draftBanner = page.locator('#banner-draft-resume');
    await expect(draftBanner).toBeVisible();
    await expect(draftBanner).toContainText('Draf Pendaftaran Ditemui');

    // Click Pulihkan Draf
    await page.locator('button:has-text("Pulihkan Draf")').click();
    await expect(page.locator('#car-plate')).toHaveValue('DRAFT 1234');
  });

});
