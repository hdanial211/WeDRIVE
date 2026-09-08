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
| **Database** / **Pangkalan Data** / **Supabase** *(dalam UI)* | Pengguna & admin adalah staf operasi, bukan pengaturcara (*non-coder*). Mereka tidak tahu coding. Istilah ini HANYA untuk kod belakang tabir. | **Simpan Rekod** / **Simpan Visual** / **✓ Berjaya Disimpan** / **Tersimpan di Awan** |
| **Cache** *(dalam UI)* | Pengguna tidak faham teknologi cache. DILARANG SAMA SEKALI memaparkannya pada UI. | **Pratonton Sedia** / **Pratonton 360° Aktif** |
| **JPJ** / **Geran JPJ** *(Terkait Kereta/Add Car)* | WeDRIVE bisnes sewa kereta bukan jual kereta. Kereta syarikat sudah siap didaftarkan dengan JPJ. Dilarang sebut JPJ berkaitan kereta. | **Pemeriksaan Visual Syarikat** / **Maklumat Asas Pendaftaran** |
| **Aset** *(dalam konteks sewa kereta)* | Istilah perakaunan kaku/canggung untuk kereta sewaan. | **Kereta** / **Kenderaan** / **Visual 360°** |
| **Muka Kubus** / **Integriti Data** | Jargon grafik 3D/pengaturcaraan pelik yang membingungkan pentadbir operasi. | **Spesifikasi Kenderaan** / **Lokasi & Status Serahan** |

---

### 2.1 Prinsip Sifar Jargon Pengaturcaraan dalam UI (Zero Coding Jargon in Interface UI)
- **Kefahaman Pengguna Operasi (Non-Coder Standard):** Pengguna akhir dan pentadbir operasi adalah orang awam yang menguruskan operasi sewaan kenderaan dan BUKAN pengaturcara (*non-coders*).
- **Larangan Mutlak Istilah Coding dalam UI:**
  - **DILARANG SAMA SEKALI** memaparkan perkataan teknikal pengaturcaraan seperti: `"database"`, `"pangkalan data"`, `"cache"`, `"supabase"`, `"SQL"`, `"JSON"`, `"API"`, `"staging"`, `"payload"`, atau `"query"` pada sebarang butang, label borang, lencana status, kad Bento, mahupun mesej toast.
  - Perkataan teknikal tersebut **HANYA** boleh digunakan di dalam fail kod sumber, skrip backend, dan dokumentasi kejuruteraan dalaman di sebalik tabir.
  - Antaramuka pengguna WAJIB menggunakan bahasa pengalaman pengguna (UX) Apple yang ringkas, bersih, dan berorientasikan tindakan (contoh: `Simpan Visual`, `✓ Berjaya Disimpan`, `Pratonton Sedia`).

### 2.2 Garis Panduan Mutlak Sempadan JPJ (JPJ Scope Isolation Standard)
- **Bisnes Sewa Kereta Bukan Jual Kereta:** Sistem WeDRIVE beroperasi sebagai platform sewaan kenderaan (*car rental*), bukan platform jual beli kereta atau pendaftaran geran baharu. Semua kereta yang dimiliki syarikat sememangnya **sudah siap berdaftar dengan JPJ terlebih dahulu** sebelum dimasukkan ke dalam sistem sewaan.
- **Larangan Keras pada Modul Kereta:** DILARANG SAMA SEKALI menyebut atau mengaitkan `JPJ`, `geran JPJ`, atau `pendaftaran JPJ` pada modul inventori kenderaan, pendaftaran kenderaan baharu (`add-car.html`), atau studio pemeriksaan visual kenderaan.
- **Pengecualian Tunggal Sahaja (OCR Lesen Pelanggan):** Istilah JPJ **HANYA** wujud dan dibenarkan pada satu bahagian sahaja dalam sistem: iaitu modul **Pengesahan Identiti & Lesen Memandu Pelanggan (*Customer Identity & Driving License OCR Verification*)** untuk mengesahkan bahawa pelanggan memiliki lesen memandu JPJ yang sah sebelum membenarkan sewaan dibuat.

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

