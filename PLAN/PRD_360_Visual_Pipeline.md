# WeDRIVE PRD — Modul Visual 360° & Asset Pipeline
**Versi Semasa:** `6.20.3`  
**Tarikh:** 10 September 2026  
**Repositori:** `hdanial211/WeDRIVE` (GitHub → Vercel auto-deploy)  
**Live URL:** `https://wedrive.website`  
**Stack:** HTML + Vanilla JS + Supabase (PostgreSQL) + Cloudinary (CDN gambar)

---

## 1. Latar Belakang & Konteks Penuh

### 1.1 Apa itu WeDRIVE?
Platform sewaan kereta AI-first bertapak di Melaka. Admin mendaftar kereta, pelanggan buat tempahan. UI mengikut **Apple HIG** (Bento Grid, dark/light mode, glassmorphism).

### 1.2 Sumber Visual Kereta — SpinCar / Impel
Kereta dalam sistem ini menggunakan asset visual dari **Carsome** (platform jual kereta terpakai Malaysia) yang menggunakan perkhidmatan **Impel/SpinCar** untuk 360° turntable.

- **SpinCar Viewer URL format:**
  ```
  https://cdn.impel.io/spincar-static/20190909/?_=HASH#!customer=Carsome!vin=VIN!disableautospin#!n=true!hideExpandBtn!region=eu
  ```
- **Impel API (EU region):**
  ```
  GET https://api-eu.impel.io/spin/Carsome/{VIN}?v=20160212
  Response: { cdn_image_prefix: "//cdn.impel.io/swipetospin-viewers/Carsome/{VIN}/{VERSION_TOKEN}/" }
  ```

### 1.3 CDN Asset Structure (per VIN)
```
{cdn_prefix}/
├── exterior/full-res/frame-000.jpg ... frame-199.jpg   ← 200 frames (360° spin)
├── pano/pano_f.jpg pano_b.jpg pano_l.jpg pano_r.jpg pano_u.jpg pano_d.jpg  ← 6 interior faces
├── ec/0-0.jpg 0-25.jpg 0-50.jpg 0-75.jpg 0-100.jpg 0-125.jpg 0-150.jpg 0-175.jpg  ← 8 gallery
└── thumb-sm.jpg  ← thumbnail
```

### 1.4 Masalah CDN Protection (KRITIKAL — BELUM SELESAI)
```
exterior/full-res/frame-*.jpg → HTTP 403 ❌ (AWS CloudFront protected)
pano/pano_*.jpg               → HTTP 200 ✅ (public, accessible)
ec/*.jpg                      → HTTP 200 ✅ (public, accessible)
thumb-sm.jpg                  → HTTP 200 ✅ (public, accessible)
```

**Exterior frames dilindungi oleh AWS CloudFront + S3 private.** Walaupun dari dalam Puppeteer browser (headless Chrome), `fetch()` dalam `page.evaluate()`, atau Node.js server-side — semua dapat 403. SpinCar viewer berfungsi dalam browser pengguna SAHAJA kerana ia menjalankan JavaScript dari `cdn.impel.io` domain itu sendiri (same-origin).

---

## 2. Status Sistem Semasa (v6.20.3)

### 2.1 Seni Bina Hybrid (Yang Berfungsi Sekarang)
| Asset | Cara Akses | Disimpan Di |
|---|---|---|
| 360° Exterior turntable | SpinCar iframe (cdn.impel.io) | `cars.exterior_360` JSON metadata |
| Interior 6 cube-map faces | Impel pano/ — public ✅ | Cloudinary → `cars.interior_360` JSON |
| Gallery 8 gambar | Impel ec/ — public ✅ | Cloudinary → `cars.supabase_images` array |
| Thumbnail | Impel thumb-sm.jpg — public ✅ | Cloudinary → `cars.thumbnail_url` |

### 2.2 Fail-Fail Utama yang Diubah
| Fail | Peranan |
|---|---|
| `admin/pages/car/add-car/step2-studio360.js` | Admin Studio: proses SpinCar URL, upload ke Cloudinary |
| `admin/js/car-detail.js` | Paparan detail kereta: turntable, interior viewer |
| `tools/download-spincar-frames.js` | CLI tool Puppeteer (belum berjaya untuk exterior) |
| `shared/model/{category}/{name}/` | Kereta sedia ada dengan 200 frames tempatan |
| `shared/model/{name}/source.json` | Metadata model: cdn_prefix, frame_count, faces |

### 2.3 Cloudinary Configuration
```
Cloud Name    : gwd1bhcx
Upload Preset : wedrive_360   (UNSIGNED — WAJIB, kerana upload dari browser)
Asset Folder  : model/{category}/{name}/
Interior Path : model/{cat}/{name}/interior/full-res/pano_{face}
Gallery Path  : model/{cat}/{name}/gallery/ec-{idx}
Endpoint      : https://api.cloudinary.com/v1_1/gwd1bhcx/image/upload
```

