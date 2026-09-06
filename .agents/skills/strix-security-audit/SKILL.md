---
name: strix-security-audit
description: Panduan audit keselamatan siber beretika dan simulasi ujian penembusan (penetration testing) WeDRIVE. Meliputi semakan kerentanan OWASP, perlindungan maklumat peribadi (PII), keselamatan kunci API, dan penjanaan bukti laporan tesis FYP 2.
---

# WeDRIVE Strix Cybersecurity & Ethical Penetration Testing Skill

## 1. Objektif & Peranan dalam Tesis FYP 2
Kemahiran ini direka khusus untuk membimbing ejen AI dalam menjalankan simulasi ujian penembusan etika (*Ethical AI Penetration Testing*) bagi menguji daya tahan kubu pertahanan sistem WeDRIVE. Hasil dapatan audit ini bertindak sebagai bukti empirikal berkualiti tinggi bagi **Bab 4 (Pengujian & Verifikasi)** dan **Bab 5 (Perbincangan & Keselamatan)** Laporan Projek Sarjana Muda II (FYP 2).

---

## 2. Empat Domain Audit Keselamatan Utama

### A. Pengesahan Kredensial & Pengendalian Sesi (Authentication & Sessions)
- **Ujian Cubaan Brute Force:** Menilai halangan cubaan log masuk berkali-kali pada borang log masuk pentadbir dan pelanggan.
- **Tamat Masa Ketidakaktifan (Inactivity Timeout Guardian):** Mengesahkan sesi pentadbir akan memaparkan amaran selepas 10 minit tidak aktif dan log keluar automatik selepas undur 1 minit tamat tanpa aktiviti.
- **Integriti Token JWT:** Memastikan sesi pengguna disimpan dengan selamat dalam storan sesi atau kuki HTTP-only tanpa pendedahan kepada manipulasi skrip bahagian klien.

### B. Perlindungan Data Peribadi Pelanggan (PII Protection & Data Privacy)
- **Nombor Kad Pengenalan & Pasport:** Memastikan data sensitif tidak dipaparkan secara terbuka kepada pengguna lain tanpa kebenaran.
- **Lesen Memandu Digital:** Menghalang akses langsung (*Insecure Direct Object References - IDOR*) terhadap pautan fail lesen memandu pelanggan yang belum disahkan.

### C. Kebersihan Input & Halangan Suntikan Kod (Injection Prevention)
- **Cross-Site Scripting (XSS):** Menguji semua medan input (carian kereta, borang tempahan, nama pengguna) dengan muatan payload ujian:
  ```html
  <script>alert('XSS_TEST')</script>
  ```
  Sistem WeDRIVE WAJIB membersihkan (*sanitize*) atau melepaskan (*escape*) semua input sebelum dipaparkan ke dalam DOM.
- **SQL Injection (SQLi):** Memastikan semua interaksi pangkalan data menggunakan *parameterized queries* atau lapisan Supabase PostgREST API yang menghalang percantuman teks SQL mentah.

### D. Keselamatan Laluan AI & Titik Akhir API (AI Guardrails & Secret Defense)
- **Sifar Rahsia Teks Biasa (Zero Plaintext Secrets):** Tiada token peribadi Supabase, kunci API Claude/Gemini, atau rahsia ditolak ke dalam cawangan Git awam.
- **Perlindungan Prompt Sistem AI:** Menghalang percubaan *jailbreak* atau manipulasi arahan sistem dalaman (*system prompt leak*) pada pembantu maya AI Sparkles atau chatbot WeDRIVE.

---

## 3. Format Penulisan Laporan Bukti Tesis FYP 2

Setiap kali audit keselamatan dijalankan, catatkan bukti dalam format standard berikut:

```markdown
### 🛡️ Laporan Audit Keselamatan Siber WeDRIVE (Simulasi Strix AI)
- **Tarikh Audit:** YYYY-MM-DD
- **Skop Pengujian:** Halaman Login, Borang Tempahan & Kunci API
- **Kaedah:** Simulasi Serangan XSS, SQLi & Ujian Tamat Masa Sesi

| Vektor Serangan | Tahap Risiko | Status Ujian | Tindakan Remediasi |
| :--- | :--- | :--- | :--- |
| XSS Input Reflection | Sederhana | Ditangkis | Input dibersihkan menerusi textContent |
| Session Hijacking | Tinggi | Dilindungi | Tamat masa automatik 10 minit aktif |
| Plaintext Secret Leak | Kritikal | Bersih | Sifar token sulit dalam kod hadapan |
```

---

## 4. Polisi Sifar Toleransi Terhadap Kerentanan Kritikal
Jika pengauditan mengesan sebarang kerentanan bertaraf **High** atau **Critical**:
1. AI WAJIB menangguhkan pelancaran versi serta-merta.
2. Sediakan tampalan keselamatan (*security patch*) secara serta-merta.
3. Jalankan ujian verifikasi semula sehingga 0 isu kritikal dikesan.
