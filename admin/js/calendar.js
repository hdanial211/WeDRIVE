/**
 * WeDRIVE - Calendar Admin Logic
 * admin/js/calendar.js
 *
 * Renders a monthly calendar with booking, event, and seasonal pricing data
 * pulled from shared/dummy/data.json via WeDriveAPI.
 */

'use strict';

let CAL_DATA = { bookings: [], marketing: { banners: [], promo_codes: [], seasonal_pricing: [] }, fleet: [] };
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
    const data = await window.WeDriveAPI.getData();
    CAL_DATA.bookings = data.bookings || [];
    CAL_DATA.fleet = data.fleet || [];
    CAL_DATA.marketing = await window.WeDriveAPI.getMarketing();
  } catch (e) {
    console.warn('Calendar: failed to load data', e);
  }

  initDropdowns();
  initFilters();
  renderCalendar();
  updateStats();

  // Navigation buttons
  document.getElementById('cal-prev').addEventListener('click', () => { changeMonth(-1); });
  document.getElementById('cal-next').addEventListener('click', () => { changeMonth(1); });
  document.getElementById('cal-today').addEventListener('click', () => {
    const now = new Date();
    CAL_YEAR = now.getFullYear();
    CAL_MONTH = now.getMonth();
    syncDropdowns();
    renderCalendar();
    updateStats();
  });

  // Detail close button + click outside
  document.getElementById('cal-detail-close').addEventListener('click', () => {
    document.getElementById('cal-detail-panel').style.display = 'none';
    clearSelected();
  });
  document.getElementById('cal-detail-panel').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('cal-detail-panel').style.display = 'none';
      clearSelected();
    }
  });

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
    renderCalendar();
    updateStats();
  });
  yearSelect.addEventListener('change', () => {
    CAL_YEAR = parseInt(yearSelect.value);
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
  // Toggle visibility of calendar indicators based on filter state
  document.querySelectorAll('.adm-cal-dot.booking').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.booking);
  });
  document.querySelectorAll('.adm-cal-dot.event').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.event);
  });
  document.querySelectorAll('.adm-cal-dot.seasonal').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.seasonal);
  });
  document.querySelectorAll('.adm-cal-seasonal').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.seasonal);
  });
  document.querySelectorAll('.adm-cal-cars.rented').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.booking);
  });
  document.querySelectorAll('.adm-cal-cars.available').forEach(el => {
    el.classList.toggle('hidden', !CAL_FILTERS.available);
  });
}

// ── Change Month ──────────────────────────────────────────────────────────────
function changeMonth(dir) {
  CAL_MONTH += dir;
  if (CAL_MONTH < 0) { CAL_MONTH = 11; CAL_YEAR--; }
  if (CAL_MONTH > 11) { CAL_MONTH = 0; CAL_YEAR++; }
  syncDropdowns();
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
  document.querySelectorAll('.adm-cal-cell.selected').forEach(c => c.classList.remove('selected'));
}

function setSelected(ds) {
  clearSelected();
  SELECTED_DATE = ds;
  const cell = document.querySelector(`.adm-cal-cell[data-date="${ds}"]`);
  if (cell) cell.classList.add('selected');
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
function renderCalendar() {
  const grid = document.getElementById('cal-grid');

  // Update month dropdown labels for current language
  updateMonthDropdownLabels();

  const firstDay = new Date(CAL_YEAR, CAL_MONTH, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);
  const totalCars = CAL_DATA.fleet.length || 6;

  let html = '';

  // Empty cells before first day
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="adm-cal-cell empty"></div>';
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = dateStr(CAL_YEAR, CAL_MONTH, d);
    const bookings = getBookingsForDate(ds);
    const seasonals = getSeasonalForDate(ds);
    const banners = getBannersForDate(ds);
    const isPast = ds < todayStr;
    const isToday = ds === todayStr;
    const isSelected = ds === SELECTED_DATE;
    const carsRented = bookings.length;
    const carsAvailable = Math.max(0, totalCars - carsRented);

    let cls = 'adm-cal-cell';
    if (isPast) cls += ' past';
    if (isToday) cls += ' today';
    if (isSelected) cls += ' selected';

    // Indicators
    let indicators = '';
    if (bookings.length > 0) {
      indicators += `<span class="adm-cal-dot booking ${CAL_FILTERS.booking ? '' : 'hidden'}"></span>`;
    }
    if (banners.length > 0 || seasonals.length > 0) {
      indicators += `<span class="adm-cal-dot event ${CAL_FILTERS.event ? '' : 'hidden'}"></span>`;
    }
    if (seasonals.length > 0) {
      indicators += `<span class="adm-cal-dot seasonal ${CAL_FILTERS.seasonal ? '' : 'hidden'}"></span>`;
    }

    // Seasonal badge
    let seasonalBadge = '';
    if (seasonals.length > 0) {
      const s = seasonals[0];
      const sign = s.direction === 'increase' ? '+' : '-';
      seasonalBadge = `<div class="adm-cal-seasonal ${CAL_FILTERS.seasonal ? '' : 'hidden'}">${sign}${s.adjustment_value}%</div>`;
    }

    // Car count
    let carInfo = '';
    if (!isPast) {
      if (carsRented > 0) {
        carInfo = `<div class="adm-cal-cars rented ${CAL_FILTERS.booking ? '' : 'hidden'}">${carsRented} <span class="material-icons-round" style="font-size:11px">directions_car</span></div>`;
      } else {
        carInfo = `<div class="adm-cal-cars available ${CAL_FILTERS.available ? '' : 'hidden'}">${carsAvailable} <span class="material-icons-round" style="font-size:11px">check_circle</span></div>`;
      }
    }

    // Determine day number class
    const dayNumCls = isToday ? 'today-num' : '';

    html += `
    <div class="${cls}" data-date="${ds}" onclick="showDayDetail('${ds}')">
      <div class="adm-cal-day-num ${dayNumCls}">${d}</div>
      <div class="adm-cal-indicators">${indicators}</div>
      ${seasonalBadge}
      ${carInfo}
    </div>`;
  }

  grid.innerHTML = html;

  // Apply language
  if (typeof setLanguage === 'function') {
    setLanguage(localStorage.getItem('wedrive-lang') || 'en');
  }
}

