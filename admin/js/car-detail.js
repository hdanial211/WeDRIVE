/**
 * WeDRIVE - Admin Vehicle 360° Studio & Fleet Profile Hub JS
 * admin/js/car-detail.js
 * 
 * Exclusively focused on vehicle intelligence, interactive 360° camera inspection,
 * technical specifications, equipment matrix, and telemetry health (Zero booking dependencies).
 */

const IMG_BASE = '../../../../shared/model/';
let allCars = [];
let activeCar = null;
let currentMode = 'exterior'; // 'exterior' | 'interior' | 'gallery'

// Dynamic Model Registry (loaded from registry.json — Zero Hardcode)
let modelRegistry = null;

// 360 Exterior Spin State
let exteriorFrames = [];
let currentFrameIndex = 0;
let isDragging360 = false;
let startDragX = 0;
let startFrameOnDrag = 0;
let autoSpinTimer = null;
let isAutoSpinning = false;

// 360 Interior Cockpit State (Continuous 3D Panoramas)
let interiorViewerApi = null;
let isCockpitAutoDrift = false;

// Photo Gallery State
let galleryImages = [];
let currentGalleryIndex = 0;

/* ─────────────────────────────────────────────────────────────────────────────
   0. DYNAMIC MODEL REGISTRY ENGINE (Zero Hardcode — Auto-Detect)
   ───────────────────────────────────────────────────────────────────────────── */
async function loadModelRegistry() {
  if (modelRegistry) return modelRegistry;
  try {
    const res = await fetch(IMG_BASE + 'registry.json');
    modelRegistry = await res.json();
    return modelRegistry;
  } catch (err) {
    console.warn('[360° Registry] Could not load registry.json:', err);
    modelRegistry = {};
    return modelRegistry;
  }
}

/**
 * Smart-match a car record to its registry entry by scoring word overlap.
 * Returns { key, entry } or null if no match found (minimum 2 matching words).
 */
function findRegistryEntry(car) {
  if (!modelRegistry || !car || !car.name) return null;

  const carWords = car.name.toLowerCase().split(/[\s\-]+/);
  let bestKey = null;
  let bestEntry = null;
  let bestScore = 0;

  for (const [key, entry] of Object.entries(modelRegistry)) {
    // Exact label match — instant return
    if (car.name === entry.label) return { key, entry };

    const labelWords = entry.label.toLowerCase().split(/[\s\-]+/);
    let score = 0;
    for (const cw of carWords) {
      if (labelWords.includes(cw)) score++;
    }

    if (score > bestScore && score >= 2) {
      bestScore = score;
      bestKey = key;
      bestEntry = entry;
    }
  }

  return bestEntry ? { key: bestKey, entry: bestEntry } : null;
}

/**
 * Check if a car has 360° exterior turntable assets.
 */
function carHasExterior360(car) {
  if (!car) return false;
  if (car.has_360 === false && !car.exterior_360 && (!Array.isArray(car.exterior_frames) || !car.exterior_frames.length)) return false;
  if (car.exterior_360 && typeof car.exterior_360 === 'string' && car.exterior_360.trim().length > 5) return true;
  if (Array.isArray(car.exterior_frames) && car.exterior_frames.length > 0) return true;
  if (findRegistryEntry(car) && car.has_360 !== false) return true;
  return false;
}

/**
 * Check if a car has 360° interior panorama assets.
 */
function carHasInterior360(car) {
  if (!car) return false;
  if (car.has_360 === false && !car.interior_360) return false;
  if (car.interior_360 && typeof car.interior_360 === 'string' && car.interior_360.trim().length > 5) return true;
  if (findRegistryEntry(car) && car.has_360 !== false) return true;
  return false;
}

/**
 * Check if a car has any 360° assets.
 */
function carHas360(car) {
  return carHasExterior360(car) || carHasInterior360(car);
}

// Resolve any image string to a valid src
function resolveImgSrc(img) {
  if (!img) return '';
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
  return IMG_BASE + img;
}

// Extract car ID from URL search params
const urlParams = new URLSearchParams(window.location.search);
let paramId = urlParams.get('id');
let selectedCarId = paramId !== null ? (isNaN(Number(paramId)) ? paramId : Number(paramId)) : null;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initVehicleStudio();
});