> **PENTING:** Unsigned upload TIDAK boleh guna parameter `overwrite: true` — ini menyebabkan 400 error. Buang `overwrite` dari FormData.

### 2.4 Supabase Database — Jadual `cars`
Kolum relevan untuk visual:
```sql
exterior_360    TEXT   -- JSON: { type:'impel_cdn', cdn_prefix, vin, customer, frame_count }
interior_360    TEXT   -- JSON: { f: url, b: url, l: url, r: url, u: url, d: url }
exterior_frames TEXT[] -- Array URLs Cloudinary (kosong untuk kereta SpinCar baru)
supabase_images TEXT[] -- Array 8 gallery photo URLs (Cloudinary)
image_url       TEXT   -- Hero photo URL
thumbnail_url   TEXT   -- Thumbnail URL
supabase_360    TEXT   -- SpinCar viewer URL asal
has_360         BOOL   -- true jika ada 360° data
```

### 2.5 Aliran car-detail.js untuk Turntable
```javascript
// setupExterior360(car):
// Case 0: exterior_360 = JSON dengan type:'impel_cdn'
//   → Paparkan SpinCar viewer dalam iframe
// Case 1: exterior_frames array ada URLs
//   → Paparkan custom WeDRIVE turntable (drag-to-spin)
// Case 2: supabase_360 = URL SpinCar
//   → Iframe fallback

// setupInteriorCockpit(car):
// Case A: interior_360 = JSON '{"f":url,"b":url,...}'
//   → Load 6 cube-map faces dari Cloudinary
// Case B: window._wedrive_impel_cdn_prefix ada
//   → Load dari CDN prefix live (pano/pano_{face}.jpg)
// Case C: model key ada dalam shared/model/
//   → Load dari /shared/model/{cat}/{name}/interior/
```

---

## 3. Masalah Belum Selesai — Yang Perlu Dibuat

### 3.1 MASALAH UTAMA: Exterior 200 Frames Tidak Boleh Didownload Automatik

**Apa yang dikehendaki:** Sama seperti kereta dalam `shared/model/` yang ada 200 frames (`frame-000.jpg` hingga `frame-199.jpg`), kereta baru yang didaftarkan via admin JUGA perlu ada 200 frames supaya:
1. Custom WeDRIVE turntable (drag-to-spin) berfungsi
2. Frames disimpan kekal di Cloudinary (tidak bergantung pada CDN yang mungkin expire)

**Mengapa tidak boleh sekarang:**
- Impel CDN menggunakan **AWS CloudFront + S3 private bucket**
- Semua percubaan download: Node.js fetch (403), Puppeteer headless (403), browser fetch dari dalam `page.evaluate()` (403)
- Hanya SpinCar viewer sendiri yang boleh load frames (same-origin JS)

**Cadangan Penyelesaian:**

#### Pilihan A: Chrome Extension (PALING MUNGKIN BERJAYA)
Bina Chrome Extension yang:
1. Detectkan apabila pengguna membuka SpinCar URL
2. Intercept network responses untuk `exterior/full-res/frame-*.jpg`
3. Kumpul semua 200 frames sebagai blob
4. Upload ke Cloudinary via background script
5. Hantar URLs ke WeDRIVE admin via `chrome.tabs.sendMessage`

**Kelebihan:** Extension berjalan dalam real Chrome (bukan headless), mempunyai akses penuh ke semua network requests termasuk yang protected oleh CloudFront.

#### Pilihan B: Manual HAR Export
1. Admin buka SpinCar URL dalam Chrome biasa
2. Tekan F12 → Network → Filter `frame-` → Export HAR
3. Script Node.js baca HAR file dan extract frame blobs
4. Upload ke Cloudinary

#### Pilihan C: Hubungi Impel API untuk Download Token
Check jika Impel API ada endpoint untuk `download_url` atau `signed_url` untuk frames (perlu API key dari Carsome/Impel).

### 3.2 Delete Car Functionality (Belum Dibuat)
- `admin/js/car-detail.js` — perlu fungsi `deleteCar(carId)`
- `admin/pages/car/` — butang "Padam Kenderaan" dengan konfirmasi modal
- Supabase: `DELETE FROM cars WHERE id = $1` + delete Cloudinary assets

### 3.3 tools/download-spincar-frames.js — Perlu Upgrade
Fail ini ada di `tools/download-spincar-frames.js`. Interior pano berjaya (server-side fetch). Perlu handle gracefully bila exterior frames 403.

---

## 4. Cara Menjalankan Sistem

### 4.1 Dev Server
```bash
cd "/Users/hakim/Library/Mobile Documents/com~apple~CloudDocs/SEM DEGREE/SEM KHAS 6/BITU3983 PROJECT II(FYP 2)/AI CAR RENTAL SYSTEM"
python3 -m http.server 8088
# Admin: http://localhost:8088/admin/pages/car/add-car/step1-carspec.html
```

