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
    // 1. PRODUCTION DATA SOURCE
    // -------------------------------------------------------------------------
    // Production uses Supabase PostgreSQL. LocalStorage is only allowed for
    // short-lived UI preferences and the in-progress Add Car draft.
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

// Dummy data is deliberately disabled in production. This guard remains only
// so an old caller fails loudly instead of silently displaying fake records.
async function _loadDummyData() {
    throw new Error('Dummy database is disabled. Supabase is required.');
}

function isAllowedCarMedia(value) {
    if (typeof value !== 'string') return false;
    const url = value.trim();
    if (!url || url.startsWith('data:')) return false;
    if (url.includes('res.cloudinary.com/')) return true;
    if (url.includes('shared/model/')) return true;
    // Existing local model records store the path without the shared/model/
    // prefix in the cars.images column.
    return /^(?:Sedan|Hatchback|SUV|MPV|Truck|Coupe|Convertible|Wagon|Van)\//i.test(url);
}

function hasAllowedCarImages(images) {
    return Array.isArray(images) && images.some(function (image) {
        return isAllowedCarMedia(typeof image === 'string' ? image : (image && image.img));
    });
}

function cloudinaryFolderFromUrl(value) {
    if (typeof value !== 'string' || value.indexOf('res.cloudinary.com/') === -1) return null;
    try {
        var marker = '/image/upload/';
        var path = decodeURIComponent(value.split(marker)[1] || '');
        path = path.replace(/^v\d+\//, '').split('?')[0];
        var sectionMatch = path.match(/\/(exterior|interior|gallery)(?:\/|$)/);
        if (!sectionMatch) return null;
        var folder = path.slice(0, sectionMatch.index).replace(/^\/+|\/+$/g, '');
        return /^model\/[^/]+\/[^/]+/.test(folder) && !folder.includes('..') ? folder : null;
    } catch (_) {
        return null;
    }
}

function addCloudinaryFolderFromValue(target, value) {
    if (typeof value !== 'string') return;
    var direct = value.replace(/^\/+|\/+$/g, '');
    if (/^model\/[^/]+\/[^/]+/.test(direct) && !direct.includes('..')) {
        target.push(direct);
        return;
    }
    var fromUrl = cloudinaryFolderFromUrl(value);
    if (fromUrl) target.push(fromUrl);
}


/**
 * -----------------------------------------------------------------------------
 * 3. GLOBAL DATABASE SERVICE (WeDriveAPI)
 * -----------------------------------------------------------------------------
 * All pages should call these functions instead of using fetch() directly.
 * Inventory, bookings, customers and car media metadata are read from and
 * written to Supabase PostgreSQL. There is no local database fallback.
 */
window.WeDriveAPI = {

    /**
     * Upload an image from an admin edit flow to the same unsigned Cloudinary
     * preset used by Add Car. This accepts a Blob/data URL or a public remote
     * URL; the database receives only the resulting Cloudinary URL.
     */
    uploadImageToCloudinary: async function (source, publicId) {
        var cloudName = 'gwd1bhcx';
        var uploadPreset = 'wedrive_360';
        var endpoint = 'https://api.cloudinary.com/v1_1/' + cloudName + '/image/upload';
        var file = source;
        if (typeof source === 'string' && source.startsWith('data:')) {
            var response = await fetch(source);
            file = await response.blob();
        }
        if (!file) throw new Error('Imej untuk dimuat naik tidak sah.');
        var form = new FormData();
        form.append('file', file);
        form.append('upload_preset', uploadPreset);
        form.append('public_id', publicId);
        var publicIdValue = String(publicId || '').replace(/^\/+|\/+$/g, '');
        var folderSeparator = publicIdValue.lastIndexOf('/');
        if (folderSeparator > 0) {
            form.append('asset_folder', publicIdValue.slice(0, folderSeparator));
        }
        var result = await fetch(endpoint, { method: 'POST', body: form });
        var data = await result.json().catch(function () { return {}; });
        if (!result.ok) {
            var message = data && data.error && data.error.message ? data.error.message : ('HTTP ' + result.status);
            if (/already exists|public.?id/i.test(message)) {
                return 'https://res.cloudinary.com/' + cloudName + '/image/upload/' + publicId.split('/').map(encodeURIComponent).join('/') + '.jpg';
            }
            throw new Error('Cloudinary upload gagal: ' + message);
        }
        return data.secure_url;
    },

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
     * Get the public rental catalogue.
     * Archived, Draft, Maintenance and other non-rentable records must never
     * appear in customer/guest spotlight or browse cards. Archived rows may be
     * retained for booking history, but they are not catalogue inventory.
     */
    getCars: async function () {
        var sb = window.supabaseClient;
        if (!sb) throw new Error('Supabase client is unavailable.');
        var result = await sb.from('cars').select('*');
        if (result.error) throw result.error;
        return (result.data || []).filter(function(c) {
            var status = String(c.status || 'Available').trim().toLowerCase();
            return status === 'available' || status === 'rented';
        });
    },

    /**
     * Get the list of bookings (for admin or customer).
     * Used in: admin.html (Dashboard)
     */
    getBookings: async function () {
        await window.WeDriveAPI._autoCleanupUnpaidBookings();
        var sb = window.supabaseClient;
        if (!sb) throw new Error('Supabase client is unavailable.');
        var result = await sb.from('bookings').select('*');
        if (result.error) throw result.error;
        return result.data || [];
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

                // Core tables (always exist) - Exclude Drafts from active cars
                var coreResults = await Promise.all([
                    sb.from('cars').select('*').neq('status', 'Draft'),
                    sb.from('bookings').select('*'),
                    sb.from('customers').select('*'),
                    sb.from('admins').select('*')
                ]);

                var rawCars = coreResults[0].data || [];
                var cars = rawCars.filter(function(c) {
                    return !c.status || c.status.toLowerCase() !== 'draft';
                });
                var bookings = coreResults[1].data || [];
                var customers = coreResults[2].data || [];
                var admins = coreResults[3].data || [];

                // Optional tables (may not exist yet - handle gracefully)
                var settings = {};
                var reports = {};
                var config = {};
                var marketing = { banners: [], promo_codes: [], seasonal_pricing: [] };

                try { var r = await sb.from('settings').select('*').eq('key', 'main').maybeSingle(); if (r && r.data && r.data.value) settings = r.data.value; } catch(e) {}
                // reports table does not exist; avoid 404 console error
                reports = {};
                try { var r = await sb.from('config').select('*').eq('key', 'main').maybeSingle(); if (r && r.data && r.data.value) config = r.data.value; } catch(e) {}
                try { var r = await sb.from('marketing').select('*').eq('key', 'main').maybeSingle(); if (r && r.data && r.data.value) marketing = r.data.value; } catch(e) {}

                // Calculate live stats from real data
                var today = new Date().toISOString().slice(0, 10);
                var activeRentals = bookings.filter(function(b) {
                    return b.status === 'Active' || (b.status === 'Confirmed' && b.start_date <= today && b.end_date >= today);
                }).length;
                
                var revenueToday = 0;
                bookings.forEach(function(b) {
                    var isPaid = ['Paid', 'Deposit Paid', 'Refund Processed', 'Refunded'].includes(b.payment);
                    if (isPaid && b.created_at && b.created_at.startsWith(today)) {
                        var amt = 0;
                        if (b.payment_type === 'deposit') {
                            amt = (b.deposit_amount || 0);
                        } else {
                            amt = (b.total || 0);
                        }
                        if ((b.refund_status === 'Refunded' || b.payment === 'Refund Processed') && b.refund_amount) {
                            amt -= b.refund_amount;
                        }
                        revenueToday += amt;
                    }
                });

                // New customers this month
                var monthStart = today.slice(0, 7);
                var newCustomersThisMonth = customers.filter(function(c) {
                    return c.joined && c.joined.startsWith(monthStart);
                }).length;

                // Calculate current month's revenue
                var thisMonthStr = today.slice(0, 7);
                var revenueThisMonth = 0;
                bookings.forEach(function(b) {
                    var isPaid = ['Paid', 'Deposit Paid', 'Refund Processed', 'Refunded'].includes(b.payment);
                    if (isPaid && b.created_at && b.created_at.startsWith(thisMonthStr)) {
                        var amt = 0;
                        if (b.payment_type === 'deposit') {
                            amt = (b.deposit_amount || 0);
                        } else {
                            amt = (b.total || 0);
                        }
                        if ((b.refund_status === 'Refunded' || b.payment === 'Refund Processed') && b.refund_amount) {
                            amt -= b.refund_amount;
                        }
                        revenueThisMonth += amt;
                    }
                });

                // Active cars vs total
                var availableCars = cars.filter(function(c) {
                    return c.status === 'Available';
                }).length;

                var stats = {
                    total_vehicles: cars.length,
                    active_rentals: activeRentals,
                    revenue_today: revenueToday,
                    new_customers: newCustomersThisMonth || customers.length,
                    
                    // Dynamic fields for sub-labels
                    available_vehicles: availableCars,
                    revenue_this_month: revenueThisMonth,
                    new_customers_this_month: newCustomersThisMonth,
                    total_customers: customers.length
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
                throw err;
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
    signupUser: async function (username, email, password, phone) {
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
                    options: { 
                        data: { 
                            full_name: username,
                            username: username,
                            phone: phone || '' 
                        } 
                    }
                });

                if (result.error) {
                    return { success: false, error: result.error.message };
                }

                var user = result.data.user;

                // Create customer record in customers table
                await sb.from('customers').insert({
                    customer_id: user.id,
                    name: username,
                    username: username,
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
                var usernameVal = '';
                
                if (!custResult.data) {
                    var meta = user.user_metadata || {};
                    var fullName = meta.full_name || user.email.split('@')[0];
                    // Extract first name/given name as username from Google OAuth metadata
                    usernameVal = meta.given_name || meta.name || user.email.split('@')[0];
                    if (usernameVal.includes(' ')) {
                        usernameVal = usernameVal.split(' ')[0];
                    }
                    
                    await sb.from('customers').insert({
                        customer_id: user.id,
                        name: fullName,
                        username: usernameVal,
                        email: user.email,
                        phone: '',
                        ic: '',
                        license: '',
                        status: 'Active',
                        joined: new Date().toISOString().split('T')[0],
                        auth_uid: user.id,
                        auth_provider: 'google'
                    });
                } else {
                    usernameVal = custResult.data.username || custResult.data.name || user.email.split('@')[0];
                    if (usernameVal.includes(' ')) {
                        usernameVal = usernameVal.split(' ')[0];
                    }
                }

                // Check if admin
                var adminResult = await sb.from('admins').select('*').eq('email', user.email).maybeSingle();
                var role = adminResult.data ? 'admin' : 'customer';

                return { success: true, role: role, user: user, username: usernameVal };
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

            return {};
        } else {
            try {
                var sb = window.supabaseClient;
                var result = await sb.from('config').select('value').eq('key', 'chatbot').maybeSingle();
                if (result.data && result.data.value) {
                    localStorage.setItem('wedrive_chatbot_settings', JSON.stringify(result.data.value));
                    return result.data.value;
                }
                var localSettings = localStorage.getItem('wedrive_chatbot_settings');
                if (localSettings) {
                    return JSON.parse(localSettings);
                }
                return {};
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
                await sb.from('config').upsert({ key: 'chatbot', value: newSettings }, { onConflict: 'key' });
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
                var sb = window.supabaseClient;
                var result = await sb.from('marketing').select('value').eq('key', 'main').maybeSingle();
                if (result.data && result.data.value) return result.data.value;

                var storedStr = localStorage.getItem('wedrive_marketing');
                if (storedStr) {
                    var stored = JSON.parse(storedStr);
                    if (stored && (stored.banners || stored.promo_codes)) return stored;
                }
                return { banners: [], promo_codes: [], seasonal_pricing: [] };
            } catch (err) {
                console.error('[WeDriveAPI] getMarketing error:', err);
                try {
                    var storedStr = localStorage.getItem('wedrive_marketing');
                    if (storedStr) {
                        var stored = JSON.parse(storedStr);
                        if (stored && (stored.banners || stored.promo_codes)) return stored;
                    }
                } catch (e) {}
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
                await sb.from('marketing').upsert({ key: 'main', value: marketingObj }, { onConflict: 'key' });
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
                var targetCarId = (!isNaN(carId) && typeof carId !== 'boolean') ? Number(carId) : carId;
                var result = await sb.from('cars').update({ status: newStatus }).eq('id', targetCarId);
                if (result.error) throw result.error;
                return { success: true };
            } catch (err) {
                console.error('[WeDriveAPI] updateCarStatus error:', err);
                return { success: false, error: err.message };
            }
        }
    },

    /**
     * Permanently delete a car record from inventory.
     * Used in: car-detail.html (Admin Delete Car)
     */
    deleteCar: async function (carId) {
        if (!window.AppConfig.USE_REAL_DB) {
            return { success: true };
        } else {
            try {
                var sb = window.supabaseClient;
                var targetId = (!isNaN(carId) && typeof carId !== 'boolean') ? Number(carId) : carId;
                var result = await sb.from('cars').delete().eq('id', targetId);
                if (result.error) throw result.error;
                return { success: true };
            } catch (err) {
                console.error('[WeDriveAPI] deleteCar error:', err);
                return { success: false, error: err.message };
            }
        }
    },

    /**
     * Create a new car record in the inventory.
     * Used in: add-car.html (Admin New Car Registration)
     * Inserts into Supabase PostgreSQL cars table. LocalStorage is not a
     * second inventory database.
     */
    createCar: async function (carData) {
        var dailyNum = parseFloat(carData.price || carData.dailyPrice || 0);
        var weeklyNum = parseFloat(carData.weeklyPrice || carData.weekly_price);
        var monthlyNum = parseFloat(carData.monthlyPrice || carData.monthly_price);
        weeklyNum = Number.isFinite(weeklyNum) && weeklyNum > 0 ? weeklyNum : null;
        monthlyNum = Number.isFinite(monthlyNum) && monthlyNum > 0 ? monthlyNum : null;
        var rateStr = carData.rate ? String(carData.rate).replace(/\.00/g, '') : (dailyNum > 0 ? ('RM ' + Math.round(dailyNum) + '/hari') : 'RM 0/hari');
        var transStr = carData.transmission || 'Automatic';
        var shortTrans = (transStr.toLowerCase().includes('auto')) ? 'Auto' : 'Manual';
        
        var newRecord = {
            name: carData.name || 'Kenderaan Baharu',
            plate: (carData.plate || '').toUpperCase() || null,
            type: (carData.type || carData.category || 'sedan').toLowerCase(),
            label: carData.label || carData.category || 'Sedan',
            status: carData.status || 'Available',
            rate: rateStr,
            price: dailyNum,
            weekly_price: weeklyNum,
            monthly_price: monthlyNum,
            fuel: carData.fuel || 'Petrol',
            transmission: transStr,
            trans: carData.trans || shortTrans,
            seats: parseInt(carData.seats, 10) || 5,
            year: parseInt(carData.year, 10) || new Date().getFullYear(),
            color: carData.color || 'Putih',
            rating: typeof carData.rating === 'number' ? carData.rating : 5.0,
            reviews: typeof carData.reviews === 'number' ? carData.reviews : 0,
            ai: typeof carData.ai === 'string' && carData.ai.trim() ? carData.ai.trim() : null,
            has_360: Boolean(carData.has_360),
            exterior_360: carData.exterior_360 || null,
            interior_360: carData.interior_360 || null,
            exterior_frames: Array.isArray(carData.exterior_frames) ? carData.exterior_frames : null,
            images: (carData.images && carData.images.length) ? carData.images : []
        };

        var hasImages = hasAllowedCarImages(newRecord.images);
        var has360 = Array.isArray(newRecord.exterior_frames) && newRecord.exterior_frames.length > 0;
        if (!hasImages && !has360) {
            return { data: null, error: new Error('Kereta mesti mempunyai sekurang-kurangnya satu gambar atau satu 360 view.') };
        }

        var sb = window.supabaseClient;
        if (!sb) return { data: null, error: new Error('Supabase client is unavailable.') };
        try {
            var result = await sb.from('cars').insert([newRecord]).select();
            if (result.error) throw result.error;
            var savedCar = (result.data && result.data.length > 0) ? result.data[0] : newRecord;
            return { data: savedCar, error: null };
        } catch (err) {
            console.error('[WeDriveAPI] Supabase createCar error:', err);
            return { data: null, error: err };
        }
    },

    /**
     * Save or update a car draft in Supabase.
     */
    saveCarDraft: async function (draftData) {
        var dailyNum = parseFloat(draftData.dailyPrice || draftData.price || 0);
        var weeklyNum = parseFloat(draftData.weeklyPrice || draftData.weekly_price);
        var monthlyNum = parseFloat(draftData.monthlyPrice || draftData.monthly_price);
        weeklyNum = Number.isFinite(weeklyNum) && weeklyNum > 0 ? weeklyNum : null;
        monthlyNum = Number.isFinite(monthlyNum) && monthlyNum > 0 ? monthlyNum : null;
        var rateStr = draftData.rate ? String(draftData.rate).replace(/\.00/g, '') : (dailyNum > 0 ? ('RM ' + Math.round(dailyNum) + '/hari') : 'RM 0/hari');
        var transStr = draftData.transmission || 'Automatic';
        var shortTrans = (transStr.toLowerCase().includes('auto')) ? 'Auto' : 'Manual';

        var draftImages = Array.isArray(draftData.images) ? draftData.images : [];
        var draftFrames = Array.isArray(draftData.exterior_frames) ? draftData.exterior_frames : [];
        var record = {
            name: draftData.name || [draftData.year, draftData.brand, draftData.model, draftData.variant].filter(Boolean).join(' ') || 'Draf Kenderaan Baharu',
            plate: (draftData.plate || '').toUpperCase() || null,
            type: (draftData.category || draftData.type || 'sedan').toLowerCase(),
            label: draftData.category || draftData.type || 'Sedan',
            status: 'Draft',
            rate: rateStr,
            price: dailyNum,
            weekly_price: weeklyNum,
            monthly_price: monthlyNum,
            fuel: draftData.fuel || 'Petrol',
            transmission: transStr,
            trans: draftData.trans || shortTrans,
            seats: parseInt(draftData.seats, 10) || 5,
            year: parseInt(draftData.year, 10) || new Date().getFullYear(),
            color: draftData.color || 'Putih',
            rating: 5.0,
            reviews: 0,
            ai: typeof (draftData.ai_tagline || draftData.ai) === 'string' && (draftData.ai_tagline || draftData.ai).trim()
                ? (draftData.ai_tagline || draftData.ai).trim()
                : null,
            images: draftImages.filter(function (image) {
                return isAllowedCarMedia(typeof image === 'string' ? image : (image && image.img));
            }),
            has_360: draftFrames.some(function (url) { return isAllowedCarMedia(url); }),
            exterior_360: draftFrames.some(function (url) { return isAllowedCarMedia(url); }) ? (draftData.exterior_360 || null) : null,
            interior_360: draftData.interior_360 || null,
            exterior_frames: draftFrames.filter(isAllowedCarMedia)
        };

        var sb = window.supabaseClient;
        if (!sb) return { data: null, error: new Error('Supabase client is unavailable.') };
        try {
            if (draftData.supabase_draft_id && Number.isInteger(Number(draftData.supabase_draft_id))) {
                var updateRes = await sb.from('cars').update(record).eq('id', Number(draftData.supabase_draft_id)).select();
                if (updateRes.error) throw updateRes.error;
                if (updateRes.data && updateRes.data.length > 0) {
                    return { data: updateRes.data[0], error: null };
                }
            }
            var insertRes = await sb.from('cars').insert([record]).select();
            if (insertRes.error) throw insertRes.error;
            return { data: insertRes.data ? insertRes.data[0] : record, error: null };
        } catch (err) {
            console.error('[WeDriveAPI] saveCarDraft Supabase error:', err);
            return { data: null, error: err };
        }
    },

    /**
     * Return recent meaningful drafts for the Admin resume dialog.
     * Empty test rows are filtered by the caller so an old blank draft cannot
     * hide the latest vehicle draft.
     */
    getLatestCarDrafts: async function (limit) {
        var sb = window.supabaseClient;
        if (!sb) return { data: [], error: new Error('Supabase client is unavailable.') };
        try {
            var result = await sb.from('cars')
                .select('*')
                .eq('status', 'Draft')
                .order('id', { ascending: false })
                .limit(Number(limit) || 50);
            if (result.error) throw result.error;
            return { data: result.data || [], error: null };
        } catch (err) {
            console.error('[WeDriveAPI] getLatestCarDrafts error:', err);
            return { data: [], error: err };
        }
    },

    /**
     * Delete a draft and all Cloudinary assets belonging to its model folder.
     * Cloudinary Admin credentials stay inside the cloudinary-admin Edge
     * Function; the browser only sends validated folder names.
     */
    deleteCarDraft: async function (draftId, draftData) {
        var sb = window.supabaseClient;
        var targetId = Number(draftId);
        if (!sb) return { success: false, error: new Error('Supabase client is unavailable.') };
        if (!Number.isInteger(targetId) || targetId <= 0) {
            return { success: false, error: new Error('ID draft tidak sah.') };
        }

        try {
            var carResult = await sb.from('cars')
                .select('id,status,exterior_360,interior_360,exterior_frames,images')
                .eq('id', targetId)
                .maybeSingle();
            if (carResult.error) throw carResult.error;
            if (!carResult.data) return { success: true, deleted: false, reason: 'not_found' };
            if (String(carResult.data.status || '').toLowerCase() !== 'draft') {
                throw new Error('Hanya rekod berstatus Draft boleh dipadam melalui dialog ini.');
            }

            var assetResult = await sb.from('car_visual_assets')
                .select('id,car_id,cloudinary_folder')
                .eq('car_id', targetId);
            if (assetResult.error) throw assetResult.error;

            var folders = [];
            (assetResult.data || []).forEach(function (asset) {
                addCloudinaryFolderFromValue(folders, asset && asset.cloudinary_folder);
            });
            var supplied = draftData || {};
            addCloudinaryFolderFromValue(folders, supplied.cloudinary_folder);

            function addManifestFolder(value) {
                if (!value) return;
                try {
                    var parsed = typeof value === 'string' ? JSON.parse(value) : value;
                    if (parsed && typeof parsed.folder === 'string') {
                        addCloudinaryFolderFromValue(folders, parsed.folder);
                    }
                } catch (_) {}
            }
            addManifestFolder(carResult.data.exterior_360);
            addManifestFolder(carResult.data.interior_360);
            addManifestFolder(supplied.exterior_360);
            addManifestFolder(supplied.interior_360);

            var allMedia = []
                .concat(Array.isArray(carResult.data.exterior_frames) ? carResult.data.exterior_frames : [])
                .concat(Array.isArray(carResult.data.images) ? carResult.data.images : [])
                .concat(Array.isArray(supplied.exterior_frames) ? supplied.exterior_frames : [])
                .concat(Array.isArray(supplied.cloudinary_exterior_frames) ? supplied.cloudinary_exterior_frames : [])
                .concat(Array.isArray(supplied.images) ? supplied.images : [])
                .concat(Array.isArray(supplied.cloudinary_gallery) ? supplied.cloudinary_gallery : []);
            allMedia.forEach(function (media) {
                addCloudinaryFolderFromValue(folders, typeof media === 'string' ? media : (media && (media.img || media.url || media.cloudinary_url)));
            });
            folders = Array.from(new Set(folders));

            // Never remove a folder that another visual-asset record still uses.
            if (folders.length) {
                var otherAssets = await sb.from('car_visual_assets')
                    .select('car_id,cloudinary_folder')
                    .in('cloudinary_folder', folders)
                    .neq('car_id', targetId);
                if (otherAssets.error) throw otherAssets.error;
                var protectedFolders = new Set((otherAssets.data || []).map(function (row) {
                    return row.cloudinary_folder;
                }));
                folders = folders.filter(function (folder) { return !protectedFolders.has(folder); });
            }

            if (folders.length) {
                var cloudinaryResult = await sb.functions.invoke('cloudinary-admin', {
                    body: { action: 'delete_assets', folders: folders }
                });
                if (cloudinaryResult.error) throw cloudinaryResult.error;
                if (!cloudinaryResult.data || cloudinaryResult.data.ok !== true) {
                    throw new Error((cloudinaryResult.data && cloudinaryResult.data.error) || 'Cloudinary cleanup gagal.');
                }
            }

            var deleteAssetsResult = await sb.from('car_visual_assets').delete().eq('car_id', targetId);
            if (deleteAssetsResult.error) throw deleteAssetsResult.error;
            var deleteCarResult = await sb.from('cars').delete().eq('id', targetId).eq('status', 'Draft');
            if (deleteCarResult.error) throw deleteCarResult.error;
            return { success: true, deleted: true, folders: folders };
        } catch (err) {
            console.error('[WeDriveAPI] deleteCarDraft error:', err);
            return { success: false, error: err };
        }
    },

    /**
     * Save the Cloudinary manifest for a local/shared model asset.
     * The image bytes remain in Cloudinary; Supabase stores metadata and URLs.
     */
    saveCarVisualAsset: async function (assetData) {
        var record = {
            car_id: assetData.car_id ? Number(assetData.car_id) : null,
            model_key: assetData.model_key,
            model_name: assetData.model_name,
            category: assetData.category,
            vin: assetData.vin || null,
            local_model_path: assetData.local_model_path,
            source_viewer_url: assetData.source_viewer_url || null,
            source_listing_url: assetData.source_listing_url || null,
            cdn_prefix: assetData.cdn_prefix || null,
            cloudinary_folder: assetData.cloudinary_folder,
            cloudinary_thumbnail_url: assetData.cloudinary_thumbnail_url || null,
            cloudinary_gallery: Array.isArray(assetData.cloudinary_gallery) ? assetData.cloudinary_gallery : [],
            cloudinary_exterior_frames: Array.isArray(assetData.cloudinary_exterior_frames) ? assetData.cloudinary_exterior_frames : [],
            cloudinary_interior_faces: assetData.cloudinary_interior_faces || {},
            frame_count: Number(assetData.frame_count) || 0,
            frame_pattern: assetData.frame_pattern || 'exterior/full-res/frame-{padded}.jpg',
            status: assetData.status || 'pending',
            error_message: assetData.error_message || null
        };

        try {
            var sb = window.supabaseClient;
            if (!sb) throw new Error('Supabase client is unavailable.');
            var result = await sb.from('car_visual_assets')
                .upsert([record], { onConflict: 'model_key' })
                .select()
                .single();
            if (result.error) throw result.error;
            return { data: result.data, error: null };
        } catch (err) {
            console.error('[WeDriveAPI] saveCarVisualAsset error:', err);
            return { data: null, error: err };
        }
    },

    /**
     * Publish an existing draft car or create a new active car.
     */
    publishCarDraft: async function (draftId, finalData) {
        var dailyNum = parseFloat(finalData.dailyPrice || finalData.price || 0);
        var weeklyNum = parseFloat(finalData.weeklyPrice || finalData.weekly_price);
        var monthlyNum = parseFloat(finalData.monthlyPrice || finalData.monthly_price);
        weeklyNum = Number.isFinite(weeklyNum) && weeklyNum > 0 ? weeklyNum : null;
        monthlyNum = Number.isFinite(monthlyNum) && monthlyNum > 0 ? monthlyNum : null;
        var rateStr = finalData.rate ? String(finalData.rate).replace(/\.00/g, '') : (dailyNum > 0 ? ('RM ' + Math.round(dailyNum) + '/hari') : 'RM 0/hari');
        var transStr = finalData.transmission || 'Automatic';
        var shortTrans = (transStr.toLowerCase().includes('auto')) ? 'Auto' : 'Manual';

        var updatePayload = {
            name: finalData.name || [finalData.year, finalData.brand, finalData.model, finalData.variant].filter(Boolean).join(' ') || 'Kenderaan Baharu',
            plate: (finalData.plate || '').toUpperCase() || null,
            type: (finalData.category || finalData.type || 'sedan').toLowerCase(),
            label: finalData.category || finalData.type || 'Sedan',
            status: 'Available',
            rate: rateStr,
            price: dailyNum,
            weekly_price: weeklyNum,
            monthly_price: monthlyNum,
            fuel: finalData.fuel || 'Petrol',
            transmission: transStr,
            trans: finalData.trans || shortTrans,
            seats: parseInt(finalData.seats, 10) || 5,
            year: parseInt(finalData.year, 10) || new Date().getFullYear(),
            color: finalData.color || 'Putih',
            rating: 5.0,
            reviews: 0,
            ai: finalData.engine || finalData.ai || 'Standard',
            images: Array.isArray(finalData.images) ? finalData.images : [],
            has_360: Boolean(finalData.has_360 || finalData.has360),
            exterior_360: finalData.exterior_360 || null,
            interior_360: finalData.interior_360 || null,
            exterior_frames: Array.isArray(finalData.exterior_frames) ? finalData.exterior_frames : null
        };

        if (!hasAllowedCarImages(updatePayload.images) && !(Array.isArray(updatePayload.exterior_frames) && updatePayload.exterior_frames.length > 0)) {
            return { data: null, error: new Error('Kereta mesti mempunyai sekurang-kurangnya satu gambar Cloudinary/shared model atau satu 360 view.') };
        }

        var sb = window.supabaseClient;
        if (sb) {
            try {
                if (draftId && Number.isInteger(Number(draftId))) {
                    var res = await sb.from('cars').update(updatePayload).eq('id', Number(draftId)).select();
                    if (res.error) throw res.error;
                    var pubCar = res.data ? res.data[0] : updatePayload;
                    return { data: pubCar, error: null };
                } else {
                    return await window.WeDriveAPI.createCar(updatePayload);
                }
            } catch (err) {
                console.error('[WeDriveAPI] publishCarDraft error:', err);
                return { data: null, error: err };
            }
        }
        return { data: null, error: new Error('Supabase client is unavailable.') };
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

    getBookedDatesForCar: async function (carId) {
        await window.WeDriveAPI._autoCleanupUnpaidBookings();
        
        function addOneDay(dateStr) {
            var d = new Date(dateStr + 'T00:00:00');
            d.setDate(d.getDate() + 1);
            var y = d.getFullYear();
            var m = String(d.getMonth() + 1).padStart(2, '0');
            var day = String(d.getDate()).padStart(2, '0');
            return y + '-' + m + '-' + day;
        }

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
                        end_date: addOneDay(endDt) // Block 1 day after return for inspection
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
                
                var mapped = (result.data || []).map(function(r) {
                    return {
                        start_date: r.start_date,
                        end_date: addOneDay(r.end_date) // Block 1 day after return for inspection
                    };
                });
                return mapped;
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
                    .select('*, date_of_birth, address')
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
    updateCustomerProfile: async function (authUid, data) {
        if (!window.AppConfig.USE_REAL_DB) {
            return { success: true };
        } else {
            try {
                var sb = window.supabaseClient;
                if (!sb) return { success: false, error: 'Database not connected' };
                
                var updateData = {};
                
                // Fields we can update
                if (data.hasOwnProperty('ic')) updateData.ic = data.ic;
                if (data.hasOwnProperty('license')) updateData.license = data.license;
                if (data.hasOwnProperty('phone')) updateData.phone = data.phone;
                if (data.hasOwnProperty('verification_status')) updateData.verification_status = data.verification_status;
                if (data.hasOwnProperty('rejection_reason')) updateData.rejection_reason = data.rejection_reason;
                if (data.hasOwnProperty('name')) updateData.name = data.name;
                if (data.hasOwnProperty('username')) updateData.username = data.username;
                if (data.hasOwnProperty('ic_document_url')) updateData.ic_document_url = data.ic_document_url;
                if (data.hasOwnProperty('ic_back_document_url')) updateData.ic_back_document_url = data.ic_back_document_url;
                if (data.hasOwnProperty('license_document_url')) updateData.license_document_url = data.license_document_url;
                if (data.hasOwnProperty('license_back_document_url')) updateData.license_back_document_url = data.license_back_document_url;
                if (data.hasOwnProperty('preferences')) updateData.preferences = data.preferences;
                if (data.hasOwnProperty('dob')) updateData.dob = data.dob;
                if (data.hasOwnProperty('date_of_birth')) updateData.date_of_birth = data.date_of_birth;
                if (data.hasOwnProperty('street')) updateData.street = data.street;
                if (data.hasOwnProperty('city')) updateData.city = data.city;
                if (data.hasOwnProperty('zip')) updateData.zip = data.zip;
                if (data.hasOwnProperty('address')) updateData.address = data.address;
                if (data.hasOwnProperty('license_expiry')) updateData.license_expiry = data.license_expiry;
                if (data.hasOwnProperty('payment_methods')) updateData.payment_methods = data.payment_methods;

                // For completing profile, if these are provided, set verification to pending
                if ((data.hasOwnProperty('ic') || data.hasOwnProperty('license') || data.hasOwnProperty('ic_document_url') || data.hasOwnProperty('license_document_url')) && !data.hasOwnProperty('verification_status')) {
                    updateData.verification_status = 'Pending';
                    updateData.rejection_reason = null;
                }

                var result = await sb.from('customers').update(updateData).eq('auth_uid', authUid);
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
            var result = await sb.from('customers').select('ic, license, phone, verification_status, rejection_reason, date_of_birth, address').eq('auth_uid', authUid).maybeSingle();
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
                phone: d.phone || null,
                date_of_birth: d.date_of_birth || null,
                address: d.address || null
            };
        } catch (err) {
            console.error('[WeDriveAPI] checkProfileComplete error:', err);
            return { complete: false, status: null };
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
            var targetId = (!isNaN(customerId) && typeof customerId !== 'boolean') ? Number(customerId) : customerId;
            var result = await sb.from('customers').update(updateData).eq('id', targetId);
            if (result.error) throw result.error;
            return { success: true };
        } catch (err) {
            console.error('[WeDriveAPI] verifyCustomer error:', err);
            return { success: false, error: err.message };
        }
    },

    /**
     * Invoke the protected AI automation Edge Function.
     * The Supabase client automatically attaches the current admin session.
     */
    invokeAiAutomation: async function (action, payload) {
        var sb = window.supabaseClient;
        if (!sb) throw new Error('Supabase client is unavailable.');
        var body = Object.assign({}, payload || {}, { action: action });
        var result = await sb.functions.invoke('ai-automation', { body: body });
        if (result.error) throw result.error;
        if (result.data && result.data.success === false) {
            throw new Error(result.data.error || 'AI automation gagal.');
        }
        return result.data;
    },

    /** Generate and optionally send an AI event promotion to registered customers. */
    promoteEventWithAi: async function (event, send) {
        return this.invokeAiAutomation('promote_event', { event: event, send: send === true });
    },

    /** Generate a reviewed-first event opportunity calendar for the selected year. */
    generateEventPlanWithAi: async function (year, region, focus) {
        return this.invokeAiAutomation('generate_event_plan', {
            year: year,
            region: region,
            focus: focus
        });
    },

    /** Run the 3-day and 1-day booking reminder worker. */
    runAiBookingReminders: async function () {
        return this.invokeAiAutomation('run_booking_reminders');
    },

    /** Review one IC, licence or form image with the configured vision model. */
    verifyDocumentWithAi: async function (customerId, documentType, documentUrl) {
        return this.invokeAiAutomation('verify_document', {
            customer_id: customerId,
            document_type: documentType,
            document_url: documentUrl
        });
    },

    /** Check the readiness of the event, lifecycle and document AI slots. */
    getAiAutomationHealth: async function () {
        return this.invokeAiAutomation('health');
    },

    /**
     * Check if a username is already taken.
     * Returns { success: true, available: true } if available,
     * or { success: true, available: false } if taken.
     */
    checkUsernameUnique: async function(username, authUid) {
        if (!username || username.trim().length < 3) {
            return { success: true, available: true };
        }
        if (!window.AppConfig.USE_REAL_DB) {
            var data = await _loadDummyData();
            if (data && data.customers) {
                var normalized = username.toLowerCase().trim();
                for (var i = 0; i < data.customers.length; i++) {
                    var c = data.customers[i];
                    if (c.auth_uid !== authUid && c.username && c.username.toLowerCase().trim() === normalized) {
                        return { success: true, available: false };
                    }
                }
            }
            return { success: true, available: true };
        } else {
            try {
                var sb = window.supabaseClient;
                if (!sb) return { success: false, error: 'Database not connected' };
                
                var normalized = username.toLowerCase().trim();
                var result = await sb.from('customers')
                    .select('auth_uid, username')
                    .ilike('username', normalized);
                
                if (result.error) throw result.error;
                
                if (result.data && result.data.length > 0) {
                    for (var j = 0; j < result.data.length; j++) {
                        if (result.data[j].auth_uid !== authUid) {
                            return { success: true, available: false };
                        }
                    }
                }
                return { success: true, available: true };
            } catch (err) {
                console.error('[WeDriveAPI] checkUsernameUnique error:', err);
                return { success: false, error: err.message };
            }
        }
    }
};
