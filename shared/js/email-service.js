/**
 * WeDRIVE - Email Notification Service
 * shared/js/email-service.js
 *
 * Sends emails via Supabase Edge Function + Resend SMTP.
 * Emails are sent from noreply@wedrive.website
 */

(function () {
  'use strict';

  async function _callEdge(payload) {
    try {
      var supabaseUrl = window.SUPABASE_URL;
      if (!supabaseUrl) { console.warn('[WeDRIVE Email] Supabase URL not available'); return { success: false }; }
      var session = null;
      if (window.supabaseClient) {
        var authResult = await window.supabaseClient.auth.getSession();
        session = authResult && authResult.data && authResult.data.session;
      }
      var headers = { 'Content-Type': 'application/json' };
      if (session && session.access_token) { headers['Authorization'] = 'Bearer ' + session.access_token; }
      var response = await fetch(supabaseUrl + '/functions/v1/send-email', {
        method: 'POST', headers: headers, body: JSON.stringify(payload)
      });
      var data = await response.json();
      if (data.success) { console.log('[WeDRIVE Email] Sent "' + payload.status + '" to', payload.to_email); return { success: true }; }
      console.error('[WeDRIVE Email] Error:', data.error);
      return { success: false, error: data.error };
    } catch (err) {
      console.error('[WeDRIVE Email] Failed:', err);
      return { success: false, error: err.message };
    }
  }

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
      return _callEdge({
        to_email: customerEmail,
        customer_name: customerName || 'Customer',
        status: status,
        rejection_reason: reason || ''
      });
    },

    /**
     * Send booking confirmation receipt (with payment type info).
     * @param {object} bookingData - the full booking object saved to DB
     */
    sendBookingConfirmation: async function (bookingData) {
      if (!bookingData || !bookingData.email) return { success: false };
      return _callEdge({
        to_email: bookingData.email,
        customer_name: bookingData.customer,
        status: 'booking_confirmed',
        booking: bookingData
      });
    },

    /**
     * Send reminder email (1 day before pickup).
     * @param {string} toEmail
     * @param {string} customerName
     * @param {object} bookingData
     */
    sendBookingReminder: async function (toEmail, customerName, bookingData) {
      if (!toEmail) return { success: false };
      return _callEdge({
        to_email: toEmail,
        customer_name: customerName,
        status: 'booking_reminder',
        booking: bookingData
      });
    },

    /**
     * Send refund processed notification.
     * @param {string} toEmail
     * @param {string} customerName
     * @param {object} bookingData - must include refund_amount, payment_type
     */
    sendRefundNotification: async function (toEmail, customerName, bookingData) {
      if (!toEmail) return { success: false };
      return _callEdge({
        to_email: toEmail,
        customer_name: customerName,
        status: 'refund_processed',
        booking: bookingData
      });
    }

  };

})();
