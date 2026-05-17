/**
 * WeDRIVE - Customer Sidebar Loader
 * customer/js/sidebar-loader.js
 *
 * HOW TO USE:
 *   Add these two elements to any customer page:
 *     <div id="customer-sidebar-placeholder"></div>
 *     <div id="mobile-menu-placeholder"></div>
 *
 *   Then wrap main content in:
 *     <main class="customer-main" id="customer-main">...</main>
 *
 *   Include this script:
 *     <script src="../../js/sidebar-loader.js"></script>
 */

(function () {
  'use strict';

  // Resolve base path from current page location
  function resolveBase() {
    var path = window.location.pathname;
    // Deep nested: customer/pages/car-details/booking/payment/...
    var depth = (path.match(/\//g) || []).length;
    // Count segments after 'customer/pages/'
    var match = path.match(/\/customer\/pages\/(.*)/);
    if (match) {
      var segments = match[1].split('/').filter(function(s) { return s.length > 0; });
      // segments.length - 1 is folder depth from customer/pages/
      // We need to go: ../../ from customer/pages/X/ to get to root customer/
      // And ../../../ to get to project root
      var ups = segments.length + 1; // +1 because pages/ itself
      var base = '';
      for (var i = 0; i < ups; i++) base += '../';
      return base;
    }
    return '../../../';
  }

  // Sidebar nav items configuration
  var NAV_ITEMS = [
    { icon: 'dashboard',      key: 'nav_dashboard', label: 'Dashboard',    page: 'dashboard',   href: '{base}customer/pages/dashboard/customer.html' },
    { icon: 'calendar_month', key: 'nav_bookings',  label: 'My Bookings',  page: 'my-bookings', href: '{base}customer/pages/my-bookings/my-bookings.html' },
    { icon: 'psychology',     key: 'nav_ai',        label: 'AI Insights',  page: 'ai-insights', href: '{base}customer/pages/ai-insights/ai-insights.html' }
  ];

  var FOOTER_ITEMS = [
    { icon: 'settings', key: 'nav_settings', label: 'Settings', page: 'profile',  href: '{base}customer/pages/profile/profile.html' },
    { icon: 'help',     key: 'nav_support',  label: 'Support',  page: 'support',  href: '{base}customer/pages/support/support.html' },
    { icon: 'logout',   key: 'nav_logout',   label: 'Logout',   page: 'logout',   href: '{base}account/login.html', isLogout: true }
  ];

  function detectActivePage() {
    var path = window.location.pathname;
    if (path.includes('/dashboard/')) return 'dashboard';
    if (path.includes('/my-bookings/')) return 'my-bookings';
    if (path.includes('/profile/')) return 'profile';
    if (path.includes('/ai-insights/')) return 'ai-insights';
    if (path.includes('/support/')) return 'support';
    if (path.includes('/car-access/')) return 'my-bookings';
    if (path.includes('/car-details/')) return 'car-details';
    return 'dashboard';
  }

  function buildNavItems(items, base, activePage) {
    return items.map(function(item) {
      var href = item.href.replace(/{base}/g, base);
      var isActive = (activePage === item.page) ? ' active' : '';
      var logoutClass = item.isLogout ? ' sidebar-logout' : '';
      return '<a href="' + href + '" class="sidebar-nav-item' + isActive + logoutClass + '" data-page="' + item.page + '">' +
        '<span class="material-icons-round">' + item.icon + '</span>' +
        '<span data-key="' + item.key + '">' + item.label + '</span>' +
      '</a>';
    }).join('\n');
  }

  function renderSidebar(placeholder) {
    var base = resolveBase();
    var activePage = detectActivePage();

    placeholder.innerHTML = [
      '<aside class="customer-sidebar" id="customer-sidebar" aria-label="Customer sidebar">',
      '  <div class="sidebar-header">',
      '    <a href="' + base + 'index.html" class="sidebar-brand">',
      '      <img src="' + base + 'shared/logo/wedrive-icon.png" alt="" aria-hidden="true" class="sidebar-logo"/>',
      '      <div class="sidebar-brand-group">',
      '        <span class="sidebar-brand-text">WeDRIVE</span>',
      '        <span class="sidebar-brand-sub">Fleet Management</span>',
      '      </div>',
      '    </a>',
      '  </div>',
      '  <div class="sidebar-cta">',
      '    <button class="sidebar-book-btn" onclick="window.location=\'' + base + 'customer/pages/dashboard/customer.html\'">',
      '      <span class="material-icons-round">add</span>',
      '      <span data-key="cust_new_booking">New Booking</span>',
      '    </button>',
      '  </div>',
      '  <nav class="sidebar-nav" aria-label="Customer primary navigation">',
      buildNavItems(NAV_ITEMS, base, activePage),
      '  </nav>',
      '  <nav class="sidebar-footer-nav" aria-label="Customer account navigation">',
      buildNavItems(FOOTER_ITEMS, base, activePage),
      '  </nav>',
      '</aside>'
    ].join('\n');
  }

  function renderMobileBar(placeholder) {
    var base = resolveBase();
    placeholder.innerHTML = [
      '<nav class="mobile-menu-bar" id="mobile-menu-bar" aria-label="Customer mobile navigation">',
      '  <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">',
      '    <span class="material-icons-round">menu</span>',
      '  </button>',
      '  <a href="' + base + 'index.html" class="mobile-brand">',
      '    <img src="' + base + 'shared/logo/wedrive-icon.png" alt="" aria-hidden="true" class="mobile-logo"/>',
      '    <span>WeDRIVE</span>',
      '  </a>',
      '  <div class="mobile-actions">',
      '    <button class="icon-btn theme-toggle" id="theme-toggle-mobile" aria-label="Toggle theme" onclick="toggleTheme()">',
      '      <span class="material-icons-round">light_mode</span>',
      '    </button>',
      '  </div>',
      '</nav>',
      '<div class="sidebar-overlay" id="sidebar-overlay"></div>'
    ].join('\n');
  }

  function initSidebarToggle() {
    var toggle = document.getElementById('mobile-menu-toggle');
    var sidebar = document.getElementById('customer-sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (!toggle || !sidebar || !overlay) return;

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function() {
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    overlay.addEventListener('click', closeSidebar);
  }

  // Inject unified utility-actions (lang toggle + theme toggle) into the navbar
  function renderUtilityActions() {
    var target = document.querySelector('.utility-actions');
    if (!target) return;
    target.innerHTML = [
      '<button class="icon-btn lang-toggle" id="lang-toggle" aria-label="Switch language" onclick="toggleLanguage()">',
      '  <span class="lang-text">EN</span>',
      '</button>',
      '<button class="icon-btn theme-toggle" id="theme-toggle-desktop" aria-label="Toggle theme" onclick="toggleTheme()">',
      '  <span class="material-icons-round">light_mode</span>',
      '</button>'
    ].join('\n');
  }

  function init() {
    var sidebarPh = document.getElementById('customer-sidebar-placeholder');
    var mobilePh = document.getElementById('mobile-menu-placeholder');

    if (sidebarPh) renderSidebar(sidebarPh);
    if (mobilePh) renderMobileBar(mobilePh);

    // Inject unified navbar actions
    renderUtilityActions();

    // Small delay to let DOM render
    setTimeout(initSidebarToggle, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
