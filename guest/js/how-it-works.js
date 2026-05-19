(function () {
  'use strict';

  var FRAME_COUNT = 200;
  var basePath = '../../../shared/model/';
  var models = {
    bmw: {
      label: 'BMW 320i M Sport',
      folder: basePath + 'Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/',
      alt: 'BMW 320i M Sport exterior'
    },
    gla: {
      label: 'Mercedes-Benz GLA250',
      folder: basePath + 'SUV/2023 Mercedes-Benz GLA250 AMG Line 2.0/exterior/full-res/',
      alt: 'Mercedes-Benz GLA250 exterior'
    },
    alphard: {
      label: 'Toyota Alphard G S C Package',
      folder: basePath + 'MPV/2019 Toyota Alphard G S C Package 2.5/exterior/full-res/',
      alt: 'Toyota Alphard exterior'
    },
    axia: {
      label: 'Perodua AXIA AV',
      folder: basePath + 'Hatchback/2025 Perodua AXIA AV 1.0/exterior/full-res/',
      alt: 'Perodua AXIA AV exterior'
    }
  };

  function frameSrc(model, frame) {
    var safeFrame = ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    return model.folder + 'frame-' + String(safeFrame).padStart(3, '0') + '.jpg';
  }

  function setFrame(img, model, frame) {
    if (!img || !model) return;
    img.src = frameSrc(model, frame);
    img.alt = model.alt;
  }

  function preloadModel(model, step) {
    if (!model) return;
    for (var i = 0; i < FRAME_COUNT; i += step || 24) {
      var preloader = new Image();
      preloader.src = frameSrc(model, i);
    }
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
    if (!shell || !img) return;

    var currentModelKey = 'bmw';
    var currentFrame = 0;
    var dragging = false;
    var lastX = 0;
    var animating = false;

    preloadModel(models.bmw, 18);
    setFrame(img, models.bmw, currentFrame);

    function updateLabel(model) {
      if (label && model) label.textContent = model.label;
    }

    function pointerDown(event) {
      if (animating) return;
      dragging = true;
      lastX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
      shell.classList.add('is-dragging');
      event.preventDefault();
    }

    function pointerMove(event) {
      if (!dragging || animating) return;
      var clientX = event.clientX || (event.touches && event.touches[0].clientX) || lastX;
      var delta = clientX - lastX;
      if (Math.abs(delta) < 2) return;
      currentFrame = (currentFrame + Math.round(delta / 5)) % FRAME_COUNT;
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

    function switchModel(nextKey) {
      if (!models[nextKey] || nextKey === currentModelKey || animating) return;
      animating = true;
      preloadModel(models[nextKey], 20);

      var start = null;
      var oldModel = models[currentModelKey];
      var startFrame = currentFrame;
      var duration = 720;

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
          currentFrame = 0;
          setFrame(img, models[currentModelKey], currentFrame);
          updateLabel(models[currentModelKey]);
          img.classList.remove('is-switching');
          shell.style.removeProperty('--hiw-spin-progress');
          animating = false;
        }, 170);
      }

      window.requestAnimationFrame(spin);
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        buttons.forEach(function (item) { item.classList.remove('is-active'); });
        button.classList.add('is-active');
        switchModel(button.getAttribute('data-hiw-model'));
      });
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
