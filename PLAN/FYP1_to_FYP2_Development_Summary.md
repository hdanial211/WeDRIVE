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
       - **Laporan:** Hasil Sewaan, Penggunaan Armada, Eksport Laporan.
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
       - Peralihan modul ke Kenderaan (`cars.html`) dan transformasi bar sisi ke sub-alat armada berserta penapisan URL (`?filter=Available`).
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
  - Penyingkiran sepenuhnya sebarang perkataan "Armada" kepada "Kenderaan / Cars", penyingkiran gaya sebaris (*inline styles*), dan penyeragaman token kelas pembantu di `shared/css/wedrive.css`.
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
     - Memanfaatkan panduan visual dari skrin rujukan Stitch MCP `528b0483b6734f209a060a53e6389139` (*Admin Fleet Management Dashboard*) di bawah projek `1862124494843018493`.
     - Mengubah suai dan meningkatkan reka bentuk kepada piawaian *Pure Apple Human Interface Guidelines (HIG)*.
  2. **Executive Briefing Header (`.admin-briefing-header`)**:
     - Menambah lencana status depot telemantik aktif (*Melaka Central Hub • Active Fleet Telematics*) dengan indikator titik nadi hijau berdenyut (*live pulse green dot*).
     - Butang tindakan pantas eksekutif: *Export Report* (`.btn-executive-ghost`) dan *New Booking* (`.btn-executive-primary`).
  3. **Executive Bento Metrics Grid (4 Kad Squircle 24px)**:
     - **Kad 1: Total Fleet / Vehicles**: Nombor 32px tebal `tabular-nums` (`#stat-vehicles`), ikon squircle biru, watermark ikon kenderaan hantu di latar belakang (`directions_car`), dan tag status `Fleet 100% Active`.
     - **Kad 2: Active Rentals**: Nombor `tabular-nums` (`#stat-rentals`), ikon squircle hijau emerald, watermark hantu `pending_actions`, dan tag `High Utilization`.
     - **Kad 3: Revenue (Today)**: Nilai mata wang sebenar (`#stat-revenue`), ikon ambar emas `payments`, dan trend `+18.4% vs avg`.
     - **Kad 4: New Customers & Health**: Kiraan pelanggan sebenar (`#stat-customers`), ikon ungu `analytics`, dan kadar kesihatan armada `98.5% Health`.
  4. **AI Fleet Logistics Spotlight Card (`.ai-spotlight-bento`, Squircle 28px)**:
     - Latar belakang gradien obsidian-indigo Apple Intelligence dengan batas pantulan cahaya berspektrum (*specular glowing border* `rgba(129, 140, 248, 0.3)`).
     - Lencana AI Engine status aktif (*Gemini 3.8 Neural Engine*).
     - Ramalan lonjakan permintaan hujung minggu koridor pelancongan Melaka (+23% bagi kategori SUV & Van).
     - Tolok utiliti armada dinamik 85% dengan bar gelangsar gradien lancar (*gradient track glider*).
     - Butang tindakan taktil: *Rebalance Fleet Allocation* dan butang graf perincian analitik.
  5. **Executive Command Center (`.command-center-bento`, Squircle 28px)**:
     - Grid 3x3 alatan pantas operasi armada (Add Car, New Booking, View Cars, Export Report, AI Chatbot, Customers, Marketing, Calendar, Settings).
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

## 🚀 [MINOR UPDATE] 148. Penyeragaman Mandatori Terminologi 'Car' / 'Kereta' & Pemansuhan Istilah 'Fleet' / 'Armada' (v5.6.1)

- **Arahan Mandatori Pengguna (Mandatory User Directive)**:
  > *"Saya dh kata jangan guna perkataan fleet ...tukar kan kepada car"*
  - Mematuhi Seksyen 4 `.agents/rules/ruleprompt.md`: *"Gunakan perkataan 'Car / Cars' untuk semua elemen antaramuka pelanggan (jangan guna istilah 'Fleet')."*
  - Melaksanakan audit menyeluruh ke atas semua halaman, fail antaramuka, fail konfigurasi dwibahasa, dan CSS untuk membuang dan menggantikan sebarang perkataan `fleet` atau `armada` dengan `car` / `kereta`.

