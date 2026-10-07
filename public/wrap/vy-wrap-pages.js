/* ===========================================================================
   VYVRE · LE WRAP · les branchements (05/10/2026)
   Pose le bouton « Créer mon Wrap » a la fin des parcours et lui donne les
   VRAIES valeurs de la page (lecture seule : rien n'est recalcule ni invente).
     - scan de peau      /scan/                     (resultats #view-results)
     - scan de cheveux   /cheveux/                  (« Ce que la fibre a renvoyé »)
     - assiette          /aliment/parcours/04-*.html (page resultat)
   L'assiette ouverte depuis le scan de peau (vy-aliment.js) et la propale Lab
   posent leur bouton elles-memes : leurs donnees vivent dans leur propre portee.
   =========================================================================== */
(function(){
  'use strict';
  if (!window.VyWrap) return;
  var FR = function(){ var l = ''; try { l = (window.VY && window.VY.lang) || document.documentElement.lang || 'fr'; } catch(e){} return String(l).slice(0, 2).toLowerCase() === 'fr'; };
  function n(v){ var x = Number(v); return isFinite(x) ? x : null; }
  function zone(id, apres){
    var z = document.getElementById(id); if (z) return z;
    if (!apres || !apres.parentNode) return null;
    z = document.createElement('div'); z.id = id; z.className = 'vyw-zone';
    apres.parentNode.insertBefore(z, apres.nextSibling); return z;
  }
  /* 07/10 (X1) : la vignette du visage n'est reprise que si elle a ete ecrite PENDANT cette visite (jamais celle
     d'un scan precedent, peut-etre d'une autre personne sur le meme appareil). Elle reste dans la page. */
  var FACE0 = null; try { FACE0 = localStorage.getItem('vyvre_scan_face'); } catch(e){}
  function vignette(src, box, sujet){
    /* les 68 reperes du visage, si le detecteur de la page est la (aucun envoi) */
    return new Promise(function(res){
      var out = { src:src, sujet:sujet || 'visage' }; if (box) out.box = box;
      var fa = window.faceapi, fini = false; function sortie(){ if (!fini){ fini = true; res(out); } }
      try {
        if (!fa || !fa.nets || !fa.nets.tinyFaceDetector || !fa.nets.tinyFaceDetector.isLoaded || !fa.nets.faceLandmark68Net || !fa.nets.faceLandmark68Net.isLoaded) return sortie();
        var im = new Image(); im.onload = function(){
          fa.detectSingleFace(im, new fa.TinyFaceDetectorOptions({ inputSize:320, scoreThreshold:.35 })).withFaceLandmarks().then(function(r){
            if (r && r.landmarks){ var w = im.naturalWidth, h = im.naturalHeight; out.pts = r.landmarks.positions.map(function(q){ return [q.x / w, q.y / h]; }); }
            sortie();
          }).catch(sortie);
        }; im.onerror = sortie; im.src = src;
        setTimeout(sortie, 2500);
      } catch(e){ sortie(); }
    });
  }
  function veille(test, poser, ms){
    var t = setInterval(function(){ try { if (test()){ poser(); } } catch(e){} }, ms || 800);
    return t;
  }

  /* ------------------------------------------------ scan de peau (/scan/) */
  function peau(){
    var res = document.getElementById('view-results'); if (!res) return;
    /* la grille des resultats (grand ecran) place ses pieces a la main : le bouton prend la case a droite du protocole */
    var st = document.createElement('style');
    st.textContent = '#view-results #vy-wrap-peau{display:flex!important;justify-content:center;align-items:center;grid-row:6;grid-column:10/13;padding:0}' +
      '@media (max-width:1099px){#view-results #vy-wrap-peau{padding:6px 0 4px}}';
    document.head.appendChild(st);
    var t = function(k){ try { return window.VY && VY.t ? VY.t(k) : k; } catch(e){ return k; } };
    function donnees(){
      var r = window.vyvreLastScanResult, sc = r && r.scores; if (!sc) return null;
      /* les memes libelles que la page ; sebum et pigmentation inverses, comme a l'ecran */
      var K = [['glow','c.glow'], ['redness','c.redness'], ['hydration','c.hydration'], ['pores','c.pores'], ['sebum','c.sebum',1], ['pigmentation','c.pigmentation',1], ['wrinkles','c.wrinkles'], ['firmness','c.firmness']];
      var ch = K.map(function(k){ var v = n(sc[k[0]]); if (v === null) return null; v = Math.max(0, Math.min(100, Math.round(k[2] ? 100 - v : v))); return { label:t(k[1]), valeur:v, unite:'/100', cle:k[0] }; }).filter(Boolean);   /* 07/10 : la cle sert aux phrases du Wrap R (independante de la langue) */
      ch.sort(function(a, b){ return b.valeur - a.valeur; });   /* le chiffre phare : le meilleur score */
      var sel = (window.__vySelection || []).slice(0, 4);
      var items = sel.map(function(p, i){
        var lb = document.querySelector('[data-vyvre-prod-slot="' + i + '"] .v6lbl');
        return { nom:p.name, marque:p.brand_name || p.brand || '', image:p.cutout_url || p.image_url || '', fond:!!p.image_fond, etape:lb ? lb.textContent.trim() : '' };
      });
      /* 06/10 : le chiffre phare est l'indice global affiche en grand sur la page (lu tel quel, jamais recalcule) ;
         s'il manque, on garde l'ancien comportement (le meilleur score) */
      var big = document.querySelector('[data-vyvre-score-large]'), gv = big ? Number(big.dataset.target) : NaN;
      var phare = (big && big.dataset.target !== '' && isFinite(gv) && gv >= 0 && gv <= 100) ? { label:FR() ? 'Indice global' : 'Global index', valeur:Math.round(gv), unite:'/100' } : ch[0];
      var dn = { type:'peau', prenom:'', titre:FR() ? 'Ma peau' : 'My skin', chiffres:ch, phare:phare, items:items };
      var f = null; try { f = localStorage.getItem('vyvre_scan_face'); } catch(e){}
      if (f && f !== FACE0 && /^data:image\//.test(f)) return vignette(f, null, 'visage').then(function(v){ dn.visage = v; return dn; });
      return dn;
    }
    var fait = false;
    var tm = veille(function(){ return !fait && res.classList.contains('active') && window.vyvreLastScanResult && window.__vySelection && window.__vySelection.length; }, function(){
      var row = document.getElementById('vyvre-product-row'); var z = zone('vy-wrap-peau', row); if (!z) return;
      fait = true; clearInterval(tm);
      z.appendChild(VyWrap.bouton(donnees, { type:'peau' }));
    });
  }

  /* ------------------------------------------- scan de cheveux (/cheveux/) */
  function cheveux(){
    if (!document.getElementById('rfGestes') || typeof window.S !== 'object') return;
    function donnees(){
      var S = window.S, out = S.out || {}, sc = out.scores || {}, q = out.qualite || {}, T = window.T || function(k){ return k; };
      var rt = S.routine || out.routine || null, liste = rt && rt.routine ? rt.routine : (Array.isArray(rt) ? rt : []);
      liste = liste.filter(Boolean).slice().sort(function(a, b){ return (a.etape || 9) - (b.etape || 9); }).slice(0, 4);
      var ch = [];
      /* la boucle telle que la PHOTO l'a donnee (meme regle que la page : jamais le declare) */
      var mb = out.mesures && out.mesures.boucle, vb = mb && (mb.valeur != null ? mb.valeur : (mb.detail && mb.detail.valeur));
      if (vb != null && n(vb) !== null) ch.push({ label:T('hc.m.boucle'), valeur:Math.round(vb <= 1 ? vb * 100 : vb), unite:'/100', cle:'boucle' });
      var fam = sc.couleur && window.FAMILLES && window.FAMILLES[String(sc.couleur.famille || '').toLowerCase()];
      if (fam) ch.push({ label:T('hc.m.couleur'), valeur:T(fam), unite:'' });
      if (typeof q.score === 'number') ch.push({ label:T('hc.rel.2'), valeur:Math.round(q.score), unite:'/100' });
      if (liste.length) ch.push({ label:T('hc.rel.3'), valeur:liste.length, unite:T('hc.rf.gestesu'), cle:'routine' });
      var phare = ch.filter(function(c){ return n(c.valeur) !== null; })[0] || null;
      var items = liste.map(function(p){
        var img = typeof window.imageUrl === 'function' ? window.imageUrl(p) : (p.cutout_url || p.image || '');
        var et = typeof window.stepKey === 'function' ? T(window.stepKey(p, p.etape)) : '';
        return { nom:p.nom || p.name || '', marque:p.marque || p.brand_name || '', image:img || '', fond:!!p.image_fond, etape:et };
      });
      /* 07/10 : les besoins pour les phrases du Wrap R, avec les MEMES seuils que la phrase de la page
         (ecrirePhrase) ; la provenance est dite : « reponses » quand l'etat vient a 100 % des questions */
      var bes = [], seuils = [['secheresse', 55], ['casse', 55], ['racinesGrasses', 60], ['frizz', 55]];
      seuils.forEach(function(sq, i){ var x = sc[sq[0]], v = x && n(x.valeur);
        if (v !== null && v >= sq[1]) bes.push({ cle:sq[0], v:v, i:i, source:x.partDeclaree === 1 ? 'reponses' : (x.partDeclaree === 0 ? 'photo' : 'lecture') }); });
      bes.sort(function(a, b){ return b.v - a.v || a.i - b.i; });
      var rep = S.answers || {};
      if (rep.etat === 'colores' || rep.etat === 'decolores') bes.push({ cle:'couleur', source:'reponses' });
      /* 07/10 (X) : le nom de la mesure accompagne chaque besoin (la preuve : « SÉCHERESSE · D'APRÈS TES RÉPONSES ») */
      var NOMS = { secheresse:'hc.m.secheresse', casse:'hc.m.casse', racinesGrasses:'hc.m.gras', frizz:'hc.m.frizz', couleur:'hc.m.couleur' };
      var dn = { type:'cheveux', prenom:'', titre:FR() ? 'Mes cheveux' : 'My hair', chiffres:ch, phare:phare, items:items, exemple:!!window.DEMO,
               besoins:bes.map(function(b){ var lb = NOMS[b.cle] ? T(NOMS[b.cle]) : ''; return { cle:b.cle, source:b.source, label:lb && lb !== NOMS[b.cle] ? lb : '' }; }) };
      /* X1 : l'image capturee par la camera (pose de face), si elle existe ; jamais en demonstration */
      try {
        var po = (S.poses || []).filter(function(x){ return x && x.canvas && x.canvas.width; })[0];
        if (po && !window.DEMO){
          var c = document.createElement('canvas'), k = 360 / po.canvas.width; c.width = 360; c.height = Math.round(po.canvas.height * k);
          c.getContext('2d').drawImage(po.canvas, 0, 0, c.width, c.height);
          var fb = po.faceBox, bx = fb ? { x:fb.x / po.canvas.width, y:fb.y / po.canvas.height, w:fb.width / po.canvas.width, h:fb.height / po.canvas.height } : null;
          dn.visage = { src:c.toDataURL('image/jpeg', .8), sujet:'cheveux', box:bx };
        }
      } catch(e){}
      return dn;
    }
    var tm = veille(function(){ var g = document.getElementById('rfGestes'); return g && g.children.length && window.S && window.S.out; }, function(){
      var z = document.getElementById('vy-wrap-cheveux') || zone('vy-wrap-cheveux', document.getElementById('rfMot'));
      if (z && !z.firstChild) z.appendChild(VyWrap.bouton(donnees, { type:'cheveux' }));
    }, 900);
  }

  /* ---------------------------- assiette (/aliment/parcours/04-*.html) */
  function parcours(){
    var page = window.PAGE; if (page !== 'result' && page !== 'resultSolo') return;
    var CAT = { legume:'Légume', fruit:'Fruit', legumineuse:'Légumineuse', poisson:'Poisson', fruit_de_mer:'Fruit de mer', cereale_complete:'Céréale complète', feculent:'Féculent', fruit_a_coque:'Fruit à coque', graine:'Graine', fruit_sec:'Fruit sec', cacao:'Cacao', boisson:'Boisson', matiere_grasse:'Huile', produit_laitier_fermente:'Produit laitier fermenté', produit_laitier:'Produit laitier', fromage:'Fromage', oeuf:'Œuf', epice_herbe:'Épice ou herbe', volaille:'Volaille', viande:'Viande', condiment:'Condiment', sucre:'Produit sucré' };
    function donnees(){
      /* prepareSelection, Core et DATA_BASE sont ceux de parcours.js (portee globale).
         07/10 (X) : la revelation = le besoin que la page a lu (Core.indices : i1, son niveau, sa valeur ; entretien sinon),
         puis les aliments retenus avec leurs photos (licence verifiee, credit joint). Avant : « 265 aliments passés en revue ». */
      if (typeof prepareSelection !== 'function' || !VyWrap.aliment) return null;
      var z = prepareSelection(); if (!z) return null;
      var base = (typeof DATA_BASE === 'string') ? DATA_BASE : '/scan/aliment/';
      var credits = null; try { credits = Core.get().credits; } catch(e){}
      var demoPhoto = false; try { demoPhoto = !!demo; } catch(e){}
      return VyWrap.aliment({ ind:z.ind, aliments:z.chosen.slice(0, 4).map(function(c){ return c.f; }), total:z.data.length, ecartes:z.excluded,
                              credits:credits, base:base, categories:CAT, exemple:demoPhoto });
    }
    var app = document.getElementById('app'); if (!app) return;
    function poser(){
      if (document.getElementById('vy-wrap-assiette')) return;
      var ap = app.querySelector('.results .signals') || app.querySelector('.results .result-grid') || app.querySelector('.results .result-head');
      if (!ap || !app.querySelector('.results .list-food, .results .hero-food')) return;
      var z = zone('vy-wrap-assiette', ap); if (z) z.appendChild(VyWrap.bouton(donnees, { type:'aliment' }));
    }
    /* la page se reecrit a chaque filtre : on repose le bouton apres chaque rendu */
    new MutationObserver(poser).observe(app, { childList:true });
    poser();
  }

  function go(){ peau(); cheveux(); parcours(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
})();
