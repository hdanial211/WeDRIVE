/**
 * WeDRIVE - AI Chatbot Settings (OpenRouter.ai)
 * admin/js/chatbot-admin.js
 *
 * Provider: OpenRouter.ai — unified API gateway (supports GPT-4o, Claude, Gemini, etc.)
 * Model:    google/gemini-2.5-flash
 * Settings stored in localStorage for demo/FYP purposes.
 *
 * System prompt now auto-injects LIVE data from Supabase (cars, stats, etc.)
 */

const STORAGE_KEY = 'wedrive_chatbot_settings';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_MODEL = 'google/gemini-2.5-flash';

// ─── Default Settings (base prompt only — live data injected at runtime) ─────
const DEFAULT_SETTINGS = {
  apiKey: '',
  systemPrompt: `You are WeDRIVE Bot, a friendly and helpful AI assistant for WeDRIVE car rental service based in Melaka, Malaysia.

Your role:
- Help customers find and book rental cars
- Answer questions about pricing, availability, location, and policies
- Be professional but friendly, use simple language
- Reply in the same language the customer uses (Malay or English)
- Keep responses concise (2-3 sentences max unless more detail is needed)
- ALWAYS use the [LIVE SYSTEM DATA] section below for accurate company settings, location, policies, and available cars
- NEVER make up cars, locations, prices, or policies that are not in the live data`,

  promoContext: `Current Promotions:
- Weekend Special: 10% off for Fri-Sun bookings
- Weekly Rate: Book 7+ days and get 15% discount
- New Customer: First-time renters get RM 30 off`,

  greeting: "Hi there! I'm WeDRIVE Bot. How can I help you today?"
};

// ─── Conversation History (for test chat) ───────────────────────────────────
let chatHistory = [];

// ─── Cached live data string ────────────────────────────────────────────────
let cachedLiveData = '';

// ─── Fetch Live Data from Supabase ──────────────────────────────────────────
async function fetchLiveData() {
  if (!window.supabaseClient) return '';

  let lines = [];
  lines.push('\n\n[LIVE SYSTEM DATA — Auto-synced from WeDRIVE Database]');

  // Add current date & time
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  const timeStr = now.toTimeString().split(' ')[0];
  lines.push('\n[CURRENT TIME & DATE]');
  lines.push('- Today\'s Date: ' + dateStr);
  lines.push('- Current Time: ' + timeStr);

  try {
    // 1. Company Settings from 'settings' table
    const settingsResult = await window.supabaseClient
      .from('settings')
      .select('value')
      .eq('key', 'main')
      .maybeSingle();

    if (settingsResult.data && settingsResult.data.value) {
      const s = settingsResult.data.value;
      lines.push('\nCompany & System Settings:');
      lines.push('- Company Name: ' + (s.company_name || 'WeDRIVE Sdn Bhd'));
      lines.push('- Address/Location: ' + (s.company_address || 'Lot 123, Jalan Hang Tuah, 75300 Melaka'));
      lines.push('- Phone Contact: ' + (s.company_phone || '012-345 6789'));
      lines.push('- Email Contact: ' + (s.company_email || 'admin@wedrive.my'));
      lines.push('- Operating Hours: ' + (s.operating_hours || '8:00 AM - 10:00 PM daily'));
      lines.push('- Currency: ' + (s.currency || 'MYR'));
      lines.push('- Tax Rate: ' + (s.tax_rate !== undefined ? s.tax_rate : '6') + '%');
      lines.push('- Security Deposit: ' + (s.deposit_percentage !== undefined ? s.deposit_percentage : '20') + '% of rental or standard deposit');
      lines.push('- Rental Duration Limits: Min ' + (s.min_rental_days || '1') + ' day(s), Max ' + (s.max_rental_days || '30') + ' day(s)');
      lines.push('- Late Return Fee: RM' + (s.late_fee_per_hour || '25') + '/hour');
      if (s.pickup_locations && s.pickup_locations.length > 0) {
        lines.push('- Pickup & Drop-off Locations: ' + s.pickup_locations.join(', '));
      }
    } else {
      // Fallback details if settings table is empty/unconfigured
      lines.push('\nCompany & System Settings (Default):');
      lines.push('- Company Name: WeDRIVE Sdn Bhd');
      lines.push('- Address/Location: Lot 123, Jalan Hang Tuah, 75300 Melaka');
      lines.push('- Phone Contact: 012-345 6789');
      lines.push('- Email Contact: admin@wedrive.my');
      lines.push('- Operating Hours: 8AM - 10PM daily');
      lines.push('- Security Deposit: RM 500 (refundable)');
      lines.push('- Pickup & Drop-off Locations: Melaka Sentral, KLIA2, Dataran Pahlawan, Ayer Keroh, Jonker Street');
    }

    // 2. Cars
    const carsResult = await window.supabaseClient.from('cars').select('name, type, price, status, fuel, seats, year');
    if (carsResult.data && carsResult.data.length > 0) {
      const available = carsResult.data.filter(c => c.status === 'Available');
      const rented = carsResult.data.filter(c => c.status === 'Rented');

      lines.push('\nFleet Overview:');
      lines.push('- Total vehicles: ' + carsResult.data.length);
      lines.push('- Available now: ' + available.length);
      lines.push('- Currently rented: ' + rented.length);

      if (available.length > 0) {
        lines.push('\nAvailable Cars (Available for Booking):');
        available.forEach(c => {
          lines.push('- ' + c.name + ' (' + c.type + ') : RM' + c.price + '/day | ' + c.fuel + ' | ' + c.seats + ' seats | ' + c.year);
        });
      } else {
        lines.push('\nNo cars available right now. All are fully booked.');
      }

      if (rented.length > 0) {
        lines.push('\nCurrently Rented (NOT available):');
        rented.forEach(c => {
          lines.push('- ' + c.name + ' (Rented)');
        });
      }

      // Price range
      const prices = carsResult.data.map(c => Number(c.price));
      lines.push('\nPrice Range: RM' + Math.min(...prices) + ' - RM' + Math.max(...prices) + '/day');
    }

    // 3. Customers count
    const custResult = await window.supabaseClient.from('customers').select('id', { count: 'exact', head: true });
    if (custResult.count !== null) {
      lines.push('\nRegistered Customers: ' + custResult.count);
    }

    // 4. Active bookings
    const bookResult = await window.supabaseClient.from('bookings')
      .select('id', { count: 'exact', head: true })
      .in('status', ['Active', 'Confirmed'])
      .gte('end_date', dateStr);
    if (bookResult.count !== null) {
      lines.push('Active Rentals: ' + bookResult.count);
    }

    lines.push('\n[END LIVE DATA]');
    lines.push('Use this exact data when answering. Do not make up cars, prices, locations, or policies not in this list.');

  } catch (e) {
    console.error('[ChatbotAdmin] Failed to fetch live data:', e);
    lines.push('\n[Live data unavailable — database connection error]');
  }

  cachedLiveData = lines.join('\n');
  return cachedLiveData;
}

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
window.saveSettings = async function () {
  const buttons = document.querySelectorAll('.btn-save');
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;animation:spin 1s linear infinite">autorenew</span> Saving...';
  });

  const settings = {
    apiKey: document.getElementById('api-key').value.trim(),
    systemPrompt: document.getElementById('system-prompt').value.trim(),
    promoContext: document.getElementById('promo-context').value.trim(),
    greeting: document.getElementById('greeting-msg').value.trim()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  updateStatusBadge(settings);

  let dbSuccess = true;
  if (window.WeDriveAPI && typeof window.WeDriveAPI.updateChatbotSettings === 'function') {
    try {
      const res = await window.WeDriveAPI.updateChatbotSettings(settings);
      if (!res || !res.success) dbSuccess = false;
    } catch (e) {
      console.error('[ChatbotAdmin] Database save failed:', e);
      dbSuccess = false;
    }
  } else {
    dbSuccess = false;
  }

  if (dbSuccess) {
    showToast('Settings saved successfully to database!', false);
  } else {
    showToast('Saved locally, but failed to sync to database.', true);
  }

  setTimeout(() => {
    buttons.forEach(btn => {
      if (btn.dataset.originalHtml) {
        btn.innerHTML = btn.dataset.originalHtml;
      }
      btn.disabled = false;
    });
  }, 600);
};