async function initVehicleStudio() {
  try {
    // Load model registry and car data in parallel (Zero Hardcode)
    const [, data] = await Promise.all([
      loadModelRegistry(),
      window.WeDriveAPI.getAdminData()
    ]);
    allCars = data.car || [];

    if (allCars.length === 0) {
      console.warn('No cars found in database.');
      return;
    }

    // Find requested car or fallback to first car
    if (selectedCarId !== null) {
      activeCar = allCars.find(c => String(c.id) === String(selectedCarId)) || allCars[0];
    } else {
      activeCar = allCars[0];
    }
    selectedCarId = activeCar ? activeCar.id : 1;

    renderFleetSelector();
    loadCarProfile(activeCar);
  } catch (err) {
    console.error('Failed to load vehicle data:', err);
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. FLEET SELECTOR BAR
   ───────────────────────────────────────────────────────────────────────────── */
function renderFleetSelector() {
  const container = document.getElementById('cd-fleet-selector');
  if (!container) return;

  container.innerHTML = allCars.map(c => {
    const isActive = String(c.id) === String(selectedCarId);
    const thumbSrc = (c.images && c.images.length > 0) ? resolveImgSrc(c.images[0]) : (c.image_url ? resolveImgSrc(c.image_url) : '');
    const has360Badge = carHas360(c) ?
      '<span class="badge-360 fs-9 py-2 px-6">360°</span>' : '';

    return `
      <button class="fleet-car-chip ${isActive ? 'active' : ''}" onclick="selectFleetCar('${c.id}')" title="${c.name}">
        <img src="${thumbSrc}" class="fleet-chip-thumb" alt="${c.name}" onerror="this.src='../../../../shared/logo/wedrive-icon.png';" />
        <div class="fleet-chip-info">
          <div class="fleet-chip-name">${c.name}</div>
          <div class="fleet-chip-meta">
            <span>${c.plate || '--'}</span>
            <span>·</span>
            <span class="text-capitalize">${c.type || 'Sedan'}</span>
            ${has360Badge}
          </div>
        </div>
      </button>
    `;
  }).join('');
}

function selectFleetCar(carId) {
  if (String(selectedCarId) === String(carId)) return;

  selectedCarId = carId;
  activeCar = allCars.find(c => String(c.id) === String(carId));

  // Update URL without reload
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('id', carId);
  window.history.pushState({ id: carId }, '', newUrl);

  // Stop auto spin if running
  if (isAutoSpinning) toggleAutoSpin();

  renderFleetSelector();
  loadCarProfile(activeCar);
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. LOAD CAR PROFILE & SPECIFICATIONS
   ───────────────────────────────────────────────────────────────────────────── */
function loadCarProfile(car) {
  if (!car) return;

  document.title = `${car.name} · Studio 360° | WeDRIVE`;

  // Hero Card Identity
  const nameEl = document.getElementById('cd-name');
  if (nameEl) nameEl.textContent = car.name;

  const plateEl = document.getElementById('cd-plate');
  if (plateEl) plateEl.textContent = car.plate;

  const typeEl = document.getElementById('cd-type-pill');
  if (typeEl) typeEl.textContent = (car.type || 'Sedan').toUpperCase();

  const statusEl = document.getElementById('cd-status');
  if (statusEl) {
    const isEn = localStorage.getItem('wedrive_lang') === 'en';
    const isAvail = (car.status || 'Available').toLowerCase() === 'available';
    const statusLabel = isAvail ? (isEn ? 'Available' : 'Tersedia') : (isEn ? 'Rented' : 'Sedang Disewa');
    statusEl.className = `status-badge ${isAvail ? 'available' : 'rented'}`;
    statusEl.innerHTML = `<span class="dot"></span> ${statusLabel}`;
  }

  // Commercial rate & deposit
  const rateText = car.rate || (car.price ? `RM ${car.price}/hari` : 'RM 250/hari');
  const rateEl = document.getElementById('cd-rate');
  if (rateEl) rateEl.textContent = rateText;

  const rateBadgeEl = document.getElementById('spec-rate-badge');
  if (rateBadgeEl) rateBadgeEl.textContent = rateText;

  // Technical specifications setup (dynamically generated based on car model/type)
  setupCarSpecs(car);

  // Initialize Photo Gallery
  setupPhotoGallery(car);

  // Initialize 360 exterior spin frames (if available)
  setupExterior360(car);

  // Initialize interior cockpit (if available)
  setupInteriorCockpit(car);

  // Initialize Equipment Matrix
  setupEquipmentMatrix(car);

  // Progressive Visual Disclosure: Update tabs and activate appropriate initial mode
  updateStudioTabs(car);
}

/* ─────────────────────────────────────────────────────────────────────────────
   2B. PROGRESSIVE STUDIO TABS & CONTEXTUAL TITLE ENGINE (RULE 04 SECTION 9)
   ───────────────────────────────────────────────────────────────────────────── */
function updateStudioTabs(car) {
  const hasExt = carHasExterior360(car);
  const hasInt = carHasInterior360(car);
  const has360Any = hasExt || hasInt;

  const tabExt = document.getElementById('tab-exterior');
  const tabInt = document.getElementById('tab-interior');
  const tabGal = document.getElementById('tab-gallery');

  if (tabExt) {
    tabExt.classList.toggle('tab-hidden', !hasExt);
    tabExt.style.display = hasExt ? 'inline-flex' : 'none';
  }
  if (tabInt) {
    tabInt.classList.toggle('tab-hidden', !hasInt);
    tabInt.style.display = hasInt ? 'inline-flex' : 'none';
  }
  if (tabGal) tabGal.style.display = 'inline-flex';

  // Dynamic Page Title & Subtitle Adaptation
  const titleEl = document.getElementById('cd-top-title');
  const subtitleEl = document.getElementById('cd-top-subtitle');
  const isEn = localStorage.getItem('wedrive_lang') === 'en';

  if (titleEl) {
    if (has360Any) {
      titleEl.setAttribute('data-key', 'cd_title');
      titleEl.textContent = isEn ? 'Car Studio & Technical Details' : 'Studio & Maklumat Terperinci Kereta';
    } else {
      titleEl.setAttribute('data-key', 'cd_title_gallery');
      titleEl.textContent = isEn ? 'Vehicle Gallery & Detailed Profile' : 'Galeri & Maklumat Terperinci Kereta';
    }
  }

  if (subtitleEl) {
    if (has360Any) {
      subtitleEl.setAttribute('data-key', 'cd_subtitle');
      subtitleEl.textContent = isEn ? 'Interactive 360° exterior spin, 3D interior panorama, and operational parameters.' : 'Putaran interaktif 360° luaran, panorama 3D ruang dalaman, dan parameter operasi.';
    } else {
      subtitleEl.setAttribute('data-key', 'cd_subtitle_gallery');
      subtitleEl.textContent = isEn ? 'High-definition photo gallery inspection and rental operational parameters.' : 'Pemeriksaan galeri foto berkualiti tinggi dan parameter spesifikasi operasi sewaan.';
    }
  }

  // Determine initial active mode based on actual assets available
  let defaultMode = 'gallery';
  if (hasExt) {
    defaultMode = 'exterior';
  } else if (hasInt) {
    defaultMode = 'interior';
  }

  switchStudioMode(defaultMode);
}

function setupCarSpecs(car) {
  // 1. ID Inventori Sistem (Primary Key Database)
  const carIdFormatted = car.id ? `#CAR-${String(car.id).padStart(3, '0')}` : '#CAR-001';
  setText('spec-id', carIdFormatted);

  // 2. Tahun Pembuatan (Kolum: year)
  setText('spec-year', `${car.year || 2023}`);

  // 3. Warna Luaran Rasmi (Kolum: color)
  setText('spec-color', car.color || 'Alpine White');

  // 4. Sistem Transmisi (Kolum: transmission / trans)
  const rawTrans = (car.transmission || car.trans || 'Auto').trim();
  const transLabel = rawTrans.toLowerCase().includes('auto') ? 'Automatik (Auto)' : rawTrans.toLowerCase().includes('manual') ? 'Manual (MT)' : rawTrans;
  setText('spec-trans', transLabel);

  // 5. Punca Kuasa / Bahan Api (Kolum: fuel)
  setText('spec-fuel', car.fuel || 'Petrol');

  // 6. Kapasiti Tempat Duduk (Kolum: seats)
  setText('spec-seats', `${car.seats || 5} Tempat Duduk`);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. STUDIO 360° EXTERIOR SPIN ENGINE (FULLY DYNAMIC — ZERO HARDCODE)
   ───────────────────────────────────────────────────────────────────────────── */
async function resolveSpinCarFrames(url) {
  if (!url || typeof url !== 'string') return null;
  const isSpinCar = /cdn\.impel\.io|spincar|carsome/i.test(url);
  if (!isSpinCar) return null;

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
  if (!vin) return null;

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
          let cdnPrefix = data.cdn_image_prefix;
          if (cdnPrefix.startsWith('//')) cdnPrefix = 'https:' + cdnPrefix;
          if (!cdnPrefix.endsWith('/')) cdnPrefix += '/';

          const opts = (data.info && data.info.options) || {};
          const numTotalFrames = (opts.numImgEC && typeof opts.numImgEC === 'number') ? opts.numImgEC : 200;
          const sampleCount = 36;
          const frontOffset = 125;
          const frames = [];
          for (let i = 0; i < sampleCount; i++) {
            const frameNum = (frontOffset + Math.round(i * (numTotalFrames / sampleCount))) % numTotalFrames;
            frames.push(`${cdnPrefix}ec/0-${frameNum}.jpg`);
          }
          return frames;
        }
      }
    } catch (err) {
      console.warn('[WeDRIVE Car Detail] SpinCar CDN frames resolve notice:', err);
    }
  }
  return null;
}

