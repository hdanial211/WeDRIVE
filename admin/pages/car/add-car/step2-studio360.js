/**
 * WeDRIVE Admin Add Car - Step 2: Studio Visual 360°
 * admin/pages/car/add-car/step2-studio360.js (v6.20.5)
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

  // Carsome/Impel's `ec` sequence starts at the rear, not the front.
  // Keep this mapping in one place so the inspection slots and the saved
  // gallery use the same orientation.
  const ANGLE_MAP_VERSION = 'impel-ec-angle-v2';
  const IMPEL_EC_INDICES = ['0-0', '0-25', '0-50', '0-75', '0-100', '0-125', '0-150', '0-175'];
  const IMPEL_CARD_ORDER = ['0-100', '0-125', '0-150', '0-175', '0-0', '0-25', '0-50', '0-75'];
  const IMPEL_ANGLE_MAP = Object.freeze({
    '0-0':   { title: 'Suku Belakang Kanan', titleEn: 'Rear Right Quarter',  slot: 5 },
    '0-25':  { title: 'Belakang Penuh',      titleEn: 'Full Rear',           slot: 1 },
    '0-50':  { title: 'Suku Belakang Kiri',  titleEn: 'Rear Left Quarter',   slot: null },
    '0-75':  { title: 'Sisi Kiri Profil',    titleEn: 'Left Side Profile',   slot: 3 },
    '0-100': { title: 'Suku Hadapan Kiri',   titleEn: 'Front Left Quarter',  slot: 4 },
    '0-125': { title: 'Hadapan Penuh',      titleEn: 'Full Front',          slot: 0 },
    '0-150': { title: 'Suku Hadapan Kanan', titleEn: 'Front Right Quarter', slot: null },
    '0-175': { title: 'Sisi Kanan Profil',  titleEn: 'Right Side Profile',  slot: 2 }
  });

  function getLang() {
    return localStorage.getItem('wedrive_lang') || 'ms';
  }

  // Zero Fake Data: No hardcoded fallback images. All visual content from real draft data only.

  // State
  let currentGalleryPhotos = [];
  let currentGalleryPhotoIndex = 0;
  let currentGalleryPhotoId = '';
  let activeUploadSlotIndex = 0;
  let activeVisualMode = 'gallery';
  let has360Expanded = false;
  let isAnalyzing = false;
  let isSavingDb = false;
  let toastTimeout = null;
  let currentFolderPlan = null;

  // SpinCar/Impel 3-View State (Exterior, Interior, Gallery)
  let currentCdnExteriorUrl = '';  // Pusingan 360° Luar (Interactive Player)
  let currentCdnInteriorUrl = '';  // Panorama Dalaman (pano/pano_f.jpg)
  let currentCdnPhotosUrl   = '';  // Galeri CDN
  let currentGallery8Photos = [];  // 8 HD Angle Photos from CDN
  // Impel API metadata — for building CDN frame URLs in car-detail
  let currentCdnPrefix      = '';  // e.g. https://cdn.impel.io/swipetospin-viewers/Carsome/VIN/version/
  let currentImpelVin       = '';  // e.g. mntccnd23z0011880
  let currentImpelCustomer  = '';  // e.g. Carsome
  let currentAngleMapVersion = ANGLE_MAP_VERSION;

  // ── Cloudinary Config (WeDRIVE 360° Studio) ──
  const CLOUDINARY_CLOUD    = 'gwd1bhcx';
  const CLOUDINARY_PRESET   = 'wedrive_360';
  const CLOUDINARY_ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;
  const FOLDER_CATEGORIES = ['Sedan', 'Hatchback', 'SUV', 'MPV', 'Truck', 'Coupe', 'Convertible', 'Wagon', 'Van'];
  const FOLDER_MANAGER_SYSTEM_PROMPT = `
You are the WeDRIVE 360 asset folder manager for Add Car Step 2.
Return JSON only with these keys:
{"category":"Sedan|Hatchback|SUV|MPV|Truck|Coupe|Convertible|Wagon|Van","model_name":"canonical folder name including plate in parentheses","root":"model","needs_review":false}

Folder rules are strict:
- The root is always exactly "model".
- The final paths must be model/{category}/{model_name}/...
- Use one canonical category and one canonical model name for local and Cloudinary.
- Map Pickup, Pickup (4x4), 4x4 and pick-up to Truck; map Crossover to SUV.
- Never use a VIN alone, CDN URL, date, random ID or upload attempt number as a folder.
- Never put a slash in category or model_name.
- Keep year, brand, model, variant and registration plate in model_name when available.
- Format the physical-car folder as Year Brand Model Variant (PLATE).
- If the vehicle identity is incomplete, set needs_review to true.
Do not create upload URLs and do not invent vehicle details.`;

  function cloudinaryPublicId(carLabel, carName, section, filename) {
    const safe = (value) => String(value || 'Unknown').replace(/[\\/:*?"<>|]/g, '-').trim();
    return `model/${safe(carLabel)}/${safe(carName)}/${section}/${filename.replace(/\.jpg$/i, '')}`;
  }

  function cloudinaryAssetFolder(publicId) {
    const value = String(publicId || '').replace(/^\/+|\/+$/g, '');
    const separator = value.lastIndexOf('/');
    return separator > 0 ? value.slice(0, separator) : '';
  }

  function safeFolderSegment(value, fallback = 'Unknown') {
    const cleaned = String(value || '')
      .replace(/[\\/:*?"<>|]/g, '-')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || fallback;
  }

  function canonicalFolderCategory(value) {
    const raw = String(value || '').trim();
    const aliases = {
      pickup: 'Truck',
      'pickup (4x4)': 'Truck',
      '4x4': 'Truck',
      'pick-up': 'Truck',
      crossover: 'SUV'
    };
    const alias = aliases[raw.toLowerCase()];
    if (alias) return alias;
    const exact = FOLDER_CATEGORIES.find(item => item.toLowerCase() === raw.toLowerCase());
    return exact || 'SUV';
  }

  function getDraftModelName(draft) {
    const step1Name = [draft.year, draft.brand, draft.model, draft.variant].filter(Boolean).join(' ');
    return safeFolderSegment(
      step1Name || draft.name || draft.fullName || draft.customName,
      'Unknown Car'
    );
  }

  function getDraftFolderModelName(draft) {
    const modelName = getDraftModelName(draft);
    const plate = safeFolderSegment(draft.plate, 'NO-PLATE');
    return `${modelName} (${plate})`;
  }

  function readCarDraft() {
    try {
      return JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
    } catch (_) {
      return {};
    }
  }

  function isStep1Complete(draft) {
    return Boolean(
      draft &&
      String(draft.brand || '').trim() &&
      String(draft.model || '').trim() &&
      String(draft.category || '').trim() &&
      String(draft.year || '').trim() &&
      String(draft.plate || '').trim().length >= 3
    );
  }

  function requireStep1BeforeVisuals(isEn) {
    if (isStep1Complete(readCarDraft())) return true;
    showAiToast(
      isEn
        ? 'Complete Step 1 (brand, model, category, year and plate) before processing visuals.'
        : 'Lengkapkan Langkah 1 (jenama, model, kategori, tahun dan plat) sebelum memproses visual.',
      false,
      'lock'
    );
    return false;
  }

  function buildFolderPlan(draft = {}) {
    const category = canonicalFolderCategory(draft.category || draft.label || draft.type);
    const modelName = getDraftFolderModelName(draft);
    const base = `model/${category}/${modelName}`;
    return {
      category,
      model_name: modelName,
      root: 'model',
      local_model_path: `${category}/${modelName}`,
      cloudinary_folder: base,
      exterior_folder: `${base}/exterior/full-res`,
      interior_folder: `${base}/interior/full-res`,
      needs_review: getDraftModelName(draft) === 'Unknown Car' || plateIsMissing(draft)
    };
  }

  function plateIsMissing(draft) {
    return !String(draft && draft.plate || '').trim();
  }

  function isCanonicalFolderPlan(plan) {
    const folder = String(plan && plan.cloudinary_folder || '');
    return /^model\/(?:Sedan|Hatchback|SUV|MPV|Truck|Coupe|Convertible|Wagon|Van)\/[^/]+/i.test(folder) &&
      !/^model\/wedrive-model(?:\/|$)/i.test(folder);
  }

  function parseJsonObject(text) {
    const cleaned = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(cleaned);
  }

  function validateFolderPlan(candidate, draft) {
    const fallback = buildFolderPlan(draft);
    const category = canonicalFolderCategory(draft.category || candidate.category || fallback.category);
    // Step 1 is the source of truth for the model name. AI validates and
    // classifies it, but must not silently rename the local model folder.
    const modelName = getDraftFolderModelName(draft);
    const base = `model/${category}/${modelName}`;
    return {
      category,
      model_name: modelName,
      root: 'model',
      local_model_path: `${category}/${modelName}`,
      cloudinary_folder: base,
      exterior_folder: `${base}/exterior/full-res`,
      interior_folder: `${base}/interior/full-res`,
      needs_review: Boolean(candidate && candidate.needs_review) || getDraftModelName(draft) === 'Unknown Car' || plateIsMissing(draft)
    };
  }

  async function resolveFolderPlanWithAi(draft, scanResult) {
    const fallback = buildFolderPlan(draft);
    const vault = window.WeDriveAiVault;
    if (!vault || typeof vault.callAi !== 'function' || typeof vault.hasKey !== 'function') {
      return fallback;
    }

    // Load the latest key from Supabase before deciding whether AI is
    // available. This prevents a stale/empty browser cache from forcing the
    // admin to enter the key again on another device.
    if (typeof vault.syncFromSupabase === 'function') {
      try {
        await vault.syncFromSupabase();
      } catch (_) {}
    }
    if (!vault.hasKey('downloader_360')) return fallback;

    try {
      const response = await vault.callAi(
        'downloader_360',
        FOLDER_MANAGER_SYSTEM_PROMPT,
        JSON.stringify({
          spincar_url: cdnUrlInput ? cdnUrlInput.value.trim() : '',
          vin: scanResult && scanResult.vin ? scanResult.vin : '',
          customer: scanResult && scanResult.customer ? scanResult.customer : 'Carsome',
          vehicle: {
            year: draft.year || '',
            brand: draft.brand || '',
            model: draft.model || '',
            variant: draft.variant || '',
            category: draft.category || ''
          },
          required_root: 'model',
          existing_categories: FOLDER_CATEGORIES
        }),
        { temperature: 0.1, maxTokens: 300, jsonMode: true }
      );
      return validateFolderPlan(parseJsonObject(response), draft);
    } catch (error) {
      console.warn('[WeDRIVE Folder Manager] AI unavailable; using deterministic plan:', error.message);
      return fallback;
    }
  }

  function cloudinaryDeliveryUrl(publicId) {
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${publicId.split('/').map(encodeURIComponent).join('/')}.jpg`;
  }

  // Folder creation is performed by the Supabase Edge Function with the
  // Cloudinary Admin API. The API secret never enters this browser bundle.
  async function createCloudinaryFolders(cloudinaryFolder) {
    if (!window.supabaseClient || !window.supabaseClient.functions) {
      throw new Error('Supabase client belum tersedia untuk Cloudinary Admin API.');
    }
    const result = await window.supabaseClient.functions.invoke('cloudinary-admin', {
      body: { action: 'create_folders', folder: cloudinaryFolder }
    });
    if (result.error) {
      // FunctionsHttpError keeps the Edge Function response in `context`.
      // Read its JSON body so a known 503 configuration response can be
      // handled separately from a real authentication/API failure.
      let serverMessage = '';
      const response = result.error.context;
      if (response && typeof response.clone === 'function') {
        try {
          const body = await response.clone().json();
          serverMessage = body && body.error ? String(body.error) : '';
        } catch (_) {}
      }
      throw new Error(serverMessage || result.error.message || 'Cloudinary folder API gagal.');
    }
    if (result.data && result.data.error) throw new Error(result.data.error);
    return result.data;
  }

  function isCloudinaryAdminConfigurationError(error) {
    return /Cloudinary Admin API secrets belum ditetapkan/i.test(String(error && error.message || error || ''));
  }

  // Upload a local Blob to Cloudinary. Kept for inspection photos selected by
  // the admin; CDN assets use uploadRemoteUrlToCloudinary below to avoid CORS.
  async function uploadToCloudinary(blob, publicId) {
    const fd = new FormData();
    fd.append('file', blob);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    fd.append('public_id', publicId);
    const assetFolder = cloudinaryAssetFolder(publicId);
    if (assetFolder) fd.append('asset_folder', assetFolder);
    const res = await fetch(CLOUDINARY_ENDPOINT, { method: 'POST', body: fd });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudinary upload error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    return data.secure_url; // e.g. https://res.cloudinary.com/gwd1bhcx/image/upload/...
  }

  // Cloudinary fetches the remote CDN URL server-side. This avoids the CORS
  // restriction that prevents the browser from reading Impel image bytes.
  async function uploadRemoteUrlToCloudinary(remoteUrl, publicId) {
    const fd = new FormData();
    fd.append('file', remoteUrl);
    fd.append('upload_preset', CLOUDINARY_PRESET);
    fd.append('public_id', publicId);
    const assetFolder = cloudinaryAssetFolder(publicId);
    if (assetFolder) fd.append('asset_folder', assetFolder);

    const res = await fetch(CLOUDINARY_ENDPOINT, { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data && data.error && data.error.message ? data.error.message : '';
      // Unsigned presets do not allow overwrite. Only treat an explicit
      // "already exists" response as a valid previous upload. Other errors
      // must stop the save; otherwise a deterministic but nonexistent URL
      // could be written to Supabase and look like a successful upload.
      if (/already\s+exists/i.test(message)) return cloudinaryDeliveryUrl(publicId);
      throw new Error(`Cloudinary remote upload error ${res.status}: ${message}`);
    }
    if (!data || typeof data.secure_url !== 'string' || !data.secure_url.includes('res.cloudinary.com/')) {
      throw new Error('Cloudinary upload returned no secure asset URL.');
    }
    return data.secure_url;
  }

  function updateCloudinaryProgress(done, total, label) {
    const box = document.getElementById('saveDbProgressBox');
    const bar = document.getElementById('downloadProgressBar');
    const percent = document.getElementById('downloadPercentText');
    const status = document.getElementById('downloadFilesStatus');
    const estimate = document.getElementById('downloadTimeEstimate');
    if (box) {
      box.classList.remove('hidden');
      box.classList.add('flex');
    }
    const value = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0;
    if (bar) bar.style.width = `${value}%`;
    if (percent) percent.textContent = `${value}%`;
    if (status) status.textContent = label || `Memuat naik visual Cloudinary (${done}/${total})...`;
    if (estimate) estimate.textContent = 'Kemajuan sebenar';
  }

  function withTimeout(promise, milliseconds, message) {
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), milliseconds);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }

  function setSaveUiComplete(isEn) {
    const icon = document.getElementById('downloadStatusIcon');
    const label = document.getElementById('downloadStatusLabel');
    const percent = document.getElementById('downloadPercentText');
    const bar = document.getElementById('downloadProgressBar');
    const status = document.getElementById('downloadFilesStatus');
    const estimate = document.getElementById('downloadTimeEstimate');

    if (icon) {
      icon.textContent = 'check_circle';
      icon.classList.remove('animate-spin', 'text-primary');
      icon.classList.add('text-success');
    }
    if (label) label.textContent = isEn ? 'Visual saving complete' : 'Selesai menyimpan visual 360°';
    if (percent) {
      percent.textContent = '100%';
      percent.classList.remove('text-primary');
      percent.classList.add('text-success');
    }
    if (bar) {
      bar.style.width = '100%';
      bar.classList.remove('bg-primary');
      bar.classList.add('bg-success');
    }
    if (status) status.textContent = isEn ? 'All Cloudinary visuals saved' : 'Semua visual Cloudinary disimpan';
    if (estimate) estimate.textContent = isEn ? 'Complete' : 'Selesai';

    if (btnSaveToDb) {
      btnSaveToDb.disabled = false;
      btnSaveToDb.classList.remove('opacity-60', 'cursor-not-allowed');
      btnSaveToDb.classList.add('cursor-pointer', 'border-success', 'text-success');
      const spanTxt = btnSaveToDb.querySelector('span[data-i18n="btn_save_visual"]');
      if (spanTxt) spanTxt.textContent = isEn ? '✓ Complete' : '✓ Selesai';
    }
  }

  function setSaveUiError(isEn) {
    const icon = document.getElementById('downloadStatusIcon');
    const label = document.getElementById('downloadStatusLabel');
    const estimate = document.getElementById('downloadTimeEstimate');
    if (icon) {
      icon.textContent = 'error';
      icon.classList.remove('animate-spin', 'text-primary');
      icon.classList.add('text-error');
    }
    if (label) label.textContent = isEn ? 'Visual save failed' : 'Simpanan visual gagal';
    if (estimate) estimate.textContent = isEn ? 'Try again' : 'Cuba semula';
  }

  // Upload publicly accessible Impel assets to Cloudinary:
  //   1. Interior pano cube-map (pano/pano_{face}.jpg) — 6 faces, publicly accessible ✅
  //   2. Gallery 8 photos (ec/0-0.jpg, 0-25.jpg...) — publicly accessible ✅
  //   3. Thumbnail (thumb-sm.jpg) — publicly accessible ✅
  // Exterior frames (exterior/full-res/frame-XXX.jpg) are CloudFront-protected — use SpinCar iframe instead.
  // Returns { interiorFacesObj, galleryCloudUrls, thumbnailUrl }
  async function uploadImpelPublicAssetsToCloudinary(cdnPrefix, carLabel, carName, onProgress) {
    const safeLabel  = (carLabel || 'Car').replace(/[/\\:*?"<>|]/g, '-').trim();
    const safeName   = (carName  || 'Unknown').replace(/[/\\:*?"<>|]/g, '-').trim();
    const baseFolder = `model/${safeLabel}/${safeName}`;

    let total = 6 + 8 + 1; // 6 interior + 8 gallery + 1 thumb
    let done  = 0;
    const tick = () => { done++; if (onProgress) onProgress(done, total); };

    // 1. Interior pano cube-map faces (f, b, l, r, u, d)
    const FACES = ['f', 'b', 'l', 'r', 'u', 'd'];
    const faceResults = {};
    await Promise.all(FACES.map(async (face) => {
      try {
        const faceUrl  = `${cdnPrefix}pano/pano_${face}.jpg`;
        const publicId = `${baseFolder}/interior/full-res/pano_${face}`;
        faceResults[face] = await uploadRemoteUrlToCloudinary(faceUrl, publicId);
      } catch (e) {
        console.warn(`[WeDRIVE] Interior face '${face}' skipped:`, e.message);
      } finally { tick(); }
    }));
    const interiorFacesObj = Object.keys(faceResults).length > 0 ? faceResults : null;

    // 2. Gallery 8 ec/ photos
    const galleryCloudUrls = new Array(IMPEL_EC_INDICES.length);
    await Promise.all(IMPEL_EC_INDICES.map(async (idx, index) => {
      try {
        const ecUrl    = `${cdnPrefix}ec/${idx}.jpg`;
        const publicId = `${baseFolder}/gallery/ec-${idx.replace('-','_')}`;
        const url      = await uploadRemoteUrlToCloudinary(ecUrl, publicId);
        // Do not use push() here: Promise.all completes in arbitrary order.
        galleryCloudUrls[index] = url;
      } catch (e) {
        console.warn(`[WeDRIVE] Gallery ec/${idx} skipped:`, e.message);
      } finally { tick(); }
    }));

    // 3. Thumbnail
    let thumbnailUrl = '';
    try {
      thumbnailUrl    = await uploadRemoteUrlToCloudinary(`${cdnPrefix}thumb-sm.jpg`, `${baseFolder}/thumb-sm`);
    } catch (e) {
      console.warn('[WeDRIVE] Thumbnail skipped:', e.message);
    } finally { tick(); }

    return { interiorFacesObj, galleryCloudUrls: galleryCloudUrls.filter(Boolean), thumbnailUrl };
  }

  // Upload all 200 exterior frames through Cloudinary's remote URL fetch.
  // The browser does not read the CDN response, so this works even when Impel
  // omits Access-Control-Allow-Origin.
  async function uploadExteriorFramesToCloudinary(cdnPrefix, carLabel, carName, onProgress) {
    const total = 200;
    const results = new Array(total);
    let cursor = 0;
    let done = 0;
    const concurrency = 6;

    async function worker() {
      while (true) {
        const index = cursor++;
        if (index >= total) return;
        const padded = String(index).padStart(3, '0');
        const remoteUrl = `${cdnPrefix}ec/0-${index}.jpg`;
        const publicId = cloudinaryPublicId(carLabel, carName, 'exterior/full-res', `frame-${padded}.jpg`);
        results[index] = await uploadRemoteUrlToCloudinary(remoteUrl, publicId);
        done += 1;
        if (onProgress) onProgress(done, total);
      }
    }

    await Promise.all(Array.from({ length: concurrency }, worker));
    return results;
  }

  // Manual inspection photos are kept in memory as data URLs until Save
  // Visuals. Convert them to Cloudinary assets before they can enter Supabase.
  async function uploadLocalPhotosToCloudinary(carLabel, carName, onProgress) {
    const photos = (currentGalleryPhotos || []).filter(photo => photo && photo.img);
    const results = [];
    for (let index = 0; index < photos.length; index += 1) {
      const photo = photos[index];
      const source = typeof photo.img === 'string' ? photo.img : '';
      const publicId = cloudinaryPublicId(carLabel, carName, 'gallery', `manual-${String(index).padStart(2, '0')}.jpg`);
      try {
        let url;
        if (source.includes('res.cloudinary.com/')) {
          url = source;
        } else if (source.startsWith('data:')) {
          url = await uploadToCloudinary(await fetch(source).then(response => response.blob()), publicId);
        } else if (/^https?:\/\//i.test(source)) {
          url = await uploadRemoteUrlToCloudinary(source, publicId);
        }
        if (url) results.push(url);
      } finally {
        if (onProgress) onProgress(index + 1, photos.length);
      }
    }
    return results;
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
    let thumbIndices = [...IMPEL_EC_INDICES];

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



    const gallery8Photos = [];
    if (cdnPrefix) {
      thumbIndices.forEach((tid, idx) => {
        const angleId = String(tid);
        const meta = IMPEL_ANGLE_MAP[angleId] || { title: `Sudut ${idx + 1}`, titleEn: `Angle ${idx + 1}`, slot: null };
        gallery8Photos.push({
          id: angleId,
          title: meta.title,
          titleEn: meta.titleEn,
          slot: meta.slot,
          img: `${cdnPrefix}ec/${angleId}.jpg`
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
      angleMapVersion: ANGLE_MAP_VERSION,
      customer: customer,
      vin: vin
    };
  }

  function normaliseGalleryAngle(photo, fallbackIndex) {
    if (!photo || typeof photo !== 'object') return photo;
    const source = typeof photo.img === 'string' ? photo.img : '';
    const urlMatch = source.match(/(?:ec\/|ec-)(0[-_]\d+)\.jpg/i);
    const angleId = String(photo.id || (urlMatch ? urlMatch[1].replace('_', '-') : ''));
    const meta = IMPEL_ANGLE_MAP[angleId];
    if (!meta) return photo;
    return {
      ...photo,
      id: angleId,
      title: meta.title,
      titleEn: meta.titleEn,
      slot: meta.slot,
      order: fallbackIndex
    };
  }

  function inspectionPhotosFromGallery(gallery) {
    const photos = new Array(INSPECTION_SLOTS.length).fill(null);
    (Array.isArray(gallery) ? gallery : []).forEach((photo, index) => {
      const normalised = normaliseGalleryAngle(photo, index);
      if (normalised && Number.isInteger(normalised.slot) && normalised.slot >= 0 && normalised.slot < photos.length) {
        photos[normalised.slot] = {
          title: INSPECTION_SLOTS[normalised.slot].title,
          titleEn: INSPECTION_SLOTS[normalised.slot].titleEn,
          img: normalised.img,
          id: normalised.id
        };
      }
    });
    return photos;
  }

  function galleryAngleIdFromSource(value) {
    const source = typeof value === 'string' ? value : '';
    const match = source.match(/(?:ec\/|ec-)(0[-_]\d+)\.jpg/i);
    return match ? match[1].replace('_', '-') : '';
  }

  function orderGalleryForCards(gallery) {
    const rank = (value) => {
      const id = galleryAngleIdFromSource(value) || (value && value.id ? String(value.id) : '');
      const position = IMPEL_CARD_ORDER.indexOf(id);
      return position === -1 ? IMPEL_CARD_ORDER.length : position;
    };
    return (Array.isArray(gallery) ? gallery : []).slice().sort((a, b) => rank(a) - rank(b));
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
      const uploadedId = getPhotoId(uploaded);
      const isActive = activeVisualMode === 'gallery' && (
        (currentGalleryPhotoId && uploadedId === currentGalleryPhotoId) ||
        (!currentGalleryPhotoId && idx === currentGalleryPhotoIndex)
      );

      if (uploaded && uploaded.img) {
        return `
          <div onclick="window.WeDriveStudio360.selectInspectionPhoto(${idx})" class="relative group rounded-xl h-32 overflow-hidden border border-border-day shadow-xs interactive-btn cursor-pointer transition-all duration-300 ${isActive ? 'ring-2 ring-primary' : ''}">
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

  function getPhotoId(photo) {
    if (!photo) return '';
    if (photo.id) return String(photo.id);
    return galleryAngleIdFromSource(photo.img) || '';
  }

  function getDisplayPhotos() {
    return (currentGallery8Photos && currentGallery8Photos.length > 0)
      ? currentGallery8Photos
      : currentGalleryPhotos.filter(p => p && p.img);
  }

  function getActiveGalleryIndex(photos) {
    if (!Array.isArray(photos) || !photos.length) return -1;
    if (currentGalleryPhotoId) {
      const matchingIndex = photos.findIndex(photo => getPhotoId(photo) === currentGalleryPhotoId);
      if (matchingIndex !== -1) return matchingIndex;
    }
    return Math.min(Math.max(currentGalleryPhotoIndex, 0), photos.length - 1);
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
    const photosToDisplay = getDisplayPhotos();

    if (!photosToDisplay.length) {
      showEmptyState(
        'add_a_photo',
        isEn ? 'No Vehicle Photos' : 'Tiada Imej Visual Kenderaan',
        isEn ? 'Upload vehicle photos from the inspection slots on the left or paste a CDN link.' : 'Sila muat naik foto kenderaan dari slot pemeriksaan di sebelah kiri atau tampal pautan CDN.'
      );
      return;
    }

    const activeIndex = getActiveGalleryIndex(photosToDisplay);
    currentGalleryPhotoIndex = activeIndex >= 0 ? activeIndex : 0;
    const photo = photosToDisplay[currentGalleryPhotoIndex] || photosToDisplay[0];
    if (photo && photo.img) {
      currentGalleryPhotoId = getPhotoId(photo);
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

    const photosToDisplay = getDisplayPhotos();

    if (!photosToDisplay.length) {
      if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.add('hidden');
      return;
    }
    if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.remove('hidden');

    galleryThumbnailsStrip.innerHTML = photosToDisplay.map((photo, idx) => {
      if (!photo || !photo.img) return '';
      const isActive = activeVisualMode === 'gallery' && (
        (currentGalleryPhotoId && getPhotoId(photo) === currentGalleryPhotoId) ||
        (!currentGalleryPhotoId && idx === currentGalleryPhotoIndex)
      );
      const title = isEn ? (photo.titleEn || photo.title) : (photo.title || photo.titleEn);

      return `
        <button type="button" onclick="window.WeDriveStudio360.selectGalleryPhoto(${idx})"
          class="gallery-thumb-btn relative rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md border-transparent' : 'opacity-60 hover:opacity-100 hover:scale-[1.03] border border-border-day bg-surface-container'}"
          style="width: 58px; height: 42px;"
          title="${title}" aria-label="${title}">
          <img src="${photo.img}" alt="${title}" class="w-full h-full object-cover" />
        </button>
      `;
    }).join('');
  }

  // Select a gallery thumbnail. The stable angle ID keeps the right panel and
  // the six inspection slots synchronized even though they use different orderings.
  function selectGalleryPhoto(index) {
    const photosToDisplay = getDisplayPhotos();
    if (!photosToDisplay[index] || !photosToDisplay[index].img) return;
    currentGalleryPhotoIndex = index;
    currentGalleryPhotoId = getPhotoId(photosToDisplay[index]);
    activeVisualMode = 'gallery';
    setVisualTab('gallery');
    updateViewerDisplay();
    renderPhotoUploadSlots();
  }

  function selectInspectionPhoto(slotIndex) {
    const photo = currentGalleryPhotos[slotIndex];
    if (!photo || !photo.img) return;
    currentGalleryPhotoId = getPhotoId(photo);
    activeVisualMode = 'gallery';
    setVisualTab('gallery');
    updateViewerDisplay();
    renderPhotoUploadSlots();
  }

  // Backwards-compatible public alias for any older markup or integrations.
  function selectPhoto(index) {
    selectGalleryPhoto(index);
  }

  // Next / Prev Gallery Navigation
  function navigateGallery(direction) {
    const photosToDisplay = getDisplayPhotos();

    if (!photosToDisplay.length) return;
    const activeIndex = getActiveGalleryIndex(photosToDisplay);
    currentGalleryPhotoIndex = (activeIndex + direction + photosToDisplay.length) % photosToDisplay.length;
    currentGalleryPhotoId = getPhotoId(photosToDisplay[currentGalleryPhotoIndex]);
    activeVisualMode = 'gallery';
    setVisualTab('gallery');
    updateViewerDisplay();
    renderPhotoUploadSlots();
  }

  // Trigger File Upload for specific slot
  function triggerUpload(slotIndex) {
    activeUploadSlotIndex = slotIndex;
    if (slotFileInput) {
      slotFileInput.value = '';
      slotFileInput.click();
    }
  }

  // Save only the in-progress UI draft. Raw file data URLs must never enter
  // Supabase; they are converted to Cloudinary URLs by Save Visuals first.
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
        draft.angle_map_version = currentAngleMapVersion || ANGLE_MAP_VERSION;
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
      currentFolderPlan = isCanonicalFolderPlan(draft.folder_plan)
        ? draft.folder_plan
        : buildFolderPlan(draft);
      if (Array.isArray(draft.gallery8Photos) && draft.gallery8Photos.length > 0) {
        currentGallery8Photos = orderGalleryForCards(draft.gallery8Photos.map(normaliseGalleryAngle).filter(Boolean));
        currentAngleMapVersion = ANGLE_MAP_VERSION;
      }
      const hasStaleGeneratedGallery = Array.isArray(draft.gallery8Photos) &&
        draft.gallery8Photos.length > 0 &&
        draft.angle_map_version !== ANGLE_MAP_VERSION;
      if (!hasStaleGeneratedGallery && Array.isArray(draft.photos) && draft.photos.length > 0) {
        currentGalleryPhotos = draft.photos.map((p, idx) => {
          if (!p) return null;
          if (typeof p === 'string') {
            const slotDef = INSPECTION_SLOTS[idx] || { title: 'Foto', titleEn: 'Photo' };
            return { title: slotDef.title, titleEn: slotDef.titleEn, img: p, id: slotDef.key };
          }
          return p;
        });
        const firstValidIndex = currentGalleryPhotos.findIndex(p => p && p.img);
        if (firstValidIndex !== -1) {
          currentGalleryPhotoIndex = firstValidIndex;
        }
      } else if (hasStaleGeneratedGallery) {
        // Existing drafts created before the corrected Carsome orientation map
        // are rebuilt from their angle IDs instead of showing swapped slots.
        currentGalleryPhotos = inspectionPhotosFromGallery(currentGallery8Photos);
        const firstValidIndex = currentGalleryPhotos.findIndex(p => p && p.img);
        if (firstValidIndex !== -1) currentGalleryPhotoIndex = firstValidIndex;
      } else if (draft.image_url) {
        currentGalleryPhotos[0] = {
          title: INSPECTION_SLOTS[0].title,
          titleEn: INSPECTION_SLOTS[0].titleEn,
          img: draft.image_url,
          id: INSPECTION_SLOTS[0].key
        };
        currentGalleryPhotoIndex = 0;
      }

      const restoredPhoto = currentGalleryPhotos[currentGalleryPhotoIndex] || currentGalleryPhotos.find(p => p && p.img);
      currentGalleryPhotoId = getPhotoId(restoredPhoto);

      if (draft.cdnUrl && cdnUrlInput) {
        cdnUrlInput.value = draft.cdnUrl;
      }

      // Restore the persisted Cloudinary manifest so a second visit to Step 2
      // cannot accidentally replace a saved 360 set with an empty one.
      if (draft.exterior_360 && typeof draft.exterior_360 === 'string' && draft.exterior_360.trim().startsWith('{')) {
        try {
          const manifest = JSON.parse(draft.exterior_360);
          currentCdnPrefix = manifest.cdn_prefix || '';
          currentImpelVin = manifest.vin || '';
          currentImpelCustomer = manifest.customer || '';
        } catch (_) {}
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

    if (!requireStep1BeforeVisuals(isEn)) return;

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
        currentAngleMapVersion = result.angleMapVersion || ANGLE_MAP_VERSION;
        // Store Impel metadata for zero-storage CDN frame URL building
        currentCdnPrefix     = result.cdnPrefix || '';
        currentImpelVin      = result.vin || '';
        currentImpelCustomer = result.customer || '';

        // Auto-fill the 6 vehicle inspection slots with matching angle photos
        if (result.gallery8Photos && result.gallery8Photos.length > 0) {
          currentGallery8Photos = orderGalleryForCards(currentGallery8Photos.map(normaliseGalleryAngle).filter(Boolean));
          currentGalleryPhotos = inspectionPhotosFromGallery(currentGallery8Photos);
          const firstPhoto = currentGalleryPhotos.find(photo => photo && photo.img);
          currentGalleryPhotoIndex = firstPhoto ? currentGalleryPhotos.indexOf(firstPhoto) : 0;
          currentGalleryPhotoId = getPhotoId(firstPhoto);
          renderPhotoUploadSlots();
        }
      } else {
        currentCdnExteriorUrl = url;
        currentCdnInteriorUrl = '';
        currentGallery8Photos = [];
      }

      // Ask the configured AI provider to validate the canonical folder plan.
      // A deterministic local fallback keeps the upload flow working when no
      // AI key is configured or a provider is temporarily unavailable.
      let draftForFolderPlan = {};
      try {
        draftForFolderPlan = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
      } catch (_) {}
      currentFolderPlan = await resolveFolderPlanWithAi(draftForFolderPlan, result || {});
      draftForFolderPlan.folder_plan = currentFolderPlan;
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draftForFolderPlan));

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

      showAiToast(
        isEn
          ? `Folder ready: ${currentFolderPlan.cloudinary_folder}`
          : `Folder disusun: ${currentFolderPlan.cloudinary_folder}`,
        true,
        'folder_open'
      );

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

    if (!requireStep1BeforeVisuals(isEn)) {
      isSavingDb = false;
      return;
    }

    // Show saving state on button immediately
    if (btnSaveToDb) {
      btnSaveToDb.disabled = true;
      const spanTxt = btnSaveToDb.querySelector('span[data-i18n="btn_save_visual"]');
      if (spanTxt) spanTxt.textContent = isEn ? 'Saving...' : 'Menyimpan...';
    }

    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      const draft = raw ? JSON.parse(raw) : {};
      let cloudinaryUploadConfirmed = false;

      // A page refresh restores the viewer URL, but older drafts may only
      // contain the plain SpinCar URL and not the derived CDN prefix. Re-run
      // the same CORS-enabled Impel lookup before saving so Save Visuals can
      // never silently save metadata without uploading the actual assets.
      const sourceSpinCarUrl = cdnUrlInput && cdnUrlInput.value.trim()
        ? cdnUrlInput.value.trim()
        : String(draft.cdnUrl || '').trim();
      const isSpinCarSource = /cdn\.impel\.io|spincar|carsome/i.test(sourceSpinCarUrl);
      if (!currentCdnPrefix && isSpinCarSource) {
        const restoredAssets = await separateSpinCarAssets(sourceSpinCarUrl);
        if (restoredAssets && restoredAssets.cdnPrefix) {
          currentCdnPrefix = restoredAssets.cdnPrefix;
          currentCdnExteriorUrl = restoredAssets.exteriorUrl || sourceSpinCarUrl;
          currentCdnInteriorUrl = restoredAssets.interiorPanoUrl || '';
          currentGallery8Photos = restoredAssets.gallery8Photos || [];
          currentAngleMapVersion = restoredAssets.angleMapVersion || ANGLE_MAP_VERSION;
          currentImpelVin = restoredAssets.vin || currentImpelVin;
          currentImpelCustomer = restoredAssets.customer || currentImpelCustomer;
        }
      }
      if (isSpinCarSource && !currentCdnPrefix) {
        throw new Error(isEn
          ? 'SpinCar CDN data could not be read. Click Generate AI again before saving.'
          : 'Data CDN SpinCar tidak dapat dibaca. Klik Jana AI semula sebelum menyimpan.');
      }

      const existingCloudFrames = Array.isArray(draft.exterior_frames)
        ? draft.exterior_frames.filter(url => typeof url === 'string' && url.includes('res.cloudinary.com/'))
        : [];
      draft.downloaded = true;
      draft.downloaded_at = new Date().toISOString();
      draft.photos = currentGalleryPhotos;
      draft.gallery8Photos = currentGallery8Photos;
      draft.angle_map_version = currentAngleMapVersion || ANGLE_MAP_VERSION;
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

      // Create the complete folder tree first through Cloudinary Admin API.
      // If the Edge Function has not received the Admin API secrets yet,
      // Cloudinary's upload API will still create the same deterministic
      // hierarchy from public_id + asset_folder. Do not block a valid save
      // because an optional empty-folder pre-creation request is unavailable.
      if (currentCdnPrefix || currentGalleryPhotos.some(photo => photo && photo.img) || existingCloudFrames.length > 0) {
        currentFolderPlan = buildFolderPlan(draft);
        try {
          await createCloudinaryFolders(currentFolderPlan.cloudinary_folder);
        } catch (folderError) {
          if (!isCloudinaryAdminConfigurationError(folderError)) throw folderError;
          console.warn('[WeDRIVE Studio] Cloudinary Admin secrets are not configured; upload will create the folder hierarchy.', folderError);
          showAiToast(
            isEn
              ? 'Cloudinary folder will be created automatically during upload.'
              : 'Folder Cloudinary akan dicipta automatik semasa muat naik.',
            true,
            'create_new_folder'
          );
        }
      }

      // ── Cloudinary Upload (200 exterior + interior + gallery + thumb) ──
      if (currentCdnPrefix) {
        // Rebuild from the current Step 1 draft on every save. A stale draft
        // must never send a new vehicle back into `wedrive-model`.
        currentFolderPlan = buildFolderPlan(draft);
        const carLabel = currentFolderPlan.category;
        const carName  = currentFolderPlan.model_name;
        const localModelPath = currentFolderPlan.local_model_path;
        const cloudinaryFolder = currentFolderPlan.cloudinary_folder;
        const totalCloudinaryAssets = 215;

        updateCloudinaryProgress(0, totalCloudinaryAssets, isEn
          ? 'Uploading 200 exterior frames to Cloudinary...'
          : 'Memuat naik 200 frame exterior ke Cloudinary...');
        showAiToast(isEn ? 'Uploading 200 exterior frames...' : 'Memuat naik 200 frame exterior...', true, 'cloud_upload');

        const exteriorCloudUrls = await uploadExteriorFramesToCloudinary(
          currentCdnPrefix, carLabel, carName,
          (done, total) => updateCloudinaryProgress(done, totalCloudinaryAssets, isEn
            ? `Exterior frames uploaded (${done}/${total})`
            : `Frame exterior dimuat naik (${done}/${total})`)
        );

        const { interiorFacesObj, galleryCloudUrls, thumbnailUrl } = await uploadImpelPublicAssetsToCloudinary(
          currentCdnPrefix, carLabel, carName,
          (done, total) => updateCloudinaryProgress(200 + done, totalCloudinaryAssets, isEn
            ? `Supporting visuals uploaded (${done}/${total})`
            : `Visual sokongan dimuat naik (${done}/${total})`)
        );

        // Interior: save 6-face JSON
        if (interiorFacesObj && Object.keys(interiorFacesObj).length > 0) {
          draft.interior_360 = JSON.stringify(interiorFacesObj);
        }

        // Gallery: save Cloudinary photo URLs (override ec/ gallery)
        if (galleryCloudUrls.length > 0) {
          const orderedGalleryCloudUrls = orderGalleryForCards(galleryCloudUrls);
          draft.supabase_images = orderedGalleryCloudUrls;
          draft.cloudinary_gallery = orderedGalleryCloudUrls;
          draft.images = orderedGalleryCloudUrls;
          // The hero image must also point at Cloudinary after Save Visuals.
          // Keep the original CDN URL only as source metadata for re-processing.
          // `0-100` is the front three-quarter view used by the public car
          // cards. The old code used `0-0`, which is a rear three-quarter view.
          const frontQuarterUrl = orderedGalleryCloudUrls[0];
          if (frontQuarterUrl) draft.image_url = frontQuarterUrl;
          else if (orderedGalleryCloudUrls[0]) draft.image_url = orderedGalleryCloudUrls[0];
        }

        if (!Array.isArray(exteriorCloudUrls) || exteriorCloudUrls.length !== 200 ||
            exteriorCloudUrls.some(url => typeof url !== 'string' || !url.includes('res.cloudinary.com/'))) {
          throw new Error('Cloudinary upload tidak lengkap: 200 frame exterior belum tersedia.');
        }
        cloudinaryUploadConfirmed = true;

        // Thumbnail override
        if (thumbnailUrl) draft.thumbnail_url = thumbnailUrl;

        // Exterior 360: Cloudinary URLs are the persisted turntable source.
        draft.exterior_frames = exteriorCloudUrls;
        draft.cloudinary_exterior_frames = exteriorCloudUrls;
        draft.local_model_path = localModelPath;
        draft.cloudinary_folder = cloudinaryFolder;
        draft.folder_plan = currentFolderPlan;
        draft.exterior_360 = JSON.stringify({
          type: 'cloudinary',
          cloud_name: CLOUDINARY_CLOUD,
          folder: cloudinaryFolder,
          cdn_prefix: currentCdnPrefix,
          vin: currentImpelVin,
          customer: currentImpelCustomer,
          frame_count: exteriorCloudUrls.length,
          frame_pattern: 'exterior/full-res/frame-{padded}.jpg'
        });
        draft.supabase_360 = currentCdnExteriorUrl;
        draft.has_360      = exteriorCloudUrls.length === 200;
        draft.has360       = draft.has_360;

        updateCloudinaryProgress(totalCloudinaryAssets, totalCloudinaryAssets, isEn
          ? 'All Cloudinary visuals uploaded'
          : 'Semua visual Cloudinary berjaya dimuat naik');

      } else if (existingCloudFrames.length > 0) {
        // Re-saving an already processed car must preserve the Cloudinary
        // turntable. Only upload newly selected non-Cloudinary photos below.
        draft.exterior_frames = existingCloudFrames;
        draft.cloudinary_exterior_frames = existingCloudFrames;
        draft.has_360 = true;
        draft.has360 = true;
        cloudinaryUploadConfirmed = true;
        const existingGallery = Array.isArray(draft.cloudinary_gallery)
          ? draft.cloudinary_gallery.filter(url => typeof url === 'string' && url.includes('res.cloudinary.com/'))
          : [];
        if (existingGallery.length > 0) {
          draft.images = existingGallery;
          draft.supabase_images = existingGallery;
          draft.image_url = draft.image_url && draft.image_url.includes('res.cloudinary.com/')
            ? draft.image_url
            : existingGallery[0];
        }
      } else if (currentGalleryPhotos.some(photo => photo && photo.img)) {
        currentFolderPlan = buildFolderPlan(draft);
        const localCloudinaryUrls = await uploadLocalPhotosToCloudinary(
          currentFolderPlan.category,
          currentFolderPlan.model_name,
          (done, total) => updateCloudinaryProgress(done, total, isEn
            ? `Photos uploaded (${done}/${total})`
            : `Foto dimuat naik (${done}/${total})`)
        );
        draft.cloudinary_gallery = localCloudinaryUrls;
        draft.supabase_images = localCloudinaryUrls;
        draft.images = localCloudinaryUrls;
        if (localCloudinaryUrls[0]) draft.image_url = localCloudinaryUrls[0];
        draft.exterior_frames = [];
        draft.cloudinary_exterior_frames = [];
        draft.has_360 = false;
        draft.has360 = false;
        draft.exterior_360 = null;
        draft.supabase_360 = null;
        cloudinaryUploadConfirmed = localCloudinaryUrls.length > 0;
      }

      if (!cloudinaryUploadConfirmed) {
        throw new Error(isEn
          ? 'No Cloudinary visual was uploaded. Click Generate AI first or upload a vehicle photo.'
          : 'Tiada visual Cloudinary dimuat naik. Klik Jana AI dahulu atau muat naik foto kenderaan.');
      }

      // Always persist the same plate-specific folder used by the upload
      // public IDs. This repairs older drafts that still contain the old
      // no-plate folder in `cloudinary_folder`.
      currentFolderPlan = buildFolderPlan(draft);
      draft.cloudinary_folder = currentFolderPlan.cloudinary_folder;
      draft.local_model_path = currentFolderPlan.local_model_path;
      draft.folder_plan = currentFolderPlan;

      if (cdnUrlInput && cdnUrlInput.value.trim()) {
        draft.cdnUrl         = cdnUrlInput.value.trim();
        draft.cdnUrlExterior = currentCdnExteriorUrl;
        draft.has360         = has360Expanded;
      }

      // Save to localStorage (primary — always succeeds instantly)
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));

      // Sync the car draft and Cloudinary asset manifest to Supabase.
      if (window.WeDriveAPI && typeof window.WeDriveAPI.saveCarDraft === 'function') {
        const draftResult = await withTimeout(
          window.WeDriveAPI.saveCarDraft(draft),
          15000,
          'Supabase draft sync timed out.'
        );
        if (draftResult && draftResult.error) throw new Error(draftResult.error.message || draftResult.error);
        if (draftResult && draftResult.data && draftResult.data.id) {
          draft.supabase_draft_id = draftResult.data.id;
          localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));
        }
      }

      if (window.WeDriveAPI && typeof window.WeDriveAPI.saveCarVisualAsset === 'function' &&
          cloudinaryUploadConfirmed &&
          (currentCdnPrefix || (Array.isArray(draft.cloudinary_gallery) && draft.cloudinary_gallery.length > 0) || existingCloudFrames.length > 0)) {
        currentFolderPlan = buildFolderPlan(draft);
        const category = currentFolderPlan.category;
        const modelName = currentFolderPlan.model_name;
        let interiorFaces = {};
        try {
          interiorFaces = typeof draft.interior_360 === 'string'
            ? JSON.parse(draft.interior_360)
            : (draft.interior_360 || {});
        } catch (_) {}
        const assetResult = await withTimeout(window.WeDriveAPI.saveCarVisualAsset({
          car_id: draft.supabase_draft_id || null,
          model_key: `${String(category)}_${String(modelName)}`.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
          model_name: modelName,
          category,
          vin: currentImpelVin,
          local_model_path: draft.local_model_path || `${category}/${modelName}`,
          source_viewer_url: draft.cdnUrl || currentCdnExteriorUrl || null,
          source_listing_url: draft.source_listing_url || draft.listing_url || null,
          cdn_prefix: currentCdnPrefix || null,
          cloudinary_folder: draft.cloudinary_folder || '',
          cloudinary_thumbnail_url: draft.thumbnail_url || null,
          cloudinary_gallery: draft.supabase_images || [],
          cloudinary_exterior_frames: draft.exterior_frames || [],
          cloudinary_interior_faces: interiorFaces,
          frame_count: Array.isArray(draft.exterior_frames) ? draft.exterior_frames.length : 0,
          status: Array.isArray(draft.exterior_frames) && draft.exterior_frames.length === 200 ? 'ready' : 'failed'
        }), 15000, 'Supabase visual asset sync timed out.');
        if (assetResult && assetResult.error) throw new Error(assetResult.error.message || assetResult.error);
      }

      setSaveUiComplete(isEn);
      showAiToast(isEn ? '✓ Visual assets saved!' : '✓ Aset visual disimpan!', true, 'cloud_done');

    } catch (e) {
      console.warn('[WeDRIVE Studio] handleSaveVisuals error:', e);
      setSaveUiError(isEn);
      if (btnSaveToDb) {
        btnSaveToDb.disabled = false;
        btnSaveToDb.classList.remove('opacity-60', 'cursor-not-allowed');
        btnSaveToDb.classList.add('cursor-pointer');
        const spanTxt = btnSaveToDb.querySelector('span[data-i18n="btn_save_visual"]');
        if (spanTxt) spanTxt.textContent = isEn ? 'Save Visuals' : 'Simpan Visual';
      }
      const detail = e && e.message ? ` (${e.message})` : '';
      showAiToast(
        isEn ? `Save failed. Please try again.${detail}` : `Simpan gagal. Cuba semula.${detail}`,
        false,
        'error'
      );
    } finally {
      isSavingDb = false;
      // Keep the completed percentage visible so the admin can verify the
      // actual number of Cloudinary uploads.
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
          img: dataUrl,
          id: slotDef.key
        };
        currentGalleryPhotoIndex = activeUploadSlotIndex;
        currentGalleryPhotoId = slotDef.key;
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
    selectGalleryPhoto: selectGalleryPhoto,
    selectInspectionPhoto: selectInspectionPhoto,
    triggerUpload: triggerUpload,
    saveVisualDraft: saveVisualDraft
  };

  // Visual Gatekeeper: Block forward navigation if photos/360 are missing
  function validateStep2Visuals(e) {
    const storedDraft = readCarDraft();
    try {
      const stored = storedDraft;
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

    const hasCdnSource = Boolean(
      storedDraft.cdnUrl || storedDraft.cdnUrlExterior || storedDraft.turntableUrl ||
      (cdnUrlInput && cdnUrlInput.value.trim())
    );
    const cloudinaryGallery = [
      ...(Array.isArray(storedDraft.cloudinary_gallery) ? storedDraft.cloudinary_gallery : []),
      ...(Array.isArray(storedDraft.supabase_images) ? storedDraft.supabase_images : []),
      ...(Array.isArray(storedDraft.images) ? storedDraft.images : [])
    ].filter(url => typeof url === 'string' && url.includes('res.cloudinary.com/'));
    const hasCloudinaryFrames = Array.isArray(storedDraft.exterior_frames) && storedDraft.exterior_frames.length > 0;
    if (hasCdnSource && !hasCloudinaryFrames) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isEn = getLang() === 'en';
      showAiToast(
        isEn
          ? 'Save the CDN visual assets to Cloudinary before continuing.'
          : 'Simpan aset visual CDN ke Cloudinary dahulu sebelum meneruskan.',
        false,
        'cloud_upload'
      );
      return false;
    }

    const hasUnpersistedVisual = (currentGalleryPhotos && currentGalleryPhotos.some(p => p && p.img)) ||
                                 (currentGallery8Photos && currentGallery8Photos.length > 0) ||
                                 Boolean(currentCdnExteriorUrl || (cdnUrlInput && cdnUrlInput.value.trim()));
    if (hasUnpersistedVisual && cloudinaryGallery.length === 0 && !hasCloudinaryFrames) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const isEn = getLang() === 'en';
      showAiToast(
        isEn
          ? 'Save Visuals first so all media is uploaded to Cloudinary.'
          : 'Klik Simpan Visual dahulu supaya semua media dimuat naik ke Cloudinary.',
        false,
        'cloud_upload'
      );
      return false;
    }

    const hasAnyPhoto = cloudinaryGallery.length > 0 || hasCloudinaryFrames;
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
