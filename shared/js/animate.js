/**
 * WeDRIVE - Shared Motion Module
 * shared/js/animate.js
 *
 * Requires: shared/js/anime.min.js (loaded before this file)
 *
 * Core usage:
 *  1. Add class="reveal-onload" for first-viewport entrance motion.
 *  2. Add class="reveal-on-scroll" for in-view entrance motion.
 *  3. Optional attributes:
 *       data-delay="160"         - delay in ms
 *       data-duration="900"      - duration in ms
 *       data-dir="left|right|up|down|fade"
 *       data-distance="36"       - travel distance in px
 *       data-scale-start="0.985" - subtle scale-up to 1
 *       data-blur="true"         - soft blur-to-sharp entrance
 *       data-easing="easeOutExpo"
 *       data-parallax="0.12"     - scroll-driven translate amount
 *       data-parallax-scale="0.08"
 *       data-scroll-progress      - writes --motion-progress while scrolling
 *       data-magnetic             - luxury pointer-follow hover
 *       data-cursor               - optional pointer state: hover|magnetic|media|drag|link
 *       data-cursor-label         - optional text inside the pointer ring
 *       data-ripple               - click ripple for buttons / links
 *       data-spotlight            - mouse-follow light field
 *       data-kinetic="words|chars" - typography reveal that re-runs after language changes
 *       data-scramble              - subtle text scramble on hover / focus
 *
 * Premium utility hooks:
 *  - Add class="motion-sheen" to trigger a light sweep on reveal / hover.
 *  - Add class="premium-hover" for subtle luxury-card hover lift.
 *  - Add class="kinetic-text" with data-scroll-progress for Apple-like text light-up.
 *  - Add data-cursor-glow on <body> to enable shared premium cursor micro-interactions.
 *  - Add data-scrolly-section with canvas[data-motion-canvas] for sticky scrollytelling.
 *  - Add data-vehicle-3d for a lightweight interactive CSS 3D car preview.
 *  - Add <canvas data-image-sequence data-frame-src="frames/car-{index}.jpg">.
 */

