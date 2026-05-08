/**
 * WeDRIVE - Auth Guard
 * shared/js/auth-guard.js
 * 
 * Protects pages from unauthorized access. Include this file in the <head> of protected pages.
 * 
 * NOTE (Rule 13): Redirects are DISABLED during development.
 * When all pages are completed and tested, re-enable the redirect logic
 * by setting AUTH_GUARD_ACTIVE = true below.
 */

(function() {
    // ── DEVELOPMENT FLAG ──────────────────────────────────────────────────
    // Set to true when all pages are ready and login flow is fully tested
    const AUTH_GUARD_ACTIVE = false;
    // ──────────────────────────────────────────────────────────────────────

    if (!AUTH_GUARD_ACTIVE) {
        console.info('Auth Guard: DISABLED (development mode). Set AUTH_GUARD_ACTIVE = true when ready.');
        return;
    }

    // Determine the required role from a data attribute on the script tag, if any
    // e.g. <script src="../../shared/js/auth-guard.js" data-role="admin"></script>
    const currentScript = document.currentScript;
    const requiredRole = currentScript ? currentScript.getAttribute('data-role') : null;

    // Retrieve session from localStorage
    const sessionData = localStorage.getItem('wedrive_session');
    
    // Function to calculate depth based on current path to redirect to login correctly
    function getLoginPath() {
        const isRoot = !window.location.pathname.includes('/pages/');
        if (isRoot) return 'index.html';
        return '../../index.html';
    }

    if (!sessionData) {
        // No session found, redirect to login
        console.warn('Auth Guard: No session found. Redirecting to login.');
        window.location.replace(getLoginPath());
        return;
    }

    try {
        const session = JSON.parse(sessionData);

        // Check if role matches required role
        if (requiredRole && session.role !== requiredRole) {
            console.warn(`Auth Guard: Unauthorized. Requires role '${requiredRole}'. Redirecting.`);
            if (session.role === 'customer') {
                // Customer trying to access Admin page -> redirect to login
                window.location.replace(window.location.pathname.includes('/pages/') ? '../../index.html' : 'index.html');
            } else {
                window.location.replace(getLoginPath());
            }
            return;
        }

        // Setup global logout function helper
        window.logoutUser = function() {
            localStorage.removeItem('wedrive_session');
            window.location.href = getLoginPath();
        };

    } catch (e) {
        console.error('Auth Guard: Session data corrupted. Redirecting to login.');
        localStorage.removeItem('wedrive_session');
        window.location.replace(getLoginPath());
    }
})();
