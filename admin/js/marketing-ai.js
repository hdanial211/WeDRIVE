/**
 * WeDRIVE - Marketing AI Module
 * admin/js/marketing-ai.js
 *
 * AI-powered marketing content generator using Gemini API (free tier).
 * API key is stored in Supabase settings table - no code editing needed.
 */

'use strict';

var _aiApiKey = '';

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
- Format the output clearly with numbered options

Generate the ${contentTypeLabel} now:`;

  try {
    var response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + apiKey,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 1024 }
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
