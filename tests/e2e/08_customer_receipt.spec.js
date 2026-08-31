const { test, expect } = require('@playwright/test');

test.describe('Customer Booking Receipt & Official Corporate Tax Invoice E2E Tests', () => {
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
        booking_id: 'BK-2026-9281',
        car: '2026 Honda Civic 1.5 VTEC Turbo',
        category: 'Premium Sedan (5 Seats • Automatic)',
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
        total: 1636.20,
        status: 'Completed',
        payment: 'Paid',
        pickup: 'Melaka Sentral HQ',
        created_at: '2026-08-25T10:00:00Z'
      }));
    });
  });

  test('Receipt page renders with verified digital seal, invoice ID, and customer info', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // 1. Check Verified Payment Badge
    const verifiedBadge = page.locator('#receipt-verified-badge');
    await expect(verifiedBadge).toBeVisible();
    await expect(verifiedBadge).toHaveText(/PAID/i);

    // 2. Check Invoice & Booking Reference IDs
    const invoiceId = page.locator('#receipt-invoice-id');
    await expect(invoiceId).toHaveText(/WD-INV-2026-/);

    const bookingRef = page.locator('#receipt-booking-ref');
    await expect(bookingRef).toHaveText(/BK-2026-9281/);

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
    await expect(carName).toHaveText(/Honda Civic/);

    const carPlate = page.locator('#receipt-car-plate');
    await expect(carPlate).toHaveText('WDR 3388');

    // 2. Schedule & Duration
    const duration = page.locator('#receipt-duration-pill');
    await expect(duration).toHaveText(/3 Days/);

    const hub = page.locator('#receipt-pickup-hub');
    await expect(hub).toHaveText(/Melaka Sentral/);
  });

  test('Statutory accounting table displays line items and amounts correctly', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // Rental amount & total
    const rentalAmt = page.locator('#receipt-table-rental-amt');
    await expect(rentalAmt).toBeVisible();
    await expect(rentalAmt).toHaveText(/1,350.00/);

    const taxAmt = page.locator('#receipt-table-tax-amt');
    await expect(taxAmt).toBeVisible();
    await expect(taxAmt).toHaveText(/1.20/);

    const totalAmt = page.locator('#receipt-total-amount');
    await expect(totalAmt).toBeVisible();
    await expect(totalAmt).toHaveText(/1,636.20/);

    // Amount in words
    const wordsVal = page.locator('#receipt-amount-words-val');
    await expect(wordsVal).toBeVisible();
    await expect(wordsVal).toHaveText(/RINGGIT MALAYSIA/i);
  });

  test('Digital QR handover pass, security token, and authorized signatory are displayed', async ({ page }) => {
    await page.goto('http://localhost:8088/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    const qrImg = page.locator('#receipt-qr-image');
    await expect(qrImg).toBeVisible();

    const token = page.locator('#receipt-security-hash');
    await expect(token).toBeVisible();
    await expect(token).toHaveText(/WD-SEC-/);

    const signHash = page.locator('#receipt-sign-hash');
    await expect(signHash).toBeVisible();
    await expect(signHash).toHaveText(/SHA-256:/);
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

    // Verify Malay label in paid badge
    const verifiedBadge = page.locator('#receipt-verified-badge');
    await expect(verifiedBadge).toContainText('DIBAYAR');

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

    await expect(verifiedBadge).toContainText('PAID');
  });
});

