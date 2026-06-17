/**
 * WeDRIVE - Reusable Chatbot Component (Personalized)
 * shared/js/chatbot.js
 * 
 * Features:
 * - Personalized per logged-in customer (name, bookings, verification status)
 * - Live car data from Supabase
 * - Guest mode fallback for non-logged-in users
 *
 * Inject this into pages by placing:
 * <div id="chatbot-placeholder"></div>
 * And including this script.
 */

(function() {
  'use strict';

  function resolveBase() {
    var parts = window.location.pathname.split('/').filter(Boolean);
    if (!parts.length || !parts[parts.length - 1].includes('.')) return '';
    return parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
  }

  const HTML = `
  <!-- CHATBOT PANEL -->
  <div class="chatbot-panel" id="chatbot-panel">
    <div class="chat-panel-header">
      <div class="chat-bot-info">
        <div class="chat-bot-avatar"><span class="material-icons-round">smart_toy</span></div>
        <div>
          <div class="chat-bot-name" data-key="chatbot_bot_name">WeDRIVE AI</div>
          <div class="chat-bot-status"><div class="status-dot-sm"></div> <span data-key="chatbot_bot_status">Online · Ready to help</span></div>
        </div>
      </div>
      <button class="chat-close-btn" onclick="toggleChat()">
        <span class="material-icons-round">close</span>
      </button>
    </div>
    <div class="chat-suggestions" id="chat-suggestions">
      <button class="sug-chip" onclick="quickSend('Cars available today?')" data-key="chatbot_q1">Available cars</button>
      <button class="sug-chip" onclick="quickSend('Recommend me a car')" data-key="chatbot_q2">Recommend</button>
      <button class="sug-chip" onclick="quickSend('How to book?')" data-key="chatbot_q3">How to book</button>
      <button class="sug-chip" onclick="quickSend('Payment options?')" data-key="chatbot_q4">Payment</button>
    </div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="chat-input-wrap">
      <textarea class="chat-input" id="chat-input" rows="1"
        data-key-ph="chatbot_input_ph"
        placeholder="Ask about cars, bookings..."
        onkeydown="chatKey(event)" oninput="this.style.height='auto';this.style.height=Math.min(this.scrollHeight,80)+'px'"
      ></textarea>
      <button class="chat-send" onclick="sendChat()"><span class="material-icons-round">send</span></button>
    </div>
  </div>

  <!-- CHATBOT FAB -->
  <div class="chatbot-fab" id="chatbot-fab" onclick="toggleChat()">
    <span class="material-icons-round" id="fab-icon">smart_toy</span>
    <div class="fab-label" data-key="nav_ai">AI Assistant</div>
    <div class="notif-badge" id="notif-badge">1</div>
  </div>
  `;

  function initChatbot() {
    var placeholder = document.getElementById('chatbot-placeholder');
    if (!placeholder) return;

    var base = resolveBase();

    placeholder.setAttribute('role', 'complementary');
    placeholder.setAttribute('aria-label', 'AI chatbot');

    // Inject HTML
    placeholder.innerHTML = HTML;

    // Inject CSS
    if (!document.getElementById('chatbot-css')) {
      var link = document.createElement('link');
      link.id = 'chatbot-css';
      link.rel = 'stylesheet';
      link.href = base + 'shared/css/chatbot.css';
      document.head.appendChild(link);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

})();

// --- GLOBAL CHATBOT LOGIC ---

window.chatOpen = false;
window.chatbotData = null;       // Cache for chatbot settings
window._chatUserData = null;     // Cache for logged-in user personal data
window._chatUserLoaded = false;  // Flag to prevent re-fetching

// ─── Fetch Personal User Data ───────────────────────────────────────────────
async function fetchChatUserData() {
  if (window._chatUserLoaded) return window._chatUserData;
  window._chatUserLoaded = true;

  try {
    // If on an account auth page, do not load personal data to prevent confusing greetings
    if (window.location.pathname.includes('/account/')) {
      return null;
    }

    // Get current auth session
    var sessionResult = await window.supabaseClient.auth.getSession();
    if (!sessionResult.data.session) return null;

    var user = sessionResult.data.session.user;
    var authUid = user.id;

    // Fetch customer profile
    var profileResult = await window.supabaseClient
      .from('customers')
      .select('name, email, phone, ic, license, verification_status, joined')
      .eq('auth_uid', authUid)
      .maybeSingle();

    var profile = profileResult.data || null;

    // Fetch customer bookings
    var bookingsResult = await window.supabaseClient
      .from('bookings')
      .select('booking_id, car, start_date, end_date, days, daily, total, status, payment, pickup, dropoff')
      .eq('auth_uid', authUid)
      .order('start_date', { ascending: false })
      .limit(10);

    var bookings = bookingsResult.data || [];

    window._chatUserData = {
      authUid: authUid,
      profile: profile,
      bookings: bookings
    };

    return window._chatUserData;
  } catch (e) {
    console.warn('[Chatbot] Failed to fetch user data:', e);
    return null;
  }
}

// ─── Build Personal Context String ──────────────────────────────────────────
function buildPersonalContext(userData) {
  if (!userData || !userData.profile) return '';

  var lines = [];
  var p = userData.profile;

  lines.push('\n\n[PERSONAL CUSTOMER DATA — This customer is logged in]');
  lines.push('Customer Name: ' + (p.name || 'Not set'));
  lines.push('Email: ' + (p.email || 'Not set'));
  if (p.phone) lines.push('Phone: ' + p.phone);
  if (p.joined) lines.push('Member since: ' + p.joined);

  // Verification status
  if (p.verification_status) {
    lines.push('Account Verification: ' + p.verification_status);
    if (p.verification_status === 'Pending') {
      lines.push('(Their documents are under review. They cannot book until verified.)');
    } else if (p.verification_status === 'Rejected') {
      lines.push('(Their verification was rejected. They need to re-submit documents.)');
    } else if (p.verification_status === 'Verified') {
      lines.push('(Fully verified - can book cars.)');
    }
  } else {
    lines.push('Account Verification: Not submitted (Profile incomplete - need to complete profile first)');
  }

  // Missing docs warning
  if (!p.ic || !p.license) {
    lines.push('WARNING: Customer has not completed their profile (missing IC/License). Remind them to complete profile before booking.');
  }

  // Bookings
  var bookings = userData.bookings || [];
  if (bookings.length > 0) {
    lines.push('\nBooking History (' + bookings.length + ' recent):');

    var today = new Date().toISOString().split('T')[0];

    bookings.forEach(function(b) {
      var statusTag = b.status;
      if ((b.status === 'Active' || b.status === 'Confirmed') && b.start_date <= today && b.end_date >= today) {
        statusTag = 'ACTIVE NOW';
      } else if (b.status === 'Confirmed' && b.start_date > today) {
        statusTag = 'Upcoming';
      }

      lines.push('- ' + (b.booking_id || 'N/A') + ': ' + (b.car || 'Unknown') +
        ' | ' + b.start_date + ' to ' + b.end_date +
        ' | ' + b.days + ' days | RM' + b.total +
        ' | Status: ' + statusTag +
        ' | Payment: ' + (b.payment || 'N/A'));
    });

    // Active booking summary
    var active = bookings.filter(function(b) {
      return (b.status === 'Active' || b.status === 'Confirmed') && b.start_date <= today && b.end_date >= today;
    });
    if (active.length > 0) {
      lines.push('\nCurrent active rental: ' + active[0].car + ' (return by ' + active[0].end_date + ')');
    }

    // Upcoming bookings
    var upcoming = bookings.filter(function(b) {
      return b.status === 'Confirmed' && b.start_date > today;
    });
    if (upcoming.length > 0) {
      lines.push('Upcoming booking: ' + upcoming[0].car + ' starting ' + upcoming[0].start_date);
    }
  } else {
    lines.push('\nNo booking history yet. This is a new customer.');
  }

  lines.push('\nWhen answering, address them by name. Refer to their booking data when they ask about their rentals.');
  lines.push('[END PERSONAL DATA]');

  return lines.join('\n');
}

// ─── Toggle Chat ────────────────────────────────────────────────────────────
window.toggleChat = async function() {
  window.chatOpen = !window.chatOpen;
  document.getElementById('chatbot-panel').classList.toggle('open', window.chatOpen);
  document.getElementById('fab-icon').textContent = window.chatOpen ? 'close' : 'smart_toy';
  document.getElementById('notif-badge').style.display = 'none';
  
  if (window.chatOpen && document.getElementById('chat-messages').children.length === 0) {
    window.showTypingIndicator();

    // Fetch user data + chatbot settings in parallel
    var results = await Promise.all([
      fetchChatUserData(),
      (async function() {
        if (!window.chatbotData) {
          try { window.chatbotData = await window.WeDriveAPI.getChatbotSettings(); } catch(e) {}
        }
        return window.chatbotData;
      })()
    ]);

    var userData = results[0];
    var settings = results[1] || {};

    window.removeTyping();

    // Personalized greeting
    var greeting = settings.greeting || 'Hi! I am your WeDRIVE AI Assistant. How can I help?';
    if (userData && userData.profile && userData.profile.name) {
      var firstName = userData.profile.name.split(' ')[0];
      greeting = 'Hi <strong>' + firstName + '</strong>! I\'m your personal WeDRIVE assistant. I can see your account and bookings. How can I help you today?';
    }
    window.addChatMsg(greeting, false);

    // Update suggestion chips for logged-in users
    if (userData && userData.profile) {
      var sugContainer = document.getElementById('chat-suggestions');
      if (sugContainer) {
        sugContainer.innerHTML = '';

        var chips = [
          { text: 'My bookings', query: 'Show me my bookings' },
          { text: 'Available cars', query: 'Cars available today?' },
          { text: 'Recommend', query: 'Recommend me a car' },
          { text: 'My account', query: 'What is my account status?' }
        ];

        // Add active booking chip if applicable
        if (userData.bookings && userData.bookings.length > 0) {
          var today = new Date().toISOString().split('T')[0];
          var hasActive = userData.bookings.some(function(b) {
            return (b.status === 'Active' || b.status === 'Confirmed') && b.start_date <= today && b.end_date >= today;
          });
          if (hasActive) {
            chips.unshift({ text: 'My active rental', query: 'Tell me about my current active rental' });
            chips.pop(); // Remove last to keep max 4
          }
        }

        chips.forEach(function(c) {
          var btn = document.createElement('button');
          btn.className = 'sug-chip';
          btn.textContent = c.text;
          btn.onclick = function() { quickSend(c.query); };
          sugContainer.appendChild(btn);
        });
      }
    }
  }
  if (window.chatOpen) setTimeout(() => document.getElementById('chat-input').focus(), 300);
};

// ─── Add Chat Message ───────────────────────────────────────────────────────
window.addChatMsg = function(text, isUser = false, showCar = false) {
  const msgs = document.getElementById('chat-messages');
  const t = new Date().toLocaleTimeString('en-MY', { hour:'2-digit', minute:'2-digit' });

  // User avatar: show first letter of name if logged in
  var userAvatar = 'U';
  if (isUser && window._chatUserData && window._chatUserData.profile && window._chatUserData.profile.name) {
    userAvatar = window._chatUserData.profile.name.charAt(0).toUpperCase();
  }

  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `
    <div class="chat-avatar">${isUser ? userAvatar : '<span class="material-icons-round chat-avatar-icon">smart_toy</span>'}</div>
    <div>
      <div class="chat-bubble">${text}</div>
      ${showCar ? `
      <div class="mini-car-card">
        <div class="mini-car-icon"><span class="material-icons-round">directions_car</span></div>
        <div class="mini-car-info">
          <div class="c-name">Top Pick: 2023 Mercedes-Benz GLA250 AMG Line 2.0</div>
          <div class="c-price">RM 320/day · SUV · Petrol</div>
        </div>
        <button class="mini-book-btn" onclick="document.getElementById('cars-grid') ? document.getElementById('cars-grid').scrollIntoView({behavior:'smooth'}) : window.location.href='customer/pages/customer.html'">View</button>
      </div>` : ''}
      <div class="chat-time">${t}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
};

window.showTypingIndicator = function() {
  const msgs = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot'; div.id = 'chat-typing';
  div.innerHTML = `
    <div class="chat-avatar"><span class="material-icons-round chat-avatar-icon">smart_toy</span></div>
    <div class="chat-bubble"><div class="typing-indicator"><div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
};

window.removeTyping = function() { const t = document.getElementById('chat-typing'); if (t) t.remove(); };


// ─── Send Chat Message ──────────────────────────────────────────────────────
window.sendChat = async function() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  window.addChatMsg(msg, true);
  input.value = ''; input.style.height = 'auto';
  window.showTypingIndicator();

  // Load settings (use window.chatbotData from Supabase if available, fallback to localStorage)
  let settings = window.chatbotData || {};
  if (!settings.apiKey) {
    try {
      const saved = localStorage.getItem('wedrive_chatbot_settings');
      if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
      }
    } catch (e) {}
  }

  const apiKey = settings.apiKey || '';
  const systemPrompt = settings.systemPrompt || "You are WeDRIVE Bot, a helpful AI assistant for WeDRIVE car rental in Melaka, Malaysia. Be friendly, concise, and helpful.";
  const promoContext = settings.promoContext || '';

  // Fetch LIVE car and settings data from Supabase
  let liveData = "";
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];
  
  liveData += `\n\n[LIVE SYSTEM DATA — Auto-synced from WeDRIVE Database]
- Today's Date: ${dateStr}
- Current Time: ${timeStr}
`;

  try {
    if (window.supabaseClient) {
      // 1. Company Settings from 'settings' table
      const settingsResult = await window.supabaseClient
        .from('settings')
        .select('value')
        .eq('key', 'main')
        .maybeSingle();

      if (settingsResult.data && settingsResult.data.value) {
        const s = settingsResult.data.value;
        liveData += `\nCompany & System Settings:
- Company Name: ${s.company_name || 'WeDRIVE Sdn Bhd'}
- Address/Location: ${s.company_address || 'Lot 123, Jalan Hang Tuah, 75300 Melaka'}
- Phone Contact: ${s.company_phone || '012-345 6789'}
- Email Contact: ${s.company_email || 'admin@wedrive.my'}
- Operating Hours: ${s.operating_hours || '8:00 AM - 10:00 PM daily'}
- Currency: ${s.currency || 'MYR'}
- Tax Rate: ${s.tax_rate !== undefined ? s.tax_rate : '6'}%
- Security Deposit: ${s.deposit_percentage !== undefined ? s.deposit_percentage : '20'}% of rental or standard deposit
- Rental Duration Limits: Min ${s.min_rental_days || '1'} day(s), Max ${s.max_rental_days || '30'} day(s)
- Late Return Fee: RM${s.late_fee_per_hour || '25'}/hour
`;
        if (s.pickup_locations && s.pickup_locations.length > 0) {
          liveData += `- Pickup & Drop-off Locations: ${s.pickup_locations.join(', ')}\n`;
        }
      } else {
        liveData += `\nCompany & System Settings (Default):
- Company Name: WeDRIVE Sdn Bhd
- Address/Location: Lot 123, Jalan Hang Tuah, 75300 Melaka
- Phone Contact: 012-345 6789
- Email Contact: admin@wedrive.my
- Operating Hours: 8AM - 10PM daily
- Security Deposit: RM 500 (refundable)
- Pickup & Drop-off Locations: Melaka Sentral, KLIA2, Dataran Pahlawan, Ayer Keroh, Jonker Street
`;
      }

      // 2. Available Cars
      const { data, error } = await window.supabaseClient
        .from('cars')
        .select('name, type, price, fuel, seats')
        .eq('status', 'Available');
        
      if (data && data.length > 0) {
        liveData += "\nAvailable Cars (Available for Booking):\n";
        data.forEach(c => {
          liveData += `- ${c.name} (${c.type}) : RM${c.price}/day | ${c.fuel} | ${c.seats} seats\n`;
        });
        liveData += "Use this exact available cars list when recommending cars. Do not make up cars that are not in this list.\n";
      } else {
        liveData += "\nCurrently NO cars are available. All cars are fully rented/booked.\n";
      }
    }
  } catch(e) {
    console.warn("Failed to fetch live system details for chatbot:", e);
    liveData += "\n[Live database details currently unavailable - fallback to general knowledge]";
  }

  // Fetch personal context (uses cache after first load)
  var userData = await fetchChatUserData();
  var personalContext = buildPersonalContext(userData);

  const fullSystem = systemPrompt + (promoContext ? '\n\n' + promoContext : '') + liveData + personalContext;

  if (!apiKey) {
    window.removeTyping();
    window.addChatMsg("I'm currently offline. Please ask the admin to configure the API key.", false);
    return;
  }

  // Build conversation history
  if (!window._chatHistory) window._chatHistory = [];
  window._chatHistory.push({ role: 'user', content: msg });

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'WeDRIVE Chatbot'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: fullSystem },
          ...window._chatHistory
        ],
        max_tokens: 2000
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response. Please try again.";
    window._chatHistory.push({ role: 'assistant', content: reply });
    window.removeTyping();
    window.addChatMsg(reply
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>'), false);
  } catch (e) {
    window.removeTyping();
    window.addChatMsg("Connection error. Please check your internet connection.", false);
  }
};

window.quickSend = function(text) { document.getElementById('chat-input').value = text; window.sendChat(); };
window.chatKey = function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.sendChat(); } };
