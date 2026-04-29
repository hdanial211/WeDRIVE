/**
 * WeDRIVE - Sidebar Loader
 * shared/js/sidebar-loader.js
 *
 * Usage in HTML (admin pages):
 *
 *   <div id="sidebar-placeholder"
 *        data-component="sidebar-admin"
 *        data-page="admin">
 *   </div>
 *   <script src="../../shared/js/sidebar-loader.js"></script>
 *
 * Attributes on #sidebar-placeholder:
 *   data-component  - filename without .html (e.g. "sidebar-admin")
 *   data-page       - current page key to highlight active nav-item
 *                     (matches data-page on <a> inside the component)
 */

(function () {
  'use strict';

  function resolveBasePath() {
    // Use theme-link href to determine root prefix
    var link = document.getElementById('theme-link');
    if (link) {
      return link.getAttribute('href').replace(/shared\/css\/.*$/, '');
    }
    // Fallback: derive from pathname depth
    var parts  = window.location.pathname.split('/').filter(Boolean);
    var depth  = parts.length > 0 ? parts.length - 1 : 0;
    return depth === 0 ? '' : '../'.repeat(depth);
  }

  function resolveLinks(container, base) {
    // Fix data-logo src
    var logo = container.querySelector('[data-logo]');
    if (logo) {
      logo.src = base + 'shared/logo/wedrive-icon.png';
    }

    // Resolve all data-href values to real href
    container.querySelectorAll('[data-href]').forEach(function (el) {
      var href = el.getAttribute('data-href');
      if (href && href !== '#') {
        el.href = base + 'admin/pages/' + href.replace(/^(\.\.\/)+/, '');
        // For cross-module links already starting with ../../
        if (el.getAttribute('data-href').indexOf('../../') === 0) {
          el.href = base + el.getAttribute('data-href').replace(/^(\.\.\/)+/, '');
        }
      } else {
        el.href = '#';
      }
    });
  }

  function setActiveItem(container, currentPage) {
    if (!currentPage) return;
    container.querySelectorAll('.nav-item[data-page]').forEach(function (el) {
      el.classList.remove('active');
      if (el.getAttribute('data-page') === currentPage) {
        el.classList.add('active');
      }
    });
  }

  function loadSidebar() {
    var placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    var component   = placeholder.getAttribute('data-component') || 'sidebar-admin';
    var currentPage = placeholder.getAttribute('data-page') || '';
    var base        = resolveBasePath();
    var url         = base + 'shared/components/' + component + '.html';

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Cannot load sidebar: ' + url);
        return res.text();
      })
      .then(function (html) {
        placeholder.innerHTML = html;
        resolveLinks(placeholder, base);
        setActiveItem(placeholder, currentPage);
      })
      .catch(function (err) {
        console.warn('[WeDRIVE Sidebar]', err.message);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSidebar);
  } else {
    loadSidebar();
  }
})();
