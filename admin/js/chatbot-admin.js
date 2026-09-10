/**
 * WeDRIVE - AI Chatbot Settings (Admin Config Panel)
 * admin/js/chatbot-admin.js (v6.17.0)
 *
 * API key is now read from WeDriveAiVault Slot 3 (customer_chatbot).
 * Go to Admin → AI Intelligence → Pusat Kunci API to configure.
 * System prompt & promo context still stored in Supabase chatbot_settings.
 */

const STORAGE_KEY = 'wedrive_chatbot_settings';
// ─── Default Settings (base prompt only — live data injected at runtime) ─────
const DEFAULT_SETTINGS = {
  systemPrompt: `You are WeDRIVE Bot, a friendly and helpful AI assistant for WeDRIVE car rental service based in Melaka, Malaysia.

Your role:
- Help customers find and book rental cars
- Answer questions about pricing, availability, location, and policies
- Be professional but friendly, use simple language
- Reply in the same language the customer uses (Malay or English)
- Keep responses concise (2-3 sentences max unless more detail is needed)
- ALWAYS use the [LIVE SYSTEM DATA] section below for accurate company settings, location, policies, and available cars
- NEVER make up cars, locations, prices, or policies that are not in the live data

Booking & Registration Flow:
- You cannot directly book cars or process payments.
- If the user is a GUEST (you can tell they are a guest if the [PERSONAL CUSTOMER DATA] section is absent, empty, or says 'Customer Name: Not set'):
  * They MUST log in or register before booking.
  * Direct them to the Login page by outputting a clear markdown link: [Sign In](/account/pages/login/login.html) or [Register](/account/pages/signup/signup.html).
- If the user is a LOGGED-IN CUSTOMER:
  * Guide them to make a booking by selecting dates and making payment.
  * Explain the step-by-step process: (1) Choose dates, (2) Pay the 20% deposit, (3) Wait for admin approval.
  * Inform them they can close the chat and click the "Book Now" button on their preferred car to begin.
- When recommending a specific available car (whether guest or logged in), you MUST append the tag \`[CAR_CARD: car_id]\` (where car_id is the numeric ID of the car) to the end of your response so the system can show an interactive booking card.
  Example: "I recommend the BMW 320i. [CAR_CARD: 1]"`,

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
      lines.push('- Company Name: ' + (s.company_name || '[not configured]'));
      lines.push('- Address/Location: ' + (s.company_address || '[not configured]'));
      lines.push('- Phone Contact: ' + (s.company_phone || '[not configured]'));
      lines.push('- Email Contact: ' + (s.company_email || '[not configured]'));
      lines.push('- Operating Hours: ' + (s.operating_hours || '[not configured]'));
      lines.push('- Currency: ' + (s.currency || '[not configured]'));
      lines.push('- Tax Rate: ' + (s.tax_rate !== undefined ? s.tax_rate + '%' : '[not configured]'));
      lines.push('- Security Deposit: ' + (s.deposit_percentage !== undefined ? s.deposit_percentage + '% of rental' : '[not configured]'));
      lines.push('- Rental Duration Limits: Min ' + (s.min_rental_days || '[not configured]') + ' day(s), Max ' + (s.max_rental_days || '[not configured]') + ' day(s)');
      lines.push('- Late Return Fee: ' + (s.late_fee_per_hour !== undefined ? 'RM' + s.late_fee_per_hour + '/hour' : '[not configured]'));
      if (s.pickup_locations && s.pickup_locations.length > 0) {
        lines.push('- Pickup & Drop-off Locations: ' + s.pickup_locations.join(', '));
      }
    } else {
      lines.push('\nCompany & System Settings: Not configured in Supabase.');
    }

    // 2. Cars
    const carsResult = await window.supabaseClient.from('cars').select('name, type, price, status, fuel, seats, year');
    if (carsResult.data && carsResult.data.length > 0) {
      const available = carsResult.data.filter(c => c.status === 'Available');
      const rented = carsResult.data.filter(c => c.status === 'Rented');

      lines.push('\nCar Overview:');
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
    lines.push('\n[Data operasi tidak tersedia buat sementara]');
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
    systemPrompt: document.getElementById('system-prompt').value.trim(),
    promoContext: document.getElementById('promo-context').value.trim(),
    greeting: document.getElementById('greeting-msg').value.trim()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  updateVaultStatus(false);

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
    showToast('Tetapan berjaya disimpan ke sistem operasi!', false);
  } else {
    showToast('Disimpan sementara, tetapi penyelarasan sistem gagal.', true);
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

  showToast('Data operasi berjaya disegarkan!', false);
};

