---
trigger: always_on
---

# Apple Device Support & Universal Responsiveness Standards

Sistem WeDRIVE diwajibkan menyokong dan dioptimumkan sepenuhnya merentas semua spektrum peranti ekosistem Apple:

---

## 1. Spektrum Peranti Apple Disokong

| Kategori Peranti | Contoh Model | Ciri & Keperluan Responsif |
| :--- | :--- | :--- |
| **MacBook M2 & Ke Atas** | MacBook Air M2/M3, MacBook Pro 14"/16" (M2/M3/M4) | Menyokong resolusi *Liquid Retina*, paparan *Notch*, dan bar navigasi atas mengecil secara dinamik (*Apple Shrink Navbar*). |
| **MacBook M1 & Ke Bawah** | MacBook Air M1, MacBook Pro 13"/15"/16" Intel & M1 | Paparan standard Retina 16:10 & 16:9, ruang kerja penuh tanpa limpahan mendatar (*zero horizontal scroll*). |
| **iPad Ekosistem** | iPad Pro 11"/12.9", iPad Air, iPad Mini, iPad 10th Gen | Susun atur kad Bento 2-kolum responsif, zon sentuhan butang $\ge 48\text{px}$, navigasi sentuh mesra pengguna. |
| **iPhone 15 & Ke Atas** | iPhone 15, 15 Plus, 15 Pro, 15 Pro Max, 16 Series | *Dynamic Island Safe Area*, *Super Retina XDR*, *Floating Bottom Dock* ala Instagram/iOS dengan sudut bulat kapsul penuh (`9999px`). |
| **iPhone 14 & Ke Bawah** | iPhone 14, 13, 12, 11, SE, X | *Classic Notch* & *Home Indicator Safe Areas* (`env(safe-area-inset-*)`), saiz fon borang minimum `16px` bagi menghalang *auto-zoom* iOS Safari. |

---

## 2. Prinsip Reka Bentuk Apple (Pure Apple UX)

1. **Satu Fail CSS Master Global Sahaja:** Semua gaya, warna, dan komponen dikawal 100% daripada `shared/css/wedrive.css`.
2. **Tipografi Apple San Francisco:** `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif`.
3. **Kad Bento Squircle:** `border-radius: 24px` di seluruh kad sistem.
4. **Butang Taktil:** Saiz bucu `14px`, animasi sentuhan lembut `scale(0.97)`.
5. **Peralihan Fizik Apple:** Formula `cubic-bezier(0.16, 1, 0.3, 1)`.
6. **Kebolehbacaan & Kebolehcapaian:** Kontras tinggi pada Mod Siang (*Day*) dan Mod Malam (*Dark Obsidian*), tiada teks bertindih.
