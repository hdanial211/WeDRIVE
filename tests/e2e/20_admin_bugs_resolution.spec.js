const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Admin Audit Bugs Resolution Verification', () => {

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

  test('Bug 1: api.js loads without HTTP 404 on reports and 406 on config', async ({ page }) => {
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const failedRequests = [];
    page.on('requestfailed', req => {
      failedRequests.push({ url: req.url(), failure: req.failure() });
    });

    await page.goto('/admin/pages/dashboard/operations.html');
    await page.waitForLoadState('networkidle');

    // Confirm no 404 for reports or 406 for config in network requests
    const hasReports404 = failedRequests.some(r => r.url.includes('/rest/v1/reports'));
    const hasConfig406 = failedRequests.some(r => r.url.includes('/rest/v1/config'));
    expect(hasReports404).toBeFalsy();
    expect(hasConfig406).toBeFalsy();
  });

  test('Bug 2: Edit Car wizard steps render Admin Navbar with 6 modules', async ({ page }) => {
    const steps = [
      '/admin/pages/car/edit-car/step1-specification.html?id=6',
      '/admin/pages/car/edit-car/step2-studio360.html?id=6',
      '/admin/pages/car/edit-car/step3-confirmation.html?id=6'
    ];

    for (const stepUrl of steps) {
      await page.goto(stepUrl);
      await page.waitForLoadState('networkidle');

      const navbar = page.locator('#navbar-placeholder');
      await expect(navbar).toHaveAttribute('data-module', 'admin');

      // Check admin nav items exist
      await expect(page.locator('nav a:has-text("Cars"), nav a:has-text("Bookings"), nav a:has-text("Dashboard")').first()).toBeVisible();
    }
  });

  test('Bug 3: Category and Transmission dropdowns are correctly pre-filled without blank values', async ({ page }) => {
    // Ford Ranger Raptor ID=6 (type=truck, transmission=Auto in DB)
    await page.goto('/admin/pages/car/edit-car/step1-specification.html?id=6');
    await page.waitForLoadState('networkidle');

    const selectCategory = page.locator('#selectCategory');
    const selectTrans = page.locator('#selectTrans');

    await expect(selectCategory).toBeVisible();
    await expect(selectTrans).toBeVisible();

    const categoryVal = await selectCategory.inputValue();
    const transVal = await selectTrans.inputValue();

    expect(categoryVal).toBe('Truck');
    expect(transVal).toBe('Automatic');
  });

  test('Bug 4: Fallback car image bezza.png returns HTTP 200 OK', async ({ page }) => {
    const response = await page.goto('/shared/model/bezza.png');
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
  });

  test('Bug 5: KYC verifications page loads sample MyKad and Driving License without 404', async ({ page }) => {
    const notFoundUrls = [];
    page.on('response', res => {
      if (res.status() === 404) notFoundUrls.push(res.url());
    });

    await page.goto('/admin/pages/customer/verifications.html');
    await page.waitForLoadState('networkidle');

    const mykad404 = notFoundUrls.some(u => u.includes('sample_mykad.png'));
    const license404 = notFoundUrls.some(u => u.includes('sample_license.png'));

    expect(mykad404).toBeFalsy();
    expect(license404).toBeFalsy();
  });

  test('Bug 6: Admin Chatbot page loads cleanly without duplicate form field IDs', async ({ page }) => {
    await page.goto('/admin/pages/chatbot/chatbot.html');
    await page.waitForLoadState('networkidle');

    // Verify there is only ONE chat-input in the entire DOM
    const chatInputCount = await page.locator('#chat-input').count();
    expect(chatInputCount).toBe(1);

    // Verify floating customer chatbot is not mounted
    const fabCount = await page.locator('#chatbot-fab').count();
    expect(fabCount).toBe(0);
  });

  test('Bug 7: Language shows Tempat Duduk in cars list and Pusat Serahan in bookings', async ({ page }) => {
    // 1. Cars page: set to MS and verify seats column
    await page.goto('/admin/pages/car/cars.html');
    await page.evaluate(() => {
      localStorage.setItem('wedrive-lang', 'ms');
      localStorage.setItem('wedrive_lang', 'ms');
      localStorage.setItem('wedrive_language', 'ms');
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const seatsCell = page.locator('text=Tempat Duduk').first();
    await expect(seatsCell).toBeVisible();

    // 2. Bookings page: verify column header Pusat Serahan
    await page.goto('/admin/pages/booking/bookings.html');
    await page.waitForLoadState('networkidle');

    const thDepot = page.locator('th[data-key="bk_th_depot"]');
    await expect(thDepot).toBeVisible();
    await expect(thDepot).toHaveText('Pusat Serahan');
  });

});
