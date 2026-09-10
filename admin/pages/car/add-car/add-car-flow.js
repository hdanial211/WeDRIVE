/**
 * WeDRIVE Admin Add Car 5-Step Modular Flow
 * admin/pages/car/add/add-car-flow.js
 * 
 * Manages state persistence across modular steps:
 * Step 1: Spesifikasi & Harga (step1_spesifikasi.html)
 * Step 2: Studio Visual 360° (step2_studio360.html)
 * Step 3: Semakan Akhir Pentadbir (step3_pengesahan.html)
 * Step 4: Pandangan Pelanggan WYSIWYG (step4_pandangan_pelanggan.html)
 * Step 5: Butiran & Tempahan Pelanggan (step5_tempahan.html)
 */

(function () {
  'use strict';

  const DRAFT_KEY = 'wedrive_new_car_draft';

  // Malaysian Automotive Reference Catalog
  const CAR_CATALOG = {
    'Proton': {
      models: {
        'S70': {
          variants: ['1.5T Executive', '1.5T Premium', '1.5T Flagship', '1.5T Flagship X'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L Turbo Dual VVT', baseRate: 160, baseDep: 200,
          img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80'
        },
        'X50': {
          variants: ['1.5T Standard', '1.5T Executive', '1.5T Premium', '1.5 TGDi Flagship'],
          type: 'SUV', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L TGDi Turbocharged', baseRate: 190, baseDep: 250,
          img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80'
        },
        'X70': {
          variants: ['1.5 TGDi Standard', '1.5 TGDi Executive', '1.5 TGDi Premium', '1.8 TGDi Premium X'],
          type: 'SUV', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L TGDi Engine', baseRate: 250, baseDep: 300,
          img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80'
        },
        'Saga': {
          variants: ['1.3 Standard MT', '1.3 Standard AT', '1.3 Premium AT'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.3L 4-Cylinder VVT', baseRate: 110, baseDep: 150,
          img: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80'
        },
        'Persona': {
          variants: ['1.6 Standard CVT', '1.6 Executive CVT', '1.6 Premium CVT'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.6L VVT DOHC', baseRate: 130, baseDep: 180,
          img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80'
        }
      }
    },
    'Perodua': {
      models: {
        'Myvi': {
          variants: ['1.3 G', '1.5 X', '1.5 H', '1.5 AV'],
          type: 'Hatchback', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L Dual VVT-i', baseRate: 120, baseDep: 150,
          img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80'
        },
        'Ativa': {
          variants: ['1.0 Turbo X', '1.0 Turbo H', '1.0 Turbo AV'],
          type: 'SUV', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.0L 1KR-VET Turbo', baseRate: 160, baseDep: 200,
          img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80'
        },
        'Alza': {
          variants: ['1.5 X', '1.5 H', '1.5 AV'],
          type: 'MPV', seats: 7, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L 2NR-VE Dual VVT-i', baseRate: 180, baseDep: 220,
          img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80'
        },
        'Axia': {
          variants: ['1.0 G', '1.0 X', '1.0 SE', '1.0 AV'],
          type: 'Hatchback', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.0L 1KR-VE VVT-i', baseRate: 90, baseDep: 120,
          img: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=900&q=80'
        },
        'Bezza': {
          variants: ['1.0 G', '1.3 X', '1.3 AV'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.3L 1NR-VE Dual VVT-i', baseRate: 110, baseDep: 150,
          img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80'
        }
      }
    },
    'Honda': {
      models: {
        'City': {
          variants: ['1.5 S', '1.5 E', '1.5 V', '1.5 RS', 'e:HEV RS'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L DOHC i-VTEC', baseRate: 170, baseDep: 220,
          img: 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=900&q=80'
        },
        'Civic': {
          variants: ['1.5 Turbo E', '1.5 Turbo V', '1.5 Turbo RS', '2.0 e:HEV RS'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L VTEC Turbocharged', baseRate: 280, baseDep: 350,
          img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80'
        },
        'HR-V': {
          variants: ['1.5 S', '1.5 Turbo E', '1.5 Turbo V', 'e:HEV RS'],
          type: 'SUV', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L VTEC Turbo', baseRate: 260, baseDep: 320,
          img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80'
        },
        'CR-V': {
          variants: ['1.5 S', '1.5 E', '1.5 V AWD', '2.0 e:HEV RS'],
          type: 'SUV', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L Turbo 193PS', baseRate: 350, baseDep: 450,
          img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80'
        }
      }
    },
    'Toyota': {
      models: {
        'Vios': {
          variants: ['1.5 E', '1.5 G'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L 2NR-VE Dual VVT-i', baseRate: 160, baseDep: 200,
          img: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=900&q=80'
        },
        'Yaris': {
          variants: ['1.5 E', '1.5 G'],
          type: 'Hatchback', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '1.5L 2NR-FE', baseRate: 150, baseDep: 200,
          img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=900&q=80'
        },
        'Corolla Cross': {
          variants: ['1.8 G', '1.8 V', '1.8 Hybrid'],
          type: 'SUV', seats: 5, trans: 'Automatic', fuel: 'Hybrid', engine: '1.8L Dual VVT-i + Motor', baseRate: 280, baseDep: 350,
          img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80'
        },
        'Vellfire / Alphard': {
          variants: ['2.5 Executive Lounge', '2.4 Turbo', '3.5 V6'],
          type: 'Luxury MPV', seats: 7, trans: 'Automatic', fuel: 'Petrol', engine: '2.5L Dual VVT-i 182PS', baseRate: 650, baseDep: 800,
          img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=900&q=80'
        }
      }
    },
    'BMW': {
      models: {
        '3 Series (320i / 330i)': {
          variants: ['320i Sport', '330i M Sport', '330e M Sport'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '2.0L TwinPower Turbo', baseRate: 450, baseDep: 600,
          img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80'
        },
        '5 Series (520i / 530i)': {
          variants: ['520i M Sport', '530i M Sport', '530e M Sport'],
          type: 'Sedan', seats: 5, trans: 'Automatic', fuel: 'Petrol', engine: '2.0L BMW TwinPower Turbo', baseRate: 600, baseDep: 800,
          img: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=900&q=80'
        },
        'X5': {
          variants: ['xDrive40i M Sport', 'xDrive50e M Sport'],
          type: 'Luxury SUV', seats: 7, trans: 'Automatic', fuel: 'Hybrid', engine: '3.0L Inline-6 TwinPower Turbo', baseRate: 850, baseDep: 1000,
          img: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80'
        }
      }
    }
  };

  // State Management
  function getDraft() {
    try {
      return JSON.parse(localStorage.getItem(DRAFT_KEY) || '{}');
    } catch (e) {
      return {};
    }
  }

  async function syncDraftToSupabase(draft) {
    if (window.WeDriveAPI && typeof window.WeDriveAPI.saveCarDraft === 'function') {
      try {
        const res = await window.WeDriveAPI.saveCarDraft(draft);
        if (res && res.data && res.data.id) {
          try {
            const curRaw = localStorage.getItem(DRAFT_KEY);
            const cur = curRaw ? JSON.parse(curRaw) : {};
            cur.supabase_draft_id = res.data.id;
            localStorage.setItem(DRAFT_KEY, JSON.stringify(cur));
          } catch (_) {}
        }
        return res;
      } catch (err) {
        console.warn('[WeDRIVE Flow] Sync draft to Supabase warning:', err);
      }
    }
    return null;
  }

  function setDraft(data) {
    try {
      const current = getDraft();
      const updated = { ...current, ...data, updatedAt: Date.now() };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
      syncDraftToSupabase(updated);
      return updated;
    } catch (e) {
      console.warn('[WeDRIVE] Draft save error:', e);
      return {};
    }
  }

  function clearDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY);
    } catch (e) {}
  }

  // Common Notification Toast
  function showPillToast(msg, type = 'success') {
    const existing = document.getElementById('wedrive-pill-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'wedrive-pill-toast';
    toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 z-50 pill-btn px-5 py-2.5 glass-panel border shadow-2xl flex items-center gap-3 transition-all duration-300 animate-bounce';
    
    const icon = type === 'success' ? 'check_circle' : (type === 'error' ? 'error' : 'info');
    const color = type === 'success' ? '#34C759' : (type === 'error' ? '#FF3B30' : '#0071E3');

    toast.innerHTML = `
      <span class="circle-1-1 w-6 h-6 text-white text-[14px]" style="background-color: ${color};">
        <span class="material-symbols-outlined text-[16px]">${icon}</span>
      </span>
      <span class="font-headline text-[13px] font-bold text-on-surface">${msg}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translate(-50%, -20px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // 360 Exterior Frames Generator
  function getSample360Frames() {
    return [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80'
    ];
  }

  // Export globally
  window.WeDriveAddCar = {
    CATALOG: CAR_CATALOG,
    getDraft: getDraft,
    setDraft: setDraft,
    clearDraft: clearDraft,
    syncDraftToSupabase: syncDraftToSupabase,
    showToast: showPillToast,
    getSample360Frames: getSample360Frames,
    navigateTo: function (stepFile) {
      window.location.href = stepFile;
    }
  };

})();