function injectFallbackIframe(url) {
  const stageImg = document.getElementById('studio-canvas-stage');
  const fallbackIcon = document.getElementById('studio-fallback-icon');
  const exteriorStage = document.getElementById('studio-exterior-stage');

  const oldIframe = document.getElementById('studio-exterior-iframe');
  if (oldIframe) oldIframe.remove();

  if (stageImg) stageImg.style.display = 'none';
  if (fallbackIcon) fallbackIcon.classList.add('hidden');

  const iframe = document.createElement('iframe');
  iframe.id = 'studio-exterior-iframe';
  iframe.src = url;
  iframe.allow = 'fullscreen; xr-spatial-tracking';
  iframe.setAttribute('allowfullscreen', '');
  iframe.style.cssText = [
    'width:100%', 'height:100%', 'border:none',
    'border-radius:inherit', 'display:block',
    'position:absolute', 'inset:0', 'z-index:2'
  ].join(';');

  if (exteriorStage) {
    exteriorStage.style.position = 'relative';
    exteriorStage.appendChild(iframe);
  }

  const anglePill = document.getElementById('studio-angle-pill');
  if (anglePill) anglePill.style.display = 'none';
}

function activateFrameViewer() {
  const stageImg = document.getElementById('studio-canvas-stage');
  const fallbackIcon = document.getElementById('studio-fallback-icon');
  const anglePill = document.getElementById('studio-angle-pill');

  const oldIframe = document.getElementById('studio-exterior-iframe');
  if (oldIframe) oldIframe.remove();

  if (stageImg) {
    stageImg.classList.remove('hidden');
    stageImg.style.display = 'block';
    stageImg.src = resolveImgSrc(exteriorFrames[0]);
  }
  if (fallbackIcon) fallbackIcon.classList.add('hidden');

  if (anglePill) anglePill.style.display = '';

  currentFrameIndex = 0;
  updateAnglePill(0);
  bind360DragEvents();

  // Zero-lag 60fps image preloading
  exteriorFrames.forEach(frameUrl => {
    const img = new Image();
    img.src = resolveImgSrc(frameUrl);
  });
}

