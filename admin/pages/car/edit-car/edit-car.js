/**
 * WeDRIVE Admin Edit Car - State & API Synchronization Manager
 * admin/pages/car/edit-car/edit-car.js (v6.18.0)
 * 
 * Manages:
 * - Session draft lifecycle across Step 1 -> Step 2 -> Step 3
 * - Real Data Hydration from Supabase / WeDriveAPI by Vehicle ID
 * - Dynamic 360 View Auto-Detection (Zero Hardcoding)
 * - Atomic UPDATE on cars table in Supabase PostgreSQL
 */

(function (window) {
  'use strict';

  function getCarIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  function getStorageKey(id) {
    return 'wedrive_edit_car_' + id;
  }

  async function fetchCarById(carId) {
    if (!carId) return null;

    // 1. Try Supabase Client
    if (window.supabaseClient) {
      try {
        const { data, error } = await window.supabaseClient
          .from('cars')
          .select('*')
          .eq('id', carId)
          .single();
        if (!error && data) return data;
      } catch (e) {
        console.warn('[WeDRIVE EditCar] Supabase single fetch warning:', e);
      }
    }

    // 2. Try WeDriveAPI
    if (window.WeDriveAPI && typeof window.WeDriveAPI.getAdminData === 'function') {
      try {
        const data = await window.WeDriveAPI.getAdminData();
        const found = (data.car || []).find(c => String(c.id) === String(carId));
        if (found) return found;
      } catch (e) {
        console.warn('[WeDRIVE EditCar] WeDriveAPI fetch warning:', e);
      }
    }

    return null;
  }

  function resolveCarImg(img) {
    if (!img) return '../../../../shared/model/bezza.png';
    if (typeof img !== 'string') img = img.img || '';
    if (!img) return '../../../../shared/model/bezza.png';
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('data:') || img.startsWith('/')) {
      return img;
    }
    if (img.startsWith('../../../../shared/model/')) {
      return img;
    }
    if (img.startsWith('../../../shared/model/')) {
      return img.replace('../../../shared/model/', '../../../../shared/model/');
    }
    if (img.startsWith('shared/model/')) {
      return '../../../../' + img;
    }
    return '../../../../shared/model/' + img;
  }

  function normalizeCategory(cat) {
    if (!cat) return 'Sedan';
    const c = String(cat).trim().toLowerCase();
    if (c === 'truck' || c.includes('pickup')) return 'Truck';
    if (c === 'suv') return 'SUV';
    if (c === 'hatchback') return 'Hatchback';
    if (c === 'mpv') return 'MPV';
    if (c === 'coupe') return 'Coupe';
    if (c === 'van') return 'Van';
    if (c === 'sedan') return 'Sedan';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  function normalizeTransmission(trans) {
    if (!trans) return 'Automatic';
    const t = String(trans).trim().toLowerCase();
    if (t.includes('auto')) return 'Automatic';
    if (t.includes('man')) return 'Manual';
    return 'Automatic';
  }

  function normalizeFuel(fuel) {
    if (!fuel) return 'Petrol';
    const f = String(fuel).trim().toLowerCase();
    if (f.includes('diesel')) return 'Diesel';
    if (f.includes('hybrid')) return 'Hybrid';
    if (f.includes('elect') || f.includes('ev')) return 'Electric';
    return 'Petrol';
  }

  async function loadCarDraft(carId) {
    if (!carId) return null;
    const key = getStorageKey(carId);

    // Check existing in-progress session draft
    const existingRaw = sessionStorage.getItem(key);
    if (existingRaw) {
      try {
        const parsed = JSON.parse(existingRaw);
        if (parsed) {
          parsed.category = normalizeCategory(parsed.category);
          parsed.transmission = normalizeTransmission(parsed.transmission);
          parsed.fuel = normalizeFuel(parsed.fuel);
          if (parsed.image_url) parsed.image_url = resolveCarImg(parsed.image_url);
          if (Array.isArray(parsed.photos)) {
            parsed.photos = parsed.photos.map((p, idx) => {
              const raw = typeof p === 'string' ? p : (p.img || '');
              const title = (typeof p === 'object' && p.title) ? p.title : `Foto ${idx + 1}`;
              return { img: resolveCarImg(raw), raw: raw, title: title };
            });
          }
          if (Array.isArray(parsed.gallery8Photos)) {
            parsed.gallery8Photos = parsed.gallery8Photos.map((p, idx) => {
              const raw = typeof p === 'string' ? p : (p.img || '');
              const title = (typeof p === 'object' && p.title) ? p.title : `Foto ${idx + 1}`;
              return { img: resolveCarImg(raw), raw: raw, title: title };
            });
          }
          return parsed;
        }
      } catch (e) {
        console.warn('[WeDRIVE EditCar] Corrupt session draft, refetching:', e);
      }
    }

    // Otherwise, fetch from database and initialize draft
    const rawCar = await fetchCarById(carId);
    if (!rawCar) return null;

    const rawRate = rawCar.rate ? String(rawCar.rate).replace(/[^0-9.]/g, '') : (rawCar.price ? String(rawCar.price) : '150');
    const parsedRate = parseFloat(rawRate) || 150;
    const has360Initial = Boolean(rawCar.has_360 || rawCar.has360 || rawCar.exterior_360 || rawCar.supabase_360 || (Array.isArray(rawCar.exterior_frames) && rawCar.exterior_frames.length > 0));

    // Normalize photos
    let photosList = [];
    if (Array.isArray(rawCar.images) && rawCar.images.length > 0) {
      photosList = rawCar.images.map((item, idx) => {
        const raw = typeof item === 'string' ? item : (item.img || '');
        return { img: resolveCarImg(raw), raw: raw, title: (item && item.title) ? item.title : `Foto ${idx + 1}` };
      });
    } else if (rawCar.image_url) {
      photosList = [{ img: resolveCarImg(rawCar.image_url), raw: rawCar.image_url, title: 'Foto Utama' }];
    }

    const firstImg = photosList.length > 0 ? photosList[0].img : resolveCarImg('');

    const draft = {
      id: rawCar.id,
      name: rawCar.name || '',
      brand: rawCar.brand || extractBrandFromName(rawCar.name),
      model: rawCar.model || extractModelFromName(rawCar.name),
      variant: rawCar.variant || '',
      plate: rawCar.plate || '',
      year: parseInt(rawCar.year, 10) || new Date().getFullYear(),
      category: normalizeCategory(rawCar.type || rawCar.category || rawCar.label),
      color: rawCar.color || 'Putih',
      transmission: normalizeTransmission(rawCar.transmission),
      fuel: normalizeFuel(rawCar.fuel),
      engine: rawCar.engine || rawCar.ai || '2.0L Turbo',
      seats: parseInt(rawCar.seats, 10) || 5,
      dailyPrice: parsedRate,
      depositAmount: parseInt(rawCar.deposit, 10) || 200,
      status: rawCar.status || 'Available',
      has360: has360Initial,
      has_360: has360Initial,
      cdnUrlExterior: rawCar.exterior_360 || rawCar.supabase_360 || '',
      supabase_360: rawCar.exterior_360 || rawCar.supabase_360 || '',
      photos: photosList,
      gallery8Photos: photosList,
      image_url: firstImg,
      original: {
        name: rawCar.name,
        plate: rawCar.plate,
        price: parsedRate,
        status: rawCar.status,
        type: rawCar.type || rawCar.category,
        transmission: rawCar.transmission,
        fuel: rawCar.fuel,
        seats: rawCar.seats,
        has_360: has360Initial,
        images: rawCar.images || []
      }
    };

    saveCarDraft(carId, draft);
    return draft;
  }

  function saveCarDraft(carId, draft) {
    if (!carId || !draft) return;
    try {
      sessionStorage.setItem(getStorageKey(carId), JSON.stringify(draft));
    } catch (e) {
      console.warn('[WeDRIVE EditCar] Failed to save draft to sessionStorage:', e);
    }
  }

  function clearCarDraft(carId) {
    if (!carId) return;
    sessionStorage.removeItem(getStorageKey(carId));
  }

  function extractBrandFromName(name) {
    if (!name) return 'Proton';
    const brands = ['Honda', 'Toyota', 'BMW', 'Mercedes-Benz', 'Mercedes', 'Proton', 'Perodua', 'Ford', 'Nissan', 'Hyundai', 'Mazda', 'Volkswagen', 'Porsche', 'Tesla'];
    for (const b of brands) {
      if (name.toLowerCase().includes(b.toLowerCase())) return b;
    }
    return 'Proton';
  }

  function extractModelFromName(name) {
    if (!name) return '';
    const parts = name.split(/\s+/).filter(Boolean);
    // Remove year if first
    if (parts.length > 1 && /^\d{4}$/.test(parts[0])) {
      parts.shift();
    }
    // Remove brand
    if (parts.length > 1) {
      parts.shift();
    }
    return parts.slice(0, 2).join(' ');
  }

  async function updateCarRecord(carId, draft) {
    if (!carId || !draft) throw new Error('Car ID and draft data are required.');

    // 1. Validate Core Gatekeeper Fields
    const plate = String(draft.plate || '').trim().toUpperCase();
    if (!plate || plate.length < 3) {
      throw new Error('Nombor pendaftaran (plat) wajib diisi dengan format sah (sekurang-kurangnya 3 aksara).');
    }
    const name = String(draft.name || '').trim();
    if (!name) {
      throw new Error('Nama model kenderaan tidak boleh dibiarkan kosong.');
    }
    const price = parseFloat(draft.dailyPrice);
    if (isNaN(price) || price <= 0) {
      throw new Error('Kadar harian sewa wajib berupa nombor sah melebihi RM 0.');
    }

    const has360Final = Boolean(
      draft.has_360 || 
      draft.has360 || 
      (draft.cdnUrlExterior && String(draft.cdnUrlExterior).trim().length > 0) ||
      (draft.supabase_360 && String(draft.supabase_360).trim().length > 0)
    );

    function cleanImgForDb(src) {
      if (!src) return '';
      if (typeof src === 'object' && src.raw) return src.raw;
      if (typeof src === 'object' && src.img) src = src.img;
      if (typeof src !== 'string') return '';
      return src.replace('../../../../shared/model/', '').replace('../../../shared/model/', '');
    }

    // Normalize images array for DB
    const imageList = (Array.isArray(draft.gallery8Photos) && draft.gallery8Photos.length > 0)
      ? draft.gallery8Photos.map(cleanImgForDb).filter(Boolean)
      : (Array.isArray(draft.photos) ? draft.photos.map(cleanImgForDb).filter(Boolean) : []);

    const updatePayload = {
      name: name,
      plate: plate,
      year: parseInt(draft.year, 10) || new Date().getFullYear(),
      type: (draft.category || 'Sedan').toLowerCase(),
      label: draft.category || 'Sedan',
      transmission: (draft.transmission || '').toLowerCase().includes('auto') ? 'Auto' : 'Manual',
      trans: (draft.transmission || '').toLowerCase().includes('auto') ? 'Auto' : 'Manual',
      fuel: draft.fuel || 'Petrol',
      seats: parseInt(draft.seats, 10) || 5,
      color: draft.color || 'Putih',
      price: price,
      rate: `RM ${Math.round(price)}/day`,
      status: draft.status || 'Available',
      ai: draft.engine || '2.0L Standard',
      has_360: has360Final,
      exterior_360: has360Final ? (draft.cdnUrlExterior || draft.supabase_360 || null) : null,
      images: imageList.length > 0 ? imageList : [cleanImgForDb(draft.image_url) || 'Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-140.jpg']
    };

    // 2. Persist to Supabase PostgreSQL
    if (window.supabaseClient) {
      const targetId = isNaN(parseInt(carId, 10)) ? carId : parseInt(carId, 10);
      const { error } = await window.supabaseClient
        .from('cars')
        .update(updatePayload)
        .eq('id', targetId);
      if (error) {
        console.error('[WeDRIVE EditCar] Supabase error detail:', error);
        throw error;
      }
    }

    // 3. Update localStorage cache if used
    try {
      const localCars = JSON.parse(localStorage.getItem('wedrive_cars') || '[]');
      const updatedLocal = localCars.map(c => {
        if (String(c.id) === String(carId)) {
          return { ...c, ...updatePayload, id: carId };
        }
        return c;
      });
      localStorage.setItem('wedrive_cars', JSON.stringify(updatedLocal));
    } catch (e) {
      console.warn('[WeDRIVE EditCar] Local cache update warning:', e);
    }

    // 4. Clear edit draft
    clearCarDraft(carId);

    return { success: true, id: carId };
  }

  function showUnifiedPillToast(msg, type = 'success') {
    const existing = document.getElementById('wedrive-edit-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'wedrive-edit-toast';
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 pill-btn px-5 py-2.5 glass-panel border shadow-2xl flex items-center gap-3 transition-all duration-300';
    const isSuccess = (type === 'success');
    const color = isSuccess ? '#34C759' : '#FF3B30';
    const icon = isSuccess ? 'check_circle' : 'warning';

    toast.innerHTML = `
      <span class="circle-1-1 w-6 h-6 text-white text-[14px] flex items-center justify-center rounded-full" style="background-color: ${color};">
        <span class="material-symbols-outlined text-[16px]">${icon}</span>
      </span>
      <span class="text-[13px] font-semibold text-on-surface">${msg}</span>
    `;

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -10px)';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  window.WeDriveEditCar = {
    getCarIdFromUrl,
    loadCarDraft,
    saveCarDraft,
    clearCarDraft,
    updateCarRecord,
    showUnifiedPillToast,
    resolveCarImg
  };

})(window);
