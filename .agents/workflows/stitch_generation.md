---
description: Alur kerja rasmi penjanaan, pembaikan, dan integrasi antaramuka WeDRIVE menggunakan Stitch MCP bertaraf Gemini 3.8 Ultra High-Quality
---

# Alur Kerja Penjanaan UI Stitch MCP (Gemini 3.8 Ultra High-Quality Tier)

Alur kerja ini menetapkan langkah demi langkah yang mandatori bagi ejen AI dan pembangun dalam menghasilkan antaramuka baharu atau menyemak semula skrin sedia ada bagi sistem sewaan kereta korporat **WeDRIVE** menggunakan **Stitch MCP**.

---

## 💎 Fasa 0: Prinsip Kualiti & Parameter Mandatori

> **"Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)."**

Setiap panggilan alatan Stitch MCP WAJIB menggunakan spesifikasi parameter berikut:

```json
{
  "projectId": "1862124494843018493",
  "designSystem": "assets/d66115a696e44b2381ec5f5d829e8a88",
  "modelId": "GEMINI_3_1_PRO",
  "deviceType": "DESKTOP"
}
```

* **Standard Kualiti Model:** **Gemini 3.8 (Ultra High-Quality Tier / Deep Reasoning)**.
* **Pemetaan Parameter Enjin:** Parameter `modelId` WAJIB dihantar sebagai `"GEMINI_3_1_PRO"` (iaitu identifier teknikal rasmi Stitch MCP untuk model penaakulan tertinggi Google).
* **Larangan Model Pantas:** Dilarang sama sekali menggunakan `GEMINI_3_FLASH` bagi skrin teras kerana ia memotong perincian visual Apple HIG.

---

## 📝 Fasa 1: Pembinaan Prompt Berpandukan Apple HIG & DESIGN.md

Sebelum memanggil alatan `generate_screen_from_text`, pastikan prompt mengandungi 5 blok teras:

1. **Konteks Operasi Sebenar (*Domain Reality*)**:
   - Sistem mobiliti kenderaan profesional di Melaka (contoh: Terminal Lapangan Terbang Batu Berendam, Melaka Sentral, Jonker Point).
   - Istilah automotif sah: Nombor Pendaftaran (JPJ Plate), Kadar Sewaan Harian, Deposit Keselamatan, Status Ketersediaan, Transmisi, dan Bahan Api.
2. **Geometri & Token Visual Apple HIG**:
   - Rujuk token rasmi [`.agents/DESIGN.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/DESIGN.md).
   - Susun atur Bento Grid dengan kad squircle `border-radius: 24px` atau `28px`.
   - Butang kapsul `border-radius: 9999px` dan butang ikon bulat 1:1 `border-radius: 50%`.
   - Angka metrik dan harga menggunakan fon tabular (`tabular-nums`).
3. **Dwi-Tema Konsisten**:
   - Mod Siang: Kanvas `#F5F5F7` / Kad `#FFFFFF` dengan bayang ambien lembut.
   - Mod Malam (Obsidian): Kanvas `#000000` / Kad Bento `#161618`.
4. **Bahan Kaca Apple Thin Material**:
   - `-webkit-backdrop-filter: blur(20px) saturate(180%); backdrop-filter: blur(20px) saturate(180%);`.

---

## ⏳ Fasa 2: Protokol Kesabaran & Batas Masa (Patience & Polling Protocol)

Penjanaan dengan model penaakulan tinggi mengambil masa 2 hingga 4 minit untuk menaakul hierarki sub-piksel secara mendalam.

1. **Dilarang Mencuba Semula Tergesa-Gesa (DO NOT RETRY)**:
   - Apabila memanggil `generate_screen_from_text`, jangan batalkan atau panggil semula alatan jika ia masih memproses.
2. **Pengendalian Timeout / Ralat Sambungan**:
   - Jika panggilan `generate_screen_from_text` mengembalikan batas masa (*timeout*), proses di pelayan Stitch selalunya **tetap berjalan sehingga selesai**.
   - Gunakan kaedah `get_screen` selang **30 saat sehingga 10 kali** dengan `projectId: "1862124494843018493"` untuk memeriksa status skrin siap.

---

## 🚫 Fasa 3: Penapis Penyingkiran Templat AI Murahan (Anti-Cheesy AI Filter)

Selepas kod antaramuka dijana oleh Stitch, lakukan saringan mandatori sebelum menyerap kod ke dalam fail projek:

1. **Singkirkan Istilah Khayalan AI**:
   - Padam istilah seperti: *"Quantum Fleet"*, *"Neural Velocity"*, *"Sanitasi Hospital"*, *"Cyber Turbo"*.
   - Gantikan dengan istilah industri sah: *"Armada Tersedia"*, *"Pemeriksaan Pra-Serahan"*, *"Invois Cukai Rasmi"*.
2. **Singkirkan Graf / Nombor Statik Palsu**:
   - Jangan kekalkan graf hiasan yang tiada kaitan dengan data operasi WeDRIVE.
3. **Periksa Integriti Elemen Interaktif**:
   - Setiap butang mesti mempunyai fungsi operasi yang jelas (contoh: Tempah, Muat Turun Resit, Sahkan Lesen, Perincian Kenderaan).

---

## 💻 Fasa 4: Pengintegrasian Kod Fizikal Bersih (Zero Inline Styles)

1. **Pemisahan Kod CSS**:
   - Kod CSS yang diekstrak daripada Stitch WAJIB disepadukan ke dalam fail master [`shared/css/wedrive.css`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/shared/css/wedrive.css).
   - Dilarang meninggalkan blok `<style>` besar atau atribut `style="..."` sebaris dalam HTML.
2. **Penyambungan Punca Data Sebenar**:
   - Sambungkan jadual, kad kenderaan, dan borang kepada enjin API sebenar: `window.WeDriveAPI` / Supabase.
3. **Struktur Fail Fizikal Dedicated**:
   - Setiap halaman baharu mesti disimpan sebagai fail fizikal `.html` tersendiri di bawah modul berkaitan (contoh: `admin/pages/...` atau `customer/pages/...`).

---

## 🧪 Fasa 5: Pengesahan & Ujian Automasi Mandatori

Setiap kali skrin baharu siap diintegrasikan:

1. Jalankan suite ujian Playwright:
   ```bash
   cd tests && npx playwright test
   ```
2. Pastikan kadar kelulusan kekal **100% Pass Rate**.
3. Kemas kini pangkalan pengetahuan Graphify:
   ```bash
   graphify update .
   ```
4. Catat ringkasan pembangunan dalam `PLAN/FYP1_to_FYP2_Development_Summary.md`.
5. Buat commit Git dengan format `X.X.X <Penerangan>` dan tag versi yang sepadan.