function setupExterior360(car) {
  const stageImg = document.getElementById('studio-canvas-stage');
  const fallbackIcon = document.getElementById('studio-fallback-icon');
  exteriorFrames = [];
  currentFrameIndex = 0;

  if (!carHasExterior360(car)) {
    if (stageImg) stageImg.style.display = 'none';
    if (fallbackIcon) fallbackIcon.classList.add('hidden');
    return;
  }

  // ── Case 1: Local Carsome frame registry ──
  const match = findRegistryEntry(car);
  if (match) {
    const basePath = match.entry.sourceJson.replace(/\/source\.json$/i, '');
    const frontOffset = 125;
    const sampleCount = 36;
    const totalFrames = 200;
    for (let i = 0; i < sampleCount; i++) {
      const frameNum = (frontOffset + Math.round(i * (totalFrames / sampleCount))) % totalFrames;
      const padded = String(frameNum).padStart(3, '0');
      exteriorFrames.push(`${basePath}/exterior/full-res/frame-${padded}.jpg`);
    }
  } else if (Array.isArray(car.exterior_frames) && car.exterior_frames.length > 0) {
    // ── Case 2: Explicit frames array ──
    exteriorFrames = [...car.exterior_frames];
  } else if (car.exterior_360 && typeof car.exterior_360 === 'string' && !car.exterior_360.startsWith('http')) {
    // ── Case 3: Local relative path to frames folder ──
    const basePath = car.exterior_360.replace(/\/exterior\/full-res$/i, '').replace(/\/+$/, '');
    const frontOffset = 125;
    const sampleCount = 36;
    const totalFrames = 200;
    for (let i = 0; i < sampleCount; i++) {
      const frameNum = (frontOffset + Math.round(i * (totalFrames / sampleCount))) % totalFrames;
      const padded = String(frameNum).padStart(3, '0');
      exteriorFrames.push(`${basePath}/exterior/full-res/frame-${padded}.jpg`);
    }
  }

  if (exteriorFrames.length > 0) {
    activateFrameViewer();
    return;
  }

  // ── Case 4: SpinCar / CDN external URL (Auto-resolve 36 frames or fallback iframe) ──
  if (car.exterior_360 && typeof car.exterior_360 === 'string' && car.exterior_360.startsWith('http')) {
    if (/cdn\.impel\.io|spincar|carsome/i.test(car.exterior_360)) {
      resolveSpinCarFrames(car.exterior_360).then(frames => {
        if (frames && frames.length > 0) {
          car.exterior_frames = frames;
          exteriorFrames = [...frames];
          activateFrameViewer();
        } else {
          injectFallbackIframe(car.exterior_360);
        }
      });
    } else {
      injectFallbackIframe(car.exterior_360);
    }
    return;
  }

  if (stageImg) stageImg.style.display = 'none';
  if (fallbackIcon) fallbackIcon.classList.remove('hidden');
}

function bind360DragEvents() {
  const stage = document.getElementById('studio-exterior-stage');
  if (!stage || stage._dragBound) return;
  stage._dragBound = true;

  // Mouse Drag
  stage.addEventListener('mousedown', (e) => {
    if (e.target.closest('.studio-fullscreen-btn') || e.target.closest('.studio-controls-bar') || e.target.closest('.studio-angle-indicator')) return;
    isDragging360 = true;
    startDragX = e.clientX;
    startFrameOnDrag = currentFrameIndex;
    if (isAutoSpinning) toggleAutoSpin();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging360 || exteriorFrames.length === 0) return;
    const deltaX = e.clientX - startDragX;
    const sensitivity = 12; // pixels per frame
    const frameDelta = Math.floor(deltaX / sensitivity);

    let newIndex = (startFrameOnDrag - frameDelta) % exteriorFrames.length;
    if (newIndex < 0) newIndex += exteriorFrames.length;

    set360Frame(newIndex);
  });

  window.addEventListener('mouseup', () => {
    isDragging360 = false;
  });

  // Touch Swipe
  stage.addEventListener('touchstart', (e) => {
    if (e.target.closest('.studio-fullscreen-btn') || e.target.closest('.studio-controls-bar')) return;
    isDragging360 = true;
    startDragX = e.touches[0].clientX;
    startFrameOnDrag = currentFrameIndex;
    if (isAutoSpinning) toggleAutoSpin();
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging360 || exteriorFrames.length === 0) return;
    const deltaX = e.touches[0].clientX - startDragX;
    const sensitivity = 12;
    const frameDelta = Math.floor(deltaX / sensitivity);

    let newIndex = (startFrameOnDrag - frameDelta) % exteriorFrames.length;
    if (newIndex < 0) newIndex += exteriorFrames.length;

    set360Frame(newIndex);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging360 = false;
  });
}

