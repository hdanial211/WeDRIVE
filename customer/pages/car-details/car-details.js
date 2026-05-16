/* ═══════════════════════════════════════════════════════════════
   CAR DETAILS PAGE - Interactive Logic
   WeDRIVE AI Car Rental System
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── GALLERY INTERACTION ──────────────────────────────────── */
  const thumbs = document.querySelectorAll('.gallery-thumbs .thumb');
  const heroImg = document.getElementById('hero-img');
  const dots = document.querySelectorAll('.gal-dot');

  thumbs.forEach((t, i) => {
    t.addEventListener('click', () => {
      thumbs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      dots.forEach(d => d.classList.remove('active'));
      if (dots[i]) dots[i].classList.add('active');
      if (t.tagName === 'IMG' && heroImg) {
        heroImg.style.opacity = '0';
        setTimeout(() => {
          heroImg.src = t.src;
          heroImg.style.opacity = '1';
        }, 250);
      }
    });
  });

  dots.forEach((d, i) => {
    d.addEventListener('click', () => {
      if (thumbs[i]) thumbs[i].click();
    });
  });

  /* ── SPEC COUNTER ANIMATION ───────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      if (el.dataset.counted) return;
      el.dataset.counted = '1';
      let current = 0;
      const step = Math.ceil(target / 40);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
          el.classList.add('counted');
        }
        el.textContent = current;
      }, 30);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));

  /* ── SPEC CARD MOUSE GLOW ─────────────────────────────────── */
  document.querySelectorAll('.spec-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', ((e.clientX - r.left) / r.width * 100) + '%');
      card.style.setProperty('--mouse-y', ((e.clientY - r.top) / r.height * 100) + '%');
    });
  });

  /* ── STICKY CTA VISIBILITY ────────────────────────────────── */
  const bookBtn = document.getElementById('btn-book');
  const stickyCta = document.getElementById('sticky-cta');
  if (bookBtn && stickyCta) {
    const stickyObs = new IntersectionObserver(([e]) => {
      stickyCta.style.transform = e.isIntersecting ? 'translateY(100%)' : 'translateY(0)';
      stickyCta.style.transition = 'transform .3s ease';
    });
    stickyObs.observe(bookBtn);
  }

  /* ── LOAD CAR DATA FROM data.json ─────────────────────────── */
  function loadCarData() {
    const params = new URLSearchParams(window.location.search);
    const carId = params.get('id');
    if (!carId || !window.WeDriveAPI) return;

    window.WeDriveAPI.getCars().then(cars => {
      const car = cars.find(c => c.id === carId);
      if (!car) return;

      const title = document.getElementById('car-title');
      const subtitle = document.getElementById('car-subtitle');
      const price = document.getElementById('car-price');
      const year = document.getElementById('car-year');
      const bcName = document.getElementById('bc-car-name');

      if (title) title.textContent = car.name || 'Car';
      if (subtitle) subtitle.textContent = (car.category || '') + ' -- ' + (car.year || '') + ' Edition';
      if (price) price.textContent = 'RM ' + (car.pricePerDay || 0);
      if (year) year.textContent = (car.year || '') + ' Model';
      if (bcName) bcName.textContent = car.name || 'Car';
      document.title = (car.name || 'Car') + ' | WeDRIVE';

      // Update sticky CTA price
      const sp = document.querySelector('.sticky-price strong');
      if (sp) sp.textContent = 'RM ' + (car.pricePerDay || 0);

      // Update hero image if car has image
      if (car.image && heroImg) heroImg.src = car.image;

      // Update book button link
      const btn = document.getElementById('btn-book');
      if (btn) btn.onclick = () => { window.location = '../booking/booking.html?id=' + carId; };
      const stickyBtn = document.querySelector('.sticky-cta button');
      if (stickyBtn) stickyBtn.onclick = () => { window.location = '../booking/booking.html?id=' + carId; };
    });
  }

  // Try loading after API is ready
  if (window.WeDriveAPI) {
    loadCarData();
  } else {
    window.addEventListener('load', () => setTimeout(loadCarData, 200));
  }

})();
