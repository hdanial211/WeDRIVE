# WeDRIVE Master Project Structure & System Architecture Guide

Dokumen ini merupakan **Punca Kebenaran Tunggal (Single Source of Truth)** bagi struktur direktori, fail komponen, dan seni bina sistem WeDRIVE. Semua fail dan modul dalam repositori disusun secara modular berasaskan piawaian Apple Human Interface Guidelines (HIG) dan seni bina aplikasi web moden.

---

## 1. Ekosistem Ejen Pintar (`.agents/` — Master System Hub)

Folder `.agents/` bertindak sebagai pusat kawalan pintar, peraturan mandatori, kemahiran automasi, dan spesifikasi reka bentuk projek:

```text
.agents/
+-- PROJECT_STRUCTURE.md        # Dokumen Struktur Projek Utama (Fail ini)
+-- DESIGN.md                   # Spesifikasi Master Reka Bentuk Apple HIG & Stitch MCP
+-- rules/                      # 16 Fail Peraturan Bernombor (Strict Max 12,000 chars - Bebas Kembang Hingga 20-30 Fail):
|   +-- 01_core_rules.md        # Gatekeeper Protocol, Protokol Alatan Pintar & MCP, Git, PRD
|   +-- 02_apple_hig_design_system.md  # Apple HIG Pilar 1–3: Asas, Bento Grid & Corak Interaksi
|   +-- 03_apple_hig_components.md     # Apple HIG Pilar 4–6: Komponen, Input Borang & Senarai Semak
|   +-- 04_navigation_and_ui.md        # Seni Bina Dwi-Navigasi Admin, Responsif & Touch Target
|   +-- 05_apple_device_support.md     # Keserasian Spektrum Peranti Apple (MacBook, iPad, iPhone)
|   +-- 06_code_and_backend.md         # Seni Bina Kod, Prinsip 1 Modul = 1 CSS, Supabase API
|   +-- 07_stitch_design_system.md     # Piawaian Stitch MCP & Penjanaan UI Gemini 3.8 UHQ
|   +-- 08_playwright_testing.md       # Protokol Ujian Automasi E2E Playwright CLI (100% Pass)
|   +-- 09_security_and_audit.md       # Keselamatan Siber, Strix Security Audit & Perlindungan Data
|   +-- 10_graphify.md                 # Penjimatan Kuota Token AI & Navigasi Graf Pengetahuan
|   +-- 11_language_standards.md       # Standard Bahasa Melayu Moden 2026, Senarai Hitam & Dwibahasa
|   +-- 12_max_content_limit.md        # Had Siling 12,000 Aksara, Pengesahan wc -m & Modular Expansion
|   +-- 13_prd_standard.md             # Standard Dokumen Keperluan Produk (PRD) 6 Pilar Mandatori
|   +-- 14_supabase_database.md        # Pangkalan Data Supabase, Skema Mobiliti & Dasar Keselamatan RLS
|   +-- 15_strix_security_audit.md     # Audit Keselamatan Siber Strix & Ujian Penembusan Etika
|   +-- 16_ai_tooling_and_mcps.md      # Protokol Ekosistem 9 Alatan Pintar & Pelayan MCP WeDRIVE
+-- skills/                     # Kemahiran automasi khusus (context7, frontend-ui, dsb.)
+-- workflows/                  # Aliran kerja persistent (/graphify, /stitch_generation)
```

---

## 2. Struktur Penuh Repositori (Full System Architecture)

