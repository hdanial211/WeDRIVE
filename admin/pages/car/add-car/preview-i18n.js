/**
 * WeDRIVE STITCH UI PREVIEW/7 - Client-Side Bilingual Engine (MS ↔ EN)
 * Standard: Contemporary Malaysian Modern Malay (2026) & Professional English
 * Conforms to Apple HIG, Rule 06 (Multilingual), Rule 11 (Language Standards), and Rule 22 (User Verbal Rules).
 */

const PREVIEW_I18N = {
    ms: {
        // Navigation & Topbar
        nav_home: "Laman Utama",
        nav_cars: "Carian Kereta",
        nav_bookings: "Tempahan",
        nav_customers: "Pelanggan",
        nav_reports: "Laporan",
        nav_ai: "Kecerdasan AI",
        nav_cancel: "Batal",
        theme_toggle_title: "Tukar Tema Siang / Malam",
        lang_toggle_title: "Tukar Bahasa (MS / EN)",
        lang_code: "MS",

        // Stepper Capsule
        step1_pill: "Maklumat Asas",
        step2_pill: "Studio Visual",
        step3_pill: "Semakan Akhir",
        step4_pill: "Pandangan Pelanggan",
        step5_pill: "Butiran & Tempahan",
        step3_btn_view_as_customer: "Lihat Sebagai Pelanggan →",

        // Step 4: Pandangan Pelanggan (Customer View)
        step4_title: "Pandangan Pelanggan",
        step4_preview_badge: "Mod Pratonton Pelanggan",
        step4_preview_notice: "Paparan Katalog Pelanggan (WYSIWYG)",
        step4_preview_desc: "Paparan langsung bagaimana kad kenderaan ini dipamerkan di portal carian kenderaan pelanggan WeDRIVE.",
        step4_sidebar_tag: "Pratonton Sahaja",
        step4_sidebar_dashboard: "Papan Pemuka",
        step4_sidebar_cars: "Teroka Kereta",
        step4_sidebar_bookings: "Tempahan Saya",
        step4_sidebar_wallet: "Dompet & Pas",
        step4_card_available: "Tersedia",
        step4_card_rented: "Disewa",
        step4_card_year_prefix: "Tahun",
        step4_card_360: "360° View",
        step4_card_seats_suffix: "Tempat Duduk",
        step4_card_color_label: "Warna:",
        step4_card_type_label: "Kategori",
        step4_card_per_day: "/hari",
        step4_card_book_now: "Tempah Sekarang",
        step4_btn_back_step3: "Semakan Akhir",
        step4_btn_finish: "Daftar Kenderaan Ini",

        // Step 5: Butiran & Tempahan Pelanggan (Customer Detail & Booking)
        step5_title: "Butiran Kenderaan & Tempahan",
        step5_preview_badge: "Mod Tempahan Pelanggan",
        step5_preview_notice: "Paparan Butiran Kenderaan & Tempahan Pelanggan",
        step5_preview_desc: "Paparan langsung bagaimana pelanggan meneroka 360°, galeri foto, dan memilih tarikh tempahan kenderaan ini.",
        step5_sec_booking_title: "Pilih Tarikh Tempahan",
        step5_pickup_date_label: "Tarikh Ambil",
        step5_return_date_label: "Tarikh Pulang",
        step5_select_date_ph: "Pilih tarikh",
        step5_duration_unit: "hari",
        step5_btn_continue_booking: "Teruskan ke Tempahan",
        step5_btn_back_step4: "Pandangan Pelanggan",
        step5_btn_finish: "Selesai & Ke Pengurusan Kereta",
        step5_toast_booking_simulated: "✓ Simulasi Selesai: Tempahan sedia diproses di portal sebenar",

        // Step 1: Spesifikasi Kenderaan
        step1_title: "Spesifikasi Kenderaan",
        step1_sec1_title: "Maklumat Kenderaan & Spesifikasi",
        step1_sec1_sub1: "Maklumat Asas",
        step1_sec1_sub1_note: "(Identiti & Pendaftaran Kenderaan)",
        field_brand: "Pengeluar",
        field_brand_select: "Sila pilih pengeluar",
        field_model: "Model",
        field_model_ph: "Sila tulis model kenderaan",
        field_variant: "Varian",
        field_variant_ph: "Sila tulis varian kenderaan",
        field_plate: "No. Pendaftaran",
        field_plate_ph: "Sila tulis nombor plat",
        field_year: "Tahun Dibuat",
        field_year_ph: "Sila tulis tahun dibuat",
        field_color: "Warna Kenderaan",
        field_color_ph: "Sila tulis warna kenderaan",
        ai_suggestion_label: "Cadangan Spesifikasi Pintar",
        ai_btn_autofill: "Isi Automatik",
        ai_btn_generate: "Jana AI",
        ai_generating_step1: "Mengenal pasti jenama & model...",
        ai_generating_step2: "Memadankan spesifikasi & harga...",
        ai_success_badge: "✓ Selesai 100%",

        step1_sec1_sub2: "Spesifikasi Kenderaan",
        step1_sec1_sub2_note: "(Klasifikasi & Keupayaan Mekanikal)",
        field_category: "Kategori Kenderaan",
        field_category_select: "Sila pilih kategori",
        field_fuel: "Punca Kuasa (Bahan Api)",
        field_fuel_select: "Sila pilih punca kuasa",
        field_transmission: "Sistem Transmisi",
        field_transmission_select: "Sila pilih transmisi",
        field_seats: "Kapasiti Tempat Duduk",
        field_seats_select: "Sila pilih bilangan tempat duduk",
        seats_2: "2 Tempat Duduk",
        seats_4: "4 Tempat Duduk",
        seats_5: "5 Tempat Duduk",
        seats_7: "7 Tempat Duduk",
        seats_8: "8 Tempat Duduk",
        seats_10: "10–12 Tempat Duduk",
        field_engine: "Kapasiti / Sesaran Enjin & Kuasa",
        field_engine_ph: "Sila tulis spesifikasi enjin & kuasa",

        step1_sec2_title: "Penetapan Harga Sewaan Pintar",
        field_daily_rate: "Kadar Harian",
        field_daily_rate_ph: "Sila tulis kadar sewa harian",
        field_weekly_rate: "Kadar Mingguan",
        field_weekly_rate_ph: "Sila tulis kadar sewa mingguan",
        field_monthly_rate: "Kadar Bulanan",
        field_monthly_rate_ph: "Sila tulis kadar sewa bulanan",

        dock_back_cancel: "Batal",
        dock_btn_save_draft: "Simpan Draf",
        dock_btn_save_draft_title: "Simpan perubahan spesifikasi ke draf",
        dock_status_draft_saved: "Draf disimpan",
        dock_next_step2: "Seterusnya: Studio Visual",
        toast_spec_generated: "Spesifikasi kenderaan berjaya dijana secara automatik!",
        toast_draft_saved: "✓ Draf spesifikasi berjaya disimpan!",
        toast_draft_updated: "✓ Perubahan draf telah dikemas kini",
        toast_all_filled: "✓ Data Honda Civic FE berjaya diisi automatik",

        // Step 2: Studio Visual 360°
        step2_sec_gallery_title: "Galeri Pemeriksaan Kenderaan",
        step2_sec_gallery_desc: "Muat naik imej kenderaan untuk rekod pemeriksaan visual syarikat.",
        slot_front: "Hadapan Penuh",
        slot_rear: "Belakang Penuh",
        slot_right: "Sisi Kanan Profil",
        slot_left: "Sisi Kiri Profil",
        slot_quarter_fl: "Suku Hadapan Kiri",
        slot_quarter_rr: "Suku Belakang Kanan",
        step2_sec_cdn_title: "Pusat Pengurusan Aset Visual",
        step2_sec_cdn_desc: "Pautkan pautan visual rasmi kenderaan untuk jana paparan 360° serta-merta.",
        cdn_input_label: "Pautan Visual / Studio 360° Kenderaan",
        cdn_btn_scan: "Jana AI",
        btn_save_visual: "Simpan Visual",
        status_visual_ready: "✓ Visual Sedia",
        tab_gallery: "Galeri",
        tab_360: "Pusingan 360°",
        tab_panorama: "Panorama Dalaman",
        gallery_btn_prev: "Gambar Sebelumnya",
        gallery_btn_next: "Gambar Seterusnya",
        drag_to_rotate: "Seret untuk Putar",
        fullscreen_title: "Skrin Penuh (Full Screen)",
        dock_back_step1: "Maklumat Asas",
        dock_btn_save_draft_step2_title: "Simpan visual kenderaan ke draf",
        dock_next_step3: "Seterusnya: Semakan Akhir",
        toast_visual_saved: "✓ Visual 360° berjaya disimpan",
        toast_cdn_scanning: "Sedang mengimbas aset visual kenderaan...",

        // Step 3: Semakan & Pengesahan Rasmi
        step3_cdn_connected: "Visual Bersambung",
        step3_indicator_rotate: "Leret untuk memutar",
        step3_indicator_rotate_360: "Leret untuk memutar 360°",
        step3_indicator_panorama: "Seret untuk tinjauan panorama",
        step3_sec_specs_title: "Spesifikasi Kenderaan",
        step3_sec_specs_desc: "Parameter teknikal & pendaftaran kenderaan daripada Langkah 1",
        step3_details_complete: "10 Butiran Lengkap",
        pricing_summary_title: "Ringkasan Harga",
        price_daily_label: "Harian",
        price_weekly_label: "Mingguan",
        price_monthly_label: "Bulanan",
        spec_engine_power: "Enjin & Kuasa",
        spec_transmission: "Transmisi",
        spec_fuel: "Punca Kuasa",
        spec_seats: "Kapasiti Tempat Duduk",
        spec_category: "Kategori",
        spec_color: "Warna Badan",
        step3_btn_back: "Studio Visual",
        step3_all_complete: "Semua maklumat lengkap",
        step3_btn_publish: "Daftar Kenderaan Baharu",
        toast_step3_ready: "✓ Maklumat kenderaan lengkap & sedia didaftarkan",
        modal_success_title: "Kenderaan Berjaya Didaftarkan!",
        modal_success_desc: "telah diterbitkan ke inventori aktif sistem dengan integrasi Studio 360°.",
        modal_btn_menu: "Kembali ke Senarai Kereta",
        modal_btn_close: "Tutup",

        // Index Overview
        index_back_gallery: "Kembali ke Galeri Utama",
        index_badge_v7: "VERSI 7 — GABUNGAN PILIHAN RASMI",
        index_badge_hig: "100% APPLE HIG & DUAL THEME",
        index_badge_flow: "Gabungan 4 Skrin Lengkap (Langkah 1 → Langkah 2 → Langkah 3 → Langkah 4)",
        index_hero_title: "Master Finishing Studio UI WeDRIVE",
        index_hero_desc: "Menggabungkan 100% skrin pilihan anda dari Stitch: Langkah 1 (Civic & Harga), Langkah 2 (Studio Visual & 360), Langkah 3 (Semakan Akhir), dan Langkah 4 (Pandangan Pelanggan) dengan kawalan dwitema (Siang / Malam) dan fizik sentuhan Apple.",
        index_btn_launch_wizard: "Mulakan Aliran Wizard Lengkap (Langkah 1 → 2 → 3 → 4)",
        index_step1_card_title: "Langkah 1: Spesifikasi Kenderaan",
        index_step1_card_desc: "Borang spesifikasi kenderaan berkonsep Bento Grid, input nombor tabular, dan integrasi Cadangan Spesifikasi Pintar AI.",
        index_step2_card_title: "Langkah 2: Studio Visual 360°",
        index_step2_card_desc: "Pengurusan imej pemeriksaan galeri, pengimbasan aset visual kenderaan, dan pemain interaktif 360 darjah.",
        index_step3_card_title: "Langkah 3: Pengesahan Rasmi",
        index_step3_card_desc: "Paparan semakan akhir penuh Apple HIG dengan ringkasan visual, kad spesifikasi teknikal, dan struktur harga sewaan.",
        index_btn_open_screen: "Buka Skrin Ini",
        index_live_preview_title: "Pratonton Interaktif Langsung (Device Simulator)",
        index_live_preview_desc: "Pilih skrin di atas atau gunakan tab peranti di bawah untuk menguji responsif MacBook, iPad, dan iPhone.",
        index_open_new_tab: "Buka Skrin Penuh Tab Baharu"
    },

    en: {
        // Navigation & Topbar
        nav_home: "Home",
        nav_cars: "Find Cars",
        nav_bookings: "Bookings",
        nav_customers: "Customers",
        nav_reports: "Reports",
        nav_ai: "AI Intelligence",
        nav_cancel: "Cancel",
        theme_toggle_title: "Toggle Day / Night Theme",
        lang_toggle_title: "Switch Language (MS / EN)",
        lang_code: "EN",

        // Stepper Capsule
        step1_pill: "Basic Details",
        step2_pill: "Visual Studio",
        step3_pill: "Final Review",
        step4_pill: "Customer View",
        step5_pill: "Details & Booking",
        step3_btn_view_as_customer: "View as Customer →",

        // Step 4: Pandangan Pelanggan (Customer View)
        step4_title: "Customer View",
        step4_preview_badge: "Customer Preview Mode",
        step4_preview_notice: "Customer Catalog View",
        step4_preview_desc: "Direct preview of how this vehicle card is showcased in the WeDRIVE customer car search portal.",
        step4_sidebar_tag: "Preview Only",
        step4_sidebar_dashboard: "Dashboard",
        step4_sidebar_cars: "Browse Cars",
        step4_sidebar_bookings: "My Bookings",
        step4_sidebar_wallet: "Wallet & Pass",
        step4_card_available: "Available",
        step4_card_rented: "Rented",
        step4_card_year_prefix: "Year",
        step4_card_360: "360° View",
        step4_card_seats_suffix: "Seats",
        step4_card_color_label: "Color:",
        step4_card_type_label: "Category",
        step4_card_per_day: "/day",
        step4_card_book_now: "Book Now",
        step4_btn_back_step3: "Final Review",
        step4_btn_finish: "Register This Vehicle",

        // Step 5: Butiran & Tempahan Pelanggan (Customer Detail & Booking)
        step5_title: "Vehicle Details & Booking",
        step5_preview_badge: "Customer Booking Mode",
        step5_preview_notice: "Customer Vehicle Details & Booking View",
        step5_preview_desc: "Live display of how customers explore 360°, gallery, and select rental dates for this vehicle.",
        step5_sec_booking_title: "Select Your Dates",
        step5_pickup_date_label: "Pick-up Date",
        step5_return_date_label: "Return Date",
        step5_select_date_ph: "Select date",
        step5_duration_unit: "days",
        step5_btn_continue_booking: "Continue to Booking",
        step5_btn_back_step4: "Customer View",
        step5_btn_finish: "Finish & Go to Car Management",
        step5_toast_booking_simulated: "✓ Simulation Complete: Ready to proceed to booking flow",

        // Step 1: Vehicle Specifications
        step1_title: "Vehicle Specifications",
        step1_sec1_title: "Vehicle Details & Specifications",
        step1_sec1_sub1: "Basic Details",
        step1_sec1_sub1_note: "(Identity & Vehicle Registration)",
        field_brand: "Manufacturer",
        field_brand_select: "Please select manufacturer",
        field_model: "Model",
        field_model_ph: "Please enter vehicle model",
        field_variant: "Variant",
        field_variant_ph: "Please enter vehicle variant",
        field_plate: "Plate No.",
        field_plate_ph: "Please enter plate number",
        field_year: "Year Made",
        field_year_ph: "Please enter manufacturing year",
        field_color: "Vehicle Color",
        field_color_ph: "Please enter vehicle color",
        ai_suggestion_label: "Smart Spec Suggestions",
        ai_btn_autofill: "Auto Fill",
        ai_btn_generate: "Generate AI",
        ai_generating_step1: "Identifying make & model...",
        ai_generating_step2: "Matching specs & pricing...",
        ai_success_badge: "✓ Done 100%",

        step1_sec1_sub2: "Vehicle Specifications",
        step1_sec1_sub2_note: "(Classification & Mechanical Specs)",
        field_category: "Vehicle Category",
        field_category_select: "Please select category",
        field_fuel: "Power Source (Fuel)",
        field_fuel_select: "Please select fuel type",
        field_transmission: "Transmission System",
        field_transmission_select: "Please select transmission",
        field_seats: "Seating Capacity",
        field_seats_select: "Please select seat capacity",
        seats_2: "2 Seats",
        seats_4: "4 Seats",
        seats_5: "5 Seats",
        seats_7: "7 Seats",
        seats_8: "8 Seats",
        seats_10: "10–12 Seats",
        field_engine: "Engine Displacement & Power",
        field_engine_ph: "Please enter engine & power specs",

        step1_sec2_title: "Smart Rental Pricing Configuration",
        field_daily_rate: "Daily Rate",
        field_daily_rate_ph: "Please enter daily rate",
        field_weekly_rate: "Weekly Rate",
        field_weekly_rate_ph: "Please enter weekly rate",
        field_monthly_rate: "Monthly Rate",
        field_monthly_rate_ph: "Please enter monthly rate",

        dock_back_cancel: "Cancel",
        dock_btn_save_draft: "Save Draft",
        dock_btn_save_draft_title: "Save specification changes to draft",
        dock_status_draft_saved: "Draft saved",
        dock_next_step2: "Next: Visual Studio",
        toast_spec_generated: "Vehicle specifications auto-generated successfully!",
        toast_draft_saved: "✓ Specification draft saved successfully!",
        toast_draft_updated: "✓ Draft changes updated",
        toast_all_filled: "✓ Honda Civic FE data auto-filled successfully",

        // Step 2: 360° Visual Studio
        step2_sec_gallery_title: "Vehicle Inspection Gallery",
        step2_sec_gallery_desc: "Upload vehicle inspection images for visual records.",
        slot_front: "Full Front",
        slot_rear: "Full Rear",
        slot_right: "Right Side Profile",
        slot_left: "Left Side Profile",
        slot_quarter_fl: "Front Left Quarter",
        slot_quarter_rr: "Rear Right Quarter",
        step2_sec_cdn_title: "Visual Asset Management Center",
        step2_sec_cdn_desc: "Link official vehicle visual URL to generate 360° views instantly.",
        cdn_input_label: "Vehicle Visual / 360° Studio Link",
        cdn_btn_scan: "Generate AI",
        btn_save_visual: "Save Visuals",
        status_visual_ready: "✓ Visuals Ready",
        tab_gallery: "Gallery",
        tab_360: "360° Spin",
        tab_panorama: "Interior Panorama",
        gallery_btn_prev: "Previous Image",
        gallery_btn_next: "Next Image",
        drag_to_rotate: "Drag to Rotate",
        fullscreen_title: "Full Screen",
        dock_back_step1: "Basic Details",
        dock_btn_save_draft_step2_title: "Save vehicle visuals to draft",
        dock_next_step3: "Next: Final Review",
        toast_visual_saved: "✓ 360° visuals saved successfully",
        toast_cdn_scanning: "Scanning vehicle visual assets...",

        // Step 3: Official Confirmation & Review
        step3_cdn_connected: "Visual Connected",
        step3_indicator_rotate: "Swipe to rotate",
        step3_indicator_rotate_360: "Swipe to rotate 360°",
        step3_indicator_panorama: "Drag for panorama view",
        step3_sec_specs_title: "Vehicle Specifications",
        step3_sec_specs_desc: "Technical & registration parameters from Step 1",
        step3_details_complete: "10 Details Complete",
        pricing_summary_title: "Pricing Summary",
        price_daily_label: "Daily",
        price_weekly_label: "Weekly",
        price_monthly_label: "Monthly",
        spec_engine_power: "Engine & Power",
        spec_transmission: "Transmission",
        spec_fuel: "Power Source",
        spec_seats: "Seating Capacity",
        spec_category: "Category",
        spec_color: "Body Color",
        step3_btn_back: "Visual Studio",
        step3_all_complete: "All details complete",
        step3_btn_publish: "Register New Vehicle",
        toast_step3_ready: "✓ Vehicle details complete & ready for registration",
        modal_success_title: "Vehicle Registered Successfully!",
        modal_success_desc: "has been published to active system inventory with 360° Studio integration.",
        modal_btn_menu: "Back to Main Menu",
        modal_btn_close: "Close",

        // Index Overview
        index_back_gallery: "Back to Main Gallery",
        index_badge_v7: "VERSION 7 — OFFICIAL SELECTION",
        index_badge_hig: "100% APPLE HIG & DUAL THEME",
        index_badge_flow: "Complete 4 Screen Flow (Step 1 → Step 2 → Step 3 → Step 4)",
        index_hero_title: "WeDRIVE Master Finishing Studio UI",
        index_hero_desc: "Combining 100% of your Stitch chosen screens: Step 1 (Civic & Pricing), Step 2 (Visual Studio & 360), Step 3 (Final Review), and Step 4 (Customer View) with dual-theme control (Day / Night) and Apple tactile physics.",
        index_btn_launch_wizard: "Start Full Wizard Flow (Step 1 → 2 → 3 → 4)",
        index_step1_card_title: "Step 1: Vehicle Specifications",
        index_step1_card_desc: "Bento Grid vehicle specification form, tabular number inputs, and AI Smart Spec Suggestions integration.",
        index_step2_card_title: "Step 2: 360° Visual Studio",
        index_step2_card_desc: "Management of inspection gallery photos, vehicle visual asset scanning, and 360-degree interactive player.",
        index_step3_card_title: "Step 3: Official Confirmation",
        index_step3_card_desc: "Full Apple HIG final review view with visual summary, technical spec cards, and rental pricing structure.",
        index_btn_open_screen: "Open This Screen",
        index_live_preview_title: "Live Interactive Preview (Device Simulator)",
        index_live_preview_desc: "Choose a screen above or use device tabs below to test MacBook, iPad, and iPhone responsiveness.",
        index_open_new_tab: "Open Fullscreen in New Tab"
    }
};

