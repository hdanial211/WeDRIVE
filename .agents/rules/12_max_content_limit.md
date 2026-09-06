---
trigger: always_on
---

# WeDRIVE Maximum Content Limit & Modular Rule Architecture

## 1. Peraturan Mandatori Had Siling 12,000 Aksara (Strict 12,000 Characters Limit)

- **Had Siling Mutlak Per Fail:**
  - Sebarang fail peraturan (`.agents/rules/*.md`), panduan kemahiran (`skills/*`), fail struktur, atau dokumen seni bina WAJIB dihadkan kepada **maksimum 12,000 aksara (characters)** per fail.
  - Nilai ini diukur secara tepat menggunakan perintah terminal:
    ```bash
    wc -m <nama_fail.md>
    ```
- **Sifar Toleransi Terhadap Limpahan Konteks:**
  - DILARANG SAMA SEKALI membiarkan mana-mana fail peraturan melebihi 12,000 aksara walaupun sebanyak 1 aksara.
  - Kegagalan mematuhi had ini akan menyebabkan risiko pemotongan konteks (*context truncation*), penurunan ketepatan AI, dan pembaziran token pemikiran.

---

## 2. Prinsip Pemecahan Modular: Bebas Mengembangkan Hingga 20–30 Fail Peraturan

- **Pendekatan Modular & Bebas Tambah Fail:**
  - Pengguna memberi kebenaran mutlak untuk menambah seberapa banyak fail peraturan baharu secara modular (contoh: dari 12 sehingga 20, 25, atau 30 fail bernombor `XX_nama_peraturan.md`).
  - Matlamat utama ialah **AI memahami setiap peraturan dengan jelas, mendalam, dan tanpa sebarang kekaburan** (*crystal clear comprehension*).
- **Strategi Agihan Topik (Separation of Concerns):**
  - JANGAN kumpulkan semua peraturan ke dalam satu fail yang sesak.
  - Setiap fail peraturan WAJIB mempunyai satu skop atau domain tumpuan khusus yang tersendiri (contoh: `01_core_rules.md` untuk Gatekeeper & PRD, `02_apple_hig_design_system.md` untuk Bento & asas HIG, `08_playwright_testing.md` untuk automasi ujian, `11_language_standards.md` untuk standard bahasa Melayu moden 2026, `12_max_content_limit.md` untuk had siling saiz fail).

---

## 3. Protokol Pemisahan Kandungan Panjang (Content Partitioning & SSOT)

Apabila sesuatu fail peraturan atau panduan menghampiri had (contoh: mencapai $\ge 11,000$ aksara):
1. **Kenal Pasti Sub-Domain Baharu:**
   - Asingkan seksyen yang berdiri sendiri ke fail bernombor seterusnya (contoh: `13_supabase_database_standards.md`, `14_strix_security_auditing.md`, dsb.).
2. **Pautan Rujukan Silang Tunggal (*Single Source of Truth*):**
   - Di dalam fail asal, tinggalkan ringkasan eksekutif 2–3 baris berserta pautan markdown yang boleh diklik ke fail baharu tersebut.
   - DILARANG menduplikasi teks atau perenggan yang sama dalam pelbagai fail.
3. **Penyelarasan Indeks & Struktur:**
   - Kemas kini senarai fail dalam:
     - [01_core_rules.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/01_core_rules.md) (Seksyen 7)
     - [.agents/PROJECT_STRUCTURE.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/PROJECT_STRUCTURE.md)
     - [docs/PROJECT_STRUCTURE.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/docs/PROJECT_STRUCTURE.md)

---

## 4. Senarai Semak Pengesahan Mandatori Sebelum Selesai Tugas

Sebelum setiap commit atau penyerahan tugasan kepada pengguna:
1. **Lakukan Semakan Aksara Pukal:**
   ```bash
   wc -m .agents/rules/*.md
   ```
2. **Sahkan Setiap Fail $\le 12,000$ Aksara:**
   - Jika terdapat sebarang fail $> 12,000$ aksara, betulkan serta-merta dengan memindahkan sebahagian kandungan ke fail bernombor baharu.
3. **Sahkan Integriti Ujian:**
   - Pastikan ujian automasi Playwright kekal lulus 100% dan pengetahuan Graphify dikemas kini.
