/**
 * WeDRIVE - Car Detail / Manage Module JS
 * admin/js/car-detail.js
 * Focus: Rental only (seats, transmission, fuel — no mileage/service)
 */

let carData = null;
let allBookings = [];
const IMG_BASE = '../../../../shared/model/';
const MAX_IMAGES = 10;
let currentMainIndex = 0;
let calYear, calMonth; // Calendar state

/* Resolve any image string to a displayable src */
function resolveImgSrc(img) {
  if (!img) return '';
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
  return IMG_BASE + img;
}

// Get car ID from URL params
const urlParams = new URLSearchParams(window.location.search);
const carId = parseInt(urlParams.get('id'));

if (!carId) {
  window.location.href = '../cars.html';
}

window.WeDriveAPI.getAdminData()
  .then(data => {
    const car = data.car || [];
    allBookings = data.bookings || [];
    carData = car.find(c => c.id === carId);

    if (!carData) {
      window.location.href = '../cars.html';
      return;
    }

    // Ensure images array exists
    if (!carData.images) carData.images = [];

    renderCarDetails(carData);
    renderCarImages(carData);
    renderBookingHistory(carData, allBookings);
    initCalendar();
  })
  .catch(err => console.error('Car detail load error:', err));

/* ── Render Car Details ── */
function renderCarDetails(car) {
  // Title
  document.title = `${car.name} | WeDRIVE`;

  // Name & plate
  document.getElementById('cd-name').textContent = car.name;
  document.getElementById('cd-plate-type').textContent = `${car.plate} · ${car.label || car.type}`;

  // Status badge
  const statusEl = document.getElementById('cd-status');
  const statusMap = {
    'Available': { cls: 'available', icon: 'check_circle' },
    'Rented': { cls: 'rented', icon: 'car_rental' }
  };
  const sm = statusMap[car.status] || statusMap['Available'];
  statusEl.className = `status-badge ${sm.cls}`;
  statusEl.innerHTML = `<span class="dot"></span> ${car.status}`;

  // Quick stats (rental-focused)
  document.getElementById('cd-seats').textContent = (car.seats || 5) + ' Seater';
  document.getElementById('cd-trans').textContent = car.transmission;
  document.getElementById('cd-fuel').textContent = car.fuel;

  // Rate
  document.getElementById('cd-rate').textContent = car.rate;

  // Initialize delete modal description text
  updateDeleteModalDescription();
}

/* ── Render Car Images (Main + Thumbnails) ── */
function renderCarImages(car) {
  const mainImg = document.getElementById('cd-main-img');
  const fallback = document.getElementById('cd-img-fallback');
  const thumbContainer = document.getElementById('cd-thumbnails');

  if (car.images && car.images.length > 0) {
    const firstSrc = resolveImgSrc(car.images[0]);
    mainImg.src = firstSrc;
    mainImg.alt = car.name;
    mainImg.classList.remove('hidden');
    mainImg.style.display = 'block';
    fallback.style.display = 'none';

    mainImg.onerror = function () {
      mainImg.style.display = 'none';
      fallback.style.display = 'flex';
    };

    // Thumbnails
    if (car.images.length > 1) {
      thumbContainer.innerHTML = car.images.map((img, idx) => {
        const src = resolveImgSrc(img);
        return `
        <div class="car-thumb ${idx === 0 ? 'active' : ''}" onclick="switchImage(${idx})">
          <img src="${src}" alt="${car.name} ${idx + 1}" onerror="this.parentElement.style.display='none';" />
        </div>`;
      }).join('');
      thumbContainer.style.display = 'flex';
    } else {
      thumbContainer.style.display = 'none';
    }
  } else {
    mainImg.style.display = 'none';
    fallback.style.display = 'flex';
    thumbContainer.style.display = 'none';
  }
}

