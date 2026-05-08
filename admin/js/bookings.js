/**
 * WeDRIVE - Bookings Module JS
 * admin/js/bookings.js
 */

let allBookings = [];

window.WeDriveAPI.getAdminData()
  .then(data => {
    allBookings = data.bookings || [];
    populateBookingStats(data.bookings);
    renderBookings(data.bookings);
  })
  .catch(err => console.error('Bookings data load error:', err));

function populateBookingStats(bookings) {
  const total = bookings.length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const pending = bookings.filter(b => b.status === 'Pending').length;
  const revenue = bookings.reduce((sum, b) => sum + b.total, 0);

  document.getElementById('bk-total').textContent = total;
  document.getElementById('bk-confirmed').textContent = confirmed;
  document.getElementById('bk-pending').textContent = pending;
  document.getElementById('bk-revenue').textContent = 'RM ' + revenue.toLocaleString();
}

function renderBookings(bookings) {
  const tbody = document.getElementById('bookings-tbody');
  if (!tbody) return;
  if (bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#94A3B8;padding:40px">No bookings found</td></tr>';
    return;
  }
  tbody.innerHTML = bookings.map(b => {
    const statusClass = b.status.toLowerCase();
    const paymentClass = b.payment === 'Paid' ? 'available' : 'maintenance';
    return `
    <tr>
      <td><strong>${b.id}</strong></td>
      <td>${b.customer}</td>
      <td>${b.car}<br><small style="color:#94A3B8">${b.plate}</small></td>
      <td>${formatDate(b.pickup)}</td>
      <td>${formatDate(b.return)}</td>
      <td><strong>RM ${b.total.toLocaleString()}</strong></td>
      <td><span class="status-badge ${paymentClass}"><span class="dot"></span> ${b.payment}</span></td>
      <td><span class="status-badge ${statusClass}"><span class="dot"></span> ${b.status}</span></td>
      <td>
        <button class="btn-primary-sm" onclick="viewBooking('${b.id}')" style="font-size:12px;padding:6px 12px">
          <span class="material-icons-round" style="font-size:14px">visibility</span> View
        </button>
      </td>
    </tr>`;
  }).join('');
}

function filterBookings(status, btn) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  if (status === 'all') {
    renderBookings(allBookings);
  } else {
    renderBookings(allBookings.filter(b => b.status === status));
  }
}

function searchBookings(query) {
  const q = query.toLowerCase();
  const filtered = allBookings.filter(b =>
    b.id.toLowerCase().includes(q) ||
    b.customer.toLowerCase().includes(q) ||
    b.car.toLowerCase().includes(q)
  );
  renderBookings(filtered);
}

function viewBooking(id) {
  const b = allBookings.find(x => x.id === id);
  if (!b) return;
  alert(
    `Booking: ${b.id}\n` +
    `Customer: ${b.customer}\n` +
    `Phone: ${b.phone}\n` +
    `Car: ${b.car} (${b.plate})\n` +
    `Pick-up: ${b.pickup} @ ${b.pickup_loc}\n` +
    `Return: ${b.return}\n` +
    `Days: ${b.days}\n` +
    `Total: RM ${b.total}\n` +
    `Payment: ${b.payment}\n` +
    `Status: ${b.status}`
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-MY', { day: '2-digit', month: 'short', year: 'numeric' });
}
