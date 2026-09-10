/**
 * WeDRIVE — AI Key Vault (Single Source of Truth)
 * shared/js/ai-vault.js (v6.17.0)
 *
 * Central utility for ALL AI modules to read API keys.
 * Every module (chatbot, marketing-ai, studio360, analytics, add-car)
 * MUST read keys from this vault instead of scattered localStorage keys.
 *
 * Slot Map:
 *   Slot 1 → system_core      (add-car AI Auto-Detect, analytics AI Model)
 *   Slot 2 → events_pricing   (marketing-ai content generator)
 *   Slot 3 → customer_chatbot (chatbot.js, chatbot-admin.js)
 *   Slot 4 → downloader_360   (step2-studio360.js CDN scanner & Gemini Vision)
 */

(function (window) {
  'use strict';

  var STORAGE_KEY = 'wedrive_ai_keys';

  // ── Provider Signatures ──────────────────────────────────────────────────
  var PROVIDERS = {
    gemini: {
      id: 'gemini',
      name: 'Google Gemini (Percuma)',
      badgeCls: 'detected-gemini',
      defaultModel: 'gemini-2.5-flash',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      authStyle: 'query', // ?key=
      isFree: true
    },
    openrouter: {
      id: 'openrouter',
      name: 'OpenRouter (Free Tier)',
      badgeCls: 'detected-openrouter',
      defaultModel: 'google/gemini-2.5-flash',
      endpoint: 'https://openrouter.ai/api/v1/chat/completions',
      authStyle: 'bearer',
      isFree: true
    },
    groq: {
      id: 'groq',
      name: 'Groq Cloud (Laju & Percuma)',
      badgeCls: 'detected-groq',
      defaultModel: 'groq/compound-mini',
      endpoint: 'https://api.groq.com/openai/v1/chat/completions',
      authStyle: 'bearer',
      isFree: true
    },
    huggingface: {
      id: 'huggingface',
      name: 'Hugging Face (Percuma)',
      badgeCls: 'detected-huggingface',
      defaultModel: 'mistralai/Mistral-7B-Instruct-v0.3',
      endpoint: 'https://api-inference.huggingface.co/models/',
      authStyle: 'bearer',
      isFree: true
    },
    nvidia: {
      id: 'nvidia',
      name: 'NVIDIA NIM',
      badgeCls: 'detected-nvidia',
      defaultModel: 'meta/llama-3.1-70b-instruct',
      endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
      authStyle: 'bearer',
      isFree: false
    },
    xai: {
      id: 'xai',
      name: 'xAI Grok',
      badgeCls: 'detected-xai',
      defaultModel: 'grok-3-mini',
      endpoint: 'https://api.x.ai/v1/chat/completions',
      authStyle: 'bearer',
      isFree: false
    },
    openai: {
      id: 'openai',
      name: 'OpenAI (GPT-4o)',
      badgeCls: 'detected-openai',
      defaultModel: 'gpt-4o-mini',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      authStyle: 'bearer',
      isFree: false
    },
    anthropic: {
      id: 'anthropic',
      name: 'Anthropic Claude',
      badgeCls: 'detected-anthropic',
      defaultModel: 'claude-3-5-haiku',
      endpoint: 'https://api.anthropic.com/v1/messages',
      authStyle: 'x-api-key',
      isFree: false
    }
  };

  // ── Slot ↔ Role Mapping ──────────────────────────────────────────────────
  var SLOT_ROLES = {
    1: 'system_core',
    2: 'events_pricing',
    3: 'customer_chatbot',
    4: 'downloader_360'
  };

  var ROLE_TO_SLOT = {};
  for (var s in SLOT_ROLES) {
    ROLE_TO_SLOT[SLOT_ROLES[s]] = parseInt(s, 10);
  }

  // ── In-memory cache ──────────────────────────────────────────────────────
  var _cache = null;
  var _listeners = [];

  // ── Auto-detect provider from key prefix ─────────────────────────────────
  function detectProvider(key) {
    if (!key || typeof key !== 'string') return null;
    var k = key.trim();
    if (k.startsWith('AIzaSy')) return PROVIDERS.gemini;
    if (k.startsWith('sk-or-v1-')) return PROVIDERS.openrouter;
    if (k.startsWith('gsk_')) return PROVIDERS.groq;
    if (k.startsWith('hf_')) return PROVIDERS.huggingface;
    if (k.startsWith('nvapi-')) return PROVIDERS.nvidia;
    if (k.startsWith('xai-')) return PROVIDERS.xai;
    if (k.startsWith('sk-ant-')) return PROVIDERS.anthropic;
    if (k.startsWith('sk-proj-') || (k.startsWith('sk-') && !k.startsWith('sk-ant-') && !k.startsWith('sk-or-'))) return PROVIDERS.openai;
    if (k.length > 20) {
      return { id: 'custom', name: 'Kunci Kustom', badgeCls: '', defaultModel: 'custom', endpoint: '', authStyle: 'bearer', isFree: false };
    }
    return null;
  }

  // ── Read keys from localStorage (primary) ────────────────────────────────
  function loadFromStorage() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        _cache = JSON.parse(raw);
        return _cache;
      }
    } catch (e) {
      console.warn('[AI Vault] localStorage read error:', e);
    }
    return null;
  }

  // ── Read keys from Supabase (fallback) ───────────────────────────────────
  async function loadFromSupabase() {
    if (!window.supabaseClient) return null;
    try {
      var r = await window.supabaseClient
        .from('settings')
        .select('value')
        .eq('key', 'ai_keys')
        .maybeSingle();
      if (r.data && r.data.value) {
        _cache = r.data.value;
        // Sync back to localStorage for faster reads
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
        return _cache;
      }
    } catch (e) {
      console.warn('[AI Vault] Supabase read error:', e);
    }
    return null;
  }

  // ── Ensure cache is loaded ───────────────────────────────────────────────
  function ensureCache() {
    if (_cache) return _cache;
    return loadFromStorage();
  }

  // ── Get slot data by slot number ─────────────────────────────────────────
  function getSlotData(slotNum) {
    var keys = ensureCache();
    if (keys && keys['slot' + slotNum] && keys['slot' + slotNum].key) {
      return keys['slot' + slotNum];
    }
    // Backward compatibility fallback for Slot 1
    if (slotNum === 1) {
      var legacyKey = localStorage.getItem('wedrive_gemini_api_key') || localStorage.getItem('gemini_api_key');
      if (legacyKey && legacyKey.trim().length > 10) {
        var det = detectProvider(legacyKey.trim());
        return {
          key: legacyKey.trim(),
          provider: det ? det.id : 'gemini',
          model: det ? det.defaultModel : 'gemini-2.5-flash',
          updatedAt: new Date().toISOString()
        };
      }
    }
    return null;
  }

  // ── Public API ───────────────────────────────────────────────────────────

  /**
   * Get API key by role name
   * @param {string} role - 'system_core' | 'events_pricing' | 'customer_chatbot' | 'downloader_360'
   * @returns {string} API key or empty string
   */
  function getKey(role) {
    var slotNum = ROLE_TO_SLOT[role];
    if (!slotNum) return '';
    var slot = getSlotData(slotNum);
    return slot ? slot.key : '';
  }

  /**
   * Get API key by slot number (1-4)
   * @param {number} slotNum
   * @returns {string} API key or empty string
   */
  function getSlotKey(slotNum) {
    var slot = getSlotData(slotNum);
    return slot ? slot.key : '';
  }

  /**
   * Get provider info for a role
   * @param {string} role
   * @returns {object|null} Provider object with id, name, endpoint, etc.
   */
  function getProvider(role) {
    var key = getKey(role);
    return detectProvider(key);
  }

  /**
   * Get the default model for a role's provider
   * @param {string} role
   * @returns {string} Model name
   */
  function getModel(role) {
    var provider = getProvider(role);
    return provider ? provider.defaultModel : '';
  }

  /**
   * Get the API endpoint for a role's provider
   * @param {string} role
   * @returns {string} Endpoint URL
   */
  function getEndpoint(role) {
    var provider = getProvider(role);
    return provider ? provider.endpoint : '';
  }

  /**
   * Check if a role has a valid key configured
   * @param {string} role
   * @returns {boolean}
   */
  function hasKey(role) {
    var key = getKey(role);
    return key.length > 10;
  }

  /**
   * Get all 4 slot keys
   * @returns {object} All slots data
   */
  function getAllKeys() {
    return ensureCache() || {};
  }

  /**
   * Save a single slot key directly to storage & Supabase
   * @param {number} slotNum - 1 to 4
   * @param {string} key - API key string
   * @param {string} [providerId] - Optional provider override
   * @param {string} [customModel] - Optional custom model override
   * @returns {Promise<boolean>} Success status
   */
  async function saveSlotKey(slotNum, key, providerId, customModel) {
    if (!slotNum || slotNum < 1 || slotNum > 4) return false;
    var trimmedKey = (key || '').trim();
    var detected = detectProvider(trimmedKey);
    var pId = providerId || (detected ? detected.id : '');
    var mName = customModel || (detected ? detected.defaultModel : '');

    var keys = ensureCache() || {
      slot1: { key: '', provider: '', model: '' },
      slot2: { key: '', provider: '', model: '' },
      slot3: { key: '', provider: '', model: '' },
      slot4: { key: '', provider: '', model: '' }
    };

    keys['slot' + slotNum] = {
      key: trimmedKey,
      provider: pId,
      model: mName,
      updatedAt: new Date().toISOString()
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
      _cache = keys;
    } catch (e) {
      console.warn('[AI Vault] localStorage save error:', e);
    }

    // Also sync legacy keys if applicable
    if (slotNum === 1 && (pId === 'gemini' || trimmedKey.startsWith('AIzaSy'))) {
      try { localStorage.setItem('wedrive_gemini_api_key', trimmedKey); } catch (_) {}
    }
    if (slotNum === 3) {
      try {
        var currentChatbot = {};
        try { currentChatbot = JSON.parse(localStorage.getItem('wedrive_chatbot_settings') || '{}'); } catch (_) {}
        currentChatbot.apiKey = trimmedKey;
        currentChatbot.provider = pId;
        localStorage.setItem('wedrive_chatbot_settings', JSON.stringify(currentChatbot));
      } catch (_) {}
    }

    notifyChange();

    // Sync to Supabase if available
    if (window.supabaseClient) {
      try {
        await window.supabaseClient.from('settings').upsert({ key: 'ai_keys', value: keys }, { onConflict: 'key' });
      } catch (err) {
        console.warn('[AI Vault] Supabase sync error:', err);
      }
    }

    return true;
  }

  /**
   * Register a callback for when keys are saved/changed
   * @param {function} callback
   */
  function onKeysChanged(callback) {
    if (typeof callback === 'function') {
      _listeners.push(callback);
    }
  }

  /**
   * Notify all listeners that keys have changed
   */
  function notifyChange() {
    _cache = null; // Invalidate cache
    loadFromStorage(); // Reload
    _listeners.forEach(function (cb) {
      try { cb(_cache); } catch (e) {}
    });
  }

  /**
   * Unified AI call helper — handles multi-provider routing
   * @param {string} role - Vault slot role
   * @param {string} systemPrompt - System instruction
   * @param {string} userMessage - User message / prompt
   * @param {object} [options] - { temperature, maxTokens, model, jsonMode }
   * @returns {Promise<string>} AI response text
   */
  async function callAi(role, systemPrompt, userMessage, options) {
    var key = getKey(role);
    if (!key) throw new Error('Tiada kunci API untuk peranan: ' + role);

    var provider = detectProvider(key);
    if (!provider) throw new Error('Pembekal tidak dikenal pasti untuk kunci ini.');

    var opts = options || {};
    var model = opts.model || provider.defaultModel;
    var temperature = opts.temperature !== undefined ? opts.temperature : 0.7;
    var maxTokens = opts.maxTokens || 2048;
    var jsonMode = opts.jsonMode || false;

    // ── Gemini (query-string auth) ──
    if (provider.id === 'gemini') {
      var geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + encodeURIComponent(key);
      var geminiBody = {
        contents: [{ parts: [{ text: (systemPrompt ? systemPrompt + '\n\n' : '') + userMessage }] }],
        generationConfig: { temperature: temperature, maxOutputTokens: maxTokens }
      };
      if (jsonMode) {
        geminiBody.generationConfig.responseMimeType = 'application/json';
      }

      var gr = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      });
      var gd = await gr.json();
      if (gd.error) throw new Error(gd.error.message || 'Gemini API error');
      return (gd.candidates && gd.candidates[0] && gd.candidates[0].content && gd.candidates[0].content.parts && gd.candidates[0].content.parts[0])
        ? gd.candidates[0].content.parts[0].text
        : '';
    }

    // ── OpenAI-compatible providers (OpenRouter, Groq, NVIDIA, xAI, OpenAI) ──
    var chatUrl = provider.endpoint;
    var chatBody = {
      model: model,
      messages: [],
      temperature: temperature,
      max_tokens: maxTokens
    };
    if (jsonMode && (provider.id === 'openai' || provider.id === 'groq' || provider.id === 'openrouter' || provider.id === 'deepseek')) {
      chatBody.response_format = { type: 'json_object' };
    }
    if (systemPrompt) chatBody.messages.push({ role: 'system', content: systemPrompt });
    chatBody.messages.push({ role: 'user', content: userMessage });

    var headers = { 'Content-Type': 'application/json' };
    if (provider.authStyle === 'bearer') {
      headers['Authorization'] = 'Bearer ' + key;
    } else if (provider.authStyle === 'x-api-key') {
      headers['x-api-key'] = key;
      headers['anthropic-version'] = '2023-06-01';
      // Anthropic uses different body format
      chatBody = {
        model: model,
        system: systemPrompt || '',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: maxTokens
      };
    }

    // OpenRouter-specific headers
    if (provider.id === 'openrouter') {
      headers['HTTP-Referer'] = window.location.origin || 'https://wedrive.my';
      headers['X-Title'] = 'WeDRIVE AI';
    }

    var cr = await fetch(chatUrl, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(chatBody)
    });
    var cd = await cr.json();

    if (cd.error) throw new Error(cd.error.message || (typeof cd.error === 'string' ? cd.error : JSON.stringify(cd.error)) || 'API error');

    // Anthropic response format
    if (provider.id === 'anthropic') {
      return (cd.content && cd.content[0]) ? cd.content[0].text : '';
    }

    // OpenAI-compatible response
    return (cd.choices && cd.choices[0] && cd.choices[0].message)
      ? cd.choices[0].message.content
      : '';
  }

  /**
   * Gemini Vision helper — send image for analysis
   * @param {string} role - Vault slot role to use
   * @param {string} imageUrl - URL of image to analyze
   * @param {string} prompt - Analysis prompt
   * @returns {Promise<string>} AI response
   */
  async function callVision(role, imageUrl, prompt) {
    var key = getKey(role);
    if (!key) throw new Error('Tiada kunci API untuk peranan: ' + role);

    var provider = detectProvider(key);
    if (!provider) throw new Error('Pembekal tidak dikenal pasti.');

    // Vision works best with Gemini
    if (provider.id === 'gemini') {
      // Fetch image as base64
      var imgResp = await fetch(imageUrl);
      var imgBlob = await imgResp.blob();
      var base64 = await blobToBase64(imgBlob);
      var mimeType = imgBlob.type || 'image/jpeg';

      var visionUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + encodeURIComponent(key);
      var visionBody = {
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: base64.split(',')[1] || base64 } }
          ]
        }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 256 }
      };

      var vr = await fetch(visionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visionBody)
      });
      var vd = await vr.json();
      if (vd.error) throw new Error(vd.error.message || 'Gemini Vision error');
      return (vd.candidates && vd.candidates[0] && vd.candidates[0].content && vd.candidates[0].content.parts && vd.candidates[0].content.parts[0])
        ? vd.candidates[0].content.parts[0].text.trim()
        : '';
    }

    // Fallback for non-vision providers: just return empty
    console.warn('[AI Vault] Vision not supported for provider:', provider.id);
    return '';
  }

  // ── Helper: Blob to Base64 ───────────────────────────────────────────────
  function blobToBase64(blob) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onloadend = function () { resolve(reader.result); };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // ── Listen for storage changes (cross-tab sync) ─────────────────────────
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      notifyChange();
    }
  });

  // ── Initialize ───────────────────────────────────────────────────────────
  loadFromStorage();

  // Async: also try Supabase on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadFromSupabase();
    });
  } else {
    loadFromSupabase();
  }

  // ── Expose Public API ────────────────────────────────────────────────────
  window.WeDriveAiVault = {
    getKey: getKey,
    getSlotKey: getSlotKey,
    getProvider: getProvider,
    getModel: getModel,
    getEndpoint: getEndpoint,
    hasKey: hasKey,
    getAllKeys: getAllKeys,
    detectProvider: detectProvider,
    onKeysChanged: onKeysChanged,
    notifyChange: notifyChange,
    callAi: callAi,
    callVision: callVision,
    saveSlotKey: saveSlotKey,
    syncFromSupabase: loadFromSupabase,
    PROVIDERS: PROVIDERS,
    SLOT_ROLES: SLOT_ROLES,
    ROLE_TO_SLOT: ROLE_TO_SLOT
  };

})(window);
