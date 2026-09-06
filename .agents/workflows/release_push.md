---
description: Alur kerja rasmi pelaksanaan pelepasan versi Git SemVer (X.Y.Z), penemuan versi terdahulu, penciptaan tag, dan penolakan ke repositori GitHub secara automatik.
---

# Alur Kerja /release_push: Pelepasan Versi Git & SemVer WeDRIVE

Alur kerja ini digunakan setiap kali sesuatu fasa pembangunan, penambahan modul, pembaikan pepijat, atau penalaan UI telah siap diuji dan sedia untuk ditolak ke cawangan `main` di GitHub.

---

## Langkah 1: Semakan Versi Terakhir (Pre-Commit Version Discovery)
Dapatkan tag versi sah yang terkini dalam repositori:
```bash
git describe --tags --abbrev=0
```
Sahkan juga versi mesej commit terakhir:
```bash
git log -1 --oneline
```
Dan semak entri paling bawah di fail [`PLAN/FYP1_to_FYP2_Development_Summary.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/PLAN/FYP1_to_FYP2_Development_Summary.md).

---

## Langkah 2: Tentukan Nombor Versi Baharu Mengikut Formula SemVer (X.Y.Z)
Berasaskan versi terakhir (contoh: `6.2.5`):
- **X (MAJOR):** Naikkan X dan set Y=0, Z=0 jika berlaku rombakan seni bina sistem berskala besar atau fasa projek baharu (contoh: `7.0.0`).
- **Y (MINOR):** Naikkan Y dan set Z=0 jika terdapat penambahan ciri baharu, kemahiran/alur kerja baharu, atau halaman fizikal `.html` baharu (contoh: `6.3.0`).
- **Z (PATCH):** Naikkan Z sebanyak 1 jika hanya pembaikan pepijat (*bug fix*), penalaan CSS/linter, atau kemas kini fail peraturan/dokumentasi (contoh: `6.2.6`).

---

## Langkah 3: Catat Log Pembangunan di Fail PLAN
Buka fail `PLAN/FYP1_to_FYP2_Development_Summary.md` dan tambah entri baharu di bahagian paling bawah:
```markdown
## [MINOR UPDATE] Nombor_Entri. Tajuk Perubahan (vX.Y.Z)
- **Punca Arahan Pengguna**: ...
- **Tindakan Pelaksanaan**: ...
- **Pengesahan Ujian Automatik**: ...
- **Maklumat Git**:
  - Commit: `X.Y.Z Description of changes`
  - Tag Versi: `X.Y.Z`
```

---

## Langkah 4: Jalankan Senarai Semak Pra-Push (Pre-Push Checklist)
Pastikan syarat mutlak ini dipatuhi sebelum commit:
1. Dokumen PRD telah disediakan & diluluskan pengguna dalam `implementation_plan.md`.
2. Kesemua fail peraturan `.agents/rules/*.md` disahkan $\le 12,000$ aksara (`wc -m .agents/rules/*.md`).
3. Suite ujian Playwright CLI 100% Lulus:
   ```bash
   cd tests && npx playwright test
   ```
4. Kemas kini graf pengetahuan Graphify:
   ```bash
   graphify update .
   ```

---

## Langkah 5: Lakukan Commit, Tag, & Push Serentak
Jalankan arahan Git berangkai berikut (gantikan `X.Y.Z` dengan versi baharu):
```bash
git add -A && git commit -m "X.Y.Z Description in English" && git tag X.Y.Z && git push origin main --tags
```
Sahkan keluaran terminal menunjukkan tag baharu berjaya ditolak ke repositori `hdanial211/WeDRIVE`.
