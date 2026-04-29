# 📂 WeDRIVE Project Structure & Database Integration Guide

Fail ini disediakan untuk memudahkan anda (dan pembangun lain) memahami struktur fail WeDRIVE, bagaimana komponen diselaraskan (sync), dan **bagaimana untuk memasukkan database sebenar pada masa hadapan**.

---

## 🏗️ Struktur Fail (Architecture)

WeDRIVE dibina menggunakan struktur berasaskan **komponen dan modul** supaya kemas dan mudah diselenggara:

```text
AI CAR RENTAL SYSTEM/
│
├── index.html                  # Landing Page Utama (Guest)
│
├── admin/                      # Modul Admin
│   ├── pages/
│   │   └── admin.html          # Admin Dashboard
│   ├── css/
│   │   └── admin.css           # Gaya khusus untuk Admin
│   └── js/
│       └── admin.js            # Logik Admin (kini menggunakan WeDriveAPI)
│
├── customer/                   # Modul Customer / Pengguna
│   ├── pages/
│   │   ├── login.html          # Halaman Log Masuk
│   │   └── customer.html       # Customer Dashboard (Pilih Kereta)
│   ├── css/
│   │   ├── login.css           # Gaya Log Masuk
│   │   └── customer.css        # Gaya Customer
│   └── js/
│       └── customer.js         # Logik Customer (kini menggunakan WeDriveAPI)
│
└── shared/                     # 🌟 FAIL PERKONGSIAN GLOBAL (PENTING)
    ├── components/
    │   ├── sidebar.html        # Admin Sidebar
    │   └── footer.html         # Footer yang diguna semua page
    ├── css/
    │   ├── theme_day.css       # Tema Siang
    │   ├── theme_night.css     # Tema Malam
    │   └── footer.css          # Gaya Footer
    ├── dummy/
    │   ├── admin.json          # Data Mockup Admin
    │   └── customer.json       # Data Mockup Kereta
    ├── lang/
    │   ├── en.json             # Bahasa Inggeris
    │   └── ms.json             # Bahasa Melayu
    ├── logo/                   # Gambar-gambar Logo
    └── js/
        ├── main.js             # Skrip Utama (Theme, Lang, Footer Auto-Load)
        ├── sidebar-loader.js   # Pemuat Sidebar Admin
        └── api.js              # 🚀 API & CONFIGURATION (Pusat Database)
```

---

## 🔗 Pusat Pangkalan Data (The `api.js` File)

Saya telah mencipta satu fail baharu: **`shared/js/api.js`**.
Fail ini adalah **Pusat Sambungan API**. Semua halaman HTML kini disambungkan ke fail ini.

### Kenapa `api.js` sangat membantu?
1. **Satu Tempat Untuk Semua:** Anda tidak perlu lagi buka `customer.js`, `admin.js`, atau `login.js` untuk ubah `fetch(url)`. Semua data diambil melalui fail `api.js`.
2. **Mudah Tukar ke Database Sebenar:** Jika anda nak mula gunakan Supabase, Firebase, atau MySQL, anda hanya perlu tukar **1 baris kod sahaja**.

### Cara Menggunakan Database Sebenar:
Buka `shared/js/api.js`. Anda akan nampak blok kod ini:

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

Apabila anda set `USE_REAL_DB: true`, keseluruhan sistem WeDRIVE (Admin, Customer, Landing page) akan berhenti membaca fail JSON (dummy) dan terus mula mengambil data daripada pelayan (server) pangkalan data anda!

---

## ➕ Cara Menambah Halaman atau Fungsi Baharu

Jika anda ingin menambah *page* baharu (contohnya `customer/pages/profile.html`):

1. **Gunakan Template HTML Yang Sama**: 
   Pastikan tag-tag penting ini ada di dalam `<head>`:
   ```html
   <link id="theme-css" rel="stylesheet" href="../../shared/css/theme_night.css">
   <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
   ```

2. **Muatkan Footer (Jika perlu)**:
   Letakkan div ini sebelum `</body>`:
   ```html
   <div id="footer-placeholder"></div>
   ```

3. **Sambungkan Skrip Global**:
   Letakkan skrip ini di penghujung `<body>` mengikut urutan yang betul:
   ```html
   <script src="../../shared/js/api.js"></script>   <!-- Wajib untuk Data -->
   <script src="../../shared/js/main.js"></script>  <!-- Wajib untuk Theme & Lang -->
   <script src="../js/profile.js"></script>         <!-- Skrip fungsi page ini -->
   ```

4. **Ambil Data di dalam Skrip Anda (`profile.js`)**:
   Jangan gunakan `fetch(url)`. Gunakan fungsi WeDriveAPI:
   ```javascript
   // Contoh cara mudah ambil data kereta
   window.WeDriveAPI.getCars().then(cars => {
       console.log(cars);
   });
   ```
   *(Jika perlukan fungsi baharu, tambah fungsi tersebut di dalam `shared/js/api.js` terlebih dahulu).*

Dengan struktur ini, projek anda sangat tersusun, gred profesional, dan sudah **100% bersedia** untuk disambungkan dengan sistem pangkalan data pelayan (Backend Database)!
