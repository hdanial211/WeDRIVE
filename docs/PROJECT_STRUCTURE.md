# WeDRIVE Project Structure & Database Integration Guide

Fail ini disediakan untuk memudahkan anda (dan pembangun lain) memahami struktur fail WeDRIVE, bagaimana komponen diselaraskan (sync), dan bagaimana untuk memasukkan database sebenar pada masa hadapan.

---

## Struktur Fail (Architecture)

WeDRIVE dibina menggunakan struktur berasaskan komponen dan modul supaya kemas dan mudah diselenggara:

```text
AI CAR RENTAL SYSTEM/
|
+-- index.html                  # Landing Page / Browse Cars (Entry Point)
|
+-- vercel.json                # Vercel deployment config
|
+-- supabase/                   # Supabase Configuration & Scripts
|   +-- migrate-data.js         # Skrip migrasi data.json ke Supabase PostgreSQL (run sekali)
|   +-- functions/
|       +-- send-email/
|           +-- index.ts        # Edge Function: email notification (booking confirm, reminder, refund, doc verification)
|
+-- REPORT/                     # Laporan FYP (PSM I & PSM II)
|   +-- chapters/               # Bab-bab laporan dalam Markdown
|   |   +-- 00_Front_Matter.md  # Borang Pengesahan, Title, Declaration, Dedication, Acknowledgements
|   |   +-- 01_Abstract.md     # Abstract (EN) & Abstrak (BM)
|   |   +-- 02_Table_of_Contents.md # TOC, List of Tables/Figures/Abbreviations
|   |   +-- 03_Chapter1_Introduction.md # Bab 1: Pengenalan
|   |   +-- 04_Chapter2_Literature_Review.md # Bab 2: Kajian Literatur & Metodologi
|   |   +-- 05_Chapter3_Analysis.md # Bab 3: Analisis
|   |   +-- 06_Chapter4_Design.md # Bab 4: Reka Bentuk
|   |   +-- 07_References.md   # Rujukan (Harvard Style)
|   +-- WeDRIVE_PSM1_Report.docx # Laporan lengkap dalam format DOCX
|   +-- 3-FYP-Writing-Guide-2025_v1.docx # Panduan penulisan FYP UTeM
|   +-- FINAL REPORT FYP -TEMPLATE.docx # Template laporan FYP
|   +-- PROPOSAL HAKIM (1).pdf # Proposal projek
|   +-- PSM reference.pdf      # Rujukan contoh PSM
|
+-- docs/                       # Dokumentasi Projek
|   +-- PROJECT_STRUCTURE.md     # Struktur fail & panduan integrasi
|   +-- FULL_SYSTEM_FLOWCHART.md # Carta alir sistem penuh
|   +-- FULL_SYSTEM_FLOWCHART.html # Carta alir sistem (versi visual)
|   +-- email-templates/         # Template HTML untuk email Supabase Auth
|   |   +-- reset-password.html  # Template email Reset Password (branded WeDRIVE)
|   +-- stitch-reference/        # Rujukan reka bentuk Stitch
|       +-- html/                # Kod HTML skrin Stitch (11 skrin + mobile)
|       +-- screenshots/         # Tangkapan skrin reka bentuk Stitch
|
+-- account/                    # Modul Akaun (Login, Signup, Forgot Password)
|   +-- pages/
|   |   +-- login/
|   |   |   +-- login.html           # Halaman Log Masuk
|   |   +-- signup/
|   |   |   +-- signup.html          # Halaman Daftar Akaun Baru
|   |   +-- forgot-password/
|   |   |   +-- forgot-password.html # Halaman Reset Kata Laluan
|   |   +-- welcome/
|   |   |   +-- welcome.html         # Splash screen selepas login (route ke profile/dashboard)
|   |   +-- complete-profile/
|   |   |   +-- complete-profile.html # Lengkapkan profil (IC, Lesen, Telefon + upload dokumen)
|   |   +-- verification-pending/
|   |       +-- verification-pending.html # Tunggu admin sahkan dokumen (auto-poll status)
|   +-- css/
|   |   +-- auth.css             # Gaya halaman auth (Login/Signup)
|   +-- js/
|
+-- guest/                      # Modul Tetamu (Browse tanpa login)
|   +-- pages/
|   |   +-- explore-melaka/
|   |   |   +-- explore-melaka.html  # Halaman Explore Melaka
|   |   +-- how-it-works/
|   |   |   +-- how-it-works.html    # Halaman Panduan & Tutorial Sewa
|   |   +-- pricing/
|   |       +-- pricing.html         # Halaman Harga (4 tier pricing)
|   +-- css/
|   |   +-- guest.css                # Gaya utama Guest (semua gaya digabung termasuk Explore Melaka)
|   +-- js/
|   |   +-- how-it-works.js          # Animasi 360, scrollytelling, ripple & interaksi halaman How It Works
|       +-- promo-banner.js          # Logik banner promosi
|
+-- admin/                      # Modul Admin
|   +-- pages/                             # FLOW: Sidebar navigation hierarchy
|   |   +-- dashboard/
|   |   |   +-- admin.html                 # Admin Dashboard
|   |   +-- car/
|   |   |   +-- cars.html                  # Pengurusan Car (Kereta)
|   |   |   +-- car-detail/
|   |   |       +-- car-detail.html        # Detail & Urus Kereta Individu
|   |   +-- booking/
|   |   |   +-- bookings.html              # Pengurusan Tempahan
|   |   +-- customer/
|   |   |   +-- customers.html             # Pengurusan Pelanggan
|   |   +-- report/
|   |   |   +-- reports.html               # Laporan & Analitik
|   |   +-- calendar/
|   |   |   +-- calendar.html              # Calendar Overview
|   |   +-- chatbot/
|   |   |   +-- chatbot.html               # AI Chatbot Settings
|   |   +-- marketing/
|   |   |   +-- marketing.html             # Marketing (Banners, Promo, Seasonal)
|   |   +-- setting/
|   |       +-- settings.html              # Tetapan Sistem
|   +-- components/
|   |   +-- sidebar/
|   |       +-- sidebar-admin.html   # Admin Sidebar Navigation
|   +-- css/
|   |   +-- admin.css           # Gaya khusus untuk Admin
|   +-- js/
|       +-- admin.js            # Logik Dashboard
|       +-- cars.js             # Logik Car Management
|       +-- car-detail.js      # Logik Detail Kereta
|       +-- bookings.js         # Logik Tempahan (refund 85%/50%, reminder email)
|       +-- customers.js        # Logik Pelanggan
|       +-- reports.js          # Logik Laporan
|       +-- settings.js         # Logik Tetapan
|       +-- chatbot-admin.js    # Logik AI Chatbot (Gemini + Grok API)
|       +-- marketing.js        # Logik Marketing (Banners, Promos, Seasonal)
|       +-- marketing-ai.js     # AI Marketing Content Generator (Gemini API key stored in Supabase)
|       +-- calendar.js         # Logik Calendar Overview
|
+-- customer/                   # Modul Customer / Pengguna
|   +-- pages/                           # FLOW: Dashboard > Car Details > Booking > Payment > Confirmed
|   |   +-- dashboard/
|   |   |   +-- customer.html            # Customer Dashboard (Pilih Kereta)
|   |   +-- car-details/
|   |   |   +-- car-details.html         # Detail Kereta (Premium Gallery)
|   |   |   +-- booking/
|   |   |       +-- booking.html         # Form Tempahan Kereta
|   |   |       +-- payment/
|   |   |           +-- payment.html     # Pembayaran & Checkout
|   |   |           +-- booking-confirmed/
|   |   |               +-- booking-confirmed.html  # Pengesahan Tempahan
|   |   +-- my-bookings/
|   |   |   +-- my-bookings.html         # Senarai & Sejarah Tempahan
|   |   |   +-- receipt/
|   |   |       +-- receipt.html         # Resit / Invois Tempahan
|   |   +-- profile/
|   |   |   +-- profile.html            # Pengurusan Profil Customer
|   |   +-- support/
|   |   |   +-- support.html            # Pusat Bantuan & Sokongan
|   +-- css/
|   |   +-- customer.css                # Gaya utama Customer (semua gaya digabung)
|   +-- js/
|       +-- customer.js                  # Logik Customer + Car Details (digabung)
|       +-- sidebar-loader.js            # Pemuat Sidebar + Navbar Customer (seragam)
|
+-- shared/                     # FAIL PERKONGSIAN GLOBAL (PENTING)
    +-- pages/                  # Halaman dikongsi semua modul
    |   +-- error/
    |   |   +-- 404.html             # Halaman Error 404 (Page Not Found)
    |   +-- footer/             # Halaman yang dilink dari Footer
    |       +-- about/
    |       |   +-- about.html       # Halaman Tentang Kami
    |       +-- contact/
    |       |   +-- contact.html     # Halaman Hubungi Kami
    |       +-- faq/
    |       |   +-- faq.html         # Halaman Soalan Lazim
    |       +-- terms/
    |           +-- terms.html       # Halaman Terma & Privasi
    +-- components/
    |   +-- navbar.html          # Navbar yang diguna semua page
    |   +-- footer.html         # Footer yang diguna semua page
    +-- model/
    |   +-- registry.json       # Manifest global untuk semua model 360 dalam shared/model
    |   +-- Hatchback/
    |   |   +-- 2022 Volkswagen Golf GTI 2.0/
    |   |   |   +-- exterior/
    |   |   |   |   +-- full-res/   # 200 frame Golf GTI exterior 360 dalam resolusi asal sahaja
    |   |   |   +-- interior/
    |   |   |   |   +-- full-res/   # Placeholder panorama dalaman jika export dibuka kemudian
    |   |   |   +-- source.json     # Metadata viewer, CDN, dan status panorama Golf GTI
    |   |   +-- 2017 Perodua AXIA G 1.0/
    |   |   |   +-- exterior/
    |   |   |   |   +-- full-res/   # 200 frame Axia G exterior 360 dalam resolusi asal sahaja
    |   |   |   +-- interior/
    |   |   |   |   +-- full-res/   # Placeholder interior untuk integrasi seterusnya
    |   |   |   +-- source.json     # Metadata sumber image Axia G
    |   |   +-- 2025 Perodua AXIA AV 1.0/
    |   |       +-- exterior/
    |   |       |   +-- full-res/   # 200 frame Axia AV exterior 360 dalam resolusi asal sahaja
    |   |       +-- interior/
    |   |       |   +-- full-res/   # Placeholder interior untuk integrasi seterusnya
    |   |       +-- source.json     # Metadata sumber image Axia AV
    |   +-- Sedan/
    |   |   +-- 2023 BMW 320i M Sport 2.0/
    |   |       +-- exterior/
    |   |       |   +-- full-res/   # 200 frame BMW exterior 360 dalam resolusi asal sahaja
    |   |       +-- interior/
    |   |       |   +-- full-res/   # 6 muka panorama dalaman kereta resolusi asal
    |   |       +-- source.json     # Metadata sumber, pattern frame, dan orientasi BMW
    |   +-- SUV/
    |   |   +-- 2023 Mercedes-Benz GLA250 AMG Line 2.0/
    |   |       +-- exterior/
    |   |       |   +-- full-res/   # 200 frame Mercedes exterior 360 dalam resolusi asal sahaja
    |   |       +-- interior/
    |   |       |   +-- full-res/   # Placeholder panorama dalaman jika export dibuka kemudian
    |   |       +-- source.json     # Metadata sumber viewer, CDN, dan status panorama Mercedes
    |   +-- MPV/
    |   |   +-- 2019 Toyota Alphard G S C Package 2.5/
    |   |       +-- exterior/
    |   |       |   +-- full-res/   # 200 frame Alphard exterior 360 dalam resolusi asal sahaja
    |   |       +-- interior/
    |   |       |   +-- full-res/   # Placeholder panorama dalaman jika export dibuka kemudian
    |   |       +-- source.json     # Metadata sumber viewer, CDN, dan status panorama Alphard
    |   +-- Coupe/
    |   |   +-- 2018 Mercedes-Benz CLS350 AMG Line 2.0/
    |   |       +-- exterior/
    |   |       |   +-- full-res/   # 200 frame Mercedes CLS exterior 360 dalam resolusi asal sahaja
    |   |       +-- interior/
    |   |       |   +-- full-res/   # Placeholder panorama dalaman jika export dibuka kemudian
    |   |       +-- source.json     # Metadata viewer, CDN, dan status panorama Mercedes CLS
    |   +-- Truck/
    |   |   +-- 2022 Ford Ranger Raptor High Rider Dual Cab 2.0/
    |   |       +-- exterior/
    |   |       |   +-- full-res/   # 200 frame Ranger Raptor exterior 360 dalam resolusi asal sahaja
    |   |       +-- interior/
    |   |       |   +-- full-res/   # Placeholder interior untuk integrasi seterusnya
    |   |       +-- source.json     # Metadata sumber image Ranger Raptor
    |   +-- Wagon/             # Kategori model wagon
    |   +-- Convertible/       # Kategori model convertible
    +-- css/
    |   +-- theme_day.css       # Tema Siang
    |   +-- theme_night.css     # Tema Malam
    |   +-- theme_overrides.css # Pengatasan tema
    |   +-- auth.css            # Gaya halaman Login & Sign Up
    |   +-- sidebar.css         # Gaya Sidebar Admin
    |   +-- footer.css          # Gaya Footer
    |   +-- navbar.css          # Gaya Global Navbar
    |   +-- chatbot.css         # Gaya Komponen WeDRIVE AI Chatbot
    |   +-- animation.css       # Gaya animasi (reveal, particles, dll)
    |   +-- vehicle-viewer.css  # Gaya global viewer 360 exterior + interior cubemap
    +-- lang/
    |   +-- en.json             # Bahasa Inggeris (JSON Source)
    |   +-- ms.json             # Bahasa Melayu (JSON Source)
    |   +-- en.js               # Bahasa Inggeris (JS Global Object - Local Protocol)
    |   +-- ms.js               # Bahasa Melayu (JS Global Object - Local Protocol)
    +-- logo/                   # Gambar Logo
    +-- images/
    |   +-- cars/               # Gambar kereta legacy (tidak lagi digunakan untuk paparan model utama)
    |   +-- melaka/             # Gambar destinasi Melaka (local, dikompres)
    |   +-- icons/              # Ikon SVG (Google, dll)
    +-- js/
        +-- main.js             # Skrip Utama (Theme, Lang, Footer Auto-Load)
        +-- auth-guard.js       # Pelindung halaman (Auth Guard)
        +-- sidebar-loader.js   # Pemuat Sidebar Admin
        +-- navbar-loader.js    # Pemuat Navbar Global
        +-- api.js              # API & CONFIGURATION (Pusat Database - Supabase PostgreSQL)
        +-- supabase-config.js  # Supabase Client Initializer (Auth + DB)
        +-- chatbot.js          # Modul Utama WeDRIVE AI Chatbot
        +-- email-service.js    # Email notification service (booking confirm, reminder, refund, doc verification via Supabase Edge Function + Resend)
        +-- promo-banner.js     # Promo Banner Display (guest & customer pages)
        +-- anime.min.js        # Library animasi (Anime.js v3)
        +-- animate.js          # Modul animasi WeDRIVE (page open + scroll reveal)
        +-- three.min.js        # Renderer Three.js local untuk interior cubemap 3D
        +-- vehicle-viewer.js   # Modul shared 360 exterior + interior viewer reusable
```