/**
 * Get current language setting ('ms' or 'en')
 */
function getCurrentLang() {
    return localStorage.getItem('wedrive-lang') || localStorage.getItem('wedrive_lang') || 'ms';
}

/**
 * Set active language and apply across all bound DOM elements
 */
function setLanguage(lang) {
    const validLang = (lang === 'en') ? 'en' : 'ms';
    localStorage.setItem('wedrive-lang', validLang);
    localStorage.setItem('wedrive_lang', validLang);
    document.documentElement.lang = validLang;

    // Update Language Toggle Button Text & Tooltip
    const langBtn = document.getElementById('langToggleBtn');
    const langText = document.getElementById('langText');
    if (langText) {
        langText.textContent = PREVIEW_I18N[validLang].lang_code;
    } else if (langBtn) {
        langBtn.textContent = PREVIEW_I18N[validLang].lang_code;
    }
    if (langBtn) {
        langBtn.title = PREVIEW_I18N[validLang].lang_toggle_title;
        langBtn.setAttribute('aria-label', PREVIEW_I18N[validLang].lang_toggle_title);
    }

    const dict = PREVIEW_I18N[validLang] || PREVIEW_I18N.ms;

    // 1. Text Content Translation [data-i18n] and [data-key]
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        }
    });

    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (dict[key] !== undefined) {
            el.textContent = dict[key];
        } else if (key === 'ac_step1_title' && dict.step1_title !== undefined) {
            el.textContent = dict.step1_title;
        }
    });

    // 2. HTML Content Translation [data-i18n-html]
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key] !== undefined) {
            el.innerHTML = dict[key];
        }
    });

    // 3. Placeholder Translation [data-i18n-ph]
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (dict[key] !== undefined) {
            el.placeholder = dict[key];
        }
    });

    // 4. Tooltip / Title Translation [data-i18n-title]
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (dict[key] !== undefined) {
            el.title = dict[key];
        }
    });

    // 5. Select Options Translation [data-i18n-opt]
    document.querySelectorAll('option[data-i18n-opt]').forEach(opt => {
        const key = opt.getAttribute('data-i18n-opt');
        if (dict[key] !== undefined) {
            opt.textContent = dict[key];
        }
    });

    // Dispatch system-wide custom event
    document.dispatchEvent(new CustomEvent('wedrive:language-applied', {
        detail: { lang: validLang, dict: dict }
    }));
}

/**
 * Toggle between 'ms' and 'en'
 */
function toggleLanguage() {
    const current = getCurrentLang();
    const next = (current === 'ms') ? 'en' : 'ms';
    setLanguage(next);
}

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setLanguage(getCurrentLang());
    });
} else {
    setLanguage(getCurrentLang());
}

// Expose globally
window.PREVIEW_I18N = PREVIEW_I18N;
window.getCurrentLang = getCurrentLang;
window.setLanguage = setLanguage;
window.toggleLanguage = toggleLanguage;
