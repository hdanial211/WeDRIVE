#!/usr/bin/env node
/**
 * WeDRIVE SpinCar Frame Downloader v2
 * Uses page.evaluate() to fetch frames FROM INSIDE browser context
 * (browser has CloudFront signed cookies from SpinCar viewer)
 */
const puppeteer = require('puppeteer');
const path      = require('path');
const fs        = require('fs');
const https     = require('https');
const http      = require('http');

// CLI
const args = {};
process.argv.slice(2).forEach((a,i,arr) => { if (a.startsWith('--')) args[a.slice(2)] = arr[i+1]===undefined?true:arr[i+1]; });
const SPINCAR_URL   = args.url;
const CAR_NAME      = args.name     || 'Unknown Car';
const CAR_CATEGORY  = args.category || 'Unknown';
const DO_CLOUDINARY = args.cloudinary==='true'||args.cloudinary===true;

if (!SPINCAR_URL) { console.error('Usage: node tools/download-spincar-frames.js --url "..." --name "..." --category "..." [--cloudinary]'); process.exit(1); }

// Cloudinary
const CLD_CLOUD  = 'gwd1bhcx';
const CLD_PRESET = 'wedrive_360';

// Paths
const ROOT    = path.resolve(__dirname, '..');
const SNAME   = CAR_NAME.replace(/[/\\:*?"<>|]/g,'-').trim();
const SCAT    = CAR_CATEGORY.replace(/[/\\:*?"<>|]/g,'-').trim();
const MDIR    = path.join(ROOT,'shared','model',SCAT,SNAME);
const EDIR    = path.join(MDIR,'exterior','full-res');
const IDIR    = path.join(MDIR,'interior','full-res');
fs.mkdirSync(EDIR,{recursive:true}); fs.mkdirSync(IDIR,{recursive:true});

console.log(`\n🚗  WeDRIVE SpinCar Downloader v2`);
console.log(`   Car    : ${CAR_NAME}`);
console.log(`   Output : ${MDIR}`);
console.log(`   Cloud  : ${DO_CLOUDINARY?'✅':'⬜ local only'}\n`);

// Cloudinary upload (no overwrite for unsigned preset)
async function uploadCld(buffer, publicId) {
  const boundary = 'WD' + Date.now();
  const pre  = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="img.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`;
  const mid1 = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="upload_preset"\r\n\r\n${CLD_PRESET}`;
  const mid2 = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="public_id"\r\n\r\n${publicId}`;
  const end  = `\r\n--${boundary}--\r\n`;
  const body = Buffer.concat([Buffer.from(pre), buffer, Buffer.from(mid1+mid2+end)]);
  return new Promise((res,rej) => {
    const req = https.request({ hostname:'api.cloudinary.com', path:`/v1_1/${CLD_CLOUD}/image/upload`, method:'POST', headers:{'Content-Type':`multipart/form-data; boundary=${boundary}`,'Content-Length':body.length} }, r => {
      let raw=''; r.on('data',d=>raw+=d); r.on('end',()=>{ try{ const d=JSON.parse(raw); r.statusCode===200?res(d.secure_url):rej(new Error(`CLD ${r.statusCode}`)); }catch(e){rej(e);} });
    });
    req.on('error',rej); req.write(body); req.end();
  });
}

// Server-side fetch for publicly accessible URLs (interior pano)
function nodeFetch(url) {
  return new Promise((res,rej) => {
    const mod = url.startsWith('https')?https:http;
    mod.get(url, r=>{ const c=[]; r.on('data',d=>c.push(d)); r.on('end',()=>res(Buffer.concat(c))); r.on('error',rej); });
  });
}

(async () => {
  const browser = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--disable-web-security','--disable-features=IsolateOrigins,site-per-process'] });
  const page    = await browser.newPage();
  await page.setViewport({width:1280, height:800});

  // Get cdnPrefix from API first
  let cdnPrefix = '';
  try {
    const m = SPINCAR_URL.match(/vin=([^!&#]+)/i);
    const vin = m?m[1]:'';
    if (vin) {
      const apiR = await fetch(`https://api-eu.impel.io/spin/Carsome/${vin}?v=20160212`);
      const api  = await apiR.json();
      cdnPrefix  = (api.cdn_image_prefix||'').replace(/^\/\//,'https://');
      if (cdnPrefix && !cdnPrefix.endsWith('/')) cdnPrefix+='/';
      console.log(`   🔑 CDN prefix: ${cdnPrefix}`);
    }
  } catch(e) { console.warn('   ⚠️  API call failed:', e.message); }

  console.log('   🌐 Loading SpinCar viewer (to get CloudFront cookies)...');
  await page.goto(SPINCAR_URL, { waitUntil:'networkidle0', timeout:90000 });
  await new Promise(r=>setTimeout(r,3000));

  // Try to get cdnPrefix from page JS if not already
  if (!cdnPrefix) {
    cdnPrefix = await page.evaluate(() => {
      const keys = ['cdnPrefix','cdn_prefix','cdn_image_prefix','window.cdnImagePrefix'];
      for (const k of keys) { try { const v=eval(k); if(v&&v.includes('cdn.impel.io')) return v.startsWith('//')?'https:'+v:v; } catch(_){} }
      // Check all img tags
      const imgs = [...document.querySelectorAll('img')].map(i=>i.src).filter(s=>s.includes('cdn.impel.io/swipetospin-viewers'));
      if (imgs.length) { const m=imgs[0].match(/(https:\/\/cdn\.impel\.io\/swipetospin-viewers\/[^/]+\/[^/]+\/[^/]+\/)/); if(m) return m[1]; }
      return '';
    });
    console.log(`   🔑 CDN from page: ${cdnPrefix}`);
  }

  if (!cdnPrefix) { console.error('❌ Could not determine cdn_prefix. Exiting.'); await browser.close(); process.exit(1); }

  // Fetch ALL 200 frames from INSIDE browser (browser has CloudFront cookies!)
  console.log(`   📡 Fetching 200 frames from inside browser (using CDN cookies)...`);
  const BATCH = 10;
  const allFrameB64 = {};
  
  for (let start = 0; start < 200; start += BATCH) {
    const end = Math.min(start + BATCH, 200);
    const frameNums = Array.from({length: end-start}, (_,i) => start+i);
    
    const results = await page.evaluate(async (prefix, nums) => {
      const out = {};
      await Promise.all(nums.map(async n => {
        const padded = String(n).padStart(3,'0');
        const url = `${prefix}exterior/full-res/frame-${padded}.jpg`;
        try {
          const r = await fetch(url, { credentials:'include', mode:'cors' });
          if (!r.ok) { out[n]=null; return; }
          const blob   = await r.blob();
          const base64 = await new Promise(res => {
            const fr = new FileReader();
            fr.onload = e => res(e.target.result.split(',')[1]);
            fr.readAsDataURL(blob);
          });
          out[n] = base64;
        } catch(_) { out[n]=null; }
      }));
      return out;
    }, cdnPrefix, frameNums);

    let batchOk = 0;
    for (const [n, b64] of Object.entries(results)) {
      if (b64) { allFrameB64[n] = b64; batchOk++; }
    }
    process.stdout.write(`\r   📸 Frames: ${Object.keys(allFrameB64).length}/200 (batch ${Math.ceil(end/BATCH)}/${Math.ceil(200/BATCH)}) `);
  }
  console.log(`\n   ✅ Captured: ${Object.keys(allFrameB64).length} exterior frames`);

  await browser.close();

  // Save exterior frames
  const cldExtUrls = {};
  const fnums = Object.keys(allFrameB64).map(Number).sort((a,b)=>a-b);
  console.log(`\n   💾 Saving ${fnums.length} exterior frames...`);
  for (const n of fnums) {
    const padded = String(n).padStart(3,'0');
    const buf    = Buffer.from(allFrameB64[n], 'base64');
    fs.writeFileSync(path.join(EDIR,`frame-${padded}.jpg`), buf);
    if (DO_CLOUDINARY) {
      try {
        const url = await uploadCld(buf, `wedrive-model/${SCAT}/${SNAME}/exterior/full-res/frame-${padded}`);
        cldExtUrls[n]=url;
        process.stdout.write(`\r   ☁️  Cloudinary: ${Object.keys(cldExtUrls).length}/${fnums.length}`);
      } catch(e){ process.stdout.write(`\n   ⚠️  frame-${padded}: ${e.message}\n`); }
    }
  }

  // Save interior faces (server-side direct fetch — pano/ is public)
  const cldIntUrls = {};
  const FACES = ['f','b','l','r','u','d'];
  console.log(`\n\n   💾 Interior pano faces (server-side fetch)...`);
  for (const face of FACES) {
    const url = `${cdnPrefix}pano/pano_${face}.jpg`;
    try {
      const buf = await nodeFetch(url);
      if (buf.length < 5000) { console.log(`   ⬜ pano_${face} — empty/error`); continue; }
      fs.writeFileSync(path.join(IDIR,`pano_${face}.jpg`), buf);
      console.log(`   ✅ Saved pano_${face}.jpg (${(buf.length/1024).toFixed(0)}KB)`);
      if (DO_CLOUDINARY) {
        try {
          cldIntUrls[face] = await uploadCld(buf, `wedrive-model/${SCAT}/${SNAME}/interior/full-res/pano_${face}`);
          console.log(`   ☁️  Uploaded pano_${face}`);
        } catch(e){ console.warn(`   ⚠️  pano_${face} Cloudinary: ${e.message}`); }
      }
    } catch(e){ console.log(`   ⬜ pano_${face} — ${e.message}`); }
  }

  // source.json
  const src = {
    model: CAR_NAME, category: CAR_CATEGORY, asset_type:'360-spin-exterior',
    source_viewer_exterior: SPINCAR_URL, cdn_prefix: cdnPrefix, downloaded_at: new Date().toISOString(),
    exterior: { frame_start:0, frame_end:199, frame_count:fnums.length, frame_pad:3, full_res_pattern:'exterior/full-res/frame-{padded}.jpg' },
    interior: { viewer_supported:true, format:'cubemap', full_res_pattern:'interior/full-res/pano_{face}.jpg', faces:Object.fromEntries(FACES.filter(f=>fs.existsSync(path.join(IDIR,`pano_${f}.jpg`))).map(f=>[f,`interior/full-res/pano_${f}.jpg`])) },
    ...(DO_CLOUDINARY && { cloudinary:{ cloud:CLD_CLOUD, exterior_frames:Object.values(cldExtUrls), interior_faces:cldIntUrls } })
  };
  fs.writeFileSync(path.join(MDIR,'source.json'), JSON.stringify(src,null,2));

  console.log(`\n${'─'.repeat(58)}`);
  console.log(`✅  DONE — ${CAR_NAME}`);
  console.log(`   🎞️  ${fnums.length}/200 exterior  |  ${FACES.filter(f=>fs.existsSync(path.join(IDIR,`pano_${f}.jpg`))).length}/6 interior`);
  if (DO_CLOUDINARY) console.log(`   ☁️  ${Object.keys(cldExtUrls).length} exterior + ${Object.keys(cldIntUrls).length} interior uploaded to Cloudinary`);
  console.log(`\n📌 Next: git add shared/model && git commit && git push`);
  console.log(`${'─'.repeat(58)}\n`);
})().catch(e => { console.error('\n❌ ERROR:', e.message); process.exit(1); });
