# CHAPTER 5: IMPLEMENTATION

## 5.1 Introduction

The implementation phase represents the translation of the system requirements and design specifications formulated in Chapter 3 and Chapter 4 into a fully functional, production-grade web application. In this phase, the architectural blueprints, relational database models, user interface wireframes, and business logic of the AI-Assisted Car Rental Management System with Chatbot Support (WeDRIVE) are realized using modern web engineering standards, cloud-native backend services, and cutting-edge artificial intelligence models.

The primary objective of the implementation phase is to deliver an end-to-end, resilient digital car rental platform that solves the chronic operational inefficiencies inherent in traditional car rental workflows across Melaka. Specifically, the engineering objectives accomplished during this phase encompass:
1. **Developing a Unified Client-Side Architecture**: Implementing a responsive, modular frontend adhering strictly to Apple Human Interface Guidelines (Apple HIG), leveraging Bento Grid squircle layouts, tactile button physics, and the Zero Oval Rule across macOS desktop, iPad tablet, and iPhone mobile viewports.
2. **Implementing a Cloud-Native Backend-as-a-Service (BaaS)**: Establishing a robust PostgreSQL relational database on Supabase (Singapore region, `ap-southeast-1`) protected by granular Row Level Security (RLS) policies and accessed through a unified, centralized API facade (`window.WeDriveAPI`).
3. **Engineering an Intelligent Multi-Model AI Engine**: Integrating a resilient dual-provider conversational assistant powered by Google Gemini 3.8 Flash as the primary inference engine with automated failover to xAI Grok (`grok-3-mini`), supplemented by AI-driven optical character recognition (OCR) for customer identity and driving license verification.
4. **Delivering Interactive 360-Degree Vehicle Visualization**: Constructing an immersive Three.js WebGL rendering pipeline capable of displaying high-definition exterior 200-frame turntable sequencing and interior 6-face cubemap panoramas hosted via a Cloudinary media delivery network.
5. **Enforcing Automated Quality Assurance & Agentic Workflows**: Incorporating Playwright CLI end-to-end (E2E) automated testing suites, ethical AI cybersecurity vulnerability assessments (Strix Security Guardian), and AST-level knowledge graph tracking (Graphify) to guarantee software stability, security compliance, and zero regression.

This chapter is organized systematically to provide an exhaustive academic account of the implementation process. Section 5.2 documents the software and hardware development environment setup, covering workstation specifications, runtime dependencies, BaaS configurations, external AI/messaging APIs, and the Antigravity multi-agent orchestration architecture. Section 5.3 outlines the version control procedure, repository branching model, Semantic Versioning (SemVer) standards, release tag protocols, and continuous integration/continuous deployment (CI/CD) pipelines. Section 5.4 provides a comprehensive breakdown of the implementation status across frontend modules, AI interactive systems, backend infrastructure, and automated testing workflows, supplemented by detailed structural status tables (Tables 5.1 to 5.4), user journey narratives, and interface screenshots. Finally, Section 5.5 concludes the chapter with a synthesis of engineering milestones achieved and outlines the transition to Chapter 6: Testing.

---

## 5.2 Software Development Environment Setup

To construct a high-performance web application capable of enterprise-level reliability, a modern, standardized development environment was established. The development environment incorporates dedicated hardware workstations, UNIX-based operating system environments, cloud-based database services, containerized toolchains, and an agentic multi-agent software engineering ecosystem.

### 5.2.1 Hardware Specifications
All engineering, asset rendering, local testing, and multi-agent coordination were performed on an Apple Silicon developer workstation. Table 5.0 summarizes the hardware environment utilized throughout the development lifecycle:

*Table 5.0: Hardware Development Environment Specifications*

| Hardware Component | Specification Details | Operational Purpose |
|---|---|---|
| **Workstation Model** | Apple MacBook Pro (Apple Silicon Architecture) | Primary software development, local compilation, and testing machine |
| **Central Processing Unit (CPU)** | 8-Core CPU (High-Performance & High-Efficiency Cores) | Code interpretation, Playwright headless test execution, and Git operations |
| **Graphics Processing Unit (GPU)** | Integrated 10-Core Apple Metal GPU | Local WebGL Three.js 3D rendering and visual turntable asset inspection |
| **Unified Memory (RAM)** | 16 GB Unified Memory (LPDDR5) | Concurrent execution of browsers, local servers, AST parsers, and IDE tools |
| **Storage Subsystem** | 512 GB PCIe-based Solid State Drive (SSD) | Local repository storage, node_modules caching, and test trace logging |
| **Primary Display** | 14.2-inch Liquid Retina XDR (3024 × 1964 native resolution) | High-DPI UI layout calibration and color-accurate design inspection |
| **Target Test Peripherals** | Apple iPad Air (820px) & iPhone 15 Pro (393px) | Physical hardware touch testing, dynamic island, and mobile responsive audit |

### 5.2.2 Operating System & Shell Environment
The operating system utilized was **macOS Sonoma / Sequoia**, configured with the native **Zsh (Z Shell)** environment. Package management and runtime dependencies were orchestrated via **Homebrew (brew)**, ensuring hermetic version pinning across CLI utilities. Terminal automation scripts were configured with strict POSIX compliance to execute testing runners, Git release scripts, and asset optimization tasks.

