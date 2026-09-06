---
trigger: always_on
---

# WeDRIVE Cybersecurity & Vulnerability Auditing Standards

## 1. Security Architecture & OWASP Best Practices

- **Zero Plaintext Secrets:** Tiada kunci API peribadi, token perkhidmatan Supabase, atau rahsia ditolak ke dalam Git.
- **Role-Based Access Control (RBAC):** Portal Admin, Pelanggan, dan Pelawat awam diasingkan secara ketat dengan pengesahan sesi.
- **Supabase Row Level Security (RLS):** Semua operasi pangkalan data tertakluk kepada dasar RLS berasaskan peranan pengguna.
- **Input Sanitization:** Menghalang sebarang percubaan *Cross-Site Scripting (XSS)* dan *SQL Injection* pada semua borang input dan carian.

---

## 2. Automated AI Security Testing (Strix & Security Linters)

- **Tujuan:** Menjalankan audit kerentanan beretika (*Ethical AI Penetration Testing & Vulnerability Assessment*) untuk persediaan Laporan FYP 2 (Bab Keselamatan & Pengujian).
- **Skop Pengimbasan Keselamatan:**
  1. Pengesahan Kredensial & Pengendalian Sesi Log Masuk (*Authentication & Session Management*).
  2. Integriti Perlindungan Data Peribadi Pelanggan (*Data Privacy & PII Protection*).
  3. Keselamatan Laluan API Chatbot & AI (*AI Endpoint Security & Guardrails*).
- **Protokol Remediasi:** Setiap kelemahan yang dikesan oleh audit keselamatan WAJIB diperbetulkan serta-merta sebelum pelepasan versi stabil (*production release*).
