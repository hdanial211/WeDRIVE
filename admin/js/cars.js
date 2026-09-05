/**
 * WeDRIVE - Car / Cars Module JS
 * admin/js/cars.js
 * Focus: Rental only (no maintenance/service/mileage)
 */

let allCar = [];
let currentFilter = 'all';
let currentSearch = '';

let currentViewMode = localStorage.getItem('wedrive_car_view_mode') || 'grid';

window.WeDriveAPI.getAdminData()
  .then(data => {
    allCar = data.car || [];
    populateCarStats(allCar);
    renderCarCards(allCar);
    renderCarTable(allCar);
    setCarViewMode(currentViewMode);

    var filterParam = new URLSearchParams(window.location.search).get('filter');
    if (filterParam) {
      var chips = document.querySelectorAll('.filter-chip');
      chips.forEach(function(c) {
        if (c.textContent.trim().toLowerCase() === filterParam.toLowerCase()) {
          filterCar(filterParam, c);
        }
      });
    }

    if (new URLSearchParams(window.location.search).get('action') === 'add') {
      addNewCar();
    }
  })
  .catch(err => console.error('Car data load error:', err));

/* ── View Toggle (Grid vs List) ── */
function setCarViewMode(mode) {
  currentViewMode = mode;
  localStorage.setItem('wedrive_car_view_mode', mode);
  
  const gridEl = document.getElementById('car-grid');
  const listEl = document.getElementById('car-list-container');
  const toggleBtn = document.getElementById('car-view-toggle-btn');
  
  const lang = localStorage.getItem('wedrive_lang') || 'ms';
  const isEn = lang === 'en';

  if (mode === 'list') {
    if (gridEl) {
      gridEl.classList.add('hidden');
      gridEl.style.display = 'none';
    }
    if (listEl) {
      listEl.classList.remove('hidden');
      listEl.style.display = 'block';
      listEl.style.animation = 'pageTransitionIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = `<span class="material-icons-round fs-16">grid_view</span> ${isEn ? 'Grid View' : 'Paparan Grid'}`;
      toggleBtn.title = isEn ? 'Switch to Grid View' : 'Tukar ke Paparan Grid';
    }
  } else {
    if (listEl) {
      listEl.classList.add('hidden');
      listEl.style.display = 'none';
    }
    if (gridEl) {
      gridEl.classList.remove('hidden');
      gridEl.style.display = 'grid';
      gridEl.style.animation = 'pageTransitionIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    }
    if (toggleBtn) {
      toggleBtn.innerHTML = `<span class="material-icons-round fs-16">view_list</span> ${isEn ? 'List View' : 'Paparan Senarai'}`;
      toggleBtn.title = isEn ? 'Switch to List View' : 'Tukar ke Paparan Senarai';
    }
  }
}

function toggleCarView() {
  setCarViewMode(currentViewMode === 'grid' ? 'list' : 'grid');
}

/* ── Stats ── */
function populateCarStats(car) {
  const total = car.length;
  const available = car.filter(c => c.status === 'Available').length;
  const rented = car.filter(c => c.status === 'Rented').length;

  const totalEl = document.getElementById('fl-total');
  if (totalEl) totalEl.textContent = total;
  const availEl = document.getElementById('fl-available');
  if (availEl) availEl.textContent = available;
  const rentedEl = document.getElementById('fl-rented');
  if (rentedEl) rentedEl.textContent = rented;

  const cntAll = document.getElementById('count-all');
  if (cntAll) cntAll.textContent = total;
  const cntAvail = document.getElementById('count-avail');
  if (cntAvail) cntAvail.textContent = available;
  const cntRented = document.getElementById('count-rented');
  if (cntRented) cntRented.textContent = rented;
}

/* ── Card Grid (Apple HIG Bento Showcase) ── */
function renderCarCards(car) {
  const grid = document.getElementById('car-grid');
  if (!grid) return;
  if (car.length === 0) {
    grid.innerHTML = '<div class="card p-40 text-center col-span-full radius-24 bg-surface-2 border-subtle text-muted">No vehicles found</div>';
    return;
  }
  grid.innerHTML = car.map(c => {
    const isAvail = c.status === 'Available';
    const sc = isAvail
      ? { text: '#10B981', dot: '#10B981', label: 'Tersedia' }
      : { text: '#0071E3', dot: '#0071E3', label: 'Sedang Disewa' };

    const img0 = (c.images && c.images.length > 0) ? c.images[0] : null;
    const src = img0 ? ((img0.startsWith('http://') || img0.startsWith('https://') || img0.startsWith('data:')) ? img0 : '../../../shared/model/' + img0) : '../../../shared/model/bezza.png';
    const rateNum = c.rate ? String(c.rate).replace(/[^0-9.]/g, '') : '150';

    return `
    <div class="apple-car-showcase-card reveal-on-scroll">
      <div class="apple-car-studio-canvas">
        <div class="glass-status-pill">
          <span class="live-pulse-dot" style="background:${sc.dot}"></span> ${sc.label}
        </div>
        <img src="${src}" alt="${c.name}" class="apple-car-studio-img" onerror="this.src='../../../shared/model/bezza.png'" />
      </div>

      <div class="apple-car-card-body">
        <div class="apple-car-meta-header">
          <span class="apple-category-pill">${c.type || 'Kereta'}</span>
          <span class="apple-plate-pill tabular-nums">${c.plate || '-'}</span>
        </div>

        <h3 class="apple-car-title" title="${c.name}">${c.name}</h3>

        <div class="apple-micro-specs">
          <span class="apple-spec-tag"><span class="material-icons-round">settings</span> ${c.transmission || 'Auto'}</span>
          <span class="apple-spec-tag"><span class="material-icons-round">local_gas_station</span> ${c.fuel || 'Petrol'}</span>
          <span class="apple-spec-tag"><span class="material-icons-round">airline_seat_recline_normal</span> ${c.seats || 5} Kerusi</span>
        </div>

        <div class="apple-rental-callout">
          <div class="apple-rental-row">
            <span class="apple-rental-label"><span class="material-icons-round fs-15">info</span> Status Operasi</span>
            <span class="apple-rental-value fw-600 ${isAvail ? 'text-emerald' : 'text-primary'}">${sc.label}</span>
          </div>
          <div class="apple-rental-row">
            <span class="apple-rental-label"><span class="material-icons-round fs-15">location_on</span> Pusat Operasi</span>
            <span class="apple-rental-value">Cawangan Utama Melaka Sentral</span>
          </div>
        </div>

        <div class="apple-car-footer">
          <div>
            <div class="apple-car-rate">RM ${rateNum} <span class="apple-car-rate-sub">/hari</span></div>
          </div>
          <div class="flex-center gap-8">
            <button class="apple-btn-capsule-secondary" onclick="window.location.href='car-detail/car-detail.html?id=${c.id}'">
              <span class="material-icons-round fs-14">info</span> Perincian
            </button>
            <button class="apple-btn-capsule-primary" onclick="manageCar(${c.id})">
              <span class="material-icons-round fs-14">tune</span> Urus
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ── Table (Apple Precision Standard) ── */
function renderCarTable(car) {
  const tbody = document.getElementById('car-tbody');
  if (!tbody) return;
  if (car.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:var(--text-tertiary);padding:40px">No vehicles found</td></tr>';
    return;
  }
  tbody.innerHTML = car.map(car => {
    const isAvail = car.status === 'Available';
    const sc = isAvail
      ? { bg: 'rgba(16, 185, 129, 0.12)', text: '#10B981', dot: '#10B981', label: 'Tersedia' }
      : { bg: 'rgba(0, 113, 227, 0.12)', text: '#0071E3', dot: '#0071E3', label: 'Sedang Disewa' };
    
    const img0 = (car.images && car.images.length > 0) ? car.images[0] : null;
    const src = img0 ? ((img0.startsWith('http://') || img0.startsWith('https://') || img0.startsWith('data:')) ? img0 : '../../../shared/model/' + img0) : '../../../shared/model/bezza.png';
    const rateNum = car.rate ? String(car.rate).replace(/[^0-9.]/g, '') : '150';

    return `
    <tr style="border-bottom: 1px solid var(--border-subtle); transition: background 0.15s ease;">
      <td style="padding:14px 20px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:48px; height:36px; border-radius:8px; overflow:hidden; background:var(--bg-surface-3); display:flex; align-items:center; justify-content:center; flex-shrink:0; border:1px solid var(--border-subtle);">
            <img src="${src}" alt="${car.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='../../../shared/model/bezza.png';" />
          </div>
          <div>
            <div style="font-weight:600; color:var(--text-primary); font-size:14px;">${car.name}</div>
            <div style="font-size:12px; color:var(--text-tertiary);">${car.label || car.type}</div>
          </div>
        </div>
      </td>
      <td style="padding:14px 20px;"><span class="apple-plate-pill tabular-nums">${car.plate}</span></td>
      <td style="padding:14px 20px; color:var(--text-secondary);">${car.type || 'Sedan'}</td>
      <td style="padding:14px 20px; color:var(--text-secondary);">${car.seats || 5} Seats</td>
      <td style="padding:14px 20px; color:var(--text-secondary);">${car.transmission || 'Auto'}</td>
      <td style="padding:14px 20px; color:var(--text-secondary);">${car.fuel || 'Petrol'}</td>
      <td style="padding:14px 20px; font-weight:700; color:var(--primary); font-size:14px;">RM ${rateNum}/hari</td>
      <td style="padding:14px 20px;">
        <span style="display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; background:${sc.bg}; color:${sc.text};">
          <span style="width:6px; height:6px; border-radius:50%; background:${sc.dot};"></span> ${sc.label}
        </span>
      </td>
      <td style="padding:14px 20px; text-align:right;">
        <button class="apple-btn-capsule-primary" onclick="manageCar(${car.id})">
          <span class="material-icons-round fs-14">tune</span> Urus
        </button>
      </td>
    </tr>`;
  }).join('');
}

/* ── Filter ── */
function filterCar(status, btn) {
  currentFilter = status || 'all';
  document.querySelectorAll('.apple-segment-item, .apple-segment-btn, .filter-chip').forEach(c => {
    c.classList.remove('active');
  });
  if (btn) {
    btn.classList.add('active');
  } else {
    const target = document.querySelector(`.apple-segment-item[data-status="${status}"], .apple-segment-btn[data-status="${status}"]`);
    if (target) target.classList.add('active');
  }
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

/* ── New Car Photos State ── */
var _newCarImages = []; // Holds uploaded images (Supabase URLs or base64)

function _resetNewCarImages() {
  _newCarImages = [];
  var grid = document.getElementById('new-img-grid');
  var label = document.getElementById('new-img-count');
  if (grid) grid.innerHTML = '<span style="color:var(--slate-400);font-size:12px;">No photos yet. Upload at least 1 photo.</span>';
  if (label) label.textContent = '0/10 photos';
}

async function handleNewCarImageUpload(event) {
  var files = event.target.files;
  if (!files || !files.length) return;
  var remaining = 10 - _newCarImages.length;
  if (remaining <= 0) { showToast('Maximum 10 photos.', 'info'); event.target.value = ''; return; }
  var toProcess = Math.min(files.length, remaining);
  var useStorage = window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient;
  var BUCKET = 'car-images';
  var SUPABASE_URL = 'https://nigyovaqffwyinovivls.supabase.co';
  showToast('Uploading photo(s)...', 'info');
  var uploaded = 0;
  for (var i = 0; i < toProcess; i++) {
    var file = files[i];
    if (!file.type.startsWith('image/')) continue;
    if (useStorage) {
      try {
        var ext = file.name.split('.').pop() || 'jpg';
        var path = 'new-car/' + Date.now() + '-' + i + '.' + ext;
        var up = await window.supabaseClient.storage.from(BUCKET).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });
        if (up.error) throw up.error;
        _newCarImages.push(SUPABASE_URL + '/storage/v1/object/public/' + BUCKET + '/' + path);
        uploaded++;
      } catch(err) {
        console.warn('[WeDRIVE] Supabase storage upload failed, falling back to base64:', err);
        await new Promise(function(resolve) {
          var reader = new FileReader();
          reader.onload = function(e) {
            _newCarImages.push(e.target.result);
            uploaded++;
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      await new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function(e) { _newCarImages.push(e.target.result); uploaded++; resolve(); };
        reader.readAsDataURL(file);
      });
    }
  }
  _renderNewCarImagesGrid();
  showToast(uploaded + ' photo(s) added!', 'success');
  event.target.value = '';
}

function _renderNewCarImagesGrid() {
  var grid = document.getElementById('new-img-grid');
  var label = document.getElementById('new-img-count');
  if (!grid) return;
  if (label) label.textContent = _newCarImages.length + '/10 photos';
  if (!_newCarImages.length) {
    grid.innerHTML = '<span style="color:var(--slate-400);font-size:12px;">No photos yet. Upload at least 1 photo.</span>';
    return;
  }
  grid.innerHTML = _newCarImages.map(function(src, idx) {
    return '<div style="position:relative;width:80px;height:60px;border-radius:8px;overflow:hidden;flex-shrink:0;">'
      + '<img src="' + src + '" style="width:100%;height:100%;object-fit:cover;" />'
      + '<button type="button" onclick="_removeNewCarImage(' + idx + ')" style="position:absolute;top:2px;right:2px;background:#EF4444;border:none;color:#fff;border-radius:50%;width:18px;height:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:12px;line-height:1;">x</button>'
      + '</div>';
  }).join('');
}

function _removeNewCarImage(idx) {
  _newCarImages.splice(idx, 1);
  _renderNewCarImagesGrid();
}

function addNewCar() {
  _resetNewCarImages();

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
          <!-- Photo Upload (required) -->
          <div class="add-car-form-group" style="grid-column: 1 / -1;">
            <label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary);letter-spacing:0.5px;display:flex;align-items:center;gap:6px;">
              Vehicle Photos
              <span style="background:#EF4444;color:#fff;font-size:9px;padding:2px 6px;border-radius:4px;font-weight:700;">REQUIRED</span>
            </label>
            <div id="new-img-grid" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;min-height:40px;align-items:center;">
              <span style="color:var(--slate-400);font-size:12px;">No photos yet. Upload at least 1 photo.</span>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <label for="new-img-upload" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border:1.5px solid var(--primary);color:var(--primary);border-radius:8px;font-size:13px;font-weight:600;">
                <span class="material-icons-round" style="font-size:16px;">add_photo_alternate</span> Add Photo
              </label>
              <input type="file" id="new-img-upload" accept="image/*" multiple style="display:none;" onchange="handleNewCarImageUpload(event)" />
              <span id="new-img-count" style="font-size:11px;color:var(--slate-400);">0/10 photos</span>
            </div>
            <span id="new-img-err" style="color:#EF4444;font-size:11px;font-weight:600;margin-top:4px;display:none;">Please upload at least 1 photo before adding the vehicle.</span>
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
  } else {
    // Reset photo grid when modal is reused
    _resetNewCarImages();
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
  _resetNewCarImages();
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

  /* ── Photo validation ── */
  var imgErrEl = document.getElementById('new-img-err');
  if (_newCarImages.length === 0) {
    if (imgErrEl) { imgErrEl.style.display = 'block'; }
    showToast(isMalay ? 'Sila muat naik sekurang-kurangnya 1 gambar kenderaan.' : 'Please upload at least 1 vehicle photo before adding.', 'error');
    if (hasError) return;
    return; // Block save — no photo
  }
  if (imgErrEl) imgErrEl.style.display = 'none';

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
    images: _newCarImages.slice() // Use actual uploaded photos only
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
