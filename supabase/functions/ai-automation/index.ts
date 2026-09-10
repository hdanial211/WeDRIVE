import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const AUTOMATION_SECRET = Deno.env.get("AI_AUTOMATION_SECRET");
const FROM_EMAIL = "WeDRIVE <noreply@wedrive.website>";

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-automation-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const PROVIDERS: Record<string, { endpoint: string; model: string; kind: string }> = {
  groq: { endpoint: "https://api.groq.com/openai/v1/chat/completions", model: "groq/compound-mini", kind: "openai" },
  openrouter: { endpoint: "https://openrouter.ai/api/v1/chat/completions", model: "google/gemini-2.5-flash", kind: "openai" },
  openai: { endpoint: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini", kind: "openai" },
  xai: { endpoint: "https://api.x.ai/v1/chat/completions", model: "grok-3-mini", kind: "openai" },
  nvidia: { endpoint: "https://integrate.api.nvidia.com/v1/chat/completions", model: "meta/llama-3.1-70b-instruct", kind: "openai" },
  gemini: { endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", model: "gemini-2.5-flash", kind: "gemini" },
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function htmlEscape(value: unknown) {
  return text(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[char] || char));
}

function plainTextToHtml(value: string) {
  return value.split(/\n{2,}/).map((paragraph) => `<p style="color:#475569;line-height:1.7;margin:0 0 14px;">${htmlEscape(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function dateOffset(days: number) {
  return new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);
}

function providerFromSlot(slot: Record<string, unknown> | undefined, key: string) {
  const explicit = text(slot?.provider).toLowerCase();
  if (explicit && PROVIDERS[explicit]) return { id: explicit, ...PROVIDERS[explicit], key };
  if (key.startsWith("gsk_")) return { id: "groq", ...PROVIDERS.groq, key };
  if (key.startsWith("sk-or-v1-")) return { id: "openrouter", ...PROVIDERS.openrouter, key };
  if (key.startsWith("AIzaSy")) return { id: "gemini", ...PROVIDERS.gemini, key };
  if (key.startsWith("sk-")) return { id: "openai", ...PROVIDERS.openai, key };
  return null;
}

async function getAiSlot(role: string) {
  const { data, error } = await db.from("settings").select("value").eq("key", "ai_keys").maybeSingle();
  if (error) throw new Error("Gagal membaca konfigurasi AI: " + error.message);
  const keys = data?.value || {};
  const slotNumber: Record<string, string> = {
    events_pricing: "slot2",
    customer_lifecycle: "slot5",
    document_verification: "slot6",
  };
  const slot = keys[slotNumber[role]] || {};
  const key = text(slot.key);
  const provider = providerFromSlot(slot, key);
  if (!provider) throw new Error("API key belum dikonfigurasi untuk " + role + ".");
  if (slot.model) provider.model = text(slot.model, provider.model);
  return provider;
}

function parseAiJson(raw: string) {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "");
  try { return JSON.parse(cleaned); } catch (_) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("Respons AI bukan JSON yang sah.");
  }
}

async function callTextAi(role: string, systemPrompt: string, userPrompt: string, maxTokens = 800) {
  const provider = await getAiSlot(role);
  if (provider.kind === "gemini") {
    const url = provider.endpoint.replace("gemini-2.5-flash", encodeURIComponent(provider.model)) + "?key=" + encodeURIComponent(provider.key);
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: maxTokens, responseMimeType: "application/json" },
      }),
    });
    const json = await result.json();
    if (!result.ok || json.error) throw new Error(json.error?.message || "Gemini AI request gagal.");
    return json.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  const result = await fetch(provider.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + provider.key,
      ...(provider.id === "openrouter" ? { "HTTP-Referer": SUPABASE_URL, "X-Title": "WeDRIVE AI Automation" } : {}),
    },
    body: JSON.stringify({
      model: provider.model,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
      temperature: 0.35,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });
  const json = await result.json();
  if (!result.ok || json.error) throw new Error(json.error?.message || "AI provider request gagal.");
  return json.choices?.[0]?.message?.content || "";
}

async function callVisionAi(documentType: string, mimeType: string, base64: string) {
  const provider = await getAiSlot("document_verification");
  const instruction = `Analyse this ${documentType} document for a car rental KYC review. Return JSON only with these fields: document_type, readable (boolean), full_name, id_number, expiry_date, issues (array of strings), confidence (number 0-100). Do not invent values. If a field is unreadable, return null and explain it in issues.`;

  if (provider.kind === "gemini") {
    const url = provider.endpoint.replace("gemini-2.5-flash", encodeURIComponent(provider.model)) + "?key=" + encodeURIComponent(provider.key);
    const result = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: instruction }, { inline_data: { mime_type: mimeType, data: base64 } }] }],
        generationConfig: { temperature: 0.1, maxOutputTokens: 500, responseMimeType: "application/json" },
      }),
    });
    const json = await result.json();
    if (!result.ok || json.error) throw new Error(json.error?.message || "Vision AI request gagal.");
    return { provider: provider.id, model: provider.model, value: parseAiJson(json.candidates?.[0]?.content?.parts?.[0]?.text || "") };
  }

  const result = await fetch(provider.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": "Bearer " + provider.key },
    body: JSON.stringify({
      model: provider.model,
      messages: [{ role: "user", content: [
        { type: "text", text: instruction },
        { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64}` } },
      ] }],
      temperature: 0.1,
      max_tokens: 500,
      response_format: { type: "json_object" },
    }),
  });
  const json = await result.json();
  if (!result.ok || json.error) throw new Error(json.error?.message || "Vision AI request gagal.");
  return { provider: provider.id, model: provider.model, value: parseAiJson(json.choices?.[0]?.message?.content || "") };
}

