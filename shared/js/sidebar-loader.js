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

  function setActiveItem(container, currentPage) {
    if (!currentPage) return;
    container.querySelectorAll('.nav-item[data-page]').forEach(function (el) {
      el.classList.remove('active');
      if (el.getAttribute('data-page') === currentPage) {
        el.classList.add('active');
      }
    });
  }

  function setupMobileToggle(container) {
    // Only inject if not already present
    if (document.querySelector('.sidebar-toggle')) return;

    var sidebar = container.querySelector('.sidebar');
    if (!sidebar) return;

    // Create hamburger toggle button
    var toggle = document.createElement('button');
    toggle.className = 'sidebar-toggle';
    toggle.setAttribute('aria-label', 'Toggle menu');
    toggle.innerHTML = '<span class="material-icons-round">menu</span>';
    document.body.appendChild(toggle);

    // Create overlay
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

    // Close sidebar when nav item is clicked (mobile)
    container.querySelectorAll('.nav-item').forEach(function (item) {
      item.addEventListener('click', function () {
        if (window.innerWidth <= 900) {
          closeSidebar();
        }
      });
    });
  }

  // ─── ADMIN CONTEXTUAL SUB-ITEMS CONFIGURATION ──────────────────────────────
  var ADMIN_CONTEXT_MODULES = {
    dashboard: {
      sectionKey: 'nav_sec_dashboard',
      sectionLabel: 'Dashboard Tools',
      items: [
        { key: 'sb_dash_overview',      label: 'Metrics Overview',    icon: 'insights',        href: 'dashboard/admin.html#overview',       action: 'scroll-overview',      page: 'admin' },
        { key: 'sb_dash_forecast',      label: 'AI Demand Forecast',  icon: 'auto_awesome',    href: 'dashboard/admin.html#ai-forecast',    action: 'scroll-ai' },
        { key: 'sb_dash_car_status',    label: 'Current Car Status',  icon: 'directions_car',  href: 'dashboard/admin.html#car-status',     action: 'scroll-car-status' },
        { key: 'sb_dash_quick_actions', label: 'Quick Actions',       icon: 'bolt',            href: 'dashboard/admin.html#quick-actions',  action: 'scroll-quick-actions' }
      ]
    },
    cars: {
      sectionKey: 'sidebar_car',
      sectionLabel: 'Cars Management',
      items: [
        { key: 'sb_car_all',            label: 'All Cars',            icon: 'directions_car',  href: 'car/cars.html',                       action: 'filter-car-all',       page: 'car' },
        { key: 'sb_car_available',      label: 'Available Cars',      icon: 'check_circle',    href: 'car/cars.html#available',             action: 'filter-car-available' },
        { key: 'sb_car_rented',         label: 'Rented Cars',         icon: 'key',             href: 'car/cars.html#rented',                action: 'filter-car-rented' },
        { key: 'sb_car_add',            label: 'Add New Car',         icon: 'add_circle',      href: 'car/cars.html#add-car',               action: 'add-new-car' },
        { key: 'sb_car_toggle_view',    label: 'Toggle View',         icon: 'view_list',       href: 'car/cars.html#view-toggle',           action: 'toggle-car-view' }
      ]
    },
    bookings: {
      sectionKey: 'sidebar_bookings',
      sectionLabel: 'Bookings & Schedule',
      items: [
        { key: 'sb_bk_all',             label: 'All Bookings',        icon: 'receipt_long',    href: 'booking/bookings.html',               action: 'filter-bk-all',        page: 'bookings' },
        { key: 'sb_bk_today',           label: "Today's Handovers",   icon: 'today',           href: 'booking/bookings.html#today-pickups-card', action: 'scroll-today-pickups' },
        { key: 'sidebar_calendar',      label: 'Calendar View',       icon: 'calendar_month',  href: 'calendar/calendar.html',              page: 'calendar' },
        { key: 'sb_bk_active',          label: 'Active Rentals',      icon: 'timelapse',       href: 'booking/bookings.html#active',        action: 'filter-bk-active' },
        { key: 'sb_bk_pending',         label: 'Pending Approval',    icon: 'pending_actions', href: 'booking/bookings.html#pending',       action: 'filter-bk-pending' }
      ]
    },
    customers: {
      sectionKey: 'sidebar_customers',
      sectionLabel: 'Customer Management',
      items: [
        { key: 'sb_cu_all',             label: 'All Customers',       icon: 'people',          href: 'customer/customers.html',             action: 'filter-cu-all',        page: 'customers' },
        { key: 'sb_cu_pending',         label: 'Pending KYC',         icon: 'verified_user',   href: 'customer/customers.html#pending-verifications-card', action: 'scroll-pending-kyc' },
        { key: 'sb_cu_active',          label: 'Active Customers',    icon: 'person_check',    href: 'customer/customers.html#active',      action: 'filter-cu-active' }
      ]
    },
    reports: {
      sectionKey: 'sidebar_reports',
      sectionLabel: 'Reports & Intelligence',
      items: [
        { key: 'sidebar_reports',       label: 'Performance Reports', icon: 'bar_chart',       href: 'report/reports.html',                 page: 'reports' },
        { key: 'sidebar_marketing',     label: 'Marketing Campaigns', icon: 'campaign',        href: 'marketing/marketing.html',            page: 'marketing' },
        { key: 'sidebar_chatbot',       label: 'AI Chatbot',          icon: 'smart_toy',       href: 'chatbot/chatbot.html',                page: 'chatbot-settings' }
      ]
    },
    settings: {
      sectionKey: 'sidebar_settings',
      sectionLabel: 'System Settings',
      items: [
        { key: 'st_company_title',      label: 'Company Details',     icon: 'business',        href: 'setting/settings.html#company',       action: 'scroll-company' },
        { key: 'st_rental_rates',       label: 'Rental Rates',        icon: 'payments',        href: 'setting/settings.html#rates',         action: 'scroll-rates' },
        { key: 'st_notifications',      label: 'Notifications',       icon: 'notifications',   href: 'setting/settings.html#notifications', action: 'scroll-notifications' },
        { key: 'st_security',           label: 'Security & Session',  icon: 'security',        href: 'setting/settings.html#security',      action: 'scroll-security' }
      ]
    }
  };

  function getAdminCurrentModule(currentPage) {
    var path = window.location.pathname;
    if (currentPage === 'admin' || path.includes('/dashboard/') || path.endsWith('/admin.html')) return 'dashboard';
    if (currentPage === 'car' || path.includes('/car/')) return 'cars';
    if (currentPage === 'bookings' || currentPage === 'calendar' || path.includes('/booking/') || path.includes('/calendar/')) return 'bookings';
    if (currentPage === 'customers' || path.includes('/customer/')) return 'customers';
    if (currentPage === 'reports' || currentPage === 'marketing' || currentPage === 'chatbot-settings' || path.includes('/report/') || path.includes('/marketing/') || path.includes('/chatbot/')) return 'reports';
    if (currentPage === 'settings' || path.includes('/setting/')) return 'settings';
    return 'dashboard';
  }

  function renderAdminContextualNav(container, currentPage) {
    var nav = container.querySelector('.sidebar-nav');
    if (!nav) return;

    var modKey = getAdminCurrentModule(currentPage);
    var modConfig = ADMIN_CONTEXT_MODULES[modKey] || ADMIN_CONTEXT_MODULES.dashboard;

    var html = '<div class="nav-section" data-key="' + modConfig.sectionKey + '">' + modConfig.sectionLabel + '</div>\n';

    modConfig.items.forEach(function (item) {
      var itemPage = item.page || '';
      var actionAttr = item.action ? ' data-action="' + item.action + '"' : '';
      var activeClass = (itemPage && itemPage === currentPage) ? ' active' : '';
      html += '  <a class="nav-item' + activeClass + '"' + (itemPage ? ' data-page="' + itemPage + '"' : '') + ' data-href="' + item.href + '"' + actionAttr + '>\n';
      html += '    <span class="material-icons-round">' + item.icon + '</span>\n';
      html += '    <span data-key="' + item.key + '">' + item.label + '</span>\n';
      html += '  </a>\n';
    });

    nav.innerHTML = html;
  }

  function attachAdminSubitemActions(container, base) {
    container.querySelectorAll('[data-action]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var action = el.getAttribute('data-action');
        var path   = window.location.pathname;

        if (action === 'add-new-car') {
          if (typeof window.addNewCar === 'function') {
            e.preventDefault();
            window.addNewCar();
            return;
          }
        } else if (action === 'filter-car-all') {
          if (typeof window.filterCar === 'function') {
            e.preventDefault();
            var chip = document.querySelector('.filter-chip:first-child');
            window.filterCar('all', chip);
            container.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n){ n.classList.remove('active'); });
            el.classList.add('active');
            return;
          }
        } else if (action === 'filter-car-available') {
          if (typeof window.filterCar === 'function') {
            e.preventDefault();
            var chip = document.querySelector('.filter-chip:nth-child(2)');
            window.filterCar('Available', chip);
            container.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n){ n.classList.remove('active'); });
            el.classList.add('active');
            return;
          }
        } else if (action === 'filter-car-rented') {
          if (typeof window.filterCar === 'function') {
            e.preventDefault();
            var chip = document.querySelector('.filter-chip:nth-child(3)');
            window.filterCar('Rented', chip);
            container.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n){ n.classList.remove('active'); });
            el.classList.add('active');
            return;
          }
        } else if (action === 'toggle-car-view') {
          if (typeof window.toggleCarView === 'function') {
            e.preventDefault();
            window.toggleCarView();
            return;
          }
        } else if (action === 'scroll-today-pickups') {
          var target = document.getElementById('today-pickups-card');
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.style.transition = 'box-shadow 0.3s ease';
            target.style.boxShadow = '0 0 0 3px var(--primary)';
            setTimeout(function() { target.style.boxShadow = ''; }, 1500);
            return;
          }
        } else if (action === 'filter-bk-all') {
          if (typeof window.filterBookings === 'function') {
            e.preventDefault();
            var chip = document.querySelector('.filter-chip[data-key="filter_all"]') || document.querySelector('.filter-chip');
            window.filterBookings('all', chip);
            container.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n){ n.classList.remove('active'); });
            el.classList.add('active');
            return;
          }
        } else if (action === 'filter-bk-active') {
          if (typeof window.filterBookings === 'function') {
            e.preventDefault();
            var chip = Array.from(document.querySelectorAll('.filter-chip')).find(function(c){ return c.textContent.includes('Active'); });
            window.filterBookings('Active', chip);
            container.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n){ n.classList.remove('active'); });
            el.classList.add('active');
            return;
          }
        } else if (action === 'filter-bk-pending') {
          if (typeof window.filterBookings === 'function') {
            e.preventDefault();
            var chip = Array.from(document.querySelectorAll('.filter-chip')).find(function(c){ return c.textContent.includes('Pending'); });
            window.filterBookings('Pending', chip);
            container.querySelectorAll('.sidebar-nav .nav-item').forEach(function(n){ n.classList.remove('active'); });
            el.classList.add('active');
            return;
          }
        } else if (action === 'filter-cu-all') {
          var searchInput = document.getElementById('cu-search');
          if (searchInput && typeof window.searchCustomers === 'function') {
            e.preventDefault();
            searchInput.value = '';
            window.searchCustomers('');
            return;
          }
        } else if (action === 'scroll-pending-kyc') {
          var target = document.getElementById('pending-verifications-card');
          if (target) {
            e.preventDefault();
            target.classList.remove('hidden');
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        } else if (action === 'filter-cu-active') {
          var searchInput = document.getElementById('cu-search');
          if (searchInput && typeof window.searchCustomers === 'function') {
            e.preventDefault();
            searchInput.value = 'Active';
            window.searchCustomers('Active');
            return;
          }
        } else if (action === 'scroll-overview') {
          if (path.includes('/dashboard/') || path.endsWith('/admin.html')) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
        } else if (action === 'scroll-ai') {
          var target = document.querySelector('.ai-card');
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        } else if (action === 'scroll-car-status') {
          var target = document.querySelector('#car-tbody') || document.querySelector('.card table');
          if (target) {
            e.preventDefault();
            target.closest('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        } else if (action === 'scroll-quick-actions') {
          var target = document.querySelector('.actions-grid');
          if (target) {
            e.preventDefault();
            target.closest('.card').scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        } else if (action === 'scroll-company' || action === 'scroll-rates' || action === 'scroll-notifications' || action === 'scroll-security') {
          var cards = document.querySelectorAll('.settings-card');
          if (cards.length > 0) {
            e.preventDefault();
            var idx = 0;
            if (action === 'scroll-rates') idx = 1;
            else if (action === 'scroll-notifications') idx = 2;
            else if (action === 'scroll-security') idx = 3;
            if (cards[idx]) cards[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
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

    // Determine which module's sidebar to load
    var sidebarPath = 'admin/components/sidebar/' + component + '.html?v=5.2.9';
    var url         = base + sidebarPath;

    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Cannot load sidebar: ' + url);
        return res.text();
      })
      .then(function (html) {
        placeholder.innerHTML = html;

        // Render contextual sub-items for admin module
        if (component === 'sidebar-admin') {
          renderAdminContextualNav(placeholder, currentPage);
        }

        resolveLinks(placeholder, base);
        setActiveItem(placeholder, currentPage);
        attachAdminSubitemActions(placeholder, base);
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
