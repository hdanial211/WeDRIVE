# WeDRIVE Universal Stitch-to-Production Workflow Standards

## 1. Falsafah & Protokol Mandatori Penukaran STITCH ke Pengeluaran

Folder `STITCH UI PREVIEW/` bertindak sebagai persekitaran kotak pasir (*sandbox preview*) di mana reka bentuk antaramuka Gemini 3.8 UHQ diuji dan disemak oleh pengguna sebelum dijadikan halaman pengeluaran rasmi.

Apabila pengguna memberi kelulusan atau mengarahkan sesuatu reka bentuk dari `STITCH UI PREVIEW/` dijadikan halaman sebenar (*real page*), AI **WAJIB** mematuhi protokol universal 6-langkah berikut secara berdisiplin tanpa sebarang pengecualian:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│             PROTOKOL UNIVERSAL PENUKARAN STITCH KE PENGELUARAN              │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Ambil 100% Reka Bentuk Visual & Komponen dari STITCH UI PREVIEW          │
│ 2. Buang Komponen Olok-Olok (Mock Header, Fake Sidebar & Hardcoded Nav)    │
│ 3. Suntik Navigasi Sebenar WeDRIVE Mengikut Peranan (Admin / User / Guest)  │
│ 4. Ekstrak Semua CSS Inline ke shared/css/wedrive.css (Sifar Blok <style>)  │
│ 5. Ekstrak JS & Sambung Terus ke Supabase (Sifar Data Dummy / Hardcoded)   │
│ 6. Pengesahan Visual 1 Tab & Ujian Automasi Playwright (100% Pass)          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Enam Langkah Piawai Universal (The 6 Universal Conversion Pillars)

### Langkah 1: Ambil 100% Reka Bentuk Visual & Bento Grid STITCH
- Salin struktur susun atur, kad Bento squircle (`border-radius: 24px/28px`), palet warna Apple HIG, tipografi, dan elemen interaktif daripada fail pratonton `STITCH UI PREVIEW/<folder>/<fail_preview>.html`.
- Pastikan setiap kad, butang, lencana status, dan bahagian interaktif dipelihara dengan ketepatan visual 100% tanpa mengubah estetika yang telah diluluskan oleh pengguna.

### Langkah 2: Buang Komponen Olok-Olok (Mock Navigation Stripping)
Fail pratonton STITCH lazimnya mengandungi elemen navigasi olok-olok (*mock navigation*) untuk tujuan paparan semata-mata:
- **Mock Header:** Padamkan blok `<header class="fixed top-0 w-full z-50 glass-panel...">` yang mengandungi butang navigasi olok-olok, logo hardcode, atau suis tema tiruan.
- **Mock Sidebar:** Padamkan bar sisi statik yang tidak berhubung dengan pemuat rasmi WeDRIVE.
- **Mock Footers:** Padamkan footer statik atau gantikan dengan pemuat footer rasmi `#footer-placeholder`.

### Langkah 3: Suntik Senibina Navigasi Sebenar WeDRIVE
Suntik pembungkus komponen rasmi WeDRIVE mengikut peranan modul:
- **Modul Admin (Dwi-Navigasi Topbar Main + Sidebar Sub-Main):**
  ```html
  <body data-particles="6" data-cursor-glow>
    <!-- 1. Bar Sisi Kontekstual Sebenar -->
    <div id="sidebar-placeholder" data-component="sidebar-admin" data-page="[nama-halaman]"></div>

    <!-- 2. Kontena Utama -->
    <main class="main">
      <!-- Topbar Main 6-Modul Sebenar -->
      <div id="navbar-placeholder" data-module="admin"></div>

      <!-- Ruang Kandungan Pengeluaran (100% STITCH Markup) -->
      <div class="content pt-4 pb-32 max-w-7xl mx-auto">
        <!-- [KANDUNGAN BENTO GRID & KOMPONEN DARI STITCH] -->

        <!-- Footer Sebenar -->
        <div id="footer-placeholder" class="mt-32"></div>
      </div>
    </main>

    <!-- Pemuat Skrip Rasmi WeDRIVE -->
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script src="/shared/js/supabase-config.js"></script>
    <script src="/shared/js/api.js"></script>
    <script src="/shared/js/navbar-loader.js"></script>
    <script src="/shared/js/sidebar-loader.js"></script>
    <script src="/shared/js/main.js"></script>
    <script src="/admin/js/admin-idle-timeout.js"></script>
    <script src="[nama-skrip-halaman].js"></script>
  </body>
  ```
- **Modul Pelanggan (Customer):** Gunakan sidebar tunggal pelanggan `customer/js/sidebar-loader.js`.
- **Modul Pelawat (Guest):** Gunakan topbar awam `shared/js/navbar-loader.js`.

### Langkah 4: Pengekstrakan CSS Mutlak (Strict Zero Inline `<style>`)
- **DILARANG SAMA SEKALI** meninggalkan blok `<style>...</style>` gergasi di dalam fail HTML halaman pengeluaran.
- Ekstrak semua kelas CSS unik, animasi `@keyframes`, dan penggayaan komponen ke dalam fail CSS master:
  - Kelas global dan komponen UI: [`shared/css/wedrive.css`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/shared/css/wedrive.css) di bawah bahagian yang ditetapkan (contoh: Seksyen 22 untuk komponen STITCH).
  - Gaya khusus pentadbir: `admin/css/admin.css`.
