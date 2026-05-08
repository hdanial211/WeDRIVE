/**
 * WeDRIVE - AI Chatbot Settings (Google Gemini + Grok Backup)
 * admin/js/chatbot-admin.js
 *
 * Primary: Google Gemini API (gemini-2.0-flash) — free tier
 * Backup:  Grok AI (xAI) — auto-fallback if Gemini fails
 * Settings stored in localStorage for demo/FYP purposes.
 */

const STORAGE_KEY = 'wedrive_chatbot_settings';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GROK_MODEL = 'grok-3-mini-fast';

// ─── Default Settings ───────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  apiKey: '',
  grokKey: '',
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
    grokKey: document.getElementById('grok-key').value.trim(),
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

// ─── Test Connection ────────────────────────────────────────────────────────
window.testConnection = async function() {
  const geminiKey = document.getElementById('api-key').value.trim();
  const grokKey = document.getElementById('grok-key').value.trim();

  if (!geminiKey && !grokKey) {
    showToast('Please enter at least one API key', true);
    return;
  }

  const btn = document.querySelector('.btn-test');
  const original = btn.innerHTML;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:18px">autorenew</span> Testing...';
  btn.disabled = true;

  const results = [];

  // Test Gemini
  if (geminiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Say "OK" in one word.' }] }]
        })
      });
      results.push({ provider: 'Gemini', ok: res.ok });
    } catch {
      results.push({ provider: 'Gemini', ok: false });
    }
  }

  // Test Grok
  if (grokKey) {
    try {
      const res = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${grokKey}`
        },
        body: JSON.stringify({
          model: GROK_MODEL,
          messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
          max_tokens: 10
        })
      });
      results.push({ provider: 'Grok', ok: res.ok });
    } catch {
      results.push({ provider: 'Grok', ok: false });
    }
  }

  const connected = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  if (connected.length > 0) {
    const names = connected.map(r => r.provider).join(' + ');
    const failMsg = failed.length > 0 ? ` (${failed[0].provider} failed)` : '';
    updateStatusBadge({ apiKey: geminiKey, grokKey }, true);
    showToast(`✅ ${names} connected!${failMsg}`, false);
  } else {
    updateStatusBadge({}, false);
    showToast('❌ All connections failed — check your API keys', true);
  }

  btn.innerHTML = original;
  btn.disabled = false;
};

// ─── Gemini API Call ────────────────────────────────────────────────────────
async function callGemini(apiKey, systemText, history) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents: history
    })
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
}

// ─── Grok API Call ──────────────────────────────────────────────────────────
async function callGrok(grokKey, systemText, history) {
  // Convert Gemini history format to OpenAI format
  const messages = [
    { role: 'system', content: systemText }
  ];
  for (const msg of history) {
    messages.push({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0].text
    });
  }

  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${grokKey}`
    },
    body: JSON.stringify({
      model: GROK_MODEL,
      messages,
      max_tokens: 512
    })
  });

  if (!res.ok) throw new Error(`Grok ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || 'No response from Grok.';
}

// ─── Send Test Message (with fallback) ──────────────────────────────────────
window.sendTestMsg = async function() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  const geminiKey = document.getElementById('api-key').value.trim();
  const grokKey = document.getElementById('grok-key').value.trim();

  if (!geminiKey && !grokKey) {
    showToast('Set at least one API key to test', true);
    return;
  }

  // Add user message
  appendMsg(text, 'user');
  input.value = '';

  // Disable send
  const sendBtn = document.getElementById('send-btn');
  sendBtn.disabled = true;

  // Add typing indicator
  const typingEl = appendTyping();

  // Build system instruction
  const systemPrompt = document.getElementById('system-prompt').value.trim();
  const promoContext = document.getElementById('promo-context').value.trim();
  const fullSystem = systemPrompt + (promoContext ? '\n\n' + promoContext : '');

  // Add to history (Gemini format)
  chatHistory.push({ role: 'user', parts: [{ text }] });

  let reply = '';
  let usedProvider = '';

  // Try Gemini first, then Grok
  if (geminiKey) {
    try {
      reply = await callGemini(geminiKey, fullSystem, chatHistory);
      usedProvider = 'Gemini';
    } catch (e) {
      console.warn('Gemini failed, trying Grok...', e.message);
    }
  }

  // Fallback to Grok
  if (!reply && grokKey) {
    try {
      reply = await callGrok(grokKey, fullSystem, chatHistory);
      usedProvider = 'Grok';
    } catch (e) {
      console.error('Grok also failed:', e.message);
    }
  }

  typingEl.remove();

  if (reply) {
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });
    const providerTag = usedProvider === 'Grok' ? ' <span style="font-size:10px;opacity:0.6;margin-left:4px;">via Grok</span>' : '';
    appendMsg(reply + providerTag, 'bot');
  } else {
    appendMsg('⚠️ Both APIs failed. Please check your API keys.', 'bot');
  }

  sendBtn.disabled = false;
};

// ─── Toggle API Key Visibility ──────────────────────────────────────────────
window.toggleKey = function(inputId, iconEl) {
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
  const hasGemini = settings?.apiKey?.length > 10;
  const hasGrok = settings?.grokKey?.length > 10;

  if (forceConnected || hasGemini || hasGrok) {
    const providers = [];
    if (hasGemini) providers.push('Gemini');
    if (hasGrok) providers.push('Grok');
    badge.className = 'api-status connected';
    badge.innerHTML = `<span class="dot-indicator"></span> ${providers.join(' + ') || 'Connected'}`;
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
  document.getElementById('grok-key').value = settings.grokKey || '';
  document.getElementById('system-prompt').value = settings.systemPrompt;
  document.getElementById('promo-context').value = settings.promoContext;
  document.getElementById('greeting-msg').value = settings.greeting;

  updateStatusBadge(settings);

  // Show greeting in test chat
  if (settings.greeting) {
    appendMsg(settings.greeting, 'bot');
  }
});
