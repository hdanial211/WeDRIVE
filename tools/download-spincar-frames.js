#!/usr/bin/env node
/**
 * WeDRIVE SpinCar 360 downloader (no Puppeteer).
 *
 * The Impel `exterior/full-res/frame-*` path is protected. The public viewer
 * exposes the same exterior frames through `ec/0-{index}.jpg`.
 *
 * This CLI writes the canonical local tree:
 * shared/model/{category}/{model}/exterior/full-res/frame-000.jpg
 * and optionally uploads the same bytes to Cloudinary using an unsigned preset.
 */

const fs = require('fs/promises');
const path = require('path');

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const item = process.argv[i];
  if (!item.startsWith('--')) continue;
  const key = item.slice(2);
  const next = process.argv[i + 1];
  args[key] = next && !next.startsWith('--') ? next : true;
  if (args[key] !== true) i += 1;
}

const SPINCAR_URL = String(args.url || '');
const MODEL_NAME = String(args.name || '');
const CATEGORY = String(args.category || '');
const PLATE = String(args.plate || '');
const LISTING_URL = String(args.listing || '');
const UPLOAD_CLOUDINARY = args.cloudinary === true || args.cloudinary === 'true';
const CLOUDINARY_CLOUD = 'gwd1bhcx';
const CLOUDINARY_PRESET = 'wedrive_360';

if (!SPINCAR_URL || !MODEL_NAME || !CATEGORY) {
  console.error('Usage: node tools/download-spincar-frames.js --url "..." --name "..." --category "..." [--plate "..."] [--listing "..."] [--cloudinary]');
  process.exit(1);
}

function safeSegment(value) {
  return value.replace(/[\\/:*?"<>|]/g, '-').trim();
}

const FOLDER_MODEL_NAME = `${safeSegment(MODEL_NAME)}${PLATE ? ` (${safeSegment(PLATE)})` : ''}`;

function extractSource(url) {
  const vinMatch = url.match(/vin=([a-z0-9_-]+)/i) || url.match(/\/Carsome\/([a-z0-9_-]{10,25})/i);
  const customerMatch = url.match(/customer=([a-z0-9_-]+)/i) || url.match(/\/([a-z0-9_-]+)\/[a-z0-9_-]{10,25}/i);
  return {
    vin: vinMatch ? vinMatch[1] : '',
    customer: customerMatch ? customerMatch[1] : 'Carsome'
  };
}

async function getCdnPrefix(customer, vin) {
  for (const host of ['https://api-eu.impel.io', 'https://api.impel.io']) {
    const endpoint = `${host}/spin/${encodeURIComponent(customer)}/${encodeURIComponent(vin)}?v=20160212`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) continue;
      const data = await response.json();
      let prefix = data && (data.cdn_image_prefix || data.cdn_prefix);
      if (!prefix) continue;
      if (prefix.startsWith('//')) prefix = `https:${prefix}`;
      if (!prefix.endsWith('/')) prefix += '/';
      return prefix;
    } catch (_) {
      // Try the next Impel API host.
    }
  }
  throw new Error('Unable to resolve cdn_prefix from the Impel API.');
}

async function fetchImage(url) {
  const response = await fetch(url, { headers: { accept: 'image/jpeg' } });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 1000) throw new Error(`Empty image response: ${url}`);
  return buffer;
}

async function uploadToCloudinary(buffer, publicId) {
  const form = new FormData();
  form.append('file', new Blob([buffer], { type: 'image/jpeg' }), 'frame.jpg');
  form.append('upload_preset', CLOUDINARY_PRESET);
  form.append('public_id', publicId);
  const cleanPublicId = String(publicId || '').replace(/^\/+|\/+$/g, '');
  const folderSeparator = cleanPublicId.lastIndexOf('/');
  if (folderSeparator > 0) {
    form.append('asset_folder', cleanPublicId.slice(0, folderSeparator));
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
    method: 'POST',
    body: form
  });
  const data = await response.json();
  if (!response.ok) {
    const message = data && data.error && data.error.message ? data.error.message : `HTTP ${response.status}`;
    // The unsigned preset cannot overwrite. Only an explicit duplicate
    // response is safe to treat as an idempotent success; any other error
    // must not produce a fake delivery URL.
    if (/already\s+exists/i.test(message)) {
      return cloudinaryDeliveryUrl(publicId);
    }
    throw new Error(`Cloudinary upload failed: ${message}`);
  }
  if (!data || typeof data.secure_url !== 'string' || !data.secure_url.includes('res.cloudinary.com/')) {
    throw new Error('Cloudinary upload returned no secure asset URL.');
  }
  return data.secure_url;
}

function cloudinaryDeliveryUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD}/image/upload/${publicId.split('/').map(encodeURIComponent).join('/')}.jpg`;
}

async function mapLimit(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function runner() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, runner));
  return results;
}

function cloudinaryPublicId(category, model, section, filename) {
  const sectionPath = section ? `/${section}` : '';
  return `model/${safeSegment(category)}/${safeSegment(model)}${sectionPath}/${filename.replace(/\.jpg$/i, '')}`;
}

(async () => {
  const source = extractSource(SPINCAR_URL);
  if (!source.vin) throw new Error('VIN not found in SpinCar URL.');

  const root = path.resolve(__dirname, '..');
  const modelDir = path.join(root, 'shared', 'model', safeSegment(CATEGORY), FOLDER_MODEL_NAME);
  const exteriorDir = path.join(modelDir, 'exterior', 'full-res');
  const interiorDir = path.join(modelDir, 'interior', 'full-res');
  await fs.mkdir(exteriorDir, { recursive: true });
  await fs.mkdir(interiorDir, { recursive: true });

  const cdnPrefix = await getCdnPrefix(source.customer, source.vin);
  const indices = Array.from({ length: 200 }, (_, index) => index);
  const exteriorUrls = [];
  let completed = 0;

  console.log(`SpinCar downloader (no Puppeteer)`);
  console.log(`Model : ${FOLDER_MODEL_NAME}`);
  console.log(`Output: ${modelDir}`);
  console.log(`CDN   : ${cdnPrefix}`);

  const exteriorResults = await mapLimit(indices, 8, async (index) => {
    const padded = String(index).padStart(3, '0');
    const filename = `frame-${padded}.jpg`;
    const url = `${cdnPrefix}ec/0-${index}.jpg`;
    const temporary = path.join(exteriorDir, `.${filename}.part`);
    const target = path.join(exteriorDir, filename);
    const buffer = await fetchImage(url);
    await fs.writeFile(temporary, buffer);
    await fs.rename(temporary, target);
    let cloudinaryUrl = '';
    if (UPLOAD_CLOUDINARY) {
      cloudinaryUrl = await uploadToCloudinary(
        buffer,
          cloudinaryPublicId(CATEGORY, FOLDER_MODEL_NAME, 'exterior/full-res', filename)
      );
    }
    completed += 1;
    process.stdout.write(`\rExterior: ${completed}/200`);
    return { index, local: `exterior/full-res/${filename}`, url, cloudinaryUrl };
  });
  console.log('');

  const faces = ['f', 'b', 'l', 'r', 'u', 'd'];
  const interiorFaces = {};
  for (const face of faces) {
    const filename = `pano_${face}.jpg`;
    const url = `${cdnPrefix}pano/${filename}`;
    try {
      const buffer = await fetchImage(url);
      const temporary = path.join(interiorDir, `.${filename}.part`);
      await fs.writeFile(temporary, buffer);
      await fs.rename(temporary, path.join(interiorDir, filename));
      let cloudinaryUrl = '';
      if (UPLOAD_CLOUDINARY) {
        cloudinaryUrl = await uploadToCloudinary(
          buffer,
          cloudinaryPublicId(CATEGORY, FOLDER_MODEL_NAME, 'interior/full-res', filename)
        );
      }
      interiorFaces[face] = {
        local: `interior/full-res/${filename}`,
        url,
        cloudinary_url: cloudinaryUrl
      };
    } catch (error) {
      console.warn(`Interior ${face} skipped: ${error.message}`);
    }
  }

  const gallery = [];
  let thumbnailUrl = '';
  if (UPLOAD_CLOUDINARY) {
    const galleryIndices = ['0-0', '0-25', '0-50', '0-75', '0-100', '0-125', '0-150', '0-175'];
    for (const index of galleryIndices) {
      try {
        const filename = `ec-${index.replace('-', '_')}.jpg`;
        const url = `${cdnPrefix}ec/${index}.jpg`;
        const buffer = await fetchImage(url);
        const cloudinaryUrl = await uploadToCloudinary(
          buffer,
          cloudinaryPublicId(CATEGORY, FOLDER_MODEL_NAME, 'gallery', filename)
        );
        gallery.push({ index, url, cloudinary_url: cloudinaryUrl });
      } catch (error) {
        console.warn(`Gallery ${index} skipped: ${error.message}`);
      }
    }

    try {
      const url = `${cdnPrefix}thumb-sm.jpg`;
      const buffer = await fetchImage(url);
      thumbnailUrl = await uploadToCloudinary(
        buffer,
        cloudinaryPublicId(CATEGORY, FOLDER_MODEL_NAME, '', 'thumb-sm.jpg')
      );
    } catch (error) {
      console.warn(`Thumbnail skipped: ${error.message}`);
    }
  }

  const sourceJson = {
    model: FOLDER_MODEL_NAME,
    category: CATEGORY,
    plate: PLATE || undefined,
    vin: source.vin,
    customer: source.customer,
    source_listing_url: LISTING_URL || undefined,
    local_model_path: `${safeSegment(CATEGORY)}/${FOLDER_MODEL_NAME}`,
    cloudinary_folder: `model/${safeSegment(CATEGORY)}/${FOLDER_MODEL_NAME}`,
    cloudinary_thumbnail_url: thumbnailUrl,
    cloudinary_gallery: gallery,
    asset_type: '360-spin-exterior',
    source_viewer_exterior: SPINCAR_URL,
    cdn_prefix: cdnPrefix,
    downloaded_at: new Date().toISOString(),
    download_method: 'Node fetch via public Impel ec/0-{index}.jpg route',
    exterior: {
      frame_start: 0,
      frame_end: 199,
      frame_count: exteriorResults.length,
      frame_pad: 3,
      full_res_pattern: 'exterior/full-res/frame-{padded}.jpg',
      cdn_pattern: 'ec/0-{index}.jpg',
      cloudinary_uploaded: UPLOAD_CLOUDINARY,
      cloudinary_urls: exteriorResults.map(item => item.cloudinaryUrl).filter(Boolean)
    },
    interior: {
      viewer_supported: true,
      format: 'cubemap',
      faces: interiorFaces
    },
    gallery,
    thumbnail_url: thumbnailUrl
  };
  await fs.writeFile(path.join(modelDir, 'source.json'), `${JSON.stringify(sourceJson, null, 2)}\n`);

  console.log(`Done: ${exteriorResults.length}/200 exterior frames`);
  console.log(`Local model path: ${path.relative(root, modelDir)}`);
  if (UPLOAD_CLOUDINARY) console.log('Cloudinary upload: enabled');
})().catch(error => {
  console.error(`\nERROR: ${error.message}`);
  process.exit(1);
});
