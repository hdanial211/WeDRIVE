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
   SECTION 1: THEME TOGGLE
   ===================================================== */

(function () {
  'use strict';

  var THEME_KEY = 'wedrive-theme';
  var DAY_HREF = 'theme_day.css';
  var NIGHT_HREF = 'theme_night.css';

  function getEffectiveTheme(mode) {
    if (mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
    }
    return mode;
  }

  function applyTheme(mode, animate) {
    var effectiveMode = getEffectiveTheme(mode);
    var link = document.getElementById('theme-link');
    if (link) {
      var base = link.getAttribute('href').replace(/theme_(day|night)\.css$/, '');
      link.href = base + (effectiveMode === 'night' ? NIGHT_HREF : DAY_HREF);
    }
    /* Sync root class — allows CSS to target night-specific styles immediately */
    document.documentElement.classList.toggle('night-mode', effectiveMode === 'night');
    if (document.body) document.body.classList.toggle('night-mode', effectiveMode === 'night');
    localStorage.setItem(THEME_KEY, mode);
    updateThemeBtns(mode, animate);
  }

  function updateThemeBtns(mode, animate) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      var icon = btn.querySelector('.material-icons-round');
      if (!icon) return;

      if (animate) {
        btn.classList.remove('pop');
        void btn.offsetWidth;
        btn.classList.add('pop');
        setTimeout(function () { btn.classList.remove('pop'); }, 320);
      }

      // Show current mode icon: system (device theme), day (sun), night (moon)
      if (mode === 'system') {
        icon.textContent = 'settings_brightness';
        btn.setAttribute('aria-label', 'Theme: System (Switch to Day Mode)');
      } else if (mode === 'day') {
        icon.textContent = 'light_mode';
        btn.setAttribute('aria-label', 'Theme: Day (Switch to Night Mode)');
      } else {
        icon.textContent = 'dark_mode';
        btn.setAttribute('aria-label', 'Theme: Night (Switch to System Mode)');
      }
      btn.dataset.mode = mode;
    });
  }

  window.toggleTheme = function () {
    var current = localStorage.getItem(THEME_KEY) || 'system';
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

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY) || 'system';
    applyTheme(saved, false);
  }

  // Run immediately so if script is in <head>, it prevents FOUC
  initTheme();

  // Listen for device theme preference changes in real-time if set to system
  var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  try {
    mediaQuery.addEventListener('change', function () {
      var saved = localStorage.getItem(THEME_KEY) || 'system';
      if (saved === 'system') {
        applyTheme('system', false);
      }
    });
  } catch (e) {
    mediaQuery.addListener(function () {
      var saved = localStorage.getItem(THEME_KEY) || 'system';
      if (saved === 'system') {
        applyTheme('system', false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      // Re-apply to body once it exists
      var saved = localStorage.getItem(THEME_KEY) || 'system';
      var effectiveMode = getEffectiveTheme(saved);
      if (document.body) document.body.classList.toggle('night-mode', effectiveMode === 'night');
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
    return resolveProjectBase() + 'shared/lang/' + lang + '.js';
  }

  function applyTranslation(data, animate) {
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

    if (data['page_title']) document.title = data['page_title'];

    document.documentElement.lang = localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
    document.dispatchEvent(new CustomEvent('wedrive:language-applied', {
      detail: { lang: localStorage.getItem(LANG_KEY) || DEFAULT_LANG }
    }));
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

  function loadLanguage(lang, animate) {
    var globalVarName = 'wedrive_lang_' + lang;
    if (window[globalVarName]) {
      localStorage.setItem(LANG_KEY, lang);
      applyTranslation(window[globalVarName], animate);
      return;
    }

    // Script injection
    var scriptId = 'lang-script-' + lang;
    var existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.onload = function () {
        if (window[globalVarName]) {
          localStorage.setItem(LANG_KEY, lang);
          applyTranslation(window[globalVarName], animate);
        }
      };
      return;
    }

    var script = document.createElement('script');
    script.id = scriptId;
    script.src = resolveLangPath(lang);
    script.onload = function () {
      if (window[globalVarName]) {
        localStorage.setItem(LANG_KEY, lang);
        applyTranslation(window[globalVarName], animate);
      } else {
        console.warn('[WeDRIVE] Global language object not found: ' + globalVarName);
      }
    };
    script.onerror = function () {
      console.warn('[WeDRIVE] Failed to load language script: ' + script.src);
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
    var url = base + 'shared/components/footer.html';

    // Inject footer.css if not already present
    if (!document.querySelector('link[href*="footer.css"]')) {
      var cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = base + 'shared/css/footer.css';
      document.head.appendChild(cssLink);
    }

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
          footer_privacy: base + 'shared/pages/footer/terms/terms.html#privacy',
          footer_terms: base + 'shared/pages/footer/terms/terms.html',
          footer_car: base + 'shared/pages/footer/about/about.html',
          footer_faq: base + 'shared/pages/footer/faq/faq.html',
          footer_contact: base + 'shared/pages/footer/contact/contact.html'
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
