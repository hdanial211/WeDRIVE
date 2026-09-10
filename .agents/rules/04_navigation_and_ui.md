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

---

## 6. Pantang Larang Mandatori: Polisi Lokasi Tunggal Ambil & Pulang di Melaka (Single Melaka HQ Depot Rule)

- **Syarat Mutlak Lokasi Tunggal Bertapak di Melaka (Single Melaka HQ Operational Depot):**
  - Operasi WeDRIVE bertapak dan berfokus sepenuhnya di **Melaka sahaja** (belum berkembang ke luar negeri).
  - Kenderaan **HANYA mempunyai SATU lokasi tunggal rasmi** bagi urusan serahan dan pemulangan kenderaan, iaitu di **Ibu Pejabat WeDRIVE (Melaka)**.
  - **Kebenaran Pandu Luar Melaka:** Pelanggan DIBENARKAN memandu kereta keluar dari Melaka (merentas negeri / outstation), namun proses serahan ambil dan pulang WAJIB di hab Melaka.
  - **DILARANG SAMA SEKALI** mereka-reka lokasi luar seperti Cyberjaya, KLIA, atau cawangan negeri lain.
  - Semua borang tempahan, wizard kereta, dan ringkasan pengesahan WAJIB memaparkan hab Melaka secara konsisten.

---

## 7. Piawaian Mandatori Notifikasi Tunggal (Strict Single Unified Pill Toast Notification Standard)

- **Satu Format Notifikasi Sahaja untuk Seluruh Sistem:**
  - Apa jua notifikasi kejayaan, amaran pengesahan borang, maklum balas tindakan AI, atau pemakluman status **WAJIB menggunakan SATU reka bentuk ini sahaja**: iaitu *Floating Pill Capsule Toast* di bahagian tengah atas skrin.
  - **Sifar Toleransi Format Bertindan / Pelbagai:**
    - DILARANG SAMA SEKALI menggunakan kad/kotak segi empat (*rectangular cards*).
    - DILARANG meletakkan notifikasi di bucu kanan bawah (*bottom-right popups*), tepi skrin, atau sepanduk penuh (*full-width banner*) yang mengganggu susun atur visual.
- **Spesifikasi Geometri Piawai Tunggal:**
  - **Bentuk**: Kapsul pil simetri penuh (`border-radius: 9999px !important;` / `rounded-full`).
  - **Kedudukan**: Sentiasa di tengah atas skrin (`fixed top-20 left-1/2 -translate-x-1/2 z-50`).
  - **Ikon Kiri**: Bulatan 1:1 sempurna (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`, cth: `w-7 h-7` / 28px).
  - **Bahan Kaca Apple**: Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%); border: 1px solid rgba(0, 113, 227, 0.3); box-shadow: 0 20px 35px rgba(0, 0, 0, 0.18);`).
  - **Teks**: Teks sebaris ringkas (*single line message*) dengan animasi lincah jatuh dari atas (`translate-y-[-10px]` $\leftrightarrow$ `translate-y-0`).

---

## 8. Prinsip Logik Akal Operasi: Sifar Medan Rekaan & Sifar Ulangan Universal pada Rekod Individu (Strict Zero Fabricated Fields & Zero Universal Clutter)

- **Sifar Medan Rekaan ("Benda yang tak ada jangan diadakan"):**
  - WeDRIVE adalah perkhidmatan sewaan kenderaan sebenar (*car rental with unlimited mileage*), BUKAN penjual kereta terpakai (*used car dealer*).
  - **DILARANG SAMA SEKALI** mengada-adakan atau mereka medan yang tiada logik operasi, tiada keperluan perniagaan sewaan, atau tiada dalam skema data sebenar (seperti *Odometer*, *Perbatuan Semasa*, *Mileage*, *Tarikh Luput Geran*, *Cukai Jalan*, dll.).
  - Hanya paparkan parameter teknikal yang benar-benar wujud dalam skema pangkalan data dan dimasukkan secara sah oleh pengguna/operasi (contoh 10 spesifikasi rasmi kenderaan: No. Pendaftaran, Pengeluar, Model & Varian, Kategori, Tahun Buatan, Warna, Enjin & Kuasa, Punca Kuasa, Transmisi, Kapasiti Tempat Duduk).
- **Sifar Ulangan Universal pada Rekod Individu ("Benda yang semua pakai jangan tunjuk dekat individu"):**
  - Maklumat dan polisi dasar yang terpakai secara universal kepada SELURUH sistem atau SEMUA kenderaan **DILARANG dipamerkan berulang-ulang sebagai kad atau lencana pada paparan rekod individu**.
  - Contoh:
    - *Pusat Pengambilan & Pemulangan*: Sistem WeDRIVE beroperasi pada satu HQ tunggal (HQ Melaka) untuk semua kenderaan. Ini adalah ketetapan menyeluruh sistem. DILARANG meletakkan kad/lencana berasingan "Lokasi: HQ Melaka" pada setiap kad ringkasan kenderaan individu kerana ia membazirkan ruang visual dan mencemarkan estetika kemas Apple HIG.
    - *Status Kereta Baharu*: Kenderaan yang didaftarkan sememangnya didaftarkan untuk sedia disewa. DILARANG meletakkan kad berasingan semata-mata untuk memaparkan "Status: Sedia Disewa" pada pratonton kenderaan individu.
- **Pemanfaatan Ruang Penuh Bento (Full-Width Zero Dead Space):**
  - Ruang Bento grid WAJIB dimanfaatkan sepenuhnya (contoh: kad spesifikasi `col-span-12` penuh) untuk memaparkan butiran unik kenderaan tersebut tanpa ruang mati (*Zero Dead Space*).

---

## 9. Pendedahan Progresif Media & Sifar Lencana Gimik AI (Progressive Visual Disclosure & Zero AI Gimmick Clutter)

- **Pendedahan Progresif Suis Media ("Tunjuk Galeri Sahaja Dulu, Ada 360 Baru Kembang"):**
  - Suis bersegmen visual (*Segmented Switcher*) WAJIB bermula secara padat memaparkan pilihan **"Galeri" sahaja** sebagai asas mandatori kenderaan.
  - Pilihan **"Pusingan 360°"** dan **"Panorama"** DILARANG dipaparkan secara pramatang sekiranya aset interaktif tersebut belum dijana atau dipautkan.
  - Sebaik sahaja aset 360° wujud atau selesai dijana, suis bersegmen tersebut akan mengembang secara dinamik dan lancar (*smooth expand*) mengikut fizik Apple HIG untuk mendedahkan mod 360° dan Panorama.
- **Sifar Lencana Gimik AI ("Ayat Ni Xyah Kot Nampak Macam AI Buat Page Ni"):**
  - DILARANG SAMA SEKALI meletakkan lencana pelekat cereka seperti *"✨ Kualiti AI Terjamin"*, *"Dikuasakan AI"*, atau seumpamanya pada paparan kenderaan.
  - Kehadiran lencana seperti ini merendahkan kredibiliti profesional sistem dan menampakkan reka bentuk seperti projek mainan generatif amatur.
  - Kekalkan penunjuk status korporat sebenar Apple HIG (contoh: *"Visual Sedia"*, *"10 Butiran Disahkan"*, *"Siap Sedia"*).
