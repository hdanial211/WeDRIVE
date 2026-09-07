---
trigger: always_on
---

# WeDRIVE Core Project Rules

## 0. Mandatory Pre-Coding & Gatekeeper Protocol (Syarat Mutlak Setiap Sesi & Pengekodan)

Setiap kali sesi bermula atau arahan (prompt) diterima, ejen AI **WAJIB** mematuhi protokol gatekeeper berikut secara berturutan sebelum menulis atau mengubah sebarang fail kod:

1. **Wajib Baca Peraturan Ejen Terlebih Dahulu**: Sentiasa semak dan patuhi peraturan dalam `.agents/rules/` sebelum sebarang pengubahsuaian.
2. **Wajib Temu Duga /grill-me Dahulu**: Sekiranya terdapat arahan baharu, ketidakpastian skop, atau pilihan seni bina, AI WAJIB menjalankan sesi temu duga menggunakan alatan `ask_question` untuk menyelaraskan kehendak bersama pengguna sebelum sebarang kod disentuh.
3. **Wajib Semak Halaman Sebagai Pengguna (Check Page As User First & Post-Test)**: Sebelum dan selepas mengekod, AI WAJIB memeriksa visual dan fungsi pada tab aktif mengikut spektrum Apple 3-Peranti (MacBook 1440px $\to$ iPad 820px $\to$ iPhone 393px via `resize_page`) daripada perspektif pengguna sebenar tanpa membuka banyak tab (Rujuk [05_apple_device_support.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/05_apple_device_support.md)).
4. **Wajib Manfaatkan Ekosistem Alatan Pintar & Kemahiran WeDRIVE**:
   - Tertakluk secara mutlak kepada [16_ai_tooling_and_mcps.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/16_ai_tooling_and_mcps.md) dan [18_skills_and_workflows_protocol.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/18_skills_and_workflows_protocol.md).
   - Wajib gunakan Playwright CLI (100% Pass), Supabase MCP, Strix Security, Frontend UI, Context7, Graphify & Chrome DevTools.
5. **Wajib Patuhi Standard Bahasa Moden 2026**: Sentiasa rujuk [11_language_standards.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md) untuk semua teks antaramuka dan perbualan AI.
6. **Wajib Had Kandungan Maksimum 12,000 Aksara (Strict 12,000 Characters Limit)**: Rujuk [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md). Setiap fail peraturan `.agents/rules/*.md` WAJIB kekal $\le 12,000$ aksara.

---

## 1. Theme & Design Consistency (Apple HIG Standard)

