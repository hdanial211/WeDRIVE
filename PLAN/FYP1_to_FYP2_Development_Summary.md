# 🚗 WeDRIVE: Ringkasan Penuh Pembangunan Sistem (FYP 1 hingga FYP 2)

**Nama Projek:** AI Car Rental System (WeDRIVE Melaka)  
**Kod Kursus:** BITU3973 (Project I / FYP 1) $\rightarrow$ BITU3983 (Project II / FYP 2)  
**Pembangun:** Muhammad Hakim Danial  
**Institusi:** Universiti Teknikal Malaysia Melaka (UTeM)  
**Lokasi Fokus Operasi:** Melaka, Malaysia  

---

## 📌 1. Pengenalan & Matlamat Projek

**WeDRIVE** merupakan sebuah platform sewaan kenderaan pintar generasi baharu yang direka khas untuk operasi di Melaka. Matlamat utama sistem ini adalah untuk menyelesaikan kelemahan sistem konvensional melalui integrasi:
1. **Pengurusan Armada & Tempahan Automatik**: Aliran tempahan tanpa kunci (*keyless/instant pickup*), penjejakan kenderaan masa nyata, dan pengurusan pulangan kenderaan pintar.
2. **Kecerdasan Buatan (AI Engine)**: Cadangan kenderaan pintar mengikut bajet/destinasi pelancongan Melaka dan pembantu maya AI (*AI Concierge Chatbot*).
3. **Piawaian Reka Bentuk Apple HIG**: Pengalaman visual premium bertaraf dunia menggunakan prinsip *Bento Grid Layout*, *Glassmorphism*, dwi-tema (*Dark/Light Mode per-device*), dan dwi-bahasa (*BM/EN*).
4. **Seni Bina Pangkalan Data Relasional Tanpa Kos**: Dikuasakan sepenuhnya oleh **Supabase (PostgreSQL Cloud + Supabase Auth)**.

---

## 🏛️ 2. Fasa FYP 1 (BITU3973) - Perancangan, Analisis & Prototaip Asas

Dalam fasa FYP 1, fokus utama adalah pada kajian literatur, analisis keperluan pengguna, reka bentuk seni bina, dan pembinaan prototaip awal:

### A. Analisis Keperluan & Kajian Literatur (Bab 1, 2, & 3)
* **Kajian Sistem Sedia Ada**: Menilai jurang operasi syarikat sewa kereta tempatan yang masih bergantung kepada borang manual, WhatsApp, atau sistem web lama yang kaku.
* **Analisis & Reka Bentuk Sistem (UML & Data Modeling)**:
  * *Use Case Diagrams & Specifications*: Menetapkan 3 aktor utama (Pelawat/Guest, Pelanggan/Customer, Pentadbir/Admin).
  * *Activity & Sequence Diagrams*: Memetakan aliran proses tempahan, pembayaran, pemulangan kenderaan, dan penetapan harga promosi.
  * *Entity-Relationship Diagram (ERD)*: Mereka bentuk skema data relasional bagi entiti pengguna, kenderaan, tempahan, ulasan, promosi, dan log audit.

### B. Pembinaan Seni Bina Awal & Prototaip Statik (*Proof of Concept*)
* **Struktur Folder Modular**:
  ```text
  AI CAR RENTAL SYSTEM/
  ├── account/        # Log masuk, Daftar, Pemulihan Kata Laluan
  ├── admin/          # Panel Pentadbir (Dashboard, Fleet, Bookings, Marketing, Analytics)
  ├── customer/       # Portal Pelanggan (Dashboard, Browse, Booking, My Bookings, Profile)
  ├── guest/          # Halaman Pelawat (Explore Melaka, How It Works, Pricing)
  ├── shared/         # Komponen Modular (CSS, JS, Navbar, Footer, Sidebar, API)
  └── index.html      # Landing Page Utama
  ```
