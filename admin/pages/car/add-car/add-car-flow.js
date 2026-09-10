/**
 * WeDRIVE Admin Add Car 5-Step Modular Flow
 * admin/pages/car/add/add-car-flow.js
 * 
 * Manages state persistence across modular steps:
 * Step 1: Spesifikasi & Harga (step1_spesifikasi.html)
 * Step 2: Studio Visual 360° (step2_studio360.html)
 * Step 3: Semakan Akhir Pentadbir (step3_pengesahan.html)
 * Step 4: Pandangan Pelanggan (step4_pandangan_pelanggan.html)
 * Step 5: Butiran & Tempahan Pelanggan (step5_tempahan.html)
 */

(function () {
  'use strict';

  const DRAFT_KEY = 'wedrive_new_car_draft';

  // State Management
  function getDraft() {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  async function syncDraftToSupabase(draft) {
    if (window.WeDriveAPI && typeof window.WeDriveAPI.saveCarDraft === 'function') {
      try {
        const res = await window.WeDriveAPI.saveCarDraft(draft);
        if (res && res.data && res.data.id) {
          try {
            const curRaw = localStorage.getItem(DRAFT_KEY);
            const cur = curRaw ? JSON.parse(curRaw) : {};
            cur.supabase_draft_id = res.data.id;
            localStorage.setItem(DRAFT_KEY, JSON.stringify(cur));
          } catch (_) {}
        }
        return res;
      } catch (err) {
        console.warn('[WeDRIVE Flow] Sync draft to Supabase warning:', err);
      }
    }
    return null;
  }

  function setDraft(data) {
    try {
      const current = getDraft();
      const updated = { ...current, ...data, updatedAt: Date.now() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
      syncDraftToSupabase(updated);
      return updated;
    } catch (e) {
      console.warn('[WeDRIVE] Draft save error:', e);
      return {};
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}
  }

  // Common Notification Toast
  function showPillToast(msg, type = 'success') {
    const existing = document.getElementById('wedrive-pill-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'wedrive-pill-toast';
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 pill-btn px-5 py-2.5 glass-panel border shadow-2xl flex items-center gap-3 transition-all duration-300 animate-bounce';
    
    const icon = type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info');
    const color = type === 'success' ? '#34C759' : (type === 'error' ? '#FF3B30' : '#0071E3');

    toast.innerHTML = `
      <span class="circle-1-1 w-6 h-6 text-white text-[14px]" style="background-color: ${color};">
        <span class="material-symbols-outlined text-[16px]">${icon}</span>
      </span>
      <span class="font-headline text-[13px] font-bold text-on-surface">${msg}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // Export globally
  window.WeDriveAddCar = {
    getDraft: getDraft,
    setDraft: setDraft,
    clearDraft: clearDraft,
    syncDraftToSupabase: syncDraftToSupabase,
    showToast: showPillToast,
    navigateTo: function (stepFile) {
      window.location.href = stepFile;
    }
  };

})();
