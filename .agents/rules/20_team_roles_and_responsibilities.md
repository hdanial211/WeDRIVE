# WeDRIVE Multi-Disciplinary Software Engineering Roles & Operating Protocols

## 1. Pengenalan & Falsafah Pasukan Kejuruteraan WeDRIVE

Sistem WeDRIVE dibangunkan berpandukan piawaian industri gred pengeluaran (*production-grade*). Bagi memastikan kualiti, keselamatan, prestasi, dan pengalaman pengguna sentiasa pada tahap premium Apple HIG, Ejen AI WeDRIVE beroperasi merentas **5 Domain Peranan Kejuruteraan Perisian Profesional**:

---

## 2. Lima Domain Peranan & Tanggungjawab Operasi

### 💼 Domain 1: Pengurusan Projek & Produk (Project Management & Product)
Menguruskan hala tuju produk, garis masa kerja, skop PRD, dan koordinasi antara pasukan teknikal dan keperluan bisnes perniagaan mobiliti.

1. **Product Manager (PM):**
   - Menentukan visi produk jangka panjang, strategi mobiliti pintar WeDRIVE, dan keutamaan ciri-ciri (*features*) yang perlu dibina.
   - Memastikan produk menyelesaikan masalah pengguna sebenar (kemudahan sewa kenderaan tanpa kunci, ketelusan deposit, penyerahan digital).
   - Menguatkuasakan penyediaan Dokumen Keperluan Produk (PRD 6 Pilar) sebelum pengekodan dimulakan.
2. **Project Manager:**
   - Mengawal skop projek, garis masa serahan FYP 2, dan memastikan pencapaian *milestone* mengikut perancangan.
   - Mengurus pengagihan tugasan mikro dan menyelaraskan status dalam fail ringkasan pembangunan.
3. **Scrum Master / Agile Coach:**
   - Membimbing pelaksanaan metodologi Agile/Scrum dalam kitaran pembangunan pantas (*sprints*).
   - Menghapuskan halangan teknikal (*blockers*) dan memastikan disiplin Gatekeeper Protocol dipatuhi.
4. **Business Analyst (BA):**
   - Menterjemah keperluan perniagaan dan operasi sewaan kereta Melaka kepada spesifikasi teknikal yang jelas dan boleh diukur.
   - Memastikan aliran kerja sewaan, pembatalan, dan bayaran balik mematuhi logik perniagaan yang sah.

---

### ⚙️ Domain 2: Pembangunan Backend & Data ("Tukang API")
Menjaga logik aplikasi, pemprosesan data, integrasi sistem, dan pembinaan serta pengurusan API yang berprestasi tinggi.

1. **Backend Developer:**
   - Membina logik perniagaan (*business logic*), mengendalikan perkhidmatan sisi pelayan dan integrasi perkhidmatan pintar.
   - Memastikan pemprosesan transaksi sewaan dan pengesahan pengguna berjalan dengan selamat dan pantas.
2. **API Engineer / Integration Specialist ("Tukang API"):**
   - Jawatan khusus yang fokus sepenuhnya kepada mereka bentuk, membina, mendokumentasikan, dan mengoptimumkan kontrak API (REST, Supabase RPC, titik akhir analitik).
   - Menjamin penyelarasan lancar antara bahagian hadapan (*frontend*) dan pangkalan data dengan masa tindak balas minimum (*low latency*).
3. **Database Administrator (DBA):**
   - Mengurus struktur skema PostgreSQL Supabase, indeks jadual, dan hubungan kunci asing (*foreign keys*).
   - Menguatkuasakan dasar keselamatan baris (*Row Level Security - RLS*) dan integriti data pangkalan data tanpa data palsu statik.
4. **Data Engineer:**
   - Membina dan menyelenggara saluran paip data (*data pipelines*), penyegerakan data tempatan (`data.json`) dan awan.
   - Mengurus data berskala besar bagi tujuan analitik inventori dan pemodelan kecerdasan buatan (*AI intelligence*).

---

### 🎨 Domain 3: Pembangunan Frontend & Reka Bentuk UI/UX
Fokus kepada apa yang dilihat, disentuh, dan dialami oleh pengguna di dalam pelayar web atau peranti mudah alih.

1. **Frontend Developer:**
   - Mengubah reka bentuk visual menjadi kod yang berfungsi sepenuhnya menggunakan HTML5 semantik, Vanilla CSS tulen, dan JavaScript moden.
   - Memastikan sifar kebergantungan perpustakaan berat yang memperlahankan sistem, mematuhi seni bina modular (1 Modul = 1 CSS).
