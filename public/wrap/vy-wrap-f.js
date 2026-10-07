/* ===========================================================================
   VYVRE · LE WRAP · SERIE F, LES ALIMENTS AU COEUR  (07/10/2026, soir)
   Charles : « Pour le Wrap aliment je veux pas de flacon ou quoi, c'est les aliments au coeur du produit.
   On voit des dizaines défiler en 2 secondes puis ça s'arrête, voilà le scan de VYVRE, ce qu'il a dit. Et BIM. »

   Script charge a la demande par vy-wrap.js (window.__VYWF.creer), pour l'ASSIETTE seulement. Canvas 2D,
   aucune bibliotheque. Fond clair de l'interface aliments (#fafafa), Inter serree (OFL, fonts/), photos detourees
   qui flottent avec une ombre douce. Le meme arc pour les trois (16 temps, plan commun d.PF calcule par vy-wrap.js,
   le son y lit les memes instants) :
     0 -> 1,5     l'accroche : « Ma peau, lue. » / « Parmi 265 aliments… » (le vrai total de la page)
     1,5 -> 5,5   le defilement : des dizaines de vraies photos, qui accelerent puis ralentissent
     5,5 -> 6     l'arret net, fige
     6            le BIM : le besoin que la page a lu (« Rougeurs », « 44/100 », « prioritaire ») ou « Ta peau va bien »
     8,25 -> 11,5 les aliments choisis se posent un par un, avec leur nom : « VYVRE a choisi ceux-ci d'après ma peau »
     12 -> 15     « Et toi ? » + vyvre.fr + la ligne des credits photos ; 15 -> 16 retour a l'accroche (boucle parfaite)
   F1 la roulette (une photo geante remplace l'autre), F2 le mur (une grille qui scintille, seuls les retenus restent),
   F3 les rouleaux (machine a sous, les rouleaux s'arretent un par un sur les aliments retenus).

   Les photos : la planche aliments/vignettes-320.webp (64 photos reduites, une seule requete) pour le defilement,
   les PNG d'origine pour les aliments choisis et les grandes photos fixes. Chaque identifiant est reverifie contre
   la licence (d.defile, tire de credits.json par la page ; sinon credits.json est relu) : une photo dont la licence
   ne permet pas la reutilisation n'apparait jamais. Credits : /wrap/credits.html.
   Sans flash : le fond clair ne bouge pas ; le defilement est ordonne par luminance (mesuree sur la planche) pour
   qu'aucune zone de l'ecran ne change fortement plus de 2 fois par seconde. Le visage n'apparait pas.
   =========================================================================== */
