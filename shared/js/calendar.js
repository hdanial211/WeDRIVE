/**
 * WeDRIVE - Universal Calendar Module
 * shared/js/calendar.js
 * 
 * Auto-initializes Flatpickr on #pickup-date and #return-date 
 * and #popup-pickup-date and #popup-return-date.
 */

(function () {
  'use strict';

  /* ── Resolve base path relative to current page ── */
  function basePath() {
    var pathname = decodeURIComponent(window.location.pathname);
    var marker = '/AI CAR RENTAL SYSTEM/';
    var idx = pathname.indexOf(marker);
    if (idx !== -1) {
      var baseSub = pathname.substring(idx + marker.length);
      var parts = baseSub.split('/').filter(Boolean);
      if (parts.length > 0 && parts[parts.length - 1].includes('.')) {
        return '../'.repeat(parts.length - 1);
      }
      return '../'.repeat(parts.length);
    }
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  /* ── Inject shared/css/calendar.css (no-op as wedrive.css contains all calendar styles) ── */
  function injectCalendarCSS() {}

  /* ── Range highlight helper ── */
  function highlightRange(dayElem, pickupPicker, returnPicker) {
    dayElem.classList.remove('range-start', 'in-range', 'range-end');
    var pickup = pickupPicker && pickupPicker.selectedDates[0];
    var ret = returnPicker && returnPicker.selectedDates[0];
    if (!pickup || !ret) return;

    var d = dayElem.dateObj;
    if (!d) return;

    var pDay = new Date(pickup.getFullYear(), pickup.getMonth(), pickup.getDate()).getTime();
    var rDay = new Date(ret.getFullYear(), ret.getMonth(), ret.getDate()).getTime();
    var cDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

    if (cDay === pDay) dayElem.classList.add('range-start');
    if (cDay === rDay) dayElem.classList.add('range-end');
    if (cDay > pDay && cDay < rDay) dayElem.classList.add('in-range');
  }

  function redrawRange(pickupPicker, returnPicker) {
    [pickupPicker, returnPicker].forEach(function(fp) {
      if (!fp) return;
      var days = fp.calendarContainer
        ? fp.calendarContainer.querySelectorAll('.flatpickr-day')
        : [];
      days.forEach(function(el) { highlightRange(el, pickupPicker, returnPicker); });
    });
  }

  /* ── Initialize a Pair of Pickers ── */
  function initPairedPickers(pickupId, returnId, onChangeCallback, disabledDates, customConfig) {
    var pickupInput = typeof pickupId === 'string' ? document.getElementById(pickupId) : pickupId;
    var returnInput = typeof returnId === 'string' ? document.getElementById(returnId) : returnId;
    if (!pickupInput || !returnInput || !window.flatpickr) return null;

    injectCalendarCSS();

    var pPicker = null;
    var rPicker = null;

    var allowPast = customConfig && customConfig.allowPast;
    var minDateSetting = allowPast ? null : "today";
    var currentYear = new Date().getFullYear();
    var minYear = allowPast ? currentYear - 5 : currentYear;

    var commonConfig = {
      minDate: minDateSetting,
      dateFormat: "d/m/Y",
      disableMobile: "true",
      disable: disabledDates || [],
      onReady: function(selectedDates, dateStr, instance) {
        var yearInput = instance.currentYearElement;
        var wrapper = yearInput ? yearInput.parentNode : null;
        if (!wrapper) return;
        
        var select = document.createElement('select');
        select.className = 'flatpickr-monthDropdown-months custom-year-select';
        
        for (var i = minYear; i <= currentYear + 10; i++) {
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
      },
      onDayCreate: function(dObj, dStr, fp, dayElem) {
        highlightRange(dayElem, pPicker, rPicker);
        if (dayElem.dateObj && disabledDates && disabledDates.length > 0) {
          var dateToCheck = new Date(dayElem.dateObj.getFullYear(), dayElem.dateObj.getMonth(), dayElem.dateObj.getDate()).getTime();
          var isBooked = disabledDates.some(function(range) {
            if (range.from && range.to) {
              var f = new Date(range.from);
              var t = new Date(range.to);
              var fTime = new Date(f.getFullYear(), f.getMonth(), f.getDate()).getTime();
              var tTime = new Date(t.getFullYear(), t.getMonth(), t.getDate()).getTime();
              return dateToCheck >= fTime && dateToCheck <= tTime;
            }
            return false;
          });
          if (isBooked) {
            dayElem.classList.add('booked-date');
          }
        }
      },
      onMonthChange: function() {
        setTimeout(function() { redrawRange(pPicker, rPicker); }, 10);
      }
    };

    rPicker = window.flatpickr(returnInput, Object.assign({}, commonConfig, {
      clickOpens: false,
      onOpen: function(selectedDates, dateStr, instance) {
        if (!pPicker || !pPicker.selectedDates.length) {
          instance.close();
          triggerPickupRequiredFeedback();
          return;
        }
        if (pPicker && pPicker.isOpen) {
          pPicker.close();
        }
      },
      onChange: function() {
        if (typeof onChangeCallback === 'function') onChangeCallback(pPicker, rPicker);
        redrawRange(pPicker, rPicker);
      }
    }));

    function triggerPickupRequiredFeedback() {
      var returnWrapper = returnInput.closest('.search-field-compact, .popup-date-field, .popup-date-input-wrap, .date-field, .input-wrap') || returnInput;
      var pickupWrapper = pickupInput.closest('.search-field-compact, .popup-date-field, .popup-date-input-wrap, .date-field, .input-wrap') || pickupInput;

      // Close return picker immediately if open
      if (rPicker && rPicker.isOpen) {
        rPicker.close();
      }

      // Reset animation classes to allow clean re-triggers
      returnWrapper.classList.remove('date-shake-error');
      pickupWrapper.classList.remove('date-pickup-pulse');
      returnInput.classList.remove('date-shake-error');
      pickupInput.classList.remove('date-pickup-pulse');
      void returnWrapper.offsetWidth;
      void pickupWrapper.offsetWidth;

      // Shake only the outermost wrapper so it preserves its rounded pill shape
      returnWrapper.classList.add('date-shake-error');
      pickupWrapper.classList.add('date-pickup-pulse');

      // Vibrate if supported (haptic feedback)
      if (navigator.vibrate) {
        try { navigator.vibrate([30, 50, 30]); } catch (e) {}
      }

      // Automatically focus and open the Pick-up Date calendar picker
      setTimeout(function () {
        if (pPicker) {
          pPicker.open();
        }
      }, 100);

      // Clean up classes after animations complete
      setTimeout(function () {
        returnWrapper.classList.remove('date-shake-error');
      }, 550);

      setTimeout(function () {
        pickupWrapper.classList.remove('date-pickup-pulse');
      }, 1600);
    }

    function onReturnAttempt(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      // 1. If Pick-up Date is empty -> STRICTLY LOCK Return Date!
      if (!pPicker || !pPicker.selectedDates.length) {
        if (rPicker && rPicker.isOpen) rPicker.close();
        triggerPickupRequiredFeedback();
        return false;
      }
      
      // 2. If Pick-up Date IS selected -> UNLOCKED! Close pickup and open return picker!
      if (pPicker && pPicker.isOpen) {
        pPicker.close();
      }
      if (rPicker) {
        rPicker.open();
      }
    }

    var returnWrapper = returnInput.closest('.search-field-compact, .popup-date-field, .date-field, .input-wrap') || returnInput;
    returnWrapper.addEventListener('click', onReturnAttempt);
    returnInput.addEventListener('click', onReturnAttempt);

    function onPickupAttempt(e) {
      if (e) {
        e.stopPropagation();
      }
      if (rPicker && rPicker.isOpen) {
        rPicker.close();
      }
      if (pPicker) {
        pPicker.open();
      }
    }

    var pickupWrapper = pickupInput.closest('.search-field-compact, .popup-date-field, .date-field, .input-wrap') || pickupInput;
    pickupWrapper.addEventListener('click', onPickupAttempt);
    pickupInput.addEventListener('click', onPickupAttempt);

    function updateReturnState() {
      var wrapper = returnInput.closest('.search-field-compact, .popup-date-field, .date-field, .input-wrap');
      var pWrapper = pickupInput.closest('.search-field-compact, .popup-date-field, .date-field, .input-wrap');
      returnInput.readOnly = true;
      pickupInput.readOnly = true;
      returnInput.disabled = false;
      pickupInput.disabled = false;
      returnInput.style.pointerEvents = 'auto';
      pickupInput.style.pointerEvents = 'auto';
      if (wrapper) {
        wrapper.style.pointerEvents = 'auto';
      }
      if (pWrapper) {
        pWrapper.style.pointerEvents = 'auto';
      }
      if (!pPicker || !pPicker.selectedDates.length) {
        // LOCKED STATE
        if (wrapper) {
          wrapper.style.opacity = '0.65';
          wrapper.style.cursor = 'not-allowed';
          wrapper.style.transition = 'opacity 0.3s ease, border-color 0.2s ease, box-shadow 0.2s ease';
        }
        returnInput.style.cursor = 'not-allowed';
      } else {
        // UNLOCKED STATE
        if (wrapper) {
          wrapper.style.opacity = '1';
          wrapper.style.cursor = 'pointer';
        }
        returnInput.style.cursor = 'pointer';
      }
    }

    pPicker = window.flatpickr(pickupInput, Object.assign({}, commonConfig, {
      clickOpens: true,
      onOpen: function() {
        if (rPicker && rPicker.isOpen) {
          rPicker.close();
        }
      },
      onChange: function(selectedDates, dateStr) {
        rPicker.set('minDate', dateStr || "today");
        
        // Prevent jumping over booked dates by finding the next disabled date
        if (selectedDates[0] && disabledDates && disabledDates.length > 0) {
          var pickupTime = selectedDates[0].getTime();
          var nextDisabledDate = null;
          var nextDisabledTime = Infinity;
          
          disabledDates.forEach(function(range) {
            if (range.from) {
              var f = new Date(range.from);
              var fTime = new Date(f.getFullYear(), f.getMonth(), f.getDate()).getTime();
              // If this disabled date is strictly AFTER the pickup date
              if (fTime > pickupTime && fTime < nextDisabledTime) {
                nextDisabledTime = fTime;
                nextDisabledDate = new Date(fTime);
              }
            }
          });
          
          if (nextDisabledDate) {
            // Subtract one day so maxDate is the day before the next booking starts
            var maxReturnDate = new Date(nextDisabledDate.getTime() - 24 * 60 * 60 * 1000);
            rPicker.set('maxDate', maxReturnDate);
          } else {
            rPicker.set('maxDate', null); // No future bookings
          }
        } else {
          rPicker.set('maxDate', null);
        }

        updateReturnState();
        if (rPicker.selectedDates[0] && selectedDates[0] && rPicker.selectedDates[0] < selectedDates[0]) {
          rPicker.clear();
        }
        // Also clear if current return date is greater than the newly calculated maxDate
        if (rPicker.selectedDates[0] && rPicker.config.maxDate && rPicker.selectedDates[0] > rPicker.config.maxDate) {
          rPicker.clear();
        }

        setTimeout(function() {
          if (rPicker && !rPicker.selectedDates.length && selectedDates.length > 0) {
            if (pPicker) pPicker.close();
            rPicker.open();
          }
        }, 150);

        if (typeof onChangeCallback === 'function') onChangeCallback(pPicker, rPicker);
        redrawRange(pPicker, rPicker);
      }
    }));

    updateReturnState();

    return { pickup: pPicker, return: rPicker };
  }

  /* ── Initialize a Single Apple Picker ── */
  function initSinglePicker(inputOrId, customConfig) {
    var input = typeof inputOrId === 'string' ? document.getElementById(inputOrId) : inputOrId;
    if (!input || !window.flatpickr) return null;

    var allowPast = customConfig && customConfig.allowPast;
    var minDateSetting = allowPast ? null : "today";
    var currentYear = new Date().getFullYear();
    var minYear = allowPast ? currentYear - 5 : currentYear;

    var commonConfig = {
      minDate: minDateSetting,
      dateFormat: "d/m/Y",
      disableMobile: "true",
      onReady: function(selectedDates, dateStr, instance) {
        var yearInput = instance.currentYearElement;
        var wrapper = yearInput ? yearInput.parentNode : null;
        if (!wrapper) return;
        
        var select = document.createElement('select');
        select.className = 'flatpickr-monthDropdown-months custom-year-select';
        
        for (var i = minYear; i <= currentYear + 10; i++) {
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

    return window.flatpickr(input, Object.assign({}, commonConfig, customConfig || {}));
  }

  /* ── Expose Globally ── */
  window.WeDriveCalendar = {
    initPairedPickers: initPairedPickers,
    initSinglePicker: initSinglePicker
  };

  /* ── Auto Init Main Pickers Universally ── */
  function autoInit() {
    if (!window.flatpickr) return;

    injectCalendarCSS();

    // 1. Dashboard & Browse Cars main pickers (Future only)
    if (document.getElementById('pickup-date') && document.getElementById('return-date')) {
      window.WeDriveCalendar.mainPickers = initPairedPickers('pickup-date', 'return-date');
    }

    // 2. Admin Bookings filter range (Allows past for filtering history)
    if (document.getElementById('bk-date-from') && document.getElementById('bk-date-to')) {
      window.WeDriveCalendar.adminBookingPickers = initPairedPickers('bk-date-from', 'bk-date-to', null, null, { allowPast: true });
    }

    // 3. Admin Marketing Banners range (Future only)
    if (document.getElementById('banner-start') && document.getElementById('banner-end')) {
      window.WeDriveCalendar.bannerPickers = initPairedPickers('banner-start', 'banner-end');
    }

    // 4. Admin Seasonal range (Future only)
    if (document.getElementById('seasonal-start') && document.getElementById('seasonal-end')) {
      window.WeDriveCalendar.seasonalPickers = initPairedPickers('seasonal-start', 'seasonal-end');
    }

    // 5. Admin Promo Expiry Single Picker (Future only)
    if (document.getElementById('promo-expiry')) {
      initSinglePicker('promo-expiry');
    }

    // 6. Convert any generic date pickers or inputs with class .date-picker
    document.querySelectorAll('.date-picker').forEach(function(input) {
      if (!input._flatpickr) {
        var allowPast = input.getAttribute('data-allow-past') === 'true';
        initSinglePicker(input, { allowPast: allowPast });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();
