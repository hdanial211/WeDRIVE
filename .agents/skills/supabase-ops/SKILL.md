---
name: supabase-ops
description: Panduan operasi pangkalan data PostgreSQL Supabase WeDRIVE. Meliputi pelaksanaan query Supabase MCP, struktur skema mobiliti kereta, audit dasar Row Level Security (RLS), dan integriti data tanpa data palsu.
---

# WeDRIVE Supabase Database Operations Skill

## 1. Pengenalan & Penggunaan Supabase MCP
Pangkalan data WeDRIVE dikuasakan sepenuhnya oleh **Supabase (PostgreSQL)** berprestasi tinggi. Kemahiran ini membolehkan ejen AI berinteraksi dengan struktur pangkalan data secara terus menerusi **Supabase MCP** (`execute_sql`, `list_tables`, `list_migrations`) tanpa memerlukan binaan pelayan manual yang membebankan.

---

## 2. Struktur Skema Mobiliti Kereta Teras

Pangkalan data WeDRIVE mempunyai 4 jadual teras yang disegerakkan dengan klien hadapan (`window.WeDriveAPI`):

### A. Jadual `cars` (Inventori Kereta)
```sql
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL, -- Sedan, SUV, Hatchback, MPV
  transmission VARCHAR(20) DEFAULT 'Automatic',
  fuel_type VARCHAR(20) DEFAULT 'Petrol',
  seats INTEGER DEFAULT 5,
  price_per_day NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'available', -- available, rented, maintenance
  image_url TEXT,
  view_360_enabled BOOLEAN DEFAULT false,
  location_hub VARCHAR(100) DEFAULT 'HQ Melaka (Hab Tunggal)',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### B. Jadual `bookings` (Transaksi Tempahan)
```sql
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_ref VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  car_id UUID REFERENCES cars(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  pickup_hub VARCHAR(100) DEFAULT 'HQ Melaka',
  return_hub VARCHAR(100) DEFAULT 'HQ Melaka',
  total_price NUMERIC(10, 2) NOT NULL,
  deposit_amount NUMERIC(10, 2) DEFAULT 200.00,
  payment_status VARCHAR(20) DEFAULT 'paid', -- pending, paid, refunded
  booking_status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, active, completed, cancelled
  qr_pass_code VARCHAR(64) UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### C. Jadual `profiles` / `customers` (Profil Pengguna)
```sql
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone_number VARCHAR(30),
  ic_passport_number VARCHAR(50),
  driving_license_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
  driving_license_url TEXT,
  role VARCHAR(20) DEFAULT 'customer', -- customer, admin
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### D. Jadual `payments` (Lejar Transaksi Kewangan)
```sql
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  amount NUMERIC(10, 2) NOT NULL,
  payment_method VARCHAR(50) DEFAULT 'Online Banking / FPX',
  transaction_ref VARCHAR(100) UNIQUE,
  status VARCHAR(30) DEFAULT 'paid', -- paid, held_in_escrow, refunded
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 3. Penguatkuasaan Dasar Keselamatan Baris (Row Level Security - RLS)

Semua jadual dalam Supabase **WAJIB** mengaktifkan RLS:
```sql
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
```

### Dasar Capaian Mengikut Peranan:
1. **Tetamu Awam & Pengguna Log Masuk (Cars):**
   - Boleh melihat (`SELECT`) rekod kereta aktif.
2. **Pelanggan Disahkan (Authenticated Customer):**
   - Hanya boleh melihat dan mengemaskini profil sendiri (`auth.uid() = id`).
   - Hanya boleh melihat rekod tempahan mereka sendiri (`auth.uid() = user_id`).
3. **Pentadbir (Admin):**
   - Akses penuh (`ALL`) melalui pengesahan peranan pentadbir dalam token sesi JWT atau fungsi pangkalan data berkawal.

---

## 4. Peraturan Sifar Data Palsu (Zero Fake Data Rule)
- Sebarang data yang dipaparkan dalam antara muka sistem WeDRIVE (sama ada statistik papan pemuka, status kereta, atau butiran invois) mesti bersumberkan rekod Supabase atau klien data rasmi `shared/dummy/data.json` / `window.WeDriveAPI`.
- Dilarang memasukkan angka rekaan atau rentetan teks tiruan secara statik (*hardcoded*) di dalam templat HTML.
