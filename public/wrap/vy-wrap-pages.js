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
      var ch = K.map(function(k){ var v = n(sc[k[0]]); if (v === null) return null; v = Math.max(0, Math.min(100, Math.round(k[2] ? 100 - v : v))); return { label:t(k[1]), valeur:v, unite:'/100' }; }).filter(Boolean);
      ch.sort(function(a, b){ return b.valeur - a.valeur; });   /* le chiffre phare : le meilleur score */
      var sel = (window.__vySelection || []).slice(0, 4);
      var items = sel.map(function(p, i){
        var lb = document.querySelector('[data-vyvre-prod-slot="' + i + '"] .v6lbl');
        return { nom:p.name, marque:p.brand_name || p.brand || '', image:p.cutout_url || p.image_url || '', fond:!!p.image_fond, etape:lb ? lb.textContent.trim() : '' };
      });
      return { type:'peau', prenom:'', titre:FR() ? 'Ma peau' : 'My skin', chiffres:ch, phare:ch[0], items:items };
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
      if (vb != null && n(vb) !== null) ch.push({ label:T('hc.m.boucle'), valeur:Math.round(vb <= 1 ? vb * 100 : vb), unite:'/100' });
      var fam = sc.couleur && window.FAMILLES && window.FAMILLES[String(sc.couleur.famille || '').toLowerCase()];
      if (fam) ch.push({ label:T('hc.m.couleur'), valeur:T(fam), unite:'' });
      if (typeof q.score === 'number') ch.push({ label:T('hc.rel.2'), valeur:Math.round(q.score), unite:'/100' });
      if (liste.length) ch.push({ label:T('hc.rel.3'), valeur:liste.length, unite:T('hc.rf.gestesu') });
      var phare = ch.filter(function(c){ return n(c.valeur) !== null; })[0] || null;
      var items = liste.map(function(p){
        var img = typeof window.imageUrl === 'function' ? window.imageUrl(p) : (p.cutout_url || p.image || '');
        var et = typeof window.stepKey === 'function' ? T(window.stepKey(p, p.etape)) : '';
        return { nom:p.nom || p.name || '', marque:p.marque || p.brand_name || '', image:img || '', fond:!!p.image_fond, etape:et };
      });
      return { type:'cheveux', prenom:'', titre:FR() ? 'Mes cheveux' : 'My hair', chiffres:ch, phare:phare, items:items, exemple:!!window.DEMO };
    }
    var tm = veille(function(){ var g = document.getElementById('rfGestes'); return g && g.children.length && window.S && window.S.out; }, function(){
      var z = document.getElementById('vy-wrap-cheveux') || zone('vy-wrap-cheveux', document.getElementById('rfMot'));
      if (z && !z.firstChild) z.appendChild(VyWrap.bouton(donnees, { type:'cheveux' }));
    }, 900);
  }

  /* ---------------------------- assiette (/aliment/parcours/04-*.html) */
  function parcours(){
    var page = window.PAGE; if (page !== 'result' && page !== 'resultSolo') return;
    function donnees(){
      /* prepareSelection, Core et DATA_BASE sont ceux de parcours.js (portee globale) */
      if (typeof prepareSelection !== 'function') return null;
      var z = prepareSelection(); if (!z) return null;
      var chosen = z.chosen.slice(0, 4), mois = new Date().getMonth() + 1;
      var saison = chosen.filter(function(c){ return (c.f.saison || []).indexOf(mois) >= 0; }).length;
      var base = (typeof DATA_BASE === 'string') ? DATA_BASE : '/scan/aliment/';
      var credits = null; try { credits = Core.get().credits; } catch(e){}
      var ch = [
        { label:'Aliments passés en revue', valeur:z.data.length, unite:'' },
        { label:'Écartés pour vous', valeur:z.excluded, unite:'' },
        { label:'De saison', valeur:saison, unite:'' },
        { label:'Retenus', valeur:chosen.length, unite:'' }
      ];
      var items = chosen.map(function(c){ var f = c.f;
        return { nom:String(f.nom || '').split(' (')[0].split(',')[0], marque:'', etape:String(f.portion_type || '').split(' (')[0],
                 image:(credits && !credits[f.id]) ? '' : base + 'photos/' + f.id + '.png' }; });
      var demoPhoto = false; try { demoPhoto = !!demo; } catch(e){}
      return { type:'aliment', prenom:'', titre:'Mon assiette', chiffres:ch, phare:ch[0], items:items, exemple:demoPhoto };
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
