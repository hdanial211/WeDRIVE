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

  var THEME_KEY  = 'wedrive-theme';
  var DAY_HREF   = 'theme_day.css';
  var NIGHT_HREF = 'theme_night.css';

  function applyTheme(mode, animate) {
    var link = document.getElementById('theme-link');
    if (link) {
      var base = link.getAttribute('href').replace(/theme_(day|night)\.css$/, '');
      link.href = base + (mode === 'night' ? NIGHT_HREF : DAY_HREF);
    }
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

      // Show current mode: night -> moon icon | day -> sun icon
      icon.textContent = mode === 'night' ? 'dark_mode' : 'light_mode';
      btn.setAttribute('aria-label', mode === 'night' ? 'Switch to Day Mode' : 'Switch to Night Mode');
      btn.dataset.mode = mode;
    });
  }

  window.toggleTheme = function () {
    var current = localStorage.getItem(THEME_KEY) || 'day';
    applyTheme(current === 'night' ? 'day' : 'night', true);
  };

  function initTheme() {
    var saved = localStorage.getItem(THEME_KEY) || 'day';
    applyTheme(saved, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();


/* =====================================================
   SECTION 2: LANGUAGE SYSTEM
   ===================================================== */

(function () {
  'use strict';

  var LANG_KEY     = 'wedrive-lang';
  var DEFAULT_LANG = 'en';

  // Resolve path to shared/lang/ using the theme-link base path
  function resolveLangPath(lang) {
    var link = document.getElementById('theme-link');
    if (link) {
      var base = link.getAttribute('href').replace(/shared\/css\/.*$/, '');
      return base + 'shared/lang/' + lang + '.json';
    }
    // Fallback: derive from pathname depth
    var parts  = window.location.pathname.split('/').filter(Boolean);
    var depth  = parts.length > 0 ? parts.length - 1 : 0;
    var prefix = depth === 0 ? '' : '../'.repeat(depth);
    return prefix + 'shared/lang/' + lang + '.json';
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
    fetch(resolveLangPath(lang))
      .then(function (res) {
        if (!res.ok) throw new Error('Language file not found: ' + lang);
        return res.json();
      })
      .then(function (data) {
        localStorage.setItem(LANG_KEY, lang);
        applyTranslation(data, animate);
      })
      .catch(function (err) {
        console.warn('[WeDRIVE]', err.message);
      });
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
