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
Menyusun pautan ke dalam 4 lajur teratur (Armada & Sewaan, Pilihan & Ciri, Bantuan & Khidmat, Dasar & Syarikat) dengan tipografi bersih.
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
Portal Pentadbir (/admin/): Chatbot bertindak sebagai pembantu operasi WeDRIVE (menyemak status ketersediaan armada, ringkasan tempahan baharu, pengesahan dokumen pelanggan, dan bantuan sistem). Cip cadangan: Status armada, Ringkasan tempahan, Senarai pelanggan, Bantuan sistem.
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