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
            // Fetch from dummy file
            const res = await fetch(getDummyPath('customer.json'));
            if (!res.ok) throw new Error('Failed to load dummy car data');
            const data = await res.json();
            return data.cars;
        } else {
            // Fetch from real database
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
            const res = await fetch(getDummyPath('admin.json'));
            if (!res.ok) throw new Error('Failed to load dummy booking data');
            const data = await res.json();
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
            const res = await fetch(getDummyPath('admin.json'));
            if (!res.ok) throw new Error('Failed to load dummy admin data');
            return await res.json();
        } else {
            // Real Database: You might need to fetch stats and fleet separately from API
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
    }

    // You can add more functions here later:
    // createBooking(), updateCarStatus(), deleteCustomer(), etc.
};
