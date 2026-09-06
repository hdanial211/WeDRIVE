---
description: Alur kerja rasmi penyediaan Dokumen Keperluan Produk (PRD) 6 Pilar Mandatori di dalam implementation_plan.md sebelum sebarang kod ditulis atau diubah.
---

# Alur Kerja /prd_creator: Penjanaan PRD 6 Pilar Mandatori WeDRIVE

Alur kerja ini WAJIB dimulakan setiap kali pengguna meminta penambahan ciri baharu, modul baharu, penalaan semula reka bentuk, atau pembaikan seni bina sistem.

---

## Prinsip Gatekeeper: Sifar Kod Sebelum PRD Diluluskan
Pembangunan kod DILARANG SAMA SEKALI bermula selagi seksyen PRD ini belum ditulis di dalam `implementation_plan.md` dan diluluskan secara rasmi oleh pengguna.

---

## Templat Standard PRD 6 Pilar WeDRIVE

Salin dan lengkapkan struktur berikut ke dalam `implementation_plan.md`:

```markdown
# [Nama Ciri / Modul Baharu]

## 📋 Dokumen Keperluan Produk (PRD) — 6 Pilar Mandatori

### 1. Objektif & Skop Perniagaan (Objective & Scope)
- **Masalah Operasi**: Huraian masalah yang dialami oleh operasi sewaan kereta WeDRIVE.
- **Impak Perniagaan**: Peningkatan kecekapan, kadar tempahan, atau kepuasan pengguna.
- **Skop Kerja**: Perincian apa yang termasuk (*in-scope*) dan apa yang tidak termasuk (*out-of-scope*).

### 2. Sasaran Pengguna & Aliran Tindakan (User Personas & Use Cases)
- **Peranan Pengguna**: Pelanggan (Customer), Pentadbir (Admin), atau Tetamu (Guest).
- **Aliran Langkah Demi Langkah**: Langkah interaksi dari mula hingga selesai transaksi.

### 3. Keperluan Fungsian Terperinci (Functional Requirements)
- **Butang Tindakan**: Nama label, fungsi klik, maklum balas sentuhan fizik Apple (`scale(0.97)`).
- **Borang Input**: Jenis data, validasi nombor/e-mel, mesej ralat mesra pengguna.
- **Jadual & Penapisan**: Logik penapisan masa nyata dan paparan keadaan kosong (*empty state*).
- **Modal & Lembaran**: Tingkah laku kemunculan (*sheet drawer* pada mudah alih, modal terapung pada desktop).

### 4. Keperluan Bukan Fungsian & Piawaian Apple HIG (Non-Functional & Apple HIG UX)
- **Ergonomik Sentuhan**: Sasaran sentuhan minimum 44px × 44px pada peranti mudah alih.
- **Tipografi Tabular**: `tabular-nums` untuk semua paparan nombor dan harga RM.
- **Geometri Tegas**: Bulat 1:1 sempurna untuk butang ikon; kapsul 9999px untuk butang berteks.
- **Kedalaman Kaca**: `backdrop-filter: blur(20px) saturate(180%)`.
- **Had Siling Aksara**: Setiap fail peraturan atau panduan kekal $\le 12,000$ aksara.

### 5. Integriti Data & Pemetaan API (Data Models & API Contracts)
- Pemetaan terus kepada jadual pangkalan data Supabase (`cars`, `bookings`, `profiles`, `payments`).
- Menguatkuasakan Peraturan Sifar Data Palsu (*Zero Fake Data Rule*).

### 6. Kriteria Penerimaan & Verifikasi Automasi (Acceptance Criteria & Verification Plan)
- Senarai semak kriteria kelulusan fungsian.
- Ujian automasi Playwright CLI yang wajib dijalankan (`cd tests && npx playwright test` - 100% Pass).
```

---

## Langkah Seterusnya:
1. Simpan dokumen ke dalam fail `implementation_plan.md` dengan `ArtifactMetadata: { RequestFeedback: true, UserFacing: true }`.
2. Minta kelulusan rasmi pengguna (*Proceed*).
3. Hanya mulakan pengkodan selepas pengguna memberi kebenaran.
