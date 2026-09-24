var VYVRE_LOG=(typeof window!=="undefined"&&window.VYVRE_DEBUG)?console.log.bind(console):function(){};
/**
 * VYVRE Tracker v10.0.0 — Longitudinal scan history (no-auth, localStorage)
 * ═══════════════════════════════════════════════════════════════════════════════════════════
 *
 * Goal: persistent skin history so users can re-scan over time and visualise
 * progress. Strictly client-side — privacy-respecting, no backend required.
 *
 * Storage key: vyvre_scan_history
 * Format: { version, scans: [ { scanId, timestamp, brand, scores, clinical?, photoCropped? } ] }
 *
 * API exposed on window:
 *   VYVRE_TRACKER.save(scanResult, opts)           — persist a scan, returns ScanEntry
 *   VYVRE_TRACKER.list()                            — array of entries (oldest → newest)
 *   VYVRE_TRACKER.last(n=10)                        — last N entries
 *   VYVRE_TRACKER.clear()                           — wipe history (returns count)
 *   VYVRE_TRACKER.delete(scanId)                    — remove single entry
 *   VYVRE_TRACKER.exportJSON()                      — Blob URL (or returns string)
 *   VYVRE_TRACKER.computeDelta(a, b)                — { score, age, hydration, days }
 *   VYVRE_TRACKER.renderEvolution(container, opts)  — inject SVG sparkline + delta
 *   VYVRE_TRACKER.renderHistoryModal(opts)          — full history modal w/ compare
 *
 * Listens to: `vyvre:scan-complete` (engine event) → auto-saves the scan.
 *
 * v10 mission: tracking longitudinal pour fidélisation. Out of scope: cloud sync.
 */
