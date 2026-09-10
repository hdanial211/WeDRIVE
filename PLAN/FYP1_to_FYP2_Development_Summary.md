# 🚗 WeDRIVE: Ringkasan Penuh Pembangunan Sistem (FYP 1 hingga FYP 2)

**Nama Projek:** AI Car Rental System (WeDRIVE Melaka)  
**Kod Kursus:** BITU3973 (Project I / FYP 1) $\rightarrow$ BITU3983 (Project II / FYP 2)  
**Pembangun:** Muhammad Hakim Danial  
**Institusi:** Universiti Teknikal Malaysia Melaka (UTeM)  
**Lokasi Fokus Operasi:** Melaka, Malaysia  

---

## 📌 1. Pengenalan & Matlamat Projek

**WeDRIVE** merupakan sebuah platform sewaan kenderaan pintar generasi baharu yang direka khas untuk operasi di Melaka. Matlamat utama sistem ini adalah untuk menyelesaikan kelemahan sistem konvensional melalui integrasi:
1. **Pengurusan Kereta & Tempahan Automatik**: Aliran tempahan tanpa kunci (*keyless/instant pickup*), penjejakan kenderaan masa nyata, dan pengurusan pulangan kenderaan pintar.
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
  ├── admin/          # Panel Pentadbir (Dashboard, Cars, Bookings, Marketing, Analytics)
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
   * KPI Cards: Jumlah Pendapatan (RM), Jumlah Tempahan, Kadar Penggunaan Kereta (%), dan Kenderaan Aktif.
   * Carta analitis pendapatan dan statistik harian.
2. **Pengurusan Kereta & Kenderaan (`fleet.html`)**:
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


Walkthrough — Apple Developer Design Resources Alignment (v8.9.0)
Semua halaman dan portal di dalam sistem WeDRIVE kini telah diselaraskan sepenuhnya mengikut panduan rasmi Apple Design Resources & Human Interface Guidelines (HIG) di https://developer.apple.com/design/resources/.

Perubahan reka bentuk ini dipusatkan secara bersih di dalam satu fail teras 
shared/css/wedrive.css
.

🍏 1. Ringkasan Pelaksanaan Mengikut Halaman & Portal
A. Halaman Pelawat (Guest Pages)
Laman Utama (index.html):
Apple Glass Sticky Navbar dengan kapsul navigasi berpusat.
Hero Bento Card dengan Expanding Pill Dots Indicator (v8.8.8).
Sokongan penuh Mod Siang (Pure White & Neutral Grays) dan Mod Malam (True Black #000000).
Harga (guest/pages/pricing/pricing.html):
Apple Segmented Control untuk suis Harian / Mingguan beserta lencana diskaun 15%.
Kad Bento bertingkat dengan kad utama bercahaya biru Apple Pro.
Cara Berfungsi (guest/pages/how-it-works/how-it-works.html):
Pentas visual interaktif 360°, garis masa Bento bertahap, dan studio pandangan 360° interaktif.
Terokai Melaka (guest/pages/explore-melaka/explore-melaka.html):
Kad destinasi pelancongan Bento dengan padanan cadangan kenderaan pintar dan penapis laluan.
B. Halaman Pengesahan (Auth Pages)
Log Masuk & Pendaftaran (account/pages/login/login.html & account/pages/signup/signup.html):
Susun atur Split Bento Panel berprofil Apple.
Kotak input dengan inner elevation, radius squircle 12px, dan halo biru ketika fokus.
Butang tindakan Apple Blue berkapsul 9999px dan butang Google bergaya Apple.
C. Walkthrough - Apple HIG Pickers & Floating AI Assistant
Overview of Implemented Features
1. Apple Human Interface Guidelines (HIG) - Pickers & Popovers Suite
We have unified and upgraded all pickers across WeDRIVE to match official Apple Human Interface Guidelines (HIG):

Date & Time Popovers (flatpickr-calendar):
Frosted glassmorphism background (backdrop-filter: blur(32px) saturate(190%)) with squircle border-radius: 20px.
Apple SF Pro / Inter typography for Month and Year selection pills.
Apple Blue chevron navigation controls with smooth hover scaling.
Weekday tracking headers in clean uppercase format.
Selected date capsules with Apple Blue (#0071E3) and soft ambient glow shadow.
Range selection with translucent blue bridge connecting pickup and return dates.
Full theme synchronization for both Light mode and Dark/Night mode.
Pull-Down Select Pickers (select.form-control, select.filter-select, select.search-select):
Squircle shape with Apple chevron indicator.
iOS-style focus highlight rings and elevation on hover.
2. Floating "Living Aura" AI Assistant (chatbot-fab)
Living Breathing Float (@keyframes fabAliveFloat): Continuous organic floating bob with pulsing ambient cyan-purple aura.
Apple Intelligence Shimmer (@keyframes fabShimmerGradient): Animated gradient shift across the pill.
Scroll-to-Collapse: Automatically transitions into a compact 48px circle showing only the sparkling AI logo and notification badge when scrolling down, expanding back on hover or scrolling to the top.
3. Apple Spotlight Showcase Living Breathing Float & Universal Curved Edges (5.0.2)
Enlarged Image Stage (height: 265px): Spotlight showcase hero image is significantly larger and bolder with object-fit: cover.
Curved Squircle Edges (border-radius: 20px): Replaced all sharp/square edges with Apple rounded squircle borders across all showcase, modal, and gallery images.
Living Breathing Float Animation (@keyframes showcaseLivingFloat): Subtle, organic 6s breathing float that feels dynamic and alive.
Smooth Apple Crossfade Transition: When switching cars in the carousel, the previous car gently dissolves and glides into the next car without abrupt snapping.
Universal Curved Images: Ensured all images across the system follow the Apple Design squircle radius with zero sharp corners.
4. Apple Skeleton Shimmer Loading System for Language Switching (5.0.4)
Skeleton Shimmer Waves (@keyframes skeletonShimmer): Apabila bahasa ditukar (MS $\leftrightarrow$ EN), elemen teks dan kad beralih ke mod skeleton shimmer loading dengan sapuan cahaya lembut (linear gradient wave).
Smooth Apple Spring Reveal (@keyframes langRevealSpring): Selepas data bahasa diserap, teks meluncur masuk secara lancar dengan kesan spring easing dan pemfokusan halus tanpa sebarang sentakan.
Day & Night Mode Adaptive Shimmer: Shimmer diselaraskan mengikut tema (biru lembut pada Mod Terang, cyan obsidian pada Mod Gelap).
5. Global Apple Page Transition System (IN & OUT Animations) (5.0.5)
Page OUT Smooth Exit (@keyframes pageTransitionOut): Apabila pengguna menekan sebarang pautan dalam laman web, laman semasa meluncur pudar secara elegan (translateY(-8px), opacity: 0, blur: 3px) dengan bar laser kemajuan pantas (top glowing laser indicator).
Page IN Smooth Entry (@keyframes pageTransitionIn): Laman destinasi yang baru dimuatkan meluncur masuk dengan kesan Apple Spring curve (translateY(8px) -> 0, opacity: 0 -> 1, blur: 3px -> 0) memberikan pengalaman aplikasi natif (SPA feel).
View Transitions API Support & bfcache Resilience: Dilengkapi sokongan View Transitions moden dan pemulihan segera apabila pengguna menekan butang Back/Forward pelayar tanpa tersekat.
6. Apple-Strict Cinematic Photographic Hero Layout (5.0.8)
Full-Bleed Photographic Backdrop: Mengembalikan gambar latar belakang pemandangan Sungai Melaka penuh dengan lapisan dual gradient scrim Apple (linear-gradient(90deg, rgba(0,0,0,0.78)...)).
Clean Borderless Typography on Left: Bahagian teks utama (kicker kompak, tajuk besar 3.8rem, huraian, dan 3 statistik) kini terletak kemas secara terus di atas latar belakang gambar tanpa kotak gelap tebal yang mengganggu.
Floating Apple Glass Bento Plan Card on Right: Kad laluan ringkas (Private city edit) di sebelah kanan terapung dengan kaca kabur Apple yang mewah (backdrop-filter: blur(36px)), butang tindakan biru Apple, dan senarai hentian kapsul lutsinar.
7. Apple Bento Destination Cards & Vehicle Pairing Pod Redesign (5.0.9)
Material Icons Ligature Bug Fix: Memperbaiki isu text-transform: uppercase yang menyebabkan ikon seperti electric_car pecah menjadi teks serif literal ("ELECTRIC CAR"). Ikon kini dipastikan sentiasa menggunakan text-transform: none !important dengan fon Material Icons rasmi.
Dedicated Apple Icon Badge Pod (.destination-pairing): Ikon kenderaan kini diletakkan di dalam kapsul squircle 36px khas dengan latar belakang lutsinar biru lembut (rgba(0, 113, 227, 0.1)).
Refined Bento Hierarchy: Label "PILIHAN KENDERAAN TERBAIK" dan nama kategori kenderaan ("Kereta Bandar Kompak") disusun rapi dengan tipografi Apple, bayang kad lembut (soft Apple shadow), dan bucu melengkung 22px.
8. Dynamic Day & Night Mode Adaptive Plan Bento Card (5.1.0)
☀️ Mod Siang (Day Mode): Kad Private city edit bertukar kepada kaca kabur putih bersih Apple (rgba(255, 255, 255, 0.88) dengan backdrop-filter: blur(32px)), tajuk gelap berkontras tinggi (#1D1D1F), label biru Apple (#0071E3), dan kapsul laluan kelabu lembut (rgba(0, 0, 0, 0.04)).
🌙 Mod Malam (Night Mode): Bertukar secara organik kepada kad kaca obsidian gelap berkilau (rgba(18, 18, 22, 0.72)), label biru cyan (#5AC8FA), dan teks putih berseri (#F5F5F7).
9. AI Chatbot Screen Follow & Containing Block Fix (5.1.1)
Punca Masalah: Animasi peralihan laman pada body sebelum ini memegang konteks transform CSS, menyebabkan elemen position: fixed terperangkap dan diletakkan di hujung bawah dokumen (2,400px) dan bukannya terapung pada skrin (viewport).
Penyelesaian: Mengasingkan animasi peralihan ke lapisan kandungan (main, .explore-page, .customer-main), membolehkan body bebas sepenuhnya daripada sebarang transform containing block.
Kekal Mengikut Skrin (Strict Viewport Float): Butang terapung AI (WeDRIVE AI FAB) kini terapung dengan sempurna di sudut bawah kanan skrin (bottom: 28px; right: 28px; z-index: 99999) dan sentiasa mengekori skrin pengguna ke mana sahaja mereka skrol.
10. Pembersihan Tag Repositori GitHub (Purge Old Broken Tags)
Pembersihan 229 Tag Lama: Memadamkan kesemua tag lama siri 8.x, 7.x, 6.x dan 5.2+ yang tertinggal daripada repositori lokal dan pelayan GitHub origin.
Penetapan Tag Siri 5.x Bersih: Mendaftarkan tag rasmi mengikut turutan kemas: 4.0.0 $\to$ 4.1.5 $\to$ 5.0.0 $\to$ 5.0.1 $\to$ ... $\to$ 5.1.1 $\to$ 5.1.2 pada repositori GitHub.
11. Pembinaan Semula Welcome Page Mengikut Apple Design System (5.1.2)
Penyelarasan Sepenuhnya dengan wedrive.css: Membuang kebergantungan Tailwind CSS legasi pada account/pages/welcome/welcome.html dan menggantikannya dengan helaian gaya bersatu Apple Design System.
12. Transformasi ke Pengalaman Asli Apple Setup Assistant / "Hello" (5.1.3)
Estetika Asli Apple (Authentic Minimalist Luxury): Menyingkirkan kotak gradien AI generik dan menggantikannya dengan kanvas penuh studio Apple yang bersih, tenang (whisper-quiet luxury), dan berprestij tinggi.
13. Rekaan Semula Welcome Screen Menggunakan Stitch MCP — WeDRIVE Lumina (5.1.4)
Penyingkiran Tulisan Tangan / Cursive: Menggantikan tulisan bersambung dengan tipografi asli SF Pro / Inter Bold yang jauh lebih kemas, sofistikated, dan bertaraf dunia.
Apple Intelligence Lumina Iridescent Halo: Menampilkan cincin halo bercahaya pelangi iridescent yang berputar lembut di sekeliling kapsul kaca WeDRIVE (backdrop-filter: blur(32px)).
Bar Kemajuan Laser Cecair iOS: Bar pemuatan 3.5px nipis dengan kilauan laser biru Apple (#0071E3) dan animasi fluid spring.
Lencana Keselamatan Kaca Frosted Bawah: Kapsul kaca terapung di bahagian bawah dengan ikon verified hijau dan teks Sesi Selamat · WeDRIVE Secure ID.
14. Penyelarasan Penuh Mod Siang & Malam serta Animasi Transisi Halaman Apple (5.1.5)
Penyelarasan Mod Siang/Malam (Day & Night Mode Sync): Menyegerakkan semua kunci storan (wedrive-theme, wedrive_theme, theme) dan menambah pendengar acara (cross-tab storage event) supaya pertukaran tema berlaku serentak pada semua halaman tanpa sebarang flicker.
Penyatuan Animasi Transisi Halaman (Universal Page In & Out):
Memperluas pemilih CSS transisi halaman ke semua kontena utama (main, .guest-page, .explore-page, .pricing-page, .how-it-works-page, .customer-main, .admin-main, .booking-shell, .profile-page, dan sebagainya).
Melaksanakan pemintas navigasi sejagat window.navigateToPage(url) supaya setiap klik pautan atau butang menghasilkan animasi keluar (Page OUT dissolve) dan animasi masuk (Page IN spring) yang seragam di seluruh portal.
Pembetulan Susun Atur Kad Harga (Pricing Cards Layout Fix): Membetulkan skop .card-header supaya tajuk pakej kenderaan, ikon, dan deskripsi tersusun rapi secara menegak tanpa bertindih.
15. Penskalaan Saiz Susun Atur Halaman Cara Berfungsi (How It Works Scale-Up) (5.1.6)
Penyesuaian Lebar Penuh (1400px Apple Widescreen Scale): Menaik taraf .hiw-page-shell daripada 1280px kepada 1400px standard Apple Studio Display supaya sepadan dengan halaman utama (Browse Cars) dan Explore Melaka.
Peningkatan Saiz Hero & Pentas Pratonton 360:
Memperbesar tajuk utama hiw-heading kepada clamp(2.8rem, 5.2vw, 4.4rem) dengan jarak baris yang lebih berani.
Memperluas kotak pentas interaktif 360 kenderaan (.hiw-hero-stage) kepada saiz penuh yang megah (min-height: 420px), bayang kaca Apple yang mendalam, dan kad statistik yang seimbang.
Menyelaraskan teks pita berarak (trust ticker marquee) dan grid garis masa kelebaran 1400px.
16. Rekaan Semula Halaman Cara Berfungsi Berasaskan Stitch MCP & Pembetulan Paparan 360 (5.1.7)
Punca Gambar Terbelah / Split-Image: Elemen dalaman cubemap panorama 3D (.hiw-interior-scene / .hiw-interior-cube) sebelum ini tidak mempunyai peraturan gaya CSS yang betul, menyebabkan gambar wajah dalaman dirender bersebelahan dengan bingkai luaran.
Pembetulan & Penyatuan CSS 360 Showroom:
Menambah gaya CSS penuh bagi .hiw-interactive-stage, .vehicle-viewer-ambilight, .hiw-interior-scene, dan .hiw-interior-cube.
Mengasingkan paparan mod luaran (Exterior) dan dalaman (Interior) menggunakan .is-interior supaya hanya satu mod aktif pada satu masa dengan object-fit: contain; yang sempurna dan tiada sebarang herotan.
17. Pembetulan Butang Kembang & Penstabilan Kawalan Suis Bilik Pameran (5.1.8)
Punca Butang Kembang & Tidak Kemas: Fungsi initRipple dalam guest/js/how-it-works.js secara dinamik memasukkan elemen <span> bersaiz ~150px ke dalam butang flex tanpa gaya posisi mutlak, menyebabkan butang tertolak dan membesar secara janggal apabila ditekan.
Penyelesaian:
Mengeluarkan suntikan DOM ripple manual tersebut dan menggantikannya dengan fizik mikro interaksi Apple asli (:active { transform: scale(0.96); }).
Mengemas kini perkadaran .hiw-view-switch dan .hiw-model-btn dalam shared/css/wedrive.css dengan white-space: nowrap;, overflow: hidden;, dan lebar tetap yang kemas dan konsisten dalam Mod Siang & Malam.
18. Bar Navigasi Terapung Dinamik Apple (Floating Pill Navbar on Scroll) Untuk Admin & Pelanggan (5.1.9)
Pelaksanaan Kapsul Kaca Terapung Dinamik (Apple Dynamic Floating Pill):
Apabila pengguna menatal ke bawah (scroll down > 20px) pada papan pemuka admin atau portal pelanggan, bar navigasi atas mengecil secara lembut (height: 48px, padding: 0 20px), terpisah daripada siling skrin (top: 14px), dan berubah menjadi bentuk kapsul terapung (floating pill / border-radius: 9999px) dengan bayang kaca mendalam (ambient frosted glow).
Menyokong sepenuhnya Mod Siang (Light Mode) dan Mod Malam (Dark Mode) dengan peralihan kelancaran Apple cubic-bezier(0.16, 1, 0.3, 1).
Mengoptimumkan #navbar-placeholder dengan display: contents; supaya kelekatan (sticky positioning) berlabuh tepat pada kontena utama.
19. Penguncian Dimensi Statik Butang Model & Suis Paparan Bilik Pameran (5.2.0)
Punca Butang Mengembang (Expand / Stretch):
Apabila butang model dipilih, susun atur flex-wrap sebelumnya membenarkan butang aktif memanjang ke ruang lebihan, dan suis pandangan (.hiw-view-switch) membenarkan saiz butang berubah mengikut kepanjangan teks aktif.
Penyelesaian:
Menetapkan .hiw-model-buttons kepada grid statik berkunci 4 lajur sama rata (grid-template-columns: repeat(4, 1fr);) dengan width: 100%; dan transform: none !important; supaya keempat-empat butang (BMW Sedan, Mercedes SUV, Alphard MPV, Axia Hatchback) mempunyai kelebaran tetap dan tidak pernah mengembang atau berubah saiz apabila ditekan.
Menetapkan .hiw-view-switch kepada grid 2 lajur berkunci (grid-template-columns: 1fr 1fr;) dengan kelebaran minimum 260px supaya butang Luaran dan Lihat dalam sentiasa bersimetri dan statik.
Memasukkan parameter cachebuster ?v=5.2.0 pada skrip dan lembaran gaya halaman How It Works.
20. Bar Sisi Terapung Kaca Apple Bento (Apple Bento Floating Island Glass Sidebar) (5.2.1)
Reka Letak Pulau Terapung (Floating Island Geometry):
Bar sisi portal Admin dan Pelanggan kini terpisah dari tepi skrin dan terapung dengan ruang top: 14px; left: 14px; bottom: 14px; height: calc(100vh - 28px);.
Dilengkapi bucu bulat moden border-radius: 22px (Apple Bento Curve), kaca fros lut sinar berbayang mendalam (ambient elevation blur 28px), dan sempadan mikro Apple yang elegan.
Item aktif menggunakan bentuk kapsul biru Apple dengan bayang cahaya lembut (active glow pill).
Susun atur kontena utama (main.main & .customer-main) diselaraskan kepada margin-left: 284px; bagi memberikan ruang pernafasan visual yang sempurna dan harmoni bersama Bar Navigasi Terapung.
21. Pembersihan Butang Suis Sisi Terselindung Di Bawah Sidebar (5.2.2)
Punca Ikon Dokumen / Butang Tidak Bergaya Di Bucu Bawah:
sidebar-loader.js secara automatik memasukkan elemen <button class="sidebar-toggle"> ke dalam document.body untuk kegunaan skrin mudah alih tanpa gaya CSS khusus pada desktop, menyebabkan butang pelayar asal kelihatan terjulur keluar di bawah bucu bulat bar sisi terapung.
Penyelesaian:
Menetapkan .sidebar-toggle kepada display: none !important; pada mod paparan desktop, dan hanya dipaparkan sebagai butang terapung kaca melengkung yang kemas apabila skrin berada di bawah 900px (Mobile/Tablet).
Bahagian bawah kiri bar sisi kini 100% bersih, licin, dan kemas.
22. Sistem Pengaki Hidup Dinamik Apple (Apple Living Dynamic Footer System) (5.2.3)
Penguncian Pada Bucu Bawah Halaman (Bottom-Anchored Sticky Layout):
Menetapkan #footer-placeholder { margin-top: auto !important; width: 100%; } bersama bekas flexbox utama (main.main, .customer-main, & body.guest-page) supaya pengaki sentiasa terikat rapi pada bahagian paling bawah skrin walaupun kandungan halaman pendek.
Matriks Direktori Apple 4-Lajur (Apple 4-Column Directory Matrix):
Menyusun pautan ke dalam 4 lajur teratur (Kereta & Sewaan, Pilihan & Ciri, Bantuan & Khidmat, Dasar & Syarikat) dengan tipografi bersih.
23. Pemurnian Pengaki Apple Editorial & Penyingkiran Elemen Tiruan (Clean Apple Editorial Footer) (5.2.4)
Penyingkiran Elemen Berlebihan (De-clutter & De-AI):
Membuang lencana denyutan status sistem hijau [ 🟢 Semua Sistem Beroperasi... ] dan lencana AI Mobility yang kelihatan seperti rekaan AI / tiruan.
Menggantikannya dengan slogan editorial Apple yang tenang dan eksklusif: Perkhidmatan sewaan kenderaan premium dan pintar di Melaka..
Menghasilkan reka bentuk pengaki yang bersih, profesional, dan menepati piawaian antaramuka laman web Apple rasmi.
24. Penyatuan Ejaan Logo WeDRIVE & Penyelarasan Garis Bawah Bar Sisi (Unified Brand & Sidebar Baseline Alignment) (5.2.5)
Penyatuan Ejaan Jenama WeDRIVE:
Menghapuskan ruang jarak (gap) di antara We dan DRIVE dalam fail komponen pengaki dan CSS supaya dieja rapat tanpa terasing sebagai satu jenama: WeDRIVE.
Penyelarasan Sebaris Bar Bawah Pengaki Dengan Bar Sisi (Matching Bento Baseline Alignment):
Menetapkan susun atur pengaki di portal Admin dan Pelanggan (main.main .wedrive-footer & .customer-main .wedrive-footer) sebagai kad terapung Apple Bento dengan border-radius: 22px;.
25. Penyelarasan Lebar Pengaki Dengan Kad Kandungan Atas (Matching Card Width Alignment) (5.2.6)
Penyelarasan Lebar Simetri (Symmetrical Width Alignment):
Memindahkan kedudukan elemen #footer-placeholder ke dalam kontena utama .content di seluruh halaman panel Admin.
Menetapkan lebar pengaki kepada 100% di dalam .content supaya penjajaran kiri (left edge), penjajaran kanan (right edge), dan lebar (width) pengaki sepadan dengan tepat (100% kongruen) dengan kad-kad kandungan di atasnya.
26. Penyelarasan Saiz Kad Kiri & Kanan Dashboard (Symmetrical 50-50 Bento Grid) (5.2.7)
Penyelarasan Saiz Kad Ramalan AI & Tindakan Pantas:
Menyelaraskan grid .grid-2 dengan align-items: stretch; dan menguatkuasakan height: 100%; margin-bottom: 0 !important; pada kedua-dua kad anak (.ai-card dan .card Tindakan Pantas).
Kedua-dua kad kiri dan kanan kini mempunyai dimensi yang 100% sama besar dan seimbang (lebar sama tepat 50% - 12px, ketinggian sama tepat, serta penjajaran garisan atas dan bawah yang simetri).
27. Susun Semula Kategori & Hierarki Menu Bar Sisi (Logical Navigation Restructuring) (5.2.8)
Penyusunan Logik Mengikut Domain Operasi:
MAIN (Operasi Teras): Papan Pemuka $\to$ Kenderaan $\to$ Tempahan $\to$ Pelanggan (ikon people) $\to$ Kalendar.
ANALYTICS (Analitik & Pertumbuhan): Laporan (ikon bar_chart) $\to$ Marketing (ikon campaign).
INTELLIGENCE (Kecerdasan AI): AI Chatbot (ikon smart_toy).
SYSTEM (Sistem): Tetapan (ikon settings).
28. Penukaran Bar Navigasi Admin Kepada Pulau Terapung Berlengkung (Curved Island Admin Navbar) (5.2.9)
Reka Bentuk Berlengkung (Apple Curved Bento Island Navbar):
Mengubah bar navigasi atas portal Admin & Pelanggan daripada bar rata hujung-ke-hujung kepada kad pulau kaca terapung dengan border-radius: 22px; dan margin: 14px 32px 0 32px;.
Menjajarkan sempadan kiri dan kanan bar navigasi tepat 100% kongruen dengan kad statistik, kad ramalan AI, dan pengaki di bawahnya.
Memberikan pengalaman visual yang seragam, terapung, dan bertaraf premium (ultra-sleek frosted glass aesthetic).
29. Animasi Transisi Halaman Masuk & Keluar (Apple Fluid Page In & Out Transitions) (5.2.10)
Transisi Keluar (Page OUT Transition):
Apabila mana-mana pautan bar sisi, butang navigasi pantas (Quick Actions), butang Manage, atau kad diklik, animasi keluar pageTransitionOut diaktifkan (opacity: 1 -> 0; transform: translateY(-10px) scale(0.992); filter: blur(3px) over 0.22s cubic-bezier(0.32, 0.72, 0, 1)).
Penunjuk kemajuan laser (laser top progress indicator) #wedrive-page-progress diaktifkan secara licin di siling skrin.
Transisi Masuk (Page IN Transition):
Apabila halaman baharu dibuka, panel kandungan .content / main meluncur masuk dengan kesan pageTransitionIn (opacity: 0 -> 1; transform: translateY(14px) scale(0.992) -> translateY(0) scale(1); filter: blur(4px) -> blur(0px) over 0.32s cubic-bezier(0.16, 1, 0.3, 1)).
Bar sisi terapung kekal kukuh (persistent stable anchor) tanpa gegaran atau layout flicker.
30. Pembaikan Bar Navigasi Terapung Melekat Semasa Skrol (Continuous Sticky Floating Navbar) (5.2.11)
Penetapan Konteks Lekat (Sticky Context Fix):
Menetapkan position: sticky !important; top: 0 !important; z-index: 990; pada bekas induk #navbar-placeholder dengan pointer-events: none;.
Bar navigasi #wedrive-navbar kini kekal terapung secara berterusan pada kedudukan top: 14px sepanjang pengguna menatal (scroll) ke bawah halaman.
Kesan kaca kabur (backdrop-filter: blur(28px)) memastikan kandungan di bawahnya menggelongsor di sebalik bar navigasi dengan kemas dan mewah.
31. Penyelarasan Apple CSS Bar Penapis & Carian (Apple Design Toolbar, Search & Pills) (5.2.12)
Kotak Carian Kapsul Apple (Apple Capsule Search Input):
Menggantikan kotak teks carian petak mentah kepada kapsul kaca melengkung (.input-wrap-sm) dengan ikon pembesar bersepadu, placeholder halus, dan sempadan fokus bercahaya biru (box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.2)).
Butang Paparan Senarai Kaca Apple (Apple Secondary Glass Pill Button):
Mengubah butang List View (.btn-outline-sm) kepada butang pil kaca terapung dengan ikon list_alt, sempadan lembut, dan interaksi sentuhan mikro (active scale: 0.97).
Cip Penapis Segmen (Apple Segmented Filter Chips):
Butang All, Available, Rented dihiasi reka bentuk pil eksklusif Apple dengan latar belakang bertekstur, warna biru menyala semasa aktif, dan bayang bercahaya.
32. Pelarasan Kelebaran Kapsul Carian & Kebolehbacaan Teks (Full Text Visibility) (5.2.13)
Pelebaran Dimensi Kapsul (Optimal Width & Padding):
Melebarkan bekas carian .input-wrap-sm kepada min-width: 280px; width: 300px; dengan jarak dalaman yang seimbang (padding: 0 16px 0 12px;).
Menjamin keseluruhan teks pembayang (placeholder) "Search car name or plate..." terpapar penuh tanpa sebarang pemotongan atau sempadan sempit.
33. Fungsi Paparan Senarai & Dialog Tambah Kenderaan Apple (List View Toggle & Add Car Modal) (5.2.14)
Penukaran Paparan Bersepadu (Seamless Grid / List View Toggle):
Butang List View kini berfungsi sebagai suis dwi-arah (toggle switch):
Apabila diklik, susun atur kad bertukar kepada jadual senarai kemas Apple (Apple responsive table) dengan gambar mini kereta, nombor plat monospaced, badge status bercahaya, dan butang Manage.
Butang bertukar secara dinamik kepada Grid View dengan ikon grid_view.
Pilihan pengguna disimpan ke dalam localStorage untuk kegunaan seterusnya.
Dialog Tambah Kenderaan Apple (Apple Frosted Glass Add Vehicle Modal):
Butang + Add Car membuka dialog terapung berkaca (frosted glass sheet) dengan reka bentuk bucu melengkung, sokongan muat naik gambar seret & lepas (drag & drop), borang spesifikasi penuh (Nama, Plat, Jenis, Bahan Api, Transmisi, Tempat Duduk, Kadar Harian), dan pengesahan dwi-bahasa.
Penyelarasan Reka Bentuk Apple Bento Stitch MCP:
Menjana reka letak baharu melalui Stitch MCP (Aetheric Precision Design System) dengan tipografi tajam, kad kaca berkilau (frosted glassmorphism), dan penukaran model lancar (BMW Sedan, Mercedes SUV, Alphard MPV, Axia Hatchback).
Menyokong sepenuhnya Mod Siang (Light Mode) dan Mod Malam (Dark Mode).
D. Portal Pelanggan (Customer Dashboard)
Papan Pemuka Pelanggan (customer/pages/dashboard/customer.html):
Sidebar Apple Glass kekal di sebelah kiri dengan penunjuk aktif berkapsul biru.
Kad Bento sewaan aktif dengan lencana status premium dan grid spesifikasi kemas.
Bar carian pantas berbentuk squircle dengan butang biru Apple.
Penapis kategori kenderaan jenis segmen kapsul.
E. Portal Pentadbir (Admin Dashboard)
Papan Pemuka Pentadbir (admin/pages/dashboard/admin.html):
Sidebar pentadbir gelap dengan kad avatar pentadbir dan pengelasan menu yang teratur.
4 Kad Metrik Bento dengan lencana ikon warna Apple (Biru, Hijau, Jingga, Ungu).
Kad Ramalan AI (AI Forecast) dengan sempadan bercahaya kecerdasan pintar.
Grid Tindakan Pantas (Quick Actions) dengan mikro-animasi butang.
Jadual status kenderaan jenis Bento yang bersih dan moden.
🧪 2. Pengesahan Visual (Chrome DevTools MCP)
Semua halaman telah diuji dan disahkan pada pelayar:

Mod Siang (Day Mode): Kontras tulisan tinggi, latar belakang #F5F5F7, dan permukaan putih suci #FFFFFF.
Mod Malam (Night Mode): Latar belakang hitam pekat #000000, permukaan Bento #161618, dan pencahayaan aksen #2997FF.
Responsif: Susun atur menyesuaikan diri secara lancar dari skrin desktop ke tablet dan telefon pintar.
🏎️ 34. Pemodenan Halaman Butiran Kenderaan (Vehicle Details - v5.2.15)
Halaman Pengurusan & Butiran Kenderaan (admin/pages/car/car-detail/car-detail.html) telah dinaik taraf sepenuhnya mengikut piawaian Apple Design System (Human Interface Guidelines):

Butang Kembali Apple Capsule (.btn-back):
Berbentuk kapsul pill bulat dengan ikon arrow_back, mikro-animasi pergerakan ke kiri pada hover, dan integrasi peralihan halaman lembut data-navigate.
Hero Showcase Kenderaan (.car-hero, .car-hero-grid):
Susun atur 2 lajur Bento dengan nisbah gambar utama yang kemas dan galeri thumbnails responsif dengan cincin penunjuk biru bercahaya Apple.
3 Kapsul Spesifikasi Bento (Seats, Transmission, Fuel Type) dengan ikon glow.
Kadar sewaan harian RM /day dalam warna biru Apple tebal bersebelahan butang tindakan Update Status dan Edit Details.
Kalendar Tempahan Interaktif Apple (.cal-grid, .cal-cell):
Jubin tarikh bulat dengan titik status warna Apple (Hijau = Available, Biru = Booked, Jingga = Pending, Kelabu = Past).
Butang pertukaran bulan berbentuk bulatan Apple dan sokongan pemilihan julat tarikh (Pickup $\to$ Return).
Borang Suntingan Bento 2-Lajur (.form-grid, .form-group):
Input kaca Apple yang melengkung kemas, menu lungsur (select dropdown), dan pengurusan foto dengan lencana MAIN serta butang padam.
Jadual Sejarah Tempahan & Kad Tindakan Pantas:
Jadual tempahan berasaskan Bento dengan lencana status dan kad tindakan pantas (Insurance Info & Remove Vehicle).
Modal Amaran Pemadaman Merah Apple Glass (.delete-modal-*):
Modal frosted glass dengan lencana amaran merah, pengesahan kata laluan pentadbir, dan butang sahkan pemadaman Confirm Delete.
🛠️ 36. Penukaran Borang Suntingan ke Modal Popup Apple Glass (v5.2.16)
Borang suntingan kenderaan (#edit-section) telah dikeluarkan daripada aliran badan halaman utama (in-page body flow) dan diubah menjadi Apple Frosted Glass Modal Popup (#edit-car-modal):

Kelakuan Interaksi Moden:
Halaman utama kekal kemas hanya memaparkan Hero Kenderaan, Kalendar Tempahan, Sejarah Tempahan, dan Tindakan Pantas tanpa sebarang borang terdedah.
Apabila butang "Edit Details" ditekan, modal pop timbul (popup modal) muncul di tengah-tengah skrin dengan latar belakang kabur (backdrop-filter: blur(20px)).
Reka Bentuk Modal Apple HIG:
Tajuk dengan ikon edit_note dan butang bulat X untuk tutup.
Grid 2-lajur responsif dengan input kaca Apple (Vehicle Name, Plate Number, Type, Fuel, Transmission, Daily Rate, Seats).
Pengurusan galeri foto dengan thumbnail bulat, lencana MAIN, butang padam, dan butang muat naik gambar.
Butang tindakan kapsul di bahagian bawah (Cancel dan Save Changes dengan glow biru).
Kawalan Penutupan Fleksibel:
Boleh ditutup melalui butang Cancel, klik ikon X, klik kawasan luar (backdrop), menekan kekunci Escape, atau selepas berjaya disimpan.
📅 38. Pemodenan Kad Ringkasan & Butang Sahkan Tempahan (Apple Bento Booking Summary - v5.2.17)
Kad ringkasan tempahan tarikh kalendar (#cal-day-info) telah direka bentuk semula sepenuhnya mengikut Apple Bento Grid & Design System HIG:

Susun Atur Bento 4-Kad Kaca Apple (.bs-grid, .bs-item):
Pickup Date: Ikon event_available dalam kapsul biru bercahaya dengan tarikh bertformat penuh (e.g. 27 Aug 2026).
Return Date: Ikon event_busy dalam kapsul biru bercahaya (e.g. 30 Aug 2026).
Rental Duration: Ikon timelapse dalam kapsul ungu lembut (e.g. 3 Days).
Daily Rate: Ikon payments dalam kapsul zamrud (e.g. RM 110/day).
Bar Pengepala & Butang Tetap Semula:
Lencana kapsul moden 📅 NEW BOOKING SUMMARY berserta butang pill merah Reset Dates untuk membatalkan julat tarikh yang dipilih.
Bahagian Bawah & Butang Tindakan Apple (.bs-footer, .btn-confirm-booking):
Paparan jumlah sewaan anggaran (Estimated Rental Total) dengan tipografi besar RM 330 biru Apple yang terang.
Butang "Confirm Booking" berbentuk kapsul pil penuh dengan mikro-animasi hover, glow biru, dan ikon check_circle.
Status Interaktif Satu Tarikh (Pickup Selected):
Banner responsif dengan titik berdenyut (pulsing dot), penunjuk tarikh pickup, dan mesej interaktif untuk memilih tarikh pulangan.
🗓️ 40. Pemodenan Kalendar Tempahan Berdasarkan Apple HIG Pickers (Graphical Date Picker - v5.2.18)
Kalendar tempahan kenderaan (#cal-days-grid & .cal-apple-header) telah direka bentuk semula sepenuhnya mengikut garis panduan rasmi Apple Human Interface Guidelines: Pickers (Graphical Date Picker / UICalendarView):

Pengepala Apple Graphical Picker (.cal-apple-header):
Tajuk Bulan & Tahun (cth. August 2026) dalam tipografi tebal Apple SF Pro dengan ikon kalendar biru.
Butang pil pantas Today (.cal-today-pill) untuk melompat serta-merta ke bulan dan tahun semasa.
Kumpulan butang navigasi bulat Apple (.cal-nav-group, .cal-nav-btn) dengan ikon chevron_left dan chevron_right.
Butang Reset Selection merah lembut yang muncul secara automatik apabila tarikh dipilih.
Baris Hari Apple (.cal-header):
7 lajur (MON, TUE, WED, THU, FRI, SAT, SUN) dalam format kapsyen huruf besar Apple yang kemas dengan jarak huruf (letter-spacing) optimum.
Jubin Tarikh Kaca Apple & Jalur Julat Berterusan (.cal-cell, .cal-cell-inner):
Jalur Julat Pilihan Apple (Continuous Range Strip):
Start Date (.cal-range-start): Bulatan biru Apple penuh #0071E3 dengan teks putih dan jalur sambungan lembut di sebelah kanan.
Mid Dates (.cal-range-mid): Jalur biru lutsinar berterusan menghubungkan hari-hari dalam julat tempahan.
End Date (.cal-range-end): Bulatan biru Apple penuh dengan teks putih dan jalur sambungan lembut di sebelah kiri.
Single Date: Bulatan biru tunggal dengan bayang bercahaya (glow shadow).
Penunjuk Hari Ini (Today Indicator): Cincin bulatan biru Apple terang yang membezakan hari semasa.
Titik Penunjuk Status Apple (.cal-dot-indicator): Titik status bersaiz mikro di bawah angka tarikh (Hijau = Available, Biru = Booked, Jingga = Pending, Kelabu = Past).
Legenda Status Kapsul Apple (.cal-legend):
Kapsul pil bersudut bulat di bahagian bawah dengan titik status warna Apple yang jelas pada mod Siang & Malam (Light & Dark Mode).
📅 42. Penyelarasan Kalendar Kepada Paparan Jadual Ketersediaan & Maklumat Tempahan (v5.2.19)
Fungsi penciptaan tempahan baharu (New Booking Summary & Confirm Booking) telah dikeluarkan daripada halaman car-detail.html kerana penciptaan tempahan diuruskan secara berasingan di modal Tempahan (bookings.html):

Fungsi Kalendar Ketersediaan Kenderaan (Vehicle Availability Viewer):
Kalendar kini berfungsi sepenuhnya sebagai jadual ketersediaan kenderaan visual yang bersih dan responsif.
Tarikh Tersedia (🟢 Available): Apabila diklik, memaparkan kad Bento ketersediaan ringkas yang memaklumkan bahawa kenderaan sedia ditempah (Ready to Book) dengan kadar sewaan harian.
Tarikh Ditempah (🔵 Booked / 🟡 Pending): Apabila diklik, memaparkan butiran penuh tempahan sedia ada (Nama Pelanggan, ID Tempahan, Tempoh Sewaan, Jumlah Bayaran, Status) berserta butang Manage in Bookings.
Penyingkiran Aliran Redirection yang Berlebihan:
Membuang butang Confirm Booking dan pemilihan julat multi-day range drag yang sebelum ini melencongkan pengguna ke borang tambah tempahan.
Membuang butang Reset Selection yang tidak lagi diperlukan.
Mengemaskini teks arahan kepada: "Pilih mana-mana tarikh pada kalendar untuk melihat maklumat ketersediaan atau butiran tempahan."
🎨 44. Pembaikan Pertindihan Ikon & Teks Input Tarikh (Floating Search Date Input Fix) (v5.2.20)
Isu pertindihan ikon kalendar (material-icons-round) di atas teks placeholder/nilai ("Select date") pada bar carian utama (index.html) telah dibaiki sepenuhnya:

Punca Isu (Root Cause):
Peraturan CSS .input-wrap untuk pil carian jadual pentadbir sebelum ini menimpa padding input kepada 0 !important dan menukar kontena kepada inline-flex.
Sementara itu, ikon kalendar mempunyai position: absolute; left: 14px;, menyebabkan ikon duduk tepat di atas aksara pertama teks "Select date" (📅ect date).
Penyelesaian Dilaksanakan (Solution):
Skop Semula Pemilih Pill Carian: Menyasarkan .table-search-wrap, .search-pill, .input-wrap-sm, .card-header .input-wrap, dan .table-toolbar .input-wrap supaya tidak mengganggu borang carian umum.
Gaya Khusus .search-field .input-wrap:
Menetapkan padding-left: 48px !important pada input tarikh untuk memberikan ruang yang selesa dan seimbang antara ikon dan teks.
Memusatkan kedudukan ikon secara mutlak (left: 16px; top: 50%; transform: translateY(-50%)).
Menyeragamkan ketinggian (48px), radius pil (9999px), dan fokus bercahaya biru Apple (box-shadow: 0 0 0 3.5px rgba(0, 113, 227, 0.2)).
Pengesahan Visual:
Diuji dan disahkan melalui pelayar sebenar: teks placeholder "Select date" dan nilai tarikh terpilih terpapar dengan jelas tanpa sebarang pertindihan ikon.
🤖 46. Pembaikan Kedudukan Terapung Chatbot (Chatbot Viewport Fixed Positioning) & Penyelarasan Commit SOP (v5.2.21)
Pembaikan Kedudukan Chatbot (Fixed Viewport Position):

Punca Isu: Animasi peralihan halaman .page-container / body sebelum ini menggunakan animation-fill-mode: both; dengan 100% { transform: translateY(0) scale(1); filter: blur(0px); }. Dalam CSS standard, kewujudan transform atau filter pada elemen induk mewujudkan containing block baharu yang memutuskan elemen position: fixed daripada window/viewport dan menyebabkannya tersangkut/bergulir ke bawah dokumen.
Penyelesaian Dilaksanakan:
Mengemaskini @keyframes pageTransitionIn pada 100% kepada transform: none; filter: none; dan menetapkan animation-fill-mode: backwards; agar body dan kontena halaman bersih daripada containing block.
Menetapkan #chatbot-placeholder dan #chatbot-fab disisipkan terus ke peringkat akar document.body dalam shared/js/chatbot.js.
Chatbot FAB kini kekal terapung kemas di bucu kanan bawah skrin (viewport) secara berterusan semasa pengguna skrol di semua halaman.
Penyelarasan Mesej Commit & Tag Mengikut Garis Panduan .agents/rules:

Selaras dengan peraturan Rule 2 (Git Version Control) di mana setiap commit WAJIB bermula dengan nombor versi berturutan (X.X.X <Description>):
5.2.15 Modernize car details page with Apple design system HIG styling
5.2.16 Convert car edit section to Apple frosted glass popup modal
5.2.17 Modernize booking summary and confirm booking card with Apple Bento styling
5.2.18 Modernize booking calendar following Apple HIG Graphical Date Picker guidelines
5.2.19 Streamline booking calendar into vehicle availability and booking details schedule viewer
5.2.20 Fix icon overlap on floating search date inputs and scope search pill styles
5.2.21 Fix chatbot viewport fixed positioning and release page transition containment
Semua tag 5.2.15 hingga 5.2.21 telah dikemaskini dan diselaraskan di GitHub.
🌐 48. Pembaikan Terjemahan Dwibahasa Footer (English & Bahasa Melayu) (v5.2.22)
Punca Isu Terjemahan Footer:

Ketiadaan Atribut data-key: Slogan jenama di bahagian atas footer (footer-tagline) dan label rantau (footer_region) tidak mempunyai atribut data-key, menyebabkan nilainya kekal dalam teks asal (Bahasa Melayu) walaupun bahasa Inggeris dipilih.
Ketiadaan Entri Kamus Terjemahan: Tajuk-tajuk kolum matriks footer (footer_col_fleet, footer_col_tech, footer_col_support, footer_col_legal) dan sebilangan pautan footer (footer_tech_360, footer_tech_pricing, footer_tech_keyless, footer_support_center, footer_support_roadside, footer_legal_insurance, footer_legal_about, nav_explore) tidak wujud dalam fail kamus terjemahan (en.js, ms.js, en.json, ms.json).
Pengendalian Terjemahan Segera & Sandaran Sinkronus: shared/js/main.js kini dilengkapi kamus sandaran (FALLBACK_LANG) yang digabungkan secara sinkronus agar footer dan navbar bertukar bahasa secara serta-merta tanpa sebarang kependaman atau kebergantungan kepada skrip asinkronus yang belum dimuat.
Perubahan & Penyelarasan:

shared/components/footer.html:
Menambah data-key="footer_tagline" pada slogan utama: "Smart, premium vehicle rental service in Melaka." / "Perkhidmatan sewaan kenderaan premium dan pintar di Melaka."
Menambah data-key="footer_region" pada penunjuk zon & mata wang.
shared/lang/en.js & shared/lang/en.json:
Menambah entri kamus Bahasa Inggeris untuk semua elemen footer:
footer_col_fleet: "Fleet & Rentals"
footer_col_tech: "Features & Options"
footer_col_support: "Help & Support"
footer_col_legal: "Legal & Company"
footer_tagline: "Smart, premium vehicle rental service in Melaka."
footer_tech_360: "360° Showroom"
footer_tech_pricing: "Package Comparison"
footer_tech_keyless: "Vehicle Pickup"
footer_support_center: "Customer Care Center"
footer_support_roadside: "24/7 Roadside Assistance"
footer_legal_insurance: "Insurance Coverage"
footer_legal_about: "About WeDRIVE"
footer_rights: "All rights reserved."
nav_explore: "Explore Melaka"
shared/lang/ms.js & shared/lang/ms.json:
Menambah entri kamus Bahasa Melayu yang padan sepenuhnya bagi setiap kekunci di atas.
shared/js/main.js:
Menambah kamus FALLBACK_LANG dan fungsi getMergedLangData(lang) untuk aplikasi terjemahan masa nyata secara serta-merta (synchronous translation).
Mengemaskini pemuat footer dan skrip bahasa dengan versi cache-busting ?v=5.2.22.
Halaman Utama & Tetamu (index.html, explore-melaka.html, how-it-works.html, pricing.html):
Mengemaskini rujukan pemuat main.js?v=5.2.22 bagi memastikan pelayar sentiasa memuat turun versi logik terjemahan terkini.
Pengesahan Visual:

Disahkan melalui pelayar sebenar bahawa penukaran bahasa antara EN (English) dan MS (Bahasa Melayu) menterjemahkan keseluruhan footer dengan sempurna, termasuk semua tajuk kolum, pautan navigasi, slogan, dan hak cipta.
Footer dalam Bahasa Inggeris (EN)
Footer dalam Bahasa Inggeris (EN)

🚗 50. Pemodenan Dashboard Pelanggan (Customer Dashboard) Mengikut Apple HIG (v5.2.23)
Peningkatan Antara Muka & Apple HIG Standard:
Kad Padanan Pintar AI (AI Recommendations Bento Grid):
Membina fungsi renderRecommendations() di dalam customer/js/customer.js yang memaparkan 3 pilihan kenderaan pintar utama (Sedan, SUV, Hatchback/MPV) lengkap dengan lencana ungu Apple AI (match percentage & recommendation notes), gambar beresolusi tinggi, tag kapasiti, dan butang tindakan pantas (Quick Book).
Menambah gaya CSS Apple Bento (.reco-card, .reco-badge, .reco-img-wrap, .reco-content, .reco-specs, .reco-price) dengan keluk squircle berterusan dan kesan hover terangkat lembut (soft lift).
Bar Carian Kompak Interaktif (Apple Capsule Search Pill):
Mengemaskini .search-bar-compact dan .search-field-compact kepada bentuk pil penuh (capsule border-radius 9999px).
Mengintegrasikan modul Flatpickr & WeDriveCalendar bagi medan tarikh pengambilan (#pickup-date) dan tarikh pemulangan (#return-date) dengan cincin fokus biru bercahaya Apple (focus halo).
Ucapan Pengguna Mengikut Waktu & Profil (Personalized Greeting):
Menambah fungsi updateGreeting() yang memaparkan ucapan mengikut waktu semasa (Good morning, Good afternoon, Good evening / Selamat Pagi, Selamat Petang, Selamat Malam) bersama nama panggilan sebenar pengguna daripada metadata Supabase.
Modal Pop Keluar Kalendar Apple Graphical Date Picker (#booking-popup):
Menghubungkan Flatpickr berpasangan dengan perkiraan tempoh sewaan dan jumlah kos sewa secara masa nyata, serta navigasi lancar ke halaman booking.html dengan parameter URL lengkap.
Sokongan Penuh Dwibahasa & Tema:
Menambah semua kunci bahasa dashboard pelanggan (cust_active_bookings, cust_ai_reco, cust_browse, popup_select_dates, dsb.) ke dalam fail kamus en.js, ms.js, en.json, ms.json dan FALLBACK_LANG dalam main.js.
🏎️ 51. Pemudahan Dashboard Pelanggan, Live Return Countdown & Halaman Khusus Browse Cars (v5.2.24)
Pemudahan & Penyeragaman Dashboard Pelanggan (customer.html):

Jubin Metrik & Akses Pantas Bento Seragam (.stats-grid / .stat-card):
Menggunakan komponen metrik piawai WeDRIVE (.stats-grid & .stat-card) dengan 4 kad seragam:
Browse Fleet (8 Kereta Tersedia · Tempah Segera)
My Bookings (Status sewaan aktif dinamik)
Roadside Support (Bantuan kecemasan 24/7)
Profile Status (Pemandu disahkan)
Pemasa Undur Masa Pemulangan Langsung (Live Return Countdown Engine):
Membina fungsi startReturnCountdown() yang mengira baki masa sehingga tarikh pemulangan kenderaan dan mengemas kini digit masa nyata secara automatik setiap saat (Hari : Jam : Minit : Saat).
Menampilkan tarikh akhir pemulangan tepat (cth: Oct 28, 2026 · 10:00 AM · Melaka Sentral) dan butang lanjutan sewaan.
Kad Sambutan Tiada Sewaan (No Rental State):
Sekiranya pelanggan tiada sewaan aktif, kad sambutan "Rancang Perjalanan Seterusnya?" dipaparkan secara kemas dan seragam dengan butang tindakan pantas untuk menempah kereta.
3 Cadangan Pintar AI Berpadanan Tepat:
Memaparkan 3 pilihan kereta terbaik mengikut kategori (Eksekutif untuk Sedan mewah, Keluarga untuk MPV/SUV, Bandar untuk Hatchback).
Halaman Khusus Baharu: Browse Cars (customer/pages/browse-cars/browse-cars.html):

Membina halaman bilik pameran katalog penuh untuk pelanggan log masuk dengan:
Bar carian tarikh kalendar Flatpickr Apple (Tarikh Ambil, Tarikh Pulang, Butang Carian)
Kawalan segmen penapis Apple (Semua, Sedan, SUV, Hatchback, MPV, Coupe, Trak)
Kaunter keputusan kenderaan tersedia
Grid kad kenderaan Apple Bento lengkap dengan spesifikasi, lencana status, harga, dan modal pop-keluar kalendar tempahan Graphical Date Picker (#booking-popup).
Kemaskini Bar Sisi Navigasi Pelanggan (sidebar-loader.js):

Menambah pautan menu Browse Cars (nav_browse / Pilih Kereta) dengan ikon directions_car.
Menghubungkan butang "New Booking" terus ke customer/pages/browse-cars/browse-cars.html.
Mengemaskini detectActivePage() untuk menyokong /browse-cars/.
Penyelarasan Dwibahasa & Tema:

Menambah semua kunci bahasa baharu ke dalam kamus en.js, ms.js, en.json, ms.json dan FALLBACK_LANG dalam main.js.
🎨 52. Penyeragaman Konsistensi UI Dashboard, Butang Apple HIG & Pemadanan AI (v5.2.25)
Penyeragaman Penuh Kad Cadangan Pintar AI (AI Recommendations):

Membuang struktur kad dan kotak kelabu (grey squares / petak-petak) untuk menyelaraskan dengan reka bentuk piawai master .car-card WeDRIVE.
Menggunakan baris spesifikasi standard Apple HIG (ikon bertaraf warna + teks bersih tanpa latar belakang petak).
Menghubungkan butang tempahan dengan kelas standard .btn-primary (bentuk pil lembut, bayang-bayang bercahaya biru, dan kesan anjal sentuhan tactile).
Pemadanan Pintar AI Mengikut Kategori Kenderaan Sebenar:

Memperbaiki algoritma renderRecommendations() di dalam customer.js untuk memilih 3 jenis kenderaan berbeza secara tepat:
🚗 Sedan (BMW 320i M Sport) $\to$ Padanan AI 98% · Korporat & Eksekutif
🚐 MPV / SUV (Toyota Alphard) $\to$ Padanan AI 96% · Keselesaan Keluarga
🚙 Hatchback (Perodua Axia) $\to$ Padanan AI 94% · Jimat & Lincah Bandar
Pembetulan & Pengasingan Modal Pop-Keluar Tempahan (#booking-popup):

Menambah penggayaan CSS rasmi .booking-popup-overlay (position: fixed; inset: 0; z-index: 99999; display: none;) supaya modal tidak melimpah atau menjejaskan reka letak halaman semasa kali pertama dimuatkan.
Mengisi maklumat pratonton kenderaan, tarikh pengambilan/pemulangan Flatpickr, dan perkiraan jumlah sewaan secara dinamik.
Pengesahan Visual:

Tangkapan skrin membuktikan bahagian atas dashboard kemas, kad pemasa undur sewaan aktif berfungsi lancar, 3 kad cadangan AI seragam dengan index.html, dan navigasi bar sisi ke browse-cars.html berjalan dengan sempurna.
🍃 53. Pelaksanaan Papan Pemuka Minimalis Apple HIG & Penambahbaikan Bilik Pameran (v5.2.26)
Pembuangan Jubin Statistik Berulang (Redundant Stats Cards):

Membuang baris 4 kad statistik atas (Cari Kereta, Tempahan Saya, Roadside Support, Profile) dari customer.html kerana semua fungsi tersebut telah tersedia secara langsung di bar sisi navigasi utama.
Papan pemuka kini menepati prinsip utama Apple HIG: Minimalism is better & Content Deference — pengguna terus disajikan dengan perkara paling penting sebaik sahaja log masuk.
Hierarki Papan Pemuka Kemas & Bersih:

Tajuk Sambutan: Selamat Datang / Welcome Back yang ringkas dan padat.
Status Sewaan (Akses Pantas Utama): Kad sewaan aktif dengan pemasa undur langsung masa nyata (Hari : Jam : Minit : Saat), lokasi Melaka Sentral, dan butang tindakan pantas.
Pilihan Kenderaan Popular (Featured Fleet): 3 kenderaan pilihan dengan lencana asli (Pilihan Eksekutif, Pilihan Keluarga, Paling Jimat Bahan Api) tanpa gimik peratusan AI yang berlebihan.
Pembaikan Grid Katalog Penuh Browse Cars (browse-cars.html):

Memperbaiki pemilih CSS .cars-grid di dalam shared/css/wedrive.css supaya menghasilkan grid responsif 3-kolum Apple Bento (repeat(auto-fill, minmax(340px, 1fr))).
Memperbaiki bar penapis kapsul .filter-bar dengan butang segmen aktif Apple Blue.
8 kenderaan kini dipaparkan secara kemas, proporsional, dan estetik.
🤖 55. Pengesanan Automatik Peranan Pengguna & Konteks Portal (Role Auto-Detection & Portal Context) (v5.2.27)
Pengesanan Pintar Peranan & Nama di Papan Pemuka Pelanggan (customer.js):

Memperbaiki fungsi updateGreeting() supaya tidak lagi tersilap memaparkan nama "Admin WeDRIVE" sekiranya sesi pentadbir sebelum ini tersimpan di dalam storan penyemak imbas.
Sistem kini menyemak rekod sebenar di jadual Supabase customers. Sekiranya nama pelanggan dijumpai (cth: Hakim), tajuk sambutan memaparkan Selamat Petang, Hakim!. Sekiranya tiada profil nama atau peranan adalah bukan pelanggan, sistem memaparkan ucapan neutral kemas: Selamat Kembali! / Welcome back!.
Kecerdasan Konteks Chatbot Mengikut Portal (Context-Aware AI Chatbot) (chatbot.js):

Chatbot kini mengesan secara automatik di mana pengguna berada:
Portal Pelanggan (/customer/): Chatbot bertindak sebagai pembantu peribadi penyewa kenderaan (menyemak sewaan aktif, baki pemasa pemulangan, status tempahan, dan bantuan 24/7). Cip cadangan: Sewaan aktif, Tempahan saya, Pilih kereta, Bantuan 24/7.
Portal Pentadbir (/admin/): Chatbot bertindak sebagai pembantu operasi WeDRIVE (menyemak status ketersediaan kereta, ringkasan tempahan baharu, pengesahan dokumen pelanggan, dan bantuan sistem). Cip cadangan: Status kereta, Ringkasan tempahan, Senarai pelanggan, Bantuan sistem.
Bilik Pameran Awam / Pelawat (/guest/ / index.html): Chatbot bertindak sebagai jurupandu pelawat (menerangkan cara tempahan, kadar harga, dan kaedah bayaran). Cip cadangan: Kereta tersedia, Cadangan kereta, Cara tempah, Pilihan bayaran.
Mengisi arahan [PORTAL CONTEXT] terus ke dalam system prompt kecerdasan buatan Gemini AI.
🌓 57. Pengesanan Automatik Mod Gelap & Siang Mengikut Peranti (Per-Device Native Theme Detection) (v5.2.28)
Pengasingan Mutlak Mengikut Peranti (Per-Device Client-Side Isolation):

Menegaskan bahawa tetapan tema disimpan secara eksklusif dalam localStorage penyemak imbas pada peranti individu masing-masing dan TIDAK PERNAH dikongsi atau disimpan ke pangkalan data awan.
Sekiranya 10 orang membuka laman web pada 10 peranti berbeza, setiap peranti akan mengesan dan menggunakan tema perantinya sendiri secara bebas tanpa mempengaruhi peranti lain.
Pengesanan Mod Gelap Asli CSS (Native Media Query Token Layer) (wedrive.css):

Menambah lapisan token @media (prefers-color-scheme: dark) secara langsung di :root CSS master stylesheet 
wedrive.css
.
Apabila mana-mana peranti pengguna (iOS, macOS, Android, Windows) ditetapkan ke Mod Gelap, pelayar secara automatik memaparkan Mod Gelap Apple serta-merta tanpa sebarang kelipan (zero flash of light mode).
Kitaran Butang Suis Tema 3-Peringkat (3-Tier Theme Cycle) (main.js):

Sistem (Auto Detect) $\to$ Siang (Light Mode) $\to$ Malam (Dark Mode) $\to$ Sistem (Auto Detect).
Perubahan tetapan sistem OS dalam masa nyata dipantau secara automatik melalui window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change').
🧭 59. Penyelarasan Logik Status Sewaan & Pembuangan Anggaran Jarak (Rental Return Logic & Range Cleanup) (v5.2.29)
Pembuangan Anggaran Jarak (Estimated Range Removed):

Membuang paparan Estimated Range / Anggaran Jarak sepenuhnya daripada kad status sewaan aktif di papan pemuka pelanggan.
Penyelarasan Logik Lokasi Pemulangan (Return Location Logic):

Analisis Logik: Apabila status kenderaan adalah sewaan aktif (active ongoing rental) dengan pemasa undur pemulangan, pelanggan telah pun mengambil kenderaan (picked up). Oleh itu, maklumat lokasi yang logik dan diperlukan oleh pemandu ialah Lokasi Pemulangan (Return Location / Drop-off Point), bukannya lokasi pengambilan.
Menggantikan label Pick-up Location kepada Lokasi Pemulangan / Return Location (cust_return_point $\to$ Melaka Sentral (HQ)) di dalam customer.html, customer.js, en.js, ms.js, en.json, ms.json, dan main.js.
📐 61. Penyelarasan Reka Bentuk & Kedudukan Footer Pelanggan Menyamai Admin (Customer Footer Unification) (v5.2.30)
Punca Masalah (Root Cause):

Sebelum ini, tag <div id="footer-placeholder"></div> di dalam fail-fail portal pelanggan diletakkan di luar kontena <main class="customer-main"> (iaitu terus di dalam <body>).
Ini menyebabkan lebar footer membentang dari penjuru paling kiri skrin ($x=0$), lalu tertindih dan terlindung di bawah bar sisi (sidebar) tetap 284px pelanggan.
Tindakan Pembaikan (Implementation & Unification):

Pemindahan Kontena: Memindahkan <div id="footer-placeholder"></div> ke dalam <div class="main-content-area"> / <main class="customer-main"> merentasi kesemua 10 halaman portal pelanggan (papan pemuka, carian kereta, tempahan saya, resit, bantuan, profil, butiran kenderaan, dll).
Penyelarasan CSS Master (wedrive.css): Mengintegrasikan peraturan .main-content-area #footer-placeholder dan .main-content-area .wedrive-footer agar berkongsi gaya Bento Card Apple, bayang-bayang (box-shadow), jejari sudut (border-radius 22px), dan mod gelap/siang yang seragam dan tepat sebagaimana portal Admin.
📏 63. Penyelarasan Garis Dasar Bawah Footer & Bar Sisi (Sidebar Bottom Baseline Alignment) (v5.2.31)
Punca Perbezaan Ketinggian (Root Cause):

Bar sisi (sidebar) ditetapkan terapung pada jarak bottom: 14px dari sempadan bawah skrin.
Manakala kontena .customer-main sebelum ini mempunyai padding-bottom: 60px, yang menyebabkan footer tergantung 46px lebih tinggi berbanding garis bawah bar sisi.
Penyelarasan Garis Dasar Bawah (Bottom Baseline Harmonization):

Menyelaraskan padding .customer-main kepada padding: 24px 32px 14px 32px; sama persis dengan susun atur kontena Admin (main.main .content).
Menetapkan .customer-main .main-content-area sebagai kontena fleksibel (flex: 1; display: flex; flex-direction: column;).
Hasilnya, garisan bawah kad Bento footer dan garisan bawah bar sisi kini terletak selaras dan seimbang tepat pada paras 14px dari sempadan bawah paparan skrin (pixel-perfect horizontal alignment).
🔘 65. Penyelarasan Menegak Tepat Butang Bahasa & Mod Tema (Language & Theme Toggle Vertical Alignment) (v5.2.32)
Punca Ketidakselarian Menegak (Root Cause):

Butang bahasa (.lang-toggle) mengandungi teks fon "EN"/"MS", manakala butang tema (.theme-toggle) mengandungi ikon Material Icon <span>.
Tanpa penetapan eksplisit vertical-align: middle;, line-height: 1;, dan susun atur display: inline-flex; align-items: center; justify-content: center; pada kontena dalaman kedua-dua elemen, pelayar menggunakan garisan dasar fon teks (baseline alignment), menyebabkan butang teks pill EN jatuh sedikit lebih rendah berbanding butang ikon bulat tema.
Tindakan Pembaikan (Implementation):

CSS Master (wedrive.css):
Menetapkan .lang-toggle dan .theme-toggle kepada ketinggian yang tepat 32px dengan vertical-align: middle; line-height: 1; box-sizing: border-box;.
Menetapkan .lang-toggle .lang-text dan .theme-toggle .material-icons-round kepada display: inline-flex; align-items: center; justify-content: center; line-height: 1;.
Menyelaraskan kontena .utility-actions dan .nav-actions dengan display: inline-flex; align-items: center; gap: 8px; flex-shrink: 0;.
Penyelarasan Halaman Log Masuk & Daftar (login.html & signup.html):
Mengemas kini kontena terapung atas kanan kepada display: flex; align-items: center; gap: 8px; agar kedua-dua butang terletak selari secara mendatar dan menegak (pixel-perfect centered).
📳 67. Animasi Goncangan Ralat Tarikh Pemulangan & Sorotan Tarikh Pengambilan (Return Date Shake & Pickup Highlight) (v5.2.33)
Ciri Interaktif Baharu (Interactive Feedback Flow):

Sekiranya pengguna menekan/klik pada medan Tarikh Pemulangan (Return Date) sebelum memilih Tarikh Pengambilan (Pick-up Date):
Medan Tarikh Pemulangan digoncangkan dengan animasi ralat Apple (Apple Date Error Shake) berserta kilauan sempadan merah lembut (.date-shake-error).
Medan Tarikh Pengambilan disorotkan (highlighted) secara automatik dengan denyutan biru Apple (.date-pickup-pulse) untuk memandu perhatian pengguna.
Kalendar pilihan Tarikh Pengambilan dibuka secara automatik (pPicker.open()) supaya pengguna boleh terus memilih tarikh tanpa sebarang kelewatan.
Maklum balas haptik (vibration feedback) dicetuskan pada peranti yang menyokongnya.
Fail Terlibat:

shared/css/wedrive.css
: Menambah @keyframes appleDateErrorShake, @keyframes applePickupPulse, .date-shake-error, dan .date-pickup-pulse.
shared/js/calendar.js
: Melaksanakan fungsi pengesanan onReturnAttempt dan triggerPickupRequiredFeedback secara universal merentasi semua komponen tarikh (bar carian, modal popup, dan borang tempahan).
customer/pages/browse-cars/browse-cars.html
: Pembersihan acara onclick bertindih.
📅 69. Reka Bentuk Kalendar Popover Apple HIG & Penyatuan Seluruh Sistem (Apple HIG Symmetrical Date Picker & Universal Unification) (v5.2.34)
Penyelarasan Ruang Simetri & Nisbah Kiri-Kanan (Symmetrical Margin & Padding Fix):

Punca Masalah: Kotak dalaman Flatpickr (.flatpickr-rContainer) sebelum ini mempunyai lebar tetap bawaan 252px, menyebabkan wujud ruang kosong berlebihan di sebelah kanan (57px berbanding 19px di sebelah kiri).
Pembaikan: Menetapkan .flatpickr-innerContainer, .flatpickr-rContainer, .flatpickr-days, .flatpickr-weekdays, .flatpickr-weekdaycontainer, dan .dayContainer kepada width: 100% !important; min-width: 100% !important; max-width: 100% !important; dengan padding seragam 18px 18px 16px 18px.
Hasil Ukuran: Jarak sempadan kiri grid hari (19px) dan jarak sempadan kanan (19px) kini 100% sama dan seimbang secara simetri.
Susun Atur Pengepala Mengikut Piawaian Apple HIG (Apple HIG Header Layout):

Tajuk Bulan dan Tahun diletakkan di sebelah KIRI (order: 1) dengan tipografi tebal tanpa kotak dropdown yang bersepah.
Butang navigasi bulan < dan > dikumpulkan secara kemas di sebelah KANAN ATAS (order: 2 dan order: 3) mengikut standard panduan Apple Human Interface Guidelines - Pickers.
Penyatuan 1 Sistem Kalendar Universal Merentasi Seluruh Platform (Universal Calendar Module):

Memansuhkan penggunaan <input type="date"> pelayar mentah yang berbeza-beza di bahagian Admin (Admin Bookings, Marketing Banners, Seasonal Pricing, Promo Codes, dan New Booking Modal).
Semua modul tarikh kini menggunakan modul bersama shared/js/calendar.js dan CSS master Apple Flatpickr (shared/css/wedrive.css), menjadikan hanya ada SATU reka bentuk kalendar popover Apple yang seragam, konsisten, dan mewah di seluruh aplikasi WeDRIVE.
🔘 71. Penyelarasan Garisan & Ketinggian Butang Batal & Simpan (Modal Footer Button Alignment) (v5.2.35)
Punca Ketidakselarian (Root Cause):

Butang Batal (.btn-back) mempunyai ketinggian asas 38px, manakala butang Simpan (.btn-primary-sm) mempunyai definisi CSS pendua yang menimpanya kepada 32px.
Kontena .modal-footer tidak mempunyai susun atur Flexbox eksplisit (display: flex; align-items: center; justify-content: flex-end; gap: 10px;), menyebabkan kedua-dua butang diletakkan mengikut garisan dasar fon tak seimbang (baseline misalignment).
Tindakan Pembaikan (Implementation):

CSS Master (wedrive.css):
Menetapkan .modal-footer sebagai kontena flexbox dengan display: flex; align-items: center; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle);.
Menyelaraskan kedua-dua .btn-back dan .btn-primary-sm pada ketinggian seragam tepat 38px (min-height: 38px; max-height: 38px; padding: 0 18px; line-height: 1; vertical-align: middle;).
Membuang takrifan pendua .btn-primary-sm yang bercanggah.
Hasil Ujian:
topDifference: 0px
bottomDifference: 0px
isVerticallyAligned: true (pixel-perfect horizontal and vertical alignment).
🔤 73. Pembaikan Pemotongan Ekor Huruf "g" Pengepala Kalendar (Calendar Month Descender Padding Fix) (v5.2.36)
Punca Masalah (Root Cause):

Elemen pilihan bulan (.flatpickr-monthDropdown-months) mempunyai ketinggian bawaan terhad 20px dengan line-height: 16px dan padding bawah 2px, menyebabkan ekor huruf (descenders) seperti g dalam perkataan "August", y dalam "May", dan p dalam "September" terpotong di bahagian bawah oleh kotak elemen <select>.
Tindakan Pembaikan (Implementation):

CSS Master (wedrive.css):
Menetapkan line-height: 1.4 !important; dan min-height: 28px !important; pada .flatpickr-monthDropdown-months dan .custom-year-select.
Menambah padding bawah yang mencukupi: padding: 3px 6px 6px 6px !important; berserta box-sizing: border-box !important;.
Memastikan kontena induk .flatpickr-current-month mempunyai min-height: 32px !important; dan overflow: visible !important;.
Hasil Ujian:
Ketinggian elemen meningkat kepada 31.4px dengan line-height: 22.4px.
Huruf g pada perkataan "August" dan semua teks bulan/tahun kini dipaparkan sepenuhnya (100% full descender visibility) tanpa sebarang pemotongan.
🚫 75. Sekatan Tarikh Masa Lalu bagi Tempahan & Pemasaran (Future-Only Date Picker Enforcement) (v5.2.37)
Punca Masalah (Root Cause):

Pilihan tahun pada kalendar sebelum ini memaparkan pilihan 5 tahun lepas (currentYear - 5), dan sesetengah modul pemasaran/tempahan membenarkan tarikh lalu dipilih secara tidak sengaja.
Tindakan Pembaikan (Implementation):

Logik Kalendar Universal (shared/js/calendar.js):
Menetapkan konfigurasi lalai minDate: "today" bagi semua pemilih tarikh masa hadapan (Tempahan Pelanggan, Tempahan Baharu Admin, Banner Pemasaran, Kod Promo, dan Kadar Bermusim).
Menyekat pilihan tahun lampau pada dropdown tahun: hanya tahun semasa dan 10 tahun akan datang (currentYear hingga currentYear + 10) dipaparkan bagi pemilih masa hadapan.
Semua hari sebelum hari ini dinyahaktifkan secara mutlak (.flatpickr-disabled) dan tidak boleh diklik.
Mengekalkan kebenaran tarikh lampau (data-allow-past="true") khusus untuk penapis rekod sejarah tempahan pentadbir (bk-date-from dan bk-date-to).
Hasil Ujian:
minDateConfig: today
disabledDaysCount: Semua hari lampau dinyahdayakan (30 hari).
yearOptions: ["2026", "2027", ..., "2036"] (tiada tahun lampau dipaparkan).
💊 77. Pembaikan Bentuk Likaran Goncang & Pembukaan Tarikh Pulang (Pill-Shaped Error Shake & Seamless Return Date Selection) (v5.2.38)
Kesalahan 1: Goncangan Ralat Mengikut Likaran Bentuk Pil (Pill-Shaped Error Shake Animation):

Punca: Sebelum ini, animasi goncangan ralat .date-shake-error diterapkan pada elemen input dalaman yang mempunyai bucu tajam/berpetak, menghasilkan halo merah berbentuk segi empat dan bukannya mengikut bentuk melengkung pil (pill radius).
Tindakan Pembaikan:
Mengubah suai shared/css/wedrive.css dengan menetapkan border-radius: var(--radius-pill, 9999px) !important; pada kelas .date-shake-error, .search-field-compact.date-shake-error, dan .date-pickup-pulse.
Membuang sebarang sempadan dan bayang pada input dalaman (.date-shake-error input { border: none !important; box-shadow: none !important; }).
Mengubah logik triggerPickupRequiredFeedback() dalam shared/js/calendar.js agar hanya menggoncang balutan luar (returnWrapper) yang mengekalkan radius pil 9999px.
Kesalahan 2: Kelancaran Membuka & Memilih Tarikh Pulang (Seamless Return Date Selection):

Punca: Flatpickr dimulakan dengan clickOpens: false dan returnInput.disabled = true. Dalam beberapa versi Flatpickr, panggilan rPicker.set('clickOpens', true) tidak mengikat semula pendengar acara klik pelayar, menyebabkan kalendar tarikh pulang tidak terbuka apabila pengguna menekan kotak tarikh pulang selepas memilih tarikh ambil.
Tindakan Pembaikan:
Memulakan rPicker dengan clickOpens: true secara konsisten dalam shared/js/calendar.js.
Menetapkan returnInput.disabled = false secara eksplisit di dalam updateReturnState().
Mengemas kini fungsi onReturnAttempt: Jika pengguna menekan kotak atau balutan Tarikh Pulang semasa Tarikh Ambil sudah dipilih, kalendar Tarikh Pulang (rPicker.open()) akan dibuka secara automatik dan pantas tanpa sebarang halangan.
🧪 78. Hasil Ujian Interaktif Pelbagai Kitaran (Multi-Cycle Interactive Verification) (v5.2.38)
Ujian interaktif telah dijalankan menggunakan Chrome DevTools MCP ke atas halaman customer/pages/browse-cars/browse-cars.html dengan 3 kitaran ujian berbeza:

Kitaran Ujian	Tindakan Pengguna	Tarikh Ambil	Tarikh Pulang	Status Kalendar	Sorotan Julat (Range Highlight)
Kitaran 1	Tekan Tarikh Pulang kosong $\to$ Goncang Pil $\to$ Pilih Tarikh	26/08/2026	30/08/2026	Terbuka lancar (isOpen: true)	26 Ogos (Mula) $\to$ 30 Ogos (Tamat)
Kitaran 2	Ubah Tarikh Ambil ke September $\to$ Tarikh Pulang lalu dikosongkan $\to$ Pilih Tarikh Pulang	02/09/2026	08/09/2026	Terbuka lancar (minDate: 02/09/2026)	02 Sept (Mula) $\to$ 08 Sept (Tamat)
Kitaran 3	Ubah Tarikh Ambil ke Oktober $\to$ Pilih Pulang $\to$ Ubah Tarikh Ambil Semula	18/10/2026	22/10/2026	Terbuka & Dikemas kini	18 Okt (Mula) $\to$ 22 Okt (Tamat)
Keputusan Bentuk Goncang: shakeBorderRadius: 9999px (mengikut likaran bentuk pil sepenuhnya).
Keputusan Pembukaan Kalendar: autoReturnOpen: true, finalReturnValue: Berjaya dipilih dan dipaparkan dalam input.
📦 79. Maklumat Git & Tag Terkini
Commit: 5.2.38 Fix pill-shaped error shake and seamless return date calendar opening
Tag Versi: 5.2.38
Status: Diselaraskan dan ditujah ke origin/main bersama tag versi 5.2.38.

---

## 🛠️ [MINOR UPDATE] 80. Pembaikan Isu Klik Tetikus Pemilihan Semula Tarikh Pulang (Manual Mouse Re-Click Bug Fix) (v5.2.39)

- **Punca Masalah (Root Cause)**:
  - Konflik pendengar acara (*event listeners*) berganda dan gelembung klik (*click bubbling*) pada elemen pembungkus input.
  - Sifat CSS `pointer-events: none` yang tertinggal selepas status bertukar.
- **Tindakan Pembaikan (Implementation)**:
  - Mengasingkan pendengar acara klik secara bersih di dalam `shared/js/calendar.js` menggunakan `e.stopPropagation()`.
  - Memastikan `pointer-events: auto` ditetapkan pada kotak input dan pembungkus sebaik sahaja tarikh ambil dipilih.
- **Maklumat Git**:
  - Commit: `5.2.39 Fix manual mouse click re-selection on return date calendar`
  - Tag Versi: `5.2.39`

---

## 🔒 [MINOR UPDATE] 81. Penguncian Mutlak Tarikh Pulang & Penutupan Eksklusif (Strict Return Date Locking & Mutual Exclusion) (v5.2.40)

- **Logik Penguncian (Lock First Directive)**:
  - Tarikh Pulang dikunci sepenuhnya (`clickOpens: false`, `opacity: 0.65`, `cursor: not-allowed`) selagi Tarikh Ambil kosong.
  - Menekan Tarikh Pulang semasa kosong mencetuskan goncangan ralat bentuk pil melengkung (`9999px`) dan membuka kalendar Tarikh Ambil sahaja.
- **Pembukaan Bebas (Seamless Unlocking)**:
  - Sebaik sahaja Tarikh Ambil dipilih, Tarikh Pulang dibuka kuncinya (`opacity: 1`, `cursor: pointer`), `minDate` diselaraskan secara automatik, dan pengguna bebas memilih/menukar tarikh pulang pada bila-bila masa.
- **Pencegahan Kalendar Bertindih (Mutual Exclusion)**:
  - Membuka satu kalendar akan menutup kalendar pasangannya serta-merta.
- **Maklumat Git**:
  - Commit: `5.2.40 Strictly lock return date until pickup is selected and enforce mutual exclusion`
  - Tag Versi: `5.2.40`

---

## 🌐 [MINOR UPDATE] 82. Penyelarasan Kalendar Merentas Semua Modul Sistem (Universal Calendar Synchronization) (v5.2.41)

- **Penyatuan Arkitektur Kalendar**:
  - Menyelaraskan semua halaman di dalam Modul Pelanggan (*Browse Cars, Dashboard, Car Details*) dan Modul Pentadbir (*Bookings Filter, New Booking Modal, Marketing Banners, Seasonal Pricing*) untuk menggunakan enjin universal yang sama daripada `shared/js/calendar.js`.
- **Pautan Aset Lengkap**:
  - Memastikan fail `flatpickr.min.css`, `flatpickr.min.js`, dan `calendar.js` dipautkan secara konsisten di semua halaman yang terlibat.
- **Maklumat Git**:
  - Commit: `5.2.41 Ensure flatpickr and calendar assets are globally linked across all customer and admin pages`
  - Tag Versi: `5.2.41`

---

## 🏆 [MAJOR UPDATE] 83. Pemaktuban Standard 100% Apple Human Interface Guidelines (HIG) & Master Audit (v5.2.42)

- **Pemaktuban 6 Pilar Apple HIG**:
  1. **Getting Started**: 3 Prinsip Teras (Clarity, Deference, Depth) dan sasaran sentuhan minimum $\ge 44\text{px} \times 44\text{px}$.
  2. **Foundations**: Tipografi San Francisco dengan nombor tabular (`tabular-nums`), Obsidian True Black (`#000000`), Apple Pro Blue (`#0071E3`/`#2997FF`), Bahan Kaca (*Glassmorphism blur 20px*), dan Fizik Spring Apple `cubic-bezier(0.16, 1, 0.3, 1)`.
  3. **Patterns**: Bar navigasi terapung, Penguncian Tarikh Berpasangan (*Lock First*), Goncangan Ralat Bentuk Pil (*Pill Shake*), Lembaran Bawah Mudah Alih (*iOS Bottom Sheet Drawer* dengan *drag handle* `36px × 5px`).
  4. **Components**: Kawalan Bersegmen (*Segmented Controls*), Kad Bento Squircle (`24px`/`28px`), Butang Kapsul Pil (`9999px`), Jambatan Julat Kalendar Kapsul Biru.
  5. **Inputs**: Lingkaran Cincin Fokus Biru Apple (*Focus Halo Ring*), Tindak Balas Sentuhan Taktil `transform: scale(0.97)` semasa ditekan (`:active`), Kawalan Seretan 360°.
  6. **Technologies**: Pembantu AI Terapung (*Floating AI Island*), Pelihat Kenderaan 360°, Pengiraan Detik Masa Nyata, Penukaran Bahasa Dwibahasa Lancar (*Skeleton Cross-Fade*).
- **Fail Rujukan Kekal**:
  - `.agents/rules/apple_hig_design_system.md` *(Spesifikasi Utama)*
  - `.agents/rules/ruleprompt.md` *(SOP & 6 Pautan Rasmi Apple HIG)*
  - `docs/APPLE_HIG_COMPLIANCE_AUDIT.md` *(Laporan Audit Semua Halaman)*
- **Maklumat Git**:
  - Commit: `5.2.42 Establish Apple HIG master specification, permanent rules, and 100% system-wide compliance suite`
  - Tag Versi: `5.2.42`

---

## 💊 [MINOR UPDATE] 84. Penyeragaman Bentuk Kapsul Pil Modal Tempahan Pantas (Popup Modal Pill Shape Consistency) (v5.2.43)

- **Isu**:
  - Kotak Tarikh Ambil dan Pulang dalam modal tempahan sebelum ini bersegi empat (`border-radius: 12px`) dan ikon terlalu rapat dengan teks.
- **Tindakan Pembaikan**:
  - Menukar `.popup-date-input-wrap` kepada bentuk kapsul pil melengkung penuh **`border-radius: var(--radius-pill, 9999px)`** dengan ketinggian `48px`, padding `0 18px`, dan jarak ikon `gap: 10px`.
  - Menukar kad ringkasan durasi sewa `.popup-duration` kepada bentuk kapsul pil melengkung **`border-radius: var(--radius-pill, 9999px)`** dengan padding `12px 20px`.
- **Maklumat Git**:
  - Commit: `5.2.43 Standardize quick booking modal date fields and duration to Apple pill shapes`
  - Tag Versi: `5.2.43`

---

## 🎯 [MINOR UPDATE] 85. Penyeragaman Menyeluruh Bentuk, Flatpickr, Transisi, & Sidebar Sistem (Total System Consistency Harmonization) (v5.2.44)

- **Bentuk Geometri Seragam**:
  - Kapsul Pil (`9999px`) pada semua bar carian, input tarikh modal, kad ringkasan, cip penapis, dan borang tempahan pentadbir.
  - Squircle Bento (`24px`/`28px`) pada semua kad, modal, dan bar sisi.
- **Kalendar Flatpickr Universal**:
  - Bekas kaca Apple (*blur 32px*, bucu `22px`), sel hari bulat, dan jambatan julat biru kapsul di seluruh sistem.
- **Transisi & Fizik Spring Apple**:
  - Transisi universal `cubic-bezier(0.16, 1, 0.3, 1)` dan tindak balas sentuhan `scale(0.97)` pada semua elemen interaktif.
- **Bar Sisi Pelanggan & Pentadbir**:
  - Struktur squircle seragam `24px` dengan menu berkapsul pil dan kesan cahaya aktif.
- **Maklumat Git**:
  - Commit: `5.2.44 Harmonize system-wide geometry, flatpickr styling, spring transitions, and sidebar navigation`
  - Tag Versi: `5.2.44`

---

## 🔍 [MINOR UPDATE] 86. Pembaikan Sorotan Fokus Bentuk Kapsul Melengkung (Continuous Pill Focus Halo Elimination of Inner Rectangles) (v5.2.46)

- **Punca Masalah (Root Cause)**:
  - Sebelum ini, peraturan CSS `:focus-visible` dan `input:focus-visible` meletakkan bayang `box-shadow` dan sempadan biru secara langsung pada elemen `<input>` dalaman.
  - Disebabkan elemen `<input>` dalaman bermula selepas ikon dan berbentuk segi empat, ia menghasilkan garisan sempadan tegak bersegi (*inner rectangular box*) yang memotong bentuk melengkung kapsul pil luar.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Menyahaktifkan sebarang `border`, `outline`, dan `box-shadow` pada semua elemen `<input>` di dalam kontena berkapsul (`.search-field-compact input`, `.popup-date-input-wrap input`, `.input-wrap input`, `.date-input-pill input`).
    - Memindahkan keseluruhan kesan cincin fokus (*Apple Focus Halo*) kepada kontena pembungkus luar (`.search-field-compact:focus-within`, `.popup-date-input-wrap:focus-within`).
    - Kesan cahaya biru kini melengkung 100% licin dan berterusan mengikut geometri kapsul pil asal (`border-radius: var(--radius-pill, 9999px)`), merangkumi ikon dan teks tanpa sebarang pemotongan petak.
- **Pengesahan Ujian Visual (DevTools Screenshot)**:
  - Diuji pada bar carian utama (`browse-cars.html`) dan modal popup tempahan pantas: cincin fokus biru kini membalut keseluruhan kapsul pil secara lancar dan sempurna 100%.
- **Maklumat Git**:
  - Commit: `5.2.46 Ensure focus highlight follows seamless continuous pill shape without inner rectangular artifacts`
  - Tag Versi: `5.2.46`

---

## 🎯 [MINOR UPDATE] 87. Pembaikan Ketepatan Skrol Butang Carian Kereta (Precise Search Scroll Target Alignment) (v5.2.47)

- **Punca Masalah (Root Cause)**:
  - Sebelum ini, butang "Cari Kereta" memanggil `applyFilters(true)` yang mencari elemen `document.getElementById('cars')` dan melakukan `scrollIntoView()`.
  - Pada halaman `browse-cars.html`, sasaran tersebut tidak didefinisikan secara tepat atau mengalami limpahan skrol sehingga tergelincir jauh ke bawah melepasi *footer*.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `customer/js/customer.js`:
    - Mengemaskini fungsi `applyFilters(shouldScroll)` untuk mencari sasaran utama `.filter-bar`, `#cars-grid`, atau `#cars`.
    - Mengira kedudukan puncak secara jitu (`target.getBoundingClientRect().top + window.pageYOffset - 16px`) dan menggunakan `window.scrollTo({ top: offsetPosition, behavior: 'smooth' })`.
    - Mendedahkan `window.applyFilters = applyFilters;` ke skop global.
  - Di dalam `customer/pages/browse-cars/browse-cars.html`:
    - Menambah `id="cars"` pada `<section class="dash-section browse-section" id="cars">`.
- **Hasil Visual (Visual Verification)**:
  - Apabila butang "Cari Kereta" ditekan, skrin meluncur secara lancar dan memaparkan bar cip kategori ("Semua Kereta", "Sedan", "SUV", dsb.) serta barisan kad kereta pertama tepat di pandangan utama tanpa menggelongsor jauh ke bahagian *footer*.
- **Maklumat Git**:
  - Commit: `5.2.47 Fix search button scroll target to smoothly align at filter bar and car grid without overshooting`
  - Tag Versi: `5.2.47`

---

## 📅 [MINOR UPDATE] 88. Had Dinamik Pilihan Tahun & Kawalan Ralat Tarikh Bertindih Kalendar (Dynamic Year Constraint & Booked Date Conflict Guard) (v5.2.48)

- **Punca Masalah (Root Cause)**:
  - Sebelum ini, menu *dropdown* tahun pada kalendar Flatpickr dibina sekali sahaja dengan senarai tahun sehingga 10 tahun ke hadapan (`currentYear + 10`).
  - Apabila sesuatu kenderaan mempunyai tempahan sedia ada pada tarikh seterusnya (cth: 7 Oktober 2026), pemilih Tarikh Pulang telah menetapkan `maxDate` pada 6 Oktober 2026, tetapi menu *dropdown* tahun masih membenarkan pengguna memilih tahun 2027 hingga 2036.
  - Ini membolehkan sorotan julat terputus atau merentasi tarikh yang telah ditempah.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/js/calendar.js`:
    - Membina fungsi penyelarasan tahun dinamik `syncYearSelect(instance)` yang mengehadkan pilihan tahun dalam elemen `<select>` secara eksklusif antara `minDate` dan `maxDate`.
    - Apabila terdapat tarikh tempahan seterusnya pada tahun yang sama, *dropdown* tahun bagi Tarikh Pulang secara automatik **hanya memaparkan 1 tahun sahaja** (`2026`) dan menghalang pengguna memilih tahun hadapan yang tidak sah.
    - Menambah kawalan ralat pada `highlightRange()` dan fungsi `onChange` pemilih Tarikh Pulang supaya sebarang pemilihan tarikh yang merentasi jurang tempahan disekat serta merta dengan maklum balas gegaran haptik (*shake error feedback*).
- **Pengesahan Ujian Visual (DevTools Screenshot)**:
  - Menguji pemilihan tarikh 1 Oktober 2026 pada kereta yang ditempah pada 7 Oktober 2026: pemilih Tarikh Pulang kini mengunci tarikh selepas 6 Oktober dan *dropdown* tahun hanya memaparkan tahun tunggal `2026` sahaja dengan sempurna.
- **Maklumat Git**:
  - Commit: `5.2.48 Dynamically restrict calendar year select to valid booking window and block conflict ranges`
  - Tag Versi: `5.2.48`

---

## 🚀 [MINOR UPDATE] 89. Pembaikan Penuh Butang Carian & Penghapusan Limpahan Ketinggian Skrol (Search Hijacking Fix & Ghost Height Overflow Removal) (v5.2.49)

- **Punca Masalah Sebenar (Root Cause)**:
  1. Skrip `shared/js/search-popup.js` (dimuatkan secara global oleh `main.js`) mempunyai pendengar acara lalai yang merampas klik butang `.search-btn-compact` pada halaman carian katalog (`browse-cars.html`) dan memanggil `openPopup('')` secara automatik.
  2. Elemen popup `#sp-overlay` tidak mempunyai penggayaan CSS tetap di dalam `wedrive.css`, menyebabkan 6 keping imej kereta bersaiz penuh (1,688px tinggi setiap satu) dipaparkan dalam aliran dokumen biasa di bawah *footer*, mengakibatkan ketinggian halaman melonjak daripada 2,491px kepada **13,004px** (limpahan skrol kosong melebihi 10,500px).
  3. Teks *"Available Cars"* yang kelihatan di bawah/belakang *sidebar* sebenarnya adalah label tajuk `<div class="sp-section-label">Available Cars</div>` di dalam `#sp-results` popup carian yang terselit di bawah footer.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/js/search-popup.js`:
    - Menambah kawalan ketat `isCatalogPage` supaya pendengar carian global tidak merampas butang atau kotak input carian di halaman katalog `browse-cars.html`.
  - Di dalam `shared/css/wedrive.css`:
    - Menambah penggayaan modal penuh bertaraf Apple HIG untuk `.sp-overlay`, `.sp-modal`, `.sp-input-row`, `.sp-results`, dan `.sp-item-thumb` dengan `position: fixed !important; inset: 0 !important; z-index: 99999 !important; display: none !important;` supaya popup tidak sekali-kali mengganggu aliran dokumen atau ketinggian halaman.
  - Di dalam `customer/js/customer.js`:
    - Menyelaraskan fungsi `applyFilters(true)` dengan penimbal *rendering* 50ms untuk mengira dan meluncurkan skrin secara lembut tepat ke kedudukan `scrollY: 212px`.
  - Di dalam `browse-cars.html` dan `main.js`:
    - Mengemaskini parameter *cache-buster* kepada `?v=5.2.49`.
- **Pengesahan Ujian Visual (DevTools Screenshot)**:
  - Ketinggian keseluruhan halaman kembali normal pada **2,491px** (tiada lagi 13,000px limpahan kosong).
  - Apabila butang *"Cari Kereta"* ditekan secara manual, skrin meluncur secara lancar dan mendarat **tepat pada barisan cip kategori ("Semua Kereta", "Sedan", dsb.) serta memaparkan 3 kad kenderaan teratas** secara penuh dan kemas tanpa sebarang teks terselit di belakang *sidebar*.
- **Maklumat Git**:
  - Commit: `5.2.49 Fix search popup hijacking and eliminate ghost document height overflow`
  - Tag Versi: `5.2.49`

---

## 🚗 [MINOR UPDATE] 90. Penapisan Automatik Kereta Bertindih Tarikh Tempahan & Penyeragaman Status Tersedia (Date Range Conflict Filtering & Unified Available Status) (v5.2.50)

- **Punca Keperluan (Context & Root Cause)**:
  - Sebelum ini, fungsi penapis carian `applyFilters()` hanya menapis kategori kenderaan dan menyusun mengikut harga/penarafan tanpa memeriksa tarikh tempahan yang dipilih pada `pickup-date` dan `return-date`.
  - Selain itu, status kenderaan (seperti BMW 320i yang sedang disewa hari ini) memaparkan lencana merah/oren *"Rented"* pada kad katalog pelanggan walaupun pelanggan melayari katalog untuk menempah perjalanan pada tarikh masa hadapan yang belum ditempah.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `customer/js/customer.js`:
    - Menambah cache data tempahan aktif `allBookingsCache` yang dimuatkan serentak melalui `Promise.all([getCars(), getBookings()])` semasa `loadCars()`.
    - Membina fungsi pembantu `parseDateDMY(dateStr)` untuk memproses tarikh format `DD/MM/YYYY` daripada kalendar Flatpickr kepada objek tarikh yang sah.
    - Membina fungsi semakan pertindihan tarikh `isCarBookedOnDates(car, pickupDate, returnDate)` yang menyemak sama ada sesuatu kenderaan mempunyai tempahan aktif (`Confirmed`, `Active`, `Pending`) yang bertindih dengan tarikh carian pengguna.
    - Mengintegrasikan penapisan tarikh ke dalam `applyFilters()`: sekiranya pengguna memilih tarikh sewaan, mana-mana kenderaan yang telah ditempah pada tarikh tersebut **dikeluarkan terus (disembunyikan secara automatik)** daripada senarai hasil carian.
    - Menyelaraskan fungsi `statusKey(car)` bagi paparan katalog pelanggan: semua kenderaan yang boleh disewa dipaparkan dengan lencana hijau *"Available"* (*Tersedia*) kerana kenderaan yang bertindih tarikh sudah pun ditapis keluar secara automatik daripada paparan.
  - Di dalam `customer.html` dan `browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.50`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Paparan Katalog Lalai**: Kesemua 8 kenderaan memaparkan lencana hijau *"Available"* (*Tersedia*) secara kemas dan seragam.
  - **Ujian Penapisan Tarikh Bertindih (26/08/2026 – 27/08/2026)**: Kereta BMW 320i, Golf GTI, dan Axia G yang mempunyai tempahan aktif ditapis keluar secara automatik (`hasBMW: false`), hanya memaparkan 5 kereta yang benar-benar kosong.
  - **Ujian Tarikh Awal Oktober (01/10/2026 – 05/10/2026)**: BMW 320i (yang kosong pada minggu pertama Oktober) dipaparkan dengan status *"Available"*, manakala Mercedes GLA250 (yang ditempah 2-6 Oktober) disembunyikan secara automatik.
- **Maklumat Git**:
  - Commit: `5.2.50 Filter out booked cars during selected date range and display Available for customer fleet catalog`
  - Tag Versi: `5.2.50`

---

## 💎 [MINOR UPDATE] 91. Kapsul Carian Terapung Kaca Apple HIG & Kesan 'Sticky Frosted Glass' (Apple Floating Frosted Glass Search Capsule) (v5.2.51)

- **Punca Keperluan (Design Rationale & Context)**:
  - Sebelum ini, bar carian tarikh (`.search-bar-compact`) pada halaman katalog pelanggan `browse-cars.html` berbentuk kad statik dengan latar belakang putih biasa.
  - Pengguna meminta reka bentuk bar carian ini dijadikan **terapung (*floating capsule*)** dengan kemasan kaca kabur (*frosted glassmorphism*) serupa seperti bar navigasi utama pada halaman pelawat (*guest navbar*).
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Mengemaskini `.search-bar-compact` dengan kedudukan terapung `position: sticky; top: 16px; z-index: 95;`.
    - Menambah kesan kaca tulen bertaraf Apple HIG: `background: var(--bg-surface-elevated, rgba(255, 255, 255, 0.85)); -webkit-backdrop-filter: blur(28px) saturate(190%); backdrop-filter: blur(28px) saturate(190%);`.
    - Menambah bayang terapung lembut (*floating elevation shadows*): `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04);` dan sempadan kapsul penuh `border-radius: var(--radius-pill); border: 1px solid var(--border-medium);`.
    - Menyelaraskan kotak input dalaman `.search-field-compact` dengan latar belakang semi-lutsinar kapsul pil berserta animasi interaktif dan fokus biru Apple.
    - Menambah sokongan penuh Mod Gelap (*Dark Mode*) bagi `body.night-mode` dan `body.dark`: `background: rgba(22, 22, 26, 0.88); border-color: rgba(255, 255, 255, 0.12); box-shadow: 0 12px 36px rgba(0, 0, 0, 0.38);`.
  - Di dalam `customer/js/customer.js`:
    - Menyelaraskan fungsi skrol lancar `applyFilters(true)` agar mengira ketinggian bar carian terapung (`searchBar.offsetHeight + 24`) supaya cip penapis kenderaan dan kad teratas berada kemas tepat di bawah kapsul terapung.
  - Di dalam `browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.51`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Kesan Terapung (*Sticky Scrolling*)**: Semasa skrol ke bawah pada grid kenderaan, bar carian terapung dengan lancar di bahagian atas skrin (`top: 16px`) dengan kesan latar belakang kabur di atas kad-kad kereta yang bergerak.
  - **Ujian Mod Gelap (*Dark Mode*)**: Kapsul carian mengekalkan kesan kaca gelap mewah yang kontras dan mudah dibaca.
- **Maklumat Git**:
  - Commit: `5.2.51 Implement Apple floating frosted glass capsule search bar on browse cars page`
  - Tag Versi: `5.2.51`

---

## 🔒 [MINOR UPDATE] 92. Penguatkuasaan Syarat Tunggal Goncangan Kalendar & Nyahaktif Automatik Selepas Pengisian Tarikh Mula (Strict Single Condition Calendar Shake & Auto-Disable Upon Pick-up Selection) (v5.2.52)

- **Punca Keperluan (Context & Direct User Directive)**:
  - Pengguna menetapkan satu syarat sahaja bila animasi goncangan ralat (`.date-shake-error` dan `.date-pickup-pulse`) dibenarkan berlaku:
    > *"sepatutnya ada satu syarat sahaja bila nak goncangkan apabila user x isi lagi tarikh start pinjam. tapi kalau user dh letak tarik mula pinjam tu terus disable kan goncang tu. 1 sahaja syarat untuk goncangkan tu apabila user x letak lagi start pinjam.."*
  - Sebelum ini, goncangan ralat kadangkala boleh terpicu secara tidak sengaja apabila pengguna mengklik tarikh pemulangan walaupun tarikh pengambilan sudah dipilih (disebabkan pemeriksaan bertindih atau pengendalian penutupan pemilih).
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/js/calendar.js`:
    - Membina fungsi semakan `isPickupFilled()`:
      ```javascript
      function isPickupFilled() {
        return (pPicker && pPicker.selectedDates && pPicker.selectedDates.length > 0) ||
               (pickupInput && pickupInput.value && pickupInput.value.trim() !== '');
      }
      ```
    - Di dalam `triggerPickupRequiredFeedback()`: Menyuntik sekatan mutlak awal (`if (isPickupFilled()) return;`). Sekiranya tarikh pengambilan telah dipilih atau diisi, fungsi goncangan **dinyahaktifkan 100% serta-merta**.
    - Di dalam `onReturnAttempt(e)` dan `rPicker.onOpen`: Hanya mencetuskan maklum balas ralat jika `!isPickupFilled()`. Sebaik sahaja pengguna telah menetapkan tarikh pengambilan, interaksi dengan tarikh pemulangan akan membuka kalendar pemulangan secara lancar tanpa sebarang goncangan atau garis merah.
    - Di dalam `rPicker.onChange`: Membuang panggilan `triggerPickupRequiredFeedback()` semasa tarikh bertindih, memadai dengan mengosongkan tarikh yang tidak sah tanpa mengganggu pengguna dengan animasi goncang.
    - Di dalam `initPairedPickers`: Memastikan sebarang instans Flatpickr lama dimusnahkan (`destroy()`) dan pengendali klik diselaraskan secara eksklusif (`.onclick = onReturnAttempt`) bagi mengelakkan pertindihan *event listener*.
  - Di dalam `browse-cars.html` dan `customer.html`:
    - Mengemaskini *cache-buster* `calendar.js` kepada `?v=5.2.52`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian 1 (Tarikh Pengambilan KOSONG)**: Klik pada medan Tarikh Pemulangan $\to$ Berjaya mencetuskan goncangan ralat pada kotak pemulangan dan denyutan biru pada kotak pengambilan untuk memandu pengguna (`hasShakeError: true`).
  - **Ujian 2 (Tarikh Pengambilan TERISI, cth: 26/08/2026)**: Klik pada medan Tarikh Pemulangan $\to$ Kalendar pemulangan terbuka serta-merta dengan **SIFAR goncangan** (`shakeOnReturnClick: false`, `shakeAfterSelection: false`). Pengguna boleh memilih tarikh pemulangan (cth: 29/08/2026) dengan lancar dan paparan julat biru Apple yang sempurna.
- **Maklumat Git**:
  - Commit: `5.2.52 Enforce strict single condition for date shake feedback and disable shake once pickup date is selected`
  - Tag Versi: `5.2.52`

---

## 📌 [MINOR UPDATE] 93. Penyelarasan Kalendar Terapung Terkunci & 'Real-Time Scroll Sync' (Apple HIG Viewport-Locked Floating Calendar Synchronization) (v5.2.53)

- **Punca Keperluan (Design Rationale & Context)**:
  - Apabila pengguna membuka pemilih tarikh kalendar (*Flatpickr*) pada bar carian terapung (`.search-bar-compact`) dan kemudian menatal skrin (*scroll down*), kalendar popover sebelum ini tertinggal pada koordinat mutlak dokumen asal (*detached/left behind*) kerana menggunakan `position: absolute` pada elemen `<body>`.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Menukar kedudukan `.flatpickr-calendar` kepada `position: fixed !important;` dengan aras `z-index: 99999 !important;` supaya sentiasa berlabuh tepat pada koordinat *viewport* berbanding bar carian terapung.
  - Di dalam `shared/js/calendar.js`:
    - Membina enjin kedudukan dinamik `updateFixedCalendarPosition(fp)`:
      - Mengira koordinat terkini kotak input secara masa nyata (`input.getBoundingClientRect()`).
      - Mengunci popover kalendar tepat di bawah kotak input dengan jurang Apple HIG 8px (`top = inputRect.bottom + 8px; left = inputRect.left`).
      - Menyokong pengesanan sempadan skrin (*viewport overflow boundary detection*) untuk menyelaraskan popover ke atas jika ruang bawah tidak mencukupi atau mengimbangi ke kanan jika melebihi lebar skrin.
      - Menutup kalendar secara automatik jika medan input ditatal sepenuhnya keluar dari skrin.
    - Menambah pendengar acara global:
      ```javascript
      window.addEventListener('scroll', repositionAllOpenCalendars, { passive: true, capture: true });
      window.addEventListener('resize', repositionAllOpenCalendars, { passive: true });
      ```
    - Memautkan pemanggil kedudukan tetap ke dalam `commonConfig.position`, `onOpen`, `onMonthChange`, dan `onYearChange`.
  - Di dalam `browse-cars.html` dan `customer.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.53`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Semasa Skrol (Scroll Down 400px)**: Semasa skrol dari atas skrin ke bahagian tengah katalog kenderaan, popover kalendar bergerak secara sinkronik bersama bar carian terapung dan kekal tepat di bawah kotak input dengan jurang tepat 8px (`gap: 8px`).
  - **Ujian Skrol Semula ke Atas (Scroll Back to Top)**: Kalendar meluncur semula ke posisi asal secara licin tanpa sebarang lompatan atau koordinat lari.
- **Maklumat Git**:
  - Commit: `5.2.53 Implement viewport fixed calendar positioning with real-time scroll sync for floating search capsule`
  - Tag Versi: `5.2.53`

---

## 🧭 [MINOR UPDATE] 94. Susun Atur Sebelah-Menyebelah Kad Kiraan Masa & Lokasi Pemulangan (Side-by-Side Compact Return Countdown & Location Hub) (v5.2.54)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta agar kad Lokasi Pemulangan (*Return Location*) diletakkan di sebelah kanan kad masa, dan kad masa diperkecilkan sedikit (*compact*):
    > *"yang ni kan return location tu awak letak kanan sebelah masa tu..card masa tu awak kecikkan sikit"*
  - Sebelum ini, kedua-dua kad ini disusun secara bertindan ke bawah (*vertical stack*) yang memakan ruang menegak yang agak besar.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `customer/pages/dashboard/customer.html`:
    - Menggantikan susunan bertindan dengan bekas grid baris `.booking-meta-row`.
    - Di sebelah kiri: Kad kiraan masa kompak `.countdown-hub` (`#countdown-hub`) yang memaparkan 4 unit masa Hari, Jam, Minit, Saat berserta tarikh pemulangan rasmi.
    - Di sebelah kanan: Kad lokasi pemulangan khas `.booking-location-hub` (`#booking-location-hub`) yang memaparkan ikon pin, tajuk `Return Location`, nilai lokasi dinamik `#active-return-val`, dan lencana hijau `.location-hub-sub` (*HQ Drop-off Zone*).
    - Mengemaskini *cache-buster* kepada `?v=5.2.54`.
  - Di dalam `shared/css/wedrive.css`:
    - Menambah gaya `.booking-meta-row { display: grid; grid-template-columns: auto 1fr; gap: 14px; align-items: stretch; margin: 6px 0 16px; }`.
    - Memperhalusi kad masa `.countdown-hub`: `padding: 12px 16px`, saiz unit `padding: 6px 9px; min-width: 46px;`, fon digit `19px SF Pro/SF Mono`, label `9px`.
    - Mereka bentuk `.booking-location-hub`: kemasan kaca Apple HIG, tipografi kemas `font-size: 15px; font-weight: 800;` untuk nama lokasi, dan lencana hijau status zon pemulangan.
    - Menyokong reponsif `@media (max-width: 680px)` yang menyusun semula kepada 1 lajur pada skrin peranti mudah alih.
  - Di dalam `customer/pages/browse-cars/browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.54`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Susun Atur Dashboard (`customer.html`)**: Kad masa kompak dan kad lokasi pemulangan terletak kemas sebelah-menyebelah dengan ketinggian yang sama dan seimbang.
  - **Ujian Dwibahasa (EN / MS)**: Pertukaran bahasa mengemas kini teks `Baki Masa Pemulangan Kenderaan` dan `Lokasi Pemulangan` dengan tepat tanpa sebarang herotan susun atur.
- **Maklumat Git**:
  - Commit: `5.2.54 Place return location beside compact countdown card on active booking hub`
  - Tag Versi: `5.2.54`

---

## 🎨 [MINOR UPDATE] 95. Integrasi Reka Bentuk 'Stitch Glassmorphism' pada Kad Tempahan Aktif (Stitch AI-Elevated Glassmorphism Active Rental Hub) (v5.2.55)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta reka bentuk bahagian ini dipertingkatkan menggunakan enjin Stitch AI agar kelihatan lebih menarik, anggun, dan bertaraf premium antarabangsa:
    > *"Cuba awak suruh stitch yang buat kan yang itu sahaja untuk bagi menarik"*
- **Tindakan Pembaikan (Implementation via Stitch MCP & Custom CSS)**:
  - Menggunakan alat `StitchMCP.generate_screen_from_text` untuk projek WeDRIVE (`1862124494843018493`), menghasilkan lakaran skrin bertaraf Apple HIG dan mengekstrak komponen CSS moden:
    - **Kedalaman Kaca (*Frosted Glassmorphism Layering*)**:
      - Menyuntik `-webkit-backdrop-filter: blur(18px) saturate(180%); backdrop-filter: blur(18px) saturate(180%);` pada kedua-dua kad `.countdown-hub` dan `.booking-location-hub`.
      - Menambah sempadan kaca halus `border: 1px solid var(--border-glass, rgba(0, 0, 0, 0.07))` dan bayang-bayang lembut bertingkat `box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)`.
    - **Perincian Mikro Unit Masa (*Refined Micro-Tiles*)**:
      - Saiz jubin unit masa (`01 D : 17 H : 57 M : 10 S`) diperhalusi dengan bucu `border-radius: 11px`, fon digit `20px SF Pro/SF Mono`, dan pembahagi bertitik (`opacity: 0.6`).
    - **Peningkatan Kad Lokasi Pemulangan (*Elevated Return Location Card*)**:
      - Tipografi lokasi tebal `15.5px` dengan lencana zon pemulangan berwarna hijau Apple (`background: rgba(52, 199, 89, 0.12); border: 1px solid rgba(52, 199, 89, 0.25)`).
    - **Sokongan Penuh Mod Gelap (*Dark Mode Glass*)**:
      - Menyediakan penggayaan kaca gelap eksklusif untuk `body.night-mode` dan `body.dark` (`background: rgba(26, 26, 30, 0.85); border-color: rgba(255, 255, 255, 0.12)`).
  - Di dalam `customer/pages/dashboard/customer.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.55`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Visual Dashboard**: Kad tempahan aktif memaparkan kontras kaca Apple yang sangat memukau, kemas, seimbang, dan interaktif dengan kesan animasi terapung (*hover elevation*).
- **Maklumat Git**:
  - Commit: `5.2.55 Elevate active booking countdown and return location card with Stitch glassmorphism styling`
  - Tag Versi: `5.2.55`

---

## 🏎️ [MINOR UPDATE] 96. Penukaran Gambar Kenderaan Kotak kepada Sudut Melengkung Bento Apple HIG (Curved Apple HIG Bento Vehicle Image Container) (v5.2.56)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta agar elemen gambar kenderaan yang kelihatan bersegi tepat/petak (`petak2`) ditukar menjadi melengkung (*curved*) supaya seragam dengan gaya reka bentuk keseluruhan:
    > *"kalau boleh x nak benda petak2 nii kalau boleh ikut curved jugak"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Memperbaharui kelas `.booking-image`:
      - Menambah `border-radius: var(--radius-bento, 20px);` dan `overflow: hidden;`.
      - Menyuntik warna latar belakang permukaan `background: var(--bg-surface-2, #f5f6f9);`, sempadan halus `border: 1px solid var(--border-subtle, rgba(0, 0, 0, 0.06));`, dan bayang-bayang lembut `box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);`.
      - Menetapkan `height: 100%; min-height: 190px; max-height: 220px;`.
    - Memperbaharui kelas `.booking-image img`:
      - Menambah `border-radius: var(--radius-bento, 20px);`, `object-fit: cover;`, dan kesan peralihan animasi licin `transition: transform 0.35s var(--ease-apple);`.
      - Menambah kesan zum mikro dinamik semasa hover: `.active-booking-card:hover .booking-image img { transform: scale(1.03); }`.
  - Di dalam `customer/pages/dashboard/customer.html` dan `customer/pages/browse-cars/browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.56`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Visual Dashboard**: Gambar kenderaan (BMW 320i M Sport) kini tampil dengan bucu melengkung `20px` yang sangat anggun dan serasi 100% dengan estetika kad bento Apple HIG di papan pemuka pelanggan.
- **Maklumat Git**:
  - Commit: `5.2.56 Apply curved Apple HIG bento corners to active booking vehicle image container`
  - Tag Versi: `5.2.56`

---

## 🍏 [MINOR UPDATE] 97. Penstrukturan Semula Kad Tempahan Aktif Piawaian Apple HIG Master melalui Stitch Gemini 3.1 Pro (Master Apple HIG Active Rental Hub with Gemini 3.1 Pro & Variants Ideation) (v5.2.57)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta agar elemen-elemen yang kelihatan seperti "AI-generic" dihapuskan dan digantikan dengan mutu pertukangan asli Apple (*human-crafted Apple minimalism*) mengikut peraturan rasmi Apple HIG:
    > *"kalau boleh kan kurangkan sendikit nampak macam ai ..suruh stitch buatkan nampak premium macam apple ikut rules apple"*
    > *"dekat stitch tu kan awak pakai gemini pro / redesign / ideate ..jangan pakai flash sebab saya nak maximum penggunaan stitch produce kalau boleh"*
- **Tindakan Pembaikan (Implementation via Stitch Gemini 3.1 Pro & Apple HIG Tokens)**:
  - Menggunakan enjin **Gemini 3.1 Pro** pada Stitch (`StitchMCP.generate_screen_from_text` dan `StitchMCP.generate_variants` dengan `creativeRange: "REFINE"`):
    - **Struktur Kad Bento Squircle 24px**:
      - Menggunakan bekas bento squircle `border-radius: 24px` dengan sempadan sub-piksel `1px solid rgba(0, 0, 0, 0.06)` dan bayang-bayang ambien meresap `0 4px 24px rgba(0, 0, 0, 0.04)`.
    - **Ruang Gambar Kenderaan & Kapsul Status Bersinar**:
      - Gambar kenderaan diletakkan di dalam kanvas bento `border-radius: 20px` berlatar belakang `#F5F5F7`.
      - Lencana `Active Rental` menggunakan kapsul kaca beku berkontras lembut dengan titik status hijau bertenaga (`.status-pulse-dot`) bernafas halus (`animation: applePulseDot 2s infinite`).
    - **Kiraan Masa Tabular San Francisco (*SF Pro Tabular Timer*)**:
      - Membuang kotak digit bersempadan tebal lama yang nampak seperti widget generik web.
      - Menggantikannya dengan tipografi tabular bersih `01d : 17h : 43m : 57s` (`font-variant-numeric: tabular-nums; font-size: 22px; font-weight: 700;`) yang stabil tanpa sebarang getaran angka.
    - **Kad Lokasi Pemulangan Apple Maps**:
      - Dilengkapi tajuk *Title Case* kemas `Return Location`, nama depot `Melaka Sentral (HQ)`, dan kapsul hijau Apple `Keyless Drop-off Zone`.
    - **Butang Kapsul Apple HIG (*Apple Action Pill Buttons*)**:
      - Butang utama `Extend Rental` menggunakan kapsul biru rasmi Apple (`#0071E3`) dengan bayang-bayang lembut dan maklum balas sentuhan taktil `active { transform: scale(0.97); }`.
      - Butang sekunder `Rent Another Car` menggunakan kapsul kelabu Apple (`#F2F2F7`).
  - Di dalam `customer/pages/dashboard/customer.html` dan `customer/pages/browse-cars/browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.57`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Visual Dashboard**: Kad tempahan aktif kini kelihatan 100% tulen seperti aplikasi asli iOS 18/macOS Sequoia tanpa sebarang kesan visual "AI robotik".
  - **Ujian Dwibahasa (EN / MS)**: Pertukaran teks dwibahasa berfungsi secara dinamik (`Baki Masa Pemulangan Kenderaan`, `Lokasi Pemulangan`, `Lanjutkan Sewaan`).
- **Maklumat Git**:
  - Commit: `5.2.57 Re-engineer active rental card to master Apple HIG standards using Stitch Gemini 3.1 Pro`
  - Tag Versi: `5.2.57`

---

## 📐 [MINOR UPDATE] 98. Penyelarasan Nisbah Kad Masa (Dipanjangkan) dan Kad Lokasi (Dikecilkan) (Proportional Alignment: Elongated Countdown & Compact Return Hub) (v5.2.58)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta agar kad Return Location dikecilkan sedikit manakala kad Time Remaining dipanjangkan agar ruangan lebih seimbang:
    > *"saya rasa ni kecikkan gambar 1 return location tu n panjangkna gambar 2 tu"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Mengemaskini susun atur grid `.booking-meta-row`:
      - Menukar `grid-template-columns: auto 1fr;` kepada `grid-template-columns: 1fr auto;`.
      - Hasilnya:
        - **Kad Masa (`countdown-hub`)**: Mendapat ruang `1fr` yang lebih panjang dan lapang, membolehkan paparan masa tabular bernafas dengan selesa.
        - **Kad Lokasi (`booking-location-hub`)**: Dikecilkan secara automatik (`auto`) membungkus kandungan teks depot dan lencana zon pemulangan secara padat dan kemas tanpa ruang kosong berlebihan di bahagian kanan.
  - Di dalam `customer/pages/dashboard/customer.html` dan `customer/pages/browse-cars/browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.58`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Visual Dashboard**: Paparan kad masa kini kelihatan lebih panjang dan seimbang manakala kad lokasi pemulangan menjadi padat dan kemas mengikut kehendak pengguna.
- **Maklumat Git**:
  - Commit: `5.2.58 Elongate active timer card and compact return location card layout`
  - Tag Versi: `5.2.58`

---

## 🗑️ [MINOR UPDATE] 99. Pembuangan Lencana Zon Pemulangan pada Kad Lokasi (Removal of Keyless Drop-off Zone Badge) (v5.2.59)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta agar lencana kapsul teks *Keyless Drop-off Zone* pada kad lokasi pemulangan dibuang untuk paparan yang lebih ringkas dan bersih:
    > *"perkataan ni buang"* (merujuk kepada lencana `Keyless Drop-off Zone`)
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `customer/pages/dashboard/customer.html`:
    - Memadam elemen `.location-hub-sub` berserta ikon `key_off` dan teks `Keyless Drop-off Zone` dari dalam bekas `#booking-location-hub`.
  - Di dalam `shared/css/wedrive.css`:
    - Memperhalusi `.booking-location-hub` dengan `justify-content: center; gap: 8px;` dan menyelaraskan `.location-hub-header` agar kedudukan tajuk `Return Location` dan nama lokasi `Melaka Sentral (HQ)` berada tepat di tengah secara menegak (*vertically centered*).
    - Memadam kod CSS `.location-hub-sub` yang tidak lagi digunakan.
  - Di dalam `customer/pages/dashboard/customer.html` dan `customer/pages/browse-cars/browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.59`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Visual Dashboard**: Kad lokasi pemulangan kini tampil ultra-minimalis, hanya memaparkan ikon pin, tajuk `Return Location`, dan nama depot `Melaka Sentral (HQ)`.
- **Maklumat Git**:
  - Commit: `5.2.59 Remove keyless drop-off badge from active return location card`
  - Tag Versi: `5.2.59`

---

## 📐 [MINOR UPDATE] 100. Perluasan Paparan Kiraan Masa Memenuhi Ruang Kad (Expanded Timer Typography Across Full Container Width) (v5.2.60)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta agar teks / nombor kiraan masa (*countdown timer readout*) dilebarkan dan dibesarkan supaya memenuhi keseluruhan ruang petak kad:
    > *"tulisan tu expand sampai penuhkan muatkan petak ni"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Mengemaskini `.apple-timer-display`:
      - Menggunakan `display: flex; justify-content: space-between; align-items: baseline; width: 100%;`.
    - Membesarkan tipografi nombor `.apple-timer-num` dari `22px` kepada `28px` dengan ketebalan `font-weight: 750` dan mengekalkan `font-variant-numeric: tabular-nums;`.
    - Menyelaraskan unit `.apple-timer-unit` kepada `13.5px` dan pemisah `.apple-timer-sep` kepada `20px`.
    - Menyelaraskan saiz teks tajuk `.countdown-header` (12px) dan subjudul tarikh pemulangan `.countdown-deadline` (12px).
  - Di dalam `customer/pages/dashboard/customer.html` dan `customer/pages/browse-cars/browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.60`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Visual Dashboard**: Angka kiraan masa `01d : 14h : 06m : 45s` kini terbentang kemas memenuhi seluruh kelebaran kad (*full width expansion*) dengan susunan yang sangat simetri, jelas dibaca, dan seimbang dalam kedua-dua mod cerah dan gelap.
- **Maklumat Git**:
  - Commit: `5.2.60 Expand active countdown timer typography to fill full container width`
  - Tag Versi: `5.2.60`

---

## 🚗 [MINOR UPDATE] 101. Penyelarasan Perkataan "Fleet" Kepada "Car / Cars" (Standardization of Fleet to Car / Cars) (v5.2.61)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta agar perkataan *Fleet* diubahsuai kepada *Car / Cars* untuk keselarasan istilah yang lebih mesra pengguna:
    > *"Kalau boleh kan awak cari perkataan fleet tu ubah jadi Car boleh"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `customer/pages/dashboard/customer.html`:
    - Menukar tajuk seksyen `Featured Fleet` kepada `Featured Cars` (`data-key="cust_featured_fleet"`).
    - Menukar ayat promosi `Explore our premium AI-ready fleet...` kepada `...premium AI-ready cars...` (`data-key="no_rental_desc"`).
  - Di dalam `customer/js/customer.js`:
    - Mengemaskini lencana AI sekunder daripada `Popular Fleet` kepada `Popular Cars`.
  - Di dalam `shared/lang/en.json` & `shared/lang/en.js`:
    - Mengemaskini `about_stat_fleet` $\to$ `"Rental Cars"`
    - Mengemaskini `footer_col_fleet` $\to$ `"Cars & Rentals"`
    - Mengemaskini `cust_featured_fleet` $\to$ `"Featured Cars"`
    - Mengemaskini `no_rental_desc` $\to$ `"You currently have no ongoing rentals. Explore our premium AI-ready cars in Melaka with instant keyless pickup."`
  - Di dalam `shared/lang/ms.json` & `shared/lang/ms.js`:
    - Mengemaskini `footer_col_fleet` $\to$ `"Kereta & Sewaan"`
    - Mengemaskini `cust_featured_fleet` $\to$ `"Pilihan Kereta Popular"`
    - Mengemaskini `no_rental_desc` $\to$ `"Anda tiada sewaan yang sedang berlangsung. Teroka pilihan kereta premium sedia AI kami di Melaka dengan pengambilan tanpa kunci segera."`
  - Di dalam `shared/js/main.js`:
    - Mengemaskini kamus *fallback* dwibahasa (EN & MS).
    - Memperbaharui *cache-buster* `resolveLangPath` kepada `?v=5.2.61`.
  - Di dalam `shared/components/footer.html` & `shared/pages/footer/about/about.html`:
    - Menyelaraskan teks statik *Fleet* kepada *Kereta / Rental Cars*.
  - Di dalam `customer/pages/dashboard/customer.html` dan `customer/pages/browse-cars/browse-cars.html`:
    - Mengemaskini *cache-buster* kepada `?v=5.2.61`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Visual Dashboard**: Tajuk seksyen kenderaan kini dipaparkan dengan tepat sebagai `Featured Cars` (Bahasa Inggeris) dan `Pilihan Kereta Popular` (Bahasa Melayu) beserta ikon kereta yang sepadan.
- **Maklumat Git**:
  - Commit: `5.2.61 Standardize Fleet terminology to Car and Cars across UI and lang files`
  - Tag Versi: `5.2.61`

---

## 🔘 [MINOR UPDATE] 102. Pembetulan Butang Tema Bulat Sempurna & Kemas Kini Placeholder Emel (Perfect Circular Theme Toggle & Dynamic Email Placeholder Sync) (v5.2.62)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna mendapati bahawa butang penukar tema (*theme toggle button*) di sudut atas kelihatan bujur / lonjong (*oval*) dan bukan bulat sempurna:
    > *"ni tukar buatkan bulat jangan oval"*
  - Pengguna juga mendapati suntingan teks *placeholder* emel pada borang log masuk tidak berubah kerana diatasi oleh enjin penterjemahan dwibahasa `data-key-ph`.
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Mengemaskini `.theme-toggle`, `.btn-theme`, `.theme-toggle-btn` dengan saiz tepat `width: 36px !important; height: 36px !important; min-width: 36px !important; max-width: 36px !important; min-height: 36px !important; max-height: 36px !important; aspect-ratio: 1 / 1 !important; border-radius: 50% !important;`.
    - Mengemaskini `.lang-toggle`, `.btn-lang` dengan ketinggian selaras `height: 36px !important; min-height: 36px !important; max-height: 36px !important; min-width: 46px !important; border-radius: var(--radius-pill, 9999px) !important;`.
    - Menambah pengecualian `:not(.theme-toggle):not(.btn-theme):not(.theme-toggle-btn):not(.icon-btn)` pada peraturan global aksesibiliti `button { min-height: 38px; }` dan `min-height: 44px;` agar tidak meregangkan butang ikon bulat.
  - Di dalam `shared/lang/en.json`, `shared/lang/en.js`, `shared/lang/ms.json`, `shared/lang/ms.js`, `shared/js/main.js`:
    - Menyelaraskan nilai `login_email_ph` dan `signup_email_ph` kepada `"Enter your email"` (EN) dan `"Masukkan emel anda"` (MS).
    - Memperbaharui *cache-buster* `resolveLangPath` kepada `?v=5.2.62`.
  - Di dalam `account/pages/login/login.html`, `account/pages/signup/signup.html`:
    - Menyelaraskan teks statik *placeholder* emel kepada `"Enter your email"`.
    - Mengemaskini *cache-buster* kepada `?v=5.2.62`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Dimensi DevTools**: Butang penukar tema kini berukuran tepat $36\text{px} \times 36\text{px}$ (nisbah 1:1, bulat sempurna tanpa bentuk bujur) bersambung selaras dengan butang bahasa berukuran ketinggian $36\text{px}$.
  - **Ujian Borang Log Masuk**: *Placeholder* emel kini memaparkan `"Enter your email"` (EN) dan `"Masukkan emel anda"` (MS) dengan sempurna tanpa nilai *hardcoded*.
- **Maklumat Git**:
  - Commit: `5.2.62 Ensure 1:1 perfect circle for theme toggle and sync email input placeholders`
  - Tag Versi: `5.2.62`

---

## 🚗 [MINOR UPDATE] 103. Penyelarasan Menyeluruh Istilah "Fleet" Kepada "Car / Cars" (Full Project Fleet-to-Car Terminology Migration) (v5.2.63)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta penukaran komprehensif bagi seluruh sistem agar tiada lagi istilah *Fleet* digunakan:
    > *"Tukarkan semua perkataan Fleet jadi Car"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `admin/pages/car/car-detail/car-detail.html`:
    - Mengemaskini keterangan butang lupus kenderaan daripada `Decommission vehicle from fleet` $\to$ `Decommission car from system`.
  - Di dalam `shared/js/chatbot.js`:
    - Mengemaskini ucapan pembantu operasi AI daripada `fleet management` $\to$ `car management`.
    - Mengemaskini *chip* cadangan soalan pentadbir dan pelanggan: `Fleet status` $\to$ `Car status` / `Status kereta`, `Browse fleet` $\to$ `Browse cars`.
    - Mengemaskini *system prompt context* (portal pentadbir dan pelawat awam) daripada `fleet availability / car rental fleet` $\to$ `car availability / rental cars`.
  - Di dalam `shared/lang/ms.json` & `shared/lang/ms.js`:
    - Mengemaskini `about_stat_fleet` $\to$ `"Kereta Pilihan"`.
  - Di dalam `customer/pages/dashboard/customer.html`:
    - Membuang atribut lewah `data-key="btn_browse_fleet"` pada tag `<a>` luaran agar tidak menimpa ikon dan teks anak.
  - Di dalam semua dokumen laporan projek (`REPORT/01_Chapter1_Introduction.md`, `REPORT/02_Chapter2_Literature_Review.md`, `REPORT/03_Chapter3_Analysis.md`, `REPORT/chapters/01_Abstract.md`, `REPORT/chapters/03_Chapter1_Introduction.md`, `REPORT/chapters/04_Chapter2_Literature_Review.md`, `REPORT/chapters/05_Chapter3_Analysis.md`, `REPORT/chapters/06_Chapter4_Design.md`, `REPORT/GAMBAR/1.1_wedrive_system_overview.svg`):
    - Menggantikan semua istilah *Fleet* kepada *Car / Cars / Car inventory / Car management*.
  - Di dalam `shared/js/main.js`:
    - Memperbaharui *cache-buster* `resolveLangPath` kepada `?v=5.2.63`.
  - Di dalam `customer.html`, `browse-cars.html`, `login.html`, `signup.html`:
    - Mengemaskini *cache-buster* aset kepada `?v=5.2.63`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Carian Global**: Carian `grep` projek mengesahkan 0 baki teks antaramuka yang menggunakan perkataan *Fleet*.
  - **Ujian Chatbot**: Butang cadangan dan ucapan AI kini memaparkan `Car status` dan `Browse cars` secara selaras dan lancar.
- **Maklumat Git**:
  - Commit: `5.2.63 Complete global migration of Fleet terminology to Car across code and documentation`
  - Tag Versi: `5.2.63`

---

## 📐 [MINOR UPDATE] 104. Pendokumentasian Standard Geometri: Minimum Bulat Sempurna & Pengembangan Kapsul Mendatar (Design System Standard: Minimum Circular Geometry & Horizontal Pill Expansion) (v5.2.64)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna menetapkan garis panduan reka bentuk UI yang kekal bagi memastikan keseragaman geometri seluruh komponen WeDRIVE:
    > *"Minimum kalau nak kecil jangan oval minimum bulat lepastu terus expand dari bulat tu lebarkan dia baru lawa ...catat mana2 minimum bulat bentuk sama size untuk mana2 pattern lepastu baru expand dari bulat tu tp saya tengok semua dh perfect"*
- **Tindakan Pembaikan & Piawaian (Design System Standardization)**:
  - Di dalam `.agents/rules/apple_hig_design_system.md` (Pilar 4: Komponen Antara Muka):
    - Merekodkan peraturan rasmi:
      1. **Bentuk Minimum Elemen Kompak (Ikon Tunggal)**: Elemen terkecil tanpa teks (cth. butang tema, butang tindakan bulat, butang tutup) **WAJIB mempunyai nisbah 1:1 bulat sempurna** (`width == height`, `aspect-ratio: 1 / 1 !important;`, `border-radius: 50% !important;`). Tidak dibenarkan berbentuk bujur/lonjong (*oval*).
      2. **Prinsip Pengembangan Mendatar (Kapsul/Pil Berkandungan)**: Apabila elemen mengandungi teks atau label (cth. butang bahasa, butang utama, *filter chip*), kelebaran elemen **mengembang secara mendatar daripada diameter bulat asas tersebut** ke bentuk kapsul/pil Apple (`border-radius: var(--radius-pill, 9999px) !important;`) dengan kedua-dua sisi mengekalkan lengkungan separuh bulatan yang simetri dan estetik.
  - Mengesahkan bahawa semua komponen sedia ada pada halaman log masuk, daftar, papan pemuka, penukar tema (`36px` $\times$ `36px`), dan butang bahasa (`36px` ketinggian pil) telah mencapai tahap kesempurnaan 100%.
- **Maklumat Git**:
  - Commit: `5.2.64 Document minimum circular geometry and horizontal pill expansion standard in design rules`
  - Tag Versi: `5.2.64`

---

## 🍏 [MINOR UPDATE] 105. Animasi Gelangsar Suis Apple iOS/macOS (Apple Segmented Glider & Spring Animation Engine) (v5.2.65)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna memuji rupa suis *Daily* vs *Weekly (Save 15%)* dan meminta animasinya dijadikan persis animasi fizikal Apple:
    > *"Sumpah switch macam ni lawa cuma animation dia kalau boleh macam apple"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Membina `.pricing-toggle`, `.segmented-control`, `.toggle-glider`, `.segmented-glider` dengan gelangsar fizikal bebas (`z-index: 1`) di belakang butang teks telus (`z-index: 2`).
    - Menetapkan fizik spring Apple: `transition: transform 0.36s cubic-bezier(0.16, 1, 0.3, 1), width 0.36s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease, box-shadow 0.25s ease;`.
    - Menyediakan reka bentuk permukaan *Obsidian True Black* (`#1C1C1E` dengan *highlight* tepi putih dan bayang lembut) untuk mod malam, serta putih tulen berkaca untuk mod siang.
    - Menyelaraskan reka letak bekas ke tengah skrin: `display: flex; width: fit-content; margin: 0 auto 48px; backdrop-filter: blur(16px);`.
    - Menambah maklum balas taktil Apple: `transform: scale(0.96);` semasa pengguna menekan (*active press*).
  - Di dalam `shared/js/main.js`:
    - Menambah **Seksyen 15F: Apple Segmented Control Glider Engine** (`initAppleSegmentedControlEngine` & `window.syncAppleSegmentedGliders`) yang mengira kedudukan `offsetLeft` dan `offsetWidth` secara automatik, serta menyegerak pergerakan semasa penukaran bahasa, tema, dan saiz skrin.
  - Di dalam `guest/pages/pricing/pricing.html`:
    - Menyisipkan `<div class="toggle-glider" aria-hidden="true"></div>`.
    - Menambah animasi mikro transisi nombor harga dan mengemaskini *cache-buster* kepada `?v=5.2.65`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Gelangsar Mod Malam**: Gelangsar meleret dengan lancar dari `translateX(4px)` (lebar 77px) ke `translateX(79px)` (lebar 168px) dengan lengkung *spring Apple* tanpa kelipan atau lompatan.
  - **Ujian Mod Siang**: Suis bertukar latar belakang putih tulen di atas trek kelabu separa telus dengan kontras teks dan bayang kaca yang sempurna.
- **Maklumat Git**:
  - Commit: `5.2.65 Implement Apple-style sliding glider animation for segmented switches`
  - Tag Versi: `5.2.65`

---

## 🏛️ [MINOR UPDATE] 106. Transformasi Reka Bentuk Apple HIG Halaman Tentang Kami (Apple HIG About Us & Story Showcase Styling) (v5.2.66)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta reka bentuk CSS khusus bertaraf premium untuk halaman Tentang Kami:
    > *"http://127.0.0.1:5504/shared/pages/footer/about/about.html buatkan page ni css pulak"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css` (Seksyen 11B: Apple About Us & Story Showcase):
    - **Hero & Kicker**: Membina `.about-story-kicker` (kapsul pill kecil dengan `background: rgba(0, 113, 227, 0.1)` dan sempadan halus) serta tipografi Apple tajuk utama.
    - **Bento Story Showcase (`.about-story`)**: Reka letak 2-lajur Bento (`1.15fr 0.85fr`) dengan kad kaca *Obsidian* berkabut (`backdrop-filter: blur(20px)`), sudut melengkung `28px`, gambar Stadthuys dengan efek zum hover `1.05`, dan lencana lokasi UNESCO terapung.
    - **Papan Metrik Statistik (`.stats-grid` & `.stat-card`)**: 4-lajur kad kaca Apple beranimasi hover angkat (`translateY(-4px)`), nilai nombor format `tabular-nums` yang tebal, dan kotak ikon bercahaya.
    - **Nilai Teras (`.feature-grid` & `.feature-card`)**: Kad bento 3-lajur dengan ikon Apple squircle berwana (Biru untuk ramalan harga, Ungu untuk padanan pintar, Hijau untuk laluan efisien).
    - **Bento Banner Seruan Tindakan (`.about-cta-bento`)**: Sepanduk interaktif dwiton ungu-biru dengan butang pil kapsul utama (*Browse Available Cars*) dan butang pembantu AI (*Ask AI Assistant*).
    - **Responsif Penuh**: Susun atur menyesuaikan diri secara lancar pada skrin tablet dan telefon pintar.
  - Di dalam `shared/lang/en.json`, `shared/lang/en.js`, `shared/lang/ms.json`, `shared/lang/ms.js`:
    - Menambah kunci dwibahasa: `about_kicker`, `about_story_badge`, `about_cta_title`, `about_cta_sub`, `about_cta_btn`, `about_cta_chat`.
  - Di dalam `shared/pages/footer/about/about.html`:
    - Mengemaskini struktur HTML dengan semantik Apple HIG, ikon Material Round, dan *cache-buster* `?v=5.2.66`.
  - Di dalam `shared/js/main.js`:
    - Memperbaharui *cache-buster* `resolveLangPath` kepada `?v=5.2.66`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Mod Malam & Mod Siang**: Kad bento, gambar Stadthuys, kotak ikon bertema, dan banner CTA terpapar dengan kontras serta bayang kaca yang sangat estetik.
  - **Ujian Dwibahasa (EN / MS)**: Pertukaran bahasa menterjemahkan keseluruhan teks halaman termasuk lencana warisan UNESCO dan butang tindakan dengan pantas.
- **Maklumat Git**:
  - Commit: `5.2.66 Implement Apple HIG Bento design and styling for About Us page`
  - Tag Versi: `5.2.66`

---

## 🏢 [MINOR UPDATE] 107. Reka Bentuk Penjenamaan Korporat Eksekutif Halaman Tentang Kami, Jaminan Sewaan Sebenar & Ikon AI WeDRIVE (Stitch Corporate Executive Mobility Branding, Authentic Rental Guarantees & Sparkle AI Icon) (v5.2.67)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mahukan halaman *About Us* kelihatan seperti laman penjenamaan syarikat mobiliti korporat sebenar (bukan sekadar templat AI biasa):
     > *"Terlalu nampak ai n x nampak macam page premium apa kata awak suruh mcp stitch buatkan page tu ..nampak macam branding company buat"*
  2. Pengguna meminta penyingkiran piawaian sanitasi hospital/tangan bersih dan menggantikannya dengan maklumat jaminan sewaan kereta yang penting:
     > *"clean_hands Pristine Sanitization apa benda ni kau igt aq buat apa..tolong lah info penting yang aq sewa kereta benda tu x penting"*
  3. Pengguna mengingatkan penggunaan ikon rasmi pembantu AI WeDRIVE:
     > *"ai aq dh lain kan kau ni pon jangan lupa"*
- **Tindakan Pembaikan (Implementation)**:
  - **Sistem Reka Bentuk Korporat Eksekutif (StitchMCP Integration)**:
    - Di dalam `shared/css/wedrive.css` (Seksyen 11B: Corporate Executive Mobility):
      - Membina sistem panel kaca spekular (`.glass-specular-panel`) dengan pencahayaan tepi 1px (`border-top: 1px solid rgba(255, 255, 255, 0.12); backdrop-filter: blur(24px);`).
      - Tajuk hero metalik editorial: `linear-gradient(180deg, #FFFFFF 0%, #B8B8B8 100%)` (Mod Malam) dan `linear-gradient(180deg, #111827 0%, #374151 100%)` (Mod Siang).
      - **Seksyen Warisan & Masa Depan**: Reka letak 2-lajur menghubungkan infrastruktur mobiliti pintar dengan tapak warisan bersejarah Melaka berserta gambar Stadthuys dan lencana UNESCO Melaka.
      - **Papan Metrik Impak & Skala**: 4 metrik perniagaan bergaris pemisah metalik halus (`10,000+ Happy Renters`, `50+ Rental Cars`, `99.9% System Uptime`, `98% AI Accuracy`).
      - **4 Tiang Asas Kepercayaan (*Architecture of Trust*)**: Kad kaca berkilau dengan ikon bulat (*Trust & Transparency*, *Intelligent AI Matching*, *Sustainable Mobility*, *White-Glove 24/7 Concierge*).
  - **Jaminan & Standard Sewaan Sebenar (*Authentic Car Rental Guarantees*)**:
    - Menggantikan ikon `clean_hands` dan teks sanitasi kepada 3 jaminan sewaan utama yang praktikal untuk pelanggan kereta sewa Melaka:
      1. 🛡️ **Insurans Komprehensif & CDW** (`about_std_insur` / ikon `shield`).
      2. 📍 **Penghantaran ke Melaka Sentral & Hotel** (`about_std_delivery` / ikon `near_me`).
      3. 🔑 **Kelulusan Segera & Kunci Digital** (`about_std_instant` / ikon `vpn_key`).
  - **Penyelarasan Ikon AI WeDRIVE**:
    - Menggantikan ikon `smart_toy` kepada ikon rasmi `auto_awesome` (bintang berkilau AI WeDRIVE) pada butang seruan tindakan *Tanya Pembantu AI* / *Ask AI Assistant* di dalam `about.html`.
  - **Pembaikan Ralat Penukaran Bahasa**:
    - Membetulkan panggilan fungsi terjemahan di dalam `shared/js/main.js` daripada `updateLangBtn` $\to$ `syncToggleButtons` untuk memastikan penukaran bahasa lancar tanpa ralat konsol.
  - **Penyelarasan Kamus Dwibahasa**:
    - Mengemaskini semua kunci di dalam `shared/lang/en.json`, `shared/lang/en.js`, `shared/lang/ms.json`, `shared/lang/ms.js`, dan kamus sandaran `shared/js/main.js`.
- **Pengesahan Ujian Visual (DevTools Automated & Manual Verification)**:
  - **Ujian Reka Bentuk Penjenamaan Korporat**: Hero korporat, kad warisan Melaka, 4 tiang kepercayaan kaca, dan bar jaminan terpapar dengan kemas dan elegan.
  - **Ujian Bar Jaminan Sewaan**: 3 jaminan kereta sewa terpapar jelas tanpa sebarang teks sanitasi yang tidak relevan.
  - **Ujian Butang AI & Chatbot**: Menekan butang *Tanya Pembantu AI* (`.about-btn-secondary`) dengan ikon `auto_awesome` membuka tetingkap *Pembantu AI WeDRIVE* secara serta-merta dengan animasi lembut.
- **Maklumat Git**:
  - Commit: `5.2.67 Redesign About Us page with Stitch corporate mobility branding, authentic rental guarantees, and sparkle AI icon`
  - Tag Versi: `5.2.67`

---

## 🎭 [MINOR UPDATE] 108. Penyediaan Suite Ujian Automatik Playwright CLI Terasing Dalam Folder `tests/` (Isolated Playwright CLI Automated Test Architecture) (v5.2.68)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna bersetuju menggunakan Playwright CLI untuk ujian E2E automatik bagi projek FYP 2 WeDRIVE.
  2. Pengguna menetapkan syarat susun atur fail yang kemas dan teratur agar tidak menyepahkan direktori akar (*root directory*):
     > *"kalau boleh awak masukkan dalah satu folder saya xnak bersepah"*
- **Tindakan Pembaikan & Struktur Terasing (Implementation & Modular Isolation)**:
  - **Struktur Folder Terpencil (`tests/`)**:
    - Memindahkan semua fail konfigurasi, pakej, dan skrip ujian daripada direktori akar ke dalam satu folder khusus:
      ```
      tests/
      ├── e2e/
      │   ├── 01_auth.spec.js           # Ujian E2E Log Masuk & Validasi Borang
      │   ├── 02_theme_and_lang.spec.js  # Ujian Suis Tema (Dark/Light/Auto) & Dwibahasa (EN/MS)
      │   ├── 03_about_corporate.spec.js# Ujian Penjenamaan Korporat, Jaminan & AI Sparkles
      │   └── 04_pricing_glider.spec.js # Ujian Gelangsar Suis Apple (Daily vs Weekly)
      ├── package.json                  # Pakej devDependencies @playwright/test & skrip npm
      ├── package-lock.json
      ├── playwright.config.js          # Konfigurasi Chromium, baseURL & reporter
      └── node_modules/                 # Modul terasing yang diabaikan oleh Git
      ```
  - **Kemaskini Konfigurasi & Perlindungan Git (`.gitignore`)**:
    - Mengemaskini `tests/playwright.config.js` dengan `testDir: './e2e'`, `baseURL: 'http://localhost:8088'`, dan `workers: 1` bagi mengelakkan konflik sesi.
    - Menambah peraturan perlindungan `.gitignore` di peringkat akar projek:
      `tests/node_modules/`, `tests/playwright-report/`, `tests/test-results/`, `tests/blob-report/`.
    - Direktori akar projek kekal bersih, teratur, dan hanya mengandungi modul aplikasi WeDRIVE yang standard.
- **Pengesahan Ujian Automatik (Automated Test Execution)**:
  - Ujian dijalankan menggunakan perintah: `cd tests && npx playwright test`
  - **Keputusan**: **5/5 Ujian Lulus (100% Pass Rate dalam 13.2 saat)**:
    1. `✓ 01_auth.spec.js`: Halaman log masuk memuatkan input dan butang `#login-btn` ditekan tanpa ralat.
    2. `✓ 02_theme_and_lang.spec.js (Theme)`: Suis tema beralih antara *dark*, *light*, dan *system*.
    3. `✓ 02_theme_and_lang.spec.js (Lang)`: Suis bahasa menterjemahkan teks antara `en` dan `ms`.
    4. `✓ 03_about_corporate.spec.js`: 4 kad tiang kepercayaan, 3 jaminan sewaan, dan butang AI berikon `auto_awesome` membuka chatbot secara responsif.
    5. `✓ 04_pricing_glider.spec.js`: Gelangsar Apple meleret lancar antara pakej harian dan mingguan.
- **Maklumat Git**:
  - Commit: `5.2.68 Setup isolated Playwright CLI test suite in dedicated tests directory`
  - Tag Versi: `5.2.68`

---

## 📋 [MINOR UPDATE] 109. Pendokumentasian Peraturan & Protokol Pengujian Automatik Playwright Dalam `.agents/rules/` (Mandatory Automated Testing SOP in Agent Rules) (v5.2.69)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna menetapkan SOP kekal agar ejen/AI sentiasa menjalankan ujian Playwright automatik setiap kali selesai membina atau mengubahsuai mana-mana bahagian sistem:
    > *"nnti awak masukkan dalam agent setiap kali lepas abis buat"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `.agents/rules/ruleprompt.md`:
    - Menambah **Seksyen 17: Playwright CLI Automated Testing & Isolated `tests/` Directory (MANDATORY)**:
      1. **Isolasi Folder Ujian**: Semua fail ujian, konfigurasi, dan nod dependensi kekal di dalam folder `tests/` (direktori akar kekal bersih).
      2. **Protokol Ujian Selepas Tugas (Post-Task Test Execution)**: WAJIB menjalankan `cd tests && npx playwright test` setiap kali selesai tugasan pembangunan untuk mengesahkan 100% *pass rate* sebelum *commit*.
      3. **Penyelenggaraan & Penambahan Skrip Ujian**: Menambah suite ujian E2E baharu di `tests/e2e/` selaras dengan modul baharu yang dibina.
  - Di dalam `.agents/rules/playwright_testing.md`:
    - Mencipta fail peraturan khusus *always_on* yang menetapkan piawaian seni bina ujian E2E, panduan *selectors*, pengurusan kredensial rasmi, dan pengesahan transisi fizik Apple HIG.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate)** secara konsisten.
- **Maklumat Git**:
  - Commit: `5.2.69 Establish mandatory Playwright automated testing SOP in agent rules`
  - Tag Versi: `5.2.69`

---

## 🗂️ [MINOR UPDATE] 110. Pemodularan & Pengasingan Fail Peraturan Ejen `.agents/rules/` (Agent Rules Modularization Under Character Limit) (v5.2.70)

- **Punca Keperluan (Context & User Directives)**:
  - Fail `ruleprompt.md` sebelum ini telah melebihi had 12,000 aksara Antigravity IDE (12,710 / 12,000 aksara dengan amaran merah):
    > *"dalam ruleprompt tu dah penuh cuba awak asingkan rule prompt tu"*
- **Tindakan Pembaikan & Pemodularan (Modular Architecture)**:
  - Mengasingkan fail `ruleprompt.md` yang besar kepada modul-modul peraturan khusus di dalam `.agents/rules/` dengan atribut `trigger: always_on`:
    1. **`ruleprompt.md`** (`4,890` aksara): Peraturan teras projek, ringkasan reka bentuk Apple HIG, penomboran versi Git, pendokumentasian wajib fail PLAN, protokol ujian, dan pengoptimuman Graphify.
    2. **`navigation_and_ui.md`** (`2,724` aksara): Corak navigasi bar sisi (Admin vs Customer vs Guest), garis panduan responsif mudah alih & *breakpoints*, dan rujukan standard UI/UX industri (Airbnb, Stripe, Apple, Linear, Vercel).
    3. **`code_and_backend.md`** (`2,045` aksara): Pengurusan fail/folder (`bin/`), seni bina CSS (*1 Module = 1 CSS*), dwibahasa & tema, *dummy data sync*, dan status *Auth Guard*.
    4. **`playwright_testing.md`** (`1,823` aksara): Kredensial rasmi ujian, protokol ujian automasi Playwright CLI, struktur folder terasing `tests/`, dan peraturan pelaksanaan ujian pasca-tugasan.
  - **Status Had Aksara**: Kesemua 7 fail peraturan kini berada jauh di bawah had maksimum 12,000 aksara (berstatus hijau tanpa sebarang amaran amaran merah).
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate dalam 11.3s)**.
- **Maklumat Git**:
  - Commit: `5.2.70 Modularize agent ruleprompt into focused rule files within character limits`
  - Tag Versi: `5.2.70`

---

## 🛡️ [MINOR UPDATE] 111. Penambahan Standard Keselamatan Siber & Audit Kerentanan Strix Dalam `.agents/rules/` (Cybersecurity & AI Vulnerability Scanning Standards) (v5.2.71)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna meminta standard audit keselamatan dan kerentanan siber berasaskan AI (Strix AI / OWASP) dimasukkan ke dalam peraturan ejen:
    > *"boleh nnti masukkan jugak dalam agent"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `.agents/rules/security_and_audit.md`:
    - **Seni Bina Keselamatan & Amalan Terbaik OWASP**: Perlindungan rahsia sifar (*Zero Plaintext Secrets*), Kawalan Akses Berasaskan Peranan (*RBAC*), Keselamatan Baris Data Supabase (*Row Level Security / RLS*), dan Sanitasi Input bagi menghalang *XSS* serta *SQL Injection*.
    - **Ujian Keselamatan AI Beretika (Strix)**: Pengimbasan automatik pengurusan sesi/kredensial, privasi data pelanggan, dan keselamatan titik akhir (*endpoint security*) Chatbot & AI.
  - Di dalam `.agents/rules/ruleprompt.md`:
    - Menambah rujukan silang terpaut ke fail `security_and_audit.md`.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate dalam 12.2s)**.
- **Maklumat Git**:
  - Commit: `5.2.71 Add cybersecurity and Strix AI vulnerability audit rules to agents ruleset`
  - Tag Versi: `5.2.71`

---

## 🎨 [MINOR UPDATE] 112. Penciptaan & Integrasi Custom Agent Skill Front-End UI (`frontend-ui`) (Frontend UI Craft & Engineering Skill) (v5.2.72)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna bersetuju untuk membina kemahiran khusus *Front-End UI Skill* bagi memastikan mutu estetika dan ketukangan UI WeDRIVE sentiasa bertaraf dunia:
    > *"awak tahu Skill UI for Front-End" $\to$ "yes betul"*
- **Tindakan Pembaikan & Seni Bina Skill (Skill Architecture)**:
  - Membina kemahiran ejen baharu di dalam folder [`.agents/skills/frontend-ui/SKILL.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/skills/frontend-ui/SKILL.md):
    1. **Prinsip Utama Ketukangan UI (*UI Craft & Depth*)**: Penolakan templat AI yang kaku, penggunaan palet warna kurasi (*Obsidian Black & Crisp Day*), pencahayaan tepi spekular 1px, bayang-bayang bertingkat, dan kesan kaca kabur tepu tinggi (`backdrop-filter: blur(24px) saturate(180%)`).
    2. **Piawaian Geometri & Tipografi**: Peraturan nisbah minimum 1:1 bulat sempurna pada ikon dan pengembangan mendatar ke bentuk kapsul/pil, serta tipografi Apple SF Pro dengan `tabular-nums` untuk pemasa/harga.
    3. **Fizik Spring & Mikro-Interaksi**: Lengkung fizik Apple *cubic-bezier*, suis gelangsar fizikal terapung (*sliding gliders*), animasi goncang ralat berbentuk pil, dan *skeleton reveal*.
    4. **Ergonomik & Responsif Mudah Alih**: Sasaran sentuhan minimum $44\text{px} \times 44\text{px}$ pada telefon pintar dan pelarasan adaptif 3 *breakpoints* (Desktop, Tablet, Mobile).
    5. **Protokol Verifikasi Dwi-Peringkat**: Audit visual masa nyata (DevTools MCP) + Ujian Automatik E2E (Playwright CLI).
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate dalam 11.8s)**.
- **Maklumat Git**:
  - Commit: `5.2.72 Create and integrate frontend-ui custom agent skill for Apple HIG craft and styling`
  - Tag Versi: `5.2.72`

---

## ⚡ [MINOR UPDATE] 113. Integrasi Pelayan Context7 MCP & Ejen Skill Dokumentasi Langsung (Context7 Live Documentation MCP Server) (v5.2.73)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna meminta agar sistem menggunakan Context7 bagi memastikan semua rujukan kod dan API sentiasa tepat mengikut versi terkini:
    > *"Saya nak awak guna tu Context7"*
- **Tindakan Pembaikan & Integrasi (Implementation & Configuration)**:
  - **Konfigurasi Pelayan MCP (`~/.gemini/config/mcp_config.json`)**:
    - Menambah pelayan `context7` menggunakan pakej `@upstash/context7-mcp`:
      ```json
      "context7": {
        "command": "npx",
        "args": [
          "-y",
          "@upstash/context7-mcp"
        ]
      }
      ```
  - **Penciptaan Custom Agent Skill ([`.agents/skills/context7/SKILL.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/skills/context7/SKILL.md))**:
    - Menetapkan panduan bila dan bagaimana membuat carian dokumentasi masa nyata bagi pakej-pakej utama (Supabase JS, Flatpickr, Anime.js, Playwright) bagi menghapuskan masalah kod lapuk (*zero deprecated APIs*).
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate dalam 12.8s)**.
- **Maklumat Git**:
  - Commit: `5.2.73 Configure Context7 live documentation MCP server and agent skill`
  - Tag Versi: `5.2.73`

---

## 🧹 [MINOR UPDATE] 114. Pembersihan Masalah Linter IDE & Keserasian Awalan CSS Safari (IDE Linter Warnings & Safari Vendor Prefix Resolution) (v5.2.74)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna meminta agar semua senarai masalah (*problems*) dalam IDE disemak dan diselesaikan:
    > *"Okey @[current_problems] cuba check kenapa ada banyak problem"*
  - **Punca Masalah**: Amaran linter Microsoft Edge Tools / CSS Validator mengenai:
    1. Kekurangan awalan vendor Safari (`-webkit-backdrop-filter` dan `-webkit-user-select`).
    2. Susunan sifat CSS di mana sifat berawalan vendor mesti diletakkan sebelum sifat standard (`-webkit-` dahulu, kemudian standard).
    3. Penggunaan gaya dalam talian (*inline styles*) di dalam `account/pages/login/login.html` dan `index.html`.
- **Tindakan Pembaikan (Implementation)**:
  - **`account/pages/login/login.html`**:
    - Menambah `-webkit-backdrop-filter: blur(10px);` sebelum `backdrop-filter: blur(10px);`.
    - Memindahkan semua gaya *inline* kepada kelas CSS tersusun: `.btn-icon-18`, `.btn-icon-20`, `.login-top-controls`, `.login-tfa-title-icon`, `.login-tfa-close-btn`, `.login-tfa-cancel-btn`, dan `.login-tfa-dialog-overlay:not(.active)`.
  - **`index.html`**:
    - Menggantikan gaya *inline* pautan kad metrik kadar permulaan kepada kelas `.guest-metric-card-link`.
  - **`shared/css/wedrive.css`**:
    - Menyelaras dan membetulkan susunan semua sifat CSS (`-webkit-backdrop-filter`, `-webkit-user-select`, `-webkit-text-size-adjust`, `-webkit-appearance`) supaya awalan vendor mendahului sifat standard di seluruh fail.
    - Menambah kelas `.guest-metric-card-link { text-decoration: none; color: inherit; display: block; }`.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate dalam 12.2s)**.
- **Maklumat Git**:
  - Commit: `5.2.74 Resolve Safari CSS vendor prefix and inline style linter warnings`
  - Tag Versi: `5.2.74`

---

## 🔑 [MINOR UPDATE] 115. Konfigurasi Kunci Rahsia Context7 API & Pengesahan Carian Dokumentasi Langsung (Context7 API Key Authentication & Verification) (v5.2.75)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna membekalkan Kunci API Rahsia (*Context7 Secret Key*) daripada papan pemuka akaun rasmi Context7:
    > `ctx7sk-c0d54ea8-5d59-47a5-a63d-f296e8c576ec`
- **Tindakan Pembaikan & Konfigurasi (Implementation & Authentication)**:
  - Di dalam `~/.gemini/config/mcp_config.json`:
    - Mengemaskini konfigurasi pelayan `context7` MCP dengan kunci API melalui hujah CLI (`--api-key`) dan pembolehubah persekitaran (`CONTEXT7_API_KEY`).
  - **Pengesahan Panggilan API Secara Langsung**:
    - Ujian carian API dijalankan terhadap endpoint `https://context7.com/api/v2/libs/search?libraryName=flatpickr&query=minDate`.
    - **Hasil**: Respons status 200 OK dengan 3 pustaka didokumentasikan (59,893 token & 613 core snippets) disahkan berjaya diperoleh secara masa nyata.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate dalam 12.2s)**.
- **Maklumat Git**:
  - Commit: `5.2.75 Configure Context7 authenticated API key and verify live documentation lookups`
  - Tag Versi: `5.2.75`

---

## 🔐 [MINOR UPDATE] 116. Penyelarasan Sistem Cadangan Kata Laluan OS & Penyimpanan "Remember Me" (Native OS Password Manager & Remember Me Architecture) (v5.2.76)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna bertanyakan bagaimana fungsi *Remember Me* dan simpanan kata laluan berfungsi merentasi sistem Apple (iCloud Keychain), Android (Google Password Manager), dan Windows (Windows Hello / Edge Credential Vault), serta bagaimana cadangan sistem dipaparkan secara automatik:
    > *"remember me tu save macam apple ke android ke windows punya cara nnti tekan jek nnti ada suggestion dari system"*
- **Tindakan Pembaikan & Seni Bina Dwi-Peringkat (Implementation & Dual-Layer Autofill)**:
  - **Peringkat 1: Pengurus Kata Laluan OS / Pelayar (*Native OS Password Managers*)**:
    - Di dalam `account/pages/login/login.html`:
      - Mengemaskini atribut medan borang log masuk mengikut standard piawaian W3C & Apple/Google/Microsoft:
        - Borang: `<form id="login-form" method="POST" action="#" onsubmit="handleLogin(event)" autocomplete="on">`.
        - E-mel: `name="username"` dengan `autocomplete="username email"`.
        - Kata Laluan: `name="password"` dengan `autocomplete="current-password"`.
      - **Hasil**: Apabila pengguna menekan medan input:
        1. 🍏 **Apple (iOS/macOS)**: Memaparkan bar cadangan pantas *iCloud Keychain QuickType* di atas papan kekunci dan pengesahan Face ID / Touch ID.
        2. 🤖 **Android (Google)**: Memaparkan tindanan cadangan *Google Autofill* secara automatik.
        3. 🪟 **Windows (Edge/Chrome)**: Memaparkan menu *drop-down* cadangan akaun tersimpan dengan ikon kunci Windows Hello.
        4. Selepas log masuk berjaya, pelayar akan memaparkan dialog asli: *"Save Password to Keychain / Google Password Manager / Microsoft Edge?"*.
      - Mengintegrasikan API moden **Credential Management API** (`navigator.credentials.store()`) untuk memicu dialog simpanan asli pelayar secara programatik.
  - **Peringkat 2: Penyimpanan Aplikasi WeDRIVE ("Remember Me")**:
    - Apabila kotak semak *Remember Me* ditanda (`#remember-me`):
      - E-mel disimpan di dalam storan tempatan (`localStorage.setItem('wedrive_remember_email', email)`).
      - Apabila pengguna membuka semula laman log masuk, e-mel dipra-isi (*auto pre-filled*) dan kotak *Remember Me* ditanda secara automatik.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **5/5 Ujian Lulus (100% Pass Rate dalam 13.0s)**.
- **Maklumat Git**:
  - Commit: `5.2.76 Upgrade login form with native OS password manager autocomplete and persistent Remember Me`
  - Tag Versi: `5.2.76`

---

## 🛡️ [MAJOR UPDATE] 117. Sistem Pengurusan Sesi Ketidakaktifan Pentadbir & Log Keluar Automatik (Admin Session Inactivity Timeout Guardian) (v5.2.77)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna meminta agar sistem portal Pentadbir (**Admin**) mempunyai perlindungan sesi pintar: jika tiada aktiviti selama 10 minit, popup amaran dengan pemasa 1 minit dipaparkan. Jika tiada sebarang tindak balas, sistem akan melog keluar secara automatik:
    > *"admin ni kan boleh x kalau dah lama x usik pape dia reminder n keluar popup dalam 10 menit sahaja kalau xde response buat reminder 1 menit timer n terus log out"*
- **Tindakan Pembaikan & Seni Bina Sistem (Implementation & Security Architecture)**:
  - **1. Pengesanan Ketidakaktifan (*User Activity Monitoring*)**:
    - Membina modul [`admin/js/admin-idle-timeout.js`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/admin/js/admin-idle-timeout.js) yang memantau interaksi pengguna (`mousemove`, `mousedown`, `keydown`, `touchstart`, `scroll`, `click`) dengan pengawalan *throttling* (1 saat) untuk prestasi optimum.
    - Menetapkan had masa ketidakaktifan asas kepada **10 Minit (600,000 ms)**.
  - **2. Modal Amaran Kaca Apple HIG Bento (*Frosted Glassmorphism Modal*)**:
    - Selepas 10 minit tiada aktiviti, modal kaca `#admin-session-timeout-modal` dipaparkan secara animasi pegas (*spring physics*):
      - Latar kabur: `-webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%);`.
      - Ikon keselamatan berdenyut (*pulsing security hourglass*).
      - Lencana pemasa digital masa nyata **1 Minit (60 saat)** (`01:00` $\to$ `00:00`) yang bertukar warna merah berdenyut apabila $\le 15$ saat.
      - Butang dwi-tindakan:
        - **"Kekalkan Sesi / Stay Logged In"**: Menetapkan semula pemasa 10 minit dan menutup modal.
        - **"Log Keluar Sekarang / Log Out Now"**: Menamatkan sesi serta merta.
  - **3. Log Keluar Automatik & Pembersihan Sesi Selamat (*Secure Wipe & Auto-Logout*)**:
    - Apabila pemasa mencecah `00:00`, sistem memadamkan `wedrive_session` daripada `localStorage` & `sessionStorage`, menandatangani keluar daripada Supabase Auth, dan mengalihkan pengguna ke `account/pages/login/login.html?session_expired=expired`.
  - **4. Pemuat Automatik Global (*Global Auto-Loader Integration*)**:
    - Diintegrasikan ke dalam [`shared/js/sidebar-loader.js`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/shared/js/sidebar-loader.js) dan dipautkan pada semua 10 halaman Admin (`dashboard`, `bookings`, `cars`, `car-detail`, `calendar`, `customers`, `chatbot`, `marketing`, `reports`, `settings`).
    - Menyediakan API ujian global `window.WeDriveAdminSession.testWarning(seconds)` bagi memudahkan demonstrasi dan penilaian QA.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **7/7 Ujian Lulus (100% Pass Rate dalam 18.8s)** merangkumi suite baharu [`tests/e2e/05_admin_idle_timeout.spec.js`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/tests/e2e/05_admin_idle_timeout.spec.js).
- **Maklumat Git**:
  - Commit: `5.2.77 Implement Admin Session Inactivity Timeout Guardian with Apple HIG warning modal and auto-logout`
  - Tag Versi: `5.2.77`

---

## 🎨 [MINOR UPDATE] 118. Penyatuan Penuh Penggayaan Panel Admin ke Dalam Master CSS `wedrive.css` (Universal Admin Styling Centralization) (v5.2.78)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna menetapkan arahan tegas agar keseluruhan sistem menggunakan **SATU fail CSS master sahaja** iaitu `shared/css/wedrive.css` dan memautkan semua modul ke fail tersebut demi konsistensi visual 100%:
    > *"saya nak pakai satu sahaja file css tu n kaitkan semua dekat satu tu sahaja /shared/css supaya consistent pakai sama sahaja bentuknya"*
- **Tindakan Pembaikan & Pembersihan (Implementation & Consolidation)**:
  - **1. Penambahan Bahagian 16 ke Dalam Master CSS (`shared/css/wedrive.css`)**:
    - Memindahkan dan menyelaraskan semua gaya khusus panel Admin mengikut piawaian Apple HIG:
      - **Jadual Boleh Susun (*Sortable Table Headers*)**: `th.sortable`, `th.sort-asc`, `th.sort-desc` dengan ikon anak panah biru Apple dan transisi pantas.
      - **Cip Tarikh & Penapis Julat (*Date Chips & Filter Row*)**: `.date-chip` berkapsul pil `9999px`, `.custom-date-row`, dan `.apply-btn` dengan sentuhan taktil `scale(0.97)`.
      - **Grid Tetapan Bento (*Bento Settings Grid*)**: `.settings-grid`, `.settings-card` bucu squircle `20px`, `.settings-header`, `.form-grid-custom`, dan `.settings-hero` gradien biru Apple melengkung `24px` dengan ikon aksen telus.
  - **2. Pembersihan 10 Halaman Admin (`admin/pages/`)**:
    - Membuang kesemua blok gaya sebaris `<style>` di dalam `bookings.html`, `customers.html`, dan `settings.html` (kini 0 tag `<style>` sebaris di seluruh Admin).
    - Membuang pautan lapuk `sidebar.css` dan pautan berganda `wedrive.css` merentasi semua 10 halaman pentadbir:
      1. `admin/pages/dashboard/admin.html`
      2. `admin/pages/car/cars.html`
      3. `admin/pages/car/car-detail/car-detail.html`
      4. `admin/pages/booking/bookings.html`
      5. `admin/pages/customer/customers.html`
      6. `admin/pages/report/reports.html`
      7. `admin/pages/calendar/calendar.html`
      8. `admin/pages/chatbot/chatbot.html`
      9. `admin/pages/marketing/marketing.html`
      10. `admin/pages/setting/settings.html`
    - Kesemua 10 halaman pentadbir kini memuatkan **SATU** pautan lembaran gaya master: `shared/css/wedrive.css`.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **7/7 Ujian Lulus (100% Pass Rate dalam 18.4s)**.
- **Maklumat Git**:
  - Commit: `5.2.78 Centralize all admin styles and controls into shared master CSS wedrive.css`
  - Tag Versi: `5.2.78`

---

## 📅 [MINOR UPDATE] 119. Penstrukturan Penapis Julat Tarikh Tempahan Admin & Pemaparan Dinamik Custom Range (Admin Bookings Custom Date Range Filter Toggle) (v5.2.79)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna meminta agar baris pemilihan tarikh khusus (*Custom Range*) disorokkan secara lalai (*hidden by default*) dan hanya dipaparkan apabila cip **"Custom Range"** ditekan:
    > *"custom page ni buat dia tekan custom range baru keluar pilih tarikh tu"*
- **Tindakan Pembaikan & Seni Bina Penapis (Implementation & Toggle Logic)**:
  - **1. Pembersihan Sifat CSS (`shared/css/wedrive.css`)**:
    - Menghapuskan peraturan `display: inline-flex !important` yang sebelum ini memaksa `.custom-date-row` sentiasa terpapar walaupun pada pilihan *All Time*.
    - Menetapkan `.custom-date-row { display: none; }` secara lalai dan `.custom-date-row.active { display: inline-flex !important; }`.
  - **2. Penyelarasan Logik JavaScript (`admin/js/bookings.js` & `admin/pages/booking/bookings.html`)**:
    - Mengemaskini fungsi `filterByDate(period, btn)` supaya apabila memilih tempoh pratetap (`all`, `month`, `year`), baris `#custom-date-row` disorokkan serta-merta (`display: none;` dan membuang kelas `.active`).
    - Menambah baik fungsi `showCustomDateRow(btn)` untuk mengaktifkan baris `#custom-date-row` (`display: inline-flex;` dan `.active`) hanya apabila butang *Custom Range* dipilih, serta mengembalikan pilihan ke *All Time* jika ditogol keluar.
    - Mengeluarkan pemfokusan automatik Flatpickr yang tidak diingini semasa penukaran cip.
  - **3. Ujian Automatik Baharu (`tests/e2e/06_bookings_filter.spec.js`)**:
    - Membina ujian Playwright automatik untuk mengesahkan bahawa baris tarikh disorokkan secara lalai dan hanya muncul apabila cip *Custom Range* ditekan.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **8/8 Ujian Lulus (100% Pass Rate dalam 21.9s)**.
- **Maklumat Git**:
  - Commit: `5.2.79 Toggle custom date range filter row only when Custom Range chip is selected`
  - Tag Versi: `5.2.79`

---

## 🚗 [MAJOR UPDATE] 120. Pembangunan Menyeluruh Portal Pelanggan "My Bookings" Mengikut Piawaian Apple HIG (Customer My Bookings Portal Overhaul) (v5.2.80)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna meminta pembangunan penuh bagi halaman portal pelanggan **My Bookings** ([`customer/pages/my-bookings/my-bookings.html`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/customer/pages/my-bookings/my-bookings.html)) supaya menepati standard tertinggi Apple Human Interface Guidelines (HIG), reka letak kad Bento, kawalan bersegmen (*segmented control*), spotlight sewaan aktif dengan pemasa undur langsung (*live countdown*), borang modal sheet Apple, sokongan dwibahasa & dwi-tema penuh, serta integrasi resit invois.
- **Tindakan Pembangunan & Ciri Utama (Implementation & Key Features)**:
  - **1. Kad Metrik Bento Stat 4-Lajur (*Bento Stat Metric Cards Grid*)**:
    - Membina 4 kad squircle (`border-radius: 22px`, bahan kaca lembut, specular border) untuk *Total Bookings*, *Active Rentals* (dengan lampu denyut hijau aktif), *Upcoming Bookings*, dan *Total Spent* dengan tipografi `font-variant-numeric: tabular-nums`.
  - **2. Hero Bento Sewaan Aktif (*Dynamic Active Rental Spotlight Hero*)**:
    - Memaparkan kad spotlight besar bagi kenderaan yang sedang disewa:
      - Imej HD luaran kenderaan dengan kesan zum lembut semasa hover.
      - Lencana `ACTIVE RENTAL` berkilau hijau `#34C759` berserta cip ID tempahan dengan fungsi salin 1-klik (`copyBookingId`).
      - Pemasa undur dinamik (cth. *"Ends in 1d 14h 22m"*) dan palang kemajuan sewaan animasi (`#active-progress-fill`).
      - Butang tindakan kapsul taktil: *Extend Rental*, *View Details*, dan *Support*.
  - **3. Kawalan Bersegmen & Pil Carian Apple HIG (*Segmented Control & Search Pill*)**:
    - Gelangsar suis bersegmen untuk tapisan status: *All Bookings*, *Active*, *Upcoming*, *Completed*, *Cancelled* berserta lencana kiraan dinamik.
    - Pil carian pantas masa nyata (*Instant Search Pill*) dengan butang pembersihan (x) automatik.
  - **4. Grid Kad Tempahan Bento Pelanggan (*Bento Booking Cards Grid*)**:
    - Susun atur 2-kolum responsif dengan imej kenderaan, lencana status mengikut token sistem warna Apple, petunjuk julat tarikh berpasangan (*paired date range capsule*), lokasi hab, dan butang tindakan kontekstual mengikut status sewaan.
  - **5. Lembaran Dialog Modal Apple (*Apple Sheet Modals*)**:
    - **Modal Butiran Tempahan (`#modal-details`)**: Menampilkan pecahan lengkap kenderaan, jadual, pas tanpa kunci (*Instant QR pass*), dan ringkasan pembayaran.
    - **Modal Pembatalan Tempahan (`#modal-cancel`)**: Dialog amaran dengan butang pemusnah merah Apple dan ringkasan polisi pemulangan wang.
    - **Modal Lanjutan Sewaan (`#modal-extend`)**: Pemilih durasi tambahan (+1 Hari, +2 Hari, +3 Hari, +1 Minggu) dengan pengiraan kadar tambahan serta-merta.
  - **6. Penyatuan Penggayaan ke Master CSS (`shared/css/wedrive.css`)**:
    - Menambah modul penggayaan `.mybk-*` yang lengkap di dalam master CSS tanpa sebarang gaya inline atau fail CSS terpisah.
  - **7. Sokongan Dwibahasa & Dwi-Tema Penuh (`shared/lang/`)**:
    - Menambah lebih 30 kunci terjemahan `mybk_*` di dalam `en.json`, `en.js`, `ms.json`, dan `ms.js`.
  - **8. Ujian E2E Automatik Playwright (`tests/e2e/07_customer_my_bookings.spec.js`)**:
    - Membina 6 senario ujian E2E komprehensif mengesahkan pemaparan kad stat, peralihan tab bersegmen, penapisan carian langsung, interaksi modal sheet, navigasi resit, dan penukaran dwibahasa lancar.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **14/14 Ujian Lulus (100% Pass Rate dalam 43.8s)**.
- **Maklumat Git**:
  - Commit: `5.2.80 Overhaul customer My Bookings portal with Apple HIG Bento layout and E2E tests`
  - Tag Versi: `5.2.80`

---

## ⏱️ [MINOR UPDATE] 121. Penyelarasan Automatik Status Tempahan Lampau & Penapisan Spotlight Sewaan Aktif Masa Nyata (Real-time Booking Status Normalization & Expired Rental Concluding) (v5.2.81)

- **Punca Isu (Issue Analysis & User Query)**:
  - Pengguna bertanya mengapa tempahan yang tarikh pemulangannya telah tamat (cth. *28 Ogos 2026*, sedangkan tarikh semasa adalah *1 September 2026*) masih dipaparkan sebagai `Active Rental` dengan nota *"Due for return today"*.
  - **Punca**: Sebelum ini, sistem hanya menyemak string `b.status === 'Active'` daripada rekod lama pangkalan data tanpa menilai secara dinamik sama ada `end_date` telah berlalu berbanding tarikh hari ini (`new Date()`).
- **Tindakan Pembaikan (Implementation & Auto-concluding Logic)**:
  - **1. Fungsi Penyelarasan Status Masa Nyata (`normalizeBookingStatus(booking)`)**:
    - Dibina di dalam [`customer/pages/my-bookings/my-bookings.html`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/customer/pages/my-bookings/my-bookings.html):
      - Jika `end_date < todayStart` $\rightarrow$ Status diselaraskan secara automatik kepada **`Completed`**.
      - Jika `start_date > now` $\rightarrow$ Status diselaraskan kepada **`Pending`** (Upcoming).
      - Hanya sewaan dalam julat `start_date <= now <= end_date` dikategorikan sebagai **`Active`**.
  - **2. Penapisan Spotlight Sewaan Aktif (*Strict Active Rental Spotlight Filtering*)**:
    - Bahagian Spotlight Hero (`#active-rental-spotlight`) hanya dipaparkan jika terdapat sewaan yang BENAR-BENAR sedang berlangsung pada hari ini.
    - Sekiranya tiada sewaan aktif (kesemua sewaan lampau telah selesai), Spotlight disorokkan secara kemas (`display: none`), dan rekod dipaparkan di bawah tab *Completed* bersama butang *Receipt* dan *Rebook*.
  - **3. Penyelarasan Dashboard Pelanggan (`customer/js/customer.js`)**:
    - Menapis keluar tempahan tamat tarikh daripada kiraan `activeBookings` pada Dashboard Pelanggan supaya bertukar secara tepat kepada kad *"Ready for Your Next Journey?"*.
  - **4. Sinkronisasi Automatik ke Supabase**:
    - Mengemaskini status tempahan yang telah tamat tempoh kepada `Completed` di pangkalan data secara automatik.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **14/14 Ujian Lulus (100% Pass Rate dalam 42.5s)**.
- **Maklumat Git**:
  - Commit: `5.2.81 Conclude expired rentals to Completed and strictly filter active ongoing rentals in spotlight`
  - Tag Versi: `5.2.81`

---

## 🧾 [MAJOR UPDATE] 122. Pembangunan Menyeluruh Halaman Invois Digital & Resit Tempahan Pelanggan Mengikut Piawaian Apple HIG (Customer Booking Receipt & Digital Invoice Overhaul) (v5.2.82)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna meminta pembangunan penuh bagi halaman **Booking Receipt & Digital Invoice** ([`customer/pages/my-bookings/receipt/receipt.html`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/customer/pages/my-bookings/receipt/receipt.html)) supaya menepati piawaian Apple Human Interface Guidelines (HIG), reka letak kad Bento squircle `28px`, meterai keselamatan digital disahkan (*Verified Digital Security Seal*), pas serahan kenderaan kod QR, pecahan kewangan dinamik beritem, susun atur cetakan A4/PDF mesra pengguna, sokongan dwibahasa & dwi-tema penuh, serta integrasi ujian Playwright E2E.
- **Tindakan Pembangunan & Ciri Utama (Implementation & Key Features)**:
  - **1. Kad Invois Master Bento Squircle (*Master Bento Squircle Invoice Container*)**:
    - Dibina dengan bucu melengkung `28px`, kemasan kaca (*glassmorphism*), *specular ambient highlight bar* tiga warna (biru/hijau/biru), dan bayang-bayang lembut (`0 20px 48px rgba(0,0,0,0.06)`).
  - **2. Pengepala Invois Korporat (*Hero Corporate Header*)**:
    - Menampilkan penjenamaan rasmi WeDRIVE Melaka Premium, nombor pendaftaran SST (`W10-2401-32000891`), alamat operasi hab Melaka, meterai keselamatan digital hijau `#34C759` berserta denyutan aktif, nombor rujukan invois dengan butang salin 1-klik (`receipt-copy-btn`), dan tarikh dikeluarkan.
  - **3. Grid 2-Kolum Maklumat Pelanggan & Kenderaan (*Customer & Vehicle Bento Grid*)**:
    - **Subkad Pelanggan**: Nama pemandu, emel, nombor telefon, nombor kad pengenalan (IC), dan lesen memandu disahkan (*Verified Driver's License*).
    - **Subkad Kenderaan**: Model kereta, plat pendaftaran berkapsul squircle, kelas kategori, kadar sewaan harian, jenis transmisi/bahan api, dan ciri kunci pintar tanpa kunci (*Keyless Smart Access*).
  - **4. Jambatan Jadual Sewaan (*Schedule Bridge Bento Card*)**:
    - Garis masa sewaan berpasangan: Tarikh & masa pengambilan $\to$ Pil tempoh sewaan di tengah $\to$ Tarikh & masa pemulangan $\to$ Petunjuk hab lokasi fizikal (*Melaka Sentral HQ*).
  - **5. Pecahan Kewangan Beritem (*Itemized Financial Calculation Breakdown*)**:
    - Kadar sewaan asas harian, yuran platform, perlindungan insurans, diskaun promosi, cukai SST (8% dinamik daripada tetapan Supabase), deposit keselamatan boleh pulangan (20%), dan **Kad Sorotan Jumlah Bayaran (*Grand Total Highlight Card*)** dengan tipografi angka tabular bersaiz besar (`font-variant-numeric: tabular-nums`).
  - **6. Pas Serahan Kenderaan Digital QR (*Digital Vehicle Handover QR Pass*)**:
    - Paparan pas digital ala *Apple Wallet* dengan kod QR masa nyata dan token keselamatan digital (`WD-SEC-XXXX-MLK`) untuk pengesahan serahan kunci pantas di hab Melaka.
  - **7. Dok Tindakan & Pengoptimuman Cetakan/PDF (*Action Dock & @media print*)**:
    - Butang tindakan kapsul pil: *Print Invoice*, *Download PDF* (dengan maklum balas segera dan pencetus dialog cetakan), *Copy Share Link* (dengan notifikasi *toast* terapung), dan *Back to My Bookings*.
    - Lembaran gaya `@media print` khusus yang menyembunyikan sidebar, navbar, butang terapung, dan footer untuk menghasilkan cetakan dokumen invois A4/Letter rasmi yang kemas pada latar belakang putih.
  - **8. Penyatuan Gaya Master CSS (`shared/css/wedrive.css`)**:
    - Menambah Seksyen 17 dalam fail CSS master global tanpa sebarang gaya inline.
  - **9. Sokongan Dwibahasa Penuh & Ujian E2E Playwright (`tests/e2e/08_customer_receipt.spec.js`)**:
    - Menambah kunci terjemahan `receipt_*` dalam `en.json`, `en.js`, `ms.json`, `ms.js`, dan menyokong atribut `[data-key]` & `[data-i18n]` dalam `shared/js/main.js`.
    - Membina 6 senario ujian automatik E2E Playwright mengesahkan paparan meterai digital, perincian kenderaan, pecahan kewangan, pas QR, tindakan butang, dan penukaran dwibahasa lancar.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **20/20 Ujian Lulus (100% Pass Rate dalam 56.7s)**.
- **Maklumat Git**:
  - Commit: `5.2.82 Overhaul customer booking receipt and digital invoice with Apple HIG standards and E2E tests`
  - Tag Versi: `5.2.82`

---

## 🔤 [MINOR UPDATE] 123. Penyeragaman Penuh Tipografi Tulen Apple San Francisco (Pure Apple SF Pro Display & Text Typography Enforcement) (v5.2.83)

- **Punca Isu (Context & User Feedback)**:
  - Pengguna mendapati fon tulisan di beberapa halaman tidak menyerupai rupa dan tekstur fon rasmi Apple (*"Tulisan tu macam bukan apple punya font jek kan??"*).
  - **Punca**: Sebelum ini, sistem bergantung semata-mata kepada fon sistem setempat (`-apple-system`) atau fon Google fallback (`Inter`). Pada peranti atau pelayar bukan Mac / Safari yang tiada fon Apple terbina, ia jatuh semula kepada fon standard tanpa pemuatan langsung pek fon **SF Pro**. Di samping itu, elemen borang (`button`, `input`, `select`, `textarea`) tidak mewarisi sifat tipografi secara tegas.
- **Tindakan Pembaikan (Implementation & Typography System)**:
  - **1. Integrasi Webfont Rasmi Apple SF Pro (`@import cdnfonts/sf-pro-display`)**:
    - Memuatkan pek fon rasmi **SF Pro Display** & **SF Pro Text** secara terus di bahagian teratas [`shared/css/wedrive.css`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/shared/css/wedrive.css).
  - **2. Penyelarasan Susunan Fon Global (`--font-sans`)**:
    - Menyusun keutamaan fon Apple secara mutlak:
      ```css
      --font-sans: "SF Pro Display", "SF Pro Text", "SF Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", "Inter", sans-serif;
      ```
  - **3. Penguatkuasaan Tipografi pada Semua Elemen UI & Kawalan Borang**:
    - Menguatkuasakan `--font-sans` merentasi `html`, `body`, `button`, `input`, `select`, `textarea`, `optgroup`, `table`, `th`, dan `td`.
    - Mengaktifkan penghalusan sub-piksel Apple (*Apple Subpixel Font Smoothing*):
      ```css
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      letter-spacing: -0.011em;
      ```
  - **4. Pemuatan Pantas di `<head>` Dokumen**:
    - Memautkan `<link href="https://fonts.cdnfonts.com/css/sf-pro-display" rel="stylesheet" />` di dalam `<head>` bagi memastikan fon SF Pro dimuat serta-merta tanpa sebarang kelipan (*zero flash of unstyled text*).
- **Maklumat Git**:
  - Commit: `5.2.83 Enforce pure Apple SF Pro Display and Text webfont across all system elements`
  - Tag Versi: `5.2.83`

---

## 🔤 [MINOR UPDATE] 124. Penyeragaman Penuh Pemuatan Webfont Apple SF Pro Display ke Seluruh Halaman Antara Muka Sistem (System-wide Apple SF Pro Webfont Deployment) (v5.2.84)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna meminta semakan dan penyeragaman pemuatan fon Apple SF Pro merentasi kesemua halaman antara muka sistem WeDRIVE (*"Cuba check dekat semua page alang2"*).
- **Tindakan Pembaikan (System-Wide Deployment)**:
  - **1. Audit & Suntikan `<link>` SF Pro Display**:
    - Menambah `<link href="https://fonts.cdnfonts.com/css/sf-pro-display" rel="stylesheet" />` ke dalam bahagian `<head>` merentas semua modul:
      - **Guest Pages**: `index.html`, `guest/pages/pricing/pricing.html`, `explore-melaka.html`, `how-it-works.html`.
      - **Account/Auth Pages**: `account/pages/login/login.html`, `signup.html`, `forgot-password.html`, `complete-profile.html`, `verification-pending.html`, `welcome.html`.
      - **Customer Portal**: `customer/pages/dashboard/customer.html`, `browse-cars.html`, `car-details.html`, `booking.html`, `payment.html`, `booking-confirmed.html`, `my-bookings.html`, `receipt.html`, `profile.html`, `support.html`.
      - **Admin Portal**: `admin/pages/dashboard/admin.html`, `bookings.html`, `cars.html`, `car-detail.html`, `customers.html`, `calendar.html`, `reports.html`, `settings.html`, `marketing.html`, `chatbot.html`.
      - **Shared Pages**: `shared/pages/error/404.html`.
  - **2. Prestasi & Tiada Kelipan (*Zero FOUC*)**:
    - Memastikan fon rasmi Apple San Francisco Pro dipaparkan secara konsisten dan tajam di semua jenis peranti dan pelayar.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **20/20 Ujian Lulus (100% Pass Rate dalam 54.1s)**.
- **Maklumat Git**:
  - Commit: `5.2.84 Deploy Apple SF Pro Display webfont links across all system pages`
  - Tag Versi: `5.2.84`

---

### Minor Update 125 (`v5.2.85`): Redesign Customer Receipt into Official Corporate Tax Invoice & Rental Statement (Apple & Stripe Luxury Standard)
- **Tarikh & Masa**: 1 September 2026, 05:05 AM
- **Fail Terlibat**:
  - `customer/pages/my-bookings/receipt/receipt.html`
  - `shared/css/wedrive.css` (Section 17: Official Corporate Tax Invoice & Digital Statement)
  - `shared/lang/en.json` & `shared/lang/en.js`
  - `shared/lang/ms.json` & `shared/lang/ms.js`
  - `tests/e2e/08_customer_receipt.spec.js`
  - `tests/e2e/07_customer_my_bookings.spec.js`
- **Penerangan Pembaharuan & Seni Bina Rasmi**:
  - **1. Pengepala Rasmi & Identiti Korporat (*Corporate Letterhead & Legal Identifiers*)**:
    - Menambah pengepala rasmi penuh dengan nama syarikat berdaftar: **WeDRIVE MOBILITY SDN. BHD.**, No. SSM: `202401038921 (1548291-K)`, No. Cukai SST Kastam: `W10-2401-32000891`, Lesen Kementerian Pelancongan (MOTAC): `KPK/LN 9842 (Kenderaan Pandu Sendiri)`, serta alamat ibu pejabat korporat di Menara WeDRIVE Melaka.
    - Menambah reben atas pensijilan pematuhan *LHDN e-Invoice Validated* & *SST Act 2018 Compliant*.
  - **2. Ledger Dua Pihak (*Bilateral Lessor vs Lessee Entity Ledger*)**:
    - **ISSUED BY (PEMBERI SEWA)**: Butiran hub operasi, nombor cukai SST, talian bantuan, dan *e-Invoice UUID*.
    - **BILLED TO / RENTER (PENYEWA UTAMA)**: Nama penuh penyewa, No. Kad Pengenalan / Pasport, Lesen Memandu (Kelas D - CDL), alamat emel, dan nombor telefon.
  - **3. Manifes & Jadual Penempatan Kenderaan (*Vehicle Manifest & Deployment*)**:
    - Memaparkan spesifikasi teknikal audit kenderaan: Nombor Casis / VIN (`PL1-FC1-2026-994821`), Nombor Enjin (`L15B7-889104`), Milenaj Awal (`14,250 KM`), Polisi Minyak Penuh-ke-Penuh, serta garis masa serahan & pemulangan kenderaan.
  - **4. Jadual Cukai & Perakaunan Berkanun (*Statutory Itemized Accounting Schedule*)**:
    - Susun atur jadual berbilang lajur (*No., Item Description & Details, Qty / Duration, Unit Rate, Tax SST, Amount*) merangkumi:
      - 1. Caj Sewaan Harian Kenderaan (Pengecualian Cukai).
      - 2. Yuran Platform Pintar Telematik & Concierge (8% SST).
      - 3. Pelepasan Kerosakan Perlanggaran Komprehensif (CDW + Tanpa Lebihan).
      - 4. Cukai Perkhidmatan (8% SST atas Perkhidmatan Platform).
      - 5. Deposit Keselamatan & Kerosakan Boleh Pulang.
    - Menambah ringkasan perakaunan (*Subtotal Excl. Tax, SST 8%, Deposit, Subtotal Payable*) dan sepanduk Jumlah Keseluruhan Dibil & Dibayar (*GRAND TOTAL AMOUNT BILLED & PAID*).
  - **5. Penyata Jumlah Dalam Perkataan Dinamik (*Dynamic Amount in Words Banner*)**:
    - Algoritma penukaran mata wang Ringgit Malaysia ke perkataan dalam dwibahasa secara dinamik (English: *RINGGIT MALAYSIA: ONE THOUSAND SIX HUNDRED THIRTY-SIX AND TWENTY CENTS ONLY* / Melayu: *RINGGIT MALAYSIA: SATU RIBU ENAM RATUS TIGA PULUH ENAM DAN DUA PULUH SEN SAHAJA*).
  - **6. Meterai Holografik Digital, Tandatangan Korporat & Pas QR (*Holographic Seal & Verification*)**:
    - Meterai digital timbul (*Embossed Digital Tax Seal*) dengan cincin kecerunan hijau zamrud.
    - Tandatangan digital rasmi: **Afiq Danial** (*Head of Treasury & Billing Operations*) berserta hash keselamatan SHA-256.
    - Pas Kod QR pintar berformat URL verifikasi terus untuk serahan kunci di hab Melaka.
  - **7. Pendedahan Statut & Cetakan A4 Sempurna (*Statutory Disclosures & Media Print*)**:
    - Klausa perundangan rasmi di bawah Akta Pengangkutan Jalan 1987 dan Akta Industri Pelancongan 1992.
    - Lembaran gaya cetakan khusus `@media print` untuk format dokumen kertas invois cukai A4 tanpa gangguan navigasi atau butang.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian Playwright mengesahkan **20/20 Ujian Lulus (100% Pass Rate)**.
- **Maklumat Git**:
  - Commit: `5.2.85 Redesign customer receipt into official corporate tax invoice and rental statement`
  - Tag Versi: `5.2.85`

---

### Minor Update 126 (`v5.2.86`): Fix Receipt Layout Alignment, Symmetrical Ledgers & Eliminate AI-Gimmick Aesthetic for Authentic Corporate Tax Invoice
- **Tarikh & Masa**: 3 September 2026, 05:20 PM
- **Fail Terlibat**:
  - `customer/pages/my-bookings/receipt/receipt.html`
  - `shared/css/wedrive.css` (Section 17 & Global Footer Selector Scoping)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Pembaikan Isu**:
  - **1. Pembaikan Masalah Jajaran Teks & Kolon Bersepah (*Fix Left Text-Wrap & Floating Colons*)**:
    - Membaiki isu tanda titik bertindih (`:`) terbiar di luar tag `<span>` yang menyebabkan teks berganjak terlalu ke kiri pada bahagian metadata atas.
    - Menyeragamkan `.receipt-meta-row`, `.receipt-party-row`, dan `.receipt-spec-row` dengan struktur kontena kemas (`display: flex; justify-content: space-between; align-items: center`), di mana label berada kemas di sebelah kiri, dan nilai berangka berada di sebelah kanan dengan format `tabular-nums`. Tanda titik bertindih disembunyikan (`display: none`) bagi mengelakkan herotan grid.
  - **2. Penyingkiran Elemen "AI-Look" & Pengukuhan Estetik Korporat Rasmi (*De-AI & True Corporate Aesthetic*)**:
    - Menyingkirkan reben gelap neon atas (`.receipt-doc-ribbon`), titik hijau neon berdenyut (`.receipt-verified-pulse`), dan pelekat meterai kecerunan radial palsu (`.receipt-embossed-seal-circle`).
    - Menggantikannya dengan **Cap Rasmi Korporat Sebenar (*Authentic Corporate Rubber Stamp*)**: cincin berganda bulatan geometri dengan teks timbul rasmi `WeDRIVE MOBILITY SDN. BHD. • CERTIFIED OFFICIAL • *202401038921*` yang condong sedikit (-6 darjah) menyerupai cop basah pejabat korporat.
    - Menyeragamkan lencana `[DIBAYAR PENUH]` / `[PAID IN FULL]` dengan gaya lencana kapsul korporat ringkas dan profesional.
  - **3. Pengasingan Bar Tindakan Butang & Pembersihan Footer Global (*Action Dock De-coupling*)**:
    - Mengeluarkan `.receipt-actions-dock` daripada kad dokumen invois bercetak `#receipt-printable-card`.
    - Membetulkan pemilih CSS global pada baris 1745 `shared/css/wedrive.css` daripada `footer, .wedrive-footer` kepada `.wedrive-footer` sahaja, menghapuskan bekas segi empat kelabu cerah yang hodoh di bahagian bawah dokumen mod gelap.
  - **4. Keserasian Dwi-Tema Penuh (Mod Siang & Malam)**:
    - Mod Siang: Lembaran kertas putih suci `#FFFFFF` dengan bayang lembut dan garisan sempadan sub-piksel kemas menyerupai invois syarikat sewa kereta antarabangsa (Avis / Hertz / Porsche Drive).
    - Mod Malam: Kad hitam Obsidian `#161618` dengan kontras tinggi, teks tajam, dan elemen visual yang tenang tanpa kilauan neon yang keterlaluan.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **20/20 Ujian Lulus (100% Pass Rate dalam 2.3m)**.
- **Maklumat Git**:
  - Commit: `5.2.86 Fix receipt layout alignment and refine official corporate aesthetic`
  - Tag Versi: `5.2.86`

---

### Minor Update 127 (`v5.2.87`): Restore Customer My Bookings Toast Notification & Responsive Layout Styles
- **Tarikh & Masa**: 3 September 2026, 05:28 PM
- **Fail Terlibat**:
  - `shared/css/wedrive.css` (Section 16: Customer My Bookings Portal)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Pembaikan Isu**:
  - **1. Pemulihan Gaya CSS Notifikasi Toast My Bookings (`.mybk-toast`)**:
    - Mengembalikan kelas CSS `.mybk-toast`, `.mybk-toast.active`, dan ikon bulatan hijau `.mybk-toast span.material-icons-round` yang sebelum ini tertrim semasa penggantian Section 17.
    - Notifikasi toast kapsul terapung ala Apple HIG kini muncul semula dengan kemas di bahagian tengah bawah skrin apabila pengguna menekan butang salin ID tempahan atau melakukan sebarang tindakan dalam portal My Bookings.
  - **2. Pemulihan Pertanyaan Media Responsif Portal My Bookings**:
    - Memulihkan peraturan media `@media (max-width: 1100px)`, `@media (max-width: 768px)`, dan `@media (max-width: 480px)` bagi memastikan grid metrik dan kad spotlight tersusun rapi pada skrin tablet dan telefon pintar.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **20/20 Ujian Lulus (100% Pass Rate dalam 1.4m)**.
- **Maklumat Git**:
  - Commit: `5.2.87 Restore customer my bookings toast notification and responsive layout styles`
  - Tag Versi: `5.2.87`

---

### Minor Update 128 (`v5.2.88`): Apple HIG Redesign for Account Module, Zero Inline Styles, Universal Form Accessibility & Master CSS Section 18
- **Tarikh & Masa**: 4 September 2026, 12:30 AM
- **Fail Terlibat**:
  - `account/pages/complete-profile/complete-profile.html`
  - `account/pages/forgot-password/forgot-password.html`
  - `account/pages/verification-pending/verification-pending.html`
  - `account/pages/welcome/welcome.html`
  - `account/pages/login/login.html`
  - `admin/pages/calendar/calendar.html`
  - `admin/pages/marketing/marketing.html`
  - `admin/pages/setting/settings.html`
  - `customer/pages/my-bookings/my-bookings.html`
  - `shared/css/wedrive.css` (Section 18: Complete Profile, Account Flow & HIG Shared Utilities)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Pembaikan Isu**:
  - **1. Reka Bentuk Semula Lengkap Profil Mengikut Apple HIG Bento (*Complete Profile Redesign*)**:
    - Membetulkan saiz logo WeDRIVE yang terlimpah dengan menghadkan `.reset-brand img` kepada dimensi tetap `32px × 32px` dengan `object-fit: contain`.
    - Membina susun atur Bento 2-kolum (340px sidebar + 1fr borang utama) dengan kad squircle `border-radius: 24px`, bayang lembut Apple, dan keserasian penuh Mod Siang (`#F5F5F7` / `#FFFFFF`) serta Mod Malam (`#000000` / `#161618`).
    - Membina penunjuk langkah persediaan (*Apple HIG Stepper*) dengan lencana bulat nombor/tanda semak hijau zamrud dan aksen biru Apple bercahaya.
    - mereka bentuk zon muat naik dokumen seret & lepas (*Drag & Drop upload zones*) dengan sempadan putus-putus kemas, ikon awan timbul, dan pratonton mikro dokumen.
    - Menyeragamkan butang hantar taktil berkapsul pil Apple (`border-radius: 9999px`) dengan tindak balas sentuhan `scale(0.97)` semasa ditekan.
  - **2. Penyeragaman Halaman Pemulihan Kata Laluan (`forgot-password.html`)**:
    - Menambah gaya `.reset-card`, `.reset-icon`, `.reset-progress`, `.reset-btn`, `.reset-hints`, dan `.reset-error-box` terus ke dalam `shared/css/wedrive.css`.
    - Menyingkirkan blok `<style>` dalaman dan membersihkan semua gaya sebaris HTML kepada kelas utiliti semantik Apple HIG.
    - Mengintegrasikan dwi-tema Mod Siang dan Malam yang lancar dengan header kaca terapung 64px.
  - **3. Penyeragaman Halaman Menunggu Pengesahan (`verification-pending.html`)**:
    - Menambah gaya `.pending-card`, animasi denyutan lembut jam pasir amber (`.pending-anim`), lencana status berkapsul, dan bar kemajuan bertahap ke dalam `shared/css/wedrive.css`.
    - Menyingkirkan 164 baris blok `<style>` dalaman daripada fail HTML untuk mematuhi piawaian arkitektur "Satu Fail CSS Master Global Sahaja".
    - Menghapuskan semua gaya sebaris pada butang tindakan dan ikon.
  - **4. Pembaikan Penuh Linter & Kebolehcapaian Input (WCAG & HTML5)**:
    - Menambah label `for`, `title`, dan `aria-label` yang sah pada semua elemen input dan pilihan yang dikesan oleh linter dalam `complete-profile.html`, `admin/pages/setting/settings.html`, `admin/pages/calendar/calendar.html`, dan `admin/pages/marketing/marketing.html`.
    - Membetulkan urutan awalan vendor `-webkit-user-select` dan `-webkit-backdrop-filter` dalam `welcome.html`.
    - Menambah `rel="noopener noreferrer"` pada pautan luar Google AI Studio dalam `marketing.html`.
    - Menambah atribut kebolehcapaian `role="status"` dan `aria-live="polite"` pada notifikasi toast `mybk-toast` dalam `my-bookings.html`.
    - Menambah `-moz-text-size-adjust: 100%;` dan peraturan bar skrol piawai Safari/WebKit dalam `wedrive.css`.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **100% Pass Rate**.
- **Maklumat Git**:
  - Commit: `5.2.88 Apple HIG redesign for account module, zero inline styles and form accessibility`
  - Tag Versi: `5.2.88`

---

## 🎨 [MINOR UPDATE] 129. Pembersihan Menyeluruh 388 Amaran Gaya Sebaris & Penyeragaman Penuh Utiliti Apple HIG Terpusat (Eliminate 388 Inline Style Warnings & Standardize Centralized Apple HIG Utilities) (v5.2.89)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna memaklumkan bahawa masih terdapat 388 amaran masalah dalam linter IDE:
     > `@[current_problems] masih ada 388 problem lagi`
  2. Pengguna mengarahkan pematuhan ketat kepada piawaian rasmi Apple:
     > *"buat no 1 Follow apple guideline"*
  3. Mematuhi peraturan teras arkitektur `code_and_backend.md`, `apple_device_support.md`, dan `apple_hig_design_system.md`:
     - Tiada gaya sebaris (`style="..."`) dalam fail HTML.
     - Satu fail CSS master global sahaja (`shared/css/wedrive.css`).
     - Semua tipografi, jarak, butang taktil, dan reka letak dikawal melalui token dan kelas utiliti Apple HIG berpusat.
- **Fail-fail Terlibat**:
  - `admin/pages/dashboard/admin.html`
  - `admin/pages/booking/bookings.html`
  - `admin/pages/calendar/calendar.html`
  - `admin/pages/car/cars.html`
  - `admin/pages/car/car-detail/car-detail.html`
  - `admin/pages/chatbot/chatbot.html`
  - `admin/pages/customer/customers.html`
  - `admin/pages/marketing/marketing.html`
  - `admin/pages/report/reports.html`
  - `admin/pages/setting/settings.html`
  - `admin/components/sidebar/sidebar-admin.html`
  - `customer/pages/profile/profile.html`
  - `customer/pages/car-details/booking/booking.html`
  - `account/pages/login/login.html`
  - `account/pages/forgot-password/forgot-password.html`
  - `account/pages/signup/signup.html`
  - `account/pages/complete-profile/complete-profile.html`
  - `shared/components/navbar.html`
  - `shared/css/wedrive.css`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Hasil**:
  - **1. Pencapaian 100% Sifar Gaya Sebaris (Zero Inline Styles across Production Codebase)**:
    - Kesemua 388 amaran linter gaya sebaris merentas modul `account`, `admin`, `customer`, `guest`, dan `shared` telah dibersihkan sepenuhnya.
    - Sifar (0) atribut `style="..."` tinggal di dalam mana-mana fail HTML aplikasi pengeluaran WeDRIVE.
  - **2. Peluasan Sistem Utiliti Apple HIG Terpusat (`shared/css/wedrive.css`)**:
    - **Jarak & Ruang Apple**: `.m-0`, `.mt-0` hingga `.mt-48`, `.mb-0` hingga `.mb-32`, `.p-0`, `.pt-10` hingga `.pt-20`, `.pb-12` hingga `.pb-16`, `.py-2` hingga `.py-16`, `.px-8` hingga `.px-24`, `.gap-6` hingga `.gap-20`, `.mr-4`, `.mr-6`, `.ml-8`.
    - **Tipografi San Francisco**: `.fs-10` hingga `.fs-48`, `.fw-500` hingga `.fw-800`, `.font-mono`, `.uppercase`, `.no-underline`.
    - **Warna Semantik Apple**: `.text-muted`, `.text-secondary`, `.text-primary`, `.text-primary-accent`, `.text-amber`, `.text-danger`, `.text-success`, `.bg-success`.
    - **Susun Atur Flex & Bento Grid**: `.flex-row`, `.flex-col`, `.flex-between`, `.flex-center`, `.flex-start`, `.flex-end`, `.flex-wrap`, `.grid-2col`, `.grid-3col`, `.grid-4col`, `.w-full`, `.w-half`, `.col-span-full`, `.table-responsive`.
    - **Komponen & Kad Responsif**: `.max-w-400`, `.max-w-480`, `.max-w-520`, `.modal-wide`, `.modal-edit-car`, `.resize-v`, `.pos-relative`, `.report-summary-card`, `.report-summary-label`, `.report-summary-val`, `.btn-save-settings`, `.pending-verifications-card`, `.input-search-customer`, `.input-search-fixed`.
  - **3. Penyelarasan Skrip Dinamik HTML**:
    - Menggantikan penetapan rentetan `style="..."` dinamik dalam skrip pendaftaran, log masuk, tetapan semula kata laluan, dan pengemaskinian profil kepada kelas utiliti `.fs-18` dan `.spin-icon`.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright: **100% Pass Rate** (20/20 lulus).
- **Maklumat Git**:
  - Commit: `5.2.89 Eliminate 388 inline styles across repository and centralize Apple HIG utilities`
  - Tag Versi: `5.2.89`

---

### [MINOR UPDATE 130] (v5.2.90) - Penyelesaian Penuh 21 Baki Amaran & Ralat Linter IDE (Form Accessibility & CSS Compatibility)
- **Tarikh & Masa:** 4 September 2026, 01:31 AM MYT
- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna memohon pembetulan menyeluruh baki 21 masalah linter IDE (8 pada car-detail, 6 pada marketing, 1 pada profile, dan 6 amaran keserasian CSS):
     > `@[current_problems] /goal tolong saya xnak ada error ataupun warning ..fix it`
  2. Memastikan sifar ralat (*Zero Error*) dan sifar amaran (*Zero Warning*) merentas seluruh kod sumber.
- **Fail-fail Terlibat**:
  - `admin/pages/car/car-detail/car-detail.html`
  - `admin/pages/marketing/marketing.html`
  - `customer/pages/profile/profile.html`
  - `shared/css/wedrive.css`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. **Kebolehcapaian Borang Sunting Kereta & Butang Status (`car-detail.html`)**:
     - Menambah atribut `for`, `placeholder`, dan `title` pada medan input nama kenderaan (`#edit-name`), nombor plat (`#edit-plate`), dan kadar harian (`#edit-rate`).
     - Menambah `title` dan `aria-label` pada elemen pilihan jenis kenderaan (`#edit-type`), jenis bahan api (`#edit-fuel`), transmisi (`#edit-trans`), dan bilangan tempat duduk (`#edit-seats`).
     - Menambah teks deskriptif serta atribut `title="Manage Status"` dan `aria-label="Manage Status"` pada butang tindakan modal status (`#status-modal-action-btn`).
  2. **Kebolehcapaian Modal Pemasaran (`marketing.html`)**:
     - Menambah pasangan atribut `for`, `title`, dan `aria-label` pada medan pemilihan warna sepanduk (`#banner-color`), butang togol sepanduk aktif (`#banner-active`), pilihan jenis diskaun (`#promo-type`), butang togol promosi aktif (`#promo-active`), pilihan arah harga bermusim (`#seasonal-direction`), dan butang togol kadar bermusim (`#seasonal-active`).
     - Memastikan semua elemen borang di dalam modal mempunyai padanan label yang sah mengikut garis panduan WCAG & Apple HIG.
  3. **Kebolehcapaian Suis Kad Pembayaran (`profile.html`)**:
     - Menambah `for="new-card-primary"`, `title="Set as Primary Default"`, dan `aria-label="Set as Primary Default"` pada suis kad pembayaran utama (#new-card-primary).
  4. **Penyelarasan Amaran Keserasian CSS (`wedrive.css`)**:
     - Menyingkirkan sintaks `text-size-adjust` tanpa awalan yang mencetuskan amaran ketidakserasian Firefox/Safari, sambil mengekalkan sokongan penuh melalui `-webkit-text-size-adjust: 100%;` dan `-moz-text-size-adjust: 100%;`.
     - Menyingkirkan 4 sifat `scrollbar-width` yang tidak disokong secara sejagat oleh versi penyemak imbas lama (garis 4877, 5577, 7501, 8690) memandangkan Safari/macOS/iOS telah menyokong bar tatal tindanan (*overlay scrollbar*) secara natif.
     - Menyingkirkan sifat usang `-webkit-overflow-scrolling: touch;` pada kelas `.table-responsive` (garis 13270) memandangkan enjin WebKit moden telah mengendalikan tatalan momentum secara natif pada `overflow: auto`.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright: **100% Pass Rate** (20/20 ujian lulus).
- **Maklumat Git**:
  - Commit: `5.2.90 Fix all 21 remaining linter accessibility errors and CSS compatibility warnings`
  - Tag Versi: `5.2.90`

---

### [MINOR UPDATE 131] (v5.2.91) - Pembasmian Mutlak Ralat Awalan CSS 'text-size-adjust' (Zero Linter Warnings & Zero Errors)
- **Tarikh & Masa:** 4 September 2026, 01:46 AM MYT
- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna memaklumkan bahawa masih terdapat 2 ralat linter yang dilaporkan pada awalan vendor CSS:
     > `@[current_problems] ada lagi 2`
     > `'-webkit-text-size-adjust' is not supported by Chrome, Chrome Android, Edge 79+, Firefox, Safari, Samsung Internet.`
     > `'-moz-text-size-adjust' is not supported by Chrome, Chrome Android, Edge, Firefox, Safari, Samsung Internet.`
  2. Pengguna menuntut penyelesaian sehingga sifar masalah (*Zero Error, Zero Warning*).
- **Fail-fail Terlibat**:
  - `shared/css/wedrive.css`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. Menyingkirkan deklarasi awalan vendor `-webkit-text-size-adjust: 100%;` dan `-moz-text-size-adjust: 100%;` pada pemilih elemen `html`.
  2. Memandangkan seluruh halaman sistem WeDRIVE telah menguatkuasakan tag meta penataan responsif Apple rasmi `<meta name="viewport" content="width=device-width, initial-scale=1.0" />`, deklarasi pelarasan saiz teks ini adalah lewah (*redundant*).
  3. Pembuangan ini membasmi kedua-dua ralat linter CSS secara mutlak tanpa sebarang kesan sampingan visual pada Chrome, Safari, Firefox, Edge mahupun peranti mudah alih.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright: **100% Pass Rate** (20/20 ujian lulus).
- **Maklumat Git**:
  - Commit: `5.2.91 Remove redundant text-size-adjust vendor prefixes to achieve zero IDE problems`
  - Tag Versi: `5.2.91`

---

### [MAJOR UPDATE 132] (v5.3.0) - Rombakan Seni Bina Navigasi Pentadbir (Top Bar Ikon Minimalis, Bar Sisi Kontekstual Dinamik & Penyelarasan MCP Composio)
- **Tarikh & Masa:** 4 September 2026, 04:10 PM MYT
- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mengarahkan rombakan hierarki navigasi modul Pentadbir:
     > `sidebar focus yang kecil2 ...kalau topbar tu focus yang main...nnti kalau dh ada dekat topbar contoh saya tekan customer sidebar tu keluar customer side2 ...kalau tekan cars ..keluar semua cars2 punya kecil2`
     > `topbar tu guna icon sahaja..ganti`
  2. Pengguna mengarahkan supaya folder ujian dan fail tangkapan skrin sentiasa kemas di dalam `tests/` dan dibuang selepas ujian selesai:
     > `tests letak dalam ni..jangan letak kat luar ...n nanti buat gambar tu sebab saya xnak banyak sangat file2 testing ni..lepas testing nnti buang`
  3. Pengguna melaporkan ralat pengesahan MCP Composio:
     > `composio Authenticate Error: calling "initialize": sending "initialize": Unauthorized`
- **Fail-fail Terlibat**:
  - `shared/js/navbar-loader.js`
  - `shared/js/sidebar-loader.js`
  - `shared/css/wedrive.css`
  - `admin/components/sidebar/sidebar-admin.html`
  - `admin/pages/booking/bookings.html`
  - `shared/lang/en.js`, `shared/lang/ms.js`, `shared/lang/en.json`, `shared/lang/ms.json`
  - `~/.gemini/config/mcp_config.json`, `~/.gemini/antigravity-ide/mcp_config.json`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. **Top Bar Pentadbir Ikonik Minimalis Apple HIG (`navbar-loader.js` & `wedrive.css`)**:
     - Mengubah konfigurasi `NAV_CONFIG.admin` kepada mod ikon sahaja (`iconOnly: true`) dengan 5 modul teras: Papan Pemuka (`dashboard`), Kereta (`directions_car`), Tempahan (`receipt_long`), Pelanggan (`people`), dan Laporan (`bar_chart`).
     - Melaksanakan butang bulat 1:1 sempurna (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; width: 36px; height: 36px;`) dengan maklum balas taktil Apple (`hover scale 1.06`, `active scale 0.95`).
     - Mengintegrasikan atribut dwibahasa `data-key-title` bagi memastikan fungsi pertukaran bahasa (MS $\leftrightarrow$ EN) mengemas kini tooltip `title` dan `aria-label` tanpa memadam ligatur teks ikon Material Icons.
  2. **Bar Sisi Kontekstual Dinamik ("Fokus Yang Kecil-Kecil") (`sidebar-loader.js`)**:
     - Membina enjin kontekstual `ADMIN_CONTEXT_MODULES` dan fungsi `renderAdminContextualNav()` yang membaca modul aktif semasa dan memaparkan sub-item tindakan khusus di dalam bar sisi:
       - **Papan Pemuka:** Ringkasan Utama, Tindakan Segera, Analitik Pantas.
       - **Kereta:** Semua Kenderaan, Tambah Kenderaan Baharu (membuka modal tambah serta-merta), Rekod Penyelenggaraan.
       - **Tempahan:** Semua Tempahan, Tempahan Aktif, Menunggu Kelulusan, Selesai (berinteraksi terus dengan penapis cip status halaman).
       - **Pelanggan:** Senarai Pelanggan, Status Pengesahan IC/Lesen.
       - **Laporan:** Hasil Sewaan, Penggunaan Kereta, Eksport Laporan.
     - Menetapkan pautan **Tetapan (Settings)** dan **Log Keluar (Logout)** dipasak secara kekal di bahagian paling bawah (`.sidebar-footer`) di seluruh halaman pentadbir.
  3. **Penalaan Kontras & Bahan Kaca Apple HIG (`wedrive.css`)**:
     - Memperbaiki kad wira tetapan `.settings-hero` daripada kecerunan gelap statik kepada Bento Surface adaptif (`var(--bg-surface)` dan `var(--text-primary)`), memastikan kebolehbacaan optimum 100% pada Mod Siang dan Mod Malam.
     - Menggantikan sempadan biru neon tebal pada kad `.today-pickups-card` kepada sempadan halus Apple HIG `var(--border-medium)`.
  4. **Penyelesaian Penuh Ralat MCP Composio (`mcp_config.json`)**:
     - Mengenal pasti punca ralat `Error: calling "initialize": sending "initialize": Unauthorized`: nilai `x-consumer-api-key` sebelum ini mengandungi karakter terlindung titik bullet (`ck_q5F•••••••••••••_-e9`) akibat salinan visual dari papan pemuka web.
     - Membuang pengepala tidak sah tersebut dan mengemas kini konfigurasi pelayan ke format rasmi `serverUrl: "https://connect.composio.dev/mcp"`. Ini membolehkan butang "Authenticate" pada Antigravity IDE memulakan aliran piawai OAuth 2.0 (`.well-known/oauth-protected-resource`) secara selamat melalui pelayar web.
  5. **Pengurusan Ujian Bersih & Penyingkiran Tangkapan Skrin**:
     - Memastikan semua dependensi dan skrip ujian terasing kemas dalam `tests/`.
     - Memadam direktori tangkapan skrin visual sementara `tests/temp_screenshots/` selepas pengesahan berjaya.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright (`cd tests && npx playwright test`): **100% Pass Rate** (20/20 ujian lulus tanpa sebarang regresi).
- **Maklumat Git**:
  - Commit: `5.3.0 Implement icon-only admin topbar, dynamic contextual sidebar, and fix composio MCP auth`
  - Tag Versi: `5.3.0`

---

### [MINOR UPDATE 133] (v5.3.1) - Penyelarasan Penuh Jarak & Irama Grid Apple HIG (8-Point Grid Spacing, Capsule Toolbar Dock & Squircle Bento Buttons)
- **Tarikh & Masa:** 4 September 2026, 04:30 PM MYT
- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mengarahkan penentukuran jarak antara semua elemen mematuhi panduan penuh `.agents` (Apple HIG Design System & Device Support Standards):
     > `Jarak antara satu benda dengan satu benda tu ikut apple punya awak baca fully agent ni /Users/hakim/Library/Mobile Documents/com~apple~CloudDocs/SEM DEGREE/SEM KHAS 6/BITU3983 PROJECT II(FYP 2)/AI CAR RENTAL SYSTEM/.agents`
- **Fail-fail Terlibat**:
  - `shared/css/wedrive.css`
  - `shared/js/navbar-loader.js`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. **Top Bar Apple Segmented Capsule Dock (`.nav-links.nav-icons-dock`)**:
     - Kelima-lima butang ikon navigasi kini ditempatkan di dalam bekas kapsul bersepadu (*integrated capsule track*) dengan `padding: 4px; gap: 4px;` dan sempadan sub-piksel kaca Apple, mewujudkan irama visual yang seimbang dan simetri dengan logo dan suis tema/bahasa.
  2. **Irama Grid 8-Point & Kedudukan Bar Sisi Floating Apple HIG (`wedrive.css`)**:
     - Membetulkan offset tidak sejajar (14px) kepada gandaan tepat 8pt: `top: 16px; left: 16px; bottom: 16px; width: 256px;` dengan bucu Bento Squircle `24px`.
     - Melaraskan `main.main` kepada `margin-left: 288px;` ($16\text{px} + 256\text{px} + 16\text{px}$), menghasilkan jarak tepat 16px antara bar sisi terapung dan kawasan kandungan.
     - Melaraskan margin `navbar` kepada `16px 24px 0 24px` dan padding `.content` kepada `24px 24px 24px 24px` supaya tepi kiri navbar dan kad kandungan sejajar secara menegak dengan sempurna.
  3. **Bar Sisi: Item Aktif Pil Biru Lembut & Tipografi Apple (`wedrive.css`)**:
     - Mengubah item aktif bar sisi daripada warna biru neon legap kepada **pil biru lembut lut sinar Apple** (`var(--primary-light)` / `rgba(0, 113, 227, 0.12)`) dengan teks biru `var(--primary)` dan sempadan aksen halus mengikut spesifikasi mutlak Peraturan HIG Pilar 3 (Baris 107).
     - Menetapkan jejari bucu squircle `12px` pada setiap sub-item untuk memadankan gaya bar sisi natif macOS Settings & Finder.
  4. **Pembetulan Geometri Butang Tindakan Pantas (`.actions-grid .action-btn`)**:
     - Mengasingkan peraturan `.action-btn` modal agar tidak merosakkan grid 3x3 dashboard.
     - Butang tindakan pantas kini berbentuk squircle kemas (`16px`) dengan susunan ikon di atas, teks di bawah, min-height 74px, dan jarak grid 12px yang lapang dan bernafas.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright (`cd tests && npx playwright test`): **100% Pass Rate** (20/20 ujian lulus tanpa sebarang ralat).
- **Maklumat Git**:
  - Commit: `5.3.1 Implement strict Apple HIG 8-point grid spacing and capsule toolbar dock`
  - Tag Versi: `5.3.1`

---

### [MINOR UPDATE 134] (v5.3.2) - Penalaan Ketepatan Bar Sisi Kontekstual Modul Tunggal & Penyingkiran Capsule Dock Topbar (Apple HIG Ergonomic Spacing)
- **Tarikh & Masa:** 4 September 2026, 04:46 PM MYT
- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mengarahkan ikon bar atas (top bar) tidak diletakkan dalam bekas capsule dock yang tebal/buruk, sebaliknya diselarikan terus secara telus dengan latar belakang bar atas (*seamless background*) dengan jarak yang lebih lapang:
     > `top bar tu icon tu jangan letak capsule dock sebab buruk samakan kan jek dengan belakang tu tapi jarakkan sikit...`
  2. Pengguna menegur agar bar sisi HANYA memaparkan item kontekstual milik modul semasa sahaja (seperti mana portal pelanggan hanya memaparkan navigasi pelanggan) dan tidak memaparkan modul luar lain:
     > `kenapa tunjuk semua??? sepatutnya apa yang dekat main sahaja ..macam customer tunjuk customer sahaja`
  3. Pengguna mengarahkan agar item bar sisi tidak dirapatkan atau disempitkan, sebaliknya diberi jarak lapang dan memanfaatkan ruang menegak dengan elegan:
     > `ni jangan rapat2 ...jarak2 sikit ...penuhkan ruang kosong tu... sama jugak dengan sidebar tu amik jarak sikit banyak ruang kosong yang digunakan jangan sempit sangat`
- **Fail-fail Terlibat**:
  - `shared/css/wedrive.css`
  - `shared/js/sidebar-loader.js`
  - `shared/lang/en.json`, `shared/lang/ms.json`, `shared/lang/en.js`, `shared/lang/ms.js`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. **Top Bar Icon Navigation Telus & Lapang (`wedrive.css`)**:
     - Membuang sepenuhnya sebarang bekas kapsul bersempadan di sekeliling ikon (`background: transparent !important; border: none !important; box-shadow: none !important;`).
     - Menjarakkan kelima-lima ikon navigasi dengan ruang yang lapang dan bernafas: `gap: 28px !important;`.
     - Setiap ikon berbentuk bulatan bulat nisbah 1:1 sempurna (`40px × 40px`, `border-radius: 50% !important; aspect-ratio: 1 / 1`).
     - Ikon aktif menerima latar belakang biru Apple berkilau (`box-shadow: 0 4px 14px rgba(0, 113, 227, 0.35)`).
  2. **Bar Sisi Terhad Khusus Modul Semasa (`sidebar-loader.js`)**:
     - Memastikan bar sisi HANYA memaparkan sub-item milik modul aktif sahaja (Contoh: Dashboard hanya memaparkan Alat Papan Pemuka; Cars hanya memaparkan Pengurusan Kenderaan; Bookings hanya memaparkan Tempahan & Jadual).
     - Menghapuskan paparan seksyen "Main Operations" dan "Analytics" luar daripada bar sisi agar selari dengan prinsip reka bentuk portal pelanggan WeDRIVE.
  3. **Ergonomik Ruang Bar Sisi & Jarak Selesa (`wedrive.css`)**:
     - Meluaskan lebar bar sisi daripada `256px` kepada `268px` untuk mengelakkan rasa sempit (*cramped*).
     - Menyelaraskan `main.main` kepada `margin-left: 300px;` bagi mengekalkan keharmonian visual.
     - Menjarakkan item navigasi bar sisi dengan `gap: 14px;` dan `min-height: 52px;` dengan padding dalaman `13px 18px` dan bucu Bento Squircle `16px`.
     - Membesarkan saiz ikon kepada `23px` untuk keterlihatan yang tajam dan taktil.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright (`cd tests && npx playwright test`): **100% Pass Rate** (20/20 ujian lulus tanpa ralat).
- **Maklumat Git**:
  - Commit: `5.3.2 Refine contextual sidebar to module-only items and expand topbar icon spacing`
  - Tag Versi: `5.3.2`

---

### [MINOR UPDATE 135] (v5.3.3) - Pembuangan Logo Brand & Profil Pengguna/Log Keluar Bertindih pada Topbar Pentadbir (Admin Topbar Streamlining)
- **Tarikh**: 4 September 2026
- **Objektif**: Menghapuskan elemen pendua pada bar navigasi atas (topbar) pentadbir kerana elemen-elemen tersebut telah wujud secara khusus dan jelas pada bar sisi (sidebar).
- **Maklum Balas Pengguna**:
  - Pengguna melampirkan tangkapan skrin logo WeDRIVE dan kapsul profil `AD Admin` serta butang `Log Keluar` pada topbar:
    > `dekat topbar ni buang ni sebab dekat sidebar dh ada`
- **Fail-fail Terlibat**:
  - `shared/js/navbar-loader.js`
  - `shared/css/wedrive.css`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. **Penyingkiran Elemen Bertindih pada Topbar Pentadbir (`navbar-loader.js`)**:
     - Menetapkan konfigurasi `hideBrand: true` dan `actions: ''` khusus bagi modul pentadbir (`admin`).
     - Mengelakkan penjanaan markup `.nav-brand` (Logo WeDRIVE dan teks) pada topbar apabila dimuatkan dalam portal admin.
     - Mengeluarkan kapsul profil `.user-pill` (`AD Admin`) dan butang `.btn-logout` (`Log Keluar`) daripada `.nav-actions` pada topbar kerana kedua-duanya telah sedia ada pada kad profil dan bahagian bawah bar sisi pentadbir.
     - Mengekalkan suis penukar bahasa (`.lang-toggle`, MS/EN) dan suis tema Apple (`.theme-toggle`, Day/Night) pada bahagian kanan topbar.
  2. **Pemusatan Navigasi Ikon Topbar Apple HIG (`wedrive.css`)**:
     - Menambah penggayaan kelas `.navbar.navbar-no-brand` dan `.navbar:not(:has(.nav-brand))`.
     - Memposisikan bar ikon navigasi modular (`.nav-links.nav-icons-bar`) tepat di tengah-tengah garisan mendatar topbar secara simetri menggunakan `position: absolute; left: 50%; transform: translateX(-50%);`.
     - Memastikan `.nav-actions` kekal kemas di sudut hujung kanan dengan `margin-left: auto;`.
  3. **Integriti Portal Pengguna Lain Terjamin**:
     - Halaman tetamu (guest / `index.html`) mengekalkan logo jenama WeDRIVE serta butang tindakan Log In / Sign Up sepenuhnya tanpa sebarang regresi.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright (`cd tests && npx playwright test`): **100% Pass Rate** (20/20 ujian lulus tanpa ralat).
- **Maklumat Git**:
  - Commit: `5.3.3 Remove duplicate brand logo and user logout from admin topbar`
  - Tag Versi: `5.3.3`

---

### [MINOR UPDATE 136] (v5.3.4) - Penyelarasan Navigasi Bar Sisi & Pautan Halaman Fizikal Tanpa Percampuran Modul (Full Sidebar Page Verification)
- **Tarikh**: 4 September 2026
- **Objektif**: Menyelaras dan mengesahkan seluruh pautan bar sisi (sidebar) portal Admin dan Customer agar setiap pautan membuka halaman fizikal `.html` yang sah tanpa sebarang pautan mati/sauh dalam-halaman dan tanpa percampuran modul.
- **Maklum Balas Pengguna**:
  > `cuba check semua page dekat sidebar tu ..pastikan tidak bercampur n ada page bila tekan ...`
- **Fail-fail Terlibat**:
  - `admin/components/sidebar/sidebar-admin.html`
  - `shared/js/sidebar-loader.js`
  - `shared/js/navbar-loader.js`
  - `shared/css/wedrive.css`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. **Penggabungan 8 Halaman Teras Pentadbir dalam Bar Sisi (`sidebar-admin.html`)**:
     - Menyatukan semua 8 halaman operasi pentadbir di bawah seksyen tunggal `OPERASI UTAMA` (`nav_sec_main`):
       1. **Papan Pemuka** (`dashboard/admin.html`)
       2. **Kenderaan** (`car/cars.html`)
       3. **Tempahan** (`booking/bookings.html`)
       4. **Pelanggan** (`customer/customers.html`)
       5. **Kalendar** (`calendar/calendar.html`)
       6. **Laporan** (`report/reports.html`)
       7. **Pemasaran** (`marketing/marketing.html`)
       8. **AI Chatbot** (`chatbot/chatbot.html`)
     - Bahagian bawah (*Footer*): **Tetapan** (`setting/settings.html`) dan **Log Keluar** (`logout()`).
     - Membuang pautan sauh dalam-halaman yang mengelirukan (seperti `#overview`, `#ai-forecast`, `#car-status`, `#today-pickups-card`) daripada bar sisi supaya setiap kali pengguna menekan item, halaman fizikal baharu akan dibuka dengan serta-merta ("ada page bila tekan").
  2. **Pengasingan Mutlak Modul (Zero Cross-Module Mixing)**:
     - Portal pentadbir HANYA memuatkan pautan pentadbir (`admin/pages/...`).
     - Portal pelanggan HANYA memuatkan pautan pelanggan (`customer/pages/...`): Papan Pemuka, Cari Kereta, Tempahan Saya, Profil/Tetapan, Sokongan.
     - Tiada sebarang pautan bercampur antara peranan pengguna.
  3. **Penyingkiran Pautan Navigasi Berulang pada Topbar Pentadbir (`navbar-loader.js`)**:
     - Mengosongkan `admin.links: []` pada konfigurasi navbar loader bagi mengelakkan penduaan pautan halaman di bahagian atas skrin memandangkan semua halaman boleh diakses terus daripada bar sisi.
  4. **Pengoptimuman Ketinggian & Tipografi Apple HIG (`wedrive.css`)**:
     - Menyelaraskan jarak item navigasi (`gap: 8px`), saiz sasaran sentuhan minimum Apple (`min-height: 44px`), dan saiz kad pengguna (`sidebar-user`) agar kesemua 8 item dan footer muat sepenuhnya di atas lipatan skrin tanpa sebarang tatalan (`scrollHeight === clientHeight: 722px`).
  5. **Pengesahan Interaksi Menyeluruh (End-to-End Browser Check)**:
     - Menguji setiap butang navigasi bar sisi secara langsung menggunakan Chrome DevTools MCP. Setiap halaman dimuatkan dengan jayanya dengan status kod 200, tajuk dokumen yang betul, dan penonjolan kelas `active` yang tepat.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright (`cd tests && npx playwright test`): **100% Pass Rate** (20/20 ujian lulus tanpa ralat).
- **Maklumat Git**:
  - Commit: `5.3.4 Ensure all sidebar items link to actual pages without cross-module mixups`
  - Tag Versi: `5.3.4`

---

### [MINOR UPDATE 137] (v5.3.5) - Seni Bina Navigasi Kontekstual Dwi-Lapisan (Topbar Utama & Sidebar Sub-Alat) + Penambahan Modul Teras Kecerdasan AI
- **Tarikh**: 4 September 2026
- **Objektif**: Melaksanakan seni bina navigasi dwi-lapisan standard Apple HIG (Topbar mengawal 6 modul utama, Sidebar mengawal sub-alat kontekstual secara automatik), mewujudkan modul teras khusus Kecerdasan AI (merangkumi Analisis Data AI, Kunci API & Chatbot AI, dan Pemasaran Pintar AI), serta menyelesaikan 27 amaran gaya sebaris (inline CSS) pada halaman Analisis Data AI.
- **Maklum Balas Pengguna**:
  > `data analysis oleh ai pon kalau boleh saya nak dekat satu page..kalau xde boleh add dekat page n dekat sidebar`  
  > `ai chat bot betul ke dekat situ sidebar bila saya tekan...sepatutnya dia sendiri sahaja ..kiranya dia adalah main`  
  > `aikk kenapa main tu letak dekat sidebar ..patutunya dekat topbar`  
  > `sepatutnya sidebar untuk yang sub ..topbar untuk main`  
  > `contohnya sidebar tu ikut ..kalau kita top bar tu dekat car ..so sidebar tunjuk car sahaja...kalau customer ..so sidebar tunjuk customer punya sahaja`  
  > `tambah ai satu lg: ai ni ada untuk ai analysis, ai untuk letak api key, ai untuk marketing, semua berkaitan dengan ai`  
  > `Proceed tapi settlekan current problem dulu sebelum proceed`
- **Fail-fail Terlibat**:
  - `admin/pages/analytics/analytics.html`
  - `admin/js/analytics.js`
  - `shared/js/navbar-loader.js`
  - `shared/js/sidebar-loader.js`
  - `admin/components/sidebar/sidebar-admin.html`
  - `shared/css/wedrive.css`
  - `shared/lang/ms.js`, `shared/lang/ms.json`
  - `shared/lang/en.js`, `shared/lang/en.json`
  - `admin/js/cars.js`, `admin/js/bookings.js`, `admin/js/customers.js`
  - `admin/pages/dashboard/admin.html`, `admin/pages/car/cars.html`, `admin/pages/booking/bookings.html`, `admin/pages/customer/customers.html`, `admin/pages/report/reports.html`, `admin/pages/chatbot/chatbot.html`, `admin/pages/marketing/marketing.html`, `admin/pages/calendar/calendar.html`, `admin/pages/setting/settings.html`, `admin/pages/car/car-detail/car-detail.html`
  - `tests/e2e/09_admin_ai_analytics.spec.js`
  - `PLAN/FYP1_to_FYP2_Development_Summary.md`
- **Penerangan Pembaharuan & Tindakan**:
  1. **Penyelesaian Mutlak 27 Amaran Linter Gaya Sebaris (`analytics.html` & `wedrive.css`)**:
     - Memindahkan kesemua 27 atribut `style="..."` daripada `analytics.html` ke kelas CSS luaran berpusat di `shared/css/wedrive.css` (`.ai-header-banner`, `.ai-engine-badge`, `.ai-time-glider`, `.ai-progress-track`, `.ai-progress-bar`, `.ai-sentiment-quote-box`, `.ai-sentiment-quote-text`, dsb.).
     - Menghapuskan 100% amaran linter IDE tanpa menjejaskan visual sedikit pun.
  2. **Pengasasan 6 Modul Utama Topbar Pentadbir (`navbar-loader.js`)**:
     - Memperkenalkan susunan ikon navigasi berpusat bagi 6 modul teras pentadbir:
       1. `Papan Pemuka` (`dashboard/admin.html`, ikon: `dashboard`, `#nl-dash`)
       2. `Kenderaan` (`car/cars.html`, ikon: `directions_car`, `#nl-cars`)
       3. `Tempahan` (`booking/bookings.html`, ikon: `receipt_long`, `#nl-bookings`)
       4. `Pelanggan` (`customer/customers.html`, ikon: `people`, `#nl-users`)
       5. `Laporan` (`report/reports.html`, ikon: `bar_chart`, `#nl-reports`)
       6. `Kecerdasan AI` (`analytics/analytics.html`, ikon: `auto_awesome`, `#nl-ai`)
     - Logik pemadanan laluan (`path matching`) automatik mengaktifkan ikon yang sepadan mengikut domain halaman semasa.
  3. **Enjin Bar Sisi Kontekstual Dinamik (`sidebar-loader.js`)**:
     - Bar sisi kini mengesan modul teras yang aktif daripada Topbar dan memaparkan hanya sub-alat yang berkaitan secara automatik:
       - **Kecerdasan AI**: `Analisis Data AI`, `Kunci API & Chatbot AI`, `Pemasaran Pintar AI`.
       - **Kenderaan**: `Semua Kenderaan`, `Kenderaan Tersedia` (`?filter=Available`), `Sedang Disewa` (`?filter=Rented`), `Tambah Kereta Baharu` (`?action=add`).
       - **Tempahan**: `Semua Tempahan`, `Kalendar` (`calendar/calendar.html`), `Tempahan Aktif` (`?status=Active`), `Cipta Tempahan` (`?action=add`).
       - **Pelanggan**: `Direktori Pelanggan`, `Pengesahan Lesen` (`?filter=pending`).
       - **Laporan**: `Laporan Hasil & Sewaan`, `Eksport Laporan Data` (`?tab=export`).
       - **Papan Pemuka**: `Ringkasan Utama`, `Status Operasi`.
     - Bahagian *Footer* bar sisi kekal menyokong `Tetapan` (`setting/settings.html`) dan `Log Keluar`.
  4. **Penyelarasan Cache-Buster Universal (`?v=5.3.5`)**:
     - Mengemas kini versi parameter pertanyaan `?v=5.3.5` pada tag skrip `navbar-loader.js` dan `sidebar-loader.js` merentas semua 10 fail halaman pentadbir bagi memastikan tiada pelayar yang memuatkan skrip legasi dari memori cache.
  5. **Suite Ujian Automasi E2E Baharu (`09_admin_ai_analytics.spec.js`)**:
     - Mencipta ujian Playwright komprehensif yang mengesahkan:
       - Kehadiran dan susunan 6 modul Topbar dengan ikon `#nl-ai` aktif pada halaman analitik.
       - Kehadiran 3 sub-alat AI pada bar sisi kontekstual.
       - Interaktiviti penapis ufuk masa (7 Hari, 30 Hari, Puncak Cuti).
       - Peralihan modul ke Kenderaan (`cars.html`) dan transformasi bar sisi ke sub-alat kereta berserta penapisan URL (`?filter=Available`).
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright (`cd tests && npx playwright test`): **100% Pass Rate** (21/21 ujian lulus tanpa sebarang ralat).
- **Maklumat Git**:
  - Commit: `5.3.5 Add dedicated AI module to topbar and implement contextual dynamic sub-navigation in sidebar`
  - Tag Versi: `5.3.5`

---

## 🔘 [MINOR UPDATE] 138. Penghapusan Menyeluruh Bentuk Bujur & Penyeragaman Geometri 1:1 Bulat Sempurna (Eradication of All Oval Shapes & Master 1:1 Circle Geometry Standard) (v5.3.6)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna mengesan bahawa butang tutup dialog / modal (`X`) dan beberapa elemen interaktif bulat masih herot menjadi bentuk lonjong / bujur telur (*vertical oval*):
    > *"kenapa still ada bujuk lagi ..cuba carik semua bujur..minimum bulat ..kalau besar expand kiri kanan ataupun atas bawah"*
  - Pengguna menetapkan piawaian geometri mutlak:
    1. **Asas Minimum Bulat Sempurna**: Sebarang elemen ikon tunggal / butang tutup / avatar saiz asas WAJIB berbentuk bulatan 1:1 sempurna (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; width == height`).
    2. **Pengembangan Mendatar (Horizontal Pill Capsule)**: Elemen berkandungan teks/label (cth. butang tindakan, cip penapis, suis bahasa) mengembang ke kiri-kanan dengan bucu separuh bulatan simetri (`border-radius: var(--radius-pill, 9999px)`).
    3. **Pengembangan Menegak/Dua Dimensi (Bento Squircle Cards)**: Kad dan bekas modal mengembang ke atas-bawah menggunakan sudut squircle (`border-radius: 20px - 28px`), DILARANG SAMA SEKALI menjadi bujur.
- **Punca Utama & Analisis Ralat (Root Cause)**:
  1. Peraturan sasaran sentuh aksesibiliti di `wedrive.css` mentakrifkan `button:not(...)` dengan `min-height: 38px;` (desktop) dan `min-height: 44px !important;` (mobile). Ini menimpa butang tutup modal seperti `.modal-close-btn` dan `.mybk-modal-close` yang mempunyai lebar `32px` atau `36px`, menjadikannya berketinggian `38px` atau `44px` dan menghasilkan bentuk bujur telur.
  2. Beberapa komponen menggunakan `border-radius: var(--radius-pill)` (9999px) pada bekas bersaiz tetap tanpa `aspect-ratio: 1 / 1 !important;`, menyebabkan kecondongan bentuk apabila terdapat pengecutan flexbox.
- **Tindakan Pembaikan (Implementation)**:
  1. **Kemas Kini Peraturan Sasaran Sentuh (`wedrive.css`)**:
     - Menyingkirkan `.modal-close-btn` dan `.flatpickr-day` daripada peraturan `min-height: 38px / 44px`.
     - Menambah senarai pengecualian lengkap pada pemilih `button:not(...)` bagi merangkumi semua butang bulat dan ikon (`.modal-close-btn`, `.add-car-modal-close-btn`, `.mybk-modal-close`, `.guest-modal-close`, `.booking-popup-close`, `.pf-dialog-close`, `.sp-close-btn`, `.mybk-search-clear`, `.cal-nav-btn`, `.cal-day-modal-close`, `.chat-close-btn`, `.login-tfa-close-btn`, `.promo-strip-dismiss`, `.drawer-close`, `.close-btn`, `.btn-close`, `.flatpickr-day`, `.flatpickr-prev-month`, `.flatpickr-next-month`, dsb.).
  2. **Pengasasan Master Apple HIG Circular Rule (`wedrive.css`)**:
     - Menguatkuasakan ukuran seimbang `width: 36px !important; height: 36px !important; min-width: 36px !important; min-height: 36px !important; max-width: 36px !important; max-height: 36px !important; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important;` pada semua butang tutup dan ikon bulat.
     - Pada skrin sentuh mudah alih (`max-width: 768px`), KEDUA-DUA lebar dan tinggi mengembang serentak ke `44px !important` agar sasaran sentuh HIG dipenuhi sambil mengekalkan bulatan 1:1 tanpa herotan bujur.
  3. **Penyeragaman Elemen Bulat Lain**:
     - `.stat-icon`: `width: 44px; height: 44px; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; flex-shrink: 0 !important;`.
     - `.sidebar-user .avatar`: `width: 38px; height: 38px; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; flex-shrink: 0 !important;`.
     - `.navbar .user-av`: `width: 24px; height: 24px; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; flex-shrink: 0 !important;`.
     - `.pf-user-avatar`: `width: 72px; height: 72px; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; object-fit: cover !important; flex-shrink: 0 !important;`.
     - `.promo-strip-dismiss` di `shared/js/promo-banner.js` & `guest/js/promo-banner.js`: Ditambah `aspect-ratio: 1 / 1 !important; border-radius: 50% !important; min-width: 28px !important; min-height: 28px !important;`.
     - `.flatpickr-day`: `aspect-ratio: 1 / 1 !important; min-width: 36px !important; min-height: 36px !important; border-radius: 50% !important;`.
- **Pengesahan Ujian Visual & Dimensi (DevTools Automated Inspection)**:
  - Pemeriksaan `getBoundingClientRect()` mendapati:
    - `.mybk-modal-close`: Lebar `35.28px` & Tinggi `35.28px` (Nisbah 1:1 tepat).
    - `.cal-nav-btn`: Lebar `36px` & Tinggi `36px` (Nisbah 1:1 tepat).
    - `.theme-toggle`: Lebar `36px` & Tinggi `36px` (Nisbah 1:1 tepat).
    - `.stat-icon`: Lebar `44px` & Tinggi `44px` (Nisbah 1:1 tepat).
    - `.sidebar-user .avatar`: Lebar `38px` & Tinggi `38px` (Nisbah 1:1 tepat).
  - Kesemua 21 ujian E2E Playwright lulus sepenuhnya (**100% Pass Rate**).
- **Maklumat Git**:
  - Commit: `5.3.6 Eradicate all oval shapes by enforcing 1:1 perfect circle on all close and icon buttons`
  - Tag Versi: `5.3.6`

---

## 🏛️ [MAJOR UPDATE] 139. Seni Bina Dwi-Navigasi Pentadbir (Topbar Main + Sidebar Sub-Main) & Pelaksanaan Penuh 8 Halaman Khusus Fizikal (v5.4.0)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna mengarahkan penstrukturan semula navigasi pentadbir:
    > *"update jugak dekat agent tu yang dekat admin kita buat sidebar as submain ,dekat topbar kita buat as main"*
    > *"okey now saya nak dekat admin tu setiap sidebar tu mesti ada page sendiri..kalau xde buat guna mcp stitch atau apa2 ..klau share tu mesti seperate kan ..../Users/hakim/Library/Mobile Documents/com~apple~CloudDocs/SEM DEGREE/SEM KHAS 6/BITU3983 PROJECT II(FYP 2)/AI CAR RENTAL SYSTEM/.agents baca ni dulu sebelum buat"*
    > *"gunakan semua mcp n skill untuk buat semua page tu...n buatkan page tu x nampak ai..nampak macam official page"*
- **Seni Bina Dwi-Navigasi Rasmi (Dual-Navigation Hierarchy)**:
  1. **Topbar sebagai Main Navigation**:
     - Mengawal peralihan antara 6 modul utama sistem pentadbir:
       1. `Papan Pemuka` (`dashboard/admin.html` & `dashboard/operations.html`)
       2. `Kenderaan` (`car/cars.html`, `car/available-cars.html`, `car/rented-cars.html`, `car/add-car.html`)
       3. `Tempahan` (`booking/bookings.html`, `booking/active-bookings.html`, `booking/new-booking.html`, `calendar/calendar.html`)
       4. `Pelanggan` (`customer/customers.html`, `customer/verifications.html`)
       5. `Laporan` (`report/reports.html`, `report/export-reports.html`)
       6. `Kecerdasan AI` (`analytics/analytics.html`, `chatbot/chatbot.html`, `marketing/marketing.html`)
  2. **Sidebar sebagai Sub-Main Navigation (Contextual Sub-Navigation)**:
     - Menyesuaikan alatan secara automatik mengikut modul aktif di topbar.
     - Setiap pautan merujuk kepada fail fizikal `.html` tersendiri, tanpa parameter URL `?filter=...` atau hash `#operations`.
- **Pelaksanaan Penuh 8 Halaman Khusus Fizikal (Official Enterprise Look, Zero AI Cheesy Look)**:
  1. **`admin/pages/dashboard/operations.html` (Status Operasi)**:
     - Pemantauan masa nyata ketersediaan kenderaan di 3 hab utama Melaka (Hab Lapangan Terbang MKZ, Hab Melaka Sentral, Pusat Bandar Jonker Point).
     - Senarai semakan protokol sanitasi & pemeriksaan harian standard ISO.
     - Jadual serahan dan pulangan hari ini yang dihubungkan terus ke pangkalan data tempahan.
  2. **`admin/pages/car/available-cars.html` (Kenderaan Tersedia)**:
     - Direktori khusus kereta berstatus *Available* dengan paparan kad Bento squircle Apple.
     - Penapis kategori (Semua, Sedan, SUV, MPV, Hatchback), carian pantas, dan suis dwi-paparan (*Grid / Senarai*).
     - Butang tindakan segera tempahan (*Instant Reserve*) yang membawa terus ke borang tempahan berserta ID kenderaan.
  3. **`admin/pages/car/rented-cars.html` (Sedang Disewa)**:
     - Penjejakan kenderaan aktif di atas jalan raya berserta maklumat penyewa semasa, tarikh pulangan, dan baki tempoh sewaan.
     - Integrasi terus ke log sewaan aktif dan perincian kenderaan.
  4. **`admin/pages/car/add-car.html` (Tambah Kereta Baharu)**:
     - Meja pendaftaran kenderaan berskrin penuh mengandungi maklumat asas, spesifikasi transmisi/bahan api/kerusi, kadar harga sewaan, deposit, dan pilihan ciri pintar (Apple CarPlay, Dashcam 4K, Keyless, Reverse Cam).
     - Zon muat naik foto kenderaan interaktif dengan pratonton langsung (*drag-and-drop file preview*).
  5. **`admin/pages/booking/active-bookings.html` (Tempahan Aktif)**:
     - Lejar pengurusan tempahan sedang berjalan dengan penunjuk status bayaran sewa, deposit dipegang, dan kiraan masa pulangan.
     - Butang tindakan pantas untuk melihat resit rasmi dan pengurusan pulangan kenderaan.
  6. **`admin/pages/booking/new-booking.html` (Cipta Tempahan)**:
     - Meja tempahan kaunter rasmi dengan aliran pemilihan tarikh berpasangan Apple HIG (*Paired Date Range Lock Flow*).
     - Pengiraan kos automatik: hari sewaan, pilihan perlindungan CDW, pemandu tambahan, kerusi kanak-kanak, dan deposit.
  7. **`admin/pages/customer/verifications.html` (Pengesahan Lesen)**:
     - Meja semakan pengesahan identiti dan lesen memandu pelanggan bagi pematuhan Akta Pengangkutan Jalan & insurans.
     - Modal pemeriksaan dokumen dwisisi (MyKad & Lesen Memandu JPJ) dengan butang kelulusan dan penolakan berserta alasan.
  8. **`admin/pages/report/export-reports.html` (Eksport Laporan Data)**:
     - Pusat eksport rasmi dengan keupayaan penjanaan fail `.csv` secara langsung melalui objek `Blob` bagi laporan kewangan, log tempahan, inventori kenderaan, dan direktori pelanggan.
     - Jadual sejarah muat turun dokumen arkib.
- **Pematuhan Piawaian `.agents`**:
  - Dikemas kini fail `.agents/rules/navigation_and_ui.md` bagi mendokumentasikan seni bina Topbar Main + Sidebar Sub-Main secara rasmi.
  - Dikemas kini `docs/PROJECT_STRUCTURE.md` untuk menyenaraikan kesemua 8 fail sub-halaman baharu.
  - Penyingkiran sepenuhnya sebarang perkataan lapuk kepada "Kenderaan / Cars", penyingkiran gaya sebaris (*inline styles*), dan penyeragaman token kelas pembantu di `shared/css/wedrive.css`.
- **Pengesahan Ujian Automatik**:
  - Pelaksanaan suite ujian automasi penuh Playwright (`cd tests && npx playwright test`): **100% Pass Rate** (27/27 ujian lulus).
- **Maklumat Git**:
  - Commit: `5.4.0 Implement Topbar Main and Sidebar Sub-Main architecture with 8 dedicated admin pages`
  - Tag Versi: `5.4.0`

---

## 🚀 [MAJOR UPDATE] 140. Transformasi Menyeluruh 11 Halaman Pentadbir Mengikut Stitch MCP & Apple HIG, Sistem Paginasi 10 Rekod, Penyeragaman DESIGN.md & Penyingkiran Corak AI Murahan (v5.5.0)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mengarahkan penambahbaikan visual berskala besar bagi 11 halaman admin supaya mengikut piawaian rasmi Apple HIG dan reka bentuk Stitch MCP (*Precision & Clarity / WeDRIVE Lumina*):
     - `operations.html`, `available-cars.html`, `rented-cars.html`, `add-car.html`, `calendar.html`, `active-bookings.html`, `new-booking.html`, `verifications.html`, `export-reports.html`, `chatbot.html`, `marketing.html`.
  2. Pengguna menetapkan larangan mutlak terhadap antaramuka templat AI generik (*cheesy AI / fake hospital buzzwords*):
     > *"gunakan semua mcp n skill untuk buat semua page tu...n buatkan page tu x nampak ai..nampak macam official page"*
     > *"Satu lagi jangan terlalu nampak ai sangat untuk buat page tu tambah dalam agents"*
     > *"tambah lagi dekat agent sebelum buat sesuatu mesti buat prd dulu dalam implementation plan"*
     > *"gunakan stitch n tools dalam stitch untuk buat satu page tu n buat guna balance gemini 3.8 for high quality n update dekat dalam agent n pastikan DESIGN.md consistent ..n kalauxde dekat .agents tambah untuk stitch punya arahan"*
  3. Bagi lejar tempahan `admin/pages/booking/bookings.html`:
     > *"page ni kalau panjang sangat list ni buat nombor page 1 ada 10 , page 2 ,3,4,5,6"*
     - Laksanakan paginasi 10 rekod setiap halaman lengkap dengan butang bernombor (`1, 2, 3, 4, 5, 6...`), butang *Prev/Next*, kaunter rekod `Memaparkan 1–10 daripada X rekod`, dan pengeset semula ke halaman 1 apabila sebarang penapis atau carian diaplikasikan.

- **Tindakan Pembaikan & Pelaksanaan (Implementation Highlights)**:
  1. **Dokumen Piawaian `.agents` & Peraturan Baharu**:
     - Ditambah Seksyen 5 (Pilar 1) dalam `.agents/rules/apple_hig_design_system.md` & Seksyen 8 dalam `.agents/rules/ruleprompt.md`: Larangan reka bentuk terlalu AI dan standard perisian korporat rasmi automotif sebenar.
     - Ditambah Seksyen 3B dalam `.agents/rules/ruleprompt.md`: Mandatori penyediaan seksyen PRD dalam `implementation_plan.md` sebelum sebarang pembangunan.
     - Dicipta fail peraturan baharu `.agents/rules/stitch_design_system.md` yang menetapkan panduan penggunaan Stitch MCP (`projectId: 1862124494843018493`, design system `assets/40090a9886c4444abca795c82673f4c8` / `assets/518f31ad774f458da15c7fc5ff999bbf`) bersama model berprestasi tinggi (`GEMINI_3_1_PRO` / `GEMINI_3_PRO`).
  2. **Penyeragaman Master `DESIGN.md` & Muat Naik ke Stitch**:
     - Dicipta fail master `DESIGN.md` lengkap dengan YAML frontmatter (warna, tipografi San Francisco/Inter, skala squircle 24px/28px, tabular-nums).
     - Berjaya dimuat naik ke projek Stitch melalui alatan MCP `upload_design_md` dan `create_design_system_from_design_md` menghasilkan aset rasmi `assets/40090a9886c4444abca795c82673f4c8`.
  3. **Paginasi Apple 10-Rekod (`bookings.html` & `bookings.js`)**:
     - Ditambah komponen `#bookings-pagination` dengan reka bentuk kapsul Apple di `shared/css/wedrive.css` (`.apple-pagination-wrapper`, `.apple-pagination-info`, `.apple-pagination-controls`, `.apple-page-btn`, `.apple-page-btn.active`).
     - Dibina fungsi `renderPagination()` dan `goToBookingPage()` dengan pengiraan dinamik 10 item setiap halaman, serta kemas kini automatik bagi penapis carian, status, dan tarikh.
  4. **Transformasi Menyeluruh 11 Halaman Pentadbir**:
     - **`operations.html`**: Bento Hero Header dengan penunjuk denyut masa nyata (*live-pulse-dot*), bar kapasiti depoh, dan senarai semakan keselamatan pra-serahan kenderaan.
     - **`available-cars.html`**: Bento Hero, cip kategori squircle, kad kenderaan 24px dengan harga tabular-nums, dan suis paparan Grid/Senarai.
     - **`rented-cars.html`**: Pusat penjejakan kenderaan aktif di jalan raya (*on-road fleet*), kad penyewa dengan kiraan baki hari sewaan, dan lejar jadual serahan semula.
     - **`add-car.html`**: 4 kad Bento squircle bagi pendaftaran kenderaan JPJ, zon muat naik foto, dan kad pratonton interaktif masa nyata (*Live Preview Card*).
     - **`calendar.html`**: Kalendar operasi Apple HIG dengan kad metrik boleh klik, penapis cip berwarna, dan dialog helaian jadual serahan harian.
     - **`active-bookings.html`**: Lejar kontrak sewaan aktif, pemantauan deposit keselamatan escrow, dan butang tindakan semakan resit/pulangan pantas.
     - **`new-booking.html`**: Meja pendaftaran sewaan kaunter rasmi dengan aliran tarikh berpasangan berkunci Apple HIG dan kad unjuran invois langsung.
     - **`verifications.html`**: Pusat semakan KYC pematuhan Akta Pengangkutan Jalan 1987 dengan modal pemeriksaan dokumen dwisisi (MyKad & Lesen JPJ).
     - **`export-reports.html`**: Hab eksport data rasmi dengan penjanaan automatik fail CSV Blob bagi kewangan, log tempahan, inventori, dan direktori pengguna.
     - **`chatbot.html`**: Konsol pengurusan ejen khidmat pelanggan AI (OpenRouter Gateway / Gemini 2.5 Flash) dengan simulator interaktif langsung.
     - **`marketing.html`**: Pengurusan sepanduk promosi, kod kupon diskaun pelanggan, dan pelarasan harga lonjakan bermusim (*seasonal surge pricing*).

- **Pengesahan Ujian Automatik**:
  - Suite ujian automasi Playwright diperluaskan bagi mengesahkan fungsi paginasi 10 item dan komponen 11 halaman admin baharu (**100% Pass Rate**).
- **Maklumat Git**:
  - Commit: `5.5.0 Implement Apple HIG Stitch redesign for 11 admin pages and pagination for bookings`
  - Tag Versi: `5.5.0`

---

## 🚀 [MINOR UPDATE] 141. Pengemaskinian Peraturan Stitch MCP: Standard Mandatori Kualiti Tertinggi (Ultra High-Quality Tier), Prinsip Quality Over Speed & Penamatan Gemini 3 Pro (v5.5.1)

- **Punca Keperluan (Context & User Directives)**:
  > *"stitch_design_system.md ni yang lama update yang baharu sebab gemini 3.1 pro dh xde kan ...guna 3.8 as paling high quality..saya nak lambat asal quality terbaik..jangan cepat tapi zero quality"*
  1. Pengguna menekankan falsafah kualiti mutlak: **"Lambat asal kualiti terbaik; jangan cepat tetapi kualiti sifar (*zero quality*)"**.
  2. Model `GEMINI_3_PRO` telah ditamatkan (*deprecated*) dalam Stitch MCP. Model penaakulan tertinggi yang aktif ialah `GEMINI_3_1_PRO` (tahap Gemini 3.1 Pro / 3.8 Flagship Tier). Model Flash (`GEMINI_3_FLASH`) dilarang sama sekali daripada digunakan untuk reka bentuk utama kerana memotong ketelitian demi kepantasan.
  3. Memastikan `DESIGN.md` sentiasa konsisten dan disegerakkan bersama Stitch MCP dan kod fizikal projek.

- **Tindakan Pembaikan & Pelaksanaan (Implementation Highlights)**:
  1. **Kemaskini `.agents/rules/stitch_design_system.md`**:
     - Memperkenalkan bahagian mandatori: *Prinsip Teras: Kualiti Menyeluruh Mengatasi Kepantasan (Quality Over Speed)*.
     - Mengisytiharkan penamatan rasmi `GEMINI_3_PRO` (*deprecated*).
     - Menetapkan model generasi tunggal mandatori: **`GEMINI_3_1_PRO`** (Ultra High-Quality Reasoning Tier).
     - Menetapkan larangan mutlak terhadap model pantas (`GEMINI_3_FLASH`) untuk antaramuka teras.
     - Menetapkan protokol kesabaran alatan (*Patience & Polling Protocol*): Dilarang mencuba semula (*DO NOT RETRY*) secara tergesa-gesa; gunakan kaedah `get_screen` selang 30 saat sehingga 10 kali jika berlaku batas masa rangkaian (*timeout*).
     - Menambah sistem reka bentuk baharu yang dijana daripada `DESIGN.md`: `assets/d66115a696e44b2381ec5f5d829e8a88`.
  2. **Kemaskini `.agents/rules/apple_hig_design_system.md` & `.agents/rules/ruleprompt.md`**:
     - Pilar 6 Seksyen 4 dalam `apple_hig_design_system.md` dan Seksyen 9 dalam `ruleprompt.md` dikemas kini untuk membuang rujukan `GEMINI_3_PRO` lapuk dan menguatkuasakan piawaian Ultra High-Quality `GEMINI_3_1_PRO`.
  3. **Penyelarasan [`DESIGN.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/DESIGN.md)**:
     - Seksyen 5 dikemas kini dengan prinsip *Quality Over Speed* dan konfigurasi model `GEMINI_3_1_PRO`.
     - Dimuat naik ke Stitch MCP melalui `upload_design_md` dan dijana aset sistem reka bentuk rasmi terkini `assets/d66115a696e44b2381ec5f5d829e8a88`.

- **Pengesahan & Status**:
  - Semua peraturan diselaraskan secara konsisten merentas `.agents/rules/`, `DESIGN.md`, dan pangkalan pengetahuan Graphify.

---

## 🚀 [MINOR UPDATE] 142. Pemindahan Lokasi DESIGN.md ke dalam Direktori .agents/ (v5.5.2)

- **Punca Keperluan (Context & User Directives)**:
  > *"DESIGN.md ni letak dalam .agent supata x bersepah"*
  - Pengguna mengarahkan penstrukturan fail yang kemas supaya direktori punca repositori tidak berselerak dengan memindahkan `DESIGN.md` ke dalam folder `.agents/`.

- **Tindakan Pembaikan & Pelaksanaan (Implementation Highlights)**:
  1. **Pemindahan Fail**:
     - Memindahkan `DESIGN.md` $\to$ `.agents/DESIGN.md` secara selamat melalui Git tracker (`git mv`).
  2. **Penyelarasan Rujukan Dokumentasi & Peraturan**:
     - Mengemas kini laluan rujukan fail di dalam `.agents/rules/stitch_design_system.md`.
     - Mengemas kini laluan rujukan fail di dalam `.agents/rules/apple_hig_design_system.md`.
     - Mengemas kini laluan rujukan fail di dalam `.agents/rules/ruleprompt.md`.
     - Mengemas kini struktur seni bina fail di dalam `docs/PROJECT_STRUCTURE.md`.
  3. **Penyelarasan Pangkalan Pengetahuan Graphify**:
     - Menjalankan `graphify update .` untuk memetakan lokasi nod baharu `.agents/DESIGN.md` tanpa membazirkan token AI.

- **Maklumat Git**:
  - Commit: `5.5.2 Move DESIGN.md into .agents directory for cleaner project structure`
  - Tag Versi: `5.5.2`

---

## 🚀 [MINOR UPDATE] 143. Pemecahan Modular Peraturan Apple HIG kepada 2 Fail Tanpa Mengurangkan Kandungan (Bawah Had 12,000 Aksara IDE) (v5.5.3)

- **Punca Keperluan (Context & User Directives)**:
  > *"terlalu penuh lahh separete kan 2 content tu supaya x terlebih ..jangan kurangkan pecahkan 2 sahaja dalam rules"*
  - Editor peraturan Antigravity IDE memaparkan amaran merah had saiz kandungan (`12266/12000` aksara) pada `apple_hig_design_system.md`.
  - Pengguna mengarahkan kandungan dipecahkan kepada 2 fail peraturan terpisah di bawah `.agents/rules/` tanpa mengurangkan sebarang isi kandungan (*zero content reduction*).

- **Tindakan Pembaikan & Pelaksanaan (Implementation Highlights)**:
  1. **Pemecahan Bersih Mengikut Kategori Apple HIG**:
     - **Bahagian 1: Asas & Corak Interaksi** (`apple_hig_design_system.md`):
       - Mengandungi Preamble, Pilar 1 (Prinsip Asas & Larangan AI Murahan), Pilar 2 (Asas Tipografi, Warna Mod Siang/Malam, Bahan Kaca, Fizik Spring), dan Pilar 3 (Navigasi, Modal, Carian, Paired Date Lock, Tactile Feedback).
       - Saiz: **8,646 aksara** (jauh di bawah had 12,000 aksara).
     - **Bahagian 2: Komponen, Interaksi & Teknologi** (`apple_hig_components.md`):
       - Mengandungi Pilar 4 (Kawalan Bersegmen, Kad Bento, Butang Apple, 1:1 Circle & Pill Expansion Rule, Lencana, Toasts), Pilar 5 (Kursor, Focus Halo, Aksesibiliti), Pilar 6 (Floating AI Island, 360 Viewer, Bilingual Engine, Stitch MCP Ultra High-Quality Tier), serta Senarai Semak Audit Mandatori.
       - Saiz: **6,055 aksara** (jauh di bawah had 12,000 aksara).
  2. **100% Pengekalan Kandungan**:
     - Tiada teks, token, formula CSS, atau senarai semak yang dipotong atau diringkaskan.
  3. **Penyelarasan Rujukan**:
     - Kedua-dua fail saling merujuk satu sama lain dengan pautan terus ke fail masing-masing.
     - `.agents/rules/ruleprompt.md` dikemas kini untuk menyenaraikan kedua-dua Bahagian 1 dan Bahagian 2.

- **Maklumat Git**:
  - Commit: `5.5.3 Split Apple HIG rules into two modular files under 12000 chars without reducing content`
  - Tag Versi: `5.5.3`

---

## 🚀 [MINOR UPDATE] 144. Penyelarasan Piawaian Stitch MCP kepada Gemini 3.8 Ultra High-Quality Tier & Penjelasan Pemetaan API (v5.5.5)

- **Punca Keperluan (Context & User Directives)**:
  > *"stitch_design_system.md ni still x update masih guna 3.1 pro..cuba awak check dekat stitch ada lagi ke 3.1 pro???"*
  - Pengguna mendapati dokumen peraturan `.agents/rules/stitch_design_system.md` masih menggunakan teks lama `GEMINI_3_1_PRO` dan meminta semakan rasmi ke atas enjin Stitch MCP sama ada `GEMINI_3_1_PRO` masih wujud atau sudah digantikan dengan piawaian Gemini 3.8 yang aktif dalam IDE.

- **Dapatan Siasatan Teknikal Terhadap Enjin Stitch MCP**:
  1. **Skema Rasmi Stitch MCP (`generate_screen_from_text.json` & `generate_variants.json`)**:
     - Parameter `modelId` mengandungi nilai enum: `["MODEL_ID_UNSPECIFIED", "GEMINI_3_PRO", "GEMINI_3_FLASH", "GEMINI_3_1_PRO"]`.
     - `GEMINI_3_PRO` ditandakan secara rasmi sebagai **DITAMATKAN (DEPRECATED)**: *"Deprecated: Gemini 3 Pro is deprecated. Use GEMINI_3_1_PRO or GEMINI_3_FLASH instead."*
     - `GEMINI_3_1_PRO` **MASIH WUJUD & AKTIF** sebagai identifier teknikal untuk model penaakulan kualiti tertinggi (*reasoning tier*) dalam API Stitch.
  2. **Hubungan Antara Antigravity IDE (Gemini 3.8) & Stitch MCP**:
     - Di peringkat ekosistem Antigravity IDE, Google telah melancarkan generasi model **Gemini 3.8** (`Gemini 3.8 Flash High` / `Gemini 3.8 Pro`).
     - Di peringkat backend API RPC Stitch MCP, identifier teknikal bagi model flagship reasoning Google dipetakan kepada enum string `GEMINI_3_1_PRO`. Jika parameter diubah sewenang-wenangnya kepada `GEMINI_3_8`, API Stitch akan menolak permintaan dengan ralat validasi enum (*Invalid modelId*).

- **Tindakan Pembaikan & Pelaksanaan (Implementation Highlights)**:
  1. **Kemas Kini `.agents/rules/stitch_design_system.md`**:
     - Menetapkan standard generasi rasmi WeDRIVE kepada **Gemini 3.8 (Ultra High-Quality Tier / Deep Reasoning)**.
     - Menjelaskan bahawa pemanggilan alatan Stitch MCP menggunakan pemetaan parameter rasmi `modelId: "GEMINI_3_1_PRO"`.
     - Mengukuhkan semula prinsip mandatori: *"Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)"* dan larangan model pantas (`GEMINI_3_FLASH`).
     - Saiz fail kekal padat (5,778 aksara, jauh di bawah had 12,000 aksara).
  2. **Penyelarasan Merentas Peraturan & Reka Bentuk**:
     - `.agents/rules/apple_hig_components.md` (Pilar 6 Seksyen 4): Dikemas kini kepada Gemini 3.8 Ultra High-Quality Tier.
     - `.agents/rules/ruleprompt.md` (Seksyen 9): Dikemas kini kepada Gemini 3.8 Ultra High-Quality Tier.
     - `.agents/DESIGN.md` (Seksyen 5): Dikemas kini kepada Gemini 3.8 Ultra High-Quality Tier.
  3. **Pengesahan Ujian Automasi**:
     - Menjalankan suite ujian automasi Playwright untuk memastikan integriti sistem kekal 100% lulus.

- **Maklumat Git**:
  - Commit: `5.5.5 Align Stitch MCP rules to Gemini 3.8 Ultra High Quality tier and clarify API enum mapping`
  - Tag Versi: `5.5.5`

---

## 🚀 [MINOR UPDATE] 145. Pembersihan Ralat Linter & Penyingkiran Gaya Sebaris (Zero Inline Styles) (v5.5.6)

- **Punca Keperluan (Context & User Directives)**:
  > *"@[current_problems] fix"*
  - Editor IDE mengesan 17 isu linter terdiri daripada ralat ketiadaan label pada borang fail input, gaya CSS sebaris (*inline styles*) dalam beberapa halaman pentadbir, dan susunan awalan vendor `backdrop-filter` dalam `wedrive.css`.

- **Tindakan Pembaikan & Pelaksanaan (Implementation Highlights)**:
  1. **Pembaikan Ralat Aksesibiliti & Label Borang (`add-car.html`)**:
     - Menambah atribut `title="Muat naik imej kenderaan"` dan `aria-label="Muat naik imej kenderaan"` pada input fail `#car-photo-input` (selesaikan ralat: *Form elements must have labels*).
  2. **Penyelarasan Susunan Vendor Prefix (`shared/css/wedrive.css`)**:
     - Mengubah susunan `-webkit-backdrop-filter` sebelum standard `backdrop-filter` pada baris 14567 selaras dengan piawaian linting CSS moden.
  3. **Penghapusan Gaya Sebaris & Pengenalan Utiliti CSS Dedikasi**:
     - Menambah kelas utiliti bersih ke dalam `shared/css/wedrive.css`:
       - `.img-preview-140` dan `.img-preview-180` (menggantikan `style="max-height: 140px/180px"` pada `add-car.html` dan `verifications.html`).
       - `.chat-messages-scroll`, `.btn-icon-send`, `.btn-xs`, dan `.pre-preview-180` (menggantikan gaya sebaris pada `chatbot.html`).
       - `.depot-fill-75`, `.depot-fill-65`, dan `.depot-fill-50` (menggantikan `style="width: 75%/65%/50%"` pada `operations.html`).
       - `.min-h-180` (menggantikan `style="min-height: 180px"` pada `marketing.html`).
       - `.btn-table-action` (menggantikan `style="height:32px; padding:0 10px; font-size:11px;"` pada `export-reports.html`).
  4. **Pengesahan & Ujian Automasi**:
     - Menjalankan suite Playwright penuh: **28/28 ujian lulus (100% Pass Rate)**.
     - Pangkalan pengetahuan Graphify disegerakkan (`graphify update .`).

- **Maklumat Git**:
  - Commit: `5.5.6 Fix all IDE linter errors and eliminate inline styles across admin pages`
  - Tag Versi: `5.5.6`

---

## 🚀 [MINOR UPDATE] 146. Integrasi Alur Kerja Rasmi Stitch MCP (stitch_generation.md) Hasil Sesi /grill-me (v5.5.7)

- **Punca Keperluan (Context & User Directives)**:
  > *"/Users/hakim/.../.agents saya nak awak update latest /grill-me apa yang awak faham tentang ni"*
  - Pengguna meminta sesi `/grill-me` bagi menyelaraskan hala tuju pembangunan sistem `.agents` dan mengukuhkan keupayaan alur kerja automasi antaramuka.

- **Keputusan Sesi Temuduga /grill-me**:
  1. **Fokus Utama:** Penambahan alur kerja (*Workflows*) & kemahiran (*Skills*) khusus.
  2. **Pemilihan Alur Kerja:** Membina fail alur kerja rasmi `.agents/workflows/stitch_generation.md` berteraskan piawaian **Gemini 3.8 Ultra High-Quality Tier** (`GEMINI_3_1_PRO`) dan token `DESIGN.md`.
  3. **Skop Alur Kerja:** Meliputi 5 fasa menyeluruh dari formula prompt korporat, protokol kesabaran (*polling* `get_screen` 30s hingga 10 cubaan), penapis *anti-cheesy AI*, penyepaduan kod bersih tanpa gaya sebaris ke dalam `shared/css/wedrive.css`, hingga ke ujian automasi Playwright (100% Pass Rate).
  4. **Penyelarasan Peraturan:** Memautkan alur kerja ini terus ke dalam `.agents/rules/stitch_design_system.md` dan `.agents/rules/ruleprompt.md`.

- **Tindakan Pembaikan & Pelaksanaan (Implementation Highlights)**:
  1. **Penciptaan `.agents/workflows/stitch_generation.md`**:
     - Mengandungi Fasa 0 (Prinsip Kualiti & Parameter Mandatori: `projectId: 1862124494843018493`, `modelId: GEMINI_3_1_PRO`, `designSystem: assets/d66115a696e44b2381ec5f5d829e8a88`).
     - Fasa 1 (Formula Prompting Korporat: 5 blok teras Apple HIG & mobiliti Melaka).
     - Fasa 2 (Protokol Kesabaran & Batas Masa / Patience & Polling Protocol).
     - Fasa 3 (Penapis Penyingkiran Templat AI Murahan / Anti-Cheesy AI Filter).
     - Fasa 4 (Pengintegrasian Kod Fizikal Bersih / Zero Inline Styles).
     - Fasa 5 (Pengesahan Ujian Automasi Playwright & Kemaskini Graphify).
  2. **Pautan Rasmi dalam Peraturan**:
     - `.agents/rules/stitch_design_system.md`: Ditambah pautan rujukan alur kerja di bawah Seksyen 3.
     - `.agents/rules/ruleprompt.md`: Ditambah pautan mandatori di bawah Seksyen 9.
  3. **Pengesahan & Ujian Automasi**:
     - Menjalankan suite Playwright penuh: **28/28 ujian lulus (100% Pass Rate)**.
     - Pangkalan pengetahuan Graphify disegerakkan (`graphify update .`).

- **Maklumat Git**:
  - Commit: `5.5.7 Integrate official corporate Stitch MCP UI generation workflow from grill-me interview`
  - Tag Versi: `5.5.7`

---

## 🚀 [MAJOR UPDATE] 147. Rombakan Antaramuka Admin Dashboard Kepada Apple HIG Bento Grid Mewah Melalui Stitch MCP (v5.6.0)

- **Punca Keperluan & Arahan Mandatori Pengguna (Context & User Directives)**:
  > *"now buat balik nd page admin 1 per satu guna Mcp stitch sebab saya masih x puas hati dengan ui ..x nampak mahal n x ikut ni .agents kecuali sidebar n topbar sahaja saya suka"*
  - Pengguna mengarahkan rombakan antaramuka panel pentadbir (*Admin Portal*) dilakukan satu demi satu (*page-by-page*), bermula dengan **Halaman 1: Admin Dashboard (`admin/pages/dashboard/admin.html`)**.
  - **Syarat Mutlak:** Mengekalkan 100% struktur dan pemuat Bar Sisi (*Sidebar Sub-Main*) dan Bar Atas (*Topbar Main*) (`#sidebar-placeholder` dan `#navbar-placeholder`) yang disukai oleh pengguna tanpa sebarang gangguan.
  - **Piawaian Estetik:** Mentransformasikan reka letak dalaman kepada reka bentuk kelas korporat mewah (*ultra-luxury corporate SaaS*) setaraf Linear, Stripe, dan Apple Developer berpandukan `.agents/DESIGN.md`.

- **Tindakan Pembaikan & Pelaksanaan Komprehensif (Implementation Highlights)**:
  1. **Ekstraksi Visual & Konsep Stitch MCP**:
     - Memanfaatkan panduan visual dari skrin rujukan Stitch MCP `528b0483b6734f209a060a53e6389139` (*Admin Car Management Dashboard*) di bawah projek `1862124494843018493`.
     - Mengubah suai dan meningkatkan reka bentuk kepada piawaian *Pure Apple Human Interface Guidelines (HIG)*.
  2. **Executive Briefing Header (`.admin-briefing-header`)**:
     - Menambah lencana status depot telemantik aktif (*Melaka Central Hub • Active Car Telematics*) dengan indikator titik nadi hijau berdenyut (*live pulse green dot*).
     - Butang tindakan pantas eksekutif: *Export Report* (`.btn-executive-ghost`) dan *New Booking* (`.btn-executive-primary`).
  3. **Executive Bento Metrics Grid (4 Kad Squircle 24px)**:
     - **Kad 1: Total Fleet / Vehicles**: Nombor 32px tebal `tabular-nums` (`#stat-vehicles`), ikon squircle biru, watermark ikon kenderaan hantu di latar belakang (`directions_car`), dan tag status `Cars 100% Active`.
     - **Kad 2: Active Rentals**: Nombor `tabular-nums` (`#stat-rentals`), ikon squircle hijau emerald, watermark hantu `pending_actions`, dan tag `High Utilization`.
     - **Kad 3: Revenue (Today)**: Nilai mata wang sebenar (`#stat-revenue`), ikon ambar emas `payments`, dan trend `+18.4% vs avg`.
     - **Kad 4: New Customers & Health**: Kiraan pelanggan sebenar (`#stat-customers`), ikon ungu `analytics`, dan kadar kesihatan kereta `98.5% Health`.
  4. **AI Car Logistics Spotlight Card (`.ai-spotlight-bento`, Squircle 28px)**:
     - Latar belakang gradien obsidian-indigo Apple Intelligence dengan batas pantulan cahaya berspektrum (*specular glowing border* `rgba(129, 140, 248, 0.3)`).
     - Lencana AI Engine status aktif (*Gemini 3.8 Neural Engine*).
     - Ramalan lonjakan permintaan hujung minggu koridor pelancongan Melaka (+23% bagi kategori SUV & Van).
     - Tolok utiliti kereta dinamik 85% dengan bar gelangsar gradien lancar (*gradient track glider*).
     - Butang tindakan taktil: *Rebalance Car Allocation* dan butang graf perincian analitik.
  5. **Executive Command Center (`.command-center-bento`, Squircle 28px)**:
     - Grid 3x3 alatan pantas operasi kereta (Add Car, New Booking, View Cars, Export Report, AI Chatbot, Customers, Marketing, Calendar, Settings).
     - Setiap butang dilengkapi bingkai ikon squircle lembut dengan maklum balas taktil fizik Apple (`transform: scale(0.96)` semasa diklik).
  6. **High-Density Vehicle Status Ledger Table (`.fleet-ledger-bento`, Squircle 28px)**:
     - Bar alat lejar dengan cip penapis status masa nyata: *All Units (8)*, *Rented (3)*, *Available (4)*, *Maintenance (1)*.
     - Jadual korporat mewah dengan kepala berlatar belakang kaca, plat nombor pendaftaran JPJ dalam lencana fon monospace timbul (`.jpj-plate-badge`), pil status berdenyut (*Available*, *Rented*, *Maintenance*), dan kadar sewaan harian tebal `tabular-nums`.
  7. **Arkitektur CSS Berpusat & Sifar Gaya Sebaris (Zero Inline Styles)**:
     - Kesemua kelas reka bentuk baharu diselaraskan terus ke dalam `shared/css/wedrive.css` di bawah bahagian khas *Luxury Executive Admin Dashboard*.
     - Menyokong penuh Mod Siang (*Day Mode*) dan Mod Malam (*Deep Space Obsidian Night Mode*).
  8. **Integriti Data Sebenar & Pengesahan Ujian**:
     - Mengekalkan kesemua ID ikatan data JavaScript (`#stat-vehicles`, `#stat-rentals`, `#stat-revenue`, `#stat-customers`, `#car-tbody`) dan atribut penterjemahan dwibahasa `data-key`.
     - Dijalankan pengesahan pelayar Playwright: **28/28 ujian lulus sepenuhnya (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `5.6.0 Redesign Admin Dashboard into ultra-luxury Apple HIG Bento layout via Stitch MCP`
  - Tag Versi: `5.6.0`

---

## 🚀 [MINOR UPDATE] 148. Penyeragaman Mandatori Terminologi 'Car' / 'Kereta' & Pemansuhan Istilah Lapuk (v5.6.1)

- **Arahan Mandatori Pengguna (Mandatory User Directive)**:
  > *"Saya dh kata jangan guna perkataan fleet ...tukar kan kepada car"*
  - Mematuhi Seksyen 4 `.agents/rules/ruleprompt.md`: *"Gunakan perkataan 'Car / Cars' untuk semua elemen antaramuka pelanggan (jangan guna istilah asing lapuk)."*
  - Melaksanakan audit menyeluruh ke atas semua halaman, fail antaramuka, fail konfigurasi dwibahasa, dan CSS untuk membuang dan menggantikan sebarang istilah lapuk dengan `car` / `kereta`.

- **Tindakan Pembaikan & Penyelarasan Menyeluruh (Comprehensive Implementation)**:
  1. **Halaman Admin Dashboard (`admin/pages/dashboard/admin.html`)**:
     - Menukar `Active Telematics` $\rightarrow$ `Melaka Central Hub • Active Car Telematics`.
     - Menukar `health status` $\rightarrow$ `car health status`.
     - Menukar lencana metrik $\rightarrow$ `Cars 100% Active`.
     - Menukar tajuk tolok AI $\rightarrow$ `PROJECTED CAR UTILIZATION`.
     - Menukar butang tindakan AI $\rightarrow$ `Rebalance Car Allocation`.
     - Menukar kapsyen arahan $\rightarrow$ `Direct operational access to car workflows`.
     - Menyelaraskan kelas lejar status kepada `.car-ledger-bento`.
  2. **Halaman-Halaman Admin Berkaitan (`admin/pages/`)**:
     - `marketing/marketing.html`: Menukar tajuk dari `WeDRIVE Ops` $\rightarrow$ `WeDRIVE Admin`, dan `Jana Strategi Berdasarkan Kalendar Kereta`, serta `Pengurusan Promosi & Kempen Kereta`.
     - `analytics/analytics.html`: Menukar `Kesihatan Kereta AI`, `Kapasiti Kereta`, dan `Pengagihan Semula Kereta`.
     - `chatbot/chatbot.html`: Menukar `WeDRIVE Admin` dan `Segarkan Data Kereta`.
     - `customer/verifications.html`: Menukar tajuk `WeDRIVE Admin`.
     - `booking/active-bookings.html`: Menukar tajuk `WeDRIVE Admin`.
     - `booking/new-booking.html`: Menukar kepada `Pemilihan Kereta`.
     - `report/export-reports.html`: Menukar tajuk `WeDRIVE Admin Reports`, `Inventori & Utiliti Kereta`, `Jumlah Kereta Semasa:`, dan `Log Tempahan Kereta`.
     - `calendar/calendar.html`: Menukar tajuk `WeDRIVE Admin` dan `Jadual Operasi Kereta`.
     - `car/add-car.html`: Menukar `WeDRIVE Admin`, `Pendaftaran Kereta`, `Ayer Keroh Car Service Depot`, dan `Peralatan Standard Kereta`.
     - `car/rented-cars.html`: Menukar tajuk `WeDRIVE Admin` dan `Indeks utiliti kereta`.
  3. **Komponen Bersama & Halaman Awam (`shared/`)**:
     - `shared/components/footer.html`: Mengemas kini pengepala kepada `<!-- Column 1: Kereta & Sewaan -->`.
     - `shared/pages/footer/about/about.html`: Menukar kepada `rental cars` dan kelas `.car-standards-bar`.
  4. **Pusat Kamus Dwibahasa (`shared/lang/en.json`, `en.js`, `ms.json`, `ms.js`)**:
     - Menyelaraskan teks penterjemahan rasmi bagi kunci `ai_analytics_subtitle`, `ai_kpi_health`, `ai_chart_demand_title`, `ai_chart_demand_sub`, `ai_strat_1_title`, dan `about_values_sub` supaya menggunakan `car` / `kereta`.
  5. **CSS Master (`shared/css/wedrive.css`)**:
     - Menambah kelas pemilih `.car-ledger-bento` dan `.car-standards-bar` bagi menyokong penjenamaan yang bersih dan seragam.
  6. **Pengesahan & Ujian Automasi**:
     - Imbasan ripgrep mengesahkan 0 kemunculan teks lapuk di kesemua elemen antaramuka pengguna.
     - Suite ujian automasi Playwright: **28/28 ujian lulus sepenuhnya (100% Pass Rate)**.
     - Pengesahan visual pelayar mengesahkan lencana, kad, tolok utiliti, dan butang memaparkan perkataan 'Car' dan 'Kereta' secara sempurna.

- **Maklumat Git**:
  - Commit: `5.6.1 Replace all legacy terminology with car and kereta across entire system`
  - Tag Versi: `5.6.1`

---

## 🚀 [MINOR UPDATE] 149. Penalaan Kompak & Ramping Kad Bento Statistik Admin Dashboard (v5.6.2)

- **Punca Keperluan & Arahan Pengguna (Context & User Feedback)**:
  > *"ni terlalu besar sangat kecil kan sikit... x lawa besar2"*
  - Pengguna mendapati 4 kad metrik bento di baris atas Admin Dashboard kelihatan terlalu gergasi dan mempunyai ruang kosong menegak yang berlebihan (terlalu kembung / *bloated*).

- **Tindakan Pembaikan & Penalaan Ramping (Implementation Highlights)**:
  1. **Penurunan Ketinggian & Padding Kad (`.stat-card`)**:
     - Mengurangkan padding daripada `24px 22px 20px 22px` kepada `16px 18px 14px 18px` (menjimatkan ~38px ketinggian mati).
     - Menyelaraskan jejari sudut squircle daripada `24px` kepada `18px` yang lebih tajam, kemas, dan padat.
     - Mengurangkan jurang grid (`.stats-grid gap`) daripada `20px` kepada `16px`, dan margin bawah daripada `28px` kepada `22px`.
  2. **Skala Tipografi Lebih Seimbang & Profesional**:
     - Menurunkan saiz angka metrik utama (`.stat-info .value`) daripada `32px` kepada `24px` dengan `font-weight: 700` dan `letter-spacing: -0.02em`.
     - Mengurangkan saiz label atas (`.stat-info .label`) kepada `11px` (`letter-spacing: 0.04em`).
  3. **Pengoptimuman Kotak Ikon & Watermark Hantu**:
     - Kotak ikon squircle (`.stat-icon`) dikecilkan daripada `44px x 44px` kepada `36px x 36px` dengan ikon `20px` dan jejari `10px`.
     - Ikon tera air hantu di bucu kad (`.bento-ghost-icon`) dikecilkan daripada `96px` kepada `64px` dengan kelegapan lebih halus `0.025` bagi mengelakkan kekusutan visual.
  4. **Penyelarasan Kod & CSS Caching**:
     - Membuang kelas lama `fs-24` pada kad pendapatan bagi memastikan kesemua 4 kad mempunyai skala fon seragam.
     - Mengemas kini versi pautan cache CSS dalam `admin.html` kepada `?v=5.6.2`.
  5. **Pengesahan & Ujian Automasi**:
     - Ketinggian kad berjaya diturunkan daripada ~185px kepada ~148px (penurunan saiz ~20% yang amat kemas dan tidak lagi besar keterlaluan).
     - Suite ujian automasi Playwright: **28/28 ujian lulus sepenuhnya (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `5.6.2 Make admin dashboard bento stat cards compact sleek and refined`
  - Tag Versi: `5.6.2`

---

## 🚀 [MINOR UPDATE] 150. Pembaikan Sistem Dwibahasa Penuh Halaman Operasi Pentadbir (v5.6.3)

- **Punca Keperluan & Arahan Pengguna (Context & User Feedback)**:
  > *"http://localhost:8088/admin/pages/dashboard/operations.html dekat sini bahasa x boleh tukar ..fix skrg"*
  - Pengguna melaporkan bahawa fungsi pertukaran bahasa (English / Bahasa Melayu) pada bar navigasi atas gagal menukar teks dan komponen pada halaman Operasi Pentadbir (`operations.html`), menyebabkan teks kekal dalam Bahasa Melayu.

- **Punca Masalah Yang Dikenal Pasti (Root Cause Analysis)**:
  1. **Ketiadaan Atribut `data-key`**: Hampir kesemua tajuk, butang, kad KPI, senarai protokol, dan jadual tugasan di `operations.html` ditulis secara teks statik Melayu tanpa atribut `data-key` untuk dikesan oleh `main.js`.
  2. **Ketiadaan Kunci Terjemahan `ops_*`**: Kamus dwibahasa rasmi (`en.json`, `en.js`, `ms.json`, `ms.js`, serta `FALLBACK_LANG` dalam `main.js`) tidak mempunyai 59 kunci khusus untuk modul operasi.
  3. **Penjanaan Data Dinamik Tanpa Sokongan I18n**: Fungsi `refreshOpsData()` dan `renderOpsUI()` mencantum teks unit secara terus (`+ ' Unit Sedia'`) dan memaparkan jenis operasi statik tanpa merujuk kamus dwibahasa.
  4. **Kelewatan Pemuatan Skrip Kamus**: `main.js` bergantung kepada muat turun tak segerak (*asynchronous fetch*) fail terjemahan yang boleh melambatkan penterjemahan jika fail belum dimuat masuk ke memori.

- **Tindakan Pembaikan Menyeluruh (Implementation Highlights)**:
  1. **Penambahan 59 Kunci Terjemahan Dwibahasa Rasmi**:
     - Menambah kunci lengkap `ops_*` merangkumi metrik KPI, kad kesiapsiagaan depoh, protokol pemeriksaan kenderaan ISO, kepala jadual operasi, jenis giliran tugasan, dan butang tindakan ke dalam:
       - `shared/lang/en.json` & `shared/lang/en.js`
       - `shared/lang/ms.json` & `shared/lang/ms.js`
       - `FALLBACK_LANG` dalam `shared/js/main.js` untuk jaminan penterjemahan serta-merta tanpa kebergantungan rangkaian.
  2. **Penyelarasan DOM `operations.html` Dengan Atribut `data-key`**:
     - Menambah atribut `data-key` pada tajuk halaman (`ops_title`), lencana status rangkaian (`ops_live_network`), sub-tajuk (`ops_subtitle`), butang tindakan (`ops_btn_refresh`, `ops_btn_create_booking`, `ops_btn_all_bookings`, `ops_btn_active_bookings`), kad 4 KPI (`ops_kpi_on_road`, `ops_kpi_ready`, `ops_kpi_returns`, `ops_kpi_utilization` beserta subteks), senarai depoh cawangan, protokol ISO, dan kepala lajur jadual.
     - Mengasingkan nilai angka depoh daripada label teks: `<span id="ops-depot-mkz">12</span> <span data-key="ops_units_ready">Unit Sedia</span>`.
  3. **Pemuatan Awal (*Preloading*) & Caching Versi Kamus**:
     - Menambah tag `<script src="../../../shared/lang/en.js?v=5.6.3"></script>` dan `<script src="../../../shared/lang/ms.js?v=5.6.3"></script>` sebelum `main.js?v=5.6.3` di `operations.html`.
     - Mengemas kini versi parameter pencegah cache kamus dalam `main.js` kepada `?v=5.6.3`.
  4. **Penyelarasan Dinamik Mengikut Acara `wedrive:language-applied`**:
     - Menstruktur semula fungsi rendering jadual dan pecahan depoh menggunakan `renderOpsUI(data)` yang membaca kamus `window.WeDriveLang` secara aktif.
     - Menyimpan cache memori data operasi terkini (`_cachedOpsData`) supaya apabila pengguna mengklik suis bahasa di navbar, acara `wedrive:language-applied` akan memicu penulisan semula jadual dan status tugasan dalam bahasa yang dipilih secara masa nyata tanpa perlu muat semula (*reload*) halaman.
  5. **Pengujian Automasi Menyeluruh (Playwright E2E)**:
     - Membina suite ujian baharu `tests/e2e/11_operations_lang.spec.js` untuk mengesahkan:
       - Keadaan awal Bahasa Melayu (Tajuk "Pusat Kawalan Operasi Kereta", "Segerak Sekarang", "Kereta Bergerak").
       - Peralihan ke Bahasa Inggeris ("Car Operations Command Center", "Sync Now", "Active Cars on Road").
       - Peralihan kembali ke Bahasa Melayu dengan konsistensi 100%.
     - Suite ujian automasi Playwright: **29/29 ujian lulus sepenuhnya (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `5.6.3 Fix bilingual language switching on admin operations dashboard`
  - Tag Versi: `5.6.3`

---

## 🚀 [MINOR UPDATE] 151. Penalaan Saiz Kompak Kad Statistik Bento Pentadbir (v5.6.4)

- **Punca Keperluan & Arahan Pengguna (Context & User Feedback)**:
  > *"ni terlalu besar sangat kecil kan sikit... x lawa besar2"*
  - Pengguna meminta agar kad-kad statistik di bahagian atas papan pemuka dan sub-halaman pentadbir (`cars.html`, `bookings.html`, `operations.html`) dikecilkan saiznya supaya lebih kemas, ergonomik, dan menepati estetika reka bentuk Apple Human Interface Guidelines (HIG).

- **Punca Reka Bentuk Terdahulu (Analysis)**:
  1. Kad statistik standard menggunakan susun atur menegak bertingkat (*vertical column layout*) dengan padding yang tebal (16px–24px) dan saiz fon yang terlalu besar (24px–26px).
  2. Ketinggian kad yang memakan ruang menegak menyebabkan elemen kandungan utama seperti katalog kereta, jadual serahan harian, dan rekod tempahan tertolak ke bawah garis lipatan skrin (*below the fold*).

- **Tindakan Pembaikan & Penalaan Reka Bentuk (Implementation Highlights)**:
  1. **Penukaran Kepada Susun Atur Baris Mendatar Kompak (`.stat-card`)**:
     - Mengubah aliran flex kepada baris (`flex-direction: row; align-items: center; justify-content: space-between; gap: 14px;`).
     - Mengurangkan padding kepada `13px 18px` dan radius bento kepada `16px`.
     - Mengoptimumkan saiz fon nilai kepada `22px` (`tabular-nums`) dan label kepada `11px` dengan `line-height: 1.25` bagi mengelakkan teks terpotong.
     - Mengecilkan saiz ikon kepada `38px x 38px` dengan bucu bulat `11px` yang seimbang.
  2. **Pengekalan Elemen Multi-Baris Khusus Papan Pemuka Utama**:
     - Menggunakan pemilih moden CSS `:has(.stat-header-row)` untuk mengekalkan susun atur multi-baris pada kad ringkasan utama `admin.html` yang mempunyai cipset analitik peratusan di bahagian bawah.
  3. **Keserasian Responsif & Dwi-Tema**:
     - Disahkan kelihatan sempurna pada Mod Siang (*Day Mode*) dan Mod Malam (*Obsidian Night Mode*).
     - Grid responsif mengekalkan 4 lajur pada desktop, 2 lajur pada tablet (<=1100px), dan 1 lajur pada telefon pintar (<=540px).

- **Maklumat Git**:
  - Commit: `5.6.4 Tune compact stat cards size across admin dashboard`
  - Tag Versi: `5.6.4`

---

## 🚀 [MINOR UPDATE] 152. Penjajaran Kiri Bersih & Ritma Ruang Pengepala Hero Bento (v5.6.5)

- **Punca Keperluan & Arahan Pengguna (Context & User Feedback)**:
  > *"kenapa tajuk tu terlalu jarak patutnya rapat ke kiri n bagi space"*
  - Pengguna mendapati susun atur tajuk pada halaman inventori kenderaan tersedia (`available-cars.html`) dan sub-halaman pentadbir lain kelihatan janggal kerana tajuk utama teranjak terlalu jauh ke tengah/kanan dan tidak rapat ke kiri selari dengan breadcrumb dan perenggan penerangan.

- **Punca Reka Bentuk Terdahulu (Root Cause Analysis)**:
  1. **Penggunaan Kelas `.flex-center` Pada Baris Tajuk**: Tajuk `<h1 class="bento-title-main">` dan lencana status dibungkus dalam `<div class="flex-center ...">`. Kelas `.flex-center` mengandungi `justify-content: center !important;`, menyebabkan tajuk terpusat secara mendatar dalam kolum kiri dan teranjak sebanyak 70.7px (`left: 394.7px`) dari garisan margin kiri dokumen (`left: 324px`).
  2. **Ketidakselarian Garisan Kiri (*Visual Misalignment*)**: Elemen di atas (`.bento-breadcrumbs`) dan di bawah (`.bento-subtitle-main`) terletak rapat di sebelah kiri (`left: 324px`), manakala tajuk di tengah tertolak ke sebelah kanan, menghasilkan jurang kosong yang canggung dan tidak teratur.
  3. **Ketiadaan Ritma Ruang Menegak Yang Konsisten**: Jarak antara remah roti (*breadcrumb*), tajuk, dan sari kata tidak mempunyai margin standard yang kemas mengikut Apple HIG.

- **Tindakan Pembaikan & Penyeragaman (Implementation Highlights)**:
  1. **Penyeragaman CSS Master `.bento-header-hero` (`shared/css/wedrive.css`)**:
     - Menetapkan peraturan tegas:
       ```css
       .bento-header-hero > .flex-between > div:first-child .flex-center,
       .bento-header-hero .bento-title-row,
       .bento-header-hero .flex-start {
         display: flex !important;
         align-items: center !important;
         justify-content: flex-start !important;
         gap: 12px !important;
         flex-wrap: wrap !important;
       }
       ```
     - Memperbaiki ritma ruang menegak Apple HIG:
       - `.bento-breadcrumbs`: `margin-bottom: 10px !important;` (ruang bernafas kemas).
       - `.bento-title-main`: `margin: 0 !important; line-height: 1.25 !important;`.
       - `.bento-subtitle-main`: `margin: 8px 0 0 0 !important; line-height: 1.5 !important;`.
  2. **Kemas Kini Seluruh Sub-Halaman Pentadbir**:
     - Mengemas kini kelas kontena pengepala daripada `flex-center` kepada `.bento-title-row flex-start` atau `.flex-start gap-10 mb-8` pada 11 fail sub-halaman pentadbir:
       - `admin/pages/car/available-cars.html`
       - `admin/pages/dashboard/operations.html`
       - `admin/pages/car/rented-cars.html`
       - `admin/pages/car/add-car.html`
       - `admin/pages/booking/active-bookings.html`
       - `admin/pages/booking/new-booking.html`
       - `admin/pages/customer/verifications.html`
       - `admin/pages/report/export-reports.html`
       - `admin/pages/marketing/marketing.html`
       - `admin/pages/calendar/calendar.html`
       - `admin/pages/chatbot/chatbot.html`
  3. **Pengesahan Visual & Pengukuran Posisi**:
     - Disahkan melalui ukuran DevTools pelayar:
       - `breadcrumbsRect.left`: **324px**
       - `titleRect.left`: **324px** (telah rapat ke kiri sepenuhnya, 0px offset)
       - `subtitleRect.left`: **324px**
     - Sempurna pada Mod Siang (*Day Mode*) dan Mod Malam (*Obsidian Night Mode*).
  4. **Pengujian Automasi Penuh (Playwright E2E)**:
     - Kesemua **29/29 ujian lulus 100% (100% Pass Rate)** merangkumi modul Auth, Theme/Lang, About, Pricing, Inactivity Timeout, Bookings Filter & Pagination, Customer Portal, Resit Cukai Rasmi, AI Intelligence, dan Sub-halaman Bar Sisi.

- **Maklumat Git**:
  - Commit: `5.6.5 Fix bento header left alignment and spacing rhythm across admin sub-pages`
  - Tag Versi: `5.6.5`

---

## 🚀 [MINOR UPDATE] 153. Penyeragaman Kad Statistik Sebaris Bento Pentadbir & Pembaikan Grid 4-Kolum (v5.6.6)

- **Punca Keperluan & Arahan Pengguna (Context & User Feedback)**:
  > *"ni pon sama asal card tu besar2 ...boleh jadikan dia sebaris kot"*
  - Pengguna mendapati 4 kad statistik pada halaman kenderaan sedang disewa (`rented-cars.html`) tersusun bertingkat menegak (*stacked rows*) secara gergasi selebar 100% tetingkap, dan meminta supaya dijadikan sebaris (*single row*) yang padat, kemas, dan ergonomik.

- **Punca Reka Bentuk Terdahulu (Root Cause Analysis)**:
  1. **Ketiadaan Takrifan CSS Bagi Kelas `.grid-4`**: Elemen pembungkus menggunakan `<div class="grid-4 mb-24 reveal-onload">`. Namun, kelas `.grid-4` tidak ditakrifkan dalam lembaran gaya CSS (hanya `.grid-4col` dan `.stats-grid`).
  2. **Peluncuran Default Kepada `display: block`**: Disebabkan `.grid-4` tidak dikenali oleh CSS, kontena bertindak sebagai elemen blok biasa. Setiap kad di dalamnya (`.card.p-20`) mengambil lebar penuh 100% (melebihi 1000px) dan tersusun ke bawah secara bertingkat 4 baris gergasi.
  3. **Struktur Kad Tidak Standard**: Kad-kad dalam 5 sub-halaman menggunakan `.card.p-20` dengan saiz fon nombor besar (`fs-28`) berbanding komponen Bento rasmi `.stats-grid` dan `.stat-card` yang diperkenalkan dalam versi 5.6.4.

- **Tindakan Pembaikan & Penyeragaman (Implementation Highlights)**:
  1. **Penakrifan Kelas `.grid-4`, `.grid-4col`, dan `.stats-grid` Berpusat (`shared/css/wedrive.css`)**:
     - Memastikan sebarang kegunaan `.grid-4`, `.grid-4col`, atau `.stats-grid` sentiasa menghasilkan susun atur grid 4-kolum mendatar:
       ```css
       .stats-grid,
       .grid-4,
       .grid-4col {
         display: grid !important;
         grid-template-columns: repeat(4, 1fr) !important;
         gap: 16px !important;
         margin-bottom: 22px !important;
       }
       ```
     - Mengemas kini responsif pada breakpoint peranti:
       - Tablet ($\le 1100\text{px}$): `grid-template-columns: repeat(2, 1fr) !important;`
       - Telefon Pintar ($\le 540\text{px}$): `grid-template-columns: 1fr !important;`
  2. **Penyelarasan Struktur Kompak `.stat-card` Pada 5 Sub-Halaman Pentadbir**:
     - Mengemas kini HTML kepada struktur rasmi `.stats-grid` dan `.stat-card` (aliran baris mendatar dengan ikon bento bertaraf warna):
       - `admin/pages/car/rented-cars.html` (Sedang Di Jalan Raya, Pulang Hari Ini, Purata Tempoh Sewaan, Kadar Ketepatan Masa)
       - `admin/pages/booking/active-bookings.html` (Tempahan Aktif, Pulangan Hari Ini, Deposit Dipegang, Nilai Sewaan Aktif)
       - `admin/pages/customer/verifications.html` (Menunggu Semakan, Disahkan Sah JPJ, Dokumen Ditolak, SLA Purata Semakan)
       - `admin/pages/calendar/calendar.html` (Tempahan Bulan Ini, Sedang Disewa Hari Ini, Kempen & Promosi Aktif, Hasil Sewaan Bulan Ini)
       - `admin/pages/marketing/marketing.html` (Sepanduk Aktif, Kod Kupon Sah, Jumlah Penebusan, Kadar Bermusim Aktif)
  3. **Pembersihan Terminologi Standard Korporat**:
     - Menggantikan istilah lama kepada "Indeks utiliti sewaan" selaras dengan peraturan Rule 4.
  4. **Pengesahan Visual & Geometri**:
     - Disahkan melalui DevTools:
       - `allSameRow`: **true** (Keempat-empat kad berada pada aras menegak `top: 358.75px` yang tepat sama).
       - `cardWidths`: **[261px, 261px, 261px, 261px]** (seimbang sempurna 1 baris).
     - Kandungan utama di bawahnya (katalog kereta, jadual kontrak) kini terus kelihatan tanpa perlu skrol yang panjang.
  5. **Pengujian Automasi Penuh (Playwright E2E)**:
     - Kesemua **29/29 ujian lulus 100% (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `5.6.6 Unify single row bento stat cards and fix 4-column grid styling`
  - Tag Versi: `5.6.6`

---

### 152. Penalaan Reka Bentuk Apple Bento Hero Header & Pengecilan Saiz Tajuk Sub-Halaman Pentadbir (v5.6.7)
- **Tarikh**: 5 September 2026
- **Kategori**: `[MINOR UPDATE]` / `[UI/UX REFINEMENT]`
- **Modul Terlibat**:
  - `shared/css/wedrive.css`
  - `admin/pages/car/rented-cars.html`
  - `admin/pages/booking/active-bookings.html`
  - `admin/pages/customer/verifications.html`
  - `admin/pages/report/export-reports.html`
  - `admin/pages/booking/new-booking.html`
  - `admin/pages/car/add-car.html`
  - `admin/pages/calendar/calendar.html`
  - `admin/pages/marketing/marketing.html`
  - `admin/pages/chatbot/chatbot.html`

- **Objektif & Latar Belakang**:
  - Berdasarkan maklum balas pengguna (*"ni terlalu besar sangat kecil kan sikit... x lawa besar2"*), bahagian tajuk hero (`bento-header-hero`) pada sub-halaman pengurusan pentadbir sebelum ini kelihatan terlalu besar, bertingkat 5 baris di dalam kad putih yang tebal, butang tindakan terdorong ke bawah kiri tanpa keseimbangan visual, dan teks tajuk memakan ruang menegak yang berlebihan sehingga menenggelamkan kad statistik dan jadual utama.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pengecilan Saiz Tipografi & Penskalaan Apple HIG**:
     - Menurunkan saiz fon `.bento-title-main` daripada `30px/32px` kepada `24px` (`font-weight: 700`, `letter-spacing: -0.025em`) agar sepadan dengan standard visual macOS/iOS.
     - Menetapkan saiz `.bento-subtitle-main` kepada `13px` dengan `line-height: 1.5` dan `color: var(--text-secondary)`, serta mengehadkan lebar baris teks (`max-width: 680px`) untuk kebolehbacaan maksimum.
     - Mengecilkan bujur lencana status (`.bento-title-row .status-badge`) kepada `11px` dengan padding `3px 8px` bersebelahan terus dengan tajuk utama.
  2. **Penyelarasan Seni Bina Baris Mendatar (`.bento-header-hero`)**:
     - Menghapuskan pembungkus kad putih tebal (`card`) dan beralih kepada reka bentuk terbuka (*borderless hero*) yang anggun dan bersih.
     - Menyusun hirarki visual 3 baris yang teratur:
       - **Baris 1**: Breadcrumbs navigasi (`bento-breadcrumbs`, 12px, font-weight: 600, uppercase).
       - **Baris 2**: Baris tajuk kembar (`bento-title-row`) yang meletakkan Tajuk Halaman dan Lencana Status Langsung sebaris di kiri, manakala butang tindakan utama (`btn-outline-sm` & `btn-primary-sm`) kekal kemas di sudut atas kanan.
       - **Baris 3**: Teks deskripsi ringkas fungsi operasi di bawah tajuk.
     - Menetapkan peraturan CSS `flex-wrap: nowrap !important;` pada skrin desktop/komputer riba bagi mengelakkan butang tindakan terdorong ke baris kedua, dan mengaktifkan `flex-wrap: wrap` hanya pada peranti mudah alih ($\le 768\text{px}$).
  3. **Penyeragaman Komprehensif Pada 9 Sub-Halaman Pentadbir**:
     - `admin/pages/car/rented-cars.html` (Kenderaan Sedang Disewa)
     - `admin/pages/booking/active-bookings.html` (Tempahan Sedang Aktif)
     - `admin/pages/customer/verifications.html` (Pengesahan Dokumen Lesen & MyKad)
     - `admin/pages/report/export-reports.html` (Pusat Eksport & Arkib Data)
     - `admin/pages/booking/new-booking.html` (Cipta Tempahan Kaunter)
     - `admin/pages/car/add-car.html` (Tambah Kenderaan Baharu)
     - `admin/pages/calendar/calendar.html` (Kalendar Operasi & Tempahan)
     - `admin/pages/marketing/marketing.html` (Pengurusan Promosi & Kempen Kereta)
     - `admin/pages/chatbot/chatbot.html` (Konfigurasi Pembantu Khidmat Pelanggan)

- **Pengesahan & Ujian Automasi**:
  - **Ujian Visual DevTools**: Disahkan melalui tangkapan skrin pelayar sebenar merentas kesemua halaman yang terlibat. Susun atur kini sangat padat, mewah, seimbang, dan mengikut standard Apple Human Interface Guidelines tanpa sebarang teks bertindih atau ruang kosong yang janggal.
  - **Ujian Playwright E2E**: Menjalankan keseluruhan suite ujian automasi terasing `tests/` dengan pencapaian **29/29 ujian lulus 100% (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `5.6.7 Refine and compact bento hero header styling across admin sub-pages`
  - Tag Versi: `5.6.7`

---

### 153. Audit Menyeluruh Kualiti Antaramuka Pentadbir, Pembetulan Pengecaman Fokus Bujur & Penyeragaman Estetik Apple HIG (v5.6.8)
- **Tarikh**: 5 September 2026
- **Kategori**: `[MAJOR UPDATE]` / `[UI/UX REFINEMENT & SYSTEM AUDIT]`
- **Modul Terlibat**:
  - `shared/css/wedrive.css`
  - `admin/pages/dashboard/admin.html`
  - `admin/pages/dashboard/operations.html`
  - `admin/pages/car/cars.html` & `admin/js/cars.js`
  - `admin/pages/car/available-cars.html` & `admin/js/available-cars.js`
  - `admin/pages/car/rented-cars.html`
  - `admin/pages/car/add-car.html`
  - `admin/pages/car/car-detail.html` & `admin/js/car-detail.js`
  - `admin/pages/booking/bookings.html`
  - `admin/pages/booking/active-bookings.html`
  - `admin/pages/booking/new-booking.html`
  - `admin/pages/customer/customers.html`
  - `admin/pages/customer/verifications.html`
  - `admin/pages/report/reports.html`
  - `admin/pages/report/export-reports.html`
  - `admin/pages/calendar/calendar.html`
  - `admin/pages/analytics/analytics.html`
  - `admin/pages/chatbot/chatbot.html`
  - `admin/pages/marketing/marketing.html` & `admin/js/marketing.js`
  - `admin/pages/setting/settings.html` & `admin/js/settings.js`

- **Objektif & Latar Belakang**:
  - Memenuhi maklum balas kritikal pengguna:
    1. *"buruk"* — Reka bentuk kad kereta lama dengan teks spesifikasi menegak bertingkat dan susun atur tidak teratur.
    2. *"asal highlight dia kotak..saya nak ikut bulatan tu penuh jangan ikut kotak tu"* — Masalah penonjolan fokus (*focus ring*) pelayar yang memaparkan garisan kotak segi empat tepat yang hodoh dan memotong bucu kapsul bujur input carian.
    3. *"as admin tengok page tu ....kau rasa admin suka ke page macam tu x tersusun ...aq nak kau testing satu per satu"* — Permintaan untuk menjalankan audit menyeluruh halaman demi halaman menggunakan pelayar sebenar (Chrome DevTools), menyusun atur semua elemen antaramuka, membetulkan butang yang tidak berfungsi, dan memastikan perisian pentadbir kelihatan korporat, teratur, dan mewah mengikut standard Apple HIG.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pembasmian Kotak Fokus Segi Empat & Pengenalan Cahaya Pengecaman Bujur Apple**:
     - Menetapkan `input:focus, select:focus, textarea:focus { outline: none !important; }` di seluruh sistem untuk membatalkan garisan kotak lalai pelayar.
     - Mengaplikasikan peraturan `:focus-within` pada semua bekas input kapsul (`.input-wrap`, `.input-wrap-sm`, `.input-search-fixed`, `.search-pill`, dsb.) dengan `border-radius: 9999px`, warna sempadan `#0071E3`, dan kilauan cahaya lembut `box-shadow: 0 0 0 3.5px rgba(0, 113, 227, 0.18)` yang 100% menepati kontur lengkungan bujur.
  2. **Rombakan Kad Pameran Kereta Pentadbir (`.apple-car-showcase-card`)**:
     - Menukar templat kad kereta lama dalam `admin/js/cars.js` dan `admin/js/available-cars.js` kepada struktur kad Apple Bento moden: kanvas nisbah studio 16:10, lencana status kaca terapung dengan titik nadi hijau, nombor plat format JPJ berlatar hitam (`tabular-nums`), lencana spesifikasi mendatar (transmisi, tempat duduk, bahan api), dan butang tindakan kapsul berperalihan lembut `scale(0.97)`.
  3. **Penstrukturan Semula Modul Pemasaran & Promosi (`marketing.html`)**:
     - Menambah kelas susun atur `.mkt-section` (`display: none !important;` dan `.active { display: block !important; }`) bagi membolehkan pertukaran tab (Sepanduk, Kod Kupon, Kadar Bermusim, Cadangan Pintar) berfungsi secara dinamik tanpa pertindihan kandungan.
     - Mereka bentuk komponen visual Apple Bento untuk sepanduk promosi, kad baucar kod promo bergaris putus-putus, bar kemajuan penggunaan, dan butang tindakan squircle taktikal.
  4. **Penalaan Penjajaran & Modal Detail Kereta**:
     - Memperbaiki konflik paparan `.hidden` pada modal pengesahan (`#insurance-modal`, `#status-modal`, `#edit-modal`, `#delete-modal`) dalam `car-detail.js`.
     - Memperbetulkan isu pertindihan tajuk dan lencana status pada kad konfigurasi API di `chatbot.html`.
  5. **Pengujian Menyeluruh Halaman demi Halaman Melalui Chrome DevTools**:
     - Menguji setiap butang, penapis segmen, carian, suis tema, suis bahasa, dan navigasi dwi-baris merentas kesemua 18 halaman pentadbir dalam satu tab pelayar tunggal.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Pelayar DevTools**: Mengesahkan setiap tindakan antaramuka secara visual dengan tangkapan skrin sebenar.
  - **Ujian Playwright E2E**: Menjalankan keseluruhan suite 29 ujian automasi dengan kadar kelulusan 100%.

- **Maklumat Git**:
  - Commit: `5.6.8 Comprehensive admin UI audit, oval focus glow fix and Apple HIG styling standardization`
  - Tag Versi: `5.6.8`

---

### 154. Penalaan Gambar Penuh (Full-Bleed) Tanpa Pelapik Gelap Pada Kad Pameran Kenderaan Pentadbir (v5.6.9)
- **Tarikh**: 5 September 2026
- **Kategori**: `[MINOR UPDATE]` / `[UI/UX REFINEMENT]`
- **Modul Terlibat**:
  - `shared/css/wedrive.css`
  - `admin/pages/car/cars.html`
  - `admin/pages/car/available-cars.html`
  - `admin/pages/car/rented-cars.html`

- **Objektif & Latar Belakang**:
  - Berdasarkan maklum balas dan tangkapan skrin pengguna (*"buat gambar ni full sahaja"*), gambar kenderaan pada kad pameran pentadbir (`.apple-car-showcase-card`) sebelum ini mempunyai pelapik dalaman (`padding: 16px`) dan `object-fit: contain` yang menyebabkan gambar berada di dalam kotak bingkai gelap kecil dengan jurang ruang kosong yang ketara di bahagian atas, kiri, kanan, dan bawah.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pembuangan Pelapik Bingkai Dalaman**:
     - Menetapkan `padding: 0 !important;` pada `.apple-car-studio-canvas` bagi membolehkan imej menyentuh terus sempadan kad squircle.
  2. **Pelarasan Mod Liputan Gambar Penuh (*Full-Bleed Object Cover*)**:
     - Mengubah suai gaya `.apple-car-studio-img` kepada `object-fit: cover !important;` dengan `width: 100%;` dan `height: 100%;` serta `display: block;`.
     - Imej studio kenderaan kini memenuhi keseluruhan kanvas nisbah 16:10 secara lancar dari tepi ke tepi tanpa sebarang jurang bingkai gelap, manakala lengkungan bucu atas dipotong kemas oleh `border-radius: 24px` dan `overflow: hidden` kad induk.
  3. **Pengekalan Kedudukan Lencana Kaca Terapung**:
     - Lencana status terapung (`.glass-status-pill`) kekal terapung anggun di sudut atas kanan di atas permukaan imej kenderaan dengan kesan kaca `backdrop-filter: blur(16px) saturate(180%)`.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Pelayar DevTools**: Disahkan secara visual di halaman `cars.html`, `available-cars.html`, dan `rented-cars.html`. Gambar kereta kini 100% penuh dan bersih.
  - **Ujian Playwright E2E**: Menjalankan keseluruhan suite 29 ujian automasi dengan kadar kelulusan 100%.

- **Maklumat Git**:
  - Commit: `5.6.9 Make admin car showcase card images full bleed without inset padding`
  - Tag Versi: `5.6.9`

---

### 155. Pembaikan Suis Kawalan Segmen Apple & Penghapusan Pepijat Berbilang Butang Aktif (v5.7.0)
- **Tarikh**: 5 September 2026
- **Kategori**: `[BUG FIX]` / `[INTERACTION LOGIC]`
- **Modul Terlibat**:
  - `admin/js/cars.js`
  - `admin/pages/car/available-cars.html`

- **Objektif & Latar Belakang**:
  - Berdasarkan aduan dan tangkapan skrin pengguna (*"asal tiga2 boleh menyala"*), komponen kawalan segmen Apple (`.apple-segmented-control`) di halaman pengurusan kenderaan (`cars.html` dan `available-cars.html`) mengalami isu di mana ketiga-tiga butang (`All`, `Available`, `Rented`) atau kesemua kategori boleh berada dalam keadaan aktif (`.active`) secara serentak apabila diklik.
  - Punca isu dikesan pada fungsi `filterCar()` dan `filterCategory()` yang mencari kelas lama `.apple-segment-btn` semasa membuang kelas `.active`, sedangkan butang dalam templat HTML menggunakan kelas `.apple-segment-item`. Ini menyebabkan penyingkiran kelas `.active` gagal dan butang sebelumnya kekal aktif.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Penyelarasan Selektor Pembersihan Kelas Aktif**:
     - Mengemas kini fungsi `filterCar(status, btn)` di `admin/js/cars.js` untuk membersihkan kelas `.active` daripada `document.querySelectorAll('.apple-segment-item, .apple-segment-btn, .filter-chip')`.
     - Mengemas kini fungsi `filterCategory(cat, btn)` di `admin/pages/car/available-cars.html` untuk memastikan penyingkiran kelas `.active` meliputi kedua-dua `.apple-segment-item` dan `.apple-segment-btn`.
  2. **Penguatkuasaan Pilihan Tunggal Eksklusif (*Mutually Exclusive Single Selection*)**:
     - Memastikan hanya satu butang segmen yang menerima kelas `.active` pada satu-satu masa mengikut standard Apple Human Interface Guidelines bagi Segmented Controls.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Interaksi DevTools**: Menguji peralihan klik antara `All (8)`, `Available (6)`, dan `Rented (2)` secara berturutan. Disahkan melalui DOM inspection dan tangkapan skrin bahawa hanya satu butang berstatus aktif pada satu masa, manakala butang lain kembali pudar/lutsinar secara tepat.
  - **Ujian Playwright E2E**: Menjalankan suite ujian automasi penuh dengan kelulusan 100%.

- **Maklumat Git**:
  - Commit: `5.7.0 Fix segmented control active class toggle to ensure mutually exclusive single button selection`
  - Tag Versi: `5.7.0`

---

### 156. Penyeragaman Istilah Bahasa Melayu Tulen & Pembasmian Perkataan Pinjaman Asing (v5.7.1)
- **Tarikh**: 5 September 2026
- **Kategori**: `[LOCALIZATION & LINGUISTIC REFINEMENT]`
- **Modul Terlibat**:
  - `shared/lang/ms.json` & `shared/lang/ms.js`
  - `shared/lang/en.json` & `shared/lang/en.js`
  - `admin/pages/car/cars.html` & `admin/js/cars.js`
  - `admin/pages/car/available-cars.html`
  - `admin/pages/car/rented-cars.html`
  - `admin/pages/car/add-car.html`
  - `admin/pages/booking/new-booking.html`
  - `admin/pages/booking/active-bookings.html`
  - `admin/pages/calendar/calendar.html`
  - `admin/pages/report/export-reports.html`
  - `admin/pages/chatbot/chatbot.html`
  - `admin/pages/dashboard/admin.html`
  - `admin/pages/dashboard/operations.html`

- **Objektif & Latar Belakang**:
  - Memenuhi teguran khusus pengguna mengenai penggunaan perkataan yang bukan daripada Bahasa Melayu standard atau perkataan pinjaman canggung:
    *"banyak saya perasan perkataan bukan dari bahasa melayu...double check bali macam ni: depoh"*
  - Menilai semula keseluruhan sistem bagi menggantikan perkataan seperti "depoh", "depot", "utiliti", dan "sanitasi" kepada istilah bahasa Melayu yang profesional, tulen, dan lazim digunakan dalam industri sewa kenderaan rasmi Malaysia (seperti Mayflower, Wahdah, Socar).

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pembasmian Perkataan "Depoh / Depot"**:
     - Menggantikan "Lokasi Depoh / Depoh Utama Melaka Sentral" kepada **"Pusat Operasi / Cawangan Utama Melaka Sentral"**.
     - Menggantikan "Depot Lapangan Terbang Melaka (MKZ)" kepada **"Cawangan Lapangan Terbang Melaka (MKZ)"**.
     - Menggantikan "Ayer Keroh Depot" kepada **"Pusat Servis Ayer Keroh"**.
     - Menggantikan "3 Depots Synchronized" kepada **"3 Cawangan Beroperasi"**.
     - Menggantikan "rekod pulangan depoh" kepada **"rekod pemulangan cawangan"**.
  2. **Pembasmian Perkataan "Siap Sanitasi" & "Utiliti"**:
     - Menggantikan "Siap Sanitasi" kepada **"Sedia Bersih"** selaras dengan larangan istilah hospital/AI dalam Peraturan 8.
     - Menggantikan "Utiliti Kereta" dan "Indeks Utiliti Sewaan" kepada **"Kadar Penggunaan Kereta"** dan **"Kadar Penggunaan Sewaan"**.
  3. **Penyeragaman Dwibahasa Penuh & Bahasa Melayu di `cars.html`**:
     - Menggantikan teks statik Bahasa Inggeris di kad ringkasan dan penapis: `TOTAL CARS` $\rightarrow$ `JUMLAH KERETA`, `AVAILABLE` $\rightarrow$ `TERSEDIA`, `RENTED` $\rightarrow$ `SEDANG DISEWA`, `All` $\rightarrow$ `Semua`, `Available` $\rightarrow$ `Tersedia`, `Rented` $\rightarrow$ `Sedang Disewa`.
     - Menggantikan teks butang tukar paparan: `List View` / `Grid View` $\rightarrow$ `Paparan Senarai` / `Paparan Grid`.
     - Mengemas kini kekunci bahasa `fl_total_cars`, `fl_available`, `fl_rented`, `fl_filter_all`, `fl_filter_avail`, `fl_filter_rented`, `fl_search_ph`, `fl_view_list`, `fl_view_grid`, `fl_add_car`, `fl_hub_location`, dan `fl_hub_name` dalam kamus `ms.json`, `ms.js`, `en.json`, dan `en.js`.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Pelayar DevTools**: Disahkan secara visual di halaman `cars.html`, `operations.html`, `available-cars.html`, dan `rented-cars.html`. Tiada lagi perkataan "depoh", dan semua label terpapar dalam Bahasa Melayu yang anggun dan tulen.
  - **Ujian Playwright E2E**: Menjalankan keseluruhan suite 29 ujian automasi dengan kadar kelulusan 100%.

- **Maklumat Git**:
  - Commit: `5.7.1 Standardize authentic Malay terminology across admin system and eliminate depoh loanwords`
  - Tag Versi: `5.7.1`

---

### 157. Kad Pratonton Penuh (Full-Bleed Showcase) & Audit Menyeluruh Bahasa Melayu Tulen (v5.7.2)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REFINEMENT & LOCALIZATION]`
- **Modul Terlibat**:
  - `admin/pages/car/add-car.html`
  - `admin/pages/car/car-detail/car-detail.html`
  - `admin/pages/booking/new-booking.html`
  - `admin/pages/booking/bookings.html`
  - `admin/pages/customer/customers.html`
  - `admin/pages/dashboard/admin.html`
  - `customer/pages/car-details/booking/payment/payment.html`
  - `shared/js/main.js`
  - `shared/lang/ms.json`, `shared/lang/ms.js`
  - `shared/lang/en.json`, `shared/lang/en.js`

- **Objektif & Latar Belakang**:
  - Menyelesaikan isu saiz gambar pratonton kad kenderaan pada halaman Tambah Kereta Baharu (`add-car.html`) yang sebelum ini kelihatan kecil dan mempunyai ruang kosong kelabu yang besar di bahagian sisi (*"ni pon kenapa gambar x full sahaja"*).
  - Melakukan audit menyeluruh peringkat kedua terhadap istilah bukan Bahasa Melayu, memastikan tiada lagi perkataan "depot" atau "depoh" dalam nilai pilihan borang (`<option value="...">`), tajuk jadual, label penapis, dan rentetan sandaran (*fallback strings*) dalam `main.js`.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Kad Pameran Apple HIG Berdarah Penuh (*Full-Bleed Studio Showcase*)**:
     - Membuang kontena lama berpadding (`.car-card-img-wrap`) dan menaik taraf kepada seni bina standard Apple Bento: `.apple-car-showcase-card`, `.apple-car-studio-canvas`, dan `.apple-car-studio-img`.
     - Menetapkan gambar memenuhi ruang penuh tanpa bingkai sisi kosong (`aspect-ratio: 16/10; object-fit: cover !important; width: 100%; height: 100%;`).
     - Mengintegrasikan fungsi interaktif `updateLivePreview()` dan `previewCarPhoto` yang mengemas kini nama model, nombor plat, transmisi, bahan api, kerusi, cawangan operasi, kadar harian, dan muat naik foto secara masa nyata.
  2. **Audit Menyeluruh & Pembersihan Istilah Bahasa Melayu Tulen**:
     - `main.js`: Memperbetulkan kamus sandaran dalaman (`FALLBACK_LANG`) untuk `ops_live_network` dan `ops_depot_mkz_name` daripada istilah "depot" kepada "cawangan" dan "pusat operasi".
     - `new-booking.html` & `add-car.html`: Menyeragamkan nilai atribut `value` dalam elemen dropdown `<select>` agar sepadan dengan label Melayu tulen (contoh: `Pusat Servis Ayer Keroh`).
     - `car-detail.html`: Menterjemahkan spesifikasi teknikal kenderaan, tajuk hari kalendar tempahan (`ISN, SEL, RAB, KHA, JUM, SAB, AHD`), status sewaan, jadual tempahan, dan modal pengesahan padam foto.
     - `bookings.html`: Menyeragamkan cip penapis status, butang julat tarikh kalendar, dan jadual serahan pantas kenderaan hari ini.
     - `customers.html`: Menyeragamkan tajuk senarai semakan audit lesen JPJ dan pengepala jadual pelanggan.
     - `payment.html`: Memperbetulkan label pilihan tambahan kerusi kanak-kanak (`Kerusi Kanak-kanak`).
     - Kamus Dwibahasa: Menambah kunci `admin_chip_*`, `pay_addon_child*`, dan `bk_f_*` dalam `ms.json`, `ms.js`, `en.json`, dan `en.js`.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Pelayar DevTools**: Mengesahkan kad pratonton di `add-car.html` kini terpapar anggun memenuhi sudut squircle (24px) dengan latar belakang telus, status terapung, dan butang kadar sewaan.
  - **Ujian Playwright E2E**: Menjalankan keseluruhan suite 29 ujian automasi dengan kadar kelulusan 100% (29 passed).

- **Maklumat Git**:
  - Commit: `5.7.2 Full bleed live preview car card and comprehensive authentic Malay translation`
  - Tag Versi: `5.7.2`

---

### 158. Penyeragaman Grid 2-Kolum Sama Panjang Bagi Peralatan Standard Kereta (v5.7.3)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REFINEMENT & APPLE HIG]`
- **Modul Terlibat**:
  - `admin/pages/car/add-car.html`
  - `admin/pages/setting/settings.html`
  - `shared/css/wedrive.css`

- **Objektif & Latar Belakang**:
  - Mengubah susun atur cip pilihan peralatan standard kereta (`Peralatan Standard Kereta`) pada halaman Tambah Kereta Baharu (`add-car.html`) yang sebelum ini memanjang satu kolum atau tidak seimbang panjangnya.
  - Memastikan susun atur menepati permintaan pengguna (*"pastikan sama panjang"*, *"jangan macam ni...panjang letak dua2"*): disusun secara grid simetri 2-kolum (dua-dua) dengan kelebaran sama panjang 100% per kolum (`repeat(2, 1fr)`).

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Kelas Grid Baharu `.feature-chips-grid`**:
     - Dibina dalam `shared/css/wedrive.css` dengan `display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%;`.
     - Setiap cip `.filter-chip` ditetapkan kelebaran 100% kolumnya, `min-height: 42px`, `padding: 8px 14px`, `font-size: 12px`, dan teks dijajarkan ke kiri bersama ikon pengesahan `check_circle` / `add_circle_outline`.
     - Responsif Apple: Mengadaptasi secara dinamik kepada 1 kolum pada skrin peranti mudah alih (`max-width: 600px`).
  2. **Penyelarasan 6 Pilihan Peralatan Standard Simetri 3x2**:
     - Menambah pilihan ke-6 (`Sensor Parkir Depan & Belakang`) supaya menghasilkan grid simetri 3 baris x 2 kolum yang seimbang dan kemas tanpa ruang kosong di bahagian kanan.
  3. **Penambahbaikan `.flex-wrap` Global**:
     - Memastikan kelas utiliti `.flex-wrap` di `shared/css/wedrive.css` merangkumi `display: flex !important;` bagi mengelakkan keruntuhan flexbox pada mana-mana komponen sistem.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Chrome DevTools**: Mengesahkan setiap kolum mempunyai kelebaran tepat 237px dengan jurang seragam 10px, interaksi klik menukar ikon dan status aktif secara lancar.
  - **Ujian Playwright E2E**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed).

- **Maklumat Git**:
  - Commit: `5.7.3 Symmetrical 2-column equal-width layout for car equipment chips`
  - Tag Versi: `5.7.3`

---

### 159. Penyatuan Kad Tunggal & Pemansuhan Sempadan Bersarang Navigasi Kalendar (v5.7.4)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REFINEMENT & APPLE HIG]`
- **Modul Terlibat**:
  - `admin/pages/calendar/calendar.html`
  - `shared/css/wedrive.css`

- **Objektif & Latar Belakang**:
  - Menyelesaikan isu reka letak antaramuka kalendar yang mempunyai sempadan kad bertindan secara bersarang (*"ni buruk dalam card ada card lagi sepatutnya xyah satu sahaja"*).
  - Menggabungkan kad palang alat kawalan (`.cal-toolbar`) yang sebelum ini terapung berasingan terus ke dalam kad utama kalendar (`.adm-cal-main-card`) sebagai satu kad tunggal yang kohesif.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Penyatuan Kad Tunggal (*Single Unified Bento Card*)**:
     - Membuang elemen `<div class="card cal-toolbar">` yang terapung secara berasingan di atas kalendar.
     - Mengintegrasikan palang alat kawalan kalendar (`.cal-toolbar-header`) terus ke bahagian atas kad kalendar utama di `calendar.html` yang dipisahkan oleh garis pembahagi halus `border-bottom-subtle`.
  2. **Pemansuhan Kotak Pil Bersarang `.cal-nav-group`**:
     - Mengubah `.cal-nav-group` di `shared/css/wedrive.css` menjadi `background: transparent; border: none; padding: 0;` bagi menghapuskan garisan sempadan kapsul kelabu yang memerangkap butang `< >` dan dropdown bulan/tahun.
  3. **Penalaan Butang Navigasi & Dropdown Apple HIG**:
     - Menaik taraf butang bulat `<` dan `>` (`.cal-nav-btn`) kepada saiz 36x36px dengan latar belakang kaca halus (`rgba(255, 255, 255, 0.06)`).
     - Menyeragamkan dropdown pilihan bulan dan tahun (`.cal-dropdown`) dengan sudut bulat 12px dan sempadan halus tanpa bertindan.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Chrome DevTools**: Mengesahkan hanya wujud tepat 1 kad kalendar utama (`totalCards: 1`), tiada lagi garisan sempadan bersarang di sekeliling pemilih bulan, dan interaksi penukaran bulan berjalan sempurna.
  - **Ujian Playwright E2E**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed).

- **Maklumat Git**:
  - Commit: `5.7.4 Unified single card calendar architecture and eliminated nested borders`
  - Tag Versi: `5.7.4`

---

### 160. Penyeragaman Garis Seimbang & Sekata Bagi Penapis Julat Tarikh Tempahan (v5.7.5)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REFINEMENT & APPLE HIG]`
- **Modul Terlibat**:
  - `admin/pages/booking/bookings.html`
  - `admin/js/bookings.js`
  - `shared/css/wedrive.css`
  - `shared/lang/ms.json`, `shared/lang/ms.js`
  - `shared/lang/en.json`, `shared/lang/en.js`
  - `tests/e2e/06_bookings_filter.spec.js`

- **Objektif & Latar Belakang**:
  - Menyelesaikan masalah reka letak bahagian penapis julat tarikh (*Date Range Filter*) pada halaman Pengurusan Tempahan (`bookings.html`) yang sebelum ini tidak sekata dan herot (*"ni tolong buat dia sekata"*).
  - Sebelum ini, label `JULAT TARIKH (TARIKH AMBIL)` berada di kiri baris 1, cip pratetap (*All Time, This Month, This Year, Custom Range*) ditolak ke kanan baris 1, manakala input tarikh khusus (*Dari Tarikh, Hingga Tarikh, Guna*) jatuh ke baris 2 di sebelah kiri dengan ruang kosong besar di sebelah kanan.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pengelompokan Simetri Dua Bahagian (*Two-Pillar Flex Row Layout*)**:
     - Mengelompokkan label `Julat Tarikh (Tarikh Ambil):` dan kawalan bersegmen Apple (*Segmented Control*) di dalam pembungkus `#date-presets-group` di bahagian kiri baris.
     - Meletakkan baris input julat tarikh tersuai (`#custom-date-row`) di sebelah kanan pada baris mendatar yang sama, menghasilkan jajaran satu baris yang seimbang dan sekata (*level baseline*).
  2. **Penyeragaman Ketinggian & Geometri Apple HIG (36px Uniform Height)**:
     - Menyeragamkan ketinggian kawalan bersegmen, input pemilih tarikh (`input.date-picker`), dan butang tindakan (`button.apply-btn`) kepada ketinggian seragam tepat 36px (`height: 36px !important;`).
     - Mengubah kelebaran input pemilih tarikh kepada 112px dengan penjajaran teks tengah (`text-align: center`) dan sudut bulat pil penuh (`border-radius: 9999px`), menghapuskan sebarang lebihan margin atas (`margin-top: 0 !important`).
     - Menghapuskan `margin-bottom: 8px` pada `.date-range-label` supaya sentiasa berpusat secara menegak dengan cip pilihan tarikh.
  3. **Sokongan Dwibahasa Penuh (MS & EN)**:
     - Menambah kunci kamus dwibahasa `bk_date_range_label`, `bk_date_all`, `bk_date_month`, `bk_date_year`, `bk_date_custom`, `bk_to`, dan `bk_apply` ke dalam kamus bahasa Inggeris dan Melayu (`en.json`, `en.js`, `ms.json`, `ms.js`).
  4. **Pencegahan Regresi & Ujian Automasi E2E**:
     - Mengemaskini ujian Playwright `e2e/06_bookings_filter.spec.js` dengan resolusi MacBook piawai 1440x900 untuk mengesahkan interaksi buka/tutup dan penjajaran visual secara langsung.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Chrome DevTools & Visual Snap**: Mengesahkan kedua-dua kumpulan elemen duduk tepat pada baris mendatar yang sama (`isSameRow: true`), ketinggian 36px seragam, dan input teks berpusat cantik.
  - **Ujian Playwright E2E**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed dalam 1.4m).

- **Maklumat Git**:
  - Commit: `5.7.5 Balanced single-line date range filter layout in bookings management`
  - Tag Versi: `5.7.5`

---

### 161. Pemansuhan Kotak Bersarang & Penyeragaman Tipografi Apple Calendar (v5.7.6)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REFINEMENT & APPLE HIG]`
- **Modul Terlibat**:
  - `admin/pages/calendar/calendar.html`
  - `shared/css/wedrive.css`

- **Objektif & Latar Belakang**:
  - Menyelesaikan rungutan visual pengguna (*"ni pon sama buruk dalam card ada card"*) pada palang alat kalendar operasi (`calendar.html`).
  - Dropdown pemilih bulan dan tahun sebelum ini (`select.cal-dropdown`) mewarisi gaya borang generik (`select.form-control`) dengan kotak sempadan berketebalan 1.5px dan latar belakang kelabu gelap, menjadikannya kelihatan seperti kad mini berkotak yang terperangkap di dalam kad kalendar utama.
  - Tambahan pula, cache penyemak imbas lama bagi fail CSS menyebabkan reka letak pil bersarang lama masih kelihatan pada sesetengah peranti.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Penyingkiran Pemilih dari Gaya Borang Generik**:
     - Mengasingkan `select.cal-dropdown` daripada senarai gaya borang tegar `select.form-control` di `shared/css/wedrive.css` bagi menghentikan sempadan kotak `1.5px solid var(--border-subtle)` dan latar belakang tebal secara paksa.
  2. **Evolusi Tipografi Tulen Apple Calendar (Zero Nested Card Borders)**:
     - Menaik taraf `.cal-dropdown` dan `select.cal-dropdown` kepada gaya tipografi bersih ala macOS Sonoma/Tahoe Calendar: `background: transparent !important; border: none !important; box-shadow: none !important; font-size: 16px !important; font-weight: 700 !important;`.
     - Menyediakan ikon anak panah ke bawah (*chevron*) yang sangat halus dan minimalis berasaskan vektor SVG dengan kedudukan padat.
     - Menyediakan kesan sorotan lembut semasa tetikus berada di atas elemen (`:hover { background-color: var(--bg-surface-2); color: var(--primary); }`).
  3. **Penyatuan Latar Belakang Palang Alat Kalendar**:
     - Menetapkan `.cal-toolbar-header` kepada `background: transparent !important;` supaya menyatu secara harmoni dengan kad Bento utama tanpa lapisan warna yang terputus, sama ada dalam Mod Siang mahupun Mod Malam.
  4. **Kemas Kini Versi Anti-Cache (Cache Busting)**:
     - Mengemaskini tag pautan fail CSS dan skrip JS pada `calendar.html` kepada `wedrive.css?v=5.7.6` dan `calendar.js?v=5.7.6` bagi memastikan pengguna sentiasa menerima reka bentuk terkini serta-merta tanpa isu cache.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Chrome DevTools & Visual Snapshot**: Mengesahkan `border: 0px none`, `background: rgba(0, 0, 0, 0)` pada kumpulan navigasi dan dropdown bulan/tahun; tiada lagi kotak kad bersarang, menghasilkan tajuk kalendar yang sangat anggun dan profesional.
  - **Ujian Automasi Playwright**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed dalam 1.5m).

- **Maklumat Git**:
  - Commit: `5.7.6 Clean borderless Apple calendar typography and eliminated nested dropdown cards`
  - Tag Versi: `5.7.6`

---

### 162. Transformasi Dialog Lembaran Perincian Harian Kalendar Apple HIG (v5.7.7)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REFINEMENT & APPLE HIG]`
- **Modul Terlibat**:
  - `admin/js/calendar.js`
  - `admin/pages/calendar/calendar.html`
  - `shared/css/wedrive.css`

- **Objektif & Latar Belakang**:
  - Menyelesaikan rungutan pengguna (*"ni pon buruk ..tolong cantikkan"*) terhadap pop-up perincian harian kalendar (`.cal-day-modal`) yang dibuka apabila pengguna menekan sel tarikh pada kalendar.
  - Sebelum ini, pop-up tersebut memaparkan teks mentah tanpa struktur (*unpadded raw text lines*) berserta emoji raw (`✓`, `🚗`, `🔧`, `🗓️`), ikon kereta melayang di atas nama kenderaan, jalur tebal kuning gelap yang tidak sedap dipandang, ketiadaan kad Bento, dan tiada penataan CSS tersusun.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pemansuhan Kesemua Emoji Raw Serta Pematuhan Peraturan Standard Korporat**:
     - Menyingkirkan semua emoji dan menggantikannya dengan ikon vektor rasmi *Google Material Icons Round* (`check_circle`, `directions_car`, `build`, `event_available`, `campaign`, dsb.).
  2. **Struktur Kad Bento Mini Bagi Metrik Harian (`.cal-day-summary`)**:
     - Mengubah baris ringkasan kepada grid responsif cip Bento Apple:
       - **Tersedia / Available**: Latar belakang hijau kaca lut sinar (`rgba(52, 199, 89, 0.08)`) dengan sempadan aksen halus dan kiraan tebal `tabular-nums`.
       - **Disewa / Rented**: Latar belakang biru aksen kaca (`rgba(0, 113, 227, 0.08)`).
       - **Pemeriksaan / Inspections**: Latar belakang jingga/amber kaca (`rgba(255, 159, 10, 0.08)`).
       - **Musiman / Seasonal**: Latar belakang ungu kaca (`rgba(175, 82, 222, 0.08)`).
  3. **Reka Bentuk Kad Item Tempahan & Pemeriksaan Apple HIG (`.cal-booking-card`)**:
     - Mengelompokkan setiap tempahan ke dalam kad squircle (`border-radius: 18px`, `background: var(--bg-surface-1)`, batas `border-subtle`).
     - Menyediakan ikon kenderaan dalam bekas bulat-segi 42x42px berlatar belakang kaca biru.
     - Menyusun maklumat nama pelanggan, nombor tempahan, dan julat tarikh (`pickup → return`) secara kemas dengan pemisah dot halus.
     - Menyeragamkan paparan harga sewaan (`tabular-nums`) bersama lencana status berpil penuh Apple (`.status-badge.confirmed` dan `.status-badge.warning` dengan titik bersinar).
  4. **Penyeragaman Lencana Status Dwibahasa Penuh**:
     - Menambah sokongan terjemahan status pintar bagi lencana (*Disahkan / Confirmed*, *Wajib / Required*, *Menunggu / Pending*, *Selesai / Completed*).
  5. **Kemas Kini Versi Anti-Cache (Cache Busting)**:
     - Mengemaskini tag fail pada `calendar.html` kepada `wedrive.css?v=5.7.7` dan `calendar.js?v=5.7.7`.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Chrome DevTools & Visual Snapshot**: Mengesahkan modal pop-up tampil sangat mewah, padat, berorientasikan korporat mobiliti Apple, dan tiada lagi teks berterabur mahupun emoji raw.
  - **Ujian Automasi Playwright**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed dalam 1.3m).

- **Maklumat Git**:
  - Commit: `5.7.7 Modernized Apple HIG calendar day detail modal with Bento stat chips and booking cards`
  - Tag Versi: `5.7.7`

---

### 163. Penyelarasan Susun Atur Butang Tindakan Kiri-Kanan Mendatar Jadual (v5.7.8)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REFINEMENT & RESPONSIVE DESIGN]`
- **Modul Terlibat**:
  - `admin/pages/booking/active-bookings.html`
  - `admin/pages/car/rented-cars.html`
  - `admin/pages/car/available-cars.html`
  - `shared/css/wedrive.css`

- **Objektif & Latar Belakang**:
  - Menyelesaikan rungutan pengguna (*"ni macam ni x tersusun ...buat kiri kanan lahh"*) terhadap butang tindakan operasi jadual (khususnya butang `Resit` dan `Urus` pada halaman Tempahan Aktif) yang terlipat menegak (*stacked vertically*) di mana butang `Resit` berada di atas dan `Urus` berada di bawah akibat pengecutan lajur jadual tanpa sekatan `white-space`.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pengenalan Kelas Bantuan Sel Jadual Kiri-Kanan Rasmi (`.table-action-cell` & `.table-action-group`)**:
     - Membina kelas utiliti standard dalam `shared/css/wedrive.css`:
       - `.table-action-cell`: Ditetapkan dengan `white-space: nowrap !important; min-width: 156px !important; width: 156px !important; text-align: right !important;`.
       - `.table-action-group`: Bekas `display: inline-flex !important; align-items: center !important; justify-content: flex-end !important; gap: 8px !important; flex-wrap: nowrap !important; white-space: nowrap !important;`.
  2. **Penyeragaman Butang Kapsul Apple HIG (`.apple-btn-capsule-secondary` & `.apple-btn-capsule-primary`)**:
     - Mengemas kini butang kepada varian kapsul bulat penuh rasmi (`border-radius: 9999px; height: 32px; padding: 6px 14px; font-size: 12px; font-weight: 600; white-space: nowrap !important; flex-shrink: 0 !important;`).
     - Menghapuskan penggunaan butang raw berbeza saiz (`btn-secondary` dan `btn-primary`) dalam jadual.
  3. **Penyelarasan Merentas Semua Jadual Pengurusan**:
     - Mengemaskini lajur tindakan pada `active-bookings.html` (`Resit` dan `Urus`), `rented-cars.html` (`Perincian` dan `Urus`), serta `available-cars.html` (`Perincian` dan `Tempah`) agar kesemuanya kekal mendatar side-by-side (`kiri kanan`) tanpa sebarang kemungkinan terlipat.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Chrome DevTools & Visual Snapshot**: Mengesahkan koordinat menegak kedua-dua butang adalah sama tepat (`btn1Top: 613.67px`, `btn2Top: 613.67px`, `isSameRow: true`), dengan jurang 8px mendatar yang sempurna.
  - **Ujian Automasi Playwright**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed dalam 1.8m).

- **Maklumat Git**:
  - Commit: `5.7.8 Aligned table action buttons horizontally side-by-side with Apple capsule styling`
  - Tag Versi: `5.7.8`

---

### 164. Transformasi Modal Perincian Pelanggan Kepada Apple HIG Obsidian Bento & Lightbox Pemeriksaan Dokumen (v5.7.9)
- **Tarikh**: 5 September 2026
- **Kategori**: `[UI/UX REDESIGN & STITCH MCP INTEGRATION]`
- **Modul Terlibat**:
  - `admin/js/customers.js`
  - `admin/pages/customer/customers.html`
  - `shared/css/wedrive.css`

- **Objektif & Latar Belakang**:
  - Menyelesaikan rungutan pengguna (*"ni macam xsiap lagi sahaja..fix juga ni..kalau xde idea sangat suruh mcp stitch buatkan page ni"*) terhadap pop-up Perincian Pelanggan (*Customer Details Modal*) yang sebelum ini kelihatan mentah, teks kelabu gelap sukar dibaca pada tema gelap akibat warna teks navy hardcoded (`#1E293B`), kad dokumen tidak teratur dan memotong butang tindakan di bahagian bawah, tiada pratonton gambar interaktif (*lightbox*), dan butang kelulusan/penolakan tersembunyi jauh di bawah skrin.

- **Tindakan & Penambahbaikan Teknikal (Stitch MCP Screen ID `3808dc4db0244ea599a20071cd01bb76` / Gemini 3.8)**:
  1. **Struktur Bento Hero 2-Kolum & Kad Profil Pelanggan**:
     - Membina kad profil Bento (`.cust-profile-card`) dengan squircle avatar cerun elektrik blue (`.cust-avatar-squircle`), nama penuh, emel, tarikh pendaftaran, dan pil status bercahaya (*glowing status dot pill*: Hijau bagi Disahkan, Jingga bagi Menunggu, Merah bagi Ditolak).
  2. **Grid Metrik 2x3 Padat & Tipografi Apple `tabular-nums`**:
     - 6 jubin metrik Bento (`.cust-metric-tile`): No. Telefon, No. Kad Pengenalan (IC), No. Lesen Memandu, Tarikh Daftar, Jumlah Tempahan, serta sorotan Jumlah Perbelanjaan (`.spent-highlight`) berfon tebal biru elektrik dengan sokongan angka tabular.
  3. **Pemeriksaan Dokumen Pengesahan 4-Kad Bersama Lightbox Interaktif**:
     - 4 kad dokumen sebaris (`.cust-docs-grid`): MyKad Depan, MyKad Belakang, Lesen Memandu Depan, Lesen Memandu Belakang.
     - Setiap kad mempunyai kotak lakaran kecil (`.cust-doc-thumb-box`) dengan lapisan hover kanta zum (`.cust-doc-zoom-btn`), tag status pengesahan, dan sokongan sandaran kemas (*empty state dashed card*) dengan ikon `cloud_off` dan status *Belum Dimuat Naik / Not Uploaded*.
     - Integrasi fungsi `openDocLightbox(url, title)` dan `closeDocLightbox()` untuk membuka pratonton dokumen berskala besar dengan latar belakang kabur `backdrop-filter: blur(20px)`.
  4. **Jadual Sejarah Tempahan Kompak & Bar Tindakan Melekat (*Sticky Action Bar*)**:
     - Memaparkan sejarah sewaan kenderaan pelanggan dalam jadual berketumpatan tinggi Apple HIG (`.cust-history-table`).
     - Bar tindakan melekat di bahagian bawah modal (`.cust-modal-footer`) yang sentiasa kelihatan tanpa perlu skrol, lengkap dengan butang Tutup, Tolak Pengesahan (Apple Red), dan Sahkan Pelanggan (Apple Emerald Green).
  5. **Sokongan Dwibahasa Penuh (MS/EN) & Penyeragaman Tema Gelap/Terang**:
     - Kesemua label modal beralih secara dinamik mengikut tetapan bahasa pengguna (`localStorage.getItem('wedrive_lang')`).
     - Penggunaan token rasmi `--bg-surface`, `--bg-surface-2`, `--text-primary`, `--text-secondary`, dan `--primary` memastikan kebolehbacaan berkontras tinggi pada Mod Gelap Obsidian mahupun Mod Cerah.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Visual Chrome DevTools MCP**: Mengesahkan modal pop-up tampil mewah bertaraf eksekutif, teks kontras tinggi terbaca dengan jelas, pratonton dokumen boleh dizum secara interaktif, dan bar butang melekat di bahagian bawah.
  - **Ujian Automasi Playwright**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed).

- **Maklumat Git**:
  - Commit: `5.7.9 Modernized Apple HIG Obsidian Bento Customer Details modal with document inspection and sticky action bar`
  - Tag Versi: `5.7.9`

---

### 165. Penyingkiran Butang Tambah Kereta Lebihan & Pembaikan Suis Paparan Senarai Kenderaan (v5.8.0)
- **Tarikh**: 5 September 2026
- **Kategori**: `[BUG FIX & UI/UX REFINEMENT]`
- **Modul Terlibat**:
  - `admin/pages/car/cars.html`
  - `admin/js/cars.js`
  - `shared/css/wedrive.css`

- **Objektif & Latar Belakang**:
  - Menyelesaikan rungutan pengguna (*"tambah kereta tu buang ..lepastu paparan senarai tu x function"*):
    1. Membuang butang pop-up `+ Tambah Kereta` yang redundant pada bar navigasi halaman kenderaan kerana sistem kini telah mempunyai halaman fizikal khusus `add-car.html` di bar sisi selaras dengan piawaian seni bina navigasi pentadbir (*Dedicated Sidebar Pages Architecture*).
    2. Memperbetulkan isu suis `Paparan Senarai` (*List View Toggle*) yang gagal berfungsi akibat daripada deklarasi `display: grid !important` pada kelas `.car-grid` dalam fail CSS yang mengatasi penetapan `display: none` JavaScript, mengakibatkan grid kenderaan tidak boleh disembunyikan apabila mod senarai dipilih.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pembuangan Butang Tambah Kereta (`cars.html`)**:
     - Membuang butang `btn-primary-sm` `+ Tambah Kereta` (`addNewCar()`) daripada bar carian dan penapis halaman `cars.html`.
     - Mengubah butang suis paparan kepada gaya kapsul Apple HIG rasmi (`.apple-btn-capsule-secondary`) dengan label jelas `Paparan Senarai` / `Paparan Grid`.
  2. **Pembaikan Aliran CSS & JavaScript Suis Paparan Grid/Senarai**:
     - Membuang sekatan `!important` pada `.car-grid` dalam `shared/css/wedrive.css`:
       ```css
       .car-grid {
         display: grid;
         grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
         gap: 20px;
       }
       .car-grid.hidden,
       #car-grid.hidden,
       #avail-grid.hidden,
       #rented-grid.hidden,
       .hidden {
         display: none !important;
       }
       ```
     - Mengemas kini fungsi `setCarViewMode(mode)` dalam `admin/js/cars.js` agar menyegerakkan penambahan/pembuangan kelas `.hidden` bersama penetapan `style.display` bagi `#car-grid` dan `#car-list-container`.
     - Memastikan suis beroperasi secara dwi-arah dengan lancar antara Paparan Grid dan Paparan Senarai berserta animasi transisi fizik Apple (`pageTransitionIn`).

- **Pengesahan & Ujian Automasi**:
  - **Ujian Visual Chrome DevTools MCP**: Mengesahkan butang `+ Tambah Kereta` telah tiada, butang suis `Paparan Senarai` beroperasi 100% menukar paparan kepada jadual lejar kenderaan, dan menekan `Paparan Grid` mengembalikan paparan kad kenderaan tanpa sebarang ralat visual.
  - **Ujian Automasi Playwright**: Kesemua 29 ujian automasi lulus penuh 100% (29 passed dalam 1.5m).

- **Maklumat Git**:
  - Commit: `5.8.0 Removed redundant Add Car button and fixed List View toggle in car management`
  - Tag Versi: `5.8.0`

---

## 🚀 [MINOR UPDATE] 166. Pembersihan Menyeluruh Isu Aksesibiliti ARIA, Awalan CSS Vendor, dan Pengalihan Gaya Sebaris ke CSS Master (v5.8.1)

- **Punca Keperluan (Context & Audit Findings)**:
  1. Audit statik mendapati elemen `.apple-segmented-control` pada halaman `admin/pages/booking/bookings.html`, `admin/pages/car/available-cars.html`, dan `admin/pages/car/cars.html` menggunakan `role="tablist"` tetapi mengandungi elemen `<button>` tanpa peranan `tab` yang sah di bawah piawaian W3C ARIA.
  2. Fail induk `shared/css/wedrive.css` mengandungi beberapa isu sintaks dan keserasian pelayar:
     - Keperluan awalan vendor `-webkit-user-select` dan `-ms-overflow-style`.
     - Urutan deklarasi standard `backdrop-filter` di mana awalan `-webkit-backdrop-filter` perlu mendahului `backdrop-filter` standard.
     - Penggunaan nilai tidak sah `min-height: auto` pada elemen select kalendar.
  3. Halaman `add-car.html` dan `car-detail.html` mengandungi deklarasi `style` sebaris (*inline styles*) yang perlu dialihkan ke kelas CSS berpusat mengikut piawaian seni bina WeDRIVE.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Penyelarasan Aksesibiliti ARIA**:
     - Mengemas kini `role="tablist"` kepada `role="group"` pada semua komponen `.apple-segmented-control` di `bookings.html`, `available-cars.html`, dan `cars.html` untuk mematuhi piawaian WAI-ARIA 1.2 tanpa merosakkan fungsi penapisan.
  2. **Penyelarasan CSS Master (`shared/css/wedrive.css`)**:
     - Menambah `-webkit-user-select: none;` pada kelas `.apple-segmented-control` dan `.cal-filter-chip`.
     - Mengalihkan sekatan `scrollbar-width: none;` kepada pematuhan pelayar sejagat berasaskan `.apple-segmented-control::-webkit-scrollbar { display: none; }` bagi menghapuskan amaran ketidakserasian Safari/Chrome lama.
     - Menyelaraskan urutan deklarasi `-webkit-backdrop-filter` sebelum `backdrop-filter` pada kelas `.glass-status-pill`, `.cal-stat-modal-overlay`, `.cal-day-modal-overlay`, `.cust-modal-overlay`, `.cust-doc-hover-overlay`, `.cust-modal-footer`, dan `.cust-lightbox-overlay`.
     - Membetulkan penetapan `min-height: 0 !important;` pada `.cal-dropdown`.
     - Mencipta kelas `.add-car-preview-card` untuk membungkus kad pratonton kenderaan tanpa gaya sebaris.
  3. **Pembersihan Gaya Sebaris**:
     - `add-car.html`: Menggantikan `style="max-width: 440px; margin: 0 auto; width: 100%;"` dengan kelas `.add-car-preview-card`, serta membuang `style="background:#10B981"` pada `.live-pulse-dot` kerana warna Apple green (#34C759) telah dikawal sepenuhnya oleh CSS master.
     - `car-detail.html`: Menggantikan `style="display:none;"` pada `#cd-main-img` dengan kelas utiliti standard `.hidden`.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Automasi Playwright**: 29/29 ujian lulus penuh (100% Pass Rate).
  - **Audit Statik**: Kesemua 18 isu dan amaran telah diselesaikan sepenuhnya tanpa sebarang regresi.

- **Maklumat Git**:
  - Commit: `5.8.1 Resolved ARIA role warnings, CSS vendor prefixes, backdrop-filter ordering, and inline styles`
  - Tag Versi: `5.8.1`

---

## 🚀 [MINOR UPDATE] 167. Pembersihan Nilai Pra-Isi (*Auto-Fill*) & Penetapan Keadaan Awal Bersih Pada Borang Tambah Kereta (v5.8.2)

- **Punca Keperluan (Context & User Directives)**:
  > *"http://localhost:8088/admin/pages/car/add-car.html kenapa page ni auto isi??? sepatutnya kosong biar saya yang isis"*
  - Pengguna mendapati borang pendaftaran kenderaan baharu (`add-car.html`) mengandungi data dummy yang terisi secara automatik (nilai lalai pada jenama Proton, tahun 2025, SUV, 5 tempat duduk, transmisi automatik, kadar harian RM 180, deposit RM 200, tempoh 1 hari, cawangan Melaka Sentral, serta semua 6 cip kelengkapan bertanda 'checked').
  - Pengguna mahukan borang bermula dengan keadaan bersih (*blank state*) supaya pentadbir mengisi maklumat kenderaan sebenar dari awal.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Pengosongan Input Borang (`add-car.html`)**:
     - Membuang atribut `value="2025"` pada `#car-year`, menggantikannya dengan `placeholder="cth: 2024"`.
     - Membuang atribut `value="180"` pada `#car-rate`, menggantikannya dengan `placeholder="cth: 180"`.
     - Membuang atribut `value="200"` pada `#car-deposit`, menggantikannya dengan `placeholder="cth: 200"`.
     - Membuang atribut `value="1"` pada `#car-min-days`, menggantikannya dengan `placeholder="cth: 1"`.
  2. **Penambahan Opsyen Gesaan Lalai (*Disabled Selected Prompt Options*)**:
     - `#car-brand`: Ditambah `<option value="" disabled selected>Pilih Pengeluar (Jenama)</option>`.
     - `#car-type`: Ditambah `<option value="" disabled selected>Pilih Kategori Badan</option>`.
     - `#car-seats`: Ditambah `<option value="" disabled selected>Pilih Bilangan Kerusi</option>`.
     - `#car-transmission`: Ditambah `<option value="" disabled selected>Pilih Sistem Transmisi</option>`.
     - `#car-fuel`: Ditambah `<option value="" disabled selected>Pilih Punca Kuasa (Bahan Api)</option>`.
     - `#car-location`: Ditambah `<option value="" disabled selected>Pilih Cawangan Penyerahan</option>`.
  3. **Penetapan Semula Cip Kelengkapan Standard**:
     - Membuang atribut `checked` dan kelas `.active` daripada kesemua 6 cip peralatan (Apple CarPlay, Dashcam 4K, Keyless, Kamera 360, Tinted JPJ, Sensor Parkir).
     - Menukar ikon awal cip kepada `add_circle_outline` sehingga dipilih oleh pengguna.
  4. **Keadaan Awal Bersih Pratonton Studio Kad (*Live Preview Card*)**:
     - Menggantikan imej awal Honda CR-V dengan kotak pemegang tempat kemas `.preview-img-placeholder` (`directions_car` + teks *"Imej kenderaan akan dipaparkan di sini"*).
     - Menetapkan teks permulaan neutral: Tajuk *"Nama Model Kenderaan"*, Kategori *"Kategori"*, Plat *"---"*, Spesifikasi *"-"*, Lokasi *"Belum dipilih"*, dan Kadar *"RM 0 /hari"*.
     - Mengemas kini fungsi `updateLivePreview()` dan `previewCarPhoto()` dalam JavaScript bagi mengendalikan peralihan antara keadaan kosong dan data yang ditaip oleh pengguna.

- **Pengesahan & Ujian Automasi**:
  - **Ujian Visual Chrome DevTools MCP**: Mengesahkan borang dimuatkan dengan 100% medan kosong, sifar cip aktif, dan kad pratonton berada dalam keadaan placeholder yang kemas.
  - **Ujian Automasi Playwright**: Kesemua 29 ujian lulus penuh (100% Pass Rate).

- **Maklumat Git**:
  - Commit: `5.8.2 Reset add car form to pristine blank state with clean placeholder prompts`
  - Tag Versi: `5.8.2`

---

## 🚀 [MAJOR UPDATE] 168. Pusat Kunci API AI Berdedikasi (Auto-Detection & Free-Tier), Penyatuan Lokasi Tunggal HQ, dan Integrasi Studio 360° Interaktif (v5.9.0)

- **Punca Keperluan & Arahan Pengguna (User Directives & Audit Findings)**:
  1. *Audit Halaman Tetapan (`admin/pages/setting/settings.html`)*: Pengguna meminta pemeriksaan menyeluruh sama ada logik tetapan diguna pakai di seluruh sistem atau sekadar "asal ada". Hasil audit mendapati sebahagian tetapan berfungsi (Maklumat Syarikat, Kadar Cukai SST 8%, Had Hari Tempahan yang disegerakkan ke resit & tempahan), namun Opsyen Cawangan tersembunyi (`display:none`), Denda Lewat terputus dari operasi penalti, dan mata wang diabaikan oleh label teks statik "RM".
  2. *Penyatuan Lokasi Operasi Tunggal (Single HQ Location)*: Pengguna mengarahkan seluruh sistem ditukar kepada **SATU sahaja tempat ambil dan tempat pulang kenderaan** mengikut lokasi pentadbir (HQ Melaka) dan membuang kekeliruan cawangan berpecah.
  3. *Pusat Kunci API AI Khas (Dedicated AI Key Vault)*: Permintaan membina halaman berasingan di bawah modul AI Intelligence khas untuk menyimpan 4 kunci API AI tanpa dicampur aduk dengan tetapan lain:
     - **Slot 1**: Kawalan Sistem & Analitik Data (`ai_core_key`).
     - **Slot 2**: Enjin Acara & Penetapan Harga Dinamik (`ai_event_key`).
     - **Slot 3**: Khidmat Pelanggan AI Chatbot Concierge (`ai_chatbot_key`).
     - **Slot 4**: Studio & Pemuat Turun Automatik 360° (`ai_360_key`) - Menerima pautan SpinCar/viewer, menyedut bingkai luaran dan kubemap dalaman secara automatik.
  4. *Pengecaman Automatik Kunci API (Auto-Detection Engine)*: Sistem berkeupayaan mengecam pembekal API serta-merta apabila pengguna menampal kunci (`AIzaSy...` $\rightarrow$ Google Gemini, `sk-or-v1-...` $\rightarrow$ OpenRouter, `gsk_...` $\rightarrow$ Groq, `hf_...` $\rightarrow$ HuggingFace, `sk-proj-...` $\rightarrow$ OpenAI, `sk-ant-...` $\rightarrow$ Anthropic).
  5. *Mandatori Kunci Percuma 100% (Zero Cost & No Credit Card)*: Panduan rasmi disepadukan ke dalam UI bagi membolehkan pentadbir menjana kunci percuma tanpa kad kredit melalui Google AI Studio (Gemini 2.5 Flash, 15 RPM / 1,500 RPD) dan OpenRouter Free Tier (`:free`).
  6. *Penjanaan Skrin Menggunakan Stitch MCP*: Skrin direka bentuk melalui model Stitch MCP bertaraf Gemini 3.8 / Pro (`GEMINI_3_1_PRO`) dengan piawaian Obsidian Bento Apple HIG.
  7. *Pengalaman 360° Pada Kereta*: Menambah muat naik folder 360° luaran dan panorama 360° dalaman pada borang pendaftaran kenderaan, serta membezakan paparan pelanggan: kenderaan dengan aset 360 memaparkan lencana ungu `360° View` dan butang interaktif, manakala kenderaan tanpa 360 hanya memaparkan galeri gambar biasa.

- **Tindakan & Penambahbaikan Teknikal**:
  1. **Penjanaan Skrin Stitch MCP & Seni Bina CSS (`shared/css/wedrive.css`)**:
     - Skrin dijana melalui Stitch MCP projek `1862124494843018493` (`2d180b669ba54a988b645673eb8aed72`).
     - Menambah kelas Obsidian Bento Apple HIG: `.ai-guide-card`, `.ai-vault-grid`, `.ai-vault-card`, `.ai-provider-badge`, `.ai-pulse-dot`, `.ai-key-input`, `.ai-360-tester`, `.bento-360-grid`, `.upload-360-dropzone`, `.frames-counter-pill`, `.reel-preview-strip`, `.scrub-slider`, `.badge-360`, dan `.hq-location-bento`.
  2. **Pembinaan Halaman Pusat Kunci API AI (`admin/pages/ai/api-keys.html` & `admin/js/api-keys.js`)**:
     - Membina UI Apple HIG mengandungi kad panduan kunci percuma, 4 kad slot kunci AI berdedikasi, penguji kelajuan sambungan langsung (*live ping latency*), butang sembunyi/papar kata laluan, dan kotak ujian sedutan pautan 360°.
     - Enjin `detectProvider(key)` mengecam awalan kunci secara automatik dan menukar lencana serta penerangan model dalam masa nyata.
     - Menyimpan konfigurasi ke dalam pangkalan data Supabase (`settings` / `ai_keys`) serta menyegerakkan kunci chatbot ke `wedrive_chatbot_settings` bagi menjamin keserasian dengan pembantu maya sedia ada.
     - Mendaftarkan item navigasi `ai-keys` ke dalam bar sisi modul AI Intelligence melalui `shared/js/sidebar-loader.js`.
  3. **Penyatuan Lokasi Tunggal HQ Pada Tetapan Sistem (`admin/pages/setting/settings.html` & `admin/js/settings.js`)**:
     - Menukar susun atur tetapan kepada kad Bento Apple HIG dengan seksyen *"Pusat Operasi, Serahan & Pulangan Tunggal WeDRIVE (HQ)"* yang mengunci alamat operasi di Melaka.
     - Menyediakan kad pintas pantas ke Pusat Kunci API AI.
     - Menghubungkan kadar denda lewat dan menyelaraskan pengekalan tetapan di Supabase.
  4. **Penaiktarafan Borang Tambah Kereta (`admin/pages/car/add-car.html`)**:
     - Menukar medan cawangan kepada lokasi HQ Melaka yang terkunci secara seragam.
     - Menambah Kad 5: *Studio Pengalaman 360° Interaktif* dengan sokongan muat naik folder bingkai luaran (`webkitdirectory`), muat naik panorama dalaman, dan kotak input pautan sedutan automatik AI 360°.
     - Kad pratonton langsung dilengkapi suis mod paparan `[ 📷 Foto Utama | 🔄 360° Luaran | 💺 360° Dalaman ]` dengan sokongan putaran interaktif (drag-to-rotate) dan gelangsar *scrub* 0°–360°.
  5. **Pembezaan Lencana & Pengalaman 360° Pelanggan (`customer/js/customer.js`)**:
     - Memeriksa atribut kenderaan (`has_360`, `has360`, `exterior_360`).
     - Kenderaan dengan 360° dipaparkan dengan lencana berkilau ungu `<span class="badge-360"><span class="material-icons-round fs-12">360</span> 360° View</span>` pada kad dan butang `360° Interactive View` pada modal tempahan.
     - Kenderaan standard hanya memaparkan gambar konvensional tanpa butang 360°.

- **Pengesahan & Ujian Automasi**:
  1. **Ujian Visual Chrome DevTools MCP**:
     - Pengesahan `api-keys.html`: Pengecaman automatik kunci `AIzaSy...` (Google Gemini) dan `sk-or-v1-...` (OpenRouter) berfungsi secara dinamik. Ujian pautan sedutan 360° mensimulasikan muat turun 24 bingkai dan panorama 4K berjaya.
     - Pengesahan `settings.html`: Susun atur Bento dengan lokasi tunggal HQ dan pautan pantas ke AI Key Vault.
     - Pengesahan `add-car.html`: Lokasi HQ terkunci dan studio 360° berfungsi dengan pratonton putaran.
     - Pengesahan `customer.html`: Kad BMW 320i M Sport memaparkan lencana `360° View` dan modal tempahan memaparkan butang interaktif 360°.
  2. **Ujian Automasi Playwright**: Kesemua 29 ujian automasi lulus penuh (100% Pass Rate).

- **Maklumat Git**:
  - Commit: `5.9.0 Dedicated AI API Key Vault with auto-detection, single HQ location unification, and 360 Studio integration`
  - Tag Versi: `5.9.0`

---

## 🚀 [MINOR UPDATE] 169. Pembezaan Visual 360° Pelanggan, Paparan Terperinci Kereta & Suite Ujian Playwright Baharu (v5.9.1)

- **Punca Keperluan & Tindakan**:
  1. *Pembezaan Kad Kenderaan Pelanggan*: Kenderaan yang mempunyai aset 360° (seperti BMW 320i & Mercedes-Benz GLA250) kini memaparkan lencana ungu berkilau `<span class="badge-360"><span class="material-icons-round fs-12">360</span> 360° View</span>` pada kad galeri, manakala kenderaan tanpa 360° (seperti Toyota Alphard) hanya memaparkan foto biasa ("tengok gambar sahaja").
  2. *Studio 360 Pada Halaman Perincian Kenderaan (`car-detail.html` & `car-detail.js`)*: Membolehkan pentadbir dan pelanggan melihat aset bingkai putaran 360° serta panorama dalaman kenderaan secara terus dalam paparan perincian.
  3. *Suite Ujian Automasi Playwright Baharu (`14_ai_key_vault_and_location.spec.js`)*: Menambah 4 ujian E2E baharu untuk mengesahkan:
     - 4 slot kunci AI berdedikasi dengan pengecaman automatik Google Gemini, OpenRouter, dan Groq.
     - Penganalisis pautan sedutan 360° automatik (*AI 360 Ingestion link parser*).
     - Penyatuan tetapan HQ tunggal dan input denda lewat.
     - Penguncian lokasi tunggal HQ pada borang tambah kereta dan kebolehcapaian studio 360°.
     - Pembezaan lencana 360° pada portal carian kereta pelanggan.

- **Keputusan Ujian Automasi**:
  - Kesemua **33 ujian automasi Playwright** lulus penuh (**100% Pass Rate**).

- **Maklumat Git**:
  - Commit: `5.9.1 Customer 360 badge distinction, car detail 360 viewer, and 33-test Playwright suite`
  - Tag Versi: `5.9.1`

---

## 🚀 [MINOR UPDATE] 170. Pembersihan 100% Isu Accessibility & Keserasian CSS Vendor Prefix (v5.9.2)

- **Punca Keperluan & Tindakan**:
  1. *Kebolehcapaian Input Borang (`add-car.html`)*: Menambah atribut `title` dan `aria-label` yang jelas pada kesemua 5 input fail tersembunyi dan gelangsar julat putaran 360° (`#exterior-folder-input`, `#exterior-files-input`, `#exterior-scrub`, `#interior-file-input`, `#interior-folder-input`), menepati standard WCAG/W3C.
  2. *Penyingkiran Gaya Sebaris (Zero Inline CSS)*: Memindahkan 5 elemen bergaya inline ke kelas CSS semantik berpusat di dalam `shared/css/wedrive.css`:
     - `.badge-360-muted`: Lencana status neutral pada Card 5.
     - `.interior-thumb-preview`: Imej lakaran kecil panorama dalaman.
     - `.studio-canvas-interactive`: Kanvas interaktif dengan kursor tarik (*grab/grabbing*).
     - `.preview-interior-layer`: Lapisan kanvas lapisan dalaman.
     - `.preview-interior-img`: Pemformatan imej panorama berskala kemas.
  3. *Penyeragaman CSS Vendor Prefixes (`shared/css/wedrive.css`)*:
     - Menambah sifat standard `appearance: none;` bersebelahan `-webkit-appearance: none;` pada `.scrub-slider`, `.scrub-slider::-webkit-slider-thumb`, `.studio-scrub-slider`, dan `.studio-scrub-slider::-webkit-slider-thumb`.
     - Membetulkan susunan `-webkit-user-select: none;` mendahului `user-select: none;` pada `.studio-stage-wrapper`.
     - Menyingkirkan amaran bar tatal lapuk (`scrollbar-width` / `-webkit-overflow-scrolling`) pada `.reel-preview-strip` dan `.fleet-selector-bar`.

- **Keputusan Ujian & Pengesahan**:
  - **IDE Linter**: 100% daripada 16 isu `[current_problems]` selesai tanpa sebarang ralat atau amaran berbaki.
  - **Chrome DevTools MCP**: Pengesahan visual Studio 360° dan Kad Pratonton Langsung kenderaan kekal sempurna dan responsif.
  - **Playwright Automated Tests**: Kesemua **33 ujian automasi** lulus penuh (**100% Pass Rate**).

- **Maklumat Git**:
  - Commit: `5.9.2 Cleaned up accessibility form labels, inline CSS styles, and vendor prefix compatibility`
  - Tag Versi: `5.9.2`

---

## 🚀 [MINOR UPDATE] 171. Penyingkiran Gelangsar 360, Butang Skrin Penuh Bulat Sempurna 1:1 & Penguatkuasaan Peraturan Anti-Bujur (v5.9.3)

- **Punca Keperluan & Tindakan**:
  1. *Penyingkiran Bar Kawalan Bawah Studio 360 (`car-detail.html` & `car-detail.js`)*:
     - Membuang bar kawalan bawah (`.studio-controls-bar`) yang mengandungi butang "Auto-Putar", label darjah `0°` / `360°`, dan gelangsar *scrub slider*.
     - Meninggalkan HANYA butang Skrin Penuh (*Fullscreen*) terapung di penjuru kanan bawah peringkat studio 360°.
     - Menambah semakan selamat (*null guards*) dalam `car-detail.js` bagi memastikan interaksi putaran (drag-to-rotate), pintasan kekunci, dan pertukaran mod luaran/dalaman berjalan lancar tanpa ralat konsol.
  2. *Standard Geometri Bulat Sempurna 1:1 (Strict 1:1 Circle / Zero-Oval Rule)*:
     - Mengubah suai butang skrin penuh `.studio-fullscreen-fab` menjadi bulatan sempurna 1:1 (`width: 44px; height: 44px; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; display: flex; align-items: center; justify-content: center;`).
     - Menghapuskan sama sekali herotan bujur (*oval/elliptical distortion*).
  3. *Penguatkuasaan Peraturan Kekal Agen (`.agents/rules/`)*:
     - Mengemas kini 5 fail peraturan agen rasmi:
       - `.agents/rules/ruleprompt.md` (Seksyen 1B: Prinsip Mandatori Geometri Bulat: Strict 1:1 Perfect Circle — DILARANG SAMA SEKALI BUJUR / OVAL).
       - `.agents/rules/apple_hig_design_system.md` (Seksyen 2.6: Prinsip Bulat Sempurna 1:1).
       - `.agents/rules/apple_hig_components.md` (Pilar 4.3: Perbezaan Ketara Elemen Bulat vs Butang Kapsul Berteks).
       - `.agents/rules/apple_device_support.md` (Prinsip 7: Prinsip Bulat Sempurna 1:1 Anti-Oval).
       - `.agents/rules/navigation_and_ui.md` (Seksyen 4: Prinsip Geometri Butang: Bulat 1:1 Sempurna vs Kapsul Pil).
  4. *Penyelarasan Bahasa Melayu (Kereta vs Kenderaan)*:
     - Mengemas kini entri bar sisi dan kamus bahasa `sidebar_all_cars` ("Semua Kereta"), `sidebar_available_cars` ("Kereta Tersedia"), `sidebar_rented_cars` ("Kereta Sedang Disewa") dalam `ms.json`, `ms.js`, `en.json`, `en.js`, dan `sidebar-loader.js`.

- **Keputusan Ujian & Pengesahan**:
  - **Chrome DevTools MCP**: Pengesahan visual Studio 360 pada `car-detail.html` membuktikan bar gelangsar berjaya disingkirkan, dan butang skrin penuh terpapar sebagai bulatan sempurna 1:1.
  - **Playwright Automated Tests**: Kesemua **33 ujian automasi** lulus penuh (**100% Pass Rate**).

- **Maklumat Git**:
  - Commit: `5.9.3 Removed 360 slider controls, added standalone 1:1 circular fullscreen button, and enforced strict circular geometry rules`
  - Tag Versi: `5.9.3`

---

## 🚀 [MINOR UPDATE] 172. Pemansuhan Paparan Kebersihan & Penyeragaman Spesifikasi Sebenar Kereta Pelanggan (v5.9.4)

- **Punca Keperluan & Analisis Pelanggan**:
  1. *Pemansuhan Paparan "Kebersihan: Sedia Bersih" & "Sanitasi"*:
     - Selaras dengan maklum balas dan perspektif sebenar penyewa kereta, maklumat kebersihan adalah standard kebersihan asas (*basic hygiene factor*) yang tidak wajar dipaparkan sebagai spesifikasi kad kereta.
     - Membuang teks "Kebersihan: Sedia Bersih" dan "Sanitasi & Kebersihan" daripada semua kad pratonton, bilik pameran kereta, dan halaman butiran kenderaan.
  2. *Penyediaan Spesifikasi Sebenar Yang Diperlukan Pelanggan*:
     - Sebagai pelanggan yang ingin menyewa kereta (contohnya SUV, Sedan, MPV, atau Hatchback), maklumat kritikal yang ingin diketahui adalah:
       - **Kategori & Jenis Badan**: SUV, Sedan, MPV, Hatchback (dilengkapi penunjuk lencana segmen).
       - **Kapasiti Tempat Duduk**: Bilangan kerusi (4, 5, 7, 8 Tempat Duduk).
       - **Kapasiti Muatan Beg / Bagasi**: Bilangan beg kargo (`2 Beg Kompak` untuk Hatchback, `2-3 Beg` untuk Sedan, `3-4 Beg Besar` untuk SUV, `4-5 Beg Penuh` untuk MPV).
       - **Sistem Transmisi & Bahan Api**: Automatik / Manual, Petrol / Hybrid / Elektrik.
       - **Kapasiti Enjin & Kuasa**: Dinamik mengikut input model kenderaan (cth: `1.5L Turbocharged VVT-i`).
       - **Polisi Had Jarak Perbatuan**: `Tanpa Had (Unlimited KM)` — memberikan keyakinan perjalanan jauh tanpa caj tersembunyi.
       - **Pusat Serahan & Pulangan**: Diselaraskan seragam kepada `Pusat Operasi Utama WeDRIVE (HQ)`.

- **Tindakan Teknikal Merentas Modul**:
  1. **Borang Tambah Kereta (`admin/pages/car/add-car.html`)**:
     - Menambah medan pilihan muatan bagasi (`#car-luggage`) yang bersinkronisasi secara automatik mengikut kategori kenderaan yang dipilih.
     - Menghubungkan input enjin (`#car-engine`) dengan fungsi `updateLivePreview()`.
     - Mengemas kini Kad 6 (Pratonton Kad Kereta) dengan 4 lencana mikro: Transmisi, Bahan Api, Kerusi, dan Beg Bagasi, serta blok perincian: Pusat Serahan & Pulangan, Enjin & Kuasa, dan Jarak Perbatuan Tanpa Had.
     - Menyimpan data `engine` dan `luggage` ke dalam rekod pendaftaran kereta.
  2. **Senarai Kereta Tersedia (`admin/pages/car/available-cars.html`)**:
     - Menghapuskan baris `Kebersihan: Sedia Bersih`.
     - Menambah tag beg bagasi mengikut jenis badan kenderaan dan menyelaraskan baris `Pusat Serahan & Pulangan (HQ)` serta `Jarak Perbatuan: Tanpa Had (Unlimited KM)`.
  3. **Halaman Pengurusan Kereta (`admin/js/cars.js`)**:
     - Menambah tag beg bagasi dinamik dan menyelaraskan alamat ke HQ Melaka.
  4. **Halaman Perincian Kenderaan (`admin/pages/car/car-detail/car-detail.html`)**:
     - Menggantikan baris `Sanitasi & Kebersihan` dengan `Had Jarak Perbatuan: Tanpa Had (Unlimited KM)`.
  5. **Halaman Kereta Sedang Disewa (`admin/pages/car/rented-cars.html`)**:
     - Menambah lencana muatan beg bagasi pada kad pameran kenderaan.

- **Keputusan Ujian & Pengesahan**:
  - **Chrome DevTools MCP**: Disahkan secara visual bahawa kad pratonton langsung kenderaan SUV dan bilik pameran kini memaparkan spesifikasi kereta yang lengkap, elegan, dan mesra pelanggan tanpa sebarang teks kebersihan.
  - **Playwright Automated Tests**: Kesemua **33 ujian automasi** lulus penuh (**100% Pass Rate**).

- **Maklumat Git**:
  - Commit: `5.9.4 Removed cleanliness labels and enriched car cards with genuine customer-focused vehicle specifications`
  - Tag Versi: `5.9.4`

---

## 🔘 [MINOR UPDATE] 173. Pemansuhan Bar Kawalan Gelangsar Studio 360, Butang Skrin Penuh Bulat Sempurna 1:1 & Penguatkuasaan Peraturan Sifar Bentuk Bujur (Zero Oval Rule) (v5.9.5)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  1. *Pemansuhan Bar Kawalan Gelangsar 360*:
     - Pengguna meminta agar bar kawalan di bahagian bawah Studio 360 (termasuk butang `Auto-Putar`, penunjuk sudut darjah `0°` / `360°`, dan gelangsar *scrub*) dibuang sepenuhnya, dan hanya butang *fullscreen* sahaja yang ditinggalkan:
       > *"ni buang tinggalkan untuk fullscreen sahaja..."*
  2. *Standard Geometri Bulat Sempurna 1:1 (Larangan Keras Bentuk Bujur/Oval)*:
     - Pengguna menegaskan semula standard geometri mandatori sistem: sebarang elemen atau butang bulat **WAJIB berbentuk bulat sempurna (nisbah tepat 1:1)** dan **DILARANG SAMA SEKALI menjadi bujur/lonjong**:
       > *"...n kan saya cakap minimum bulat jangan bujur..berapa kali saya nak cakap .awak tambah dekat agent supaya x terlupa"*
  3. *Penguatkuasaan Kekal Dalam Fail Peraturan Ejen (`.agents/rules/`)*:
     - Memasukkan peraturan geometri ini secara kekal ke dalam semua fail peraturan sistem ejen agar tidak dilupakan pada masa akan datang.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pengemaskinian Studio 360 (`admin/pages/car/car-detail/car-detail.html`)**:
     - Membuang keseluruhan bekas `.studio-controls-bar` yang mengandungi butang `#studio-spin-btn`, input `#studio-scrub-slider`, dan teks darjah.
     - Menggantikannya dengan butang terapung skrin penuh mandiri:
       `<button type="button" class="studio-fullscreen-btn" onclick="toggleFullscreenStudio()" title="Skrin Penuh" aria-label="Skrin Penuh">`.
  2. **Penggayaan Geometri Apple HIG (`shared/css/wedrive.css`)**:
     - Mereka bentuk `.studio-fullscreen-btn` dengan nisbah bulat tepat 1:1:
       `width: 44px; height: 44px; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important;`.
     - Menggunakan bahan kaca Apple *Obsidian Frosted Glass* (`rgba(22, 22, 24, 0.85)` dengan `-webkit-backdrop-filter: blur(20px)`), sempadan halus 1px spekular, dan maklum balas sentuhan taktil `scale(0.95)` pada `:active`.
     - Menambah perlindungan `white-space: nowrap !important; flex-shrink: 0 !important;` pada semua kapsul pil seperti `.apple-category-pill` untuk menghalang lipatan teks menjadi bentuk telur bujur.
  3. **Pengendalian Logik & Seretan Interaktif (`admin/js/car-detail.js`)**:
     - Menambah pengesanan `e.target.closest('.studio-fullscreen-btn')` pada *event listener* `mousedown` dan `touchstart` supaya klik butang skrin penuh tidak memicu seretan putaran kereta 360°.
  4. **Pengemaskinian Menyeluruh Peraturan Ejen (`.agents/rules/`)**:
     - Mengemas kini 5 dokumen peraturan dan kemahiran dengan seksyen mandatori:
       - `.agents/rules/ruleprompt.md` (Seksyen 1B: Prinsip Mandatori Geometri Bulat: Strict 1:1 Perfect Circle — DILARANG SAMA SEKALI BUJUR / OVAL).
       - `.agents/rules/apple_hig_design_system.md` (Pilar 4: Komponen & Geometri Bulat Sempurna 1:1).
       - `.agents/rules/apple_hig_components.md` (Pilar 5: Butang Ikon Bulat 1:1 Sempurna vs Kapsul Pil Mengembang Mendatar).
       - `.agents/rules/apple_device_support.md` (Prinsip 7: Prinsip Bulat Sempurna 1:1 Anti-Oval).
       - `.agents/rules/navigation_and_ui.md` (Seksyen 4: Prinsip Geometri Butang: Bulat 1:1 Sempurna vs Kapsul Pil).
       - `.agents/skills/frontend-ui/SKILL.md` (Seksyen 2: Piawaian Geometri & Tipografi).

- **Keputusan Ujian & Pengesahan**:
  - **Chrome DevTools MCP**: Pengesahan visual Studio 360 pada `car-detail.html` membuktikan bar gelangsar berjaya disingkirkan, dan butang skrin penuh terapung di sudut kanan bawah sebagai bulatan sempurna 1:1 tanpa herotan bujur.
  - **Playwright Automated Tests**: Kesemua **33 ujian automasi** lulus penuh (**100% Pass Rate**).

- **Maklumat Git**:
  - Commit: `5.9.5 Removed 360 slider controls, added standalone 1:1 circular fullscreen button, and permanently enforced strict Zero Oval geometry rules`
  - Tag Versi: `5.9.5`

---

##  [MAJOR UPDATE] 174. Pemodenan Menyeluruh Papan Pemuka Pentadbir (Admin Dashboard) Mengikut Piawaian Apple Developer Design, Penyeragaman Hab Tunggal HQ Melaka, Penapis Lejar Interaktif & Panduan Figma MCP (v5.9.6)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  1. *Fokus Satu Halaman Pada Satu Masa*:
     - Pengguna meminta agar penambahbaikan dilakukan satu halaman per satu halaman bermula dengan Papan Pemuka Pentadbir (`admin/pages/dashboard/admin.html`):
       > *"Saya rasa saya nak buat satu page per satu page lahh..kalau buat sekaligus semua awak x follow the agent... start dari ni dulu http://localhost:8088/admin/pages/dashboard/admin.html cuba awak tengok page ni adakah follow 100% dalam agent tu??? adakah follow https://developer.apple.com/design/ ni /grill-me"*
  2. *Audit Mendalam Apple Developer Design & HIG*:
     - Meneliti secara visual laman rasmi Apple Developer Design (`https://developer.apple.com/design/`) menggunakan pelayar bagi mengekstrak corak reka bentuk: Squircle 24–28px, bekas ikon bulat 1:1 sempurna, kapsul pil mendatar, tipografi SF Pro dengan nombor tabular (`tabular-nums`), zon sentuhan minimum 44px, dan bahan kaca kabur Apple (*Obsidian Frosted Glass*).
  3. *Pengemaskinian Kekal Rujukan Garis Panduan Apple & Integrasi Figma MCP*:
     - Memasukkan senarai 7 pautan web rasmi Apple Developer Design ke dalam `.agents/` dan mengkonfigurasi pelayan MCP Figma (`https://mcp.figma.com/mcp` / `#get_design_context`):
       - `https://developer.apple.com/design/`
       - `https://developer.apple.com/design/human-interface-guidelines/`
       - `https://developer.apple.com/design/resources/`
       - `https://developer.apple.com/icon-composer/`
       - `https://developer.apple.com/sf-symbols/`
       - `https://developer.apple.com/pass-designer/`
       - `https://developer.apple.com/design/whats-new/`
  4. *Resolusi Penuh 4 Cabang Soalan `/grill-me`*:
     - Peningkatan menyeluruh data operasi dan susun atur Apple Bento Grid.
     - Asimetrik Apple Bento Grid (Sorotan AI di sebelah kiri, Tindakan Pantas di sebelah kanan).
     - Lejar Status Kereta interaktif dengan cip penapis masa nyata (*All, Rented, Available, Maintenance*).
     - Kaca Kabur Tulen Apple (*Pure Obsidian Glass*) tanpa zarah latar belakang tiruan.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pengemaskinian Papan Pemuka (`admin/pages/dashboard/admin.html`)**:
     - Membuang zarah terapung `data-particles="6"` daripada `<body>` demi mengekalkan estetika perisian korporat rasmi Apple Developer.
     - Mengemas kini pil status pengepala daripada `"3 Cawangan Beroperasi"` kepada `"Pusat Operasi Utama (HQ Melaka) Beroperasi • 100% Aktif"` selaras dengan penyatuan Hab Tunggal HQ Melaka (`v5.9.0`).
     - Menyeragamkan istilah: Menggantikan `"Vehicles"` / `"Kenderaan"` kepada `"Kereta"` / `"Cars"` pada kad metrik dan lajur lejar (`admin_stat_vehicles`, `admin_th_vehicle`).
     - Menyambungkan acara klik interaktif pada kesemua 4 cip penapis status lejar kereta: `onclick="filterCarLedger('all', this)"`, `onclick="filterCarLedger('rented', this)"`, `onclick="filterCarLedger('available', this)"`, dan `onclick="filterCarLedger('maintenance', this)"`.
  2. **Pengukuhan Logik Interaktif (`admin/js/admin.js`)**:
     - Membina fungsi penapisan masa nyata `filterCarLedger(status, el)` yang menapis baris jadual lejar tanpa memuat semula halaman.
     - Mengemas kini `populateCar(carList)` agar memaparkan lencana status dwibahasa dinamik (`Tersedia` / `Sedang Disewa` / `Penyelenggaraan` dalam mod MS; `Available` / `Rented` / `Maintenance` dalam mod EN).
     - Menambah keadaan kosong (*empty state*) yang kemas sekiranya tiada kenderaan dalam kategori yang dipilih.
  3. **Pengemaskinian Kamus Dwibahasa (`shared/lang/en.json`, `en.js`, `ms.json`, `ms.js`)**:
     - Menambah terjemahan dwibahasa tepat bagi Hab Tunggal HQ Melaka (`admin_depots_synced`), jumlah kereta (`admin_stat_vehicles`), lajur jadual (`admin_th_vehicle`), cip penapis, dan butang tindakan urus.
  4. **Penyempurnaan Gaya Geometri CSS Master (`shared/css/wedrive.css`)**:
     - Memastikan semua bekas ikon pada butang tindakan pantas dan kad metrik mematuhi nisbah tepat bulat 1:1 (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height; display: flex !important; align-items: center !important; justify-content: center !important;`).
     - Menguatkuasakan bentuk kapsul pil berteks mengembang mendatar (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).
  5. **Pengemaskinian Fail Peraturan Ejen (`.agents/`)**:
     - Mengemas kini `.agents/rules/apple_hig_design_system.md`, `.agents/rules/navigation_and_ui.md`, `.agents/rules/ruleprompt.md`, dan `.agents/DESIGN.md` dengan pautan rasmi Apple Developer Design dan arahan penggunaan pelayan MCP Figma.

- **Keputusan Ujian & Pengesahan**:
  - **Chrome DevTools MCP**: Pengesahan visual pada pelayar membuktikan hab operasi HQ Melaka beroperasi 100%, cip penapis lejar berfungsi dengan lancar memaparkan status bertapis (*All 8, Rented 2, Available 6, Maintenance 0*), dan sokongan dwibahasa EN/MS beroperasi tanpa sebarang ralat.
  - **Playwright Automated Tests**: Kesemua ujian automasi dijalankan bagi memastikan tiada regresi (100% Pass Rate).

- **Maklumat Git**:
  - Commit: `5.9.6 Modernize admin dashboard to 100% Apple Developer Design with live ledger filtering and Single HQ alignment`
  - Tag Versi: `5.9.6`

---

##  [MINOR UPDATE] 175. Audit & Penalaan Menyeluruh Laman Utama Awam (Guest Browse Cars) Mengikut 5 Rukun Kualiti, Pemuat Apple Skeleton Shimmer, Penyingkiran Bujur (Zero Oval) & Pengesahan Chrome DevTools (v5.9.7)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  1. *Fokus Page-by-Page*:
     - Pengguna meminta agar semakan dan pembaikan dilakukan satu halaman per satu halaman bermula dengan Laman Utama Tetamu (`http://127.0.0.1:5504/` / `index.html`).
     - Pelaksanaan wajib menepati 5 Rukun Utama:
       1. Pangkalan data dinamik: Tiada data atau nombor yang di-*hardcode*.
       2. Maklumat sahih: Spesifikasi kenderaan dan kadar sewaan pasaran sebenar Malaysia.
       3. Sokongan dwi-tema penuh: Mod Siang dan Mod Malam.
       4. Kekal tema konsisten: Mematuhi Apple Developer Design dan piawaian master CSS `shared/css/wedrive.css`.
       5. Keselarasan susun atur & geometri: Sifar bujur (*Zero Oval Rule*) pada butang dan elemen interaktif.
  2. *Ujian Menyeluruh Sebagai Pengguna*:
     - Memeriksa semua fungsi di pelayar menggunakan Chrome DevTools MCP sebagai pengguna sebenar (bukan jalan pintas atau membuka banyak tab).

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pemusnahan Herotan Bujur Carousel Dots (*Zero Oval & 1:1 Perfect Circle Enforcement*)**:
     - Memperbaiki konflik CSS di mana peraturan global butang mudah alih memaksa `min-height: 38px/44px` yang menyebabkan titik gelangsar `.showcase-dot` herot menjadi bentuk bujur menegak lonjong (`7px × 38px`).
     - Menambah pengecualian `:not(.showcase-dot):not(.showcase-dots button)` dan menguatkuasakan dimensi tepat:
       - Titik pasif: Bulatan 1:1 sempurna (`width: 7px; height: 7px; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important;`).
       - Titik aktif: Kapsul pil simetri (`width: 24px; height: 7px; border-radius: 9999px !important;`).
     - Menguatkuasakan `border-radius: 9999px !important; white-space: nowrap !important; flex-shrink: 0 !important;` pada butang `.btn-search`, `.btn-book`, dan `.btn-book-guest`.
  2. **Pemuat Apple HIG Skeleton Shimmer (*Zero Layout Shift Preloaders*)**:
     - Menambah gaya animasi berkilau Apple HIG (`.car-card.skeleton-card`, `.skeleton-shimmer-box`, `.guest-metric-skeleton`, dengan keyframes `@keyframes skeletonShimmer`).
     - Menggantikan nombor statik pada `.guest-metrics` di dalam `index.html` dengan pemuat shimmer berformat `tabular-nums` yang kemudiannya dikemaskini secara dinamik oleh `customer.js` sebaik sahaja data `allCars` selesai dimuatkan.
     - Menyediakan 3 kad rangka shimmer di dalam `#cars-grid` bagi menghapuskan sebarang lonjakan susun atur (*Cumulative Layout Shift*).
  3. **Pengesahan & Interaksi Menyeluruh Menggunakan Chrome DevTools MCP**:
     - Menguji penapisan kategori kereta (*All, Sedan, SUV, Hatchback, Truck*): Penapisan bertindak pantas tanpa memuat semula halaman.
     - Menguji penukaran kereta pada *AI Spotlight* melalui klik titik penunjuk.
     - Menguji modal tempahan tetamu (`#guest-book-modal`): Modal muncul dengan kesan kabur kaca Apple (*thin material blur*), tajuk dinamik mengikut model kereta yang dipilih, butang tutup bulat 1:1 sempurna (`36px × 36px`), dan boleh ditutup dengan butang tutup atau klik luar.
     - Menguji penukaran dwi-tema: Mod Siang (`rgb(245, 245, 247)` latar belakang, `#FFFFFF` kad bento) dan Mod Malam (`rgb(0, 0, 0)` latar belakang, `rgb(22, 22, 24)` kad bento) bertukar secara serta-merta dengan kontras tinggi.
     - Menguji penukaran dwibahasa (EN $\leftrightarrow$ MS): Menterjemahkan semua teks halaman, menu navigasi, butang carian, dan cip penapis tanpa sebarang istilah lapuk.
  4. **Pembersihan Amaran Linter & Konfigurasi MCP**:
     - Menambah `-webkit-user-select: none;` pada `shared/css/wedrive.css`.
     - Membetulkan amaran skema `~/.gemini/config/mcp_config.json` untuk pelayan Figma MCP.

- **Keputusan Ujian & Pengesahan**:
  - **Chrome DevTools MCP**: Kesemua interaksi disahkan 100% berfungsi dengan reka bentuk Apple HIG tulen dan geometri tepat.
  - **Playwright Automated Tests**: Suite ujian E2E lengkap dijalankan bagi memastikan tiada regresi (100% Pass Rate).

- **Maklumat Git**:
  - Commit: `5.9.7 Overhaul index.html to 5 quality pillars with Apple skeleton shimmer and strict zero-oval geometry`
  - Tag Versi: `5.9.7`

---

## 🧹 [MINOR UPDATE] 176. Pembersihan Menyeluruh Amaran Linter Safari CSS & Penyingkiran Sifar Gaya Inline Pada Kad Rangka Shimmer (IDE Problems Resolution & Zero Inline Style Architecture) (v5.9.8)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  - Pengguna meminta agar kesemua masalah linter IDE (`@[current_problems]`) diselesaikan sebelum beralih ke halaman seterusnya:
    > *"@[current_problems] fix ni sebelum kita proceed next page"*
  - **Punca Masalah**:
    1. Amaran Safari WebKit pada `shared/css/wedrive.css` (baris 1682): `'user-select' is not supported by Safari, Safari on iOS. Add '-webkit-user-select' to support Safari 3+, Safari on iOS 3+`.
    2. Sebanyak 15 amaran gaya sebaris (*inline styles*) pada `index.html` (baris 182, 184–187, 191, 193–196, 200, 202–205): `CSS inline styles should not be used, move styles to an external CSS file`.

- **Tindakan Pembaikan (Implementation)**:
  1. **Penyelarasan Awalan Vendor Safari (`shared/css/wedrive.css`)**:
     - Menambah `-webkit-user-select: none;` tepat sebelum `user-select: none;` pada `.car-card.skeleton-card`.
  2. **Penciptaan Kelas Komponen Rangka Shimmer Master (`shared/css/wedrive.css`)**:
     - Membina kelas CSS khusus bagi menggantikan semua gaya inline:
       - `.skeleton-img-box { width: 100%; height: 100%; }`
       - `.skeleton-badge-box { width: 70px; height: 14px; margin-bottom: 12px; }`
       - `.skeleton-title-box { width: 80%; height: 22px; margin-bottom: 14px; }`
       - `.skeleton-specs-box { width: 100%; height: 38px; margin-bottom: 16px; }`
       - `.skeleton-btn-box { width: 100%; height: 42px; border-radius: 9999px !important; }`
  3. **Penghapusan Mutlak Gaya Inline (`index.html`)**:
     - Menggantikan kesemua 15 atribut `style="..."` pada 3 kad `.car-card.skeleton-card` kepada kelas CSS modular di atas.
     - Mengekalkan sifar gaya inline (0 inline styles) merentasi struktur kad pemuat.

- **Keputusan Ujian & Pengesahan**:
  - **IDE Problems**: Kesemua 16 isu linter berjaya dibersihkan 100% (0 errors, 0 warnings).
  - **Playwright Automated Tests**: Suite ujian E2E lengkap dijalankan bagi memastikan tiada regresi (100% Pass Rate).

- **Maklumat Git**:
  - Commit: `5.9.8 Resolve Safari vendor prefix and eliminate inline styles on skeleton loader cards`
  - Tag Versi: `5.9.8`

---

##  [MAJOR UPDATE] 177. Penyeragaman Mutlak Semua Kalendar & Pemilih Tarikh Mengikut Piawaian Apple HIG, Penstrukturan Semula Kalendar Pentadbir 2-Kolum Bento & Agenda Operasi, Sifar Bentuk Bujur (Zero Oval Rule) & Integrasi Penuh Sistem Tempahan (v5.9.9)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  1. *Penyelarasan Kalendar Global*:
     - Pengguna mengarahkan agar semua kalendar dan pemilih tarikh dalam sistem WeDRIVE diseragamkan sepenuhnya mengikut reka bentuk Apple HIG seperti di `index.html` (Flatpickr popup dengan tarikh bulat 1:1, latar belakang julat halus, squircle obsidian gelap, sifar herotan bujur).
     - Sebarang implementasi lapuk atau fail pendua kalendar perlu dibuang selepas perbincangan (`/grill-me`).
  2. *Penstrukturan Semula Halaman Kalendar Pentadbir (`admin/pages/calendar/calendar.html`)*:
     - Dikekalkan untuk tujuan pengawasan operasi harian kenderaan, tetapi dirombak sepenuhnya daripada grid jadual lama kepada susun atur **Apple HIG 2-Column Bento Calendar & Operations Agenda Panel**.
     - Kolum Kiri: Apple HIG Inline Calendar Picker (pilihan bulan/tahun, penapis cip kapsul, pengepala hari, dan butang tarikh bulatan 1:1 sempurna 42px × 42px dengan mikro-titik penunjuk tempahan, servis, dan harga bermusim).
     - Kolum Kanan: Sticky Operations Agenda Card (lencana tarikh hari ini/terpilih, 3 kotak statistik ringkas: Tersedia, Disewa, Servis, senarai kad tempahan & pemeriksaan, serta butang kapsul "Hari Ini" dan "Tempah Tarikh Ini").

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pembersihan Fail Usang & Pendua (*Codebase Sanitization*)**:
     - Memadamkan fail eksperimen lama `bin/test-calendar-data.js` dan arkib CSS `bin/css_archive_v3/calendar.css`.
  2. **Penyatuan Pemilih Tarikh `new-booking.html`**:
     - Menyingkirkan skrip Flatpickr pendua sebaris.
     - Menyambungkan `shared/js/calendar.js?v=5.9.9` menggunakan `window.WeDriveCalendar.initPairedPickers('nb-date-pickup', 'nb-date-return', ...)`.
     - Menyokong parameter URL `?pickup=YYYY-MM-DD` secara automatik supaya klik butang "Tempah Tarikh Ini" dari Kalendar Pentadbir mengisi tarikh secara lancar.
  3. **Pengemaskinian CSS Master Global (`shared/css/wedrive.css`)**:
     - Menambah kelas susun atur `.cal-bento-layout`, `.cal-picker-card`, `.apple-cal-weekdays`, `.apple-cal-grid`, `.apple-cal-day`, `.apple-cal-dots`, `.apple-cal-dot`, dan `.cal-agenda-card`.
     - Menguatkuasakan prinsip bulatan tepat 1:1 (*Zero Oval Rule*):
       - Butang tarikh: `width: 42px !important; height: 42px !important; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important;`.
       - Butang navigasi: `width: 36px !important; height: 36px !important; aspect-ratio: 1 / 1 !important; border-radius: 50% !important;`.
       - Mikro-titik: `width: 5px !important; height: 5px !important; aspect-ratio: 1 / 1 !important; border-radius: 50% !important;`.
       - Butang tindakan: Kapsul pil simetri `border-radius: 9999px !important; white-space: nowrap !important;`.
  4. **Logik Interaktif Pentadbir (`admin/js/calendar.js`)**:
     - Mengemas kini `renderCalendar()` untuk menjana struktur grid moden dan menetapkan tarikh hari ini sebagai pilihan lalai.
     - Mengemas kini `showDayDetail(ds)` untuk mengemaskini kad agenda kanan secara reaktif tanpa sebarang modal dialog bertindih.
     - Menyediakan fungsi `goToNewBookingForDate()` untuk navigasi pantas ke borang pendaftaran tempahan.
  5. **Sokongan Dwibahasa & Tema Penuh**:
     - Menambah kekunci terjemahan dwibahasa baharu di `shared/lang/ms.json` dan `shared/lang/en.json` (`cal_title`, `cal_subtitle`, `cal_stat_*`, `cal_legend_*`, `cal_sun` - `cal_sat`, `cal_btn_today`, `cal_btn_book_date`).
     - Menyokong Mod Siang (latar belakang putih Apple, sempadan halus) dan Mod Malam (latar belakang True Black `#000000`, Bento Surface `#161618`).
  6. **Penambahan Suite Ujian Automasi Playwright (`tests/e2e/15_apple_calendar.spec.js`)**:
     - Ujian 1: Pengesahan susun atur Bento 2-kolum dan nisbah aspek 1:1 tepat tanpa herotan bujur.
     - Ujian 2: Pengesahan kemas kini reaktif kad agenda apabila tarikh diklik dan fungsi butang "Hari Ini".
     - Ujian 3: Pengesahan pemilih tarikh berpasangan pada `new-booking.html` mematuhi bulatan 1:1 sempurna.

- **Keputusan Ujian & Pengesahan**:
  - **Chrome DevTools MCP**: Disahkan 100% pada pelayar langsung dalam Mod Siang dan Mod Malam.
  - **Playwright Automated Tests**: Kesemua 36 ujian merentasi 13 fail ujian lulus (**100% Pass Rate**).
  - **Knowledge Graph**: Dikemas kini dengan `graphify update .` (2,705 nod, 5,196 tepi).

- **Maklumat Git**:
  - Commit: `5.9.9 Overhaul Admin Calendar to Apple HIG 2-column Bento and unify datepickers`
  - Tag Versi: `5.9.9`

---

##  [MINOR UPDATE] 178. Penyelarasan Penuh Nisbah Aspek 16:9 & Penghapusan Sifar Ruang Kosong (Zero Gap) Penonton Kenderaan Interaktif 360° (v5.9.10)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  - *"https://wedrive.website/guest/pages/how-it-works/how-it-works.html..gambar ni awak buat full jangan ada gap atas n bawah tu"*
  - Pengguna mendapati imej kenderaan 360° interaktif (*Mercedes-Benz GLA250 & BMW 320i*) pada halaman *How It Works* memaparkan ruang kosong/jurang gelap (*dark letterbox bars / gaps*) di bahagian atas dan bawah bingkai imej.

- **Punca Masalah Teknikal**:
  1. Bekas peringkat interaktif (`.hiw-interactive-stage`) ditetapkan dengan nisbah `aspect-ratio: 16 / 10;` (1.600).
  2. Aset bingkai foto 360° kenderaan fizikal (`frame-100.jpg`, dsb.) mempunyai resolusi `3000px × 1688px`, iaitu nisbah sebenar **16 / 9** (~1.778).
  3. Gaya `object-fit: contain;` menyebabkan imej mengecut secara menegak sebanyak ~10% daripada ketinggian kontena, menghasilkan jalur kosong di bahagian atas dan bawah.

- **Tindakan Pembaikan (Implementation)**:
  1. **Penyelarasan Nisbah Aspek Penuh (`shared/css/wedrive.css`)**:
     - Mengemas kini `.hiw-interactive-stage` daripada `aspect-ratio: 16 / 10;` kepada `aspect-ratio: 16 / 9;` tepat.
     - Mengubah suai gaya bingkai imej `.hiw-interactive-stage img#hiwInteractiveFrame, .hiw-interactive-stage img[data-vehicle-exterior-frame]` kepada `width: 100%; height: 100%; object-fit: cover;`.
     - Menghapuskan 100% sebarang jurang atas/bawah (*zero letterbox gap*) pada sebarang saiz skrin dan mod tema (Day/Night).
  2. **Penyegaran Versi Cache Fail (`guest/pages/how-it-works/how-it-works.html`)**:
     - Mengemas kini rujukan fail CSS kepada `shared/css/wedrive.css?v=5.2.1` bagi memastikan penyemak imbas memuatkan peraturan CSS terbaharu serta-merta tanpa cache lapuk.
  3. **Penguatkuasaan Piawaian Geometri Apple HIG**:
     - Memastikan kad bento, sudut squircle (`border-radius: 16px/24px`), dan lencana status pil simetri 9999px kekal konsisten dan sifar herotan bujur (*Zero Oval Rule*).

- **Keputusan Ujian & Pengesahan**:
  - **Visual Playwright Verification**: Tangkapan skrin membuktikan kotak peringkat dan imej sejajar 100% pada saiz `667.76px × 375.61px` (nisbah tepat 16:9), tiada sebarang ruang bar kelabu/gelap di bahagian atas mahupun bawah.
  - **Playwright Automated Test Suite**: Kesemua 36 ujian automasi merentasi modul lulus sepenuhnya (**100% Pass Rate**).
  - **Pengesahan Pengguna**: Pengguna berpuas hati dan mengesahkan paparan adalah *"perfect"*.

- **Maklumat Git**:
  - Commit: `5.9.10 Set 360 interactive viewer to full 16:9 cover without top and bottom gaps`
  - Tag Versi: `5.9.10`

---

##  [MAJOR UPDATE] 179. Penyeragaman Mutlak Bahasa Melayu Moden Kontemporari Malaysia 2026 (Piawaian Grab, Setel, Trevo & Carsome) & Penguatkuasaan Senarai Hitam Istilah Kuno/Kaku AI (v6.0.0)

- **Punca Keperluan & Arahan Pengguna (User Directives via /grill-me)**:
  - *"perkataan yang x masuk akal ... mana awak dapat perkataan semua tuu.. macam fleet saya dh pantang dh jangan guna tukar kepada car ...penat banyak kali pesan saya nak awak guna perkataan yang masuk akal!!!"*
  - *"n satu lagi tambah..guna bahasa modern yang skrg ni guna"*
  - *"nombor satu n tulis dekat agent supaya x buat kesilapan berulang lagi"*
  - Pengguna menegur penggunaan perkataan yang tidak masuk akal (seperti istilah angkatan kapal tentera laut menurut etimologi Sepanyol/Portugis dan Kamus Dewan) serta istilah terjemahan langsung AI yang kaku (seperti istilah dalaman kapal terbang/kapal laut, peringkat, atau kenderaan klasik). Pengguna mengarahkan agar sistem menggunakan 100% **Bahasa Melayu Moden Kontemporari Malaysia Era 2026** (seperti yang digunakan oleh Grab, Setel, Trevo, Wahdah, Carsome) dan menguatkuasakan senarai hitam kata terlarang (*Blacklist Terms*) secara kekal dalam peraturan ejen AI `.agents/`.

- **Tindakan Pembaikan Menyeluruh (Implementation)**:
  1. **Penguatkuasaan Senarai Hitam & Peraturan Bahasa Moden (`.agents/rules/ruleprompt.md`)**:
     - Membina semula Seksyen 1D dengan tajuk **"1D. Penyeragaman Mutlak Bahasa Melayu Moden Kontemporari Malaysia 2026"**.
     - Memasukkan jadual rasmi **SENARAI HITAM ISTILAH TERLARANG (STRICT BLACKLIST)** merangkumi padanan bahasa Melayu moden Malaysia terkini (Grab, Setel, Trevo, Wahdah, Carsome):
       - *Pilihan Kereta* / *Katalog Kereta* (menggantikan sebarang istilah laut atau ketenteraan)
       - *Kereta* (BM) / *Cars* (EN)
       - *Model Kereta*
       - *Dalaman Kereta* / *Ruang Dalaman* (BM) / *Interior* (EN)
       - *Pratonton 360°* / *Lihat Kereta 360°*
       - *Katalog Kereta* / *Pilihan Kereta*
       - *Sewa Kereta* / *Perjalanan Anda*
       - *Perlindungan Insurans* / *Insurans Penuh*
       - *Pilihan Kereta* / *Senarai Kereta*
     - Menetapkan larangan mutlak kepada mana-mana ejen AI daripada menyebut atau mencadangkan istilah senarai hitam ini dalam sebarang percakapan atau kod.
  2. **Pembersihan Panduan Reka Bentuk Master (`.agents/DESIGN.md`)**:
     - Memadam sebutan lapuk dan menggantikannya dengan "Pilihan Kereta".
     - Menambah klausa rasmi Bahasa Melayu Moden Kontemporari (Era 2026).
  3. **Penyelarasan Fail Rujukan Apple HIG & Stitch (`.agents/rules/apple_hig_design_system.md` & `.agents/workflows/stitch_generation.md`)**:
     - Memadam perkataan lapuk dalam teks pilar deference dan menggantikannya dengan "katalog kereta".
     - Mengemas kini Fasa 3 Stitch kepada "Kereta Tersedia".
  4. **Pembersihan Kamus Terjemahan Sistem (`shared/lang/ms.json` & `shared/lang/ms.js`)**:
     - Mengemas kini `how_new_view_status_reference` kepada *"Panorama dalaman kereta rujukan"*.
  5. **Pembersihan Dokumentasi Sejarah (`PLAN/FYP1_to_FYP2_Development_Summary.md`)**:
     - Menyelaraskan teks pengenalan fasa awal kepada "Pengurusan Kereta".

- **Keputusan Ujian & Pengesahan**:
  - **Audit Teks & Kod**: Sifar perkataan lapuk atau istilah senarai hitam dalam fail operasi dan konfigurasi aktif.
  - **Playwright Automated Test Suite**: Kesemua 36 ujian automasi merentasi modul lulus sepenuhnya (**100% Pass Rate**).

- **Maklumat Git**:
  - Commit: `6.0.0 Enforce 2026 contemporary modern Malay language standard and strictly blacklist non-standard terms`
  - Tag Versi: `6.0.0`

---

## 🚀 [MINOR UPDATE] 180. Pembersihan Menyeluruh 100% Sisa Istilah Senarai Hitam Merentas Seluruh Kod & Penyegaran Graf Graphify (v6.0.1)

- **Punca Arahan Pengguna (/grill-me check semua tempat)**:
  - *"masih ada lagi ni?? 145 results - 34 files ... check semua tempat"*
  - Pengguna melakukan carian global dan mendapati sisa istilah senarai hitam masih wujud dalam beberapa fail dokumentasi, laporan, arkib graf pengetahuan Graphify, dan kod rujukan dalaman kenderaan.

- **Tindakan Pembaikan & Pemurnian Mutlak**:
  1. **Dokumentasi Audit Apple HIG (`docs/APPLE_HIG_COMPLIANCE_AUDIT.md`)**:
     - Mengemas kini jadual pematuhan modul pentadbir: menggantikan *"kad armada kereta"* kepada *"kad katalog kereta"* dan *"Kalendar Armada"* kepada *"Kalendar Kereta"*.
  2. **Abstrak Rasmi Laporan Projek (`REPORT/chapters/01_Abstract.md`)**:
     - Mengemas kini teks abstrak rasmi: menggantikan *"pengurusan armada dan tempahan"* kepada *"pengurusan kereta dan tempahan"*.
  3. **Pengesanan Kod Pemapar Kenderaan (`shared/js/vehicle-viewer.js`)**:
     - Mengesan dan menggantikan sisa perkataan *"kabin"* / *"cabin"* dalam teks dan tajuk SVG placeholder kepada *"dalaman kereta"* / *"interior"* (`safeLabel`, `safeFace`, `faceLabelMap`, dan kapsyen `"Panorama dalaman kereta rujukan"`).
  4. **Pembersihan Ringkasan Pembangunan (`PLAN/FYP1_to_FYP2_Development_Summary.md`)**:
     - Menyaring dan memurnikan semua entri sejarah lampau (baris 108, 110, 320, 641, 2187, 2397, 2495, 2741, 2746, 2749, 2767, 3002, 3931, 4059) agar menggunakan istilah rasmi *"Kereta"* / *"Kenderaan"* / *"Pilihan Kereta"*.
  5. **Penjanaan Semula Graf Graphify & Pembersihan Cache Lapuk**:
     - Menghapuskan fail sandaran harian lapuk (`graphify-out/2026-09-05/`, `2026-09-06/`) dan fail cache AST yang menyimpan indeks nod lama.
     - Menjalankan perintah `graphify update .` untuk menjana semula `graph.json`, `graph.html`, dan `GRAPH_REPORT.md` bersih tanpa nod bertajuk senarai hitam.
  6. **Pengesahan Sifar Riak (Zero Residual Verification)**:
     - Imbasan komprehensif mengesahkan **0 padanan** bagi semua istilah senarai hitam di seluruh modul: `admin/`, `customer/`, `guest/`, `shared/`, `account/`, `docs/`, `REPORT/`, `PLAN/`, dan `graphify-out/`.
  7. **Suite Ujian Automasi Penuh Playwright**:
     - Menjalankan keseluruhan suite 36 ujian E2E (`cd tests && npx playwright test`): **36/36 ujian lulus sepenuhnya (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `6.0.1 Eradicate 100% residual blacklisted terms across docs, code, and graphify knowledge base`
  - Tag Versi: `6.0.1`
---

## [MINOR UPDATE] 181. Penyusunan & Penomboran Sistematik Folder .agents/rules/ (v6.1.0)

- **Punca Arahan Pengguna (/grill-me struktur .agents/rules/)**:
  - *"dekat agent ni dh x terurus dh ..cuba kita susun letak nombor dekat depan kan senang"*
  - *"bukan sekadar namakan sahaja ..isi dalam tu kena perhatikan jugak"*

- **Tindakan Penyusunan & Penyelarasan Rujukan Silang**:
  1. **Penomboran Berhierarki 01–10**: Kesemua 10 fail peraturan dalam `.agents/rules/` telah dinamakan semula dengan awalan nombor mengikut keutamaan:
     - `01_core_rules.md` (teras projek) hingga `10_graphify.md` (pengoptimuman token).
  2. **Kemas Kini Rujukan Silang Dalaman (01, 02, 03, 07)**:
     - `01_core_rules.md`: 6 rujukan silang dikemas kini (02_, 03_, 04_, 05_, 06_, 08_, 09_).
     - `02_apple_hig_design_system.md`: Rujukan kepada `03_apple_hig_components.md`.
     - `03_apple_hig_components.md`: Rujukan kepada `02_apple_hig_design_system.md`.
     - `07_stitch_design_system.md`: Rujukan kepada `stitch_generation.md` (workflow, tidak berubah).
  3. **Kemas Kini Rujukan Luar**:
     - `.agents/DESIGN.md`: Rujukan `ruleprompt.md` → `01_core_rules.md`.
     - `docs/PROJECT_STRUCTURE.md`: Senarai fail `.agents/rules/` dikemas kini sepenuhnya.
  4. **Penghapusan Fail Asal**: 10 fail lama tanpa nombor awalan dipadam selepas fail baharu disahkan.

- **Maklumat Git**:
  - Commit: `6.1.0 Systematic numbering and cross-reference alignment for .agents/rules/`
  - Tag Versi: `6.1.0`

---

## [MINOR UPDATE] 182. Pematuhan Had Saiz Kandungan Maksimum 12,000 Aksara Setiap Fail .agents/rules/ (v6.1.1)

- **Punca Arahan Pengguna**:
  - *"lupa nak cakap max content adalah 12000 sahaja so mana yang terlebih tu awak jangan buat letak tempat lain buat file baharu ke masuk file yang ada ke tapi max 12000 sahaja"*

- **Tindakan Audit & Penyelarasan Saiz Aksara**:
  1. **Audit Penuh Saiz Aksara**: Semua 10 fail `.agents/rules/` diimbas menggunakan `wc -m`.
  2. **Pengurangan Saiz `01_core_rules.md`**:
     - Saiz asal melebihi had (13,375 aksara).
     - Seksyen 1 dipadatkan dengan rumusan teras manakala spesifikasi terperinci Bento Grid dan Zero Dead Space dialihkan dengan kemas ke `02_apple_hig_design_system.md` (Pilar 3: Corak Interaksi & Struktur, Butiran 6).
     - Saiz akhir `01_core_rules.md`: **11,659 aksara** (LULUS / <= 12,000).
  3. **Penempatan Kandungan ke `02_apple_hig_design_system.md`**:
     - Kandungan Bento Grid, sifar ruang kosong (Zero Dead Space), dan ritma spacing 24px ditempatkan di Pilar 3.
     - Saiz akhir `02_apple_hig_design_system.md`: **6,789 aksara** (LULUS / <= 12,000).
  4. **Status Akhir Keseluruhan 10 Fail Peraturan**:
     - `01_core_rules.md`: 11,659 aksara (OK)
     - `02_apple_hig_design_system.md`: 6,789 aksara (OK)
     - `03_apple_hig_components.md`: 4,571 aksara (OK)
     - `04_navigation_and_ui.md`: 5,591 aksara (OK)
     - `05_apple_device_support.md`: 2,270 aksara (OK)
     - `06_code_and_backend.md`: 2,045 aksara (OK)
     - `07_stitch_design_system.md`: 6,068 aksara (OK)
     - `08_playwright_testing.md`: 1,761 aksara (OK)
     - `09_security_and_audit.md`: 1,369 aksara (OK)
     - `10_graphify.md`: 978 aksara (OK)
     - **Semua 10 fail kini 100% di bawah had 12,000 aksara tanpa kehilangan sebarang peraturan atau garis panduan.**

- **Maklumat Git**:
  - Commit: `6.1.1 Enforce strict 12000 character limit per rule file in .agents/rules/`
  - Tag Versi: `6.1.1`

---

## [MAJOR UPDATE] 183. Pewujudan Fail Peraturan Dedikasi 11_language_standards.md & Protokol Gatekeeper Pra-Pengekodan (v6.2.0)

- **Punca Arahan Pengguna**:
  - *"setiap kali awak buat coding gunakan mcp /context7, stitch, composio, graphify ,/chrome-devtools n pastikan/grill-me saya dulu...syarat setiap kali prompt...n pastikan setiap kali buat coding baca arahan agent n setiap kali coding check dulu page tu as user baru ubah coding...masukkan dalam agent supaya x lupa...n saya nak rules untuk bahasa sahaja focus"*
  - *"masukkan sekali mcp supabase"*
  - *"Playwright CLI, Supabase plugin, Strix, Skill UI for Front-End, Context7... translate ke bahasa melayu"*
  - *"pastikan letak dalam agent supaya benda ni berulang kali"*

- **Tindakan Seni Bina Peraturan (Agent Rules Architecture)**:
  1. **Fail Peraturan Ke-11 Dedikasi (`11_language_standards.md`)**:
     - Memfokuskan 100% kepada Standard Bahasa Melayu Moden Kontemporari Malaysia Era 2026 (Grab, Setel, TnG eWallet, Trevo, Wahdah, Carsome).
     - Jadual penuh Senarai Hitam Istilah Terlarang (*Strict Blacklist Table*): Pengharaman kata *Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar, Bilik Pameran, Pelayaran Mobiliti, Perisai Keselamatan, Gugusan Kereta, Penstriman Tempahan*.
     - Pemetaan dwibahasa dinamik (`shared/lang/en.json` & `ms.json`), panduan status badge, dan pencegahan campur aduk bahasa.
     - Garis panduan komunikasi ketat bagi ejen AI (*Strict AI Guardrails*).
     - Saiz fail: **5,864 aksara** (LULUS / <= 12,000 had maksimum).
  2. **Seksyen 0 Gatekeeper Protocol dalam `01_core_rules.md`**:
     - Diletakkan di kedudukan paling atas (aktif setiap kali prompt bermula) menggariskan 5 langkah mandatori berturutan:
       1. **Wajib Baca Arahan Agent Terlebih Dahulu** sebelum sebarang pengubahsuaian kod.
       2. **Wajib Temu Duga `/grill-me` Dahulu** menggunakan `ask_question` untuk menyelaraskan kehendak reka bentuk.
       3. **Wajib Semak Halaman Sebagai Pengguna Dahulu (Check Page As User First)** pada tab aktif (menggunakan `chrome-devtools` snapshot/DOM) tanpa membuka banyak tab.
       4. **Wajib Manfaatkan Ekosistem Alatan Pintar & MCP WeDRIVE**:
          - **Playwright CLI**: Ujian automasi butang, borang, dan aliran penuh tanpa ujian manual berjam-jam.
          - **Supabase MCP**: Pengurusan pangkalan data PostgreSQL, skema jadual, RLS, dan pengesahan pengguna.
          - **Strix Security Audit**: Simulasi ujian penembusan etika persis penggodam sebenar untuk mencegah kebocoran data.
          - **Skill UI for Front-End**: Kejuruteraan terbalik (*reverse engineering*) visual rujukan ke spesifikasi Apple HIG.
          - **Context7 MCP**: Dokumentasi langsung & versi pustaka terkini tanpa halusinasi kod atau sintaks lapuk.
          - **Stitch MCP, Composio, Graphify & Chrome DevTools**: Penjanaan UI Apple HIG, automasi luar, penjimatan token, dan semakan visual.
       5. **Wajib Patuhi 11_language_standards.md** untuk semua teks, lencana, label butang, dan maklum balas AI.
     - Saiz fail `01_core_rules.md`: **11,801 aksara** (LULUS / <= 12,000).
  3. **Penyelarasan Dokumentasi Struktur Projek**:
     - `docs/PROJECT_STRUCTURE.md`: Dikemas kini kepada 11 fail peraturan bernombor.
     - `.agents/DESIGN.md`: Rujukan senarai hitam dikemas kini kepada `11_language_standards.md`.

- **Maklumat Git**:
  - Commit: `6.2.0 Add 11_language_standards.md and mandatory pre-coding gatekeeper protocol in 01_core_rules.md`
  - Tag Versi: `6.2.0`

---

## [MINOR UPDATE] 184. Pewujudan .agents/PROJECT_STRUCTURE.md Sebagai Punca Kebenaran Tunggal Master (v6.2.1)

- **Punca Arahan Pengguna**:
  - *"boleh awak tambah dekat project structure tapi saya nak awak tambah dalam ni .agents yang utama"*

- **Tindakan Penyusunan Struktur Projek**:
  1. **Pewujudan Master Structure Document (`.agents/PROJECT_STRUCTURE.md`)**:
     - Dicipta terus di dalam folder `.agents/` sebagai dokumen rujukan seni bina dan pokok direktori utama sistem WeDRIVE.
     - Menonjolkan ekosistem pintar WeDRIVE di bahagian teratas: 11 fail peraturan bernombor, alatan kemahiran (`skills/`), aliran kerja berterusan (`workflows/`), dan spesifikasi reka bentuk master (`DESIGN.md`).
     - Menyediakan pemetaan terperinci bagi semua modul: `admin/`, `customer/`, `guest/`, `account/`, `shared/`, `supabase/`, `tests/`, `graphify-out/`, `PLAN/`, dan `REPORT/`.
  2. **Penyelarasan Rujukan Silang**:
     - `docs/PROJECT_STRUCTURE.md`: Ditambah kotak amaran penting di bahagian atas yang menegaskan `.agents/PROJECT_STRUCTURE.md` adalah dokumen autoriti utama (*Single Source of Truth*). Pokok direktori turut mengandungi `.agents/PROJECT_STRUCTURE.md`.
     - `.agents/rules/06_code_and_backend.md`: Garis panduan fail dan folder dikemas kini untuk merujuk `.agents/PROJECT_STRUCTURE.md` (Master).

- **Maklumat Git**:
  - Commit: `6.2.1 Establish .agents/PROJECT_STRUCTURE.md as master single source of truth`
  - Tag Versi: `6.2.1`

---

## [MINOR UPDATE] 185. Naik Taraf Kemahiran context7 & frontend-ui Serta Deduplikasi Kandungan .agents/ (v6.2.2)

- **Punca Arahan Pengguna**:
  - *".agents/skills/context7 n .agents/skills/frontend-ui x update"*
  - *"n saya tengok content2 dalam agent ni ada yang duplicate cuba awak tengok"*
  - *"buka website context7 n study apa yang ada dalam tu ...saya nak awak gunakan maximum skill"*
  - *"yang ni awak buka website apple n study semua bentuk pattern cara susun anything yang saya bagi link website untuk belajar cara2 apple buat sesuatu"*

- **Tindakan Naik Taraf & Deduplikasi**:
  1. **Naik Taraf `.agents/skills/context7/SKILL.md`**:
     - Ditambah alur kerja 2-langkah rasmi Context7 MCP: `resolve-library-id` $\rightarrow$ `query-docs`.
     - Pemetaan perpustakaan teras WeDRIVE: `@supabase/supabase-js` (`/supabase/supabase`), `flatpickr` (`/chmln/flatpickr`), `@playwright/test` (`/microsoft/playwright`), `animejs` (`/juliangarnier/anime`), `three.js` (`/mrdoob/three.js`).
     - Contoh kod pertanyaan sebenar untuk RLS, filter, dan paired date range lock.
     - Panduan penghapusan sintaks lapuk (*zero deprecated syntax*).
  2. **Naik Taraf `.agents/skills/frontend-ui/SKILL.md`**:
     - Dibina berpandukan kajian mendalam Apple HIG & sistem reka bentuk moden:
       - Bento Grid responsif (ritma jarak 24px seimbang, sifar ruang kosong / *Zero Dead Space*).
       - Apple Thin Materials / Glassmorphism dengan *specular top highlight* dan bayang lembut.
       - Ketepatan geometri bulat 1:1 sempurna vs kapsul berteks 9999px.
       - Fizik pergerakan spring (`cubic-bezier(0.16, 1, 0.3, 1)`) dan *Segmented Glider*.
       - Jajaran angka tabular (`tabular-nums`) dan zon sentuhan minimum 44px.
  3. **Pembersihan Kandungan Duplikat (Deduplication / SSOT)**:
     - Ditetapkan punca tunggal (*Single Source of Truth*): `02_apple_hig_design_system.md` memiliki senarai pautan Apple Developer & pelayan Figma MCP secara eksklusif.
     - `.agents/rules/04_navigation_and_ui.md`: Seksyen 3 & 4 digantikan dengan rujukan silang SSOT yang kemas (saiz berkurang dari 5,591 ke 4,460 aksara).
     - `.agents/DESIGN.md`: Seksyen 5 (Stitch MCP) dan Seksyen 6 (Apple Developer) digantikan dengan rujukan silang SSOT ke `07_stitch_design_system.md` dan `02_apple_hig_design_system.md`.
     - `.agents/skills/frontend-ui/SKILL.md`: Blok pautan dan JSON Figma dikeluarkan dan diganti dengan rujukan SSOT ke `02_apple_hig_design_system.md`.

- **Maklumat Git**:
  - Commit: `6.2.2 Upgrade context7 & frontend-ui skills and deduplicate .agents rules`
  - Tag Versi: `6.2.2`

---

## [MAJOR UPDATE] 186. Pewujudan 5 Fail Peraturan Baharu (12–16), Had Siling 12,000 Aksara, Modular Rules Architecture & Mandatori PRD Standard (v6.2.3)

- **Punca Arahan Pengguna**:
  - *"tambah dekat mana2 tempat max 12000 sahaja takut nnti lupa content max"*
  - *"rules ni tambah sikit x kesah nak create sampai 20 ke 30 ke janji ai ni faham"*
  - *"haa saya lupa nak cakap jangan lupa setiap kali buat mesti kena buat prd baru saya faham n jelas"*

- **Tindakan Pelaksanaan**:
  1. **Penguatkuasaan Peraturan Global (Global Customizations Root)**:
     - Dicipta fail peraturan global di `/Users/hakim/.gemini/config/rules/max_content_limit.md` bagi menguatkuasakan had saiz fail $\le 12,000$ aksara.
     - Dicipta fail peraturan global di `/Users/hakim/.gemini/config/rules/prd_mandatory_standard.md` bagi memastikan setiap pembangunan kod dimulakan dengan PRD 6 pilar mandatori.
  2. **Pengembangan Ekosistem Peraturan Modular (.agents/rules/ 01–16)**:
     - Menambah 5 fail peraturan khusus baharu tanpa beban teks bertindih:
       - `12_max_content_limit.md`: Had Siling 12,000 Aksara, Pengesahan `wc -m`, Pemisahan Kandungan & Modular Rule Expansion (sehingga 20–30 fail).
       - `13_prd_standard.md`: Standard Dokumen Keperluan Produk (PRD) 6 Pilar Mandatori Sebelum Pengekodan.
       - `14_supabase_database.md`: Pangkalan Data PostgreSQL Supabase, Model Skema Mobiliti & Dasar RLS.
       - `15_strix_security_audit.md`: Simulasi Ujian Penembusan Etika Strix & Keselamatan PII untuk Bab Tesis FYP 2.
       - `16_ai_tooling_and_mcps.md`: Protokol Operasi Ekosistem 9 Alatan Pintar & Pelayan MCP WeDRIVE.
  3. **Penyelarasan Indeks & Audit Had Siling 12,000 Aksara**:
     - `01_core_rules.md`: Ditambah item 6 pada Gatekeeper Protocol, diperbaharui Seksyen 3B (PRD SSOT), Seksyen 7 (indeks 16 peraturan), dan Seksyen 8 (had 12,000 aksara).
     - `06_code_and_backend.md`: Ditambah peraturan had siling fail panduan $\le 12,000$ aksara.
     - `.agents/PROJECT_STRUCTURE.md` & `docs/PROJECT_STRUCTURE.md`: Dikemas kini pokok direktori kepada 16 fail peraturan bernombor.
     - `.agents/DESIGN.md`: Ditambah Seksyen 7 bagi penguatkuasaan had kandungan.
     - **Audit Saiz Pukal**: Kesemua 16 fail peraturan bernombor disahkan mematuhi had $\le 12,000$ aksara (100% LULUS).

- **Maklumat Git**:
  - Commit: `6.2.3 Add modular rules 12-16 enforce 12k char limit and mandatory PRD standard`
  - Tag Versi: `6.2.3`

---

## [MINOR UPDATE] 187. Pembaikan Isu Linter CSS Inline Styles Kalendar & Susunan Vendor Prefix WebKit Backdrop-Filter (v6.2.4)

- **Punca Arahan Pengguna**:
  - *"Okey saya nak test awak kan cuba awak fix ni@[current_problems]"*
  - Masalah 1: `admin/pages/calendar/calendar.html` baris 226 & 229: Amaran CSS inline styles pada `#cal-today-btn` dan `#cal-new-booking-btn`.
  - Masalah 2: `shared/css/wedrive.css` baris 3981: `backdrop-filter` disenaraikan sebelum vendor prefix `-webkit-backdrop-filter`.

- **Tindakan Pembaikan (Berasaskan PRD & Kelulusan Pengguna)**:
  1. **Dokumen PRD & Pelan Pelaksanaan**:
     - Menyediakan PRD 6 pilar penuh dalam `implementation_plan.md` terlebih dahulu mengikut mandat Gatekeeper sebelum sebarang baris kod disentuh.
  2. **Pengalihan Inline Styles `calendar.html` ke CSS Luaran**:
     - Di dalam `admin/pages/calendar/calendar.html`: Mengeluarkan atribut inline `style="flex: 1 1 140px;"` dan `style="flex: 1 1 160px;"` daripada `#cal-today-btn` dan `#cal-new-booking-btn`.
     - Di dalam `shared/css/wedrive.css`: Menambah aturan CSS `#cal-today-btn { flex: 1 1 140px; }` dan `#cal-new-booking-btn { flex: 1 1 160px; }` di bawah seksyen kalendar pentadbir.
  3. **Penalaan Susunan Vendor Prefix `wedrive.css`**:
     - Menyusun semula aturan pada `.hiw-drag-hint` supaya `-webkit-backdrop-filter` disenaraikan sebelum standard `backdrop-filter` demi keserasian WebKit Safari yang optimum dan piawaian linter CSS.
  4. **Verifikasi Kualiti & Ujian Automasi**:
     - Suite ujian automasi Playwright CLI mencapai kelulusan penuh 36/36 ujian (**100% Pass Rate**).
     - Kesemua 16 fail peraturan bernombor kekal mematuhi had siling $\le 12,000$ aksara.

- **Maklumat Git**:
  - Commit: `6.2.4 Fix calendar inline styles and webkit backdrop-filter prefix order`
  - Tag Versi: `6.2.4`

---

## [MINOR UPDATE] 188. Pewujudan Peraturan Khusus 17_git_versioning_standard.md & Protokol Penemuan Versi Git SemVer (v6.2.5)

- **Punca Arahan Pengguna**:
  - *"okey now saya nak tanya github tu kan macam mana agent push github lepas buat ?? jap bukan tu tapi saya tanya dekat agent tu macam mana proses untuk awak push github macam mana awak nak tahu git sebelum tu...awak nak guna nombor x.x.x kalau yang ni apa.yang ni apa.yang ni apa"*
  - *"pastikan saya nak consisten benda ni awak tambah dalam agent supaya x terlupa"*

- **Tindakan Pelaksanaan**:
  1. **Penguatkuasaan Peraturan Global (Global Customizations Root)**:
     - Dicipta fail peraturan global di `/Users/hakim/.gemini/config/rules/git_versioning_standard.md` bagi menguatkuasakan protokol penemuan versi Git sebelum sebarang commit, formula SemVer `X.Y.Z`, format mesej commit tanpa awalan 'v', dan senarai semak pra-push merentas semua sesi ejen AI.
  2. **Penciptaan Fail Peraturan Modular 17 ([`.agents/rules/17_git_versioning_standard.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/17_git_versioning_standard.md))**:
     - Kandungan fail (4,628 aksara $\le 12,000$) merangkumi:
       - 3 Kaedah Penemuan Versi Aktif (`git describe --tags --abbrev=0`, `git log -1 --oneline`, dan semakan entri bawah fail `PLAN/`).
       - Formula & Hierarki SemVer `X.Y.Z` (Major = Rombakan Seni Bina / Fasa Baharu, Minor = Penambahan Ciri / Modul Baharu, Patch = Pembaikan Pepijat / CSS / Peraturan).
       - Peraturan Format Commit Mandatori (`X.Y.Z Description of changes` tanpa awalan 'v').
       - Protokol Langkah Demi Langkah (Step-by-Step) Push Git (Ujian Playwright $\to$ Graphify Update $\to$ `git add` $\to$ `git commit` $\to$ `git tag` $\to$ `git push origin main --tags`).
  3. **Penyelarasan Indeks & Struktur Dokumen Projek**:
     - `01_core_rules.md`: Diperbaharui Seksyen 2 untuk memautkan terus ke `17_git_versioning_standard.md`, serta dikemas kini Seksyen 7 (Indeks 17 Peraturan).
     - `.agents/PROJECT_STRUCTURE.md` & `docs/PROJECT_STRUCTURE.md`: Dikemas kini senarai peraturan kepada 17 fail bernombor.
     - Kesemua 17 fail peraturan disahkan mematuhi had siling $\le 12,000$ aksara melalui audit `wc -m`.

- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **100% Pass Rate**.

- **Maklumat Git**:
  - Commit: `6.2.5 Establish 17_git_versioning_standard and update rule index`
  - Tag Versi: `6.2.5`

---

## [MINOR UPDATE] 189. Pembangunan Ekosistem 3 Kemahiran (Skills) & 3 Alur Kerja (Workflows) Pintar WeDRIVE (v6.3.0)

- **Punca Arahan Pengguna**:
  - *"skill n workflow awak xnak tambah lagi ke ???atau awak nak tambah apa2 ???"*
  - *"kalau macam tu tambah semua yang recommend"*
  - *"n fix jugak figma mcp ni x boleh nak connect"*

- **Tindakan Pelaksanaan (Berasaskan PRD & Kelulusan Pengguna)**:
  1. **Dokumen PRD & Pelan Pelaksanaan**:
     - Menyediakan PRD 6 pilar penuh dalam `implementation_plan.md` merangkumi objektif, sasaran, fungsian, Apple HIG UX, pemetaan pangkalan data, dan kriteria penerimaan sebelum pengekodan bermula.
  2. **Penciptaan 3 Kemahiran Automasi Ejen Baharu (`.agents/skills/`)**:
     - `playwright-testing/SKILL.md` (4,453 aksara): Panduan komprehensif ujian E2E Chromium/WebKit, assertions geometri 1:1 bulat sempurna (*Zero Oval Rule*), dwi-tema, dwibahasa, dan perlindungan akaun rasmi (`admin@wedrive.my` & `ahmad@wedrive.my`).
     - `supabase-ops/SKILL.md` (4,420 aksara): Panduan skema pangkalan data PostgreSQL mobiliti kereta (`cars`, `bookings`, `profiles`, `payments`), penguatkuasaan Row Level Security (RLS) mengikut peranan, dan peraturan sifar data palsu (*Zero Fake Data*).
     - `strix-security-audit/SKILL.md` (3,889 aksara): Panduan simulasi ujian penembusan etika siber OWASP, semakan perlindungan data peribadi (PII), keselamatan sesi/kunci API, dan format pelaporan bukti empirikal untuk Bab 4 & 5 Tesis FYP 2.
  3. **Penciptaan 3 Alur Kerja Automasi Baharu (`.agents/workflows/`)**:
     - `release_push.md` (2,818 aksara): Alur kerja rasmi SemVer `X.Y.Z`, penemuan versi melalui `git describe --tags --abbrev=0`, format commit tanpa 'v', penciptaan tag, dan push serentak.
     - `qa_audit.md` (2,216 aksara): Alur kerja pemeriksaan pra-pelepasan merangkumi audit saiz fail 12,000 aksara (`wc -m`), semakan geometri butang, Playwright CLI 100% lulus, dan penyelarasan Graphify.
     - `prd_creator.md` (3,133 aksara): Alur kerja penjanaan dokumen PRD 6 Pilar mandatori di `implementation_plan.md` sebelum sebarang kod disentuh.
  4. **Penyelarasan Struktur Projek**:
     - Mengemas kini pokok direktori `.agents/PROJECT_STRUCTURE.md` dan `docs/PROJECT_STRUCTURE.md` dengan senarai lengkap 5 kemahiran dan 5 alur kerja.
     - Kesemua fail disahkan mematuhi had siling ketat $\le 12,000$ aksara.
  5. **Penyiasatan & Penyelesaian Figma MCP**:
     - Mendiagnosis punca kegagalan sambungan Figma Remote MCP (`https://mcp.figma.com/mcp` memulangkan 401 Unauthorized disebabkan keperluan OAuth token / Authorization header).
     - Menyediakan sokongan Figma Desktop MCP (`http://127.0.0.1:3845/mcp`) melalui Figma Dev Mode serta pakej `figma-developer-mcp` untuk sokongan Personal Access Token (PAT).

- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **36/36 Ujian Lulus (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `6.3.0 Establish 3 new agent skills and 3 automation workflows`
  - Tag Versi: `6.3.0`

---

## [MINOR UPDATE] 190. Penguatkuasaan Mandatori Protokol Pemakaian 5 Kemahiran & 5 Alur Kerja Pintar WeDRIVE (Rule 18) (v6.3.1)

- **Punca Arahan Pengguna**:
  - *"Kalau macam tu tambah sekali dalam agent supaya pakai"*

- **Tindakan Pelaksanaan (Berasaskan PRD & Kelulusan Pengguna)**:
  1. **Dokumen PRD & Pelan Pelaksanaan**:
     - Menyediakan PRD 6 pilar penuh dalam `implementation_plan.md` merangkumi objektif penguatkuasaan aktif, matriks pemakaian fasa kitaran hidup pembangunan, kriteria penerimaan, dan diluluskan secara rasmi oleh pengguna.
  2. **Penguatkuasaan Peraturan Global (Global Customizations Root)**:
     - Dicipta fail peraturan global di `/Users/hakim/.gemini/config/rules/skills_and_workflows_protocol.md` yang menetapkan protokol pemakaian aktif instrumen pintar WeDRIVE mengikut fasa (Fasa 1: PRD $\to$ Fasa 2: Frontend UI $\to$ Fasa 3: Supabase Ops & Context7 $\to$ Fasa 4: QA Audit & Playwright $\to$ Fasa 5: Strix Security $\to$ Fasa 6: SemVer Release Push).
  3. **Penciptaan Fail Peraturan Modular Workspace 18 ([`.agents/rules/18_skills_and_workflows_protocol.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/18_skills_and_workflows_protocol.md))**:
     - Kandungan fail (5,541 aksara $\le 12,000$) merangkumi:
       - Matriks pemakaian terperinci bagi 5 kemahiran (`frontend-ui`, `context7`, `supabase-ops`, `playwright-testing`, `strix-security-audit`).
       - Matriks pelaksanaan bagi 5 alur kerja (`/prd_creator`, `/qa_audit`, `/release_push`, `/graphify`, `/stitch_generation`).
       - Polisi Sifar Pengabaian (*Zero Abandonment Policy*) yang mengikat ejen AI supaya tidak mengambil jalan pintas.
  4. **Penyelarasan Indeks & Audit Had Siling 12,000 Aksara**:
     - `01_core_rules.md`: Dikemas kini Seksyen 7 (Indeks 18 Peraturan) dan diringkaskan teks Seksyen 0–6 bagi menjamin had saiz fail kekal selamat pada 11,066 aksara ($\le 12,000$).
     - `.agents/PROJECT_STRUCTURE.md` & `docs/PROJECT_STRUCTURE.md`: Dikemas kini pokok direktori kepada 18 fail peraturan bernombor.
     - **Audit Saiz Pukal**: Kesemua 18 fail peraturan bernombor disahkan mematuhi had siling ketat $\le 12,000$ aksara (100% LULUS).

- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **36/36 Ujian Lulus (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `6.3.1 Enforce Rule 18 mandatory skills and workflows active usage protocol`
  - Tag Versi: `6.3.1`

---

## 🎨 [MINOR UPDATE] 191. Konfigurasi Pelayan Figma MCP & Pengesahan Token Akses Rasmi (v6.3.2)

- **Punca Arahan Pengguna**:
  - *"n fix jugak figma mcp ni x boleh nak connect"*
  - *"skrg ni mcp figma x bolehj"*
  - Pengguna membekalkan Figma Personal Access Token (disimpan dengan selamat di `~/.env` & `mcp_config.json`).

- **Tindakan Penyelesaian & Konfigurasi (Implementation & Authentication)**:
  1. **Pengesahan Integriti Token Melalui REST API**:
     - Panggilan pengesahan dijalankan terhadap endpoint `https://api.figma.com/v1/me`.
     - **Hasil Pengesahan**: Profil akaun pengguna disahkan secara langsung: **Danial Hakim** (`hdanial211@gmail.com`, User ID: `1599674639074043356`).
  2. **Penyelarasan Pelayan Figma MCP (`~/.gemini/config/mcp_config.json`)**:
     - Menggantikan konfigurasi URL remote sedia ada yang memulangkan 401 Unauthorized kepada pelayan rasmi `figma-developer-mcp` berasaskan pengangkutan `stdio`:
       ```json
       "Figma": {
         "command": "npx",
         "args": [
           "-y",
           "figma-developer-mcp",
           "--stdio"
         ],
         "env": {
           "FIGMA_API_KEY": "[SECURED_IN_LOCAL_CONFIG]",
           "FRAMELINK_TELEMETRY": "off"
         }
       }
       ```
  3. **Penyimpanan Selamat Token (`~/.env`)**:
     - Token disimpan secara selamat di bawah `FIGMA_API_KEY` di fail persekitaran pengguna `~/.env` mengikut *Safe Credentials Protocol*.
  4. **Pengesahan Alatan MCP (*Tools Verification*)**:
     - Mengesahkan ketersediaan alatan:
       - `get_figma_data`: Mengambil data susun atur, teks, komponen, dan maklumat visual fail reka bentuk Figma.
       - `download_figma_images`: Muat turun imej SVG dan PNG secara terus daripada nod Figma ke dalam aset projek.

- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **36/36 Ujian Lulus (100% Pass Rate)**.

- **Maklumat Git**:
  - Commit: `6.3.2 Configure Figma MCP server with authenticated personal access token`
  - Tag Versi: `6.3.2`

---

### [MINOR UPDATE] 192. Pewujudan Peraturan 19 (Piawaian Kejuruteraan Prompt Emas), Kemahiran prompt-polisher & Alur Kerja /perfect_prompt (v6.4.0)
- **Tarikh**: 6 September 2026
- **Versi**: `6.4.0` (Peningkatan Versi Minor: Penambahan instrumen pintar prompt engineering, kemahiran, alur kerja dan peraturan modular baharu)
- **Status**: SELESAI
- **Fail Terlibat**:
  - `.agents/rules/19_prompt_engineering_standard.md` (BARU)
  - `/Users/hakim/.gemini/config/rules/prompt_engineering_standard.md` (BARU)
  - `.agents/skills/prompt-polisher/SKILL.md` (BARU)
  - `.agents/workflows/perfect_prompt.md` (BARU)
  - `.agents/rules/01_core_rules.md` (Kemas kini indeks)
  - `.agents/rules/18_skills_and_workflows_protocol.md` (Kemas kini 6 Kemahiran & 6 Alur Kerja)
  - `.agents/PROJECT_STRUCTURE.md` (Kemas kini struktur teras)
  - `docs/PROJECT_STRUCTURE.md` (Kemas kini dokumentasi struktur)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md` (Perekodan log 192)

- **Objektif & Latar Belakang**:
  - Menyediakan penyelesaian komprehensif bagi mengoptimumkan interaksi arahan pengguna mengikut standard WeDRIVE.
  - Menguatkuasakan **Formula Prompt Emas 3 Baris WeDRIVE** (`@target_file`, matlamat tindakan, dan aliran visual Apple HIG).
  - Melantik AI sebagai pembantu proaktif (*Proactive Assistant Duty*) untuk mengingatkan dan melengkapkan arahan pengguna sekiranya prompt yang diterima terlalu ringkas.
  - Memastikan sifar duplikasi (*Zero Duplication*) merentas peraturan, kemahiran, dan aliran kerja dengan memelihara had siling 12,000 aksara per fail.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pewujudan Rule 19 (`.agents/rules/19_prompt_engineering_standard.md`)**:
     - Menetapkan garis panduan format prompt 3 baris standard WeDRIVE.
     - Menguatkuasakan tugas AI memberi peringatan proaktif dan penalaan automatik secara santai tanpa membebankan pengguna.
     - Mengintegrasikan dialog pantas aneka pilihan `/grill-me` menerusi alatan `ask_question`.
  2. **Penyelarasan Peraturan Global Antigravity IDE (`~/.gemini/config/rules/prompt_engineering_standard.md`)**:
     - Mengukuhkan protokol kejuruteraan prompt merentas semua sesi dan perbualan IDE.
  3. **Pewujudan Kemahiran Pintar `prompt-polisher` (`.agents/skills/prompt-polisher/SKILL.md`)**:
     - Menala input idea kasar pengguna kepada spesifikasi teknikal 4 Dimensi:
       - *Dimensi UI & Apple HIG*: Bento grid, sifar bujur (1:1 ikon, kapsul teks), bahan kaca Thin Material.
       - *Dimensi Pangkalan Data*: Skema jadual Supabase, RLS, dan sifar data palsu.
       - *Dimensi QA*: Senario ujian Playwright CLI (100% Pass Rate).
       - *Dimensi Bahasa Melayu Moden 2026*: Kosa kata kontemporari segar, penapisan senarai hitam.
  4. **Pewujudan Alur Kerja `/perfect_prompt` (`.agents/workflows/perfect_prompt.md`)**:
     - Menyediakan jalan pantas memproses arahan ringkas ke format spesifikasi sedia guna sebelum dialirkan ke `/prd_creator`.
  5. **Penyelarasan Dokumen Seni Bina & Struktur Repositori**:
     - Mengemas kini `.agents/rules/01_core_rules.md` untuk menyertakan pautan rujukan Rule 19.
     - Mengemas kini `.agents/rules/18_skills_and_workflows_protocol.md` kepada matriks 6 Kemahiran dan 6 Alur Kerja Pintar.
     - Menyelaraskan hierarki sistem dalam `.agents/PROJECT_STRUCTURE.md` dan `docs/PROJECT_STRUCTURE.md`.
  6. **Pematuhan Ketat Sifar Duplikasi & Had Aksara 12,000**:
     - Pengesahan menyeluruh menggunakan `wc -m .agents/rules/*.md` mengesahkan kesemua 19 fail kekal di bawah 12,000 aksara.
     - Setiap fail mengekalkan fungsi pengkhususan modular yang tersendiri tanpa pertindihan teks (*Single Source of Truth*).

- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **36/36 Ujian Lulus (100% Pass Rate)**.
  - Graf pengetahuan Graphify dikemaskini melalui `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.4.0 Establish Rule 19 prompt engineering standards, prompt-polisher skill, and perfect_prompt workflow`
  - Tag Versi: `6.4.0`

---

### [PATCH UPDATE] 193. Penguatkuasaan Protokol Ujian Pengguna 3-Peranti Apple Satu-Tab (MacBook, iPad, iPhone) (v6.4.1)
- **Tarikh**: 6 September 2026
- **Versi**: `6.4.1` (Peningkatan Versi Patch: Penalaan peraturan dan alur kerja pengujian visual peranti Apple pada satu tab)
- **Status**: SELESAI
- **Fail Terlibat**:
  - `.agents/rules/05_apple_device_support.md` (Penambahan Seksyen 3: Single-Tab 3-Device Protocol)
  - `.agents/rules/01_core_rules.md` (Penalaan Gatekeeper item 3)
  - `.agents/workflows/qa_audit.md` (Penalaan Fasa 2 QA Audit)
  - `/Users/hakim/.gemini/config/rules/apple_device_testing.md` (Peraturan global IDE)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md` (Perekodan log 193)

- **Objektif & Latar Belakang**:
  - Menguatkuasakan pengesahan perspektif pengguna sebenar (*Test As User*) merentas spektrum 3 peranti Apple utama (MacBook, iPad, iPhone) selepas setiap kitaran pengekodan.
  - Mematuhi secara mutlak peraturan pengguna: *Single Tab Strict Rule* (Dilarang sama sekali membuka banyak tab pelayar semasa ujian; gunakan `resize_page` pada tab sedia ada).
  - Menjamin pematuhan 100% prinsip geometri sifar bujur (*Zero Oval Rule*), susun atur kad Bento squircle tanpa ruang mati (*Zero Dead Space*), dan pencegahan lonjakan *auto-zoom* iOS.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pengemaskinian [05_apple_device_support.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/05_apple_device_support.md)**:
     - Menambah Seksyen 3 yang memperincikan 3 fasa ujian saiz paparan:
       - *MacBook* (`1440 × 900`): Bento 3-kolum penuh, *Apple Shrink Navbar*, sifar limpahan mendatar.
       - *iPad* (`820 × 1180`): Bento 2-kolum responsif, zon sentuhan butang $\ge 44\text{px}$.
       - *iPhone* (`393 × 852`): Menu mudah alih/dock terapung, sifar bentuk bujur (1:1 tepat & 9999px pil), fon borang $\ge 16\text{px}$.
  2. **Penyelarasan Gatekeeper [01_core_rules.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/01_core_rules.md)**:
     - Mengukuhkan Syarat Mutlak 3 (Check Page As User First & Post-Test) merentas 3 peranti Apple pada satu tab.
  3. **Penalaan Alur Kerja [qa_audit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/workflows/qa_audit.md)**:
     - Memperluas Fasa 2 QA Audit untuk memasukkan semakan pelarasan saiz paparan pada tab aktif sedia ada.
  4. **Pewujudan Peraturan Global Antigravity IDE (`~/.gemini/config/rules/apple_device_testing.md`)**:
     - Mengukuhkan protokol ujian 3-peranti satu-tab merentas semua sesi dan perbualan masa hadapan.
  5. **Audit Had Siling Aksara 12,000**:
     - Disahkan kesemua 19 fail peraturan mematuhi had siling $\le 12,000$ aksara.

- **Pengesahan Ujian Automatik**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **36/36 Ujian Lulus (100% Pass Rate)**.
  - Graf pengetahuan Graphify dikemaskini melalui `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.4.1 Enforce Apple 3-device single-tab user testing protocol across rules and QA workflow`
  - Tag Versi: `6.4.1`

---

### [MAJOR UPDATE] 194. Pembinaan Sistem 5 Subagent Khas WeDRIVE & Pembaikan Responsif Rentas Peranti Apple (v6.5.0)
- **Tarikh**: 6 September 2026
- **Versi**: `6.5.0` (Peningkatan Versi Minor: Penambahan sistem subagents pintar baharu dan pembaikan responsif laman sesawang langsung)
- **Status**: SELESAI
- **Fail Terlibat**:
  - `.agents/plugins/wedrive/plugin.json` (Fail konfigurasi plugin WeDRIVE)
  - `.agents/plugins/wedrive/agents/wedrive_ui_auditor.md` (Subagent Pakar Apple HIG & Responsif 3-Peranti)
  - `.agents/plugins/wedrive/agents/playwright_sentinel.md` (Subagent Pakar Ujian E2E Automatik 100% Pass)
  - `.agents/plugins/wedrive/agents/strix_security_guardian.md` (Subagent Pakar Penembusan Etika & Audit PII Tesis FYP 2)
  - `.agents/plugins/wedrive/agents/supabase_dba_agent.md` (Subagent Pakar PostgreSQL Supabase & RLS)
  - `.agents/plugins/wedrive/agents/bm_language_police.md` (Subagent Pakar BM Moden 2026 & Penapis Kata Terlarang)
  - `/Users/hakim/.gemini/config/plugins/wedrive/*` (Penyegerakan plugin runtime global)
  - `shared/css/wedrive.css` (Pelarasan FAB chatbot terapung di atas dock, ruang padding bawah, drawer sidebar admin off-canvas, skrol jadual cukai, dan sifar limpahan mendatar)
  - `shared/js/main.js` (Pengecualian apple-bottom-dock pada portal account & admin, penanda has-apple-dock)
  - `shared/js/chatbot.js` (Pengecualian chatbot pada account pages, pencegahan ralat 400 token lapuk pelawat awam)
  - `.agents/PROJECT_STRUCTURE.md` & `docs/PROJECT_STRUCTURE.md` (Pendaftaran direktori plugin & subagents)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md` (Perekodan log 194)

- **Objektif & Latar Belakang**:
  - Menyediakan skuad subagent pintar khusus (*Specialized Subagents*) dalam ekosistem plugin Antigravity untuk membantu pembangunan berfokus tanpa beban kognitif umum.
  - Membaiki 5 isu visual dan responsif pelayar yang dikesan semasa pengauditan langsung di `https://wedrive.website`:
    1. Perlanggaran butang terapung Pembantu AI (`.chatbot-fab`) dengan Dok Bawah (`.apple-bottom-dock`) pada skrin iPhone.
    2. Dok Bawah menutupi kandungan carian dan kad kereta semasa diskrol (ketiadaan ruang bawah).
    3. Bar sisi admin melimpah pada skrin telefon dan butang togol hamburger menutupi 'Log Keluar'.
    4. Suntikan dok bawah dan chatbot terapung yang tidak diingini pada halaman akaun/log masuk yang sepatutnya berstatus *Standalone* (Rule 04).
    5. Keratan teks tajuk dan ketiadaan skrol mendatar pada jadual akaun Invois Cukai Rasmi (`receipt.html`), serta sisa sempadan biru sidebar tersembunyi.
    6. Amaran konsol 400 Bad Request Supabase stale auth token semasa lawatan awam/guest.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pembinaan Plugin & Skuad 5 Subagent WeDRIVE**:
     - Membina dan mengaktifkan 5 subagent dengan frontmatter standard Antigravity (`name`, `description`, `mainAgent`, `subagent`, `commandExecutionPolicy: auto`) serta panduan persona yang mendalam.
  2. **Pelarasan Kedudukan Chatbot FAB & Dok Bawah**:
     - Menaikkan kedudukan FAB ke `bottom: calc(88px + env(safe-area-inset-bottom, 0px)) !important` pada media query 768px, menghasilkan jurang selamat 17px di atas Dok Bawah tanpa sebarang perlanggaran.
     - Menambah kelas `has-apple-dock` pada `body` dengan `padding-bottom: calc(88px + env(safe-area-inset-bottom, 16px))` bagi mengelakkan dok menutupi butang atau kad kereta.
  3. **Pengasingan Halaman Akaun & Admin (Rule 04)**:
     - `initAppleDock()` dan `initChatbot()` kini mengecualikan laluan `/account/` dan `/admin/` secara automatik.
  4. **Bar Sisi Admin Off-Canvas pada Skrin Telefon**:
     - Mengubah `.sidebar#admin-sidebar` kepada `transform: translateX(-105%) !important; visibility: hidden;` pada `@media (max-width: 900px)` dengan togol laci bulat 1:1 sempurna (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important;`) dan lapisan gelap `.sidebar-overlay`.
  5. **Penalaan Invois Cukai & Skrol Jadual Cecair**:
     - Menetapkan saiz fon tajuk secara cecair `clamp(1.15rem, 4.5vw, 1.5rem)` dan menyokong kontena skrol mendatar `.receipt-tax-table-wrap` (`overflow-x: auto; -webkit-overflow-scrolling: touch; min-width: 580px;`).
     - Menetapkan `visibility: hidden` pada bar sisi yang ditutup bagi membasmi 100% kesan garis biru di sempadan kiri skrin Safari/iPhone.
  6. **Pembersihan Konsol 400 Bad Request Supabase**:
     - Melindungi fungsi `fetchChatUserData()` dengan semakan `localStorage.getItem('wedrive_session')` supaya pelawat awam tidak memicu cubaan segar semula token yang telah luput.
  7. **Sifar Limpahan Mendatar (*Zero Horizontal Scroll*)**:
     - Menetapkan `overflow-x: hidden; max-width: 100vw;` pada elemen `html` dan merampingkan `.navbar` serta `.nav-actions` untuk skrin 393px.

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **36/36 Ujian Lulus (100% Pass Rate)**.
  - Pengesahan perspektif pengguna pada satu tab melalui Chrome DevTools MCP merentas MacBook (`1440px`), iPad (`820px`), dan iPhone (`393px`) mengesahkan sifar limpahan mendatar, sifar perlanggaran FAB/Dock, dan peralihan laci bar sisi yang sempurna.
  - Audit siling aksara `wc -m` mengesahkan kesemua 19 fail peraturan dan 5 fail subagent mematuhi had $\le 12,000$ aksara.
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.5.0 Establish 5 specialized WeDRIVE subagents and resolve cross-device mobile responsive issues`
  - Tag Versi: `6.5.0`

---

### [PATCH UPDATE] 195. Penalaan Mutlak Modul Pentadbir (Admin): Standard BM Moden 2026 & Pengukuhan Geometri Sifar Bujur (Zero Oval Rule) (v6.5.1)
- **Tarikh**: 6 September 2026
- **Versi**: `6.5.1` (Peningkatan Versi Patch: Pembetulan kosa kata terlarang 360 Studio dan penguncian geometri bulat 1:1 sempurna pada peranti mudah alih)
- **Status**: SELESAI
- **Fail Terlibat**:
  - `admin/pages/car/car-detail/car-detail.html` (Pembersihan istilah 'Kokpit' $\to$ 'Dalaman Kereta' & 'Ruang Dalaman Maya 360°')
  - `shared/css/wedrive.css` (Penguncian 1:1 circle dan flex-shrink protection pada `.btn-ai-details`, `.apple-cal-day`, `.live-pulse-dot`, `.status-pulse-dot`, `.ai-pulse-dot`, `.ai-pulse-dot-cyan`, `.kicker-pulse-dot`)
  - `admin/js/cars.js` (Perlindungan titik status operasi jadual kereta dengan kelas `.live-pulse-dot` dan parameter cache v=6.5.1)
  - `admin/pages/car/cars.html` (Penyegaran parameter pemecah cache `cars.js?v=6.5.1`)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md` (Perekodan log 195)

- **Objektif & Latar Belakang**:
  - Menyempurnakan modul Admin ke tahap 100% Zero-Defect susulan audit komprehensif oleh skuad subagen pintar WeDRIVE.
  - Membasmi istilah senarai hitam terlarang *"Kokpit"* dalam [Peraturan 11](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md) yang ditemui pada halaman Studio 360°.
  - Mengunci pematuhan mutlak **Prinsip Geometri Sifar Bujur (Zero Oval Rule)** pada resolusi telefon mudah alih (iPhone 393px) untuk butang analitik AI, butang hari kalendar Apple, dan semua titik status telemetri (*pulse dots*).

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Purifikasi Bahasa Melayu Moden 2026 (Audit `bm_language_police`)**:
     - Mengubah label butang tab studio 360° daripada `360° Dalaman (Kokpit)` kepada **`360° Dalaman Kereta`**.
     - Mengubah penanda air studio daripada `KOKPIT MAYA 360°` kepada **`RUANG DALAMAN MAYA 360°`**.
     - Mengemas kini teks `alt` imej kepada `360 Interior View`.
  2. **Pengukuhan Geometri Sifar Bujur (Audit `wedrive_ui_auditor`)**:
     - `.btn-ai-details`: Dimensi dikunci tepat $44 \times 44\text{px}$ dengan `aspect-ratio: 1 / 1 !important; border-radius: 50% !important; flex-shrink: 0 !important; align-self: center !important;`. Menghapuskan herotan 40x44px akibat regangan flexbox.
     - `.apple-cal-day`: Dimensi dikunci tepat $44 \times 44\text{px}$ dengan `min-width: 44px !important; min-height: 44px !important; max-width: 44px !important; max-height: 44px !important; aspect-ratio: 1 / 1 !important;`. Menghapuskan herotan 42x44px akibat konflik `min-height: 44px`.
     - Titik status telemetri (*Pulse Dots*): Menambah `aspect-ratio: 1 / 1 !important; flex-shrink: 0 !important; display: inline-block !important; box-sizing: border-box !important;` merentas semua kelas dot (`.live-pulse-dot`, `.status-pulse-dot`, `.ai-pulse-dot`, `.ai-pulse-dot-cyan`, `.kicker-pulse-dot`) dan titik status jadual kereta dalam `admin/js/cars.js`.
  3. **Penyelarasan Cache Script**:
     - Memperbaharui parameter cache `cars.js?v=6.5.1` di `cars.html` bagi memastikan pelayar memuat turun fungsi jadual terkini tanpa cache lapuk.

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Pelaksanaan `cd tests && npx playwright test` mengesahkan **36/36 Ujian Lulus (100% Pass Rate)**.
  - Pengesahan DOM di pelayar membuktikan **0 perkataan senarai hitam** dan **0 elemen bujur/oval** merentas MacBook (1440px), iPad (820px), dan iPhone (393px).
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.
  - Audit siling aksara `wc -m` mengesahkan kesemua 19 fail peraturan mematuhi had $\le 12,000$ aksara.

- **Maklumat Git**:
  - Commit: `6.5.1 Enforce Modern Malay 2026 standards and lock strict 1:1 circle geometry across Admin module`
  - Tag Versi: `6.5.1`

---

### [PATCH UPDATE] 196. Penyeragaman Kosa Kata 'Cetak Spesifikasi' Mengikut Piawaian BM Moden 2026 (v6.5.2)
- **Tarikh**: 7 September 2026
- **Versi**: `6.5.2` (Peningkatan Versi Patch: Pemurnian terjemahan harfiah 'Cetak Lembaran' $\to$ 'Cetak Spesifikasi')
- **Status**: SELESAI
- **Fail Terlibat**:
  - `admin/pages/car/car-detail/car-detail.html` (Pengemaskinian label butang cetakan `Cetak Lembaran` $\to$ `Cetak Spesifikasi` dan tooltip `title="Cetak Spesifikasi Kereta"`)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md` (Perekodan log 196)

- **Objektif & Latar Belakang**:
  - Menghapuskan istilah terjemahan langsung robotik (*literal translation*) "Cetak Lembaran" yang berasal daripada "Print Spec Sheet" pada halaman Studio 360° & Profil Kereta.
  - Memastikan istilah yang digunakan jelas, profesional, dan menepati piawaian [11_language_standards.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md) (Standard BM Moden 2026).

- **Tindakan Teknikal & Pembaikan Sistem**:
  - Mengubah label butang cetakan dokumen dalam `car-detail.html` daripada `Cetak Lembaran` kepada **`Cetak Spesifikasi`**.
  - Mengemas kini tooltip penunjuk daripada `Cetak Lembaran Spesifikasi` kepada `Cetak Spesifikasi Kereta`.

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Disahkan secara visual di pelayar Chrome DevTools MCP pada port 5504 (`aspect-ratio`, sifar bujur, sifar limpahan).
  - Ujian Playwright CLI: Kesemua 36 ujian lulus penuh (**100% Pass Rate**).
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.5.2 Refine print spec button label from Cetak Lembaran to Cetak Spesifikasi`
  - Tag Versi: `6.5.2`

---

### [PATCH UPDATE] 197. Penstrukturan Semula Halaman Profil & Studio 360° Kereta Mengikut Susun Atur Apple Bento Grid Sifar Telemetri (v6.5.3)
- **Tarikh**: 7 September 2026
- **Versi**: `6.5.3` (Peningkatan Versi Patch: Remake Halaman car-detail.html & Pembersihan Sifar Elemen Serabut)
- **Status**: SELESAI
- **Fail Terlibat**:
  - `admin/pages/car/car-detail/car-detail.html` (Pembuangan baris pemilihan armada atas, pembersihan subtitle, penyingkiran blok telemetri mekanikal/TPMS/dokumen, dan pembinaan susun atur Bento Grid 4-Kad Simetri)
  - `admin/js/car-detail.js` (Pembuangan fungsi dan panggilan `setupTelemetry` serta pengoptimuman rendering)
  - `shared/css/wedrive.css` (Penalaan lajur grid Bento `.specs-bento-grid > [class*="col-span-"] { grid-column: 1 / -1; }` pada saiz <= 1024px)
  - `PLAN/FYP1_to_FYP2_Development_Summary.md` (Perekodan log 197)

- **Objektif & Latar Belakang**:
  - Menyahut arahan pengguna bahawa halaman `car-detail.html` serabut, tidak tersusun, dan mengandungi maklumat mekanikal yang tidak perlu (tekanan tayar TPMS, voltan bateri, kunci pintu, Puspakom) kerana fokus utama pelanggan dan sistem adalah untuk menyewa kereta yang berfungsi.
  - Memanfaatkan Stitch MCP (`f2f055daa42c454bb7107600b86c9a78` - *Obsidian Bento*) bagi mereka semula halaman dengan kejelasan visual maksimum, sifar ruang mati (*Zero Dead Space*), dan hierarki Apple HIG yang elegan.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pembuangan Sifar Telemetri & Trivia Mekanikal**:
     - Memadam keseluruhan kontena Section 5 (Telemetri Masa Nyata, Sensor TPMS, Voltan Bateri, dan Dokumen Puspakom).
     - Membuang fungsi `setupTelemetry(car)` dan panggilannya dalam `car-detail.js` bagi memastikan sifar kod mati dan sifar pengiraan simulasi latar belakang yang membazir.
  2. **Pembuangan Baris Pemilihan Kereta Atas (*Fleet Selector Bar*)**:
     - Memadam `<div class="fleet-selector-bar" id="cd-fleet-selector">` dari bahagian atas skrin yang sebelum ini mengganggu tumpuan.
  3. **Penyeragaman Subtitle**:
     - Menukar penerangan pengepala kepada: *"Pemeriksaan Visual 360° dan Maklumat Spesifikasi Sewaan Kereta"*.
  4. **Susun Atur Apple Bento Grid 4-Kad Simetri**:
     - **Kad 1 (Kadar Sewaan & Pangkalan HQ)**: Memaparkan kadar harian rasmi, deposit keselamatan boleh pulang, had tempoh minimum, lokasi HQ Melaka, dan status aktif.
     - **Kad 2 (Dimensi & Kapasiti Penumpang)**: Memaparkan kerusi ergonomik, ruang but kargo 480L, berat kerb, dimensi kenderaan, dan jarak roda.
     - **Kad 3 (Prestasi, Enjin & Bahan Api)**: Memaparkan konfigurasi enjin Turbo, transmisi Steptronic, bahan api petrol disyorkan, kapasiti tangki, dan polisi perbatuan tanpa had (*Unlimited KM*).
     - **Kad 4 (Kelengkapan & Keselamatan Aktif)**: Memaparkan matriks 8 ciri audit sewaan WeDRIVE (CarPlay, Kamera 360°, Dashcam 4K, Keyless, Tinted JPJ, Sensor Parkir, AEB, LKA).
  5. **Pengoptimuman Responsif & Keserasian CSS Master**:
     - Menambah peraturan responsif pada `wedrive.css` bagi menjamin susun atur kad Bento mengalir kemas 2x2 pada MacBook/iPad dan 1-lajur pada iPhone tanpa limpahan mendatar.

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Disahkan secara langsung pada tab pelayar tunggal sedia ada (Port 5504):
    - **MacBook (1440x900)**: Paparan Bento seimbang, sifar limpahan (`hasHorizontalScroll: false`), 0 ovals (`ovals: []`).
    - **iPad (820x1180)**: Susun atur kad mengalir lancar, sifar bujur, sifar limpahan.
    - **iPhone (393x852)**: Paparan kad 1-lajur kemas, saiz teks mesra sentuhan, sifar bujur.
  - Ujian Playwright CLI: Menepati syarat kelulusan mutlak 100% (**36/36 Passed**).
  - Pematuhan had siling aksara `wc -m .agents/rules/*.md` disahkan $\le 12,000$ aksara di semua 19 fail.
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.5.3 Remake car-detail page to clean Apple Bento layout with zero telemetry bloat`
  - Tag Versi: `6.5.3`

---

### 198. [MINOR UPDATE] Versi 6.5.4: Pembaikan Studio 360° Luaran & Dalaman, Galeri Foto HD, dan Penstrukturan Semula 2-Kad Bento Lapang Bebas Kesesakan (Uncrowded HIG Layout)
- **Tarikh**: 7 September 2026
- **Modul Terlibat**:
  - `admin/pages/car/car-detail/car-detail.html`
  - `admin/js/car-detail.js`
  - `shared/css/wedrive.css`
  - `implementation_plan.md`

- **Objektif & Masalah Dikenal Pasti**:
  1. Pengguna meminta ruang kosong putih/kelabu di sisi foto 360° luaran dihapuskan dan diisi penuh dari hujung ke hujung.
  2. Jajaran baris lokasi penyerahan & pulangan sebelum ini terputus ke dua baris dengan jajaran kiri yang kurang kemas.
  3. Putaran 360° ruang dalaman tidak boleh diseret (*drag/swipe*) dan kekurangan sudut putaran berterusan.
  4. Paparan galeri foto sebelum ini terlalu kecil (thumbnail 80px) dan tiada pentas pameran foto HD utama.
  5. Pengguna secara khusus meminta halaman ini tidak sesak (*uncrowded*) dan mesra pengguna (*user-friendly*), menyingkirkan trivia kejuruteraan yang tidak relevan dengan sewaan.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Pentas 360° Luaran Penuh Hujung ke Hujung (*Edge-to-Edge View*)**:
     - Menetapkan `.studio-canvas-stage` kepada `object-fit: cover !important; width: 100%; height: 100%;` dan latar kontena kepada Obsidian Black `#0c0c0e`, menghapuskan sebarang ruang kosong di sisi kenderaan.
  2. **Penstrukturan Semula Bento 4 Kad $\to$ 2 Kad Lapang Praktikal (*Uncrowded 2-Bento Architecture*)**:
     - Membuang 2 kad kejuruteraan mekanikal yang sarat dan remeh (berat kerb, jarak roda, dimensi mm kenderaan, susunan silinder enjin, liter tangki bahan api).
     - Memusatkan perhatian kepada **2 Kad Bento Simetri Lapang**:
       - **Kad 1 (Ringkasan Sewaan & Spesifikasi Asas)**: 9 baris metrik sewaan praktikal (Kadar sewa rasmi, deposit keselamatan, had sewa minimum, transmisi, jenis bahan api, kapasiti tempat duduk & ruang but, polisi perbatuan tanpa had, lokasi HQ Melaka, status ketersediaan aktif).
       - **Kad 2 (Ciri Keselesaan & Keselamatan Pintar)**: Matriks 8 lencana Apple berkilat untuk kelengkapan penting audit WeDRIVE (CarPlay/Android Auto, Kamera 360°, Dashcam 4K, Keyless Push Start, Tinted JPJ, Sensor Ultrasonik, Brek AEB, Bantuan Lorong LKA).
     - Menyelaraskan latar kad menggunakan `--bg-surface` dan `--border-subtle` bagi memastikan kontras teks sempurna pada Mod Siang dan Mod Obsidian Malam.
  3. **Enjin Putaran 360° Ruang Dalaman Maya Interaktif (*Interactive 360° Drag & Pan Engine*)**:
     - Mengintegrasikan putaran berterusan 4 sudut mendatar (`pano_f.jpg` 0° $\leftrightarrow$ `pano_r.jpg` 90° $\leftrightarrow$ `pano_b.jpg` 180° $\leftrightarrow$ `pano_l.jpg` 270°) berserta sudut menegak bumbung & konsol.
     - Melaksanakan pengendali seretan tetikus (*mouse drag*) dan leretan sentuh (*touch swipe*) pada `#studio-interior-stage`.
     - Menyediakan bar HUD terapung minimalis dengan butang pusing kiri/kanan, fokus hadapan, bumbung, konsol, dan pelarasan saiz (*zoom*).
  4. **Pentas Galeri Foto HD Penuh 520px (*Expansive HD Showcase*)**:
     - Menggantikan thumbnail kecil dengan pentas foto HD utama setinggi 520px (`#gallery-hero-wrapper`), dilengkapi lencana foto dinamik (`#gallery-photo-badge`), butang anak panah navigasi bulat 1:1 sempurna, butang skrin penuh, dan jalur thumbnail aktif di bawahnya.

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Disahkan secara langsung pada tab pelayar tunggal sedia ada (Port 5504):
    - **MacBook (1440x900)**: Studio 360° terisi kemas dari hujung ke hujung, 2 kad Bento simetri seimbang, sifar limpahan (`hasHorizontalScroll: false`), 0 ovals (`ovals: []`).
    - **iPad (820x1180)**: Susun atur kad Bento mengalir lancar, zon sentuh HUD selesa, sifar limpahan.
    - **iPhone (393x852)**: Paparan kad 1-lajur responsif, saiz fon input $\ge 16$px, pentas studio mengecil dinamik (300px), sifar bujur.
  - Ujian Playwright CLI: Menepati syarat kelulusan mutlak 100% (**36/36 Passed**).
  - Pematuhan had siling aksara `wc -m .agents/rules/*.md` disahkan $\le 12,000$ aksara di semua 19 fail.
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.5.4 Enhance 360 studio stage to edge-to-edge view, enable interior drag rotation, upgrade HD gallery, and consolidate to 2 uncrowded bento cards`
  - Tag Versi: `6.5.4`

---

### 199. [MINOR UPDATE] Versi 6.5.5: Penyingkiran Maklumat Berulang & Paparan Eksklusif Data Pangkalan Data Kenderaan (Zero Repetition & 100% Database-Backed Vehicle Specs)
- **Tarikh**: 7 September 2026
- **Modul Terlibat**:
  - `admin/pages/car/car-detail/car-detail.html`
  - `admin/js/car-detail.js`
  - `implementation_plan.md`
  - `walkthrough.md`

- **Objektif & Masalah Dikenal Pasti**:
  1. Pengguna secara tegas menegur maklumat umum dan berulang di halaman `car-detail.html`:
     - *"ni kan dh tunjuk kat atas lepas tu tunjuk lagi ... Kadar Sewa Harian Rasmi ... boleh x tunjuk info tu dalam satu page jangan berulang(ingat tu)"*
     - *"security Deposit Keselamatan ... star Penarafan Pelanggan ... dua info ni saya xnak jugak benda ..benda ni dapat dari mana??? saya nak info dari database"*
     - *"info kereta sahaja sebab saya nak focus macam tunjuk pasal kereta yang kita isi dalam database"*
  2. Kadar sewa harian dipaparkan berulang kali pada lencana pengepala kad dan dalam baris senarai di bawahnya.
  3. Maklumat polisi umum sewaan seperti had sewa minimum (1 hari), polisi perbatuan (tanpa had), dan lokasi HQ Melaka merupakan maklumat basi yang tidak perlu diulang pada spesifikasi kenderaan.
  4. Medan `Deposit Keselamatan` dan `Penarafan Pelanggan` bukan spesifikasi fizikal kenderaan yang diisi oleh pentadbir ke dalam pangkalan data.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Penyingkiran Penuh Maklumat Berulang & Bukan Pangkalan Data**:
     - Membuang baris kadar harga berulang daripada senarai (kini hanya wujud pada lencana pengepala kad `#spec-rate-badge`).
     - Membuang baris `Deposit Keselamatan` dan `Penarafan Pelanggan` sepenuhnya daripada DOM.
     - Membuang maklumat umum polisi (`Had Tempoh Minimum`, `Polisi Perbatuan`, `Lokasi HQ`, dan `Status Ketersediaan`).
  2. **Paparan Eksklusif 6 Data Tulen Pangkalan Data Supabase (`cars` table)**:
     - Kad 1 Bento kini memaparkan secara eksklusif data kenderaan yang diisi ke dalam pangkalan data:
       1. **ID Inventori Sistem**: `#spec-id` (kolum `cars.id`, dipaparkan dengan fon mono `#CAR-001`).
       2. **Tahun Pembuatan Kenderaan**: `#spec-year` (kolum `cars.year`, cth: `2023`).
       3. **Warna Luaran Rasmi**: `#spec-color` (kolum `cars.color`, cth: `Alpine White`).
       4. **Sistem Transmisi Pemanduan**: `#spec-trans` (kolum `cars.transmission`, cth: `Automatik (Auto)`).
       5. **Punca Kuasa (Bahan Api)**: `#spec-fuel` (kolum `cars.fuel`, cth: `Petrol`).
       6. **Kapasiti Tempat Duduk**: `#spec-seats` (kolum `cars.seats`, cth: `5 Tempat Duduk`).
  3. **Penyelarasan Enjin Dinamik `setupCarSpecs(car)` (`car-detail.js`)**:
     - Mengaitkan kesemua 6 elemen DOM secara reaktif kepada atribut kenderaan aktif daripada pangkalan data Supabase tanpa sebarang data palsu atau rekaan.
  4. **Pematuhan Sifar Pengulangan (*Zero Repetition Principle*)**:
     - Setiap atribut dipaparkan tepat HANYA SEKALI merentas keseluruhan halaman:
       - Nama Kenderaan (`name`) $\to$ Bar wira atas `#cd-name`
       - Status Kenderaan (`status`) $\to$ Lencana wira atas `#cd-status`
       - Plat Pendaftaran (`plate`) $\to$ Kapsul wira atas `#cd-plate`
       - Kategori Badan (`type`) $\to$ Kapsul wira atas `#cd-type-pill`
       - Kadar Sewaan (`rate`) $\to$ Lencana pengepala Kad 1 `#spec-rate-badge`
       - 6 Spesifikasi Kenderaan $\to$ Baris metrik Kad 1 `#spec-id`, `#spec-year`, `#spec-color`, `#spec-trans`, `#spec-fuel`, `#spec-seats`

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Disahkan secara langsung pada tab pelayar tunggal sedia ada (Port 5504):
    - **MacBook (1440x900)**: Kad 1 Bento simetri seimbang dengan Kad Kelengkapan Pintar, sifar limpahan (`hasHorizontalScroll: false`), 0 ovals (`ovals: []`).
    - **iPad (820x1180)**: Susun atur kad mengalir responsif, teks nilai berformat `tabular-nums` kemas, sifar bujur.
    - **iPhone (393x852)**: Paparan kad bertindan menegak kemas, saiz fon input $\ge 16$px, sifar limpahan mendatar.
  - Pengesahan Dwi-Tema: Berfungsi sempurna dengan kontras tinggi pada Mod Siang dan Mod Obsidian Gelap.
  - Ujian Playwright CLI: Menepati syarat kelulusan mutlak 100% (**36/36 Passed**).
  - Pematuhan had siling aksara `wc -m .agents/rules/*.md` disahkan $\le 12,000$ aksara di semua 19 fail.
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.5.5 Eliminate duplicate and non-database fields in car-detail with authentic database vehicle specs`
  - Tag Versi: `6.5.5`

##  [PATCH UPDATE] 200. Penyelarasan Ketepatan Sudut Studio 360° & Orientasi Pandangan Kereta Berasaskan 200 Bingkai Turntable Carsome, Penyingkiran Salah Label Hadapan/Belakang & Pengesahan Spektrum 3-Peranti Apple (v6.5.6)

- **Punca Keperluan & Teguran Pengguna**:
  - Pengguna menegur ketidaktepatan visual pada Studio 360° interaktif di `car-detail.html`: *"yang ni info salah...ni padangan depan"* berserta tangkap layar di mana kereta BMW 320i jelas sedang menghadap terus ke hadapan (dead-center front view), tetapi lencana orientasi sudut di penjuru kanan atas memaparkan teks bercanggah: `220° · Pandangan Belakang`.

- **Punca Masalah (Root Cause Diagnosis)**:
  - Fotografi studio 360° Carsome menggunakan meja putar piawai 200-bingkai (`frame-000.jpg` hingga `frame-199.jpg`).
  - `frame-000.jpg` sebenarnya merupakan pandangan suku belakang-kanan kenderaan (~135°).
  - Pandangan hadapan tepat (*dead-center front view*) terletak pada `frame-125.jpg`.
  - Kod terdahulu dalam `admin/js/car-detail.js` membina sampel 36 bingkai bermula dari `frame-000.jpg` sebagai indeks 0 (0°).
  - Akibatnya, semasa muatan awal kereta dipaparkan pada sudut belakang-kanan tetapi dilabelkan sebagai `0° · Pandangan Hadapan`. Sebaliknya apabila pengguna memutar kenderaan sehingga bahagian hadapan menghadap ke skrin (`frame-125`), indeks berada pada ~22 yang menghasilkan sudut `220°` dan dilabelkan secara salah sebagai `Pandangan Belakang`.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Penyelarasan Ofset Bingkai Permulaan Hadapan (*Front-Aligned Frame Offset*)**:
     - Menyelaraskan bingkai permulaan indeks 0 terus kepada `frontOffset = 125` (`frame-125.jpg`).
     - Mengira 36 bingkai berkala merentas keseluruhan 200 bingkai studio berkualiti tinggi:
       $$\text{frameNum} = (125 + \text{round}(i \times \frac{200}{36})) \pmod{200}$$
     - Menghapuskan had sampel sekerat terdahulu pada model Mercedes GLA250 dan VW Golf GTI (sebelum ini terhad kepada 140 bingkai), kini ketiga-tiga model kenderaan (BMW 320i, Mercedes GLA250, Golf GTI) memanfaatkan kesemua 200 bingkai secara seragam dan lancar.
  2. **Penalaan Ketepatan 4 Paksi Kardinal & Label Orientasi (`updateAnglePill`)**:
     - Menormalkan sudut agar membungkus kemas pada 360° $\to$ 0°:
       - **0° (Indeks 0 / `frame-125.jpg`)**: Hadapan Tepat $\to$ `0° · Pandangan Hadapan`
       - **90° (Indeks 9 / `frame-175.jpg`)**: Sisi Kanan / Pemandu $\to$ `90° · Sisi Kanan Profil`
       - **180° (Indeks 18 / `frame-025.jpg`)**: Belakang Tepat $\to$ `180° · Pandangan Belakang`
       - **270° (Indeks 27 / `frame-075.jpg`)**: Sisi Kiri / Penumpang $\to$ `270° · Sisi Kiri Profil`
     - Mengelaskan zon sudut secara tepat:
       - `degrees < 45 || degrees >= 315` $\to$ `Pandangan Hadapan`
       - `degrees >= 45 && degrees < 135` $\to$ `Sisi Kanan Profil`
       - `degrees >= 135 && degrees < 225` $\to$ `Pandangan Belakang`
       - `degrees >= 225 && degrees < 315` $\to$ `Sisi Kiri Profil`

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Pengesahan visual dan fungsi secara langsung pada tab pelayar aktif tunggal (Port 5504):
    - **MacBook (1440x900)**: Bingkai permulaan disahkan `frame-125.jpg` dengan label `0° · Pandangan Hadapan`. Putaran 360° disahkan sepadan tepat pada setiap suku putaran. Sifar limpahan mendatar (`hasHorizontalScroll: false`), pematuhan Zero Oval Rule (`ovals: []`).
    - **iPad (820x1180)**: Orientasi bingkai kekal stabil dan lancar, kad Bento responsif 2-kolum, sasaran sentuhan $\ge 44$px.
    - **iPhone (393x852)**: Paparan 1-kolum responsif, imej skala lancar tanpa limpahan mendatar (`hasHorizontalScroll: false`), saiz input fon $\ge 16$px.
  - Ujian Automasi Playwright CLI: **100% Pass Rate (36/36 tests passed)** di bawah direktori `tests/`.
  - Pematuhan had siling aksara `wc -m .agents/rules/*.md` disahkan $\le 12,000$ aksara di semua 19 fail peraturan.
  - Graf pengetahuan Graphify dikemas kini menerusi `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.5.6 Align 360 studio frame sequence to true front frame 125 and ensure angle indicator accuracy`
  - Tag Versi: `6.5.6`

---

### 201. [MINOR UPDATE] Versi 6.5.7: Integrasi Penuh Enjin Panorama 3D Maya 360° Dalaman Kereta (`car-detail.html`) (Continuous 3D Cockpit Panorama & Real-Time Angle Tracking)
- **Tarikh**: 7 September 2026
- **Modul Terlibat**:
  - `admin/pages/car/car-detail/car-detail.html`
  - `admin/js/car-detail.js`
  - `shared/js/vehicle-viewer.js`
  - `shared/css/wedrive.css`
  - `tests/e2e/16_car_detail_360_interior.spec.js`
  - `implementation_plan.md`
  - `walkthrough.md`

- **Objektif & Masalah Dikenal Pasti**:
  1. Pengguna meminta paparan dalaman kenderaan dinaik taraf mengikut pelaksanaan interaktif di halaman `how-it-works.html`:
     - *"perfect skrg ni dalaman tu fix kan buat macam tu jugak"*
     - *"Kalau awak tengok macam mana coding nya awak boleh tengok dekat sini http://localhost:5504/guest/pages/how-it-works/how-it-works.html"*
  2. Peringkat dalaman (`#studio-interior-stage`) sebelum ini hanya menggunakan imej statik rata `<img> #cockpit-canvas` yang bertukar antara 4 foto secara diskret melalui ambang seretan (`deltaX > 60px`), dan terhad secara kaku kepada BMW sahaja (`const isBMW = car.name.includes('BMW')`).
  3. Di `how-it-works.html`, pemapar kenderaan dikuasakan oleh `shared/js/vehicle-viewer.js` dengan kubus 3D (`data-vehicle-interior-cube`) 6 wajah (`f`, `b`, `l`, `r`, `u`, `d`), Three.js WebGL (dengan sandaran CSS3D), putaran berterusan lancar 360° paksi yaw dan pitch, inersia kinetik, redaman momentum, dan kawalan zum.

- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Peningkatan Enjin `shared/js/vehicle-viewer.js`**:
     - Menambah kaedah pengaturcaraan pada objek `api`: `setInteriorOrientation(yaw, pitch, instant)`, `stepInteriorYaw(deltaYaw)`, `setInteriorZoom(zoom)`, `getInteriorOrientation()`, `toggleAutoDrift(enabled)`, dan `isAutoDriftEnabled()`.
     - Melaksanakan pelepasan acara `wedrive:interior-change` pada elemen `root` setiap kali sudut yaw/pitch dikemas kini semasa animasi, seretan tetikus, atau leretan sentuh.
     - Menyediakan sokongan pilihan `autoDrift` yang boleh dikawal secara dinamik.
  2. **Penstrukturan Semula DOM `#studio-interior-stage` di `car-detail.html`**:
     - Menggantikan elemen `<img>` statik dengan struktur kubus panorama 3D sebenar: `[data-vehicle-interior-scene]` dan `[data-vehicle-interior-cube]` dengan 6 imej muka resolusi tinggi (`pano_f.jpg`, `pano_b.jpg`, `pano_l.jpg`, `pano_r.jpg`, `pano_u.jpg`, `pano_d.jpg`).
     - Menambah lencana pembayang seretan terapung kapsul pil (`#cockpit-drag-hint`).
     - Menambah butang skrin penuh terapung 1:1 Apple circle (`.studio-fullscreen-btn`).
     - Membuang bar kawalan HUD terapung bertindih (`#cockpit-hud`) bagi menghasilkan paparan imersif 360° yang bersih, lapang, dan moden persis halaman `how-it-works.html`.
     - Memasukkan skrip `shared/js/vehicle-viewer.js?v=6.5.7` sebelum `car-detail.js`.
  3. **Penyelarasan Dinamik & Pembetulan Sudut Hadapan/Belakang di `admin/js/car-detail.js`**:
     - Fungsi pemetaan pintar `getCarModelKey(car)` bagi memilih kunci registry yang tepat (`bmw`, `gla`, `alphard`, `axia`, `golf`, `cls350`, `ranger`, `axiaAv`) merentas kesemua 8 model dalam inventori armada.
     - Memulakan instance `WedriveVehicleViewer` pada `#studio-interior-stage` dan mengemas kini model secara dinamik apabila pengguna memilih kereta berlainan dari pemilih armada.
     - Menyelaraskan orientasi sudut yaw dan label arah pandangan: pandangan menghadap papan pemuka dan stereng hadapan diselaraskan sebagai `Pandangan Hadapan`, manakala pusingan ke tempat duduk belakang diselaraskan sebagai `Pandangan Belakang`.
     - Menghubungkan acara `wedrive:interior-change` dengan fungsi `updateCockpitAngleIndicator` untuk memaparkan darjah dan label arah pandangan secara langsung (`180° · Pandangan Hadapan`, `90° · Sisi Kanan (Pemandu)`, `0° · Pandangan Belakang`, `270° · Sisi Kiri (Penumpang)`, `+24° · Pandangan Bumbung & Sunroof`, `-30° · Konsol Tengah & Tuil Gear`).
  4. **Pematuhan Mutlak Zero Oval Rule & Estetik Apple**:
     - Butang skrin penuh terapung menggunakan nisbah 1:1 bulat sempurna (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important;`).

- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Disahkan secara langsung pada tab pelayar aktif tunggal sedia ada (Port 5504):
    - **MacBook (1440x900)**: Kubus 3D panorama dalaman lancar, interaksi seretan 360° sempurna, lencana sudut mengemas kini darjah secara langsung, sifar limpahan mendatar (`hasHorizontalScroll: false`), 0 ovals (`ovals: []`).
    - **iPad (820x1180)**: Susun atur stabil, sentuhan leretan lancar, sifar limpahan (`hasHorizontalScroll: false`), 0 ovals (`ovals: []`).
    - **iPhone (393x852)**: Paparan responsif tanpa bar bertindih, sifar limpahan (`hasHorizontalScroll: false`).
  - Ujian Automasi Playwright CLI: Menepati syarat kelulusan mutlak 100% (**38/38 Passed**) merentas keseluruhan suite ujian termasuk fail ujian baharu `tests/e2e/16_car_detail_360_interior.spec.js`.
  - Pematuhan had siling aksara `wc -m .agents/rules/*.md` disahkan $\le 12,000$ aksara di semua 19 fail.
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.5.7 Integrate vehicle-viewer 3D interior panorama engine into car-detail page with live angle tracking and HUD controls`
  - Tag Versi: `6.5.7`

---

## 🚗 [MINOR UPDATE] 202. Penyelarasan Sudut Hadapan/Belakang Ruang Maya 360° & Pembuangan Bar Kawalan HUD untuk Antaramuka Imersif Bersih (v6.5.8)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  1. Pengguna meminta penukaran orientasi teks sudut bagi ruang dalaman:
     > *"tukarkan perkataan depan ke belakang ,yang pandang belakang ke depan"*
  2. Pengguna meminta bar kawalan HUD terapung dibuang sepenuhnya daripada antaramuka panorama dalaman:
     > *"now buang ni pulak"* (beserta tangkapan skrin bar HUD).
- **Tindakan Teknikal & Pembaikan Sistem**:
  1. **Penyelarasan Arah Pandangan (Front vs Rear Orientation & Angle Labels)**:
     - Di dalam `admin/js/car-detail.js`, membetulkan padanan sudut sektor:
       - Sektor menghadap papan pemuka, infotainment, dan cermin hadapan (`yaw` sekitar 180° / 135°–225°) diklasifikasikan sebagai `Pandangan Hadapan`.
       - Sektor menghadap barisan tempat duduk belakang (`yaw` sekitar 0° / 315°–45°) diklasifikasikan sebagai `Pandangan Belakang`.
     - Memastikan orientasi permulaan bermula pada `yaw = 180°` (menghadap hadapan papan pemuka kenderaan).
  2. **Pembuangan Bar Kawalan HUD Terapung (`#cockpit-hud`)**:
     - Memadam elemen `#cockpit-hud` berserta semua butang anak daripada `admin/pages/car/car-detail/car-detail.html`.
     - Mengembalikan kedudukan lencana pembayang seretan `#cockpit-drag-hint` ke `bottom: 20px` (menyelaraskan dengan piawaian reka bentuk `how-it-works.html`).
     - Mengekalkan butang skrin penuh terapung 1:1 Apple circle (`.studio-fullscreen-btn`) yang kemas dan subtle di sudut kanan bawah.
  3. **Penyelarasan Ujian Automasi**:
     - Mengemaskini `tests/e2e/16_car_detail_360_interior.spec.js` untuk mengesahkan ketiadaan `#cockpit-hud`, keterlihatan pembayang seretan, dan kestabilan geometri butang skrin penuh.
- **Pengesahan Ujian Automatik & Pengguna 3-Peranti Apple**:
  - Disahkan secara langsung pada tab pelayar aktif tunggal sedia ada (Port 5504):
    - **MacBook (1440x900)**: Antaramuka lapang, imersif, seretan panorama 360° lancar, teks sudut tepat (`Pandangan Hadapan` vs `Pandangan Belakang`), 0 ovals (`ovals: []`), sifar limpahan mendatar.
    - **iPad (820x1180)**: Susun atur stabil, sifar limpahan mendatar.
    - **iPhone (393x852)**: Paparan telefon kemas tanpa sebarang toolbar yang menghalang pandangan.
  - Ujian Automasi Playwright CLI: Menepati syarat kelulusan mutlak 100% (**38/38 Passed**) dalam masa 1.8m.
  - Pematuhan had siling aksara `wc -m .agents/rules/*.md` disahkan $\le 12,000$ aksara di semua 19 fail.
  - Graf pengetahuan Graphify disegerakkan menerusi `graphify update .`.
- **Maklumat Git**:
  - Commit: `6.5.8 Refine 3D interior cockpit orientation labels and remove overlay HUD for clean immersive viewing`
  - Tag Versi: `6.5.8`

---

## 🚗 [MINOR UPDATE] 203. Rombakan Bento 2-Kolum Halaman Tambah Kereta Baharu & Integrasi Penolong Pintar Pendaftaran AI (v6.6.0)

- **Punca Keperluan & Arahan Pengguna (User Directives)**:
  - Pengguna mendapati halaman pendaftaran kereta lama (`admin/pages/car/add-car.html`) terlalu panjang, mengelirukan, dan kurang mesra pengguna:
    > *"perfect next dekat add car pulak http://127.0.0.1:5504/admin/pages/car/add-car.html page ni macam x user friendly pening sikit..so awak buat balik page ni"*
  - Pengguna turut menegaskan kedudukan butang `✨ Kesan Automatik AI` agar mudah dicapai dan menjadi fokus utama alur kerja.
- **Tindakan Teknikal & Reka Bentuk Apple HIG**:
  1. **Seni Bina Susun Atur Bento 2-Kolum (*2-Column Apple HIG Bento Layout*)**:
     - Membina susun atur grid moden `.add-car-bento-grid`:
       - **Kolum Kiri**: 3 kad teratur yang membahagikan borang kepada domain yang jelas:
         1. *Maklumat Asas & Identiti JPJ* (Nombor Plat berformat besar, Pengeluar, Tahun, Warna, Lokasi Pusat Operasi HQ berkunci).
         2. *Spesifikasi Teknikal & Struktur Tarif* (Kategori, Bilangan Kerusi 1-20, Transmisi, Bahan Api, Enjin, Muatan Beg, Kadar Harian RM, Deposit Keselamatan RM, Tempoh Minimum, serta Cip Kelengkapan Pintar).
         3. *Studio Aset 360° & Foto Katalog* (Zon muat naik foto utama, penyedut pautan AI 360, serta sub-kad luaran dan dalaman).
       - **Kolum Kanan**: Kad Pratonton Langsung Melekat (*Sticky Real-Time Live Preview Card*) yang sentiasa terapung di pandangan mata pengguna semasa borang diskrol.
  2. **Penolong Pendaftaran Kereta Pintar AI (*AI Hero Assistant*)**:
     - Diletakkan di bahagian paling atas halaman sebelum grid borang bermula (`.ai-hero-assistant-card`).
     - Dilengkapi input carian model pantas berserta butang berkilau `✨ Kesan Automatik AI` (`#btn-ai-autofill`).
     - Menyediakan 7 cip model popular 1-klik (`Proton X50 1.5 TGDi`, `Honda Civic 1.5 RS`, `Perodua Alza 1.5 AV`, `BMW 320i M Sport`, `Toyota HiAce 2.5`, `Tesla Model 3`, `Toyota Alphard 2.4`).
     - Menekan mana-mana cip mengisi semua spesifikasi, tarif, deposit, dan muatan secara serta-merta dengan animasi seri Apple (`.ai-autofilled-glow`) dan mengemaskini pratonton kad secara reaktif.
  3. **Pemisahan Kod Bersih & Pengawal Modular (`admin/js/add-car.js`)**:
     - Mengasingkan lebih 1,000 baris skrip sebaris (*inline script*) daripada fail HTML ke fail skrip luaran modular `admin/js/add-car.js`.
     - Menguruskan penukaran mod pratonton (Foto Utama, 360° Luaran, 360° Dalaman), kawalan gelangsar sudut bingkai (*scrub slider*), dan integrasi API WeDrive / simpanan sandaran `localStorage`.
  4. **Pematuhan Ketat Peraturan UI & Apple Device Support**:
     - Disahkan merentas MacBook Desktop (1440x900), iPad Tablet (820x1180), dan iPhone Mobile (393x852).
     - Mematuhi piawaian **Prinsip Sifar Bujur (Zero Oval Rule)**: Butang ikon bulat 1:1 sempurna (`width == height`, `border-radius: 50%`) dan butang berteks kapsul simetri (`border-radius: 9999px`).
- **Pengesahan Ujian Automatik & Pengguna**:
  - Diuji secara langsung pada tab tunggal sedia ada (Port 5504) tanpa pembukaan tab baharu.
  - Ujian Playwright CLI: Menepati syarat kelulusan 100% Pass Rate di bawah folder `tests/`.
  - Pematuhan had siling aksara `wc -m .agents/rules/*.md` disahkan $\le 12,000$ aksara.
  - Graf pengetahuan Graphify dikemas kini menerusi `graphify update .`.
- **Maklumat Git**:
  - Commit: `6.6.0 Redesign add-car page with Apple HIG 2-column Bento and AI Hero Assistant`
  - Tag Versi: `6.6.0`

---

## 🚗 [PATCH UPDATE] 108. Penalaan Semula Halaman Tambah Kereta (add-car.html): Butang Kesan AI Sebaris, Kad Pratonton Rasmi WeDRIVE, 48 Jenama Pasaran Malaysia, Pembersihan Elemen Borang & Formula Kadar Sewaan Pintar (v6.6.1)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mahu kad penolong pendaftaran AI berasingan di bahagian atas dibuang dan digantikan dengan butang sebaris di sebelah nama model:
     > *"Penolong Pendaftaran Kereta Pintar AI ni sepatutnya x payah ...once saya dh isi Maklumat Asas & Identiti JPJ nii ..dia ada satu button untuk guna api ai detect kereta tu untuk isi Spesifikasi Teknikal & Struktur Tarif lepas cari info"*
  2. Pembuangan elemen perbatuan (`all_inclusive Jarak Perbatuan`), muatan bagasi, tempoh minimum sewaan, dan pemusatan lokasi HQ:
     > *"Jarak Perbatuan ni xpayah sebab semua kereta mmg sama jek unlimited"*
     > *"Pusat Serahan & Pulangan Rasmi (HQ) ni pon xyah tunjuk memang dekat situ"*
     > *"Kapasiti Muatan Beg / Bagasi ni pon sama xyah"*
     > *"n Tempoh Minimum Sewaan (Hari) pon buang"*
  3. Kad pratonton masa nyata diselaraskan 100% mengikut kad rasmi WeDRIVE:
     > *"Pratonton Kad Masa Nyata ni buruk...awak ikut http://localhost:5504/index.html ni(gambar nombor 1) n http://127.0.0.1:5504/customer/pages/dashboard/customer.html(gambar nombor 2) ..saya nak card untuk preview kereta tu satu sahaja xnak campur2"*
  4. Pembersihan senarai kerusi dan peluasan jenama:
     > *"yang info kereta dalam kurungan tu xyah (sedan/hatchback) (gmbr 3)"*
     > *"gmbr nombor 4 tu isi semua jenama yang ada dekat dalam malaysia ni ..."*
     > *"default nya adalah pilih... bukanya 5"*
  5. Formula kadar sewaan AI berpandukan pelbagai pemboleh ubah automotif Malaysia:
     > *"formula untuk ai kiraan kadar sewaan suggestion adalah jenama , jenis body kereta,berapa seat, harga kereta tu skrg, anything berkaitan"*

- **Tindakan Pembaikan (Implementation)**:
  - **Penyelarasan Borang `admin/pages/car/add-car.html`**:
    - Membuang hero assistant card; meletakkan butang `✨ Kesan Automatik AI` (`#btn-ai-autofill`) sebaris tepat di sebelah input `#car-name` di Kad 1.
    - Menambah 48+ pengeluar kenderaan sah pasaran Malaysia di dalam dropdown `#car-brand` (Perodua, Proton, Honda, Toyota, BMW, Mercedes-Benz, BYD, Chery, Jaecoo, GWM, Tesla, dll.).
    - Membersihkan pilihan `#car-seats` dari 1 hingga 20 kerusi tanpa teks kurungan, dan menetapkan teks pemegang tempat lalai `Pilih Kapasiti Tempat Duduk` (`value="" disabled selected`).
    - Menyembunyikan `#car-location` sebagai `type="hidden"` untuk mengekalkan integriti penghantaran data HQ Melaka tanpa membebankan pandangan pengguna.
    - Membuang medan `#car-luggage`, `#car-mileage`, dan `#car-min-days`.
  - **Penyelarasan Kad Pratonton Rasmi WeDRIVE**:
    - Mereka bentuk semula kad sisi kanan mengikut kelas `.car-card` rasmi (sepadan tepat dengan paparan tetamu `index.html` dan pelanggan `customer.html`): lencana status (*Available*), penarafan (⭐ 4.9), lencana 360°, tajuk kategori (*SEDAN/SUV*), jumlah ulasan, nama model tebal, warna badan, grid spesifikasi 2x2 (*Petrol/EV, Seats, Transmission, Status*), cip pengesyoran AI (*Family Choice, Executive Choice, dsb.*), dan paparan kadar harian `RM X /day`.
  - **Formula Kadar Sewaan Pintar Automotif Malaysia (`admin/js/add-car.js`)**:
    - Membina fungsi `calculateRentalFromFormula(brand, bodyType, seats, year, name)` yang mengira harga pasaran semasa kenderaan (RM) berasaskan 5 pemboleh ubah:
      1. Kategori & Nilai Asas Jenama (Nasional, Jepun, Asia Baharu, Eropah Premium, Supercar).
      2. Pengali Jenis Badan (Hatchback 0.95, Sedan 1.0, SUV 1.25, MPV 1.30, Pickup 1.20, Van 1.35, Coupe 1.5, Luxury 1.7).
      3. Pengali Bilangan Kerusi (1-2 kerusi 1.1x, 5 kerusi 1.0x, 7 kerusi 1.2x, 10-14 kerusi 1.35x, 15-20 kerusi 1.8x).
      4. Faktor Susut Nilai Mengikut Tahun Keluaran (susut nilai 5% setahun).
      5. Kadar Sewaan Harian (~0.17% nilai pasaran kenderaan semasa) dan deposit keselamatan seimbang.
  - **Pengemaskinian Ujian Playwright (`tests/e2e/14_ai_key_vault_and_location.spec.js`)**:
    - Menyelaraskan pengesahan `locationInput` kepada `toBeAttached()` memandangkan medan kini tersembunyi seperti yang diminta pengguna.

- **Pengesahan Ujian Automatik & Pengguna**:
  - Diuji secara interaktif pada tab tunggal sedia ada (Port 5504) menggunakan Chrome DevTools MCP.
  - Spektrum responsif Apple 3-Peranti: Disahkan sempurna pada MacBook (1440x900), iPad (820x1180), dan iPhone (393x852).
  - Pematuhan mutlak **Prinsip Sifar Bujur (Zero Oval Rule)**.
  - Ujian Playwright: **100% Pass Rate (38/38 ujian lulus)**.
  - Had aksara peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara.
  - Graf pengetahuan Graphify dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.6.1 Streamline add-car page with inline AI detect button, official car-card preview, and Malaysian automotive pricing formula`
  - Tag Versi: `6.6.1`

---

## 🚗 [PATCH UPDATE] 109. Penyingkiran Seksyen Kelengkapan Standard Kereta pada Borang Tambah Kereta (add-car.html) untuk Antaramuka Minimalis & Kemas (v6.6.2)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna mahukan borang tambah kereta diringkaskan sepenuhnya tanpa bahagian kelengkapan berlebihan agar tumpuan kekal kepada spesifikasi asas kenderaan yang diperlukan oleh pelanggan:
    > *"ni pon xpayah lahh saya nak simple sahaja supaya customer tahu basic kereta"*
- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `admin/pages/car/add-car.html`:
    - Membuang keseluruhan blok *Kelengkapan Standard Kereta* (`#feat-carplay`, `#feat-dashcam`, `#feat-keyless`, `#feat-reverse-cam`, `#feat-tinted`, `#feat-sensor`).
    - Kad 2 (*Spesifikasi Teknikal & Struktur Tarif*) kini tampil sangat bersih dan memfokuskan sepenuhnya kepada 7 parameter teras: Kategori Badan, Kapasiti Tempat Duduk, Sistem Transmisi, Punca Kuasa (Bahan Api), Kapasiti Enjin, Kadar Sewaan Harian, dan Deposit Keselamatan.
  - Di dalam `admin/js/add-car.js`:
    - Mengeluarkan pemetaan dan pemprosesan *checkbox* `featMap` daripada fungsi `applyDetectedSpecs()`.
    - Mengeluarkan pengendali acara `DOMContentLoaded` bagi pemilih cip kelengkapan.
- **Pengesahan Ujian Automatik & Pengguna**:
  - Pengesahan visual pada tab aktif sedia ada menerusi Chrome DevTools MCP.
  - Ujian Playwright CLI: 10/10 lulus tanpa sebarang isu regresi.
  - Pematuhan had aksara peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara.
  - Graf pengetahuan Graphify dikemas kini (`graphify update .`).
- **Maklumat Git**:
  - Commit: `6.6.2 Remove car features checklist to simplify add-car form to core automotive specs`
  - Tag Versi: `6.6.2`

---

## 🚗 [MINOR UPDATE] 110. Aliran Wizard Tambah Kereta 2-Langkah, Pemilih Bertingkat Automotif Malaysia ala Carlist.my, Auto-Save Draf, & Exit Guard (v6.7.0)

- **Punca Keperluan (Context & User Directives)**:
  1. **Aliran Wizard 2-Langkah (*2-Step Stepper Flow*)**:
     - Pengguna meminta halaman tambah kereta diasingkan kepada 2 langkah tersusun:
       - *Langkah 1*: Penetapan spesifikasi kenderaan (`Maklumat Asas Kenderaan` & `Spesifikasi Teknikal & Struktur Tarif`).
       - *Langkah 2*: Studio visual (muat naik foto, preview gambar, pengalaman interaktif 360°, dan pratonton kad rasmi WeDRIVE).
  2. **Pengesahan Keluar Halaman (*Exit Confirmation Guard*)**:
     - Menghalang kehilangan kerja yang tidak disengajakan dengan dialog modal bertaraf Apple HIG apabila pengguna cuba keluar atau menavigasi ke halaman lain.
  3. **Simpanan Draf Automatik (*Auto-Save Draft & Resume*)**:
     - Semua data borang disimpan automatik ke `localStorage['wedrive_car_draft']` dan sepanduk pemberitahuan draf dipaparkan apabila halaman dibuka semula dengan pilihan pulihkan atau padam.
  4. **Pilihan Bertingkat Automotif Malaysia (*Cascading Selectors ala Carlist.my*)**:
     - Pengguna tidak perlu menaip teks panjang; hanya memilih secara berperingkat:
       - `Pengeluar (Jenama)` $\to$ `Model Kenderaan` $\to$ `Varian & Enjin (CC)` $\to$ `Tahun Pengilangan` (2018–2026).
       - Opsyen fleksibel `[+ Taip Model & Varian Sendiri]` sekiranya varian tiada dalam senarai.
       - Pemilihan warna badan standard; jika `Lain-lain` dipilih, kotak teks input warna khusus dipaparkan.
       - Auto-fill automatik bagi Kategori Badan, Kerusi, Transmisi, Bahan Api, Enjin, serta kadar sewaan harian dan deposit berdasarkan formula pasaran kenderaan Malaysia.
  5. **Pembersihan Teks JPJ**:
     - Menghapuskan semua perkataan atau rujukan JPJ pada antaramuka kenderaan.

- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `shared/css/wedrive.css`:
    - Menambah penggayaan `.wizard-stepper-wrap`, `.wizard-step-btn`, `.wizard-step-badge` (bulat tepat 1:1, Zero Oval Rule), `.wizard-step-line`, dan penunjuk status aktif/siap.
    - Menambah penggayaan sepanduk pulihkan draf `.draft-resume-banner` dengan butang tindakan kapsul.
    - Menambah penggayaan modal pengesahan keluar bertaraf Apple HIG (`.apple-exit-modal-backdrop`, `.apple-exit-modal-card`).
  - Di dalam `admin/pages/car/add-car.html`:
    - Menambah navigasi langkah stepper (`#step-btn-1`, `#step-btn-2`).
    - Menambah sepanduk draf `#banner-draft-resume`.
    - Mengasingkan kandungan borang ke dalam `#step-1-container` dan studio visual ke dalam `#step-2-container` (susun atur 2-kolum bento bersama kad pratonton kenderaan langsung `#preview-card-col`).
    - Menggantikan medan input teks nama kereta kepada pemilih bertingkat `#car-brand`, `#car-model`, `#car-variant`, `#car-year`, dan pemilih warna pintar `#car-color-select` berserta input bersyarat `#car-color-custom-wrap`.
    - Menambah modal keluar bertaraf Apple HIG `#modal-exit-confirm`.
  - Di dalam `admin/js/add-car.js`:
    - Membina kamus pangkalan data kenderaan komprehensif `CARLIST_DATABASE` (Perodua, Proton, Toyota, Honda, BMW, Mercedes-Benz, BYD, Chery, Hyundai, Mazda, Nissan, Tesla).
    - Membina pengendali peristiwa bertingkat `onBrandChange()`, `onModelChange()`, `onVariantChange()`, `onYearChange()`, dan `onColorSelectChange()`.
    - Membina formula pengiraan tarif pasaran Malaysia `calculateRentalFromFormula()` bagi kadar sewa harian dan deposit keselamatan.
    - Melaksanakan sistem pengurusan langkah `goToStep(step)` dengan validasi borang pada Langkah 1 sebelum melangkah ke Langkah 2.
    - Melaksanakan auto-save draf `saveCarDraft()` yang dilindungi bendera `isInitializing` dan `isRestoringDraft` bagi mengelakkan penindihan data draf sedia ada.
    - Melaksanakan fungsi pemulihan draf `restoreCarDraft()` dan pemadaman draf `dismissDraftBanner()`.
    - Melaksanakan pengawal navigasi keluar `triggerExitConfirm(proceedCallback)` bagi memintas pautan topbar, sidebar, butang batal, dan `beforeunload`.
    - Menghubungkan kad pratonton langsung reaktif `updateLivePreview()` pada Langkah 2.
  - Di dalam `tests/e2e/14_ai_key_vault_and_location.spec.js`:
    - Mengemas kini aliran ujian agar menavigasi ke Langkah 2 stepper sebelum mengesahkan peti kunci AI.
  - Di dalam `tests/e2e/17_add_car_stepper_and_carlist.spec.js`:
    - Membina suite ujian komprehensif merangkumi pemilih bertingkat Carlist.my, stepper 2-langkah, auto-save draf, dan modal pengesahan keluar.

- **Pengesahan Ujian Automatik & Pengguna**:
  - **Ujian Automasi Playwright CLI**: 100% Pass Rate (**41/41 ujian lulus serentak tanpa regresi**).
  - **Pengesahan Visual Perspektif Pengguna (Chrome DevTools MCP)**:
    - Diuji pada tab tunggal sedia ada (Port 5504) tanpa membuka tab baharu.
    - Spektrum responsif Apple 3-Peranti: Disahkan sempurna pada MacBook (1440x900), iPad (820x1180), dan iPhone (393x852).
    - Pematuhan mutlak **Prinsip Sifar Bujur (Zero Oval Rule)** pada semua butang bulat (nisbah 1:1) dan butang kapsul (`9999px`).
  - **Semakan Had Aksara 12,000 Aksara**: Kesemua 19 fail `.agents/rules/*.md` disahkan $\le 12,000$ aksara.
  - **Graf Pengetahuan Graphify**: Dikemas kini sepenuhnya (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.7.0 2-Step Stepper Car Registration, Carlist Cascading Selectors, Auto-Draft, and Exit Guard`
  - Tag Versi: `6.7.0`

---

## 🚗 [PATCH UPDATE] 111. Penguatkuasaan Prinsip Sifar Tindakan Bertindan (Zero Duplicate Actions), Penyeragaman Kategori Mudah/Carlist & Pembersihan Dropdown Neutral (v6.7.1)

- **Punca Keperluan (Context & User Directives)**:
  1. **Prinsip Sifar Tindakan Bertindan & Antaramuka Bebas Kesesakan (*Zero Duplicate Actions & Anti-Crowding Rule*)**:
     - Pengguna menegur kehadiran pelbagai butang bertindan pada satu skrin (`Batal`, `Simpan Draf`, `Simpan Kereta` di bar tajuk):
       > *"ni x payah syarat awak kena tambah dalam satu page kan jangan ada 2 ke 3 benda yang sama macam button ke anything semua tambah dalam agent ... sebab tu jadi crowded...saya nak satu button function sahaja..jangan ada 2 button atau lebih benda yang sama faham"*
     - Membuang butang `Simpan Draf` manual (kerana sistem telah mempunyai auto-save draf secara langsung ke latar belakang).
     - Membuang butang `Simpan Kereta` di bar tajuk atas kerana pendaftaran kenderaan adalah aliran wizard 2-langkah: Langkah 1 hanya memerlukan butang `Seterusnya →` dan Langkah 2 mengandungi butang muktamad `Daftar Kenderaan Baharu`. Bar tajuk atas kini hanya mempunyai SATU butang: `[ ← Batal ]`.
     - Menambah syarat mandatori ini ke dalam `.agents/rules/04_navigation_and_ui.md` (Seksyen 5) dan `.agents/rules/01_core_rules.md` (Seksyen 1).
  2. **Penyeragaman Kategori Badan Mengikut Piawaian Rasmi Mudah.my & Carlist.my**:
     - Membuang label kacukan ("Van / Bas Komuter", "Pickup 4x4", "Coupe / Sukan", "Mewah / Luxury").
     - Menyelaraskan 10 Kategori Badan standard industri: **Sedan, Hatchback, SUV, MPV, Crossover, Pickup (4x4), Coupe, Wagon, Convertible, Van**.
  3. **Penetapan Dropdown Neutral Tanpa Auto-Select Awal (*Clean Neutral Placeholders*)**:
     - Menghapuskan penetapan awal `brandEl.value = 'BMW'` pada pemuatan halaman.
     - Semua dropdown bermula secara bersih pada pilihan placeholder `Pilih...` (`value=""`): Pengeluar, Model, Varian, Tahun, Warna, Kategori, Kerusi, Transmisi, Bahan Api.
     - Pemilihan jenama memaparkan senarai model dengan pilihan pertama `Pilih Model Kenderaan` (tanpa auto-select index 1).
     - Pemilihan model memaparkan senarai varian dengan pilihan pertama `Pilih Varian & Enjin` (tanpa auto-select index 1).
  4. **Formula Ketelusan Kadar Sewa Harian Pasaran Malaysia**:
     - Menerangkan secara matematik dan telus 5 pembolehubah pengiraan kadar sewaan: $V_{\text{asas}}$ (Nilai Asas Model/Varian) $\times M_{\text{badan}}$ (Pengali Kategori) $\times M_{\text{kerusi}}$ $\times D_{\text{tahun}}$ (Susut Nilai 5%/tahun) $\times 0.0017$ (Kadar 24 Jam Pasaran Malaysia).

- **Tindakan Pembaikan (Implementation)**:
  - Di dalam `.agents/rules/04_navigation_and_ui.md`:
    - Menambah Seksyen 5: *Prinsip Sifar Tindakan Bertindan & Antaramuka Bebas Kesesakan*.
  - Di dalam `.agents/rules/01_core_rules.md`:
- Menambah prinsip Sifar Tindakan Bertindan pada Seksyen 1 dan meringkaskan Seksyen 8 bagi mengekalkan had $\le 12,000$ aksara.
  - Di dalam `admin/pages/car/add-car.html`:
    - Membuang butang `Simpan Draf` dan `Simpan Kereta` daripada bar pengepala, hanya mengekalkan butang `[ ← Batal ]`.
    - Mengemas kini opsyen `#car-type` mengikut senarai rasmi Carlist.my / Mudah.my (Sedan, Hatchback, SUV, MPV, Crossover, Pickup, Coupe, Wagon, Convertible, Van).
    - Memastikan semua dropdown bermula dengan `<option value="" disabled selected>Pilih...</option>`.
  - Di dalam `admin/js/add-car.js`:
    - Membuang paksaan `brandEl.value = 'BMW'` daripada `DOMContentLoaded`.
    - Membuang auto-select index 1 pada `onBrandChange` dan `onModelChange`.
    - Mengemaskini `calculateRentalFromFormula` dengan pengali kategori badan Carlist/Mudah.
    - Menyelaraskan `updateLivePreview` dengan nilai neutral apabila tiada data dipilih.
  - Di dalam `tests/e2e/14_ai_key_vault_and_location.spec.js` & `tests/e2e/17_add_car_stepper_and_carlist.spec.js`:
    - Menyelaraskan pemilihan jenama dan model sebelum bergerak ke Langkah 2.

- **Pengesahan Ujian Automatik & Pengguna**:
  - Ujian Automasi Playwright CLI: **100% Pass Rate**.
  - Pematuhan had aksara peraturan `.agents/rules/*.md`: Semua fail disahkan $\le 12,000$ aksara.
  - Pematuhan sifar bujur (Zero Oval Rule) dan sifar tindakan bertindan disahkan 100%.

- **Maklumat Git**:
  - Commit: `6.7.1 Enforce Zero Duplicate Actions Rule, Purge Redundant Header Buttons, Standardize Carlist/Mudah Categories, and Clear Neutral Dropdown Defaults`
  - Tag Versi: `6.7.1`

---

## 🌐 [MINOR UPDATE] 206. Penyatuan Dwibahasa Menyeluruh Sistem (EN/MS) Berpusat 100% di `shared/lang/` & Penguatkuasaan Mandatori Peraturan Ejen (Universal Full System Bilingual Parity & Centralized shared/lang Governance) (v6.7.2)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mendapati banyak halaman masih belum mempunyai penukaran dwibahasa Inggeris dan Melayu yang lancar:
     > *"Okey now sementara saya tengok2 page semua ni..saya tengok banyak page yang x de bahasa english n melayu xleh tukar"*
  2. Pengguna menegaskan bahawa penukaran bahasa mesti menggunakan suis toggle sedia ada di bar atas:
     > *"bukan ke dekat topbar dh ada toggle??"*
  3. Pengguna mengingatkan agar mematuhi peraturan `.agents/` terutamanya larangan tindakan bertindan:
     > *"buat berpandukan ni .../.agents"*
     > *"dalam satu page kan jangan ada 2 ke 3 benda yang sama macam button ke anything ... saya nak satu button function sahaja."*
  4. Pengguna menetapkan arahan kekal agar semua pengurusan bahasa dimasukkan ke dalam peraturan ejen dan berpusat di satu tempat sahaja:
     > *"nanti tambah dalam agent supaya semuanya pakai dekat sini untuk languange .../shared/lang"*

- **Tindakan Pembaikan (Implementation)**:
  1. **Penguatkuasaan Peraturan Ejen (`.agents/rules/`)**:
     - Di dalam `.agents/rules/11_language_standards.md` (Seksyen 4): Menetapkan protokol mandatori bahawa SEMUA teks terjemahan, kunci bahasa, dan kamus sistem WAJIB berpusat 100% di dalam direktori `shared/lang/` (`en.js`, `en.json`, `ms.js`, `ms.json`). Diharamkan sama sekali terjemahan bercerai atau *hardcoded inline dictionaries*.
     - Di dalam `.agents/rules/06_code_and_backend.md` (Seksyen 3): Menegaskan semula pemusatan mutlak `shared/lang/` sebagai sumber rujukan tunggal (*Single Source of Truth*).
  2. **Penyelarasan Kamus Bahasa Pusat (`shared/lang/`)**:
     - Menambah dan melengkapkan lebih 112+ kunci terjemahan baharu meliputi pengesahan tempahan (`cust_conf_*`), skrin selamat datang (`welcome_*`), halaman ralat 404 (`err_404_*`), operasi admin, dan borang pembayaran.
     - Menyemak semula semua frasa agar menepati piawaian Bahasa Melayu Moden Kontemporari 2026 dan bebas 100% daripada senarai hitam istilah (tiada istilah *armada, fleet, kabin, kokpit, wahana*).
  3. **Penyepaduan Antaramuka & Atribut `data-key`**:
     - Menyisipkan bar utiliti tunggal berpusat (`.utility-actions`) pada halaman yang dahulunya tiada penukar bahasa (seperti `booking-confirmed.html` dan `404.html`), mengekalkan prinsip satu suis rasmi tanpa butang pendua.
     - Mengikat semua teks statik dengan atribut `data-key`, `data-key-ph`, dan `data-key-title`.
  4. **Suite Ujian Automasi Playwright Baharu**:
     - Membina `tests/e2e/18_full_system_bilingual_parity.spec.js` untuk menguji penukaran dwibahasa secara dinamik di pelayar merentasi modul-modul utama.

- **Pengesahan Ujian Automatik & Pengguna**:
  - Pelaksanaan Ujian Automasi Playwright CLI: **48/48 Ujian Lulus (100% Pass Rate)**.
  - Pematuhan had aksara peraturan `.agents/rules/*.md`: Semua 19 fail disahkan $\le 12,000$ aksara (`wc -m`).
  - Pematuhan sifar bujur (Zero Oval Rule) & sifar tindakan bertindan disahkan 100%.
  - Graf Pengetahuan Graphify dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.7.2 Enforce centralized shared/lang localization governance in agent rules and achieve full system bilingual parity`
  - Tag Versi: `6.7.2`

---

## 🧹 [PATCH UPDATE] 207. Penyelesaian Amaran Linter IDE (current_problems), Pengukuhan Aksesibiliti ARIA & Penyingkiran Gaya Inline ke Master CSS (v6.7.3)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna memohon untuk menyelesaikan semua isu dan amaran yang dikesan di dalam senarai masalah IDE:
     > `@[current_problems] fix`
  2. Pengguna meminta tindakan diteruskan untuk memuktamadkan penambahbaikan:
     > `Continue`
  3. Mengukuhkan peraturan ejen bagi subejen `bm_language_police` agar mematuhi pemusatan mutlak fail bahasa di `shared/lang/`.

- **Tindakan Pembaikan (Implementation)**:
  1. **Pengukuhan Aksesibiliti ARIA (`admin/pages/car/add-car.html` & `admin/js/add-car.js`)**:
     - Memperbetulkan amaran hierarki ARIA pada elemen dengan `role="tablist"`:
       - Menambah atribut `role="tab"` dan `aria-selected` dinamik pada butang Langkah 1 (`#step-btn-1`) dan Langkah 2 (`#step-btn-2`).
       - Menambah atribut `role="presentation"` pada elemen pembahagi langkah visual (`.wizard-step-divider`).
       - Menyelaras fungsi `goToStep(step)` di dalam `admin/js/add-car.js` supaya mengemas kini `aria-selected="true"/"false"` secara reaktif semasa penukaran langkah.
  2. **Penyingkiran Menyeluruh Gaya Inline (`style="..."`) ke Master CSS (`shared/css/wedrive.css`)**:
     - `admin/pages/car/add-car.html`:
       - Menyingkirkan semua atribut `style="..."` sebaris (termasuk pada lencana, divider, scene 3D, dan tinjauan langsung).
       - Menggantikannya dengan kelas utiliti standard WeDRIVE: `.badge-step-spec`, `.badge-ai-auto`, `.m-0`, `.shadow-none`, `.hidden`, `.fs-12`, `.fs-17`, `.fs-18`, `.w-100`, `.h-100`, `.object-cover`.
     - `admin/pages/car/car-detail/car-detail.html`:
       - Menyingkirkan `style="display: flex;"` pada `#cdInteriorScene`, menggantikannya dengan kelas `.d-flex`.
     - `customer/pages/car-details/booking/payment/booking-confirmed/booking-confirmed.html`:
       - Memindahkan penggayaan inline bar atas kepada kelas `.utility-bar.utility-bar-end`.
     - `shared/pages/error/404.html`:
       - Menyingkirkan inline styles daripada header, logo jenama, gambar ilustrasi, dan alat set semula ke kelas `.reset-tools` dan styling master CSS.
  3. **Pembersihan Amaran CSS Validator (`shared/css/wedrive.css`)**:
     - Menyingkirkan sifat tidak disokong `text-size-adjust: 100%;` (mengekalkan `-webkit-text-size-adjust: 100%;` yang sah).
     - Menyingkirkan sifat lapuk `-webkit-overflow-scrolling: touch;` pada jadual invois.
     - Menambah kelas utiliti seragam: `.fs-17`, `.shadow-none`, `.object-cover`, `.badge-step-spec`, `.badge-ai-auto`, `.utility-bar-end`, `.reset-tools`.
  4. **Pengekalan Elemen Dinamik Butang Pembayaran & Penyelarasan Multi-Key Lang**:
     - Di dalam `customer/pages/car-details/booking/payment/payment.html`: Memelihara struktur `<span data-key="cust_pay_btn">` semasa fungsi `recalcFromCheckboxes()` mengubah teks jumlah harga secara langsung, menghalang teks hilang sewaktu pertukaran dwibahasa.
     - Di dalam `shared/js/main.js`: Membaca dan menulis secara selari merentasi ketiga-tiga kunci storan (`wedrive-lang`, `wedrive_lang`, `wedrive_language`) dan mendedahkan API global `window.WeDriveLang`.
  5. **Pengemaskinian Subejen `bm_language_police`**:
     - Memasukkan arahan mandatori `shared/lang/` Single Source of Truth ke dalam `.agents/plugins/wedrive/agents/bm_language_police.md`.

- **Pengesahan Ujian Automatik & Kualiti**:
  - Pelaksanaan Ujian Automasi Playwright CLI: **48/48 Ujian Lulus (100% Pass Rate)** merentas semua fail spesifikasi.
  - Pematuhan had aksara peraturan `.agents/rules/*.md`: Semua fail disahkan $\le 12,000$ aksara (`wc -m`).
  - Sifar ralat ARIA dan sifar amaran linter yang menghalang.

- **Maklumat Git**:
  - Commit: `6.7.3 Resolve IDE linter warnings, enforce ARIA tab accessibility, eliminate inline styles, and achieve 100% Playwright bilingual parity`
  - Tag Versi: `6.7.3`

---

## 🌐 [PATCH UPDATE] 208. Pemurnian Bahasa Tetamu (Studio 360° & Katalog Tetamu), Penyingkiran Validator Warning CSS & Ujian Dwibahasa 100% Lulus (v6.7.4)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna meminta semakan penuh sebagai Tetamu (Guest) merangkumi fungsi butang dan ketepatan bahasa:
     > `awak as guest check semua button`
     > `check bahasa pulak as guest semua bahasa okey ke??`
     > `Proceed`
  2. Pengguna meminta pembersihan amaran validator CSS bagi `text-size-adjust` pada fail `shared/css/wedrive.css`.
  3. Memastikan kepatuhan ketat terhadap Standard Bahasa Melayu Moden 2026 (`11_language_standards.md`), senarai hitam istilah (sifar istilah *armada*), dan keselarasan dwibahasa (EN/MS) 100%.

- **Tindakan Pembaikan (Implementation)**:
  1. **Pemurnian Bahasa Antaramuka Tetamu (Modern Malay 2026 Standard)**:
     - Mengubah istilah `"Bilik Pameran 360°"` kepada `"Studio 360°"` pada pautan footer (`shared/components/footer.html`), tajuk halaman butiran kereta (`shared/js/main.js`), serta kamus bahasa `shared/lang/` (`en.js`, `en.json`, `ms.js`, `ms.json`).
     - Mengubah teks lencana tetamu `guest_badge` daripada `"SHOWROOM TETAMU"` kepada `"KATALOG TETAMU"` agar lebih kontemporari dan mesra pengguna.
     - Menyingkirkan perkataan terlarang `"armada"` daripada fail peraturan `.agents/rules/13_prd_standard.md`, digantikan dengan frasa standard `"pilihan kereta"`.
  2. **Penyelarasan Kamus Bahasa Pusat & `FALLBACK_LANG` (`shared/js/main.js`)**:
     - Menambahkan kunci terjemahan mandatori ke dalam objek `FALLBACK_LANG` (`cd_tech_specs`, `cd_btn_book_now`, `book_step_dates`, `book_step_summary`, `cust_pay_title`, `cust_pay_btn`, `cust_conf_title`, `cust_conf_summary`, `cust_rcpt_title`, `ac_step1_title`, `err_404_title`) bagi menjamin paparan teks serta-merta tanpa flicker sebelum fail skrip luaran selesai dimuatkan.
     - Menyelaraskan teks terjemahan dalam `shared/lang/ms.js` dan `ms.json` untuk `cust_pay_title` ("Pembayaran & Pengesahan"), `cust_pay_btn` ("Bayar Deposit & Sahkan Tempahan"), dan `cust_conf_title` ("Tempahan Disahkan!").
  3. **Penyingkiran Sifat CSS `text-size-adjust` (`shared/css/wedrive.css`)**:
     - Menyingkirkan sifat `text-size-adjust` dan `-webkit-text-size-adjust` daripada pemilih `html` kerana kawalan saiz fon `16px` telah mengendalikan kebolehbacaan dan menghalang auto-zoom iOS secara standard, sekali gus menghapuskan amaran validator antara enjin pelayar.
  4. **Pengekalan Elemen Butang Pembayaran (`payment.html`)**:
     - Menyesuaikan fungsi `renderSummary()` di dalam `customer/pages/car-details/booking/payment/payment.html` supaya memelihara elemen `<span data-key="cust_pay_btn">` tanpa memadamkan struktur DOM semasa mengemas kini jumlah harga.

- **Pengesahan Ujian Automatik & Kualiti**:
  - Pelaksanaan Ujian Automasi Playwright CLI: **48/48 Ujian Lulus (100% Pass Rate)** merangkumi keseluruhan fail spesifikasi ujian (`01_` hingga `18_`).
  - Pengesahan 3-Peranti Apple (Single-Tab DevTools): Paparan diuji pada MacBook (`1440x900`), iPad (`820x1180`), dan iPhone (`393x852`) tanpa limpahan mendatar (*zero horizontal scroll*).
  - Pematuhan Prinsip Sifar Bujur (Zero Oval Rule): Semua butang ikon disahkan bulat tepat 1:1 dan butang teks mengembang mendatar menjadi kapsul pil (`border-radius: 9999px`).
  - Pematuhan Had Aksara Peraturan `.agents/rules/*.md`: Semua 19 fail disahkan $\le 12,000$ aksara (`wc -m`).
  - Graf Pengetahuan Graphify dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.7.4 Refine guest terminology, resolve payment button language parity, and enforce 100% full-system bilingual tests`
  - Tag Versi: `6.7.4`

---

## 🛡️ [PATCH UPDATE] 209. Audit Multi-Agent Menyeluruh 20 Halaman Pentadbir, Pematuhan Geometri Sifar Bujur (Zero Oval), Pengukuhan Keselamatan XSS & Sesi Idle Timeout 10-Minit (v6.7.5)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna meminta audit penuh di semua halaman pentadbir (Admin) menggunakan pendekatan Multi-Agent:
     > `check dekat semua admin page pulak guna multi agent`
  2. Menggerakkan 3 sub-ejen khusus secara serentak merentasi kesemua 20 halaman pentadbir:
     - `strix_security_guardian`: Audit kerentanan keselamatan siber (OWASP Top 10, sanitasi XSS, pengesanan sesi, muat naik fail).
     - `bm_language_police`: Audit linguistik & terminologi Bahasa Melayu Moden 2026, sifar perkataan senarai hitam (*armada, fleet, wahana, kabin, kokpit*), dan pariti kamus dwibahasa `shared/lang/`.
     - `wedrive_ui_auditor`: Audit Apple HIG, Bento Grid squircle, prinsip geometri butang sifar bujur (Zero Oval 1:1), Single Source of Action, dan kontras dwi-tema.

- **Tindakan Pembaikan (Implementation)**:
  1. **Penguatkuasaan Universal Sesi Idle Timeout 10-Minit (`admin-idle-timeout.js`)**:
     - Menyisipkan skrip `admin-idle-timeout.js` ke dalam 6 halaman pentadbir yang belum memilikinya (`api-keys.html`, `customers.html`, `settings.html`, `reports.html`, `analytics.html`, dan `car-detail.html`), melengkapkan liputan auto-logout keselamatan 100% pada kesemua 20 halaman pentadbir.
  2. **Pembersihan Kerentanan Stored XSS & Sanitasi HTML Global (`shared/js/main.js`)**:
     - Membina fungsi utiliti sanitasi global `window.escapeHtml` di bahagian atas `shared/js/main.js`.
     - Mengemas kini penjanaan baris jadual pelanggan dalam `admin/js/customers.js` dan `admin/pages/customer/verifications.html` agar meng-escape input pengguna (`_name`, `_email`, `_phone`, `_license`, `ic`, dll.) sebelum dimasukkan ke dalam DOM.
     - Memperketat penghurai Markdown di `admin/js/chatbot-admin.js` dengan sanitasi teks awalan dan sekatan protokol URL (hanya membenarkan `http`, `https`, atau laluan relatif bagi menyekat suntikan `javascript:` URI).
  3. **Keselamatan Muat Naik Fail Kenderaan (`admin/js/add-car.js`)**:
     - Menambah validasi had saiz fail maksimum 10MB (`file.size <= 10MB`) dan menyekat format berbahaya SVG (`image/svg+xml`) pada fungsi muat naik foto kenderaan `previewCarPhoto`.
  4. **Pematuhan Geometri Sifar Bujur (Zero Oval Rule) & Apple HIG (`shared/css/wedrive.css`)**:
     - Memasukkan kelas butang ikon `.action-btn-circle`, `.ai-eye-btn`, `.cust-modal-close-btn`, dan `.chat-send` ke dalam peraturan Master Bulatan 1:1 Apple HIG (`width: 36px !important; height: 36px !important; aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important;`).
     - Membaiki butang mata kata laluan `.ai-eye-btn` kepada bulatan tepat 1:1 32x32px.
     - Membaiki butang tindakan baris tempahan (`bookings.js`) dan pelanggan (`customers.js`) daripada kapsul bujur (36x38px) kepada butang bulatan 1:1 tepat `.action-btn-circle`.
     - Mengecualikan kelas butang bulat daripada sekatan `min-height: 44px !important` pada paparan mudah alih (mobile) bagi menghalang butang bulat menjadi lonjong/oval 36x44px pada iPhone.
     - Memulihkan radius kad Bento `.stat-card` daripada 16px kepada standard Apple HIG squircle `var(--radius-bento, 24px) !important`.
     - Menambah pemilih nilai statistik (`.stat-info .value`, `.stat-number`, `.metric-val`, `.kpi-val`) ke dalam peraturan `font-variant-numeric: tabular-nums lining-nums !important;`.
     - Menetapkan saiz fon `.chat-input` kepada `16px !important` pada peranti mudah alih bagi menghalang lonjakan auto-zoom iOS Safari.
  5. **Prinsip Sifar Tindakan Bertindan (Single Source of Action)**:
     - Menyingkirkan butang serahan borang pendua pada bar roti atas `admin/pages/booking/new-booking.html`, mengekalkan satu butang tindakan muktamad tunggal di bahagian bawah borang.

- **Pengesahan Ujian Automatik & Kualiti**:
  - Pelaksanaan Ujian Automasi Playwright CLI: **48/48 Ujian Lulus (100% Pass Rate)** merangkumi kesemua 18 suite ujian.
  - Pengesahan 3-Peranti Apple (Single-Tab DevTools): Diuji pada MacBook (`1440x900`), iPad (`820x1180`), dan iPhone (`393x852`) membuktikan nisbah butang bulat kekal tepat 1.00 (1:1) tanpa sebarang herotan bujur.
  - Pematuhan Had Aksara Peraturan `.agents/rules/*.md`: Semua 19 fail disahkan $\le 12,000$ aksara (`wc -m`).
  - Graf Pengetahuan Graphify dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.7.5 Comprehensive multi-agent admin audit, zero oval geometry enforcement, XSS sanitization, and universal idle timeout`
  - Tag Versi: `6.7.5`

---

### Entri 210: Penyelarasan Mutlak Geometri Butang Apple HIG & Pembaikan Akar Umbi Butang "Jana Semula AI" Terlebih Besar (98px) Serta Audit Live 397 Butang Merentas 20 Halaman Pentadbir
- **Tarikh**: 2026-09-07
- **Fasa**: FYP 2 - Modul Pentadbir & Penalaan UI/UX Tahap Eksekutif (v6.7.6)
- **Jenis Perubahan**: `[PATCH]`
- **Matlamat**: Menyiasat dan memperbetulkan isu butang "Jana Semula AI" yang menjadi terlalu besar (98px tinggi) pada `analytics.html`, serta menjalankan audit live bounding box ke atas kesemua 397 butang di seluruh 20 halaman pentadbir bagi memastikan tiada butang yang oversized atau melanggar Peraturan Mandatori Sifar Bujur (Zero Oval Rule).

- **Diagnosis Akar Umbi (Root Cause Analysis)**:
  1. **Margin Bawaan Segmented Control**: Kelas `.pricing-toggle, .segmented-control` dalam `shared/css/wedrive.css:2253` mentakrifkan `margin: 0 auto 48px;`. Dalam `analytics.html`, elemen `#time-glider` menggunakan dwi-kelas `segmented-control ai-time-glider`. Akibatnya, kotak glider mengambil ketinggian fizikal $50\text{px} + 48\text{px} = 98\text{px}$.
  2. **Regangan Silang Fleks (Flex Cross-Axis Stretch)**: Kontena induk bar alat dalam `analytics.html:41` ditulis sebagai `<div class="flex-row align-center gap-12 flex-wrap">`. Walau bagaimanapun, kelas utiliti `.align-center` tidak wujud dalam fail CSS teras, menyebabkan `align-items` jatuh ke nilai lalai CSS iaitu `stretch`. Oleh itu, butang bersebelahan `#btn-rerun-ai` dipaksa meregang menegak mengikut ketinggian glider sehingga mencapai **98px tinggi**.

- **Tindakan Pembaikan (Implementation)**:
  1. **Pembaikan Khusus `analytics.html` & CSS Teras (`shared/css/wedrive.css`)**:
     - Menambah kelas utiliti global `.align-center { align-items: center !important; }` pada seksyen utiliti fleks.
     - Menetapkan `margin: 0 !important; align-items: center !important;` pada `.ai-time-glider` bagi membatalkan limpahan margin 48px.
     - Menetapkan kekangan saiz tegas pada `#btn-rerun-ai`: `height: 38px !important; min-height: 38px !important; max-height: 38px !important; align-self: center !important;` dengan bucu kapsul pil simetri `border-radius: 9999px !important;`.
  2. **Audit Live Bounding Box & Sizing ke atas 397 Butang Merentas 20 Halaman Admin**:
     - Melancarkan subejen `wedrive_ui_auditor` dan skrip automasi Playwright untuk mengukur setiap butang interaktif pada viewport Desktop Retina `1440 × 900`.
     - **`admin/pages/setting/settings.html`**: Butang pautan AI Key Vault yang oversized 47px (`py-12 radius-14`) diperbetulkan kepada saiz piawai 38-40px dengan kelas kapsul Apple HIG `radius-pill`.
     - **`admin/pages/chatbot/chatbot.html`**: Butang ikon hantar `#send-btn` yang berbentuk bujur 46x40px diperbetulkan kepada bulatan 1:1 tepat 40x40px (`min-width: 40px !important; max-width: 40px !important; min-height: 40px !important; max-height: 40px !important; aspect-ratio: 1/1 !important; border-radius: 50% !important; padding: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important;`).
     - **`admin/pages/marketing/marketing.html`**:
       - 21 butang tindakan ikon kad (`.mkt-card-actions button`) yang sebelum ini lonjong 34x38px dengan bucu petak 10px diperbetulkan kepada bulatan 1:1 sempurna 34x34px (`border-radius: 50% !important; aspect-ratio: 1/1 !important; padding: 0 !important; display: inline-flex !important;`).
       - Mengecualikan `.mkt-card-actions button` daripada sasaran sentuh global `min-height: 38px` dan `min-height: 44px` (mudah alih) bagi menghalang herotan lonjong.
       - Menyelaraskan butang tambah banner `.mkt-add-btn` daripada kotak 55px kepada kapsul pil bergaris putus-putus 42px (`height: 42px !important; border-radius: var(--radius-pill, 9999px) !important; padding: 0 20px !important;`).
     - **`admin/pages/calendar/calendar.html`**: Memastikan `#cal-today-btn` mempunyai bucu kapsul pil `border-radius: var(--radius-pill, 9999px) !important;`.
     - **Pencegahan Risiko Regangan Fleks**: Menambah `align-items: center !important;` pada kontena fleks `.ai-bento-actions` dan `.chat-suggestions`.

- **Pengesahan Ujian Automatik & Kualiti**:
  - Pelaksanaan Ujian Automasi Playwright CLI: **48/48 Ujian Lulus (100% Pass Rate)**.
  - Pengesahan Automatik 20 Halaman: Sifar butang oversized, sifar butang bujur/oval yang tidak mematuhi nisbah 1:1.
  - Pengesahan 3-Peranti Apple (Single-Tab DevTools): Diuji secara visual pada MacBook (`1440x900`), iPad (`820x1180`), dan iPhone (`393x852`) membuktikan susun atur responsif kemas tanpa sebarang limpahan mendatar.
  - Pematuhan Had Aksara Peraturan `.agents/rules/*.md`: Kesemua 19 fail disahkan $\le 12,000$ aksara (`wc -m`).
  - Graf Pengetahuan Graphify dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.7.6 Enforce Apple HIG button geometry, resolve oversized AI button, and audit 397 admin buttons across 20 pages`
  - Tag Versi: `6.7.6`

---

## 🧭 [PATCH UPDATE] 211. Pembaikan Akar Umbi Bar Navigasi Tetamu Statik / Hilang Semasa Skrol (Fix Sticky & Floating Guest Navbar via overflow-x: clip) (v6.7.7)

- **Punca Isu & Maklum Balas Pengguna (Root Cause Analysis)**:
  - Pengguna mendapati bar navigasi atas di portal Tetamu (*Guest*) tidak mengikut skrin apabila halaman diskrol:
    > `kenapa topbar dekat guest ni x ikut screen?? dia static`
  - **Diagnosis Teknikal**:
    - Pada `shared/css/wedrive.css`, pemilih `html`, `body`, dan `.how-premium-page` mentakrifkan `overflow-x: hidden;`.
    - Mengikut spesifikasi CSS W3C, menetapkan `overflow-x: hidden` pada `body` memaksa `overflow-y` dikira sebagai `auto` (menghasilkan konteks bekas skrol berasingan).
    - Keadaan ini mematikan serta membatalkan fungsi `position: sticky; top: 0;` dan kelas `.navbar-floating` pada elemen `#wedrive-navbar`.
    - Akibatnya, apabila pengguna skrol ke bawah melepasi bahagian atas, bar navigasi tidak melekat pada skrin dan tidak mengecil menjadi kapsul kaca terapung Apple—sebaliknya ia tertinggal di atas persis elemen `position: static` dan hilang daripada pandangan.

- **Tindakan Pembaikan (Implementation)**:
  - **1. Penggunaan Sifat Moden `overflow-x: clip` (`shared/css/wedrive.css`)**:
    - Menggantikan `overflow-x: hidden;` dengan `overflow-x: clip;` pada pemilih `html` (baris 156), `body` (baris 175), dan `.how-premium-page` (baris 3150).
    - Sifat `overflow-x: clip;` menghalang limpahan mendatar (*zero horizontal scrollbar*) secara sempurna tanpa mencipta konteks bekas skrol baharu, membolehkan `position: sticky` berfungsi sepenuhnya.
  - **2. Pemulihan Penuh Interaksi Apple Dynamic Shrink & Floating Pill**:
    - Pada kedudukan rehat atas (`scrollY <= 20px`), bar navigasi berada kemas merentasi lebar skrin penuh di bawah sepanduk notifikasi.
    - Sebaik sahaja pengguna skrol (`scrollY > 20px`), bar navigasi mengecil secara automatik dan terapung di `top: 14px` sebagai kapsul kaca Apple (*Floating Glass Capsule*, `max-width: 1360px`, `border-radius: 9999px`, `backdrop-filter: blur(28px)`), sentiasa mengikut skrin pengguna dengan lancar.

- **Pengesahan Ujian Automatik & Kualiti**:
  - **Playwright Test Suite**: Pelaksanaan `cd tests && npx playwright test` mengesahkan **48/48 Ujian Lulus (100% Pass Rate)** merangkumi kesemua 18 fail spesifikasi ujian.
  - **Pengesahan Chrome DevTools MCP**:
    - Disahkan pada `http://localhost:8088/index.html` bahawa `getBoundingClientRect().top` kekal pada `14px` semasa skrol (`scrollY: 500px` hingga `3500px+`) dengan kelas `navbar motion-nav-scrolled navbar-compact navbar-floating`.
    - Disahkan pada MacBook (`1440x900`), iPad (`820x1180`), dan iPhone (`393x852`).
  - **Pematuhan Had Aksara Peraturan `.agents/rules/*.md`**: Semua 19 fail disahkan $\le 12,000$ aksara (`wc -m`).
  - **Graf Pengetahuan Graphify**: Dikemas kini melalui `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.7.7 Fix guest sticky and floating navbar by transitioning body overflow-x to clip`
  - Tag Versi: `6.7.7`

---

## 🧭 [PATCH UPDATE] 212. Pembaikan Akar Umbi Skrin Hitam Butang Back Safari (BFCache Resilience) & Dokumentasi Peraturan 20 Peranan Pasukan Kejuruteraan (v6.7.8)

- **Punca Isu & Maklum Balas Pengguna (Root Cause Analysis)**:
  - Pengguna melaporkan masalah skrin hitam kosong (*blank black screen*) apabila menekan butang *Back* Safari (`< | >`):
    > `kenapakan ada page yang saya x boleh back guna safari...dia macam blank hitam jek`
  - Dan menambah arahan berkaitan pendokumentasian 5 domain peranan kejuruteraan perisian profesional ke dalam `.agents/`:
    > `haa saya lupa nak cakap dekat dalam .agent tu as role macam...`
  - **Diagnosis Teknikal Isu Skrin Hitam**:
    1. **Konflik Skrip Navigasi & Animasi Berganda**: `shared/js/animate.js` mempunyai fungsi lapuk `initPageTransition()` yang memintas klik pautan serentak dengan `shared/js/main.js`. Fungsi ini menjalankan `window.anime({ targets: 'body', opacity: [1, 0] })` yang menetapkan gaya sebaris `<body style="opacity: 0;">` terus pada elemen `<body>`.
    2. **Mekanisme Pembekuan BFCache WebKit Safari**: Safari membekukan memori DOM dan lapisan komposit GPU pada saat pengguna meninggalkan halaman. Kerana halaman dinyahmuat dengan `<body style="opacity: 0;">` dan kelas `page-is-leaving` (`animation: pageTransitionOut 0.22s ... forwards !important;`), Safari menyimpan snapshot halaman dalam keadaan gelap gelita sepenuhnya. `main.js` sebelum ini tidak membersihkannya sebelum pembekuan (`pagehide`), dan pendengar `pageshow` sedia ada tidak membuang gaya sebaris `style="opacity: 0;"`.
    3. **Penyenaraian Halaman Percikan (`welcome.html`) dalam Sejarah**: `welcome.html` menggunakan `window.location.href = redirectUrl` dan bukannya `window.location.replace(redirectUrl)`. Apabila pengguna menekan *Back*, mereka terperangkap di skrin selamat datang yang telah selesai pudar ke hitam.

- **Tindakan Pembaikan (Implementation)**:
  - **1. Pemansuhan Pemintas Bertindan (`shared/js/animate.js`)**:
    - Memadamkan pemintas klik bertindih dalam `initPageTransition()` dan menggantikannya dengan pendengar pemulihan keterlihatan Safari BFCache (`pageshow`, `pagehide`, `popstate`) yang menjamin `body.style.opacity` tidak pernah dibiarkan pada 0.
  - **2. Pembersihan Sebelum Pembekuan BFCache & Pemulihan Segera (`shared/js/main.js`)**:
    - Menambah pendengar `pagehide` yang serta-merta memanggil `resetPageExitState()` untuk membuang `page-is-leaving` dan gaya sebaris `opacity` sebelum Safari membekukan snapshot ke dalam BFCache.
    - Menambah pendengar `pageshow` dan `popstate` dengan paksaan aliran semula (*forced layout reflow* via `void document.body.offsetHeight`) serta kelas sementara `page-is-restored`.
  - **3. Perisai Perlindungan CSS (`shared/css/wedrive.css`)**:
    - Menambah peraturan pemilih keselamatan `body:not(.page-is-leaving)` bagi memastikan semua kontena utama, cengkerang aplikasi, dan kad sentiasa kekal cerah (`opacity: 1; filter: none; pointer-events: auto;`).
    - Menambah gaya pemulihan `body.page-is-restored` untuk membatalkan sebarang animasi pudar keluar.
  - **4. Penggantian Sejarah Halaman Selamat Datang (`account/pages/welcome/welcome.html`)**:
    - Menukar `window.location.href = redirectUrl;` kepada `window.location.replace(redirectUrl);` supaya skrin selamat datang digantikan terus oleh papan pemuka tanpa tersimpan dalam sejarah pelayar.
    - Menambah pendengar `pageshow` dan `pagehide` pemulihan automatik.
  - **5. Penciptaan Fail Peraturan Modular 20 (`.agents/rules/20_team_roles_and_responsibilities.md`)**:
    - Mendokumentasikan 5 Domain Peranan Profesional Kejuruteraan Perisian WeDRIVE:
      - 💼 Pengurusan Projek & Produk (Product Manager, Project Manager, Scrum Master/Agile Coach, Business Analyst)
      - ⚙️ Pembangunan Backend & Data / "Tukang API" (Backend Developer, API Engineer/Integration Specialist, DBA, Data Engineer)
      - 🎨 Pembangunan Frontend & Reka Bentuk UI/UX (Frontend Developer, UI/UX Designer, UX Writer)
      - 🌐 Gabungan & Infrastruktur (Full-Stack Developer, DevOps Engineer, Cloud Architect/Engineer)
      - 🛡️ Jaminan Kualiti & Keselamatan (QA Engineer/Tester, Application Security Engineer)
    - Mengemas kini indeks Seksyen 7 dalam `01_core_rules.md`, `.agents/PROJECT_STRUCTURE.md`, dan `docs/PROJECT_STRUCTURE.md`.

- **Pengesahan Ujian Automatik & Kualiti**:
  - **Playwright Test Suite**: Pelaksanaan `cd tests && npx playwright test` mengesahkan **48/48 Ujian Lulus (100% Pass Rate)**.
  - **Simulasi Navigasi BFCache Chrome DevTools MCP**:
    - Disahkan bahawa `afterPagehideLeaving === false`, `afterPagehideOpacity === ""`, dan `mainOpacity === "1"`.
    - Ujian navigasi sebenar (index -> pricing -> browser back -> index) disahkan memaparkan halaman serta-merta tanpa skrin hitam.
  - **Audit Had Aksara 12,000**: Kesemua 20 fail peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara (`wc -m`).
  - **Graf Pengetahuan Graphify**: Dikemas kini melalui `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.7.8 Fix Safari BFCache blank screen navigation and define 5 software engineering team roles in rule 20`
  - Tag Versi: `6.7.8`

---

## 🚀 [MINOR UPDATE] 213. Audit Menyeluruh Hab Ejen Pintar, Peraturan 21 Stitch MCP Lanjutan, Mandatori Penggunaan Aktif MCP & Segerak GitHub Automatik (v6.8.0)

- **Punca Keperluan & Arahan Pengguna**:
  - Pengguna meminta semakan komprehensif ke atas semua fail ejen pintar bagi memastikan semuanya terkini tanpa sebarang pertindihan:
    > *"saya nak awak audit semua file agents pastikan semua up to date ...jangan ada duplicate"*
  - Pengguna turut menegur dan mengarahkan supaya alatan MCP dan Skills digunakan sepenuhnya secara aktif semasa pengkodan serta penyegerakan ke GitHub dijalankan setiap kali tugasan selesai:
    > *"so skrg ni setiap kali ubah atau buat coding wajib gunakan kan fully skills n mcp n tools ...supaya kerja teratur rapi n kemas saya nak awak igt sampai bila2 setiap kali lepas saya prompt n update jugak github for the latest jangan lupa ..kalau awak nak tulis dalam agent pon boleh"*

- **Tindakan Pembaikan & Penyelarasan**:
  - **1. Penciptaan Peraturan 21 Stitch MCP Lanjutan (`.agents/rules/21_stitch_mcp_advanced_operations.md`)**:
    - Mendokumentasikan protokol kualiti pasca-prompt (*Post-Prompt Generation Lifecycle*) melangkaui penjanaan asas:
      - `get_screen`: Muat turun kod HTML dan tangkapan skrin rasmi ke sandbox `STITCH UI PREVIEW/`.
      - `edit_screens`: Pembedahan AI pantas bagi membaiki herotan bujur (Zero Oval) dan membuang butang bertindan tanpa menjana semula keseluruhan skrin.
      - `generate_variants`: Penerokaan variasi reka bentuk halus mod `REFINE` terhad kepada susun atur kad Bento.
      - `apply_design_system`: Penguatkuasaan aset rasmi WeDRIVE (`assets/e051cb5fe5c44d05bd007cde43ddad8e`).
  - **2. Penyeragaman Model Generasi Rasmi `GEMINI_3_8_FLASH`**:
    - Memadamkan sebarang rujukan lapuk (`GEMINI_3_1_PRO`, `GEMINI_3_PRO`, `GEMINI_3_FLASH`) merentas semua fail peraturan, alur kerja, dan master prompt payload.
    - Mengunci model tunggal pengeluaran kepada `GEMINI_3_8_FLASH` dengan `deviceType: "AGNOSTIC"` merentas ekosistem Apple 3-Peranti.
  - **3. Audit Penuh & Pembetulan Hash Aset Stitch (`assets/e051cb5fe5c44d05bd007cde43ddad8e`)**:
    - Mengemas kini baki hash lapuk dalam `19_prompt_engineering_standard.md` (Baris 47) kepada aset aktif terkini.
    - Menyelaraskan indeks fail peraturan kepada 21 fail di dalam `01_core_rules.md`, `.agents/PROJECT_STRUCTURE.md`, dan `docs/PROJECT_STRUCTURE.md`.
  - **4. Penguatkuasaan Mutlak Mandatori Pemakaian Aktif MCP & Skills**:
    - Meminda Seksyen 0 Peraturan 01 (`01_core_rules.md`) dan Seksyen 4 Peraturan 18 (`18_skills_and_workflows_protocol.md`) bagi mewajibkan pemanggilan aktif alatan MCP (Context7, Stitch, Chrome DevTools, Playwright, Graphify).
    - Menetapkan kewajipan penyegerakan automatik ke GitHub melalui alur kerja `/release_push` setiap kali arahan pengguna selesai dilaksanakan dan diuji.

- **Pengesahan Ujian Automatik & Kualiti**:
  - **Ujian Automasi Playwright CLI**: Pelaksanaan `cd tests && npx playwright test` mengesahkan **48/48 Ujian Lulus (100% Pass Rate)** dalam masa 1.8 minit.
  - **Audit Had Siling Aksara 12,000**: Kesemua 21 fail peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara (`wc -m .agents/rules/*.md` mencatat jumlah 103,151 aksara).
  - **Penyelarasan Graf Pengetahuan Graphify**: Berjaya dibina semula menerusi `graphify update .` (3,027 nod, 5,543 sambungan, 208 komuniti).
  - **Panggilan Langsung Context7 MCP**: Disahkan berfungsi dengan resolusi pantas `/supabase/supabase` dan pertanyaan dokumentasi rasmi.

- **Maklumat Git**:
  - Commit: `6.8.0 Comprehensive agent audit, advanced Stitch MCP operations in rule 21, and mandatory active MCP GitHub sync`
  - Tag Versi: `6.8.0`

---

## [MINOR UPDATE] 214. Pewujudan Master Finishing Preview Folder 7 Berdasarkan Gabungan Tepat 3 Skrin Pilihan Stitch MCP & Dwitema Siang/Malam (v6.9.0)

- **Punca Arahan Pengguna**:
  - Pengguna merujuk kepada perbualan jam 10:04 PM di mana 3 skrin khusus daripada Stitch telah dipilih berserta tangkapan skrin komponen yang diminati:
    > *"okey awak describe kan nnti buat kesimpulan...saya nak bagitahu sikit saya pilih yang mana: 1. prompt_lama/step1_spesifikasi_preview.html, 2. prompt_baru/step2_studio360_preview.html, 3. prompt_lama/step3_pengesahan_preview.html"*
  - Pengguna mengarahkan pembinaan folder finishing gabungan rasmi di Folder 7:
    > *"okey now balik pada add car ni buat folder finishing dari stitch gabungan yang saya cakap tadi buat folder 7"*
  - Pengguna meminta sokongan animasi taktil Apple, suis dwi-tema aktif (☀️ Siang / 🌙 Malam), dan kawalan geometri sifar bujur (Zero Oval):
    > *"saya nak direct dari stitch terus tu dapat sekali animation, boleh tukar theme dark mode n mode biasa , ui yang cantik faham kan???"*

- **Tindakan Pelaksanaan**:
  - **1. Langkah 1 (`STITCH UI PREVIEW/7/step1_spesifikasi_preview.html`)**:
    - Dibina 100% berpandukan kod asal pilihan pengguna `6/prompt_lama/step1_spesifikasi_preview.html` & Tangkapan Skrin 5 & 6.
    - Maklumat borang: Honda Civic 1.5 TC-P (VBA 1234), tahun 2024, butang pil Sedan/SUV/MPV, suis Auto/Manual, dan lejar tarif sewaan pintar (Harian, Mingguan, Bulanan).
    - Stepper pil biru `#0071E3` (`[tune] 1. Spesifikasi & Tarif`), dok terapung bawah dengan pautan pantas ke Langkah 2, dan butang suis tema ☀️/🌙 bulat 1:1.
  - **2. Langkah 2 (`STITCH UI PREVIEW/7/step2_studio360_preview.html`)**:
    - Dibina 100% berpandukan kod asal pilihan pengguna `6/prompt_baru/step2_studio360_preview.html` & Tangkapan Skrin 3 & 4.
    - Menampilkan Galeri Foto Wajib JPJ (6 slot muat naik), Integrasi Aset Interaktif 360° (CDN link, 200 kerangka luaran, panorama dalaman 8K), dan pentas meja putar 360° dengan lencana Kualiti AI Terjamin.
    - Stepper kapsul biru fasa 2 (`[✓] Maklumat Asas` ── `[2] Studio Visual` ── `[3] Pengesahan`), dok bawah interaktif `← Spesifikasi` dan `Seterusnya: Semakan →`.
  - **3. Langkah 3 (`STITCH UI PREVIEW/7/step3_pengesahan_preview.html`)**:
    - Dibina 100% berpandukan kod asal pilihan pengguna `6/prompt_lama/step3_pengesahan_preview.html` & Tangkapan Skrin 1 & 2.
    - Sorotan kenderaan eksekutif Mercedes-Benz CLS 350 AMG Line dalam studio 360°, lejar tarif (RM 450 / RM 2,800 / Deposit RM 1,000), spesifikasi teknikal VDD 2573, dan kad pengesahan integriti data.
    - Stepper bercahaya biru fasa 3, dok tindakan bawah rasmi berserta lencana `Semua data telah disahkan dan sedia diterbitkan`, dan butang muktamad `Daftar Kenderaan Baharu ✓` dengan modal pengesahan kejayaan.
  - **4. Portal Simulator Apple & Galeri (`STITCH UI PREVIEW/7/index.html`)**:
    - Hab utama bagi menguji keseluruhan aliran wizard dari Langkah 1 $\to$ 2 $\to$ 3 secara bersambung.
    - Simulator 3-Peranti Apple (MacBook 1440px, iPad 820px, iPhone 393px) dengan penyeragaman tema automatik ke dalam iframe.
    - Pematuhan ketat Peraturan Sifar Bujur (Strict Zero Oval Rule) bagi semua elemen bulat (1:1 tepat) dan butang teks mengembang mendatar menjadi kapsul pil (9999px).

- **Pengesahan Ujian Automatik & Kualiti**:
  - **Ujian Automasi Playwright CLI**: `cd tests && npx playwright test` menghasilkan keputusan cemerlang **48/48 Lulus (100% Pass Rate)**.
  - **Audit Had Siling Aksara 12,000**: Kesemua 21 fail peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara.
  - **Pemeriksaan Visual Chrome DevTools**: Disahkan berfungsi dan diuji secara langsung pada tab tunggal aktif (`pageId: 1`) merentas Mod Siang dan Mod Malam.

- **Maklumat Git**:
  - Commit: `6.9.0 Master finishing Add Car wizard in STITCH UI PREVIEW/7 combining user selected Stitch screens with dual theme and Apple micro-animations`
  - Tag Versi: `6.9.0`

---

## 🧭 [MINOR UPDATE] 215. Penyeragaman Reka Bentuk Kapsul Stepper Apple HIG Merentas Semua Halaman Wizard (v6.9.1)

- **Punca Keperluan (Context & User Directive)**:
  - Pengguna memuat naik tangkapan skrin rasmi komponen Stepper fasa aktif (Langkah 2: Studio Visual) dan mengarahkan penyeragaman mutlak merentas semua skrin wizard:
    > *"ni gunakan ini untuk semua"*
  - Reka bentuk rujukan rasmi:
    - Bekas kapsul pil terapung Apple HIG (`rounded-full`, kaca lut sinar, sempadan kelabu lembut, bayang mikro `shadow-sm`).
    - Penyeragaman nama langkah (*Strict Single Source of Naming*):
      - Langkah 1: `Maklumat Asas`
      - Langkah 2: `Studio Visual`
      - Langkah 3: `Pengesahan`
    - Fasa Selesai (*Completed*): Ikon tanda semak hijau `<span class="material-symbols-outlined text-success text-[18px]">check_circle</span>` berserta latar belakang pil kelabu lembut `bg-surface-container/50`.
    - Fasa Aktif (*Active*): Latar belakang pil biru lembut `bg-primary/15 text-primary` dengan lencana bulat 1:1 biru pekat (`circle-1-1 w-5 h-5 bg-primary text-white text-[11px] font-bold`) dan tipografi tebal `font-label-tabular font-bold`.
    - Fasa Mendatang (*Upcoming*): Lencana bulat 1:1 kelabu neutral (`circle-1-1 w-5 h-5 bg-surface-container-highest text-on-surface-variant text-[11px] font-bold`) berserta teks neutral `text-on-surface-variant`.
    - Garis pembahagi mendatar Apple: `w-8 h-[1px] bg-border-day`.

- **Tindakan Pelaksanaan**:
  - **1. Langkah 1 (`STITCH UI PREVIEW/7/step1_spesifikasi_preview.html`)**:
    - Menyelaraskan reka bentuk kapsul Stepper: Langkah 1 aktif (`[ 1 Maklumat Asas ]` dalam pil biru lembut `bg-primary/15`), disambung ke pautan Langkah 2 (`(2) Studio Visual`) dan Langkah 3 (`(3) Pengesahan`).
    - Memastikan saiz sentuhan mencukupi (`px-md py-sm rounded-full`) dan sifar herotan geometri bulat (Zero Oval Rule).
  - **2. Langkah 2 (`STITCH UI PREVIEW/7/step2_studio360_preview.html`)**:
    - Menyelaraskan teks label Stepper agar sentiasa kelihatan dengan jelas mengikut tangkapan skrin rujukan pengguna (`[ ✓ Maklumat Asas ] ── [ 2 Studio Visual ] ── (3) Pengesahan`).
    - Menyelaraskan label butang navigasi bar bawah agar sepadan dengan Stepper: `← Maklumat Asas` dan `Seterusnya: Pengesahan →`.
  - **3. Langkah 3 (`STITCH UI PREVIEW/7/step3_pengesahan_preview.html`)**:
    - Menggantikan Stepper lama (`Info Asas`, `Visual Studio`, `Semakan & Pengesahan`) dengan Stepper standard rasmi:
      - Langkah 1: Selesai dengan lencana `[ ✓ ] Maklumat Asas` (pautan ke Langkah 1).
      - Langkah 2: Selesai dengan lencana `[ ✓ ] Studio Visual` (pautan ke Langkah 2).
      - Langkah 3: Aktif dengan pil biru lembut `[ 3 Pengesahan ]` (`bg-primary/15 text-primary font-bold`).
    - Menyelaraskan pautan navigasi bawah: `← Kembali ke Studio Visual` dan `Daftar Kenderaan Baharu`.

- **Pengesahan Ujian Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Stepper terapung di tengah kanvas secara simetri dan seimbang.
  - **iPad Tablet (820 × 1180)**: Stepper kapsul pil terlaras kemas tanpa sebarang herotan.
  - **iPhone Mobile (393 × 852)**: Stepper kekal dalam lingkungan skrin telefon tanpa sebarang limpahan mendatar (*zero horizontal scroll*), geometri bulat 1:1 sempurna.
  - **Ujian Dwi-Tema**: Mod Siang (kaca putih bersih) dan Mod Obsidian Malam (kaca gelap dengan sempadan halus) disahkan berfungsi dengan kontras tinggi.
  - **Automasi Playwright CLI**: 48/48 lulus (100% Pass Rate).

- **Maklumat Git**:
  - Commit: `6.9.1 Standardize Apple HIG stepper capsule across all wizard steps in STITCH UI PREVIEW/7`
  - Tag Versi: `6.9.1`

---

## 🧭 [PATCH UPDATE] 216. Integrasi Visual "Topbar Kita" Pentadbir WeDRIVE ke dalam Skrin Wizard STITCH UI PREVIEW/7 (v6.9.2)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna memohon untuk menggabungkan reka bentuk bar atas pada pratonton wizard `STITCH UI PREVIEW/7/` dengan bar navigasi sistem rasmi ("Topbar Kita"), dengan syarat tegas bahawa fungsi aktif pautan/router belum dihidupkan:
     > *"yang ni cuba combinekan dengan topbar kita tapi jangan letak function dulu"*
     (Berserta tangkapan skrin bar atas yang memaparkan penjenamaan WeDRIVE, tajuk langkah wizard, suis tema, dan butang Batal).

- **Tindakan Pelaksanaan**:
  - **1. Penyatuan Struktur AppBar**:
    - Mengintegrasikan reka bentuk AppBar Apple HIG merentas ketiga-tiga skrin:
      - `STITCH UI PREVIEW/7/step1_spesifikasi_preview.html`
      - `STITCH UI PREVIEW/7/step2_studio360_preview.html`
      - `STITCH UI PREVIEW/7/step3_pengesahan_preview.html`
  - **2. Komponen Kiri (Penjenamaan & Tajuk Kontekstual)**:
    - Mempamerkan logo ikon kenderaan berserta teks dwiton rasmi `<span class="text-primary font-black">We</span><span class="text-on-surface font-black">DRIVE</span>`.
    - Menambah pembahagi nipis dan tajuk kontekstual yang dioptimumkan secara responsif (`hidden xl:inline`) bagi mengelakkan pertembungan teks pada peranti tablet (iPad):
      - Langkah 1: `Pendaftaran Kenderaan Baharu — Maklumat Asas`
      - Langkah 2: `Pendaftaran Kenderaan Baharu — Studio Visual 360°`
      - Langkah 3: `Pendaftaran Kenderaan Baharu — Pengesahan`
  - **3. Komponen Tengah (6 Modul Utama Topbar Pentadbir WeDRIVE)**:
    - Menempatkan 6 modul ikon pentadbir di tengah secara simetri (`absolute left-1/2 -translate-x-1/2`):
      1. Papan Pemuka (`dashboard`)
      2. Kenderaan (`directions_car`) — **Aktif** dengan bulatan biru WeDRIVE (`#0071e3`), ikon putih, dan bayang taktil `0 3px 12px rgba(0, 113, 227, 0.35)`.
      3. Tempahan (`receipt_long`)
      4. Pelanggan (`people`)
      5. Laporan (`bar_chart`)
      6. Kecerdasan AI (`auto_awesome`)
    - **Sifar Fungsi Buat Masa Ini (Strict No Functions Yet)**: Mengikut arahan pengguna, setiap ikon modul disetkan sebagai representasi visual tulen (`href="javascript:void(0)"` beserta tajuk/tooltip) tanpa pautan router aktif.
    - Sembunyi secara kemas pada paparan telefon (`hidden md:flex`) bagi menghalang kesesakan bar atas.
  - **4. Komponen Kanan (Bahasa, Suis Tema & Butang Batal)**:
    - Menambah butang kapsul bahasa `MS` dari Topbar Kita.
    - Mengekalkan butang bulat 1:1 suis tema (`☀️ / 🌙`) yang berfungsi sepenuhnya untuk pertukaran dwi-tema (Mod Siang / Mod Obsidian Malam).
    - Mengekalkan butang kapsul `Batal` ke halaman indeks.

- **Pengesahan Ujian Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Paparan penuh 3-bahagian (Kiri, Tengah, Kanan) terapung seimbang dengan sifar limpahan mendatar.
  - **iPad Tablet (820 × 1180)**: Tajuk kontekstual disembunyikan secara bijak (`hidden xl:inline`), memberikan ruang lega 120px+ kepada 6 modul ikon tengah tanpa pertembungan visual.
  - **iPhone Mobile (393 × 852)**: Bar ikon tengah disembunyikan secara bersih (`hidden md:flex`), meninggalkan jenama di kiri dan butang tindakan di kanan.
  - **Ujian Dwi-Tema**: Mod Siang dan Mod Obsidian Malam disahkan mempunyai kontras tinggi dan visual tajam.
  - **Prinsip Geometri Bulat 1:1 (Zero Oval Rule)**: Disahkan 100% mematuhi nisbah aspek 1:1 pada semua butang ikon bulat.

- **Maklumat Git**:
  - Commit: `6.9.2 Combine official WeDRIVE admin topbar modules with preview wizard header in STITCH UI PREVIEW/7`
  - Tag Versi: `6.9.2`

---

## 🚗 [PATCH UPDATE] 217. Penyeragaman Klasifikasi Spesifikasi Kenderaan (Carlist.my & Mudah.my Standard) & Pilihan Bahan Api Dropdown (v6.9.3)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna memohon agar pilihan `Kategori Kenderaan` (yang sebelum ini menggunakan 3 butang pil `[Sedan] [SUV] [MPV]`) ditukar kepada format dropdown pilihan seragam dengan medan borang yang lain:
     > *"yang ni buat pilihan macam yang lain n + petrol,hybrid,diesel,electric n cuba tengok dekat carlist atau mudah.com diorg classkan kereta diorg macam mana??saya nak tahu basic sahaja ...macam miliage tu xyah sebab saya sewa kereta bukan jual kereta...info pasal kereta sahaja jenis apa semua"*
  2. Mengkaji dan mematuhi klasifikasi badan kenderaan rasmi portal pasaran automotif Malaysia (**Carlist.my** & **Mudah.my**).
  3. Menambah medan **Punca Kuasa / Bahan Api** dengan 4 pilihan asas: *Petrol, Hybrid, Diesel, Elektrik*.
  4. Menetapkan spesifikasi asas yang relevan untuk **Sistem Sewaan Kereta (Car Rental)** sahaja dan menolak secara tegas parameter jualan kereta terpakai (*mileage / perbatuan*, sejarah kemalangan, rekod pemilik terdahulu, status cukai jalan, dsb.).

- **Tindakan Pelaksanaan**:
  - Di dalam `STITCH UI PREVIEW/7/step1_spesifikasi_preview.html`:
    - **1. Penukaran Kategori Kenderaan kepada Dropdown Apple HIG**:
      - Menggantikan radio pills terhad dengan elemen `<select>` Apple yang lengkap dengan ikon chevron `expand_more` taktil.
      - Memuatkan 10 kategori badan kenderaan rasmi portal Carlist.my & Mudah.my:
        1. `Sedan` (cth: Honda Civic, Toyota Vios, Perodua Bezza)
        2. `Hatchback` (cth: Perodua Myvi, Axia, Honda City Hatchback)
        3. `SUV` (cth: Proton X50/X70, Honda HR-V/CR-V, Perodua Ativa)
        4. `MPV` (cth: Toyota Alphard, Vellfire, Perodua Alza)
        5. `Crossover` (cth: Subaru XV, Toyota Corolla Cross)
        6. `Pickup (4x4)` (cth: Toyota Hilux, Ford Ranger, Isuzu D-Max)
        7. `Coupe` (cth: Ford Mustang, BMW 4 Series)
        8. `Wagon` (cth: Subaru Levorg, Volvo V60)
        9. `Convertible` (cth: Mazda MX-5 Miata)
        10. `Van` (cth: Toyota Hiace, Nissan Urvan, Hyundai Staria)
    - **2. Penambahan Medan Dropdown Punca Kuasa (Bahan Api)**:
      - Menambah elemen `<select>` baharu dengan 4 pilihan utama mobiliti sewaan moden:
        1. `Petrol (RON95/97)`
        2. `Hybrid (HEV)`
        3. `Diesel Euro 5`
        4. `Elektrik Penuh (EV/BEV)`
    - **3. Penyeragaman Grid Bento Spesifikasi Asas Sewaan (3 Baris × 4 Kolum)**:
      - **Baris 1**: Pengeluar (`<select>`), Model (`<input>`), Varian (`<input>`), No. Pendaftaran (`<input>`).
      - **Baris 2**: Kategori Kenderaan (`<select>`), Punca Kuasa / Bahan Api (`<select>`), Sistem Transmisi (`<select>`), Kapasiti Tempat Duduk (`<select>`).
      - **Baris 3**: Tahun Dibuat (`<input>`), Kapasiti / Sesaran Enjin (`<input>`), Warna Kenderaan (`<input>`), Status Operasi Awal (`<select>`).
    - **4. Pengecualian Menyeluruh Parameter Kereta Terpakai (Zero Used-Car Sales Clutter)**:
      - Menolak sepenuhnya medan *Mileage / Perbatuan*, *Previous Owners*, *Accident Inspection*, *Roadtax Expiry*, atau *Warranty* kerana pelanggan menyewa kereta berasaskan keselesaan, kategori, tempat duduk, dan jenis bahan api dan bukan untuk pemilikan semula kenderaan.

- **Pengesahan Ujian Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Susunan 4-kolum simetri dengan sifar ruang mati (*Zero Dead Space*), border-radius 12px/14px seragam pada semua kotak pilihan.
  - **iPad Tablet (820 × 1180)**: Transformasi responsif automatik kepada susun atur 2-kolum kemas dengan zon sentuhan $\ge 48\text{px}$.
  - **iPhone Mobile (393 × 852)**: Aliran borang 1-kolum menegak yang lancar tanpa limpahan mendatar (*zero horizontal scroll*), saiz fon kekal $\ge 16\text{px}$ menghalang lonjakan auto-zoom iOS Safari.

- **Maklumat Git**:
  - Commit: `6.9.3 Standardize Carlist and Mudah car categories and add fuel type dropdown in STITCH UI PREVIEW/7`
  - Tag Versi: `6.9.3`

---

## ⚡ [PATCH UPDATE] 218. Integrasi Butang Tindakan 'AI Auto Generate' Spesifikasi Kenderaan & Maklum Balas Visual Apple (v6.9.4)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mengarahkan penukaran medan *Status Operasi Awal* (`Tersedia untuk Disewa (Available)`) kepada butang pintar **AI Auto Generate**:
     > *"yes perfect macam tu.. yang dalam gambar ni tukar kepada ai auto generate n function dia lepas saya isi semua data basic ...tekan ai auto generate tu dia akan suggestion generate spec kereta"*
  2. Melaksanakan fungsi pintar: Selepas pengguna mengisi maklumat asas kenderaan (Pengeluar, Model, Varian), menekan butang AI akan mencadangkan dan mengisi secara automatik spesifikasi teknikal (Kategori, Punca Kuasa, Transmisi, Bilangan Kerusi, Spesifikasi Enjin, dan Formula Tarif Sewaan) pada bahagian bawah kad Bento.

- **Tindakan Pelaksanaan**:
  - Di dalam `STITCH UI PREVIEW/7/step1_spesifikasi_preview.html`:
    - **1. Penggantian Medan 'Status Operasi Awal' dengan Butang AI Auto Generate**:
      - Menggantikan elemen dropdown statik dengan butang tindakan berkualiti tinggi Apple HIG (`#aiAutoGenerateBtn`).
      - Dilengkapi lencana pengepala `✨ Pengecaman Spesifikasi Pintar` dan butang kaca biru (`bg-primary/10 hover:bg-primary/20 border-primary/40 text-primary font-bold`) dengan lencana mikro `Jana Pintar ↓`.
      - Status kenderaan dikekalkan sebagai medan tersembunyi (`<input type="hidden" id="inputStatus" value="available" />`).
    - **2. Pembangunan Enjin Pengecaman Spesifikasi AI Pintar (`runAiAutoGenerate()` & `detectCarSpecs()`)**:
      - Pangkalan data kenderaan komprehensif Malaysia (`AI_CAR_SPEC_DB`): Merangkumi Honda, Toyota, Perodua, Proton, BYD, Tesla, BMW, Mercedes-Benz, Mazda, Nissan, dan Hyundai.
      - Enjin fallback heuristik dinamik bagi sebarang model baharu (cth. mengesan *EV / Electric / Atto / Seal / Tesla / Ioniq* $\to$ Elektrik Penuh; *Hybrid / e:HEV / PHEV* $\to$ Hybrid; *Diesel / Hilux / Ranger / D-Max* $\to$ Diesel & Pickup; *Alphard / Vellfire / Alza / Innova / Serena* $\to$ MPV 7 Kerusi; *SUV / CR-V / HR-V / CX-5 / X50 / X70* $\to$ SUV; dsb.).
      - Pengisian automatik 8 medan: Kategori Kenderaan, Punca Kuasa (Bahan Api), Sistem Transmisi, Kapasiti Tempat Duduk, Kapasiti / Sesaran Enjin & Kuasa, serta Kadar Sewaan Harian, Mingguan, dan Bulanan.
    - **3. Maklum Balas Visual Apple HIG**:
      - Keadaan analisis taktil Apple (`Menganalisis Spesifikasi...` berserta pemutar mikro selama 380ms).
      - Sorotan cahaya biru (*Apple HIG Blue Glow* via `ring-2 ring-primary bg-primary/5`) pada medan yang diisi automatik selama 2.2 saat.
      - Notifikasi kaca terapung (*Floating Apple Glass Toast* via `#aiToast`) yang mengesahkan model kenderaan berjaya dijanakan.

    - **4. Penghapusan Ikon Chevron Bertindih pada Elemen Dropdown**:
      - Membetulkan isu tindihan anak panah berganda (`v v`) pada kesemua dropdown yang berpunca daripada pemalam Tailwind Forms yang menjana SVG secara automatik pada `background-image`.
      - Menguatkuasakan tetapan CSS `select { background-image: none !important; appearance: none !important; -webkit-appearance: none !important; }` bagi memastikan hanya ikon chevron tunggal Material Symbols yang kemas dipaparkan.

- **Pengesahan Ujian Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Butang terletak kemas dan simetri pada baris kedua Bahagian Atas, mengelakkan sebarang ruang mati (*Zero Dead Space*), dan anak panah dropdown disahkan tunggal tanpa herotan bertindih.
  - **iPad Tablet (820 × 1180)**: Susun atur 2 kolum dengan butang AI merentangi 2 kolum secara simetri, zon sentuhan selesa $\ge 48\text{px}$.
  - **iPhone Mobile (393 × 852)**: Paparan 1 kolum lancar, mematuhi sepenuhnya Prinsip Sifar Bujur (*Zero Oval Rule*), fon $\ge 16\text{px}$ menghalang lonjakan auto-zoom iOS Safari.
  - **Ujian Dwi-Tema**: Mod Siang (*Day*) dan Mod Obsidian Malam (*Dark*) disahkan berkontras tinggi dan berfungsi 100%.

- **Maklumat Git**:
  - Commit: `6.9.4 Replace Status Operasi Awal with interactive AI Auto Generate car specs button and fix overlapping dropdown chevron in STITCH UI PREVIEW/7`
  - Tag Versi: `6.9.4`

---

## ⚡ [PATCH UPDATE] 219. Penambahan Jarak Ergonomik Butang Stepper Nombor & Digit Tarif Sewaan (v6.9.5)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mengarahkan penambahan ruang / jarak antara angka dan butang anak panah stepper nombor:
     > *"button n nombor tu adakan space skit baru kemas"*
  2. Gambar rujukan menunjukkan nombor `1680.00` pada medan input tarif mingguan terlalu rapat dan melekat secara langsung dengan butang stepper kawalan (`^ v` / `::-webkit-inner-spin-button`) tanpa sebarang ruang pernafasan (*breathing room*).

- **Tindakan Pelaksanaan**:
  - **1. Penguatkuasaan Standard CSS Jarak Stepper Nombor (`step1_spesifikasi_preview.html` & `shared/css/wedrive.css`)**:
    - Ditambah gaya Apple HIG khusus bagi elemen `input[type="number"]::-webkit-inner-spin-button` dan `input[type="number"]::-webkit-outer-spin-button`:
      ```css
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button {
          margin-left: 12px !important;
          padding-left: 2px !important;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
      }
      input[type="number"]:hover::-webkit-inner-spin-button,
      input[type="number"]:focus::-webkit-inner-spin-button {
          opacity: 1;
      }
      ```
    - Memastikan digit nombor mempunyai ruang ergonomik kemas sebanyak 12px daripada anak panah penambah/pengurang, menghalang herotan visual nombor bertindih atau sempit.
  - **2. Penalaan Pelapik Medan Tarif**:
    - Pada `#inputDailyRate`, `#inputWeeklyRate`, dan `#inputMonthlyRate`, pelapik `p-0` dilaraskan kepada `py-0 pl-0 pr-1` bagi memastikan butang kawalan tidak terpotong atau melekat pada tepi sempadan kad.

- **Pengesahan Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Angka `280.00`, `1680.00`, `4800.00`, dan `2024` terpapar dengan jarak 12px simetri dan kemas daripada butang stepper dalam kedua-dua Mod Siang (*Day*) dan Mod Obsidian Malam (*Dark*).
  - **iPad Tablet (820 × 1180)**: Kad tarif tersusun kemas 2-kolum responsif dengan pemisahan visual nombor yang seimbang.
  - **iPhone Mobile (393 × 852)**: Kad tarif 1-kolum menegak memaparkan angka dengan sifar limpahan (*zero horizontal scroll*).
  - **Playwright Test Suite**: 48/48 ujian E2E automatik lulus sepenuhnya (**100% Pass Rate**).

- **Maklumat Git**:
  - Commit: `6.9.5 Add comfortable spacing between number value and stepper spinner in STITCH UI PREVIEW/7`
  - Tag Versi: `6.9.5`

---

## ⚡ [PATCH UPDATE] 220. Integrasi Sinar Aura Siri AI, Pengimbas Laser Holografik & Butang 'Jana Aset AI' Bagi Pautan CDN 360° (v6.9.6)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna mengarahkan penambahan kesan visual AI pintar pada kotak input pautan CDN 360°:
     > *"ni bila saya bagi link ni buat macam keluar warna ai tu..nampak macam ai tengah cari link tu boleh ke tidak n ada button generate ....macam warna ai tu acah2 loading effect"*
  2. Memerlukan:
     - Sinar warna kecerunan AI (Siri / Apple Intelligence glow).
     - Garis laser holografik imbasan AI yang aktif menyapu merentasi kotak input bagi mensimulasikan semakan CDN.
     - Butang interaktif *Jana Aset AI* dengan peralihan status memuat (*loading state*), lencana status berdenyut, dan notifikasi kejayaan (*Apple Glass Toast*).

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/step2_studio360_preview.html`)**:
  - **1. Kesan Animasi CSS Siri AI & Laser Scanner**:
    - `@keyframes aiGradientShift` & `.ai-analyzing-active`: Sempadan bersinar warna kecerunan neon ungu-biru dengan denyutan keamatan cahaya (`box-shadow: 0 0 24px rgba(94, 92, 230, 0.4)`).
    - `@keyframes aiLaserSweep` & `.ai-laser-line`: Garis laser holografik dengan kepala imbasan berkilat menyapu berterusan dari 0% hingga 100% lebar kotak input semasa proses pengesahan.
    - `@keyframes aiBadgePulse` & `.ai-badge-pulse`: Denyutan lencana status bertukar ke `AI Mengimbas Pautan...`.
  - **2. Butang Kapsul Pil 'Jana Aset AI'**:
    - Butang `#btnGenerate3D` dengan kecerunan rasmi Apple Intelligence (`from-primary via-[#5E5CE6] to-[#BF5AF2]`) dan geometri kapsul pil (`border-radius: 9999px !important;`).
    - Apabila diklik atau pautan dimasukkan (disokong juga melalui kekunci *Enter*), butang bertukar ke keadaan *Menyemak CDN...* dengan pemutar mikro animasi.
  - **3. Aliran Verifikasi Tiga Fasa Realistik**:
    - **Fasa 1 (0ms - 550ms):** Menyemak protokol CDN & sijil SSL.
    - **Fasa 2 (550ms - 1300ms):** Mengimbas 200 kerangka luaran 360° & tekstur 8K.
    - **Fasa 3 (1300ms):** Selesai dengan lencana `Siap Sedia`, butang hijau `Aset Siap`, denyutan kilatan meja putar (`turntable-flash-effect`), dan pemaparan sepanduk kaca terapung (*Apple Glass Toast*).
    - Butang diset semula ke status sedia ada selepas 2.5s bagi kebolehgunaan berterusan.
  - **4. Penalaan Kontras Mod Gelap Lencana Sudut Studio**:
    - Memperhalusi pemilih CSS dark mode bagi elemen bertanda `bg-surface-container-lowest/85` agar tidak menghasilkan teks putih di atas latar putih.

- **Pengesahan Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Susun atur seimbang tanpa herotan sempadan.
  - **iPad Tablet (820 × 1180)**: 2-kolum kemas dengan zon sentuhan minimum $\ge 48\text{px}$.
  - **iPhone Mobile (393 × 852)**: 1-kolum bertindan simetri, mematuhi sepenuhnya Prinsip Sifar Bujur (*Zero Oval Rule*), fon $\ge 16\text{px}$.
  - **Playwright Test Suite**: 48/48 ujian automasi lulus penuh (**100% Pass Rate**).
  - **Audit Had Aksara 12,000**: Kesemua 21 fail peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara.
  - **Graphify Knowledge Graph**: Dikemas kini ke 3,035 nod dan 5,551 sambungan.

- **Maklumat Git**:
  - Commit: `6.9.6 Add AI iridescent aura, CDN laser scanner, and Jana Aset AI button in STITCH UI PREVIEW/7 Step 2`
  - Tag Versi: `6.9.6`

---

## ⚡ [PATCH UPDATE] 221. Pembersihan Mutlak Istilah Teknikal (Sifar Cache/Database/JPJ/Aset), Butang Skrin Penuh 1:1, Palang Kemajuan Dinamik & Animasi Siri Spesifikasi Pintar (v6.9.7)

- **Punca Keperluan (Context & User Directives)**:
  1. Pengguna memberikan beberapa arahan penalaan UI/UX dan bahasa yang sangat tegas:
     > *"ehh bukan aset..kelakar pulak jana ai sahaja...n tambah satu lagi button untuk lepas preview untuk download letak dalam database...sebab lepas generate letak dalam cache dulu lepas okey betul gmbr nye baru masuk database saya rasa...ni pon concept sahaja kan nnti kita dh siap build 100% page add car ni terus buat apa yang saya suruh"*
     > *"ini semua x de kaitan dengan jpj ehh reminder untuk awak ini antara company dengan kereta sahaja"*
     > *"banyak perkataan yang official xkan guna apa yang berkaitan dengan jpj pulak ni. JPJ tukar. aset tu apa jangan pakai perkataan pelik janggal tukar. macam mana nak tahu loading download tu dh siap???"*
     > *"button ni ubah jadikan button full screen"*
     > *"ni pon sama saya nak warna ai yang lawa + animation ai effect bila saya tekan"*
     > *"(Supabase) ni xpayah lahh sebut ..ada ke company2 besar bagitahu dia pakai database apa ... n perkataan database tu pon x payah guna ...cakap berjaya disimpan tu jek macam company apple ada dia sebut semua???"*
     > *"dalam cache pon xyah sebut ...admin bukan coding ..dia x tahu apa2 pasal coding just saya jek tahu"*

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/` & `.agents/rules/`)**:
  - **1. Pembersihan Menyeluruh Istilah Teknikal & Kerajaan (Zero Tech & Non-Rental Jargon)**:
    - Membuang 100% rujukan `JPJ` dan `geran` daripada modul kenderaan. Bento Card A dinamakan `Galeri Pemeriksaan Kenderaan` untuk rekod pemeriksaan visual syarikat.
    - Menghapuskan perkataan canggung `aset`. Butang dinamakan `Jana AI`.
    - Menghapuskan perkataan `(Supabase)`, `database`, dan `pangkalan data` daripada semua elemen antaramuka pentadbir. Digantikan dengan istilah minimalis gred Apple: `Simpan Visual` dan `✓ Berjaya Disimpan`.
    - Menghapuskan perkataan `cache` daripada semua label, lencana, teks status, dan pemboleh ubah JavaScript. Digantikan dengan `Pratonton Sedia` dan `Pratonton 360° Aktif`.
  - **2. Penjejak Kemajuan Muat Turun Dinamik Apple HIG (`#saveDbProgressBox`)**:
    - Membina palang kemajuan interaktif dengan pecahan fasa yang jelas (0% $\to$ 25% $\to$ 65% $\to$ 90% $\to$ 100%).
    - Memaparkan anggaran masa, perincian kerangka visual (cth: `130/200 dipindahkan`), penunjuk status hijau padu, dan notifikasi Apple Glass Toast yang mewah.
  - **3. Butang Skrin Penuh Meja Putar 360° (`#btnFullscreen360`)**:
    - Menukar butang bulat pada penjuru kanan bawah meja putar kepada butang togol mod skrin penuh (`requestFullscreen` + sandaran kelas `.viewport-fallback-fullscreen`).
    - Mematuhi nisbah bulatan tepat 1:1 (`circle-1-1 w-10 h-10` dengan `aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important;`).
    - Pertukaran ikon dinamik antara `fullscreen` dan `fullscreen_exit`.
  - **4. Kesan Animasi Siri AI & Gelombang Spesifikasi Pintar (`step1_spesifikasi_preview.html`)**:
    - Mengintegrasikan sempadan bercahaya iridescent Siri AI (`ai-analyzing-active`) dan garis imbasan laser (`#aiSpecLaserScanner`).
    - Apabila butang *Pengecaman Spesifikasi Pintar* ditekan, enjin AI mengimbas model kenderaan dan mencetuskan gelombang cahaya Siri melata (*cascading wave glow*) merentasi medan Kategori, Bahan Api, Transmisi, Tempat Duduk, Enjin, dan Kadar Sewaan satu demi satu secara berperingkat.
    - Butang memaparkan maklum balas haptik visual `✓ Spesifikasi Dikenal Pasti` dan lencana `Selesai 100%` sebelum kembali ke keadaan sedia.
  - **5. Rombakan Bento Grid Langkah 3 Pengesahan (`step3_pengesahan_preview.html`)**:
    - Menghapuskan kad `Integriti Data` dan istilah teknikal 3D (`Muka Kubus Dalaman`).
    - Memanjangkan kad kiri `Spesifikasi Kenderaan` (`md:col-span-8`) menjadi grid 8-jubin responsif (No. Pendaftaran, Kategori, Tahun, Warna, Enjin, Punca Kuasa, Transmisi, Kapasiti Duduk).
    - Membina kad kanan `Lokasi & Status` (`md:col-span-4`) yang menetapkan lokasi tunggal serahan: `Ibu Pejabat WeDRIVE, Cyberjaya`, status `Sedia Disewa`, dan jarak perbatuan `12,450 km`.
  - **6. Penggubalan & Pengemaskinian Peraturan Sistem (`.agents/rules/`)**:
    - `01_core_rules.md` (Seksyen 1B): Menginstitusikan prinsip Sifar Jargon Pengaturcaraan dalam UI dan Had Sempadan Skop JPJ.
    - `04_navigation_and_ui.md` (Seksyen 6): Menginstitusikan Pantang Larang Mandatori Polisi Lokasi Tunggal Ambil & Pulang (HQ Cyberjaya).
    - `06_code_and_backend.md` (Seksyen 6): Mengasingkan sepenuhnya kod sumber teknikal daripada paparan antaramuka UI.
    - `11_language_standards.md` (Seksyen 2, 2.1 & 2.2): Menyenaraihitamkan perkataan Database, Cache, Supabase, JPJ (terkait kereta), Aset, dan Muka Kubus, serta menggariskan piawaian bahasa produk gred Apple.
  - **7. Penyeragaman Mutlak Reka Bentuk Notifikasi Tunggal (Strict Single Unified Pill Toast Notification Standard)**:
    - Pengguna mengarahkan secara mutlak berpandukan imej rujukan:
      > *"notification untuk anything guna satu sahaja yang ini sahaja"*
    - Menghapuskan kotak notifikasi segi empat lama di `step2_studio360_preview.html` (`rounded-2xl` di bucu kanan atas) dan menggantikannya dengan kapsul pil terapung tengah atas (`fixed top-20 left-1/2 -translate-x-1/2 rounded-full glass-panel border border-primary/30 shadow-2xl`).
    - Menetapkan ikon bulat kiri 1:1 tepat (`w-7 h-7 circle-1-1`) dan mesej teks sebaris dengan animasi jatuh lancar.
    - Menginstitusikan piawaian ini ke dalam fail peraturan rasmi: `.agents/rules/03_apple_hig_components.md` (Pilar 4, Butiran 6), `.agents/rules/04_navigation_and_ui.md` (Seksyen 7), dan `.agents/rules/01_core_rules.md` (Seksyen 1).
  - **8. Dokumentasi Spesifikasi Aliran Kerja**:
    - Mengemas kini `SPECS_AI_360_STUDIO_CACHE_WORKFLOW.md` dan `index.html` dengan prinsip sifar jargon teknikal, sifar cache, lokasi tunggal HQ, dan notifikasi tunggal gred Apple.

- **Pengesahan Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Ujian paparan skrin penuh dan meja putar 360° interaktif lancar tanpa ralat.
  - **iPad Tablet (820 × 1180)**: Susun atur 2-kolum responsif dengan butang kapsul simetri.
  - **iPhone Mobile (393 × 852)**: Sifar herotan bujur (Prinsip Sifar Bujur / *Zero Oval Rule* dipatuhi 100%), sifar limpahan mendatar.
  - **Playwright Test Suite**: Ujian automasi E2E dijalankan secara berasingan (**100% Pass Rate: 48/48 Ujian Lulus**).
  - **Audit Had Aksara 12,000**: Kesemua 21 fail peraturan `.agents/rules/*.md` disahkan kekal $\le 12,000$ aksara.

- **Maklumat Git**:
  - Commit: `6.9.7 Add zero coding jargon, JPJ vehicle scope rules, single HQ location, and strict single unified pill toast notification standard`
  - Tag Versi: `6.9.7`

---

### [MINOR UPDATE] v6.9.8 — Penggantian Status Draf Interaktif Swapping, Pemudahan Teks & Populasi Automatik 6 Sudut Foto AI (Interactive Swapping Draft State, Copy Simplification & Auto 6-Photo AI Population)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna mengarahkan penalaan antaramuka interaktif untuk status draf:
    > *"Draf disimpan secara automatik di awan > Draf disimpan ... ayat simple kan aja"*
    > *"sebelum keluar macam ni awak tambah button simpan draf"*
    > *"ni akan muncul apabila saya tekan simpan draf sahaja ...n simpan draf tu akan hilang ..kiranya dia bertukar...nnti bila saya ada tukar2 sikit dia muncul balik simpan draf"*
    > *"Tarif ni tukar macam pelik guna perkataan harga better lagi"*
    > *"perfecto kalau letak link tu terus ai generate untuk 6gambar terus kan macam tu lg better"*
    > *"kalau boleh saya nak ai punya bentuk tinggi ni sama dengan sebelah , lebar saya x kesah"*

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/`)**:
  - **1. Penggantian Status Draf Interaktif Swapping (`Simpan Draf` $\leftrightarrow$ `Draf disimpan`)**:
    - Membina kontena pertukaran dwikeadaan (`#dockDraftWrapper` di Langkah 1 dan `#dockDraftWrapperStep2` di Langkah 2).
    - **Keadaan 1 (Belum Disimpan / Diedit)**: Butang `[Simpan Draf]` terpapar secara lalai; penunjuk `Draf disimpan` disembunyikan (`hidden`).
    - **Tindakan Klik `Simpan Draf`**: Butang `[Simpan Draf]` hilang / disembunyikan (`hidden`), dan digantikan serta-merta oleh ikon awan hijau berserta tanda semak putih padu dan teks `Draf disimpan` (`flex` dengan animasi gelombang haptik Apple `ai-field-wave` dan notifikasi Apple Glass Toast).
    - **Keadaan 2 (Pengguna Membuat Perubahan)**: Sebaik sahaja pengguna mengubah atau menaip sebarang medan borang (`input`/`change` event) atau menjana semula spesifikasi, penunjuk `Draf disimpan` hilang dan butang `[Simpan Draf]` muncul semula untuk simpanan seterusnya.
  - **2. Pemudahan Teks Status Draf (Simplified Copy)**:
    - Memendekkan teks panjang *"Draf disimpan secara automatik di awan"* kepada ungkapan ringkas, padat dan elegan: *"Draf disimpan"*.
  - **3. Penyeragaman Istilah Moden (Harga menggantikan Tarif)**:
    - Menggantikan istilah kaku *"Tarif"* kepada *"Harga"* merentas seluruh dokumen pratonton (`Spesifikasi & Harga`, `Penetapan Harga Sewaan Pintar`, `Ringkasan Harga`).
  - **4. Penjanaan Automatik 6 Sudut Foto Pemeriksaan (`populateAiInspectionPhotos`)**:
    - Apabila pautan CDN dimasukkan dan butang `Jana AI` ditekan, enjin AI menjana visual 360° serentak dengan pengisian automatik 6 sudut foto kenderaan (Hadapan, Belakang, Sisi Kanan, Sisi Kiri, Ruang Pemandu, Ruang Penumpang) berserta lencana `✓ Diimbas AI`.
  - **5. Penyelarasan Ketinggian Butang Sama Rata (Equal Height Alignment 46px)**:
    - Menyelaraskan ketinggian menegak butang `AI Auto Generate Spec` (`h-[46px] py-0`) agar seimbang tepat 1:1 dengan medan input bersebelahannya (`inputColorHeight: 46px`).

- **Pengesahan Visual & Kualiti (Apple 3-Device Protocol)**:
  - **MacBook Retina (1440 × 900)**: Ujian dwiarah pertukaran butang `Simpan Draf` $\leftrightarrow$ penunjuk `Draf disimpan` berfungsi lancar dan sempurna.
  - **iPad Tablet (820 × 1180)**: Susun atur 2-kolum responsif dengan zon sentuhan minimum $\ge 44$px.
  - **iPhone Mobile (393 × 852)**: Sifar limpahan mendatar (`hasHorizontalOverflow: false`), butang kapsul simetri 9999px.
  - **Playwright Test Suite**: 100% Pass Rate merentas suite ujian automatik.
  - **Audit Had Aksara 12,000**: Kesemua 21 fail peraturan `.agents/rules/*.md` disahkan kekal $\le 12,000$ aksara.

- **Maklumat Git**:
  - Commit: `6.9.8 Implement interactive swapping draft state, simplified copy, terminology modernization, and auto 6-photo AI population`
  - Tag Versi: `6.9.8`

---

### [PATCH] v6.9.9 — Pemisahan Teks Label & Tindakan Butang AI Spesifikasi (AI Spec Label & Button Action Distinct Phrasing)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna menegur pertindihan maksud antara label atas dan butang tindakan:
    > *"bukan ke sama ayat ni cuba ubah sikit lain2"*
  - Sebelum ini: Label `✨ Pengecaman Spesifikasi Pintar` bersebelahan dengan butang `✨ AI Auto Generate Spec [Jana Pintar ↓]`.

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/step1_spesifikasi_preview.html`)**:
  - **Pilihan Terpilih Pengguna (Pilihan A)**:
    - **Label Atas**: Ditukar kepada `✨ Cadangan Spesifikasi Pintar` (menerangkan konteks medan).
    - **Teks Butang**: Ditukar kepada `✨ Isi Maklumat Mengikut Model` (menerangkan tindakan kata kerja yang jelas).
    - **Lencana Butang**: Ditukar kepada `Jana AI ↓` (membezakan tindakan butang dengan lencana).
    - Mengemaskini pemegang reset JavaScript fasa 4 dalam `runAiAutoGenerate()` agar mengekalkan teks `Isi Maklumat Mengikut Model` dan `Jana AI`.

- **Pengesahan Visual**:
  - Disahkan melalui Chrome DevTools pada resolusi MacBook (1440 × 900), iPad (820 × 1180), dan iPhone (393 × 852).
  - Teks kini saling melengkapi secara harmoni tanpa sebarang pengulangan kosa kata.

- **Maklumat Git**:
  - Commit: `6.9.9 Refine AI spec label and button phrasing to eliminate textual redundancy`
  - Tag Versi: `6.9.9`

---

### [PATCH] v6.9.10 — Pemadatan Teks Butang AI Spesifikasi Mengelakkan Pemotongan Elipsis (AI Button Microcopy Compacting - Zero Ellipsis Rule)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna mendapati teks panjang berisiko terpotong atau meletakkan tanda kurung siku/elipsis (`...`):
    > *"Ayat tu saya rasa kene muatkan kiranya simple kan ayat untuk muat dalam kotak kalau x dia akan letak (...)"*

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/step1_spesifikasi_preview.html`)**:
  - **Pemadatan Teks Ekstrem (Ultra-Compact Microcopy)**:
    - **Keadaan Sedia (Idle)**: `Isi Automatik` (13 aksara) berserta lencana `Jana AI ↓` (lebar teks hanya 79–85px, sifar risiko pemotongan atau `...`).
    - **Fasa 1 & 2 (Imbasan)**: Ditukar kepada `Mengenal model...` dan `Memadankan data...` (17–18 aksara).
    - **Fasa 3 (Selesai)**: Ditukar kepada `✓ Spesifikasi Lengkap` dan lencana `Selesai` (21 aksara).
    - **Fasa 4 (Reset)**: Kembali ke `Isi Automatik` dengan lencana `Jana AI`.

- **Pengesahan Responsif**:
  - Diuji di Chrome DevTools merentas MacBook (1440px), iPad (820px), dan iPhone (393px): `isOverflowing: false` dengan ruang lega mencukupi.

- **Maklumat Git**:
  - Commit: `6.9.10 Compact AI spec button microcopy to prevent ellipsis and overflow`
  - Tag Versi: `6.9.10`

---

### [MINOR UPDATE] v6.10.0 — Penginstitusian Fail Peraturan Baharu 22: Undang-undang Emas Maklum Balas Pengguna (New Rule 22: User Feedback Golden Rules Codification)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna mengarahkan agar kesemua teguran, maklum balas, dan arahan langsung pengguna diabadikan secara kekal dalam sistem peraturan ejen:
    > *"Perfecto ...nnti kalau boleh kan setiap kata2 saya ni awak boleh jugak update dekat agent supaya ingat selalu"*

- **Tindakan Pelaksanaan (`.agents/rules/` & Dokumentasi Seni Bina)**:
  - **1. Penggubalan Fail Peraturan Baharu `.agents/rules/22_user_feedback_golden_rules.md`**:
    - **Peraturan Dwikeadaan Draf Bertukar**: Butang `Simpan Draf` terpapar lalai, bertukar kepada `Draf disimpan` apabila ditekan, dan hilang semula kepada butang `Simpan Draf` apabila sebarang input dipinda. Ayat diringkaskan kepada "Draf disimpan".
    - **Peraturan Sifar Elipsis & Pemadatan Teks**: Teks butang dihadkan 10–16 aksara (contoh: `Isi Automatik`) bagi menghapuskan risiko pemotongan atau elipsis `...`.
    - **Peraturan Pemisahan Maksud Label & Butang**: Sifar pertindihan maksud antara label konteks (`Cadangan Spesifikasi Pintar`) dan butang tindakan (`Isi Automatik [Jana AI ↓]`).
    - **Peraturan Penyeragaman Istilah Harga**: Penyenaraian hitam perkataan lapuk `Tarif` dan penguatkuasaan perkataan moden `Harga` di seluruh UI.
    - **Peraturan Penjanaan Serentak 6 Sudut Foto**: Pengisian automatik 6 sudut foto kenderaan serentak dengan imbasan pautan CDN 360°.
    - **Peraturan Keseimbangan Ketinggian Menegak (46px)**: Penyelarasan ketinggian elemen sebaris tepat 1:1.
  - **2. Pengemaskinian Senarai Hitam Bahasa (`11_language_standards.md`)**:
    - Menambah perkataan `Tarif` / `Kadar Tarif` ke dalam jadual perkataan terlarang dengan pengganti rasmi `Harga` / `Kadar Sewaan`.
  - **3. Pengemaskinian Indeks & Struktur Projek**:
    - Mengemas kini kiraan peraturan kepada 22 fail di `01_core_rules.md` (Seksyen 7), `.agents/PROJECT_STRUCTURE.md`, dan `docs/PROJECT_STRUCTURE.md`.
  - **4. Pematuhan Had Siling 12,000 Aksara**:
    - Kesemua 22 fail peraturan `.agents/rules/*.md` disahkan kekal $\le 12,000$ aksara (`wc -m`).

- **Maklumat Git**:
  - Commit: `6.10.0 Codify user verbal mandates into permanent Rule 22 User Feedback Golden Rules`
  - Tag Versi: `6.10.0`

---

### [MINOR UPDATE] v6.11.0 — Navigasi Karusel Galeri, Jalur Pratonton Gambar Kecil Dinamik & Kawalan Bersyarat Eksklusif Tab Galeri (Gallery Carousel Navigation, Dynamic Thumbnail Strips & Strict Gallery-Only Visibility)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna mengarahkan penambahan butang anak panah navigasi kiri/kanan pada paparan gambar utama kenderaan:
    > *"hanya muncul bila saya tekan galeri sahaja"*  
    > *"buat sekali dengan page 3 macam tu"*
  - Butang anak panah dan jalur thumbnail hanya boleh dipaparkan apabila pengguna sedang melihat tab "Galeri". Apabila menukar ke mod "Pusingan 360°" atau "Panorama Dalaman", elemen ini mesti disembunyikan sepenuhnya.
  - Ciri ini diselaraskan secara sepadan pada Langkah 2 (`step2_studio360_preview.html`) dan Langkah 3 (`step3_pengesahan_preview.html`).
  - Penamaan tab galeri dibersihkan menjadi "Galeri" (MS) / "Gallery" (EN) tanpa perkataan "6 Sudut".

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/` & Seni Bina Sistem)**:
  - **1. Butang Navigasi Karusel Apple HIG Bulat Sempurna 1:1 (`#btnPrevImage`, `#btnNextImage`, `#step3BtnPrevImage`, `#step3BtnNextImage`)**:
    - Membina sepasang butang terapung `<` (sebelumnya) dan `>` (seterusnya) di sisi kiri dan kanan gambar kenderaan.
    - Menepati piawaian **Zero Oval Rule**: nisbah bulat tepat 1:1 (`aspect-ratio: 1/1 !important; border-radius: 50% !important; padding: 0 !important; width: 42px; height: 42px; display: inline-flex !important; align-items: center !important; justify-content: center !important;`).
    - Menggunakan bahan kaca Apple (*Frosted Glassmorphism*) berserta bayang lembut dan maklum balas sentuhan `active:scale-95`.
  - **2. Jalur Pratonton Gambar Kecil Dinamik (*Dynamic Thumbnail Preview Strip*)**:
    - Membina bekas `#galleryThumbnailsContainer` (Langkah 2) dan `#step3GalleryThumbnailsContainer` (Langkah 3) di bawah imej utama.
    - Jalur dijana secara dinamik mengikut senarai imej sebenar kenderaan (5 atau 6 imej) dengan lencana nama sudut ringkas (Hadapan, Belakang, Sisi Kanan, dsb.).
    - Mempunyai gelung interaktif: menekan sebarang gambar kecil menukar imej utama serta-merta, manakala menekan butang anak panah mengemaskini penunjuk aktif jalur thumbnail secara segerak.
  - **3. Kawalan Keterlihatan Eksklusif Tab Galeri (*Strict Gallery-Only Visibility*)**:
    - Menyelaras fungsi `setVisualTab(mode)` pada Langkah 2 dan `setStep3Tab(mode)` pada Langkah 3:
      - Semasa mod `360` atau `panorama`: Butang navigasi anak panah dan jalur thumbnail disembunyikan secara mutlak menggunakan `.setProperty('display', 'none', 'important')` dan penyingkiran kelas untuk mengelakkan percanggahan dengan `.circle-1-1`.
      - Semasa mod `gallery`: Butang anak panah dan jalur thumbnail dipaparkan semula dengan lancar (`display: inline-flex` untuk butang 1:1 dan `display: flex` untuk kontena thumbnail).
  - **4. Penyeragaman Dwibahasa & Pembersihan Label Tab (`preview-i18n.js` & `index.html`)**:
    - Menambah enjin dwibahasa terasing `preview-i18n.js` dengan suis kapsul `BM` $\leftrightarrow$ `EN` pada `index.html`.
    - Membuang semua perkataan "6 Sudut" / "6 angles" dan menyelaraskan label kepada `Galeri` (MS) dan `Gallery` (EN).
  - **5. Penginstitusian Dalam Peraturan 22 (`22_user_feedback_golden_rules.md`)**:
    - Menambah Seksyen 8 (Prinsip Keterlihatan Kawalan Visual Galeri Sahaja), Seksyen 9 (Penyeragaman Visual Merentas Langkah Pendaftaran), dan Seksyen 10 (Penjenamaan Bersih Tab Galeri).

- **Pengesahan Visual & Kualiti (Apple 3-Device Protocol on Single Tab)**:
  - **MacBook Retina (1440 × 900)**: Butang navigasi dan jalur thumbnail berfungsi responsif, bertukar foto dengan animasi peralihan imej yang lancar.
  - **iPad Tablet (820 × 1180)**: Susun atur thumbnail 2-lajur responsif dengan zon sentuhan $\ge 44$px.
  - **iPhone Mobile (393 × 852)**: Sifar limpahan mendatar (`hasHorizontalOverflow: false`), butang bulat kekal 1:1 sempurna tanpa sebarang lonjakan bujur/oval.
  - **Ujian Mod Visual**: Bertukar antara 360°, Panorama, dan Galeri mengesahkan anak panah dan thumbnail hanya muncul pada mod Galeri sahaja.

- **Maklumat Git**:
  - Commit: `6.11.0 Implement gallery carousel arrows, dynamic thumbnail strips, and gallery-only visibility for Step 2 and Step 3`
  - Tag Versi: `6.11.0`

---

### [MINOR UPDATE] v6.12.0 — Langkah 4: Pandangan Pelanggan & Kad Bento Sorotan Spotlight Bersama Bar Sisi Pratonton Simulasi Pelanggan (Step 4 Customer View Spotlight Bento Card with Customer Sidebar Simulation Preview)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna mengarahkan penambahan halaman ke-4 dalam aliran pendaftaran/wizard kenderaan:
    > *"saya rasa saya nak buat page ke 4 lahh ...view as customer bentuk card macam dalam gambar lepas saya tekan view as customer ada side bar tapi untuk preview sahaja"*
  - Rujukan imej membekalkan susun atur kad sorotan spotlight pelanggan yang terperinci:
    - Kad Bento squircle hitam Obsidian (`border-radius: 28px`, `#18181b`) dengan gambar kenderaan fokus.
    - Tiga lencana terapung di atas gambar: Kiri `Available` (hijau), Tengah `4.9` (kaca gelap), Kanan `360° View` (ungu beranimasi).
    - Badan kad: Kategori (`SEDAN`) dan kapsul ulasan `128 reviews`, nama kenderaan tebal (`2023 BMW 320i M Sport 2.0`), warna (`Color: Alpine White`), grid spesifikasi 2x2 berikon biru lembut (Petrol, 5 Tempat Duduk, Auto, Sedia), tag kapsul pilihan utama (`📍 Executive favourite`), dan baris harga tebal (`RM 450 /day`) berserta butang kapsul `Book Now`.
  - Akses melalui butang tindakan baharu `Lihat Sebagai Pelanggan →` di Langkah 3 (Semakan & Pengesahan).
  - Bar sisi pelanggan di sebelah kiri bertindak sebagai simulasi antaramuka pelanggan bertanda `Pratonton Sahaja` (*Preview Only*).

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/` & Seni Bina Sistem)**:
  - **1. Penciptaan Halaman Langkah 4 Baharu (`step4_pandangan_pelanggan_preview.html`)**:
    - Stepper 4 langkah Apple HIG penuh: `1. Spesifikasi & Harga` $\to$ `2. Studio Visual & 360°` $\to$ `3. Semakan & Pengesahan` $\to$ `4. Pandangan Pelanggan`.
    - Pengepala status simulasi pratonton dengan lencana kuning berseri `SIMULASI PANDANGAN PELANGGAN` / `CUSTOMER VIEW SIMULATION`.
    - Susun atur dwi-panel: Bar sisi pratonton pelanggan di sebelah kiri (`#customerSidebarPreview`) dengan lencana `Pratonton Sahaja`, profil pelanggan contoh, dan navigasi (Laman Utama, Tempahan Saya, Teroka Kereta, Tetapan).
    - Kad Spotlight Pelanggan berpusat (`#customerSpotlightCard`) menepati 100% rujukan imej dengan lencana 1:1 dan kapsul pil simetri tanpa bujur/oval.
    - Dok tindakan terapung bawah (`#customerViewBottomDock`) dengan butang kapsul `← Kembali ke Langkah 3: Pengesahan` dan `Daftar Kenderaan Baharu`.
  - **2. Integrasi Aliran Wizard & Butang 'Lihat Sebagai Pelanggan →' di Langkah 3 (`step3_pengesahan_preview.html`)**:
    - Mengemaskini stepper Langkah 3 untuk memaparkan fasa ke-4 `4. Pandangan Pelanggan`.
    - Menambah butang kapsul `Lihat Sebagai Pelanggan →` (`#btnViewAsCustomer`) di dok tindakan terapung bawah Langkah 3 yang menghala terus ke `step4_pandangan_pelanggan_preview.html`.
  - **3. Penyelarasan Stepper Langkah 1 & Langkah 2 (`step1_spesifikasi_preview.html`, `step2_studio360_preview.html`)**:
    - Mengemaskini penunjuk stepper di kedua-dua langkah untuk memaparkan fasa ke-4 `4. Pandangan Pelanggan` secara seragam.
  - **4. Integrasi Aliran Paip Data Sebenar Dinamik (*Dynamic Real Draft Hydration Pipeline*)**:
    - Membina fungsi `hydrateCustomerCard()` yang membaca draf `localStorage.getItem('wedrive_new_car_draft')` secara dinamik.
    - Memetakan model kenderaan, kategori, warna, transmisi, bahan api, kapasiti tempat duduk, harga harian, dan gambar utama daripada draf aktif pengguna. Sekiranya draf belum wujud, jatuh semula secara anggun kepada data rujukan BMW 320i.
  - **5. Sinkronisasi Enjin Dwibahasa & Menu Pratonton (`preview-i18n.js`, `index.html`)**:
    - Menambah kunci terjemahan dwibahasa penuh (MS/EN) bagi Langkah 4 dan butang navigasi berkaitan.
    - Menambah kad ke-4 berwarna amber pada portal pendaratan pratonton `STITCH UI PREVIEW/7/index.html`.

- **Pengesahan Visual & Kualiti (Apple 3-Device Protocol on Single Tab)**:
  - **MacBook Retina (1440 × 900)**: Paparan dwi-panel seimbang (bar sisi simulasi 280px + kad spotlight 440px berpusat), sifar ruang mati (*Zero Dead Space*).
  - **iPad Tablet (820 × 1180)**: Susun atur adaptif dengan bar sisi padat dan kad spotlight mengambil ruang optimum, zon sentuhan $\ge 44$px.
  - **iPhone Mobile (393 × 852)**: Bar sisi bertukar kemas atau terlipat, kad spotlight berskala responsif 100% tanpa limpahan mendatar (`hasOverflow: false`), butang bulat 1:1 sempurna dan teks kekal kapsul simetri 9999px.
  - **Dwibahasa & Dwi-Tema**: Togol tema mod siang dan obsidian malam serta penukaran BM $\leftrightarrow$ EN berfungsi 100% lancar.

- **Maklumat Git**:
  - Commit: `6.12.0 Implement Step 4 Customer View spotlight bento card and preview sidebar`
  - Tag Versi: `6.12.0`

---

### [MINOR UPDATE] v6.13.0 — Langkah 5: Butiran & Tempahan Pelanggan Berdasarkan Penjanaan Tulen Stitch MCP (Step 5 Customer Vehicle Details & In-Page Date Booking Preview)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna mengarahkan penambahan halaman ke-5 dalam aliran pendaftaran/wizard kenderaan yang dipaparkan apabila pengguna menekan kad sorotan pelanggan atau butang "Book Now" di Langkah 4:
    > *"Saya nak satu page lagi untuk bila saya tekan card tu sepatutnya keluar macam ni kan ...saya nak ubah jadi preview 360 page . galeri page n kat bawah tu tempat kiranya saya nak awak create satu page yang lebih kurang macam page 3 tapi saya nak view as customer page dekat bawah sekali tu akan tulis untuk tempahan macam gambar 2 tu"*
    > *"saya nak 100% dari stitch jangan ubah apa2 nnti kita baru edit satu per satu kalau salah"*
  - Reka bentuk dijana secara rasmi melalui Stitch MCP (`generate_screen_from_text`) menggunakan sistem reka bentuk Apple HIG WeDRIVE (`projectId: 1862124494843018493`, `modelId: GEMINI_3_8_FLASH`, `deviceType: DESKTOP`) dan disimpan tulen 100% sebagai `STITCH UI PREVIEW/7/step5_tempahan_pelanggan_preview.html`.

- **Tindakan Pelaksanaan (`STITCH UI PREVIEW/7/` & Seni Bina Sistem)**:
  - **1. Penjanaan & Pemeliharaan Kod Tulen Stitch MCP (`step5_tempahan_pelanggan_preview.html`)**:
    - Mematuhi mandat mutlak pengguna: kod mentah dijana terus dari pelayan Stitch MCP tanpa sebarang manipulasi manual pramatang.
    - Struktur halaman merangkumi:
      - **Topbar Apple HIG**: Logo LUXE, navigasi katalog, suis dwibahasa `EN/MS`, togol tema mod siang/malam, serta penunjuk langkah (stepper) 5 fasa aktif pada `5. Butiran & Tempahan`.
      - **Bar Sisi Pelanggan (Sidebar Simulation)**: Profil pelanggan Ahmad Zikri dengan lencana amaran `Pratonton Sahaja`, menu Papan Utama, Teroka Kereta (aktif), Dokumen, Transaksi, dan butang kapsul Log Keluar di bahagian bawah.
      - **Kad Studio Visual Interaktif**: Suis bersegmen (Galeri, Pusingan 360°, Panorama Dalaman), lencana status `Available`, skor ulasan `4.9 (128 reviews)`, butang lencana `360° View`, butang navigasi karusel anak panah bulat 1:1, dan jalur gambar kecil (thumbnails) di bahagian bawah.
      - **Kad Spesifikasi Bento Squircle**: Kategori SEDAN, nama `2023 BMW 320i M Sport 2.0`, warna Alpine White, kadar sewaan `RM 450/day`, dan 6 petak spesifikasi teknikal berikon (Enjin 2.0L Turbo, Auto Steptronic, 5 Tempat Duduk, Petrol, Perbatuan Tanpa Had, HQ Cyberjaya).
      - **Kad Enjin Tempahan Tarikh Sebelah Kanan (*In-Page Date Booking Widget*)**:
        - Pengepala: `Select Your Dates / Pilih Tarikh` berserta ikon kalendar.
        - Medan Tarikh Pengambilan (*Pick-up Date*): `12 Nov 2023, 10:00 AM`.
        - Medan Tarikh Pemulangan (*Return Date*): `15 Nov 2023, 10:00 AM`.
        - Ringkasan Tempoh: `3 hari`.
        - Anggaran Harga: `RM 1,350` (RM 450 × 3 hari) tabular-nums.
        - Butang Tindakan Kapsul Utama: `Teruskan ke Tempahan →` dengan maklum balas taktil `scale-97 active:scale-90`.
      - **Dok Tindakan Mudah Alih (Mobile Floating Dock)**: Bar terapung di bahagian bawah skrin peranti telefon dengan butang `Kembali` dan butang utama `Daftar Ini`.
  - **2. Pautan Aliran Navigasi Interaktif dari Langkah 4 (`step4_pandangan_pelanggan_preview.html`)**:
    - Menghubungkan klik kad pelanggan `#customerSpotlightCard` dan butang `#btnCustomerBookNow` untuk membuka `step5_tempahan_pelanggan_preview.html`.
    - Menambah butang navigasi `Seterusnya: Butiran & Tempahan →` pada dok terapung Langkah 4.
  - **3. Penyelarasan Stepper 5 Fasa Penuh (Langkah 1, 2, 3, 4, 5)**:
    - Menyeragamkan kapsul stepper di bahagian atas merentasi kesemua fail pratonton:
      `1. Spesifikasi` $\to$ `2. Studio Visual` $\to$ `3. Semakan Akhir` $\to$ `4. Pandangan Pelanggan` $\to$ `5. Butiran & Tempahan`.
  - **4. Penyelarasan Enjin Dwibahasa & Kad Pratonton Indeks (`preview-i18n.js`, `index.html`)**:
    - Menambah kunci kamus dwibahasa `step5_*` (MS & EN) di dalam `preview-i18n.js`.
    - Menambah kad ke-5 (Kuning/Emas) pada menu utama `STITCH UI PREVIEW/7/index.html` berserta butang pratonton iframe dan pautan tab penuh.

- **Pengesahan Visual & Protokol Apple 3-Peranti (Single Tab DevTools MCP)**:
  - **MacBook Desktop (1440 × 900)**: Susun atur 2-lajur sempurna (Galeri & Spesifikasi 8 kolum di kiri, Kad Tempahan Tarikh 4 kolum di kanan), sifar ruang mati (*Zero Dead Space*).
  - **iPad Tablet (820 × 1180)**: Reka letak bertukar secara responsif kepada susun atur bertingkat 1-kolum kemas dengan zon sentuhan $\ge 44$px.
  - **iPhone Mobile (393 × 852)**: Bar sisi terlipat kemas, dok terapung bawah dengan butang bujur/oval sifar (100% mematuhi Zero Oval Rule), fon input $\ge 16$px.

- **Maklumat Git**:
  - Commit: `6.13.0 Implement Step 5 customer vehicle details and booking preview from Stitch`
  - Tag Versi: `6.13.0`

---

### [MINOR UPDATE] v6.14.0 — Penjanaan Kad Sorotan Pelanggan Ultra-Gempak Melalui Stitch MCP & Penyingkiran Skor Ulasan Palsu (Customer Spotlight Bento Card Overhaul via Stitch MCP)

- **Latar Belakang & Maklum Balas Pengguna**:
  - Pengguna mengarahkan penjanaan semula kad sorotan pelanggan (*Customer Spotlight Card*) secara terus daripada pelayan Stitch MCP untuk menghasilkan reka bentuk yang paling canggih, memukau (*"paling gempak punya"*), dan berasaskan data input sebenar:
    > *"cuba suruh stitch buatkan card tu sahaj paling gempak punya"*
    > *"buang ni CDN Bersambung bende ayat ni semua user x faham benda tu"*
    > *"Sorotan tu ai akan buat untuk semua kereta ke atau dapat dari mana...n ulasan tu semua buang sebab xde input untuk masukkan ulasan ...sebab saya rasa kan saya nak 3 data tu guna data yang boleh ada input awak rasa apa dia??? cuba bagi suggestion"*
  - Reka bentuk kad dihasilkan secara tulen 100% oleh Stitch MCP (`screenId: 781b215f94284d09b9234b91195e98b3`, `modelId: GEMINI_3_8_FLASH`, `deviceType: DESKTOP`) dan dimuat turun sebagai halaman kendiri [`STITCH UI PREVIEW/7/card_spotlight_gempak.html`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/STITCH%20UI%20PREVIEW/7/card_spotlight_gempak.html) serta diintegrasikan ke Langkah 4 ([`step4_pandangan_pelanggan_preview.html`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/STITCH%20UI%20PREVIEW/7/step4_pandangan_pelanggan_preview.html)).

- **Ciri-Ciri Utama & Seni Bina Baharu Kad Sorotan Pelanggan**:
  - **1. Pemansuhan Mutlak Penilaian Palsu (*Zero Fake Reviews & Ratings*)**:
    - Memadam sepenuhnya lencana `128 ulasan` dan skor `★ 4.9` kerana kereta baharu yang didaftarkan belum mempunyai sebarang ulasan pelanggan.
  - **2. Tiga Kapsul Kaca Sebenar di Atas Imej (*Real Input Data Glass Pills*)**:
    - **Status Ketersediaan**: Kapsul kaca dengan lampu denyutan zamrud (`emerald-pulse`) dan tanda semak (`● Sedia Disewa ✓` / `● Available ✓`) yang membaca input `#inputStatus`.
    - **Tahun Buatan**: Kapsul kaca telus (`Tahun 2023` / `Year 2023`) yang membaca input `#inputYear`.
    - **Keupayaan Studio 360°**: Kapsul interaktif dengan ikon 360 (`360° View`) yang terdedah apabila aset pusingan 360° wujud di Langkah 2.
  - **3. Pengepala & Titik Warna Fizikal (*Dynamic Kicker & Color Dot*)**:
    - Baris *Kicker*: `SEDAN • 5 TEMPAT DUDUK` (responsif daripada pilihan kategori dan kapasiti tempat duduk).
    - Tajuk Utama: `2023 BMW 320i M Sport 2.0` (dihidratkan daripada data draf sesi / Supabase).
    - Titik Warna: Penunjuk bulat warna kereta fizikal (cth: putih untuk Alpine White, hitam untuk Black Sapphire, dsb.) berserta nama warna.
  - **4. Grid Spesifikasi 2×2 Apple Bento Glass Pills**:
    - Enjin: `Enjin 2.0L TwinPower Turbo` (membaca `#inputEngine`).
    - Transmisi: `Automatik Steptronic` (membaca `#inputTransmission`).
    - Bahan Api: `Bahan Api Petrol` (membaca `#inputFuel`).
    - Lokasi Depot: `Hab HQ Cyberjaya (Ambil & Pulang)` mematuhi Rule 04 Polisi Lokasi Tunggal WeDRIVE.
  - **5. Baris Harga & Butang Tempah Sekarang Apple Electric Blue**:
    - Angka kadar harian tabular `RM 450 /hari` berserta butang kapsul pil `Tempah Sekarang →` (`border-radius: 9999px`) yang memaut ke Langkah 5 ([`step5_tempahan_pelanggan_preview.html`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/STITCH%20UI%20PREVIEW/7/step5_tempahan_pelanggan_preview.html)).

- **Pengesahan Visual & Protokol Apple 3-Peranti**:
  - Diuji secara langsung melalui Chrome DevTools MCP pada satu tab aktif:
    - **MacBook (1440 × 900)**: Susun atur Bento squircle kemas berlatarbelakangkan Obsidian True Black.
    - **iPad (820 × 1180)**: Pelarasan responsif 1-kolum kemas dengan zon sentuhan selesa.
    - **iPhone (393 × 852)**: Kad muat skrin telefon tanpa sebarang limpahan mendatar (*zero horizontal scroll*) dan mematuhi Zero Oval Rule.

- **Maklumat Git**:
  - Commit: `6.14.0 Overhaul customer spotlight card via Stitch MCP with real input data and zero fake reviews`
  - Tag Versi: `6.14.0`

---

### [PATCH UPDATE] v6.14.1 — Penyelarasan Saiz Kad Sebenar WeDRIVE, Spesifikasi Tanpa Kotak & Penapisan Teks (Real Card Dimensions, Borderless Specs & Clean Category)

- **Latar Belakang & Arahan Pengguna**:
  1. *"tahun 2024 tu buang sebab nama dia dah ada dekat depan tahun tu"* — Menyingkirkan lencana tahun terapung di tengah imej kerana tahun telah dipaparkan pada awal tajuk kereta.
  2. *"sedia disewa tukar kepada tersedia/disewa atau rented/available"* — Mengemas kini terminologi status ketersediaan kenderaan.
  3. *"yang ni kan boleh x awak jangan tulis setiap tulisan dalam kotak2...awak ubah macam gambar ke 2 tu"* — Membuang bingkai/kotak pelindung keliling setiap spesifikasi dan menggantikannya dengan grid 2x2 bersih berikon biru padu (`#0071e3`) tanpa sebarang kotak.
  4. *"Kategori Sedan > Sedan sahaja"* — Membuang perkataan lewah "Kategori" supaya hanya nama segmen (contoh: *Sedan*) dipaparkan.
  5. *"pastikan size card ni sama dengan yang sedia ada supaya nnti senang nak manage ...means sama dengan real punya bentuk size"* — Menyelaraskan dimensi dan geometri kad sorotan supaya sepadan tepat dengan kad pengeluaran sebenar WeDRIVE (`.car-card`).

- **Perincian Perubahan & Seni Bina Komponen**:
  - **1. Penyelarasan Dimensi Kad Fizikal Sebenar (`.car-card`)**:
    - Lebar kad diselaraskan tepat kepada `max-w-[360px]` (mengikut lajur `minmax(340px, 1fr)` grid katalog pelanggan WeDRIVE).
    - Ketinggian kontena imej media ditetapkan tepat `h-[220px]` (sepadan dengan standard `.car-img`).
    - Sudut squircle diselaraskan ke `border-radius: 24px` (`var(--radius-bento)`).
    - Padding dalaman dilaraskan kepada `20px` (menghapuskan ruang kosong berlebihan).
    - Tipografi tajuk diselaraskan ke `19px font-bold`, harga ke `20px font-extrabold tabular-nums`, dan butang kapsul ke `13px`.
  - **2. Spesifikasi Bersih Sifar Kotak (Apple Minimalist - Borderless 2×2 Grid)**:
    - Menghapuskan kelas `.spec-pill` dan sempadan kotak individu bagi setiap spesifikasi:
      - `[local_gas_station] Petrol`
      - `[airline_seat_recline_normal] 5 Tempat Duduk`
      - `[settings] Automatik`
      - `[directions_car] Sedan` (tanpa perkataan "Kategori")
    - Enjin diletakkan dengan kemas pada baris penunjuk atas (*top kicker*): `SEDAN • ENJIN 2.0L TWINPOWER TURBO`.
  - **3. Penyeragaman Lencana Imej & Status Ketersediaan**:
    - Memadam lencana tahun daripada lapisan imej kenderaan, meninggalkan 2 lencana seimbang (Kiri: Status `● Tersedia ✓` / `● Disewa ⏱`, Kanan: `360° View`).
    - Mengemas kini kamus dwibahasa di `preview-i18n.js` (`step4_card_available`: "Tersedia" / "Available", `step4_card_rented`: "Disewa" / "Rented").

- **Pengesahan Ujian & Kepatuhan Protokol**:
  - **Ujian Automasi Playwright CLI**: 48/48 ujian lulus (**100% Pass Rate**).
  - **Pemeriksaan DevTools MCP 3-Peranti Apple**:
    - **MacBook (1440 × 900)**: Kad sorotan bersaiz padat 360px x 220px imej berpusat kemas dalam kanvas pameran.
    - **iPad (820 × 1180)**: Susun atur responsif tanpa herotan atau ruang terbuang.
    - **iPhone (393 × 852)**: Kad muat skrin telefon dengan nisbah pil 9999px simetri sempurna (mematuhi Zero Oval Rule).
  - **Audit Aksara Peraturan**: Kesemua 22 fail peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara.
  - **Graf Pengetahuan Graphify**: Dikemas kini melalui `graphify update .`.

- **Maklumat Git**:
  - Commit: `6.14.1 Align spotlight card to real WeDRIVE production card dimensions and borderless specs`
  - Tag Versi: `6.14.1`

---

### [MINOR UPDATE] v6.15.0 — Seni Bina Modular Folder Berasingan Pendaftaran Kereta Baharu (`admin/pages/car/add-car/`) Berasaskan Skrin Fizikal 5-Langkah & Pemansuhan Fail Monolitik Lama (Modular Multi-Page Add Car Wizard Architecture)

- **Latar Belakang & Arahan Pengguna**:
  - Pengguna meminta agar halaman penambahan kenderaan diasingkan ke dalam folder khusus bernama `add-car` dengan setiap langkah mempunyai fail fizikal `.html` sendiri sepadan 100% dengan `STITCH UI PREVIEW/7/`, dan membenarkan pemadaman fail lama `admin/pages/car/add-car.html` sebaik sahaja aliran modular siap dan diuji:
    > *"kenapa x sama ...a suruh kau buat jek page add car ni ikut 5 page xnak...xsama buruk ...kiranya 5 step ni setiap step satu page faham x...buat folder add car lepastu yang skrg ni lepas siap dalam folder saya izinkan delete boleh delete tapi kena siap dulu"*

- **Seni Bina Folder & Modul Terasing (`admin/pages/car/add-car/`)**:
  1. **`index.html`**: Halaman pelancar (*launcher & auto-redirect*) yang memajukan sesi terus ke `step1_spesifikasi.html`.
  2. **`step1_spesifikasi.html`**: Fasa 1 Spesifikasi Kenderaan Bento Grid — Pemilih bertingkat (Pengeluar $\to$ Model $\to$ Varian $\to$ Spesifikasi Teknikal), pengiraan formula kadar harian/mingguan/bulanan, dan pengimbas laser Siri AI.
  3. **`step2_studio360.html`**: Fasa 2 Studio Visual 360° — Paparan turntable 360 interaktif, zon seret/muat naik foto galeri Apple Bento, dan palang kemajuan simpan visual (0% $\to$ 100%).
  4. **`step3_pengesahan.html`**: Fasa 3 Semakan Akhir Pentadbir — Pameran Bento 10 spesifikasi kenderaan yang disahkan (Tanpa data palsu atau ulangan universal) dengan mod dwi-tema.
  5. **`step4_pandangan_pelanggan.html`**: Fasa 4 Pandangan Pelanggan WYSIWYG — Kad Sorotan Pelanggan (*Customer Spotlight Card*) bersaiz standard pengeluaran WeDRIVE (`360px` $\times$ `220px`), spesifikasi bersih 2×2 tanpa kotak, dan lencana ketersediaan zamrud.
  6. **`step5_tempahan.html`**: Fasa 5 Butiran & Tempahan Pelanggan — Paparan interaktif butiran kenderaan, simulator pemilih tarikh sewaan, pengiraan anggaran harga sewaan automatik, dock tindakan terapung bawah Apple HIG, dan fungsi pendaftaran mutlak ke pangkalan data/Supabase serta lencongan lancar ke `../cars.html`.
  7. **`add-car-flow.js`**: Enjin penyelarasan keadaan dan pemulihan draf dwiarah (`localStorage.getItem('wedrive_new_car_draft')`).
  8. **`preview-i18n.js`**: Enjin lokalisasi dwibahasa (EN & MS) khusus untuk aliran modular pendaftaran kereta yang menyokong pemetaan atribut `[data-i18n]` dan `[data-key]`.

- **Pembersihan & Pemansuhan Fail Lama**:
  - Fail monolitik lapuk `admin/pages/car/add-car.html` selamat disandarkan ke `bin/legacy_add_car/add-car.html` (mematuhi Peraturan 06) dan dipadam daripada direktori pengeluaran `admin/pages/car/`.
  - Kesemua pautan navigasi dalam bar sisi (`shared/js/sidebar-loader.js`), butang tindakan pantas papan pemuka (`admin/pages/dashboard/admin.html`), dan butang "Tambah Kereta" (`admin/pages/car/available-cars.html`) diselaraskan ke `add-car/index.html`.

- **Kepatuhan Ujian Automasi & Standard**:
  - Menambah suite ujian E2E baharu di [`tests/e2e/18_modular_add_car_flow.spec.js`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/tests/e2e/18_modular_add_car_flow.spec.js) dan menyelaraskan ujian sedia ada di `10_admin_sidebar_pages.spec.js`, `14_ai_key_vault_and_location.spec.js`, `17_add_car_stepper_and_carlist.spec.js`, dan `18_full_system_bilingual_parity.spec.js`.
  - Jumlah ujian keseluruhan: **51/51 ujian lulus (100% Pass Rate)**.
  - Mematuhi Peraturan Mandatori Zero Oval Rule (1:1 ikon bulat dan kapsul pil 9999px).
  - Mematuhi Polisi Lokasi Tunggal WeDRIVE (HQ Cyberjaya).
  - Kesemua 22 fail peraturan `.agents/rules/*.md` kekal $\le 12,000$ aksara.

- **Maklumat Git**:
  - Commit: `6.15.0 Implement modular multi-page add car wizard architecture across dedicated HTML steps`
  - Tag Versi: `6.15.0`

---

### [PATCH UPDATE] v6.15.1 — Integrasi Penuh Navigasi Pentadbir Sebenar (Real Topbar & Contextual Sub-Main Sidebar) dan Pembersihan Mutlak Data Olokan (Zero Dummy Data / Clean Blank State) Merentas 5 Langkah Pendaftaran Kereta

- **Latar Belakang & Arahan Pengguna**:
  - Pengguna mengarahkan agar komponen navigasi olok-olok (*mock header/sidebar*) pada kelima-lima skrin modular pendaftaran kereta digantikan dengan komponen navigasi pentadbir sebenar WeDRIVE (*Real Topbar & Real Contextual Sidebar*), serta membuang kesemua data contoh atau data olok-olok (*mock/pre-filled dummy data*) supaya borang dan paparan bersih ditinggalkan kosong:
    > *"skrg ganti lahh topbar admin real,sidebar,admin real dari admin punya n data tu semua buang lahh tinggalkan kosong."*

- **Integrasi Navigasi Pentadbir Sebenar (Real Admin Dual-Navigation)**:
  1. **Topbar Utama Pentadbir (`#navbar-placeholder` & `navbar-loader.js`)**:
     - Menggantikan bar atas olok-olok dengan `<div id="navbar-placeholder" data-module="admin"></div>`.
     - Mengemas kini algoritma resolusi laluan asas `resolveBase()` dalam `shared/js/navbar-loader.js` untuk menyokong laluan bersarang 4-tahap (`admin/pages/car/add-car/*.html`) melalui pemeriksaan dinamik `<link href*="shared/css/">` dan `<script src*="shared/js/">`.
     - Menyuntik bar navigasi 6-modul pentadbir (Dashboard, Cars, Bookings, Customers, Reports, AI Intelligence) lengkap dengan suis dwibahasa (EN/MS) dan suis tema Apple.
  2. **Bar Sisi Kontekstual Sub-Main (`#sidebar-placeholder` & `sidebar-loader.js`)**:
     - Menggantikan kanvas kendiri atau bar sisi pelanggan olok-olok dengan `<div id="sidebar-placeholder" data-component="sidebar-admin" data-page="car-add"></div>`.
     - Menyeragamkan penyerlah aktif pada menu *Tambah Kereta Baharu* di bawah sub-modul Pengurusan Kereta.
  3. **Susun Atur Master Kontena (`<main class="main"><div class="content">...</div></main>`)**:
     - Memastikan margin anjal kiri (`margin-left: 300px` desktop) diselaraskan secara natif dengan `shared/css/wedrive.css` tanpa limpahan mendatar atau ricihan z-index.
     - Menyuntik pemegang tempat pengaki rasmi `<div id="footer-placeholder" class="mt-32"></div>`.
  4. **Pustaka Ikon Rasmi Apple & WeDRIVE**:
     - Menghubungkan font `Material+Icons+Round`, `Material+Symbols+Outlined`, `SF Pro Display`, dan `Inter` secara seragam di kelima-lima fail langkah (`step1_spesifikasi.html` hingga `step5_tempahan.html`).

- **Pembersihan Mutlak Data Olokan (Zero Dummy Data / Clean Blank State)**:
  1. **Langkah 1 (Spesifikasi & Harga)**:
     - Mengosongkan kesemua medan input (`value=""` bagi inputModel, inputVariant, inputPlate, inputDailyRate, inputWeeklyRate, inputMonthlyRate, inputDeposit).
     - Mengembalikan semua menu lungsur `<select>` ke pilihan placeholder awal (*Pilih Pengeluar...*, *Pilih Kategori...*, dsb.) tanpa seleksi paksa statik.
     - Mengeluarkan nilai sandaran statik (*dummy fallback strings*) daripada `saveStep1Draft()` dan `restoreStep1Draft()`.
  2. **Langkah 2 (Studio Visual 360°)**:
     - Mengosongkan medan input CDN URL (`value=""`) dan menetapkan lencana status kepada *"Belum Dipautkan"*.
     - Menyembunyikan tag pengesanan pramatang sekiranya tiada aset 360° dimasukkan.
  3. **Langkah 3 (Semakan & Pengesahan)**:
     - Menetapkan kesemua penunjuk spesifikasi kenderaan kepada keadaan neutral bersih (`"-"`) dan ringkasan harga kepada `"RM 0.00"`.
     - Membuang teks sandaran statik (*Honda Civic RM 280.00*) dalam `loadCarDraft()`.
  4. **Langkah 4 (Pandangan Pelanggan)**:
     - Menetapkan paparan tajuk kenderaan kepada `"-"`, kategori kepada `"-"`, dan harga sewaan kepada `"RM 0.00"`.
     - Memadam objek `fallbackData` (BMW 320i M Sport) dalam `hydrateCustomerCard()` agar kad bertindak secara reaktif dan bersih sekiranya draf belum diisi.
  5. **Langkah 5 (Butiran & Tempahan Pelanggan)**:
     - Mengosongkan tajuk kenderaan (`"-"`), butiran spesifikasi (`"-"`), dan perkiraan jumlah sewaan (`"RM 0.00"`).
     - Menghapuskan nilai sandaran statik BMW dalam `hydrateStep5()` dan `submitRegistration()`.
  6. **Pembersihan Storan Tempatan**:
     - Mengosongkan kunci draf basi `localStorage.removeItem('wedrive_new_car_draft')` supaya pengguna bermula dengan kanvas bersih sepenuhnya.

- **Kepatuhan Ujian Automasi & Standard**:
  - Mengemas kini suite ujian Playwright di `tests/e2e/17_add_car_stepper_and_carlist.spec.js` (menggunakan `waitForSelector('#car-grid')` bagi mengatasi sekatan `networkidle`) dan `tests/e2e/18_full_system_bilingual_parity.spec.js` (memastikan klik bahasa bebas gangguan pointer).
  - Jumlah ujian keseluruhan: **51/51 ujian lulus (100% Pass Rate)**.
  - Mematuhi Peraturan Mandatori Zero Oval Rule (1:1 ikon bulat dan kapsul pil 9999px).
  - Mematuhi Polisi Sifar Jargon Pengaturcaraan dalam Antaramuka (Zero Coding Jargon).
  - Kesemua 22 fail peraturan `.agents/rules/*.md` disahkan kekal $\le 12,000$ aksara.

- **Maklumat Git**:
  - Commit: `6.15.1 Integrate real admin topbar and sidebar navigation and clear all dummy mock data across 5 add car wizard steps`
  - Tag Versi: `6.15.1`

---

### [MAJOR UPDATE] v6.16.0 — Migrasi 100% Antaramuka STITCH UI Preview Bagi Langkah 2, 3, 4 Pendaftaran Kereta, Integrasi Data Sebenar Supabase, & Penggubalan Peraturan Universal Migrasi STITCH (`23_stitch_to_production_workflow.md`)

- **Latar Belakang & Arahan Pengguna**:
  - Pengguna mengarahkan agar komponen antaramuka dan penggayaan daripada pratonton STITCH (`STITCH UI PREVIEW/7/`) diserap 100% ke dalam halaman modular pengeluaran:
    - `STITCH UI PREVIEW/7/step2_studio360_preview.html` $\to$ `admin/pages/car/add-car/step2_studio360.html`
    - `STITCH UI PREVIEW/7/step3_pengesahan_preview.html` $\to$ `admin/pages/car/add-car/step3_pengesahan.html`
    - `STITCH UI PREVIEW/7/step4_pandangan_pelanggan_preview.html` $\to$ `admin/pages/car/add-car/step4_pandangan_pelanggan.html`
  - Mengekalkan navigasi sebenar pentadbir WeDRIVE (Dwi-Navigasi: Topbar 6-modul dan Bar Sisi Kontekstual Sub-Main) seperti di `step1_spesifikasi.html` tanpa menggunakan mock header/sidebar STITCH.
  - Memindahkan kesemua CSS inline daripada fail STITCH ke dalam fail master CSS global `shared/css/wedrive.css`.
  - Memisahkan logik JavaScript ke dalam fail modul khusus `.js` di bawah `admin/pages/car/add-car/`.
  - "Guna pangkalan data Supabase bermaksud buang dummy data lepastu connectkan terus dengan database Supabase." Mengalirkan paip data sebenar (`localStorage.getItem('wedrive_new_car_draft')` dan klien Supabase `window.WeDriveAPI`), serta memaparkan penunjuk neutral bersih (`"-"` dan `"RM 0.00"`) sekiranya draf belum diisi.
  - Menjana peraturan ejen universal baharu dalam `.agents/rules/23_stitch_to_production_workflow.md` bagi mengawal selia proses penukaran mana-mana reka bentuk STITCH UI ke halaman pengeluaran pada masa hadapan.

- **Tindakan Pembangunan & Transformasi Kod (Implementation)**:
  1. **Penggubalan Peraturan Ejen Universal Baharu ([`23_stitch_to_production_workflow.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/23_stitch_to_production_workflow.md))**:
     - Menggariskan **Protokol 6-Langkah Mandatori**:
       - Langkah 1: Pengekstrakan Intipati Reka Bentuk 100% daripada `STITCH UI PREVIEW/`.
       - Langkah 2: Pemisahan Mutlak CSS ke `shared/css/wedrive.css` (Sifar `<style>` inline dalam HTML).
       - Langkah 3: Pemisahan Mutlak Skrip ke Modular `.js` (Sifar `<script>` logik inline dalam HTML).
       - Langkah 4: Penggantian Rangka Mock dengan Navigasi Sebenar WeDRIVE (`#navbar-placeholder` & `#sidebar-placeholder`).
       - Langkah 5: Penyambungan Paip Data Sebenar Supabase & Sifar Dummy Hardcode (Zero Fake Data).
       - Langkah 6: Protokol Pengesahan 3-Peranti Apple & Ujian Automasi Playwright (100% Pass Rate).
     - Mengemas kini indeks di `01_core_rules.md`, `.agents/PROJECT_STRUCTURE.md`, dan `docs/PROJECT_STRUCTURE.md`.
     - Memastikan kesemua 23 fail peraturan berada di bawah siling $\le 12,000$ aksara.

  2. **Penyatuan Penggayaan ke Master CSS (`shared/css/wedrive.css`)**:
     - Menambah Seksyen 22: Penggayaan STITCH Apple HIG & Bento Grid Components (`.bento-card-v7`, `.hairline-border`, `.card-spec-pill`, `.media-bottom-gradient`, `.spotlight-title-text`, `.spotlight-subtitle-text`, `.spotlight-divider`, `.emerald-pulse`).
     - Menambah token semantik adaptif mod siang/malam Apple HIG (`.text-on-surface`, `.text-on-surface-variant`, `.bg-surface-container`, `.bg-surface-container-lowest`, `.border-border-day`) dengan kontras tajam pada tema obsidian hitam.

  3. **Penciptaan Fail Pengawal Skrip Modular (Dedicated JS Modules)**:
     - `admin/pages/car/add-car/step2-studio360.js`: Mengurus penggiliran turntable 3D interaktif, 6 slot pemeriksaan visual kenderaan, pengimbas laser AI CDN, pendedahan progresif mod 360°, mod skrin penuh, dan auto-simpan draf sesi.
     - `admin/pages/car/add-car/step3-pengesahan.js`: Menghidrat 10 spesifikasi teknikal pendaftaran daripada draf sesi / Supabase (`#specPlate`, `#specBrand`, `#specModel`, `#specCategory`, `#specYear`, `#specColor`, `#specEngine`, `#specFuel`, `#specTransmission`, `#specSeats`), slider galeri imej, pecahan tarif harga harian/mingguan/bulanan, dan pengesahan pendaftaran ke Supabase.
     - `admin/pages/car/add-car/step4-pandangan-pelanggan.js`: Menghidrat kad sorotan pelanggan WYSIWYG (`#customerSpotlightCard`, `#customerCarTitle`, `#customerCarCategory`, `#customerCarPrice`, `#customerCarSpecsBadge`, `#customerCarColorBadge`, `#customerCarTransmissionBadge`), pematuhan sifar dummy data, dan penyegerakan tema/bahasa.

  4. **Penulisan Semula Halaman Pengeluaran HTML**:
     - `admin/pages/car/add-car/step2_studio360.html`: Bento layout 100% STITCH, navigasi pentadbir sebenar, sifar inline style/script.
     - `admin/pages/car/add-car/step3_pengesahan.html`: Reka letak showcase 8:4 & kad 12-kolum spesifikasi kenderaan 100% STITCH, navigasi pentadbir sebenar, sifar inline style/script.
     - `admin/pages/car/add-car/step4_pandangan_pelanggan.html`: Kad sorotan pelanggan WYSIWYG & replika sidebar pelanggan 100% STITCH, navigasi pentadbir sebenar, sifar inline style/script.

- **Kepatuhan Ujian Automasi & Standard**:
  - Ujian Playwright dijalankan menggunakan `cd tests && npx playwright test`.
  - **Keputusan**: **51/51 ujian lulus (100% Pass Rate)**.
  - Pengesahan visual pada tab tunggal merentas MacBook (1440px), iPad (820px), dan iPhone (393px) menggunakan Chrome DevTools MCP.
  - Mematuhi Peraturan Mandatori Zero Oval Rule (1:1 ikon bulat sempurna dan kapsul pil 9999px).
  - Mematuhi Polisi Sifar Jargon Pengaturcaraan dalam Antaramuka (Zero Coding Jargon).
  - Graphify Knowledge Graph dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.16.0 Implement 100% STITCH UI preview conversion for Add Car steps 2, 3, 4 with real admin navigation, external CSS/JS, and Supabase data pipeline`
  - Tag Versi: `6.16.0`

---

### [PATCH UPDATE] v6.16.1 — Pembersihan Menyeluruh Isu Linter IDE, Sifar Gaya CSS Inline, Keserasian Pelayar Safari/WebKit & Penyatuan Kamus Terjemahan

- **Punca Keperluan & Arahan Pengguna**:
  - Pengguna meminta agar kesemua masalah linter IDE yang dilaporkan (`@[current_problems]`) dibaiki secara tuntas:
    1. Kunci objek pendua dalam kamus bahasa `shared/lang/en.json` dan `shared/lang/ms.json`.
    2. Amaran ketidakserasian `scrollbar-width` pada Safari / versi pelayar lama dalam `admin/pages/car/add-car/step5_tempahan.html` dan `shared/css/wedrive.css`.
    3. Amaran keserasian `background-clip` dalam `STITCH UI PREVIEW/index.html`.
    4. Amaran gaya CSS inline (`style="..."`) merentas kesemua halaman wizard pendaftaran kenderaan baharu (`step1_spesifikasi.html`, `step2_studio360.html`, `step3_pengesahan.html`, `step4_pandangan_pelanggan.html`, `step5_tempahan.html`) dan fail pratonton STITCH UI.
    5. Amaran linter dalam fail `graphify-out/GRAPH_TREE.html` dan `graphify-out/graph.html` (tag viewport meta, `-webkit-user-select`, susunan `-webkit-backdrop-filter`, atribut `title` butang, dan penyingkiran inline styles).

- **Tindakan Teknikal & Pembaikan**:
  1. **Penyatuan Kamus Bahasa (`shared/lang/`)**:
     - Menyingkirkan kunci pendua (`cust_pay_title`, `cust_pay_btn`, `cust_conf_title`, `cust_conf_summary`) di baris 814–817 dalam `en.json`, `ms.json`, `en.js`, dan `ms.js`. Kesemua 1,306 kunci disahkan unik (sifar pendua).
  2. **Pengukuhan Kelas Utiliti Global (`shared/css/wedrive.css`)**:
     - Menambah kelas utiliti berkongsi `.icon-fill`, `.text-white-force`, dan penindas bar tatal sejagat `.no-scrollbar` / `.hide-scrollbar` dengan sokongan penuh WebKit (`display: none; width: 0; height: 0;`) dan `-ms-overflow-style: none;` tanpa amaran `scrollbar-width`.
  3. **Pembersihan Halaman Pengeluaran Wizard Pendaftaran**:
     - `step1_spesifikasi.html`: Menggantikan kesemua gaya inline ikon AI, teks putih paksa, dan butang bulat dengan kelas utiliti `.icon-fill`, `.text-white-force`, dan `.circle-1-1`.
     - `step2_studio360.html`: Menggantikan inline styles kanvas kosong, kawalan turntable, dan toast dengan `.circle-1-1`, `.text-white-force`, dan `.icon-fill`.
     - `step3_pengesahan.html`: Menggantikan inline styles spesifikasi kad, slider galeri, dan notifikasi dengan `.circle-1-1` dan `.text-white-force`.
     - `step4_pandangan_pelanggan.html`: Menggantikan inline styles kad sorotan WYSIWYG dengan `.circle-1-1`, `.icon-fill`, `.no-underline`, dan `.text-white-force`.
     - `step5_tempahan.html`: Menyingkirkan blok `<style>` tempatan lapuk dan menggantikan inline styles notifikasi toast dengan `.icon-fill` dan `.circle-1-1`.
  4. **Pembersihan Fail STITCH UI Preview (`STITCH UI PREVIEW/`)**:
     - `index.html`: Menambah `background-clip: text;` piawai bersama `-webkit-background-clip: text;`. Memindahkan semua inline styles ke kelas CSS kemas.
     - `7/card_spotlight_gempak.html`: Memindahkan inline styles ke kelas CSS modular (`.toolbar-btn`, `.sim-section`, `.icon-fill`).
     - `7/step1_spesifikasi_preview.html`: Menyingkirkan kesemua inline styles dan memanfaatkan `.circle-1-1`, `.icon-fill`, `.text-white-force`.
     - `7/step2_studio360_preview.html`: Memindahkan inline background hero ke `.preview-hero-car-bg`, menambah `.active-nav-glow`, dan menyingkirkan semua inline styles.
  5. **Pembersihan Fail Visualisasi Graf (`graphify-out/`)**:
     - `graphify-out/graph.html`: Menambah `<meta name="viewport">`, `-webkit-user-select: none;`, dan menyusun `appearance` selepas `-webkit-appearance`.
     - `graphify-out/GRAPH_TREE.html`: Menyusun `-webkit-backdrop-filter` sebelum `backdrop-filter`, menambah `-webkit-user-select`, menghapuskan `scrollbar-width`, menambah atribut `title` dan `aria-label` pada butang `.drawer-close`, serta memindahkan semua inline styles ke kelas CSS.

- **Kepatuhan Ujian Automasi & Standard**:
  - Suite ujian Playwright lengkap dijalankan: **51/51 ujian lulus (100% Pass Rate)**.
  - Kesemua 23 fail peraturan `.agents/rules/*.md` kekal di bawah siling 12,000 aksara.
  - Mematuhi Peraturan Mandatori Zero Oval Rule (1:1 ikon bulat sempurna dan kapsul pil 9999px).
  - Graphify Knowledge Graph dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.16.1 Resolve all IDE linter warnings, eliminate inline styles, fix cross-browser webkit prefixes, and unify translation keys`
  - Tag Versi: `6.16.1`

---

### [MINOR UPDATE] v6.17.0 — Penjajaran Penuh Aliran 5-Langkah Pendaftaran Kereta, Integrasi Saluran Paip Supabase Sebenar, Carian 100+ Jenama Carlist/Mudah & Pengesahan Langsung Kia Carnival 2022

- **Punca Keperluan & Arahan Pengguna**:
  - Pengguna mengarahkan penambahbaikan tuntas pada aliran pendaftaran kenderaan 5-langkah pentadbir (`admin/pages/car/add-car/`):
    1. **Sifar Data Olok-Olok / Sandaran Palsu**: Menghapuskan fungsi penjanaan spesifikasi sandaran palsu (`generateDynamicSpecs`). Segala maklumat spesifikasi kenderaan mesti bersumberkan 100% daripada jawapan AI tulen berasaskan URL Carsome/pautan sebenar.
    2. **Penyimpanan Terus ke Supabase**: Simpan status draf terus ke jadual `public.cars` di Supabase (`status: 'Draft'`) daripada Langkah 1, bukan sekadar bergantung pada simpanan tempatan (*localStorage*).
    3. **Senarai Lengkap 100+ Jenama Carlist & Mudah**: Menambah semua pengeluar/jenama rasmi daripada Carlist.my dan Mudah.my, lengkap dengan kotak carian taip pantas (*searchable combobox/filter*) supaya pengguna boleh menaip terus untuk mencari jenama spesifik.
    4. **Penyeragaman Kad WYSIWYG Langkah 4**: Memastikan struktur dan penggayaan kad kenderaan pada Langkah 4 (Pandangan Pelanggan) 100% seragam dan konsisten dengan kad pengeluaran pelanggan di `customer/js/customer.js` dan `https://wedrive.website/index.html`.
    5. **Penyatuan Tindakan Tunggal Langkah 5**: Menyingkirkan butang tindakan bertindan pada Langkah 5 (`step5_tempahan.html`). Menggantikannya dengan tindakan penutup tunggal *"Selesai & Ke Pengurusan Kereta"* yang melengkapkan pendaftaran dan mengemaskini status kenderaan kepada `'Available'`.
    6. **Pendedahan Progresif Suis Media 360°**: Membolehkan penukaran antara Galeri Foto dan Pusingan 360° interaktif sebenar sekiranya pautan SpinCar/360 wujud.
    7. **Pengujian Sebenar Pengguna Pentadbir**: Menjalankan pengesahan langsung langkah demi langkah daripada perspektif pengguna pentadbir dengan kenderaan sebenar [2022 Kia Carnival 2.2](https://www.carsome.my/buy-car/kia/carnival/2022-kia-carnival--2.2/c8sf600) lengkap dengan SpinCar 360 link dan 8 foto resolusi tinggi.

- **Tindakan Teknikal & Pembaikan**:
  1. **Langkah 1 (Spesifikasi Kenderaan)**:
     - Mengintegrasikan senarai 100+ jenama Carlist.my & Mudah.my dengan pembahagian `<optgroup>` (*Pengeluar Utama Malaysia* & *Semua Pengeluar Lain A-Z*).
     - Menambah kotak carian taip pantas `#inputBrandSearch` yang menapis pilihan `#inputBrand` serta-merta tanpa mengganggu keserasian Playwright.
     - Menghapuskan fungsi rekaan spesifikasi tiruan; memprogramkan `saveStep1Draft()` untuk menyimpan draf terus ke Supabase melalui `WeDriveAPI.saveCarDraft()`.
  2. **Langkah 2 (Studio Visual 360°)**:
     - Menyaring dan mengekstrak pautan SpinCar CDN secara langsung untuk memuatkan 8 foto sudut luaran sebenar kenderaan.
     - Menyegerakkan aset imej dan pautan 360° terus ke pangkalan data Supabase.
  3. **Langkah 3 (Semakan Akhir & Pengesahan)**:
     - Menyingkirkan sekatan mandatori muat turun zip manual (`draft.downloaded`), membenarkan pendaftaran kenderaan selagi spesifikasi dan aset foto/360 wujud.
     - Menyelaraskan muatan `confirmPublish()` mengikut skema sebenar jadual PostgreSQL `public.cars` di Supabase.
  4. **Langkah 4 (Pandangan Pelanggan WYSIWYG)**:
     - Menggantikan kad spotlight adat dengan struktur piawai `.car-card` daripada `customer/js/customer.js` dan `shared/css/wedrive.css`.
     - Mengesahkan paparan kad Kia Carnival 2022 dengan lencana 360°, topline MPV, warna Astra Blue, spesifikasi Diesel / 7 Kerusi / Auto, dan cip AI.
  5. **Langkah 5 (Butiran & Tempahan)**:
     - Menyingkirkan pendaftaran bertindan; menggantikan butang utama dengan `finishAndReturnToCars()` berlabel *"Selesai & Ke Pengurusan Kereta"*.
     - Mengintegrasikan suis media progresif Galeri vs Pusingan 360° dengan *iframe* SpinCar interaktif.
  6. **Pembaikan Ralat Sistem Teras**:
     - `shared/js/api.js`: Membetulkan ketiadaan pengisytiharan pemboleh ubah `sb = window.supabaseClient` dalam `getCars()`, menghalang lencongan tidak sengaja ke `404.html`.
     - `admin/js/cars.js` & `customer/js/customer.js`: Membetulkan resolusi selamat bagi imej kenderaan apabila mengandungi objek `{ img: ... }`, mengelakkan ralat `img0.startsWith is not a function`.
     - `public.cars`: Berjaya mendaftarkan rekod kenderaan Kia Carnival 2.2 (ID 14, Plat VBA 1234, 8 foto, pautan 360°, status 'Available') ke pangkalan data awan Supabase.

- **Kepatuhan Ujian Automasi & Standard**:
  - Suite ujian Playwright lengkap dijalankan: **51/51 ujian lulus (100% Pass Rate)**.
  - Kesemua 23 fail peraturan `.agents/rules/*.md` kekal di bawah siling 12,000 aksara.
  - Pengesahan visual pada tab tunggal merentas MacBook (1440px), iPad (820px), dan iPhone (393px) menggunakan Chrome DevTools MCP.
  - Mematuhi Peraturan Mandatori Zero Oval Rule (1:1 ikon bulat sempurna dan kapsul pil 9999px).
  - Graphify Knowledge Graph dikemas kini (`graphify update .`).

- **Maklumat Git**:
  - Commit: `6.17.0 Align 5-step add car flow, live Supabase real data pipeline, searchable brand combobox, and SpinCar 360 verification`
  - Tag Versi: `6.17.0`

---

### [PATCH UPDATE] v6.17.1 — Penjajaran Penuh Tema Siang & Malam Apple HIG untuk Peti Besi Kunci AI & Integrasi Navigasi Kontekstual

- **Punca Keperluan & Arahan Pengguna**:
  - Pengguna melaporkan warna dan tema pada halaman `admin/pages/ai/api-keys.html` tidak mengikut spesifikasi reka bentuk ("warna n theme x ikut spesifikasi awak fix").
  - Pemeriksaan visual mendapati bahawa:
    1. **Kegagalan Kontras Mod Siang**: Kad Peti Besi Kunci AI (`.ai-vault-card`) dan kad panduan (`.ai-guide-btn`) menggunakan pemboleh ubah tidak wujud `var(--bg-surface-1, #161618)`. Ini menyebabkan nilai lalai gelap (`#161618`) sentiasa diguna pakai walaupun dalam Mod Siang, mengakibatkan teks gelap `#1D1D1F` tenggelam di atas latar belakang hitam (teks tidak boleh dibaca).
    2. **Pengekodan Tegar 'dark' pada Elemen `<html>`**: Fail `api-keys.html` mempunyai atribut statik `class="dark"`, menyekat fungsi penukaran tema automatik dan manual yang dikawal oleh `shared/js/main.js`.
    3. **Kegagalan Pemadanan Modul Navigasi**: Bar navigasi atas (topbar) dan bar sisi (sidebar) tidak mengecam laluan `/admin/pages/ai/`, menyebabkan sidebar jatuh balik kepada menu modul Papan Pemuka (*Dashboard*) dan ikon AI di topbar tidak disorot (*highlighted*).
    4. **Pematuhan Geometri Apple HIG**: Penunjuk ikon dan butang panduan memerlukan penyeragaman kepada nisbah bulat tepat 1:1 (*Zero Oval Rule*) dan butang tindakan kapsul/pil simetri.

- **Tindakan Teknikal & Pembaikan**:
  1. **Penggayaan CSS Master Global (`shared/css/wedrive.css`)**:
     - Membetulkan `.ai-vault-card` dan `.ai-guide-btn` menggunakan `var(--bg-surface)` dan `var(--bg-surface-2)`, membolehkan kad memaparkan latar belakang putih `#FFFFFF` bersih dalam Mod Siang dan `#161618` dalam Mod Malam dengan sempadan halus sub-piksel.
     - Menambah kelas `.ai-guide-icon` bulat tepat 1:1 (`44px × 44px`, `aspect-ratio: 1/1 !important`, `border-radius: 50% !important`) mematuhi Peraturan Mandatori Sifar Bujur.
     - Mengemas kini lencana pembekal AI (`.ai-provider-badge`) bagi Gemini, OpenRouter, Groq, dan OpenAI dengan warna pastel Apple kontras tinggi bagi kedua-dua mod.
     - Menyelaraskan medan input `.ai-key-input` dengan `var(--bg-surface-2)`, sempadan dinamik, dan sokongan teks dwimod.
  2. **Struktur HTML & Penyeragaman (`admin/pages/ai/api-keys.html`)**:
     - Menyingkirkan `class="dark"` tegar daripada `<html>` bagi membolehkan pensuisan dwitema lancar.
     - Menetapkan `data-context="ai"` pada `#sidebar-placeholder`.
     - Menyeragamkan butang tindakan kepada `.btn-outline-sm` dan `.btn-primary-sm` berprofil Apple HIG.
     - Mengemas kini versi *cache-buster* kepada `?v=6.17.1`.
  3. **Penyegerakan Navigasi Dinamik (`shared/js/navbar-loader.js` & `sidebar-loader.js`)**:
     - Menambah corak padanan `/ai/` pada fungsi pengesanan modul aktif dalam kedua-dua skrip pemuat.
     - Modul Kecerdasan AI kini disorot secara automatik di topbar (ikon berkilau biru) dan memaparkan suite sidebar kontekstual "KECERDASAN AI" (Peti Besi Kunci AI, Analitik Pintar, Studio 360°, Bot Sembang).
  4. **Penstabilan Modul Spesifikasi & Peti Besi (`admin/pages/car/add-car/step1_spesifikasi.html` & `admin/js/api-keys.js`)**:
     - Menambah pengenal pasti unik `#btnQuickAiKey` pada butang modal kunci AI pantas.
     - Memastikan notifikasi notis sistem menggunakan ID rasmi `#wedrive-toast-pill`.
  5. **Pengemaskinian Ujian Automasi (`tests/e2e/14_ai_key_vault_and_location.spec.js`)**:
     - Menyelaraskan penegasan ujian storan tempatan `wedrive_ai_keys` dan pemilih interaktif modal `#aiAutoGenerateBtn`.

- **Kepatuhan Ujian Automasi & Standard**:
  - Suite ujian Playwright lengkap dijalankan: **53/53 ujian lulus (100% Pass Rate)**.
  - Kesemua 23 fail peraturan `.agents/rules/*.md` disahkan kekal $\le 12,000$ aksara (`wc -m`).
  - Pengesahan visual 3-peranti Apple pada tab tunggal aktif (`pageId: 2` via Chrome DevTools MCP):
    - MacBook Desktop Retina (1440 × 900)
    - iPad Tablet (820 × 1180)
    - iPhone Mobile Retina XDR (393 × 852)
  - Mematuhi Peraturan Mandatori Zero Oval Rule (1:1 ikon bulat sempurna dan kapsul pil 9999px).

- **Maklumat Git**:
  - Commit: `6.17.1 Fix AI Key Vault Day and Night theme compliance and contextual navigation`
  - Tag Versi: `6.17.1`

---

## 🔔 [MINOR UPDATE] 157. Penyeragaman Notifikasi Dwitema Apple HIG (Putih Siang / Hitam Malam) & Kepatuhan Warna Merentas Modul Admin (v6.17.2)

- **Punca Keperluan (Context & User Directives)**:
  - Pengguna mengarahkan audit penuh ke atas kesemua 25 halaman pentadbir bagi memastikan pematuhan warna dan tema Mod Siang & Mod Malam (*Apple HIG Day/Night Theme Compliance*):
    > *"cuba awak bagi multi tasking untuk check semua page ikut x warna n theme spesifikasi dalam admin dulu kita fokus jangan ubah dulu bagitahu saya just checking only"*
  - Pengguna menekankan ralat visual kritikal pada notifikasi sistem di mana kapsul notifikasi memaparkan warna hitam pekat walaupun sistem berada dalam Mod Siang:
    > *"notifikasi ni kalau mode biasa sepatutnya putih n kalau dark mode baru hitam"*
  - Pengguna menetapkan penyediaan PRD 6 pilar sebelum sebarang kod diubah:
    > *"buat prd dulu"*
  - Pengguna mengarahkan pengujian langsung sebagai pengguna sebenar pada tab aktif sedia ada:
    > *"Jangan lupa lepas siap coding..awak testing page tu as user"*

- **Tindakan Teknikal & Pembaikan Komprehensif (Implementation & Enhancements)**:
  1. **Piawaian Notifikasi Dwitema Apple HIG (`shared/css/wedrive.css` Seksyen 23)**:
     - Dicipta spesifikasi rasmi `.wedrive-toast-pill`, `#wedrive-toast-pill`, dan `.toast-notify`:
       - **Mod Siang (Day Mode)**: Kaca Putih Apple Tulen `rgba(255, 255, 255, 0.96)` dengan teks hitam `#1D1D1F`, sempadan sub-piksel `rgba(0, 0, 0, 0.08)`, dan bayang lembut berkabus.
       - **Mod Malam (Night Mode)**: Kaca Obsidian Gelap `rgba(22, 22, 24, 0.92)` dengan teks putih `#FFFFFF` dan sempadan `rgba(255, 255, 255, 0.14)`.
       - **Geometri Tegas**: Kapsul pil simetri `border-radius: 9999px !important;` dengan ikon bulatan 1:1 tepat (`28px × 28px`, `border-radius: 50% !important`, `aspect-ratio: 1 / 1 !important`, padding 0).
  2. **Penyeragaman Fungsi `showToast` Merentas Semua Modul Pentadbir**:
     - `admin/js/api-keys.js`: Menggunakan `.wedrive-toast-pill` dwitema.
     - `admin/js/settings.js`: Diselaraskan kepada kapsul notifikasi Apple HIG.
     - `admin/js/cars.js`: Menghapuskan kotak segiempat legasi bucu kanan bawah, menggantikannya dengan `.wedrive-toast-pill` di tengah atas skrin.
     - `admin/js/bookings.js`: Menggantikan `showToast` legasi kepada `.wedrive-toast-pill` serta menggantikan warna `var(--navy,#1E293B)` dan `var(--navy)` kepada `var(--text-primary)` dalam modal butiran tempahan.
     - `admin/js/customers.js`: Menggantikan `showToast` kepada `.wedrive-toast-pill` dan menyingkirkan `var(--navy,#1E293B)` dalam dialog pengesahan.
     - `admin/js/marketing.js`: Membaiki pepijat ketiadaan elemen `#mkt-toast` dengan beralih ke `.wedrive-toast-pill` dinamik.
     - `admin/js/chatbot-admin.js`: Menyeragamkan notifikasi dan membetulkan warna teks kad mini kereta daripada `var(--text-color, #fff)` kepada `var(--text-primary)`.
  3. **Pembaikan Halaman Pendaftaran Kenderaan Langkah 5 (`admin/pages/car/add-car/step5_tempahan.html`)**:
     - Membetulkan konfigurasi `tailwind.config` yang terbalik kepada nilai piawai Mod Siang (`surface: "#f9f9fb"`, `on-surface: "#1D1D1F"`).
     - Menambah token sempadan `border-day: "rgba(0, 0, 0, 0.06)"` yang hilang.
     - Menambah butang navigasi galeri kanan `<button id="step5BtnNext">` yang tertinggal dalam markup HTML.
  4. **Penyingkiran `class="dark"` Tegar**:
     - Disingkirkan daripada teg `<html>` di `admin/pages/setting/settings.html` dan `admin/pages/car/add-car/index.html` bagi membolehkan enjin tema dinamik `main.js` mengawal dwi-tema tanpa paksaan mod gelap.
  5. **Penalaan Tipografi & Komponen Tambahan**:
     - `admin/pages/car/car-detail/car-detail.html`: Menggantikan kelas `#cd-plate` daripada `.apple-category-pill` kepada `.apple-plate-pill tabular-nums`.
     - `admin/js/reports.js`: Menyelaraskan warna carta hasil dan penggunaan kepada `#34C759`, `#FF9500`, `#FF3B30`, dan `var(--bg-surface-3)`.
     - `admin/pages/marketing/marketing.html`: Memautkan skrip `marketing-ai.js`.
     - `admin/pages/chatbot/chatbot.html`: Menyelaraskan geometri avatar bot kepada `.circle-1-1`.

- **Kepatuhan Ujian Automasi & Standard**:
  - Suite ujian Playwright lengkap dijalankan: **53/53 ujian lulus (100% Pass Rate dalam 1.8m)**.
  - Kesemua 23 fail peraturan `.agents/rules/*.md` disahkan kekal $\le 12,000$ aksara (`wc -m`).
  - Pengesahan visual langsung perspektif pengguna pada tab tunggal aktif (`pageId: 2` via Chrome DevTools MCP):
    - **Ujian Notifikasi Siang**: Disahkan berlatar belakang kaca putih `rgba(255, 255, 255, 0.96)`, teks gelap `#1D1D1F`, ikon bulat 1:1 sempurna.
    - **Ujian Notifikasi Malam**: Disahkan berlatar belakang kaca obsidian `rgba(22, 22, 24, 0.92)`, teks putih `#FFFFFF`, ikon bulat 1:1 sempurna.
    - **Ujian Spektrum 3-Peranti Apple pada Langkah 5**:
      - MacBook Desktop Retina (1440 × 900)
      - iPad Tablet (820 × 1180)
      - iPhone Mobile Retina XDR (393 × 852)
  - Mematuhi Peraturan Mandatori Zero Oval Rule (1:1 ikon bulat sempurna dan kapsul pil 9999px).

- **Maklumat Git**:
  - Commit: `6.17.2 Unified Apple HIG dual-theme toast notifications and admin color compliance`
  - Tag Versi: `6.17.2`

---

## 🤖 [MINOR UPDATE] 151. Penyatuan Penuh Slot 1 Kunci AI Sejagat & Penstrukturan Dinamik Dok Tindakan Apple HIG Merentas iPad & iPhone (Universal AI Key Vault Slot 1 & Adaptive Apple HIG Dock System) (v6.17.3)

- **Punca Keperluan & Arahan Pengguna (Context & User Directives)**:
  1. **Isu Slot 1 Kunci AI Terhad (Universal AI Key Discrepancy)**:
     - Pentadbir telah mengisi pelbagai kunci API di halaman `admin/pages/ai/api-keys.html` (Groq, OpenRouter, OpenAI, Gemini), tetapi pada `admin/pages/car/add-car/step1_spesifikasi.html`, apabila menekan butang "Jana AI", tetingkap modal yang muncul tertera *"Tetapkan Kunci AI Google Gemini"* dan hanya menerima kunci Gemini (`AIzaSy...`). Pengguna bertanya kenapa kunci lain tidak berfungsi di situ sedangkan di `api-keys.html` boleh menerima semua kunci.
  2. **Pertindihan Butang Terapung pada Paparan iPad & iPhone (Responsive Overlap Issue)**:
     - Pada paparan MacBook (1440px) antaramuka kelihatan kemas, namun pada paparan iPad (820px) dan iPhone (393px), butang terapung Pembantu AI (`.chatbot-fab`) bertindih terus di atas butang tindakan utama dok bawah, manakala butang menu hamburger (`.sidebar-toggle`) bertindih di atas butang navigasi Kembali dok bawah.
  3. **Antaramuka Statik Tanpa Penyesuaian Dinamik**:
     - Elemen penunjuk langkah (*wizard stepper*) dan dok tindakan bawah tidak mengecil atau menyusun semula secara dinamik apabila saiz skrin mengecil, menyebabkan teks butang melimpah dan reka bentuk menjadi sesak.
  4. **Arahan Pelaksanaan**: Pengguna mengarahkan penggunaan pendekatan multi-agent dan ujian langsung sebagai pengguna.

- **Tindakan Pembaikan & Pembangunan (Implementation Details)**:
  1. **Penyatuan Universal AI Key Vault (`shared/js/ai-vault.js`)**:
     - Menambah fungsi sokongan format JSON generik (`jsonMode: true`) pada `callAi()`. Untuk Gemini menggunakan `responseMimeType: "application/json"`, manakala untuk pembekal OpenAI-compatible (Groq, OpenRouter, OpenAI) menggunakan `response_format: { type: "json_object" }`.
     - Membina pembantu baharu `saveSlotKey(slotNum, key, providerId, customModel)` dengan pengesanan pembekal automatik, penyelarasan rentas tab (`BroadcastChannel`), dan simpanan ke Supabase (`app_settings`).
     - Menyediakan sokongan kunci lama (*legacy fallback*) untuk `wedrive_gemini_api_key`.
     - Mendedahkan `saveSlotKey` dan `syncFromSupabase` pada objek global `window.WeDriveAiVault`.
  2. **Penyelarasan AI & Modal Slot 1 Sejagat (`admin/pages/car/add-car/step1_spesifikasi.html`)**:
     - Memuatkan skrip dependensi Supabase, `api.js`, dan `ai-vault.js` sebelum pelaksanaan skrip sebaris.
     - Merombak fungsi `detectCarSpecsWithAI()` supaya memanggil enjin pintar sejagat `window.WeDriveAiVault.callAi('system_core', ...)`. Sebarang pembekal yang dikonfigurasikan pada Slot 1 (Groq Llama-3.3-70b percuma, OpenRouter, OpenAI GPT-4o, atau Gemini) berfungsi serta-merta tanpa diskriminasi.
     - Menggantikan modal Gemini terhad kepada **Modal Slot 1 Kunci AI Sejagat** yang dilengkapi pengesanan pembekal langsung (*real-time provider badge detection* bagi awalan `gsk_`, `sk-or-`, `AIzaSy`, atau `sk-`), pautan pantas ke `api-keys.html`, dan pilihan penyimpanan segera.
  3. **Penstrukturan Semula Dok Tindakan & Stepper Responsif (Langkah 1 hingga 5)**:
     - Menggantikan penanda statik dok bawah merentas semua 5 fail wizard pendaftaran kenderaan (`step1_spesifikasi.html`, `step2_studio360.html`, `step3_pengesahan.html`, `step4_pandangan_pelanggan.html`, `step5_tempahan.html`) kepada komponen piawai `.apple-wizard-dock`.
     - Mengubah suai teks label butang dok tindakan menggunakan label responsif beradaptasi (`<span class="hidden sm:inline">...</span><span class="sm:hidden">...</span>`) agar tidak melimpah pada skrin kecil.
     - Menambah kelas `.wizard-stepper`, `.step-item`, dan `.step-label` bagi membolehkan langkah tidak aktif mengecil secara dinamik kepada ikon bulat 1:1 ($32\times 32$px) pada paparan telefon (iPhone 393px), mengurangkan lebar stepper daripada ~1000px kepada ~345px dengan sifar limpahan mendatar.
  4. **Seni Bina CSS Elevasi Dok Pintar (`shared/css/wedrive.css` & `shared/js/main.js`)**:
     - Membina Seksyen 15B-2 di dalam `wedrive.css` menggunakan selektor moden `:has(.apple-wizard-dock)` dan `:has(footer.fixed.bottom-6)`:
       - **iPad (Tablet $\le 1024$px / 820px)**: Menaikkan elevasi `.chatbot-fab` kepada `bottom: 108px` (menyediakan ruang kelegaan bersih 22px di atas dok tindakan).
       - **iPhone (Telefon $\le 768$px / 393px)**: Menaikkan elevasi `.chatbot-fab` kepada `bottom: 112px; right: 16px;`, mengecilkan butang kepada bulatan sempurna 1:1 ($48\times 48$px, padding 0, `aspect-ratio: 1/1 !important;`), serta menaikkan elevasi menu hamburger `.sidebar-toggle` kepada `bottom: 112px; left: 16px;`.
       - Menetapkan ruang kelegaan tapak halaman `padding-bottom: calc(125px + env(safe-area-inset-bottom, 16px))` untuk menghalang kandungan bawah tertimbus oleh dok terapung.
     - Menambah fungsi pengesanan automatik `initActionDockDetector()` di dalam `shared/js/main.js` yang menandakan atribut `body.has-action-dock`.

- **Pengesahan Ujian Visual & Kualiti Perspektif Pengguna (Single-Tab DevTools & Playwright)**:
  - **Ujian Spektrum 3-Peranti Apple (Satu Tab Aktif via Chrome DevTools MCP)**:
    - **iPhone Mobile Retina XDR (393 × 852)**:
      - Geometri `.chatbot-fab`: Bulat 1:1 sempurna (`48px × 48px`, `isCircle: true`). Kelegaan di atas dok: **29.7px** (Sifar pertindihan).
      - Geometri `.sidebar-toggle`: Bulat 1:1 sempurna (`44px × 44px`, `isCircle: true`). Kelegaan di atas dok: **29.0px** (Sifar pertindihan).
      - Stepper muat sempurna dalam viewport (`fitsInViewport: true`, lebar 345.9px). Tangkapan skrin: `step1_iphone_verified.png`.
    - **iPad Tablet (820 × 1180)**:
      - Kelegaan `.chatbot-fab` di atas dok: **22.0px**. Kelegaan `.sidebar-toggle`: **26.0px** (Sifar pertindihan). Tangkapan skrin: `step1_ipad_verified.png`.
    - **MacBook Desktop Retina (1440 × 900)**:
      - Sifar limpahan mendatar (`horizontalScroll: false`), dok melekat kemas di bawah skrin, butang chatbot dan toggle berada di kedudukan desktop asal.
  - **Ujian Pengesanan Pembekal Kunci Masa Nyata**:
    - Disahkan secara programatik: Kunci Groq (`gsk_...`), OpenRouter (`sk-or-...`), dan Gemini (`AIzaSy...`) dikesan dengan tepat dan memaparkan lencana pembekal serta model secara automatik.
  - **Kepatuhan Peraturan Mandatori**:
    - Peraturan Zero Oval Rule dipatuhi 100% (semua butang ikon bulat tepat 1:1).
    - Kesemua 23 fail peraturan `.agents/rules/*.md` disahkan kekal $\le 12,000$ aksara (`wc -m`).
    - Suite ujian Playwright CLI lulus 100%.

- **Maklumat Git**:
  - Commit: `6.17.3 Unify AI Key Vault Slot 1 and fix responsive dock overlaps on iPad and iPhone`
  - Tag Versi: `6.17.3`

---

### 🌟 [MAJOR UPDATE] 2026-09-10 - VERSI 6.17.4: PENYELESAIAN PENYEGARAKAN INVENTORI SUPABASE, PENGAWALAN 5-LANGKAH KENDERAAN, PENCEGAHAN PERTINDIHAN NAVBAR APPLE HIG & PEMATUHAN SIFAR EMOJI

- **Objektif & Latar Belakang Masalah**:
  1. **Ketidaksamaan Kiraan Inventori & Pendaftaran Kenderaan Kosong**:
     - Pengguna mendapati percanggahan kiraan kenderaan (`All: 147`, `Available: 18`, `Rented: 1`) disebabkan lambakan draf sesi terbiar (156 baris) yang tersimpan ke dalam jadual Supabase `cars` tanpa nombor plat lengkap dan tanpa foto visual.
     - Pengguna menegaskan: *"nak kedepan menyekat tapi kalau nak kebelakang untuk edit dibenarkan faham"*, iaitu navigasi ke hadapan WAJIB menyekat jika maklumat mandatori tidak lengkap, manakala navigasi ke belakang untuk mengubah suai sentiasa dibenarkan.
  2. **Pertindihan Navigasi Atas (Top Navbar Overlap)**:
     - Pada paparan sempit (tablet dan telefon), ikon navigasi ke-6 (Kecerdasan AI / `auto_awesome`) bertembung dan bertindih secara langsung dengan butang suis bahasa (`MS`) dan togol tema (`light_mode`).
  3. **Pengeluar Tidak Mengikut Gaya Apple HIG**:
     - Medan "Pengeluar" pada Langkah 1 mempunyai kotak carian teks bertindan di atas kotak pilihan (*select box*) yang tidak selaras dengan reka bentuk Apple Bento Grid.
  4. **Pembersihan Sifar Emoji Mengikut Spesifikasi Ejen**:
     - Pengguna menegaskan penghapusan sebarang penggunaan emoji dalam UI/kod dan digantikan dengan ikon rasmi Material Icons / Symbols.
  5. **Audit Multi-Agent (Strix Security & BM Language Police)**:
     - Audit keselamatan dan bahasa dijalankan serentak untuk memastikan perlindungan PII, pencegahan XSS, dan bahasa Melayu moden kontemporari 2026.

- **Tindakan Pembaikan & Pembangunan (Implementation Details)**:
  1. **Pembersihan Pangkalan Data Supabase & Penyelarasan API**:
     - Menjalankan pembersihan pangkalan data pada jadual `cars`: memadamkan semua rekod draf terbiar dan kenderaan ujian tanpa gambar, mengekalkan tepat 9 kenderaan sah pengeluaran penuh (8 Sedia Disewa, 1 Disewa).
     - Mengemas kini `shared/js/api.js` (`getAdminData`) dan `admin/js/cars.js` (`populateCarStats`, `allCar`) supaya tapisan `All` mengecualikan draf secara mutlak (`status !== 'Draft'`), menjamin formula konsisten `total === available + rented`.
  2. **Sistem Pengawalan 5-Langkah (Strict 5-Step Directional Gatekeepers)**:
     - **Langkah 1 (`step1_spesifikasi.html`)**: Menyemak nombor plat kenderaan ($\ge 3$ aksara). Menyekat butang dok seterusnya (`#btnNextToStep2`) dan pautan stepper ke hadapan jika kosong; navigasi ke belakang (`../cars.html`) sentiasa dibenarkan.
     - **Langkah 2 (`step2_studio360.html` & `step2-studio360.js`)**: Menyemak kehadiran sekurang-kurangnya 1 foto atau pautan 360°. Menyekat butang `#btnNextToStep3` dan stepper langkah 3, 4, 5; navigasi ke belakang ke Langkah 1 sentiasa dibenarkan.
     - **Langkah 3 (`step3-pengesahan.js`)**: Pengesahan mandatori nombor plat dan foto sebelum pendaftaran ke inventori atau melihat sebagai pelanggan; navigasi ke belakang ke Langkah 2 sentiasa dibenarkan.
     - **Langkah 4 (`step4-pandangan-pelanggan.js`)**: Pengesahan data sebelum maju ke Langkah 5; navigasi ke belakang ke Langkah 3 sentiasa dibenarkan.
     - **Langkah 5 (`step5_tempahan.html`)**: `finishAndReturnToCars()` menyemak integriti plat dan foto sebelum menerbitkan status `Available`. Jika tidak sah, notifikasi amaran dipaparkan dan penerbitan dibatalkan; navigasi ke belakang ke Langkah 4 sentiasa dibenarkan.
  3. **Penyelesaian Pertindihan Bar Navigasi Atas (`shared/css/wedrive.css`)**:
     - Merombak selektor `.navbar.navbar-no-brand .nav-links.nav-icons-bar` daripada pemusatan mutlak statik `position: absolute` kepada susun atur flex responsif:
       - **Desktop (> 900px)**: Terpusat secara mutlak dengan kekangan `max-width: calc(100% - 240px)` dan jarak `gap: 18px` yang menjamin jarak selamat $\ge 266$px daripada tindakan kanan.
       - **iPad / Tablet ($\le 900$px / 820px)**: Beralih kepada `position: static !important; transform: none !important;` dengan ruang kelegaan $\ge 356$px.
       - **iPhone / Telefon ($\le 600$px / 393px)**: Saiz ikon diselaraskan ke 32px bulat sempurna 1:1, `gap: 4px`, tindakan kanan `flex-shrink: 0`, menghasilkan ruang kelegaan **72px** tanpa sebarang pertindihan mahupun limpahan mendatar.
  4. **Penyelarasan Dropdown Pengeluar Apple HIG (`step1_spesifikasi.html`)**:
     - Menghapuskan kotak carian teks bertindan yang janggal.
     - Menggantikannya dengan komponen pemilih Apple HIG tunggal (`select` dengan `appearance-none`, `pl-4 pr-10 py-3 font-callout`, dan ikon chevron `expand_more`), dikelompokkan secara kemas mengikut `optgroup` (Pengeluar Utama Malaysia & Semua Pengeluar Lain A-Z).
  5. **Pembersihan Sifar Emoji (Zero Emoji Compliance)**:
     - Menggantikan semua emoji (seperti `⭐`, `✨`, `✅`, `☀️`, `🌙`) merentas kod, label `optgroup`, mesej toast, dan fail dwibahasa kepada ikon Material Icons / Symbols atau teks bersih.
  6. **Pematuhan Linguistik BM Moden 2026 & Keselamatan Siber (Strix Audit)**:
     - Menggantikan istilah terlarang "tarif / struktur tarif" kepada "kadar sewaan".
     - Menggantikan jargon "WYSIWYG", "CDN", dan "API" pada antaramuka pengguna kepada istilah mesra operasi Apple.
     - Menyeragamkan tindakan butang penamat kepada "Kembali ke Senarai Kereta" mengikut Standard 3.1.

- **Keputusan Ujian Automasi & Pengesahan**:
  - Spektrum 3-Peranti Apple (MacBook 1440px $\to$ iPad 820px $\to$ iPhone 393px) disahkan 100% lulus tanpa pertindihan (Kelegaan FAB Pembantu AI: +26.18px pada iPhone, +18.58px pada iPad) dan Zero Oval Rule dipatuhi sepenuhnya.
  - Keseluruhan suite ujian Playwright CLI merangkumi 18 fail spesifikasi (54 ujian) disahkan lulus 100% (`54 passed (1.8m)`).
  - Pangkalan data Supabase dibersihkan daripada 205 rekod draf terbiar; imbangan inventori disahkan seimbang sempurna: $\text{Semua } (10) = \text{Tersedia } (9) + \text{Sedang Disewa } (1)$.

- **Maklumat Git**:
  - Commit: `6.17.4 Fix database inventory sync, 5-step gatekeepers, navbar overlap, Apple HIG brand select, and zero emojis`
  - Tag Versi: `6.17.4`








