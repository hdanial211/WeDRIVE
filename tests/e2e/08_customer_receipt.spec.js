const { test, expect } = require('@playwright/test');

test.describe('Customer Booking Receipt & Digital Invoice E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Inject valid customer session & sample receipt booking
    await page.addInitScript(() => {
      localStorage.setItem('wedrive_session', JSON.stringify({
        id: 'cust-test-101',
        email: 'ahmad@wedrive.my',
        role: 'customer',
        username: 'Ahmad Ali',
        name: 'Ahmad bin Ali',
        timestamp: Date.now()
      }));

      sessionStorage.setItem('receipt_booking', JSON.stringify({
        id: '101',
        booking_id: 'WD-9842',
        car: '2023 BMW 320i M Sport 2.0',
        category: 'Premium Sedan',
        plate: 'WDR 3388',
        customer: 'Ahmad bin Ali',
        email: 'ahmad@wedrive.my',
        phone: '+60 12-345 6789',
        ic: '010515-04-1234',
        license: 'D12345678 (Class D)',
        start_date: '2026-08-25',
        end_date: '2026-08-28',
        days: 3,
        daily: 450,
        total: 1635.00,
        status: 'Completed',
        payment: 'Paid',
        pickup: 'Melaka Sentral HQ',
        created_at: '2026-08-25T10:00:00Z'
      }));
    });
  });

  test('Receipt page renders with verified digital seal, booking ID, and customer info', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 1. Check Verified Digital Seal
    const verifiedBadge = page.locator('#receipt-verified-badge');
    await expect(verifiedBadge).toBeVisible();

    // 2. Check Booking Reference ID
    const bookingId = page.locator('#receipt-booking-id');
    await expect(bookingId).toHaveText(/#WD-9842/);

    // 3. Check Customer Information
    const custName = page.locator('#receipt-cust-name');
    await expect(custName).toHaveText('Ahmad bin Ali');

    const custEmail = page.locator('#receipt-cust-email');
    await expect(custEmail).toHaveText('ahmad@wedrive.my');

    const custLicense = page.locator('#receipt-cust-license');
    await expect(custLicense).toHaveText(/D12345678/);
  });

  test('Vehicle and rental schedule details render accurately', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 1. Vehicle Model & Plate
    const carName = page.locator('#receipt-car-name');
    await expect(carName).toHaveText(/BMW 320i/);

    const carPlate = page.locator('#receipt-car-plate');
    await expect(carPlate).toHaveText('WDR 3388');

    // 2. Schedule & Duration
    const duration = page.locator('#receipt-duration-days');
    await expect(duration).toHaveText(/3 Days/);

    const hub = page.locator('#receipt-location-hub');
    await expect(hub).toHaveText(/Melaka Sentral/);
  });

  test('Financial itemized breakdown displays amounts correctly', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Base amount & total
    const baseAmt = page.locator('#receipt-base-amount');
    await expect(baseAmt).toBeVisible();

    const serviceAmt = page.locator('#receipt-service-amount');
    await expect(serviceAmt).toBeVisible();

    const totalAmt = page.locator('#receipt-total-amount');
    await expect(totalAmt).toBeVisible();
    await expect(totalAmt).toHaveText(/MYR/);
  });

  test('Digital QR handover pass and token are displayed', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const qrImg = page.locator('#receipt-qr-image');
    await expect(qrImg).toBeVisible();

    const token = page.locator('#receipt-security-hash');
    await expect(token).toBeVisible();
    await expect(token).toHaveText(/WD-SEC-/);
  });

  test('Action buttons trigger copy toast and navigate back to My Bookings', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 1. Copy Invoice ID
    const copyBtn = page.locator('#receipt-copy-btn');
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    const toast = page.locator('#receipt-toast');
    await expect(toast).toBeVisible();

    // 2. Check Back to My Bookings button link
    const backBtn = page.locator('#btn-back-my-bookings');
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toHaveAttribute('href', '../my-bookings.html');
  });

  test('Bilingual language switcher updates receipt labels seamlessly', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Switch to Bahasa Melayu
    await page.evaluate(() => {
      if (typeof window.setLanguage === 'function') {
        window.setLanguage('ms');
      } else {
        localStorage.setItem('wedrive_lang', 'ms');
        location.reload();
      }
    });
    await page.waitForTimeout(400);

    // Verify Malay label
    const verifiedBadge = page.locator('#receipt-verified-badge');
    await expect(verifiedBadge).toContainText('DISAHKAN');

    // Switch back to English
    await page.evaluate(() => {
      if (typeof window.setLanguage === 'function') {
        window.setLanguage('en');
      } else {
        localStorage.setItem('wedrive_lang', 'en');
        location.reload();
      }
    });
    await page.waitForTimeout(400);

    await expect(verifiedBadge).toContainText('VERIFIED');
  });
});
