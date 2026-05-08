/**
 * WeDRIVE - Car Detail / Manage Module JS
 * admin/js/car-detail.js
 */

let carData = null;
let allBookings = [];

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

    renderCarDetails(carData);
    renderBookingHistory(carData, allBookings);
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
    'Available':   { cls: 'available',   icon: 'check_circle' },
    'Rented':      { cls: 'rented',      icon: 'car_rental'   },
    'Maintenance': { cls: 'maintenance', icon: 'build'        }
  };
  const sm = statusMap[car.status] || statusMap['Available'];
  statusEl.className = `status-badge ${sm.cls}`;
  statusEl.innerHTML = `<span class="dot"></span> ${car.status}`;

  // Quick stats
  document.getElementById('cd-fuel').textContent = car.fuel;
  document.getElementById('cd-trans').textContent = car.transmission;
  document.getElementById('cd-mileage').textContent = car.mileage.toLocaleString() + ' km';
  document.getElementById('cd-service').textContent = car.last_service;

  // Rate
  document.getElementById('cd-rate').textContent = car.rate;
}

/* ── Booking History ── */
function renderBookingHistory(car, bookings) {
  const tbody = document.getElementById('cd-bookings-tbody');
  // Filter bookings for this car
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
  document.getElementById('edit-mileage').value = carData.mileage;
  document.getElementById('edit-service').value = carData.last_service;
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
  carData.mileage = parseInt(document.getElementById('edit-mileage').value);
  carData.last_service = document.getElementById('edit-service').value;

  // Re-render
  renderCarDetails(carData);
  cancelEdit();

  // Toast notification
  showToast('Vehicle details updated successfully!', 'success');
}

/* ── Update Status ── */
function updateStatus() {
  const statuses = ['Available', 'Rented', 'Maintenance'];
  const currentIdx = statuses.indexOf(carData.status);
  const nextStatus = statuses[(currentIdx + 1) % statuses.length];

  if (confirm(`Change status from "${carData.status}" to "${nextStatus}"?`)) {
    carData.status = nextStatus;
    renderCarDetails(carData);
    showToast(`Status updated to ${nextStatus}`, 'success');
  }
}

/* ── Quick Actions ── */
function scheduleService() {
  alert(`Schedule Service for ${carData.name}\n\nCurrent mileage: ${carData.mileage.toLocaleString()} km\nLast service: ${carData.last_service}\n\nThis feature will be available when backend is ready.`);
}

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
