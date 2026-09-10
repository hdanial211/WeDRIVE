/** WeDRIVE - AI Event Planner page controller. */
(function () {
  'use strict';

  var suggestions = [];
  var monthNames = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  var categoryNames = {
    public_holiday: 'Cuti umum',
    school_holiday: 'Cuti sekolah',
    religious_festival: 'Perayaan',
    travel_season: 'Musim perjalanan',
    local_event: 'Acara tempatan',
    long_weekend: 'Hujung minggu panjang'
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>'"]/g, function (char) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char];
    });
  }

  function dateText(value) {
    if (!value) return 'Tarikh perlu disahkan';
    var date = new Date(value + 'T00:00:00Z');
    return isNaN(date.getTime()) ? value : date.toLocaleDateString('ms-MY', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  }

  function statusMessage(text, kind) {
    var el = document.getElementById('planner-status');
    if (!el) return;
    el.textContent = text;
    el.className = 'badge ' + (kind === 'success' ? 'badge-green' : kind === 'error' ? 'badge-amber' : 'badge-blue');
  }

  function notify(message, kind) {
    if (typeof window.showToast === 'function') window.showToast(message, kind || 'success');
    else console.log('[Event Planner]', message);
  }

  function renderCalendar() {
    var calendar = document.getElementById('planner-calendar');
    var year = Number(document.getElementById('planner-year').value);
    var dated = suggestions.filter(function (item) { return item.start_date && String(item.start_date).slice(0, 4) === String(year); });
    var byMonth = Array.from({ length: 12 }, function () { return []; });
    dated.forEach(function (item) {
      var month = Number(String(item.start_date).slice(5, 7)) - 1;
      if (month >= 0 && month < 12) byMonth[month].push(item);
    });
    calendar.innerHTML = monthNames.map(function (name, index) {
      var items = byMonth[index];
      return '<div class="planner-month"><div class="planner-month-name">' + name + '</div>' + (items.length ? items.map(function (item) {
        return '<button class="planner-event-chip" onclick="window.selectPlannerEvent(' + Number(item.id) + ')">' + escapeHtml(item.title) + '<small>' + dateText(item.start_date) + '</small></button>';
      }).join('') : '<div class="fs-11 text-muted">Tiada cadangan</div>') + '</div>';
    }).join('');
    var count = document.getElementById('planner-count');
    if (count) count.textContent = suggestions.length + ' event';
  }

  function visibleSuggestions() {
    var year = String(document.getElementById('planner-year').value);
    return suggestions.filter(function (item) {
      return !item.start_date || String(item.start_date).slice(0, 4) === year;
    });
  }

  function renderList() {
    var list = document.getElementById('planner-list');
    var visible = visibleSuggestions();
    if (!visible.length) {
      list.innerHTML = '<div class="planner-empty">Belum ada cadangan event untuk tahun ini.</div>';
      return;
    }
    list.innerHTML = visible.map(function (item) {
      var verified = item.verification_status === 'verified';
      var dismissed = item.verification_status === 'dismissed';
      return '<article class="planner-suggestion" id="planner-item-' + Number(item.id) + '"><div><div class="planner-suggestion-title">' + escapeHtml(item.title) + '</div><div class="planner-suggestion-meta"><span class="badge badge-blue">' + escapeHtml(categoryNames[item.category] || item.category || 'Cadangan event') + '</span><span class="badge ' + (verified ? 'badge-green' : dismissed ? 'badge-amber' : 'badge-purple') + '">' + (verified ? 'Disahkan' : dismissed ? 'Diketepikan' : 'Perlu semakan') + '</span><span class="planner-confidence">Keyakinan ' + Number(item.confidence || 0) + '%</span></div><p><strong>' + escapeHtml(dateText(item.start_date) + (item.end_date && item.end_date !== item.start_date ? ' – ' + dateText(item.end_date) : '')) + '</strong> · ' + escapeHtml(item.rationale || 'Tiada penerangan tambahan.') + '</p><p class="text-muted">Cadangan tindakan: ' + escapeHtml(item.suggested_action || 'Semak kesesuaian dan bina kempen.') + '</p></div><div class="planner-actions"><button class="btn-secondary btn-xs" onclick="window.selectPlannerEvent(' + Number(item.id) + ')"><span class="material-icons-round fs-14">campaign</span> Jana Promosi</button><button class="btn-primary-sm btn-xs" onclick="window.verifyPlannerEvent(' + Number(item.id) + ')"><span class="material-icons-round fs-14">' + (verified ? 'undo' : 'check') + '</span> ' + (verified ? 'Batal Sahkan' : 'Sahkan') + '</button></div></article>';
    }).join('');
  }

  function renderAll() {
    renderCalendar();
    renderList();
  }

  async function loadExisting() {
    var sb = window.supabaseClient;
    if (!sb) return;
    var result = await sb.from('ai_event_suggestions').select('*').order('start_date', { ascending: true, nullsFirst: false }).limit(100);
    if (result.error) throw result.error;
    suggestions = result.data || [];
    renderAll();
  }

  async function generatePlan() {
    var button = document.getElementById('btn-generate-plan');
    var year = Number(document.getElementById('planner-year').value);
    var region = document.getElementById('planner-region').value.trim();
    var focus = document.getElementById('planner-focus').value.trim();
    button.disabled = true;
    button.innerHTML = '<span class="material-icons-round fs-16">sync</span> AI sedang mengkaji...';
    statusMessage('Sedang menjana...', 'info');
    try {
      var response = await window.WeDriveAPI.generateEventPlanWithAi(year, region, focus);
      suggestions = response.result && response.result.suggestions ? response.result.suggestions : [];
      renderAll();
      statusMessage(suggestions.length + ' cadangan dijana', 'success');
      notify('Senarai peluang event berjaya dijana.', 'success');
    } catch (error) {
      console.error('[Event Planner] Generate failed:', error);
      statusMessage('Perlu cuba semula', 'error');
      notify('Senarai event tidak dapat dijana buat sementara.', 'error');
    } finally {
      button.disabled = false;
      button.innerHTML = '<span class="material-icons-round fs-16">auto_awesome</span> Jana Senarai Event';
    }
  }

  window.selectPlannerEvent = async function (id) {
    var item = suggestions.find(function (suggestion) { return Number(suggestion.id) === Number(id); });
    if (!item) return;
    var result = document.getElementById('planner-result');
    result.className = 'planner-empty planner-result';
    result.textContent = 'AI sedang menjana draf promosi...';
    try {
      var response = await window.WeDriveAPI.promoteEventWithAi({ title: item.title, event_date: item.start_date, description: item.rationale + ' ' + item.suggested_action }, false);
      var campaign = response.campaign || {};
      result.className = 'planner-result';
      result.innerHTML = '<h3 class="fs-16 fw-800 text-title">' + escapeHtml(campaign.subject || item.title) + '</h3><p class="fs-13 text-secondary mt-8">' + escapeHtml(campaign.body_text || '') + '</p><span class="badge badge-blue mt-12">Draf disimpan untuk semakan</span>';
      notify('Draf promosi berjaya dijana.', 'success');
    } catch (error) {
      console.error('[Event Planner] Campaign failed:', error);
      result.textContent = 'Draf promosi tidak dapat dijana buat sementara.';
      notify('Draf promosi tidak dapat dijana buat sementara.', 'error');
    }
  };

  window.verifyPlannerEvent = async function (id) {
    var item = suggestions.find(function (suggestion) { return Number(suggestion.id) === Number(id); });
    if (!item || !window.supabaseClient) return;
    var nextStatus = item.verification_status === 'verified' ? 'needs_review' : 'verified';
    var result = await window.supabaseClient.from('ai_event_suggestions').update({ verification_status: nextStatus, updated_at: new Date().toISOString() }).eq('id', item.id).select().single();
    if (result.error) { notify('Status event tidak dapat dikemas kini.', 'error'); return; }
    var index = suggestions.findIndex(function (suggestion) { return Number(suggestion.id) === Number(id); });
    if (index >= 0) suggestions[index] = result.data;
    renderAll();
    notify(nextStatus === 'verified' ? 'Event ditandakan sebagai disahkan.' : 'Semakan event dibuka semula.', 'success');
  };

  function init() {
    document.getElementById('planner-year').value = new Date().getFullYear();
    document.getElementById('btn-generate-plan').addEventListener('click', generatePlan);
    loadExisting().catch(function (error) { console.error('[Event Planner] Load failed:', error); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
