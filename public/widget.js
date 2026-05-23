/**
 * VYVRE Widget Loader (v1.0)
 *
 * Embed code that brands paste on their site :
 *   <script src="https://vyvre.fr/widget.js"></script>
 *   <div id="vyvre-widget" data-key="vyv_pk_xxxxxxxxxxxxxxxx"></div>
 *
 * What this script does :
 * 1. Finds the <div id="vyvre-widget"> placeholder
 * 2. Reads data-key (the brand's API key)
 * 3. Injects an iframe pointing to https://vyvre.fr/widget/embed?key=xxx
 * 4. Auto-resizes the iframe to fit content
 *
 * Why iframe : CSS isolation (no leak from brand's site), security (camera
 * permissions scoped to vyvre.fr origin), simple update path (we change the
 * widget UI without brands re-pasting code).
 */

(function () {
  'use strict';

  if (window.__VYVRE_WIDGET_LOADED__) return;
  window.__VYVRE_WIDGET_LOADED__ = true;

  var EMBED_BASE = 'https://vyvre.fr/widget/embed';
  var WIDGET_VERSION = '1.0.0';

  function init() {
    var container = document.getElementById('vyvre-widget');
    if (!container) {
      console.warn('[VYVRE] <div id="vyvre-widget"> not found — widget cannot mount');
      return;
    }

    var apiKey = container.getAttribute('data-key');
    if (!apiKey) {
      container.innerHTML = '<div style="padding:24px;border:1px solid #e07060;color:#e07060;font-family:sans-serif">VYVRE widget : missing <code>data-key</code> attribute.</div>';
      return;
    }

    if (!/^vyv_pk_[a-f0-9]{32}$/.test(apiKey)) {
      console.warn('[VYVRE] data-key format invalid:', apiKey);
    }

    // Read optional configuration via data-* attributes
    var brand = container.getAttribute('data-brand') || '';
    var theme = container.getAttribute('data-theme') || 'auto';   // 'auto' | 'light' | 'dark'
    var locale = container.getAttribute('data-locale') || (navigator.language || 'fr').slice(0, 2);
    var height = container.getAttribute('data-height') || '720';  // px

    // Build iframe URL
    var qs = new URLSearchParams({
      key: apiKey,
      brand: brand,
      theme: theme,
      locale: locale,
      v: WIDGET_VERSION,
      host: window.location.host
    });
    var iframeUrl = EMBED_BASE + '?' + qs.toString();

    // Create iframe
    var iframe = document.createElement('iframe');
    iframe.src = iframeUrl;
    iframe.id = 'vyvre-widget-frame';
    iframe.title = 'VYVRE diagnostic peau';
    iframe.allow = 'camera; microphone; autoplay; fullscreen';
    iframe.style.cssText = [
      'width: 100%',
      'border: 0',
      'background: transparent',
      'min-height: ' + parseInt(height, 10) + 'px',
      'height: ' + parseInt(height, 10) + 'px',
      'display: block',
      'border-radius: 12px',
      'overflow: hidden'
    ].join(';');

    // Loading skeleton
    container.innerHTML = '';
    container.style.cssText = 'position:relative;width:100%;min-height:' + parseInt(height, 10) + 'px';
    var skeleton = document.createElement('div');
    skeleton.style.cssText = [
      'position:absolute',
      'inset:0',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'background:linear-gradient(180deg,#0A0A0A,#1A1A18)',
      'color:rgba(244,241,234,0.7)',
      'font-family:-apple-system,Segoe UI,sans-serif',
      'font-size:13px',
      'letter-spacing:0.15em',
      'text-transform:uppercase',
      'border-radius:12px'
    ].join(';');
    skeleton.textContent = 'Chargement VYVRE…';
    container.appendChild(skeleton);
    container.appendChild(iframe);

    iframe.addEventListener('load', function () {
      skeleton.style.transition = 'opacity 0.4s';
      skeleton.style.opacity = '0';
      setTimeout(function () { skeleton.remove(); }, 400);
    });

    // Listen for resize messages from the iframe
    window.addEventListener('message', function (event) {
      if (event.source !== iframe.contentWindow) return;
      var data = event.data || {};
      if (data.type === 'vyvre:resize' && typeof data.height === 'number') {
        var h = Math.max(360, Math.min(4000, data.height));
        iframe.style.height = h + 'px';
        container.style.minHeight = h + 'px';
      } else if (data.type === 'vyvre:event' && data.event) {
        // Bubble custom events for the host site to listen to
        // e.g. window.addEventListener('vyvre:scan-complete', e => console.log(e.detail))
        try {
          window.dispatchEvent(new CustomEvent('vyvre:' + data.event, { detail: data.detail }));
        } catch (e) {}
      }
    }, false);

    console.log('[VYVRE] widget v' + WIDGET_VERSION + ' loaded · key=' + apiKey.slice(0, 12) + '…');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
