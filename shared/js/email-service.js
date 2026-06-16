/**
 * WeDRIVE - Email Notification Service
 * shared/js/email-service.js
 *
 * Sends emails via Supabase Edge Function + Resend SMTP.
 * Emails are sent from noreply@wedrive.website
 */

(function () {
  'use strict';

  // ── Public API ──
  window.WeDriveEmail = {

    /**
     * Send verification status email to customer.
     * @param {string} customerEmail
     * @param {string} customerName
     * @param {string} status - 'approved' or 'rejected'
     * @param {string} reason - rejection reason (optional)
     */
    sendVerificationEmail: async function (customerEmail, customerName, status, reason) {
      try {
        var supabaseUrl = window.SUPABASE_URL;
        if (!supabaseUrl) {
          console.warn('[WeDRIVE Email] Supabase URL not available');
          return { success: false, error: 'Supabase not configured' };
        }

        // Get auth token for Edge Function authorization
        var session = null;
        if (window.supabaseClient) {
          var authResult = await window.supabaseClient.auth.getSession();
          session = authResult.data.session;
        }

        var headers = {
          'Content-Type': 'application/json',
          'apikey': window.supabaseClient ? window.supabaseClient.supabaseKey : ''
        };

        // Add auth token if available
        if (session && session.access_token) {
          headers['Authorization'] = 'Bearer ' + session.access_token;
        }

        var response = await fetch(supabaseUrl + '/functions/v1/send-email', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            to_email: customerEmail,
            customer_name: customerName || 'Customer',
            status: status,
            rejection_reason: reason || ''
          })
        });

        var data = await response.json();

        if (data.success) {
          console.log('[WeDRIVE Email] Sent ' + status + ' email to ' + customerEmail);
          return { success: true };
        } else {
          console.error('[WeDRIVE Email] Error:', data.error);
          return { success: false, error: data.error };
        }

      } catch (err) {
        console.error('[WeDRIVE Email] Failed to send email:', err);
        return { success: false, error: err.message || 'Email send failed' };
      }
    }

  };

})();
