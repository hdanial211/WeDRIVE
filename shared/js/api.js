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

// Dummy data connection removed.
// If the system tries to load dummy data (e.g. Supabase connection fails or offline), redirect to 404.html
async function _loadDummyData() {
    console.error("[WeDriveAPI] Database connection failed or offline. Redirecting to error page.");
    var scripts = document.getElementsByTagName('script');
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].getAttribute('src');
        if (src && src.indexOf('shared/js/api.js') !== -1) {
            window.location.href = src.replace('shared/js/api.js', 'shared/pages/error/404.html');
            return {};
        }
    }
    window.location.href = '/shared/pages/error/404.html';
    return {};
}


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
     * Internal helper to clean up/delete bookings that are 'Unpaid' and created > 10 minutes ago.
     */
    _autoCleanupUnpaidBookings: async function () {
        if (!window.AppConfig.USE_REAL_DB) {
            // For dummy/localStorage/fallback mode
            const dummyTimeLimit = Date.now() - 10 * 60 * 1000;
            const data = await _loadDummyData();
            if (data && data.bookings) {
                const initialLength = data.bookings.length;
                data.bookings = data.bookings.filter(function (b) {
                    if (b.payment === 'Unpaid' && b.created_at) {
                        const createdTime = new Date(b.created_at.replace(' ', 'T')).getTime();
                        if (!isNaN(createdTime) && createdTime < dummyTimeLimit) {
                            return false;
                        }
                    }
                    return true;
                });
                if (data.bookings.length !== initialLength) {
                    console.log('[AutoCleanup] Expired ' + (initialLength - data.bookings.length) + ' unpaid booking(s) from dummy data.');
                }
            }
        } else {
            // For real Supabase database mode
            try {
                var sb = window.supabaseClient;
                if (!sb) return;
                var tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
                var result = await sb.from('bookings')
                    .delete()
                    .eq('payment', 'Unpaid')
                    .lt('created_at', tenMinutesAgo);
                if (result.error) throw result.error;
            } catch (err) {
                console.error('[WeDriveAPI] Supabase auto-cleanup error:', err);
            }
        }
    },
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
        await window.WeDriveAPI._autoCleanupUnpaidBookings();
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
        await window.WeDriveAPI._autoCleanupUnpaidBookings();
        if (!window.AppConfig.USE_REAL_DB) {
            return await _loadDummyData();
        } else {
            try {
                var sb = window.supabaseClient;

                // Core tables (always exist)
                var coreResults = await Promise.all([
                    sb.from('cars').select('*'),
                    sb.from('bookings').select('*'),
                    sb.from('customers').select('*'),
                    sb.from('admins').select('*')
                ]);

                var cars = coreResults[0].data || [];
                var bookings = coreResults[1].data || [];
                var customers = coreResults[2].data || [];
                var admins = coreResults[3].data || [];

                // Optional tables (may not exist yet - handle gracefully)
                var settings = {};
                var reports = {};
                var config = {};
                var marketing = { banners: [], promo_codes: [], seasonal_pricing: [] };

                try { var r = await sb.from('settings').select('*').eq('key', 'main').single(); if (r.data && r.data.value) settings = r.data.value; } catch(e) {}
                try { var r = await sb.from('reports').select('*').eq('key', 'main').single(); if (r.data && r.data.value) reports = r.data.value; } catch(e) {}
                try { var r = await sb.from('config').select('*').eq('key', 'main').single(); if (r.data && r.data.value) config = r.data.value; } catch(e) {}
                try { var r = await sb.from('marketing').select('*').eq('key', 'main').single(); if (r.data && r.data.value) marketing = r.data.value; } catch(e) {}

                // Calculate live stats from real data
                var today = new Date().toISOString().slice(0, 10);
                var activeRentals = bookings.filter(function(b) {
                    return b.status === 'Active' || (b.status === 'Confirmed' && b.start_date <= today && b.end_date >= today);
                }).length;
                var paidBookings = bookings.filter(function(b) { return b.payment === 'Paid'; });
                var totalRevenue = 0;
                paidBookings.forEach(function(b) { totalRevenue += (b.total || 0); });

                // New customers this month
                var monthStart = today.slice(0, 7);
                var newCustomersThisMonth = customers.filter(function(c) {
                    return c.joined && c.joined.startsWith(monthStart);
                }).length;

                var stats = {
                    total_vehicles: cars.length,
                    active_rentals: activeRentals,
                    revenue_today: totalRevenue,
                    new_customers: newCustomersThisMonth || customers.length,
                    revenue_change: "+14.2%",
                    rentals_change: "+" + activeRentals,
                    vehicles_change: "+" + cars.length,
                    customers_change: "+" + (newCustomersThisMonth || customers.length)
                };

                // Auto-complete expired bookings (end_date < today)
                bookings.forEach(function(b) {
                    if ((b.status === 'Active' || b.status === 'Confirmed') && b.end_date && b.end_date < today) {
                        sb.from('bookings').update({ status: 'Completed' }).eq('id', b.id).then(function(r){
                            if(r.error) console.error('[AutoSync] Failed to complete booking', b.id, r.error);
                        });
                        console.log('[AutoSync] Booking #' + b.id + ': ' + b.status + ' -> Completed (expired ' + b.end_date + ')');
                        b.status = 'Completed';
                    }
                });

                // Auto-sync cars.status based on active bookings
                var rentedCarIds = new Set();
                bookings.forEach(function(b) {
                    if ((b.status === 'Active' || b.status === 'Confirmed') && b.start_date <= today && b.end_date >= today) {
                        rentedCarIds.add(b.car_id);
                    }
                });
                var syncFixes = [];
                cars.forEach(function(car) {
                    var shouldBeRented = rentedCarIds.has(car.id);
                    if (shouldBeRented && car.status !== 'Rented') {
                        sb.from('cars').update({ status: 'Rented' }).eq('id', car.id).then(function(r){
                            if(r.error) console.error('[AutoSync] Failed to set Rented for car', car.id, r.error);
                        });
                        syncFixes.push(car.name + ': ' + car.status + ' -> Rented');
                        car.status = 'Rented';
                    } else if (!shouldBeRented && car.status === 'Rented') {
                        sb.from('cars').update({ status: 'Available' }).eq('id', car.id).then(function(r){
                            if(r.error) console.error('[AutoSync] Failed to set Available for car', car.id, r.error);
                        });
                        syncFixes.push(car.name + ': Rented -> Available');
                        car.status = 'Available';
                    }
                });
                if (syncFixes.length > 0) {
                    console.log('[AutoSync] Fixed ' + syncFixes.length + ' car status(es):', syncFixes);
                }

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
                    auth_uid: user.id,
                    auth_provider: 'email'
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
                        auth_uid: user.id,
                        auth_provider: 'google'
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
        await window.WeDriveAPI._autoCleanupUnpaidBookings();
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
        await window.WeDriveAPI._autoCleanupUnpaidBookings();
        if (!window.AppConfig.USE_REAL_DB) {
            var data = await _loadDummyData();
            var bookings = data.bookings || [];
            var cars = data.car || [];
            var car = cars.find(function(c) { return c.id === carId; });
            if (!car) return [];
            
            var todayStr = new Date().toISOString().split('T')[0];
            var bookedRanges = [];
            
            for (var i = 0; i < bookings.length; i++) {
                var b = bookings[i];
                var matchCar = (b.car_id === carId) || (b.plate === car.plate) || (b.car === car.name);
                var matchStatus = ['Active', 'Pending', 'Completed', 'Confirmed'].includes(b.status);
                var endDt = b.end_date || b.return;
                if (matchCar && matchStatus && endDt && endDt >= todayStr) {
                    bookedRanges.push({
                        start_date: b.start_date || b.pickup,
                        end_date: endDt
                    });
                }
            }
            return bookedRanges;
        } else {
            try {
                var sb = window.supabaseClient;
                var today = new Date().toISOString().split('T')[0];
                var result = await sb.from('bookings')
                    .select('start_date,end_date')
                    .eq('car_id', carId)
                    .in('status', ['Active', 'Pending', 'Completed', 'Confirmed'])
                    .gte('end_date', today);
                if (result.error) throw result.error;
                return result.data || [];
            } catch (err) {
                console.error('[WeDriveAPI] getBookedDatesForCar error:', err);
                return [];
            }
        }
    },

    /**
     * Get customer profile by auth_uid.
     * Used in: profile.html
     */
    getCustomerProfile: async function (authUid) {
        if (!window.AppConfig.USE_REAL_DB) {
            return null;
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('customers')
                    .select('*')
                    .eq('auth_uid', authUid)
                    .single();
                if (result.error) throw result.error;
                return result.data || null;
            } catch (err) {
                console.error('[WeDriveAPI] getCustomerProfile error:', err);
                return null;
            }
        }
    },

    /**
     * Update customer profile.
     * Used in: profile.html
     */
    updateCustomerProfile: async function (authUid, profileData) {
        if (!window.AppConfig.USE_REAL_DB) {
            return { success: true };
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('customers')
                    .update(profileData)
                    .eq('auth_uid', authUid);
                if (result.error) throw result.error;
                return { success: true };
            } catch (err) {
                console.error('[WeDriveAPI] updateCustomerProfile error:', err);
                return { success: false, error: err.message };
            }
        }
    },

    /**
     * Check if IC or License is already in use by another account.
     * Returns { success: true, unique: true } if available, 
     * or { success: true, unique: false, error: '...' } if taken.
     */
    checkICAndLicenseUnique: async function(authUid, ic, license) {
        if (!window.AppConfig.USE_REAL_DB) {
            // For dummy mode, check localStorage
            var data = await _loadDummyData();
            if (data && data.customers) {
                for (var i = 0; i < data.customers.length; i++) {
                    var c = data.customers[i];
                    // dummy data uses 'id' instead of 'auth_uid' for matching, but we simulate it
                    if (c.id !== authUid && c.auth_uid !== authUid) {
                        if (ic && c.ic === ic) return { success: true, unique: false, error: 'IC / Passport is already registered to another account.' };
                        if (license && c.license === license) return { success: true, unique: false, error: 'Driving License is already registered to another account.' };
                    }
                }
            }
            return { success: true, unique: true };
        } else {
            try {
                var sb = window.supabaseClient;
                var orQuery = [];
                if (ic) orQuery.push('ic.eq.' + ic);
                if (license) orQuery.push('license.eq.' + license);
                
                if (orQuery.length === 0) return { success: true, unique: true };

                var result = await sb.from('customers')
                    .select('auth_uid, ic, license')
                    .or(orQuery.join(','));
                
                if (result.error) throw result.error;
                
                if (result.data && result.data.length > 0) {
                    for (var j = 0; j < result.data.length; j++) {
                        var existing = result.data[j];
                        if (existing.auth_uid !== authUid) {
                            if (ic && existing.ic === ic) return { success: true, unique: false, error: 'IC / Passport is already registered to another account.' };
                            if (license && existing.license === license) return { success: true, unique: false, error: 'Driving License is already registered to another account.' };
                        }
                    }
                }
                return { success: true, unique: true };
            } catch (err) {
                console.error('[WeDriveAPI] checkICAndLicenseUnique error:', err);
                return { success: false, error: err.message };
            }
        }
    },

    // =====================================================================
    // PROFILE VERIFICATION SYSTEM
    // =====================================================================

    /**
     * Check if a customer's profile is complete and their verification status.
     * Returns: { complete: bool, status: 'Pending'|'Verified'|'Rejected'|null, reason: string|null }
     */
    checkProfileComplete: async function (authUid) {
        try {
            var sb = window.supabaseClient;
            if (!sb || !authUid) return { complete: false, status: null };
            var result = await sb.from('customers').select('ic, license, phone, verification_status, rejection_reason').eq('auth_uid', authUid).maybeSingle();
            if (result.error) throw result.error;
            if (!result.data) return { complete: false, status: null };
            var d = result.data;
            var hasIC = d.ic && d.ic.trim().length > 0;
            var hasLicense = d.license && d.license.trim().length > 0;
            var hasPhone = d.phone && d.phone.trim().length > 0;
            var complete = hasIC && hasLicense && hasPhone;
            return {
                complete: complete,
                status: d.verification_status || null,
                reason: d.rejection_reason || null,
                ic: d.ic || null,
                license: d.license || null,
                phone: d.phone || null
            };
        } catch (err) {
            console.error('[WeDriveAPI] checkProfileComplete error:', err);
            return { complete: false, status: null };
        }
    },

    updateCustomerProfile: async function (authUid, data) {
        try {
            var sb = window.supabaseClient;
            if (!sb) return { success: false, error: 'Database not connected' };
            var updateData = {
                ic: data.ic || '',
                license: data.license || '',
                phone: data.phone || '',
                verification_status: 'Pending',
                rejection_reason: null
            };
            if (data.name) updateData.name = data.name;
            if (data.ic_document_url) updateData.ic_document_url = data.ic_document_url;
            if (data.ic_back_document_url) updateData.ic_back_document_url = data.ic_back_document_url;
            if (data.license_document_url) updateData.license_document_url = data.license_document_url;
            if (data.license_back_document_url) updateData.license_back_document_url = data.license_back_document_url;
            var result = await sb.from('customers').update(updateData).eq('auth_uid', authUid);
            if (result.error) throw result.error;
            return { success: true };
        } catch (err) {
            console.error('[WeDriveAPI] updateCustomerProfile error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Upload a document (IC or License) to Supabase Storage.
     * Returns the public URL of the uploaded file.
     */
    uploadDocument: async function (authUid, file, docType) {
        try {
            var sb = window.supabaseClient;
            if (!sb) return { success: false, error: 'Database not connected' };
            var ext = file.name.split('.').pop().toLowerCase();
            var filePath = authUid + '/' + docType + '_' + Date.now() + '.' + ext;
            var result = await sb.storage.from('documents').upload(filePath, file, {
                cacheControl: '3600',
                upsert: true
            });
            if (result.error) throw result.error;
            var urlResult = sb.storage.from('documents').getPublicUrl(filePath);
            return { success: true, url: urlResult.data.publicUrl };
        } catch (err) {
            console.error('[WeDriveAPI] uploadDocument error:', err);
            return { success: false, error: err.message };
        }
    },

    getCustomerDocuments: async function (customerId) {
        try {
            var sb = window.supabaseClient;
            var result = await sb.from('customers').select('ic_document_url, ic_back_document_url, license_document_url, license_back_document_url, verification_status, rejection_reason').eq('id', customerId).maybeSingle();
            if (result.error) throw result.error;
            return result.data || {};
        } catch (err) {
            console.error('[WeDriveAPI] getCustomerDocuments error:', err);
            return {};
        }
    },

    /**
     * Admin: Verify or Reject a customer's profile.
     */
    verifyCustomer: async function (customerId, status, reason) {
        try {
            var sb = window.supabaseClient;
            var updateData = { verification_status: status };
            if (status === 'Rejected' && reason) {
                updateData.rejection_reason = reason;
            } else {
                updateData.rejection_reason = null;
            }
            var result = await sb.from('customers').update(updateData).eq('id', customerId);
            if (result.error) throw result.error;
            return { success: true };
        } catch (err) {
            console.error('[WeDriveAPI] verifyCustomer error:', err);
            return { success: false, error: err.message };
        }
    }

    // You can add more functions here later:
    // addCar(), updateCar(), deleteCar(), etc.
};
