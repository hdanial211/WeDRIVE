# 360 Frame Download Method (without Puppeteer)

## Canonical folder rule

The local and Cloudinary paths must stay identical after the local `shared/`
prefix:

```text
Local:      shared/model/{category}/{model}/...
Cloudinary: model/{category}/{model}/...
```

The pipeline must never create `wedrive-model/`, date folders, random folders,
VIN-only folders or one folder per upload attempt. The model name is the
canonical folder name for every future Add Car upload.

## Working result

Tested on:

- VIN: `pn1bb3cd705691016`
- Output: `shared/model/Carsome/pn1bb3cd705691016/exterior/full-res/`
- Result: `200/200` frames, `frame-000.jpg` through `frame-199.jpg`
- Image size: `3000x1688`
- Storage used: approximately `70 MB`

## Why the old URL failed

This URL is blocked with HTTP 403:

```text
{cdn_prefix}exterior/full-res/frame-000.jpg
```

The SpinCar viewer itself requests a different public CDN path:

```text
{cdn_prefix}ec/0-0.jpg
{cdn_prefix}ec/0-1.jpg
...
{cdn_prefix}ec/0-199.jpg
```

For the Ranger already in the repository, the downloaded CDN file and the
local file have the same SHA-256 hash. This confirms that `ec/0-{index}.jpg`
is the source for the existing local exterior frames.

## Procedure

1. Open the normal SpinCar viewer with Playwright Chromium, without
   `!disableautospin`:

   ```text
   https://spins.spincar.com/Carsome/{VIN}
   ```

2. Capture network responses matching `/ec/0-*.jpg` and read the CDN prefix
   from the response URLs. Do not use the `exterior/full-res/frame-*` pattern.

3. Download each index from 0 to 199 and rename it locally with three-digit
   padding:

   ```text
   CDN:   ec/0-7.jpg
   Local: exterior/full-res/frame-007.jpg
   ```

   The successful transfer command used for the test asset was:

   ```bash
   target="shared/model/Carsome/pn1bb3cd705691016/exterior/full-res"
   prefix="https://cdn.impel.io/swipetospin-viewers/Carsome/pn1bb3cd705691016/20260204093206.EQBSEXFI/ec"
   mkdir -p "$target"
   seq 0 199 | xargs -P 8 -I __INDEX__ bash -c '
     n="$1"
     padded=$(printf "%03d" "$n")
     tmp="$2/.frame-$padded.jpg.part"
     curl --fail --location --retry 3 "$3/0-$n.jpg" -o "$tmp" &&
       mv "$tmp" "$2/frame-$padded.jpg"
   ' _ __INDEX__ "$target" "$prefix"
   ```

4. Verify the result by checking 200 files, zero zero-byte files, and JPEG
   dimensions before updating `source.json`.

## Important detail

The viewer must be opened without `!disableautospin` for it to request the
complete exterior sequence. With `!disableautospin`, the browser may request
only the initial frame and the download script will incorrectly conclude that
the asset is incomplete.

## Cloudinary and local repository workflow

The repository CLI is now `tools/download-spincar-frames.js`. It does not use
Puppeteer. It resolves the Impel `cdn_prefix`, downloads the public `ec` route
with Node `fetch`, writes `shared/model/{category}/{model}/`, and optionally
uploads the same bytes to Cloudinary:

```bash
node tools/download-spincar-frames.js \
  --url "{spincar_url}" \
  --name "2021 Toyota Hilux V Dual Cab 2.4" \
  --category "Truck" \
  --cloudinary
```

The Step 2 browser flow uses the same `ec/0-{index}.jpg` route, but sends the
remote URL to Cloudinary for server-side fetching. The browser therefore does
not need CORS access to the Impel image bytes. Supabase stores only the
Cloudinary manifest in `public.car_visual_assets`; it does not store image
files.