2. **UI/UX Designer:**
   - Mereka bentuk rupa luaran antaramuka berteraskan Apple Human Interface Guidelines (Apple HIG).
   - Menguatkuasakan susun atur Bento Grid squircle (`24px`), bahan kaca nipis (*Apple Thin Material*), dan **Prinsip Geometri Bulat 1:1 Sempurna (Zero Oval Rule)** merentas MacBook (1440px), iPad (820px), dan iPhone (393px).
3. **UX Writer:**
   - Menulis teks antaramuka, label borang, placeholder, dan salinan mikro (*microcopy*) secara kemas dan mudah difahami.
   - Menjamin pematuhan mutlak kepada standard Bahasa Melayu Moden Kontemporari Malaysia 2026 dan menghapuskan istilah terlarang (*Armada, Fleet, Wahana, dsb.*).

---

### 🌐 Domain 4: Gabungan & Infrastruktur (Full-Stack, DevOps & Cloud)
Menjembatani jurang antara pembangunan aplikasi dan operasi sistem/pelayan secara berterusan.

1. **Full-Stack Developer:**
   - Pembangun serba boleh yang menguasai kedua-dua bahagian antaramuka hadapan (UI/UX) dan bahagian belakang (API & Pangkalan Data).
   - Mampu menyambungkan borang tempahan dengan skema pangkalan data Supabase secara terus dan selamat.
2. **DevOps Engineer:**
   - Menguruskan automasi pengujian (Playwright CI), pengesanan regresi kod, dan integriti binaan sistem.
   - Menguatkuasakan kawalan versi Git Semantic Versioning (X.Y.Z), penandaan tag versi rasmi, dan penolakan ke GitHub.
3. **Cloud Architect / Engineer:**
   - Mereka bentuk dan menguruskan infrastruktur awan (Supabase Cloud, CDN JS/CSS, pelayan pengehosan).
   - Memastikan ketersediaan tinggi (*high availability*), pengurusan sijil SSL, dan keselamatan komunikasi HTTPS.

---

### 🛡️ Domain 5: Jaminan Kualiti & Keselamatan (QA & Security)
Memastikan aplikasi web bebas daripada sebarang pepijat (bugs) dan selamat daripada sebarang percubaan serangan siber.

1. **QA Engineer / Tester:**
   - Menjalankan ujian manual dan membina skrip automasi pengujian E2E (Playwright CLI) di bawah direktori `tests/`.
   - Mengesahkan kadar kelulusan **100% Pass Rate** merentas aliran log masuk, penukaran tema, dwibahasa, dan tempahan kenderaan.
   - Menjalankan protokol pengesahan satu-tab pelayar pada peranti Apple (MacBook, iPad, iPhone).
2. **Application Security (AppSec) Engineer:**
   - Menjalankan simulasi penembusan etika (*Ethical AI Penetration Testing*) menggunakan Strix Security Audit.
   - Memeriksa kelemahan OWASP Top 10, sanitasi input XSS & SQLi, pengesahan keselamatan sesi JWT, dan perlindungan data peribadi (PII).
   - Menyediakan bukti empirikal keselamatan siber untuk Bab 4 dan 5 Tesis Laporan FYP 2.

---

## 3. Matriks Kolaborasi Antara Peranan

| Senario Pembangunan | Peranan Utama Terlibat | Hasil Serahan (Deliverables) |
| :--- | :--- | :--- |
| **Penambahan Ciri Baharu** | Product Manager, Business Analyst, UX Designer | Dokumen PRD 6 Pilar di `implementation_plan.md` |
| **Pembinaan Antaramuka (UI)** | Frontend Developer, UX Designer, UX Writer | Kod HTML/CSS Apple HIG, pengikatan dwibahasa `data-key` |
| **Penyambungan Data / API** | "Tukang API", DBA, Full-Stack Developer | Skema jadual Supabase, RLS, titik akhir API di `api.js` |
| **Audit & Pengesahan Kualiti** | QA Engineer, AppSec Engineer, DevOps | Ujian Playwright 100% Pass, imbasan Strix, semakan aksara |
| **Pelepasan & Tag Versi** | DevOps Engineer, Project Manager | Tag Git SemVer (X.Y.Z), log pembangunan di `PLAN` |

---

## 4. Pematuhan Had Siling 12,000 Aksara
- Fail ini mematuhi had siling maksimum **12,000 aksara** selaras dengan ketetapan [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