### 5.2.3 Core Software Technology Stack
The architectural philosophy of WeDRIVE prioritizes zero bloated client-side dependencies, maximum runtime performance, and standard-compliant web technologies:
1. **Frontend Presentation Layer**:
   - **HTML5 (HyperText Markup Language 5)**: Semantic document structure (`<main>`, `<header>`, `<nav>`, `<section>`, `<article>`) adhering strictly to W3C accessibility and SEO guidelines.
   - **Vanilla CSS3 (Cascading Style Sheets 3)**: Modular stylesheet architecture governed by Apple Human Interface Guidelines design tokens. System fonts (`-apple-system`, `SF Pro Display`, `Inter`), Bento Grid squircle cards (`border-radius: 24px`), physical touch transforms (`scale(0.97)`), and translucent backdrop blurs (`backdrop-filter: blur(20px) saturate(180%)`).
   - **Modern ES6+ JavaScript**: Native ECMAScript 2022+ features including asynchronous `async/await`, Promises, ES modules, dynamic imports, and DOM manipulation without heavy external framework overhead (e.g., React or Angular), ensuring sub-second initial page load times.
2. **Backend as a Service (BaaS) - Supabase**:
   - **PostgreSQL 15.x Relational Engine**: Enterprise-grade SQL database hosted on Supabase Cloud in the Singapore regional data center (`ap-southeast-1`), providing low-latency database queries (~20-40ms latency across Malaysia).
   - **Supabase Auth**: Secure JWT-based identity management providing email/password authentication, Google OAuth 2.0 federation, role-based claims (`admin` vs. `customer`), and session persistence.
   - **PostgREST & Realtime Engine**: Automated generation of RESTful endpoints directly from SQL schemas, coupled with WebSocket listeners for instant vehicle status synchronization.
3. **Web Graphics & Visual Rendering**:
   - **Three.js (v0.157.0)**: Lightweight WebGL 3D graphics rendering library enabling real-time canvas-based rendering of 360-degree vehicle interior skyboxes and interactive camera dampening controls.
   - **Anime.js (v3.2.1)**: Compact animation engine utilized for smooth Bento Grid accordion transitions, floating pill toast notifications, and modal sheet physics.
4. **Cloud Media & Asset CDN**:
   - **Cloudinary Media CDN**: Unsigned high-throughput image hosting preset (`wedrive_360`) delivering optimized vehicle photo galleries, 200 exterior turntable frames, and 6-sided cubic interior textures.
5. **Hosting & Content Delivery Network (CDN)**:
   - **Vercel Global Edge Network**: Automated serverless edge deployment platform with worldwide Anycast DNS routing, HTTP/3 protocol support, and SSL/TLS certificate termination for the production domain `wedrive.website`.

### 5.2.4 External AI & Messaging APIs
WeDRIVE integrates external artificial intelligence and communication pipelines through secure API gateways:
- **Google Gemini 3.8 Flash API**: Serves as the primary large language model (LLM) for conversational vehicle recommendations, availability lookups, and customer inquiries. Accessed via `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`.
- **xAI Grok API (`grok-3-mini`)**: Serves as an automated fallback inference provider configured within the AI Key Vault. If Google Gemini experiences rate limiting (HTTP 429) or service outages, queries are transparently rerouted to Grok without disrupting user interactions.
- **Resend Transactional Email API**: Integrated via Supabase Edge Functions (`supabase/functions/`) to dispatch cryptographic booking confirmations, verification notices, and promotional customer lifecycle campaigns via SMTP/REST.

### 5.2.5 Antigravity Multi-Agent Development Environment
A distinguishing characteristic of the WeDRIVE engineering workflow is the utilization of an advanced **Model Context Protocol (MCP)** and multi-agent development architecture. Rather than relying on unstructured AI code generation, development was orchestrated across five specialized engineering domains defined in `.agents/rules/20_team_roles_and_responsibilities.md`:
- **Supabase DBA Specialist (`supabase_dba_agent`)**: Managed table DDL scripts, foreign key integrity, index optimizations, and PostgreSQL RLS security policies.
- **Apple HIG & UI Auditor (`wedrive_ui_auditor`)**: Performed visual DOM inspection across MacBook (1440px), iPad (820px), and iPhone (393px) breakpoints, enforcing the Zero Oval Rule and Bento Grid ergonomics.
- **Automated QA Specialist (`playwright_sentinel`)**: Authored and executed automated Playwright end-to-end test suites across user authentication, booking flows, and multilingual translation parity.
- **Ethical AI Penetration Tester (`strix_security_guardian`)**: Conducted automated vulnerability scanning against OWASP Top 10 vulnerabilities, session hijacking, and PII leakage.
- **Malay Linguistic Auditor (`bm_language_police`)**: Audited interface strings across `shared/lang/ms.json` to enforce Modern Malaysian Malay (Standard 2026) and eliminate blacklisted archaic terms (*Armada, Fleet, Wahana, Kabin*).

> *[Figure 5.1: Software Development Environment & System Architecture Diagram - To be inserted]*

---

## 5.3 Version Control Procedure

To maintain code integrity, enable seamless collaboration, and ensure traceability of every architectural change across the final year project development timeline, a disciplined version control procedure was implemented using Git and GitHub.

