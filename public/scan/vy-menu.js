/* 30/09 : le menu de vyvre.fr, en haut a droite (propale G choisie par Charles).
   Un petit selecteur Peau | Cheveux | Aliment, la langue, puis un bouton qui ouvre le reste
   (Manifeste, Methode, Pour les marques), repris tel quel de l'ancien menu et de ses traductions. */
(function(){
  var MOTS = {
    fr:['Peau','Cheveux','Aliment','Menu','Fermer'], en:['Skin','Hair','Food','Menu','Close'],
    es:['Piel','Cabello','Alimentos','Menú','Cerrar'], de:['Haut','Haare','Ernährung','Menü','Schließen'],
    it:['Pelle','Capelli','Alimenti','Menu','Chiudi'], pt:['Pele','Cabelo','Alimentos','Menu','Fechar'],
    nl:['Huid','Haar','Voeding','Menu','Sluiten'], ru:['Кожа','Волосы','Питание','Меню','Закрыть'],
    ar:['البشرة','الشعر','الغذاء','القائمة','إغلاق'], zh:['肌肤','头发','饮食','菜单','关闭'],
    ja:['肌','髪','食','メニュー','閉じる'], ko:['피부','모발','식단','메뉴','닫기'] };
  var LIENS = ['/scan/', '/cheveux', '/aliment'];
  var CSS =
    'header .vy-menu{display:none!important}' +
    'header .brand{width:100%}' +
    '@media (max-width:560px){header .brand .brand-x,header .brand .brand-partner{display:none!important}header .brand{flex-wrap:nowrap!important}}' +
    '#vy-mn{margin-left:auto;display:flex;align-items:center;gap:12px;position:relative;z-index:310}' +
    '[dir="rtl"] #vy-mn{margin-left:0;margin-right:auto}' +
    '#vy-mn .sc{display:flex;align-items:center;padding:3px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.04)}' +
    '#vy-mn .sc a{font:400 12.5px/1 Inter,system-ui,sans-serif;color:rgba(255,255,255,.72);text-decoration:none;padding:9px 12px;border-radius:999px;letter-spacing:.01em;white-space:nowrap}' +
    '#vy-mn .sc a:hover{color:#fff}' +
    '#vy-mn .sc a.on{background:#fff;color:#111}' +
    '#vy-mn .burger{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.05);display:grid;place-items:center;cursor:pointer;padding:0}' +
    '#vy-mn .burger i{display:block;width:15px;height:7px;border-top:1.3px solid #fff;border-bottom:1.3px solid #fff;transition:transform .3s}' +
    '#vy-mn .burger[aria-expanded="true"] i{transform:scaleX(.6)}' +
    '#vy-mn #vy-lang{position:static!important;inset:auto!important;transform:none!important;margin:0!important;opacity:1!important;pointer-events:auto!important}' +
    '#vy-mn #vy-lang ul{top:calc(100% + 10px)!important;bottom:auto!important;right:0!important;left:auto!important}' +
    '#vy-mv{position:fixed;inset:0;z-index:300;background:rgba(5,5,6,.95);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);opacity:0;visibility:hidden;transition:opacity .35s,visibility .35s;padding:140px 28px 0;font-family:Inter,system-ui,sans-serif}' +
    '#vy-mv.on{opacity:1;visibility:visible}' +
    '#vy-mv .x{position:absolute;top:calc(env(safe-area-inset-top) + 34px);right:max(20px,4vw);height:44px;padding:0 20px;border-radius:999px;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.06);color:#fff;font:400 13px/1 Inter,system-ui,sans-serif;letter-spacing:.04em;cursor:pointer}' +
    '[dir="rtl"] #vy-mv .x{right:auto;left:max(20px,4vw)}' +
    '#vy-mv a{display:flex;justify-content:space-between;align-items:baseline;color:#fff;text-decoration:none;font-weight:200;font-size:30px;letter-spacing:-.02em;padding:16px 0;border-bottom:1px solid rgba(255,255,255,.12);max-width:720px;margin:0 auto}' +
    '#vy-mv a span{font:500 11px "IBM Plex Mono",monospace;color:#d9c9a3;letter-spacing:.2em}' +
    '@media (max-width:420px){#vy-mn{gap:8px}#vy-mn .sc a{font-size:12px;padding:8px 9px}#vy-mn .burger{width:36px;height:36px}}';

  function langue(){ try { return (window.VY && VY.lang) || document.documentElement.lang || 'fr'; } catch(e){ return 'fr'; } }
  function mots(){ return MOTS[langue()] || MOTS.fr; }

  function monter(){
    var brand = document.querySelector('header .brand'), ancien = document.querySelector('header .vy-menu');
    if(!brand || document.getElementById('vy-mn')) return;
    var st = document.createElement('style'); st.id = 'vy-mn-css'; st.textContent = CSS; document.head.appendChild(st);
    var ici = location.pathname.indexOf('/cheveux') === 0 ? 1 : location.pathname.indexOf('/aliment') === 0 ? 2 : 0;
    var d = document.createElement('div'); d.id = 'vy-mn';
    d.innerHTML = '<nav class="sc" aria-label="Scans">' + LIENS.map(function(h, k){ return '<a href="' + h + '"' + (k === ici ? ' class="on" aria-current="page"' : '') + '></a>'; }).join('') + '</nav>' +
      '<button type="button" class="burger" aria-expanded="false" aria-controls="vy-mv"><i></i></button>';
    brand.appendChild(d);
    /* le logo (.brand) ramene a l'accueil (retour.js) : les clics du menu ne doivent pas remonter jusqu'a lui */
    ['click', 'keydown'].forEach(function(t){ d.addEventListener(t, function(e){ e.stopPropagation(); }); });
    /* le reste de l'ancien menu (sans le scan cheveux, deja dans le selecteur), avec ses traductions */
    var v = document.createElement('div'); v.id = 'vy-mv'; v.setAttribute('role', 'dialog'); v.setAttribute('aria-modal', 'true');
    var x = document.createElement('button'); x.type = 'button'; x.className = 'x'; v.appendChild(x);
    var k = 0;
    (ancien ? [].slice.call(ancien.querySelectorAll('a')) : []).forEach(function(a){
      if(/\/cheveux/.test(a.getAttribute('href'))) return;
      var c = document.createElement('a'), t = document.createElement('b'), n = document.createElement('span'); c.href = a.getAttribute('href'); t.style.fontWeight = 'inherit'; t.textContent = a.textContent; if(a.dataset.i18n) t.setAttribute('data-i18n', a.dataset.i18n); n.textContent = String(++k).padStart(2, '0'); c.appendChild(t); c.appendChild(n); v.appendChild(c);
    });
    document.body.appendChild(v);
    var b = d.querySelector('.burger');
    function basculer(on){ v.classList.toggle('on', on); b.setAttribute('aria-expanded', on ? 'true' : 'false'); b.setAttribute('aria-label', mots()[on ? 4 : 3]); }
    b.addEventListener('click', function(){ basculer(!v.classList.contains('on')); });
    v.addEventListener('click', function(e){ if(e.target === v || e.target === x || e.target.closest('a')) basculer(false); });
    addEventListener('keydown', function(e){ if(e.key === 'Escape') basculer(false); });
    textes(); basculer(false); ranger();
  }
  function textes(){ var m = mots(), x = document.querySelector('#vy-mv .x'); if(x) x.textContent = m[4]; [].forEach.call(document.querySelectorAll('#vy-mn .sc a'), function(a, k){ a.textContent = m[k]; }); }
  /* la langue rejoint la rangee du menu sur grand ecran ; sur telephone elle garde sa place en bas */
  var grand = matchMedia('(min-width:761px)'), origine = null;
  function ranger(){
    var lg = document.getElementById('vy-lang'), d = document.getElementById('vy-mn'); if(!lg || !d) return;
    if(grand.matches){ if(lg.parentNode !== d){ origine = origine || { p:lg.parentNode, s:lg.nextSibling }; d.insertBefore(lg, d.querySelector('.burger')); } }
    else if(origine && lg.parentNode === d){ origine.p.insertBefore(lg, origine.s && origine.s.parentNode === origine.p ? origine.s : null); }
  }
  if(grand.addEventListener) grand.addEventListener('change', ranger);
  document.addEventListener('vy:lang', function(){ textes(); });
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monter); else monter();
  /* le bouton de langue est cree par vy-i18n.js : on le range des qu'il existe */
  var essais = 0; (function attendre(){ if(document.getElementById('vy-lang')) return ranger(); if(++essais < 40) setTimeout(attendre, 100); })();
})();
