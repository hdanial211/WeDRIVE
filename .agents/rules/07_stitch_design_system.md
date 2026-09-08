# Stitch MCP & Ultra High-Fidelity UI Generation Standards (WeDRIVE)

Dokumen ini menggariskan piawaian mandatori bagi penggunaan **Stitch MCP** untuk penjanaan, penyemakan semula, dan penyeragaman antaramuka sistem **WeDRIVE** mengikut piawaian kualiti tertinggi Apple Human Interface Guidelines (HIG).

---

## PRINSIP TERAS: KUALITI MENYELURUH MENGATASI KEPANTASAN (QUALITY OVER SPEED)

> **"Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)."**

1. **Keutamaan Kualiti & Perincian Maksimum**:
   - Dilarang sama sekali mengejar kepantasan dengan mengorbankan ketelitian seni bina antaramuka.
   - Setiap elemen mesti menyerupai perisian korporat rasmi (Linear, Stripe, Apple Developer) dengan istilah automotif sebenar, kad Bento squircle (24px/28px), nombor tabular (`tabular-nums`), dan bahan kaca berkualiti tinggi.
2. **Larangan Model Usang (Deprecated Models Ban)**:
   - Dilarang sama sekali menggunakan model lama yang telah ditamatkan oleh Google.
3. **Piawaian Model Kualiti Tertinggi (Gemini 3.8 Active Tier - `GEMINI_3_8_FLASH`)**:
   - Generasi reka bentuk WeDRIVE diselaraskan kepada **`GEMINI_3_8_FLASH`** (Model generasi 3.8 tertinggi & terkini rasmi Google Stitch MCP). Pemanggilan alatan Stitch WAJIB menggunakan `modelId: "GEMINI_3_8_FLASH"`.

---

## 1. Konfigurasi Projek & Rujukan Stitch MCP

Setiap kali alatan Stitch MCP digunakan untuk mereka bentuk skrin atau mengemas kini sistem reka bentuk:

| Parameter | Nilai Mandatori | Penerangan Rasmi |
| :--- | :--- | :--- |
| **Project ID** | `1862124494843018493` | Projek rasmi Stitch: *AI-Powered Car Rental Management* |
| **Design System** | `assets/e051cb5fe5c44d05bd007cde43ddad8e` | Sistem reka bentuk rasmi *WeDRIVE Apple HIG & Obsidian Precision* (Aset Terkini) |
| **Model Generasi (`modelId`)** | **`GEMINI_3_8_FLASH`** | **MANDATORI:** Model generasi 3.8 tertinggi & terkini rasmi Google Stitch MCP |
| **Device Type** | **`AGNOSTIC`** (Universal Responsive) | **MANDATORI:** Merangkumi ketiga-tiga spektrum peranti Apple serentak: MacBook (1440px), iPad (820px), dan iPhone (393px) |
| **Rujukan Gaya Utama** | `.agents/DESIGN.md` | Fail spesifikasi master di direktori `.agents/` |

---

## 1B. Piawaian Master Payload & Prompt Architecture (7-Blok Mandatori)

Setiap kali alatan Stitch MCP dipanggil (`generate_screen_from_text`), AI **WAJIB** menghantar Master Payload JSON dan teks prompt berpandukan 7-blok berikut:

### A. Master Parameter Payload (JSON)
```json
{
  "projectId": "1862124494843018493",
  "designSystem": "assets/e051cb5fe5c44d05bd007cde43ddad8e",
  "modelId": "GEMINI_3_8_FLASH",
  "deviceType": "AGNOSTIC",
  "prompt": "<MASTER_PROMPT_7_BLOK>"
}
```