- Pastikan semua pembolehubah warna menyokong **Dwi-Tema Penuh**: Mod Siang (*Day Mode*) dan Mod Obsidian Malam (*Night Obsidian Mode*).

### Langkah 5: Pengekstrakan JS & Sambungan Paip Data Sebenar Supabase
- **Pengekstrakan Kod JS:**
  - Pindahkan semua kod skrip interaktif daripada blok inline `<script>` ke dalam fail luaran modular `.js` yang tersusun rapi di direktori yang sama dengan halaman HTML tersebut (contoh: `admin/pages/car/add-car/step2-studio360.js`).
- **Definisi "Guna Data Sebenar Supabase" (Zero Dummy Data Rule):**
  - **"Guna database Supabase bermaksud buang dummy data lepastu connectkan terus dengan database Supabase."**
  - **HAPUS 100% data dummy yang di-hardcode** (seperti teks statik "Honda Civic 2024", "BMW 320i Sport", nombor plat contoh "VAA 8899", atau harga rekaan "RM 250").
  - **Sambungkan Terus ke Sumber Data Sebenar:**
    1. **Aliran Multi-Langkah (Wizard/Stepper):** Sambungkan data kepada storan draf sesi pengguna (`localStorage.getItem('wedrive_new_car_draft')`). Setiap input daripada langkah sebelumnya dihidratkan secara langsung pada langkah semasa.
    2. **Pangkalan Data Supabase PostgreSQL:** Pautkan pertanyaan melalui objek rasmi `window.WeDriveAPI` atau klien `@supabase/supabase-js` (contoh: `window.WeDriveAPI.getCar(id)` atau `window.WeDriveAPI.createCar(payload)`).
    3. **Keadaan Kosong Bersih (*Clean Blank Placeholder*):** Sekiranya rekod belum wujud atau pengguna belum mengisi draf, paparkan nilai neutral kosong bersih seperti `"-"`, `"RM 0.00"`, atau lencana *"Menunggu Input"* — **DILARANG memaparkan data dongeng atau contoh statik**.

### Langkah 6: Protokol Pengesahan Satu Tab & Automasi Ujian Playwright
Sebelum menyerahkan hasil kepada pengguna:
1. **Pemeriksaan Tab Sedia Ada (Single Tab Verification):**
   - Gunakan `chrome-devtools-mcp` untuk memeriksa DOM dan paparan visual pada tab pelayar aktif yang sedang dibuka (port `8088`).
   - DILARANG membuka banyak tab baharu.
   - Jalankan semakan spektrum 3-Peranti Apple menerusi `resize_page`: MacBook (`1440px`), iPad (`820px`), dan iPhone (`393px`).
   - Sahkan pematuhan mutlak **Prinsip Sifar Bujur (Zero Oval Rule)** pada semua butang bulat (1:1 tepat) dan butang berteks mengembang menjadi kapsul pil (`border-radius: 9999px`).
2. **Suite Ujian Playwright:**
   - Jalankan `cd tests && npx playwright test` dan pastikan kadar kelulusan **100% Pass Rate**.
3. **Kemas Kini Graphify:**
   - Jalankan `graphify update .` untuk memastikan graf pengetahuan sistem dikemas kini.
4. **Log Pembangunan & Git Tag SemVer:**
   - Rekodkan kemas kini dalam `PLAN/FYP1_to_FYP2_Development_Summary.md`.
   - Lakukan commit dan cipta tag versi Git mengikut piawaian SemVer `X.Y.Z`.

---

## 3. Senarai Semak Pantas Penukaran (Quick Conversion Checklist)

Setiap kali menukar sebarang halaman dari `STITCH UI PREVIEW/` ke pengeluaran:
- [ ] Susun atur dan komponen Bento sepadan 100% dengan reka bentuk STITCH.
- [ ] Mock header, mock sidebar, dan pautan olok-olok telah dipadamkan sepenuhnya.
- [ ] Navigasi sebenar WeDRIVE (`#navbar-placeholder` & `#sidebar-placeholder`) telah dipasang dengan atribut data yang tepat.
- [ ] Tiada blok `<style>` inline dalam fail HTML; semua gaya diekstrak ke `shared/css/wedrive.css`.
- [ ] Tiada blok `<script>` bercampur dalam fail HTML; semua logik diekstrak ke fail `.js` modular.
- [ ] Semua data statik dummy dihapuskan; data berhubung terus dengan pangkalan data Supabase atau draf sesi.
- [ ] Semua butang ikonik bulat mematuhi nisbah bulat tepat 1:1 (`aspect-ratio: 1/1 !important; border-radius: 50% !important;`).
- [ ] Paparan diperiksa pada tab pelayar sedia ada (MacBook $\to$ iPad $\to$ iPhone).
- [ ] Ujian Playwright CLI lulus 100% (`npx playwright test`).
- [ ] Fail peraturan ini dan semua fail peraturan lain kekal $\le 12,000$ aksara.

---

## 4. Had Siling 12,000 Aksara
- Fail ini tertakluk kepada had siling mandatori **12,000 aksara** seperti yang termaktub dalam [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
