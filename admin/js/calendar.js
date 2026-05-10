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

  renderCalendar();
  updateStats();

  // Navigation
  document.getElementById('cal-prev').addEventListener('click', () => { changeMonth(-1); });
  document.getElementById('cal-next').addEventListener('click', () => { changeMonth(1); });
  document.getElementById('cal-today').addEventListener('click', () => {
    const now = new Date();
    CAL_YEAR = now.getFullYear();
    CAL_MONTH = now.getMonth();
    renderCalendar();
    updateStats();
  });
  document.getElementById('cal-detail-close').addEventListener('click', () => {
    document.getElementById('cal-detail-panel').style.display = 'none';
  });
});

// ── Change Month ──────────────────────────────────────────────────────────────
function changeMonth(dir) {
  CAL_MONTH += dir;
  if (CAL_MONTH < 0) { CAL_MONTH = 11; CAL_YEAR--; }
  if (CAL_MONTH > 11) { CAL_MONTH = 0; CAL_YEAR++; }
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
  const label = document.getElementById('cal-month-label');

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  label.textContent = `${monthNames[CAL_MONTH]} ${CAL_YEAR}`;

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
    const carsRented = bookings.length;
    const carsAvailable = Math.max(0, totalCars - carsRented);

    let cls = 'adm-cal-cell';
    if (isPast) cls += ' past';
    if (isToday) cls += ' today';

    // Indicators
    let indicators = '';
    if (bookings.length > 0) {
      indicators += '<span class="adm-cal-dot booking"></span>';
    }
    if (banners.length > 0 || seasonals.length > 0) {
      indicators += '<span class="adm-cal-dot event"></span>';
    }
    if (seasonals.length > 0) {
      indicators += '<span class="adm-cal-dot seasonal"></span>';
    }

    // Seasonal badge
    let seasonalBadge = '';
    if (seasonals.length > 0) {
      const s = seasonals[0];
      const sign = s.direction === 'increase' ? '+' : '-';
      seasonalBadge = `<div class="adm-cal-seasonal">${sign}${s.adjustment_value}%</div>`;
    }

    // Car count
    let carInfo = '';
    if (!isPast) {
      if (carsRented > 0) {
        carInfo = `<div class="adm-cal-cars rented">${carsRented} <span class="material-icons-round" style="font-size:11px">directions_car</span></div>`;
      } else {
        carInfo = `<div class="adm-cal-cars available">${carsAvailable} <span class="material-icons-round" style="font-size:11px">check_circle</span></div>`;
      }
    }

    html += `
    <div class="${cls}" data-date="${ds}" onclick="showDayDetail('${ds}')">
      <div class="adm-cal-day-num ${isToday ? 'today-num' : ''}">${d}</div>
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
  const panel = document.getElementById('cal-detail-panel');
  const body = document.getElementById('cal-detail-body');
  const title = document.getElementById('cal-detail-title');

  const date = new Date(ds + 'T00:00:00');
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const locale = lang === 'ms' ? 'ms-MY' : 'en-MY';

  title.innerHTML = `<span class="material-icons-round" style="color:var(--primary)">info</span> ${date.toLocaleDateString(locale, options)}`;

  const bookings = getBookingsForDate(ds);
  const seasonals = getSeasonalForDate(ds);
  const banners = getBannersForDate(ds);
  const totalCars = CAL_DATA.fleet.length || 6;
  const carsRented = bookings.length;
  const carsAvailable = Math.max(0, totalCars - carsRented);

  let html = '';

  // Summary chips
  html += '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">';
  html += `<span class="status-badge available"><span class="dot"></span>${carsAvailable} ${lang === 'ms' ? 'Kereta Tersedia' : 'Cars Available'}</span>`;
  html += `<span class="status-badge rented"><span class="dot"></span>${carsRented} ${lang === 'ms' ? 'Disewa' : 'Rented'}</span>`;
  if (seasonals.length > 0) {
    const s = seasonals[0];
    const sign = s.direction === 'increase' ? '+' : '-';
    html += `<span class="status-badge pending"><span class="dot"></span>${s.name}: ${sign}${s.adjustment_value}%</span>`;
  }
  html += '</div>';

  // Bookings table
  if (bookings.length > 0) {
    html += `<h4 style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:10px;display:flex;align-items:center;gap:6px">
      <span class="material-icons-round" style="font-size:18px;color:var(--primary)">event_available</span>
      ${lang === 'ms' ? 'Tempahan' : 'Bookings'} (${bookings.length})
    </h4>`;
    html += '<table style="margin-bottom:18px"><thead><tr>';
    html += `<th>${lang === 'ms' ? 'ID' : 'ID'}</th>`;
    html += `<th>${lang === 'ms' ? 'Pelanggan' : 'Customer'}</th>`;
    html += `<th>${lang === 'ms' ? 'Kereta' : 'Car'}</th>`;
    html += `<th>${lang === 'ms' ? 'Status' : 'Status'}</th>`;
    html += `<th>${lang === 'ms' ? 'Jumlah' : 'Total'}</th>`;
    html += '</tr></thead><tbody>';
    bookings.forEach(b => {
      const sc = b.status === 'Confirmed' ? 'confirmed' : (b.status === 'Pending' ? 'pending' : 'completed');
      html += `<tr>
        <td style="font-weight:600">${b.id}</td>
        <td>${b.customer}</td>
        <td>${b.car}</td>
        <td><span class="status-badge ${sc}"><span class="dot"></span>${b.status}</span></td>
        <td style="font-weight:700">RM ${b.total}</td>
      </tr>`;
    });
    html += '</tbody></table>';
  } else {
    html += `<div style="color:var(--slate-400);font-size:13px;margin-bottom:14px;display:flex;align-items:center;gap:6px">
      <span class="material-icons-round" style="font-size:16px">event_busy</span>
      ${lang === 'ms' ? 'Tiada tempahan pada hari ini' : 'No bookings on this day'}
    </div>`;
  }

  // Active banners
  if (banners.length > 0) {
    html += `<h4 style="font-size:14px;font-weight:700;color:var(--navy);margin-bottom:10px;display:flex;align-items:center;gap:6px">
      <span class="material-icons-round" style="font-size:18px;color:#8B5CF6">campaign</span>
      ${lang === 'ms' ? 'Promosi Aktif' : 'Active Promotions'} (${banners.length})
    </h4>`;
    banners.forEach(b => {
      html += `<div style="background:${b.color};color:white;padding:12px 16px;border-radius:10px;margin-bottom:8px">
        <div style="font-weight:700;font-size:14px">${b.title}</div>
        <div style="font-size:12px;opacity:0.9;margin-top:4px">${b.message}</div>
      </div>`;
    });
  }

  // Seasonal pricing
  if (seasonals.length > 0) {
    html += `<h4 style="font-size:14px;font-weight:700;color:var(--navy);margin:14px 0 10px;display:flex;align-items:center;gap:6px">
      <span class="material-icons-round" style="font-size:18px;color:#F59E0B">event</span>
      ${lang === 'ms' ? 'Harga Bermusim' : 'Seasonal Pricing'}
    </h4>`;
    seasonals.forEach(s => {
      const sign = s.direction === 'increase' ? '+' : '-';
      const dirColor = s.direction === 'increase' ? '#EF4444' : '#10B981';
      html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--slate-50);border-radius:10px;margin-bottom:6px;border:1px solid var(--slate-200)">
        <span class="material-icons-round" style="color:${dirColor};font-size:20px">${s.direction === 'increase' ? 'trending_up' : 'trending_down'}</span>
        <div>
          <div style="font-weight:700;font-size:13px;color:var(--navy)">${s.name}</div>
          <div style="font-size:12px;color:var(--slate-600)">${sign}${s.adjustment_value}% ${s.adjustment_type} | ${s.start_date} to ${s.end_date}</div>
        </div>
      </div>`;
    });
  }

  body.innerHTML = html;
  panel.style.display = 'block';
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
