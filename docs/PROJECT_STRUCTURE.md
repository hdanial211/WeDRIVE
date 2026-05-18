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
+-- docs/                       # Dokumentasi Projek
|   +-- PROJECT_STRUCTURE.md     # Struktur fail & panduan integrasi
|   +-- FULL_SYSTEM_FLOWCHART.md # Carta alir sistem penuh
|   +-- FULL_SYSTEM_FLOWCHART.html # Carta alir sistem (versi visual)
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
|   |       +-- forgot-password.html # Halaman Reset Kata Laluan
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
|       +-- promo-banner.js          # Logik banner promosi
|
+-- admin/                      # Modul Admin
|   +-- pages/                             # FLOW: Sidebar navigation hierarchy
|   |   +-- dashboard/
|   |   |   +-- admin.html                 # Admin Dashboard
|   |   +-- car/
|   |   |   +-- cars.html                  # Pengurusan Fleet (Kereta)
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
|       +-- cars.js             # Logik Fleet Management
|       +-- car-detail.js      # Logik Detail Kereta
|       +-- bookings.js         # Logik Tempahan
|       +-- customers.js        # Logik Pelanggan
|       +-- reports.js          # Logik Laporan
|       +-- settings.js         # Logik Tetapan
|       +-- chatbot-admin.js    # Logik AI Chatbot (Gemini + Grok API)
|       +-- marketing.js        # Logik Marketing (Banners, Promos, Seasonal)
|       +-- calendar.js         # Logik Calendar Overview
|
+-- customer/                   # Modul Customer / Pengguna
|   +-- pages/                           # FLOW: Dashboard > Car Details > Booking > Payment > Confirmed
|   |   +-- dashboard/
|   |   |   +-- customer.html            # Customer Dashboard (Pilih Kereta)
|   |   +-- car-access/
|   |   |   +-- car-access.html          # Kawalan kereta aktif / Digital Key selepas pick-up
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
|   |   +-- ai-insights/
|   |   |   +-- ai-insights.html        # Dashboard AI Insights
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
    +-- dummy/
    |   +-- data.json            # Data Mockup Tunggal (Single Source of Truth)
    +-- lang/
    |   +-- en.json             # Bahasa Inggeris
    |   +-- ms.json             # Bahasa Melayu
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
        +-- api.js              # API & CONFIGURATION (Pusat Database)
        +-- chatbot.js          # Modul Utama WeDRIVE AI Chatbot
        +-- promo-banner.js     # Promo Banner Display (guest & customer pages)
        +-- anime.min.js        # Library animasi (Anime.js v3)
        +-- animate.js          # Modul animasi WeDRIVE (page open + scroll reveal)
```

---

## Pusat Pangkalan Data (The api.js File)

Saya telah mencipta satu fail baharu: shared/js/api.js.
Fail ini adalah Pusat Sambungan API. Semua halaman HTML kini disambungkan ke fail ini.

Kenapa api.js sangat membantu?
1. Satu Tempat Untuk Semua: Anda tidak perlu lagi buka customer.js, admin.js, atau login.js untuk ubah fetch(url). Semua data diambil melalui fail api.js.
2. Mudah Tukar ke Database Sebenar: Jika anda nak mula gunakan Supabase, Firebase, atau MySQL, anda hanya perlu tukar 1 baris kod sahaja.

Cara Menggunakan Database Sebenar:
Buka shared/js/api.js. Anda akan nampak blok kod ini:

```javascript
window.AppConfig = {
    // Tukar dari `false` ke `true` apabila database anda sudah sedia!
    USE_REAL_DB: false, 
    
    // Letakkan URL API Database sebenar anda di sini
    API_BASE_URL: "http://localhost:3000/api",
    
    endpoints: {
        cars: "/cars",
        bookings: "/bookings",
        customers: "/customers",
        login: "/auth/login"
    }
};
```

Apabila anda set USE_REAL_DB: true, keseluruhan sistem WeDRIVE (Admin, Customer, Landing page) akan berhenti membaca fail JSON (dummy) dan terus mula mengambil data daripada pelayan (server) pangkalan data anda!

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
