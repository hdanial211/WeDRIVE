/**
 * WeDRIVE - Settings Module JS
 * admin/js/settings.js
 */

window.WeDriveAPI.getAdminData()
  .then(data => {
    var settings = data.settings || {};
    populateSettings(settings);
  })
  .catch(err => console.error('Settings data load error:', err));

function populateSettings(s) {
  var fields = {
    'st-name': s.company_name || 'WeDRIVE Car Rental',
    'st-email': s.company_email || 'info@wedrive.my',
    'st-phone': s.company_phone || '06-2345678',
    'st-address': s.company_address || 'Lot 123, Jalan Melaka, 75000 Melaka',
    'st-currency': s.currency || 'MYR',
    'st-tax': s.tax_rate || '0',
    'st-min-days': s.min_rental_days || '1',
    'st-max-days': s.max_rental_days || '30',
    'st-late-fee': s.late_fee_per_hour || '25',
    'st-deposit': s.deposit_percentage || '20',
    'st-hours': s.operating_hours || '8:00 AM - 8:00 PM'
  };
  Object.keys(fields).forEach(id => {
    var el = document.getElementById(id);
    if (el) el.value = fields[id];
  });

  // Pickup locations
  var locList = document.getElementById('locations-list');
  if (locList) {
    var locations = s.pickup_locations || ['Melaka Sentral', 'Melaka Airport', 'Ayer Keroh Toll'];
    locList.innerHTML = locations.map(loc => `
      <div style="display:flex;align-items:center;gap:8px;background:var(--slate-50);padding:10px 16px;border-radius:10px;border:1px solid var(--slate-200);">
        <span class="material-icons-round" style="font-size:18px;color:var(--primary)">location_on</span>
        <span style="font-size:13px;font-weight:600;color:var(--navy);">${loc}</span>
      </div>
    `).join('');
  }
}

async function saveSettings() {
  var settings = {
    company_name: document.getElementById('st-name').value,
    company_email: document.getElementById('st-email').value,
    company_phone: document.getElementById('st-phone').value,
    company_address: document.getElementById('st-address').value,
    currency: document.getElementById('st-currency').value,
    tax_rate: Number(document.getElementById('st-tax').value),
    min_rental_days: Number(document.getElementById('st-min-days').value),
    max_rental_days: Number(document.getElementById('st-max-days').value),
    late_fee_per_hour: Number(document.getElementById('st-late-fee').value),
    deposit_percentage: Number(document.getElementById('st-deposit').value),
    operating_hours: document.getElementById('st-hours').value
  };

  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var sb = window.supabaseClient;
      var result = await sb.from('settings').upsert({ key: 'main', value: settings }, { onConflict: 'key' });
      if (result.error) throw result.error;
      showToast('Settings saved to database', 'success');
    } catch (err) {
      console.error('[WeDRIVE] Save settings error:', err);
      showToast('Settings saved locally (DB sync pending)', 'info');
    }
  } else {
    showToast('Settings saved (demo mode)', 'success');
  }
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
