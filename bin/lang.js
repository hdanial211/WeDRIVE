/**
 * WeDRIVE - Dynamic Language System
 * shared/js/lang.js
 *
 * Supports:
 *   data-key="key"          → sets innerText
 *   data-key-ph="key"       → sets placeholder attribute
 *   data-key-title="key"    → sets title / aria-label attribute
 *   data-key-html="key"     → sets innerHTML (use sparingly)
 *
 * Usage in HTML:
 *   <h2 data-key="login_welcome"></h2>
 *   <input data-key-ph="login_email_ph" />
 *
 * Persists choice in localStorage under key "wedrive-lang".
 */

(function () {
  const STORAGE_KEY = 'wedrive-lang';
  const DEFAULT_LANG = 'en';
  // Supported langs: 'en' | 'ms'  (file: shared/lang/en.json | ms.json)

  // Resolve path to shared/lang/ relative to this page's depth
  function resolveLangPath(lang) {
    const link = document.getElementById('theme-link');
    if (link) {
      // Use the same base path prefix as the theme link
      const base = link.getAttribute('href').replace(/shared\/css\/.*$/, '');
      return base + 'shared/lang/' + lang + '.json';
    }
    // Fallback: try to figure out depth from pathname
    const parts = window.location.pathname.split('/').filter(Boolean);
    const depth = parts.length > 0 ? parts.length - 1 : 0;
    const prefix = depth === 0 ? '' : '../'.repeat(depth);
    return prefix + 'shared/lang/' + lang + '.json';
  }

  /**
   * Apply translation pack to all data-key elements on the page.
   */
  function applyTranslation(data, animate) {
    // Text content
    document.querySelectorAll('[data-key]').forEach(function (el) {
      const key = el.getAttribute('data-key');
      if (data[key] !== undefined) el.innerText = data[key];
    });

    // Placeholder attribute
    document.querySelectorAll('[data-key-ph]').forEach(function (el) {
      const key = el.getAttribute('data-key-ph');
      if (data[key] !== undefined) el.setAttribute('placeholder', data[key]);
    });

    // Title / aria-label attribute
    document.querySelectorAll('[data-key-title]').forEach(function (el) {
      const key = el.getAttribute('data-key-title');
      if (data[key] !== undefined) {
        el.setAttribute('title', data[key]);
        el.setAttribute('aria-label', data[key]);
      }
    });

    // HTML content (use only when text contains HTML tags)
    document.querySelectorAll('[data-key-html]').forEach(function (el) {
      const key = el.getAttribute('data-key-html');
      if (data[key] !== undefined) el.innerHTML = data[key];
    });

    // Update lang toggle pill switch
    updateLangBtn(data, animate);

    // Update page title if key exists
    if (data['page_title']) document.title = data['page_title'];
  }

  /**
   * Update the lang icon button.
   * EN = show 'EN', MS = show 'MS'
   * The .lang-text span holds the label text.
   */
  function updateLangBtn(data, animate) {
    const currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      const label = btn.querySelector('.lang-text');
      if (label) {
        label.textContent = currentLang === 'ms' ? 'EN' : 'MS';
      }
      btn.setAttribute('aria-label',
        currentLang === 'ms' ? 'Switch to English' : 'Switch to Bahasa Melayu'
      );

      // Pop animation
      if (animate) {
        btn.classList.remove('pop');
        void btn.offsetWidth;
        btn.classList.add('pop');
        setTimeout(() => btn.classList.remove('pop'), 320);
      }
    });
  }

  /**
   * Load a language pack and apply it.
   * @param {string} lang - 'en' or 'ms'
   * @param {boolean} animate - trigger pop on toggle btn
   */
  function loadLanguage(lang, animate) {
    fetch(resolveLangPath(lang))
      .then(function (res) {
        if (!res.ok) throw new Error('Language file not found: ' + lang);
        return res.json();
      })
      .then(function (data) {
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslation(data, animate);
      })
      .catch(function (err) {
        console.warn('[WeDRIVE Lang]', err.message);
      });
  }

  /**
   * Public: toggle between EN and BM.
   * Called by onclick on the toggle button.
   */
  window.toggleLanguage = function () {
    const current = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    loadLanguage(current === 'en' ? 'ms' : 'en', true);
  };

  /**
   * Public: set a specific language directly.
   */
  window.setLanguage = function (lang) {
    loadLanguage(lang);
  };

  /**
   * Init: apply saved language on page load.
   */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    loadLanguage(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