### B. Formula Master Prompt 7-Blok Rasmi
```text
Create a universal responsive web page in contemporary Malay (Standard BM 2026) for WeDRIVE:
"{{MODUL}} - {{HALAMAN}}" featuring an ultra-premium Linear / Apple Studio floating aesthetic.

0. CORE DESIGN PHILOSOPHY & DUAL-THEME SWITCHER (STRICT):
- INTERACTIVE DUAL-THEME (DAY & NIGHT MODE): The generated page MUST support BOTH Day Mode (Apple Light #F5F5F7/#FFFFFF) and Night Mode (Dark Obsidian #000000/#161618). Include an interactive circular 1:1 theme switcher (☀️/🌙) in the top glass header with working vanilla JavaScript that smoothly toggles theme classes on document.body or html.
- FOCUSED WORKSPACE, NOT DASHBOARD: Dedicated onboarding workspace (STRICTLY ZERO PERMANENT SIDEBAR for wizards).
- SPATIAL CALM: Clean typography, comfortable spacing, sub-pixel glass definition.
- STRICT ZERO DUPLICATE ACTIONS: Single official primary action dock. Never generate duplicate "Simpan", "Simpan Draf", or duplicate "Seterusnya" buttons.
- STRICT ZERO HORIZONTAL SCROLLING: Flawless fluid layout across all resolutions.

1. FLUID RESPONSIVE SYSTEM (APPLE 3-TIER ECOSYSTEM):
- Desktop Retina (MacBook 1440px+): Content max-width 1280px–1380px, centered balanced Bento composition.
- Tablet Touch (iPad 768px–1024px): Adaptive layout, minimum 44px touch targets.
- Mobile Retina XDR (iPhone 393px): Single-column stream, form fonts minimum 16px to prevent iOS Safari auto-zoom.

2. DUAL-THEME MATERIALS, RESTRAINED GLASS & APPLE MICRO-ANIMATIONS:
- Dynamic Theme Tokens: Day Mode (base #F5F5F7, cards #FFFFFF, text #1D1D1F, border rgba(0,0,0,0.06)) vs Night Mode (base #000000, cards #161618, text #FFFFFF, border rgba(255,255,255,0.08)).
- Restrained Glassmorphism: Translucency & blur (backdrop-blur-xl) strictly reserved for floating top header, floating stepper capsule, and bottom dock. Form cards MUST remain solid/opaque for 100% text readability in both modes.
- Rich Micro-Animations: Smooth CSS transition on theme switch (0.3s cubic-bezier(0.16, 1, 0.3, 1)), tactile button press scale(0.97), subtle card hover lift (translateY(-2px)), and fluid interactive widgets.
- Bottom Clearance: Body MUST include pb-[130px] padding so fixed bottom dock never covers content on mobile.

3. GEOMETRY RULES (STRICT ZERO OVAL):
- Circular icon buttons MUST be 1:1 aspect ratio (width == height, rounded-full, padding: 0, centered icon).
- Text buttons MUST be symmetric 9999px pills (rounded-full, white-space: nowrap).
- Bento cards: 24px squircle. Inputs: 12px–14px rounded corners.

4. TOP APPLICATION HEADER, THEME SWITCHER & STEPPER CAPSULE:
- Top Glass Header: WeDRIVE branding on left, circular 1:1 theme switcher (☀️/🌙), center title, right action text pill 'Batal' (rounded-full).
- Floating Stepper Capsule:
  * Completed: Green circular checkmark badge + calm text.
  * Active: Glowing blue circular badge (with subtle ambient blue shadow) + bold title.
  * Inactive: Grey circular badge + muted text. Thin hairline connector lines.

5. BENTO GRID ARCHITECTURE:
{{SENARAI_KAD_BENTO_DAN_KOMPONEN_KHAS}}
- Susunan seimbang (contoh: 8 kolum borang/media utama : 4 kolum tarif/status sisi). Nombor kewangan guna tabular-nums.

6. FLOATING BOTTOM ACTION DOCK (BALANCED FORMULA):
- Single Fixed Floating Dock at viewport bottom (rounded-full 9999px, backdrop-blur):
  * Left: Secondary action ('← Kembali ke ...') ATAU status awan 'Draf disimpan secara automatik di awan'.
  * Center (jika ada): Lencana semakan hijau 'Semua data telah disahkan dan sedia diterbitkan'.
  * Right: Single primary action pill button in solid Apple Blue (#0071E3).

7. LANGUAGE & TERMINOLOGY (CONTEMPORARY MALAY 2026):
- Strictly ban archaic words: Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar.
- Use natural SaaS terms: Kenderaan, Spesifikasi, Tarif, Ruang Pemandu, Studio Visual, Pengesahan Rasmi, Simpanan Automatik.
```

---

## 2. Protokol Masa & Kesabaran Alatan (Patience & Polling Protocol)

Penjanaan antaramuka menggunakan model generasi tertinggi Gemini 3.8 (`GEMINI_3_8_FLASH`) memproses reka letak kompleks, hierarki warna sub-piksel, dan token Apple HIG secara mendalam. Proses ini mengambil masa beberapa minit.

1. **JANGAN CUBA SEMULA SECARA TERGESA-GESA (DO NOT RETRY)**:
   - Jangan tekan atau panggil `generate_screen_from_text` kali kedua sekiranya alatan sedang berjalan atau memberi amaran batas masa (*timeout*).
2. **Pengendalian Batas Masa Rangkaian**:
   - Jika panggilan alatan tamat tempoh (*timeout*) atau mengalami ralat sambungan, proses penjanaan di pelayan Stitch selalunya **tetap berjalan dan berjaya**.
   - Gunakan kaedah `get_screen` selang **30 saat sehingga 10 kali** untuk mendapatkan skrin yang telah siap dijana di latar belakang sebelum menganggap proses gagal.

---

## 3. Protokol Mandatori 5-Langkah Kitaran Pratonton STITCH UI PREVIEW (Strict 5-Step Sandbox Protocol)

Sebelum sebarang perubahan kod pengeluaran sebenar (*real production pages*) dibenarkan berlaku, AI WAJIB mematuhi kitaran 5-langkah kitaran tertutup ini tanpa pengecualian:

