/**
 * WeDRIVE - Reports Module JS
 * admin/js/reports.js
 * Generates reports from real booking/car data
 */

var currentBookings = [];
var currentCars = [];

window.WeDriveAPI.getAdminData()
  .then(data => {
    currentBookings = data.bookings || [];
    currentCars = data.car || [];
    generateReportStats(currentBookings, currentCars);
    renderRevenueChart(currentBookings);
    renderUtilChart(currentBookings, currentCars);
    populateSummaryCards(currentBookings, currentCars);
  })
  .catch(err => console.error('Reports data load error:', err));

function generateReportStats(bookings, cars) {
  var paidBookings = bookings.filter(b => b.payment === 'Paid');
  var totalRevenue = paidBookings.reduce((s, b) => s + (b.total || 0), 0);
  var totalBookings = bookings.length;
  var totalDays = bookings.reduce((s, b) => s + (b.days || 0), 0);
  var avgDays = totalBookings > 0 ? (totalDays / totalBookings).toFixed(1) : 0;

  var el;
  el = document.getElementById('rp-revenue'); if (el) el.textContent = 'RM ' + totalRevenue.toLocaleString();
  el = document.getElementById('rp-bookings'); if (el) el.textContent = totalBookings;
  el = document.getElementById('rp-avg'); if (el) el.textContent = avgDays + ' days';
  el = document.getElementById('rp-rating'); if (el) el.textContent = '4.8/5';
}

function renderRevenueChart(bookings) {
  var container = document.getElementById('revenue-chart');
  if (!container) return;

  // Group revenue by month from paid bookings
  var monthMap = {};
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  bookings.forEach(b => {
    if (b.payment === 'Paid' && b.start_date) {
      var d = new Date(b.start_date);
      var key = months[d.getMonth()];
      monthMap[key] = (monthMap[key] || 0) + (b.total || 0);
    }
  });

  // Build chart data for months that have data
  var chartData = [];
  months.forEach(m => {
    if (monthMap[m]) chartData.push({ month: m, revenue: monthMap[m] });
  });

  if (chartData.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#94A3B8;padding:40px;">No revenue data available</p>';
    return;
  }

  var maxVal = Math.max(...chartData.map(m => m.revenue));

  container.innerHTML = `
    <div style="display:flex; align-items:flex-end; gap:16px; height:200px; padding:0 12px;">
      ${chartData.map(m => {
        var pct = (m.revenue / maxVal) * 100;
        var color = m.revenue === maxVal ? 'var(--primary)' : 'var(--slate-200)';
        return `
        <div style="flex:1; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:6px;">
          <span style="font-size:11px; font-weight:600; color:var(--navy);">RM ${(m.revenue/1000).toFixed(1)}k</span>
          <div style="flex:1; width:100%; display:flex; align-items:flex-end;">
            <div style="width:100%; background:${color}; border-radius:8px 8px 4px 4px; height:${pct}%; min-height:8px; transition:height 0.6s ease;"></div>
          </div>
          <span style="font-size:11px; font-weight:600; color:var(--slate-400);">${m.month}</span>
        </div>`;
      }).join('')}
    </div>`;
}

function renderUtilChart(bookings, cars) {
  var container = document.getElementById('util-chart');
  if (!container) return;

  // Calculate utilization per car
  var carBookingDays = {};
  bookings.forEach(b => {
    if (b.car_id && b.days) {
      carBookingDays[b.car_id] = (carBookingDays[b.car_id] || 0) + b.days;
    }
  });

  // Calculate as % of 365 days (or total possible days)
  var utilData = cars.map(c => {
    var totalDays = carBookingDays[c.id] || 0;
    var utilPct = Math.min(Math.round((totalDays / 365) * 100), 100);
    return { car: c.name ? c.name.split(' ').slice(1, 3).join(' ') : 'Car ' + c.id, utilization: utilPct, days: totalDays };
  }).sort((a, b) => b.utilization - a.utilization);

  container.innerHTML = utilData.map(u => {
    var barColor = 'var(--primary)';
    if (u.utilization >= 80) barColor = 'var(--success)';
    else if (u.utilization >= 50) barColor = 'var(--warning)';
    else barColor = 'var(--danger)';
    return `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; padding:0 12px;">
      <span style="width:140px; font-size:12px; font-weight:600; color:var(--navy); text-align:right;">${u.car}</span>
      <div style="flex:1; background:var(--slate-100); border-radius:8px; height:24px; overflow:hidden;">
        <div style="height:100%; width:${u.utilization}%; background:${barColor}; border-radius:8px; transition:width 0.8s ease; display:flex; align-items:center; justify-content:flex-end; padding-right:8px;">
          <span style="font-size:10px; font-weight:700; color:white;">${u.utilization}%</span>
        </div>
      </div>
      <span style="font-size:11px; color:var(--slate-400); width:60px;">${u.days} days</span>
    </div>`;
  }).join('');
}

