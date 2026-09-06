const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE AI Key Vault & Unified HQ Location Tests', () => {

  test('Admin AI Key Vault renders 4 dedicated slots with auto-detection', async ({ page }) => {
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

    // 1. Navigate to AI Key Vault
    await page.goto('/admin/pages/ai/api-keys.html');
    await page.waitForLoadState('networkidle');

    // 2. Verify Title and 4 Cards
    await expect(page.locator('h1')).toContainText('Pengurusan Kunci API AI');
    await expect(page.locator('#card-slot-1')).toBeVisible();
    await expect(page.locator('#card-slot-2')).toBeVisible();
    await expect(page.locator('#card-slot-3')).toBeVisible();
    await expect(page.locator('#card-slot-4')).toBeVisible();

    // 3. Test Auto-detection for Google Gemini free key
    const coreInput = page.locator('#key-slot-1');
    await coreInput.fill('AIzaSyDdummyKeyGoogleFree1234567890');
    await expect(page.locator('#badge-slot-1')).toContainText('Google Gemini (Percuma)');

    // 4. Test Auto-detection for OpenRouter free key
    const eventInput = page.locator('#key-slot-2');
    await eventInput.fill('sk-or-v1-abcdef0123456789dummyKeyFree');
    await expect(page.locator('#badge-slot-2')).toContainText('OpenRouter (Free Tier)');

    // 5. Test Auto-detection for Groq free key
    const chatInput = page.locator('#key-slot-3');
    await chatInput.fill('gsk_test1234567890abcdef');
    await expect(page.locator('#badge-slot-3')).toContainText('Groq Cloud (Laju & Percuma)');

    // 6. Test 360 Ingestion link parser
    const link360Input = page.locator('#test-360-url');
    await link360Input.fill('https://viewer.spincar.com/demo/honda-civic-fe/360');
    await page.locator('button:has-text("Sedut")').first().click();
    await expect(page.locator('#result-360-ingest')).toBeVisible();
    await expect(page.locator('#result-360-ingest')).toContainText('Pautan Sah Dikesan');
  });

  test('Admin Settings page unifies pick-up & return to single HQ location', async ({ page }) => {
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

    await page.goto('/admin/pages/setting/settings.html');
    await page.waitForLoadState('networkidle');

    // Verify Single HQ Location input and penalty
    await expect(page.locator('#st-address')).toBeVisible();
    await expect(page.locator('#st-hours')).toBeVisible();
    await expect(page.locator('#st-late-fee')).toBeVisible();

    // Verify Quick Banner to AI Vault
    await expect(page.locator('a[href="../ai/api-keys.html"]')).toBeVisible();
  });

  test('Add Car page enforces Single HQ Location and 360 Studio uploads', async ({ page }) => {
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

    await page.goto('/admin/pages/car/add-car.html');
    await page.waitForLoadState('networkidle');

    // Verify HQ Location is locked
    const locationInput = page.locator('#car-location');
    await expect(locationInput).toBeVisible();
    await expect(locationInput).toHaveAttribute('readonly', '');
    await expect(locationInput).toHaveValue(/Pusat Operasi Utama WeDRIVE \(HQ Melaka\)/);

    // Verify 360 Studio Section
    await expect(page.locator('#card-360-studio')).toBeVisible();
    await expect(page.locator('#exterior-files-input')).toBeAttached();
    await expect(page.locator('#ai-360-link-input')).toBeVisible();

    // Verify Live Preview tabs for 360
    await expect(page.locator('#tab-prev-exterior')).toBeVisible();
    await expect(page.locator('#tab-prev-interior')).toBeVisible();
  });

  test('Customer Browse Cars displays 360 View badge only on cars with 360 assets', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('wedrive_session', JSON.stringify({
        id: 'cust-test-101',
        email: 'ahmad@wedrive.my',
        role: 'customer',
        username: 'Ahmad Ali',
        name: 'Ahmad bin Ali',
        timestamp: Date.now()
      }));
    });

    await page.goto('/customer/pages/browse-cars/browse-cars.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Check cars list
    const cards = page.locator('.car-card');
    await expect(cards.first()).toBeVisible();

    // At least one car has 360 badge
    const badge360 = page.locator('.badge-360').first();
    await expect(badge360).toBeVisible();
    await expect(badge360).toContainText('360° View');
  });

});
