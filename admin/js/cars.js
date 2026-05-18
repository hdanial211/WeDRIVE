/**
 * WeDRIVE - Fleet / Cars Module JS
 * admin/js/cars.js
 * Focus: Rental only (no maintenance/service/mileage)
 */

let allFleet = [];
let currentFilter = 'all';
let currentSearch = '';

window.WeDriveAPI.getAdminData()
  .then(data => {
    allFleet = data.fleet || [];
    populateFleetStats(allFleet);
    renderFleetCards(allFleet);
    renderFleetTable(allFleet);
  })
  .catch(err => console.error('Fleet data load error:', err));

/* ── Stats ── */
function populateFleetStats(fleet) {
  const total = fleet.length;
  const available = fleet.filter(c => c.status === 'Available').length;
  const rented = fleet.filter(c => c.status === 'Rented').length;

  document.getElementById('fl-total').textContent = total;
  document.getElementById('fl-available').textContent = available;
  document.getElementById('fl-rented').textContent = rented;
}

/* ── Card Grid ── */
function renderFleetCards(fleet) {
  const grid = document.getElementById('fleet-grid');
  if (!grid) return;
  if (fleet.length === 0) {
    grid.innerHTML = '<div class="card" style="padding:40px;text-align:center;color:#94A3B8;grid-column:1/-1">No vehicles found</div>';
    return;
  }
  grid.innerHTML = fleet.map(car => {
    const statusColors = {
      'Available': { bg: '#D1FAE5', text: '#059669', icon: 'check_circle' },
      'Rented': { bg: '#DBEAFE', text: '#2563EB', icon: 'car_rental' }
    };
    const sc = statusColors[car.status] || statusColors['Available'];

    return `
    <div class="card car-card reveal-on-scroll">
      <!-- Car Image -->
      <div style="width:100%;height:160px;background:linear-gradient(135deg,var(--slate-50),var(--slate-100));border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:16px;overflow:hidden;">
        ${car.images && car.images.length > 0
          ? `<img src="../../../shared/model/${car.images[0]}" alt="${car.name}" style="width:100%;height:100%;object-fit:cover;border-radius:12px;" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span class="material-icons-round" style="font-size:56px;color:var(--primary);opacity:0.6;display:none;align-items:center;justify-content:center;width:100%;height:100%;">directions_car</span>`
          : `<span class="material-icons-round" style="font-size:56px;color:var(--primary);opacity:0.6;">directions_car</span>`
        }
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
        <h4 style="font-size:16px;font-weight:700;color:var(--navy);margin:0;">${car.name}</h4>
        <span style="font-size:11px;font-weight:700;color:${sc.text};background:${sc.bg};padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:4px;">
          <span class="material-icons-round" style="font-size:12px">${sc.icon}</span> ${car.status}
        </span>
      </div>

      <div style="font-size:12px;color:var(--slate-400);font-weight:600;margin-bottom:12px;">${car.plate} · ${car.label || car.type}</div>

      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:12px;">
        <div style="display:flex;align-items:center;gap:6px;color:var(--slate-600);">
          <span class="material-icons-round" style="font-size:14px;color:var(--primary)">airline_seat_recline_normal</span> ${car.seats || 5} Seats
        </div>
        <div style="display:flex;align-items:center;gap:6px;color:var(--slate-600);">
          <span class="material-icons-round" style="font-size:14px;color:var(--primary)">settings</span> ${car.transmission}
        </div>
        <div style="display:flex;align-items:center;gap:6px;color:var(--slate-600);">
          <span class="material-icons-round" style="font-size:14px;color:var(--primary)">local_gas_station</span> ${car.fuel}
        </div>
      </div>

      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:16px;padding-top:14px;border-top:1px solid var(--slate-100);">
        <div style="font-size:18px;font-weight:700;color:var(--primary);">${car.rate}</div>
        <button class="btn-primary-sm" onclick="manageCar(${car.id})" style="font-size:12px;padding:8px 16px;">
          <span class="material-icons-round" style="font-size:14px">edit</span> Manage
        </button>
      </div>
    </div>`;
  }).join('');
}

/* ── Table ── */
function renderFleetTable(fleet) {
  const tbody = document.getElementById('fleet-tbody');
  if (!tbody) return;
  if (fleet.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:40px">No vehicles found</td></tr>';
    return;
  }
  tbody.innerHTML = fleet.map(car => {
    const statusClass = car.status === 'Available' ? 'available' : 'rented';
    return `
    <tr>
      <td><strong>${car.name}</strong></td>
      <td>${car.plate}</td>
      <td>${car.label || car.type}</td>
      <td>${car.seats || 5} Seats</td>
      <td>${car.transmission}</td>
      <td>${car.fuel}</td>
      <td><strong>${car.rate}</strong></td>
      <td><span class="status-badge ${statusClass}"><span class="dot"></span> ${car.status}</span></td>
      <td>
        <button class="btn-primary-sm" onclick="manageCar(${car.id})" style="font-size:12px;padding:6px 12px">
          <span class="material-icons-round" style="font-size:14px">edit</span> Manage
        </button>
      </td>
    </tr>`;
  }).join('');
}

/* ── Filter ── */
function filterFleet(status, btn) {
  currentFilter = status;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

/* ── Search ── */
function searchFleet(query) {
  currentSearch = query.toLowerCase();
  applyFilters();
}

/* ── Combined filter + search ── */
function applyFilters() {
  let filtered = allFleet;
  if (currentFilter !== 'all') {
    filtered = filtered.filter(c => c.status === currentFilter);
  }
  if (currentSearch) {
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(currentSearch) ||
      c.plate.toLowerCase().includes(currentSearch)
    );
  }
  renderFleetCards(filtered);
  renderFleetTable(filtered);
}

/* ── Actions ── */
function manageCar(id) {
  window.location.href = `car-detail.html?id=${id}`;
}

function addNewCar() {
  alert('Add New Car - Feature will be available when backend is ready.');
}

/* ── Cars List Modal ── */
function openCarListModal() {
  const modal = document.getElementById('cars-list-modal');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCarListModal() {
  const modal = document.getElementById('cars-list-modal');
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeCarListModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeCarListModal();
});
