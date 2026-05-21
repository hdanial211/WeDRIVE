/**
 * WeDRIVE - Bookings Module JS
 * admin/js/bookings.js
 */

let allBookings = [];
let allCars = [];
let currentFilter = 'all';
let currentSearch = '';

window.WeDriveAPI.getAdminData()
  .then(data => {
    allCars = data.car || [];
    // Enrich bookings with car name
    allBookings = (data.bookings || []).map(b => {
      var car = allCars.find(c => c.id === b.car_id);
      b._car_name = b.car || (car ? car.name : '--');
      b._car_plate = b.plate || (car ? car.plate : '--');
      b._pickup = b.start_date || b.pickup;
      b._return = b.end_date || b.return;
      b._customer = b.customer || b.customer_name || '--';
      b._days = b.days || (b._pickup && b._return ? Math.ceil((new Date(b._return) - new Date(b._pickup)) / 86400000) : 0);
      b._total = b.total || 0;
      return b;
    });
    populateBookingStats(allBookings);
    applyFilters();
  })
  .catch(err => console.error('Bookings data load error:', err));

function populateBookingStats(bookings) {
  var total = bookings.length;
  var confirmed = bookings.filter(b => b.status === 'Confirmed' || b.status === 'Active').length;
  var pending = bookings.filter(b => b.status === 'Pending').length;
  var revenue = bookings.reduce((sum, b) => sum + (b._total || 0), 0);

  document.getElementById('bk-total').textContent = total;
  document.getElementById('bk-confirmed').textContent = confirmed;
  document.getElementById('bk-pending').textContent = pending;
  document.getElementById('bk-revenue').textContent = 'RM ' + revenue.toLocaleString();
}

function renderBookings(bookings) {
  var tbody = document.getElementById('bookings-tbody');
  if (!tbody) return;
  if (bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#94A3B8;padding:40px">No bookings found</td></tr>';
    return;
  }
  tbody.innerHTML = bookings.map(b => {
    var statusClass = b.status.toLowerCase();
    var paymentClass = b.payment === 'Paid' ? 'available' : 'maintenance';
    return `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b._customer}</td>
      <td>${b._car_name}<br><small style="color:#94A3B8">${b._car_plate}</small></td>
      <td>${formatDate(b._pickup)}</td>
      <td>${formatDate(b._return)}</td>
      <td><strong>RM ${b._total.toLocaleString()}</strong></td>
      <td><span class="status-badge ${paymentClass}"><span class="dot"></span> ${b.payment}</span></td>
      <td><span class="status-badge ${statusClass}"><span class="dot"></span> ${b.status}</span></td>
      <td>
        <button class="btn-primary-sm" onclick="viewBooking(${b.id})" style="font-size:12px;padding:6px 10px">
          <span class="material-icons-round" style="font-size:14px">visibility</span>
        </button>
      </td>
    </tr>`;
  }).join('');
}

function filterBookings(status, btn) {
  currentFilter = status;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  applyFilters();
}

function searchBookings(query) {
  currentSearch = query.toLowerCase();
  applyFilters();
}

function applyFilters() {
  var filtered = allBookings;
  if (currentFilter !== 'all') {
    filtered = filtered.filter(b => b.status === currentFilter);
  }
  if (currentSearch) {
    filtered = filtered.filter(b =>
      String(b.id).includes(currentSearch) ||
      b._customer.toLowerCase().includes(currentSearch) ||
      b._car_name.toLowerCase().includes(currentSearch)
    );
  }
  renderBookings(filtered);
}

function viewBooking(id) {
  var b = allBookings.find(x => x.id === id);
  if (!b) return;
  alert(
    `Booking #${b.id}\n` +
    `Customer: ${b._customer}\n` +
    `Car: ${b._car_name} (${b._car_plate})\n` +
    `Pick-up: ${b._pickup}\n` +
    `Return: ${b._return}\n` +
    `Days: ${b._days}\n` +
    `Total: RM ${b._total.toLocaleString()}\n` +
    `Payment: ${b.payment}\n` +
    `Status: ${b.status}`
  );
}

/* -- Status Update Modal -- */
function openStatusModal(id) {
  var b = allBookings.find(x => x.id === id);
  if (!b) return;

  var modal = document.getElementById('status-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'status-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  var statusOptions = ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled'];
  var optionsHtml = statusOptions.map(s => {
    var selected = s === b.status ? 'selected' : '';
    return `<option value="${s}" ${selected}>${s}</option>`;
  }).join('');

  modal.innerHTML = `
  <div class="modal-container" style="max-width:420px;width:90%;">
    <div class="modal-header">
      <h3><span class="material-icons-round" style="font-size:20px;vertical-align:middle;margin-right:6px;">sync</span> Update Status</h3>
      <button class="modal-close-btn" onclick="closeStatusModal()"><span class="material-icons-round">close</span></button>
    </div>
    <div class="modal-body" style="padding:24px;">
      <p style="font-size:13px;color:var(--slate-400);margin:0 0 16px;">Booking #${b.id} - ${b._customer}</p>
      <div class="form-group" style="margin-bottom:16px;">
        <label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary);letter-spacing:0.5px;">New Status</label>
        <select id="status-select" style="width:100%;padding:10px 14px;border:1.5px solid var(--slate-200);border-radius:10px;font-size:14px;font-weight:600;background:var(--card-bg);color:var(--navy);">
          ${optionsHtml}
        </select>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn-outline-sm" onclick="closeStatusModal()">Cancel</button>
        <button class="btn-primary-sm" style="padding:10px 20px;" onclick="confirmStatusUpdate(${b.id})">
          <span class="material-icons-round" style="font-size:14px">check</span> Update
        </button>
      </div>
    </div>
  </div>`;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeStatusModal() {
  var modal = document.getElementById('status-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

async function confirmStatusUpdate(id) {
  var newStatus = document.getElementById('status-select').value;
  var b = allBookings.find(x => x.id === id);
  if (!b) return;

  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var result = await window.supabaseClient.from('bookings').update({ status: newStatus }).eq('id', id);
      if (result.error) throw result.error;
      b.status = newStatus;
      populateBookingStats(allBookings);
      applyFilters();
      closeStatusModal();
      showToast('Booking #' + id + ' updated to ' + newStatus, 'success');
    } catch (err) {
      console.error('[WeDRIVE] Update booking status error:', err);
      showToast('Error updating status', 'info');
    }
  } else {
    b.status = newStatus;
    populateBookingStats(allBookings);
    applyFilters();
    closeStatusModal();
    showToast('Status updated (demo)', 'success');
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '--';
  var d = new Date(dateStr);
  return d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });
}

function showToast(msg, type) {
  var existing = document.querySelector('.toast-notify');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'toast-notify';
  var icon = type === 'success' ? 'check_circle' : 'info';
  var bg = type === 'success' ? '#059669' : '#3B82F6';
  toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:' + bg + ';color:#fff;padding:14px 24px;border-radius:12px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,0.2);animation:slideUp 0.3s ease';
  toast.innerHTML = '<span class="material-icons-round" style="font-size:18px">' + icon + '</span> ' + msg;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}
