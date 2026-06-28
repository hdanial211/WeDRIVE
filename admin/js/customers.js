/**
 * WeDRIVE - Customers Module JS
 * admin/js/customers.js
 */

let allCustomers = [];
let allBookingsData = [];
let custSortCol = 'joined';
let custSortDir = 'desc';
let custSearch = '';

window.WeDriveAPI.getAdminData()
  .then(data => {
    allBookingsData = data.bookings || [];
    // Enrich customers with booking stats
    allCustomers = (data.customers || []).map(c => {
      var custBookings = allBookingsData.filter(b =>
        b.auth_uid === c.auth_uid || b.email === c.email
      );
      c._total_bookings = c.total_bookings || custBookings.length;
      c._total_spent = c.total_spent || custBookings.reduce((s, b) => s + (b.total || 0), 0);
      c._name = c.name || c.full_name || '--';
      c._email = c.email || '--';
      c._phone = c.phone || '--';
      c._license = c.license || c.license_no || '--';
      c._joined = c.joined || c.created_at || '--';
      c._status = c.status || 'Active';
      return c;
    });
    applyCustomerFilters();
  })
  .catch(err => console.error('Customers data load error:', err));

function sortCustomers(customers) {
  customers.sort(function(a, b) {
    var aPending = (a.verification_status === 'Pending') ? 1 : 0;
    var bPending = (b.verification_status === 'Pending') ? 1 : 0;
    if (bPending !== aPending) {
      return bPending - aPending; // Pending first
    }
    // Secondary sort: joined date descending
    var dateA = new Date(a._joined).getTime() || 0;
    var dateB = new Date(b._joined).getTime() || 0;
    return dateB - dateA;
  });
}

function populateCustomerStats(customers) {
  var total = customers.length;
  var active = customers.filter(c => c._status === 'Active').length;
  var inactive = customers.filter(c => c._status === 'Inactive' || c._status === 'Suspended').length;
  var spent = customers.reduce((sum, c) => sum + (c._total_spent || 0), 0);

  document.getElementById('cu-total').textContent = total;
  document.getElementById('cu-active').textContent = active;
  document.getElementById('cu-inactive').textContent = inactive;
  document.getElementById('cu-spent').textContent = 'RM ' + spent.toLocaleString();
}

function renderPendingCustomers(customers) {
  var tbody = document.getElementById('pending-customers-tbody');
  var card = document.getElementById('pending-verifications-card');
  if (!tbody || !card) return;

  var pendings = customers.filter(c => c.verification_status === 'Pending');
  if (pendings.length === 0) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';
  tbody.innerHTML = pendings.map(c => {
    var joinedFmt = formatDate(c._joined);
    return `
    <tr>
      <td><strong>${c._name}</strong></td>
      <td>${c._email}</td>
      <td>${c._phone}</td>
      <td>${c._license}</td>
      <td>${joinedFmt}</td>
      <td style="white-space:nowrap;">
        <button class="btn-primary-sm" onclick="viewCustomer(${c.id})" style="font-size:12px;padding:6px 10px;background:#D97706;border:none;color:#fff;">
          <span class="material-icons-round" style="font-size:14px">visibility</span> Review
        </button>
      </td>
    </tr>`;
  }).join('');
}