### 4.2 Credentials
```
Admin Login    : admin@wedrive.my / admin123
Customer Login : ahmad@wedrive.my / customer123
Supabase URL   : https://nigyovaqffwyinovivlh.supabase.co
Cloudinary     : gwd1bhcx / preset: wedrive_360
```

### 4.3 Git Workflow
```bash
git describe --tags --abbrev=0   # Semak versi terkini (6.20.3)
git commit -m "6.X.X Description"
git tag 6.X.X && git push origin main --tags
```

---

## 5. Source JSON Format (shared/model/)

Contoh: `shared/model/Hatchback/2017 Perodua AXIA G 1.0/source.json`
```json
{
  "model": "2017 Perodua AXIA G 1.0",
  "category": "Hatchback",
  "asset_type": "360-spin-exterior",
  "source_viewer_exterior": "https://cdn.impel.io/spincar-static/20190909/...",
  "cdn_prefix": "https://cdn.impel.io/swipetospin-viewers/Carsome/VIN/VERSION/",
  "exterior": { "frame_count": 200, "full_res_pattern": "exterior/full-res/frame-{padded}.jpg" },
  "interior": {
    "viewer_supported": true,
    "format": "cubemap",
    "faces": { "f": "interior/full-res/pano_f.jpg", "b": "...", "l": "...", "r": "...", "u": "...", "d": "..." }
  }
}
```

---

## 6. Aliran Admin Tambah Kereta Baru (Step 1 → Step 2 → Step 3)

```
Step 1 (step1-carspec.html):
  → Admin isi: No. Pendaftaran, Pengeluar, Model, Kategori, Tahun, Warna, Enjin, Transmisi, Tempat Duduk, Harga
  → Simpan ke localStorage: 'wedrive_new_car_draft'

Step 2 (step2-studio360.html / step2-studio360.js):
  → Admin tampal SpinCar URL dari https://carsome.my (buka mana-mana kereta, klik 360°)
  → Klik "Jana AI" → separateSpinCarAssets() dipanggil
  → Impel API dipanggil → dapat cdn_prefix
  → Gallery 8 photos, interior pano displayed
  → Klik "Simpan Visual" → handleSaveVisuals() dipanggil:
     ├── Upload interior 6 faces ke Cloudinary
     ├── Upload gallery 8 photos ke Cloudinary
     ├── Upload thumbnail ke Cloudinary
     ├── Simpan exterior_360 JSON metadata (untuk SpinCar iframe)
     └── Simpan semua ke localStorage draft

Step 3 (step3-confirm.html):
  → Preview kereta
  → Klik "Daftar" → upload ke Supabase cars table
```

---

## 7. Struktur Fail Projek Relevan

```
AI CAR RENTAL SYSTEM/
├── admin/
│   ├── pages/car/add-car/
│   │   ├── step1-carspec.html
│   │   ├── step2-studio360.html
│   │   ├── step2-studio360.js    ← FAIL UTAMA upload Cloudinary
│   │   └── step3-confirm.html
│   └── js/
│       └── car-detail.js         ← FAIL UTAMA viewer 360°
├── shared/
│   ├── css/wedrive.css
│   ├── js/main.js, api.js
│   ├── lang/en.js, ms.js
│   └── model/
│       ├── registry.json
│       ├── Hatchback/2017 Perodua AXIA G 1.0/{exterior/, interior/, source.json}
│       └── MPV/TEST Mitsubishi Xpander/{interior/full-res/pano_*.jpg, source.json}
└── tools/
    └── download-spincar-frames.js  ← Puppeteer CLI (interior works, exterior 403)
```

---

## 8. Peringatan Penting untuk AI Seterusnya

1. **JANGAN cuba download `exterior/full-res/frame-*.jpg` secara langsung** — selalu 403 dari CloudFront (sudah diuji: Node.js, Puppeteer headless, browser fetch dalam page.evaluate() — semua 403)
2. **Interior pano faces (pano/pano_*.jpg) BOLEH diakses** — guna server-side fetch atau browser fetch
3. **Gallery ec/ photos BOLEH diakses** — sama seperti interior
4. **Cloudinary unsigned upload JANGAN masukkan `overwrite: true`** — akan dapat 400 error
5. **SpinCar iframe berfungsi untuk pengguna akhir** — gunakan `exterior_360` JSON metadata
6. **Versi Git mesti ikut SemVer X.Y.Z** tanpa huruf 'v'
7. **Semua UI teks** mesti ada dalam `shared/lang/en.js` dan `ms.js` dengan `data-key` attribute
8. **Apple HIG rules:** butang ikon = bulat 1:1 exact (aspect-ratio: 1/1), butang teks = pill capsule (border-radius: 9999px)
9. **Satu lokasi operasi:** WeDRIVE beroperasi di HQ Melaka sahaja — DILARANG tambah lokasi lain
10. **Bahasa:** Semua UI dalam Bahasa Melayu Moden 2026 (BUKAN archaic: dilarang "Armada", "Fleet", "Wahana")
