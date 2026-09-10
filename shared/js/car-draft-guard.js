/*
 * WeDRIVE Add Car Draft Guard
 * Shows one recovery dialog for an unfinished car registration and provides a
 * deliberate destructive path for removing its Supabase + Cloudinary assets.
 */
(function () {
  'use strict';

  var DRAFT_KEY = 'wedrive_new_car_draft';
  var PROMPTED_KEY = 'wedrive_car_draft_prompted_session';
  var modal = null;
  var activeCandidate = null;
  var activeAfterDeleteHref = '';
  var adminBase = '';

  function readLocalDraft() {
    try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}'); } catch (_) { return {}; }
  }

  function isMeaningfulDraft(draft) {
    if (!draft || typeof draft !== 'object') return false;
    var frames = Array.isArray(draft.exterior_frames) && draft.exterior_frames.length;
    var gallery = (Array.isArray(draft.cloudinary_gallery) && draft.cloudinary_gallery.length) ||
      (Array.isArray(draft.images) && draft.images.length) ||
      (Array.isArray(draft.supabase_images) && draft.supabase_images.length);
    return Boolean(
      draft.supabase_draft_id || draft.plate || draft.model || draft.brand || draft.variant ||
      draft.year || draft.cloudinary_folder || frames || gallery || draft.dailyPrice ||
      draft.price || draft.has_360
    );
  }

  function rowToDraft(row) {
    var name = String(row.name || '').trim();
    var withoutYear = name.replace(/^\d{4}\s+/, '');
    var nameParts = withoutYear.split(/\s+/).filter(Boolean);
    var inferredBrand = nameParts.shift() || '';
    var inferredModel = nameParts.join(' ');
    var category = String(row.type || row.label || 'sedan');
    var frames = Array.isArray(row.exterior_frames) ? row.exterior_frames : [];
    return {
      supabase_draft_id: row.id,
      name: row.name || '',
      brand: row.brand || inferredBrand,
      model: row.model || inferredModel,
      variant: row.variant || '',
      plate: row.plate || '',
      category: category,
      year: row.year || '',
      color: row.color || '',
      fuel: row.fuel || '',
      transmission: row.transmission || '',
      seats: row.seats || '',
      engine: row.ai || '',
      dailyPrice: row.price || '',
      weeklyPrice: row.weekly_price || '',
      monthlyPrice: row.monthly_price || '',
      images: Array.isArray(row.images) ? row.images : [],
      exterior_frames: frames,
      cloudinary_exterior_frames: frames,
      cloudinary_gallery: Array.isArray(row.images) ? row.images : [],
      has_360: Boolean(row.has_360),
      exterior_360: row.exterior_360 || null,
      interior_360: row.interior_360 || null,
      updatedAt: Date.now(),
      _recoveredFromSupabase: true
    };
  }

  function saveDraft(draft) {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draft)); } catch (_) {}
  }

  function chooseMeaningfulCloudDraft(rows) {
    return (rows || []).find(function (row) {
      return isMeaningfulDraft({
        supabase_draft_id: row.id,
        name: row.name,
        plate: row.plate,
        year: row.year,
        price: row.price,
        weekly_price: row.weekly_price,
        monthly_price: row.monthly_price,
        images: row.images,
        exterior_frames: row.exterior_frames,
        has_360: row.has_360
      });
    }) || null;
  }

  async function findCandidate() {
    var local = readLocalDraft();
    if (isMeaningfulDraft(local)) return { draft: local, row: null, source: 'browser' };
    // Some wizard pages load the sidebar before the Supabase scripts. Give
    // them a short window to finish so a cloud-only draft is also recoverable.
    var attempts = 0;
    while ((!window.WeDriveAPI || typeof window.WeDriveAPI.getLatestCarDrafts !== 'function') && attempts < 10) {
      await new Promise(function (resolve) { setTimeout(resolve, 150); });
      attempts += 1;
    }
    if (!window.WeDriveAPI || typeof window.WeDriveAPI.getLatestCarDrafts !== 'function') return null;
    var result = await window.WeDriveAPI.getLatestCarDrafts(50);
    var row = result && !result.error ? chooseMeaningfulCloudDraft(result.data) : null;
    if (!row) return null;
    var recovered = rowToDraft(row);
    saveDraft(recovered);
    return { draft: recovered, row: row, source: 'supabase' };
  }

  function injectStyles() {
    if (document.getElementById('wedrive-draft-guard-style')) return;
    var style = document.createElement('style');
    style.id = 'wedrive-draft-guard-style';
    style.textContent = [
      '#wedrive-draft-guard{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(10,14,24,.42);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}',
      '#wedrive-draft-guard[hidden]{display:none}',
      '.wd-draft-dialog{width:min(100%,520px);border:1px solid rgba(255,255,255,.55);border-radius:28px;background:rgba(255,255,255,.94);box-shadow:0 24px 80px rgba(0,0,0,.22);padding:28px;color:#1d1d1f}',
      '.wd-draft-icon{width:52px;height:52px;border-radius:18px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0071e3,#8b5cf6);color:#fff;box-shadow:0 8px 22px rgba(0,113,227,.24)}',
      '.wd-draft-title{margin:18px 0 6px;font:800 24px/1.15 Inter,-apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:-.03em}',
      '.wd-draft-copy{margin:0;color:#6e6e73;font:500 14px/1.55 Inter,-apple-system,BlinkMacSystemFont,sans-serif}',
      '.wd-draft-name{margin:18px 0;padding:14px 16px;border-radius:16px;background:#f5f7fb;border:1px solid #e4e8f0;font:700 15px/1.35 Inter,-apple-system,BlinkMacSystemFont,sans-serif}',
      '.wd-draft-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:22px}',
      '.wd-draft-btn{min-height:46px;border:0;border-radius:999px;padding:11px 16px;cursor:pointer;font:700 14px Inter,-apple-system,BlinkMacSystemFont,sans-serif;transition:transform .18s ease,opacity .18s ease}',
      '.wd-draft-btn:active{transform:scale(.97)}',
      '.wd-draft-btn-primary{background:#0071e3;color:#fff;box-shadow:0 7px 18px rgba(0,113,227,.2)}',
      '.wd-draft-btn-muted{background:#eef1f6;color:#4a4a4f}',
      '.wd-draft-btn-danger{background:#ff3b30;color:#fff;box-shadow:0 7px 18px rgba(255,59,48,.18)}',
      '.wd-draft-btn-wide{grid-column:1/-1}',
      '.wd-draft-warning{padding:13px 14px;border-radius:14px;background:#fff1f0;color:#9b211b;border:1px solid #ffc7c2;font:600 13px/1.45 Inter,-apple-system,BlinkMacSystemFont,sans-serif}',
      '.wd-draft-loading{opacity:.68;pointer-events:none}',
      '@media (max-width:520px){.wd-draft-dialog{padding:22px;border-radius:22px}.wd-draft-actions{grid-template-columns:1fr}.wd-draft-btn-wide{grid-column:auto}}',
      'html.dark .wd-draft-dialog{background:rgba(28,28,30,.96);color:#f5f5f7;border-color:rgba(255,255,255,.12)}',
      'html.dark .wd-draft-name{background:#222225;border-color:#3a3a40;color:#f5f5f7}',
      'html.dark .wd-draft-btn-muted{background:#343438;color:#f5f5f7}'
    ].join('');
    document.head.appendChild(style);
  }

  function buildModal() {
    if (modal) return modal;
    injectStyles();
    modal = document.createElement('div');
    modal.id = 'wedrive-draft-guard';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = '<div class="wd-draft-dialog" role="document">' +
      '<div class="wd-draft-icon"><span class="material-icons-round" style="font-size:28px">restore</span></div>' +
      '<div id="wd-draft-content"></div>' +
      '</div>';
    document.body.appendChild(modal);
    return modal;
  }

  function continueTarget(draft) {
    var step = String(draft && draft.last_step || '').toLowerCase();
    if (/^step[1-5]$/.test(step)) return step.replace('step', 'step') + (step === 'step1' ? '_spesifikasi.html' : step === 'step2' ? '_studio360.html' : step === 'step3' ? '_pengesahan.html' : step === 'step4' ? '_pandangan_pelanggan.html' : '_tempahan.html');
    var hasVisual = (Array.isArray(draft && draft.exterior_frames) && draft.exterior_frames.length) ||
      (Array.isArray(draft && draft.cloudinary_gallery) && draft.cloudinary_gallery.length);
    return hasVisual ? 'step5_tempahan.html' : 'step2_studio360.html';
  }

  function navigateToContinue(draft) {
    var path = adminBase + 'admin/pages/car/add-car/' + continueTarget(draft);
    window.location.href = path;
  }

  function renderMain(candidate, afterDeleteHref) {
    activeCandidate = candidate;
    activeAfterDeleteHref = afterDeleteHref || '';
    var draft = candidate.draft || {};
    var name = draft.name || [draft.year, draft.brand, draft.model, draft.variant].filter(Boolean).join(' ') || 'Kenderaan baharu';
    var source = candidate.source === 'supabase' ? 'Draf dipulihkan daripada Supabase.' : 'Draf anda disimpan secara automatik.';
    var content = document.getElementById('wd-draft-content');
    content.innerHTML = '<h2 class="wd-draft-title">Draf kenderaan ditemui</h2>' +
      '<p class="wd-draft-copy">' + source + ' Anda mahu sambung pendaftaran ini?</p>' +
      '<div class="wd-draft-name">' + escapeHtml(name) + (draft.plate ? '<br><span style="font-weight:600;color:#6e6e73">Plat: ' + escapeHtml(draft.plate) + '</span>' : '') + '</div>' +
      '<div class="wd-draft-actions">' +
      '<button type="button" class="wd-draft-btn wd-draft-btn-primary" data-draft-action="continue">Sambung buat kereta</button>' +
      '<button type="button" class="wd-draft-btn wd-draft-btn-muted" data-draft-action="later">Nanti</button>' +
      '<button type="button" class="wd-draft-btn wd-draft-btn-danger wd-draft-btn-wide" data-draft-action="delete">Padam draft</button>' +
      '</div>';
    modal.hidden = false;
    content.querySelector('[data-draft-action="continue"]').onclick = function () { modal.hidden = true; navigateToContinue(draft); };
    content.querySelector('[data-draft-action="later"]').onclick = function () { modal.hidden = true; sessionStorage.setItem(PROMPTED_KEY, '1'); };
    content.querySelector('[data-draft-action="delete"]').onclick = renderDeleteConfirmation;
  }

  function renderDeleteConfirmation() {
    var content = document.getElementById('wd-draft-content');
    content.innerHTML = '<h2 class="wd-draft-title">Padam draf ini?</h2>' +
      '<div class="wd-draft-warning">Semua data draft akan dipadam daripada Supabase dan semua visual Cloudinary dalam folder kenderaan ini akan dipadam. Tindakan ini tidak boleh dibuat asal.</div>' +
      '<div class="wd-draft-actions">' +
      '<button type="button" class="wd-draft-btn wd-draft-btn-muted" data-draft-action="cancel-delete">Batal</button>' +
      '<button type="button" class="wd-draft-btn wd-draft-btn-danger" data-draft-action="confirm-delete">Ya, padam semua</button>' +
      '</div>';
    content.querySelector('[data-draft-action="cancel-delete"]').onclick = function () { renderMain(activeCandidate, activeAfterDeleteHref); };
    content.querySelector('[data-draft-action="confirm-delete"]').onclick = deleteActiveDraft;
  }

  async function deleteActiveDraft(event) {
    var button = event.currentTarget;
    button.classList.add('wd-draft-loading');
    button.textContent = 'Sedang memadam…';
    try {
      var draft = activeCandidate && activeCandidate.draft || {};
      if (window.WeDriveAPI && typeof window.WeDriveAPI.deleteCarDraft === 'function' && draft.supabase_draft_id) {
        var result = await window.WeDriveAPI.deleteCarDraft(draft.supabase_draft_id, draft);
        if (!result || result.success !== true) throw (result && result.error) || new Error('Gagal memadam draft.');
      }
      localStorage.removeItem(DRAFT_KEY);
      sessionStorage.removeItem(PROMPTED_KEY);
      modal.hidden = true;
      if (activeAfterDeleteHref) window.location.href = activeAfterDeleteHref;
      else if (window.WeDriveAddCar && typeof window.WeDriveAddCar.showToast === 'function') window.WeDriveAddCar.showToast('Draft dan visual Cloudinary telah dipadam.', 'success');
    } catch (error) {
      button.classList.remove('wd-draft-loading');
      button.textContent = 'Ya, padam semua';
      var content = document.getElementById('wd-draft-content');
      var message = error && error.message ? error.message : 'Gagal memadam draft. Sila cuba lagi.';
      content.insertAdjacentHTML('afterbegin', '<div class="wd-draft-warning" style="margin-bottom:12px">' + escapeHtml(message) + '</div>');
    }
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  async function openDraftDialog(force, afterDeleteHref) {
    var candidate = await findCandidate();
    if (!candidate) return false;
    buildModal();
    renderMain(candidate, afterDeleteHref);
    return true;
  }

  function attachAddCarIntercept() {
    document.querySelectorAll('a[data-page="car-add"]').forEach(function (link) {
      if (link.dataset.draftGuardAttached === '1') return;
      link.dataset.draftGuardAttached = '1';
      link.addEventListener('click', async function (event) {
        event.preventDefault();
        var target = link.href;
        var shown = await openDraftDialog(true, target);
        if (!shown) window.location.href = target;
      });
    });
  }

  function init(base) {
    adminBase = base || '';
    buildModal();
    attachAddCarIntercept();
    if (sessionStorage.getItem(PROMPTED_KEY) !== '1') {
      setTimeout(function () { openDraftDialog(false, ''); }, 200);
    }
  }

  window.WeDriveDraftGuard = {
    init: init,
    open: openDraftDialog,
    refreshAddCarLinks: attachAddCarIntercept
  };
})();
