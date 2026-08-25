/**
 * WeDRIVE - Shared Main Script
 * shared/js/main.js
 *
 * Combines Theme Toggle and Language System into one file.
 * Include this single script in every HTML page:
 *   <script src="shared/js/main.js"></script>          (root level)
 *   <script src="../../shared/js/main.js"></script>    (module pages)
 *
 * -------------------------------------------------------
 * THEME TOGGLE
 * -------------------------------------------------------
 * HTML button:
 *   <button class="theme-toggle" onclick="toggleTheme()" aria-label="Switch to Night Mode">
 *     <span class="material-icons-round">dark_mode</span>
 *   </button>
 *
 * Day mode  -> icon: light_mode (sun, shows current state)
 * Night mode -> icon: dark_mode  (moon, shows current state)
 *
 * -------------------------------------------------------
 * LANGUAGE TOGGLE
 * -------------------------------------------------------
 * HTML button:
 *   <button class="lang-toggle" onclick="toggleLanguage()" aria-label="Switch to Bahasa Melayu">
 *     <span class="lang-text">MS</span>
 *   </button>
 *
 * Supported: 'en' (English) | 'ms' (Bahasa Melayu)
 * Language files: shared/lang/en.json | shared/lang/ms.json
 *
 * HTML attributes:
 *   data-key="key"         -> sets innerText
 *   data-key-ph="key"      -> sets placeholder
 *   data-key-title="key"   -> sets title and aria-label
 *   data-key-html="key"    -> sets innerHTML
 */

/* =====================================================
   SECTION 0: UNIVERSAL GUEST & AUTH ROUTE GUARD
   Guarantees that unauthenticated guests NEVER access
   protected customer or admin pages, regardless of navigation loop.
   ===================================================== */
(function () {
  'use strict';

  var path = window.location.pathname;
  var isCustomerPage = path.indexOf('/customer/pages/') !== -1;
  var isAdminPage = path.indexOf('/admin/pages/') !== -1;

  if (isCustomerPage || isAdminPage) {
    var sessionRaw = localStorage.getItem('wedrive_session');
    var session = null;
    try { session = sessionRaw ? JSON.parse(sessionRaw) : null; } catch(e) {}

    var parts = path.split('/').filter(Boolean);
    var base = parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
    var loginUrl = base + 'account/pages/login/login.html';

    // 1. Not logged in at all -> immediately kick to login
    if (!session || (!session.id && !session.email)) {
      console.warn('[WeDRIVE Security] Guest access blocked on protected route:', path);
      window.location.replace(loginUrl);
      return;
    }

    // 2. Customer attempting to access Admin page -> kick to login
    if (isAdminPage && session.role !== 'admin') {
      console.warn('[WeDRIVE Security] Customer role blocked on admin route:', path);
      window.location.replace(loginUrl);
      return;
    }
  }
})();

/* =====================================================
   SECTION 1: THEME TOGGLE
   ===================================================== */

