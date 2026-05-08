/**
 * WeDRIVE - AI Insights Module JS
 * admin/js/ai-insights.js
 */

let allInsights = [];

window.WeDriveAPI.getAdminData()
  .then(data => {
    allInsights = data.ai_insights || [];
    renderInsights(allInsights);
  })
  .catch(err => console.error('AI Insights data load error:', err));

function renderInsights(insights) {
  const grid = document.getElementById('insights-grid');
  if (!grid) return;
  if (insights.length === 0) {
    grid.innerHTML = '<div class="card" style="padding:40px;text-align:center;color:#94A3B8;grid-column:1/-1">No insights available</div>';
    return;
  }
  grid.innerHTML = insights.map((ins, i) => {
    const iconMap = {
      demand: 'trending_up',
      maintenance: 'build',
      pricing: 'attach_money',
      fleet: 'directions_car',
      customer: 'person'
    };
    const colorMap = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    };
    const priorityLabel = { high: 'High', medium: 'Medium', low: 'Low' };
    const icon = iconMap[ins.type] || 'psychology';
    const pColor = colorMap[ins.priority] || '#94A3B8';

    return `
    <div class="card reveal-on-scroll" data-delay="${i * 80}" style="position:relative; overflow:hidden;">
      <div style="position:absolute; top:0; left:0; right:0; height:3px; background:${pColor};"></div>
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; padding-top:6px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:40px;height:40px;border-radius:10px;background:${pColor}15;display:flex;align-items:center;justify-content:center;">
            <span class="material-icons-round" style="color:${pColor};font-size:22px">${icon}</span>
          </div>
          <div>
            <div style="font-size:14px; font-weight:700; color:var(--navy);">${ins.title}</div>
            <div style="font-size:11px; color:var(--slate-400); text-transform:uppercase; font-weight:600;">${ins.type}</div>
          </div>
        </div>
        <span style="font-size:11px; font-weight:700; color:${pColor}; background:${pColor}15; padding:4px 10px; border-radius:20px;">${priorityLabel[ins.priority]}</span>
      </div>
      <p style="font-size:13px; color:var(--slate-600); line-height:1.6; margin-bottom:14px;">${ins.desc}</p>
      <div style="display:flex; align-items:center; justify-content:space-between;">
        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          ${ins.tags.map(t => `<span class="ai-tag" style="background:var(--slate-100); color:var(--navy);">${t}</span>`).join('')}
        </div>
        <div style="display:flex; align-items:center; gap:4px; font-size:11px; font-weight:600; color:var(--slate-400);">
          <span class="material-icons-round" style="font-size:14px">auto_awesome</span> ${ins.confidence}% confidence
        </div>
      </div>
    </div>`;
  }).join('');
}

function filterInsights(priority, btn) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  if (priority === 'all') {
    renderInsights(allInsights);
  } else {
    renderInsights(allInsights.filter(ins => ins.priority === priority));
  }
}