* **Dataset Prototaip Awal (`data.json`)**:
  * Menggunakan dataset JSON tempatan dengan 8 buah kenderaan Malaysia (Perodua Bezza, Myvi, Axia, Honda City, Toyota Vios, Proton X50, Hyundai Staria, dsb.) untuk menguji aliran antaramuka awal.

---

## 🚀 3. Fasa FYP 2 (BITU3983) - Pembangunan Penuh, Migrasi Database & Integrasi AI

Dalam fasa FYP 2, sistem telah dinaik taraf daripada prototaip statik kepada aplikasi web pengeluaran penuh (*production-ready full-stack web application*):

---

### 🗄️ FASA A: Migrasi Penuh ke Supabase (Real Cloud PostgreSQL Database)

1. **Penyediaan Pangkalan Data Supabase**:
   * **Lokasi Pelayan**: Region Singapore (`ap-southeast-1`) untuk capaian kependaman rendah (*ultra-low latency*).
   * **Struktur Jadual Relasional**:
     * `customers`: Maklumat pemandu, nombor IC, lesen memandu, status verifikasi, dan pautan Auth UID.
     * `admins`: Senarai akaun pentadbir dengan peranan dan hak akses.
     * `cars`: Katalog kenderaan lengkap (plat, transmisi, bahan api, tempat duduk, kadar sewa, status ketersediaan, rating, galeri imej JSONB).
     * `bookings`: Rekod tempahan langsung, tarikh ambil/pulang, jumlah bayaran, status pembayaran, kod promo, dan kaedah ambil kereta.
     * `marketing`: Banner promosi laman utama dan tawaran bermusim.
     * `promos`: Kod diskaun promosi, had penggunaan, peratusan/nilai tetap, dan tarikh luput.
     * `seasonal_pricing`: Pelarasan harga dinamik mengikut musim cuti persekolahan/perayaan di Melaka.
     * `reviews`: Penilaian dan ulasan bintang sebenar daripada pelanggan.
     * `audit_logs`: Rekod keselamatan aktiviti pentadbir.
2. **Pengesahan Pengguna Sebenar (*Supabase Authentication*)**:
   * Log masuk dan pendaftaran akaun berasaskan Emel & Kata Laluan dengan penyulitan keselamatan.
   * Integrasi **Google OAuth 2.0 Single Sign-On (SSO)**.
   * Kawalan Akses Berasaskan Peranan (*Role-Based Access Control - RBAC*).
   * SDK Supabase disepadukan secara universal merentasi kesemua **26 halaman HTML**.

---

### 👤 FASA B: Portal Pelanggan (*Customer Portal*)

Merangkumi 10 halaman pintar yang saling berhubung:
1. **Dashboard Pelanggan (`customer.html`)**:
   * **Kad Bento Dinamik**:
     * *Status Sewaan Aktif*: Menampilkan maklumat kenderaan yang sedang disewa, lokasi pemulangan, dan **pemasa kiraan detik masa nyata (*Live Countdown Timer*)** ke tarikh pemulangan.
     * *Status Sedia Perjalanan*: Jika tiada sewaan aktif, paparan bertukar secara automatik kepada kad ajakan menjelajah Melaka dengan butang tempahan pantas.
   * Kad akses pantas (*Quick Action Bento Hub*), sejarah rekod, dan cadangan AI.
2. **Katalog & Carian Pintar (`browse-cars.html`)**:
   * Bar carian tarikh padat (*compact search bar*).
   * Penapis segera mengikut kategori (Sedan, SUV, MPV, Coupe, Truck), transmisi (Auto/Manual), dan julat harga.
   * Kad kenderaan interaktif dengan butang semakan ketersediaan dan modal tempahan segera.
