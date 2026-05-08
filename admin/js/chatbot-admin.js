/**
 * WeDRIVE - AI Chatbot Settings (Google Gemini)
 * admin/js/chatbot-admin.js
 *
 * Uses Google Gemini API free tier (gemini-2.0-flash)
 * Settings stored in localStorage for demo/FYP purposes.
 */

const STORAGE_KEY = 'wedrive_chatbot_settings';
const GEMINI_MODEL = 'gemini-2.0-flash';

// ─── Default Settings ───────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  apiKey: '',
  systemPrompt: `You are WeDRIVE Bot, a friendly and helpful AI assistant for WeDRIVE car rental service based in Melaka, Malaysia.

Your role:
- Help customers find and book rental cars
- Answer questions about pricing, availability, and policies
- Be professional but friendly, use simple language
- Reply in the same language the customer uses (Malay or English)
- Keep responses concise (2-3 sentences max unless more detail is needed)

Company Info:
- Company: WeDRIVE Sdn Bhd
- Location: Lot 123, Jalan Hang Tuah, 75300 Melaka
- Phone: 011-10852955
- Email: admin@wedrive.my
- Operating hours: 8AM - 10PM daily

Car Types Available:
- Sedan (Toyota Vios) - RM 120/day
- SUV (Honda CR-V) - RM 200/day
- Hatchback (Perodua Myvi, Honda Jazz) - RM 80-90/day
- Van (Toyota Hiace, 12 seater) - RM 350/day
- Luxury (BMW 3 Series) - RM 450/day

Booking Policy:
- Minimum 1 day rental
- Valid Malaysian driving license required
- Deposit: RM 500 (refundable)
- Free delivery within Melaka city`,

  promoContext: `Current Promotions:
- Weekend Special: 10% off for Fri-Sun bookings
- Weekly Rate: Book 7+ days and get 15% discount
- New Customer: First-time renters get RM 30 off`,

  greeting: "Hi there! I'm WeDRIVE Bot 🚗 How can I help you today?"
};

// ─── Conversation History (for test chat) ───────────────────────────────────
let chatHistory = [];

// ─── Load Settings ──────────────────────────────────────────────────────────
function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

// ─── Save Settings ──────────────────────────────────────────────────────────
window.saveSettings = function() {
  const btn = document.querySelector('.btn-save');
  const original = btn.innerHTML;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:18px">autorenew</span> Saving...';
  btn.disabled = true;

  const settings = {
    apiKey: document.getElementById('api-key').value.trim(),
    systemPrompt: document.getElementById('system-prompt').value.trim(),
    promoContext: document.getElementById('promo-context').value.trim(),
    greeting: document.getElementById('greeting-msg').value.trim()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  updateStatusBadge(settings.apiKey);
  showToast('Settings saved successfully!', false);

  setTimeout(() => {
    btn.innerHTML = original;
    btn.disabled = false;
  }, 600);
};

// ─── Test Connection ────────────────────────────────────────────────────────
window.testConnection = async function() {
  const apiKey = document.getElementById('api-key').value.trim();
  if (!apiKey) {
    showToast('Please enter an API key first', true);
    return;
  }

  const btn = document.querySelector('.btn-test');
  const original = btn.innerHTML;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:18px">autorenew</span> Testing...';
  btn.disabled = true;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Say "Connected!" in one word.' }] }]
      })
    });

    if (res.ok) {
      updateStatusBadge(apiKey, true);
      showToast('✅ Connected to Gemini API successfully!', false);
    } else {
      const err = await res.json();
      updateStatusBadge('', false);
      showToast('❌ API Error: ' + (err.error?.message || 'Invalid key'), true);
    }
  } catch (e) {
    updateStatusBadge('', false);
    showToast('❌ Connection failed: ' + e.message, true);
  } finally {
    btn.innerHTML = original;
    btn.disabled = false;
  }
};

// ─── Send Test Message ──────────────────────────────────────────────────────
window.sendTestMsg = async function() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const apiKey = document.getElementById('api-key').value.trim();
  if (!apiKey) {
    showToast('Set API key first to test the chatbot', true);
    return;
  }

  // Add user message
  appendMsg(text, 'user');
  input.value = '';

  // Add typing indicator
  const typingEl = appendTyping();

  // Build system instruction
  const systemPrompt = document.getElementById('system-prompt').value.trim();
  const promoContext = document.getElementById('promo-context').value.trim();
  const fullSystem = systemPrompt + (promoContext ? '\n\n' + promoContext : '');

  // Add to history
  chatHistory.push({ role: 'user', parts: [{ text }] });

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: fullSystem }] },
        contents: chatHistory
      })
    });

    typingEl.remove();

    if (res.ok) {
      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';
      chatHistory.push({ role: 'model', parts: [{ text: reply }] });
      appendMsg(reply, 'bot');
    } else {
      const err = await res.json();
      appendMsg('⚠️ Error: ' + (err.error?.message || 'API request failed'), 'bot');
    }
  } catch (e) {
    typingEl.remove();
    appendMsg('⚠️ Connection error: ' + e.message, 'bot');
  }
};

// ─── Toggle API Key Visibility ──────────────────────────────────────────────
window.toggleKey = function() {
  const input = document.getElementById('api-key');
  const icon = document.querySelector('.toggle-eye');
  if (input.type === 'password') {
    input.type = 'text';
    icon.textContent = 'visibility';
  } else {
    input.type = 'password';
    icon.textContent = 'visibility_off';
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function appendMsg(text, who) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  // Simple markdown-like: **bold** and newlines
  div.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function appendTyping() {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'msg typing';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

function updateStatusBadge(apiKey, forceConnected) {
  const badge = document.getElementById('api-status');
  if (forceConnected || (apiKey && apiKey.length > 10)) {
    badge.className = 'api-status connected';
    badge.innerHTML = '<span class="dot-indicator"></span> Connected';
  } else {
    badge.className = 'api-status disconnected';
    badge.innerHTML = '<span class="dot-indicator"></span> Not Connected';
  }
}

function showToast(message, isError) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const icon = toast.querySelector('.material-icons-round');
  toastText.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');
  icon.textContent = isError ? 'error' : 'check_circle';
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ─── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const settings = loadSettings();

  document.getElementById('api-key').value = settings.apiKey;
  document.getElementById('system-prompt').value = settings.systemPrompt;
  document.getElementById('promo-context').value = settings.promoContext;
  document.getElementById('greeting-msg').value = settings.greeting;

  updateStatusBadge(settings.apiKey);

  // Show greeting in test chat
  if (settings.greeting) {
    appendMsg(settings.greeting, 'bot');
  }
});
