/**
 * WeDRIVE - Customer and Guest Browse Module
 * Data is loaded through shared/js/api.js from shared/dummy/data.json.
 */

(function () {
  'use strict';

  var allCars = [];
  var currentFilter = 'all';
  var currentSort = 'recommended';
  var availableOnly = false;
  var controlsBound = false;
  var lastRenderedCars = [];
  var spotlightCars = [];
  var spotlightIndex = 0;
  var spotlightTimer = 0;

  var copy = {
    en: {
      seats: 'Seats',
      seatsShort: 'Seats',
      day: '/day',
      available: 'Available',
      rented: 'Rented',
      bookNow: 'Book Now',
      signInToBook: 'Sign in to book',
      locked: 'Guest preview',
      aiMatch: 'AI match',
      plate: 'Plate',
      plateHidden: 'Plate revealed after payment',
      color: 'Color',
      reviews: 'reviews',
      resultsPrefix: 'Showing',
      resultsSuffix: 'cars available',
      empty: 'No cars match your filters right now.',
      booking: 'Booking'
    },
    ms: {
      seats: 'Tempat Duduk',
      seatsShort: 'Tempat',
      day: '/hari',
      available: 'Tersedia',
      rented: 'Disewa',
      bookNow: 'Tempah Sekarang',
      signInToBook: 'Log masuk untuk tempah',
      locked: 'Pratonton tetamu',
      aiMatch: 'Padanan AI',
      plate: 'Plat',
      plateHidden: 'Plat dipaparkan selepas bayaran',
      color: 'Warna',
      reviews: 'ulasan',
      resultsPrefix: 'Menunjukkan',
      resultsSuffix: 'kereta tersedia',
      empty: 'Tiada kereta sepadan dengan pilihan anda sekarang.',
      booking: 'Tempahan'
    }
  };

  function lang() {
    return localStorage.getItem('wedrive-lang') === 'ms' ? 'ms' : 'en';
  }

  function t(key) {
    return (copy[lang()] && copy[lang()][key]) || copy.en[key] || key;
  }

  function rootPrefix() {
    return window.location.pathname.includes('/pages/') ? '../../' : '';
  }

  function imagePath(car) {
    var file = car && car.images && car.images.length ? car.images[0] : '';
    return file ? rootPrefix() + 'shared/images/cars/' + file : '';
  }

  function escapeHtml(value) {
    return String(value === undefined || value === null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function statusKey(car) {
    return String(car.status || '').toLowerCase() === 'available' ? 'available' : 'rented';
  }

  function statusText(car) {
    var key = statusKey(car);
    return key === 'available' ? t('available') : t('rented');
  }

  function shouldRevealPlate() {
    return window.__REVEAL_PLATE__ === true;
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function bindControls() {
    if (controlsBound) return;
    controlsBound = true;

    var searchForm = document.getElementById('guest-search-form');
    var typeSelect = document.getElementById('search-car-type');
    var sortSelect = document.getElementById('sort-select');
    var availableToggle = document.getElementById('available-toggle');
    var modal = document.getElementById('guest-book-modal');

    if (searchForm) {
      searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (typeSelect) {
          currentFilter = typeSelect.value || 'all';
          syncFilterChips();
        }
        applyFilters(true);
      });
    }

    if (typeSelect) {
      typeSelect.addEventListener('change', function () {
        currentFilter = typeSelect.value || 'all';
        syncFilterChips();
        applyFilters(false);
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        currentSort = sortSelect.value || 'recommended';
        applyFilters(false);
      });
    }

    if (availableToggle) {
      availableToggle.addEventListener('change', function () {
        availableOnly = availableToggle.checked;
        applyFilters(false);
      });
    }

    if (modal) {
      modal.addEventListener('click', function (event) {
        if (event.target === modal) closeGuestPrompt();
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeGuestPrompt();
        if (window.closeBookingPopup) window.closeBookingPopup();
      }
    });

    document.addEventListener('wedrive:language-applied', function () {
      renderHeroStats();
      renderSpotlight(spotlightIndex, false);
      renderCars(lastRenderedCars.length ? lastRenderedCars : allCars);
    });
  }

  function syncFilterChips() {
    document.querySelectorAll('.filter-chip').forEach(function (button) {
      var target = (button.getAttribute('onclick') || '').match(/filterCars\('([^']+)'/);
      button.classList.toggle('active', !!target && target[1] === currentFilter);
    });

    var typeSelect = document.getElementById('search-car-type');
    if (typeSelect && typeSelect.value !== currentFilter) {
      typeSelect.value = currentFilter;
    }
  }

  function applyFilters(shouldScroll) {
    var list = allCars.slice();

    if (currentFilter !== 'all') {
      list = list.filter(function (car) { return car.type === currentFilter; });
    }

    if (availableOnly) {
      list = list.filter(function (car) { return statusKey(car) === 'available'; });
    }

    list.sort(function (a, b) {
      if (currentSort === 'price_asc') return Number(a.price || 0) - Number(b.price || 0);
      if (currentSort === 'price_desc') return Number(b.price || 0) - Number(a.price || 0);
      if (currentSort === 'rating_desc') return Number(b.rating || 0) - Number(a.rating || 0);

      var aAvailable = statusKey(a) === 'available' ? 1 : 0;
      var bAvailable = statusKey(b) === 'available' ? 1 : 0;
      if (aAvailable !== bAvailable) return bAvailable - aAvailable;
      return Number(b.rating || 0) - Number(a.rating || 0);
    });

    renderCars(list);

    if (shouldScroll) {
      var carsSection = document.getElementById('cars');
      if (carsSection) carsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderHeroStats() {
    if (!allCars.length) return;

    var minPrice = allCars.reduce(function (min, car) {
      return Math.min(min, Number(car.price || min));
    }, Number(allCars[0].price || 0));

    var ratingTotal = allCars.reduce(function (sum, car) {
      return sum + Number(car.rating || 0);
    }, 0);
    var avgRating = ratingTotal / allCars.length;

    setText('guest-total-cars', String(allCars.length));
    setText('guest-start-price', 'RM ' + minPrice);
    setText('guest-avg-rating', avgRating.toFixed(1));
  }

  function buildSpotlightCars() {
    var available = allCars.filter(function (car) { return statusKey(car) === 'available'; });
    var pool = available.length ? available : allCars;
    spotlightCars = pool.slice().sort(function (a, b) {
      return Number(b.rating || 0) - Number(a.rating || 0);
    }).slice(0, 4);
  }

  function renderSpotlightDots() {
    var dots = document.getElementById('guest-spotlight-dots');
    if (!dots || spotlightCars.length < 2) return;

    dots.innerHTML = spotlightCars.map(function (_, index) {
      return '<button type="button" class="' + (index === spotlightIndex ? 'active' : '') + '" onclick="switchSpotlight(' + index + ')" aria-label="Show car ' + (index + 1) + '"></button>';
    }).join('');
  }

  function renderSpotlight(index, animate) {
    if (!allCars.length) return;
    if (!spotlightCars.length) buildSpotlightCars();
    if (!spotlightCars.length) return;

    spotlightIndex = ((Number(index) || 0) + spotlightCars.length) % spotlightCars.length;
    var car = spotlightCars[spotlightIndex];
    var showcase = document.querySelector('.guest-hero-showcase');
    var img = document.getElementById('guest-spotlight-img');

    if (animate && showcase) showcase.classList.add('is-changing');

    setTimeout(function () {
      if (img) {
        img.src = imagePath(car);
        img.alt = car.name;
      }

      setText('guest-spotlight-type', car.label || car.type || '');
      setText('guest-spotlight-name', car.name || '');
      setText('guest-spotlight-rate', 'RM ' + car.price + t('day'));
      setText('guest-spotlight-rating', String(car.rating || ''));
      setText('guest-spotlight-seats', car.seats + ' ' + t('seatsShort'));
      setText('guest-spotlight-fuel', car.fuel || '');
      setText('guest-spotlight-status', statusText(car));
      renderSpotlightDots();

      if (showcase) {
        setTimeout(function () {
          showcase.classList.remove('is-changing');
        }, 90);
      }
    }, animate ? 160 : 0);
  }

  function startSpotlightCarousel() {
    if (spotlightTimer) clearInterval(spotlightTimer);
    if (spotlightCars.length < 2) return;

    spotlightTimer = setInterval(function () {
      renderSpotlight(spotlightIndex + 1, true);
    }, 3800);
  }

  window.switchSpotlight = function (index) {
    if (spotlightTimer) clearInterval(spotlightTimer);
    renderSpotlight(index, true);
    startSpotlightCarousel();
  };

  function renderCars(list) {
    var grid = document.getElementById('cars-grid');
    var results = document.getElementById('results-count');
    if (!grid) return;

    lastRenderedCars = list.slice();

    if (results) {
      results.innerHTML = t('resultsPrefix') + ' <strong>' + list.length + '</strong> ' + t('resultsSuffix');
    }

    if (!list.length) {
      grid.innerHTML = [
        '<div class="empty-state">',
        '  <span class="material-icons-round">search_off</span>',
        '  <strong>' + escapeHtml(t('empty')) + '</strong>',
        '</div>'
      ].join('');
      return;
    }

    grid.innerHTML = list.map(function (car) {
      var safeName = escapeHtml(car.name);
      var safeType = escapeHtml(car.label || car.type || '');
      var safeFuel = escapeHtml(car.fuel || '');
      var safeTrans = escapeHtml(car.trans || car.transmission || '');
      var safePlate = escapeHtml(car.plate || '');
      var safeColor = escapeHtml(car.color || '');
      var safeAi = escapeHtml(car.ai || t('aiMatch'));
      var rating = escapeHtml(car.rating || '⭐ 4.7');
      var reviews = escapeHtml(car.reviews || '0');
      var status = statusKey(car);
      var img = imagePath(car);
      var buttonText = window.__GUEST_MODE__ ? t('signInToBook') : t('bookNow');
      var metaItems = [];

      if (shouldRevealPlate() && safePlate) {
        metaItems.push('<span>' + escapeHtml(t('plate')) + ': ' + safePlate + '</span>');
      }

      if (safeColor) {
        metaItems.push('<span>' + escapeHtml(t('color')) + ': ' + safeColor + '</span>');
      }

      return [
        '<div class="car-card" onclick="bookCar(' + Number(car.id) + ')">',
        '  <div class="car-img">',
        img ? '    <img src="' + img + '" alt="' + safeName + '" />' : '    <span class="material-icons-round no-img">directions_car</span>',
        '    <div class="car-badges">',
        '      <span class="status-pill ' + status + '">' + escapeHtml(statusText(car)) + '</span>',
        '      <span class="rating-pill">' + rating + '</span>',
        '    </div>',
        '  </div>',
        '  <div class="car-body">',
        '    <div class="car-topline">',
        '      <p class="car-type">' + safeType + '</p>',
        '      <span class="rating-pill"><span class="material-icons-round">reviews</span>' + reviews + ' ' + escapeHtml(t('reviews')) + '</span>',
        '    </div>',
        '    <h3>' + safeName + '</h3>',
        metaItems.length ? '    <div class="car-meta">' + metaItems.join('') + '</div>' : '',
        '    <div class="car-specs">',
        '      <div class="spec"><span class="material-icons-round">local_gas_station</span>' + safeFuel + '</div>',
        '      <div class="spec"><span class="material-icons-round">event_seat</span>' + Number(car.seats || 0) + ' ' + escapeHtml(t('seats')) + '</div>',
        '      <div class="spec"><span class="material-icons-round">settings</span>' + safeTrans + '</div>',
        '      <div class="spec"><span class="material-icons-round">verified</span>' + escapeHtml(window.__GUEST_MODE__ ? t('locked') : statusText(car)) + '</div>',
        '    </div>',
        '    <div class="ai-chip"><span class="material-icons-round" style="font-size:12px">psychology</span>' + safeAi + '</div>',
        '    <div class="car-footer">',
        '      <div class="price">RM ' + Number(car.price || 0) + '<span>' + escapeHtml(t('day')) + '</span></div>',
        '      <button class="btn-book' + (window.__GUEST_MODE__ ? ' btn-book-guest' : '') + '" onclick="event.stopPropagation();bookCar(' + Number(car.id) + ')">',
        '        <span class="material-icons-round" style="font-size:17px">' + (window.__GUEST_MODE__ ? 'lock' : 'event_available') + '</span>',
        '        ' + escapeHtml(buttonText),
        '      </button>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');
    }).join('');
  }

  function openGuestBookingPrompt(car) {
    var modal = document.getElementById('guest-book-modal');
    if (!modal) {
      window.location.href = rootPrefix() + 'index.html';
      return;
    }

    var img = document.getElementById('guest-modal-img');
    var carLine = document.getElementById('guest-modal-car');
    var login = modal.querySelector('.guest-modal-actions a:first-child');
    var signup = modal.querySelector('.guest-modal-actions a:last-child');

    if (img) {
      img.src = imagePath(car);
      img.alt = car.name;
    }
    if (carLine) {
      carLine.textContent = car.name + ' - RM ' + car.price + t('day') + ' - ' + statusText(car);
    }
    if (login) login.href = rootPrefix() + 'index.html';
    if (signup) signup.href = rootPrefix() + 'customer/pages/signup/signup.html';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeGuestPrompt() {
    var modal = document.getElementById('guest-book-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  window.closeGuestPrompt = closeGuestPrompt;

  window.filterCars = function (type, btn) {
    currentFilter = type || 'all';
    document.querySelectorAll('.filter-chip').forEach(function (button) {
      button.classList.remove('active');
    });
    if (btn) btn.classList.add('active');
    syncFilterChips();
    applyFilters(false);
  };

  var selectedBookingCar = null;
  var popupPickupPicker = null;
  var popupReturnPicker = null;

  window.bookCar = function (id) {
    var car = allCars.find(function (item) { return Number(item.id) === Number(id); });
    if (!car) return;

    if (window.__GUEST_MODE__) {
      openGuestBookingPrompt(car);
      return;
    }

    selectedBookingCar = car;
    openBookingPopup(car);
  };

  function openBookingPopup(car) {
    var popup = document.getElementById('booking-popup');
    if (!popup) return;

    // Populate car info
    var img = document.getElementById('popup-car-img');
    if (img) { img.src = imagePath(car); img.alt = car.name; }
    var nameEl = document.getElementById('popup-car-name');
    if (nameEl) nameEl.textContent = car.name;
    var typeEl = document.getElementById('popup-car-type');
    if (typeEl) typeEl.textContent = car.label || car.type || '';
    var priceEl = document.getElementById('popup-car-price');
    if (priceEl) priceEl.innerHTML = 'RM ' + Number(car.price || 0) + '<span>' + t('day') + '</span>';

    // Reset duration/total
    var durEl = document.getElementById('popup-duration');
    if (durEl) durEl.style.display = 'none';

    // Reset proceed button
    var procBtn = document.getElementById('popup-proceed-btn');
    if (procBtn) procBtn.disabled = true;

    // Initialize Flatpickr on popup inputs
    initPopupDatePickers(car);

    // Show popup
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Auto-open pickup calendar after a brief delay
    setTimeout(function() {
      if (popupPickupPicker) popupPickupPicker.open();
    }, 350);
  }

  function initPopupDatePickers(car) {
    var pickupInput = document.getElementById('popup-pickup-date');
    var returnInput = document.getElementById('popup-return-date');
    if (!pickupInput || !returnInput || !window.flatpickr) return;

    // Destroy old instances
    if (popupPickupPicker) { popupPickupPicker.destroy(); popupPickupPicker = null; }
    if (popupReturnPicker) { popupReturnPicker.destroy(); popupReturnPicker = null; }

    pickupInput.value = '';
    returnInput.value = '';

    var commonConfig = {
      minDate: 'today',
      dateFormat: 'd/m/Y',
      disableMobile: 'true',

      onReady: function(selectedDates, dateStr, instance) {
        var yearInput = instance.currentYearElement;
        var wrapper = yearInput.parentNode;
        var select = document.createElement('select');
        select.className = 'flatpickr-monthDropdown-months custom-year-select';
        var currentYear = new Date().getFullYear();
        for (var i = currentYear; i <= currentYear + 3; i++) {
          var opt = document.createElement('option');
          opt.value = i; opt.text = i;
          select.appendChild(opt);
        }
        select.value = instance.currentYear;
        select.addEventListener('change', function(e) { instance.changeYear(Number(e.target.value)); });
        yearInput.style.display = 'none';
        var arrows = wrapper.querySelectorAll('.arrowUp, .arrowDown');
        arrows.forEach(function(a) { a.style.display = 'none'; });
        wrapper.appendChild(select);
        instance.customYearSelect = select;
      },
      onYearChange: function(selectedDates, dateStr, instance) {
        if (instance.customYearSelect) instance.customYearSelect.value = instance.currentYear;
      }
    };

    popupReturnPicker = flatpickr(returnInput, Object.assign({}, commonConfig, {
      onChange: function() { updateBookingSummary(car); }
    }));

    popupPickupPicker = flatpickr(pickupInput, Object.assign({}, commonConfig, {
      onChange: function(selectedDates, dateStr) {
        popupReturnPicker.set('minDate', dateStr || 'today');
        if (popupReturnPicker.selectedDates[0] && selectedDates[0] && popupReturnPicker.selectedDates[0] < selectedDates[0]) {
          popupReturnPicker.clear();
        }
        setTimeout(function() {
          if (!popupReturnPicker.selectedDates[0]) {
            popupReturnPicker.open();
          }
        }, 150);
        updateBookingSummary(car);
      }
    }));
  }

  function updateBookingSummary(car) {
    var durEl = document.getElementById('popup-duration');
    var durText = document.getElementById('popup-duration-text');
    var totalEl = document.getElementById('popup-total');
    var procBtn = document.getElementById('popup-proceed-btn');
    if (!durEl || !popupPickupPicker || !popupReturnPicker) return;

    var pickup = popupPickupPicker.selectedDates[0];
    var ret = popupReturnPicker.selectedDates[0];

    if (pickup && ret) {
      var diff = Math.ceil((ret - pickup) / (1000 * 60 * 60 * 24));
      if (diff < 1) diff = 1;
      var total = diff * Number(car.price || 0);
      durEl.style.display = 'flex';
      if (durText) durText.textContent = diff + (diff === 1 ? ' day' : ' days');
      if (totalEl) totalEl.textContent = 'RM ' + total.toLocaleString();
      if (procBtn) procBtn.disabled = false;
    } else {
      durEl.style.display = 'none';
      if (procBtn) procBtn.disabled = true;
    }
  }

  window.closeBookingPopup = function() {
    var popup = document.getElementById('booking-popup');
    if (!popup) return;
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (popupPickupPicker) popupPickupPicker.close();
    if (popupReturnPicker) popupReturnPicker.close();
  };

  window.proceedToBooking = function() {
    if (!selectedBookingCar) return;
    var pickup = document.getElementById('popup-pickup-date');
    var ret = document.getElementById('popup-return-date');
    var loc = document.getElementById('popup-location');
    var params = [
      'car=' + encodeURIComponent(selectedBookingCar.id),
      'name=' + encodeURIComponent(selectedBookingCar.name),
      'price=' + encodeURIComponent(selectedBookingCar.price),
      'pickup=' + encodeURIComponent(pickup ? pickup.value : ''),
      'return=' + encodeURIComponent(ret ? ret.value : ''),
      'location=' + encodeURIComponent(loc ? loc.value : '')
    ];
    window.location.href = '../car-details/booking/booking.html?' + params.join('&');
  };

  function loadCars() {
    var grid = document.getElementById('cars-grid');
    if (!window.WeDriveAPI || !window.WeDriveAPI.getCars) {
      if (grid) grid.innerHTML = '<div class="empty-state">Unable to load cars.</div>';
      return;
    }

    window.WeDriveAPI.getCars()
      .then(function (cars) {
        allCars = cars || [];
        renderHeroStats();
        buildSpotlightCars();
        renderSpotlight(0, false);
        startSpotlightCarousel();
        applyFilters(false);
      })
      .catch(function () {
        if (grid) {
          grid.innerHTML = '<div class="empty-state"><span class="material-icons-round">error</span><strong>Unable to load cars. Please refresh the page.</strong></div>';
        }
      });
  }

  function initDatePickers() {
    var pickupInput = document.getElementById('pickup-date');
    var returnInput = document.getElementById('return-date');

    if (pickupInput && returnInput && window.flatpickr) {
      var commonConfig = {
        minDate: "today",
        dateFormat: "d/m/Y",
        disableMobile: "true",
        onReady: function(selectedDates, dateStr, instance) {
          var yearInput = instance.currentYearElement;
          var wrapper = yearInput.parentNode;
          
          var select = document.createElement('select');
          select.className = 'flatpickr-monthDropdown-months custom-year-select';
          
          var currentYear = new Date().getFullYear();
          for (var i = currentYear; i <= currentYear + 10; i++) {
              var opt = document.createElement('option');
              opt.value = i;
              opt.text = i;
              select.appendChild(opt);
          }
          select.value = instance.currentYear;
          
          select.addEventListener('change', function(e) {
              instance.changeYear(Number(e.target.value));
          });
          
          yearInput.style.display = 'none';
          var arrows = wrapper.querySelectorAll('.arrowUp, .arrowDown');
          arrows.forEach(function(a) { a.style.display = 'none'; });
          
          wrapper.appendChild(select);
          instance.customYearSelect = select;
        },
        onYearChange: function(selectedDates, dateStr, instance) {
          if (instance.customYearSelect) {
            instance.customYearSelect.value = instance.currentYear;
          }
        }
      };

      var returnPicker = flatpickr(returnInput, Object.assign({}, commonConfig));

      flatpickr(pickupInput, Object.assign({}, commonConfig, {
        onChange: function(selectedDates, dateStr) {
          returnPicker.set('minDate', dateStr || "today");
          if (returnPicker.selectedDates[0] && selectedDates[0] && returnPicker.selectedDates[0] < selectedDates[0]) {
            returnPicker.clear();
          }
          setTimeout(function() {
            if (!returnPicker.selectedDates[0]) {
              returnPicker.open();
            }
          }, 100);
        }
      }));
    }
  }

  function init() {
    bindControls();
    loadCars();
    if (typeof flatpickr !== 'undefined') {
      initDatePickers();
    } else {
      // If loaded asynchronously
      setTimeout(initDatePickers, 500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
