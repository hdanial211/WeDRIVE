const { test, expect } = require('@playwright/test');

test.describe('Admin Session Inactivity Timeout Guardian Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject valid admin session only on admin pages
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

  test('Renders 10m idle warning popup with 1m countdown and allows staying logged in', async ({ page }) => {
    // 1. Open Admin Dashboard
    await page.goto('http://localhost:8088/admin/pages/dashboard/admin.html');
    await page.waitForLoadState('networkidle');

    // 2. Verify Admin Session Guardian is active
    await page.waitForFunction(() => typeof window.WeDriveAdminSession !== 'undefined');

    // 3. Trigger 60s warning modal
    await page.evaluate(() => {
      window.WeDriveAdminSession.testWarning(60);
    });

    // 4. Assert modal presence and styling
    const modal = page.locator('#admin-session-timeout-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveClass(/active/);

    const title = page.locator('#admin-timeout-title');
    await expect(title).toBeVisible();

    const countdown = page.locator('#admin-timeout-countdown');
    await expect(countdown).toBeVisible();
    await expect(countdown).toContainText('01:00');

    // 5. Test "Stay Logged In" button
    const stayBtn = page.locator('#admin-timeout-stay-btn');
    await expect(stayBtn).toBeVisible();
    await stayBtn.click();

    // 6. Assert modal dismisses
    await expect(modal).not.toHaveClass(/active/);
  });

  test('Auto logs out and redirects to login page when countdown reaches 0', async ({ page }) => {
    // 1. Open Admin Dashboard
    await page.goto('http://localhost:8088/admin/pages/dashboard/admin.html');
    await page.waitForLoadState('networkidle');

    // 2. Verify Admin Session Guardian is active
    await page.waitForFunction(() => typeof window.WeDriveAdminSession !== 'undefined');

    // 3. Trigger short 2-second timeout
    await page.evaluate(() => {
      window.WeDriveAdminSession.testWarning(2);
    });

    // 4. Wait for countdown to hit 0 and trigger redirect
    await page.waitForURL(/account\/pages\/login\/login\.html\?session_expired=expired/, { timeout: 8000 });

    // 5. Assert session was removed
    const session = await page.evaluate(() => localStorage.getItem('wedrive_session'));
    expect(session).toBeNull();
  });
});
