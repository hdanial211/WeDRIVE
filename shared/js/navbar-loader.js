/**
 * WeDRIVE - Reusable Navbar Loader
 * shared/js/navbar-loader.js
 *
 * HOW TO USE:
 *   Replace the hard-coded <nav> block with:
 *
 *   Customer pages (index.html, customer/pages/customer.html):
 *     <div id="navbar-placeholder" data-module="customer"></div>
 *
 *   Admin pages (admin/pages/admin.html):
 *     <div id="navbar-placeholder" data-module="admin"></div>
 *
 *   Then include this script BEFORE main.js:
 *     <script src="../../shared/js/navbar-loader.js"></script>
 *
 * The loader auto-detects the base path so relative links always work.
 */

(function () {
  'use strict';

  // ─── PATH DETECTION ─────────────────────────────────────────────────────────
  // Resolve the base path to /shared/ from wherever the current page lives.

  function resolveBase() {
    var path = window.location.pathname;
    if (path.includes('/admin/pages/') || path.includes('/customer/pages/')) {
      return '../../';
    }
    return '';  // root level (index.html)
  }

  // ─── LINK DEFINITIONS ───────────────────────────────────────────────────────

  var NAV_CONFIG = {
    // Guest-facing pages (index.html)
    guest: {
      links: [
        { key: 'nav_browse', href: '{base}index.html',       label: 'Browse Cars', id: 'nl-browse' },
        { key: 'nav_how',    href: '{base}index.html#how',   label: 'How It Works', id: 'nl-how'    }
      ],
      actions: `
        <button class="btn-outline" onclick="window.location='{base}customer/pages/login.html'" data-key="nav_login">Log In</button>
        <button class="btn-primary" onclick="window.location='{base}customer/pages/login.html'" data-key="nav_signup">Sign Up</button>
      `
    },

    // Logged-in customer dashboard
    customer: {
      links: [
        { key: 'nav_browse',   href: '{base}customer/pages/customer.html',  label: 'Browse Cars',   id: 'nl-browse'   },
        { key: 'nav_bookings', href: '#bookings',                            label: 'My Bookings',   id: 'nl-bookings' },
        { key: 'nav_how',      href: '#how',                                 label: 'How It Works',  id: 'nl-how'      },
        { key: 'nav_ai',       href: '#',                                    label: 'AI Assistant',  id: 'nl-ai', extra: 'onclick="if(typeof toggleChat===\'function\') toggleChat(); return false;"' }
      ],
      actions: `
        <div class="user-pill" id="user-pill">
          <div class="user-av" id="user-av">CU</div>
          <span class="user-name" id="user-name-nav" data-key="nav_customer">Customer</span>
        </div>
        <button class="btn-logout" onclick="window.location='{base}index.html'">
          <span class="material-icons-round" style="font-size:16px">logout</span>
          <span data-key="nav_logout">Logout</span>
        </button>
      `
    },

    // Admin dashboard
    admin: {
      links: [
        { key: 'admin_nav_dash',  href: '{base}admin/pages/admin.html', label: 'Dashboard',  id: 'nl-dash'  },
        { key: 'admin_nav_cars',  href: '#cars',                         label: 'Cars',        id: 'nl-cars'  },
        { key: 'admin_nav_users', href: '#users',                        label: 'Customers',   id: 'nl-users' }
      ],
      actions: `
        <div class="user-pill" id="user-pill">
          <div class="user-av" id="user-av">AD</div>
          <span class="user-name" id="user-name-nav">Admin</span>
        </div>
        <button class="btn-logout" onclick="window.location='{base}index.html'">
          <span class="material-icons-round" style="font-size:16px">logout</span>
          <span data-key="nav_logout">Logout</span>
        </button>
      `
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  function renderNavbar(placeholder) {
    var module = (placeholder.dataset.module || 'guest').toLowerCase();
    var base   = resolveBase();
    var config = NAV_CONFIG[module] || NAV_CONFIG.guest;

    // Determine active link by current path
    var currentPath = window.location.pathname;

    // Build links HTML
    var linksHtml = config.links.map(function (link) {
      var href    = link.href.replace(/{base}/g, base);
      var isActive = currentPath.endsWith(href.replace(base, '').replace('{base}', '')) || false;
      var extra   = link.extra || '';
      return '<a href="' + href + '" class="nav-link' + (isActive ? ' active' : '') + '" id="' + link.id + '" data-key="' + link.key + '" ' + extra + '>' + link.label + '</a>';
    }).join('');

    // Build module-specific actions
    var actionsHtml = (config.actions || '').replace(/{base}/g, base);

    // Inject navbar HTML
    placeholder.innerHTML = [
      '<nav class="navbar" id="wedrive-navbar">',
      '  <div class="nav-brand">',
      '    <img class="brand-logo" id="navbar-logo" src="' + base + 'shared/logo/wedrive-icon.png" alt="WeDRIVE Logo" />',
      '    <div class="brand-text"><span class="we">We</span><span class="drive">DRIVE</span></div>',
      '  </div>',
      '  <div class="nav-links" id="navbar-links">' + linksHtml + '</div>',
      '  <div class="nav-actions" id="navbar-actions">',
      '    <button class="lang-toggle" onclick="toggleLanguage()" aria-label="Switch Language">',
      '      <span class="lang-text">MS</span>',
      '    </button>',
      '    <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle Theme">',
      '      <span class="material-icons-round">dark_mode</span>',
      '    </button>',
      actionsHtml,
      '  </div>',
      '</nav>'
    ].join('\n');

    // Inject navbar.css if not already present
    if (!document.getElementById('navbar-css')) {
      var link = document.createElement('link');
      link.id   = 'navbar-css';
      link.rel  = 'stylesheet';
      link.href = base + 'shared/css/navbar.css';
      document.head.appendChild(link);
    }
  }

  // ─── INIT ───────────────────────────────────────────────────────────────────

  function init() {
    var placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;
    renderNavbar(placeholder);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
