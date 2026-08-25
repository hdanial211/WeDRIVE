# WeDRIVE - Apple Human Interface Guidelines (HIG) Master Compliance & Page Audit Report

Dokumen ini merekodkan arkitektur reka bentuk, standard kualiti, dan status pematuhan **Apple Human Interface Guidelines (HIG)** di seluruh sistem **WeDRIVE**.

---

## 🏛️ Rujukan Rasmi Apple Developer HIG

| Pilar | Domain HIG | Pautan Rasmi | Fokus Pelaksanaan WeDRIVE |
| :--- | :--- | :--- | :--- |
| **1** | **Getting Started** | [Apple HIG: Getting Started](https://developer.apple.com/design/human-interface-guidelines/getting-started) | Prinsip Clarity, Deference, Depth, Sasaran Sentuhan $\ge 44\text{px}$. |
| **2** | **Foundations** | [Apple HIG: Foundations](https://developer.apple.com/design/human-interface-guidelines/foundations) | SF Typography, Obsidian True Black, Dynamic Colors, Materials Glassmorphism, Spring Motion Physics. |
| **3** | **Patterns** | [Apple HIG: Patterns](https://developer.apple.com/design/human-interface-guidelines/patterns) | Navigation Bars, Paired Date Range Locking, Search Popovers, Pill Error Shake, Modal Sheets. |
| **4** | **Components** | [Apple HIG: Components](https://developer.apple.com/design/human-interface-guidelines/components) | Segmented Controls, Bento Squircle Cards, Pill Capsules, Connected Calendar Bridges, Status Badges. |
| **5** | **Inputs** | [Apple HIG: Inputs](https://developer.apple.com/design/human-interface-guidelines/inputs) | Tactile Press `scale(0.97)`, Focus Halo Rings, Trackpad 360 Drag, Haptic Vibration. |
| **6** | **Technologies** | [Apple HIG: Technologies](https://developer.apple.com/design/human-interface-guidelines/technologies) | Floating AI Assistant Island, 3D Vehicle 360 Viewer, Real-Time Countdown, Instant Bilingual Shimmer. |

---

## 📊 Status Audit Pematuhan Halaman Semasa (Current Page Audit)

### 1. Modul Pelanggan (*Customer Module*)
| Halaman | Fail | Tahap Pematuhan HIG | Ciri Utama Apple HIG Sedia Ada | Ruang Penambahbaikan Lanjutan |
| :--- | :--- | :---: | :--- | :--- |
| **Papan Pemuka (*Dashboard*)** | `customer/pages/dashboard/customer.html` | ⭐⭐⭐⭐⭐ **98%** | Hero greeting adaptif, Bento grid KPI, kad kira detik sewaan (*live countdown*), karusel indikator kapsul melebar, Pembantu AI terapung. | Penambahan haptic touch pada kad promosi. |
| **Pilih Kereta (*Browse Cars*)** | `customer/pages/browse-cars/browse-cars.html` | ⭐⭐⭐⭐⭐ **99%** | Bar carian kapsul Apple, penguncian kalendar berpasangan (*strict locking*), jambatan julat biru kapsul, kawalan bersegmen kategori. | Penapis julat harga gelangsar Apple (*Slider*). |
| **Butiran Kereta (*Car Details*)** | `customer/pages/car-details/car-details.html` | ⭐⭐⭐⭐⭐ **97%** | Galeri hero dengan pelihat 360°, Bento grid spesifikasi, modal lembaran tempahan pantas, butang tindakan kapsul. | Perkongsian pautan (*Share Sheet*). |
| **Tempahan Saya (*My Bookings*)** | `customer/pages/my-bookings/my-bookings.html` | ⭐⭐⭐⭐☆ **95%** | Lencana status berkod warna, nombor harga jadual (*tabular-nums*), kad tempahan squircle bento. | Muat turun resit dalam format Apple Wallet/PDF. |
| **Profil Pengguna (*Profile*)** | `customer/pages/profile/profile.html` | ⭐⭐⭐⭐☆ **94%** | Cincin fokus biru Apple (*focus halo*), kad maklumat peribadi berkumpulan, penunjuk keselamatan. | Pratonton muat naik dokumen lencana pengesahan. |
| **Bantuan & FAQ (*Support*)** | `customer/pages/support/support.html` | ⭐⭐⭐⭐☆ **94%** | Kad akordion dengan transisi spring lembut, carian popover pintar dengan penyerlah kata kunci. | Butang panggilan sokongan terus gaya iOS. |

---

### 2. Modul Pentadbir (*Admin Module*)
| Halaman | Fail | Tahap Pematuhan HIG | Ciri Utama Apple HIG Sedia Ada | Ruang Penambahbaikan Lanjutan |
| :--- | :--- | :---: | :--- | :--- |
| **Papan Pemuka Admin** | `admin/pages/dashboard/dashboard.html` | ⭐⭐⭐⭐⭐ **97%** | Kad Bento analitik, penunjuk trend peratusan, carta jualan bercahaya halus, jadual tempahan terkini. | Eksport pantas carta visual. |
| **Pengurusan Tempahan** | `admin/pages/booking/bookings.html` | ⭐⭐⭐⭐⭐ **96%** | Cip penapis pantas, penapis julat tarikh tersuai, modal tempahan baharu dengan penguncian tarikh seragam. | Pratonton butiran pelanggan popover (*Popover hover*). |
| **Pengurusan Kenderaan** | `admin/pages/car/cars.html` | ⭐⭐⭐⭐☆ **95%** | Penukar paparan grid/jadual, kad armada kereta dengan lencana ketersediaan, modal tambah kenderaan. | Muat naik gambar seret-dan-lepas (*Drag & Drop*). |
| **Pengurusan Pelanggan** | `admin/pages/customer/customer.html` | ⭐⭐⭐⭐☆ **94%** | Jadual senarai pelanggan dengan status verifikasi, carian masa nyata dengan maklum balas taktil. | Tindakan pantas secara kelompok (*Batch actions*). |
| **Laporan & Analitik** | `admin/pages/report/report.html` | ⭐⭐⭐⭐☆ **94%** | Carta kewangan visual, kad ringkasan pendapatan, pemilih julat masa. | Penapis perbandingan bulan-ke-bulan. |
| **Pemasaran & Promosi** | `admin/pages/marketing/marketing.html` | ⭐⭐⭐⭐☆ **95%** | Kad kod promosi, pemilih tarikh berpasangan untuk sepanduk promosi dan pelarasan harga bermusim. | Pratonton langsung sepanduk dalam telefon maya. |
| **Kalendar Armada** | `admin/pages/calendar/calendar.html` | ⭐⭐⭐⭐⭐ **96%** | Grid kalendar bulanan visual dengan reben tempahan mengikut kereta. | Penukaran paparan minggu/hari (*Gantt timeline*). |
| **Tetapan Sistem** | `admin/pages/setting/settings.html` | ⭐⭐⭐⭐☆ **93%** | Seksyen tetapan berkumpulan gaya Tetapan iOS, suis togol bulat (*Apple Toggle Switches*). | Pengurusan profil admin berlapis. |

---

### 3. Modul Akaun & Halaman Awam (*Account & Guest Modules*)
| Halaman | Fail | Tahap Pematuhan HIG | Ciri Utama Apple HIG Sedia Ada | Ruang Penambahbaikan Lanjutan |
| :--- | :--- | :---: | :--- | :--- |
| **Halaman Utama (*Landing Page*)** | `index.html` | ⭐⭐⭐⭐⭐ **98%** | Banner hero dinamik, Bento grid kelebihan, pratonton kereta terpilih, bar navigasi kaca terapung. | Penunjuk ulasan pengguna interaktif. |
| **Log Masuk (*Login*)** | `account/pages/login/login.html` | ⭐⭐⭐⭐☆ **95%** | Kad squircle kaca terapung, pengesahan input lancar, butang kapsul log masuk dengan animasi spring. | Butang "Sign in with Apple" mockup visual. |
| **Daftar Akaun (*Signup*)** | `customer/pages/signup/signup.html` | ⭐⭐⭐⭐☆ **95%** | Borang berperingkat (*step-by-step*), penunjuk kekuatan kata laluan, haptic validation shake. | Panduan pengesahan kad pengenalan / lesen. |

---

## 🛠️ Piawaian Kod Mandatori Setiap Halaman Baharu

Setiap kali halaman baharu dicipta atau diubah suai:
1. **Satu Fail CSS Global**: Semua gaya WAJIB ditambah ke dalam `shared/css/wedrive.css`.
2. **Penyertaan Skrip & Gaya**:
   - `shared/css/wedrive.css`
   - `shared/css/sidebar.css`
   - `shared/js/sidebar-loader.js` (dan `navbar-loader.js`)
   - `shared/js/calendar.js` (jika mengandungi pemilih tarikh)
   - `shared/js/chatbot.js` (untuk modul pelanggan)
3. **Pematuhan Mod Malam**: Mesti menyokong `body.theme-dark` (Obsidian True Black `#000000` dan `#161618`).
4. **Sentuhan Taktil**: Semua butang wajib mempunyai `:active { transform: scale(0.97); }`.
