---
trigger: always_on
---

# WeDRIVE Core Project Rules

## 1. Theme & Design Consistency (Apple HIG Standard)

- Semua reka bentuk UI, komponen, peralihan, kad, butang, modal, tipografi, dan susun atur WAJIB mematuhi piawaian rasmi **Apple Human Interface Guidelines (HIG)**:
  - **Rujukan Utama:** [`.agents/rules/apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_hig_design_system.md).
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
- **Kod, CSS & Backend Architecture:** [`.agents/rules/code_and_backend.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/code_and_backend.md)
- **Apple Device Support:** [`.agents/rules/apple_device_support.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_device_support.md)
