---
trigger: always_on
---

# WeDRIVE Project Rules

## 1. Theme & Design Consistency

- Setiap perubahan UI mesti ikut tema sedia ada (warna, font, layout).
- Jangan cipta tema baru melainkan diarahkan oleh user.

## 2. Git Version Control

- Setiap perubahan WAJIB push ke GitHub.
- Format commit message: `X.X.X Description of changes`
- JANGAN letak huruf `v` di depan version number.

### Struktur Version (Major.Minor.Patch)

| Bahagian | Bila guna                                          | Contoh                                    |
| -------- | -------------------------------------------------- | ----------------------------------------- |
| Major    | Modul baru / redesign keseluruhan                  | `3.0.0 Redesign full admin dashboard`     |
| Minor    | Tambah feature / improvement / perubahan sederhana | `2.8.0 Add Calendar Overview module`      |
| Patch    | Bug fix / tweak kecil / styling update             | `2.8.1 Fix hover animation, adjust spacing` |

### Peraturan Version

- Version MESTI berturutan. Contoh: selepas `2.7.1`, seterusnya ialah `2.7.2` (patch), `2.8.0` (minor), atau `3.0.0` (major). JANGAN lompat ke belakang.
- Setiap commit WAJIB ada tag di GitHub yang sepadan dengan version number.

## 3. Logo

- Ikon di kiri, teks di kanan.
- Background mesti transparent.
- Favicon (logo pada tab browser) WAJIB ada di setiap page.

## 4. No Emoji

- JANGAN gunakan emoji dalam kod, commit message, atau UI.

## 5. File Management

- File yang tidak digunakan WAJIB dipindahkan ke folder `bin/`.
- Path: `/Users/hakim/Library/Mobile Documents/com~apple~CloudDocs/SEM DEGREE/SEM 6/BITU3973 PROJECT I(FYP 1)/AI CAR RENTAL SYSTEM/bin`

## 6. Folder Structure

- Susun semua file supaya kemas, tidak berselerak, dan mudah maintain.
- Gunakan folder berasingan untuk setiap kumpulan fail berkaitan.
- Setiap kali tambah atau buang file/folder, WAJIB update file ini:
  `/Users/hakim/Library/Mobile Documents/com~apple~CloudDocs/SEM DEGREE/SEM 6/BITU3973 PROJECT I(FYP 1)/AI CAR RENTAL SYSTEM/PROJECT_STRUCTURE.md`

## 7. CSS & JS Sharing

- Gunakan fail CSS dan JS yang sama di folder `shared/` untuk semua HTML page.
- JANGAN buat file CSS/JS baru yang duplicate fungsi sedia ada.
- Pastikan theme (Day/Night mode) konsisten di semua page.

## 8. Multilingual & Theme Support

Projek ini menyokong:
- **Theme:** Night mode & Day mode (toggle)
- **Bahasa:** English & Melayu (dynamic language switching)

Kedua-dua feature ini WAJIB berfungsi di semua page.

## 9. Dummy Data

- Data dummy / frontend data mesti disimpan secara tersusun dalam `shared/data/`.
- Data mesti boleh sync dengan backend apabila backend sudah siap.
- Gunakan satu fail data utama (`data.json`) sebagai single source of truth.

## 10. Sidebar

Setiap modul ada sidebar sendiri. Dalam satu modul, SEMUA page WAJIB guna sidebar yang sama.

| Modul    | Sidebar Component                        |
| -------- | ---------------------------------------- |
| Admin    | `admin/components/sidebar.html`          |
| Customer | `customer/components/sidebar.html`       |
| Guest    | `guest/components/sidebar.html`          |

- Sidebar admin, customer, dan guest adalah BERBEZA antara satu sama lain.
- Tapi dalam modul yang sama, semua page WAJIB guna sidebar yang konsisten.
- Load menggunakan `sidebar-loader.js`.

## 11. Auth Guard

| Status Semasa | Penerangan                                  |
| ------------- | ------------------------------------------- |
| DISABLED      | Development mode - tiada redirect ke login  |
| AKTIF         | Akan diaktifkan selepas semua page siap      |

- Semasa development: Auth guard di-disable supaya mudah navigate antara page.
- Selepas semua page siap dan tested: Auth guard akan diaktifkan semula - redirect ke login page untuk user yang belum login.