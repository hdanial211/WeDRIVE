/**
 * WeDRIVE - Email Notification Service
 * shared/js/email-service.js
 *
 * Uses EmailJS (https://www.emailjs.com) to send SMTP emails
 * directly from the browser without a backend server.
 *
 * SETUP:
 * 1. Create account at emailjs.com
 * 2. Add email service (Gmail SMTP)
 * 3. Create templates (verification_approved, verification_rejected)
 * 4. Copy Service ID, Template IDs, and Public Key below
 */

(function () {
  'use strict';

  // ── EmailJS Configuration ──
  // Replace these with your actual EmailJS credentials
  var EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
  var EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
  var EMAILJS_TEMPLATE_APPROVED = 'verification_approved';
  var EMAILJS_TEMPLATE_REJECTED = 'verification_rejected';

  // Check if config file exists with real credentials
  if (window.EMAILJS_CONFIG) {
    EMAILJS_PUBLIC_KEY = window.EMAILJS_CONFIG.publicKey || EMAILJS_PUBLIC_KEY;
    EMAILJS_SERVICE_ID = window.EMAILJS_CONFIG.serviceId || EMAILJS_SERVICE_ID;
    EMAILJS_TEMPLATE_APPROVED = window.EMAILJS_CONFIG.templateApproved || EMAILJS_TEMPLATE_APPROVED;
    EMAILJS_TEMPLATE_REJECTED = window.EMAILJS_CONFIG.templateRejected || EMAILJS_TEMPLATE_REJECTED;
  }

  // Load EmailJS SDK dynamically
  var sdkLoaded = false;
  function loadEmailJSSDK() {
    return new Promise(function (resolve) {
      if (sdkLoaded || (window.emailjs && window.emailjs.send)) {
        sdkLoaded = true;
        resolve();
        return;
      }
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
      script.onload = function () {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
        sdkLoaded = true;
        console.log('[WeDRIVE Email] EmailJS SDK loaded');
        resolve();
      };
      script.onerror = function () {
        console.error('[WeDRIVE Email] Failed to load EmailJS SDK');
        resolve();
      };
      document.head.appendChild(script);
    });
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
      try {
        await loadEmailJSSDK();
        if (!window.emailjs || !window.emailjs.send) {
          console.warn('[WeDRIVE Email] EmailJS not available');
          return { success: false, error: 'Email service not configured' };
        }

        var templateId = status === 'approved' ? EMAILJS_TEMPLATE_APPROVED : EMAILJS_TEMPLATE_REJECTED;
        var loginUrl = window.location.origin + '/account/pages/login/login.html';
        var profileUrl = window.location.origin + '/account/pages/complete-profile/complete-profile.html';

        var templateParams = {
          to_email: customerEmail,
          customer_name: customerName || 'Customer',
          login_url: loginUrl,
          profile_url: profileUrl,
          rejection_reason: reason || 'Documents could not be verified. Please ensure your IC and Driving License are clear and valid.'
        };

        var result = await window.emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams);
        console.log('[WeDRIVE Email] Sent ' + status + ' email to ' + customerEmail, result);
        return { success: true };
      } catch (err) {
        console.error('[WeDRIVE Email] Failed to send email:', err);
        return { success: false, error: err.text || err.message || 'Email send failed' };
      }
    }

  };

})();
