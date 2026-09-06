/**
 * WeDRIVE - Calendar Admin Logic
 * admin/js/calendar.js
 *
 * Renders a monthly calendar with booking, event, and seasonal pricing data
 * pulled from shared/dummy/data.json via WeDriveAPI.
 */

'use strict';

let CAL_DATA = { bookings: [], marketing: { banners: [], promo_codes: [], seasonal_pricing: [] }, car: [] };
let CAL_YEAR, CAL_MONTH; // 0-indexed month
let SELECTED_DATE = null; // Track which date cell is selected

// Filter states
const CAL_FILTERS = {
  booking: true,
  event: true,
  seasonal: true,
  available: true
};

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  const now = new Date();
  CAL_YEAR = now.getFullYear();
  CAL_MONTH = now.getMonth();

  try {
    const data = await window.WeDriveAPI.getAdminData();
    // Map Supabase booking fields to calendar format
    // Supabase uses: start_date, end_date, customer_name
    // Calendar expects: pickup, return, customer, car
    CAL_DATA.bookings = (data.bookings || []).map(b => {
      var mapped = { ...b };
      mapped.pickup = b.start_date || b.pickup || '';
      mapped.return = b.end_date || b.return || '';
      mapped.customer = b.customer_name || b.customer || '';
      mapped.car = b.car || b.car_name || '';
      mapped.total = b.total || 0;
      return mapped;
    });
    CAL_DATA.car = data.car || [];
    CAL_DATA.marketing = data.marketing || { banners: [], promo_codes: [], seasonal_pricing: [] };
  } catch (e) {
    console.warn('Calendar: failed to load data', e);
  }

  initDropdowns();
  initFilters();
  renderCalendar();
  updateStats();

  // Navigation buttons
  const prevBtn = document.getElementById('cal-prev');
  if (prevBtn) prevBtn.addEventListener('click', () => { changeMonth(-1); });
  const nextBtn = document.getElementById('cal-next');
  if (nextBtn) nextBtn.addEventListener('click', () => { changeMonth(1); });

  // Today button
  const todayBtn = document.getElementById('cal-today-btn');
  if (todayBtn) {
    todayBtn.addEventListener('click', () => {
      const now = new Date();
      CAL_YEAR = now.getFullYear();
      CAL_MONTH = now.getMonth();
      syncDropdowns();
      const todayStr = new Date().toISOString().slice(0, 10);
      SELECTED_DATE = todayStr;
      renderCalendar();
      updateStats();
      showDayDetail(todayStr);
    });
  }

  // Stat modal close
  document.getElementById('cal-stat-modal-close').addEventListener('click', closeStatModal);
  document.getElementById('cal-stat-modal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeStatModal();
  });
});

// ── Month/Year Dropdowns ──────────────────────────────────────────────────────
function initDropdowns() {
  const monthSelect = document.getElementById('cal-month-select');
  const yearSelect = document.getElementById('cal-year-select');

  // Update month names based on language
  updateMonthDropdownLabels();

  // Populate year options (current year -2 to +5)
  const currentYear = new Date().getFullYear();
  yearSelect.innerHTML = '';
  for (let y = currentYear - 2; y <= currentYear + 5; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  }

  syncDropdowns();

  // Listen for changes
  monthSelect.addEventListener('change', () => {
    CAL_MONTH = parseInt(monthSelect.value);
    SELECTED_DATE = null;
    renderCalendar();
    updateStats();
  });
  yearSelect.addEventListener('change', () => {
    CAL_YEAR = parseInt(yearSelect.value);
    SELECTED_DATE = null;
    renderCalendar();
    updateStats();
  });
}

function updateMonthDropdownLabels() {
  const monthSelect = document.getElementById('cal-month-select');
  const lang = localStorage.getItem('wedrive-lang') || 'en';

  const monthNamesEN = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesMS = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];

  const names = lang === 'ms' ? monthNamesMS : monthNamesEN;
  Array.from(monthSelect.options).forEach((opt, i) => {
    opt.textContent = names[i];
  });
}

