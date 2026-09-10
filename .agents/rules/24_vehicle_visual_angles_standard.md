# WeDRIVE Vehicle Visual Angles & 360 Turntable Orientation Standards

## 1. Asas & Konsistensi Mutlak Meja Putar Impel CDN (`https://cdn.impel.io/`)

- **Prinsip Koordinat Sudut Seragam (Universal Turntable Consistency):**
  - Kesemua aset visual kenderaan 360° yang diperoleh daripada pembekal CDN Impel / Carsome dirakam menggunakan meja putar bermotor berkoordinat tetap (*standardized motorized turntable*).
  - Meja putar ini berputar pada paksi darjah yang tepat dan berulang merentas semua sesi fotografi kenderaan.
  - **DILARANG SAMA SEKALI meneka atau menganggap sudut berubah-ubah secara rawak**. Nombor bingkai (*frame index*) dan koordinat sudut adalah 100% konsisten antara satu kenderaan dengan kenderaan yang lain.

---

## 2. Rujukan Penanda Aras Emas BMW 320i (Single Source of Truth)

- **Fail Rujukan Utama:**
  - Segala penetapan sudut bahagian hadapan, belakang, sisi kiri, sisi kanan, dalaman kubus, dan luaran meja putar berpandukan konfigurasi teras di:
    [`shared/model/Sedan/2023 BMW 320i M Sport 2.0/source.json`](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/shared/model/Sedan/2023%20BMW%20320i%20M%20Sport%202.0/source.json).

### Jadual Pemetaan Orientasi Meja Putar (200 Bingkai Penuh: 0–199)

| Bahagian Kenderaan | Sudut Darjah (°)| Indeks Bingkai Meja Putar | URL Thumbnail CDN Impel | Peranan Sistem WeDRIVE |
| :--- | :--- | :--- | :--- | :--- |
| **Hadapan Tiga Suku** | **~315° / Emas** | **Bingkai 140** (`frame-140.jpg`) | `ec/0-140.jpg` | **Foto Utama (Hero Cover / Front of Card - Slot 0)** |
| **Hadapan Penuh (*True Front*)** | **0°** | **Bingkai 125** (`frame-125.jpg`) | `ec/0-125.jpg` | **Hadapan Penuh (Slot 1)** |
| **Sisi Kanan Profil** | **90°** | **Bingkai 175** (`frame-175.jpg`) | `ec/0-175.jpg` | **Sisi Kanan Profil (Slot 2)** |
| **Sisi Kiri Profil** | **270°** | **Bingkai 75 / 50** (`frame-075.jpg` / `050`) | `ec/0-50.jpg` | **Sisi Kiri Profil (Slot 3)** |
| **Belakang Penuh (*Full Rear*)** | **180°** | **Bingkai 24 / 100** (`frame-024.jpg` / `100`) | `ec/0-100.jpg` | **Belakang Penuh (Slot 4)** |
| **Sisi Belakang Kiri** | **225°** | **Bingkai 0** (`frame-000.jpg`) | `ec/0-0.jpg` | **Sisi Belakang Kiri (Slot 5)** |
| **Sisi Hadapan Kanan** | **45°** | **Bingkai 25** (`frame-025.jpg`) | `ec/0-25.jpg` | Galeri Tambahan |
| **Sisi Belakang Kanan** | **135°** | **Bingkai 75** (`frame-075.jpg`) | `ec/0-75.jpg` | Galeri Tambahan |

---

## 3. Pemetaan Panorama Dalaman (*Interior Cubemap Faces*)

Pemandangan panorama dalaman 360° menggunakan pemformatan 6 muka kubus (*cube-map panorama*) beresolusi tinggi:

| Kod Muka | Orientasi Kamera Dalaman | Corak Fail Tempatan | Fail Sumber CDN Impel |
| :--- | :--- | :--- | :--- |
| **`f` (Front)** | Hadapan Pemandu (Papan Pemuka / Stereng) | `interior/full-res/pano_f.jpg` | `pano/pano_f.jpg` |
| **`r` (Right)** | Tempat Duduk Penumpang Kanan | `interior/full-res/pano_r.jpg` | `pano/pano_r.jpg` |
| **`b` (Back)** | Ruang Kabin Belakang / Cermin Belakang | `interior/full-res/pano_b.jpg` | `pano/pano_b.jpg` |
| **`l` (Left)** | Pintu Pemandu & Cermin Sisi Kiri | `interior/full-res/pano_l.jpg` | `pano/pano_l.jpg` |
| **`u` (Up)** | Bumbung Dalaman / Bumbung Suria (*Sunroof*) | `interior/full-res/pano_u.jpg` | `pano/pano_u.jpg` |
| **`d` (Down)** | Konsol Gear Tengah & Lantai Kenderaan | `interior/full-res/pano_d.jpg` | `pano/pano_d.jpg` |

---

## 4. Peraturan Mandatori Muka Kad Kenderaan (Front of Card Guarantee)

1. **Slot 0 Wajib Bingkai 140 (Hadapan Tiga Suku):**
   - Pada pendaftaran kenderaan baharu (`add-car`) dan pengubahsuaian kenderaan (`edit-car`), **Slot 0 (Foto Utama / Hero Cover)** WAJIB sentiasa dikunci kepada **Bingkai 140** (`frame-140.jpg` atau `ec/0-140.jpg`).
   - Sudut tiga suku hadapan ini adalah sudut fotografi automotif rasmi (*golden hero angle*) yang menonjolkan bentuk gril, lampu hadapan, dan lekuk sisi kereta serentak.
2. **Keselarasan Paparan Persis Toyota Alphard:**
   - Semua kad kenderaan di seluruh sistem (kad inventori admin, kad kereta tersedia, kad carian, dan kad pandangan pelanggan) akan sentiasa memaparkan sudut hadapan tiga suku yang cantik, kemas dan anggun, **tepat seperti penanda aras 2019 Toyota Alphard G S C Package 2.5**.
   - DILARANG memaparkan gambar belakang kereta, cermin sisi terpotong, atau imej dalaman sebagai imej muka hadapan kad utama (`images[0]`).

---

## 5. Protokol Semasa Muat Turun & Penstoran Aset Visual

Setiap kali skrip muat turun, fungsi AI, atau ejen memproses pautan visual 360°:
1. **Pengekstrakan Automatik Mengikut Indeks:**
   - Ekstrak 6 foto pemeriksaan mengikut urutan slot `0-140` (Slot 0), `0-125` (Slot 1), `0-175` (Slot 2), `0-50` (Slot 3), `0-100` (Slot 4), dan `0-0` (Slot 5).
2. **Penamaan Fail Tempatan:**
   - Apabila memuat turun 200 kerangka penuh, simpan di bawah `shared/model/<Kategori>/<Nama Model>/exterior/full-res/frame-{000..199}.jpg`.
   - Simpan fail kubus dalaman di bawah `interior/full-res/pano_{f,r,b,l,u,d}.jpg`.
3. **Pengekalan Metadata `orientation_frames`:**
   - Setiap kali rekod kenderaan disimpan atau dicipta, metadata `orientation_frames` WAJIB disertakan dalam objek muatan Supabase:
     ```json
     "orientation_frames": {
       "hero": 140,
       "front": 125,
       "right": 175,
       "left": 75,
       "rear": 24
     }
     ```
