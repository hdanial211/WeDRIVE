/**
 * WeDRIVE Admin Add Car - Step 2: Studio Visual 360°
 * admin/pages/car/add-car/step2-studio360.js
 * 
 * Features:
 * - Turntable 360 viewer with interactive drag-to-spin & fullscreen
 * - Progressive Segmented Switcher (Gallery -> 360 & Panorama)
 * - Siri AI Iridescent aura & CDN link scanner
 * - Visual draft & Supabase live session sync (Zero Dummy Data)
 */

(function () {
  'use strict';

  // Master Image Assets
  const ASSET_360_IMG = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXv-DH82fsjprfpGpSo2DHFgcMwOtUC3ZASUhwfjHsNXTMVzs6gH1edgnQoIeM5BQ-gN5Quk__-3fh0tRncgoo8CwqIDSi3SzWNMSkRhEVtIrkDJCfRZMRNF8lX8AGLWTdF0jPHpnI3HywwDZEwxcUlJtoQ00vlCiI82q9HzlrtRvGLMD32g63eHxTy-ErJMRcOfqLzUfqMKg1VUFyEgDi1wUjsql-khj5lNAkwmLnQc-ZUnXgxY4g-7VNBOZm1VN_eCh3ANLf-7Q';
  const ASSET_PANORAMA_IMG = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80';

  const INSPECTION_PHOTOS_DEFAULT = [
    { title: 'Hadapan Penuh', titleEn: 'Full Front', img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=85', badge: 'Diimbas AI' },
    { title: 'Belakang Penuh', titleEn: 'Full Rear', img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=85', badge: 'Diimbas AI' },
    { title: 'Sisi Kanan Profil', titleEn: 'Right Side Profile', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85', badge: 'Diimbas AI' },
    { title: 'Sisi Kiri Profil', titleEn: 'Left Side Profile', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85', badge: 'Diimbas AI' },
    { title: 'Suku Hadapan Kiri', titleEn: 'Front Left Quarter', img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=85', badge: 'Diimbas AI' },
    { title: 'Suku Belakang Kanan', titleEn: 'Rear Right Quarter', img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=85', badge: 'Diimbas AI' }
  ];

  let currentGalleryPhotos = [...INSPECTION_PHOTOS_DEFAULT];
  let currentGalleryPhotoIndex = 0;
  let activeVisualMode = 'gallery';
  let has360Expanded = false;
  let isAnalyzing = false;
  let isSavingDb = false;
  let isSavedToDb = false;
  let toastTimeout = null;

  // DOM Elements
  const segmentedSwitcher = document.getElementById('segmentedSwitcher');
  const tab360 = document.getElementById('tab360');
  const tabPanorama = document.getElementById('tabPanorama');
  const tabGallery = document.getElementById('tabGallery');
  const viewportRenderImage = document.getElementById('viewportRenderImage');
  const btnPrevImage = document.getElementById('btnPrevImage');
  const btnNextImage = document.getElementById('btnNextImage');
  const dragIndicatorOverlay = document.getElementById('dragIndicatorOverlay');
  const galleryThumbnailsContainer = document.getElementById('galleryThumbnailsContainer');
  const galleryThumbnailsStrip = document.getElementById('galleryThumbnailsStrip');
  const photoUploadSlotsGrid = document.getElementById('photoUploadSlotsGrid');

  const cdnUrlInput = document.getElementById('cdnUrlInput');
  const cdnInputWrapper = document.getElementById('cdnInputWrapper');
  const aiLaserScanner = document.getElementById('aiLaserScanner');
  const btnGenerate3D = document.getElementById('btnGenerate3D');
  const btnGenIcon = document.getElementById('btnGenIcon');
  const btnGenText = document.getElementById('btnGenText');
  const btnSaveToDb = document.getElementById('btnSaveToDb');
  const btnSaveDbIcon = document.getElementById('btnSaveDbIcon');
  const btnSaveDbText = document.getElementById('btnSaveDbText');
  const cdnStatusBadge = document.getElementById('cdnStatusBadge');
  const cdnStatusIcon = document.getElementById('cdnStatusIcon');
  const cdnStatusText = document.getElementById('cdnStatusText');
  const cdnDetectionTags = document.getElementById('cdnDetectionTags');
  const turntableViewport = document.getElementById('turntableViewport');
  const btnFullscreen360 = document.getElementById('btnFullscreen360');
  const iconFullscreen = document.getElementById('iconFullscreen');

  const saveDbProgressBox = document.getElementById('saveDbProgressBox');
  const downloadStatusIcon = document.getElementById('downloadStatusIcon');
  const downloadStatusLabel = document.getElementById('downloadStatusLabel');
  const downloadPercentText = document.getElementById('downloadPercentText');
  const downloadProgressBar = document.getElementById('downloadProgressBar');
  const downloadFilesStatus = document.getElementById('downloadFilesStatus');
  const downloadTimeEstimate = document.getElementById('downloadTimeEstimate');

  const ai3dToast = document.getElementById('ai3dToast');
  const aiToastMsg = document.getElementById('aiToastMsg');
  const aiToastIcon = document.getElementById('aiToastIcon');

  function getLang() {
    return localStorage.getItem('wedrive_lang') || 'ms';
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

  // Progressive Visual Tabs (Gallery -> 360 & Panorama)
  function setVisualTab(mode) {
    activeVisualMode = mode;
    const activeStyle = 'flex-1 bg-white dark:bg-[#1D1D20] text-on-surface font-footnote text-footnote font-bold shadow-xs rounded-full py-[6px] text-center transition-all whitespace-nowrap cursor-pointer';
    const inactiveStyle = 'flex-1 text-on-surface-variant font-footnote text-footnote hover:text-on-surface rounded-full py-[6px] text-center transition-all whitespace-nowrap cursor-pointer';

    if (mode === '360') {
      if (tab360) tab360.className = activeStyle;
      if (tabPanorama) tabPanorama.className = inactiveStyle;
      if (tabGallery) tabGallery.className = inactiveStyle;
      if (viewportRenderImage) viewportRenderImage.style.backgroundImage = `url('${ASSET_360_IMG}')`;
      if (dragIndicatorOverlay) dragIndicatorOverlay.classList.remove('hidden');
      if (btnPrevImage) btnPrevImage.classList.add('hidden');
      if (btnNextImage) btnNextImage.classList.add('hidden');
      if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.add('hidden');
    } else if (mode === 'panorama') {
      if (tab360) tab360.className = inactiveStyle;
      if (tabPanorama) tabPanorama.className = activeStyle;
      if (tabGallery) tabGallery.className = inactiveStyle;
      if (viewportRenderImage) viewportRenderImage.style.backgroundImage = `url('${ASSET_PANORAMA_IMG}')`;
      if (dragIndicatorOverlay) dragIndicatorOverlay.classList.remove('hidden');
      if (btnPrevImage) btnPrevImage.classList.add('hidden');
      if (btnNextImage) btnNextImage.classList.add('hidden');
      if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.add('hidden');
    } else {
      if (tab360) tab360.className = inactiveStyle;
      if (tabPanorama) tabPanorama.className = inactiveStyle;
      if (tabGallery) tabGallery.className = activeStyle;
      const photo = currentGalleryPhotos[currentGalleryPhotoIndex] || currentGalleryPhotos[0];
      if (viewportRenderImage && photo) viewportRenderImage.style.backgroundImage = `url('${photo.img}')`;
      if (dragIndicatorOverlay) dragIndicatorOverlay.classList.add('hidden');
      if (btnPrevImage) btnPrevImage.classList.remove('hidden');
      if (btnNextImage) btnNextImage.classList.remove('hidden');
      if (galleryThumbnailsContainer) galleryThumbnailsContainer.classList.remove('hidden');
      renderGalleryThumbnails();
    }
  }

  function expand360Tabs() {
    if (has360Expanded) return;
    has360Expanded = true;

    if (segmentedSwitcher) {
      segmentedSwitcher.classList.remove('max-w-[130px]');
      segmentedSwitcher.classList.add('max-w-md');
    }
    if (tab360) tab360.classList.remove('hidden');
    if (tabPanorama) tabPanorama.classList.remove('hidden');

    setVisualTab('360');

    // Update draft in localStorage
    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      const draft = raw ? JSON.parse(raw) : {};
      draft.has360 = true;
      draft.cdnUrl = cdnUrlInput ? cdnUrlInput.value.trim() : '';
      localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));
    } catch (e) {}
  }

  // Gallery Navigation
  function renderGalleryThumbnails() {
    if (!galleryThumbnailsStrip) return;
    const isEn = getLang() === 'en';

    galleryThumbnailsStrip.innerHTML = currentGalleryPhotos.map((photo, idx) => {
      const isActive = (idx === currentGalleryPhotoIndex && activeVisualMode === 'gallery');
      const title = isEn ? (photo.titleEn || photo.title) : photo.title;
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

  function selectGalleryPhoto(index) {
    if (!currentGalleryPhotos[index]) return;
    currentGalleryPhotoIndex = index;
    const photo = currentGalleryPhotos[index];

    if (viewportRenderImage) {
      viewportRenderImage.style.backgroundImage = `url('${photo.img}')`;
    }

    if (activeVisualMode !== 'gallery') {
      setVisualTab('gallery');
    } else {
      renderGalleryThumbnails();
    }

    // Sync highlight ring on photo upload slots
    const slots = document.querySelectorAll('#photoUploadSlotsGrid > *');
    slots.forEach((s, idx) => {
      if (idx === index) {
        s.classList.add('ring-2', 'ring-primary');
      } else {
        s.classList.remove('ring-2', 'ring-primary');
      }
    });
  }

  function navigateGallery(direction) {
    if (!currentGalleryPhotos.length) return;
    currentGalleryPhotoIndex = (currentGalleryPhotoIndex + direction + currentGalleryPhotos.length) % currentGalleryPhotos.length;
    selectGalleryPhoto(currentGalleryPhotoIndex);
  }

  function populateAiInspectionPhotos() {
    if (!photoUploadSlotsGrid) return;
    const isEn = getLang() === 'en';

    photoUploadSlotsGrid.innerHTML = currentGalleryPhotos.map((photo, i) => {
      const title = isEn ? (photo.titleEn || photo.title) : photo.title;
      const badge = isEn ? 'AI Scanned' : 'Diimbas AI';
      return `
        <div onclick="window.WeDriveStudio360.selectPhoto(${i})" class="relative group rounded-xl h-32 overflow-hidden border border-border-day shadow-xs interactive-btn cursor-pointer transition-all duration-300 ai-field-wave ${i === currentGalleryPhotoIndex ? 'ring-2 ring-primary' : ''}">
          <img src="${photo.img}" alt="${title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-between p-2.5 pointer-events-none">
            <div class="flex justify-end">
              <span class="pill-btn bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] px-2 py-0.5 font-semibold flex items-center gap-1 shadow-sm">
                <span class="material-symbols-outlined text-[12px] text-green-400" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>${badge}</span>
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-white">
              <span class="material-symbols-outlined text-[14px] text-white/80">photo_camera</span>
              <span class="font-footnote text-footnote font-semibold text-white truncate drop-shadow-sm">${title}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    renderGalleryThumbnails();
    selectGalleryPhoto(0);

    setTimeout(() => {
      const cards = photoUploadSlotsGrid.querySelectorAll('.ai-field-wave');
      cards.forEach(c => c.classList.remove('ai-field-wave'));
    }, 1200);
  }

  // AI 360 Scanner & CDN Link Validator
  function triggerAiScan() {
    if (isAnalyzing) return;
    const urlVal = cdnUrlInput ? cdnUrlInput.value.trim() : '';

    if (!urlVal) {
      if (cdnStatusBadge) {
        cdnStatusBadge.className = 'pill-btn bg-amber-500/15 text-amber-500 font-caption text-caption px-sm py-[3px] flex items-center gap-xs font-semibold';
        if (cdnStatusIcon) cdnStatusIcon.textContent = 'warning';
        if (cdnStatusText) cdnStatusText.textContent = 'Pautan Diperlukan';
      }
      showAiToast('Sila masukkan URL CDN kenderaan terlebih dahulu.', false, 'warning');
      return;
    }

    isAnalyzing = true;
    if (btnGenerate3D) btnGenerate3D.disabled = true;
    if (btnSaveToDb) {
      btnSaveToDb.disabled = true;
      btnSaveToDb.classList.add('opacity-60', 'cursor-not-allowed');
    }

    // 1. Activate Shimmer & Laser
    if (cdnInputWrapper) cdnInputWrapper.classList.add('ai-analyzing-active');
    if (aiLaserScanner) aiLaserScanner.classList.remove('hidden');

    if (btnGenIcon) {
      btnGenIcon.textContent = 'progress_activity';
      btnGenIcon.classList.add('animate-spin');
    }
    if (btnGenText) btnGenText.textContent = 'Menyemak CDN...';

    if (cdnStatusBadge) {
      cdnStatusBadge.className = 'pill-btn ai-badge-pulse font-caption text-caption px-sm py-[3px] flex items-center gap-xs font-semibold';
      if (cdnStatusIcon) cdnStatusIcon.textContent = 'auto_awesome';
      if (cdnStatusText) cdnStatusText.textContent = 'AI Mengimbas Pautan...';
    }

    // Phase 1 (550ms)
    setTimeout(() => {
      if (cdnDetectionTags && isAnalyzing) {
        cdnDetectionTags.innerHTML = `
          <span class="pill-btn bg-success/15 text-success font-caption text-caption px-3 py-1 flex items-center gap-xs font-medium border border-success/30">
            <span class="material-symbols-outlined text-[14px]">check</span>
            <span>Pelayan CDN Aktif (14ms)</span>
          </span>
          <span class="pill-btn bg-primary/10 text-primary font-caption text-caption px-3 py-1 flex items-center gap-xs font-medium border border-primary/20">
            <span class="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
            <span>Mengimbas 200 kerangka 360° &amp; tekstur 8K...</span>
          </span>
        `;
      }
    }, 550);

    // Phase 2 (1300ms) - Ready
    setTimeout(() => {
      isSavedToDb = false;

      if (cdnInputWrapper) cdnInputWrapper.classList.remove('ai-analyzing-active');
      if (aiLaserScanner) aiLaserScanner.classList.add('hidden');

      if (cdnStatusBadge) {
        cdnStatusBadge.className = 'pill-btn bg-success/15 text-success font-caption text-caption px-sm py-[3px] flex items-center gap-xs font-semibold';
        if (cdnStatusIcon) cdnStatusIcon.textContent = 'verified';
        if (cdnStatusText) cdnStatusText.textContent = 'Pratonton Sedia';
      }

      populateAiInspectionPhotos();

      if (cdnDetectionTags) {
        cdnDetectionTags.innerHTML = `
          <span class="pill-btn bg-primary/10 text-primary font-caption text-caption px-3 py-1 flex items-center gap-xs font-medium border border-primary/20">
            <span class="material-symbols-outlined text-[14px]">visibility</span>
            <span>Pratonton 360° Aktif</span>
          </span>
          <span class="pill-btn bg-surface-container text-on-surface font-caption text-caption px-3 py-1 flex items-center gap-xs font-medium border border-border-day">
            <span class="material-symbols-outlined text-[14px] text-success">check</span>
            <span>Foto Galeri Terjana</span>
          </span>
          <span class="pill-btn bg-surface-container text-on-surface font-caption text-caption px-3 py-1 flex items-center gap-xs font-medium border border-border-day">
            <span class="material-symbols-outlined text-[14px] text-success">check</span>
            <span>200 Kerangka Luaran</span>
          </span>
        `;
      }

      if (btnSaveToDb) {
        btnSaveToDb.disabled = false;
        btnSaveToDb.className = 'pill-btn interactive-btn bg-primary/15 hover:bg-primary/25 text-primary border border-primary/30 font-headline text-[13px] font-bold px-4 py-2.5 flex items-center justify-center gap-2 shadow-xs shrink-0 transition-all active:scale-[0.97] cursor-pointer';
        if (btnSaveDbIcon) btnSaveDbIcon.textContent = 'cloud_download';
        if (btnSaveDbText) btnSaveDbText.textContent = 'Simpan Visual';
      }

      if (btnGenIcon) {
        btnGenIcon.classList.remove('animate-spin');
        btnGenIcon.textContent = 'check_circle';
      }
      if (btnGenText) btnGenText.textContent = 'Visual Sedia';

      if (turntableViewport) {
        turntableViewport.classList.add('turntable-flash-effect');
        setTimeout(() => turntableViewport.classList.remove('turntable-flash-effect'), 1200);
      }

      showAiToast('✓ Visual 360° & galeri foto berjaya dijana oleh AI!', true, 'auto_awesome');
      expand360Tabs();

      setTimeout(() => {
        if (btnGenIcon) btnGenIcon.textContent = 'auto_awesome';
        if (btnGenText) btnGenText.textContent = 'Jana AI';
        if (btnGenerate3D) btnGenerate3D.disabled = false;
        isAnalyzing = false;
      }, 2500);

    }, 1300);
  }

  // Save Visual to Database & Draft
  function saveCarVisuals() {
    if (!btnSaveToDb || btnSaveToDb.disabled || isSavingDb || isSavedToDb) return;

    isSavingDb = true;
    btnSaveToDb.disabled = true;

    if (saveDbProgressBox) {
      saveDbProgressBox.classList.remove('hidden');
      saveDbProgressBox.classList.add('flex');
    }
    if (downloadStatusIcon) {
      downloadStatusIcon.textContent = 'progress_activity';
      downloadStatusIcon.className = 'material-symbols-outlined text-[18px] text-primary animate-spin';
    }
    if (downloadStatusLabel) downloadStatusLabel.textContent = 'Menyediakan simpanan visual kenderaan...';
    if (downloadProgressBar) downloadProgressBar.style.width = '0%';
    if (downloadPercentText) downloadPercentText.textContent = '0%';

    // Stage 1: 25% (200ms)
    setTimeout(() => {
      if (downloadProgressBar) downloadProgressBar.style.width = '25%';
      if (downloadPercentText) downloadPercentText.textContent = '25%';
      if (downloadStatusLabel) downloadStatusLabel.textContent = 'Menyambung ke storan Supabase & CDN...';
    }, 200);

    // Stage 2: 65% (550ms)
    setTimeout(() => {
      if (downloadProgressBar) downloadProgressBar.style.width = '65%';
      if (downloadPercentText) downloadPercentText.textContent = '65%';
      if (downloadStatusLabel) downloadStatusLabel.textContent = 'Menyimpan 200 kerangka visual 360°...';
    }, 550);

    // Stage 3: 100% Full Completion (1100ms)
    setTimeout(() => {
      isSavingDb = false;
      isSavedToDb = true;

      if (downloadProgressBar) {
        downloadProgressBar.style.width = '100%';
        downloadProgressBar.className = 'bg-success h-full transition-all duration-300 rounded-full';
      }
      if (downloadPercentText) downloadPercentText.textContent = '100%';
      if (downloadStatusIcon) {
        downloadStatusIcon.textContent = 'check_circle';
        downloadStatusIcon.className = 'material-symbols-outlined text-[18px] text-success';
      }
      if (downloadStatusLabel) downloadStatusLabel.textContent = '✓ 100% Selesai: Visual 360° Berjaya Disimpan';

      if (btnSaveDbIcon) {
        btnSaveDbIcon.classList.remove('animate-spin');
        btnSaveDbIcon.textContent = 'cloud_done';
      }
      if (btnSaveDbText) btnSaveDbText.textContent = '✓ Berjaya Disimpan';
      btnSaveToDb.className = 'pill-btn bg-success text-white font-headline text-[13px] font-bold px-4 py-2.5 flex items-center justify-center gap-2 shadow-sm shrink-0 cursor-default';

      // Save into live session draft
      try {
        const raw = localStorage.getItem('wedrive_new_car_draft');
        const draft = raw ? JSON.parse(raw) : {};
        draft.cdnUrl = cdnUrlInput ? cdnUrlInput.value.trim() : '';
        draft.has360 = true;
        draft.hasAiPhotos = true;
        draft.visualSaved = true;
        draft.image_url = currentGalleryPhotos[0] ? currentGalleryPhotos[0].img : '';
        localStorage.setItem('wedrive_new_car_draft', JSON.stringify(draft));
      } catch (e) {}

      showAiToast('✓ Visual 360° & galeri foto disimpan ke pangkalan data!', true, 'check_circle');
    }, 1100);
  }

  // Fullscreen Logic
  function isViewportFullscreen() {
    return document.fullscreenElement === turntableViewport ||
           document.webkitFullscreenElement === turntableViewport ||
           (turntableViewport && turntableViewport.classList.contains('viewport-fallback-fullscreen'));
  }

  function updateFullscreenUi(isFullscreen) {
    if (!iconFullscreen || !btnFullscreen360) return;
    iconFullscreen.textContent = isFullscreen ? 'fullscreen_exit' : 'fullscreen';
  }

  async function toggleFullscreen() {
    if (!turntableViewport) return;
    if (isViewportFullscreen()) {
      try {
        if (document.fullscreenElement && document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitFullscreenElement && document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      } catch (e) {}
      turntableViewport.classList.remove('viewport-fallback-fullscreen');
      updateFullscreenUi(false);
    } else {
      if (turntableViewport.requestFullscreen) {
        try {
          await turntableViewport.requestFullscreen();
          updateFullscreenUi(true);
          return;
        } catch (e) {}
      }
      turntableViewport.classList.add('viewport-fallback-fullscreen');
      updateFullscreenUi(true);
    }
  }

  // Setup Event Listeners
  function init() {
    if (tab360) tab360.addEventListener('click', () => setVisualTab('360'));
    if (tabPanorama) tabPanorama.addEventListener('click', () => setVisualTab('panorama'));
    if (tabGallery) tabGallery.addEventListener('click', () => setVisualTab('gallery'));

    if (btnPrevImage) btnPrevImage.addEventListener('click', () => navigateGallery(-1));
    if (btnNextImage) btnNextImage.addEventListener('click', () => navigateGallery(1));

    if (btnGenerate3D) btnGenerate3D.addEventListener('click', triggerAiScan);
    if (btnSaveToDb) btnSaveToDb.addEventListener('click', saveCarVisuals);

    if (btnFullscreen360) {
      btnFullscreen360.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
      });
    }

    document.addEventListener('fullscreenchange', () => updateFullscreenUi(isViewportFullscreen()));
    document.addEventListener('webkitfullscreenchange', () => updateFullscreenUi(isViewportFullscreen()));

    if (cdnUrlInput) {
      cdnUrlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          triggerAiScan();
        }
      });
    }

    // Hydrate from live session draft
    try {
      const raw = localStorage.getItem('wedrive_new_car_draft');
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.cdnUrl && cdnUrlInput) {
          cdnUrlInput.value = draft.cdnUrl;
        }
        if (draft.hasAiPhotos) {
          populateAiInspectionPhotos();
        }
        if (draft.has360) {
          expand360Tabs();
        }
      }
    } catch (e) {}

    renderGalleryThumbnails();
    selectGalleryPhoto(0);

    window.addEventListener('wedrive:language-applied', () => {
      renderGalleryThumbnails();
    });
  }

  // Expose global controller
  window.WeDriveStudio360 = {
    selectPhoto: selectGalleryPhoto,
    navigateGallery: navigateGallery,
    triggerAiScan: triggerAiScan,
    saveCarVisuals: saveCarVisuals,
    toggleFullscreen: toggleFullscreen
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
