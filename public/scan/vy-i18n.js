/* VYVRE — moteur de langue maison (vy-i18n)
   Sans dependance. Francais par defaut, 12 langues.
   Ordre de selection : ?lang=xx > choix memorise > langue du navigateur > francais.
   Le francais est ecrit en clair dans le HTML : aucune latence, aucun clignotement.
   Les autres langues vivent dans /scan/i18n/<code>.js et se chargent a la demande.
   Ajouter une langue : deposer /scan/i18n/<code>.js (VY.add('<code>',{...})) puis
   ajouter {c:'<code>',n:'Nom natif'} dans LANGS ci-dessous. Rien d'autre.
*/
(function (w, d) {
  'use strict';

  var LANGS = [
    { c: 'fr', n: 'Français' },
    { c: 'en', n: 'English' },
    { c: 'es', n: 'Español' },
    { c: 'it', n: 'Italiano' },
    { c: 'de', n: 'Deutsch' },
    { c: 'pt', n: 'Português' },
    { c: 'nl', n: 'Nederlands' },
    { c: 'ru', n: 'Русский' },
    { c: 'ar', n: 'العربية' },
    { c: 'ja', n: '日本語' },
    { c: 'ko', n: '한국어' },
    { c: 'zh', n: '简体中文' }
  ];
  var RTL = { ar: 1 };
  var KEY = 'vyvre-lang';
  /* chiffres du catalogue : valeurs de repli, ecrasees par VY.chiffres() des que le
     catalogue reellement servi a repondu. Formatees selon la langue affichee. */
  var NUM = { p: 5926, b: 146 };
  var BASE = '/scan/i18n/';

  /* ---------- etat ---------- */
  var DICT = {};
  var cur = 'fr';
  var loading = {};

  function has(c) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i].c === c) return true; return false; }

  function norm(v) {
    if (!v) return null;
    v = String(v).toLowerCase().replace('_', '-');
    if (v.indexOf('zh') === 0) return 'zh';
    var s = v.split('-')[0];
    return has(s) ? s : null;
  }

  function stored() { try { return norm(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function store(c) { try { localStorage.setItem(KEY, c); } catch (e) {} }

  function pick() {
    var q = null;
    try { q = norm(new URLSearchParams(location.search).get('lang')); } catch (e) {}
    /* un lien ?lang=xx vaut choix : on le retient pour la suite de la visite */
    if (q) { store(q); return q; }
    var s = stored();
    if (s) return s;
    var navs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language];
    for (var i = 0; i < navs.length; i++) { var n = norm(navs[i]); if (n) return n; }
    return 'fr';
  }

  function nf(v) {
    try { return new Intl.NumberFormat(cur === 'zh' ? 'zh-Hans' : cur).format(v); } catch (e) { return String(v); }
  }

  function t(key, vars) {
    var s = (DICT[cur] && DICT[cur][key]);
    if (s === undefined) s = (DICT.fr && DICT.fr[key]);
    if (s === undefined) return key;
    if (s.indexOf('{') < 0) return s;
    var g = { n: nf(NUM.p), b: String(NUM.b) };
    if (vars) for (var k in vars) g[k] = vars[k];
    return s.replace(/\{(\w+)\}/g, function (m, kk) { return (g[kk] === undefined || g[kk] === null) ? m : g[kk]; });
  }

  /* ---------- application au DOM ---------- */
  function apply(root) {
    root = root || d;
    var n = root.querySelectorAll('[data-i18n]'), i, el, s;
    for (i = 0; i < n.length; i++) {
      el = n[i]; s = t(el.getAttribute('data-i18n'));
      if (s.indexOf('<') >= 0) { if (el.innerHTML !== s) el.innerHTML = s; }
      else if (el.textContent !== s) el.textContent = s;
    }
    n = root.querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < n.length; i++) {
      el = n[i];
      el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
        var p = pair.split(':'); if (p.length === 2) el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    }
    if (root === d) {
      var h = d.documentElement;
      h.setAttribute('lang', cur === 'zh' ? 'zh-Hans' : cur);
      h.setAttribute('dir', RTL[cur] ? 'rtl' : 'ltr');
      var mt = d.querySelector('meta[name="vy-title-key"]');
      var tk = mt ? mt.getAttribute('content') : 'meta.t';
      var dk = tk === 'meta.pt' ? 'meta.pd' : 'meta.d';
      d.title = t(tk);
      var md = d.querySelector('meta[name="description"]');
      if (!md) { md = d.createElement('meta'); md.setAttribute('name', 'description'); d.head.appendChild(md); }
      md.setAttribute('content', t(dk));
    }
  }

  function fire() {
    apply();
    try { d.dispatchEvent(new CustomEvent('vy:lang', { detail: { lang: cur } })); }
    catch (e) { var ev = d.createEvent('Event'); ev.initEvent('vy:lang', true, true); d.dispatchEvent(ev); }
    paintPicker();
  }

  function load(c, cb) {
    if (DICT[c]) { cb(); return; }
    if (loading[c]) { loading[c].push(cb); return; }
    loading[c] = [cb];
    var s = d.createElement('script');
    s.src = BASE + c + '.js?v=18';
    s.onload = s.onerror = function () {
      var q = loading[c] || []; loading[c] = null;
      for (var i = 0; i < q.length; i++) q[i]();
    };
    (d.head || d.documentElement).appendChild(s);
  }

  function set(c, remember) {
    c = norm(c) || 'fr';
    if (remember !== false) store(c);
    load(c, function () { cur = DICT[c] ? c : 'fr'; fire(); });
  }

  /* ---------- selecteur de langue (verre, capitales espacees) ---------- */
  var CSS =
    '#vy-lang{position:relative;display:flex!important;align-items:center;z-index:140;-webkit-user-select:none;user-select:none}' +
    '#vy-lang>button{appearance:none;cursor:pointer;display:flex;align-items:center;gap:8px;' +
    'background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.14);border-radius:999px;' +
    'color:rgba(255,255,255,.72);padding:9px 15px;font-family:"JetBrains Mono","SF Mono",monospace;' +
    'font-size:10px;font-weight:400;letter-spacing:.28em;text-transform:uppercase;line-height:1;' +
    'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:color .35s,border-color .35s,background .35s}' +
    '#vy-lang>button:hover{color:#fff;border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.08)}' +
    '#vy-lang>button i{font-style:normal;font-size:7px;opacity:.55;letter-spacing:0;transform:translateY(1px)}' +
    '#vy-lang ul{position:absolute;top:calc(100% + 10px);right:0;margin:0;padding:8px;list-style:none;' +
    'min-width:178px;max-height:62vh;overflow-y:auto;border-radius:18px;' +
    'background:rgba(10,10,12,.82);border:1px solid rgba(255,255,255,.12);' +
    'backdrop-filter:blur(34px) saturate(1.4);-webkit-backdrop-filter:blur(34px) saturate(1.4);' +
    'box-shadow:0 30px 70px -20px rgba(0,0,0,.9);opacity:0;visibility:hidden;transform:translateY(-6px);' +
    'transition:opacity .3s,transform .3s,visibility .3s}' +
    '#vy-lang.on ul{opacity:1;visibility:visible;transform:translateY(0)}' +
    '#vy-lang li>button{appearance:none;cursor:pointer;width:100%;display:flex;align-items:center;gap:10px;' +
    'background:none;border:0;border-radius:11px;padding:9px 11px;text-align:left;' +
    'color:rgba(255,255,255,.6);font-family:"Inter",sans-serif;font-size:13px;font-weight:300;transition:color .25s,background .25s}' +
    '#vy-lang li>button:hover{color:#fff;background:rgba(255,255,255,.06)}' +
    '#vy-lang li>button[aria-current="true"]{color:#fff}' +
    '#vy-lang li>button b{font-family:"JetBrains Mono",monospace;font-size:9px;font-weight:400;letter-spacing:.2em;' +
    'text-transform:uppercase;opacity:.45;min-width:22px}' +
    '[dir="rtl"] #vy-lang ul{right:auto;left:0}' +
    '[dir="rtl"] #vy-lang li>button{text-align:right}' +
    /* mobile : l'en-tete est deja pleine ; la pastille descend en bas a gauche,
       sous le pouce, a l'oppose du bouton DECK, et le menu s'ouvre vers le haut */
    '@media (max-width:760px){#vy-lang{position:fixed;top:auto;bottom:calc(20px + env(safe-area-inset-bottom));left:16px;right:auto;z-index:150}' +
    '[dir="rtl"] #vy-lang{left:16px;right:auto}' +
    '#vy-lang>button{padding:9px 14px;font-size:9px;letter-spacing:.2em}' +
    '#vy-lang ul,[dir="rtl"] #vy-lang ul{top:auto;bottom:calc(100% + 10px);left:0;right:auto;min-width:158px;max-height:56vh}' +
    '#vy-lang ul{transform:translateY(6px)}#vy-lang.on ul{transform:translateY(0)}' +
    /* elle flotte au-dessus du texte : pendant qu'on fait defiler, elle s'efface,
       et revient des que le doigt s'arrete. Sinon elle masque une ligne sur deux
       des resultats (constate sur le scan cheveux, section « vous nous avez dit »). */
    '#vy-lang.vy-lang-file{opacity:0;pointer-events:none;transform:translateY(10px)}' +
    '#vy-lang{transition:opacity .22s ease,transform .22s ease}}' +
    /* droite a gauche : on protege la mise en page sans la retourner */
    '[dir="rtl"] .vyvre-v6 .v6lbl{right:auto;left:28px}' +
    '[dir="rtl"] .vyvre-v6 .v6grid>#vyvre-product-row::before{left:auto;right:20px}' +
    '[dir="rtl"] .depth-indicator,[dir="rtl"] .scan-hud,[dir="rtl"] .atlas-legend .row{direction:rtl}' +
    '[dir="rtl"] .hero-content,[dir="rtl"] .vyvre-v6 .v6card,[dir="rtl"] .sg-marque-in{text-align:center}' +
    '[dir="rtl"] .atlas-svg,[dir="rtl"] #epigenetic-canvas,[dir="rtl"] .video-container{direction:ltr}' +
    '[dir="rtl"] .vyp-uni .vyp-chip,[dir="rtl"] .atlas-narrative{text-align:right}';

  var picker = null;
  function buildPicker() {
    var host = d.querySelector('[data-vy-lang]') || d.querySelector('header');
    if (!host || d.getElementById('vy-lang')) return;
    var st = d.createElement('style'); st.id = 'vy-lang-css'; st.textContent = CSS;
    (d.head || d.documentElement).appendChild(st);

    picker = d.createElement('div'); picker.id = 'vy-lang';
    var btn = d.createElement('button');
    btn.type = 'button'; btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="vy-lang-code"></span><i>▾</i>';
    var ul = d.createElement('ul');
    LANGS.forEach(function (L) {
      var li = d.createElement('li'), b = d.createElement('button');
      b.type = 'button'; b.dataset.c = L.c;
      b.innerHTML = '<b>' + L.c.toUpperCase() + '</b><span>' + L.n + '</span>';
      b.onclick = function () { close(); set(L.c); };
      li.appendChild(b); ul.appendChild(li);
    });
    picker.appendChild(btn); picker.appendChild(ul);
    host.appendChild(picker);

    function close() { picker.classList.remove('on'); btn.setAttribute('aria-expanded', 'false'); }
    btn.onclick = function (e) {
      e.stopPropagation();
      var on = picker.classList.toggle('on');
      btn.setAttribute('aria-expanded', String(on));
    };
    d.addEventListener('click', function (e) { if (picker && !picker.contains(e.target)) close(); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    /* L'en-tete est en verre (backdrop-filter) : Chrome y enferme les enfants en
       position:fixed et rogne le menu deroulant sur la barre. La pastille vit donc
       dans le body et vient se poser visuellement dans la bande de l'en-tete. */
    var mq = w.matchMedia('(max-width:760px)');
    if (picker.parentNode !== d.body) d.body.appendChild(picker);

    function placer() {
      if (mq.matches) { /* mobile : tout est dans la feuille de style */
        picker.style.top = picker.style.bottom = picker.style.left = picker.style.right = picker.style.transform = '';
        return;
      }
      var h = d.querySelector('header');
      if (!h) return;
      var r = h.getBoundingClientRect();
      var cs = w.getComputedStyle(h);
      var padL = parseFloat(cs.paddingLeft) || 0, padR = parseFloat(cs.paddingRight) || 0;
      var rtl = d.documentElement.getAttribute('dir') === 'rtl';
      picker.style.position = 'fixed';
      picker.style.top = Math.round(r.top + r.height / 2) + 'px';
      picker.style.transform = 'translateY(-50%)';
      /* on ne recouvre jamais le bouton DECK, epingle lui aussi en haut */
      var deck = d.querySelector('.vyvre-pitch-btn'), dr = null;
      if (deck && w.getComputedStyle(deck).display !== 'none') {
        var b = deck.getBoundingClientRect();
        if (b.width && b.top < r.bottom && b.bottom > r.top) dr = b;
      }
      var lg = picker.getBoundingClientRect().width || 66;
      if (rtl) {
        var gL = r.left + padL;
        /* DECK reste physiquement a droite : on ne se decale que s'il y a vraiment collision */
        if (dr && gL < dr.right && gL + lg > dr.left) gL = dr.right + 14;
        picker.style.left = Math.round(gL) + 'px'; picker.style.right = 'auto';
      } else {
        var gR = w.innerWidth - r.right + padR;
        var x0 = w.innerWidth - gR - lg, x1 = w.innerWidth - gR;
        if (dr && x0 < dr.right && x1 > dr.left) gR = w.innerWidth - dr.left + 14;
        picker.style.right = Math.round(gR) + 'px'; picker.style.left = 'auto';
      }
    }
    placer();

    /* On ecoute en capture : le scan cheveux fait defiler un conteneur interne
       (.view.scrolls), pas la fenetre, et un listener sur window n'y verrait rien. */
    var fileTimer = null;
    function auDefilement() {
      if (!mq.matches || !picker) return;
      if (picker.classList.contains('on')) return;   // menu ouvert : on ne le derobe pas
      picker.classList.add('vy-lang-file');
      if (fileTimer) clearTimeout(fileTimer);
      fileTimer = setTimeout(function () {
        if (picker) picker.classList.remove('vy-lang-file');
      }, 650);
    }
    d.addEventListener('scroll', auDefilement, { passive: true, capture: true });
    w.addEventListener('scroll', auDefilement, { passive: true });

    w.addEventListener('resize', function () { close(); placer(); }, { passive: true });
    if (mq.addEventListener) mq.addEventListener('change', function () { close(); placer(); });
    else if (mq.addListener) mq.addListener(function () { close(); placer(); });
    w.vyPlacerLangue = placer;

    paintPicker();
  }

  function paintPicker() {
    if (!picker) return;
    if (w.vyPlacerLangue) w.vyPlacerLangue();
    var c = picker.querySelector('.vy-lang-code'); if (c) c.textContent = cur.toUpperCase();
    var b = picker.querySelector('button'); if (b) b.setAttribute('aria-label', t('lang.aria'));
    picker.querySelectorAll('li>button').forEach(function (x) {
      x.setAttribute('aria-current', String(x.dataset.c === cur));
    });
  }

  /* ---------- api ---------- */
  w.VY = {
    langs: LANGS,
    t: t,
    apply: apply,
    set: set,
    get lang() { return cur; },
    add: function (c, dict) { DICT[c] = dict; },
    /* le catalogue donne les vrais chiffres ; on les rediffuse dans les 12 langues */
    chiffres: function (produits, marques) {
      if (produits > 0) NUM.p = produits;
      if (marques > 0) NUM.b = marques;
      fire();
    }
  };

  /* ---------- demarrage ---------- */
  var want = pick();
  function boot() {
    buildPicker();
    /* le francais sert toujours de filet : on le charge, puis la langue voulue */
    load('fr', function () {
      if (want === 'fr') { cur = 'fr'; fire(); done(); return; }
      load(want, function () { cur = DICT[want] ? want : 'fr'; fire(); done(); });
    });
  }
  function done() { d.documentElement.classList.remove('vy-wait'); }

  if (want !== 'fr') {
    d.documentElement.classList.add('vy-wait');
    var g = d.createElement('style'); g.textContent = 'html.vy-wait body{visibility:hidden}';
    (d.head || d.documentElement).appendChild(g);
    setTimeout(done, 1200); /* garde-fou : jamais de page blanche */
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot);
  else boot();

})(window, document);
