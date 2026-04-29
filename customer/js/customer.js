/**
 * WeDRIVE - Customer Module JS
 * Updated: Booking Modal Flow (3-Step)
 * Data fetched from shared/dummy/customer.json via WeDriveAPI
 */

let allCars = [];
let selectedCar = null;
let bookingStep = 1;
let bookingDays = 1;

// ─── INJECT MODAL HTML INTO DOM ──────────────────────────────────────────────
(function injectBookingModal() {
  const modalHTML = `
  <!-- BOOKING MODAL OVERLAY -->
  <div id="booking-overlay" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.7);
    backdrop-filter:blur(4px); z-index:2000; align-items:center; justify-content:center; padding:20px;">

    <div id="booking-modal" style="background:var(--card-bg, #fff); border-radius:20px; width:100%;
      max-width:540px; max-height:90vh; overflow-y:auto; box-shadow:0 24px 80px rgba(0,0,0,0.3);
      animation:modalSlideUp 0.3s cubic-bezier(.34,1.56,.64,1);">

      <!-- MODAL HEADER -->
      <div id="modal-header" style="padding:22px 28px 18px; border-bottom:1px solid var(--border-color,#E2E8F0);
        display:flex; align-items:center; justify-content:space-between; position:sticky; top:0;
        background:var(--card-bg,#fff); border-radius:20px 20px 0 0; z-index:1;">
        <div>
          <h3 id="modal-title" style="font-size:18px; font-weight:700; color:var(--text-primary,#1E293B);">Book Your Car</h3>
          <p id="modal-subtitle" style="font-size:12px; color:var(--text-muted,#94A3B8); margin-top:2px;">Step 1 of 3 — Booking Details</p>
        </div>
        <button onclick="closeBookingModal()" style="width:32px; height:32px; border-radius:8px;
          border:none; background:var(--bg-surface,#F1F5F9); cursor:pointer; display:flex;
          align-items:center; justify-content:center; transition:background 0.2s;"
          onmouseover="this.style.background='#E2E8F0'" onmouseout="this.style.background='var(--bg-surface,#F1F5F9)'">
          <span class="material-icons-round" style="font-size:18px; color:var(--text-secondary,#64748B);">close</span>
        </button>
      </div>

      <!-- STEP INDICATOR -->
      <div style="padding:16px 28px 0; display:flex; align-items:center; gap:0;">
        <div id="step-1-ind" style="display:flex; align-items:center; gap:8px; flex:1;">
          <div id="step-1-circle" style="width:28px; height:28px; border-radius:50%; background:#3B82F6;
            color:white; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;">1</div>
          <span style="font-size:12px; font-weight:600; color:#3B82F6;">Details</span>
          <div style="flex:1; height:2px; background:#E2E8F0; margin:0 8px;" id="line-1"></div>
        </div>
        <div id="step-2-ind" style="display:flex; align-items:center; gap:8px; flex:1;">
          <div id="step-2-circle" style="width:28px; height:28px; border-radius:50%; background:#E2E8F0;
            color:#94A3B8; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;">2</div>
          <span id="step-2-label" style="font-size:12px; font-weight:600; color:#94A3B8;">Payment</span>
          <div style="flex:1; height:2px; background:#E2E8F0; margin:0 8px;" id="line-2"></div>
        </div>
        <div id="step-3-ind" style="display:flex; align-items:center; gap:8px;">
          <div id="step-3-circle" style="width:28px; height:28px; border-radius:50%; background:#E2E8F0;
            color:#94A3B8; font-size:12px; font-weight:700; display:flex; align-items:center; justify-content:center;">3</div>
          <span id="step-3-label" style="font-size:12px; font-weight:600; color:#94A3B8;">Confirmed</span>
        </div>
      </div>

      <!-- MODAL BODY -->
      <div id="modal-body" style="padding:20px 28px;"></div>

      <!-- MODAL FOOTER -->
      <div id="modal-footer" style="padding:16px 28px 22px; border-top:1px solid var(--border-color,#E2E8F0);
        display:flex; gap:12px;">
        <button id="btn-back" onclick="prevStep()" style="flex:1; padding:12px; border:1.5px solid var(--border-color,#E2E8F0);
          border-radius:10px; background:transparent; font-family:'Inter',sans-serif; font-size:14px;
          font-weight:600; cursor:pointer; color:var(--text-primary,#1E293B); transition:all 0.2s; display:none;"
          onmouseover="this.style.background='var(--bg-surface,#F1F5F9)'"
          onmouseout="this.style.background='transparent'">← Back</button>
        <button id="btn-next" onclick="nextStep()" style="flex:2; padding:12px; background:#3B82F6;
          color:white; border:none; border-radius:10px; font-family:'Inter',sans-serif; font-size:14px;
          font-weight:700; cursor:pointer; transition:all 0.2s; display:flex; align-items:center;
          justify-content:center; gap:8px;"
          onmouseover="this.style.background='#1D4ED8'"
          onmouseout="this.style.background='#3B82F6'">
          <span>Continue</span>
          <span class="material-icons-round" style="font-size:18px;">arrow_forward</span>
        </button>
      </div>
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div id="wd-toast" style="position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(80px);
    background:#1E293B; color:white; padding:12px 24px; border-radius:10px; font-size:13px;
    font-weight:600; z-index:3000; transition:transform 0.3s, opacity 0.3s; opacity:0; white-space:nowrap;"></div>

  <style>
    @keyframes modalSlideUp {
      from { opacity:0; transform:translateY(30px) scale(0.96); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    .wd-field label {
      display:block; font-size:11px; font-weight:600; letter-spacing:0.5px;
      text-transform:uppercase; color:var(--text-muted,#94A3B8); margin-bottom:6px;
    }
    .wd-field input, .wd-field select {
      width:100%; padding:11px 14px;
      border:1.5px solid var(--border-color,#E2E8F0);
      border-radius:10px; font-family:'Inter',sans-serif;
      font-size:14px; color:var(--text-primary,#1E293B);
      background:var(--input-bg,#F8FAFC); outline:none; transition:all 0.2s;
    }
    .wd-field input:focus, .wd-field select:focus {
      border-color:#3B82F6;
      background:var(--input-focus-bg,#fff);
      box-shadow:0 0 0 3px rgba(59,130,246,0.1);
    }
    .pay-opt {
      flex:1; padding:12px; border:1.5px solid var(--border-color,#E2E8F0);
      border-radius:10px; cursor:pointer; text-align:center; transition:all 0.2s;
      font-family:'Inter',sans-serif; background:var(--card-bg,#fff);
    }
    .pay-opt:hover { border-color:#3B82F6; }
    .pay-opt.selected { border-color:#3B82F6; background:#EFF6FF; }
    .pay-opt .pay-icon { font-size:22px; display:block; margin-bottom:4px; }
    .pay-opt .pay-label { font-size:11px; font-weight:600; color:var(--text-primary,#1E293B); }
  </style>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);
})();

// ─── FETCH & INITIALISE ──────────────────────────────────────────────────────
window.WeDriveAPI.getCars()
  .then(cars => {
    allCars = cars;
    renderCars(allCars);
  })
  .catch(() => {
    const grid = document.getElementById('cars-grid');
    if (grid) grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Unable to load cars. Please refresh.</p>';
  });

// ─── RENDER CAR CARDS ────────────────────────────────────────────────────────
function renderCars(list) {
  const grid = document.getElementById('cars-grid');
  if (!grid) return;

  const countEl = document.querySelector('.results-count');
  if (countEl) countEl.innerHTML = \`Showing <strong>\${list.length}</strong> cars available\`;

  grid.innerHTML = list.map(c => \`
    <div class="car-card" onclick="bookCar(\${c.id})">
      <div class="car-img">
        <span class="material-icons-round no-img">directions_car</span>
        <div class="ai-chip">
          <span class="material-icons-round" style="font-size:12px">psychology</span> \${c.ai}
        </div>
        <div style="position:absolute; top:12px; left:12px; display:flex; gap:6px;">
          <div style="background:rgba(255,255,255,0.9); border-radius:6px; padding:3px 8px;
            font-size:11px; font-weight:600; color:#1E293B; display:flex; align-items:center; gap:3px;">
            <span class="material-icons-round" style="font-size:12px; color:#F59E0B;">star</span>
            \${c.rating}
          </div>
        </div>
      </div>
      <div class="car-body">
        <h3>\${c.name}</h3>
        <p class="car-type">\${c.label} · \${c.year} · \${c.color}</p>
        <div class="car-specs">
          <div class="spec"><span class="material-icons-round">local_gas_station</span>\${c.fuel}</div>
          <div class="spec"><span class="material-icons-round">event_seat</span>\${c.seats} Seats</div>
          <div class="spec"><span class="material-icons-round">settings</span>\${c.trans}</div>
          <div class="spec"><span class="material-icons-round">speed</span>\${c.mileage.toLocaleString()} km</div>
        </div>
        <div class="car-footer">
          <div class="price">RM \${c.price}<span>/day</span></div>
          <button class="btn-book" onclick="event.stopPropagation(); bookCar(\${c.id})">
            <span class="material-icons-round" style="font-size:15px; vertical-align:middle;">vpn_key</span>
            Book Now
          </button>
        </div>
      </div>
    </div>
  \`).join('');
}

// ─── FILTER ──────────────────────────────────────────────────────────────────
function filterCars(type, btn) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = type === 'all' ? allCars : allCars.filter(c => c.type === type);
  renderCars(filtered);
}

// ─── OPEN BOOKING MODAL ──────────────────────────────────────────────────────
function bookCar(id) {
  if (window.__GUEST_MODE__) {
    window.location.href = 'customer/pages/login.html';
    return;
  }

  selectedCar = allCars.find(c => c.id === id);
  if (!selectedCar) return;

  bookingStep = 1;
  bookingDays = 1;

  const overlay = document.getElementById('booking-overlay');
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  renderModalStep();
}

// Close when clicking overlay background
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('booking-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeBookingModal();
  });
});

function closeBookingModal() {
  document.getElementById('booking-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

// ─── STEP RENDERER ───────────────────────────────────────────────────────────
function renderModalStep() {
  updateStepIndicator();

  if (bookingStep === 1) renderStep1();
  else if (bookingStep === 2) renderStep2();
  else if (bookingStep === 3) renderStep3();

  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const footer  = document.getElementById('modal-footer');

  btnBack.style.display = bookingStep > 1 && bookingStep < 3 ? 'block' : 'none';
  footer.style.display  = bookingStep === 3 ? 'none' : 'flex';

  if (bookingStep === 2) {
    btnNext.innerHTML = \`<span class="material-icons-round" style="font-size:18px">lock</span> <span>Confirm & Pay</span>\`;
  } else if (bookingStep === 1) {
    btnNext.innerHTML = \`<span>Continue</span> <span class="material-icons-round" style="font-size:18px">arrow_forward</span>\`;
  }
}

function updateStepIndicator() {
  const subtitles = ['Step 1 of 3 — Booking Details', 'Step 2 of 3 — Payment', 'Booking Confirmed!'];
  document.getElementById('modal-subtitle').textContent = subtitles[bookingStep - 1];

  const steps = [1, 2, 3];
  steps.forEach(s => {
    const circle = document.getElementById(\`step-\${s}-circle\`);
    const label  = document.getElementById(\`step-\${s}-label\`);
    if (!circle) return;

    if (s < bookingStep) {
      circle.style.background = '#10B981';
      circle.style.color = 'white';
      circle.innerHTML = '<span class="material-icons-round" style="font-size:14px">check</span>';
      if (label) label.style.color = '#10B981';
    } else if (s === bookingStep) {
      circle.style.background = '#3B82F6';
      circle.style.color = 'white';
      circle.innerHTML = s;
      if (label) label.style.color = '#3B82F6';
    } else {
      circle.style.background = '#E2E8F0';
      circle.style.color = '#94A3B8';
      circle.innerHTML = s;
      if (label) label.style.color = '#94A3B8';
    }
  });

  const line1 = document.getElementById('line-1');
  const line2 = document.getElementById('line-2');
  if (line1) line1.style.background = bookingStep > 1 ? '#10B981' : '#E2E8F0';
  if (line2) line2.style.background = bookingStep > 2 ? '#10B981' : '#E2E8F0';
}

// ─── STEP 1: BOOKING DETAILS ─────────────────────────────────────────────────
function renderStep1() {
  const c = selectedCar;
  const today = new Date().toISOString().split('T')[0];
  const tmr   = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  document.getElementById('modal-body').innerHTML = \`
    <!-- Car Summary -->
    <div style="background:linear-gradient(135deg,#EFF6FF,#DBEAFE); border-radius:14px;
      padding:16px; display:flex; align-items:center; gap:14px; margin-bottom:20px;">
      <div style="width:52px; height:52px; background:white; border-radius:12px; display:flex;
        align-items:center; justify-content:center; flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,0.08)">
        <span class="material-icons-round" style="font-size:28px; color:#3B82F6;">directions_car</span>
      </div>
      <div style="flex:1">
        <div style="font-size:15px; font-weight:700; color:#1E293B;">\${c.name}</div>
        <div style="font-size:12px; color:#64748B;">\${c.label} · \${c.fuel} · \${c.seats} Seats</div>
        <div style="display:flex; align-items:center; gap:4px; margin-top:3px;">
          <span class="material-icons-round" style="font-size:13px; color:#F59E0B;">star</span>
          <span style="font-size:12px; font-weight:600; color:#1E293B;">\${c.rating}</span>
          <span style="font-size:12px; color:#94A3B8;">(\${c.reviews} reviews)</span>
        </div>
      </div>
      <div style="text-align:right; flex-shrink:0;">
        <div style="font-size:22px; font-weight:800; color:#1D4ED8;">RM \${c.price}</div>
        <div style="font-size:11px; color:#94A3B8; font-weight:500;">per day</div>
      </div>
    </div>

    <!-- Form Fields -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:14px;">
      <div class="wd-field" style="grid-column:1/-1">
        <label>Full Name</label>
        <input type="text" id="f-name" placeholder="Muhammad Danial Hakim" />
      </div>
      <div class="wd-field">
        <label>Phone Number</label>
        <input type="tel" id="f-phone" placeholder="010-271 9558" />
      </div>
      <div class="wd-field">
        <label>IC / Passport No.</label>
        <input type="text" id="f-ic" placeholder="030101-XX-XXXX" />
      </div>
      <div class="wd-field">
        <label>Pickup Date</label>
        <input type="date" id="f-pickup" value="\${today}" onchange="calcDays()" />
      </div>
      <div class="wd-field">
        <label>Return Date</label>
        <input type="date" id="f-return" value="\${tmr}" onchange="calcDays()" />
      </div>
      <div class="wd-field" style="grid-column:1/-1">
        <label>Pickup Location</label>
        <select id="f-location">
          <option>Melaka Sentral</option>
          <option>UTeM Campus</option>
          <option>Mahkota Parade</option>
          <option>KLIA / KLIA2</option>
          <option>Kuala Lumpur City Centre</option>
        </select>
      </div>
    </div>

    <!-- Order Summary -->
    <div id="order-summary" style="background:var(--bg-surface,#F8FAFC); border-radius:12px; padding:16px;">
      <div style="font-size:12px; font-weight:700; color:var(--text-muted,#94A3B8);
        text-transform:uppercase; letter-spacing:0.5px; margin-bottom:10px;">Order Summary</div>
      <div id="summary-rows"></div>
    </div>
  \`;

  calcDays();
}

function calcDays() {
  const p = document.getElementById('f-pickup')?.value;
  const r = document.getElementById('f-return')?.value;
  if (p && r) {
    const diff = Math.ceil((new Date(r) - new Date(p)) / 86400000);
    bookingDays = diff > 0 ? diff : 1;
  }
  renderSummary();
}

function renderSummary() {
  const c = selectedCar;
  const subtotal = c.price * bookingDays;
  const insurance = 20;
  const sst = Math.round(subtotal * 0.06);
  const total = subtotal + insurance + sst;
  window._bookingTotal = total;

  const rows = [
    [\`Rental (RM \${c.price} × \${bookingDays} day\${bookingDays > 1 ? 's' : ''})\`, \`RM \${subtotal}\`],
    ['Insurance coverage', \`RM \${insurance}\`],
    ['SST (6%)', \`RM \${sst}\`],
  ];

  const el = document.getElementById('summary-rows');
  if (!el) return;
  el.innerHTML = rows.map(([k, v]) => \`
    <div style="display:flex; justify-content:space-between; padding:6px 0;
      font-size:13px; color:var(--text-secondary,#64748B); border-bottom:1px dashed var(--border-light,#E2E8F0);">
      <span>\${k}</span><span>\${v}</span>
    </div>
  \`).join('') + \`
    <div style="display:flex; justify-content:space-between; padding:10px 0 0;
      font-size:15px; font-weight:700; color:var(--text-primary,#1E293B);">
      <span>Total</span>
      <span style="color:#1D4ED8;">RM \${total}</span>
    </div>
  \`;
}

// ─── STEP 2: PAYMENT ─────────────────────────────────────────────────────────
function renderStep2() {
  const total = window._bookingTotal || selectedCar.price;

  document.getElementById('modal-body').innerHTML = \`
    <p style="font-size:13px; color:var(--text-muted,#94A3B8); margin-bottom:16px;">
      Select your preferred payment method to complete the booking.
    </p>

    <!-- Payment Options -->
    <div style="display:flex; gap:10px; margin-bottom:20px;" id="pay-opts">
      <button class="pay-opt selected" onclick="selectPay(this, 'card')">
        <span class="pay-icon">💳</span>
        <span class="pay-label">Credit / Debit Card</span>
      </button>
      <button class="pay-opt" onclick="selectPay(this, 'fpx')">
        <span class="pay-icon">🏧</span>
        <span class="pay-label">Online Banking (FPX)</span>
      </button>
      <button class="pay-opt" onclick="selectPay(this, 'ewallet')">
        <span class="pay-icon">📱</span>
        <span class="pay-label">eWallet</span>
      </button>
    </div>

    <!-- Card Form -->
    <div id="pay-form">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
        <div class="wd-field" style="grid-column:1/-1">
          <label>Cardholder Name</label>
          <input type="text" id="p-name" placeholder="Name on card" />
        </div>
        <div class="wd-field" style="grid-column:1/-1; position:relative;">
          <label>Card Number</label>
          <input type="text" id="p-cardno" placeholder="1234 5678 9012 3456"
            maxlength="19" oninput="fmtCard(this)" />
          <span class="material-icons-round" style="position:absolute; right:14px; top:34px;
            color:var(--text-muted,#94A3B8); font-size:20px; pointer-events:none;">credit_card</span>
        </div>
        <div class="wd-field">
          <label>Expiry Date</label>
          <input type="text" id="p-expiry" placeholder="MM/YY" maxlength="5" oninput="fmtExpiry(this)" />
        </div>
        <div class="wd-field">
          <label>CVV</label>
          <input type="text" id="p-cvv" placeholder="•••" maxlength="3" />
        </div>
      </div>
    </div>

    <!-- Total Reminder -->
    <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:12px;
      padding:14px 16px; margin-top:16px; display:flex; align-items:center; justify-content:space-between;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="material-icons-round" style="color:#3B82F6; font-size:20px;">receipt_long</span>
        <span style="font-size:13px; font-weight:600; color:#1E3A8A;">Amount to Pay</span>
      </div>
      <span style="font-size:20px; font-weight:800; color:#1D4ED8;">RM \${total}</span>
    </div>
  \`;
}

function selectPay(btn, method) {
  document.querySelectorAll('.pay-opt').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  const formEl = document.getElementById('pay-form');
  if (method === 'card') {
    formEl.innerHTML = \`
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
        <div class="wd-field" style="grid-column:1/-1">
          <label>Cardholder Name</label>
          <input type="text" id="p-name" placeholder="Name on card" />
        </div>
        <div class="wd-field" style="grid-column:1/-1; position:relative;">
          <label>Card Number</label>
          <input type="text" id="p-cardno" placeholder="1234 5678 9012 3456"
            maxlength="19" oninput="fmtCard(this)" />
          <span class="material-icons-round" style="position:absolute; right:14px; top:34px;
            color:var(--text-muted,#94A3B8); font-size:20px; pointer-events:none;">credit_card</span>
        </div>
        <div class="wd-field">
          <label>Expiry Date</label>
          <input type="text" placeholder="MM/YY" maxlength="5" oninput="fmtExpiry(this)" />
        </div>
        <div class="wd-field">
          <label>CVV</label>
          <input type="text" placeholder="•••" maxlength="3" />
        </div>
      </div>\`;
  } else if (method === 'fpx') {
    formEl.innerHTML = \`
      <div class="wd-field">
        <label>Select Bank</label>
        <select>
          <option>Maybank2u</option>
          <option>CIMB Clicks</option>
          <option>Public Bank</option>
          <option>RHB Now</option>
          <option>Hong Leong Connect</option>
          <option>AmBank</option>
          <option>Bank Islam</option>
        </select>
      </div>
      <p style="font-size:12px; color:var(--text-muted,#94A3B8); margin-top:8px;">
        You will be redirected to your bank's secure portal to complete payment.
      </p>\`;
  } else {
    formEl.innerHTML = \`
      <div class="wd-field">
        <label>Select eWallet</label>
        <select>
          <option>Touch 'n Go eWallet</option>
          <option>GrabPay</option>
          <option>Boost</option>
          <option>ShopeePay</option>
          <option>BigPay</option>
        </select>
      </div>
      <p style="font-size:12px; color:var(--text-muted,#94A3B8); margin-top:8px;">
        You will be redirected to your eWallet app to authorise payment.
      </p>\`;
  }
}

function fmtCard(el) {
  let v = el.value.replace(/\\D/g, '').substring(0, 16);
  el.value = v.replace(/(.{4})/g, '$1 ').trim();
}

function fmtExpiry(el) {
  let v = el.value.replace(/\\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + '/' + v.substring(2);
  el.value = v;
}

// ─── STEP 3: CONFIRMATION ────────────────────────────────────────────────────
function renderStep3() {
  const c = selectedCar;
  const ref = 'WD-' + Date.now().toString(36).toUpperCase().slice(-6);
  const pickup = document.getElementById('f-pickup')?.value || '—';
  const ret    = document.getElementById('f-return')?.value || '—';
  const loc    = document.getElementById('f-location')?.value || 'Melaka Sentral';
  const total  = window._bookingTotal || c.price;
  const name   = document.getElementById('f-name')?.value || 'Customer';

  document.getElementById('modal-body').innerHTML = \`
    <div style="text-align:center; padding:10px 0 20px;">
      <!-- Success Icon -->
      <div style="width:80px; height:80px; background:#DCFCE7; border-radius:50%;
        display:flex; align-items:center; justify-content:center; margin:0 auto 20px;">
        <span class="material-icons-round" style="font-size:44px; color:#10B981;">check_circle</span>
      </div>

      <h3 style="font-size:22px; font-weight:800; color:var(--text-primary,#1E293B); margin-bottom:6px;">
        Booking Confirmed!
      </h3>
      <p style="font-size:14px; color:var(--text-muted,#94A3B8); margin-bottom:20px;">
        Thank you, \${name}! Your car has been reserved.
      </p>

      <!-- Booking Reference -->
      <div style="background:#1E293B; color:white; font-size:20px; font-weight:800;
        letter-spacing:4px; padding:12px 28px; border-radius:10px; display:inline-block; margin-bottom:4px;">
        \${ref}
      </div>
      <p style="font-size:11px; color:var(--text-muted,#94A3B8); margin-bottom:24px;">Booking Reference</p>

      <!-- Booking Summary Card -->
      <div style="background:var(--bg-surface,#F8FAFC); border-radius:14px; padding:18px; text-align:left;">
        <div style="font-size:12px; font-weight:700; color:var(--text-muted,#94A3B8);
          text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">Booking Summary</div>

        \${[
          ['directions_car', 'Vehicle',  c.name],
          ['calendar_today','Pickup Date', pickup],
          ['event',         'Return Date', ret],
          ['location_on',   'Location', loc],
          ['payments',      'Total Paid', \`RM \${total}\`],
        ].map(([icon, label, val]) => \`
          <div style="display:flex; align-items:center; gap:10px; padding:8px 0;
            border-bottom:1px solid var(--border-light,#E2E8F0);">
            <span class="material-icons-round" style="font-size:18px; color:#3B82F6;">\${icon}</span>
            <span style="font-size:12px; color:var(--text-muted,#94A3B8); flex:1;">\${label}</span>
            <span style="font-size:13px; font-weight:600; color:var(--text-primary,#1E293B);">\${val}</span>
          </div>
        \`).join('')}
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; gap:12px; margin-top:20px;">
        <button onclick="closeBookingModal()" style="flex:1; padding:12px; background:var(--bg-surface,#F1F5F9);
          border:none; border-radius:10px; font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
          cursor:pointer; color:var(--text-primary,#1E293B); transition:background 0.2s;"
          onmouseover="this.style.background='#E2E8F0'"
          onmouseout="this.style.background='var(--bg-surface,#F1F5F9)'">
          Close
        </button>
        <button onclick="closeBookingModal(); showToast('📋 Booking details sent to your email!')"
          style="flex:2; padding:12px; background:#3B82F6; color:white; border:none; border-radius:10px;
          font-family:'Inter',sans-serif; font-size:14px; font-weight:700; cursor:pointer; transition:all 0.2s;
          display:flex; align-items:center; justify-content:center; gap:8px;"
          onmouseover="this.style.background='#1D4ED8'"
          onmouseout="this.style.background='#3B82F6'">
          <span class="material-icons-round" style="font-size:18px;">email</span>
          Email Receipt
        </button>
      </div>
    </div>
  \`;
}

// ─── NEXT / PREV STEP ────────────────────────────────────────────────────────
function nextStep() {
  if (bookingStep === 1) {
    if (!validateStep1()) return;
    bookingStep = 2;
  } else if (bookingStep === 2) {
    bookingStep = 3;
    // Simulate processing
    const btn = document.getElementById('btn-next');
    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;animation:spin 1s linear infinite">refresh</span> Processing...';
    btn.disabled = true;
    setTimeout(() => {
      btn.disabled = false;
      renderModalStep();
    }, 1500);
    return;
  }
  renderModalStep();
  document.getElementById('booking-modal').scrollTop = 0;
}

function prevStep() {
  if (bookingStep > 1) { bookingStep--; renderModalStep(); }
  document.getElementById('booking-modal').scrollTop = 0;
}

function validateStep1() {
  const name  = document.getElementById('f-name')?.value.trim();
  const phone = document.getElementById('f-phone')?.value.trim();
  const ic    = document.getElementById('f-ic')?.value.trim();
  const pickup = document.getElementById('f-pickup')?.value;
  const ret    = document.getElementById('f-return')?.value;

  if (!name)  { showToast('⚠️ Please enter your full name'); return false; }
  if (!phone) { showToast('⚠️ Please enter your phone number'); return false; }
  if (!ic)    { showToast('⚠️ Please enter your IC / Passport number'); return false; }
  if (!pickup || !ret) { showToast('⚠️ Please select pickup and return dates'); return false; }
  if (new Date(ret) <= new Date(pickup)) { showToast('⚠️ Return date must be after pickup date'); return false; }
  return true;
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('wd-toast');
  t.textContent = msg;
  t.style.transform = 'translateX(-50%) translateY(0)';
  t.style.opacity = '1';
  setTimeout(() => {
    t.style.transform = 'translateX(-50%) translateY(80px)';
    t.style.opacity = '0';
  }, 3000);
}

// ─── CHATBOT LOGIC (unchanged) ───────────────────────────────────────────────
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatbot-panel').classList.toggle('open', chatOpen);
  document.getElementById('fab-icon').textContent = chatOpen ? 'close' : 'smart_toy';
  document.getElementById('notif-badge').style.display = 'none';
  if (chatOpen && document.getElementById('chat-messages').children.length === 0) {
    addChatMsg('Hi! I\\'m your <strong>WeDRIVE AI Assistant</strong>.<br/>I can help you find the perfect car, assist with booking, or answer any questions. How can I help?', false);
  }
  if (chatOpen) setTimeout(() => document.getElementById('chat-input').focus(), 300);
}

function addChatMsg(text, isUser = false, showCar = false) {
  const msgs = document.getElementById('chat-messages');
  const t = new Date().toLocaleTimeString('en-MY', { hour:'2-digit', minute:'2-digit' });
  const div = document.createElement('div');
  div.className = \`chat-msg \${isUser ? 'user' : 'bot'}\`;
  div.innerHTML = \`
    <div class="chat-avatar">\${isUser ? 'U' : '<span class="material-icons-round" style="font-size:15px">smart_toy</span>'}</div>
    <div>
      <div class="chat-bubble">\${text}</div>
      \${showCar ? \`
      <div class="mini-car-card">
        <div class="mini-car-icon"><span class="material-icons-round">directions_car</span></div>
        <div class="mini-car-info">
          <div class="c-name">Top Pick: Honda CR-V 2024</div>
          <div class="c-price">RM 200/day · SUV · Hybrid</div>
        </div>
        <button class="mini-book-btn" onclick="document.getElementById('cars-grid').scrollIntoView({behavior:'smooth'})">View</button>
      </div>\` : ''}
      <div class="chat-time">\${t}</div>
    </div>\`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot'; div.id = 'chat-typing';
  div.innerHTML = \`
    <div class="chat-avatar"><span class="material-icons-round" style="font-size:15px">smart_toy</span></div>
    <div class="chat-bubble"><div class="typing-indicator"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div></div>\`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() { const t = document.getElementById('chat-typing'); if (t) t.remove(); }

const botReplies = {
  available: ['We have <strong>6 cars available</strong> right now! Scroll down to browse all options or use the filters above.', true],
  recommend: ['Based on popular choices, I recommend the <strong>Honda CR-V 2024</strong> — great for families and weekend trips! Here\\'s a quick look:', true],
  book: ['Booking is easy! Just:<br/>1. Select your car below<br/>2. Click <strong>Book Now</strong><br/>3. Fill in your details<br/>4. Complete payment<br/><br/>Need help choosing a car?', false],
  payment: ['We accept:<br/>💳 Credit/Debit Card (Visa, Mastercard)<br/>🏧 Online Banking (FPX)<br/>📱 eWallet (Touch\\'n Go, GrabPay, Boost)<br/>💵 Cash at counter', false],
  default: ['Thanks for your message! I\\'m here to help with car rentals. You can also browse cars below or use the filter chips to narrow your search.', false]
};

function getReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('available') || (m.includes('car') && m.includes('today'))) return 'available';
  if (m.includes('recommend') || m.includes('suggest') || m.includes('best')) return 'recommend';
  if (m.includes('book') || m.includes('how')) return 'book';
  if (m.includes('pay') || m.includes('payment')) return 'payment';
  return 'default';
}

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  addChatMsg(msg, true);
  input.value = ''; input.style.height = 'auto';
  showTypingIndicator();
  setTimeout(() => {
    removeTyping();
    const key = getReply(msg);
    const [reply, showCar] = botReplies[key];
    addChatMsg(reply, false, showCar);
  }, 1000);
}

function quickSend(text) { document.getElementById('chat-input').value = text; sendChat(); }
function chatKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }
