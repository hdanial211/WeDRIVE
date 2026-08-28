---
trigger: always_on
---

# WeDRIVE Code, Architecture & Backend Standards

## 1. File & Folder Management

- Susun semua file supaya kemas, tidak berselerak, dan mudah diselenggara.
- File yang tidak digunakan WAJIB dipindahkan ke folder `bin/`.
- Setiap kali menambah atau membuang file/folder, kemas kini: `docs/PROJECT_STRUCTURE.md`.

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

## 3. Multilingual & Theme Support

Projek ini menyokong dwibahasa dan dwi-tema penuh:
- **Theme:** Night mode & Day mode (toggle)
- **Bahasa:** English & Melayu (dynamic language switching)
- Kedua-dua ciri ini WAJIB berfungsi di semua page melalui `shared/lang/` dan `shared/js/main.js`.

## 4. Dummy Data & Database Sync

- Data dummy / frontend data mesti disimpan secara tersusun dalam `shared/dummy/`.
- Data mesti boleh sync dengan backend apabila backend siap.
- Gunakan satu fail data utama (`shared/dummy/data.json`) sebagai single source of truth.

## 5. Auth Guard

- **Semasa development:** Auth guard di-disable supaya mudah navigate antara page.
- **Selepas semua page siap:** Auth guard diaktifkan untuk redirect ke login page bagi user yang belum login.
