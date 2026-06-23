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
    if (new URLSearchParams(window.location.search).get('action') === 'add') {
      addNewCar();
    }
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

function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast-notify');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notify';
  const icon = type === 'success' ? 'check_circle' : 'error';
  const bg = type === 'success' ? '#10B981' : '#EF4444';
  
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: ${bg};
    color: #fff;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 99999;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    animation: slideUp 0.3s ease;
  `;
  toast.innerHTML = `<span class="material-icons-round" style="font-size: 18px;">${icon}</span> <span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ── Default Images by Type (for new cars with no upload) ── */
function _getDefaultImages(type) {
  var typeMap = {
    'Sedan':    ['Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-140.jpg', 'Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-070.jpg'],
    'SUV':      ['SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-140.jpg', 'SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-075.jpg'],
    'Hatchback':['Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/frame-140.jpg', 'Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/frame-066.jpg'],
    'MPV':      ['MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/frame-140.jpg', 'MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/frame-070.jpg'],
    'Coupe':    ['Coupe/2018 Mercedes-Benz CLS350 AMG Line 2.0/exterior/full-res/frame-140.jpg', 'Coupe/2018 Mercedes-Benz CLS350 AMG Line 2.0/exterior/full-res/frame-075.jpg'],
    'Truck':    ['Truck/2022 Ford Ranger Raptor High Rider Dual Cab 2.0/exterior/full-res/frame-140.jpg', 'Truck/2022 Ford Ranger Raptor High Rider Dual Cab 2.0/exterior/full-res/frame-075.jpg']
  };
  var t = type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : 'Sedan';
  // Normalise common variations
  var normalised = {
    'sedan': 'Sedan', 'suv': 'SUV', 'hatchback': 'Hatchback', 'mpv': 'MPV', 'coupe': 'Coupe', 'truck': 'Truck'
  }[t.toLowerCase()] || 'Sedan';
  return typeMap[normalised] || typeMap['Sedan'];
}

