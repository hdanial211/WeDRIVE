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

- **Apple Developer Ecosystem:** Rujukan utama untuk Bento Grid kemas, teratur, hierarki simetri, sifar ruang kosong terbuang (*Zero Dead Space*), dan tipografi berkelas tinggi. Senarai lengkap 8 portal Apple Developer rasmi dan konfigurasi pelayan Figma MCP terkandung sepenuhnya dalam [`.agents/rules/02_apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md).
- **Airbnb (airbnb.com):** Rujukan utama untuk *booking flow* yang lancar, carian tarikh (calendar), peta interaktif, dan *clean UI*.
- **Stripe (stripe.com):** Rujukan untuk *glassmorphism*, animasi *micro-interactions* yang sangat lancar, borang pembayaran (payment form) yang kemas, dan tipografi yang jelas.
- **Linear (linear.app):** Rujukan untuk *dark mode* yang sempurna, *glowing borders*, dan *keyboard-first navigation* untuk Admin Dashboard.
- **Vercel (vercel.com):** Rujukan untuk kelajuan antaramuka (speed), *minimalist dashboard*, dan komponen yang responsif.

---

## 4. Prinsip Geometri Butang: Bulat 1:1 Sempurna vs Kapsul Pil

- Piawaian mandatori nisbah bulat tepat 1:1 (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`) dan larangan keras bentuk bujur/oval dikawal secara berpusat dalam [`.agents/rules/02_apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md) (Pilar 1, Butiran 6).
- Butang berteks WAJIB mengembang mendatar menjadi kapsul/pil simetri (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).

---

## 5. Prinsip Sifar Tindakan Bertindan & Antaramuka Bebas Kesesakan (Strict Zero Duplicate Actions & Anti-Crowding Rule)

- **Larangan Keras Butang/Fungsi Berulang:**
  - Dalam satu halaman, **DILARANG SAMA SEKALI mempunyai 2 atau 3 elemen, butang, atau pautan yang melakukan perkara yang sama atau fungsi pendua** (contoh: Butang *Simpan Draf* manual sedangkan draf telah disimpan automatik; atau Butang *Simpan Kereta* di bar tajuk atas dan ada butang simpan lagi di bawah borang).
  - Kehadiran pelbagai butang serupa menyebabkan antaramuka kelihatan sesak (*crowded*), mengelirukan pengguna, dan mencemarkan estetika minimalis Apple HIG.
- **Satu Fungsi = Satu Butang Tindakan Tunggal:**
  - Setiap fungsi atau tindakan pengguna WAJIB mempunyai **SATU butang tindakan rasmi sahaja** (*Single Source of Action*).
- **Hierarki Kontekstual Aliran Wizard (Multi-Step Stepper):**
  - Pada aliran berperingkat, butang tindakan mestilah kontekstual mengikut fasa aktif:
    - **Langkah 1 (Spesifikasi):** Cukup butang `← Batal` di bar atas dan butang `Seterusnya: Studio Visual →` di bahagian bawah kad. DILARANG meletakkan butang *Simpan Kereta* di Langkah 1 kerana data visual belum lengkap.
    - **Langkah 2 (Visual & Muktamad):** Butang `← Kembali ke Langkah 1` dan butang muktamad tunggal `Daftar Kenderaan Baharu`.
- **Pengurusan Auto-Save Draf:**
  - Sekiranya sesuatu sistem telah mempunyai mekanisme penyimpanan automatik di latar belakang (*Auto-Save Draft*), **JANGAN cipta butang manual 'Simpan Draf'** yang memenuhkan ruang pengepala. Pengguna cukup sekadar dimaklumkan melalui sepanduk pulihkan draf atau notifikasi status halus.