```text
AI CAR RENTAL SYSTEM/
|
+-- index.html                  # Halaman Pendaratan Utama / Carian Kereta (Public Entry Point)
|
+-- .agents/                    # Pusat Kawalan Ejen Pintar, Peraturan & Reka Bentuk (Rujuk Seksyen 1)
|
+-- admin/                      # Modul Pentadbir (Seni Bina Topbar Main + Sidebar Sub-Main)
|   +-- pages/                  # Halaman Fizikal Khusus Setiap Sub-Item (Sifar Query String)
|   |   +-- dashboard/
|   |   |   +-- admin.html                 # Ringkasan Eksekutif (Executive Overview)
|   |   |   +-- operations.html            # Status Operasi Depot & Hab Pengambilan HQ
|   |   +-- car/
|   |   |   +-- cars.html                  # Direktori Semua Kereta
|   |   |   +-- available-cars.html        # Kereta Tersedia Sahaja
|   |   |   +-- rented-cars.html           # Kereta Sedang Disewa (On-Road Tracking)
|   |   |   +-- add-car.html               # Pendaftaran Kereta Baharu & Upload 360 Studio
|   |   |   +-- car-detail/
|   |   |       +-- car-detail.html        # Pengurusan Terperinci & Status Kereta Individu
|   |   +-- booking/
|   |   |   +-- bookings.html              # Lejer Semua Tempahan
|   |   |   +-- active-bookings.html       # Pengurusan Tempahan Aktif & Bayaran Balik (Refund)
|   |   |   +-- new-booking.html           # Meja Tempahan Manual (Reservation Desk)
|   |   +-- customer/
|   |   |   +-- customers.html             # Direktori Pelanggan Berdaftar
|   |   |   +-- verifications.html         # Meja Pengesahan Dokumen KYC Lesen Memandu
|   |   +-- report/
|   |   |   +-- reports.html               # Laporan Kewangan & Prestasi Sewaan
|   |   |   +-- export-reports.html        # Pusat Muat Turun & Eksport Data (CSV/PDF)
|   |   +-- calendar/
|   |   |   +-- calendar.html              # Kalendar Tempahan Bento Grid Apple HIG
|   |   +-- analytics/
|   |   |   +-- analytics.html             # Analisis Data Pintar Kecerdasan AI
|   |   +-- ai/
|   |   |   +-- api-keys.html              # Peti Kunci API AI (Dedicated 4-Slot Vault)
|   |   +-- chatbot/
|   |   |   +-- chatbot.html               # Konfigurasi & Sejarah Perbualan Chatbot AI
|   |   +-- marketing/
|   |   |   +-- marketing.html             # Penjana Kempen Pemasaran Pintar AI
|   |   +-- setting/
|   |       +-- settings.html              # Tetapan Sistem & Lokasi Tunggal HQ WeDRIVE
|   +-- components/
|   |   +-- sidebar/
|   |       +-- sidebar-admin.html         # Komponen Navigasi Bar Sisi Admin
|   +-- css/
|   |   +-- admin.css                      # Satu Fail CSS Utama untuk Seluruh Modul Admin
|   +-- js/
|       +-- admin.js, api-keys.js, cars.js, car-detail.js, bookings.js, customers.js, reports.js, settings.js
|
+-- customer/                   # Modul Pelanggan (Aliran Penuh: Dashboard -> Tempah -> Bayar -> Resit)
|   +-- pages/
|   |   +-- dashboard/customer.html        # Papan Pemuka Pelanggan & Pemilihan Kereta
|   |   +-- car-details/car-details.html   # Paparan Spesifikasi & Galeri Studio 360
|   |   +-- booking/booking.html           # Borang Tempahan & Kunci Julat Tarikh
|   |   +-- booking/payment/payment.html   # Kaunter Pembayaran Selamat & Escrow
|   |   +-- booking/payment/booking-confirmed/booking-confirmed.html # Pengesahan Tempahan Berjaya
|   |   +-- my-bookings/my-bookings.html   # Sejarah & Pengurusan Tempahan Aktif
|   |   +-- my-bookings/receipt/receipt.html # Invois Cukai Rasmi & Pas Digital QR Kod
|   |   +-- profile/profile.html           # Pengurusan Profil & Muat Naik Lesen
|   |   +-- support/support.html           # Pusat Bantuan & Khidmat Pelanggan
|   +-- css/
|   |   +-- customer.css                   # Satu Fail CSS Utama untuk Seluruh Modul Pelanggan
|   +-- js/
|       +-- customer.js, sidebar-loader.js # Pengendali Logik & Navigasi Pelanggan
|
+-- guest/                      # Modul Pelawat Awam (Tanpa Log Masuk)
|   +-- pages/
|   |   +-- explore-melaka/explore-melaka.html # Panduan Destinasi Pelancongan Melaka
|   |   +-- how-it-works/how-it-works.html     # Panduan Langkah Demi Langkah Sewaan
|   |   +-- pricing/pricing.html               # Struktur Kadar Sewaan Harian & Mingguan
|   +-- css/
|   |   +-- guest.css                      # Satu Fail CSS Utama untuk Halaman Pelawat
|   +-- js/
|       +-- how-it-works.js, promo-banner.js
|
+-- account/                    # Modul Pengesahan Pengguna (Auth & KYC)
|   +-- pages/
|   |   +-- login/login.html                   # Log Masuk
|   |   +-- signup/signup.html                 # Pendaftaran Akaun Baharu
|   |   +-- forgot-password/forgot-password.html # Penetapan Semula Kata Laluan
|   |   +-- welcome/welcome.html               # Skrin Selamat Datang Selepas Log Masuk
|   |   +-- complete-profile/complete-profile.html # Lengkapkan Profil & Upload Lesen
|   |   +-- verification-pending/verification-pending.html # Status Menunggu Kelulusan Admin
|   +-- css/
|       +-- auth.css                       # Satu Fail CSS Utama untuk Semua Halaman Auth
|
+-- shared/                     # Fail Perkongsian Global (Global Assets & Core Engines)
|   +-- components/             # navbar.html, footer.html
|   +-- pages/                  # Halaman footer: about, contact, faq, terms, error 404
|   +-- css/                    # wedrive.css, theme_day.css, theme_night.css, animation.css, vehicle-viewer.css
|   +-- js/
|   |   +-- api.js              # Pusat Integrasi Supabase PostgreSQL (window.WeDriveAPI)
|   |   +-- main.js             # Skrip Utama Pengurusan Tema & Dwibahasa
|   |   +-- auth-guard.js       # Pengawal Keselamatan Laluan Sesi
|   |   +-- vehicle-viewer.js   # Enjin Shared Pemapar Interaktif 360 Exterior & Interior
|   |   +-- chatbot.js          # Widget Kecerdasan AI Chatbot
|   |   +-- email-service.js    # Perkhidmatan Notifikasi Emel Transaksional
|   +-- lang/
|   |   +-- en.json, ms.json    # Sumber Kamus Dwibahasa (JSON)
|   |   +-- en.js, ms.js        # Objek Global Kamus Dwibahasa (JS Protocol)
|   +-- model/                  # Aset Model 360 Darjah Pelbagai Kategori Kenderaan
|
+-- supabase/                   # Konfigurasi Pangkalan Data PostgreSQL & Edge Functions
|   +-- migrate-data.js         # Skrip Migrasi Automatik Data
|   +-- functions/send-email/   # Supabase Edge Function untuk Penghantaran Emel Notifikasi
|
+-- tests/                      # Suite Ujian Automasi Playwright Terasing
|   +-- e2e/                    # 15+ Fail Ujian E2E Menyeluruh (36/36 Ujian Lulus 100%)
|   +-- playwright.config.js    # Konfigurasi Pelayar Headless & Base URL
|
+-- graphify-out/               # Graf Pengetahuan Kod Sumber Berterusan (Token Saver)
|   +-- graph.json, graph.html, GRAPH_REPORT.md
|
+-- PLAN/                       # Log Pembangunan Berterusan Projek
|   +-- FYP1_to_FYP2_Development_Summary.md # Rekod Kronologi Setiap Kemas Kini Projek
|
+-- REPORT/                     # Dokumentasi Akademik & Laporan Projek Sarjana Muda (PSM)
|   +-- chapters/               # Fail Bab 1 Hingga Bab 7 Format Markdown
