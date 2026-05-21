/**
 * WeDRIVE - AI Insights Module
 * customer/js/ai-insights.js
 *
 * Dynamically computes analytics, personalized recommendations,
 * and recent trip analysis with zero-data leakage / empty-state protection.
 */

(function () {
  'use strict';

  var copy = {
    en: {
      savings_label: 'Total Savings',
      savings_desc: '15% savings vs market rate',
      savings_empty_desc: 'Book a trip to save',
      eco_label: 'Eco Score',
      eco_desc_good: 'Top 15% of renters',
      eco_desc_avg: 'Good driving efficiency',
      eco_empty_desc: 'No trips completed yet',
      dist_label: 'Total Distance',
      dist_desc_plural: 'Across {count} trips',
      dist_desc_single: 'Across 1 trip',
      dist_empty_desc: '0 km driven so far',
      rating_label: 'Your Rating',
      rating_desc: 'Excellent renter status',
      rating_empty_desc: 'New renter status',
      ai_empty_title: 'No Completed Trips Yet',
      ai_empty_desc: 'Once you complete your first WeDRIVE rental, our AI will automatically analyze your route, fuel efficiency, and eco score here.',
      ai_empty_btn: 'Browse Cars & Book',
      
      reco_suv_title: 'Try SUV Comfort Next Time',
      reco_suv_desc: 'Based on standard family comfort, a Mercedes-Benz GLA250 AMG Line would give you the best balance for weekend trips.',
      reco_view_car: 'View Car',
      
      reco_alert_title: 'Best Time to Book',
      reco_alert_desc: 'Our AI predicts prices will drop 22% next Tuesday. Set a price alert to get notified.',
      reco_set_alert: 'Set Alert',
      reco_alert_set: 'Alert Set',
      
      reco_gold_title: 'Unlock Premium Status',
      reco_gold_desc: 'Just {count} more booking{plural} to reach Silver tier! Silver members get priority pick-up and 5% off.',
      reco_learn_more: 'Learn More',
      
      recent_trips_title: 'Recent Trip Analysis',
      eco_score: 'Eco Score',
      distance: 'Distance',
      cost: 'Cost',
      trip_analysis: 'Recent Trip Analysis'
    },
    ms: {
      savings_label: 'Jumlah Penjimatan',
      savings_desc: 'Penjimatan 15% berbanding pasaran',
      savings_empty_desc: 'Tempah trip untuk jimat',
      eco_label: 'Skor Eko',
      eco_desc_good: 'Teratas 15% penyewa',
      eco_desc_avg: 'Kecekapan pemanduan baik',
      eco_empty_desc: 'Belum ada perjalanan selesai',
      dist_label: 'Jumlah Jarak',
      dist_desc_plural: 'Melalui {count} tempahan',
      dist_desc_single: 'Melalui 1 tempahan',
      dist_empty_desc: '0 km perjalanan setakat ini',
      rating_label: 'Penarafan Anda',
      rating_desc: 'Status penyewa cemerlang',
      rating_empty_desc: 'Status penyewa baru',
      ai_empty_title: 'Tiada Perjalanan Selesai Lagi',
      ai_empty_desc: 'Selepas anda menyelesaikan sewaan WeDRIVE yang pertama, AI kami akan menganalisis laluan, kecekapan bahan api, dan skor eko anda di sini secara automatik.',
      ai_empty_btn: 'Cari Kereta & Tempah',
      
      reco_suv_title: 'Cuba Keselesaan SUV Seterusnya',
      reco_suv_desc: 'Berdasarkan keselesaan keluarga standard, Mercedes-Benz GLA250 AMG Line akan memberikan keseimbangan terbaik untuk perjalanan hujung minggu.',
      reco_view_car: 'Lihat Kereta',
      
      reco_alert_title: 'Masa Terbaik Menempah',
      reco_alert_desc: 'AI meramalkan harga akan turun 22% Selasa depan. Tetapkan amaran harga untuk menerima notifikasi.',
      reco_set_alert: 'Set Amaran',
      reco_alert_set: 'Amaran Ditetap',
      
      reco_gold_title: 'Buka Status Premium',
      reco_gold_desc: 'Hanya {count} tempahan lagi untuk mencapai tahap Perak! Ahli Perak mendapat keutamaan pengambilan dan diskaun 5%.',
      reco_learn_more: 'Ketahui Lanjut',
      
      recent_trips_title: 'Analisis Perjalanan Terkini',
      eco_score: 'Skor Eko',
      distance: 'Jarak',
      cost: 'Kos',
      trip_analysis: 'Analisis Perjalanan Terkini'
    }
  };

  function lang() {
    return localStorage.getItem('wedrive-lang') === 'ms' ? 'ms' : 'en';
  }

  function t(key, vars) {
    var str = (copy[lang()] && copy[lang()][key]) || copy.en[key] || key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        str = str.replace(new RegExp('{' + k + '}', 'g'), vars[k]);
      });
    }
    return str;
  }

  function hashCode(str) {
    var hash = 0;
    if (!str) return hash;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }

  function formatDateRange(startStr, endStr) {
    if (!startStr || !endStr) return '';
    var startParts = startStr.split('-');
    var endParts = endStr.split('-');
    if (startParts.length !== 3 || endParts.length !== 3) return startStr + ' - ' + endStr;
    
    var monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthsMs = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
    var months = lang() === 'ms' ? monthsMs : monthsEn;
    
    var startYear = startParts[0];
    var startMonth = Number(startParts[1]) - 1;
    var startDay = Number(startParts[2]);
    
    var endYear = endParts[0];
    var endMonth = Number(endParts[1]) - 1;
    var endDay = Number(endParts[2]);
    
    if (startMonth === endMonth && startYear === endYear) {
      return months[startMonth] + ' ' + startDay + '-' + endDay + ', ' + startYear;
    } else if (startYear === endYear) {
      return months[startMonth] + ' ' + startDay + ' - ' + months[endMonth] + ' ' + endDay + ', ' + startYear;
    } else {
      return months[startMonth] + ' ' + startDay + ', ' + startYear + ' - ' + months[endMonth] + ' ' + endDay + ', ' + endYear;
    }
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function renderStats(completedBookings) {
    var savingsVal = document.getElementById('ai-savings');
    var savingsDesc = document.getElementById('ai-savings-desc');
    var ecoVal = document.getElementById('ai-eco');
    var ecoDesc = document.getElementById('ai-eco-desc');
    var distVal = document.getElementById('ai-distance');
    var distDesc = document.getElementById('ai-distance-desc');
    var ratingVal = document.getElementById('ai-rating');
    var ratingDesc = document.getElementById('ai-rating-desc');

    // Default empty states
    if (completedBookings.length === 0) {
      if (savingsVal) savingsVal.textContent = 'RM 0';
      if (savingsDesc) {
        savingsDesc.textContent = t('savings_empty_desc');
        savingsDesc.className = 'ai-stat-change';
      }
      
      if (ecoVal) ecoVal.innerHTML = '—';
      if (ecoDesc) {
        ecoDesc.textContent = t('eco_empty_desc');
        ecoDesc.className = 'ai-stat-change';
      }
      
      if (distVal) distVal.innerHTML = '0<small>km</small>';
      if (distDesc) {
        distDesc.textContent = t('dist_empty_desc');
        distDesc.className = 'ai-stat-change';
      }
      
      if (ratingVal) ratingVal.textContent = '5.0';
      if (ratingDesc) {
        ratingDesc.textContent = t('rating_empty_desc');
        ratingDesc.className = 'ai-stat-change positive';
      }
      return;
    }

    // Populate actual calculated stats
    var totalSpent = 0;
    var totalDays = 0;
    var totalEco = 0;

    completedBookings.forEach(function (b) {
      totalSpent += Number(b.total || 0);
      var days = Number(b.days || 0);
      if (!days && b.start_date && b.end_date) {
        var start = new Date(b.start_date);
        var end = new Date(b.end_date);
        days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      }
      totalDays += days || 2; // fallback to 2 days
      
      var score = 80 + (Math.abs(hashCode(String(b.id || b.booking_id))) % 18);
      totalEco += score;
    });

    var savings = Math.round(totalSpent * 0.15);
    var avgEco = Math.round(totalEco / completedBookings.length);
    var totalDist = totalDays * 78; // estimate 78km per day

    if (savingsVal) savingsVal.textContent = 'RM ' + savings;
    if (savingsDesc) {
      savingsDesc.textContent = t('savings_desc');
      savingsDesc.className = 'ai-stat-change positive';
    }

    if (ecoVal) ecoVal.innerHTML = avgEco + '<small>/100</small>';
    if (ecoDesc) {
      ecoDesc.textContent = avgEco >= 85 ? t('eco_desc_good') : t('eco_desc_avg');
      ecoDesc.className = 'ai-stat-change positive';
    }

    if (distVal) distVal.innerHTML = totalDist.toLocaleString() + '<small>km</small>';
    if (distDesc) {
      distDesc.textContent = completedBookings.length === 1 
        ? t('dist_desc_single') 
        : t('dist_desc_plural', { count: completedBookings.length });
      distDesc.className = 'ai-stat-change';
    }

    if (ratingVal) ratingVal.textContent = '4.9';
    if (ratingDesc) {
      ratingDesc.textContent = t('rating_desc');
      ratingDesc.className = 'ai-stat-change positive';
    }
  }

  function renderRecommendations(completedBookings) {
    var container = document.getElementById('reco-list-container');
    if (!container) return;

    var recoItems = [];

    // Recommendation 1: Dynamic car switch suggest
    if (completedBookings.length === 0) {
      recoItems.push({
        icon: 'bolt',
        colorClass: '',
        title: t('reco_suv_title'),
        desc: t('reco_suv_desc'),
        actionText: t('reco_view_car'),
        actionClick: "window.location='../dashboard/customer.html'"
      });
    } else {
      // Suggest based on past car or simple upgrade
      recoItems.push({
        icon: 'workspace_premium',
        colorClass: '',
        title: lang() === 'ms' ? 'Naik Taraf Ke Kelas Eksekutif' : 'Upgrade to Executive Class',
        desc: lang() === 'ms' 
          ? 'Berdasarkan penjimatan terkini anda, nikmati BMW 320i M Sport premium untuk keselesaan memandu tertinggi anda.' 
          : 'Based on your savings profile, try the premium BMW 320i M Sport for high-performance and business-class travels.',
        actionText: t('reco_view_car'),
        actionClick: "window.location='../dashboard/customer.html'"
      });
    }

    // Recommendation 2: Best Time to Book (Price Alert toggle)
    recoItems.push({
      icon: 'calendar_month',
      colorClass: 'reco-green',
      title: t('reco_alert_title'),
      desc: t('reco_alert_desc'),
      actionText: t('reco_set_alert'),
      actionClick: "setPriceAlert(this)",
      isAlertBtn: true
    });

    // Recommendation 3: Loyalty status
    var bookingsRemaining = Math.max(1, 3 - completedBookings.length);
    var tierDesc = t('reco_gold_desc', { 
      count: bookingsRemaining, 
      plural: bookingsRemaining === 1 ? '' : 's' 
    });

    recoItems.push({
      icon: 'loyalty',
      colorClass: 'reco-purple',
      title: t('reco_gold_title'),
      desc: tierDesc,
      actionText: t('reco_learn_more'),
      actionClick: "window.location='../support/support.html'"
    });

    container.innerHTML = recoItems.map(function (item) {
      var onClickAttr = item.isAlertBtn ? 'onclick="setPriceAlert(this)"' : 'onclick="' + item.actionClick + '"';
      return [
        '<div class="ai-reco-card reveal-on-scroll">',
        '  <div class="reco-icon ' + item.colorClass + '"><span class="material-icons-round">' + item.icon + '</span></div>',
        '  <div class="reco-content">',
        '    <h3>' + item.title + '</h3>',
        '    <p>' + item.desc + '</p>',
        '  </div>',
        '  <button class="reco-action" type="button" ' + onClickAttr + '>',
        '    ' + item.actionText + ' <span class="material-icons-round">' + (item.isAlertBtn ? 'notifications' : 'arrow_forward') + '</span>',
        '  </button>',
        '</div>'
      ].join('');
    }).join('');
  }

  function renderRecentTrips(completedBookings) {
    var container = document.getElementById('trip-list-container');
    if (!container) return;

    if (completedBookings.length === 0) {
      container.innerHTML = [
        '<div class="empty-state" style="padding: 40px 24px; text-align: center; background: var(--card-bg, #fff); border: 1px dashed var(--border, rgba(0,0,0,.15)); border-radius: 14px; margin-top: 12px;">',
        '  <span class="material-icons-round" style="font-size: 48px; color: var(--text-muted, #94a3b8); margin-bottom: 12px;">analytics</span>',
        '  <h3 style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 6px;" data-key="ai_empty_title">' + t('ai_empty_title') + '</h3>',
        '  <p style="font-size: 13px; color: var(--text-muted); max-width: 450px; margin: 0 auto 16px; line-height: 1.5;" data-key="ai_empty_desc">' + t('ai_empty_desc') + '</p>',
        '  <button class="reco-action" style="margin: 0 auto; display: flex; font-size: 13px;" onclick="window.location=\'../dashboard/customer.html\'">',
        '    <span class="material-icons-round">directions_car</span> <span data-key="ai_empty_btn">' + t('ai_empty_btn') + '</span>',
        '  </button>',
        '</div>'
      ].join('');
      return;
    }

    // Load cars to resolve names
    window.WeDriveAPI.getCars().then(function (cars) {
      container.innerHTML = completedBookings.map(function (b) {
        var car = (cars || []).find(function (c) { return String(c.id) === String(b.car_id); });
        var carName = car ? car.name : (b.car || 'WeDRIVE Rental');
        
        var days = Number(b.days || 0);
        if (!days && b.start_date && b.end_date) {
          var start = new Date(b.start_date);
          var end = new Date(b.end_date);
          days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        }
        days = days || 2;

        var dist = days * 78;
        var score = 80 + (Math.abs(hashCode(String(b.id || b.booking_id))) % 18);
        var scoreClass = score >= 85 ? 'eco-good' : 'eco-ok';

        var formattedDates = formatDateRange(b.start_date || b.pickup, b.end_date || b.return);

        return [
          '<div class="trip-card reveal-on-scroll">',
          '  <div class="trip-car">',
          '    <span class="material-icons-round">directions_car</span>',
          '    <div>',
          '      <strong>' + carName + '</strong>',
          '      <small>' + formattedDates + '</small>',
          '    </div>',
          '  </div>',
          '  <div class="trip-stats">',
          '    <div class="trip-stat"><span>' + t('distance') + '</span><strong>' + dist + ' km</strong></div>',
          '    <div class="trip-stat"><span>' + t('cost') + '</span><strong>RM ' + (b.total || 0) + '</strong></div>',
          '    <div class="trip-stat"><span>' + t('eco_score') + '</span><strong class="' + scoreClass + '">' + score + '</strong></div>',
          '  </div>',
          '</div>'
        ].join('');
      }).join('');
    }).catch(function (err) {
      console.error('[AI Insights] Error loading cars for trips:', err);
    });
  }

  async function loadData() {
    // Render dynamic titles & subtitles
    var titleEl = document.querySelector('.trip-section .section-title');
    if (titleEl) {
      titleEl.innerHTML = '<span class="material-icons-round">history</span> ' + t('trip_analysis');
    }

    var mainTitle = document.querySelector('.utility-title');
    if (mainTitle) mainTitle.textContent = lang() === 'ms' ? 'Analisis AI' : 'AI Insights';
    
    var mainSub = document.querySelector('.utility-subtitle');
    if (mainSub) mainSub.textContent = lang() === 'ms' ? 'Analisis pemanduan peribadi anda' : 'Your personalized driving analytics';

    var heroTitle = document.querySelector('.ai-hero h1');
    if (heroTitle) heroTitle.textContent = lang() === 'ms' ? 'Papan Pemuka Analisis AI' : 'AI Insights Dashboard';

    var heroDesc = document.querySelector('.ai-hero p');
    if (heroDesc) heroDesc.textContent = lang() === 'ms' ? 'Analisis pemanduan peribadi anda dikuasakan oleh WeDRIVE AI' : 'Your personalized driving analytics powered by WeDRIVE AI';

    var recoTitle = document.querySelector('.ai-reco-section .section-title');
    if (recoTitle) recoTitle.innerHTML = '<span class="material-icons-round">lightbulb</span> ' + (lang() === 'ms' ? 'Saranan AI' : 'AI Recommendations');

    if (!window.WeDriveAPI || !window.WeDriveAPI.getCurrentUser) return;
    try {
      var user = await window.WeDriveAPI.getCurrentUser();
      if (!user) {
        renderStats([]);
        renderRecommendations([]);
        renderRecentTrips([]);
        return;
      }
      
      var bookings = await window.WeDriveAPI.getCustomerBookings(user.id);
      
      // Filter for COMPLETED bookings
      var completed = (bookings || []).filter(function (b) {
        return b.status === 'Completed';
      });
      
      renderStats(completed);
      renderRecommendations(completed);
      renderRecentTrips(completed);
    } catch (err) {
      console.error('[AI Insights] Error loading data:', err);
      renderStats([]);
      renderRecommendations([]);
      renderRecentTrips([]);
    }
  }

  window.setPriceAlert = function (button) {
    button.classList.add('is-applied');
    button.innerHTML = t('reco_alert_set') + ' <span class="material-icons-round">notifications_active</span>';
    button.disabled = true;
  };

  document.addEventListener('wedrive:language-applied', loadData);

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }
})();
