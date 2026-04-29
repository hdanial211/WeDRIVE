/**
 * WeDRIVE - Theme Toggle (Simple Icon Button)
 * shared/js/theme.js
 *
 * Button HTML (simple):
 *   <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
 *     <span class="material-icons-round">dark_mode</span>
 *   </button>
 *
 * Day mode  → icon: dark_mode  (moon, click to go night)
 * Night mode → icon: light_mode (sun, click to go day)
 */

(function () {
  const STORAGE_KEY = 'wedrive-theme';
  const DAY_HREF    = 'theme_day.css';
  const NIGHT_HREF  = 'theme_night.css';

  function applyTheme(mode, animate) {
    // Swap stylesheet
    const link = document.getElementById('theme-link');
    if (link) {
      const base = link.getAttribute('href').replace(/theme_(day|night)\.css$/, '');
      link.href  = base + (mode === 'night' ? NIGHT_HREF : DAY_HREF);
    }
    localStorage.setItem(STORAGE_KEY, mode);
    updateBtns(mode, animate);
  }

  function updateBtns(mode, animate) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      const icon = btn.querySelector('.material-icons-round');
      if (!icon) return;

      // Trigger pop animation
      if (animate) {
        btn.classList.remove('pop');
        void btn.offsetWidth; // reflow
        btn.classList.add('pop');
        setTimeout(() => btn.classList.remove('pop'), 320);
      }

      // Night mode → show sun (so user can switch back to day)
      // Day mode   → show moon (so user can switch to night)
      icon.textContent = mode === 'night' ? 'light_mode' : 'dark_mode';
      btn.setAttribute('aria-label', mode === 'night' ? 'Switch to Day Mode' : 'Switch to Night Mode');
      btn.dataset.mode = mode;
    });
  }

  window.toggleTheme = function () {
    const current = localStorage.getItem(STORAGE_KEY) || 'day';
    applyTheme(current === 'night' ? 'day' : 'night', true);
  };

  function init() {
    const saved = localStorage.getItem(STORAGE_KEY) || 'day';
    applyTheme(saved, false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
