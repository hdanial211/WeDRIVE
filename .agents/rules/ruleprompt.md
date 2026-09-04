---
trigger: always_on
---

# WeDRIVE Core Project Rules

## 1. Theme & Design Consistency (Apple HIG Standard)

- Semua reka bentuk UI, komponen, peralihan, kad, butang, modal, tipografi, dan susun atur WAJIB mematuhi piawaian rasmi **Apple Human Interface Guidelines (HIG)**:
  - **Rujukan Utama:** [`.agents/rules/apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_hig_design_system.md) (Pilar 1–3: Asas & Corak) & [`.agents/rules/apple_hig_components.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_hig_components.md) (Pilar 4–6: Komponen, Input & Teknologi).
  - **Tipografi:** SF Pro Display / SF Pro Text (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif`).
  - **Geometri Asas:** Elemen bulat minimum nisbah 1:1 (`aspect-ratio: 1 / 1; border-radius: 50%`), Butang/Pill kapsul mengembang mendatar (`border-radius: 9999px`), Kad Bento Squircle (`border-radius: 24px/28px`), Input (`border-radius: 12px/14px`).
  - **Peralihan & Transisi Fizik Apple:** `cubic-bezier(0.16, 1, 0.3, 1)` dengan maklum balas sentuhan `transform: scale(0.97)` pada `:active`.
  - **Mod Siang & Malam:** Day Mode (`#F5F5F7` / `#FFFFFF`) dan Night Mode (`#000000` True Black / `#161618` Bento).
  - **Bahan Kaca:** Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).

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

- **Isolasi Folder Ujian:** Semua skrip ujian dan dependensi disimpan di dalam folder terasing `tests/` (Rujuk [`.agents/rules/playwright_testing.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/playwright_testing.md)).
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

- **Navigation, Responsif & UI/UX:** [`.agents/rules/navigation_and_ui.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/navigation_and_ui.md)
  - **Seni Bina Navigasi Admin:** Modul Admin WAJIB menggunakan **Topbar sebagai Main Navigation** (6 modul teras: Dashboard, Cars, Bookings, Customers, Reports, AI Intelligence) dan **Sidebar sebagai Sub-Main Navigation** (alatan kontekstual fizikal `.html` khusus).
- **Kod, CSS & Backend Architecture:** [`.agents/rules/code_and_backend.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/code_and_backend.md)
- **Apple Device Support:** [`.agents/rules/apple_device_support.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_device_support.md)
- **Keselamatan Siber & Audit Kerentanan (Strix):** [`.agents/rules/security_and_audit.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/security_and_audit.md)

---

## 8. Larangan Reka Bentuk 'Terlalu AI' & Standard Penjenamaan Korporat Sebenar

- **Sistem Mesti Kelihatan Seperti Perisian Korporat Rasmi**: Portal Admin WeDRIVE WAJIB menyerupai sistem mobiliti dan logistik pengurusan kenderaan profesional bertaraf enterprise (seperti Stripe Dashboard, Linear, Apple Developer), BUKAN templat AI generik.
- **Tiada Elemen 'Cheesy AI'**:
  - Dilarang mereka cipta perkataan AI yang mengarut (*Quantum Neural Fleet*, *Supercharged Velocity*, sanitasi tangan hospital).
  - Dilarang membuat graf atau nombor statistik statik palsu tanpa kaitan operasi.
  - Setiap tindakan, jadual, dan butang WAJIB mempamerkan integriti perniagaan kereta sewa sebenar: status kenderaan, penyewa, kadar harian, deposit keselamatan, pengesahan lesen JPJ, dan rekod serahan/pulangan.

---

## 9. Integrasi Stitch MCP & Standard Penjanaan UI Berkualiti Tinggi (Gemini 3.8 / Ultra High-Quality Tier)

- **Prinsip Utama: Kualiti Menyeluruh Mengatasi Kepantasan (*Quality Over Speed*)**:
  - *Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)*.
  - Dilarang sama sekali menggunakan model pantas/ringan (Flash) demi mengejar kepantasan yang menghasilkan reka letak asas berkualiti rendah.
- **Mandatori Penggunaan Stitch MCP Bagi Reka Letak Baharu**:
  - Gunakan alatan Stitch MCP (`list_projects`, `generate_screen_from_text`, `get_screen`, `list_design_systems`, `apply_design_system`, `upload_design_md`) untuk mereka bentuk atau membaik pulih skrin dan susun atur visual sistem WeDRIVE.
  - **Projek Rujukan Stitch:** `1862124494843018493` (*AI-Powered Car Rental Management*).
  - **Sistem Reka Bentuk (*Design System*):** `assets/40090a9886c4444abca795c82673f4c8` atau `assets/518f31ad774f458da15c7fc5ff999bbf` (*Precision & Clarity / WeDRIVE Lumina*).
  - **Tahap Kualiti Model (*Ultra High-Quality Model Tier*):** Sentiasa gunakan piawaian model penaakulan tertinggi **Gemini 3.8** (pemetaan parameter Stitch MCP `modelId: GEMINI_3_1_PRO`; model `GEMINI_3_PRO` telah ditamatkan/deprecated) bagi memastikan kualiti susun atur Apple HIG, squircle 24px/28px, tipografi `tabular-nums`, dan tiada templat murahan.
  - **Konsistensi `DESIGN.md`:** Setiap token warna, saiz sudut squircle, dan tipografi WAJIB berpandukan fail rujukan punca [`DESIGN.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/DESIGN.md).
- **Penyelarasan Kod Fizikal & Integriti Data**:
  - Semua kod CSS yang dijana daripada Stitch WAJIB diselaraskan secara berpusat ke dalam `shared/css/wedrive.css`.
  - Semua medan dan butang tindakan WAJIB disambung terus ke punca data operasi sebenar (`window.WeDriveAPI` / Supabase).