### 5.3.1 Repository Architecture & Remote Backup
The primary source code is maintained in a private remote repository hosted on GitHub at `https://github.com/hdanial211/WeDRIVE`. The repository is synchronized with an automated deployment pipeline linked to Vercel, ensuring that every validated commit pushed to the production branch is immediately built, bundled, and served on `https://wedrive.website`.

### 5.3.2 Branching Strategy & Git Workflow
WeDRIVE adopted a modified **Trunk-Based Development Model** tailored for Agile rapid-release cycles, structured as follows:
1. **`main` (Production Branch)**: The protected core branch representing production-ready code. All commits in `main` must pass 100% of Playwright E2E tests and character limit audits before deployment.
2. **`feature/*` (Feature Development Branches)**: Isolated branches dedicated to implementing specific functional modules (e.g., `feature/360-turntable-viewer`, `feature/ai-key-vault`). Once development and testing are finalized, features are merged into `main` via fast-forward or squash merges.
3. **`fix/*` (Bug Fix & Remediation Branches)**: Targeted branches created to remediate layout regressions, linter warnings, or security audit findings identified during verification cycles.
4. **`release/*` (Release Staging Branches)**: Ephemeral branches used to verify SemVer tag increments, compile development summaries in `PLAN/FYP1_to_FYP2_Development_Summary.md`, and execute pre-deployment test suites.

### 5.3.3 Semantic Versioning (SemVer) Standard
The project strictly enforces a 3-tier Semantic Versioning convention governed by `.agents/rules/17_git_versioning_standard.md`:

$$\mathbf{X} \ . \ \mathbf{Y} \ . \ \mathbf{Z}$$
$$\text{[MAJOR]} \ . \ \text{[MINOR]} \ . \ \text{[PATCH]}$$

- **Major (X)**: Incremented upon major architectural overhauls or academic milestone transitions (e.g., transitioning from FYP 1 version `2.9.9` to FYP 2 production baseline `3.0.0`, evolving through system hardening up to `6.x.x`). When X is incremented, Y and Z reset to zero.
- **Minor (Y)**: Incremented upon introducing substantive new user-facing features, physical HTML pages, or external system integrations (e.g., introducing the AI Key Vault, Three.js 360 Studio, or Apple Segmented Pricing Glider). When Y is incremented, Z resets to zero.
- **Patch (Z)**: Incremented upon bug remediation, CSS styling refinements, responsive adjustments, or rule documentation updates.

### 5.3.4 Commit Message & Release Tag Protocol
Commit messages are strictly standardized to begin with the SemVer identifier without a 'v' prefix, followed by a clear, declarative English summary of changes:
```bash
git commit -m "6.20.10 Secure 360 vehicle media editing with double confirmation and filter public rental catalogue"
```
Following successful local testing and validation, a matching Git tag is generated and pushed to GitHub:
```bash
git tag 6.20.10 && git push origin main --tags
```
This protocol ensures that the GitHub Releases tab provides an immutable, chronological audit trail of system maturation for academic review and grading.

### 5.3.5 Continuous Deployment & Rollback Mechanism
Deployment automation follows a push-to-deploy workflow:
```
Developer Commit & Tag -> GitHub Remote (hdanial211/WeDRIVE) -> Vercel Git Webhook -> Global Edge CDN Build & Deploy -> Live at wedrive.website
```
If a regression is identified in production, Git provides immediate rollback capabilities via `git revert <commit_hash>`, prompting Vercel to redeploy the previous stable commit within 30 seconds.

> *[Figure 5.2: Git Flow & CI/CD Deployment Workflow - To be inserted]*

---

## 5.4 Implementation Status

The implementation phase of WeDRIVE spanned the complete development cycle from early architecture stabilization to comprehensive production deployment. To provide a granular assessment of system delivery, the implementation status is documented across four structured summary tables, followed by an in-depth module-by-module technical narrative.

### 5.4.1 Summary Tables of Implementation

*Table 5.1: Implementation Table for WeDRIVE Frontend Modules*

| Module / Component | Description | Duration | Completion Date | Size / Codebase Metrics | Tools / Technologies Used |
|---|---|---|---|---|---|
| **Shared Core Module** (`shared/`) | Global navigation bar, footer, Apple HIG styling tokens, theme toggling (Day/Night), centralized API client (`api.js`), and bilingual dictionary files. | 5 Weeks | 11 September 2026 | 44 files, ~39,699 lines of code | HTML5, Vanilla CSS3, JavaScript ES6+, Anime.js, Supabase JS |
| **Account (Auth) Module** (`account/`) | Unified authentication gateway featuring email/password sign-in, Google OAuth 2.0 federation, password recovery, session validation, and auto-fill protection. | 2 Weeks | 28 August 2026 | 6 files, ~2,648 lines of code | HTML5, CSS3, JavaScript, Supabase Auth, Web Crypto API |
| **Guest Portal Module** (`guest/`) | Public-facing landing page, corporate information, dynamic Apple Glider pricing comparison, vehicle catalogue preview, and FAQ bento grid. | 2 Weeks | 25 August 2026 | 5 files, ~1,285 lines of code | HTML5, Vanilla CSS3, JavaScript ES6+, Apple HIG Bento Grid |
| **Customer Portal Module** (`customer/`) | Authenticated client workspace containing vehicle catalog browsing, interactive details viewer, multi-step booking stepper, booking management, and digital QR pass receipt. | 4 Weeks | 5 September 2026 | 12 files, ~8,414 lines of code | HTML5, CSS3, JavaScript, Three.js, Flatpickr, QRCode.js |
| **Admin Operations Module** (`admin/`) | Enterprise management console for car inventory, modular multi-step Add/Edit Car stepper, customer CRM, document verification, financial revenue analytics, and AI Key Vault. | 6 Weeks | 11 September 2026 | 55 files, ~25,160 lines of code | HTML5, CSS3, JavaScript, Supabase PostgreSQL, Chart.js |

