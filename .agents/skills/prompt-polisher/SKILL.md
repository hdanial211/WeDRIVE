---
name: prompt-polisher
description: Kemahiran menterjemahkan idea atau arahan mentah pengguna menjadi spesifikasi teknikal lengkap bertaraf Apple HIG, skema Supabase PostgreSQL, dan senario ujian Playwright tanpa memerlukan pengguna menaip panjang.
---

# WeDRIVE Prompt Polisher Skill

## 1. Pengenalan & Matlamat Operasi
Kemahiran ini bertindak sebagai penterjemah pintar antara hasrat kasual pengguna dengan keperluan seni bina teknikal sistem WeDRIVE. Ia memastikan setiap idea baharu yang ringkas diproses menjadi pelan tindakan 4 dimensi yang lengkap sebelum sebarang kod ditulis.

---

## 2. Empat Dimensi Penalaan Prompt (4D Prompt Enrichment)

Setiap kali pengguna memberikan arahan ringkas, kemahiran ini melengkapkan 4 aspek secara automatik:

### A. Dimensi Antaramuka & Apple HIG (UI Dimension)
- Menentukan susun atur Bento Grid squircle (`border-radius: 24px/28px`).
- Memastikan sifar lompang kosong (*Zero Dead Space*).
- Menguatkuasakan **Prinsip Sifar Bujur (Zero Oval Rule)**: Butang ikon bulat 1:1 sempurna, butang teks kapsul pil `9999px`.
- Menggunakan bahan kaca Apple Thin Material (`backdrop-filter: blur(20px) saturate(180%)`).

### B. Dimensi Pangkalan Data & Logik (Data Dimension)
- Menentukan pemetaan jadual Supabase PostgreSQL (`cars`, `bookings`, `profiles`, `payments`).
- Memastikan pematuhan dasar Row Level Security (RLS).
- Menghapuskan data cereka dengan mematuhi **Peraturan Sifar Data Palsu (Zero Fake Data Rule)**.

### C. Dimensi Jaminan Kualiti & Automasi (QA Dimension)
- Mereka bentuk senario ujian automatik Playwright CLI.
- Memastikan tiada gangguan pada kredensial akaun rasmi (`admin@wedrive.my` & `ahmad@wedrive.my`).

### D. Dimensi Bahasa Melayu Moden 2026 (Language Dimension)
- Memastikan penggunaan kosa kata kontemporari Malaysia yang segar dan santai.
- Menapis sifar perkataan senarai hitam (*Armada, Fleet, Wahana, Kabin, Kokpit, Prapapar*).

---

## 3. Contoh Transformasi Prompt Mentah ke Prompt Sempurna

```text
[Input Pengguna Mentah]:
"Saya nak tambah feature filter jenis minyak dekat page explore kereta"

[Hasil Polisher Automatik]:
1. Halaman Sasaran: guest/pages/explore/explore.html & customer/pages/cars/browse-cars.html
2. Komponen UI: Cip penapis Apple segmented pill (Petrol, Diesel, Hibrid, Elektrik/EV).
3. Pemetaan Data: Kolum 'fuel_type' pada jadual Supabase 'cars'.
4. Tindakan Klik: Penapisan lejar masa nyata tanpa muat semula halaman, dengan paparan kad Bento kemas.
5. Verifikasi: Ujian Playwright penukaran cip penapis dan semakan kontras tema.
```
