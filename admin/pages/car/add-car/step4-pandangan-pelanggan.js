/**
 * WeDRIVE Admin Add Car - Step 4: Pandangan Pelanggan
 * admin/pages/car/add-car/step4-pandangan-pelanggan.js
 * 
 * Features:
 * - Real Data Pipeline (Hydrates customer card directly from draft/Supabase)
 * - Strict Zero Fake Data: Clean neutral placeholders when draft is empty
 * - Bilingual parity (EN/MS) & dynamic theme synchronization
 */

(function () {
  'use strict';

  function getLang() {
    return localStorage.getItem('wedrive_lang') || 'ms';
  }

  function setAiLabelButtonState(state) {
    const button = document.getElementById('btnGenerateAiCardLabel');
    const text = document.getElementById('step4AiLabelButtonText');
    if (!button || !text) return;

    const isEn = getLang() === 'en';
    button.disabled = state === 'loading';
    button.classList.toggle('opacity-60', state === 'loading');
    if (state === 'loading') {
      text.textContent = isEn ? 'Generating AI suggestion...' : 'AI sedang menjana...';
    } else if (state === 'success') {
      text.textContent = isEn ? 'Regenerate AI label' : 'Jana semula label AI';
    } else {
      text.textContent = isEn ? 'Generate AI suggestion' : 'Jana cadangan AI';
    }
  }

  function setAiLabelText(value) {
    const label = document.getElementById('cardEngine');
    if (label) label.textContent = value || '-';
  }

  async function generateAiCardLabel() {
    const isEn = getLang() === 'en';
    const raw = localStorage.getItem('wedrive_new_car_draft');
    const draft = raw ? JSON.parse(raw) : {};
    const vehicleName = [draft.year, draft.brand, draft.model, draft.variant].filter(Boolean).join(' ').trim();

    if (!vehicleName) {
      showStep4Toast(isEn ? 'Complete the vehicle details in Step 1 first.' : 'Lengkapkan maklumat kenderaan di Langkah 1 dahulu.');
      return false;
    }
    if (!window.WeDriveAiVault || typeof window.WeDriveAiVault.callAi !== 'function') {
      showStep4Toast(isEn ? 'The AI service is not available.' : 'Perkhidmatan AI tidak tersedia.');
      return false;
    }

    setAiLabelButtonState('loading');
    setAiLabelText(isEn ? 'Generating...' : 'Menjana...');

    try {
      if (typeof window.WeDriveAiVault.syncFromSupabase === 'function') {
        await window.WeDriveAiVault.syncFromSupabase();
      }
      if (typeof window.WeDriveAiVault.hasKey === 'function' && !window.WeDriveAiVault.hasKey('system_core')) {
        throw new Error(isEn ? 'System AI Slot 1 is not configured.' : 'Kunci AI Sistem Slot 1 belum ditetapkan.');
      }

      const systemPrompt = "You are WeDRIVE's vehicle merchandising assistant. Generate one honest, customer-facing recommendation label for the exact vehicle supplied. Use only the supplied facts. Do not invent specifications, prices, rankings, reviews, market research, or availability. Return only valid JSON.";
      const userPrompt = [
        'Vehicle facts:',
        'Name: ' + vehicleName,
        'Category: ' + (draft.category || '-'),
        'Year: ' + (draft.year || '-'),
        'Colour: ' + (draft.color || '-'),
        'Engine: ' + (draft.engine || '-'),
        'Fuel: ' + (draft.fuel || '-'),
        'Transmission: ' + (draft.transmission || '-'),
        'Seats: ' + (draft.seats || '-'),
        '',
        'Return exactly one JSON object with this key: {"ai_label":"..."}',
        'The ai_label must be a concise 2 to 5 word customer-facing phrase in ' + (isEn ? 'English' : 'Malay') + ', relevant to this vehicle.',
        'Do not include the words AI, best, newest, number-one, guaranteed, or unsupported claims.'
      ].join('\n');
      const response = await window.WeDriveAiVault.callAi('system_core', systemPrompt, userPrompt, {
        jsonMode: true,
        temperature: 0.3,
        maxTokens: 80
      });
      const match = String(response || '').match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : null;
      const label = parsed && typeof parsed.ai_label === 'string'
        ? parsed.ai_label.replace(/[\r\n]+/g, ' ').replace(/^['"“”]+|['"“”]+$/g, '').trim()
        : '';

      if (!label || label.split(/\s+/).length > 8 || label.length > 60) {
        throw new Error(isEn ? 'AI returned an invalid vehicle label.' : 'AI memberikan label kenderaan yang tidak sah.');
      }

      draft.ai_tagline = label;
      draft.ai_tagline_provider = typeof window.WeDriveAiVault.getProvider === 'function'
        ? ((window.WeDriveAiVault.getProvider('system_core') || {}).id || null)
        : null;
      draft.ai_tagline_generated_at = new Date().toISOString();
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));
      setAiLabelText(label);
      setAiLabelButtonState('success');
      showStep4Toast(isEn ? 'AI vehicle label generated and saved.' : 'Label kenderaan AI berjaya dijana dan disimpan.', 'success');
      return true;
    } catch (error) {
      console.error('[WeDRIVE Step 4] AI label generation error:', error);
      setAiLabelText(isEn ? 'AI label unavailable' : 'Label AI tiada');
      setAiLabelButtonState('idle');
      showStep4Toast(error.message || (isEn ? 'AI label generation failed.' : 'Janaan label AI gagal.'));
      return false;
    }
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
      const aiTagline = (draft && draft.ai_tagline) ? draft.ai_tagline : '';
      const fuel = (draft && draft.fuel) ? draft.fuel : '-';
      const transmission = (draft && draft.transmission) ? draft.transmission : '-';
      const seats = (draft && draft.seats) ? draft.seats : '-';
      const rawDaily = draft ? (draft.dailyPrice || draft.daily_rate || draft.price_per_day) : null;
      const dailyVal = rawDaily ? Number(rawDaily) : 0;
      const dailyRate = dailyVal > 0 ? `RM ${Math.round(dailyVal)}` : 'RM 0';
      const statusVal = (draft && draft.status) ? draft.status : 'available';
      const has360 = Boolean(draft && Array.isArray(draft.exterior_frames) && draft.exterior_frames.length > 0);

      const isEn = getLang() === 'en';

      // Identify this preview with the real vehicle plate from the current draft.
      const previewPlate = document.getElementById('step4PreviewPlate');
      const plate = draft && typeof draft.plate === 'string' ? draft.plate.trim() : '';
      if (previewPlate) {
        previewPlate.textContent = plate ? `${isEn ? 'Plate' : 'Plat'}: ${plate}` : '';
        previewPlate.classList.toggle('hidden', !plate);
      }

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
        cardEngine.textContent = aiTagline || (isEn ? 'AI label pending' : 'Label AI belum dijana');
      }
      setAiLabelButtonState(aiTagline ? 'success' : 'idle');

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
        const cloudinaryGallery = Array.isArray(draft.cloudinary_gallery) && draft.cloudinary_gallery.length > 0
          ? draft.cloudinary_gallery
          : (Array.isArray(draft.supabase_images) ? draft.supabase_images : []);
        const persistedGallery = cloudinaryGallery.filter(item => {
          const url = typeof item === 'string' ? item : (item && item.img);
          return typeof url === 'string' && url.includes('res.cloudinary.com/');
        });
        if (persistedGallery.length > 0) {
          const first = persistedGallery[0];
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
    const cloudinaryGallery = [
      ...(Array.isArray(draft.cloudinary_gallery) ? draft.cloudinary_gallery : []),
      ...(Array.isArray(draft.supabase_images) ? draft.supabase_images : []),
      ...(Array.isArray(draft.images) ? draft.images : [])
    ].filter(item => {
      const url = typeof item === 'string' ? item : (item && item.img);
      return typeof url === 'string' && url.includes('res.cloudinary.com/');
    });
    const hasCloudinary360 = Array.isArray(draft.exterior_frames) && draft.exterior_frames.length > 0;
    const hasCdnSource = Boolean(draft.cdnUrl || draft.cdnUrlExterior || draft.supabase_360);
    if (hasCdnSource && !hasCloudinary360 && cloudinaryGallery.length === 0) {
      if (e) e.preventDefault();
      showStep4Toast(isEn
        ? 'Save the visual assets to Cloudinary before continuing.'
        : 'Simpan aset visual ke Cloudinary dahulu sebelum meneruskan.');
      return false;
    }
    const hasPlate = Boolean(draft.plate && draft.plate.trim().length >= 3);
    const hasCloudinaryGallery = [
      ...(Array.isArray(draft.cloudinary_gallery) ? draft.cloudinary_gallery : []),
      ...(Array.isArray(draft.supabase_images) ? draft.supabase_images : []),
      ...(Array.isArray(draft.images) ? draft.images : [])
    ].some(url => typeof url === 'string' && url.includes('res.cloudinary.com/'));
    const hasVisual = Boolean(hasCloudinaryGallery || (Array.isArray(draft.exterior_frames) && draft.exterior_frames.length > 0));

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

    document.getElementById('btnGenerateAiCardLabel')?.addEventListener('click', generateAiCardLabel);

    // Generate the customer-facing label when the completed Step 4 opens.
    // The button remains available if the admin wants to regenerate it.
    const existingDraft = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
    if (!existingDraft.ai_tagline && (existingDraft.brand || existingDraft.model)) {
      generateAiCardLabel();
    }

    // Guard forward navigation to Step 5
    document.querySelector('a[href="step5_tempahan.html"]')?.addEventListener('click', validateStep4Forward);
    document.querySelectorAll('.wizard-stepper a[href*="step5"]').forEach(link => {
      link.addEventListener('click', validateStep4Forward);
    });

    window.addEventListener('wedrive:language-applied', () => {
      hydrateCustomerCard();
    });
    document.addEventListener('wedrive:language-applied', () => {
      hydrateCustomerCard();
    });
  }

  window.WeDriveStep4 = {
    hydrateCustomerCard: hydrateCustomerCard,
    validateStep4Forward: validateStep4Forward,
    generateAiCardLabel: generateAiCardLabel
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
