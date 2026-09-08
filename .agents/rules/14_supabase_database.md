---
trigger: always_on
---

# WeDRIVE Supabase Database & Backend Architecture Standards

## 1. Peranan Supabase dalam Ekosistem WeDRIVE

- **Penggantian Beban Backend Manual:**
  - Supabase bertindak sebagai pangkalan data PostgreSQL berprestasi tinggi untuk mengurus skema jadual, pengesahan pengguna (*Auth*), penyimpanan fail dokumen (*Storage*), dan keselamatan data secara langsung.
  - Pembangun dan AI memanfaatkan alatan **Supabase MCP** (`execute_sql`, `list_tables`, `list_migrations`, `apply_migration`) bagi membina dan menyenggara struktur data tanpa perlu membina pelayan backend manual yang membebankan.

---

## 2. Struktur Skema & Model Data Teras

Pangkalan data WeDRIVE distrukturkan berasaskan model mobiliti sewaan kereta sebenar:

1. **Jadual `cars` (Inventori Kereta):**
   - Kunci primer: `id (UUID)`
   - Kolum utama: `name`, `brand`, `category`, `transmission`, `fuel_type`, `seats`, `price_per_day`, `status ('available' | 'rented' | 'maintenance')`, `image_url`, `created_at`.
2. **Jadual `bookings` (Transaksi Tempahan):**
   - Kunci primer: `id (UUID)`
   - Kolum utama: `user_id`, `car_id`, `start_date`, `end_date`, `pickup_location`, `return_location`, `total_price`, `deposit_amount`, `payment_status`, `booking_status ('pending' | 'confirmed' | 'completed' | 'cancelled')`, `qr_pass_code`.
3. **Jadual `customers` / `profiles` (Profil Pengguna):**
   - Kunci primer: `id (UUID / auth.uid())`
   - Kolum utama: `full_name`, `email`, `phone_number`, `ic_passport_number`, `driving_license_status ('verified' | 'pending' | 'rejected')`, `driving_license_url`.
4. **Jadual `payments` / `escrow` (Transaksi Kewangan):**
   - Kunci primer: `id (UUID)`
   - Kolum utama: `booking_id`, `amount`, `payment_method`, `transaction_ref`, `status ('paid' | 'refunded' | 'held_in_escrow')`.

---

## 3. Dasar Keselamatan Baris (*Row Level Security - RLS*)

Kesemua jadual dalam Supabase **WAJIB mengaktifkan Row Level Security (RLS)**:
```sql
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

### Dasar Capaian Mengikut Peranan:
- **Pelanggan Awam / Tetamu:** Hanya dibenarkan `SELECT` jadual `cars` bagi kereta yang berstatus `'available'`.
- **Pengguna Disahkan (Authenticated Customer):**
  - Hanya boleh membaca dan mengubah rekod profil mereka sendiri: `auth.uid() = user_id`.
  - Hanya boleh melihat dan membuat tempahan untuk akaun mereka sendiri.
- **Pentadbir (Admin):**
  - Diberikan akses penuh `SELECT`, `INSERT`, `UPDATE`, `DELETE` merentas semua jadual melalui peranan pentadbir berpusat atau fungsi pangkalan data berkawal (*stored procedures*).

---

## 4. Peraturan Sifar Data Palsu & Sifar Hardcode Dummy (Zero Fake Data & Zero Hardcoded Dummy Rule)

- **Skema Supabase Sebagai Single Source of Truth:**
  - Sebarang data yang dipaparkan dalam antara muka WeDRIVE (sama ada senarai kereta, tempahan, profil pelanggan, atau analitik) mesti bersumberkan pangkalan data Supabase PostgreSQL atau objek API yang diselaraskan (`window.WeDriveAPI`).
  - DILARANG SAMA SEKALI mereka-reka data palsu statik (*hardcoded fiction*) di dalam komponen antaramuka pengguna mahupun pentadbir.
  - DILARANG mencipta medan rekaan yang tiada dalam skema pangkalan data sebenar (seperti medan *odometer* atau *perbatuan* yang tidak relevan dengan perniagaan perbatuan tanpa had WeDRIVE).
  - Aliran wizard pendaftaran WAJIB mengalirkan data input pengguna sebenar secara dinamik ke pangkalan data Supabase tanpa rekaan data statik perantaraan.

---

## 5. Had Fail & Modulariti
- Fail ini dikawal selia di bawah had siling **12,000 aksara** seperti yang digariskan dalam [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
