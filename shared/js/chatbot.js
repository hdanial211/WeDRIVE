/**
 * WeDRIVE - Reusable Chatbot Component
 * shared/js/chatbot.js
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
    <div class="chat-suggestions">
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
window.chatbotData = null; // Cache for API data

window.toggleChat = async function() {
  window.chatOpen = !window.chatOpen;
  document.getElementById('chatbot-panel').classList.toggle('open', window.chatOpen);
  document.getElementById('fab-icon').textContent = window.chatOpen ? 'close' : 'smart_toy';
  document.getElementById('notif-badge').style.display = 'none';
  
  if (window.chatOpen && document.getElementById('chat-messages').children.length === 0) {
    window.showTypingIndicator();
    try {
      if (!window.chatbotData) {
        window.chatbotData = await window.WeDriveAPI.getChatbotSettings();
      }
      window.removeTyping();
      window.addChatMsg(window.chatbotData.greeting, false);
    } catch (e) {
      window.removeTyping();
      window.addChatMsg('Hi! I am your WeDRIVE AI Assistant. How can I help?', false);
    }
  }
  if (window.chatOpen) setTimeout(() => document.getElementById('chat-input').focus(), 300);
};

window.addChatMsg = function(text, isUser = false, showCar = false) {
  const msgs = document.getElementById('chat-messages');
  const t = new Date().toLocaleTimeString('en-MY', { hour:'2-digit', minute:'2-digit' });
  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'user' : 'bot'}`;
  div.innerHTML = `
    <div class="chat-avatar">${isUser ? 'U' : '<span class="material-icons-round chat-avatar-icon">smart_toy</span>'}</div>
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


window.sendChat = async function() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  window.addChatMsg(msg, true);
  input.value = ''; input.style.height = 'auto';
  window.showTypingIndicator();

  // Load settings from localStorage (set by admin chatbot page)
  let settings = {};
  try {
    const saved = localStorage.getItem('wedrive_chatbot_settings');
    settings = saved ? JSON.parse(saved) : {};
  } catch (e) { settings = {}; }

  const apiKey = settings.apiKey || '';
  const systemPrompt = settings.systemPrompt || "You are WeDRIVE Bot, a helpful AI assistant for WeDRIVE car rental in Melaka, Malaysia. Be friendly, concise, and helpful.";
  const promoContext = settings.promoContext || '';
  const fullSystem = systemPrompt + (promoContext ? '\n\n' + promoContext : '');

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
        model: 'google/gemini-2.5-flash-preview:free',
        messages: [
          { role: 'system', content: fullSystem },
          ...window._chatHistory
        ],
        max_tokens: 512
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

