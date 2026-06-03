/**
 * VYVRE Loader v10.0.0 — Lazy TensorFlow.js + perf bootstrap
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * Avant v10 : POCs chargeaient @tensorflow/tfjs (~1MB gzip) au load page, même
 * pour les visiteurs qui ne scannent jamais. Coût : ~500ms first paint, ~2MB
 * data sur mobile 4G.
 *
 * v10 : on charge TF.js APRES la première interaction utilisateur (clic scan,
 * upload photo, ou interaction caméra). Le moteur (vyvre-scan-engine.js) reste
 * inchangé — il tolère window.tf absent au boot et retombe sur l'algo v7.7
 * (MAE 13.15y UTKFace) ; quand TF.js arrive plus tard, son `loadCNN()` lazy
 * va le détecter automatiquement à la prochaine prédiction.
 *
 * API publique :
 *   window.vyvreEnsureTF()      → Promise<true>, idempotent
 *   window.VYVRE_LOADER.preload() → alias
 *   window.VYVRE_LOADER.isLoaded() → bool
 *   window.VYVRE_LOADER.warmupCNN() → triggers engine.preloadCNN() once TF is in
 *
 * Heuristic : on auto-trigger ensureTF() au premier `click`, `touchstart`,
 * `pointerdown` ou si l'utilisateur démarre une caméra (getUserMedia hook).
 * On peut aussi pré-fetcher dès que le navigateur est idle (requestIdleCallback).
 *
 * v10 mission : -1MB initial load, -300ms first paint.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  const TF_CDN_URL = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js';
  let __tfPromise = null;
  let __tfLoaded = false;
  let __tfStartedAt = null;

  function ensureTF() {
    if (__tfLoaded || (typeof window.tf !== 'undefined')) {
      __tfLoaded = true;
      return Promise.resolve(true);
    }
    if (__tfPromise) return __tfPromise;

    __tfStartedAt = performance.now();
    console.log('[vyvre-loader] lazy-loading TensorFlow.js from CDN...');

    __tfPromise = new Promise((resolve, reject) => {
      // If a <script> tag for tfjs already exists (e.g. defer leftover), reuse it
      const existing = document.querySelector('script[src*="@tensorflow/tfjs"]');
      if (existing && existing.dataset.vyvreLoaded === '1') {
        __tfLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = TF_CDN_URL;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.vyvreLoader = '1';

      const cleanup = () => {
        script.onload = null;
        script.onerror = null;
      };

      script.onload = () => {
        cleanup();
        __tfLoaded = true;
        const dt = (performance.now() - __tfStartedAt).toFixed(0);
        script.dataset.vyvreLoaded = '1';
        console.log('[vyvre-loader] TensorFlow.js loaded in ' + dt + 'ms');
        // Reset engine's CNN disabled flag if it had given up early
        // (engine sets __cnnDisabled = true if window.tf absent at first loadCNN call ;
        // we can't reset internal state without touching the engine, but the engine's
        // initial check only sets it during loadCNN() — and loadCNN() is only called
        // from autoBootstrap's warm-up IF window.tf was already defined. So if we
        // arrive here it means TF was absent at boot, warm-up was skipped, and
        // __cnnDisabled is still false. Next runRealScan() will pick up CNN cleanly.)
        // Optionally also warm up the model now.
        if (window.VYVRE_SCAN_ENGINE && typeof window.VYVRE_SCAN_ENGINE.preloadCNN === 'function') {
          window.VYVRE_SCAN_ENGINE.preloadCNN().catch(() => {});
        }
        window.dispatchEvent(new CustomEvent('vyvre:tf-loaded', { detail: { durationMs: parseInt(dt) } }));
        resolve(true);
      };
      script.onerror = (e) => {
        cleanup();
        console.warn('[vyvre-loader] TensorFlow.js load failed — engine will fall back to algo-only mode');
        __tfPromise = null; // allow retry
        // Don't reject — the engine works fine without TF
        resolve(false);
      };

      (document.head || document.documentElement).appendChild(script);
    });

    return __tfPromise;
  }

  function isLoaded() { return __tfLoaded || typeof window.tf !== 'undefined'; }

  function warmupCNN() {
    return ensureTF().then(() => {
      if (window.VYVRE_SCAN_ENGINE && window.VYVRE_SCAN_ENGINE.preloadCNN) {
        return window.VYVRE_SCAN_ENGINE.preloadCNN();
      }
      return null;
    });
  }

  // ─── Auto-trigger heuristic ──────────────────────────────────────────
  // Load TF.js on first user gesture (or after 8s idle), whichever first.
  function setupAutoTrigger() {
    let triggered = false;
    const fire = (reason) => {
      if (triggered) return;
      triggered = true;
      console.log('[vyvre-loader] auto-trigger:', reason);
      ensureTF();
    };

    // (a) First user gesture on scan-related buttons
    const scanSelector = '[id*="scan" i], [id*="btn-scan" i], [class*="scan-btn" i], [data-vyvre-scan-trigger], button[id="btn-scan"], button[id="btn-upload"]';
    const onScanClick = (e) => {
      const target = e.target.closest(scanSelector);
      if (target) fire('scan-button-click');
    };
    document.addEventListener('click', onScanClick, true);
    document.addEventListener('touchstart', onScanClick, true);

    // (b) Camera access — hook getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const originalGUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function (constraints) {
        if (constraints && constraints.video) fire('getUserMedia(video)');
        return originalGUM(constraints);
      };
    }

    // (c) File input change (upload photo flow)
    document.addEventListener('change', (e) => {
      if (e.target && e.target.type === 'file' &&
          e.target.accept && /image/i.test(e.target.accept)) {
        fire('file-input-image');
      }
    }, true);

    // (d) Idle fallback : if user has been on the page 8s without scanning,
    // preload TF.js in background so the eventual click is instant. This is
    // a UX win — but only if the connection looks healthy.
    const isSaveData = navigator.connection && navigator.connection.saveData;
    const slowConn = navigator.connection && /^(slow-2g|2g|3g)$/.test(navigator.connection.effectiveType || '');
    if (!isSaveData && !slowConn) {
      const idleFire = () => {
        if (!triggered) fire('idle-warmup');
      };
      if ('requestIdleCallback' in window) {
        setTimeout(() => requestIdleCallback(idleFire, { timeout: 12000 }), 8000);
      } else {
        setTimeout(idleFire, 8000);
      }
    }
  }

  // ─── Service Worker registration (PWA support) ───────────────────────
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') return;
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' })
        .then(reg => {
          console.log('[vyvre-loader] service worker registered, scope:', reg.scope);
        })
        .catch(err => {
          console.warn('[vyvre-loader] service worker registration failed:', err.message);
        });
    });
  }

  // ─── Public API ──────────────────────────────────────────────────────
  window.vyvreEnsureTF = ensureTF;
  window.VYVRE_LOADER = {
    version: 'v10.0.0',
    ensureTF,
    preload: ensureTF,
    isLoaded,
    warmupCNN,
    _ready: true
  };

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupAutoTrigger();
      registerServiceWorker();
    });
  } else {
    setupAutoTrigger();
    registerServiceWorker();
  }

  console.log('[vyvre-loader v10.0.0] ready — TF.js will load on first scan gesture');
})();
