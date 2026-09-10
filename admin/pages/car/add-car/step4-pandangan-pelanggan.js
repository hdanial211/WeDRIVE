/**
 * WeDRIVE Admin Add Car - Step 4: Pandangan Pelanggan WYSIWYG
 * admin/pages/car/add-car/step4-pandangan-pelanggan.js
 * 
 * Features:
 * - Real Data Pipeline (Hydrates WYSIWYG card directly from draft/Supabase)
 * - Strict Zero Fake Data: Clean neutral placeholders when draft is empty
 * - Bilingual parity (EN/MS) & dynamic theme synchronization
 */

(function () {
  'use strict';

  function getLang() {
    return localStorage.getItem('wedrive_lang') || 'ms';
  }

  // Hydrate Customer Spotlight Card from real session draft / Supabase
  function hydrateCustomerCard() {
    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      const draft = raw ? JSON.parse(raw) : null;

      // Pure Real Data (Zero Hardcoded Dummy Fallback)
      const isDraftEmpty = !draft || (!draft.brand && !draft.model);

      const brand = (draft && draft.brand) ? draft.brand : '';
      const model = (draft && draft.model) ? draft.model : '';
      const variant = (draft && draft.variant) ? draft.variant : '';
      const year = (draft && draft.year) ? draft.year : '';
      const category = (draft && draft.category) ? draft.category : '-';
      const color = (draft && draft.color) ? draft.color : '-';
      const engine = (draft && draft.engine) ? draft.engine : '-';
      const fuel = (draft && draft.fuel) ? draft.fuel : '-';
      const transmission = (draft && draft.transmission) ? draft.transmission : '-';
      const seats = (draft && draft.seats) ? draft.seats : '-';
      const rawDaily = draft ? (draft.dailyPrice || draft.daily_rate || draft.price_per_day) : null;
      const dailyVal = rawDaily ? Number(rawDaily) : 0;
      const dailyRate = dailyVal > 0 ? `RM ${dailyVal.toFixed(2)}` : 'RM 0.00';
      const statusVal = (draft && draft.status) ? draft.status : 'available';
      const has360 = (draft && (draft.has360 || (draft.cdnUrl && draft.cdnUrl.trim().length > 0)));

      const isEn = getLang() === 'en';

      // Card Title
      const cardTitle = document.getElementById('cardTitle');
      if (cardTitle) {
        if (isDraftEmpty) {
          cardTitle.textContent = '-';
        } else {
          cardTitle.textContent = `${year} ${brand} ${model} ${variant}`.trim();
        }
      }

      // Card Category & Seats Header
      const cardCategory = document.getElementById('cardCategory');
      if (cardCategory) {
        cardCategory.textContent = category.toUpperCase();
      }

      const cardSeats = document.getElementById('cardSeats');
      if (cardSeats) {
        cardSeats.textContent = seats !== '-' ? `${seats} ${isEn ? 'SEATS' : 'TEMPAT DUDUK'}` : '-';
      }

      // Status Badge
      const cardStatus = document.getElementById('cardStatus');
      const cardStatusDot = document.getElementById('cardStatusDot');
      const cardStatusIcon = document.getElementById('cardStatusIcon');

      if (cardStatus) {
        if (statusVal === 'rented') {
          cardStatus.textContent = isEn ? 'Rented' : 'Disewa';
          if (cardStatusDot) {
            cardStatusDot.className = 'w-2 h-2 rounded-full bg-amber-500';
          }
          if (cardStatusIcon) {
            cardStatusIcon.textContent = 'schedule';
            cardStatusIcon.className = 'material-symbols-outlined text-[15px] text-amber-400';
          }
        } else {
          cardStatus.textContent = isEn ? 'Available' : 'Tersedia';
          if (cardStatusDot) {
            cardStatusDot.className = 'w-2 h-2 rounded-full bg-[#34C759] emerald-pulse';
          }
          if (cardStatusIcon) {
            cardStatusIcon.textContent = 'check';
            cardStatusIcon.className = 'material-symbols-outlined text-[15px] text-[#34C759]';
          }
        }
      }

      // Color Spec
      const cardColor = document.getElementById('cardColor');
      if (cardColor) {
        cardColor.textContent = color;
      }

      const cardColorDot = document.getElementById('cardColorDot');
      if (cardColorDot) {
        const c = color.toLowerCase();
        if (c.includes('black') || c.includes('hitam')) {
          cardColorDot.style.backgroundColor = '#1c1c1e';
        } else if (c.includes('red') || c.includes('merah')) {
          cardColorDot.style.backgroundColor = '#ff3b30';
        } else if (c.includes('blue') || c.includes('biru')) {
          cardColorDot.style.backgroundColor = '#0071e3';
        } else if (c.includes('grey') || c.includes('kelabu') || c.includes('silver')) {
          cardColorDot.style.backgroundColor = '#8e8e93';
        } else {
          cardColorDot.style.backgroundColor = '#ffffff';
        }
      }

      // 4 Key Pills in 2x2 Bento Spec Grid
      const cardEngine = document.getElementById('cardEngine');
      if (cardEngine) {
        if (engine === '-') {
          cardEngine.textContent = '-';
        } else {
          const eng = engine.trim();
          cardEngine.textContent = (eng.toLowerCase().startsWith('enjin') || eng.toLowerCase().startsWith('engine')) ? eng.toUpperCase() : `${isEn ? 'ENGINE' : 'ENJIN'} ${eng.toUpperCase()}`;
        }
      }

      const cardSeatsPill = document.getElementById('cardSeatsPill');
      if (cardSeatsPill) {
        cardSeatsPill.textContent = seats !== '-' ? `${seats} ${isEn ? 'Seats' : 'Tempat Duduk'}` : '-';
      }

      const cardFuel = document.getElementById('cardFuel');
      if (cardFuel) {
        cardFuel.textContent = fuel;
      }

      const cardTransmission = document.getElementById('cardTransmission');
      if (cardTransmission) {
        if (transmission === '-') {
          cardTransmission.textContent = '-';
        } else {
          cardTransmission.textContent = transmission.toLowerCase().includes('auto') ? (isEn ? 'Automatic' : 'Automatik') : transmission;
        }
      }

      const cardCategoryPill = document.getElementById('cardCategoryPill');
      if (cardCategoryPill) {
        cardCategoryPill.textContent = category;
      }

      const cardPrice = document.getElementById('cardPrice');
      if (cardPrice) {
        cardPrice.textContent = dailyRate;
      }

      const cardPlate = document.getElementById('cardPlate');
      if (cardPlate) {
        cardPlate.textContent = (draft && draft.plate) ? `${isEn ? 'Plate' : 'Plat'}: ${draft.plate}` : `${isEn ? 'Plate' : 'Plat'}: -`;
      }

      const cardVerified = document.getElementById('cardVerified');
      if (cardVerified) {
        cardVerified.textContent = isEn ? 'Available' : 'Tersedia';
      }

      let imageUrl = '';
      if (draft) {
        if (draft.image_url) {
          imageUrl = draft.image_url;
        } else if (Array.isArray(draft.supabase_images) && draft.supabase_images.length > 0) {
          const first = draft.supabase_images[0];
          imageUrl = typeof first === 'string' ? first : (first && first.img ? first.img : '');
        } else if (Array.isArray(draft.gallery8Photos) && draft.gallery8Photos.length > 0) {
          const first = draft.gallery8Photos[0];
          imageUrl = typeof first === 'string' ? first : (first && first.img ? first.img : '');
        } else if (Array.isArray(draft.photos) && draft.photos.length > 0) {
          const first = draft.photos[0];
          imageUrl = typeof first === 'string' ? first : (first && first.img ? first.img : '');
        }
      }

      const cardImage = document.getElementById('cardImage');
      const cardImageEmptyState = document.getElementById('cardImageEmptyState');
      if (cardImage) {
        if (imageUrl && imageUrl.trim().length > 0) {
          cardImage.src = imageUrl;
          cardImage.classList.remove('hidden');
          if (cardImageEmptyState) cardImageEmptyState.classList.add('hidden');
        } else {
          cardImage.src = '';
          cardImage.classList.add('hidden');
          if (cardImageEmptyState) cardImageEmptyState.classList.remove('hidden');
        }
      }

      // 360 Badge Visibility
      const cardBadge360 = document.getElementById('cardBadge360');
      if (cardBadge360) {
        if (has360) {
          cardBadge360.classList.remove('hidden');
        } else {
          cardBadge360.classList.add('hidden');
        }
      }

    } catch (err) {
      console.warn('[WeDRIVE] Draft hydration warning in Step 4:', err);
    }
  }

  function showStep4Toast(msg, type = 'error') {
    const existing = document.getElementById('step4-pill-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.id = 'step4-pill-toast';
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 pill-btn px-5 py-2.5 glass-panel border shadow-2xl flex items-center gap-3 transition-all duration-300';
    const color = (type === 'error') ? '#FF3B30' : '#34C759';
    const icon = (type === 'error') ? 'warning' : 'check_circle';
    toast.innerHTML = `
      <span class="circle-1-1 w-6 h-6 text-white text-[14px]" style="background-color: ${color};">
        <span class="material-symbols-outlined text-[16px]">${icon}</span>
      </span>
      <span class="font-headline text-[13px] font-bold text-on-surface">${msg}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function validateStep4Forward(e) {
    const isEn = getLang() === 'en';
    const raw = localStorage.getItem('wedrive_new_car_draft');
    const draft = raw ? JSON.parse(raw) : {};
    const hasPlate = Boolean(draft.plate && draft.plate.trim().length >= 3);
    const hasVisual = Boolean(
      (draft.images && draft.images.length > 0) ||
      (draft.gallery8Photos && draft.gallery8Photos.length > 0) ||
      (draft.photos && draft.photos.length > 0) ||
      (draft.image_url) ||
      draft.has360 || draft.cdnUrlExterior || draft.cdnUrl
    );

    if (!hasPlate) {
      if (e) e.preventDefault();
      showStep4Toast(isEn ? 'Plate number is missing. Please return to Step 1.' : 'Nombor plat tidak lengkap. Sila kembali ke Langkah 1.');
      return false;
    }
    if (!hasVisual) {
      if (e) e.preventDefault();
      showStep4Toast(isEn ? 'Vehicle image is missing. Please return to Step 2.' : 'Gambar kenderaan tiada. Sila kembali ke Langkah 2.');
      return false;
    }
    return true;
  }

  function init() {
    hydrateCustomerCard();

    // Guard forward navigation to Step 5
    document.querySelector('a[href="step5_tempahan.html"]')?.addEventListener('click', validateStep4Forward);
    document.querySelectorAll('.wizard-stepper a[href*="step5"]').forEach(link => {
      link.addEventListener('click', validateStep4Forward);
    });

    window.addEventListener('wedrive:language-applied', () => {
      hydrateCustomerCard();
    });
  }

  window.WeDriveStep4 = {
    hydrateCustomerCard: hydrateCustomerCard,
    validateStep4Forward: validateStep4Forward
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