(function () {
  'use strict';

  var THEME_KEY = 'wedrive-theme';
  var DAY_HREF = 'theme_day.css';
  var NIGHT_HREF = 'theme_night.css';

  function getSavedTheme() {
    return localStorage.getItem('wedrive-theme') || 
           localStorage.getItem('wedrive_theme') || 
           localStorage.getItem('theme') || 
           'system';
  }

  function getEffectiveTheme(mode) {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    }
    return mode;
  }

  function applyTheme(mode, animate) {
    var effectiveMode = getEffectiveTheme(mode);
    var link = document.getElementById('theme-link');
    if (link && link.getAttribute('href') && /theme_(day|night)\.css/.test(link.getAttribute('href'))) {
      var base = link.getAttribute('href').replace(/theme_(day|night)\.css(\?.*)?$/, '');
      link.href = base + (effectiveMode === 'night' ? NIGHT_HREF : DAY_HREF);
    }
    /* Sync root class & attributes immediately across html and body */
    var isNight = effectiveMode === 'night';
    document.documentElement.classList.toggle('night-mode', isNight);
    document.documentElement.classList.toggle('dark', isNight);
    if (document.body) {
      document.body.classList.toggle('night-mode', isNight);
      document.body.classList.toggle('dark', isNight);
    }
    /* Set data-theme attribute for CSS selectors */
    document.documentElement.setAttribute('data-theme', isNight ? 'dark' : 'light');
    if (document.body) {
      document.body.setAttribute('data-theme', isNight ? 'dark' : 'light');
    }

    /* Save to all known storage keys for 100% platform-wide sync */
    localStorage.setItem('wedrive-theme', mode);
    localStorage.setItem('wedrive_theme', mode);
    localStorage.setItem('theme', mode);

    updateThemeBtns(mode, animate);

    try {
      window.dispatchEvent(new CustomEvent('wedrive:themechange', {
        detail: { mode: mode, effective: effectiveMode }
      }));
    } catch (_) {}
  }

  function updateThemeBtns(mode, animate) {
    var lang = localStorage.getItem('wedrive-lang') || localStorage.getItem('wedrive_language') || 'ms';
    var isMalay = lang === 'ms';

    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      var icon = btn.querySelector('.material-icons-round');
      if (!icon) return;

      if (animate) {
        btn.classList.remove('pop');
        void btn.offsetWidth;
        btn.classList.add('pop');
        setTimeout(function () { btn.classList.remove('pop'); }, 320);
      }

      if (mode === 'system') {
        icon.textContent = 'settings_brightness';
        btn.setAttribute('aria-label', isMalay 
          ? 'Tema: Sistem (Tukar ke Mod Siang)' 
          : 'Theme: System (Switch to Day Mode)');
      } else if (mode === 'day') {
        icon.textContent = 'light_mode';
        btn.setAttribute('aria-label', isMalay 
          ? 'Tema: Siang (Tukar ke Mod Malam)' 
          : 'Theme: Day (Switch to Night Mode)');
      } else {
        icon.textContent = 'dark_mode';
        btn.setAttribute('aria-label', isMalay 
          ? 'Tema: Malam (Tukar ke Mod Sistem)' 
          : 'Theme: Night (Switch to System Mode)');
      }
      btn.dataset.mode = mode;
    });
  }

  window.updateThemeBtns = updateThemeBtns;

  window.toggleTheme = function () {
    var current = getSavedTheme();
    var next = 'system';
    if (current === 'system') {
      next = 'day';
    } else if (current === 'day') {
      next = 'night';
    } else if (current === 'night') {
      next = 'system';
    }
    applyTheme(next, true);
  };

  window.setTheme = function (theme) {
    applyTheme(theme, false);
  };

  function initTheme() {
    var saved = getSavedTheme();
    applyTheme(saved, false);
  }

  // Run immediately so if script is in <head> or <body>, it applies instantaneously
  initTheme();

  // Listen for device theme preference changes in real-time
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  try {
    mediaQuery.addEventListener('change', function () {
      if (getSavedTheme() === 'system') {
        applyTheme('system', false);
      }
    });
  } catch (e) {
    mediaQuery.addListener(function () {
      if (getSavedTheme() === 'system') {
        applyTheme('system', false);
      }
    });
  }

  // Cross-tab theme synchronization listener
  window.addEventListener('storage', function (e) {
    if (e.key === 'wedrive-theme' || e.key === 'wedrive_theme' || e.key === 'theme') {
      if (e.newValue) applyTheme(e.newValue, false);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      var saved = getSavedTheme();
      var effectiveMode = getEffectiveTheme(saved);
      var isNight = effectiveMode === 'night';
      if (document.body) {
        document.body.classList.toggle('night-mode', isNight);
        document.body.classList.toggle('dark', isNight);
        document.body.setAttribute('data-theme', isNight ? 'dark' : 'light');
      }
    });
  }
})();


/* =====================================================
   SECTION 2: LANGUAGE SYSTEM
   ===================================================== */

