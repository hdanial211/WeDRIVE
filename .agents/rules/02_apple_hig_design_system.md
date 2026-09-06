# Apple Human Interface Guidelines (HIG) Standard
## WeDRIVE Master Specification — Bahagian 1: Asas & Corak Interaksi (Pilar 1 – 3)

Standard Rujukan Mandatori Bahagian 1 untuk pembangunan UI/UX WeDRIVE.
*Nota: Komponen (Pilar 4–6) & Senarai Semak terkandung dalam [`.agents/rules/03_apple_hig_components.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/03_apple_hig_components.md).*

---

## LAMAN RUJUKAN RASMI APPLE DEVELOPER DESIGN & SUMBER FIGMA
Semua pembangunan antaramuka WeDRIVE berpandukan secara mutlak kepada ekosistem Apple Developer Design rasmi:
1. **Portal Utama Reka Bentuk Apple**: [https://developer.apple.com/design/](https://developer.apple.com/design/)
2. **Garis Panduan Antaramuka Manusia (HIG)**: [https://developer.apple.com/design/human-interface-guidelines/](https://developer.apple.com/design/human-interface-guidelines/)
3. **Sumber Reka Bentuk Rasmi & Kit Figma (Apple Design Resources)**: [https://developer.apple.com/design/resources/](https://developer.apple.com/design/resources/)
4. **Pencipta Ikon Apple (Icon Composer)**: [https://developer.apple.com/icon-composer/](https://developer.apple.com/icon-composer/)
5. **Pustaka Simbol Sistem (SF Symbols)**: [https://developer.apple.com/sf-symbols/](https://developer.apple.com/sf-symbols/)
6. **Pereka Pas Dompet (Pass Designer)**: [https://developer.apple.com/pass-designer/](https://developer.apple.com/pass-designer/)
7. **Perkembangan Terkini Reka Bentuk Apple (What's New in Design)**: [https://developer.apple.com/design/whats-new/](https://developer.apple.com/design/whats-new/)
8. **Integrasi MCP Figma Rasmi**: Menggunakan pelayan Figma MCP (`https://mcp.figma.com/mcp` / alat `#get_design_context`) untuk mengekstrak token dan konteks reka bentuk langsung daripada kit rasmi Apple.

---

## PILAR 1: GETTING STARTED & CORE PRINCIPLES

1. **Kejelasan (Clarity)**: Tipografi tajam, ikonografi SF Symbols/Material Icons Round bermakna, sifar elemen grafik mengelirukan.
2. **Keutamaan Kandungan (Deference)**: Antara muka menyokong kandungan teras (katalog kereta, status sewaan, analitik). Ruang bernafas (*whitespace*) dan bahan kaca lut sinar (*translucent materials*).
3. **Kedalaman Berlapis (Depth)**: Z-axis elevation berlapis, bayang lembut (*soft shadows*), dan sempadan sub-piksel.
4. **Sasaran Sentuhan Minimum**: Minimum **44px × 44px** untuk semua butang dan zon interaktif.
5. **Standard Korporat Sebenar (Anti-AI Clichés)**:
   - Dilarang reka bentuk murahan bertemplat AI atau istilah fiksyen (*Quantum AI*, *Supercharged Fleet*, sanitasi hospital).
   - Gunakan istilah operasi automotif tulen: Kereta/Cars, Penyewa Berdaftar, Deposit Keselamatan Escrow, Cukai JPJ, Invois Cukai.
   - Semua butang dan data WAJIB disambung ke punca data operasi sebenar (`window.WeDriveAPI`).
6. **Prinsip Geometri Bulat Sempurna 1:1 (Strict 1:1 Perfect Circle — Strictly No Oval/Bujur)**:
   - Sebarang butang atau elemen berbentuk bulat WAJIB mempunyai nisbah aspek tepat **1:1** (`width == height`, `aspect-ratio: 1 / 1 !important;`, `border-radius: 50% !important;`, `padding: 0 !important;`, `display: flex; align-items: center; justify-content: center;`).
   - **DILARANG SAMA SEKALI** herot menjadi bujur/oval/lonjong akibat padding melintang atau fleksing layout.
   - Elemen dengan teks mengembang secara mendatar menjadi kapsul (`border-radius: 9999px;`), manakala elemen ikon sahaja kekal bulatan 1:1 sempurna.

---

## PILAR 2: FOUNDATIONS (ASAS REKA BENTUK)

### 1. Tipografi Apple San Francisco
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif;
```
- **Nombor & Harga**: WAJIB `font-variant-numeric: tabular-nums`.
- **Skala Rasmi**:
  - `Large Title`: 34px–48px (W: 800, L: -0.035em)
  - `Title 1 / Title 2`: 28px / 22px (W: 800/700)
  - `Title 3 / Headline`: 18px / 16px–17px (W: 600)
  - `Body / Callout`: 15px / 14px (W: 400/500, LH: 1.5)
  - `Footnote / Caption`: 13px / 12px (W: 500/600)

### 2. Palet Warna & Mod Gelap Adaptif (Apple System Colors)
- **Mod Siang (Day Mode)**:
  - Canvas: `#F5F5F7` | Kad Permukaan: `#FFFFFF` | Sekunder: `#FBFBFD`
  - Aksen Utama: `#0071E3` (Apple Blue) | Teks: `#1D1D1F` / `#6E6E73`
  - Sempadan Sub-Piksel: `rgba(0, 0, 0, 0.06)` – `rgba(0, 0, 0, 0.12)`
- **Mod Malam (Obsidian Night Mode)**:
  - Canvas: `#000000` (Apple True Black) | Kad Bento: `#161618` / `#1D1D20`
  - Aksen Utama: `#2997FF` (Vivid Blue) | Teks: `#F5F5F7` / `#A1A1A6`
  - Sempadan Sub-Piksel: `rgba(255, 255, 255, 0.08)` – `rgba(255, 255, 255, 0.16)`
- **Semantik**: Green `#34C759` (Tersedia), Amber `#FF9500` (Proses), Red `#FF3B30` (Ralat/Batal), Purple `#AF52DE` (AI).

### 3. Bahan Kaca (Apple Materials)
```css
background: var(--bg-glass);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid var(--border-glass);
```

### 4. Fizik Pergerakan (Motion Physics)
- **Transisi Universal**: `transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);`
- **Maklum Balas Sentuhan**: `button:active, .btn-primary:active { transform: scale(0.97); }`
- **Pudar Tema**: Transisi lembut `0.35s ease`.

---

## PILAR 3: PATTERNS (CORAK INTERAKSI & STRUKTUR)

1. **Seni Bina Navigasi**: Topbar mengawal 6 modul utama; Sidebar mengawal sub-alatan kontekstual. Item aktif berlatar belakang pil biru lembut.
2. **Modal & Lembaran (Sheets)**: Desktop: Modal terapung bertingkat (radius 24px/28px). Mobile: Bottom Sheet Drawer dengan drag handle `36px × 5px` (radius 28px 28px 0 0).
3. **Pencarian Pantas**: Input padat dengan pintasan papan kekunci, carian popover, dan penyerlah `<mark>`.
4. **Pemilihan Tarikh Berpasangan (*Paired Date Range Lock*)**:
   - Tarikh Pulang terkunci (`not-allowed`, `opacity: 0.65`) sehingga Tarikh Ambil dipilih.
   - Terbuka automatik sebaik Tarikh Ambil dipilih; tiada sekatan tarikh lampau untuk tempahan baharu.
   - Jambatan julat: Kapsul permulaan biru, jambatan lut sinar, kapsul penamat biru.
5. **Maklum Balas Ralat**: Goncangan bentuk pil (*pill shake* `border-radius: 9999px`) dan denyutan pada medan sasaran.
6. **Standard Reka Bentuk Apple Developer Bento Grid & Sifar Ruang Kosong (Zero Dead Space)**:
   - **Kemas, Teratur & Berfungsi Penuh:** Setiap susun atur halaman WAJIB berpandukan hierarki dan ketelitian reka bentuk Apple Developer Design.
   - **Zero Dead Space (Tiada Ruang Kosong Terbuang):** Setiap kad Bento WAJIB diseimbangkan ketinggiannya. DILARANG SAMA SEKALI wujud lompang hitam atau ruang kosong gergasi.
   - **Ritma Spacing 24px Konsisten:** `gap: 24px`, `padding: 24px`, kad squircle `border-radius: 24px` (atau `28px` untuk modal/kad hero), input `border-radius: 14px`.