function set360Frame(index) {
  if (exteriorFrames.length === 0) return;
  currentFrameIndex = index;

  const stageImg = document.getElementById('studio-canvas-stage');
  if (stageImg) {
    stageImg.src = resolveImgSrc(exteriorFrames[index]);
  }

  updateAnglePill(index);
}

function updateAnglePill(index) {
  if (exteriorFrames.length === 0) return;
  const rawDegrees = Math.round((index / exteriorFrames.length) * 360);
  const degrees = rawDegrees >= 360 ? 0 : rawDegrees;

  let label = 'Pandangan Hadapan';
  if (degrees >= 45 && degrees < 135) {
    label = 'Sisi Kanan Profil';
  } else if (degrees >= 135 && degrees < 225) {
    label = 'Pandangan Belakang';
  } else if (degrees >= 225 && degrees < 315) {
    label = 'Sisi Kiri Profil';
  }

  const textEl = document.getElementById('studio-angle-text');
  if (textEl) {
    textEl.textContent = `${degrees}° · ${label}`;
  }
}

function toggleAutoSpin() {
  const btn = document.getElementById('studio-spin-btn');
  const icon = document.getElementById('studio-spin-icon');
  const text = document.getElementById('studio-spin-text');

  if (isAutoSpinning) {
    clearInterval(autoSpinTimer);
    autoSpinTimer = null;
    isAutoSpinning = false;
    if (btn) btn.classList.remove('spinning');
    if (icon) icon.textContent = 'play_arrow';
    if (text) text.textContent = 'Auto-Putar';
  } else {
    isAutoSpinning = true;
    if (btn) btn.classList.add('spinning');
    if (icon) icon.textContent = 'pause';
    if (text) text.textContent = 'Jeda';

    autoSpinTimer = setInterval(() => {
      let next = (currentFrameIndex + 1) % exteriorFrames.length;
      set360Frame(next);
    }, 65);
  }
}

function toggleFullscreenStudio() {
  const stage = document.getElementById('studio-exterior-stage') || document.getElementById('cd-studio-hero');
  if (!stage) return;

  if (!document.fullscreenElement) {
    stage.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
  } else {
    document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
  }
}

document.addEventListener('fullscreenchange', () => {
  const icon = document.querySelector('.studio-fullscreen-btn .material-icons-round');
  if (icon) {
    icon.textContent = document.fullscreenElement ? 'fullscreen_exit' : 'fullscreen';
  }
});

/* ─────────────────────────────────────────────────────────────────────────────
   4. STUDIO 360° INTERIOR VIRTUAL COCKPIT ENGINE (CONTINUOUS 3D PANORAMA)
   ───────────────────────────────────────────────────────────────────────────── */
function getCarModelKey(car) {
  // Dynamic lookup from registry — Zero Hardcode
  const match = findRegistryEntry(car);
  if (match) return match.key;
  return null;
}

function setupInteriorCockpit(car) {
  const stage = document.getElementById('studio-interior-stage');
  const fallback = document.getElementById('cockpit-fallback');
  const hud = document.getElementById('cockpit-hud');
  const scene = document.getElementById('cdInteriorScene');
  const dragHint = document.getElementById('cockpit-drag-hint');

  if (!stage) return;

  if (!carHasInterior360(car)) {
    stage.classList.add('hidden');
    stage.style.display = 'none';
    return;
  }

  const modelKey = getCarModelKey(car);
  if (!modelKey) {
    stage.classList.add('hidden');
    stage.style.display = 'none';
    return;
  }
  stage.style.display = '';
  stage.setAttribute('data-vehicle-default-model', modelKey);

  if (window.WedriveVehicleViewer) {
    if (!interiorViewerApi) {
      interiorViewerApi = window.WedriveVehicleViewer.get(stage) || window.WedriveVehicleViewer.init(stage, {
        defaultModel: modelKey,
        defaultView: 'interior',
        autoDrift: false
      });

      stage.addEventListener('wedrive:interior-change', (e) => {
        updateCockpitAngleIndicator(e.detail);
      });

      // Hide drag hint on first pointer/touch interaction
      const hideHint = () => {
        if (dragHint) dragHint.classList.add('is-hidden');
      };
      stage.addEventListener('pointerdown', hideHint, { passive: true });
      stage.addEventListener('touchstart', hideHint, { passive: true });
    }

    if (interiorViewerApi) {
      interiorViewerApi.setModel(modelKey);
      interiorViewerApi.setInteriorOrientation(180, 0, true);
    }

    if (fallback) fallback.classList.add('hidden');
    if (scene) scene.style.display = 'flex';
    if (hud) hud.classList.remove('hidden');

    updateCockpitAngleIndicator({ yaw: 180, pitch: 0 });
  } else {
    if (fallback) fallback.classList.remove('hidden');
    if (scene) scene.style.display = 'none';
    if (hud) hud.classList.add('hidden');
  }
}

