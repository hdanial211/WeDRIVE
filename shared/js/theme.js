/**
 * WeDRIVE - Theme Toggle System (iOS Pill Switch)
 * shared/js/theme.js
 *
 * Manages the day/night pill toggle switch.
 * The HTML structure for the toggle button:
 *
 *   <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle theme">
 *     <span class="toggle-icon-left">☀</span>
 *     <span class="toggle-knob-icon">
 *       <span class="material-icons-round">light_mode</span>
 *     </span>
 *     <span class="toggle-icon-right">🌙</span>
 *   </button>
 */

(function () {
  const STORAGE_KEY = 'wedrive-theme';
  const DAY_HREF    = 'theme_day.css';
  const NIGHT_HREF  = 'theme_night.css';

  /**
   * Apply a theme by swapping the href of #theme-link
   * and updating all toggle buttons on the page.
   */
  function applyTheme(mode, animate) {
    const link = document.getElementById('theme-link');
    if (link) {
      const currentHref = link.getAttribute('href');
      const basePath    = currentHref.replace(/theme_(day|night)\.css$/, '');
      link.href = basePath + (mode === 'night' ? NIGHT_HREF : DAY_HREF);
    }
    localStorage.setItem(STORAGE_KEY, mode);
    updateToggleBtns(mode, animate);
  }

  /**
   * Update all .theme-toggle pill switches to reflect current mode.
   */
  function updateToggleBtns(mode, animate) {
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      const knobIcon = btn.querySelector('.toggle-knob-icon .material-icons-round');

      if (mode === 'night') {
        btn.classList.add('active');
        if (knobIcon) knobIcon.textContent = 'dark_mode';
        btn.setAttribute('aria-label', 'Switch to Day Mode');
      } else {
        btn.classList.remove('active');
        if (knobIcon) knobIcon.textContent = 'light_mode';
        btn.setAttribute('aria-label', 'Switch to Night Mode');
      }

      // Ripple animation
      if (animate) {
        btn.classList.remove('ripple');
        void btn.offsetWidth; // reflow
        btn.classList.add('ripple');
        setTimeout(() => btn.classList.remove('ripple'), 450);
      }

      btn.dataset.currentTheme = mode;
    });
  }

  /**
   * Public: toggle between day and night.
   */
  window.toggleTheme = function () {
    const current = localStorage.getItem(STORAGE_KEY) || 'day';
    applyTheme(current === 'night' ? 'day' : 'night', true);
  };

  /**
   * Init on DOM ready.
   */
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