// ── Show Day Detail ───────────────────────────────────────────────────────────
window.showDayDetail = function(ds) {
  // Highlight selected date
  setSelected(ds);

  const panel = document.getElementById('cal-detail-panel');
  const body = document.getElementById('cal-detail-body');
  const titleEl = document.getElementById('cal-detail-title');
  const subtitleEl = document.getElementById('cal-detail-subtitle');
  const dayNumEl = document.getElementById('cal-detail-day-num');

  const date = new Date(ds + 'T00:00:00');
  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const locale = lang === 'ms' ? 'ms-MY' : 'en-MY';

  // Header content
  dayNumEl.textContent = date.getDate();
  titleEl.textContent = date.toLocaleDateString(locale, { weekday: 'long' });
  subtitleEl.textContent = date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  const bookings = getBookingsForDate(ds);
  const seasonals = getSeasonalForDate(ds);
  const banners = getBannersForDate(ds);
  const totalCars = CAL_DATA.fleet.length || 6;
  const carsRented = bookings.length;
  const carsAvailable = Math.max(0, totalCars - carsRented);

  let html = '';

  // Summary chips
  html += '<div class="cal-day-summary">';
  html += `<div class="cal-day-chip available-chip">
    <span class="material-icons-round" style="font-size:15px">check_circle</span>
    ${carsAvailable} ${lang === 'ms' ? 'Tersedia' : 'Available'}
  </div>`;
  html += `<div class="cal-day-chip rented-chip">
    <span class="material-icons-round" style="font-size:15px">directions_car</span>
    ${carsRented} ${lang === 'ms' ? 'Disewa' : 'Rented'}
  </div>`;
  if (seasonals.length > 0) {
    const s = seasonals[0];
    const sign = s.direction === 'increase' ? '+' : '-';
    html += `<div class="cal-day-chip seasonal-chip">
      <span class="material-icons-round" style="font-size:15px">${s.direction === 'increase' ? 'trending_up' : 'trending_down'}</span>
      ${s.name}: ${sign}${s.adjustment_value}%
    </div>`;
  }
  html += '</div>';

  // Bookings as cards
  if (bookings.length > 0) {
    html += `<div class="cal-day-section-title">
      <span class="material-icons-round" style="font-size:18px;color:#3B82F6">event_available</span>
      ${lang === 'ms' ? 'Tempahan' : 'Bookings'} (${bookings.length})
    </div>`;
    bookings.forEach(b => {
      const sc = b.status === 'Confirmed' ? 'confirmed' : (b.status === 'Pending' ? 'pending' : 'completed');
      html += `<div class="cal-booking-card">
        <div class="cal-booking-card-icon booking-icon">
          <span class="material-icons-round" style="color:white;font-size:20px">directions_car</span>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:13px;color:var(--navy)">${b.car}</div>
          <div style="font-size:12px;color:var(--slate-500);margin-top:2px">${b.customer} · ${b.id}</div>
          <div style="font-size:11px;color:var(--slate-400);margin-top:2px">${b.pickup} → ${b.return}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-weight:800;font-size:15px;color:var(--navy)">RM ${b.total}</div>
          <span class="status-badge ${sc}" style="font-size:10px;margin-top:4px"><span class="dot"></span>${b.status}</span>
        </div>
      </div>`;
    });
  } else {
    html += `<div style="text-align:center;padding:24px 16px;color:var(--slate-400)">
      <span class="material-icons-round" style="font-size:36px;opacity:0.4;display:block;margin-bottom:8px">event_busy</span>
      <div style="font-size:13px">${lang === 'ms' ? 'Tiada tempahan pada hari ini' : 'No bookings on this day'}</div>
    </div>`;
  }

  // Active banners
  if (banners.length > 0) {
    html += `<div class="cal-day-section-title" style="margin-top:20px">
      <span class="material-icons-round" style="font-size:18px;color:#8B5CF6">campaign</span>
      ${lang === 'ms' ? 'Promosi Aktif' : 'Active Promotions'} (${banners.length})
    </div>`;
    banners.forEach(b => {
      html += `<div class="cal-booking-card" style="border-left:3px solid ${b.color}">
        <div class="cal-booking-card-icon event-icon">
          <span class="material-icons-round" style="color:white;font-size:20px">campaign</span>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:13px;color:var(--navy)">${b.title}</div>
          <div style="font-size:12px;color:var(--slate-500);margin-top:2px">${b.message}</div>
          <div style="font-size:11px;color:var(--slate-400);margin-top:2px">${b.start_date} → ${b.end_date}</div>
        </div>
      </div>`;
    });
  }

  // Seasonal pricing
  if (seasonals.length > 0) {
    html += `<div class="cal-day-section-title" style="margin-top:20px">
      <span class="material-icons-round" style="font-size:18px;color:#F59E0B">event</span>
      ${lang === 'ms' ? 'Harga Bermusim' : 'Seasonal Pricing'}
    </div>`;
    seasonals.forEach(s => {
      const sign = s.direction === 'increase' ? '+' : '-';
      const dirColor = s.direction === 'increase' ? '#EF4444' : '#10B981';
      const dirIcon = s.direction === 'increase' ? 'trending_up' : 'trending_down';
      html += `<div class="cal-booking-card">
        <div class="cal-booking-card-icon seasonal-icon">
          <span class="material-icons-round" style="color:white;font-size:20px">${dirIcon}</span>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;font-size:13px;color:var(--navy)">${s.name}</div>
          <div style="font-size:12px;color:var(--slate-500);margin-top:2px">${s.adjustment_type} · ${s.start_date} → ${s.end_date}</div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-weight:800;font-size:16px;color:${dirColor}">${sign}${s.adjustment_value}%</div>
        </div>
      </div>`;
    });
  }

  body.innerHTML = html;
  panel.style.display = 'flex';
};