// ─── Test the configured Slot 3 key ─────────────────────────────────────────
window.testConfiguredKey = async function () {
  const btn = document.getElementById('btn-test-configured-ai');
  const original = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons-round fs-18">autorenew</span> Menguji...';
  }

  try {
    await ensureChatbotKey();
    if (!window.WeDriveAiVault || !window.WeDriveAiVault.hasKey('customer_chatbot')) {
      throw new Error('Slot 3 belum dikonfigurasi. Sila simpan key di Pusat Kunci API AI.');
    }
    const reply = await window.WeDriveAiVault.callAi(
      'customer_chatbot',
      'Balas dengan perkataan OK sahaja.',
      'Ujian sambungan chatbot. Balas OK.',
      { maxTokens: 10, temperature: 0 }
    );
    if (!reply) throw new Error('Provider tidak memberikan respons.');
    showToast('Sambungan chatbot berjaya melalui ' + getConfiguredProviderLabel() + '.', false);
    updateVaultStatus(true);
  } catch (e) {
    showToast(e.message || 'Ujian sambungan gagal.', true);
    updateVaultStatus(false, e.message);
  } finally {
    if (btn) {
      btn.innerHTML = original;
      btn.disabled = false;
    }
  }
};

// Ke belakang untuk mana-mana pemanggil lama.
window.testConnection = window.testConfiguredKey;

async function ensureChatbotKey() {
  if (window.WeDriveAiVault && typeof window.WeDriveAiVault.syncFromSupabase === 'function') {
    await window.WeDriveAiVault.syncFromSupabase();
  }
}

function getConfiguredProviderLabel() {
  const provider = window.WeDriveAiVault && window.WeDriveAiVault.getProvider('customer_chatbot');
  return provider ? provider.name : 'AI';
}

// ─── Send Test Message ───────────────────────────────────────────────────────
window.sendTestMsg = async function () {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;

  await ensureChatbotKey();
  if (!window.WeDriveAiVault || !window.WeDriveAiVault.hasKey('customer_chatbot')) {
    showToast('Tiada kunci API. Pergi ke Pusat Kunci API → Slot 3 untuk konfigurasi.', true);
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
    const historyText = chatHistory
      .map(msg => (msg.role === 'model' ? 'Assistant' : 'User') + ': ' + msg.parts[0].text)
      .join('\n');
    reply = await window.WeDriveAiVault.callAi(
      'customer_chatbot',
      fullSystem,
      historyText,
      { maxTokens: 2000, temperature: 0.4 }
    );
  } catch (e) {
    console.error('Configured chatbot provider failed:', e.message);
  }

  typingEl.remove();

  if (reply) {
    chatHistory.push({ role: 'model', parts: [{ text: reply }] });

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
          console.warn("Failed to fetch recommended car details for play chat:", e);
        }
      }

      // Jangan bina kad kereta palsu jika ID tiada dalam database.
    }

    appendMsg(reply, 'bot', recommendedCars.length > 0 ? recommendedCars : null);
  } else {
    appendMsg('Sambungan AI gagal. Sila semak Slot 3 di Pusat Kunci API AI.', 'bot');
  }

  sendBtn.disabled = false;
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function appendMsg(text, who, showCar = null) {
  const container = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${who}`;

  let carHtml = '';
  if (showCar && typeof showCar === 'object') {
    const carsArray = Array.isArray(showCar) ? showCar : [showCar];
    carHtml = carsArray.map(car => `
      <div class="mini-car-card" style="margin-top: 8px; display: flex; align-items: center; justify-content: space-between; padding: 12px; background: var(--bg-card, rgba(255,255,255,0.05)); border: 1px solid var(--border-color, rgba(255,255,255,0.1)); border-radius: 12px; gap: 12px; max-width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); backdrop-filter: blur(10px);">
        <div class="mini-car-icon" style="color: var(--primary-color, #3b82f6); display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; background: rgba(59, 130, 246, 0.1);"><span class="material-icons-round">directions_car</span></div>
        <div class="mini-car-info" style="flex: 1; display: flex; flex-direction: column;">
          <div class="c-name" style="font-weight: 600; font-size: 13px; color: var(--text-primary); line-height: 1.3;">${car.name}</div>
          <div class="c-price" style="font-size: 11px; color: var(--text-muted, #aaa); margin-top: 2px;">RM ${car.price}/day · ${(car.type || '').toUpperCase()}</div>
        </div>
        <button class="mini-book-btn" onclick="triggerPlayBook(${car.id})" style="background: var(--primary-color, #3b82f6); color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;">Book</button>
      </div>
    `).join('');
  }

  // Sanitize text first to prevent HTML injection
  var escText = (window.escapeHtml ? window.escapeHtml(text) : String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  // Parse markdown bold and newlines
  var processedText = escText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  // Safe markdown links: only allow http://, https://, or relative paths (prevents javascript: URIs)
  processedText = processedText.replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/|\.\.\/)[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  div.innerHTML = `<div>${processedText}</div>` + carHtml;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div;
}

window.triggerPlayBook = function (carId) {
  showToast(`Booking flow simulation triggered for car ID #${carId}!`, false);
};

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
    badge.innerHTML = '<span class="dot-indicator"></span> AI Connected';
  } else {
    badge.className = 'api-status disconnected';
    badge.innerHTML = '<span class="dot-indicator"></span> Not Connected';
  }
}