(function () {
  'use strict';

  var LANG_KEY = 'wedrive-lang';
  var DEFAULT_LANG = 'en';

  function resolveProjectBase() {
    var pathname = decodeURIComponent(window.location.pathname);
    var marker = '/AI CAR RENTAL SYSTEM/';
    var idx = pathname.indexOf(marker);
    if (idx !== -1) {
      var baseSub = pathname.substring(idx + marker.length);
      var parts = baseSub.split('/').filter(Boolean);
      if (parts.length > 0 && parts[parts.length - 1].includes('.')) {
        return '../'.repeat(parts.length - 1);
      }
      return '../'.repeat(parts.length);
    }
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  // Resolve path to shared/lang/ using the theme-link base path
  function resolveLangPath(lang) {
    return resolveProjectBase() + 'shared/lang/' + lang + '.js?v=5.2.22';
  }

  function doApplyTranslation(data, animate) {
    // Set innerText for [data-key]
    document.querySelectorAll('[data-key]').forEach(function (el) {
      var key = el.getAttribute('data-key');
      if (data[key] !== undefined) el.innerText = data[key];
    });

    // Set placeholder for [data-key-ph]
    document.querySelectorAll('[data-key-ph]').forEach(function (el) {
      var key = el.getAttribute('data-key-ph');
      if (data[key] !== undefined) el.setAttribute('placeholder', data[key]);
    });

    // Set title and aria-label for [data-key-title]
    document.querySelectorAll('[data-key-title]').forEach(function (el) {
      var key = el.getAttribute('data-key-title');
      if (data[key] !== undefined) {
        el.setAttribute('title', data[key]);
        el.setAttribute('aria-label', data[key]);
      }
    });

    // Set innerHTML for [data-key-html]
    document.querySelectorAll('[data-key-html]').forEach(function (el) {
      var key = el.getAttribute('data-key-html');
      if (data[key] !== undefined) el.innerHTML = data[key];
    });

    updateLangBtn(animate);

    if (typeof window.updateThemeBtns === 'function') {
      var currentTheme = localStorage.getItem('wedrive-theme') || 'system';
      window.updateThemeBtns(currentTheme, false);
    }

    if (data['page_title']) document.title = data['page_title'];

    document.documentElement.lang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    document.dispatchEvent(new CustomEvent('wedrive:language-applied', {
      detail: { lang: localStorage.getItem(LANG_KEY) || DEFAULT_LANG }
    }));
  }

  function applyTranslation(data, animate) {
    if (animate) {
      setTimeout(function () {
        doApplyTranslation(data, animate);

        requestAnimationFrame(function () {
          if (document.body) {
            document.body.classList.remove('lang-skeleton-active');
            document.body.classList.add('lang-skeleton-reveal');
          }
          document.documentElement.classList.remove('lang-skeleton-active');
          document.documentElement.classList.add('lang-skeleton-reveal');

          setTimeout(function () {
            if (document.body) {
              document.body.classList.remove('lang-skeleton-reveal');
            }
            document.documentElement.classList.remove('lang-skeleton-reveal');
          }, 380);
        });
      }, 220);
    } else {
      doApplyTranslation(data, animate);
    }
  }

  function updateLangBtn(animate) {
    var currentLang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      var label = btn.querySelector('.lang-text');
      if (label) {
        label.textContent = currentLang === 'ms' ? 'MS' : 'EN';
      }
      btn.setAttribute('aria-label',
        currentLang === 'ms' ? 'Switch to English' : 'Switch to Bahasa Melayu'
      );

      if (animate) {
        btn.classList.remove('pop');
        void btn.offsetWidth;
        btn.classList.add('pop');
        setTimeout(function () { btn.classList.remove('pop'); }, 320);
      }
    });
  }

  var FALLBACK_LANG = {
    en: {
      "nav_browse": "Browse Cars",
      "nav_explore": "Explore Melaka",
      "nav_melaka": "Explore Melaka",
      "nav_how": "How It Works",
      "nav_ai": "AI Assistant",
      "nav_login": "Log In",
      "nav_signup": "Sign Up",
      "nav_logout": "Log Out",
      "footer_tagline": "Smart, premium vehicle rental service in Melaka.",
      "footer_col_fleet": "Fleet & Rentals",
      "footer_col_tech": "Features & Options",
      "footer_col_support": "Help & Support",
      "footer_col_legal": "Legal & Company",
      "footer_pricing": "Pricing Plans",
      "footer_tech_360": "360° Showroom",
      "footer_car": "Car Connectivity",
      "footer_tech_pricing": "Package Comparison",
      "footer_tech_keyless": "Vehicle Pickup",
      "footer_faq": "FAQ",
      "footer_contact": "Contact",
      "footer_support_center": "Customer Care Center",
      "footer_support_roadside": "24/7 Roadside Assistance",
      "footer_privacy": "Privacy Policy",
      "footer_terms": "Service Terms",
      "footer_legal_insurance": "Insurance Coverage",
      "footer_legal_about": "About WeDRIVE",
      "footer_rights": "All rights reserved.",
      "footer_region": "Malaysia (MYR • RM)",
      "cust_welcome": "Welcome back!",
      "cust_active_bookings": "Active Bookings",
      "cust_active_desc": "Your current ongoing rental",
      "cust_view_all": "View All",
      "cust_return_date": "Return Date",
      "cust_extend": "Extend Rental",
      "cust_ai_reco": "AI Recommendations for You",
      "cust_ai_reco_desc": "Curated based on your rental history",
      "cust_browse": "Browse Available Cars",
      "cust_browse_desc": "Find your perfect rental",
      "popup_select_dates": "Select Your Dates",
      "popup_pickup": "Pick-up Date",
      "popup_return": "Return Date",
      "popup_proceed": "Continue to Booking",
      "cust_new_booking": "New Booking",
      "filter_mpv": "MPV",
      "filter_coupe": "Coupe",
      "filter_truck": "Truck"
    },
    ms: {
      "nav_browse": "Pilih Kereta",
      "nav_explore": "Jalan-jalan Melaka",
      "nav_melaka": "Jalan-jalan Melaka",
      "nav_how": "Cara Berfungsi",
      "nav_ai": "Pembantu AI",
      "nav_login": "Log Masuk",
      "nav_signup": "Daftar Akaun",
      "nav_logout": "Log Keluar",
      "footer_tagline": "Perkhidmatan sewaan kenderaan premium dan pintar di Melaka.",
      "footer_col_fleet": "Armada & Sewaan",
      "footer_col_tech": "Pilihan & Ciri",
      "footer_col_support": "Bantuan & Khidmat",
      "footer_col_legal": "Dasar & Syarikat",
      "footer_pricing": "Pakej & Kadar Harga",
      "footer_tech_360": "Bilik Pameran 360°",
      "footer_car": "Maklumat Kenderaan",
      "footer_tech_pricing": "Perbandingan Pakej",
      "footer_tech_keyless": "Pengambilan Kenderaan",
      "footer_faq": "Soalan Lazim (FAQ)",
      "footer_contact": "Hubungi Kami",
      "footer_support_center": "Pusat Khidmat Pelanggan",
      "footer_support_roadside": "Bantuan Kecemasan 24/7",
      "footer_privacy": "Dasar Privasi",
      "footer_terms": "Terma Perkhidmatan",
      "footer_legal_insurance": "Perlindungan Insurans",
      "footer_legal_about": "Mengenai WeDRIVE",
      "footer_rights": "Hak cipta terpelihara.",
      "footer_region": "Malaysia (MYR • RM)",
      "cust_welcome": "Selamat kembali!",
      "cust_active_bookings": "Tempahan Aktif",
      "cust_active_desc": "Sewaan semasa anda yang sedang berlangsung",
      "cust_view_all": "Lihat Semua",
      "cust_return_date": "Tarikh Pemulangan",
      "cust_extend": "Lanjutkan Sewaan",
      "cust_ai_reco": "Padanan Pintar AI untuk Anda",
      "cust_ai_reco_desc": "Disusun khas berdasarkan rekod sewaan anda",
      "cust_browse": "Pilih Kereta Tersedia",
      "cust_browse_desc": "Cari kenderaan sewaan idaman anda",
      "popup_select_dates": "Pilih Tarikh Anda",
      "popup_pickup": "Tarikh Pengambilan",
      "popup_return": "Tarikh Pemulangan",
      "popup_proceed": "Teruskan ke Tempahan",
      "cust_new_booking": "Tempahan Baharu",
      "filter_mpv": "MPV",
      "filter_coupe": "Coupe",
      "filter_truck": "Trak"
    }
  };

  function getMergedLangData(lang) {
    var fallback = FALLBACK_LANG[lang] || {};
    var loaded = window['wedrive_lang_' + lang] || {};
    return Object.assign({}, fallback, loaded);
  }

  function loadLanguage(lang, animate) {
    if (animate) {
      if (document.body) {
        document.body.classList.add('lang-skeleton-active');
      }
      document.documentElement.classList.add('lang-skeleton-active');
    }

    localStorage.setItem(LANG_KEY, lang);

    // Apply merged synchronous dictionary immediately
    applyTranslation(getMergedLangData(lang), animate);

    // Script injection / refresh for full dictionary
    var scriptId = 'lang-script-' + lang;
    var existingScript = document.getElementById(scriptId);
    if (existingScript) existingScript.remove();

    var script = document.createElement('script');
    script.id = scriptId;
    script.src = resolveLangPath(lang);
    script.onload = function () {
      applyTranslation(getMergedLangData(lang), false);
    };
    script.onerror = function () {
      if (document.body) document.body.classList.remove('lang-skeleton-active');
      document.documentElement.classList.remove('lang-skeleton-active');
    };
    document.head.appendChild(script);
  }

  window.toggleLanguage = function () {
    var current = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    loadLanguage(current === 'en' ? 'ms' : 'en', true);
  };

  window.setLanguage = function (lang) {
    loadLanguage(lang, false);
  };

  function initLang() {
    var saved = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    loadLanguage(saved, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLang);
  } else {
    initLang();
  }
})();


