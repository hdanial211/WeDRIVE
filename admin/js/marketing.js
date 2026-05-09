/**
 * WeDRIVE - Marketing Admin Logic
 * admin/js/marketing.js
 */

'use strict';

let MKT = { banners: [], promo_codes: [], seasonal_pricing: [] };

// ── Init ──────────────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  try {
    MKT = await window.WeDriveAPI.getMarketing();
  } catch (e) {
    console.warn('Marketing: failed to load', e);
  }
  renderAll();
  updateStats();
});

// ── Tab Switching ─────────────────────────────────────────────────────────────
window.switchTab = function(tab) {
  document.querySelectorAll('.mkt-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.mkt-section').forEach(s => s.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.getElementById('section-' + tab).classList.add('active');
};

// ── Stats ─────────────────────────────────────────────────────────────────────
function updateStats() {
  const today = new Date().toISOString().slice(0, 10);
  document.getElementById('stat-active-banners').textContent =
    MKT.banners.filter(b => b.active).length;
  document.getElementById('stat-active-codes').textContent =
    MKT.promo_codes.filter(p => p.active && p.expiry >= today).length;
  document.getElementById('stat-total-uses').textContent =
    MKT.promo_codes.reduce((s, p) => s + (p.usage_count || 0), 0);
  document.getElementById('stat-active-seasons').textContent =
    MKT.seasonal_pricing.filter(s => s.active).length;
}

// ── Render All ────────────────────────────────────────────────────────────────
function renderAll() {
  renderBanners();
  renderPromos();
  renderSeasonal();
}

// ── BANNERS ───────────────────────────────────────────────────────────────────
function renderBanners() {
  const grid = document.getElementById('banners-grid');
  if (!MKT.banners.length) { grid.innerHTML = ''; return; }

  grid.innerHTML = MKT.banners.map((b, i) => {
    const today = new Date().toISOString().slice(0, 10);
    const expired = b.end_date < today;
    const statusClass = expired ? 'expired-badge' : (b.active ? 'active-badge' : 'inactive-badge');
    const statusText = expired ? 'Expired' : (b.active ? 'Active' : 'Inactive');

    return `
    <div class="mkt-card">
      <div class="banner-preview" style="background:${b.color}">
        <span class="material-icons-round">campaign</span>
        <div class="banner-preview-text">
          <div class="banner-preview-title">${b.title}</div>
          <div class="banner-preview-msg">${b.message}</div>
        </div>
      </div>
      <div class="mkt-card-header">
        <span class="mkt-badge ${statusClass}">
          <span class="material-icons-round" style="font-size:11px">${expired ? 'schedule' : (b.active ? 'check_circle' : 'pause_circle')}</span>
          ${statusText}
        </span>
        <div class="mkt-card-actions">
          <button onclick="editBanner(${i})" title="Edit">
            <span class="material-icons-round" style="font-size:18px">edit</span>
          </button>
          <button onclick="toggleBanner(${i})" title="${b.active ? 'Deactivate' : 'Activate'}">
            <span class="material-icons-round" style="font-size:18px">${b.active ? 'visibility_off' : 'visibility'}</span>
          </button>
          <button onclick="deleteBanner(${i})" title="Delete" style="color:#ef4444">
            <span class="material-icons-round" style="font-size:18px">delete</span>
          </button>
        </div>
      </div>
      <div class="mkt-detail">Date: <span>${b.start_date}</span> to <span>${b.end_date}</span></div>
    </div>`;
  }).join('');
}

window.editBanner = function(i) {
  const b = MKT.banners[i];
  document.getElementById('modal-banner-title').textContent = 'Edit Banner';
  document.getElementById('banner-edit-id').value = i;
  document.getElementById('banner-title').value = b.title;
  document.getElementById('banner-message').value = b.message;
  document.getElementById('banner-start').value = b.start_date;
  document.getElementById('banner-end').value = b.end_date;
  document.getElementById('banner-color').value = b.color;
  document.getElementById('banner-active').checked = b.active;
  openModal('banner');
};

window.toggleBanner = function(i) {
  MKT.banners[i].active = !MKT.banners[i].active;
  saveToStorage();
  renderBanners();
  updateStats();
  showToast(MKT.banners[i].active ? 'Banner activated' : 'Banner deactivated');
};

window.deleteBanner = function(i) {
  if (!confirm('Delete this banner?')) return;
  MKT.banners.splice(i, 1);
  saveToStorage();
  renderBanners();
  updateStats();
  showToast('Banner deleted');
};

window.saveBanner = function() {
  const idx = document.getElementById('banner-edit-id').value;
  const obj = {
    id: idx !== '' ? MKT.banners[idx].id : 'BN-' + Date.now(),
    title: document.getElementById('banner-title').value.trim(),
    message: document.getElementById('banner-message').value.trim(),
    color: document.getElementById('banner-color').value,
    start_date: document.getElementById('banner-start').value,
    end_date: document.getElementById('banner-end').value,
    active: document.getElementById('banner-active').checked
  };
  if (!obj.title || !obj.message) { alert('Please fill in title and message.'); return; }
  if (idx !== '') { MKT.banners[parseInt(idx)] = obj; } else { MKT.banners.push(obj); }
  saveToStorage();
  renderBanners();
  updateStats();
  closeModal('banner');
  showToast('Banner saved');
};

// ── PROMO CODES ───────────────────────────────────────────────────────────────
function renderPromos() {
  const grid = document.getElementById('promos-grid');
  if (!MKT.promo_codes.length) { grid.innerHTML = ''; return; }

  const today = new Date().toISOString().slice(0, 10);
  grid.innerHTML = MKT.promo_codes.map((p, i) => {
    const expired = p.expiry < today;
    const statusClass = expired ? 'expired-badge' : (p.active ? 'active-badge' : 'inactive-badge');
    const statusText = expired ? 'Expired' : (p.active ? 'Active' : 'Inactive');
    const usagePct = p.usage_limit ? Math.min(100, Math.round((p.usage_count / p.usage_limit) * 100)) : 0;
    const discountLabel = p.type === 'percent' ? `${p.value}% off` : `RM ${p.value} off`;

    return `
    <div class="mkt-card">
      <div class="promo-code-chip">${p.code}</div>
      <div class="mkt-card-header">
        <div>
          <div class="mkt-card-title">${discountLabel}</div>
          <div class="mkt-detail" style="margin-top:4px">${p.description}</div>
        </div>
        <div class="mkt-card-actions">
          <button onclick="editPromo(${i})"><span class="material-icons-round" style="font-size:18px">edit</span></button>
          <button onclick="togglePromo(${i})"><span class="material-icons-round" style="font-size:18px">${p.active ? 'visibility_off' : 'visibility'}</span></button>
          <button onclick="deletePromo(${i})" style="color:#ef4444"><span class="material-icons-round" style="font-size:18px">delete</span></button>
        </div>
      </div>
      <span class="mkt-badge ${statusClass}" style="margin-bottom:10px">
        <span class="material-icons-round" style="font-size:11px">${expired ? 'schedule' : (p.active ? 'check_circle' : 'pause_circle')}</span>
        ${statusText}
      </span>
      <div class="mkt-detail">Min: <span>${p.min_days} day(s)</span> &nbsp;|&nbsp; Expires: <span>${p.expiry}</span></div>
      <div class="mkt-detail">Used: <span>${p.usage_count} / ${p.usage_limit}</span></div>
      <div class="promo-usage-bar">
        <div class="promo-usage-fill" style="width:${usagePct}%"></div>
      </div>
    </div>`;
  }).join('');
}

window.editPromo = function(i) {
  const p = MKT.promo_codes[i];
  document.getElementById('modal-promo-title').textContent = 'Edit Promo Code';
  document.getElementById('promo-edit-id').value = i;
  document.getElementById('promo-code').value = p.code;
  document.getElementById('promo-desc').value = p.description;
  document.getElementById('promo-type').value = p.type;
  document.getElementById('promo-value').value = p.value;
  document.getElementById('promo-min-days').value = p.min_days;
  document.getElementById('promo-limit').value = p.usage_limit;
  document.getElementById('promo-expiry').value = p.expiry;
  document.getElementById('promo-active').checked = p.active;
  openModal('promo');
};

window.togglePromo = function(i) {
  MKT.promo_codes[i].active = !MKT.promo_codes[i].active;
  saveToStorage();
  renderPromos();
  updateStats();
  showToast(MKT.promo_codes[i].active ? 'Promo code activated' : 'Promo code deactivated');
};

window.deletePromo = function(i) {
  if (!confirm('Delete this promo code?')) return;
  MKT.promo_codes.splice(i, 1);
  saveToStorage();
  renderPromos();
  updateStats();
  showToast('Promo code deleted');
};

window.savePromo = function() {
  const idx = document.getElementById('promo-edit-id').value;
  const obj = {
    id: idx !== '' ? MKT.promo_codes[idx].id : 'PC-' + Date.now(),
    code: document.getElementById('promo-code').value.trim().toUpperCase(),
    description: document.getElementById('promo-desc').value.trim(),
    type: document.getElementById('promo-type').value,
    value: parseFloat(document.getElementById('promo-value').value),
    min_days: parseInt(document.getElementById('promo-min-days').value) || 1,
    usage_limit: parseInt(document.getElementById('promo-limit').value) || 100,
    usage_count: idx !== '' ? MKT.promo_codes[parseInt(idx)].usage_count : 0,
    active: document.getElementById('promo-active').checked,
    expiry: document.getElementById('promo-expiry').value
  };
  if (!obj.code || !obj.value) { alert('Please fill in code and discount value.'); return; }
  if (idx !== '') { MKT.promo_codes[parseInt(idx)] = obj; } else { MKT.promo_codes.push(obj); }
  saveToStorage();
  renderPromos();
  updateStats();
  closeModal('promo');
  showToast('Promo code saved');
};

// ── SEASONAL PRICING ──────────────────────────────────────────────────────────
function renderSeasonal() {
  const grid = document.getElementById('seasonal-grid');
  if (!MKT.seasonal_pricing.length) { grid.innerHTML = ''; return; }

  grid.innerHTML = MKT.seasonal_pricing.map((s, i) => {
    const isUp = s.direction === 'increase';
    const dirClass = isUp ? 'season-dir-up' : 'season-dir-down';
    const dirIcon = isUp ? 'trending_up' : 'trending_down';
    const dirLabel = isUp ? `+${s.adjustment_value}% surcharge` : `-${s.adjustment_value}% discount`;

    return `
    <div class="mkt-card">
      <div class="mkt-card-header">
        <div>
          <div class="mkt-card-title">${s.name}</div>
          <div class="mkt-detail" style="margin-top:4px">
            <span class="material-icons-round ${dirClass}" style="font-size:16px;vertical-align:middle">${dirIcon}</span>
            <span class="${dirClass}">${dirLabel}</span>
          </div>
        </div>
        <div class="mkt-card-actions">
          <button onclick="editSeasonal(${i})"><span class="material-icons-round" style="font-size:18px">edit</span></button>
          <button onclick="toggleSeasonal(${i})"><span class="material-icons-round" style="font-size:18px">${s.active ? 'visibility_off' : 'visibility'}</span></button>
          <button onclick="deleteSeasonal(${i})" style="color:#ef4444"><span class="material-icons-round" style="font-size:18px">delete</span></button>
        </div>
      </div>
      <span class="mkt-badge ${s.active ? 'active-badge' : 'inactive-badge'}" style="margin-bottom:10px">
        <span class="material-icons-round" style="font-size:11px">${s.active ? 'check_circle' : 'pause_circle'}</span>
        ${s.active ? 'Active' : 'Inactive'}
      </span>
      <div class="mkt-detail">Period: <span>${s.start_date}</span> to <span>${s.end_date}</span></div>
    </div>`;
  }).join('');
}

window.editSeasonal = function(i) {
  const s = MKT.seasonal_pricing[i];
  document.getElementById('modal-seasonal-title').textContent = 'Edit Seasonal Rate';
  document.getElementById('seasonal-edit-id').value = i;
  document.getElementById('seasonal-name').value = s.name;
  document.getElementById('seasonal-start').value = s.start_date;
  document.getElementById('seasonal-end').value = s.end_date;
  document.getElementById('seasonal-direction').value = s.direction;
  document.getElementById('seasonal-value').value = s.adjustment_value;
  document.getElementById('seasonal-active').checked = s.active;
  openModal('seasonal');
};

window.toggleSeasonal = function(i) {
  MKT.seasonal_pricing[i].active = !MKT.seasonal_pricing[i].active;
  saveToStorage();
  renderSeasonal();
  updateStats();
  showToast(MKT.seasonal_pricing[i].active ? 'Seasonal rate activated' : 'Seasonal rate deactivated');
};

window.deleteSeasonal = function(i) {
  if (!confirm('Delete this seasonal rate?')) return;
  MKT.seasonal_pricing.splice(i, 1);
  saveToStorage();
  renderSeasonal();
  updateStats();
  showToast('Seasonal rate deleted');
};

window.saveSeasonal = function() {
  const idx = document.getElementById('seasonal-edit-id').value;
  const obj = {
    id: idx !== '' ? MKT.seasonal_pricing[idx].id : 'SP-' + Date.now(),
    name: document.getElementById('seasonal-name').value.trim(),
    start_date: document.getElementById('seasonal-start').value,
    end_date: document.getElementById('seasonal-end').value,
    direction: document.getElementById('seasonal-direction').value,
    adjustment_type: 'percent',
    adjustment_value: parseFloat(document.getElementById('seasonal-value').value),
    active: document.getElementById('seasonal-active').checked
  };
  if (!obj.name || !obj.start_date || !obj.end_date || !obj.adjustment_value) {
    alert('Please fill in all fields.'); return;
  }
  if (idx !== '') { MKT.seasonal_pricing[parseInt(idx)] = obj; } else { MKT.seasonal_pricing.push(obj); }
  saveToStorage();
  renderSeasonal();
  updateStats();
  closeModal('seasonal');
  showToast('Seasonal rate saved');
};

// ── Modal ─────────────────────────────────────────────────────────────────────
window.openModal = function(type) {
  if (type === 'banner') document.getElementById('banner-edit-id').value = '';
  if (type === 'promo')  document.getElementById('promo-edit-id').value = '';
  if (type === 'seasonal') document.getElementById('seasonal-edit-id').value = '';
  document.getElementById('modal-' + type).classList.add('open');
};

window.closeModal = function(type) {
  document.getElementById('modal-' + type).classList.remove('open');
};

// Close modal clicking backdrop
document.querySelectorAll('.mkt-modal-overlay').forEach(el => {
  el.addEventListener('click', e => { if (e.target === el) el.classList.remove('open'); });
});

// ── Storage ───────────────────────────────────────────────────────────────────
function saveToStorage() {
  window.WeDriveAPI.saveMarketing(MKT).catch(e => console.warn('Save failed', e));
}

function loadFromStorage() {
  // Handled by WeDriveAPI.getMarketing() on init
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'flex';
  setTimeout(() => { t.style.display = 'none'; }, 2500);
}
