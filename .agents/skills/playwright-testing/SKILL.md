---
name: playwright-testing
description: Panduan automasi ujian E2E WeDRIVE menggunakan Playwright CLI. Meliputi persediaan senario Chromium/WebKit, assertions geometri 1:1 bulat sempurna, mod gelap/siang, dwibahasa, dan perlindungan akaun rasmi tanpa duplikasi data.
---

# WeDRIVE Playwright E2E Testing Skill

## 1. Pengenalan & Matlamat Operasi
Kemahiran ini menetapkan tatacara standard bagi membina, menyelenggara, dan menjalankan ujian automasi menyeluruh (End-to-End) menggunakan **Playwright CLI** di bawah direktori terasing `tests/`.

### Matlamat Utama:
- Menjamin kadar kelulusan mutlak **100% Pass Rate** sebelum sebarang commit Git.
- Mengesahkan interaksi pengguna sebenar (klik butang, borang tempahan, penukaran tema, penukaran bahasa, modal Apple HIG).
- Mengelakkan sebarang regresi visual dan fungsian.

---

## 2. Kredensial Rasmi Ujian (Strict Test Credentials)

Sistem WeDRIVE mempunyai dua akaun rasmi yang telah ditetapkan di dalam pangkalan data:
- **Pentadbir (Admin):**
  - E-mel: `admin@wedrive.my`
  - Kata Laluan: `admin123`
- **Pelanggan (Customer):**
  - E-mel: `ahmad@wedrive.my`
  - Kata Laluan: `customer123`

### Peraturan Keselamatan Kredensial:
1. **DILARANG SAMA SEKALI** mengubah alamat e-mel atau kata laluan bagi kedua-dua akaun ini.
2. **DILARANG SAMA SEKALI** mendaftar akaun baharu (*sign up*) semasa ujian automatik untuk mengelakkan lambakan data bertindih dalam pangkalan data.
3. Pada halaman log masuk, borang sudah mempunyai auto-fill; skrip ujian hanya perlu klik butang **Sign In** atau mengisi semula nilai asal jika medan kosong.

---

## 3. Struktur Direktori & Fail Ujian

Semua fail ujian disimpan secara terasing dalam `tests/`:
```text
tests/
+-- e2e/
|   +-- 01_auth.spec.js                # Ujian Log Masuk & Validasi Borang
|   +-- 02_theme_and_lang.spec.js      # Suis Dwi-Tema & Dwibahasa EN/MS
|   +-- 03_about_corporate.spec.js     # Penjenamaan Korporat & Jaminan WeDRIVE
|   +-- 04_pricing_glider.spec.js      # Gelangsar Suis Apple Kadar Sewaan
|   +-- 05_admin_idle_timeout.spec.js  # Keselamatan Tamat Masa Sesi 10 Minit
|   +-- 06_bookings_filter.spec.js     # Penapis Julat Tarikh & Paginasi Lejar
|   +-- 07_customer_my_bookings.spec.js# Papan Pemuka Tempahan Pelanggan
|   +-- 08_customer_receipt.spec.js    # Resit Digital QR & Invois Cukai Rasmi
|   +-- 09_admin_ai_analytics.spec.js  # Modul Kecerdasan Buatan & Navigasi Kontekstual
|   +-- 10_admin_sidebar_pages.spec.js # Halaman Fizikal Bar Sisi Pentadbir
|   +-- 11_operations_lang.spec.js     # Dwibahasa Papan Operasi HQ Melaka
|   +-- 14_ai_key_vault_and_location.spec.js # Peti Kunci AI & Hab Tunggal Melaka
|   +-- 15_apple_calendar.spec.js      # Kalendar Bento 1:1 & Pemilih Tarikh
+-- playwright.config.js               # Konfigurasi Pelayar & Port Tempatan
+-- package.json                       # Dependensi Khusus Ujian
```

---

## 4. Arahan Pelaksanaan Ujian (Execution Commands)

### Jalankan Kesemua Ujian (Wajib Sebelum Commit):
```bash
cd tests && npx playwright test
```

### Jalankan Fail Ujian Tertentu:
```bash
cd tests && npx playwright test e2e/15_apple_calendar.spec.js
```

### Jalankan dengan Paparan Pelayar (Headed Mode untuk Nyahpepijat):
```bash
cd tests && npx playwright test --headed
```

---

## 5. Corak Assertion Wajib WeDRIVE

### A. Geometri Bulat 1:1 Sempurna (Zero Oval Enforcement)
```javascript
const iconBox = page.locator('.btn-icon, .cal-date-btn');
const box = await iconBox.boundingBox();
expect(box).not.toBeNull();
// Pastikan nisbah 1:1 tepat dengan toleransi maksimum 1.5px
expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1.5);
```

### B. Suis Dwi-Tema (Dark / Light Mode)
```javascript
const html = page.locator('html');
await page.click('#theme-toggle-btn');
await expect(html).toHaveAttribute('data-theme', 'light');
await page.click('#theme-toggle-btn');
await expect(html).toHaveAttribute('data-theme', 'dark');
```

### C. Suis Dwibahasa Dinamik (EN <-> MS)
```javascript
await page.click('#lang-toggle-btn');
await expect(page.locator('#nav-cars-link')).toHaveText(/Kereta|Cars/);
```

---

## 6. Protokol Tindakan Jika Ujian Gagal
1. Periksa mesej ralat dan tangkap layar kegagalan dalam `tests/test-results/`.
2. Kenal pasti sama ada kegagalan disebabkan perubahan kod terkini atau selector yang telah dikemaskini.
3. Baiki kod sehingga pelaksanaan `npx playwright test` menghasilkan **100% Pass Rate** sebelum meneruskan sebarang commit Git.
