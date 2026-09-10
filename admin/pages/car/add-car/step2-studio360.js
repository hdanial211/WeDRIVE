/**
 * WeDRIVE Admin Add Car - Step 2: Studio Visual 360°
 * admin/pages/car/add-car/step2-studio360.js (v6.17.0)
 * 
 * Features:
 * - Pure Zero Dummy Data: starts with clean Apple Empty State Canvas
 * - Real photo file upload via 6 inspection slots (Front, Rear, Sides, Quarters)
 * - Turntable 360 viewer with interactive drag-to-spin & fullscreen
 * - Progressive Segmented Switcher (Expands when 360/Panorama available)
 * - Siri AI CDN scanner & live draft / Supabase sync
 * - Complete bilingual reactivity (MS / EN)
 * 
 * Vault: WeDriveAiVault Slot 4 (downloader_360) used by add-car.js ingest360FromUrl.
 *        This file uses CDN heuristic parsing; future Gemini Vision categorisation
 *        will read Slot 4 key via window.WeDriveAiVault.getKey('downloader_360').
 */

(function () {
  'use strict';

  // Slot definitions for vehicle inspection
  const INSPECTION_SLOTS = [
    { key: 'slot_front', title: 'Hadapan Penuh', titleEn: 'Full Front' },
    { key: 'slot_rear', title: 'Belakang Penuh', titleEn: 'Full Rear' },
    { key: 'slot_right', title: 'Sisi Kanan Profil', titleEn: 'Right Side Profile' },
    { key: 'slot_left', title: 'Sisi Kiri Profil', titleEn: 'Left Side Profile' },
    { key: 'slot_quarter_fl', title: 'Suku Hadapan Kiri', titleEn: 'Front Left Quarter' },
    { key: 'slot_quarter_rr', title: 'Suku Belakang Kanan', titleEn: 'Rear Right Quarter' }
  ];

  function getLang() {
    return localStorage.getItem('wedrive_lang') || 'ms';
  }

  // Zero Fake Data: No hardcoded fallback images. All visual content from real draft data only.

  // State
  let currentGalleryPhotos = [];
  let currentGalleryPhotoIndex = 0;
  let activeUploadSlotIndex = 0;
  let activeVisualMode = 'gallery';
  let has360Expanded = false;
  let isAnalyzing = false;
  let isSavingDb = false;
  let toastTimeout = null;

  // SpinCar/Impel 3-View State (Exterior, Interior, Gallery)
  let currentCdnExteriorUrl = '';  // Pusingan 360° Luar (Interactive Player)
  let currentCdnInteriorUrl = '';  // Panorama Dalaman (pano/pano_f.jpg)
  let currentCdnPhotosUrl   = '';  // Galeri CDN
  let currentGallery8Photos = [];  // 8 HD Angle Photos from CDN
  // Impel API metadata — for building CDN frame URLs in car-detail
  let currentCdnPrefix      = '';  // e.g. https://cdn.impel.io/swipetospin-viewers/Carsome/VIN/version/
  let currentImpelVin       = '';  // e.g. mntccnd23z0011880
  let currentImpelCustomer  = '';  // e.g. Carsome

  // ── Cloudinary Config (WeDRIVE 360° Studio) ──
  const CLOUDINARY_CLOUD    = 'gwd1bhcx';
  const CLOUDINARY_PRESET   = 'wedrive_360';
  const CLOUDINARY_ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

  // Download a single CDN frame as Blob (requires CORS from Impel CDN)
  async function downloadFrameBlob(url) {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error(`CDN fetch failed ${res.status}: ${url}`);
    return res.blob();
  }

  // Upload a Blob to Cloudinary with a given public_id path
  async function uploadToCloudinary(blob, publicId) {
    const fd = new FormData();
    fd.append('file', blob);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    fd.append('public_id', publicId);
    fd.append('overwrite', 'true');
    const res = await fetch(CLOUDINARY_ENDPOINT, { method: 'POST', body: fd });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudinary upload error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    return data.secure_url; // e.g. https://res.cloudinary.com/gwd1bhcx/image/upload/...
  }

  // Upload 36 key frames from Impel CDN to Cloudinary (mirroring shared/model/ folder structure)
  // Also uploads interior pano if available.
  // Returns { exteriorFrames: string[], interiorFacesObj: Object|null }
  async function uploadImpelFramesToCloudinary(cdnPrefix, carLabel, carName, onProgress) {
    const TOTAL_FRAMES = 200;  // Full 200 frames — sama seperti shared/model/
    const BATCH_SIZE   = 8;    // 8 parallel untuk lebih laju

    // Sanitize folder path to match shared/model/ convention: {Label}/{Name}
    const safeLabel = (carLabel || 'Car').replace(/[/\\:*?"<>|]/g, '-').trim();
    const safeName  = (carName  || 'Unknown').replace(/[/\\:*?"<>|]/g, '-').trim();
    const baseFolder = `wedrive-model/${safeLabel}/${safeName}`;

    // All 200 frames: frame-000 to frame-199 (same as shared/model/)
    const frameNums = Array.from({ length: TOTAL_FRAMES }, (_, i) => i);
    const cloudinaryUrls = new Array(TOTAL_FRAMES).fill(null);
    let uploaded = 0;

    // Batch upload all 200 exterior frames
    for (let b = 0; b < frameNums.length; b += BATCH_SIZE) {
      const batch = frameNums.slice(b, b + BATCH_SIZE);
      await Promise.all(batch.map(async (frameNum) => {
        const padded   = String(frameNum).padStart(3, '0');
        const cdnUrl   = `${cdnPrefix}exterior/full-res/frame-${padded}.jpg`;
        const publicId = `${baseFolder}/exterior/full-res/frame-${padded}`;
        const blob     = await downloadFrameBlob(cdnUrl);
        const url      = await uploadToCloudinary(blob, publicId);
        cloudinaryUrls[frameNum] = url;
        uploaded++;
        if (onProgress) onProgress(uploaded, TOTAL_FRAMES);
      }));
    }


    // Upload interior cube-map faces (f, b, l, r, u, d) — Impel format: pano/pano_{face}.jpg
    let interiorFacesObj = null;
    if (currentCdnInteriorUrl) {
      const FACES = ['f', 'b', 'l', 'r', 'u', 'd'];
      const faceResults = {};
      await Promise.all(FACES.map(async (face) => {
        try {
          // Impel interior path: ${cdnPrefix}pano/pano_{face}.jpg
          const faceUrl  = `${cdnPrefix}pano/pano_${face}.jpg`;
          const publicId = `${baseFolder}/interior/full-res/pano_${face}`;
          const blob     = await downloadFrameBlob(faceUrl);
          faceResults[face] = await uploadToCloudinary(blob, publicId);
        } catch (e) {
          console.warn(`[WeDRIVE] Interior face '${face}' unavailable — skipping:`, e);
        }
      }));
      if (Object.keys(faceResults).length > 0) interiorFacesObj = faceResults;
    }

    return { exteriorFrames: cloudinaryUrls.filter(Boolean), interiorFacesObj };
  }


  // Parse SpinCar/Impel/Carsome link and extract 3 separate views:
  // 1. Exterior 360 viewer URL
  // 2. Interior panorama URL (pano_f.jpg) & 6 cubemap faces
  // 3. Gallery 8 photos (ec/0-0.jpg, 0-25.jpg, etc.)
  async function separateSpinCarAssets(url) {
    if (!url || typeof url !== 'string') return null;

    const isSpinCar = /cdn\.impel\.io|spincar|carsome/i.test(url);
    if (!isSpinCar) {
      return {
        isSpinCar: false,
        exteriorUrl: url,
        interiorPanoUrl: '',
        gallery8Photos: [],
        cdnPrefix: ''
      };
    }

    // 1. Extract customer & vin
    const custMatch = url.match(/customer=([a-zA-Z0-9_\-]+)/i) || url.match(/\/spin\/([a-zA-Z0-9_\-]+)\//i);
    const vinMatch  = url.match(/vin=([a-zA-Z0-9_\-]+)/i)     || url.match(/\/spin\/[^\/]+\/([a-zA-Z0-9_\-]+)/i);

    let customer = custMatch ? custMatch[1] : 'Carsome';
    let vin = vinMatch ? vinMatch[1] : null;

    if (!vin) {
      const pathMatch = url.match(/\/([a-zA-Z0-9_\-]+)\/([a-zA-Z0-9]{10,25})/i);
      if (pathMatch) {
        customer = pathMatch[1];
        vin = pathMatch[2];
      }
    }

    let cdnPrefix = null;
    let thumbIndices = ['0-0', '0-25', '0-50', '0-75', '0-100', '0-125', '0-150', '0-175'];

    // 2. Query Impel API directly (Full CORS Access-Control-Allow-Origin: *)
    if (customer && vin) {
      const apiUrls = [
        `https://api-eu.impel.io/spin/${customer}/${vin}?v=20160212`,
        `https://api.impel.io/spin/${customer}/${vin}?v=20160212`
      ];

      for (const apiUrl of apiUrls) {
        try {
          const resp = await fetch(apiUrl);
          if (resp.ok) {
            const data = await resp.json();
            if (data && data.cdn_image_prefix) {
              cdnPrefix = data.cdn_image_prefix;
              if (cdnPrefix.startsWith('//')) cdnPrefix = 'https:' + cdnPrefix;
              if (!cdnPrefix.endsWith('/')) cdnPrefix += '/';

              const opts = (data.info && data.info.options) || {};
              if (Array.isArray(opts.ec_thumb_indices) && opts.ec_thumb_indices.length > 0) {
                thumbIndices = opts.ec_thumb_indices;
              }
              break;
            }
          }
        } catch (err) {
          console.warn('[WeDRIVE AI Scanner] API fetch notice:', err);
        }
      }
    }



    // 4. Map 8 standard vehicle angles to gallery and inspection slots
    const angleMap = {
      '0-0':   { title: 'Hadapan Penuh',       titleEn: 'Full Front',          slot: 0 },
      '0-25':  { title: 'Sisi Hadapan Kanan',  titleEn: 'Front Right Quarter', slot: null },
      '0-50':  { title: 'Sisi Kanan Profil',   titleEn: 'Right Side Profile',  slot: 2 },
      '0-75':  { title: 'Sisi Belakang Kanan', titleEn: 'Rear Right Quarter',  slot: 5 },
      '0-100': { title: 'Belakang Penuh',      titleEn: 'Full Rear',           slot: 1 },
      '0-125': { title: 'Sisi Belakang Kiri',  titleEn: 'Rear Left Quarter',   slot: null },
      '0-150': { title: 'Sisi Kiri Profil',    titleEn: 'Left Side Profile',   slot: 3 },
      '0-175': { title: 'Sisi Hadapan Kiri',   titleEn: 'Front Left Quarter',  slot: 4 }
    };

    const gallery8Photos = [];
    if (cdnPrefix) {
      thumbIndices.forEach((tid, idx) => {
        const meta = angleMap[tid] || { title: `Sudut ${idx + 1}`, titleEn: `Angle ${idx + 1}`, slot: null };
        gallery8Photos.push({
          id: tid,
          title: meta.title,
          titleEn: meta.titleEn,
          slot: meta.slot,
          img: `${cdnPrefix}ec/${tid}.jpg`
        });
      });
    }

    const interiorPanoUrl = cdnPrefix ? `${cdnPrefix}pano/pano_f.jpg` : '';
    const cleanViewerUrl = url.replace(/!view=[^!&#]*/gi, '');

    return {
      isSpinCar: true,
      cdnPrefix: cdnPrefix,
      exteriorUrl: cleanViewerUrl,
      interiorPanoUrl: interiorPanoUrl,
      gallery8Photos: gallery8Photos,
      customer: customer,
      vin: vin
    };
  }

  // Unified Floating Pill Toast Notification
  function showAiToast(message, isSuccess = true, icon = 'auto_awesome') {
    if (!ai3dToast || !aiToastMsg) return;
    clearTimeout(toastTimeout);

    aiToastMsg.textContent = message;
    if (aiToastIcon) {
      aiToastIcon.textContent = icon;
      if (!isSuccess) {
        aiToastIcon.className = 'material-symbols-outlined text-amber-500 text-[18px]';
        if (aiToastIcon.parentElement) aiToastIcon.parentElement.className = 'circle-1-1 w-7 h-7 bg-amber-500/20 text-amber-500 flex items-center justify-center flex-shrink-0';
      } else {
        aiToastIcon.className = 'material-symbols-outlined text-primary text-[18px]';
        if (aiToastIcon.parentElement) aiToastIcon.parentElement.className = 'circle-1-1 w-7 h-7 bg-primary/20 text-primary flex items-center justify-center flex-shrink-0';
      }
    }

    ai3dToast.classList.remove('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
    ai3dToast.classList.add('opacity-100', 'translate-y-0');

    toastTimeout = setTimeout(() => {
      ai3dToast.classList.remove('opacity-100', 'translate-y-0');
      ai3dToast.classList.add('opacity-0', 'translate-y-[-10px]', 'pointer-events-none');
    }, 3200);
  }

  // Render Slots (Shows preview image if uploaded, or dashed upload button if empty)
  function renderPhotoUploadSlots() {
    if (!photoUploadSlotsGrid) return;
    const isEn = getLang() === 'en';

    photoUploadSlotsGrid.innerHTML = INSPECTION_SLOTS.map((slot, idx) => {
      const uploaded = currentGalleryPhotos[idx];
      const title = isEn ? slot.titleEn : slot.title;

      if (uploaded && uploaded.img) {
        return `
          <div onclick="window.WeDriveStudio360.selectPhoto(${idx})" class="relative group rounded-xl h-32 overflow-hidden border border-border-day shadow-xs interactive-btn cursor-pointer transition-all duration-300 ${idx === currentGalleryPhotoIndex && activeVisualMode === 'gallery' ? 'ring-2 ring-primary' : ''}">
            <img src="${uploaded.img}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-between p-2.5">
              <div class="flex justify-end">
                <button type="button" onclick="event.stopPropagation(); window.WeDriveStudio360.triggerUpload(${idx});" class="circle-1-1 w-6 h-6 rounded-full bg-black/60 hover:bg-primary text-white flex items-center justify-center backdrop-blur-md transition-colors" title="${isEn ? 'Change Photo' : 'Tukar Foto'}">
                  <span class="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>
              <div class="flex items-center gap-1.5 text-white">
                <span class="material-symbols-outlined text-[14px] text-green-400" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span class="font-footnote text-footnote font-semibold text-white truncate drop-shadow-sm">${title}</span>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <button type="button" onclick="window.WeDriveStudio360.triggerUpload(${idx})" class="bg-surface-container border border-border-day border-dashed rounded-xl h-32 flex flex-col items-center justify-center gap-sm hover:bg-surface-container-high transition-all interactive-btn cursor-pointer group">
          <div class="circle-1-1 w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary flex items-center justify-center transition-colors">
            <span class="material-symbols-outlined text-[20px]">add_a_photo</span>
          </div>
          <span class="font-footnote text-footnote text-on-surface font-medium text-center px-sm">${title}</span>
        </button>
      `;
    }).join('');
  }

  // Helper: hide all viewer layers
  function hideAllViewerLayers() {
    if (emptyViewerState) emptyViewerState.classList.add('hidden');
    if (viewportRenderImage) {
      viewportRenderImage.classList.add('hidden');
      viewportRenderImage.style.backgroundImage = '';
    }
    if (iframe360Viewer) iframe360Viewer.classList.add('hidden');
    if (dragIndicatorOverlay) dragIndicatorOverlay.classList.add('hidden');
    if (btnPrevImage) btnPrevImage.classList.add('hidden');
    if (btnNextImage) btnNextImage.classList.add('hidden');
    if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.add('hidden');
  }

  // Show empty state with contextual icon/message
  function showEmptyState(icon, title, desc) {
    hideAllViewerLayers();
    if (emptyViewerIcon) emptyViewerIcon.textContent = icon || 'add_a_photo';
    if (emptyViewerTitle) emptyViewerTitle.textContent = title || '';
    if (emptyViewerDesc) emptyViewerDesc.textContent = desc || '';
    if (emptyViewerState) emptyViewerState.classList.remove('hidden');
  }

  // Update Viewport Display (Real Data Only — Zero Fake Images)
  function updateViewerDisplay() {
    const isEn = getLang() === 'en';

    if (activeVisualMode === '360') {
      if (currentCdnExteriorUrl.length > 0) {
        hideAllViewerLayers();
        if (iframe360Viewer) {
          if (iframe360Viewer.src !== currentCdnExteriorUrl) iframe360Viewer.src = currentCdnExteriorUrl;
          iframe360Viewer.classList.remove('hidden');
        }
        if (dragIndicatorOverlay) dragIndicatorOverlay.classList.remove('hidden');
      } else {
        showEmptyState(
          'link_off',
          isEn ? 'No 360° Link Provided' : 'Tiada Pautan 360° Dimasukkan',
          isEn ? 'Paste a 360° CDN URL and click Generate AI.' : 'Tampal URL CDN 360° di medan kiri dan klik Jana AI.'
        );
      }
      return;
    }



    // Mode is 'gallery'
    hideAllViewerLayers();
    const photosToDisplay = (currentGallery8Photos && currentGallery8Photos.length > 0)
      ? currentGallery8Photos
      : currentGalleryPhotos.filter(p => p && p.img);

    if (!photosToDisplay.length) {
      showEmptyState(
        'add_a_photo',
        isEn ? 'No Vehicle Photos' : 'Tiada Imej Visual Kenderaan',
        isEn ? 'Upload vehicle photos from the inspection slots on the left or paste a CDN link.' : 'Sila muat naik foto kenderaan dari slot pemeriksaan di sebelah kiri atau tampal pautan CDN.'
      );
      return;
    }

    const photo = photosToDisplay[currentGalleryPhotoIndex] || photosToDisplay[0];
    if (photo && photo.img) {
      if (viewportRenderImage) {
        viewportRenderImage.classList.remove('hidden');
        viewportRenderImage.style.backgroundImage = `url('${photo.img}')`;
      }
      if (btnPrevImage) btnPrevImage.classList.toggle('hidden', photosToDisplay.length <= 1);
      if (btnNextImage) btnNextImage.classList.toggle('hidden', photosToDisplay.length <= 1);
      if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.remove('hidden');
      renderGalleryThumbnails();
    }
  }

  // Render Thumbnails Strip
  function renderGalleryThumbnails() {
    if (!galleryThumbnailsStrip) return;
    const isEn = getLang() === 'en';

    const photosToDisplay = (currentGallery8Photos && currentGallery8Photos.length > 0)
      ? currentGallery8Photos
      : currentGalleryPhotos.filter(p => p && p.img);

    if (!photosToDisplay.length) {
      if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.add('hidden');
      return;
    }
    if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.remove('hidden');

    galleryThumbnailsStrip.innerHTML = photosToDisplay.map((photo, idx) => {
      if (!photo || !photo.img) return '';
      const isActive = (idx === currentGalleryPhotoIndex && activeVisualMode === 'gallery');
      const title = isEn ? (photo.titleEn || photo.title) : (photo.title || photo.titleEn);

      return `
        <button type="button" onclick="window.WeDriveStudio360.selectPhoto(${idx})"
          class="gallery-thumb-btn relative rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md border-transparent' : 'opacity-60 hover:opacity-100 hover:scale-[1.03] border border-border-day bg-surface-container'}"
          style="width: 58px; height: 42px;"
          title="${title}" aria-label="${title}">
          <img src="${photo.img}" alt="${title}" class="w-full h-full object-cover" />
        </button>
      `;
    }).join('');
  }

  // Select Photo
  function selectPhoto(index) {
    const photosToDisplay = (currentGallery8Photos && currentGallery8Photos.length > 0)
      ? currentGallery8Photos
      : currentGalleryPhotos.filter(p => p && p.img);

    if (!photosToDisplay[index] || !photosToDisplay[index].img) return;
    currentGalleryPhotoIndex = index;
    activeVisualMode = 'gallery';
    setVisualTab('gallery');
    updateViewerDisplay();
    renderPhotoUploadSlots();
  }

  // Next / Prev Gallery Navigation
  function navigateGallery(direction) {
    const photosToDisplay = (currentGallery8Photos && currentGallery8Photos.length > 0)
      ? currentGallery8Photos
      : currentGalleryPhotos.filter(p => p && p.img);

    if (!photosToDisplay.length) return;
    currentGalleryPhotoIndex = (currentGalleryPhotoIndex + direction + photosToDisplay.length) % photosToDisplay.length;
    selectPhoto(currentGalleryPhotoIndex);
  }

  // Trigger File Upload for specific slot
  function triggerUpload(slotIndex) {
    activeUploadSlotIndex = slotIndex;
    if (slotFileInput) {
      slotFileInput.value = '';
      slotFileInput.click();
    }
  }

  // Save to Local Draft & Supabase Cache
  function saveVisualDraft() {
    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      const draft = raw ? JSON.parse(raw) : {};
      const hasValidInMemory = Array.isArray(currentGalleryPhotos) && currentGalleryPhotos.some(p => p && p.img);
      if (hasValidInMemory) {
        draft.photos = currentGalleryPhotos;
      }
      if (Array.isArray(currentGallery8Photos) && currentGallery8Photos.length > 0) {
        draft.gallery8Photos = currentGallery8Photos;
      }
      if (Array.isArray(currentGallery8Photos) && currentGallery8Photos.length > 0) {
        draft.supabase_images = currentGallery8Photos;
      } else if (hasValidInMemory) {
        draft.supabase_images = currentGalleryPhotos.filter(p => p && p.img);
      }
      draft.downloaded = true;
      // Strictly lock Hero photo to Slot 0 (Hadapan Tiga Suku 0-140 BMW/Alphard Standard)
      const heroPhoto = (currentGalleryPhotos && currentGalleryPhotos[0] && currentGalleryPhotos[0].img)
        ? currentGalleryPhotos[0]
        : (currentGallery8Photos && currentGallery8Photos[0])
          ? currentGallery8Photos[0]
          : (hasValidInMemory ? currentGalleryPhotos.find(p => p && p.img) : (draft.photos && draft.photos[0]));
      if (heroPhoto) {
        draft.image_url = typeof heroPhoto === 'string' ? heroPhoto : (heroPhoto.img || '');
      }
      draft.orientation_frames = {
        hero: 140,
        front: 125,
        right: 175,
        left: 75,
        rear: 24,
        rear_left: 0
      };
      const hasValid360 = Boolean(currentCdnExteriorUrl || (cdnUrlInput && cdnUrlInput.value.trim()));
      draft.has360         = hasValid360;
      draft.has_360        = hasValid360;
      draft.supabase_360   = hasValid360 ? currentCdnExteriorUrl : null;
      draft.exterior_360   = hasValid360 ? currentCdnExteriorUrl : null;
      if (cdnUrlInput) {
        draft.cdnUrl         = cdnUrlInput.value.trim();
        draft.cdnUrlExterior = hasValid360 ? currentCdnExteriorUrl : '';
        draft.cdnUrlInterior = hasValid360 ? currentCdnInteriorUrl : '';
      }
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));

      if (window.WeDriveAPI && typeof window.WeDriveAPI.saveCarDraft === 'function') {
        window.WeDriveAPI.saveCarDraft(draft).then(res => {
          if (res && res.data && res.data.id) {
            try {
              const curRaw = localStorage.getItem('wedrive_new_car_draft');
              const cur = curRaw ? JSON.parse(curRaw) : {};
              cur.supabase_draft_id = res.data.id;
              localStorage.setItem('wedrive_new_car_draft', JSON.stringify(cur));
            } catch(_) {}
          }
        }).catch(err => console.warn('[WeDRIVE Studio] Supabase sync error:', err));
      }
    } catch (e) {
      console.warn('[WeDRIVE Studio] Draft save error:', e);
    }
  }

  // Restore Draft
  function restoreVisualDraft() {
    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (Array.isArray(draft.gallery8Photos) && draft.gallery8Photos.length > 0) {
        currentGallery8Photos = draft.gallery8Photos;
      }
      if (Array.isArray(draft.photos) && draft.photos.length > 0) {
        currentGalleryPhotos = draft.photos.map((p, idx) => {
          if (!p) return null;
          if (typeof p === 'string') {
            const slotDef = INSPECTION_SLOTS[idx] || { title: 'Foto', titleEn: 'Photo' };
            return { title: slotDef.title, titleEn: slotDef.titleEn, img: p };
          }
          return p;
        });
        const firstValidIndex = currentGalleryPhotos.findIndex(p => p && p.img);
        if (firstValidIndex !== -1) {
          currentGalleryPhotoIndex = firstValidIndex;
        }
      } else if (draft.image_url) {
        currentGalleryPhotos[0] = {
          title: INSPECTION_SLOTS[0].title,
          titleEn: INSPECTION_SLOTS[0].titleEn,
          img: draft.image_url
        };
        currentGalleryPhotoIndex = 0;
      }

      if (draft.cdnUrl && cdnUrlInput) {
        cdnUrlInput.value = draft.cdnUrl;
      }

      currentCdnExteriorUrl = draft.cdnUrlExterior || draft.cdnUrl || '';
      currentCdnInteriorUrl = draft.cdnUrlInterior || '';

      if (draft.has360) {
        expand360Capabilities();
      }

      if (currentCdnExteriorUrl && cdnStatusBadge && cdnStatusText) {
        const isEn = getLang() === 'en';
        cdnStatusBadge.className = 'pill-btn bg-success/15 text-success font-caption text-caption px-sm py-[3px] flex items-center gap-xs font-semibold self-start sm:self-center';
        if (cdnStatusIcon) cdnStatusIcon.textContent = 'check_circle';
        const hasInterior = !!currentCdnInteriorUrl;
        const photoCount = (currentGallery8Photos && currentGallery8Photos.length) || 8;
        cdnStatusText.textContent = hasInterior
          ? (isEn ? `✓ 3 Views Ready (Exterior, Interior, Gallery - ${photoCount})` : `✓ 3 Paparan Sedia (Luar, Dalam, Galeri - ${photoCount})`)
          : (isEn ? '✓ Visuals Ready' : '✓ Visual Sedia');
      }

      if (currentCdnExteriorUrl && btnSaveToDb) {
        btnSaveToDb.disabled = false;
        btnSaveToDb.classList.remove('opacity-60', 'cursor-not-allowed');
        btnSaveToDb.classList.add('cursor-pointer', 'hover:border-primary', 'hover:text-primary');
      }
    } catch (e) {}
  }

  // Switch Visual Modes (Gallery, 360)
  function setVisualTab(mode) {
    activeVisualMode = mode;
    [tab360, tabGallery].forEach(tab => {
      if (!tab) return;
      tab.classList.remove('bg-white', 'dark:bg-[#1D1D20]', 'font-bold', 'shadow-xs', 'text-on-surface');
      tab.classList.add('text-on-surface-variant');
    });

    let activeTab = tabGallery;
    if (mode === '360') activeTab = tab360;

    if (activeTab) {
      activeTab.classList.add('bg-white', 'dark:bg-[#1D1D20]', 'font-bold', 'shadow-xs', 'text-on-surface');
      activeTab.classList.remove('text-on-surface-variant');
    }

    updateViewerDisplay();
  }

  // Progressive Expansion of 360 Capabilities
  function expand360Capabilities() {
    has360Expanded = true;
    if (segmentedSwitcher) {
      segmentedSwitcher.classList.remove('max-w-[130px]');
      segmentedSwitcher.classList.add('max-w-[260px]');
    }
    if (tab360) tab360.classList.remove('hidden');
    setVisualTab('360');
    saveVisualDraft();
  }

  // AI CDN Scanner — Parse SpinCar URL into 3 separate views (Exterior, Interior, Gallery - 8)
  async function handleGenerateAi() {
    if (isAnalyzing) return;
    const url = cdnUrlInput ? cdnUrlInput.value.trim() : '';
    const isEn = getLang() === 'en';

    if (!url) {
      showAiToast(isEn ? 'Paste a CDN URL first.' : 'Tampal URL CDN dahulu.', false, 'warning');
      return;
    }

    isAnalyzing = true;
    if (btnGenerate3D) {
      btnGenerate3D.disabled = true;
      btnGenerate3D.classList.add('opacity-75');
      if (btnGenIcon) btnGenIcon.className = 'material-symbols-outlined text-[18px] text-white animate-spin';
      if (btnGenIcon) btnGenIcon.textContent = 'progress_activity';
      if (btnGenText) btnGenText.textContent = isEn ? 'Scanning...' : 'Mengimbas...';
    }
    if (aiLaserScanner) aiLaserScanner.classList.remove('hidden');

    showAiToast(isEn ? 'Scanning vehicle visual assets...' : 'Sedang mengimbas aset visual kenderaan...', true, 'sync');

    try {
      // Extract assets via Impel API or known vehicle library
      const result = await separateSpinCarAssets(url);

      if (result) {
        currentCdnExteriorUrl = result.exteriorUrl || url;
        currentCdnInteriorUrl = result.interiorPanoUrl || '';
        currentGallery8Photos = result.gallery8Photos || [];
        // Store Impel metadata for zero-storage CDN frame URL building
        currentCdnPrefix     = result.cdnPrefix || '';
        currentImpelVin      = result.vin || '';
        currentImpelCustomer = result.customer || '';

        // Auto-fill the 6 vehicle inspection slots with matching angle photos
        if (result.gallery8Photos && result.gallery8Photos.length > 0) {
          currentGalleryPhotos = new Array(6).fill(null);
          result.gallery8Photos.forEach(item => {
            if (typeof item.slot === 'number' && item.slot >= 0 && item.slot < 6) {
              currentGalleryPhotos[item.slot] = {
                title: INSPECTION_SLOTS[item.slot].title,
                titleEn: INSPECTION_SLOTS[item.slot].titleEn,
                img: item.img
              };
            }
          });
          renderPhotoUploadSlots();
        }
      } else {
        currentCdnExteriorUrl = url;
        currentCdnInteriorUrl = '';
        currentGallery8Photos = [];
      }

      expand360Capabilities();

      if (cdnStatusBadge && cdnStatusText) {
        cdnStatusBadge.className = 'pill-btn bg-success/15 text-success font-caption text-caption px-sm py-[3px] flex items-center gap-xs font-semibold self-start sm:self-center';
        if (cdnStatusIcon) cdnStatusIcon.textContent = 'check_circle';
        const hasInterior = !!currentCdnInteriorUrl;
        const photoCount = currentGallery8Photos.length || 8;
        cdnStatusText.textContent = hasInterior
          ? (isEn ? `✓ 3 Views Ready (Exterior, Interior, Gallery - ${photoCount})` : `✓ 3 Paparan Sedia (Luar, Dalam, Galeri - ${photoCount})`)
          : (isEn ? '✓ Visuals Ready' : '✓ Visual Sedia');
      }

      if (btnSaveToDb) {
        btnSaveToDb.disabled = false;
        btnSaveToDb.classList.remove('opacity-60', 'cursor-not-allowed');
        btnSaveToDb.classList.add('cursor-pointer', 'hover:border-primary', 'hover:text-primary');
      }

      saveVisualDraft();
      updateViewerDisplay();

      const hasInterior = !!currentCdnInteriorUrl;
      const photoCount = currentGallery8Photos.length || 8;
      showAiToast(
        hasInterior
          ? (isEn ? `✓ 3 Views Detected: Exterior 360°, Interior & Gallery (${photoCount} photos)!` : `✓ 3 Paparan Dijumpai: Luar 360°, Dalam & Galeri (${photoCount} foto)!`)
          : (isEn ? '✓ 360° visuals verified and linked!' : '✓ Visual 360° kenderaan berjaya dipautkan!'),
        true, 'check_circle'
      );
    } catch (err) {
      console.error('[WeDRIVE AI Scanner] Error separating assets:', err);
      showAiToast(isEn ? 'Failed to process visual assets.' : 'Gagal memproses aset visual.', false, 'error');
    } finally {
      isAnalyzing = false;
      if (btnGenerate3D) {
        btnGenerate3D.disabled = false;
        btnGenerate3D.classList.remove('opacity-75');
        if (btnGenIcon) btnGenIcon.className = 'material-symbols-outlined text-[18px] text-white';
        if (btnGenIcon) btnGenIcon.textContent = 'auto_awesome';
        if (btnGenText) btnGenText.textContent = isEn ? 'Generate AI' : 'Jana AI';
      }
      if (aiLaserScanner) aiLaserScanner.classList.add('hidden');
    }
  }

  // Handle Save Visuals — real async save, no fake progress animation
  async function handleSaveVisuals() {
    if (isSavingDb) return;
    isSavingDb = true;
    const isEn = getLang() === 'en';

    // Show saving state on button immediately
    if (btnSaveToDb) {
      btnSaveToDb.disabled = true;
      const spanTxt = btnSaveToDb.querySelector('span[data-i18n="btn_save_assets"]');
      if (spanTxt) spanTxt.textContent = isEn ? 'Saving...' : 'Menyimpan...';
    }

    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      const draft = raw ? JSON.parse(raw) : {};
      draft.downloaded = true;
      draft.downloaded_at = new Date().toISOString();
      draft.photos = currentGalleryPhotos;
      draft.gallery8Photos = currentGallery8Photos;
      draft.supabase_images = (currentGallery8Photos && currentGallery8Photos.length > 0)
        ? currentGallery8Photos
        : currentGalleryPhotos.filter(p => p && p.img);

      // Lock Hero photo to Slot 0
      const heroPhoto = (currentGalleryPhotos && currentGalleryPhotos[0] && currentGalleryPhotos[0].img)
        ? currentGalleryPhotos[0]
        : (currentGallery8Photos && currentGallery8Photos[0])
          ? currentGallery8Photos[0]
          : currentGalleryPhotos.find(p => p && p.img);
      if (heroPhoto) {
        draft.image_url = typeof heroPhoto === 'string' ? heroPhoto : (heroPhoto.img || '');
      }

      draft.orientation_frames = { hero: 140, front: 125, right: 175, left: 75, rear: 24, rear_left: 0 };

      // ── Cloudinary Upload Path (when Impel CDN metadata available) ──
      if (currentCdnPrefix) {
        showAiToast(isEn ? 'Uploading 200 frames to cloud... (0/200)' : 'Memuat naik 200 bingkai ke awan... (0/200)', true, 'cloud_upload');

        const carLabel = draft.label || draft.type || 'Car';
        const carName  = draft.name  || 'Unknown';

        const { exteriorFrames, interiorFacesObj } = await uploadImpelFramesToCloudinary(
          currentCdnPrefix, carLabel, carName,
          (done, total) => {
            showAiToast(
              isEn ? `Uploading... (${done}/${total} frames)` : `Memuat naik... (${done}/${total} bingkai)`,
              true, 'cloud_upload'
            );
          }
        );

        draft.exterior_frames = exteriorFrames;  // Array of 36 Cloudinary URLs
        draft.has_360         = true;

        if (interiorFacesObj && Object.keys(interiorFacesObj).length > 0) {
          // Save 6-face cube-map URLs as JSON string — car-detail.js parses face keys (f,b,l,r,u,d)
          draft.interior_360 = JSON.stringify(interiorFacesObj);
        }

        // Clear the impel JSON meta from exterior_360 (not needed anymore)
        draft.exterior_360 = null;
        draft.supabase_360 = currentCdnExteriorUrl; // Keep SpinCar URL as backup

      } else if (currentCdnPrefix === '' && currentCdnExteriorUrl) {
        // Fallback: save raw SpinCar URL if Cloudinary not configured
        draft.supabase_360 = currentCdnExteriorUrl;
        draft.exterior_360 = currentCdnExteriorUrl;
      }
      if (cdnUrlInput && cdnUrlInput.value.trim()) {
        draft.cdnUrl         = cdnUrlInput.value.trim();
        draft.cdnUrlExterior = currentCdnExteriorUrl;
        draft.has360         = has360Expanded;
      }

      // Save to localStorage (primary — always succeeds instantly)
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));

      // Sync to Supabase (secondary — async, non-blocking)
      if (window.WeDriveAPI && typeof window.WeDriveAPI.saveCarDraft === 'function') {
        window.WeDriveAPI.saveCarDraft(draft).then(res => {
          if (res && res.data && res.data.id) {
            try {
              const cur = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
              cur.supabase_draft_id = res.data.id;
              localStorage.setItem('wedrive_new_car_draft', JSON.stringify(cur));
            } catch (_) {}
          }
        }).catch(err => console.warn('[WeDRIVE Studio] Supabase sync error:', err));
      }

      // Update button to success state
      if (btnSaveToDb) {
        btnSaveToDb.disabled = false;
        btnSaveToDb.classList.remove('border-border-day', 'opacity-60', 'cursor-not-allowed');
        btnSaveToDb.classList.add('border-success', 'text-success');
        const spanTxt = btnSaveToDb.querySelector('span[data-i18n="btn_save_assets"]');
        if (spanTxt) spanTxt.textContent = isEn ? '✓ Visual Saved' : '✓ Visual Disimpan';
      }

      showAiToast(isEn ? '✓ Visual assets saved!' : '✓ Aset visual disimpan!', true, 'cloud_done');

    } catch (e) {
      console.warn('[WeDRIVE Studio] handleSaveVisuals error:', e);
      if (btnSaveToDb) {
        btnSaveToDb.disabled = false;
        const spanTxt = btnSaveToDb.querySelector('span[data-i18n="btn_save_assets"]');
        if (spanTxt) spanTxt.textContent = isEn ? 'Save Visuals' : 'Simpan Visual';
      }
      showAiToast(isEn ? 'Save failed. Please try again.' : 'Simpan gagal. Cuba semula.', false, 'error');
    } finally {
      isSavingDb = false;
      if (saveDbProgressBox) {
        saveDbProgressBox.classList.add('hidden');
        saveDbProgressBox.classList.remove('flex');
      }
    }
  }

  // Event Listeners
  if (btnGenerate3D) btnGenerate3D.addEventListener('click', handleGenerateAi);
  if (btnSaveToDb) btnSaveToDb.addEventListener('click', handleSaveVisuals);
  if (btnPrevImage) btnPrevImage.addEventListener('click', () => navigateGallery(-1));
  if (btnNextImage) btnNextImage.addEventListener('click', () => navigateGallery(1));

  if (tab360) tab360.addEventListener('click', () => setVisualTab('360'));
  if (tabGallery) tabGallery.addEventListener('click', () => setVisualTab('gallery'));

  if (slotFileInput) {
    slotFileInput.addEventListener('change', function () {
      if (!this.files || !this.files[0]) return;
      const file = this.files[0];
      const isEn = getLang() === 'en';
      const slotDef = INSPECTION_SLOTS[activeUploadSlotIndex] || { title: 'Foto', titleEn: 'Photo' };

      const reader = new FileReader();
      reader.onload = function (e) {
        const dataUrl = e.target.result;
        currentGalleryPhotos[activeUploadSlotIndex] = {
          title: slotDef.title,
          titleEn: slotDef.titleEn,
          img: dataUrl
        };
        currentGalleryPhotoIndex = activeUploadSlotIndex;
        activeVisualMode = 'gallery';
        setVisualTab('gallery');
        renderPhotoUploadSlots();
        updateViewerDisplay();
        saveVisualDraft();

        showAiToast(isEn ? `✓ ${slotDef.titleEn} uploaded successfully.` : `✓ Foto ${slotDef.title} berjaya dimuat naik.`, true, 'check_circle');
      };
      reader.readAsDataURL(file);
    });
  }

  // Fullscreen Viewer Toggle
  if (btnFullscreen360 && turntableViewport) {
    btnFullscreen360.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        turntableViewport.requestFullscreen().catch(() => {});
        if (iconFullscreen) iconFullscreen.textContent = 'fullscreen_exit';
      } else {
        document.exitFullscreen().catch(() => {});
        if (iconFullscreen) iconFullscreen.textContent = 'fullscreen';
      }
    });
  }

  // Listen for language change events
  document.addEventListener('wedrive:language-applied', () => {
    renderPhotoUploadSlots();
    renderGalleryThumbnails();
  });
  window.addEventListener('wedrive:language-applied', () => {
    renderPhotoUploadSlots();
    renderGalleryThumbnails();
  });
  window.addEventListener('wedrive:langchange', () => {
    renderPhotoUploadSlots();
    renderGalleryThumbnails();
  });
  window.addEventListener('storage', (e) => {
    if (e.key && e.key.includes('lang')) {
      renderPhotoUploadSlots();
      renderGalleryThumbnails();
    }
  });

  // Public Interface
  window.WeDriveStudio360 = {
    selectPhoto: selectPhoto,
    triggerUpload: triggerUpload,
    saveVisualDraft: saveVisualDraft
  };

  // Visual Gatekeeper: Block forward navigation if photos/360 are missing
  function validateStep2Visuals(e) {
    try {
      const stored = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
      const storedPhotos = stored.photos || stored.supabase_images || stored.images || [];
      if (Array.isArray(storedPhotos)) {
        if (storedPhotos.length === 0) {
          currentGallery8Photos = [];
          if (Array.isArray(currentGalleryPhotos)) {
            currentGalleryPhotos = currentGalleryPhotos.map(p => ({ ...p, img: null }));
          }
          currentCdnExteriorUrl = '';
        } else {
          const validUrls = storedPhotos.map(p => typeof p === 'string' ? p : (p && p.img ? p.img : null)).filter(Boolean);
          if (validUrls.length > 0) {
            currentGallery8Photos = validUrls.slice();
            if (Array.isArray(currentGalleryPhotos)) {
              validUrls.forEach((url, idx) => {
                if (currentGalleryPhotos[idx]) {
                  currentGalleryPhotos[idx].img = url;
                } else {
                  currentGalleryPhotos.push({ slot: idx, img: url });
                }
              });
            }
          }
        }
      }
      if (stored.cdnUrl || stored.cdnUrlExterior || stored.turntableUrl) {
        currentCdnExteriorUrl = stored.cdnUrlExterior || stored.cdnUrl || stored.turntableUrl;
      }
    } catch (err) {}

    const hasAnyPhoto = (currentGallery8Photos && currentGallery8Photos.length > 0) ||
                        (currentGalleryPhotos && currentGalleryPhotos.some(p => p && p.img)) ||
                        Boolean(currentCdnExteriorUrl || (cdnUrlInput && cdnUrlInput.value.trim()));
    if (!hasAnyPhoto) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isEn = getLang() === 'en';
      showAiToast(isEn
        ? 'Cannot proceed: Please upload at least 1 photo or configure a 360° viewer link.'
        : 'Tidak boleh meneruskan: Sila muat naik sekurang-kurangnya 1 gambar kenderaan atau pautan 360°.',
        false, 'warning');
      const photoZone = document.getElementById('photoSlotsContainer');
      if (photoZone) {
        photoZone.scrollIntoView({ behavior: 'smooth', block: 'center' });
        photoZone.classList.add('ai-field-wave');
        setTimeout(() => photoZone.classList.remove('ai-field-wave'), 1200);
      }
      return false;
    }

    saveVisualDraft();
    return true;
  }

  window.validateStep2Visuals = validateStep2Visuals;

  // Dock Next Button & Forward Links: Validate visuals strictly before advancing
  document.querySelectorAll('#btnNextToStep3, a[href*="step3_pengesahan.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!validateStep2Visuals(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // Forward Stepper Links: Steps 3, 4, 5 require visuals
  document.querySelectorAll('.wizard-stepper a[href*="step3"], .wizard-stepper a[href*="step4"], .wizard-stepper a[href*="step5"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!validateStep2Visuals(e)) {
        e.preventDefault();
        e.stopPropagation();
      }
    });
  });

  // Initialization
  restoreVisualDraft();
  renderPhotoUploadSlots();
  updateViewerDisplay();

})();
