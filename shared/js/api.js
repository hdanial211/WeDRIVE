/**
 * WeDRIVE - Global API & Database Configuration
 * shared/js/api.js
 * 
 * Use this file to manage all database connections, fetches, and endpoints.
 * It is centralized so that when you connect to a real database (Supabase),
 * you only have to update the logic here, and all pages will automatically sync.
 *
 * REQUIRES: supabase-config.js to be loaded BEFORE this file.
 */

/* global supabase */

window.AppConfig = {
    // -------------------------------------------------------------------------
    // 1. SWITCH BETWEEN DUMMY JSON AND REAL DATABASE
    // -------------------------------------------------------------------------
    // Set to 'false' to use the local dummy JSON files.
    // Set to 'true' when your database backend is ready.
    USE_REAL_DB: true,

    // -------------------------------------------------------------------------
    // 2. BACKEND API ENDPOINTS (legacy - kept for reference)
    // -------------------------------------------------------------------------
    API_BASE_URL: "http://localhost:3000/api",

    endpoints: {
        cars: "/cars",
        bookings: "/bookings",
        customers: "/customers",
        login: "/auth/login"
    }
};

/**
 * Helper function to locate the local dummy JSON files correctly,
 * regardless of which page the user is currently on (root vs subfolder).
 */
function getDummyPath(filename) {
    const isRoot = !window.location.pathname.includes('/pages/');
    const prefix = isRoot ? 'shared/dummy/' : '../../shared/dummy/';
    return prefix + filename;
}

/**
 * Helper: tries fetch() first, falls back to embedded data on file:// protocol.
 * This ensures pages work even when opened directly from Finder/Explorer.
 */
let _cachedDummyData = null;
async function _loadDummyData() {
    if (_cachedDummyData) return _cachedDummyData;
    try {
        // Try multiple relative paths to find data.json
        const paths = [getDummyPath('data.json')];
        // Also try deeper paths for pages nested 3+ levels
        if (window.location.pathname.includes('/pages/')) {
            paths.push('../../../shared/dummy/data.json');
            paths.push('../../../../shared/dummy/data.json');
        }
        for (const p of paths) {
            try {
                const res = await fetch(p);
                if (res.ok) { _cachedDummyData = await res.json(); return _cachedDummyData; }
            } catch (e) { /* try next path */ }
        }
        throw new Error('All fetch paths failed');
    } catch (e) {
        // Fallback: use inline embedded data (works on file:// protocol)
        console.warn('[WeDriveAPI] fetch failed, using inline fallback data.');
        _cachedDummyData = window._WEDRIVE_FALLBACK_DATA || {};
        return _cachedDummyData;
    }
}

/**
 * Inline fallback data - mirrors shared/dummy/data.json
 * Used automatically when fetch() is blocked (e.g. file:// protocol).
 */
