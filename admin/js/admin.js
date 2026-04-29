/**
 * WeDRIVE - Admin Module JS
 * Data fetched from shared/dummy/admin.json
 * Switch to real API endpoint when backend is ready.
 */

// ─── DATA SOURCE ─────────────────────────────────────────────────────────────
const DATA_URL = '../../shared/dummy/admin.json';

// ─── FETCH & INITIALISE ───────────────────────────────────────────────────────
fetch(DATA_URL)
  .then(res => {
    if (!res.ok) throw new Error('Failed to load admin data');
    return res.json();
  })
  .then(data => {
    populateStats(data.stats);
    populateFleet(data.fleet);
  })
  .catch(err => {
    console.error('Admin data load error:', err);
  });

// ─── STATS ────────────────────────────────────────────────────────────────────
function populateStats(stats) {
  const map = {
    'stat-vehicles': stats.total_vehicles,
    'stat-rentals':  stats.active_rentals,
    'stat-revenue':  'RM ' + stats.revenue_today.toLocaleString(),
    'stat-customers': stats.new_customers
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

// ─── FLEET TABLE ──────────────────────────────────────────────────────────────
function populateFleet(fleet) {
  const tbody = document.getElementById('fleet-tbody');
  if (!tbody) return;
  tbody.innerHTML = fleet.map(v => `
    <tr>
      <td><strong>${v.name}</strong></td>
      <td>${v.plate}</td>
      <td>${v.type}</td>
      <td><span class="status-badge ${v.status.toLowerCase()}"><span class="dot"></span> ${v.status}</span></td>
      <td>${v.rate}</td>
      <td>${v.last_service}</td>
      <td><button class="btn-primary-sm">Manage</button></td>
    </tr>
  `).join('');
}