(function(){
  'use strict';
  if (window.__VYWF) return;

  var W = 1080, H = 1920, CX = 520;   /* le centre de la composition : un peu a gauche (zones TikTok / Reels) */
  var ENCRE = [37, 38, 34], GRIS = [104, 106, 97], TRAIT = [216, 220, 209];
  var NIVC = { prioritaire:[162, 64, 31], surveiller:[138, 106, 31], normal:[85, 87, 78] };   /* les couleurs de l'interface aliments */
  var SANS = '"VY Inter",Inter,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif';
  var VER_PLANCHE = '1';
  var ICI = (function(){ try { var s = document.currentScript && document.currentScript.src; if (s) return new URL('./', s).href; } catch(e){} return '/wrap/'; })();

  /* ------------------------------------------------------------- outils */
  function toile(w, h){ var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; }
  function alea(graine){ var a = graine >>> 0; return function(){ a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function melange(l, rnd){ l = l.slice(); for (var i = l.length - 1; i > 0; i--){ var j = Math.floor(rnd() * (i + 1)), x = l[i]; l[i] = l[j]; l[j] = x; } return l; }
  function rgb(c, a){ return a == null ? 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')' : 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }
  function chargeImg(src, ms){
    return new Promise(function(res){
      var im = new Image(), fini = false; function f(v){ if (!fini){ fini = true; res(v); } }
      im.decoding = 'async';
      im.onload = function(){ if (!im.naturalWidth) return f(null); var p = im.decode ? im.decode() : Promise.resolve(); p.then(function(){ f(im); }, function(){ f(im); }); };
      im.onerror = function(){ f(null); }; im.src = src; setTimeout(function(){ f(null); }, ms || 8000);
    });
  }

  /* ------------------------------------------------------------- l'Inter de l'interface aliments (OFL, fonts/) */
  var INTER = null;
  function chargeInter(){
    if (INTER) return INTER;
    if (!window.FontFace || !document.fonts) return (INTER = Promise.resolve(false));
    function un(w, f){ return new FontFace('VY Inter', 'url("' + ICI + 'fonts/' + f + '?v=1") format("woff2")', { weight:w, style:'normal' }).load().then(function(l){ document.fonts.add(l); }); }
    INTER = Promise.race([Promise.all([un('400', 'inter-400.woff2'), un('500', 'inter-500.woff2')]).then(function(){ return true; }), new Promise(function(r){ setTimeout(function(){ r(false); }, 5000); })]).catch(function(){ return false; });
    return INTER;
  }
  function police(size, poids){ return (poids || 400) + ' ' + Math.round(size) + 'px ' + SANS; }

  /* ------------------------------------------------------------- le fond, l'ombre (calcules une fois) */
  var FOND = null, OMBRE = null;
  function fond(){
    if (FOND) return FOND;
    var c = toile(W, H), g = c.getContext('2d'); g.fillStyle = '#fafafa'; g.fillRect(0, 0, W, H);
    var rg = g.createRadialGradient(W * .6, H * .4, 0, W * .6, H * .4, H * .78); rg.addColorStop(0, '#ffffff'); rg.addColorStop(.42, '#fcfcfb'); rg.addColorStop(1, '#f2f2f0');
    g.fillStyle = rg; g.fillRect(0, 0, W, H); return (FOND = c);
  }
  function ombre(){
    if (OMBRE) return OMBRE;
    var c = toile(128, 128), g = c.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    rg.addColorStop(0, 'rgba(37,31,19,1)'); rg.addColorStop(.5, 'rgba(37,31,19,.42)'); rg.addColorStop(1, 'rgba(37,31,19,0)');
    g.fillStyle = rg; g.fillRect(0, 0, 128, 128); return (OMBRE = c);
  }

  /* ------------------------------------------------------------- la planche de vignettes et les licences */
  var PLANCHE = null;
  function chargePlanche(){
    if (PLANCHE) return PLANCHE;
    var p = Promise.all([
      fetch(ICI + 'aliments/vignettes.json?v=' + VER_PLANCHE).then(function(r){ if (!r.ok) throw new Error('index'); return r.json(); }),
      chargeImg(ICI + 'aliments/vignettes-320.webp?v=' + VER_PLANCHE, 15000)
    ]).then(function(r){ if (!r[1] || !r[0] || !Array.isArray(r[0].ids)) throw new Error('planche'); return { meta:r[0], img:r[1] }; })
      .catch(function(){ PLANCHE = null; return null; });
    PLANCHE = p; return p;
  }
  /* les identifiants dont la licence permet la reutilisation : ceux que la page transmet (tires de credits.json),
     sinon credits.json relu ici ; si on ne peut pas le verifier, aucune photo du defilement (jamais de doute) */
  var CREDITS = null;
  function autorises(d, V){
    if (d.defile && d.defile.ids && d.defile.ids.length) return Promise.resolve({ base:d.defile.base, ids:d.defile.ids });
    if (!CREDITS) CREDITS = fetch('/scan/aliment/photos/credits.json?v=2').then(function(r){ if (!r.ok) throw new Error('credits'); return r.json(); })
      .then(function(c){ return { base:'/scan/aliment/photos/', ids:Object.keys(c).filter(function(id){ return V.LIC_X.test(String((c[id] || {}).licence || '')); }) }; })
      .catch(function(){ CREDITS = null; return null; });
    return CREDITS;
  }

  /* ------------------------------------------------------------- les photos */
  var LIN = null;
  function mesure(src, sx, sy, sw, sh){
    if (!LIN){ LIN = new Float32Array(256); for (var i = 0; i < 256; i++){ var v = i / 255; LIN[i] = v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); } }
    var c = toile(96, 96), g = c.getContext('2d', { willReadFrequently:true }); g.fillStyle = '#fafafa'; g.fillRect(0, 0, 96, 96);
    var k = Math.min(92 / sw, 92 / sh), dw = sw * k, dh = sh * k; g.drawImage(src, sx, sy, sw, sh, (96 - dw) / 2, (96 - dh) / 2, dw, dh);
    var p = g.getImageData(0, 0, 96, 96).data, tot = 0, rouge = 0, G = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var y = 0; y < 96; y++) for (var x = 0; x < 96; x++){
      var j = (y * 96 + x) * 4, lr = LIN[p[j]], lg = LIN[p[j + 1]], lb = LIN[p[j + 2]], L = .2126 * lr + .7152 * lg + .0722 * lb, s = lr + lg + lb;
      tot += L; G[Math.floor(y / 32) * 3 + Math.floor(x / 32)] += L; if (s > 0 && lr / s >= .8 && (lr - lg - lb) * 320 > 20) rouge++;
    }
    return { lum:tot / 9216, rouge:rouge / 9216, g:G.map(function(v){ return v / 1024; }) };
  }
  /* une photo de la planche (la boite exacte de l'aliment dans sa case) */
  function phPlanche(PL, id){
    var m = PL.meta.mesures[id], k = PL.meta.ids.indexOf(id), C = PL.meta.cellule, col = PL.meta.colonnes;
    if (!m || k < 0) return null;
    return { id:id, img:PL.img, sx:(k % col) * C + m.b[0], sy:Math.floor(k / col) * C + m.b[1], sw:m.b[2], sh:m.b[3], lum:m.lum, rouge:m.rouge, g:m.g };
  }
  /* une photo pleine resolution : recadree sur l'aliment (sans les marges transparentes), reduite une fois */
  function phImage(im, id, maxH){
    if (!im) return null;
    var w0 = im.naturalWidth || im.width, h0 = im.naturalHeight || im.height; if (!w0 || !h0) return null;
    var bx = [0, 0, w0, h0];
    try {
      var s = Math.min(1, 160 / Math.max(w0, h0)), pc = toile(w0 * s, h0 * s), pg = pc.getContext('2d', { willReadFrequently:true }); pg.drawImage(im, 0, 0, pc.width, pc.height);
      var d = pg.getImageData(0, 0, pc.width, pc.height).data, x0 = pc.width, y0 = pc.height, x1 = -1, y1 = -1;
      for (var y = 0; y < pc.height; y++) for (var x = 0; x < pc.width; x++) if (d[(y * pc.width + x) * 4 + 3] > 10){ if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 > x0 && y1 > y0){ var m = 2; bx = [Math.max(0, (x0 - m) / s), Math.max(0, (y0 - m) / s), 0, 0]; bx[2] = Math.min(w0, (x1 + 1 + m) / s) - bx[0]; bx[3] = Math.min(h0, (y1 + 1 + m) / s) - bx[1]; }
    } catch(e){}
    var k = Math.min(1, (maxH || 780) / bx[3], 900 / bx[2]), c = toile(bx[2] * k, bx[3] * k);
    c.getContext('2d').drawImage(im, bx[0], bx[1], bx[2], bx[3], 0, 0, c.width, c.height);
    var ms = mesure(c, 0, 0, c.width, c.height);
    return { id:id, img:c, sx:0, sy:0, sw:c.width, sh:c.height, lum:ms.lum, rouge:ms.rouge, g:ms.g, net:true };
  }
  function idDe(url){ var m = /photos\/([a-z0-9_]+)\.png/.exec(String(url || '')); return m ? m[1] : null; }
  /* la taille d'une photo : meme « masse » visuelle quelle que soit sa forme (aire cible), dans une boite */
  function taille(ph, aire, wMax, hMax){
    var r = ph.sw / ph.sh, h = Math.sqrt(aire / r), w = h * r;
    if (w > wMax){ w = wMax; h = w / r; } if (h > hMax){ h = hMax; w = h * r; }
    return { w:w, h:h };
  }
  /* poser une photo : sa base au sol (cx, sol), une ombre douce dessous ; o.sc echelle, o.rot rotation */
  function pose(x, ph, cx, sol, aire, wMax, hMax, a, o){
    if (!ph || a <= .003) return null;
    o = o || {}; var t = taille(ph, aire, wMax, hMax), sc = o.sc == null ? 1 : o.sc, w = t.w * sc, h = t.h * sc;
    if (o.ombre !== false){ var ow = w * .74, oh = Math.max(6, h * .06); x.globalAlpha = Math.min(1, a) * (o.ombreA != null ? o.ombreA : .2); x.drawImage(ombre(), cx - ow / 2, sol - oh / 2 + 3, ow, oh); }
    var lev = o.lev || 0;
    x.globalAlpha = Math.min(1, a);
    if (o.rot){ x.save(); x.translate(cx, sol - lev); x.rotate(o.rot); x.drawImage(ph.img, ph.sx, ph.sy, ph.sw, ph.sh, -w / 2, -h, w, h); x.restore(); }
    else x.drawImage(ph.img, ph.sx, ph.sy, ph.sw, ph.sh, cx - w / 2, sol - lev - h, w, h);
    x.globalAlpha = 1;
    return { w:w, h:h };
  }
  /* sans photo (licence) : un ecrin vide, jamais une image inventee */
  function ecrin(x, cx, sol, r, a){ if (a <= .003) return; x.globalAlpha = a * .8; x.strokeStyle = rgb(TRAIT); x.lineWidth = 3; x.beginPath(); x.arc(cx, sol - r * 1.1, r, 0, 6.2832); x.stroke(); x.globalAlpha = 1; }

  /* ------------------------------------------------------------- le texte : des images de texte, dessinees une fois */
  function Textes(V){ this.V = V; this.m = new Map(); this.mes = toile(4, 4).getContext('2d'); }
  Textes.prototype.sprite = function(txt, size, poids, col, tr){
    txt = String(txt); var cle = txt + '|' + size + '|' + poids + '|' + col.join(',') + '|' + tr, s = this.m.get(cle);
    if (s) return s;
    var m = this.mes; m.font = police(size, poids);
    var n = Array.from(txt).length, sp = tr * size, w = m.measureText(txt).width + sp * (n - 1), pad = Math.ceil(size * .14);
    var c = toile(w + 2 * pad, size * 1.34 + 2 * pad), g = c.getContext('2d'); g.font = police(size, poids); g.fillStyle = rgb(col); g.textBaseline = 'alphabetic';
    this.V.traceL(g, txt, pad, pad + size * 1.0, sp, 'left');
    s = { c:c, w:w, pad:pad, base:pad + size * 1.0, size:size }; this.m.set(cle, s); return s;
  };
  /* y = la ligne de base ; align : centre par defaut */
  Textes.prototype.dessine = function(x, s, cx, y, a, sc, align){
    if (!s || a <= .003) return; sc = sc == null ? 1 : sc;
    var x0 = align === 'left' ? cx - s.pad * sc : align === 'right' ? cx - (s.w + s.pad) * sc : cx - (s.w / 2 + s.pad) * sc;
    x.globalAlpha = Math.min(1, a); x.drawImage(s.c, x0, y - s.base * sc, s.c.width * sc, s.c.height * sc); x.globalAlpha = 1;
  };
  /* la plus grande taille (<= fmax) pour que chaque ligne tienne dans maxW */
  Textes.prototype.ajuste = function(lignes, maxW, fmax, poids, tr){
    var m = this.mes, f = fmax; m.font = police(100, poids);
    lignes.forEach(function(l){ var w = m.measureText(l).width + tr * 100 * (Array.from(l).length - 1); if (w > 0) f = Math.min(f, maxW / w * 100); });
    return Math.floor(f);
  };
  /* un texte en lignes (au plus n) qui tient dans maxW ; jamais une ligne qui finit sur un petit mot */
  Textes.prototype.lignes = function(txt, maxW, size, poids, tr, n){
    var m = this.mes, mots = String(txt).split(/\s+/).filter(Boolean), s = size, ls;
    var w = function(t){ return m.measureText(t).width + tr * s * (Array.from(t).length - 1); };
    for (;;){
      m.font = police(s, poids); ls = []; var cur = '';
      mots.forEach(function(mo){ var t = cur ? cur + ' ' + mo : mo; if (!cur || w(t) <= maxW) cur = t; else { ls.push(cur); cur = mo; } });
      if (cur) ls.push(cur);
      if ((ls.length <= n && ls.every(function(l){ return w(l) <= maxW; })) || s <= size * .55) break;
      s -= 2;
    }
    for (var i = 0; i < ls.length - 1; i++){ var mm = ls[i].split(' '); if (mm.length > 1 && mm[mm.length - 1].replace(/[’']/g, '').length <= 3){ var nx = mm.pop() + ' ' + ls[i + 1]; m.font = police(s, poids); if (w(nx) <= maxW){ ls[i] = mm.join(' '); ls[i + 1] = nx; } } }
    if (ls.length > n){ ls = ls.slice(0, n); var der = ls[n - 1]; while (der.length > 1 && w(der + '…') > maxW) der = der.slice(0, -1); ls[n - 1] = der.replace(/[\s,·\-]+$/, '') + '…'; }
    return { ls:ls, s:s };
  };
  Textes.prototype.vider = function(){ this.m.forEach(function(s){ s.c.width = s.c.height = 1; }); this.m.clear(); };

  /* ------------------------------------------------------------- ce que le scan a lu (lecture seule) */
  function besoin(d, V){
    var L = V.T(), lg = V.langue() === 'fr' ? 'fr' : 'en', lu = d.lecture, f = L.f;
    if (lu && lu.entretien) return { entretien:true, mots:f.vaBien.slice(), valeur:'', niveau:V.maj(f.entretien), nivc:NIVC.normal, court:V.maj(f.vaBien.join(' ').replace(/\.$/, '')) };
    if (lu && V.IND_X[lu.i1]){
      var ci = d.chiffres.filter(function(c){ return c.cle === 'indice' && V.num(c.valeur) !== null; })[0];
      var n1 = ci ? Math.round(V.num(ci.valeur)) : (V.num(lu.n1) !== null ? Math.round(lu.n1) : null), nv = lu.niv1 && V.NIV_X[lu.niv1] ? lu.niv1 : null;
      var nom = V.IND_X[lu.i1][lg];
      return { entretien:false, mots:[nom], valeur:n1 !== null ? n1 + '/100' : '', niveau:nv ? V.NIV_X[nv][lg] : '', nivc:NIVC[nv || 'normal'], court:V.maj(nom) + (n1 !== null ? '  ·  ' + n1 + '/100' : '') };
    }
    var p = d.phare;
    return { entretien:false, mots:[p ? String(p.label) : ''], valeur:p && V.num(p.valeur) !== null ? V.valTxt(p) + (p.unite === '/100' ? '/100' : '') : '', niveau:'', nivc:NIVC.normal, court:p ? V.maj(p.label) : '' };
  }

  /* ===================================================================== la base commune des trois */
  function Scene(R, d, o){
    this.R = R; this.d = d; this.V = o.V; this.ap = !!o.apercu; this.P = d.PF; this.n = Math.min(4, d.items.length);
    this.L = this.V.T(); this.T = new Textes(this.V); this.rnd = alea(this.P.graine);
    this.B = besoin(d, this.V);
    var rev = d.chiffres.filter(function(c){ return c.cle === 'revue' && o.V.num(c.valeur) !== null; })[0];
    this.total = rev ? Math.round(o.V.num(rev.valeur)) : null;
    this.pool = []; this.choix = []; this.gl = false; this.rw = W; this.rh = H; this.ms = []; this.ts = [];
  }
  Scene.prototype.init = function(){
    var self = this, d = this.d, V = this.V;
    return Promise.all([chargeInter(), chargePlanche(), autorises(d, V)]).then(function(r){
      var PL = r[1], ok = r[2], idsOk = ok ? new Set(ok.ids) : null, base = ok ? ok.base : '/scan/aliment/photos/';
      self.base = base;
      /* les aliments choisis : leur photo pleine resolution (deja chargee par vy-wrap.js), recadree ; sans photo : null */
      self.choix = d.items.slice(0, 4).map(function(it, k){ var im = self.R.imgs && self.R.imgs[k], src = im && (im.brut || im); return src ? phImage(src, idDe(it.image), 780) : null; });
      var exclus = new Set(d.items.map(function(it){ return idDe(it.image); }).filter(Boolean));
      /* le defilement : la planche, seulement les photos dont la licence est verifiee */
      if (PL && idsOk) self.pool = PL.meta.ids.filter(function(id){ return idsOk.has(id) && !exclus.has(id); }).map(function(id){ return phPlanche(PL, id); }).filter(Boolean);
      self.nPhotos = self.pool.length;
      return self.prepare(base, idsOk);
    }).then(function(){
      /* on dessine une fois chaque moment (textes, flous) : rien n'est calcule pendant l'enregistrement */
      var tm = self.d.tm; for (var q = 0; q < 16; q += .5) self.dessine(q * tm.beat);
      self.pret = true; return self;
    });
  };
  /* des photos pleine resolution en plus (les grandes photos fixes) ; si elles manquent, on garde la vignette */
  Scene.prototype.pleines = function(phs){
    var self = this;
    return Promise.all(phs.map(function(ph){ if (!ph || ph.net || !ph.id) return ph; return chargeImg(self.base + ph.id + '.png', 6000).then(function(im){ return im ? (phImage(im, ph.id, 780) || ph) : ph; }); }));
  };
  /* le repli si la planche manque : les aliments choisis eux-memes, rien d'invente */
  Scene.prototype.poolOuChoix = function(nMin){
    var p = this.pool.slice(); if (p.length >= nMin) return p;
    var c = this.choix.filter(Boolean); if (!c.length) return p;
    while (p.length < nMin) p = p.concat(c);
    return p;
  };
  /* le texte commun */
  Scene.prototype.txt = function(t, size, poids, col, tr){ return this.T.sprite(t, size, poids || 400, col || ENCRE, tr == null ? -.045 : tr); };
  Scene.prototype.caps = function(t, size, col, maxW, poids){
    t = this.V.maj(t); var tr = .2, s = size, m = this.T.mes, n = Array.from(t).length;
    if (maxW){ m.font = police(s, poids || 500); while (m.measureText(t).width + tr * s * (n - 1) > maxW && tr > .06){ tr -= .02; } while (m.measureText(t).width + tr * s * (n - 1) > maxW && s > size * .6){ s -= 1; m.font = police(s, poids || 500); } }
    return this.T.sprite(t, s, poids || 500, col || GRIS, tr);
  };
  /* l'accroche : petite ligne, « Ma peau, lue. », « Parmi 265 aliments… » */
  Scene.prototype.accroche = function(x, a, y0){
    if (a <= .003) return; var V = this.V, f = this.L.f, y = y0 || 0;
    this.T.dessine(x, this.caps('VYVRE  ·  ' + V.dateCourte(), 22), CX, 330 + y, a);
    this.T.dessine(x, this.txt(f.hook, this.T.ajuste([f.hook], 880, 150, 400, -.055), 400, ENCRE, -.055), CX, 505 + y, a);
    if (this.total) this.T.dessine(x, this.txt(f.parmi(this.total), 54, 400, GRIS, -.03), CX, 592 + y, a);
  };
  /* le BIM : ce que le scan a lu, en tres grand. Retourne la hauteur du bloc */
  Scene.prototype.geometrieBesoin = function(maxW, fmax){
    if (this._gb && this._gb.k === maxW + '|' + fmax) return this._gb;
    var B = this.B, T = this.T, tr = -.06, mots = B.mots.slice(), f = T.ajuste(mots, maxW, fmax, 400, tr);
    if (mots.length === 1 && f < fmax * .72 && /\s/.test(mots[0])){
      var w = mots[0].split(' '), best = null;
      for (var i = 1; i < w.length; i++){ var ls = [w.slice(0, i).join(' '), w.slice(i).join(' ')], ff = T.ajuste(ls, maxW, fmax, 400, tr); if (!best || ff > best.f) best = { ls:ls, f:ff }; }
      if (best && best.f > f){ mots = best.ls; f = best.f; }
    }
    var lh = f * .98;
    this._gb = { k:maxW + '|' + fmax, mots:mots, f:f, lh:lh, haut:52 + (mots.length - 1) * lh + f * .74 + (B.valeur || B.niveau ? 40 + Math.max(B.valeur ? 100 : 0, 46) : 0) };
    return this._gb;
  };
  /* q0 = l'instant du BIM ; y = le haut du bloc (la petite ligne) ; a = opacite */
  Scene.prototype.blocBesoin = function(x, q, q0, y, a, maxW, fmax){
    if (a <= .003) return; var V = this.V, B = this.B, T = this.T, G = this.geometrieBesoin(maxW || 880, fmax || 240), e = q - q0;
    var aK = V.seg(e, .08, .3) * a, aM = V.seg(e, 0, .05) * a, aV = V.seg(e, .2, .4) * a;
    var sc = 1 + .34 * (1 - V.eOutBack(V.seg(e, 0, .32)));
    var sh = 0;
    T.dessine(x, this.caps(this.L.f.lu, 24), CX, y + 24, aK);
    var yb = y + 52 + G.f * .74;
    for (var i = 0; i < G.mots.length; i++) T.dessine(x, this.txt(G.mots[i], G.f, 400, ENCRE, -.06), CX + sh, yb + i * G.lh, aM, sc);
    var yv = yb + (G.mots.length - 1) * G.lh + 40;
    if (B.valeur || B.niveau){
      var sv = B.valeur ? this.txt(B.valeur, 100, 400, ENCRE, -.04) : null, sn = B.niveau ? this.caps(B.niveau, 26, B.nivc, 0, 500) : null;
      var wv = sv ? sv.w : 0, wn = sn ? sn.w + 34 : 0, gap = sv && sn ? 36 : 0, x0 = CX - (wv + gap + wn) / 2, yl = yv + (sv ? 92 : 40);
      if (sv && aV > .003){
        /* le chiffre compte jusqu'a sa vraie valeur (lue par la page), puis reste */
        var mv = /^(\d+)(.*)$/.exec(B.valeur), cpt = mv ? Math.round(+mv[1] * V.eOutExpo(V.seg(e, .2, .62))) + mv[2] : B.valeur;
        if (cpt === B.valeur) T.dessine(x, sv, x0, yl, aV, 1, 'left');
        else { x.globalAlpha = aV; x.font = police(100, 400); x.fillStyle = rgb(ENCRE); V.traceL(x, cpt, x0, yl, -4, 'left'); x.globalAlpha = 1; }
      }
      if (sn){ var px = x0 + wv + gap; x.globalAlpha = aV; x.fillStyle = rgb(B.nivc); x.beginPath(); x.arc(px + 9, yl - (sv ? 33 : 9), 9, 0, 6.2832); x.fill(); x.globalAlpha = 1; T.dessine(x, sn, px + 34, yl - (sv ? 24 : 0), aV, 1, 'left'); }
    }
  };
  /* la ligne du besoin, en petit, en tete des aliments (et la couleur de son niveau) */
  Scene.prototype.enTete = function(x, a, y){
    if (a <= .003) return; var B = this.B, T = this.T, s1 = this.caps(B.court, 23, ENCRE, 640), s2 = B.niveau ? this.caps(B.niveau, 23, B.nivc) : null;
    var gap = s2 ? 30 : 0, w = s1.w + (s2 ? gap + s2.w : 0), x0 = CX - w / 2, yy = y || 330;
    T.dessine(x, s1, x0, yy, a, 1, 'left');
    if (s2){ x.globalAlpha = a; x.fillStyle = rgb(B.nivc); x.beginPath(); x.arc(x0 + s1.w + gap / 2, yy - 8, 5, 0, 6.2832); x.fill(); x.globalAlpha = 1; T.dessine(x, s2, x0 + s1.w + gap, yy, a, 1, 'left'); }
  };
  /* « VYVRE a choisi ceux-ci d'après ma peau » */
  Scene.prototype.titreChoix = function(x, a, y, size){
    if (a <= .003) return; var f = this.L.f, s = size || 62, T = this.T, sz = T.ajuste(f.choisi, 860, s, 400, -.045);
    T.dessine(x, this.txt(f.choisi[0], sz), CX, y, a); T.dessine(x, this.txt(f.choisi[1], sz, 400, GRIS), CX, y + sz * 1.08, a);
  };
  /* le nom d'un aliment choisi, sa famille et sa portion, le credit de sa photo */
  Scene.prototype.legende = function(x, k, cx, y, a, o){
    if (a <= .003) return; o = o || {}; var it = this.d.items[k], T = this.T, s = o.size || 46, maxW = o.maxW || 400;
    var L = T.lignes(it.nom, maxW, s, 400, -.035, o.n || 2), al = o.align;
    for (var i = 0; i < L.ls.length; i++) T.dessine(x, this.txt(L.ls[i], L.s, 400, ENCRE, -.035), cx, y + i * L.s * 1.08, a, 1, al);
    var yb = y + (L.ls.length - 1) * L.s * 1.08;
    var haut = [it.marque, it.etape].filter(Boolean).join('  ·  ');
    if (haut && o.sous !== false){ yb += o.sousY || 42; T.dessine(x, this.caps(haut, o.sousS || 19, GRIS, maxW), cx, yb, a, 1, al); }
    if (it.credit && o.credit !== false){ yb += 30; T.dessine(x, this.caps(this.L.f.photo + ' · ' + it.credit, 14, GRIS, Math.max(maxW, 300), 400), cx, yb, a * .9, 1, al); }
  };
  /* la rangee des aliments (fin), et « Et toi ? » + vyvre.fr + la ligne des credits */
  Scene.prototype.rang = function(k, n){ var pas = Math.min(215, 860 / Math.max(1, n)); return { x:CX + (k - (n - 1) / 2) * pas, pas:pas }; };
  Scene.prototype.cta = function(x, q){
    var V = this.V, P = this.P, f = this.L.f, T = this.T;
    var sortie = 1 - V.seg(q, P.retour, P.retour + .38);
    var a1 = V.eOut3(V.seg(q, P.cta + .15, P.cta + .5)) * sortie, a2 = V.eOut3(V.seg(q, P.cta + .35, P.cta + .7)) * sortie, a3 = V.seg(q, P.cta + .55, P.cta + .9) * sortie;
    if (a1 <= .003) return;
    var sc = 1 + .12 * (1 - V.eOutBack(V.seg(q, P.cta + .15, P.cta + .55)));
    T.dessine(x, this.txt(f.etToi, T.ajuste([f.etToi], 860, 230, 400, -.06), 400, ENCRE, -.06), CX, 900, a1, sc);
    T.dessine(x, this.caps(f.site, 38, ENCRE), CX, 1010, a2);
    var L = T.lignes(f.credits, 860, 21, 400, 0, 2);
    for (var i = 0; i < L.ls.length; i++) T.dessine(x, this.txt(L.ls[i], L.s, 400, GRIS, 0), CX, 1472 + i * L.s * 1.35, a3);
  };
  /* les aliments en rangee sous « Et toi ? » */
  Scene.prototype.rangCta = function(x, q, depart){
    var V = this.V, P = this.P, n = this.n, rentre = V.eInOut(V.seg(q, P.cta, P.cta + .45)), sortie = 1 - V.seg(q, P.retour, P.retour + .38);
    for (var k = 0; k < n; k++){
      var R0 = depart(k), Rg = this.rang(k, n), cx = V.lerp(R0.x, Rg.x, rentre), sol = V.lerp(R0.sol, 1395, rentre), aire = V.lerp(R0.aire, 168 * 168, rentre), hM = V.lerp(R0.hMax, 180, rentre), wM = V.lerp(R0.wMax, 196, rentre);
      var lev = 4 * Math.sin(q * 1.9 + k * 1.3) * rentre;
      if (this.choix[k]) pose(x, this.choix[k], cx, sol, aire, wM, hM, sortie * (R0.a == null ? 1 : R0.a), { lev:lev, ombreA:.18 });
      else ecrin(x, cx, sol, Math.sqrt(aire) * .3, sortie);
    }
  };
  Scene.prototype.exemple = function(x){ if (this.d.exemple) this.T.dessine(x, this.caps(this.V.T().exemple, 19, GRIS), 1010, 300, .9, 1, 'right'); };
  /* l'image : le fond fixe, la scene, le texte */
  Scene.prototype.dessine = function(tAbs){
    var R = this.R, x = R.x, tm = this.d.tm, t = ((tAbs % tm.D) + tm.D) % tm.D, q = t / tm.beat + 1e-6;
    R.n = (R.n || 0) + 1;
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'center';
    x.drawImage(fond(), 0, 0);
    /* BIM : une secousse breve de toute la scene (le fond ne bouge pas) */
    var e = q - this.P.bim;
    if (e > 0 && e < .45){ var amp = 15 * Math.pow(1 - e / .45, 2), f = Math.floor(e * this.P.b * 60); x.setTransform(1, 0, 0, 1, (this.V.hash(3, f) - .5) * 2 * amp, (this.V.hash(5, f) - .5) * 2 * amp); }
    this.scene(x, q);
    x.setTransform(1, 0, 0, 1, 0, 0);
    this.exemple(x);
    x.globalAlpha = 1;
  };
  Scene.prototype.liberer = function(){ try { this.T.vider(); } catch(e){} (this.toiles || []).forEach(function(c){ c.width = c.height = 1; }); this.toiles = []; };
  /* une teinte douce de l'aliment (bouffee du BIM : pastel, jamais un flash) */
  Scene.prototype.bouffee = function(x, q, cx, cy){
    var e = q - this.P.bim; if (e < 0 || e > .55) return;
    var ph = this.choix.filter(Boolean)[0], c = this.couleurDe(ph), a = .16 * (1 - e / .55), r = 300 + 900 * this.V.eOut3(e / .55);
    var g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, rgb(c, a)); g.addColorStop(1, rgb(c, 0)); x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.globalAlpha = .5 * (1 - e / .55); x.strokeStyle = rgb(TRAIT); x.lineWidth = 3; x.beginPath(); x.arc(cx, cy, 120 + 760 * this.V.eOut3(e / .55), 0, 6.2832); x.stroke(); x.globalAlpha = 1;
  };
  Scene.prototype.couleurDe = function(ph){
    if (!ph) return [230, 226, 214];
    if (ph._c) return ph._c;
    try {
      var c = toile(24, 24), g = c.getContext('2d', { willReadFrequently:true }); g.drawImage(ph.img, ph.sx, ph.sy, ph.sw, ph.sh, 0, 0, 24, 24);
      var p = g.getImageData(0, 0, 24, 24).data, r = 0, gg = 0, b = 0, n = 0;
      for (var i = 0; i < p.length; i += 4) if (p[i + 3] > 200){ var mx = Math.max(p[i], p[i + 1], p[i + 2]), mn = Math.min(p[i], p[i + 1], p[i + 2]), k = (mx - mn) / 255 + .05; r += p[i] * k; gg += p[i + 1] * k; b += p[i + 2] * k; n += k; }
      var m = n ? [r / n, gg / n, b / n] : [200, 200, 190];
      ph._c = m.map(function(v){ return Math.round(v + (255 - v) * .55); });   /* pastel */
    } catch(e){ ph._c = [230, 226, 214]; }
    return ph._c;
  };
  /* ordonner des photos sans flash : un chemin de luminance doux (voisines proches), qui part de a et arrive vers b */
  function chemin(phs, lumA, lumB){
    var reste = phs.slice(), out = [], cur = lumA;
    while (reste.length){
      var cible = out.length > phs.length * .55 ? lumB : cur, best = 0, bd = 1e9;
      for (var i = 0; i < reste.length; i++){ var dd = Math.abs(reste[i].lum - cible) + .35 * Math.abs(reste[i].lum - cur); if (dd < bd){ bd = dd; best = i; } }
      var p = reste.splice(best, 1)[0]; out.push(p); cur = p.lum;
    }
    return out;
  }
  function bande(phs, centre, demi, nMin){
    var b = phs.filter(function(p){ return Math.abs(p.lum - centre) <= demi; });
    while (b.length < nMin && demi < .5){ demi += .03; b = phs.filter(function(p){ return Math.abs(p.lum - centre) <= demi; }); }
    return b;
  }

  /* ===================================================================== F1 · LA ROULETTE */
  /* Une grande roue de 12 aliments, claire, un cliquet au sommet. Elle part (un petit recul), tourne a toute vitesse
     (les photos filent, floues), ralentit, le cliquet bat chaque case, et s'arrete pile sur le premier aliment choisi.
     Pendant qu'elle tourne, chaque case change de photo en passant tout en bas (dans le blanc) : des dizaines d'aliments
     defilent sous le cliquet. BIM : la roue descend, l'aliment gagne devient une photo geante sous le besoin ; puis les
     autres aliments arrivent un par un, en grand, et rejoignent la rangee ; « Et toi ? ». */
  function F1(R, d, o){ Scene.call(this, R, d, o); this.toiles = []; }
  F1.prototype = Object.create(Scene.prototype);
  var VEDETTES = ['grenade', 'fraise', 'avocat', 'mangue', 'kiwi', 'orange', 'pasteque', 'poivron_rouge', 'framboise', 'citron', 'cerise', 'tomate', 'ananas', 'myrtille', 'brocoli', 'peche', 'clementine', 'chou_rouge', 'romanesco', 'figue', 'pomme', 'poire', 'artichaut', 'potiron'];
  var ROUE_G = { cx:CX, cy:1180, R:452, Ri:338, Rh:104 };
  F1.prototype.angle = function(q){ var P = this.P; return q >= P.retour ? 0 : this.V.posRouleau(P.roue, Math.min(q, P.retour), P.b); };
  F1.prototype.tour = function(s, th){ var n = this.P.roue.cases; return Math.floor(th + s / n + .5) - Math.floor(s / n + .5); };
  F1.prototype.prepare = function(){
    var P = this.P, RR = P.roue, n = RR.cases, rnd = this.rnd, self = this, pool = melange(this.poolOuChoix(n * 2), rnd);
    /* sans flash, verifie a la mesure : autour de la roue, une sombre, une claire, en paires equilibrees (la plus sombre
       a cote de la plus claire...) : tout arc de 2 ou 3 cases a la meme luminance moyenne, que la roue file ou ralentisse.
       (Un degrade doux autour de la roue fait au contraire une vague de lumiere a chaque tour : mesure, refuse.)
       Chaque case garde le meme rang a chaque tour (les photos changent en bas, dans le blanc). */
    var rangDe = [], i; for (i = 0; i < n; i++) rangDe[i] = i % 2 ? n - 1 - (i >> 1) : (i >> 1);
    var nTours = 0; for (var s0 = 0; s0 < n; s0++) nTours = Math.max(nTours, this.tour(s0, RR.D));
    var ved = pool.filter(function(p){ return VEDETTES.indexOf(p.id) >= 0; }), autres = pool.filter(function(p){ return VEDETTES.indexOf(p.id) < 0; });
    var vus = [], tirer = function(pref){
      var l = pref.filter(function(p){ return vus.indexOf(p) < 0; }).concat(pool.filter(function(p){ return vus.indexOf(p) < 0 && pref.indexOf(p) < 0; }));
      if (l.length < n) l = l.concat(melange(pool, rnd)); l = l.slice(0, n); vus = vus.concat(l); if (vus.length > pool.length - n) vus = l.slice(); return l;
    };
    this.cases = []; for (var s1 = 0; s1 < n; s1++) this.cases.push([]);
    for (var t = 0; t <= nTours + 1; t++){
      var lot = tirer(t === 0 ? ved : autres).slice().sort(function(a1, b1){ return (a1 ? a1.lum : .8) - (b1 ? b1.lum : .8); });
      for (var s2 = 0; s2 < n; s2++) this.cases[s2][t] = lot[rangDe[s2]] || null;
    }
    var g = RR.gagnante; this.cases[g][this.tour(g, RR.D)] = this.choix[0] || null;
    this.sansFin = !this.choix[0];
    /* le calque du flou de vitesse (additif, la taille de la roue) */
    this.calque = toile(2 * ROUE_G.R + 40, 2 * ROUE_G.R + 40); this.toiles.push(this.calque);
    return this.pleines([]);
  };
  /* le cliquet bat a chaque case : il se couche puis revient (ressort) */
  F1.prototype.cliquet = function(q){
    var T = this.P.tics, j = -1; for (var i = 0; i < T.length && T[i].q <= q; i++) j = i;
    if (j < 0) return 0; var e = (q - T[j].q) * this.P.b, v = T[j].fin ? 2 : Math.min(1, 6 / Math.max(1, T[j].v));
    return -.32 * v * Math.exp(-e / .05) * Math.cos(e * 40);
  };
  F1.prototype.dessineRoue = function(x, q, th, dy, a, sansGagnante){
    if (a <= .003) return; var G = ROUE_G, P = this.P, RR = P.roue, n = RR.cases, V = this.V, cy = G.cy + dy, self = this;
    var th2 = this.angle(q + .03), om = Math.abs(th2 - th) / (.03 * P.b), flou = V.seg(om, .1, .85);   /* flou jusqu'a ~1,4 case par seconde */
    /* le disque */
    x.globalAlpha = a * .55; x.drawImage(ombre(), G.cx - G.R * 1.05, cy + G.R - 40, G.R * 2.1, 120);
    x.globalAlpha = a; x.fillStyle = '#ffffff'; x.beginPath(); x.arc(G.cx, cy, G.R, 0, 6.2832); x.fill();
    x.strokeStyle = rgb(TRAIT); x.lineWidth = 2; x.stroke();
    x.beginPath(); x.arc(G.cx, cy, G.R - 18, 0, 6.2832); x.strokeStyle = 'rgba(216,220,209,.55)'; x.lineWidth = 1.5; x.stroke();
    /* les rayons */
    x.strokeStyle = rgb(TRAIT); x.lineWidth = 2;
    for (var s = 0; s < n; s++){ var ar = 6.2832 * (th + (s + .5) / n); x.beginPath(); x.moveTo(G.cx + Math.sin(ar) * (G.Rh + 14), cy - Math.cos(ar) * (G.Rh + 14)); x.lineTo(G.cx + Math.sin(ar) * (G.R - 18), cy - Math.cos(ar) * (G.R - 18)); x.stroke(); }
    /* les aliments, droits (comme les nacelles d'une grande roue), flous quand ils filent */
    var K = flou > .02 ? 1 + Math.round(7 * flou) : 1, cal = this.calque, cg = null, ox = G.cx - cal.width / 2, oy = cy - cal.height / 2;
    if (K > 1){ cg = cal.getContext('2d'); cg.setTransform(1, 0, 0, 1, 0, 0); cg.globalCompositeOperation = 'source-over'; cg.clearRect(0, 0, cal.width, cal.height); cg.globalCompositeOperation = 'lighter'; }
    var dTh = om / 30;   /* le chemin d'une image (1/30 s), en tours */
    for (var s3 = 0; s3 < n; s3++){
      var ph = this.cases[s3][Math.max(0, this.tour(s3, th))] || null, ang = th + s3 / n, du = Math.abs(((ang % 1) + 1) % 1 - .5);
      var est = s3 === RR.gagnante && q >= RR.arret - .01 && q < P.retour;
      if (est && sansGagnante) continue;
      var ab = V.seg(du, .05, .13);   /* en bas : la photo change dans le blanc */
      if (ab <= .003) continue;
      var pop = est ? 1 + .35 * V.eOutBack(V.seg(q, RR.arret, RR.arret + .3)) : 1;
      for (var k = 0; k < K; k++){
        var a2 = 6.2832 * (ang - k * dTh / Math.max(1, K - 1) * (K > 1 ? 1 : 0)), px = G.cx + Math.sin(a2) * G.Ri, py = cy - Math.cos(a2) * G.Ri;
        if (!ph){ if (k === 0) ecrin(x, px, py + 50, 40, a * ab); continue; }
        var tl = taille(ph, 150 * 150, 168, 150), w = tl.w * pop, h = tl.h * pop;
        if (K > 1){ cg.globalAlpha = ab / K; cg.drawImage(ph.img, ph.sx, ph.sy, ph.sw, ph.sh, px - ox - w / 2, py - oy - h / 2, w, h); }
        else { x.globalAlpha = a * ab; x.drawImage(ph.img, ph.sx, ph.sy, ph.sw, ph.sh, px - w / 2, py - h / 2, w, h); }
      }
    }
    if (K > 1){ x.globalAlpha = a; x.drawImage(cal, ox, oy); }
    x.globalAlpha = a;
    /* le blanc du bas (la ou les photos changent) */
    var gB = x.createLinearGradient(0, cy + G.R * .3, 0, cy + G.R + 4); gB.addColorStop(0, 'rgba(250,250,250,0)'); gB.addColorStop(.75, 'rgba(250,250,250,.96)'); gB.addColorStop(1, 'rgba(250,250,250,1)');
    x.fillStyle = gB; x.fillRect(G.cx - G.R - 30, cy + G.R * .3, 2 * G.R + 60, G.R * .7 + 90);
    /* le moyeu : la marque de l'interface */
    x.fillStyle = '#ffffff'; x.beginPath(); x.arc(G.cx, cy, G.Rh, 0, 6.2832); x.fill(); x.strokeStyle = rgb(TRAIT); x.lineWidth = 2; x.stroke();
    this.T.dessine(x, this.txt('vyvre.', 46, 500, ENCRE, -.045), G.cx, cy + 15, a);
    /* le cliquet */
    var cl = this.cliquet(q); x.save(); x.translate(G.cx, cy - G.R - 6); x.rotate(cl); x.fillStyle = rgb(ENCRE); x.beginPath(); x.moveTo(-23, -30); x.lineTo(23, -30); x.lineTo(0, 30); x.closePath(); x.fill();
    x.fillStyle = '#ffffff'; x.beginPath(); x.arc(0, -17, 6, 0, 6.2832); x.fill(); x.restore();
    x.globalAlpha = 1;
  };
  /* ou est l'aliment k a l'instant q : le premier sur la roue, puis en grand au BIM, puis a sa place dans le groupe ;
     les autres apparaissent directement a leur place, un par un. Le groupe : une nature morte (devant, derriere),
     les noms sur une ligne dessous. Une zone ne s'eclaircit jamais apres s'etre assombrie : pas d'aller-retour de lumiere. */
  var GROUPE = { 1:[[0, 1190, 1.15]], 2:[[-160, 1190, 1], [160, 1190, 1]], 3:[[-215, 1200, 1], [0, 1130, .92], [215, 1200, 1]],
                 4:[[-262, 1200, 1], [-88, 1132, .9], [96, 1205, 1], [272, 1137, .9]] };
  F1.prototype.place = function(k){ var g = (GROUPE[this.n] || GROUPE[4])[k] || [0, 1190, 1]; return { x:CX + g[0], sol:g[1], aire:365 * 365 * g[2] * g[2], wMax:315 * g[2], hMax:400 * g[2], prof:g[2] }; };
  F1.prototype.boite = function(k, q){
    var V = this.V, P = this.P, G = ROUE_G;
    var BIMP = { x:CX, sol:1340, aire:440 * 440, wMax:720, hMax:450 }, PL = this.place(k), posee = P.poses[k];
    if (this.choix[0]){ var tb = taille(this.choix[0], BIMP.aire, BIMP.wMax, BIMP.hMax); BIMP.sol = Math.round(1100 + tb.h / 2); }   /* la photo geante, centree sous le besoin quelle que soit sa forme */
    if (k === 0 && q < posee - .05){
      var ph = this.choix[0], tl = ph ? taille(ph, 150 * 150, 168, 150) : { w:120, h:120 }, pop = 1 + .35 * V.eOutBack(V.seg(q, P.arret, P.arret + .3));
      var ROUEP = { sol:G.cy - G.Ri + tl.h * pop / 2, aire:tl.w * tl.h * pop * pop, wMax:168 * pop, hMax:150 * pop }, m = V.eOut3(V.seg(q, P.bim, P.bim + .35));
      return { x:CX, sol:V.lerp(ROUEP.sol, BIMP.sol, m), aire:V.lerp(ROUEP.aire, BIMP.aire, m), wMax:V.lerp(ROUEP.wMax, BIMP.wMax, m), hMax:V.lerp(ROUEP.hMax, BIMP.hMax, m), a:1, m:m };
    }
    if (k === 0){ var u = V.eInOut(V.seg(q, posee - .05, posee + .35)); return { x:V.lerp(BIMP.x, PL.x, u), sol:V.lerp(BIMP.sol, PL.sol, u), aire:V.lerp(BIMP.aire, PL.aire, u), wMax:V.lerp(BIMP.wMax, PL.wMax, u), hMax:V.lerp(BIMP.hMax, PL.hMax, u), a:1, u:u, sc:1 }; }
    var e = V.seg(q, posee, posee + .32);
    return { x:PL.x, sol:PL.sol - 40 * (1 - V.eOut3(e)), aire:PL.aire, wMax:PL.wMax, hMax:PL.hMax, a:V.seg(q, posee, posee + .08), sc:.4 + .6 * V.eOutBack(e), u:e };
  };
  /* la ligne des noms sous le groupe : chaque nom s'allume quand son aliment se pose (la ligne ne bouge pas) */
  F1.prototype.noms = function(x, q, a){
    if (a <= .003) return; var P = this.P, V = this.V, T = this.T, n = this.n, tr = -.03, noms = this.d.items.slice(0, n).map(function(it){ return String(it.nom); });
    if (!this._noms){
      var sep = '  ·  ', lignes = [noms.map(function(t, i){ return i; })], s = T.ajuste([noms.join(sep)], 860, 46, 400, tr);
      if (s < 36 && n > 2){ var h = Math.ceil(n / 2); lignes = [[], []]; noms.forEach(function(t, i){ lignes[i < h ? 0 : 1].push(i); }); s = Math.min(46, T.ajuste(lignes.map(function(l){ return l.map(function(i){ return noms[i]; }).join(sep); }), 860, 46, 400, tr)); }
      var m = T.mes; m.font = police(s, 400);
      var wd = function(t){ return m.measureText(t).width + tr * s * (Array.from(t).length - 1); }, jetons = [];
      lignes.forEach(function(l, li){
        var tj = []; l.forEach(function(i, j){ if (j) tj.push({ t:sep, k:i, sep:true }); tj.push({ t:noms[i], k:i }); });
        var tot = tj.reduce(function(acc, z){ return acc + wd(z.t); }, 0), x0 = CX - tot / 2;
        tj.forEach(function(z){ z.x = x0; z.li = li; x0 += wd(z.t); jetons.push(z); });
      });
      this._noms = { s:s, jetons:jetons, nl:lignes.length };
    }
    var N = this._noms, y0 = 1288;
    for (var i = 0; i < N.jetons.length; i++){
      var z = N.jetons[i], al = a * V.seg(q, P.poses[z.k] + .2, P.poses[z.k] + .4);
      T.dessine(x, this.txt(z.t, N.s, 400, z.sep ? GRIS : ENCRE, tr), z.x, y0 + z.li * N.s * 1.22, al, 1, 'left');
    }
    /* les credits des photos des aliments choisis, en une ligne fine */
    var cr = this.d.items.slice(0, n).map(function(it){ return it.credit; }).filter(Boolean);
    if (cr.length){
      var L = T.lignes((V.langue() === 'fr' ? 'Photos\u00a0: ' : 'Photos: ') + cr.join('  ·  '), 860, 15, 400, 0, 2), yc = y0 + (N.nl - 1) * N.s * 1.22 + 46, ac = a * V.seg(q, P.poses[n - 1] + .3, P.poses[n - 1] + .5);
      for (var j = 0; j < L.ls.length; j++) T.dessine(x, this.txt(L.ls[j], L.s, 400, GRIS, 0), CX, yc + j * L.s * 1.45, ac);
    }
  };
  F1.prototype.scene = function(x, q){
    var V = this.V, P = this.P, n = this.n;
    /* ---- la roue (elle descend au BIM, remonte pour la boucle) */
    /* au BIM la roue s'efface d'un coup (sans traverser l'ecran : une seule variation de lumiere) ; elle revient pour la boucle */
    var dy = q < P.retour ? 160 * V.eIn3(V.seg(q, P.bim, P.bim + .3)) : 160 * (1 - V.eOut3(V.seg(q, P.retour, P.fin - .05)));
    var aR = q < P.retour ? 1 - V.eOut3(V.seg(q, P.bim, P.bim + .24)) : V.eOut3(V.seg(q, P.retour + .38, P.fin - .1));
    if (q < P.bim + .3 || q >= P.retour) this.dessineRoue(x, q, this.angle(q), dy, aR, q >= P.arret - .01 && q < P.retour);
    var aA = q >= P.retour ? V.eOut3(V.seg(q, P.retour + .42, P.fin - .02)) : 1 - V.seg(q, P.bim - .02, P.bim);
    this.accroche(x, aA);
    /* ---- le premier aliment : il s'arrete sous le cliquet, son nom ; au BIM il devient une photo geante */
    if (q >= P.arret - .01 && q < (n ? P.poses[0] - .05 : P.cta)){
      var b0 = this.boite(0, q);
      if (this.choix[0]) pose(x, this.choix[0], b0.x, b0.sol, b0.aire, b0.wMax, b0.hMax, 1, { ombre:b0.m > .05, ombreA:.2 * b0.m });
      else if (q >= P.arret) ecrin(x, b0.x, b0.sol, Math.sqrt(b0.aire) * .3, 1);
      var aN0 = V.seg(q, P.arret + .05, P.arret + .25) * (n ? 1 - V.seg(q, P.poses[0] - .25, P.poses[0] - .05) : 1);
      if (aN0 > .003){
        var yN = b0.sol + V.lerp(70, 82, b0.m), L0 = this.T.lignes(this.d.items[0].nom, 820, V.lerp(40, 54, b0.m), 400, -.035, 1);
        if (b0.m < .98){ var sN = this.txt(L0.ls[0], L0.s, 400, ENCRE, -.035); x.globalAlpha = aN0 * (1 - b0.m); x.fillStyle = '#ffffff'; this.V.rond(x, CX - sN.w / 2 - 22, yN - L0.s * .95, sN.w + 44, L0.s * 1.35, L0.s * .67); x.fill(); x.globalAlpha = 1; }
        this.legende(x, 0, CX, yN, aN0, { size:L0.s, maxW:820, n:1, sous:false, credit:false });
      }
    }
    /* ---- le BIM et les aliments */
    if (q >= P.bim && q < P.cta + .5){
      this.bouffee(x, q, CX, 600);
      var aB = 1 - V.seg(q, P.prod - .25, P.prod + .05);
      this.blocBesoin(x, q, P.bim, 340, aB, 880, 240);
      var aT = V.seg(q, P.prod - .05, P.prod + .3) * (1 - V.seg(q, P.cta, P.cta + .3)), fin = n ? P.poses[n - 1] + .35 : P.prod;
      this.enTete(x, aT, 330);
      this.titreChoix(x, aT, 560, 66);
      if (q < P.cta){
        /* derriere d'abord, puis devant (la nature morte) */
        var ordre = []; for (var kk = 0; kk < n; kk++) ordre.push(kk);
        var self2 = this; ordre.sort(function(a1, b1){ return self2.place(a1).prof - self2.place(b1).prof; });
        ordre.forEach(function(kk2){
          if (q < P.poses[kk2] - (kk2 ? 0 : .05)) return;   /* le premier est dessine plus haut jusqu'a son depart */
          var bx = self2.boite(kk2, q), lev = 5 * Math.sin(q * 1.9 + kk2 * 1.3) * Math.min(1, bx.u || 0);
          if (self2.choix[kk2]) pose(x, self2.choix[kk2], bx.x, bx.sol, bx.aire, bx.wMax, bx.hMax, bx.a, { sc:bx.sc, lev:lev, ombreA:.22 });
          else ecrin(x, bx.x, bx.sol, Math.sqrt(bx.aire) * .3, bx.a);
        });
        this.noms(x, q, 1 - V.seg(q, P.cta - .2, P.cta));
      }
    }
    /* ---- « Et toi ? » */
    if (q >= P.cta - .05 && q < P.retour + .5){
      var self = this;
      this.rangCta(x, q, function(k2){ return self.place(k2); });
      this.cta(x, q);
    }
  };

  /* ===================================================================== F2 · LE MUR */
  /* Une grille de dizaines d'aliments ; des vagues la traversent en diagonale et chaque case change de photo au passage
     (le cliquetis d'un tableau a palettes). Arret net. BIM : tout s'efface sauf les aliments retenus, qui restent a leur
     place autour du besoin ; puis ils viennent au centre, un par un, en grand, avec leur nom. */
  function F2(R, d, o){ Scene.call(this, R, d, o); }
  F2.prototype = Object.create(Scene.prototype);
  var MUR = { cols:5, rangs:6, case:196, x0:30, y0:650 };
  /* les cases des aliments retenus (au dernier passage) : pres des quatre coins du bloc du besoin */
  var RETENUS = [[0, 1], [0, 3], [3, 1], [3, 3]];
  F2.prototype.prepare = function(){
    var P = this.P, nv = P.vagues.length, rnd = this.rnd, pool = this.poolOuChoix(30), N = MUR.cols * MUR.rangs, self = this;
    /* a chaque vague, 30 photos tirees au hasard parmi toutes (jamais deux fois la meme sur le mur), puis rangees par
       luminance : chaque case recoit la photo du meme rang que la sienne (la lumiere d'une zone ne bouge presque pas),
       et jamais la meme photo deux fois de suite (echange avec le rang voisin). Le tirage change a chaque vague : le mur
       change vraiment (mesure : un tirage completement libre faisait jusqu'a 5 changements forts par seconde ; celui-ci 2). */
    function tirer(){ var l = melange(pool, rnd); while (l.length && l.length < N) l = l.concat(melange(pool, rnd)); return l.slice(0, N); }
    this.cases = [];
    for (var r = 0; r < MUR.rangs; r++) for (var c = 0; c < MUR.cols; c++){
      var ret = -1; for (var k = 0; k < self.n; k++) if (RETENUS[k][0] === r && RETENUS[k][1] === c) ret = k;
      this.cases.push({ r:r, c:c, seq:[], ret:ret, rot:(rnd() - .5) * .14, delai:(r + c) / (MUR.rangs + MUR.cols - 2) * P.mur.balayage, sortie:Math.hypot(r - 2.2, c - 2) / 3.6 });
    }
    var cs = this.cases, lu = function(p){ return p ? p.lum : .8; };
    var lot0 = tirer(); cs.forEach(function(C, i){ C.seq.push(lot0[i] || null); });
    for (var w = 1; w <= nv; w++){
      var lot = tirer().sort(function(a, b){ return lu(a) - lu(b); });
      var ordre = cs.map(function(C, i){ return i; }).sort(function(i, j){ return lu(cs[i].seq[w - 1]) - lu(cs[j].seq[w - 1]); });
      var att = []; ordre.forEach(function(ci, rg){ att[ci] = rg; });
      for (var rg = 0; rg < N; rg++){ var ci = ordre[rg]; if (lot[rg] === cs[ci].seq[w - 1]){ var rv = rg + 1 < N ? rg + 1 : rg - 1; if (rv >= 0){ var tmp = lot[rg]; lot[rg] = lot[rv]; lot[rv] = tmp; } } }
      cs.forEach(function(C, i){ C.seq.push(lot[att[i]] || null); });
    }
    this.cases.forEach(function(C){ if (C.ret >= 0) C.seq[nv] = self.choix[C.ret] || null; });
    return Promise.resolve();
  };
  F2.prototype.centre = function(r, c){ return { x:MUR.x0 + MUR.case * (c + .5), y:MUR.y0 + MUR.case * (r + .5) }; };
  F2.prototype.grille = function(k){ var n = this.n, col = n === 1 ? 0 : (k % 2 ? 1 : -1), lig = n <= 2 ? 0 : Math.floor(k / 2); return { x:CX + col * 222, sol:n <= 2 ? 1110 : (lig ? 1330 : 920), aire:265 * 265, wMax:360, hMax:262 }; };
  /* au BIM, les retenus quittent leur case pour les coins du bloc du besoin */
  F2.prototype.coin = function(k){
    var G = this.geometrieBesoin(860, 220), haut = 1040 - G.haut / 2, bas = haut + G.haut, h = 225;
    var lig = this.n <= 2 ? 0 : Math.floor(k / 2), col = this.n === 1 ? 0 : (k % 2 ? 1 : -1);
    return { x:CX + col * 275, sol:lig ? Math.min(1525, bas + 22 + h) : haut - 22, aire:225 * 225, wMax:270, hMax:h };
  };
  F2.prototype.scene = function(x, q){
    var V = this.V, P = this.P, n = this.n, cases = this.cases, z0 = 1 + .05 * V.eInOut(V.seg(q, P.defile, P.arret)), monte = 26 * V.eInOut(V.seg(q, P.defile, P.arret));
    var refait = V.seg(q, P.retour + .38, P.fin - .05), zoom = q >= P.retour - .1 ? 1 : z0, mt = q >= P.retour - .1 ? 0 : monte;
    /* ---- le mur */
    if (q < P.prod + 1 || q >= P.retour + .38){
      for (var i = 0; i < cases.length; i++){
        var C = cases[i], ce = this.centre(C.r, C.c), cx = 520 + (ce.x - 520) * zoom, cy = 1180 + (ce.y - 1180) * zoom - mt;
        var idx = 0; if (q < P.retour - .1) for (var w = 0; w < P.vagues.length; w++) if (P.vagues[w] + C.delai <= q) idx = w + 1;
        var ph = C.seq[idx], tv = idx ? q - (P.vagues[idx - 1] + C.delai) : 9, ch = idx ? Math.pow(1 - V.seg(tv, 0, .11 / P.b), 2) : 0;
        var a = 1, sc = 1 - .14 * ch, rot = C.rot + .1 * ch * (C.c % 2 ? 1 : -1), sol = cy + 76 * zoom, aire = 150 * 150 * zoom * zoom, wM = 180 * zoom, hM = 165 * zoom;
        var retenu = C.ret >= 0 && C.ret < n;
        if (q >= P.bim && q < P.retour - .1){
          if (retenu){
            if (q >= P.poses[C.ret] - .05) continue;
            var co = this.coin(C.ret), u = V.eOutBack(V.seg(q, P.bim, P.bim + .4));
            cx = V.lerp(cx, co.x, u); sol = V.lerp(sol, co.sol, u); aire = V.lerp(aire, co.aire, Math.min(1, u)); wM = V.lerp(wM, co.wMax, Math.min(1, u)); hM = V.lerp(hM, co.hMax, Math.min(1, u)); rot = C.rot * (1 - Math.min(1, u));
          } else { var e = V.seg(q, P.bim + C.sortie * .12, P.bim + C.sortie * .12 + .2); a = 1 - V.eOut3(e); sc = 1 - .3 * e; }
        }
        if (q >= P.retour - .1){ var ed = V.seg(refait, C.delai / P.mur.balayage * .45, C.delai / P.mur.balayage * .45 + .5); a = V.eOut3(ed); sc = .7 + .3 * V.eOutBack(ed); ph = C.seq[0]; rot = C.rot; }
        if (a <= .003) continue;
        if (ph) pose(x, ph, cx, sol, aire, wM, hM, a, { sc:sc, rot:rot, ombreA:retenu && q >= P.bim ? .2 : .14 });
        else ecrin(x, cx, sol, 40 * zoom, a);
      }
    }
    /* ---- l'accroche (au-dessus du mur) */
    var aA = q < P.retour ? 1 - V.seg(q, P.bim - .02, P.bim + .02) : V.eOut3(V.seg(q, P.retour + .42, P.fin - .02));
    this.accroche(x, aA);
    /* ---- le BIM, puis les aliments au centre */
    if (q >= P.bim && q < P.cta + .5){
      this.bouffee(x, q, CX, 1040);
      var aB = 1 - V.seg(q, P.prod - .25, P.prod + .05), G = this.geometrieBesoin(860, 220);
      this.blocBesoin(x, q, P.bim, 1040 - G.haut / 2, aB, 860, 220);
      var aT = V.seg(q, P.prod - .05, P.prod + .3) * (1 - V.seg(q, P.cta, P.cta + .3));
      this.enTete(x, aT, 330); this.titreChoix(x, aT, 452, 60);
      for (var k = 0; k < n; k++){
        if (q < P.poses[k] - .05 || q >= P.cta) continue;
        var dep = this.coin(k), gr = this.grille(k), uu = V.eInOut(V.seg(q, P.poses[k] - .05, P.poses[k] + .4)), arc = Math.sin(uu * Math.PI) * 90;
        var lev = 4 * Math.sin(q * 1.9 + k * 1.3) * uu, gx = V.lerp(dep.x, gr.x, uu), gs = V.lerp(dep.sol, gr.sol, uu) - arc;
        if (this.choix[k]) pose(x, this.choix[k], gx, gs, V.lerp(dep.aire, gr.aire, uu), V.lerp(dep.wMax, gr.wMax, uu), V.lerp(dep.hMax, gr.hMax, uu), 1, { lev:lev, rot:.22 * Math.sin(uu * Math.PI) * (k % 2 ? 1 : -1), ombreA:.2 });
        else ecrin(x, gx, gs, 60, 1);
        this.legende(x, k, gr.x, gr.sol + 50, V.seg(q, P.poses[k] + .35, P.poses[k] + .55) * (1 - V.seg(q, P.cta - .2, P.cta)), { size:36, maxW:390, n:2, sousS:17, sousY:34 });
      }
    }
    /* ---- « Et toi ? » */
    if (q >= P.cta - .05 && q < P.retour + .5){
      var self = this; this.rangCta(x, q, function(k2){ var g = self.grille(k2); return { x:g.x, sol:g.sol, aire:g.aire, wMax:g.wMax, hMax:g.hMax }; });
      this.cta(x, q);
    }
  };

  /* ===================================================================== F3 · LES ROULEAUX */
  /* Une machine a sous claire : un rouleau par aliment, des photos sur un tambour (en perspective), floues quand elles
     filent ; les rouleaux s'arretent un par un, pile sur l'aliment retenu. Au dernier : BIM, le besoin au-dessus.
     Puis la machine s'efface et les aliments se rangent en liste, chacun avec son nom (la liste de l'interface). */
  function F3(R, d, o){ Scene.call(this, R, d, o); this.toiles = []; }
  F3.prototype = Object.create(Scene.prototype);
  F3.prototype.geo = function(){
    var m = this.P.rouleaux.length, rw = Math.min(205, (856 - (m - 1) * 12) / m), tot = m * rw + (m - 1) * 12;
    return { m:m, rw:rw, tot:tot, x0:CX - tot / 2, rowH:215, fen:645 };
  };
  F3.prototype.prepare = function(){
    var P = this.P, G = this.geo(), rnd = this.rnd, pool = this.poolOuChoix(16), self = this;
    this.bandes = P.rouleaux.map(function(R, r){
      /* la bande du rouleau : de la photo d'accroche (indice 0) a l'aliment retenu (indice D), une derive douce de luminance */
      var c = self.choix[r] || null, lumC = c ? c.lum : .74, b = bande(pool, lumC, .08, Math.min(pool.length, 10));
      var s = []; while (s.length < R.D + 4) s = s.concat(melange(b, rnd));
      s = s.slice(0, R.D + 4);
      var mil = s.slice(1, R.D + 1).sort(function(p1, p2){ return r % 2 ? p1.lum - p2.lum : p2.lum - p1.lum; });
      var bandeR = [s[0]].concat(mil.slice(0, R.D - 1)); bandeR[R.D] = c; bandeR[R.D + 1] = s[R.D + 1]; bandeR[R.D + 2] = s[R.D + 2];
      bandeR[-1] = s[R.D + 3] || s[0];
      return bandeR;
    });
    /* le flou de vitesse, calcule une fois par photo (copies decalees moyennees) */
    this.flous = new Map();
    var t = G.rw - 16, flou = function(ph){
      if (!ph || self.flous.has(ph)) return;
      var tl = taille(ph, 150 * 150, t, 170), L = 110, c = toile(tl.w + 4, tl.h + L + 4), g = c.getContext('2d');
      g.globalCompositeOperation = 'lighter'; var K = 10; g.globalAlpha = 1 / K;
      for (var i = 0; i < K; i++) g.drawImage(ph.img, ph.sx, ph.sy, ph.sw, ph.sh, 2, 2 + i * L / (K - 1), tl.w, tl.h);
      self.flous.set(ph, { c:c, w:tl.w, h:tl.h, L:L }); self.toiles.push(c);
    };
    this.bandes.forEach(function(bd){ for (var i = -1; i < bd.length; i++) flou(bd[i]); });
    return Promise.resolve();
  };
  /* le haut de la fenetre : la machine descend au BIM pour laisser la place au besoin */
  F3.prototype.haut = function(q){
    var V = this.V, P = this.P, Gb = this.geometrieBesoin(880, 210), cible = Math.min(1500 - this.geo().fen - 26, Math.max(690, 282 + Gb.haut + 60));
    return V.lerp(690, cible, V.eInOut(V.seg(q, P.bim - .1, P.bim + .2)) * (1 - V.seg(q, P.retour - .2, P.retour + .3)));
  };
  F3.prototype.machine = function(x, q, a){
    var V = this.V, P = this.P, G = this.geo(), yT = this.haut(q), pay = yT + G.fen / 2, Rc = G.rowH * 1.55;
    if (a <= .003) return;
    /* le cadre */
    x.globalAlpha = a * .5; x.drawImage(ombre(), G.x0 - 40, yT + G.fen + 6, G.tot + 80, 70);
    x.globalAlpha = a; x.fillStyle = '#ffffff'; this.V.rond(x, G.x0 - 26, yT - 26, G.tot + 52, G.fen + 52, 34); x.fill();
    x.strokeStyle = rgb(TRAIT); x.lineWidth = 2; x.stroke();
    for (var r = 0; r < G.m; r++){
      var R = P.rouleaux[r], p = V.posRouleau(R, q < P.retour ? q : 0, P.b), xr = G.x0 + r * (G.rw + 12), cxr = xr + G.rw / 2;
      var p2 = V.posRouleau(R, (q < P.retour ? q : 0) + .02, P.b), vit = Math.abs(p2 - p) / (.02 * P.b), fl = V.seg(vit, 3.5, 8);
      x.save(); x.beginPath(); x.rect(xr, yT, G.rw, G.fen); x.clip();
      x.globalAlpha = a; x.fillStyle = '#f7f7f5'; x.fillRect(xr, yT, G.rw, G.fen);
      var bd = this.bandes[r], i0 = Math.floor(p) - 3;
      for (var i = i0; i <= i0 + 6; i++){
        var ph = bd[i]; if (ph === undefined) continue;
        var dd = (p - i) * G.rowH, th = dd / Rc; if (Math.abs(th) > 1.45) continue;
        var estLigne = i === R.D && q >= R.arret - .02 && q < P.retour;
        if (estLigne && q >= P.bim) continue;   /* des le BIM, l'aliment retenu est dessine par la scene (il quittera la machine) */
        var yc = pay + Rc * Math.sin(th), sy = Math.cos(th), aa = a * (q >= P.bim && q < P.retour ? 1 - .7 * V.seg(q, P.bim, P.bim + .3) : 1);
        var popS = estLigne ? 1 + .12 * (1 - V.eOutBack(V.seg(q, R.arret, R.arret + .3))) : 1;
        if (!ph){ ecrin(x, cxr, yc + 70 * sy, 40 * sy, aa); continue; }
        var tl = taille(ph, 150 * 150, G.rw - 16, 170), w = tl.w * popS, h = tl.h * sy * popS;
        if (fl > .02 && this.flous.has(ph)){
          var F = this.flous.get(ph); x.globalAlpha = aa * fl; x.drawImage(F.c, cxr - F.w / 2, yc - (F.h + F.L) * sy / 2, F.w, (F.h + F.L) * sy);
        }
        if (fl < .98){ x.globalAlpha = aa * (1 - fl); x.drawImage(ph.img, ph.sx, ph.sy, ph.sw, ph.sh, cxr - w / 2, yc - h / 2, w, h); }
      }
      x.restore();
    }
    x.globalAlpha = 1;
    /* le tambour : les bords s'effacent dans le blanc ; la ligne de gain : deux reperes */
    var gH = x.createLinearGradient(0, yT, 0, yT + G.fen * .3); gH.addColorStop(0, 'rgba(255,255,255,1)'); gH.addColorStop(1, 'rgba(255,255,255,0)');
    var gB = x.createLinearGradient(0, yT + G.fen, 0, yT + G.fen * .7); gB.addColorStop(0, 'rgba(255,255,255,1)'); gB.addColorStop(1, 'rgba(255,255,255,0)');
    x.globalAlpha = a; x.fillStyle = gH; x.fillRect(G.x0 - 2, yT, G.tot + 4, G.fen * .3); x.fillStyle = gB; x.fillRect(G.x0 - 2, yT + G.fen * .7, G.tot + 4, G.fen * .3);
    x.fillStyle = rgb(TRAIT); for (var s2 = 1; s2 < G.m; s2++) x.fillRect(G.x0 + s2 * (G.rw + 12) - 7, yT + 8, 2, G.fen - 16);
    x.fillStyle = rgb(ENCRE);
    [[G.x0 - 12, 1], [G.x0 + G.tot + 12, -1]].forEach(function(m){ x.beginPath(); x.moveTo(m[0], pay - 14); x.lineTo(m[0] + 16 * m[1], pay); x.lineTo(m[0], pay + 14); x.closePath(); x.fill(); });
    x.globalAlpha = 1;
  };
  /* ou est l'aliment k (ligne de gain de la machine) et ou il va (la liste) */
  F3.prototype.ligne = function(k, q){ var G = this.geo(), yT = this.haut(q); return { x:G.x0 + k * (G.rw + 12) + G.rw / 2, y:yT + G.fen / 2 }; };
  F3.prototype.liste = function(k){ var n = this.n, h = n > 3 ? 205 : 230; return { y:640 + k * h + (4 - n) * h * .25, h:h }; };
  F3.prototype.scene = function(x, q){
    var V = this.V, P = this.P, n = this.n, T = this.T;
    var aM = q < P.retour ? 1 - V.seg(q, P.prod - .2, P.prod + .35) : V.eOut3(V.seg(q, P.retour + .38, P.fin - .1));
    this.machine(x, q, aM, false);
    var aA = q < P.retour ? 1 - V.seg(q, P.bim - .02, P.bim + .02) : V.eOut3(V.seg(q, P.retour + .42, P.fin - .02));
    this.accroche(x, aA);
    if (q >= P.bim && q < P.cta + .5){
      this.bouffee(x, q, CX, this.haut(q) + 300);
      var aB = 1 - V.seg(q, P.prod - .25, P.prod + .05);
      this.blocBesoin(x, q, P.bim, 282, aB, 880, 210);
      var aT = V.seg(q, P.prod - .05, P.prod + .3) * (1 - V.seg(q, P.cta, P.cta + .3));
      this.enTete(x, aT, 330); this.titreChoix(x, aT, 452, 60);
      /* les aliments retenus : sur la ligne de gain (ils grossissent au BIM), puis chacun rejoint la liste, avec son nom */
      var G = this.geo();
      for (var k = 0; k < n; k++){
        if (q >= P.cta) continue;
        var Lg = this.ligne(k, q), Li = this.liste(k), u = V.eInOut(V.seg(q, P.poses[k] - .05, P.poses[k] + .4)), ph = this.choix[k];
        var popB = 1 + .1 * V.eOutBack(V.seg(q, P.bim, P.bim + .3)) * (1 - V.seg(q, P.prod - .2, P.prod));
        var t0 = ph ? taille(ph, 150 * 150, G.rw - 16, 170) : { w:120, h:120 }, h0 = t0.h * popB;
        var cx = V.lerp(Lg.x, 225, u), sol = V.lerp(Lg.y + h0 / 2, Li.y + Li.h - 22, u), aire = V.lerp(t0.w * t0.h, 190 * 190, u), hM = V.lerp(170, 185, u), wM = V.lerp(G.rw - 16, 215, u);
        if (ph) pose(x, ph, cx, sol, aire, wM, hM, 1, { sc:V.lerp(popB, 1, u), lev:3 * Math.sin(q * 1.9 + k) * u, ombre:u > .05, ombreA:.18 * u });
        else ecrin(x, cx, sol, 50, 1);
        var aN = V.seg(q, P.poses[k] + .3, P.poses[k] + .5) * (1 - V.seg(q, P.cta - .2, P.cta));
        if (aN > 0){
          T.dessine(x, this.caps('0' + (k + 1), 22, GRIS), 104, Li.y + 70, aN);
          this.legende(x, k, 355, Li.y + 78, aN, { size:48, maxW:590, n:2, align:'left', sousS:18, sousY:38 });
          if (k < n - 1){ x.globalAlpha = aN; x.fillStyle = rgb(TRAIT); x.fillRect(90, Li.y + Li.h - 2, 870 * V.eOut3(aN), 2); x.globalAlpha = 1; }
        }
      }
    }
    if (q >= P.cta - .05 && q < P.retour + .5){
      var self = this; this.rangCta(x, q, function(k2){ var Li2 = self.liste(k2); return { x:225, sol:Li2.y + Li2.h - 22, aire:190 * 190, wMax:215, hMax:185 }; });
      this.cta(x, q);
    }
  };

  var CLASSES = { F1:F1, F2:F2, F3:F3 };
  window.__VYWF = {
    creer:function(R, d, o){ var C = CLASSES[d.style] || F1, sc = new C(R, d, o); return sc.init(); },
    version:'1'
  };
})();
