# WeDRIVE Prompt Engineering Standards & Proactive Reminder Protocol

## 1. Objektif & Falsafah Komunikasi Pintar

Bagi mengelakkan pembaziran masa perbualan berulang-ulang dan memastikan setiap arahan difahami secara tepat, sistem WeDRIVE menetapkan piawaian kejuruteraan prompt yang ringkas, berstruktur, dan mudah diingati oleh pengguna.

---

## 2. Formula Prompt Emas 3 Baris (The Golden 3-Line Formula)

Setiap arahan pengguna idealnya mengandungi 3 komponen asas berikut:

```text
Baris 1: [Sasaran Halaman / Komponen] 
         Contoh: "@calendar.html" atau "Papan Pemuka Pentadbir @admin.html"
Baris 2: [Tindakan / Matlamat Fungsian]
         Contoh: "Tambah penapis mengikut status lejar dan kiraan bento"
Baris 3: [Aliran Interaksi Visual]
         Contoh: "Klik baris lejar buka popup modal Apple HIG dengan maklum balas scale(0.97)"
```

---

## 3. Mandatori Peringatan Proaktif Oleh Ejen AI (Proactive Reminder Duty)

- **Mandat Peringatan:** Pengguna telah menetapkan arahan rasmi bahawa AI **WAJIB mengingatkan pengguna tentang Formula 3 Baris ini** sekiranya prompt yang diterima tidak menyatakan lokasi sasaran atau terlalu ringkas.
- **Tindakan AI Apabila Menerima Prompt Kasar:**
  1. AI dilarang menolak arahan pengguna.
  2. AI mengaktifkan kemahiran `prompt-polisher` untuk melengkapkan 3 elemen tersebut secara automatik.
  3. AI membentangkan spesifikasi yang telah disempurnakan berserta peringatan santai mengenai Formula 3 Baris kepada pengguna.

---

## 4. Protokol Temu Bual Interaktif (/grill-me)
- Apabila pengguna menggunakan perintah `/grill-me`, AI WAJIB melancarkan sesi temu duga berstruktur menggunakan alatan `ask_question`.
- Format soalan berbentuk aneka pilihan (multiple choice) memudahkan pengguna membuat keputusan tanpa perlu menaip huraian panjang.

---

## 5. Alur Kerja Penalaan (/perfect_prompt)
- Pengguna boleh menaip `/perfect_prompt <ayat ringkas>` untuk memicu alur kerja `perfect_prompt.md`.
- AI akan menjana spesifikasi lengkap yang merangkumi reka bentuk Apple HIG, pemetaan Supabase, dan rancangan ujian Playwright.

---

## 6. Had Kandungan & Sifat Modular
- Fail ini tertakluk kepada had siling **maksimum 12,000 aksara** seperti yang termaktub dalam [12_max_content_limit.md](file:///Users/hakim/Library/Mobile%20Documents/com~apple~CloudDocs/SEM%20DEGREE/SEM%20KHAS%206/BITU3983%20PROJECT%20II(FYP%202)/AI%20CAR%20RENTAL%20SYSTEM/.agents/rules/12_max_content_limit.md).
