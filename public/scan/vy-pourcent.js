/* 11/10 (Charles) : la pastille « 47 % » pendant la lecture, comme celle de ChatGPT quand il genere une image.
   Elle suit les vrais evenements du moteur (VYVRE_SCAN_ENGINE.runRealScanWithFeedback) :
     placement du visage ('positioning', progress 0..1)  ->  0 a 20 %
     images ('capturing' puis 'analyzing' < 0.5)         -> 20 a 90 % (le moteur ne dit pas quelle image il lit :
                                                            on avance au temps, sans jamais atteindre 90 avant la fin des images)
     calcul ('analyzing' 0.5 .. 0.95)                    -> 90 a 99 %
   (repartition demandee : 20 / 70 / 99 ; mesuree au banc d'essai : placement ~2 s, images ~4-5 s, calcul quasi nul
    sans l'age ; avec 70 % on restait bloque vers 57 % puis on sautait a 100 %, d'ou 90 %)
     'done'                                              -> 100 %, puis la pastille s'efface
   Le chiffre ne recule jamais pendant une lecture, repart de 0 a une nouvelle tentative, et s'efface en cas d'echec.
   Une seule mise a jour de texte par changement de chiffre ; aucune lecture de mise en page.
   Usage : var p = VyPourcent.creer({ parent, classe, dureeImages });  var suivre = p.lecture();  moteur(..., suivre, ...)
           p.echec()  p.rattacher(parent, classe) */
(function () {
  if (window.VyPourcent) return;
  var SEP = ' ';   /* espace fine insecable : « 47 % » */
  var CSS = '.vy-pct{position:absolute;left:50%;bottom:16px;z-index:9;transform:translate(-50%,3px);box-sizing:border-box;min-width:54px;padding:4px 11px;border-radius:999px;'
    + 'background:rgba(10,11,14,.52);box-shadow:inset 0 0 0 1px rgba(255,255,255,.10);color:#fff;'
    + 'font:300 13px/18px -apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif;font-variant-numeric:tabular-nums;font-feature-settings:"tnum";'
    + 'letter-spacing:.02em;text-align:center;white-space:nowrap;opacity:0;transition:opacity .35s ease,transform .35s ease;pointer-events:none;contain:layout paint style}'
    + '.vy-pct.vy-on{opacity:1;transform:translate(-50%,0)}'
    + '.vy-pct.vy-fin{animation:vyPctFin 1.1s ease forwards}@keyframes vyPctFin{0%,55%{opacity:1}100%{opacity:0}}'
    + '.vy-pct-lu{position:absolute;width:1px;height:1px;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%)}'
    + '@media (prefers-reduced-motion:reduce){.vy-pct{transition:opacity .2s linear;transform:translate(-50%,0)}}';

  function style() {
    if (document.getElementById('vy-pct-style')) return;
    var s = document.createElement('style'); s.id = 'vy-pct-style'; s.textContent = CSS;
    (document.head || document.documentElement).appendChild(s);
  }

  function creer(opts) {
    opts = opts || {};
    style();
    var el = document.createElement('div');
    el.className = 'vy-pct' + (opts.classe ? ' ' + opts.classe : '');
    var n = document.createElement('span'); n.setAttribute('aria-hidden', 'true');
    var txt = document.createTextNode('0' + SEP + '%'); n.appendChild(txt);
    var lu = document.createElement('span'); lu.className = 'vy-pct-lu';
    lu.setAttribute('role', 'status'); lu.setAttribute('aria-live', 'polite'); lu.setAttribute('aria-atomic', 'true');
    el.appendChild(n); el.appendChild(lu);
    if (opts.parent) opts.parent.appendChild(el);
    el.addEventListener('animationend', function () { if (finie) el.classList.remove('vy-on', 'vy-fin'); });

    var dureeImages = opts.dureeImages || 4800;
    var gen = 0, cible = 0, vu = 0, aff = 0, annonce = 0, etape = '', tEtape = 0, finie = false, timer = 0;

    function stop() { if (timer) { clearInterval(timer); timer = 0; } }
    function afficher(v) {
      if (v === aff) return;
      aff = v; txt.nodeValue = v + SEP + '%';
      var d = Math.floor(v / 10) * 10;   /* lecteur d'ecran : au plus une annonce tous les 10 % */
      if (d > annonce) { annonce = d; lu.textContent = d + SEP + '%'; }
    }
    function tick() {
      var now = performance.now(), c = cible, k;
      if (etape === 'images') { k = (now - tEtape) / dureeImages; c = Math.max(c, 22 + 68 * (1 - Math.exp(-1.7 * k))); }        /* 22 -> 90, 78 % a la duree attendue */
      else if (etape === 'calcul') { k = (now - tEtape) / 3000; c = Math.max(c, cible + (98 - cible) * 0.5 * (1 - Math.exp(-k))); }
      if (c > vu) vu = Math.min(c, vu + Math.max(0.3, (c - vu) * 0.2));
      afficher(Math.min(99, Math.floor(vu)));
    }

    var api = {
      el: el,
      /* nouvelle lecture : remise a 0, la pastille apparait en fondu ; rend le rappel a donner au moteur */
      lecture: function () {
        var g = ++gen;
        stop(); el.classList.remove('vy-fin');
        cible = 0; vu = 0; etape = 'placement'; finie = false; annonce = 0;
        aff = -1; afficher(0);
        el.classList.add('vy-on');
        timer = setInterval(tick, 80);
        return function (evt) {
          if (g !== gen || !evt || finie) return;
          var p = evt.phase;
          if (p === 'positioning') { cible = Math.max(cible, 20 * Math.min(1, +evt.progress || 0)); }
          else if (p === 'capturing') { cible = Math.max(cible, 20 + (3 - Math.min(3, +evt.countdown || 0)) * 0.7); }
          else if (p === 'analyzing') {
            var q = +evt.progress || 0;
            if (q < 0.5) { if (etape !== 'images') { etape = 'images'; tEtape = performance.now(); } cible = Math.max(cible, 22); }
            else { etape = 'calcul'; tEtape = performance.now(); cible = Math.max(cible, 90 + (Math.min(0.95, q) - 0.5) / 0.45 * 8); }   /* 0.5:90 0.7:93.6 0.85:96.2 0.95:98 */
          }
          else if (p === 'done') {
            /* 100 % tout de suite : juste apres, la page des resultats occupe le processeur plusieurs secondes ;
               le fondu de sortie est une animation CSS, il part des que l'ecran se redessine */
            finie = true; cible = vu = 100; stop(); afficher(100); el.classList.add('vy-fin');
          }
          else if (p === 'rejected' || p === 'error') { api.echec(); }
        };
      },
      /* echec ou abandon : la pastille s'efface, les evenements de cette lecture sont ignores */
      echec: function () {
        gen++; stop(); finie = false; etape = '';
        el.classList.remove('vy-on', 'vy-fin');
      },
      /* la meme pastille change de place (changement d'ecran) sans perdre son chiffre */
      rattacher: function (parent, classe) {
        if (!parent) return;
        if (opts.classe) el.classList.remove(opts.classe);
        opts.classe = classe || '';
        if (classe) el.classList.add(classe);
        if (el.parentNode !== parent) parent.appendChild(el);
      },
      active: function () { return !!timer; }
    };
    return api;
  }

  window.VyPourcent = { creer: creer };
})();