function populateSummaryCards(bookings, cars) {
  // Find most popular car
  var carCount = {};
  bookings.forEach(b => {
    var name = b.car || 'Unknown';
    carCount[name] = (carCount[name] || 0) + 1;
  });
  var popular = Object.entries(carCount).sort((a,b) => b[1] - a[1]);
  var popularCar = popular.length > 0 ? popular[0][0].split(' ').slice(1,4).join(' ') : '--';

  // Find busiest month
  var monthCount = {};
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  bookings.forEach(b => {
    if (b.start_date) {
      var m = months[new Date(b.start_date).getMonth()];
      monthCount[m] = (monthCount[m] || 0) + 1;
    }
  });
  var busiest = Object.entries(monthCount).sort((a,b) => b[1] - a[1]);
  var busiestMonth = busiest.length > 0 ? busiest[0][0] + ' (' + busiest[0][1] + ' bookings)' : '--';

  var paidTotal = bookings.filter(b => b.payment === 'Paid').reduce((s,b) => s + (b.total || 0), 0);

  var el;
  el = document.getElementById('rp-popular'); if (el) el.textContent = popularCar;
  el = document.getElementById('rp-busiest'); if (el) el.textContent = busiestMonth;
  el = document.getElementById('rp-total-rev'); if (el) el.textContent = 'RM ' + paidTotal.toLocaleString();
}

function toggleExportDropdown(e) {
  e.stopPropagation();
  var dropdown = document.getElementById('export-dropdown');
  if (!dropdown) return;
  
  if (dropdown.style.display === 'none') {
    dropdown.style.display = 'flex';
  } else {
    dropdown.style.display = 'none';
  }
}

function handleExport(format) {
  var dropdown = document.getElementById('export-dropdown');
  if (dropdown) dropdown.style.display = 'none';

  if (format === 'pdf') {
    window.print();
  } else if (format === 'csv') {
    exportToCSV();
  }
}

function exportToCSV() {
  if (!currentBookings || currentBookings.length === 0) {
    alert('No data available to export.');
    return;
  }

  var csvRows = [];
  
  // 1. Title & Header
  csvRows.push("WeDRIVE PERFORMANCE REPORT");
  csvRows.push("Generated Date," + new Date().toLocaleString());
  csvRows.push("");
  
  // 2. Summary stats
  var paidBookings = currentBookings.filter(b => b.payment === 'Paid');
  var totalRevenue = paidBookings.reduce((s, b) => s + (Number(b.total) || 0), 0);
  var totalBookings = currentBookings.length;
  var totalDays = currentBookings.reduce((s, b) => s + (Number(b.days) || 0), 0);
  var avgDays = totalBookings > 0 ? (totalDays / totalBookings).toFixed(1) : 0;
  
  csvRows.push("SUMMARY STATS");
  csvRows.push("Total Revenue (RM)," + totalRevenue);
  csvRows.push("Total Bookings," + totalBookings);
  csvRows.push("Average Rental Days," + avgDays);
  csvRows.push("");

  // 3. Detailed booking list header
  csvRows.push("DETAILED BOOKINGS");
  csvRows.push("Booking ID,Car Model,Plate Number,Customer Name,Customer Email,Start Date,End Date,Duration (Days),Daily Rate (RM),Total (RM),Status,Payment Status");

  // 4. Populate bookings
  currentBookings.forEach(function(b) {
    var row = [
      b.booking_id || b.id || '',
      '"' + (b.car || '').replace(/"/g, '""') + '"',
      b.plate || '',
      '"' + (b.customer || '').replace(/"/g, '""') + '"',
      b.email || b.customer_email || '',
      b.start_date || '',
      b.end_date || '',
      b.days || '',
      b.daily || '',
      b.total || '',
      b.status || '',
      b.payment || ''
    ];
    csvRows.push(row.join(","));
  });

  // Create Blob and download
  var csvString = csvRows.join("\n");
  var blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "wedrive_report_" + new Date().toISOString().slice(0, 10) + ".csv");
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Close dropdown on click outside
document.addEventListener('click', function(e) {
  var dropdown = document.getElementById('export-dropdown');
  if (dropdown && dropdown.style.display === 'flex') {
    var btn = document.getElementById('export-btn');
    if (!dropdown.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
      dropdown.style.display = 'none';
    }
  }
});
