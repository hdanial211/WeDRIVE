/**
 * WeDRIVE - Marketing AI Module
 * admin/js/marketing-ai.js
 *
 * AI-powered marketing content generator using Gemini API (free tier).
 * API key is stored in Supabase settings table - no code editing needed.
 */

'use strict';

var _aiApiKey = '';
var _aiParsedSuggestions = [];

// ── Load saved API key from Supabase on page load ─────────────────────────────
window.addEventListener('DOMContentLoaded', async function () {
  try {
    var sb = window.supabaseClient;
    if (!sb || !window.AppConfig || !window.AppConfig.USE_REAL_DB) return;
    var result = await sb.from('settings').select('value').eq('key', 'gemini_api_key').maybeSingle();
    if (result.data && result.data.value) {
      _aiApiKey = result.data.value;
      var input = document.getElementById('ai-api-key');
      if (input) input.value = _aiApiKey;
      setAiKeyStatus('Key saved. Ready to generate.', '#059669');
    }
  } catch (e) {
    console.warn('[WeDRIVE AI] Could not load API key:', e);
  }
});

// ── Toggle API key visibility ─────────────────────────────────────────────────
window.toggleApiKeyVisibility = function () {
  var input = document.getElementById('ai-api-key');
  var icon = document.getElementById('ai-key-eye-icon');
  if (!input || !icon) return;
  var isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';
  icon.textContent = isHidden ? 'visibility_off' : 'visibility';
};

// ── Save API key to Supabase settings table ───────────────────────────────────
window.saveAiApiKey = async function () {
  var input = document.getElementById('ai-api-key');
  if (!input) return;
  var key = input.value.trim();
  if (!key) { setAiKeyStatus('API key cannot be empty.', '#DC2626'); return; }

  _aiApiKey = key;

  if (window.AppConfig && window.AppConfig.USE_REAL_DB && window.supabaseClient) {
    try {
      var sb = window.supabaseClient;
      // Upsert into settings table (key/value store)
      var result = await sb.from('settings').upsert(
        { key: 'gemini_api_key', value: key },
        { onConflict: 'key' }
      );
      if (result.error) throw result.error;
      setAiKeyStatus('API key saved to Supabase successfully.', '#059669');
    } catch (err) {
      console.error('[WeDRIVE AI] Save key error:', err);
      setAiKeyStatus('Error saving key: ' + err.message, '#DC2626');
    }
  } else {
    // Demo mode: save to localStorage
    localStorage.setItem('wedrive_gemini_key', key);
    setAiKeyStatus('API key saved (demo mode).', '#D97706');
  }
};

