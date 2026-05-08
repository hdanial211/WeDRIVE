/**
 * WeDRIVE - Settings Module JS
 * admin/js/settings.js
 */

window.WeDriveAPI.getAdminData()
  .then(data => {
    const settings = data.settings || {};
    populateSettings(settings);
  })
  .catch(err => console.error('Settings data load error:', err));

function populateSettings(s) {
  document.getElementById('st-name').value = s.company_name || '';
  document.getElementById('st-email').value = s.company_email || '';
  document.getElementById('st-phone').value = s.company_phone || '';
  document.getElementById('st-address').value = s.company_address || '';
  document.getElementById('st-currency').value = s.currency || '';
  document.getElementById('st-tax').value = s.tax_rate || '';
  document.getElementById('st-min-days').value = s.min_rental_days || '';
  document.getElementById('st-max-days').value = s.max_rental_days || '';
  document.getElementById('st-late-fee').value = s.late_fee_per_hour || '';
  document.getElementById('st-deposit').value = s.deposit_percentage || '';
  document.getElementById('st-hours').value = s.operating_hours || '';

  // Pickup locations
  const locList = document.getElementById('locations-list');
  if (locList && s.pickup_locations) {
    locList.innerHTML = s.pickup_locations.map(loc => `
      <div style="display:flex;align-items:center;gap:8px;background:var(--slate-50);padding:10px 16px;border-radius:10px;border:1px solid var(--slate-200);">
        <span class="material-icons-round" style="font-size:18px;color:var(--primary)">location_on</span>
        <span style="font-size:13px;font-weight:600;color:var(--navy);">${loc}</span>
      </div>
    `).join('');
  }
}

function saveSettings() {
  // Collect values (for future backend sync)
  const settings = {
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
  console.log('Settings saved (local):', settings);
  alert('Settings saved successfully! (Data will sync with backend when ready)');
}
