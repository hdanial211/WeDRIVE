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
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  // ─── LINK DEFINITIONS ───────────────────────────────────────────────────────

  var NAV_CONFIG = {
    // Guest-facing pages
    guest: {
      links: [
        { key: 'nav_browse', href: '{base}index.html',                                       label: 'Browse Cars', id: 'nl-browse' },
        { key: 'nav_melaka', href: '{base}guest/pages/explore-melaka/explore-melaka.html',    label: 'Jalan-jalan Melaka', id: 'nl-melaka' },
        { key: 'nav_how',    href: '{base}guest/pages/how-it-works/how-it-works.html',        label: 'How It Works', id: 'nl-how'    }
      ],
      actions: `
        <button class="btn-outline" onclick="window.location='{base}account/pages/login/login.html'" data-key="nav_login">Log In</button>
        <button class="btn-primary" onclick="window.location='{base}account/pages/signup/signup.html'" data-key="nav_signup">Sign Up</button>
      `
    },

    // Logged-in customer dashboard
    customer: {
      links: [
        { key: 'nav_browse',   href: '{base}customer/pages/dashboard/customer.html',           label: 'Browse Cars',   id: 'nl-browse'   },
        { key: 'nav_bookings', href: '{base}customer/pages/my-bookings/my-bookings.html',      label: 'My Bookings',   id: 'nl-bookings' },
        { key: 'nav_ai',       href: '{base}customer/pages/ai-insights/ai-insights.html',       label: 'AI Insights',   id: 'nl-ai' }
      ],
      actions: `
        <a href="{base}customer/pages/profile/profile.html" class="user-pill" id="user-pill" style="text-decoration:none;cursor:pointer;" title="My Profile">
          <div class="user-av" id="user-av">CU</div>
          <span class="user-name" id="user-name-nav" data-key="nav_customer">Customer</span>
        </a>
        <button class="btn-logout" onclick="window.location='{base}customer/pages/dashboard/customer.html'">
          <span class="material-icons-round" style="font-size:16px">logout</span>
          <span data-key="nav_logout">Logout</span>
        </button>
      `
    },

    // Admin dashboard
    admin: {
      links: [
        { key: 'admin_nav_dash',  href: '{base}admin/pages/dashboard/admin.html', label: 'Dashboard',  id: 'nl-dash'  },
        { key: 'admin_nav_cars',  href: '{base}admin/pages/car/cars.html',         label: 'Cars',        id: 'nl-cars'  },
        { key: 'admin_nav_users', href: '{base}admin/pages/customer/customers.html', label: 'Customers',   id: 'nl-users' }
      ],
      actions: `
        <div class="user-pill" id="user-pill">
          <div class="user-av" id="user-av">AD</div>
          <span class="user-name" id="user-name-nav">Admin</span>
        </div>
        <button class="btn-logout" onclick="window.location='{base}admin/pages/dashboard/admin.html'">
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

    var brandLink = base + 'index.html';
    if (module === 'customer') brandLink = base + 'customer/pages/dashboard/customer.html';
    else if (module === 'admin') brandLink = base + 'admin/pages/dashboard/admin.html';
    else if (module === 'guest') brandLink = base + 'index.html';

    // Inject navbar HTML
    placeholder.innerHTML = [
      '<nav class="navbar" id="wedrive-navbar">',
      '  <a href="' + brandLink + '" class="nav-brand" style="text-decoration: none;">',
      '    <img class="brand-logo" id="navbar-logo" src="' + base + 'shared/logo/wedrive-icon.png" alt="WeDRIVE Logo" />',
      '    <div class="brand-text"><span class="we">We</span><span class="drive">DRIVE</span></div>',
      '  </a>',
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
