/**
 * WeDRIVE - Admin Module JS
 * High-Density Apple Developer Design Dashboard
 * Data fetched from window.WeDriveAPI / Supabase
 */

// ─── STATE MANAGEMENT ────────────────────────────────────────────────────────
let adminStats = null;
let allCars = [];
let currentLedgerFilter = 'all';

// ─── FETCH & INITIALISE ───────────────────────────────────────────────────────
window.WeDriveAPI.getAdminData()
  .then(data => {
    populateStats(data.stats);
    allCars = data.car || [];
    updateLedgerChipCounts();
    renderCarTable();
  })
  .catch(err => {
    console.error('[WeDRIVE Admin] Data load error:', err);
  });

// ─── STATS UI ─────────────────────────────────────────────────────────────────
function updateStatsUI() {
  if (!adminStats) return;

  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const isMalay = lang === 'ms';

  // 1. Total Cars Sub-label
  const vehiclesChangeEl = document.getElementById('stat-vehicles-change');
  if (vehiclesChangeEl) {
    const available = adminStats.available_vehicles !== undefined ? adminStats.available_vehicles : adminStats.total_vehicles;
    const text = isMalay ? `${available} tersedia` : `${available} available`;
    vehiclesChangeEl.innerHTML = `<span class="material-icons-round fs-14">check_circle</span> ${text}`;
  }

  // 2. Active Rentals Sub-label
  const rentalsChangeEl = document.getElementById('stat-rentals-change');
  if (rentalsChangeEl) {
    const active = adminStats.active_rentals || 0;
    const text = isMalay ? `${active} aktif hari ini` : `${active} active today`;
    rentalsChangeEl.innerHTML = `<span class="material-icons-round fs-14">arrow_upward</span> ${text}`;
  }

  // 3. Revenue Sub-label
  const revenueChangeEl = document.getElementById('stat-revenue-change');
  if (revenueChangeEl) {
    const revenueMonth = adminStats.revenue_this_month || 0;
    const text = isMalay ? `RM ${revenueMonth.toLocaleString()} bulan ini` : `RM ${revenueMonth.toLocaleString()} this month`;
    revenueChangeEl.innerHTML = `<span class="material-icons-round fs-14">arrow_upward</span> ${text}`;
  }

  // 4. Customers Sub-label
  const customersChangeEl = document.getElementById('stat-customers-change');
  if (customersChangeEl) {
    const newCustMonth = adminStats.new_customers_this_month !== undefined ? adminStats.new_customers_this_month : adminStats.new_customers;
    const text = isMalay ? `${newCustMonth} berdaftar bulan ini` : `${newCustMonth} registered this month`;
    customersChangeEl.innerHTML = `<span class="material-icons-round fs-14">arrow_upward</span> ${text}`;
  }
}

