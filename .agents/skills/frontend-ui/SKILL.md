---
name: frontend-ui
description: Comprehensive frontend UI design, craft, Apple HIG styling, Bento grid layouts, micro-interactions, responsive ergonomics, and glassmorphism standards for modern web development.
---

# Front-End UI Craft & Apple HIG Engineering Skill (WeDRIVE)

Kemahiran ini membimbing pembangunan, reka bentuk, dan penalaan antaramuka bertaraf dunia berasaskan piawaian **Apple Human Interface Guidelines (HIG)** dan estetika moden perisian enterprise.

*Nota SSOT: Untuk senarai portal rasmi Apple Developer Design dan konfigurasi Figma MCP, rujuk punca kebenaran tunggal di [`.agents/rules/02_apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/02_apple_hig_design_system.md).*

---

## 1. Seni Bina Bento Grid & Sifar Ruang Kosong (Zero Dead Space)

Apple Bento Grid mengutamakan keseimbangan visual, susun atur kad berkadaran simetri, dan ketiadaan lompang kosong yang terbuang:

```css
/* Container Bento Grid WeDRIVE */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  padding: 24px;
  align-items: stretch;
}

/* Kad Bento Squircle Apple HIG */
.bento-card {
  background: var(--bg-card);
  border-radius: 24px;
  border: 1px solid var(--border-subtle);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
}

.bento-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
}
```

- **Peraturan Ketinggian Seimbang:** Kad dalam baris yang sama WAJIB diseimbangkan ketinggiannya (`align-items: stretch`). DILARANG wujud bahagian bawah kad yang tergantung kosong.

---

## 2. Bahan Kaca Apple (Apple Materials & Glassmorphism)

Mewujudkan ilusi kedalaman optik (*depth*) yang berinteraksi secara organik dengan latar belakang di bawahnya:

```css
/* Apple Thin Material (Glass) */
.apple-glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.35);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.8); /* Specular top highlight */
}

/* Obsidian Dark Mode Glass */
[data-theme="night"] .apple-glass {
  background: rgba(22, 22, 24, 0.75);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.12); /* Subtle rim light */
}
```

---

## 3. Ketepatan Geometri: Bulat Sempurna 1:1 vs Kapsul Pil

Ketepatan geometri adalah teras identiti Apple:

```css
/* 1. Butang Ikon Bulat Tepat (Strict 1:1 Zero Oval) */
.btn-icon-circle {
  width: 44px !important;
  height: 44px !important;
  aspect-ratio: 1 / 1 !important;
  border-radius: 50% !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  box-sizing: border-box !important;
  flex-shrink: 0 !important;
}

/* 2. Butang & Lencana Berteks (Capsule Pill) */
.btn-pill, .badge-pill {
  border-radius: 9999px !important;
  padding: 10px 20px;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
```

- **Zero Oval Rule:** Dilarang butang bulat herot menjadi bujur atau lonjong akibat penambahan padding melintang.
- **Anti-Lipatan Teks:** Butang teks dilarang melipat teks ke baris kedua yang merosakkan bentuk kapsul simetri.

---

## 4. Fizik Pergerakan & Glider Segmen (Spring Physics)

```css
/* Fizik Pergerakan Universal Apple */
:root {
  --apple-ease: cubic-bezier(0.16, 1, 0.3, 1);
  --apple-duration: 0.25s;
}

/* Maklum Balas Sentuhan Taktil */
button:active, .btn-pill:active, .bento-card:active {
  transform: scale(0.97);
  transition: transform 0.1s var(--apple-ease);
}

/* Glider Gelangsar Suis Apple (Segmented Control) */
.segmented-control {
  position: relative;
  background: var(--bg-muted);
  border-radius: 9999px;
  padding: 4px;
  display: inline-flex;
}

.segmented-glider {
  position: absolute;
  top: 4px;
  bottom: 4px;
  background: var(--bg-surface);
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: all 0.3s var(--apple-ease);
  z-index: 1;
}

.segmented-btn {
  position: relative;
  z-index: 2;
  background: transparent;
  border: none;
  padding: 8px 18px;
  border-radius: 9999px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
```

---

## 5. Tipografi Angka & Kebolehcapaian Responsif

1. **Jajaran Angka Tabular (Zero Jitter)**:
   - Semua paparan nombor pendaftaran kenderaan, harga harian (RM), peratusan, dan kiraan tarikh WAJIB mengandungi:
     ```css
     font-variant-numeric: tabular-nums;
     ```
2. **Sasaran Sentuhan Minimum (Touch Targets)**:
   - Minimum **44px × 44px** bagi semua elemen sentuh di skrin telefon dan tablet.
3. **Breakpoints Responsif Rasmi WeDRIVE**:
   - `Desktop`: $\ge 1101\text{px}$ (12-kolum Bento penuh)
   - `Tablet Landscape`: $901\text{px} - 1100\text{px}$ (Kompak 6-kolum)
   - `Tablet Portrait`: $769\text{px} - 900\text{px}$ (2-kolum seimbang)
   - `Mobile`: $\le 768\text{px}$ (1-kolum bertindan, menu hamburger automatik)

---

## 6. Protokol Pengesahan Visual (Check Page As User First)

Sebelum mengubah mana-mana komponen atau halaman:
1. Semak rupa bentuk dan fungsi semasa pada tab pelayar aktif menggunakan `chrome-devtools` (`take_snapshot` atau `take_screenshot`).
2. Pastikan tiada herotan elemen bulat menjadi bujur.
3. Sahkan kontras tema Mod Siang (`#F5F5F7` / `#FFFFFF`) dan Mod Obsidian Malam (`#000000` / `#161618`).
4. Jalankan suite ujian Playwright untuk mengesahkan interaksi bebas regresi:
   ```bash
   cd tests && npx playwright test
   ```
