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

// 360 Interior Cockpit State
let currentCockpitPanel = 'pano_f.jpg';
let cockpitZoomLevel = 1.0;

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

  // Initialize Telemetry Desk
  setupTelemetry(car);

  // Reset to exterior mode tab
  switchStudioMode('exterior');
}

function setupCarSpecs(car) {
  const isBMW = car.name.includes('BMW');
  const isMerc = car.name.includes('Mercedes');
  const isGolf = car.name.includes('Golf');
  const isRaptor = car.name.includes('Raptor') || car.name.includes('Ford');
  const isAlphard = car.name.includes('Alphard');
  const isAxia = car.name.includes('AXIA');

  // Engine & Powertrain
  setText('spec-engine-badge', isAxia ? '1.0L VVT-i' : isRaptor ? '2.0L Bi-Turbo' : isAlphard ? '2.5L Dual VVT-i' : '2.0L TwinPower Turbo');
  setText('spec-engine-cfg', isAxia ? '3-Silinder Sebaris 1KR-VE DOHC' : isRaptor ? '4-Silinder Bi-Turbo Diesel Intercooler' : '4-Silinder Sebaris Turbo DOHC 16V');
  setText('spec-displacement', isAxia ? '998 cc' : isAlphard ? '2,494 cc' : '1,998 cc');
  setText('spec-hp', isAxia ? '67 hp @ 6,000 rpm' : isRaptor ? '210 hp @ 3,750 rpm' : isBMW ? '184 hp @ 5,000 rpm' : isMerc ? '221 hp @ 5,500 rpm' : '241 hp @ 5,000 rpm');
  setText('spec-torque', isAxia ? '91 Nm @ 4,400 rpm' : isRaptor ? '500 Nm @ 1,750 rpm' : isBMW ? '300 Nm @ 1,350 rpm' : '350 Nm @ 1,600 rpm');
  setText('spec-accel', isAxia ? '14.2 Saat' : isRaptor ? '9.0 Saat' : isBMW ? '7.1 Saat' : isGolf ? '6.2 Saat' : '6.9 Saat');

  // Transmission & Fuel
  setText('spec-trans-badge', car.transmission || 'Automatik');
  setText('spec-trans-type', isAxia ? 'D-CVT Automatik' : isRaptor ? '10-Kelajuan Automatik dengan SelectShift' : '8-Kelajuan Steptronic Sport');
  setText('spec-drivetrain', isRaptor ? 'Four-Wheel Drive (4WD Terrain Mgmt)' : isBMW ? 'Rear-Wheel Drive (RWD)' : isAlphard ? 'Front-Wheel Drive (FWD)' : 'Front-Wheel Drive (FWD)');
  setText('spec-fuel-type', isRaptor ? 'Diesel Euro 5 B10/B20' : 'Petrol (Disyorkan RON 97 / RON 95)');
  setText('spec-tank', isAxia ? '33 Liter' : isRaptor ? '80 Liter' : isAlphard ? '75 Liter' : '59 Liter');
  setText('spec-consumption', isAxia ? '4.5 L / 100 km' : isRaptor ? '8.9 L / 100 km' : '6.4 L / 100 km');

  // Dimensions & Capacities
  setText('spec-seats-badge', `${car.seats || 5} Tempat Duduk`);
  setText('spec-seats-count', `${car.seats || 5} Tempat Duduk Ergonomik`);
  setText('spec-boot', isAlphard ? '1,900 Liter (Stow-away)' : isRaptor ? 'Muatan Kargo 1,180 kg' : isAxia ? '268 Liter' : '480 Liter (Power Boot)');
  setText('spec-weight', isRaptor ? '2,475 kg' : isAlphard ? '2,110 kg' : isAxia ? '870 kg' : '1,570 kg');
  setText('spec-dims', isRaptor ? '5,381 × 2,028 × 1,922 mm' : isAlphard ? '4,945 × 1,850 × 1,895 mm' : isAxia ? '3,760 × 1,665 × 1,505 mm' : '4,709 × 1,827 × 1,435 mm');
  setText('spec-wheelbase', isRaptor ? '3,270 mm' : isAlphard ? '3,000 mm' : isAxia ? '2,525 mm' : '2,851 mm');

  // Commercial
  setText('spec-deposit', isRaptor || isAlphard || isBMW ? 'RM 500 (Boleh Dikembalikan)' : 'RM 200 (Boleh Dikembalikan)');
  setText('spec-min-days', `${car.min_days || 1} Hari`);
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
  const slider = document.getElementById('studio-scrub-slider');

  exteriorFrames = [];
  currentFrameIndex = 0;

  const isBMW = car.name.includes('BMW');
  const isMerc = car.name.includes('Mercedes') && car.name.includes('GLA');
  const isGolf = car.name.includes('Golf');

  // Build high-res spin frame sequence
  if (isBMW) {
    // 36 sampled frames across 200 frames for instant preloading and 60fps spin
    for (let i = 0; i < 36; i++) {
      const frameNum = Math.min(Math.floor(i * (199 / 35)), 199);
      const padded = String(frameNum).padStart(3, '0');
      exteriorFrames.push(`Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-${padded}.jpg`);
    }
  } else if (isMerc) {
    for (let i = 0; i < 24; i++) {
      const frameNum = Math.min(Math.floor(i * 6), 140);
      const padded = String(frameNum).padStart(3, '0');
      exteriorFrames.push(`SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/frame-${padded}.jpg`);
    }
  } else if (isGolf) {
    for (let i = 0; i < 24; i++) {
      const frameNum = Math.min(Math.floor(i * 6), 140);
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

    if (slider) {
      slider.max = exteriorFrames.length - 1;
      slider.value = 0;
    }
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
    if (e.target.closest('.studio-controls-bar') || e.target.closest('.studio-angle-indicator')) return;
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
    if (e.target.closest('.studio-controls-bar')) return;
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

  const slider = document.getElementById('studio-scrub-slider');
  if (slider && !isDragging360) {
    slider.value = index;
  }

  updateAnglePill(index);
}

function handleScrubInput(val) {
  if (isAutoSpinning) toggleAutoSpin();
  const index = parseInt(val);
  set360Frame(index);
}

function updateAnglePill(index) {
  if (exteriorFrames.length === 0) return;
  const degrees = Math.round((index / exteriorFrames.length) * 360);

  let label = 'Pandangan Hadapan';
  if (degrees >= 45 && degrees < 135) label = 'Sisi Kanan Profil';
  else if (degrees >= 135 && degrees < 225) label = 'Pandangan Belakang';
  else if (degrees >= 225 && degrees < 315) label = 'Sisi Kiri Profil';

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
   4. STUDIO 360° INTERIOR VIRTUAL COCKPIT ENGINE
   ───────────────────────────────────────────────────────────────────────────── */
function setupInteriorCockpit(car) {
  const cockpitCanvas = document.getElementById('cockpit-canvas');
  const fallback = document.getElementById('cockpit-fallback');
  const hud = document.getElementById('cockpit-hud');

  const isBMW = car.name.includes('BMW');

  if (isBMW) {
    cockpitCanvas.classList.remove('hidden');
    cockpitCanvas.style.display = 'block';
    if (fallback) fallback.classList.add('hidden');
    if (hud) hud.classList.remove('hidden');

    currentCockpitPanel = 'pano_f.jpg';
    cockpitCanvas.src = resolveImgSrc(`Sedan/2023 BMW 320i M Sport 2.0/interior/full-res/${currentCockpitPanel}`);
  } else {
    cockpitCanvas.style.display = 'none';
    if (fallback) fallback.classList.remove('hidden');
    if (hud) hud.classList.add('hidden');
  }
}

function cockpitPan(direction) {
  const cockpitCanvas = document.getElementById('cockpit-canvas');
  if (!cockpitCanvas) return;

  const isBMW = activeCar && activeCar.name.includes('BMW');
  if (!isBMW) return;

  if (direction === 'left') currentCockpitPanel = 'pano_l.jpg';
  else if (direction === 'right') currentCockpitPanel = 'pano_r.jpg';
  else currentCockpitPanel = 'pano_f.jpg';

  cockpitCanvas.src = resolveImgSrc(`Sedan/2023 BMW 320i M Sport 2.0/interior/full-res/${currentCockpitPanel}`);
}

function cockpitZoom(level) {
  cockpitZoomLevel = level;
  const cockpitCanvas = document.getElementById('cockpit-canvas');
  if (cockpitCanvas) {
    cockpitCanvas.style.transform = `scale(${level})`;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   5. PHOTO GALLERY & MODE SWITCHER
   ───────────────────────────────────────────────────────────────────────────── */
function setupPhotoGallery(car) {
  const container = document.getElementById('cd-thumbnails');
  if (!container) return;

  if (car.images && car.images.length > 0) {
    container.innerHTML = car.images.map((img, idx) => `
      <div class="car-thumb ${idx === 0 ? 'active' : ''}" onclick="previewGalleryImage(this, '${resolveImgSrc(img)}')">
        <img src="${resolveImgSrc(img)}" alt="${car.name} Angle ${idx + 1}" />
      </div>
    `).join('');
  } else {
    container.innerHTML = '<p class="text-secondary fs-13">Tiada foto galeri tambahan.</p>';
  }
}

function previewGalleryImage(el, src) {
  document.querySelectorAll('.car-thumb').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');

  const stageImg = document.getElementById('studio-canvas-stage');
  if (stageImg) stageImg.src = src;
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
   7. VEHICLE TELEMETRY & HEALTH DESK (NO BOOKINGS!)
   ───────────────────────────────────────────────────────────────────────────── */
function setupTelemetry(car) {
  // Compute deterministic mock telemetry based on car ID
  const seed = (car.id || 1) * 3829;
  const mileage = 25000 + (seed % 35000);
  const fuel = 65 + (seed % 30);
  const batteryVolts = (12.4 + ((seed % 5) / 10)).toFixed(1);

  setText('telemetry-odometer', `${mileage.toLocaleString()} km`);
  setText('telemetry-fuel', `${fuel}% Penuh`);
  setText('telemetry-battery', `${batteryVolts}V (98%)`);
  setText('telemetry-doors', 'Semua Terkunci Rapi');
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