function updateCockpitAngleIndicator(info) {
  const angleText = document.getElementById('cockpit-angle-text');
  if (!angleText || !info) return;

  const rawYaw = (info.yaw || 0) % 360;
  const normalizedYaw = Math.round((rawYaw + 360) % 360);
  const pitch = Math.round(info.pitch || 0);

  let label = '';
  if (pitch >= 18) {
    label = `+${pitch}° · Pandangan Bumbung & Sunroof`;
  } else if (pitch <= -20) {
    label = `${pitch}° · Konsol Tengah & Tuil Gear`;
  } else if (normalizedYaw >= 315 || normalizedYaw < 45) {
    label = `${normalizedYaw}° · Pandangan Belakang`;
  } else if (normalizedYaw >= 45 && normalizedYaw < 135) {
    label = `${normalizedYaw}° · Sisi Kanan (Pemandu)`;
  } else if (normalizedYaw >= 135 && normalizedYaw < 225) {
    label = `${normalizedYaw}° · Pandangan Hadapan`;
  } else {
    label = `${normalizedYaw}° · Sisi Kiri (Penumpang)`;
  }

  angleText.textContent = label;
}

function cockpitPanStep(deltaYaw) {
  const dragHint = document.getElementById('cockpit-drag-hint');
  if (dragHint) dragHint.classList.add('is-hidden');

  if (interiorViewerApi && interiorViewerApi.stepInteriorYaw) {
    interiorViewerApi.stepInteriorYaw(deltaYaw);
  }
}

function cockpitSetView(view) {
  const dragHint = document.getElementById('cockpit-drag-hint');
  if (dragHint) dragHint.classList.add('is-hidden');

  if (!interiorViewerApi || !interiorViewerApi.setInteriorOrientation) return;

  if (view === 'front') {
    interiorViewerApi.setInteriorOrientation(180, 0);
  } else if (view === 'up') {
    interiorViewerApi.setInteriorOrientation(null, 24);
  } else if (view === 'down') {
    interiorViewerApi.setInteriorOrientation(null, -30);
  } else if (view === 'rear') {
    interiorViewerApi.setInteriorOrientation(0, 0);
  }
}

function cockpitZoom(level) {
  if (interiorViewerApi && interiorViewerApi.setInteriorZoom) {
    interiorViewerApi.setInteriorZoom(level);
  }
}

function toggleCockpitAutoDrift() {
  if (!interiorViewerApi || !interiorViewerApi.toggleAutoDrift) return;
  const isEnabled = interiorViewerApi.toggleAutoDrift();
  isCockpitAutoDrift = isEnabled;
  const btn = document.getElementById('cockpit-autospin-btn');
  if (btn) {
    btn.classList.toggle('active', isEnabled);
    const icon = btn.querySelector('.material-icons-round');
    if (icon) icon.textContent = isEnabled ? 'pause' : 'play_arrow';
  }
}

