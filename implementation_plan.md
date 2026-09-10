# Studio AI — Bingkai 360° ke Supabase Storage

## PRD 6 Pilar

### 1. Objektif dan skop
Menyimpan 36 bingkai turntable terpilih untuk kereta baharu melalui pelayar admin supaya aset kekal tersedia selepas diterbitkan ke Vercel. Skop meliputi bucket Storage, fungsi API, muat turun blob sebenar, progress sebenar, dan pautan viewer. Semua 200 bingkai tidak dimuat turun.

### 2. Pengguna dan aliran
Pentadbir menampal URL SpinCar, menekan `Jana AI`, kemudian `Simpan Visual`. Sistem mendapatkan metadata SpinCar, membina 36 URL, memuat turun setiap imej dari pelayar, memuat naiknya ke Storage, menyimpan URL awam pada rekod kereta, dan memaparkan kemajuan sebenar.

### 3. Keperluan fungsian
- Bucket `car-360-frames` adalah awam untuk bacaan.
- Laluan fail ialah `{car_id}/exterior/frame-{000..199}.jpg`.
- Fungsi `uploadCarFrame` menggunakan `upsert` dan memulangkan URL awam.
- Fungsi `saveCarExteriorFrames` menyimpan array URL JSONB dan menetapkan `has_360=true`.
- Progress dikira selepas setiap blob berjaya dimuat naik.
- URL Storage digunakan semula tanpa muat turun berganda jika proses disambung semula.

### 4. Piawaian bukan fungsian
Mengekalkan Bento Apple HIG, sasaran sentuhan minimum 44px, butang ikon bulat 1:1, mod siang/malam, dan tiada limpahan mendatar pada MacBook 1440px, iPad 820px serta iPhone 393px.

### 5. Data dan keselamatan
`cars.exterior_frames` menggunakan JSONB. Bacaan awam hanya melalui bucket awam; tulis, kemas kini dan padam Storage dihadkan kepada akaun dalam jadual `admins` dengan peranan `admin`. Tiada kunci perkhidmatan dihantar ke pelayar dan sumber imej hanya diproses oleh browser admin.

### 6. Penerimaan dan pengesahan
- SQL boleh dijalankan semula tanpa polisi pendua.
- 36 URL Storage disimpan dalam draf dan rekod kereta.
- Viewer `car-detail` menerima URL Storage sebagai `<img>`.
- Jalankan `cd tests && npx playwright test` dan semak tiga saiz peranti sebelum pelepasan.