---

## Pusat Pangkalan Data (The api.js File)

Sistem WeDRIVE kini beroperasi secara penuh menggunakan pangkalan data **Supabase PostgreSQL** (`USE_REAL_DB: true` secara lalai). Semua data kereta, tempahan, pelanggan, dan tetapan chatbot disimpan secara dinamik pada database tersebut.

---

## Cara Menambah Halaman atau Fungsi Baharu

Jika anda ingin menambah page baharu (contohnya customer/pages/profile.html):

1. Gunakan Template HTML Yang Sama: 
   Pastikan tag-tag penting ini ada di dalam <head>:
   ```html
   <link id="theme-css" rel="stylesheet" href="../../shared/css/theme_night.css">
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
   ```

2. Muatkan Footer (Jika perlu):
   Letakkan div ini sebelum </body>:
   ```html
   <div id="footer-placeholder"></div>
   ```

3. Sambungkan Skrip Global:
   Letakkan skrip ini di penghujung <body> mengikut urutan yang betul:
   ```html
   <script src="../../shared/js/api.js"></script>   <!-- Wajib untuk Data -->
   <script src="../../shared/js/main.js"></script>  <!-- Wajib untuk Theme & Lang -->
   <script src="../js/profile.js"></script>         <!-- Skrip fungsi page ini -->
   ```

4. Ambil Data di dalam Skrip Anda (profile.js):
   Jangan gunakan fetch(url). Gunakan fungsi WeDriveAPI:
   ```javascript
   // Contoh cara mudah ambil data kereta
   window.WeDriveAPI.getCars().then(cars => {
       console.log(cars);
   });
   ```
   (Jika perlukan fungsi baharu, tambah fungsi tersebut di dalam shared/js/api.js terlebih dahulu).

Dengan struktur ini, projek anda sangat tersusun, gred profesional, dan sudah 100% bersedia untuk disambungkan dengan sistem pangkalan data pelayan (Backend Database)!