/* ── Switch Main Image ── */
function switchImage(idx) {
  if (!carData.images || idx >= carData.images.length) return;
  currentMainIndex = idx;

  const mainImg = document.getElementById('cd-main-img');
  const fallback = document.getElementById('cd-img-fallback');
  const src = resolveImgSrc(carData.images[idx]);
  mainImg.src = src;
  mainImg.classList.remove('hidden');
  mainImg.style.display = 'block';
  fallback.style.display = 'none';

  // Update active thumbnail
  document.querySelectorAll('.car-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === idx);
  });
}

/* ── Booking History ── */
function renderBookingHistory(car, bookings) {
  const tbody = document.getElementById('cd-bookings-tbody');
  const carBookings = bookings.filter(b => b.car_id === car.id || b.plate === car.plate);

  if (carBookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:40px;">No booking history for this vehicle</td></tr>';
    return;
  }

  tbody.innerHTML = carBookings.map(b => {
    const statusCls = b.status.toLowerCase();
    const pickup = b.start_date || b.pickup;
    const returnD = b.end_date || b.return;
    const days = b.days || (pickup && returnD ? Math.ceil((new Date(returnD) - new Date(pickup)) / 86400000) : 0);
    return `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.customer || b.customer_name || '--'}</td>
      <td>${pickup}</td>
      <td>${returnD}</td>
      <td>${days}</td>
      <td><strong>RM ${(b.total || 0).toLocaleString()}</strong></td>
      <td><span class="status-badge ${statusCls}"><span class="dot"></span> ${b.status}</span></td>
    </tr>`;
  }).join('');
}

