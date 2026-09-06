---
trigger: always_on
---

# WeDRIVE Git Version Control & Semantic Versioning (SemVer) Standards

## 1. Protokol Semakan Versi Terkini (Pre-Commit Version Discovery)

Sebelum sebarang commit dibuat atau nombor versi baharu ditentukan, AI **WAJIB** menyemak versi terakhir yang sah dalam repositori melalui 3 kaedah berikut:

1. **Terminal Git Describe (Kaedah Utama):**
   ```bash
   git describe --tags --abbrev=0
   ```
   Perintah ini memulangkan tag versi rasmi terkini yang telah ditujah ke Git (contoh: `6.2.4`).

2. **Semakan Commit Terakhir:**
   ```bash
   git log -1 --oneline
   ```
   Menampilkan mesej commit terkini beserta hash dan nombor versi awalan.

3. **Semakan Entri Terakhir Fail `PLAN`:**
   Memeriksa rekod terakhir di bahagian paling bawah fail [`PLAN/FYP1_to_FYP2_Development_Summary.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/PLAN/FYP1_to_FYP2_Development_Summary.md) untuk memastikan kesinambungan nombor entri dan versi.

---

## 2. Logik Formula SemVer (X . Y . Z)

Sistem WeDRIVE mengguna pakai piawaian Semantic Versioning 3-peringkat:

$$\mathbf{X} \ . \ \mathbf{Y} \ . \ \mathbf{Z}$$
$$\text{[MAJOR]} \ . \ \text{[MINOR]} \ . \ \text{[PATCH]}$$

```text
       6   .   2   .   4
       │       │       │
       │       │       └─── Z (PATCH): Pembaikan bug / linter / CSS / peraturan
       │       └─────────── Y (MINOR): Penambahan ciri baharu / modul baharu
       └─────────────────── X (MAJOR): Rombakan besar seni bina / peralihan fasa
```

### A. Digit X — MAJOR (Versi Utama)
- **Bila Dinaikkan:**
  - Rombakan seni bina berskala besar (*architectural overhaul*).
  - Peralihan fasa projek (contoh: Peralihan daripada FYP 1 versi `2.9.9` ke FYP 2 bermula terus dengan versi `3.0.0`).
  - Penstrukturan semula pangkalan data atau rombakan aliran kerja teras yang mengubah cara keseluruhan sistem berfungsi.
- **Kesan:** Apabila X bertambah, Y dan Z **wajib di-reset kepada 0** (contoh: `5.9.3` $\to$ `6.0.0`).

### B. Digit Y — MINOR (Ciri / Modul Baharu)
- **Bila Dinaikkan:**
  - Penambahan ciri baharu (*new feature*), penambahan modul baharu, atau halaman fizikal `.html` baharu yang tidak merosakkan sistem sedia ada.
  - Contoh: Penambahan modul *AI Key Vault*, *Document OCR Verification*, *Apple Segmented Pricing Glider*, atau halaman *Receipt QR Pass*.
- **Kesan:** Apabila Y bertambah, Z **wajib di-reset kepada 0** (contoh: `6.2.4` $\to$ `6.3.0`).

### C. Digit Z — PATCH (Pembaikan / Penalaan Kecil)
- **Bila Dinaikkan:**
  - Pembaikan pepijat (*bug fix*), pembetulan amaran linter, penalaan gaya CSS, pembetulan warna tema, atau pengemaskinian fail peraturan dan dokumentasi.
  - Contoh: Membaiki inline style pada kalendar, membetulkan susunan vendor prefix `-webkit-backdrop-filter`, atau mengemas kini fail `.agents/rules/*.md`.
- **Kesan:** Hanya digit Z dinaikkan sebanyak 1 (contoh: `6.2.3` $\to$ `6.2.4`).

---

## 3. Format Mandatori Mesej Commit & Git Tag

1. **Format Commit Message:**
   - **WAJIB** bermula dengan nombor versi tanpa awalan huruf `v`:
     ```bash
     git commit -m "X.Y.Z Penerangan ringkas perubahan dalam Bahasa Inggeris"
     ```
   - **Contoh Sah:** `6.2.4 Fix calendar inline styles and webkit backdrop-filter prefix order`
   - **Contoh DILARANG:** `v6.2.4 Fix...` atau `Fix calendar styles` (tanpa nombor versi).

2. **Format Git Tag & Push:**
   - Git Tag wajib dicipta sepadan dengan nombor versi commit:
     ```bash
     git tag X.Y.Z && git push origin main --tags
     ```
   - Ini memastikan tab *Releases / Tags* di repositori GitHub `hdanial211/WeDRIVE` sentiasa tersusun rapi untuk semakan pemeriksa FYP 2.

---

## 4. Senarai Semak Sebelum Boleh Melakukan Push (Pre-Push Checklist)

Sebelum arahan `git push origin main --tags` dibenarkan dijalankan:
- [ ] **PRD Disediakan & Diluluskan:** Seksyen PRD 6 pilar telah diluluskan pengguna dalam `implementation_plan.md`.
- [ ] **Ujian Playwright CLI 100% Lulus:** `cd tests && npx playwright test` menghasilkan 100% Pass Rate.
- [ ] **Audit Had Aksara 12,000:** Kesemua fail peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara menggunakan `wc -m`.
- [ ] **Graf Pengetahuan Graphify Dikemas Kini:** `graphify update .` telah dijalankan.
- [ ] **Log Pembangunan Dikemas Kini:** Entri baharu direkodkan di fail [`PLAN/FYP1_to_FYP2_Development_Summary.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/PLAN/FYP1_to_FYP2_Development_Summary.md).
