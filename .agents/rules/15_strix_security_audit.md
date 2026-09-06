---
trigger: always_on
---

# WeDRIVE Strix AI Cybersecurity & Penetration Testing Standards

## 1. Objektif Keselamatan & Bab Pengujian FYP 2

- **Simulasi Ujian Penembusan Etika (*Ethical AI Penetration Testing*):**
  - Alatan Strix bertindak menyerang dan menguji sistem WeDRIVE persis penggodam sebenar untuk mengesan sebarang kelemahan keselamatan (*security vulnerabilities*), pintu belakang (*backdoors*), atau celah kebocoran maklumat.
  - Setiap hasil pengimbasan keselamatan digunakan sebagai bukti empirikal dalam **Bab 4 & 5 Laporan Tesis FYP 2 (Bahagian Pengujian Keselamatan & Remediasi Kerentanan)**.

---

## 2. Empat Skop Ujian Keselamatan Mandatori

### 1. Pengesahan Kredensial & Pengurusan Sesi (*Authentication & Session Hijacking*)
- Memastikan token JWT atau kunci sesi tidak boleh dipalsukan (*tampering*).
- Menghalang serangan *Brute Force* pada halaman log masuk admin dan pelanggan.
- Memastikan sesi tamat tempoh (*session timeout*) berfungsi dengan selamat apabila pengguna log keluar.

### 2. Perlindungan Data Peribadi Pelanggan (*PII Protection & Data Privacy*)
- Memastikan maklumat sensitif (nombor kad pengenalan/pasport, lesen memandu, nombor telefon) disulitkan (*encrypted*).
- Menghalang pendedahan dokumen lesen memandu kepada pengguna lain yang tidak berhak melalui URL terbuka (*Insecure Direct Object References - IDOR*).

### 3. Keselamatan Titik Akhir & Perlindungan Input (*Input Sanitization & Injection Prevention*)
- Menghalang sebarang percubaan *Cross-Site Scripting (XSS)* pada medan carian, borang semakan tempahan, dan borang maklum balas.
- Menghalang percubaan *SQL Injection* pada sebarang pertanyaan pangkalan data dinamik.

### 4. Keselamatan Laluan API Chatbot & AI (*AI Guardrails & Endpoint Defense*)
- Memastikan titik akhir perbualan AI tidak mendedahkan arahan sistem dalaman (*system prompt leak / jailbreak*).
- Mengelakkan kebocoran kunci API rahsia (*Zero Plaintext Secrets*) dalam skrip bahagian hadapan.

---

## 3. Protokol Remediasi Serta-Merta (*Zero Tolerance Policy*)

- Sekiranya audit keselamatan Strix mengesan sebarang kerentanan bertaraf **High** atau **Critical**:
  1. AI WAJIB menghentikan pengeluaran kod baharu serta-merta.
  2. Kenal pasti baris kod atau konfigurasi yang terdedah.
  3. Lakukan tampalan keselamatan (*security patch*) dan uji semula sehingga 0 celah dikesan.
- Tiada kod dibenarkan ditolak ke cawangan `main` sekiranya terdapat isu keselamatan yang belum diselesaikan.

---

## 4. Had Kandungan & Kepatuhan Had 12,000 Aksara
- Fail ini mematuhi ketetapan siling maksimum **12,000 aksara** seperti yang diisytiharkan dalam [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
