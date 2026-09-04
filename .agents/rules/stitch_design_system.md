# Stitch MCP & High-Fidelity UI Generation Standards (WeDRIVE)

Dokumen ini menggariskan piawaian mandatori bagi penggunaan **Stitch MCP** untuk penjanaan, penyemakan semula, dan penyeragaman antaramuka sistem **WeDRIVE**.

---

## 1. Konfigurasi Projek & Rujukan Stitch MCP

Setiap kali alatan Stitch MCP digunakan untuk mereka bentuk skrin atau mengemas kini sistem reka bentuk:

| Parameter | Nilai Mandatori | Penerangan |
| :--- | :--- | :--- |
| **Project ID** | `1862124494843018493` | Projek rasmi Stitch: *AI-Powered Car Rental Management* |
| **Design System** | `assets/40090a9886c4444abca795c82673f4c8` / `assets/518f31ad774f458da15c7fc5ff999bbf` | Sistem reka bentuk *WeDRIVE Lumina & Apple HIG Precision* |
| **Model Generasi** | `GEMINI_3_1_PRO` / `GEMINI_3_PRO` | Sentiasa gunakan model penaakulan tinggi bagi menjamin kualiti Apple HIG |
| **Device Type** | `DESKTOP` (Admin) / `MOBILE` (Pelanggan) | Konfigurasi mengikut peranan modul sasaran |
| **Rujukan Gaya** | `DESIGN.md` | Fail spesifikasi master di punca repositori |

---

## 2. Alur Kerja Penjanaan Antaramuka Stitch (Workflow)

1. **Semak & Muat Turun DESIGN.md**:
   - Pastikan reka letak mematuhi token dalam `DESIGN.md` (warna, saiz squircle 24px/28px, tipografi SF Pro / Inter, tabular-nums).
2. **Jana Skrin Menggunakan `generate_screen_from_text`**:
   - Sertakan prompt terperinci yang menekankan keperluan perniagaan kereta sewa sebenar, Apple Bento Hero, lencana status dengan *live-pulse-dot*, dan butang taktil.
   - Tetapkan `modelId: "GEMINI_3_1_PRO"` dan `designSystem: "assets/518f31ad774f458da15c7fc5ff999bbf"`.
3. **Penyelarasan Kod Fizikal & Penyingkiran Templat AI Murahan**:
   - Kod HTML/CSS yang dijana WAJIB disatukan ke dalam `shared/css/wedrive.css` (bukan inline style berlebihan).
   - Pastikan tiada istilah cereka (*cheesy AI clichés* seperti 'Quantum Fleet', 'Hospital Sanitization').
   - Sambungkan semua butang dan tindakan ke punca data sebenar (`window.WeDriveAPI`).

---

## 3. Senarai Alatan Stitch MCP yang Digunakan

- `list_projects`: Semak status projek WeDRIVE.
- `get_project`: Periksa skrin sedia ada dan tema reka bentuk.
- `generate_screen_from_text`: Cipta skrin baharu berasaskan prompt dan design system.
- `get_screen`: Muat turun kod HTML dan pratonton tangkapan skrin.
- `edit_screens`: Buat perubahan kecil pada skrin sedia ada.
- `upload_design_md`: Muat naik `DESIGN.md` terkini ke projek Stitch.
- `apply_design_system`: Terapkan tema konsisten kepada skrin baharu.
