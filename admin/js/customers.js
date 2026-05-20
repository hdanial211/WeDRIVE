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
    populateCustomerStats(allCustomers);
    renderCustomers(allCustomers);
  })
  .catch(err => console.error('Customers data load error:', err));

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
    var statusClass = c._status === 'Active' ? 'available' : 'maintenance';
    var joinedFmt = formatDate(c._joined);
    return `
    <tr>
      <td><strong>${c._name}</strong></td>
      <td>${c._email}</td>
      <td>${c._phone}</td>
      <td>${c._license}</td>
      <td style="text-align:center">${c._total_bookings}</td>
      <td><strong>RM ${(c._total_spent || 0).toLocaleString()}</strong></td>
      <td><span class="status-badge ${statusClass}"><span class="dot"></span> ${c._status}</span></td>
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

function viewCustomer(id) {
  var c = allCustomers.find(x => x.id === id);
  if (!c) return;
  var custBookings = allBookingsData.filter(b =>
    b.auth_uid === c.auth_uid || b.email === c.email
  );
  var bookingList = custBookings.length > 0
    ? custBookings.map(b => '  #' + b.id + ' ' + (b.car || b._car_name || '') + ' (' + b.status + ')').join('\n')
    : '  No bookings';

  alert(
    'Customer: ' + c._name + '\n' +
    'Email: ' + c._email + '\n' +
    'Phone: ' + c._phone + '\n' +
    'IC: ' + (c.ic || '--') + '\n' +
    'License: ' + c._license + '\n' +
    'Total Bookings: ' + c._total_bookings + '\n' +
    'Total Spent: RM ' + (c._total_spent || 0).toLocaleString() + '\n' +
    'Status: ' + c._status + '\n' +
    'Joined: ' + formatDate(c._joined) + '\n\n' +
    'Booking History:\n' + bookingList
  );
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
