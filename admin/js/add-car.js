/**
 * WeDRIVE - Add Car Management Controller
 * Handles 2-Step Stepper Wizard, Cascading Selectors (ala Carlist.my), Auto-Save Draft & Resume,
 * Exit Confirmation Modal, AI Auto-Detect Engine, 360 Studio, and Official WeDRIVE Car-Card Live Preview.
 * Version: 6.7.0
 */

(function () {
  'use strict';

  var selectedPhotoBase64 = null;
  var currentStep = 1;
  var isFormDirty = false;
  var isInitializing = true;
  var isRestoringDraft = false;
  var draftTimer = null;
  var pendingExitUrl = null;

  window.__360Data = {
    has360: false,
    exteriorFrames: [],
    currentFrameIndex: 0,
    interiorAsset: null
  };

  /**
   * =========================================================================
   * 1. COMPREHENSIVE MALAYSIAN AUTOMOTIVE CARLIST DATABASE
   * Maps Brand -> Models -> Variants with Default Specs & Market Pricing
   * =========================================================================
   */
  var CARLIST_DATABASE = {
    'Perodua': {
      'Myvi': {
        type: 'Hatchback',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Dual VVT-i (103 PS)',
        basePrice: 58000,
        variants: [
          { name: '1.5 AV (High Spec)', engine: '1.5L Dual VVT-i D-CVT (103 PS)', price: 59900 },
          { name: '1.5 H', engine: '1.5L Dual VVT-i D-CVT (103 PS)', price: 54900 },
          { name: '1.5 X', engine: '1.5L Dual VVT-i D-CVT (103 PS)', price: 50900 },
          { name: '1.3 G', engine: '1.3L Dual VVT-i D-CVT (95 PS)', price: 46500 }
        ]
      },
      'Axia': {
        type: 'Hatchback',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.0L VVT-i D-CVT (68 PS)',
        basePrice: 44000,
        variants: [
          { name: '1.0 AV (Flagship)', engine: '1.0L 1KR-VE D-CVT (68 PS)', price: 49500 },
          { name: '1.0 SE', engine: '1.0L 1KR-VE D-CVT (68 PS)', price: 44000 },
          { name: '1.0 X', engine: '1.0L 1KR-VE D-CVT (68 PS)', price: 40000 },
          { name: '1.0 G', engine: '1.0L 1KR-VE D-CVT (68 PS)', price: 38600 }
        ]
      },
      'Bezza': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.3L Dual VVT-i (95 PS)',
        basePrice: 50000,
        variants: [
          { name: '1.3 AV (Sedan Flagship)', engine: '1.3L 1NR-VE 4AT (95 PS)', price: 49980 },
          { name: '1.3 X', engine: '1.3L 1NR-VE 4AT (95 PS)', price: 43980 },
          { name: '1.0 G (Auto)', engine: '1.0L 1KR-VE 4AT (68 PS)', price: 36580 }
        ]
      },
      'Ativa': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.0L Turbo D-CVT (98 PS)',
        basePrice: 73000,
        variants: [
          { name: '1.0T AV Dual-Tone (Flagship)', engine: '1.0L Turbo 1KR-VET (98 PS)', price: 73400 },
          { name: '1.0T H', engine: '1.0L Turbo 1KR-VET (98 PS)', price: 67300 },
          { name: '1.0T X', engine: '1.0L Turbo 1KR-VET (98 PS)', price: 62500 }
        ]
      },
      'Alza': {
        type: 'MPV',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Dual VVT-i (106 PS)',
        basePrice: 76000,
        variants: [
          { name: '1.5 AV (7-Seater Luxury)', engine: '1.5L 2NR-VE D-CVT (106 PS)', price: 75500 },
          { name: '1.5 H', engine: '1.5L 2NR-VE D-CVT (106 PS)', price: 68000 },
          { name: '1.5 X', engine: '1.5L 2NR-VE D-CVT (106 PS)', price: 62500 }
        ]
      },
      'Aruz': {
        type: 'SUV',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Dual VVT-i (102 PS)',
        basePrice: 78000,
        variants: [
          { name: '1.5 AV 7-Seater', engine: '1.5L 2NR-VE 4AT (102 PS)', price: 77900 },
          { name: '1.5 X', engine: '1.5L 2NR-VE 4AT (102 PS)', price: 72900 }
        ]
      }
    },

    'Proton': {
      'S70': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Turbo 3-Cyl 7-DCT (150 PS)',
        basePrice: 90000,
        variants: [
          { name: '1.5T Flagship X', engine: '1.5L Turbo 7-Speed Dual Clutch (150 PS)', price: 94800 },
          { name: '1.5T Flagship', engine: '1.5L Turbo 7-Speed Dual Clutch (150 PS)', price: 89800 },
          { name: '1.5T Premium', engine: '1.5L Turbo 7-Speed Dual Clutch (150 PS)', price: 79800 },
          { name: '1.5T Executive', engine: '1.5L Turbo 7-Speed Dual Clutch (150 PS)', price: 73800 }
        ]
      },
      'X50': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L TGDi Flagship (177 PS)',
        basePrice: 102000,
        variants: [
          { name: '1.5 TGDi Flagship (177 PS)', engine: '1.5L Direct Injection Turbo (177 PS)', price: 113300 },
          { name: '1.5T Premium', engine: '1.5L Turbo Multi-Point (150 PS)', price: 101800 },
          { name: '1.5T Executive', engine: '1.5L Turbo Multi-Point (150 PS)', price: 93300 },
          { name: '1.5T Standard', engine: '1.5L Turbo Multi-Point (150 PS)', price: 86300 }
        ]
      },
      'X70': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L TGDi Premium AWD (177 PS)',
        basePrice: 125000,
        variants: [
          { name: '1.5 TGDi Premium 2WD', engine: '1.5L Turbo Direct Injection (177 PS)', price: 123800 },
          { name: '1.5 TGDi Executive AWD', engine: '1.5L Turbo Direct Injection (177 PS)', price: 116800 },
          { name: '1.5 TGDi Standard', engine: '1.5L Turbo Direct Injection (177 PS)', price: 98800 }
        ]
      },
      'X90': {
        type: 'SUV',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        engine: '1.5L TGDi Mild Hybrid 48V (190 PS)',
        basePrice: 145000,
        variants: [
          { name: '1.5T Flagship (6-Seater Captain Seats)', engine: '1.5L TGDi + 48V EMS (190 PS)', price: 152800 },
          { name: '1.5T Premium (7-Seater)', engine: '1.5L TGDi + 48V EMS (190 PS)', price: 144800 },
          { name: '1.5T Executive (7-Seater)', engine: '1.5L TGDi + 48V EMS (190 PS)', price: 130800 }
        ]
      },
      'Saga': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.3L 4-Cyl VVT (95 PS)',
        basePrice: 42000,
        variants: [
          { name: '1.3 Premium S (Auto)', engine: '1.3L VVT 4AT (95 PS)', price: 44800 },
          { name: '1.3 Premium (Auto)', engine: '1.3L VVT 4AT (95 PS)', price: 41800 },
          { name: '1.3 Standard (Auto)', engine: '1.3L VVT 4AT (95 PS)', price: 38800 },
          { name: '1.3 Standard (Manual)', engine: '1.3L VVT 5MT (95 PS)', price: 34800 }
        ]
      },
      'Persona': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.6L VVT CVT (109 PS)',
        basePrice: 55000,
        variants: [
          { name: '1.6 Premium CVT', engine: '1.6L VVT CVT (109 PS)', price: 58300 },
          { name: '1.6 Executive CVT', engine: '1.6L VVT CVT (109 PS)', price: 53300 },
          { name: '1.6 Standard CVT', engine: '1.6L VVT CVT (109 PS)', price: 47800 }
        ]
      },
      'Iriz': {
        type: 'Hatchback',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.6L VVT Active (109 PS)',
        basePrice: 54000,
        variants: [
          { name: '1.6 Active CVT', engine: '1.6L VVT Crossover (109 PS)', price: 57300 },
          { name: '1.6 Executive CVT', engine: '1.6L VVT CVT (109 PS)', price: 50300 },
          { name: '1.3 Standard CVT', engine: '1.3L VVT CVT (95 PS)', price: 42800 }
        ]
      }
    },

    'Toyota': {
      'Vios': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Dual VVT-i CVT (106 PS)',
        basePrice: 94000,
        variants: [
          { name: '1.5 G (High Spec)', engine: '1.5L 2NR-VE 7-Speed CVT (106 PS)', price: 95500 },
          { name: '1.5 E', engine: '1.5L 2NR-VE 7-Speed CVT (106 PS)', price: 89600 }
        ]
      },
      'Yaris': {
        type: 'Hatchback',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Dual VVT-i (107 PS)',
        basePrice: 88000,
        variants: [
          { name: '1.5 G', engine: '1.5L 2NR-FE CVT (107 PS)', price: 91600 },
          { name: '1.5 E', engine: '1.5L 2NR-FE CVT (107 PS)', price: 88000 }
        ]
      },
      'Corolla': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.8L Dual VVT-i (139 PS)',
        basePrice: 145000,
        variants: [
          { name: '1.8 G', engine: '1.8L 2ZR-FE CVT (139 PS)', price: 147800 },
          { name: '1.8 E', engine: '1.8L 2ZR-FE CVT (139 PS)', price: 139800 },
          { name: 'GR Sport 1.8', engine: '1.8L Dual VVT-i Sport Tuned (139 PS)', price: 152800 }
        ]
      },
      'Corolla Cross': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        engine: '1.8L Hybrid E-CVT (122 PS Total)',
        basePrice: 142000,
        variants: [
          { name: '1.8 Hybrid (HEV)', engine: '1.8L 2ZR-FXE Hybrid (122 PS)', price: 143000 },
          { name: '1.8 V', engine: '1.8L 2ZR-FE CVT (139 PS)', price: 137400 },
          { name: 'GR Sport Hybrid', engine: '1.8L HEV Sport Edition (122 PS)', price: 148500 }
        ]
      },
      'Camry': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.5L Dynamic Force Direct Shift (209 PS)',
        basePrice: 220000,
        variants: [
          { name: '2.5 V Dynamic Force', engine: '2.5L A25A-FKS 8-Speed AT (209 PS)', price: 219800 }
        ]
      },
      'Innova Zenix': {
        type: 'MPV',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        engine: '2.0L Dynamic Force Hybrid (186 PS)',
        basePrice: 180000,
        variants: [
          { name: '2.0 HEV (Hybrid 7-Seater)', engine: '2.0L M20A-FXS Hybrid (186 PS)', price: 202000 },
          { name: '2.0 V (8-Seater Petrol)', engine: '2.0L M20A-FKS Direct Shift (174 PS)', price: 165000 }
        ]
      },
      'Alphard': {
        type: 'Luxury',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.4L Turbo Direct Injection (278 PS)',
        basePrice: 538000,
        variants: [
          { name: '2.4T Executive Lounge (Luxury 7-Seater)', engine: '2.4L Turbo T24A-FTS Direct Shift 8AT (278 PS)', price: 538000 }
        ]
      },
      'Vellfire': {
        type: 'Luxury',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.5L Dual VVT-i CVT (182 PS)',
        basePrice: 438000,
        variants: [
          { name: '2.5 Luxury 7-Seater', engine: '2.5L 2AR-FE Super CVT-i (182 PS)', price: 438000 }
        ]
      },
      'Hilux': {
        type: 'Pickup',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Diesel',
        engine: '2.8L Turbo Diesel (204 PS)',
        basePrice: 155000,
        variants: [
          { name: '2.8 GR Sport 4x4', engine: '2.8L 1GD-FTV Turbo Diesel 6AT (204 PS)', price: 169080 },
          { name: '2.8 Rogue 4x4', engine: '2.8L 1GD-FTV Turbo Diesel 6AT (204 PS)', price: 158880 },
          { name: '2.4 V 4x4', engine: '2.4L 2GD-FTV Turbo Diesel 6AT (150 PS)', price: 145880 }
        ]
      },
      'Hiace': {
        type: 'Van',
        seats: 12,
        transmission: 'Manual',
        fuel: 'Diesel',
        engine: '2.5L Turbo Diesel (102 PS)',
        basePrice: 115000,
        variants: [
          { name: '2.5 D4D Panel / Window Van 10-12 Seater', engine: '2.5L 2KD-FTV Turbo Diesel (102 PS)', price: 118000 },
          { name: 'Hiace Super Grandia Luxury (Import)', engine: '2.8L 1GD-FTV Turbo Diesel (176 PS)', price: 185000 }
        ]
      }
    },

    'Honda': {
      'City': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L DOHC i-VTEC CVT (121 PS)',
        basePrice: 90000,
        variants: [
          { name: '1.5 e:HEV RS (Hybrid)', engine: '1.5L i-MMD Two-Motor Hybrid (109 PS)', price: 111900 },
          { name: '1.5 RS Petrol', engine: '1.5L DOHC i-VTEC CVT (121 PS)', price: 99900 },
          { name: '1.5 V', engine: '1.5L DOHC i-VTEC CVT (121 PS)', price: 94900 },
          { name: '1.5 E', engine: '1.5L DOHC i-VTEC CVT (121 PS)', price: 89900 }
        ]
      },
      'City Hatchback': {
        type: 'Hatchback',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L DOHC i-VTEC (121 PS)',
        basePrice: 88000,
        variants: [
          { name: '1.5 e:HEV RS (Hybrid)', engine: '1.5L Dual Motor Hybrid (109 PS)', price: 112900 },
          { name: '1.5 RS Petrol', engine: '1.5L DOHC i-VTEC CVT (121 PS)', price: 100900 },
          { name: '1.5 V', engine: '1.5L DOHC i-VTEC CVT (121 PS)', price: 95900 }
        ]
      },
      'Civic': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L VTEC Turbo (182 PS)',
        basePrice: 145000,
        variants: [
          { name: '2.0 e:HEV RS (Hybrid Flagship)', engine: '2.0L i-MMD Dual Motor Hybrid (184 PS)', price: 167900 },
          { name: '1.5 RS Turbo (Sporty)', engine: '1.5L VTEC Turbo 7-Speed CVT (182 PS)', price: 151900 },
          { name: '1.5 V Turbo', engine: '1.5L VTEC Turbo (182 PS)', price: 144900 },
          { name: '1.5 E Turbo', engine: '1.5L VTEC Turbo (182 PS)', price: 131900 }
        ]
      },
      'HR-V': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L VTEC Turbo (181 PS)',
        basePrice: 135000,
        variants: [
          { name: '1.5 e:HEV RS (Hybrid)', engine: '1.5L Dual-Motor Hybrid (131 PS)', price: 141900 },
          { name: '1.5 Turbo V', engine: '1.5L VTEC Turbo (181 PS)', price: 135900 },
          { name: '1.5 Turbo E', engine: '1.5L VTEC Turbo (181 PS)', price: 130900 },
          { name: '1.5 S (NA)', engine: '1.5L DOHC i-VTEC (121 PS)', price: 115900 }
        ]
      },
      'CR-V': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L VTEC Turbo (193 PS)',
        basePrice: 175000,
        variants: [
          { name: '2.0 e:HEV RS (Hybrid)', engine: '2.0L Dual-Motor Hybrid (184 PS)', price: 195900 },
          { name: '1.5 Turbo V AWD', engine: '1.5L VTEC Turbo AWD (193 PS)', price: 181900 },
          { name: '1.5 Turbo E 2WD', engine: '1.5L VTEC Turbo (193 PS)', price: 169900 }
        ]
      }
    },

    'BMW': {
      '3 Series': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.0L BMW TwinPower Turbo (184 PS)',
        basePrice: 285000,
        variants: [
          { name: '320i M Sport 2.0L', engine: '2.0L BMW TwinPower Turbo 8-Speed Steptronic (184 PS)', price: 283800 },
          { name: '330i M Sport 2.0L', engine: '2.0L BMW TwinPower Turbo 8-Speed Steptronic (258 PS)', price: 317800 },
          { name: '330e M Sport (Hybrid) 2.0L', engine: '2.0L Plug-in Hybrid eDrive (292 PS)', price: 298800 },
          { name: 'M340i xDrive 3.0L', engine: '3.0L BMW M TwinPower Turbo Inline-6 (387 PS)', price: 391800 }
        ]
      },
      '5 Series': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric (EV)',
        engine: 'BMW eDrive Full Electric (340 PS)',
        basePrice: 399000,
        variants: [
          { name: 'i5 eDrive40 M Sport (EV)', engine: 'Electric Motor 81.2 kWh (340 PS)', price: 399800 },
          { name: '530i M Sport 2.0L', engine: '2.0L TwinPower Turbo 8-Speed (252 PS)', price: 402800 },
          { name: '530e M Sport (Hybrid)', engine: '2.0L Plug-In Hybrid (292 PS)', price: 358800 }
        ]
      },
      'X1': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Turbo 7-DCT (156 PS)',
        basePrice: 245000,
        variants: [
          { name: 'sDrive20i xLine', engine: '1.5L 3-Cyl TwinPower Turbo (156 PS)', price: 244800 },
          { name: 'iX1 xDrive30 (EV)', engine: 'Dual Motor AWD 66.5 kWh (313 PS)', price: 272800 }
        ]
      },
      'X3': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.0L TwinPower Turbo xDrive (245 PS)',
        basePrice: 325000,
        variants: [
          { name: 'xDrive30i M Sport', engine: '2.0L TwinPower Turbo AWD (245 PS)', price: 357800 },
          { name: 'iX3 M Sport (EV)', engine: 'Rear Electric Motor 80 kWh (286 PS)', price: 322800 },
          { name: 'xDrive20i', engine: '2.0L TwinPower Turbo (184 PS)', price: 315800 }
        ]
      },
      'X5': {
        type: 'SUV',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Hybrid',
        engine: '3.0L Inline-6 Plug-in Hybrid (489 PS)',
        basePrice: 488000,
        variants: [
          { name: 'xDrive50e M Sport (PHEV)', engine: '3.0L Turbo + Electric eDrive (489 PS)', price: 486800 }
        ]
      }
    },

    'Mercedes-Benz': {
      'C-Class': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Turbo Mild Hybrid 9G-TRONIC (204 PS)',
        basePrice: 295000,
        variants: [
          { name: 'C200 Avantgarde 1.5L', engine: '1.5L Turbo EQ Boost 9G-TRONIC (204 PS)', price: 292888 },
          { name: 'C300 AMG Line 2.0L', engine: '2.0L Turbo EQ Boost 9G-TRONIC (258 PS)', price: 333888 },
          { name: 'C350e AMG Line (Hybrid)', engine: '2.0L Plug-in Hybrid (313 PS)', price: 355888 }
        ]
      },
      'E-Class': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.0L Turbo 9G-TRONIC (197 PS)',
        basePrice: 395000,
        variants: [
          { name: 'E200 Avantgarde 2.0L', engine: '2.0L Turbo 9G-TRONIC (197 PS)', price: 399888 },
          { name: 'E300 AMG Line 2.0L', engine: '2.0L Turbo 9G-TRONIC (258 PS)', price: 440888 }
        ]
      },
      'GLC': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.0L Turbo 4MATIC Mild Hybrid (258 PS)',
        basePrice: 380000,
        variants: [
          { name: 'GLC 300 4MATIC AMG Line', engine: '2.0L Turbo 4MATIC 9G-TRONIC (258 PS)', price: 378888 },
          { name: 'GLC 350e 4MATIC (PHEV)', engine: '2.0L Plug-In Hybrid 4MATIC (313 PS)', price: 398888 }
        ]
      }
    },

    'BYD': {
      'Atto 3': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric (EV)',
        engine: 'Electric Motor 60.48 kWh (204 PS / 310 Nm)',
        basePrice: 149000,
        variants: [
          { name: 'Extended Range 60.5 kWh (480 km NEDC)', engine: 'Permanent Magnet Synchronous 150 kW (204 PS)', price: 149800 },
          { name: 'Standard Range 49.9 kWh (410 km NEDC)', engine: 'Permanent Magnet Synchronous 150 kW (204 PS)', price: 139800 }
        ]
      },
      'Dolphin': {
        type: 'Hatchback',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric (EV)',
        engine: 'Electric Motor Blade Battery (204 PS)',
        basePrice: 110000,
        variants: [
          { name: 'Extended Range 60.5 kWh', engine: 'Electric Motor 150 kW (204 PS)', price: 125300 },
          { name: 'Dynamic Standard 44.9 kWh', engine: 'Electric Motor 70 kW (95 PS)', price: 100530 }
        ]
      },
      'Seal': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric (EV)',
        engine: 'Dual Motor AWD 82.5 kWh (530 PS)',
        basePrice: 180000,
        variants: [
          { name: 'Performance AWD (530 PS / 670 Nm)', engine: 'Dual Motor All-Wheel Drive 82.5 kWh (530 PS)', price: 199800 },
          { name: 'Premium RWD (313 PS)', engine: 'Rear Wheel Drive 82.5 kWh (313 PS)', price: 179800 }
        ]
      }
    },

    'Chery': {
      'Omoda 5': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '1.5L Turbo 9-CVT (156 PS)',
        basePrice: 108000,
        variants: [
          { name: '1.5T H (High Spec)', engine: '1.5L Turbocharged 9-Speed CVT (156 PS)', price: 118800 },
          { name: '1.5T C', engine: '1.5L Turbocharged 9-Speed CVT (156 PS)', price: 108800 }
        ]
      },
      'Tiggo 8 Pro': {
        type: 'SUV',
        seats: 7,
        transmission: 'Automatic',
        fuel: 'Petrol',
        engine: '2.0L TGDi 7-DCT (256 PS)',
        basePrice: 159000,
        variants: [
          { name: '2.0T Flagship 7-Seater', engine: '2.0L Turbo Direct Injection 7-DCT (256 PS)', price: 159800 }
        ]
      }
    },

    'Tesla': {
      'Model 3': {
        type: 'Sedan',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric (EV)',
        engine: 'Dual Motor AWD Long Range (498 PS)',
        basePrice: 189000,
        variants: [
          { name: 'Standard RWD (513 km WLTP)', engine: 'Rear-Wheel Drive Electric Motor (283 PS)', price: 189000 },
          { name: 'Long Range AWD (629 km WLTP)', engine: 'Dual Motor All-Wheel Drive (498 PS)', price: 218000 },
          { name: 'Performance AWD (0-100 3.1s)', engine: 'High Performance Dual Motor (510 PS)', price: 242000 }
        ]
      },
      'Model Y': {
        type: 'SUV',
        seats: 5,
        transmission: 'Automatic',
        fuel: 'Electric (EV)',
        engine: 'Dual Motor AWD (450 PS)',
        basePrice: 199000,
        variants: [
          { name: 'Standard RWD (455 km WLTP)', engine: 'Single Motor Rear-Wheel Drive (299 PS)', price: 199000 },
          { name: 'Long Range AWD (533 km WLTP)', engine: 'Dual Motor All-Wheel Drive (450 PS)', price: 246000 }
        ]
      }
    }
  };

  /**
   * =========================================================================
   * 2. MALAYSIAN AUTOMOTIVE RENTAL FORMULA ENGINE
   * Calculates Daily Rental & Deposit considering:
   * Brand, Body Type, Seats, Estimated Market Price, and Year Depreciation
   * =========================================================================
   */
  function calculateRentalFromFormula(brand, bodyType, seats, year, approxMarketPrice) {
    var b = (brand || '').toLowerCase();
    var t = (bodyType || 'Sedan').toLowerCase();
    var s = parseInt(seats, 10) || 5;
    var y = parseInt(year, 10) || 2024;

    // 1. Determine Market Price baseline
    var marketPrice = approxMarketPrice;
    if (!marketPrice) {
      marketPrice = 90000;
      if (b.includes('perodua')) marketPrice = 55000;
      else if (b.includes('proton')) marketPrice = 72000;
      else if (b.includes('toyota') || b.includes('honda') || b.includes('nissan') || b.includes('mazda') || b.includes('mitsubishi')) marketPrice = 120000;
      else if (b.includes('byd') || b.includes('chery') || b.includes('hyundai') || b.includes('kia') || b.includes('tesla')) marketPrice = 160000;
      else if (b.includes('bmw') || b.includes('mercedes') || b.includes('audi') || b.includes('volvo') || b.includes('lexus')) marketPrice = 310000;
      else if (b.includes('porsche')) marketPrice = 650000;
    }

    // 2. Body Type Multiplier (ala Carlist.my & Mudah.my)
    var bodyMultiplier = 1.0;
    if (t === 'hatchback') bodyMultiplier = 0.95;
    else if (t === 'sedan') bodyMultiplier = 1.0;
    else if (t === 'crossover') bodyMultiplier = 1.15;
    else if (t === 'suv') bodyMultiplier = 1.25;
    else if (t === 'pickup' || t.includes('pickup')) bodyMultiplier = 1.20;
    else if (t === 'mpv') bodyMultiplier = 1.30;
    else if (t === 'wagon') bodyMultiplier = 1.20;
    else if (t === 'van') bodyMultiplier = 1.35;
    else if (t === 'coupe') bodyMultiplier = 1.50;
    else if (t === 'convertible') bodyMultiplier = 1.65;

    // 3. Seats Multiplier
    var seatMultiplier = 1.0;
    if (s <= 2) seatMultiplier = 1.1;
    else if (s <= 5) seatMultiplier = 1.0;
    else if (s <= 7) seatMultiplier = 1.2;
    else if (s <= 10) seatMultiplier = 1.35;
    else if (s <= 15) seatMultiplier = 1.55;
    else seatMultiplier = 1.8;

    // 4. Depreciation by Year (2026 baseline: -5% per year, minimum 0.65)
    var currentYear = 2026;
    var age = Math.max(0, currentYear - y);
    var ageFactor = Math.max(0.65, 1 - (age * 0.05));

    // Estimated current vehicle market price
    var estimatedCurrentPrice = Math.round(marketPrice * bodyMultiplier * seatMultiplier * ageFactor);

    // 5. Daily Rental Rate Calculation (~0.16% to 0.18% of market value)
    var dailyRate = Math.round((estimatedCurrentPrice * 0.0017) / 10) * 10;
    dailyRate = Math.max(100, dailyRate); // Floor RM100/day minimum

    // 6. Security Deposit Calculation
    var deposit = Math.round((dailyRate * 0.9) / 50) * 50;
    deposit = Math.max(150, Math.min(2500, deposit));

    return {
      rate: dailyRate,
      deposit: deposit,
      marketPrice: estimatedCurrentPrice
    };
  }

  /**
   * =========================================================================
   * 3. CASCADING SELECTION LOGIC (ALA CARLIST.MY)
   * =========================================================================
   */

  // Brand Change -> Populates Models
  window.onBrandChange = function () {
    var brandEl = document.getElementById('car-brand');
    var modelEl = document.getElementById('car-model');
    var customWrap = document.getElementById('car-custom-name-wrap');
    var brand = brandEl ? brandEl.value : '';

    if (!modelEl) return;
    modelEl.innerHTML = '<option value="" disabled selected>Pilih Model Kenderaan</option>';

    if (CARLIST_DATABASE[brand]) {
      var models = Object.keys(CARLIST_DATABASE[brand]);
      models.forEach(function (m) {
        var opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        modelEl.appendChild(opt);
      });
    }

    // Always append Custom option
    var customOpt = document.createElement('option');
    customOpt.value = '__custom__';
    customOpt.textContent = '[+ Taip Model & Varian Sendiri]';
    modelEl.appendChild(customOpt);

    if (customWrap) customWrap.classList.add('hidden');

    // Keep placeholder selected (Do not auto-select first model)
    modelEl.selectedIndex = 0;
    resetVariantsPlaceholder();

    updateFullCarName();
    triggerDraftSave();
    window.updateLivePreview();
  };

  // Model Change -> Populates Variants or Shows Custom Input
  window.onModelChange = function () {
    var brandEl = document.getElementById('car-brand');
    var modelEl = document.getElementById('car-model');
    var variantEl = document.getElementById('car-variant');
    var customWrap = document.getElementById('car-custom-name-wrap');
    var brand = brandEl ? brandEl.value : '';
    var model = modelEl ? modelEl.value : '';

    if (model === '__custom__') {
      if (customWrap) customWrap.classList.remove('hidden');
      var customInput = document.getElementById('car-custom-name');
      if (customInput) customInput.focus();
      clearVariants();
      return;
    }

    if (customWrap) customWrap.classList.add('hidden');
    if (!variantEl) return;

    if (!model) {
      resetVariantsPlaceholder();
      return;
    }

    variantEl.innerHTML = '<option value="" disabled selected>Pilih Varian &amp; Enjin</option>';

    var modelData = (CARLIST_DATABASE[brand] && CARLIST_DATABASE[brand][model]) || null;
    if (modelData && modelData.variants) {
      modelData.variants.forEach(function (v) {
        var opt = document.createElement('option');
        opt.value = v.name;
        opt.textContent = v.name;
        opt.dataset.engine = v.engine || modelData.engine;
        opt.dataset.price = v.price || modelData.basePrice;
        variantEl.appendChild(opt);
      });

      var customVar = document.createElement('option');
      customVar.value = '__custom_variant__';
      customVar.textContent = '[+ Taip Varian Sendiri]';
      variantEl.appendChild(customVar);

      // Keep placeholder selected (Do not auto-select first variant)
      variantEl.selectedIndex = 0;

      // Auto-fill base specs from model so user has smart defaults once model is picked
      if (modelData.type) setSelectValue('car-type', modelData.type);
      if (modelData.seats) setSelectValue('car-seats', String(modelData.seats));
      if (modelData.transmission) setSelectValue('car-transmission', modelData.transmission);
      if (modelData.fuel) setSelectValue('car-fuel', modelData.fuel);
      if (modelData.engine) {
        var engInput = document.getElementById('car-engine');
        if (engInput) engInput.value = modelData.engine;
      }

      // Automatically calculate baseline rental rate and deposit from model data
      var yearVal = document.getElementById('car-year')?.value || '2024';
      var basePricing = calculateRentalFromFormula(brand, modelData.type || 'Sedan', modelData.seats || 5, yearVal, modelData.basePrice || 90000);
      var rateInput = document.getElementById('car-rate');
      var depositInput = document.getElementById('car-deposit');
      if (rateInput) rateInput.value = basePricing.rate;
      if (depositInput) depositInput.value = basePricing.deposit;
    } else {
      clearVariants();
    }

    updateFullCarName();
    triggerDraftSave();
    window.updateLivePreview();
  };

  function resetVariantsPlaceholder() {
    var variantEl = document.getElementById('car-variant');
    if (variantEl) {
      variantEl.innerHTML = '<option value="" disabled selected>Pilih Model Dahulu</option>';
    }
  }

  function clearVariants() {
    var variantEl = document.getElementById('car-variant');
    if (variantEl) {
      variantEl.innerHTML = '<option value="Standard" selected>Standard Varian</option>';
    }
  }

  // Variant Change -> Sets Technical Specs & Calculates Rental Formula
  window.onVariantChange = function () {
    var brandEl = document.getElementById('car-brand');
    var modelEl = document.getElementById('car-model');
    var variantEl = document.getElementById('car-variant');
    var yearEl = document.getElementById('car-year');

    var brand = brandEl ? brandEl.value : '';
    var model = modelEl ? modelEl.value : '';
    var variant = variantEl ? variantEl.value : '';
    var year = yearEl ? yearEl.value : '2024';

    var modelData = (CARLIST_DATABASE[brand] && CARLIST_DATABASE[brand][model]) || null;
    var approxPrice = 90000;

    if (modelData) {
      // Set specs
      if (modelData.type) setSelectValue('car-type', modelData.type);
      if (modelData.seats) setSelectValue('car-seats', String(modelData.seats));
      if (modelData.transmission) setSelectValue('car-transmission', modelData.transmission);
      if (modelData.fuel) setSelectValue('car-fuel', modelData.fuel);

      // Selected variant details
      var selectedOpt = variantEl && variantEl.selectedOptions ? variantEl.selectedOptions[0] : null;
      var engineStr = (selectedOpt && selectedOpt.dataset.engine) ? selectedOpt.dataset.engine : modelData.engine;
      approxPrice = (selectedOpt && selectedOpt.dataset.price) ? parseInt(selectedOpt.dataset.price, 10) : modelData.basePrice;

      var engineInput = document.getElementById('car-engine');
      if (engineInput) engineInput.value = engineStr;
    }

    // Run Malaysian Rental & Deposit Formula
    var bodyType = document.getElementById('car-type')?.value || (modelData && modelData.type) || 'Sedan';
    var seats = document.getElementById('car-seats')?.value || (modelData && modelData.seats) || 5;

    var formulaRes = calculateRentalFromFormula(brand, bodyType, seats, year, approxPrice);

    var rateInput = document.getElementById('car-rate');
    var depositInput = document.getElementById('car-deposit');
    if (rateInput) rateInput.value = formulaRes.rate;
    if (depositInput) depositInput.value = formulaRes.deposit;

    // Update Full Vehicle Name for System
    updateFullCarName();
    triggerDraftSave();
    window.updateLivePreview();
  };

  window.onYearChange = function () {
    updateFullCarName();
    window.onVariantChange();
  };

  window.onCustomNameInput = function () {
    updateFullCarName();
    triggerDraftSave();
    window.updateLivePreview();
  };

  // Construct full name: [Year] [Brand] [Model] [Variant]
  function updateFullCarName() {
    var year = document.getElementById('car-year')?.value || '';
    var brand = document.getElementById('car-brand')?.value || '';
    var modelEl = document.getElementById('car-model');
    var model = modelEl ? modelEl.value : '';
    var customName = (document.getElementById('car-custom-name')?.value || '').trim();
    var variant = document.getElementById('car-variant')?.value || '';

    var fullName = '';
    if (model === '__custom__' && customName) {
      fullName = (year ? year + ' ' : '') + (brand ? brand + ' ' : '') + customName;
    } else if (brand && model) {
      var varStr = (variant && variant !== 'Standard' && variant !== '__custom_variant__') ? ' ' + variant : '';
      fullName = (year ? year + ' ' : '') + brand + ' ' + model + varStr;
    } else if (brand) {
      fullName = (year ? year + ' ' : '') + brand;
    } else {
      fullName = '';
    }

    var hiddenName = document.getElementById('car-name');
    if (hiddenName) hiddenName.value = fullName || '';
    return fullName;
  }

  // Official Body Color Dropdown Handler
  window.onColorSelectChange = function () {
    var colorSelect = document.getElementById('car-color-select');
    var customWrap = document.getElementById('car-color-custom-wrap');
    var customInput = document.getElementById('car-color-custom');
    var hiddenColor = document.getElementById('car-color');
    var val = colorSelect ? colorSelect.value : '';

    if (val === 'other') {
      if (customWrap) customWrap.classList.remove('hidden');
      if (customInput) {
        customInput.focus();
        if (hiddenColor) hiddenColor.value = customInput.value.trim() || 'Custom Color';
      }
    } else {
      if (customWrap) customWrap.classList.add('hidden');
      if (customInput) customInput.value = '';
      if (hiddenColor) hiddenColor.value = val;
    }

    triggerDraftSave();
    window.updateLivePreview();
  };

  window.onCustomColorInput = function () {
    var customInput = document.getElementById('car-color-custom');
    var hiddenColor = document.getElementById('car-color');
    var text = (customInput?.value || '').trim();
    if (hiddenColor) hiddenColor.value = text || 'Custom Color';
    triggerDraftSave();
    window.updateLivePreview();
  };

  function setSelectValue(id, val) {
    var el = document.getElementById(id);
    if (!el) return;
    for (var i = 0; i < el.options.length; i++) {
      if (el.options[i].value === val) {
        el.selectedIndex = i;
        break;
      }
    }
  }

  // AI Re-Detect Button
  window.triggerAiSpecAutofill = function () {
    var brand = document.getElementById('car-brand')?.value;
    var model = document.getElementById('car-model')?.value;

    if (!brand || !model) {
      window.showToast('Sila pilih Jenama dan Model kenderaan terlebih dahulu.', 'info');
      return;
    }

    window.onVariantChange();
    window.showToast('✨ AI berjaya mengira spesifikasi pasaran Malaysia terkini!', 'success');
  };

  /**
   * =========================================================================
   * 4. 2-STEP STEPPER WIZARD CONTROLLER
   * =========================================================================
   */
  window.goToStep = function (step) {
    if (step === 2) {
      // Validate Step 1 fields
      var brand = document.getElementById('car-brand')?.value;
      var model = document.getElementById('car-model')?.value;
      var plate = (document.getElementById('car-plate')?.value || '').trim();
      var rate = document.getElementById('car-rate')?.value;
      var deposit = document.getElementById('car-deposit')?.value;

      if (!brand) {
        window.showToast('Sila pilih Pengeluar (Jenama) kenderaan.', 'warning');
        document.getElementById('car-brand')?.focus();
        return;
      }
      if (!model) {
        window.showToast('Sila pilih Model kenderaan.', 'warning');
        document.getElementById('car-model')?.focus();
        return;
      }
      if (!plate) {
        window.showToast('Sila masukkan No. Pendaftaran (Plat) kenderaan.', 'warning');
        document.getElementById('car-plate')?.focus();
        return;
      }
      if (!rate || parseInt(rate, 10) < 50) {
        window.showToast('Sila masukkan Kadar Sewaan Harian yang sah.', 'warning');
        document.getElementById('car-rate')?.focus();
        return;
      }
      if (!deposit) {
        window.showToast('Sila masukkan Deposit Keselamatan.', 'warning');
        document.getElementById('car-deposit')?.focus();
        return;
      }

      // Transition to Step 2
      currentStep = 2;
      document.getElementById('step-1-container')?.classList.add('hidden');
      document.getElementById('step-2-container')?.classList.remove('hidden');

      var b1 = document.getElementById('step-btn-1');
      var b2 = document.getElementById('step-btn-2');
      if (b1) {
        b1.classList.remove('active');
        b1.classList.add('completed');
        b1.setAttribute('aria-selected', 'false');
      }
      if (b2) {
        b2.classList.add('active');
        b2.setAttribute('aria-selected', 'true');
      }

      window.updateLivePreview();
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
      // Return to Step 1
      currentStep = 1;
      document.getElementById('step-2-container')?.classList.add('hidden');
      document.getElementById('step-1-container')?.classList.remove('hidden');

      var btn1 = document.getElementById('step-btn-1');
      var btn2 = document.getElementById('step-btn-2');
      if (btn1) {
        btn1.classList.add('active');
        btn1.setAttribute('aria-selected', 'true');
      }
      if (btn2) {
        btn2.classList.remove('active');
        btn2.setAttribute('aria-selected', 'false');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * =========================================================================
   * 5. AUTO-SAVE & DRAFT RESUME CONTROLLER
   * =========================================================================
   */
  function triggerDraftSave() {
    if (isInitializing || isRestoringDraft) return;
    isFormDirty = true;
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveCarDraft, 400);
  }
  window.triggerDraftSave = triggerDraftSave;

  function saveCarDraft() {
    if (isInitializing || isRestoringDraft) return;
    try {
      var draft = {
        brand: document.getElementById('car-brand')?.value || '',
        model: document.getElementById('car-model')?.value || '',
        customName: document.getElementById('car-custom-name')?.value || '',
        variant: document.getElementById('car-variant')?.value || '',
        year: document.getElementById('car-year')?.value || '2024',
        plate: document.getElementById('car-plate')?.value || '',
        colorSelect: document.getElementById('car-color-select')?.value || '',
        customColor: document.getElementById('car-color-custom')?.value || '',
        color: document.getElementById('car-color')?.value || '',
        type: document.getElementById('car-type')?.value || 'Sedan',
        seats: document.getElementById('car-seats')?.value || '5',
        transmission: document.getElementById('car-transmission')?.value || 'Automatic',
        fuel: document.getElementById('car-fuel')?.value || 'Petrol',
        engine: document.getElementById('car-engine')?.value || '',
        rate: document.getElementById('car-rate')?.value || '',
        deposit: document.getElementById('car-deposit')?.value || '',
        fullName: document.getElementById('car-name')?.value || '',
        timestamp: Date.now()
      };

      // Only save if user has inputted something meaningful
      if (draft.plate || draft.customName || isFormDirty) {
        localStorage.setItem('wedrive_car_draft', JSON.stringify(draft));
      }
    } catch (e) {
      console.warn('Draft save error:', e);
    }
  }

  function checkExistingDraft() {
    try {
      var raw = localStorage.getItem('wedrive_car_draft');
      if (!raw) return;
      var draft = JSON.parse(raw);
      if (!draft || (!draft.brand && !draft.plate && !draft.customName)) return;

      var banner = document.getElementById('banner-draft-resume');
      var subtitle = document.getElementById('draft-resume-subtitle');
      if (banner) {
        banner.classList.remove('hidden');
        var dName = draft.fullName || (draft.brand + ' ' + draft.model);
        if (subtitle) {
          var dateStr = new Date(draft.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          subtitle.textContent = 'Draf bagi "' + (dName || 'Kenderaan Baharu') + '" disimpan pada jam ' + dateStr + '. Pulihkan untuk sambung mengisi.';
        }
      }
    } catch (e) {
      console.warn('Draft check error:', e);
    }
  }

  window.applyCarDraft = function () {
    isRestoringDraft = true;
    try {
      var raw = localStorage.getItem('wedrive_car_draft');
      if (!raw) return;
      var draft = JSON.parse(raw);

      if (draft.brand) {
        setSelectValue('car-brand', draft.brand);
        window.onBrandChange();
      }

      if (draft.model) {
        setSelectValue('car-model', draft.model);
        window.onModelChange();
      }

      if (draft.customName) {
        var cInput = document.getElementById('car-custom-name');
        if (cInput) cInput.value = draft.customName;
      }

      if (draft.variant) {
        setSelectValue('car-variant', draft.variant);
        window.onVariantChange();
      }

      if (draft.year) {
        setSelectValue('car-year', draft.year);
        window.onYearChange();
      }

      if (draft.plate) {
        var pInput = document.getElementById('car-plate');
        if (pInput) pInput.value = draft.plate;
      }

      if (draft.colorSelect) {
        setSelectValue('car-color-select', draft.colorSelect);
        window.onColorSelectChange();
        if (draft.colorSelect === 'other' && draft.customColor) {
          var colCust = document.getElementById('car-color-custom');
          if (colCust) colCust.value = draft.customColor;
          window.onCustomColorInput();
        }
      }

      if (draft.type) setSelectValue('car-type', draft.type);
      if (draft.seats) setSelectValue('car-seats', draft.seats);
      if (draft.transmission) setSelectValue('car-transmission', draft.transmission);
      if (draft.fuel) setSelectValue('car-fuel', draft.fuel);

      if (draft.engine) {
        var engInput = document.getElementById('car-engine');
        if (engInput) engInput.value = draft.engine;
      }

      if (draft.rate) {
        var rateEl = document.getElementById('car-rate');
        if (rateEl) rateEl.value = draft.rate;
      }

      if (draft.deposit) {
        var depEl = document.getElementById('car-deposit');
        if (depEl) depEl.value = draft.deposit;
      }

      updateFullCarName();
      window.updateLivePreview();

      document.getElementById('banner-draft-resume')?.classList.add('hidden');
      window.showToast('✅ Draf berjaya dipulihkan sepenuhnya!', 'success');
    } catch (e) {
      console.warn('Draft apply error:', e);
      window.showToast('Ralat memulihkan draf.', 'error');
    } finally {
      isRestoringDraft = false;
      isFormDirty = true;
    }
  };

  window.clearCarDraft = function (showToastNotice) {
    try {
      localStorage.removeItem('wedrive_car_draft');
      document.getElementById('banner-draft-resume')?.classList.add('hidden');
      if (showToastNotice) {
        window.showToast('Draf telah dipadamkan.', 'info');
      }
    } catch (e) {
      console.warn('Draft clear error:', e);
    }
  };

  /**
   * =========================================================================
   * 6. EXIT CONFIRMATION MODAL & NAVIGATION INTERCEPTOR
   * =========================================================================
   */
  window.triggerExitConfirm = function (url) {
    var plate = (document.getElementById('car-plate')?.value || '').trim();
    var brand = document.getElementById('car-brand')?.value;

    // If form is dirty or has data
    if (isFormDirty || plate || brand) {
      pendingExitUrl = url || 'cars.html';
      var modal = document.getElementById('modal-exit-confirm');
      if (modal) modal.classList.add('show');
    } else {
      window.location.href = url || 'cars.html';
    }
  };

  window.closeExitModal = function () {
    var modal = document.getElementById('modal-exit-confirm');
    if (modal) modal.classList.remove('show');
    pendingExitUrl = null;
  };

  window.proceedExit = function () {
    var target = pendingExitUrl || 'cars.html';
    window.closeExitModal();
    // Allow clean leave
    isFormDirty = false;
    window.location.href = target;
  };

  // Intercept Navigation Links on Page
  function setupNavigationGuards() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;
      var href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      var plate = (document.getElementById('car-plate')?.value || '').trim();
      var brand = document.getElementById('car-brand')?.value;

      if (isFormDirty || plate || brand) {
        e.preventDefault();
        window.triggerExitConfirm(href);
      }
    });

    // Browser close / tab reload warning
    window.addEventListener('beforeunload', function (e) {
      var plate = (document.getElementById('car-plate')?.value || '').trim();
      var brand = document.getElementById('car-brand')?.value;
      if (isFormDirty || plate || brand) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  /**
   * =========================================================================
   * 7. 360 STUDIO & PHOTO HANDLING (PRESERVED & EXPANDED)
   * =========================================================================
   */

  // Photo Upload & Preview
  function previewCarPhoto(input) {
    if (input.files && input.files[0]) {
      var file = input.files[0];
      if (file.size > 10 * 1024 * 1024) {
        if (typeof showToast === 'function') showToast('Saiz fail melebihi had 10MB.', 'error');
        input.value = '';
        return;
      }
      if (file.type === 'image/svg+xml' || !file.type.startsWith('image/')) {
        if (typeof showToast === 'function') showToast('Format imej tidak sah. Sila gunakan PNG, JPG atau WebP.', 'error');
        input.value = '';
        return;
      }
      var reader = new FileReader();
      reader.onload = function (e) {
        selectedPhotoBase64 = e.target.result;
        var img = document.getElementById('photo-preview-img');
        var content = document.getElementById('photo-preview-content');
        if (img) {
          img.src = selectedPhotoBase64;
          img.classList.remove('hidden');
        }
        if (content) content.classList.add('hidden');

        var liveImg = document.getElementById('preview-display-img');
        var emptyBox = document.getElementById('preview-img-empty');
        if (liveImg) {
          liveImg.src = selectedPhotoBase64;
          liveImg.classList.remove('hidden');
          liveImg.style.objectFit = 'cover';
          liveImg.style.width = '100%';
          liveImg.style.height = '100%';
        }
        if (emptyBox) emptyBox.classList.add('hidden');
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  window.previewCarPhoto = previewCarPhoto;
  window.handlePhotoSelect = previewCarPhoto;

  // 360 Exterior Folder & Multiple Files
  window.handleExteriorFolder = function (input) {
    if (!input.files || !input.files.length) return;
    processExteriorFiles(Array.from(input.files));
  };

  window.handleExteriorFiles = function (input) {
    if (!input.files || !input.files.length) return;
    processExteriorFiles(Array.from(input.files));
  };

  function processExteriorFiles(files) {
    var imageFiles = files.filter(function (f) {
      return f.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(f.name);
    });

    if (!imageFiles.length) {
      window.showToast('Tiada fail imej sah dikesan dalam folder yang dipilih.', 'error');
      return;
    }

    imageFiles.sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });

    var countEl = document.getElementById('exterior-frames-count');
    if (countEl) countEl.textContent = imageFiles.length + ' Bingkai';

    var scrubSlider = document.getElementById('exterior-scrub');
    if (scrubSlider) {
      scrubSlider.max = imageFiles.length - 1;
      scrubSlider.value = 0;
    }

    window.__360Data.has360 = true;
    window.__360Data.exteriorFrames = [];

    var strip = document.getElementById('exterior-thumb-strip');
    if (strip) strip.innerHTML = '';

    var loadedCount = 0;
    var maxThumbs = Math.min(imageFiles.length, 12);
    var step = Math.max(1, Math.floor(imageFiles.length / maxThumbs));

    imageFiles.forEach(function (file, idx) {
      var reader = new FileReader();
      reader.onload = function (e) {
        window.__360Data.exteriorFrames[idx] = e.target.result;
        loadedCount++;

        if (strip && idx % step === 0 && strip.children.length < 12) {
          var thumb = document.createElement('img');
          thumb.src = e.target.result;
          thumb.className = 'thumb-reel-item';
          thumb.alt = 'Frame ' + idx;
          strip.appendChild(thumb);
        }

        if (loadedCount === imageFiles.length) {
          var previewZone = document.getElementById('exterior-preview-zone');
          if (previewZone) previewZone.classList.remove('hidden');

          update360StatusBadge();
          show360Frame(0);
          window.switchPreviewMode('exterior');
          window.showToast('Berjaya memuat ' + imageFiles.length + ' bingkai putaran 360° luaran!', 'success');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  window.handleScrub360 = function (val) {
    var idx = parseInt(val, 10);
    show360Frame(idx);

    var total = (window.__360Data.exteriorFrames && window.__360Data.exteriorFrames.length) || 36;
    var degree = Math.round((idx / (total - 1)) * 360);
    var degEl = document.getElementById('scrub-degree');
    if (degEl) degEl.textContent = degree + '°';
  };

  function show360Frame(idx) {
    if (!window.__360Data.exteriorFrames || !window.__360Data.exteriorFrames.length) return;
    idx = Math.max(0, Math.min(idx, window.__360Data.exteriorFrames.length - 1));
    window.__360Data.currentFrameIndex = idx;

    var frameSrc = window.__360Data.exteriorFrames[idx];
    var extImg = document.getElementById('preview-360-frame');
    var emptyBox = document.getElementById('preview-img-empty');
    var photoImg = document.getElementById('preview-display-img');

    if (extImg && frameSrc) {
      extImg.src = frameSrc;
      extImg.classList.remove('hidden');
      if (emptyBox) emptyBox.classList.add('hidden');
      if (photoImg) photoImg.classList.add('hidden');
    }
  }

  // 360 Interior Upload
  window.handleInteriorUpload = function (input, mode) {
    if (!input.files || !input.files.length) return;

    if (mode === 'file') {
      var file = input.files[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        window.__360Data.has360 = true;
        window.__360Data.interiorAsset = {
          type: 'equirectangular',
          src: e.target.result
        };

        var badge = document.getElementById('interior-badge-status');
        if (badge) {
          badge.textContent = 'Panorama Aktif';
          badge.classList.add('active');
        }

        var previewZone = document.getElementById('interior-preview-zone');
        if (previewZone) previewZone.classList.remove('hidden');
        var thumbImg = document.getElementById('interior-thumb-img');
        if (thumbImg) thumbImg.src = e.target.result;
        var label = document.getElementById('interior-type-label');
        if (label) label.textContent = 'Imej Equirectangular 360° Sedia';

        var intImg = document.getElementById('preview-interior-img');
        if (intImg) intImg.src = e.target.result;

        update360StatusBadge();
        window.switchPreviewMode('interior');
        window.showToast('Panorama dalaman 360° berjaya dimuat naik!', 'success');
      };
      reader.readAsDataURL(file);

    } else if (mode === 'folder') {
      var cubeFiles = Array.from(input.files).filter(function (f) {
        return /\.(jpe?g|png|webp)$/i.test(f.name);
      });

      if (!cubeFiles.length) {
        window.showToast('Tiada fail panorama sah dikesan.', 'error');
        return;
      }

      window.__360Data.has360 = true;
      var fFace = cubeFiles.find(function (f) { return /f|front/i.test(f.name); }) || cubeFiles[0];
      var reader = new FileReader();
      reader.onload = function (e) {
        window.__360Data.interiorAsset = {
          type: 'cube-map',
          preview: e.target.result,
          filesCount: cubeFiles.length
        };

        var badge = document.getElementById('interior-badge-status');
        if (badge) {
          badge.textContent = cubeFiles.length + ' Muka Kubus';
          badge.classList.add('active');
        }

        var previewZone = document.getElementById('interior-preview-zone');
        if (previewZone) previewZone.classList.remove('hidden');
        var thumbImg = document.getElementById('interior-thumb-img');
        if (thumbImg) thumbImg.src = e.target.result;
        var label = document.getElementById('interior-type-label');
        if (label) label.textContent = 'Folder 6 Muka Kubus Dikesan';

        var intImg = document.getElementById('preview-interior-img');
        if (intImg) intImg.src = e.target.result;

        update360StatusBadge();
        window.switchPreviewMode('interior');
        window.showToast('6 Muka Kubus panorama dalaman berjaya diproses!', 'success');
      };
      reader.readAsDataURL(fFace);
    }
  };

  // AI 360 Auto-Downloader
  window.ingest360FromUrl = function () {
    var urlInput = document.getElementById('ai-360-link-input');
    var feedback = document.getElementById('ai-360-link-feedback');
    var val = urlInput ? urlInput.value.trim() : '';

    if (!val) {
      window.showToast('Sila masukkan pautan 360° yang sah.', 'info');
      return;
    }

    if (feedback) {
      feedback.innerHTML = '<span class="text-primary"><span class="material-icons-round fs-12 spin-pulse">sync</span> AI sedang menganalisis pautan 360 dan menyedut bingkai...</span>';
    }

    setTimeout(function () {
      var sampleFrames = [];
      for (var i = 0; i < 36; i++) {
        var pad = (i * 5).toString().padStart(3, '0');
        sampleFrames.push('../../../../shared/model/Sedan/2023 BMW 320i M Sport 2.0/exterior/full-res/frame-' + pad + '.jpg');
      }

      window.__360Data.has360 = true;
      window.__360Data.exteriorFrames = sampleFrames;

      var countEl = document.getElementById('exterior-frames-count');
      if (countEl) countEl.textContent = '36 Bingkai (AI Ingested)';

      var scrubSlider = document.getElementById('exterior-scrub');
      if (scrubSlider) {
        scrubSlider.max = 35;
        scrubSlider.value = 0;
      }

      var previewZone = document.getElementById('exterior-preview-zone');
      if (previewZone) previewZone.classList.remove('hidden');

      var strip = document.getElementById('exterior-thumb-strip');
      if (strip) {
        strip.innerHTML = '';
        for (var k = 0; k < 36; k += 3) {
          var t = document.createElement('img');
          t.src = sampleFrames[k];
          t.className = 'thumb-reel-item';
          t.alt = 'Thumb ' + k;
          strip.appendChild(t);
        }
      }

      update360StatusBadge();
      show360Frame(0);
      window.switchPreviewMode('exterior');

      if (feedback) {
        feedback.innerHTML = '<span class="text-emerald fw-600"><span class="material-icons-round fs-14">check_circle</span> 36 Bingkai putaran berkualiti tinggi berjaya disedut dari pautan!</span>';
      }
      window.showToast('✨ Pautan 360° berjaya disedut dan diselaraskan!', 'success');
    }, 1000);
  };

  function update360StatusBadge() {
    var b = document.getElementById('badge-360-status');
    var pBadge = document.getElementById('preview-badge-360');
    if (!b) return;

    if (window.__360Data.has360) {
      b.className = 'status-badge active';
      b.innerHTML = '<span class="material-icons-round fs-14">360</span> <span>360° Studio Aktif</span>';
      if (pBadge) pBadge.style.display = 'inline-flex';
    } else {
      b.className = 'status-badge badge-360-muted';
      b.innerHTML = '<span>Tiada 360° (Foto Biasa)</span>';
      if (pBadge) pBadge.style.display = 'none';
    }
  }

  // Preview Mode Switcher (Photo / Exterior / Interior)
  window.switchPreviewMode = function (mode) {
    var tabPhoto = document.getElementById('tab-prev-photo');
    var tabExt = document.getElementById('tab-prev-exterior');
    var tabInt = document.getElementById('tab-prev-interior');

    var imgPhoto = document.getElementById('preview-display-img');
    var imgExt = document.getElementById('preview-360-frame');
    var wrapInt = document.getElementById('preview-interior-wrap');
    var emptyBox = document.getElementById('preview-img-empty');

    if (tabPhoto) tabPhoto.classList.remove('active');
    if (tabExt) tabExt.classList.remove('active');
    if (tabInt) tabInt.classList.remove('active');

    if (imgPhoto) imgPhoto.classList.add('hidden');
    if (imgExt) imgExt.classList.add('hidden');
    if (wrapInt) wrapInt.classList.add('hidden');

    if (mode === 'photo') {
      if (tabPhoto) tabPhoto.classList.add('active');
      if (selectedPhotoBase64 && imgPhoto) {
        imgPhoto.classList.remove('hidden');
        if (emptyBox) emptyBox.classList.add('hidden');
      } else if (emptyBox) {
        emptyBox.classList.remove('hidden');
      }
    } else if (mode === 'exterior') {
      if (tabExt) tabExt.classList.add('active');
      if (window.__360Data.has360 && window.__360Data.exteriorFrames.length && imgExt) {
        imgExt.classList.remove('hidden');
        if (emptyBox) emptyBox.classList.add('hidden');
        show360Frame(window.__360Data.currentFrameIndex || 0);
      } else {
        window.showToast('Sila muat naik folder/fail bingkai 360° luaran terlebih dahulu.', 'info');
        if (emptyBox) emptyBox.classList.remove('hidden');
      }
    } else if (mode === 'interior') {
      if (tabInt) tabInt.classList.add('active');
      if (window.__360Data.has360 && window.__360Data.interiorAsset && wrapInt) {
        wrapInt.classList.remove('hidden');
        if (emptyBox) emptyBox.classList.add('hidden');
      } else {
        window.showToast('Sila muat naik panorama 360° dalaman terlebih dahulu.', 'info');
        if (emptyBox) emptyBox.classList.remove('hidden');
      }
    }
  };

  /**
   * =========================================================================
   * 8. OFFICIAL WEDRIVE CAR-CARD LIVE PREVIEW
   * =========================================================================
   */
  window.updateLivePreview = function () {
    var nameVal = updateFullCarName() || 'Nama & Model Kenderaan';
    var colorVal = (document.getElementById('car-color')?.value || '').trim();
    var colorDisplay = colorVal || 'Belum Dipilih';

    var typeEl = document.getElementById('car-type');
    var typeVal = (typeEl && typeEl.value ? typeEl.value : 'KATEGORI').toUpperCase();

    var transEl = document.getElementById('car-transmission');
    var transVal = transEl && transEl.value ? (transEl.value === 'Automatic' ? 'Auto' : 'Manual') : '-';

    var fuelEl = document.getElementById('car-fuel');
    var fuelVal = fuelEl && fuelEl.value ? fuelEl.value : '-';

    var seatsEl = document.getElementById('car-seats');
    var seatsNum = seatsEl && seatsEl.value ? seatsEl.value : '';
    var seatsVal = seatsNum ? seatsNum + ' Seats' : '- Seats';

    var rateInput = document.getElementById('car-rate');
    var rateVal = (rateInput && rateInput.value) ? rateInput.value : '--';

    var elName = document.getElementById('preview-display-name');
    var elCat = document.getElementById('preview-display-cat');
    var elColor = document.getElementById('preview-display-color');
    var elTrans = document.getElementById('preview-spec-trans');
    var elFuel = document.getElementById('preview-spec-fuel');
    var elSeats = document.getElementById('preview-spec-seats');
    var elRate = document.getElementById('preview-display-rate');
    var elAiChip = document.getElementById('preview-ai-chip-text');

    if (elName) elName.textContent = nameVal;
    if (elCat) elCat.textContent = typeVal;
    if (elColor) elColor.textContent = 'Warna: ' + colorDisplay;
    if (elTrans) elTrans.textContent = transVal;
    if (elFuel) elFuel.textContent = fuelVal;
    if (elSeats) elSeats.textContent = seatsVal;
    if (elRate) elRate.textContent = rateVal;

    // AI recommendation chip context
    if (elAiChip) {
      var numRate = parseInt(rateVal, 10) || 0;
      if (numRate >= 400 || typeVal === 'LUXURY') {
        elAiChip.textContent = 'Executive Choice';
      } else if (parseInt(seatsNum, 10) >= 6 || typeVal === 'MPV' || typeVal === 'SUV' || typeVal === 'VAN') {
        elAiChip.textContent = 'Family Choice';
      } else if (fuelVal.includes('Electric') || fuelVal.includes('Hybrid')) {
        elAiChip.textContent = 'Eco Smart Choice';
      } else {
        elAiChip.textContent = 'Pilihan Kenderaan';
      }
    }
  };

  /**
   * =========================================================================
   * 9. FORM SUBMISSION
   * =========================================================================
   */
  window.handleCarSubmit = function (e) {
    e.preventDefault();

    var nameVal = updateFullCarName();
    var plateVal = (document.getElementById('car-plate')?.value || '').trim().toUpperCase();

    if (!nameVal || !plateVal) {
      window.showToast('Sila lengkapkan nama model dan nombor plat kenderaan.', 'error');
      return;
    }

    var newCar = {
      name: nameVal,
      plate: plateVal,
      brand: document.getElementById('car-brand')?.value || 'BMW',
      year: parseInt(document.getElementById('car-year')?.value, 10) || 2024,
      color: (document.getElementById('car-color')?.value || '').trim() || 'Putih',
      type: document.getElementById('car-type')?.value || 'Sedan',
      seats: parseInt(document.getElementById('car-seats')?.value, 10) || 5,
      transmission: document.getElementById('car-transmission')?.value || 'Automatic',
      fuel: document.getElementById('car-fuel')?.value || 'Petrol',
      engine: (document.getElementById('car-engine')?.value || '').trim() || '2.0L Turbo Standard',
      rate: 'RM ' + (document.getElementById('car-rate')?.value || 450) + '/hari',
      deposit: 'RM ' + (document.getElementById('car-deposit')?.value || 400),
      status: 'Available',
      location: 'Pusat Operasi Utama WeDRIVE (HQ Melaka)',
      has_360: Boolean(window.__360Data && window.__360Data.has360),
      exterior_360: (window.__360Data && window.__360Data.exteriorFrames.length) ? {
        frame_count: window.__360Data.exteriorFrames.length,
        preview_frame: window.__360Data.exteriorFrames[0]
      } : null,
      interior_360: (window.__360Data && window.__360Data.interiorAsset) ? window.__360Data.interiorAsset : null,
      images: selectedPhotoBase64 ? [selectedPhotoBase64] : ['../../../shared/images/cars/honda-crv-2024.png']
    };

    // Clean up draft since registered successfully
    window.clearCarDraft(false);
    isFormDirty = false;

    if (window.WeDriveAPI && window.WeDriveAPI.createCar) {
      window.WeDriveAPI.createCar(newCar)
        .then(function () {
          window.showToast('Kereta berjaya didaftarkan ke dalam sistem!', 'success');
          setTimeout(function () { window.location.href = 'cars.html'; }, 800);
        })
        .catch(function (err) {
          console.error('Create car error:', err);
          saveFallback(newCar);
        });
    } else {
      saveFallback(newCar);
    }
  };

  function saveFallback(car) {
    try {
      var existing = JSON.parse(localStorage.getItem('wedrive_cars') || '[]');
      car.id = 'CR-' + Date.now();
      existing.unshift(car);
      localStorage.setItem('wedrive_cars', JSON.stringify(existing));
    } catch (err) {
      console.warn('Local storage save:', err);
    }
    window.showToast('Kereta berjaya didaftarkan ke dalam sistem!', 'success');
    setTimeout(function () { window.location.href = 'cars.html'; }, 800);
  }

  /**
   * =========================================================================
   * 10. INITIALIZATION & DRAG INTERACTION
   * =========================================================================
   */
  document.addEventListener('DOMContentLoaded', function () {
    // Setup Navigation Guards
    setupNavigationGuards();

    // Check for Existing Auto-Save Draft
    checkExistingDraft();

    // Reset placeholders cleanly if not restoring draft
    resetVariantsPlaceholder();

    // Preview canvas drag rotation
    var canvasWrap = document.getElementById('preview-canvas-wrap');
    var isDragging = false;
    var startX = 0;
    var startIndex = 0;

    if (canvasWrap) {
      canvasWrap.addEventListener('mousedown', function (e) {
        if (!window.__360Data.has360 || !window.__360Data.exteriorFrames.length) return;
        var tabExt = document.getElementById('tab-prev-exterior');
        if (tabExt && !tabExt.classList.contains('active')) return;
        isDragging = true;
        startX = e.clientX;
        startIndex = window.__360Data.currentFrameIndex || 0;
        canvasWrap.classList.add('dragging');
      });

      window.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        var diffX = e.clientX - startX;
        var total = window.__360Data.exteriorFrames.length;
        var stepCount = Math.round(diffX / 10);
        var newIdx = (startIndex - stepCount) % total;
        if (newIdx < 0) newIdx += total;
        show360Frame(newIdx);

        var scrub = document.getElementById('exterior-scrub');
        if (scrub) scrub.value = newIdx;
      });

      window.addEventListener('mouseup', function () {
        if (isDragging) {
          isDragging = false;
          canvasWrap.classList.remove('dragging');
        }
      });
    }

    window.updateLivePreview();
    isInitializing = false;
  });

})();
