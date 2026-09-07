const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Full System Bilingual Parity (EN & MS) Tests', () => {

  test('Car Details page toggles between English and Malay seamlessly', async ({ page }) => {
    await page.goto('/customer/pages/car-details/car-details.html?id=bmw-320i-2023');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const langBtn = page.locator('.lang-toggle').first();
    await expect(langBtn).toBeVisible();

    // Ensure MS mode
    await page.evaluate(() => {
      localStorage.setItem('wedrive_language', 'ms');
      if (window.WeDriveLang && window.WeDriveLang.applyLanguage) {
        window.WeDriveLang.applyLanguage('ms');
      }
    });
    await page.waitForTimeout(300);

    const specTitle = page.locator('[data-key="cd_tech_specs"]');
    await expect(specTitle).toHaveText('Spesifikasi Teknikal');

    const bookBtn = page.locator('[data-key="cd_btn_book_now"]');
    await expect(bookBtn).toHaveText('Teruskan Tempahan');

    // Click toggle to switch to English
    await langBtn.click();
    await page.waitForTimeout(400);

    await expect(specTitle).toHaveText('Technical Specifications');
    await expect(bookBtn).toHaveText('Proceed to Booking');
  });

  test('Booking wizard page toggles between English and Malay', async ({ page }) => {
    await page.goto('/customer/pages/car-details/booking/booking.html?id=bmw-320i-2023');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const langBtn = page.locator('.lang-toggle').first();
    await expect(langBtn).toBeVisible();

    // Switch to MS
    await page.evaluate(() => {
      localStorage.setItem('wedrive_language', 'ms');
      if (window.WeDriveLang && window.WeDriveLang.applyLanguage) {
        window.WeDriveLang.applyLanguage('ms');
      }
    });
    await page.waitForTimeout(300);

    const stepDates = page.locator('[data-key="book_step_dates"]');
    await expect(stepDates).toHaveText('Tarikh & Lokasi');

    const stepSummary = page.locator('[data-key="book_step_summary"]');
    await expect(stepSummary).toHaveText('Ringkasan Sewaan');

    // Toggle to EN
    await langBtn.click();
    await page.waitForTimeout(400);

    await expect(stepDates).toHaveText('Dates & Location');
    await expect(stepSummary).toHaveText('Rental Summary');
  });

  test('Payment page toggles between English and Malay', async ({ page }) => {
    await page.goto('/customer/pages/car-details/booking/payment/payment.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const langBtn = page.locator('.lang-toggle').first();
    await expect(langBtn).toBeVisible();

    // Set MS
    await page.evaluate(() => {
      localStorage.setItem('wedrive_language', 'ms');
      if (window.WeDriveLang && window.WeDriveLang.applyLanguage) {
        window.WeDriveLang.applyLanguage('ms');
      }
    });
    await page.waitForTimeout(300);

    const payTitle = page.locator('[data-key="cust_pay_title"]');
    await expect(payTitle).toHaveText('Pembayaran & Pengesahan');

    const payBtn = page.locator('[data-key="cust_pay_btn"]');
    await expect(payBtn).toHaveText('Bayar Deposit & Sahkan Tempahan');

    // Toggle to EN
    await langBtn.click();
    await page.waitForTimeout(400);

    await expect(payTitle).toHaveText('Payment & Confirmation');
    await expect(payBtn).toHaveText('Pay Deposit & Confirm');
  });

  test('Booking Confirmed page toggles between English and Malay', async ({ page }) => {
    await page.goto('/customer/pages/car-details/booking/payment/booking-confirmed/booking-confirmed.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const langBtn = page.locator('.lang-toggle').first();
    await expect(langBtn).toBeVisible();

    // Set MS
    await page.evaluate(() => {
      localStorage.setItem('wedrive_language', 'ms');
      if (window.WeDriveLang && window.WeDriveLang.applyLanguage) {
        window.WeDriveLang.applyLanguage('ms');
      }
    });
    await page.waitForTimeout(300);

    const confTitle = page.locator('[data-key="cust_conf_title"]');
    await expect(confTitle).toHaveText('Tempahan Disahkan!');

    const summaryLbl = page.locator('[data-key="cust_conf_summary"]');
    await expect(summaryLbl).toHaveText('Ringkasan Tempahan');

    // Toggle to EN
    await langBtn.click();
    await page.waitForTimeout(400);

    await expect(confTitle).toHaveText('Booking Confirmed!');
    await expect(summaryLbl).toHaveText('Booking Summary');
  });

  test('Receipt page toggles between English and Malay', async ({ page }) => {
    await page.goto('/customer/pages/my-bookings/receipt/receipt.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const langBtn = page.locator('.lang-toggle').first();
    await expect(langBtn).toBeVisible();

    // Set MS
    await page.evaluate(() => {
      localStorage.setItem('wedrive_language', 'ms');
      if (window.WeDriveLang && window.WeDriveLang.applyLanguage) {
        window.WeDriveLang.applyLanguage('ms');
      }
    });
    await page.waitForTimeout(300);

    const receiptTitle = page.locator('[data-key="cust_rcpt_title"]');
    await expect(receiptTitle).toHaveText('Resit Pembayaran Rasmi');

    // Toggle to EN
    await langBtn.click();
    await page.waitForTimeout(400);

    await expect(receiptTitle).toHaveText('Official Payment Receipt');
  });

  test('Admin Add Car page toggles between English and Malay', async ({ page }) => {
    await page.goto('/admin/pages/car/add-car.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const langBtn = page.locator('.lang-toggle').first();
    await expect(langBtn).toBeVisible();

    // Set MS
    await page.evaluate(() => {
      localStorage.setItem('wedrive_language', 'ms');
      if (window.WeDriveLang && window.WeDriveLang.applyLanguage) {
        window.WeDriveLang.applyLanguage('ms');
      }
    });
    await page.waitForTimeout(300);

    const stepSpec = page.locator('[data-key="ac_step1_title"]');
    await expect(stepSpec).toHaveText('Spesifikasi Kenderaan');

    // Toggle to EN
    await langBtn.click();
    await page.waitForTimeout(400);

    await expect(stepSpec).toHaveText('Vehicle Specifications');
  });

  test('404 Error page toggles between English and Malay', async ({ page }) => {
    await page.goto('/shared/pages/error/404.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(400);

    const langBtn = page.locator('.lang-toggle').first();
    await expect(langBtn).toBeVisible();

    // Set MS
    await page.evaluate(() => {
      localStorage.setItem('wedrive_language', 'ms');
      if (window.WeDriveLang && window.WeDriveLang.applyLanguage) {
        window.WeDriveLang.applyLanguage('ms');
      }
    });
    await page.waitForTimeout(300);

    const errTitle = page.locator('[data-key="err_404_title"]');
    await expect(errTitle).toHaveText('Nampaknya anda tersilap simpang!');

    // Toggle to EN
    await langBtn.click();
    await page.waitForTimeout(400);

    await expect(errTitle).toHaveText('Looks like you took a wrong turn!');
  });
});
