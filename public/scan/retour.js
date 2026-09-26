/* 26/09 : un moyen de revenir en arriere sur chaque ecran du scan (camera, calcul, resultats).
   Avant : aucun bouton, le logo n'etait pas un lien. On recharge la page d'accueil du scan :
   c'est ce qui coupe proprement la camera et les minuteries en cours. */
(function(){
  var TXT={fr:['Retour','Nouveau scan','Accueil'],en:['Back','New scan','Home'],es:['Volver','Nuevo escaneo','Inicio'],it:['Indietro','Nuova scansione','Home'],
    de:['Zurück','Neuer Scan','Startseite'],pt:['Voltar','Novo scan','Início'],nl:['Terug','Nieuwe scan','Home'],ru:['Назад','Новое сканирование','Главная'],
    ar:['رجوع','فحص جديد','الرئيسية'],ja:['戻る','新しいスキャン','ホーム'],ko:['이전','새 스캔','홈'],zh:['返回','重新扫描','首页']};
  function lang(){ var l=(window.VY&&VY.lang)||'fr'; return TXT[l]?l:'fr'; }
  var css=document.createElement('style');
  css.textContent='#vy-retour{position:fixed;left:max(16px,2.4%);top:112px;z-index:45;display:none;align-items:center;gap:10px;appearance:none;cursor:pointer;'+
    'padding:11px 18px 11px 14px;border-radius:100px;font:300 13px Inter,sans-serif;letter-spacing:.01em;color:rgba(255,255,255,.86);'+
    'background:rgba(10,11,16,.42);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);'+
    'box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 16px 40px -20px rgba(0,0,0,.8);transition:background .4s,border-color .4s,transform .4s}'+
    '#vy-retour:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.35);transform:translateX(-2px)}'+
    '#vy-retour i{font-style:normal;font-size:15px;line-height:1}'+
    '[dir=rtl] #vy-retour{left:auto;right:max(16px,2.4%)}[dir=rtl] #vy-retour i{transform:scaleX(-1)}'+
    '.brand{cursor:pointer}'+
    '@media (max-width:640px){#vy-retour{top:auto;bottom:calc(18px + env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);padding:10px 16px 10px 12px}#vy-retour:hover{transform:translateX(-50%)}[dir=rtl] #vy-retour{right:auto;left:50%}}';
  document.head.appendChild(css);
  var b=document.createElement('button'); b.id='vy-retour'; b.type='button';
  function accueil(){ location.href=location.pathname+location.search.replace(/[?&]v=\d+/,''); }
  b.onclick=accueil;
  function vue(){ var a=document.querySelector('.view-state.active'); return a?a.id:'view-hero'; }
  function peindre(){
    var v=vue(), t=TXT[lang()];
    b.style.display=v==='view-hero'?'none':'inline-flex';
    b.innerHTML='<i>&#8592;</i>'+(v==='view-results'?t[1]:t[0]);
    b.setAttribute('aria-label', v==='view-results'?t[1]:t[0]);
  }
  function brancher(){
    document.body.appendChild(b); peindre();
    var o=new MutationObserver(peindre);
    document.querySelectorAll('.view-state').forEach(function(el){ o.observe(el,{attributes:true,attributeFilter:['class']}); });
    /* le logo ramene a l'accueil du scan */
    var br=document.querySelector('.brand');
    if(br){ br.setAttribute('role','link'); br.setAttribute('tabindex','0'); br.setAttribute('title',TXT[lang()][2]);
      br.addEventListener('click',accueil); br.addEventListener('keydown',function(e){ if(e.key==='Enter') accueil(); }); }
    addEventListener('vy:lang',peindre);
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',brancher); else brancher();
})();
