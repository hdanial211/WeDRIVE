const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Modular Add Car Multi-Page Wizard Flow', () => {

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

  test('Auto-redirect from add-car/index.html to step1_spesifikasi.html', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car/index.html');
    await page.waitForURL('**/admin/pages/car/add-car/step1_spesifikasi.html');
    expect(page.url()).toContain('step1_spesifikasi.html');
  });

  test('Full 5-step traversal through dedicated HTML files', async ({ page }) => {
    // 1. Start at Step 1: Spesifikasi
    await page.goto('/admin/pages/car/add-car/step1_spesifikasi.html');
    await page.waitForLoadState('networkidle');

    // Verify Brand selection
    await page.selectOption('#inputBrand', 'Honda');
    await page.fill('#inputModel', 'Civic');
    await page.fill('#inputPlate', 'WDD 8899');

    // Navigate to Step 2 via bottom dock
    const nextBtn1 = page.locator('a[href="step2_studio360.html"]').last();
    await expect(nextBtn1).toBeVisible();
    await nextBtn1.click();
    await page.waitForURL('**/admin/pages/car/add-car/step2_studio360.html');

    // 2. Step 2: Studio Visual 360
    await expect(page).toHaveURL(/step2_studio360\.html/);
    const nextBtn2 = page.locator('a[href="step3_pengesahan.html"]').last();
    await expect(nextBtn2).toBeVisible();
    await nextBtn2.click();
    await page.waitForURL('**/admin/pages/car/add-car/step3_pengesahan.html');

    // 3. Step 3: Semakan Akhir
    await expect(page).toHaveURL(/step3_pengesahan\.html/);
    const nextBtn3 = page.locator('#btnViewAsCustomer');
    await expect(nextBtn3).toBeVisible();
    await nextBtn3.click();
    await page.waitForURL('**/admin/pages/car/add-car/step4_pandangan_pelanggan.html');

    // 4. Step 4: Pandangan Pelanggan
    await expect(page).toHaveURL(/step4_pandangan_pelanggan\.html/);
    await expect(page.locator('#customerSpotlightCard')).toBeVisible();
    const nextBtn4 = page.locator('a[href="step5_tempahan.html"]').last();
    await expect(nextBtn4).toBeVisible();
    await nextBtn4.click();
    await page.waitForURL('**/admin/pages/car/add-car/step5_tempahan.html');

    // 5. Step 5: Butiran & Tempahan
    await expect(page).toHaveURL(/step5_tempahan\.html/);
    const submitBtn = page.locator('#btn-final-register');
    await expect(submitBtn).toBeVisible();
    await submitBtn.click();

    // Verify redirect to inventory list
    await page.waitForURL('**/admin/pages/car/cars.html', { timeout: 10000 });
    expect(page.url()).toContain('cars.html');
  });

});
