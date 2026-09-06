---
name: context7
description: Retrieve live, version-specific library documentation, modern API patterns, and code examples via Context7 MCP to eliminate hallucinations and outdated code.
---

# Context7 Live Documentation & API Skill (WeDRIVE)

Kemahiran ini membekalkan ejen AI dengan panduan lengkap untuk mengekstrak dokumentasi langsung, versi terkini, dan contoh kod rasmi bagi semua pustaka luaran dalam ekosistem WeDRIVE menggunakan pelayan **Context7 MCP**.

---

## 1. Prinsip Operasi Context7 MCP

Elakkan tekaan sintaks atau rujukan kepada data latihan lapuk (*outdated training data*). Sentiasa gunakan Context7 untuk memastikan kod yang ditulis adalah 100% mematuhi spesifikasi terkini pustaka.

### Alur Kerja 2-Langkah Mandatori:
```text
1. resolve-library-id(libraryName, query)  ---> Dapatkan Context7-compatible Library ID (cth: /supabase/supabase)
2. query-docs(libraryId, query)           ---> Dapatkan dokumentasi rasmi & contoh kod sebenar
```

---

## 2. Pemetaan Pustaka Utama WeDRIVE dalam Context7

| Pustaka / Modul | Library Name | Context7 Library ID | Skop Pertanyaan Tipikal |
| :--- | :--- | :--- | :--- |
| **Supabase JS Client** | `Supabase` | `/supabase/supabase` | Query table rows, RLS policy auth, insert/update/delete, Edge Function invokes |
| **Flatpickr Datepicker** | `Flatpickr` | `/chmln/flatpickr` | `rangePlugin`, `minDate`, locale `ms`/`en`, paired date locking, event hooks |
| **Playwright Test** | `Playwright` | `/microsoft/playwright` | Locator assertion, web-first assertions, auto-waiting, browser context |
| **Anime.js** | `Anime.js` | `/juliangarnier/anime` | Timeline sequence, spring physics, SVG path morphing, stagger animations |
| **Three.js** | `Three.js` | `/mrdoob/three.js` | Cubemap panorama, SphereGeometry, WebGLRenderer, texture loader 360 |

---

## 3. Garis Panduan Pertanyaan (Query Crafting)

1. **Satu Konsep Spesifik Bagi Setiap Panggilan**:
   - ✅ **Tepat (Good)**: `supabase js query table with select and filter`
   - ✅ **Tepat (Good)**: `flatpickr minDate paired date range plugin`
   - ❌ **Terlalu Umum (Bad)**: `database` atau `datepicker`
   - ❌ **Terlalu Padat (Bad)**: `auth and database and storage and rls policies all at once`
2. **Had Panggilan**:
   - Maksimum 3 panggilan `resolve-library-id` dan `query-docs` bagi setiap persoalan teknikal untuk menjimatkan masa dan token.
3. **Sifar Maklumat Sensitif**:
   - Dilarang memasukkan token perkhidmatan rahsia, kata laluan pangkalan data, atau maklumat peribadi dalam pertanyaan carian.

---

## 4. Alur Kerja Praktikal: Contoh Integrasi

### Contoh 1: Menyemak Sintaks Supabase Database Query & RLS
```javascript
// Langkah 1: resolve-library-id
// libraryName: "Supabase", query: "JavaScript client database query with RLS"
// Output: "/supabase/supabase"

// Langkah 2: query-docs
// libraryId: "/supabase/supabase", query: "select rows with eq and order filters"
// Output: Sintaks rasmi:
const { data, error } = await supabase
  .from('cars')
  .select('id, name, brand, daily_rate, status')
  .eq('status', 'available')
  .order('daily_rate', { ascending: true });
```

### Contoh 2: Menyemak Flatpickr Paired Range Lock
```javascript
// Langkah 1: resolve-library-id -> libraryName: "Flatpickr", query: "rangePlugin minDate"
// Langkah 2: query-docs -> libraryId: "/chmln/flatpickr", query: "paired date range lock minDate today"
// Output: Sintaks rasmi penguncian tarikh pulang berdasarkan tarikh ambil
flatpickr("#pickup_date", {
  minDate: "today",
  dateFormat: "Y-m-d",
  onChange: function(selectedDates, dateStr) {
    returnDatePicker.set('minDate', dateStr);
    returnDatePicker.open();
  }
});
```

---

## 5. Protokol Penghapusan Sintaks Lapuk (Zero Deprecated Syntax)

- Gantikan sebarang corak `callback` atau `promisify` lapuk dengan `async/await` moden.
- Semak versi pustaka yang digunakan dalam `package.json` sebelum menggunakan ciri baharu.
- Sekiranya pustaka memaparkan amaran *deprecation* pada konsol pelayar (`chrome-devtools`), segera rujuk Context7 untuk mendapatkan pengganti rasmi yang disyorkan pengeluar.
