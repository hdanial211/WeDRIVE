/**
 * WeDRIVE - Global API & Database Configuration
 * shared/js/api.js
 * 
 * Use this file to manage all database connections, fetches, and endpoints.
 * It is centralized so that when you connect to a real database (like Supabase,
 * Firebase, MySQL/PHP), you only have to update the logic here, and all pages
 * will automatically sync.
 */

window.AppConfig = {
    // -------------------------------------------------------------------------
    // 1. SWITCH BETWEEN DUMMY JSON AND REAL DATABASE
    // -------------------------------------------------------------------------
    // Set to 'false' to use the local dummy JSON files.
    // Set to 'true' when your database backend is ready.
    USE_REAL_DB: false,
    
    // -------------------------------------------------------------------------
    // 2. BACKEND API ENDPOINTS
    // -------------------------------------------------------------------------
    // Update this to your real server URL (e.g., http://localhost/wedrive/api)
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
            } catch(e) { /* try next path */ }
        }
        throw new Error('All fetch paths failed');
    } catch(e) {
        // Fallback: use inline embedded data (works on file:// protocol)
        console.warn('[WeDriveAPI] fetch failed, using inline fallback data.');
        _cachedDummyData = window._WEDRIVE_FALLBACK_DATA || {};
        return _cachedDummyData;
    }
}

/**
 * Inline fallback data – mirrors shared/dummy/data.json
 * Used automatically when fetch() is blocked (e.g. file:// protocol).
 */