function toggleFullscreenInterior() {
  const stage = document.getElementById('studio-interior-stage');
  if (!stage) return;
  if (!document.fullscreenElement) {
    if (stage.requestFullscreen) {
      stage.requestFullscreen().catch(err => console.warn('Fullscreen error:', err));
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. EXPANSIVE HD PHOTO GALLERY & MODE SWITCHER
   ───────────────────────────────────────────────────────────────────────────── */
function setupPhotoGallery(car) {
  const strip = document.getElementById('cd-thumbnails');
  const heroImg = document.getElementById('gallery-hero-img');
  const badge = document.getElementById('gallery-photo-badge');
  const navPrev = document.querySelector('.gallery-nav-btn.prev');
  const navNext = document.querySelector('.gallery-nav-btn.next');

  galleryImages = (car.images && car.images.length > 0) ? [...car.images] : [];
  if (galleryImages.length === 0 && car.image_url) {
    galleryImages = [car.image_url];
  }
  currentGalleryIndex = 0;

  if (galleryImages.length > 0) {
    if (heroImg) heroImg.src = resolveImgSrc(galleryImages[0]);
    if (badge) badge.textContent = `FOTO 1 / ${galleryImages.length}`;

    if (navPrev) navPrev.style.display = galleryImages.length > 1 ? 'flex' : 'none';
    if (navNext) navNext.style.display = galleryImages.length > 1 ? 'flex' : 'none';

    if (strip) {
      if (galleryImages.length > 1) {
        strip.style.display = 'flex';
        strip.innerHTML = galleryImages.map((img, idx) => `
          <div class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" onclick="selectGalleryPhoto(${idx})" title="Foto ${idx + 1}">
            <img src="${resolveImgSrc(img)}" alt="${car.name} Foto ${idx + 1}" />
          </div>
        `).join('');
      } else {
        strip.style.display = 'none';
        strip.innerHTML = '';
      }
    }
  } else {
    if (heroImg) heroImg.src = '../../../../shared/logo/wedrive-icon.png';
    if (badge) badge.textContent = 'TIADA FOTO';
    if (navPrev) navPrev.style.display = 'none';
    if (navNext) navNext.style.display = 'none';
    if (strip) {
      strip.style.display = 'none';
      strip.innerHTML = '<p class="text-secondary fs-13">Tiada foto galeri tambahan.</p>';
    }
  }
}

function selectGalleryPhoto(index) {
  if (!galleryImages || galleryImages.length === 0) return;
  currentGalleryIndex = index;

  const heroImg = document.getElementById('gallery-hero-img');
  const badge = document.getElementById('gallery-photo-badge');

  if (heroImg) {
    heroImg.style.opacity = '0.3';
    setTimeout(() => {
      heroImg.src = resolveImgSrc(galleryImages[index]);
      heroImg.style.opacity = '1';
    }, 120);
  }

  if (badge) {
    badge.textContent = `FOTO ${index + 1} / ${galleryImages.length}`;
  }

  document.querySelectorAll('.gallery-thumb-item').forEach((item, idx) => {
    item.classList.toggle('active', idx === index);
  });
}

function navigateGallery(dir) {
  if (!galleryImages || galleryImages.length === 0) return;
  const nextIdx = (currentGalleryIndex + dir + galleryImages.length) % galleryImages.length;
  selectGalleryPhoto(nextIdx);
}

function toggleFullscreenGallery() {
  const heroStage = document.getElementById('gallery-hero-stage') || document.getElementById('studio-gallery-stage');
  if (!heroStage) return;

  if (!document.fullscreenElement) {
    heroStage.requestFullscreen().catch(err => console.log('Fullscreen error:', err));
  } else {
    document.exitFullscreen().catch(err => console.log('Exit fullscreen error:', err));
  }
}

function switchStudioMode(mode) {
  // Safety guard against activating unsupported modes
  if (mode === 'exterior' && !carHasExterior360(activeCar)) {
    mode = 'gallery';
  } else if (mode === 'interior' && !carHasInterior360(activeCar)) {
    mode = carHasExterior360(activeCar) ? 'exterior' : 'gallery';
  }

  currentMode = mode;

  // Tabs UI
  document.querySelectorAll('.studio-tab-btn').forEach(btn => btn.classList.remove('active'));
  const tabBtn = document.getElementById(`tab-${mode}`);
  if (tabBtn) tabBtn.classList.add('active');

  // Stages visibility
  const extStage = document.getElementById('studio-exterior-stage');
  const intStage = document.getElementById('studio-interior-stage');
  const galStage = document.getElementById('studio-gallery-stage');

  if (extStage) extStage.classList.toggle('hidden', mode !== 'exterior');
  if (intStage) intStage.classList.toggle('hidden', mode !== 'interior');
  if (galStage) galStage.classList.toggle('hidden', mode !== 'gallery');

  if (mode === 'gallery' && galleryImages.length > 0) {
    selectGalleryPhoto(currentGalleryIndex);
  } else if (mode === 'interior' && interiorViewerApi) {
    interiorViewerApi.refresh();
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   6. EQUIPMENT MATRIX (Active Equipment Badges)
   ───────────────────────────────────────────────────────────────────────────── */
function setupEquipmentMatrix(car) {
  const matrixContainer = document.getElementById('cd-equipment-matrix');
  if (!matrixContainer) return;

  const standardEquip = [
    { icon: 'phone_iphone', name: 'Apple CarPlay & Android Auto Tanpa Wayar', equipped: true },
    { icon: 'videocam', name: 'Kamera Keliling 360° Surround View', equipped: Boolean(car.has_360 || car.name.includes('BMW') || car.name.includes('Mercedes')) },
    { icon: 'camera_indoor', name: 'Dashcam Resolusi 4K Depan & Belakang', equipped: true },
    { icon: 'vpn_key', name: 'Sistem Akses Tanpa Kunci & Push Start', equipped: true },
    { icon: 'wb_shade', name: 'Filem Penapis Haba Pematuhan JPJ (Tinted)', equipped: true },
    { icon: 'sensors', name: 'Sensor Parkir Ultrasonik Hadapan & Belakang', equipped: true },
    { icon: 'emergency_share', name: 'Sistem Brek Kecemasan Autonomus (AEB)', equipped: Boolean(car.name.includes('BMW') || car.name.includes('Mercedes') || car.name.includes('Golf') || car.name.includes('Raptor')) },
    { icon: 'traffic', name: 'Bantuan Pengekalan Lorong Aktif (LKA)', equipped: Boolean(!car.name.includes('AXIA G')) }
  ];

  matrixContainer.innerHTML = standardEquip.map(eq => `
    <div class="equip-item-card ${eq.equipped ? 'equipped' : ''}">
      <div class="equip-item-icon">
        <span class="material-icons-round fs-16">${eq.icon}</span>
      </div>
      <div class="equip-item-name">${eq.name}</div>
    </div>
  `).join('');
}


/* ─────────────────────────────────────────────────────────────────────────────
   8. MODALS & ACTIONS (Edit Car, Status Change, Insurance)
   ───────────────────────────────────────────────────────────────────────────── */
function openStatusModal() {
  const modal = document.getElementById('status-redirect-modal');
  const select = document.getElementById('quick-status-select');
  if (modal) modal.classList.remove('hidden');
  if (select && activeCar) select.value = activeCar.status || 'Available';
}

function closeStatusRedirectModal() {
  const modal = document.getElementById('status-redirect-modal');
  if (modal) modal.classList.add('hidden');
}

async function confirmQuickStatusChange() {
  const select = document.getElementById('quick-status-select');
  if (!select || !activeCar) return;

  const newStatus = select.value;
  activeCar.status = newStatus;

  // Persist to Supabase via WeDriveAPI or supabaseClient
  try {
    var targetId = (!isNaN(activeCar.id) && typeof activeCar.id !== 'boolean') ? Number(activeCar.id) : activeCar.id;
    if (window.WeDriveAPI && typeof window.WeDriveAPI.updateCarStatus === 'function') {
      await window.WeDriveAPI.updateCarStatus(targetId, newStatus);
    } else if (window.supabaseClient) {
      await window.supabaseClient.from('cars').update({ status: newStatus }).eq('id', targetId);
    }
    if (typeof showToast === 'function') {
      showToast('Status kenderaan berjaya dikemas kini kepada ' + newStatus, 'success');
    }
  } catch (e) {
    console.warn('Supabase status update fallback error:', e);
    if (typeof showToast === 'function') {
      showToast('Gagal mengemas kini status: ' + e.message, 'error');
    }
  }

  loadCarProfile(activeCar);
  renderFleetSelector();
  closeStatusRedirectModal();
}

function editDetails() {
  var targetId = selectedCarId || (activeCar ? activeCar.id : null);
  if (!targetId) {
    const params = new URLSearchParams(window.location.search);
    targetId = params.get('id');
  }
  if (targetId) {
    window.location.href = `../edit-car/step1-specification.html?id=${encodeURIComponent(targetId)}`;
  } else {
    window.location.href = '../edit-car/step1-specification.html';
  }
}

function viewInsurance() {
  const modal = document.getElementById('insurance-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeInsuranceModal() {
  const modal = document.getElementById('insurance-modal');
  if (modal) modal.classList.add('hidden');
}

/* ─────────────────────────────────────────────────────────────────────────────
   9. DELETE CAR MODAL
   ───────────────────────────────────────────────────────────────────────────── */
function openDeleteCarModal() {
  const modal = document.getElementById('delete-car-modal');
  const nameEl = document.getElementById('delete-car-name');
  const input = document.getElementById('delete-confirm-plate');
  const hint = document.getElementById('delete-plate-hint');
  const btn = document.getElementById('btn-confirm-delete');

  if (nameEl && activeCar) {
    nameEl.textContent = activeCar.name || 'Kenderaan ini';
  }
  if (input) input.value = '';
  if (hint) hint.textContent = '';
  if (btn) {
    btn.disabled = true;
    btn.style.opacity = '0.4';
    btn.style.cursor = 'not-allowed';
  }
  if (modal) modal.classList.remove('hidden');
  setTimeout(() => { if (input) input.focus(); }, 120);
}

function closeDeleteCarModal() {
  const modal = document.getElementById('delete-car-modal');
  if (modal) modal.classList.add('hidden');
}

function checkDeletePlateMatch() {
  const input = document.getElementById('delete-confirm-plate');
  const hint = document.getElementById('delete-plate-hint');
  const btn = document.getElementById('btn-confirm-delete');
  if (!input || !activeCar) return;

  const typed = input.value.trim().toUpperCase().replace(/\s+/g, ' ');
  const actual = (activeCar.plate || '').toUpperCase().replace(/\s+/g, ' ');
  const match = typed === actual;

  if (hint) {
    hint.textContent = match
      ? '✓ Nombor plat betul. Anda boleh meneruskan pemadaman.'
      : (typed.length > 0 ? 'Nombor plat tidak sepadan. Cuba semula.' : '');
    hint.style.color = match ? 'var(--color-success, #34C759)' : 'var(--color-danger, #FF3B30)';
  }
  if (btn) {
    btn.disabled = !match;
    btn.style.opacity = match ? '1' : '0.4';
    btn.style.cursor = match ? 'pointer' : 'not-allowed';
  }
}

async function confirmDeleteCar() {
  const btn = document.getElementById('btn-confirm-delete');
  if (!activeCar || !activeCar.id) return;
  if (btn && btn.disabled) return;

  // Lock button while deleting
  if (btn) {
    btn.disabled = true;
    btn.textContent = 'Memproses...';
  }

  try {
    let success = false;
    if (window.WeDriveAPI && typeof window.WeDriveAPI.deleteCar === 'function') {
      const res = await window.WeDriveAPI.deleteCar(activeCar.id);
      success = res && res.success;
    } else if (window.supabaseClient) {
      const targetId = (!isNaN(activeCar.id) && typeof activeCar.id !== 'boolean')
        ? Number(activeCar.id) : activeCar.id;
      const res = await window.supabaseClient.from('cars').delete().eq('id', targetId);
      success = !res.error;
    }

    if (success) {
      closeDeleteCarModal();
      if (typeof showToast === 'function') {
        showToast('Kenderaan berjaya dipadam dari inventori.', 'success');
      }
      // Redirect to car list after short delay
      setTimeout(() => {
        window.location.href = '../cars.html';
      }, 1200);
    } else {
      throw new Error('Pemadaman gagal.');
    }
  } catch (e) {
    console.error('[WeDRIVE] deleteCar error:', e);
    if (btn) {
      btn.disabled = false;
      btn.textContent = 'Padam Sekarang';
      btn.style.opacity = '1';
    }
    if (typeof showToast === 'function') {
      showToast('Gagal memadam kenderaan: ' + (e.message || 'Cuba semula.'), 'error');
    }
  }
}
