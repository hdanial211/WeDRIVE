# Apple Human Interface Guidelines (HIG) Standard
## WeDRIVE Master Specification — Bahagian 2: Komponen, Interaksi & Teknologi (Pilar 4 – 6)

Standard Rujukan Mandatori Bahagian 2 untuk komponen dan ciri sistem WeDRIVE.
*Nota: Asas & Corak Interaksi (Pilar 1–3) terkandung dalam [`.agents/rules/apple_hig_design_system.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/apple_hig_design_system.md).*

---

## 🎛️ PILAR 4: COMPONENTS (KOMPONEN ANTARA MUKA)

1. **Kawalan Bersegmen (*Segmented Controls*)**: Kapsul kelabu cerah/gelap dengan gelangsar pil aktif putih/biru beralih lancar (*fluid sliding tab*).
2. **Kad Bento Grid (*Apple Bento Cards*)**: Susun atur modular berkad dengan bucu squircle `20px – 28px`, bayang lembut, dan pencahayaan aksen halus.
3. **Butang Tindakan Apple**:
   - **Primary**: Kapsul warna penuh (`border-radius: 9999px`) dengan teks tebal.
   - **Secondary**: Squircle kelabu/biru lut sinar (`border-radius: 12px` – `14px`).
   - **Destructive**: Merah Apple (`#FF3B30`) dengan pengesahan tindakan.
4. **Prinsip Geometri Bulat 1:1 Sempurna & Pengembangan Kapsul**:
   - **Elemen Ikon Tunggal (Tanpa Teks)**: WAJIB bulatan 1:1 sempurna (`aspect-ratio: 1/1 !important; border-radius: 50% !important; width == height`, cth. 36px × 36px). DILARANG lonjong/bujur (*oval*).
   - **Elemen Berkandungan Teks**: Mengembang mendatar menjadi kapsul/pil simetri (`border-radius: 9999px !important;`).
5. **Lencana Status & Penunjuk Kapsul**:
   - Lencana status (Tersedia, Aktif, Selesai) berbentuk kapsul pil huruf besar berkod warna.
   - Penunjuk karusel: Titik pasif `7px × 7px` $\to$ Kapsul aktif melebar `22px × 7px`.
6. **Notifikasi Terapung (Apple Toasts)**: Kapsul terapung di sudut skrin dengan ikon bulat, teks ringkas, bayang kaca berlapis, auto-hilang 3 saat.

---

## 🖱️ PILAR 5: INPUTS & INTERACTIONS (INTERAKSI & INPUT)

1. **Kursor**: `cursor: pointer` pada semua elemen boleh klik; `cursor: not-allowed` pada elemen terkunci.
2. **Cincin Fokus Apple (*Focus Halo*)**: Medan input aktif menerima lingkaran cahaya biru: `box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.18); border-color: var(--primary); outline: none;`.
3. **Papan Kekunci & Aksesibiliti**: Sokongan kekunci `Escape` menutup modal/popover/kalendar. Label `aria-label` wajib pada semua butang ikon tanpa teks.

---

## 🤖 PILAR 6: TECHNOLOGIES (TEKNOLOGI & CIRI KHUSUS)

1. **Pembantu AI Terapung**: Butang kapsul terapung kecerunan ungu/indigo Apple AI dan lencana status interaktif.
2. **Pelihat Kenderaan 360°**: Kanvas interaktif 360° dengan kawalan seretan sentuh dan butang sudut pandangan.
3. **Sistem Dwibahasa Lancar**: Penukaran bahasa segera (EN/MS) dengan efek *skeleton shimmer cross-fade* tanpa segar semula halaman.
4. **Penyelarasan Stitch MCP Ultra High-Quality Standard**:
   - **Prinsip Teras**: *Lambat asal kualiti terbaik; pantang cepat tapi kualiti sifar (zero quality)*.
   - Model Mandatori: **Gemini 3.8 Ultra High-Quality Tier** (pemetaan Stitch MCP `modelId: GEMINI_3_1_PRO`; model `GEMINI_3_PRO` telah ditamatkan/deprecated). Dilarang model ringan/Flash.
   - Projek & Design System: `projectId: 1862124494843018493`, `designSystem: assets/d66115a696e44b2381ec5f5d829e8a88` / `assets/40090a9886c4444abca795c82673f4c8`.
   - Token reka bentuk disegerakkan bersama [`.agents/DESIGN.md`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/DESIGN.md).

---

## 📋 SENARAI SEMAK AUDIT & RUJUKAN SEBELUM SIAP

- [ ] Tipografi menggunakan San Francisco dengan `tabular-nums` untuk harga?
- [ ] Warna Day Mode (`#F5F5F7`/`#FFFFFF`) dan Night Mode (`#000000`/`#161618`) mematuhi token Apple?
- [ ] Butang bertindak balas `scale(0.97)` semasa ditekan?
- [ ] Semua bucu menggunakan squircle (kad 24px/28px, kapsul 9999px, ikon bulat 50%)?
- [ ] Bar navigasi & panel terapung menggunakan bahan kaca (*backdrop blur 20px*)?
- [ ] Tarikh pulangan terkunci sehingga tarikh ambil dipilih?
- [ ] Semua gaya CSS disatukan dalam `shared/css/wedrive.css`?