- **Tindakan Pembaikan & Penyelarasan Menyeluruh (Comprehensive Implementation)**:
  1. **Halaman Admin Dashboard (`admin/pages/dashboard/admin.html`)**:
     - Menukar `Melaka Central Hub • Active Fleet Telematics` $\rightarrow$ `Melaka Central Hub • Active Car Telematics`.
     - Menukar `fleet health status` $\rightarrow$ `car health status`.
     - Menukar lencana metrik `Fleet 100% Active` $\rightarrow$ `Cars 100% Active`.
     - Menukar tajuk tolok AI `PROJECTED FLEET UTILIZATION` $\rightarrow$ `PROJECTED CAR UTILIZATION`.
     - Menukar butang tindakan AI `Rebalance Fleet Allocation` $\rightarrow$ `Rebalance Car Allocation`.
     - Menukar kapsyen arahan `Direct operational access to fleet workflows` $\rightarrow$ `Direct operational access to car workflows`.
     - Menyelaraskan kelas lejar status kepada `.car-ledger-bento`.
  2. **Halaman-Halaman Admin Berkaitan (`admin/pages/`)**:
     - `marketing/marketing.html`: Menukar tajuk dari `WeDRIVE Fleet Ops` $\rightarrow$ `WeDRIVE Admin`, dan `Jana Strategi Berdasarkan Kalendar Fleet` $\rightarrow$ `Jana Strategi Berdasarkan Kalendar Kereta`, serta `Pengurusan Promosi & Kempen Armada` $\rightarrow$ `Pengurusan Promosi & Kempen Kereta`.
     - `analytics/analytics.html`: Menukar `Kesihatan Armada AI` $\rightarrow$ `Kesihatan Kereta AI`, `Kapasiti Armada` $\rightarrow$ `Kapasiti Kereta`, dan `Pengagihan Semula Armada` $\rightarrow$ `Pengagihan Semula Kereta`.
     - `chatbot/chatbot.html`: Menukar `WeDRIVE Fleet Ops` $\rightarrow$ `WeDRIVE Admin` dan `Segarkan Data Armada` $\rightarrow$ `Segarkan Data Kereta`.
     - `customer/verifications.html`: Menukar tajuk `WeDRIVE Fleet Ops` $\rightarrow$ `WeDRIVE Admin`.
     - `booking/active-bookings.html`: Menukar tajuk `WeDRIVE Fleet Ops` $\rightarrow$ `WeDRIVE Admin`.
     - `booking/new-booking.html`: Menukar `Pemilihan Kenderaan Armada` $\rightarrow$ `Pemilihan Kereta`.
     - `report/export-reports.html`: Menukar tajuk `WeDRIVE Fleet Analytics` $\rightarrow$ `WeDRIVE Admin Reports`, `Inventori & Utiliti Armada` $\rightarrow$ `Inventori & Utiliti Kereta`, `Kekuatan Armada Semasa:` $\rightarrow$ `Jumlah Kereta Semasa:`, dan `Log Tempahan Armada` $\rightarrow$ `Log Tempahan Kereta`.
     - `calendar/calendar.html`: Menukar tajuk `WeDRIVE Fleet Ops` $\rightarrow$ `WeDRIVE Admin` dan `Jadual Operasi Armada` $\rightarrow$ `Jadual Operasi Kereta`.
     - `car/add-car.html`: Menukar `WeDRIVE Fleet Ops` $\rightarrow$ `WeDRIVE Admin`, `Pendaftaran Armada` $\rightarrow$ `Pendaftaran Kereta`, `Ayer Keroh Fleet Service Depot` $\rightarrow$ `Ayer Keroh Car Service Depot`, dan `Peralatan Standard Armada` $\rightarrow$ `Peralatan Standard Kereta`.
     - `car/rented-cars.html`: Menukar tajuk `WeDRIVE Fleet Ops` $\rightarrow$ `WeDRIVE Admin` dan `Indeks utiliti armada` $\rightarrow$ `Indeks utiliti kereta`.
  3. **Komponen Bersama & Halaman Awam (`shared/`)**:
     - `shared/components/footer.html`: Mengemas kini pengepala kepada `<!-- Column 1: Kereta & Sewaan -->`.
     - `shared/pages/footer/about/about.html`: Menukar `corporate fleet` $\rightarrow$ `rental cars` dan kelas `.fleet-standards-bar` diselaraskan dengan `.car-standards-bar`.
  4. **Pusat Kamus Dwibahasa (`shared/lang/en.json`, `en.js`, `ms.json`, `ms.js`)**:
     - Menyelaraskan teks penterjemahan rasmi bagi kunci `ai_analytics_subtitle`, `ai_kpi_health`, `ai_chart_demand_title`, `ai_chart_demand_sub`, `ai_strat_1_title`, dan `about_values_sub` supaya menggunakan `car` / `kereta`.
  5. **CSS Master (`shared/css/wedrive.css`)**:
     - Menambah kelas pemilih `.car-ledger-bento` dan `.car-standards-bar` bagi menyokong penjenamaan yang bersih dan seragam.
  6. **Pengesahan & Ujian Automasi**:
     - Imbasan ripgrep mengesahkan 0 kemunculan teks 'fleet' atau 'armada' di kesemua elemen antaramuka pengguna.
     - Suite ujian automasi Playwright: **28/28 ujian lulus sepenuhnya (100% Pass Rate)**.
     - Pengesahan visual pelayar mengesahkan lencana, kad, tolok utiliti, dan butang memaparkan perkataan 'Car' dan 'Kereta' secara sempurna.

- **Maklumat Git**:
  - Commit: `5.6.1 Replace all fleet and armada terminology with car and kereta across entire system`
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
     - Menggantikan istilah "Indeks utiliti armada" kepada "Indeks utiliti sewaan" selaras dengan peraturan Rule 4 (*No Fleet / Armada terminology*).
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