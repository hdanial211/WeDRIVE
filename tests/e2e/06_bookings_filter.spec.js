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
    await page.setViewportSize({ width: 1440, height: 900 });
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
    await page.screenshot({ path: '/Users/hakim/.gemini/antigravity-ide/brain/73ad9e13-3aba-46b0-95d2-de16ccb8eb70/bookings_date_range_balanced.png' });

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

  test('Bookings table implements 10-records-per-page Apple pagination with numbered buttons', async ({ page }) => {
    await page.goto('http://localhost:8088/admin/pages/booking/bookings.html');
    await page.waitForLoadState('networkidle');

    const pagination = page.locator('#bookings-pagination');
    await expect(pagination).toBeVisible();

    const info = pagination.locator('.apple-pagination-info');
    await expect(info).toBeVisible();
    await expect(info).toContainText(/Memaparkan|Showing/i);

    // Assert that page 1 button is active
    const page1Btn = pagination.locator('.apple-page-btn', { hasText: /^1$/ });
    await expect(page1Btn).toHaveClass(/active/);

    // Count rows in tbody - should not exceed 10
    const rows = page.locator('#bookings-tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeLessThanOrEqual(10);

    // If more than 10 records exist, page 2 button should be clickable
    const page2Btn = pagination.locator('.apple-page-btn', { hasText: /^2$/ });
    if (await page2Btn.count() > 0) {
      await page2Btn.click();
      await expect(page2Btn).toHaveClass(/active/);
      await expect(page1Btn).not.toHaveClass(/active/);
      const rowsP2 = page.locator('#bookings-tbody tr');
      expect(await rowsP2.count()).toBeLessThanOrEqual(10);
    }
  });
});