async function authorize(req: Request) {
  const automationSecret = req.headers.get("x-automation-secret");
  if (AUTOMATION_SECRET && automationSecret && automationSecret === AUTOMATION_SECRET) return true;
  const header = req.headers.get("Authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const { data: userData } = await db.auth.getUser(token);
  const email = userData.user?.email;
  if (!email) return false;
  const { data: admin } = await db.from("admins").select("role").ilike("email", email).maybeSingle();
  return String(admin?.role || "").toLowerCase() === "admin";
}

function emailHtml(name: string, subject: string, body: string) {
  return `<div style="font-family:Arial,sans-serif;background:#f7f9fb;padding:36px 20px;"><div style="max-width:520px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;"><div style="background:linear-gradient(135deg,#1e293b,#1d4ed8);padding:28px;text-align:center;"><h1 style="color:#fff;margin:0;font-size:22px;">WeDRIVE</h1><p style="color:#bfdbfe;font-size:12px;margin:5px 0 0;">AI Customer Service</p></div><div style="padding:28px;"><p style="color:#475569;line-height:1.7;">Hi ${htmlEscape(name || "Customer")},</p><h2 style="color:#1e293b;font-size:20px;">${htmlEscape(subject)}</h2>${plainTextToHtml(body)}<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:26px;">WeDRIVE Car Rental, Melaka</p></div></div></div>`;
}

async function sendEmail(to: string, name: string, subject: string, body: string) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY belum dikonfigurasi pada Edge Function.");
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html: emailHtml(name, subject, body) }),
  });
  const json = await result.json();
  if (!result.ok) throw new Error(json.message || "Email gagal dihantar.");
  return json.id || null;
}

function validPlannerDate(value: unknown, year: number) {
  const candidate = text(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return null;
  const date = new Date(candidate + "T00:00:00Z");
  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() !== year) return null;
  return candidate;
}

function plannerKey(year: number, title: string, startDate: string | null, index: number) {
  const base = `${year}-${title}-${startDate || "undated"}-${index}`;
  return base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 180);
}