window._WEDRIVE_FALLBACK_DATA = {"stats":{"total_vehicles":6,"active_rentals":3,"revenue_today":1240,"new_customers":4,"revenue_change":"+12.5%","rentals_change":"+2","vehicles_change":"0","customers_change":"+4"},"fleet":[{"id":1,"name":"Toyota Vios 2023","plate":"WXY 1234","type":"sedan","label":"Sedan","status":"Available","rate":"RM 120/day","price":120,"fuel":"Petrol","transmission":"Auto","trans":"Auto","seats":5,"year":2023,"color":"Pearl White","rating":4.7,"reviews":42,"ai":"High demand today","images":["toyota-vios-2023.png"]},{"id":2,"name":"Honda CR-V 2024","plate":"ABC 5678","type":"suv","label":"SUV","status":"Rented","rate":"RM 200/day","price":200,"fuel":"Hybrid","transmission":"Auto","trans":"Auto","seats":7,"year":2024,"color":"Sonic Grey","rating":4.9,"reviews":67,"ai":"Best for weekend","images":["honda-crv-2024.png"]},{"id":3,"name":"Perodua Myvi 2023","plate":"PQR 9012","type":"hatchback","label":"Hatchback","status":"Available","rate":"RM 80/day","price":80,"fuel":"Petrol","transmission":"Auto","trans":"Auto","seats":5,"year":2023,"color":"Electric Blue","rating":4.5,"reviews":89,"ai":"Budget pick","images":["perodua-myvi-2023.png"]},{"id":4,"name":"Toyota Hiace 2022","plate":"GHI 3456","type":"van","label":"Van","status":"Available","rate":"RM 350/day","price":350,"fuel":"Diesel","transmission":"Manual","trans":"Manual","seats":12,"year":2022,"color":"Silver","rating":4.3,"reviews":21,"ai":"Group travel","images":["toyota-hiace-2022.png"]},{"id":5,"name":"BMW 3 Series 2024","plate":"JKL 7890","type":"luxury","label":"Luxury","status":"Rented","rate":"RM 450/day","price":450,"fuel":"Petrol","transmission":"Auto","trans":"Auto","seats":5,"year":2024,"color":"Alpine White","rating":5.0,"reviews":15,"ai":"Premium choice","images":["bmw-3series-2024.png"]},{"id":6,"name":"Honda Jazz 2023","plate":"MNO 1122","type":"hatchback","label":"Hatchback","status":"Available","rate":"RM 90/day","price":90,"fuel":"Petrol","transmission":"Auto","trans":"Auto","seats":5,"year":2023,"color":"Lunar Silver","rating":4.6,"reviews":38,"ai":"City favourite","images":["honda-jazz-2023.png"]}],"bookings":[{"id":"BK-2026-001","customer":"Ahmad Hakim","email":"ahmad@gmail.com","phone":"011-10852955","car":"Honda CR-V 2024","plate":"ABC 5678","pickup":"2026-05-10","return":"2026-05-13","pickup_loc":"Melaka Sentral","days":3,"total":600,"status":"Confirmed","payment":"Paid","created_at":"2026-05-08 14:20"},{"id":"BK-2026-002","customer":"Siti Nurul","email":"siti@gmail.com","phone":"012-3456789","car":"Perodua Myvi 2023","plate":"PQR 9012","pickup":"2026-05-12","return":"2026-05-14","pickup_loc":"KLIA2","days":2,"total":160,"status":"Pending","payment":"Unpaid","created_at":"2026-05-09 09:45"},{"id":"BK-2026-003","customer":"Razif Ismail","email":"razif@yahoo.com","phone":"013-9876543","car":"BMW 3 Series 2024","plate":"JKL 7890","pickup":"2026-05-08","return":"2026-05-11","pickup_loc":"Dataran Pahlawan","days":3,"total":1350,"status":"Completed","payment":"Paid","created_at":"2026-05-06 16:30"}],"customers":[{"id":1,"name":"Ahmad Hakim","email":"ahmad@gmail.com","phone":"011-10852955","ic":"990515-04-XXXX","license":"D12345678","total_bookings":5,"total_spent":2400,"status":"Active","joined":"2026-01-15","last_booking":"2026-05-08"},{"id":2,"name":"Siti Nurul","email":"siti@gmail.com","phone":"012-3456789","ic":"000820-01-XXXX","license":"D98765432","total_bookings":2,"total_spent":520,"status":"Active","joined":"2026-03-20","last_booking":"2026-05-09"}],"reports":{"monthly_revenue":[{"month":"Jan","revenue":8500},{"month":"Feb","revenue":9200},{"month":"Mar","revenue":11800},{"month":"Apr","revenue":14500},{"month":"May","revenue":6200}],"car_utilization":[{"car":"Honda CR-V","utilization":85},{"car":"BMW 3 Series","utilization":78},{"car":"Toyota Vios","utilization":65},{"car":"Honda Jazz","utilization":52},{"car":"Perodua Myvi","utilization":48},{"car":"Toyota Hiace","utilization":30}],"summary":{"total_revenue":50200,"total_bookings":42,"avg_rental_days":2.8,"customer_satisfaction":4.6,"popular_car":"Honda CR-V 2024","busiest_month":"April"}},"settings":{"company_name":"WeDRIVE Sdn Bhd","company_email":"admin@wedrive.my","company_phone":"011-10852955","company_address":"Lot 123, Jalan Hang Tuah, 75300 Melaka","currency":"MYR","tax_rate":6,"min_rental_days":1,"max_rental_days":30,"late_fee_per_hour":25,"deposit_percentage":20,"operating_hours":"08:00 - 22:00","pickup_locations":["Melaka Sentral","KLIA2","Dataran Pahlawan","Ayer Keroh","Jonker Street"]},"config":{"app":{"name":"WeDRIVE","version":"1.1.17","tagline":"AI-Powered Car Rental System","support_email":"wedrive@support.com","support_phone":"011-10852955","currency":"RM","timezone":"Asia/Kuala_Lumpur","locale":"en-MY"},"theme":{"default":"day","available":["day","night"]},"booking":{"min_days":1,"max_days":30,"cancellation_policy":{"full_refund_hours":48,"partial_refund_hours":24,"partial_refund_percent":50},"deposit_percent":20},"payment_methods":[{"id":"fpx","label":"Online Banking (FPX)","icon":"account_balance"},{"id":"card","label":"Credit / Debit Card","icon":"credit_card"},{"id":"ewallet","label":"eWallet (TnG / GrabPay)","icon":"phone_android"},{"id":"cash","label":"Cash at Counter","icon":"payments"}],"car_types":[{"value":"all","label":"All Cars"},{"value":"sedan","label":"Sedan"},{"value":"suv","label":"SUV"},{"value":"hatchback","label":"Hatchback"},{"value":"van","label":"Van"},{"value":"luxury","label":"Luxury"}],"status_labels":{"Available":{"class":"available","icon":"check_circle"},"Rented":{"class":"rented","icon":"directions_car"},"Pending":{"class":"pending","icon":"schedule"},"Confirmed":{"class":"confirmed","icon":"verified"},"Completed":{"class":"completed","icon":"task_alt"}}},"marketing":{"banners":[{"id":"BN-001","title":"Raya Special Offer!","message":"Book any car for 3 days or more this Hari Raya and get 15% off. Use code RAYA2026.","color":"#7c3aed","active":true,"start_date":"2026-03-20","end_date":"2026-04-10"}],"promo_codes":[{"id":"PC-001","code":"RAYA2026","description":"Hari Raya 2026 discount","type":"percent","value":15,"min_days":3,"usage_limit":100,"usage_count":12,"active":true,"expiry":"2026-04-10"},{"id":"PC-002","code":"WEDRIVE30","description":"New customer welcome discount","type":"fixed","value":30,"min_days":1,"usage_limit":50,"usage_count":5,"active":true,"expiry":"2026-12-31"}],"seasonal_pricing":[]}};

/**
 * -----------------------------------------------------------------------------
 * 3. GLOBAL DATABASE SERVICE (WeDriveAPI)
 * -----------------------------------------------------------------------------
 * All pages should call these functions instead of using fetch() directly.
 */