3. **Aliran Tempahan Lengkap 3-Langkah (`booking.html` / `payment.html` / `confirmed.html`)**:
   * Pilihan tarikh menggunakan kalendar popover pintar.
   * Pengiraan tempoh sewa dan jumlah kos secara automatik.
   * Pengesanan kod promo dengan potongan harga masa nyata.
   * Pilihan perlindungan insurans dan perkhidmatan tambahan.
   * Pengesahan tempahan segera berserta invois digital.
4. **Pengurusan Tempahan Saya (`my-bookings.html`)**:
   * Penjejakan status tempahan: *Active*, *Upcoming*, *Completed*, *Cancelled*.
   * Ciri lanjutan tempoh sewaan (*Extend Rental*).
5. **Penjelajahan Melaka (`melaka.html` / `explore.html`)**:
   * Panduan tempat tarikan utama (Bandar Hilir, Jonker Walk, Klebang, Ayer Keroh) diselaraskan dengan cadangan kereta yang sesuai.
6. **Profil & Keselamatan (`profile.html`)**:
   * Pengurusan profil pemandu dan verifikasi identiti.

---

### 🛡️ FASA C: Portal Pentadbir (*Admin Management Portal*)

Merangkumi 10 modul pengurusan berkuasa tinggi:
1. **Dashboard Analitis Utama (`admin.html`)**:
   * KPI Cards: Jumlah Pendapatan (RM), Jumlah Tempahan, Kadar Penggunaan Armada (%), dan Kenderaan Aktif.
   * Carta analitis pendapatan dan statistik harian.
2. **Pengurusan Armada Kenderaan (`fleet.html`)**:
   * Operasi CRUD kenderaan (Tambah, Edit, Padam, Tukar Status Ketersediaan / Penyelenggaraan).
