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
               items:[{nom, marque, image, etape, fond}], couleur, exemple,
               style:'A'|'B'|'C'|'D'|'D1'..'D4'|'R1'..'R4'|'L1'..'L4' (defaut 'D'), palette }
   07/10 : chaque chiffre peut porter une cle (hydration, glow... ; boucle ; saison...),
   et le cheveu une liste besoins:[{cle, source:'reponses'|'photo'|'lecture'}] :
   la serie R (la revelation) en tire la phrase du besoin (table BES).
   07/10 (soir) : la serie L (luxe), memes phrases, polices de mode locales (fonts/, OFL).
   07/10 (nuit) : la serie X (vraie 3D, three.js local dans vendor/, licence MIT) : X1 le visage
   en lumiere, X2 le chrome liquide, X3 le flacon de verre, X4 la typo geante. Le rendu 3D vit
   dans vy-wrap-x.js (module charge a la demande) ; le son, ici. Repli 2D si WebGL manque.
   donnees.visage = { src, pts, box, sujet } (X1 seulement : la vignette du scan, gardee sur
   l'appareil) ; donnees.lecture = { i1, n1, niv1, i2, n2, niv2, entretien, bas } (assiette).

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
      partager:'Partager', autre:'Un autre style', enregistrer:'Enregistrer', fermer:'Fermer', son:'Son',
      prep:'Préparation de votre Wrap…', creation:'Création de votre Wrap…',
      pret:'Votre Wrap est prêt.', pretTouchez:'Prêt : touchez Partager',
      partage:'Partagé.', enregistre:'Fichier enregistré sur cet appareil.',
      sansPartage:'Le partage direct n’est pas disponible ici : le fichier a été enregistré.',
      sansVideo:'Cet appareil ne sait pas enregistrer de vidéo. Une image de votre Wrap est prête à la place.',
      erreur:'Le Wrap n’a pas pu être créé. Fermez et réessayez.',
      exemple:'EXEMPLE',
      types:{ peau:'Peau', cheveux:'Cheveux', aliment:'Assiette' },
      wrapDe:'Le Wrap de',
      rituel:function(n, type){ return type === 'aliment' ? 'Mes aliments peau · ' + n + (n > 1 ? ' aliments' : ' aliment') : 'Mon rituel · ' + n + (n > 1 ? ' gestes' : ' geste'); },
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
      /* R1 a R4 (07/10) */
      r:{ hook:'LE VERDICT…', aussi:'AUSSI', priorite:'TA PRIORITÉ', plusBasse:'LA PLUS BASSE', reponses:'D’APRÈS TES RÉPONSES', lectureReponses:'TA LECTURE ET TES RÉPONSES',
          reponsesCourt:'TES RÉPONSES', lues:'LUES', taLecture:'TA LECTURE', tirage:'LE TIRAGE', n1:'MON BESOIN N°1', lecture:'LECTURE', analyse:'ANALYSE', routine:'MA ROUTINE', assiette:'MON ASSIETTE',
          cta:{ peau:['ET TOI,', 'TA PEAU VEUT QUOI\u202f?'], cheveux:['ET TOI,', 'TES CHEVEUX VEULENT QUOI\u202f?'], aliment:['ET TOI,', 'TU METS QUOI DANS TON ASSIETTE\u202f?'] } },
      /* L1 a L4 (07/10) */
      l:{ hook:{ peau:'Ce que ta peau demande', cheveux:'Ce que tes cheveux demandent', aliment:'Ce que dit ton assiette' },
          edition:{ peau:'Édition peau', cheveux:'Édition cheveux', aliment:'Édition assiette' },
          soins:{ peau:'Les soins', cheveux:'Les soins', aliment:'L’assiette' }, aussi:'Aussi',
          cta:{ peau:['Et toi,', 'ta peau veut quoi\u202f?'], cheveux:['Et toi,', 'tes cheveux veulent quoi\u202f?'], aliment:['Et toi,', 'tu mets quoi dans ton assiette\u202f?'] },
          plusBasse:'ta mesure la plus basse', mesures:'mesures', mesure:'mesure', lectures:'lectures', lecture:'lecture', aliments:'aliments,', uneAssiette:'une assiette.', unePriorite:'une priorité.',
          enCouv:'En couverture', defile:'Défilé', look:'Look', dernier:'Dernier passage' },
      /* X1 a X4 (07/10, nuit) */
      x:{ hook:{ peau:'Ce que ta peau demande', cheveux:'Ce que tes cheveux demandent', aliment:'Ma lecture, mon assiette' },
          kicker:{ peau:'Édition peau', cheveux:'Édition cheveux', aliment:'Édition assiette' },
          mien:{ peau:'MA PEAU', cheveux:'MES CHEVEUX', aliment:'MON ASSIETTE' },
          produits:{ peau:'Mes soins', cheveux:'Ma routine', aliment:'Mes aliments peau' },
          etToi:'ET TOI ?', aussi:'Aussi', photo:'Photo' },
      diagPartage:{ ok:'ok', annule:'annulé', erreur:'erreur', aucun:'aucun', telecharge:'téléchargé (pas de partage)' }
    },
    en: {
      creer:'Create my Wrap', creerSous:'Video story to share',
      partager:'Share', autre:'Another style', enregistrer:'Save', fermer:'Close', son:'Sound',
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
      r:{ hook:'THE VERDICT…', aussi:'ALSO', priorite:'YOUR PRIORITY', plusBasse:'THE LOWEST', reponses:'FROM YOUR ANSWERS', lectureReponses:'YOUR READING AND ANSWERS',
          reponsesCourt:'YOUR ANSWERS', lues:'READ', taLecture:'YOUR READING', tirage:'THE DRAW', n1:'MY NO. 1 NEED', lecture:'READING', analyse:'ANALYSIS', routine:'MY ROUTINE', assiette:'MY PLATE',
          cta:{ peau:['AND YOU?', 'WHAT DOES YOUR SKIN NEED?'], cheveux:['AND YOU?', 'WHAT DOES YOUR HAIR NEED?'], aliment:['AND YOU?', 'WHAT’S ON YOUR PLATE?'] } },
      l:{ hook:{ peau:'What your skin asks for', cheveux:'What your hair asks for', aliment:'What your plate says' },
          edition:{ peau:'Skin edition', cheveux:'Hair edition', aliment:'Plate edition' },
          soins:{ peau:'The ritual', cheveux:'The ritual', aliment:'The plate' }, aussi:'Also',
          cta:{ peau:['And you,', 'what does your skin need?'], cheveux:['And you,', 'what does your hair need?'], aliment:['And you,', 'what’s on your plate?'] },
          plusBasse:'your lowest measure', mesures:'measures', mesure:'measure', lectures:'readings', lecture:'reading', aliments:'foods,', uneAssiette:'one plate.', unePriorite:'one priority.',
          enCouv:'Cover story', defile:'Runway', look:'Look', dernier:'Final look' },
      x:{ hook:{ peau:'What your skin asks for', cheveux:'What your hair asks for', aliment:'My reading, my plate' },
          kicker:{ peau:'Skin edition', cheveux:'Hair edition', aliment:'Plate edition' },
          mien:{ peau:'MY SKIN', cheveux:'MY HAIR', aliment:'MY PLATE' },
          produits:{ peau:'My products', cheveux:'My routine', aliment:'My plate' },
          etToi:'AND YOU?', aussi:'Also', photo:'Photo' },
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
      .map(function(c){ var o = { label:String(c.label), valeur:c.valeur, unite:c.unite ? String(c.unite) : '' }; if (c.cle) o.cle = String(c.cle); return o; });
    var phare = d.phare && d.phare.label && num(d.phare.valeur) !== null ? { label:String(d.phare.label), valeur:d.phare.valeur, unite:d.phare.unite || '' } : null;
    if (!phare) phare = chiffres.filter(function(c){ return num(c.valeur) !== null; })[0] || null;
    var autres = chiffres.filter(function(c){ return !phare || !(c.label === phare.label && String(c.valeur) === String(phare.valeur)); }).slice(0, 3);
    var items = (d.items || []).filter(function(it){ return it && it.nom; }).slice(0, 4).map(function(it){
      return { nom:String(it.nom), marque:it.marque ? String(it.marque) : '', image:it.image || '', etape:it.etape ? String(it.etape).replace(/^\s*0?\d+\s*[·.\-]\s*/, '') : '', fond:!!it.fond, credit:it.credit ? String(it.credit).slice(0, 90) : '' };
    });
    /* 07/10 (X) : l'assiette transmet la lecture de peau qui a decide les aliments (memes niveaux que la page) */
    var lecture = null, lu = d.lecture;
    if (lu && typeof lu === 'object' && (lu.entretien || IND_X[lu.i1])){
      lecture = { i1:lu.entretien ? 'entretien' : String(lu.i1), n1:num(lu.n1), niv1:NIV_X[lu.niv1] ? lu.niv1 : null, i2:IND_X[lu.i2] ? String(lu.i2) : null, n2:num(lu.n2), niv2:NIV_X[lu.niv2] ? lu.niv2 : null,
                  entretien:!!lu.entretien, bas:IND_X[lu.bas] ? String(lu.bas) : null };
      var lgI = langue() === 'fr' ? 'fr' : 'en';
      /* les libelles des indices suivent la langue du Wrap */
      chiffres.forEach(function(c){ if (c.cle === 'indice'){ var k = lecture.entretien ? lecture.bas : lecture.i1; if (IND_X[k]) c.label = IND_X[k][lgI]; } if (c.cle === 'indice2' && IND_X[lecture.i2]) c.label = IND_X[lecture.i2][lgI]; });
      if (phare && d.phare && d.phare.cle === 'indice'){ var kp = lecture.entretien ? lecture.bas : lecture.i1; if (IND_X[kp]) phare.label = IND_X[kp][lgI]; }
    }
    /* X1 : la vignette du scan (jamais envoyee : elle reste dans la page) ; sans elle, X1 ne dessine aucun visage */
    var visage = null, vs = d.visage;
    if (vs && typeof vs.src === 'string' && (/^data:image\/(jpeg|png|webp);base64,/.test(vs.src) || /^blob:/.test(vs.src))){
      visage = { src:vs.src, sujet:vs.sujet === 'cheveux' ? 'cheveux' : 'visage',
                 pts:Array.isArray(vs.pts) && vs.pts.length === 68 && vs.pts.every(function(p){ return p && isFinite(p[0]) && isFinite(p[1]); }) ? vs.pts : null,
                 box:vs.box && isFinite(vs.box.x) && isFinite(vs.box.y) && vs.box.w > 0 && vs.box.h > 0 ? { x:+vs.box.x, y:+vs.box.y, w:+vs.box.w, h:+vs.box.h } : null };
    }
    var prenom = String(d.prenom || '').trim().slice(0, 20);
    if (prenom) prenom = prenom.charAt(0).toLocaleUpperCase() + prenom.slice(1);
    var th = THEMES[type];
    var out = {
      type:type, prenom:prenom, titre:String(d.titre || '').trim(),
      chiffres:chiffres, phare:phare, autres:autres, items:items,
      exemple:!!d.exemple, palette:(d.palette && d.palette in PALETTES) ? d.palette : (PAL_FIXE ? PAL_DEFAUT : auHasard(Object.keys(PALETTES))), style:/^(A|B|C|D|D[1-4]|R[1-4]|L[1-4]|X[1-4])$/.test(String(d.style || '').toUpperCase()) ? String(d.style).toUpperCase() : auHasard(STYLES_DEFAUT),   /* 07/10 : Charles valide les 4 Wrap 3D : style et couleur tires au hasard a chaque Wrap */
      a:hexRgb(d.couleur || th.a), b:hexRgb(d.couleur2 || th.b), fond:th.fond, theme:th,
      besoins:Array.isArray(d.besoins) ? d.besoins.filter(function(b){ return b && b.cle; }) : undefined,
      lecture:lecture, visage:visage
    };
    out.tm = temps(out.style);
    /* les variantes D1 a D4 : ce qu'elles revelent, derive une fois des vraies valeurs (rien d'aleatoire) */
    if (VARIANTES[out.style]){ var L = T(); out.P = profil(out, L); out.G = devinettes(out); out.C3 = compteARebours(out); }
    /* R1 a R4 : la phrase du besoin, derivee une fois des vraies valeurs (table BES) */
    if (/^[RLX]/.test(out.style)) out.B = besoinsR(out, T());
    /* L1 a L4 : les memes besoins, ecrits en titre de une, et le decoupage du temps */
    if (/^L/.test(out.style)){ out.LX = luxeL(out); out.PL = planL(out); }
    /* X1 a X4 : les memes phrases (capitales de R, bas de casse de L) et le decoupage en 18 temps */
    if (/^X/.test(out.style)){ out.LX = luxeL(out); out.PX = planX(out); }
    return out;
  }

  /* ------------------------------------------- D1 a D4 : tempo et donnees */
  /* chaque variante dure exactement 4 mesures (16 temps) a son propre tempo : la fin retombe sur le debut */
  var VARIANTES = { D1:{ bpm:126 }, D2:{ bpm:128 }, D3:{ bpm:140 }, D4:{ bpm:132 },
                    R1:{ bpm:120, poster:7.6 }, R2:{ bpm:124, poster:7.6 }, R3:{ bpm:128, poster:7.6 }, R4:{ bpm:116, poster:7.6 },
                    /* 07/10 : la serie L, 12 temps lents (8,4 s a 8,8 s) */
                    L1:{ bpm:86, temps:12, poster:5.6 }, L2:{ bpm:82, temps:12, poster:5.6 }, L3:{ bpm:88, temps:12, poster:5.6 }, L4:{ bpm:84, temps:12, poster:5.6 },
                    /* 07/10 (nuit) : la serie X, 18 temps (8,2 s a 9 s) */
                    X1:{ bpm:124, temps:18, poster:5.4 }, X2:{ bpm:126, temps:18, poster:5.4 }, X3:{ bpm:120, temps:18, poster:5.4 }, X4:{ bpm:132, temps:18, poster:5.4 } };
  /* X : le decoupage du temps (en temps de la mesure, 18 par boucle) ; les soins se partagent les temps 7 a 13 */
  function planX(d){
    var n = d.items.length;
    return { tens:1, sil:3.75, rev:4, preuve:4.85, aut:5.6, prod:7, dp:n ? 6 / n : 0, n:n, cta:n ? 13 : 8.5, retour:16, fin:18 };
  }
  /* l'assiette : les indices de la lecture de peau (memes noms que la page) et les trois niveaux */
  var IND_X = { hydratation:{ fr:'Hydratation', en:'Hydration' }, eclat:{ fr:'Éclat', en:'Radiance' }, rougeurs:{ fr:'Rougeurs', en:'Redness' },
                pores_sebum:{ fr:'Pores et sébum', en:'Pores and sebum' }, uniformite:{ fr:'Uniformité', en:'Evenness' },
                rides_fermete:{ fr:'Rides et fermeté', en:'Lines and firmness' }, texture:{ fr:'Texture', en:'Texture' } };
  var NIV_X = { prioritaire:{ fr:'PRIORITAIRE', en:'PRIORITY' }, surveiller:{ fr:'À SURVEILLER', en:'TO WATCH' }, normal:{ fr:'DANS MA ZONE', en:'IN MY RANGE' } };
  function temps(st){
    var v = VARIANTES[st];
    if (!v) return { D:D, HOLD:HOLD, CYCLE:CYCLE, FIN_REC:FIN_REC, poster:D - .02, boucle:false };
    var b = 60 / v.bpm, dv = (v.temps || 16) * b;
    return { D:dv, HOLD:0, CYCLE:dv, FIN_REC:dv, beat:b, poster:b * (v.poster || 8.6), boucle:true, bpm:v.bpm };
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
    if (d.type === 'aliment' && d.lecture){
      /* 07/10 : l'assiette revele le besoin lu sur la peau (l'indice qui a decide les aliments), plus le nombre d'aliments passes en revue */
      var lgP = langue() === 'fr' ? 'fr' : 'en', lu = d.lecture, ci = d.chiffres.filter(function(c){ return c.cle === 'indice' && num(c.valeur) !== null; })[0];
      var nomP = lu.entretien ? (lgP === 'fr' ? 'ENTRETIEN' : 'MAINTENANCE') : maj(IND_X[lu.i1][lgP]);
      var raisonP = ci ? maj(ci.label) + ' ' + valTxt(ci) + '/100' + (NIV_X[lu.entretien ? 'normal' : lu.niv1] ? ' · ' + NIV_X[lu.entretien ? 'normal' : lu.niv1][lgP] : '') : '';
      return { nom:nomP, raison:raisonP, roll:d.items.map(function(it){ return maj(it.nom); }).concat([nomP]) };
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
  var PAL_DEFAUT = 'origine', PAL_FIXE = false, STYLES_DEFAUT = ['X1', 'X2', 'X3', 'X4'];
  function auHasard(l){ return l[Math.floor(Math.random()*l.length)]; }
  try { var qp = (location.search.match(/[?&]pal=([a-z]+)/) || [])[1]; if (qp && qp in PALETTES){ PAL_DEFAUT = qp; PAL_FIXE = true; } } catch(e){}
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

  /* ===================================================================
     R1 a R4 · LA REVELATION (07/10/2026). Charles : « des phrases plutot
     que mon prenom (hydrater, eclat...), en plus gros ; un truc qui
     devoile, roulement de tambour et bim ». Le meme arc pour les quatre :
       temps 0-6   : le suspense (l'image et le son montent ensemble) ;
       temps 6     : BIM, la phrase du besoin en geant ;
       temps 6-8   : la phrase tient, avec sa preuve (la vraie mesure) ;
       temps 8-10  : un ou deux autres besoins, plus vite ;
       temps 10-13 : les soins (ou les aliments) ; 13-15 : « Et toi ? » ;
       temps 15    : l'accroche, la meme image que la toute premiere.
     La phrase vient des vraies valeurs, par la table BES ecrite en dur :
     le besoin n°1 = la mesure la plus basse (toutes les mesures de peau
     arrivent dans le sens « haut = bien »). Jamais d'aleatoire.
     =================================================================== */
  var RX = 530, RW = 800, SEUIL_R = 80;
  /* mesure -> [phrase geante, constat], en francais et en anglais */
  var BES = {
    peau: {
      hydration:    { re:/hydra|moist|feucht|hidrat|idrat/i, fr:['HYDRATER', 'TA PEAU A SOIF'], en:['HYDRATE', 'YOUR SKIN IS THIRSTY'] },
      glow:         { re:/[ée]clat|glow|radian|lumin|leucht|stralend/i, fr:['PLUS D’ÉCLAT', 'RÉVEILLER TON TEINT'], en:['MORE GLOW', 'WAKE UP YOUR SKIN'] },
      redness:      { re:/apais|calm|sooth|redness|rougeur|beruhig|kalmer/i, fr:['APAISER', 'TA PEAU VEUT DU CALME'], en:['SOOTHE', 'YOUR SKIN WANTS CALM'] },
      sebum:        { re:/s[ée]b|talg|oil|sebo/i, fr:['RÉGULER', 'MOINS DE BRILLANCE'], en:['BALANCE', 'LESS SHINE'] },
      pores:        { re:/pore|poro|pori/i, fr:['AFFINER', 'LE GRAIN DE TA PEAU'], en:['REFINE', 'YOUR SKIN TEXTURE'] },
      wrinkles:     { re:/ridul|wrinkl|fine line|linhas|lijn|feine/i, fr:['LISSER', 'LES RIDULES'], en:['SMOOTH', 'FINE LINES'] },
      pigmentation: { re:/uniform|even|pigment|ebenm/i, fr:['UNIFIER', 'TON TEINT'], en:['EVEN OUT', 'YOUR SKIN TONE'] },
      firmness:     { re:/ferm|firm|festig|stevig/i, fr:['RAFFERMIR', 'TA PEAU VEUT DU RESSORT'], en:['FIRM UP', 'YOUR SKIN WANTS BOUNCE'] },
      _pos:         { fr:['GARDER CE NIVEAU', 'TA PEAU VA BIEN'], en:['KEEP IT UP', 'YOUR SKIN IS DOING WELL'] }
    },
    cheveux: {
      secheresse:     { fr:['NOURRIR', 'TES CHEVEUX ONT SOIF'], en:['NOURISH', 'YOUR HAIR IS THIRSTY'] },
      casse:          { fr:['FORTIFIER', 'MOINS DE CASSE'], en:['STRENGTHEN', 'LESS BREAKAGE'] },
      racinesGrasses: { fr:['ÉQUILIBRER', 'DES RACINES PLUS LÉGÈRES'], en:['BALANCE', 'LIGHTER ROOTS'] },
      frizz:          { fr:['DISCIPLINER', 'MOINS DE FRISOTTIS'], en:['SMOOTH', 'LESS FRIZZ'] },
      couleur:        { fr:['PROTÉGER LA COULEUR', 'TES CHEVEUX COLORÉS'], en:['PROTECT YOUR COLOUR', 'COLOURED HAIR'] },
      boucles:        { re:/boucle|curl|rizo|locken|krul|ricci/i, fr:['DÉFINIR TES BOUCLES', 'DES BOUCLES À SUBLIMER'], en:['DEFINE YOUR CURLS', 'CURLS TO SHOW OFF'] },
      _pos:           { fr:['GARDER L’ÉQUILIBRE', 'TES CHEVEUX VONT BIEN'], en:['KEEP THE BALANCE', 'YOUR HAIR IS DOING WELL'] }
    },
    aliment: {
      saison:    { re:/saison|season/i, fr:['PLUS DE SAISON', 'CE MOIS-CI'], en:['MORE IN SEASON', 'THIS MONTH'] },
      surmesure: { re:/[ée]cart|exclu/i, fr:['SUR MESURE', 'FAITE POUR TOI'], en:['TAILOR-MADE', 'MADE FOR YOU'] },
      selection: { re:/retenu|retain|chosen|kept/i, fr:['TRIÉE POUR TOI', 'MON ASSIETTE'], en:['HAND-PICKED', 'MY PLATE'] }
    }
  };
  function besoinsR(d, L){
    var lg = langue() === 'fr' ? 'fr' : 'en', tb = BES[d.type] || BES.peau, R = L.r, out = { liste:[], lignes:[], positif:false, cible:-1, roue:[] };
    function cleDe(c){ if (c.cle && tb[c.cle]) return c.cle; for (var k in tb) if (tb[k].re && tb[k].re.test(c.label)) return k; return null; }
    function preuve(c){ return maj(c.label) + ' ' + valTxt(c) + (num(c.valeur) !== null ? unite(c) : ''); }
    function a(k){ return out.liste.some(function(e){ return e.cle === k; }); }
    function pousse(k, ref, pr, defaut){ var e = (k && tb[k] && !a(k)) ? tb[k][lg] : defaut; out.liste.push({ cle:k, gros:e[0], constat:e[1] || '', preuve:pr || '', ref:ref || null }); }
    function ligne(c, max){ var v = num(c.valeur); return { label:maj(c.label), v:v, max:max || (est100(c) ? 100 : 0), txt:v !== null ? valTxt(c) + unite(c) : maj(String(c.valeur)), ref:c }; }
    var cent = d.chiffres.filter(function(c){ return num(c.valeur) !== null && est100(c) && c.cle !== 'global' && !/indice|index|global/i.test(c.label); });
    if (d.type === 'peau'){
      var m = cent.map(function(c, i){ return { c:c, i:i, v:num(c.valeur) }; }).sort(function(x, y){ return x.v - y.v || x.i - y.i; });
      if (!m.length) pousse(null, d.phare, d.phare ? preuve(d.phare) : '', [maj(d.titre || L.types[d.type]), '']);
      else if (m[0].v >= SEUIL_R){ out.positif = true; pousse('_pos', m[0].c, preuve(m[0].c) + ' · ' + R.plusBasse); }
      else m.filter(function(o){ return o.v < SEUIL_R; }).slice(0, 3).forEach(function(o){ pousse(cleDe(o.c), o.c, preuve(o.c), [maj(o.c.label), R.priorite]); });
      out.lignes = cent.slice(0, 8).map(function(c){ return ligne(c); });
    } else if (d.type === 'cheveux'){
      /* les besoins viennent de la page (memes seuils que sa propre phrase), dans son ordre ; la boucle, de la photo */
      var bc = d.chiffres.filter(function(c){ return (c.cle === 'boucle' || BES.cheveux.boucles.re.test(c.label)) && num(c.valeur) !== null; })[0];
      (Array.isArray(d.besoins) ? d.besoins : []).forEach(function(b){
        /* 07/10 : la preuve nomme la mesure (« SÉCHERESSE · D'APRÈS TES RÉPONSES ») quand la page la transmet */
        if (b && tb[b.cle] && b.cle.charAt(0) !== '_' && !a(b.cle) && out.liste.length < 3) pousse(b.cle, 'rep', (b.label ? maj(String(b.label)) + ' · ' : '') + (b.source === 'reponses' ? R.reponses : b.source === 'photo' ? R.taLecture : R.lectureReponses));
      });
      if (bc && num(bc.valeur) >= 55 && out.liste.length < 3) pousse('boucles', bc, preuve(bc));
      if (!out.liste.length){
        if (Array.isArray(d.besoins)){ out.positif = true; pousse('_pos', bc || null, R.lectureReponses); }
        else pousse(null, null, '', [R.routine, d.items.length ? maj(L.rituel(d.items.length, d.type)) : '']);
      }
      out.lignes = d.chiffres.slice(0, 7).map(function(c){ return ligne(c); });
      if (out.liste.some(function(e){ return e.ref === 'rep'; })) out.lignes.push({ label:R.reponsesCourt, v:null, max:100, txt:R.lues, ref:'rep' });
    } else if (d.lecture){
      /* 07/10 : l'assiette revele le besoin que la page a lu (Core.indices) : l'indice, son niveau, sa valeur ;
         en entretien, aucun faux probleme. Jamais d'effet promis : on nomme le besoin, pas un resultat. */
      var lu = d.lecture, ci1 = d.chiffres.filter(function(c){ return c.cle === 'indice' && num(c.valeur) !== null; })[0], ci2 = d.chiffres.filter(function(c){ return c.cle === 'indice2' && num(c.valeur) !== null; })[0];
      var pr = function(c, niv){ return c ? maj(c.label) + ' ' + valTxt(c) + '/100' + (NIV_X[niv] ? ' · ' + NIV_X[niv][lg] : '') : ''; };
      if (lu.entretien){
        out.positif = true;
        out.liste.push({ cle:'_entretien', gros:lg === 'fr' ? 'TA PEAU VA BIEN' : 'YOUR SKIN IS DOING WELL', constat:lg === 'fr' ? 'ASSIETTE D’ENTRETIEN' : 'A MAINTENANCE PLATE', preuve:pr(ci1, 'normal'), ref:ci1 || null });
      } else {
        out.liste.push({ cle:'ind_' + lu.i1, gros:maj(IND_X[lu.i1][lg]), constat:lu.niv1 === 'prioritaire' ? (lg === 'fr' ? 'MA PRIORITÉ N°1' : 'MY NO. 1 PRIORITY') : NIV_X.surveiller[lg], preuve:pr(ci1, lu.niv1), ref:ci1 || null });
        if (lu.i2 && IND_X[lu.i2] && lu.i2 !== lu.i1) out.liste.push({ cle:'ind_' + lu.i2, gros:maj(IND_X[lu.i2][lg]), constat:NIV_X[lu.niv2] ? NIV_X[lu.niv2][lg] : '', preuve:pr(ci2, lu.niv2), ref:ci2 || null });
      }
      out.lignes = d.chiffres.slice(0, 8).map(function(c){ return ligne(c, est100(c) ? 100 : Math.max.apply(null, d.chiffres.map(function(z){ return num(z.valeur) || 1; }))); });
    } else {
      var get = function(k){ return d.chiffres.filter(function(c){ return (c.cle === k || (BES.aliment[k] && BES.aliment[k].re.test(c.label))) && num(c.valeur) !== null; })[0]; };
      var rv = d.chiffres.filter(function(c){ return (c.cle === 'revue' || /revue|review/i.test(c.label)) && num(c.valeur) !== null; })[0];
      var sa = get('saison'), ec = get('surmesure'), re = get('selection');
      if (sa && num(sa.valeur) >= 1) pousse('saison', sa, maj(sa.label) + ' ' + valTxt(sa) + (re ? '/' + valTxt(re) : ''));
      if (ec && num(ec.valeur) >= 1) pousse('surmesure', ec, preuve(ec));
      if (re && rv) pousse('selection', re, maj(re.label) + ' ' + valTxt(re) + ' ' + L.sur + ' ' + valTxt(rv));
      if (!out.liste.length) pousse(null, null, '', [R.assiette, '']);
      var mx = 1; d.chiffres.forEach(function(c){ var v = num(c.valeur); if (v !== null && v > mx) mx = v; });
      out.lignes = d.chiffres.slice(0, 8).map(function(c){ return ligne(c, est100(c) ? 100 : mx); });
    }
    var n1 = out.liste[0];
    for (var i = 0; i < out.lignes.length; i++) if (n1 && out.lignes[i].ref === n1.ref) out.cible = i;
    /* le tirage (R2) : les autres phrases de la table, puis la bonne, en dernier */
    var mots = [];
    Object.keys(tb).forEach(function(k){ if (k.charAt(0) !== '_' && tb[k][lg][0] !== n1.gros) mots.push(tb[k][lg][0]); });
    /* 07/10 : l'assiette qui revele un indice de peau tire parmi les autres indices (pas les anciennes phrases de comptes) */
    if (d.type === 'aliment' && d.lecture){ mots = Object.keys(IND_X).map(function(k){ return maj(IND_X[k][lg]); }).filter(function(w){ return w !== n1.gros; }); }
    if (d.type === 'aliment') d.items.forEach(function(it){ var w = maj(it.nom); if (w !== n1.gros && w.length <= 18) mots.push(w); });
    if (!mots.length) mots = [maj(L.types[d.type])];
    while (out.roue.length < 20) out.roue = out.roue.concat(mots);
    out.roue.push(n1.gros);
    out.cta = R.cta[d.type] || R.cta.peau;
    return out;
  }

  function lumRel(c){ function f(v){ v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); } return .2126 * f(c[0]) + .7152 * f(c[1]) + .0722 * f(c[2]); }
  /* l'encre la plus lisible sur un fond (noir ou blanc de la palette) */
  function encre(c){ var l = lumRel(c); return (l + .05) / (lumRel(NOIR) + .05) >= (lumRel(BLANC) + .05) / (l + .05) ? NOIR : BLANC; }
  /* la couleur vive lisible sur le noir (le bleu Klein, trop sombre, passe la main a sa seconde couleur) */
  function vif(K){ return lumRel(K.c1) >= .15 ? K.c1 : K.c2; }
  /* le meilleur decoupage d'une phrase (1 a 3 lignes) : celui qui donne les plus grosses lettres */
  function coupesR(x, txt, maxW, fmax, nmax){
    var mots = String(txt).split(' ').filter(Boolean), cands = [[mots.join(' ')]], i, j;
    if (nmax >= 2) for (i = 1; i < mots.length; i++) cands.push([mots.slice(0, i).join(' '), mots.slice(i).join(' ')]);
    if (nmax >= 3) for (i = 1; i < mots.length; i++) for (j = i + 1; j < mots.length; j++) cands.push([mots.slice(0, i).join(' '), mots.slice(i, j).join(' '), mots.slice(j).join(' ')]);
    x.font = '900 100px ' + SANS; var best = null;
    cands.forEach(function(ls){
      var f = fmax; ls.forEach(function(l){ f = Math.min(f, 100 * maxW / Math.max(1, x.measureText(l).width)); });
      var sc = f * [0, 1.3, 1, .82][ls.length];
      if (!best || sc > best.sc) best = { ls:ls, f:f, sc:sc };
    });
    return best;
  }
  /* la phrase en bloc : la ligne la plus longue remplit la largeur, puis le tout s'etire en hauteur (lettres hautes) */
  Rendu.prototype.bloc = function(txt, cx, cy, maxW, maxH, col, o){
    o = o || {}; var x = this.x, fm = o.fmax || 330, nm = o.nmax || 3, k = txt + '|' + maxW + '|' + fm + '|' + nm;
    this._cR = this._cR || {}; var b = this._cR[k] || (this._cR[k] = coupesR(x, txt, maxW, fm, nm));
    /* les accents des capitales depassent la hauteur de capitale : on leur garde la place (au-dessus et entre les lignes) */
    var ACC = /[ÀÂÄÉÈÊËÎÏÔÖÙÛÜŸ]/, n = b.ls.length, f = b.f, cap = f * .73, gap = f * .2, acc = ACC.test(b.ls[0]) ? f * .24 : 0, ga = [];
    for (var gi = 1; gi < n; gi++) ga.push(gap + (ACC.test(b.ls[gi]) ? f * .2 : 0));
    var H0 = acc + n * cap + ga.reduce(function(s1, v){ return s1 + v; }, 0), sy = Math.min(o.smax || 2.1, maxH / H0), ech = 1;
    if (sy < 1){ ech = sy; f *= sy; cap *= sy; acc *= sy; H0 *= sy; ga = ga.map(function(v){ return v * ech; }); sy = 1; }
    var Ht = H0 * sy, y = cy - Ht / 2 + acc * sy, out = { f:f, sy:sy, haut:cy - Ht / 2, bas:cy + Ht / 2 }, idx = 0;
    x.font = '900 ' + f + 'px ' + SANS; x.textAlign = 'center'; x.fillStyle = rgba(col, 1);
    var a0 = x.globalAlpha;
    for (var i = 0; i < n; i++){
      var yb = y + cap * sy, ln = b.ls[i];
      if (o.lettre){
        var tot = x.measureText(ln).width, ch = Array.from(ln), acc = ''; x.textAlign = 'left';
        for (var c = 0; c < ch.length; c++){
          var x0 = x.measureText(acc).width, cw = x.measureText(ch[c]).width; acc += ch[c];
          if (ch[c] === ' '){ idx++; continue; }
          var lx = cx - tot / 2 + x0 + cw / 2, ly = yb - cap * sy / 2, tr = o.lettre(idx++, lx, ly);
          if (!tr || tr.a <= 0) continue;
          x.save(); x.globalAlpha = a0 * tr.a; x.translate(lx + tr.dx, ly + tr.dy); x.rotate(tr.r); x.scale(tr.s, tr.s); x.translate(0, cap * sy / 2); x.scale(1, sy); x.fillText(ch[c], -cw / 2, 0); x.restore();
        }
        x.textAlign = 'center';
      } else { x.save(); x.translate(cx, yb); x.scale(1, sy); x.fillText(ln, 0, 0); x.restore(); }
      y = yb + (ga[i] || 0) * sy;
    }
    return out;
  };
  /* la preuve : une pastille, la vraie mesure et sa valeur */
  Rendu.prototype.puce = function(txt, cx, y, fond, col, a, size){
    if (!txt || a <= 0) return; var x = this.x;
    size = size || 38; x.font = '700 ' + size + 'px ' + MONO; var sp = 6, w = Math.min(RW, x.measureText(txt).width + sp * (txt.length - 1) + 80), h = size + 42;
    x.globalAlpha = a == null ? 1 : a; x.fillStyle = rgba(fond, 1); rond(x, cx - w / 2, y - h / 2, w, h, h / 2); x.fill();
    x.fillStyle = rgba(col, 1); espaceTenu(x, txt, cx, y + size * .36, sp, w - 60, '700', size, MONO); x.globalAlpha = 1;
  };
  /* apres le BIM, commun aux quatre : la phrase et sa preuve, les autres besoins, les soins, « Et toi ? » */
  Rendu.prototype.suiteR = function(q, o){
    var x = this.x, d = this.d, L = this.L, B = d.B, n1 = B.liste[0], au = B.liste.slice(1), nI = d.items.length, K = this.vives(), cv = vif(K), res = { sig:NOIR, sansSite:false };
    var finP = au.length ? 8 : (nI ? 10 : 13), finA = nI ? 10 : 13;
    if (q < finP){
      var fd = o.fond || K.c1, ink = encre(fd), e = q - 6;
      this.aplat(fd);
      if (o.avant) o.avant(q, fd, ink);
      x.save();
      var k = 1 + .09 * Math.pow(1 - clamp(e / .4, 0, 1), 2), sx = e < .3 ? (hash(9, Math.floor(e * 60)) - .5) * 26 * (1 - e / .3) : 0;
      x.translate(RX + sx, 880); x.scale(k, k); x.translate(-RX, -880);
      var pc = eOut3(clamp((e - .55) / .35, 0, 1));
      if (n1.constat && pc > 0){ x.globalAlpha = pc; this.bloc(n1.constat, RX, 452 + (1 - pc) * 20, RW, 64, ink, { fmax:76, nmax:1, smax:1.15 }); x.globalAlpha = 1; }
      this.bloc(n1.gros, RX, 895, RW, 660, ink, { lettre:o.lettre ? o.lettre(q) : null, smax:3 });
      x.restore();
      this.puce(n1.preuve, RX, 1305 + (1 - eOut3(clamp((e - .9) / .35, 0, 1))) * 24, ink, fd, eOut3(clamp((e - .9) / .35, 0, 1)));
      if (o.apres) o.apres(q, fd, ink);
      res.sig = ink;
    } else if (q < finA){
      var dur = (finA - finP) / au.length, k2 = clamp(Math.floor((q - finP) / dur), 0, au.length - 1), e2 = (q - finP) - k2 * dur, en = au[k2], pk = eOut3(clamp(e2 / .25, 0, 1));
      this.aplat(NOIR); if (o.avant2) o.avant2(q, k2, e2);
      this.etiq(this.L.r.aussi + ' · ' + (k2 + 2) + '/' + B.liste.length, RX, 455, BLANC, 32, RW, .85);
      /* fondu enchaine d'un besoin au suivant : la luminosite ne saute pas (pas de flash) */
      if (k2 > 0 && pk < 1){ x.save(); x.globalAlpha = 1 - pk; this.bloc(au[k2 - 1].gros, RX, 800, RW, 520, cv, { fmax:280, smax:2.8 }); x.restore(); }
      x.save(); x.globalAlpha = k2 > 0 ? pk : 1; x.translate(0, k2 > 0 ? 0 : (1 - pk) * 140 * (o.sens || 1));
      this.bloc(en.gros, RX, 800, RW, 520, cv, { fmax:280, smax:2.8 });
      x.restore(); x.globalAlpha = 1;
      if (en.constat) this.etiq(en.constat, RX, 1135, BLANC, 34, RW, .8 * pk);
      this.puce(en.preuve, RX, 1250, cv, encre(cv), pk);
      res.sig = BLANC;
    } else if (q < 13){
      var fd3 = o.fond3 || K.c2, ink3 = encre(fd3); this.aplat(fd3);
      this.grilleProduits(finA + .25, q, ink3, ink3); res.sig = ink3;
    } else {
      this.aplat(NOIR); var cta = B.cta, pe = eOut3(clamp((q - 13) / .3, 0, 1));
      x.globalAlpha = pe;
      this.bloc(cta[0], RX, 520, RW, 110, BLANC, { nmax:1, fmax:130, smax:1.2 });
      this.bloc(cta[1], RX, 860, RW, 470, cv, { fmax:260, smax:2 });
      this.mot(L.site, '900', 120, RW, RX, 1262, BLANC); x.globalAlpha = 1;
      res.sig = BLANC; res.sansSite = true;
    }
    return res;
  };
  Rendu.prototype.flashR = function(q){ var e = q - 6; if (e < 0 || e > .2) return; var x = this.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = .42 * (1 - e / .2); x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; };
  Rendu.prototype.entete = function(y, a, col){ this.etiq(maj(this.typeMot) + ' · ' + this.date, RX, y, col || BLANC, 28, RW, .8 * a); };

  /* ---------- R1 · LE ROULEMENT (120 BPM) : le rideau ferme, la caisse claire accelere,
     le projecteur se resserre, la salle s'eteint un demi-temps, BIM : le rideau s'envole. */
  function coupsR1(){ var c = [], q; for (q = 0; q < 2; q += .5) c.push(q); for (q = 2; q < 3.5 - 1e-6; q += .25) c.push(q); for (q = 3.5; q < 4.5 - 1e-6; q += 1 / 6) c.push(q); for (q = 4.5; q < 5.5 - 1e-6; q += 1 / 12) c.push(q); return c; }
  var COUPS_R1 = coupsR1();
  function forceR1(q){ return .2 + .8 * Math.pow(clamp(q / 5.5, 0, 1), 1.6); }
  Rendu.prototype.rideau = function(ouv, q, trem){
    var x = this.x, K = this.vives(), PW = W / 2 + 60;
    if (!this._rid){
      var c = document.createElement('canvas'); c.width = PW; c.height = H; var g = c.getContext('2d');
      for (var i = 0; i < PW; i += 4){ var sh = .5 + .5 * Math.cos(i / 118 * Math.PI * 2), k = .16 + .5 * sh; g.fillStyle = 'rgb(' + Math.round(K.c1[0] * k) + ',' + Math.round(K.c1[1] * k) + ',' + Math.round(K.c1[2] * k) + ')'; g.fillRect(i, 0, 4, H); }
      var v = g.createLinearGradient(0, 0, 0, H); v.addColorStop(0, 'rgba(0,0,0,.6)'); v.addColorStop(.25, 'rgba(0,0,0,0)'); v.addColorStop(.8, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
      g.fillStyle = v; g.fillRect(0, 0, PW, H); this._rid = c;
    }
    if (ouv >= 1) return;
    var dx = ouv * PW * 1.05, w = Math.sin(q * 47) * trem * 10;
    x.save(); x.setTransform(1, 0, 0, 1, 0, 0);
    x.drawImage(this._rid, -60 - dx + w, 0);
    x.save(); x.translate(W + 60 + dx - w, 0); x.scale(-1, 1); x.drawImage(this._rid, 0, 0); x.restore();
    x.restore();
  };
  Rendu.prototype.suspenseR1 = function(q, repos){
    var x = this.x, L = this.L, K = this.vives();
    this.aplat(NOIR);
    var z = 1 + .12 * eIn3(clamp(q / 5.5, 0, 1)), choc = 0;
    if (!repos) for (var i = 0; i < COUPS_R1.length; i++){ var h = COUPS_R1[i]; if (h > q) break; choc += forceR1(h) * Math.exp(-(q - h) * 16) * (i % 2 ? 1 : -1); }
    x.save(); x.translate(RX + choc * 16, 900 + Math.abs(choc) * 5); x.scale(z, z); x.translate(-RX, -900);
    this.rideau(0, q, Math.abs(choc));
    /* le projecteur se resserre */
    var rS = lerp(820, 240, eInOut(clamp(q / 5.3, 0, 1))), fo = .55 + .45 * clamp(q / 5.5, 0, 1);
    x.globalCompositeOperation = 'lighter';
    var sp = x.createRadialGradient(RX, 900, 0, RX, 900, rS); sp.addColorStop(0, rgba(BLANC, .3 * fo)); sp.addColorStop(.7, rgba(BLANC, .12 * fo)); sp.addColorStop(1, rgba(BLANC, 0));
    x.fillStyle = sp; x.fillRect(0, 0, W, H); x.globalCompositeOperation = 'source-over';
    var om = x.createRadialGradient(RX, 900, rS * .75, RX, 900, rS * 1.9); om.addColorStop(0, 'rgba(0,0,0,0)'); om.addColorStop(1, rgba(NOIR, .82));
    x.fillStyle = om; x.fillRect(-200, -200, W + 400, H + 400);
    /* l'accroche, qui se cache dans l'ombre a la fin */
    var at = 1 - seg(q, 4.6, 5.3);
    if (at > 0){ this.entete(640, at); x.globalAlpha = at; this.bloc(L.r.hook, RX, 900, RW, 260, BLANC, { nmax:1, smax:1.8 }); x.globalAlpha = 1; }
    x.restore();
    var nr = seg(q, 5.2, 5.5);
    if (nr > 0){ x.globalAlpha = nr; x.fillStyle = rgba(NOIR, 1); x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
    return { sig:BLANC, sansSite:false };
  };
  Rendu.prototype.dessineR1 = function(tAbs){
    this.debutD();
    var x = this.x, self = this, tp = this.tempo(tAbs), q = tp.q + 1e-6, r, K = this.vives();
    if (q < 6 || q >= 15) r = this.suspenseR1(q >= 15 ? 0 : q, q >= 15);
    else {
      r = this.suiteR(q, {
        avant:function(qq){ if (qq >= 8) return; x.save(); x.translate(RX, 880); x.rotate(qq * .1); x.fillStyle = rgba(K.c2, .4);
          for (var i = 0; i < 14; i++){ x.rotate(Math.PI * 2 / 14); x.beginPath(); x.moveTo(0, 0); x.lineTo(1700, -180); x.lineTo(1700, 180); x.closePath(); x.fill(); } x.restore(); }
      });
      if (q < 6.3) this.rideau(.8 + .2 * eOut3(seg(q, 6, 6.28)), q, 0);
      if (q >= 14.5) this.rideau(1 - eInOut(seg(q, 14.5, 15)), q, 0);
      this.flashR(q);
    }
    this.finD(r.sig, r.sansSite);
  };

  /* ---------- R2 · LE TIRAGE (124 BPM) : les mots-besoins defilent comme une machine a sous,
     ralentissent, s'arretent sur LE besoin : BIM. Un tic par mot qui passe. */
  var FY = 640, FH = 520;
  /* le premier mot reste net un quart de temps (l'accroche), puis le rouleau part et ralentit jusqu'au temps 6 */
  /* puis, sur la fin, un cliquet : les quatre derniers mots passent un par un (le spectateur croit que ca s'arrete) */
  var CRAN_R2 = [[3.9, .24], [4.5, .26], [5.08, .3], [5.72, .28]];
  function posR2(q, N){
    var M = Math.max(0, N - CRAN_R2.length);
    if (q < 3.9){ var p = clamp((q - .25) / 3.65, 0, 1); return M * (1 - Math.pow(1 - p, 2)); }
    var s = M; CRAN_R2.forEach(function(c){ s += eOut3(clamp((q - c[0]) / c[1], 0, 1)); }); return Math.min(N, s);
  }
  function vitR2(q, N){ return q < .25 || q >= 3.9 ? 0 : 2 * Math.max(0, N - CRAN_R2.length) / 3.65 * (1 - (q - .25) / 3.65); }
  /* les instants ou un mot passe le milieu de la fenetre (le son y met un tic) */
  function croisementsR2(N){ var out = [], prev = posR2(0, N); for (var q = .002; q <= 6; q += .002){ var s = posR2(q, N); if (Math.floor(s - .5) > Math.floor(prev - .5)) out.push(q); prev = s; } return out; }
  Rendu.prototype.ampoules = function(s, fd, on, off, ext){
    var x = this.x, pts = [], i, n = 30, P = 2 * (800 + FH), cx0 = 130, cy0 = FY;
    for (i = 0; i < n; i++){ var u = i / n * P, px, py;
      if (u < 800){ px = cx0 + u; py = cy0; } else if (u < 800 + FH){ px = cx0 + 800; py = cy0 + u - 800; } else if (u < 1600 + FH){ px = cx0 + 800 - (u - 800 - FH); py = cy0 + FH; } else { px = cx0; py = cy0 + FH - (u - 1600 - FH); }
      pts.push([px, py]); }
    for (i = 0; i < n; i++){ var lit = ((i + Math.floor(s * 2)) % 3) === 0, p = pts[i], dx = 0, dy = 0, al = 1;
      if (ext > 0){ var vx = p[0] - RX, vy = p[1] - (FY + FH / 2), m = Math.sqrt(vx * vx + vy * vy) || 1; dx = vx / m * ext * 900; dy = vy / m * ext * 900; al = 1 - ext; lit = true; }
      x.globalAlpha = al * (lit ? .95 : .35); x.fillStyle = rgba(lit ? on : off, 1); x.beginPath(); x.arc(p[0] + dx, p[1] + dy, lit ? 10 : 8, 0, Math.PI * 2); x.fill(); }
    x.globalAlpha = 1;
  };
  Rendu.prototype.suspenseR2 = function(q){
    var x = this.x, d = this.d, L = this.L, K = this.vives(), cv = vif(K), R = d.B.roue, N = R.length - 1, s = posR2(q, N), v = vitR2(q, N);
    this.aplat(NOIR); x.drawImage(this.fondD4(), 0, 0);
    var z = 1 + .07 * eIn3(clamp(q / 6, 0, 1));
    x.save(); x.translate(RX, 900); x.scale(z, z); x.translate(-RX, -900);
    this.entete(350, 1);
    this.bloc(L.r.tirage, RX, 480, RW, 120, cv, { nmax:1, fmax:140, smax:1.4 });
    /* la fenetre et son rouleau */
    x.save(); rond(x, 130, FY, 800, FH, 40); x.fillStyle = rgba(BLANC, .06); x.fill(); x.clip();
    var i0 = Math.floor(s), ng = v > 2 ? 4 : 1, pas = Math.min(FH * .45, v * 16);
    for (var j = i0 - 1; j <= i0 + 2; j++){
      if (j < 0 || j > N) continue;
      /* les mots qui defilent restent pales (pas de clignotement), le dernier s'allume en se posant */
      var ar = q < .25 ? 1 : lerp(1, .42, seg(q, .25, .7)) + .58 * seg(q, 5.72, 6);
      for (var g = 0; g < ng; g++){ x.save(); x.globalAlpha = ar * (ng > 1 ? .32 : 1); x.translate(0, (j - s) * FH - g * pas); this.bloc(R[j], RX, FY + FH / 2, 700, 300, BLANC, { fmax:240, nmax:2, smax:2 }); x.restore(); }
    }
    var ombre = x.createLinearGradient(0, FY, 0, FY + FH); ombre.addColorStop(0, 'rgba(0,0,0,.75)'); ombre.addColorStop(.22, 'rgba(0,0,0,0)'); ombre.addColorStop(.78, 'rgba(0,0,0,0)'); ombre.addColorStop(1, 'rgba(0,0,0,.75)');
    x.fillStyle = ombre; x.fillRect(130, FY, 800, FH);
    x.restore();
    x.strokeStyle = rgba(cv, .25 + .6 * clamp(q / 6, 0, 1)); x.lineWidth = 8; rond(x, 130, FY, 800, FH, 40); x.stroke();
    this.ampoules(s, null, BLANC, cv, 0);
    this.etiq(L.r.n1, RX, 1290, BLANC, 30, RW, .8);
    x.restore();
    return { sig:BLANC, sansSite:false };
  };
  Rendu.prototype.dessineR2 = function(tAbs){
    this.debutD();
    var x = this.x, self = this, tp = this.tempo(tAbs), q = tp.q + 1e-6, r, K = this.vives();
    if (q < 6 || q >= 15) r = this.suspenseR2(q >= 15 ? 0 : q);
    else {
      r = this.suiteR(q, {
        sens:-1,
        avant:function(qq, fd, ink){ if (qq < 7.2){ var e = eOut3(clamp((qq - 6) / .9, 0, 1)); self.ampoules(0, null, ink, ink, e); } },
        apres:function(qq, fd, ink){ if (qq >= 8) return; x.globalAlpha = .9; x.strokeStyle = rgba(ink, 1); x.lineWidth = 6; rond(x, 70, 300, 920, 1150, 46); x.stroke(); x.globalAlpha = 1; }
      });
      this.flashR(q);
    }
    this.finD(r.sig, r.sansSite);
  };

  /* ---------- R3 · LE SCAN (128 BPM) : une barre de lecture balaie les vraies mesures, les chiffres
     montent, elle revient lentement se poser sur la plus basse, un temps de silence, BIM. */
  function planR3(n, cible){
    var pas = Math.min(116, 860 / Math.max(1, n)), y0 = 500 + (860 - pas * n) / 2, yc = [], ti = [];
    for (var i = 0; i < n; i++){ yc.push(y0 + pas * (i + .5)); ti.push(.3 + 2.4 * clamp((y0 + pas * (i + .5) - 440) / 950, 0, 1)); }
    return { pas:pas, yc:yc, ti:ti, cible:cible < 0 ? 0 : cible };
  }
  function barreR3(q, P){ if (q < .3) return 440; if (q < 2.7) return lerp(440, 1390, (q - .3) / 2.4); if (q < 4.5) return lerp(1390, P.yc[P.cible] || 900, eOut3((q - 2.7) / 1.8)); return P.yc[P.cible] || 900; }
  Rendu.prototype.suspenseR3 = function(q, repos){
    var x = this.x, d = this.d, L = this.L, K = this.vives(), cv = vif(K), rows = d.B.lignes, P = this._pR3 || (this._pR3 = planR3(rows.length, d.B.cible));
    this.aplat(NOIR); x.drawImage(this.fondD3(), 0, 0);
    var sil = seg(q, 5, 5.3), zoom = eInOut(seg(q, 4.5, 6)), yT = P.yc[P.cible] || 900;
    x.save(); x.translate(RX, lerp(yT, 900, zoom)); x.scale(1 + .22 * zoom, 1 + .22 * zoom); x.translate(-RX, -yT);
    var ah = 1 - sil;
    if (ah > 0){
      x.globalAlpha = ah; this.etiq(L.r.lecture + ' · ' + maj(this.typeMot) + ' · ' + this.date, RX, 345, cv, 28, RW, .9 * ah);
      x.globalAlpha = ah; this.etiq(L.r.analyse + '  ' + Math.round(100 * clamp(q / 4.5, 0, 1)) + ' %', RX, 400, BLANC, 28, RW, .7 * ah);
    }
    for (var i = 0; i < rows.length; i++){
      var rw = rows[i], yc = P.yc[i], cib = i === P.cible, pr = repos ? 0 : eOut3(clamp((q - P.ti[i]) / .6, 0, 1)), vu = !repos && q >= P.ti[i];
      var dim = cib ? 1 : (1 - .7 * seg(q, 4.5, 5)) * ah;
      if (dim <= 0) continue;
      x.globalAlpha = dim;
      if (cib && q >= 4.5){ var hl = seg(q, 4.5, 4.75); x.fillStyle = rgba(cv, .16 * hl); x.fillRect(110, yc - P.pas * .46, 840, P.pas * .92); x.strokeStyle = rgba(cv, hl); x.lineWidth = 4; x.strokeRect(110, yc - P.pas * .46, 840, P.pas * .92); }
      x.textAlign = 'left'; x.font = '700 ' + Math.min(30, P.pas * .27) + 'px ' + MONO; x.fillStyle = rgba(cib && q >= 4.5 ? cv : BLANC, .9);
      var lb = rw.label; if (lb.length > 26) lb = lb.slice(0, 25) + '…'; espace(x, lb, 140, yc - 6, 4, 'left');
      x.fillStyle = rgba(BLANC, .12); x.fillRect(140, yc + 14, 780, 8);
      if (rw.v !== null && rw.max > 0){ x.fillStyle = rgba(cib && q >= 4.5 ? cv : K.c2, .95); x.fillRect(140, yc + 14, 780 * clamp(rw.v / rw.max, 0, 1) * pr, 8); }
      x.textAlign = 'right'; x.font = '900 ' + Math.min(50, P.pas * .44) + 'px ' + SANS; x.fillStyle = rgba(BLANC, 1);
      var tv = vu ? (rw.v !== null ? formate(rw.v * pr, Math.round(rw.v) !== rw.v) + (/\/100|%/.test(rw.txt) ? rw.txt.replace(/^[^/%]*/, '') : '') : rw.txt) : '—';
      x.fillText(tv, 920, yc + 2); x.textAlign = 'center';
    }
    x.globalAlpha = 1;
    /* la barre de lecture */
    if (ah > 0){
      var by = barreR3(repos ? 0 : q, P); x.globalAlpha = ah;
      var gl = x.createLinearGradient(0, by - 120, 0, by); gl.addColorStop(0, rgba(cv, 0)); gl.addColorStop(1, rgba(cv, .22));
      x.fillStyle = gl; x.fillRect(100, by - 120, 860, 120); x.fillStyle = rgba(BLANC, .9); x.fillRect(100, by - 2, 860, 4);
      x.globalAlpha = 1;
    }
    x.restore();
    return { sig:BLANC, sansSite:false };
  };
  Rendu.prototype.dessineR3 = function(tAbs){
    this.debutD();
    var x = this.x, tp = this.tempo(tAbs), q = tp.q + 1e-6, r, K = this.vives();
    if (q < 6 || q >= 15) r = this.suspenseR3(q >= 15 ? 0 : q, q >= 15);
    else {
      r = this.suiteR(q, {
        avant:function(qq, fd, ink){ if (qq >= 8) return; var a = 1 - seg(qq, 6, 6.6); for (var yy = 0; yy <= H; yy += 90){ x.fillStyle = rgba(ink, .07); x.fillRect(0, yy, W, 2); }
          if (a > 0){ x.globalAlpha = a; x.fillStyle = rgba(BLANC, 1); x.fillRect(0, 878, W, 4); x.globalAlpha = 1; } }
      });
      this.flashR(q);
    }
    this.finD(r.sig, r.sansSite);
  };

  /* ---------- R4 · LE BATTEMENT (116 BPM) : un coeur de lumiere bat de plus en plus vite,
     l'ecran se resserre autour de lui, puis explose : les lettres de la phrase volent en place. */
  var HB_R4 = [0, 1.6, 2.9, 3.9, 4.6, 5.1, 5.45, 5.7, 5.88];
  function battementsR4(){ return HB_R4.map(function(h, i){ var g = (i + 1 < HB_R4.length ? HB_R4[i + 1] : 6) - h; return [h, h + Math.min(.3, g * .42)]; }); }
  var BAT_R4 = battementsR4();
  function eOutBack(p){ var c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); }
  Rendu.prototype.suspenseR4 = function(q, repos){
    var x = this.x, L = this.L, K = this.vives(), cv = vif(K), te = eIn3(clamp(q / 6, 0, 1)), env = 0, i;
    if (!repos) BAT_R4.forEach(function(b){ if (q >= b[0]) env += Math.exp(-(q - b[0]) * 8); if (q >= b[1]) env += .6 * Math.exp(-(q - b[1]) * 8); });
    this.aplat(NOIR);
    var sx = (hash(4, Math.floor(q * 40)) - .5) * 10 * te * env;
    x.save(); x.translate(sx, 0);
    /* les ondes, une par battement */
    if (!repos) for (i = 0; i < BAT_R4.length; i++){ var dq = q - BAT_R4[i][0]; if (dq < 0 || dq > 1.2) continue; x.strokeStyle = rgba(cv, .5 * (1 - dq / 1.2)); x.lineWidth = 6; x.beginPath(); x.arc(RX, 900, 240 + dq * 430, 0, Math.PI * 2); x.stroke(); }
    var R0 = 236 * (1 + .1 * Math.min(1.6, env));
    x.globalCompositeOperation = 'lighter';
    var gl = x.createRadialGradient(RX, 900, R0 * .6, RX, 900, R0 * 1.9); gl.addColorStop(0, rgba(cv, .35)); gl.addColorStop(1, rgba(cv, 0)); x.fillStyle = gl; x.fillRect(RX - R0 * 2, 900 - R0 * 2, R0 * 4, R0 * 4);
    x.globalCompositeOperation = 'source-over';
    x.fillStyle = rgba(cv, 1); x.beginPath(); x.arc(RX, 900, R0, 0, Math.PI * 2); x.fill();
    /* l'accroche dans le coeur : les lettres se serrent */
    var ink = encre(cv);
    var kz = 1 + .1 * Math.min(1.6, env); x.save(); x.translate(RX, 900); x.scale(kz, kz); x.translate(-RX, -900);
    this.bloc(L.r.hook, RX, 900, 400, 120, ink, { nmax:1, smax:1.6, lettre:function(k, lx){ return { dx:(lx - RX) * -.3 * te, dy:0, s:1, r:0, a:1 }; } });
    x.restore();
    var ah = 1 - seg(q, 3, 4.5);
    if (ah > 0) this.entete(560, ah);
    x.restore();
    /* l'ecran se resserre */
    var rI = lerp(1350, 400, eInOut(clamp(q / 5.9, 0, 1)));
    if (rI < 1300){ x.fillStyle = rgba(NOIR, 1); x.beginPath(); x.rect(0, 0, W, H); x.arc(RX, 900, rI, 0, Math.PI * 2, true); x.fill('evenodd');
      var bo = x.createRadialGradient(RX, 900, rI * .82, RX, 900, rI); bo.addColorStop(0, rgba(NOIR, 0)); bo.addColorStop(1, rgba(NOIR, 1)); x.fillStyle = bo; x.fillRect(RX - rI, 900 - rI, rI * 2, rI * 2); }
    return { sig:BLANC, sansSite:false };
  };
  Rendu.prototype.dessineR4 = function(tAbs){
    this.debutD();
    var x = this.x, tp = this.tempo(tAbs), q = tp.q + 1e-6, r, K = this.vives();
    if (q < 6 || q >= 15) r = this.suspenseR4(q >= 15 ? 0 : q, q >= 15);
    else {
      r = this.suiteR(q, {
        lettre:function(qq){ var e = clamp((qq - 6) / .42, 0, 1); if (e >= 1) return null; var eb = eOutBack(e);
          return function(k, lx, ly){ var u = 1 - eb;
            return { dx:(lx - RX) * .1 * u + (hash(k, 7) - .5) * 40 * u, dy:(hash(k, 3) - .5) * 40 * u, s:1 + .1 * u, r:u * (hash(k, 5) - .5) * .25, a:1 }; }; },
        avant:function(qq, fd, ink){ var e = qq - 6; if (e > 1.4) return; var p = eOut3(clamp(e / 1, 0, 1));
          x.strokeStyle = rgba(ink, .5 * (1 - p)); x.lineWidth = 44 * (1 - p) + 2; x.beginPath(); x.arc(RX, 880, 120 + p * 1100, 0, Math.PI * 2); x.stroke();
          for (var i = 0; i < 36; i++){ var an = hash(i, 13) * Math.PI * 2, dd = (150 + hash(i, 17) * 900) * eOut3(clamp(e / 1.2, 0, 1)), sz = 14 + hash(i, 19) * 30;
            x.save(); x.globalAlpha = .8 * (1 - clamp(e / 1.4, 0, 1)); x.translate(RX + Math.cos(an) * dd, 880 + Math.sin(an) * dd); x.rotate(e * 6 * (hash(i, 23) - .5)); x.fillStyle = rgba(ink, 1); x.fillRect(-sz / 2, -sz / 5, sz, sz / 2.5); x.restore(); } }
      });
      this.flashR(q);
    }
    this.finD(r.sig, r.sansSite);
  };


  /* ===================================================================
     L1 a L4 · LA SERIE LUXE (07/10/2026). Charles, sur R1-R4 : « pas assez
     stylé… ça doit faire luxe, plus tendance, plus wow ». Meme arc et memes
     phrases que R (meme derivation des vraies valeurs : besoinsR, table BES),
     mais un autre langage :
       - polices de mode chargees localement (dossier fonts/, licence OFL) :
         Bodoni Moda (Didone), Cormorant Garamond (italique), Jost (capitales fines) ;
         rien n'est dessine tant qu'elles ne sont pas chargees (repli propre sinon) ;
       - noir profond, ivoire, or ; un seul accent ; grain, vignettage, halos ;
       - mouvement lent, puis la revelation nette sur le temps fort ;
       - son de film : piano, cordes, timbale, jamais d'EDM.
     12 temps (7 a 9 s selon le tempo) :
       0-4      : le suspense (la toute premiere image est deja l'accroche) ;
       4        : la revelation, la phrase du besoin en titre ;
       4-6.5    : sa preuve (la vraie mesure), puis les autres besoins ;
       6.5-10   : les soins, un a la fois ; 10-11.2 : « Et toi ? » ;
       11.2-12  : retour a la toute premiere image (boucle parfaite).
     Zone sure : rien d'important au-dessus de y = 280 ni sous y = 1510,
     colonne centree a x = 520 (le bord droit reste libre).
     =================================================================== */
  var LX = 520, LMW = 790, L_SIG = 1500;
  var DIDONE = '"VY Bodoni Moda","Bodoni 72","Didot","Bodoni MT",Georgia,serif';
  var GARA = '"VY Cormorant Garamond","Cormorant Garamond","Iowan Old Style",Georgia,serif';
  var FINE = '"VY Jost",Jost,Futura,"Avenir Next","Helvetica Neue",Arial,sans-serif';
  var OR_L = [205, 172, 110];
  /* ---------- les polices, chargees une fois (FontFace), avant le premier dessin */
  var POL = { etat:'attente', promesse:null };
  var BASE_POL = (function(){ try { var s = document.currentScript && document.currentScript.src; if (s) return new URL('fonts/', s).href; } catch(e){} return '/wrap/fonts/'; })();
  var FACES_L = [
    ['VY Bodoni Moda', 'bodoni-moda-display-400.woff2', { weight:'400', style:'normal' }],
    ['VY Bodoni Moda', 'bodoni-moda-display-600.woff2', { weight:'600', style:'normal' }],
    ['VY Bodoni Moda', 'bodoni-moda-display-400-italic.woff2', { weight:'400', style:'italic' }],
    ['VY Cormorant Garamond', 'cormorant-garamond-300.woff2', { weight:'300', style:'normal' }],
    ['VY Cormorant Garamond', 'cormorant-garamond-300-italic.woff2', { weight:'300', style:'italic' }],
    ['VY Cormorant Garamond', 'cormorant-garamond-500-italic.woff2', { weight:'500', style:'italic' }],
    ['VY Jost', 'jost-300.woff2', { weight:'300', style:'normal' }],
    ['VY Jost', 'jost-500.woff2', { weight:'500', style:'normal' }]
  ];
  function policesL(){
    if (POL.promesse) return POL.promesse;
    if (!window.FontFace || !document.fonts){ POL.etat = 'repli'; return (POL.promesse = Promise.resolve(false)); }
    var tout = Promise.all(FACES_L.map(function(f){
      var ff = new FontFace(f[0], 'url("' + BASE_POL + f[1] + '") format("woff2")', f[2]);
      return ff.load().then(function(l){ try { document.fonts.add(l); } catch(e){} return true; });
    }));
    /* au-dela de 6 s, ou si un fichier manque : repli sur les polices du systeme (le texte reste visible) */
    POL.promesse = Promise.race([tout, attendre(6000).then(function(){ throw new Error('delai'); })])
      .then(function(){ POL.etat = 'ok'; return true; }, function(){ POL.etat = 'repli'; return false; });
    return POL.promesse;
  }

  /* ---------- les phrases, en titre de une : les memes besoins que R (memes cles), ecrites en bas de casse */
  var LUXE = {
    peau: {
      hydration:    { fr:['Hydrater.', 'ta peau a soif'], en:['Hydrate.', 'your skin is thirsty'] },
      glow:         { fr:['Plus d’éclat.', 'réveiller ton teint'], en:['More glow.', 'wake up your skin'] },
      redness:      { fr:['Apaiser.', 'ta peau veut du calme'], en:['Soothe.', 'your skin wants calm'] },
      sebum:        { fr:['Réguler.', 'moins de brillance'], en:['Balance.', 'less shine'] },
      pores:        { fr:['Le grain, affiné.', 'affiner le grain de ta peau'], en:['Texture, refined.', 'refine your skin texture'] },
      wrinkles:     { fr:['Lisser.', 'les ridules'], en:['Smooth.', 'fine lines'] },
      pigmentation: { fr:['Unifier.', 'ton teint'], en:['Even out.', 'your skin tone'] },
      firmness:     { fr:['Raffermir.', 'ta peau veut du ressort'], en:['Firm up.', 'your skin wants bounce'] },
      _pos:         { fr:['Garder ce niveau.', 'ta peau va bien'], en:['Keep it up.', 'your skin is doing well'] }
    },
    cheveux: {
      secheresse:     { fr:['Nourrir.', 'tes cheveux ont soif'], en:['Nourish.', 'your hair is thirsty'] },
      casse:          { fr:['Fortifier.', 'moins de casse'], en:['Strengthen.', 'less breakage'] },
      racinesGrasses: { fr:['Équilibrer.', 'des racines plus légères'], en:['Balance.', 'lighter roots'] },
      frizz:          { fr:['Discipliner.', 'moins de frisottis'], en:['Smooth.', 'less frizz'] },
      couleur:        { fr:['Protéger la couleur.', 'tes cheveux colorés'], en:['Protect your colour.', 'coloured hair'] },
      boucles:        { fr:['Définir tes boucles.', 'des boucles à sublimer'], en:['Define your curls.', 'curls to show off'] },
      _pos:           { fr:['Garder l’équilibre.', 'tes cheveux vont bien'], en:['Keep the balance.', 'your hair is doing well'] }
    },
    aliment: {
      saison:    { fr:['Plus de saison.', 'ce mois-ci'], en:['More in season.', 'this month'] },
      surmesure: { fr:['Sur mesure.', 'faite pour toi'], en:['Tailor-made.', 'made for you'] },
      selection: { fr:['Triée pour toi.', 'mon assiette'], en:['Hand-picked.', 'my plate'] }
    }
  };
  function minusL(s){ try { return String(s).toLocaleLowerCase(langue()); } catch(e){ return String(s).toLowerCase(); } }
  function phraseCas(s){ s = minusL(s); return s.charAt(0).toLocaleUpperCase() + s.slice(1); }
  /* la version « luxe » des besoins deja derives par besoinsR (rien n'est recalcule) */
  function luxeL(d){
    var lg = langue() === 'fr' ? 'fr' : 'en', tb = LUXE[d.type] || LUXE.peau, B = d.B, LL = T().l;
    var liste = B.liste.map(function(e, i){
      var t = e.cle && tb[e.cle] ? tb[e.cle][lg] : null;
      var titre = t ? t[0] : phraseCas(String(e.gros).replace(/[\s.…]+$/, '')) + '.';
      var sous = t ? t[1] : (e.constat ? minusL(e.constat) : '');
      /* la preuve : le libelle de la vraie mesure, puis sa valeur telle que R l'ecrit */
      var c = e.ref && typeof e.ref === 'object' ? e.ref : null, pr = { label:'', val:'', note:'', texte:'' };
      var cap = c ? maj(c.label) : '';
      if (c && e.preuve && e.preuve.indexOf(cap) === 0){
        var reste = e.preuve.slice(cap.length).trim(), morceaux = reste.split(' · ');
        pr.label = c.label; pr.val = morceaux[0] || ''; pr.note = morceaux.slice(1).join(' · ');
        if (d.type === 'peau' && i === 0 && !B.positif && num(c.valeur) !== null) pr.note = LL.plusBasse;
      } else pr.texte = e.preuve || '';
      return { cle:e.cle, titre:titre, sous:sous, preuve:pr };
    });
    var cta = LL.cta[d.type] || LL.cta.peau;
    return { liste:liste, cta:cta };
  }
  /* le decoupage du temps (en temps de la mesure, 12 par boucle) */
  function planL(d){
    var n = d.items.length;
    return { rev:4, aut:5.3, prod:n ? 6.5 : 8, cta:n ? 10 : 8, bouc:11.2, n:n, dp:n ? 3.5 / n : 0 };
  }
  function couleursL(d){
    var P = PALETTES[d.palette];
    return { noir:P ? P.noir : [10, 9, 8], ivoire:P ? P.blanc : [244, 238, 226], or:OR_L,
             acc:P ? (lumRel(P.c1) >= .12 ? P.c1 : P.c2) : OR_L, accP:P ? P.c1 : [150, 112, 52] };
  }
  function couleurCss(c, a){ return Array.isArray(c) ? rgba(c, a == null ? 1 : a) : c; }
  /* l'or : un degrade metallique, avec un reflet qui passe (p de -0,2 a 1,2) */
  function orL(x, x0, y0, x1, y1, p, base){
    var B = base || OR_L, g = x.createLinearGradient(x0, y0, x1, y1);
    var fonce = 'rgb(' + Math.round(B[0] * .66) + ',' + Math.round(B[1] * .58) + ',' + Math.round(B[2] * .46) + ')';
    var moy = rgba(B, 1), clair = 'rgb(' + Math.min(255, Math.round(B[0] * 1.2 + 10)) + ',' + Math.min(255, Math.round(B[1] * 1.2 + 14)) + ',' + Math.min(255, Math.round(B[2] * 1.25 + 22)) + ')';
    var st = [[0, fonce], [.28, moy], [.52, clair], [.74, moy], [1, fonce]];
    if (p != null && p > -.25 && p < 1.25){ st = [[0, fonce], [p - .2, moy], [p, '#fff4d6'], [p + .2, moy], [1, fonce]]; }
    var last = -1;
    st.forEach(function(s){ var o = clamp(s[0], 0, 1); if (o < last) o = last; last = o; g.addColorStop(o, s[1]); });
    return g;
  }
  /* un texte espace qui garde le crenage de la police (position de chaque lettre mesuree sur le debut du mot) */
  function traceL(x, txt, cx, y, sp, align){
    txt = String(txt);
    if (!sp){ var ta = x.textAlign; x.textAlign = align || 'center'; x.fillText(txt, cx, y); x.textAlign = ta; return x.measureText(txt).width; }
    var ch = Array.from(txt), pos = [], acc = '';
    for (var i = 0; i < ch.length; i++){ pos.push(x.measureText(acc + ch[i]).width - x.measureText(ch[i]).width + sp * i); acc += ch[i]; }
    var w = x.measureText(txt).width + sp * (ch.length - 1), px = align === 'left' ? cx : align === 'right' ? cx - w : cx - w / 2;
    var ta2 = x.textAlign; x.textAlign = 'left';
    for (var j = 0; j < ch.length; j++) if (ch[j] !== ' ') x.fillText(ch[j], px + pos[j], y);
    x.textAlign = ta2; return w;
  }
  function fontD(size, it, poids){ return (it ? 'italic ' : '') + (poids || 400) + ' ' + size + 'px ' + DIDONE; }
  function fontG(size, it, poids){ return (it ? 'italic ' : '') + (poids || 300) + ' ' + size + 'px ' + GARA; }
  function fontJ(size, poids){ return (poids || 500) + ' ' + size + 'px ' + FINE; }

  Rendu.prototype.debutL = function(){ var x = this.x; this.n++; this.ga = 1; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.textBaseline = 'alphabetic'; x.textAlign = 'center'; };
  Rendu.prototype.tempoL = function(tAbs){ var tm = this.d.tm, t = ((tAbs % tm.D) + tm.D) % tm.D; return t / tm.beat + 1e-6; };
  /* petites capitales fines, tres espacees (Jost) */
  Rendu.prototype.capsL = function(txt, cx, y, size, col, a, o){
    o = o || {}; var x = this.x, s = size, sp = o.sp == null ? .32 : o.sp, maxW = o.maxW || LMW, poids = o.poids || 500, n = 0;
    txt = maj(txt); n = Array.from(txt).length;
    function larg(){ x.font = fontJ(s, poids); return x.measureText(txt).width + sp * s * (n - 1); }
    var sp0 = sp; while (larg() > maxW && sp > sp0 * .35) sp -= .02;
    while (larg() > maxW && s > size * .6) s -= 1;
    x.globalAlpha = (a == null ? 1 : a) * this.ga; x.fillStyle = couleurCss(col);
    var w = traceL(x, txt, cx, y, sp * s, o.align); x.globalAlpha = 1; return w;
  };
  /* Cormorant (romain ou italique), reduit pour tenir */
  Rendu.prototype.garaL = function(txt, cx, y, size, col, a, o){
    o = o || {}; var x = this.x, s = size, maxW = o.maxW || LMW;
    x.font = fontG(s, o.it, o.poids); while (x.measureText(txt).width > maxW && s > size * .55){ s -= 2; x.font = fontG(s, o.it, o.poids); }
    x.globalAlpha = (a == null ? 1 : a) * this.ga; x.fillStyle = couleurCss(col);
    var w = traceL(x, txt, cx, y, (o.sp || 0) * s, o.align); x.globalAlpha = 1; return { w:w, s:s };
  };
  /* Bodoni Moda (Didone), reduit pour tenir */
  Rendu.prototype.didL = function(txt, cx, y, size, col, a, o){
    o = o || {}; var x = this.x, s = size, maxW = o.maxW || LMW, sp = o.sp || 0;
    function larg(){ x.font = fontD(s, o.it, o.poids); return x.measureText(txt).width + sp * s * (Array.from(txt).length - 1); }
    while (larg() > maxW && s > size * .5) s -= 2;
    x.globalAlpha = (a == null ? 1 : a) * this.ga; x.fillStyle = couleurCss(col);
    var w = traceL(x, txt, cx, y, sp * s, o.align); x.globalAlpha = 1; return { w:w, s:s };
  };
  /* un texte en lignes de mots (Cormorant), jusqu'a n lignes */
  Rendu.prototype.lignesL = function(txt, cx, y, size, lh, col, a, o){
    o = o || {}; var x = this.x; x.font = fontG(size, o.it, o.poids);
    var ls = lignes(x, txt, o.maxW || LMW, o.n || 2);
    x.globalAlpha = (a == null ? 1 : a) * this.ga; x.fillStyle = couleurCss(col); x.textAlign = o.align || 'center';
    for (var i = 0; i < ls.length; i++) x.fillText(ls[i], cx, y + i * lh);
    x.textAlign = 'center'; x.globalAlpha = 1; return ls.length;
  };
  /* la phrase en titre : le decoupage (1 a 3 lignes) qui donne les plus grandes lettres, sans jamais deformer */
  Rendu.prototype.uneL = function(txt, maxW, maxH, fmax, o){
    o = o || {}; var x = this.x, cle = txt + '|' + maxW + '|' + maxH + '|' + fmax + '|' + (o.caps ? 1 : 0) + '|' + (o.ital || '') + '|' + (o.nmax || 3) + '|' + (o.sp || 0) + '|' + POL.etat;
    this._uL = this._uL || {}; if (this._uL[cle]) return this._uL[cle];
    var T0 = o.caps ? maj(txt) : String(txt), mots = T0.split(' ').filter(Boolean), nmax = o.nmax || 3, cands = [[mots.join(' ')]], i, j;
    if (nmax >= 2) for (i = 1; i < mots.length; i++) cands.push([mots.slice(0, i).join(' '), mots.slice(i).join(' ')]);
    if (nmax >= 3) for (i = 1; i < mots.length; i++) for (j = i + 1; j < mots.length; j++) cands.push([mots.slice(0, i).join(' '), mots.slice(i, j).join(' '), mots.slice(j).join(' ')]);
    var sp = o.sp || 0, best = null;
    cands.forEach(function(ls){
      var n = ls.length, it = ls.map(function(l, k){ return o.ital === 'tout' ? true : (o.ital === 'fin' && n > 1 && k === n - 1); });
      var f = fmax;
      ls.forEach(function(l, k){ x.font = fontD(100, it[k], o.poids); var w = x.measureText(l).width + sp * 100 * (Array.from(l).length - 1); f = Math.min(f, 100 * maxW / Math.max(1, w)); });
      f = Math.min(f, maxH / (n * (o.lh || 1.02)));
      var sc = f * [0, 1, .9, .76][n];
      if (n > 1 && ls.some(function(l){ return l.replace(/[.,’']/g, '').length <= 2; })) sc *= .72;
      /* une ligne ne finit pas sur un petit mot (« Plus de / saison » devient « Plus / de saison ») */
      if (n > 1 && ls.slice(0, -1).some(function(l){ var m = l.split(' '); return m.length > 1 && m[m.length - 1].replace(/[’']/g, '').length <= 3; })) sc *= .8;
      if (!best || sc > best.sc) best = { ls:ls, it:it, f:f, sc:sc, sp:sp, lh:o.lh || 1.02, poids:o.poids };
    });
    return (this._uL[cle] = best);
  };
  /* la phrase dessinee : le point final prend l'accent ; fill = couleur ou degrade */
  Rendu.prototype.dessineUneL = function(lay, cx, cy, fill, acc, a){
    var x = this.x, f = lay.f, n = lay.ls.length, lh = f * lay.lh, top = cy - n * lh / 2, out = { haut:top, bas:top + n * lh, f:f, larg:0 };
    x.globalAlpha = (a == null ? 1 : a) * this.ga; x.textAlign = 'left';
    for (var i = 0; i < n; i++){
      var ln = lay.ls[i], corps = ln, pt = '', sp = lay.sp * f;
      x.font = fontD(f, lay.it[i], lay.poids);
      if (acc && i === n - 1 && /\.$/.test(ln)){ corps = ln.slice(0, -1); pt = '.'; }
      var wc = x.measureText(corps).width + sp * Math.max(0, Array.from(corps).length - 1), wp = pt ? x.measureText(pt).width + sp : 0;
      var x0 = cx - (wc + wp) / 2, y = top + i * lh + f * .8;
      out.larg = Math.max(out.larg, wc + wp);
      x.fillStyle = couleurCss(fill); traceL(x, corps, x0, y, sp, 'left');
      if (pt){ x.fillStyle = couleurCss(acc); x.fillText('.', x0 + wc + sp, y); }
    }
    x.textAlign = 'center'; x.globalAlpha = 1;
    return out;
  };
  /* la preuve : LIBELLE (capitales fines) + valeur (Didone), et la note en italique */
  Rendu.prototype.preuveL = function(pr, cx, y, col, colV, a, o){
    if (!pr || a <= 0) return; o = o || {}; var x = this.x;
    if (!pr.label){ if (pr.texte) this.capsL(pr.texte, cx, y, o.size || 22, col, .9 * a, { sp:.3 }); return; }
    var sl = o.size || 22, sv = Math.round(sl * 2.6), lab = maj(pr.label), sp = .3 * sl;
    x.font = fontJ(sl, 500); var wl = x.measureText(lab).width + sp * (Array.from(lab).length - 1);
    x.font = fontD(sv, false); var wv = x.measureText(pr.val).width, gap = 26, tot = wl + gap + wv, k = 1;
    if (tot > LMW){ k = LMW / tot; }
    var x0 = cx - tot * k / 2;
    x.save(); x.translate(x0, y); x.scale(k, k);
    x.globalAlpha = .82 * a * this.ga; x.fillStyle = couleurCss(col); x.font = fontJ(sl, 500); traceL(x, lab, 0, -sv * .06, sp, 'left');
    x.globalAlpha = a * this.ga; x.fillStyle = couleurCss(colV || col); x.font = fontD(sv, false); x.textAlign = 'left'; x.fillText(pr.val, wl + gap, 0);
    x.restore(); x.textAlign = 'center'; x.globalAlpha = 1;
    if (pr.note) this.garaL(pr.note, cx, y + (o.noteDy || 54), o.noteSize || 38, col, .85 * a, { it:true });
  };
  /* « Aussi : … » les autres besoins, en une ligne italique */
  Rendu.prototype.aussiL = function(LX2, cx, y, col, colT, a, o){
    o = o || {}; var au = LX2.liste.slice(1, 3); if (!au.length || a <= 0) return;
    var x = this.x, lab = maj(T().l.aussi), s = o.size || 40, txt = au.map(function(e){ return e.titre; }).join('   ');
    x.font = fontJ(20, 500); var sp = 6, wl = x.measureText(lab).width + sp * (lab.length - 1);
    x.font = fontG(s, true); while (x.measureText(txt).width + wl + 30 > LMW && s > 24){ s -= 2; x.font = fontG(s, true); }
    var wt = x.measureText(txt).width, x0 = cx - (wl + 30 + wt) / 2;
    x.globalAlpha = .75 * a * this.ga; x.fillStyle = couleurCss(col); x.font = fontJ(20, 500); traceL(x, lab, x0, y - s * .1, sp, 'left');
    x.globalAlpha = a * this.ga; x.fillStyle = couleurCss(colT || col); x.font = fontG(s, true); x.textAlign = 'left'; x.fillText(txt, x0 + wl + 30, y); x.textAlign = 'center'; x.globalAlpha = 1;
  };
  /* la signature, toujours la : (EXEMPLE ·) VYVRE.FR */
  Rendu.prototype.signeL = function(col, a){
    var x = this.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'source-over';
    var s = (this.d.exemple ? T().exemple + '   ·   ' : '') + this.L.site;
    this.ga = 1; this.capsL(s, LX, L_SIG, 23, col, a == null ? .9 : a, { sp:.36 });
  };
  /* un calque : une scene entiere rendue a part, posee avec une opacite (les fondus d'une scene a l'autre) */
  Rendu.prototype.calqueL = function(fn, a){
    if (a <= .001) return; var x0 = this.x;
    if (a >= .999){ fn.call(this); this.x = x0; return; }
    if (!this._cq){ this._cq = document.createElement('canvas'); this._cq.width = W; this._cq.height = H; }
    var cx = this._cq.getContext('2d'); cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalAlpha = 1; cx.globalCompositeOperation = 'source-over'; cx.textBaseline = 'alphabetic'; cx.textAlign = 'center';
    this.x = cx; var ga = this.ga; this.ga = 1;
    try { fn.call(this); } finally { this.x = x0; this.ga = ga; }
    x0.save(); x0.setTransform(1, 0, 0, 1, 0, 0); x0.globalAlpha = a; x0.globalCompositeOperation = 'source-over'; x0.drawImage(this._cq, 0, 0); x0.restore();
  };
  /* les fonds, calcules une fois par palette */
  Rendu.prototype.fondNoirL = function(K, cy){
    var k = 'n' + K.noir.join(',') + (cy || 0); this._fL = this._fL || {};
    if (!this._fL[k]){
      var b = document.createElement('canvas'); b.width = W; b.height = H; var g = b.getContext('2d'), N = K.noir;
      g.fillStyle = rgba(N, 1); g.fillRect(0, 0, W, H);
      var c2 = [Math.min(255, N[0] + 16), Math.min(255, N[1] + 14), Math.min(255, N[2] + 12)];
      var h1 = g.createRadialGradient(LX, cy || 860, 30, LX, cy || 860, 900); h1.addColorStop(0, rgba(c2, 1)); h1.addColorStop(1, rgba(N, 1));
      g.fillStyle = h1; g.fillRect(0, 0, W, H);
      var v = g.createRadialGradient(W / 2, H / 2, H * .26, W / 2, H / 2, H * .74); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.72)');
      g.fillStyle = v; g.fillRect(0, 0, W, H);
      this._fL[k] = b;
    }
    this.x.drawImage(this._fL[k], 0, 0);
  };
  Rendu.prototype.fondPapierL = function(K){
    var k = 'p' + K.ivoire.join(',') + K.noir.join(','); this._fL = this._fL || {};
    if (!this._fL[k]){
      var b = document.createElement('canvas'); b.width = W; b.height = H; var g = b.getContext('2d'), P = K.ivoire, N = K.noir;
      g.fillStyle = rgba(P, 1); g.fillRect(0, 0, W, H);
      var h1 = g.createRadialGradient(W * .38, H * .3, 40, W * .38, H * .3, 1300); h1.addColorStop(0, 'rgba(255,255,255,.22)'); h1.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = h1; g.fillRect(0, 0, W, H);
      var v = g.createRadialGradient(W / 2, H * .48, H * .3, W / 2, H * .48, H * .8); v.addColorStop(0, rgba(N, 0)); v.addColorStop(1, rgba(N, .16));
      g.fillStyle = v; g.fillRect(0, 0, W, H);
      /* une fibre de papier, tres legere (fixe : elle ne scintille pas) */
      var rnd = 7; function r01(){ rnd = (rnd * 16807) % 2147483647; return rnd / 2147483647; }
      g.globalAlpha = .035; g.fillStyle = rgba(N, 1);
      for (var i = 0; i < 2600; i++){ g.fillRect(r01() * W, r01() * H, 1 + r01() * 2.2, 1); }
      g.globalAlpha = 1;
      this._fL[k] = b;
    }
    this.x.drawImage(this._fL[k], 0, 0);
  };
  /* la lumiere en douche (un cone doux venu d'en haut) et sa flaque au sol */
  Rendu.prototype.doucheL = function(cx, sol, a, larg){
    if (a <= 0) return; var x = this.x;
    if (!this._dch){
      var c = document.createElement('canvas'); c.width = 900; c.height = 1300; var g = c.getContext('2d');
      for (var i = 0; i < 34; i++){ var k = .3 + i * .036, tw = 120 * k, bw = 720 * k;
        var gr = g.createLinearGradient(0, 0, 0, 1300); gr.addColorStop(0, 'rgba(255,246,228,.036)'); gr.addColorStop(.55, 'rgba(255,246,228,.015)'); gr.addColorStop(1, 'rgba(255,246,228,.004)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(450 - tw / 2, 0); g.lineTo(450 + tw / 2, 0); g.lineTo(450 + bw / 2, 1300); g.lineTo(450 - bw / 2, 1300); g.closePath(); g.fill(); }
      this._dch = c;
      var p = document.createElement('canvas'); p.width = 900; p.height = 200; var pg = p.getContext('2d');
      pg.translate(450, 100); pg.scale(1, .17); var rg = pg.createRadialGradient(0, 0, 0, 0, 0, 440); rg.addColorStop(0, 'rgba(255,244,222,.5)'); rg.addColorStop(.5, 'rgba(255,244,222,.14)'); rg.addColorStop(1, 'rgba(255,244,222,0)');
      pg.fillStyle = rg; pg.fillRect(-450, -600, 900, 1200); this._sol = p;
    }
    var s = larg || 1;
    x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = a * this.ga;
    x.drawImage(this._dch, cx - 450 * s, sol - 1300, 900 * s, 1300);
    x.globalAlpha = a * .9 * this.ga; x.drawImage(this._sol, cx - 450 * s, sol - 100, 900 * s, 200);
    x.restore();
  };
  /* la poussiere dans la lumiere : periodique sur la boucle (meme place au debut et a la fin) */
  Rendu.prototype.poussiereL = function(q, cx, haut, bas, larg, a){
    if (a <= 0) return; var x = this.x; x.save(); x.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 26; i++){
      var r1 = hash(i, 41), r2 = hash(i, 43), r3 = hash(i, 47), k = 1 + (i % 2);
      var y = haut + ((((r2 + q / 12 * k) % 1) + 1) % 1) * (bas - haut), xx = cx + (r1 - .5) * larg * (.4 + .6 * (y - haut) / (bas - haut)) + Math.sin(2 * Math.PI * (q / 12 * 2 + r3)) * 14;
      var tw = .5 + .5 * Math.sin(2 * Math.PI * (q / 12 * (3 + i % 3) + r1)), sz = 4 + r3 * 9;
      x.globalAlpha = a * .5 * tw * this.ga; x.drawImage(this.point, xx - sz / 2, y - sz / 2, sz, sz);
    }
    x.restore();
  };
  /* un soin en vitrine : la photo detouree, posee sur sa ligne de sol, avec son reflet (calcule une fois) */
  Rendu.prototype.vitrineL = function(k, mode){
    var key = k + '|' + mode; this._vit = this._vit || {}; if (key in this._vit) return this._vit[key];
    var im = this.imgs[k], src = im ? (im.brut || im) : null, it = this.d.items[k] || {}, out = null;
    if (src){
      var S = 600, c = document.createElement('canvas'); c.width = S; c.height = Math.round(S * 1.55); var g = c.getContext('2d');
      var sx = 0, sy = 0, iw = src.naturalWidth || src.width, ih = src.naturalHeight || src.height;
      if (!im.brut && im.boite){ sx = im.boite.x; sy = im.boite.y; iw = im.boite.w; ih = im.boite.h; }
      var fond = !!it.fond, r = Math.min(S * (fond ? .74 : .9) / iw, S * (fond ? .8 : .94) / ih), w = iw * r, h = ih * r, x0 = (S - w) / 2, y0 = S - h - (fond ? 28 : 4);
      function pose(gg){
        if (fond){ var p = 22, rx = x0 - p, ry = y0 - p, rw = w + 2 * p, rh = h + 2 * p; gg.fillStyle = '#f4f0e8'; rond(gg, rx, ry, rw, rh, 18); gg.fill(); }
        gg.drawImage(src, sx, sy, iw, ih, x0, y0, w, h);
      }
      pose(g);
      g.save(); g.translate(0, 2 * S); g.scale(1, -1); g.globalAlpha = mode === 'papier' ? 0 : .34; pose(g); g.restore();
      g.globalCompositeOperation = 'destination-out';
      var gr = g.createLinearGradient(0, S, 0, S + h * .5); gr.addColorStop(0, 'rgba(0,0,0,.15)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
      g.fillStyle = gr; g.fillRect(0, S, S, c.height - S); g.globalCompositeOperation = 'source-over';
      c.S = S; c.boite = { x:x0, y:y0, w:w, h:h };
      out = c;
    }
    return (this._vit[key] = out);
  };
  /* pose le soin k : base au sol (cx, sol), hauteur de boite « taille » */
  Rendu.prototype.soinL = function(k, cx, sol, taille, a, mode, col){
    if (a <= 0) return; var x = this.x, v = this.vitrineL(k, mode);
    if (v){ var s = taille / v.S; x.globalAlpha = a * this.ga; x.drawImage(v, cx - v.S * s / 2, sol - v.S * s, v.S * s, v.height * s); x.globalAlpha = 1; return; }
    /* pas d'image : un ecrin vide au trait fin, avec son numero */
    x.globalAlpha = a * .7 * this.ga; x.strokeStyle = couleurCss(col); x.lineWidth = 1.5;
    x.beginPath(); x.arc(cx, sol - taille * .42, taille * .2, 0, Math.PI * 2); x.stroke(); x.globalAlpha = 1;
    this.didL(['I', 'II', 'III', 'IV'][k] || '', cx, sol - taille * .42 + 22, 64, col, .8 * a, { it:true });
  };
  /* la legende d'un soin : chiffre romain et etape, nom, marque */
  Rendu.prototype.legendeL = function(k, cx, y, col, colN, a, o){
    if (a <= 0) return; o = o || {}; var x = this.x, it = this.d.items[k], rom = ['I', 'II', 'III', 'IV'][k] || String(k + 1);
    var et = it.etape ? phraseCas(it.etape) : '', s1 = o.s1 || 60, s2 = o.s2 || 52;
    x.font = fontD(s1, true); var wr = x.measureText(rom + '.').width;
    x.font = fontG(42, true); var we = et ? x.measureText(et).width : 0, gap = et ? 22 : 0, x0 = cx - (wr + gap + we) / 2;
    if (wr + gap + we > LMW){ x0 = cx - LMW / 2; }
    x.globalAlpha = a * this.ga; x.textAlign = 'left';
    x.fillStyle = couleurCss(colN || col); x.font = fontD(s1, true); x.fillText(rom + '.', x0, y);
    if (et){ x.fillStyle = couleurCss(col); x.font = fontG(42, true); var maxE = LMW - wr - gap, ee = et; while (x.measureText(ee).width > maxE && ee.length > 2) ee = ee.slice(0, -2) + '…'; x.fillText(ee, x0 + wr + gap, y); }
    x.textAlign = 'center'; x.globalAlpha = 1;
    var nl = this.lignesL(it.nom, cx, y + (o.dy1 || 72), s2, s2 * 1.08, col, a, { n:2 });
    if (it.marque) this.capsL(it.marque, cx, y + (o.dy1 || 72) + nl * s2 * 1.08 + 4, 21, col, .78 * a, { sp:.34 });
  };
  /* une transition de soin a soin : un fondu enchaine (alpha) et une avancee lente (u) */
  function fenetreL(q, PL, k){
    var s = PL.prod + k * PL.dp, e = s + PL.dp, a = k === 0 ? 1 : seg(q, s - .12, s + .22), b = k === PL.n - 1 ? 0 : seg(q, e - .12, e + .22);
    /* la legende ne se superpose jamais a la suivante : elle sort avant que l'autre entre */
    var la = k === 0 ? 1 : seg(q, s + .1, s + .36), lb = k === PL.n - 1 ? 0 : seg(q, e - .2, e - .02);
    return { a:a * (1 - b), u:clamp((q - s) / PL.dp, 0, 1.3), leg:la * (1 - lb) };
  }

  /* ---------- L1 · LA UNE (86 BPM) : une couverture de magazine sur papier ivoire qui se compose ;
     le titre de une = le besoin. Puis les pages interieures (les soins), puis la une « Et toi ? ». */
  Rendu.prototype.uneTxtL1 = function(){
    var d = this.d, L = T().l, n = d.B.lignes.length, lg = langue() === 'fr' ? 'fr' : 'en';
    if (d.type === 'aliment'){ var rv = d.chiffres.filter(function(c){ return (c.cle === 'revue' || /revue|review/i.test(c.label)) && num(c.valeur) !== null; })[0];
      if (rv) return [valTxt(rv) + ' ' + L.aliments, L.uneAssiette]; return null; }
    n = d.B.lignes.filter(function(r){ return r.ref !== 'rep'; }).length; if (!n) return null;
    return [n + ' ' + (d.type === 'cheveux' ? (n > 1 ? L.lectures : L.lecture) : (n > 1 ? L.mesures : L.mesure)) + ',', L.unePriorite];
  };
  Rendu.prototype.couvL1 = function(q, K, etat){
    /* etat : 'suspense' | 'titre' | 'cta' ; q dans la boucle */
    var x = this.x, d = this.d, L = T().l, LXd = d.LX, PL = d.PL, encre = K.noir, acc = K.accP;
    this.fondPapierL(K);
    /* la lumiere qui glisse sur la couverture (hors champ au debut et a la fin de la boucle) */
    var lp = lerp(-.35, 1.35, q / 12), gx = lp * W;
    x.save(); x.globalCompositeOperation = 'soft-light'; x.translate(gx, H / 2); x.rotate(-.42);
    var gl = x.createLinearGradient(-360, 0, 360, 0); gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(.5, 'rgba(255,255,255,.55)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gl; x.fillRect(-360, -H, 720, H * 2); x.restore();
    /* le travelling lent vers la une, coupe net a la revelation */
    var z = etat === 'suspense' ? 1 + .04 * eInOut(clamp(q / PL.rev, 0, 1)) : 1;
    x.save(); x.translate(LX, 900); x.scale(z, z); x.translate(-LX, -900);
    /* le titre du magazine */
    var ms = this.didL('VYVRE', LX, 498, 248, encre, 1, { poids:600, sp:.035, maxW:770 });
    /* la ligne d'edition, entre deux filets */
    x.fillStyle = rgba(encre, .85); x.fillRect(130, 540, 780, 2); x.fillRect(130, 600, 780, 1);
    this.capsL(L.edition[d.type] + '   ·   ' + this.date, LX, 579, 21, encre, .9, { sp:.36 });
    var aCta = etat === 'cta' ? 1 - eInOut(seg(q, PL.bouc, 11.62)) : 0;
    /* les filets qui encadrent la une */
    var fl = etat === 'suspense' ? eInOut(seg(q, 1.5, 2.6)) : etat === 'titre' ? 1 : aCta;
    if (fl > 0){ var lw = 780 * fl; x.fillStyle = rgba(acc, .95 * (etat === 'cta' ? aCta : 1)); x.fillRect(LX - lw / 2, 680, lw, 2); x.fillRect(LX - lw / 2, 1124, lw, 2);
      if (fl > .9){ x.save(); x.translate(LX, 681); x.rotate(Math.PI / 4); x.fillStyle = rgba(K.ivoire, 1); x.fillRect(-11, -11, 22, 22); x.strokeStyle = rgba(acc, .95); x.lineWidth = 2; x.strokeRect(-8, -8, 16, 16); x.restore(); } }
    if (etat === 'suspense'){
      /* l'accroche en italique, mot par mot */
      var hk = L.hook[d.type], mots = hk.split(' '), cut = Math.ceil(mots.length / 2), l1 = mots.slice(0, cut).join(' '), l2 = mots.slice(cut).join(' ') + '…';
      var aH = 1 - seg(q, 3.05, 3.7);
      var a1 = aH, a2 = aH;
      if (a1 > 0) this.garaL(l1, LX, 872 - (1 - a1) * 14, 118, encre, a1, { it:true, maxW:760 });
      if (a2 > 0) this.garaL(l2, LX, 1000 - (1 - a2) * 14, 118, encre, a2, { it:true, maxW:760 });
      /* la ligne de couverture, a gauche */
      var ul = this.uneTxtL1();
      if (ul){ var c1 = eOut3(seg(q, .9, 1.6)), c2 = eOut3(seg(q, 1.2, 1.9)), c3 = eOut3(seg(q, 1.45, 2.15));
        this.capsL(L.enCouv, 130, 1230, 20, acc, c1, { sp:.32, align:'left' });
        this.didL(ul[0], 130, 1306, 62, encre, c2, { align:'left', maxW:640 });
        this.garaL(ul[1], 130, 1366, 58, encre, c3, { it:true, align:'left', maxW:640 }); }
    } else if (etat === 'titre'){
      var LXt = d.LX.liste[0], lay = this.uneL(LXt.titre, 780, 400, 250, { ital:'fin' });
      var e = seg(q, PL.rev, PL.rev + .5), k = 1 + .025 * (1 - eOut3(e));
      x.save(); x.translate(LX, 902); x.scale(k, k); x.translate(-LX, -902);
      this.dessineUneL(lay, LX, 902, encre, acc, 1);
      x.restore();
      var ps = eOut3(seg(q, PL.rev + .3, PL.rev + .8)), pp = eOut3(seg(q, PL.rev + .6, PL.rev + 1.1)), pa = eOut3(seg(q, PL.aut, PL.aut + .5));
      if (LXt.sous) this.garaL(LXt.sous, LX, 1196 - (1 - ps) * 10, 50, encre, ps, { it:true });
      this.preuveL(LXt.preuve, LX, 1290 - (1 - pp) * 10, encre, encre, pp, { noteDy:46, noteSize:34, size:21 });
      if (LXt.preuve.note && LXt.preuve.label){ /* la note de la preuve passe sous la ligne */ }
      this.aussiL(d.LX, LX, 1402, acc, encre, pa, { size:40 });
    } else {
      /* la fin de boucle : l'accroche revient, exactement comme a la premiere image */
      var hk2 = L.hook[d.type].split(' '), ct2 = Math.ceil(hk2.length / 2), aT = eInOut(seg(q, 11.6, 12));
      if (aT > 0){ this.garaL(hk2.slice(0, ct2).join(' '), LX, 872, 118, encre, aT, { it:true, maxW:760 }); this.garaL(hk2.slice(ct2).join(' ') + '…', LX, 1000, 118, encre, aT, { it:true, maxW:760 }); }
      var cta = d.LX.cta, ec = eOut3(seg(q, PL.cta + .35, PL.cta + .9)) * aCta, ec2 = eOut3(seg(q, PL.cta + .5, PL.cta + 1.05)) * aCta;
      this.garaL(cta[0], LX, 846, 112, encre, ec, { it:true });
      var lc = this.uneL(cta[1], 760, 260, 132, { nmax:2 });
      this.dessineUneL(lc, LX, 1000, encre, null, ec2);
      this.capsL(this.L.site, LX, 1268, 34, acc, ec2, { sp:.34 });
    }
    x.restore();
  };
  Rendu.prototype.pageL1 = function(q, K){
    var x = this.x, d = this.d, L = T().l, PL = d.PL, encre = K.noir, acc = K.accP, n = PL.n;
    this.fondPapierL(K);
    this.didL('VYVRE', LX, 352, 66, encre, 1, { poids:600, sp:.05 });
    x.fillStyle = rgba(encre, .8); x.fillRect(130, 378, 780, 1);
    var k = clamp(Math.floor((q - PL.prod) / PL.dp), 0, n - 1);
    this.capsL(L.soins[d.type] + '   ·   ' + ['I', 'II', 'III', 'IV'][k] + ' / ' + ['I', 'II', 'III', 'IV'][n - 1], LX, 416, 20, encre, .85, { sp:.36 });
    for (var i = 0; i < n; i++){
      var f = fenetreL(q, PL, i); if (f.a <= 0) continue;
      var u = eOut3(clamp(f.u, 0, 1)), sz = 660 * (.965 + .035 * u), sol = 1092 - (1 - u) * 12;
      /* l'ombre de contact sur le papier */
      x.save(); x.globalAlpha = f.a * .5; x.translate(LX, sol + 2); x.scale(1, .12); var og = x.createRadialGradient(0, 0, 0, 0, 0, 230); og.addColorStop(0, rgba(encre, .55)); og.addColorStop(1, rgba(encre, 0)); x.fillStyle = og; x.fillRect(-240, -240, 480, 480); x.restore();
      this.soinL(i, LX, sol, sz, f.a, 'papier', encre);
      this.legendeL(i, LX, 1186, encre, acc, f.leg);
    }
  };
  Rendu.prototype.dessineL1 = function(tAbs){
    this.debutL(); var x = this.x, d = this.d, K = couleursL(d), q = this.tempoL(tAbs), PL = d.PL;
    if (POL.etat === 'attente'){ this.fondPapierL(K); return; }
    var self = this;
    if (q < PL.rev) this.couvL1(q, K, 'suspense');
    else if (q < PL.prod) this.couvL1(q, K, 'titre');
    else if (PL.n && q < PL.cta){
      /* la page tourne : la une glisse vers la gauche, la page des soins arrive */
      var e = eInOut(seg(q, PL.prod, PL.prod + .62));
      if (e < 1){ x.save(); x.translate(-W * .62 * e, 0); this.couvL1(q, K, 'titre'); x.restore(); }
      x.save(); x.translate(W * (1 - e), 0); this.pageL1(q, K);
      if (e < 1){ var sg = x.createLinearGradient(-60, 0, 0, 0); sg.addColorStop(0, rgba(K.noir, 0)); sg.addColorStop(1, rgba(K.noir, .14)); x.fillStyle = sg; x.fillRect(-60, 0, 60, H); }
      x.restore();
    } else {
      var e2 = PL.n ? eInOut(seg(q, PL.cta, PL.cta + .62)) : 1;
      if (e2 < 1){ x.save(); x.translate(-W * .62 * e2, 0); this.pageL1(Math.min(q, PL.cta - .001), K); x.restore(); }
      x.save(); x.translate(W * (1 - e2), 0); this.couvL1(q, K, 'cta');
      if (e2 < 1){ var sg2 = x.createLinearGradient(-60, 0, 0, 0); sg2.addColorStop(0, rgba(K.noir, 0)); sg2.addColorStop(1, rgba(K.noir, .14)); x.fillStyle = sg2; x.fillRect(-60, 0, 60, H); }
      x.restore();
    }
    this.grain();
    this.signeL(K.noir, .85);
  };

  /* ---------- L2 · LE FLACON (82 BPM) : un flacon en lumiere sculptee ; une goutte d'or tombe au
     ralenti ; elle touche le sol-miroir sur le temps fort : la phrase, en or, avec son reflet. */
  var FL_X = 452, FL_SOL = 1250, GO_X = 728;   /* le flacon un peu a gauche, la goutte tombe a sa droite (devant le sol) */
  Rendu.prototype.flaconStatL = function(K){
    var k = K.noir.join(','); if (this._flc && this._flck === k) return this._flc;
    var Wc = 420, Hc = 790 + 520, c = document.createElement('canvas'); c.width = Wc; c.height = Hc; var g = c.getContext('2d');
    var ox = Wc / 2, oy = 790;   /* le pied du flacon dans le calque */
    function corps(gg){ rond(gg, ox - 165, oy - 540, 330, 540, 34); }
    function dessin(gg, reflet){
      /* le verre : sombre au centre, eclaire sur les bords (lumiere de contour) */
      corps(gg); var gv = gg.createLinearGradient(ox - 165, 0, ox + 165, 0);
      gv.addColorStop(0, 'rgba(255,248,235,.30)'); gv.addColorStop(.06, 'rgba(255,248,235,.08)'); gv.addColorStop(.2, 'rgba(18,16,14,.86)');
      gv.addColorStop(.8, 'rgba(18,16,14,.86)'); gv.addColorStop(.94, 'rgba(255,248,235,.05)'); gv.addColorStop(1, 'rgba(255,248,235,.16)');
      gg.fillStyle = gv; gg.fill();
      /* le jus, dore */
      gg.save(); rond(gg, ox - 138, oy - 430, 276, 372, 14); gg.clip();
      var gj = gg.createLinearGradient(0, oy - 430, 0, oy - 58); gj.addColorStop(0, 'rgba(232,196,120,.62)'); gj.addColorStop(.5, 'rgba(178,128,52,.62)'); gj.addColorStop(1, 'rgba(112,72,26,.72)');
      gg.fillStyle = gj; gg.fillRect(ox - 140, oy - 432, 280, 376);
      var gs = gg.createLinearGradient(ox - 140, 0, ox + 140, 0); gs.addColorStop(0, 'rgba(0,0,0,.5)'); gs.addColorStop(.3, 'rgba(0,0,0,0)'); gs.addColorStop(.7, 'rgba(0,0,0,0)'); gs.addColorStop(1, 'rgba(0,0,0,.55)');
      gg.fillStyle = gs; gg.fillRect(ox - 140, oy - 432, 280, 376);
      gg.restore();
      gg.fillStyle = 'rgba(255,236,190,.7)'; gg.fillRect(ox - 132, oy - 431, 264, 2);
      /* le fond epais du verre */
      gg.fillStyle = 'rgba(255,226,160,.32)'; gg.fillRect(ox - 150, oy - 58, 300, 3);
      gg.fillStyle = 'rgba(255,248,235,.18)'; gg.fillRect(ox - 160, oy - 6, 320, 2);
      /* le contour */
      corps(gg); gg.lineWidth = 2; var gc = gg.createLinearGradient(ox - 165, 0, ox + 165, 0); gc.addColorStop(0, 'rgba(255,248,235,.62)'); gc.addColorStop(.5, 'rgba(255,248,235,.12)'); gc.addColorStop(1, 'rgba(255,248,235,.32)');
      gg.strokeStyle = gc; gg.stroke();
      /* le col et la bague */
      gg.fillStyle = 'rgba(30,27,24,.95)'; gg.fillRect(ox - 50, oy - 592, 100, 54);
      gg.fillStyle = 'rgba(255,248,235,.2)'; gg.fillRect(ox - 50, oy - 592, 3, 54); gg.fillRect(ox + 47, oy - 592, 2, 54);
      gg.fillStyle = orL(gg, ox - 62, 0, ox + 62, 0, null); gg.fillRect(ox - 62, oy - 604, 124, 14);
      /* le bouchon dore, cannele */
      gg.fillStyle = orL(gg, ox - 80, 0, ox + 80, 0, .3); rond(gg, ox - 80, oy - 782, 160, 180, 6); gg.fill();
      for (var i = 0; i < 13; i++){ gg.fillStyle = i % 2 ? 'rgba(60,40,12,.22)' : 'rgba(255,240,200,.12)'; gg.fillRect(ox - 72 + i * 11.5, oy - 770, 2, 156); }
      gg.fillStyle = 'rgba(255,244,214,.55)'; gg.fillRect(ox - 78, oy - 781, 156, 2);
      gg.fillStyle = 'rgba(40,26,8,.5)'; gg.fillRect(ox - 80, oy - 604, 160, 3);
      /* la gravure : VYVRE, sur le verre */
      if (!reflet){ gg.fillStyle = 'rgba(250,242,228,.72)'; gg.font = fontJ(30, 500); traceL(gg, 'VYVRE', ox, oy - 250, 30 * .55); gg.fillRect(ox - 30, oy - 222, 60, 1); }
    }
    dessin(g, false);
    /* le reflet dans le sol-miroir */
    g.save(); g.translate(0, 2 * oy); g.scale(1, -1); g.globalAlpha = .26; dessin(g, true); g.restore();
    g.globalCompositeOperation = 'destination-out';
    var gr = g.createLinearGradient(0, oy, 0, oy + 420); gr.addColorStop(0, 'rgba(0,0,0,.2)'); gr.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = gr; g.fillRect(0, oy, Wc, Hc - oy); g.globalCompositeOperation = 'source-over';
    c.ox = ox; c.oy = oy; this._flc = c; this._flck = k; return c;
  };
  Rendu.prototype.flaconL = function(q, K, lum, spec){
    var x = this.x, c = this.flaconStatL(K), s = 1;
    x.globalAlpha = (.62 + .38 * lum) * this.ga; x.drawImage(c, FL_X - c.ox, FL_SOL - c.oy); x.globalAlpha = 1;
    /* la lumiere qui glisse sur le verre */
    x.save(); rond(x, FL_X - 165, FL_SOL - 540, 330, 540, 34); x.clip(); x.globalCompositeOperation = 'lighter';
    var sx = FL_X - 165 + spec * 330, gs = x.createLinearGradient(sx - 40, 0, sx + 40, 0);
    gs.addColorStop(0, 'rgba(255,248,232,0)'); gs.addColorStop(.5, 'rgba(255,248,232,' + (.3 * lum) + ')'); gs.addColorStop(1, 'rgba(255,248,232,0)');
    x.globalAlpha = this.ga; x.fillStyle = gs; x.fillRect(sx - 40, FL_SOL - 540, 80, 540);
    x.fillStyle = 'rgba(255,248,232,' + (.22 * lum) + ')'; x.fillRect(sx + 52, FL_SOL - 520, 4, 500);
    x.restore();
    /* et sur le bouchon */
    x.save(); x.beginPath(); x.rect(FL_X - 80, FL_SOL - 782, 160, 180); x.clip(); x.globalCompositeOperation = 'lighter';
    var cx2 = FL_X - 80 + spec * 160, gc = x.createLinearGradient(cx2 - 30, 0, cx2 + 30, 0); gc.addColorStop(0, 'rgba(255,240,200,0)'); gc.addColorStop(.5, 'rgba(255,240,200,' + (.4 * lum) + ')'); gc.addColorStop(1, 'rgba(255,240,200,0)');
    x.globalAlpha = this.ga; x.fillStyle = gc; x.fillRect(cx2 - 30, FL_SOL - 782, 60, 180); x.restore();
  };
  /* la goutte d'or, en forme de larme, etiree par la vitesse */
  Rendu.prototype.goutteL = function(cx, cy, r, etire, a){
    if (a <= 0) return; var x = this.x;
    x.save(); x.globalAlpha = a * this.ga; x.globalCompositeOperation = 'lighter'; x.drawImage(this.point, cx - r * 4, cy - r * 4, r * 8, r * 8); x.globalCompositeOperation = 'source-over';
    x.translate(cx, cy); x.beginPath(); x.moveTo(0, -r * (2.6 + etire)); x.bezierCurveTo(r * .35, -r * 1.4, r, -r * .55, r, 0); x.arc(0, 0, r, 0, Math.PI); x.bezierCurveTo(-r, -r * .55, -r * .35, -r * 1.4, 0, -r * (2.6 + etire)); x.closePath();
    var g = x.createRadialGradient(-r * .35, -r * .4, 0, 0, 0, r * 1.6); g.addColorStop(0, '#fff2cc'); g.addColorStop(.35, '#e2b866'); g.addColorStop(1, '#6e4a18');
    x.fillStyle = g; x.fill(); x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.ellipse(-r * .35, -r * .35, r * .18, r * .28, -.4, 0, Math.PI * 2); x.fill();
    x.restore();
  };
  Rendu.prototype.ondesL = function(cx, cy, e, a){
    if (a <= 0 || e <= 0) return; var x = this.x;
    for (var i = 0; i < 3; i++){ var u = clamp(e - i * .16, 0, 1); if (u <= 0) continue;
      var rx = 30 + 640 * eOut3(u); x.globalAlpha = a * (1 - u) * .7 * this.ga; x.strokeStyle = orL(x, cx - rx, cy, cx + rx, cy, null); x.lineWidth = 2.5 * (1 - u) + .8;
      x.beginPath(); x.ellipse(cx, cy, rx, rx * .1, 0, 0, Math.PI * 2); x.stroke(); }
    x.globalAlpha = 1;
  };
  Rendu.prototype.solL = function(y, a){ var x = this.x, g = x.createLinearGradient(110, 0, 930, 0); g.addColorStop(0, 'rgba(255,246,228,0)'); g.addColorStop(.5, 'rgba(255,246,228,' + (.2 * a) + ')'); g.addColorStop(1, 'rgba(255,246,228,0)'); x.globalAlpha = this.ga; x.fillStyle = g; x.fillRect(110, y, 820, 1.5); x.globalAlpha = 1; };
  /* la phrase en or et son reflet (le reflet est calcule une fois par phrase) */
  Rendu.prototype.phraseOrL = function(lay, cx, cy, sol, p, K, a){
    var x = this.x, key = lay.ls.join('|') + lay.f + '|' + sol + '|' + cy;
    if (!this._rfl || this._rflk !== key){
      var c = document.createElement('canvas'); c.width = W; c.height = 560; var g = c.getContext('2d'), x0 = this.x;
      this.x = g; g.translate(0, -sol); var ga = this.ga; this.ga = 1;
      g.save(); g.translate(0, 2 * sol); g.scale(1, -1);
      var hh = lay.f * lay.lh * lay.ls.length; this.dessineUneL(lay, cx, cy, orL(g, cx - 400, cy - hh / 2, cx + 400, cy + hh / 2, null), K.acc, .3);
      g.restore(); this.x = x0; this.ga = ga;
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'destination-out';
      var gr = g.createLinearGradient(0, 0, 0, 300); gr.addColorStop(0, 'rgba(0,0,0,.1)'); gr.addColorStop(1, 'rgba(0,0,0,1)'); g.fillStyle = gr; g.fillRect(0, 0, W, 560);
      this._rfl = c; this._rflk = key;
    }
    x.globalAlpha = a * this.ga; x.drawImage(this._rfl, 0, sol); x.globalAlpha = 1;
    var hh2 = lay.f * lay.lh * lay.ls.length;
    return this.dessineUneL(lay, cx, cy, orL(x, cx - 400, cy - hh2 / 2, cx + 400, cy + hh2 / 2, p), K.acc, a);
  };
  Rendu.prototype.sceneFlaconL = function(q, K, lumF){
    /* l'image d'ouverture et du suspense : le flacon en lumiere sculptee, la goutte qui tombe */
    var x = this.x, d = this.d, L = T().l, PL = d.PL;
    this.fondNoirL(K, 980);
    var lum = lumF == null ? .25 + .75 * eInOut(clamp(q / 3.2, 0, 1)) : lumF;
    this.doucheL(FL_X + 60, FL_SOL, .55 * lum + .12, 1.15);
    this.poussiereL(q, FL_X, 300, FL_SOL, 520, .5 + .5 * lum);
    this.solL(FL_SOL, .6 + .4 * lum);
    var z = 1 + .05 * eInOut(clamp(q / PL.rev, 0, 1)) * (lumF == null ? 1 : 0);
    x.save(); x.translate(FL_X, 1000); x.scale(z, z); x.translate(-FL_X, -1000);
    this.flaconL(q, K, lum, lumF == null ? lerp(.08, .9, eInOut(clamp(q / 4, 0, 1))) : .08);
    /* la goutte : elle apparait au temps 1,9 et touche le sol au temps 4 */
    if (lumF == null){
      var gd = seg(q, 1.9, PL.rev), yy = lerp(150, FL_SOL + 46, Math.pow(gd, 1.7)), vit = gd > 0 ? 1.7 * Math.pow(gd, .7) : 0;
      if (gd > 0 && gd < 1){ this.goutteL(GO_X, yy, 22, vit * 1.4, eOut3(seg(q, 1.9, 2.3)));
        var dr = FL_SOL + 46 - yy; if (dr < 360){ x.save(); x.translate(0, 2 * (FL_SOL + 46)); x.scale(1, -1); this.goutteL(GO_X, yy, 22, vit * 1.4, .28 * (1 - dr / 360)); x.restore(); } }
    }
    x.restore();
    /* l'accroche */
    var aH = lumF == null ? 1 - seg(q, 3.2, 3.8) : 1;
    this.capsL(L.edition[d.type] + '   ·   ' + this.date, LX, 330, 20, K.or, .85 * aH, { sp:.38 });
    this.garaL(L.hook[d.type] + '…', LX, 408, 64, K.ivoire, .95 * aH, { it:true });
  };
  Rendu.prototype.dessineL2 = function(tAbs){
    this.debutL(); var x = this.x, d = this.d, K = couleursL(d), q = this.tempoL(tAbs), PL = d.PL, L = T().l, LXd = d.LX;
    if (POL.etat === 'attente'){ this.aplat(K.noir); return; }
    if (q < PL.rev){ this.sceneFlaconL(q, K); }
    else if (q < PL.cta){
      this.fondNoirL(K, 900);
      var e1 = LXd.liste[0], lay = this.uneL(e1.titre, 780, 380, 240, { ital:'fin' }), SOL2 = 1112;
      var aP = PL.n ? 1 - eInOut(seg(q, PL.prod - .2, PL.prod + .4)) : 1;
      if (aP > 0){
        this.ga = 1;
        var hal = x.createRadialGradient(LX, 900, 0, LX, 900, 640); hal.addColorStop(0, 'rgba(205,172,110,' + (.12 * aP) + ')'); hal.addColorStop(1, 'rgba(205,172,110,0)'); x.fillStyle = hal; x.fillRect(0, 200, W, 1400);
        this.solL(SOL2, aP);
        this.ondesL(LX, SOL2 + 6, seg(q, PL.rev, PL.rev + 2.2), aP);
        var ps = eOut3(seg(q, PL.rev + .25, PL.rev + .8)), pp = eOut3(seg(q, PL.rev + .6, PL.rev + 1.1)), pa = eOut3(seg(q, PL.aut, PL.aut + .5));
        if (e1.sous) this.garaL(e1.sous, LX, 650 - (1 - ps) * 10, 52, K.ivoire, .9 * ps * aP, { it:true });
        this.phraseOrL(lay, LX, 896, SOL2, lerp(-.25, 1.25, seg(q, PL.rev + .1, PL.rev + 1.9)), K, aP);
        this.preuveL(e1.preuve, LX, 1300 - (1 - pp) * 10, K.ivoire, K.or, pp * aP, { size:21, noteDy:52, noteSize:36 });
        this.aussiL(LXd, LX, 1420, K.or, K.ivoire, pa * aP, { size:38 });
      }
      if (PL.n && q >= PL.prod - .2){
        var aS = eInOut(seg(q, PL.prod - .1, PL.prod + .5)), SOLP = 1140;
        this.ga = aS;
        this.doucheL(LX, SOLP, .7, 1); this.poussiereL(q, LX, 300, SOLP, 520, .8); this.solL(SOLP, 1);
        var nI = PL.n, k0 = clamp(Math.floor((q - PL.prod) / PL.dp), 0, nI - 1);
        this.capsL(L.soins[d.type], LX, 352, 21, K.or, .9, { sp:.4 });
        this.didL(['I', 'II', 'III', 'IV'][k0] + '  /  ' + ['I', 'II', 'III', 'IV'][nI - 1], LX, 410, 40, K.ivoire, .8, { it:true });
        for (var i = 0; i < nI; i++){
          var f = fenetreL(q, PL, i); if (f.a <= 0) continue; var u = eOut3(clamp(f.u, 0, 1));
          this.soinL(i, LX, SOLP, 560 * (.96 + .04 * u), f.a, 'noir', K.ivoire);
          this.legendeL(i, LX, 1232, K.ivoire, K.or, f.leg, { s2:48 });
        }
        this.ga = 1;
      }
    } else {
      var aB = eInOut(seg(q, 11.55, 12)), aX = 1 - eInOut(seg(q, PL.bouc, 11.6));
      var self = this;
      this.calqueL(function(){
        var x2 = this.x; this.fondNoirL(K, 900);
        var ec = eOut3(seg(q, PL.cta + .1, PL.cta + .6)) * aX, ec2 = eOut3(seg(q, PL.cta + .3, PL.cta + .8)) * aX;
        this.doucheL(LX, 1150, .35, 1.2); this.solL(1150, 1);
        this.garaL(d.LX.cta[0], LX, 790, 112, K.ivoire, ec, { it:true });
        var lc = this.uneL(d.LX.cta[1], 760, 260, 132, { nmax:2 });
        this.dessineUneL(lc, LX, 960, orL(x2, LX - 380, 860, LX + 380, 1060, lerp(-.2, 1.2, seg(q, PL.cta + .3, PL.bouc))), null, ec2);
        this.capsL(this.L.site, LX, 1250, 34, K.or, ec2, { sp:.36 });
      }, 1);
      this.calqueL(function(){ this.sceneFlaconL(0, K); }, aB);
    }
    this.grain();
    this.signeL(K.ivoire, .8);
  };

  /* ---------- L3 · LE DEFILE (88 BPM) : un podium dans le noir ; tes vraies mesures passent comme des
     looks ; une silhouette de lumiere s'avance : le dernier passage, c'est la phrase. */
  var VPX = 520, VPY = 610, KP = 1080;
  function ySol(dd){ return VPY + KP / dd; }
  Rendu.prototype.podiumL = function(q, K, allume, aLooks){
    var x = this.x, i;
    this.fondNoirL(K, 700);
    /* la scene : le passage du fond (la porte des coulisses), en lumiere */
    var por = .55 + .45 * allume;
    x.save(); x.globalCompositeOperation = 'lighter';
    x.globalAlpha = .5 * por * this.ga; x.drawImage(this.point, VPX - 170, VPY - 230, 340, 300);
    var gp = x.createLinearGradient(0, VPY - 190, 0, VPY + 4); gp.addColorStop(0, 'rgba(255,246,228,0)'); gp.addColorStop(1, 'rgba(255,246,228,' + (.55 * por) + ')');
    x.globalAlpha = this.ga; x.fillStyle = gp; x.fillRect(VPX - 26, VPY - 190, 52, 194);
    x.restore();
    /* le podium, laque noire, en perspective */
    var dF = 40, dN = .5;
    x.globalAlpha = this.ga; x.fillStyle = 'rgba(255,248,236,.035)';
    x.beginPath(); x.moveTo(VPX - 430 / dF, ySol(dF)); x.lineTo(VPX + 430 / dF, ySol(dF)); x.lineTo(VPX + 430 / dN, ySol(dN)); x.lineTo(VPX - 430 / dN, ySol(dN)); x.closePath(); x.fill();
    /* le reflet de la porte sur la laque */
    var gr = x.createLinearGradient(0, VPY, 0, H); gr.addColorStop(0, 'rgba(255,246,228,' + (.2 * por) + ')'); gr.addColorStop(1, 'rgba(255,246,228,0)');
    x.save(); x.globalCompositeOperation = 'lighter'; x.fillStyle = gr;
    for (var lr = 0; lr < 10; lr++){ var kk = .4 + lr * .16; x.globalAlpha = .16 * this.ga; x.beginPath(); x.moveTo(VPX - 14 * kk, VPY); x.lineTo(VPX + 14 * kk, VPY); x.lineTo(VPX + 120 * kk, H); x.lineTo(VPX - 120 * kk, H); x.closePath(); x.fill(); }
    x.restore();
    /* les bords du podium */
    x.strokeStyle = 'rgba(255,246,228,.22)'; x.lineWidth = 1.5;
    x.beginPath(); x.moveTo(VPX - 430 / dF, ySol(dF)); x.lineTo(VPX - 430 / dN, ySol(dN)); x.moveTo(VPX + 430 / dF, ySol(dF)); x.lineTo(VPX + 430 / dN, ySol(dN)); x.stroke();
    /* les lumieres de podium, qui s'allument du fond vers nous */
    x.save(); x.globalCompositeOperation = 'lighter';
    for (i = 0; i < 11; i++){
      var dd = 1.12 * Math.pow(1.36, i), on = allume >= 1 ? 1 : clamp((allume * 11 - (10 - i)) / 1.2, 0, 1), sz = 70 / dd + 8;
      var lum = .18 + .82 * on;
      [-1, 1].forEach(function(sg){ var px = VPX + sg * 452 / dd, py = ySol(dd);
        x.globalAlpha = lum * .9 * this.ga; x.drawImage(this.point, px - sz, py - sz * .55, sz * 2, sz * 1.1);
        x.globalAlpha = lum * .3 * this.ga; x.drawImage(this.point, px - sz * 2.4, py - sz * 1.3, sz * 4.8, sz * 2.6); }, this);
    }
    /* les faisceaux d'en haut */
    [[2.1, .9], [3.6, .6], [6.4, .4]].forEach(function(f, j){ var dd = f[0], on = clamp(allume * 3 - (2 - j), 0, 1); if (on <= 0) return;
      var y = ySol(dd), hw = 300 / dd, g = x.createLinearGradient(0, 0, 0, y); g.addColorStop(0, 'rgba(255,246,228,0)'); g.addColorStop(1, 'rgba(255,246,228,' + (.07 * on * f[1]) + ')');
      x.globalAlpha = this.ga; x.fillStyle = g; x.beginPath(); x.moveTo(VPX - hw * .12, 0); x.lineTo(VPX + hw * .12, 0); x.lineTo(VPX + hw, y); x.lineTo(VPX - hw, y); x.closePath(); x.fill();
      x.globalAlpha = on * .5 * f[1] * this.ga; x.drawImage(this._sol || this.point, VPX - hw * 1.3, y - hw * .2, hw * 2.6, hw * .4); }, this);
    /* le public, flou, de chaque cote */
    for (i = 0; i < 26; i++){ var r1 = hash(i, 61), r2 = hash(i, 67), sd = i % 2 ? 1 : -1, px2 = VPX + sd * (380 + r1 * 260), py2 = 760 + r2 * 520, s2 = 14 + r1 * 22;
      x.globalAlpha = (.05 + .05 * r2) * this.ga; x.drawImage(this.point, px2 - s2, py2 - s2, s2 * 2, s2 * 2); }
    x.restore(); x.globalAlpha = 1;
  };
  /* un look qui avance sur le podium : sa mesure (libelle, valeur) et sa flaque de lumiere */
  Rendu.prototype.lookL = function(rw, num0, dd, a, K){
    if (a <= 0) return; var x = this.x, y = ySol(dd), s = 2.3 / dd;
    x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = a * .7 * this.ga; x.drawImage(this._sol || this.point, VPX - 300 * s, y - 40 * s, 600 * s, 80 * s); x.restore();
    x.save(); x.translate(VPX, y - 250 * s); x.scale(s, s);
    var ga = this.ga; this.ga = ga * a;
    this.capsL(T().l.look + ' ' + (num0 < 10 ? '0' : '') + num0, 0, -96, 22, K.or, .9, { sp:.4 });
    var lb = phraseCas(rw.label); this.garaL(lb, 0, -14, 64, K.ivoire, 1, { it:true, maxW:620 });
    if (rw.v === null) this.garaL(phraseCas(rw.txt), 0, 80, 70, K.or, 1, { maxW:620 }); else this.didL(rw.txt.replace(/\s+/g, ' '), 0, 84, 74, K.or, 1, { maxW:620 });
    this.ga = ga; x.restore();
  };
  /* la silhouette de lumiere : une colonne de lumiere qui marche (un leger balancement a chaque pas) */
  Rendu.prototype.silhouetteL = function(dd, a, q){
    if (a <= 0) return; var x = this.x, y = ySol(dd), s = 1.9 / dd, sw = Math.sin(q * Math.PI) * 6 * s;
    x.save(); x.globalCompositeOperation = 'lighter';
    x.globalAlpha = a * .7 * this.ga; x.drawImage(this._sol || this.point, VPX - 260 * s, y - 34 * s, 520 * s, 68 * s);
    var hgt = 640 * s, wd = 92 * s;
    for (var i = 0; i < 4; i++){ var k = 1 + i * .55; x.globalAlpha = a * (.42 / k) * this.ga; x.drawImage(this.point, VPX - wd * k + sw, y - hgt - wd * (k - 1) * .5, wd * 2 * k, hgt + wd * (k - 1)); }
    x.globalAlpha = a * .9 * this.ga; var gc = x.createLinearGradient(0, y - hgt, 0, y); gc.addColorStop(0, 'rgba(255,250,238,0)'); gc.addColorStop(.18, 'rgba(255,250,238,.9)'); gc.addColorStop(.85, 'rgba(255,250,238,.65)'); gc.addColorStop(1, 'rgba(255,250,238,0)');
    x.fillStyle = gc; x.beginPath(); x.ellipse(VPX + sw, y - hgt / 2, wd * .2, hgt / 2, 0, 0, Math.PI * 2); x.fill();
    /* son reflet dans la laque */
    x.globalAlpha = a * .18 * this.ga; x.drawImage(this.point, VPX - wd + sw, y, wd * 2, hgt * .5);
    x.restore();
  };
  Rendu.prototype.sceneDefileL = function(q, K, repos){
    var x = this.x, d = this.d, L = T().l, PL = d.PL, B = d.B;
    this.podiumL(q, K, repos ? 0 : eInOut(clamp(q / 3.6, 0, 1)));
    if (!repos){
      /* les looks : tes vraies mesures, de la meilleure vers la plus basse ; la plus basse passe en dernier, en lumiere */
      var rows = B.lignes.map(function(r, i){ return { r:r, i:i }; }).filter(function(o){ return o.i !== B.cible; });
      rows.sort(function(a, b){ return (b.r.v === null ? -1 : b.r.v) - (a.r.v === null ? -1 : a.r.v); }); rows = rows.slice(0, 3);
      for (var j = rows.length - 1; j >= 0; j--){
        var s0 = .1 + j * .72, u = seg(q, s0, s0 + 1.1); if (u <= 0 || u >= 1) continue;
        this.lookL(rows[j].r, j + 1, lerp(6.5, 1.75, eInOut(u)), eOut3(seg(u, 0, .22)) * (1 - seg(u, .66, .94)), K);
      }
      var us = seg(q, 2.25, PL.rev);
      if (us > 0) this.silhouetteL(lerp(14, 1.55, Math.pow(us, 1.15)), eOut3(seg(us, 0, .2)), q);
    }
    var aH = repos ? 1 : 1 - seg(q, 2.6, 3.3);
    this.capsL(L.defile + '   ·   ' + T().types[d.type] + '   ·   ' + this.date, LX, 330, 20, K.or, .88 * aH, { sp:.38 });
    this.garaL(L.hook[d.type] + '…', LX, 404, 62, K.ivoire, .95 * aH, { it:true });
  };
  Rendu.prototype.dessineL3 = function(tAbs){
    this.debutL(); var x = this.x, d = this.d, K = couleursL(d), q = this.tempoL(tAbs), PL = d.PL, L = T().l, LXd = d.LX;
    if (POL.etat === 'attente'){ this.aplat(K.noir); return; }
    if (q < PL.rev) this.sceneDefileL(q, K, false);
    else if (q < PL.cta){
      var aP = PL.n ? 1 - eInOut(seg(q, PL.prod - .25, PL.prod + .3)) : 1;
      this.podiumL(q, K, 1);
      if (aP > 0){
        /* le voile sombre qui porte la phrase */
        var vg = x.createRadialGradient(LX, 900, 100, LX, 900, 760); vg.addColorStop(0, rgba(K.noir, .78 * aP)); vg.addColorStop(1, rgba(K.noir, .35 * aP)); x.fillStyle = vg; x.fillRect(0, 0, W, H);
        var e1 = LXd.liste[0], lay = this.uneL(e1.titre, 790, 360, 190, { caps:true, sp:.06, nmax:3, lh:1.08 });
        var e = seg(q, PL.rev, PL.rev + .55), k = 1.035 - .035 * eOut3(e);
        var ps = eOut3(seg(q, PL.rev + .3, PL.rev + .8)), pp = eOut3(seg(q, PL.rev + .6, PL.rev + 1.1)), pa = eOut3(seg(q, PL.aut, PL.aut + .5));
        this.capsL(L.dernier, LX, 640, 22, K.or, aP * eOut3(seg(q, PL.rev, PL.rev + .4)), { sp:.5 });
        x.save(); x.translate(LX, 890); x.scale(k, k); x.translate(-LX, -890);
        var r = this.dessineUneL(lay, LX, 890, K.ivoire, K.acc, aP); x.restore();
        if (e1.sous) this.garaL(e1.sous, LX, 1150 - (1 - ps) * 10, 50, K.ivoire, .9 * ps * aP, { it:true });
        this.preuveL(e1.preuve, LX, 1250 - (1 - pp) * 10, K.ivoire, K.or, pp * aP, { size:21, noteDy:50, noteSize:36 });
        this.aussiL(LXd, LX, 1396, K.or, K.ivoire, pa * aP, { size:38 });
        /* le seul flash : doux, sur le temps fort */
        var fl = seg(q, PL.rev, PL.rev + .22); if (fl < 1){ x.globalAlpha = .26 * (1 - fl) * (1 - fl); x.fillStyle = rgba(K.ivoire, 1); x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
      }
      if (PL.n && q >= PL.prod - .25){
        var aS = eInOut(seg(q, PL.prod - .15, PL.prod + .4)); this.ga = aS;
        this.capsL(L.soins[d.type], LX, 352, 21, K.or, .9, { sp:.4 });
        for (var i = PL.n - 1; i >= 0; i--){
          var f = fenetreL(q, PL, i); if (f.a <= 0) continue;
          var u = eOut3(clamp(f.u / .75, 0, 1)), dd = lerp(3.3, 1.72, u), sz = 560 * 1.72 / dd * .92;
          var y = ySol(dd);
          x.save(); x.globalCompositeOperation = 'lighter'; x.globalAlpha = f.a * .8 * this.ga; x.drawImage(this._sol || this.point, LX - 330 * 1.72 / dd, y - 40, 660 * 1.72 / dd, 80); x.restore();
          this.soinL(i, LX, y, sz, f.a, 'noir', K.ivoire);
          this.legendeL(i, LX, 1306, K.ivoire, K.or, f.leg, { s1:54, s2:44, dy1:60 });
        }
        this.ga = 1;
      }
    } else {
      var aB = eInOut(seg(q, 11.55, 12)), aX = 1 - eInOut(seg(q, PL.bouc, 11.6));
      this.calqueL(function(){
        var x2 = this.x; this.podiumL(q, K, 1 - .6 * seg(q, PL.cta, PL.bouc));
        var vg2 = x2.createRadialGradient(LX, 900, 100, LX, 900, 760); vg2.addColorStop(0, rgba(K.noir, .75)); vg2.addColorStop(1, rgba(K.noir, .3)); x2.fillStyle = vg2; x2.fillRect(0, 0, W, H);
        var ec = eOut3(seg(q, PL.cta + .1, PL.cta + .6)) * aX, ec2 = eOut3(seg(q, PL.cta + .3, PL.cta + .8)) * aX;
        this.garaL(d.LX.cta[0], LX, 800, 112, K.ivoire, ec, { it:true });
        var lc = this.uneL(d.LX.cta[1], 760, 260, 132, { nmax:2 });
        this.dessineUneL(lc, LX, 970, K.ivoire, null, ec2);
        this.capsL(this.L.site, LX, 1250, 34, K.or, ec2, { sp:.36 });
      }, 1);
      this.calqueL(function(){ this.sceneDefileL(0, K, true); }, aB);
    }
    this.grain();
    this.signeL(K.ivoire, .8);
  };

  /* ---------- L4 · LE MONOGRAMME (84 BPM) : un monogramme VYVRE grave a froid ; l'or le trace trait
     par trait, la lumiere accroche la feuille d'or ; le sceau s'ouvre en deux sur la phrase. */
  var MO_Y = 860, MO_HX = 280, MO_HY = 380;
  function losangeL(x, s){ x.beginPath(); x.moveTo(LX, MO_Y - MO_HY * s); x.lineTo(LX + MO_HX * s, MO_Y); x.lineTo(LX, MO_Y + MO_HY * s); x.lineTo(LX - MO_HX * s, MO_Y); x.closePath(); }
  var MO_LET = [['V', -62, 72], ['Y', 64, 116]];
  Rendu.prototype.monoL = function(K, mode, p, q){
    /* mode : 'relief' (gaufrage a froid) | 'trace' (le trait d'or qui avance, p = [p1..p4]) | 'or' (la feuille d'or, p = reflet) */
    var x = this.x, f = 330;
    x.save(); x.textAlign = 'center'; x.font = fontD(f, false);
    if (mode === 'relief'){
      var N = K.noir, hi = 'rgba(255,248,236,.11)', lo = 'rgba(0,0,0,.65)', base = rgba([Math.min(255, N[0] + 15), Math.min(255, N[1] + 13), Math.min(255, N[2] + 11)], 1);
      [[-1.5, -1.5, hi], [1.5, 1.5, lo]].forEach(function(o){ x.lineWidth = 3; x.strokeStyle = o[2]; x.save(); x.translate(o[0], o[1]);
        losangeL(x, 1); x.stroke(); losangeL(x, .9); x.stroke(); x.fillStyle = o[2]; MO_LET.forEach(function(l){ x.fillText(l[0], LX + l[1], MO_Y + l[2]); }); x.restore(); });
      x.fillStyle = base; MO_LET.forEach(function(l){ x.fillText(l[0], LX + l[1], MO_Y + l[2]); });
      x.strokeStyle = base; x.lineWidth = 3; losangeL(x, 1); x.stroke(); losangeL(x, .9); x.stroke();
    } else if (mode === 'trace'){
      var gl = orL(x, LX - 300, MO_Y - 380, LX + 300, MO_Y + 380, null), per = 4 * Math.sqrt(MO_HX * MO_HX + MO_HY * MO_HY);
      x.strokeStyle = gl; x.lineCap = 'round';
      [[1, p[0], 2.6], [.9, p[1], 1.6]].forEach(function(o){ if (o[1] <= 0) return; x.lineWidth = o[2]; x.setLineDash([per * o[0] * o[1], per * 2]); x.lineDashOffset = 0; losangeL(x, o[0]); x.stroke(); });
      MO_LET.forEach(function(l, i){ var pp = p[2 + i]; if (pp <= 0) return; x.lineWidth = 2.2; x.setLineDash([2600 * pp, 5000]); x.strokeText(l[0], LX + l[1], MO_Y + l[2]); });
      x.setLineDash([]);
    } else {
      var g2 = orL(x, LX - 320, MO_Y - 400, LX + 320, MO_Y + 400, p);
      x.fillStyle = g2; MO_LET.forEach(function(l){ x.fillText(l[0], LX + l[1], MO_Y + l[2]); });
      x.strokeStyle = g2; x.lineWidth = 3; losangeL(x, 1); x.stroke(); x.lineWidth = 1.6; losangeL(x, .9); x.stroke();
      /* les quatre pointes, un grain d'or */
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(function(v){ x.save(); x.translate(LX + v[0] * MO_HX, MO_Y + v[1] * MO_HY); x.rotate(Math.PI / 4); x.fillStyle = g2; x.fillRect(-7, -7, 14, 14); x.restore(); });
    }
    x.restore();
  };
  /* la pointe du trait : un point de lumiere qui court sur le losange */
  function pointeL(s, p){ var pts = [[0, -1], [1, 0], [0, 1], [-1, 0], [0, -1]], u = clamp(p, 0, 1) * 4, i = Math.min(3, Math.floor(u)), f = u - i;
    return [LX + lerp(pts[i][0], pts[i + 1][0], f) * MO_HX * s, MO_Y + lerp(pts[i][1], pts[i + 1][1], f) * MO_HY * s]; }
  Rendu.prototype.sceneMonoL = function(q, K, repos){
    var x = this.x, d = this.d, L = T().l, PL = d.PL;
    this.fondNoirL(K, MO_Y);
    var sp = x.createRadialGradient(LX, MO_Y, 0, LX, MO_Y, 620); sp.addColorStop(0, 'rgba(255,240,214,' + (.06 + (repos ? 0 : .06 * seg(q, 2.4, 3.4))) + ')'); sp.addColorStop(1, 'rgba(255,240,214,0)');
    x.globalAlpha = this.ga; x.fillStyle = sp; x.fillRect(0, 200, W, 1500); x.globalAlpha = 1;
    var z = repos ? 1 : 1 + .05 * eIn3(seg(q, 2.9, PL.rev));
    x.save(); x.translate(LX, MO_Y); x.scale(z, z); x.translate(-LX, -MO_Y);
    this.monoL(K, 'relief');
    if (!repos){
      var p = [seg(q, .15, 1.05), seg(q, .65, 1.4), seg(q, 1.15, 2.05), seg(q, 1.65, 2.55)], aOr = eInOut(seg(q, 2.45, 3.2));
      if (aOr < 1) this.monoL(K, 'trace', p);
      if (p[0] > 0 && p[0] < 1){ var pt = pointeL(1, p[0]); x.save(); x.globalCompositeOperation = 'lighter'; x.drawImage(this.point, pt[0] - 26, pt[1] - 26, 52, 52); x.restore(); }
      if (p[1] > 0 && p[1] < 1){ var pt2 = pointeL(.9, p[1]); x.save(); x.globalCompositeOperation = 'lighter'; x.drawImage(this.point, pt2[0] - 18, pt2[1] - 18, 36, 36); x.restore(); }
      if (aOr > 0){ x.globalAlpha = aOr; this.monoL(K, 'or', lerp(-.25, 1.25, seg(q, 2.6, 3.9))); x.globalAlpha = 1; }
      /* la fente de lumiere au milieu, juste avant l'ouverture */
      var fe = eIn3(seg(q, 3.35, PL.rev));
      if (fe > 0){ x.save(); x.globalCompositeOperation = 'lighter'; var hh = MO_HY * 1.08 * fe; var gf = x.createLinearGradient(0, MO_Y - hh, 0, MO_Y + hh); gf.addColorStop(0, 'rgba(255,246,226,0)'); gf.addColorStop(.5, 'rgba(255,246,226,.95)'); gf.addColorStop(1, 'rgba(255,246,226,0)');
        x.fillStyle = gf; x.fillRect(LX - 1.5, MO_Y - hh, 3, hh * 2); x.globalAlpha = .5 * fe; x.drawImage(this.point, LX - 40, MO_Y - hh, 80, hh * 2); x.restore(); }
    }
    x.restore();
    var aH = repos ? 1 : 1 - seg(q, 3.1, 3.7);
    this.garaL(L.hook[d.type] + '…', LX, 372, 62, K.ivoire, .95 * aH, { it:true });
    this.capsL('VYVRE', LX, 1338, 28, K.or, .9 * aH, { sp:.62 });
    this.capsL(L.edition[d.type] + '   ·   ' + this.date, LX, 1390, 18, K.ivoire, .6 * aH, { sp:.38 });
  };
  /* les feuilles d'or qui tombent apres l'ouverture */
  Rendu.prototype.feuillesL = function(q, q0, a){
    var x = this.x, e = q - q0; if (e <= 0 || e > 3 || a <= 0) return;
    for (var i = 0; i < 18; i++){
      var r1 = hash(i, 71), r2 = hash(i, 73), r3 = hash(i, 79), an = -Math.PI / 2 + (r1 - .5) * 2.6, v = 260 + r2 * 520;
      var px = LX + Math.cos(an) * v * eOut3(clamp(e / 1.2, 0, 1)) + Math.sin(e * 2 + i) * 16, py = MO_Y + Math.sin(an) * v * .5 * eOut3(clamp(e / 1.2, 0, 1)) + e * e * 70 * (.5 + r3);
      var sz = 10 + r3 * 18, rot = e * (1.5 + r1 * 3) + i, fl = Math.cos(e * (3 + r2 * 4) + i);
      x.save(); x.globalAlpha = a * (1 - clamp((e - 1.6) / 1.4, 0, 1)) * this.ga; x.translate(px, py); x.rotate(rot); x.scale(1, Math.abs(fl) * .9 + .1);
      x.fillStyle = orL(x, -sz, -sz, sz, sz, fl * .6 + .5); x.beginPath(); x.moveTo(-sz, -sz * .3); x.lineTo(sz * .6, -sz * .6); x.lineTo(sz, sz * .4); x.lineTo(-sz * .4, sz * .6); x.closePath(); x.fill(); x.restore();
    }
  };
  Rendu.prototype.dessineL4 = function(tAbs){
    this.debutL(); var x = this.x, d = this.d, K = couleursL(d), q = this.tempoL(tAbs), PL = d.PL, L = T().l, LXd = d.LX;
    if (POL.etat === 'attente'){ this.aplat(K.noir); return; }
    if (q < PL.rev) this.sceneMonoL(q, K, false);
    else if (q < PL.cta){
      this.fondNoirL(K, MO_Y);
      var aP = PL.n ? 1 - eInOut(seg(q, PL.prod - .25, PL.prod + .3)) : 1;
      if (aP > 0){
        var e1 = LXd.liste[0], lay = this.uneL(e1.titre, 780, 400, 240, { ital:'fin' });
        var ps = eOut3(seg(q, PL.rev + .4, PL.rev + .9)), pp = eOut3(seg(q, PL.rev + .7, PL.rev + 1.2)), pa = eOut3(seg(q, PL.aut, PL.aut + .5));
        var hal = x.createRadialGradient(LX, MO_Y, 0, LX, MO_Y, 700); hal.addColorStop(0, 'rgba(255,236,200,' + (.1 * aP) + ')'); hal.addColorStop(1, 'rgba(255,236,200,0)'); x.fillStyle = hal; x.fillRect(0, 200, W, 1400);
        this.dessineUneL(lay, LX, MO_Y + 10, K.ivoire, K.acc, aP);
        x.fillStyle = orL(x, LX - 200, 0, LX + 200, 0, null); x.globalAlpha = aP * ps; x.fillRect(LX - 70 * ps, 1150, 140 * ps, 2); x.globalAlpha = 1;
        if (e1.sous) this.garaL(e1.sous, LX, 1222 - (1 - ps) * 10, 50, K.ivoire, .9 * ps * aP, { it:true });
        this.preuveL(e1.preuve, LX, 1316 - (1 - pp) * 10, K.ivoire, K.or, pp * aP, { size:21, noteDy:50, noteSize:36 });
        this.aussiL(LXd, LX, 1440, K.or, K.ivoire, pa * aP, { size:36 });
        /* le sceau qui s'ouvre en deux, la lumiere dans la fente, les feuilles d'or */
        var eo = eOutExpo(seg(q, PL.rev, PL.rev + .7)), ao = 1 - eInOut(seg(q, PL.rev + .05, PL.rev + .6));
        if (ao > 0){
          [-1, 1].forEach(function(sg){ x.save(); x.beginPath(); if (sg < 0) x.rect(0, 0, LX, H); else x.rect(LX, 0, W - LX, H); x.clip();
            x.translate(sg * 640 * eo, 0); x.globalAlpha = ao; this.monoL(K, 'relief'); this.monoL(K, 'or', null); x.restore(); }, this);
          x.save(); x.globalCompositeOperation = 'lighter'; var lw2 = 60 + 1100 * eo; x.globalAlpha = .55 * ao;
          x.drawImage(this.point, LX - lw2 / 2, MO_Y - 640, lw2, 1280); x.restore();
        }
        this.feuillesL(q, PL.rev, aP);
        /* le seul flash, doux et chaud */
        var fl = seg(q, PL.rev, PL.rev + .25); if (fl < 1){ x.globalAlpha = .22 * (1 - fl) * (1 - fl); x.fillStyle = 'rgb(255,242,218)'; x.fillRect(0, 0, W, H); x.globalAlpha = 1; }
      }
      if (PL.n && q >= PL.prod - .25){
        var aS = eInOut(seg(q, PL.prod - .15, PL.prod + .4)); this.ga = aS;
        /* la niche en arche, au filet d'or */
        var AR = 250, AY = 640, BOT = 1170;
        x.save(); x.beginPath(); x.moveTo(LX - AR, BOT); x.lineTo(LX - AR, AY); x.arc(LX, AY, AR, Math.PI, 0); x.lineTo(LX + AR, BOT); x.closePath();
        var gn = x.createLinearGradient(0, AY - AR, 0, BOT); gn.addColorStop(0, 'rgba(255,244,224,.07)'); gn.addColorStop(1, 'rgba(255,244,224,.02)');
        x.globalAlpha = aS; x.fillStyle = gn; x.fill(); x.strokeStyle = orL(x, LX - AR, 0, LX + AR, 0, null); x.lineWidth = 2; x.stroke(); x.clip();
        this.doucheL(LX, BOT, .75, .75); this.poussiereL(q, LX, AY - AR, BOT, 380, .7);
        x.restore();
        x.globalAlpha = aS; x.fillStyle = orL(x, LX - AR - 40, 0, LX + AR + 40, 0, null); x.fillRect(LX - AR - 40, BOT, 2 * AR + 80, 2); x.globalAlpha = 1;
        this.capsL(L.soins[d.type], LX, 330, 21, K.or, .9, { sp:.4 });
        for (var i = 0; i < PL.n; i++){
          var f = fenetreL(q, PL, i); if (f.a <= 0) continue; var u = eOut3(clamp(f.u, 0, 1));
          this.soinL(i, LX, BOT - 6, 470 * (.96 + .04 * u), f.a, 'noir', K.ivoire);
          this.legendeL(i, LX, 1262, K.ivoire, K.or, f.leg, { s2:46, dy1:64 });
        }
        this.ga = 1;
      }
    } else {
      var aB = eInOut(seg(q, 11.55, 12)), aX = 1 - eInOut(seg(q, PL.bouc, 11.6));
      this.calqueL(function(){
        var x2 = this.x; this.fondNoirL(K, MO_Y);
        var ec = eOut3(seg(q, PL.cta + .1, PL.cta + .6)) * aX, ec2 = eOut3(seg(q, PL.cta + .3, PL.cta + .8)) * aX;
        this.garaL(d.LX.cta[0], LX, 790, 112, K.ivoire, ec, { it:true });
        var lc = this.uneL(d.LX.cta[1], 760, 260, 132, { nmax:2 });
        this.dessineUneL(lc, LX, 960, K.ivoire, null, ec2);
        x2.fillStyle = orL(x2, LX - 200, 0, LX + 200, 0, null); x2.globalAlpha = ec2; x2.fillRect(LX - 70, 1150, 140, 2); x2.globalAlpha = 1;
        this.capsL(this.L.site, LX, 1250, 34, K.or, ec2, { sp:.36 });
      }, 1);
      this.calqueL(function(){ this.sceneMonoL(0, K, true); }, aB);
    }
    this.grain();
    this.signeL(K.ivoire, .8);
  };

  /* ===================================================================
     X1 a X4 (07/10, nuit) : la vraie 3D. La scene vit dans vy-wrap-x.js (module ES charge a la
     demande, three.js local) ; elle dessine dans ce meme canvas 2D (le rendu WebGL, a resolution
     interne reduite, puis le texte net par-dessus) : l'enregistrement et le partage ne changent pas.
     =================================================================== */
  var BASE_WRAP = (function(){ try { var s = document.currentScript && document.currentScript.src; if (s) return new URL('./', s).href; } catch(e){} return '/wrap/'; })();
  var MODX = null, VER_X = '2';   /* 07/10 (soir) : les aliments en clair */
  function chargeX(){
    if (MODX) return MODX;
    MODX = new Promise(function(res, rej){
      if (window.__VYWX) return res(window.__VYWX);
      var s = document.createElement('script'), fini = false; s.type = 'module'; s.src = BASE_WRAP + 'vy-wrap-x.js?v=' + VER_X;
      function sortie(ok){ if (fini) return; fini = true; if (ok && window.__VYWX) res(window.__VYWX); else { MODX = null; rej(new Error('module X indisponible')); } }
      s.onload = function(){ sortie(true); }; s.onerror = function(){ sortie(false); };
      setTimeout(function(){ sortie(!!window.__VYWX); }, 12000);
      document.head.appendChild(s);
    });
    return MODX;
  }
  /* si le module ne se charge pas du tout : un style 2D de la meme famille (le Wrap sort quand meme) */
  var REPLI_X = { X1:'L4', X2:'R3', X3:'L2', X4:'R1' };
  function preparerX(R, d, donnees, apercu){
    return chargeX().then(function(M){ return M.creer(R, d, { apercu:!!apercu, V:OUTILS_X }); }).then(function(sc){ R.X = sc; return sc; });
  }
  Rendu.prototype.dessineX = function(tAbs){
    if (this.X){ var t0 = performance.now(); this.X.dessine(tAbs); this.X.ms = (this.X.ms || []); this.X.ts = (this.X.ts || []); this.X.ms.push(performance.now() - t0); this.X.ts.push(t0); if (this.X.ms.length > 240){ this.X.ms.shift(); this.X.ts.shift(); } return; }
    var x = this.x; x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.fillStyle = this.d.type === 'aliment' ? '#fafafa' : '#060606'; x.fillRect(0, 0, W, H);
  };
  Rendu.prototype.dessineX1 = Rendu.prototype.dessineX2 = Rendu.prototype.dessineX3 = Rendu.prototype.dessineX4 = function(tAbs){ return this.dessineX(tAbs); };
  Rendu.prototype.liberer = function(){ if (this.X && this.X.liberer){ try { this.X.liberer(); } catch(e){} } this.X = null; };
  /* les outils partages avec le module */
  var OUTILS_X = null;

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
  var GAIN_BUS = { D3:.5, R1:.68, R2:.71, R3:.73, R4:.4, L1:2.3, L2:2.35, L3:2.2, L4:1.65, X1:1.15, X2:1, X3:1.45, X4:1 };   /* X : mesure le 07/10 (nuit) au niveau de D4, R1 et L2 (±1,5 dB), ffmpeg ebur128 */   /* 07/10 : L mesuree au niveau moyen de R (±1,5 dB) */
  function Son(ctx, d){
    this.ctx = ctx; this.th = d.theme; this.style = d.style || 'D'; this.d = d; this.tm = d.tm || temps(this.style);
    var out = ctx.createGain(); out.gain.value = 1.2;
    var comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.knee.value = 12; comp.ratio.value = 3.2; comp.attack.value = .004; comp.release.value = .25;
    var bus = ctx.createGain(); bus.gain.value = GAIN_BUS[this.style] || .9;   /* 06/10 : D3 mesuree 4 a 6 dB plus forte que les autres ; 07/10 : R1 a R4 alignees sur D1-D4 */
    bus.connect(comp); comp.connect(out);
    this.ecoute = ctx.createGain(); this.ecoute.gain.value = 1;
    /* 07/10 : R1 a R4 ont un limiteur en sortie (le BIM empile grosse caisse, impact et basse : pas de saturation) */
    var sortie = out;
    if (/^[RLX]/.test(this.style)){ var lim = ctx.createDynamicsCompressor(); lim.threshold.value = -2.5; lim.knee.value = 0; lim.ratio.value = 20; lim.attack.value = .001; lim.release.value = .12; out.connect(lim); sortie = lim; }
    sortie.connect(this.ecoute); this.ecoute.connect(ctx.destination);
    this.dest = null; try { this.dest = ctx.createMediaStreamDestination(); sortie.connect(this.dest); } catch(e){}
    /* reverberation synthetisee (pas de fichier d'impulsion) */
    var len = Math.floor(ctx.sampleRate * 2.6), ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (var ch = 0; ch < 2; ch++){ var dd = ir.getChannelData(ch); for (var i = 0; i < len; i++) dd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    var conv = ctx.createConvolver(); conv.buffer = ir;
    var rv = ctx.createGain(); rv.gain.value = .55; conv.connect(rv); rv.connect(bus);
    this.rev = conv; this.bus = bus; this.out = out;
    /* 07/10 : la serie L a en plus une reverberation longue (4,2 s), plus sombre, pour la timbale et les cordes */
    if (/^[LX]/.test(this.style)){
      var l2 = Math.floor(ctx.sampleRate * 4.2), ir2 = ctx.createBuffer(2, l2, ctx.sampleRate), att2 = ctx.sampleRate * .015;
      for (var c2 = 0; c2 < 2; c2++){ var d2 = ir2.getChannelData(c2); for (var j2 = 0; j2 < l2; j2++) d2[j2] = (Math.random() * 2 - 1) * Math.pow(1 - j2 / l2, 2.6) * (j2 < att2 ? j2 / att2 : 1); }
      var cv2 = ctx.createConvolver(); cv2.buffer = ir2; var lp2 = ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 4200;
      var rg2 = ctx.createGain(); rg2.gain.value = .5; cv2.connect(lp2); lp2.connect(rg2); rg2.connect(bus); this.revL = cv2;
    }
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


  /* ---------- outils de son des variantes R1 a R4 (07/10) */
  /* le BIM : grosse caisse, impact, crash, basse profonde et accord, tous sur le meme instant */
  Son.prototype.bimR = function(t, b){
    var p = this.th.pad;
    this.kick(t, .68); this.impact(t); this.crash(t, .1, 1.6);
    this.s808(t, 0, b * 2.2, .3);
    this.stab(t, [p[0] + 12, p[2] + 12, p[3] + 12, p[4] + 12], .1, b * 1.6);
  };
  Son.prototype.grondement = function(t, dur, peak){
    var c = this.ctx, n = c.createBufferSource(); n.buffer = this.bruit; n.loop = true;
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(90, t); lp.frequency.exponentialRampToValueAtTime(340, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * .95); g.gain.linearRampToValueAtTime(0, t + dur);
    n.connect(lp); lp.connect(g); this.envoi(g, .15); n.start(t); n.stop(t + dur + .05);
  };
  Son.prototype.hatOuvert = function(t, peak){
    var c = this.ctx, n = this.noise(t, .22), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 6800;
    var g = c.createGain(); this.env(g, t, .002, peak || .06, .18); n.connect(hp); hp.connect(g); this.envoi(g, .1);
  };
  Son.prototype.coeur = function(t, peak){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(74, t); o.frequency.exponentialRampToValueAtTime(38, t + .16);
    var g = c.createGain(); this.env(g, t, .006, peak, .24); o.connect(g); this.envoi(g, .04); o.start(t); o.stop(t + .32);
    var n = this.noise(t, .06), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 700;
    var gn = c.createGain(); this.env(gn, t, .002, peak * .22, .05); n.connect(lp); lp.connect(gn); this.envoi(gn, 0);
  };
  /* la tension : deux scies sombres qui s'ouvrent et montent, coupees net */
  Son.prototype.tension = function(t, dur, st0, st1, peak, wet){
    var c = this.ctx, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3; lp.frequency.setValueAtTime(180, t); lp.frequency.exponentialRampToValueAtTime(2600, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * .96); g.gain.linearRampToValueAtTime(0, t + dur);
    lp.connect(g); this.envoi(g, wet == null ? .2 : wet);
    var self = this; [-8, 8].forEach(function(dt){ var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(self.f(st0), t); o.frequency.exponentialRampToValueAtTime(self.f(st1), t + dur); o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + dur + .02); });
  };
  Son.prototype.explosion = function(t, peak){
    var c = this.ctx, n = this.noise(t, 1.5), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(9000, t); lp.frequency.exponentialRampToValueAtTime(140, t + 1.4);
    var g = c.createGain(); this.env(g, t, .004, peak || .3, 1.4); n.connect(lp); lp.connect(g); this.envoi(g, .3);
  };
  /* les accents apres le drop : un accord a chaque autre besoin, une note par produit */
  Son.prototype.suiteR = function(T, nItems){
    var d = this.d, B = d.B || { liste:[] }, nA = Math.max(0, B.liste.length - 1), p = this.th.pad, a = this.th.arp, k;
    var finP = nA ? 8 : (nItems ? 10 : 13), finA = nItems ? 10 : 13;
    for (k = 0; k < nA; k++) this.stab(T(finP + k * (finA - finP) / nA), [p[1] + 12, p[3] + 12, p[4] + 12], .07, .3);
    if (nItems) for (k = 0; k < Math.min(4, nItems); k++) this.pince(T(finA + .25 + k * .5), a[k % a.length] + 12, .06);
    this.stab(T(13), [p[0] + 12, p[2] + 12, p[4] + 12], .07, .5);
  };

  /* R1 · le roulement : caisse claire qui accelere (memes instants que l'image), grondement,
     montee, un demi-temps de silence, BIM ; puis groove 120 */
  Son.prototype.planifieR1 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, i, self = this; function T(q){ return t0 + q * b; }
    COUPS_R1.forEach(function(q){ self.snare(T(q), .05 + .2 * forceR1(q)); });
    for (i = 0; i < 5; i++) this.s808(T(i), -12, b * .5, .1 + .04 * i);
    this.grondement(T(0), 5.5 * b, .12);
    this.montee(T(2.5), 3 * b - .02, .13);
    this.inverse(T(5.5), 1.4 * b, .08);
    this.bimR(T(6), b);
    var ligne = [0, 0, 0, 0, 0, 0, 0, 0, 12, 7, 0, 10, 0, 7, 0];
    for (i = 7; i < 15; i++){
      this.kick(T(i), .78); if (i % 2) this.clap(T(i), .22);
      this.hat(T(i + .5), .1); this.hat(T(i + .25), .03); this.hat(T(i + .75), .04);
      this.basse(T(i), ligne[i] - 12, b * .42, .14); this.basse(T(i + .5), ligne[i] - 12, b * .3, .08);
    }
    this.suiteR(T, nItems);
    this.snare(T(15.5), .05); this.snare(T(15.75), .06);
  };
  /* R2 · le tirage : un tic par mot qui passe (les instants exacts du rouleau), petite house,
     pieces qui montent, cloches du gros lot sur le BIM ; puis disco house 124 */
  Son.prototype.planifieR2 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, a = this.th.arp, i, k, self = this, N = Math.max(1, ((this.d.B && this.d.B.roue) ? this.d.B.roue.length : 2) - 1); function T(q){ return t0 + q * b; }
    var der = -1;
    croisementsR2(N).forEach(function(q){ var t = T(q); if (t - der < .045) return; der = t; var lent = q >= 3.9; self.bip(t, lent ? 1900 : 2700, lent ? .05 : .016, lent ? .09 : .05, 'triangle', .05); if (lent) self.kick(t, .14); });
    for (i = 0; i < 4; i++){ this.kick(T(i), .72); this.hat(T(i + .5), .07); this.basse(T(i), -12, b * .4, .12); this.basse(T(i + .5), 0, b * .3, .08); }
    this.montee(T(4), 2 * b - .02, .14);
    for (k = 0; k < 8; k++) this.bip(T(4 + k * .25), this.f(a[k % 4] + 12 + 12 * Math.floor(k / 4)), .08, .035 + .004 * k, 'square', .25);
    [.12, .26, .4].forEach(function(dq, j){ self.cloche(T(6 + dq), a[j] + 12, .06, 1.6); });
    this.bimR(T(6), b);
    var rac = [0, 0, 0, 0, 0, 0, 0, 0, 5, 5, 0, 0, 7, 7, 0];
    for (i = 7; i < 15; i++){
      this.kick(T(i), .8); if (i % 2) this.clap(T(i), .22);
      this.hatOuvert(T(i + .5), .07); this.hat(T(i + .25), .03); this.hat(T(i + .75), .03);
      for (k = 0; k < 2; k++) this.basse(T(i + k * .5), rac[i] + (k ? 0 : -12), b * .3, .12);
    }
    this.suiteR(T, nItems);
    this.balai(T(15), b * .95, 180, 1300, .04, 5);
  };
  /* R3 · le scan : balayage, un bip par mesure lue (memes instants que l'image), techno 128,
     verrou sur la plus basse, un temps de vrai silence, BIM */
  Son.prototype.planifieR3 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, a = this.th.arp, i, self = this, B = this.d.B || { lignes:[], cible:0 }, P = planR3(B.lignes.length, B.cible); function T(q){ return t0 + q * b; }
    this.balai(T(.3), 2.4 * b, 150, 900, .03, 8);
    P.ti.forEach(function(q, j){ self.bip(T(q), 880 + j * 150, .06, .045, 'sine', .25); });
    for (i = 0; i < 4; i++){ this.kick(T(i), .74); this.hat(T(i + .5), .08); this.acid(T(i + .5), -12, b * .3, .05, 500, i % 2); }
    this.balai(T(2.7), 1.8 * b, 1300, 260, .028, 8, 'sine');
    for (i = 0; i < 6; i++) this.bip(T(2.8 + 1.7 * (1 - Math.pow(1 - i / 6, 2))), 1500 - i * 90, .03, .03, 'triangle', 0);
    this.bip(T(4.5), 1760, .07, .06, 'sine', 0); this.bip(T(4.62), 2350, .1, .06, 'sine', 0);
    this.tension(T(4.5), .5 * b, a[0] - 12, a[0] - 7, .05, 0);
    /* temps 5 a 6 : rien. Le silence est le roulement de tambour. */
    this.bimR(T(6), b);
    var seq = [0, 0, 12, 0, 7, 0, 10, 12];
    for (i = 7; i < 15; i++){
      this.kick(T(i), .8); if (i % 2) this.clap(T(i), .2);
      for (var k = 0; k < 4; k++) this.hat(T(i + k / 4), k === 2 ? .08 : .025);
      this.acid(T(i + .5), seq[i % 8] - 12, b * .28, .05, 700 + 120 * (i - 7), i % 3 === 0);
    }
    this.suiteR(T, nItems);
    this.balai(T(15.35), .6 * b, 260, 1400, .03, 8);
  };
  /* R4 · le battement : le coeur (memes instants que l'image) qui accelere, une tension qui monte,
     l'aspiration, l'explosion ; puis groove 116 chaloupe */
  Son.prototype.planifieR4 = function(t0, nItems){
    var b = this.tm.beat, p = this.th.pad, a = this.th.arp, i, self = this; function T(q){ return t0 + q * b; }
    BAT_R4.forEach(function(bt, j){ var k = .6 + .4 * j / (BAT_R4.length - 1); self.coeur(T(bt[0]), .75 * k); self.coeur(T(bt[1]), .5 * k); });
    this.tension(T(.5), 5.4 * b, a[0] - 24, a[0] - 21, .045);
    this.sable(T(2), 1.5 * b, .05, .5); this.sable(T(4), 1.2 * b, .07, -.5);
    this.inverse(T(6), b, .13);
    this.explosion(T(6), .28); this.bimR(T(6), b);
    var bas = [[7, 0, .7], [7.75, 0, .25], [8.5, 0, .5], [9, p[1] - 12, .7], [10, 0, .7], [10.75, 0, .25], [11.5, -2, .5], [12, p[1] - 12, .9], [13, 0, .7], [14, 0, .5], [14.5, 0, .4]];
    bas.forEach(function(n){ self.s808(T(n[0]), n[1], n[2] * b, .3); });
    for (i = 7; i < 15; i++){
      this.kick(T(i), .74); this.bip(T(i + .75), 1700, .025, .03, 'triangle', .1);
      for (var k = 0; k < 4; k++) this.hat(T(i + k / 4), k % 2 ? .02 : .045);
      if (i % 2) this.clap(T(i), .18);
    }
    this.suiteR(T, nItems);
  };


  /* ---------- le son de la serie L (07/10) : un film de luxe. Piano feutre, cordes, verre, choeur,
     tic-tac d'horlogerie ; la tension monte, un vrai silence, puis la timbale et la basse profonde
     sur la revelation, dans une reverberation longue ; l'accord se resout en majeur. Aucun fichier. */
  Son.prototype.envoiL = function(node, wet, wetL){
    node.connect(this.bus);
    if (wet){ var s = this.ctx.createGain(); s.gain.value = wet; node.connect(s); s.connect(this.rev); }
    if (wetL && this.revL){ var s2 = this.ctx.createGain(); s2.gain.value = wetL; node.connect(s2); s2.connect(this.revL); }
  };
  /* piano feutre : partiels legerement inharmoniques, marteau doux */
  Son.prototype.pianoL = function(t, st, peak, dur, clair){
    var c = this.ctx, f0 = this.f(st), D2 = dur || 2.6, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .3;
    var fc = Math.min(8000, (clair || 1) * (700 + f0 * 3.2)); lp.frequency.setValueAtTime(fc, t); lp.frequency.exponentialRampToValueAtTime(Math.max(260, fc * .3), t + D2);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .006); g.gain.exponentialRampToValueAtTime(peak * .38, t + .2); g.gain.exponentialRampToValueAtTime(.0001, t + D2);
    lp.connect(g); this.envoiL(g, .18, .32);
    [[1, 1, 0], [2, .36, 1.2], [3, .14, -.8], [4, .08, 1.6], [5, .04, 0], [6, .02, 0]].forEach(function(h){
      var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f0 * h[0] * Math.sqrt(1 + .0003 * h[0] * h[0]); o.detune.value = h[2];
      var v = c.createGain(); v.gain.setValueAtTime(h[1], t); v.gain.exponentialRampToValueAtTime(Math.max(1e-4, h[1] * .02), t + D2 / (.7 + h[0] * .4));
      o.connect(v); v.connect(lp); o.start(t); o.stop(t + D2 + .05); });
    var n = this.noise(t, .03), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = Math.min(3500, f0 * 5); bp.Q.value = 1;
    var gn = c.createGain(); this.env(gn, t, .001, peak * .1, .03); n.connect(bp); bp.connect(gn); gn.connect(lp);
  };
  Son.prototype.accordL = function(t, notes, peak, dur, ecart){ var self = this; notes.forEach(function(st, i){ self.pianoL(t + i * (ecart || 0), st, peak * (i ? .8 : 1), dur); }); };
  /* cordes : ensemble de scies desaccordees, vibrato lent, attaque et release longues */
  Son.prototype.cordesL = function(t, notes, dur, peak, att, rel, f1, f2){
    var c = this.ctx, A = att || .7, R2 = rel || 1.2, fin = t + Math.max(A, dur) + R2 + .05, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .5;
    lp.frequency.setValueAtTime(f1 || 900, t); lp.frequency.linearRampToValueAtTime(f2 || 1500, t + Math.max(A, dur));
    var hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 110;
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + A); g.gain.setValueAtTime(peak, t + Math.max(A, dur)); g.gain.exponentialRampToValueAtTime(.0001, t + Math.max(A, dur) + R2);
    lp.connect(hp); hp.connect(g); this.envoiL(g, .25, .45);
    var lfo = c.createOscillator(); lfo.frequency.value = 4.8; var lg = c.createGain(); lg.gain.value = 6; lfo.connect(lg); lfo.start(t); lfo.stop(fin);
    var self = this; notes.forEach(function(st){ [-8, 0, 8].forEach(function(dt){ var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = self.f(st); o.detune.value = dt; lg.connect(o.detune);
      var v = c.createGain(); v.gain.value = 1 / (3 * notes.length); o.connect(v); v.connect(lp); o.start(t); o.stop(fin); }); });
  };
  /* le crescendo : les cordes s'ouvrent et montent, puis se coupent net (le silence avant l'impact) */
  Son.prototype.crescL = function(t, dur, notes, peak){
    var c = this.ctx, lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .8; lp.frequency.setValueAtTime(320, t); lp.frequency.exponentialRampToValueAtTime(3200, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * .97); g.gain.linearRampToValueAtTime(0, t + dur);
    lp.connect(g); this.envoiL(g, .2, .2);
    var lfo = c.createOscillator(); lfo.frequency.setValueAtTime(4, t); lfo.frequency.linearRampToValueAtTime(6.5, t + dur); var lg = c.createGain(); lg.gain.value = 9; lfo.connect(lg); lfo.start(t); lfo.stop(t + dur + .05);
    var self = this; notes.forEach(function(st){ [-10, 0, 10].forEach(function(dt){ var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = self.f(st); o.detune.value = dt; lg.connect(o.detune);
      var v = c.createGain(); v.gain.value = 1 / (3 * notes.length); o.connect(v); v.connect(lp); o.start(t); o.stop(t + dur + .02); }); });
  };
  /* l'aspiration : un souffle qui monte et s'arrete net sur le temps */
  Son.prototype.aspireL = function(tFin, dur, peak){
    var c = this.ctx, t = tFin - dur, n = this.noise(t, dur), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(260, t); lp.frequency.exponentialRampToValueAtTime(5200, tFin);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, tFin - .02); g.gain.linearRampToValueAtTime(0, tFin);
    n.connect(lp); lp.connect(g); this.envoiL(g, .1, .1);
  };
  /* la timbale : fondamentale grave, partiels de membrane, peau feutree ; reverberation longue */
  Son.prototype.timbaleL = function(t, st, peak){
    var c = this.ctx, f0 = this.fb(st); if (f0 < 58) f0 *= 1.5;
    [[1, 1, 2.8], [1.5, .42, 1.6], [1.98, .26, 1.2], [2.44, .12, .9]].forEach(function(h){
      var o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f0 * h[0] * 1.05, t); o.frequency.exponentialRampToValueAtTime(f0 * h[0], t + .14);
      var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak * h[1], t + .006); g.gain.exponentialRampToValueAtTime(.0001, t + h[2]);
      o.connect(g); this.envoiL(g, .08, .55); o.start(t); o.stop(t + h[2] + .05); }, this);
    var n = this.noise(t, .2), lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 380;
    var gn = c.createGain(); this.env(gn, t, .002, peak * .45, .16); n.connect(lp); lp.connect(gn); this.envoiL(gn, .1, .35);
  };
  /* la basse profonde, longue */
  Son.prototype.graveL = function(t, st, peak, dur){
    var c = this.ctx, f = this.fb(st), o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * 1.12, t); o.frequency.exponentialRampToValueAtTime(f, t + .2);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); this.envoiL(g, 0, .12); o.start(t); o.stop(t + dur + .05);
  };
  /* le tic-tac d'horlogerie, feutre */
  Son.prototype.ticL = function(t, haut, peak){
    var c = this.ctx, n = this.noise(t, .025), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = haut ? 3400 : 2300; bp.Q.value = 7;
    var g = c.createGain(); this.env(g, t, .0008, peak, .02); n.connect(bp); bp.connect(g); this.envoiL(g, .12, .06);
    var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = haut ? 1900 : 1400; var g2 = c.createGain(); this.env(g2, t, .0008, peak * .35, .03); o.connect(g2); this.envoiL(g2, .08, 0); o.start(t); o.stop(t + .05);
  };
  /* le souffle, lent */
  Son.prototype.souffleL = function(t, dur, peak, f1, f2){
    var c = this.ctx, n = this.noise(t, dur + .1), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = .7; bp.frequency.setValueAtTime(f1 || 600, t); bp.frequency.exponentialRampToValueAtTime(f2 || 1500, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * .55); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    n.connect(bp); bp.connect(g); this.envoiL(g, .2, .3);
  };
  /* le verre : une cloche de cristal (partiels de verre), longue */
  Son.prototype.verreL = function(t, st, peak, dur){
    var c = this.ctx, f0 = this.f(st), D2 = dur || 3.2;
    [[1, 1, 0], [2.32, .42, 3], [4.25, .2, -4], [6.63, .08, 2]].forEach(function(h, i){
      var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f0 * h[0]; o.detune.value = h[2];
      var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak * h[1], t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + D2 / (1 + i * .7));
      o.connect(g); this.envoiL(g, .25, .5); o.start(t); o.stop(t + D2 + .05); }, this);
  };
  /* la nappe de verre : des sinus qui battent lentement (harmonica de verre) */
  Son.prototype.nappeVerreL = function(t, dur, notes, peak, att, rel){
    var c = this.ctx, A = att || 1, R2 = rel || 1, g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + A); g.gain.setValueAtTime(peak, t + dur); g.gain.exponentialRampToValueAtTime(.0001, t + dur + R2);
    this.envoiL(g, .3, .5); var self = this, fin = t + dur + R2 + .05;
    notes.forEach(function(st, i){ [0, 1.6 + i * .4].forEach(function(bt){ var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = self.f(st) + bt; var v = c.createGain(); v.gain.value = 1 / (2 * notes.length); o.connect(v); v.connect(g); o.start(t); o.stop(fin); }); });
  };
  /* la goutte : un « plic » de verre (hauteur qui monte vite) */
  Son.prototype.plicL = function(t, st, peak){
    var c = this.ctx, f = this.f(st), o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(f * .55, t); o.frequency.exponentialRampToValueAtTime(f * 1.3, t + .035);
    var g = c.createGain(); this.env(g, t, .002, peak, .11); o.connect(g); this.envoiL(g, .35, .4); o.start(t); o.stop(t + .16);
  };
  /* le choeur sans paroles : scies filtrees par deux formants, attaque lente */
  Son.prototype.choeurL = function(t, notes, dur, peak, voy, att, rel){
    var c = this.ctx, F = voy === 'o' ? [430, 820] : [760, 1150], A = att || .8, R2 = rel || 1.4, fin = t + dur + R2 + .05, mix = c.createGain(), g = c.createGain();
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + A); g.gain.setValueAtTime(peak, t + Math.max(A, dur)); g.gain.exponentialRampToValueAtTime(.0001, t + Math.max(A, dur) + R2);
    F.forEach(function(fr, i){ var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = fr; bp.Q.value = 5; var gg = c.createGain(); gg.gain.value = i ? 2.2 : 3; mix.connect(bp); bp.connect(gg); gg.connect(g); });
    var lfo = c.createOscillator(); lfo.frequency.value = 5.1; var lg = c.createGain(); lg.gain.value = 10; lfo.connect(lg); lfo.start(t); lfo.stop(fin);
    var self = this; notes.forEach(function(st){ [-9, 9].forEach(function(dt){ var o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = self.f(st); o.detune.value = dt; lg.connect(o.detune); o.connect(mix); o.start(t); o.stop(fin); }); });
    this.envoiL(g, .3, .55);
  };
  /* le celesta : une note claire, courte, qui sonne */
  Son.prototype.celesteL = function(t, st, peak){
    var c = this.ctx, f0 = this.f(st);
    [[1, 1, 1.3], [2, .3, .7], [3.98, .1, .35]].forEach(function(h){ var o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f0 * h[0];
      var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak * h[1], t + .003); g.gain.exponentialRampToValueAtTime(.0001, t + h[2]);
      o.connect(g); this.envoiL(g, .3, .45); o.start(t); o.stop(t + h[2] + .05); }, this);
  };
  /* la plume : le frottement fin du trait d'or */
  Son.prototype.plumeL = function(t, dur, peak){
    var c = this.ctx, n = this.noise(t, dur), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 1.4;
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .08); g.gain.setValueAtTime(peak, t + dur - .1); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    var tr = c.createGain(); tr.gain.value = .6; var lfo = c.createOscillator(); lfo.frequency.value = 17; var lg = c.createGain(); lg.gain.value = .4; lfo.connect(lg); lg.connect(tr.gain); lfo.start(t); lfo.stop(t + dur + .05);
    n.connect(bp); bp.connect(tr); tr.connect(g); this.envoiL(g, .15, .1);
  };
  /* le pas, feutre (un talon sur la moquette du podium) */
  Son.prototype.pasL = function(t, peak){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(58, t + .09);
    var g = c.createGain(); this.env(g, t, .003, peak, .14); o.connect(g); this.envoiL(g, .05, .05); o.start(t); o.stop(t + .2);
    var n = this.noise(t, .02), hp = c.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = 2600; hp.Q.value = 2; var gn = c.createGain(); this.env(gn, t, .0008, peak * .12, .015); n.connect(hp); hp.connect(gn); this.envoiL(gn, .1, 0);
  };
  /* le violoncelle en ostinato, court */
  Son.prototype.celloL = function(t, st, dur, peak){
    var c = this.ctx, o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = this.f(st);
    var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 1.2; lp.frequency.setValueAtTime(1100, t); lp.frequency.exponentialRampToValueAtTime(420, t + dur);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .025); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(lp); lp.connect(g); this.envoiL(g, .12, .2); o.start(t); o.stop(t + dur + .05);
  };
  /* le passage d'un look : un souffle d'air qui traverse */
  Son.prototype.passeL = function(t, peak, pan){
    var c = this.ctx, n = this.noise(t, .5), bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1; bp.frequency.setValueAtTime(420, t); bp.frequency.exponentialRampToValueAtTime(1500, t + .22); bp.frequency.exponentialRampToValueAtTime(500, t + .45);
    var g = c.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .2); g.gain.exponentialRampToValueAtTime(.0001, t + .46);
    n.connect(bp); bp.connect(g); var last = g;
    if (c.createStereoPanner){ var p = c.createStereoPanner(); p.pan.setValueAtTime(-(pan || .5), t); p.pan.linearRampToValueAtTime(pan || .5, t + .45); g.connect(p); last = p; }
    this.envoiL(last, .2, .15);
  };
  /* le declic, un seul (l'appareil photo du premier rang) */
  Son.prototype.declicL = function(t, peak){
    var c = this.ctx; [0, .042].forEach(function(dt, i){ var n = this.noise(t + dt, .012), hp = c.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1800;
      var g = c.createGain(); this.env(g, t + dt, .0006, peak * (i ? .7 : 1), .012); n.connect(hp); hp.connect(g); this.envoiL(g, .2, .1); }, this);
  };
  /* la revelation commune : timbale, basse profonde, accord majeur ample (avec neuvieme) */
  Son.prototype.revelationL = function(t, k){
    k = k || 1;
    this.timbaleL(t, 0, .5 * k); this.graveL(t, 0, .34 * k, 3.2);
    this.accordL(t, [-12, -5, 4, 7, 14], .1 * k, 3.4, .012);
  };
  /* la suite, commune : une note par preuve, deux pour les autres besoins, une par soin, l'accord de « Et toi ? » */
  Son.prototype.suiteL = function(T, nItems, voix){
    var d = this.d, PL = d.PL || planL(d), self = this, nA = d.LX ? Math.min(2, d.LX.liste.length - 1) : 0;
    var jouer = voix || function(t, st, pk){ self.pianoL(t, st, pk, 2.2); };
    jouer(T(PL.rev + .62), 19, .07);
    for (var a = 0; a < nA; a++) jouer(T(PL.aut + .1 + a * .3), [16, 14][a], .055);
    var mel = [19, 16, 21, 24];
    for (var k = 0; k < Math.min(4, nItems); k++) jouer(T(PL.prod + k * PL.dp + .05), mel[k], .06);
    this.accordL(T(PL.cta + .2), [-12, 0, 4, 7, 14], .05, 2.6, .03);
  };

  /* L1 · la une : tic-tac d'horlogerie, piano en pedale, cordes qui montent (i, VI, V sus4), un vrai silence ;
     timbale et basse sur la une ; piano clair ensuite */
  Son.prototype.planifieL1 = function(t0, nItems){
    var b = this.tm.beat, PL = this.d.PL, i, self = this; function T(q){ return t0 + q * b; }
    for (i = 0; i < 8; i++){ var q = i * .5; if (q < 3.75) this.ticL(T(q), i % 2 === 0, .055 + .05 * q / 4); }
    [11, 11.5].forEach(function(q, j){ self.ticL(T(q), j === 0, .05); });
    [0, 1, 2, 3].forEach(function(q){ self.pianoL(T(q), q < 3 ? 12 : 14, .055 + .015 * q, 1.4, .8); self.pianoL(T(q), q < 3 ? 0 : 2, .04, 1.4, .7); });
    this.cordesL(T(0), [-12, 7, 15], 1.9 * b, .05, .9 * b, .5 * b, 700, 1100);
    this.cordesL(T(2), [-16, 3, 12], .95 * b, .065, .3 * b, .3 * b, 900, 1400);
    this.crescL(T(2.9), .85 * b, [-17, 7, 12, 14], .22);
    this.aspireL(T(3.75), .8 * b, .1);
    /* temps 3,75 a 4 : rien */
    this.revelationL(T(PL.rev), 1);
    this.cordesL(T(PL.rev), [4, 7, 14, 16], (PL.prod - PL.rev + .5) * b, .045, .25 * b, 1.4, 1200, 1800);
    if (nItems) this.cordesL(T(PL.prod), [5, 9, 12, 16], (PL.cta - PL.prod) * b, .036, .6 * b, 1, 1000, 1500);
    this.suiteL(T, nItems);
    this.pianoL(T(11.25), -4, .04, 2); this.pianoL(T(11.25), 3, .03, 2);
  };
  /* L2 · le flacon : nappe de verre qui bat, souffles, des gouttes ; violoncelles qui montent ; un silence ;
     la goutte touche le sol : timbale, basse, cloches de cristal */
  Son.prototype.planifieL2 = function(t0, nItems){
    var b = this.tm.beat, PL = this.d.PL, i, self = this; function T(q){ return t0 + q * b; }
    this.nappeVerreL(T(0), 3.68 * b, [24, 31, 36], .045, .9 * b, .06);
    this.souffleL(T(0), 2 * b, .05, 500, 1300); this.souffleL(T(2), 1.8 * b, .06, 700, 1800);
    [[.6, 36], [1.35, 31], [2.1, 38]].forEach(function(g){ self.plicL(T(g[0]), g[1], .05); });
    this.cordesL(T(.5), [-12, -5], 1.6 * b, .045, .8 * b, .4 * b, 500, 900);
    this.crescL(T(2.1), 1.65 * b, [-12, -5, 3, 10], .22);
    this.aspireL(T(3.75), 1.1 * b, .1);
    /* temps 3,75 a 4 : rien. Puis la goutte */
    this.plicL(T(PL.rev), 7, .18);
    this.revelationL(T(PL.rev), 1);
    [12, 16, 19, 26].forEach(function(st, j){ self.verreL(T(PL.rev) + j * .02, st, .045, 3.4); });
    this.nappeVerreL(T(PL.rev + .4), (12 - PL.rev - .4) * b, [24, 28, 31], .03, 1.2 * b, .35);
    this.suiteL(T, nItems, function(t, st, pk){ self.verreL(t, st, pk * .8, 2.4); self.pianoL(t, st - 12, pk * .5, 1.8); });
  };
  /* L3 · le defile : pas feutres, violoncelle en ostinato, un souffle a chaque look, les cordes montent ;
     un silence ; timbale, declic unique et basse sur le dernier passage */
  Son.prototype.planifieL3 = function(t0, nItems){
    var b = this.tm.beat, PL = this.d.PL, i, self = this, B = this.d.B || { lignes:[], cible:0 }; function T(q){ return t0 + q * b; }
    for (i = 0; i < 4; i++) this.pasL(T(i), .3 + .05 * i);
    var ost = [-12, -12, -5, -12, -12, -9, -5, -7];
    for (i = 0; i < 8; i++){ var q = i * .5; if (q < 3.7) this.celloL(T(q), ost[i], .42 * b, .05 + .025 * q / 4); }
    var nL = Math.min(4, Math.max(0, B.lignes.length - 1));
    for (i = 0; i < nL; i++) this.passeL(T(.1 + i * .55 + 1.25), .07, i % 2 ? -.5 : .5);
    this.souffleL(T(2.25), 1.6 * b, .06, 400, 1400);
    this.crescL(T(2.2), 1.55 * b, [-5, 7, 12, 14], .22);
    this.aspireL(T(3.75), 1 * b, .1);
    this.revelationL(T(PL.rev), 1); this.declicL(T(PL.rev), .06);
    this.cordesL(T(PL.rev), [4, 7, 14, 16], (PL.prod - PL.rev + .5) * b, .045, .25 * b, 1.3, 1200, 1800);
    if (nItems){ for (i = 0; i < Math.min(4, nItems); i++) this.pasL(T(PL.prod + i * PL.dp + .05), .2); this.cordesL(T(PL.prod), [5, 9, 12, 16], (PL.cta - PL.prod) * b, .034, .6 * b, 1, 1000, 1500); }
    this.suiteL(T, nItems);
    this.pasL(T(11), .2); this.pasL(T(11.5), .22);
    this.celloL(T(11.5), -12, .42 * b, .04);
  };
  /* L4 · le monogramme : choeur grave, un frottement de plume et une note de celesta par trait,
     un scintillement quand l'or prend ; la fente s'allume ; le sceau s'ouvre : timbale, choeur, celesta */
  Son.prototype.planifieL4 = function(t0, nItems){
    var b = this.tm.beat, PL = this.d.PL, i, self = this; function T(q){ return t0 + q * b; }
    this.choeurL(T(0), [-12, -5, 3], 3.55 * b, .05, 'o', 1.1 * b, .12);
    [[.15, .9, 12], [.65, .75, 16], [1.15, .9, 19], [1.65, .9, 24]].forEach(function(s){ self.plumeL(T(s[0]), s[1] * b, .025); self.celesteL(T(s[0]), s[2], .05); });
    [24, 28, 31, 36].forEach(function(st, j){ self.celesteL(T(2.5 + j * .12), st, .03); });
    this.crescL(T(2.6), 1.15 * b, [-5, 7, 12, 14], .22);
    this.aspireL(T(3.75), 1 * b, .1);
    this.revelationL(T(PL.rev), 1);
    this.choeurL(T(PL.rev), [4, 7, 14], (PL.prod - PL.rev) * b, .055, 'a', .2 * b, 1.6);
    [19, 23, 26].forEach(function(st, j){ self.celesteL(T(PL.rev + .05) + j * .06, st, .045); });
    if (nItems) this.cordesL(T(PL.prod), [5, 9, 12, 16], (PL.cta - PL.prod) * b, .034, .6 * b, 1, 1000, 1500);
    this.suiteL(T, nItems, function(t, st, pk){ self.celesteL(t, st, pk * .9); self.pianoL(t, st - 12, pk * .5, 1.8); });
    this.choeurL(T(10.9), [-12, -5, 3], 1.1 * b, .03, 'o', .9 * b, .3);
  };

  /* ---------- le son de la serie X (07/10, nuit) : 18 temps, calés sur l'image (meme plan d.PX).
     Accroche, montee, un quart de temps de vrai silence, la revelation (temps 4), la preuve,
     une note par soin, « Et toi ? », puis le raccord de boucle. Aucun fichier. */
  Son.prototype.produitsX = function(T, nItems, voix){
    var P = this.d.PX, mel = [19, 24, 21, 28];
    for (var k = 0; k < Math.min(4, nItems); k++) voix(T(P.prod + k * P.dp + .04), mel[k], k);
  };
  /* X1 · le visage en lumiere : verre qui bat, poussiere de celesta qui s'accelere pendant la dispersion,
     souffle et cordes qui montent, silence ; le visage se reforme : basse, timbale, accord de verre, choeur.
     Ensuite une pulsation douce, comme un coeur de lumiere. */
  Son.prototype.planifieX1 = function(t0, nItems){
    var b = this.tm.beat, P = this.d.PX, i, self = this; function T(q){ return t0 + q * b; }
    this.nappeVerreL(T(0), 3.55 * b, [24, 31, 36], .04, .5 * b, .12);
    [[0, 24], [.5, 31], [1, 28], [1.5, 36]].forEach(function(n){ self.celesteL(T(n[0]), n[1], .045); });
    this.souffleL(T(1.6), 2.15 * b, .1, 400, 3800);
    for (i = 0; i < 22; i++){ var u = i / 22; this.celesteL(T(1.7 + 2.0 * Math.sqrt(u)), [24, 28, 31, 35, 36, 40, 43][i % 7] + (i > 14 ? 12 : 0), .016 + .022 * u); }
    this.crescL(T(2), 1.72 * b, [-12, -5, 3, 10], .2);
    this.aspireL(T(3.75), .9 * b, .1);
    /* temps 3,75 a 4 : rien */
    this.graveL(T(P.rev), 0, .42, 2.6); this.timbaleL(T(P.rev), 0, .44); this.explosion(T(P.rev), .1);
    [12, 19, 24, 28, 31].forEach(function(st, j){ self.verreL(T(P.rev) + j * .015, st, .05, 3); });
    this.choeurL(T(P.rev), [0, 7, 16], (P.prod - P.rev) * b, .045, 'a', .15 * b, 1.2);
    this.celesteL(T(P.preuve), 31, .05);
    if (this.d.B && this.d.B.liste.length > 1) [36, 33].forEach(function(st, j){ self.celesteL(T(P.aut + .1 + j * .3), st, .04); });
    for (i = 5; i < 16; i++){ this.kick(T(i), (i >= P.prod && i < P.cta) ? .46 : .36); if (i >= P.prod) this.hat(T(i + .5), .035); }
    this.produitsX(T, nItems, function(t, st){ self.verreL(t, st + 12, .04, 2); self.pianoL(t, st, .065, 1.8); });
    if (nItems) this.cordesL(T(P.prod), [4, 7, 11, 16], (P.cta - P.prod) * b, .03, .6 * b, 1, 1000, 1600);
    this.accordL(T(P.cta + .1), [-12, 0, 4, 7, 14], .065, 2.6, .03); this.choeurL(T(P.cta), [4, 7, 14], 2.5 * b, .035, 'o', .3 * b, 1);
    this.nappeVerreL(T(16.1), 1.7 * b, [24, 31, 36], .03, 1.3 * b, .25);
  };
  /* X2 · le chrome liquide : basse qui ondule, gouttes de metal, sirene et caisse claire qui accelerent,
     silence ; le metal eclate (BIM) ; puis un groove electro 126, une note metallique par soin */
  Son.prototype.planifieX2 = function(t0, nItems){
    var b = this.tm.beat, P = this.d.PX, p = this.th.pad, a = this.th.arp, i, self = this; function T(q){ return t0 + q * b; }
    this.wob(T(0), [p[0], p[2]], 2 * b, .045); this.wob(T(2), [p[0], p[3]], 1.72 * b, .05);
    [[.5, 31], [1.25, 36], [1.75, 28], [2.25, 38], [2.75, 33]].forEach(function(g){ self.plicL(T(g[0]), g[1], .07); });
    for (i = 0; i < 4; i++){ this.kick(T(i), .62); this.hat(T(i + .5), .06); }
    this.tension(T(1), 2.75 * b, a[0] - 24, a[0] - 19, .04);
    this.sirene(T(2), 1.73 * b, a[0] - 24, a[0] - 12, .03);
    var roll = []; for (i = 0; i < 4; i++) roll.push(2.5 + i * .125); for (i = 0; i < 6; i++) roll.push(3 + i / 8);
    roll.forEach(function(q, n){ if (q < 3.74) self.snare(T(q), .06 + .12 * n / roll.length); });
    this.inverse(T(P.rev), .9 * b, .1);
    /* temps 3,75 a 4 : rien */
    this.explosion(T(P.rev), .24); this.bimR(T(P.rev), b); this.cloche(T(P.rev), a[3] + 12, .05, 2);
    var seq = [0, 0, 12, 0, 7, 0, 10, 12];
    for (i = 5; i < 18; i++){
      var fort = i < 16;
      this.kick(T(i), fort ? .74 : .6); if (i % 2 && fort) this.clap(T(i), .2);
      for (var k = 0; k < 4; k++) this.hat(T(i + k / 4), k === 2 ? .07 : .022);
      if (fort) this.acid(T(i + .5), seq[i % 8] - 12, b * .28, .048, 650 + 90 * (i - 5), i % 3 === 0);
    }
    this.wob(T(16), [p[0], p[2]], 2 * b, .035);
    this.celesteL(T(P.preuve), 31, .05);
    this.produitsX(T, nItems, function(t, st){ self.pince(t, st + 12, .07); self.cloche(t, st + 12, .03, 1.2); });
    this.stab(T(P.cta), [p[0] + 12, p[2] + 12, p[4] + 12], .08, .5); this.crash(T(P.cta), .07, 1.2);
  };
  /* X3 · le flacon : harmonica de verre, la lumiere qui passe (souffles), cordes qui montent, silence ;
     la phrase apparait dans le verre : timbale, basse, cloches de cristal ; une pulsation feutree, du piano */
  Son.prototype.planifieX3 = function(t0, nItems){
    var b = this.tm.beat, P = this.d.PX, i, self = this; function T(q){ return t0 + q * b; }
    this.nappeVerreL(T(0), 3.65 * b, [24, 31, 36], .045, .9 * b, .06);
    [[0, 24], [1.5, 31], [2.5, 36]].forEach(function(g){ self.verreL(T(g[0]), g[1], .045, 2.6); });
    [.5, 1.5, 2.5].forEach(function(q, j){ self.souffleL(T(q), .9 * b, .05 + .01 * j, 500, 1800); });
    this.cordesL(T(.5), [-12, -5], 1.6 * b, .045, .8 * b, .4 * b, 500, 900);
    this.crescL(T(2.1), 1.65 * b, [-12, -5, 3, 10], .22);
    this.aspireL(T(3.75), 1.1 * b, .1);
    /* temps 3,75 a 4 : rien */
    this.timbaleL(T(P.rev), 0, .5); this.graveL(T(P.rev), 0, .34, 3.2); this.plicL(T(P.rev), 7, .16);
    this.accordL(T(P.rev), [-12, -5, 4, 7, 14], .1, 3.4, .012);
    [12, 16, 19, 26].forEach(function(st, j){ self.verreL(T(P.rev) + j * .02, st, .045, 3.4); });
    this.cordesL(T(P.rev), [4, 7, 14, 16], (P.prod - P.rev + .5) * b, .04, .25 * b, 1.4, 1200, 1800);
    for (i = 5; i < 16; i += 1){ this.kick(T(i), .3); this.hat(T(i + .5), .028); }
    this.pianoL(T(P.preuve), 19, .06, 2);
    this.produitsX(T, nItems, function(t, st){ self.verreL(t, st, .05, 2.4); self.pianoL(t, st - 12, .05, 1.8); });
    if (nItems) this.cordesL(T(P.prod), [5, 9, 12, 16], (P.cta - P.prod) * b, .034, .6 * b, 1, 1000, 1500);
    this.accordL(T(P.cta + .15), [-12, 0, 4, 7, 14], .055, 2.6, .03);
    this.nappeVerreL(T(16.2), 1.6 * b, [24, 31, 36], .035, 1.2 * b, .2);
  };
  /* X4 · la typo geante : house 132, un souffle a chaque mot ou chiffre que la camera traverse,
     roulement et montee, silence, BIM ; groove, accords hachés sur chaque soin */
  Son.prototype.planifieX4 = function(t0, nItems){
    var b = this.tm.beat, P = this.d.PX, p = this.th.pad, a = this.th.arp, i, self = this; function T(q){ return t0 + q * b; }
    var ligne = [0, 0, 12, 0, 7, 0, 10, 12];
    for (i = 0; i < 18; i++){
      if (i >= 4 && i < 5) continue;
      var drop = i >= 5;
      this.kick(T(i), drop ? .8 : .68);
      if (i % 2) this.clap(T(i), drop ? .22 : .16);
      this.hat(T(i + .5), drop ? .1 : .06); if (drop){ this.hat(T(i + .25), .03); this.hat(T(i + .75), .035); }
      if (drop || i < 3) this.basse(T(i), ligne[i % 8] - 12, b * .42, .13);
    }
    this.chop(T(0), [a[0] - 12, a[2] - 12], b * .7, .09, 'a'); this.chop(T(.75), [a[1] - 12], b * .4, .08, 'a');
    (this.d.PX.passages || [1, 1.6, 2.3, 3]).forEach(function(q, j){ self.souffle(T(q - .12), j % 2 ? -.7 : .7, false, .2); });
    var roll = []; for (i = 0; i < 4; i++) roll.push(2.75 + i * .125); for (i = 0; i < 4; i++) roll.push(3.25 + i / 8);
    roll.forEach(function(q, n){ if (q < 3.74) self.snare(T(q), .06 + .14 * n / roll.length); });
    this.montee(T(2), 1.73 * b, .13);
    this.inverse(T(P.rev), b, .11);
    /* temps 3,75 a 4 : rien (ni grosse caisse, ni charleston) */
    this.explosion(T(P.rev), .26); this.bimR(T(P.rev), b);
    this.chop(T(P.preuve), [a[3] - 12], b * .4, .08, 'o');
    this.produitsX(T, nItems, function(t, st, k){ self.chop(t, [p[k % p.length] + 12, p[(k + 2) % p.length] + 12], b * .5, .085, k % 2 ? 'o' : 'a'); });
    this.stab(T(P.cta), [p[0] + 12, p[2] + 12, p[4] + 12], .085, .5); this.crash(T(P.cta), .08, 1.2);
    this.chop(T(16), [a[0] - 12, a[2] - 12], b * .7, .07, 'a');
    this.inverse(T(18), b * 1.1, .09);
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
.vyw-autre{display:block;margin:12px auto 0;border:0;background:none;color:rgba(217,201,163,.85);font:500 11px/1 Inter,"Helvetica Neue",Arial,sans-serif;letter-spacing:.2em;text-transform:uppercase;text-decoration:underline;text-underline-offset:5px;padding:10px;cursor:pointer}\
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
.vyw.vyw-clair{background:rgba(250,250,249,.96);color:#252622}\
.vyw-clair .vyw-haut b{color:#252622}\
.vyw-clair .vyw-ic{border-color:#d8dcd1;background:#fff;color:#34392e}\
.vyw-clair .vyw-scene{background:#fafafa;box-shadow:0 34px 70px -34px rgba(37,31,19,.38),0 0 0 1px #e3e5de}\
.vyw-clair .vyw-prog{background:rgba(37,38,34,.08)}\
.vyw-clair .vyw-prog i{background:#30362a}\
.vyw-clair .vyw-etat{color:#6b6f66}\
.vyw-clair .vyw-p{background:#272d22;color:#fff;box-shadow:0 14px 30px -16px rgba(37,31,19,.5)}\
.vyw-clair .vyw-p.go{animation:vywGoC 1.1s ease-in-out infinite}\
.vyw-clair .vyw-s{border-color:#a9afa1;color:#343b2c}\
.vyw-clair .vyw-autre{color:#5f6458}\
.vyw-clair .vyw-diag{color:#3f6b4f}\
@keyframes vywGoC{50%{box-shadow:0 0 0 6px rgba(39,45,34,.14),0 14px 30px -16px rgba(37,31,19,.5)}}\
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

    var el = document.createElement('div'); el.className = 'vyw' + (d.type === 'aliment' ? ' vyw-clair' : ''); el.setAttribute('role', 'dialog');   /* 07/10 (soir) : les aliments en clair, comme leur interface */ el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Wrap vyvre');
    el.innerHTML =
      '<div class="vyw-haut"><b>VYVRE</b><span style="display:flex;gap:8px">' +
        '<button type="button" class="vyw-ic vyw-son" aria-pressed="true">' + IC_SON + '<span></span></button>' +
        '<button type="button" class="vyw-ic vyw-x"></button></span></div>' +
      '<div class="vyw-scene"><canvas width="' + W + '" height="' + H + '"></canvas><div class="vyw-prog"><i></i></div></div>' +
      '<p class="vyw-etat" aria-live="polite"></p>' + (DIAG ? '<p class="vyw-diag"></p>' : '') +
      '<div class="vyw-actions"><button type="button" class="vyw-b vyw-p"></button><button type="button" class="vyw-b vyw-s"></button></div>' +
      '<button type="button" class="vyw-autre"></button>';
    var q = function(s){ return el.querySelector(s); };
    q('.vyw-son span').textContent = L.son;
    q('.vyw-x').innerHTML = IC_X; q('.vyw-x').setAttribute('aria-label', L.fermer);
    q('.vyw-p').textContent = L.partager; q('.vyw-s').textContent = L.enregistrer;
    /* 07/10 : un autre tirage (style et couleur differents de ceux affiches) */
    q('.vyw-autre').textContent = L.autre;
    q('.vyw-autre').addEventListener('click', function(){ var st = auHasard(STYLES_DEFAUT.filter(function(x){ return x !== d.style; })), pl = auHasard(Object.keys(PALETTES).filter(function(x){ return x !== d.palette; }));
      ouvrir(Object.assign({}, donnees, { style:st, palette:pl })); });
    var canvas = q('canvas'), etatEl = q('.vyw-etat'), prog = q('.vyw-prog i');
    function etat(s){ etatEl.textContent = s || ''; }
    etat(L.prep);
    /* ?diag=1 : une ligne technique pour les tests sur telephone (jamais montree au public) */
    function montreDiag(){
      if (!DIAG) return; var el2 = q('.vyw-diag'); if (!el2) return;
      var f = null; try { f = resultat && resultat.blob ? new File([resultat.blob], resultat.nom, { type:resultat.type }) : null; } catch(e){}
      var cs = '?'; try { cs = f && navigator.canShare ? (navigator.canShare({ files:[f] }) ? 'oui' : 'non') : (navigator.canShare ? '?' : 'non'); } catch(e){ cs = 'erreur ' + e.name; }
      el2.textContent = 'rec: ' + (diag.mime || '-') + ' | fichier: ' + (diag.fichier || '-') + ' | durée: ' + (diag.duree || '-') +
        ' | share: ' + (navigator.share ? 'oui' : 'non') + ' | canShare(files): ' + cs + ' | dernier partage: ' + diag.partage + ' | style ' + d.style +
        (R.X ? ' | 3D: ' + (R.X.gl ? 'webgl ' + R.X.rw + 'x' + R.X.rh : '2D (repli)') + (statsX(R) ? ' · ' + statsX(R).ms + ' ms/img' : '') : '');
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

    var dernierX = 0, estX = /^X/.test(d.style);
    function dessiner(t){ if (estX){ var nw = performance.now(); if (nw - dernierX < 29) return; dernierX = nw; } R.dessine(t); }
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
        dessiner(tm.boucle ? t % tm.CYCLE : Math.min(t, tm.CYCLE - .001));
        return;
      }
      dessiner(t % tm.CYCLE);
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
      /* X : la mesure de fluidite (temps de rendu de chaque image, en ms) */
      stats: function(){ return statsX(R); },
      fermer: function(){
        if (ferme) return; ferme = true; cancelAnimationFrame(raf);
        try { if (rec && rec.state !== 'inactive') rec.stop(); } catch(e){}
        try { if (son){ son.ecoute.gain.setTargetAtTime(0, ctx.currentTime, .04); son.out.disconnect(); } } catch(e){}
        try { if (navigator.audioSession) navigator.audioSession.type = 'auto'; } catch(e){}
        setTimeout(function(){ R.liberer(); }, 400);
        document.removeEventListener('keydown', clavier);
        document.documentElement.style.overflow = htmlOv;
        el.classList.remove('on'); setTimeout(function(){ el.remove(); }, 380);
        if (OUVERT === ctrl) OUVERT = null;
      }
    };
    OUVERT = ctrl; ctrl.donnees = d; ctrl._R = R;   /* _R : pour les tests (images figees) */
    try { window.VyWrap.dernier = ctrl; } catch(e){}

    /* les polices et les photos d'abord, puis on lance */
    /* 07/10 : la serie L attend ses polices (FontFace) avant de lancer l'image et l'enregistrement */
    var polices = /^L/.test(d.style) ? policesL() : (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, attendre(900)]) : Promise.resolve();
    var photos = Promise.all(d.items.map(function(it){ return chargeImage(it.image).then(function(im){ var c = im ? preRendu(im, it.fond) : null; if (c) c.brut = im; return c; }); }));
    /* 07/10 (X) : la scene 3D se prepare apres les photos (elle en fait des textures) ; si le module manque, repli 2D */
    Promise.all([polices, photos]).then(function(r){ R.imgs = r[1];
        if (!/^X/.test(d.style)) return null;
        return preparerX(R, d, donnees, false).catch(function(e){
          console.warn('[VyWrap] X indisponible, repli', e);
          var d2 = normalise(Object.assign({}, donnees, { style:REPLI_X[d.style] || 'L2' })); Object.keys(d2).forEach(function(k){ d[k] = d2[k]; }); tm = d.tm;
          return /^L/.test(d.style) ? policesL() : null;
        });
      })
      .then(function(){ setTimeout(function(){ q('.vyw-p').focus({ preventScroll:true }); }, 50); lancer(); })
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
      Promise.resolve().then(fournir).then(function(dn){ if (!dn) return;
        /* 07/10 : ?wrap=X2 (ou window.VYW_STYLE) essaie un autre style sur la vraie page, sans changer le style par defaut */
        var st = (location.search.match(/[?&]wrap=([A-DRLX][1-4]?)(&|$)/i) || [])[1] || window.VYW_STYLE;
        if (st && !dn.style) dn.style = String(st).toUpperCase();
        ouvrir(dn); }).catch(function(e){ console.warn('[VyWrap]', e); });
    });
    return b;
  }

  /* un apercu anime dans un canvas donne (page des propales) : boucle sans enregistrement, son a la demande */
  function apercu(canvas, donnees){
    canvas.width = W; canvas.height = H;
    var d = normalise(donnees), R = new Rendu(canvas, d), raf = 0, arret = false, debut = performance.now(), dernier = 0, visible = true, CY = d.tm.CYCLE;
    var son = null, ctx = null, t0 = 0, prochain = 0, fige = false;
    R.dessine(0);
    var pret = Promise.all(d.items.map(function(it){ return chargeImage(it.image).then(function(im){ var c = im ? preRendu(im, it.fond) : null; if (c) c.brut = im; return c; }); }).concat([/^[LX]/.test(d.style) ? policesL() : null]))
      .then(function(r){ R.imgs = r.slice(0, d.items.length);
        if (!/^X/.test(d.style) || arret) return null;
        return preparerX(R, d, donnees, true).then(function(){ if (arret) R.liberer(); }, function(e){
          console.warn('[VyWrap] X indisponible, repli', e);
          var d2 = normalise(Object.assign({}, donnees, { style:REPLI_X[d.style] || 'L2' })); Object.keys(d2).forEach(function(k){ d[k] = d2[k]; }); CY = d.tm.CYCLE;
          return /^L/.test(d.style) ? policesL() : null;
        });
      })
      .then(function(){ debut = performance.now(); });
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
      stats:function(){ return statsX(R); },
      arreter:function(){ arret = true; cancelAnimationFrame(raf); c.taire(); if (io) io.disconnect(); R.liberer(); }
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

  /* 07/10 (X) : les donnees du Wrap de l'assiette, les memes pour la page « parcours » (04-assiette) et pour
     l'assiette ouverte depuis le scan (vy-aliment.js). Lecture seule : rien n'est recalcule.
     o = { ind:Core.indices(), aliments:[f], total, ecartes, credits, base, categories, exemple }
     La revelation = le besoin que la page a lu (i1, son niveau, sa valeur) ; en entretien, « ta peau va bien ».
     Les photos : seulement celles dont la licence permet la reutilisation (credits.json), avec leur credit. */
  var LIC_X = /^(CC0|CC BY|Domaine public|Public domain)/i;
  function donneesAliment(o){
    var ind = o && o.ind; if (!ind) return null;
    var fs = (o.aliments || []).filter(Boolean).slice(0, 4), mois = new Date().getMonth() + 1, cr = o.credits || null, base = o.base || '/scan/aliment/';
    var sev = ind.sev || {}, bas = null; Object.keys(sev).forEach(function(k){ if (IND_X[k] && num(sev[k]) !== null && (bas === null || sev[k] > sev[bas])) bas = k; });
    var ent = !!ind.entretien || ind.i1 === 'entretien', k1 = ent ? bas : ind.i1, niv = ind.niv || {};
    var lecture = { i1:ent ? 'entretien' : ind.i1, n1:num(ind.n1), niv1:ent ? 'normal' : niv[ind.i1] || null, i2:ent ? null : (ind.i2 || null), n2:ent ? null : num(ind.n2),
                    niv2:(!ent && ind.i2) ? niv[ind.i2] || null : null, entretien:ent, bas:bas };
    var ch = [];
    if (k1 && IND_X[k1] && num(ind.n1) !== null) ch.push({ label:IND_X[k1].fr, valeur:Math.round(ind.n1), unite:'/100', cle:'indice' });
    if (lecture.i2 && IND_X[lecture.i2] && num(ind.n2) !== null) ch.push({ label:IND_X[lecture.i2].fr, valeur:Math.round(ind.n2), unite:'/100', cle:'indice2' });
    if (num(o.total) !== null) ch.push({ label:'Aliments passés en revue', valeur:Math.round(o.total), unite:'', cle:'revue' });
    if (num(o.ecartes) !== null) ch.push({ label:'Écartés pour vous', valeur:Math.round(o.ecartes), unite:'', cle:'surmesure' });
    ch.push({ label:'De saison', valeur:fs.filter(function(f){ var sa = f.saison || []; return sa.length && sa.length < 12 && sa.indexOf(mois) >= 0; }).length, unite:'', cle:'saison' });
    ch.push({ label:'Retenus', valeur:fs.length, unite:'', cle:'selection' });
    var items = fs.map(function(f){
      var c = cr && cr[f.id], ok = !!(c && LIC_X.test(String(c.licence || '')));
      return { nom:String(f.nom || '').split(' (')[0].split(',')[0], marque:(o.categories && o.categories[f.categorie]) || '', etape:String(f.portion_type || '').split(' (')[0],
               image:ok ? base + 'photos/' + f.id + '.png' : '', credit:ok ? (c.auteur ? String(c.auteur) + ' · ' : '') + String(c.licence) : '' };
    });
    return { type:'aliment', prenom:'', titre:'Mes aliments peau', exemple:!!o.exemple, lecture:lecture, phare:ch[0] || null, chiffres:ch, items:items };
  }
  /* X : la fluidite mesuree (ms par image : moyenne, 95e centile) et le nombre d'images par seconde que cela permet */
  function statsX(R){
    var m = R.X && R.X.ms; if (!m || m.length < 10) return null;
    var s = m.slice().sort(function(a, b){ return a - b; }), moy = m.reduce(function(a, b){ return a + b; }, 0) / m.length;
    var ts = (R.X.ts || []).slice(-90), fps = ts.length > 10 ? Math.round((ts.length - 1) / ((ts[ts.length - 1] - ts[0]) / 1000) * 10) / 10 : null;
    var ec = 0; for (var i = 1; i < ts.length; i++) ec = Math.max(ec, ts[i] - ts[i - 1]);
    return { n:m.length, ms:Math.round(moy * 10) / 10, p95:Math.round(s[Math.floor(s.length * .95)] * 10) / 10, fps:fps, pireEcart:Math.round(ec), gl:!!R.X.gl, rw:R.X.rw, rh:R.X.rh };
  }
  OUTILS_X = { W:W, H:H, T:T, langue:langue, maj:maj, minusL:minusL, phraseCas:phraseCas, num:num, valTxt:valTxt, formate:formate, unite:unite,
    clamp:clamp, seg:seg, lerp:lerp, eOut3:eOut3, eIn3:eIn3, eInOut:eInOut, eOutExpo:eOutExpo, eOutBack:eOutBack, hash:hash, rgba:rgba,
    couleurs:couleurs, couleursL:couleursL, lumRel:lumRel, policesL:policesL, polEtat:function(){ return POL.etat; },
    fontD:fontD, fontG:fontG, fontJ:fontJ, traceL:traceL, rond:rond, lignes:lignes, DIDONE:DIDONE, GARA:GARA, FINE:FINE, IND_X:IND_X, chargeImage:chargeImage };
  window.VyWrap = { ouvrir:ouvrir, bouton:bouton, amorcer:amorcer, apercu:apercu, styles:['A', 'B', 'C', 'D', 'D1', 'D2', 'D3', 'D4', 'R1', 'R2', 'R3', 'R4', 'L1', 'L2', 'L3', 'L4', 'X1', 'X2', 'X3', 'X4'], palettes:PALETTES, version:'2.4', polices:policesL, aliment:donneesAliment, _normalise:normalise, _mesurerDuree:mesurerDuree, _temps:temps, _Son:Son, _chargeX:chargeX };
})();
