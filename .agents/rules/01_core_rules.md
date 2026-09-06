---
trigger: always_on
---

# WeDRIVE Core Project Rules

## 0. Mandatory Pre-Coding & Gatekeeper Protocol (Syarat Mutlak Setiap Sesi & Pengekodan)

Setiap kali sesi bermula atau arahan (prompt) diterima, ejen AI **WAJIB** mematuhi protokol gatekeeper berikut secara berturutan sebelum menulis atau mengubah sebarang fail kod:

1. **Wajib Baca Peraturan Ejen Terlebih Dahulu**: Sentiasa semak dan patuhi peraturan dalam `.agents/rules/` sebelum sebarang pengubahsuaian.
2. **Wajib Temu Duga /grill-me Dahulu**: Sekiranya terdapat arahan baharu, ketidakpastian skop, atau pilihan seni bina, AI WAJIB menjalankan sesi temu duga menggunakan alatan `ask_question` untuk menyelaraskan kehendak bersama pengguna sebelum sebarang kod disentuh.
3. **Wajib Semak Halaman Sebagai Pengguna Dahulu (Check Page As User First)**: Sebelum mengubah kod sesuatu halaman, AI WAJIB memeriksa rupa bentuk visual dan fungsi semasa pada tab pelayar aktif (menggunakan `chrome-devtools` snapshot/DOM) daripada perspektif pengguna sebenar tanpa membuka banyak tab.
4. **Wajib Manfaatkan Ekosistem Alatan Pintar & MCP WeDRIVE**:
   - **Playwright CLI**: Menguji setiap butang, borang, dan aliran aplikasi secara automatik di pelayar tanpa membazir masa berjam-jam melakukan ujian manual.
   - **Supabase MCP**: Membina dan mengurus pangkalan data PostgreSQL, skema jadual, keselamatan RLS, dan pengesahan pengguna secara lancar tanpa beban backend manual.
   - **Strix Security Audit**: Menjalankan simulasi ujian penembusan etika persis penggodam sebenar bagi memastikan tiada kebocoran data peribadi atau kelonggaran keselamatan.
   - **Skill UI for Front-End**: Melakukan kejuruteraan terbalik (*reverse engineering*) daripada laman web rujukan kepada spesifikasi reka bentuk visual Apple HIG berkualiti tinggi.
   - **Context7 MCP**: Membekalkan dokumentasi langsung dan versi pustaka paling terkini bagi menghapuskan halusinasi kod atau sintaks lapuk.
   - **Stitch MCP, Composio, Graphify & Chrome DevTools**: Melengkapi penjanaan antaramuka berkualiti tinggi, automasi aliran kerja, pencarian kod tanpa pembaziran token, serta semakan visual halaman pengguna.
5. **Wajib Patuhi Standard Bahasa Moden 2026**: Sentiasa rujuk [`.agents/rules/11_language_standards.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md) untuk semua teks, lencana, label butang, mesej ralat, dan perbualan AI.

---

## 1. Theme & Design Consistency (Apple HIG Standard)

- Semua reka bentuk UI, komponen, peralihan, kad, butang, modal, tipografi, dan susun atur WAJIB mematuhi piawaian rasmi **Apple Human Interface Guidelines (HIG)**:
  - **Rujukan Utama:** [`.agents/rules/02_apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md) (Pilar 1–3: Asas, Bento Grid & Corak) & [`.agents/rules/03_apple_hig_components.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/03_apple_hig_components.md) (Pilar 4–6: Komponen, Input & Teknologi).
  - **Prinsip Geometri Bulat (Strict 1:1 Circle — Zero Oval):** Elemen bulat WAJIB nisbah tepat **1:1** (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`). DILARANG SAMA SEKALI bentuk bujur/oval/lonjong. Elemen berteks WAJIB mengembang kapsul mendatar (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).
  - **Bento Grid & Zero Dead Space:** Susun atur kad Bento seimbang ketinggiannya, sifar lompang kosong (`gap: 24px`, `padding: 24px`, kad squircle `border-radius: 24px/28px`, input `border-radius: 14px`).
  - **Tipografi & Fizik Apple:** SF Pro Display/Text, nombor `tabular-nums`, transisi `cubic-bezier(0.16, 1, 0.3, 1)`, sentuhan `scale(0.97)` pada `:active`, kaca Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).
  - **Dwi-Tema:** Mod Siang (`#F5F5F7` / `#FFFFFF`) dan Mod Obsidian Malam (`#000000` True Black / `#161618` Bento).

### 1B. Penyeragaman Mutlak Bahasa Melayu Moden Kontemporari Malaysia 2026
- Seluruh antaramuka WeDRIVE tertakluk secara mutlak kepada [`.agents/rules/11_language_standards.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md).
- **Standard BM Moden (Era 2026):** 100% BM moden santai, segar, ringkas (seperti Grab, Setel, TnG eWallet, Trevo, Wahdah, Carsome).
- **Larangan Senarai Hitam (Zero Tolerance):** DILARANG SAMA SEKALI menggunakan kata terlarang (*Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar, Perisai Keselamatan, Gugusan Kereta*) dalam kod, teks UI, mahupun perbualan AI.

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

## 7. Indeks & Rujukan Peraturan Modul Berkaitan

- **Standard Bahasa Melayu Moden 2026 & Senarai Hitam:** [`.agents/rules/11_language_standards.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md)
- **Reka Bentuk Apple HIG & Bento Grid:** [`.agents/rules/02_apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md) & [`.agents/rules/03_apple_hig_components.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/03_apple_hig_components.md)
- **Navigation, Responsif & UI/UX:** [`.agents/rules/04_navigation_and_ui.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/04_navigation_and_ui.md)
- **Kod, CSS & Backend Architecture:** [`.agents/rules/06_code_and_backend.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/06_code_and_backend.md)
- **Apple Device Support:** [`.agents/rules/05_apple_device_support.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/05_apple_device_support.md)
- **Stitch MCP & Penjanaan UI:** [`.agents/rules/07_stitch_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/07_stitch_design_system.md)
- **Automated Testing (Playwright):** [`.agents/rules/08_playwright_testing.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/08_playwright_testing.md)
- **Keselamatan Siber & Audit Kerentanan (Strix):** [`.agents/rules/09_security_and_audit.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/09_security_and_audit.md)
- **Graphify & Token Optimization:** [`.agents/rules/10_graphify.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/10_graphify.md)
