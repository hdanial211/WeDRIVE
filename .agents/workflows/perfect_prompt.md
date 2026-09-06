---
description: Alur kerja pantas menukar idea kasar atau arahan ringkas pengguna kepada spesifikasi teknikal gred Apple dan PRD sedia guna.
---

# Alur Kerja /perfect_prompt: Penalaan Idea Kasar ke Spesifikasi Penuh

Gunakan alur kerja ini apabila pengguna menaip `/perfect_prompt <idea ringkas>` untuk menghasilkan rangka kerja teknikal yang kemas tanpa memerlukan pengguna menaip karangan panjang.

---

## Langkah 1: Ekstrak 3 Elemen Asas
Daripada teks ringkas pengguna, kenal pasti:
1. **Halaman / Komponen Sasaran:** Di mana perubahan berlaku? (contoh: `@index.html`, `@calendar.html`, `@admin.html`).
2. **Matlamat Tindakan:** Apakah fungsi yang hendak dicapai?
3. **Aliran Interaksi Visual:** Apakah yang berlaku apabila elemen diklik?

---

## Langkah 2: Jana Format Spesifikasi Sedia Guna
Hasilkan ringkasan spesifikasi menggunakan templat padat berikut:

```markdown
### 🎯 Spesifikasi Sempurna (WeDRIVE Golden Prompt)
- **Komponen Sasaran:** [Nama Fail / Selector]
- **Fungsian & Reka Bentuk:** [Apple HIG Bento, Sifar Bujur, Bahan Kaca Thin Material]
- **Sumber Data:** [Jadual Supabase / Kolum Terlibat]
- **Pelan Pengesahan:** [Suite Ujian Playwright CLI 100% Lulus]
```

---

## Langkah 3: Sambungkan ke Alur Kerja PRD
Jika perubahan melibatkan ciri baharu atau modul baharu:
- Pindahkan spesifikasi ini terus ke dalam dokumen PRD 6 Pilar menerusi alur kerja `/prd_creator` di `implementation_plan.md`.
- Minta pengesahan pengguna sebelum memulakan pengekodan.
