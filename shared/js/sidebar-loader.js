/**
 * WeDRIVE - Contextual Sidebar Loader (Apple HIG Sub-Navigation Architecture)
 * shared/js/sidebar-loader.js
 *
 * HOW IT WORKS:
 *   - Topbar controls the 6 Main modules (Dashboard, Cars, Bookings, Customers, Reports, AI Intelligence).
 *   - Sidebar contextually adapts to display only the sub-navigation tools belonging to the active module.
 *   - Each sub-item navigates to an actual physical page or activates interactive view filters.
 */

(function () {
  'use strict';

  // ─── CONTEXTUAL SUB-NAVIGATION DEFINITIONS ─────────────────────────────────
  var SIDEBAR_MODULES = {
    dashboard: {
      sectionKey: 'nav_sec_dashboard',
      sectionLabel: 'Papan Pemuka',
      items: [
        { page: 'admin', href: 'dashboard/admin.html', icon: 'dashboard', key: 'sidebar_overview', label: 'Ringkasan Utama' },
        { page: 'operations', href: 'dashboard/admin.html#operations', icon: 'speed', key: 'admin_stat_active', label: 'Status Operasi' }
      ]
    },
    car: {
      sectionKey: 'nav_sec_car_mgmt',
      sectionLabel: 'Pengurusan Kereta',
      items: [
        { page: 'car-all', href: 'car/cars.html', icon: 'directions_car', key: 'sidebar_all_cars', label: 'Semua Kenderaan' },
        { page: 'car-available', href: 'car/cars.html?filter=Available', icon: 'check_circle', key: 'sidebar_available_cars', label: 'Kenderaan Tersedia' },
        { page: 'car-rented', href: 'car/cars.html?filter=Rented', icon: 'car_rental', key: 'sidebar_rented_cars', label: 'Sedang Disewa' },
        { page: 'car-add', href: 'car/cars.html?action=add', icon: 'add_circle', key: 'sidebar_add_car', label: 'Tambah Kereta Baharu' }
      ]
    },
    booking: {
      sectionKey: 'nav_sec_booking_mgmt',
      sectionLabel: 'Pengurusan Tempahan',
      items: [
        { page: 'bookings-all', href: 'booking/bookings.html', icon: 'receipt_long', key: 'sidebar_all_bookings', label: 'Semua Tempahan' },
        { page: 'calendar', href: 'calendar/calendar.html', icon: 'calendar_month', key: 'sidebar_calendar', label: 'Kalendar Tempahan' },
        { page: 'bookings-active', href: 'booking/bookings.html?status=Active', icon: 'bolt', key: 'sidebar_active_bookings', label: 'Tempahan Aktif' },
        { page: 'bookings-add', href: 'booking/bookings.html?action=add', icon: 'add_circle', key: 'sidebar_add_booking', label: 'Cipta Tempahan' }
      ]
    },
    customer: {
      sectionKey: 'nav_sec_cust_mgmt',
      sectionLabel: 'Pengurusan Pelanggan',
      items: [
        { page: 'customers-all', href: 'customer/customers.html', icon: 'people', key: 'sidebar_customers', label: 'Direktori Pelanggan' },
        { page: 'customers-pending', href: 'customer/customers.html?filter=pending', icon: 'verified_user', key: 'sidebar_pending_verifications', label: 'Pengesahan Lesen' }
      ]
    },
    report: {
      sectionKey: 'nav_sec_report_mgmt',
      sectionLabel: 'Laporan & Analitik',
      items: [
        { page: 'reports-summary', href: 'report/reports.html', icon: 'bar_chart', key: 'sidebar_reports', label: 'Laporan Hasil & Sewaan' },
        { page: 'reports-export', href: 'report/reports.html?tab=export', icon: 'file_download', key: 'sidebar_export_reports', label: 'Eksport Laporan Data' }
      ]
    },
    ai: {
      sectionKey: 'nav_sec_ai_suite',
      sectionLabel: 'Kecerdasan AI',
      items: [
        { page: 'analytics', href: 'analytics/analytics.html', icon: 'insights', key: 'sidebar_ai_analytics', label: 'Analisis Data AI' },
        { page: 'chatbot-settings', href: 'chatbot/chatbot.html', icon: 'smart_toy', key: 'sidebar_ai_api_chatbot', label: 'Kunci API & Chatbot AI' },
        { page: 'marketing', href: 'marketing/marketing.html', icon: 'campaign', key: 'sidebar_ai_marketing', label: 'Pemasaran Pintar AI' }
      ]
    }
  };

  // ─── PATH DETECTION ─────────────────────────────────────────────────────────
  function resolveBasePath() {
    var link = document.querySelector('link[href*="shared/css/"]');
    if (link) {
      return link.getAttribute('href').replace(/shared\/css\/.*$/, '');
    }
    var script = document.querySelector('script[src*="shared/js/"]');
    if (script) {
      return script.getAttribute('src').replace(/shared\/js\/.*$/, '');
    }
    var parts  = window.location.pathname.split('/').filter(Boolean);
    var depth  = parts.length > 0 ? parts.length - 1 : 0;
    return depth === 0 ? '' : '../'.repeat(depth);
  }

  // ─── MODULE & ACTIVE SUB-ITEM DETECTION ─────────────────────────────────────
  function detectActiveModule(placeholder) {
    var ctx = placeholder.getAttribute('data-context') || placeholder.getAttribute('data-module-sub');
    if (ctx && SIDEBAR_MODULES[ctx]) return ctx.toLowerCase();

    var path = window.location.pathname;
    if (path.includes('/analytics/') || path.includes('/chatbot/') || path.includes('/marketing/')) {
      return 'ai';
    }
    if (path.includes('/car/')) {
      return 'car';
    }
    if (path.includes('/booking/') || path.includes('/calendar/')) {
      return 'booking';
    }
    if (path.includes('/customer/')) {
      return 'customer';
    }
    if (path.includes('/report/')) {
      return 'report';
    }
    if (path.includes('/dashboard/') || path.endsWith('/admin.html')) {
      return 'dashboard';
    }
    return 'dashboard';
  }

  function detectActiveSubItem(items, currentPage) {
    var search = window.location.search || '';
    var pathname = window.location.pathname || '';

    // 1. If explicit query parameter match (e.g. ?filter=Available or ?action=add)
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.href.indexOf('?') !== -1) {
        var q = it.href.split('?')[1];
        if (search.indexOf(q) !== -1) {
          return it.page;
        }
      }
    }

    // 2. If no search query or non-query item matching current path
    for (var j = 0; j < items.length; j++) {
      var item = items[j];
      if (item.href.indexOf('?') === -1 && item.href.indexOf('#') === -1) {
        var cleanHref = item.href.replace(/\.html$/, '');
        if (pathname.indexOf(cleanHref) !== -1) {
          return item.page;
        }
      }
    }

    // 3. Fallback to currentPage passed from HTML placeholder
    return currentPage || (items.length ? items[0].page : '');
  }

  // ─── RENDER CONTEXTUAL SUB-NAV ──────────────────────────────────────────────
  function renderContextualNav(container, activeModule, base, currentPage) {
    var mod = SIDEBAR_MODULES[activeModule] || SIDEBAR_MODULES.dashboard;
    var navEl = container.querySelector('.sidebar-nav');
    if (!navEl) return;

    var activePage = detectActiveSubItem(mod.items, currentPage);

    var html = [
      '<div class="nav-section" data-key="' + mod.sectionKey + '">' + mod.sectionLabel + '</div>'
    ];

    mod.items.forEach(function (item) {
      var fullHref = base + 'admin/pages/' + item.href;
      var isActive = (item.page === activePage);
      html.push(
        '<a class="nav-item' + (isActive ? ' active' : '') + '" data-page="' + item.page + '" href="' + fullHref + '">' +
          '<span class="material-icons-round">' + item.icon + '</span>' +
          '<span data-key="' + item.key + '">' + item.label + '</span>' +
        '</a>'
      );
    });

    navEl.innerHTML = html.join('\n');
  }

  function resolveLinks(container, base) {
    // Fix data-logo src
    var logo = container.querySelector('[data-logo]');
    if (logo) {
      logo.src = base + 'shared/logo/wedrive-icon.png';
    }

    // Resolve brand link
    var brandLink = container.querySelector('.sidebar-brand');
    if (brandLink) {
      brandLink.href = base + 'admin/pages/dashboard/admin.html';
    }

    // Resolve footer links
    var settingsLink = container.querySelector('.sidebar-footer a[data-page="settings"]');
    if (settingsLink) {
      settingsLink.href = base + 'admin/pages/setting/settings.html';
      if (window.location.pathname.includes('/setting/')) {
        settingsLink.classList.add('active');
      }
    }

    // Attach logout handler
    var logoutBtn = container.querySelector('.nav-item.logout');
    if (logoutBtn) {
      logoutBtn.href = '#';
      logoutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var sb = window.supabaseClient;
        if (sb) {
          sb.auth.signOut().then(function () {
            localStorage.clear();
            window.location.href = base + 'account/pages/login/login.html';
          });
        } else {
          localStorage.clear();
          window.location.href = base + 'account/pages/login/login.html';
        }
      });
    }
  }

  function setupMobileToggle(container) {
    if (document.querySelector('.sidebar-toggle')) return;

    var sidebar = container.querySelector('.sidebar');
    if (!sidebar) return;

    var toggle = document.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = '<span class="material-icons-round">menu</span>';
    document.body.appendChild(toggle);

    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    function openSidebar() {
      sidebar.classList.add('open');
      overlay.classList.add('active');
      toggle.querySelector('.material-icons-round').textContent = 'close';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
      toggle.querySelector('.material-icons-round').textContent = 'menu';
    }

    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    overlay.addEventListener('click', closeSidebar);

    container.querySelectorAll('.nav-item').forEach(function (item) {
      item.addEventListener('click', function () {
        if (window.innerWidth <= 900) {
          closeSidebar();
        }
      });
    });
  }

  function loadSidebar() {
    var placeholder = document.getElementById('sidebar-placeholder');
    if (!placeholder) return;

    var component   = placeholder.getAttribute('data-component') || 'sidebar-admin';
    var currentPage = placeholder.getAttribute('data-page') || '';
    var base        = resolveBasePath();

    var sidebarPath = 'admin/components/sidebar/' + component + '.html?v=5.3.5';
    var url         = base + sidebarPath;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Cannot load sidebar: ' + url);
        return res.text();
      })
      .then(function (html) {
        placeholder.innerHTML = html;

        if (component === 'sidebar-admin') {
          var activeModule = detectActiveModule(placeholder);
          renderContextualNav(placeholder, activeModule, base, currentPage);
        }

        resolveLinks(placeholder, base);
        setupMobileToggle(placeholder);

        if (typeof window.setLanguage === 'function') {
          var lang = localStorage.getItem('wedrive_lang') || localStorage.getItem('wedrive-lang') || 'ms';
          window.setLanguage(lang);
        }

        // Auto-load Admin Session Inactivity Timeout Guardian
        if (component === 'sidebar-admin' && !window.WeDriveAdminSession && !document.querySelector('script[src*="admin-idle-timeout.js"]')) {
          var timeoutScript = document.createElement('script');
          timeoutScript.src = base + 'admin/js/admin-idle-timeout.js?v=5.2.77';
          document.body.appendChild(timeoutScript);
        }
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
