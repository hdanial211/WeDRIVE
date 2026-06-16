/**
 * WeDRIVE - Customers Module JS
 * admin/js/customers.js
 */

let allCustomers = [];
let allBookingsData = [];

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
    sortCustomers(allCustomers);
    populateCustomerStats(allCustomers);
    renderCustomers(allCustomers);
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

function renderCustomers(customers) {
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
  var q = query.toLowerCase();
  var filtered = allCustomers.filter(c =>
    c._name.toLowerCase().includes(q) ||
    c._email.toLowerCase().includes(q) ||
    c._phone.includes(q)
  );
  renderCustomers(filtered);
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

async function approveCustomer(id) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;
  if (!confirm('Approve ' + c._name + '? This will allow them to book cars.')) return;

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

function openRejectModal(id) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;

  var reason = prompt('Enter rejection reason for ' + c._name + ':');
  if (reason === null) return; // cancelled
  if (!reason.trim()) {
    alert('Please provide a reason for rejection.');
    return;
  }
  rejectCustomer(id, reason.trim());
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

  if (confirm('Change ' + c._name + ' status to "' + newStatus + '"?')) {
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
