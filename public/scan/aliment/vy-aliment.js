/* ==========================================================================
   VYVRE · VOTRE ASSIETTE (30/09/2026)
   Le « scan aliment », branche sur la VRAIE lecture de peau (window.__vyScores).
   Donnees et regles : _nutrition/ (aliments.json : 44 aliments, CIQUAL 2020,
   allegations UE verifiees ; REGLES_RECOMMANDATION.md ; QUESTIONNAIRE.md).
   Style : editorial, grands titres italiques (Charles : « ce style ca change »,
   d'apres la proposition Maree d'Astra).
   Rien n'est envoye : les reponses restent sur cet appareil.
   ========================================================================== */
(function(){
  'use strict';
  var BASE = '/scan/aliment/';
  var INDICES = { rougeurs:'Rougeurs', eclat:'Éclat', pores_sebum:'Pores et sébum', uniformite:'Uniformité', rides_fermete:'Rides et fermeté', hydratation:'Hydratation', texture:'Texture' };
  var PHRASE = {
    hydratation:'L’eau n’aide la peau que si l’on boit peu. L’hydratation de surface dépend d’abord des soins et de l’environnement.',
    eclat:'Les pigments orangés des végétaux se déposent dans la peau ; une étude a relié plus de fruits et légumes à un teint jugé plus sain en six semaines.',
    rougeurs:'Dans de petits essais, 40 à 55 g de concentré de tomate par jour pendant 10 à 12 semaines ont un peu réduit la rougeur provoquée par les UV. Cela ne remplace jamais une protection solaire.',
    pores_sebum:'Féculents complets et légumineuses : une alimentation à faible charge glycémique.',
    uniformite:'Contre les taches, la protection solaire reste la première mesure.',
    rides_fermete:'Le tabac et le soleil sont les deux premiers facteurs de rides.',
    texture:'Les données sont encore limitées.' };
  var QUESTIONS = [
    { id:'q1', t:'Avez-vous une allergie alimentaire diagnostiquée ?', oblig:1, multi:1, o:[['aucune','Aucune'],['cereales_gluten','Gluten'],['crustaces','Crustacés'],['oeufs','Œufs'],['poissons','Poissons'],['arachides','Arachides'],['soja','Soja'],['lait','Lait'],['fruits_a_coque','Fruits à coque'],['celeri','Céleri'],['moutarde','Moutarde'],['sesame','Sésame'],['sulfites','Sulfites'],['lupin','Lupin'],['mollusques','Mollusques']] },
    { id:'q2', t:'Allergie au latex ou au pollen de bouleau ?', oblig:1, multi:1, o:[['non','Non'],['latex','Latex'],['bouleau','Bouleau'],['nsp','Je ne sais pas']] },
    { id:'q3', t:'Êtes-vous enceinte, allaitez-vous, ou avez-vous un projet de grossesse ?', oblig:1, o:[['non','Non'],['enceinte','Enceinte'],['allaite','J’allaite'],['projet','Projet de grossesse'],['nr','Je préfère ne pas répondre']] },
    { id:'q4', t:'Prenez-vous un de ces traitements ?', oblig:1, multi:1, o:[['aucun','Aucun'],['avk','Anticoagulant (AVK)'],['quotidien','Un traitement tous les jours'],['thyroide','Thyroïde, lithium ou amiodarone'],['selenium','Complément de sélénium'],['zinc_iode','Complément de zinc ou d’iode'],['betacarotene','Complément de bêta-carotène']] },
    { id:'q5', t:'Avez-vous une de ces situations de santé ?', oblig:1, multi:1, o:[['aucune','Aucune'],['renale','Maladie rénale'],['coeliaque','Maladie cœliaque'],['thyroide','Maladie de la thyroïde'],['cardiaque','Maladie cardiaque'],['diabete','Diabète traité'],['sein','Cancer du sein (vous ou votre famille)'],['tca','Trouble du comportement alimentaire'],['calculs','Calculs rénaux']] },
    { id:'q6', t:'Quel âge avez-vous ?', oblig:1, o:[['moins18','Moins de 18 ans'],['18_64','18 à 64 ans'],['65','65 ans et plus']] },
    { id:'q7', t:'Votre régime alimentaire', o:[['omni','Omnivore'],['flexi','Flexitarien'],['pesce','Pescétarien'],['vege','Végétarien'],['vegan','Végan'],['halal','Halal'],['casher','Casher'],['sansporc','Sans porc']] },
    { id:'q8', t:'Avez-vous (ou pensez-vous avoir) un de ces problèmes de peau ?', multi:1, o:[['aucun','Aucun'],['acne','Acné'],['rosacee','Rosacée ou rougeurs'],['eczema','Eczéma'],['psoriasis','Psoriasis'],['nsp','Je ne sais pas']] },
    { id:'q9', t:'Votre sommeil', multi:1, o:[['moins6','Moins de 6 h'],['6_7','6 à 7 h'],['7_9','7 à 9 h'],['plus9','Plus de 9 h'],['regulier','Horaires réguliers'],['irregulier','Horaires très irréguliers']] },
    { id:'q10', t:'Votre activité', multi:1, o:[['moins4000','Moins de 4 000 pas'],['4000_7000','4 000 à 7 000 pas'],['plus7000','Plus de 7 000 pas'],['moins150','Moins de 150 min par semaine'],['plus150','150 min ou plus']] } ];
  var PREUVE = { A:'Preuves solides : plusieurs essais cliniques.', B:'Preuves modérées : au moins un essai clinique, souvent petit.', C:'Preuves limitées pour un effet visible sur la peau : observations ou mécanismes.' };
  var MOIS = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  var AL_NOM = { cereales_gluten:'gluten', poissons:'poissons', fruits_a_coque:'fruits à coque', lait:'lait', oeufs:'œufs', soja:'soja', mollusques:'mollusques' };
  var NUTR = [['vitamine c','vitamine_c_mg','mg de vitamine C'],['zinc','zinc_mg','mg de zinc'],['fibres','fibres_g','g de fibres'],['oméga-3','epa_dha_mg','mg d’oméga-3 EPA et DHA'],['ala','ala_g','g d’oméga-3 (ALA)'],['vitamine e','vitamine_e_mg','mg de vitamine E'],['sélénium','selenium_ug','µg de sélénium'],['protéines','proteines_g','g de protéines'],['iode','iode_ug','µg d’iode'],['potassium','potassium_mg','mg de potassium']];
  var SANS_ETUDE = ['graines_courge','graines_tournesol','graines_chia','myrtille'], VEGETAL = ['legume','fruit','legumineuse','cereale_complete'];
  var RECETTES = [
    { n:'Lentilles mijotées à la tomate et à l’huile d’olive', ing:['lentille','concentre_tomate','huile_olive','carotte'], al:[], t:'Faire revenir une carotte en dés dans l’huile d’olive, ajouter deux cuillères de concentré de tomate, puis les lentilles et de l’eau ; mijoter 25 minutes.' },
    { n:'Sardines, poivron rouge rôti et pain complet', ing:['sardine','poivron_rouge','pain_complet','huile_olive'], al:['poissons','cereales_gluten'], t:'Rôtir le poivron au four, le peler, le poser sur du pain complet avec les sardines et un filet d’huile d’olive.' },
    { n:'Porridge d’avoine, kiwi et noix', ing:['flocons_avoine','kiwi','noix','yaourt_nature'], al:['cereales_gluten','fruits_a_coque','lait'], t:'Cuire les flocons d’avoine cinq minutes, servir avec un kiwi en dés, quelques noix et une cuillère de yaourt nature.' },
    { n:'Patate douce rôtie, pois chiches et épinards', ing:['patate_douce','pois_chiche','epinard','huile_olive'], al:[], t:'Rôtir la patate douce en cubes 30 minutes, ajouter les pois chiches, puis les épinards juste fondus à la poêle.' } ];

  var DATA = null, COMBOS = null, REP = {}, ouvert = null;
  try { REP = JSON.parse(localStorage.getItem('vy-assiette') || '{}') || {}; } catch(e){ REP = {}; }
  function garder(){ try { localStorage.setItem('vy-assiette', JSON.stringify(REP)); } catch(e){} }
  function charger(){ if(DATA) return Promise.resolve();
    return fetch(BASE + 'aliments.json').then(function(r){ return r.json(); }).then(function(j){ DATA = j.aliments; })
      .then(function(){ return fetch(BASE + 'combos.json').then(function(r){ return r.ok ? r.json() : null; }).then(function(j){ COMBOS = j; }).catch(function(){}); }); }
  function esc(t){ return String(t == null ? '' : t).replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
  function a(cle, v){ var r = REP[cle]; return Array.isArray(r) ? r.indexOf(v) >= 0 : r === v; }
  function n2(k){ return String(k + 1).padStart(2, '0'); }

  /* ---- les deux indices les plus faibles de la VRAIE lecture ---- */
  function indicesDuScan(){ var s = window.__vyScores || (window.vyvreLastScanResult && window.vyvreLastScanResult.scores) || null; if(!s) return null;
    var v = function(k){ var n = Number(s[k]); return isFinite(n) ? n : null; };
    var sev = {};
    var rf = [v('wrinkles'), v('firmness')].filter(function(x){ return x != null; }); if(rf.length) sev.rides_fermete = 100 - Math.min.apply(null, rf);
    if(v('glow') != null) sev.eclat = 100 - v('glow');
    if(v('hydration') != null) sev.hydratation = 100 - v('hydration');
    if(v('redness') != null) sev.rougeurs = 100 - v('redness');
    var ps = []; if(v('pores') != null) ps.push(100 - v('pores')); if(v('sebum') != null) ps.push(v('sebum')); if(ps.length) sev.pores_sebum = Math.max.apply(null, ps);
    if(v('pigmentation') != null) sev.uniformite = v('pigmentation');
    var t = Object.keys(sev).sort(function(x, y){ return sev[y] - sev[x]; });
    return t.length ? { i1:t[0], i2:t[1] || null } : null; }

  /* ---- exclusions (QUESTIONNAIRE.md) ---- */
  function exclus(){ var x = {}, notes = {}; var ex = function(i){ x[i] = 1; }, note = function(i, t){ (notes[i] = notes[i] || []).push(t); };
    DATA.forEach(function(f){ (f.allergenes_UE || []).forEach(function(al){ if(a('q1', al)) ex(f.id); }); });
    if(a('q1','sulfites')) ex('abricot');
    if(a('q2','latex')){ ['avocat','kiwi'].forEach(ex); ['tomate','concentre_tomate','poivron_rouge'].forEach(function(i){ note(i, 'Allergie au latex : réaction possible (syndrome latex-fruits).'); }); }
    if(a('q2','bouleau')) ['noisette','amande','carotte','kiwi','abricot','tofu'].forEach(function(i){ note(i, 'Pollen de bouleau : réaction croisée possible ; préférez-le cuit quand c’est possible.'); });
    if(a('q3','enceinte') || a('q3','allaite')){ ['tofu','huitre','the_vert'].forEach(ex); note('saumon', 'Enceinte ou allaitante : uniquement cuit, pas fumé.'); }
    if(a('q4','avk')) ['epinard','chou_frise','brocoli','mache'].forEach(ex);
    if(a('q4','quotidien')) ex('pamplemousse');
    if(a('q4','thyroide') || a('q5','thyroide') || a('q5','cardiaque') || a('q4','zinc_iode')) ex('huitre');
    if(a('q4','selenium') || a('q6','moins18')) ex('noix_bresil');
    if(a('q5','renale')) ['avocat','noix','amande','noisette','noix_bresil','lentille','pois_chiche','haricot_rouge','cacao_poudre','chocolat_noir_70','concentre_tomate','patate_douce','epinard','chou_frise','abricot','courge_butternut'].forEach(ex);
    if(a('q5','coeliaque')) ['pain_complet','flocons_avoine'].forEach(ex);
    if(a('q5','sein')) ex('tofu');
    if(a('q5','calculs')) note('epinard', 'Calculs rénaux : l’épinard est riche en oxalates, parlez-en à votre médecin.');
    if(a('q7','vege') || a('q7','vegan')){ DATA.forEach(function(f){ if(f.categorie === 'poisson') ex(f.id); }); ex('huitre'); }
    if(a('q7','vegan')) ['oeuf','yaourt_nature','kefir'].forEach(ex);
    if(a('q7','casher')) ex('huitre');
    if(a('q8','rosacee')) ex('the_vert');
    if(a('q8','acne')) ['yaourt_nature','kefir','chocolat_noir_70'].forEach(ex);
    return { x:x, notes:notes }; }

  /* ---- choix : score puis diversification (REGLES, sections 3 et 4) ---- */
  function choisir(ind){ var e = exclus(), mois = new Date().getMonth() + 1, G = { A:3, B:2, C:1 };
    var cand = DATA.filter(function(f){ return !e.x[f.id] && G[f.niveau_preuve_peau]; }).map(function(f){
      var c1 = f.cibles_peau.indexOf(ind.i1) >= 0, c2 = ind.i2 && f.cibles_peau.indexOf(ind.i2) >= 0; if(!c1 && !c2) return null;
      var s = G[f.niveau_preuve_peau] + (c1 ? 2 : 0) + (c2 ? 1 : 0) + ((f.saison || []).indexOf(mois) >= 0 ? .5 : 0) + (f.allegation_UE_autorisee ? .5 : 0);
      if(a('q8','acne') && ind.i1 === 'pores_sebum' && f.categorie !== 'legumineuse' && f.categorie !== 'cereale_complete') s -= 1;
      return { f:f, s:s, pour:c1 ? ind.i1 : ind.i2 }; }).filter(Boolean).sort(function(p, q){ return q.s - p.s; });
    var pris = [], cats = {}, nut = {}, sansEtude = 0;
    cand.forEach(function(c){ if(pris.length >= 4) return; var f = c.f, n1 = (f.nutriments_cles[0] || '').toLowerCase();
      if(cats[f.categorie] || nut[n1]) return; if(SANS_ETUDE.indexOf(f.id) >= 0 && sansEtude) return;
      pris.push(c); cats[f.categorie] = 1; nut[n1] = 1; if(SANS_ETUDE.indexOf(f.id) >= 0) sansEtude++; });
    if(pris.length && !pris.some(function(c){ return VEGETAL.indexOf(c.f.categorie) >= 0; })){ var v = cand.filter(function(c){ return VEGETAL.indexOf(c.f.categorie) >= 0 && pris.indexOf(c) < 0; })[0]; if(v) pris[pris.length - 1] = v; }
    return pris; }

  function fait(f){ var t = (f.ciqual && f.ciqual.teneurs_pour_100g) || {};
    for(var i = 0; i < f.nutriments_cles.length; i++){ var l = f.nutriments_cles[i].toLowerCase();
      for(var j = 0; j < NUTR.length; j++){ var m = NUTR[j][0], k = NUTR[j][1];
        if((l.indexOf(m) >= 0 || (m === 'oméga-3' && l.indexOf('epa') >= 0)) && t[k] > 0){ if(k === 'epa_dha_mg' && !(t[k] > 50)) continue; if(k === 'ala_g' && !(t[k] > .3)) continue;
          var val = t[k] >= 10 ? Math.round(t[k]) : Math.round(t[k]*10)/10; return '100 g apportent environ ' + String(val).replace('.', ',') + ' ' + NUTR[j][2] + ' (table CIQUAL).'; } } }
    return null; }
  function allegation(f){ var t = f.allegation_UE_autorisee; if(!t || /vitamine A|cuivre|pigmentation/i.test(t)) return null; return t; }   // vitamine A vegetale : avis juridique d'abord ; cuivre : jamais pour les taches
  function saison(f){ var s = f.saison || []; if(s.length >= 12 || !s.length) return 'toute l’année'; return 'de ' + MOIS[s[0] - 1] + ' à ' + MOIS[s[s.length - 1] - 1]; }

  /* ---- le style : editorial, titres italiques (d'apres Maree) ---- */
  var CSS = '\
#vy-as-entree{grid-column:1/-1;margin:22px 0 0;border-radius:26px;overflow:hidden;background:#dce7e1!important;color:#183b3e!important;padding:30px 24px 26px;position:relative;cursor:pointer;opacity:1!important;transform:none!important;backdrop-filter:none!important;border:0!important;box-shadow:0 40px 80px -40px #000}\
#vy-as-entree *{-webkit-text-fill-color:currentColor;background-clip:border-box}\
#vy-as-entree .m{font:500 9.5px/1 "Helvetica Neue",Arial,sans-serif;letter-spacing:2.2px;text-transform:uppercase}\
#vy-as-entree h3{font:italic 400 58px/.95 Georgia,serif;letter-spacing:-4px;margin:16px 0 10px;color:#183b3e}\
#vy-as-entree p{font:300 14px/1.6 "Helvetica Neue",Arial,sans-serif;color:#3e5f5d;max-width:320px;margin:0}\
#vy-as-entree button{margin-top:20px;width:100%;min-height:50px;border-radius:30px;border:0;background:#173d3f;color:#e3eee7;font:400 14px "Helvetica Neue",Arial,sans-serif;letter-spacing:.3px}\
#vy-as{position:fixed;inset:0;z-index:2000;overflow:auto;-webkit-overflow-scrolling:touch;font-family:"Helvetica Neue",Arial,sans-serif;opacity:0;transform:translateY(30px);transition:opacity .6s,transform .8s cubic-bezier(.2,.9,.2,1)}\
#vy-as.on{opacity:1;transform:none}\
#vy-as .ec{min-height:100%;padding:calc(30px + env(safe-area-inset-top)) 24px calc(40px + env(safe-area-inset-bottom));max-width:560px;margin:0 auto}\
#vy-as .nuit{background:#06181e;color:#e7f5f2}\
#vy-as .jour{background:#dce7e1;color:#183b3e}\
#vy-as .haut{display:flex;justify-content:space-between;align-items:center;margin-bottom:34px}\
#vy-as .haut b{font-size:24px;font-weight:300;letter-spacing:-1.3px}\
#vy-as .m{font-size:9.5px;letter-spacing:2.2px;text-transform:uppercase}\
#vy-as .fermer{background:none;border:1px solid currentColor;color:inherit;border-radius:30px;padding:9px 14px;font-size:10px;letter-spacing:1.6px;opacity:.75}\
#vy-as h1,#vy-as h2,#vy-as h3{color:inherit!important;-webkit-text-fill-color:currentColor!important;background:none!important;text-shadow:none!important}\
#vy-as h1{font:italic 400 76px/.93 Georgia,serif;letter-spacing:-5px;margin:8px 0 18px}\
#vy-as h2{font:italic 400 52px/.95 Georgia,serif;letter-spacing:-3px;margin:46px 0 16px}\
#vy-as .lead{font-size:14.5px;line-height:1.7;font-weight:300;max-width:360px}\
#vy-as .nuit .lead{color:#bed2d0}\
#vy-as .ruban{display:flex;overflow-x:auto;scrollbar-width:none;margin:28px -24px;border-top:1px solid currentColor;border-bottom:1px solid currentColor;border-color:rgba(24,59,62,.2)}\
#vy-as .nuit .ruban{border-color:rgba(212,247,239,.2)}\
#vy-as .ruban span{flex:1 0 auto;padding:16px 12px;white-space:nowrap;text-align:center;font-size:9.5px;letter-spacing:1.6px;text-transform:uppercase}\
#vy-as .ruban span.on{font-weight:600}\
#vy-as .rit{display:flex;gap:22px;padding:22px 0;border-bottom:1px solid rgba(24,59,62,.2)}\
#vy-as .rit>i{font:italic 28px Georgia,serif;min-width:38px;padding-top:2px}\
#vy-as .rit h3{font-size:22px;font-weight:300;margin:0 0 4px;letter-spacing:-.3px}\
#vy-as .rit .sous{font-size:11.5px;color:#52716f;margin:0 0 10px;letter-spacing:.2px}\
#vy-as .rit p{font-size:13.5px;line-height:1.65;margin:8px 0 0;color:#2d4f4e}\
#vy-as .rit .alleg{font:italic 16px/1.5 Georgia,serif;color:#183b3e;border-left:1px solid #183b3e;padding-left:12px;margin:12px 0}\
#vy-as .rit .preuve{font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#52716f;margin-top:10px}\
#vy-as .rit .prec{font-size:12.5px;color:#8a4b1c;margin-top:8px;line-height:1.55}\
#vy-as details{margin-top:10px}#vy-as summary{font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#52716f;cursor:pointer;list-style:none}\
#vy-as summary::-webkit-details-marker{display:none}\
#vy-as details a{display:block;color:#183b3e;font-size:12.5px;line-height:1.5;margin-top:7px;text-decoration:none;border-bottom:1px solid rgba(24,59,62,.15);padding-bottom:6px}\
#vy-as .q{margin:26px 0}#vy-as .q b{display:block;font-weight:300;font-size:18px;line-height:1.35;margin-bottom:12px;letter-spacing:-.2px}\
#vy-as .q b em{font:italic 16px Georgia,serif;margin-right:10px;opacity:.7}\
#vy-as .q small{font-size:9px;letter-spacing:1.6px;margin-left:8px;opacity:.55}\
#vy-as .puces{display:flex;flex-wrap:wrap;gap:8px}\
#vy-as .puce{font-size:13px;padding:10px 13px;border-radius:30px;border:1px solid rgba(24,59,62,.3);cursor:pointer;user-select:none;-webkit-user-select:none}\
#vy-as .puce.on{background:#173d3f;color:#e3eee7;border-color:#173d3f}\
#vy-as .btn{display:block;width:100%;min-height:52px;border-radius:30px;border:0;margin-top:22px;font-size:14px;letter-spacing:.3px;cursor:pointer}\
#vy-as .nuit .btn{background:#d6eee7;color:#12343b}\
#vy-as .jour .btn{background:#173d3f;color:#e3eee7}\
#vy-as .btn.sec{background:none!important;color:inherit!important;border:1px solid currentColor;opacity:.8}\
#vy-as .fine{font-size:10.5px;line-height:1.7;opacity:.7;margin-top:18px}\
#vy-as .alerte{font-size:13px;line-height:1.55;border:1px solid rgba(138,75,28,.45);color:#6b3a14;border-radius:16px;padding:12px 14px;margin:10px 0}\
#vy-as .prem{margin:34px -24px 0;padding:34px 24px 30px;background:#173d3f;color:#e3eee7}\
#vy-as .prem h2{margin-top:6px}\
#vy-as .prem .rit{border-color:rgba(227,238,231,.18)}\
#vy-as .prem .rit .sous,#vy-as .prem .rit p,#vy-as .prem .rit .preuve,#vy-as .prem summary{color:#b6cdc8}\
#vy-as .prem .rit .alleg{color:#fff;border-color:#e3eee7}\
#vy-as .prem details a{color:#e3eee7}\
#vy-as .prod{display:flex;gap:14px;align-items:center;margin-top:12px;padding:10px;border-radius:16px;background:rgba(255,255,255,.06);text-decoration:none;color:inherit}\
#vy-as .prod img{width:56px;height:70px;object-fit:contain;background:#fff;border-radius:10px;padding:4px;flex:none}\
#vy-as .prod b{display:block;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;opacity:.75}\
#vy-as .prod span{font-size:13.5px;line-height:1.35}\
#vy-as .vague{position:absolute;left:0;right:0;height:200px;pointer-events:none;opacity:.5}\
@media(min-width:700px){#vy-as h1{font-size:110px}#vy-as-entree h3{font-size:72px}}\
@media(prefers-reduced-motion:reduce){#vy-as{transition:none}}';
  function style(){ if(document.getElementById('vy-as-css')) return; var s = document.createElement('style'); s.id = 'vy-as-css'; s.textContent = CSS; document.head.appendChild(s); }

  /* ---- l'entree, dans les resultats du scan ---- */
  function entree(){ var ind = indicesDuScan(); if(!ind) return; style();
    var grid = document.querySelector('.vyvre-v6 .v6grid'); if(!grid) return;
    var e = document.getElementById('vy-as-entree');
    if(!e){ e = document.createElement('section'); e.id = 'vy-as-entree'; grid.appendChild(e); e.addEventListener('click', ouvrir); }
    e.innerHTML = '<div class="m">Nouveau · votre assiette</div><h3>Assiette.</h3><p>Jusqu’à quatre aliments du quotidien, choisis d’après votre lecture (' + esc(INDICES[ind.i1]) + (ind.i2 ? ', ' + esc(INDICES[ind.i2]) : '') + '), avec ce que la science sait vraiment.</p><button type="button">Composer mon assiette</button>';
    if(/[?&]assiette=1/.test(location.search) && !entree.fait){ entree.fait = 1; setTimeout(ouvrir, 900); } }

  /* ---- la feuille plein ecran ---- */
  function feuille(html, cls){ style(); if(!ouvert){ ouvert = document.createElement('div'); ouvert.id = 'vy-as'; ouvert.setAttribute('role', 'dialog'); ouvert.setAttribute('aria-label', 'Votre assiette'); document.body.appendChild(ouvert); requestAnimationFrame(function(){ ouvert.classList.add('on'); }); document.documentElement.style.overflow = 'hidden'; }
    ouvert.innerHTML = '<div class="ec ' + cls + '">' + html + '</div>'; ouvert.scrollTop = 0;
    var f = ouvert.querySelector('.fermer'); if(f) f.onclick = fermer; }
  function fermer(){ if(!ouvert) return; var o = ouvert; ouvert = null; o.classList.remove('on'); document.documentElement.style.overflow = ''; setTimeout(function(){ o.remove(); }, 500); }
  var HAUT = '<div class="haut"><b>vyvre.</b><button class="fermer" type="button">FERMER</button></div>';

  function ouvrir(){ charger().then(function(){ var ind = indicesDuScan(); if(!ind) return;
    feuille(HAUT + '<div class="m">Après votre lecture de peau</div><h1>Assiette.</h1><p class="lead">Ce qui nourrit votre peau. Jusqu’à quatre aliments, choisis d’après vos deux indices les plus faibles et vos réponses.</p>'
      + '<div class="ruban">' + Object.keys(INDICES).filter(function(k){ return k !== 'texture'; }).map(function(k){ return '<span class="' + (k === ind.i1 || k === ind.i2 ? 'on' : '') + '">' + esc(INDICES[k]) + '</span>'; }).join('') + '</div>'
      + '<p class="lead" style="font-size:13px">Les suggestions d’aliments de vyvre sont des informations générales sur l’alimentation. Elles ne constituent ni un diagnostic, ni un traitement, ni un avis médical ou diététique personnalisé, et ne remplacent pas une consultation. Les indices de votre scan sont des mesures optiques de l’image de votre peau : aucun aliment n’a été étudié pour les modifier, et nous ne promettons aucun résultat. Les aliments proposés s’intègrent dans une alimentation variée et équilibrée et un mode de vie sain. Si vous avez une allergie, une maladie, un traitement en cours, si vous êtes enceinte ou allaitez, ou pour un enfant, demandez l’avis de votre médecin ou de votre pharmacien avant de modifier votre alimentation. En cas de réaction allergique grave (gonflement du visage, gêne respiratoire), appelez le 15 ou le 112.</p>'
      + '<button class="btn" type="button" id="vy-as-ok">J’ai compris, continuer</button>', 'nuit');
    document.getElementById('vy-as-ok').onclick = questionnaire; }); }

  function questionnaire(){
    feuille(HAUT + '<div class="m">Dix questions · deux minutes</div><h2 style="margin-top:6px">Pour vous.</h2><p class="lead">Vos réponses concernent votre santé. Elles servent uniquement à écarter les aliments qui ne vous conviennent pas, restent sur cet appareil, et ne sont jamais utilisées pour de la publicité.</p>'
      + QUESTIONS.map(function(q, k){ return '<div class="q"><b><em>' + n2(k) + '</em>' + esc(q.t) + (q.oblig ? '<small>OBLIGATOIRE</small>' : '') + '</b><div class="puces" data-q="' + q.id + '">' + q.o.map(function(o){ return '<span class="puce" data-v="' + o[0] + '">' + esc(o[1]) + '</span>'; }).join('') + '</div></div>'; }).join('')
      + '<div class="alerte" id="vy-as-manque" style="display:none">Répondez aux questions 1 à 6 (« Aucun » compte comme une réponse) : sans elles, nous ne proposons aucun aliment.</div>'
      + '<button class="btn" type="button" id="vy-as-voir">Voir mon assiette</button><button class="btn sec" type="button" id="vy-as-effacer">Effacer mes réponses</button>', 'jour');
    QUESTIONS.forEach(function(q){ var el = ouvert.querySelector('[data-q="' + q.id + '"]');
      var maj = function(){ el.querySelectorAll('.puce').forEach(function(z){ var r = REP[q.id]; z.classList.toggle('on', Array.isArray(r) ? r.indexOf(z.dataset.v) >= 0 : r === z.dataset.v); }); };
      el.addEventListener('click', function(ev){ var c = ev.target.closest('.puce'); if(!c) return; var v = c.dataset.v;
        if(!q.multi) REP[q.id] = v;
        else { var neutre = ['aucune','aucun','non'].indexOf(v) >= 0, s = (REP[q.id] || []).slice(), i = s.indexOf(v);
          if(i >= 0) s.splice(i, 1); else { if(neutre) s = []; else s = s.filter(function(z){ return ['aucune','aucun','non'].indexOf(z) < 0; }); s.push(v); } REP[q.id] = s; }
        garder(); maj(); }); maj(); });
    document.getElementById('vy-as-effacer').onclick = function(){ REP = {}; try { localStorage.removeItem('vy-assiette'); } catch(e){} questionnaire(); };
    document.getElementById('vy-as-voir').onclick = function(){
      var ok = ['q1','q2','q3','q4','q5','q6'].every(function(q){ return REP[q] && (!Array.isArray(REP[q]) || REP[q].length); });
      document.getElementById('vy-as-manque').style.display = ok ? 'none' : 'block'; if(ok) assiette(); }; }

  /* ---- COMBO aliment + creme ou serum (premium) : chaque cote a ses preuves, jamais de synergie promise ---- */
  /* les produits du catalogue qui contiennent chaque actif (actifs_produits.json, genere depuis les listes INCI :
     rang = position de l'actif dans la liste, donc sa concentration probable) */
  var PRODUITS = null;
  function catalogue(){ if(PRODUITS) return Promise.resolve(PRODUITS);
    return fetch(BASE + 'actifs_produits.json').then(function(r){ return r.json(); }).then(function(j){ PRODUITS = j.actifs || {}; return PRODUITS; }).catch(function(){ PRODUITS = {}; return PRODUITS; }); }
  function produitsPour(actif){ var l = (PRODUITS && PRODUITS[actif.id]) || [];
    if(window.vyPrefs && window.vyPrefs.filter){ try { var f = window.vyPrefs.filter(l.map(function(p){ return { id:p.id, brand:p.brand, pays:p.pays, categorie:p.cat, name:p.n }; })); var ok = {}; f.forEach(function(p){ ok[p.id] = 1; }); if(f.length) l = l.filter(function(p){ return ok[p.id]; }); } catch(e){} }
    var serum = l.filter(function(p){ return /serum|sérum/i.test(p.cat || '') ; })[0], creme = l.filter(function(p){ return /creme|crème|soin|hydratant/i.test(p.cat || '') && p !== serum; })[0];
    var out = [serum, creme].filter(Boolean); l.forEach(function(p){ if(out.length < 2 && out.indexOf(p) < 0) out.push(p); }); return out.slice(0, 2); }
  function combos(ind, pris){ if(!COMBOS || !COMBOS.combos) return '';
    var ids = {}; pris.forEach(function(c){ ids[c.f.id] = 1; });
    var ex = exclus().x, enceinte = a('q3','enceinte') || a('q3','allaite') || a('q3','projet');
    var actifs = {}; (COMBOS.actifs || []).forEach(function(z){ actifs[z.id] = z; });
    var lignes = COMBOS.combos.filter(function(c){ return (c.indice === ind.i1 || c.indice === ind.i2) && !ex[c.aliment_id] && actifs[c.actif_id] && !(enceinte && actifs[c.actif_id].grossesse === 'eviter'); })
      .sort(function(p, q){ return (ids[q.aliment_id] ? 1 : 0) - (ids[p.aliment_id] ? 1 : 0) || (p.ordre || 9) - (q.ordre || 9); }).slice(0, 3);
    if(!lignes.length) return '';
    return '<div class="prem"><div class="m">Premium · combo aliment + crème et sérum</div><h2>Combo.</h2><p class="lead" style="color:#b6cdc8">Pour la même cible, un aliment de l’intérieur et un actif de soin de l’extérieur. Chacun a ses propres preuves ; aucune étude n’a testé leur association, nous ne promettons donc aucun effet combiné.</p>'
      + lignes.map(function(c, k){ var f = DATA.filter(function(z){ return z.id === c.aliment_id; })[0], ac = actifs[c.actif_id]; if(!f) return '';
        var prods = produitsPour(ac);
        return '<div class="rit"><i>' + n2(k) + '</i><div><h3>' + esc(f.nom) + ' + ' + esc(ac.nom) + '</h3><div class="sous">' + esc(INDICES[c.indice] || c.indice) + ' · aliment : preuve ' + esc(c.grade_aliment || f.niveau_preuve_peau) + ' · actif : preuve ' + esc(c.grade_actif || ac.grade) + '</div>'
          + '<p>' + esc(c.pourquoi) + '</p><p style="opacity:.8">' + esc(c.phrase_honnete || '') + '</p>'
          + (ac.moment ? '<div class="preuve">' + (ac.moment === 'soir' ? 'Le soir' : ac.moment === 'matin' ? 'Le matin' : 'Matin ou soir') + (ac.concentration_efficace ? ' · ' + esc(ac.concentration_efficace) : '') + '</div>' : '')
          + (ac.precautions || []).slice(0, 2).map(function(t){ return '<div class="prec" style="color:#f3c9a6">' + esc(t) + '</div>'; }).join('')
          + (ac.ce_qu_on_peut_dire ? '<div class="alleg">' + esc(ac.ce_qu_on_peut_dire) + '</div>' : '')
          + (ac.exige_spf ? '<div class="prec" style="color:#f3c9a6">Avec cet actif, une protection solaire chaque matin est indispensable.</div>' : '')
          + ((a('q3','enceinte') || a('q3','allaite') || a('q3','projet')) && ac.grossesse === 'avis' ? '<div class="prec" style="color:#f3c9a6">Grossesse ou allaitement : demandez l’avis de votre médecin ou de votre pharmacien avant cet actif.</div>' : '')
          + (prods.length ? '<div class="preuve" style="margin-top:16px">En complément, dans notre catalogue</div>' : '')
          + prods.map(function(p){ var par = /\(([^)]+)\)/.exec(ac.nom || ''), nom = (ac.id === 'humectants' && par ? par[1] : (ac.nom || '').split(' (')[0]).toLowerCase(), CATN = { serum:'Sérum', creme:'Crème', 'solaire-visage':'Solaire visage' }; return '<a class="prod" href="' + esc(p.url || '#') + '" target="_blank" rel="noopener"><img src="' + esc(p.img || '') + '" alt="" onerror="this.style.visibility=\'hidden\'"><span><b>' + esc(p.b || '') + (p.cat ? ' · ' + esc(CATN[p.cat] || p.cat) : '') + '</b>' + esc(p.n || '') + '<br><small style="opacity:.7">' + (ac.id === 'protection_solaire' ? 'Protection solaire du visage' : 'Contient ' + esc(nom) + (p.pos <= 4 ? ', parmi les premiers ingrédients' : '')) + '</small></span></a>'; }).join('')
          + ((ac.etudes || []).length ? '<details><summary>Les études de l’actif (' + ac.etudes.length + ')</summary>' + ac.etudes.map(function(e){ return '<a href="' + esc(e.lien) + '" target="_blank" rel="noopener">' + esc(e.ref) + ' ↗</a>'; }).join('') + '</details>' : '')
          + '</div></div>'; }).join('')
      + '<p class="fine" style="color:#b6cdc8">Soins cosmétiques : ils agissent sur l’aspect de la peau, pas sur une maladie. Testez chaque nouveau soin sur une petite zone. Protection solaire chaque matin, surtout avec un rétinoïde ou un acide exfoliant.</p></div>'; }

  function assiette(){ var ind = indicesDuScan(); if(!ind) return; var pris = choisir(ind), e = exclus(), une = false;
    var titres = ['Rien.','Un aliment.','Deux aliments.','Trois aliments.','Quatre aliments.'];
    var al = [];
    if(a('q3','enceinte') || a('q3','allaite') || a('q4','avk') || a('q4','quotidien') || a('q4','thyroide') || a('q5','renale') || a('q5','thyroide')) al.push('Tout changement alimentaire important se discute avec votre médecin ou votre pharmacien.');
    if(a('q4','quotidien')) al.push('Certains aliments interagissent avec des médicaments (le pamplemousse, par exemple) : parlez-en à votre pharmacien.');
    if(a('q8','acne')) al.push('Si votre acné est douloureuse, laisse des cicatrices ou dure : consultez un médecin ou un dermatologue.');
    if(a('q8','eczema')) al.push('N’éliminez pas d’aliments sans avis médical, surtout chez l’enfant : cela peut créer une allergie.');
    if(a('q8','rosacee')) al.push('Observez vos propres déclencheurs ; les plus cités sont le soleil, le stress, la chaleur, l’alcool, les épices et les boissons chaudes.');
    if((REP.q1 || []).some(function(v){ return v !== 'aucune'; })) al.push('Nous ne remplaçons pas votre allergologue.');
    var h = HAUT + '<div class="m">Votre assiette · d’après votre lecture</div><h1>' + titres[pris.length] + '</h1>'
      + '<p class="lead">' + (pris.length ? esc(PHRASE[ind.i1]) : 'Vos réponses écartent tous les aliments liés à vos indices. Nous préférons ne rien proposer plutôt qu’un aliment sans rapport.') + '</p>'
      + '<div class="ruban">' + pris.map(function(c){ return '<span class="on">' + esc(c.f.nom.split(' (')[0]) + '</span>'; }).join('') + '</div>'
      + al.map(function(t){ return '<div class="alerte">' + esc(t) + '</div>'; }).join('')
      + pris.map(function(c, k){ var f = c.f, a2 = allegation(f), fa = fait(f); if(a2) une = true;
          var pr = (e.notes[f.id] || []).concat((f.precautions || []).filter(function(t){ return !/allégation|afficher|néphrolog|juriste/i.test(t); })).slice(0, 3);
          return '<div class="rit"><i>' + n2(k) + '</i><div><h3>' + esc(f.nom) + '</h3><div class="sous">Pour : ' + esc(INDICES[c.pour]) + ' · ' + esc(f.portion_type) + ' · ' + saison(f) + '</div>'
            + '<p>' + esc(f.mecanisme_simple) + '</p>' + (a2 ? '<div class="alleg">' + esc(a2) + '</div>' : '') + (fa ? '<p>' + esc(fa) + '</p>' : '')
            + '<div class="preuve">Preuve ' + f.niveau_preuve_peau + ' · ' + PREUVE[f.niveau_preuve_peau] + '</div>'
            + (f.allergenes_UE.length ? '<div class="prec">Allergènes : ' + f.allergenes_UE.map(function(z){ return AL_NOM[z] || z; }).join(', ') + '.</div>' : '')
            + pr.map(function(t){ return '<div class="prec">' + esc(t) + '</div>'; }).join('')
            + (f.etudes.length ? '<details><summary>Les études (' + f.etudes.length + ')</summary>' + f.etudes.map(function(s){ return '<a href="' + esc(s.lien) + '" target="_blank" rel="noopener">' + esc(s.ref) + ' ↗</a>'; }).join('') + '</details>' : '')
            + '</div></div>'; }).join('')
      + (une ? '<p class="fine">À intégrer dans une alimentation variée et équilibrée et un mode de vie sain.</p>' : '')
      + rythme()
      + '<div id="vy-as-combo"></div>'
      + recette(pris, e.x)
      + '<button class="btn" type="button" id="vy-as-rep">Modifier mes réponses</button>'
      + '<p class="fine">Information générale, pas un avis médical. Composition : table CIQUAL 2020 (ANSES). Allégations : registre de l’Union européenne (Règlement 1924/2006).</p>';
    feuille(h, 'jour'); document.getElementById('vy-as-rep').onclick = questionnaire;
    catalogue().then(function(){ var z = document.getElementById('vy-as-combo'); if(z) z.innerHTML = combos(ind, pris); }); }

  function rythme(){ if(a('q6','moins18')) return '<h2>Rythme.</h2><div class="rit"><i>01</i><div><h3>Bouger</h3><p>Une heure par jour en moyenne (OMS 2020). Pour l’acné ou le poids, parlez-en à votre médecin traitant.</p></div></div>';
    var l = [];
    l.push(['L’assiette', 'Cinq fruits et légumes par jour, des légumes secs au moins deux fois par semaine, un féculent complet par jour, une petite poignée de fruits à coque non salés, du poisson deux fois par semaine dont un gras.', 'Repères PNNS 2019, Santé publique France.']);
    l.push(['Limiter', 'Charcuterie : 150 g par semaine au maximum. Viande hors volaille : 500 g par semaine au maximum. Moins d’aliments ultra-transformés. L’eau comme boisson.', '']);
    l.push(['Dormir', a('q9','moins6') || a('q9','6_7') ? 'Visez au moins sept heures par nuit.' : a('q9','plus9') ? 'Un sommeil très long et régulier peut justifier d’en parler à votre médecin.' : 'Au moins sept heures par nuit.', a('q9','irregulier') ? 'Priorité à la régularité : même heure de lever, lumière du jour le matin. Travail de nuit : pas de fenêtre alimentaire sans avis médical.' : 'Des horaires réguliers, week-end compris.']);
    l.push(['Bouger', a('q10','moins4000') ? 'Ajoutez 1 000 pas par jour, pour viser environ 7 000.' : 'Environ 7 000 pas par jour.', '150 à 300 minutes d’activité modérée par semaine et deux séances de renforcement (OMS).' + (a('q5','cardiaque') || a('q5','diabete') ? ' Avec votre situation de santé : demandez d’abord l’avis de votre médecin.' : '')]);
    l.push(['L’alcool', 'Moins, c’est mieux : il n’existe pas de consommation sans risque (OMS 2023).', 'Repère français : deux verres par jour au maximum, et pas tous les jours.']);
    l.push(['Le tabac', 'Le tabac et le soleil sont les deux premiers facteurs de vieillissement visible de la peau.', 'Pour arrêter : Tabac Info Service, 39 89.']);
    if(a('q6','65') && !a('q5','renale')) l.push(['Les protéines', 'Après 65 ans, des protéines à chaque repas (œufs, poisson, légumineuses) aident à garder ses muscles.', 'Quantité à valider avec votre médecin.']);
    return '<h2>Rythme.</h2><p class="lead">Ce que les grandes études montrent le plus solidement pour vivre longtemps en bonne santé, adapté à vos réponses.</p>'
      + l.map(function(z, k){ return '<div class="rit"><i>' + n2(k) + '</i><div><h3>' + z[0] + '</h3><p>' + esc(z[1]) + '</p>' + (z[2] ? '<div class="preuve">' + esc(z[2]) + '</div>' : '') + '</div></div>'; }).join(''); }

  function recette(pris, x){ var ids = pris.map(function(c){ return c.f.id; });
    var ok = RECETTES.filter(function(r){ return r.ing.every(function(i){ return !x[i]; }) && !r.al.some(function(z){ return a('q1', z); }); })
      .map(function(r){ return { r:r, n:r.ing.filter(function(i){ return ids.indexOf(i) >= 0; }).length }; }).sort(function(p, q){ return q.n - p.n; })[0];
    if(!ok) return '';
    return '<h2>Recette.</h2><div class="rit"><i>01</i><div><h3>' + esc(ok.r.n) + '</h3><p>' + esc(ok.r.t) + '</p><div class="prec" style="color:#52716f">Allergènes : ' + (ok.r.al.length ? ok.r.al.map(function(z){ return AL_NOM[z]; }).join(', ') : 'aucun des 14 allergènes réglementés') + '.</div></div></div>'; }

  window.vyAliment = { entree:entree, ouvrir:ouvrir };
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') fermer(); });
})();
