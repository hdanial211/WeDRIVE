/**
 * WeDRIVE - Car / Cars Module JS
 * admin/js/cars.js
 * Focus: Rental only (no maintenance/service/mileage)
 */

let allCar = [];
let currentFilter = 'all';
let currentSearch = '';

window.WeDriveAPI.getAdminData()
  .then(data => {
    allCar = data.car || [];
    populateCarStats(allCar);
    renderCarCards(allCar);
    renderCarTable(allCar);
  })
  .catch(err => console.error('Car data load error:', err));

/* ── Stats ── */
function populateCarStats(car) {
  const total = car.length;
  const available = car.filter(c => c.status === 'Available').length;
  const rented = car.filter(c => c.status === 'Rented').length;

  document.getElementById('fl-total').textContent = total;
  document.getElementById('fl-available').textContent = available;
  document.getElementById('fl-rented').textContent = rented;
}

/* ── Card Grid ── */
function renderCarCards(car) {
  const grid = document.getElementById('car-grid');
  if (!grid) return;
  if (car.length === 0) {
    grid.innerHTML = '<div class="card" style="padding:40px;text-align:center;color:#94A3B8;grid-column:1/-1">No vehicles found</div>';
    return;
  }
  grid.innerHTML = car.map(car => {
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
function renderCarTable(car) {
  const tbody = document.getElementById('car-tbody');
  if (!tbody) return;
  if (car.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:40px">No vehicles found</td></tr>';
    return;
  }
  tbody.innerHTML = car.map(car => {
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
function filterCar(status, btn) {
  currentFilter = status;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

/* ── Search ── */
function searchCar(query) {
  currentSearch = query.toLowerCase();
  applyFilters();
}

/* ── Combined filter + search ── */
function applyFilters() {
  let filtered = allCar;
  if (currentFilter !== 'all') {
    filtered = filtered.filter(c => c.status === currentFilter);
  }
  if (currentSearch) {
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(currentSearch) ||
      c.plate.toLowerCase().includes(currentSearch)
    );
  }
  renderCarCards(filtered);
  renderCarTable(filtered);
}

/* ── Actions ── */
function manageCar(id) {
  window.location.href = `car-detail/car-detail.html?id=${id}`;
}

function addNewCar() {
  // Create modal if not exists
  let modal = document.getElementById('add-car-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'add-car-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-container" style="max-width:600px;width:95%;">
      <div class="modal-header">
        <h3><span class="material-icons-round" style="font-size:20px;vertical-align:middle;margin-right:6px;">add_circle</span> Add New Car</h3>
        <button class="modal-close-btn" onclick="closeAddCarModal()">
          <span class="material-icons-round">close</span>
        </button>
      </div>
      <div class="modal-body">
        <form id="add-car-form" class="form-grid" onsubmit="submitNewCar(event)">
          <div class="form-group"><label>Vehicle Name</label><input type="text" id="new-name" required placeholder="e.g. 2024 Honda Civic 1.5 V" /></div>
          <div class="form-group"><label>Plate Number</label><input type="text" id="new-plate" required placeholder="e.g. ABC 1234" /></div>
          <div class="form-group"><label>Vehicle Type</label>
            <select id="new-type"><option value="Sedan">Sedan</option><option value="SUV">SUV</option><option value="Hatchback">Hatchback</option><option value="MPV">MPV</option><option value="Coupe">Coupe</option><option value="Truck">Truck</option></select>
          </div>
          <div class="form-group"><label>Fuel Type</label>
            <select id="new-fuel"><option value="Petrol">Petrol</option><option value="Diesel">Diesel</option><option value="Hybrid">Hybrid</option><option value="Electric">Electric</option></select>
          </div>
          <div class="form-group"><label>Transmission</label>
            <select id="new-trans"><option value="Auto">Auto</option><option value="Manual">Manual</option></select>
          </div>
          <div class="form-group"><label>Seats</label>
            <select id="new-seats"><option value="2">2</option><option value="4">4</option><option value="5" selected>5</option><option value="7">7</option><option value="8">8</option></select>
          </div>
          <div class="form-group"><label>Daily Rate (RM)</label><input type="number" id="new-rate" required placeholder="e.g. 200" min="1" /></div>
          <div style="grid-column:1/-1;display:flex;gap:12px;justify-content:flex-end;margin-top:8px;">
            <button type="button" class="btn-outline-sm" onclick="closeAddCarModal()">Cancel</button>
            <button type="submit" class="btn-primary-sm" style="padding:10px 24px;" id="add-car-submit-btn">
              <span class="material-icons-round" style="font-size:14px">add</span> Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>`;
    document.body.appendChild(modal);
  }
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeAddCarModal() {
  const modal = document.getElementById('add-car-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

async function submitNewCar(e) {
  e.preventDefault();
  const btn = document.getElementById('add-car-submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:14px">hourglass_empty</span> Saving...';

  const newCar = {
    name: document.getElementById('new-name').value.trim(),
    plate: document.getElementById('new-plate').value.trim().toUpperCase(),
    type: document.getElementById('new-type').value,
    label: document.getElementById('new-type').value,
    fuel: document.getElementById('new-fuel').value,
    transmission: document.getElementById('new-trans').value,
    trans: document.getElementById('new-trans').value,
    seats: parseInt(document.getElementById('new-seats').value),
    rate: 'RM ' + document.getElementById('new-rate').value + '/day',
    status: 'Available',
    images: []
  };

  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      const result = await window.supabaseClient.from('cars').insert([newCar]).select();
      if (result.error) throw result.error;
      allCar.push(result.data[0]);
      populateCarStats(allCar);
      renderCarCards(allCar);
      renderCarTable(allCar);
      closeAddCarModal();
      document.getElementById('add-car-form').reset();
      alert('New vehicle added to database!');
    } catch (err) {
      console.error('[WeDRIVE] Add car error:', err);
      alert('Error adding vehicle: ' + err.message);
    }
  } else {
    newCar.id = Date.now();
    allCar.push(newCar);
    populateCarStats(allCar);
    renderCarCards(allCar);
    renderCarTable(allCar);
    closeAddCarModal();
    document.getElementById('add-car-form').reset();
    alert('New vehicle added (demo mode)');
  }

  btn.disabled = false;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:14px">add</span> Add Vehicle';
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
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    closeCarListModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeCarListModal();
});
