/**
 * WeDRIVE Admin Add Car - Step 3: Semakan & Pengesahan
 * admin/pages/car/add-car/step3-pengesahan.js (v6.20.5)
 * 
 * Features:
 * - Real Data Pipeline (Hydrates 10 technical specs directly from draft/Supabase)
 * - Strict Zero Fake Data: Clean blank placeholders ("-", "RM 0.00") when draft is empty
 * - Visual gallery & 360 viewer synchronization
 * - Direct registration to Supabase PostgreSQL inventory
 */

(function () {
  'use strict';

  // Zero Fake Data: all saved visuals come from the draft/Cloudinary manifest.

  let currentStep3Photos = [];
  let currentStep3PhotoIndex = 0;
  let activeStep3VisualMode = 'gallery';
  let hasStep3360 = false;
  let step3CloudinaryFrames = [];
  let step3CloudinaryFrameIndex = 0;
  let step3FramePreloadOrder = [];
  let step3PreloadedFrameIndexes = new Set();
  let step3FailedFrameIndexes = new Set();
  let step3FramePreloadRun = 0;
  let step3CloudinaryInteriorFaces = {};
  let hasStep3Interior = false;
  let step3InteriorYaw = 180;
  let step3InteriorPitch = 0;
  let step3InteriorViewer = null;
  let isPublishing = false;

  const STEP3_INTERIOR_FACE_KEYS = ['f', 'b', 'l', 'r', 'u', 'd'];

  function parseInteriorFaces(value) {
    if (!value) return {};
    if (typeof value === 'object') return value;
    if (typeof value === 'string' && value.trim().startsWith('{')) {
      try { return JSON.parse(value); } catch (_) {}
    }
    return {};
  }

  function normaliseStep3Photos(list) {
    return (Array.isArray(list) ? list : []).map((photo, idx) => {
      if (typeof photo === 'string') {
        return { title: `Foto ${idx + 1}`, titleEn: `Photo ${idx + 1}`, img: photo };
      }
      return photo;
    }).filter(photo => photo && photo.img);
  }

  function hasPersistedCloudinaryVisuals(draft) {
    if (!draft || typeof draft !== 'object') return false;
    const hasGallery = [
      ...(Array.isArray(draft.cloudinary_gallery) ? draft.cloudinary_gallery : []),
      ...(Array.isArray(draft.supabase_images) ? draft.supabase_images : []),
      ...(Array.isArray(draft.images) ? draft.images : [])
    ].some(item => {
      const url = typeof item === 'string' ? item : (item && item.img);
      return typeof url === 'string' && url.includes('res.cloudinary.com/');
    });
    const hasExterior = Array.isArray(draft.exterior_frames) && draft.exterior_frames.some(url =>
      typeof url === 'string' && url.includes('res.cloudinary.com/')
    );
    return hasGallery || hasExterior;
  }

  function renderStep3CloudinaryFrame() {
    const viewportImg = document.getElementById('step3ViewportImage');
    const frame = step3CloudinaryFrames[step3CloudinaryFrameIndex];
    if (!viewportImg || !frame) return;
    viewportImg.style.backgroundImage = `url('${frame}')`;
    viewportImg.classList.remove('hidden');
  }

  // Load order is deliberately interleaved around the vehicle:
  // 1, 50, 100, 150, 200, 2, 51, 101...
  // This makes the first usable rotation cover front/right/rear/left before
  // downloading the dense neighbouring frames.
  function buildStep3FramePreloadOrder(total) {
    const order = [];
    const seen = new Set();
    const add = index => {
      if (index < 0 || index >= total || seen.has(index)) return;
      seen.add(index);
      order.push(index);
    };

    [0, 49, 99, 149, 199].forEach(add);
    for (let offset = 1; offset < 50; offset += 1) {
      [offset, offset + 49, offset + 99, offset + 149].forEach(add);
    }
    for (let index = 0; index < total; index += 1) add(index);
    return order;
  }

  function updateStep3FrameLoadingUi(loaded, total, failed = 0, visible = true) {
    const box = document.getElementById('step3FrameLoading');
    const text = document.getElementById('step3FrameLoadingText');
    const bar = document.getElementById('step3FrameLoadingBar');
    const icon = document.getElementById('step3FrameLoadingIcon');
    if (!box || !text || !bar || !icon) return;

    const isEn = getLang() === 'en';
    const completed = loaded + failed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    bar.style.width = `${percent}%`;
    box.classList.toggle('hidden', !visible);

    if (completed >= total) {
      icon.classList.remove('animate-spin');
      icon.textContent = failed > 0 ? 'warning' : 'check_circle';
      text.textContent = failed > 0
        ? (isEn ? `${loaded}/${total} frames ready` : `${loaded}/${total} frame sedia`)
        : (isEn ? `All ${total} frames ready` : `Semua ${total} frame sedia`);
      if (failed === 0) {
        // Keep the final frame cached, but remove the loading pill immediately
        // once the progressive preload has genuinely completed.
        box.classList.add('hidden');
      }
      return;
    }

    icon.classList.add('animate-spin');
    icon.textContent = 'progress_activity';
    text.textContent = isEn
      ? `Loading frames ${completed}/${total}...`
      : `Memuat frame ${completed}/${total}...`;
  }

  function preloadStep3Frame(index, runId) {
    return new Promise(resolve => {
      const url = step3CloudinaryFrames[index];
      if (!url || runId !== step3FramePreloadRun) {
        resolve(false);
        return;
      }
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        if (runId !== step3FramePreloadRun) {
          resolve(false);
          return;
        }
        step3PreloadedFrameIndexes.add(index);
        resolve(true);
      };
      image.onerror = () => {
        if (runId === step3FramePreloadRun) step3FailedFrameIndexes.add(index);
        resolve(false);
      };
      image.src = url;
    });
  }

  async function preloadStep3Frames() {
    const total = step3CloudinaryFrames.length;
    if (!total) return;

    const runId = ++step3FramePreloadRun;
    step3FramePreloadOrder = buildStep3FramePreloadOrder(total);
    step3PreloadedFrameIndexes = new Set();
    step3FailedFrameIndexes = new Set();
    updateStep3FrameLoadingUi(0, total, 0, activeStep3VisualMode === '360');

    // Progressive batches: 1, 4, 8, 16, 32, 64, then the remainder.
    // At most four requests are active in a batch to keep the page responsive.
    const batchSizes = [1, 4, 8, 16, 32, 64];
    let cursor = 0;
    for (const requestedSize of batchSizes) {
      if (cursor >= step3FramePreloadOrder.length || runId !== step3FramePreloadRun) return;
      const batch = step3FramePreloadOrder.slice(cursor, cursor + requestedSize);
      cursor += batch.length;
      for (let start = 0; start < batch.length; start += 4) {
        const chunk = batch.slice(start, start + 4);
        await Promise.all(chunk.map(index => preloadStep3Frame(index, runId)));
        updateStep3FrameLoadingUi(
          step3PreloadedFrameIndexes.size,
          total,
          step3FailedFrameIndexes.size,
          activeStep3VisualMode === '360'
        );
      }
    }

    while (cursor < step3FramePreloadOrder.length && runId === step3FramePreloadRun) {
      const batch = step3FramePreloadOrder.slice(cursor, cursor + 64);
      cursor += batch.length;
      for (let start = 0; start < batch.length; start += 4) {
        const chunk = batch.slice(start, start + 4);
        await Promise.all(chunk.map(index => preloadStep3Frame(index, runId)));
        updateStep3FrameLoadingUi(
          step3PreloadedFrameIndexes.size,
          total,
          step3FailedFrameIndexes.size,
          activeStep3VisualMode === '360'
        );
      }
    }
  }

  function renderStep3CloudinaryInterior() {
    const scene = document.getElementById('step3InteriorScene');
    const cube = document.getElementById('step3InteriorCube');
    if (!scene || !cube || !hasStep3Interior) return;

    if (step3InteriorViewer) {
      step3InteriorViewer.refresh();
      return;
    }

    STEP3_INTERIOR_FACE_KEYS.forEach(face => {
      const img = scene.querySelector(`[data-vehicle-interior-face="${face}"]`);
      if (img && step3CloudinaryInteriorFaces[face]) img.src = step3CloudinaryInteriorFaces[face];
    });
    const size = Math.max(1200, Math.min(Math.max(scene.clientWidth || 0, scene.clientHeight || 0) * 2.08, 1680));
    scene.style.perspective = `${Math.max(1800, Math.round(size * 1.35))}px`;
    cube.style.setProperty('--vehicle-cube-size', `${size}px`);
    cube.style.setProperty('--vehicle-cube-half-size', `${size / 2}px`);
    cube.style.setProperty('--vehicle-cube-negative-half-size', `${-size / 2}px`);
    cube.style.width = `${size}px`;
    cube.style.height = `${size}px`;
    cube.style.transform = `rotateX(${step3InteriorPitch}deg) rotateY(${step3InteriorYaw}deg)`;
  }

  function setupStep3InteriorViewer() {
    const viewerRoot = document.getElementById('step3VisualViewer');
    const scene = document.getElementById('step3InteriorScene');
    if (!viewerRoot || !scene || !hasStep3Interior || !window.WedriveVehicleViewer) return false;

    viewerRoot.setAttribute('data-vehicle-viewer', '');
    viewerRoot.setAttribute('data-vehicle-default-view', 'interior');
    step3InteriorViewer = window.WedriveVehicleViewer.get(viewerRoot) || window.WedriveVehicleViewer.init(viewerRoot, {
      defaultView: 'interior',
      autoDrift: false
    });

    if (!step3InteriorViewer || typeof step3InteriorViewer.setInteriorFaces !== 'function') return false;
    if (typeof step3InteriorViewer.toggleAutoDrift === 'function') {
      step3InteriorViewer.toggleAutoDrift(false);
    }
    step3InteriorViewer.setInteriorFaces(step3CloudinaryInteriorFaces, 'Saved vehicle');
    step3InteriorViewer.setInteriorOrientation(180, 0, true);
    return true;
  }

  function navigateStep3ExteriorFrame(direction) {
    if (!step3CloudinaryFrames.length) return;
    step3CloudinaryFrameIndex = (step3CloudinaryFrameIndex + direction + step3CloudinaryFrames.length) % step3CloudinaryFrames.length;
    renderStep3CloudinaryFrame();
  }

  function getLang() {
    return localStorage.getItem('wedrive_lang') || 'ms';
  }

  // Gallery Navigation & Thumbnails
  function renderStep3GalleryThumbnails() {
    const strip = document.getElementById('step3GalleryThumbnailsStrip');
    const container = document.getElementById('step3GalleryThumbnailsContainer');
    if (!strip) return;
    if (!currentStep3Photos || currentStep3Photos.length <= 1) {
      strip.innerHTML = '';
      if (container) container.classList.add('hidden');
      return;
    }

    if (container) container.classList.remove('hidden');
    const isEn = getLang() === 'en';
    strip.innerHTML = currentStep3Photos.map((photo, idx) => {
      const isActive = (idx === currentStep3PhotoIndex && activeStep3VisualMode === 'gallery');
      const title = isEn ? (photo.titleEn || photo.title || `Photo ${idx + 1}`) : (photo.title || `Foto ${idx + 1}`);
      return `
        <button type="button" onclick="window.WeDriveStep3.selectPhoto(${idx})"
          class="gallery-thumb-btn relative rounded-xl overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-300 ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-md border-transparent' : 'opacity-60 hover:opacity-100 hover:scale-[1.03] border border-border-day bg-surface-container'}"
          style="width: 58px; height: 42px;"
          title="${title}" aria-label="${title}">
          <img src="${photo.img}" alt="${title}" class="w-full h-full object-cover" />
        </button>
      `;
    }).join('');
  }

  function selectStep3GalleryPhoto(index) {
    if (!currentStep3Photos || !currentStep3Photos[index]) return;
    currentStep3PhotoIndex = index;
    const photo = currentStep3Photos[index];

    const viewportImg = document.getElementById('step3ViewportImage');
    const emptyState = document.getElementById('step3EmptyShowcaseState');
    if (viewportImg && photo.img) {
      viewportImg.style.backgroundImage = `url('${photo.img}')`;
      viewportImg.classList.remove('hidden');
      if (emptyState) emptyState.classList.add('hidden');
    }

    if (activeStep3VisualMode !== 'gallery') {
      setStep3Tab('gallery');
    } else {
      renderStep3GalleryThumbnails();
    }
  }

  function navigateStep3Gallery(direction) {
    if (!currentStep3Photos || currentStep3Photos.length === 0) return;
    currentStep3PhotoIndex = (currentStep3PhotoIndex + direction + currentStep3Photos.length) % currentStep3Photos.length;
    selectStep3GalleryPhoto(currentStep3PhotoIndex);
  }

  function setStep3Tab(mode) {
    activeStep3VisualMode = mode;
    const tab360 = document.getElementById('step3Tab360');
    const tabInterior = document.getElementById('step3TabInterior');
    const tabGal = document.getElementById('step3TabGallery');
    const viewportImg = document.getElementById('step3ViewportImage');
    const interiorScene = document.getElementById('step3InteriorScene');
    const iframe360 = document.getElementById('step3Iframe360');
    const emptyState = document.getElementById('step3EmptyShowcaseState');
    const swipeIndicator = document.getElementById('step3SwipeIndicator');
    const indicatorText = document.getElementById('step3IndicatorText');
    const btnPrev = document.getElementById('step3BtnPrevImage');
    const btnNext = document.getElementById('step3BtnNextImage');
    const thumbsContainer = document.getElementById('step3GalleryThumbnailsContainer');
    const isEn = getLang() === 'en';

    // Helper: hide all layers
    function hideAll() {
      if (emptyState) emptyState.classList.add('hidden');
      if (viewportImg) { viewportImg.classList.add('hidden'); viewportImg.style.backgroundImage = ''; }
      if (interiorScene) { interiorScene.classList.add('hidden'); interiorScene.style.display = 'none'; }
      if (iframe360) {
        iframe360.classList.add('hidden');
        iframe360.removeAttribute('src');
      }
      if (swipeIndicator) swipeIndicator.classList.add('hidden');
      if (btnPrev) btnPrev.classList.add('hidden');
      if (btnNext) btnNext.classList.add('hidden');
      if (thumbsContainer) thumbsContainer.classList.add('hidden');
      updateStep3FrameLoadingUi(
        step3PreloadedFrameIndexes.size,
        step3CloudinaryFrames.length,
        step3FailedFrameIndexes.size,
        false
      );
    }

    const activeStyle = 'flex-1 bg-white dark:bg-[#161618] shadow-xs rounded-full py-1.5 font-caption text-caption text-on-surface text-center font-bold whitespace-nowrap cursor-pointer';
    const inactiveStyle = 'flex-1 text-secondary font-caption text-caption py-1.5 text-center transition-colors hover:text-on-surface whitespace-nowrap cursor-pointer';

    if (mode === 'interior' && hasStep3Interior) {
      if (tabInterior) tabInterior.className = activeStyle;
      if (tab360) tab360.className = inactiveStyle;
      if (tabGal) tabGal.className = inactiveStyle;
      hideAll();
      if (interiorScene) {
        interiorScene.classList.remove('hidden');
        interiorScene.style.display = 'flex';
        setupStep3InteriorViewer();
        renderStep3CloudinaryInterior();
      }
      if (swipeIndicator) swipeIndicator.classList.remove('hidden');
      if (indicatorText) indicatorText.textContent = isEn ? 'Drag to look around inside' : 'Seret untuk lihat bahagian dalam';
      return;
    }

    if (mode === '360' && hasStep3360) {
      if (tab360) tab360.className = activeStyle;
      if (tabInterior) tabInterior.className = inactiveStyle;
      if (tabGal) tabGal.className = inactiveStyle;
      hideAll();
      if (step3CloudinaryFrames.length > 0) {
        renderStep3CloudinaryFrame();
        updateStep3FrameLoadingUi(
          step3PreloadedFrameIndexes.size,
          step3CloudinaryFrames.length,
          step3FailedFrameIndexes.size,
          true
        );
        if (btnPrev) btnPrev.classList.remove('hidden');
        if (btnNext) btnNext.classList.remove('hidden');
        if (swipeIndicator) swipeIndicator.classList.remove('hidden');
        if (indicatorText) indicatorText.textContent = isEn ? 'Drag to rotate 360°' : 'Seret untuk putar 360°';
      } else {
        if (emptyState) emptyState.classList.remove('hidden');
      }
    } else {
      activeStep3VisualMode = 'gallery';
      if (tab360) tab360.className = inactiveStyle + (hasStep3360 ? '' : ' hidden');
      if (tabInterior) tabInterior.className = inactiveStyle + (hasStep3Interior ? '' : ' hidden');
      if (tabGal) tabGal.className = activeStyle;
      hideAll();

      if (currentStep3Photos && currentStep3Photos.length > 0) {
        const photo = currentStep3Photos[currentStep3PhotoIndex] || currentStep3Photos[0];
        if (photo && photo.img) {
          if (viewportImg) {
            viewportImg.classList.remove('hidden');
            viewportImg.style.backgroundImage = `url('${photo.img}')`;
          }
          if (currentStep3Photos.length > 1) {
            if (btnPrev) btnPrev.classList.remove('hidden');
            if (btnNext) btnNext.classList.remove('hidden');
            if (thumbsContainer) thumbsContainer.classList.remove('hidden');
            renderStep3GalleryThumbnails();
          }
        }
      } else {
        if (emptyState) emptyState.classList.remove('hidden');
      }
    }
  }

  // Real Data Pipeline: Load draft values directly from Step 1 & Step 2
  // Zero Fake Data Standard: Clean blank placeholders ("-", "RM 0.00") when empty
  function loadCarDraft() {
    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      const data = raw ? JSON.parse(raw) : null;
      const isEn = getLang() === 'en';
      if (!hasPersistedCloudinaryVisuals(data)) {
        // This is the route-level protection for a manually typed Step 3 URL
        // or any old stepper link. Step 2 is the only place that may create
        // persisted visual assets.
        window.location.replace('step2_studio360.html');
        return;
      }
      step3CloudinaryFrames = normaliseStep3Photos(data && (data.exterior_frames || data.cloudinary_exterior_frames))
        .map(photo => photo.img);
      step3CloudinaryFrameIndex = 0;
      step3CloudinaryInteriorFaces = parseInteriorFaces(data && (data.interior_360 || data.cloudinary_interior_faces));
      hasStep3Interior = Object.keys(step3CloudinaryInteriorFaces).some(face => step3CloudinaryInteriorFaces[face]);

      const cloudinaryGallery = data ? [
        ...(Array.isArray(data.cloudinary_gallery) ? data.cloudinary_gallery : []),
        ...(Array.isArray(data.supabase_images) ? data.supabase_images : []),
        ...(Array.isArray(data.images) ? data.images : [])
      ].filter(url => typeof url === 'string' && url.includes('res.cloudinary.com/')) : [];
      const hasVisualAssets = Boolean(cloudinaryGallery.length || step3CloudinaryFrames.length);
      const switcher = document.getElementById('step3SegmentedSwitcher');
      const tab360 = document.getElementById('step3Tab360');
      const tabInterior = document.getElementById('step3TabInterior');

      if (!hasVisualAssets) {
        // Without visuals, Step 3 displays empty prompt
        currentStep3Photos = [];
        hasStep3360 = false;
        if (switcher) switcher.classList.add('hidden');
        setStep3Tab('gallery');
      } else {
        // Visuals are downloaded & saved to Supabase/draft
        const draftSupabase = cloudinaryGallery;
        const draftGallery8 = [];
        const draftUploaded = [];

        if (draftSupabase.length > 0) {
          currentStep3Photos = normaliseStep3Photos(draftSupabase);
        } else if (draftGallery8.length > 0) {
          currentStep3Photos = normaliseStep3Photos(draftGallery8);
        } else if (draftUploaded.length > 0) {
          currentStep3Photos = normaliseStep3Photos(draftUploaded);
        } else if (data && data.image_url) {
          currentStep3Photos = [{ title: 'Hadapan Penuh', titleEn: 'Full Front', img: data.image_url }];
        } else {
          currentStep3Photos = [];
        }

        hasStep3360 = step3CloudinaryFrames.length > 0;

        if (hasStep3360) {
          if (switcher) {
            switcher.classList.remove('hidden', 'max-w-[150px]');
            switcher.classList.add('max-w-[260px]');
          }
          if (tab360) tab360.classList.remove('hidden');
          if (tabInterior && hasStep3Interior) tabInterior.classList.remove('hidden');
          setStep3Tab('360');
          preloadStep3Frames();
        } else {
          if (switcher) {
            switcher.classList.remove('hidden', 'max-w-[260px]');
            switcher.classList.add(hasStep3Interior ? 'max-w-[260px]' : 'max-w-[150px]');
          }
          if (tab360) tab360.classList.add('hidden');
          if (tabInterior) tabInterior.classList.toggle('hidden', !hasStep3Interior);
          setStep3Tab('gallery');
        }
      }
      currentStep3PhotoIndex = 0;

      // Pure real data, clean blank placeholders if absent (Sifar Data Palsu)
      const brand = data && data.brand ? data.brand : '-';
      const model = data && data.model ? data.model : '-';
      const variant = data && data.variant ? data.variant : '';
      const plate = data && data.plate ? data.plate : '-';
      const category = data && data.category ? data.category : '-';
      const year = data && data.year ? data.year : '-';
      const color = data && data.color ? data.color : '-';
      const engine = data && data.engine ? data.engine : '-';
      const fuel = data && data.fuel ? data.fuel : '-';
      const transmission = data && data.transmission ? data.transmission : '-';
      const seats = data && data.seats ? `${data.seats} ${isEn ? 'Seats' : 'Tempat Duduk'}` : '-';

      const dailyVal = data && data.dailyPrice ? Number(data.dailyPrice) : 0;
      const weeklyVal = data && data.weeklyPrice ? Number(data.weeklyPrice) : (dailyVal ? dailyVal * 6 : 0);
      const monthlyVal = data && data.monthlyPrice ? Number(data.monthlyPrice) : (dailyVal ? dailyVal * 20 : 0);

      const daily = dailyVal > 0 ? `RM ${Math.round(dailyVal)}` : 'RM 0';
      const weekly = weeklyVal > 0 ? `RM ${Math.round(weeklyVal)}` : 'RM 0';
      const monthly = monthlyVal > 0 ? `RM ${Math.round(monthlyVal)}` : 'RM 0';

      // Update Spec Fields
      if (document.getElementById('specPlate')) document.getElementById('specPlate').textContent = plate;
      if (document.getElementById('specBrand')) document.getElementById('specBrand').textContent = brand;
      if (document.getElementById('specModelVariant')) {
        const fullModel = (brand === '-' && model === '-') ? '-' : [model, variant].filter(Boolean).join(' ');
        document.getElementById('specModelVariant').textContent = fullModel;
        document.getElementById('specModelVariant').title = fullModel;
      }
      if (document.getElementById('specCategory')) document.getElementById('specCategory').textContent = category;
      if (document.getElementById('specYear')) document.getElementById('specYear').textContent = year;
      if (document.getElementById('specColor')) {
        document.getElementById('specColor').textContent = color;
        document.getElementById('specColor').title = color;
      }
      if (document.getElementById('specEngine')) {
        document.getElementById('specEngine').textContent = engine;
        document.getElementById('specEngine').title = engine;
      }
      if (document.getElementById('specFuel')) document.getElementById('specFuel').textContent = fuel;
      if (document.getElementById('specTransmission')) document.getElementById('specTransmission').textContent = transmission;
      if (document.getElementById('specSeats')) document.getElementById('specSeats').textContent = seats;

      // Update Pricing
      if (document.getElementById('tarifDaily')) document.getElementById('tarifDaily').textContent = daily;
      if (document.getElementById('tarifWeekly')) document.getElementById('tarifWeekly').textContent = weekly;
      if (document.getElementById('tarifMonthly')) document.getElementById('tarifMonthly').textContent = monthly;
    } catch (e) {
      console.warn('[WeDRIVE] Error loading car draft:', e);
      setStep3Tab('gallery');
    }
  }

  let step3ToastTimeout = null;
  function showStep3Toast(msg, type = 'error') {
    const toast = document.getElementById('step3Toast');
    const toastMsg = document.getElementById('step3ToastMsg');
    const toastIcon = document.getElementById('step3ToastIcon');
    const iconContainer = document.getElementById('step3ToastIconContainer');
    if (!toast || !toastMsg) return;

    clearTimeout(step3ToastTimeout);
    toastMsg.textContent = msg;

    if (toastIcon && iconContainer) {
      if (type === 'error' || type === 'warning') {
        toastIcon.textContent = 'warning';
        toastIcon.className = 'material-symbols-outlined text-red-500 text-[18px]';
        iconContainer.className = 'circle-1-1 w-7 h-7 bg-red-500/20 text-red-500 flex items-center justify-center flex-shrink-0';
      } else {
        toastIcon.textContent = 'check_circle';
        toastIcon.className = 'material-symbols-outlined text-green-500 text-[18px]';
        iconContainer.className = 'circle-1-1 w-7 h-7 bg-green-500/20 text-green-500 flex items-center justify-center flex-shrink-0';
      }
    }

    toast.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-[-10px]');
    toast.classList.add('opacity-100', 'translate-y-0');

    step3ToastTimeout = setTimeout(() => {
      toast.classList.remove('opacity-100', 'translate-y-0');
      toast.classList.add('opacity-0', 'pointer-events-none', 'translate-y-[-10px]');
    }, 4000);
  }

  // Publish / Register Car into Supabase Database
  async function confirmPublish() {
    if (isPublishing) return;
    const isEn = getLang() === 'en';

    const raw = localStorage.getItem('wedrive_new_car_draft');
    const draft = raw ? JSON.parse(raw) : null;
    if (!draft || (!draft.brand && !draft.model)) {
      showStep3Toast(
        isEn ? 'Please complete vehicle specifications in Step 1 before submitting.' : 'Sila lengkapkan spesifikasi kenderaan di Langkah 1 sebelum mendaftar.',
        'error'
      );
      return;
    }

    // Syarat Mandatori 1: Nombor plat pendaftaran WAJIB sah (minima 3 aksara)
    const hasPlate = Boolean(draft.plate && draft.plate.trim().length >= 3);
    if (!hasPlate) {
      const errMsg = isEn
        ? 'Registration rejected: Vehicle must have a valid registration plate number. Please return to Step 1.'
        : 'Pendaftaran ditolak: Nombor plat pendaftaran kenderaan tidak lengkap. Sila kembali ke Langkah 1.';
      showStep3Toast(errMsg, 'error');
      return;
    }

    // Syarat Mandatori 2: sekurang-kurangnya satu aset Cloudinary (foto atau 360°)
    const hasPhotos = [
      ...(Array.isArray(draft.cloudinary_gallery) ? draft.cloudinary_gallery : []),
      ...(Array.isArray(draft.supabase_images) ? draft.supabase_images : []),
      ...(Array.isArray(draft.images) ? draft.images : [])
    ].some(item => {
      const url = typeof item === 'string' ? item : (item && item.img);
      return typeof url === 'string' && url.includes('res.cloudinary.com/');
    });
    const has360 = Boolean(Array.isArray(draft.exterior_frames) && draft.exterior_frames.length > 0);

    if (!hasPhotos && !has360) {
      const errMsg = isEn
        ? 'Registration rejected: Vehicle must have at least 1 photo or a 360° link before registration.'
        : 'Pendaftaran ditolak: Sila muat naik sekurang-kurangnya 1 gambar atau pautan 360° kenderaan.';
      showStep3Toast(errMsg, 'error');
      return;
    }

    isPublishing = true;

    const btnSubmit = document.getElementById('btnSubmitCarRegistration');
    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <span class="material-symbols-outlined text-[20px] text-white animate-spin">progress_activity</span>
        <span>${isEn ? 'Registering Vehicle...' : 'Mendaftarkan Kenderaan...'}</span>
      `;
    }

    try {
      const carName = `${draft.brand || ''} ${draft.model || ''} ${draft.variant || ''}`.trim() || 'Kenderaan Baharu';
      const dailyPrice = parseFloat(draft.dailyPrice);
      const weeklyPrice = parseFloat(draft.weeklyPrice);
      const monthlyPrice = parseFloat(draft.monthlyPrice);
      if (!Number.isFinite(dailyPrice) || dailyPrice <= 0 ||
          !Number.isFinite(weeklyPrice) || weeklyPrice <= 0 ||
          !Number.isFinite(monthlyPrice) || monthlyPrice <= 0) {
        throw new Error('Kadar harian, mingguan dan bulanan mesti lengkap sebelum pendaftaran.');
      }
      const cloudinaryFrames = Array.isArray(draft.exterior_frames) && draft.exterior_frames.length > 0
        ? draft.exterior_frames
        : (Array.isArray(draft.cloudinary_exterior_frames) ? draft.cloudinary_exterior_frames : []);
      const cloudinaryInteriorFaces = parseInteriorFaces(draft.interior_360 || draft.cloudinary_interior_faces);
      const cloudinaryReady = cloudinaryFrames.length > 0;
      const imagesList = (draft.cloudinary_gallery && draft.cloudinary_gallery.length > 0)
        ? draft.cloudinary_gallery
        : (draft.supabase_images && draft.supabase_images.length > 0)
          ? draft.supabase_images
          : [];

      const newCarPayload = {
        name: carName,
        plate: (draft.plate || '').toUpperCase() || null,
        type: (draft.category || 'sedan').toLowerCase(),
        label: draft.category || 'Sedan',
        status: 'Available',
        rate: `RM ${Math.round(dailyPrice)}/hari`,
        price: dailyPrice,
        weeklyPrice: weeklyPrice,
        monthlyPrice: monthlyPrice,
        weekly_price: weeklyPrice,
        monthly_price: monthlyPrice,
        fuel: draft.fuel || 'Petrol',
        transmission: draft.transmission || 'Automatic',
        trans: (draft.transmission || '').toLowerCase().includes('auto') ? 'Auto' : 'Manual',
        seats: parseInt(draft.seats, 10) || 5,
        year: parseInt(draft.year, 10) || new Date().getFullYear(),
        color: draft.color || 'Putih',
        rating: 5.0,
        reviews: 0,
        ai: draft.ai_tagline || null,
        images: imagesList,
        has_360: cloudinaryReady,
        exterior_360: cloudinaryReady
          ? (draft.exterior_360 || JSON.stringify({ type: 'cloudinary', frame_count: cloudinaryFrames.length }))
          : null,
        interior_360: Object.keys(cloudinaryInteriorFaces).length > 0
          ? JSON.stringify(cloudinaryInteriorFaces)
          : null,
        exterior_frames: cloudinaryReady ? cloudinaryFrames : null,
        orientation_frames: draft.orientation_frames || {
          hero: 140,
          front: 125,
          right: 175,
          left: 75,
          rear: 24,
          rear_left: 0
        }
      };

      // Call WeDriveAPI or Supabase client
      if (window.WeDriveAPI && typeof window.WeDriveAPI.publishCarDraft === 'function' && draft.supabase_draft_id) {
        const result = await window.WeDriveAPI.publishCarDraft(draft.supabase_draft_id, newCarPayload);
        if (!result || result.error || !result.data) throw (result && result.error) || new Error('Supabase publish returned no record.');
      } else if (window.WeDriveAPI && typeof window.WeDriveAPI.createCar === 'function') {
        const result = await window.WeDriveAPI.createCar(newCarPayload);
        if (!result || result.error || !result.data) throw (result && result.error) || new Error('Supabase create returned no record.');
      } else if (window.supabaseClient) {
        const result = await window.supabaseClient.from('cars').insert([newCarPayload]).select().single();
        if (result.error || !result.data) throw result.error || new Error('Supabase insert returned no record.');
      }

      // Mark draft as completed
      draft.isPublished = true;
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));

      // Show Success Modal
      const modal = document.getElementById('successModal');
      const modalDesc = document.querySelector('#successModal p');
      if (modalDesc) {
        modalDesc.textContent = isEn
          ? `${newCarPayload.name} (${draft.plate || 'Registration No.'}) has been successfully registered into WeDRIVE active inventory.`
          : `${newCarPayload.name} (${draft.plate || 'No. Pendaftaran'}) telah berjaya didaftarkan ke dalam sistem inventori aktif WeDRIVE.`;
      }
      if (modal) modal.classList.remove('hidden');

    } catch (err) {
      console.error('[WeDRIVE] Error publishing car:', err);
      showStep3Toast(isEn
        ? `Registration failed: ${err.message || 'Supabase could not save the vehicle.'}`
        : `Pendaftaran gagal: ${err.message || 'Supabase tidak dapat menyimpan kenderaan.'}`, 'error');
    } finally {
      isPublishing = false;
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = `
          <span class="material-symbols-outlined text-[20px] text-white">check_circle</span>
          <span>Daftar Kenderaan Baharu</span>
        `;
      }
    }
  }

  function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('hidden');
  }

  function init() {
    document.getElementById('step3Tab360')?.addEventListener('click', () => setStep3Tab('360'));
    document.getElementById('step3TabInterior')?.addEventListener('click', () => setStep3Tab('interior'));
    document.getElementById('step3TabGallery')?.addEventListener('click', () => setStep3Tab('gallery'));

    document.getElementById('step3BtnPrevImage')?.addEventListener('click', () => {
      if (activeStep3VisualMode === '360' && step3CloudinaryFrames.length > 0) navigateStep3ExteriorFrame(-1);
      else navigateStep3Gallery(-1);
    });
    document.getElementById('step3BtnNextImage')?.addEventListener('click', () => {
      if (activeStep3VisualMode === '360' && step3CloudinaryFrames.length > 0) navigateStep3ExteriorFrame(1);
      else navigateStep3Gallery(1);
    });

    const visualViewport = document.getElementById('step3VisualViewer');
    let dragStartX = null;
    let dragStartY = null;
    visualViewport?.addEventListener('pointerdown', event => {
      if (activeStep3VisualMode !== '360' && activeStep3VisualMode !== 'interior') return;
      if (activeStep3VisualMode === '360' && !step3CloudinaryFrames.length) return;
      if (activeStep3VisualMode === 'interior' && !hasStep3Interior) return;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      visualViewport.setPointerCapture?.(event.pointerId);
    });
    visualViewport?.addEventListener('pointermove', event => {
      if (dragStartX === null) return;
      if (activeStep3VisualMode === 'interior' && hasStep3Interior) {
        if (step3InteriorViewer) return;
        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - (dragStartY || event.clientY);
        if (Math.abs(deltaX) >= 4 || Math.abs(deltaY) >= 4) {
          step3InteriorYaw += deltaX * 0.32;
          step3InteriorPitch = Math.max(-34, Math.min(24, step3InteriorPitch - deltaY * 0.14));
          renderStep3CloudinaryInterior();
          dragStartX = event.clientX;
          dragStartY = event.clientY;
        }
        return;
      }
      if (activeStep3VisualMode !== '360' || !step3CloudinaryFrames.length) return;
      const delta = event.clientX - dragStartX;
      const pixelsPerFrame = 6;
      if (Math.abs(delta) >= pixelsPerFrame) {
        const frameSteps = Math.max(1, Math.floor(Math.abs(delta) / pixelsPerFrame));
        for (let step = 0; step < frameSteps; step += 1) {
          navigateStep3ExteriorFrame(delta > 0 ? -1 : 1);
        }
        dragStartX = event.clientX;
      }
    });
    visualViewport?.addEventListener('pointerup', () => { dragStartX = null; dragStartY = null; });
    visualViewport?.addEventListener('pointercancel', () => { dragStartX = null; dragStartY = null; });

    document.getElementById('btnSubmitCarRegistration')?.addEventListener('click', confirmPublish);
    document.getElementById('btnCloseSuccessModal')?.addEventListener('click', closeModal);

    // Forward Navigation Gatekeeper (Lihat Sebagai Pelanggan & Stepper 4/5)
    function validateStep3Forward(e) {
      const isEn = (localStorage.getItem('wedrive_lang') || 'ms') === 'en';
      const draft = JSON.parse(localStorage.getItem('wedrive_new_car_draft') || '{}');
      const hasPlate = Boolean(draft.plate && draft.plate.trim().length >= 3);
      const hasPhotos = (currentStep3Photos && currentStep3Photos.length > 0 && currentStep3Photos.some(p => p && p.img)) ||
                        (Array.isArray(draft.cloudinary_gallery) && draft.cloudinary_gallery.length > 0) ||
                        (Array.isArray(draft.supabase_images) && draft.supabase_images.some(url => typeof url === 'string' && url.includes('res.cloudinary.com/')));
      const has360 = Array.isArray(draft.exterior_frames) && draft.exterior_frames.length > 0;

      if (!hasPlate) {
        if (e) e.preventDefault();
        showStep3Toast(isEn ? 'Please provide a valid plate number in Step 1 first.' : 'Sila lengkapkan nombor plat di Langkah 1 terlebih dahulu.', 'error');
        return false;
      }
      if (!hasPhotos && !has360) {
        if (e) e.preventDefault();
        showStep3Toast(isEn ? 'Please upload at least 1 photo in Step 2 first.' : 'Sila muat naik sekurang-kurangnya 1 gambar di Langkah 2 terlebih dahulu.', 'error');
        return false;
      }
      return true;
    }

    document.getElementById('btnViewAsCustomer')?.addEventListener('click', validateStep3Forward);
    document.querySelectorAll('.wizard-stepper a[href*="step4"], .wizard-stepper a[href*="step5"]').forEach(link => {
      link.addEventListener('click', validateStep3Forward);
    });

    loadCarDraft();

    window.addEventListener('wedrive:language-applied', () => {
      renderStep3GalleryThumbnails();
      loadCarDraft();
    });
  }

  window.WeDriveStep3 = {
    setStep3Tab: setStep3Tab,
    selectPhoto: selectStep3GalleryPhoto,
    navigateGallery: navigateStep3Gallery,
    confirmPublish: confirmPublish,
    closeModal: closeModal,
    loadCarDraft: loadCarDraft
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
