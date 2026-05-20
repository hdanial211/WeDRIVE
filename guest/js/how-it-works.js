(function () {
  'use strict';

  var FRAME_COUNT = 200;
  var HERO_MODEL_FOLDER = '../../../shared/model/Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/';
  var heroFrame = document.getElementById('hiwHeroFrame');
  var heroSection = document.querySelector('[data-hiw-hero]');
  var progressBar = document.querySelector('[data-hiw-progress]');
  var parallaxNodes = document.querySelectorAll('[data-hiw-parallax]');
  var viewerRoot = document.querySelector('[data-vehicle-viewer]');
  var viewerApi = null;
  var heroTicking = false;

  function frameSrc(frame) {
    var safeFrame = ((frame % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    return HERO_MODEL_FOLDER + 'frame-' + String(safeFrame).padStart(3, '0') + '.jpg';
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

  function initProgressAndParallax() {
    function update() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      var docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

      if (progressBar) {
        progressBar.style.height = Math.min(100, Math.max(0, scrollTop / docHeight * 100)) + '%';
      }

      parallaxNodes.forEach(function (node) {
        var speed = parseFloat(node.getAttribute('data-hiw-parallax')) || 0.2;
        node.style.transform = 'translate3d(0,' + (scrollTop * speed * -0.18).toFixed(2) + 'px,0)';
      });
    }

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function initHeroAndViewerSync() {
    if (!heroFrame || !heroSection) return;
    if (!viewerApi && window.WedriveVehicleViewer) {
      viewerApi = window.WedriveVehicleViewer.get(viewerRoot) || window.WedriveVehicleViewer.get('[data-vehicle-viewer]');
    }

    function update() {
      var heroHeight = heroSection.offsetHeight || 1;
      var scrollPos = window.scrollY || 0;
      var progress = Math.min(scrollPos / heroHeight, 1);
      var frame = Math.floor(progress * (FRAME_COUNT - 1));
      var scale = 1 - progress * 0.12;
      var lift = progress * -34;

      heroFrame.src = frameSrc(frame);
      heroFrame.style.transform = 'translateY(' + lift + 'px) scale(' + scale.toFixed(3) + ')';

      if (viewerApi && viewerApi.setExteriorFrame) {
        viewerApi.setExteriorFrame(frame, false);
      }
    }

    function requestUpdate() {
      if (heroTicking) return;
      heroTicking = true;
      window.requestAnimationFrame(function () {
        update();
        heroTicking = false;
      });
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
  }

  function initViewerSharedModule() {
    if (!window.WedriveVehicleViewer) return;
    viewerApi = window.WedriveVehicleViewer.get(viewerRoot) || window.WedriveVehicleViewer.get('[data-vehicle-viewer]');
    if (!viewerApi && window.WedriveVehicleViewer.init && viewerRoot) {
      viewerApi = window.WedriveVehicleViewer.init(viewerRoot);
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initReveal();
    initProgressAndParallax();
    initCursor();
    initRipple();
    initViewerSharedModule();
    initHeroAndViewerSync();
  });
})();