window._WEDRIVE_FALLBACK_DATA = { "stats": { "total_vehicles": 8, "active_rentals": 3, "revenue_today": 1680, "new_customers": 5, "revenue_change": "+14.2%", "rentals_change": "+3", "vehicles_change": "+2", "customers_change": "+5" }, "car": [{ "id": 1, "name": "2023 BMW 320i M Sport 2.0", "plate": "WDR 3388", "type": "sedan", "label": "Sedan", "status": "Rented", "rate": "RM 450/day", "price": 450, "fuel": "Petrol", "transmission": "Auto", "trans": "Auto", "seats": 5, "year": 2023, "color": "Alpine White", "rating": 4.9, "reviews": 128, "ai": "Executive favourite", "images": ["Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-040.jpg", "Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-090.jpg", "Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-125.jpg", "Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-170.jpg"] }, { "id": 2, "name": "2023 Mercedes-Benz GLA250 AMG Line 2.0", "plate": "MDN 2508", "type": "suv", "label": "SUV", "status": "Available", "rate": "RM 320/day", "price": 320, "fuel": "Petrol", "transmission": "Auto", "trans": "Auto", "seats": 5, "year": 2023, "color": "Polar White", "rating": 4.8, "reviews": 74, "ai": "Best for family comfort", "images": ["SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-025.jpg", "SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-070.jpg", "SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-120.jpg", "SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-175.jpg"] }, { "id": 3, "name": "2022 Volkswagen Golf GTI 2.0", "plate": "VWG 2022", "type": "hatchback", "label": "Hatchback", "status": "Available", "rate": "RM 190/day", "price": 190, "fuel": "Petrol", "transmission": "Auto", "trans": "Auto", "seats": 5, "year": 2022, "color": "Kings Red", "rating": 4.7, "reviews": 63, "ai": "Sporty city drive", "images": ["Hatchback/2022 Volkswagen Golf GTI 2.0/exterior/full-res/frame-030.jpg", "Hatchback/2022 Volkswagen Golf GTI 2.0/exterior/full-res/frame-085.jpg", "Hatchback/2022 Volkswagen Golf GTI 2.0/exterior/full-res/frame-128.jpg", "Hatchback/2022 Volkswagen Golf GTI 2.0/exterior/full-res/frame-180.jpg"] }, { "id": 4, "name": "2019 Toyota Alphard G S C Package 2.5", "plate": "ALP 2589", "type": "mpv", "label": "MPV", "status": "Available", "rate": "RM 380/day", "price": 380, "fuel": "Petrol", "transmission": "Auto", "trans": "Auto", "seats": 7, "year": 2019, "color": "Pearl White", "rating": 4.9, "reviews": 52, "ai": "Premium group travel", "images": ["MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/frame-030.jpg", "MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/frame-090.jpg", "MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/frame-135.jpg", "MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/frame-180.jpg"] }, { "id": 5, "name": "2018 Mercedes-Benz CLS350 AMG Line 2.0", "plate": "CLS 3508", "type": "coupe", "label": "Coupe", "status": "Rented", "rate": "RM 420/day", "price": 420, "fuel": "Petrol", "transmission": "Auto", "trans": "Auto", "seats": 4, "year": 2018, "color": "Obsidian Black", "rating": 4.8, "reviews": 31, "ai": "Formal arrival pick", "images": ["Coupe/2018 Mercedes-Benz CLS350 AMG Line 2.0/exterior/full-res/frame-025.jpg", "Coupe/2018 Mercedes-Benz CLS350 AMG Line 2.0/exterior/full-res/frame-080.jpg", "Coupe/2018 Mercedes-Benz CLS350 AMG Line 2.0/exterior/full-res/frame-122.jpg", "Coupe/2018 Mercedes-Benz CLS350 AMG Line 2.0/exterior/full-res/frame-178.jpg"] }, { "id": 6, "name": "2022 Ford Ranger Raptor High Rider Dual Cab 2.0", "plate": "RPT 2022", "type": "truck", "label": "Truck", "status": "Available", "rate": "RM 360/day", "price": 360, "fuel": "Diesel", "transmission": "Auto", "trans": "Auto", "seats": 5, "year": 2022, "color": "Conquer Grey", "rating": 4.7, "reviews": 29, "ai": "Adventure and cargo ready", "images": ["Truck/2022 Ford Ranger Raptor High Rider Dual Cab 2.0/exterior/full-res/frame-020.jpg", "Truck/2022 Ford Ranger Raptor High Rider Dual Cab 2.0/exterior/full-res/frame-075.jpg", "Truck/2022 Ford Ranger Raptor High Rider Dual Cab 2.0/exterior/full-res/frame-125.jpg", "Truck/2022 Ford Ranger Raptor High Rider Dual Cab 2.0/exterior/full-res/frame-180.jpg"] }, { "id": 7, "name": "2017 Perodua AXIA G 1.0", "plate": "AXG 1701", "type": "hatchback", "label": "Hatchback", "status": "Available", "rate": "RM 95/day", "price": 95, "fuel": "Petrol", "transmission": "Auto", "trans": "Auto", "seats": 5, "year": 2017, "color": "Glittering Silver", "rating": 4.5, "reviews": 91, "ai": "Budget city runabout", "images": ["Hatchback/2017 Perodua AXIA G 1.0/exterior/full-res/frame-022.jpg", "Hatchback/2017 Perodua AXIA G 1.0/exterior/full-res/frame-070.jpg", "Hatchback/2017 Perodua AXIA G 1.0/exterior/full-res/frame-123.jpg", "Hatchback/2017 Perodua AXIA G 1.0/exterior/full-res/frame-176.jpg"] }, { "id": 8, "name": "2025 Perodua AXIA AV 1.0", "plate": "AXA 2505", "type": "hatchback", "label": "Hatchback", "status": "Available", "rate": "RM 110/day", "price": 110, "fuel": "Petrol", "transmission": "Auto", "trans": "Auto", "seats": 5, "year": 2025, "color": "Coral Blue", "rating": 4.6, "reviews": 40, "ai": "Newest compact choice", "images": ["Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/frame-018.jpg", "Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/frame-066.jpg", "Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/frame-118.jpg", "Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/frame-174.jpg"] }], "bookings": [{ "id": "BK-2026-001", "customer": "Ahmad Hakim", "email": "ahmad@gmail.com", "phone": "010-271 9558", "car": "2023 BMW 320i M Sport 2.0", "plate": "WDR 3388", "pickup": "2026-05-10", "return": "2026-05-13", "pickup_loc": "Melaka Sentral", "days": 3, "total": 1350, "status": "Confirmed", "payment": "Paid", "created_at": "2026-05-08 14:20" }, { "id": "BK-2026-002", "customer": "Siti Nurul", "email": "siti@gmail.com", "phone": "012-3456789", "car": "2025 Perodua AXIA AV 1.0", "plate": "AXA 2505", "pickup": "2026-05-12", "return": "2026-05-14", "pickup_loc": "KLIA2", "days": 2, "total": 220, "status": "Pending", "payment": "Unpaid", "created_at": "2026-05-09 09:45" }, { "id": "BK-2026-003", "customer": "Razif Ismail", "email": "razif@yahoo.com", "phone": "013-9876543", "car": "2018 Mercedes-Benz CLS350 AMG Line 2.0", "plate": "CLS 3508", "pickup": "2026-05-08", "return": "2026-05-11", "pickup_loc": "Dataran Pahlawan", "days": 3, "total": 1260, "status": "Completed", "payment": "Paid", "created_at": "2026-05-06 16:30" }, { "id": "BK-2026-004", "customer": "Nurul Aina", "email": "aina@gmail.com", "phone": "014-5551234", "car": "2017 Perodua AXIA G 1.0", "plate": "AXG 1701", "pickup": "2026-05-15", "return": "2026-05-18", "pickup_loc": "Ayer Keroh", "days": 3, "total": 285, "status": "Pending", "payment": "Unpaid", "created_at": "2026-05-09 11:00" }, { "id": "BK-2026-005", "customer": "Hafiz Rahman", "email": "hafiz@outlook.com", "phone": "016-7890123", "car": "2022 Volkswagen Golf GTI 2.0", "plate": "VWG 2022", "pickup": "2026-05-20", "return": "2026-05-22", "pickup_loc": "Melaka Sentral", "days": 2, "total": 380, "status": "Confirmed", "payment": "Paid", "created_at": "2026-05-09 15:10" }, { "id": "BK-2026-006", "customer": "Ahmad Hakim", "email": "ahmad@gmail.com", "phone": "010-271 9558", "car": "2023 Mercedes-Benz GLA250 AMG Line 2.0", "plate": "MDN 2508", "pickup": "2026-05-18", "return": "2026-05-21", "pickup_loc": "Dataran Pahlawan", "days": 3, "total": 960, "status": "Confirmed", "payment": "Paid", "created_at": "2026-05-10 10:00" }, { "id": "BK-2026-007", "customer": "Farah Zainal", "email": "farah@gmail.com", "phone": "019-2345678", "car": "2019 Toyota Alphard G S C Package 2.5", "plate": "ALP 2589", "pickup": "2026-05-22", "return": "2026-05-25", "pickup_loc": "Jonker Street", "days": 3, "total": 1140, "status": "Pending", "payment": "Unpaid", "created_at": "2026-05-11 08:30" }, { "id": "BK-2026-008", "customer": "Razif Ismail", "email": "razif@yahoo.com", "phone": "013-9876543", "car": "2022 Ford Ranger Raptor High Rider Dual Cab 2.0", "plate": "RPT 2022", "pickup": "2026-05-14", "return": "2026-05-17", "pickup_loc": "Melaka Sentral", "days": 3, "total": 1080, "status": "Confirmed", "payment": "Paid", "created_at": "2026-05-09 14:00" }, { "id": "BK-2026-009", "customer": "Siti Nurul", "email": "siti@gmail.com", "phone": "012-3456789", "car": "2019 Toyota Alphard G S C Package 2.5", "plate": "ALP 2589", "pickup": "2026-05-25", "return": "2026-05-28", "pickup_loc": "KLIA2", "days": 3, "total": 1140, "status": "Pending", "payment": "Unpaid", "created_at": "2026-05-12 09:00" }, { "id": "BK-2026-010", "customer": "Nurul Aina", "email": "aina@gmail.com", "phone": "014-5551234", "car": "2025 Perodua AXIA AV 1.0", "plate": "AXA 2505", "pickup": "2026-05-19", "return": "2026-05-21", "pickup_loc": "Ayer Keroh", "days": 2, "total": 220, "status": "Confirmed", "payment": "Paid", "created_at": "2026-05-10 16:30" }], "customers": [{ "id": 1, "name": "Ahmad Hakim", "email": "ahmad@gmail.com", "phone": "010-271 9558", "ic": "990515-04-XXXX", "license": "D12345678", "total_bookings": 5, "total_spent": 2400, "status": "Active", "joined": "2026-01-15", "last_booking": "2026-05-08" }, { "id": 2, "name": "Siti Nurul", "email": "siti@gmail.com", "phone": "012-3456789", "ic": "000820-01-XXXX", "license": "D98765432", "total_bookings": 2, "total_spent": 520, "status": "Active", "joined": "2026-03-20", "last_booking": "2026-05-09" }, { "id": 3, "name": "Razif Ismail", "email": "razif@yahoo.com", "phone": "013-9876543", "ic": "950310-06-XXXX", "license": "D11223344", "total_bookings": 8, "total_spent": 5800, "status": "Active", "joined": "2025-11-05", "last_booking": "2026-05-06" }, { "id": 4, "name": "Nurul Aina", "email": "aina@gmail.com", "phone": "014-5551234", "ic": "010425-04-XXXX", "license": "D55667788", "total_bookings": 1, "total_spent": 360, "status": "Active", "joined": "2026-05-01", "last_booking": "2026-05-09" }, { "id": 5, "name": "Hafiz Rahman", "email": "hafiz@outlook.com", "phone": "016-7890123", "ic": "980712-10-XXXX", "license": "D99887766", "total_bookings": 3, "total_spent": 890, "status": "Active", "joined": "2026-02-10", "last_booking": "2026-05-09" }, { "id": 6, "name": "Farah Zainal", "email": "farah@gmail.com", "phone": "019-2345678", "ic": "970630-04-XXXX", "license": "D44332211", "total_bookings": 0, "total_spent": 0, "status": "Inactive", "joined": "2026-04-20", "last_booking": "-" }], "reports": { "monthly_revenue": [{ "month": "Jan", "revenue": 8500 }, { "month": "Feb", "revenue": 9200 }, { "month": "Mar", "revenue": 11800 }, { "month": "Apr", "revenue": 14500 }, { "month": "May", "revenue": 7800 }], "car_utilization": [{ "car": "Mercedes-Benz GLA250", "utilization": 84 }, { "car": "BMW 320i M Sport", "utilization": 80 }, { "car": "Toyota Alphard", "utilization": 72 }, { "car": "Volkswagen Golf GTI", "utilization": 61 }, { "car": "Perodua AXIA AV", "utilization": 58 }, { "car": "Ford Ranger Raptor", "utilization": 44 }], "summary": { "total_revenue": 54800, "total_bookings": 48, "avg_rental_days": 2.9, "customer_satisfaction": 4.7, "popular_car": "2023 Mercedes-Benz GLA250 AMG Line 2.0", "busiest_month": "April" } }, "settings": { "company_name": "WeDRIVE Sdn Bhd", "company_email": "admin@wedrive.my", "company_phone": "010-271 9558", "company_address": "Lot 123, Jalan Hang Tuah, 75300 Melaka", "currency": "MYR", "tax_rate": 6, "min_rental_days": 1, "max_rental_days": 30, "late_fee_per_hour": 25, "deposit_percentage": 20, "operating_hours": "08:00 - 22:00", "pickup_locations": ["Melaka Sentral", "KLIA2", "Dataran Pahlawan", "Ayer Keroh", "Jonker Street"] }, "admins": [{ "id": 1, "name": "Admin", "email": "admin@wedrive.my", "role": "Super Admin", "last_login": "2026-05-09 09:15" }], "config": { "app": { "name": "WeDRIVE", "version": "1.1.17", "tagline": "AI-Powered Car Rental System", "support_email": "wedrive@support.com", "support_phone": "010-271 9558", "currency": "RM", "timezone": "Asia/Kuala_Lumpur", "locale": "en-MY" }, "theme": { "default": "day", "available": ["day", "night"] }, "booking": { "min_days": 1, "max_days": 30, "cancellation_policy": { "full_refund_hours": 48, "partial_refund_hours": 24, "partial_refund_percent": 50 }, "deposit_percent": 20 }, "payment_methods": [{ "id": "fpx", "label": "Online Banking (FPX)", "icon": "account_balance" }, { "id": "card", "label": "Credit / Debit Card", "icon": "credit_card" }, { "id": "ewallet", "label": "eWallet (TnG / GrabPay)", "icon": "phone_android" }, { "id": "cash", "label": "Cash at Counter", "icon": "payments" }], "car_types": [{ "value": "all", "label": "All Cars" }, { "value": "sedan", "label": "Sedan" }, { "value": "suv", "label": "SUV" }, { "value": "hatchback", "label": "Hatchback" }, { "value": "mpv", "label": "MPV" }, { "value": "coupe", "label": "Coupe" }, { "value": "truck", "label": "Truck" }], "status_labels": { "Available": { "class": "available", "icon": "check_circle" }, "Rented": { "class": "rented", "icon": "directions_car" }, "Pending": { "class": "pending", "icon": "schedule" }, "Confirmed": { "class": "confirmed", "icon": "verified" }, "Completed": { "class": "completed", "icon": "task_alt" } } }, "marketing": { "banners": [{ "id": "BN-001", "title": "Raya Special Offer!", "message": "Book any car for 3 days or more this Hari Raya and get 15% off. Use code RAYA2026.", "color": "#7c3aed", "active": true, "start_date": "2026-03-20", "end_date": "2026-04-10" }, { "id": "BN-002", "title": "School Holiday Promo", "message": "Planning a road trip? Enjoy free GPS and child seat for bookings above 5 days!", "color": "#0ea5e9", "active": false, "start_date": "2026-05-30", "end_date": "2026-06-15" }], "promo_codes": [{ "id": "PC-001", "code": "RAYA2026", "description": "Hari Raya 2026 discount", "type": "percent", "value": 15, "min_days": 3, "usage_limit": 100, "usage_count": 12, "active": true, "expiry": "2026-04-10" }, { "id": "PC-002", "code": "WEDRIVE30", "description": "New customer welcome discount", "type": "fixed", "value": 30, "min_days": 1, "usage_limit": 50, "usage_count": 5, "active": true, "expiry": "2026-12-31" }, { "id": "PC-003", "code": "HOLIDAY15", "description": "School holiday special", "type": "percent", "value": 15, "min_days": 4, "usage_limit": 80, "usage_count": 0, "active": false, "expiry": "2026-06-15" }], "seasonal_pricing": [] } };

