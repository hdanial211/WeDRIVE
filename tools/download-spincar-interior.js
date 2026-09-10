#!/usr/bin/env node
/**
 * Download only the SpinCar interior cube-map faces.
 *
 * This intentionally does not touch the existing exterior/ folder. The public
 * Impel viewer exposes the interior faces at pano/pano_{f,b,d,l,r,u}.jpg.
 *
 * Usage:
 *   node tools/download-spincar-interior.js \
 *     --url "<SpinCar URL>" \
 *     --name "<model name>" \
 *     --category "<category>"
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
const PROVIDED_CDN_PREFIX = String(args['cdn-prefix'] || '');

if (!SPINCAR_URL || !MODEL_NAME || !CATEGORY) {
  console.error('Usage: node tools/download-spincar-interior.js --url "..." --name "..." --category "..." [--plate "..."]');
  process.exit(1);
}

function safeSegment(value) {
  return value.replace(/[\\/:*?"<>|]/g, '-').trim();
}

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
  const contentType = response.headers.get('content-type') || '';
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!contentType.includes('image/') || buffer.length < 1000) {
    throw new Error(`Invalid image response (${contentType || 'unknown'}, ${buffer.length} bytes): ${url}`);
  }
  return buffer;
}

async function readJsonIfPresent(filePath) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
}

(async () => {
  const source = extractSource(SPINCAR_URL);
  if (!source.vin) throw new Error('VIN not found in SpinCar URL.');

  const root = path.resolve(__dirname, '..');
  const folderName = `${safeSegment(MODEL_NAME)}${PLATE ? ` (${safeSegment(PLATE)})` : ''}`;
  const modelDir = path.join(root, 'shared', 'model', safeSegment(CATEGORY), folderName);
  const interiorDir = path.join(modelDir, 'interior', 'full-res');
  const sourcePath = path.join(modelDir, 'source.json');
  await fs.mkdir(interiorDir, { recursive: true });

  let cdnPrefix = PROVIDED_CDN_PREFIX;
  if (cdnPrefix && !cdnPrefix.endsWith('/')) cdnPrefix += '/';
  if (!cdnPrefix) {
    const existing = await readJsonIfPresent(sourcePath);
    cdnPrefix = existing.cdn_prefix || '';
  }
  if (!cdnPrefix) cdnPrefix = await getCdnPrefix(source.customer, source.vin);
  const faces = ['f', 'b', 'd', 'l', 'r', 'u'];
  const interiorFaces = {};

  console.log('SpinCar interior downloader');
  console.log(`Model : ${folderName}`);
  console.log(`Output: ${path.relative(root, modelDir)}`);
  console.log(`CDN   : ${cdnPrefix}`);

  for (const face of faces) {
    const filename = `pano_${face}.jpg`;
    const url = `${cdnPrefix}pano/${filename}`;
    const target = path.join(interiorDir, filename);
    const temporary = path.join(interiorDir, `.${filename}.part`);
    const buffer = await fetchImage(url);
    await fs.writeFile(temporary, buffer);
    await fs.rename(temporary, target);
    interiorFaces[face] = {
      local: `interior/full-res/${filename}`,
      url,
      bytes: buffer.length
    };
    console.log(`Downloaded ${face} (${buffer.length} bytes)`);
  }

  const existing = await readJsonIfPresent(sourcePath);
  const updated = {
    ...existing,
    model: existing.model || folderName,
    category: existing.category || CATEGORY,
    vin: existing.vin || source.vin,
    customer: existing.customer || source.customer,
    source_viewer_interior: existing.source_viewer_interior || SPINCAR_URL,
    cdn_prefix: existing.cdn_prefix || cdnPrefix,
    downloaded_at: new Date().toISOString(),
    interior: {
      type: 'cube-map-panorama',
      viewer_supported: true,
      faces: faces,
      full_res_pattern: 'interior/full-res/pano_{face}.jpg',
      cdn_pattern: 'pano/pano_{face}.jpg',
      files: interiorFaces
    }
  };
  await fs.writeFile(sourcePath, `${JSON.stringify(updated, null, 2)}\n`);

  console.log(`Done: ${faces.length}/6 interior faces`);
  console.log(`Metadata: ${path.relative(root, sourcePath)}`);
})().catch(error => {
  console.error(`\nERROR: ${error.message}`);
  process.exit(1);
});