async function generateEventPlan(payload: Record<string, unknown>) {
  const currentYearNumber = new Date().getUTCFullYear();
  const requestedYear = Number.parseInt(String(payload.year ?? ""), 10);
  const year = Number.isFinite(requestedYear) ? Math.min(Math.max(requestedYear, currentYearNumber - 1), currentYearNumber + 3) : currentYearNumber;
  const region = text(payload.region, "Melaka, Malaysia");
  const focus = text(payload.focus, "cuti sekolah, cuti umum, Ramadan dan Raya, perayaan utama, hujung minggu panjang, musim pelancongan dan acara tempatan yang sesuai untuk promosi sewaan kereta");
  const prompt = `Prepare an event opportunity calendar for ${region} for calendar year ${year}. Focus on: ${focus}.

Use your best current factual knowledge. Do not invent official dates, discounts, venues, prices or events. Include Malaysian public holidays, school holiday windows, religious/festival seasons and relevant local/travel periods when they are genuinely suitable for car rental promotion. If an exact date is uncertain, return null dates, explain why in rationale, and lower confidence. Return JSON only in this shape:
{"events":[{"title":"...","category":"public_holiday|school_holiday|religious_festival|travel_season|local_event|long_weekend","start_date":"YYYY-MM-DD or null","end_date":"YYYY-MM-DD or null","rationale":"...","suggested_action":"...","confidence":0-100,"source_notes":["..."],"needs_verification":true}]}

Return 8 to 16 useful candidates, prioritised for a Malaysian car-rental company. Dates are planning suggestions and must be reviewed by an admin before publication.`;
  const generated = parseAiJson(await callTextAi("events_pricing", "You are the WeDRIVE event research planner. Accuracy is more important than filling every date. Never fabricate facts.", prompt, 2400));
  const rawEvents = Array.isArray(generated.events) ? generated.events : [];
  const rows = rawEvents.slice(0, 20).map((item: Record<string, unknown>, index: number) => {
    const title = text(item.title);
    if (!title) return null;
    const startDate = validPlannerDate(item.start_date, year);
    let endDate = validPlannerDate(item.end_date, year);
    if (startDate && endDate && endDate < startDate) endDate = startDate;
    const confidence = Math.min(100, Math.max(0, Number(item.confidence) || 0));
    return {
      event_key: plannerKey(year, title, startDate, index),
      title,
      category: text(item.category, "travel_season"),
      region,
      start_date: startDate,
      end_date: endDate || startDate,
      rationale: text(item.rationale),
      suggested_action: text(item.suggested_action),
      confidence,
      verification_status: "needs_review",
      generated_by: "events_pricing_ai",
      source_notes: Array.isArray(item.source_notes) ? item.source_notes.slice(0, 6).map((note: unknown) => text(note)).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    };
  }).filter(Boolean);
  if (!rows.length) throw new Error("AI tidak menghasilkan cadangan event yang sah.");
  const { data, error } = await db.from("ai_event_suggestions").upsert(rows, { onConflict: "event_key" }).select().order("start_date", { ascending: true, nullsFirst: false });
  if (error) throw new Error("Gagal menyimpan cadangan event: " + error.message);
  return { year, region, total: data?.length || 0, suggestions: data || [] };
}

async function generateCampaign(event: Record<string, unknown>) {
  const eventKey = text(event.id || event.event_key || event.title).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const title = text(event.title, "Upcoming WeDRIVE Event");
  const eventDate = text(event.event_date || event.date) || null;
  const description = text(event.description || event.details, "");
  const prompt = `Event: ${title}\nDate: ${eventDate || "not specified"}\nDetails: ${description}\nCreate a concise Malaysian car-rental promotion for registered customers. Return JSON only: {"subject":"...","body":"..."}. Use a clear call to action but do not invent discount, price, venue or terms that are not in the event details.`;
  const generated = parseAiJson(await callTextAi("events_pricing", "You create accurate WeDRIVE event promotions. Never invent commercial facts.", prompt));
  const subject = text(generated.subject);
  const body = text(generated.body);
  if (!subject || !body) throw new Error("AI Event tidak menghasilkan subject/body yang lengkap.");
  const { data, error } = await db.from("ai_campaigns").upsert({
    event_key: eventKey,
    title,
    event_date: eventDate,
    description,
    subject,
    body_text: body,
    status: "ready",
    updated_at: new Date().toISOString(),
  }, { onConflict: "event_key" }).select().single();
  if (error) throw new Error("Gagal menyimpan kempen AI: " + error.message);
  return data;
}

