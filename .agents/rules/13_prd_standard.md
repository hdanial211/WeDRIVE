---
trigger: always_on
---

# WeDRIVE Product Requirements Document (PRD) Standards

## 1. Mandatori Penyediaan PRD Sebelum Sebarang Pengekodan

- **Syarat Mutlak Gatekeeper:**
  - Sebelum sebarang baris kod ditulis atau diubah bagi ciri baharu, modul baharu, penalaan semula reka bentuk, atau pembaikan seni bina, AI **WAJIB menyediakan seksyen PRD (Product Requirements Document)** yang terperinci di dalam `implementation_plan.md`.
  - Pembangunan kod DILARANG bermula selagi seksyen PRD tidak dilengkapkan dan diluluskan oleh pengguna.

---

## 2. Enam Komponen Wajib PRD (*The 6 Mandatory PRD Pillars*)

Setiap dokumen PRD di dalam `implementation_plan.md` WAJIB merangkumi 6 komponen berikut:

### 1. Objektif & Skop Perniagaan (*Objective & Scope*)
- Menjelaskan masalah operasi mobiliti yang ingin diselesaikan.
- Impak perniagaan terhadap kecekapan sewaan, kepuasan pengguna, atau ketepatan pengurusan tempahan WeDRIVE.
- Skop kerja yang jelas (apa yang termasuk dan apa yang di luar skop / *out-of-scope*).

### 2. Sasaran Pengguna & Aliran Tindakan (*User Personas & Use Cases*)
- Menentukan peranan pengguna yang terlibat:
  - **Pelanggan (Customer):** Carian kereta, tempahan pintar, bayaran deposit, semakan pas digital QR.
  - **Pentadbir (Admin):** Pemantauan operasi depot, kelulusan verifikasi dokumen OCR, semakan inventori kereta.
  - **Pelawat (Guest):** Penerokaan kadar harga dan pilihan kereta tanpa akaun.
- Aliran langkah demi langkah (*step-by-step user journey*) dari permulaan hingga selesai.

### 3. Keperluan Fungsian Terperinci (*Functional Requirements*)
- Huraian tepat bagi setiap elemen interaktif:
  - Butang tindakan (nama label, fungsi klik, maklum balas sentuhan).
  - Borang input (validasi, jenis data, ralat jika tidak sah).
  - Jadual dan penapis (keadaan kosong /*empty state*, pengisihan, penapisan data).
  - Lembaran modal dan lencana status.

### 4. Keperluan Bukan Fungsian & Piawaian Apple HIG (*Non-Functional & Apple HIG UX*)
- **Ergonomik Sentuhan:** Zon sentuhan minimum $44 \times 44$px pada peranti mudah alih.
- **Tipografi:** Fon sistem Apple San Francisco / Inter dengan `font-variant-numeric: tabular-nums` bagi angka dan harga.
- **Geometri Tegas:** Squircle `border-radius: 24px/28px`, bulat 1:1 sempurna untuk butang ikon sahaja, kapsul `9999px` untuk butang berteks.
- **Kedalaman Kaca:** Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).
- **Responsif:** Sifar limpahan mendatar (*zero horizontal scroll*) merentas MacBook, iPad, dan iPhone.

### 5. Integriti Data & Pemetaan API (*Data Models & API Contracts*)
- Pemetaan terus ke sumber data sebenar (`window.WeDriveAPI` atau klien Supabase PostgreSQL).
- **Sifar Data Palsu:** Dilarang meletakkan data cereka yang tidak berhubung dengan pangkalan data.
- Menentukan jenis data (*schema types*), kunci primer (*primary keys*), dan dasar keselamatan baris (*Row Level Security*).

### 6. Kriteria Penerimaan & Verifikasi Automasi (*Acceptance Criteria & Verification Plan*)
- Senarai semak kelulusan (*checklist*) yang boleh diuji.
- Suite ujian Playwright CLI yang wajib dijalankan (`cd tests && npx playwright test`).
- Syarat kelulusan mutlak: **100% Pass Rate** sebelum sebarang commit git.

---

## 3. Had Panjang & Pemeliharaan Konteks
- Seksyen PRD hendaklah padat, tersusun, menggunakan senarai bernombor dan jadual jika perlu, serta mematuhi had siling fail $\le 12,000$ aksara seperti yang ditetapkan dalam [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
