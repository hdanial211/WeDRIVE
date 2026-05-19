/**
 * WeDRIVE - Search Popup (Shared / Universal)
 * shared/js/search-popup.js
 *
 * Self-initialising module. Works on ANY page that includes this script.
 * Automatically:
 *   - Injects shared/css/search-popup.css
 *   - Wires focus on .search-field-compact input, #faq-search, [data-search-popup]
 *   - Reads car data from window.WeDriveAPI.getCars()
 *
 * To open from any page:  window.openSearchPopup()
 * To open with query:     window.openSearchPopup('BMW')
 */

(function () {
  'use strict';

  /* ── State ── */
  var overlay, spInput, spResults;
  var allCarsCache = [];
  var searchTimer  = null;
  var SKELETON_N   = 4;
  var initialized  = false;

  /* ── Resolve base path relative to current page ── */
  function basePath() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  /* ── Inject CSS (once) ── */
  function injectCSS() {
    if (document.getElementById('sp-css')) return;
    var link = document.createElement('link');
    link.id   = 'sp-css';
    link.rel  = 'stylesheet';
    link.href = basePath() + 'shared/css/search-popup.css';
    document.head.appendChild(link);
  }

  /* ── Build popup DOM (once) ── */
  function buildPopup() {
    if (document.getElementById('sp-overlay')) {
      overlay   = document.getElementById('sp-overlay');
      spInput   = document.getElementById('sp-input');
      spResults = document.getElementById('sp-results');
      return;
    }

    overlay = document.createElement('div');
    overlay.id        = 'sp-overlay';
    overlay.className = 'sp-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search cars');

    var modal = document.createElement('div');
    modal.className   = 'sp-modal';
    modal.innerHTML   = [
      '<div class="sp-input-row">',
      '  <span class="material-icons-round">search</span>',
      '  <input type="text" id="sp-input" placeholder="Search cars, type, brand..." autocomplete="off" />',
      '  <button class="sp-close-btn" id="sp-close-btn" aria-label="Close">',
      '    <span class="material-icons-round">close</span>',
      '  </button>',
      '</div>',
      '<div class="sp-results" id="sp-results"></div>'
    ].join('');

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    spInput   = document.getElementById('sp-input');
    spResults = document.getElementById('sp-results');

    /* Close on backdrop click */
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closePopup();
    });

    /* Close button */
    document.getElementById('sp-close-btn').addEventListener('click', closePopup);

    /* Typing → debounced search */
    spInput.addEventListener('input', function () {
      clearTimeout(searchTimer);
      var q = spInput.value.trim();
      if (!q) { renderDefault(); return; }
      showSkeleton();
      searchTimer = setTimeout(function () { runSearch(q); }, 350);
    });

    /* ESC key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePopup();
    });
  }

  /* ── Open ── */
  function openPopup(prefill) {
    injectCSS();
    buildPopup();
    overlay.classList.add('open');
    spInput.value = prefill || '';
    document.body.style.overflow = 'hidden';

    setTimeout(function () { spInput.focus(); }, 100);

    if (prefill && prefill.trim()) {
      showSkeleton();
      searchTimer = setTimeout(function () { runSearch(prefill.trim()); }, 350);
    } else {
      renderDefault();
    }
  }

  /* ── Close ── */
  function closePopup() {
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    clearTimeout(searchTimer);
  }

  /* ── Skeleton ── */
  function showSkeleton() {
    var html = '<div class="sp-skeleton-list">';
    for (var i = 0; i < SKELETON_N; i++) {
      html += [
        '<div class="sp-skeleton-item">',
        '  <div class="sp-skel-thumb"></div>',
        '  <div class="sp-skel-lines">',
        '    <div class="sp-skel-line short"></div>',
        '    <div class="sp-skel-line long"></div>',
        '  </div>',
        '</div>'
      ].join('');
    }
    html += '</div>';
    spResults.innerHTML = html;
  }

  /* ── Default (no query): show first 6 cars ── */
  function renderDefault() {
    spResults.innerHTML = '<div class="sp-section-label">All Cars</div>';
    loadCars(function (cars) { renderList(cars.slice(0, 6), ''); });
  }

  /* ── Search ── */
  function runSearch(q) {
    loadCars(function (cars) {
      var ql = q.toLowerCase();
      var matched = cars.filter(function (c) {
        return (c.name     || '').toLowerCase().includes(ql) ||
               (c.category || '').toLowerCase().includes(ql) ||
               (c.brand    || '').toLowerCase().includes(ql) ||
               (c.type     || '').toLowerCase().includes(ql);
      });
      renderList(matched, q);
    });
  }

  /* ── Render list ── */
  function renderList(cars, q) {
    if (!cars.length) {
      spResults.innerHTML = [
        '<div class="sp-empty">',
        '  <span class="material-icons-round">manage_search</span>',
        q ? 'No cars found for <strong>"' + escHtml(q) + '"</strong>' : 'No cars available.',
        '</div>'
      ].join('');
      return;
    }

    var html = '';
    if (!q) html += '<div class="sp-section-label">Available Cars</div>';

    cars.forEach(function (car) {
      var name   = escHtml(car.name || 'Car');
      var cat    = escHtml(car.category || car.type || '');
      var price  = car.pricePerDay ? 'RM ' + car.pricePerDay + '/day' : '';
      var avail  = String(car.status || '').toLowerCase() === 'available';
      var dotCls = avail ? 'sp-status-dot' : 'sp-status-dot rented';
      var statusTxt = avail ? 'Available' : 'Rented';
      var imgSrc = resolveImg(car);
      var highlighted = q ? highlight(name, q) : name;

      html += [
        '<div class="sp-item" data-car-id="' + escHtml(String(car.id || '')) + '">',
        '  <div class="sp-item-thumb">',
        imgSrc
          ? '<img src="' + imgSrc + '" alt="' + name + '" loading="lazy" />'
          : '<span class="material-icons-round">directions_car</span>',
        '  </div>',
        '  <div class="sp-item-info">',
        '    <div class="sp-item-name">' + highlighted + '</div>',
        '    <div class="sp-item-meta">',
        '      <span class="' + dotCls + '"></span>' + statusTxt + (cat ? ' &middot; ' + cat : ''),
        '    </div>',
        '  </div>',
        price ? '<div class="sp-item-price">' + price + '</div>' : '',
        '</div>'
      ].join('');
    });

    spResults.innerHTML = html;

    /* Click → go to car details */
    spResults.querySelectorAll('.sp-item').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.getAttribute('data-car-id');
        closePopup();
        /* Resolve the correct path from any page depth */
        var base = basePath();
        window.location.href = base + 'customer/pages/car-details/car-details.html?id=' + encodeURIComponent(id);
      });
    });
  }

  /* ── Load cars via shared API ── */
  function loadCars(cb) {
    if (allCarsCache.length) { cb(allCarsCache); return; }
    if (window.WeDriveAPI && typeof window.WeDriveAPI.getCars === 'function') {
      window.WeDriveAPI.getCars().then(function (cars) {
        allCarsCache = cars || [];
        cb(allCarsCache);
      }).catch(function () { cb([]); });
    } else {
      /* Retry once after API loads */
      window.addEventListener('WeDriveAPIReady', function () {
        window.WeDriveAPI.getCars().then(function (cars) {
          allCarsCache = cars || [];
          cb(allCarsCache);
        }).catch(function () { cb([]); });
      }, { once: true });
      /* Fallback timeout */
      setTimeout(function () {
        if (!allCarsCache.length) cb([]);
      }, 3000);
    }
  }

  /* ── Helpers ── */
  function resolveImg(car) {
    var file = car && car.images && car.images.length ? car.images[0] : '';
    if (!file) return '';
    return basePath() + 'shared/model/' + file;
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlight(text, q) {
    if (!q) return text;
    var esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('(' + esc + ')', 'gi'), '<mark>$1</mark>');
  }

  /* ── Wire triggers on the current page ── */
  function wireTriggers() {
    if (initialized) return;
    initialized = true;

    /* .search-field-compact input  (dashboard) */
    document.querySelectorAll('.search-field-compact input').forEach(function (inp) {
      if (inp.id === 'pickup-date' || inp.id === 'return-date') return; // Skip date pickers
      inp.addEventListener('focus', function () { openPopup(inp.value || ''); inp.blur(); });
    });

    /* .search-btn-compact  (search button) */
    var btn = document.querySelector('.search-btn-compact');
    if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); openPopup(''); });

    /* #faq-search  (support page) */
    var faq = document.getElementById('faq-search');
    if (faq) faq.addEventListener('focus', function () { openPopup(faq.value || ''); faq.blur(); });

    /* [data-search-popup]  (any future input) */
    document.querySelectorAll('[data-search-popup]').forEach(function (el) {
      el.addEventListener('focus', function () { openPopup(el.value || ''); el.blur(); });
      el.addEventListener('click', function () { openPopup(el.value || ''); });
    });
  }

  /* ── Auto-init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireTriggers);
  } else {
    wireTriggers();
  }

  /* ── Public API ── */
  window.openSearchPopup = openPopup;
  window.closeSearchPopup = closePopup;

})();
