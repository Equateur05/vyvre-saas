/* VYVRE — contrôle de la lumière (11/10/2026), gratuit pour tous.
   À la fin d'un scan de peau, on garde une petite empreinte de la lumière : 8 chiffres, aucune image,
   tirés de ce que le moteur a déjà mesuré (rien n'est recalculé, aucune mesure n'est modifiée) :
     0 intensité  : luminance moyenne des images acceptées (raw.avgLum, en %)
     1 L* joues   : clarté moyenne des joues (raw.L)
     2 b* joues   : teinte jaune-bleu des joues (raw.b) ; a* est exclu exprès, il porte les rougeurs
     3 côté       : écart de clarté joue gauche / joue droite (contour des yeux, yeux.cernes.detail)
     4 reflets    : part des pixels de joue saturés (≥ 250), en %
     5 netteté    : note de netteté du contrôle qualité (raw.qualityBreakdown.sharpness)
     6 distance   : largeur du visage / largeur de l'image, en %
     7 angle      : lacet estimé (nez contre milieu des yeux), en degrés
   plus l'heure du scan. Au scan suivant, on compare et on affiche un verdict discret :
   « comparable », « lumière différente, à confirmer » ou « trop différente pour comparer ».
   Un scan refusé n'écrit rien (window.vyvreLastScanResult reste vide).
   Seuils de départ (étude du 11/10) à caler sur de vrais essais : même visage, lumière qui change. */
