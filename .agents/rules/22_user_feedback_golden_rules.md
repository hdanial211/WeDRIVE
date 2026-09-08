# WeDRIVE User Feedback Golden Rules & Verbal Directives

Dokumen ini mengabadikan kesemua teguran, maklum balas, dan arahan langsung pengguna (*User Verbal Mandates & Feedback*) sebagai undang-undang mandatori kekal sistem yang **WAJIB dipatuhi oleh SEMUA ejen AI dalam setiap sesi tanpa lupa**.

---

## 1. Prinsip Pengabadian Maklum Balas Pengguna (Eternal User Mandate Principle)

- **Keutamaan Tertinggi:** Setiap teguran pengguna berkenaan UX, teks, geometri, atau aliran interaksi mengatasi andaian kendiri AI.
- **Sifar Kelupaan Antara Sesi:** AI dilarang mengulangi kesilapan yang telah ditegur oleh pengguna dalam sesi terdahulu.

---

## 2. Prinsip Dwikeadaan Draf Bertukar (Interactive Swapping Draft State Protocol)

> *"ni akan muncul apabila saya tekan simpan draf sahaja ...n simpan draf tu akan hilang ..kiranya dia bertukar...nnti bila saya ada tukar2 sikit dia muncul balik simpan draf"*  
> *"Draf disimpan secara automatik di awan > Draf disimpan ... ayat simple kan aja"*

### Peraturan Interaksi Dwiarah:
1. **Keadaan Asal / Unsaved / Selepas Suntingan**:
   - Butang `[Simpan Draf]` terpapar secara aktif di bar tindakan bawah terapung (*Floating Dock*).
   - Penunjuk `Draf disimpan` WAJIB disembunyikan (`hidden`).
2. **Apabila Ditekan Butang `Simpan Draf` (`manualSaveDraft`)**:
   - Butang `[Simpan Draf]` **hilang / bertukar** serta-merta (`hidden`).
   - Digantikan oleh penunjuk elegan: Ikon awan hijau padu berserta tanda semak putih padu dan teks: **`Draf disimpan`** (`flex` dengan animasi gelombang haptik Apple `ai-field-wave` dan notifikasi Apple Glass Toast).
3. **Apabila Pengguna Mengubah Sebarang Medan ("bila ada tukar-tukar sikit")**:
   - Sebaik sahaja pengguna menaip, menukar pilihan dropdown, atau menjana semula spesifikasi (`input` / `change` event), penunjuk `Draf disimpan` **hilang semula secara automatik**, dan butang `[Simpan Draf]` **muncul kembali** sedia untuk ditekan.
4. **Pemudahan Frasa (Simplified Copy)**:
   - DILARANG menggunakan ayat panjang seperti *"Draf disimpan secara automatik di awan"*.
   - WAJIB gunakan ayat ringkas dan padat: **`Draf disimpan`**.

---

## 3. Prinsip Sifar Pemotongan Teks & Sifar Elipsis Butang (Zero Ellipsis & Compact Microcopy Rule)

> *"Ayat tu saya rasa kene muatkan kiranya simple kan ayat untuk muat dalam kotak kalau x dia akan letak (...)"*

### Peraturan Teks Butang Padat:
- **Had Aksara Butang**: Teks dalam butang borang WAJIB padat dan ringkas (sasaran: **10–16 aksara**).
- **Sifar Tanda Kurung / Elipsis (`...`)**: DILARANG meletakkan ayat panjang di dalam butang yang menyebabkan pelayar memotong teks menjadi `...` atau melimpah keluar (*overflow*).
- **Piawaian Mikro-Teks Langkah 1 (Spesifikasi AI)**:
  - Keadaan Sedia: **`Isi Automatik`** (Lencana: `Jana AI ↓`)
  - Semasa Memproses: **`Mengenal model...`** / **`Memadankan data...`**
  - Selesai: **`✓ Spesifikasi Lengkap`** (Lencana: `Selesai`)
- **Ruang Nafas Selesa**: Pastikan terdapat ruang lega mencukupi pada semua peranti Apple (iPhone 393px, iPad 820px, MacBook 1440px).

---

## 4. Prinsip Pemisahan Maksud Label & Butang (Label vs Action Distinction Rule)

> *"bukan ke sama ayat ni cuba ubah sikit lain2"*

### Peraturan Sifar Pertindihan Maksud:
- **DILARANG SAMA SEKALI** meletakkan teks yang membawa maksud sama atau berulang antara label medan dan butang tindakan yang bersandaran (contoh: Label *"Pengecaman Spesifikasi Pintar"* di atas butang *"AI Auto Generate Spec"* adalah penduaan yang dilarang).
- **Pemisahan Peranan Jelas**:
  - **Label Medan (Konteks)**: Menerangkan kategori atau fungsi medan tersebut (contoh: **`Cadangan Spesifikasi Pintar`**).
  - **Butang Tindakan (Kata Kerja)**: Menerangkan perbuatan kata kerja yang spesifik dan berbeza (contoh: **`Isi Automatik`** dengan lencana **`Jana AI ↓`**).

