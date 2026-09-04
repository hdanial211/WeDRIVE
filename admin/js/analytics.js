/**
 * WeDRIVE - AI Data Analysis Controller
 * admin/js/analytics.js
 */

(function () {
  'use strict';

  var currentHorizon = '7d';

  var DEMAND_DATA = {
    '7d': [
      { day: 'Isn', projected: 4, capacity: 8, surge: false },
      { day: 'Sel', projected: 5, capacity: 8, surge: false },
      { day: 'Rab', projected: 5, capacity: 8, surge: false },
      { day: 'Kha', projected: 6, capacity: 8, surge: false },
      { day: 'Jum', projected: 8, capacity: 8, surge: true },
      { day: 'Sab', projected: 8, capacity: 8, surge: true },
      { day: 'Aha', projected: 7, capacity: 8, surge: true }
    ],
    '30d': [
      { day: 'M1', projected: 32, capacity: 56, surge: false },
      { day: 'M2', projected: 45, capacity: 56, surge: true },
      { day: 'M3', projected: 38, capacity: 56, surge: false },
      { day: 'M4', projected: 52, capacity: 56, surge: true }
    ],
    'peak': [
      { day: 'Hari 1', projected: 8, capacity: 8, surge: true },
      { day: 'Hari 2', projected: 8, capacity: 8, surge: true },
      { day: 'Hari 3', projected: 8, capacity: 8, surge: true },
      { day: 'Hari 4', projected: 8, capacity: 8, surge: true }
    ]
  };

  var MAINTENANCE_VEHICLES = [
    { name: 'Toyota Alphard 2.5', plate: 'MDD 8899', wear: '92%', nextService: '1,840 km', status: 'Optimum', color: 'green' },
    { name: 'Proton X70 1.5 TGDi', plate: 'MCA 4567', wear: '72%', nextService: '350 km (Minyak)', status: 'Servis Segera', color: 'amber' },
    { name: 'Mercedes-Benz GLA250', plate: 'MCL 9988', wear: '88%', nextService: '1,200 km', status: 'Optimum', color: 'green' },
    { name: 'Honda City 1.5V', plate: 'MBB 2345', wear: '76%', nextService: '600 km (Tayar)', status: 'Perhatian', color: 'amber' },
    { name: 'BMW 320i M Sport', plate: 'MCV 1122', wear: '98%', nextService: '3,400 km', status: 'Cemerlang', color: 'green' },
    { name: 'Perodua Myvi 1.5 H', plate: 'MCX 7890', wear: '91%', nextService: '2,100 km', status: 'Optimum', color: 'green' }
  ];

  function renderDemandChart(horizon) {
    var container = document.getElementById('ai-demand-chart');
    if (!container) return;

    var data = DEMAND_DATA[horizon] || DEMAND_DATA['7d'];
    var maxVal = Math.max.apply(Math, data.map(function(d) { return d.capacity; }));

    container.innerHTML = [
      '<div style="display:flex; align-items:flex-end; gap:16px; height:180px; padding: 10px 12px 0;">',
      data.map(function (item) {
        var pctProjected = (item.projected / maxVal) * 100;
        var barColor = item.surge ? 'linear-gradient(180deg, #FF9500 0%, #0071E3 100%)' : 'var(--primary, #0071E3)';
        return [
          '<div style="flex:1; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:6px;">',
          '  <span style="font-size:11px; font-weight:700; color:' + (item.surge ? '#FF9500' : 'var(--text-primary)') + ';" class="font-tabular">' + item.projected + ' unit</span>',
          '  <div style="flex:1; width:100%; display:flex; align-items:flex-end; background:rgba(0,0,0,0.04); border-radius:8px; overflow:hidden;">',
          '    <div style="width:100%; background:' + barColor + '; border-radius:8px 8px 3px 3px; height:' + pctProjected + '%; min-height:8px; transition:height 0.5s cubic-bezier(0.16, 1, 0.3, 1);"></div>',
          '  </div>',
          '  <span style="font-size:11px; font-weight:600; color:var(--text-muted);">' + item.day + '</span>',
          '</div>'
        ].join('\n');
      }).join(''),
      '</div>'
    ].join('\n');
  }

  function renderMaintenanceTable() {
    var tbody = document.getElementById('maintenance-tbody');
    if (!tbody) return;

    tbody.innerHTML = MAINTENANCE_VEHICLES.map(function (car) {
      var badgeClass = car.color === 'green' ? 'badge-green' : 'badge-amber';
      return [
        '<tr>',
        '  <td>',
        '    <div class="fw-700 fs-13 text-primary-heading">' + car.name + '</div>',
        '    <div class="fs-11 text-muted font-tabular">' + car.plate + '</div>',
        '  </td>',
        '  <td>',
        '    <div class="font-tabular fw-700 fs-13">' + car.wear + '</div>',
        '    <div class="progress-bar-subtle" style="background:rgba(0,0,0,0.06);height:5px;border-radius:9999px;width:70px;margin-top:4px;">',
        '      <div style="background:' + (car.color === 'green' ? '#34C759' : '#FF9500') + ';height:100%;width:' + car.wear + ';border-radius:9999px;"></div>',
        '    </div>',
        '  </td>',
        '  <td class="font-tabular fs-13">' + car.nextService + '</td>',
        '  <td><span class="badge ' + badgeClass + ' fs-11">' + car.status + '</span></td>',
        '</tr>'
      ].join('\n');
    }).join('\n');
  }

  window.switchHorizon = function (horizon) {
    currentHorizon = horizon;
    document.querySelectorAll('#time-glider .segmented-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-horizon') === horizon);
    });

    // Update KPI metrics slightly based on horizon
    var surgeEl = document.getElementById('ai-surge');
    var upliftEl = document.getElementById('ai-uplift');
    var alertPill = document.getElementById('surge-alert-pill');

    if (horizon === '7d') {
      if (surgeEl) surgeEl.textContent = '+34%';
      if (upliftEl) upliftEl.textContent = 'RM 4,820';
      if (alertPill) alertPill.innerHTML = '<span class="material-icons-round fs-14">warning</span> <span>Puncak: Jumaat - Ahad</span>';
    } else if (horizon === '30d') {
      if (surgeEl) surgeEl.textContent = '+26%';
      if (upliftEl) upliftEl.textContent = 'RM 18,450';
      if (alertPill) alertPill.innerHTML = '<span class="material-icons-round fs-14">trending_up</span> <span>Lonjakan M2 & M4</span>';
    } else if (horizon === 'peak') {
      if (surgeEl) surgeEl.textContent = '+48%';
      if (upliftEl) upliftEl.textContent = 'RM 9,600';
      if (alertPill) alertPill.innerHTML = '<span class="material-icons-round fs-14">bolt</span> <span>100% Kapasiti Penuh</span>';
    }

    renderDemandChart(horizon);
  };

  window.rerunAIModel = function () {
    var btn = document.getElementById('btn-rerun-ai');
    if (!btn) return;

    var originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons-round fs-18 spin">refresh</span> <span>Menjana Model...</span>';

    setTimeout(function () {
      btn.disabled = false;
      btn.innerHTML = originalHtml;
      // Show toast
      if (typeof window.showToast === 'function') {
        window.showToast('Model AI WeDRIVE berjaya dikemas kini!', 'success');
      } else {
        alert('Model AI WeDRIVE berjaya dikemas kini!');
      }
      renderDemandChart(currentHorizon);
    }, 800);
  };

  function init() {
    renderDemandChart('7d');
    renderMaintenanceTable();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
