const { test, expect } = require('@playwright/test');

test.describe('Customer My Bookings Portal E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject valid customer session
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
  });

  test('My Bookings page renders with Bento stat metrics and active rental spotlight', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/my-bookings.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 1. Verify Page Title
    const title = page.locator('h1.utility-title');
    await expect(title).toBeVisible();

    // 2. Verify Stats Grid (4 Bento Cards)
    const statCards = page.locator('.mybk-stat-card');
    await expect(statCards).toHaveCount(4);

    const statTotal = page.locator('#stat-total');
    await expect(statTotal).not.toHaveText('--');

    // 3. Verify Active Spotlight is rendered
    const activeSpotlight = page.locator('#active-rental-spotlight');
    await expect(activeSpotlight).toBeVisible();

    // 4. Verify Copy Booking ID chip
    const activeRefBtn = page.locator('#active-ref-btn');
    await expect(activeRefBtn).toBeVisible();
    await activeRefBtn.click();

    // Verify Toast appearance
    const toast = page.locator('#mybk-toast');
    await expect(toast).toBeVisible();
  });

  test('Segmented filter tabs switch correctly (All, Active, Upcoming, Completed, Cancelled)', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/my-bookings.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const tabAll = page.locator('#tab-all');
    const tabActive = page.locator('#tab-active');
    const tabUpcoming = page.locator('#tab-upcoming');
    const tabCompleted = page.locator('#tab-completed');
    const tabCancelled = page.locator('#tab-cancelled');

    // 1. Initial State: All Bookings is active
    await expect(tabAll).toHaveClass(/active/);

    // 2. Click Active tab
    await tabActive.click();
    await expect(tabActive).toHaveClass(/active/);
    await expect(tabAll).not.toHaveClass(/active/);

    // 3. Click Upcoming tab
    await tabUpcoming.click();
    await expect(tabUpcoming).toHaveClass(/active/);

    // 4. Click Completed tab
    await tabCompleted.click();
    await expect(tabCompleted).toHaveClass(/active/);

    // 5. Click Cancelled tab
    await tabCancelled.click();
    await expect(tabCancelled).toHaveClass(/active/);

    // 6. Return to All Bookings
    await tabAll.click();
    await expect(tabAll).toHaveClass(/active/);
  });

  test('Search input filters bookings list in real time', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/my-bookings.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const searchInput = page.locator('#mybk-search-input');
    await expect(searchInput).toBeVisible();

    // Type query matching specific car
    await searchInput.fill('BMW');
    await page.waitForTimeout(200);

    const cards = page.locator('.mybk-card');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);

    // Type nonexistent query
    await searchInput.fill('NonExistentVehicleXYZ');
    await page.waitForTimeout(200);

    const emptyState = page.locator('#mybk-empty-state');
    await expect(emptyState).toBeVisible();

    // Clear search
    const clearBtn = page.locator('#mybk-search-clear');
    await expect(clearBtn).toBeVisible();
    await clearBtn.click();
    await expect(emptyState).toBeHidden();
  });

  test('Clicking Details opens Apple Sheet Modal dialog with complete breakdown', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/my-bookings.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Click Details button on spotlight or first card
    const detailsBtn = page.locator('#active-btn-details, .mybk-card .mybk-btn-secondary').first();
    await expect(detailsBtn).toBeVisible();
    await detailsBtn.click();

    // Modal should be active
    const modal = page.locator('#modal-details');
    await expect(modal).toHaveClass(/active/);
    await expect(modal.locator('.mybk-modal-title')).toBeVisible();

    // Close modal
    const closeBtn = modal.locator('.mybk-modal-close');
    await closeBtn.click();
    await expect(modal).not.toHaveClass(/active/);
  });

  test('Receipt action navigates to receipt page with session persistence', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/my-bookings.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Switch to Completed tab
    const tabCompleted = page.locator('#tab-completed');
    await tabCompleted.click();
    await page.waitForTimeout(300);

    // Click Receipt button
    const receiptBtn = page.locator('.mybk-card .mybk-btn-secondary').filter({ hasText: /Receipt/i }).first();
    await expect(receiptBtn).toBeVisible();
    await receiptBtn.click();

    // Should navigate to receipt/receipt.html
    await page.waitForURL(/receipt\.html/);
    await expect(page.locator('#receipt-booking-id, #receipt-invoice-id').first()).toBeVisible();
  });

  test('Bilingual toggle (EN <-> MS) updates labels smoothly without reload', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/my-bookings.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const langToggle = page.locator('.lang-toggle, #lang-toggle').first();
    await expect(langToggle).toBeVisible();

    // Switch language to MS
    await langToggle.click();
    await page.waitForTimeout(400);

    const titleText = await page.locator('.utility-title').textContent();
    expect(titleText).toContain('Tempahan');

    // Switch back to EN
    await langToggle.click();
    await page.waitForTimeout(400);

    const titleTextEN = await page.locator('.utility-title').textContent();
    expect(titleTextEN).toContain('Bookings');
  });
});
