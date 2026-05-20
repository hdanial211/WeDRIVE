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
function populateStats(stats) {
  const map = {
    'stat-vehicles': stats.total_vehicles,
    'stat-rentals': stats.active_rentals,
    'stat-revenue': 'RM ' + stats.revenue_today.toLocaleString(),
    'stat-customers': stats.new_customers
  };
  Object.entries(map).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });
}

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
