/**
 * WeDRIVE - Customer Module JS
 * Data fetched from shared/dummy/customer.json
 * Switch to real API endpoint when backend is ready.
 */

let allCars = []; // Global cars list populated after fetch

// ─── FETCH & INITIALISE ───────────────────────────────────────────────────────
window.WeDriveAPI.getCars()
  .then(cars => {
    allCars = cars;
    renderCars(allCars);
  })
  .catch(() => {
    // Fallback: show error state in grid
    const grid = document.getElementById('cars-grid');
    if (grid) grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px;">Unable to load cars. Please refresh the page.</p>';
  });

// ─── RENDER ───────────────────────────────────────────────────────────────────
function renderCars(list) {
  const grid = document.getElementById('cars-grid');
  if (!grid) return;
  grid.innerHTML = list.map(c => `
    <div class="car-card" onclick="bookCar(${c.id})">
      <div class="car-img">
        <span class="material-icons-round no-img">directions_car</span>
        <div class="ai-chip"><span class="material-icons-round" style="font-size:12px">psychology</span> ${c.ai}</div>
      </div>
      <div class="car-body">
        <h3>${c.name}</h3>
        <p class="car-type">${c.label}</p>
        <div class="car-specs">
          <div class="spec"><span class="material-icons-round">local_gas_station</span>${c.fuel}</div>
          <div class="spec"><span class="material-icons-round">event_seat</span>${c.seats} Seats</div>
          <div class="spec"><span class="material-icons-round">settings</span>${c.trans}</div>
          <div class="spec"><span class="material-icons-round">check_circle</span>${c.status}</div>
        </div>
        <div class="car-footer">
          <div class="price">RM ${c.price}<span>/day</span></div>
          <button class="btn-book" onclick="event.stopPropagation();bookCar(${c.id})">Book Now</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── FILTER ───────────────────────────────────────────────────────────────────
function filterCars(type, btn) {
  document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = type === 'all' ? allCars : allCars.filter(c => c.type === type);
  renderCars(filtered);
}

// ─── BOOKING ──────────────────────────────────────────────────────────────────
function bookCar(id) {
  const car = allCars.find(c => c.id === id);
  if (!car) return;
  
  if (window.__GUEST_MODE__) {
    window.location.href = 'customer/pages/login.html';
    return;
  }
  
  alert(`Booking: ${car.name}\nRM ${car.price}/day\n\nRedirecting to booking confirmation...`);
}




