(function () {
  'use strict';

  var FRAME_COUNT = 200;
  var HERO_MODEL_FOLDER = '../../../shared/model/Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/';
  var heroFrame = document.getElementById('hiwHeroFrame');
  var heroSection = document.querySelector('[data-hiw-hero]');
  var progressBar = document.querySelector('[data-hiw-progress]');
  var parallaxNodes = document.querySelectorAll('[data-hiw-parallax]');
  var viewerRoot = document.querySelector('[data-vehicle-viewer]');
  var dragHint = document.querySelector('[data-hiw-drag-hint]');
  var viewerApi = null;
  var heroAutoplayActive = true;
  var currentHeroFrame = 100;
  var lastHeroTick = 0;
  var HERO_FRAME_INTERVAL = 45; // ~22fps gentle continuous luxury turntable

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
    var nodes = document.querySelectorAll('.hiw-reveal, .hiw-step, .hiw-faq-item, .hiw-tip-card, .hiw-proof-card');
    if (!nodes.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

    nodes.forEach(function (node, index) {
      node.style.setProperty('--hiw-delay', Math.min(index * 30, 200) + 'ms');
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

    document.querySelectorAll('[data-hiw-cursor-target], .hiw-btn, .hiw-model-btn, .hiw-view-btn, .hiw-faq-trigger').forEach(function (node) {
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

  /* =========================================================================
     1. HERO TOP CAR: AUTOMATIC CONTINUOUS TURNTABLE ROTATION
     Starts at frame 100 (beauty shot) and rotates continuously like a showroom.
     Pauses when scrolled out of view to preserve CPU and battery.
     ========================================================================= */
  function tickHeroAutoplay(timestamp) {
    if (!heroAutoplayActive) return;
    if (!lastHeroTick) lastHeroTick = timestamp;
    var delta = timestamp - lastHeroTick;

    if (delta >= HERO_FRAME_INTERVAL) {
      currentHeroFrame = (currentHeroFrame + 1) % FRAME_COUNT;
      if (heroFrame) {
        heroFrame.src = frameSrc(currentHeroFrame);
      }
      lastHeroTick = timestamp;
    }

    window.requestAnimationFrame(tickHeroAutoplay);
  }

  function initHeroAutoTurntable() {
    if (!heroFrame || !heroSection) return;
    heroFrame.src = frameSrc(100);

    // Subtle parallax lift & scale on scroll
    function updateHeroScroll() {
      var heroHeight = heroSection.offsetHeight || 1;
      var scrollPos = window.scrollY || 0;
      var progress = Math.min(scrollPos / heroHeight, 1);
      var scale = 1 - progress * 0.08;
      var lift = progress * -24;
      heroFrame.style.transform = 'translateY(' + lift + 'px) scale(' + scale.toFixed(3) + ')';
    }

    window.addEventListener('scroll', updateHeroScroll, { passive: true });

    // Preload next batch of hero frames for seamless rotation
    for (var i = 0; i < 20; i++) {
      var img = new Image();
      img.src = frameSrc(100 + i);
    }

    var heroObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          if (!heroAutoplayActive) {
            heroAutoplayActive = true;
            lastHeroTick = 0;
            window.requestAnimationFrame(tickHeroAutoplay);
          }
        } else {
          heroAutoplayActive = false;
        }
      });
    }, { threshold: 0.1 });

    heroObserver.observe(heroSection);
    window.requestAnimationFrame(tickHeroAutoplay);
  }

  /* =========================================================================
     2. BOTTOM INTERACTIVE SHOWROOM: MANUAL DRAG CONTROL ONLY
     The user controls this viewer directly via drag/touch, with zero lag
     due to our sparse keyframe preloader and nearest-neighbor fallback.
     ========================================================================= */
  function hideDragHint() {
    if (dragHint) {
      dragHint.classList.add('is-hidden');
    }
  }

  function initInteractiveShowroom() {
    if (!viewerRoot) return;

    // Direct user drag control only
    viewerRoot.addEventListener('pointerdown', hideDragHint, { passive: true });
    viewerRoot.addEventListener('touchstart', hideDragHint, { passive: true });

    if (window.WedriveVehicleViewer) {
      viewerApi = window.WedriveVehicleViewer.get(viewerRoot);
      if (!viewerApi && window.WedriveVehicleViewer.init) {
        viewerApi = window.WedriveVehicleViewer.init(viewerRoot, { defaultFrame: 100 });
      }
    }
  }

  /* =========================================================================
     3. RENTAL FAQ ACCORDION (EXPANDABLE BENTO ITEMS)
     ========================================================================= */
  function initFaqAccordion() {
    var triggers = document.querySelectorAll('.hiw-faq-trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var item = trigger.closest('.hiw-faq-item');
        if (!item) return;
        var isOpen = item.classList.contains('is-open');

        // Close other items
        document.querySelectorAll('.hiw-faq-item.is-open').forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var otherBtn = other.querySelector('.hiw-faq-trigger');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          }
        });

        item.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    initReveal();
    initProgressAndParallax();
    initCursor();
    initHeroAutoTurntable();
    initInteractiveShowroom();
    initFaqAccordion();
  });
})();
