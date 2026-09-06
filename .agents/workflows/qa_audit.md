---
description: Alur kerja pemeriksaan kualiti menyeluruh (QA Audit) sebelum commit atau pelepasan versi. Meliputi semakan had siling aksara, linter CSS/HTML, ujian Playwright, dan penyelarasan Graphify.
---

# Alur Kerja /qa_audit: Audit Kualiti Menyeluruh WeDRIVE

Gunakan alur kerja ini untuk menjalankan pemeriksaan kualiti sistem secara menyeluruh sebelum sebarang kod ditolak ke cawangan `main`.

---

## Fasa 1: Audit Had Siling Aksara (Max 12,000 Characters Limit)
Periksa setiap fail peraturan `.agents/rules/`:
```bash
wc -m .agents/rules/*.md
```
- **Syarat Lulus:** Setiap fail individu WAJIB mempunyai kiraan aksara $\le 12,000$.
- **Jika Gagal:** Pindahkan seksyen yang panjang ke fail bernombor baharu (contoh: dari 17 ke 18, 19, dsb.).

---

## Fasa 2: Pengesahan Pengguna 3-Peranti Apple Satu-Tab (MacBook, iPad, iPhone)
Lakukan semakan interaksi pada **tab pelayar aktif yang sama** menggunakan `chrome-devtools-mcp`:
1. **MacBook (`1440 × 900`)**: Semak Bento 3-kolum, susun atur squircle, dan sifar ruang mati (*Zero Dead Space*).
2. **iPad (`820 × 1180`)**: Laraskan paparan melalui `resize_page`, semak responsif 2-kolum dan sasaran sentuhan ($\ge 44\text{px}$).
3. **iPhone (`393 × 852`)**: Laraskan paparan melalui `resize_page`, semak menu mudah alih / dock terapung dan fon borang $\ge 16\text{px}$.
4. **Semakan Geometri Tegas (Zero Oval Rule)**:
   - Butang ikon bulat WAJIB 1:1 tepat (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; padding: 0 !important; width == height;`).
   - Butang berteks WAJIB kapsul pil simetri (`border-radius: 9999px; white-space: nowrap !important; flex-shrink: 0 !important;`).
   - DILARANG SAMA SEKALI butang bulat menjadi lonjong/bujur/oval pada mana-mana peranti.

---

## Fasa 3: Ujian Automasi E2E Playwright CLI (100% Pass Rate)
Jalankan suite ujian automatik:
```bash
cd tests && npx playwright test
```
- **Syarat Lulus:** Kesemua ujian (36/36) WAJIB lulus (Exit Code 0).
- Sekiranya ada kegagalan, kenal pasti selector yang berubah atau selesaikan regresi sebelum meneruskan aliran kerja.

---

## Fasa 4: Penyelarasan Graf Pengetahuan Graphify
Kemas kini graf pengetahuan kod sistem:
```bash
graphify update .
```
Pastikan keluaran terminal menunjukkan nod, sambungan, dan komuniti berjaya diperbaharui tanpa ralat.

---

## Fasa 5: Semakan Bahasa Melayu Moden 2026 & Sifar Perkataan Senarai Hitam
Pastikan tiada perkataan dalam senarai hitam digunakan dalam kod sumber atau antaramuka:
- Dilarang: *Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar, Perisai Keselamatan, Gugusan Kereta*.
- Pengganti Sah: *Kereta, Cars, Ruang Dalaman, Pandu Uji, Jaminan Keselamatan*.
