import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const CLOUDINARY_CLOUD = Deno.env.get("CLOUDINARY_CLOUD_NAME") || "gwd1bhcx";
const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY") || "";
const CLOUDINARY_API_SECRET = Deno.env.get("CLOUDINARY_API_SECRET") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function normaliseFolder(value: unknown) {
  const folder = String(value || "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\\/g, "/");
  if (!/^model\/[A-Za-z0-9 _().-]+\/[A-Za-z0-9 _().-]+(?:\/.*)?$/.test(folder)) {
    throw new Error("Folder mesti bermula dengan model/{category}/{model_name}.");
  }
  if (folder.includes("..")) throw new Error("Folder path tidak sah.");
  return folder;
}

function cloudinaryFolderUrl(folder: string) {
  const encoded = folder.split("/").map((segment) => encodeURIComponent(segment)).join("/");
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/folders/${encoded}`;
}

async function createFolder(folder: string) {
  const response = await fetch(cloudinaryFolderUrl(folder), {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`,
    },
  });
  const text = await response.text();
  let data: Record<string, unknown> = {};
  try { data = JSON.parse(text); } catch (_) {}

  if (!response.ok && response.status !== 409) {
    const error = data.error && typeof data.error === "object"
      ? (data.error as Record<string, unknown>).message
      : text;
    throw new Error(`Cloudinary folder ${response.status}: ${String(error || "gagal")}`);
  }
  return { folder, status: response.status, already_exists: response.status === 409 };
}

function cloudinaryResourcesUrl() {
  return `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/resources/image/upload`;
}

async function deleteResourcesByPrefix(folder: string) {
  const prefix = `${folder.replace(/\/+$/g, "")}/`;
  const body = new URLSearchParams();
  body.set("prefix", prefix);
  body.set("invalidate", "true");

  const response = await fetch(cloudinaryResourcesUrl(), {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const text = await response.text();
  let data: Record<string, unknown> = {};
  try { data = JSON.parse(text); } catch (_) {}

  if (!response.ok && response.status !== 404) {
    const error = data.error && typeof data.error === "object"
      ? (data.error as Record<string, unknown>).message
      : text;
    throw new Error(`Cloudinary delete ${response.status}: ${String(error || "gagal")}`);
  }
  return { folder, prefix, status: response.status, result: data };
}

async function deleteFolder(folder: string) {
  const response = await fetch(cloudinaryFolderUrl(folder), {
    method: "DELETE",
    headers: {
      Authorization: `Basic ${btoa(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`)}`,
    },
  });
  const text = await response.text();
  let data: Record<string, unknown> = {};
  try { data = JSON.parse(text); } catch (_) {}

  // A folder may already be gone or may have been removed automatically.
  if (!response.ok && response.status !== 404) {
    const error = data.error && typeof data.error === "object"
      ? (data.error as Record<string, unknown>).message
      : text;
    throw new Error(`Cloudinary folder delete ${response.status}: ${String(error || "gagal")}`);
  }
  return { folder, status: response.status };
}

async function deleteAssets(folders: unknown) {
  if (!Array.isArray(folders) || folders.length === 0) {
    throw new Error("Sekurang-kurangnya satu folder Cloudinary diperlukan.");
  }

  const normalised = [...new Set(folders.map(normaliseFolder))].sort((a, b) => b.length - a.length);
  const resources = [];
  for (const folder of normalised) resources.push(await deleteResourcesByPrefix(folder));

  // Remove known empty child folders, then the parent folder. Failures here
  // are reported because the user explicitly requested complete cleanup.
  const allFolders = new Set<string>();
  for (const folder of normalised) {
    allFolders.add(folder);
    allFolders.add(`${folder}/exterior`);
    allFolders.add(`${folder}/exterior/full-res`);
    allFolders.add(`${folder}/interior`);
    allFolders.add(`${folder}/interior/full-res`);
    allFolders.add(`${folder}/gallery`);
  }
  const removedFolders = [];
  for (const folder of [...allFolders].sort((a, b) => b.length - a.length)) {
    removedFolders.push(await deleteFolder(folder));
  }
  return { resources, folders: removedFolders };
}

serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

  if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return json({ error: "Cloudinary Admin API secrets belum ditetapkan di Supabase." }, 503);
  }

  // Supabase Edge Gateway validates the JWT when this function is deployed
  // with verify_jwt=true. Keep an explicit header check for local invocations.
  if (!request.headers.get("authorization")) {
    return json({ error: "Admin authentication diperlukan." }, 401);
  }

  try {
    const body = await request.json();
    if (body.action === "create_folders") {
      const base = normaliseFolder(body.folder);
      const folders = [
        base,
        `${base}/exterior`,
        `${base}/exterior/full-res`,
        `${base}/interior`,
        `${base}/interior/full-res`,
        `${base}/gallery`,
      ];

      const results = [];
      for (const folder of folders) results.push(await createFolder(folder));
      return json({ ok: true, cloudinary_folder: base, folders: results });
    }

    if (body.action === "delete_assets") {
      return json({ ok: true, action: "delete_assets", ...(await deleteAssets(body.folders)) });
    }

    return json({ error: "Action tidak disokong." }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Folder creation failed" }, 500);
  }
});