```text
  [1. Jana / Reka Semula UI]
            │
            ▼
  [2. Simpan ke STITCH UI PREVIEW/] ── (Dilarang ubah kod sebenar!)
            │
            ▼
  [3. Pengguna Semak HTML Sendiri] ── (Menunggu kelulusan eksplisit pengguna)
            │
            ▼
  [4. Lulus: Asingkan HTML/CSS/JS] ── (Integrasi pangkalan data Supabase)
            │
            ▼
  [5. Bersihkan STITCH UI PREVIEW/] ── (Dikosongkan selepas ujian lulus 100%)
```

### Huraian Terperinci 5 Fasa Mandatori:

1. **Langkah 1: Jana Halaman Baharu atau Reka Semula Skrin (Stitch MCP Generation)**:
   - Gunakan Stitch MCP (`generate_screen_from_text`) dengan konfigurasi rasmi (`projectId: "1862124494843018493"`, `modelId: "GEMINI_3_8_FLASH"`, `deviceType: "AGNOSTIC"`).
   - Patuhi spesifikasi reka bentuk Apple HIG dalam `.agents/DESIGN.md` dan sifar istilah murah/cereka.

2. **Langkah 2: Pengasingan Mutlak ke Sandbox `STITCH UI PREVIEW/` (Zero Direct Code Modification)**:
   - Semua fail HTML mentah dan tangkapan skrin (`.png`) daripada Stitch MCP WAJIB dimuat turun dan diletakkan ke dalam folder khas:
     ```text
     STITCH UI PREVIEW/
     ├── <nama_halaman>_preview.html
     └── <nama_halaman>_screenshot.png
     ```
   - **DILARANG SAMA SEKALI** terus menimpa (*overwrite*) atau mengubah kod di dalam `admin/pages/`, `customer/pages/`, `guest/pages/`, `shared/css/`, atau `admin/js/` pada fasa ini.

3. **Langkah 3: Semakan Kendiri Pengguna Melalui HTML & Kelulusan Eksplisit (User HTML Inspection Gatekeeper)**:
   - AI membekalkan pautan klik terus kepada pengguna untuk membuka dan memeriksa sendiri fail HTML tersebut melalui pelayar atau penyunting.
   - AI **WAJIB MENUNGGU KELULUSAN EKSPLISIT PENGGUNA** sebelum melangkah ke fasa seterusnya. Sekiranya pengguna meminta penalaan, ulangi Langkah 1 dan 2.

4. **Langkah 4: Pengasingan Modular Kod & Integrasi Pengeluaran (Code Separation & Refactoring)**:
   - Hanya SELEPAS pengguna meluluskan pratonton secara rasmi, AI dibenarkan mengasingkan dan memindahkan komponen ke struktur pengeluaran sebenar:
     - **Struktur HTML:** Disimpan sebagai fail fizikal tersendiri di direktori sasaran (contoh: `admin/pages/car/add-car.html`).
     - **Gaya CSS:** Dipisahkan dan disatukan ke dalam fail CSS modul berkaitan (`admin/css/admin.css` atau `shared/css/wedrive.css`), tanpa sebarang blok `<style>` inline yang besar.
     - **Logik JS:** Dipindahkan ke skrip modul (contoh: `admin/js/add-car.js`) dengan sambungan API sebenar (`window.WeDriveAPI`) dan pangkalan data Supabase.

5. **Langkah 5: Pembersihan Penuh Folder `STITCH UI PREVIEW/` (Post-Integration Cleanup)**:
   - Setelah integrasi siap dan disahkan lulus ujian Playwright 100%, semua fail sementara di dalam folder `STITCH UI PREVIEW/` **WAJIB dipadamkan/dibersihkan sepenuhnya** supaya folder kembali bersih dan bersedia untuk kitaran reka bentuk seterusnya.

---

## 4. Senarai Alatan Stitch MCP Rasmi

- `list_projects`: Semak projek aktif WeDRIVE.
- `get_project`: Periksa skrin sedia ada dan tema reka bentuk.
- `generate_screen_from_text`: Cipta skrin baharu dengan piawaian kualiti tertinggi Gemini 3.8 (`GEMINI_3_8_FLASH`) dan design system.
- `get_screen`: Ambil kod HTML dan pratonton tangkapan skrin hasil penjanaan.
- `edit_screens`: Buat perubahan terperinci pada skrin sedia ada secara pembedahan (*surgical polish*).
- `generate_variants`: Jana variasi alternatif halus (*creativeRange: REFINE*).
- `upload_design_md`: Muat naik `DESIGN.md` terkini ke projek Stitch.
- `create_design_system_from_design_md`: Cipta ID sistem reka bentuk baharu daripada fail `DESIGN.md`.
- `apply_design_system`: Terapkan tema konsisten kepada skrin terpilih.

---

## 5. Operasi Maksimum Pasca-Prompt (Post-Prompt Quality Engine)
- Protokol terperinci bagi pemeriksaan sifar bujur, penalaan pembedahan melalui `edit_screens`, penjanaan variasi `REFINE`, dan penguatkuasaan tema terkandung secara menyeluruh dalam [21_stitch_mcp_advanced_operations.md](21_stitch_mcp_advanced_operations.md).


