const { test, expect } = require('@playwright/test');

test.describe('Admin Bookings Date Range Filter Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject valid admin session so Auth Guard permits access
    await page.addInitScript(() => {
      if (window.location.pathname.includes('/admin/')) {
        localStorage.setItem('wedrive_session', JSON.stringify({
          id: 'admin-test-id',
          email: 'admin@wedrive.my',
          role: 'admin',
          username: 'Admin Test',
          name: 'Admin Test',
          timestamp: Date.now()
        }));
      }
    });
  });

  test('Custom date range picker row is hidden by default and only toggles when Custom Range chip is clicked', async ({ page }) => {
    // 1. Open Admin Bookings Page
    await page.goto('http://localhost:8088/admin/pages/booking/bookings.html');
    await page.waitForLoadState('networkidle');

    const customDateRow = page.locator('#custom-date-row');
    const chipAll = page.locator('#date-chip-all');
    const chipMonth = page.locator('#date-chip-month');
    const chipCustom = page.locator('#date-chip-custom');

    // 2. Assert initial state: All Time is active, Custom Date Row is hidden
    await expect(chipAll).toHaveClass(/active/);
    await expect(customDateRow).toBeHidden();

    // 3. Click Custom Range -> Custom Date Row becomes visible
    await chipCustom.click();
    await expect(chipCustom).toHaveClass(/active/);
    await expect(chipAll).not.toHaveClass(/active/);
    await expect(customDateRow).toBeVisible();

    // 4. Click This Month -> Custom Date Row is hidden
    await chipMonth.click();
    await expect(chipMonth).toHaveClass(/active/);
    await expect(chipCustom).not.toHaveClass(/active/);
    await expect(customDateRow).toBeHidden();

    // 5. Click Custom Range again -> Custom Date Row becomes visible
    await chipCustom.click();
    await expect(chipCustom).toHaveClass(/active/);
    await expect(customDateRow).toBeVisible();

    // 6. Click All Time -> Custom Date Row is hidden
    await chipAll.click();
    await expect(chipAll).toHaveClass(/active/);
    await expect(customDateRow).toBeHidden();
  });
});