/**
 * -----------------------------------------------------------------------------
 * 3. GLOBAL DATABASE SERVICE (WeDriveAPI)
 * -----------------------------------------------------------------------------
 * All pages should call these functions instead of using fetch() directly.
 * When USE_REAL_DB is true, data is read from/written to Supabase PostgreSQL.
 * When USE_REAL_DB is false, data is read from the local dummy JSON files.
 */
window.WeDriveAPI = {

    /**
     * Get the list of all available cars.
     * Used in: index.html (Landing), customer.html (Dashboard), admin.html (Car)
     */
    getCars: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            const data = await _loadDummyData();
            return data.car || [];
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('cars').select('*');
                if (result.error) throw result.error;
                return result.data || [];
            } catch (err) {
                console.error('[WeDriveAPI] Supabase getCars error:', err);
                var data = await _loadDummyData();
                return data.car || [];
            }
        }
    },

    /**
     * Get the list of bookings (for admin or customer).
     * Used in: admin.html (Dashboard)
     */
    getBookings: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            const data = await _loadDummyData();
            return data.bookings || [];
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('bookings').select('*');
                if (result.error) throw result.error;
                return result.data || [];
            } catch (err) {
                console.error('[WeDriveAPI] Supabase getBookings error:', err);
                var data = await _loadDummyData();
                return data.bookings || [];
            }
        }
    },

    /**
     * Get the Admin Dashboard data (Stats and Car status).
     * Used in: admin.html
     */
    getAdminData: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            return await _loadDummyData();
        } else {
            try {
                var sb = window.supabaseClient;

                // Fetch all tables in parallel
                var results = await Promise.all([
                    sb.from('cars').select('*'),
                    sb.from('bookings').select('*'),
                    sb.from('customers').select('*'),
                    sb.from('settings').select('*').eq('key', 'main').single(),
                    sb.from('reports').select('*').eq('key', 'main').single(),
                    sb.from('config').select('*').eq('key', 'main').single(),
                    sb.from('admins').select('*'),
                    sb.from('marketing').select('*').eq('key', 'main').single()
                ]);

                var cars = results[0].data || [];
                var bookings = results[1].data || [];
                var customers = results[2].data || [];
                var settings = (results[3].data && results[3].data.value) ? results[3].data.value : {};
                var reports = (results[4].data && results[4].data.value) ? results[4].data.value : {};
                var config = (results[5].data && results[5].data.value) ? results[5].data.value : {};
                var admins = results[6].data || [];
                var marketing = (results[7].data && results[7].data.value) ? results[7].data.value : { banners: [], promo_codes: [], seasonal_pricing: [] };

                // Calculate live stats from data
                var activeRentals = cars.filter(function(c) { return c.status === 'Rented'; }).length;
                var paidBookings = bookings.filter(function(b) { return b.payment === 'Paid'; });
                var revenueToday = 0;
                paidBookings.forEach(function(b) { revenueToday += (b.total || 0); });

                var stats = {
                    total_vehicles: cars.length,
                    active_rentals: activeRentals,
                    revenue_today: revenueToday,
                    new_customers: customers.length,
                    revenue_change: "+14.2%",
                    rentals_change: "+" + activeRentals,
                    vehicles_change: "+" + cars.length,
                    customers_change: "+" + customers.length
                };

                return {
                    stats: stats,
                    car: cars,
                    bookings: bookings,
                    customers: customers,
                    settings: settings,
                    reports: reports,
                    config: config,
                    admins: admins,
                    marketing: marketing
                };
            } catch (err) {
                console.error('[WeDriveAPI] Supabase getAdminData error:', err);
                return await _loadDummyData();
            }
        }
    },

    /**
     * Log in a user (Admin or Customer)
     * Used in: login.html
     */
    loginUser: async function (email, password) {
        if (!window.AppConfig.USE_REAL_DB) {
            // Simulate API delay
            return new Promise((resolve) => {
                setTimeout(() => {
                    if (email.includes('admin')) {
                        resolve({ success: true, role: 'admin' });
                    } else {
                        resolve({ success: true, role: 'customer' });
                    }
                }, 1500);
            });
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.auth.signInWithPassword({ email: email, password: password });

                if (result.error) {
                    return { success: false, error: result.error.message };
                }

                var user = result.data.user;

                // Check if user is admin
                var adminResult = await sb.from('admins').select('*').eq('email', email).maybeSingle();
                var role = (adminResult.data) ? 'admin' : 'customer';

                return { success: true, role: role, user: user };
            } catch (err) {
                console.error('[WeDriveAPI] Supabase login error:', err);
                return { success: false, error: 'Login failed. Please try again.' };
            }
        }
    },

    /**
     * Sign up a new user
     * Used in: signup.html
     */
    signupUser: async function (name, email, password, phone) {
        if (!window.AppConfig.USE_REAL_DB) {
            return new Promise(function(resolve) {
                setTimeout(function() {
                    resolve({ success: true, role: 'customer' });
                }, 1500);
            });
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.auth.signUp({
                    email: email,
                    password: password,
                    options: { data: { full_name: name, phone: phone || '' } }
                });

                if (result.error) {
                    return { success: false, error: result.error.message };
                }

                var user = result.data.user;

                // Create customer record in customers table
                await sb.from('customers').insert({
                    customer_id: user.id,
                    name: name,
                    email: email,
                    phone: phone || '',
                    ic: '',
                    license: '',
                    status: 'Active',
                    joined: new Date().toISOString().split('T')[0],
                    auth_uid: user.id
                });

                return { success: true, role: 'customer', user: user };
            } catch (err) {
                console.error('[WeDriveAPI] Supabase signup error:', err);
                return { success: false, error: err.message || 'Signup failed. Please try again.' };
            }
        }
    },

    /**
     * Sign in with Google
     * Used in: login.html
     * Supabase handles OAuth popup/redirect automatically
     */
    loginWithGoogle: async function () {
        try {
            var sb = window.supabaseClient;
            var result = await sb.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/account/pages/login/login.html'
                }
            });
            if (result.error) {
                return { success: false, error: result.error.message };
            }
            // Supabase will redirect to Google, then back to redirectTo URL
            return { success: true };
        } catch (err) {
            console.error('[WeDriveAPI] Google login error:', err);
            return { success: false, error: 'Google login failed.' };
        }
    },

    /**
     * Handle OAuth callback (Google Sign-In redirect result)
     * Called on login page load to check if user just returned from Google
     */
    handleGoogleRedirectResult: async function () {
        try {
            var sb = window.supabaseClient;
            var sessionResult = await sb.auth.getSession();

            if (sessionResult.data.session) {
                var user = sessionResult.data.session.user;

                // Check if customer record exists, create if not
                var custResult = await sb.from('customers').select('*').eq('auth_uid', user.id).maybeSingle();
                if (!custResult.data) {
                    await sb.from('customers').insert({
                        customer_id: user.id,
                        name: user.user_metadata.full_name || user.email.split('@')[0],
                        email: user.email,
                        phone: '',
                        ic: '',
                        license: '',
                        status: 'Active',
                        joined: new Date().toISOString().split('T')[0],
                        auth_uid: user.id
                    });
                }

                // Check if admin
                var adminResult = await sb.from('admins').select('*').eq('email', user.email).maybeSingle();
                var role = adminResult.data ? 'admin' : 'customer';

                return { success: true, role: role, user: user };
            }

            return { success: false, noRedirect: true };
        } catch (err) {
            console.error('[WeDriveAPI] Google redirect error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Sign out
     * Used in: sidebar, navbar
     */
    logoutUser: async function () {
        try {
            var sb = window.supabaseClient;
            await sb.auth.signOut();
            localStorage.removeItem('wedrive_session');
            return { success: true };
        } catch (err) {
            console.error('[WeDriveAPI] Logout error:', err);
            return { success: false };
        }
    },

    /**
     * Get current logged-in user
     */
    getCurrentUser: async function () {
        if (!window.supabaseClient) return null;
        var result = await window.supabaseClient.auth.getUser();
        return result.data.user || null;
    },

    /**
     * Get Chatbot replies.
     * Used in: chatbot.js and admin.html (Settings)
     */
    getChatbotSettings: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            // Simulated DB: check localStorage first, otherwise load default
            const localSettings = localStorage.getItem('wedrive_chatbot_settings');
            if (localSettings) {
                return JSON.parse(localSettings);
            }

            // Default replies based on original chatbot.js
            return {
                greeting: "Hi! I'm your <strong>WeDRIVE AI Assistant</strong>.<br/>I can help you find the perfect car, assist with booking, or answer any questions. How can I help?",
                replies: {
                    available: "We have <strong>8 cars available</strong> right now! Scroll down to browse all options or use the filters above.",
                    recommend: "Based on popular choices, I recommend the <strong>2023 Mercedes-Benz GLA250 AMG Line 2.0</strong> -- ideal for premium family trips and weekend comfort. Here is a quick look:",
                    book: "Booking is easy! Just:<br/>1. Select your car below<br/>2. Click <strong>Book Now</strong><br/>3. Fill in your dates<br/>4. Complete payment<br/><br/>Need help choosing a car?",
                    payment: "We accept:<br/>Credit/Debit Card (Visa, Mastercard)<br/>Online Banking (FPX)<br/>eWallet (Touch'n Go, GrabPay)<br/>Cash at counter",
                    default: "Thanks for your message! I am here to help with car rentals. You can also browse cars below or use the filter chips to narrow your search."
                }
            };
        } else {
            try {
                var localSettings = localStorage.getItem('wedrive_chatbot_settings');
                if (localSettings) {
                    return JSON.parse(localSettings);
                }
                var sb = window.supabaseClient;
                var result = await sb.from('config').select('value').eq('key', 'chatbot').maybeSingle();
                if (result.data && result.data.value) return result.data.value;
                return {
                    greeting: "Hi! I'm your <strong>WeDRIVE AI Assistant</strong>.<br/>I can help you find the perfect car, assist with booking, or answer any questions. How can I help?",
                    replies: {
                        available: "We have <strong>8 cars available</strong> right now! Scroll down to browse all options or use the filters above.",
                        recommend: "Based on popular choices, I recommend the <strong>2023 Mercedes-Benz GLA250 AMG Line 2.0</strong> -- ideal for premium family trips and weekend comfort.",
                        book: "Booking is easy! Just:<br/>1. Select your car below<br/>2. Click <strong>Book Now</strong><br/>3. Fill in your dates<br/>4. Complete payment",
                        payment: "We accept:<br/>Credit/Debit Card (Visa, Mastercard)<br/>Online Banking (FPX)<br/>eWallet (Touch'n Go, GrabPay)<br/>Cash at counter",
                        default: "Thanks for your message! I am here to help with car rentals."
                    }
                };
            } catch (err) {
                console.error('[WeDriveAPI] getChatbotSettings error:', err);
                return {};
            }
        }
    },

    /**
     * Update Chatbot replies.
     * Used in: admin.html (Chatbot Settings)
     */
    updateChatbotSettings: async function (newSettings) {
        if (!window.AppConfig.USE_REAL_DB) {
            localStorage.setItem('wedrive_chatbot_settings', JSON.stringify(newSettings));
            return { success: true };
        } else {
            try {
                localStorage.setItem('wedrive_chatbot_settings', JSON.stringify(newSettings));
                var sb = window.supabaseClient;
                await sb.from('config').upsert({ key: 'chatbot', value: newSettings });
                return { success: true };
            } catch (err) {
                console.error('[WeDriveAPI] updateChatbotSettings error:', err);
                return { success: false };
            }
        }
    },

    /**
     * Get the full data (all sections).
     * Used in: marketing.js, promo-banner.js
     */
    getData: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            return await _loadDummyData();
        } else {
            // Reuse getAdminData which fetches everything
            return await window.WeDriveAPI.getAdminData();
        }
    },

    /**
     * Get marketing data (banners, promo codes, seasonal pricing).
     * Used in: marketing.js, promo-banner.js
     */
    getMarketing: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            var data = await window.WeDriveAPI.getData();
            try {
                var storedStr = localStorage.getItem('wedrive_marketing');
                if (storedStr) {
                    var stored = JSON.parse(storedStr);
                    if (stored && (
                        (stored.banners && stored.banners.length > 0) ||
                        (stored.promo_codes && stored.promo_codes.length > 0) ||
                        (stored.seasonal_pricing && stored.seasonal_pricing.length > 0)
                    )) {
                        return stored;
                    }
                }
            } catch (e) { }
            return data.marketing || { banners: [], promo_codes: [], seasonal_pricing: [] };
        } else {
            try {
                var storedStr = localStorage.getItem('wedrive_marketing');
                if (storedStr) {
                    var stored = JSON.parse(storedStr);
                    if (stored && (stored.banners || stored.promo_codes)) return stored;
                }
                var sb = window.supabaseClient;
                var result = await sb.from('marketing').select('value').eq('key', 'main').maybeSingle();
                if (result.data && result.data.value) return result.data.value;
                return { banners: [], promo_codes: [], seasonal_pricing: [] };
            } catch (err) {
                console.error('[WeDriveAPI] getMarketing error:', err);
                return { banners: [], promo_codes: [], seasonal_pricing: [] };
            }
        }
    },

    /**
     * Save marketing data.
     * Used in: marketing.js
     */
    saveMarketing: async function (marketingObj) {
        localStorage.setItem('wedrive_marketing', JSON.stringify(marketingObj));
        if (window.AppConfig.USE_REAL_DB) {
            try {
                var sb = window.supabaseClient;
                await sb.from('marketing').upsert({ key: 'main', value: marketingObj });
            } catch (err) {
                console.error('[WeDriveAPI] saveMarketing error:', err);
            }
        }
        return { success: true };
    },

    /**
     * Get customer list.
     * Used in: admin customers page
     */
    getCustomers: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            var data = await window.WeDriveAPI.getData();
            return data.customers || [];
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('customers').select('*');
                if (result.error) throw result.error;
                return result.data || [];
            } catch (err) {
                console.error('[WeDriveAPI] getCustomers error:', err);
                return [];
            }
        }
    },

    /**
     * Create a new booking.
     * Used in: booking flow (payment page)
     */
    createBooking: async function (bookingData) {
        if (!window.AppConfig.USE_REAL_DB) {
            return { success: true, id: 'BK-DEMO-' + Date.now() };
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('bookings').insert(bookingData).select().single();
                if (result.error) throw result.error;
                return { success: true, id: result.data.booking_id || result.data.id };
            } catch (err) {
                console.error('[WeDriveAPI] createBooking error:', err);
                return { success: false, error: err.message };
            }
        }
    },

    /**
     * Update car status (Available/Rented).
     * Used in: admin car management, booking flow
     */
    updateCarStatus: async function (carId, newStatus) {
        if (!window.AppConfig.USE_REAL_DB) {
            return { success: true };
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('cars').update({ status: newStatus }).eq('id', carId);
                if (result.error) throw result.error;
                return { success: true };
            } catch (err) {
                console.error('[WeDriveAPI] updateCarStatus error:', err);
                return { success: false };
            }
        }
    },

    /**
     * Get bookings for a specific customer (by auth_uid).
     * Used in: my-bookings.html
     */
    getCustomerBookings: async function (authUid) {
        if (!window.AppConfig.USE_REAL_DB) {
            var data = await _loadDummyData();
            return data.bookings || [];
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('bookings')
                    .select('*')
                    .eq('auth_uid', authUid)
                    .order('start_date', { ascending: false });
                if (result.error) throw result.error;
                return result.data || [];
            } catch (err) {
                console.error('[WeDriveAPI] getCustomerBookings error:', err);
                return [];
            }
        }
    },

    /**
     * Get booked date ranges for a specific car.
     * Used in: booking calendar (NOTA 5 - block booked dates)
     */
    getBookedDatesForCar: async function (carId) {
        if (!window.AppConfig.USE_REAL_DB) {
            return [];
        } else {
            try {
                var sb = window.supabaseClient;
                var today = new Date().toISOString().split('T')[0];
                var result = await sb.from('bookings')
                    .select('start_date,end_date')
                    .eq('car_id', carId)
                    .in('status', ['Active', 'Pending', 'Completed'])
                    .gte('end_date', today);
                if (result.error) throw result.error;
                return result.data || [];
            } catch (err) {
                console.error('[WeDriveAPI] getBookedDatesForCar error:', err);
                return [];
            }
        }
    }

    // You can add more functions here later:
    // addCar(), updateCar(), deleteCar(), etc.
};