3. **Pengurusan Tempahan & Pulangan (`bookings.html`)**:
   * Senarai semak tempahan harian (*Today's Pickups & Returns*).
   * Penapis julat tarikh tersuai.
   * Borang cipta tempahan manual oleh staf (*New Booking Modal*).
4. **Pemasaran, Promosi & Harga Bermusim (`marketing.html`)**:
   * Kawalan banner pengumuman laman web.
   * Cipta dan urus kod kupon promosi (*Promo Codes*).
   * Penetapan kadar lonjakan harga musim perayaan (*Seasonal Surge Pricing*).
5. **Pengurusan Pelanggan & Audit (`customers.html` / `audit.html`)**:
   * Semakan rekod pemandu dan log jejak keselamatan sistem.

---

### 🤖 FASA D: Enjin Kecerdasan Buatan (AI Engine)

1. **Pembantu Maya AI Pintar (*AI Concierge Chatbot*)**:
   * Mengesan peranan dan portal pengguna secara automatik (Pelanggan / Pentadbir / Pelawat).
   * Membantu menjawab soalan sewaan, peraturan jalan raya Melaka, dan mencadangkan kereta mengikut bilangan penumpang serta bajet.
2. **Algoritma Pengesyoran Kenderaan Pintar (*Smart Car Recommendation*)**:
   * Mencadangkan kenderaan yang paling relevan pada papan pemuka pelanggan berdasarkan sejarah perjalanan lalu.

---

### 🎨 FASA E: Reka Bentuk Apple HIG & Penalaan Pengalaman Pengguna (UX)

Sepanjang pembangunan FYP 2, reka bentuk visual telah dinaik taraf mengikut garis panduan **Apple Human Interface Guidelines (HIG)**:
1. **Penyatuan Master CSS (`wedrive.css`)**:
   * Mengamalkan sistem *Single Source of Truth* CSS dengan penyingkiran kod lapuk/bersepah.
   * Kad Bento dengan jejari sudut ergonomik (`20px` - `24px`), sempadan kaca halus (*glassmorphism*), dan bayang-bayang Apple.
2. **Sistem Dwi-Tema Bebas Peranti (*Per-Device Dark/Light Mode SOP*)**:
   * Mod tema disimpan secara eksklusif dalam `localStorage` setiap peranti pelanggan dengan keupayaan pengesanan automatik tema sistem operasi (`prefers-color-scheme`).
3. **Sistem Dwi-Bahasa Pintar (*Bilingual Support: BM & EN*)**:
   * Pertukaran bahasa pantas dengan kamus terjemahan setempat untuk teks antaramuka.
   * Penyelarasan menegak butang Bahasa (`EN`/`MS`) dan Suis Tema pada paras seimbang (*pixel-perfect vertical alignment*).
4. **Kalendar Popover Apple HIG Universal (`calendar.js`)**:
   * Rekabentuk popover kaca moden dengan padding seimbang `18px` kiri dan `18px` kanan (**simetri 100%**).
   * Susun atur pengepala Apple HIG: Bulan & Tahun di sebelah kiri, butang navigasi `<` dan `>` dikumpulkan kemas di sebelah kanan atas.
   * Menghapuskan semua kalendar bawaan pelayar mentah di bahagian Admin dan menyatukan seluruh sistem kepada **SATU** kalendar popover Apple.
5. **Animasi Maklum Balas Pintar**:
   * *Apple Error Shake*: Menggoncangkan medan Tarikh Pemulangan sekiranya pengguna menekan tarikh pemulangan sebelum memilih tarikh pengambilan.
   * *Pickup Highlight Pulse*: Menyorotkan medan Tarikh Pengambilan dengan denyutan biru Apple dan membuka kalendar secara automatik.
6. **Penyelarasan Butang Aksi**:
   * Butang `Batal` dan `Simpan` pada semua modal diselaraskan pada ketinggian tepat `38px` dan dijajarkan secara *pixel-perfect*.

---

## 📊 4. Perbandingan Status: FYP 1 vs FYP 2

| Ciri / Komponen | Fasa FYP 1 (BITU3973) | Fasa FYP 2 (BITU3983 - Terkini) |
| :--- | :--- | :--- |
| **Pangkalan Data** | Fail JSON Statik (`data.json`) | **Supabase PostgreSQL Cloud (Singapore Region)** |
| **Pengesahan Pengguna** | Simulasi mudah | **Supabase Real Auth (Email/Pass + Google OAuth 2.0)** |
| **Katalog Kenderaan** | Statik dalam kod | **Dinamik dari DB (CRUD Penuh di Admin Panel)** |
| **Aliran Tempahan** | Tiada simpanan kekal | **Tempahan sebenar, invois digital, kiraan automatik** |
| **Kiraan Detik Sewaan** | Tiada | **Live Countdown Timer masa nyata pada kad Bento** |
| **Enjin AI & Chatbot** | Konsep teori | **AI Chatbot aktif dengan pengesanan portal automatik** |
| **Reka Bentuk UI/UX** | Prototaip asas web | **Apple Human Interface Guidelines (Bento, Glass, HIG)** |
| **Mod Gelap (Dark Mode)** | Terhad/statik | **Per-Device Client-Side Storage + Auto OS Detect** |
| **Bahasa (Bilingual)** | Bahasa Inggeris sahaja | **Dwi-bahasa (BM & EN) masa nyata tanpa muat semula** |
| **Sistem Kalendar** | Bercampur/Mentah pelayar | **1 Sistem Universal Apple HIG Popover Symmetrical** |
| **Pengurusan Kod & Versi**| Simpanan awal Git | **Versi teratur dengan Semantic Tagging (v5.2.35)** |

---

## 🏷️ 5. Maklumat Repositori & Kawalan Versi

* **Platform Kod Sumber:** GitHub (`hdanial211/WeDRIVE`)
* **Cabang Utama:** `main`
* **Versi Semasa Sistem:** `5.2.35`
* **Dokumentasi Terperinci:** Tersedia dalam [walkthrough.md](file:///Users/hakim/.gemini/antigravity-ide/brain/bb4db351-181d-49dd-870b-f9c0f3f1b4dc/walkthrough.md)
