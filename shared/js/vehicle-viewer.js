(function (window, document) {
  'use strict';

  var FACE_ORDER = ['f', 'r', 'b', 'l', 'u', 'd'];
  var DEFAULT_FRAME_COUNT = 200;
  var DEFAULT_SCRIPT_URL = (document.currentScript && document.currentScript.src) || window.location.href;
  var DEFAULT_SHARED_JS_ROOT = new URL('./', DEFAULT_SCRIPT_URL).href;
  var DEFAULT_MODEL_ROOT = new URL('../model/', DEFAULT_SCRIPT_URL).href;
  var DEFAULT_REGISTRY_URL = new URL('registry.json', DEFAULT_MODEL_ROOT).href;
  var THREE_LOCAL_URL = new URL('three.min.js', DEFAULT_SHARED_JS_ROOT).href;
  var THREE_CDN_URL = 'https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.min.js';
  var registryCache = null;
  var registryPromise = null;
  var threePromise = null;
  var manifestCache = {};
  var instanceMap = new WeakMap();
  var instanceList = [];

  function currentLang() {
    try {
      return window.localStorage.getItem('wedrive-lang') || document.documentElement.lang || 'en';
    } catch (error) {
      return document.documentElement.lang || 'en';
    }
  }

  function isMalay() {
    return String(currentLang()).toLowerCase().indexOf('ms') === 0;
  }

  function dispatchLanguageApplied() {
    document.dispatchEvent(new CustomEvent('wedrive:language-applied', {
      detail: { source: 'vehicle-viewer' }
    }));
  }

  function safeGet(el, selector) {
    if (!el) return null;
    return el.querySelector(selector);
  }

  function safeAll(el, selector) {
    if (!el) return [];
    return Array.prototype.slice.call(el.querySelectorAll(selector));
  }

  function fetchJson(url) {
    return window.fetch(url, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Failed to fetch ' + url + ' (' + response.status + ')');
        }
        return response.json();
      });
  }

  function loadThreeLibrary() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (threePromise) return threePromise;

    function injectScript(url) {
      return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = url;
        script.async = true;
        script.setAttribute('data-wedrive-threejs', 'true');
        script.onload = function () {
          if (window.THREE) {
            resolve(window.THREE);
            return;
          }
          reject(new Error('Three.js did not expose a global THREE object'));
        };
        script.onerror = function () {
          reject(new Error('Failed to load Three.js from ' + url));
        };
        document.head.appendChild(script);
      });
    }

    function trySource(index, urls) {
      if (window.THREE) return Promise.resolve(window.THREE);
      if (index >= urls.length) {
        return Promise.reject(new Error('Failed to load Three.js renderer'));
      }
      return injectScript(urls[index]).catch(function () {
        return trySource(index + 1, urls);
      });
    }

    threePromise = trySource(0, [THREE_LOCAL_URL, THREE_CDN_URL]).then(function (THREE) {
      return THREE;
    }).catch(function (error) {
      threePromise = null;
      throw error;
    });

    return threePromise;
  }

  function loadCubeTexture(THREE, urls) {
    return new Promise(function (resolve, reject) {
      var loader = new THREE.CubeTextureLoader();
      loader.load(urls, function (texture) {
        resolve(texture);
      }, undefined, function (error) {
        reject(error || new Error('Failed to load cube texture'));
      });
    });
  }

  function loadRegistry(options) {
    var registryUrl = (options && options.registryUrl) || DEFAULT_REGISTRY_URL;
    if (registryCache) return Promise.resolve(registryCache);
    if (registryPromise) return registryPromise;

    registryPromise = fetchJson(registryUrl).then(function (data) {
      registryCache = data || {};
      return registryCache;
    }).catch(function () {
      registryCache = window.__WEDRIVE_VEHICLE_REGISTRY__ || {};
      return registryCache;
    }).finally(function () {
      registryPromise = null;
    });

    return registryPromise;
  }

  function loadManifest(modelKey, options) {
    if (manifestCache[modelKey]) return Promise.resolve(manifestCache[modelKey]);

    return loadRegistry(options).then(function (registry) {
      var entry = registry && registry[modelKey];
      if (!entry) {
        throw new Error('Unknown vehicle model key: ' + modelKey);
      }

      var sourceUrl = new URL(entry.sourceJson, DEFAULT_MODEL_ROOT).href;
      return fetchJson(sourceUrl).then(function (manifest) {
        manifest.__modelKey = modelKey;
        manifest.__registryEntry = entry;
        manifest.__sourceUrl = sourceUrl;
        manifest.__sourceBase = new URL('.', sourceUrl).href;
        manifest.__displayLabel = entry.label || manifest.model || modelKey;
        manifestCache[modelKey] = manifest;
        return manifest;
      });
    });
  }

  function buildPatternUrl(pattern, sourceBase, replacements) {
    var url = pattern || '';
    Object.keys(replacements || {}).forEach(function (key) {
      var value = replacements[key];
      url = url.split('{' + key + '}').join(value);
    });
    return new URL(url, sourceBase).href;
  }

  function getFrameCount(manifest) {
    if (!manifest || !manifest.exterior) return DEFAULT_FRAME_COUNT;
    if (manifest.exterior.frame_count) return parseInt(manifest.exterior.frame_count, 10) || DEFAULT_FRAME_COUNT;
    if (typeof manifest.exterior.frame_start === 'number' && typeof manifest.exterior.frame_end === 'number') {
      return Math.max(1, manifest.exterior.frame_end - manifest.exterior.frame_start + 1);
    }
    return DEFAULT_FRAME_COUNT;
  }

  function getFramePad(manifest) {
    if (!manifest || !manifest.exterior) return 3;
    return parseInt(manifest.exterior.frame_pad || 3, 10) || 3;
  }

  function getFrameStart(manifest) {
    if (!manifest || !manifest.exterior) return 0;
    return parseInt(manifest.exterior.frame_start || 0, 10) || 0;
  }

  function normalizeFrame(manifest, frame) {
    var frameCount = getFrameCount(manifest);
    var frameStart = getFrameStart(manifest);
    var offset = ((frame - frameStart) % frameCount + frameCount) % frameCount;
    return frameStart + offset;
  }

  function resolveExteriorFrameUrl(manifest, frame) {
    if (!manifest || !manifest.exterior) return '';
    var pattern = manifest.exterior.full_res_pattern || 'exterior/full-res/frame-{padded}.jpg';
    var frameCount = getFrameCount(manifest);
    var frameStart = getFrameStart(manifest);
    var framePad = getFramePad(manifest);
    var safeFrame = normalizeFrame(manifest, frame);
    var padded = String(safeFrame).padStart(framePad, '0');

    if (pattern.indexOf('{padded}') === -1 && pattern.indexOf('{frame}') !== -1) {
      pattern = pattern.split('{frame}').join(String(safeFrame));
    } else {
      pattern = pattern.split('{padded}').join(padded);
      pattern = pattern.split('{frame}').join(String(safeFrame - frameStart));
    }

    return buildPatternUrl(pattern, manifest.__sourceBase, { padded: padded, frame: String(safeFrame), index: String(safeFrame - frameStart), count: String(frameCount) });
  }

  function escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function buildPlaceholderInteriorSvg(label, faceKey, faceLabel) {
    var safeLabel = escapeHtml(label || 'Reference cabin');
    var safeFace = escapeHtml(faceLabel || 'Reference cabin');
    var safeView = escapeHtml(faceKey || 'reference');
    var title = isMalay() ? 'PANDANGAN RUJUKAN' : 'REFERENCE INTERIOR';
    var caption = isMalay() ? 'Panorama kabin rujukan' : 'Reference cabin panorama';
    var svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" role="img" aria-label="',
      safeLabel,
      ' reference interior">',
      '<defs>',
      '<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="#f8fbff"/>',
      '<stop offset="56%" stop-color="#edf4ff"/>',
      '<stop offset="100%" stop-color="#dfe8f8"/>',
      '</linearGradient>',
      '<radialGradient id="glow" cx="50%" cy="42%" r="60%">',
      '<stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/>',
      '<stop offset="100%" stop-color="#bcd1ff" stop-opacity="0"/>',
      '</radialGradient>',
      '<linearGradient id="dash" x1="0%" y1="0%" x2="0%" y2="100%">',
      '<stop offset="0%" stop-color="#111827"/>',
      '<stop offset="100%" stop-color="#1d2939"/>',
      '</linearGradient>',
      '<linearGradient id="seat" x1="0%" y1="0%" x2="100%" y2="100%">',
      '<stop offset="0%" stop-color="#111827"/>',
      '<stop offset="100%" stop-color="#334155"/>',
      '</linearGradient>',
      '</defs>',
      '<rect width="1600" height="900" fill="url(#bg)"/>',
      '<ellipse cx="800" cy="540" rx="560" ry="260" fill="rgba(15,23,42,0.10)"/>',
      '<ellipse cx="800" cy="440" rx="420" ry="240" fill="url(#glow)"/>',
      '<path d="M314 606c60-84 140-136 222-136h528c83 0 164 52 224 136l-48 36c-50-67-118-104-176-104H540c-58 0-126 37-176 104z" fill="url(#dash)"/>',
      '<path d="M392 590c31-97 118-171 222-171h372c104 0 191 74 222 171l-44 18c-23-71-86-126-158-126H594c-72 0-135 55-158 126z" fill="#e8eef9" opacity=".58"/>',
      '<path d="M255 612c-28-88-6-182 61-243 42-38 103-58 168-58h632c65 0 126 20 168 58 67 61 89 155 61 243l-56-18c20-63 6-130-38-170-28-26-69-40-115-40H464c-46 0-87 14-115 40-44 40-58 107-38 170z" fill="rgba(15,23,42,0.08)"/>',
      '<g transform="translate(0,8)">',
      '<rect x="430" y="560" width="146" height="188" rx="58" fill="url(#seat)"/>',
      '<rect x="1024" y="560" width="146" height="188" rx="58" fill="url(#seat)"/>',
      '<rect x="690" y="532" width="220" height="224" rx="52" fill="#1f2937"/>',
      '<rect x="716" y="556" width="168" height="68" rx="18" fill="#dbeafe" opacity=".34"/>',
      '<rect x="754" y="649" width="92" height="98" rx="24" fill="#0f172a" opacity=".72"/>',
      '<circle cx="800" cy="620" r="54" fill="none" stroke="#93c5fd" stroke-width="10" opacity=".5"/>',
      '<circle cx="800" cy="620" r="16" fill="#f8fafc" opacity=".75"/>',
      '<rect x="552" y="380" width="495" height="116" rx="58" fill="rgba(15,23,42,0.14)"/>',
      '<rect x="590" y="406" width="420" height="64" rx="32" fill="rgba(255,255,255,0.22)"/>',
      '</g>',
      '<rect x="76" y="70" width="314" height="72" rx="24" fill="#ffffff" opacity=".92"/>',
      '<text x="108" y="116" fill="#2563eb" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" letter-spacing=".12em">',
      title,
      '</text>',
      '<rect x="104" y="726" width="320" height="112" rx="28" fill="rgba(255,255,255,0.7)"/>',
      '<text x="136" y="772" fill="#0f172a" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="800">',
      safeLabel,
      '</text>',
      '<text x="136" y="814" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">',
      caption,
      '</text>',
      '<rect x="1210" y="70" width="314" height="72" rx="24" fill="#ffffff" opacity=".92"/>',
      '<text x="1240" y="116" fill="#2563eb" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800">',
      safeFace,
      '</text>',
      '<text x="1218" y="878" fill="#475569" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="700" letter-spacing=".16em">',
      safeView.toUpperCase(),
      '</text>',
      '</svg>'
    ].join('');
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function getInteriorFaceMap(manifest) {
    var interior = manifest && manifest.interior ? manifest.interior : {};
    var hasRealPattern = !!interior.full_res_pattern;
    var faces = {};
    var order = FACE_ORDER.slice();
    var label = manifest.__displayLabel || manifest.model || 'Reference cabin';
    var sourceFaces = interior.faces || {};
    var faceLabelMap = {
      b: 'Back seat',
      d: 'Floor view',
      f: 'Front cabin',
      l: 'Left side',
      r: 'Right side',
      u: 'Roofline'
    };

    if (Array.isArray(sourceFaces)) {
      order = sourceFaces.slice();
    }

    order.forEach(function (faceKey) {
      var facePath = '';
      if (hasRealPattern) {
        facePath = buildPatternUrl(interior.full_res_pattern, manifest.__sourceBase, { face: faceKey });
      } else if (manifest.placeholders && manifest.placeholders.still && manifest.placeholders.still.full_res) {
        facePath = buildPatternUrl(manifest.placeholders.still.full_res, manifest.__sourceBase, { face: faceKey });
      } else {
        facePath = buildPlaceholderInteriorSvg(label, faceKey, faceLabelMap[faceKey] || 'Reference cabin');
      }

      faces[faceKey] = {
        src: facePath,
        alt: hasRealPattern
          ? label + ' interior ' + (faceLabelMap[faceKey] || 'view')
          : label + ' reference interior ' + (faceLabelMap[faceKey] || 'view'),
        real: hasRealPattern
      };
    });

    return {
      faces: faces,
      real: hasRealPattern
    };
  }

  function setTextKey(statusEl, key) {
    if (!statusEl) return;
    statusEl.setAttribute('data-key', key);
  }

  function makeButtonList(root, selector) {
    var isModelSelector = selector.indexOf('model') !== -1;
    return safeAll(root, selector).filter(function (button) {
      if (!button) return false;
      return isModelSelector
        ? !!(button.getAttribute('data-vehicle-model') || button.getAttribute('data-hiw-model'))
        : !!(button.getAttribute('data-vehicle-view') || button.getAttribute('data-hiw-view'));
    });
  }

  function findControlsScope(root, opts) {
    var selector = root.getAttribute('data-vehicle-controls') || (opts && opts.controlsSelector);
    var scoped;

    if (selector) {
      scoped = document.querySelector(selector);
      if (scoped) return scoped;
    }

    scoped = root.closest('[data-vehicle-viewer-shell]');
    if (scoped) return scoped;

    return root;
  }

  function init(root, options) {
    if (!root || instanceMap.has(root)) return instanceMap.get(root) || null;

    var opts = options || {};
    var controlsScope = findControlsScope(root, opts);
    var state = {
      root: root,
      controlsScope: controlsScope,
      options: opts,
      modelKey: root.getAttribute('data-vehicle-default-model') || opts.defaultModel || 'bmw',
      viewMode: root.getAttribute('data-vehicle-default-view') || opts.defaultView || 'exterior',
      currentFrame: 0,
      lastExteriorFrame: 0,
      isReady: false,
      isDragging: false,
      isAnimating: false,
      manifest: null,
      currentManifestPromise: null,
      pendingFrame: null,
      exteriorImage: safeGet(root, '[data-vehicle-exterior-frame], #hiwInteractiveFrame'),
      interiorScene: safeGet(root, '[data-vehicle-interior-scene], #hiwInteriorScene'),
      interiorCube: safeGet(root, '[data-vehicle-interior-cube], #hiwInteriorCube'),
      interiorFaces: safeAll(root, '[data-vehicle-interior-face], [data-hiw-interior-face]'),
      interiorCanvas: null,
      interiorRenderer: null,
      interiorScene3D: null,
      interiorCamera: null,
      interiorTexture: null,
      interiorTextureSignature: '',
      interiorRendererPromise: null,
      webglInteriorReady: false,
      webglInteriorFailed: false,
      label: safeGet(root, '[data-vehicle-label], [data-hiw-model-label]'),
      status: safeGet(root, '[data-vehicle-status], [data-hiw-view-status]'),
      modelButtons: makeButtonList(controlsScope, '[data-vehicle-model], [data-hiw-model]'),
      viewButtons: makeButtonList(controlsScope, '[data-vehicle-view], [data-hiw-view]'),
      interiorYaw: 24,
      interiorPitch: -8,
      targetYaw: 24,
      targetPitch: -8,
      interiorZoom: 0.98,
      targetZoom: 0.98,
      yawVelocity: 0,
      pitchVelocity: 0,
      lastInteriorMoveAt: 0,
      interiorRaf: 0,
      dragStartX: 0,
      dragStartY: 0,
      lastPointerX: 0,
      lastPointerY: 0,
      dragStartFrame: 0,
      dragStartYaw: 0,
      dragStartPitch: 0,
      registryUrl: root.getAttribute('data-vehicle-registry') || opts.registryUrl || DEFAULT_REGISTRY_URL,
      modelRoot: root.getAttribute('data-vehicle-model-root') || opts.modelRoot || DEFAULT_MODEL_ROOT
    };

    // Create Ambilight backdrop image element dynamically if not present
    if (state.exteriorImage && !root.querySelector('.vehicle-viewer-ambilight')) {
      var ambilight = document.createElement('img');
      ambilight.className = 'vehicle-viewer-ambilight';
      ambilight.src = state.exteriorImage.getAttribute('src') || '';
      ambilight.setAttribute('aria-hidden', 'true');
      ambilight.setAttribute('draggable', 'false');
      state.exteriorImage.parentNode.insertBefore(ambilight, state.exteriorImage);
      state.ambilightImage = ambilight;
    } else {
      state.ambilightImage = root.querySelector('.vehicle-viewer-ambilight') || null;
    }

    function syncRootState() {
      root.classList.toggle('is-interior', state.viewMode === 'interior');
      root.classList.toggle('is-reference-interior', state.viewMode === 'interior' && state.manifest && !(state.manifest.interior && state.manifest.interior.full_res_pattern));
      root.classList.toggle('has-webgl-interior', !!state.interiorRenderer);
      root.classList.toggle('is-webgl-interior-ready', !!state.webglInteriorReady);
      root.classList.toggle('is-webgl-interior-failed', !!state.webglInteriorFailed);
    }

    function updateButtons() {
      state.modelButtons.forEach(function (button) {
        var isActive = button.getAttribute('data-vehicle-model') === state.modelKey || button.getAttribute('data-hiw-model') === state.modelKey;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      state.viewButtons.forEach(function (button) {
        var nextView = button.getAttribute('data-vehicle-view') || button.getAttribute('data-hiw-view');
        var isActive = nextView === state.viewMode;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    function updateStatus() {
      if (!state.status) return;
      if (state.viewMode === 'exterior') {
        setTextKey(state.status, 'how_new_view_status_exterior');
      } else if (state.manifest && state.manifest.interior && state.manifest.interior.full_res_pattern) {
        setTextKey(state.status, 'how_new_view_status_real');
      } else {
        setTextKey(state.status, 'how_new_view_status_reference');
      }

      dispatchLanguageApplied();
    }

    function renderLabel() {
      if (!state.label || !state.manifest) return;
      state.label.textContent = state.manifest.__displayLabel || state.manifest.model || state.modelKey;
    }

    function frameUrlForState(frame) {
      if (!state.manifest) return '';
      return resolveExteriorFrameUrl(state.manifest, frame);
    }

    function renderExteriorFrame(frame, force) {
      if (!state.exteriorImage || !state.manifest) return;
      var safeFrame = normalizeFrame(state.manifest, frame);
      if (!force && state.currentFrame === safeFrame && state.viewMode === 'exterior' && state.exteriorImage.src) return;
      state.currentFrame = safeFrame;
      state.lastExteriorFrame = safeFrame;
      state.exteriorImage.src = frameUrlForState(safeFrame);
      state.exteriorImage.alt = (state.manifest.__displayLabel || state.manifest.model || state.modelKey) + ' exterior 360 view';
      if (state.ambilightImage) {
        state.ambilightImage.src = state.exteriorImage.src;
      }
    }

    function applyInteriorFaces() {
      if (!state.interiorScene || !state.interiorCube || !state.manifest) return;

      var interior = getInteriorFaceMap(state.manifest);
      var size;
      var face;

      state.interiorFaces.forEach(function (node) {
        var faceKey = node.getAttribute('data-vehicle-interior-face') || node.getAttribute('data-hiw-interior-face');
        if (!faceKey) return;
        face = interior.faces[faceKey];
        if (!face) return;
        node.src = face.src;
        node.alt = face.alt;
      });

      size = Math.max(state.root.clientWidth || 0, state.root.clientHeight || 0);
      size = Math.max(1200, Math.min(size * 2.08, 1680));
      state.interiorCube.style.setProperty('--vehicle-cube-size', size + 'px');
      state.interiorCube.style.width = size + 'px';
      state.interiorCube.style.height = size + 'px';
      state.interiorScene.style.perspective = Math.max(1800, Math.round(size * 1.35)) + 'px';
    }

    function resizeInteriorRenderer() {
      if (!state.interiorRenderer || !state.interiorCamera || !state.interiorScene) return;

      var width = state.interiorScene.clientWidth || state.root.clientWidth || 0;
      var height = state.interiorScene.clientHeight || state.root.clientHeight || 0;
      if (!width || !height) return;

      state.interiorCamera.aspect = width / height;
      state.interiorCamera.updateProjectionMatrix();
      state.interiorRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      state.interiorRenderer.setSize(width, height, false);
    }

    function ensureInteriorTexture() {
      if (!state.THREE || !state.manifest || !state.interiorScene3D) return Promise.resolve(null);

      var interior = getInteriorFaceMap(state.manifest);
      var urls = ['r', 'l', 'u', 'd', 'f', 'b'].map(function (faceKey) {
        return interior.faces[faceKey]
          ? interior.faces[faceKey].src
          : buildPlaceholderInteriorSvg(state.manifest.__displayLabel || state.manifest.model || state.modelKey, faceKey, faceKey);
      });
      var signature = urls.join('|');
      if (state.interiorTexture && state.interiorTextureSignature === signature) {
        state.interiorScene3D.background = state.interiorTexture;
        state.interiorScene3D.environment = state.interiorTexture;
        state.webglInteriorReady = true;
        syncRootState();
        return Promise.resolve(state.interiorTexture);
      }

      return loadCubeTexture(state.THREE, urls).then(function (texture) {
        if (state.interiorTexture && state.interiorTexture.dispose) {
          state.interiorTexture.dispose();
        }
        state.interiorTexture = texture;
        state.interiorTextureSignature = signature;
        state.interiorScene3D.background = texture;
        state.interiorScene3D.environment = texture;
        state.webglInteriorReady = true;
        syncRootState();
        return texture;
      }).catch(function () {
        state.webglInteriorReady = false;
        state.interiorTextureSignature = '';
        syncRootState();
        return null;
      });
    }

    function ensureInteriorRenderer() {
      if (state.webglInteriorFailed) return Promise.resolve(null);
      if (state.interiorRendererPromise) return state.interiorRendererPromise;
      if (state.interiorRenderer && state.interiorScene3D && state.interiorCamera) {
        return Promise.resolve(state.interiorRenderer);
      }

      state.interiorRendererPromise = loadThreeLibrary().then(function (THREE) {
        state.THREE = THREE;

        if (!state.interiorCanvas) {
          state.interiorCanvas = document.createElement('canvas');
          state.interiorCanvas.className = 'vehicle-viewer-webgl';
          state.interiorCanvas.setAttribute('aria-hidden', 'true');
          state.interiorCanvas.style.position = 'absolute';
          state.interiorCanvas.style.inset = '0';
          state.interiorCanvas.style.width = '100%';
          state.interiorCanvas.style.height = '100%';
          state.interiorCanvas.style.pointerEvents = 'none';
          state.interiorCanvas.style.opacity = '0';
          state.interiorCanvas.style.transition = 'opacity 220ms ease';
          state.interiorCanvas.style.zIndex = '2';
          state.interiorScene.appendChild(state.interiorCanvas);
        }

        if (!state.interiorScene3D) {
          state.interiorScene3D = new THREE.Scene();
        }

        if (!state.interiorCamera) {
          state.interiorCamera = new THREE.PerspectiveCamera(70, 1, 0.1, 1200);
          state.interiorCamera.rotation.order = 'YXZ';
          state.interiorCamera.position.set(0, 0, 0);
        }

        if (!state.interiorRenderer) {
          state.interiorRenderer = new THREE.WebGLRenderer({
            canvas: state.interiorCanvas,
            alpha: true,
            antialias: true
          });
          state.interiorRenderer.setClearColor(0x000000, 0);
        }

        resizeInteriorRenderer();
        state.root.classList.add('has-webgl-interior');

        return ensureInteriorTexture().then(function (texture) {
          resizeInteriorRenderer();
          state.interiorCanvas.style.opacity = texture ? '1' : '0';
          syncRootState();
          return state.interiorRenderer;
        });
      }).catch(function () {
        state.webglInteriorFailed = true;
        syncRootState();
        return null;
      }).then(function (renderer) {
        state.interiorRendererPromise = null;
        return renderer;
      });

      return state.interiorRendererPromise;
    }

    function renderInteriorScene() {
      if (!state.interiorRenderer || !state.interiorCamera || !state.interiorScene3D) return;
      state.interiorCamera.rotation.order = 'YXZ';
      state.interiorCamera.rotation.y = state.interiorYaw * Math.PI / 180;
      state.interiorCamera.rotation.x = state.interiorPitch * Math.PI / 180;
      state.interiorCamera.rotation.z = 0;
      state.interiorCamera.zoom = state.interiorZoom;
      state.interiorCamera.updateProjectionMatrix();
      state.interiorRenderer.render(state.interiorScene3D, state.interiorCamera);
    }

    function renderInteriorCube() {
      if (state.interiorRenderer) {
        renderInteriorScene();
        return;
      }
      if (!state.interiorCube) return;
      state.interiorCube.style.transform = 'rotateX(' + state.interiorPitch.toFixed(2) + 'deg) rotateY(' + state.interiorYaw.toFixed(2) + 'deg) scale(' + state.interiorZoom.toFixed(3) + ')';
    }

    function stopInteriorAnimation() {
      if (state.interiorRaf) {
        window.cancelAnimationFrame(state.interiorRaf);
        state.interiorRaf = 0;
      }
    }

    function tickInterior() {
      if (state.viewMode !== 'interior') {
        state.interiorRaf = 0;
        return;
      }

      var now = window.performance && performance.now ? performance.now() : Date.now();
      var yawDiff = state.targetYaw - state.interiorYaw;
      var pitchDiff = state.targetPitch - state.interiorPitch;
      var zoomDiff = state.targetZoom - state.interiorZoom;

      if (!state.isDragging) {
        if (Math.abs(state.yawVelocity) > 0.002 || Math.abs(state.pitchVelocity) > 0.002) {
          state.targetYaw += state.yawVelocity;
          state.targetPitch = Math.min(24, Math.max(-34, state.targetPitch + state.pitchVelocity));
          state.yawVelocity *= 0.92;
          state.pitchVelocity *= 0.92;
          state.lastInteriorMoveAt = now;
        } else if (now - state.lastInteriorMoveAt > 900) {
          state.targetYaw += 0.045;
        }
      }

      state.interiorYaw += yawDiff * 0.12;
      state.interiorPitch += pitchDiff * 0.12;
      state.interiorZoom += zoomDiff * 0.14;
      renderInteriorCube();

      if (Math.abs(yawDiff) > 0.03 || Math.abs(pitchDiff) > 0.03 || Math.abs(zoomDiff) > 0.01 || state.viewMode === 'interior') {
        state.interiorRaf = window.requestAnimationFrame(tickInterior);
        return;
      }

      state.interiorYaw = state.targetYaw;
      state.interiorPitch = state.targetPitch;
      state.interiorZoom = state.targetZoom;
      renderInteriorCube();
      state.interiorRaf = 0;
    }

    function queueInteriorAnimation() {
      if (state.viewMode !== 'interior' || state.interiorRaf) return;
      state.interiorRaf = window.requestAnimationFrame(tickInterior);
    }

    function scheduleInteriorRefresh() {
      if (state.viewMode !== 'interior' || !state.manifest) return;

      if (state.webglInteriorFailed) {
        applyInteriorFaces();
        queueInteriorAnimation();
        return;
      }

      ensureInteriorRenderer().then(function () {
        if (state.viewMode !== 'interior') return;
        resizeInteriorRenderer();
        return ensureInteriorTexture().then(function () {
          if (state.viewMode !== 'interior') return;
          resizeInteriorRenderer();
          renderInteriorScene();
          queueInteriorAnimation();
        });
      }).catch(function () {
        state.webglInteriorFailed = true;
        applyInteriorFaces();
        queueInteriorAnimation();
      });
    }

    function updateViewUI() {
      syncRootState();
      updateButtons();
      updateStatus();
      if (state.viewMode === 'interior') {
        applyInteriorFaces();
        scheduleInteriorRefresh();
        return;
      }
      stopInteriorAnimation();
      renderExteriorFrame(state.lastExteriorFrame, true);
    }

    function loadModel(nextKey) {
      state.currentManifestPromise = loadManifest(nextKey, state.options);
      return state.currentManifestPromise.then(function (manifest) {
        state.manifest = manifest;
        renderLabel();
        if (state.viewMode === 'interior') {
          applyInteriorFaces();
          updateStatus();
          scheduleInteriorRefresh();
        }
        return manifest;
      });
    }

    function setView(nextView) {
      if (!nextView || nextView === state.viewMode) return api;
      state.viewMode = nextView;
      updateViewUI();
      return api;
    }

    function setModel(nextKey) {
      if (!nextKey || nextKey === state.modelKey || state.isAnimating) return api;
      state.isAnimating = true;

      loadManifest(nextKey, state.options).then(function (manifest) {
        var startFrame = normalizeFrame(state.manifest || manifest, state.lastExteriorFrame);
        var duration = 720;
        var startTime = null;
        var previousManifest = state.manifest || manifest;

        function finishSwitch() {
          state.modelKey = nextKey;
          state.manifest = manifest;
          renderLabel();
          updateButtons();
          updateStatus();
          if (state.viewMode === 'interior') {
            applyInteriorFaces();
            scheduleInteriorRefresh();
          } else {
            renderExteriorFrame(startFrame, true);
          }
          state.isAnimating = false;
          syncRootState();
        }

        if (state.viewMode === 'interior') {
          state.modelKey = nextKey;
          state.manifest = manifest;
          renderLabel();
          updateButtons();
          updateStatus();
          applyInteriorFaces();
          scheduleInteriorRefresh();
          state.isAnimating = false;
          syncRootState();
          return;
        }

        function spin(time) {
          var frame;
          var progress;
          var ease;

          if (!startTime) startTime = time;
          progress = Math.min(1, (time - startTime) / duration);
          ease = 1 - Math.pow(1 - progress, 3);
          frame = startFrame + Math.floor(ease * getFrameCount(previousManifest) * 2);
          state.currentFrame = normalizeFrame(previousManifest, frame);
          state.lastExteriorFrame = state.currentFrame;
          if (state.exteriorImage) {
            state.exteriorImage.src = resolveExteriorFrameUrl(previousManifest, frame);
            state.exteriorImage.alt = (previousManifest.__displayLabel || previousManifest.model || nextKey) + ' exterior 360 view';
            if (state.ambilightImage) {
              state.ambilightImage.src = state.exteriorImage.src;
            }
          }

          if (progress < 1) {
            window.requestAnimationFrame(spin);
            return;
          }

          if (state.exteriorImage) {
            state.exteriorImage.classList.add('is-switching');
          }

          window.setTimeout(function () {
            finishSwitch();
            if (state.exteriorImage) {
              state.exteriorImage.classList.remove('is-switching');
            }
          }, 170);
        }

        window.requestAnimationFrame(spin);
      }).catch(function () {
        state.isAnimating = false;
      });

      return api;
    }

    function setExteriorFrame(frame, force) {
      if (!state.manifest) {
        state.pendingFrame = frame;
        state.lastExteriorFrame = frame;
        return api;
      }

      state.lastExteriorFrame = normalizeFrame(state.manifest, frame);
      if (state.viewMode === 'exterior' && !state.isDragging) {
        renderExteriorFrame(state.lastExteriorFrame, !!force);
      }
      return api;
    }

    function getExteriorFrame() {
      return state.lastExteriorFrame;
    }

    function pointerDown(event) {
      if (state.isAnimating) return;
      if (event && event.target && event.target.closest && event.target.closest('button, a, input, select, textarea, [role="button"], [data-vehicle-model], [data-vehicle-view], [data-hiw-model], [data-hiw-view], .hiw-btn, .hiw-model-btn, .hiw-view-btn')) {
        return;
      }
      state.isDragging = true;
      state.dragStartX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
      state.dragStartY = event.clientY || (event.touches && event.touches[0].clientY) || 0;
      state.lastPointerX = state.dragStartX;
      state.lastPointerY = state.dragStartY;
      state.dragStartFrame = state.lastExteriorFrame;
      state.dragStartYaw = state.interiorYaw;
      state.dragStartPitch = state.interiorPitch;
      state.lastInteriorMoveAt = window.performance && performance.now ? performance.now() : Date.now();
      root.classList.add('is-dragging');

      if (state.viewMode === 'exterior') {
        renderExteriorFrame(state.lastExteriorFrame, true);
      }

      if (root.setPointerCapture && event.pointerId !== undefined) {
        try { root.setPointerCapture(event.pointerId); } catch (error) {}
      }

      event.preventDefault();
    }

    function pointerMove(event) {
      if (!state.isDragging || state.isAnimating) return;

      var clientX = event.clientX || (event.touches && event.touches[0].clientX) || state.dragStartX;
      var clientY = event.clientY || (event.touches && event.touches[0].clientY) || state.dragStartY;
      var deltaX = clientX - state.dragStartX;
      var deltaY = clientY - state.dragStartY;
      var movementX = clientX - state.lastPointerX;
      var movementY = clientY - state.lastPointerY;

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

      if (state.viewMode === 'exterior') {
        state.lastExteriorFrame = normalizeFrame(state.manifest, state.dragStartFrame - Math.round(deltaX / 5));
        renderExteriorFrame(state.lastExteriorFrame, true);
      } else {
        state.targetYaw = state.dragStartYaw + deltaX * 0.32;
        state.targetPitch = Math.min(24, Math.max(-34, state.dragStartPitch - deltaY * 0.14));
        state.interiorYaw = state.targetYaw;
        state.interiorPitch = state.targetPitch;
        state.yawVelocity = movementX * 0.018;
        state.pitchVelocity = -movementY * 0.01;
        state.lastInteriorMoveAt = window.performance && performance.now ? performance.now() : Date.now();
        renderInteriorCube();
      }

      state.lastPointerX = clientX;
      state.lastPointerY = clientY;
      event.preventDefault();
    }

    function pointerUp(event) {
      if (!state.isDragging) return;
      state.isDragging = false;
      root.classList.remove('is-dragging');

      if (root.releasePointerCapture && event && event.pointerId !== undefined) {
        try { root.releasePointerCapture(event.pointerId); } catch (error) {}
      }
    }

    function bind() {
      state.modelButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          var nextKey = button.getAttribute('data-vehicle-model') || button.getAttribute('data-hiw-model');
          setModel(nextKey);
        });
      });

      state.viewButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          var nextView = button.getAttribute('data-vehicle-view') || button.getAttribute('data-hiw-view');
          setView(nextView);
        });
      });

      root.addEventListener('pointerdown', pointerDown);
      root.addEventListener('pointermove', pointerMove);
      root.addEventListener('pointerup', pointerUp);
      root.addEventListener('pointercancel', pointerUp);
      root.addEventListener('mouseleave', pointerUp);
      root.addEventListener('touchstart', pointerDown, { passive: false });
      root.addEventListener('touchmove', pointerMove, { passive: false });
      root.addEventListener('touchend', pointerUp);
      root.addEventListener('wheel', function (event) {
        if (state.viewMode !== 'interior') return;
        event.preventDefault();
        state.targetZoom = Math.min(1.08, Math.max(0.86, state.targetZoom - (event.deltaY || 0) * 0.00045));
        state.lastInteriorMoveAt = window.performance && performance.now ? performance.now() : Date.now();
        queueInteriorAnimation();
      }, { passive: false });
      window.addEventListener('resize', function () {
        if (!state.manifest) return;
        if (state.viewMode === 'interior') {
          applyInteriorFaces();
          resizeInteriorRenderer();
          renderInteriorCube();
        }
      });
    }

    var api = {
      root: root,
      getModelKey: function () { return state.modelKey; },
      getViewMode: function () { return state.viewMode; },
      getExteriorFrame: getExteriorFrame,
      setExteriorFrame: setExteriorFrame,
      setModel: setModel,
      setView: setView,
      loadModel: loadModel,
      getManifest: function () { return state.manifest; },
      refresh: function () {
        updateViewUI();
        return api;
      }
    };

    instanceMap.set(root, api);
    instanceList.push(api);
    bind();

    loadModel(state.modelKey).then(function () {
      state.isReady = true;
      updateViewUI();
      if (state.pendingFrame !== null) {
        setExteriorFrame(state.pendingFrame, true);
        state.pendingFrame = null;
      }
      if (state.viewMode === 'interior') {
        queueInteriorAnimation();
      }
    }).catch(function () {
      state.isReady = true;
      updateButtons();
      updateStatus();
    });

    return api;
  }

  function initAll(options) {
    safeAll(document, '[data-vehicle-viewer]').forEach(function (root) {
      init(root, options || {});
    });
    return instanceList.slice();
  }

  function get(rootOrSelector) {
    if (!rootOrSelector) return null;
    if (typeof rootOrSelector === 'string') {
      return instanceMap.get(document.querySelector(rootOrSelector)) || null;
    }
    return instanceMap.get(rootOrSelector) || null;
  }

  function getAll() {
    return instanceList.slice();
  }

  function resolveFrameUrl(modelKey, frame) {
    var manifest = manifestCache[modelKey];
    if (!manifest) return '';
    return resolveExteriorFrameUrl(manifest, frame);
  }

  function resolveInteriorFaceUrl(modelKey, faceKey) {
    var manifest = manifestCache[modelKey];
    if (!manifest) return '';
    var interior = getInteriorFaceMap(manifest);
    return interior.faces[faceKey] ? interior.faces[faceKey].src : '';
  }

  function bootstrap() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        initAll();
      }, { once: true });
    } else {
      initAll();
    }
  }

  window.WedriveVehicleViewer = {
    init: init,
    initAll: initAll,
    get: get,
    getAll: getAll,
    resolveFrameUrl: resolveFrameUrl,
    resolveInteriorFaceUrl: resolveInteriorFaceUrl
  };

  bootstrap();
})(window, document);
