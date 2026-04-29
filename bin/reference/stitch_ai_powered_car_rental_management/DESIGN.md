---
name: AI Fleet Management
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#424754'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#545f73'
  on-secondary: '#ffffff'
  secondary-container: '#d5e0f8'
  on-secondary-container: '#586377'
  tertiary: '#4d5d73'
  on-tertiary: '#ffffff'
  tertiary-container: '#66768d'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d8e3fb'
  secondary-fixed-dim: '#bcc7de'
  on-secondary-fixed: '#111c2d'
  on-secondary-fixed-variant: '#3c475a'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  h1:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-padding: 24px
  gutter: 16px
---

## Brand & Style
The design system is engineered to project an aura of absolute reliability and forward-thinking intelligence. It targets logistics managers and rental operators who require a high-density, high-clarity interface that reduces cognitive load through predictive AI features. 

The aesthetic is **Corporate / Modern**, emphasizing a "software-as-a-service" (SaaS) sophistication. It prioritizes balanced proportions, generous but purposeful white space, and a refined interface that feels both institutional and cutting-edge. The emotional response is one of controlled efficiency—users should feel that the system is always one step ahead, translating complex fleet data into actionable insights through a clean, systematic visual language.

## Colors
The palette is anchored by **Deep Navy (#1E293B)** for structural elements like sidebars and headers, providing a sense of stability and institutional trust. **Professional Blue (#3B82F6)** serves as the primary action color, used for CTA buttons, active states, and AI-assisted highlights to draw the eye to critical tasks.

The background utilizes a series of **Slate Grays**, starting with a base of #F8FAFC, to create a soft, non-fatiguing workspace for long-term usage. Text is rendered in high-contrast navy for maximum legibility, while functional colors (Success Green and Warning Orange) are used sparingly to denote vehicle status and urgent fleet alerts.

## Typography
This design system utilizes **Inter** for its entire typographic scale. Chosen for its exceptional legibility on digital screens and its neutral, utilitarian character, Inter reinforces the "tech-forward" brand pillar. 

Headlines utilize tighter letter-spacing and heavier weights to create a strong visual hierarchy, while body text maintains a generous line-height to ensure readability during data-intensive car management tasks. Label styles are set in uppercase with slight tracking to differentiate metadata (like VIN numbers or plate IDs) from standard descriptive text.

## Layout & Spacing
The layout follows a **12-column fluid grid** system optimized for desktop-first management dashboards. A 4px baseline grid ensures vertical rhythm across all components. 

Information density is high but organized. Dashboards utilize "Smart Sections" where AI metrics occupy the top span, followed by a flexible grid of car cards. Content is padded with 24px margins to prevent the interface from feeling cramped, while internal component spacing uses 8px and 16px increments to group related data points (e.g., car specs grouped closer than the "Book Now" action).

## Elevation & Depth
Hierarchy is established through **Ambient Shadows** and **Tonal Layering**. Surfaces do not use harsh borders; instead, they rely on soft, multi-layered shadows (0px 4px 12px rgba(30, 41, 59, 0.05)) to lift cards from the background.

The design system employs three primary levels of elevation:
1.  **Level 0 (Base):** Slate Gray backgrounds (#F8FAFC).
2.  **Level 1 (Cards):** Pure White (#FFFFFF) surfaces with subtle shadows, used for car listings and metric widgets.
3.  **Level 2 (Interactive/Floating):** Higher blur shadows used for the AI chatbot interface and dropdown menus to indicate they exist on a superior z-index.

## Shapes
The shape language is defined by **Rounded (0.5rem / 8px)** corners as the standard. This strikes a balance between the precision of sharp corners and the friendliness of fully rounded ones. Larger containers and cards utilize **1rem (16px)** to create a soft, modern container for complex data. Buttons and input fields maintain the 8px standard to ensure a consistent, professional touchpoint across the form-heavy management experience.

## Components
### Buttons & Controls
Primary buttons are solid Professional Blue (#3B82F6) with white text. Secondary buttons use a Slate Gray outline. All interactive elements feature a 200ms transition on hover, deepening the hue slightly to provide tactile feedback.

### Forms & Inputs
Input fields use a 1px border (#E2E8F0) that shifts to the Primary Blue on focus. Labels are positioned above the field in Navy (#1E293B) using the `label-sm` typographic style.

### Car Cards
Cards serve as the primary vehicle for data. They feature a top-aligned image, followed by a title section (Model/Year), a 2-column grid for key specs (Fuel, Transmission, Seats), and a bottom-justified Primary CTA. AI-generated "Availability Predictions" are displayed as small, high-contrast chips in the top-right corner.

### Dashboard Metrics
KPI tiles use large `h1` numerals with descriptive `label-sm` text below. Sparkline charts in the background of the card use a low-opacity blue to show trends without cluttering the UI.

### AI Chatbot Interface
The chatbot is a floating action element. It uses a sleek, semi-transparent background (Glassmorphism-lite) with a 12px blur. User messages appear in Navy bubbles; AI responses appear in White bubbles with a subtle Blue left-border accent to distinguish "machine intelligence" from human input.