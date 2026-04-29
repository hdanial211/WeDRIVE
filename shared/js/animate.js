/**
 * WeDRIVE - Animation Module
 * shared/js/animate.js
 *
 * Requires: shared/js/anime.min.js (must be loaded before this file)
 *
 * HOW TO USE ON ANY PAGE:
 *  1. Add class="reveal-onload" to elements you want animated on page load.
 *  2. Add class="reveal-on-scroll" to elements you want animated on scroll.
 *  3. Include the two script tags at the bottom of your <body> (before main.js):
 *       <script src="../../shared/js/anime.min.js"></script>
 *       <script src="../../shared/js/animate.js"></script>
 *
 * OPTIONAL MODIFIERS (add alongside the reveal class):
 *  data-delay="200"   — extra delay in ms before element animates
 *  data-dir="left"    — slide in from left  (default: bottom/up)
 *  data-dir="right"   — slide in from right
 *  data-dir="up"      — slide in from bottom (default)
 *  data-dir="fade"    — fade only, no translate
 */

(function () {
  'use strict';

  // ─── HELPERS ────────────────────────────────────────────────────────────────

  /** Return translateX/Y values based on data-dir attribute */
  function getTranslate(el) {
    var dir = (el.dataset.dir || 'up').toLowerCase();
    switch (dir) {
      case 'left':  return { translateX: [-60, 0], translateY: [0, 0] };
      case 'right': return { translateX: [60, 0],  translateY: [0, 0] };
      case 'fade':  return { translateX: [0, 0],   translateY: [0, 0] };
      default:      return { translateX: [0, 0],   translateY: [30, 0] };
    }
  }

  /** Hide element before animating so no flash-of-content */
  function prepareElement(el) {
    el.style.opacity = '0';
    el.style.willChange = 'transform, opacity';
  }

  // ─── 1. PAGE OPEN ANIMATION ─────────────────────────────────────────────────
  // Runs once on DOMContentLoaded for all .reveal-onload elements.

  function runPageOpenAnimation() {
    var els = document.querySelectorAll('.reveal-onload');
    if (!els.length) return;

    els.forEach(function (el) { prepareElement(el); });

    anime({
      targets: '.reveal-onload',
      opacity:    [0, 1],
      translateY: [30, 0],
      easing:     'easeOutExpo',
      duration:   900,
      delay:      anime.stagger(100, { start: 80 })
    });
  }

  // ─── 2. SCROLL REVEAL ───────────────────────────────────────────────────────
  // IntersectionObserver watches .reveal-on-scroll elements.
  // Triggers anime() when each enters the viewport.

  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal-on-scroll');
    if (!els.length) return;

    els.forEach(function (el) { prepareElement(el); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el      = entry.target;
        var delay   = parseInt(el.dataset.delay || '0', 10);
        var t       = getTranslate(el);

        anime({
          targets:    el,
          opacity:    [0, 1],
          translateX: t.translateX,
          translateY: t.translateY,
          easing:     'easeOutExpo',
          duration:   800,
          delay:      delay
        });

        observer.unobserve(el);
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { observer.observe(el); });
  }

  // ─── 3. PAGE TRANSITION (FADE OUT on link click) ────────────────────────────
  // Smoothly fades out the page before navigating to another internal page.

  function initPageTransition() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href]');
      if (!link) return;

      var href = link.getAttribute('href');
      // Only internal, non-anchor, non-mailto links
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      // Skip if modifier key held (open in new tab etc.)
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;

      e.preventDefault();
      anime({
        targets:  'body',
        opacity:  [1, 0],
        duration: 320,
        easing:   'easeInQuad',
        complete: function () {
          window.location.href = href;
        }
      });
    });
  }

  // ─── 4. NAVBAR ANIMATION ────────────────────────────────────────────────────
  // Slides the navbar down on load.

  function runNavbarAnimation() {
    var nav = document.querySelector('.navbar, nav');
    if (!nav) return;
    nav.style.opacity = '0';
    nav.style.transform = 'translateY(-20px)';
    anime({
      targets:    nav,
      opacity:    [0, 1],
      translateY: [-20, 0],
      easing:     'easeOutExpo',
      duration:   700,
      delay:      50
    });
  }

  // ─── INIT ───────────────────────────────────────────────────────────────────

  function init() {
    // Fade body in (handles incoming page transition)
    document.body.style.opacity = '0';
    anime({
      targets:  'body',
      opacity:  [0, 1],
      duration: 400,
      easing:   'easeOutQuad'
    });

    runNavbarAnimation();
    runPageOpenAnimation();
    initScrollReveal();
    initPageTransition();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
