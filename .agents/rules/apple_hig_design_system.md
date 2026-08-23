---
trigger: always_on
---

# Apple Human Interface Guidelines (HIG) & Design System Standard

Dokumen ini menetapkan standard reka bentuk rasmi **Apple Human Interface Guidelines (HIG)** dan **Apple Design Resources** sebagai panduan mandatori bagi semua halaman, komponen, interaksi, peralihan, dan tipografi di dalam sistem **WeDRIVE**.

Rujukan Rasmi:
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Apple HIG Getting Started](https://developer.apple.com/design/human-interface-guidelines/getting-started)
- [Apple Design Resources](https://developer.apple.com/design/resources/)

---

## 1. Tiga Prinsip Utama Apple HIG (Core Principles)

Setiap antara muka yang dibina atau diubahsuai WAJIB berpandukan tiga tunjang asas Apple:

1. **Kejelasan (Clarity):**
   - Teks tajam dan mudah dibaca pada setiap saiz skrin.
   - Ikonografi tepat, bersahaja, dan mempunyai makna yang jelas (berasaskan gaya SF Symbols / Material Icons Round).
   - Hiasan grafik tidak boleh mengaburkan atau mengalihkan tumpuan daripada kandungan utama.
2. **Keutamaan Kandungan (Deference):**
   - Antara muka bersifat minimalis dan menyokong kandungan, bukan bersaing dengannya.
   - Menggunakan ruang negatif (*whitespace*) yang mencukupi untuk membolehkan kandungan "bernafas".
   - Menggunakan bahan lut sinar (*translucent materials*) yang membolehkan pengguna kekal sedar tentang konteks lapisan di belakangnya.
3. **Kedalaman Berlapis (Depth):**
   - Menyediakan hierarki visual berlapis secara realistik (*Z-axis elevation*).
   - Menggunakan lapisan permukaan (*Primary, Secondary, Tertiary surfaces*), bahan kaca (*Apple Thin Material Glassmorphism*), dan bayang-bayang lembut (*soft shadows*).

---

## 2. Tipografi & Skala Teks (Apple San Francisco Hierarchy)

Gunakan susunan fon Apple yang seragam:
```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "SF Pro", "Inter", sans-serif;
```

### Skala Hierarki Tipografi Apple:
| Peranan | Saiz Anggaran | Berat (Weight) | Tracking (Letter Spacing) | Kegunaan |
| :--- | :--- | :--- | :--- | :--- |
| **Large Title** | `34px – 48px` (`clamp`) | 800 (Bold / Heavy) | `-0.035em` | Tajuk utama halaman hero |
| **Title 1** | `28px – 32px` | 800 (Bold) | `-0.028em` | Tajuk seksyen utama |
| **Title 2** | `22px – 24px` | 700 (Bold) | `-0.022em` | Tajuk kad Bento / modal |
| **Title 3** | `18px – 20px` | 600 (Semibold) | `-0.018em` | Tajuk sub-seksyen |
| **Headline** | `16px – 17px` | 600 (Semibold) | `-0.015em` | Label penting & tajuk butang |
| **Body** | `15px – 17px` | 400 (Regular) | `0em` | Perenggan & penerangan |
| **Callout / Subhead** | `14px – 15px` | 500 (Medium) | `0em` | Penerangan ringkas & kad teks |
| **Footnote** | `13px` | 500 (Medium) | `+0.01em` | Metadata & nota kaki |
| **Caption 1 / 2** | `11px – 12px` | 600 (Semibold) | `+0.04em` (Uppercase) | Lencana (*badges*), cip kategori, tag |

---

## 3. Palet Warna & Semantik Mod Gelap/Siang (Apple System Colors)

Gunakan token warna sistem Apple yang adaptif:

### Mod Siang (Day Mode):
- **Kanvas Latar Belakang:** `#F5F5F7` (Apple Neutral Canvas Gray)
- **Permukaan Kad Primer:** `#FFFFFF`
- **Permukaan Sekunder / Tersier:** `#FBFBFD` / `#F0F0F3`
- **Warna Aksen Utama (Apple Blue):** `#0071E3` (Hover: `#0077ED`, Active: `#005BB5`)
- **Teks Primer / Sekunder / Muted:** `#1D1D1F` / `#6E6E73` / `#86868B`
- **Sempadan Sub-Piksel:** `rgba(0, 0, 0, 0.06)` hingga `rgba(0, 0, 0, 0.12)`

### Mod Malam (Night Mode / Deep Space Obsidian):
- **Kanvas Latar Belakang:** `#000000` (Apple Pure True Black)
- **Permukaan Kad Primer:** `#161618` (Bento Squircle Surface)
- **Permukaan Sekunder / Tersier:** `#1D1D20` / `#262629`
- **Warna Aksen Utama (Apple Pro Blue):** `#2997FF` (Hover: `#47A7FF`, Active: `#147CE5`)
- **Teks Primer / Sekunder / Muted:** `#F5F5F7` / `#A1A1A6` / `#6E6E73`
- **Sempadan Sub-Piksel:** `rgba(255, 255, 255, 0.08)` hingga `rgba(255, 255, 255, 0.16)`

### Warna Semantik Sistem Apple:
- **System Green (Kejayaan/Tersedia):** `#34C759`
- **System Orange / Amber (Amaran/Perhatian):** `#FF9500`
- **System Red (Kecemasan/Padam/Log Keluar):** `#FF3B30`
- **System Purple / Indigo (Kecerdasan AI):** `#AF52DE` / `#5856D6`
- **System Teal (Interaktif/Navigasi):** `#30B0C7`

---

## 4. Bahan Kaca & Lut Sinar (Apple Materials & Vibrancy)

Semua bar navigasi atas, menu terapung, dan panel dialog WAJIB menggunakan bahan kaca Apple (*Thin Material Glassmorphism*):
```css
background: var(--bg-glass); /* rgba(255,255,255,0.82) atau rgba(22,22,24,0.82) */
backdrop-filter: blur(20px) saturate(180%);
-webkit-backdrop-filter: blur(20px) saturate(180%);
border: 1px solid var(--border-glass);
```

---

## 5. Geometri Bento & Sudut Squircle (Continuous Curves)

Apple menggunakan keluk squircle berterusan (*continuous curvature*) untuk semua bentuk geometri:

- **Kad Bento & Modal Dialog:** `border-radius: 24px` atau `28px`
- **Kotak Input, Form Fields & Kad Kecil:** `border-radius: 12px` atau `14px`
- **Butang Tindakan, Lencana, & Penunjuk Kapsul:** `border-radius: 9999px` (Pill / Capsule)

---

## 6. Fizik Pergerakan, Spring & Interaksi Taktil (Motion & Tactility)

1. **Formula Transisi Spring Apple:**
   ```css
   transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
   ```
2. **Maklum Balas Sentuhan Taktil (Tactile Press Response):**
   Setiap butang dan elemen interaktif mesti mengecil sedikit secara lembut apabila ditekan:
   ```css
   button:active, .btn-primary:active, .card-interactive:active {
     transform: scale(0.97);
   }
   ```
3. **Indikator Karusel Kapsul Melebar (Expanding Capsule Pills):**
   - Titik tidak aktif: Bulat kecil `7px × 7px` dengan warna kelabu pudar.
   - Titik aktif: Melebar secara dinamik menjadi kapsul `22px × 7px` dengan warna Apple Blue dan pencahayaan lembut (*soft glow*).
4. **Peralihan Lembut (Zero Jarring Shifts):**
   Semua pertukaran mod tema (Siang/Malam) dan penukaran bahasa mesti berlaku dengan peralihan pudar lembut (`transition: background-color 0.35s ease, color 0.35s ease`).

---

## 7. Komponen Antara Muka Khusus (Apple Components)

1. **Apple Segmented Controls:**
   - Bekas kapsul kelabu dengan butang gelangsar aktif putih/biru untuk pertukaran tab atau penapis pantas.
2. **Apple Bento Grid:**
   - Susun atur kad bermaklumat padat dengan sempadan sub-piksel, pencahayaan aksen lembut, dan kedudukan elemen yang seimbang.
3. **Floating AI Assistant & Action Pills:**
   - Butang kapsul terapung dengan bayang-bayang kaca (*glass shadow*) dan lencana notifikasi merah Apple.
4. **Medan Input dengan Cincin Fokus (Focus Halo):**
   - Apabila aktif/fokus, medan input mempunyai cincin cahaya biru Apple Pro `box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.18); border-color: var(--primary);`.

---

## 8. Prinsip Pelaksanaan Kod

- **Satu Fail CSS Global Master:** Segala pengubahsuaian gaya WAJIB dilakukan di dalam `shared/css/wedrive.css`.
- **Semua Peranti Apple:** Pastikan responsif pada MacBook (M1-M4), iPad, iPhone 15/16 (Dynamic Island Safe Area), dan iPhone 14 ke bawah.
- **Tiada Emoji:** Kekalkan ikonografi vektor berasaskan Material Icons Round / SVG.
