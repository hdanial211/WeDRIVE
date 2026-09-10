/**
 * WeDRIVE - AI Automation Centre
 * Reads live operational records and calls the protected AI service.
 */
(function () {
  'use strict';

  var SLOT_CONFIG = [
    { slot: 1, role: 'system_core', title: 'AI Sistem & Auto-Fill', icon: 'psychology', tone: '', description: 'Spesifikasi kereta dan analisis operasi.' },
    { slot: 2, role: 'events_pricing', title: 'AI Event & Promosi', icon: 'campaign', tone: 'purple', description: 'Jana kempen berdasarkan butiran event sebenar.' },
    { slot: 3, role: 'customer_chatbot', title: 'AI Chatbot Pelanggan', icon: 'smart_toy', tone: 'green', description: 'Jawab soalan pelanggan melalui chatbot.' },
    { slot: 4, role: 'downloader_360', title: 'AI Studio 360°', icon: '360', tone: '', description: 'Sedut dan urus visual 360° kenderaan.' },
    { slot: 5, role: 'customer_lifecycle', title: 'AI Reminder Pelanggan', icon: 'notifications_active', tone: 'green', description: 'Tulis reminder 3 hari dan 1 hari sebelum pickup.' },
    { slot: 6, role: 'document_verification', title: 'AI Semakan Dokumen', icon: 'badge', tone: 'purple', description: 'Baca IC, lesen dan borang untuk semakan admin.' }
  ];

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  function displayDate(value) {
    if (!value) return '-';
    var date = new Date(value);
    return isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function notify(message, type) {
    if (typeof window.showToast === 'function') window.showToast(message, type || 'success');
    else console.log('[AI Automation]', message);
  }

  function renderSlotCards() {
    var container = document.getElementById('ai-slot-cards');
    if (!container) return;
    container.innerHTML = SLOT_CONFIG.map(function (item) {
      var ready = window.WeDriveAiVault && window.WeDriveAiVault.hasKey(item.role);
      var provider = ready && window.WeDriveAiVault.getProvider(item.role);
      var model = ready && window.WeDriveAiVault.getModel(item.role);
      var providerName = provider && provider.name ? provider.name : (ready ? 'Provider dikesan' : 'Belum dikonfigurasi');
      var link = item.slot === 3 ? '../chatbot/chatbot.html' : (item.slot === 1 ? '../analytics/analytics.html' : 'api-keys.html#card-slot-' + item.slot);
      return '<article class="ai-auto-card reveal-onload">' +
        '<div class="ai-auto-card-head"><div class="ai-auto-icon ' + item.tone + '"><span class="material-icons-round">' + item.icon + '</span></div>' +
        '<span class="ai-auto-status ' + (ready ? 'ready' : 'off') + '"><span class="dot"></span>' + (ready ? 'Sedia' : 'Belum diisi') + '</span></div>' +
        '<div class="mt-14"><div class="fs-15 fw-700 text-title">Slot ' + item.slot + ' · ' + escapeHtml(item.title) + '</div><div class="fs-12 text-muted mt-4">' + escapeHtml(item.description) + '</div></div>' +
        '<div class="ai-auto-meta"><span>Provider<br><strong>' + escapeHtml(providerName) + '</strong></span><span class="text-right">Model<br><strong>' + escapeHtml(model || '--') + '</strong></span></div>' +
        '<a class="btn-secondary w-full flex-center gap-8 mt-14" href="' + link + '"><span class="material-icons-round fs-15">' + (item.slot === 3 || item.slot === 1 ? 'open_in_new' : 'vpn_key') + '</span>' + (item.slot === 3 || item.slot === 1 ? 'Buka Modul' : 'Urus Slot ' + item.slot) + '</a>' +
        '</article>';
    }).join('');
  }

  function setBackendStatus(health) {
    var el = document.getElementById('backend-status');
    if (!el) return;
    var configured = health && health.configured ? Object.keys(health.configured).filter(function (key) { return health.configured[key]; }).length : 0;
    el.innerHTML = '<strong>' + configured + '/3 automasi tersedia</strong> · Sistem automasi aktif';
  }

  function renderResult(campaign, delivery) {
    var result = document.getElementById('campaign-result');
    if (!result) return;
    result.classList.remove('empty');
    result.innerHTML = '<h4>' + escapeHtml(campaign.subject || campaign.title || 'Kempen AI') + '</h4><p>' + escapeHtml(campaign.body_text || '') + '</p>' +
      (delivery ? '<div class="badge badge-green mt-12">Email dihantar: ' + Number(delivery.sent || 0) + ' · Skip: ' + Number(delivery.skipped || 0) + '</div>' : '<div class="badge badge-blue mt-12">Draf disimpan ke sistem operasi</div>');
  }

  function renderReminderResult(result) {
    var el = document.getElementById('reminder-result');
    if (!el) return;
    el.classList.remove('empty');
    el.innerHTML = '<strong>Reminder selesai diproses.</strong><p class="mt-6">Dihantar: ' + Number(result.sent || 0) + ' · Dilangkau: ' + Number(result.skipped || 0) + ' · Tempahan disemak: ' + Number(result.checked || 0) + '</p>';
  }

  async function loadTables() {
    var sb = window.supabaseClient;
    if (!sb) throw new Error('Perkhidmatan data tidak tersedia.');
    var campaignQuery = sb.from('ai_campaigns').select('event_key,title,subject,status,event_date,created_at').order('created_at', { ascending: false }).limit(12);
    var notificationQuery = sb.from('ai_notification_log').select('notification_type,dedupe_key,status,scheduled_for,sent_at,created_at').order('created_at', { ascending: false }).limit(18);
    var documentQuery = sb.from('document_ai_reviews').select('customer_id,document_type,status,confidence,issues,updated_at').order('updated_at', { ascending: false }).limit(12);
    var results = await Promise.all([campaignQuery, notificationQuery, documentQuery]);
    var campaignError = results[0].error;
    var notificationError = results[1].error;
    var documentError = results[2].error;
    if (campaignError) throw campaignError;
    if (notificationError) throw notificationError;
    if (documentError) throw documentError;

    var rows = [];
    (results[0].data || []).forEach(function (item) { rows.push({ type: 'Kempen', subject: item.subject || item.title, status: item.status, date: item.event_date || item.created_at }); });
    (results[1].data || []).forEach(function (item) { rows.push({ type: item.notification_type || 'Email', subject: item.dedupe_key, status: item.status, date: item.sent_at || item.scheduled_for || item.created_at }); });
    rows.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    var notificationTable = document.getElementById('notification-table');
    notificationTable.innerHTML = rows.length ? rows.slice(0, 24).map(function (row) {
      return '<tr><td>' + escapeHtml(row.type) + '</td><td><strong>' + escapeHtml(row.subject) + '</strong></td><td><span class="ai-auto-status ' + (row.status === 'sent' || row.status === 'ready' ? 'ready' : 'off') + '"><span class="dot"></span>' + escapeHtml(row.status) + '</span></td><td>' + displayDate(row.date) + '</td></tr>';
    }).join('') : '<tr><td colspan="4" class="ai-auto-empty">Belum ada kempen atau log email.</td></tr>';

    var documentTable = document.getElementById('document-table');
    var docs = results[2].data || [];
    documentTable.innerHTML = docs.length ? docs.map(function (item) {
      var issues = Array.isArray(item.issues) ? item.issues.join(', ') : '-';
      return '<tr><td><strong>#' + escapeHtml(item.customer_id) + '</strong></td><td>' + escapeHtml(item.document_type) + '</td><td class="font-tabular">' + (item.confidence == null ? '-' : escapeHtml(item.confidence) + '%') + '</td><td>' + escapeHtml(item.status) + '</td><td>' + escapeHtml(issues || 'Tiada') + '</td></tr>';
    }).join('') : '<tr><td colspan="5" class="ai-auto-empty">Belum ada semakan dokumen.</td></tr>';
  }

  async function refreshAll() {
    var button = document.getElementById('btn-refresh-ai');
    if (button) button.disabled = true;
    try {
      if (window.WeDriveAiVault && window.WeDriveAiVault.syncFromSupabase) await window.WeDriveAiVault.syncFromSupabase();
      renderSlotCards();
      var health = await window.WeDriveAPI.getAiAutomationHealth();
      setBackendStatus(health);
      await loadTables();
    } catch (error) {
      console.error('[AI Automation] Refresh failed:', error);
      var backend = document.getElementById('backend-status');
      if (backend) backend.innerHTML = '<span style="color:#b42318">Sambungan perlu disemak</span>';
      notify('Pusat automasi AI tidak dapat dimuatkan buat sementara.', 'error');
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function submitEvent(event) {
    event.preventDefault();
    var submitter = event.submitter || document.querySelector('#event-form button[type="submit"]');
    var send = submitter && submitter.getAttribute('data-send') === 'true';
    var buttons = document.querySelectorAll('#event-form button');
    buttons.forEach(function (button) { button.disabled = true; });
    try {
      var payload = { title: document.getElementById('event-title').value.trim(), event_date: document.getElementById('event-date').value || null, description: document.getElementById('event-description').value.trim() };
      var result = await window.WeDriveAPI.promoteEventWithAi(payload, send);
      renderResult(result.campaign, result.delivery);
      await loadTables();
      notify(send ? 'Kempen dijana dan email dihantar.' : 'Kempen dijana dan disimpan sebagai draf.', 'success');
    } catch (error) { console.error('[AI Automation] Campaign failed:', error); notify('Kempen tidak dapat dijana buat sementara.', 'error'); }
    finally { buttons.forEach(function (button) { button.disabled = false; }); }
  }

  async function runReminders() {
    var button = document.getElementById('btn-run-reminders');
    button.disabled = true;
    try {
      var response = await window.WeDriveAPI.runAiBookingReminders();
      renderReminderResult(response.result || {});
      await loadTables();
      notify('Reminder AI selesai diproses.', 'success');
    } catch (error) { console.error('[AI Automation] Reminder failed:', error); notify('Reminder tidak dapat dijalankan buat sementara.', 'error'); }
    finally { button.disabled = false; }
  }

  function init() {
    document.getElementById('btn-refresh-ai').addEventListener('click', refreshAll);
    document.getElementById('event-form').addEventListener('submit', submitEvent);
    document.getElementById('btn-run-reminders').addEventListener('click', runReminders);
    refreshAll();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
