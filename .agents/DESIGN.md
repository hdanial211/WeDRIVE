---
name: WeDRIVE Lumina & Apple HIG Precision
colors:
  surface: '#F5F5F7'
  surface-dim: '#E5E5EA'
  surface-bright: '#FFFFFF'
  surface-container-lowest: '#FFFFFF'
  surface-container-low: '#FBFBFD'
  surface-container: '#F2F2F7'
  surface-container-high: '#E5E5EA'
  surface-container-highest: '#D1D1D6'
  on-surface: '#1D1D1F'
  on-surface-variant: '#6E6E73'
  inverse-surface: '#000000'
  inverse-on-surface: '#F5F5F7'
  outline: 'rgba(0, 0, 0, 0.08)'
  outline-variant: 'rgba(0, 0, 0, 0.04)'
  surface-tint: '#0071E3'
  primary: '#0071E3'
  on-primary: '#FFFFFF'
  primary-container: '#E1F0FF'
  on-primary-container: '#004085'
  inverse-primary: '#2997FF'
  secondary: '#86868B'
  on-secondary: '#FFFFFF'
  secondary-container: '#E8E8ED'
  on-secondary-container: '#1D1D1F'
  tertiary: '#5856D6'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#EFEBFF'
  on-tertiary-container: '#2C2A85'
  error: '#FF3B30'
  on-error: '#FFFFFF'
  error-container: '#FFECEB'
  on-error-container: '#991B1B'
  success: '#34C759'
  warning: '#FF9500'
  muted-surface: '#F2F2F7'
  border-hairline: 'rgba(0, 0, 0, 0.06)'
  night-surface: '#000000'
  night-bento: '#161618'
  night-bento-subtle: '#1D1D20'
  night-border: 'rgba(255, 255, 255, 0.08)'
typography:
  large-title:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif
    fontSize: 34px
    fontWeight: '800'
    lineHeight: 41px
    letterSpacing: -0.035em
  large-title-mobile:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif
    fontSize: 26px
    fontWeight: '800'
    lineHeight: 32px
    letterSpacing: -0.03em
  title-1:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.028em
  title-2:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.022em
  title-3:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.018em
  headline:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.015em
  body:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  callout:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  footnote:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.01em
  caption:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-tabular:
    fontFamily: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", sans-serif
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    fontVariantNumeric: tabular-nums
rounded:
  sm: 8px
  DEFAULT: 12px
  md: 16px
  lg: 20px
  bento: 24px
  modal: 28px
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 20px
  xl: 24px
  xxl: 32px
  container-padding: 24px
  gutter: 16px
---

# WeDRIVE Lumina & Apple Human Interface Guidelines (HIG) Design System

## 1. Brand Philosophy & Aesthetics
Sistem WeDRIVE memancarkan aura kecekapan korporat bertaraf antarabangsa setanding perisian Linear, Stripe, dan ekosistem Apple. 
- **Bukan Templat AI Murahan**: Dilarang meletakkan visual murah atau istilah cereka seperti 'Quantum Neural Fleet' atau protokol hospital palsu. Semua teks dan metrik mewakili operasi mobiliti sebenar: Armada Kereta, Penyewa Berdaftar, Deposit Keselamatan, Cukai JPJ, dan Invois Cukai.
- **Kedalaman Kaca & Sempadan Sub-Piksel**: Menggunakan bahan nipis Apple Glassmorphism (`backdrop-filter: blur(20px) saturate(180%)`), bayang-bayang lembut (`box-shadow: 0 4px 24px rgba(0,0,0,0.04)`), dan sempadan sub-piksel `rgba(0,0,0,0.06)` (Day) atau `rgba(255,255,255,0.08)` (Night).

## 2. Geometri & Susun Atur Bento
1. **Kad Squircle 24px/28px**: Semua bekas kad bento utama menggunakan radius `24px` (kad skrin) dan `28px` (modal / lembaran helaian).
2. **Kapsul & Pil 9999px**: Butang tindakan utama, suis filter chip, dan lencana status menggunakan kapsul penuh `9999px`.
3. **Butang Ikon Bulat 1:1 Sempurna**: Butang tanpa teks (cth: butang suis tema, butang pangkah modal) WAJIB berbentuk bulatan 1:1 sempurna (`aspect-ratio: 1/1; border-radius: 50%`).

## 3. Tipografi Tabular & Angka
- Semua nombor harga (RM), tarikh, plat pendaftaran, dan kiraan masa WAJIB menggunakan `font-variant-numeric: tabular-nums` agar sejajar secara menegak tanpa goyangan visual (*jitter*).

## 4. Fizik Pergerakan Apple
- Transisi: `cubic-bezier(0.16, 1, 0.3, 1)`.
- Maklum balas taktil: `:active { transform: scale(0.97); }`.

## 5. Integrasi Stitch MCP & Ultra High-Quality Tier (Piawaian Gemini 3.8)
- **Prinsip Teras: Kualiti Menyeluruh Mengatasi Kepantasan (*Quality Over Speed*)**:
  - *Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)*.
  - Dilarang menggunakan model ringan/Flash untuk penjanaan antaramuka.
- **Konfigurasi Stitch MCP**:
  - `projectId`: `1862124494843018493`
  - `designSystem`: `assets/d66115a696e44b2381ec5f5d829e8a88` / `assets/40090a9886c4444abca795c82673f4c8` / `assets/518f31ad774f458da15c7fc5ff999bbf`
  - `modelId`: **`GEMINI_3_1_PRO`** (Piawaian Gemini 3.8 Ultra High-Quality Tier; model `GEMINI_3_PRO` telah ditamatkan/deprecated)
- **Penyelarasan Kod Fizikal & Integriti Data**:
  - Semua kod CSS yang dijana daripada Stitch WAJIB diselaraskan secara berpusat ke dalam `shared/css/wedrive.css`.
  - Semua medan dan butang tindakan WAJIB disambung terus ke punca data operasi sebenar (`window.WeDriveAPI` / Supabase).

## 6. Laman Rujukan Rasmi Apple Developer Design & Sumber Figma MCP
Setiap perincian sistem reka bentuk WeDRIVE berpaksikan sumber rasmi Apple:
1. **Apple Developer Design Portal**: [https://developer.apple.com/design/](https://developer.apple.com/design/)
2. **Human Interface Guidelines (HIG)**: [https://developer.apple.com/design/human-interface-guidelines/](https://developer.apple.com/design/human-interface-guidelines/)
3. **Apple Design Resources & Official Figma Kits**: [https://developer.apple.com/design/resources/](https://developer.apple.com/design/resources/)
4. **Apple Icon Composer**: [https://developer.apple.com/icon-composer/](https://developer.apple.com/icon-composer/)
5. **SF Symbols Library**: [https://developer.apple.com/sf-symbols/](https://developer.apple.com/sf-symbols/)
6. **Apple Pass Designer**: [https://developer.apple.com/pass-designer/](https://developer.apple.com/pass-designer/)
7. **What's New in Design**: [https://developer.apple.com/design/whats-new/](https://developer.apple.com/design/whats-new/)
8. **Figma MCP Server (`https://mcp.figma.com/mcp`)**:
   Konfigurasi pelayan MCP Figma untuk alatan `#get_design_context`:
   ```json
   {
     "servers": {
       "Figma": {
         "type": "http",
         "url": "https://mcp.figma.com/mcp"
       }
     }
   }
   ```