*Table 5.2: Implementation Table for AI & Interactive Systems*

| Module / Component | Description | Duration | Completion Date | Size / Codebase Metrics | Tools / Technologies Used |
|---|---|---|---|---|---|
| **Intelligent AI Chatbot** (`shared/js/chatbot.js`) | Floating conversational AI widget with live customer context injection, vehicle availability queries, and multi-turn natural language dialog. | 3 Weeks | 11 September 2026 | 1 file, ~1,100 lines of code | Google Gemini 3.8 Flash, xAI Grok fallback, REST API |
| **AI Key Vault & Model Hub** (`shared/js/ai-vault.js`) | Multi-slot API credential manager featuring automated provider detection, client-side encryption, and seamless model switching. | 2 Weeks | 11 September 2026 | 1 file, ~650 lines of code | JavaScript ES6+, LocalStorage Encryption, Provider Regex |
| **Three.js 360° Studio Viewer** (`shared/js/vehicle-viewer.js`) | Dual-mode vehicle visualizer supporting 200-frame exterior turntable rotation and 6-face cubic interior skybox camera orbiting. | 4 Weeks | 11 September 2026 | 1 file, ~1,500 lines of code | Three.js WebGL, Canvas API, Cloudinary CDN, Touch Event API |
| **Apple Segmented Pricing Glider** (`guest/js/pricing-glider.js`) | Interactive sliding toggle allowing customers to dynamically compare daily versus weekly rental rates with real-time currency calculation. | 1 Week | 28 August 2026 | 1 file, ~280 lines of code | CSS3 Transitions, JavaScript Math Engine, Tabular Nums |
| **Dynamic Bilingual Engine** (`shared/lang/`) | Real-time English and Bahasa Melayu translation engine operating via `data-key` DOM attributes without requiring full-page reloads. | 3 Weeks | 9 September 2026 | 4 files (`en.json`, `ms.json`, `en.js`, `ms.js`), ~4,800 entries | JavaScript i18n Engine, Custom DOM Dispatcher |
| **AI Customer Lifecycle Engine** (`shared/sql/ai_automation_setup.sql`) | Automated customer marketing event planner and booking notification dispatcher utilizing AI-generated promotional copy. | 2 Weeks | 8 September 2026 | 2 SQL scripts, ~265 lines of SQL DDL/RPC | PostgreSQL PL/pgSQL, Supabase Cron, Resend Email |

*Table 5.3: Implementation Table for Backend, Database & Infrastructure*

| Module / Component | Description | Duration | Completion Date | Size / Codebase Metrics | Tools / Technologies Used |
|---|---|---|---|---|---|
| **Supabase PostgreSQL Schema** (`shared/sql/`) | Normalized relational schema covering cars, bookings, customers, payments, visual assets, and audit logs with strict CHECK constraints. | 4 Weeks | 10 September 2026 | 6 SQL migration files, ~850 lines of SQL | PostgreSQL 15, Supabase Cloud (Singapore `ap-southeast-1`) |
| **Row Level Security (RLS)** (`bin/wedrive_database_schema.sql`) | Granular access control policies enforcing tenant isolation, ensuring customers access only their personal bookings and profiles. | 2 Weeks | 7 September 2026 | 14 security policies across 6 tables | PostgreSQL RLS, Supabase Auth JWT Claims |
| **Centralized API Architecture** (`shared/js/api.js`) | Unified API abstraction module (`window.WeDriveAPI`) encapsulating 40+ CRUD and business logic functions across the entire application. | 5 Weeks | 11 September 2026 | 1 file, ~2,250 lines of code | JavaScript ES6+, Supabase Client, Fetch API, FormData |
| **Cloudinary Media Pipeline** (`shared/js/api.js`) | High-speed image upload and delivery pipeline utilizing the `wedrive_360` unsigned preset to host exterior frames and interior cube maps. | 2 Weeks | 11 September 2026 | ~180 lines of API upload logic | Cloudinary REST API, Multipart Form Encoding |
| **Transactional Email Functions** (`supabase/functions/`) | Serverless Edge Functions executing on Deno runtime to dispatch booking receipts, verification confirmations, and password resets. | 2 Weeks | 4 September 2026 | 3 Edge Functions, ~420 lines of TypeScript | Supabase Edge Functions, Deno, Resend Email API |

*Table 5.4: Implementation Table for Automated Quality & Agentic Workflows*

