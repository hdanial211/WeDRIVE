/**
 * WeDRIVE - Admin Session Inactivity Timeout Guardian
 * admin/js/admin-idle-timeout.js
 * 
 * Enforces security by monitoring admin activity.
 * 1. Default Idle Limit: 10 Minutes (600,000 ms)
 * 2. Warning Countdown: 1 Minute (60 seconds)
 * 3. Auto-Logout & Session Wipe on Expiry
 */

(function () {
  'use strict';

  // ─── CONFIGURATION ────────────────────────────────────────────────────────
  var IDLE_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes of complete inactivity
  var WARNING_DURATION_SEC = 60;        // 1 minute countdown warning
  var THROTTLE_MS = 1000;               // Throttle activity events

  var idleTimer = null;
  var countdownInterval = null;
  var remainingSeconds = WARNING_DURATION_SEC;
  var lastActivityTime = Date.now();
  var isWarningVisible = false;
  var modalEl = null;

  // ─── RESOLVE BASE PATH ───────────────────────────────────────────────────
  function getBasePath() {
    var link = document.getElementById('theme-link');
    if (link) {
      return link.getAttribute('href').replace(/shared\/css\/.*$/, '');
    }
    var parts = window.location.pathname.split('/').filter(Boolean);
    var depth = parts.length > 0 ? parts.length - 1 : 0;
    return depth === 0 ? '' : '../'.repeat(depth);
  }

  // ─── BILINGUAL TEXT HELPER ────────────────────────────────────────────────
  function getTexts() {
    var lang = localStorage.getItem('wedrive_lang') || localStorage.getItem('wedrive-lang') || 'en';
    var isMs = (lang === 'ms');

    return {
      title: isMs ? 'Amaran Ketidakaktifan Sesi' : 'Session Inactivity Warning',
      desc: isMs
        ? 'Anda tidak melakukan sebarang aktiviti selama 10 minit. Atas faktor keselamatan data, sesi Pentadbir anda akan tamat secara automatik dalam masa:'
        : 'You have been inactive for 10 minutes. For data security purposes, your Admin session will automatically expire in:',
      secondsText: isMs ? 'saat lagi' : 'seconds remaining',
      stayBtn: isMs ? 'Kekalkan Sesi' : 'Stay Logged In',
      logoutBtn: isMs ? 'Log Keluar Sekarang' : 'Log Out Now'
    };
  }

  // ─── CREATE MODAL DOM ────────────────────────────────────────────────────
  function createModalDOM() {
    if (document.getElementById('admin-session-timeout-modal')) {
      return document.getElementById('admin-session-timeout-modal');
    }

    var texts = getTexts();
    var overlay = document.createElement('div');
    overlay.id = 'admin-session-timeout-modal';
    overlay.className = 'admin-timeout-modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'admin-timeout-title');

    overlay.innerHTML = [
      '<div class="admin-timeout-modal-card">',
      '  <div class="admin-timeout-icon-wrap">',
      '    <span class="material-icons-round admin-timeout-icon">hourglass_top</span>',
      '  </div>',
      '  <h3 id="admin-timeout-title" class="admin-timeout-title">' + texts.title + '</h3>',
      '  <p id="admin-timeout-desc" class="admin-timeout-desc">' + texts.desc + '</p>',
      '  <div class="admin-timeout-timer-badge">',
      '    <span class="material-icons-round admin-timeout-badge-icon">timer</span>',
      '    <span id="admin-timeout-countdown" class="admin-timeout-countdown-digits">01:00</span>',
      '  </div>',
      '  <div class="admin-timeout-actions">',
      '    <button type="button" id="admin-timeout-stay-btn" class="admin-timeout-btn-primary">',
      '      <span class="material-icons-round">lock_open</span>',
      '      <span class="btn-text">' + texts.stayBtn + '</span>',
      '    </button>',
      '    <button type="button" id="admin-timeout-logout-btn" class="admin-timeout-btn-secondary">',
      '      <span class="material-icons-round">logout</span>',
      '      <span class="btn-text">' + texts.logoutBtn + '</span>',
      '    </button>',
      '  </div>',
      '</div>'
    ].join('\n');

    document.body.appendChild(overlay);

    // Event Listeners
    var stayBtn = overlay.querySelector('#admin-timeout-stay-btn');
    var logoutBtn = overlay.querySelector('#admin-timeout-logout-btn');

    if (stayBtn) {
      stayBtn.addEventListener('click', function (e) {
        e.preventDefault();
        dismissWarningAndReset();
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        performSecureLogout('manual');
      });
    }

    return overlay;
  }

  // ─── UPDATE MODAL TEXTS ON LANGUAGE SWITCH ───────────────────────────────
  function updateModalTexts() {
    if (!modalEl) return;
    var texts = getTexts();
    var titleEl = modalEl.querySelector('#admin-timeout-title');
    var descEl = modalEl.querySelector('#admin-timeout-desc');
    var stayBtnText = modalEl.querySelector('#admin-timeout-stay-btn .btn-text');
    var logoutBtnText = modalEl.querySelector('#admin-timeout-logout-btn .btn-text');

    if (titleEl) titleEl.textContent = texts.title;
    if (descEl) descEl.textContent = texts.desc;
    if (stayBtnText) stayBtnText.textContent = texts.stayBtn;
    if (logoutBtnText) logoutBtnText.textContent = texts.logoutBtn;
  }

  // ─── SHOW WARNING MODAL & COUNTDOWN ──────────────────────────────────────
  function showWarningModal(customSec) {
    if (isWarningVisible) return;
    isWarningVisible = true;
    remainingSeconds = (typeof customSec === 'number' && customSec > 0) ? customSec : WARNING_DURATION_SEC;

    modalEl = createModalDOM();
    updateModalTexts();

    // Trigger active transition
    modalEl.style.display = 'flex';
    requestAnimationFrame(function () {
      modalEl.classList.add('active');
    });

    var countdownEl = modalEl.querySelector('#admin-timeout-countdown');
    var badgeEl = modalEl.querySelector('.admin-timeout-timer-badge');

    function formatTime(sec) {
      var m = Math.floor(sec / 60);
      var s = sec % 60;
      return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }

    if (countdownEl) {
      countdownEl.textContent = formatTime(remainingSeconds);
    }
    if (badgeEl) {
      badgeEl.classList.remove('urgent');
    }

    clearInterval(countdownInterval);
    countdownInterval = setInterval(function () {
      remainingSeconds--;

      if (countdownEl) {
        countdownEl.textContent = formatTime(Math.max(0, remainingSeconds));
      }

      if (remainingSeconds <= 15 && badgeEl) {
        badgeEl.classList.add('urgent');
      }

      if (remainingSeconds <= 0) {
        clearInterval(countdownInterval);
        performSecureLogout('expired');
      }
    }, 1000);
  }

  // ─── DISMISS WARNING & RESET TIMER ───────────────────────────────────────
  function dismissWarningAndReset() {
    isWarningVisible = false;
    clearInterval(countdownInterval);

    if (modalEl) {
      modalEl.classList.remove('active');
      setTimeout(function () {
        modalEl.style.display = 'none';
      }, 300);
    }

    resetIdleTimer();
  }

  // ─── RESET IDLE TIMER (THROTTLED) ─────────────────────────────────────────
  function resetIdleTimer() {
    if (isWarningVisible) return; // Do not auto-reset if warning modal is open

    var now = Date.now();
    lastActivityTime = now;

    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () {
      showWarningModal();
    }, IDLE_TIMEOUT_MS);
  }

  function onUserActivity() {
    var now = Date.now();
    if (now - lastActivityTime >= THROTTLE_MS) {
      resetIdleTimer();
    }
  }

  // ─── SECURE LOGOUT & SESSION WIPE ────────────────────────────────────────
  function performSecureLogout(reason) {
    clearInterval(countdownInterval);
    clearTimeout(idleTimer);

    // Wipe session tokens
    localStorage.removeItem('wedrive_session');
    sessionStorage.removeItem('wedrive_session');

    var base = getBasePath();
    var redirectUrl = base + 'account/pages/login/login.html?session_expired=' + (reason || 'timeout');

    // Supabase auth signout if present (non-blocking)
    if (window.supabaseClient && window.supabaseClient.auth) {
      try {
        window.supabaseClient.auth.signOut().catch(function () {});
      } catch (e) {}
    }

    window.location.href = redirectUrl;
  }

  // ─── INITIALIZE LISTENERS ────────────────────────────────────────────────
  function init() {
    // Only run on admin pages
    var placeholder = document.getElementById('sidebar-placeholder');
    var isCurrentAdmin = placeholder && (placeholder.getAttribute('data-component') === 'sidebar-admin' || placeholder.getAttribute('data-page') === 'admin');
    var isPathAdmin = window.location.pathname.indexOf('/admin/') !== -1;

    if (!isCurrentAdmin && !isPathAdmin) {
      return;
    }

    // Attach user activity listeners
    var events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(function (evt) {
      window.addEventListener(evt, onUserActivity, { passive: true });
    });

    // Listen for language changes to update texts
    document.addEventListener('wedrive:language-applied', updateModalTexts);

    // Start initial timer
    resetIdleTimer();
    console.info('[WeDRIVE] Admin Inactivity Timeout Guardian active (10m idle + 1m countdown).');
  }

  // ─── EXPOSE GLOBAL TESTING & MANAGEMENT API ──────────────────────────────
  window.WeDriveAdminSession = {
    testWarning: function (customSeconds) {
      showWarningModal(customSeconds);
    },
    resetTimer: resetIdleTimer,
    logout: function () {
      performSecureLogout('manual');
    },
    getRemainingSeconds: function () {
      return remainingSeconds;
    },
    isWarningActive: function () {
      return isWarningVisible;
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
