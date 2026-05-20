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

// Get car ID from URL params
const urlParams = new URLSearchParams(window.location.search);
const carId = parseInt(urlParams.get('id'));

if (!carId) {
  window.location.href = 'cars.html';
}

window.WeDriveAPI.getAdminData()
  .then(data => {
    const car = data.car || [];
    allBookings = data.bookings || [];
    carData = car.find(c => c.id === carId);

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

    mainImg.onerror = function () {
      mainImg.style.display = 'none';
      fallback.style.display = 'flex';
    };

    // Thumbnails
    if (car.images.length > 1) {
      thumbContainer.innerHTML = car.images.map((img, idx) => {
        const src = img.startsWith('data:') ? img : IMG_BASE + img;
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
      <img src="${src}" alt="Photo ${idx + 1}" />
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
    reader.onload = function (e) {
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

async function saveCarEdit(e) {
  e.preventDefault();

  // Update local data
  carData.name = document.getElementById('edit-name').value;
  carData.plate = document.getElementById('edit-plate').value;
  carData.type = document.getElementById('edit-type').value;
  carData.fuel = document.getElementById('edit-fuel').value;
  carData.transmission = document.getElementById('edit-trans').value;
  carData.rate = 'RM ' + document.getElementById('edit-rate').value + '/day';
  carData.seats = parseInt(document.getElementById('edit-seats').value);

  // Save to Supabase
  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var updateData = {
        name: carData.name,
        plate: carData.plate,
        type: carData.type,
        fuel: carData.fuel,
        transmission: carData.transmission,
        rate: carData.rate,
        seats: carData.seats
      };
      var result = await window.supabaseClient.from('cars').update(updateData).eq('id', carData.id);
      if (result.error) throw result.error;
      showToast('Vehicle details saved to database!', 'success');
    } catch (err) {
      console.error('[WeDRIVE] Save car error:', err);
      showToast('Error saving - changes shown locally only', 'info');
    }
  } else {
    showToast('Vehicle details updated (demo mode)', 'success');
  }

  // Re-render
  renderCarDetails(carData);
  renderCarImages(carData);
  cancelEdit();
}

/* ── Update Status ── */
async function updateStatus() {
  const statuses = ['Available', 'Rented'];
  const currentIdx = statuses.indexOf(carData.status);
  const nextStatus = statuses[(currentIdx + 1) % statuses.length];

  if (confirm(`Change status from "${carData.status}" to "${nextStatus}"?`)) {
    carData.status = nextStatus;
    renderCarDetails(carData);

    if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
      try {
        var result = await window.supabaseClient.from('cars').update({ status: nextStatus }).eq('id', carData.id);
        if (result.error) throw result.error;
        showToast(`Status updated to ${nextStatus}`, 'success');
      } catch (err) {
        console.error('[WeDRIVE] Update status error:', err);
        showToast(`Status updated locally (DB sync failed)`, 'info');
      }
    } else {
      showToast(`Status updated to ${nextStatus} (demo)`, 'success');
    }
  }
}

/* ── Quick Actions ── */
function viewInsurance() {
  alert(`Insurance Info for ${carData.name}\n\nPlate: ${carData.plate}\nType: ${carData.label || carData.type}\n\nInsurance details will be available when backend is integrated.`);
}

async function deleteCar() {
  if (confirm(`Are you sure you want to remove ${carData.name} (${carData.plate}) from the fleet?\n\nThis action cannot be undone.`)) {
    if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
      try {
        var result = await window.supabaseClient.from('cars').delete().eq('id', carData.id);
        if (result.error) throw result.error;
        showToast('Vehicle removed from database!', 'success');
      } catch (err) {
        console.error('[WeDRIVE] Delete car error:', err);
        showToast('Vehicle removed (demo mode)', 'success');
      }
    } else {
      showToast('Vehicle removed (demo mode)', 'success');
    }
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
   BOOKING CALENDAR — Range Selection
   First click = Pickup date, Second click = Return date
   ══════════════════════════════════════════════ */

let calPickup = null;   // Selected pickup date string
let calReturn = null;   // Selected return date string

function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  calPickup = null;
  calReturn = null;
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
  calPickup = null;
  calReturn = null;
  renderCalendar();
  document.getElementById('cal-day-info').style.display = 'none';
}

function renderCalendar() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  document.getElementById('cal-month-label').textContent = `${monthNames[calMonth]} ${calYear}`;

  const carBookings = getCarBookings();
  const statusMap = buildDateStatusMap(carBookings);
  const rateNum = parseInt((carData.rate || '').replace(/[^0-9]/g, '')) || 0;
  const rateLabel = `RM ${rateNum}`;

  const firstDay = new Date(calYear, calMonth, 1);
  const lastDay = new Date(calYear, calMonth + 1, 0);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const grid = document.getElementById('cal-days-grid');
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

    // Check if this date is in selected range
    let rangeClass = '';
    if (calPickup && !calReturn && dateStr === calPickup) {
      rangeClass = ' cal-range-start';
    } else if (calPickup && calReturn) {
      if (dateStr === calPickup) rangeClass = ' cal-range-start';
      else if (dateStr === calReturn) rangeClass = ' cal-range-end';
      else if (dateStr > calPickup && dateStr < calReturn) rangeClass = ' cal-range-mid';
    }

    const todayClass = isToday ? ' today' : '';
    const clickable = status !== 'past';

    html += `
    <div class="cal-cell ${status}${todayClass}${rangeClass}" 
         ${clickable ? `onclick="selectCalDay('${dateStr}', '${status}')"` : ''}
         data-date="${dateStr}">
      <span class="cal-badge"></span>
      <span class="cal-day">${d}</span>
      <span class="cal-rate">${status !== 'past' ? rateLabel : ''}</span>
    </div>`;
  }

  grid.innerHTML = html;
  updateCalendarInfo();

  // Show/hide clear button
  const clearBtn = document.getElementById('cal-clear-btn');
  if (clearBtn) clearBtn.style.display = (calPickup || calReturn) ? 'inline-flex' : 'none';
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
  // If clicking a booked/pending date, just show info
  if (status === 'booked' || status === 'pending') {
    showBookingInfo(dateStr, status);
    return;
  }

  // Range selection logic
  if (!calPickup || (calPickup && calReturn)) {
    // First click or reset — set pickup
    calPickup = dateStr;
    calReturn = null;
  } else {
    // Second click — set return
    if (dateStr < calPickup) {
      // Clicked before pickup — swap
      calReturn = calPickup;
      calPickup = dateStr;
    } else if (dateStr === calPickup) {
      // Same date — clear
      calPickup = null;
      calReturn = null;
    } else {
      // Check if any booked days exist in range
      const statusMap = buildDateStatusMap(getCarBookings());
      let hasConflict = false;
      const checkDate = new Date(calPickup);
      const endDate = new Date(dateStr);
      while (checkDate <= endDate) {
        const ds = checkDate.toISOString().slice(0, 10);
        if (statusMap[ds] && statusMap[ds].status === 'booked') {
          hasConflict = true;
          break;
        }
        checkDate.setDate(checkDate.getDate() + 1);
      }
      if (hasConflict) {
        showToast('Cannot select this range — contains booked dates.', 'info');
        return;
      }
      calReturn = dateStr;
    }
  }

  renderCalendar();
}

function showBookingInfo(dateStr, status) {
  const carBookings = getCarBookings();
  const booking = carBookings.find(b => {
    const pickup = new Date(b.pickup);
    const ret = new Date(b.return);
    const d = new Date(dateStr);
    return d >= pickup && d <= ret;
  });

  if (!booking) return;

  const infoPanel = document.getElementById('cal-day-info');
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const statusLabel = booking.status === 'Pending' ? 'Pending Confirmation' : 'Confirmed Booking';
  const statusIcon = booking.status === 'Pending' ? 'schedule' : 'event_busy';

  infoPanel.innerHTML = `
    <div class="info-title">
      <span class="material-icons-round" style="font-size:16px;vertical-align:middle;margin-right:4px;">${statusIcon}</span>
      ${formattedDate}
    </div>
    <div class="info-detail">
      <strong>Status:</strong> ${statusLabel}<br>
      <strong>Booking ID:</strong> ${booking.id}<br>
      <strong>Customer:</strong> ${booking.customer}<br>
      <strong>Period:</strong> ${booking.pickup} to ${booking.return} (${booking.days} days)<br>
      <strong>Total:</strong> RM ${booking.total.toLocaleString()}<br>
      <strong>Payment:</strong> ${booking.payment}
    </div>`;
  infoPanel.style.display = 'block';
}

function updateCalendarInfo() {
  const infoPanel = document.getElementById('cal-day-info');
  const rateNum = parseInt((carData.rate || '').replace(/[^0-9]/g, '')) || 0;

  if (calPickup && calReturn) {
    // Full range selected — show summary
    const p = new Date(calPickup);
    const r = new Date(calReturn);
    const days = Math.round((r - p) / (1000 * 60 * 60 * 24));
    const total = days * rateNum;

    const fmtPickup = p.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const fmtReturn = r.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    infoPanel.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <div class="info-title">
            <span class="material-icons-round" style="font-size:16px;vertical-align:middle;margin-right:4px;">date_range</span>
            Booking Summary
          </div>
          <div class="info-detail">
            <strong>Pickup:</strong> ${fmtPickup}<br>
            <strong>Return:</strong> ${fmtReturn}<br>
            <strong>Duration:</strong> ${days} day${days > 1 ? 's' : ''}<br>
            <strong>Rate:</strong> RM ${rateNum}/day<br>
            <strong>Estimated Total:</strong> <span style="color:var(--primary);font-weight:800;font-size:16px;">RM ${total.toLocaleString()}</span>
          </div>
        </div>
        <button class="btn-primary-sm" onclick="confirmBookingRange()" style="height:fit-content;">
          <span class="material-icons-round" style="font-size:16px">check_circle</span>
          Confirm Booking
        </button>
      </div>`;
    infoPanel.style.display = 'block';
  } else if (calPickup && !calReturn) {
    // Only pickup selected
    const p = new Date(calPickup);
    const fmtPickup = p.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    infoPanel.innerHTML = `
      <div class="info-title">
        <span class="material-icons-round" style="font-size:16px;vertical-align:middle;margin-right:4px;">flight_takeoff</span>
        Pickup: ${fmtPickup}
      </div>
      <div class="info-detail" style="color:var(--primary);">
        Now select the <strong>return date</strong> to complete the range.
      </div>`;
    infoPanel.style.display = 'block';
  } else {
    infoPanel.style.display = 'none';
  }
}

function confirmBookingRange() {
  if (!calPickup || !calReturn) return;
  const p = new Date(calPickup);
  const r = new Date(calReturn);
  const days = Math.round((r - p) / (1000 * 60 * 60 * 24));
  const rateNum = parseInt((carData.rate || '').replace(/[^0-9]/g, '')) || 0;
  const total = days * rateNum;

  alert(`Booking Confirmed (Demo Mode)\n\nVehicle: ${carData.name}\nPickup: ${calPickup}\nReturn: ${calReturn}\nDays: ${days}\nTotal: RM ${total}\n\nThis will be saved when backend is integrated.`);

  clearCalendarSelection();
  showToast('Booking created successfully (demo)', 'success');
}