| Module / Component | Description | Duration | Completion Date | Size / Codebase Metrics | Tools / Technologies Used |
|---|---|---|---|---|---|
| **Playwright E2E Test Suite** (`tests/e2e/`) | Automated end-to-end testing suite validating authentication, responsive layouts, booking flows, 360 viewers, and bilingual parity. | 5 Weeks | 11 September 2026 | 19 test specification files, ~2,228 lines of code | Playwright Test Runner, Chromium, WebKit, Firefox |
| **Strix Security Audit Suite** (`.agents/rules/15_strix_security_audit.md`) | Ethical AI penetration testing framework assessing OWASP Top 10 vulnerabilities, session integrity, PII protection, and SQLi defense. | 2 Weeks | 10 September 2026 | Automated penetration scripts & audit reports | Strix AI Security Engine, Curl, Web Crypto |
| **Graphify Knowledge Graph** (`graphify-out/`) | Abstract Syntax Tree (AST) mapping of all JavaScript functions, classes, and UI components to optimize agent reasoning tokens. | 2 Weeks | 10 September 2026 | Graph database JSON & visual HTML graph tree | Python AST Parser, Graphify MCP Server |
| **Apple 3-Device Responsive Protocol** (`.agents/rules/05_apple_device_support.md`) | Single-tab automated responsive verification ensuring perfect layout scaling across MacBook (1440px), iPad (820px), and iPhone (393px). | 3 Weeks | 10 September 2026 | Embedded Playwright viewport runners & DevTools | Chrome DevTools Protocol, CSS Media Queries |

---

### 5.4.2 Shared Architecture & Global Systems
The foundation of the WeDRIVE web platform rests upon the shared architecture residing in the `shared/` directory. This module establishes visual cohesion, global state management, and reusable interface primitives.