---

## 5. Penyeragaman Istilah Moden: "Harga" Menggantikan "Tarif"

> *"Tarif ni tukar macam pelik guna perkataan harga better lagi"*

### Peraturan Bahasa & Terminologi:
- Perkataan **`Tarif`** dan **`Kadar Tarif`** disenaraihitamkan sepenuhnya kerana kedengaran kaku, lapuk, dan janggal dalam konteks perkhidmatan sewaan kereta harian di Malaysia.
- **WAJIB** menggunakan istilah mesra pengguna: **`Harga`**, **`Kadar Sewaan`**, atau **`Harga Sewaan`** (contoh: `Penetapan Harga Sewaan Pintar`, `Ringkasan Harga`, `Harga Harian`).

---

## 6. Penjanaan Serentak 6 Sudut Foto Pemeriksaan Kenderaan

> *"perfecto kalau letak link tu terus ai generate untuk 6gambar terus kan macam tu lg better"*

### Aliran Studio Visual AI:
- Apabila pengguna memasukkan pautan CDN kenderaan dan menekan butang `Jana AI`, enjin AI WAJIB menjana visual interaktif 360° **serentak dengan pengisian automatik kesemua 6 sudut foto pemeriksaan kenderaan** (Hadapan, Belakang, Sisi Kanan, Sisi Kiri, Ruang Pemandu, Ruang Penumpang) berserta lencana `✓ Diimbas AI`.
- Pengguna tidak perlu memuat naik gambar satu demi satu sekiranya pautan imbasan telah tersedia.

---

## 7. Keseimbangan Ketinggian Menegak Komponen (Equal Height Alignment 46px)

> *"kalau boleh saya nak ai punya bentuk tinggi ni sama dengan sebelah , lebar saya x kesah"*

### Peraturan Geometri Ketinggian Apple HIG:
- Sebarang butang tindakan khas (seperti butang AI, butang imbas, butang carian) yang terletak sebaris dengan medan input borang WAJIB mempunyai **ketinggian menegak (`computed height`) yang seimbang tepat 1:1** dengan medan input bersebelahannya (`h-[46px] py-0` berbanding input `py-3` = 46px).
- Dilarang butang kelihatan tergantung lebih pendek atau lebih tinggi daripada kotak input di sebelahnya.

---

## 8. Prinsip Keterlihatan Kawalan Visual Galeri Sahaja (Gallery-Only Visual Controls)

> *"hanya muncul bila saya tekan galeri sahaja"*

### Peraturan Keterlihatan Bersyarat:
- Butang anak panah terapung navigasi gambar (`<` dan `>`) berserta jalur gambar kecil (*thumbnail preview strip*) **WAJIB HANYA muncul apabila pengguna memilih tab "Galeri"**.
- Apabila pengguna menukar tab ke mod **"Pusingan 360°"** atau **"Panorama Dalaman"**, kedua-dua butang navigasi anak panah dan jalur thumbnail WAJIB disembunyikan secara mutlak (`display: none !important;`).
- Paparan mod 360° dan Panorama mesti kekal bersih dan fokus kepada putaran interaktif dan pemandangan luas tanpa gangguan anak panah imej statik.

---

## 9. Penyeragaman Visual Merentas Langkah Pendaftaran (Universal Stepper Parity: Step 2 & Step 3)

> *"buat sekali dengan page 3 macam tu"*

### Peraturan Kesinambungan Pengalaman Pengguna:
- Sebarang keupayaan interaktif visual yang diperkenalkan pada Langkah 2 (Studio Visual 360°) **WAJIB diaplikasikan secara sepadan pada Langkah 3 (Semakan & Pengesahan)**.
- Ini merangkumi:
  1. Butang anak panah terapung 1:1 bulat sempurna (`aspect-ratio: 1/1 !important; border-radius: 50% !important;`).
  2. Jalur dinamik gambar kecil (*thumbnail preview strip*) mengikut bilangan foto sebenar (5 jika 5 gambar, 6 jika 6 gambar).
  3. Logik keterlihatan eksklusif: hanya muncul semasa tab "Galeri" aktif.

---

## 10. Penjenamaan Bersih Tab Galeri (Clean Tab Labeling - Zero Angle Clutter)

- Label tab galeri WAJIB menggunakan perkataan ringkas dan profesional: **`Galeri`** (Bahasa Melayu) dan **`Gallery`** (Bahasa Inggeris).
- **DILARANG SAMA SEKALI** meletakkan frasa terhad seperti *"6 Sudut"* atau *"6-Angle"* pada label tab kerana bilangan foto pemeriksaan boleh berbeza (cth: 5 atau 6 sudut) mengikut model kenderaan.

---

## 11. Had Kandungan Fail & Kawalan Siling 12,000 Aksara
- Fail ini dikawal selia di bawah had siling **12,000 aksara** selaras dengan `12_max_content_limit.md`.
