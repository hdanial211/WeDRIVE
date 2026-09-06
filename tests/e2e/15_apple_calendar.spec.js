const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Apple HIG Calendar & Unified Datepicker Tests', () => {
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

  test('Admin Calendar renders 2-Column Bento Layout with strict 1:1 circular dates and zero oval distortion', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/admin/pages/calendar/calendar.html');
    await page.waitForLoadState('networkidle');

    // 1. Verify 2-Column Bento layout structure
    const bentoLayout = page.locator('.cal-bento-layout');
    await expect(bentoLayout).toBeVisible();

    const pickerCard = page.locator('.cal-picker-card');
    await expect(pickerCard).toBeVisible();

    const agendaCard = page.locator('#cal-agenda-panel');
    await expect(agendaCard).toBeVisible();

    // 2. Verify navigation buttons are strict 1:1 circles
    const prevBtn = page.locator('#cal-prev');
    const nextBtn = page.locator('#cal-next');
    await expect(prevBtn).toBeVisible();
    await expect(nextBtn).toBeVisible();

    const prevBox = await prevBtn.boundingBox();
    expect(prevBox).not.toBeNull();
    expect(Math.abs(prevBox.width - prevBox.height)).toBeLessThan(1.0);

    // 3. Verify calendar day cells are strict 1:1 circles
    const dayButtons = page.locator('.apple-cal-day');
    const count = await dayButtons.count();
    expect(count).toBeGreaterThanOrEqual(28);

    const firstDay = dayButtons.first();
    const dayBox = await firstDay.boundingBox();
    expect(dayBox).not.toBeNull();
    expect(Math.abs(dayBox.width - dayBox.height)).toBeLessThan(1.0);

    // 4. Verify today cell is selected and agenda panel has content
    const selectedDay = page.locator('.apple-cal-day.selected');
    await expect(selectedDay).toBeVisible();

    const agendaTitle = page.locator('#cal-agenda-title');
    await expect(agendaTitle).not.toBeEmpty();

    const agendaBadge = page.locator('#cal-agenda-badge');
    await expect(agendaBadge).toBeVisible();
  });

  test('Clicking dates in Admin Calendar updates Agenda Panel reactively and Today button resets selection', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/admin/pages/calendar/calendar.html');
    await page.waitForLoadState('networkidle');

    // Find day button for day 15 and click it
    const day15 = page.locator('.apple-cal-day[data-date$="-15"]');
    await expect(day15).toBeVisible();
    await day15.click();

    // Verify day 15 is now selected
    await expect(day15).toHaveClass(/selected/);
    const badgeText = await page.locator('#cal-agenda-badge-text').textContent();
    expect(badgeText).toContain('15');

    // Click "Hari Ini" button to reset
    const todayBtn = page.locator('#cal-today-btn');
    await expect(todayBtn).toBeVisible();
    await todayBtn.click();

    // Verify today is selected again
    const todayCell = page.locator('.apple-cal-day.today');
    await expect(todayCell).toHaveClass(/selected/);
  });

  test('New Booking page initializes unified paired datepickers with strict 1:1 circular dates', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/admin/pages/booking/new-booking.html');
    await page.waitForLoadState('networkidle');

    const pickupInput = page.locator('#nb-date-pickup');
    const returnInput = page.locator('#nb-date-return');

    await expect(pickupInput).toBeVisible();
    await expect(returnInput).toBeVisible();

    // Open pickup flatpickr popup
    await pickupInput.click();
    const flatpickrCalendar = page.locator('.flatpickr-calendar.open');
    await expect(flatpickrCalendar).toBeVisible();

    // Verify popup day items are circular 1:1
    const dayItem = flatpickrCalendar.locator('.flatpickr-day:not(.flatpickr-disabled)').first();
    const box = await dayItem.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box.width - box.height)).toBeLessThan(1.0);
  });
});