(function () {
  'use strict';

  if (typeof window === 'undefined') return;

  const STORAGE_KEY = 'vyvre_scan_history';
  const STORAGE_VERSION = 1;
  const MAX_ENTRIES = 60;          // hard cap (storage budget ~6MB w/ photos)
  const MAX_PHOTO_SIZE = 160;      // px crop for face thumbnail
  const PHOTO_QUALITY = 0.7;       // JPEG quality

  // ─────────────────────────────────────────────────────────────────────
  // Storage helpers
  // ─────────────────────────────────────────────────────────────────────
  function readStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { version: STORAGE_VERSION, scans: [] };
      const parsed = JSON.parse(raw);
      if (!parsed.scans || !Array.isArray(parsed.scans)) {
        return { version: STORAGE_VERSION, scans: [] };
      }
      return parsed;
    } catch (e) {
      console.warn('[vyvre-tracker] readStore failed:', e.message);
      return { version: STORAGE_VERSION, scans: [] };
    }
  }

  function writeStore(store) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
      return true;
    } catch (e) {
      // QuotaExceeded — try again without photos
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.warn('[vyvre-tracker] quota exceeded, dropping photos');
        const stripped = {
          ...store,
          scans: store.scans.map(s => ({ ...s, photoCropped: null }))
        };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
          return true;
        } catch (_) {
          return false;
        }
      }
      console.warn('[vyvre-tracker] writeStore failed:', e.message);
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Langue — tout passe par le moteur maison /scan/vy-i18n.js (VY.t).
  // Le francais reste ecrit ici : si le moteur n'est pas charge (vieille page,
  // fichier de langue en echec), l'encart s'affiche quand meme, en francais.
  // ─────────────────────────────────────────────────────────────────────
  const FR = {
    'sv.kick': 'Suivi',
    'sv.emptyTitle': 'Suivez votre progression',
    'sv.emptyBody': 'Revenez pour un nouveau scan et visualisez l\u2019évolution de votre peau dans le temps.',
    'sv.history': 'Voir l\u2019historique',
    'sv.historyFull': 'Voir l\u2019historique complet',
    'sv.title': 'Votre parcours peau',
    'sv.evo': 'Évolution',
    'sv.last': '{k} derniers scans',
    'sv.days': 'jours',
    'sv.up': 'Peau améliorée de +{d} points en {j} jours.',
    'sv.down': 'Score en baisse de {d} points en {j} jours.',
    'sv.flat': 'Peau stable (Δ {d}) sur {j} jours.',
    'sv.global': 'Score global',
    'sv.cellAge': 'Âge cellulaire',
    'sv.hydration': 'Hydratation',
    'sv.hTitle': 'Historique des scans',
    'sv.hEmpty': 'Aucun scan encore — votre historique apparaîtra ici.',
    'sv.close': 'Fermer',
    'sv.export': 'Exporter JSON',
    'sv.clear': 'Tout effacer',
    'sv.clearAsk': 'Effacer tout l\u2019historique ? Action irréversible.',
    'sv.compare': 'Comparer',
    'sv.pick': 'Sélectionnez 2 scans pour comparer',
    'sv.delta': 'Δ du premier au dernier',
    'sv.metric': 'Mesure',
    'sv.score': 'Score',
    'sv.age': 'Ancienneté',
    'c.wrinkles': 'Ridules',
    'c.firmness': 'Fermeté',
    'c.glow': 'Éclat',
    'c.redness': 'Apaisement'
  };

  function T(key, vars) {
    var s = null;
    try { if (window.VY && typeof VY.t === 'function') { s = VY.t(key, vars); if (s === key) s = null; } } catch (_) { s = null; }
    if (s === null) {
      s = FR[key];
      if (s === undefined) return key;
      if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] === undefined ? m : vars[k]; });
    }
    return s;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Age cellulaire — on ne l'affiche QUE si le moteur le declare fiable.
  // Le moteur publie scores.confidence : 'high' | 'standard' | 'low' | 'none'.
  // Absent (vieille entree, score derive des pixels) = pas fiable : rien.
  // ─────────────────────────────────────────────────────────────────────
  function ageOf(entry) {
    if (!entry || !entry.scores) return null;
    const v = entry.scores.cellAge;
    if (v == null) return null;
    const c = entry.scores.confidence;
    if (c !== 'high' && c !== 'standard') return null;
    return v;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Brand detection (best-effort heuristic for current POC)
  // ─────────────────────────────────────────────────────────────────────
  function slugBrand(v) {
    return String(v).toLowerCase().trim().replace(/_/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  function detectBrand() {
    const path = (window.location && window.location.pathname) || '';
    const search = (window.location && window.location.search) || '';

    // 1. La marque posee par la page elle-meme (marque blanche : /m/<marque>).
    const declared = window.VYVRE_MARQUE || window.VYVRE_BRAND;
    if (declared) { const s = slugBrand(declared); if (s) return s; }

    // 2. L'adresse courante : /m/<marque>, /m/<marque>/protocol, /m/<marque>/cheveux.
    let m = path.match(/\/m\/([a-z0-9][a-z0-9-]*)/i);
    if (m) { const s = slugBrand(m[1]); if (s) return s; }

    // 3. Le parametre ?b= / ?brand= (les pages servies par reecriture le recoivent).
    try {
      const q = new URLSearchParams(search);
      const b = q.get('b') || q.get('brand');
      if (b) { const s = slugBrand(b); if (s) return s; }
    } catch (_) {}

    // 4. Compatibilite anciennes pages : VYVRE_<MARQUE>.html puis <marque>.html.
    m = path.match(/VYVRE_([A-Z0-9_-]+)/i);
    if (m) { const s = slugBrand(m[1]); if (s) return s; }
    m = path.match(/\/([a-z0-9-]+)\.html?$/i);
    if (m && !/^(index|scan|protocol)$/i.test(m[1])) { const s = slugBrand(m[1]); if (s) return s; }

    // 5. Le scan de la maison : ce n'est pas une marque inconnue, c'est le notre.
    return 'vyvre';
  }

  // ─────────────────────────────────────────────────────────────────────
  // Score normalisation — accepts engine output OR custom dashboard scores
  // ─────────────────────────────────────────────────────────────────────
  function normaliseScores(input) {
    const s = (input && input.scores) ? input.scores : input || {};
    return {
      cellAge: numOrNull(s.cellAge),
      bioAge: numOrNull(s.bioAge),
      perceivedAge: numOrNull(s.perceivedAge),
      hydration: numOrNull(s.hydration),
      wrinkles: numOrNull(s.wrinkles),
      firmness: numOrNull(s.firmness),
      glow: numOrNull(s.glow),
      redness: numOrNull(s.redness),
      pores: numOrNull(s.pores),
      sebum: numOrNull(s.sebum),
      pigmentation: numOrNull(s.pigmentation),
      globalScore: numOrNull(s.globalScore),
      /* le moteur publie une chaine ('high'|'standard'|'low'|'none') : la passer
         dans numOrNull la detruisait, et l'age passait pour fiable par defaut. */
      confidence: (typeof s.confidence === 'string') ? s.confidence : numOrNull(s.confidence),
      cellAgeMethod: (typeof s.cellAgeMethod === 'string') ? s.cellAgeMethod : null,
      quality: numOrNull(s.quality)
    };
  }

  function numOrNull(v) {
    if (v === null || v === undefined) return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
  }

  function extractClinical(input) {
    const c = (input && input.clinical) || (input && input.scores && input.scores.clinical) || null;
    if (!c || typeof c !== 'object') return null;
    return {
      acne: numOrNull(c.acne),
      rosacea: numOrNull(c.rosacea),
      melasma: numOrNull(c.melasma),
      lentigos: numOrNull(c.lentigos)
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  // Photo capture (160x160 face crop, JPEG, very compact)
  // ─────────────────────────────────────────────────────────────────────
  function capturePhoto(source) {
    try {
      if (!source) return null;
      const canvas = document.createElement('canvas');
      canvas.width = MAX_PHOTO_SIZE;
      canvas.height = MAX_PHOTO_SIZE;
      const ctx = canvas.getContext('2d');
      const sw = source.videoWidth || source.naturalWidth || source.width;
      const sh = source.videoHeight || source.naturalHeight || source.height;
      if (!sw || !sh) return null;
      // Center crop square
      const side = Math.min(sw, sh);
      const sx = (sw - side) / 2;
      const sy = (sh - side) / 2;
      ctx.drawImage(source, sx, sy, side, side, 0, 0, MAX_PHOTO_SIZE, MAX_PHOTO_SIZE);
      return canvas.toDataURL('image/jpeg', PHOTO_QUALITY);
    } catch (e) {
      return null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────────────────
  function save(scanResult, opts) {
    opts = opts || {};
    const store = readStore();
    const entry = {
      scanId: opts.scanId || uuid(),
      timestamp: Date.now(),
      brand: opts.brand || detectBrand(),
      scores: normaliseScores(scanResult),
      clinical: extractClinical(scanResult),
      photoCropped: opts.photo || null,
      source: opts.source || (scanResult && scanResult.source) || 'auto'
    };
    store.scans.push(entry);
    // Cap entries — drop oldest
    while (store.scans.length > MAX_ENTRIES) store.scans.shift();
    writeStore(store);
    VYVRE_LOG('[vyvre-tracker] saved scan', entry.scanId, 'brand=' + entry.brand,
      'globalScore=' + entry.scores.globalScore, 'cellAge=' + entry.scores.cellAge);
    window.dispatchEvent(new CustomEvent('vyvre:tracker-saved', { detail: entry }));
    return entry;
  }

  function list() {
    return readStore().scans.slice().sort((a, b) => a.timestamp - b.timestamp);
  }

  function last(n) {
    n = n || 10;
    const all = list();
    return all.slice(-n);
  }

  function deleteEntry(scanId) {
    const store = readStore();
    const initial = store.scans.length;
    store.scans = store.scans.filter(s => s.scanId !== scanId);
    writeStore(store);
    return initial - store.scans.length;
  }

  function clear() {
    const count = readStore().scans.length;
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    return count;
  }

  function exportJSON(asString) {
    const data = JSON.stringify(readStore(), null, 2);
    if (asString) return data;
    const blob = new Blob([data], { type: 'application/json' });
    return URL.createObjectURL(blob);
  }

  function computeDelta(a, b) {
    if (!a || !b) return null;
    const days = Math.round((b.timestamp - a.timestamp) / 86400000);
    const delta = (key) => {
      const va = a.scores[key], vb = b.scores[key];
      if (va == null || vb == null) return null;
      return Math.round((vb - va) * 100) / 100;
    };
    return {
      days,
      score: delta('globalScore'),
      age: delta('cellAge'),
      hydration: delta('hydration'),
      wrinkles: delta('wrinkles'),
      firmness: delta('firmness'),
      glow: delta('glow'),
      redness: delta('redness')
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  // SVG sparkline + delta card
  // ─────────────────────────────────────────────────────────────────────
  function renderEvolution(container, opts) {
    opts = opts || {};
    const target = typeof container === 'string'
      ? document.querySelector(container)
      : container;
    if (!target) {
      console.warn('[vyvre-tracker] renderEvolution: container not found');
      return null;
    }
    const brand = opts.brand || detectBrand();
    const all = list().filter(s => !opts.brandFilter || s.brand === brand);

    if (all.length < 2) {
      // First scan ever — show "welcome back next time" CTA
      target.innerHTML = renderEmptyEvolution(opts);
      attachHistoryButton(target);
      return target;
    }

    const lastN = all.slice(-12);
    const first = lastN[0];
    const latest = lastN[lastN.length - 1];
    const delta = computeDelta(first, latest);

    target.innerHTML = renderEvolutionHTML(lastN, delta, opts);
    attachHistoryButton(target);
    return target;
  }

  function renderEmptyEvolution(opts) {
    return `
      <div class="vyvre-tracker-empty" style="padding:32px;border:1px solid rgba(255,255,255,0.08);border-radius:24px;text-align:center;background:rgba(255,255,255,0.02);margin:24px 0;">
        <div data-i18n="sv.kick" style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.55);margin-bottom:12px;font-family:'JetBrains Mono',monospace;">${T('sv.kick')}</div>
        <div data-i18n="sv.emptyTitle" style="font-size:24px;font-weight:300;color:#FFF;margin-bottom:10px;">${T('sv.emptyTitle')}</div>
        <div data-i18n="sv.emptyBody" style="font-size:14px;color:rgba(255,255,255,0.62);max-width:380px;margin:0 auto 18px;line-height:1.5;">${T('sv.emptyBody')}</div>
        <button data-vyvre-history-btn style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:#FFF;padding:10px 24px;border-radius:24px;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;cursor:pointer;"><span data-i18n="sv.history">${T('sv.history')}</span> (1)</button>
      </div>
    `;
  }

  function renderEvolutionHTML(entries, delta, opts) {
    const latest = entries[entries.length - 1];
    const scores = entries.map(e => e.scores.globalScore).filter(v => v != null);
    /* age cellulaire : seules les lectures declarees fiables entrent ici */
    const ages = entries.map(ageOf).filter(v => v != null);
    const sparkScores = sparkline(scores, '#FFFFFF', 'score');
    const sparkAges = sparkline(ages, '#C9A961', 'age');

    const first = entries[0];
    const ageFirst = ageOf(first), ageLast = ageOf(latest);
    const deltaAge = (ageFirst != null && ageLast != null) ? Math.round((ageLast - ageFirst) * 100) / 100 : null;

    const verdict = describeVerdict(delta);

    const cells = [
      trackerMetricCell(T('sv.global'), scores[scores.length - 1], delta.score, sparkScores)
    ];
    /* l'age ne s'affiche pas du tout tant que le moteur ne le declare pas fiable */
    if (ageLast != null) cells.push(trackerMetricCell(T('sv.cellAge'), ageLast, deltaAge, sparkAges, true));
    cells.push(trackerMetricCell(T('sv.hydration'), latest.scores.hydration, delta.hydration,
      sparkline(entries.map(e => e.scores.hydration).filter(v => v != null), '#7AC9DA', 'hyd')));

    return `
      <div class="vyvre-tracker-card" style="padding:40px 32px;border:1px solid rgba(255,255,255,0.08);border-radius:28px;background:rgba(255,255,255,0.02);margin:32px 0;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:24px;margin-bottom:32px;">
          <div>
            <div data-i18n="sv.evo" style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.6);font-family:'JetBrains Mono',monospace;margin-bottom:8px;">${T('sv.evo')}</div>
            <div data-i18n="sv.title" style="font-size:28px;font-weight:200;color:#FFF;letter-spacing:-0.02em;">${T('sv.title')}</div>
            <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:6px;font-family:'JetBrains Mono',monospace;">${T('sv.last', { k: entries.length })} · ${delta.days} ${T('sv.days')}</div>
          </div>
          <button data-vyvre-history-btn style="background:transparent;border:1px solid rgba(255,255,255,0.2);color:#FFF;padding:10px 22px;border-radius:24px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;cursor:pointer;white-space:nowrap;"><span data-i18n="sv.historyFull">${T('sv.historyFull')}</span> (${entries.length})</button>
        </div>

        <div style="font-size:clamp(18px,2vw,24px);font-weight:200;color:#FFF;margin-bottom:36px;letter-spacing:-0.01em;line-height:1.4;">${verdict}</div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px;">
          ${cells.join('')}
        </div>
      </div>
    `;
  }

  function describeVerdict(delta) {
    const d = delta.score;
    if (d == null) return '';
    if (d > 3) return T('sv.up', { d: Math.abs(d), j: delta.days });
    if (d < -3) return T('sv.down', { d: Math.abs(d), j: delta.days });
    return T('sv.flat', { d: (d > 0 ? '+' : '') + d, j: delta.days });
  }

  function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function trackerMetricCell(label, current, delta, svg, isAge) {
    if (current == null) {
      return `<div style="padding:24px;background:rgba(255,255,255,0.03);border-radius:18px;">
        <div style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.4);font-family:'JetBrains Mono',monospace;margin-bottom:14px;">${label}</div>
        <div style="font-size:32px;font-weight:200;color:rgba(255,255,255,0.4);">--</div>
      </div>`;
    }
    const deltaTxt = delta == null ? '' : (delta > 0 ? '+' : '') + delta;
    let deltaColor;
    if (delta == null) deltaColor = 'rgba(255,255,255,0.4)';
    else if (isAge) deltaColor = delta < 0 ? '#7DD3A0' : (delta > 0 ? '#E89B9B' : 'rgba(255,255,255,0.5)');
    else deltaColor = delta > 0 ? '#7DD3A0' : (delta < 0 ? '#E89B9B' : 'rgba(255,255,255,0.5)');
    return `
      <div style="padding:24px;background:rgba(255,255,255,0.03);border-radius:18px;display:flex;flex-direction:column;gap:14px;">
        <div style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(255,255,255,0.4);font-family:'JetBrains Mono',monospace;">${label}</div>
        <div style="display:flex;align-items:baseline;gap:12px;">
          <span style="font-size:48px;font-weight:200;color:#FFF;letter-spacing:-0.03em;line-height:1;">${current}</span>
          ${deltaTxt ? `<span style="font-family:'JetBrains Mono',monospace;font-size:13px;color:${deltaColor};font-weight:500;">${deltaTxt}</span>` : ''}
        </div>
        <div style="margin-top:4px;height:36px;">${svg}</div>
      </div>
    `;
  }

  function sparkline(values, color, key) {
    if (!values || values.length < 2) return '';
    const w = 200, h = 36, pad = 4;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const step = (w - pad * 2) / (values.length - 1);
    const points = values.map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return [x.toFixed(1), y.toFixed(1)];
    });
    const path = 'M ' + points.map(p => p[0] + ',' + p[1]).join(' L ');
    const area = path + ` L ${points[points.length - 1][0]},${h} L ${points[0][0]},${h} Z`;
    const lastPt = points[points.length - 1];
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" style="width:100%;height:36px;display:block;">
      <path d="${area}" fill="${color}" fill-opacity="0.08"/>
      <path d="${path}" stroke="${color}" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${lastPt[0]}" cy="${lastPt[1]}" r="2.5" fill="${color}"/>
    </svg>`;
  }

  // ─────────────────────────────────────────────────────────────────────
  // Full history modal — list all scans, allow compare 2 + export
  // ─────────────────────────────────────────────────────────────────────
  function renderHistoryModal(opts) {
    opts = opts || {};
    const txt = {
      title: T('sv.hTitle'), empty: T('sv.hEmpty'), close: T('sv.close'),
      export: T('sv.export'), clear: T('sv.clear'), compare: T('sv.compare'),
      selected: T('sv.pick'), delta: T('sv.delta'), cellAge: T('sv.cellAge'),
      global: T('sv.score'), hydration: T('sv.hydration'), ageScan: T('sv.age'),
      metric: T('sv.metric')
    };

    // Remove any prior modal
    const existing = document.getElementById('vyvre-tracker-modal');
    if (existing) existing.remove();

    const entries = list();
    const modal = document.createElement('div');
    modal.id = 'vyvre-tracker-modal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);display:flex;align-items:flex-start;justify-content:center;padding:40px 16px;overflow-y:auto;font-family:Inter,system-ui,-apple-system,sans-serif;';

    modal.innerHTML = `
      <div style="background:#0A0A0C;border:1px solid rgba(255,255,255,0.1);border-radius:28px;max-width:920px;width:100%;padding:40px;color:#FFF;position:relative;">
        <button data-vyvre-close aria-label="${txt.close}" title="${txt.close}" style="position:absolute;top:24px;right:24px;background:transparent;border:1px solid rgba(255,255,255,0.2);color:#FFF;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:18px;line-height:1;">×</button>
        <div style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:rgba(255,255,255,0.5);font-family:'JetBrains Mono',monospace;margin-bottom:10px;">VYVRE</div>
        <h2 style="font-size:32px;font-weight:200;letter-spacing:-0.02em;margin-bottom:24px;color:#FFF;">${txt.title}</h2>
        ${entries.length === 0 ? `<div style="padding:60px 0;text-align:center;color:rgba(255,255,255,0.4);font-size:14px;">${txt.empty}</div>` : ''}
        ${entries.length > 0 ? renderHistoryList(entries, txt) : ''}
        ${entries.length > 0 ? `
          <div style="display:flex;gap:12px;margin-top:32px;justify-content:flex-end;flex-wrap:wrap;">
            <button data-vyvre-compare style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);color:#FFF;padding:12px 22px;border-radius:24px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;cursor:pointer;" disabled>${txt.compare}</button>
            <button data-vyvre-export style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);color:#FFF;padding:12px 22px;border-radius:24px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;cursor:pointer;">${txt.export}</button>
            <button data-vyvre-clear style="background:transparent;border:1px solid rgba(232,155,155,0.4);color:#E89B9B;padding:12px 22px;border-radius:24px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;cursor:pointer;">${txt.clear}</button>
          </div>
        ` : ''}
        <div id="vyvre-tracker-compare-pane" style="margin-top:24px;"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const selected = new Set();
    modal.querySelector('[data-vyvre-close]').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });

    const exportBtn = modal.querySelector('[data-vyvre-export]');
    if (exportBtn) exportBtn.addEventListener('click', () => {
      const url = exportJSON();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'vyvre-scan-history-' + new Date().toISOString().slice(0, 10) + '.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });

    const clearBtn = modal.querySelector('[data-vyvre-clear]');
    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (confirm(T('sv.clearAsk'))) {
        const removed = clear();
        VYVRE_LOG('[vyvre-tracker] cleared', removed, 'entries');
        modal.remove();
      }
    });

    const compareBtn = modal.querySelector('[data-vyvre-compare]');
    modal.querySelectorAll('[data-vyvre-row]').forEach(row => {
      row.addEventListener('click', () => {
        const id = row.dataset.vyvreRow;
        if (selected.has(id)) {
          selected.delete(id);
          row.style.background = 'rgba(255,255,255,0.02)';
          row.style.borderColor = 'rgba(255,255,255,0.06)';
        } else {
          if (selected.size >= 2) return;
          selected.add(id);
          row.style.background = 'rgba(201,169,97,0.06)';
          row.style.borderColor = 'rgba(201,169,97,0.3)';
        }
        if (compareBtn) compareBtn.disabled = selected.size !== 2;
        if (compareBtn) compareBtn.style.opacity = selected.size === 2 ? '1' : '0.4';
      });
    });
    if (compareBtn) {
      compareBtn.style.opacity = '0.4';
      compareBtn.addEventListener('click', () => {
        if (selected.size !== 2) return;
        const ids = [...selected];
        const a = entries.find(e => e.scanId === ids[0]);
        const b = entries.find(e => e.scanId === ids[1]);
        const [first, second] = a.timestamp < b.timestamp ? [a, b] : [b, a];
        const pane = modal.querySelector('#vyvre-tracker-compare-pane');
        if (pane) pane.innerHTML = renderComparePane(first, second, txt);
      });
    }
    return modal;
  }

  function renderHistoryList(entries, txt) {
    const sorted = entries.slice().sort((a, b) => b.timestamp - a.timestamp);
    const cell = (label, value) => `
          <div style="text-align:right;">
            <div style="font-size:10px;color:rgba(255,255,255,0.6);text-transform:uppercase;letter-spacing:0.2em;font-family:'JetBrains Mono',monospace;">${label}</div>
            <div style="font-size:18px;color:#FFF;font-weight:300;">${value}</div>
          </div>`;
    const rows = sorted.map(e => {
      const date = new Date(e.timestamp);
      const dateStr = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      const timeStr = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      const score = e.scores.globalScore != null ? Math.round(e.scores.globalScore) : '--';
      const age = ageOf(e);
      const hyd = e.scores.hydration != null ? Math.round(e.scores.hydration) : '--';
      const brand = e.brand ? e.brand.replace(/[-_]/g, ' ') : '';
      /* l'age cellulaire ne parait pas du tout quand la lecture n'est pas fiable */
      const mesures = [cell(txt.global, score)];
      if (age != null) mesures.push(cell(txt.cellAge, Math.round(age)));
      mesures.push(cell(txt.hydration, hyd));
      return `
        <div data-vyvre-row="${e.scanId}" style="display:grid;grid-template-columns:auto 1fr repeat(${mesures.length},auto);gap:16px;align-items:center;padding:16px 18px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:14px;margin-bottom:8px;cursor:pointer;transition:background 0.2s,border-color 0.2s;">
          ${e.photoCropped ? `<img src="${e.photoCropped}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover;border:1px solid rgba(255,255,255,0.1);">` : `<div style="width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;font-size:14px;color:rgba(255,255,255,0.6);">${brand.charAt(0).toUpperCase()}</div>`}
          <div>
            <div style="font-size:14px;color:#FFF;font-weight:400;">${dateStr} · ${timeStr}</div>
            <div style="font-size:11px;color:rgba(255,255,255,0.6);font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:0.1em;margin-top:2px;">${brand}</div>
          </div>
          ${mesures.join('')}
        </div>
      `;
    }).join('');
    const helper = `<div style="font-size:11px;color:rgba(255,255,255,0.6);margin-bottom:14px;font-family:'JetBrains Mono',monospace;letter-spacing:0.05em;">${txt.selected}</div>`;
    return helper + rows;
  }

  function renderComparePane(a, b, txt) {
    const delta = computeDelta(a, b);
    if (!delta) return '';
    const cmpRow = (label, va, vb, dKey, isAge) => {
      if (va == null || vb == null) return '';
      const d = delta[dKey];
      let color = 'rgba(255,255,255,0.5)';
      if (d != null && d !== 0) {
        if (isAge) color = d < 0 ? '#7DD3A0' : '#E89B9B';
        else color = d > 0 ? '#7DD3A0' : '#E89B9B';
      }
      return `<tr>
        <td style="padding:10px 0;color:rgba(255,255,255,0.72);font-size:13px;">${label}</td>
        <td style="padding:10px 0;color:#FFF;text-align:right;font-family:'JetBrains Mono',monospace;font-size:14px;">${Math.round(va)}</td>
        <td style="padding:10px 0;color:#FFF;text-align:right;font-family:'JetBrains Mono',monospace;font-size:14px;">${Math.round(vb)}</td>
        <td style="padding:10px 0;text-align:right;color:${color};font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:500;">${d != null ? (d > 0 ? '+' : '') + Math.round(d * 10) / 10 : '--'}</td>
      </tr>`;
    };
    const dateA = new Date(a.timestamp).toLocaleDateString();
    const dateB = new Date(b.timestamp).toLocaleDateString();
    return `
      <div style="margin-top:24px;padding:24px;background:rgba(201,169,97,0.04);border:1px solid rgba(201,169,97,0.15);border-radius:18px;">
        <div style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:rgba(201,169,97,0.8);font-family:'JetBrains Mono',monospace;margin-bottom:14px;">${txt.delta}</div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid rgba(255,255,255,0.1);">
              <th style="padding:8px 0;text-align:left;font-size:11px;color:rgba(255,255,255,0.62);font-weight:400;text-transform:uppercase;letter-spacing:0.15em;">${txt.metric}</th>
              <th style="padding:8px 0;text-align:right;font-size:11px;color:rgba(255,255,255,0.62);font-weight:400;">${dateA}</th>
              <th style="padding:8px 0;text-align:right;font-size:11px;color:rgba(255,255,255,0.62);font-weight:400;">${dateB}</th>
              <th style="padding:8px 0;text-align:right;font-size:11px;color:rgba(255,255,255,0.62);font-weight:400;">Δ ${delta.days} ${T('sv.days')}</th>
            </tr>
          </thead>
          <tbody>
            ${cmpRow(txt.global, a.scores.globalScore, b.scores.globalScore, 'score')}
            ${cmpRow(txt.cellAge, ageOf(a), ageOf(b), 'age', true)}
            ${cmpRow(txt.hydration, a.scores.hydration, b.scores.hydration, 'hydration')}
            ${cmpRow(T('c.wrinkles'), a.scores.wrinkles, b.scores.wrinkles, 'wrinkles')}
            ${cmpRow(T('c.firmness'), a.scores.firmness, b.scores.firmness, 'firmness')}
            ${cmpRow(T('c.glow'), a.scores.glow, b.scores.glow, 'glow')}
            ${cmpRow(T('c.redness'), a.scores.redness, b.scores.redness, 'redness', true)}
          </tbody>
        </table>
      </div>
    `;
  }

  function attachHistoryButton(root) {
    const btn = root.querySelector('[data-vyvre-history-btn]');
    if (btn) btn.addEventListener('click', () => renderHistoryModal({}));
  }

  // ─────────────────────────────────────────────────────────────────────
  // UUID helper (no external lib)
  // ─────────────────────────────────────────────────────────────────────
  function uuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Auto-save: listen to engine event AND scrape the dashboard if needed
  // ─────────────────────────────────────────────────────────────────────
  function autoSaveFromEvent(detail) {
    if (!detail || detail.rejected) return; // skip rejected scans
    // Capture face thumbnail from current video / capturedImg if present
    let photo = null;
    const v = document.querySelector('video');
    const img = document.querySelector('#capturedImg, img[data-vyvre-photo]');
    if (v && v.videoWidth > 0) photo = capturePhoto(v);
    else if (img && (img.naturalWidth > 0 || img.complete)) photo = capturePhoto(img);
    save(detail, { photo });
  }

  function injectIntoResultsView() {
    // Best-effort heuristic: when results view becomes visible, inject the
    // evolution card after the existing biomarker block. POCs that want
    // tight control can call VYVRE_TRACKER.renderEvolution(selector) directly.
    const candidates = [
      '.vyvre-v6 .v6grid',
      '.vyvre-v6',
      '#view-results',
      '[id*="result"]',
      '[class*="result"]'
    ];
    for (const sel of candidates) {
      const target = document.querySelector(sel);
      if (target && target.offsetParent !== null) {
        // Only inject once
        if (target.querySelector('.vyvre-tracker-card, .vyvre-tracker-empty')) return;
        const slot = document.createElement('div');
        slot.dataset.vyvreTrackerSlot = '1';
        target.appendChild(slot);
        renderEvolution(slot, {});
        return;
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────
  // Wire up
  // ─────────────────────────────────────────────────────────────────────
  window.VYVRE_TRACKER = {
    version: 'v10.0.0',
    save,
    list,
    last,
    delete: deleteEntry,
    clear,
    exportJSON,
    computeDelta,
    renderEvolution,
    renderHistoryModal,
    detectBrand,
    capturePhoto,
    _normaliseScores: normaliseScores,
    _readStore: readStore
  };

  // La langue peut changer apres le scan : l'encart de suivi se repeint.
  document.addEventListener('vy:lang', () => {
    try {
      const slot = document.querySelector('[data-vyvre-tracker-slot]');
      if (slot) renderEvolution(slot, {});
      const modal = document.getElementById('vyvre-tracker-modal');
      if (modal) { modal.remove(); renderHistoryModal({}); }
    } catch (_) {}
  });

  // Auto-hook engine events
  window.addEventListener('vyvre:scan-complete', (e) => {
    try { autoSaveFromEvent(e.detail); } catch (err) {
      console.warn('[vyvre-tracker] auto-save failed:', err.message);
    }
    // Schedule injection a tick after scan UI renders
    setTimeout(injectIntoResultsView, 1500);
    setTimeout(injectIntoResultsView, 3500);
  });

  // POCs like DIOR drive their own flow and set window.vyvreLastScanResult
  // We expose `tracker:auto` event for them to push manually.
  window.addEventListener('vyvre:tracker-record', (e) => {
    try { autoSaveFromEvent(e.detail); } catch (_) {}
    setTimeout(injectIntoResultsView, 800);
  });

  // Late-loaded scans: if window.vyvreLastScanResult is set within 30s of load,
  // we'll auto-save it. (Polling — cheap, fires once.)
  let _autoSaved = false;
  const autoCheck = setInterval(() => {
    if (_autoSaved) return clearInterval(autoCheck);
    const r = window.vyvreLastScanResult;
    if (r && r.scores) {
      _autoSaved = true;
      try { autoSaveFromEvent(r); } catch (_) {}
      setTimeout(injectIntoResultsView, 800);
      clearInterval(autoCheck);
    }
  }, 700);
  setTimeout(() => clearInterval(autoCheck), 60000);

  VYVRE_LOG('[vyvre-tracker v10.0.0] ready — history:', readStore().scans.length, 'entries');
})();
