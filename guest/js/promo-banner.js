/**
 * WeDRIVE - Promo Banner Loader
 * shared/js/promo-banner.js
 *
 * Inject this into guest and customer pages.
 * Reads active banners from marketing data and injects a
 * dismissable banner strip into #promo-banner-strip.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'wedrive_dismissed_banners';

  function getDismissed() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }

  function dismiss(id) {
    const list = getDismissed();
    if (!list.includes(id)) list.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  async function loadBanners() {
    const strip = document.getElementById('promo-banner-strip');
    if (!strip) return;

    let banners = [];
    try {
      const data = await window.WeDriveAPI.getData();
      banners = (data.marketing && data.marketing.banners) || [];
    } catch (e) {
      return;
    }

    // Also check localStorage for admin-created banners
    try {
      const stored = JSON.parse(localStorage.getItem('wedrive_marketing') || '{}');
      if (stored.banners && stored.banners.length) banners = stored.banners;
    } catch {}

    const today = new Date().toISOString().slice(0, 10);
    const dismissed = getDismissed();

    const active = banners.filter(b =>
      b.active &&
      b.start_date <= today &&
      b.end_date >= today &&
      !dismissed.includes(b.id)
    );

    if (!active.length) { strip.style.display = 'none'; return; }

    // Inject CSS once
    if (!document.getElementById('promo-banner-css')) {
      const style = document.createElement('style');
      style.id = 'promo-banner-css';
      style.textContent = `
        .promo-strip {
          display: flex; align-items: center; justify-content: center; gap: 12px;
          padding: 12px 20px; color: #fff; font-size: 14px; font-weight: 500;
          position: relative; animation: slideDown .4s ease;
        }
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .promo-strip-icon { font-size: 20px; flex-shrink: 0; }
        .promo-strip-text { flex: 1; text-align: center; }
        .promo-strip-title { font-weight: 700; margin-bottom: 2px; }
        .promo-strip-msg { font-size: 13px; opacity: .9; }
        .promo-strip-dismiss {
          background: rgba(255,255,255,.2); border: none; color: #fff; cursor: pointer;
          border-radius: 50%; width: 28px; height: 28px; display: flex;
          align-items: center; justify-content: center; flex-shrink: 0;
          font-size: 18px; transition: background .2s;
        }
        .promo-strip-dismiss:hover { background: rgba(255,255,255,.35); }
        .promo-strip-code {
          background: rgba(255,255,255,.25); border-radius: 6px;
          padding: 2px 10px; font-family: monospace; font-weight: 700;
          font-size: 14px; letter-spacing: 1px; display: inline-block; margin-left: 6px;
        }
      `;
      document.head.appendChild(style);
    }

    // Show only the first active banner (most relevant)
    const b = active[0];
    const hasCode = b.message && b.message.match(/[A-Z0-9]{6,}/);
    const code = hasCode ? b.message.match(/\b[A-Z0-9]{6,}\b/) : null;

    const el = document.createElement('div');
    el.className = 'promo-strip';
    el.style.background = b.color || '#7c3aed';
    el.dataset.bannerId = b.id;
    el.innerHTML = `
      <span class="material-icons-round promo-strip-icon">local_offer</span>
      <div class="promo-strip-text">
        <div class="promo-strip-title">${b.title}</div>
        <div class="promo-strip-msg">${b.message}${code ? `<span class="promo-strip-code">${code[0]}</span>` : ''}</div>
      </div>
      <button class="promo-strip-dismiss" onclick="window.__dismissBanner('${b.id}', this)" aria-label="Dismiss">
        <span class="material-icons-round" style="font-size:18px">close</span>
      </button>
    `;
    strip.innerHTML = '';
    strip.appendChild(el);
  }

  window.__dismissBanner = function (id, btn) {
    dismiss(id);
    const strip = btn.closest('.promo-strip');
    if (strip) {
      strip.style.transition = 'opacity .3s, max-height .4s';
      strip.style.opacity = '0';
      strip.style.maxHeight = '0';
      strip.style.overflow = 'hidden';
      setTimeout(() => strip.remove(), 400);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadBanners);
  } else {
    loadBanners();
  }
})();
