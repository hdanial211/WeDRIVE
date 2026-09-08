---
name: WeDRIVE Apple HIG & Obsidian Precision
colors:
  primary: '#0071E3'
  on-primary: '#FFFFFF'
  primary-container: '#0071E3'
  on-primary-container: '#FFFFFF'
  inverse-primary: '#2997FF'
  secondary: '#86868B'
  on-secondary: '#FFFFFF'
  secondary-container: '#1D1D20'
  on-secondary-container: '#F5F5F7'
  tertiary: '#5856D6'
  on-tertiary: '#FFFFFF'
  tertiary-container: '#2C2A85'
  on-tertiary-container: '#EFEBFF'
  surface: '#000000'
  surface-dim: '#0E0E10'
  surface-bright: '#1D1D20'
  surface-container-lowest: '#000000'
  surface-container-low: '#0E0E10'
  surface-container: '#161618'
  surface-container-high: '#1D1D20'
  surface-container-highest: '#262629'
  on-surface: '#FFFFFF'
  on-surface-variant: '#A1A1A6'
  inverse-surface: '#F5F5F7'
  inverse-on-surface: '#1D1D1F'
  outline: 'rgba(255, 255, 255, 0.12)'
  outline-variant: 'rgba(255, 255, 255, 0.06)'
  surface-tint: '#0071E3'
  error: '#FF3B30'
  on-error: '#FFFFFF'
  error-container: '#991B1B'
  on-error-container: '#FFECEB'
  success: '#34C759'
  warning: '#FF9500'
  obsidian-base: '#000000'
  night-bento: '#161618'
  night-bento-subtle: '#1D1D20'
  night-border: 'rgba(255, 255, 255, 0.08)'
  electric-blue: '#0071E3'
  status-success-glow: 'rgba(52, 199, 89, 0.15)'
  status-warning-glow: 'rgba(255, 149, 0, 0.15)'
  status-error-glow: 'rgba(255, 59, 48, 0.15)'
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
  container-padding-desktop: 24px
  container-padding-mobile: 16px
  gutter: 16px
  bento-gap: 16px
---

# WeDRIVE Apple HIG & Dark Obsidian Design System

## 1. Overview & Brand Identity
WeDRIVE is an ultra-premium, AI-orchestrated mobility and luxury vehicle rental platform. Its aesthetic merges **Apple Human Interface Guidelines (HIG) Precision** with **Dark Obsidian Executive Minimalism** (inspired by Apple Developer, Linear, and Stripe).
- **Core Mood:** Authoritative, calm, clutter-free, spatial elegance, precision-engineered.
- **Language Standard:** Contemporary Malaysian Modern Malay (Standard BM 2026). Strictly ban obsolete/archaic words (*Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar*). Use natural enterprise automotive terms (*Kenderaan, Spesifikasi, Tarif, Ruang Pemandu, Studio Visual, Pengesahan Rasmi*).

## 2. Colors & Surface Depth Hierarchy
- **Canvas Base (`#000000` / `#0E0E10`):** OLED-optimized pure dark environment.
- **Bento Card Surfaces (`#161618` & `#1D1D20`):** Modular containers with hairline borders (`rgba(255, 255, 255, 0.08)`).
- **Primary Accent (`#0071E3` Apple Blue):** Reserved strictly for primary intent actions, active stepper badges, and focused borders.
- **Restrained Glassmorphism:** Translucent materials (`backdrop-filter: blur(20px) saturate(180%)`) are strictly reserved for floating top headers, floating stepper capsules, and bottom action docks. Main content cards remain opaque to guarantee 100% legibility.

## 3. Strict Geometry Standard (Zero Oval Rule)
1. **Circular Icon-Only Buttons:** MUST have a strict 1:1 aspect ratio (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height; display: flex; align-items: center; justify-content: center;`). Never allow horizontal stretch into ovals.
2. **Text Buttons:** MUST expand symmetrically into 9999px pills (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important; padding: 12px 24px;`).
3. **Bento Cards:** Strict `24px` squircle corners for content cards; `28px` for modals and visual overlay sheets.
4. **Input Fields:** `12px` to `14px` squircle corners with 1px border and 2px ambient focus glow.

## 4. Typography & Tabular Standard
- **Primary Typefaces:** Apple San Francisco (`-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif`).
- **Tabular Figures:** All prices (RM), dates, counters, durations, and vehicle plate numbers MUST use `font-variant-numeric: tabular-nums` to eliminate horizontal jitter during live updates.

## 5. Interaction & Apple Physical Easing
- **Scale Feedback:** Soft haptic button depression on press (`transform: scale(0.97)`).
- **Apple Physical Curve:** `cubic-bezier(0.16, 1, 0.3, 1)` with `0.25s` duration.
- **Single Source of Action:** Exactly ONE official primary action dock. Never place duplicate save, draft, or next buttons in the same view.

## 6. Do's and Don'ts
- **DO** use `tabular-nums` for all numbers, monetary values, and time counters.
- **DO** maintain a minimum `44px x 44px` touch target for all interactive elements on mobile viewports.
- **DO** keep body bottom padding (`padding-bottom: 130px`) so fixed bottom docks never obscure content.
- **DON'T** ever allow oval or stretched circular buttons.
- **DON'T** provide duplicate action buttons ("Simpan" at the top header AND "Simpan" at the bottom).
- **DON'T** use plain generic colors (e.g. raw saturated red/blue); always use curated Apple HSL tokens.