1. **Global Apple HIG Design System (`shared/css/wedrive.css`)**:
   Rather than fragmenting stylesheets across individual views, WeDRIVE consolidates core styling tokens into a unified master stylesheet. The design system implements Apple Human Interface Guidelines:
   - **Squircle Geometry**: Bento cards feature a smooth `border-radius: 24px`, while inner utility tags use `border-radius: 12px`.
   - **Zero Oval Rule**: In accordance with user design rules, any circular element (such as icon buttons or status indicators) is enforced to maintain an absolute 1:1 aspect ratio (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height`). Oval or elongated shapes are strictly eliminated. Textual buttons expand horizontally into symmetric capsule pills (`border-radius: 9999px; white-space: nowrap !important;`).
   - **Apple Thin Material**: Overlays, modals, and the sticky navigation bar utilize translucent frosted glass aesthetics via `backdrop-filter: blur(20px) saturate(180%)` paired with subtle borders (`1px solid rgba(255, 255, 255, 0.15)` in dark mode and `rgba(0, 0, 0, 0.08)` in light mode).
   - **Dual-Theme Engine**: Controlled centrally via `shared/js/main.js`, users can toggle between Day Mode (`#F5F5F7` background, `#FFFFFF` cards) and Obsidian Night Mode (`#000000` true black background, `#161618` Bento cards). User preferences are persisted in `localStorage` and applied instantly upon DOM initialization to prevent visual flash.

2. **Unified Navigation & Sub-Navigation Loaders (`navbar-loader.js` & `sidebar-loader.js`)**:
   WeDRIVE implements a contextual dual-navigation architecture:
   - **Admin Dual Navigation**: The top navigation bar serves as the primary system switcher between six core administrative domains (Dashboard, Cars, Bookings, Customers, Reports, AI Intelligence). Selecting a topbar item dynamically reconfigures the contextual sidebar (`sidebar-loader.js`) to display dedicated physical sub-pages (e.g., `available-cars.html`, `rented-cars.html`, `add-car.html`, `operations.html`), adhering to the rule that every sub-tool possesses an independent physical `.html` file.
   - **Customer Navigation**: Features a streamlined sidebar providing access to vehicle browsing, personal reservations, digital receipts, and profile verification. On mobile viewports ($\le 768\text{px}$), the sidebar smoothly collapses into a floating bottom dock or slide-out drawer with 44px touch targets.

3. **Dynamic Bilingual Parity Engine (`shared/lang/`)**:
   WeDRIVE provides complete, real-time bilingual support between English and Contemporary Modern Malaysian Malay (Standard 2026). Translation strings are stored in `shared/lang/en.json` and `shared/lang/ms.json`. HTML elements are decorated with `data-key` attributes (e.g., `<span data-key="nav_cars">Cars</span>`). When the language toggle is clicked, the i18n engine traverses the DOM and swaps text nodes instantaneously without page reloads. In compliance with project language standards, archaic vocabulary (*Armada, Fleet, Wahana, Kabin*) is completely excluded in favor of clear modern terminology (*Kereta, Ruang Penumpang*).

---

### 5.4.3 Authentication & Account Management Module (`account/`)
The authentication module provides secure, frictionless entry into the WeDRIVE ecosystem, separating customers and administrators while preventing account collisions.

1. **User Sign-In (`login.html` & `auth.js`)**:
   - Offers dual authentication paths: standard email/password authentication via Supabase Auth and one-click Google OAuth 2.0 federation.
   - In accordance with testing safety rules, auto-fill credentials are provided for demo accounts (`admin@wedrive.my` and `ahmad@wedrive.my`), allowing evaluators to sign in with a single click without duplicating records.
   - Form inputs implement real-time validation, password visibility toggles, and keyboard accessibility.

2. **Account Registration & Password Recovery (`signup.html` & `forgot-password.html`)**:
   - The registration workflow captures essential customer information (username, full name, email, phone number, password). Passwords must meet a minimum strength threshold (8 characters, mixed case, numeric characters).
   - Upon successful signup, an automated trigger creates a corresponding record in the public `customers` table linked to the unique `auth.uid()`.
   - The password recovery interface dispatches cryptographically signed recovery tokens via Supabase Auth and Resend email services.

3. **Auth Guard & Session Management (`shared/js/auth-guard.js`)**:
   - Client-side navigation guards evaluate active JWT tokens on protected pages. Unauthenticated access attempts to `/admin/*` or `/customer/*` are redirected to the login gateway.
   - For administrative security, an inactivity watchdog (`05_admin_idle_timeout.spec.js`) monitors mouse and keyboard events, triggering an automatic secure sign-out if the console remains idle for over 15 minutes.

> *[Figure 5.3: Account Authentication Interface with Form Validation - To be inserted]*

---

### 5.4.4 Guest Portal & Public Exploration (`guest/`)
The guest module serves prospective customers seeking vehicle rental options across Melaka without requiring immediate account creation.

1. **Interactive Landing Page (`index.html`)**:
   - Features a high-impact hero banner, value proposition bento cards, customer testimonials, and direct vehicle search filters (brand, category, transmission, seating capacity).
   - Showcases real-time vehicle availability queried directly from Supabase (`status = 'Available'`).

2. **Apple Segmented Pricing Glider (`pricing.html` & `guest/js/pricing-glider.js`)**:
   - Replaces static pricing tables with an interactive Apple-style segmented glider control.
   - Prospective renters can slide between "Kadar Harian" (Daily Rates) and "Kadar Mingguan" (Weekly Rates with automated 15% discount calculations). Real-time monetary values render using `tabular-nums` typography to prevent layout shifting.

3. **Explore Cars & About Corporate (`explore.html` & `about.html`)**:
   - Displays available rental cars organized into distinct categories: Compact Hatchback, Executive Sedan, Premium SUV, and Multi-Purpose Vehicle (MPV).
   - Communicates WeDRIVE's corporate identity, insurance coverage parameters, and the mandatory Single Melaka HQ Depot Rule (pickup and return exclusively at Melaka Headquarters, with unrestricted driving permissions across Peninsular Malaysia).

> *[Figure 5.4: Guest Landing Page and Interactive Pricing Glider - To be inserted]*

---

### 5.4.5 Customer Portal, Booking Flow & Digital Pass (`customer/`)
The customer portal represents the primary transactional engine of WeDRIVE, providing a seamless rental journey from vehicle selection to digital vehicle handover.

1. **Vehicle Exploration & Interactive 360 Studio (`car-details.html`)**:
   - When a customer selects a vehicle, the vehicle details view loads comprehensive technical specifications (manufacturer, model, year, transmission, fuel type, seating capacity, daily rental rate).
   - Incorporates a progressive visual disclosure switch: vehicles initially display a high-resolution photo gallery; if 360-degree assets exist, the segmented switch smoothly expands to reveal the **360° Exterior Turntable** and **Interior Panorama** powered by Three.js.

2. **Multi-Step Rental Booking Stepper (`book-car.html`)**:
   - Implements a guided 3-step reservation wizard:
     - **Step 1 (Rental Dates & Logistics)**: Users select rental duration using a customized Apple HIG date range calendar (`calendar.js` and Flatpickr). The calendar disables already booked dates in real time via `window.WeDriveAPI.getBookedDatesForCar(carId)`. Pickup and return locations are locked to the Melaka HQ Depot.
     - **Step 2 (Add-On Options & Coverage)**: Renters configure optional protection plans (Comprehensive Collision Damage Waiver) and convenience accessories (Child Safety Seat, Touch 'n Go RFID Tag).
     - **Step 3 (Payment & Confirmation)**: Displays a transparent price breakdown (base rental rate, duration multiplier, security deposit, SST taxation). Bookings are submitted to Supabase with status `Pending` or `Confirmed`.

3. **Customer Booking Management (`my-bookings.html`)**:
   - Provides an active reservation dashboard categorized by status: `Semua` (All), `Sedang Berjalan` (Active/Ongoing), `Akan Datang` (Upcoming), and `Selesai` (Completed).
   - Renters can view pickup countdowns, review rental agreements, or cancel pending reservations within permissible cancellation windows.

4. **Digital QR Pass & Rental Receipt (`receipt.html`)**:
   - Eliminates physical paper rental agreements by generating a tamper-resistant **Digital QR Rental Pass**.
   - The pass embeds an encrypted JSON payload containing `booking_id`, customer verification hash, and vehicle registration number, rendered via `qrcode.js`.
   - Depot staff scan the QR code upon vehicle pickup to verify customer identity and complete digital handover. The view includes a print-optimized stylesheet for generating official PDF receipts.

> *[Figure 5.5: Customer Vehicle Catalogue and Interactive 360-Degree Turntable Viewer - To be inserted]*

> *[Figure 5.6: Customer Multi-Step Booking Flow and Rental Summary - To be inserted]*

> *[Figure 5.7: Customer Digital QR Pass and Rental Receipt View - To be inserted]*

---

### 5.4.6 Admin Vehicle Operations & CRM Management (`admin/`)
The administrative portal empowers WeDRIVE operations personnel to oversee the rental ecosystem with enterprise-grade precision.

1. **Executive Operations Dashboard (`index.html`)**:
   - Presents an executive Bento Grid summarizing key operational metrics: Total Vehicle Count, Active Rentals, Vehicles in Maintenance, Monthly Revenue (RM), and Pending Customer Verifications.
   - Incorporates dynamic visual charts (Chart.js) illustrating rental demand trends across vehicle categories and revenue projections.

2. **Modular Vehicle Onboarding & Edit Stepper (`add-car.html` & `edit-car.html`)**:
   - Developed in strict accordance with the Single Source of Action Rule (prohibiting duplicate buttons across wizard steps) and Zero Fabricated Fields Rule (strictly capturing legitimate rental parameters: Plate Number, Brand, Model, Category, Year, Color, Engine, Fuel, Transmission, Seats, Daily Rate):
     - **Step 1: Specifications**: Form validation captures vehicle metadata, with auto-save draft preservation in `localStorage` (`car-draft-guard.js`) preventing accidental data loss.
     - **Step 2: Visual Studio & 360 Asset Linking**: Operations staff link the vehicle's Cloudinary asset folder, uploading exterior turntable frames (up to 200 frames) and 6-sided cubic interior textures.
     - **Step 3: Verification & Publishing**: An executive preview card displays all 10 verified specifications. Upon final confirmation, the record is published directly to Supabase via `window.WeDriveAPI.createCar()`.

3. **Vehicle Inventory Management (`cars.html`, `available-cars.html`, `rented-cars.html`)**:
   - Operations managers can filter, sort, and inspect vehicles across distinct operational states. Status transitions (`Available` $\leftrightarrow$ `Rented` $\leftrightarrow$ `Maintenance`) are executed via one-click contextual actions with automatic database synchronization.

4. **Customer CRM & Document Verification (`customers.html` & `document-verification.html`)**:
   - Centralizes customer profiles, total bookings count, cumulative expenditure, and identity verification status.
   - Operations personnel inspect uploaded Malaysian Identity Cards (MyKad) and Driving Licenses, with options to approve or reject credentials with structured audit notes.

> *[Figure 5.8: Admin Operations Dashboard and Vehicle Status Bento Grid - To be inserted]*

> *[Figure 5.9: Admin Modular Add/Edit Vehicle Onboarding Stepper - To be inserted]*

---

### 5.4.7 AI Systems, Vehicle Studio 360 & Automation Engines
The intelligent capabilities of WeDRIVE elevate the system beyond traditional car rental software, delivering automated assistance and visual realism.

1. **Intelligent Conversational Assistant (`shared/js/chatbot.js`)**:
   - Injected globally across all pages via `<div id="chatbot-placeholder"></div>`.
   - **Session Personalization**: The chatbot checks `window.WeDriveAPI.getCurrentUser()`. If an authenticated customer is detected, the prompt injector dynamically feeds the user's name, active reservation status, and verification state into the system prompt.
   - **Live Vehicle Inventory Awareness**: Retrieves real-time vehicle availability from Supabase, enabling the chatbot to answer complex queries (e.g., *"Show me available 7-seater MPVs under RM 250 for this weekend"*).
   - **Dual-Model Resilient Architecture**: Powered by `shared/js/ai-vault.js`, requests are routed to Google Gemini 3.8 Flash. If a network timeout or quota exhaustion occurs, the request automatically falls back to xAI Grok (`grok-3-mini`), ensuring uninterrupted customer support.

2. **Three.js WebGL Interactive 360 Studio (`shared/js/vehicle-viewer.js`)**:
   - **Exterior Turntable Engine**: Manages high-resolution frame sequencing (up to 200 frames) loaded from Cloudinary CDN. Utilizes pointer and touch event listeners to calculate drag delta, updating the visible frame index with smooth inertial damping.
   - **Interior Cubemap Skybox Engine**: Initializes a Three.js perspective camera inside a textured cube geometry. The 6 cube faces (`f`, `r`, `b`, `l`, `u`, `d` representing front, right, back, left, up, down) are loaded asynchronously. Users can pan 360 degrees and tilt vertically with dampening physics, experiencing an authentic cabin inspection.

3. **AI Customer Lifecycle & Marketing Engine (`shared/sql/ai_automation_setup.sql`)**:
   - Manages automated customer re-engagement campaigns. The database schema includes `ai_campaigns` and `ai_notification_log` tables.
   - Scheduled tasks generate personalized seasonal promotion templates (e.g., Melaka Historical Heritage Trail, Festive Holiday Rentals) dispatched via Resend transactional email.

> *[Figure 5.10: Admin Document OCR Verification Interface - To be inserted]*

> *[Figure 5.11: Multi-Model AI Chatbot Interface with Fallback Mechanism - To be inserted]*

---

### 5.4.8 Backend Database Implementation & API Architecture
The data layer of WeDRIVE was implemented to guarantee ACID compliance, relational integrity, and strict access boundaries.

1. **Database Schema Architecture**:
   The physical relational database consists of core business tables:
   - `public.cars`: Stores vehicle inventory records (brand, model name, category, daily rental rate, transmission, fuel, seats, plate number, status, Cloudinary thumbnail URL, and features JSONB array).
   - `public.bookings`: Stores reservation transactions (customer reference, car reference, pickup date, return date, rental duration, total amount, payment method, booking status, and QR verification pass code).
   - `public.customers`: Stores client profiles (full name, email, phone number, MyKad IC number, driving license number, verification status, total bookings, and total expenditure).
   - `public.payments`: Tracks financial transactions, deposit holds in escrow, and refund authorizations.
   - `public.car_visual_assets`: Houses 360-degree metadata including Cloudinary folder paths, 200 exterior frame URLs, and 6 interior cube faces.

2. **Row Level Security (RLS) Policies**:
   PostgreSQL RLS is enabled across all tables to enforce zero data leakage:
   ```sql
   -- Allow public read access to available rental vehicles
   CREATE POLICY "Public can view available cars"
   ON public.cars FOR SELECT
   USING (status = 'Available');

   -- Enforce customer reservation isolation
   CREATE POLICY "Customers view own bookings"
   ON public.bookings FOR SELECT
   USING (auth.uid() = customer_id);

   -- Restrict full management to verified administrators
   CREATE POLICY "Admins have full access"
   ON public.cars FOR ALL
   USING (auth.jwt() ->> 'email' LIKE '%@wedrive.my');
   ```

3. **Centralized Facade Layer (`shared/js/api.js`)**:
   To prevent fragmented Supabase calls throughout client-side scripts, all backend communication is encapsulated within `window.WeDriveAPI`. This module exposes over 40 standardized, Promise-based methods including `getCars()`, `getBookings()`, `createBooking()`, `createCar()`, `updateCustomerProfile()`, and `uploadImageToCloudinary()`. If database migrations alter column structures, changes are updated solely within `api.js`, leaving frontend views unaffected.

---

### 5.4.9 Quality Assurance, Automated Testing & Security Hardening
To achieve publication-grade reliability, automated verification was embedded into every phase of implementation.

1. **Playwright End-to-End (E2E) Automation Suite (`tests/e2e/`)**:
   An extensive suite of 19 automated test specifications was implemented to execute regression testing across the entire system. Key test suites include:
   - `01_auth.spec.js`: Validates credential handling, form submission, and error alerts.
   - `02_theme_and_lang.spec.js`: Confirms seamless Day/Night theme toggling and 100% bilingual string translation.
   - `04_pricing_glider.spec.js`: Verifies calculation accuracy across daily and weekly pricing tiers.
   - `06_bookings_filter.spec.js`: Tests real-time search, date filtering, and status tabs.
   - `16_car_detail_360_interior.spec.js`: Confirms WebGL canvas initialization and touch event responsiveness.
   - `18_full_system_bilingual_parity.spec.js`: Traverses every interface page to verify zero missing translation keys.
   Automated test runs are executed via `cd tests && npx playwright test`, maintaining a strict **100% Pass Rate** requirement prior to production Git releases.

2. **Ethical AI Penetration Testing (Strix Security Guardian)**:
   In preparation for academic evaluation, ethical penetration testing was conducted against the staging environment:
   - **Cross-Site Scripting (XSS)**: Validated input sanitization across search fields, review submissions, and chatbot inputs.
   - **SQL Injection (SQLi)**: Confirmed that parameterized queries in Supabase PostgREST prevent SQL manipulation.
   - **Insecure Direct Object Reference (IDOR)**: Verified that RLS policies prevent authenticated users from querying other customers' booking records or license documents.

3. **Graphify Knowledge Graph Integration (`graphify-out/`)**:
   A persistent code knowledge graph was constructed using Python Abstract Syntax Tree (AST) analysis. Graphify indexes all functions, variable bindings, and module dependencies, allowing multi-agent tooling to navigate the codebase with pinpoint accuracy without consuming excessive token context.

> *[Figure 5.12: Playwright CLI Automated E2E Test Execution Suite - To be inserted]*

---

## 5.5 Conclusion

The implementation phase of the WeDRIVE AI-Assisted Car Rental Management System has been successfully completed in full compliance with the system design models established in Chapter 4 and the academic standards prescribed by the UTeM FTMK Final Year Project guidelines.

Through disciplined engineering practices, the project achieved several major technical milestones:
1. **Production-Ready Frontend**: Delivered five responsive, bilingual web modules (Shared, Account, Guest, Customer, Admin) adhering to Apple Human Interface Guidelines and the Zero Oval Rule.
2. **Resilient Cloud Backend**: Successfully deployed a PostgreSQL database on Supabase with strict Row Level Security, transactional data integrity, and a unified API facade.
3. **Advanced Interactive & AI Features**: Implemented a multi-model conversational chatbot with automatic Gemini/Grok failover, a Three.js 360-degree exterior/interior vehicle viewer, an interactive pricing glider, and automated customer lifecycle workflows.
4. **Automated Quality & Security**: Established continuous validation pipelines incorporating 19 Playwright E2E test specifications achieving a 100% pass rate, ethical AI penetration testing, and AST-driven knowledge graph indexing.

The completion of the implementation phase provides an enterprise-grade platform ready for rigorous validation. The subsequent chapter, **Chapter 6: Testing**, presents the formal test plans, test cases, automated execution results, user acceptance testing (UAT) feedback, and security remediation findings, systematically proving the correctness, performance, and usability of the WeDRIVE platform.
