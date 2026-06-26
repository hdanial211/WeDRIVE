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

  /* ── Inject shared/css/calendar.css ── */
  function injectCalendarCSS() {
    if (document.getElementById('wedrive-cal-css')) return;
    var link = document.createElement('link');
    link.id = 'wedrive-cal-css';
    link.rel = 'stylesheet';
    link.href = basePath() + 'shared/css/calendar.css';
    document.head.appendChild(link);
  }

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
  function initPairedPickers(pickupId, returnId, onChangeCallback, disabledDates) {
    var pickupInput = document.getElementById(pickupId);
    var returnInput = document.getElementById(returnId);
    if (!pickupInput || !returnInput || !window.flatpickr) return null;

    injectCalendarCSS();

    var pPicker = null;
    var rPicker = null;

    var commonConfig = {
      minDate: "today",
      dateFormat: "d/m/Y",
      disableMobile: "true",
      disable: disabledDates || [],
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
      onChange: function() {
        if (typeof onChangeCallback === 'function') onChangeCallback(pPicker, rPicker);
        redrawRange(pPicker, rPicker);
      }
    }));

    function updateReturnState() {
      var wrapper = returnInput.closest('.search-field-compact, .popup-date-field, .date-field');
      if (!pPicker || !pPicker.selectedDates.length) {
        rPicker.set('clickOpens', false);
        returnInput.disabled = true;
        if (wrapper) {
          wrapper.style.opacity = '0.5';
          wrapper.style.pointerEvents = 'none';
          wrapper.style.transition = 'opacity 0.3s ease';
        }
      } else {
        rPicker.set('clickOpens', true);
        returnInput.disabled = false;
        if (wrapper) {
          wrapper.style.opacity = '1';
          wrapper.style.pointerEvents = 'auto';
        }
      }
    }

    pPicker = window.flatpickr(pickupInput, Object.assign({}, commonConfig, {
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
          if (!rPicker.selectedDates[0] && selectedDates.length > 0) {
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

  /* ── Expose Globally ── */
  window.WeDriveCalendar = {
    initPairedPickers: initPairedPickers
  };

  /* ── Auto Init Main Pickers ── */
  function autoInit() {
    var hasPickers = document.getElementById('pickup-date') || document.getElementById('popup-pickup-date');
    if (!hasPickers) return;

    injectCalendarCSS();

    // Init dashboard main pickers
    window.WeDriveCalendar.mainPickers = initPairedPickers('pickup-date', 'return-date');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();