// ── Stat Card Popup ───────────────────────────────────────────────────────────
function closeStatModal() {
  document.getElementById('cal-stat-modal').style.display = 'none';
}

window.showStatPopup = function(type) {
  const modal = document.getElementById('cal-stat-modal');
  const titleEl = document.getElementById('cal-stat-modal-title');
  const bodyEl = document.getElementById('cal-stat-modal-body');
  const lang = localStorage.getItem('wedrive-lang') || 'en';

  const monthStart = dateStr(CAL_YEAR, CAL_MONTH, 1);
  const monthEnd = dateStr(CAL_YEAR, CAL_MONTH, new Date(CAL_YEAR, CAL_MONTH + 1, 0).getDate());
  const todayStr = new Date().toISOString().slice(0, 10);

  const monthNames = lang === 'ms'
    ? ['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let title = '';
  let html = '';

  switch(type) {
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
          const car = CAL_DATA.fleet.find(f => f.name === b.car) || {};
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

      // Show available fleet
      const totalCars = CAL_DATA.fleet.length || 6;
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
        <div style="font-size:20px;font-weight:800;color:#10B981">RM ${confirmed.reduce((s,b)=>s+(b.total||0),0).toLocaleString()}</div>
        <div style="font-size:11px;font-weight:600;color:var(--slate-600);margin-top:4px">Confirmed (${confirmed.length})</div>
      </div>`;
      html += `<div style="text-align:center;padding:14px;background:rgba(245,158,11,0.08);border-radius:10px;border:1px solid rgba(245,158,11,0.2)">
        <div style="font-size:20px;font-weight:800;color:#F59E0B">RM ${pending.reduce((s,b)=>s+(b.total||0),0).toLocaleString()}</div>
        <div style="font-size:11px;font-weight:600;color:var(--slate-600);margin-top:4px">Pending (${pending.length})</div>
      </div>`;
      html += `<div style="text-align:center;padding:14px;background:rgba(59,130,246,0.08);border-radius:10px;border:1px solid rgba(59,130,246,0.2)">
        <div style="font-size:20px;font-weight:800;color:#3B82F6">RM ${completed.reduce((s,b)=>s+(b.total||0),0).toLocaleString()}</div>
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
