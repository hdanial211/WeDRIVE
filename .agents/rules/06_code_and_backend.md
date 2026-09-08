---
trigger: always_on
---

# WeDRIVE Code, Architecture & Backend Standards

## 1. File & Folder Management

- Susun semua file supaya kemas, tidak berselerak, dan mudah diselenggara.
- File yang tidak digunakan WAJIB dipindahkan ke folder `bin/`.
- Setiap kali menambah atau membuang file/folder, kemas kini: [06_code_and_backend.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/06_code_and_backend.md) dan [.agents/PROJECT_STRUCTURE.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/PROJECT_STRUCTURE.md) (Master) serta `docs/PROJECT_STRUCTURE.md`.
- **Had Siling 12,000 Aksara Per Fail:** Semua fail peraturan (`.agents/rules/*.md`) dan dokumentasi WAJIB dihadkan kepada maksimum **12,000 aksara** per fail. AI bebas mencipta sehingga 20–30 fail modular bagi mendalami setiap domain tanpa limpahan saiz (Rujuk [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md)).

## 2. CSS Architecture (1 Module = 1 CSS)

Setiap modul ada SATU fail CSS utama sahaja:

| Modul    | CSS File                    | Kegunaan                                  |
| -------- | --------------------------- | ----------------------------------------- |
| Admin    | `admin/css/admin.css`       | Semua gaya admin pages                    |
| Customer | `customer/css/customer.css` | Semua gaya customer pages                 |
| Guest    | `guest/css/guest.css`       | Semua gaya guest pages (Pricing, Explore) |
| Account  | `account/css/auth.css`      | Gaya login, signup, forgot password       |

### Peraturan CSS

- JANGAN buat file CSS baru yang duplicate fungsi sedia ada.
- JANGAN letak inline `<style>` besar dalam HTML. Pindahkan ke fail CSS modul.
- Fail `shared/css/` hanya untuk komponen GLOBAL: theme, navbar, footer, chatbot, animation, sidebar.
- Pastikan theme (Day/Night mode) konsisten di semua page.

## 3. Multilingual & Theme Support (Strict Single Source of Truth)

Projek ini menyokong dwibahasa (EN/MS) dan dwi-tema (Day/Night) penuh di semua halaman:
- **Theme:** Night mode & Day mode (toggle dikawal oleh `shared/js/main.js`).
- **Pusat Mutlak Terjemahan Bahasa (`shared/lang/`):**
  - **SEMUA** teks antaramuka, label, butang, placeholder, dan mesej ralat WAJIB disimpan secara berpusat dalam `shared/lang/` (`en.js`, `en.json`, `ms.js`, `ms.json`).
  - **DILARANG SAMA SEKALI** meletakkan kamus bahasa atau teks terjemahan bertaburan di dalam skrip modul atau inline HTML.
  - Setiap elemen WAJIB dibinding menggunakan atribut `data-key`, `data-key-ph`, `data-key-title`, `data-key-html` atau `data-i18n`.
  - Tertakluk secara mutlak kepada piawaian Bahasa Melayu Moden 2026 dalam [11_language_standards.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II%28FYP%202%29/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/11_language_standards.md).

## 4. Dasar Sifar Dummy Hardcode & Aliran Data Sebenar Sahaja (Strict Real Data Pipeline - Zero Hardcoded Dummy Data)

- **Larangan Mutlak Hardcode Dummy Data:**
  - DILARANG SAMA SEKALI meletakkan data dummy yang di-hardcode (statik) pada halaman pengesahan, pratonton, atau paparan operasi.
  - Sistem WeDRIVE adalah sistem pengeluaran profesional yang HANYA menggunakan data sebenar (*real data only*).
- **Aliran Paip Data Sebenar (Real Data Pipeline):**
  - **Aliran Wizard / Borang Pelbagai Langkah (Multi-Step Stepper):** Data yang diisi pada langkah terawal (contoh: Langkah 1 Spesifikasi Kenderaan) WAJIB disimpan secara automatik ke dalam storan draf sesi (`localStorage.getItem('wedrive_new_car_draft')`) dan dibaca secara dinamik oleh langkah seterusnya (Langkah 2 & Langkah 3). DILARANG memaparkan teks statik contoh sekiranya pengguna memasukkan data lain.
  - **Penyegerakan Dua Hala (Two-Way Restoration):** Sekiranya pengguna menavigasi kembali ke langkah sebelumnya, borang WAJIB memulihkan nilai yang telah disimpan (*restore draft*) supaya pengguna tidak perlu menaip semula.
  - **Pangkalan Data Pengeluaran:** Semua rekod inventori, tempahan, profil pelanggan, dan transaksi kewangan WAJIB bersumberkan pangkalan data Supabase PostgreSQL melalui `window.WeDriveAPI` atau klien rasmi Supabase.


## 5. Auth Guard

- **Semasa development:** Auth guard di-disable supaya mudah navigate antara page.
- **Selepas semua page siap:** Auth guard diaktifkan untuk redirect ke login page bagi user yang belum login.

## 6. Zero Coding Jargon in Interface UI (Prinsip Sifar Jargon Pengaturcaraan dalam UI)

- **Pemisahan Jelas Antara Kod & Antaramuka:**
  - Segala istilah teknikal pengaturcaraan, pangkalan data, dan cache (seperti `database`, `pangkalan data`, `cache`, `Supabase`, `SQL`, `API`, `JSON`, `query`, `staging`) HANYA dibenarkan wujud dalam fail kod sumber (`.js`, `.sql`, komen kod).
  - **DILARANG SAMA SEKALI** memaparkan istilah-istilah ini pada antaramuka pengguna (UI) sama ada untuk Admin mahupun Pelanggan. Pengguna dan staf pentadbir operasi adalah orang awam (*non-coders*) yang tidak tahu pengaturcaraan.
  - Antaramuka WAJIB menggunakan bahasa pengalaman pengguna (UX) Apple yang bersih dan mesra pengguna (contoh: *Simpan Visual*, *✓ Berjaya Disimpan*, *Pratonton Sedia*, *Tersimpan Selamat*).

