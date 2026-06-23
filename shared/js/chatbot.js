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

function parseMarkdown(text) {
  if (!text) return '';
  
  // 1. Bold: **text** -> <strong>text</strong>
  var html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 2. Links: [Text](URL) -> <a href="$2">$1</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // 3. Bullet Lists: lines starting with * or -
  var lines = html.split('\n');
  var inList = false;
  var processedLines = [];
  
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        processedLines.push('<ul>');
        inList = true;
      }
      processedLines.push('<li>' + line.substring(2) + '</li>');
    } else {
      if (inList) {
        processedLines.push('</ul>');
        inList = false;
      }
      processedLines.push(lines[i]);
    }
  }
  if (inList) {
    processedLines.push('</ul>');
  }
  
  // Rejoin with <br> for non-list lines
  var resultHtml = '';
  for (var j = 0; j < processedLines.length; j++) {
    var item = processedLines[j];
    if (item === '<ul>' || item === '</ul>' || item.startsWith('<li>')) {
      resultHtml += item;
    } else {
      if (item === '') {
        resultHtml += '<br/>';
      } else {
        resultHtml += (resultHtml === '' || resultHtml.endsWith('</ul>') ? '' : '<br/>') + item;
      }
    }
  }
  
  return resultHtml;
}

// ─── Add Chat Message ───────────────────────────────────────────────────────
window.addChatMsg = function(text, isUser = false, showCar = null) {
  const msgs = document.getElementById('chat-messages');
  const t = new Date().toLocaleTimeString('en-MY', { hour:'2-digit', minute:'2-digit' });

  // User avatar: show first letter of name if logged in
  var userAvatar = 'U';
  if (isUser && window._chatUserData && window._chatUserData.profile && window._chatUserData.profile.name) {
    userAvatar = window._chatUserData.profile.name.charAt(0).toUpperCase();
  }

  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
  
  let carHtml = '';
  if (showCar && typeof showCar === 'object') {
    const carsArray = Array.isArray(showCar) ? showCar : [showCar];
    carHtml = carsArray.map(car => `
      <div class="mini-car-card" style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card, rgba(255,255,255,0.05)); border: 1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius: 12px; gap: 12px; max-width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); backdrop-filter: blur(10px);">
        <div class="mini-car-icon" style="color: var(--primary-color, #3b82f6); display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: rgba(59, 130, 246, 0.1);"><span class="material-icons-round">directions_car</span></div>
        <div class="mini-car-info" style="flex: 1; display: flex; flex-direction: column;">
          <div class="c-name" style="font-weight: 600; font-size: 13px; color: var(--text-color, #fff); line-height: 1.3;">${car.name}</div>
          <div class="c-price" style="font-size: 11px; color: var(--text-muted, #aaa); margin-top: 2px;">RM ${car.price}/day · ${(car.type || '').toUpperCase()}</div>
        </div>
        <button class="mini-book-btn" onclick="triggerChatBook(${car.id})" style="background: var(--primary-color, #3b82f6); color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;">Book</button>
      </div>
    `).join('');
  }

  // Parse markdown bold, links, lists and newlines
  var processedText = parseMarkdown(text);

  div.innerHTML = `
    <div class="chat-avatar">${isUser ? userAvatar : '<span class="material-icons-round chat-avatar-icon">smart_toy</span>'}</div>
    <div>
      <div class="chat-bubble">${processedText}</div>
      ${carHtml}
      <div class="chat-time">${t}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
};

window.triggerChatBook = function(carId) {
  if (typeof window.bookCar === 'function') {
    window.bookCar(carId);
  } else {
    var parts = window.location.pathname.split('/').filter(Boolean);
    var base = parts.length <= 1 ? '' : '../'.repeat(parts.length - 1);
    window.location.href = base + 'customer/pages/dashboard/customer.html?book=' + carId;
  }
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
- Pickup & Drop-off Locations: Melaka Sentral (Company HQ Office is at Lot 123, Jalan Hang Tuah, 75300 Melaka)
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

  var pathnameParts = window.location.pathname.split('/').filter(Boolean);
  var linkBase = pathnameParts.length <= 1 ? '' : '../'.repeat(pathnameParts.length - 1);

  const bookingRulesInstruction = `
[STRICT BOOKING RULES & STEPS]
You must guide users on how to book according to their authentication and verification status:

1. GUEST (Not logged in):
- If the user is a guest (indicated by the absence of a logged-in user profile under PERSONAL CUSTOMER DATA), they MUST register/signup and log in before they can book.
- Provide them this exact markdown link to signup: [Daftar Akaun / Signup](${linkBase}account/pages/signup/signup.html) (or if they already have an account: [Log Masuk / Login](${linkBase}account/pages/login/login.html)).
- Tell them the booking flow: Sign Up -> Complete Profile & Verify Documents -> Choose Car & Book.

2. LOGGED-IN CUSTOMER (Under PERSONAL CUSTOMER DATA):
Depending on their "Account Verification" and "Profile status":
- CASE A: Incomplete Profile (Missing IC, license, or "Account Verification" is not submitted/incomplete):
  - They MUST complete their profile and upload document images (IC Front, IC Back, Driving License Front, Driving License Back) first.
  - Explain the steps clearly: Go to Complete Profile page, fill in IC, License, Phone, and upload clear photos of documents.
  - Provide this exact markdown link: [Lengkapkan Profil / Complete Profile](${linkBase}account/pages/complete-profile/complete-profile.html).
- CASE B: Verification is 'Pending':
  - Inform them that their documents are currently being reviewed by the admin (usually within 24 hours).
  - They cannot book until the admin approves. Advise them to wait or contact support.
- CASE C: Verification is 'Rejected':
  - Inform them that their documents were rejected (mention the rejection reason if available under PERSONAL CUSTOMER DATA).
  - Advise them to re-upload clear, valid documents by clicking this link: [Re-submit Documents / Complete Profile](${linkBase}account/pages/complete-profile/complete-profile.html).
- CASE D: Verification is 'Verified':
  - They are fully verified and ready to book!
  - Recommend cars from the "Available Cars" list above.
  - To recommend a car, you MUST output the tag "[CAR_CARD: <carId>]" at the end of your message so the system can render an interactive booking card for that car (e.g. "[CAR_CARD: 2]" for Mercedes-Benz).
  - Tell them they can click "Book" on the card, choose their dates in the calendar, and proceed to checkout.

Always write the response in the language the user is chatting in (English or Malay).
Always use the exact markdown links built above. Do not use absolute domains.
`;

  const fullSystem = systemPrompt + (promoContext ? '\n\n' + promoContext : '') + liveData + personalContext + '\n\n' + bookingRulesInstruction;

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
    let reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't get a response. Please try again.";
    
    let recommendedCars = [];
    const carCardRegex = /\[CAR_CARD:\s*(\d+)\]/gi;
    let match;
    const carIds = [];
    while ((match = carCardRegex.exec(reply)) !== null) {
      carIds.push(Number(match[1]));
    }
    reply = reply.replace(carCardRegex, '').trim();

    if (carIds.length > 0) {
      if (window.supabaseClient) {
        try {
          const { data: carsData } = await window.supabaseClient
            .from('cars')
            .select('id, name, price, type')
            .in('id', carIds);
          if (carsData && carsData.length > 0) {
            recommendedCars = carIds.map(id => carsData.find(c => c.id === id)).filter(Boolean);
          }
        } catch (e) {
          console.warn("Failed to fetch recommended car details:", e);
        }
      }
      if (recommendedCars.length === 0) {
        recommendedCars = carIds.map(id => ({ id, name: "Available Rental Vehicle", price: "320", type: "Premium" }));
      } else if (recommendedCars.length < carIds.length) {
        carIds.forEach(id => {
          if (!recommendedCars.some(c => c.id === id)) {
            recommendedCars.push({ id, name: "Available Rental Vehicle", price: "320", type: "Premium" });
          }
        });
      }
    }

    window._chatHistory.push({ role: 'assistant', content: reply });
    window.removeTyping();
    window.addChatMsg(reply, false, recommendedCars.length > 0 ? recommendedCars : null);
  } catch (e) {
    window.removeTyping();
    window.addChatMsg("Connection error. Please check your internet connection.", false);
  }
};

window.quickSend = function(text) { document.getElementById('chat-input').value = text; window.sendChat(); };
window.chatKey = function(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); window.sendChat(); } };
