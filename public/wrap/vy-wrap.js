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
      creer:'Créer mon Wrap', creerSous:'Story · 5 secondes',
      partager:'Partager', enregistrer:'Enregistrer', fermer:'Fermer', son:'Son',
      prep:'Préparation de votre Wrap…', creation:'Création de votre Wrap…',
      pret:'Votre Wrap est prêt.', pretTouchez:'Votre Wrap est prêt : touchez Partager.',
      partage:'Partagé.', enregistre:'Fichier enregistré sur cet appareil.',
      sansPartage:'Le partage direct n’est pas disponible ici : le fichier a été enregistré.',
      sansVideo:'Cet appareil ne sait pas enregistrer de vidéo. Une image de votre Wrap est prête à la place.',
      erreur:'Le Wrap n’a pas pu être créé. Fermez et réessayez.',
      exemple:'EXEMPLE',
      types:{ peau:'Peau', cheveux:'Cheveux', aliment:'Assiette' },
      wrapDe:'Le Wrap de',
      rituel:function(n, type){ return type === 'aliment' ? 'Mon assiette · ' + n + (n > 1 ? ' aliments' : ' aliment') : 'Mon rituel · ' + n + (n > 1 ? ' gestes' : ' geste'); },
      fin1:'Mon rituel', fin2:'vyvre', site:'vyvre.fr'
    },
    en: {
      creer:'Create my Wrap', creerSous:'Story · 5 seconds',
      partager:'Share', enregistrer:'Save', fermer:'Close', son:'Sound',
      prep:'Preparing your Wrap…', creation:'Creating your Wrap…',
      pret:'Your Wrap is ready.', pretTouchez:'Your Wrap is ready: tap Share.',
      partage:'Shared.', enregistre:'File saved on this device.',
      sansPartage:'Direct sharing is not available here: the file has been saved.',
      sansVideo:'This device cannot record video. An image of your Wrap is ready instead.',
      erreur:'The Wrap could not be created. Close and try again.',
      exemple:'EXAMPLE',
      types:{ peau:'Skin', cheveux:'Hair', aliment:'Plate' },
      wrapDe:'The Wrap of',
      rituel:function(n, type){ return type === 'aliment' ? 'My plate · ' + n + (n > 1 ? ' foods' : ' food') : 'My ritual · ' + n + (n > 1 ? ' steps' : ' step'); },
      fin1:'My ritual', fin2:'vyvre', site:'vyvre.fr'
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
    return {
      type:type, prenom:prenom, titre:String(d.titre || '').trim(),
      chiffres:chiffres, phare:phare, autres:autres, items:items,
      exemple:!!d.exemple, style:/^[ABCD]$/.test(String(d.style || '').toUpperCase()) ? String(d.style).toUpperCase() : 'A',
      a:hexRgb(d.couleur || th.a), b:hexRgb(d.couleur2 || th.b), fond:th.fond, theme:th
    };
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
    var st = this.d.style;
    if (st === 'B') return this.dessineB(tAbs);
    if (st === 'C') return this.dessineC(tAbs);
    if (st === 'D') return this.dessineD(tAbs);
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
  var BEAT = .5;
  Rendu.prototype.dessineD = function(tAbs){
    var x = this.x, d = this.d, L = this.L, t = Math.min(tAbs, D); this.n++;
    var V = VIVES[d.type] || VIVES.peau, c1 = V[0], c2 = V[1], NOIR = [8, 8, 8], BLANC = [250, 246, 238];
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
    this.ctx = ctx; this.th = d.theme; this.style = d.style || 'A';
    var out = ctx.createGain(); out.gain.value = 1.2;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3.2; comp.attack.value = .004; comp.release.value = .25;
    var bus = ctx.createGain(); bus.gain.value = .9;
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
.vyw-p.go{animation:vywGo 1.2s ease-in-out 3}\
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
    var d = normalise(donnees), L = T();
    var ctx = amorcer();

    var el = document.createElement('div'); el.className = 'vyw'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Wrap vyvre');
    el.innerHTML =
      '<div class="vyw-haut"><b>VYVRE</b><span style="display:flex;gap:8px">' +
        '<button type="button" class="vyw-ic vyw-son" aria-pressed="true">' + IC_SON + '<span></span></button>' +
        '<button type="button" class="vyw-ic vyw-x"></button></span></div>' +
      '<div class="vyw-scene"><canvas width="' + W + '" height="' + H + '"></canvas><div class="vyw-prog"><i></i></div></div>' +
      '<p class="vyw-etat" aria-live="polite"></p>' +
      '<div class="vyw-actions"><button type="button" class="vyw-b vyw-p"></button><button type="button" class="vyw-b vyw-s"></button></div>';
    var q = function(s){ return el.querySelector(s); };
    q('.vyw-son span').textContent = L.son;
    q('.vyw-x').innerHTML = IC_X; q('.vyw-x').setAttribute('aria-label', L.fermer);
    q('.vyw-p').textContent = L.partager; q('.vyw-s').textContent = L.enregistrer;
    var canvas = q('canvas'), etatEl = q('.vyw-etat'), prog = q('.vyw-prog i');
    function etat(s){ etatEl.textContent = s || ''; }
    etat(L.prep);
    document.body.appendChild(el);
    var htmlOv = document.documentElement.style.overflow; document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function(){ el.classList.add('on'); });

    var R = new Rendu(canvas, d), son = null, raf = 0, ferme = false, t0 = 0, perf0 = 0, audioHorloge = false;
    var prochain = 0, rec = null, vstream = null, morceaux = [], resultat = null, enAttente = null, premier = true, enregistre = false;
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
      if (enAttente === 'enregistrer'){ enAttente = null; actionEnregistrer(); }
      else if (enAttente === 'partager'){ enAttente = null; if (!res.erreur){ etat(L.pretTouchez); q('.vyw-p').classList.add('go'); } }
    }
    function versImage(){
      R.dessine(D - .02);
      try {
        canvas.toBlob(function(b){ if (b && b.size) fini({ blob:b, type:'image/png', nom:'vyvre-wrap.png', image:true }); else fini({ erreur:true }); }, 'image/png');
      } catch(e){ fini({ erreur:true }); }
    }
    function demarrerEnregistrement(){
      var mime = choisirType();
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
      if (son && audioHorloge && t > prochain - .35){ try { son.planifie(t0 + prochain, d.items.length); } catch(e){} prochain += CYCLE; }
      if (premier){
        prog.style.width = (clamp(t / FIN_REC, 0, 1) * 100).toFixed(1) + '%';
        if (t >= FIN_REC){
          premier = false;
          if (rec && rec.state !== 'inactive'){ try { rec.stop(); } catch(e){ versImage(); } }
          else if (!enregistre) versImage();
        }
        R.dessine(Math.min(t, CYCLE - .001));
        return;
      }
      R.dessine(t % CYCLE);
    }

    function lancer(){
      if (ferme) return;
      if (ctx){ try { son = new Son(ctx, d); } catch(e){ son = null; } }
      audioHorloge = !!(son && ctx && ctx.state === 'running');
      if (audioHorloge){ t0 = ctx.currentTime + .15; }
      perf0 = performance.now() + 150;
      prochain = 0;
      enregistre = demarrerEnregistrement();
      etat(enregistre ? L.creation : L.prep);
      image();
    }

    function actionPartager(){
      if (!resultat || resultat.erreur){ if (!resultat){ enAttente = 'partager'; q('.vyw-p').classList.add('attente'); etat(L.creation); } return; }
      q('.vyw-p').classList.remove('go');
      var fichier = null;
      try { fichier = new File([resultat.blob], resultat.nom, { type:resultat.type }); } catch(e){}
      if (fichier && navigator.share && navigator.canShare && navigator.canShare({ files:[fichier] })){
        navigator.share({ files:[fichier] }).then(function(){ etat(L.partage); }).catch(function(e){
          if (e && e.name === 'AbortError') return;
          telecharger(resultat.blob, resultat.nom); etat(L.sansPartage);
        });
      } else { telecharger(resultat.blob, resultat.nom); etat(L.sansPartage); }
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
    var d = normalise(donnees), R = new Rendu(canvas, d), raf = 0, arret = false, debut = performance.now(), dernier = 0, visible = true;
    var son = null, ctx = null, t0 = 0, prochain = 0, fige = false;
    R.dessine(0);
    var pret = Promise.all(d.items.map(function(it){ return chargeImage(it.image).then(function(im){ return im ? preRendu(im, it.fond) : null; }); }))
      .then(function(r){ R.imgs = r; debut = performance.now(); });
    function boucle(now){
      if (arret) return; raf = requestAnimationFrame(boucle);
      if (!visible || fige || now - dernier < 31) return; dernier = now;
      var t;
      if (son){ t = ctx.currentTime - t0; if (t > prochain - .35){ try { son.planifie(t0 + prochain, d.items.length); } catch(e){} prochain += CYCLE; } }
      else t = (now - debut) / 1000;
      R.dessine(Math.max(0, t) % CYCLE);
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

  window.VyWrap = { ouvrir:ouvrir, bouton:bouton, amorcer:amorcer, apercu:apercu, styles:['A', 'B', 'C', 'D'], version:'2.0', _normalise:normalise };
})();