## 4. Seni Bina Dwibahasa Dinamik & Pemusatan Mutlak `shared/lang/` (Strict Single Source of Truth)

- **Pemusatan Mutlak Bahasa (Strict Centralized Localization Protocol)**:
  - **SEMUA** teks antaramuka, rentetan terjemahan, label borang, mesej ralat, placeholder, tajuk tooltip, dan butang WAJIB berpusat 100% di dalam direktori `shared/lang/`:
    - `shared/lang/en.js` & `shared/lang/en.json` (Kamus Bahasa Inggeris)
    - `shared/lang/ms.js` & `shared/lang/ms.json` (Kamus Bahasa Melayu Moden 2026)
  - **LARANGAN KERAS TERJEMAHAN BERCERAI / INLINE (Zero Fragmented Translations)**:
    - **DILARANG SAMA SEKALI** meletakkan teks terjemahan secara *hardcoded* di dalam fail JavaScript modul individu (contoh: `admin/*.js`, `customer/*.js`, dsb.) atau mentakrifkan objek kamus tempatan/tersendiri.
    - Sebarang penambahan teks atau kunci baharu **WAJIB didaftarkan ke dalam fail kamus pusat di `shared/lang/`** terlebih dahulu.
  - Penukaran bahasa dikendalikan secara reaktif melalui pengurus bahasa WeDRIVE dalam `shared/js/main.js` tanpa memerlukan muat semula halaman penuh (*zero page reload*).

- **Atribut HTML Mandatori**:
  - Setiap elemen antaramuka yang memerlukan penukaran dwibahasa WAJIB menggunakan atribut piawai:
    - `data-key="nama_kunci"`: Untuk menggantikan teks dalaman elemen (`element.textContent`).
    - `data-key-ph="nama_kunci"`: Untuk menggantikan teks `placeholder` pada medan input.
    - `data-key-title="nama_kunci"`: Untuk menggantikan atribut `title` atau tooltip.
    - `data-key-html="nama_kunci"`: Untuk elemen yang mengandungi struktur HTML berformat.
    - `data-i18n="nama_kunci"`: Disokong untuk keserasian legasi.
  - Contoh Penggunaan:
    ```html
    <h2 data-key="cars_title">Pilihan Kereta</h2>
    <input type="text" data-key-ph="cars_search_ph" placeholder="Cari kereta..." />
    ```

- **Satu Suis Bahasa Rasmi Sahaja (Single Official Language Toggle)**:
  - Penukaran bahasa hanya dikawal oleh suis rasmi `toggleLanguage()` pada bar utiliti atas (*topbar utility action*).
  - Mengikut **Prinsip Sifar Tindakan Bertindan (Strict Zero Duplicate Actions)**, DILARANG SAMA SEKALI menambah suis penukar bahasa pendua dalam satu halaman.

- **Kelarasan Teks**: DILARANG mencampuradukkan bahasa Inggeris dan Melayu dalam satu ayat (contoh salah: *"Sila return kereta at HQ"* $\rightarrow$ contoh betul: *"Sila pulangkan kereta di HQ"*).

---

## 5. Peraturan Komunikasi Ejen AI (Strict AI Guardrails)

- Ejen AI **DILARANG SAMA SEKALI** menyebut, mencadangkan, atau menulis perkataan dalam Senarai Hitam di atas semasa:
  1. Membalas mesej pengguna atau sesi soal jawab.
  2. Menjana kod baharu, skrip, atau templat UI.
  3. Menulis dokumen perancangan, ringkasan tugas, atau mesej commit.
- Sekiranya pengguna menggunakan istilah dalam senarai hitam (contoh: *"tambah armada"*), ejen AI mestilah membalas dan melaksanakan tugasan menggunakan istilah rasmi yang betul (*"menambah pilihan kereta"*).
