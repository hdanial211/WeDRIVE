/**
 * WeDRIVE - Theme Toggle System
 * shared/js/theme.js
 *
 * Usage: include this script in every HTML page
 * It auto-applies the saved theme and exposes toggleTheme()
 */

(function () {
  const STORAGE_KEY = 'wedrive-theme';
  const DAY_HREF   = 'theme_day.css';
  const NIGHT_HREF = 'theme_night.css';

  /**
   * Resolve the correct path to shared/css/ relative to the current page.
   * Works for pages at any depth (root, admin/pages/, customer/pages/, etc.)
   */
  function resolveSharedCssPath(filename) {
    const depth = window.location.pathname.split('/').filter(Boolean).length;
    // Each folder level needs one "../" to climb up
    // We climb up (depth - 1) times then go into shared/css/
    // But since we are dealing with file:// paths or server paths, 
    // we rely on the <link> tag's initial href pattern set by each HTML file.
    return filename;
  }

  /**
   * Apply a theme by swapping the href of #theme-link
   * and updating the toggle button icon/text.
   */
  function applyTheme(mode) {
    const link = document.getElementById('theme-link');
    if (!link) return;

    // Preserve the base path prefix (e.g. "../../shared/css/")
    const currentHref = link.getAttribute('href');
    const basePath = currentHref.replace(/theme_(day|night)\.css$/, '');

    link.href = basePath + (mode === 'night' ? NIGHT_HREF : DAY_HREF);
    localStorage.setItem(STORAGE_KEY, mode);
    updateToggleBtn(mode);
  }

  /**
   * Update all theme toggle buttons on the page.
   */
  function updateToggleBtn(mode) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      const icon = btn.querySelector('.material-icons-round');
      const label = btn.querySelector('.theme-label');
      if (mode === 'night') {
        if (icon) icon.textContent = 'light_mode';
        if (label) label.textContent = 'Day Mode';
        btn.setAttribute('aria-label', 'Switch to Day Mode');
      } else {
        if (icon) icon.textContent = 'dark_mode';
        if (label) label.textContent = 'Night Mode';
        btn.setAttribute('aria-label', 'Switch to Night Mode');
      }
      btn.dataset.currentTheme = mode;
    });
  }

  /**
   * Public: toggle between day and night.
   * Called by onclick on the button.
   */
  window.toggleTheme = function () {
    const current = localStorage.getItem(STORAGE_KEY) || 'day';
    applyTheme(current === 'night' ? 'day' : 'night');
  };

  /**
   * Init: run as soon as DOM is ready.
   */
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'day';
    applyTheme(saved);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
