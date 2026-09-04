---
trigger: always_on
---

# Apple Human Interface Guidelines (HIG) & Design System Standard
## WeDRIVE Master Specification — Bahagian 2: Komponen, Interaksi & Teknologi (Pilar 4 – 6)

Dokumen ini adalah **Standard Rujukan Mutlak & Panduan Mandatori (Bahagian 2)** bagi pembangunan dan penyempurnaan seluruh sistem **WeDRIVE**. Setiap kali ciri baharu, halaman, komponen, animasi, atau antara muka dibina atau diubah suai, pembangun/ejen WAJIB merujuk dan mematuhi spesifikasi di bawah.

*Nota: Asas, Prinsip Utama & Corak Interaksi (Pilar 1 – 3) terkandung dalam [`.agents/rules/apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_hig_design_system.md).*

---

## 🎛️ PILAR 4: COMPONENTS (KOMPONEN ANTARA MUKA)

1. **Kawalan Bersegmen Apple (*Segmented Controls*)**:
   - Bekas kapsul kelabu cerah/gelap dengan gelangsar pil aktif putih/biru yang beralih secara lancar (*fluid sliding tab*).
2. **Kad Bento Grid (*Apple Bento Cards*)**:
   - Reka letak modular berkad dengan bucu squircle `20px – 28px`, bayang-bayang lembut, dan pencahayaan aksen halus.
3. **Butang Tindakan (*Apple Buttons*)**:
   - **Primary**: Kapsul warna penuh (`border-radius: 9999px`) dengan teks tebal dan pencahayaan lembut.
   - **Secondary / Tinted**: Butang squircle kelabu/biru lut sinar (`border-radius: 12px` – `14px`).
   - **Destructive**: Warna merah sistem Apple (`#FF3B30`) dengan pengesahan tindakan.
4. **Prinsip Geometri Minimum Bulat Sempurna & Pengembangan Kapsul (*Minimum Circular Base & Horizontal Pill Expansion Rule*)**:
   - **Saiz Minimum Tanpa Teks (Ikon Tunggal)**: Elemen ikonik saiz terkecil (cth. `.theme-toggle`, butang ikon bulat, butang tindakan bulat) **WAJIB berbentuk bulatan 1:1 sempurna** (`aspect-ratio: 1 / 1 !important; border-radius: 50% !important; width == height`, cth. $36\text{px} \times 36\text{px}$). DILARANG SAMA SEKALI menjadi lonjong/bujur (*oval*).
   - **Pengembangan Mendatar Berkandungan**: Apabila elemen mempunyai teks/label (cth. `.lang-toggle`, butang utama, *filter chip*), ia **mengembang secara mendatar dari diameter bulatan asas** menjadi kapsul/pil Apple (`border-radius: var(--radius-pill, 9999px) !important;`) dengan kedua-dua hujung mengekalkan kelengkungan separuh bulatan yang simetri dan estetik.
5. **Lencana Status & Penunjuk Kapsul Melebar**:
   - Lencana status (Tersedia, Aktif, Selesai) menggunakan bentuk pil berkapsul dengan teks huruf besar berkod warna.
   - Penunjuk karusel: Titik tidak aktif `7px × 7px` $\to$ Kapsul aktif melebar `22px × 7px`.
6. **Notifikasi Terapung (*Apple Toast Notifications*)**:
   - Kapsul terapung di sudut skrin dengan ikon bulat, teks ringkas, bayang-bayang kaca berlapis, dan auto-hilang dalam 3 saat.

---

## 🖱️ PILAR 5: INPUTS & INTERACTIONS (INTERAKSI & INPUT)

1. **Kursor & Penuding**:
   - `cursor: pointer` pada semua elemen yang boleh diklik.
   - `cursor: not-allowed` pada elemen yang dikunci.
2. **Cincin Fokus Apple (*Focus Halo*)**:
   - Medan input yang aktif/fokus menerima lingkaran cahaya biru Apple: `box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.18); border-color: var(--primary); outline: none;`.
3. **Papan Kekunci & Aksesibiliti**:
   - Sokongan kekunci `Escape` untuk menutup modal, popover, dan kalendar.
   - Label teks ARIA (`aria-label`, `aria-hidden`) pada semua butang ikon tanpa teks.

---

## 🤖 PILAR 6: TECHNOLOGIES (TEKNOLOGI & CIRI KHUSUS)

1. **Pembantu AI Terapung (*Floating AI Assistant Island*)**:
   - Butang kapsul terapung dengan kecerunan ungu/indigo Apple AI dan lencana status interaktif.
2. **Pelihat Kenderaan 360° (*Interactive Vehicle Viewer*)**:
   - Kanvas rendering 360 darjah dengan kawalan seretan sentuh dan butang sudut pandangan.
3. **Sistem Dwibahasa Lancar (*Smooth Bilingual Engine*)**:
   - Penukaran bahasa segera (Bahasa Melayu & English) dengan efek *skeleton shimmer cross-fade* tanpa penyegaran semula halaman.
4. **Penyelarasan Reka Letak Melalui Stitch MCP & Model Penaakulan Tinggi (*Stitch MCP Ultra High-Quality Standard*)**:
   - **Prinsip Utama**: *Lambat asal kualiti terbaik; pantang cepat tetapi kualiti sifar (zero quality)*. Dilarang menggunakan model pantas/ringan (Flash) yang mengorbankan kehalusan reka bentuk.
   - Bagi reka bentuk halaman baharu atau peningkatan estetika skrin, pembangun/AI diwajibkan menggunakan **Stitch MCP** (`generate_screen_from_text`, `get_screen`, `apply_design_system`) dengan model penaakulan tertinggi: **`GEMINI_3_1_PRO`** (Model `GEMINI_3_PRO` telah ditamatkan/deprecated).
   - Gunakan sistem reka bentuk *WeDRIVE Lumina / Apple HIG Precision* (`assets/d66115a696e44b2381ec5f5d829e8a88` / `assets/40090a9886c4444abca795c82673f4c8` / `assets/518f31ad774f458da15c7fc5ff999bbf`) di bawah projek Stitch `1862124494843018493`.
   - Pastikan reka letak menggunakan kad squircle Bento 24px/28px, warna sistem Apple, tipografi `tabular-nums`, dan tiada klise templat AI murahan.
   - Semua token reka letak disegerakkan bersama [`.agents/DESIGN.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/DESIGN.md).

---

## 📋 SENARAI SEMAK AUDIT & RUJUKAN SEBELUM MEMBINA CIRI BAHARU

Sebelum menandakan sebarang tugasan atau halaman sebagai SELESAI, semak senarai di bawah:
- [ ] Adakah tipografi menggunakan hierarki Apple San Francisco dengan `tabular-nums` untuk harga?
- [ ] Adakah warna mod siang dan malam (Obsidian True Black) mematuhi token Apple?
- [ ] Adakah butang mempunyai tindak balas `scale(0.97)` semasa ditekan?
- [ ] Adakah semua bucu menggunakan radius squircle (`24px`/`28px` untuk kad, `9999px` untuk kapsul)?
- [ ] Adakah bar navigasi dan panel terapung menggunakan bahan kaca (*backdrop blur*)?
- [ ] Adakah pemilih tarikh berpasangan mengunci tarikh pulang sebelum tarikh ambil dipilih?
- [ ] Adakah semua gaya ditulis secara terpusat di dalam `shared/css/wedrive.css`?
