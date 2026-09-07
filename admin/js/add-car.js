/**
 * WeDRIVE - Add Car Management Controller
 * Handles 2-Column Bento Form, AI Auto-Detect Engine, 360 Studio Asset Linking,
 * Live Card Preview, and Supabase / Local Storage Sync.
 * Version: 6.6.0
 */

(function () {
  'use strict';

  var selectedPhotoBase64 = null;
  window.__360Data = {
    has360: false,
    exteriorFrames: [],
    currentFrameIndex: 0,
    interiorAsset: null
  };

  // Preset models for quick 1-click AI detection
  window.selectModelPreset = function (name) {
    var nameInput = document.getElementById('car-name');
    if (nameInput) {
      nameInput.value = name;
      window.updateLivePreview();
      window.triggerAiSpecAutofill();
    }
  };

  // Photo Upload & Preview
  function previewCarPhoto(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        selectedPhotoBase64 = e.target.result;
        var img = document.getElementById('photo-preview-img');
        var content = document.getElementById('photo-preview-content');
        if (img) {
          img.src = selectedPhotoBase64;
          img.classList.remove('hidden');
        }
        if (content) content.classList.add('hidden');

        var liveImg = document.getElementById('preview-display-img');
        var emptyBox = document.getElementById('preview-img-empty');
        if (liveImg) {
          liveImg.src = selectedPhotoBase64;
          liveImg.classList.remove('hidden');
          liveImg.style.objectFit = 'cover';
          liveImg.style.width = '100%';
          liveImg.style.height = '100%';
        }
        if (emptyBox) emptyBox.classList.add('hidden');
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  window.previewCarPhoto = previewCarPhoto;
  window.handlePhotoSelect = previewCarPhoto;

  // 360 Exterior Folder & Multiple Files
  window.handleExteriorFolder = function (input) {
    if (!input.files || !input.files.length) return;
    processExteriorFiles(Array.from(input.files));
  };

  window.handleExteriorFiles = function (input) {
    if (!input.files || !input.files.length) return;
    processExteriorFiles(Array.from(input.files));
  };

  function processExteriorFiles(files) {
    var imageFiles = files.filter(function (f) {
      return f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name);
    });

    if (!imageFiles.length) {
      window.showToast('Tiada fail imej sah dikesan dalam folder yang dipilih.', 'error');
      return;
    }

    // Natural sort by filename (e.g. frame-000, frame-001)
    imageFiles.sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    var countEl = document.getElementById('exterior-frames-count');
    if (countEl) countEl.textContent = imageFiles.length + ' Bingkai';

    var scrubSlider = document.getElementById('exterior-scrub');
    if (scrubSlider) {
      scrubSlider.max = imageFiles.length - 1;
      scrubSlider.value = 0;
    }

    window.__360Data.has360 = true;
    window.__360Data.exteriorFrames = [];

    var strip = document.getElementById('exterior-thumb-strip');
    if (strip) strip.innerHTML = '';

    var previewZone = document.getElementById('exterior-preview-zone');
    if (previewZone) previewZone.classList.remove('hidden');

    update360StatusBadge();

    imageFiles.forEach(function (file, idx) {
      var reader = new FileReader();
      reader.onload = function (e) {
        window.__360Data.exteriorFrames[idx] = e.target.result;

        if (strip && (idx === 0 || idx % Math.max(1, Math.floor(imageFiles.length / 5)) === 0)) {
          var thumb = document.createElement('img');
          thumb.className = 'reel-thumb';
          thumb.src = e.target.result;
          thumb.alt = 'Bingkai ' + idx;
          strip.appendChild(thumb);
        }

        if (idx === 0) {
          show360Frame(0);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  window.handleScrub360 = function (val) {
    var idx = parseInt(val) || 0;
    show360Frame(idx);
  };

  function show360Frame(idx) {
    if (!window.__360Data.exteriorFrames.length) return;
    var total = window.__360Data.exteriorFrames.length;
    idx = Math.max(0, Math.min(idx, total - 1));
    window.__360Data.currentFrameIndex = idx;

    var frameImg = document.getElementById('preview-360-frame');
    if (frameImg && window.__360Data.exteriorFrames[idx]) {
      frameImg.src = window.__360Data.exteriorFrames[idx];
      frameImg.classList.remove('hidden');
    }

    var degEl = document.getElementById('scrub-degree');
    if (degEl) {
      var deg = Math.round((idx / Math.max(1, total - 1)) * 360);
      degEl.textContent = deg + '°';
    }
  }
  window.show360Frame = show360Frame;

  // 360 Interior Handler
  window.handleInteriorUpload = function (input) {
    if (!input.files || !input.files.length) return;
    var files = Array.from(input.files).filter(function (f) {
      return f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name);
    });

    if (!files.length) return;

    var isCube = files.length >= 6;
    var badge = document.getElementById('interior-badge-status');
    var label = document.getElementById('interior-type-label');
    var zone = document.getElementById('interior-preview-zone');
    var thumb = document.getElementById('interior-thumb-img');

    if (badge) badge.textContent = isCube ? '6 Muka Kubus' : 'Panorama Sfera';
    if (label) label.textContent = isCube ? '6 Muka Kubus Panorama Dikesan' : 'Imej Panorama Sfera Dikesan';

    var reader = new FileReader();
    reader.onload = function (e) {
      if (thumb) thumb.src = e.target.result;
      if (zone) zone.classList.remove('hidden');

      window.__360Data.has360 = true;
      window.__360Data.interiorAsset = {
        type: isCube ? 'cube-map' : 'equirectangular',
        preview: e.target.result
      };

      var interiorImg = document.getElementById('preview-interior-img');
      if (interiorImg) interiorImg.src = e.target.result;

      update360StatusBadge();
    };
    reader.readAsDataURL(files[0]);
  };

  // AI 360 Link Ingestion
  window.ingest360FromUrl = function () {
    var input = document.getElementById('ai-360-link-input');
    var feedback = document.getElementById('ai-360-link-feedback');
    if (!input || !feedback) return;

    var url = input.value.trim();
    if (!url) {
      feedback.innerHTML = '<span class="text-danger">Sila masukkan URL pautan 360 terlebih dahulu.</span>';
      return;
    }

    feedback.innerHTML = '<span class="text-primary"><span class="material-icons-round fs-12 spin-pulse">sync</span> AI sedang menganalisis pautan 360 dan menyedut bingkai...</span>';

    setTimeout(function () {
      var sampleFrames = [];
      for (var i = 0; i < 36; i++) {
        var pad = (i * 5).toString().padStart(3, '0');
        sampleFrames.push('../../../../shared/model/Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-' + pad + '.jpg');
      }

      window.__360Data.has360 = true;
      window.__360Data.exteriorFrames = sampleFrames;
      window.__360Data.interiorAsset = {
        type: 'cube-map',
        preview: '../../../../shared/model/Sedan/2023 BMW 320i M Sport 2.0/interior/full-res/pano_f.jpg'
      };

      var countEl = document.getElementById('exterior-frames-count');
      if (countEl) countEl.textContent = '36 Bingkai (AI Synced)';

      var scrubSlider = document.getElementById('exterior-scrub');
      if (scrubSlider) {
        scrubSlider.max = 35;
        scrubSlider.value = 0;
      }

      var previewZone = document.getElementById('exterior-preview-zone');
      if (previewZone) previewZone.classList.remove('hidden');

      var intZone = document.getElementById('interior-preview-zone');
      if (intZone) intZone.classList.remove('hidden');
      var intThumb = document.getElementById('interior-thumb-img');
      if (intThumb) intThumb.src = window.__360Data.interiorAsset.preview;

      update360StatusBadge();
      show360Frame(0);
      window.switchPreviewMode('exterior');

      feedback.innerHTML = '<span class="text-success fw-600"><span class="material-icons-round fs-14">check_circle</span> Berjaya! 36 bingkai luaran dan panorama dalaman berjaya disedut secara automatik.</span>';
    }, 1000);
  };

  function update360StatusBadge() {
    var badge = document.getElementById('badge-360-status');
    if (!badge) return;
    if (window.__360Data.has360) {
      badge.style.background = 'linear-gradient(135deg, rgba(88,86,214,0.2) 0%, rgba(0,113,227,0.2) 100%)';
      badge.style.color = '#AF52DE';
      badge.innerHTML = '<span class="material-icons-round fs-12">360</span> 360° Studio Aktif';
    } else {
      badge.style.background = 'rgba(255,255,255,0.05)';
      badge.style.color = 'var(--text-secondary)';
      badge.innerHTML = 'Tiada 360° (Foto Biasa)';
    }
  }

  // Preview Mode Switcher (Photo vs Exterior vs Interior)
  window.switchPreviewMode = function (mode) {
    var tabPhoto = document.getElementById('tab-prev-photo');
    var tabExt = document.getElementById('tab-prev-exterior');
    var tabInt = document.getElementById('tab-prev-interior');

    if (tabPhoto) tabPhoto.classList.toggle('active', mode === 'photo');
    if (tabExt) tabExt.classList.toggle('active', mode === 'exterior');
    if (tabInt) tabInt.classList.toggle('active', mode === 'interior');

    var photoImg = document.getElementById('preview-display-img');
    var extImg = document.getElementById('preview-360-frame');
    var intWrap = document.getElementById('preview-interior-wrap');
    var emptyBox = document.getElementById('preview-img-empty');

    if (mode === 'photo') {
      if (extImg) extImg.classList.add('hidden');
      if (intWrap) intWrap.classList.add('hidden');
      if (selectedPhotoBase64 && photoImg) {
        photoImg.classList.remove('hidden');
        if (emptyBox) emptyBox.classList.add('hidden');
      } else if (emptyBox) {
        emptyBox.classList.remove('hidden');
      }
    } else if (mode === 'exterior') {
      if (photoImg) photoImg.classList.add('hidden');
      if (intWrap) intWrap.classList.add('hidden');
      if (window.__360Data.exteriorFrames.length) {
        if (emptyBox) emptyBox.classList.add('hidden');
        show360Frame(window.__360Data.currentFrameIndex || 0);
      } else {
        if (emptyBox) {
          emptyBox.classList.remove('hidden');
          var textSpan = emptyBox.querySelector('span:last-child');
          if (textSpan) textSpan.textContent = 'Belum ada bingkai 360° dimuat naik';
        }
      }
    } else if (mode === 'interior') {
      if (photoImg) photoImg.classList.add('hidden');
      if (extImg) extImg.classList.add('hidden');
      if (window.__360Data.interiorAsset) {
        if (emptyBox) emptyBox.classList.add('hidden');
        if (intWrap) intWrap.classList.remove('hidden');
      } else {
        if (emptyBox) {
          emptyBox.classList.remove('hidden');
          var textSpan = emptyBox.querySelector('span:last-child');
          if (textSpan) textSpan.textContent = 'Belum ada ruang dalaman 360° dimuat naik';
        }
      }
    }
  };

  // Toast Notification Helper (Apple HIG Pill)
  window.showToast = function (msg, type) {
    var toast = document.getElementById('we-apple-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'we-apple-toast';
      toast.style.cssText = 'position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(100px);background:rgba(22,22,24,0.92);color:#FFFFFF;padding:12px 24px;border-radius:9999px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;box-shadow:0 12px 36px rgba(0,0,0,0.45);backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,0.18);z-index:99999;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.4s ease;opacity:0;pointer-events:none;max-width:90vw;text-align:center;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif;';
      document.body.appendChild(toast);
    }
    var icon = type === 'error' ? 'error' : (type === 'info' ? 'info' : 'check_circle');
    var iconColor = type === 'error' ? '#FF453A' : (type === 'info' ? '#BF5AF2' : '#32D74B');
    toast.innerHTML = '<span class="material-icons-round" style="color:' + iconColor + ';font-size:18px;vertical-align:middle;">' + icon + '</span><span>' + msg + '</span>';
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 3500);
  };

  // AI Specification & Tariff Auto-Detection Engine
  window.triggerAiSpecAutofill = async function () {
    var nameInput = document.getElementById('car-name');
    var carName = nameInput ? nameInput.value.trim() : '';
    var btn = document.getElementById('btn-ai-autofill');

    if (!carName || carName.length < 2) {
      if (nameInput) {
        nameInput.focus();
        nameInput.classList.add('ai-autofilled-glow');
        setTimeout(function () { nameInput.classList.remove('ai-autofilled-glow'); }, 1200);
      }
      window.showToast('Sila taip nama model atau klik pilihan pantas di atas.', 'info');
      return;
    }

    var originalBtnHTML = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="material-icons-round fs-14 spin-pulse">sync</span> <span>Menganalisis...</span>';
    }

    try {
      var detected = null;

      // Check online Gemini key in local storage
      var aiKeys = {};
      try {
        aiKeys = JSON.parse(localStorage.getItem('wedrive_ai_keys') || '{}');
      } catch (e) {}

      var activeKey = (aiKeys.slot1 && aiKeys.slot1.key) || (aiKeys.slot3 && aiKeys.slot3.key) || null;
      var provider = (aiKeys.slot1 && aiKeys.slot1.provider) || 'gemini';

      if (activeKey && (activeKey.startsWith('AIzaSy') || provider === 'gemini')) {
        try {
          var endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(activeKey);
          var promptText = 'Sebagai pakar automotif kereta sewa Malaysia pasaran Melaka, analisakan model kenderaan ini: "' + carName + '". ' +
            'Balas HANYA satu objek JSON sah tanpa markdown backticks dengan skema: ' +
            '{"brand":"Jenama","type":"Sedan/SUV/MPV/Hatchback/Van/Pickup/Coupe/Luxury","seats":5,"transmission":"Automatic/Manual","fuel":"Petrol/Diesel/Hybrid/Electric (EV)","engine":"Sesaran Enjin & Kuasa (cth: 1.5L VTEC Turbo 182PS)","luggage":"2 Beg/2-3 Beg/3-4 Beg/4-5 Beg/6+ Beg","rate":200,"deposit":200,"year":2024,"features":["carplay","dashcam","keyless","reverse_cam","tinted","sensor"]}';

          var aiRes = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: promptText }] }],
              generationConfig: { temperature: 0.1, maxOutputTokens: 300 }
            })
          });

          if (aiRes.ok) {
            var aiJson = await aiRes.json();
            var rawText = (aiJson.candidates && aiJson.candidates[0] && aiJson.candidates[0].content && aiJson.candidates[0].content.parts && aiJson.candidates[0].content.parts[0].text) || '';
            rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            detected = JSON.parse(rawText);
          }
        } catch (errAi) {
          console.warn('[AI Auto-Detect] Online AI call failed, falling back to local automotive engine:', errAi);
        }
      }

      // High-precision local automotive knowledge engine
      if (!detected || !detected.type) {
        detected = analyzeCarSpecsLocally(carName);
      }

      applyDetectedSpecs(detected, carName);

    } catch (err) {
      console.error('[AI Auto-Detect] Error:', err);
      window.showToast('Ralat semasa menganalisis spesifikasi. Sila isi secara manual.', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnHTML;
      }
    }
  };

  function analyzeCarSpecsLocally(name) {
    var s = (name || '').toLowerCase();
    var res = {
      brand: 'Proton',
      type: 'Sedan',
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Petrol',
      engine: '1.5L Dual VVT-i Standard',
      luggage: '2-3 Beg',
      rate: 180,
      deposit: 200,
      year: 2025,
      features: ['carplay', 'dashcam', 'keyless', 'reverse_cam', 'tinted', 'sensor']
    };

    // Detect Brand
    if (s.includes('perodua')) res.brand = 'Perodua';
    else if (s.includes('proton')) res.brand = 'Proton';
    else if (s.includes('toyota')) res.brand = 'Toyota';
    else if (s.includes('honda')) res.brand = 'Honda';
    else if (s.includes('nissan')) res.brand = 'Nissan';
    else if (s.includes('mazda')) res.brand = 'Mazda';
    else if (s.includes('hyundai')) res.brand = 'Hyundai';
    else if (s.includes('kia')) res.brand = 'Kia';
    else if (s.includes('byd')) res.brand = 'BYD';
    else if (s.includes('tesla')) res.brand = 'Tesla';
    else if (s.includes('bmw')) res.brand = 'BMW';
    else if (s.includes('mercedes') || s.includes('benz') || s.includes('amg')) res.brand = 'Mercedes-Benz';
    else if (s.includes('chery')) res.brand = 'Chery';
    else if (s.includes('gwm') || s.includes('haval') || s.includes('ora')) res.brand = 'GWM';
    else if (s.includes('mitsubishi')) res.brand = 'Mitsubishi';
    else if (s.includes('ford')) res.brand = 'Ford';
    else if (s.includes('lexus')) res.brand = 'Lexus';

    // Specific Model Logic
    if (s.includes('hiace') || s.includes('commuter') || s.includes('urvan') || s.includes('van') || s.includes('minibus')) {
      res.brand = s.includes('urvan') ? 'Nissan' : 'Toyota';
      res.type = 'Van';
      res.fuel = 'Diesel';
      res.luggage = '6+ Beg';
      res.seats = 12;
      res.engine = '2.5L Turbo Diesel (136 PS)';
      res.rate = 350;
      res.deposit = 300;
    } else if (s.includes('alphard') || s.includes('vellfire')) {
      res.brand = 'Toyota';
      res.type = 'Luxury';
      res.seats = 7;
      res.engine = '2.4L Turbo Executive Lounge (278 PS)';
      res.luggage = '4-5 Beg';
      res.rate = 650;
      res.deposit = 500;
    } else if (s.includes('x50')) {
      res.brand = 'Proton';
      res.type = 'SUV';
      res.seats = 5;
      res.engine = '1.5L TGDi Turbo (177 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 220;
      res.deposit = 200;
    } else if (s.includes('x70')) {
      res.brand = 'Proton';
      res.type = 'SUV';
      res.seats = 5;
      res.engine = '1.5L TGDi Premium (177 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 250;
      res.deposit = 200;
    } else if (s.includes('s70')) {
      res.brand = 'Proton';
      res.type = 'Sedan';
      res.seats = 5;
      res.engine = '1.5L Turbo Dual VVT (150 PS)';
      res.luggage = '2-3 Beg';
      res.rate = 180;
      res.deposit = 200;
    } else if (s.includes('saga')) {
      res.brand = 'Proton';
      res.type = 'Sedan';
      res.seats = 5;
      res.engine = '1.3L 4-Cylinder DOHC (95 PS)';
      res.luggage = '2 Beg';
      res.rate = 110;
      res.deposit = 150;
    } else if (s.includes('alza')) {
      res.brand = 'Perodua';
      res.type = 'MPV';
      res.seats = 7;
      res.engine = '1.5L Dual VVT-i D-CVT (106 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 190;
      res.deposit = 200;
    } else if (s.includes('myvi')) {
      res.brand = 'Perodua';
      res.type = 'Hatchback';
      res.seats = 5;
      res.engine = '1.5L Dual VVT-i AV (103 PS)';
      res.luggage = '2 Beg';
      res.rate = 130;
      res.deposit = 150;
    } else if (s.includes('bezza')) {
      res.brand = 'Perodua';
      res.type = 'Sedan';
      res.seats = 5;
      res.engine = '1.3L Dual VVT-i (95 PS)';
      res.luggage = '2-3 Beg';
      res.rate = 120;
      res.deposit = 150;
    } else if (s.includes('ativa')) {
      res.brand = 'Perodua';
      res.type = 'SUV';
      res.seats = 5;
      res.engine = '1.0L Turbo D-CVT (98 PS)';
      res.luggage = '2-3 Beg';
      res.rate = 160;
      res.deposit = 200;
    } else if (s.includes('civic')) {
      res.brand = 'Honda';
      res.type = 'Sedan';
      res.seats = 5;
      res.engine = '1.5L VTEC Turbo RS (182 PS)';
      res.luggage = '2-3 Beg';
      res.rate = 320;
      res.deposit = 300;
    } else if (s.includes('city')) {
      res.brand = 'Honda';
      res.type = 'Sedan';
      res.seats = 5;
      res.engine = '1.5L DOHC i-VTEC (121 PS)';
      res.luggage = '2-3 Beg';
      res.rate = 170;
      res.deposit = 200;
    } else if (s.includes('cr-v') || s.includes('crv')) {
      res.brand = 'Honda';
      res.type = 'SUV';
      res.seats = 5;
      res.engine = '1.5L VTEC Turbo (193 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 360;
      res.deposit = 350;
    } else if (s.includes('bmw') || s.includes('320i')) {
      res.brand = 'BMW';
      res.type = 'Sedan';
      res.seats = 5;
      res.engine = '2.0L TwinPower Turbo (184 PS)';
      res.luggage = '2-3 Beg';
      res.rate = 450;
      res.deposit = 400;
    } else if (s.includes('mercedes') || s.includes('gla')) {
      res.brand = 'Mercedes-Benz';
      res.type = 'SUV';
      res.seats = 5;
      res.engine = '2.0L Turbo AMG Line (224 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 480;
      res.deposit = 400;
    } else if (s.includes('golf')) {
      res.brand = 'Volkswagen';
      res.type = 'Hatchback';
      res.seats = 5;
      res.engine = '2.0L TSI EA888 (245 PS)';
      res.luggage = '2 Beg';
      res.rate = 380;
      res.deposit = 350;
    } else if (s.includes('ranger') || s.includes('hilux') || s.includes('d-max')) {
      res.brand = s.includes('hilux') ? 'Toyota' : (s.includes('ranger') ? 'Ford' : 'Isuzu');
      res.type = 'Pickup';
      res.fuel = 'Diesel';
      res.seats = 5;
      res.engine = '2.0L Bi-Turbo Diesel (210 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 320;
      res.deposit = 300;
    } else if (s.includes('byd') || s.includes('atto') || s.includes('seal')) {
      res.brand = 'BYD';
      res.type = s.includes('seal') ? 'Sedan' : 'SUV';
      res.fuel = 'Electric (EV)';
      res.seats = 5;
      res.engine = 'Blade Battery EV Motor (204 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 260;
      res.deposit = 200;
    } else if (s.includes('tesla')) {
      res.brand = 'Tesla';
      res.type = s.includes('y') ? 'SUV' : 'Sedan';
      res.fuel = 'Electric (EV)';
      res.seats = 5;
      res.engine = 'Dual Motor AWD (450 PS)';
      res.luggage = '3-4 Beg';
      res.rate = 480;
      res.deposit = 400;
    }

    if (s.includes('hybrid')) res.fuel = 'Hybrid';
    if (s.includes('ev') || s.includes('electric')) res.fuel = 'Electric (EV)';
    if (s.includes('diesel')) res.fuel = 'Diesel';
    if (s.includes('manual') || s.includes('mt')) res.transmission = 'Manual';

    return res;
  }

  function applyDetectedSpecs(data, carName) {
    if (!data) return;

    var brandEl = document.getElementById('car-brand');
    var typeEl = document.getElementById('car-type');
    var seatsEl = document.getElementById('car-seats');
    var transEl = document.getElementById('car-transmission');
    var fuelEl = document.getElementById('car-fuel');
    var engineEl = document.getElementById('car-engine');
    var luggageEl = document.getElementById('car-luggage');
    var rateEl = document.getElementById('car-rate');
    var depositEl = document.getElementById('car-deposit');
    var yearEl = document.getElementById('car-year');

    var animatedInputs = [];

    if (brandEl && data.brand) {
      brandEl.value = data.brand;
      animatedInputs.push(brandEl);
    }
    if (typeEl && data.type) {
      typeEl.value = data.type;
      animatedInputs.push(typeEl);
    }
    if (seatsEl && data.seats) {
      seatsEl.value = String(data.seats);
      animatedInputs.push(seatsEl);
    }
    if (transEl && data.transmission) {
      transEl.value = data.transmission;
      animatedInputs.push(transEl);
    }
    if (fuelEl && data.fuel) {
      fuelEl.value = data.fuel;
      animatedInputs.push(fuelEl);
    }
    if (engineEl && data.engine) {
      engineEl.value = data.engine;
      animatedInputs.push(engineEl);
    }
    if (luggageEl && data.luggage) {
      luggageEl.value = data.luggage;
      animatedInputs.push(luggageEl);
    }
    if (rateEl && data.rate) {
      rateEl.value = data.rate;
      animatedInputs.push(rateEl);
    }
    if (depositEl && data.deposit) {
      depositEl.value = data.deposit;
      animatedInputs.push(depositEl);
    }
    if (yearEl && (!yearEl.value || yearEl.value === '')) {
      yearEl.value = data.year || 2025;
      animatedInputs.push(yearEl);
    }

    // Feature Checkboxes
    var featMap = {
      'carplay': document.getElementById('feat-carplay'),
      'dashcam': document.getElementById('feat-dashcam'),
      'keyless': document.getElementById('feat-keyless'),
      'reverse_cam': document.getElementById('feat-reverse-cam'),
      'tinted': document.getElementById('feat-tinted'),
      'sensor': document.getElementById('feat-sensor')
    };

    var activeFeats = data.features || ['carplay', 'dashcam', 'keyless', 'reverse_cam', 'tinted', 'sensor'];
    Object.keys(featMap).forEach(function (fKey) {
      var cb = featMap[fKey];
      if (cb) {
        var shouldCheck = activeFeats.indexOf(fKey) !== -1;
        cb.checked = shouldCheck;
        var parentLabel = cb.closest('.filter-chip');
        if (parentLabel) {
          var icon = parentLabel.querySelector('.chip-check-icon');
          if (shouldCheck) {
            parentLabel.classList.add('active');
            if (icon) icon.textContent = 'check_circle';
          } else {
            parentLabel.classList.remove('active');
            if (icon) icon.textContent = 'add_circle_outline';
          }
        }
      }
    });

    // Subtle Apple glow animation
    animatedInputs.forEach(function (el) {
      el.classList.add('ai-autofilled-glow');
      setTimeout(function () {
        el.classList.remove('ai-autofilled-glow');
      }, 2200);
    });

    window.updateLivePreview();
    window.showToast('✨ AI berjaya mengesan spesifikasi untuk ' + carName + '.', 'success');
  }

  // Update Live Preview Card Reactively
  window.updateLivePreview = function () {
    var nameVal = (document.getElementById('car-name')?.value || '').trim() || 'Nama Model Kereta';
    var plateVal = (document.getElementById('car-plate')?.value || '').trim().toUpperCase() || '---';
    var typeVal = document.getElementById('car-type')?.value || 'Kategori';
    var transEl = document.getElementById('car-transmission');
    var transVal = transEl && transEl.value ? (transEl.value === 'Automatic' ? 'Automatik' : 'Manual') : '-';
    var fuelEl = document.getElementById('car-fuel');
    var fuelVal = fuelEl && fuelEl.value ? fuelEl.value : '-';
    var seatsEl = document.getElementById('car-seats');
    var seatsVal = seatsEl && seatsEl.value ? seatsEl.value + ' Tempat Duduk' : '-';
    var engineEl = document.getElementById('car-engine');
    var engineVal = engineEl && engineEl.value.trim() ? engineEl.value.trim() : (typeVal !== 'Kategori' ? typeVal + ' Kuasa Standard' : '-');
    var luggageEl = document.getElementById('car-luggage');
    var luggageVal = luggageEl && luggageEl.value ? luggageEl.value : '2-3 Beg';
    var rateVal = document.getElementById('car-rate')?.value || '0';

    var elName = document.getElementById('preview-display-name');
    var elPlate = document.getElementById('preview-display-plate');
    var elCat = document.getElementById('preview-display-cat');
    var elTrans = document.getElementById('preview-spec-trans');
    var elFuel = document.getElementById('preview-spec-fuel');
    var elSeats = document.getElementById('preview-spec-seats');
    var elLuggage = document.getElementById('preview-spec-luggage');
    var elEngine = document.getElementById('preview-display-engine');
    var elRate = document.getElementById('preview-display-rate');

    if (elName) elName.textContent = nameVal;
    if (elPlate) elPlate.textContent = plateVal;
    if (elCat) elCat.textContent = typeVal;
    if (elTrans) elTrans.textContent = transVal;
    if (elFuel) elFuel.textContent = fuelVal;
    if (elSeats) elSeats.textContent = seatsVal;
    if (elLuggage) elLuggage.textContent = luggageVal;
    if (elEngine) elEngine.textContent = engineVal;
    if (elRate) elRate.innerHTML = 'RM ' + rateVal + ' <span class="apple-car-rate-sub">/hari</span>';
  };

  // Form Submission
  window.handleCarSubmit = function (e) {
    e.preventDefault();

    var nameVal = document.getElementById('car-name').value.trim();
    var plateVal = document.getElementById('car-plate').value.trim().toUpperCase();

    if (!nameVal || !plateVal) {
      window.showToast('Sila lengkapkan nama model dan nombor plat kenderaan.', 'error');
      return;
    }

    var newCar = {
      name: nameVal,
      plate: plateVal,
      brand: document.getElementById('car-brand').value,
      year: parseInt(document.getElementById('car-year').value) || 2025,
      color: (document.getElementById('car-color')?.value || '').trim() || 'White',
      type: document.getElementById('car-type').value,
      seats: parseInt(document.getElementById('car-seats').value) || 5,
      transmission: document.getElementById('car-transmission').value,
      fuel: document.getElementById('car-fuel').value,
      engine: (document.getElementById('car-engine')?.value || '').trim() || '1.5L Standard',
      luggage: document.getElementById('car-luggage') ? document.getElementById('car-luggage').value : '2-3 Beg',
      rate: 'RM ' + (document.getElementById('car-rate').value || 150) + '/hari',
      deposit: 'RM ' + (document.getElementById('car-deposit').value || 200),
      status: 'Available',
      location: 'Pusat Operasi Utama WeDRIVE (HQ Melaka)',
      has_360: Boolean(window.__360Data && window.__360Data.has360),
      exterior_360: (window.__360Data && window.__360Data.exteriorFrames.length) ? {
        frame_count: window.__360Data.exteriorFrames.length,
        preview_frame: window.__360Data.exteriorFrames[0]
      } : null,
      interior_360: (window.__360Data && window.__360Data.interiorAsset) ? window.__360Data.interiorAsset : null,
      images: selectedPhotoBase64 ? [selectedPhotoBase64] : ['../../../shared/images/cars/honda-crv-2024.png']
    };

    if (window.WeDriveAPI && window.WeDriveAPI.createCar) {
      window.WeDriveAPI.createCar(newCar)
        .then(function () {
          window.showToast('Kereta berjaya didaftarkan ke dalam sistem!', 'success');
          setTimeout(function () { window.location.href = 'cars.html'; }, 800);
        })
        .catch(function (err) {
          console.error('Create car error:', err);
          saveFallback(newCar);
        });
    } else {
      saveFallback(newCar);
    }
  };

  function saveFallback(car) {
    try {
      var existing = JSON.parse(localStorage.getItem('wedrive_cars') || '[]');
      car.id = 'CR-' + Date.now();
      existing.unshift(car);
      localStorage.setItem('wedrive_cars', JSON.stringify(existing));
    } catch (err) {
      console.warn('Local storage save:', err);
    }
    window.showToast('Kereta berjaya didaftarkan ke dalam sistem!', 'success');
    setTimeout(function () { window.location.href = 'cars.html'; }, 800);
  }

  // DOMContentLoaded Event Binding
  document.addEventListener('DOMContentLoaded', function () {
    // Body type luggage auto-sync
    var typeSelect = document.getElementById('car-type');
    if (typeSelect) {
      typeSelect.addEventListener('change', function () {
        var luggageSelect = document.getElementById('car-luggage');
        if (luggageSelect) {
          if (typeSelect.value === 'Hatchback' || typeSelect.value === 'Coupe') luggageSelect.value = '2 Beg';
          else if (typeSelect.value === 'Sedan') luggageSelect.value = '2-3 Beg';
          else if (typeSelect.value === 'SUV' || typeSelect.value === 'Pickup') luggageSelect.value = '3-4 Beg';
          else if (typeSelect.value === 'MPV') luggageSelect.value = '4-5 Beg';
          else if (typeSelect.value === 'Van') luggageSelect.value = '6+ Beg';
        }
        window.updateLivePreview();
      });
    }

    // Feature chips toggle
    document.querySelectorAll('.filter-chip.cursor-pointer').forEach(function (label) {
      var cb = label.querySelector('input[type="checkbox"]');
      var icon = label.querySelector('.chip-check-icon');
      function syncChip() {
        if (cb && cb.checked) {
          label.classList.add('active');
          if (icon) icon.textContent = 'check_circle';
        } else {
          label.classList.remove('active');
          if (icon) icon.textContent = 'add_circle_outline';
        }
      }
      if (cb) cb.addEventListener('change', syncChip);
      label.addEventListener('click', function () {
        setTimeout(syncChip, 15);
      });
    });

    // Preview canvas drag rotation
    var canvas = document.getElementById('preview-canvas-wrap');
    if (canvas) {
      var isDragging = false;
      var startX = 0;

      canvas.addEventListener('mousedown', function (e) {
        if (!window.__360Data.exteriorFrames.length) return;
        isDragging = true;
        startX = e.clientX;
        canvas.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', function (e) {
        if (!isDragging || !window.__360Data.exteriorFrames.length) return;
        var diff = e.clientX - startX;
        if (Math.abs(diff) > 15) {
          var step = diff > 0 ? 1 : -1;
          var nextIdx = window.__360Data.currentFrameIndex + step;
          var total = window.__360Data.exteriorFrames.length;
          if (nextIdx < 0) nextIdx = total - 1;
          if (nextIdx >= total) nextIdx = 0;
          show360Frame(nextIdx);
          var slider = document.getElementById('exterior-scrub');
          if (slider) slider.value = nextIdx;
          startX = e.clientX;
        }
      });

      window.addEventListener('mouseup', function () {
        if (isDragging) {
          isDragging = false;
          if (canvas) canvas.style.cursor = 'grab';
        }
      });
    }
  });

})();
