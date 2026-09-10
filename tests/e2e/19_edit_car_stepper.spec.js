const { test, expect } = require('@playwright/test');

test.describe('WeDRIVE Edit Car Modular Stepper & Dynamic 360 Auto-Detection', () => {

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

  test('Car inventory cards feature exactly ONE action button (Urus) and dynamic 360 badge', async ({ page }) => {
    await page.goto('/admin/pages/car/cars.html');
    await page.waitForLoadState('networkidle');

    const cards = page.locator('.apple-car-showcase-card, .car-card');
    await expect(cards.first()).toBeVisible();

    const perincianBtns = page.locator('button:has-text("Perincian"), a:has-text("Perincian")');
    await expect(perincianBtns).toHaveCount(0);

    const urusBtns = page.locator('button:has-text("Urus"), a:has-text("Urus")');
    const urusCount = await urusBtns.count();
    expect(urusCount).toBeGreaterThan(0);

    const badge360 = page.locator('.badge-360:has-text("360° View")');
    await expect(badge360.first()).toBeVisible();
  });

  test('car-detail.html provides Sunting Kenderaan pill button that opens Step 1', async ({ page }) => {
    await page.goto('/admin/pages/car/car-detail/car-detail.html?id=1');
    await page.waitForLoadState('networkidle');

    const modal = page.locator('#edit-car-modal');
    await expect(modal).toHaveCount(0);

    const editBtn = page.locator('button[onclick="editDetails()"], button:has-text("Sunting Kenderaan"), button:has-text("Edit Vehicle")').first();
    await expect(editBtn).toBeVisible();

    await editBtn.click();
    await page.waitForURL('**/admin/pages/car/edit-car/step1-specification.html?id=1');
    expect(page.url()).toContain('step1-specification.html?id=1');
  });

  test('Step 1 pre-fills car specs, provides live preview with dynamic 360 badge, and proceeds to Step 2', async ({ page }) => {
    await page.goto('/admin/pages/car/edit-car/step1-specification.html?id=1');
    await page.waitForLoadState('networkidle');

    const nameInput = page.locator('#inputName');
    await expect(nameInput).toHaveValue(/BMW/i);

    const plateInput = page.locator('#inputPlate');
    await expect(plateInput).toHaveValue('WDR 3388');

    const live360 = page.locator('#live360Badge');
    await expect(live360).toBeVisible();

    const nextBtn = page.locator('#btnProceedStep2');
    await expect(nextBtn).toBeVisible();
    await nextBtn.click();

    await page.waitForURL('**/admin/pages/car/edit-car/step2-studio360.html?id=1');
    expect(page.url()).toContain('step2-studio360.html?id=1');
  });

  test('Step 2 manages gallery and dynamically toggles 360 badge when cleared or restored', async ({ page }) => {
    await page.goto('/admin/pages/car/edit-car/step2-studio360.html?id=1');
    await page.waitForLoadState('networkidle');

    const cdnInput = page.locator('#inputExteriorCdnUrl');
    await expect(cdnInput).toBeVisible();

    const clearBtn = page.locator('#btnClear360');
    await expect(clearBtn).toBeVisible();

    const badge = page.locator('#studioBadge360');
    await expect(badge).toBeVisible();

    await clearBtn.click();
    await page.waitForTimeout(200);
    await expect(badge).toBeHidden();

    await cdnInput.fill('https://cdn.wedrive.my/360/bmw-test/');
    await cdnInput.dispatchEvent('input');
    await page.waitForTimeout(200);
    await expect(badge).toBeVisible();

    const nextBtn = page.locator('#btnProceedStep3');
    await nextBtn.click();

    await page.waitForURL('**/admin/pages/car/edit-car/step3-confirmation.html?id=1');
    expect(page.url()).toContain('step3-confirmation.html?id=1');
  });

  test('Step 3 displays review summary and successfully updates record', async ({ page }) => {
    await page.goto('/admin/pages/car/edit-car/step3-confirmation.html?id=1');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('#sumPlate')).toHaveText('WDR 3388');
    await expect(page.locator('#finalBadge360')).toBeVisible();

    const confirmBtn = page.locator('#btnConfirmUpdate');
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    await page.waitForURL('**/admin/pages/car/car-detail/car-detail.html?id=1', { timeout: 10000 });
    expect(page.url()).toContain('car-detail.html?id=1');
  });

});