window.WeDriveAPI = {

    /**
     * Get the list of all available cars.
     * Used in: index.html (Landing), customer.html (Dashboard), admin.html (Fleet)
     */
    getCars: async function() {
        if (!window.AppConfig.USE_REAL_DB) {
            const data = await _loadDummyData();
            return data.fleet || [];
        } else {
            const res = await fetch(window.AppConfig.API_BASE_URL + window.AppConfig.endpoints.cars);
            if (!res.ok) throw new Error('Database Error: Failed to fetch cars');
            return await res.json();
        }
    },

    /**
     * Get the list of bookings (for admin or customer).
     * Used in: admin.html (Dashboard)
     */
    getBookings: async function() {
        if (!window.AppConfig.USE_REAL_DB) {
            const data = await _loadDummyData();
            return data.bookings || [];
        } else {
            const res = await fetch(window.AppConfig.API_BASE_URL + window.AppConfig.endpoints.bookings);
            if (!res.ok) throw new Error('Database Error: Failed to fetch bookings');
            return await res.json();
        }
    },

    /**
     * Get the Admin Dashboard data (Stats and Fleet status).
     * Used in: admin.html
     */
    getAdminData: async function() {
        if (!window.AppConfig.USE_REAL_DB) {
            return await _loadDummyData();
        } else {
            const res = await fetch(window.AppConfig.API_BASE_URL + "/admin/dashboard");
            if (!res.ok) throw new Error('Database Error: Failed to fetch admin data');
            return await res.json();
        }
    },

    /**
     * Log in a user (Admin or Customer)
     * Used in: login.html
     */
    loginUser: async function(email, password) {
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
            // Real login API call (e.g. Supabase auth or custom backend)
            const res = await fetch(window.AppConfig.API_BASE_URL + window.AppConfig.endpoints.login, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            return await res.json();
        }
    },

    /**
     * Get Chatbot replies.
     * Used in: chatbot.js and admin.html (Settings)
     */
    getChatbotSettings: async function() {
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
                    available: "We have <strong>6 cars available</strong> right now! Scroll down to browse all options or use the filters above.",
                    recommend: "Based on popular choices, I recommend the <strong>Honda CR-V 2024</strong> — great for families and weekend trips! Here is a quick look:",
                    book: "Booking is easy! Just:<br/>1. Select your car below<br/>2. Click <strong>Book Now</strong><br/>3. Fill in your dates<br/>4. Complete payment<br/><br/>Need help choosing a car?",
                    payment: "We accept:<br/>Credit/Debit Card (Visa, Mastercard)<br/>Online Banking (FPX)<br/>eWallet (Touch'n Go, GrabPay)<br/>Cash at counter",
                    default: "Thanks for your message! I am here to help with car rentals. You can also browse cars below or use the filter chips to narrow your search."
                }
            };
        } else {
            // In a real app, fetch from database endpoint
            // const res = await fetch(window.AppConfig.API_BASE_URL + "/chatbot/settings");
            // return await res.json();
            return {};
        }
    },

    /**
     * Update Chatbot replies.
     * Used in: admin.html (Chatbot Settings)
     */
    updateChatbotSettings: async function(newSettings) {
        if (!window.AppConfig.USE_REAL_DB) {
            localStorage.setItem('wedrive_chatbot_settings', JSON.stringify(newSettings));
            return { success: true };
        } else {
            return { success: true };
        }
    },

    /**
     * Get the full data.json (all sections).
     * Used in: marketing.js, promo-banner.js
     */
    getData: async function() {
        if (!window.AppConfig.USE_REAL_DB) {
            return await _loadDummyData();
        } else {
            const res = await fetch(window.AppConfig.API_BASE_URL + '/data');
            if (!res.ok) throw new Error('Database Error: Failed to fetch data');
            return await res.json();
        }
    },

    /**
     * Get marketing data (banners, promo codes, seasonal pricing).
     * Used in: marketing.js, promo-banner.js
     */
    getMarketing: async function() {
        const data = await window.WeDriveAPI.getData();
        try {
            const storedStr = localStorage.getItem('wedrive_marketing');
            if (storedStr) {
                const stored = JSON.parse(storedStr);
                // If stored has some data, use it. Otherwise, fallback to dummy data.
                if (stored && (
                    (stored.banners && stored.banners.length > 0) || 
                    (stored.promo_codes && stored.promo_codes.length > 0) || 
                    (stored.seasonal_pricing && stored.seasonal_pricing.length > 0)
                )) {
                    return stored;
                }
            }
        } catch {}
        return data.marketing || { banners: [], promo_codes: [], seasonal_pricing: [] };
    },

    /**
     * Save marketing data to localStorage.
     * Used in: marketing.js
     */
    saveMarketing: async function(marketingObj) {
        localStorage.setItem('wedrive_marketing', JSON.stringify(marketingObj));
        return { success: true };
    },

    /**
     * Get customer list.
     * Used in: admin customers page
     */
    getCustomers: async function() {
        const data = await window.WeDriveAPI.getData();
        return data.customers || [];
    }

    // You can add more functions here later:
    // createBooking(), updateCarStatus(), deleteCustomer(), etc.
};