function renderCustomers(customers) {
  renderPendingCustomers(customers);
  var tbody = document.getElementById('customers-tbody');
  if (!tbody) return;
  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#94A3B8;padding:40px">No customers found</td></tr>';
    return;
  }
  tbody.innerHTML = customers.map(c => {
    var joinedFmt = formatDate(c._joined);
    
    // Display verification status badge if not Verified or has a Pending review status
    var statusHtml = '';
    if (c.verification_status === 'Pending') {
      statusHtml = `<span class="status-badge pending"><span class="dot"></span> Pending</span>`;
    } else if (c.verification_status === 'Verified') {
      statusHtml = `<span class="status-badge available"><span class="dot"></span> Verified</span>`;
    } else if (c.verification_status === 'Rejected') {
      statusHtml = `<span class="status-badge cancelled"><span class="dot"></span> Rejected</span>`;
    } else {
      var statusClass = c._status === 'Active' ? 'available' : 'maintenance';
      statusHtml = `<span class="status-badge ${statusClass}"><span class="dot"></span> ${c._status}</span>`;
    }

    return `
    <tr>
      <td><strong>${c._name}</strong></td>
      <td>${c._email}</td>
      <td>${c._phone}</td>
      <td>${c._license}</td>
      <td style="text-align:center">${c._total_bookings}</td>
      <td><strong>RM ${(c._total_spent || 0).toLocaleString()}</strong></td>
      <td>${statusHtml}</td>
      <td>${joinedFmt}</td>
      <td style="white-space:nowrap;">
        <button class="btn-primary-sm" onclick="viewCustomer(${c.id})" style="font-size:12px;padding:6px 10px">
          <span class="material-icons-round" style="font-size:14px">visibility</span>
        </button>
        <button class="btn-outline-sm" onclick="toggleCustomerStatus(${c.id})" style="font-size:12px;padding:6px 10px" title="Toggle status">
          <span class="material-icons-round" style="font-size:14px">sync</span>
        </button>
      </td>
    </tr>`;
  }).join('');
}

function searchCustomers(query) {
  custSearch = query.toLowerCase();
  applyCustomerFilters();
}

function sortByCustomer(col) {
  if (custSortCol === col) {
    custSortDir = custSortDir === 'asc' ? 'desc' : 'asc';
  } else {
    custSortCol = col;
    custSortDir = 'asc';
  }
  applyCustomerFilters();
}