function setAiKeyStatus(msg, color) {
  var el = document.getElementById('ai-key-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = color;
  el.style.display = 'block';
}

// ── Generate AI Suggestions ───────────────────────────────────────────────────
window.generateAiSuggestions = async function () {
  var context = (document.getElementById('ai-prompt-context') || {}).value || '';
  var contentType = (document.getElementById('ai-content-type') || {}).value || 'banner';
  var btn = document.getElementById('ai-generate-btn');
  var outputWrapper = document.getElementById('ai-output-wrapper');
  var outputEl = document.getElementById('ai-output');
  var errorEl = document.getElementById('ai-error');

  // Hide previous error/output
  if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }
  if (outputWrapper) outputWrapper.style.display = 'none';

  // Get API key
  var apiKey = _aiApiKey
    || (document.getElementById('ai-api-key') || {}).value
    || localStorage.getItem('wedrive_gemini_key')
    || '';

  if (!apiKey) {
    showAiError('Sila masukkan Gemini API Key dahulu dan klik "Save Key".');
    return;
  }

  if (!context.trim()) {
    showAiError('Sila masukkan target month atau event untuk dijana.');
    return;
  }

  // Loading state
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="material-icons-round" style="font-size:18px;animation:spin 1s linear infinite">refresh</span> Generating...';
  }

  // Build prompt by content type
  var contentTypeLabel = {
    banner: 'promo banner text / headline',
    promo: 'promo code names with discount ideas',
    email: 'email campaign subject line and body copy',
    social: 'social media captions (Instagram, Facebook)',
    pricing: 'seasonal pricing adjustment strategy'
  }[contentType] || 'marketing content';

  var currentDate = new Date().toLocaleDateString('en-MY', { year: 'numeric', month: 'long', day: 'numeric' });

  var formatInstruction = '';
  if (contentType === 'banner') {
    formatInstruction = '\nFormat each idea EXACTLY like this:\n1.\nTitle: (short headline)\nMessage: (1-2 sentence body)\n';
  } else if (contentType === 'promo') {
    formatInstruction = '\nFormat each idea EXACTLY like this:\n1.\nCode: (6-8 char uppercase code)\nDescription: (what the promo is for)\nDiscount Value: (e.g. 15% or RM20)\n';
  } else if (contentType === 'pricing') {
    formatInstruction = '\nFormat each idea EXACTLY like this:\n1.\nEvent Name: (name of the season/event)\nAdjustment: (e.g. increase 20% or decrease 15%)\n';
  }

  var prompt = `You are a marketing expert for WeDRIVE, an AI-powered car rental system based in Melaka, Malaysia.

Today's date: ${currentDate}
Business context: Car rental service, target customers are tourists and locals traveling in Melaka.
Target event/context: ${context}
Content type needed: ${contentTypeLabel}

Please generate 3 creative, engaging, and culturally relevant ${contentTypeLabel} ideas for this car rental business.

Requirements:
- Keep it professional but friendly
- Use both English and Bahasa Malaysia where appropriate
- Reference Melaka landmarks or local context where relevant
- Focus on value propositions: convenience, AI technology, affordable rates
- For promo codes: suggest memorable 6-8 character codes
- For pricing strategy: suggest percentage adjustments with reasoning
${formatInstruction}
Generate the ${contentTypeLabel} now:`;

  try {
    var response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 8192 }
        })
      }
    );

    var data = await response.json();

    if (!response.ok) {
      var errMsg = (data.error && data.error.message) || 'API call failed';
      if (data.error && data.error.status === 'INVALID_ARGUMENT' && errMsg.includes('API key')) {
        throw new Error('API key tidak sah. Sila semak semula key anda.');
      }
      throw new Error(errMsg);
    }

    var text = data.candidates
      && data.candidates[0]
      && data.candidates[0].content
      && data.candidates[0].content.parts
      && data.candidates[0].content.parts[0]
      && data.candidates[0].content.parts[0].text;

    if (!text) throw new Error('Tiada respons dari AI.');

    if (outputEl) outputEl.textContent = text;
    if (outputWrapper) outputWrapper.style.display = 'block';

    try {
      _aiParsedSuggestions = parseAiOutput(text, contentType);
      renderAiSuggestions(contentType);
    } catch (parseErr) {
      console.warn('[WeDRIVE AI] Parsing suggestions failed:', parseErr);
    }

  } catch (err) {
    console.error('[WeDRIVE AI] Generation error:', err);
    showAiError(err.message || 'Gagal jana kandungan. Cuba semula.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-icons-round" style="font-size:18px">auto_awesome</span> Generate AI Marketing Content';
    }
  }
};

function showAiError(msg) {
  var errorEl = document.getElementById('ai-error');
  if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
}

// ── Copy Output ───────────────────────────────────────────────────────────────
window.copyAiOutput = function () {
  var el = document.getElementById('ai-output');
  if (!el) return;
  navigator.clipboard.writeText(el.textContent).then(function () {
    var btn = el.previousElementSibling && el.previousElementSibling.querySelector('button');
    if (btn) {
      var orig = btn.innerHTML;
      btn.innerHTML = '<span class="material-icons-round" style="font-size:14px">check</span> Copied!';
      setTimeout(function () { btn.innerHTML = orig; }, 2000);
    }
  }).catch(function () {
    alert('Copy failed - please select and copy manually.');
  });
};

// Add spin animation if not present
(function () {
  if (!document.getElementById('ai-spin-style')) {
    var style = document.createElement('style');
    style.id = 'ai-spin-style';
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }
})();

