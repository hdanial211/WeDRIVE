---
trigger: always_on
---

# WeDRIVE Navigation, Responsive & UI/UX Standards

## 1. Sidebar & Navigation Architecture

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

---

## 2. Mobile Responsive Guidelines

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

---

## 3. UI/UX & Branding Standard References

Untuk memastikan kualiti projek WeDRIVE sentiasa premium, jadikan rujukan standard berikut:

- **Airbnb (airbnb.com):** Rujukan utama untuk *booking flow* yang lancar, carian tarikh (calendar), peta interaktif, dan *clean UI*.
- **Stripe (stripe.com):** Rujukan untuk *glassmorphism*, animasi *micro-interactions* yang sangat lancar, borang pembayaran (payment form) yang kemas, dan tipografi yang jelas.
- **Apple (apple.com):** Rujukan untuk *scrollytelling*, paparan produk 3D/premium, ruang putih (*whitespace*), dan tipografi berkelas tinggi.
- **Linear (linear.app):** Rujukan untuk *dark mode* yang sempurna, *glowing borders*, dan *keyboard-first navigation* untuk Admin Dashboard.
- **Vercel (vercel.com):** Rujukan untuk kelajuan antaramuka (speed), *minimalist dashboard*, dan komponen yang responsif.
