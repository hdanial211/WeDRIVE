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
        { key: 'nav_melaka', href: '{base}guest/pages/explore-melaka/explore-melaka.html',    label: 'Explore Melaka', id: 'nl-melaka' },
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
        { key: 'nav_bookings', href: '{base}customer/pages/my-bookings/my-bookings.html',      label: 'My Bookings',   id: 'nl-bookings' }
      ],
      actions: `
        <a href="{base}customer/pages/profile/profile.html" class="user-pill" id="user-pill" style="text-decoration:none;cursor:pointer;" title="My Profile">
          <div class="user-av" id="user-av">CU</div>
          <span class="user-name" id="user-name-nav" data-key="nav_customer">Customer</span>
        </a>
        <button class="btn-logout" onclick="(function(){ var sb=window.supabaseClient; if(sb){sb.auth.signOut().then(function(){localStorage.clear();window.location='{base}account/pages/login/login.html';})}else{localStorage.clear();window.location='{base}account/pages/login/login.html';} })()">
          <span class="material-icons-round" style="font-size:16px">logout</span>
          <span data-key="nav_logout">Logout</span>
        </button>
      `
    },

    // Admin dashboard
    admin: {
      iconOnly: true,
      hideBrand: true,
      links: [
        { key: 'admin_dashboard',     href: '{base}admin/pages/dashboard/admin.html', icon: 'dashboard',      label: 'Dashboard',       id: 'nl-dash'    },
        { key: 'sidebar_car',         href: '{base}admin/pages/car/cars.html',         icon: 'directions_car', label: 'Cars',            id: 'nl-cars'    },
        { key: 'sidebar_bookings',    href: '{base}admin/pages/booking/bookings.html', icon: 'receipt_long',   label: 'Bookings',        id: 'nl-bookings'},
        { key: 'sidebar_customers',   href: '{base}admin/pages/customer/customers.html', icon: 'people',       label: 'Customers',       id: 'nl-users'   },
        { key: 'sidebar_reports',     href: '{base}admin/pages/report/reports.html',   icon: 'bar_chart',    label: 'Reports',         id: 'nl-reports' },
        { key: 'nav_ai_intelligence', href: '{base}admin/pages/analytics/analytics.html', icon: 'auto_awesome', label: 'AI Intelligence', id: 'nl-ai'     }
      ],
      actions: ''
    }
  };

  // ─── RENDER ─────────────────────────────────────────────────────────────────

  function renderNavbar(placeholder) {
    var module = (placeholder.dataset.module || 'guest').toLowerCase();
    var base   = resolveBase();
    var config = NAV_CONFIG[module] || NAV_CONFIG.guest;

    // Determine active link by current path
    var currentPath = window.location.pathname;
    var isIconOnly  = config.iconOnly || false;

    // Build links HTML
    var linksHtml = config.links.map(function (link) {
      var href      = link.href.replace(/{base}/g, base);
      var cleanHref = href.replace(base, '').replace('{base}', '');
      var isActive  = currentPath.endsWith(cleanHref);

      if (!isActive && module === 'admin') {
        if (cleanHref.includes('/dashboard/') && (currentPath.includes('/dashboard/') || currentPath.endsWith('/admin.html'))) {
          isActive = true;
        } else if (cleanHref.includes('/car/') && currentPath.includes('/car/')) {
          isActive = true;
        } else if (cleanHref.includes('/booking/') && (currentPath.includes('/booking/') || currentPath.includes('/calendar/'))) {
          isActive = true;
        } else if (cleanHref.includes('/customer/') && currentPath.includes('/customer/')) {
          isActive = true;
        } else if (cleanHref.includes('/report/') && currentPath.includes('/report/')) {
          isActive = true;
        } else if (cleanHref.includes('/analytics/') && (currentPath.includes('/analytics/') || currentPath.includes('/chatbot/') || currentPath.includes('/marketing/'))) {
          isActive = true;
        }
      }

      var extra     = link.extra || '';
      if (isIconOnly && link.icon) {
        return '<a href="' + href + '" class="nav-link nav-icon-link' + (isActive ? ' active' : '') + '" id="' + link.id + '" data-key-title="' + link.key + '" title="' + link.label + '" aria-label="' + link.label + '" ' + extra + '><span class="material-icons-round">' + link.icon + '</span></a>';
      }
      return '<a href="' + href + '" class="nav-link' + (isActive ? ' active' : '') + '" id="' + link.id + '" data-key="' + link.key + '" ' + extra + '>' + link.label + '</a>';
    }).join('');

    // Build module-specific actions
    var actionsHtml = (config.actions || '').replace(/{base}/g, base);

    var brandLink = base + 'index.html';
    if (module === 'customer') brandLink = base + 'customer/pages/dashboard/customer.html';
    else if (module === 'admin') brandLink = base + 'admin/pages/dashboard/admin.html';
    else if (module === 'guest') brandLink = base + 'index.html';

    var hideBrand = config.hideBrand || (module === 'admin');
    var brandHtml = '';
    if (!hideBrand) {
      brandHtml = [
        '  <a href="' + brandLink + '" class="nav-brand" style="text-decoration: none;">',
        '    <img class="brand-logo" id="navbar-logo" src="' + base + 'shared/logo/wedrive-icon.png" alt="WeDRIVE Logo" />',
        '    <div class="brand-text"><span class="we">We</span><span class="drive">DRIVE</span></div>',
        '  </a>'
      ].join('\n');
    }

    var navbarClasses = ['navbar'];
    if (hideBrand) navbarClasses.push('navbar-no-brand');

    // Inject navbar HTML
    placeholder.innerHTML = [
      '<nav class="' + navbarClasses.join(' ') + '" id="wedrive-navbar">',
      brandHtml,
      '  <div class="nav-links' + (isIconOnly ? ' nav-icons-bar' : '') + '" id="navbar-links">' + linksHtml + '</div>',
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
    ].filter(Boolean).join('\n');
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