(function(){
  'use strict';
  var CLE = 'vyvre_lumiere';
  var T = {
    fr:{k:'Lumière', ok:'Comparable', mid:'Lumière différente, à confirmer', ko:'Trop différente pour comparer', vs:'par rapport au scan du {d}', first:'Empreinte de lumière gardée pour le prochain scan, sans aucune image.', guide:'Pour un suivi fiable : même heure, même endroit, même lumière, face à une fenêtre.'},
    en:{k:'Light', ok:'Comparable', mid:'Different light, to be confirmed', ko:'Too different to compare', vs:'compared with your scan of {d}', first:'Light fingerprint kept for your next scan, with no image.', guide:'For reliable tracking: same time, same place, same light, facing a window.'},
    es:{k:'Luz', ok:'Comparable', mid:'Luz distinta, por confirmar', ko:'Demasiado distinta para comparar', vs:'respecto a su escaneo del {d}', first:'Huella de luz guardada para el próximo escaneo, sin ninguna imagen.', guide:'Para un seguimiento fiable: misma hora, mismo lugar, misma luz, frente a una ventana.'},
    it:{k:'Luce', ok:'Confrontabile', mid:'Luce diversa, da confermare', ko:'Troppo diversa per confrontare', vs:'rispetto alla scansione del {d}', first:'Impronta di luce conservata per la prossima scansione, senza alcuna immagine.', guide:'Per un monitoraggio affidabile: stessa ora, stesso posto, stessa luce, di fronte a una finestra.'},
    de:{k:'Licht', ok:'Vergleichbar', mid:'Anderes Licht, bitte bestätigen', ko:'Zu verschieden zum Vergleichen', vs:'gegenüber Ihrer Analyse vom {d}', first:'Lichtprofil für die nächste Analyse gespeichert, ganz ohne Bild.', guide:'Für einen verlässlichen Verlauf: gleiche Uhrzeit, gleicher Ort, gleiches Licht, vor einem Fenster.'},
    pt:{k:'Luz', ok:'Comparável', mid:'Luz diferente, a confirmar', ko:'Demasiado diferente para comparar', vs:'em relação ao scan de {d}', first:'Impressão de luz guardada para o próximo scan, sem nenhuma imagem.', guide:'Para um acompanhamento fiável: mesma hora, mesmo lugar, mesma luz, de frente para uma janela.'},
    nl:{k:'Licht', ok:'Vergelijkbaar', mid:'Ander licht, nog te bevestigen', ko:'Te verschillend om te vergelijken', vs:'ten opzichte van uw scan van {d}', first:'Lichtprofiel bewaard voor uw volgende scan, zonder enig beeld.', guide:'Voor een betrouwbare opvolging: zelfde uur, zelfde plek, zelfde licht, voor een raam.'},
    ru:{k:'Свет', ok:'Сопоставимо', mid:'Другой свет, нужно подтвердить', ko:'Свет слишком разный для сравнения', vs:'по сравнению с анализом от {d}', first:'Световой отпечаток сохранён для следующего анализа, без единого изображения.', guide:'Для надёжного отслеживания: то же время, то же место, тот же свет, лицом к окну.'},
    ar:{k:'الإضاءة', ok:'قابل للمقارنة', mid:'إضاءة مختلفة، يلزم التأكيد', ko:'مختلفة جدًا للمقارنة', vs:'مقارنةً بمسح {d}', first:'حُفظت بصمة الإضاءة للمسح القادم، دون أي صورة.', guide:'لمتابعة موثوقة: الساعة نفسها، المكان نفسه، الإضاءة نفسها، مقابل نافذة.'},
    ja:{k:'光', ok:'比較できます', mid:'光の条件が異なります（要確認）', ko:'条件が違いすぎて比較できません', vs:'{d}のスキャンとの比較', first:'光の記録を次回のために保存しました（画像は保存しません）。', guide:'正確に記録するには：同じ時間、同じ場所、同じ光で、窓に向かって。'},
    ko:{k:'조명', ok:'비교 가능', mid:'조명이 다릅니다, 확인 필요', ko:'조명이 너무 달라 비교할 수 없습니다', vs:'{d} 스캔과 비교', first:'다음 스캔을 위해 조명 기록을 저장했습니다. 이미지는 저장하지 않습니다.', guide:'정확한 추적을 위해: 같은 시간, 같은 장소, 같은 조명, 창문을 마주하고.'},
    zh:{k:'光线', ok:'可以比较', mid:'光线不同，有待确认', ko:'光线差异太大，无法比较', vs:'与 {d} 的扫描相比', first:'已为下次扫描保存光线指纹，不保存任何图像。', guide:'为了可靠追踪：同一时间、同一地点、同样的光线，面向窗户。'}
  };
  function langue(){ try { return (window.VY && VY.lang) || document.documentElement.lang || 'fr'; } catch(e){ return 'fr'; } }
  function txt(){ var l = String(langue()).slice(0, 2); return T[l] || T.fr; }
  function n(v){ var x = Number(v); return isFinite(x) ? x : null; }
  function r1(v){ return v == null ? null : Math.round(v * 10) / 10; }

  /* ---------- l'empreinte : 8 chiffres lus dans le résultat du moteur ---------- */
  function empreinte(r){
    var raw = r && r.raw; if (!raw || n(raw.L) == null) return null;
    var lum = n(raw.avgLum) != null ? raw.avgLum * 100 : null;
    var cote = null;
    try {
      var y = r.yeux || (r.scores && r.scores.yeux), d = y && y.cernes && y.cernes.detail;
      if (d && d.gauche && d.droite && n(d.gauche.Ljoue) != null && n(d.droite.Ljoue) != null) cote = d.gauche.Ljoue - d.droite.Ljoue;
    } catch(e){}
    var refl = null, J = raw._joues;
    if (J && J.length){ var s = 0; for (var i = 0; i < J.length; i++){ var p = J[i]; if (p && (p.r >= 250 || p.g >= 250 || p.b >= 250)) s++; } refl = 100 * s / J.length; }
    var net = raw.qualityBreakdown ? n(raw.qualityBreakdown.sharpness) : null;
    var dist = null, ang = null, f = raw._frame;
    try {
      if (f && f.roi && f.imageData && f.imageData.width) dist = 100 * f.roi.w / f.imageData.width;
      var lm = f && f.landmarks;
      if (lm && lm.length >= 46){ var a = lm[36], b = lm[45], c = lm[30], span = Math.abs(b.x - a.x); if (span > 0) ang = Math.atan(((c.x - (a.x + b.x) / 2) / span) * 2) * 180 / Math.PI; }
    } catch(e){}
    return { v:1, t:Date.now(), e:[lum, raw.L, raw.b, cote, refl, net, dist, ang].map(function(x){ return r1(n(x)); }) };
  }

  /* ---------- la comparaison ---------- */
  function ecart(x, y){ return (x == null || y == null) ? null : Math.abs(y - x); }
  function relatif(x, y){ return (x == null || y == null || x <= 0) ? null : Math.abs(y - x) / x; }
  function heures(ta, tb){ var a = new Date(ta), b = new Date(tb); var h = Math.abs((a.getHours() + a.getMinutes() / 60) - (b.getHours() + b.getMinutes() / 60)); return Math.min(h, 24 - h); }
  function verdict(av, ap){
    var A = av.e, B = ap.e, fort = 0, moyen = 0, d;
    function seuil(v, m, f){ if (v == null) return; if (v > f) fort++; else if (v > m) moyen++; }
    seuil(relatif(A[0], B[0]), 0.15, 0.30);   /* intensité : ±15 %, au-delà de 30 % trop différent */
    seuil(ecart(A[1], B[1]), 5, 10);          /* L* des joues */
    seuil(ecart(A[2], B[2]), 5, 10);          /* b* des joues */
    seuil(ecart(A[3], B[3]), 5, 10);          /* côté de la lumière */
    seuil(ecart(A[4], B[4]), 3, 8);           /* reflets, en points */
    /* indicatifs : ils ne rendent jamais un scan incomparable à eux seuls */
    d = ecart(A[5], B[5]); if (d != null && d > 30) moyen++;
    d = relatif(A[6], B[6]); if (d != null && d > 0.30) moyen++;
    d = ecart(A[7], B[7]); if (d != null && d > 12) moyen++;
    if (av.t && ap.t && heures(av.t, ap.t) > 2) moyen++;
    return fort ? 'ko' : (moyen ? 'mid' : 'ok');
  }

  function lire(){ try { var o = JSON.parse(localStorage.getItem(CLE) || 'null'); return o && Array.isArray(o.e) && o.e.length === 8 ? o : null; } catch(e){ return null; } }
  function ecrire(o){ try { localStorage.setItem(CLE, JSON.stringify(o)); } catch(e){} }

  /* une seule comparaison par résultat de scan, même si la page se repeint (langue, etc.) */
  var dernier = null, etat = null;
  function etatPour(r){
    if (r === dernier) return etat;
    dernier = r; etat = { v:'none' };
    var e = empreinte(r); if (!e) return etat;
    var av = lire();
    etat = av ? { v:verdict(av, e), t:av.t } : { v:'first' };
    ecrire(e);
    window.__vyLumiere = { empreinte:e, avant:av, verdict:etat.v };   /* pour les bancs d'essai */
    return etat;
  }

  /* ---------- l'affichage : une ligne dans la lecture, sous le texte ---------- */
  var CSS = '.sg-verdict>.vy-lum{grid-column:1/-1}.vy-lum{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,.08);font-family:Inter,system-ui,sans-serif;text-align:start}' +
    '.vy-lum .l1{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px}' +
    '.vy-lum .k{display:inline-flex;align-items:center;gap:7px;font:400 9px/1 "JetBrains Mono",monospace;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.5)}' +
    '.vy-lum .k i{width:6px;height:6px;border-radius:50%;background:#d9c9a3;box-shadow:0 0 8px currentColor}' +
    '.vy-lum[data-v="ok"] .k i{background:#7FE0A7;color:rgba(127,224,167,.6)}' +
    '.vy-lum[data-v="mid"] .k i{background:#d9c9a3;color:rgba(217,201,163,.6)}' +
    '.vy-lum[data-v="ko"] .k i{background:#e8a3a3;color:rgba(232,163,163,.6)}' +
    '.vy-lum[data-v="first"] .k i,.vy-lum[data-v="none"] .k i{background:rgba(255,255,255,.4);color:transparent}' +
    '.vy-lum .v{font-size:13px;font-weight:400;color:#fff}' +
    '.vy-lum .d{font-size:12px;font-weight:300;color:rgba(255,255,255,.5)}' +
    '.vy-lum .g{margin:6px 0 0!important;font-size:12px!important;line-height:1.5!important;font-weight:300!important;color:rgba(255,255,255,.55)!important}';

  function dateCourte(t){ try { return new Date(t).toLocaleDateString(langue(), { day:'numeric', month:'short' }); } catch(e){ return new Date(t).toLocaleDateString(); } }

  function peindre(boite, st){
    var m = txt(), el = boite.querySelector('.vy-lum');
    if (!el){ el = document.createElement('div'); el.className = 'vy-lum'; el.setAttribute('role', 'status'); boite.appendChild(el); }
    el.setAttribute('data-v', st.v);
    var l1 = '<div class="l1"><span class="k"><i></i>' + m.k + '</span>';
    if (st.v === 'ok' || st.v === 'mid' || st.v === 'ko') l1 += '<span class="v">' + m[st.v] + '</span><span class="d">' + m.vs.replace('{d}', dateCourte(st.t)) + '</span>';
    else if (st.v === 'first') l1 += '<span class="d">' + m.first + '</span>';
    l1 += '</div>';
    el.innerHTML = l1 + '<p class="g">' + m.guide + '</p>';
  }

  function cible(){ return document.querySelector('#view-results .sg-verdict') || null; }
  function tour(){
    var res = document.getElementById('view-results'), r = window.vyvreLastScanResult;
    if (!res || !res.classList.contains('active') || !r || !r.scores) return;
    var b = cible(); if (!b) return;
    var st = etatPour(r);
    if (!b.querySelector('.vy-lum') || b.querySelector('.vy-lum').getAttribute('data-v') !== st.v) peindre(b, st);
  }
  function monter(){
    if (!document.getElementById('vy-lum-css')){ var s = document.createElement('style'); s.id = 'vy-lum-css'; s.textContent = CSS; document.head.appendChild(s); }
    setInterval(tour, 700);
    document.addEventListener('vy:lang', function(){ var b = cible(); if (b && b.querySelector('.vy-lum') && dernier) peindre(b, etat); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', monter); else monter();

  window.VY_LUMIERE = { empreinte:empreinte, verdict:verdict, cle:CLE };
})();
