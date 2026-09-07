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

// Resolve any image string to a valid src
function resolveImgSrc(img) {
  if (!img) return '';
  if (img.startsWith('data:') || img.startsWith('http://') || img.startsWith('https://')) return img;
  return IMG_BASE + img;
}

// Extract car ID from URL search params
const urlParams = new URLSearchParams(window.location.search);
let selectedCarId = parseInt(urlParams.get('id')) || 1;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initVehicleStudio();
});

async function initVehicleStudio() {
  try {
    const data = await window.WeDriveAPI.getAdminData();
    allCars = data.car || [];

    if (allCars.length === 0) {
      console.warn('No cars found in database.');
      return;
    }

    // Find requested car or fallback to first car
    activeCar = allCars.find(c => c.id === selectedCarId) || allCars[0];
    selectedCarId = activeCar.id;

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
    const isActive = c.id === selectedCarId;
    const thumbSrc = c.images && c.images.length > 0 ? resolveImgSrc(c.images[0]) : '';
    const has360Badge = (c.has_360 || c.has360 || (c.name && c.name.includes('BMW'))) ?
      '<span class="badge-360 fs-9 py-2 px-6">360°</span>' : '';

    return `
      <button class="fleet-car-chip ${isActive ? 'active' : ''}" onclick="selectFleetCar(${c.id})" title="${c.name}">
        <img src="${thumbSrc}" class="fleet-chip-thumb" alt="${c.name}" onerror="this.src='../../../../shared/logo/wedrive-icon.png';" />
        <div class="fleet-chip-info">
          <div class="fleet-chip-name">${c.name}</div>
          <div class="fleet-chip-meta">
            <span>${c.plate}</span>
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
  if (selectedCarId === carId) return;

  selectedCarId = carId;
  activeCar = allCars.find(c => c.id === carId);

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

  // Initialize 360 exterior spin frames
  setupExterior360(car);

  // Initialize interior cockpit
  setupInteriorCockpit(car);

  // Initialize Photo Gallery
  setupPhotoGallery(car);

  // Initialize Equipment Matrix
  setupEquipmentMatrix(car);

  // Reset to exterior mode tab
  switchStudioMode('exterior');
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
   3. STUDIO 360° EXTERIOR SPIN ENGINE
   ───────────────────────────────────────────────────────────────────────────── */
function setupExterior360(car) {
  const stageImg = document.getElementById('studio-canvas-stage');
  const fallbackIcon = document.getElementById('studio-fallback-icon');
  exteriorFrames = [];
  currentFrameIndex = 0;

  const isBMW = car.name.includes('BMW');
  const isMerc = car.name.includes('Mercedes') && car.name.includes('GLA');
  const isGolf = car.name.includes('Golf');

  // Build high-res spin frame sequence (Carsome 200-frame standardized turntable)
  // frame-125 is true front (0°), frame-175 is right profile (90°),
  // frame-025 is rear (180°), frame-075 is left profile (270°).
  const frontOffset = 125;
  const sampleCount = 36;
  const totalFrames = 200;

  if (isBMW) {
    for (let i = 0; i < sampleCount; i++) {
      const frameNum = (frontOffset + Math.round(i * (totalFrames / sampleCount))) % totalFrames;
      const padded = String(frameNum).padStart(3, '0');
      exteriorFrames.push(`Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-${padded}.jpg`);
    }
  } else if (isMerc) {
    for (let i = 0; i < sampleCount; i++) {
      const frameNum = (frontOffset + Math.round(i * (totalFrames / sampleCount))) % totalFrames;
      const padded = String(frameNum).padStart(3, '0');
      exteriorFrames.push(`SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-${padded}.jpg`);
    }
  } else if (isGolf) {
    for (let i = 0; i < sampleCount; i++) {
      const frameNum = (frontOffset + Math.round(i * (totalFrames / sampleCount))) % totalFrames;
      const padded = String(frameNum).padStart(3, '0');
      exteriorFrames.push(`Hatchback/2022 Volkswagen Golf GTI 2.0/exterior/full-res/frame-${padded}.jpg`);
    }
  } else if (car.images && car.images.length > 0) {
    // If standard car with gallery photos, duplicate images across 12 angles
    for (let i = 0; i < 12; i++) {
      const imgIdx = i % car.images.length;
      exteriorFrames.push(car.images[imgIdx]);
    }
  }

  if (exteriorFrames.length > 0) {
    stageImg.classList.remove('hidden');
    stageImg.style.display = 'block';
    if (fallbackIcon) fallbackIcon.classList.add('hidden');

    stageImg.src = resolveImgSrc(exteriorFrames[0]);
    currentFrameIndex = 0;
    updateAnglePill(0);
  } else {
    stageImg.style.display = 'none';
    if (fallbackIcon) fallbackIcon.classList.remove('hidden');
  }

  // Bind mouse drag & touch scrub events
  bind360DragEvents();
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
  if (!car || !car.name) return 'bmw';
  const n = car.name.toLowerCase();
  if (n.includes('bmw')) return 'bmw';
  if (n.includes('gla') || (n.includes('mercedes') && n.includes('gla'))) return 'gla';
  if (n.includes('cls') || (n.includes('mercedes') && n.includes('cls'))) return 'cls350';
  if (n.includes('alphard')) return 'alphard';
  if (n.includes('golf')) return 'golf';
  if (n.includes('ranger') || n.includes('raptor')) return 'ranger';
  if (n.includes('axia av') || n.includes('2025')) return 'axiaAv';
  if (n.includes('axia')) return 'axia';
  return 'bmw';
}

function setupInteriorCockpit(car) {
  const stage = document.getElementById('studio-interior-stage');
  const fallback = document.getElementById('cockpit-fallback');
  const hud = document.getElementById('cockpit-hud');
  const scene = document.getElementById('cdInteriorScene');
  const dragHint = document.getElementById('cockpit-drag-hint');

  if (!stage) return;

  const modelKey = getCarModelKey(car);
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
      interiorViewerApi.setInteriorOrientation(0, 0, true);
    }

    if (fallback) fallback.classList.add('hidden');
    if (scene) scene.style.display = 'flex';
    if (hud) hud.classList.remove('hidden');

    updateCockpitAngleIndicator({ yaw: 0, pitch: 0 });
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
    label = `${normalizedYaw}° · Pandangan Hadapan`;
  } else if (normalizedYaw >= 45 && normalizedYaw < 135) {
    label = `${normalizedYaw}° · Sisi Kanan (Pemandu)`;
  } else if (normalizedYaw >= 135 && normalizedYaw < 225) {
    label = `${normalizedYaw}° · Pandangan Belakang`;
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
    interiorViewerApi.setInteriorOrientation(0, 0);
  } else if (view === 'up') {
    interiorViewerApi.setInteriorOrientation(null, 24);
  } else if (view === 'down') {
    interiorViewerApi.setInteriorOrientation(null, -30);
  } else if (view === 'rear') {
    interiorViewerApi.setInteriorOrientation(180, 0);
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

  galleryImages = car.images && car.images.length > 0 ? car.images : [];
  currentGalleryIndex = 0;

  if (galleryImages.length > 0) {
    if (heroImg) heroImg.src = resolveImgSrc(galleryImages[0]);
    if (badge) badge.textContent = `FOTO 1 / ${galleryImages.length}`;

    if (strip) {
      strip.innerHTML = galleryImages.map((img, idx) => `
        <div class="gallery-thumb-item ${idx === 0 ? 'active' : ''}" onclick="selectGalleryPhoto(${idx})" title="Foto ${idx + 1}">
          <img src="${resolveImgSrc(img)}" alt="${car.name} Foto ${idx + 1}" />
        </div>
      `).join('');
    }
  } else {
    if (heroImg) heroImg.src = '../../../../shared/logo/wedrive-icon.png';
    if (strip) strip.innerHTML = '<p class="text-secondary fs-13">Tiada foto galeri tambahan.</p>';
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

  // Persist to Supabase if available
  if (window.supabase) {
    try {
      await window.supabase.from('cars').update({ status: newStatus }).eq('id', activeCar.id);
    } catch (e) {
      console.warn('Supabase status update fallback:', e);
    }
  }

  loadCarProfile(activeCar);
  renderFleetSelector();
  closeStatusRedirectModal();
}

function editDetails() {
  const modal = document.getElementById('edit-car-modal');
  if (!modal || !activeCar) return;

  document.getElementById('edit-name').value = activeCar.name || '';
  document.getElementById('edit-plate').value = activeCar.plate || '';
  document.getElementById('edit-type').value = (activeCar.type || 'sedan').toLowerCase();
  document.getElementById('edit-fuel').value = activeCar.fuel || 'Petrol';
  document.getElementById('edit-trans').value = activeCar.transmission || 'Auto';
  document.getElementById('edit-seats').value = activeCar.seats || 5;
  document.getElementById('edit-rate').value = parseInt(String(activeCar.rate || '').replace(/[^0-9]/g, '')) || activeCar.price || 250;
  document.getElementById('edit-status').value = activeCar.status || 'Available';

  modal.classList.remove('hidden');
}

function closeEditCarModal() {
  const modal = document.getElementById('edit-car-modal');
  if (modal) modal.classList.add('hidden');
}

async function saveCarEdit(e) {
  e.preventDefault();
  if (!activeCar) return;

  activeCar.name = document.getElementById('edit-name').value.trim();
  activeCar.plate = document.getElementById('edit-plate').value.trim();
  activeCar.type = document.getElementById('edit-type').value;
  activeCar.fuel = document.getElementById('edit-fuel').value;
  activeCar.transmission = document.getElementById('edit-trans').value;
  activeCar.seats = parseInt(document.getElementById('edit-seats').value);
  activeCar.rate = `RM ${document.getElementById('edit-rate').value}/hari`;
  activeCar.status = document.getElementById('edit-status').value;

  // Persist to Supabase
  if (window.supabase) {
    try {
      await window.supabase.from('cars').update({
        name: activeCar.name,
        plate: activeCar.plate,
        type: activeCar.type,
        fuel: activeCar.fuel,
        transmission: activeCar.transmission,
        seats: activeCar.seats,
        rate: activeCar.rate,
        status: activeCar.status
      }).eq('id', activeCar.id);
    } catch (err) {
      console.warn('Failed to sync car update with Supabase:', err);
    }
  }

  loadCarProfile(activeCar);
  renderFleetSelector();
  closeEditCarModal();
}

function viewInsurance() {
  const modal = document.getElementById('insurance-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeInsuranceModal() {
  const modal = document.getElementById('insurance-modal');
  if (modal) modal.classList.add('hidden');
}
