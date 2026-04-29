/**
 * WeDRIVE - Customer Module JS
 * Data fetched from shared/dummy/customer.json
 * Switch to real API endpoint when backend is ready.
 */

// ─── DATA SOURCE ─────────────────────────────────────────────────────────────
// When backend is ready, change this URL to the real API endpoint.
const DATA_URL = '../../shared/dummy/customer.json';

let allCars = []; // Global cars list populated after fetch

// ─── FETCH & INITIALISE ───────────────────────────────────────────────────────
fetch(DATA_URL)
  .then(res => {
    if (!res.ok) throw new Error('Failed to load car data');
    return res.json();
  })
  .then(data => {
    allCars = data.cars;
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
  alert(`Booking: ${car.name}\nRM ${car.price}/day\n\nRedirecting to booking confirmation...`);
}



// CHATBOT LOGIC
let chatOpen = false;

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chatbot-panel').classList.toggle('open', chatOpen);
  document.getElementById('fab-icon').textContent = chatOpen ? 'close' : 'smart_toy';
  document.getElementById('notif-badge').style.display = 'none';
  if (chatOpen && document.getElementById('chat-messages').children.length === 0) {
    addChatMsg('Hi! I\'m your <strong>WeDRIVE AI Assistant</strong>.<br/>I can help you find the perfect car, assist with booking, or answer any questions. How can I help?', false);
  }
  if (chatOpen) setTimeout(() => document.getElementById('chat-input').focus(), 300);
}

function addChatMsg(text, isUser = false, showCar = false) {
  const msgs = document.getElementById('chat-messages');
  const t = new Date().toLocaleTimeString('en-MY', { hour:'2-digit', minute:'2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `
    <div class="chat-avatar">${isUser ? 'U' : '<span class="material-icons-round" style="font-size:15px">smart_toy</span>'}</div>
    <div>
      <div class="chat-bubble">${text}</div>
      ${showCar ? `
      <div class="mini-car-card">
        <div class="mini-car-icon"><span class="material-icons-round">directions_car</span></div>
        <div class="mini-car-info">
          <div class="c-name">Top Pick: Honda CR-V 2024</div>
          <div class="c-price">RM 200/day · SUV · Hybrid</div>
        </div>
        <button class="mini-book-btn" onclick="document.getElementById('cars-grid').scrollIntoView({behavior:'smooth'})">View</button>
      </div>` : ''}
      <div class="chat-time">${t}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTypingIndicator() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot'; div.id = 'chat-typing';
  div.innerHTML = `
    <div class="chat-avatar"><span class="material-icons-round" style="font-size:15px">smart_toy</span></div>
    <div class="chat-bubble"><div class="typing-indicator"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() { const t = document.getElementById('chat-typing'); if (t) t.remove(); }

const botReplies = {
  available: ['We have <strong>6 cars available</strong> right now! Scroll down to browse all options or use the filters above.', true],
  recommend: ['Based on popular choices, I recommend the <strong>Honda CR-V 2024</strong> — great for families and weekend trips! Here is a quick look:', true],
  book: ['Booking is easy! Just:<br/>1. Select your car below<br/>2. Click <strong>Book Now</strong><br/>3. Fill in your dates<br/>4. Complete payment<br/><br/>Need help choosing a car?', false],
  payment: ['We accept:<br/>Credit/Debit Card (Visa, Mastercard)<br/>Online Banking (FPX)<br/>eWallet (Touch\'n Go, GrabPay)<br/>Cash at counter', false],
  default: ['Thanks for your message! I am here to help with car rentals. You can also browse cars below or use the filter chips to narrow your search.', false]
};

function getReply(msg) {
  const m = msg.toLowerCase();
  if (m.includes('available') || m.includes('car') && m.includes('today')) return 'available';
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