function syncDropdowns() {
  document.getElementById('cal-month-select').value = CAL_MONTH;
  document.getElementById('cal-year-select').value = CAL_YEAR;
}

// ── Filter Chips ──────────────────────────────────────────────────────────────
function initFilters() {
  document.querySelectorAll('.cal-filter-chip').forEach(chip => {
    const filterType = chip.dataset.filter;
    const checkbox = chip.querySelector('input[type="checkbox"]');

    chip.addEventListener('click', (e) => {
      e.preventDefault();
      CAL_FILTERS[filterType] = !CAL_FILTERS[filterType];
      checkbox.checked = CAL_FILTERS[filterType];
      chip.classList.toggle('active', CAL_FILTERS[filterType]);
      applyFilters();
    });
  });
}

function applyFilters() {
  // Toggle visibility of calendar dots based on filter state
  document.querySelectorAll('.apple-cal-dot.booking').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.booking);
  });
  document.querySelectorAll('.apple-cal-dot.event').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.event);
  });
  document.querySelectorAll('.apple-cal-dot.seasonal').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.seasonal);
  });
  if (SELECTED_DATE) {
    showDayDetail(SELECTED_DATE);
  }
}

// ── Change Month ──────────────────────────────────────────────────────────────
function changeMonth(dir) {
  CAL_MONTH += dir;
  if (CAL_MONTH < 0) { CAL_MONTH = 11; CAL_YEAR--; }
  if (CAL_MONTH > 11) { CAL_MONTH = 0; CAL_YEAR++; }
  syncDropdowns();
  SELECTED_DATE = null;
  renderCalendar();
  updateStats();
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function dateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function getBookingsForDate(ds) {
  return CAL_DATA.bookings.filter(b => {
    return ds >= b.pickup && ds <= b.return;
  });
}

function getInspectionsForDate(ds) {
  return CAL_DATA.bookings.filter(b => {
    if (!['Active', 'Confirmed', 'Completed', 'Pending'].includes(b.status) || !b.return) return false;
    var returnDate = new Date(b.return + 'T00:00:00');
    returnDate.setDate(returnDate.getDate() + 1);
    var inspectionStr = returnDate.getFullYear() + '-' + 
                        String(returnDate.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(returnDate.getDate()).padStart(2, '0');
    return ds === inspectionStr;
  });
}

function getSeasonalForDate(ds) {
  return (CAL_DATA.marketing.seasonal_pricing || []).filter(s => {
    return s.active && ds >= s.start_date && ds <= s.end_date;
  });
}

function getBannersForDate(ds) {
  return (CAL_DATA.marketing.banners || []).filter(b => {
    return b.active && ds >= b.start_date && ds <= b.end_date;
  });
}

function getPromosForDate(ds) {
  return (CAL_DATA.marketing.promo_codes || []).filter(p => {
    return p.active && ds <= p.expiry;
  });
}

// ── Selected cell helpers ─────────────────────────────────────────────────────
function clearSelected() {
  SELECTED_DATE = null;
  document.querySelectorAll('.apple-cal-day.selected, .adm-cal-cell.selected').forEach(c => c.classList.remove('selected'));
}

function setSelected(ds) {
  clearSelected();
  SELECTED_DATE = ds;
  const dayBtn = document.querySelector(`.apple-cal-day[data-date="${ds}"]`);
  if (dayBtn) dayBtn.classList.add('selected');
}

// ── Update Stats ──────────────────────────────────────────────────────────────
function updateStats() {
  const monthStart = dateStr(CAL_YEAR, CAL_MONTH, 1);
  const monthEnd = dateStr(CAL_YEAR, CAL_MONTH, new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate());
  const todayStr = new Date().toISOString().slice(0, 10);

  // Bookings this month (any overlap)
  const monthBookings = CAL_DATA.bookings.filter(b => b.pickup <= monthEnd && b.return >= monthStart);
  document.getElementById('cal-stat-bookings').textContent = monthBookings.length;

  // Cars rented today
  const todayBookings = getBookingsForDate(todayStr);
  document.getElementById('cal-stat-rented').textContent = todayBookings.length;

  // Active events (banners + seasonal active in this month)
  const activeEvents = (CAL_DATA.marketing.banners || []).filter(b => b.active && b.start_date <= monthEnd && b.end_date >= monthStart).length
    + (CAL_DATA.marketing.seasonal_pricing || []).filter(s => s.active && s.start_date <= monthEnd && s.end_date >= monthStart).length;
  document.getElementById('cal-stat-events').textContent = activeEvents;

  // Revenue this month
  const revenue = monthBookings.reduce((s, b) => s + (b.total || 0), 0);
  document.getElementById('cal-stat-revenue').textContent = 'RM ' + revenue.toLocaleString();
}

// ── Render Calendar ───────────────────────────────────────────────────────────
// ── Render Calendar (Apple HIG Inline Grid Standard) ──────────────────────────
function renderCalendar() {
  const grid = document.getElementById('cal-grid');
  if (!grid) return;

  // Update month dropdown labels for current language
  updateMonthDropdownLabels();

  const firstDay = new Date(CAL_YEAR, CAL_MONTH, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  let html = '';

  // Empty cells before first day of month
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="apple-cal-cell-wrap empty"></div>';
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const ds = dateStr(CAL_YEAR, CAL_MONTH, d);
    const bookings = getBookingsForDate(ds);
    const inspections = getInspectionsForDate(ds);
    const seasonals = getSeasonalForDate(ds);
    const banners = getBannersForDate(ds);
    const isPast = ds < todayStr;
    const isToday = ds === todayStr;
    const isSelected = ds === SELECTED_DATE;

    let dayCls = 'apple-cal-day';
    if (isPast) dayCls += ' past';
    if (isToday) dayCls += ' today';
    if (isSelected) dayCls += ' selected';

    // Micro-dots beneath day number (Apple HIG standard)
    let dots = '';
    if (bookings.length > 0) {
      dots += `<span class="apple-cal-dot booking ${CAL_FILTERS.booking ? '' : 'hidden'}" title="${bookings.length} Tempahan"></span>`;
    }
    if (inspections.length > 0) {
      dots += `<span class="apple-cal-dot inspection" title="${inspections.length} Pemeriksaan"></span>`;
    }
    if (banners.length > 0) {
      dots += `<span class="apple-cal-dot event ${CAL_FILTERS.event ? '' : 'hidden'}" title="Promosi"></span>`;
    }
    if (seasonals.length > 0) {
      dots += `<span class="apple-cal-dot seasonal ${CAL_FILTERS.seasonal ? '' : 'hidden'}" title="Harga Bermusim"></span>`;
    }

    html += `
    <div class="apple-cal-cell-wrap">
      <button type="button" class="${dayCls}" data-date="${ds}" onclick="showDayDetail('${ds}')" aria-label="${ds}">
        ${d}
      </button>
      <div class="apple-cal-dots">${dots}</div>
    </div>`;
  }

  grid.innerHTML = html;

  // Determine initial selected date
  if (!SELECTED_DATE) {
    const currentMonthToday = (new Date().getFullYear() === CAL_YEAR && new Date().getMonth() === CAL_MONTH);
    const defaultDate = currentMonthToday ? todayStr : dateStr(CAL_YEAR, CAL_MONTH, 1);
    showDayDetail(defaultDate);
  } else {
    // Re-highlight if cell exists in currently rendered month
    const activeBtn = grid.querySelector(`.apple-cal-day[data-date="${SELECTED_DATE}"]`);
    if (activeBtn) activeBtn.classList.add('selected');
    showDayDetail(SELECTED_DATE);
  }

  // Apply language
  if (typeof setLanguage === 'function') {
    setLanguage(localStorage.getItem('wedrive-lang') || 'en');
  }
}

// ── Show Day Detail (Apple HIG Operations Agenda Panel) ────────────────────────
window.showDayDetail = function (ds) {
  // Highlight selected date
  setSelected(ds);

  const titleEl = document.getElementById('cal-agenda-title');
  const subtitleEl = document.getElementById('cal-agenda-subtitle');
  const badgeTextEl = document.getElementById('cal-agenda-badge-text');
  const availEl = document.getElementById('agenda-stat-avail');
  const rentedEl = document.getElementById('agenda-stat-rented');
  const inspectEl = document.getElementById('agenda-stat-inspect');
  const listEl = document.getElementById('cal-agenda-list');

  const date = new Date(ds + 'T00:00:00');
  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const locale = lang === 'ms' ? 'ms-MY' : 'en-MY';
  const todayStr = new Date().toISOString().slice(0, 10);

  const weekdayName = date.toLocaleDateString(locale, { weekday: 'long' });
  const formattedFullDate = date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  if (titleEl) titleEl.textContent = weekdayName;
  if (subtitleEl) subtitleEl.textContent = formattedFullDate;
  if (badgeTextEl) {
    badgeTextEl.textContent = ds === todayStr ? (lang === 'ms' ? 'Hari Ini' : 'Today') : date.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }

  const bookings = getBookingsForDate(ds);
  const inspections = getInspectionsForDate(ds);
  const seasonals = getSeasonalForDate(ds);
  const banners = getBannersForDate(ds);
  const totalCars = CAL_DATA.car.length || 6;
  const carsRented = bookings.length;
  const carsAvailable = Math.max(0, totalCars - carsRented);

  if (availEl) availEl.textContent = carsAvailable;
  if (rentedEl) rentedEl.textContent = carsRented;
  if (inspectEl) inspectEl.textContent = inspections.length;

  if (!listEl) return;

  let html = '';

  // 1. Seasonal Pricing banner in agenda if active
  if (seasonals.length > 0 && CAL_FILTERS.seasonal) {
    seasonals.forEach(s => {
      const sign = s.direction === 'increase' ? '+' : '-';
      const dirColor = s.direction === 'increase' ? '#FF453A' : '#30D158';
      const dirIcon = s.direction === 'increase' ? 'trending_up' : 'trending_down';
      html += `
      <div class="cal-agenda-item" style="border-left: 3px solid #FF9500;">
        <div class="cal-agenda-item-left">
          <div class="cal-agenda-car-icon" style="background: rgba(255, 149, 0, 0.12); color: #FF9500;">
            <span class="material-icons-round">${dirIcon}</span>
          </div>
          <div>
            <div class="cal-agenda-car-name">${s.name}</div>
            <div class="cal-agenda-cust-name">${lang === 'ms' ? 'Pelarasan Harga Bermusim' : 'Seasonal Pricing'}</div>
          </div>
        </div>
        <div class="cal-agenda-item-right">
          <span class="cal-booking-amount tabular-nums" style="color: ${dirColor}; font-weight: 700;">${sign}${s.adjustment_value}%</span>
        </div>
      </div>`;
    });
  }

  // 2. Marketing Banners in agenda
  if (banners.length > 0 && CAL_FILTERS.event) {
    banners.forEach(b => {
      html += `
      <div class="cal-agenda-item" style="border-left: 3px solid ${b.color || '#AF52DE'};">
        <div class="cal-agenda-item-left">
          <div class="cal-agenda-car-icon" style="background: rgba(175, 82, 222, 0.12); color: #AF52DE;">
            <span class="material-icons-round">campaign</span>
          </div>
          <div>
            <div class="cal-agenda-car-name">${b.title}</div>
            <div class="cal-agenda-cust-name">${b.message || (lang === 'ms' ? 'Kempen Aktif' : 'Active Campaign')}</div>
          </div>
        </div>
      </div>`;
    });
  }

  // 3. Inspections
  if (inspections.length > 0) {
    inspections.forEach(b => {
      html += `
      <div class="cal-agenda-item" style="border-left: 3px solid #EAB308;">
        <div class="cal-agenda-item-left">
          <div class="cal-agenda-car-icon" style="background: rgba(234, 179, 8, 0.12); color: #EAB308;">
            <span class="material-icons-round">build</span>
          </div>
          <div>
            <div class="cal-agenda-car-name">${b.car}</div>
            <div class="cal-agenda-cust-name">${lang === 'ms' ? 'Pemeriksaan Selepas Sewaan' : 'Post-Rental Inspection'} (#${b.id})</div>
          </div>
        </div>
        <div class="cal-agenda-item-right">
          <span class="status-badge warning" style="padding: 2px 8px; font-size: 11px;">
            <span class="dot"></span>
            <span>${lang === 'ms' ? 'Wajib' : 'Required'}</span>
          </span>
        </div>
      </div>`;
    });
  }

  // 4. Bookings
  if (bookings.length > 0 && CAL_FILTERS.booking) {
    bookings.forEach(b => {
      const sc = b.status === 'Confirmed' ? 'confirmed' : (b.status === 'Pending' ? 'pending' : (b.status === 'Active' ? 'active' : 'completed'));
      const statusLabel = lang === 'ms' ? ({
        'Confirmed': 'Disahkan',
        'Pending': 'Menunggu',
        'Completed': 'Selesai',
        'Active': 'Aktif',
        'Cancelled': 'Dibatalkan'
      }[b.status] || b.status) : b.status;

      html += `
      <div class="cal-agenda-item cursor-pointer" onclick="window.location.href='../booking/bookings.html?search=${encodeURIComponent(b.id)}'">
        <div class="cal-agenda-item-left">
          <div class="cal-agenda-car-icon">
            <span class="material-icons-round">directions_car</span>
          </div>
          <div>
            <div class="cal-agenda-car-name">${b.car}</div>
            <div class="cal-agenda-cust-name flex-center gap-4">
              <span class="material-icons-round fs-12">person</span>
              <span>${b.customer}</span>
              <span class="dot-sep">•</span>
              <span class="tabular-nums">#${b.id}</span>
            </div>
          </div>
        </div>
        <div class="cal-agenda-item-right">
          <span class="status-badge ${sc}" style="padding: 2px 8px; font-size: 11px;">
            <span class="dot"></span>
            <span>${statusLabel}</span>
          </span>
          <span class="cal-agenda-time-pill tabular-nums">RM ${Number(b.total || 0).toLocaleString()}</span>
        </div>
      </div>`;
    });
  }

  // Empty state if nothing for this date
  if (!html) {
    html = `
    <div class="cal-agenda-empty">
      <span class="material-icons-round">event_available</span>
      <div class="cal-agenda-empty-title">${lang === 'ms' ? 'Tiada Operasi Berjadual' : 'No Scheduled Operations'}</div>
      <div class="fs-12 text-secondary">${lang === 'ms' ? 'Semua unit kereta tersedia untuk tempahan segera.' : 'All car units are available for immediate booking.'}</div>
    </div>`;
  }

  listEl.innerHTML = html;
};

window.goToNewBookingForDate = function () {
  const ds = SELECTED_DATE || new Date().toISOString().slice(0, 10);
  window.location.href = `../booking/new-booking.html?pickup=${ds}`;
};

// ── Stat Card Popup ───────────────────────────────────────────────────────────
function closeStatModal() {
  const m = document.getElementById('cal-stat-modal');
  m.classList.add('hidden');
  m.style.display = 'none';
}

window.showStatPopup = function (type) {
  const modal = document.getElementById('cal-stat-modal');
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  const titleEl = document.getElementById('cal-stat-modal-title');
  const bodyEl = document.getElementById('cal-stat-modal-body');
  const lang = localStorage.getItem('wedrive-lang') || 'en';

  const monthStart = dateStr(CAL_YEAR, CAL_MONTH, 1);
  const monthEnd = dateStr(CAL_YEAR, CAL_MONTH, new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate());
  const todayStr = new Date().toISOString().slice(0, 10);

  const monthNames = lang === 'ms'
    ? ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let title = '';
  let html = '';

  switch (type) {
    case 'bookings': {
      const monthBookings = CAL_DATA.bookings.filter(b => b.pickup <= monthEnd && b.return >= monthStart);
      title = `<span class="material-icons-round" style="color:#3B82F6">event_available</span> ${lang === 'ms' ? 'Tempahan Bulan Ini' : 'Bookings This Month'} (${monthBookings.length})`;

      if (monthBookings.length > 0) {
        html += '<div class="cal-stat-modal-body-scroll">';
        html += '<table style="width:100%"><thead><tr>';
        html += `<th>ID</th><th>${lang === 'ms' ? 'Pelanggan' : 'Customer'}</th><th>${lang === 'ms' ? 'Kereta' : 'Car'}</th><th>${lang === 'ms' ? 'Ambil' : 'Pickup'}</th><th>${lang === 'ms' ? 'Pulang' : 'Return'}</th><th>Status</th><th>${lang === 'ms' ? 'Jumlah' : 'Total'}</th>`;
        html += '</tr></thead><tbody>';
        monthBookings.forEach(b => {
          const sc = b.status === 'Confirmed' ? 'confirmed' : (b.status === 'Pending' ? 'pending' : 'completed');
          html += `<tr>
            <td style="font-weight:600;font-size:12px">${b.id}</td>
            <td style="font-size:12px">${b.customer}</td>
            <td style="font-size:12px">${b.car}</td>
            <td style="font-size:12px">${b.pickup}</td>
            <td style="font-size:12px">${b.return}</td>
            <td><span class="status-badge ${sc}" style="font-size:11px"><span class="dot"></span>${b.status}</span></td>
            <td style="font-weight:700;font-size:12px">RM ${b.total}</td>
          </tr>`;
        });
        html += '</tbody></table></div>';
      } else {
        html += `<p style="color:var(--slate-400);text-align:center;padding:24px">${lang === 'ms' ? 'Tiada tempahan bulan ini' : 'No bookings this month'}</p>`;
      }
      break;
    }

    case 'cars': {
      const todayBookings = getBookingsForDate(todayStr);
      title = `<span class="material-icons-round" style="color:#10B981">directions_car</span> ${lang === 'ms' ? 'Kereta Disewa Hari Ini' : 'Cars Rented Today'} (${todayBookings.length})`;

      if (todayBookings.length > 0) {
        html += '<div class="cal-stat-modal-body-scroll">';
        todayBookings.forEach(b => {
          const car = CAL_DATA.car.find(f => f.name === b.car) || {};
          html += `<div style="display:flex;align-items:center;gap:14px;padding:12px 14px;background:var(--slate-50);border-radius:12px;margin-bottom:8px;border:1px solid var(--slate-200)">
            <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,#3B82F6,#2563EB);display:flex;align-items:center;justify-content:center">
              <span class="material-icons-round" style="color:white;font-size:20px">directions_car</span>
            </div>
            <div style="flex:1">
              <div style="font-weight:700;font-size:13px;color:var(--navy)">${b.car}</div>
              <div style="font-size:12px;color:var(--slate-600)">${lang === 'ms' ? 'Pelanggan' : 'Customer'}: ${b.customer}</div>
              <div style="font-size:11px;color:var(--slate-400)">${b.pickup} → ${b.return}</div>
            </div>
            <div style="text-align:right">
              <div style="font-weight:700;font-size:14px;color:var(--navy)">RM ${b.total}</div>
              <span class="status-badge ${b.status === 'Confirmed' ? 'confirmed' : 'pending'}" style="font-size:10px"><span class="dot"></span>${b.status}</span>
            </div>
          </div>`;
        });
        html += '</div>';
      } else {
        html += `<p style="color:var(--slate-400);text-align:center;padding:24px">${lang === 'ms' ? 'Tiada kereta disewa hari ini' : 'No cars rented today'}</p>`;
      }

      // Show available car
      const totalCars = CAL_DATA.car.length || 6;
      const available = Math.max(0, totalCars - todayBookings.length);
      html += `<div style="margin-top:12px;padding:12px 14px;background:rgba(16,185,129,0.08);border-radius:10px;border:1px solid rgba(16,185,129,0.2);display:flex;align-items:center;gap:8px">
        <span class="material-icons-round" style="color:#10B981;font-size:18px">check_circle</span>
        <span style="font-size:13px;font-weight:600;color:var(--navy)">${available} ${lang === 'ms' ? 'kereta tersedia daripada' : 'cars available out of'} ${totalCars} ${lang === 'ms' ? 'jumlah' : 'total'}</span>
      </div>`;
      break;
    }

    case 'events': {
      const banners = (CAL_DATA.marketing.banners || []).filter(b => b.active && b.start_date <= monthEnd && b.end_date >= monthStart);
      const seasonals = (CAL_DATA.marketing.seasonal_pricing || []).filter(s => s.active && s.start_date <= monthEnd && s.end_date >= monthStart);
      const total = banners.length + seasonals.length;
      title = `<span class="material-icons-round" style="color:#8B5CF6">celebration</span> ${lang === 'ms' ? 'Acara Aktif' : 'Active Events'} (${total})`;

      html += '<div class="cal-stat-modal-body-scroll">';

      if (banners.length > 0) {
        html += `<h4 style="font-size:13px;font-weight:700;color:var(--navy);margin-bottom:10px;display:flex;align-items:center;gap:6px">
          <span class="material-icons-round" style="font-size:16px;color:#8B5CF6">campaign</span>
          ${lang === 'ms' ? 'Promosi / Banner' : 'Promotions / Banners'}
        </h4>`;
        banners.forEach(b => {
          html += `<div style="background:${b.color};color:white;padding:12px 16px;border-radius:10px;margin-bottom:8px">
            <div style="font-weight:700;font-size:13px">${b.title}</div>
            <div style="font-size:11px;opacity:0.9;margin-top:4px">${b.message}</div>
            <div style="font-size:10px;opacity:0.7;margin-top:6px">${b.start_date} → ${b.end_date}</div>
          </div>`;
        });
      }

      if (seasonals.length > 0) {
        html += `<h4 style="font-size:13px;font-weight:700;color:var(--navy);margin:14px 0 10px;display:flex;align-items:center;gap:6px">
          <span class="material-icons-round" style="font-size:16px;color:#F59E0B">event</span>
          ${lang === 'ms' ? 'Harga Bermusim' : 'Seasonal Pricing'}
        </h4>`;
        seasonals.forEach(s => {
          const sign = s.direction === 'increase' ? '+' : '-';
          const dirColor = s.direction === 'increase' ? '#EF4444' : '#10B981';
          html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--slate-50);border-radius:10px;margin-bottom:6px;border:1px solid var(--slate-200)">
            <span class="material-icons-round" style="color:${dirColor};font-size:20px">${s.direction === 'increase' ? 'trending_up' : 'trending_down'}</span>
            <div>
              <div style="font-weight:700;font-size:13px;color:var(--navy)">${s.name}</div>
              <div style="font-size:12px;color:var(--slate-600)">${sign}${s.adjustment_value}% ${s.adjustment_type} | ${s.start_date} → ${s.end_date}</div>
            </div>
          </div>`;
        });
      }

      if (total === 0) {
        html += `<p style="color:var(--slate-400);text-align:center;padding:24px">${lang === 'ms' ? 'Tiada acara aktif bulan ini' : 'No active events this month'}</p>`;
      }
      html += '</div>';
      break;
    }

    case 'revenue': {
      const monthBookings = CAL_DATA.bookings.filter(b => b.pickup <= monthEnd && b.return >= monthStart);
      const totalRevenue = monthBookings.reduce((s, b) => s + (b.total || 0), 0);
      title = `<span class="material-icons-round" style="color:#F59E0B">payments</span> ${lang === 'ms' ? 'Hasil Bulan Ini' : 'Revenue This Month'}`;

      // Revenue summary
      html += `<div style="text-align:center;padding:20px 0 16px">
        <div style="font-size:36px;font-weight:800;color:var(--navy)">RM ${totalRevenue.toLocaleString()}</div>
        <div style="font-size:13px;color:var(--slate-400);margin-top:4px">${monthNames[CAL_MONTH]} ${CAL_YEAR}</div>
      </div>`;

      // Status breakdown
      const confirmed = monthBookings.filter(b => b.status === 'Confirmed');
      const pending = monthBookings.filter(b => b.status === 'Pending');
      const completed = monthBookings.filter(b => b.status === 'Completed');

      html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px">';
      html += `<div style="text-align:center;padding:14px;background:rgba(16,185,129,0.08);border-radius:10px;border:1px solid rgba(16,185,129,0.2)">
        <div style="font-size:20px;font-weight:800;color:#10B981">RM ${confirmed.reduce((s, b) => s + (b.total || 0), 0).toLocaleString()}</div>
        <div style="font-size:11px;font-weight:600;color:var(--slate-600);margin-top:4px">Confirmed (${confirmed.length})</div>
      </div>`;
      html += `<div style="text-align:center;padding:14px;background:rgba(245,158,11,0.08);border-radius:10px;border:1px solid rgba(245,158,11,0.2)">
        <div style="font-size:20px;font-weight:800;color:#F59E0B">RM ${pending.reduce((s, b) => s + (b.total || 0), 0).toLocaleString()}</div>
        <div style="font-size:11px;font-weight:600;color:var(--slate-600);margin-top:4px">Pending (${pending.length})</div>
      </div>`;
      html += `<div style="text-align:center;padding:14px;background:rgba(59,130,246,0.08);border-radius:10px;border:1px solid rgba(59,130,246,0.2)">
        <div style="font-size:20px;font-weight:800;color:#3B82F6">RM ${completed.reduce((s, b) => s + (b.total || 0), 0).toLocaleString()}</div>
        <div style="font-size:11px;font-weight:600;color:var(--slate-600);margin-top:4px">Completed (${completed.length})</div>
      </div>`;
      html += '</div>';

      // Booking details
      if (monthBookings.length > 0) {
        html += '<div class="cal-stat-modal-body-scroll">';
        html += '<table style="width:100%"><thead><tr>';
        html += `<th style="font-size:11px">${lang === 'ms' ? 'Pelanggan' : 'Customer'}</th>`;
        html += `<th style="font-size:11px">${lang === 'ms' ? 'Kereta' : 'Car'}</th>`;
        html += `<th style="font-size:11px">Status</th>`;
        html += `<th style="font-size:11px">${lang === 'ms' ? 'Jumlah' : 'Total'}</th>`;
        html += '</tr></thead><tbody>';
        monthBookings.forEach(b => {
          const sc = b.status === 'Confirmed' ? 'confirmed' : (b.status === 'Pending' ? 'pending' : 'completed');
          html += `<tr>
            <td style="font-size:12px">${b.customer}</td>
            <td style="font-size:12px">${b.car}</td>
            <td><span class="status-badge ${sc}" style="font-size:10px"><span class="dot"></span>${b.status}</span></td>
            <td style="font-weight:700;font-size:12px">RM ${b.total}</td>
          </tr>`;
        });
        html += '</tbody></table></div>';
      }
      break;
    }
  }

  titleEl.innerHTML = title;
  bodyEl.innerHTML = html;
  modal.style.display = 'flex';
};