/* =====================================================
   SECTION 3: SCROLL REVEAL
   =====================================================
 * Adds .show (and .active as alias) to any element with:
 *   .reveal          - fade up
 *   .reveal-left     - fade from left
 *   .reveal-right    - fade from right
 *   .slide-up        - slide up (legacy alias)
 *   .slide-left      - slide from left (legacy alias)
 *   .slide-right     - slide from right (legacy alias)
 *
 * Usage in HTML:
 *   <div class="reveal">...</div>
 *   <div class="reveal delay-2">...</div>
 *   <div class="reveal-left delay-3">...</div>
 *
 * Stagger siblings automatically using .stagger-group on parent:
 *   <div class="stagger-group">
 *     <div class="reveal">Card 1</div>
 *     <div class="reveal">Card 2</div>
 *     <div class="reveal">Card 3</div>
 *   </div>
 */

(function () {
  'use strict';

  var REVEAL_SELECTORS = [
    '.reveal',
    '.reveal-left',
    '.reveal-right',
    '.slide-up',
    '.slide-left',
    '.slide-right'
  ].join(', ');

  var REVEAL_POINT = 80; // px from bottom of viewport to trigger

  /* ── Apply stagger delays to children of .stagger-group ── */
  function applyStagger() {
    document.querySelectorAll('.stagger-group').forEach(function (group) {
      var children = group.querySelectorAll(REVEAL_SELECTORS);
      children.forEach(function (el, i) {
        if (!el.style.transitionDelay && !el.classList.contains('delay-1') &&
          !el.classList.contains('delay-2') && !el.classList.contains('delay-3') &&
          !el.classList.contains('delay-4') && !el.classList.contains('delay-5') &&
          !el.classList.contains('delay-6')) {
          el.style.transitionDelay = (i * 0.1).toFixed(1) + 's';
          el.style.animationDelay = (i * 0.1).toFixed(1) + 's';
        }
      });
    });
  }

  /* ── Show a single element ── */
  function showElement(el) {
    el.classList.add('show');
    el.classList.add('active'); // alias for compatibility
  }

  /* ── Modern: IntersectionObserver ── */
  function initObserver(elements) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          showElement(entry.target);
          observer.unobserve(entry.target); // fire once
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -' + REVEAL_POINT + 'px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ── Fallback: scroll event ── */
  function initScrollFallback(elements) {
    function check() {
      var wh = window.innerHeight;
      elements.forEach(function (el) {
        if (el.classList.contains('show')) return;
        var top = el.getBoundingClientRect().top;
        if (top < wh - REVEAL_POINT) {
          showElement(el);
        }
      });
    }
    window.addEventListener('scroll', check, { passive: true });
    check(); // run once on load
  }

  /* ── Page load animation for above-the-fold elements ── */
  function revealAboveFold(elements) {
    var wh = window.innerHeight;
    elements.forEach(function (el) {
      var top = el.getBoundingClientRect().top;
      if (top < wh) {
        // Small delay so CSS transition has time to register
        setTimeout(function () { showElement(el); }, 60);
      }
    });
  }

  function init() {
    applyStagger();

    var elements = Array.prototype.slice.call(
      document.querySelectorAll(REVEAL_SELECTORS)
    );

    if (!elements.length) return;

    revealAboveFold(elements);

    var remaining = elements.filter(function (el) {
      return !el.classList.contains('show');
    });

    if ('IntersectionObserver' in window) {
      initObserver(remaining);
    } else {
      initScrollFallback(remaining);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


/* =====================================================
   SECTION 4: BACKGROUND PARTICLES
   =====================================================
 * Only activates on pages that have: <body data-particles>
 *
 * Config via data attributes on <body>:
 *   data-particles          - enable (required)
 *   data-particles="8"      - set count (default: 10)
 *
 * Example:
 *   <body data-particles="12">      <- 12 orbs
 *   <body data-particles>           <- default 10 orbs
 *
 * Does NOT override body background — safe for all page layouts.
 */

(function () {
  'use strict';

  var R = Math.random;

  function rand(min, max) { return min + R() * (max - min); }
  function randInt(min, max) { return Math.round(rand(min, max)); }
  function randPx(min, max) { return rand(min, max).toFixed(1) + 'px'; }

  function spawnParticles() {
    var body = document.body;
    if (!body.hasAttribute('data-particles')) return;

    var count = parseInt(body.getAttribute('data-particles'), 10);
    if (isNaN(count) || count < 1) count = 10;
    count = Math.min(count, 24); // cap for performance

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var fragment = document.createDocumentFragment();

    for (var i = 0; i < count; i++) {
      var el = document.createElement('div');
      el.className = 'bg-particle';

      var size = rand(24, 110);

      // Randomise via CSS custom properties (no JS animation)
      el.style.cssText = [
        'width:' + size.toFixed(0) + 'px',
        'height:' + size.toFixed(0) + 'px',
        'top:' + rand(0, 92).toFixed(1) + 'vh',
        'left:' + rand(0, 95).toFixed(1) + 'vw',
        '--dur:' + rand(9, 22).toFixed(1) + 's',
        '--max-opacity:' + rand(0.06, 0.22).toFixed(2),
        '--tx1:' + randPx(-60, 60),
        '--ty1:' + randPx(-60, 40),
        '--tx2:' + randPx(-40, 50),
        '--ty2:' + randPx(-30, 60),
        'animation-delay:' + rand(0, 8).toFixed(1) + 's',
        'filter:blur(' + rand(0.5, 3).toFixed(1) + 'px)'
      ].join(';');

      fragment.appendChild(el);
    }

    // Insert as FIRST children so content z-index stays above
    body.insertBefore(fragment, body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', spawnParticles);
  } else {
    spawnParticles();
  }
})();


/* =====================================================
   SECTION 5: CURSOR GLOW (SPOTLIGHT EFFECT)
   =====================================================
 * Smooth glowing circle that follows the mouse with
 * a slight easing lag — premium feel like the
 * Antigravity landing page.
 *
 * Enable on any page:
 *   <body data-cursor-glow>              <- default size & color
 *   <body data-cursor-glow="600">       <- custom radius px
 *
 * The glow is a fixed radial gradient overlay.
 * Works on both light and dark backgrounds.
 * Automatically hides when mouse leaves the window.
 */

(function () {
  'use strict';

  function initCursorGlow() {
    var body = document.body;
    if (!body.hasAttribute('data-cursor-glow')) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return; // skip on touch devices

    var radius = parseInt(body.getAttribute('data-cursor-glow'), 10) || 500;

    /* Create overlay element */
    var glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = [
      'position:fixed',
      'inset:0',
      'pointer-events:none',
      'z-index:9998',
      'opacity:0',
      'transition:opacity 0.4s ease',
      'will-change:background'
    ].join(';');
    body.appendChild(glow);

    /* Smooth tracking with lerp */
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var currentX = mouseX;
    var currentY = mouseY;
    var visible = false;
    var raf;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function getColor() {
      /* Blue/violet glow — adapts slightly for night mode */
      var isNight = document.documentElement.classList.contains('night-mode');
      return isNight
        ? 'rgba(96,165,250,0.10)'    // blue tint night
        : 'rgba(59,130,246,0.12)';   // blue tint day
    }

    function updateGlow() {
      /* Lerp toward target — 0.08 = smooth lag */
      currentX = lerp(currentX, mouseX, 0.08);
      currentY = lerp(currentY, mouseY, 0.08);

      glow.style.background = [
        'radial-gradient(circle ' + radius + 'px at',
        currentX.toFixed(1) + 'px',
        currentY.toFixed(1) + 'px,',
        getColor() + ',',
        'transparent 70%)'
      ].join(' ');

      raf = requestAnimationFrame(updateGlow);
    }

    /* Start loop */
    raf = requestAnimationFrame(updateGlow);

    /* Mouse move */
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        glow.style.opacity = '1';
      }
    }, { passive: true });

    /* Hide when mouse leaves window */
    document.addEventListener('mouseleave', function () {
      visible = false;
      glow.style.opacity = '0';
    });

    /* Show again when mouse enters */
    document.addEventListener('mouseenter', function () {
      visible = true;
      glow.style.opacity = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursorGlow);
  } else {
    initCursorGlow();
  }
})();

/* =====================================================
   SECTION 4: FOOTER LOADER
   ===================================================== */
(function () {
  'use strict';

  function resolveBasePath() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    var depth = parts.length > 0 ? parts.length - 1 : 0;
    return depth === 0 ? '' : '../'.repeat(depth);
  }

  function loadFooter() {
    var placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;

    var base = resolveBasePath();
    var url = base + 'shared/components/footer.html?v=5.2.22';

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Cannot load footer: ' + url);
        return res.text();
      })
      .then(function (html) {
        placeholder.innerHTML = html;
        // Fix data-logo src
        var logo = placeholder.querySelector('[data-logo]');
        if (logo) logo.src = base + 'shared/logo/wedrive-icon.png';

        var footerRoutes = {
          nav_browse: base + 'index.html',
          footer_pricing: base + 'guest/pages/pricing/pricing.html',
          nav_how: base + 'guest/pages/how-it-works/how-it-works.html',
          nav_explore: base + 'guest/pages/explore-melaka/explore-melaka.html',
          footer_tech_360: base + 'guest/pages/how-it-works/how-it-works.html#interactive',
          footer_car: base + 'shared/pages/footer/about/about.html',
          footer_tech_pricing: base + 'guest/pages/pricing/pricing.html#features',
          footer_tech_keyless: base + 'guest/pages/how-it-works/how-it-works.html#journey',
          footer_faq: base + 'shared/pages/footer/faq/faq.html',
          footer_contact: base + 'shared/pages/footer/contact/contact.html',
          footer_support_center: base + 'customer/pages/support/support.html',
          footer_support_roadside: base + 'shared/pages/footer/contact/contact.html#emergency',
          footer_privacy: base + 'shared/pages/footer/terms/terms.html#privacy',
          footer_terms: base + 'shared/pages/footer/terms/terms.html',
          footer_legal_insurance: base + 'shared/pages/footer/terms/terms.html#insurance',
          footer_legal_about: base + 'shared/pages/footer/about/about.html'
        };
        Object.keys(footerRoutes).forEach(function (key) {
          var link = placeholder.querySelector('[data-key="' + key + '"]');
          if (link) link.href = footerRoutes[key];
        });

        // Retranslate newly added footer keys
        if (typeof window.setLanguage === 'function') {
          var lang = localStorage.getItem('wedrive-lang') || 'en';
          window.setLanguage(lang);
        }
      })
      .catch(function (err) {
        console.warn('[WeDRIVE Footer]', err.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadFooter);
  } else {
    loadFooter();
  }
})();

/* =====================================================
   SECTION 6: SEARCH POPUP LOADER
   Loads shared/js/search-popup.js on every page.
   Any page that has main.js gets the search popup.
   ===================================================== */
(function () {
  'use strict';

  function resolveBase() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  function loadSearchPopup() {
    if (document.getElementById('sp-script')) return;
    var script = document.createElement('script');
    script.id = 'sp-script';
    script.src = resolveBase() + 'shared/js/search-popup.js';
    document.body.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSearchPopup);
  } else {
    loadSearchPopup();
  }
})();


/* =====================================================
   SECTION 7: CALENDAR LOADER
   Loads Flatpickr & shared calendar logic if date fields exist.
   ===================================================== */
(function () {
  'use strict';

  function resolveBase() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  function loadCalendar() {
    var pickers = document.querySelectorAll('#pickup-date, #return-date, #popup-pickup-date, #popup-return-date, .date-picker');
    if (!pickers.length) return;

    // Load Flatpickr CSS if not present
    if (!document.querySelector('link[href*="flatpickr.min.css"]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css';
      document.head.appendChild(link);
    }

    // Helper to get version parameter from current script or fallback to Date.now() for cache-busting
    var version = '?v=7.6.2&t=' + Date.now();

    // Load Flatpickr JS & our Shared Calendar JS
    if (typeof window.flatpickr === 'undefined') {
      var fpScript = document.createElement('script');
      fpScript.src = 'https://cdn.jsdelivr.net/npm/flatpickr';
      fpScript.onload = function () {
        var calScript = document.createElement('script');
        calScript.src = resolveBase() + 'shared/js/calendar.js' + version;
        document.body.appendChild(calScript);
      };
      document.body.appendChild(fpScript);
    } else {
      var calScript = document.createElement('script');
      calScript.src = resolveBase() + 'shared/js/calendar.js' + version;
      document.body.appendChild(calScript);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCalendar);
  } else {
    loadCalendar();
  }
})();

/* =====================================================
   SECTION 8: GLOBAL SETTINGS SYNC
   ===================================================== */
(function () {
  'use strict';

  var SETTINGS_KEY = 'wedrive_global_settings';
  var defaultSettings = {
    company_name: 'WeDRIVE Car Rental',
    company_email: 'info@wedrive.my',
    company_phone: '06-2345678',
    company_address: 'Lot 123, Jalan Melaka, 75000 Melaka',
    currency: 'MYR',
    tax_rate: 0,
    min_rental_days: 1,
    max_rental_days: 30,
    late_fee_per_hour: 25,
    deposit_percentage: 20,
    operating_hours: '8:00 AM - 8:00 PM'
  };

  window.WeDriveGetSettings = async function () {
    try {
      var cached = localStorage.getItem(SETTINGS_KEY);
      if (cached) {
        var parsed = JSON.parse(cached);
        if (parsed && parsed.company_name) {
          if (window.supabaseClient && window.AppConfig && window.AppConfig.USE_REAL_DB) {
            window.supabaseClient.from('settings').select('value').eq('key', 'main').maybeSingle().then(function (r) {
              if (r.data && r.data.value) {
                localStorage.setItem(SETTINGS_KEY, JSON.stringify(r.data.value));
              }
            }).catch(function () {});
          }
          return parsed;
        }
      }
    } catch (e) {}

    if (window.supabaseClient && window.AppConfig && window.AppConfig.USE_REAL_DB) {
      try {
        var r = await window.supabaseClient.from('settings').select('value').eq('key', 'main').maybeSingle();
        if (r.data && r.data.value) {
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(r.data.value));
          return r.data.value;
        }
      } catch (e) {}
    }

    return defaultSettings;
  };

  async function syncCompanyDetails() {
    try {
      var settings = await window.WeDriveGetSettings();
      if (!settings) return;

      document.querySelectorAll('[data-company-name]').forEach(function (el) {
        el.textContent = settings.company_name;
      });
      document.querySelectorAll('[data-company-email]').forEach(function (el) {
        el.textContent = settings.company_email;
        if (el.tagName === 'A') {
          el.href = 'mailto:' + settings.company_email + '?subject=WeDRIVE%20Support%20Request';
        }
      });
      document.querySelectorAll('[data-company-phone]').forEach(function (el) {
        el.textContent = settings.company_phone;
        if (el.tagName === 'A') {
          el.href = 'tel:' + settings.company_phone.replace(/\s+/g, '');
        }
      });
      document.querySelectorAll('[data-company-address]').forEach(function (el) {
        el.textContent = settings.company_address;
      });
      document.querySelectorAll('[data-company-hours]').forEach(function (el) {
        el.textContent = settings.operating_hours;
      });
      document.querySelectorAll('[data-company-whatsapp]').forEach(function (el) {
        if (el.tagName === 'A') {
          var cleanPhone = settings.company_phone.replace(/\D/g, '');
          if (cleanPhone.length < 5) cleanPhone = '601112345678';
          if (!cleanPhone.startsWith('6')) cleanPhone = '6' + cleanPhone;
          el.href = 'https://wa.me/' + cleanPhone + '?text=Hi%20WeDRIVE%2C%20I%20need%20help%20with%20my%20booking';
        }
      });
    } catch (err) {
      console.warn('[WeDrive Settings Sync]', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncCompanyDetails);
  } else {
    syncCompanyDetails();
  }
})();

/* =====================================================
   SECTION 9: APPLE DYNAMIC SCROLL NAVBAR & MOBILE FLOATING DOCK
   ===================================================== */
(function () {
  'use strict';

  var lastScrollY = window.scrollY || 0;
  var ticking = false;

  function onScroll() {
    var scrollY = window.scrollY || document.documentElement.scrollTop || (document.body ? document.body.scrollTop : 0);
    var delta = scrollY - lastScrollY;

    // Desktop & Admin Top Navbar Compact & Floating Shrink
    var navbars = document.querySelectorAll('.navbar, #wedrive-navbar');
    navbars.forEach(function (navbar) {
      if (scrollY > 20) {
        navbar.classList.add('navbar-compact', 'navbar-floating');
      } else {
        navbar.classList.remove('navbar-compact', 'navbar-floating');
      }
    });

    // Mobile Bottom Floating Dock Condense (Instagram / Apple Feel)
    var dock = document.getElementById('apple-bottom-dock');
    if (dock) {
      if (scrollY > 60 && delta > 3) {
        dock.classList.add('dock-condensed');
      } else if (delta < -3 || scrollY <= 40) {
        dock.classList.remove('dock-condensed');
      }
    }

    lastScrollY = scrollY;
    ticking = false;
  }

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('scroll', handleScroll, { passive: true, capture: true });

  function resolveBase() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  function initAppleDock() {
    if (document.getElementById('apple-bottom-dock')) return;

    var path = window.location.pathname;
    var isHome = path.endsWith('index.html') || path === '/' || path.endsWith('/AI%20CAR%20RENTAL%20SYSTEM/') || path.endsWith('/AI CAR RENTAL SYSTEM/');
    var isPricing = path.indexOf('pricing.html') !== -1;
    var isMelaka = path.indexOf('explore-melaka.html') !== -1;
    var isAuth = path.indexOf('/account/') !== -1;

    var sessionRaw = localStorage.getItem('wedrive_session');
    var session = null;
    try { session = sessionRaw ? JSON.parse(sessionRaw) : null; } catch(e) {}
    var isLoggedIn = !!(session && session.id);
    var isCustomer = isLoggedIn && session.role === 'customer';
    var isAdmin = isLoggedIn && session.role === 'admin';

    var base = resolveBase();

    var homeUrl = base + 'index.html';
    var carsUrl = base + 'index.html#cars';
    var pricingUrl = base + 'guest/pages/pricing/pricing.html';
    var melakaUrl = base + 'guest/pages/explore-melaka/explore-melaka.html';
    var accountUrl = isCustomer 
      ? (base + 'customer/pages/dashboard/customer.html') 
      : (isAdmin ? (base + 'admin/pages/dashboard/admin.html') : (base + 'account/pages/login/login.html'));

    var dock = document.createElement('nav');
    dock.id = 'apple-bottom-dock';
    dock.className = 'apple-bottom-dock';
    dock.setAttribute('aria-label', 'Mobile Dock Navigation');

    dock.innerHTML = [
      '<a href="' + homeUrl + '" class="dock-item ' + (isHome && !window.location.hash.includes('cars') ? 'active' : '') + '" title="Home" aria-label="Home">',
      '  <span class="material-icons-round">home</span>',
      '</a>',
      '<a href="' + carsUrl + '" class="dock-item ' + (window.location.hash.includes('cars') ? 'active' : '') + '" title="Cars" aria-label="Cars">',
      '  <span class="material-icons-round">directions_car</span>',
      '</a>',
      '<a href="' + pricingUrl + '" class="dock-item ' + (isPricing ? 'active' : '') + '" title="Pricing" aria-label="Pricing">',
      '  <span class="material-icons-round">payments</span>',
      '</a>',
      '<a href="' + melakaUrl + '" class="dock-item ' + (isMelaka ? 'active' : '') + '" title="Explore Melaka" aria-label="Explore Melaka">',
      '  <span class="material-icons-round">explore</span>',
      '</a>',
      '<a href="' + accountUrl + '" class="dock-item ' + (isAuth || (isLoggedIn && path.indexOf('/customer/') !== -1) ? 'active' : '') + '" title="Account" aria-label="Account">',
      '  <span class="material-icons-round">person</span>',
      '</a>'
    ].join('');

    document.body.appendChild(dock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppleDock);
  } else {
    initAppleDock();
  }
})();

/* =====================================================
   SECTION 15D: GLOBAL APPLE PAGE TRANSITION SYSTEM (IN & OUT)
   ===================================================== */
(function initGlobalPageTransitions() {
  'use strict';

  function getProgressBar() {
    var bar = document.getElementById('wedrive-page-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'wedrive-page-progress';
      if (document.body) {
        document.body.appendChild(bar);
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          if (!document.getElementById('wedrive-page-progress')) {
            document.body.appendChild(bar);
          }
        });
      }
    }
    return bar;
  }

  // Global programmatic page transition navigator
  window.navigateToPage = function (url, customDelay) {
    if (!url) return;
    var bar = getProgressBar();
    if (bar) bar.classList.add('active');
    if (document.body) document.body.classList.add('page-is-leaving');
    if (document.documentElement) document.documentElement.classList.add('page-is-leaving');
    var delay = typeof customDelay === 'number' ? customDelay : 200;
    setTimeout(function () {
      window.location.href = url;
    }, delay);
  };

  // Ensure clean state upon arrival (including browser back/forward cache)
  window.addEventListener('pageshow', function () {
    if (document.body) {
      document.body.classList.remove('page-is-leaving');
    }
    if (document.documentElement) {
      document.documentElement.classList.remove('page-is-leaving');
    }
    var bar = document.getElementById('wedrive-page-progress');
    if (bar) bar.classList.remove('active');
  });

  // Universal click interceptor for seamless Page OUT transitions
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return; // Standard click only
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // Allow new-tab modifier keys

    // Check for <a> links
    var link = e.target.closest('a');
    if (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.hasAttribute('download')) return;
      if (link.getAttribute('target') && link.getAttribute('target') !== '_self') return;

      var targetUrl;
      try {
        targetUrl = new URL(link.href, window.location.href);
      } catch (_) {
        return;
      }

      if (targetUrl.origin !== window.location.origin) return;
      if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
        return; // Same page anchor/reload
      }

      e.preventDefault();
      window.navigateToPage(link.href, 200);
      return;
    }

    // Check for elements with data-href or data-navigate
    var navEl = e.target.closest('[data-href], [data-navigate]');
    if (navEl) {
      var targetHref = navEl.getAttribute('data-href') || navEl.getAttribute('data-navigate');
      if (targetHref && !targetHref.startsWith('#') && !targetHref.startsWith('javascript:')) {
        e.preventDefault();
        window.navigateToPage(targetHref, 200);
      }
    }
  });
})();

/* =====================================================
   SECTION 15E: GLOBAL AI ASSISTANT FAB PERSISTENCE
   ===================================================== */
(function ensureChatbotFab() {
  function resolveBase() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  function checkAndMountChatbot() {
    if (document.getElementById('chatbot-fab')) return;

    if (typeof window.initWeDriveChatbot === 'function') {
      window.initWeDriveChatbot();
      return;
    }

    // If chatbot script is not yet loaded, load it dynamically
    var existingScript = document.querySelector('script[src*="chatbot.js"]');
    if (!existingScript) {
      var base = resolveBase();
      var script = document.createElement('script');
      script.src = base + 'shared/js/chatbot.js';
      script.onload = function() {
        if (typeof window.initWeDriveChatbot === 'function') {
          window.initWeDriveChatbot();
        }
      };
      document.body.appendChild(script);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkAndMountChatbot);
  } else {
    checkAndMountChatbot();
  }

  // Backup check after page renders
  setTimeout(checkAndMountChatbot, 400);
})();



