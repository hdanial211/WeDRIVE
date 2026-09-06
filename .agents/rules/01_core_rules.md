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
   - **Playwright CLI**: Ujian butang, borang & aliran E2E automatik di pelayar (100% Pass Rate).
   - **Supabase MCP**: Pengurusan PostgreSQL, skema jadual, dasar RLS & auth pengguna.
   - **Strix Security Audit**: Simulasi ujian penembusan etika & audit keselamatan data peribadi.
   - **Skill UI for Front-End**: Kejuruteraan terbalik reka bentuk ke spesifikasi Apple HIG berkualiti tinggi.
   - **Context7 MCP**: Dokumentasi langsung dan versi pustaka terkini tanpa kod halusinasi.
   - **Stitch MCP, Composio, Graphify & Chrome DevTools**: Penjanaan UI UHQ, automasi aliran kerja, penjimatan token & semakan visual pengguna.
5. **Wajib Patuhi Standard Bahasa Moden 2026**: Sentiasa rujuk [11_language_standards.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md) untuk semua teks, lencana, label butang, mesej ralat, dan perbualan AI.
6. **Wajib Had Kandungan Maksimum 12,000 Aksara (Strict 12,000 Characters Limit)**: Setiap fail peraturan `.agents/rules/` serta dokumen panduan WAJIB kekal di bawah had siling ketat 12,000 aksara per fail tanpa sebarang pengecualian.

---

## 1. Theme & Design Consistency (Apple HIG Standard)

- Semua reka bentuk UI, komponen, peralihan, kad, butang, modal, tipografi, dan susun atur WAJIB mematuhi piawaian rasmi **Apple Human Interface Guidelines (HIG)**:
  - **Rujukan Utama:** [02_apple_hig_design_system.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md) & [03_apple_hig_components.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/03_apple_hig_components.md).
  - **Prinsip Geometri Bulat (Strict 1:1 Circle — Zero Oval):** Elemen bulat WAJIB nisbah tepat **1:1** (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`). DILARANG SAMA SEKALI bentuk bujur/oval/lonjong. Butang berteks WAJIB mengembang kapsul mendatar (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).
  - **Bento Grid, Tipografi & Bahan Kaca:** Susun atur kad Bento seimbang squircle (`border-radius: 24px/28px`), sifar ruang mati, nombor `tabular-nums`, fizik sentuhan `scale(0.97)`, dan bahan kaca Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).
  - **Dwi-Tema:** Mod Siang (`#F5F5F7` / `#FFFFFF`) dan Mod Obsidian Malam (`#000000` True Black / `#161618` Bento).

### 1B. Penyeragaman Mutlak Bahasa Melayu Moden Kontemporari Malaysia 2026
- Seluruh antaramuka WeDRIVE tertakluk secara mutlak kepada [11_language_standards.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md).
- **Standard BM Moden (Era 2026):** 100% BM moden santai, segar, ringkas (Grab, Setel, TnG eWallet, Trevo, Wahdah, Carsome).
- **Larangan Senarai Hitam (Sifar Toleransi):** DILARANG SAMA SEKALI menggunakan kata terlarang (*Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar, Perisai Keselamatan, Gugusan Kereta*) dalam kod, teks UI, mahupun perbualan AI.

---

## 2. Git Version Control

- Setiap perubahan WAJIB ditujah (push) ke GitHub.
- Format commit message: `X.X.X Description of changes` (Wajib bermula dengan nombor versi tanpa huruf `v`).
- **Penomboran Versi FYP 2:**
  - FYP 2 disambung secara berturutan bermula dari versi **`3.0.0`** (selepas FYP 1 versi `2.9.9`).
- **Struktur Versi Semantik:** Major (`3.0.0` - rombakan modul), Minor (`3.1.0` - penambahan ciri), Patch (`3.0.1` - pembetulan bug/UI).

---

## 3. Mandatory Development Summary Logging (PLAN)

- Setiap kali sebarang perubahan kod, pembaikan isu, atau penambahan ciri baharu dilakukan, pembangun/AI WAJIB mengemas kini fail:
  `PLAN/FYP1_to_FYP2_Development_Summary.md`
- Labelkan setiap catatan perkembangan dengan jelas:
  - **`[MAJOR UPDATE]`**: Modul baharu, rombakan arkitektur, atau integrasi ciri berskala besar.
  - **`[MINOR UPDATE]`**: Pembaikan pepijat, penyeragaman komponen/CSS, atau penalaan UI.

---

## 3B. Mandatori Penyediaan Dokumen Keperluan Produk (PRD) Sebelum Pembangunan

- Sebelum memulakan sebarang tugasan pembangunan baharu, AI **WAJIB menyediakan seksyen PRD** di dalam `implementation_plan.md` merangkumi 6 komponen mandatori yang diperincikan secara berpusat dalam [13_prd_standard.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/13_prd_standard.md).
- Pembangunan kod DILARANG bermula selagi seksyen PRD tidak dilengkapkan dan diluluskan oleh pengguna.


---

## 4. Logo, Branding & Emoji Rules

- **Logo:** Ikon di kiri, teks di kanan, latar belakang telus (transparent), dan favicon WAJIB ada di setiap page.
- **Terminology:** Gunakan perkataan **"Car / Cars"** untuk semua elemen antaramuka pelanggan (jangan guna istilah "Fleet").
- **No Emoji:** JANGAN gunakan emoji dalam kod sumber, nama fail, atau teks antaramuka.

---

## 5. Automated Testing & Playwright CLI Protocol

- **Isolasi Folder Ujian:** Semua skrip ujian dan dependensi disimpan di dalam folder terasing `tests/` (Rujuk [08_playwright_testing.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/08_playwright_testing.md)).
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

## 7. Indeks & Rujukan 16 Peraturan Modul Berkaitan
- **Standard BM Moden 2026:** [11_language_standards.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md)
- **Apple HIG Design System:** [02_apple_hig_design_system.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md) & [03_apple_hig_components.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/03_apple_hig_components.md)
- **Navigation & UI/UX:** [04_navigation_and_ui.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/04_navigation_and_ui.md)
- **Kod, CSS & Backend:** [06_code_and_backend.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/06_code_and_backend.md)
- **Apple Device Support:** [05_apple_device_support.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/05_apple_device_support.md)
- **Stitch MCP & UI:** [07_stitch_design_system.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/07_stitch_design_system.md)
- **Automated Testing:** [08_playwright_testing.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/08_playwright_testing.md)
- **Keselamatan Siber:** [09_security_and_audit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/09_security_and_audit.md) & [15_strix_security_audit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/15_strix_security_audit.md)
- **Graphify & Token Optimization:** [10_graphify.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/10_graphify.md)
- **Had Siling 12,000 Aksara:** [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md)
- **Piawaian PRD 6 Pilar:** [13_prd_standard.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/13_prd_standard.md)
- **Supabase Database & RLS:** [14_supabase_database.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/14_supabase_database.md)
- **Alatan Pintar & MCP Ecosystem:** [16_ai_tooling_and_mcps.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/16_ai_tooling_and_mcps.md)

---

## 8. Had Kandungan Maksimum 12,000 Aksara (Strict 12,000 Characters Limit)

- Tertakluk secara mutlak kepada [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
- Semua fail peraturan (`.agents/rules/*.md`), panduan kemahiran, dan dokumen seni bina WAJIB dihadkan kepada maksimum **12,000 aksara** per fail. Bebas menambah sehingga 20–30 fail modular bagi mendalami peraturan.
- Sebelum selesai tugas, semak aksara menggunakan `wc -m` bagi menjamin had $\le 12,000$ dipatuhi 100%.