function addNewCar() {

  // Create modal if not exists
  let modal = document.getElementById('add-car-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'add-car-modal';
    modal.className = 'modal-overlay add-car-modal-overlay';
    modal.innerHTML = `
    <div class="add-car-modal-card" style="max-width:600px;width:95%;" role="dialog" aria-modal="true" aria-labelledby="add-car-modal-title">
      <div class="add-car-modal-header">
        <h3>
          <span class="material-icons-round">add_circle</span>
          <span id="add-car-modal-title" data-key="admin_add_car_title">Add New Vehicle</span>
        </h3>
        <button class="add-car-modal-close-btn" onclick="closeAddCarModal()">
          <span class="material-icons-round">close</span>
        </button>
      </div>
      <div class="add-car-modal-body">
        <form id="add-car-form" class="add-car-form-grid" onsubmit="submitNewCar(event)">
          <div class="add-car-form-group">
            <label for="new-name" data-key="admin_add_car_name">Vehicle Name</label>
            <input type="text" id="new-name" data-key-ph="admin_add_car_name_ph" required placeholder="e.g. 2024 Honda Civic 1.5 V" />
          </div>
          <div class="add-car-form-group">
            <label for="new-plate" data-key="admin_add_car_plate">Plate Number</label>
            <input type="text" id="new-plate" data-key-ph="admin_add_car_plate_ph" required placeholder="e.g. ABC 1234" />
          </div>
          <div class="add-car-form-group">
            <label for="new-type" data-key="admin_add_car_type">Vehicle Type</label>
            <select id="new-type">
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="MPV">MPV</option>
              <option value="Coupe">Coupe</option>
              <option value="Truck">Truck</option>
            </select>
          </div>
          <div class="add-car-form-group">
            <label for="new-fuel" data-key="admin_add_car_fuel">Fuel Type</label>
            <select id="new-fuel">
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
          <div class="add-car-form-group">
            <label for="new-trans" data-key="admin_add_car_trans">Transmission</label>
            <select id="new-trans">
              <option value="Auto">Auto</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div class="add-car-form-group">
            <label for="new-seats" data-key="admin_add_car_seats">Seats</label>
            <select id="new-seats">
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="5" selected>5</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
          <div class="add-car-form-group" style="grid-column: 1 / -1;">
            <label for="new-rate" data-key="admin_add_car_rate">Daily Rate (RM)</label>
            <input type="number" id="new-rate" data-key-ph="admin_add_car_rate_ph" required placeholder="e.g. 200" min="1" />
          </div>
          <div class="add-car-modal-actions">
            <button type="button" class="add-car-btn-cancel" onclick="closeAddCarModal()" data-key="admin_add_car_cancel">Cancel</button>
            <button type="submit" class="add-car-btn-confirm" id="add-car-submit-btn">
              <span class="material-icons-round" style="font-size:14px">add</span>
              <span data-key="admin_add_car_submit">Add Vehicle</span>
            </button>
          </div>
        </form>
      </div>
    </div>`;
    document.body.appendChild(modal);
  }
  
  // Re-run language translation engine so the appended modal elements get translated!
  if (window.setLanguage) {
    const activeLang = localStorage.getItem('wedrive-lang') || 'en';
    window.setLanguage(activeLang);
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
  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const isMalay = lang === 'ms';

  /* ── Inline validation helper ── */
  function setFieldError(id, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.border = '2px solid #EF4444';
    let errEl = document.getElementById(id + '-err');
    if (!errEl) {
      errEl = document.createElement('span');
      errEl.id = id + '-err';
      errEl.style.cssText = 'color:#EF4444;font-size:11px;font-weight:600;margin-top:4px;display:block;';
      el.parentNode.appendChild(errEl);
    }
    errEl.textContent = msg;
  }

  function clearFieldError(id) {
    const el = document.getElementById(id);
    if (el) el.style.border = '';
    const errEl = document.getElementById(id + '-err');
    if (errEl) errEl.textContent = '';
  }

  /* ── Read values ── */
  const nameVal  = document.getElementById('new-name').value.trim();
  const plateVal = document.getElementById('new-plate').value.trim().toUpperCase();
  const rateVal  = parseFloat(document.getElementById('new-rate').value);
  const yearVal  = parseInt(document.getElementById('new-year') ? document.getElementById('new-year').value : 0);
  const colorVal = document.getElementById('new-color') ? document.getElementById('new-color').value.trim() : '';
  const carType  = document.getElementById('new-type').value;
  const fuel     = document.getElementById('new-fuel').value;
  const trans    = document.getElementById('new-trans').value;
  const seats    = parseInt(document.getElementById('new-seats').value);

  /* ── Clear previous errors ── */
  ['new-name','new-plate','new-rate','new-year','new-color'].forEach(clearFieldError);

  /* ── Run validation ── */
  let hasError = false;
  const errRequired = isMalay ? 'Field ini wajib diisi.' : 'This field is required.';

  if (!nameVal) {
    setFieldError('new-name', errRequired);
    hasError = true;
  }
  if (!plateVal) {
    setFieldError('new-plate', errRequired);
    hasError = true;
  } else if (!/^[A-Z0-9 ]{3,10}$/.test(plateVal)) {
    setFieldError('new-plate', isMalay ? 'Format plat tidak sah (contoh: ABC 1234).' : 'Invalid plate format (e.g. ABC 1234).');
    hasError = true;
  }
  if (isNaN(rateVal) || rateVal <= 0) {
    setFieldError('new-rate', isMalay ? 'Kadar harian mesti lebih daripada RM 0.' : 'Daily rate must be greater than RM 0.');
    hasError = true;
  }
  if (document.getElementById('new-year') && (isNaN(yearVal) || yearVal < 2000 || yearVal > new Date().getFullYear() + 1)) {
    setFieldError('new-year', isMalay ? 'Tahun tidak sah.' : 'Invalid year.');
    hasError = true;
  }
  if (document.getElementById('new-color') && !colorVal) {
    setFieldError('new-color', errRequired);
    hasError = true;
  }

  if (hasError) return; // Stop — do NOT submit

  /* ── Proceed with submission ── */
  const btn = document.getElementById('add-car-submit-btn');
  btn.disabled = true;

  const savingText    = isMalay ? 'Menyimpan...' : 'Saving...';
  const successDbText = isMalay ? 'Kenderaan baharu ditambah ke pangkalan data!' : 'New vehicle added to database!';
  const successDemoText = isMalay ? 'Kenderaan baharu ditambah (mod demo)' : 'New vehicle added (demo mode)';
  const errorText     = isMalay ? 'Ralat menambah kenderaan: ' : 'Error adding vehicle: ';

  btn.innerHTML = `<span class="material-icons-round" style="font-size:14px;animation:spin 1s linear infinite">refresh</span> ${savingText}`;

  const newCar = {
    name: nameVal,
    plate: plateVal,
    type: carType,
    label: carType,
    fuel: fuel,
    transmission: trans,
    trans: trans,
    seats: seats,
    rate: 'RM ' + rateVal + '/day',
    price: rateVal,
    status: 'Available',
    rating: 4.5,
    reviews: 0,
    images: _getDefaultImages(carType)
  };

  // Optional fields
  if (yearVal && yearVal >= 2000) newCar.year = yearVal;
  if (colorVal) newCar.color = colorVal;

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
      showToast(successDbText, 'success');
    } catch (err) {
      console.error('[WeDRIVE] Add car error:', err);
      showToast(errorText + err.message, 'error');
    }
  } else {
    newCar.id = Date.now();
    allCar.push(newCar);
    populateCarStats(allCar);
    renderCarCards(allCar);
    renderCarTable(allCar);
    closeAddCarModal();
    document.getElementById('add-car-form').reset();
    showToast(successDemoText, 'success');
  }

  btn.disabled = false;
  btn.innerHTML = `<span class="material-icons-round" style="font-size:14px">add</span> ${isMalay ? 'Tambah Kenderaan' : 'Add Vehicle'}`;
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
