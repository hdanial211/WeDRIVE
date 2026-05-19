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
  `/Users/hakim/Library/Mobile Documents/com~apple~CloudDocs/SEM DEGREE/SEM 6/BITU3973 PROJECT I(FYP 1)/AI CAR RENTAL SYSTEM/docs/PROJECT_STRUCTURE.md`

## 7. CSS Architecture (1 Module = 1 CSS)

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

## 8. Multilingual & Theme Support

Projek ini menyokong:
- **Theme:** Night mode & Day mode (toggle)
- **Bahasa:** English & Melayu (dynamic language switching)

Kedua-dua feature ini WAJIB berfungsi di semua page.

## 9. Dummy Data

- Data dummy / frontend data mesti disimpan secara tersusun dalam `shared/dummy/`.
- Data mesti boleh sync dengan backend apabila backend sudah siap.
- Gunakan satu fail data utama (`shared/dummy/data.json`) sebagai single source of truth.

## 10. Sidebar & Navigation

### Navigation Pattern

| Modul    | Jenis Navigation | Loader                          |
| -------- | ---------------- | ------------------------------- |
| Admin    | Sidebar          | `shared/js/sidebar-loader.js`   |
| Customer | Sidebar          | `customer/js/sidebar-loader.js` |
| Guest    | Top Navbar       | `shared/js/navbar-loader.js`    |
| Account  | Tiada (standalone) | -                             |

- JANGAN campur sidebar dan navbar dalam satu modul.
- Guest pages guna **top navbar** sahaja.
- Customer dan Admin pages guna **sidebar** sahaja.

### Sidebar Components

| Modul    | Sidebar Component                              |
| -------- | ---------------------------------------------- |
| Admin    | `admin/components/sidebar/sidebar-admin.html`  |
| Customer | Dijana oleh `customer/js/sidebar-loader.js`    |

- Sidebar admin dan customer adalah BERBEZA antara satu sama lain.
- Dalam modul yang sama, semua page WAJIB guna sidebar yang konsisten.


## 11. Auth Guard

| Status Semasa | Penerangan                                  |
| ------------- | ------------------------------------------- |
| DISABLED      | Development mode - tiada redirect ke login  |
| AKTIF         | Akan diaktifkan selepas semua page siap      |

- Semasa development: Auth guard di-disable supaya mudah navigate antara page.
- Selepas semua page siap dan tested: Auth guard akan diaktifkan semula - redirect ke login page untuk user yang belum login.

## 12. Stitch Design Reference

- Rujukan reka bentuk Stitch disimpan di `docs/stitch-reference/`.
- Semua perubahan UI mesti konsisten dengan design reference yang ada.
- Stitch Project ID: `1862124494843018493`

## 13. Mobile Responsive

- SEMUA page WAJIB boleh dilihat dan berfungsi pada peranti telefon (mobile).
- Setiap page WAJIB ada meta viewport tag:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  ```
- Gunakan media queries untuk breakpoint utama:
  - `max-width: 1100px` - Tablet landscape
  - `max-width: 900px` - Tablet portrait
  - `max-width: 768px` - Mobile landscape / small tablet
  - `max-width: 600px` - Mobile portrait
- Sidebar WAJIB auto-collapse menjadi hamburger menu pada mobile.
- Grid dan layout WAJIB responsive (contoh: 4 columns > 2 columns > 1 column).
- Font size, padding, dan spacing WAJIB sesuai untuk skrin kecil.
- Touch target minimum 44x44px untuk butang dan link pada mobile.

## 14. UI/UX, Branding & Backend References

Untuk memastikan kualiti projek WeDRIVE sentiasa premium dan "padu", jadikan laman web berikut sebagai rujukan standard:

### UI/UX & Branding Standard (Premium & Modern)
- **Airbnb (airbnb.com):** Rujukan utama untuk *booking flow* yang lancar, carian tarikh (calendar), peta interaktif, dan *clean UI*.
- **Stripe (stripe.com):** Rujukan untuk *glassmorphism*, animasi *micro-interactions* yang sangat lancar, borang pembayaran (payment form) yang kemas, dan tipografi yang jelas.
- **Apple (apple.com):** Rujukan untuk *scrollytelling*, paparan produk 3D/premium, ruang putih (*whitespace*), dan tipografi berkelas tinggi.
- **Linear (linear.app):** Rujukan untuk *dark mode* yang sempurna, *glowing borders*, dan *keyboard-first navigation* untuk Admin Dashboard.
- **Vercel (vercel.com):** Rujukan untuk kelajuan antaramuka (speed), *minimalist dashboard*, dan komponen yang responsif.

### Backend & System Architecture Standard
- API mestilah pantas dan konsisten seperti standard RESTful (atau GraphQL) moden.
- Pengurusan *state* dan *loading skeletons* mesti meniru gaya UX platform di atas supaya *user* tidak rasa sistem perlahan.
- Seni bina sistem haruslah *modular* (boleh dikembangkan) dan menyokong *lazy loading* untuk prestasi optimum (seperti modul kalendar Flatpickr WeDRIVE).