function updateCustomerSortHeaders() {
  var cols = ['name', 'email', 'bookings', 'spent', 'joined'];
  cols.forEach(function(col) {
    var el = document.getElementById('cu-th-' + col);
    if (!el) return;
    el.classList.remove('sort-asc', 'sort-desc');
    if (custSortCol === col) {
      el.classList.add(custSortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

function applyCustomerFilters() {
  var filtered = allCustomers;

  if (custSearch) {
    filtered = filtered.filter(c =>
      c._name.toLowerCase().includes(custSearch) ||
      c._email.toLowerCase().includes(custSearch) ||
      c._phone.includes(custSearch)
    );
  }

  // Sort
  filtered = filtered.slice().sort((a, b) => {
    var va, vb;
    if (custSortCol === 'name') { va = a._name.toLowerCase(); vb = b._name.toLowerCase(); }
    else if (custSortCol === 'email') { va = a._email.toLowerCase(); vb = b._email.toLowerCase(); }
    else if (custSortCol === 'bookings') { va = a._total_bookings; vb = b._total_bookings; }
    else if (custSortCol === 'spent') { va = a._total_spent; vb = b._total_spent; }
    else if (custSortCol === 'joined') { va = new Date(a._joined); vb = new Date(b._joined); }
    else { va = new Date(a._joined); vb = new Date(b._joined); }
    if (va < vb) return custSortDir === 'asc' ? -1 : 1;
    if (va > vb) return custSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Update stats with filtered results (NOTA 14)
  populateCustomerStats(filtered);
  renderCustomers(filtered);
  updateCustomerSortHeaders();
}


async function viewCustomer(id) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;
  var custBookings = allBookingsData.filter(b =>
    b.auth_uid === c.auth_uid || b.email === c.email
  );

  // Fetch document URLs from database
  var docs = {};
  try {
    docs = await window.WeDriveAPI.getCustomerDocuments(id);
  } catch (e) { console.warn('Failed to load documents', e); }

  var verStatus = docs.verification_status || c.verification_status || '--';
  var verBadgeClass = verStatus === 'Verified' ? 'available' : verStatus === 'Rejected' ? 'maintenance' : verStatus === 'Pending' ? 'pending-badge' : '';

  // Build booking history rows
  var bookingRows = custBookings.length > 0
    ? custBookings.slice(0, 8).map(b => `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border-color,#E2E8F0);font-size:12px;">
        <span>#${b.id} ${b.car || ''}</span>
        <span class="status-badge ${(b.status||'').toLowerCase()}" style="font-size:10px;padding:2px 8px">${b.status}</span>
      </div>`).join('')
    : '<div style="color:#94A3B8;font-size:13px;padding:12px 0">No bookings yet</div>';

  // Document preview HTML
  var icFrontDocHtml = docs.ic_document_url
    ? `<a href="${docs.ic_document_url}" target="_blank" style="display:block;border:1px solid var(--border-color,#E2E8F0);border-radius:10px;overflow:hidden;max-height:140px;">
        <img src="${docs.ic_document_url}" alt="IC Front" style="width:100%;max-height:140px;object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=\\'padding:20px;text-align:center;color:#94A3B8;font-size:11px;\\'>PDF / Preview unavailable</div>'" />
      </a>`
    : '<div style="color:#94A3B8;font-size:11px;padding:12px;text-align:center;border:1px dashed #CBD5E1;border-radius:10px">Not uploaded</div>';

  var icBackDocHtml = docs.ic_back_document_url
    ? `<a href="${docs.ic_back_document_url}" target="_blank" style="display:block;border:1px solid var(--border-color,#E2E8F0);border-radius:10px;overflow:hidden;max-height:140px;">
        <img src="${docs.ic_back_document_url}" alt="IC Back" style="width:100%;max-height:140px;object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=\\'padding:20px;text-align:center;color:#94A3B8;font-size:11px;\\'>PDF / Preview unavailable</div>'" />
      </a>`
    : '<div style="color:#94A3B8;font-size:11px;padding:12px;text-align:center;border:1px dashed #CBD5E1;border-radius:10px">Not uploaded</div>';

  var licFrontDocHtml = docs.license_document_url
    ? `<a href="${docs.license_document_url}" target="_blank" style="display:block;border:1px solid var(--border-color,#E2E8F0);border-radius:10px;overflow:hidden;max-height:140px;">
        <img src="${docs.license_document_url}" alt="License Front" style="width:100%;max-height:140px;object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=\\'padding:20px;text-align:center;color:#94A3B8;font-size:11px;\\'>PDF / Preview unavailable</div>'" />
      </a>`
    : '<div style="color:#94A3B8;font-size:11px;padding:12px;text-align:center;border:1px dashed #CBD5E1;border-radius:10px">Not uploaded</div>';

  var licBackDocHtml = docs.license_back_document_url
    ? `<a href="${docs.license_back_document_url}" target="_blank" style="display:block;border:1px solid var(--border-color,#E2E8F0);border-radius:10px;overflow:hidden;max-height:140px;">
        <img src="${docs.license_back_document_url}" alt="License Back" style="width:100%;max-height:140px;object-fit:cover;" onerror="this.parentElement.innerHTML='<div style=\\'padding:20px;text-align:center;color:#94A3B8;font-size:11px;\\'>PDF / Preview unavailable</div>'" />
      </a>`
    : '<div style="color:#94A3B8;font-size:11px;padding:12px;text-align:center;border:1px dashed #CBD5E1;border-radius:10px">Not uploaded</div>';

  // Verification action buttons (only if Pending)
  var verActions = '';
  if (verStatus === 'Pending') {
    verActions = `
      <div style="display:flex;gap:10px;margin-top:16px;padding-top:16px;border-top:1px solid var(--border-color,#E2E8F0);">
        <button class="btn-primary-sm" onclick="approveCustomer(${id})" style="flex:1;padding:10px;background:#059669;display:flex;align-items:center;justify-content:center;gap:6px;">
          <span class="material-icons-round" style="font-size:16px">verified</span> Approve
        </button>
        <button class="btn-outline-sm" onclick="openRejectModal(${id})" style="flex:1;padding:10px;color:#DC2626;border-color:#FCA5A5;display:flex;align-items:center;justify-content:center;gap:6px;">
          <span class="material-icons-round" style="font-size:16px">cancel</span> Reject
        </button>
      </div>`;
  }

  // Build initials avatar
  var initials = c._name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();

  // Create modal
  var modal = document.getElementById('customer-detail-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'customer-detail-modal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
  <div class="modal-container" style="max-width:560px;width:94%;max-height:90vh;overflow-y:auto;">
    <div class="modal-header">
      <h3><span class="material-icons-round" style="font-size:20px;vertical-align:middle;margin-right:6px;">person</span> Customer Details</h3>
      <button class="modal-close-btn" onclick="closeCustomerModal()"><span class="material-icons-round">close</span></button>
    </div>
    <div style="padding:24px;">
      <!-- Profile Header -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;">
        <div style="width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#3B82F6,#1D4ED8);display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:700;flex-shrink:0;">${initials}</div>
        <div>
          <div style="font-size:16px;font-weight:700;color:var(--navy,#1E293B)">${c._name}</div>
          <div style="font-size:13px;color:var(--slate-400,#94A3B8)">${c._email}</div>
        </div>
        <div style="margin-left:auto">
          <span class="status-badge ${verBadgeClass}" style="font-size:11px"><span class="dot"></span> ${verStatus}</span>
        </div>
      </div>

      <!-- Info Grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;">
        <div style="background:var(--bg-surface-2,#F1F5F9);padding:12px;border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Phone</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${c._phone}</div>
        </div>
        <div style="background:var(--bg-surface-2,#F1F5F9);padding:12px;border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">IC</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${c.ic || '--'}</div>
        </div>
        <div style="background:var(--bg-surface-2,#F1F5F9);padding:12px;border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">License</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${c._license}</div>
        </div>
        <div style="background:var(--bg-surface-2,#F1F5F9);padding:12px;border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Joined</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${formatDate(c._joined)}</div>
        </div>
        <div style="background:var(--bg-surface-2,#F1F5F9);padding:12px;border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Total Bookings</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">${c._total_bookings}</div>
        </div>
        <div style="background:var(--bg-surface-2,#F1F5F9);padding:12px;border-radius:10px;">
          <div style="font-size:10px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:4px">Total Spent</div>
          <div style="font-size:13px;font-weight:600;color:var(--navy,#1E293B)">RM ${(c._total_spent || 0).toLocaleString()}</div>
        </div>
      </div>

      <!-- Documents Section -->
      <div style="margin-bottom:20px;">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:10px">Uploaded Documents</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;row-gap:16px;">
          <div>
            <div style="font-size:11px;font-weight:600;color:var(--slate-400,#94A3B8);margin-bottom:6px">IC (Front)</div>
            ${icFrontDocHtml}
          </div>
          <div>
            <div style="font-size:11px;font-weight:600;color:var(--slate-400,#94A3B8);margin-bottom:6px">IC (Back)</div>
            ${icBackDocHtml}
          </div>
          <div>
            <div style="font-size:11px;font-weight:600;color:var(--slate-400,#94A3B8);margin-bottom:6px">Driving License (Front)</div>
            ${licFrontDocHtml}
          </div>
          <div>
            <div style="font-size:11px;font-weight:600;color:var(--slate-400,#94A3B8);margin-bottom:6px">Driving License (Back)</div>
            ${licBackDocHtml}
          </div>
        </div>
      </div>

      <!-- Booking History -->
      <div style="margin-bottom:8px;">
        <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:var(--primary,#3B82F6);letter-spacing:0.5px;margin-bottom:8px">Booking History</div>
        <div style="max-height:140px;overflow-y:auto;">${bookingRows}</div>
      </div>

      ${verActions}
    </div>
  </div>`;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCustomerModal() {
  var modal = document.getElementById('customer-detail-modal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

// ---- Custom modal helpers (replace native confirm/prompt) ----

function showConfirmModal(opts) {
  // opts: { title, message, confirmLabel, cancelLabel, confirmClass, onConfirm }
  var existing = document.getElementById('wedrive-confirm-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'wedrive-confirm-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

  var confirmClass = opts.confirmClass || 'background:#059669';
  overlay.innerHTML = `
    <div style="background:var(--bg-surface,#fff);border-radius:16px;padding:28px 32px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.25);animation:slideUp 0.2s ease;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <span class="material-icons-round" style="font-size:26px;color:${opts.iconColor || '#059669'}">${opts.icon || 'help_outline'}</span>
        <h3 style="margin:0;font-size:17px;font-weight:700;color:var(--navy,#1E293B)">${opts.title || 'Confirm'}</h3>
      </div>
      <p style="margin:0 0 22px;font-size:14px;color:var(--slate-500,#64748B);line-height:1.6">${opts.message || ''}</p>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button id="wdcm-cancel" style="padding:9px 20px;border-radius:10px;border:1px solid var(--border-color,#E2E8F0);background:transparent;color:var(--navy,#1E293B);font-size:14px;font-weight:600;cursor:pointer;">${opts.cancelLabel || 'Cancel'}</button>
        <button id="wdcm-confirm" style="padding:9px 20px;border-radius:10px;border:none;${confirmClass};color:#fff;font-size:14px;font-weight:600;cursor:pointer;">${opts.confirmLabel || 'Confirm'}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);

  overlay.querySelector('#wdcm-cancel').onclick = function() { overlay.remove(); };
  overlay.querySelector('#wdcm-confirm').onclick = function() {
    overlay.remove();
    if (opts.onConfirm) opts.onConfirm();
  };
  // Close on backdrop click
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

function showPromptModal(opts) {
  // opts: { title, message, placeholder, confirmLabel, cancelLabel, onConfirm }
  var existing = document.getElementById('wedrive-prompt-modal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'wedrive-prompt-modal';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:99999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';

  overlay.innerHTML = `
    <div style="background:var(--bg-surface,#fff);border-radius:16px;padding:28px 32px;max-width:440px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.25);animation:slideUp 0.2s ease;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
        <span class="material-icons-round" style="font-size:26px;color:#DC2626">cancel</span>
        <h3 style="margin:0;font-size:17px;font-weight:700;color:var(--navy,#1E293B)">${opts.title || 'Input Required'}</h3>
      </div>
      <p style="margin:0 0 14px;font-size:14px;color:var(--slate-500,#64748B);line-height:1.6">${opts.message || ''}</p>
      <textarea id="wdpm-input" rows="3" placeholder="${opts.placeholder || ''}" style="width:100%;box-sizing:border-box;padding:10px 14px;border-radius:10px;border:1px solid var(--border-color,#E2E8F0);font-size:14px;font-family:inherit;resize:vertical;color:var(--navy,#1E293B);background:var(--bg-surface,#fff);outline:none;"></textarea>
      <div id="wdpm-error" style="color:#DC2626;font-size:12px;margin-top:6px;display:none;">Please provide a reason.</div>
      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:18px;">
        <button id="wdpm-cancel" style="padding:9px 20px;border-radius:10px;border:1px solid var(--border-color,#E2E8F0);background:transparent;color:var(--navy,#1E293B);font-size:14px;font-weight:600;cursor:pointer;">${opts.cancelLabel || 'Cancel'}</button>
        <button id="wdpm-confirm" style="padding:9px 20px;border-radius:10px;border:none;background:#DC2626;color:#fff;font-size:14px;font-weight:600;cursor:pointer;">${opts.confirmLabel || 'Confirm'}</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  setTimeout(function() { overlay.querySelector('#wdpm-input').focus(); }, 100);

  overlay.querySelector('#wdpm-cancel').onclick = function() { overlay.remove(); };
  overlay.querySelector('#wdpm-confirm').onclick = function() {
    var val = overlay.querySelector('#wdpm-input').value.trim();
    if (!val) {
      overlay.querySelector('#wdpm-error').style.display = 'block';
      return;
    }
    overlay.remove();
    if (opts.onConfirm) opts.onConfirm(val);
  };
  overlay.addEventListener('click', function(e) { if (e.target === overlay) overlay.remove(); });
}

// ---- End custom modal helpers ----

async function approveCustomer(id) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;

  showConfirmModal({
    title: 'Approve Customer',
    message: 'Approve <strong>' + c._name + '</strong>? This will allow them to book cars.',
    confirmLabel: 'Approve',
    cancelLabel: 'Cancel',
    icon: 'verified',
    iconColor: '#059669',
    confirmClass: 'background:#059669',
    onConfirm: async function() {
      try {
        var result = await window.WeDriveAPI.verifyCustomer(id, 'Verified');
        if (!result.success) throw new Error(result.error);
        c.verification_status = 'Verified';

        // Send email notification
        if (window.WeDriveEmail) {
          window.WeDriveEmail.sendVerificationEmail(c._email, c._name, 'approved');
        }

        sortCustomers(allCustomers);
        populateCustomerStats(allCustomers);
        renderCustomers(allCustomers);
        closeCustomerModal();
        showToast(c._name + ' has been verified', 'success');
      } catch (err) {
        console.error('Approve error:', err);
        showToast('Error approving customer', 'info');
      }
    }
  });
}

function openRejectModal(id) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;

  showPromptModal({
    title: 'Reject Customer',
    message: 'Please provide a reason for rejecting <strong>' + c._name + '</strong>:',
    placeholder: 'e.g. Documents are not clear, IC expired...',
    confirmLabel: 'Reject',
    cancelLabel: 'Cancel',
    onConfirm: function(reason) {
      rejectCustomer(id, reason);
    }
  });
}

async function rejectCustomer(id, reason) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;

  try {
    var result = await window.WeDriveAPI.verifyCustomer(id, 'Rejected', reason);
    if (!result.success) throw new Error(result.error);
    c.verification_status = 'Rejected';

    // Send email notification
    if (window.WeDriveEmail) {
      window.WeDriveEmail.sendVerificationEmail(c._email, c._name, 'rejected', reason);
    }

    sortCustomers(allCustomers);
    populateCustomerStats(allCustomers);
    renderCustomers(allCustomers);
    closeCustomerModal();
    showToast(c._name + ' has been rejected', 'info');
  } catch (err) {
    console.error('Reject error:', err);
    showToast('Error rejecting customer', 'info');
  }
}

async function toggleCustomerStatus(id) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;
  var newStatus = c._status === 'Active' ? 'Suspended' : 'Active';
  var iconColor = newStatus === 'Active' ? '#059669' : '#DC2626';
  var confirmClass = newStatus === 'Active' ? 'background:#059669' : 'background:#DC2626';

  showConfirmModal({
    title: 'Change Status',
    message: 'Change <strong>' + c._name + '</strong> status to <strong>' + newStatus + '</strong>?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    icon: newStatus === 'Active' ? 'person' : 'person_off',
    iconColor: iconColor,
    confirmClass: confirmClass,
    onConfirm: async function() {
      if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
        try {
          var result = await window.supabaseClient.from('customers').update({ status: newStatus }).eq('id', id);
          if (result.error) throw result.error;
          c.status = newStatus;
          c._status = newStatus;
          populateCustomerStats(allCustomers);
          renderCustomers(allCustomers);
          showToast(c._name + ' set to ' + newStatus, 'success');
        } catch (err) {
          console.error('[WeDRIVE] Toggle customer status error:', err);
          showToast('Error updating status', 'info');
        }
      } else {
        c.status = newStatus;
        c._status = newStatus;
        populateCustomerStats(allCustomers);
        renderCustomers(allCustomers);
        showToast(c._name + ' set to ' + newStatus + ' (demo)', 'success');
      }
    }
  });
}

function formatDate(dateStr) {
  if (!dateStr || dateStr === '--') return '--';
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
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
