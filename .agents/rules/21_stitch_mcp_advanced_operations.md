# Stitch MCP Advanced Operations & Post-Prompt Maximization Standard

Dokumen ini menggariskan protokol lanjutan dan kitaran operasi maksimum bagi **Stitch MCP** — khususnya protokol **selepas prompt dijalankan (*Post-Prompt Generation Lifecycle*)** — untuk menjamin hasil antaramuka yang konsisten, bergeometri sempurna, dan bertaraf dunia (*Apple HIG Precision*).

---

## 1. Falsafah Operasi Maksimum (Beyond Basic Generation)

Kebanyakan penggunaan asas Stitch MCP hanya terhad kepada satu panggilan: `generate_screen_from_text` $\to$ ambil HTML $\to$ selesai. Kaedah asas ini sering menghasilkan isu:
- Bentuk butang ikon kadang-kala menjadi bujur (*oval distortion*).
- Tindakan bertindan (*duplicate actions*) muncul secara tidak sengaja.
- Bahan kaca terlalu kabur sehingga menjejaskan kebolehbacaan teks.

### Standard WeDRIVE: Kitaran 5-Fasa Pasca-Prompt (Post-Prompt Quality Engine)
Bagi memastikan hasil sentiasa **gempak, konsisten bentuk, dan terbaik**, AI WAJIB menguasai 5 alatan lanjutan Stitch MCP mengikut aliran kerja berikut:

```text
[1. generate_screen_from_text] (GEMINI_3_8_FLASH + AGNOSTIC)
             │
             ▼
[2. get_screen] ── Ambil Screenshot HQ & Kod HTML Mentah
             │
             ▼
[3. Zero-Oval & HIG Quality Gate] ── Pemeriksaan visual & kod DOM
             │
             ├─ Ada ketidakkonsistenan bentuk? ──► [4A. edit_screens] (Surgical Polish)
             │
             ├─ Perlu teroka alternatif halus?  ──► [4B. generate_variants] (REFINE Mode)
             │
             └─ Perlu kunci tema korporat?      ──► [4C. apply_design_system] (Asset ID)
             │
             ▼
[5. Simpan ke STITCH UI PREVIEW/] ── Fail 100% Bersih & Sempurna
```

---

## 2. Bedah Siasat 5 Alatan Lanjutan Stitch MCP

### A. Alatan 1: `get_screen` (Pemeriksaan & Pengambilan Kod Penuh)
- **Fungsi:** Mengambil metadata skrin, URL tangkapan skrin (`screenshot.downloadUrl`), dan pautan kod sumber penuh (`htmlCode.downloadUrl`).
- **Protokol:**
  - Sejurus selepas skrin dijana, panggil `get_screen` untuk memuat turun kod HTML mentah dan tangkapan skrin rasmi ke sandbox `STITCH UI PREVIEW/`.

### B. Alatan 2: `edit_screens` (Penalaan Pembedahan Tanpa Buang Reka Bentuk)
- **Fungsi:** Memperbaiki atau mengubah suai skrin sedia ada menggunakan arahan semakan bertumpu (*surgical targeted edit*).
- **Bila Digunakan:**
  - Reka bentuk asas sudah sangat cantik (90% sempurna), tetapi ada sedikit kecacatan:
    1. Butang bulat dikesan lonjong/bujur.
    2. Terdapat butang pendua ("Simpan" di atas dan di bawah).
    3. Kontras warna teks borang kurang terang.
- **Kelebihan:** Mengelakkan penjanaan semula dari sifar (*full regeneration*) yang membazir masa dan berisiko menukar susun atur yang sudah diluluskan.
- **Format Parameter:**
  ```json
  {
    "projectId": "1862124494843018493",
    "selectedScreenIds": ["<SCREEN_ID>"],
    "modelId": "GEMINI_3_8_FLASH",
    "deviceType": "AGNOSTIC",
    "prompt": "Surgical Polish: 1) Enforce strict 1:1 circle on all circular icon buttons (aspect-ratio: 1/1, border-radius: 50%, padding: 0). 2) Ensure all text buttons are 9999px pills. 3) Remove duplicate action buttons so only the bottom floating dock contains the official primary button."
  }
  ```

