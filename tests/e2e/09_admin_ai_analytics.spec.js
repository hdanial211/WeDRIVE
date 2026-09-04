const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Admin AI Data Analytics & Contextual Navigation Architecture', () => {
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

  test('Dedicated AI Intelligence module loads with contextual AI sidebar and 6-module Topbar', async ({ page }) => {
    // Navigate directly to the AI Analytics page
    await page.goto('/admin/pages/analytics/analytics.html');
    await expect(page).toHaveTitle(/Analisis Data AI|AI Data Analysis|WeDRIVE/i);

    // 1. Verify Topbar has 6 Main Modules
    const topbar = page.locator('#wedrive-navbar');
    await expect(topbar).toBeVisible();

    const mainDash = topbar.locator('#nl-dash');
    const mainCars = topbar.locator('#nl-cars');
    const mainBookings = topbar.locator('#nl-bookings');
    const mainUsers = topbar.locator('#nl-users');
    const mainReports = topbar.locator('#nl-reports');
    const mainAI = topbar.locator('#nl-ai');

    await expect(mainDash).toBeVisible();
    await expect(mainCars).toBeVisible();
    await expect(mainBookings).toBeVisible();
    await expect(mainUsers).toBeVisible();
    await expect(mainReports).toBeVisible();
    await expect(mainAI).toBeVisible();

    // AI icon is active on analytics page
    await expect(mainAI).toHaveClass(/active/);
    await expect(mainCars).not.toHaveClass(/active/);
    await expect(mainDash).not.toHaveClass(/active/);

    // 2. Verify Contextual Sidebar (AI Suite)
    const sidebar = page.locator('#admin-sidebar');
    await expect(sidebar).toBeVisible();

    const analyticsSidebarLink = sidebar.locator('a[data-page="analytics"]');
    const chatbotSidebarLink = sidebar.locator('a[data-page="chatbot-settings"]');
    const marketingSidebarLink = sidebar.locator('a[data-page="marketing"]');

    await expect(analyticsSidebarLink).toBeVisible();
    await expect(chatbotSidebarLink).toBeVisible();
    await expect(marketingSidebarLink).toBeVisible();

    // Sidebar active item must be Analytics
    await expect(analyticsSidebarLink).toHaveClass(/active/);

    // 3. Verify AI Analytics Bento Components
    const kpiAccuracy = page.locator('.stats-grid .stat-card').first();
    await expect(kpiAccuracy).toBeVisible();
    await expect(page.locator('#ai-accuracy')).toContainText('94.6%');
    await expect(page.locator('#ai-surge')).toContainText('+34%');

    // Verify time horizon controls
    const btn7d = page.locator('.segmented-btn[data-horizon="7d"]');
    const btn30d = page.locator('.segmented-btn[data-horizon="30d"]');
    await expect(btn7d).toBeVisible();
    await expect(btn30d).toBeVisible();

    // Click 30d filter and verify glider activation
    await btn30d.click();
    await expect(btn30d).toHaveClass(/active/);

    // 4. Verify Contextual Navigation: Switch to Cars module via Topbar
    await mainCars.click();
    await expect(page).toHaveURL(/.*\/admin\/pages\/car\/cars\.html/);

    // On Cars page, Topbar Cars icon is active
    const activeCarLink = page.locator('#wedrive-navbar #nl-cars');
    await expect(activeCarLink).toHaveClass(/active/);
    await expect(mainAI).not.toHaveClass(/active/);

    // On Cars page, Sidebar dynamically shifts to Cars sub-tools
    const carSidebar = page.locator('#admin-sidebar');
    const carAllLink = carSidebar.locator('a[data-page="car-all"]');
    const carAvailableLink = carSidebar.locator('a[data-page="car-available"]');
    const carRentedLink = carSidebar.locator('a[data-page="car-rented"]');
    const carAddLink = carSidebar.locator('a[data-page="car-add"]');

    await expect(carAllLink).toBeVisible();
    await expect(carAvailableLink).toBeVisible();
    await expect(carRentedLink).toBeVisible();
    await expect(carAddLink).toBeVisible();

    // 5. Test sidebar navigation: Kenderaan Tersedia has its own dedicated page
    await carAvailableLink.click();
    await expect(page).toHaveURL(/.*\/admin\/pages\/car\/available-cars\.html/);
  });
});

