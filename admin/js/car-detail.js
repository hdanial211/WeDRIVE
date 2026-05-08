/**
 * WeDRIVE - Car Detail / Manage Module JS
 * admin/js/car-detail.js
 * Focus: Rental only (seats, transmission, fuel — no mileage/service)
 */

let carData = null;
let allBookings = [];
const IMG_BASE = '../../shared/images/cars/';
const MAX_IMAGES = 10;
let currentMainIndex = 0;
let calYear, calMonth; // Calendar state

// Get car ID from URL params
const urlParams = new URLSearchParams(window.location.search);
const carId = parseInt(urlParams.get('id'));

if (!carId) {
  window.location.href = 'cars.html';
}

window.WeDriveAPI.getAdminData()
  .then(data => {
    const fleet = data.fleet || [];
    allBookings = data.bookings || [];
    carData = fleet.find(c => c.id === carId);

    if (!carData) {
      window.location.href = 'cars.html';
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
  document.getElementById('cd-plate-type').textContent = `${car.plate} · ${car.type}`;

  // Status badge
  const statusEl = document.getElementById('cd-status');
  const statusMap = {
    'Available': { cls: 'available', icon: 'check_circle' },
    'Rented':    { cls: 'rented',    icon: 'car_rental'   }
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
}

/* ── Render Car Images (Main + Thumbnails) ── */
function renderCarImages(car) {
  const mainImg = document.getElementById('cd-main-img');
  const fallback = document.getElementById('cd-img-fallback');
  const thumbContainer = document.getElementById('cd-thumbnails');

  if (car.images && car.images.length > 0) {
    const firstSrc = car.images[0].startsWith('data:') ? car.images[0] : IMG_BASE + car.images[0];
    mainImg.src = firstSrc;
    mainImg.alt = car.name;
    mainImg.style.display = 'block';
    fallback.style.display = 'none';

    mainImg.onerror = function() {
      mainImg.style.display = 'none';
      fallback.style.display = 'flex';
    };

    // Thumbnails
    if (car.images.length > 1) {
      thumbContainer.innerHTML = car.images.map((img, idx) => {
        const src = img.startsWith('data:') ? img : IMG_BASE + img;
        return `
        <div class="car-thumb ${idx === 0 ? 'active' : ''}" onclick="switchImage(${idx})">
          <img src="${src}" alt="${car.name} ${idx+1}" onerror="this.parentElement.style.display='none';" />
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
  const src = carData.images[idx].startsWith('data:') ? carData.images[idx] : IMG_BASE + carData.images[idx];
  mainImg.src = src;
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
  const carBookings = bookings.filter(b => b.plate === car.plate);

  if (carBookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#94A3B8;padding:40px;">No booking history for this vehicle</td></tr>';
    return;
  }

  tbody.innerHTML = carBookings.map(b => {
    const statusCls = b.status.toLowerCase();
    return `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.customer}</td>
      <td>${b.pickup}</td>
      <td>${b.return}</td>
      <td>${b.days}</td>
      <td><strong>RM ${b.total.toLocaleString()}</strong></td>
      <td><span class="status-badge ${statusCls}"><span class="dot"></span> ${b.status}</span></td>
    </tr>`;
  }).join('');
}

/* ── Edit Details ── */
function editDetails() {
  const section = document.getElementById('edit-section');
  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Populate form with current data
  document.getElementById('edit-name').value = carData.name;
  document.getElementById('edit-plate').value = carData.plate;
  document.getElementById('edit-type').value = carData.type;
  document.getElementById('edit-fuel').value = carData.fuel;
  document.getElementById('edit-trans').value = carData.transmission;
  document.getElementById('edit-rate').value = parseInt(carData.rate.replace(/[^0-9]/g, ''));
  document.getElementById('edit-seats').value = carData.seats || 5;

  // Populate images grid
  renderEditImagesGrid();
}

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
    const src = img.startsWith('data:') ? img : IMG_BASE + img;
    return `
    <div class="edit-img-item">
      <img src="${src}" alt="Photo ${idx+1}" />
      <button type="button" class="edit-img-remove" onclick="removeImage(${idx})" title="Remove photo">
        <span class="material-icons-round" style="font-size:16px;">close</span>
      </button>
      ${idx === 0 ? '<span class="edit-img-main-badge">Main</span>' : `<button type="button" class="edit-img-set-main" onclick="setMainImage(${idx})" title="Set as main photo"><span class="material-icons-round" style="font-size:12px;">star</span></button>`}
    </div>`;
  }).join('');
}

/* ── Handle Image Upload ── */
function handleImageUpload(event) {
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

  let processed = 0;
  for (let i = 0; i < toProcess; i++) {
    const file = files[i];
    if (!file.type.startsWith('image/')) continue;

    const reader = new FileReader();
    reader.onload = function(e) {
      if (!carData.images) carData.images = [];
      carData.images.push(e.target.result);
      processed++;
      if (processed >= toProcess) {
        renderEditImagesGrid();
        renderCarImages(carData);
        showToast(`${processed} photo(s) added!`, 'success');
      }
    };
    reader.readAsDataURL(file);
  }

  event.target.value = '';
}

/* ── Remove Image ── */
function removeImage(idx) {
  if (!carData.images || idx >= carData.images.length) return;
  if (confirm('Remove this photo?')) {
    carData.images.splice(idx, 1);
    if (currentMainIndex >= carData.images.length) currentMainIndex = 0;
    renderEditImagesGrid();
    renderCarImages(carData);
    showToast('Photo removed.', 'success');
  }
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
  document.getElementById('edit-section').style.display = 'none';
}

function saveCarEdit(e) {
  e.preventDefault();

  // Update local data
  carData.name = document.getElementById('edit-name').value;
  carData.plate = document.getElementById('edit-plate').value;
  carData.type = document.getElementById('edit-type').value;
  carData.fuel = document.getElementById('edit-fuel').value;
  carData.transmission = document.getElementById('edit-trans').value;
  carData.rate = 'RM ' + document.getElementById('edit-rate').value + '/day';
  carData.seats = parseInt(document.getElementById('edit-seats').value);

  // Re-render
  renderCarDetails(carData);
  renderCarImages(carData);
  cancelEdit();

  showToast('Vehicle details updated successfully!', 'success');
}

/* ── Update Status ── */
function updateStatus() {
  const statuses = ['Available', 'Rented'];
  const currentIdx = statuses.indexOf(carData.status);
  const nextStatus = statuses[(currentIdx + 1) % statuses.length];

  if (confirm(`Change status from "${carData.status}" to "${nextStatus}"?`)) {
    carData.status = nextStatus;
    renderCarDetails(carData);
    showToast(`Status updated to ${nextStatus}`, 'success');
  }
}

/* ── Quick Actions ── */
function viewInsurance() {
  alert(`Insurance Info for ${carData.name}\n\nPlate: ${carData.plate}\nType: ${carData.type}\n\nInsurance details will be available when backend is integrated.`);
}

function deleteCar() {
  if (confirm(`Are you sure you want to remove ${carData.name} (${carData.plate}) from the fleet?\n\nThis action cannot be undone.`)) {
    showToast('Vehicle removed from fleet (demo mode)', 'success');
    setTimeout(() => { window.location.href = 'cars.html'; }, 1500);
  }
}

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
   BOOKING CALENDAR
   ══════════════════════════════════════════════ */

function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth(); // 0-indexed
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

function renderCalendar() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];

  // Update header
  document.getElementById('cal-month-label').textContent = `${monthNames[calMonth]} ${calYear}`;

  // Get bookings for this car
  const carBookings = getCarBookings();

  // Build date status map
  const statusMap = buildDateStatusMap(carBookings);

  // Get daily rate from carData
  const rate = carData.rate || 'RM 0/day';

  // Calculate grid
  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
  const totalDays = lastDay.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const grid = document.getElementById('cal-days-grid');
  let html = '';

  // Empty cells before first day
  for (let i = 0; i < startOffset; i++) {
    html += '<div class="cal-cell empty"></div>';
  }

  // Day cells
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dateObj = new Date(calYear, calMonth, d);
    dateObj.setHours(0, 0, 0, 0);

    let status = 'available';
    let bookingInfo = null;
    const isPast = dateObj < today;

    if (isPast) {
      status = 'past';
    } else if (statusMap[dateStr]) {
      status = statusMap[dateStr].status;
      bookingInfo = statusMap[dateStr].booking;
    }

    const isToday = dateObj.getTime() === today.getTime();
    const todayClass = isToday ? ' today' : '';

    html += `
    <div class="cal-cell ${status}${todayClass}" onclick="selectCalDay('${dateStr}', '${status}')" data-date="${dateStr}">
      <span class="cal-badge"></span>
      <span class="cal-day">${d}</span>
      <span class="cal-rate">${status !== 'past' ? rate.replace('/day', '') : ''}</span>
    </div>`;
  }

  grid.innerHTML = html;

  // Hide info panel
  document.getElementById('cal-day-info').style.display = 'none';
}

function getCarBookings() {
  if (!carData || !allBookings) return [];
  return allBookings.filter(b => b.plate === carData.plate);
}

function buildDateStatusMap(bookings) {
  const map = {};

  bookings.forEach(b => {
    const pickup = new Date(b.pickup);
    const returnDate = new Date(b.return);

    // For each day in the booking range
    const current = new Date(pickup);
    while (current <= returnDate) {
      const dateStr = current.toISOString().slice(0, 10);

      let status;
      if (b.status === 'Confirmed' || b.status === 'Completed') {
        status = 'booked';
      } else if (b.status === 'Pending') {
        status = 'pending';
      } else {
        status = 'available';
      }

      // Booked takes priority over pending
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

  // Highlight selected cell
  document.querySelectorAll('.cal-cell').forEach(c => c.classList.remove('selected'));
  const cell = document.querySelector(`.cal-cell[data-date="${dateStr}"]`);
  if (cell) cell.classList.add('selected');

  const infoPanel = document.getElementById('cal-day-info');
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  if (status === 'available') {
    infoPanel.innerHTML = `
      <div class="info-title">${formattedDate}</div>
      <div class="info-detail">
        <strong>Status:</strong> Available for booking<br>
        <strong>Rate:</strong> ${carData.rate}
      </div>`;
  } else {
    // Find booking for this date
    const carBookings = getCarBookings();
    const booking = carBookings.find(b => {
      const pickup = new Date(b.pickup);
      const ret = new Date(b.return);
      const d = new Date(dateStr);
      return d >= pickup && d <= ret;
    });

    if (booking) {
      const statusLabel = booking.status === 'Pending' ? 'Pending Confirmation' : 'Confirmed Booking';
      infoPanel.innerHTML = `
        <div class="info-title">${formattedDate}</div>
        <div class="info-detail">
          <strong>Status:</strong> ${statusLabel}<br>
          <strong>Booking ID:</strong> ${booking.id}<br>
          <strong>Customer:</strong> ${booking.customer}<br>
          <strong>Period:</strong> ${booking.pickup} to ${booking.return} (${booking.days} days)<br>
          <strong>Total:</strong> RM ${booking.total.toLocaleString()}<br>
          <strong>Payment:</strong> ${booking.payment}
        </div>`;
    }
  }

  infoPanel.style.display = 'block';
}
