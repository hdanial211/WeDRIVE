---
trigger: always_on
---

# Playwright Automated Testing Standard (WeDRIVE)

## 1. Official Test Credentials

- **Admin:** `admin@wedrive.my` | Kata Laluan: `admin123`
- **Customer:** `ahmad@wedrive.my` | Kata Laluan: `customer123`

### Peraturan Ujian Pelayar & Kredensial
- JANGAN ubah email atau kata laluan akaun ini.
- JANGAN cipta akaun baharu (*sign up*) semasa ujian untuk mengelakkan data bertindan.
- Pada halaman login, jika kredensial sudah auto-fill, terus klik butang Sign In.
- JANGAN buka banyak tab; kekalkan ujian pada tab sedia ada.

---

## 2. Directory Structure & Modular Isolation

Semua dependensi `@playwright/test`, konfigurasi, dan skrip ujian E2E WAJIB disimpan secara terasing di dalam folder `tests/`:

```text
tests/
├── e2e/
│   ├── 01_auth.spec.js           # Ujian E2E Log Masuk & Validasi Borang
│   ├── 02_theme_and_lang.spec.js  # Ujian Suis Tema (Dark/Light/Auto) & Dwibahasa (EN/MS)
│   ├── 03_about_corporate.spec.js# Ujian Penjenamaan Korporat, Jaminan & AI Sparkles
│   └── 04_pricing_glider.spec.js # Ujian Gelangsar Suis Apple (Daily vs Weekly)
├── package.json                  # Isolated npm scripts & dependencies
├── package-lock.json
├── playwright.config.js          # Browser & base URL config
└── node_modules/                 # Local test packages (git-ignored)
```

---

## 3. Mandatory Post-Task Test Execution Protocol

Setiap kali selesai menyiapkan tugasan pembangunan, penambahan ciri, pembaikan UI/UX, atau reka letak:
1. Jalankan suite ujian Playwright:
   ```bash
   cd tests && npx playwright test
   ```
2. Pastikan semua ujian lulus (**100% Pass Rate**).
3. Jika terdapat ujian yang gagal, kenal pasti punca (regresi atau perubahan elemen disengajakan) dan betulkan serta-merta sebelum commit.