function populateStats(stats) {
  adminStats = stats;
  const map = {
    'stat-vehicles': stats.total_vehicles,
    'stat-rentals': stats.active_rentals,
    'stat-revenue': 'RM ' + (stats.revenue_today || 0).toLocaleString(),
    'stat-customers': stats.new_customers
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
  updateStatsUI();
}

// ─── CAR STATUS LEDGER FILTERING & COUNTS ────────────────────────────────────
function updateLedgerChipCounts() {
  const total = allCars.length;
  const rented = allCars.filter(c => {
    const s = (c.status || '').toLowerCase();
    return s === 'rented' || s === 'sedang disewa' || s === 'disewa';
  }).length;
  const available = allCars.filter(c => {
    const s = (c.status || '').toLowerCase();
    return s === 'available' || s === 'tersedia';
  }).length;
  const maintenance = allCars.filter(c => {
    const s = (c.status || '').toLowerCase();
    return s === 'maintenance' || s === 'penyelenggaraan';
  }).length;

  const countAllEl = document.getElementById('count-all');
  if (countAllEl) countAllEl.textContent = `(${total})`;

  const countRentedEl = document.getElementById('count-rented');
  if (countRentedEl) countRentedEl.textContent = `(${rented})`;

  const countAvailableEl = document.getElementById('count-available');
  if (countAvailableEl) countAvailableEl.textContent = `(${available})`;

  const countMaintenanceEl = document.getElementById('count-maintenance');
  if (countMaintenanceEl) countMaintenanceEl.textContent = `(${maintenance})`;
}

function updateChipCounters() {
  updateLedgerChipCounts();
}

document.addEventListener('wedrive:language-applied', () => {
  renderCarTable();
  updateChipCounters();
});

window.filterCarLedger = function(status, el) {
  currentLedgerFilter = status;
  document.querySelectorAll('.ledger-chip').forEach(chip => chip.classList.remove('active'));
  if (el) {
    el.classList.add('active');
  } else {
    const target = document.getElementById(`chip-${status}`);
    if (target) target.classList.add('active');
  }
  renderCarTable();
};

function isCurrentMalay() {
  const lang = localStorage.getItem('wedrive-lang') || localStorage.getItem('wedrive_lang') || document.documentElement.lang || 'en';
  return lang === 'ms';
}

function getBilingualCarStatus(status, isMalay) {
  const s = (status || '').toLowerCase();
  if (s === 'available' || s === 'tersedia') {
    return { cssClass: 'available', label: isMalay ? 'Tersedia' : 'Available' };
  } else if (s === 'rented' || s === 'sedang disewa' || s === 'disewa') {
    return { cssClass: 'rented', label: isMalay ? 'Sedang Disewa' : 'Rented' };
  } else if (s === 'maintenance' || s === 'penyelenggaraan') {
    return { cssClass: 'maintenance', label: isMalay ? 'Penyelenggaraan' : 'Maintenance' };
  }
  return { cssClass: s, label: status || 'Unknown' };
}

function renderCarTable() {
  const tbody = document.getElementById('car-tbody');
  if (!tbody) return;

  const isMalay = isCurrentMalay();

  let filtered = allCars;
  if (currentLedgerFilter === 'rented') {
    filtered = allCars.filter(c => {
      const s = (c.status || '').toLowerCase();
      return s === 'rented' || s === 'sedang disewa' || s === 'disewa';
    });
  } else if (currentLedgerFilter === 'available') {
    filtered = allCars.filter(c => {
      const s = (c.status || '').toLowerCase();
      return s === 'available' || s === 'tersedia';
    });
  } else if (currentLedgerFilter === 'maintenance') {
    filtered = allCars.filter(c => {
      const s = (c.status || '').toLowerCase();
      return s === 'maintenance' || s === 'penyelenggaraan';
    });
  }

  if (filtered.length === 0) {
    const emptyMsg = isMalay
      ? 'Tiada unit kereta dijumpai untuk penapis status ini.'
      : 'No cars found matching this status filter.';
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 48px 16px; color: var(--text-secondary);">
          <span class="material-icons-round fs-32 opacity-50 mb-8" style="display: block; margin: 0 auto 8px;">directions_car</span>
          <span style="font-size: 14px; font-weight: 500;">${emptyMsg}</span>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filtered.map(v => {
    const st = getBilingualCarStatus(v.status, isMalay);
    const trans = v.transmission === 'Automatic' ? (isMalay ? 'Automatik' : 'Automatic') : (isMalay ? 'Manual' : 'Manual');
    const seatsText = `${v.seats || 5} ${isMalay ? 'Tempat Duduk' : 'Seater'}`;
    const btnText = isMalay ? 'Urus' : 'Manage';
    return `
      <tr>
        <td><strong>${v.name}</strong></td>
        <td><span class="jpj-plate-badge">${v.plate}</span></td>
        <td>${v.label || v.type}</td>
        <td><span class="status-badge ${st.cssClass}"><span class="dot"></span> ${st.label}</span></td>
        <td><span class="font-tabular fw-700">${v.rate}</span></td>
        <td>${seatsText}</td>
        <td>${trans}</td>
        <td><button class="btn-primary-sm" data-navigate="../car/car-detail/car-detail.html?id=${v.id}">${btnText}</button></td>
      </tr>
    `;
  }).join('');
}

// ─── LANGUAGE EVENT LISTENER ─────────────────────────────────────────────────
document.addEventListener('wedrive:language-applied', () => {
  updateStatsUI();
  updateLedgerChipCounts();
  renderCarTable();
});