/* ── Edit Details (Modal Popup) ── */
function editDetails() {
  // Populate form with current data
  if (carData) {
    document.getElementById('edit-name').value = carData.name || '';
    document.getElementById('edit-plate').value = carData.plate || '';
    document.getElementById('edit-type').value = carData.type || 'sedan';
    document.getElementById('edit-fuel').value = carData.fuel || 'Petrol';
    document.getElementById('edit-trans').value = carData.transmission || carData.trans || 'Auto';
    document.getElementById('edit-rate').value = parseInt(String(carData.rate || '').replace(/[^0-9]/g, '')) || carData.price || 0;
    document.getElementById('edit-seats').value = carData.seats || 5;

    // Populate images grid
    renderEditImagesGrid();
  }

  const modal = document.getElementById('edit-car-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}
window.editDetails = editDetails;

function closeEditCarModal() {
  const modal = document.getElementById('edit-car-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
window.closeEditCarModal = closeEditCarModal;

/* ── Render Edit Images Grid ── */
function renderEditImagesGrid() {
  const grid = document.getElementById('edit-images-grid');
  const countLabel = document.getElementById('img-count-label');
  const imgs = carData.images || [];

  countLabel.textContent = `${imgs.length}/${MAX_IMAGES} photos`;

  if (imgs.length === 0) {
    grid.innerHTML = '<div style="color:var(--slate-400);font-size:13px;padding:20px;text-align:center;border:2px dashed var(--slate-200);border-radius:12px;">No photos yet. Click "Add Photo" to upload.</div>';
    return;
  }

  grid.innerHTML = imgs.map((img, idx) => {
    const src = resolveImgSrc(img);
    return `
    <div class="edit-img-item">
      <img src="${src}" alt="Photo ${idx + 1}" />
      <button type="button" class="edit-img-remove" onclick="removeImage(${idx})" title="Remove photo">
        <span class="material-icons-round" style="font-size:16px;">close</span>
      </button>
      ${idx === 0 ? '<span class="edit-img-main-badge">Main</span>' : `<button type="button" class="edit-img-set-main" onclick="setMainImage(${idx})" title="Set as main photo"><span class="material-icons-round" style="font-size:12px;">star</span></button>`}
    </div>`;
  }).join('');
}

/* ── Handle Image Upload (Upload to Supabase Storage) ── */
async function handleImageUpload(event) {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  const currentCount = (carData.images || []).length;
  const remaining = MAX_IMAGES - currentCount;

  if (remaining <= 0) {
    showToast(`Maximum ${MAX_IMAGES} photos allowed.`, 'info');
    event.target.value = '';
    return;
  }

  const toProcess = Math.min(files.length, remaining);
  if (files.length > remaining) {
    showToast(`Only ${remaining} more photo(s) can be added. Taking first ${toProcess}.`, 'info');
  }

  const useStorage = window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient;
  const SUPABASE_URL = 'https://nigyovaqffwyinovivls.supabase.co';
  const BUCKET = 'car-images';

  showToast('Uploading photo(s)...', 'info');

  let uploaded = 0;
  for (let i = 0; i < toProcess; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;

    if (useStorage) {
      /* Upload to Supabase Storage */
      try {
        const ext = file.name.split('.').pop() || 'jpg';
        const path = `car-${carData.id}/${Date.now()}-${i}.${ext}`;
        const { error } = await window.supabaseClient.storage.from(BUCKET).upload(path, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type
        });
        if (error) throw error;
        const publicUrl = SUPABASE_URL + '/storage/v1/object/public/' + BUCKET + '/' + path;
        if (!carData.images) carData.images = [];
        carData.images.push(publicUrl);
        uploaded++;
      } catch (err) {
        console.warn('[WeDRIVE] Supabase storage upload failed, falling back to base64:', err);
        await new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = function(e) {
            if (!carData.images) carData.images = [];
            carData.images.push(e.target.result);
            uploaded++;
            resolve();
          };
          reader.readAsDataURL(file);
        });
      }
    } else {
      /* Demo mode: use base64 */
      await new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function (e) {
          if (!carData.images) carData.images = [];
          carData.images.push(e.target.result);
          uploaded++;
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }
  }

  if (uploaded > 0) {
    renderEditImagesGrid();
    renderCarImages(carData);
    showToast(`${uploaded} photo(s) added!`, 'success');
  }

  event.target.value = '';
}


/* ── Remove Image (Custom Modal) ── */
let _pendingRemoveIdx = -1;

function removeImage(idx) {
  if (!carData.images || idx >= carData.images.length) return;
  _pendingRemoveIdx = idx;
  const modal = document.getElementById('remove-photo-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}

function closeRemovePhotoModal() {
  _pendingRemoveIdx = -1;
  const modal = document.getElementById('remove-photo-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

function confirmRemovePhoto() {
  if (_pendingRemoveIdx < 0 || !carData.images) { closeRemovePhotoModal(); return; }
  carData.images.splice(_pendingRemoveIdx, 1);
  if (currentMainIndex >= carData.images.length) currentMainIndex = 0;
  renderEditImagesGrid();
  renderCarImages(carData);
  closeRemovePhotoModal();
  showToast('Photo removed.', 'success');
}


/* ── Set Main Image ── */
function setMainImage(idx) {
  if (!carData.images || idx >= carData.images.length) return;
  const img = carData.images.splice(idx, 1)[0];
  carData.images.unshift(img);
  currentMainIndex = 0;
  renderEditImagesGrid();
  renderCarImages(carData);
  showToast('Main photo updated!', 'success');
}

function cancelEdit() {
  closeEditCarModal();
}
window.cancelEdit = cancelEdit;

async function saveCarEdit(e) {
  e.preventDefault();

  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const isMalay = lang === 'ms';

  // Update local data
  const updatedName = document.getElementById('edit-name').value.trim();
  const updatedPlate = document.getElementById('edit-plate').value.trim().toUpperCase();
  const updatedType = document.getElementById('edit-type').value;
  const updatedFuel = document.getElementById('edit-fuel').value;
  const updatedTrans = document.getElementById('edit-trans').value;
  const updatedSeats = parseInt(document.getElementById('edit-seats').value);
  var rateNum          = parseFloat(document.getElementById('edit-rate').value) || 0;

  // --- Validation ---
  if (!updatedName) {
    showToast(isMalay ? 'Nama kenderaan tidak boleh kosong.' : 'Vehicle name cannot be empty.', 'error');
    return;
  }
  if (!updatedPlate) {
    showToast(isMalay ? 'Nombor plat tidak boleh kosong.' : 'Plate number cannot be empty.', 'error');
    return;
  }
  if (!/^[A-Z0-9 ]{3,10}$/.test(updatedPlate)) {
    showToast(isMalay ? 'Format plat tidak sah (contoh: ABC 1234).' : 'Invalid plate format (e.g. ABC 1234).', 'error');
    return;
  }
  if (rateNum <= 0) {
    showToast(isMalay ? 'Kadar harian mesti lebih daripada RM 0.' : 'Daily rate must be greater than RM 0.', 'error');
    return;
  }
  if (!carData.images || carData.images.length === 0) {
    showToast(isMalay ? 'Sila muat naik sekurang-kurangnya 1 gambar kenderaan.' : 'Please upload at least 1 vehicle photo before saving.', 'error');
    return;
  }

  // Update local data
  carData.name         = updatedName;
  carData.plate        = updatedPlate;
  carData.type         = updatedType;
  carData.label        = updatedType;
  carData.fuel         = updatedFuel;
  carData.transmission = updatedTrans;
  carData.trans        = updatedTrans;
  carData.seats        = updatedSeats;
  carData.rate         = 'RM ' + rateNum + '/day';
  carData.price        = rateNum;

  // Save to Supabase (includes images so photos persist after refresh)
  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var updateData = {
        name:         carData.name,
        plate:        carData.plate,
        type:         carData.type,
        label:        carData.label,
        fuel:         carData.fuel,
        transmission: carData.transmission,
        trans:        carData.trans,
        rate:         carData.rate,
        price:        carData.price,
        seats:        carData.seats,
        images:       carData.images || []
      };
      var result = await window.supabaseClient.from('cars').update(updateData).eq('id', carData.id);
      if (result.error) throw result.error;
      showToast(isMalay ? 'Butiran kenderaan disimpan!' : 'Vehicle details saved!', 'success');
    } catch (err) {
      console.error('[WeDRIVE] Save car error:', err);
      showToast((isMalay ? 'Ralat menyimpan: ' : 'Error saving: ') + err.message, 'error');
    }
  } else {
    showToast(isMalay ? 'Butiran kenderaan dikemas kini (mod demo)' : 'Vehicle details updated (demo mode)', 'success');
  }

  // Re-render
  renderCarDetails(carData);
  renderCarImages(carData);
  cancelEdit();
}

function closeStatusRedirectModal() {
  const modal = document.getElementById('status-redirect-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

/* ── Update Status ── */
async function updateStatus() {
  const modal = document.getElementById('status-redirect-modal');
  const desc = document.getElementById('status-modal-desc');
  const actionBtn = document.getElementById('status-modal-action-btn');
  if (!modal || !desc || !actionBtn) return;

  const isAvailable = carData.status === 'Available';
  
  if (isAvailable) {
    desc.innerHTML = `This vehicle (<strong>${carData.name} - ${carData.plate}</strong>) is currently <strong>Available</strong>. Vehicle status is automatically managed by booking records and cannot be updated manually.<br/><br/>To set this vehicle as Rented, please register a new booking in the system.`;
    actionBtn.innerHTML = '<span class="material-icons-round" style="font-size:16px;">add_circle</span> Create Booking';
    actionBtn.onclick = function() {
      closeStatusRedirectModal();
      window.location.href = '../../booking/bookings.html?action=add&carId=' + carData.id;
    };
  } else {
    desc.innerHTML = `This vehicle (<strong>${carData.name} - ${carData.plate}</strong>) is currently <strong>Rented</strong>. Vehicle status is automatically managed by booking records and cannot be updated manually.<br/><br/>To complete this rental or update the vehicle's status to Available, please manage its active booking in the system.`;
    actionBtn.innerHTML = '<span class="material-icons-round" style="font-size:16px;">book</span> Manage Booking';
    actionBtn.onclick = function() {
      closeStatusRedirectModal();
      window.location.href = '../../booking/bookings.html?search=' + encodeURIComponent(carData.plate);
    };
  }

  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

/* ── Quick Actions ── */
function viewInsurance() {
  const modal = document.getElementById('insurance-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}
window.viewInsurance = viewInsurance;

function closeInsuranceModal() {
  const modal = document.getElementById('insurance-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
window.closeInsuranceModal = closeInsuranceModal;

function updateDeleteModalDescription() {
  const descEl = document.getElementById('delete-car-desc');
  if (descEl && carData) {
    const lang = localStorage.getItem('wedrive-lang') || 'en';
    const langObj = window['wedrive_lang_' + lang];
    let template = (langObj && langObj.cd_delete_modal_desc) 
      || (lang === 'ms' 
          ? "Adakah anda pasti mahu memadamkan {name} ({plate})? Tindakan ini tidak boleh diundur." 
          : "Are you sure you want to remove {name} ({plate})? This action cannot be undone.");
          
    descEl.textContent = template
      .replace('{name}', carData.name)
      .replace('{plate}', carData.plate);
  }
}

// Listen for language toggles to keep the delete modal description synced
document.addEventListener('wedrive:language-applied', updateDeleteModalDescription);

function deleteCar() {
  const modal = document.getElementById('delete-car-modal');
  const pwdInput = document.getElementById('delete-admin-password');
  const errorDiv = document.getElementById('delete-modal-error');
  
  if (pwdInput) pwdInput.value = '';
  if (errorDiv) {
    errorDiv.textContent = '';
    errorDiv.style.display = 'none';
  }
  
  updateDeleteModalDescription();
  
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
}
window.deleteCar = deleteCar;

function closeDeleteCarModal() {
  const modal = document.getElementById('delete-car-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}
window.closeDeleteCarModal = closeDeleteCarModal;

async function submitDeleteCar() {
  const pwdInput = document.getElementById('delete-admin-password');
  const errorDiv = document.getElementById('delete-modal-error');
  const confirmBtn = document.getElementById('confirm-delete-btn');
  
  if (!pwdInput) return;
  const password = pwdInput.value.trim();
  
  const lang = localStorage.getItem('wedrive-lang') || 'en';
  const isMalay = lang === 'ms';

  const errorMsg = isMalay
    ? 'Kata laluan salah atau tidak sah. Sila cuba lagi.'
    : 'Incorrect or invalid password. Please try again.';

  const successToast = isMalay
    ? 'Kenderaan telah dikeluarkan dari pangkalan data!'
    : 'Vehicle removed from database!';

  const demoToast = isMalay
    ? 'Kenderaan telah dikeluarkan (mod demo)'
    : 'Vehicle removed (demo mode)';

  if (!password) {
    if (errorDiv) {
      errorDiv.textContent = isMalay ? 'Sila masukkan kata laluan.' : 'Please enter password.';
      errorDiv.style.display = 'block';
    }
    return;
  }

  // Show loading state on button
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.dataset.originalHtml = confirmBtn.innerHTML;
    confirmBtn.innerHTML = `<span class="material-icons-round" style="font-size:16px;animation:spin 1s linear infinite">refresh</span> ${isMalay ? 'Mengesahkan...' : 'Verifying...'}`;
  }

  let verified = false;

  // Retrieve admin email
  let adminEmail = '';
  try {
    const session = JSON.parse(localStorage.getItem('wedrive_session'));
    if (session && session.email) {
      adminEmail = session.email;
    }
  } catch(e) {}

  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    if (!adminEmail) {
      try {
        const userResult = await window.supabaseClient.auth.getUser();
        if (userResult.data && userResult.data.user) {
          adminEmail = userResult.data.user.email;
        }
      } catch (e) {}
    }

    // Verify if the email is an admin email in the admins table
    let isAdmin = false;
    if (adminEmail) {
      try {
        const checkAdmin = await window.supabaseClient
          .from('admins')
          .select('email')
          .eq('email', adminEmail)
          .maybeSingle();
        if (checkAdmin.data) {
          isAdmin = true;
        }
      } catch (e) {}
    }

    // If it's not an admin email (e.g. they logged in as a customer), fetch the first admin's email to verify the password against
    if (!isAdmin) {
      try {
        const firstAdmin = await window.supabaseClient
          .from('admins')
          .select('email')
          .limit(1);
        if (firstAdmin.data && firstAdmin.data.length > 0) {
          adminEmail = firstAdmin.data[0].email;
        } else {
          adminEmail = 'admin@wedrive.my';
        }
      } catch (e) {
        adminEmail = 'admin@wedrive.my';
      }
    }

    try {
      const loginResult = await window.WeDriveAPI.loginUser(adminEmail, password);
      if (loginResult && loginResult.success && loginResult.role === 'admin') {
        verified = true;
      }
    } catch (err) {
      console.error('[WeDRIVE] Re-auth verification error:', err);
    }
  } else {
    // Demo mode: accept any password
    verified = true;
  }

  if (!verified) {
    if (errorDiv) {
      errorDiv.textContent = errorMsg;
      errorDiv.style.display = 'block';
    }
    if (confirmBtn) {
      confirmBtn.disabled = false;
      confirmBtn.innerHTML = confirmBtn.dataset.originalHtml;
    }
    return;
  }

  // If verified, proceed with deletion
  closeDeleteCarModal();
  
  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var result = await window.supabaseClient.from('cars').delete().eq('id', carData.id);
      if (result.error) throw result.error;
      showToast(successToast, 'success');
    } catch (err) {
      console.error('[WeDRIVE] Delete car error:', err);
      showToast(demoToast, 'success');
    }
  } else {
    showToast(demoToast, 'success');
  }
  setTimeout(() => { window.location.href = '../cars.html'; }, 1500);
}
window.submitDeleteCar = submitDeleteCar;

// Close modals on backdrop click
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// Close modals on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.style.display = 'none';
    });
    document.body.style.overflow = '';
  }
});

/* ── Toast Notification ── */
function showToast(msg, type) {
  const existing = document.querySelector('.toast-notify');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notify';
  const icon = type === 'success' ? 'check_circle' : 'info';
  const bg = type === 'success' ? '#059669' : '#3B82F6';
  toast.style.cssText = `position:fixed;bottom:30px;right:30px;background:${bg};color:#fff;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:slideUp 0.3s ease`;
  toast.innerHTML = `<span class="material-icons-round" style="font-size:18px">${icon}</span> ${msg}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ══════════════════════════════════════════════
   BOOKING CALENDAR — Range Selection
   First click = Pickup date, Second click = Return date
   ══════════════════════════════════════════════ */

let selectedCalDate = null; // Selected date string for details view

function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  selectedCalDate = null;
  renderCalendar();
}

function calendarToday() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderCalendar();
}

function calendarPrev() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
}

function calendarNext() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}

function clearCalendarSelection() {
  selectedCalDate = null;
  renderCalendar();
  const info = document.getElementById('cal-day-info');
  if (info) info.style.display = 'none';
}

function renderCalendar() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const monthLabel = document.getElementById('cal-month-label');
  if (monthLabel) {
    monthLabel.textContent = `${monthNames[calMonth]} ${calYear}`;
  }

  const carBookings = getCarBookings();
  const statusMap = buildDateStatusMap(carBookings);
  const rateNum = parseInt((carData.rate || '').replace(/[^0-9]/g, '')) || carData.price || 0;
  const rateLabel = `RM ${rateNum}`;

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const grid = document.getElementById('cal-days-grid');
  if (!grid) return;
  let html = '';

  for (let i = 0; i < startOffset; i++) {
    html += '<div class="cal-cell empty"></div>';
  }

  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(calYear, calMonth, d);
    dateObj.setHours(0, 0, 0, 0);

    let status = 'available';
    const isPast = dateObj < today;

    if (isPast) {
      status = 'past';
    } else if (statusMap[dateStr]) {
      status = statusMap[dateStr].status;
    }

    const isToday = dateObj.getTime() === today.getTime();
    const isSelected = selectedCalDate === dateStr;

    const todayClass = isToday ? ' today' : '';
    const selectedClass = isSelected ? ' selected' : '';
    const clickable = status !== 'past';

    html += `
    <div class="cal-cell ${status}${todayClass}${selectedClass}" 
         ${clickable ? `onclick="selectCalDay('${dateStr}', '${status}')"` : ''}
         data-date="${dateStr}"
         title="${dateStr} - ${status.toUpperCase()}">
      <div class="cal-cell-inner">
        <span class="cal-day">${d}</span>
        <span class="cal-dot-indicator ${status}"></span>
      </div>
      <span class="cal-rate">${status !== 'past' ? rateLabel : ''}</span>
    </div>`;
  }

  grid.innerHTML = html;
}

function getCarBookings() {
  if (!carData || !allBookings) return [];
  return allBookings.filter(b => b.car_id === carData.id || b.plate === carData.plate);
}

function buildDateStatusMap(bookings) {
  const map = {};
  bookings.forEach(b => {
    const pickupStr = b.start_date || b.pickup;
    const returnStr = b.end_date || b.return;
    if (!pickupStr || !returnStr) return;
    const pickup = new Date(pickupStr);
    const returnDate = new Date(returnStr);
    const current = new Date(pickup);
    while (current <= returnDate) {
      const dateStr = current.toISOString().slice(0, 10);
      let status;
      if (b.status === 'Confirmed' || b.status === 'Completed' || b.status === 'Active') {
        status = 'booked';
      } else if (b.status === 'Pending') {
        status = 'pending';
      } else {
        status = 'available';
      }
      if (!map[dateStr] || (status === 'booked' && map[dateStr].status === 'pending')) {
        map[dateStr] = { status, booking: b };
      }
      current.setDate(current.getDate() + 1);
    }
  });
  return map;
}

function selectCalDay(dateStr, status) {
  if (status === 'past') return;
  selectedCalDate = dateStr;
  renderCalendar();

  if (status === 'booked' || status === 'pending') {
    showBookingInfo(dateStr, status);
  } else {
    showAvailableDateInfo(dateStr);
  }
}

function showAvailableDateInfo(dateStr) {
  const infoPanel = document.getElementById('cal-day-info');
  if (!infoPanel) return;

  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const rateNum = parseInt(String(carData.rate || '').replace(/[^0-9]/g, '')) || carData.price || 0;

  infoPanel.innerHTML = `
    <div class="bs-header">
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="bs-badge available" style="background:rgba(16,185,129,0.12);color:#10B981;border:1px solid rgba(16,185,129,0.25);">
          <span class="material-icons-round" style="font-size:14px;">check_circle</span>
          Available for Rent
        </span>
        <span style="font-size:13.5px;font-weight:700;color:var(--text-primary);">${formattedDate}</span>
      </div>
      <button class="btn-outline-sm" onclick="clearCalendarSelection()" style="height:30px;padding:0 12px;font-size:12px;">
        <span class="material-icons-round" style="font-size:14px;">close</span> Close
      </button>
    </div>
    <div class="bs-grid">
      <div class="bs-item">
        <div class="bs-item-icon emerald">
          <span class="material-icons-round" style="font-size:20px;">event_available</span>
        </div>
        <div>
          <div class="bs-item-label">Vehicle Status</div>
          <div class="bs-item-value" style="color:#10B981;">Ready to Book</div>
        </div>
      </div>
      <div class="bs-item">
        <div class="bs-item-icon">
          <span class="material-icons-round" style="font-size:20px;">directions_car</span>
        </div>
        <div>
          <div class="bs-item-label">Vehicle</div>
          <div class="bs-item-value">${carData.name || 'Vehicle'} (${carData.plate || '--'})</div>
        </div>
      </div>
      <div class="bs-item">
        <div class="bs-item-icon purple">
          <span class="material-icons-round" style="font-size:20px;">payments</span>
        </div>
        <div>
          <div class="bs-item-label">Standard Daily Rate</div>
          <div class="bs-item-value">RM ${rateNum}/day</div>
        </div>
      </div>
      <div class="bs-item">
        <div class="bs-item-icon amber">
          <span class="material-icons-round" style="font-size:20px;">info</span>
        </div>
        <div>
          <div class="bs-item-label">Schedule Note</div>
          <div class="bs-item-value">No active bookings</div>
        </div>
      </div>
    </div>`;
  infoPanel.style.display = 'block';
}

function showBookingInfo(dateStr, status) {
  const carBookings = getCarBookings();
  const booking = carBookings.find(b => {
    const pickupStr = b.start_date || b.pickup;
    const returnStr = b.end_date || b.return;
    const pickup = new Date(pickupStr);
    const ret = new Date(returnStr);
    const d = new Date(dateStr);
    return d >= pickup && d <= ret;
  });

  if (!booking) return;

  const infoPanel = document.getElementById('cal-day-info');
  if (!infoPanel) return;

  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const isPending = booking.status === 'Pending';
  const statusLabel = isPending ? 'Pending Confirmation' : 'Confirmed Booking';
  const statusBadgeCls = isPending ? 'pending' : 'confirmed';
  const pickupStr = booking.start_date || booking.pickup || '--';
  const returnStr = booking.end_date || booking.return || '--';
  const days = booking.days || booking.total_days || 1;
  const total = booking.total || booking.total_price || 0;

  infoPanel.innerHTML = `
    <div class="bs-header">
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="bs-badge ${statusBadgeCls}">
          <span class="material-icons-round" style="font-size:14px;">${isPending ? 'schedule' : 'verified'}</span>
          ${statusLabel}
        </span>
        <span style="font-size:13.5px;font-weight:700;color:var(--text-primary);">${formattedDate}</span>
      </div>
      <button class="btn-outline-sm" onclick="clearCalendarSelection()" style="height:30px;padding:0 12px;font-size:12px;">
        <span class="material-icons-round" style="font-size:14px;">close</span> Close
      </button>
    </div>
    <div class="bs-grid">
      <div class="bs-item">
        <div class="bs-item-icon">
          <span class="material-icons-round" style="font-size:20px;">badge</span>
        </div>
        <div>
          <div class="bs-item-label">Booking ID</div>
          <div class="bs-item-value">#${booking.id}</div>
        </div>
      </div>
      <div class="bs-item">
        <div class="bs-item-icon purple">
          <span class="material-icons-round" style="font-size:20px;">person</span>
        </div>
        <div>
          <div class="bs-item-label">Customer</div>
          <div class="bs-item-value">${booking.customer || booking.user_name || 'Customer'}</div>
        </div>
      </div>
      <div class="bs-item">
        <div class="bs-item-icon amber">
          <span class="material-icons-round" style="font-size:20px;">date_range</span>
        </div>
        <div>
          <div class="bs-item-label">Period</div>
          <div class="bs-item-value">${pickupStr} &rarr; ${returnStr} (${days}d)</div>
        </div>
      </div>
      <div class="bs-item">
        <div class="bs-item-icon emerald">
          <span class="material-icons-round" style="font-size:20px;">payments</span>
        </div>
        <div>
          <div class="bs-item-label">Payment</div>
          <div class="bs-item-value">${booking.payment || 'Paid'}</div>
        </div>
      </div>
    </div>
    <div class="bs-footer">
      <div class="bs-total-wrap">
        <div class="bs-total-label">Total Amount Paid</div>
        <div class="bs-total-amount">RM ${Number(total).toLocaleString()}</div>
      </div>
      <button class="btn-outline-sm" onclick="window.location.href='../../booking/bookings.html?search=${encodeURIComponent(carData.plate || '')}'" style="height:40px;padding:0 20px;">
        <span class="material-icons-round" style="font-size:16px;">manage_accounts</span> Manage in Bookings
      </button>
    </div>`;
  infoPanel.style.display = 'block';
}

window.clearCalendarSelection = clearCalendarSelection;
window.showBookingInfo = showBookingInfo;
window.showAvailableDateInfo = showAvailableDateInfo;
window.calendarToday = calendarToday;
window.calendarPrev = calendarPrev;
window.calendarNext = calendarNext;
window.selectCalDay = selectCalDay;



