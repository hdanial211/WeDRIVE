/**
 * WeDRIVE - Customers Module JS
 * admin/js/customers.js
 */

let allCustomers = [];

window.WeDriveAPI.getAdminData()
  .then(data => {
    allCustomers = data.customers || [];
    populateCustomerStats(allCustomers);
    renderCustomers(allCustomers);
  })
  .catch(err => console.error('Customers data load error:', err));

function populateCustomerStats(customers) {
  const total = customers.length;
  const active = customers.filter(c => c.status === 'Active').length;
  const inactive = customers.filter(c => c.status === 'Inactive').length;
  const spent = customers.reduce((sum, c) => sum + c.total_spent, 0);

  document.getElementById('cu-total').textContent = total;
  document.getElementById('cu-active').textContent = active;
  document.getElementById('cu-inactive').textContent = inactive;
  document.getElementById('cu-spent').textContent = 'RM ' + spent.toLocaleString();
}

function renderCustomers(customers) {
  const tbody = document.getElementById('customers-tbody');
  if (!tbody) return;
  if (customers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#94A3B8;padding:40px">No customers found</td></tr>';
    return;
  }
  tbody.innerHTML = customers.map(c => {
    const statusClass = c.status === 'Active' ? 'available' : 'maintenance';
    return `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.license}</td>
      <td style="text-align:center">${c.total_bookings}</td>
      <td><strong>RM ${c.total_spent.toLocaleString()}</strong></td>
      <td><span class="status-badge ${statusClass}"><span class="dot"></span> ${c.status}</span></td>
      <td>${c.joined}</td>
      <td>
        <button class="btn-primary-sm" onclick="viewCustomer(${c.id})" style="font-size:12px;padding:6px 12px">
          <span class="material-icons-round" style="font-size:14px">visibility</span> View
        </button>
      </td>
    </tr>`;
  }).join('');
}

function searchCustomers(query) {
  const q = query.toLowerCase();
  const filtered = allCustomers.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.email.toLowerCase().includes(q) ||
    c.phone.includes(q)
  );
  renderCustomers(filtered);
}

function viewCustomer(id) {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  alert(
    `Customer: ${c.name}\n` +
    `Email: ${c.email}\n` +
    `Phone: ${c.phone}\n` +
    `IC: ${c.ic}\n` +
    `License: ${c.license}\n` +
    `Total Bookings: ${c.total_bookings}\n` +
    `Total Spent: RM ${c.total_spent}\n` +
    `Status: ${c.status}\n` +
    `Joined: ${c.joined}\n` +
    `Last Booking: ${c.last_booking}`
  );
}
