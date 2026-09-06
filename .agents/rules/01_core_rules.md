---
trigger: always_on
---

# WeDRIVE Core Project Rules

## 1. Theme & Design Consistency (Apple HIG Standard)

- Semua reka bentuk UI, komponen, peralihan, kad, butang, modal, tipografi, dan susun atur WAJIB mematuhi piawaian rasmi **Apple Human Interface Guidelines (HIG)**:
  - **Rujukan Utama:** [`.agents/rules/02_apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md) (Pilar 1–3: Asas, Bento Grid & Corak) & [`.agents/rules/03_apple_hig_components.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/03_apple_hig_components.md) (Pilar 4–6: Komponen, Input & Teknologi).
  - **Prinsip Geometri Bulat (Strict 1:1 Circle — Zero Oval):** Elemen bulat WAJIB nisbah tepat **1:1** (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`). DILARANG SAMA SEKALI bentuk bujur/oval/lonjong. Elemen berteks WAJIB mengembang kapsul mendatar (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).
  - **Bento Grid & Zero Dead Space:** Susun atur kad Bento seimbang ketinggiannya, sifar lompang kosong (`gap: 24px`, `padding: 24px`, kad squircle `border-radius: 24px/28px`, input `border-radius: 14px`).
  - **Tipografi & Fizik Apple:** SF Pro Display/Text, nombor `tabular-nums`, transisi `cubic-bezier(0.16, 1, 0.3, 1)`, sentuhan `scale(0.97)` pada `:active`, kaca Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).
  - **Dwi-Tema:** Mod Siang (`#F5F5F7` / `#FFFFFF`) dan Mod Obsidian Malam (`#000000` True Black / `#161618` Bento).


### 1D. Penyeragaman Mutlak Bahasa Melayu Moden Kontemporari Malaysia 2026 (Senarai Hitam Istilah Kuno/Kaku AI & Bahasa Asing)
- **Standard Bahasa Melayu Moden Kontemporari (Era 2026)**:
  - Sistem WeDRIVE WAJIB menggunakan 100% Bahasa Melayu moden Malaysia terkini seperti yang diguna pakai oleh aplikasi teknologi terkemuka di Malaysia (**Grab, Setel, TnG eWallet, Trevo, Wahdah, Carsome**).
  - Tona bahasa mestilah **santai, segar, ringkas, mesra pengguna, dan terus kepada maksud sebenar** operasi sewaan kenderaan di Malaysia.
  - **DILARANG SAMA SEKALI** bahasa Melayu kuno/buku teks klasik, istilah terjemahan harfiah Indonesia, atau bahasa terjemahan langsung robotik AI (*direct English-to-Malay literal translation*).

- **SENARAI HITAM ISTILAH TERLARANG (STRICT BLACKLIST - DILARANG SAMA SEKALI GUNA DALAM KOD, UI & PERBUALAN AI)**:

| ❌ Kata Terlarang (Blacklist) | Punca Larangan & Kesalahan Maksud | ✅ Istilah Rasmi Wajib Guna (BM Moden / EN) |
| :--- | :--- | :--- |
| **Armada** | Maksud sebenar ialah angkatan kapal perang laut (Sepanyol/Portugis/Kamus Dewan) atau pinjaman Indonesia. Rakyat Malaysia tidak menyewa "armada". | **Kereta** / **Pilihan Kereta** / **Katalog Kereta** |
| **Fleet** | Istilah korporat Inggeris yang kaku dan asing bagi pelanggan harian. | **Kereta** (BM) / **Cars** (EN) |
| **Wahana** / **Kenderaan Penggerak** | Istilah klasik/puitis yang tidak digunakan dalam aplikasi harian. | **Kereta** / **Model Kereta** |
| **Kabin** / **Bilik Kemudi** / **Kokpit** | Istilah kapal terbang/kapal laut. Kereta mempunyai ruang dalaman biasa. | **Dalaman Kereta** / **Ruang Dalaman** (BM) / **Interior** (EN) |
| **Prapapar** / **Peringkat Interaktif** | Terjemahan langsung "preview" dan "stage" yang janggal. | **Pratonton 360°** / **Lihat Kereta 360°** |
| **Bilik Pameran** (dalam konteks list kereta) | Terjemahan langsung "showroom". | **Katalog Kereta** / **Pilihan Kereta** |
| **Pelayaran Mobiliti** / **Mobiliti Pintar** | Frasa khayalan AI generik (*cheesy marketing*). | **Sewa Kereta** / **Perjalanan Anda** |
| **Perisai Keselamatan** | Frasa hiperbola AI. | **Perlindungan Insurans** / **Insurans Penuh** |
| **Gugusan Kereta** | Terjemahan kaku "vehicle cluster". | **Pilihan Kereta** / **Senarai Kereta** |

- **Panduan Penggunaan Seragam Merentas Seluruh Sistem**:
  - **Bar Sisi & Menu Admin**: `Pengurusan Kereta` $\rightarrow$ `Semua Kereta`, `Kereta Tersedia`, `Kereta Sedang Disewa`, `Studio 360° & Info Kereta`, `Tambah Kereta Baharu`.
  - **Tindakan & Navigasi**: `Kembali ke Senarai Kereta` (BUKAN istilah lain).
  - **Katalog & Pelanggan**: `Pilih Kereta`, `Cari Kereta`, `Sewa Sekarang`, `Tempah Sekarang`, `Lihat Kereta`.
  - **Lencana Status**: `Tersedia`, `Sedang Disewa`, `Selesai`, `Dibatalkan` (dilarang campur aduk teks Inggeris semasa mod BM aktif).
  - **Peraturan Komunikasi AI**: Ejen AI **DILARANG SAMA SEKALI** menyebut, mencadangkan, atau menulis perkataan dalam Senarai Hitam di atas semasa membalas mesej pengguna, membuat ringkasan, menjana fail, atau menulis kod.

---

## 2. Git Version Control

- Setiap perubahan WAJIB ditujah (push) ke GitHub.
- Format commit message: `X.X.X Description of changes` (Wajib bermula dengan nombor versi tanpa huruf `v`).
- **Penomboran Versi FYP 2:**
  - FYP 2 disambung secara berturutan bermula dari versi **`3.0.0`** (selepas FYP 1 versi `2.9.9`).
  - Setiap commit WAJIB mempunyai tag GitHub yang sepadan dengan nombor versi.

| Bahagian | Bila Guna                                          | Contoh                                    |
| -------- | -------------------------------------------------- | ----------------------------------------- |
| Major    | Modul baru / redesign keseluruhan                  | `3.0.0 Start FYP 2 Architecture & AI`     |
| Minor    | Tambah feature / improvement / perubahan sederhana | `3.1.0 Add AI Document OCR Verification`  |
| Patch    | Bug fix / tweak kecil / styling update             | `3.0.1 Fix hover animation, adjust spacing` |

---

## 3. Mandatory Development Summary Logging (PLAN)

- Setiap kali sebarang perubahan kod, pembaikan isu, atau penambahan ciri baharu dilakukan, pembangun/AI WAJIB mengemas kini fail:
  `PLAN/FYP1_to_FYP2_Development_Summary.md`
- Labelkan setiap catatan perkembangan dengan jelas:
  - **`[MAJOR UPDATE]`**: Modul baharu, rombakan arkitektur, atau integrasi ciri berskala besar.
  - **`[MINOR UPDATE]`**: Pembaikan pepijat, penyeragaman komponen/CSS, atau penalaan UI.

---

## 3B. Mandatori Penyediaan Dokumen Keperluan Produk (PRD) Sebelum Pembangunan

- Sebelum memulakan sebarang tugasan pembangunan baharu, penambahan modul, rombakan seni bina, atau pengubahsuaian UI/UX, AI/pembangun **WAJIB menyediakan seksyen PRD (Product Requirements Document)** yang terperinci di dalam `implementation_plan.md`.
- PRD WAJIB mengandungi komponen berikut:
  1. **Objektif & Skop Perniagaan (*Objective & Scope*)**: Menyatakan masalah yang diselesaikan dan impak operasi.
  2. **Sasaran Pengguna & Aliran Penggunaan (*User Personas & Use Cases*)**: Aliran tindakan pentadbir atau pelanggan.
  3. **Keperluan Fungsian Spesifik (*Functional Requirements*)**: Huraian tepat setiap butang, input, jadual, dan modal.
  4. **Keperluan Bukan Fungsian & Apple HIG (*Non-Functional & Apple HIG UX*)**: Saiz sentuh (min 44px), `tabular-nums`, sudut squircle (24px), bahan kaca lut sinar, dan responsif.
  5. **Integriti Data & Pemetaan API (*Data Models & API Contracts*)**: Sumber data sebenar (`window.WeDriveAPI` / Supabase) tanpa data palsu.
  6. **Kriteria Penerimaan & Ujian (*Acceptance Criteria & Verification Plan*)**: Senarai semak kelulusan dan suite ujian automasi Playwright (100% Pass Rate).


---

## 4. Logo, Branding & Emoji Rules

- **Logo:** Ikon di kiri, teks di kanan, latar belakang telus (transparent), dan favicon WAJIB ada di setiap page.
- **Terminology:** Gunakan perkataan **"Car / Cars"** untuk semua elemen antaramuka pelanggan (jangan guna istilah "Fleet").
- **No Emoji:** JANGAN gunakan emoji dalam kod sumber, nama fail, atau teks antaramuka.

---

## 5. Automated Testing & Playwright CLI Protocol

- **Isolasi Folder Ujian:** Semua skrip ujian dan dependensi disimpan di dalam folder terasing `tests/` (Rujuk [`.agents/rules/08_playwright_testing.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/08_playwright_testing.md)).
- **Mandatory Post-Task Test Run:** Setiap kali selesai sesuatu tugas pembangunan, jalankan:
  ```bash
  cd tests && npx playwright test
  ```
- Pastikan semua ujian mencapai **100% Pass Rate** sebelum commit.

---

## 6. Graphify & Token Optimization (MANDATORY)

- **Jimat Kuota AI (Token Saver):**
  - Setiap kali membuka sesi baharu, **JANGAN baca (*load/read*) fail secara pukal**.
  - **WAJIB gunakan MCP Graphify** (`query_graph`, `get_node`, `shortest_path`) atau periksa `graphify-out/graph.json` untuk mencari fail dan hubung kait kod secara terus.

---

## 7. Rujukan Peraturan Modul Berkaitan

- **Navigation, Responsif & UI/UX:** [`.agents/rules/04_navigation_and_ui.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/04_navigation_and_ui.md)
  - **Seni Bina Navigasi Admin:** Modul Admin WAJIB menggunakan **Topbar sebagai Main Navigation** (6 modul teras: Dashboard, Cars, Bookings, Customers, Reports, AI Intelligence) dan **Sidebar sebagai Sub-Main Navigation** (alatan kontekstual fizikal `.html` khusus).
- **Kod, CSS & Backend Architecture:** [`.agents/rules/06_code_and_backend.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/06_code_and_backend.md)
- **Apple Device Support:** [`.agents/rules/05_apple_device_support.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/05_apple_device_support.md)
- **Keselamatan Siber & Audit Kerentanan (Strix):** [`.agents/rules/09_security_and_audit.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/09_security_and_audit.md)

---

## 8. Larangan Reka Bentuk 'Terlalu AI' & Standard Penjenamaan Korporat Sebenar

- **Sistem Mesti Kelihatan Seperti Perisian Korporat Rasmi**: Portal Admin WeDRIVE WAJIB menyerupai sistem profesional bertaraf enterprise (Stripe Dashboard, Linear, Apple Developer), BUKAN templat AI generik.
- **Tiada Elemen 'Cheesy AI'**:
  - Dilarang mereka cipta istilah AI mengarut (*Quantum Neural Fleet*, *Supercharged Velocity*).
  - Dilarang membuat graf atau nombor statistik statik palsu tanpa kaitan operasi.
  - Setiap butang dan jadual WAJIB mempamerkan integriti perniagaan kereta sewa sebenar.

---

## 9. Stitch MCP & Penjanaan UI Berkualiti Tinggi

- Semua piawaian Stitch MCP, konfigurasi projek, model `GEMINI_3_1_PRO`, dan alur kerja penjanaan terkandung sepenuhnya dalam [`.agents/rules/07_stitch_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/07_stitch_design_system.md).
- **Prinsip Teras:** *Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar.*
- **Alur Kerja Mandatori:** [`.agents/workflows/stitch_generation.md`](file:///Users/hakim/Library/Mobile%20Documents/com%7Eapple%7ECloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/workflows/stitch_generation.md).
