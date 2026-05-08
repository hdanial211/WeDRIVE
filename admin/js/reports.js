/**
 * WeDRIVE - Reports Module JS
 * admin/js/reports.js
 * Pure CSS bar charts (no external chart library)
 */

window.WeDriveAPI.getAdminData()
  .then(data => {
    const reports = data.reports || {};
    populateReportStats(reports.summary);
    renderRevenueChart(reports.monthly_revenue);
    renderUtilChart(reports.car_utilization);
    populateSummaryCards(reports.summary);
  })
  .catch(err => console.error('Reports data load error:', err));

function populateReportStats(summary) {
  if (!summary) return;
  document.getElementById('rp-revenue').textContent = 'RM ' + summary.total_revenue.toLocaleString();
  document.getElementById('rp-bookings').textContent = summary.total_bookings;
  document.getElementById('rp-avg').textContent = summary.avg_rental_days + ' days';
  document.getElementById('rp-rating').textContent = summary.customer_satisfaction + '/5';
}

function renderRevenueChart(monthly) {
  const container = document.getElementById('revenue-chart');
  if (!container || !monthly) return;
  const maxVal = Math.max(...monthly.map(m => m.revenue));

  container.innerHTML = `
    <div style="display:flex; align-items:flex-end; gap:16px; height:200px; padding:0 12px;">
      ${monthly.map(m => {
        const pct = (m.revenue / maxVal) * 100;
        const color = m.revenue === maxVal ? 'var(--primary)' : 'var(--slate-200)';
        return `
        <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:6px;">
          <span style="font-size:11px; font-weight:600; color:var(--navy);">RM ${(m.revenue/1000).toFixed(1)}k</span>
          <div style="width:100%; background:${color}; border-radius:8px 8px 4px 4px; height:${pct}%; min-height:8px; transition:height 0.6s ease;"></div>
          <span style="font-size:11px; font-weight:600; color:var(--slate-400);">${m.month}</span>
        </div>`;
      }).join('')}
    </div>`;
}

function renderUtilChart(utilData) {
  const container = document.getElementById('util-chart');
  if (!container || !utilData) return;

  container.innerHTML = utilData.map(u => {
    let barColor = 'var(--primary)';
    if (u.utilization >= 80) barColor = 'var(--success)';
    else if (u.utilization >= 50) barColor = 'var(--warning)';
    else barColor = 'var(--danger)';
    return `
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px; padding:0 12px;">
      <span style="width:120px; font-size:12px; font-weight:600; color:var(--navy); text-align:right;">${u.car}</span>
      <div style="flex:1; background:var(--slate-100); border-radius:8px; height:24px; overflow:hidden;">
        <div style="height:100%; width:${u.utilization}%; background:${barColor}; border-radius:8px; transition:width 0.8s ease; display:flex; align-items:center; justify-content:flex-end; padding-right:8px;">
          <span style="font-size:10px; font-weight:700; color:white;">${u.utilization}%</span>
        </div>
      </div>
    </div>`;
  }).join('');
}

function populateSummaryCards(summary) {
  if (!summary) return;
  document.getElementById('rp-popular').textContent = summary.popular_car;
  document.getElementById('rp-busiest').textContent = summary.busiest_month;
  document.getElementById('rp-total-rev').textContent = 'RM ' + summary.total_revenue.toLocaleString();
}

function exportReport() {
  alert('Report export (PDF/CSV) - Feature will be available when backend is ready.');
}
