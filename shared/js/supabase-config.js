/**
 * WeDRIVE - Supabase Configuration
 * shared/js/supabase-config.js
 *
 * Initializes Supabase client for Auth + Database.
 * Load AFTER supabase CDN script, BEFORE api.js
 */

(function () {
  // Supabase project configuration
  var SUPABASE_URL = 'https://nigyovaqffwyinovivls.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pZ3lvdmFxZmZ3eWlub3ZpdmxzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczOTQxMzAsImV4cCI6MjA5Mjk3MDEzMH0.Z-GaLri3wn9Xx19vY8Jv9XmQ1jaKPpTTO3qmvw74N6g';

  // Initialize Supabase client
  var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // Expose globally for api.js and other scripts
  window.supabaseClient = supabase;
  window.SUPABASE_URL = SUPABASE_URL;

  console.log('[WeDRIVE] Supabase initialized - Project: WeDRIVE (Singapore)');
})();
