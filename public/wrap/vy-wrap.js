/* ===========================================================================
   VYVRE · LE WRAP  (05/10/2026)
   Une story verticale de 5 secondes, a la fin de chaque scan, a partager en
   story (WhatsApp, Instagram, TikTok). Canvas 1080 x 1920 + son synthetise en
   Web Audio (aucun fichier, aucune licence), enregistre par MediaRecorder.

   API :
     VyWrap.ouvrir(donnees)  -> Promise<controleur>
     VyWrap.bouton(fournir)  -> <button> « Créer mon Wrap » (fournir() rend les donnees)
     VyWrap.amorcer()        -> a appeler dans un geste (clic) si ouvrir() vient plus tard

   donnees = { type:'peau'|'cheveux'|'aliment', prenom, titre,
               chiffres:[{label, valeur, unite}], phare:{label, valeur, unite} (sinon chiffres[0]),
               items:[{nom, marque, image, etape, fond}], couleur, exemple }

   Regles : aucune photo du visage, aucun prix, aucun chiffre invente (on ne
   dessine que ce qui arrive dans donnees), pas d'emoji.
   =========================================================================== */
(function(){
  'use strict';
  if (window.VyWrap) return;

  var W = 1080, H = 1920;
  var D = 5.6;            /* la sequence */
  var HOLD = 0.7;         /* l'image de fin tenue avant de reboucler */
  var CYCLE = D + HOLD;
  var FIN_REC = D + 0.3;  /* l'enregistrement s'arrete pendant la tenue de fin */
  var CHAMP = '#d9c9a3';

  var SERIF = '"Didot","Bodoni 72","Bodoni MT","Playfair Display",Georgia,serif';
  var SANS  = '"Inter","Helvetica Neue",Helvetica,Arial,sans-serif';
  var MONO  = '"JetBrains Mono","SF Mono",Menlo,Consolas,monospace';

  var THEMES = {
    peau:    { a:'#c8896a', b:'#ecbcaa', fond:'#0b0706', root:146.83, pad:[0,7,11,14,16], arp:[24,28,31,35] },
    cheveux: { a:'#4560b4', b:'#9db0ea', fond:'#04060d', root:110.00, pad:[0,7,10,14,15], arp:[24,27,31,34] },
    aliment: { a:'#90a87f', b:'#c9d8b6', fond:'#050805', root:196.00, pad:[0,7,9,14,16],  arp:[12,16,19,21] }
  };

  /* ---------------------------------------------------------------- textes */
  var TXT = {
    fr: {
      creer:'Créer mon Wrap', creerSous:'Story vidéo à partager',
      partager:'Partager', enregistrer:'Enregistrer', fermer:'Fermer', son:'Son',
      prep:'Préparation de votre Wrap…', creation:'Création de votre Wrap…',
      pret:'Votre Wrap est prêt.', pretTouchez:'Prêt : touchez Partager',
      partage:'Partagé.', enregistre:'Fichier enregistré sur cet appareil.',
      sansPartage:'Le partage direct n’est pas disponible ici : le fichier a été enregistré.',
      sansVideo:'Cet appareil ne sait pas enregistrer de vidéo. Une image de votre Wrap est prête à la place.',
      erreur:'Le Wrap n’a pas pu être créé. Fermez et réessayez.',
      exemple:'EXEMPLE',
      types:{ peau:'Peau', cheveux:'Cheveux', aliment:'Assiette' },
      wrapDe:'Le Wrap de',
      rituel:function(n, type){ return type === 'aliment' ? 'Mon assiette · ' + n + (n > 1 ? ' aliments' : ' aliment') : 'Mon rituel · ' + n + (n > 1 ? ' gestes' : ' geste'); },
      fin1:'Mon rituel', fin2:'vyvre', site:'vyvre.fr',
      /* D1 a D4 (06/10) */
      d1hook:{ peau:['MA','PEAU,','C’EST…'], cheveux:['MES','CHEVEUX,','C’EST…'], aliment:['MON','ASSIETTE,','C’EST…'] },
      d1cta:['ET TOI,','T’ES QUI ?'], pointFort:'POINT FORT', sur:'SUR',
      couleurs:['BLOND','CHÂTAIN','BRUN','NOIR','ROUX','AUBURN','GRIS'],
      arch:{ hydra:'LA SOURCE', eclat:'LA LUMIÈRE', calme:'LE CALME', pores:'LE GRAIN FIN', sebum:'L’ÉQUILIBRE', unif:'LA TOILE', rides:'LA SOIE', ferme:'LE RESSORT' },
      mien:{ peau:'MA PEAU', cheveux:'MES CHEVEUX', aliment:'MON ASSIETTE' }, top3:'TOP 3', enChiffres:'EN CHIFFRES', enfin:'ET ENFIN',
      d2cta:['ET TON','TOP 3 ?'], d2cta2:['ET','LES TIENS ?'], rang:'N°',
      devine:'DEVINE', d3q:['TU DIS','COMBIEN ?'], plus:'PLUS', moins:'MOINS', reponse:'RÉPONSE', d3b:['T’AVAIS DIT','COMBIEN ?'], d3cta:['À TOI','DE JOUER'],
      d4:'OUVRE MA CARTE', edition:'ÉDITION', d4cta:['MONTRE','LA TIENNE'],
      diagPartage:{ ok:'ok', annule:'annulé', erreur:'erreur', aucun:'aucun', telecharge:'téléchargé (pas de partage)' }
    },
    en: {
      creer:'Create my Wrap', creerSous:'Video story to share',
      partager:'Share', enregistrer:'Save', fermer:'Close', son:'Sound',
      prep:'Preparing your Wrap…', creation:'Creating your Wrap…',
      pret:'Your Wrap is ready.', pretTouchez:'Ready: tap Share',
      partage:'Shared.', enregistre:'File saved on this device.',
      sansPartage:'Direct sharing is not available here: the file has been saved.',
      sansVideo:'This device cannot record video. An image of your Wrap is ready instead.',
      erreur:'The Wrap could not be created. Close and try again.',
      exemple:'EXAMPLE',
      types:{ peau:'Skin', cheveux:'Hair', aliment:'Plate' },
      wrapDe:'The Wrap of',
      rituel:function(n, type){ return type === 'aliment' ? 'My plate · ' + n + (n > 1 ? ' foods' : ' food') : 'My ritual · ' + n + (n > 1 ? ' steps' : ' step'); },
      fin1:'My ritual', fin2:'vyvre', site:'vyvre.fr',
      d1hook:{ peau:['MY','SKIN','IS…'], cheveux:['MY','HAIR','IS…'], aliment:['MY','PLATE','IS…'] },
      d1cta:['AND YOU?','WHO ARE YOU?'], pointFort:'STRONG POINT', sur:'OUT OF',
      couleurs:['BLONDE','CHESTNUT','BROWN','BLACK','RED','AUBURN','GREY'],
      arch:{ hydra:'THE SPRING', eclat:'THE GLOW', calme:'THE CALM', pores:'FINE GRAIN', sebum:'THE BALANCE', unif:'THE CANVAS', rides:'THE SILK', ferme:'THE BOUNCE' },
      mien:{ peau:'MY SKIN', cheveux:'MY HAIR', aliment:'MY PLATE' }, top3:'TOP 3', enChiffres:'IN NUMBERS', enfin:'AND FINALLY',
      d2cta:['YOUR','TOP 3?'], d2cta2:['AND','YOURS?'], rang:'#',
      devine:'GUESS', d3q:['YOUR','GUESS?'], plus:'HIGHER', moins:'LOWER', reponse:'ANSWER', d3b:['WHAT WAS','YOUR GUESS?'], d3cta:['YOUR','TURN'],
      d4:'OPEN MY CARD', edition:'EDITION', d4cta:['SHOW','YOURS'],
      diagPartage:{ ok:'ok', annule:'cancelled', erreur:'error', aucun:'none', telecharge:'downloaded (no share)' }
    }
  };
  function langue(){
    var l = '';
    try { l = (window.VY && window.VY.lang) || document.documentElement.lang || 'fr'; } catch(e){ l = 'fr'; }
    l = String(l).slice(0, 2).toLowerCase();
    return TXT[l] ? l : 'en';
  }
  function T(){ return TXT[langue()]; }

  /* ---------------------------------------------------------------- outils */
  function clamp(v, a, b){ return v < a ? a : (v > b ? b : v); }
  function seg(t, a, b){ return clamp((t - a) / (b - a), 0, 1); }
  function lerp(a, b, p){ return a + (b - a) * p; }
  function eOut3(p){ return 1 - Math.pow(1 - p, 3); }
  function eIn3(p){ return p * p * p; }
  function eInOut(p){ return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function eOutExpo(p){ return p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
  function hexRgb(h){ h = String(h || '').replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); var n = parseInt(h, 16); if (!isFinite(n)) return [217, 201, 163]; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgba(c, a){ return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function maj(s){ try { return String(s).toLocaleUpperCase(langue()); } catch(e){ return String(s).toUpperCase(); } }
  function num(v){ var n = Number(v); return isFinite(n) ? n : null; }
  function dateCourte(){ var d = new Date(); function z(n){ return (n < 10 ? '0' : '') + n; } return z(d.getDate()) + '.' + z(d.getMonth() + 1) + '.' + d.getFullYear(); }
  function formate(v, dec){ var s = dec ? v.toFixed(1) : String(Math.round(v)); return langue() === 'fr' ? s.replace('.', ',') : s; }
  function attendre(ms){ return new Promise(function(r){ setTimeout(r, ms); }); }

  /* espacement de lettres a la main (ctx.letterSpacing manque sur une partie des Safari) */
  function espace(x, txt, cx, y, sp, align){
    txt = String(txt); var w = 0, ws = [];
    for (var i = 0; i < txt.length; i++){ var m = x.measureText(txt[i]).width; ws.push(m); w += m + (i < txt.length - 1 ? sp : 0); }
    var px = align === 'left' ? cx : align === 'right' ? cx - w : cx - w / 2;
    var ta = x.textAlign; x.textAlign = 'left';
    for (var j = 0; j < txt.length; j++){ x.fillText(txt[j], px, y); px += ws[j] + sp; }
    x.textAlign = ta; return w;
  }
  /* texte espace qui doit tenir dans une largeur : on serre l'espacement, puis la taille */
  function espaceTenu(x, txt, cx, y, sp, maxW, poids, size, fam, align){
    txt = String(txt); var s = size, e = sp;
    function largeur(){ x.font = poids + ' ' + s + 'px ' + fam; return x.measureText(txt).width + e * (txt.length - 1); }
    while (largeur() > maxW && e > sp * .35) e -= 1;
    while (largeur() > maxW && s > size * .6) s -= 1;
    return espace(x, txt, cx, y, e, align);
  }
  function ajuste(x, txt, style, size, fam, maxW, min){
    var s = size; x.font = style + ' ' + s + 'px ' + fam;
    while (s > (min || 20) && x.measureText(txt).width > maxW){ s -= 4; x.font = style + ' ' + s + 'px ' + fam; }
    return s;
  }
  function lignes(x, txt, maxW, n){
    var mots = String(txt || '').split(/\s+/).filter(Boolean), out = [], cur = '';
    mots.forEach(function(w){ var test = cur ? cur + ' ' + w : w; if (!cur || x.measureText(test).width <= maxW) cur = test; else { out.push(cur); cur = w; } });
    if (cur) out.push(cur);
    if (out.length > n) out = out.slice(0, n - 1).concat([out.slice(n - 1).join(' ')]);
    var last = out.length - 1;
    if (last >= 0 && x.measureText(out[last]).width > maxW){
      var l = out[last]; while (l.length > 1 && x.measureText(l + '…').width > maxW) l = l.slice(0, -1);
      out[last] = l.replace(/[\s,·\-]+$/, '') + '…';
    }
    return out;
  }

  /* ------------------------------------------------------- normalisation */
  function normalise(d){
    d = d || {};
    var type = THEMES[d.type] ? d.type : 'peau';
    var chiffres = (d.chiffres || []).filter(function(c){ return c && c.label && c.valeur !== null && c.valeur !== undefined && c.valeur !== ''; })
      .map(function(c){ return { label:String(c.label), valeur:c.valeur, unite:c.unite ? String(c.unite) : '' }; });
    var phare = d.phare && d.phare.label && num(d.phare.valeur) !== null ? { label:String(d.phare.label), valeur:d.phare.valeur, unite:d.phare.unite || '' } : null;
    if (!phare) phare = chiffres.filter(function(c){ return num(c.valeur) !== null; })[0] || null;
    var autres = chiffres.filter(function(c){ return !phare || !(c.label === phare.label && String(c.valeur) === String(phare.valeur)); }).slice(0, 3);
    var items = (d.items || []).filter(function(it){ return it && it.nom; }).slice(0, 4).map(function(it){
      return { nom:String(it.nom), marque:it.marque ? String(it.marque) : '', image:it.image || '', etape:it.etape ? String(it.etape).replace(/^\s*0?\d+\s*[·.\-]\s*/, '') : '', fond:!!it.fond };
    });
    var prenom = String(d.prenom || '').trim().slice(0, 20);
    if (prenom) prenom = prenom.charAt(0).toLocaleUpperCase() + prenom.slice(1);
    var th = THEMES[type];
    var out = {
      type:type, prenom:prenom, titre:String(d.titre || '').trim(),
      chiffres:chiffres, phare:phare, autres:autres, items:items,
      exemple:!!d.exemple, palette:(d.palette && d.palette in PALETTES) ? d.palette : PAL_DEFAUT, style:/^(A|B|C|D|D[1-4])$/.test(String(d.style || '').toUpperCase()) ? String(d.style).toUpperCase() : 'D',   /* 06/10 : Charles a choisi le D */
      a:hexRgb(d.couleur || th.a), b:hexRgb(d.couleur2 || th.b), fond:th.fond, theme:th
    };
    out.tm = temps(out.style);
    /* les variantes D1 a D4 : ce qu'elles revelent, derive une fois des vraies valeurs (rien d'aleatoire) */
    if (VARIANTES[out.style]){ var L = T(); out.P = profil(out, L); out.G = devinettes(out); out.C3 = compteARebours(out); }
    return out;
  }

  /* ------------------------------------------- D1 a D4 : tempo et donnees */
  /* chaque variante dure exactement 4 mesures (16 temps) a son propre tempo : la fin retombe sur le debut */
  var VARIANTES = { D1:{ bpm:126 }, D2:{ bpm:128 }, D3:{ bpm:140 }, D4:{ bpm:132 } };
  function temps(st){
    var v = VARIANTES[st];
    if (!v) return { D:D, HOLD:HOLD, CYCLE:CYCLE, FIN_REC:FIN_REC, poster:D - .02, boucle:false };
    var b = 60 / v.bpm, dv = 16 * b;
    return { D:dv, HOLD:0, CYCLE:dv, FIN_REC:dv, beat:b, poster:b * 8.6, boucle:true, bpm:v.bpm };
  }
  function est100(c){ return !!c && /100|%/.test(c.unite || ''); }
  function memeChiffre(a, b){ return !!a && !!b && a.label === b.label && String(a.valeur) === String(b.valeur); }
  function valTxt(c){ var n = num(c.valeur); return n !== null ? formate(n, Math.round(n) !== n) : maj(String(c.valeur)); }
  /* l'archetype = le nom du trait le plus haut (peau), la couleur lue (cheveux), « 4 sur 312 » (assiette) */
  var ARCH = [
    ['hydra', /hydra|moist|feucht|hidrat|idrat/i], ['eclat', /[ée]clat|glow|radian|lumin|leucht/i],
    ['calme', /apais|calm|sooth|redness|rougeur/i], ['pores', /pore/i], ['sebum', /s[ée]b|oil|matt/i],
    ['unif', /uniform|even|pigment|teint|tone/i], ['rides', /ride|wrinkl|line|lisse|smooth|textur/i], ['ferme', /ferm|firm|[ée]last/i]
  ];
  function profil(d, L){
    var i, c;
    if (d.type === 'peau'){
      var tr = d.chiffres.filter(function(c){ return num(c.valeur) !== null && est100(c) && !/indice|index|global/i.test(c.label); })
        .sort(function(a, b){ return num(b.valeur) - num(a.valeur); });
      if (tr.length){
        var top = tr[0], cle = null;
        for (i = 0; i < ARCH.length; i++) if (ARCH[i][1].test(top.label)){ cle = ARCH[i][0]; break; }
        var nom = cle ? L.arch[cle] : maj(top.label);
        var roll = ARCH.map(function(r){ return L.arch[r[0]]; }).filter(function(n){ return n !== nom; });
        return { nom:nom, raison:L.pointFort + ' · ' + maj(top.label) + ' ' + valTxt(top) + (top.unite === '/100' ? '/100' : top.unite === '%' ? '%' : ''), roll:roll.concat([nom]) };
      }
    }
    if (d.type === 'cheveux'){
      c = d.chiffres.filter(function(c){ return num(c.valeur) === null; })[0];
      if (c){ var v = maj(String(c.valeur)); return { nom:v, raison:maj(c.label), roll:L.couleurs.filter(function(n){ return n !== v; }).concat([v]) }; }
    }
    if (d.type === 'aliment'){
      var ret = d.chiffres.filter(function(c){ return /retenu|retain|chosen|kept/i.test(c.label) && num(c.valeur) !== null; })[0];
      var rev = d.chiffres.filter(function(c){ return /revue|review/i.test(c.label) && num(c.valeur) !== null; })[0];
      if (ret && rev) return { nom:valTxt(ret) + ' ' + L.sur + ' ' + valTxt(rev), raison:maj(ret.label) + ' · ' + maj(rev.label), roll:d.items.map(function(it){ return maj(it.nom); }).concat([valTxt(ret) + ' ' + L.sur + ' ' + valTxt(rev)]) };
    }
    var p = d.phare || d.chiffres[0];
    if (p) return { nom:valTxt(p) + (p.unite === '/100' ? '/100' : ''), raison:maj(p.label), roll:[valTxt(p)] };
    return { nom:maj(d.titre || T().types[d.type]), raison:'', roll:[maj(d.titre || T().types[d.type])] };
  }
  /* « devine » : trois essais honnetes (dichotomie sur la vraie valeur), puis la reponse */
  function arrondiHaut(n){ var e = Math.pow(10, Math.floor(Math.log(Math.max(1, n)) / Math.LN10)), m = [1, 2, 5, 10]; for (var i = 0; i < m.length; i++) if (m[i] * e >= n) return m[i] * e; return 10 * e; }
  function devinettes(d){
    var p = d.phare, v = p ? num(p.valeur) : null;
    if (v === null) return null;
    var s100 = est100(p), hi = s100 ? 100 : arrondiHaut(Math.max(10, v * 1.6)), lo = 0, out = [];
    var pas = hi >= 1000 ? 50 : hi >= 100 ? 10 : hi >= 20 ? 5 : 1, max = hi;
    for (var i = 0; i < 3; i++){
      var g = Math.round((lo + hi) / 2 / pas) * pas;
      if (g === v){ if (g + pas < hi) g += pas; else if (g - pas > lo) g -= pas; else break; }
      if (g <= lo || g >= hi) break;
      var dir = v > g ? 1 : -1; out.push({ g:g, dir:dir });
      if (dir > 0) lo = g; else hi = g;
    }
    return { v:v, max:max, s100:s100, essais:out };
  }
  /* « compte a rebours » : trois chiffres, puis le chiffre phare. Un « top 3 » seulement s'ils sont vraiment classes */
  function compteARebours(d){
    var reste = d.chiffres.filter(function(c){ return !memeChiffre(c, d.phare); });
    var tous100 = reste.length >= 3 && reste.slice(0, 3).every(function(c){ return num(c.valeur) !== null && est100(c); });
    var trois;
    if (tous100 && d.type === 'peau'){ trois = reste.filter(function(c){ return num(c.valeur) !== null && est100(c); }).sort(function(a, b){ return num(b.valeur) - num(a.valeur); }).slice(0, 3); }
    else { trois = reste.slice(0, 3); tous100 = false; }
    return { trois:trois, classe:tous100 };
  }

  /* ------------------------------------------------------------- images */
  function chargeImage(src){
    return new Promise(function(res){
      if (!src) return res(null);
      var im = new Image(), fini = false;
      function sortie(v){ if (fini) return; fini = true; res(v); }
      try { var u = new URL(src, location.href); if (u.origin !== location.origin) im.crossOrigin = 'anonymous'; } catch(e){}
      var to = setTimeout(function(){ sortie(null); }, 5000);
      im.onload = function(){
        clearTimeout(to);
        if (!im.naturalWidth) return sortie(null);
        /* une image qui salirait le canvas bloquerait la video : on la verifie */
        try { var c = document.createElement('canvas'); c.width = c.height = 2; var g = c.getContext('2d'); g.drawImage(im, 0, 0, 2, 2); g.getImageData(0, 0, 1, 1); } catch(e){ return sortie(null); }
        sortie(im);
      };
      im.onerror = function(){ clearTimeout(to); sortie(null); };
      im.src = src;
    });
  }
  /* la photo detouree, posee une fois pour toutes avec son ombre (l'ombre floue coute cher a chaque image) */
  function preRendu(im, fond){
    var S = 600, k = S / 360, c = document.createElement('canvas'); c.width = S; c.height = S;
    var g = c.getContext('2d');
    g.save(); g.translate(S / 2, S - 34 * k); g.scale(1, .2);
    var sh = g.createRadialGradient(0, 0, 4, 0, 0, 130 * k);
    sh.addColorStop(0, 'rgba(0,0,0,.6)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = sh; g.fillRect(-140 * k, -140 * k, 280 * k, 280 * k); g.restore();
    var bw = (fond ? 250 : 286) * k, bh = (fond ? 270 : 300) * k;
    var r = Math.min(bw / im.naturalWidth, bh / im.naturalHeight), w = im.naturalWidth * r, h = im.naturalHeight * r;
    var x0 = (S - w) / 2, y0 = (S - 40 * k - h);
    if (fond){
      var px = 22 * k, rx = x0 - px, ry = y0 - px, rw = w + 2 * px, rh = h + 2 * px, rr = 26 * k;
      g.save(); g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 30 * k; g.shadowOffsetY = 16 * k;
      g.beginPath(); g.moveTo(rx + rr, ry); g.arcTo(rx + rw, ry, rx + rw, ry + rh, rr); g.arcTo(rx + rw, ry + rh, rx, ry + rh, rr); g.arcTo(rx, ry + rh, rx, ry, rr); g.arcTo(rx, ry, rx + rw, ry, rr); g.closePath();
      g.fillStyle = '#f5f2ec'; g.fill(); g.restore();
      g.drawImage(im, x0, y0, w, h);
    } else {
      g.save(); g.shadowColor = 'rgba(0,0,0,.62)'; g.shadowBlur = 34 * k; g.shadowOffsetY = 20 * k;
      g.drawImage(im, x0, y0, w, h); g.restore();
    }
    c.boite = { x:x0, y:y0, w:w, h:h };
    return c;
  }

  /* ----------------------------------------------------------- le rendu */
  function Rendu(canvas, d){
    this.c = canvas; this.x = canvas.getContext('2d', { alpha:false });
    this.d = d; this.n = 0;
    var L = T(); this.L = L;
    this.date = dateCourte();
    this.typeMot = L.types[d.type];
    /* le fond, calcule une fois : couleur du scan, halo, vignette */
    var b = document.createElement('canvas'); b.width = W; b.height = H; var g = b.getContext('2d');
    g.fillStyle = d.fond; g.fillRect(0, 0, W, H);
    var h1 = g.createRadialGradient(W * .5, H * .44, 40, W * .5, H * .44, 1100);
    h1.addColorStop(0, rgba(d.a, .30)); h1.addColorStop(.45, rgba(d.a, .10)); h1.addColorStop(1, rgba(d.a, 0));
    g.fillStyle = h1; g.fillRect(0, 0, W, H);
    var h2 = g.createRadialGradient(W * .85, H * .08, 10, W * .85, H * .08, 700);
    h2.addColorStop(0, 'rgba(217,201,163,.10)'); h2.addColorStop(1, 'rgba(217,201,163,0)');
    g.fillStyle = h2; g.fillRect(0, 0, W, H);
    var v = g.createRadialGradient(W / 2, H / 2, H * .30, W / 2, H / 2, H * .78);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.78)');
    g.fillStyle = v; g.fillRect(0, 0, W, H);
    this.fond = b;
    /* trois tuiles de grain, tournees a chaque image */
    this.grains = [0, 1, 2].map(function(){
      var t = document.createElement('canvas'); t.width = t.height = 192; var tg = t.getContext('2d');
      var id = tg.createImageData(192, 192), p = id.data;
      for (var i = 0; i < p.length; i += 4){ var v2 = Math.random() * 255 | 0; p[i] = p[i + 1] = p[i + 2] = v2; p[i + 3] = 15; }
      tg.putImageData(id, 0, 0); return t;
    });
    this.motifs = null;
    /* l'empreinte : une forme abstraite tiree des vrais chiffres (aucune photo) */
    var vals = d.chiffres.map(function(c){ var n = num(c.valeur); if (n === null) return null; var u = c.unite || ''; return clamp(/100|%/.test(u) ? n / 100 : n / Math.max(1, n * 1.4), .08, 1); }).filter(function(v){ return v !== null; });
    if (!vals.length) vals = [.6, .8, .5, .7, .9];
    while (vals.length < 5) vals = vals.concat(vals.map(function(v){ return clamp(1.15 - v, .1, 1); }));
    this.vals = vals.slice(0, 9);
    var seed = 0, s = (d.prenom || d.type) + vals.join(','); for (var k = 0; k < s.length; k++) seed = (seed * 31 + s.charCodeAt(k)) % 9973;
    this.phase = seed / 9973 * Math.PI * 2;
    this.imgs = [];
    /* un point doux (bokeh, halo) dessine une fois, reutilise partout */
    var sp = document.createElement('canvas'); sp.width = sp.height = 64; var sg = sp.getContext('2d');
    var rg = sg.createRadialGradient(32, 32, 0, 32, 32, 32); rg.addColorStop(0, 'rgba(255,246,226,1)'); rg.addColorStop(.35, 'rgba(255,240,212,.45)'); rg.addColorStop(1, 'rgba(255,240,212,0)');
    sg.fillStyle = rg; sg.fillRect(0, 0, 64, 64); this.point = sp;
    var spa = document.createElement('canvas'); spa.width = spa.height = 64; var sga = spa.getContext('2d');
    var rga = sga.createRadialGradient(32, 32, 0, 32, 32, 32); rga.addColorStop(0, rgba(d.b, 1)); rga.addColorStop(.4, rgba(d.a, .5)); rga.addColorStop(1, rgba(d.a, 0));
    sga.fillStyle = rga; sga.fillRect(0, 0, 64, 64); this.pointA = spa;
    /* poussiere de lumiere : des particules qui montent lentement, en profondeur */
    var rnd = seed; function r01(){ rnd = (rnd * 16807 + 11) % 2147483647; return rnd / 2147483647; }
    this.parts = [];
    for (var pi = 0; pi < 44; pi++){ var z = .25 + r01() * .75; this.parts.push({ x:r01() * W, y:r01() * H, z:z, s:6 + r01() * 22, v:18 + r01() * 40, ph:r01() * 6.28, c:r01() < .35 }); }
  }
  Rendu.prototype.poussiere = function(t, force){
    var x = this.x; x.save(); x.globalCompositeOperation = 'lighter';
    for (var i = 0; i < this.parts.length; i++){
      var p = this.parts[i], y = ((p.y - t * p.v * p.z) % H + H) % H, px = p.x + Math.sin(t * .5 + p.ph) * 24 * p.z;
      var tw = .55 + .45 * Math.sin(t * 1.7 + p.ph * 3), sz = p.s * p.z * 1.6;
      x.globalAlpha = force * (.05 + .2 * p.z) * tw;
      x.drawImage(p.c ? this.pointA : this.point, px - sz / 2, y - sz / 2, sz, sz);
    }
    x.restore();
  };
  /* la trainee anamorphique, comme une optique de cinema */
  Rendu.prototype.flare = function(cx, cy, p, force){
    if (p <= 0 || p >= 1 || force <= 0) return;
    var x = this.x, a = Math.sin(p * Math.PI) * force, w = lerp(200, 1500, eOut3(p));
    x.save(); x.globalCompositeOperation = 'lighter';
    x.globalAlpha = a * .45; x.drawImage(this.pointA, cx - w / 2, cy - 36, w, 72);
    x.globalAlpha = a * .8; x.drawImage(this.point, cx - w * .35, cy - 5, w * .7, 10);
    x.globalAlpha = a * .35; x.drawImage(this.point, cx - 60, cy - 60, 120, 120);
    x.restore();
  };
  Rendu.prototype.interp = function(th){
    var v = this.vals, N = v.length, u = ((th / (Math.PI * 2)) % 1 + 1) % 1 * N, i = Math.floor(u), f = u - i, s = (1 - Math.cos(Math.PI * f)) / 2;
    return v[i % N] * (1 - s) + v[(i + 1) % N] * s;
  };
  Rendu.prototype.empreinte = function(cx, cy, R, alpha, t, grow){
    if (alpha <= .002 || grow <= .002) return;
    var x = this.x, a = this.d.a, b = this.d.b, ph = this.phase;
    x.save(); x.globalCompositeOperation = 'lighter';
    var cg = x.createRadialGradient(cx, cy, 0, cx, cy, R * grow);
    cg.addColorStop(0, rgba(a, .22 * alpha)); cg.addColorStop(1, rgba(a, 0));
    x.fillStyle = cg; x.fillRect(cx - R * grow, cy - R * grow, R * 2 * grow, R * 2 * grow);
    var NL = 15;
    for (var j = 0; j < NL; j++){
      var s = (.5 + j * .036) * grow, rot = t * .11 + j * .05 + ph, mid = 1 - Math.abs(j - NL / 2) / (NL / 2);
      x.strokeStyle = rgba(j % 3 === 0 ? b : a, alpha * (.06 + .2 * mid));
      x.lineWidth = j % 3 === 0 ? 2.2 : 1.6;
      x.beginPath();
      for (var k = 0; k <= 90; k++){
        var th = k / 90 * Math.PI * 2, vv = this.interp(th + j * .02);
        var r = R * s * (.68 + .32 * vv + .022 * Math.sin(th * 5 + t * 1.2 + j * .45 + ph));
        var px = cx + Math.cos(th + rot) * r, py = cy + Math.sin(th + rot) * r;
        if (k) x.lineTo(px, py); else x.moveTo(px, py);
      }
      x.closePath(); x.stroke();
    }
    x.restore();
  };
  Rendu.prototype.balayage = function(p, alpha){
    if (p <= 0 || p >= 1) return;
    var x = this.x, cx = -500 + p * (W + 1000);
    x.save(); x.globalCompositeOperation = 'lighter'; x.translate(cx, H / 2); x.rotate(-.32);
    var g = x.createLinearGradient(-260, 0, 260, 0);
    g.addColorStop(0, 'rgba(217,201,163,0)'); g.addColorStop(.5, 'rgba(255,240,212,' + alpha + ')'); g.addColorStop(1, 'rgba(217,201,163,0)');
    x.fillStyle = g; x.fillRect(-260, -H, 520, H * 2); x.restore();
  };
  /* le lustre : un degrade qui passe sur la lettre (champagne -> blanc chaud -> champagne) */
  Rendu.prototype.lustre = function(p, base){
    base = base || CHAMP;
    if (p <= 0 || p >= 1) return base;
    var cx = -300 + p * (W + 600), g = this.x.createLinearGradient(cx - 280, 0, cx + 280, 0);
    g.addColorStop(0, base); g.addColorStop(.5, '#fff7e6'); g.addColorStop(1, base);
    return g;
  };
  Rendu.prototype.grain = function(){
    var x = this.x;
    if (!this.motifs){ var self = this; this.motifs = this.grains.map(function(t){ return self.x.createPattern(t, 'repeat'); }); }
    var m = this.motifs[this.n % 3], ox = (Math.random() * 192) | 0, oy = (Math.random() * 192) | 0;
    x.save(); x.translate(-ox, -oy); x.fillStyle = m; x.fillRect(0, 0, W + 192, H + 192); x.restore();
  };

  Rendu.prototype.dessine = function(tAbs){
    var st = this.d.style, K0 = couleurs(this.d); NOIR = K0.noir; BLANC = K0.blanc;
    if (st === 'B') return this.dessineB(tAbs);
    if (st === 'C') return this.dessineC(tAbs);
    if (st === 'D') return this.dessineD(tAbs);
    if (VARIANTES[st]) return this['dessine' + st](tAbs);
    return this.dessineA(tAbs);
  };
  /* ===== A · EDITORIAL LUXE : serif geante, champagne sur noir, lumiere qui balaie */
  Rendu.prototype.dessineA = function(tAbs){
    var x = this.x, d = this.d, L = this.L, t = Math.min(tAbs, D), n = this.n++;
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
    x.drawImage(this.fond, 0, 0);
    /* respiration lente du halo, a la couleur du scan */
    var br = .5 + .5 * Math.sin(tAbs * 1.1);
    var hg = x.createRadialGradient(W / 2, H * .47, 0, W / 2, H * .47, 760);
    hg.addColorStop(0, rgba(d.a, .08 + .05 * br)); hg.addColorStop(1, rgba(d.a, 0));
    x.fillStyle = hg; x.fillRect(0, 0, W, H);
    this.poussiere(tAbs, .55 + .45 * seg(t, .3, 1.2));
    x.textBaseline = 'alphabetic'; x.textAlign = 'center';

    /* ---------- 1 · le logo (0,2 -> 1,35), puis il devient l'en-tete */
    var vol = eInOut(seg(t, 1.0, 1.38));
    var aLogo = eOut3(seg(t, .2, .75));
    var finEntete = 1 - seg(t, 4.6, 4.85);
    if (t < 4.85 && aLogo > 0){
      var sz = lerp(150, 46, vol), sp = lerp(lerp(78, 34, eOut3(seg(t, .2, 1.1))), 20, vol), ly = lerp(985, 168, vol);
      x.globalAlpha = aLogo * (vol < 1 ? 1 : .92) * finEntete;
      x.font = '200 ' + sz + 'px ' + SANS;
      x.fillStyle = this.lustre(seg(t, .45, 1.15));
      espace(x, 'VYVRE', W / 2, ly, sp);
      /* les deux filets qui partent du logo */
      var lw = lerp(0, 400, eOut3(seg(t, .3, 1.0))) * (1 - vol);
      if (lw > 1){
        x.globalAlpha = aLogo * .55 * (1 - vol); x.fillStyle = CHAMP;
        x.fillRect(W / 2 - 40 - lw, ly + 70, lw, 2); x.fillRect(W / 2 + 40, ly + 70, lw, 2);
      }
      /* sous le logo : le type de lecture et la date (la vraie) */
      var aSous = seg(t, .55, .95) * (1 - seg(t, .95, 1.15));
      if (aSous > 0){
        x.globalAlpha = aSous * .8; x.fillStyle = CHAMP; x.font = '400 26px ' + MONO;
        espace(x, maj(this.typeMot) + '  ·  ' + this.date, W / 2, ly + 150, 9);
      }
      if (vol > .6){
        x.globalAlpha = seg(vol, .6, 1) * .55 * finEntete; x.fillStyle = CHAMP; x.font = '400 21px ' + MONO;
        espace(x, maj(this.typeMot) + '  ·  ' + this.date, W / 2, 222, 7);
      }
    }
    this.balayage(seg(t, .4, 1.2), .10);
    this.flare(W / 2, 940, seg(t, .22, 1.0), .9);

    /* ---------- 2 · le prenom (ou le titre), en grand */
    var p2 = eOutExpo(seg(t, 1.15, 1.8)), q2 = eIn3(seg(t, 2.02, 2.4));
    var grow2 = eOut3(seg(t, 1.0, 2.0));
    if (t > 1.0 && t < 2.45){
      this.empreinte(W / 2, H * .5, 470, (1 - q2) * .9, tAbs, lerp(.35, 1, grow2) * (1 + q2 * .25));
    }
    if (p2 > 0 && q2 < 1){
      var gros = d.prenom || d.titre || this.typeMot;
      var sour = d.prenom ? L.wrapDe : this.typeMot;
      x.globalAlpha = p2 * (1 - q2); x.fillStyle = CHAMP; x.font = '400 30px ' + MONO;
      espace(x, maj(sour), W / 2, 790 - (1 - p2) * 30, 11);
      var fs = ajuste(x, gros, 'italic 400', 270, SERIF, 940, 90);
      x.save();
      x.translate(W / 2, 1040); var sc = 1 + q2 * .07; x.scale(sc, sc);
      x.font = 'italic 400 ' + fs + 'px ' + SERIF;
      x.beginPath(); x.rect(-W, -fs * 1.2, W * 2, fs * 1.2 + fs * .32); x.clip();
      var tot = x.measureText(gros).width, chars = Array.from(gros), acc = '';
      x.fillStyle = this.lustre(seg(t, 1.35, 2.05), '#efe3c6'); x.textAlign = 'left';
      for (var ci = 0; ci < chars.length; ci++){
        var cxo = x.measureText(acc).width - tot / 2; acc += chars[ci];
        var stg = Math.min(.045, .34 / Math.max(1, chars.length)), pc = eOutExpo(seg(t, 1.15 + ci * stg, 1.68 + ci * stg));
        if (pc <= 0) continue;
        x.globalAlpha = Math.min(1, pc * 1.4) * (1 - q2);
        x.fillText(chars[ci], cxo, (1 - pc) * fs * 1.05);
      }
      x.textAlign = 'center';
      x.restore();
      var ul = 360 * eOut3(seg(t, 1.4, 1.9));
      x.globalAlpha = .6 * p2 * (1 - q2); x.fillStyle = rgba(d.b, 1);
      x.fillRect(W / 2 - ul / 2, 1112, ul, 2);
    }
    this.balayage(seg(t, 1.45, 2.15), .07);

    /* ---------- 3 · LE chiffre, qui compte jusqu'a sa vraie valeur */
    var ph = d.phare;
    var p3 = eOut3(seg(t, 2.22, 2.6)), q3 = eIn3(seg(t, 3.3, 3.56));
    if (ph && p3 > 0 && q3 < 1){
      var val = num(ph.valeur), dec = Math.round(val) !== val;
      var c3 = eOutExpo(seg(t, 2.3, 3.15)), cur = val * c3;
      var u = ph.unite || '', sur100 = /100|%/.test(u), frac = sur100 ? clamp(cur / 100, 0, 1) : c3;
      var cy = 960, R = 400;
      x.save(); x.globalAlpha = p3 * (1 - q3);
      /* l'anneau */
      x.lineCap = 'round';
      x.strokeStyle = 'rgba(217,201,163,.13)'; x.lineWidth = 3;
      x.beginPath(); x.arc(W / 2, cy, R, 0, Math.PI * 2); x.stroke();
      /* le cadran : cent graduations qui s'allument au passage de l'aiguille */
      for (var gi = 0; gi < 100; gi++){
        var ang = -Math.PI / 2 + gi / 100 * Math.PI * 2, lit = gi / 100 <= frac * eOut3(seg(t, 2.25, 2.6)), lg = gi % 10 === 0 ? 26 : 12;
        x.strokeStyle = lit ? rgba(d.b, gi % 10 === 0 ? .9 : .55) : 'rgba(217,201,163,.14)'; x.lineWidth = gi % 10 === 0 ? 3 : 2;
        var r1 = R - 34, r2 = r1 - lg;
        x.beginPath(); x.moveTo(W / 2 + Math.cos(ang) * r1, cy + Math.sin(ang) * r1); x.lineTo(W / 2 + Math.cos(ang) * r2, cy + Math.sin(ang) * r2); x.stroke();
      }
      var hal = x.createRadialGradient(W / 2, cy, 0, W / 2, cy, R * .9); hal.addColorStop(0, rgba(d.a, .16)); hal.addColorStop(1, rgba(d.a, 0));
      x.fillStyle = hal; x.fillRect(W / 2 - R, cy - R, R * 2, R * 2);
      x.strokeStyle = rgba(d.b, .95); x.lineWidth = 5;
      var a0 = -Math.PI / 2, a1 = a0 + frac * Math.PI * 2 * eOut3(seg(t, 2.25, 2.6));
      x.beginPath(); x.arc(W / 2, cy, R, a0, a1); x.stroke();
      var dx = W / 2 + Math.cos(a1) * R, dy = cy + Math.sin(a1) * R;
      x.globalCompositeOperation = 'lighter';
      var dg = x.createRadialGradient(dx, dy, 0, dx, dy, 46); dg.addColorStop(0, rgba(d.b, .9)); dg.addColorStop(1, rgba(d.b, 0));
      x.fillStyle = dg; x.fillRect(dx - 46, dy - 46, 92, 92);
      x.globalCompositeOperation = 'source-over';
      x.fillStyle = '#fffaf0'; x.beginPath(); x.arc(dx, dy, 8, 0, Math.PI * 2); x.fill();
      /* le label */
      x.fillStyle = CHAMP;
      espaceTenu(x, maj(ph.label), W / 2, 720, 12, 560, '400', 32, MONO);
      /* le nombre */
      var txt = formate(cur, dec);
      x.font = '100 330px ' + SANS;
      var nw = x.measureText(txt).width;
      x.fillStyle = this.lustre(seg(t, 2.9, 3.4), '#f6eedb');
      x.fillText(txt, W / 2 - (u ? 30 : 0), cy + 115);
      if (u){ x.font = '300 58px ' + SANS; x.fillStyle = rgba(d.b, 1); x.textAlign = 'left'; x.fillText(u, W / 2 - 30 + nw / 2 + 12, cy + 110); x.textAlign = 'center'; }
      x.restore();
      /* les autres chiffres, plus petits */
      var au = d.autres, pa = seg(t, 2.75, 3.08);
      if (au.length && pa > 0){
        var colW = 300, x0 = W / 2 - (au.length - 1) * colW / 2;
        x.globalAlpha = pa * (1 - q3);
        for (var i = 0; i < au.length; i++){
          var cx = x0 + i * colW, nv = num(au[i].valeur);
          x.fillStyle = 'rgba(217,201,163,.75)';
          var lab = maj(au[i].label); if (lab.length > 24) lab = lab.slice(0, 23) + '…';
          espaceTenu(x, lab, cx, 1515, 5, colW - 24, '400', 20, MONO);
          x.fillStyle = '#f1e8d4';
          if (nv !== null){ x.font = '200 76px ' + SANS; x.fillText(formate(nv, Math.round(nv) !== nv) + (au[i].unite === '%' ? '%' : ''), cx, 1610); }
          else { x.font = 'italic 400 54px ' + SERIF; var mt = String(au[i].valeur); if (mt.length > 12) mt = mt.slice(0, 11) + '…'; x.fillText(mt, cx, 1600); }
          if (i){ x.fillStyle = 'rgba(217,201,163,.18)'; x.fillRect(cx - colW / 2, 1480, 1, 150); }
        }
      }
    }

    /* ---------- 4 · les quatre gestes (ou les quatre aliments) */
    var items = d.items, nI = items.length;
    var q4 = seg(t, 4.5, 4.76);
    if (nI && t > 3.3 && q4 < 1){
      var p4h = eOut3(seg(t, 3.32, 3.7));
      x.globalAlpha = p4h * (1 - q4); x.fillStyle = CHAMP; x.font = '400 30px ' + MONO;
      espace(x, maj(L.rituel(nI, d.type)), W / 2, 395, 10);
      var hl = 120 * p4h; x.fillStyle = rgba(d.b, .8); x.fillRect(W / 2 - hl / 2, 428, hl, 2);
      var rowH = nI >= 4 ? 300 : 330, top = 470 + (4 - nI) * rowH / 2.2;
      for (var k = 0; k < nI; k++){
        var it = items[k], ti = 3.42 + k * .27;
        var pk = eOut3(seg(t, ti, ti + .5));
        if (pk <= 0) continue;
        var ry = top + k * rowH - q4 * 50, off = (1 - pk) * 160;
        x.save(); x.globalAlpha = pk * (1 - q4); x.translate(off, 0);
        /* la photo detouree, qui flotte */
        var bob = Math.sin(tAbs * 2.1 + k * 1.3) * 9;
        var ig = x.createRadialGradient(232, ry + 140, 0, 232, ry + 140, 170);
        ig.addColorStop(0, rgba(d.a, .28)); ig.addColorStop(1, rgba(d.a, 0));
        x.fillStyle = ig; x.fillRect(62, ry - 30, 340, 340);
        var im = this.imgs[k];
        if (im){ x.drawImage(im, 232 - 150, ry - 14 + bob - (1 - pk) * 30, 300, 300); }
        else { x.strokeStyle = rgba(d.b, .55); x.lineWidth = 2; x.beginPath(); x.arc(232, ry + 140 + bob, 64, 0, Math.PI * 2); x.stroke(); }
        /* numero romain, etape, nom, marque */
        x.textAlign = 'left';
        x.fillStyle = rgba(d.b, 1); x.font = 'italic 400 92px ' + SERIF;
        x.fillText(['I', 'II', 'III', 'IV'][k], 404, ry + 132);
        var tx = 548, tw = W - tx - 70;
        if (it.etape){ x.fillStyle = 'rgba(217,201,163,.85)'; x.font = '400 22px ' + MONO; var et = maj(it.etape); if (et.length > 26) et = et.slice(0, 25) + '…'; espace(x, et, tx, ry + 66, 5, 'left'); }
        x.fillStyle = '#f7f0e2'; x.font = '400 42px ' + SANS;
        var ls = lignes(x, it.nom, tw, 2);
        for (var m = 0; m < ls.length; m++) x.fillText(ls[m], tx, ry + 122 + m * 50);
        if (it.marque){ x.fillStyle = 'rgba(217,201,163,.62)'; x.font = '400 22px ' + MONO; var mq = maj(it.marque); if (mq.length > 28) mq = mq.slice(0, 27) + '…'; espace(x, mq, tx, ry + 122 + ls.length * 50 + 14, 4, 'left'); }
        if (k < nI - 1){ x.fillStyle = 'rgba(217,201,163,.14)'; x.fillRect(110, ry + rowH - 12, (W - 180) * pk, 1); }
        x.textAlign = 'center';
        x.restore();
      }
    }

    /* ---------- 5 · la fin : Mon rituel vyvre · vyvre.fr */
    var p5 = eOut3(seg(t, 4.8, 5.25));
    if (p5 > 0){
      this.empreinte(W / 2, 760, 400, p5, tAbs, lerp(.6, .92, p5));
      x.globalAlpha = p5;
      if (d.prenom){ x.fillStyle = 'rgba(217,201,163,.8)'; x.font = '400 26px ' + MONO; espace(x, maj(d.prenom) + '  ·  ' + this.date, W / 2, 1150, 9); }
      x.fillStyle = '#efe3c6'; x.font = 'italic 400 150px ' + SERIF;
      x.fillText(L.fin1, W / 2, 1320 + (1 - p5) * 50);
      var p5b = eOut3(seg(t, 4.95, 5.4));
      x.globalAlpha = p5b; x.font = '200 116px ' + SANS; x.fillStyle = this.lustre(seg(t, 5.0, 5.55));
      espace(x, 'VYVRE', W / 2, 1478 + (1 - p5b) * 30, 30);
      var p5c = seg(t, 5.15, 5.45);
      x.globalAlpha = p5c * .9; x.fillStyle = CHAMP; x.font = '400 34px ' + MONO;
      espace(x, L.site, W / 2, 1640, 12);
      /* le cadre fin, a la maniere d'une affiche */
      x.globalAlpha = .28 * p5; x.strokeStyle = CHAMP; x.lineWidth = 2;
      var ins = lerp(90, 54, p5); x.strokeRect(ins, ins, W - 2 * ins, H - 2 * ins);
    }
    this.balayage(seg(t, 4.95, 5.55), .09);
    this.flare(W / 2, 1440, seg(t, 4.9, 5.6), .7);

    /* l'exemple est toujours annonce comme tel */
    if (d.exemple){ x.globalAlpha = .75; x.fillStyle = CHAMP; x.font = '400 22px ' + MONO; espace(x, T().exemple, W - 80, 96, 7, 'right'); }

    x.globalAlpha = 1;
    this.grain();
    /* fondu d'entree depuis le noir (la boucle repart proprement) */
    var fe = 1 - seg(tAbs, 0, .28);
    if (fe > 0){ x.globalAlpha = fe; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
  };

  /* ===================================================================
     B · LABORATOIRE : grille, scanner, chiffres au trait lumineux.
     Turquoise et rouille, comme la propale Lab.
     =================================================================== */
  var TEAL = [95, 201, 204], TEAL2 = [170, 240, 236], ROUILLE = [214, 112, 62], CREME = [246, 234, 214];
  var GLYPHES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%/<>+=';
  function hash(a, b){ var h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  /* le texte qui se « decode » : des signes au hasard qui se fixent sur les vraies lettres */
  function decode(txt, p, graine, t){
    var out = '', ch = Array.from(String(txt)), n = ch.length;
    for (var i = 0; i < n; i++){
      var seuil = i / Math.max(1, n);
      if (p >= 1 || ch[i] === ' ' || p > seuil * .8 + .2) out += ch[i];
      else if (p > seuil * .8) out += GLYPHES[Math.floor(hash(i + graine, Math.floor(t * 30)) * GLYPHES.length)];
      else out += ' ';
    }
    return out;
  }
  Rendu.prototype.fondLab = function(){
    if (this._fondB) return this._fondB;
    var b = document.createElement('canvas'); b.width = W; b.height = H; var g = b.getContext('2d');
    g.fillStyle = '#031417'; g.fillRect(0, 0, W, H);
    var h1 = g.createRadialGradient(W * .5, H * .45, 30, W * .5, H * .45, 1000);
    h1.addColorStop(0, 'rgba(40,140,148,.30)'); h1.addColorStop(1, 'rgba(40,140,148,0)');
    g.fillStyle = h1; g.fillRect(0, 0, W, H);
    var h2 = g.createRadialGradient(W * .9, H * .95, 10, W * .9, H * .95, 800);
    h2.addColorStop(0, 'rgba(214,112,62,.16)'); h2.addColorStop(1, 'rgba(214,112,62,0)');
    g.fillStyle = h2; g.fillRect(0, 0, W, H);
    for (var x = 0; x <= W; x += 40){ g.fillStyle = x % 200 === 0 ? 'rgba(95,201,204,.11)' : 'rgba(95,201,204,.045)'; g.fillRect(x, 0, 1, H); }
    for (var y = 0; y <= H; y += 40){ g.fillStyle = y % 200 === 0 ? 'rgba(95,201,204,.11)' : 'rgba(95,201,204,.045)'; g.fillRect(0, y, W, 1); }
    var v = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .8);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.7)');
    g.fillStyle = v; g.fillRect(0, 0, W, H);
    return (this._fondB = b);
  };
  /* texte au trait lumineux : un halo large et pale, puis un trait fin et vif */
  function trait(x, txt, cx, cy, c, a, lw){
    x.strokeStyle = rgba(c, .16 * a); x.lineWidth = (lw || 2) * 5; x.strokeText(txt, cx, cy);
    x.strokeStyle = rgba(c, .35 * a); x.lineWidth = (lw || 2) * 2.2; x.strokeText(txt, cx, cy);
    x.strokeStyle = rgba([235, 255, 252], .95 * a); x.lineWidth = lw || 2; x.strokeText(txt, cx, cy);
  }
  function crochets(x, x0, y0, w, h, l, c, a, lw){
    x.strokeStyle = rgba(c, a); x.lineWidth = lw || 3; x.beginPath();
    x.moveTo(x0, y0 + l); x.lineTo(x0, y0); x.lineTo(x0 + l, y0);
    x.moveTo(x0 + w - l, y0); x.lineTo(x0 + w, y0); x.lineTo(x0 + w, y0 + l);
    x.moveTo(x0 + w, y0 + h - l); x.lineTo(x0 + w, y0 + h); x.lineTo(x0 + w - l, y0 + h);
    x.moveTo(x0 + l, y0 + h); x.lineTo(x0, y0 + h); x.lineTo(x0, y0 + h - l); x.stroke();
  }
  Rendu.prototype.dessineB = function(tAbs){
    var x = this.x, d = this.d, L = this.L, t = Math.min(tAbs, D); this.n++;
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'center';
    x.drawImage(this.fondLab(), 0, 0);
    /* la ligne du scanner, qui descend sans fin */
    var sy = ((tAbs * .62) % 1) * (H + 300) - 150;
    x.save(); x.globalCompositeOperation = 'lighter';
    var sg = x.createLinearGradient(0, sy - 160, 0, sy); sg.addColorStop(0, 'rgba(95,201,204,0)'); sg.addColorStop(1, 'rgba(95,201,204,.16)');
    x.fillStyle = sg; x.fillRect(0, sy - 160, W, 160); x.fillStyle = 'rgba(190,250,246,.55)'; x.fillRect(0, sy, W, 2); x.restore();
    /* le cadre et l'interface */
    crochets(x, 56, 56, W - 112, H - 112, 70, TEAL2, .7, 3);
    x.font = '400 22px ' + MONO; x.fillStyle = rgba(TEAL2, .8); x.textAlign = 'left';
    espace(x, 'VYVRE LAB', 96, 120, 6, 'left');
    x.fillStyle = rgba(TEAL, .7); espace(x, maj(this.typeMot) + ' · ' + this.date, 96, 154, 4, 'left');
    x.textAlign = 'right'; x.fillStyle = rgba(TEAL2, .8);
    espace(x, 'T+' + t.toFixed(2).replace('.', ':'), W - 96, 120, 5, 'right');
    var rec = (Math.floor(tAbs * 2) % 2) === 0;
    x.fillStyle = rgba(ROUILLE, rec ? 1 : .35); x.beginPath(); x.arc(W - 250, 147, 7, 0, Math.PI * 2); x.fill();
    x.fillStyle = rgba(ROUILLE, .9); espace(x, 'LECTURE', W - 96, 154, 5, 'right');
    if (d.exemple){ x.fillStyle = rgba(CREME, .75); espace(x, T().exemple, W - 96, 190, 6, 'right'); }
    x.textAlign = 'center';
    /* graduations en bas : la frise du temps */
    for (var g = 0; g <= 56; g++){ var gx = 110 + g * (W - 220) / 56, on = g / 56 <= t / D; x.fillStyle = on ? rgba(TEAL2, .8) : rgba(TEAL, .22); x.fillRect(gx, H - 128 - (g % 7 === 0 ? 18 : 8), 2, g % 7 === 0 ? 18 : 8); }

    /* 1 · demarrage */
    var q1 = seg(t, 1.05, 1.22);
    if (t < 1.25){
      var a1 = 1 - q1, glitch = q1 > 0 ? (hash(7, Math.floor(t * 60)) - .5) * 60 * q1 : 0;
      var lignesB = ['> INITIALISATION', '> LECTURE · ' + maj(this.typeMot), '> DATE · ' + this.date, '> MESURES · ' + d.chiffres.length];
      x.textAlign = 'left'; x.font = '400 28px ' + MONO;
      for (var i = 0; i < lignesB.length; i++){
        var ts = .12 + i * .16, nc = Math.floor(seg(t, ts, ts + .22) * lignesB[i].length);
        if (nc <= 0) continue;
        x.globalAlpha = a1; x.fillStyle = i === 3 ? rgba(ROUILLE, 1) : rgba(TEAL2, .9);
        x.fillText(lignesB[i].slice(0, nc) + (nc < lignesB[i].length && Math.floor(tAbs * 10) % 2 ? '_' : ''), 110 + glitch, 640 + i * 46);
      }
      x.textAlign = 'center';
      var rr = 300 * eOut3(seg(t, .18, .75));
      if (rr > 1){
        x.globalAlpha = a1 * .8; x.strokeStyle = rgba(TEAL, .5); x.lineWidth = 2;
        x.beginPath(); x.arc(W / 2, 1060, rr, 0, Math.PI * 2); x.stroke();
        x.save(); x.translate(W / 2, 1060); x.rotate(tAbs * .8);
        for (var k = 0; k < 24; k++){ x.rotate(Math.PI / 12); x.fillStyle = rgba(TEAL2, k % 6 ? .35 : .9); x.fillRect(rr - (k % 6 ? 12 : 26), -1, k % 6 ? 12 : 26, 2); }
        x.restore();
        x.fillStyle = rgba(TEAL2, .5 * a1); x.fillRect(W / 2 - rr - 40, 1059, 2 * rr + 80, 1); x.fillRect(W / 2, 1060 - rr - 40, 1, 2 * rr + 80);
      }
      var pl = seg(t, .4, .95);
      if (pl > 0){ x.globalAlpha = a1; x.font = '300 170px ' + MONO; trait(x, decode('VYVRE', pl, 3, tAbs), W / 2 + glitch, 1120, TEAL, 1, 2.4); }
      x.globalAlpha = 1;
    }

    /* 2 · le sujet */
    var p2 = seg(t, 1.2, 1.8), q2 = seg(t, 2.15, 2.35);
    if (t > 1.18 && q2 < 1){
      var nom = maj(d.prenom || d.titre || this.typeMot);
      x.globalAlpha = 1 - q2;
      x.font = '400 28px ' + MONO; x.fillStyle = rgba(ROUILLE, 1);
      espace(x, d.prenom ? 'SUJET · 01' : 'LECTURE · 01', W / 2, 820, 10);
      var fsB = ajuste(x, nom, '300', 200, MONO, 860, 70);
      x.font = '300 ' + fsB + 'px ' + MONO;
      trait(x, decode(nom, p2, 11, tAbs), W / 2, 1040, TEAL, 1, 2.6);
      var nw = Math.min(900, x.measureText(nom).width + 80), lk = eOut3(seg(t, 1.25, 1.85));
      var bw = lerp(980, nw, lk), bh = lerp(700, fsB + 110, lk);
      crochets(x, W / 2 - bw / 2, 1040 - fsB * .78 - (bh - fsB) / 2, bw, bh, 40, lk > .98 ? ROUILLE : TEAL2, .9, 3);
      x.font = '400 22px ' + MONO; x.fillStyle = rgba(TEAL2, .7);
      espace(x, 'ID ' + (Math.abs(this.phase * 1e4 | 0) % 9000 + 1000) + ' · VERROUILLÉ', W / 2, 1040 + fsB * .5 + 70, 6);
      x.globalAlpha = 1;
    }

    /* 3 · la mesure principale + les autres */
    var ph = d.phare, p3 = seg(t, 2.3, 2.5), q3 = seg(t, 3.32, 3.5);
    if (ph && t > 2.28 && q3 < 1){
      var val = num(ph.valeur), dec3 = Math.round(val) !== val, c3 = eOutExpo(seg(t, 2.32, 3.1)), cur = val * c3, sur = /100|%/.test(ph.unite || '');
      x.globalAlpha = p3 * (1 - q3);
      x.font = '400 28px ' + MONO; x.fillStyle = rgba(ROUILLE, 1);
      espaceTenu(x, 'MESURE · ' + maj(ph.label), W / 2, 520, 8, 860, '400', 28, MONO);
      x.font = '200 330px ' + MONO; trait(x, formate(cur, dec3), W / 2, 850, TEAL, 1, 3);
      if (ph.unite){ x.font = '400 40px ' + MONO; x.fillStyle = rgba(TEAL2, .9); x.fillText(ph.unite, W / 2, 925); }
      /* la regle et son aiguille */
      var rx0 = 140, rw = W - 280, ry = 1010, fr = sur ? clamp(cur / 100, 0, 1) : c3;
      for (var r = 0; r <= 100; r++){ var lit = r / 100 <= fr; x.fillStyle = lit ? rgba(TEAL2, r % 10 ? .55 : .95) : rgba(TEAL, .2); x.fillRect(rx0 + r * rw / 100, ry, 2, r % 10 ? 16 : 34); }
      var nx = rx0 + fr * rw; x.fillStyle = rgba(ROUILLE, 1); x.fillRect(nx - 2, ry - 30, 4, 80);
      x.beginPath(); x.moveTo(nx - 12, ry - 42); x.lineTo(nx + 12, ry - 42); x.lineTo(nx, ry - 26); x.closePath(); x.fill();
      /* les autres mesures, en barres */
      var aut = d.chiffres.filter(function(c){ return c !== ph && !(c.label === ph.label && String(c.valeur) === String(ph.valeur)); }).slice(0, 6);
      for (var j = 0; j < aut.length; j++){
        var pj = eOut3(seg(t, 2.55 + j * .07, 2.95 + j * .07)); if (pj <= 0) continue;
        var yy = 1170 + j * 92, v = num(aut[j].valeur), su = /100|%/.test(aut[j].unite || '');
        x.globalAlpha = pj * (1 - q3); x.textAlign = 'left'; x.font = '400 24px ' + MONO; x.fillStyle = rgba(TEAL2, .85);
        var lb = maj(aut[j].label); if (lb.length > 22) lb = lb.slice(0, 21) + '…';
        espace(x, lb, 140, yy, 4, 'left');
        x.fillStyle = rgba(TEAL, .18); x.fillRect(140, yy + 20, W - 280, 6);
        if (v !== null && su){ x.fillStyle = j % 2 ? rgba(ROUILLE, .95) : rgba(TEAL2, .95); x.fillRect(140, yy + 20, (W - 280) * clamp(v / 100, 0, 1) * pj, 6); }
        x.textAlign = 'right'; x.font = '400 30px ' + MONO; x.fillStyle = rgba(CREME, .95);
        x.fillText(v !== null ? formate(v * (su ? pj : 1), Math.round(v) !== v) + (aut[j].unite === '%' ? '%' : '') : String(aut[j].valeur), W - 140, yy);
        x.textAlign = 'center';
      }
      x.globalAlpha = 1;
    }

    /* 4 · les echantillons, en fiches scannees */
    var items = d.items, nI = items.length, q4 = seg(t, 4.55, 4.75);
    if (nI && t > 3.4 && q4 < 1){
      x.globalAlpha = seg(t, 3.42, 3.6) * (1 - q4); x.font = '400 28px ' + MONO; x.fillStyle = rgba(ROUILLE, 1);
      espace(x, maj(L.rituel(nI, d.type)), W / 2, 330, 8);
      var cw = 438, chh = 610, pos = [[92, 400], [550, 400], [92, 1046], [550, 1046]];
      if (nI === 1) pos = [[321, 700]]; else if (nI === 2) pos = [[92, 700], [550, 700]]; else if (nI === 3) pos = [[92, 400], [550, 400], [321, 1046]];
      for (var m = 0; m < nI; m++){
        var tm = 3.5 + m * .2, pm = seg(t, tm, tm + .32); if (pm <= 0) continue;
        var cx0 = pos[m][0], cy0 = pos[m][1], hh = chh * eOut3(pm);
        x.save(); x.globalAlpha = 1 - q4;
        x.beginPath(); x.rect(cx0 - 4, cy0 - 4, cw + 8, hh + 8); x.clip();
        x.fillStyle = 'rgba(95,201,204,.07)'; x.fillRect(cx0, cy0, cw, chh);
        x.strokeStyle = rgba(TEAL, .35); x.lineWidth = 1.5; x.strokeRect(cx0, cy0, cw, chh);
        crochets(x, cx0 - 2, cy0 - 2, cw + 4, chh + 4, 28, TEAL2, .9, 3);
        var im = this.imgs[m], fl = Math.sin(tAbs * 2 + m) * 6;
        if (im) x.drawImage(im, cx0 + cw / 2 - 170, cy0 + 40 + fl, 340, 340);
        else { x.strokeStyle = rgba(TEAL2, .5); x.beginPath(); x.arc(cx0 + cw / 2, cy0 + 220, 70, 0, Math.PI * 2); x.stroke(); }
        x.textAlign = 'left'; x.font = '400 21px ' + MONO; x.fillStyle = rgba(ROUILLE, 1);
        var et = 'ÉCH. 0' + (m + 1) + (items[m].etape ? ' · ' + maj(items[m].etape) : ''); if (et.length > 30) et = et.slice(0, 29) + '…';
        espace(x, et, cx0 + 26, cy0 + 432, 3, 'left');
        x.font = '400 29px ' + MONO; x.fillStyle = rgba(CREME, .96);
        var ls = lignes(x, items[m].nom, cw - 52, 2); for (var z = 0; z < ls.length; z++) x.fillText(ls[z], cx0 + 26, cy0 + 478 + z * 36);
        if (items[m].marque){ x.font = '400 20px ' + MONO; x.fillStyle = rgba(TEAL2, .75); var mq = maj(items[m].marque); if (mq.length > 30) mq = mq.slice(0, 29) + '…'; espace(x, mq, cx0 + 26, cy0 + 478 + ls.length * 36 + 12, 3, 'left'); }
        x.textAlign = 'center';
        if (pm < 1){ x.fillStyle = 'rgba(200,255,250,.9)'; x.fillRect(cx0 - 10, cy0 + hh - 2, cw + 20, 3); }
        x.restore();
      }
      x.globalAlpha = 1;
    }

    /* 5 · la fin */
    var p5 = eOut3(seg(t, 4.75, 5.15));
    if (p5 > 0){
      x.globalAlpha = p5;
      x.save(); x.translate(W / 2, 760); x.rotate(tAbs * .35);
      x.strokeStyle = rgba(TEAL, .55); x.lineWidth = 2;
      x.beginPath(); x.arc(0, 0, 250 * p5, 0, Math.PI * 2); x.stroke();
      x.setLineDash([6, 14]); x.beginPath(); x.arc(0, 0, 310 * p5, 0, Math.PI * 2); x.stroke(); x.setLineDash([]);
      for (var q = 0; q < 4; q++){ x.rotate(Math.PI / 2); x.fillStyle = rgba(ROUILLE, .95); x.fillRect(200 * p5, -2, 90, 4); }
      x.restore();
      x.fillStyle = rgba(TEAL2, .9); x.beginPath(); x.arc(W / 2, 760, 6, 0, Math.PI * 2); x.fill();
      x.fillStyle = rgba(TEAL2, .5); x.fillRect(W / 2 - 330 * p5, 759, 660 * p5, 1); x.fillRect(W / 2, 760 - 330 * p5, 1, 660 * p5);
      if (d.prenom){ x.font = '400 26px ' + MONO; x.fillStyle = rgba(TEAL2, .85); espace(x, maj(d.prenom) + ' · ' + this.date, W / 2, 1180, 8); }
      x.font = '300 96px ' + MONO; trait(x, decode(maj(L.fin1), seg(t, 4.85, 5.25), 9, tAbs), W / 2, 1320, ROUILLE, 1, 2.2);
      x.font = '300 96px ' + MONO; trait(x, decode('VYVRE', seg(t, 4.95, 5.3), 13, tAbs), W / 2, 1440, TEAL, 1, 2.2);
      x.globalAlpha = seg(t, 5.15, 5.4); x.font = '400 34px ' + MONO; x.fillStyle = rgba(TEAL2, 1);
      espace(x, L.site, W / 2, 1580, 12);
      x.globalAlpha = 1;
    }
    this.grain();
    var fe = 1 - seg(tAbs, 0, .2);
    if (fe > 0){ x.globalAlpha = fe; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
  };

  /* ===================================================================
     C · MATIERE : une poussiere de lumiere qui se rassemble pour ecrire
     le logo, le prenom, l'anneau du chiffre, puis la forme des 4 produits.
     =================================================================== */
  var NP = 2100;
  function pointsTexte(txt, font, cx, cy, sp){
    var s = .5, c = document.createElement('canvas'); c.width = W * s; c.height = H * s; var g = c.getContext('2d');
    g.scale(s, s); g.fillStyle = '#fff'; g.textBaseline = 'alphabetic'; g.textAlign = 'center'; g.font = font;
    if (sp) espace(g, txt, cx, cy, sp); else g.fillText(txt, cx, cy);
    var id = g.getImageData(0, 0, c.width, c.height).data, out = [];
    for (var y = 0; y < c.height; y += 2) for (var x = 0; x < c.width; x += 2) if (id[(y * c.width + x) * 4 + 3] > 110) out.push([x / s, y / s]);
    return out;
  }
  function pointsImage(cv, cx, cy, taille){
    if (!cv) return [];
    var n = 150, c = document.createElement('canvas'); c.width = c.height = n; var g = c.getContext('2d'); g.drawImage(cv, 0, 0, n, n);
    var id = g.getImageData(0, 0, n, n).data, out = [];
    for (var y = 0; y < n; y += 2) for (var x = 0; x < n; x += 2){ var i = (y * n + x) * 4; if (id[i + 3] > 170) out.push([cx + (x / n - .5) * taille, cy + (y / n - .5) * taille]); }
    return out;
  }
  function etale(arr, N, r01, cx, cy, R){
    var out = new Array(N);
    if (!arr.length){ for (var i = 0; i < N; i++){ var a = r01() * 6.283, r = R * Math.sqrt(r01()); out[i] = [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; } return out; }
    /* melange deterministe, puis repetition avec un leger flou si moins de points que de grains */
    var idx = arr.map(function(_, k){ return k; }); for (var j = idx.length - 1; j > 0; j--){ var k = Math.floor(r01() * (j + 1)); var tmp = idx[j]; idx[j] = idx[k]; idx[k] = tmp; }
    for (var m = 0; m < N; m++){ var p = arr[idx[m % idx.length]], jt = m >= idx.length ? 3 : 0; out[m] = [p[0] + (r01() - .5) * jt, p[1] + (r01() - .5) * jt]; }
    return out;
  }
  Rendu.prototype.prepareC = function(){
    var d = this.d, L = this.L, rnd = Math.abs(this.phase * 1e6 | 0) + 7;
    function r01(){ rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; }
    var C = { imgs:this.imgs, rnd:[], sets:[] };
    for (var i = 0; i < NP; i++) C.rnd.push([r01(), r01(), r01(), r01()]);
    var s0 = []; for (var a = 0; a < NP; a++) s0.push([r01() * W, r01() * H]);
    var logo = pointsTexte('VYVRE', '500 190px ' + SANS, W / 2, 1060, 34);
    var gros = d.prenom || d.titre || this.typeMot, cv = document.createElement('canvas').getContext('2d');
    var fs = ajuste(cv, gros, 'italic 400', 290, SERIF, 960, 90);
    var nom = pointsTexte(gros, 'italic 600 ' + fs + 'px ' + SERIF, W / 2, 1060);
    var frac = d.phare && /100|%/.test(d.phare.unite || '') ? clamp(num(d.phare.valeur) / 100, .02, 1) : 1;
    var anneau = []; for (var b = 0; b < NP; b++){ var ang = -Math.PI / 2 + (b / NP) * frac * Math.PI * 2, rr = 400 + (r01() - .5) * 40 + (b % 5 === 0 ? (r01() - .5) * 90 : 0); anneau.push([W / 2 + Math.cos(ang) * rr, 960 + Math.sin(ang) * rr]); }
    var nI = d.items.length, pos = this.posC(nI), prod = [];
    var per = Math.floor(NP / Math.max(1, nI));
    for (var k = 0; k < nI; k++){ var pts = etale(pointsImage(this.imgs[k], pos[k][0], pos[k][1], pos[k][2]), k === nI - 1 ? NP - per * k : per, r01, pos[k][0], pos[k][1], pos[k][2] * .3); prod = prod.concat(pts); }
    if (!nI) prod = etale([], NP, r01, W / 2, H / 2, 400);
    var fin = pointsTexte('VYVRE', '500 150px ' + SANS, W / 2, 1470, 28);
    C.sets = [s0, etale(logo, NP, r01, W / 2, 1000, 300), etale(nom, NP, r01, W / 2, 1000, 300), anneau, prod, etale(fin, NP, r01, W / 2, 1420, 300)];
    C.trans = [[.15, .6], [1.1, 1.5], [2.2, 2.55], [3.3, 3.75], [4.7, 5.1]];
    this.C = C;
  };
  Rendu.prototype.posC = function(n){
    var T4 = [[300, 700, 400], [780, 700, 400], [300, 1270, 400], [780, 1270, 400]];
    if (n === 1) return [[540, 960, 560]]; if (n === 2) return [[300, 960, 420], [780, 960, 420]]; if (n === 3) return [[300, 700, 400], [780, 700, 400], [540, 1270, 400]];
    return T4;
  };
  Rendu.prototype.dessineC = function(tAbs){
    if (!this.C || this.C.imgs !== this.imgs) this.prepareC();
    var x = this.x, d = this.d, L = this.L, C = this.C, t = Math.min(tAbs, D); this.n++;
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'center';
    x.drawImage(this.fond, 0, 0);
    var br = .5 + .5 * Math.sin(tAbs * .9);
    var hg = x.createRadialGradient(W / 2, H * .5, 0, W / 2, H * .5, 900); hg.addColorStop(0, rgba(d.a, .1 + .06 * br)); hg.addColorStop(1, rgba(d.a, 0));
    x.fillStyle = hg; x.fillRect(0, 0, W, H);
    /* quelle forme, et ou en est le vol */
    var tr = C.trans, sets = C.sets, k = 0; for (var i = 0; i < tr.length; i++) if (t >= tr[i][0]) k = i + 1;
    var dimP = 1 - .6 * seg(t, 3.8, 4.3) + .6 * seg(t, 4.55, 4.75);
    x.save(); x.globalCompositeOperation = 'lighter';
    var cA = rgba([236, 222, 190], .85), cB = rgba(d.b, .9);
    for (var pass = 0; pass < 2; pass++){
      x.fillStyle = pass ? cB : cA;
      for (var j = pass; j < NP; j += 2){
        var r = C.rnd[j], px, py;
        if (k === 0){ px = sets[0][j][0] + Math.sin(tAbs * .6 + r[0] * 9) * 40; py = sets[0][j][1] - tAbs * 30 * (r[1] + .3) + Math.cos(tAbs * .5 + r[2] * 9) * 30; }
        else {
          var tw = tr[k - 1], dl = r[2] * .15, p = eInOut(seg(t, tw[0] + dl, tw[1] + dl));
          var A = k === 1 ? [sets[0][j][0] + Math.sin(tAbs * .6 + r[0] * 9) * 40, sets[0][j][1] - tAbs * 30 * (r[1] + .3)] : sets[k - 1][j], B = sets[k][j];
          var sw = Math.sin(p * Math.PI) * (90 + r[3] * 160) * (r[0] < .5 ? -1 : 1);
          var dx = B[0] - A[0], dy = B[1] - A[1], ln = Math.sqrt(dx * dx + dy * dy) || 1;
          px = A[0] + dx * p - dy / ln * sw; py = A[1] + dy * p + dx / ln * sw;
          var calme = seg(t, tw[1], tw[1] + .4);
          px += Math.sin(tAbs * 2.2 + r[0] * 20) * (1.5 + 2 * (1 - calme)); py += Math.cos(tAbs * 1.9 + r[1] * 20) * (1.5 + 2 * (1 - calme));
          if (k === 4 && j > 0){ py += Math.sin(tAbs * 2.1 + Math.floor(j / (NP / Math.max(1, d.items.length)))) * 7 * seg(t, 3.9, 4.2); }
        }
        var sz = r[3] < .1 ? 4.5 : 2.6;
        x.globalAlpha = (.45 + .55 * r[1]) * dimP;
        x.fillRect(px - sz / 2, py - sz / 2, sz, sz);
      }
    }
    x.restore(); x.globalAlpha = 1;
    /* les mots qui accompagnent la matiere */
    var a1 = seg(t, .7, .9) * (1 - seg(t, 1.05, 1.2));
    if (a1 > 0){ x.globalAlpha = a1 * .8; x.fillStyle = CHAMP; x.font = '400 26px ' + MONO; espace(x, maj(this.typeMot) + '  ·  ' + this.date, W / 2, 1200, 9); }
    var a2 = seg(t, 1.5, 1.7) * (1 - seg(t, 2.1, 2.25));
    if (a2 > 0){ x.globalAlpha = a2; x.fillStyle = CHAMP; x.font = '400 30px ' + MONO; espace(x, maj(d.prenom ? L.wrapDe : this.typeMot), W / 2, 760, 11); }
    var ph = d.phare;
    if (ph){
      var a3 = seg(t, 2.45, 2.7) * (1 - seg(t, 3.25, 3.42));
      if (a3 > 0){
        var val = num(ph.valeur), cur = val * eOutExpo(seg(t, 2.4, 3.1));
        x.globalAlpha = a3; x.fillStyle = CHAMP; x.font = '400 30px ' + MONO; espaceTenu(x, maj(ph.label), W / 2, 790, 10, 600, '400', 30, MONO);
        x.font = '100 300px ' + SANS; x.fillStyle = this.lustre(seg(t, 2.8, 3.3), '#f6eedb'); x.fillText(formate(cur, Math.round(val) !== val), W / 2, 1075);
        if (ph.unite){ x.font = '300 48px ' + SANS; x.fillStyle = rgba(d.b, 1); x.fillText(ph.unite, W / 2, 1160); }
      }
    }
    /* les produits : la poussiere devient la vraie photo */
    var nI = d.items.length, pos = this.posC(nI), q4 = seg(t, 4.55, 4.75);
    if (nI && t > 3.6 && q4 < 1){
      x.globalAlpha = seg(t, 3.6, 3.85) * (1 - q4); x.fillStyle = CHAMP; x.font = '400 28px ' + MONO; espace(x, maj(L.rituel(nI, d.type)), W / 2, 380, 10);
      for (var m = 0; m < nI; m++){
        var pm = seg(t, 3.78 + m * .1, 4.15 + m * .1); if (pm <= 0) continue;
        var cx = pos[m][0], cy = pos[m][1], sz2 = pos[m][2], bob = Math.sin(tAbs * 2.1 + m) * 7 * seg(t, 3.9, 4.2);
        x.globalAlpha = pm * (1 - q4);
        if (this.imgs[m]) x.drawImage(this.imgs[m], cx - sz2 / 2, cy - sz2 / 2 + bob, sz2, sz2);
        x.font = 'italic 400 46px ' + SERIF; x.fillStyle = rgba(d.b, 1); x.fillText(['I', 'II', 'III', 'IV'][m], cx, cy + sz2 / 2 + 30);
        x.font = '400 28px ' + SANS; x.fillStyle = '#f7f0e2'; var ls = lignes(x, d.items[m].nom, sz2 - 40, 2);
        for (var z = 0; z < ls.length; z++) x.fillText(ls[z], cx, cy + sz2 / 2 + 76 + z * 34);
      }
    }
    var p5 = eOut3(seg(t, 5.0, 5.4));
    if (p5 > 0){
      x.globalAlpha = p5;
      if (d.prenom){ x.fillStyle = 'rgba(217,201,163,.8)'; x.font = '400 26px ' + MONO; espace(x, maj(d.prenom) + '  ·  ' + this.date, W / 2, 1100, 9); }
      x.fillStyle = '#efe3c6'; x.font = 'italic 400 140px ' + SERIF; x.fillText(L.fin1, W / 2, 1280 + (1 - p5) * 40);
      x.globalAlpha = seg(t, 5.2, 5.45) * .9; x.fillStyle = CHAMP; x.font = '400 34px ' + MONO; espace(x, L.site, W / 2, 1620, 12);
    }
    if (d.exemple){ x.globalAlpha = .75; x.fillStyle = CHAMP; x.font = '400 22px ' + MONO; espace(x, T().exemple, W - 80, 96, 7, 'right'); }
    x.globalAlpha = 1;
    this.grain();
    var fe = 1 - seg(tAbs, 0, .28);
    if (fe > 0){ x.globalAlpha = fe; x.fillStyle = '#000'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
  };

  /* ===================================================================
     D · RYTHME : montage cut sur le tempo (120 BPM), plans tres courts,
     couleurs vives par scan, typographie qui remplit l'ecran.
     =================================================================== */
  var VIVES = { peau:[[255, 92, 60], [255, 168, 196]], cheveux:[[58, 92, 255], [170, 128, 255]], aliment:[[178, 240, 60], [30, 196, 110]] };
  /* 06/10 : palettes facon defiles. c1 et c2 servent de fond sous un texte sombre : toujours clairs ou moyens ;
     la couleur profonde de la palette est portee par « noir » (le fond sombre). */
  var PALETTES = {
    origine:   null,
    rouge:     { nom:'Rouge couture',          c1:[230, 30, 40],   c2:[255, 150, 170], noir:[10, 6, 6],     blanc:[255, 246, 240] },
    fuchsia:   { nom:'Fuchsia & rouge',        c1:[255, 40, 140],  c2:[255, 70, 60],   noir:[18, 4, 12],    blanc:[255, 244, 248] },
    klein:     { nom:'Bleu Klein',             c1:[40, 70, 255],   c2:[255, 255, 255], noir:[4, 6, 30],     blanc:[255, 255, 255] },
    cobaltrouge:{ nom:'Cobalt & rouge',        c1:[30, 90, 255],   c2:[255, 60, 50],   noir:[6, 6, 14],     blanc:[248, 248, 255] },
    acide:     { nom:'Vert acide & noir',      c1:[200, 255, 0],   c2:[120, 255, 160], noir:[6, 8, 4],      blanc:[245, 255, 230] },
    orangerose:{ nom:'Orange & rose choc',     c1:[255, 110, 20],  c2:[255, 120, 200], noir:[20, 8, 4],     blanc:[255, 246, 236] },
    violet:    { nom:'Violet & jaune acide',   c1:[150, 80, 255],  c2:[240, 255, 60],  noir:[14, 6, 28],    blanc:[250, 246, 255] },
    cerise:    { nom:'Cerise & bleu bebe',     c1:[220, 20, 60],   c2:[150, 200, 255], noir:[16, 4, 8],     blanc:[255, 246, 248] },
    emeraudeR: { nom:'Emeraude & rose',        c1:[0, 190, 120],   c2:[255, 110, 180], noir:[2, 18, 12],    blanc:[240, 255, 248] },
    turquoise: { nom:'Turquoise & corail',     c1:[0, 200, 210],   c2:[255, 110, 90],  noir:[2, 14, 18],    blanc:[240, 255, 255] },
    tangerine: { nom:'Tangerine & marine',     c1:[255, 130, 0],   c2:[90, 140, 255],  noir:[4, 10, 34],    blanc:[255, 248, 236] },
    chrome:    { nom:'Chrome & noir',          c1:[210, 214, 222], c2:[150, 156, 170], noir:[4, 4, 6],      blanc:[255, 255, 255] },
    lime:      { nom:'Fuchsia & lime',         c1:[255, 30, 160],  c2:[190, 255, 40],  noir:[10, 4, 10],    blanc:[255, 248, 252] },
    lilas:     { nom:'Lilas & aubergine',      c1:[200, 160, 255], c2:[255, 140, 220], noir:[30, 6, 34],    blanc:[252, 246, 255] },
    soleil:    { nom:'Jaune soleil & rouge',   c1:[255, 210, 0],   c2:[255, 70, 40],   noir:[14, 8, 2],     blanc:[255, 252, 236] },
    menthe:    { nom:'Menthe & chocolat',      c1:[120, 240, 200], c2:[255, 150, 120], noir:[30, 16, 10],   blanc:[240, 255, 250] }
  };
  var PAL_DEFAUT = 'origine';
  try { var qp = (location.search.match(/[?&]pal=([a-z]+)/) || [])[1]; if (qp && qp in PALETTES) PAL_DEFAUT = qp; } catch(e){}
  function couleurs(d){
    var P = PALETTES[d.palette], V = VIVES[d.type] || VIVES.peau;
    return P ? { c1:P.c1, c2:P.c2, noir:P.noir, blanc:P.blanc } : { c1:V[0], c2:V[1], noir:[8, 8, 8], blanc:[250, 246, 238] };
  }
  var BEAT = .5;
  Rendu.prototype.dessineD = function(tAbs){
    var x = this.x, d = this.d, L = this.L, t = Math.min(tAbs, D); this.n++;
    var K0 = couleurs(d), c1 = K0.c1, c2 = K0.c2, NOIR = K0.noir, BLANC = K0.blanc;
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'center';
    /* le coup de zoom a chaque temps */
    var tb = t % BEAT, punch = 1 + .06 * Math.pow(1 - clamp(tb / .18, 0, 1), 2);
    var shake = tb < .1 ? (hash(3, Math.floor(t / BEAT)) - .5) * 18 * (1 - tb / .1) : 0;
    function fondD(c){ x.fillStyle = rgba(c, 1); x.fillRect(0, 0, W, H); }
    function geant(txt, poids, maxW, taille, cy, coul, sp){ var f = ajuste(x, txt, poids, taille, SANS, maxW, 40); x.font = poids + ' ' + f + 'px ' + SANS; x.fillStyle = rgba(coul, 1); if (sp) espace(x, txt, W / 2, cy, sp); else x.fillText(txt, W / 2, cy); return f; }
    x.save(); x.translate(W / 2 + shake, H / 2); x.scale(punch, punch); x.translate(-W / 2, -H / 2);
    var gros = maj(d.prenom || d.titre || this.typeMot);
    if (t < .5){
      fondD(NOIR); var s0 = 1.35 - .35 * eOut3(seg(t, 0, .3));
      x.save(); x.translate(W / 2, H / 2); x.scale(s0, s0); x.translate(-W / 2, -H / 2);
      geant('VYVRE', '800', 980, 260, 1050, BLANC, 18); x.restore();
      x.font = '700 30px ' + MONO; x.fillStyle = rgba(c1, 1); espace(x, maj(this.typeMot) + ' · ' + this.date, W / 2, 1180, 8);
    } else if (t < 1.0){
      fondD(c1); var mot = maj(this.typeMot), sl = (t - .5) / .5;
      x.font = '900 520px ' + SANS; x.fillStyle = rgba(NOIR, 1); x.textAlign = 'left';
      var mw = x.measureText(mot).width; x.fillText(mot, lerp(80, W - mw - 80, sl) + (mw > W ? lerp(0, -(mw - W + 160), sl) : 0), 1150); x.textAlign = 'center';
      x.font = '700 30px ' + MONO; x.fillStyle = rgba(NOIR, .8); espace(x, 'VYVRE · ' + this.date, W / 2, 1400, 8);
    } else if (t < 1.5){
      fondD(NOIR);
      x.font = '700 32px ' + MONO; x.fillStyle = rgba(BLANC, .85); espace(x, maj(d.prenom ? L.wrapDe : this.typeMot), W / 2, 780, 12);
      geant(gros, '900', 1000, 330, 1080, c1);
    } else if (t < 2.0){
      fondD(c2);
      x.font = '900 230px ' + SANS; var fsr = ajuste(x, gros, '900', 230, SANS, 1600, 60); x.font = '900 ' + fsr + 'px ' + SANS;
      var gw = x.measureText(gros).width + 80, dt = t - 1.5;
      for (var rI = -1; rI < 9; rI++){
        var yR = 120 + rI * fsr * .95, dir = rI % 2 ? 1 : -1, off = (dt * 900 * dir) % gw;
        x.textAlign = 'left';
        for (var rep = -2; rep < 4; rep++){
          var xx = off + rep * gw - 200;
          if (rI === 4){ x.fillStyle = rgba(NOIR, 1); x.fillText(gros, xx, yR); }
          else { x.strokeStyle = rgba(NOIR, .55); x.lineWidth = 3; x.strokeText(gros, xx, yR); }
        }
      }
      x.textAlign = 'center';
    } else if (t < 3.0 && d.phare){
      var ph = d.phare, val = num(ph.valeur), dec = Math.round(val) !== val;
      var inv = t >= 2.5; fondD(inv ? NOIR : c1);
      var cur = val * eOut3(seg(t, 2.0, 2.42));
      x.font = '700 34px ' + MONO; x.fillStyle = rgba(inv ? c1 : NOIR, 1); espaceTenu(x, maj(ph.label), W / 2, 560, 10, 900, '700', 34, MONO);
      geant(formate(cur, dec), '900', 1000, 600, 1170, inv ? c1 : NOIR);
      if (ph.unite){ x.font = '800 70px ' + SANS; x.fillStyle = rgba(inv ? BLANC : NOIR, 1); x.fillText(ph.unite, W / 2, 1300); }
      if (inv){
        var au = d.autres;
        for (var i = 0; i < au.length; i++){ var cxA = W / 2 + (i - (au.length - 1) / 2) * 320, vA = num(au[i].valeur);
          x.font = '700 22px ' + MONO; x.fillStyle = rgba(BLANC, .7); var lbA = maj(au[i].label); espaceTenu(x, lbA, cxA, 1520, 4, 290, '700', 22, MONO);
          x.font = '900 84px ' + SANS; x.fillStyle = rgba(c2, 1); var tv = vA !== null ? formate(vA, Math.round(vA) !== vA) : String(au[i].valeur); var fA = ajuste(x, tv, '900', 84, SANS, 290, 30); x.font = '900 ' + fA + 'px ' + SANS; x.fillText(tv, cxA, 1620); }
      }
    } else if (t < 5.0 && d.items.length){
      var nI = d.items.length, Ls = 2.0 / nI, k = clamp(Math.floor((t - 3.0) / Ls), 0, nI - 1), lt = (t - 3.0) - k * Ls;
      var bgK = [c2, NOIR, c1, NOIR][k % 4], txtK = bgK === NOIR ? c1 : NOIR, sub = bgK === NOIR ? BLANC : NOIR;
      fondD(bgK);
      x.font = '900 980px ' + SANS; x.strokeStyle = rgba(txtK, .35); x.lineWidth = 4; x.strokeText(['I', 'II', 'III', 'IV'][k], W / 2, 1340);
      var it = d.items[k], im = this.imgs[k], zi = 1.18 - .18 * eOut3(clamp(lt / .25, 0, 1)), rot = (k % 2 ? 1 : -1) * .05 * (1 - eOut3(clamp(lt / .3, 0, 1)));
      if (im){ x.save(); x.translate(W / 2, 900); x.rotate(rot); x.scale(zi, zi); x.drawImage(im, -380, -380, 760, 760); x.restore(); }
      x.font = '700 30px ' + MONO; x.fillStyle = rgba(sub, .85);
      espace(x, (k + 1) + '/' + nI + (it.etape ? ' · ' + maj(it.etape) : ''), W / 2, 330, 8);
      x.font = '900 70px ' + SANS; x.fillStyle = rgba(txtK, 1);
      var ls = lignes(x, maj(it.nom), 940, 2); for (var z = 0; z < ls.length; z++) x.fillText(ls[z], W / 2, 1470 + z * 78);
      if (it.marque){ x.font = '700 28px ' + MONO; x.fillStyle = rgba(sub, .8); espace(x, maj(it.marque), W / 2, 1470 + ls.length * 78 + 30, 8); }
    } else {
      fondD(t < 5.25 ? c1 : NOIR); var fin = t >= 5.25;
      var cc = fin ? c1 : NOIR;
      x.font = '700 30px ' + MONO; x.fillStyle = rgba(fin ? BLANC : NOIR, .85);
      if (d.prenom) espace(x, maj(d.prenom) + ' · ' + this.date, W / 2, 700, 8);
      geant(maj(L.fin1), '900', 960, 200, 960, cc);
      geant('VYVRE', '900', 900, 230, 1200, fin ? BLANC : NOIR, 14);
      x.font = '700 40px ' + MONO; x.fillStyle = rgba(fin ? c1 : NOIR, 1); espace(x, L.site, W / 2, 1400, 12);
    }
    x.restore();
    if (d.exemple){ x.globalAlpha = .8; x.fillStyle = '#ffffff'; x.font = '700 22px ' + MONO; espace(x, T().exemple, W - 80, 96, 7, 'right'); x.globalAlpha = 1; }
    /* le flash blanc a chaque coupe */
    var cut = t - Math.floor(t / BEAT) * BEAT;
    if (t > .4 && cut < .07 && t < 5.4){ x.globalAlpha = .38 * (1 - cut / .07); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
    this.grain();
  };


  /* ===================================================================
     D1 a D4 · quatre variantes du Rythme, pensees pour le partage (06/10).
     Regles communes :
       - 16 temps exactement a leur tempo : la derniere image retombe sur
         la premiere (le reel boucle sans couture) ;
       - le premier temps est deja l'accroche, plein cadre, sans fondu ;
       - zone sure des stories : rien d'important au-dessus de y = 280,
         sous y = 1530, ni contre le bord droit (colonne centree a x = 530) ;
       - vyvre.fr toujours visible ; « EXEMPLE » a cote si c'est un exemple ;
       - au plus un changement de fond franc par temps (< 3 flashs/s).
     =================================================================== */
  var CX = 530, MW = 780, SIG_Y = 1490, NOIR = [8, 8, 8], BLANC = [250, 246, 238];
  function rond(x, x0, y0, w, h, r){ x.beginPath(); x.moveTo(x0 + r, y0); x.arcTo(x0 + w, y0, x0 + w, y0 + h, r); x.arcTo(x0 + w, y0 + h, x0, y0 + h, r); x.arcTo(x0, y0 + h, x0, y0, r); x.arcTo(x0, y0, x0 + w, y0, r); x.closePath(); }
  function fleche(x, cx, cy, s, dir, c){ x.fillStyle = rgba(c, 1); x.beginPath();
    if (dir === 'haut'){ x.moveTo(cx, cy - s); x.lineTo(cx + s, cy + s * .6); x.lineTo(cx - s, cy + s * .6); }
    else if (dir === 'bas'){ x.moveTo(cx, cy + s); x.lineTo(cx + s, cy - s * .6); x.lineTo(cx - s, cy - s * .6); }
    else if (dir === 'gauche'){ x.moveTo(cx - s, cy); x.lineTo(cx + s * .6, cy - s); x.lineTo(cx + s * .6, cy + s); }
    else { x.moveTo(cx + s, cy); x.lineTo(cx - s * .6, cy - s); x.lineTo(cx - s * .6, cy + s); }
    x.closePath(); x.fill(); }
  function taille(x, txt, poids, max, maxW, min){ return ajuste(x, txt, poids, max, SANS, maxW, min || 40); }
  function unite(c){ return c && c.unite ? (c.unite === '/100' || c.unite === '%' ? c.unite : ' ' + c.unite) : ''; }

  Rendu.prototype.tempo = function(tAbs){
    var tm = this.d.tm, t = ((tAbs % tm.D) + tm.D) % tm.D, q = t / tm.beat, bi = Math.min(15, Math.floor(q));
    return { t:t, q:q, bi:bi, ph:q - bi };
  };
  Rendu.prototype.vives = function(){ var K0 = couleurs(this.d); return { c1:K0.c1, c2:K0.c2 }; };
  Rendu.prototype.aplat = function(c){ var x = this.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.fillStyle = rgba(c, 1); x.fillRect(0, 0, W, H); };
  /* le coup de zoom sur chaque temps (et la secousse sur le drop) */
  Rendu.prototype.coup = function(ph, force, secousse, bi){
    var x = this.x, k = 1 + force * Math.pow(1 - clamp(ph / .3, 0, 1), 2);
    var sx = secousse && ph < .25 ? (hash(5, bi * 97 + Math.floor(ph * 40)) - .5) * 26 * (1 - ph / .25) : 0;
    x.translate(CX + sx, 900); x.scale(k, k); x.translate(-CX, -900);
  };
  Rendu.prototype.mot = function(txt, poids, max, maxW, cx, y, col, a){ var x = this.x, f = taille(x, txt, poids, max, maxW); x.font = poids + ' ' + f + 'px ' + SANS; x.fillStyle = rgba(col, a == null ? 1 : a); x.fillText(txt, cx, y); return f; };
  Rendu.prototype.etiq = function(txt, cx, y, col, size, maxW, a){ var x = this.x; x.globalAlpha = a == null ? 1 : a; x.fillStyle = rgba(col, 1); espaceTenu(x, txt, cx, y, 8, maxW || MW, '700', size || 32, MONO); x.globalAlpha = 1; };
  /* deux lignes de meme taille */
  Rendu.prototype.deux = function(l1, l2, max, y, ca, cb, maxW, cx){ var x = this.x; maxW = maxW || MW; cx = cx == null ? CX : cx;
    var f = Math.min(taille(x, l1, '900', max, maxW), taille(x, l2, '900', max, maxW)); x.font = '900 ' + f + 'px ' + SANS;
    x.fillStyle = rgba(ca, 1); x.fillText(l1, cx, y); x.fillStyle = rgba(cb, 1); x.fillText(l2, cx, y + f * .98); return f; };
  /* un nom geant centre sur cy : une ligne, ou deux s'il deviendrait trop petit */
  Rendu.prototype.nomGeant = function(txt, max, cy, col, maxW, cx){ var x = this.x; maxW = maxW || MW; cx = cx == null ? CX : cx;
    var f = taille(x, txt, '900', max, maxW, 30), mots = String(txt).split(' ');
    if (f < max * .62 && mots.length > 1){ var m = Math.ceil(mots.length / 2), a = mots.slice(0, m).join(' '), b = mots.slice(m).join(' ');
      var f2 = Math.min(taille(x, a, '900', max, maxW), taille(x, b, '900', max, maxW)); x.font = '900 ' + f2 + 'px ' + SANS; x.fillStyle = rgba(col, 1);
      x.fillText(a, cx, cy - f2 * .12); x.fillText(b, cx, cy + f2 * .86); return f2; }
    x.font = '900 ' + f + 'px ' + SANS; x.fillStyle = rgba(col, 1); x.fillText(txt, cx, cy + f * .36); return f; };
  /* la signature : toujours la, dans la zone sure */
  Rendu.prototype.signe = function(col, sansSite){
    var x = this.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over'; x.textAlign = 'center';
    var s = (this.d.exemple ? T().exemple : '') + (this.d.exemple && !sansSite ? '  ·  ' : '') + (sansSite ? '' : this.L.site);
    if (!s) return;
    x.globalAlpha = .92; x.fillStyle = rgba(col, 1); x.font = '700 31px ' + MONO; espace(x, s, CX, SIG_Y, 8); x.globalAlpha = 1;
  };
  /* les produits (ou les aliments) en grille, un par croche */
  Rendu.prototype.grilleProduits = function(q0, q, col, colSub){
    var x = this.x, d = this.d, n = d.items.length; if (!n) return false;
    var cells = n === 1 ? [[CX, 880, 520]] : n === 2 ? [[CX - 200, 900, 380], [CX + 200, 900, 380]] :
      n === 3 ? [[CX - 200, 720, 340], [CX + 200, 720, 340], [CX, 1140, 340]] : [[CX - 200, 720, 340], [CX + 200, 720, 340], [CX - 200, 1140, 340], [CX + 200, 1140, 340]];
    this.etiq(maj(this.L.rituel(n, d.type)), CX, 420, colSub, 30);
    for (var k = 0; k < n; k++){
      var pk = (q - q0 - k * .5) / .3; if (pk <= 0) continue; pk = eOut3(clamp(pk, 0, 1));
      var c = cells[k], sz = c[2] * (.6 + .4 * pk), im = this.imgs[k];
      x.globalAlpha = clamp(pk * 1.5, 0, 1);
      if (im) x.drawImage(im, c[0] - sz / 2, c[1] - sz / 2 - 30, sz, sz);
      else { x.strokeStyle = rgba(col, .7); x.lineWidth = 4; x.beginPath(); x.arc(c[0], c[1] - 30, sz * .26, 0, Math.PI * 2); x.stroke(); }
      x.font = '800 30px ' + SANS; x.fillStyle = rgba(col, 1);
      var ls = lignes(x, maj(d.items[k].nom), c[2] - 20, 2); for (var z = 0; z < ls.length; z++) x.fillText(ls[z], c[0], c[1] + c[2] / 2 - 10 + z * 34);
      x.globalAlpha = 1;
    }
    return true;
  };
  /* des etincelles periodiques (meme position a la fin qu'au debut de la boucle) */
  Rendu.prototype.etincelles = function(q, n, force){
    var x = this.x; x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'lighter';
    for (var i = 0; i < n; i++){
      var r1 = hash(i, 11), r2 = hash(i, 23), r3 = hash(i, 37), k = 1 + Math.floor(r3 * 2);
      var y = (((r2 - q / 16 * k) % 1) + 1) % 1 * H, xx = r1 * W, tw = .5 + .5 * Math.sin(2 * Math.PI * (q / 16 * (2 + i % 3) + r1)), sz = 10 + r3 * 30;
      x.globalAlpha = force * .6 * tw; x.drawImage(this.pointA, xx - sz / 2, y - sz / 2, sz, sz);
    }
    x.restore();
  };
  Rendu.prototype.debutD = function(){ var x = this.x; this.n++; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'center'; };
  Rendu.prototype.finD = function(sig, sansSite){ var x = this.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; this.signe(sig, sansSite); this.grain(); };

  /* ===================================================================
     D1 · L'ARCHETYPE (126 BPM). « Ma peau, c'est… » : la roue des
     archetypes tourne et s'arrete sur le drop, sur le nom tire du trait
     le plus haut (peau), de la couleur lue (cheveux), ou de « 4 sur 312 »
     (assiette). La raison est ecrite dessous. Fin : « Et toi, t'es qui ? »
     =================================================================== */
  Rendu.prototype.dessineD1 = function(tAbs){
    this.debutD();
    var x = this.x, d = this.d, L = this.L, K = this.vives(), c1 = K.c1, c2 = K.c2, tp = this.tempo(tAbs), bi = tp.bi, ph = tp.ph, q = tp.q, P = d.P;
    var hk = L.d1hook[d.type] || L.d1hook.peau, sig = NOIR, sansSite = false;
    var sc = bi === 0 || bi === 15 ? 'hook' : bi <= 3 ? 'mots' : bi <= 7 ? 'roue' : bi <= 9 ? 'drop' : bi <= 11 ? (d.phare ? 'phare' : 'drop') : bi <= 13 ? (d.items.length ? 'items' : 'drop') : 'cta';
    var fMots = [NOIR, c2, NOIR][bi - 1];
    var fond = { hook:c1, mots:fMots, roue:NOIR, drop:c1, phare:NOIR, items:c2, cta:NOIR }[sc];
    this.aplat(fond); x.save(); this.coup(ph, sc === 'drop' && bi === 8 ? .14 : .05, sc === 'drop' && bi === 8, bi);
    if (sc === 'hook'){
      this.etiq(maj((d.prenom || this.typeMot) + ' · ' + this.date), CX, 430, NOIR, 30, MW, .8);
      this.deux(hk[0] + ' ' + hk[1], hk[2], 230, 700, NOIR, NOIR);
      var bw = 760, bh = 210, by = 1060; x.fillStyle = rgba(NOIR, 1); rond(x, CX - bw / 2, by, bw, bh, 30); x.fill();
      var pul = 1 + .08 * Math.sin(ph * Math.PI);
      x.save(); x.translate(CX, by + bh / 2); x.scale(pul, pul); x.font = '900 170px ' + SANS; x.fillStyle = rgba(c1, 1); x.fillText('?', 0, 62); x.restore();
    } else if (sc === 'mots'){
      var w = hk[bi - 1], col = fMots === NOIR ? c1 : NOIR;
      var f = taille(x, w, '900', 560, MW); x.font = '900 ' + f + 'px ' + SANS; x.fillStyle = rgba(col, 1); x.fillText(w, CX, 900 + f * .36);
      for (var k = 0; k < 3; k++){ x.fillStyle = rgba(col, k === bi - 1 ? 1 : .3); x.fillRect(CX - 75 + k * 55, 1330, 40, 10); }
      sig = fMots === NOIR ? BLANC : NOIR;
    } else if (sc === 'roue'){
      this.etiq(hk.join(' '), CX, 600, BLANC, 46, MW, .95);
      var R = P.roll, N = R.length - 1, p = clamp((q - 4) / 4, 0, 1), s = N * (1 - Math.pow(1 - p, 3));
      var wy = 790, wh = 320;
      x.save(); rond(x, CX - 396, wy + 4, 792, wh - 8, 22); x.clip();
      var i0 = Math.floor(s);
      for (var j = i0 - 1; j <= i0 + 2; j++){
        if (j < 0 || j > N) continue;
        var dy = (j - s) * 300, f2 = taille(x, R[j], '900', 170, 720);
        x.font = '900 ' + f2 + 'px ' + SANS; x.globalAlpha = clamp(1 - Math.abs(dy) / 330, 0, 1); x.fillStyle = rgba(BLANC, 1);
        x.fillText(R[j], CX, wy + wh / 2 + dy + f2 * .36);
      }
      x.restore(); x.globalAlpha = 1;
      x.strokeStyle = rgba(c1, 1); x.lineWidth = 7; rond(x, CX - 400, wy, 800, wh, 26); x.stroke();
      fleche(x, CX - 445, wy + wh / 2, 26, 'droite', c1); fleche(x, CX + 445, wy + wh / 2, 26, 'gauche', c1);
      this.etiq(maj(this.typeMot) + ' · ' + this.date, CX, 1290, c1, 28, MW, .85);
      sig = BLANC;
    } else if (sc === 'drop'){
      x.save(); x.translate(CX, 960); x.rotate(q * .12); x.fillStyle = rgba(c2, .55);
      for (var r = 0; r < 14; r++){ x.rotate(Math.PI * 2 / 14); x.beginPath(); x.moveTo(0, 0); x.lineTo(1600, -170); x.lineTo(1600, 170); x.closePath(); x.fill(); }
      x.restore();
      this.etiq(hk.join(' '), CX, 610, NOIR, 40, MW);
      this.nomGeant(P.nom, 250, 950, NOIR);
      if (P.raison){
        x.font = '700 30px ' + MONO; var rw = Math.min(MW + 40, x.measureText(P.raison).width + 8 * (P.raison.length - 1) + 80);
        x.fillStyle = rgba(NOIR, 1); rond(x, CX - rw / 2, 1250, rw, 74, 37); x.fill(); this.etiq(P.raison, CX, 1298, c1, 30, rw - 60);
      }
    } else if (sc === 'phare'){
      var ph0 = d.phare, val = num(ph0.valeur), dec = Math.round(val) !== val, cur = bi === 10 ? val * eOut3(clamp(ph / .55, 0, 1)) : val;
      this.etiq(maj(ph0.label), CX, 520, c1, 40, MW);
      this.mot(formate(cur, dec), '900', 560, MW, CX, 1110, c1);
      if (ph0.unite){ x.font = '800 78px ' + SANS; x.fillStyle = rgba(BLANC, 1); x.fillText(ph0.unite, CX, 1235); }
      if (bi === 11 && d.autres.length){
        var au = d.autres.slice(0, 3), cw = MW / au.length;
        for (var i = 0; i < au.length; i++){
          var cxA = CX - MW / 2 + cw * (i + .5), pa = eOut3(clamp((ph - i * .12) / .3, 0, 1));
          this.etiq(maj(au[i].label), cxA, 1330, BLANC, 22, cw - 24, .75 * pa);
          x.globalAlpha = pa; this.mot(valTxt(au[i]), '900', 72, cw - 24, cxA, 1412, c2); x.globalAlpha = 1;
        }
      }
      sig = BLANC;
    } else if (sc === 'items'){
      this.grilleProduits(12, q, NOIR, NOIR);
    } else {
      this.deux(L.d1cta[0], L.d1cta[1], 190, 760, BLANC, c1);
      this.mot(L.site, '900', 130, MW, CX, 1250, BLANC);
      sig = BLANC; sansSite = true;
    }
    x.restore();
    this.finD(sig, sansSite);
  };

  /* ===================================================================
     D2 · LE COMPTE A REBOURS (128 BPM). 3 · 2 · 1 sur trois bips :
     trois vrais chiffres (un « top 3 » seulement s'ils sont vraiment
     classes), le nom du chiffre phare tape lettre a lettre, le drop sur
     sa valeur, puis le podium. Fin : « Et ton top 3 ? »
     =================================================================== */
  Rendu.prototype.dessineD2 = function(tAbs){
    this.debutD();
    var x = this.x, d = this.d, L = this.L, K = this.vives(), c1 = K.c1, c2 = K.c2, tp = this.tempo(tAbs), bi = tp.bi, ph = tp.ph, q = tp.q;
    var C3 = d.C3, tr = C3.trois, nT = tr.length, ph0 = d.phare, sig = NOIR, sansSite = false;
    var qb = 2 + nT;   /* debut de la montee */
    var sc = bi === 0 || bi === 15 ? 'hook' : bi === 1 ? 'zoom' : bi < qb ? 'rang' : bi <= 7 ? 'montee' : bi <= 9 ? 'drop' : bi <= 11 ? 'podium' : bi <= 13 ? (d.items.length ? 'items' : 'podium') : 'cta';
    var r = bi - 2, fR = [c1, c2, NOIR][r];
    var fond = { hook:NOIR, zoom:NOIR, rang:fR, montee:NOIR, drop:c1, podium:NOIR, items:c2, cta:NOIR }[sc];
    this.aplat(fond); x.save(); this.coup(ph, bi === 8 ? .14 : .05, bi === 8, bi);
    var titre2 = C3.classe ? L.top3 : L.enChiffres, depart = String(Math.max(1, nT));
    if (sc === 'hook'){
      this.etiq(maj((d.prenom || this.typeMot) + ' · ' + this.date), CX, 430, BLANC, 30, MW, .75);
      var nums = nT >= 3 ? ['3', '2', '1'] : nT === 2 ? ['2', '1'] : ['1'];
      x.font = '900 330px ' + SANS; x.lineJoin = 'round';
      for (var i = 0; i < nums.length; i++){
        var xx = CX + (i - (nums.length - 1) / 2) * 250;
        if (i === nums.length - 1){ x.fillStyle = rgba(c1, 1); x.fillText(nums[i], xx, 830); }
        else { x.strokeStyle = rgba(c1, 1); x.lineWidth = 8; x.strokeText(nums[i], xx, 830); }
      }
      this.deux(L.mien[d.type], titre2, 170, 1080, BLANC, c1);
    } else if (sc === 'zoom'){
      this.etiq(maj((d.prenom || this.typeMot) + ' · ' + this.date), CX, 430, BLANC, 30, MW, .75);
      var z = 1 + 1.4 * eIn3(ph);
      x.save(); x.translate(CX, 900); x.scale(z, z); x.font = '900 620px ' + SANS; x.strokeStyle = rgba(c1, 1); x.lineWidth = 9; x.lineJoin = 'round'; x.strokeText(depart, 0, 220); x.restore();
      sig = BLANC;
    } else if (sc === 'rang'){
      var rang = nT - r, it = tr[nT - 1 - r], dark = fR === NOIR, ct = dark ? c1 : NOIR, cs = dark ? BLANC : NOIR;
      x.font = '900 980px ' + SANS; x.strokeStyle = rgba(ct, .28); x.lineWidth = 6; x.lineJoin = 'round'; x.strokeText(String(rang), CX, 1300);
      this.etiq(C3.classe ? L.rang + rang : String(rang) + ' / ' + nT, CX, 430, cs, 34, MW, .85);
      this.nomGeant(maj(it.label), 120, 600, cs);
      var v = num(it.valeur), txt = v !== null ? formate(v * eOut3(clamp(ph / .35, 0, 1)), Math.round(v) !== v) : maj(String(it.valeur));
      this.mot(txt, '900', 470, MW, CX, 1110, ct);
      if (v !== null && it.unite){ x.font = '800 70px ' + SANS; x.fillStyle = rgba(cs, 1); x.fillText(it.unite, CX, 1225); }
      sig = dark ? BLANC : NOIR;
    } else if (sc === 'montee'){
      this.etiq(L.enfin, CX, 520, c1, 40, MW);
      var lab = maj(ph0 ? ph0.label : d.P.raison || this.typeMot), mots = lab.split(' '), l1 = lab, l2 = '';
      var f = taille(x, lab, '900', 200, MW);
      if (f < 120 && mots.length > 1){ var m = Math.ceil(mots.length / 2); l1 = mots.slice(0, m).join(' '); l2 = mots.slice(m).join(' '); f = Math.min(taille(x, l1, '900', 200, MW), taille(x, l2, '900', 200, MW)); }
      var tot = l1.length + l2.length, nV = Math.ceil(tot * clamp((q - qb) / (7.5 - qb), 0, 1));
      x.font = '900 ' + f + 'px ' + SANS; x.textAlign = 'left';
      var y1 = l2 ? 880 : 960, w1 = x.measureText(l1).width, w2 = x.measureText(l2).width;
      var a = l1.slice(0, nV), b = l2.slice(0, Math.max(0, nV - l1.length));
      x.fillStyle = rgba(BLANC, 1); x.fillText(a, CX - w1 / 2, y1); if (l2) x.fillText(b, CX - w2 / 2, y1 + f);
      var cl = nV <= l1.length ? CX - w1 / 2 + x.measureText(a).width : CX - w2 / 2 + x.measureText(b).width, cyc = nV <= l1.length ? y1 : y1 + f;
      x.fillStyle = rgba(c1, 1); x.fillRect(cl + 10, cyc - f * .72, f * .12, f * .8);
      x.textAlign = 'center';
      sig = BLANC;
    } else if (sc === 'drop'){
      for (var k2 = 0; k2 < 3; k2++){ var rr = (((q - 8) * .5 + k2 / 3) % 1) * 1200; x.strokeStyle = rgba(c2, .55 * (1 - rr / 1200)); x.lineWidth = 34; x.beginPath(); x.arc(CX, 960, rr + 20, 0, Math.PI * 2); x.stroke(); }
      if (ph0){
        var vd = num(ph0.valeur), cd = bi === 8 ? vd * eOut3(clamp(ph / .25, 0, 1)) : vd;
        this.etiq(maj(ph0.label), CX, 520, NOIR, 42, MW);
        this.mot(formate(cd, Math.round(vd) !== vd), '900', 640, MW, CX, 1150, NOIR);
        if (ph0.unite){ x.font = '800 80px ' + SANS; x.fillStyle = rgba(NOIR, 1); x.fillText(ph0.unite, CX, 1290); }
      } else this.nomGeant(d.P.nom, 250, 950, NOIR);
    } else if (sc === 'podium'){
      if (ph0) this.etiq(maj(ph0.label) + ' · ' + valTxt(ph0) + unite(ph0), CX, 420, c1, 30, MW);
      var g = eOut3(clamp((q - 10) / .6, 0, 1));
      if (C3.classe && nT >= 3){
        var slots = [[1, CX - 262, c2], [0, CX, c1], [2, CX + 262, BLANC]];
        for (var s2 = 0; s2 < 3; s2++){
          var o = tr[slots[s2][0]], hv = (200 + 420 * clamp(num(o.valeur) / 100, 0, 1)) * g, top = 1380 - hv, bx = slots[s2][1];
          x.fillStyle = rgba(slots[s2][2], 1); x.fillRect(bx - 118, top, 236, hv);
          x.globalAlpha = g; x.font = '900 110px ' + SANS; x.fillStyle = rgba(NOIR, 1); x.fillText(String(slots[s2][0] + 1), bx, top + 120);
          this.mot(valTxt(o), '900', 84, 236, bx, top - 40, BLANC);
          this.etiq(maj(o.label), bx, top - 140, BLANC, 22, 236, .8 * g); x.globalAlpha = 1;
        }
      } else {
        for (var i2 = 0; i2 < nT; i2++){
          var pr = eOut3(clamp((q - 10 - i2 * .35) / .4, 0, 1)), yy = 620 + i2 * 260;
          this.etiq(maj(tr[i2].label), CX, yy, BLANC, 28, MW, .8 * pr);
          x.globalAlpha = pr; this.mot(valTxt(tr[i2]) + (num(tr[i2].valeur) !== null ? unite(tr[i2]) : ''), '900', 150, MW, CX, yy + 150, c1); x.globalAlpha = 1;
        }
      }
      sig = BLANC;
    } else if (sc === 'items'){
      var its = d.items, nI = its.length;
      this.etiq(maj(L.rituel(nI, d.type)), CX, 420, NOIR, 30);
      for (var j = 0; j < nI; j++){
        var pj = eOut3(clamp((q - 12 - j * .5) / .3, 0, 1)); if (pj <= 0) continue;
        var ry = 480 + j * 245 + (nI < 4 ? (4 - nI) * 110 : 0), ox = (1 - pj) * 300;
        x.globalAlpha = pj;
        if (this.imgs[j]) x.drawImage(this.imgs[j], CX - 400 + ox, ry - 10, 230, 230);
        x.textAlign = 'left'; x.font = '900 34px ' + MONO; x.fillStyle = rgba(NOIR, .5); x.fillText('0' + (j + 1), CX - 140 + ox, ry + 70);
        x.font = '900 44px ' + SANS; x.fillStyle = rgba(NOIR, 1);
        var ls = lignes(x, maj(its[j].nom), 520, 2); for (var z2 = 0; z2 < ls.length; z2++) x.fillText(ls[z2], CX - 140 + ox, ry + 124 + z2 * 48);
        x.textAlign = 'center'; x.globalAlpha = 1;
      }
    } else {
      var cta = C3.classe ? L.d2cta : L.d2cta2;
      this.deux(cta[0], cta[1], 210, 760, BLANC, c1);
      this.mot(L.site, '900', 130, MW, CX, 1250, BLANC);
      sig = BLANC; sansSite = true;
    }
    x.restore();
    this.finD(sig, sansSite);
  };

  /* ===================================================================
     D3 · DEVINE (140 BPM, demi-tempo). Un jeu : « Devine mon indice ».
     Trois essais honnetes (plus / moins, calcules sur la vraie valeur),
     la jauge se resserre, le drop donne la reponse. Fin : « T'avais dit
     combien ? » puis « A toi de jouer ».
     =================================================================== */
  var GX = 590, GW = 600, JX = 150, JT = 440, JB = 1380;
  Rendu.prototype.fondD3 = function(){
    if (this._fD3) return this._fD3;
    var K = this.vives(), b = document.createElement('canvas'); b.width = W; b.height = H; var g = b.getContext('2d');
    g.fillStyle = rgba(NOIR, 1); g.fillRect(0, 0, W, H);
    for (var xx = 0; xx <= W; xx += 90){ g.fillStyle = rgba(K.c2, .07); g.fillRect(xx, 0, 2, H); }
    for (var yy = 0; yy <= H; yy += 90){ g.fillStyle = rgba(K.c2, .07); g.fillRect(0, yy, W, 2); }
    var h = g.createRadialGradient(GX, 900, 20, GX, 900, 900); h.addColorStop(0, rgba(K.c1, .22)); h.addColorStop(1, rgba(K.c1, 0));
    g.fillStyle = h; g.fillRect(0, 0, W, H);
    return (this._fD3 = b);
  };
  Rendu.prototype.jauge = function(G, lo, hi, marque, col, colTxt, sombre){
    var x = this.x, K = this.vives(), L = JB - JT;
    function yv(v){ return JB - clamp(v / G.max, 0, 1) * L; }
    x.fillStyle = rgba(colTxt, .12); rond(x, JX - 20, JT - 20, 40, L + 40, 20); x.fill();
    var ya = yv(hi), yb = yv(lo); x.fillStyle = rgba(col, sombre ? 1 : .85); rond(x, JX - 14, ya, 28, Math.max(4, yb - ya), 14); x.fill();
    for (var k = 0; k <= 10; k++){ var y = JB - k / 10 * L; x.fillStyle = rgba(colTxt, k % 5 ? .35 : .8); x.fillRect(JX + 26, y - 1.5, k % 5 ? 16 : 30, 3); }
    x.textAlign = 'left'; x.font = '700 24px ' + MONO; x.fillStyle = rgba(colTxt, .75);
    x.fillText('0', JX + 64, JB + 8); x.fillText(formate(G.max / 2, false), JX + 64, JB - L / 2 + 8); x.fillText(formate(G.max, false), JX + 64, JT + 8);
    x.textAlign = 'center';
    if (marque != null){ var ym = yv(marque); fleche(x, JX - 52, ym, 22, 'droite', colTxt); x.fillStyle = rgba(colTxt, 1); x.fillRect(JX - 30, ym - 3, 60, 6); }
  };
  Rendu.prototype.dessineD3 = function(tAbs){
    this.debutD();
    var x = this.x, d = this.d, L = this.L, K = this.vives(), c1 = K.c1, c2 = K.c2, tp = this.tempo(tAbs), bi = tp.bi, ph = tp.ph, q = tp.q;
    var G = d.G, ph0 = d.phare, es = G ? G.essais : [], sig = BLANC, sansSite = false;
    /* l'etat du jeu au temps bi : essai k pose au temps 2 + 2k, reponse au temps 3 + 2k */
    var k = Math.floor((bi - 2) / 2), enJeu = G && bi >= 2 && bi <= 7 && k < es.length, verdict = enJeu && (bi - 2) % 2 === 1;
    var sc = bi === 0 || bi === 15 ? 'hook' : bi === 1 ? 'tudis' : bi <= 7 ? (enJeu ? 'essai' : 'tudis') : bi <= 9 ? 'drop' : bi <= 11 ? (G ? 'combien' : 'drop') : bi <= 13 ? (d.items.length ? 'items' : 'combien') : 'cta';
    if (sc === 'drop') this.aplat(c1); else { this.aplat(NOIR); x.drawImage(this.fondD3(), 0, 0); }
    x.save(); this.coup(ph, bi === 8 ? .12 : .045, bi === 8, bi);
    var lo = 0, hi = G ? G.max : 100;
    if (G){ var kmax = sc === 'essai' ? (verdict ? k + 1 : k) : (bi >= 8 && bi < 15 ? es.length : 0); for (var i = 0; i < kmax; i++){ if (es[i].dir > 0) lo = es[i].g; else hi = es[i].g; } }
    var montrerJauge = G && (sc === 'hook' || sc === 'tudis' || sc === 'essai' || sc === 'drop');
    if (montrerJauge){
      if (sc === 'drop') this.jauge(G, lo, hi, G.v, NOIR, NOIR, true);
      else this.jauge(G, lo, hi, sc === 'essai' ? es[k].g : null, c2, BLANC);
    }
    var lab = ph0 ? maj(ph0.label) : maj(this.typeMot);
    if (sc === 'hook'){
      this.mot(L.devine, '900', 230, GW, GX, 640, c1);
      this.nomGeant(lab, 84, 740, BLANC, GW, GX);
      var pul = 1 + .07 * Math.sin(ph * Math.PI);
      x.save(); x.translate(GX, 1080); x.scale(pul, pul); x.font = '900 520px ' + SANS; x.strokeStyle = rgba(c1, 1); x.lineWidth = 10; x.lineJoin = 'round'; x.strokeText('?', 0, 190); x.restore();
    } else if (sc === 'tudis'){
      this.etiq(lab, GX, 560, c2, 30, GW);
      this.deux(L.d3q[0], L.d3q[1], 150, 820, BLANC, c1, GW, GX);
    } else if (sc === 'essai'){
      var e = es[k];
      this.etiq(lab + ' · ' + (k + 1) + '/' + es.length, GX, 500, c2, 30, GW);
      if (!verdict){
        this.mot(formate(e.g, false), '900', 420, GW, GX, 1040, BLANC);
        x.font = '900 170px ' + SANS; x.fillStyle = rgba(c1, 1); x.fillText('?', GX, 1260);
      } else {
        this.mot(e.dir > 0 ? L.plus : L.moins, '900', 170, GW, GX, 720, c1);
        var ay = 940 + (e.dir > 0 ? -1 : 1) * 40 * eOut3(clamp(ph / .4, 0, 1));
        fleche(x, GX, ay, 120, e.dir > 0 ? 'haut' : 'bas', c1);
        this.mot(formate(e.g, false), '900', 140, GW, GX, 1240, BLANC, .55);
      }
    } else if (sc === 'drop'){
      this.etiq(L.reponse, GX, 480, NOIR, 36, GW);
      if (G){
        var cv = bi === 8 ? G.v * eOut3(clamp(ph / .25, 0, 1)) : G.v;
        this.mot(formate(cv, Math.round(G.v) !== G.v), '900', 620, GW, GX, 1100, NOIR);
        if (ph0 && ph0.unite){ x.font = '800 80px ' + SANS; x.fillStyle = rgba(NOIR, 1); x.fillText(ph0.unite, GX, 1235); }
        this.etiq(lab, GX, 1330, NOIR, 30, GW);
      } else this.nomGeant(d.P.nom, 220, 950, NOIR, GW, GX);
      sig = NOIR;
    } else if (sc === 'combien'){
      this.deux(L.d3b[0], L.d3b[1], 170, 720, BLANC, c1);
      if (G){ var pr = eOut3(clamp((q - 10) / .4, 0, 1)); this.etiq(L.reponse + ' · ' + lab + ' ' + valTxt(ph0) + unite(ph0), CX, 1150, c2, 32, MW, pr); }
    } else if (sc === 'items'){
      this.grilleProduits(12, q, BLANC, c2);
    } else {
      this.deux(L.d3cta[0], L.d3cta[1], 230, 760, c1, BLANC);
      this.mot(L.site, '900', 130, MW, CX, 1270, BLANC);
      sansSite = true;
    }
    x.restore();
    this.finD(sig, sansSite);
  };

  /* ===================================================================
     D4 · LA CARTE (132 BPM, 2-step). « Ouvre ma carte » : une carte a
     collectionner, dos holographique ; elle tourne de plus en plus vite
     et se retourne sur le drop. Le gros chiffre en haut a gauche est le
     chiffre phare de la page ; au centre, la forme des vraies mesures ;
     l'edition est la date. Aucune rarete inventee. Fin : « Montre la
     tienne », puis la carte se retourne : retour a l'accroche.
     =================================================================== */
  var CW = 700, CH = 980;
  Rendu.prototype.fondD4 = function(){
    if (this._fD4) return this._fD4;
    var K = this.vives(), b = document.createElement('canvas'); b.width = W; b.height = H; var g = b.getContext('2d');
    g.fillStyle = rgba(NOIR, 1); g.fillRect(0, 0, W, H);
    var h = g.createRadialGradient(CX, 900, 40, CX, 900, 1000); h.addColorStop(0, rgba(K.c1, .38)); h.addColorStop(.5, rgba(K.c2, .10)); h.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = h; g.fillRect(0, 0, W, H);
    return (this._fD4 = b);
  };
  Rendu.prototype.dosCarte = function(){
    if (this._dos) return this._dos;
    var K = this.vives(), c = document.createElement('canvas'); c.width = CW; c.height = CH; var g = c.getContext('2d');
    rond(g, 0, 0, CW, CH, 42); g.save(); g.clip();
    g.fillStyle = rgba([NOIR[0] + 10, NOIR[1] + 10, NOIR[2] + 10], 1); g.fillRect(0, 0, CW, CH);
    g.save(); g.translate(CW / 2, CH / 2); g.rotate(-.5);
    for (var i = -30; i < 30; i++){ g.fillStyle = rgba(i % 2 ? K.c1 : K.c2, .16); g.fillRect(i * 46, -1200, 22, 2400); }
    g.restore();
    var r = g.createRadialGradient(CW / 2, CH / 2, 20, CW / 2, CH / 2, 420); r.addColorStop(0, rgba(K.c1, .4)); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, CW, CH);
    g.strokeStyle = rgba(K.c1, 1); g.lineWidth = 7; g.beginPath(); g.arc(CW / 2, CH / 2, 190, 0, Math.PI * 2); g.stroke();
    g.strokeStyle = rgba(K.c2, .9); g.lineWidth = 2; g.beginPath(); g.arc(CW / 2, CH / 2, 160, 0, Math.PI * 2); g.stroke();
    g.fillStyle = rgba(BLANC, 1); g.font = '800 74px ' + SANS; g.textAlign = 'center'; g.textBaseline = 'alphabetic'; espace(g, 'VYVRE', CW / 2, CH / 2 + 26, 12);
    g.font = '700 22px ' + MONO; g.fillStyle = rgba(BLANC, .7); espace(g, 'vyvre.fr', CW / 2, CH - 56, 6);
    g.restore();
    g.lineWidth = 10; var gr = g.createLinearGradient(0, 0, CW, CH); gr.addColorStop(0, rgba(K.c1, 1)); gr.addColorStop(1, rgba(K.c2, 1)); g.strokeStyle = gr; rond(g, 5, 5, CW - 10, CH - 10, 38); g.stroke();
    g.strokeStyle = rgba(BLANC, .25); g.lineWidth = 2; rond(g, 26, 26, CW - 52, CH - 52, 26); g.stroke();
    return (this._dos = c);
  };
  Rendu.prototype.faceCarte = function(nStats, prRadar){
    var K = this.vives(), d = this.d, L = this.L;
    if (!this._face){ this._face = document.createElement('canvas'); this._face.width = CW; this._face.height = CH; }
    var c = this._face, g = c.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, CW, CH);
    g.save(); rond(g, 0, 0, CW, CH, 42); g.clip();
    var gr = g.createLinearGradient(0, 0, CW, CH); gr.addColorStop(0, rgba(K.c1, 1)); gr.addColorStop(1, rgba(K.c2, 1)); g.fillStyle = gr; g.fillRect(0, 0, CW, CH);
    g.save(); g.translate(CW / 2, CH / 2); g.rotate(-.5); for (var i = -30; i < 30; i++){ g.fillStyle = rgba(BLANC, .07); g.fillRect(i * 46, -1200, 14, 2400); } g.restore();
    g.textBaseline = 'alphabetic';
    var ph0 = d.phare;
    g.textAlign = 'left'; g.fillStyle = rgba(NOIR, 1);
    if (ph0){ g.font = '900 170px ' + SANS; g.fillText(valTxt(ph0), 50, 200); g.font = '700 22px ' + MONO; var lb = maj(ph0.label); if (lb.length > 22) lb = lb.slice(0, 21) + '…'; espace(g, lb, 56, 240, 4, 'left'); }
    g.textAlign = 'right'; g.font = '800 34px ' + MONO; espace(g, maj(this.typeMot), CW - 52, 92, 6, 'right');
    g.font = '700 20px ' + MONO; g.fillStyle = rgba(NOIR, .7); espace(g, this.date, CW - 52, 126, 3, 'right');
    g.textAlign = 'center';
    /* au centre : la forme des vraies mesures (radar), sinon la photo du premier produit */
    var vals = d.chiffres.filter(function(c){ return num(c.valeur) !== null && est100(c); }).slice(0, 8), cx = CW / 2, cy = 440, R = 150;
    if (vals.length >= 3){
      g.strokeStyle = rgba(NOIR, .25); g.lineWidth = 2;
      for (var a = 0; a < vals.length; a++){ var an = -Math.PI / 2 + a / vals.length * Math.PI * 2; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); g.stroke(); }
      [.5, 1].forEach(function(rr){ g.beginPath(); for (var a2 = 0; a2 <= vals.length; a2++){ var an2 = -Math.PI / 2 + a2 / vals.length * Math.PI * 2; var px = cx + Math.cos(an2) * R * rr, py = cy + Math.sin(an2) * R * rr; if (a2) g.lineTo(px, py); else g.moveTo(px, py); } g.stroke(); });
      g.beginPath();
      for (var b = 0; b <= vals.length; b++){ var v = clamp(num(vals[b % vals.length].valeur) / 100, 0, 1) * prRadar, an3 = -Math.PI / 2 + b / vals.length * Math.PI * 2; var qx = cx + Math.cos(an3) * R * v, qy = cy + Math.sin(an3) * R * v; if (b) g.lineTo(qx, qy); else g.moveTo(qx, qy); }
      g.fillStyle = rgba(NOIR, .22); g.fill(); g.strokeStyle = rgba(NOIR, 1); g.lineWidth = 5; g.lineJoin = 'round'; g.stroke();
    } else if (this.imgs[0]){ g.globalAlpha = prRadar; g.drawImage(this.imgs[0], cx - 170, cy - 190, 340, 340); g.globalAlpha = 1; }
    /* le bandeau du nom */
    g.fillStyle = rgba(NOIR, 1); g.fillRect(0, 618, CW, 84);
    var nom = maj(d.prenom || d.titre || this.typeMot); var fs = taille(g, nom, '900', 58, CW - 90); g.font = '900 ' + fs + 'px ' + SANS; g.fillStyle = rgba(BLANC, 1); g.fillText(nom, CW / 2, 678);
    /* les mesures, revelees une a une */
    var st = d.chiffres.filter(function(c){ return !memeChiffre(c, ph0); }).slice(0, 6), cw = (CW - 80) / 3;
    for (var s = 0; s < Math.min(nStats, st.length); s++){
      var col = s % 3, row = Math.floor(s / 3), x0 = 40 + col * cw + 8, y0 = 790 + row * 92;
      g.textAlign = 'left'; g.fillStyle = rgba(NOIR, 1); var tv = valTxt(st[s]); var fv = taille(g, tv, '900', 52, cw - 20, 24); g.font = '900 ' + fv + 'px ' + SANS; g.fillText(tv, x0, y0);
      g.font = '700 17px ' + MONO; g.fillStyle = rgba(NOIR, .78); var l2 = maj(st[s].label); if (l2.length > 15) l2 = l2.slice(0, 14) + '…'; g.fillText(l2, x0, y0 + 24);
    }
    g.textAlign = 'left'; g.font = '700 19px ' + MONO; g.fillStyle = rgba(NOIR, .75); espace(g, L.edition + ' ' + this.date, 46, CH - 40, 3, 'left');
    g.textAlign = 'right'; espace(g, 'vyvre.fr', CW - 46, CH - 40, 3, 'right'); g.textAlign = 'center';
    g.restore();
    g.strokeStyle = rgba(NOIR, .35); g.lineWidth = 4; rond(g, 20, 20, CW - 40, CH - 40, 28); g.stroke();
    return c;
  };
  Rendu.prototype.lustreCarte = function(cx, cy, s, sx, rot, q){
    var x = this.x, p = ((q / 2) % 1); if (p > .7) return;
    p = p / .7; x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s * sx, s); rond(x, -CW / 2, -CH / 2, CW, CH, 42); x.clip();
    var bx = -CW + p * CW * 2.2, g = x.createLinearGradient(bx - 160, -200, bx + 160, 200); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.globalCompositeOperation = 'lighter'; x.fillStyle = g; x.fillRect(-CW / 2, -CH / 2, CW, CH); x.restore();
  };
  Rendu.prototype.dessineD4 = function(tAbs){
    this.debutD();
    var x = this.x, d = this.d, L = this.L, K = this.vives(), c1 = K.c1, c2 = K.c2, tp = this.tempo(tAbs), bi = tp.bi, ph = tp.ph, q = tp.q;
    this.aplat(NOIR); x.drawImage(this.fondD4(), 0, 0);
    this.etincelles(q, 26, bi >= 8 && bi <= 13 ? 1 : .6);
    /* etat de la carte : position, echelle, face, rotation */
    var cy = 900, s = 1, sx = 1, face = false, rot = 0, nSt = 0, prR = 1, titreA = 0, sig = BLANC, sansSite = false;
    if (bi <= 3){ cy = 900 + Math.sin(Math.PI * q) * 12; titreA = 1; }
    else if (bi <= 7){ var p = (q - 4) / 4, th = 7 * Math.PI * p * p; sx = Math.abs(Math.cos(th)); face = th > 6.5 * Math.PI; s = 1 + .06 * Math.sin(p * Math.PI); titreA = 1 - clamp((q - 4) / .5, 0, 1); prR = 0; }
    else if (bi <= 11){ face = true; rot = bi === 8 ? .06 * Math.sin(ph * 14) * (1 - ph) : 0; nSt = clamp(Math.floor((q - 9) * 2) + 1, 0, 6); prR = eOut3(clamp((q - 8) / .6, 0, 1)); }
    else if (bi <= 14){ face = true; nSt = 6; var e = bi === 12 ? eInOut(clamp(ph / .5, 0, 1)) : 1; s = lerp(1, .62, e); cy = lerp(900, 700, e); }
    else { var e2 = eInOut(ph), an = Math.PI * e2; s = lerp(.62, 1, e2); cy = lerp(700, 900, e2); face = an < Math.PI / 2; sx = Math.abs(Math.cos(an)); nSt = 6; titreA = e2; }
    /* l'aura, un battement par temps */
    var au = x.createRadialGradient(CX, cy, 100, CX, cy, 720 * s); au.addColorStop(0, rgba(c1, .30 * (1 - ph) + .08)); au.addColorStop(1, rgba(c1, 0));
    x.fillStyle = au; x.fillRect(0, 0, W, H);
    x.save(); this.coup(ph, bi === 8 ? .1 : .03, bi === 8, bi);
    if (bi === 8){ var rr = eOut3(ph) * 900; x.strokeStyle = rgba(c2, .7 * (1 - ph)); x.lineWidth = 26; x.beginPath(); x.arc(CX, cy, 420 + rr, 0, Math.PI * 2); x.stroke(); }
    var carte = face ? this.faceCarte(nSt, prR) : this.dosCarte();
    x.save(); x.translate(CX, cy); x.rotate(rot); x.scale(s * Math.max(.002, sx), s);
    x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 50; x.shadowOffsetY = 26; x.drawImage(carte, -CW / 2, -CH / 2); x.restore();
    this.lustreCarte(CX, cy, s, Math.max(.002, sx), rot, q);
    if (titreA > 0){ x.globalAlpha = titreA; this.mot(L.d4, '900', 92, MW, CX, 360, BLANC); x.globalAlpha = 1; }
    if (bi === 12 || bi === 13){
      var nI = d.items.length, tw = 175, gap = 20, x0 = CX - (nI * tw + (nI - 1) * gap) / 2;
      for (var k = 0; k < nI; k++){
        var pk = eOut3(clamp((q - 12.3 - k * .5) / .3, 0, 1)); if (pk <= 0) continue;
        var tx = x0 + k * (tw + gap), ty = 1150 + (1 - pk) * 80;
        x.globalAlpha = pk; x.fillStyle = rgba(BLANC, 1); rond(x, tx, ty, tw, tw, 22); x.fill();
        if (this.imgs[k]) x.drawImage(this.imgs[k], tx + 8, ty + 4, tw - 16, tw - 16);
        x.font = '900 26px ' + MONO; x.fillStyle = rgba(NOIR, .6); x.textAlign = 'left'; x.fillText('0' + (k + 1), tx + 14, ty + 34); x.textAlign = 'center';
        x.globalAlpha = 1;
      }
      if (nI){ this.etiq(maj(L.rituel(nI, d.type)), CX, 1380, c1, 28, MW); }
    }
    if (bi === 14){ this.deux(L.d4cta[0], L.d4cta[1], 140, 1170, BLANC, c1); }
    x.restore();
    this.finD(sig, sansSite);
  };

  /* ------------------------------------------------------------- le son */
  var CTX = null;
  function amorcer(){
    try {
      if (!CTX || CTX.state === 'closed'){ var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; CTX = new AC({ latencyHint:'playback' }); }
      try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch(e){}
      if (CTX.state === 'suspended') CTX.resume();
      /* iOS : un tampon muet joue dans le geste debloque la sortie */
      var b = CTX.createBuffer(1, 1, 22050), s = CTX.createBufferSource(); s.buffer = b; s.connect(CTX.destination); s.start(0);
      return CTX;
    } catch(e){ return null; }
  }
  function Son(ctx, d){
    this.ctx = ctx; this.th = d.theme; this.style = d.style || 'D'; this.d = d; this.tm = d.tm || temps(this.style);
    var out = ctx.createGain(); out.gain.value = 1.2;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3.2; comp.attack.value = .004; comp.release.value = .25;
    var bus = ctx.createGain(); bus.gain.value = this.style === 'D3' ? .5 : .9;   /* 06/10 : D3 mesuree 4 a 6 dB plus forte que les autres */
    bus.connect(comp); comp.connect(out);
    this.ecoute = ctx.createGain(); this.ecoute.gain.value = 1;
    out.connect(this.ecoute); this.ecoute.connect(ctx.destination);
    this.dest = null; try { this.dest = ctx.createMediaStreamDestination(); out.connect(this.dest); } catch(e){}
    /* reverberation synthetisee (pas de fichier d'impulsion) */
    var len = Math.floor(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++){ var dd = ir.getChannelData(ch); for (var i = 0; i < len; i++) dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    var conv = ctx.createConvolver(); conv.buffer = ir;
    var rv = ctx.createGain(); rv.gain.value = .55; conv.connect(rv); rv.connect(bus);
    this.rev = conv; this.bus = bus; this.out = out;
    var nl = ctx.sampleRate * 2, nb = ctx.createBuffer(1, nl, ctx.sampleRate), nd = nb.getChannelData(0);
    for (var k = 0; k < nl; k++) nd[k] = Math.random() * 2 - 1;
    this.bruit = nb;
  }
  Son.prototype.f = function(st){ return this.th.root * Math.pow(2, st / 12); };
  Son.prototype.env = function(g, t, a, peak, dec){ g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + a + dec); };
  Son.prototype.envoi = function(node, wet){ node.connect(this.bus); if (wet){ var s = this.ctx.createGain(); s.gain.value = wet; node.connect(s); s.connect(this.rev); } };
  Son.prototype.noise = function(t, dur){ var s = this.ctx.createBufferSource(); s.buffer = this.bruit; s.start(t, Math.random() * .8, dur + .05); return s; };
  /* la nappe : un accord doux qui s'ouvre, a la couleur du scan */
  Son.prototype.nappe = function(t0){
    var c = this.ctx, f = c.createBiquadFilter(); f.type = 'lowpass'; f.Q.value = .6;
    f.frequency.setValueAtTime(360, t0); f.frequency.exponentialRampToValueAtTime(1800, t0 + 2.8); f.frequency.exponentialRampToValueAtTime(1000, t0 + CYCLE);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(1, t0 + 1.2);
    g.gain.setValueAtTime(1, t0 + D - .3); g.gain.exponentialRampToValueAtTime(.0001, t0 + CYCLE + .45);
    f.connect(g); this.envoi(g, .4);
    var self = this, fin = t0 + CYCLE + .5;
    this.th.pad.forEach(function(st, i){
      [-7, 7].forEach(function(det){
        var o = c.createOscillator(); o.type = i === 0 ? 'sine' : 'triangle'; o.frequency.value = self.f(st); o.detune.value = det;
        var v = c.createGain(); v.gain.value = i === 0 ? .05 : .024; o.connect(v); v.connect(f); o.start(t0); o.stop(fin);
      });
    });
    var sub = c.createOscillator(); sub.type = 'sine'; sub.frequency.value = this.f(-12);
    var sg = c.createGain(); sg.gain.value = .05; sub.connect(sg); sg.connect(f); sub.start(t0); sub.stop(fin);
  };
  Son.prototype.impact = function(t){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(118, t); o.frequency.exponentialRampToValueAtTime(41, t + .55);
    var g = c.createGain(); this.env(g, t, .008, .5, .95); o.connect(g); this.envoi(g, .15); o.start(t); o.stop(t + 1.1);
    var n = this.noise(t, .5), hp = c.createBiquadFilter(); hp.type = 'lowpass'; hp.frequency.value = 900;
    var ng = c.createGain(); this.env(ng, t, .004, .07, .4); n.connect(hp); hp.connect(ng); this.envoi(ng, .5);
  };
  Son.prototype.montee = function(t, dur, peak){
    var c = this.ctx, n = this.noise(t, dur + .2), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.8;
    bp.frequency.setValueAtTime(280, t); bp.frequency.exponentialRampToValueAtTime(3400, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .14, t + dur); g.gain.exponentialRampToValueAtTime(.0001, t + dur + .12);
    n.connect(bp); bp.connect(g); this.envoi(g, .45);
  };
  Son.prototype.pince = function(t, st, peak){
    var c = this.ctx, fr = this.f(st), o = c.createOscillator(), o2 = c.createOscillator();
    o.type = 'triangle'; o.frequency.value = fr; o2.type = 'sine'; o2.frequency.value = fr * 2;
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3600, t); lp.frequency.exponentialRampToValueAtTime(700, t + .7);
    var g = c.createGain(), g2 = c.createGain(); g2.gain.value = .3;
    this.env(g, t, .006, peak || .12, .95);
    o.connect(lp); o2.connect(g2); g2.connect(lp); lp.connect(g); this.envoi(g, .55);
    o.start(t); o2.start(t); o.stop(t + 1.1); o2.stop(t + 1.1);
  };
  Son.prototype.cloche = function(t, st, peak, dec){
    var c = this.ctx, fr = this.f(st), car = c.createOscillator(), mod = c.createOscillator(), mg = c.createGain();
    car.type = 'sine'; car.frequency.value = fr; mod.type = 'sine'; mod.frequency.value = fr * 3.5;
    mg.gain.setValueAtTime(fr * 2.2, t); mg.gain.exponentialRampToValueAtTime(fr * .08, t + 1.3);
    mod.connect(mg); mg.connect(car.frequency);
    var g = c.createGain(); this.env(g, t, .004, peak || .08, dec || 2.4);
    car.connect(g); this.envoi(g, .7);
    car.start(t); mod.start(t); car.stop(t + (dec || 2.4) + .1); mod.stop(t + (dec || 2.4) + .1);
  };
  Son.prototype.tic = function(t, fr){
    var c = this.ctx, o = c.createOscillator(); o.type = 'triangle'; o.frequency.value = fr;
    var g = c.createGain(); this.env(g, t, .002, .035, .045); o.connect(g); this.envoi(g, .2); o.start(t); o.stop(t + .08);
  };
  Son.prototype.souffle = function(t, pan, inverse, peak){
    var c = this.ctx, n = this.noise(t, .5), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.3;
    bp.frequency.setValueAtTime(inverse ? 5200 : 480, t); bp.frequency.exponentialRampToValueAtTime(inverse ? 420 : 6200, t + .34);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .24, t + .11); g.gain.exponentialRampToValueAtTime(.0001, t + .44);
    n.connect(bp); bp.connect(g);
    var last = g;
    if (c.createStereoPanner){ var p = c.createStereoPanner(); p.pan.setValueAtTime(-pan, t); p.pan.linearRampToValueAtTime(pan, t + .4); g.connect(p); last = p; }
    this.envoi(last, .3);
  };
  /* une boucle entiere, calee sur l'image */
  Son.prototype.planifie = function(t0, nItems){
    var f = this['planifie' + this.style] || this.planifieA; f.call(this, t0, nItems);
  };
  Son.prototype.planifieA = function(t0, nItems){
    var a = this.th.arp;
    this.nappe(t0);
    this.impact(t0 + .24); this.cloche(t0 + .24, a[0] - 12, .045, 2.2);
    this.montee(t0 + .72, .46, .12);
    this.pince(t0 + 1.18, a[0], .09); this.pince(t0 + 1.2, a[2], .07);
    var N = 14; for (var i = 1; i <= N; i++){ var v = i / N, p = Math.log2(1 / Math.max(1e-4, 1 - v * .999)) / 10; this.tic(t0 + 2.3 + .85 * clamp(p, 0, 1), 1350 + i * 60); }
    this.cloche(t0 + 3.17, a[3], .075, 1.8);
    for (var k = 0; k < nItems; k++){ var tk = t0 + 3.42 + k * .27; this.souffle(tk, k % 2 ? -.75 : .75, false, .2); this.pince(tk + .08, a[k % a.length] + 12, .07); }
    this.souffle(t0 + 4.62, 0, true, .1);
    var tf = t0 + 4.78, self = this;
    [a[0], a[1] + 12, a[2], a[3] + 12].forEach(function(st, j){ self.cloche(tf + j * .018, st, .055, 2.8); });
    this.impact(tf);
    var sh = this.noise(tf, 1), hp = this.ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6500;
    var sg = this.ctx.createGain(); this.env(sg, tf, .01, .045, .9); sh.connect(hp); hp.connect(sg); this.envoi(sg, .6);
  };

  /* ---------- outils de son communs aux styles B, C, D */
  Son.prototype.bip = function(t, fr, dur, peak, type, wet){
    var c = this.ctx, o = c.createOscillator(); o.type = type || 'square'; o.frequency.value = fr;
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 5200;
    var g = c.createGain(); this.env(g, t, .002, peak || .02, dur || .04);
    o.connect(lp); lp.connect(g); this.envoi(g, wet == null ? .15 : wet); o.start(t); o.stop(t + (dur || .04) + .05);
  };
  Son.prototype.balai = function(t, dur, f0, f1, peak, q, type){
    var c = this.ctx, o = c.createOscillator(); o.type = type || 'sawtooth';
    o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q || 6; bp.frequency.setValueAtTime(f0 * 2, t); bp.frequency.exponentialRampToValueAtTime(f1 * 2, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .05, t + dur * .3); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(bp); bp.connect(g); this.envoi(g, .35); o.start(t); o.stop(t + dur + .05);
  };
  Son.prototype.bourdon = function(t0, notes, vol, filtre, vib){
    var c = this.ctx, f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = filtre || 900; f.Q.value = .5;
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(1, t0 + 1.0);
    g.gain.setValueAtTime(1, t0 + D - .3); g.gain.exponentialRampToValueAtTime(.0001, t0 + CYCLE + .45);
    f.connect(g); this.envoi(g, .35);
    var self = this, fin = t0 + CYCLE + .5;
    var lfo = null; if (vib){ lfo = c.createOscillator(); lfo.frequency.value = vib; var lg = c.createGain(); lg.gain.value = 9; lfo.connect(lg); lfo.start(t0); lfo.stop(fin); lfo.g = lg; }
    notes.forEach(function(st, i){ var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = self.f(st); if (lfo) lfo.g.connect(o.detune);
      var v = c.createGain(); v.gain.value = (vol || .04) * (i ? .6 : 1); o.connect(v); v.connect(f); o.start(t0); o.stop(fin); });
  };
  Son.prototype.vent = function(t0, peak){
    var c = this.ctx, n = c.createBufferSource(); n.buffer = this.bruit; n.loop = true;
    var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = .9; bp.frequency.setValueAtTime(500, t0);
    for (var k = 1; k <= 6; k++) bp.frequency.linearRampToValueAtTime(k % 2 ? 1300 : 420, t0 + k);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(peak || .03, t0 + 1); g.gain.setValueAtTime(peak || .03, t0 + D - .3); g.gain.exponentialRampToValueAtTime(.0001, t0 + CYCLE + .3);
    n.connect(bp); bp.connect(g); this.envoi(g, .4); n.start(t0); n.stop(t0 + CYCLE + .4);
  };
  Son.prototype.marimba = function(t, st, peak){
    var c = this.ctx, fr = this.f(st);
    [[1, 1], [4, .25], [10, .06]].forEach(function(h){ var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = fr * h[0];
      var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime((peak || .1) * h[1], t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + .9 / h[0] + .12);
      o.connect(g); this.envoi(g, .45); o.start(t); o.stop(t + 1.1); }, this);
  };
  Son.prototype.sable = function(t, dur, peak, pan){
    var c = this.ctx, n = this.noise(t, dur + .1), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.4;
    bp.frequency.setValueAtTime(700, t); bp.frequency.exponentialRampToValueAtTime(4200, t + dur * .55); bp.frequency.exponentialRampToValueAtTime(900, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .14, t + dur * .5); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    n.connect(bp); bp.connect(g); var last = g;
    if (c.createStereoPanner){ var p = c.createStereoPanner(); p.pan.setValueAtTime(-(pan || .6), t); p.pan.linearRampToValueAtTime(pan || .6, t + dur); g.connect(p); last = p; }
    this.envoi(last, .5);
  };
  Son.prototype.kick = function(t, peak){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(44, t + .13);
    var g = c.createGain(); this.env(g, t, .003, peak || .8, .32); o.connect(g); this.envoi(g, 0); o.start(t); o.stop(t + .4);
  };
  Son.prototype.hat = function(t, peak){
    var c = this.ctx, n = this.noise(t, .06), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 7600;
    var g = c.createGain(); this.env(g, t, .001, peak || .1, .045); n.connect(hp); hp.connect(g); this.envoi(g, .05);
  };
  Son.prototype.clap = function(t, peak){
    var c = this.ctx, n = this.noise(t, .25), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1700; bp.Q.value = .9;
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t);
    [0, .011, .022].forEach(function(dd){ g.gain.exponentialRampToValueAtTime(peak || .3, t + dd + .002); g.gain.exponentialRampToValueAtTime(.05, t + dd + .009); });
    g.gain.exponentialRampToValueAtTime(.0001, t + .2); n.connect(bp); bp.connect(g); this.envoi(g, .3);
  };
  Son.prototype.basse = function(t, st, dur, peak){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = this.f(st);
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 5; lp.frequency.setValueAtTime(1100, t); lp.frequency.exponentialRampToValueAtTime(180, t + dur);
    var g = c.createGain(); this.env(g, t, .004, peak || .16, dur); o.connect(lp); lp.connect(g); this.envoi(g, 0); o.start(t); o.stop(t + dur + .05);
  };
  Son.prototype.stab = function(t, notes, peak, dur){
    var c = this.ctx, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(3200, t); lp.frequency.exponentialRampToValueAtTime(600, t + (dur || .3));
    var g = c.createGain(); this.env(g, t, .004, peak || .07, dur || .3); lp.connect(g); this.envoi(g, .35);
    var self = this; notes.forEach(function(st){ [-9, 9].forEach(function(dt){ var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = self.f(st); o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + (dur || .3) + .05); }); });
  };

  /* B · laboratoire : bips de donnees, balayages de scanner, bourdon froid */
  Son.prototype.planifieB = function(t0, nItems){
    var a = this.th.arp, i;
    this.bourdon(t0, [-12, 7], .045, 700, 0);
    this.balai(t0 + .12, .7, 120, 900, .04, 8);
    for (i = 0; i < 4; i++) for (var c = 0; c < 9; c++) this.bip(t0 + .12 + i * .16 + c * .025, 2400 + ((i * 7 + c * 3) % 5) * 180, .018, .012);
    for (i = 0; i < 12; i++) this.bip(t0 + .42 + i * .045, 900 + ((i * 37) % 11) * 140, .03, .018);
    this.bip(t0 + .98, this.f(a[0]), .12, .05, 'sine', .4);
    this.balai(t0 + 1.15, .35, 300, 2400, .035, 10);
    for (i = 0; i < 14; i++) this.bip(t0 + 1.2 + i * .04, 700 + ((i * 53) % 13) * 120, .03, .016);
    this.bip(t0 + 1.82, this.f(a[1]), .09, .05, 'sine', .4); this.bip(t0 + 1.92, this.f(a[2]), .14, .05, 'sine', .4);
    var N = 16; for (i = 1; i <= N; i++){ var v = i / N, p = Math.log2(1 / Math.max(1e-4, 1 - v * .999)) / 10; this.bip(t0 + 2.32 + .78 * clamp(p, 0, 1), 1800 + i * 70, .015, .016, 'triangle'); }
    this.bip(t0 + 3.12, 1320, .07, .045, 'sine', .3); this.bip(t0 + 3.2, 1760, .1, .045, 'sine', .3);
    for (i = 0; i < 6; i++) this.balai(t0 + 2.55 + i * .07, .22, 400 + i * 90, 900 + i * 160, .012, 12, 'sine');
    for (var k = 0; k < nItems; k++){ var tk = t0 + 3.5 + k * .2; this.balai(tk, .3, 180, 1600, .035, 7); this.bip(tk + .3, this.f(a[k % a.length] + 12), .1, .04, 'sine', .45); }
    this.balai(t0 + 4.6, .25, 1600, 160, .03, 7);
    var tf = t0 + 4.78; this.kick(tf, .35); this.cloche(tf, a[0], .05, 2.4); this.cloche(tf + .02, a[2], .04, 2.4);
    for (i = 0; i < 10; i++) this.bip(tf + .05 + i * .05, 1200 + ((i * 29) % 9) * 160, .02, .012);
  };
  /* C · matiere : vent, sable qui tourbillonne a chaque forme, marimba quand elle se pose */
  Son.prototype.planifieC = function(t0, nItems){
    var a = this.th.arp;
    this.bourdon(t0, [0, 7, 14, 16], .03, 1400, 4.5);
    this.vent(t0, .035);
    this.sable(t0 + .12, .6, .13, .5); this.marimba(t0 + .7, a[0], .1); this.marimba(t0 + .78, a[2], .07);
    this.sable(t0 + 1.08, .52, .13, -.6); this.marimba(t0 + 1.6, a[1], .1); this.marimba(t0 + 1.68, a[3], .07);
    this.sable(t0 + 2.18, .45, .11, .6); this.marimba(t0 + 2.66, a[2], .09);
    for (var i = 0; i < 6; i++) this.marimba(t0 + 2.75 + i * .07, a[i % 4] + 12, .03);
    this.sable(t0 + 3.3, .6, .14, -.5);
    for (var k = 0; k < nItems; k++) this.marimba(t0 + 3.82 + k * .1, a[k % a.length] + (k > 1 ? 12 : 0), .09);
    this.sable(t0 + 4.7, .55, .13, .4);
    var tf = t0 + 5.18, self = this;
    [a[0] - 12, a[0], a[2], a[3]].forEach(function(st, j){ self.pince(tf + j * .03, st, .07); });
    this.impact(tf);
  };
  /* D · rythme : 120 BPM, kick sur chaque temps, clap, charleston, basse, accords qui frappent les coupes */
  Son.prototype.planifieD = function(t0, nItems){
    var p = this.th.pad, b, i;
    var ligne = [0, 0, 12, 0, 7, 0, 10, 12, 0, 0, 7];
    for (b = 0; b < 11; b++){
      var tb = t0 + b * BEAT;
      if (b !== 4) this.kick(tb, b === 0 ? .9 : .75);
      if (b % 2 === 1) this.clap(tb, .22);
      this.hat(tb + BEAT / 2, .09); this.hat(tb + BEAT * .75, .04);
      this.basse(tb, ligne[b] - 12, .22, .15); this.basse(tb + BEAT / 2, ligne[b] - 12, .16, .1);
    }
    this.stab(t0, [p[0] + 12, p[2] + 12, p[3] + 12], .06, .4);
    this.stab(t0 + .5, [p[0] + 12, p[1] + 12, p[4] + 12], .06, .25);
    this.stab(t0 + 1.0, [p[1] + 12, p[3] + 12, p[4] + 12], .07, .3);
    this.montee(t0 + 1.55, .45, .1);
    this.impact(t0 + 2.0);
    for (i = 1; i <= 10; i++) this.bip(t0 + 2.0 + i * .04, 900 + i * 110, .025, .02, 'square', .1);
    this.stab(t0 + 2.5, [p[0] + 12, p[2] + 12, p[4] + 12], .08, .45);
    var Ls = 2.0 / Math.max(1, nItems);
    for (var k = 0; k < nItems; k++) this.stab(t0 + 3.0 + k * Ls, [p[k % p.length] + 12, p[(k + 2) % p.length] + 12, p[(k + 4) % p.length] + 24], .07, .22);
    this.montee(t0 + 4.55, .45, .12);
    var tf = t0 + 5.0; this.impact(tf); this.stab(tf, [p[0], p[2] + 12, p[3] + 12, p[4] + 12], .09, 1.2); this.cloche(tf, this.th.arp[3], .05, 2.2);
  };


  /* ---------- outils de son des variantes D1 a D4 */
  Son.prototype.fb = function(st){ var f = this.f(st); while (f >= 82) f /= 2; while (f < 41) f *= 2; return f; };
  Son.prototype.courbe = function(){ if (this._cb) return this._cb; var n = 1024, cu = new Float32Array(n); for (var i = 0; i < n; i++){ var v = i / (n - 1) * 2 - 1; cu[i] = Math.tanh(2.4 * v) / Math.tanh(2.4); } return (this._cb = cu); };
  Son.prototype.s808 = function(t, st, dur, peak, glide){
    var c = this.ctx, o = c.createOscillator(), f = this.fb(st); o.type = 'sine';
    o.frequency.setValueAtTime(f * 2.4, t); o.frequency.exponentialRampToValueAtTime(f, t + .035);
    if (glide){ o.frequency.setValueAtTime(f, t + dur * .5); o.frequency.exponentialRampToValueAtTime(f * Math.pow(2, glide / 12), t + dur * .92); }
    var ws = c.createWaveShaper(); ws.curve = this.courbe();
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .45, t + .006); g.gain.setValueAtTime(peak || .45, t + dur * .55); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(ws); ws.connect(g); this.envoi(g, 0); o.start(t); o.stop(t + dur + .05);
  };
  Son.prototype.snare = function(t, peak){
    var c = this.ctx, n = this.noise(t, .2), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1300;
    var g = c.createGain(); this.env(g, t, .002, peak || .25, .15); n.connect(hp); hp.connect(g); this.envoi(g, .25);
    var o = c.createOscillator(); o.type = 'triangle'; o.frequency.setValueAtTime(230, t); o.frequency.exponentialRampToValueAtTime(150, t + .07);
    var g2 = c.createGain(); this.env(g2, t, .002, (peak || .25) * .7, .08); o.connect(g2); this.envoi(g2, .1); o.start(t); o.stop(t + .14);
  };
  /* une voix synthetique sans paroles : une scie filtree par deux formants (« a », « o ») */
  Son.prototype.chop = function(t, notes, dur, peak, voy){
    var c = this.ctx, F = voy === 'o' ? [450, 830] : [800, 1200], mix = c.createGain(), g = c.createGain();
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .1, t + .012); g.gain.setValueAtTime(peak || .1, t + dur * .55); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    F.forEach(function(fr, i){ var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fr; bp.Q.value = 6; var gg = c.createGain(); gg.gain.value = i ? 2.4 : 3.2; mix.connect(bp); bp.connect(gg); gg.connect(g); });
    var self = this; notes.forEach(function(st){ [-7, 7].forEach(function(dt){ var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = self.f(st); o.detune.value = dt; o.connect(mix); o.start(t); o.stop(t + dur + .05); }); });
    this.envoi(g, .35);
  };
  /* l'accord qui « pompe » sur chaque temps (basse du drop D1) */
  Son.prototype.wob = function(t, notes, dur, peak){
    var c = this.ctx, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 5;
    lp.frequency.setValueAtTime(300, t); lp.frequency.exponentialRampToValueAtTime(2600, t + dur * .45); lp.frequency.exponentialRampToValueAtTime(400, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(peak || .05, t + dur * .32); g.gain.setValueAtTime(peak || .05, t + dur * .8); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    lp.connect(g); this.envoi(g, .2);
    var self = this; notes.forEach(function(st){ [-12, 0, 12].forEach(function(dt){ var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = self.f(st); o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + dur + .05); }); });
  };
  Son.prototype.acid = function(t, st, dur, peak, cut, acc){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = this.f(st);
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 12; lp.frequency.setValueAtTime(cut * (acc ? 2 : 1), t); lp.frequency.exponentialRampToValueAtTime(160, t + dur * .95);
    var g = c.createGain(); this.env(g, t, .003, (peak || .06) * (acc ? 1.3 : 1), dur); o.connect(lp); lp.connect(g); this.envoi(g, .12); o.start(t); o.stop(t + dur + .05);
  };
  Son.prototype.orgue = function(t, notes, dur, peak){
    var c = this.ctx, g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .06, t + .006); g.gain.setValueAtTime(peak || .06, t + dur * .5); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2800; lp.connect(g); this.envoi(g, .3);
    var self = this; notes.forEach(function(st){ [[1, 1], [2, .5], [3, .3], [4, .14]].forEach(function(h){ var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = self.f(st) * h[0]; var v = c.createGain(); v.gain.value = h[1] / notes.length; o.connect(v); v.connect(lp); o.start(t); o.stop(t + dur + .05); }); });
  };
  /* la cymbale a l'envers : monte et s'arrete net sur le temps (sert aussi de raccord de boucle) */
  Son.prototype.inverse = function(tFin, dur, peak){
    var c = this.ctx, t = tFin - dur, n = this.noise(t, dur), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.setValueAtTime(9000, t); hp.frequency.exponentialRampToValueAtTime(2400, tFin);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .12, tFin - .012); g.gain.linearRampToValueAtTime(0, tFin);
    n.connect(hp); hp.connect(g); this.envoi(g, .15);
  };
  Son.prototype.crash = function(t, peak, dur){
    var c = this.ctx, n = this.noise(t, dur || 1.1), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 5000;
    var g = c.createGain(); this.env(g, t, .003, peak || .09, dur || 1.1); n.connect(hp); hp.connect(g); this.envoi(g, .4);
  };
  Son.prototype.sirene = function(t, dur, st0, st1, peak){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(this.f(st0), t); o.frequency.exponentialRampToValueAtTime(this.f(st1), t + dur);
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(500, t); lp.frequency.exponentialRampToValueAtTime(4000, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak || .03, t + dur * .95); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(lp); lp.connect(g); this.envoi(g, .3); o.start(t); o.stop(t + dur + .02);
  };

  /* D1 · l'archetype : future house 126 BPM. Accroche chantee (voix sans paroles),
     roulement de caisse claire et tic de la roue a chaque nom, drop qui pompe */
  Son.prototype.planifieD1 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, a = this.th.arp, i, self = this;
    function T(q){ return t0 + q * b; }
    for (i = 0; i < 16; i++){
      var plein = i < 6 || i >= 8, groove = i < 4 || i >= 8;
      if (plein) this.kick(T(i), i === 8 ? 1 : .8);
      if (groove && i % 2 === 1) this.clap(T(i), .26);
      if (groove){ this.hat(T(i + .5), .1); this.hat(T(i + .25), .025); this.hat(T(i + .75), .04); }
    }
    for (i = 0; i < 6; i++){ this.basse(T(i), -12, b * .42, .14); this.basse(T(i + .5), 0, b * .3, .08); }
    var motif = [[0, a[0]], [.75, a[1]], [1.5, a[2]], [2.5, a[1]], [3, a[3]], [3.5, a[2]]];
    [0, 8, 12].forEach(function(o, n){ motif.forEach(function(m){ self.chop(T(o + m[0]), [m[1] - 12], b * .55, .1, n === 2 ? 'o' : 'a'); }); });
    for (i = 1; i <= 3; i++) this.stab(T(i), [p[0] + 12, p[2] + 12, p[3] + 12], .06, .22);
    /* la roue : un tic a chaque nom qui passe (memes instants que l'image) */
    var N = Math.max(1, ((this.d.P && this.d.P.roll) ? this.d.P.roll.length : 2) - 1);
    for (i = 1; i < N; i++){ var pp = 1 - Math.pow(1 - i / N, 1 / 3); this.bip(T(4 + 4 * pp), 2300 + i * 70, .03, .045, 'triangle', .1); }
    var roll = []; for (i = 0; i < 4; i++) roll.push(4 + i * .5); for (i = 0; i < 4; i++) roll.push(6 + i * .25); for (i = 0; i < 6; i++) roll.push(7 + i * .125);
    roll.forEach(function(q, n){ self.snare(T(q), .07 + .15 * n / roll.length); });
    this.montee(T(4), 4 * b - .03, .15); this.sirene(T(6), 2 * b - .02, a[0] - 24, a[0] - 12, .035);
    /* le drop */
    this.impact(T(8)); this.crash(T(8), .1, 1.1);
    for (i = 8; i < 16; i++){
      var chd = i < 12 ? [p[0], p[2], p[3]] : [p[1] - 12, p[3] - 12, p[4] - 12];
      this.wob(T(i), chd, b * .98, .045); this.basse(T(i), i < 12 ? -12 : p[1] - 24, b * .7, .15);
    }
    this.chop(T(14), [a[3] - 12], b * .4, .1, 'o'); this.chop(T(14.5), [a[2] - 12], b * .4, .1, 'o');
    this.inverse(T(16), b * 1.1, .12);
  };
  /* D2 · le compte a rebours : techno 128 BPM. Basse qui roule, trois bips (3, 2, 1),
     une touche par lettre, puis la ligne acide sur le drop */
  Son.prototype.planifieD2 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, a = this.th.arp, i, s, self = this, nT = this.d.C3 ? this.d.C3.trois.length : 3, qb = 2 + nT;
    function T(q){ return t0 + q * b; }
    for (i = 0; i < 16; i++){
      var on = i < qb || i >= 8;
      if (on) this.kick(T(i), i === 8 ? 1 : .82);
      if (on && i % 2 === 1) this.clap(T(i), .22);
      if (i < qb) for (s = 1; s < 4; s++) this.acid(T(i + s * .25), -12, b * .2, .05, 520, s === 2);
      if (i >= 8){ this.hat(T(i + .5), .12); this.hat(T(i + .25), .03); this.hat(T(i + .75), .03); }
      else if (on) this.hat(T(i + .5), .06);
    }
    for (i = 0; i < nT; i++){ this.bip(T(2 + i), this.f(a[0]), .16, .08, 'square', .2); this.stab(T(2 + i), [p[0] + 12, p[2] + 12, p[3] + 12], .05, .2); }
    for (i = 0; i < Math.round((7.5 - qb) * 2); i++) this.bip(T(qb + i * .5), 2900 + i * 90, .02, .03, 'square', .05);
    for (i = 0; i < 4; i++) this.snare(T(7 + i * .25), .1 + i * .04);
    this.montee(T(qb), (8 - qb) * b - .03, .15);
    this.bip(T(8), this.f(a[0] + 12), .5, .09, 'square', .3); this.impact(T(8)); this.crash(T(8), .1, 1.1);
    var seq = [0, 0, 12, 0, 7, 0, 10, 12, 0, 3, 0, 12, 7, 0, 5, 7];
    for (i = 0; i < 32; i++) this.acid(T(8 + i * .25), seq[i % 16] - 12, b * .22, .055, 600 + 1800 * i / 32, i % 4 === 2);
    this.stab(T(14), [p[0] + 12, p[2] + 12, p[4] + 12], .07, .35);
    this.inverse(T(16), b * 1.1, .12);
  };
  /* D3 · devine : trap demi-tempo 140 BPM, 808 qui glisse, bruits de jeu (question,
     plus = arpege qui monte, moins = qui descend), fanfare sur la reponse */
  Son.prototype.planifieD3 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, a = this.th.arp, i, self = this, G = this.d.G, es = G ? G.essais : [];
    function T(q){ return t0 + q * b; }
    var bas = [[0, 0, 1.4], [1.5, 0, .45], [3.5, 0, .4], [4, p[1] - 12, 1.4], [6.75, p[1] - 12, .3], [8, 0, 1.8, 12], [9.75, 0, .3], [10.5, -2, .5], [12, p[1] - 12, 1.4], [14, 0, .9], [15.5, 0, .45, 12]];
    bas.forEach(function(n){ self.s808(T(n[0]), n[1], n[2] * b, .32, n[3]); self.kick(T(n[0]), .6); });
    [2, 6, 10, 14].forEach(function(q){ self.snare(T(q), .26); self.clap(T(q), .16); });
    for (i = 0; i < 32; i++){ var qh = i * .5; if (!(qh >= 7 && qh < 8)) this.hat(T(qh), i % 2 ? .05 : .08); }
    for (i = 0; i < 6; i++) this.hat(T(7 + i / 6), .05 + .015 * i);
    for (i = 0; i < 3; i++) this.hat(T(13.5 + i / 6), .06);
    es.forEach(function(e, k){
      var tq = 2 + 2 * k, tv = 3 + 2 * k;
      self.bip(T(tq), self.f(a[0]), .09, .06, 'square', .15); self.bip(T(tq + .25), self.f(a[1]), .14, .06, 'square', .15);
      (e.dir > 0 ? [a[0], a[1], a[2]] : [a[2], a[1], a[0]]).forEach(function(st, j){ self.bip(T(tv + j * .125), self.f(st + 12), .1, .06, 'square', .2); });
    });
    for (i = 1; i < 8; i++) if (i === 1 || i >= 2 + 2 * es.length){ this.tic(T(i), 1800); this.tic(T(i + .5), 1300); }
    this.montee(T(6), 2 * b - .03, .12);
    [0, 1, 2, 3].forEach(function(j){ self.bip(T(8 + j * .0625), self.f(a[j] + 12), .22, .065, 'square', .3); });
    this.impact(T(8)); this.crash(T(8), .09, 1.1); this.cloche(T(8), a[3], .05, 1.8);
    var mel = [a[0], a[2], a[1], a[3], a[2], a[1], a[0], a[1], a[2], a[3]];
    for (i = 0; i < 10; i++) this.bip(T(9 + i * .5), this.f(mel[i]), .12, .032, 'square', .25);
    this.inverse(T(16), b * 1.1, .12);
  };
  /* D4 · la carte : UK garage 2-step 132 BPM. Orgue en accords, basse ronde, charleston
     chaloupe ; un souffle a chaque demi-tour de la carte, un scintillement qui monte */
  Son.prototype.planifieD4 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, a = this.th.arp, i, k, self = this;
    function T(q){ return t0 + q * b; }
    var chA = [p[0] + 12, p[2] + 12, p[3] + 12], chB = [p[1], p[3], p[4]];
    for (var bar = 0; bar < 4; bar++){
      var o = bar * 4, ch = bar % 2 ? chB : chA, rt = bar % 2 ? p[1] - 12 : 0, mince = bar === 1;
      if (!mince){ this.kick(T(o), .85); this.kick(T(o + 2.5), .7); if (bar >= 2) this.kick(T(o + 3.75), .38); }
      this.clap(T(o + 1), mince ? .1 : .24); this.clap(T(o + 3), mince ? .1 : .24); if (!mince) this.snare(T(o + 3), .09);
      for (k = 0; k < 4; k++){ this.hat(T(o + k + .5), mince ? .05 : .09); this.hat(T(o + k + .29), .028); this.hat(T(o + k + .79), .028); }
      (mince ? [.5] : [.5, 1.25, 2.5, 3.25]).forEach(function(x){ self.orgue(T(o + x), ch, b * .45, .07); });
      if (!mince){ this.s808(T(o), rt, b * .7, .3); this.s808(T(o + .75), rt, b * .25, .22); this.s808(T(o + 2.5), rt, b * .9, .3); }
    }
    for (i = 0; i < 16; i++) this.bip(T(4 + i * .25), this.f(a[i % 4] + 12 * Math.floor(i / 4)), .12, .022 + .0025 * i, 'triangle', .45);
    for (k = 0; k < 7; k++){ var pp = Math.sqrt((k + .5) / 7); this.souffle(T(4 + 4 * pp), k % 2 ? -.6 : .6, false, .11); }
    this.inverse(T(8), b * 1.2, .12);
    this.impact(T(8)); this.crash(T(8), .09, 1.1);
    a.forEach(function(st, j){ self.cloche(T(8) + j * .02, st, .045, 2.2); });
    for (k = 0; k < Math.min(4, nItems); k++) this.pince(T(12.3 + k * .5), a[k % 4] + 12, .06);
    this.souffle(T(15.2), .5, true, .1);
    this.inverse(T(16), b * 1.1, .1);
  };

  /* ------------------------------------------------------- l'interface */
  var STYLE = '\
.vyw{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;\
padding:calc(env(safe-area-inset-top) + 54px) 16px calc(env(safe-area-inset-bottom) + 18px);background:rgba(4,4,4,.94);\
-webkit-backdrop-filter:blur(18px);backdrop-filter:blur(18px);opacity:0;transition:opacity .35s ease;font-family:Inter,"Helvetica Neue",Arial,sans-serif;color:#f3ead6;box-sizing:border-box}\
.vyw *{box-sizing:border-box}\
.vyw.on{opacity:1}\
.vyw-haut{position:absolute;top:calc(env(safe-area-inset-top) + 10px);left:12px;right:12px;display:flex;justify-content:space-between;align-items:center}\
.vyw-haut b{font:200 15px/1 Inter,"Helvetica Neue",Arial,sans-serif;letter-spacing:.42em;color:#d9c9a3;padding-left:6px}\
.vyw-ic{display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 14px;border-radius:999px;border:1px solid rgba(217,201,163,.28);background:rgba(255,255,255,.03);color:#d9c9a3;\
font:500 10.5px/1 "JetBrains Mono","SF Mono",Menlo,monospace;letter-spacing:.2em;text-transform:uppercase;cursor:pointer;-webkit-tap-highlight-color:transparent}\
.vyw-ic svg{width:16px;height:16px;flex:none}\
.vyw-ic[aria-pressed=false]{opacity:.55}\
.vyw-x{width:40px;padding:0;justify-content:center}\
.vyw-scene{position:relative;height:min(70vh,calc((100vw - 32px)*16/9));height:min(70svh,calc((100vw - 32px)*16/9));aspect-ratio:9/16;border-radius:22px;overflow:hidden;flex:none;\
background:#000;box-shadow:0 40px 90px -30px rgba(0,0,0,.95),0 0 0 1px rgba(217,201,163,.2)}\
.vyw-scene canvas{display:block;width:100%;height:100%}\
.vyw-prog{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(217,201,163,.15);transition:opacity .4s}\
.vyw-prog i{display:block;height:100%;width:0;background:#d9c9a3}\
.vyw-etat{margin:2px 0 0;min-height:18px;max-width:340px;text-align:center;font:400 12px/1.5 Inter,"Helvetica Neue",Arial,sans-serif;letter-spacing:.02em;color:rgba(243,234,214,.72)}\
.vyw-actions{display:flex;gap:10px;width:min(100%,360px)}\
.vyw-b{flex:1;min-height:52px;border-radius:999px;cursor:pointer;font:500 12px/1 Inter,"Helvetica Neue",Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;-webkit-tap-highlight-color:transparent;transition:transform .2s,box-shadow .3s,opacity .3s}\
.vyw-b:active{transform:scale(.97)}\
.vyw-p{border:0;color:#14110b;background:linear-gradient(180deg,#efe4c8 0%,#d3bf92 100%);box-shadow:0 14px 34px -14px rgba(217,201,163,.6)}\
.vyw-s{border:1px solid rgba(217,201,163,.45);background:transparent;color:#d9c9a3}\
.vyw-b.attente{opacity:.6}\
.vyw-p.go{animation:vywGo 1.1s ease-in-out infinite}\
.vyw-diag{margin:0;max-width:360px;text-align:left;font:400 10px/1.45 "JetBrains Mono","SF Mono",Menlo,monospace;color:#9fe0c0;word-break:break-word;white-space:normal}\
@keyframes vywGo{50%{box-shadow:0 0 0 6px rgba(217,201,163,.25),0 14px 34px -14px rgba(217,201,163,.6)}}\
.vyw-cta{position:relative;display:inline-flex;align-items:center;gap:14px;padding:12px 26px 12px 12px;border-radius:999px;cursor:pointer;overflow:hidden;\
border:1px solid rgba(217,201,163,.5);background:radial-gradient(120% 140% at 0% 0%,rgba(217,201,163,.16) 0%,rgba(217,201,163,0) 55%),#0b0a08;color:#f3ead6;text-align:left;\
font-family:Inter,"Helvetica Neue",Arial,sans-serif;box-shadow:0 18px 44px -20px rgba(0,0,0,.9),inset 0 1px 0 rgba(255,255,255,.06);transition:transform .25s,border-color .3s,box-shadow .3s;-webkit-tap-highlight-color:transparent}\
.vyw-cta:hover{transform:translateY(-2px);border-color:rgba(217,201,163,.85);box-shadow:0 24px 50px -20px rgba(0,0,0,.9),0 0 0 4px rgba(217,201,163,.08)}\
.vyw-cta:active{transform:scale(.98)}\
.vyw-cta::after{content:"";position:absolute;top:0;bottom:0;left:-60%;width:40%;background:linear-gradient(100deg,transparent,rgba(255,244,220,.18),transparent);animation:vywSheen 3.8s ease-in-out infinite;pointer-events:none}\
@keyframes vywSheen{0%,55%{left:-60%}100%{left:130%}}\
.vyw-cta .vyw-o{position:relative;flex:none;width:42px;height:42px;border-radius:50%;background:conic-gradient(from 210deg,#d9c9a3,var(--vyw-a,#c8896a),#f3ead6,#d9c9a3);box-shadow:0 0 22px -4px var(--vyw-a,#c8896a)}\
.vyw-cta .vyw-o::before{content:"";position:absolute;inset:2px;border-radius:50%;background:#0b0a08}\
.vyw-cta .vyw-o::after{content:"";position:absolute;left:17px;top:13px;border-style:solid;border-width:8px 0 8px 12px;border-color:transparent transparent transparent #d9c9a3}\
.vyw-cta .vyw-t{display:flex;flex-direction:column;gap:5px}\
.vyw-cta .vyw-t b{white-space:nowrap;font:500 15px/1.1 Inter,"Helvetica Neue",Arial,sans-serif;letter-spacing:.01em;color:#f6eedb}\
.vyw-cta .vyw-t small{font:400 9.5px/1 "JetBrains Mono","SF Mono",Menlo,monospace;letter-spacing:.24em;text-transform:uppercase;color:rgba(217,201,163,.8)}\
.vyw-zone{display:flex;justify-content:center;padding:18px 0}\
';
  function style(){
    if (document.getElementById('vyw-style')) return;
    var s = document.createElement('style'); s.id = 'vyw-style'; s.textContent = STYLE; document.head.appendChild(s);
  }
  var IC_SON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z"/><path class="o1" d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path class="o2" d="M18 6.5a7.6 7.6 0 0 1 0 11"/></svg>';
  var IC_X = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function choisirType(){
    if (!window.MediaRecorder) return null;
    var c = ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4;codecs=avc1,mp4a', 'video/mp4;codecs=h264,aac', 'video/mp4',
             'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'];
    for (var i = 0; i < c.length; i++){ try { if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c[i])) return c[i]; } catch(e){} }
    return '';
  }
  function telecharger(blob, nom){
    var u = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = u; a.download = nom; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ a.remove(); URL.revokeObjectURL(u); }, 60000);
  }

  var OUVERT = null;

  function ouvrir(donnees){
    if (OUVERT) OUVERT.fermer();
    style();
    var d = normalise(donnees), L = T(), tm = d.tm;
    var ctx = amorcer();
    var DIAG = /[?&]diag=1(&|$)/.test(location.search), diag = { mime:'', fichier:'', duree:'', partage:L.diagPartage.aucun };

    var el = document.createElement('div'); el.className = 'vyw'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Wrap vyvre');
    el.innerHTML =
      '<div class="vyw-haut"><b>VYVRE</b><span style="display:flex;gap:8px">' +
        '<button type="button" class="vyw-ic vyw-son" aria-pressed="true">' + IC_SON + '<span></span></button>' +
        '<button type="button" class="vyw-ic vyw-x"></button></span></div>' +
      '<div class="vyw-scene"><canvas width="' + W + '" height="' + H + '"></canvas><div class="vyw-prog"><i></i></div></div>' +
      '<p class="vyw-etat" aria-live="polite"></p>' + (DIAG ? '<p class="vyw-diag"></p>' : '') +
      '<div class="vyw-actions"><button type="button" class="vyw-b vyw-p"></button><button type="button" class="vyw-b vyw-s"></button></div>';
    var q = function(s){ return el.querySelector(s); };
    q('.vyw-son span').textContent = L.son;
    q('.vyw-x').innerHTML = IC_X; q('.vyw-x').setAttribute('aria-label', L.fermer);
    q('.vyw-p').textContent = L.partager; q('.vyw-s').textContent = L.enregistrer;
    var canvas = q('canvas'), etatEl = q('.vyw-etat'), prog = q('.vyw-prog i');
    function etat(s){ etatEl.textContent = s || ''; }
    etat(L.prep);
    /* ?diag=1 : une ligne technique pour les tests sur telephone (jamais montree au public) */
    function montreDiag(){
      if (!DIAG) return; var el2 = q('.vyw-diag'); if (!el2) return;
      var f = null; try { f = resultat && resultat.blob ? new File([resultat.blob], resultat.nom, { type:resultat.type }) : null; } catch(e){}
      var cs = '?'; try { cs = f && navigator.canShare ? (navigator.canShare({ files:[f] }) ? 'oui' : 'non') : (navigator.canShare ? '?' : 'non'); } catch(e){ cs = 'erreur ' + e.name; }
      el2.textContent = 'rec: ' + (diag.mime || '-') + ' | fichier: ' + (diag.fichier || '-') + ' | durée: ' + (diag.duree || '-') +
        ' | share: ' + (navigator.share ? 'oui' : 'non') + ' | canShare(files): ' + cs + ' | dernier partage: ' + diag.partage + ' | style ' + d.style;
    }
    document.body.appendChild(el);
    var htmlOv = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function(){ el.classList.add('on'); });

    var R = new Rendu(canvas, d), son = null, raf = 0, ferme = false, t0 = 0, perf0 = 0, audioHorloge = false;
    var prochain = 0, rec = null, vstream = null, morceaux = [], resultat = null, enAttente = null, premier = true, enregistre = false, recLance = false;
    var resoudre, pret = new Promise(function(r){ resoudre = r; });
    R.dessine(0);

    function maintenant(){ return audioHorloge ? ctx.currentTime - t0 : (performance.now() - perf0) / 1000; }

    function fini(res){
      resultat = res; prog.parentNode.style.opacity = '0';
      q('.vyw-p').classList.remove('attente'); q('.vyw-s').classList.remove('attente');
      if (res.erreur){ etat(L.erreur); }
      else if (res.image){ etat(L.sansVideo); }
      else etat(L.pret);
      resoudre(res.blob ? { type:res.type, taille:res.blob.size, nom:res.nom, image:!!res.image, blob:res.blob } : { erreur:true });
      if (res.blob){ diag.fichier = res.type + ' ' + (res.blob.size / 1048576).toFixed(2) + ' Mo';
        if (!res.image) mesurerDuree(res.blob).then(function(s){ diag.duree = s == null ? '?' : s.toFixed(2) + ' s'; res.duree = s; montreDiag(); }); }
      montreDiag();
      if (enAttente === 'enregistrer'){ enAttente = null; actionEnregistrer(); }
      else if (enAttente === 'partager'){ enAttente = null; if (!res.erreur){ etat(L.pretTouchez); q('.vyw-p').classList.add('go'); } }
    }
    function versImage(){
      R.dessine(tm.poster);
      try {
        canvas.toBlob(function(b){ if (b && b.size) fini({ blob:b, type:'image/png', nom:'vyvre-wrap.png', image:true }); else fini({ erreur:true }); }, 'image/png');
      } catch(e){ fini({ erreur:true }); }
    }
    function demarrerEnregistrement(){
      var mime = choisirType(); diag.mime = mime === null ? 'aucun MediaRecorder' : (mime || 'défaut'); montreDiag();
      if (mime === null || !canvas.captureStream){ return false; }
      try {
        vstream = canvas.captureStream(30);
        var pistes = vstream.getVideoTracks();
        if (son && son.dest) pistes = pistes.concat(son.dest.stream.getAudioTracks());
        var flux = new MediaStream(pistes), opts = { videoBitsPerSecond:8000000, audioBitsPerSecond:160000 };
        if (mime) opts.mimeType = mime;
        rec = new MediaRecorder(flux, opts);
        rec.ondataavailable = function(e){ if (e.data && e.data.size) morceaux.push(e.data); };
        rec.onstop = function(){
          try { vstream.getTracks().forEach(function(tr){ tr.stop(); }); } catch(e){}
          var type = String(rec.mimeType || mime || 'video/webm').split(';')[0] || 'video/webm';
          var blob = new Blob(morceaux, { type:type });
          if (!blob.size){ versImage(); return; }
          fini({ blob:blob, type:type, nom:'vyvre-wrap.' + (/mp4/.test(type) ? 'mp4' : 'webm') });
        };
        rec.onerror = function(){ try { rec.stop(); } catch(e){} };
        rec.start(250);
        return true;
      } catch(e){ rec = null; return false; }
    }

    function image(){
      if (ferme) return;
      raf = requestAnimationFrame(image);
      var t = maintenant();
      if (t < 0) return;
      /* le son de la boucle suivante, planifie un peu en avance */
      if (son && audioHorloge && t > prochain - .35){ try { son.planifie(t0 + prochain, d.items.length); } catch(e){} prochain += tm.CYCLE; }
      if (premier){
        /* D1 a D4 : l'enregistrement part sur le premier temps, pour que la video boucle sans couture */
        if (tm.boucle && !recLance){ recLance = true; enregistre = demarrerEnregistrement(); etat(enregistre ? L.creation : L.prep); }
        prog.style.width = (clamp(t / tm.FIN_REC, 0, 1) * 100).toFixed(1) + '%';
        if (t >= tm.FIN_REC){
          premier = false;
          if (rec && rec.state !== 'inactive'){ try { rec.stop(); } catch(e){ versImage(); } }
          else if (!enregistre) versImage();
        }
        R.dessine(tm.boucle ? t % tm.CYCLE : Math.min(t, tm.CYCLE - .001));
        return;
      }
      R.dessine(t % tm.CYCLE);
    }

    function lancer(){
      if (ferme) return;
      if (ctx){ try { son = new Son(ctx, d); } catch(e){ son = null; } }
      audioHorloge = !!(son && ctx && ctx.state === 'running');
      if (audioHorloge){ t0 = ctx.currentTime + .15; }
      perf0 = performance.now() + 150;
      prochain = 0;
      if (!tm.boucle){ enregistre = demarrerEnregistrement(); etat(enregistre ? L.creation : L.prep); }
      else etat(L.creation);
      image();
    }

    function actionPartager(){
      if (!resultat || resultat.erreur){ if (!resultat){ enAttente = 'partager'; q('.vyw-p').classList.add('attente'); etat(L.creation); } return; }
      q('.vyw-p').classList.remove('go');
      var fichier = null;
      try { fichier = new File([resultat.blob], resultat.nom, { type:resultat.type }); } catch(e){}
      /* uniquement le fichier, sans texte ni lien : sur iOS, un texte fait disparaitre Instagram et TikTok de la feuille de partage */
      if (fichier && navigator.share && navigator.canShare && navigator.canShare({ files:[fichier] })){
        navigator.share({ files:[fichier] }).then(function(){ etat(L.partage); diag.partage = L.diagPartage.ok; montreDiag(); }).catch(function(e){
          diag.partage = (e && e.name === 'AbortError') ? L.diagPartage.annule : L.diagPartage.erreur + ' ' + (e && e.name || ''); montreDiag();
          if (e && e.name === 'AbortError') return;
          telecharger(resultat.blob, resultat.nom); etat(L.sansPartage);
        });
      } else { telecharger(resultat.blob, resultat.nom); etat(L.sansPartage); diag.partage = L.diagPartage.telecharge; montreDiag(); }
    }
    function actionEnregistrer(){
      if (!resultat){ enAttente = 'enregistrer'; q('.vyw-s').classList.add('attente'); etat(L.creation); return; }
      if (resultat.erreur) return;
      telecharger(resultat.blob, resultat.nom); etat(L.enregistre);
    }
    q('.vyw-p').addEventListener('click', actionPartager);
    q('.vyw-s').addEventListener('click', actionEnregistrer);
    q('.vyw-son').addEventListener('click', function(){
      var on = this.getAttribute('aria-pressed') !== 'true'; this.setAttribute('aria-pressed', String(on));
      if (son){ try { son.ecoute.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, .05); } catch(e){} }
      if (on && ctx && ctx.state === 'suspended') ctx.resume();
    });
    function clavier(e){ if (e.key === 'Escape') ctrl.fermer(); }
    document.addEventListener('keydown', clavier);
    q('.vyw-x').addEventListener('click', function(){ ctrl.fermer(); });

    var ctrl = {
      pret: pret,
      el: el, canvas: canvas,
      /* pour les tests : fige l'animation a un instant donne */
      figer: function(t){ cancelAnimationFrame(raf); raf = 0; R.dessine(t); },
      fermer: function(){
        if (ferme) return; ferme = true; cancelAnimationFrame(raf);
        try { if (rec && rec.state !== 'inactive') rec.stop(); } catch(e){}
        try { if (son){ son.ecoute.gain.setTargetAtTime(0, ctx.currentTime, .04); son.out.disconnect(); } } catch(e){}
        try { if (navigator.audioSession) navigator.audioSession.type = 'auto'; } catch(e){}
        document.removeEventListener('keydown', clavier);
        document.documentElement.style.overflow = htmlOv;
        el.classList.remove('on'); setTimeout(function(){ el.remove(); }, 380);
        if (OUVERT === ctrl) OUVERT = null;
      }
    };
    OUVERT = ctrl; ctrl.donnees = d;
    try { window.VyWrap.dernier = ctrl; } catch(e){}

    /* les polices et les photos d'abord, puis on lance */
    var polices = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, attendre(900)]) : Promise.resolve();
    var photos = Promise.all(d.items.map(function(it){ return chargeImage(it.image).then(function(im){ return im ? preRendu(im, it.fond) : null; }); }));
    Promise.all([polices, photos]).then(function(r){ R.imgs = r[1]; setTimeout(function(){ q('.vyw-p').focus({ preventScroll:true }); }, 50); lancer(); })
      .catch(function(){ lancer(); });
    return Promise.resolve(ctrl);
  }

  /* le bouton « Créer mon Wrap », le meme sur toutes les pages */
  function bouton(fournir, opts){
    style(); opts = opts || {};
    var L = T(), b = document.createElement('button');
    b.type = 'button'; b.className = 'vyw-cta';
    var th = THEMES[opts.type] || THEMES.peau; b.style.setProperty('--vyw-a', th.a);
    b.innerHTML = '<span class="vyw-o" aria-hidden="true"></span><span class="vyw-t"><b></b><small></small></span>';
    b.querySelector('b').textContent = L.creer; b.querySelector('small').textContent = L.creerSous;
    b.addEventListener('click', function(){
      amorcer();
      Promise.resolve().then(fournir).then(function(dn){ if (dn) ouvrir(dn); }).catch(function(e){ console.warn('[VyWrap]', e); });
    });
    return b;
  }

  /* un apercu anime dans un canvas donne (page des propales) : boucle sans enregistrement, son a la demande */
  function apercu(canvas, donnees){
    canvas.width = W; canvas.height = H;
    var d = normalise(donnees), R = new Rendu(canvas, d), raf = 0, arret = false, debut = performance.now(), dernier = 0, visible = true, CY = d.tm.CYCLE;
    var son = null, ctx = null, t0 = 0, prochain = 0, fige = false;
    R.dessine(0);
    var pret = Promise.all(d.items.map(function(it){ return chargeImage(it.image).then(function(im){ return im ? preRendu(im, it.fond) : null; }); }))
      .then(function(r){ R.imgs = r; debut = performance.now(); });
    function boucle(now){
      if (arret) return; raf = requestAnimationFrame(boucle);
      if (!visible || fige || now - dernier < 31) return; dernier = now;
      var t;
      if (son){ t = ctx.currentTime - t0; if (t > prochain - .35){ try { son.planifie(t0 + prochain, d.items.length); } catch(e){} prochain += CY; } }
      else t = (now - debut) / 1000;
      R.dessine(Math.max(0, t) % CY);
    }
    raf = requestAnimationFrame(boucle);
    var io = null;
    if (window.IntersectionObserver){ io = new IntersectionObserver(function(es){ visible = es[0].isIntersecting; }); io.observe(canvas); }
    var c = {
      donnees:d, canvas:canvas, pret:pret,
      ecouter:function(){ ctx = amorcer(); if (!ctx) return false; c.taire(); try { son = new Son(ctx, d); } catch(e){ son = null; return false; } t0 = ctx.currentTime + .1; prochain = 0; fige = false; return true; },
      taire:function(){ if (!son) return; try { son.ecoute.gain.setTargetAtTime(0, ctx.currentTime, .03); var o = son.out; setTimeout(function(){ try { o.disconnect(); } catch(e){} }, 200); } catch(e){} son = null; debut = performance.now(); },
      figer:function(t){ fige = true; R.dessine(t); },
      reprendre:function(){ fige = false; },
      arreter:function(){ arret = true; cancelAnimationFrame(raf); c.taire(); if (io) io.disconnect(); }
    };
    return c;
  }

  /* la duree reelle d'une video produite (le webm de Chrome annonce Infinity : on cherche la fin) */
  function mesurerDuree(blob){
    return new Promise(function(res){
      var v = document.createElement('video'), u = URL.createObjectURL(blob), fini = false;
      function sortie(x){ if (fini) return; fini = true; try { URL.revokeObjectURL(u); } catch(e){} res(x); }
      v.preload = 'metadata'; v.muted = true;
      v.onloadedmetadata = function(){ if (isFinite(v.duration) && v.duration > 0) return sortie(v.duration); v.ontimeupdate = function(){ v.ontimeupdate = null; sortie(isFinite(v.duration) ? v.duration : null); }; try { v.currentTime = 1e6; } catch(e){ sortie(null); } };
      v.onerror = function(){ sortie(null); };
      setTimeout(function(){ sortie(null); }, 5000);
      v.src = u;
    });
  }

  window.VyWrap = { ouvrir:ouvrir, bouton:bouton, amorcer:amorcer, apercu:apercu, styles:['A', 'B', 'C', 'D', 'D1', 'D2', 'D3', 'D4'], palettes:PALETTES, version:'2.1', _normalise:normalise, _mesurerDuree:mesurerDuree, _temps:temps };
})();
