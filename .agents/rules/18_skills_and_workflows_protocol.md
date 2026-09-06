# WeDRIVE Intelligent Skills & Automation Workflows Mandatory Protocol

## 1. Mandatori Pemakaian Instrumen Pintar (Mandatory Active Usage)

Bagi menjamin kualiti kejuruteraan perisian bertaraf Apple Developer dan kejayaan penilaian Tesis FYP 2, ejen AI **WAJIB MEMAKAI DAN MENGAKTIFKAN** 6 Kemahiran (*Skills*) dan 6 Alur Kerja (*Workflows*) mengikut fasa kitaran hidup pembangunan:

```text
[Permintaan Pengguna] ──► FASA 0: Penyelarasan Prompt & Kehendak (prompt-polisher & /perfect_prompt)
                                   │
                                   ▼
                          FASA 1: Perancangan & PRD (/prd_creator)
                                   │
                                   ▼
                          FASA 2: Reka Bentuk & Antaramuka (frontend-ui)
                                   │
                                   ▼
                          FASA 3: Pangkalan Data & API (supabase-ops & context7)
                                   │
                                   ▼
                          FASA 4: Pemeriksaan Kualiti & Ujian (/qa_audit & playwright-testing)
                                   │
                                   ▼
                          FASA 5: Audit Keselamatan Siber (strix-security-audit)
                                   │
                                   ▼
                          FASA 6: Pelepasan Versi & Git (/release_push SemVer X.Y.Z)
```

---

## 2. Matriks Pemakaian 6 Kemahiran Teras WeDRIVE (.agents/skills/)

### A. Kemahiran `frontend-ui` (Kejuruteraan Reka Bentuk Apple HIG)
- **Bila Digunakan:** Setiap kali membina atau mengubah fail HTML, CSS, dan reka letak antaramuka.
- **Peraturan Mandatori:**
  - Patuhi susun atur kad Bento Grid simetri dengan sifar ruang mati (*Zero Dead Space*).
  - Kedalaman bahan kaca Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).
  - **Sifar Bujur (Zero Oval Rule):** Butang ikon WAJIB bulat tepat 1:1 sempurna (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`). Butang berteks WAJIB mengembang secara mendatar menjadi kapsul/pil simetri (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).
  - Maklum balas sentuhan fizik Apple (`scale(0.97)` pada sentuhan butang).

### B. Kemahiran `context7` (Dokumentasi Masa Nyata & Sifar Kod Lapuk)
- **Bila Digunakan:** Setiap kali memerlukan maklumat penggunaan pakej atau API bahagian luar (Supabase JS, Flatpickr, Anime.js, Playwright).
- **Peraturan Mandatori:**
  - Panggil Context7 MCP secara langsung menerusi `resolve-library-id` $\to$ `query-docs`.
  - Dilarang mereka-reka parameter atau menggunakan API yang telah lapuk (*deprecated*).

### C. Kemahiran `supabase-ops` (Operasi Pangkalan Data PostgreSQL & RLS)
- **Bila Digunakan:** Semasa mereka bentuk skema jadual, menyemak integriti data sewaan, atau menulis pertanyaan SQL.
- **Peraturan Mandatori:**
  - Rujuk struktur jadual standard: `cars`, `bookings`, `profiles`, `payments`.
  - Pastikan Row Level Security (RLS) sentiasa aktif untuk pengasingan peranan pelanggan dan pentadbir.
  - **Sifar Data Palsu (Zero Fake Data Rule):** Data yang dipaparkan mesti bersumberkan rekod Supabase atau klien data rasmi `shared/dummy/data.json` / `window.WeDriveAPI`.

### D. Kemahiran `playwright-testing` (Automasi Ujian E2E)
- **Bila Digunakan:** Setiap kali selesai membuat sebarang perubahan kod, penalaan CSS, atau penambahan halaman.
- **Peraturan Mandatori:**
  - Jalankan suite ujian: `cd tests && npx playwright test`.
  - Wajib mencapai kadar kelulusan **100% Pass Rate** sebelum commit dibenarkan.
  - Dilarang sama sekali mengubah alamat e-mel atau kata laluan akaun rasmi ujian (`admin@wedrive.my` & `ahmad@wedrive.my`).

### E. Kemahiran `strix-security-audit` (Simulasi Penembusan Etika Siber)
- **Bila Digunakan:** Sebelum pelancaran modul baharu atau semasa penyediaan bahan kajian keselamatan bagi Tesis FYP 2.
- **Peraturan Mandatori:**
  - Jalankan pengimbasan kelemahan OWASP Top 10 (XSS, SQLi, perlindungan PII, tamat masa sesi 10 minit pentadbir).
  - Sediakan jadual laporan audit keselamatan empirikal untuk Bab 4 & Bab 5 Laporan FYP 2.

### F. Kemahiran `prompt-polisher` (Penalaan Idea Kasar ke Spesifikasi 4D)
- **Bila Digunakan:** Apabila pengguna mengemukakan hasrat umum atau idea kasar yang memerlukan penalaan pantas mengikut formula emas WeDRIVE.
- **Peraturan Mandatori:**
  - Petakan idea kasar ke dalam 4 dimensi teknikal: Apple HIG UI, Supabase Data, Playwright QA, dan Bahasa Melayu Moden 2026.
  - Elakkan soalan bertubi-tubi yang membebankan pengguna; terus sediakan cadangan prompt siap guna.

---

## 3. Matriks Pelaksanaan 6 Alur Kerja Pintar (.agents/workflows/)

1. **`/perfect_prompt` (Penyelarasan Kehendak & Formula Emas 3 Baris):**
   - Mengaktifkan temuduga pantas `/grill-me` dan merumuskan formula emas: 1. Sasaran Fail `@target_file`, 2. Tindakan/Matlamat, 3. Aliran Visual/Interaksi.
2. **`/prd_creator` (Penjanaan PRD 6 Pilar Mandatori):**
   - Wajib dimulakan sebelum sebarang baris kod ditulis.
   - Kod hanya boleh disentuh setelah dokumen PRD di `implementation_plan.md` diluluskan oleh pengguna.
3. **`/qa_audit` (Audit Kualiti Pra-Commit):**
   - Menjalankan semakan had siling aksara 12,000 (`wc -m .agents/rules/*.md`), semakan amaran linter, dan ujian Playwright 100% lulus.
4. **`/release_push` (Pelepasan Versi SemVer):**
   - Menemui versi terkini menerusi `git describe --tags --abbrev=0`, mengira nombor versi `X.Y.Z`, mencipta tag sepadan, dan menolak ke GitHub.
5. **`/graphify` (Pengemaskinian Graf Pengetahuan):**
   - Menjalankan `graphify update .` bagi memetakan nod sistem terkini tanpa pembaziran kuota token AI.
6. **`/stitch_generation` (Penjanaan UI Gemini 3.8 UHQ):**
   - Membina skrin antaramuka baharu menggunakan Google Stitch MCP mengikut panduan reka bentuk WeDRIVE.

---

## 4. Polisi Sifar Pengabaian & Penguatkuasaan Sesi
- Ejen AI tertakluk secara mutlak kepada protokol ini. Sebarang kegagalan mematuhi aliran instrumen di atas dianggap sebagai pelanggaran protokol integriti sistem.
- Fail ini tertakluk kepada had siling **maksimum 12,000 aksara** seperti yang digariskan dalam [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
