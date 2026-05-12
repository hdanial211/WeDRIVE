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
 *
 * Premium utility hooks:
 *  - Add class="motion-sheen" to trigger a light sweep on reveal / hover.
 *  - Add class="premium-hover" for subtle luxury-card hover lift.
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
    el.style.transform = 'none';
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
    initPageTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
