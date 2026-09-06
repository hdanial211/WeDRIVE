# WeDRIVE Language Standards & Modern Malay 2026 Guidelines

Standard Rujukan Mandatori Khusus Bahasa untuk seluruh antaramuka pengguna (UI), teks kod, mesej ralat, resit, invois, dan perbualan AI dalam ekosistem WeDRIVE.

---

## 1. Standard Bahasa Melayu Moden Kontemporari Malaysia (Era 2026)

- **Prinsip Utama**:
  - Sistem WeDRIVE WAJIB menggunakan 100% Bahasa Melayu moden Malaysia terkini seperti yang diguna pakai oleh aplikasi teknologi terkemuka di Malaysia (**Grab, Setel, Touch 'n Go eWallet, Trevo, Wahdah, Carsome**).
  - Tona bahasa mestilah **santai, segar, ringkas, mesra pengguna, telus, dan terus kepada maksud sebenar** operasi sewaan kenderaan di Malaysia.
  - **DILARANG SAMA SEKALI** bahasa Melayu kuno/buku teks klasik, istilah terjemahan harfiah bahasa Indonesia, atau bahasa terjemahan langsung robotik AI (*direct English-to-Malay literal translation*).
  - Elakkan istilah kaku yang tidak pernah digunakan oleh rakyat Malaysia semasa menyewa kereta.

---

## 2. Senarai Hitam Istilah Terlarang (Strict Blacklist)

Jadual di bawah mengandungi kata-kata yang **DIHARAMKAN SAMA SEKALI** penggunaannya dalam mana-mana bahagian kod, fail antaramuka (HTML/JS), fail peraturan, mahupun respons perbualan AI:

| ❌ Kata Terlarang (Blacklist) | Punca Larangan & Kesalahan Maksud | ✅ Istilah Rasmi Wajib Guna (BM Moden / EN) |
| :--- | :--- | :--- |
| **Armada** | Maksud sebenar ialah angkatan kapal perang laut (Sepanyol/Portugis/Kamus Dewan) atau pinjaman Indonesia. Rakyat Malaysia tidak menyewa "armada". | **Kereta** / **Pilihan Kereta** / **Katalog Kereta** |
| **Fleet** | Istilah korporat Inggeris yang kaku dan asing bagi pelanggan harian di Malaysia. | **Kereta** (BM) / **Cars** (EN) |
| **Wahana** / **Kenderaan Penggerak** | Istilah sastera klasik/puitis arkib yang tidak digunakan dalam aplikasi harian. | **Kereta** / **Model Kereta** |
| **Kabin** / **Bilik Kemudi** / **Kokpit** | Istilah kapal laut atau pesawat penerbangan. Kereta mempunyai ruang dalaman biasa. | **Dalaman Kereta** / **Ruang Dalaman** (BM) / **Interior** (EN) |
| **Prapapar** / **Peringkat Interaktif** | Terjemahan harfiah (*literal translation*) "preview" dan "stage" yang janggal didengar. | **Pratonton 360°** / **Lihat Kereta 360°** |
| **Bilik Pameran** (dalam konteks list kereta) | Terjemahan langsung "showroom". Kurang tepat untuk senarai katalog sewaan aktif. | **Katalog Kereta** / **Pilihan Kereta** |
| **Pelayaran Mobiliti** / **Mobiliti Pintar** | Frasa khayalan AI generik (*cheesy marketing jargon*). | **Sewa Kereta** / **Perjalanan Anda** |
| **Perisai Keselamatan** | Frasa hiperbola robotik AI yang mengelirukan pelanggan. | **Perlindungan Insurans** / **Insurans Penuh** |
| **Gugusan Kereta** | Terjemahan kaku robotik bagi "vehicle cluster". | **Pilihan Kereta** / **Senarai Kereta** |
| **Penstriman Tempahan** | Terjemahan salah bagi "booking stream/flow". | **Aliran Tempahan** / **Status Tempahan** |

---

## 3. Panduan Penggunaan Seragam Merentas Seluruh Sistem

### 3.1 Bar Sisi & Menu Navigasi Admin
- Modul Teras: `Dashboard` (Papan Pemuka), `Cars` (Kereta), `Bookings` (Tempahan), `Customers` (Pelanggan), `Reports` (Laporan), `AI Intelligence` (Kecerdasan AI).
- Sub-Menu Pengurusan Kereta:
  - `Pengurusan Kereta` $\rightarrow$ `Semua Kereta`, `Kereta Tersedia`, `Kereta Sedang Disewa`, `Studio 360° & Info Kereta`, `Tambah Kereta Baharu`.
- Tindakan Kembali: `Kembali ke Senarai Kereta` (BUKAN istilah lain).

### 3.2 Katalog & Antaramuka Pelanggan
- Carian & Pilihan: `Pilih Kereta`, `Cari Kereta Idaman`, `Lihat Butiran`, `Tempah Sekarang`, `Sewa Sekarang`.
- Penapisan: `Semua Jenis`, `Sedan`, `SUV`, `MPV`, `Hatchback`, `Elektrik (EV)`.
- Butiran Spesifikasi: `Transmisi Automatik`, `Tempat Duduk`, `Bahan Api / Bateri`, `Kadar Harian`, `Deposit Keselamatan`.

### 3.3 Lencana Status Operasi (Status Badges)
Semua lencana status WAJIB memaparkan terjemahan rasmi selaras dengan mod bahasa aktif:
- `Tersedia` (Available) — Hijau Apple (`#34C759`)
- `Sedang Disewa` (Rented) — Biru Apple (`#0071E3` / `#2997FF`)
- `Menunggu Kelulusan` (Pending Approval) — Oren/Ambar (`#FF9500`)
- `Selesai` (Completed) — Kelabu Gelap/Slate
- `Dibatalkan` (Cancelled) — Merah Apple (`#FF3B30`)

### 3.4 Resit Rasmi & Invois Cukai Korporat
- Kepala Dokumen: `Invois Cukai Rasmi` / `Resit Pembayaran WeDRIVE`.
- Medan Pembayaran: `No. Tempahan`, `Tarikh Ambil`, `Tarikh Pulang`, `Lokasi Pengambilan HQ`, `Cukai Perkhidmatan (SST)`, `Jumlah Bersih`.
- Pengesahan: `Pas Digital QR`, `Token Keselamatan Escrow`, `Ditandatangani Secara Digital`.

---

## 4. Seni Bina Dwibahasa Dinamik (Bilingual Architecture)

- **Penyimpanan Kunci Terjemahan**:
  - Semua teks dwibahasa disimpan dalam kamus berstruktur `shared/lang/en.json` dan `shared/lang/ms.json`.
  - Penukaran bahasa dikendalikan secara reaktif melalui `shared/js/main.js` tanpa memerlukan muat semula halaman penuh (*zero page reload*).
- **Atribut HTML Mandatori**:
  - Setiap elemen teks yang menyokong dwibahasa WAJIB mempunyai atribut:
    ```html
    <span data-i18n="cars.available">Kereta Tersedia</span>
    ```
- **Kelarasan Teks**: DILARANG mencampuradukkan bahasa Inggeris dan Melayu dalam satu ayat (contoh salah: *"Sila return kereta at HQ"* $\rightarrow$ contoh betul: *"Sila pulangkan kereta di HQ"*).

---

## 5. Peraturan Komunikasi Ejen AI (Strict AI Guardrails)

- Ejen AI **DILARANG SAMA SEKALI** menyebut, mencadangkan, atau menulis perkataan dalam Senarai Hitam di atas semasa:
  1. Membalas mesej pengguna atau sesi soal jawab.
  2. Menjana kod baharu, skrip, atau templat UI.
  3. Menulis dokumen perancangan, ringkasan tugas, atau mesej commit.
- Sekiranya pengguna menggunakan istilah dalam senarai hitam (contoh: *"tambah armada"*), ejen AI mestilah membalas dan melaksanakan tugasan menggunakan istilah rasmi yang betul (*"menambah pilihan kereta"*).
