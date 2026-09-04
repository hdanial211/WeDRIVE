---
trigger: always_on
---

# WeDRIVE Navigation, Responsive & UI/UX Standards

## 1. Sidebar & Navigation Architecture

### Navigation Pattern

| Modul    | Jenis Navigation | Main Navigation | Sub-Main Navigation | Loader |
| -------- | ---------------- | --------------- | ------------------- | ------ |
| **Admin** | **Dwi-Navigasi (Topbar Main + Sidebar Sub-Main)** | **Top Navbar** (6 Modul Utama: Dashboard, Cars, Bookings, Customers, Reports, AI Intelligence) | **Sidebar Kontekstual** (Alatan Sub-Main mengikut modul aktif) | `shared/js/navbar-loader.js` + `shared/js/sidebar-loader.js` |
| **Customer** | Sidebar Sahaja | - | Menu Pelanggan Penuh | `customer/js/sidebar-loader.js` |
| **Guest** | Top Navbar Sahaja | Top Navbar Awam | - | `shared/js/navbar-loader.js` |
| **Account** | Tiada (Standalone) | - | - | - |

### Peraturan Khusus Navigasi Admin (Topbar Main + Sidebar Sub-Main Architecture)
- **Topbar sebagai Main Navigation:** Topbar mengawal peralihan antara 6 modul utama sistem pentadbir (Dashboard, Cars, Bookings, Customers, Reports, AI Intelligence).
- **Sidebar sebagai Sub-Main Navigation:** Sidebar bertindak sebagai navigasi anak (*sub-navigation*) yang menyesuaikan diri secara dinamik mengikut modul yang dipilih di topbar.
- **Setiap Item Sub-Main Wajib Ada Halaman Fizikal Tersendiri:** Setiap sub-item dalam bar sisi WAJIB mempunyai fail fizikal `.html` sendiri (contoh: `available-cars.html`, `rented-cars.html`, `add-car.html`, `active-bookings.html`, `new-booking.html`, `operations.html`, dsb.), dan BUKAN berkongsi URL dengan query string atau hash.
- **Konsistensi Modul:** Semua halaman dalam modul yang sama WAJIB mengekalkan struktur Topbar Main dan Sidebar Sub-Main yang seragam.

---

## 2. Mobile Responsive Guidelines

- SEMUA page WAJIB boleh dilihat dan berfungsi pada peranti telefon (mobile).
- Setiap page WAJIB ada meta viewport tag:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  ```
- Gunakan media queries untuk breakpoint utama:
  - `max-width: 1100px` - Tablet landscape
  - `max-width: 900px` - Tablet portrait
  - `max-width: 768px` - Mobile landscape / small tablet
  - `max-width: 600px` - Mobile portrait
- Sidebar WAJIB auto-collapse menjadi hamburger menu pada mobile.
- Grid dan layout WAJIB responsive (contoh: 4 columns > 2 columns > 1 column).
- Font size, padding, dan spacing WAJIB sesuai untuk skrin kecil.
- Touch target minimum 44x44px untuk butang dan link pada mobile.

---

## 3. UI/UX & Branding Standard References

Untuk memastikan kualiti projek WeDRIVE sentiasa premium, jadikan rujukan standard berikut:

- **Airbnb (airbnb.com):** Rujukan utama untuk *booking flow* yang lancar, carian tarikh (calendar), peta interaktif, dan *clean UI*.
- **Stripe (stripe.com):** Rujukan untuk *glassmorphism*, animasi *micro-interactions* yang sangat lancar, borang pembayaran (payment form) yang kemas, dan tipografi yang jelas.
- **Apple (apple.com):** Rujukan untuk *scrollytelling*, paparan produk 3D/premium, ruang putih (*whitespace*), dan tipografi berkelas tinggi.
- **Linear (linear.app):** Rujukan untuk *dark mode* yang sempurna, *glowing borders*, dan *keyboard-first navigation* untuk Admin Dashboard.
- **Vercel (vercel.com):** Rujukan untuk kelajuan antaramuka (speed), *minimalist dashboard*, dan komponen yang responsif.
