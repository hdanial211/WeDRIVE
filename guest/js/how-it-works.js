(function () {
  'use strict';

  var FRAME_COUNT = 200;
  var basePath = '../../../shared/model/';
  var lastExteriorFrame = 0;
  var interiorFaces = ['f', 'r', 'b', 'l', 'u', 'd'];
  var interiorCopy = {
    en: {
      exterior: 'Exterior 360 view',
      realInterior: 'Real interior preview',
      referenceInterior: 'Reference cabin preview while the exact interior is being added'
    },
    ms: {
      exterior: 'Paparan luaran 360',
      realInterior: 'Preview dalaman sebenar',
      referenceInterior: 'Preview kabin rujukan sementara interior sebenar ditambah'
    }
  };
  var models = {
    bmw: {
      label: 'BMW 320i M Sport',
      folder: basePath + 'Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/',
      interiorFolder: basePath + 'Sedan/2023 BMW 320i M Sport 2.0/interior/full-res/',
      hasRealInterior: true,
      alt: 'BMW 320i M Sport exterior'
    },
    gla: {
      label: 'Mercedes-Benz GLA250',
      folder: basePath + 'SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/',
      hasRealInterior: false,
      alt: 'Mercedes-Benz GLA250 exterior'
    },
    alphard: {
      label: 'Toyota Alphard G S C Package',
      folder: basePath + 'MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/',
      interiorFolder: basePath + 'MPV/2019 Toyota Alphard G S C Package 2.5/interior/full-res/',
      hasRealInterior: true,
      alt: 'Toyota Alphard exterior'
    },
    axia: {
      label: 'Perodua AXIA AV',
      folder: basePath + 'Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/',
      hasRealInterior: false,
      alt: 'Perodua AXIA AV exterior'
    }
  };

  function currentLang() {
    return localStorage.getItem('wedrive-lang') || document.documentElement.lang || 'en';
  }

  function t(key) {
    var lang = currentLang();
    return (interiorCopy[lang] && interiorCopy[lang][key]) || interiorCopy.en[key] || '';
  }

  function frameSrc(model, frame) {
    var safeFrame = ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    return model.folder + 'frame-' + String(safeFrame).padStart(3, '0') + '.jpg';
  }

  function setFrame(img, model, frame) {
    if (!img || !model) return;
    img.src = frameSrc(model, frame);
    img.alt = model.alt;
  }

  function interiorSrc(model, faceIndex) {
    var safeIndex = ((faceIndex % interiorFaces.length) + interiorFaces.length) % interiorFaces.length;
    return model.interiorFolder + 'pano_' + interiorFaces[safeIndex] + '.jpg';
  }

  function placeholderInteriorSrc(model, faceIndex) {
    var safeIndex = ((faceIndex % interiorFaces.length) + interiorFaces.length) % interiorFaces.length;
    var faceLabelMap = {
      f: 'Front cabin',
      r: 'Rear cabin',
      b: 'Back seat',
      l: 'Left side',
      u: 'Roofline',
      d: 'Floor view'
    };
    var faceKey = interiorFaces[safeIndex];
    var faceLabel = faceLabelMap[faceKey] || 'Reference cabin';
    var safeModelLabel = (model.label || 'Reference cabin').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var safeFaceLabel = faceLabel.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="',
      safeModelLabel,
      ' reference interior">',
      '<defs>',
      '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="#f7fbff"/>',
      '<stop offset="52%" stop-color="#edf4ff"/>',
      '<stop offset="100%" stop-color="#dfe8f9"/>',
      '</linearGradient>',
      '<radialGradient id="glow" cx="50%" cy="45%" r="60%">',
      '<stop offset="0%" stop-color="#ffffff" stop-opacity=".92"/>',
      '<stop offset="100%" stop-color="#bcd1ff" stop-opacity="0"/>',
      '</radialGradient>',
      '<linearGradient id="dash" x1="0%" y1="0%" x2="0%" y2="100%">',
      '<stop offset="0%" stop-color="#101828"/>',
      '<stop offset="100%" stop-color="#1d2939"/>',
      '</linearGradient>',
      '<linearGradient id="seat" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="#111827"/>',
      '<stop offset="100%" stop-color="#334155"/>',
      '</linearGradient>',
      '</defs>',
      '<rect width="1600" height="900" fill="url(#bg)"/>',
      '<ellipse cx="800" cy="520" rx="570" ry="270" fill="rgba(15,23,42,0.12)"/>',
      '<ellipse cx="820" cy="430" rx="420" ry="240" fill="url(#glow)"/>',
      '<path d="M314 606c60-84 140-136 222-136h528c83 0 164 52 224 136l-48 36c-50-67-118-104-176-104H540c-58 0-126 37-176 104z" fill="url(#dash)"/>',
      '<path d="M392 590c31-97 118-171 222-171h372c104 0 191 74 222 171l-44 18c-23-71-86-126-158-126H594c-72 0-135 55-158 126z" fill="#e8eef9" opacity=".58"/>',
      '<path d="M255 612c-28-88-6-182 61-243 42-38 103-58 168-58h632c65 0 126 20 168 58 67 61 89 155 61 243l-56-18c20-63 6-130-38-170-28-26-69-40-115-40H464c-46 0-87 14-115 40-44 40-58 107-38 170z" fill="rgba(15,23,42,0.10)"/>',
      '<g transform="translate(0,8)">',
      '<rect x="430" y="560" width="146" height="188" rx="58" fill="url(#seat)"/>',
      '<rect x="1024" y="560" width="146" height="188" rx="58" fill="url(#seat)"/>',
      '<rect x="690" y="532" width="220" height="224" rx="52" fill="#1f2937"/>',
      '<rect x="716" y="556" width="168" height="68" rx="18" fill="#dbeafe" opacity=".34"/>',
      '<rect x="754" y="649" width="92" height="98" rx="24" fill="#0f172a" opacity=".72"/>',
      '<circle cx="800" cy="620" r="54" fill="none" stroke="#93c5fd" stroke-width="10" opacity=".5"/>',
      '<circle cx="800" cy="620" r="16" fill="#f8fafc" opacity=".75"/>',
      '<rect x="552" y="380" width="495" height="116" rx="58" fill="rgba(15,23,42,0.14)"/>',
      '<rect x="590" y="406" width="420" height="64" rx="32" fill="rgba(255,255,255,0.22)"/>',
      '</g>',
      '<rect x="76" y="70" width="314" height="72" rx="24" fill="#ffffff" opacity=".92"/>',
      '<text x="108" y="116" fill="#2563eb" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" letter-spacing=".12em">REFERENCE INTERIOR</text>',
      '<rect x="104" y="726" width="320" height="112" rx="28" fill="rgba(255,255,255,0.7)"/>',
      '<text x="136" y="774" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">',
      safeModelLabel,
      '</text>',
      '<text x="136" y="816" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">Reference cabin preview</text>',
      '<rect x="1206" y="70" width="314" height="72" rx="24" fill="#ffffff" opacity=".92"/>',
      '<text x="1240" y="116" fill="#2563eb" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">',
      safeFaceLabel,
      '</text>',
      '</svg>'
    ].join('');
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function setInteriorFrame(img, model, faceIndex) {
    if (!img || !model) return;
    img.src = model.hasRealInterior ? interiorSrc(model, faceIndex) : placeholderInteriorSrc(model, faceIndex);
    img.alt = model.hasRealInterior ? model.label + ' interior preview' : model.label + ' reference interior placeholder';
  }

  function preloadModel(model, step) {
    if (!model) return;
    for (var i = 0; i < FRAME_COUNT; i += step || 24) {
      var preloader = new Image();
      preloader.src = frameSrc(model, i);
    }
  }

  function preloadInterior(model) {
    if (!model || !model.interiorFolder || !model.hasRealInterior) return;
    interiorFaces.forEach(function (face) {
      var preloader = new Image();
      preloader.src = model.interiorFolder + 'pano_' + face + '.jpg';
    });
  }

  function initLoader() {
    var loader = document.querySelector('[data-hiw-loader]');
    if (!loader) return;
    window.setTimeout(function () {
      loader.classList.add('is-hidden');
    }, 550);
  }

  function initReveal() {
    var nodes = document.querySelectorAll('.hiw-reveal, .hiw-step');
    if (!nodes.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.16 });

    nodes.forEach(function (node, index) {
      node.style.setProperty('--hiw-delay', Math.min(index * 34, 220) + 'ms');
      observer.observe(node);
    });
  }

  function initProgressAndParallax() {
    var progress = document.querySelector('[data-hiw-progress]');
    var hero = document.querySelector('[data-hiw-hero]');
    var heroImg = document.getElementById('hiwHeroFrame');
    var parallaxNodes = document.querySelectorAll('[data-hiw-parallax]');
    var ticking = false;

    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      var docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progress) progress.style.height = Math.min(100, Math.max(0, scrollTop / docHeight * 100)) + '%';

      if (hero && heroImg) {
        var heroRect = hero.getBoundingClientRect();
        var heroSpan = Math.max(1, hero.offsetHeight - window.innerHeight * 0.18);
        var heroProgress = Math.min(1, Math.max(0, -heroRect.top / heroSpan));
        var frame = Math.floor(heroProgress * (FRAME_COUNT - 1));
        var scale = 1 - heroProgress * 0.12;
        var lift = heroProgress * -34;
        lastExteriorFrame = frame;
        setFrame(heroImg, models.bmw, frame);
        heroImg.style.transform = 'translateY(' + lift + 'px) scale(' + scale.toFixed(3) + ')';
      }

      parallaxNodes.forEach(function (node) {
        var speed = parseFloat(node.getAttribute('data-hiw-parallax')) || 0.2;
        node.style.transform = 'translate3d(0,' + (scrollTop * speed * -0.18).toFixed(2) + 'px,0)';
      });

      ticking = false;
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  function initCursor() {
    var cursor = document.querySelector('[data-hiw-cursor]');
    if (!cursor || !window.matchMedia('(pointer: fine)').matches) return;
    var x = 0;
    var y = 0;
    var targetX = 0;
    var targetY = 0;

    document.body.classList.add('hiw-custom-cursor-active');

    document.addEventListener('mousemove', function (event) {
      targetX = event.clientX;
      targetY = event.clientY;
    }, { passive: true });

    document.querySelectorAll('[data-hiw-cursor-target], .hiw-btn, .hiw-model-btn').forEach(function (node) {
      node.addEventListener('mouseenter', function () { cursor.classList.add('is-hovering'); });
      node.addEventListener('mouseleave', function () { cursor.classList.remove('is-hovering'); });
    });

    function animate() {
      x += (targetX - x) * 0.22;
      y += (targetY - y) * 0.22;
      cursor.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0) translate(-50%, -50%)';
      window.requestAnimationFrame(animate);
    }

    animate();
  }

  function initRipple() {
    document.querySelectorAll('[data-hiw-ripple]').forEach(function (button) {
      button.addEventListener('click', function (event) {
        var rect = button.getBoundingClientRect();
        var size = Math.max(rect.width, rect.height);
        var ripple = document.createElement('span');
        ripple.className = 'hiw-ripple';
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        button.appendChild(ripple);
        window.setTimeout(function () { ripple.remove(); }, 700);
      });
    });
  }

  function initInteractiveViewer() {
    var shell = document.querySelector('[data-hiw-interactive]');
    var img = document.getElementById('hiwInteractiveFrame');
    var label = document.querySelector('[data-hiw-model-label]');
    var buttons = document.querySelectorAll('[data-hiw-model]');
    var viewButtons = document.querySelectorAll('[data-hiw-view]');
    var status = document.querySelector('[data-hiw-view-status]');
    if (!shell || !img) return;

    var currentModelKey = 'bmw';
    var currentFrame = 0;
    var viewMode = 'exterior';
    var interiorFaceIndex = 0;
    var dragging = false;
    var lastX = 0;
    var animating = false;
    var syncTicking = false;

    preloadModel(models.bmw, 18);
    preloadInterior(models.bmw);
    preloadInterior(models.gla);
    preloadInterior(models.alphard);
    preloadInterior(models.axia);

    function normalizeFrame(frame) {
      return ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    }

    function updateLabel(model) {
      if (label && model) label.textContent = model.label;
    }

    function updateStatus(model) {
      if (!status || !model) return;
      if (viewMode === 'exterior') {
        status.textContent = t('exterior');
        return;
      }
      status.textContent = model.hasRealInterior ? t('realInterior') : t('referenceInterior');
    }

    function setActiveModelButton() {
      buttons.forEach(function (button) {
        button.classList.toggle('is-active', button.getAttribute('data-hiw-model') === currentModelKey);
      });
    }

    function setActiveViewButton() {
      viewButtons.forEach(function (button) {
        button.classList.toggle('is-active', button.getAttribute('data-hiw-view') === viewMode);
      });
    }

    function renderCurrentView() {
      var model = models[currentModelKey];
      if (!model) return;
      updateLabel(model);
      updateStatus(model);
      shell.classList.toggle('is-interior', viewMode === 'interior');
      shell.classList.toggle('is-reference-interior', viewMode === 'interior' && !model.hasRealInterior);

      if (viewMode === 'interior') {
        setInteriorFrame(img, model, interiorFaceIndex);
        return;
      }

      currentFrame = normalizeFrame(currentFrame);
      lastExteriorFrame = currentFrame;
      setFrame(img, model, currentFrame);
    }

    function syncExteriorFrameFromHero() {
      if (syncTicking || viewMode !== 'exterior' || dragging || animating) return;
      syncTicking = true;
      window.requestAnimationFrame(function () {
        currentFrame = normalizeFrame(lastExteriorFrame);
        setFrame(img, models[currentModelKey], currentFrame);
        syncTicking = false;
      });
    }

    currentFrame = normalizeFrame(lastExteriorFrame);
    renderCurrentView();
    setActiveModelButton();
    setActiveViewButton();

    function pointerDown(event) {
      if (animating) return;
      dragging = true;
      lastX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
      if (viewMode === 'exterior') currentFrame = normalizeFrame(lastExteriorFrame);
      shell.classList.add('is-dragging');
      event.preventDefault();
    }

    function pointerMove(event) {
      if (!dragging || animating) return;
      var clientX = event.clientX || (event.touches && event.touches[0].clientX) || lastX;
      var delta = clientX - lastX;
      if (Math.abs(delta) < 2) return;

      if (viewMode === 'interior') {
        if (Math.abs(delta) < 36) return;
        interiorFaceIndex += delta > 0 ? 1 : -1;
        setInteriorFrame(img, models[currentModelKey], interiorFaceIndex);
        lastX = clientX;
        return;
      }

      currentFrame = normalizeFrame(currentFrame + Math.round(delta / 5));
      lastExteriorFrame = currentFrame;
      setFrame(img, models[currentModelKey], currentFrame);
      lastX = clientX;
    }

    function pointerUp() {
      dragging = false;
      shell.classList.remove('is-dragging');
    }

    shell.addEventListener('mousedown', pointerDown);
    shell.addEventListener('touchstart', pointerDown, { passive: false });
    window.addEventListener('mousemove', pointerMove, { passive: true });
    window.addEventListener('touchmove', pointerMove, { passive: true });
    window.addEventListener('mouseup', pointerUp);
    window.addEventListener('touchend', pointerUp);
    window.addEventListener('scroll', syncExteriorFrameFromHero, { passive: true });

    function switchModel(nextKey) {
      if (!models[nextKey] || nextKey === currentModelKey || animating) return;
      animating = true;
      preloadModel(models[nextKey], 20);

      var targetFrame = normalizeFrame(viewMode === 'exterior' ? lastExteriorFrame : currentFrame);
      var start = null;
      var oldModel = models[currentModelKey];
      var startFrame = targetFrame;
      var duration = 720;

      if (viewMode === 'interior') {
        img.classList.add('is-switching');
        window.setTimeout(function () {
          currentModelKey = nextKey;
          currentFrame = targetFrame;
          renderCurrentView();
          setActiveModelButton();
          img.classList.remove('is-switching');
          animating = false;
        }, 180);
        return;
      }

      function spin(time) {
        if (!start) start = time;
        var progress = Math.min(1, (time - start) / duration);
        var ease = 1 - Math.pow(1 - progress, 3);
        var frame = startFrame + Math.floor(ease * FRAME_COUNT * 2);
        setFrame(img, oldModel, frame);
        shell.style.setProperty('--hiw-spin-progress', progress);

        if (progress < 1) {
          window.requestAnimationFrame(spin);
          return;
        }

        img.classList.add('is-switching');
        window.setTimeout(function () {
          currentModelKey = nextKey;
          currentFrame = targetFrame;
          lastExteriorFrame = targetFrame;
          setFrame(img, models[currentModelKey], currentFrame);
          setActiveModelButton();
          updateLabel(models[currentModelKey]);
          updateStatus(models[currentModelKey]);
          img.classList.remove('is-switching');
          shell.style.removeProperty('--hiw-spin-progress');
          animating = false;
        }, 170);
      }

      window.requestAnimationFrame(spin);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        switchModel(button.getAttribute('data-hiw-model'));
      });
    });

    viewButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var nextView = button.getAttribute('data-hiw-view');
        if (!nextView || nextView === viewMode || animating) return;
        viewMode = nextView;
        if (viewMode === 'exterior') currentFrame = normalizeFrame(lastExteriorFrame);
        setActiveViewButton();
        renderCurrentView();
      });
    });

    document.addEventListener('wedrive:language-applied', function () {
      updateStatus(models[currentModelKey]);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initReveal();
    initProgressAndParallax();
    initCursor();
    initRipple();
    initInteractiveViewer();
    preloadModel(models.gla, 30);
    preloadModel(models.alphard, 34);
    preloadModel(models.axia, 36);
  });
})();