// ── AI Suggestion Helpers & Parsers ───────────────────────────────────────────

function getRandomColor() {
  var colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getFutureDate(days) {
  var d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function parseAiOutput(text, contentType) {
  var items = [];
  var cleanText = text.replace(/\*\*/g, '').replace(/\r/g, '');
  var parts = cleanText.split(/\n(?=\d+[\.\)])/);
  var sections = [];
  if (parts.length >= 2) {
    sections = parts.map(p => p.trim()).filter(Boolean);
  } else {
    sections = cleanText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  }

  for (var i = 0; i < sections.length; i++) {
    var sec = sections[i];
    if (!sec.match(/(title|headline|message|code|desc|event|adjustment|price|surcharge|discount)/i)) {
      continue;
    }
    
    var lines = sec.split('\n');
    var item = {};
    
    for (var j = 0; j < lines.length; j++) {
      var line = lines[j].trim();
      if (!line) continue;
      
      var match = line.match(/^([^:-]+)[::-]\s*(.+)$/);
      if (match) {
        var key = match[1].trim().toLowerCase();
        var val = match[2].trim();
        
        if (key.includes('title') || key.includes('headline')) {
          item.title = val;
        } else if (key.includes('message') || key.includes('body') || key.includes('copy')) {
          item.message = val;
        } else if (key.includes('code') || key.includes('promo')) {
          var codeMatch = val.match(/[A-Z0-9]{4,10}/i);
          item.code = codeMatch ? codeMatch[0].toUpperCase() : val.toUpperCase();
        } else if (key.includes('desc')) {
          item.description = val;
        } else if (key.includes('value') || key.includes('discount') || key.includes('adjustment')) {
          item.raw_value = val;
        } else if (key.includes('event') || key.includes('name')) {
          item.name = val;
        }
      }
    }
    
    if (contentType === 'banner') {
      if (item.title || item.message) {
        items.push({
          title: item.title || 'Special Offer',
          message: item.message || sec.substring(0, 100),
          color: getRandomColor()
        });
      }
    } else if (contentType === 'promo') {
      if (item.code || item.description || item.raw_value) {
        var val = 10;
        var type = 'percent';
        if (item.raw_value) {
          var numMatch = item.raw_value.match(/\d+/);
          if (numMatch) val = parseFloat(numMatch[0]);
          if (item.raw_value.includes('RM') || item.raw_value.includes('flat') || item.raw_value.toLowerCase().includes('fixed')) {
            type = 'fixed';
          }
        }
        items.push({
          code: item.code || 'PROMO' + Math.floor(Math.random() * 1000),
          description: item.description || 'Seasonal discount generated by WeDRIVE AI',
          type: type,
          value: val,
          min_days: 1,
          usage_limit: 100,
          expiry: getFutureDate(30)
        });
      }
    } else if (contentType === 'pricing') {
      if (item.name || item.raw_value) {
        var val = 15;
        var direction = 'increase';
        if (item.raw_value) {
          var numMatch = item.raw_value.match(/\d+/);
          if (numMatch) val = parseFloat(numMatch[0]);
          if (item.raw_value.toLowerCase().includes('decrease') || item.raw_value.toLowerCase().includes('discount') || item.raw_value.toLowerCase().includes('off') || item.raw_value.includes('-')) {
            direction = 'decrease';
          }
        }
        items.push({
          name: item.name || 'AI Seasonal Rate',
          direction: direction,
          value: val,
          start_date: getFutureDate(0),
          end_date: getFutureDate(7)
        });
      }
    } else if (contentType === 'email' || contentType === 'social') {
      if (item.title || item.message) {
        items.push({
          title: item.title || (contentType === 'email' ? 'Email Campaign Copy' : 'Social Media Caption'),
          message: item.message || sec.substring(0, 200)
        });
      }
    }
  }
  return items;
}

function renderAiSuggestions(contentType) {
  var container = document.getElementById('ai-suggestions-container');
  if (!container) return;
  
  if (!_aiParsedSuggestions || _aiParsedSuggestions.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'grid';
  
  container.innerHTML = _aiParsedSuggestions.map(function (item, index) {
    if (contentType === 'banner') {
      return `
      <div class="card" style="margin-bottom:0; border: 1.5px solid var(--slate-200); background: var(--card-bg);">
        <div class="banner-preview" style="background:${item.color}; margin-bottom:10px;">
          <span class="material-icons-round">campaign</span>
          <div class="banner-preview-text">
            <div class="banner-preview-title">${item.title}</div>
            <div class="banner-preview-msg">${item.message}</div>
          </div>
        </div>
        <button class="btn-primary-sm" id="ai-apply-btn-${index}" onclick="applyAiBanner(${index})" style="width:100%; display:flex; align-items:center; justify-content:center; gap:6px;">
          <span class="material-icons-round" style="font-size:16px">add_to_photos</span> Create Banner
        </button>
      </div>`;
    } else if (contentType === 'promo') {
      var discountLabel = item.type === 'percent' ? `${item.value}% off` : `RM ${item.value} off`;
      return `
      <div class="card" style="margin-bottom:0; border: 1.5px solid var(--slate-200); background: var(--card-bg); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div class="promo-code-chip" style="margin-bottom:8px;">${item.code}</div>
          <div style="font-size:14px; font-weight:700; color:var(--navy)">${discountLabel}</div>
          <div class="mkt-detail" style="margin-top:2px; font-size:12px; color:var(--slate-400)">${item.description}</div>
        </div>
        <button class="btn-primary-sm" id="ai-apply-btn-${index}" onclick="applyAiPromo(${index})" style="width:100%; margin-top:14px; display:flex; align-items:center; justify-content:center; gap:6px;">
          <span class="material-icons-round" style="font-size:16px">add_to_photos</span> Create Promo Code
        </button>
      </div>`;
    } else if (contentType === 'pricing') {
      var isUp = item.direction === 'increase';
      var dirClass = isUp ? 'dir-up' : 'dir-down';
      var dirIcon = isUp ? 'trending_up' : 'trending_down';
      var dirLabel = isUp ? `+${item.value}% surcharge` : `-${item.value}% discount`;
      
      return `
      <div class="card" style="margin-bottom:0; border: 1.5px solid var(--slate-200); background: var(--card-bg); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:14px; font-weight:700; color:var(--navy)">${item.name}</div>
          <div class="mkt-detail" style="margin-top:4px; font-size:13px;">
            <span class="material-icons-round ${dirClass}" style="font-size:16px; vertical-align:middle; margin-right:4px;">${dirIcon}</span>
            <span class="${dirClass}">${dirLabel}</span>
          </div>
        </div>
        <button class="btn-primary-sm" id="ai-apply-btn-${index}" onclick="applyAiSeasonal(${index})" style="width:100%; margin-top:14px; display:flex; align-items:center; justify-content:center; gap:6px;">
          <span class="material-icons-round" style="font-size:16px">add_to_photos</span> Create Seasonal Rate
        </button>
      </div>`;
    } else { // email or social
      return `
      <div class="card" style="margin-bottom:0; border: 1.5px solid var(--slate-200); background: var(--card-bg); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <div style="font-size:14px; font-weight:700; color:#6366F1; margin-bottom:6px;">${item.title}</div>
          <div style="font-size:12.5px; line-height:1.6; color:var(--navy); white-space:pre-wrap; max-height:120px; overflow-y:auto;">${item.message}</div>
        </div>
        <button class="btn-primary-sm" onclick="copySuggestionText(${index})" id="copy-sug-btn-${index}" style="width:100%; margin-top:14px; display:flex; align-items:center; justify-content:center; gap:6px; background:#F1F5F9; color:var(--navy); border:1px solid var(--slate-200);">
          <span class="material-icons-round" style="font-size:16px">content_copy</span> Copy Suggestion
        </button>
      </div>`;
    }
  }).join('');
}

window.applyAiBanner = function (index) {
  var item = _aiParsedSuggestions[index];
  if (!item) return;

  var editId = document.getElementById('banner-edit-id');
  var title = document.getElementById('banner-title');
  var message = document.getElementById('banner-message');
  var start = document.getElementById('banner-start');
  var end = document.getElementById('banner-end');
  var color = document.getElementById('banner-color');
  var active = document.getElementById('banner-active');

  if (editId) editId.value = '';
  if (title) title.value = item.title || '';
  if (message) message.value = item.message || '';
  if (start) start.value = getFutureDate(0);
  if (end) end.value = getFutureDate(30);
  if (color) color.value = item.color || '#3B82F6';
  if (active) active.checked = true;

  if (window.openModal) {
    window.openModal('banner');
  } else {
    var modal = document.getElementById('modal-banner');
    if (modal) modal.style.display = 'flex';
  }

  if (window.switchTab) window.switchTab('banners');
  if (window._mktShowToast) window._mktShowToast('Pre-populated banner suggestion.');
};

window.applyAiPromo = function (index) {
  var item = _aiParsedSuggestions[index];
  if (!item) return;

  var editId = document.getElementById('promo-edit-id');
  var code = document.getElementById('promo-code');
  var desc = document.getElementById('promo-desc');
  var type = document.getElementById('promo-type');
  var value = document.getElementById('promo-value');
  var minDays = document.getElementById('promo-min-days');
  var limit = document.getElementById('promo-limit');
  var expiry = document.getElementById('promo-expiry');
  var active = document.getElementById('promo-active');

  if (editId) editId.value = '';
  if (code) code.value = item.code || '';
  if (desc) desc.value = item.description || '';
  if (type) type.value = item.type || 'percent';
  if (value) value.value = item.value || '';
  if (minDays) minDays.value = item.min_days || 1;
  if (limit) limit.value = item.usage_limit || 100;
  if (expiry) expiry.value = item.expiry || getFutureDate(30);
  if (active) active.checked = true;

  if (window.openModal) {
    window.openModal('promo');
  } else {
    var modal = document.getElementById('modal-promo');
    if (modal) modal.style.display = 'flex';
  }

  if (window.switchTab) window.switchTab('promos');
  if (window._mktShowToast) window._mktShowToast('Pre-populated promo suggestion.');
};

window.applyAiSeasonal = function (index) {
  var item = _aiParsedSuggestions[index];
  if (!item) return;

  var editId = document.getElementById('seasonal-edit-id');
  var name = document.getElementById('seasonal-name');
  var start = document.getElementById('seasonal-start');
  var end = document.getElementById('seasonal-end');
  var direction = document.getElementById('seasonal-direction');
  var value = document.getElementById('seasonal-value');
  var active = document.getElementById('seasonal-active');

  if (editId) editId.value = '';
  if (name) name.value = item.name || '';
  if (start) start.value = item.start_date || getFutureDate(0);
  if (end) end.value = item.end_date || getFutureDate(7);
  if (direction) direction.value = item.direction || 'increase';
  if (value) value.value = item.value || '';
  if (active) active.checked = true;

  if (window.openModal) {
    window.openModal('seasonal');
  } else {
    var modal = document.getElementById('modal-seasonal');
    if (modal) modal.style.display = 'flex';
  }

  if (window.switchTab) window.switchTab('seasonal');
  if (window._mktShowToast) window._mktShowToast('Pre-populated seasonal rate suggestion.');
};

window.copySuggestionText = function (index) {
  var item = _aiParsedSuggestions[index];
  if (!item) return;
  var textToCopy = item.message;
  navigator.clipboard.writeText(textToCopy).then(function () {
    var btn = document.getElementById('copy-sug-btn-' + index);
    if (btn) {
      var origHtml = btn.innerHTML;
      btn.innerHTML = '<span class="material-icons-round" style="font-size:16px">check</span> Copied!';
      setTimeout(function () { btn.innerHTML = origHtml; }, 2000);
    }
  }).catch(function () {
    alert('Failed to copy. Please select and copy manually.');
  });
};
