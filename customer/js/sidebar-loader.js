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
    { icon: 'dashboard',     key: 'nav_dashboard', label: 'Dashboard',   page: 'dashboard',   href: '{base}customer/pages/dashboard/customer.html' },
    { icon: 'calendar_today', key: 'nav_bookings',  label: 'My Bookings', page: 'my-bookings', href: '{base}customer/pages/my-bookings/my-bookings.html' },
    { icon: 'person',         key: 'nav_profile',   label: 'Profile',     page: 'profile',     href: '{base}customer/pages/profile/profile.html' },
    { icon: 'psychology',     key: 'nav_ai',        label: 'AI Insights', page: 'ai-insights', href: '{base}customer/pages/ai-insights/ai-insights.html' }
  ];

  var FOOTER_ITEMS = [
    { icon: 'help', key: 'nav_support', label: 'Support', page: 'support', href: '{base}customer/pages/support/support.html' }
  ];

  function detectActivePage() {
    var path = window.location.pathname;
    if (path.includes('/dashboard/')) return 'dashboard';
    if (path.includes('/my-bookings/')) return 'my-bookings';
    if (path.includes('/profile/')) return 'profile';
    if (path.includes('/ai-insights/')) return 'ai-insights';
    if (path.includes('/support/')) return 'support';
    if (path.includes('/car-details/')) return 'car-details';
    return 'dashboard';
  }

  function buildNavItems(items, base, activePage) {
    return items.map(function(item) {
      var href = item.href.replace(/{base}/g, base);
      var isActive = (activePage === item.page) ? ' active' : '';
      return '<a href="' + href + '" class="sidebar-nav-item' + isActive + '" data-page="' + item.page + '">' +
        '<span class="material-icons-round">' + item.icon + '</span>' +
        '<span data-key="' + item.key + '">' + item.label + '</span>' +
      '</a>';
    }).join('\n');
  }

  function renderSidebar(placeholder) {
    var base = resolveBase();
    var activePage = detectActivePage();

    placeholder.innerHTML = [
      '<aside class="customer-sidebar" id="customer-sidebar">',
      '  <div class="sidebar-header">',
      '    <a href="' + base + 'index.html" class="sidebar-brand">',
      '      <img src="' + base + 'shared/logo/wedrive-icon.png" alt="WeDRIVE" class="sidebar-logo"/>',
      '      <span class="sidebar-brand-text">WeDRIVE</span>',
      '    </a>',
      '    <div class="sidebar-user">',
      '      <div class="sidebar-avatar">',
      '        <span class="material-icons-round">person</span>',
      '      </div>',
      '      <div>',
      '        <p class="sidebar-user-name" data-key="cust_welcome">Welcome back</p>',
      '        <p class="sidebar-user-role" data-key="cust_hero_sub_short">Manage your rentals</p>',
      '      </div>',
      '    </div>',
      '  </div>',
      '  <nav class="sidebar-nav">',
      buildNavItems(NAV_ITEMS, base, activePage),
      '  </nav>',
      '  <div class="sidebar-cta">',
      '    <button class="sidebar-book-btn" onclick="window.location=\'' + base + 'customer/pages/dashboard/customer.html\'">',
      '      <span class="material-icons-round">directions_car</span>',
      '      <span data-key="cust_book_car">Book a Car</span>',
      '    </button>',
      '  </div>',
      '  <div class="sidebar-footer-nav">',
      buildNavItems(FOOTER_ITEMS, base, activePage),
      '  </div>',
      '</aside>'
    ].join('\n');
  }

  function renderMobileBar(placeholder) {
    var base = resolveBase();
    placeholder.innerHTML = [
      '<div class="mobile-menu-bar" id="mobile-menu-bar">',
      '  <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle menu">',
      '    <span class="material-icons-round">menu</span>',
      '  </button>',
      '  <a href="' + base + 'index.html" class="mobile-brand">',
      '    <img src="' + base + 'shared/logo/wedrive-icon.png" alt="WeDRIVE" class="mobile-logo"/>',
      '    <span>WeDRIVE</span>',
      '  </a>',
      '  <div class="mobile-actions">',
      '    <button class="icon-btn theme-toggle" id="theme-toggle-mobile" aria-label="Toggle theme">',
      '      <span class="material-icons-round">light_mode</span>',
      '    </button>',
      '  </div>',
      '</div>',
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

  function init() {
    var sidebarPh = document.getElementById('customer-sidebar-placeholder');
    var mobilePh = document.getElementById('mobile-menu-placeholder');

    if (sidebarPh) renderSidebar(sidebarPh);
    if (mobilePh) renderMobileBar(mobilePh);

    // Small delay to let DOM render
    setTimeout(initSidebarToggle, 50);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
