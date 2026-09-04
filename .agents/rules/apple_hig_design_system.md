---
trigger: always_on
---

# Apple Human Interface Guidelines (HIG) & Design System Standard
## WeDRIVE Master Specification — Bahagian 1: Asas & Corak Interaksi (Pilar 1 – 3)

Dokumen ini adalah **Standard Rujukan Mutlak & Panduan Mandatori (Bahagian 1)** bagi pembangunan dan penyempurnaan seluruh sistem **WeDRIVE**. Setiap kali ciri baharu, halaman, komponen, animasi, atau antara muka dibina atau diubah suai, pembangun/ejen WAJIB merujuk dan mematuhi spesifikasi di bawah.

*Nota: Komponen, Input, Teknologi & Senarai Semak Audit terkandung dalam [`.agents/rules/apple_hig_components.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_hig_components.md).*

Rujukan Rasmi Apple Developer HIG:
1. **Getting Started**: [https://developer.apple.com/design/human-interface-guidelines/getting-started](https://developer.apple.com/design/human-interface-guidelines/getting-started)
2. **Foundations**: [https://developer.apple.com/design/human-interface-guidelines/foundations](https://developer.apple.com/design/human-interface-guidelines/foundations)
3. **Patterns**: [https://developer.apple.com/design/human-interface-guidelines/patterns](https://developer.apple.com/design/human-interface-guidelines/patterns)
4. **Components**: [https://developer.apple.com/design/human-interface-guidelines/components](https://developer.apple.com/design/human-interface-guidelines/components)
5. **Inputs & Interactions**: [https://developer.apple.com/design/human-interface-guidelines/inputs](https://developer.apple.com/design/human-interface-guidelines/inputs)
6. **Technologies**: [https://developer.apple.com/design/human-interface-guidelines/technologies](https://developer.apple.com/design/human-interface-guidelines/technologies)

---

## 🏛️ PILAR 1: GETTING STARTED & CORE PRINCIPLES

Setiap halaman dan elemen visual WAJIB menegakkan 3 Prinsip Utama Apple:
1. **Kejelasan (Clarity)**:
   - Teks tajam, hierarki tipografi mudah dibaca serta-merta pada setiap jarak penglihatan.
   - Ikonografi tepat dan bermakna (SF Symbols style / Material Icons Round).
   - Tiada elemen grafik berlebihan yang mengganggu atau mengelirukan tumpuan pengguna.
2. **Keutamaan Kandungan (Deference)**:
   - Antara muka menyokong dan menonjolkan kandungan utama (kereta, status tempahan, data analitik), bukan bersaing dengannya.
   - Menggunakan ruang negatif (*whitespace*) yang mencukupi untuk membolehkan reka letak "bernafas".
   - Menggunakan bahan lut sinar (*translucent materials*) untuk mengekalkan kesedaran konteks lapisan di bawahnya.
3. **Kedalaman Berlapis (Depth)**:
   - Hierarki visual berbilang lapisan (*Z-axis elevation*) yang konsisten.
   - Menggunakan permukaan primer, sekunder, tersier, bahan kaca (*Apple Thin Glassmorphism*), dan bayang-bayang lembut yang tidak bertompok (*diffuse soft shadows*).
4. **Sasaran Sentuhan Minimum (Minimum Touch Target)**:
   - Semua butang, ikon boleh tekan, dan medan input WAJIB mempunyai sasaran sentuh sekurang-kurangnya **44px × 44px**.
5. **Keaslian Korporat & Larangan Reka Bentuk 'Terlalu AI' (*Authentic Enterprise Standard vs AI Clichés*)**:
   - **DILARANG SAMA SEKALI** membina antara muka yang kelihatan seperti templat AI generik, murah, atau olok-olok.
   - **Tiada 'AI Buzzwords' Kosong**: Dilarang meletakkan lencana atau teks seperti "Quantum AI", "Supercharged Fleet", atau protokol sanitasi hospital yang tidak berkaitan dengan perniagaan kereta sewa.
   - **Perisian Korporat Sebenar (Linear & Stripe Standard)**: Reka letak, kad Bento, jadual, dan butang WAJIB memancarkan kualiti perisian korporat rasmi dengan istilah perniagaan automotif tulen (Kenderaan, Penyewa, Deposit Keselamatan, Invois Cukai, Pengesahan JPJ, Protokol Kunci).
   - **Kefungsian Data Sebenar**: Tiada metrik atau graf palsu semata-mata hiasan; semua data mesti disambung ke sumber operasi sebenar (`window.WeDriveAPI`).

---

## 🎨 PILAR 2: FOUNDATIONS (ASAS REKA BENTUK)

### 1. Tipografi & Skala San Francisco (SF Typography Hierarchy)
Susunan fon universal:
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", "Inter", sans-serif;
```
- **Nombor & Harga**: Gunakan `font-variant-numeric: tabular-nums` untuk perataan angka yang kemas.
- **Skala Rasmi Apple**:
  - `Large Title`: `34px – 48px` (Weight: 800, Letter-spacing: `-0.035em`)
  - `Title 1`: `28px – 32px` (Weight: 800, Letter-spacing: `-0.028em`)
  - `Title 2`: `22px – 24px` (Weight: 700, Letter-spacing: `-0.022em`)
  - `Title 3`: `18px – 20px` (Weight: 600, Letter-spacing: `-0.018em`)
  - `Headline`: `16px – 17px` (Weight: 600, Letter-spacing: `-0.015em`)
  - `Body`: `15px – 17px` (Weight: 400, Line-height: 1.5, Letter-spacing: `0em`)
  - `Callout / Subhead`: `14px – 15px` (Weight: 500, Letter-spacing: `0em`)
  - `Footnote`: `13px` (Weight: 500, Letter-spacing: `+0.01em`)
  - `Caption / Badges`: `11px – 12px` (Weight: 600, Letter-spacing: `+0.04em`, Uppercase)

### 2. Palet Warna & Mod Gelap Adaptif (Apple System Colors)
- **Mod Siang (Day Mode)**:
  - Latar Belakang: `#F5F5F7` (Apple Canvas Gray)
  - Kad Permukaan Primer: `#FFFFFF`
  - Kad Sekunder / Tersier: `#FBFBFD` / `#F0F0F3`
  - Aksen Utama: `#0071E3` (Apple Blue)
  - Teks Primer / Sekunder / Muted: `#1D1D1F` / `#6E6E73` / `#86868B`
  - Sempadan Sub-Piksel: `rgba(0, 0, 0, 0.06)` – `rgba(0, 0, 0, 0.12)`
- **Mod Malam (Deep Space Obsidian Night Mode)**:
  - Latar Belakang: `#000000` (Apple Pure True Black)
  - Kad Permukaan Primer: `#161618` (Obsidian Squircle)
  - Kad Sekunder / Tersier: `#1D1D20` / `#262629`
  - Aksen Utama: `#2997FF` (Apple Pro Vivid Blue)
  - Teks Primer / Sekunder / Muted: `#F5F5F7` / `#A1A1A6` / `#6E6E73`
  - Sempadan Sub-Piksel: `rgba(255, 255, 255, 0.08)` – `rgba(255, 255, 255, 0.16)`
- **Warna Semantik Sistem Apple**:
  - Green (Kejayaan/Tersedia): `#34C759`
  - Orange/Amber (Perhatian/Sedang Diproses): `#FF9500`
  - Red (Ralat/Amaran/Batal/Log Keluar): `#FF3B30`
  - Purple/Indigo (Kecerdasan AI): `#AF52DE` / `#5856D6`
  - Teal (Navigasi/Maklumat Tambahan): `#30B0C7`

### 3. Bahan Kaca & Ketelusan (Apple Materials & Vibrancy)
Gunakan efek kaca Apple (*Thin Material Glassmorphism*) pada bar atas, bar carian, dan dialog:
```css
background: var(--bg-glass);
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid var(--border-glass);
```

### 4. Fizik Pergerakan & Transisi Spring (Apple Motion Physics)
- **Formula Transisi Spring Universal**:
  ```css
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  ```
- **Maklum Balas Sentuhan Taktil (*Tactile Press*)**:
  ```css
  button:active, .btn-primary:active, .card-interactive:active {
    transform: scale(0.97);
  }
  ```
- **Animasi Pudar Tema Lembut**: Pertukaran mod gelap/siang mesti mempunyai transisi pudar `0.35s ease`.

---

## 🧩 PILAR 3: PATTERNS (CORAK INTERAKSI & STRUKTUR)

1. **Struktur Navigasi (*Navigation Architecture*)**:
   - Sidebar kiri melengkung bento (`border-radius: 24px`) dengan item aktif berlatar belakang pil biru lembut.
   - Bar utiliti atas terapung lut sinar (*sticky glass navbar*).
   - Penunjuk jejak (*Breadcrumbs*) kemas dengan pemisah ikon `chevron_right`.
2. **Persembahan Modal & Lembaran (*Sheets & Modals*)**:
   - Desktop: Modal tengah terapung bertingkat dengan bucu melengkung `24px` atau `28px`.
   - Mobile: Lembaran bawah (*Bottom Sheet Drawer*) dengan pemegang tarik (*drag handle* `36px × 5px`) dan bucu atas melengkung `28px 28px 0 0`.
3. **Pencarian & Penapisan Pantas (*Search & Filter Flows*)**:
   - Bar carian kompak dengan pintasan papan kekunci, carian popover terapung, dan penyerlah kata kunci (`<mark>`).
4. **Pemilihan Tarikh Berpasangan (*Paired Date Range Lock & Flow*)**:
   - **Kunci Awal (*Lock First*)**: Tarikh Pulang terkunci (`not-allowed`, `opacity: 0.65`) sehingga Tarikh Ambil dipilih.
   - **Buka Kunci (*Unlocked*)**: Sebaik sahaja Tarikh Ambil dipilih, Tarikh Pulang terbuka secara automatik dan bebas dipilih atau diubah semula bila-bila masa.
   - **Jambatan Julat Kalendar (*Range Capsule Bridge*)**: Kapsul biru permulaan, jambatan biru muda lut sinar, dan kapsul biru penamat.
   - **Sekatan Tarikh Lampau**: Tiada tarikh sebelum hari ini boleh dipilih bagi tempahan masa hadapan.
5. **Maklum Balas Ralat & Bentuk Pil (*Pill Shake & Tactile Feedback*)**:
   - Ralat mencetuskan goncangan bentuk pil melengkung (`border-radius: 9999px`) dan denyutan pada medan sasaran yang memerlukan input.
   - Getaran taktil disokong (`navigator.vibrate([30, 50, 30])`).
