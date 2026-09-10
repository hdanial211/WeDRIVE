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

  test('Step 1: Specifications form gatekeeper blocks forward navigation without plate, succeeds with plate', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car/step1_spesifikasi.html');
    await page.waitForLoadState('networkidle');

    // Clear draft if any
    await page.evaluate(() => localStorage.removeItem('wedrive_new_car_draft'));
    await page.fill('#inputPlate', '');

    // Attempt to navigate to Step 2 without plate - MUST BE BLOCKED
    const nextBtn = page.locator('#btnNextToStep2, a[href="step2_studio360.html"]').last();
    await nextBtn.click();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('step1_spesifikasi.html');

    // Fill valid plate and specifications
    await page.selectOption('#inputBrand', 'Honda');
    await page.fill('#inputModel', 'Civic');
    await page.fill('#inputVariant', '1.5 TC-P');
    await page.fill('#inputPlate', 'WKL 9988');

    // Verify AI Auto Generate Button & Rates
    await expect(page.locator('#aiAutoGenerateBtn')).toBeVisible();
    await expect(page.locator('#inputDailyRate')).toBeVisible();
    await expect(page.locator('#inputWeeklyRate')).toBeVisible();

    // Now navigate to Step 2 - MUST SUCCEED
    await nextBtn.click();
    await page.waitForURL('**/admin/pages/car/add-car/step2_studio360.html');
    expect(page.url()).toContain('step2_studio360.html');
  });

  test('Step 2: Visual Studio 360 gatekeeper blocks forward progression without photos, succeeds when photo added', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car/step2_studio360.html');
    await page.waitForLoadState('networkidle');

    // Clear photo draft to test gatekeeper
    await page.evaluate(() => {
      const draft = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
      draft.photos = [];
      draft.images = [];
      draft.turntableUrl = '';
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));
      if (window.studioDraft) {
        window.studioDraft.photos = [];
        window.studioDraft.images = [];
      }
    });

    // Attempt to navigate to Step 3 without photos - MUST BE BLOCKED
    const nextBtn = page.locator('a[href="step3_pengesahan.html"]').last();
    await nextBtn.click();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('step2_studio360.html');

    // Inject valid sample photo into draft
    await page.evaluate(() => {
      const draft = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
      draft.photos = ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'];
      draft.images = draft.photos;
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));
      if (window.studioDraft) {
        window.studioDraft.photos = draft.photos;
        window.studioDraft.images = draft.photos;
      }
    });

    // Navigate to Step 3 with photo present - MUST SUCCEED
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
    const toStep2 = page.locator('#btnNextToStep2, a[href="step2_studio360.html"]').last();
    await toStep2.click();
    await page.waitForURL('**/admin/pages/car/add-car/step2_studio360.html');

    // 2. Step 2: Inject valid photo payload to satisfy visual gatekeeper
    await page.evaluate(() => {
      const draft = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
      draft.photos = ['https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800'];
      draft.images = draft.photos;
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));
      if (window.studioDraft) {
        window.studioDraft.photos = draft.photos;
        window.studioDraft.images = draft.photos;
      }
    });

    // Advance to Step 3
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

  test('Top Navbar responsive collision & Zero Oval verification across MacBook, iPad, and iPhone', async ({ page }) => {
    const viewports = [
      { name: 'MacBook', width: 1440, height: 900 },
      { name: 'iPad', width: 820, height: 1180 },
      { name: 'iPhone', width: 393, height: 852 }
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/admin/pages/car/add-car/step1_spesifikasi.html');
      await page.waitForLoadState('networkidle');

      const checkNavbar = await page.evaluate(() => {
        const aiLink = document.getElementById('nl-ai');
        const langToggle = document.querySelector('.navbar .lang-toggle');
        const themeToggle = document.querySelector('.navbar .theme-toggle');

        if (!aiLink || !langToggle || !themeToggle) return { found: false };

        const aiRect = aiLink.getBoundingClientRect();
        const langRect = langToggle.getBoundingClientRect();
        const themeRect = themeToggle.getBoundingClientRect();

        return {
          found: true,
          aiRight: aiRect.right,
          langLeft: langRect.left,
          clearance: langRect.left - aiRect.right,
          isOverlapping: aiRect.right > langRect.left,
          themeAspectRatio: themeRect.width / themeRect.height
        };
      });

      expect(checkNavbar.found).toBe(true);
      expect(checkNavbar.isOverlapping).toBe(false);
      expect(checkNavbar.clearance).toBeGreaterThanOrEqual(0);
      expect(Math.abs(checkNavbar.themeAspectRatio - 1.0)).toBeLessThan(0.05);
    }
  });

});
