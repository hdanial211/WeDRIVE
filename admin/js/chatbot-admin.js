/**
 * WeDRIVE - AI Chatbot Settings (OpenRouter.ai)
 * admin/js/chatbot-admin.js
 *
 * Provider: OpenRouter.ai — unified API gateway (supports GPT-4o, Claude, Gemini, etc.)
 * Model:    google/gemini-2.0-flash-exp:free (default, free tier)
 * Settings stored in localStorage for demo/FYP purposes.
 */

const STORAGE_KEY = 'wedrive_chatbot_settings';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemini-2.5-flash';

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
- Phone: 012-345 6789
- Email: admin@wedrive.my
- Operating hours: 8AM - 10PM daily

Car Types Available:
- Sedan (BMW 320i M Sport) - RM 450/day
- SUV (Mercedes-Benz GLA250) - RM 320/day
- Hatchback (Perodua AXIA / Volkswagen Golf GTI) - RM 95-190/day
- MPV (Toyota Alphard, 7 seater) - RM 380/day
- Coupe/Truck (Mercedes CLS350 / Ford Ranger Raptor) - RM 360-420/day

Booking Policy:
- Minimum 1 day rental
- Valid Malaysian driving license required
- Deposit: RM 500 (refundable)
- Free delivery within Melaka city`,

  promoContext: `Current Promotions:
- Weekend Special: 10% off for Fri-Sun bookings
- Weekly Rate: Book 7+ days and get 15% discount
- New Customer: First-time renters get RM 30 off`,

  greeting: "Hi there! I'm WeDRIVE Bot. How can I help you today?"
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
window.saveSettings = function () {
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
  updateStatusBadge(settings);
  showToast('Settings saved successfully!', false);

  setTimeout(() => {
    btn.innerHTML = original;
    btn.disabled = false;
  }, 600);
};
// ─── Test Single Key (inline button) ────────────────────────────────────────
window.testSingleKey = async function (provider) {
  const key = document.getElementById('api-key').value.trim();
  const statusEl = document.getElementById('status-openrouter');
  const btn = document.getElementById('btn-test-openrouter');

  if (!key) {
    statusEl.className = 'key-status fail';
    statusEl.innerHTML = '<span class="material-icons-round">close</span> Please enter a key first';
    return;
  }

  const original = btn.innerHTML;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:16px">autorenew</span> Testing...';
  btn.disabled = true;
  statusEl.className = 'key-status';
  statusEl.innerHTML = '';

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'WeDRIVE Chatbot'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
        max_tokens: 10
      })
    });

    if (res.ok) {
      statusEl.className = 'key-status ok';
      statusEl.innerHTML = '<span class="material-icons-round">check_circle</span> OpenRouter connected successfully';
    } else {
      const err = await res.json().catch(() => ({}));
      statusEl.className = 'key-status fail';
      statusEl.innerHTML = `<span class="material-icons-round">error</span> ${err?.error?.message || 'Invalid key — check and try again'}`;
    }
  } catch (e) {
    statusEl.className = 'key-status fail';
    statusEl.innerHTML = `<span class="material-icons-round">error</span> Connection failed: ${e.message}`;
  }

  btn.innerHTML = original;
  btn.disabled = false;
  updateStatusBadge({ apiKey: document.getElementById('api-key').value.trim() });
};

// ─── Test Connection (full test via main button) ─────────────────────────────
window.testConnection = async function () {
  const key = document.getElementById('api-key').value.trim();

  if (!key) {
    showToast('Please enter your OpenRouter API key', true);
    return;
  }

  const btn = document.querySelector('.btn-test');
  const original = btn.innerHTML;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:18px">autorenew</span> Testing...';
  btn.disabled = true;

  try {
    const res = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'WeDRIVE Chatbot'
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
        max_tokens: 10
      })
    });

    if (res.ok) {
      updateStatusBadge({ apiKey: key }, true);
      showToast('OpenRouter connected successfully!', false);
    } else {
      const err = await res.json().catch(() => ({}));
      updateStatusBadge({}, false);
      showToast(err?.error?.message || 'Connection failed — check your API key', true);
    }
  } catch (e) {
    updateStatusBadge({}, false);
    showToast('Connection failed: ' + e.message, true);
  }

  btn.innerHTML = original;
  btn.disabled = false;
};

// ─── OpenRouter API Call ─────────────────────────────────────────────────────
async function callOpenRouter(apiKey, systemText, history) {
  const messages = [{ role: 'system', content: systemText }];
  for (const msg of history) {
    messages.push({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    });
  }

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'WeDRIVE Chatbot'
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 2000
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenRouter ${res.status}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response from OpenRouter.';
}

// ─── Send Test Message ───────────────────────────────────────────────────────
window.sendTestMsg = async function () {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const apiKey = document.getElementById('api-key').value.trim();

  if (!apiKey) {
    showToast('Set your OpenRouter API key first', true);
    return;
  }

  appendMsg(text, 'user');
  input.value = '';

  const sendBtn = document.getElementById('send-btn');
  sendBtn.disabled = true;

  const typingEl = appendTyping();

  const systemPrompt = document.getElementById('system-prompt').value.trim();
  const promoContext = document.getElementById('promo-context').value.trim();
  const fullSystem = systemPrompt + (promoContext ? '\n\n' + promoContext : '');

  chatHistory.push({ role: 'user', parts: [{ text }] });

  let reply = '';
  try {
    reply = await callOpenRouter(apiKey, fullSystem, chatHistory);
  } catch (e) {
    console.error('OpenRouter failed:', e.message);
  }

  typingEl.remove();

  if (reply) {
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    appendMsg(reply, 'bot');
  } else {
    appendMsg('Connection failed. Please check your API key and try again.', 'bot');
  }

  sendBtn.disabled = false;
};

// ─── Toggle API Key Visibility ──────────────────────────────────────────────
window.toggleKey = function (inputId, iconEl) {
  const input = document.getElementById(inputId);
  if (input.type === 'password') {
    input.type = 'text';
    iconEl.textContent = 'visibility';
  } else {
    input.type = 'password';
    iconEl.textContent = 'visibility_off';
  }
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function appendMsg(text, who) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${who}`;
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

function updateStatusBadge(settings, forceConnected) {
  const badge = document.getElementById('api-status');
  const hasKey = settings?.apiKey?.length > 10;

  if (forceConnected || hasKey) {
    badge.className = 'api-status connected';
    badge.innerHTML = '<span class="dot-indicator"></span> OpenRouter Connected';
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

  updateStatusBadge(settings);

  // Show greeting in test chat
  if (settings.greeting) {
    appendMsg(settings.greeting, 'bot');
  }
});
