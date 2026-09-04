const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Admin Dedicated Sidebar Pages Architecture (v5.4.0)', () => {
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

  test('Dashboard operations page is a dedicated HTML page with active sidebar highlight', async ({ page }) => {
    await page.goto('/admin/pages/dashboard/operations.html');
    await expect(page).toHaveTitle(/Operations Status|Status Operasi|WeDRIVE/i);

    const sidebar = page.locator('#admin-sidebar');
    await expect(sidebar).toBeVisible();

    const opsLink = sidebar.locator('a[data-page="operations"]');
    await expect(opsLink).toBeVisible();
    await expect(opsLink).toHaveClass(/active/);
    await expect(opsLink).toHaveAttribute('href', /.*dashboard\/operations\.html$/);
  });

  test('Car module has dedicated pages for Available, Rented, and Add Car', async ({ page }) => {
    // 1. Available Cars
    await page.goto('/admin/pages/car/available-cars.html');
    await expect(page).toHaveTitle(/Available Cars|Kenderaan Tersedia|WeDRIVE/i);
    const availLink = page.locator('#admin-sidebar a[data-page="car-available"]');
    await expect(availLink).toHaveClass(/active/);
    await expect(availLink).toHaveAttribute('href', /.*car\/available-cars\.html$/);

    // 2. Rented Cars
    await page.goto('/admin/pages/car/rented-cars.html');
    await expect(page).toHaveTitle(/Rented Cars|Sedang Disewa|WeDRIVE/i);
    const rentedLink = page.locator('#admin-sidebar a[data-page="car-rented"]');
    await expect(rentedLink).toHaveClass(/active/);
    await expect(rentedLink).toHaveAttribute('href', /.*car\/rented-cars\.html$/);

    // 3. Add Car
    await page.goto('/admin/pages/car/add-car.html');
    await expect(page).toHaveTitle(/Add New Car|Tambah Kereta|WeDRIVE/i);
    const addCarLink = page.locator('#admin-sidebar a[data-page="car-add"]');
    await expect(addCarLink).toHaveClass(/active/);
    await expect(addCarLink).toHaveAttribute('href', /.*car\/add-car\.html$/);
  });

  test('Booking module has dedicated pages for Active Bookings and Create Booking', async ({ page }) => {
    // 1. Active Bookings
    await page.goto('/admin/pages/booking/active-bookings.html');
    await expect(page).toHaveTitle(/Active Bookings|Tempahan Aktif|WeDRIVE/i);
    const activeBkLink = page.locator('#admin-sidebar a[data-page="bookings-active"]');
    await expect(activeBkLink).toHaveClass(/active/);
    await expect(activeBkLink).toHaveAttribute('href', /.*booking\/active-bookings\.html$/);

    // 2. New Booking
    await page.goto('/admin/pages/booking/new-booking.html');
    await expect(page).toHaveTitle(/Create Booking|Cipta Tempahan|WeDRIVE/i);
    const newBkLink = page.locator('#admin-sidebar a[data-page="bookings-add"]');
    await expect(newBkLink).toHaveClass(/active/);
    await expect(newBkLink).toHaveAttribute('href', /.*booking\/new-booking\.html$/);
  });

  test('Customer module has dedicated page for License Verifications', async ({ page }) => {
    await page.goto('/admin/pages/customer/verifications.html');
    await expect(page).toHaveTitle(/License Verifications|Pengesahan Lesen|WeDRIVE/i);
    const verifLink = page.locator('#admin-sidebar a[data-page="customers-pending"]');
    await expect(verifLink).toHaveClass(/active/);
    await expect(verifLink).toHaveAttribute('href', /.*customer\/verifications\.html$/);
  });

  test('Report module has dedicated page for Export Data Reports', async ({ page }) => {
    await page.goto('/admin/pages/report/export-reports.html');
    await expect(page).toHaveTitle(/Export Data Reports|Eksport Laporan Data|WeDRIVE/i);
    const exportLink = page.locator('#admin-sidebar a[data-page="reports-export"]');
    await expect(exportLink).toHaveClass(/active/);
    await expect(exportLink).toHaveAttribute('href', /.*report\/export-reports\.html$/);
  });

  test('Clicking between dedicated sidebar links smoothly navigates without query params', async ({ page }) => {
    await page.goto('/admin/pages/car/cars.html');

    // Click on Kenderaan Tersedia
    await page.click('#admin-sidebar a[data-page="car-available"]');
    await expect(page).toHaveURL(/.*\/admin\/pages\/car\/available-cars\.html$/);

    // Click on Sedang Disewa
    await page.click('#admin-sidebar a[data-page="car-rented"]');
    await expect(page).toHaveURL(/.*\/admin\/pages\/car\/rented-cars\.html$/);

    // Click on Tambah Kereta Baharu
    await page.click('#admin-sidebar a[data-page="car-add"]');
    await expect(page).toHaveURL(/.*\/admin\/pages\/car\/add-car\.html$/);

    // Click on Semua Kenderaan
    await page.click('#admin-sidebar a[data-page="car-all"]');
    await expect(page).toHaveURL(/.*\/admin\/pages\/car\/cars\.html$/);
  });
});
