/**
 * WeDRIVE - Admin Module JS
 * Data fetched from shared/dummy/data.json
 * Switch to real API endpoint when backend is ready.
 */

// ─── FETCH & INITIALISE ───────────────────────────────────────────────────────
window.WeDriveAPI.getAdminData()
  .then(data => {
    populateStats(data.stats);
    populateCar(data.car);
  })
  .catch(err => {
    console.error('Admin data load error:', err);
  });

// ─── STATS ────────────────────────────────────────────────────────────────────
let adminStats = null;

function updateStatsUI() {
  if (!adminStats) return;

  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const isMalay = lang === 'ms';

  // 1. Total Vehicles Sub-label
  const vehiclesChangeEl = document.getElementById('stat-vehicles-change');
  if (vehiclesChangeEl) {
    const available = adminStats.available_vehicles !== undefined ? adminStats.available_vehicles : adminStats.total_vehicles;
    const text = isMalay ? `${available} tersedia` : `${available} available`;
    vehiclesChangeEl.innerHTML = `<span class="material-icons-round" style="font-size:14px">check_circle</span> ${text}`;
  }

  // 2. Active Rentals Sub-label
  const rentalsChangeEl = document.getElementById('stat-rentals-change');
  if (rentalsChangeEl) {
    const active = adminStats.active_rentals || 0;
    const text = isMalay ? `${active} aktif hari ini` : `${active} active today`;
    rentalsChangeEl.innerHTML = `<span class="material-icons-round" style="font-size:14px">arrow_upward</span> ${text}`;
  }

  // 3. Revenue Sub-label
  const revenueChangeEl = document.getElementById('stat-revenue-change');
  if (revenueChangeEl) {
    const revenueMonth = adminStats.revenue_this_month || 0;
    const text = isMalay ? `RM ${revenueMonth.toLocaleString()} bulan ini` : `RM ${revenueMonth.toLocaleString()} this month`;
    revenueChangeEl.innerHTML = `<span class="material-icons-round" style="font-size:14px">arrow_upward</span> ${text}`;
  }

  // 4. Customers Sub-label
  const customersChangeEl = document.getElementById('stat-customers-change');
  if (customersChangeEl) {
    const newCustMonth = adminStats.new_customers_this_month !== undefined ? adminStats.new_customers_this_month : adminStats.new_customers;
    const text = isMalay ? `${newCustMonth} berdaftar bulan ini` : `${newCustMonth} registered this month`;
    customersChangeEl.innerHTML = `<span class="material-icons-round" style="font-size:14px">arrow_upward</span> ${text}`;
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

document.addEventListener('wedrive:language-applied', updateStatsUI);

// ─── CAR TABLE ──────────────────────────────────────────────────────────────
function populateCar(car) {
  const tbody = document.getElementById('car-tbody');
  if (!tbody) return;
  tbody.innerHTML = car.map(v => `
    <tr>
      <td><strong>${v.name}</strong></td>
      <td>${v.plate}</td>
      <td>${v.label || v.type}</td>
      <td><span class="status-badge ${v.status.toLowerCase()}"><span class="dot"></span> ${v.status}</span></td>
      <td>${v.rate}</td>
      <td>${v.seats || 5} Seater</td>
      <td>${v.transmission}</td>
      <td><button class="btn-primary-sm" onclick="window.location='../car/car-detail/car-detail.html?id=${v.id}'">Manage</button></td>
    </tr>
  `).join('');
}
