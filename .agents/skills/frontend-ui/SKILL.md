---
name: frontend-ui
description: Comprehensive frontend UI design, craft, Apple HIG styling, Bento grid layouts, micro-interactions, responsive ergonomics, and glassmorphism standards for modern web development.
---

# Front-End UI Craft & Engineering Skill

This skill guides the construction, refinement, and auditing of world-class, premium front-end user interfaces for WeDRIVE.

---

## 1. Core Principles of Premium UI Craft

1. **Editorial Visual Hierarchy & Depth**:
   - Avoid plain, flat, or generic AI-template layouts.
   - Use curated color palettes (Obsidian `#000000`/`#161618`, Crisp Day `#F5F5F7`/`#FFFFFF`, Apple Accent `#0071E3`/`#2997FF`).
   - Employ specular top-edge highlights (`border-top: 1px solid rgba(255, 255, 255, 0.12)`), multi-layered soft drop shadows, and high-saturation blur (`backdrop-filter: blur(24px) saturate(180%)`).

2. **Geometrical Precision (The Minimum Circle & Pill Expansion Rule)**:
   - **Compact Icon-Only Elements**: Strictly maintain a 1:1 perfect circular ratio (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important;`). Never allow awkward oval squishing.
   - **Labelled / Text Elements**: Expand horizontally from the circular diameter into full capsule pills (`border-radius: var(--radius-pill, 9999px) !important;`).
   - **Bento Content Cards**: Symmetrical continuous squircle corners (`border-radius: 22px` to `28px`).

3. **Typography Excellence**:
   - Use Apple SF Pro stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif`.
   - Dynamic tracking (`letter-spacing: -0.02em` on titles, `+0.04em` on uppercase kickers).
   - Use `font-variant-numeric: tabular-nums;` for counters, timers, pricing, and countdown digits.

---

## 2. Micro-Interactions, Motion & Spring Physics

1. **Apple Fluid Transition Curves**:
   - Motion: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, expanding cards, and popovers.
   - Snappy Actions: `cubic-bezier(0.32, 0.72, 0, 1)` (0.2s - 0.35s).

2. **Physical Gliders & Segmented Controls**:
   - Free-floating physical glider layer (`z-index: 1`) sliding behind transparent text pills (`z-index: 2`).
   - Seamless width morphing and horizontal translation with spring feedback on active touch (`transform: scale(0.96)`).

3. **State Feedback & Loading Ergonomics**:
   - **Error Feedback**: Pill-shaped shake animation (`@keyframes appleDateErrorShake`) with soft red halo glow.
   - **Guidance Pulse**: Pulsing blue border focus halo (`@keyframes applePickupPulse`).
   - **Skeleton Reveal**: Shimmer placeholder skeleton (`lang-skeleton-active` -> `lang-skeleton-reveal`).

---

## 3. Component Craft Reference Checklist

- [ ] **Navbar / Floating Island**: Frosted glass island with 22px radius, aligned symmetrically with content cards.
- [ ] **Search Pills**: 48px height, 9999px radius, centered icons, adequate left padding (min 48px), focus halo rings.
- [ ] **Bento Metric Tiles**: Rounded icon container with subtle pastel background, clear typography, and soft hover lift (`translateY(-4px)`).
- [ ] **Modal Dialogs**: Backdrop blur sheet (`blur(20px)`), centered positioning, escape key support, and 38px aligned action buttons.
- [ ] **Chatbot & Floating Anchors**: Clean viewport-fixed anchoring with `auto_awesome` sparkles branding.

---

## 4. Responsive Mobile Ergonomics

1. **Touch Targets**: All interactive elements (buttons, links, chips, toggles) MUST have minimum `44px x 44px` touch bounding boxes.
2. **Breakpoints**:
   - `Desktop`: $\ge 1101\text{px}$ (Multi-column Bento grid)
   - `Tablet`: $769\text{px} - 1100\text{px}$ (2-column adaptive layout)
   - `Mobile`: $\le 768\text{px}$ (Single-column stack, auto-collapsing sidebar)
3. **Viewport Meta**: Always ensure `<meta name="viewport" content="width=device-width, initial-scale=1.0"/>`.

---

## 5. UI Verification Protocol

After creating or modifying any front-end component:
1. **Live Visual Audit (DevTools MCP)**: Verify dark/light contrast, typography descenders, hover states, and alignment.
2. **Automated E2E Verification (Playwright CLI)**:
   ```bash
   cd tests && npx playwright test
   ```
3. Ensure 100% test pass rate before committing changes.