function updateVaultStatus(connected, errorMessage) {
  const badge = document.getElementById('api-status');
  const providerName = document.getElementById('ai-provider-name');
  const modelName = document.getElementById('ai-model-name');
  const source = document.getElementById('ai-provider-source');
  const provider = window.WeDriveAiVault && window.WeDriveAiVault.getProvider('customer_chatbot');
  const model = window.WeDriveAiVault && window.WeDriveAiVault.getModel('customer_chatbot');
  const hasKey = window.WeDriveAiVault && window.WeDriveAiVault.hasKey('customer_chatbot');

  if (providerName) providerName.textContent = provider ? provider.name : 'Slot 3 belum dikonfigurasi';
  if (modelName) modelName.textContent = model || '--';
  if (source) source.textContent = errorMessage
    ? 'Ralat pada konfigurasi dalaman WeDRIVE'
    : 'Sumber: Konfigurasi dalaman WeDRIVE · Slot 3';

  if (badge) {
    if (connected || hasKey) {
      badge.className = 'api-status connected radius-pill px-10 py-4';
      badge.innerHTML = '<span class="dot-indicator"></span> ' + (connected ? 'AI Connected' : 'Key Sedia');
    } else {
      badge.className = 'api-status disconnected radius-pill px-10 py-4';
      badge.innerHTML = '<span class="dot-indicator"></span> Slot 3 Belum Disambung';
    }
  }
}

function showToast(message, isError) {
  var existing = document.getElementById('wedrive-toast-pill') || document.querySelector('.toast-notify');
  if (existing) existing.remove();

  var toast = document.createElement('div');
  toast.className = 'wedrive-toast-pill toast-notify';
  toast.id = 'wedrive-toast-pill';
  var icon = isError ? 'error' : 'check_circle';
  var iconClass = isError ? 'error' : 'success';

  var iconCircle = '<div class="wedrive-toast-icon ' + iconClass + '">' +
    '<span class="material-icons-round" style="font-size: 16px; line-height: 1;">' + icon + '</span>' +
    '</div>';

  toast.innerHTML = iconCircle + '<span class="wedrive-toast-text">' + message + '</span>';
  document.body.appendChild(toast);

  requestAnimationFrame(function () {
    toast.classList.add('show');
  });

  setTimeout(function () {
    toast.classList.remove('show');
    setTimeout(function () { toast.remove(); }, 350);
  }, 3200);
}

// ─── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  let settings = loadSettings();

  if (window.WeDriveAPI && typeof window.WeDriveAPI.getChatbotSettings === 'function') {
    try {
      const dbSettings = await window.WeDriveAPI.getChatbotSettings();
      if (dbSettings && (dbSettings.apiKey || dbSettings.systemPrompt || dbSettings.greeting || dbSettings.promoContext)) {
        const { apiKey: ignoredApiKey, ...safeDbSettings } = dbSettings;
        settings = { ...settings, ...safeDbSettings };
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

  // API key lives only in the central AI Vault (Slot 3), not in this page.
  await ensureChatbotKey();
  document.getElementById('system-prompt').value = settings.systemPrompt || '';
  document.getElementById('promo-context').value = settings.promoContext || '';
  document.getElementById('greeting-msg').value = settings.greeting || '';

  updateVaultStatus(false);

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
