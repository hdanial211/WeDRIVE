const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Operations Dashboard Bilingual Localization Tests', () => {
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
      localStorage.setItem('wedrive-lang', 'ms');
    });
  });

  test('Operations dashboard switches seamlessly between Malay and English', async ({ page }) => {
    await page.goto('/admin/pages/dashboard/operations.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const titleEl = page.locator('[data-key="ops_title"]');
    const refreshBtn = page.locator('[data-key="ops_btn_refresh"]');
    const kpiOnRoad = page.locator('[data-key="ops_kpi_on_road"]');
    const kpiReady = page.locator('[data-key="ops_kpi_ready"]');
    const depotTitle = page.locator('[data-key="ops_depot_title"]');
    const depotUnits = page.locator('[data-key="ops_units_ready"]').first();
    const protoTitle = page.locator('[data-key="ops_proto_title"]');
    const rosterTitle = page.locator('[data-key="ops_roster_title"]');
    const thBooking = page.locator('[data-key="ops_th_booking_id"]');

    // 1. Check initial Malay state
    await expect(titleEl).toHaveText('Status Operasi Hab & Kenderaan');
    await expect(refreshBtn).toHaveText('Muat Semula');
    await expect(kpiOnRoad).toHaveText('Kenderaan Di Jalan Raya');
    await expect(kpiReady).toHaveText('Sedia Untuk Serahan');
    await expect(depotTitle).toHaveText('Kesiapsagaan Hab & Depot Melaka');
    await expect(depotUnits).toHaveText('Unit Sedia');
    await expect(protoTitle).toHaveText('Protokol Pemeriksaan Turnover Kenderaan');
    await expect(rosterTitle).toHaveText('Jadual Serahan & Pulangan Hari Ini');
    await expect(thBooking).toHaveText('ID Tempahan');

    // 2. Click language toggle to switch to English
    const langBtn = page.locator('.lang-toggle');
    await expect(langBtn).toBeVisible();
    await langBtn.click();
    await page.waitForTimeout(500);

    // Verify English state
    await expect(titleEl).toHaveText('Hub & Vehicle Operational Status');
    await expect(refreshBtn).toHaveText('Refresh');
    await expect(kpiOnRoad).toHaveText('Vehicles On The Road');
    await expect(kpiReady).toHaveText('Ready For Handover');
    await expect(depotTitle).toHaveText('Melaka Hub & Depot Readiness');
    await expect(depotUnits).toHaveText('Units Ready');
    await expect(protoTitle).toHaveText('Vehicle Turnover Inspection Protocol');
    await expect(rosterTitle).toHaveText("Today's Handover & Return Schedule");
    await expect(thBooking).toHaveText('Booking ID');

    // 3. Click language toggle again to switch back to Malay
    await langBtn.click();
    await page.waitForTimeout(500);

    // Verify Malay state restored
    await expect(titleEl).toHaveText('Status Operasi Hab & Kenderaan');
    await expect(refreshBtn).toHaveText('Muat Semula');
    await expect(kpiOnRoad).toHaveText('Kenderaan Di Jalan Raya');
    await expect(kpiReady).toHaveText('Sedia Untuk Serahan');
    await expect(depotUnits).toHaveText('Unit Sedia');
  });
});