(function () {
  'use strict';

  var prefersReducedMotion = !!(
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function toNumber(value, fallback) {
    var parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function parseTimeValue(rawValue) {
    if (!rawValue) return null;
    var value = String(rawValue).trim();
    if (!value) return null;

    if (value.endsWith('ms')) {
      return toNumber(value, null);
    }

    if (value.endsWith('s')) {
      return toNumber(value, null) * 1000;
    }

    return toNumber(value, null);
  }

  function getDelay(el, fallback) {
    var datasetDelay = parseTimeValue(el.getAttribute('data-delay'));
    if (datasetDelay !== null) return datasetDelay;

    var inlineDelay = parseTimeValue(el.style.animationDelay);
    if (inlineDelay !== null) return inlineDelay;

    return fallback || 0;
  }

  function getDuration(el, fallback) {
    var duration = parseTimeValue(el.getAttribute('data-duration'));
    return duration !== null ? duration : fallback;
  }

  function wantsBlur(el) {
    return el.dataset.blur === 'true' || el.classList.contains('reveal-blur');
  }

  function getTranslate(el) {
    var dir = (el.dataset.dir || 'up').toLowerCase();
    var distance = toNumber(el.dataset.distance, 30);

    switch (dir) {
      case 'left':
        return { translateX: [-distance, 0], translateY: [0, 0] };
      case 'right':
        return { translateX: [distance, 0], translateY: [0, 0] };
      case 'down':
        return { translateX: [0, 0], translateY: [-distance, 0] };
      case 'fade':
        return { translateX: [0, 0], translateY: [0, 0] };
      default:
        return { translateX: [0, 0], translateY: [distance, 0] };
    }
  }

  function getScaleRange(el) {
    var start = toNumber(el.dataset.scaleStart, 1);
    return Math.abs(start - 1) > 0.0001 ? [start, 1] : null;
  }

  function finishInstant(el) {
    el.dataset.motionDone = '1';
    el.style.opacity = '1';
    el.style.transform = '';
    el.style.filter = 'none';
    el.style.willChange = 'auto';
  }

  function prepareElement(el) {
    if (el.dataset.motionPrepared === '1') return;

    el.dataset.motionPrepared = '1';
    el.style.opacity = '0';
    el.style.willChange = 'transform, opacity, filter';

    if (wantsBlur(el)) {
      el.style.filter = 'blur(10px)';
    }
  }

  function animateReveal(el, fallbackDelay) {
    if (el.dataset.motionDone === '1') return;

    if (!window.anime || prefersReducedMotion) {
      finishInstant(el);
      return;
    }

    el.dataset.motionDone = '1';

    var translate = getTranslate(el);
    var scaleRange = getScaleRange(el);
    var config = {
      targets: el,
      opacity: [0, 1],
      translateX: translate.translateX,
      translateY: translate.translateY,
      easing: el.dataset.easing || 'easeOutExpo',
      duration: getDuration(el, 860),
      delay: getDelay(el, fallbackDelay || 0),
      complete: function () {
        el.style.willChange = 'auto';
        el.style.transform = '';
        if (wantsBlur(el)) {
          el.style.filter = 'none';
        }
      }
    };

    if (scaleRange) {
      config.scale = scaleRange;
    }

    if (wantsBlur(el)) {
      config.filter = ['blur(10px)', 'blur(0px)'];
    }

    window.anime(config);
  }

  function runPageOpenAnimation() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal-onload'));
    if (!els.length) return;

    els.forEach(prepareElement);
    els.forEach(function (el, index) {
      animateReveal(el, 60 + (index * 90));
    });
  }

  function initScrollReveal() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.reveal-on-scroll'));
    if (!els.length) return;

    if (!window.anime || prefersReducedMotion || !('IntersectionObserver' in window)) {
      els.forEach(finishInstant);
      return;
    }

    els.forEach(prepareElement);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateReveal(entry.target, 0);
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.14,
      rootMargin: '0px 0px -6% 0px'
    });

    els.forEach(function (el) {
      observer.observe(el);
    });

    // Fallback for static captures / long pages:
    window.setTimeout(function () {
      els.forEach(function (el, index) {
        if (el.dataset.motionDone === '1') return;
        animateReveal(el, index * 70);
        observer.unobserve(el);
      });
    }, 1600);
  }

  function initSheenObserver() {
    var els = Array.prototype.slice.call(document.querySelectorAll('.motion-sheen'));
    if (!els.length || !('IntersectionObserver' in window)) return;

    if (prefersReducedMotion) {
      els.forEach(function (el) { el.classList.add('is-inview'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.28
    });

    els.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initParallax() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length || prefersReducedMotion) return;

    var ticking = false;

    function update() {
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();

        if (rect.bottom < -80 || rect.top > viewportHeight + 80) {
          return;
        }

        var speed = toNumber(el.dataset.parallax, 0.12);
        var scaleExtra = toNumber(el.dataset.parallaxScale, 0);
        var opacityFalloff = toNumber(el.dataset.parallaxOpacity, 0);
        var center = rect.top + (rect.height / 2);
        var progress = clamp(((viewportHeight / 2) - center) / viewportHeight, -1, 1);
        var y = progress * viewportHeight * speed;
        var scale = 1 + (Math.abs(progress) * scaleExtra);

        el.style.transform = 'translate3d(0,' + y.toFixed(2) + 'px,0) scale(' + scale.toFixed(3) + ')';

        if (opacityFalloff > 0) {
          el.style.opacity = clamp(1 - (Math.abs(progress) * opacityFalloff), 0.72, 1).toFixed(3);
        }
      });

      ticking = false;
    }

    function requestTick() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    requestTick();
  }

  function initScrollProgress() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-progress], .kinetic-text'));
    if (!els.length) return;

    var ticking = false;

    function update() {
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var startOffset = toNumber(el.dataset.progressStart, 0.88);
        var endOffset = toNumber(el.dataset.progressEnd, 0.28);
        var start = viewportHeight * startOffset;
        var end = viewportHeight * endOffset;
        var raw = (start - rect.top) / (start - end);
        var progress = clamp(raw, 0, 1);

        el.style.setProperty('--motion-progress', progress.toFixed(4));
        el.style.setProperty('--motion-progress-inverse', (1 - progress).toFixed(4));
      });

      ticking = false;
    }

    function requestTick() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    requestTick();
  }

  function initMagneticHover() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-magnetic], .magnetic-hover'));
    if (!els.length || prefersReducedMotion) return;

    els.forEach(function (el) {
      var strength = toNumber(el.dataset.magnetic, 0.18);

      el.addEventListener('pointermove', function (event) {
        var rect = el.getBoundingClientRect();
        var x = (event.clientX - rect.left) - (rect.width / 2);
        var y = (event.clientY - rect.top) - (rect.height / 2);

        el.style.setProperty('--magnetic-x', (x * strength).toFixed(2) + 'px');
        el.style.setProperty('--magnetic-y', (y * strength).toFixed(2) + 'px');
        el.classList.add('is-magnetic');
      });

      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--magnetic-x', '0px');
        el.style.setProperty('--magnetic-y', '0px');
        el.classList.remove('is-magnetic');
      });
    });
  }

  function closestElement(target, selector) {
    if (!target || target === document || target === window) return null;
    if (!target.closest) return null;
    return target.closest(selector);
  }

  function initPremiumCursor() {
    var body = document.body;
    if (!body || (!body.hasAttribute('data-cursor-glow') && !body.hasAttribute('data-cursor-system'))) return;
    if (prefersReducedMotion) return;
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

    var dot = document.createElement('span');
    var ring = document.createElement('span');
    var label = document.createElement('span');
    dot.className = 'wedrive-cursor-dot';
    ring.className = 'wedrive-cursor-ring';
    label.className = 'wedrive-cursor-label';
    label.textContent = '';

    body.appendChild(dot);
    body.appendChild(ring);
    body.appendChild(label);
    body.classList.add('motion-cursor-ready');

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var ringX = mouseX;
    var ringY = mouseY;
    var currentState = 'default';
    var stateClasses = [
      'motion-cursor-hover',
      'motion-cursor-magnetic',
      'motion-cursor-media',
      'motion-cursor-drag',
      'motion-cursor-link',
      'motion-cursor-click',
      'motion-cursor-has-label'
    ];

    function removeStateClasses() {
      stateClasses.forEach(function (className) {
        body.classList.remove(className);
      });
    }

    function setState(state, labelText) {
      var safeState = state || 'default';
      var safeLabel = labelText || '';
      if (safeState === currentState && label.textContent === safeLabel) return;

      removeStateClasses();
      currentState = safeState;
      label.textContent = safeLabel;

      if (safeState !== 'default') {
        body.classList.add('motion-cursor-' + safeState);
      }

      if (safeLabel) {
        body.classList.add('motion-cursor-has-label');
      }
    }

    function inferState(el) {
      if (!el) return { state: 'default', label: '' };

      var explicitState = el.getAttribute('data-cursor');
      var explicitLabel = el.getAttribute('data-cursor-label') || '';
      if (explicitState) {
        return { state: explicitState, label: explicitLabel };
      }

      if (el.hasAttribute('data-vehicle-stage')) {
        return { state: 'drag', label: explicitLabel };
      }

      if (el.hasAttribute('data-magnetic') || el.classList.contains('magnetic-hover')) {
        return { state: 'magnetic', label: explicitLabel };
      }

      if (el.tagName && el.tagName.toLowerCase() === 'a') {
        return { state: 'link', label: explicitLabel };
      }

      return { state: 'hover', label: explicitLabel };
    }

    function interactiveFromTarget(target) {
      return closestElement(
        target,
        '[data-cursor], [data-vehicle-stage], [data-magnetic], .magnetic-hover, a[href], button, [role="button"], input, select, textarea, label'
      );
    }

    document.addEventListener('pointermove', function (event) {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
      body.classList.add('motion-cursor-visible');
    }, { passive: true });

    document.addEventListener('pointerover', function (event) {
      var target = interactiveFromTarget(event.target);
      if (!target) return;
      if (event.relatedTarget && target.contains(event.relatedTarget)) return;

      var next = inferState(target);
      setState(next.state, next.label);
    }, true);

    document.addEventListener('pointerout', function (event) {
      var target = interactiveFromTarget(event.target);
      if (!target) return;
      if (event.relatedTarget && target.contains(event.relatedTarget)) return;
      setState('default', '');
    }, true);

    document.addEventListener('pointerdown', function () {
      body.classList.add('motion-cursor-click');
    });

    document.addEventListener('pointerup', function () {
      body.classList.remove('motion-cursor-click');
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      label.style.left = ringX + 'px';
      label.style.top = ringY + 'px';
      window.requestAnimationFrame(animateCursor);
    }

    animateCursor();
  }

  function initMicroInteractions() {
    document.addEventListener('pointermove', function (event) {
      var target = closestElement(event.target, '[data-spotlight], .motion-spotlight');
      if (!target) return;

      var rect = target.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      var x = ((event.clientX - rect.left) / rect.width * 100).toFixed(2) + '%';
      var y = ((event.clientY - rect.top) / rect.height * 100).toFixed(2) + '%';
      target.style.setProperty('--spotlight-x', x);
      target.style.setProperty('--spotlight-y', y);
    }, { passive: true });

    document.addEventListener('click', function (event) {
      var target = closestElement(event.target, '[data-ripple]');
      if (!target || prefersReducedMotion) return;

      var rect = target.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      var ripple = document.createElement('span');
      ripple.className = 'motion-ripple';
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (event.clientX - rect.left - (size / 2)) + 'px';
      ripple.style.top = (event.clientY - rect.top - (size / 2)) + 'px';

      target.classList.add('motion-ripple-host');
      target.appendChild(ripple);
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  }

  function splitKineticElement(el) {
    if (!el) return;

    var mode = (el.getAttribute('data-kinetic') || '').toLowerCase();
    if (!mode && el.classList.contains('kinetic-chars')) mode = 'chars';
    if (!mode) mode = 'words';
    if (mode !== 'chars') mode = 'words';

    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;

    el.setAttribute('aria-label', text);
    el.classList.remove('kinetic-visible');
    el.classList.add('kinetic-ready');
    el.classList.toggle('kinetic-chars-ready', mode === 'chars');
    el.classList.toggle('kinetic-words-ready', mode === 'words');
    el.innerHTML = '';

    var fragment = document.createDocumentFragment();
    var count = 0;

    if (mode === 'chars') {
      text.split('').forEach(function (char) {
        if (char === ' ') {
          fragment.appendChild(document.createTextNode(' '));
          return;
        }

        var charSpan = document.createElement('span');
        charSpan.className = 'motion-char';
        charSpan.style.setProperty('--i', count);
        charSpan.textContent = char;
        fragment.appendChild(charSpan);
        count += 1;
      });
    } else {
      text.split(/(\s+)/).forEach(function (word) {
        if (!word.trim()) {
          fragment.appendChild(document.createTextNode(word));
          return;
        }

        var wrap = document.createElement('span');
        var inner = document.createElement('span');
        wrap.className = 'motion-word-wrap';
        inner.className = 'motion-word';
        inner.style.setProperty('--i', count);
        inner.textContent = word;
        wrap.appendChild(inner);
        fragment.appendChild(wrap);
        count += 1;
      });
    }

    el.style.setProperty('--kinetic-count', count);
    el.appendChild(fragment);
  }

  function initKineticTypography() {
    var selector = '[data-kinetic], .kinetic-words, .kinetic-chars';
    var els = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('kinetic-visible');
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    function prepareAll() {
      els = Array.prototype.slice.call(document.querySelectorAll(selector));
      els.forEach(function (el) {
        splitKineticElement(el);
        observer.observe(el);

        var rect = el.getBoundingClientRect();
        if (rect.top < (window.innerHeight || document.documentElement.clientHeight) * 0.82 && rect.bottom > 0) {
          window.requestAnimationFrame(function () {
            el.classList.add('kinetic-visible');
          });
        }
      });
    }

    prepareAll();
    document.addEventListener('wedrive:language-applied', prepareAll);
  }

  function initTextScramble() {
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-scramble]'));
    if (!els.length || prefersReducedMotion) return;

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    function run(el) {
      var finalText = (el.getAttribute('data-scramble-text') || el.textContent || '').replace(/\s+/g, ' ').trim();
      if (!finalText) return;

      var frames = 22;
      var frame = 0;

      if (el.dataset.scrambleTimer) {
        window.clearInterval(Number(el.dataset.scrambleTimer));
      }

      var timer = window.setInterval(function () {
        frame += 1;
        var progress = frame / frames;
        var locked = Math.floor(progress * finalText.length);

        el.textContent = finalText.split('').map(function (char, index) {
          if (char === ' ') return ' ';
          if (index < locked) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('');

        if (frame >= frames) {
          el.textContent = finalText;
          window.clearInterval(timer);
          delete el.dataset.scrambleTimer;
        }
      }, 24);

      el.dataset.scrambleTimer = String(timer);
    }

    els.forEach(function (el) {
      el.addEventListener('pointerenter', function () { run(el); });
      el.addEventListener('focus', function () { run(el); });
      el.addEventListener('click', function () { run(el); });
    });

    document.addEventListener('wedrive:language-applied', function () {
      els.forEach(function (el) {
        el.setAttribute('data-scramble-text', (el.textContent || '').replace(/\s+/g, ' ').trim());
      });
    });
  }

  function buildFrameUrl(pattern, index, pad) {
    var padded = String(index).padStart(pad, '0');
    return pattern
      .replace('{index}', String(index))
      .replace('{padded}', padded);
  }

  function initImageSequences() {
    var canvases = Array.prototype.slice.call(document.querySelectorAll('canvas[data-image-sequence]'));
    if (!canvases.length) return;

    canvases.forEach(function (canvas) {
      var pattern = canvas.dataset.frameSrc;
      if (!pattern) return;

      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      var start = parseInt(canvas.dataset.frameStart || '1', 10);
      var end = parseInt(canvas.dataset.frameEnd || canvas.dataset.frames || '1', 10);
      var pad = parseInt(canvas.dataset.framePad || '4', 10);
      var contain = canvas.dataset.frameFit === 'contain';
      var frames = [];
      var loaded = 0;
      var currentFrame = -1;

      function resizeCanvas() {
        var rect = canvas.getBoundingClientRect();
        var ratio = window.devicePixelRatio || 1;
        var width = Math.max(1, Math.round(rect.width * ratio));
        var height = Math.max(1, Math.round(rect.height * ratio));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
      }

      function drawImageCover(img) {
        resizeCanvas();

        var canvasRatio = canvas.width / canvas.height;
        var imageRatio = img.naturalWidth / img.naturalHeight;
        var width = canvas.width;
        var height = canvas.height;
        var x = 0;
        var y = 0;

        if (contain) {
          if (imageRatio > canvasRatio) {
            width = canvas.width;
            height = width / imageRatio;
            y = (canvas.height - height) / 2;
          } else {
            height = canvas.height;
            width = height * imageRatio;
            x = (canvas.width - width) / 2;
          }
        } else if (imageRatio > canvasRatio) {
          height = canvas.height;
          width = height * imageRatio;
          x = (canvas.width - width) / 2;
        } else {
          width = canvas.width;
          height = width / imageRatio;
          y = (canvas.height - height) / 2;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, width, height);
      }

      function updateFrame() {
        var rect = canvas.getBoundingClientRect();
        var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        var raw = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        var progress = clamp(raw, 0, 1);
        var frameIndex = Math.round((frames.length - 1) * progress);
        var frame = frames[frameIndex];

        canvas.style.setProperty('--sequence-progress', progress.toFixed(4));

        if (!frame || !frame.complete || frameIndex === currentFrame) return;
        currentFrame = frameIndex;
        drawImageCover(frame);
      }

      for (var index = start; index <= end; index += 1) {
        var image = new Image();
        image.decoding = 'async';
        image.src = buildFrameUrl(pattern, index, pad);
        image.onload = function () {
          loaded += 1;
          canvas.dataset.sequenceLoaded = String(loaded);
          updateFrame();
        };
        frames.push(image);
      }

      window.addEventListener('scroll', function () {
        window.requestAnimationFrame(updateFrame);
      }, { passive: true });
      window.addEventListener('resize', function () {
        currentFrame = -1;
        updateFrame();
      });
      updateFrame();
    });
  }

  function resizeCanvas(canvas) {
    var rect = canvas.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    var width = Math.max(1, Math.round(rect.width * ratio));
    var height = Math.max(1, Math.round(rect.height * ratio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function drawScrollyCanvas(canvas, progress) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas(canvas);

    var width = canvas.width;
    var height = canvas.height;
    var accentRgb = canvas.dataset.motionAccentRgb || '96,165,250';
    var warmRgb = canvas.dataset.motionWarmRgb || '250,204,21';
    var centerX = width / 2;
    var centerY = height / 2;
    var maxRadius = Math.max(width, height);

    ctx.clearRect(0, 0, width, height);

    var background = ctx.createRadialGradient(
      centerX + (progress - 0.5) * width * 0.22,
      centerY + height * 0.08,
      0,
      centerX,
      centerY,
      maxRadius * 0.78
    );
    background.addColorStop(0, 'rgba(' + accentRgb + ',0.32)');
    background.addColorStop(0.42, 'rgba(15,23,42,0.92)');
    background.addColorStop(1, 'rgba(2,6,23,1)');
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    var scanY = height * (0.16 + progress * 0.72);
    var scan = ctx.createLinearGradient(0, scanY - 90, 0, scanY + 90);
    scan.addColorStop(0, 'rgba(' + accentRgb + ',0)');
    scan.addColorStop(0.5, 'rgba(' + accentRgb + ',0.12)');
    scan.addColorStop(1, 'rgba(' + accentRgb + ',0)');
    ctx.fillStyle = scan;
    ctx.fillRect(0, scanY - 90, width, 180);

    ctx.save();
    ctx.globalAlpha = 0.7;
    for (var ring = 0; ring < 5; ring += 1) {
      var ringProgress = (progress + ring * 0.18) % 1;
      var radius = maxRadius * (0.08 + ringProgress * 0.44);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(' + accentRgb + ',' + (0.14 * (1 - ringProgress)).toFixed(3) + ')';
      ctx.lineWidth = Math.max(1, width * 0.0012);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.translate(centerX, centerY);
    for (var i = 0; i < 96; i += 1) {
      var angle = (i / 96) * Math.PI * 2 + progress * Math.PI * 1.6;
      var wave = Math.sin(angle * 3 + progress * Math.PI * 4) * height * 0.025;
      var radiusX = width * (0.18 + progress * 0.16) + wave;
      var radiusY = height * (0.15 + progress * 0.10) + wave * 0.35;
      var x = Math.cos(angle) * radiusX;
      var y = Math.sin(angle) * radiusY;
      var alpha = 0.10 + Math.abs(Math.sin(angle + progress * Math.PI)) * 0.34;
      var size = Math.max(1.4, width * 0.0028 * alpha * 2.8);

      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + accentRgb + ',' + alpha.toFixed(3) + ')';
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = 'rgba(' + warmRgb + ',0.42)';
    ctx.lineWidth = Math.max(2, width * 0.002);
    ctx.lineCap = 'round';
    ctx.setLineDash([width * 0.025, width * 0.018]);
    ctx.lineDashOffset = -progress * width * 0.18;
    ctx.beginPath();
    ctx.moveTo(width * 0.16, height * 0.68);
    ctx.bezierCurveTo(width * 0.34, height * 0.42, width * 0.56, height * 0.88, width * 0.82, height * 0.36);
    ctx.stroke();
    ctx.restore();

    var carX = width * (0.18 + progress * 0.58);
    var carY = height * (0.78 - Math.sin(progress * Math.PI) * 0.08);
    var carScale = Math.max(0.72, Math.min(width, height) / 900);

    ctx.save();
    ctx.translate(carX, carY);
    ctx.rotate((-0.16 + progress * 0.34));
    ctx.scale(carScale, carScale);
    ctx.shadowBlur = 34;
    ctx.shadowColor = 'rgba(' + warmRgb + ',0.28)';
    ctx.strokeStyle = 'rgba(255,255,255,0.90)';
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-82, 10);
    ctx.bezierCurveTo(-54, -26, -12, -38, 34, -30);
    ctx.bezierCurveTo(62, -26, 82, -4, 94, 16);
    ctx.lineTo(76, 26);
    ctx.lineTo(-76, 26);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(' + accentRgb + ',0.72)';
    ctx.beginPath();
    ctx.arc(-50, 28, 10, 0, Math.PI * 2);
    ctx.arc(58, 28, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function initScrollytelling() {
    var sections = Array.prototype.slice.call(document.querySelectorAll('[data-scrolly-section]'));
    if (!sections.length) return;

    var ticking = false;

    function updateSection(section) {
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      var total = Math.max(1, section.offsetHeight - viewportHeight);
      var rect = section.getBoundingClientRect();
      var progress = clamp(-rect.top / total, 0, 1);
      var phases = Array.prototype.slice.call(section.querySelectorAll('[data-scrolly-phase]'));
      var dots = Array.prototype.slice.call(section.querySelectorAll('[data-scrolly-dot]'));
      var canvas = section.querySelector('canvas[data-motion-canvas]');
      var activeIndex = phases.length ? Math.min(Math.floor(progress * phases.length), phases.length - 1) : 0;

      section.style.setProperty('--scrolly-progress', progress.toFixed(4));
      section.style.setProperty('--scrolly-progress-inverse', (1 - progress).toFixed(4));

      phases.forEach(function (phase, index) {
        phase.classList.toggle('is-active', index === activeIndex);
      });

      dots.forEach(function (dot, index) {
        dot.classList.toggle('is-active', index === activeIndex);
      });

      if (canvas) {
        drawScrollyCanvas(canvas, progress);
      }
    }

    function updateAll() {
      sections.forEach(updateSection);
      ticking = false;
    }

    function requestTick() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateAll);
    }

    window.addEventListener('scroll', requestTick, { passive: true });
    window.addEventListener('resize', requestTick);
    requestTick();
  }

  function initVehicle3D() {
    var viewers = Array.prototype.slice.call(document.querySelectorAll('[data-vehicle-3d]'));
    if (!viewers.length) return;

    viewers.forEach(function (viewer) {
      var scene = viewer.querySelector('[data-vehicle-scene]');
      var stage = viewer.querySelector('[data-vehicle-stage]');
      if (!scene || !stage) return;

      var rotation = toNumber(viewer.dataset.initialRotation, -24);
      var targetRotation = rotation;
      var autoSpin = viewer.dataset.auto !== 'false';
      var isDragging = false;
      var startX = 0;
      var startRotation = 0;
      var lastX = 0;
      var velocity = 0;
      var rafId = null;

      function setAuto(enabled) {
        autoSpin = enabled;
        viewer.classList.toggle('is-auto-spin', enabled);

        var autoButton = viewer.querySelector('[data-vehicle-auto]');
        if (autoButton) {
          autoButton.classList.toggle('is-active', enabled);
          autoButton.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        }
      }

      function updateAngleButtons(activeAngle) {
        Array.prototype.slice.call(viewer.querySelectorAll('[data-vehicle-angle]')).forEach(function (button) {
          var isActive = button.getAttribute('data-vehicle-angle') === activeAngle;
          button.classList.toggle('is-active', isActive);
          button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      }

      function applyColor(swatch) {
        if (!swatch) return;

        Array.prototype.slice.call(viewer.querySelectorAll('[data-vehicle-color]')).forEach(function (item) {
          item.classList.toggle('is-active', item === swatch);
        });

        if (swatch.dataset.accent) viewer.style.setProperty('--vehicle-accent', swatch.dataset.accent);
        if (swatch.dataset.accentRgb) viewer.style.setProperty('--vehicle-accent-rgb', swatch.dataset.accentRgb);
        if (swatch.dataset.body) viewer.style.setProperty('--vehicle-body', swatch.dataset.body);
        if (swatch.dataset.bodyDark) viewer.style.setProperty('--vehicle-body-dark', swatch.dataset.bodyDark);
        if (swatch.dataset.glass) viewer.style.setProperty('--vehicle-glass', swatch.dataset.glass);
      }

      function render() {
        if (autoSpin && !prefersReducedMotion) {
          targetRotation -= 0.24;
        }

        rotation += (targetRotation - rotation) * 0.09;
        scene.style.transform = 'rotateX(-8deg) rotateY(' + rotation.toFixed(2) + 'deg)';
        rafId = window.requestAnimationFrame(render);
      }

      stage.addEventListener('pointerdown', function (event) {
        isDragging = true;
        startX = event.clientX;
        startRotation = targetRotation;
        lastX = event.clientX;
        velocity = 0;
        setAuto(false);
        viewer.classList.add('is-dragging');
        if (stage.setPointerCapture) {
          stage.setPointerCapture(event.pointerId);
        }
      });

      stage.addEventListener('pointermove', function (event) {
        if (!isDragging) return;

        var delta = event.clientX - startX;
        velocity = event.clientX - lastX;
        lastX = event.clientX;
        targetRotation = startRotation + (delta * 0.42);
      });

      function endDrag(event) {
        if (!isDragging) return;
        isDragging = false;
        viewer.classList.remove('is-dragging');

        if (stage.hasPointerCapture && stage.hasPointerCapture(event.pointerId)) {
          stage.releasePointerCapture(event.pointerId);
        }

        function glide() {
          velocity *= 0.92;
          targetRotation += velocity * 0.18;
          if (Math.abs(velocity) > 0.18) {
            window.requestAnimationFrame(glide);
          }
        }

        glide();
      }

      stage.addEventListener('pointerup', endDrag);
      stage.addEventListener('pointercancel', endDrag);

      Array.prototype.slice.call(viewer.querySelectorAll('[data-vehicle-angle]')).forEach(function (button) {
        button.addEventListener('click', function () {
          var angle = button.getAttribute('data-vehicle-angle');
          var values = {
            front: 0,
            side: -90,
            rear: -180
          };

          setAuto(false);
          targetRotation = values[angle] || 0;
          updateAngleButtons(angle);
        });
      });

      var autoButton = viewer.querySelector('[data-vehicle-auto]');
      if (autoButton) {
        autoButton.addEventListener('click', function () {
          setAuto(!autoSpin);
          updateAngleButtons('');
        });
      }

      Array.prototype.slice.call(viewer.querySelectorAll('[data-vehicle-color]')).forEach(function (swatch) {
        swatch.addEventListener('click', function () {
          applyColor(swatch);
        });
      });

      applyColor(viewer.querySelector('[data-vehicle-color].is-active') || viewer.querySelector('[data-vehicle-color]'));
      setAuto(autoSpin);
      render();

      window.addEventListener('pagehide', function () {
        if (rafId) window.cancelAnimationFrame(rafId);
      }, { once: true });
    });
  }

  function initSmartNavbar() {
    var nav = document.querySelector('[data-smart-nav], .navbar, nav');
    if (!nav) return;

    function update() {
      nav.classList.toggle('motion-nav-scrolled', window.scrollY > 18);
    }

    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initPageTransition() {
    if (!window.anime || prefersReducedMotion) return;

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (link.target && link.target !== '_self') return;

      event.preventDefault();

      window.anime({
        targets: 'body',
        opacity: [1, 0],
        duration: 320,
        easing: 'easeInQuad',
        complete: function () {
          window.location.href = href;
        }
      });
    });
  }

  function runNavbarAnimation() {
    var nav = document.querySelector('.navbar, nav');
    if (!nav) return;

    if (!window.anime || prefersReducedMotion) {
      nav.style.opacity = '1';
      nav.style.transform = 'none';
      return;
    }

    nav.style.opacity = '0';
    nav.style.transform = 'translateY(-20px)';

    window.anime({
      targets: nav,
      opacity: [0, 1],
      translateY: [-20, 0],
      easing: 'easeOutExpo',
      duration: 700,
      delay: 50,
      complete: function () {
        nav.style.willChange = 'auto';
      }
    });
  }

  function init() {
    if (document.body) {
      document.body.classList.add('motion-enhanced');
    }

    runNavbarAnimation();
    runPageOpenAnimation();
    initScrollReveal();
    initSheenObserver();
    initParallax();
    initScrollProgress();
    initMagneticHover();
    initPremiumCursor();
    initMicroInteractions();
    initKineticTypography();
    initTextScramble();
    initImageSequences();
    initScrollytelling();
    initVehicle3D();
    initSmartNavbar();
    initPageTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