async function sendCampaign(campaign: Record<string, unknown>) {
  const { data: customers, error } = await db.from("customers").select("id,name,email").not("email", "is", null);
  if (error) throw new Error("Gagal membaca pelanggan: " + error.message);
  let sent = 0;
  let skipped = 0;
  for (const customer of customers || []) {
    const dedupeKey = `campaign:${campaign.event_key}:customer:${customer.id}`;
    const existing = await db.from("ai_notification_log").select("id,status").eq("dedupe_key", dedupeKey).maybeSingle();
    if (existing.data?.status === "sent") { skipped++; continue; }
    await db.from("ai_notification_log").upsert({
      dedupe_key: dedupeKey,
      notification_type: "event_promotion",
      campaign_id: campaign.id,
      customer_id: customer.id,
      status: "pending",
      payload: { event_key: campaign.event_key },
    }, { onConflict: "dedupe_key" });
    try {
      const customerName = text(customer.name, "Customer");
      const messageId = await sendEmail(text(customer.email), customerName, text(campaign.subject), text(campaign.body_text).replace(/\{\{customer_name\}\}/g, customerName));
      await db.from("ai_notification_log").update({ status: "sent", provider_message_id: messageId, sent_at: new Date().toISOString() }).eq("dedupe_key", dedupeKey);
      sent++;
    } catch (error) {
      await db.from("ai_notification_log").update({ status: "failed", error_message: String(error instanceof Error ? error.message : error) }).eq("dedupe_key", dedupeKey);
    }
  }
  await db.from("ai_campaigns").update({ status: "sent", sent_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", campaign.id);
  return { sent, skipped, total: customers?.length || 0 };
}

async function runBookingReminders() {
  const dueDates = [1, 3].map((days) => ({ days, date: dateOffset(days) }));
  const { data: bookings, error } = await db.from("bookings").select("*").in("start_date", dueDates.map((item) => item.date));
  if (error) throw new Error("Gagal membaca tempahan: " + error.message);
  const { data: customers } = await db.from("customers").select("id,name,email,auth_uid,verification_status").not("email", "is", null);
  const byEmail = new Map((customers || []).map((customer) => [String(customer.email).toLowerCase(), customer]));
  let sent = 0;
  let skipped = 0;
  for (const booking of bookings || []) {
    const bookingStatus = String(booking.status || "").toLowerCase();
    if (["cancelled", "canceled", "rejected", "completed", "refunded"].includes(bookingStatus)) continue;
    const days = dueDates.find((item) => item.date === booking.start_date)?.days;
    if (!days || !booking.email) continue;
    const customer = byEmail.get(String(booking.email).toLowerCase());
    const dedupeKey = `booking:${booking.id}:reminder:${days}:${booking.start_date}`;
    const existing = await db.from("ai_notification_log").select("id,status").eq("dedupe_key", dedupeKey).maybeSingle();
    if (existing.data?.status === "sent") { skipped++; continue; }
    const prompt = `Customer: ${booking.customer || customer?.name || "Customer"}\nVehicle: ${booking.car || "not specified"}\nBooking ID: ${booking.booking_id || booking.id}\nPickup date: ${booking.start_date}\nReturn date: ${booking.end_date}\nPickup location: ${booking.pickup || "not specified"}\nDays before pickup: ${days}\nDocument verification status: ${customer?.verification_status || "unknown"}\nCreate a concise reminder email. Return JSON only: {"subject":"...","body":"..."}. Mention IC and driving licence only when verification is not Verified. Do not invent prices or policies.`;
    const generated = parseAiJson(await callTextAi("customer_lifecycle", "You write accurate WeDRIVE customer reminder emails. Never invent booking facts.", prompt));
    const subject = text(generated.subject);
    const body = text(generated.body);
    if (!subject || !body) continue;
    await db.from("ai_notification_log").upsert({
      dedupe_key: dedupeKey,
      notification_type: `booking_reminder_${days}d`,
      customer_id: customer?.id || null,
      booking_id: booking.id,
      scheduled_for: booking.start_date,
      status: "pending",
      payload: { days_before_pickup: days },
    }, { onConflict: "dedupe_key" });
    try {
      const messageId = await sendEmail(text(booking.email), text(booking.customer, text(customer?.name, "Customer")), subject, body);
      await db.from("ai_notification_log").update({ status: "sent", provider_message_id: messageId, sent_at: new Date().toISOString() }).eq("dedupe_key", dedupeKey);
      sent++;
    } catch (error) {
      await db.from("ai_notification_log").update({ status: "failed", error_message: String(error instanceof Error ? error.message : error) }).eq("dedupe_key", dedupeKey);
    }
  }
  return { sent, skipped, checked: bookings?.length || 0, dates: dueDates };
}

async function verifyDocument(payload: Record<string, unknown>) {
  const customerId = Number(payload.customer_id);
  const documentType = text(payload.document_type);
  const documentUrl = text(payload.document_url);
  if (!customerId || !documentUrl || !["ic_front", "ic_back", "license_front", "license_back", "form"].includes(documentType)) {
    throw new Error("customer_id, document_type dan document_url diperlukan.");
  }
  const parsedUrl = new URL(documentUrl);
  if (!parsedUrl.hostname.endsWith("supabase.co") && !parsedUrl.hostname.endsWith("cloudinary.com")) {
    throw new Error("Sumber dokumen tidak dibenarkan.");
  }
  const fileResponse = await fetch(documentUrl);
  if (!fileResponse.ok) throw new Error("Dokumen tidak dapat dimuatkan.");
  const mimeType = (fileResponse.headers.get("content-type") || "image/jpeg").split(";")[0];
  const bytes = new Uint8Array(await fileResponse.arrayBuffer());
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  const base64 = btoa(binary);
  const result = await callVisionAi(documentType, mimeType, base64);
  const value = result.value || {};
  const review = {
    customer_id: customerId,
    document_type: documentType,
    document_url: documentUrl,
    status: "reviewed",
    extracted_data: value,
    confidence: Number(value.confidence) || null,
    issues: Array.isArray(value.issues) ? value.issues : [],
    provider: result.provider,
    model: result.model,
    error_message: null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await db.from("document_ai_reviews").upsert(review, { onConflict: "customer_id,document_type,document_url" }).select().single();
  if (error) throw new Error("Gagal menyimpan review dokumen: " + error.message);
  return { review: data, auto_approval: false };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    if (!(await authorize(req))) return response({ error: "Admin authorization required." }, 401);
    const payload = await req.json();
    const action = text(payload.action);
    if (action === "promote_event") {
      const campaign = await generateCampaign(payload.event || payload);
      const delivery = payload.send === true ? await sendCampaign(campaign) : null;
      return response({ success: true, action, campaign, delivery });
    }
    if (action === "generate_event_plan") return response({ success: true, action, result: await generateEventPlan(payload) });
    if (action === "run_booking_reminders") return response({ success: true, action, result: await runBookingReminders() });
    if (action === "verify_document") return response({ success: true, action, result: await verifyDocument(payload) });
    if (action === "health") {
      const configured: Record<string, boolean> = {};
      for (const role of ["events_pricing", "customer_lifecycle", "document_verification"]) {
        try { await getAiSlot(role); configured[role] = true; } catch (_) { configured[role] = false; }
      }
      return response({ success: true, configured, resend_configured: Boolean(RESEND_API_KEY), date: todayUtc() });
    }
    return response({ error: "Unknown action." }, 400);
  } catch (error) {
    console.error("[ai-automation]", error);
    return response({ success: false, error: error instanceof Error ? error.message : String(error) }, 500);
  }
});