// ─── Refresh Live Data (button handler) ─────────────────────────────────────
window.refreshLiveData = async function () {
  const btn = document.getElementById('btn-refresh-data');
  const preview = document.getElementById('live-data-preview');
  const original = btn.innerHTML;
  btn.innerHTML = '<span class="material-icons-round" style="font-size:16px;animation:spin 1s linear infinite">autorenew</span> Fetching...';
  btn.disabled = true;

  const data = await fetchLiveData();

  preview.textContent = data || '[No data available]';
  preview.style.display = 'block';

  btn.innerHTML = original;
  btn.disabled = false;

  showToast('Live data refreshed from database!', false);
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

  // Fetch live data for the test chat too
  if (!cachedLiveData) {
    await fetchLiveData();
  }

  const fullSystem = systemPrompt + (promoContext ? '\n\n' + promoContext : '') + cachedLiveData;

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
document.addEventListener('DOMContentLoaded', async () => {
  let settings = loadSettings();

  if (window.WeDriveAPI && typeof window.WeDriveAPI.getChatbotSettings === 'function') {
    try {
      const dbSettings = await window.WeDriveAPI.getChatbotSettings();
      if (dbSettings && (dbSettings.apiKey || dbSettings.systemPrompt)) {
        settings = { ...settings, ...dbSettings };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      }
    } catch (e) {
      console.warn('[ChatbotAdmin] Failed to load settings from Supabase:', e);
    }
  }

  // Migration: If systemPrompt contains old hardcoded Company Info, update it to the new dynamic default
  if (settings.systemPrompt && settings.systemPrompt.includes('Company Info:') && settings.systemPrompt.includes('Jalan Hang Tuah')) {
    settings.systemPrompt = DEFAULT_SETTINGS.systemPrompt;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    if (window.WeDriveAPI && typeof window.WeDriveAPI.updateChatbotSettings === 'function') {
      try {
        await window.WeDriveAPI.updateChatbotSettings(settings);
      } catch (e) {
        console.warn('Failed to sync migrated chatbot settings to Supabase:', e);
      }
    }
  }

  document.getElementById('api-key').value = settings.apiKey || '';
  document.getElementById('system-prompt').value = settings.systemPrompt || '';
  document.getElementById('promo-context').value = settings.promoContext || '';
  document.getElementById('greeting-msg').value = settings.greeting || '';

  updateStatusBadge(settings);

  // Show greeting in test chat
  if (settings.greeting) {
    appendMsg(settings.greeting, 'bot');
  }

  // Auto-fetch live data on page load
  await fetchLiveData();

  // Show live data preview if the element exists
  const preview = document.getElementById('live-data-preview');
  if (preview && cachedLiveData) {
    preview.textContent = cachedLiveData;
    preview.style.display = 'block';
  }
});

// Quick play message helper for suggestion chips in test play area
window.quickPlayMsg = function (text) {
  const input = document.getElementById('chat-input');
  if (input) {
    input.value = text;
    window.sendTestMsg();
  }
};