- Semua reka bentuk UI, komponen, peralihan, kad Bento, butang, modal, dan susun atur WAJIB mematuhi piawaian rasmi **Apple HIG**:
  - **Rujukan Utama:** [02_apple_hig_design_system.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md) & [03_apple_hig_components.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/03_apple_hig_components.md).
  - **Prinsip Geometri Bulat (Strict 1:1 Circle — Zero Oval):** Elemen bulat WAJIB bulat tepat 1:1 (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`). DILARANG SAMA SEKALI bentuk bujur/lonjong. Butang berteks WAJIB kapsul pil (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).
  - **Prinsip Sifar Tindakan Bertindan (Strict Zero Duplicate Actions):** DILARANG SAMA SEKALI menyediakan 2 atau 3 elemen/butang yang menjalankan fungsi sama dalam satu halaman. Setiap fungsi WAJIB mempunyai SATU butang tindakan tunggal sahaja (Rujuk [04_navigation_and_ui.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/04_navigation_and_ui.md)).
  - **Bento Grid & Bahan Kaca:** Susun atur kad Bento squircle (`border-radius: 24px/28px`), sifar ruang mati (*Zero Dead Space*), nombor `tabular-nums`, fizik sentuhan `scale(0.97)`, dan Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).
  - **Dwi-Tema:** Mod Siang (`#F5F5F7` / `#FFFFFF`) dan Mod Obsidian Malam (`#000000` True Black / `#161618` Bento).

### 1B. Penyeragaman Mutlak Bahasa Melayu Moden Kontemporari Malaysia 2026
- Tertakluk kepada [11_language_standards.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md).
- **Larangan Senarai Hitam (Sifar Toleransi):** DILARANG SAMA SEKALI menggunakan kata terlarang (*Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar, Perisai Keselamatan, Gugusan Kereta*).

---

## 2. Git Version Control & SemVer (X.Y.Z)
- Rujuk [17_git_versioning_standard.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/17_git_versioning_standard.md).
- Semak versi terdahulu: `git describe --tags --abbrev=0`.
- Format commit: `X.Y.Z Description` (tanpa 'v'). Tag & push: `git tag X.Y.Z && git push origin main --tags`.

---

## 3. Mandatory PLAN Logging & PRD Standards
- Rujuk [13_prd_standard.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/13_prd_standard.md). Wajib sediakan PRD 6 pilar dalam `implementation_plan.md` sebelum kod ditulis.
- Rekodkan setiap perubahan dalam `PLAN/FYP1_to_FYP2_Development_Summary.md` bertanda `[MAJOR UPDATE]` atau `[MINOR UPDATE]`.

---

## 4. Branding, Playwright Testing & Graphify
- **Branding:** Logo ikon di kiri, teks di kanan, latar telus, favicon ada di semua page. Gunakan "Car / Cars" (tiada emoji).
- **Playwright CLI:** Rujuk [08_playwright_testing.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/08_playwright_testing.md). `cd tests && npx playwright test` (Wajib 100% Pass).
- **Graphify:** Rujuk [10_graphify.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/10_graphify.md). Jimat token via Graphify MCP, update selepas kod diubah (`graphify update .`).

---

## 7. Indeks & Rujukan 20 Peraturan Modul Berkaitan
- **Standard BM Moden 2026:** [11_language_standards.md](11_language_standards.md)
- **Apple HIG Design System:** [02_apple_hig_design_system.md](02_apple_hig_design_system.md) & [03_apple_hig_components.md](03_apple_hig_components.md)
- **Navigation & UI/UX:** [04_navigation_and_ui.md](04_navigation_and_ui.md)
- **Kod, CSS & Backend:** [06_code_and_backend.md](06_code_and_backend.md)
- **Apple Device Support:** [05_apple_device_support.md](05_apple_device_support.md)
- **Stitch MCP & UI:** [07_stitch_design_system.md](07_stitch_design_system.md)
- **Automated Testing:** [08_playwright_testing.md](08_playwright_testing.md)
- **Keselamatan Siber:** [09_security_and_audit.md](09_security_and_audit.md) & [15_strix_security_audit.md](15_strix_security_audit.md)
- **Graphify & Token Optimization:** [10_graphify.md](10_graphify.md)
- **Had Siling 12,000 Aksara:** [12_max_content_limit.md](12_max_content_limit.md)
- **Piawaian PRD 6 Pilar:** [13_prd_standard.md](13_prd_standard.md)
- **Supabase Database & RLS:** [14_supabase_database.md](14_supabase_database.md)
- **Alatan Pintar & MCP Ecosystem:** [16_ai_tooling_and_mcps.md](16_ai_tooling_and_mcps.md)
- **Kawalan Versi Git & SemVer:** [17_git_versioning_standard.md](17_git_versioning_standard.md)
- **Protokol Skills & Workflows:** [18_skills_and_workflows_protocol.md](18_skills_and_workflows_protocol.md)
- **Piawaian Prompt Emas & Peringatan Proaktif:** [19_prompt_engineering_standard.md](19_prompt_engineering_standard.md)
- **Peranan Pasukan Kejuruteraan Perisian:** [20_team_roles_and_responsibilities.md](20_team_roles_and_responsibilities.md)

---

## 8. Had Kandungan Maksimum 12,000 Aksara
- Rujuk [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md). Semua fail peraturan `.agents/rules/*.md` WAJIB kekal $\le 12,000$ aksara (`wc -m`). Bebas menambah fail modular bernombor baharu mengikut keperluan.
