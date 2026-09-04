# Stitch MCP & Ultra High-Fidelity UI Generation Standards (WeDRIVE)

Dokumen ini menggariskan piawaian mandatori bagi penggunaan **Stitch MCP** untuk penjanaan, penyemakan semula, dan penyeragaman antaramuka sistem **WeDRIVE** mengikut piawaian kualiti tertinggi Apple Human Interface Guidelines (HIG).

---

## 💎 PRINSIP TERAS: KUALITI MENYELURUH MENGATASI KEPANTASAN (QUALITY OVER SPEED)

> **"Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)."**

1. **Keutamaan Kualiti & Perincian Maksimum**:
   - Pembangun/AI dilarang sama sekali mengejar kepantasan dengan mengorbankan ketelitian seni bina antaramuka.
   - Setiap elemen antaramuka mesti menyerupai perisian korporat rasmi (setaraf Linear, Stripe, Apple Developer) dengan istilah automotif sebenar, kad Bento squircle (24px/28px), nombor tabular (`tabular-nums`), dan bahan kaca berkualiti tinggi.
2. **Larangan Model Pantas (Flash / Fast Model Ban)**:
   - **DILARANG MENGGUNAKAN `GEMINI_3_FLASH`** untuk halaman teras sistem. Model Flash menghasilkan reka letak generik dan memotong perincian kritikal demi kepantasan semata-mata.
3. **Penaiktarafan Model Generasi Rasmi**:
   - Model `GEMINI_3_PRO` telah **DITAMATKAN (DEPRECATED)**.
   - **Model Generasi Mandatori**: **`GEMINI_3_1_PRO`** (Tahap Model Penaakulan & Reka Bentuk Tertinggi / Ultra High-Quality Tier).

---

## 🏛️ 1. Konfigurasi Projek & Rujukan Stitch MCP

Setiap kali alatan Stitch MCP digunakan untuk mereka bentuk skrin atau mengemas kini sistem reka bentuk:

| Parameter | Nilai Mandatori | Penerangan Rasmi |
| :--- | :--- | :--- |
| **Project ID** | `1862124494843018493` | Projek rasmi Stitch: *AI-Powered Car Rental Management* |
| **Design System** | `assets/d66115a696e44b2381ec5f5d829e8a88` / `assets/40090a9886c4444abca795c82673f4c8` / `assets/518f31ad774f458da15c7fc5ff999bbf` | Sistem reka bentuk rasmi *WeDRIVE Lumina & Apple HIG Precision* |
| **Model Generasi (`modelId`)** | **`GEMINI_3_1_PRO`** | **MANDATORI:** Tahap penaakulan tertinggi (Ultra High Quality Tier) bagi memastikan kehalusan Apple HIG |
| **Device Type** | `DESKTOP` (Admin) / `MOBILE` (Pelanggan) | Dilarang menggunakan `AGNOSTIC` melainkan komponen bebas peranti |
| **Rujukan Gaya Utama** | `DESIGN.md` | Fail spesifikasi master di direktori punca repositori |

---

## ⚙️ 2. Protokol Masa & Kesabaran Alatan (Patience & Polling Protocol)

Penjanaan antaramuka menggunakan model penaakulan tinggi `GEMINI_3_1_PRO` memproses reka letak kompleks, hierarki warna sub-piksel, dan token Apple HIG secara mendalam. Proses ini mengambil masa beberapa minit.

1. **JANGAN CUBA SEMULA SECARA TERGESA-GESA (DO NOT RETRY)**:
   - Jangan tekan atau panggil `generate_screen_from_text` kali kedua sekiranya alatan sedang berjalan atau memberi amaran batas masa (*timeout*).
2. **Pengendalian Batas Masa Rangkaian**:
   - Jika panggilan alatan tamat tempoh (*timeout*) atau mengalami ralat sambungan, proses penjanaan di pelayan Stitch selalunya **tetap berjalan dan berjaya**.
   - Gunakan kaedah `get_screen` selang **30 saat sehingga 10 kali** untuk mendapatkan skrin yang telah siap dijana di latar belakang sebelum menganggap proses gagal.

---

## 🛠️ 3. Alur Kerja Penjanaan Antaramuka Stitch (Step-by-Step Workflow)

1. **Pastikan Konsistensi `DESIGN.md`**:
   - Semak fail [`DESIGN.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/DESIGN.md) di direktori punca.
   - Pastikan warna Day Mode (`#F5F5F7` / `#FFFFFF`), Obsidian Night Mode (`#000000` / `#161618`), radius bento `24px`/`28px`, kapsul `9999px`, dan butang bulat 1:1 `50%` diselaraskan.
   - Muat naik versi terkini melalui `upload_design_md` jika terdapat perubahan token.
2. **Jana Skrin Menggunakan `generate_screen_from_text`**:
   - Parameter wajib:
     ```json
     {
       "projectId": "1862124494843018493",
       "prompt": "<Prompt terperinci Apple HIG dengan keperluan operasi mobiliti sebenar>",
       "modelId": "GEMINI_3_1_PRO",
       "designSystem": "assets/40090a9886c4444abca795c82673f4c8",
       "deviceType": "DESKTOP"
     }
     ```
3. **Penyelarasan Kod Fizikal & Penyingkiran Templat AI Murahan**:
   - Kod HTML/CSS yang dijana WAJIB disatukan ke dalam fail master `shared/css/wedrive.css` (bukan inline `<style>` berlebihan).
   - Buang sebarang istilah cereka murah (*cheesy AI clichés* seperti 'Quantum Fleet', 'Hospital Sanitization').
   - Sambungkan semua butang dan tindakan ke punca data operasi sebenar (`window.WeDriveAPI`).

---

## 📋 4. Senarai Alatan Stitch MCP Rasmi

- `list_projects`: Semak projek aktif WeDRIVE.
- `get_project`: Periksa skrin sedia ada dan tema reka bentuk.
- `generate_screen_from_text`: Cipta skrin baharu dengan model `GEMINI_3_1_PRO` dan design system.
- `get_screen`: Ambil kod HTML dan pratonton tangkapan skrin hasil penjanaan.
- `edit_screens`: Buat perubahan terperinci pada skrin sedia ada.
- `upload_design_md`: Muat naik `DESIGN.md` terkini ke projek Stitch.
- `create_design_system_from_design_md`: Cipta ID sistem reka bentuk baharu daripada fail `DESIGN.md`.
- `apply_design_system`: Terapkan tema konsisten kepada skrin terpilih.