### C. Alatan 3: `generate_variants` (Penerokaan Variasi Halus 'REFINE')
- **Fungsi:** Menjana 2 hingga 3 variasi alternatif bagi skrin sedia ada dengan kawalan kreatif ketat.
- **Peraturan Mutlak Parameter `creativeRange`:**
  - **MANDATORI:** Sentiasa gunakan `"REFINE"` (*Subtle refinements, closely adhering to original*).
  - **DILARANG:** Menggunakan `"REIMAGINE"` secara semberono kerana ia akan mengubah struktur drastik dan merosakkan piawaian Apple HIG.
- **Penumpuan Aspek (`aspects`):**
  - Hadkan penalaan kepada aspek tertentu: `["LAYOUT"]` atau `["COLOR_SCHEME"]` atau `["TEXT_FONT"]`.
- **Format Parameter:**
  ```json
  {
    "projectId": "1862124494843018493",
    "selectedScreenIds": ["<SCREEN_ID>"],
    "modelId": "GEMINI_3_8_FLASH",
    "deviceType": "AGNOSTIC",
    "prompt": "Refine the bento layout composition to maximize spatial calm and contrast clarity.",
    "variantOptions": {
      "creativeRange": "REFINE",
      "aspects": ["LAYOUT", "COLOR_SCHEME"],
      "variantCount": 2
    }
  }
  ```

### D. Alatan 4: `apply_design_system` (Penguatkuasaan Sistem Reka Bentuk)
- **Fungsi:** Menguatkuasakan aset sistem reka bentuk berdaftar kepada satu atau lebih skrin.
- **Aset Rasmi WeDRIVE:** `assets/e051cb5fe5c44d05bd007cde43ddad8e` (*WeDRIVE Apple HIG & Obsidian Precision*).
- **Kegunaan:** Jika sesuatu skrin yang dijana menggunakan warna asing atau fon yang tersasar, alatan ini secara automatik menukar semua pembolehubah warna, fon, dan jejari bucu kepada token rasmi WeDRIVE.

### E. Alatan 5: `upload_design_md` & `create_design_system_from_design_md` (Penyegerakan Master Token)
- **Fungsi:** Memuat naik fail `.agents/DESIGN.md` yang telah di-encode Base64 ke projek Stitch dan mendaftarkannya sebagai sistem reka bentuk aktif.
- **Kelebihan:** Memastikan enjin AI Stitch sentiasa membaca token terkini projek WeDRIVE secara terus tanpa halusinasi gaya.

---

## 3. Senarai Semak Pasca-Prompt (Post-Prompt Quality Gate Checklist)

Sebelum sebarang fail HTML Stitch dipindahkan ke `STITCH UI PREVIEW/` untuk semakan pengguna, AI WAJIB menyemak 4 kriteria berikut dalam kod yang dijana:

1. **Geometri Bulat Sempurna (Zero Oval Rule):**
   - [ ] Setiap butang ikon bulat mempunyai `aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`.
   - [ ] Tiada butang bulat yang lonjong akibat `padding: 8px 16px`.
2. **Butang Teks Kapsul Pil Simetri:**
   - [ ] Semua butang yang mengandungi teks menggunakan `border-radius: 9999px; white-space: nowrap !important;`.
3. **Sifar Tindakan Bertindan (Single Source of Action):**
   - [ ] Hanya SATU butang tindakan utama wujud dalam paparan (di bahagian dok terapung bawah).
   - [ ] Tiada butang "Simpan" atau "Seterusnya" berulang di bar tajuk atas atau di dalam badan kad.
4. **Tipografi Tabular & Angka:**
   - [ ] Semua nilai mata wang (RM), plat kereta, kiraan masa, dan peratusan menggunakan `font-variant-numeric: tabular-nums` atau kelas `tabular-nums`.

Sekiranya mana-mana kriteria di atas gagal, AI **WAJIB menjalankan `edit_screens` serta-merta** untuk membaiki kecacatan tersebut sebelum menyerahkan pratonton kepada pengguna!

---

## 4. Had Siling 12,000 Aksara
Fail ini mematuhi ketetapan siling maksimum **12,000 aksara** seperti yang termaktub dalam [12_max_content_limit.md](12_max_content_limit.md).
