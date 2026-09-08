---
description: Alur kerja rasmi penjanaan, pembaikan, dan integrasi antaramuka WeDRIVE menggunakan Stitch MCP bertaraf Gemini 3.8 Ultra High-Quality
---

# Alur Kerja Penjanaan UI Stitch MCP (Gemini 3.8 Ultra High-Quality Tier)

Alur kerja ini menetapkan langkah demi langkah yang mandatori bagi ejen AI dan pembangun dalam menghasilkan antaramuka baharu atau menyemak semula skrin sedia ada bagi sistem sewaan kereta korporat **WeDRIVE** menggunakan **Stitch MCP**.

---

## 💎 Fasa 0: Prinsip Kualiti & Parameter Mandatori

> **"Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)."**

Setiap panggilan alatan Stitch MCP WAJIB menggunakan spesifikasi parameter berikut:

```json
{
  "projectId": "1862124494843018493",
  "designSystem": "assets/e051cb5fe5c44d05bd007cde43ddad8e",
  "modelId": "GEMINI_3_8_FLASH",
  "deviceType": "AGNOSTIC"
}
```

* **Standard Kualiti Model:** Model generasi semasa tertinggi & terkini rasmi Google Stitch MCP ialah **`GEMINI_3_8_FLASH`**.
* **Universal 3-Peranti Apple:** Parameter `deviceType` WAJIB dihantar sebagai `"AGNOSTIC"` supaya hasil reka bentuk merangkumi ketiga-tiga spektrum peranti Apple serentak: MacBook (1440px), iPad (820px), dan iPhone (393px).

---

## 📝 Fasa 1: Pembinaan Prompt Berpandukan Master Prompt Architecture 7-Blok

Sebelum memanggil alatan `generate_screen_from_text`, prompt WAJIB mengikut struktur 7-blok konsisten:

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

## 🚀 5 Fasa Mandatori Kitaran Penjanaan & Integrasi UI (STITCH UI PREVIEW Protocol)

Setiap kali skrin baharu dicipta atau skrin sedia ada direka semula menggunakan Stitch MCP, aliran kerja WAJIB mematuhi 5 fasa berikut secara berturutan:

### 1. Fasa 1: Penjanaan atau Rekaan Semula Skrin (Stitch MCP Generation)
- Bina prompt berpandukan Apple HIG, istilah mobiliti sebenar, dan token `.agents/DESIGN.md`.
- Hantar panggilan ke `generate_screen_from_text` dengan `projectId: "1862124494843018493"`, `designSystem: "assets/e051cb5fe5c44d05bd007cde43ddad8e"`, `modelId: "GEMINI_3_8_FLASH"`, dan `deviceType: "AGNOSTIC"`.
- Jika berlaku batas masa (*timeout*), jangan cuba semula tergesa-gesa; gunakan `get_screen` berselang 30 saat sehingga 10 kali.

### 2. Fasa 2: Enjin Kualiti Pasca-Prompt & Penalaan Pembedahan (Post-Prompt Quality Engine)
- **Pengambilan Kod & Visual Mentah (`get_screen`):**
  - Muat turun kod HTML dan tangkapan skrin (`.png`) terus daripada Stitch ke folder sandbox:
    ```bash
    STITCH UI PREVIEW/
    ├── <nama_halaman>_preview.html
    └── <nama_halaman>_screenshot.png
    ```
- **Pemeriksaan Geometri & Zero Oval Rule:**
  - AI menyemak kod yang dijana secara automatik. Jika ada butang bulat dikesan bujur/lonjong, atau terdapat butang bertindan:
  - **Pembedahan AI Pantas (`edit_screens`):** Jalankan `edit_screens` dengan prompt pembedahan spesifik untuk membaiki elemen tanpa menjana semula keseluruhan skrin.
  - **Penerokaan Variasi Halus (`generate_variants`):** Sekiranya memerlukan variasi susun atur kad alternatif, gunakan `generate_variants` dengan tetapan ketat `creativeRange: "REFINE"` dan `aspects: ["LAYOUT"]`.
  - **Penguatkuasaan Tema (`apply_design_system`):** Gunakan aset `assets/e051cb5fe5c44d05bd007cde43ddad8e` untuk mengunci warna, font, dan corner radius.
- **AMARAN KERAS:** DILARANG SAMA SEKALI mengubah, menimpa, atau menyentuh fail pengeluaran sebenar di `admin/`, `customer/`, atau `shared/` pada tahap ini.

### 3. Fasa 3: Semakan Kendiri Pengguna Melalui HTML & Kelulusan Eksplisit (User Gatekeeper)
- AI membentangkan pautan klik terus kepada pengguna untuk membuka fail HTML pratonton dalam pelayar.
- Pengguna memeriksa susun atur, aliran, responsif, dan estetika.
- **AI WAJIB MENUNGGU KELULUSAN EKSPLISIT PENGGUNA** sebelum sebarang kod pengeluaran disentuh.
- Jika pengguna meminta pindaan, lakukan semakan bertumpu melalui `edit_screens` atau prompt baharu dan muat turun semula ke `STITCH UI PREVIEW/` untuk semakan pusingan seterusnya.

### 4. Fasa 4: Pemisahan Modular Kod & Integrasi Pengeluaran Sebenar
- Sebaik sahaja pengguna meluluskan:
  - **HTML:** Pindahkan struktur bersih ke fail `.html` sasaran (contoh: `admin/pages/car/add-car.html`).
  - **CSS:** Asingkan gaya ke dalam `shared/css/wedrive.css` atau `admin/css/admin.css`. Sifar blok `<style>` inline yang besar.
  - **JS:** Pindahkan logik interaktif ke fail modul JS (contoh: `admin/js/add-car.js`). Sambungkan ke data sebenar `window.WeDriveAPI` & Supabase.
  - Saring dan buang sebarang istilah cereka murah (*cheesy AI clichés*) sebelum commit.

### 5. Fasa 5: Pembersihan Penuh Folder Sandbox & Ujian Pasca Integrasi
- Setelah integrasi siap dan disahkan:
  - Padam dan bersihkan semua fail di dalam folder `STITCH UI PREVIEW/` (`rm STITCH UI PREVIEW/*`).
  - Jalankan ujian Playwright:
    ```bash
    cd tests && npx playwright test
    ```
  - Pastikan kelulusan **100% Pass Rate**.
  - Kemas kini Graphify (`graphify update .`), rekod log `PLAN/`, dan lakukan commit Git SemVer.

