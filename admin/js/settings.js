/**
 * WeDRIVE - Settings Module JS (v5.8.0)
 * admin/js/settings.js
 */

window.WeDriveAPI.getAdminData()
  .then(function (data) {
    var settings = data.settings || {};
    if (data.settings) {
      localStorage.setItem('wedrive_global_settings', JSON.stringify(data.settings));
    }
    populateSettings(settings);
  })
  .catch(function (err) {
    console.error('Settings data load error:', err);
    var local = {};
    try { local = JSON.parse(localStorage.getItem('wedrive_global_settings') || '{}'); } catch (e) {}
    populateSettings(local);
  });

function populateSettings(s) {
  var fields = {
    'st-name': s.company_name || 'WeDRIVE Car Rental Malaysia',
    'st-email': s.company_email || 'support@wedrive.my',
    'st-phone': s.company_phone || '06-2345678',
    'st-address': s.company_address || 'Lot 123, Jalan Melaka Sentral, 75000 Melaka',
    'st-currency': s.currency || 'MYR',
    'st-tax': s.tax_rate !== undefined ? s.tax_rate : '0',
    'st-min-days': s.min_rental_days || '1',
    'st-max-days': s.max_rental_days || '30',
    'st-late-fee': s.late_fee_per_hour || '25',
    'st-deposit': s.deposit_percentage || '20',
    'st-hours': s.operating_hours || '8:00 AM - 10:00 PM (Setiap Hari)'
  };

  Object.keys(fields).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.value = fields[id];
  });
}

async function saveSettings() {
  var settings = {
    company_name: document.getElementById('st-name').value.trim(),
    company_email: document.getElementById('st-email').value.trim(),
    company_phone: document.getElementById('st-phone').value.trim(),
    company_address: document.getElementById('st-address').value.trim(),
    currency: document.getElementById('st-currency').value.trim() || 'MYR',
    tax_rate: Number(document.getElementById('st-tax').value) || 0,
    min_rental_days: Number(document.getElementById('st-min-days').value) || 1,
    max_rental_days: Number(document.getElementById('st-max-days').value) || 30,
    late_fee_per_hour: Number(document.getElementById('st-late-fee').value) || 25,
    deposit_percentage: Number(document.getElementById('st-deposit').value) || 20,
    operating_hours: document.getElementById('st-hours').value.trim()
  };

  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var sb = window.supabaseClient;
      var result = await sb.from('settings').upsert({ key: 'main', value: settings }, { onConflict: 'key' });
      if (result.error) throw result.error;
      localStorage.setItem('wedrive_global_settings', JSON.stringify(settings));
      showToast('Tetapan sistem berjaya disimpan ke pangkalan data!', 'success');
    } catch (err) {
      console.error('[WeDRIVE] Save settings error:', err);
      localStorage.setItem('wedrive_global_settings', JSON.stringify(settings));
      showToast('Tetapan disimpan secara lokal (Pangkalan data luar talian)', 'info');
    }
  } else {
    localStorage.setItem('wedrive_global_settings', JSON.stringify(settings));
    showToast('Tetapan sistem berjaya disimpan!', 'success');
  }
}

function showToast(msg, type) {
  var existing = document.querySelector('.toast-notify');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'toast-notify';
  var icon = type === 'success' ? 'check_circle' : 'info';
  var bg = type === 'success' ? '#059669' : '#0071E3';
  toast.style.cssText = 'position:fixed;bottom:30px;right:30px;background:' + bg + ';color:#fff;padding:14px 24px;border-radius:14px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px;z-index:9999;box-shadow:0 12px 32px rgba(0,0,0,0.4);animation:slideUp 0.3s ease';
  toast.innerHTML = '<span class="material-icons-round" style="font-size:18px">' + icon + '</span> ' + msg;
  document.body.appendChild(toast);
  setTimeout(function () { toast.remove(); }, 3200);
}
