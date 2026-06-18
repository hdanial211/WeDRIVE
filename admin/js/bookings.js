/**
 * WeDRIVE - Bookings Module JS
 * admin/js/bookings.js
 */

let allBookings = [];
let allCars = [];
let currentFilter = 'all';
let currentSearch = '';
let currentSortCol = 'id';
let currentSortDir = 'desc';
let currentDateFilter = 'all';
let customDateFrom = null;
let customDateTo = null;


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
    if (new URLSearchParams(window.location.search).get('action') === 'add') {
      openNewBookingModal();
    }
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

  // Status filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(b => b.status === currentFilter);
  }

  // Date range filter
  if (currentDateFilter === 'month') {
    var now = new Date();
    filtered = filtered.filter(b => {
      var d = new Date(b._pickup);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
  } else if (currentDateFilter === 'year') {
    var yr = new Date().getFullYear();
    filtered = filtered.filter(b => new Date(b._pickup).getFullYear() === yr);
  } else if (currentDateFilter === 'custom' && customDateFrom && customDateTo) {
    var from = new Date(customDateFrom);
    var to = new Date(customDateTo);
    filtered = filtered.filter(b => {
      var d = new Date(b._pickup);
      return d >= from && d <= to;
    });
  }

  // Search filter
  if (currentSearch) {
    filtered = filtered.filter(b =>
      String(b.id).includes(currentSearch) ||
      b._customer.toLowerCase().includes(currentSearch) ||
      b._car_name.toLowerCase().includes(currentSearch)
    );
  }

  // Sort
  filtered = filtered.slice().sort((a, b) => {
    var va, vb;
    if (currentSortCol === 'id') { va = a.id; vb = b.id; }
    else if (currentSortCol === 'customer') { va = a._customer.toLowerCase(); vb = b._customer.toLowerCase(); }
    else if (currentSortCol === 'car') { va = a._car_name.toLowerCase(); vb = b._car_name.toLowerCase(); }
    else if (currentSortCol === 'pickup') { va = new Date(a._pickup); vb = new Date(b._pickup); }
    else if (currentSortCol === 'return') { va = new Date(a._return); vb = new Date(b._return); }
    else if (currentSortCol === 'total') { va = a._total; vb = b._total; }
    else { va = a.id; vb = b.id; }
    if (va < vb) return currentSortDir === 'asc' ? -1 : 1;
    if (va > vb) return currentSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Update stats with filtered data (NOTA 14)
  populateBookingStats(filtered);
  renderBookings(filtered);
  updateSortHeaders();
}

function sortBy(col) {
  if (currentSortCol === col) {
    currentSortDir = currentSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    currentSortCol = col;
    currentSortDir = 'asc';
  }
  applyFilters();
}

function updateSortHeaders() {
  var cols = ['id', 'customer', 'car', 'pickup', 'return', 'total'];
  cols.forEach(function(col) {
    var el = document.getElementById('bk-th-' + col);
    if (!el) return;
    el.classList.remove('sort-asc', 'sort-desc');
    if (currentSortCol === col) {
      el.classList.add(currentSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

function filterByDate(period, btn) {
  currentDateFilter = period;
  document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('active'));
  if (btn) btn.classList.add('active');
  applyFilters();
}

function applyCustomDate() {
  var from = document.getElementById('bk-date-from');
  var to = document.getElementById('bk-date-to');
  if (!from || !to || !from.value || !to.value) return;
  customDateFrom = from.value;
  customDateTo = to.value;
  currentDateFilter = 'custom';
  applyFilters();
}


function viewBooking(id) {
  var b = allBookings.find(x => x.id === id);
  if (!b) return;

  var statusColors = {
    Active: { bg: '#059669', text: '#fff' },
    Confirmed: { bg: '#2563EB', text: '#fff' },
    Pending: { bg: '#D97706', text: '#fff' },
    Completed: { bg: '#6366F1', text: '#fff' },
    Cancelled: { bg: '#DC2626', text: '#fff' }
  };
  var sc = statusColors[b.status] || { bg: '#64748B', text: '#fff' };
  var payColor = b.payment === 'Paid' ? '#059669' : '#D97706';

  var modal = document.getElementById('booking-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'booking-detail-modal';
    modal.className = 'modal-overlay';
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeBookingDetailModal();
    });
    document.body.appendChild(modal);
  }

  var initials = (b._customer || '--').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  modal.innerHTML = `
  <div class="modal-container" style="max-width:520px;width:94%;max-height:90vh;overflow-y:auto;">
    <div class="modal-header" style="border-bottom:1px solid var(--slate-100,#F1F5F9);padding-bottom:14px;">
      <h3 style="display:flex;align-items:center;gap:8px;">
        <span class="material-icons-round" style="font-size:20px;color:var(--primary,#3B82F6)">receipt_long</span>
        Booking Receipt
      </h3>
      <button class="modal-close-btn" onclick="closeBookingDetailModal()"><span class="material-icons-round">close</span></button>
    </div>
    <div style="padding:24px;">

      <!-- Status + ID header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">
        <div>
          <div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--slate-400,#94A3B8);letter-spacing:0.5px;margin-bottom:2px">Booking ID</div>
          <div style="font-size:22px;font-weight:800;color:var(--navy,#1E293B)">#${b.id}</div>
        </div>
        <div style="text-align:right;display:flex;flex-direction:column;gap:6px;">
          <span style="background:${sc.bg};color:${sc.text};padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700">${b.status}</span>
          <span style="background:${payColor};color:#fff;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:600">${b.payment}</span>
        </div>
      </div>

      <!-- Customer -->
      <div style="display:flex;align-items:center;gap:14px;padding:14px;background:var(--bg-surface-2,#F1F5F9);border-radius:12px;margin-bottom:16px;">
        <div style="width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#1D4ED8);display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;flex-shrink:0">${initials}</div>
        <div>
          <div style="font-size:14px;font-weight:700;color:var(--navy,#1E293B)">${b._customer}</div>
          <div style="font-size:12px;color:var(--slate-400,#94A3B8)">Customer</div>
        </div>
      </div>

      <!-- Car info -->
      <div style="padding:14px;background:var(--bg-surface-2,#F1F5F9);border-radius:12px;margin-bottom:16px;">
        <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:8px">Vehicle</div>
        <div style="font-size:15px;font-weight:700;color:var(--navy,#1E293B)">${b._car_name}</div>
        <div style="font-size:12px;color:var(--slate-400,#94A3B8);margin-top:2px">${b._car_plate}</div>
      </div>

      <!-- Dates -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        <div style="padding:12px;background:var(--bg-surface-2,#F1F5F9);border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Pick-up</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${formatDate(b._pickup)}</div>
        </div>
        <div style="padding:12px;background:var(--bg-surface-2,#F1F5F9);border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Return</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${formatDate(b._return)}</div>
        </div>
        <div style="padding:12px;background:var(--bg-surface-2,#F1F5F9);border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Duration</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${b._days} day${b._days !== 1 ? 's' : ''}</div>
        </div>
        <div style="padding:12px;background:var(--bg-surface-2,#F1F5F9);border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Total</div>
          <div style="font-size:15px;font-weight:800;color:var(--navy,#1E293B)">RM ${(b._total || 0).toLocaleString()}</div>
        </div>
      </div>

      <!-- Actions -->
      <div style="display:flex;gap:10px;padding-top:4px;">
        <button class="btn-outline-sm" onclick="closeBookingDetailModal()" style="flex:1;padding:10px;justify-content:center;">
          <span class="material-icons-round" style="font-size:14px">close</span> Close
        </button>
        <button class="btn-primary-sm" onclick="closeBookingDetailModal();openStatusModal(${b.id})" style="flex:1;padding:10px;justify-content:center;">
          <span class="material-icons-round" style="font-size:14px">sync</span> Update Status
        </button>
      </div>
    </div>
  </div>`;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeBookingDetailModal() {
  var modal = document.getElementById('booking-detail-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
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

/* -- New Booking Modal (NOTA 13) -- */
function openNewBookingModal() {
  var modal = document.getElementById('new-booking-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'new-booking-modal';
    modal.className = 'modal-overlay';
    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeNewBookingModal();
    });
    document.body.appendChild(modal);
  }

  var carOptions = '<option value="">-- Select Vehicle --</option>';
  allCars.forEach(function(c) {
    carOptions += '<option value="' + c.id + '" data-price="' + (c.price || c.price_per_day || 0) + '" data-plate="' + (c.plate || '') + '">' + c.name + '</option>';
  });

  var today = new Date().toISOString().slice(0, 10);
  var tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  modal.innerHTML = '<div class="modal-container" style="max-width:540px;width:94%;max-height:90vh;overflow-y:auto;">'
    + '<div class="modal-header" style="border-bottom:1px solid var(--slate-100,#F1F5F9);padding-bottom:14px;">'
    + '<h3 style="display:flex;align-items:center;gap:8px;"><span class="material-icons-round" style="font-size:20px;color:var(--primary,#3B82F6)">add_circle</span> New Booking</h3>'
    + '<button class="modal-close-btn" onclick="closeNewBookingModal()"><span class="material-icons-round">close</span></button>'
    + '</div><div style="padding:24px;">'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">'
    + '<div style="grid-column:1/-1;"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;display:block;margin-bottom:6px">Customer Name</label>'
    + '<input type="text" id="nb-customer" placeholder="Enter customer name" style="width:100%;padding:10px 14px;border:1.5px solid var(--slate-200);border-radius:10px;font-size:13px;box-sizing:border-box;" /></div>'
    + '<div style="grid-column:1/-1;"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;display:block;margin-bottom:6px">Vehicle</label>'
    + '<select id="nb-car" style="width:100%;padding:10px 14px;border:1.5px solid var(--slate-200);border-radius:10px;font-size:13px;background:var(--card-bg,#fff);color:var(--navy,#1E293B);" onchange="recalcNewBooking()">' + carOptions + '</select></div>'
    + '<div><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;display:block;margin-bottom:6px">Pick-up Date</label>'
    + '<input type="date" id="nb-pickup" value="' + today + '" min="' + today + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--slate-200);border-radius:10px;font-size:13px;box-sizing:border-box;" onchange="recalcNewBooking()" /></div>'
    + '<div><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;display:block;margin-bottom:6px">Return Date</label>'
    + '<input type="date" id="nb-return" value="' + tomorrow + '" min="' + tomorrow + '" style="width:100%;padding:10px 14px;border:1.5px solid var(--slate-200);border-radius:10px;font-size:13px;box-sizing:border-box;" onchange="recalcNewBooking()" /></div>'
    + '<div style="grid-column:1/-1;"><label style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;display:block;margin-bottom:6px">Pick-up Location</label>'
    + '<select id="nb-location" style="width:100%;padding:10px 14px;border:1.5px solid var(--slate-200);border-radius:10px;font-size:13px;background:var(--card-bg,#fff);color:var(--navy,#1E293B);">'
    + '<option>Melaka Sentral Bus Terminal</option><option>Melaka International Airport</option><option>Ayer Keroh Toll Plaza</option></select></div></div>'
    + '<div style="background:var(--bg-surface-2,#F1F5F9);border-radius:12px;padding:14px;margin-bottom:16px;">'
    + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:10px">Booking Summary</div>'
    + '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;"><span style="color:var(--slate-500)">Duration</span><span id="nb-days" style="font-weight:600">-- days</span></div>'
    + '<div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:6px;"><span style="color:var(--slate-500)">Daily Rate</span><span id="nb-rate" style="font-weight:600">RM --</span></div>'
    + '<div style="border-top:1px solid var(--slate-200);margin:10px 0;"></div>'
    + '<div style="display:flex;justify-content:space-between;font-size:15px;"><span style="font-weight:700">Total</span><span id="nb-total" style="font-weight:800;color:var(--primary,#3B82F6)">RM --</span></div></div>'
    + '<div style="display:flex;gap:10px;">'
    + '<button class="btn-outline-sm" onclick="closeNewBookingModal()" style="flex:1;padding:10px;justify-content:center;">Cancel</button>'
    + '<button class="btn-primary-sm" onclick="submitNewBooking()" style="flex:1;padding:10px;justify-content:center;" id="nb-submit-btn">'
    + '<span class="material-icons-round" style="font-size:14px">check</span> Create Booking</button></div></div></div>';

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  recalcNewBooking();
}

function closeNewBookingModal() {
  var modal = document.getElementById('new-booking-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

function recalcNewBooking() {
  var pickup = document.getElementById('nb-pickup');
  var returnD = document.getElementById('nb-return');
  var carSel = document.getElementById('nb-car');
  if (!pickup || !returnD || !carSel) return;
  var p = new Date(pickup.value);
  var r = new Date(returnD.value);
  var days = Math.max(1, Math.ceil((r - p) / 86400000));
  var selectedOpt = carSel.options[carSel.selectedIndex];
  var rate = parseFloat(selectedOpt ? selectedOpt.getAttribute('data-price') : 0) || 0;
  var total = rate * days;
  var daysEl = document.getElementById('nb-days');
  var rateEl = document.getElementById('nb-rate');
  var totalEl = document.getElementById('nb-total');
  if (daysEl) daysEl.textContent = days + ' day' + (days !== 1 ? 's' : '');
  if (rateEl) rateEl.textContent = rate > 0 ? 'RM ' + rate.toLocaleString() : 'RM --';
  if (totalEl) totalEl.textContent = rate > 0 ? 'RM ' + total.toLocaleString() : 'RM --';
}

async function submitNewBooking() {
  var custInput = document.getElementById('nb-customer');
  var carSel = document.getElementById('nb-car');
  var pickup = document.getElementById('nb-pickup');
  var returnD = document.getElementById('nb-return');
  var location = document.getElementById('nb-location');
  if (!custInput.value.trim() || !carSel.value || !pickup.value || !returnD.value) {
    showToast('Please fill in all required fields.', 'info');
    return;
  }
  var p = new Date(pickup.value);
  var r = new Date(returnD.value);
  var days = Math.max(1, Math.ceil((r - p) / 86400000));
  var selectedCarOpt = carSel.options[carSel.selectedIndex];
  var rate = parseFloat(selectedCarOpt.getAttribute('data-price')) || 0;
  var total = rate * days;
  var custName = custInput.value.trim();
  var carName = selectedCarOpt.text;
  var carPlate = selectedCarOpt.getAttribute('data-plate') || '--';
  var submitBtn = document.getElementById('nb-submit-btn');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = '<span class="material-icons-round" style="font-size:14px">refresh</span> Creating...'; }
  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var result = await window.supabaseClient.from('bookings').insert([{
        customer: custName, car_id: parseInt(carSel.value), car: carName, plate: carPlate,
        start_date: pickup.value, end_date: returnD.value, days: days,
        pickup_location: location.value, total: total, payment: 'Unpaid', status: 'Pending'
      }]).select().single();
      if (result.error) throw result.error;
      var nb = result.data;
      nb._car_name = nb.car; nb._car_plate = nb.plate; nb._pickup = nb.start_date;
      nb._return = nb.end_date; nb._customer = nb.customer; nb._days = nb.days; nb._total = nb.total;
      allBookings.unshift(nb);
    } catch (err) {
      console.error('[WeDRIVE] New booking error:', err);
      showToast('Error creating booking', 'info');
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = '<span class="material-icons-round" style="font-size:14px">check</span> Create Booking'; }
      return;
    }
  } else {
    var demoId = 'BK-' + new Date().getFullYear() + '-' + String(allBookings.length + 1).padStart(3, '0');
    allBookings.unshift({ id: demoId, _customer: custName, _car_name: carName, _car_plate: carPlate, _pickup: pickup.value, _return: returnD.value, _days: days, _total: total, payment: 'Unpaid', status: 'Pending' });
  }
  applyFilters();
  closeNewBookingModal();
  showToast('Booking created successfully.', 'success');
}
