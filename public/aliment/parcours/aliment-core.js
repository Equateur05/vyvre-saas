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
  var BASE = window.PARC_DATA_BASE || '/scan/aliment/';
  var INDICES = { rougeurs:'Rougeurs', eclat:'Éclat', pores_sebum:'Pores et sébum', uniformite:'Uniformité', rides_fermete:'Rides et fermeté', hydratation:'Hydratation', texture:'Texture' };
  var PHRASE = {
    hydratation:'L’hydratation de surface dépend d’abord des soins et de l’environnement. L’eau reste la seule boisson recommandée par le PNNS.',
    eclat:'Des fruits et légumes colorés, variés, chaque jour.',
    rougeurs:'Contre les rougeurs liées au soleil, la protection solaire reste la mesure de référence.',
    pores_sebum:'Féculents complets et légumineuses composent une alimentation à faible charge glycémique.',
    uniformite:'Contre les taches, la protection solaire reste la première mesure.',
    rides_fermete:'Le tabac et le soleil sont les deux premiers facteurs de rides.',
    texture:'Sur le grain de peau, les données restent limitées.' };
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

  var DATA = null, COMBOS = null, RECS = [], TEND = [], CREDITS = {}, REP = {}, ouvert = null;
  var TEINTE = { legume:'#5f8f5b', fruit:'#c8563f', poisson:'#4f7896', fruit_de_mer:'#6b8fa8', legumineuse:'#b58a3c', cereale_complete:'#c9a45c', feculent:'#c9a45c', graine:'#a99270', fruit_a_coque:'#9b7650', fruit_sec:'#8a5a3c', cacao:'#5b3a29', boisson:'#6aa39b', matiere_grasse:'#9aa04a', produit_laitier_fermente:'#d7cdb8', produit_laitier:'#d7cdb8', fromage:'#e0c98a', oeuf:'#e6c27a', epice_herbe:'#7a9a55', viande:'#a3473f', volaille:'#c9956b', condiment:'#8d7a5c', sucre:'#caa46a' };
  /* 30/09 : questionnaire v2 (_nutrition/QUESTIONNAIRE_V2.md). Une seule question, « Quelque chose a eviter ? ».
     Les reponses vivent en memoire ; elles ne sont gardees sur l'appareil que si la personne allume « Garder ». */
  var CLE = 'vyvre-assiette-v2', ACCORD = 'c2-2026-10', DEFAUT_EXCLUS = ['pamplemousse','huitre','tofu','noix_bresil'];
  var PRUDENT = ['tomate','carotte','myrtille','orange','poivron_rouge','huile_olive','eau','fraise','cassis'];
  var SANTE = null, MODE = null, GARDER = false, PASPOUR = [], AFFINE = { saison:true, usage:null, cuisines:[], budget:null, bio:false, cuis:false };   // MODE : 'normal' | 'prudent' | 'mineur'

  function lireMemoire(){ try { var m = JSON.parse(localStorage.getItem(CLE) || 'null'); if(!m) return null;
      var s0 = m.sante || {}, autre = (s0.allergies || []).length || s0.grossesse || s0.anticoagulant || s0.reins || s0.regime;
      if(m.schema !== 2 || !m.accord || m.accord.texte !== ACCORD || !m.expire || new Date(m.expire) < new Date() || (s0.rien && autre)) { localStorage.removeItem(CLE); return null; }
      return m; } catch(e){ try { localStorage.removeItem(CLE); } catch(e2){} return null; } }
  function ecrireMemoire(){ if(!GARDER || MODE !== 'normal') return; var d = new Date(), f = new Date(); f.setMonth(f.getMonth() + 6);
    try { localStorage.setItem(CLE, JSON.stringify({ schema:2, accord:{ texte:ACCORD, le:d.toISOString() }, majeur:true, le:d.toISOString().slice(0, 10), expire:f.toISOString().slice(0, 10), sante:SANTE, rythme:{ sommeil:REP.q9s || null, decale:!!REP.q9d, pas:REP.q10p || null }, paspour:PASPOUR })); } catch(e){} }
  function effacer(){ try { localStorage.removeItem(CLE); localStorage.removeItem('vyvre-assiette-prefs-v1'); } catch(e){} }
  /* traduit les reponses v2 vers les codes des regles (exclus(), rythme()) */
  function versRep(ind){ var s0 = SANTE || {}, al = (s0.allergies || []).filter(function(z){ return z !== 'latex' && z !== 'bouleau'; }), r = { q9s:REP.q9s, q9d:REP.q9d, q10p:REP.q10p };
    r.q1 = al.length ? al : ['aucune'];
    r.q2 = (s0.allergies || []).filter(function(z){ return z === 'latex' || z === 'bouleau'; }); if(!r.q2.length) r.q2 = ['non'];
    r.q3 = s0.grossesse ? 'enceinte' : 'non'; r.q4 = s0.anticoagulant ? ['avk'] : ['aucun'];
    r.q5 = []; if(s0.reins) r.q5.push('renale', 'calculs'); if(al.indexOf('cereales_gluten') >= 0) r.q5.push('coeliaque'); if(!r.q5.length) r.q5 = ['aucune'];
    r.q6 = MODE === 'mineur' ? 'moins18' : '18_64'; r.q7 = s0.regime === 'vegan' ? 'vegan' : s0.regime === 'vegetarien' ? 'vege' : 'omni';
    r.q8 = []; if(ind && (ind.i1 === 'pores_sebum' || ind.i2 === 'pores_sebum')) r.q8.push('acne'); if(ind && (ind.i1 === 'rougeurs' || ind.i2 === 'rougeurs')) r.q8.push('rosacee');
    r.q9 = [REP.q9s === 'moins7' ? '6_7' : REP.q9s === 'plus9' ? 'plus9' : REP.q9s === '7_9' ? '7_9' : null, REP.q9d ? 'irregulier' : null].filter(Boolean);
    r.q10 = REP.q10p ? [REP.q10p] : []; REP = r; }
  function charger(){ if(DATA) return Promise.resolve();
    return fetch(BASE + 'aliments_v4.json?v=3').then(function(r){ return r.json(); }).then(function(j){ DATA = j.aliments; })
      .then(function(){ return fetch(BASE + 'recettes.json?v=2').then(function(r){ return r.json(); }).then(function(j){ RECS = j.recettes || []; }).catch(function(){ RECS = []; }); })
      .then(function(){ return fetch(BASE + 'tendances.json?v=1').then(function(r){ return r.json(); }).then(function(j){ TEND = j.tendances || []; }).catch(function(){ TEND = []; }); })
      .then(function(){ return fetch(BASE + 'photos/credits.json?v=2').then(function(r){ return r.json(); }).then(function(j){ CREDITS = j || {}; }).catch(function(){ CREDITS = {}; }); })
      .then(function(){ return fetch(BASE + 'combos.json').then(function(r){ return r.ok ? r.json() : null; }).then(function(j){ COMBOS = j; }).catch(function(){}); }); }
  function esc(t){ return String(t == null ? '' : t).replace(/([A-Za-zÀ-ÿ])'([A-Za-zÀ-ÿ])/g, '$1’$2').replace(/[&<>"]/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]; }); }
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
    /* 30/09 (parcours aliment) : les besoins choisis par la personne passent devant ; la lecture complete dans son ordre */
    /* 04/10 : « yeux » n'est pas un besoin alimentaire (aucune allegation autorisee) : il ne choisit aucun aliment */
    var dit = ((AFFINE && AFFINE.besoins) || []).filter(function(k){ return k !== 'yeux'; }); if(dit.length) t = dit.concat(t.filter(function(k){ return dit.indexOf(k) < 0; }));
    var note = function(k){ return sev[k] == null ? null : Math.max(0, Math.min(100, Math.round(100 - sev[k]))); };
    return t.length ? { i1:t[0], i2:t[1] || null, n1:note(t[0]), n2:t[1] ? note(t[1]) : null, suite:t.slice(2) } : null; }

  /* ---- exclusions (QUESTIONNAIRE.md) ---- */
  /* assiette prudente : la meme regle que la liste ecrite a la main, appliquee a toute la base :
     aucun des 14 allergenes, aucune precaution ni reaction croisee connue, pas riche en potassium ni en vitamine K,
     ni poisson, ni viande, ni boisson */
  function prudentOk(f){ var t = (f.ciqual && f.ciqual.teneurs_pour_100g) || {};
    /* 01/10 (audit) : la liste validee de QUESTIONNAIRE_V2, et elle seule (avant : etendue a 13 aliments) */
    return PRUDENT.indexOf(f.id) >= 0; }
  function exclus(){ var x = {}, notes = {}; var ex = function(i){ x[i] = 1; }, note = function(i, t){ (notes[i] = notes[i] || []).push(t); };
    DEFAUT_EXCLUS.forEach(ex); PASPOUR.forEach(ex); ((SANTE && SANTE.autres_aliments) || []).forEach(ex);
    var ten = function(f, k){ return ((f.ciqual && f.ciqual.teneurs_pour_100g) || {})[k] || 0; };
    DATA.forEach(function(f){ if(f.categorie === 'algue' || f.categorie === 'soja') ex(f.id); });   // pour tous : iode (algues) ; soja (question cancer du sein retiree)
    if(a('q5','renale')) DATA.forEach(function(f){ if(ten(f, 'potassium_mg') > 300 || ['graine','fruit_a_coque','legumineuse','fruit_sec'].indexOf(f.categorie) >= 0) ex(f.id); });
    if(a('q4','avk')) DATA.forEach(function(f){ if(ten(f, 'vitamine_k1_ug') > 80) ex(f.id); });
    if(a('q7','vege') || a('q7','vegan')) DATA.forEach(function(f){ if(['poisson','fruit_de_mer','viande','volaille'].indexOf(f.categorie) >= 0) ex(f.id); });
    if(a('q7','vegan')) DATA.forEach(function(f){ if(['oeuf','produit_laitier','produit_laitier_fermente','fromage'].indexOf(f.categorie) >= 0 || /miel/.test(f.id)) ex(f.id); });
    if(a('q3','enceinte')) ['parmesan','comte','brebis_pyrenees'].forEach(ex);
    if(a('q3','enceinte') || a('q3','allaite')){ DATA.forEach(function(f){ if((f.allergenes_UE || []).indexOf('soja') >= 0) ex(f.id); }); ex('sauce_soja'); ['dorade','bar','lotte','thon_naturel'].forEach(function(i){ note(i, 'Grossesse et allaitement : poisson prédateur, au plus 150 g par semaine (ANSES).'); }); }
    if(MODE !== 'normal') DATA.forEach(function(f){ if(!prudentOk(f)) ex(f.id); });
    if(MODE !== 'normal'){ ['tomate','poivron_rouge'].forEach(function(i){ note(i, 'Allergie au latex : réaction possible (syndrome latex-fruits).'); }); note('carotte', 'Pollen de bouleau : réaction croisée possible ; de préférence cuite.'); }
    DATA.forEach(function(f){ (f.allergenes_UE || []).forEach(function(al){ if(a('q1', al)) ex(f.id); }); });
    if(a('q1','sulfites')) ex('abricot');
    /* 01/10 (audit) : pignon (allergies decrites) et mangue (reaction croisee cajou, pistache) */
    if(a('q1','fruits_a_coque')) ['pignon','mangue'].forEach(ex);
    if(a('q2','latex')){ ['avocat','kiwi','banane','chataigne','papaye'].forEach(ex); ['tomate','concentre_tomate','poivron_rouge'].forEach(function(i){ note(i, 'Allergie au latex : réaction possible (syndrome latex-fruits).'); }); }
    if(a('q2','bouleau')) ['noisette','amande','carotte','kiwi','abricot','tofu'].forEach(function(i){ note(i, 'Pollen de bouleau : réaction croisée possible ; préférez-le cuit quand c’est possible.'); });
    if(a('q3','enceinte') || a('q3','allaite')){ ['tofu','huitre','the_vert'].forEach(ex); note('saumon', 'Enceinte ou allaitante : uniquement cuit, pas fumé.'); }
    if(a('q4','avk')) ['epinard','chou_frise','brocoli','mache'].forEach(ex);
    if(a('q4','quotidien')) ex('pamplemousse');
    if(a('q4','thyroide') || a('q5','thyroide') || a('q5','cardiaque') || a('q4','zinc_iode')) ex('huitre');
    if(a('q4','selenium') || a('q6','moins18')) ex('noix_bresil');
    if(a('q5','renale')) ['graines_courge','graines_tournesol','graines_lin','graines_chia','avocat','noix','amande','noisette','noix_bresil','lentille','pois_chiche','haricot_rouge','cacao_poudre','chocolat_noir_70','concentre_tomate','patate_douce','epinard','chou_frise','abricot','courge_butternut'].forEach(ex);
    if(a('q5','coeliaque')) ['pain_complet','flocons_avoine'].forEach(ex);
    if(a('q5','sein')) ex('tofu');
    if(a('q5','calculs')) ex('epinard');
    if(a('q7','vege') || a('q7','vegan')){ DATA.forEach(function(f){ if(f.categorie === 'poisson') ex(f.id); }); ex('huitre'); }
    if(a('q7','vegan')) ['oeuf','yaourt_nature','kefir'].forEach(ex);
    if(a('q7','casher')) ex('huitre');
    if(a('q8','rosacee')) note('the_vert', 'Avec des rougeurs : à boire tiède ou froid, jamais chaud.');
    if(a('q8','acne')) ['yaourt_nature','kefir','chocolat_noir_70'].forEach(ex);
    return { x:x, notes:notes }; }

  /* ---- choix : score puis diversification (REGLES, sections 3 et 4) ---- */
  /* les preferences : additionnees puis plafonnees entre -2 et +2, jamais avant la securite (FILTRES.md) */
  function bonus(f, mois){ var b = 0, cu = f.cuisines || [], sa = f.saison || [];
    if(AFFINE.cuisines.length){ if(cu.some(function(c){ return AFFINE.cuisines.indexOf(c) >= 0; })) b += 1; else if(cu.indexOf('universelle') >= 0) b += .5; }
    if(AFFINE.budget === 'serre') b += ({ 1:1, 2:0, 3:-1.5 })[f.prix_niveau] || 0; else if(AFFINE.budget === 'moyen') b += ({ 1:.5, 2:0, 3:-.5 })[f.prix_niveau] || 0;
    if(AFFINE.bio && f.bio_disponible) b += .5;
    if(AFFINE.saison){ if(sa.length && sa.length < 12) b += sa.indexOf(mois) >= 0 ? 1 : -1; if(f.origine_possible_france) b += .5; }
    if(AFFINE.usage === 'quotidien') b += f.usage === 'quotidien' ? .5 : -1; else if(AFFINE.usage === 'decouverte' && f.usage === 'rare') b += .5; else if(AFFINE.usage === 'tendance' && f.tendance) b += 1;
    return Math.max(-2, Math.min(2, b)); }
  var DECLENCHEURS = /tomate|piment|cannelle|chocolat|cacao|orange|citron|pamplemousse|mandarine|cl[ée]mentine/i;
  function choisir(ind){ var e = exclus(), mois = new Date().getMonth() + 1, G = { A:3, B:2, C:1 };
    var cand = DATA.filter(function(f){ return !e.x[f.id] && G[f.niveau_preuve_peau] && (f.etudes || []).length; })   /* 01/10 (audit) : au moins une etude */.map(function(f){
      var c1 = f.cibles_peau.indexOf(ind.i1) >= 0, c2 = ind.i2 && f.cibles_peau.indexOf(ind.i2) >= 0, c3 = !c1 && !c2 ? (ind.suite || []).filter(function(k){ return f.cibles_peau.indexOf(k) >= 0; })[0] : null; if(!c1 && !c2 && !c3) return null;
      var s = G[f.niveau_preuve_peau] + (c1 ? 2 : 0) + (c2 ? 1 : 0) + (!AFFINE.saison && (f.saison || []).indexOf(mois) >= 0 ? .5 : 0) + (f.allegation_UE_autorisee ? .5 : 0) + bonus(f, mois);
      if(a('q8','acne') && ind.i1 === 'pores_sebum' && f.categorie !== 'legumineuse' && f.categorie !== 'cereale_complete') s -= 1;
      if(c3) s -= 1.5;   // un point plus loin dans la lecture : seulement pour completer l'assiette
      /* 07/10 (audit Charles) : peau qui rougit, les aliments souvent cites comme declencheurs passent derriere (jamais exclus) */
      if((ind.i1 === 'rougeurs' || ind.i2 === 'rougeurs') && DECLENCHEURS.test(f.nom || '')) s -= 1.5;
      return { f:f, s:s, pour:c1 ? ind.i1 : c2 ? ind.i2 : c3 }; }).filter(Boolean).sort(function(p, q){ return q.s - p.s; });
    /* 30/09 (parcours aliment) : « Dans votre assiette ? ». S'il y a au moins quatre aliments surs dans les familles choisies,
       on ne prend qu'eux (une famille peut alors revenir) ; sinon elles passent seulement devant. La securite ne bouge pas. */
    var FAM = { fruits:['fruit','fruit_sec'], legumes:['legume'], epices:['epice_herbe'], boissons:['boisson'], cereales:['cereale_complete','feculent'], legumineuses:['legumineuse','soja'], mer:['poisson','fruit_de_mer'], noix:['fruit_a_coque','graine'] };
    var ty = [].concat.apply([], ((AFFINE && AFFINE.types) || []).map(function(k){ return FAM[k] || []; })), large = false;
    var tous = cand.slice();
    if(ty.length){ var dans = cand.filter(function(c){ return ty.indexOf(c.f.categorie) >= 0; });
      if(dans.length >= 4){ cand = dans; large = true; } else { cand.forEach(function(c){ if(ty.indexOf(c.f.categorie) >= 0) c.s += 3; }); cand.sort(function(p, q){ return q.s - p.s; }); } }
    var parFam = large ? Math.max(1, Math.ceil(4 / new Set(cand.map(function(c){ return c.f.categorie; })).size)) : 1;
    var pris = [], cats = {}, nut = {}, sansEtude = 0, rares = 0;
    cand.forEach(function(c){ if(pris.length >= 4) return; var f = c.f, n1 = (f.nutriments_cles[0] || '').toLowerCase();
      if((cats[f.categorie] || 0) >= parFam || nut[n1]) return; if(SANS_ETUDE.indexOf(f.id) >= 0 && sansEtude) return;
      if((!AFFINE.usage || AFFINE.usage === 'quotidien') && f.usage === 'rare' && rares) return; if(f.usage === 'rare') rares++;
      pris.push(c); cats[f.categorie] = (cats[f.categorie] || 0) + 1; nut[n1] = 1; if(SANS_ETUDE.indexOf(f.id) >= 0) sansEtude++; });
    /* second passage, seulement s'il reste des places : une famille peut revenir une fois, jamais le meme nutriment */
    if(pris.length < 4){ var fois = {}; pris.forEach(function(c){ fois[c.f.categorie] = (fois[c.f.categorie] || 0) + 1; });
      cand.forEach(function(c){ if(pris.length >= 4 || pris.indexOf(c) >= 0) return; var f = c.f, n1 = (f.nutriments_cles[0] || '').toLowerCase();
        if((fois[f.categorie] || 0) >= Math.max(2, parFam) || nut[n1]) return; pris.push(c); fois[f.categorie] = (fois[f.categorie] || 0) + 1; nut[n1] = 1; }); }
    /* 30/09 (test de Charles) : un besoin coche doit toujours avoir au moins un aliment etudie pour lui, meme hors des familles
       choisies (ex. « hydratation » + « fruits » : aucun fruit n'est etudie pour l'hydratation). Il remplace le dernier choix. */
    var ditB = ((AFFINE && AFFINE.besoins) || []).filter(function(k){ return k !== 'yeux'; }).slice(0, 2);
    ditB.forEach(function(k){ if(pris.some(function(c){ return c.pour === k; })) return;
      var m = tous.filter(function(c){ return c.pour === k && pris.indexOf(c) < 0 && !pris.some(function(p){ return p.f.id === c.f.id; }); })[0]; if(!m) return;
      if(pris.length < 4) pris.push(m); else { var j = pris.length - 1; while(j > 0 && ditB.indexOf(pris[j].pour) >= 0) j--; pris[j] = m; } });
    /* familles choisies par la personne : si l'assiette n'est pas pleine, un nutriment peut revenir une fois */
    if(large && pris.length < 4) cand.forEach(function(c){ if(pris.length < 4 && pris.indexOf(c) < 0) pris.push(c); });
    if(!large && pris.length && !pris.some(function(c){ return VEGETAL.indexOf(c.f.categorie) >= 0; })){ var v = cand.filter(function(c){ return VEGETAL.indexOf(c.f.categorie) >= 0 && pris.indexOf(c) < 0; })[0]; if(v) pris[pris.length - 1] = v; }
    return pris; }

  function fait(f){ var t = (f.ciqual && f.ciqual.teneurs_pour_100g) || {};
    for(var i = 0; i < f.nutriments_cles.length; i++){ var l = f.nutriments_cles[i].toLowerCase();
      /* 07/10 : si le compose qui justifie le choix n'est pas dans la table CIQUAL (lycopene, polyphenols...), on le nomme
         au lieu de citer un nutriment sans rapport avec le besoin (la tomate « pour les rougeurs » par sa vitamine E) */
      if(i === 0 && /lycop|polyph|acide ol[ée]ique|flavono|cat[ée]chine|anthocyan|curcum|sulforaphane/.test(l) && !NUTR.some(function(n){ return l.indexOf(n[0]) >= 0; })) return 'Composé étudié : ' + f.nutriments_cles[0].replace(/\s*\(.*\)\s*$/, '') + ' (voir les études ci-dessous).';
      for(var j = 0; j < NUTR.length; j++){ var m = NUTR[j][0], k = NUTR[j][1];
        if((l.indexOf(m) >= 0 || (m === 'oméga-3' && l.indexOf('epa') >= 0)) && t[k] > 0){ if(k === 'epa_dha_mg' && !(t[k] > 50)) continue; if(k === 'ala_g' && !(t[k] > .3)) continue;
          var val = t[k] >= 10 ? Math.round(t[k]) : Math.round(t[k]*10)/10; return '100 g apportent environ ' + String(val).replace('.', ',') + ' ' + NUTR[j][2] + ' (table CIQUAL).'; } } }
    return null; }
  var VNR = [['vitamine_c_mg', 80, 'mg', 'de vitamine C'], ['vitamine_e_mg', 12, 'mg', 'de vitamine E'], ['vitamine_a_ug_ER_calcule', 800, 'µg', 'de vitamine A'], ['zinc_mg', 10, 'mg', 'de zinc'], ['selenium_ug', 55, 'µg', 'de sélénium'], ['iode_ug', 150, 'µg', 'd’iode'], ['niacine_mg', 16, 'mg', 'de vitamine B3'], ['riboflavine_mg', 1.4, 'mg', 'de vitamine B2'], ['potassium_mg', 2000, 'mg', 'de potassium'], ['vitamine_k1_ug', 75, 'µg', 'de vitamine K'], ['cuivre_mg', 1, 'mg', 'de cuivre']];
  function grammes(f){ var m = /(\d+(?:[.,]\d+)?)\s*(g|ml)\b/.exec(f.portion_type || ''); return m ? parseFloat(m[1].replace(',', '.')) : null; }
  function apports(f){ var g = grammes(f), t = (f.ciqual && f.ciqual.teneurs_pour_100g) || {}; if(!g) return [];
    var out = VNR.map(function(v){ var q = (t[v[0]] || 0)*g/100, pc = Math.round(q/v[1]*100); return { pc:pc, txt:(q >= 10 ? Math.round(q) : Math.round(q*10)/10).toString().replace('.', ',') + ' ' + v[2] + ' ' + v[3] + ' (' + pc + ' % des apports de référence)' }; })
      .filter(function(x){ return x.pc >= 10; }).sort(function(p, q){ return q.pc - p.pc; }).slice(0, 3);
    if(t.fibres_g && t.fibres_g*g/100 >= 2) out.push({ pc:0, txt:String(Math.round(t.fibres_g*g/10)/10).replace('.', ',') + ' g de fibres (repère : 30 g par jour)' });
    if(t.epa_dha_mg && t.epa_dha_mg*g/100 >= 100) out.push({ pc:0, txt:Math.round(t.epa_dha_mg*g/100) + ' mg d’oméga-3 EPA et DHA (repère : 250 mg par jour)' });
    return out.map(function(x){ return x.txt; }); }
  var FREQ = { legume:'Chaque jour, dans vos cinq fruits et légumes.', fruit:'Chaque jour, dans vos cinq fruits et légumes.', legumineuse:'Au moins deux fois par semaine.', poisson:'Deux fois par semaine, dont un poisson gras.', fruit_de_mer:'De temps en temps, bien cuits.', fruit_a_coque:'Une petite poignée par jour, non salée.', cereale_complete:'Chaque jour, complet de préférence.', feculent:'Chaque jour, complet de préférence.', matiere_grasse:'Chaque jour, en assaisonnement, sans excès.', produit_laitier_fermente:'Jusqu’à deux produits laitiers par jour.', produit_laitier:'Jusqu’à deux produits laitiers par jour.', fromage:'Jusqu’à deux produits laitiers par jour.', graine:'Une cuillère à soupe, régulièrement.', cacao:'De temps en temps, sans sucre ajouté.', boisson:'Au fil de la journée, sans sucre ajouté.', fruit_sec:'Une petite poignée, de temps en temps.', epice_herbe:'Pour relever vos plats, en petite quantité.', oeuf:'Selon vos habitudes, dans une alimentation variée.', volaille:'En alternance avec le poisson, les œufs et les légumes secs.' };
  var DOSE_ETUDE = { concentre_tomate:'Dans les essais : 40 à 55 g par jour pendant 10 à 12 semaines, cuit avec de l’huile d’olive.', amande:'Dans les essais : environ 60 g par jour pendant 16 à 24 semaines.', avocat:'Dans l’essai : un avocat par jour pendant 8 semaines.', cacao_poudre:'Dans les essais : une boisson riche en flavanols chaque jour pendant 12 à 24 semaines.', eau:'Dans l’étude : environ deux litres par jour, avec un effet surtout chez ceux qui buvaient peu.' };
  /* composition exacte pour 100 g (UE 1924/2006 : « source » >= 15 % VNR, « riche » >= 30 % VNR) */
  var NOM_CAT = { legume:'Légume', fruit:'Fruit', legumineuse:'Légumineuse', poisson:'Poisson', fruit_de_mer:'Fruit de mer', cereale_complete:'Céréale complète', feculent:'Féculent', fruit_a_coque:'Fruit à coque', graine:'Graine', fruit_sec:'Fruit sec', cacao:'Cacao', boisson:'Boisson', matiere_grasse:'Huile', produit_laitier_fermente:'Produit laitier fermenté', produit_laitier:'Produit laitier', fromage:'Fromage', oeuf:'Œuf', epice_herbe:'Épice ou herbe', volaille:'Volaille', viande:'Viande', condiment:'Condiment', sucre:'Produit sucré' };
  function composition(f){ var t = (f.ciqual && f.ciqual.teneurs_pour_100g) || {}, riche = [], source = [];
    VNR.forEach(function(v){ var pc = (t[v[0]] || 0)/v[1]*100, nom = v[3].replace(/^de |^d’/, ''); if(pc >= 30) riche.push(nom); else if(pc >= 15) source.push(nom); });
    if((t.fibres_g || 0) >= 6) riche.push('fibres'); else if((t.fibres_g || 0) >= 3) source.push('fibres');
    if((t.epa_dha_mg || 0) >= 80) source.push('oméga-3 EPA et DHA'); if((t.ala_g || 0) >= .3) source.push('oméga-3 ALA');
    var cat = NOM_CAT[f.categorie] || 'Aliment', txt = cat;
    if(riche.length) txt += ' riche en ' + riche.slice(0, 3).join(', ');
    if(source.length) txt += (riche.length ? ', source de ' : ' source de ') + source.slice(0, 3).join(', ');
    return txt === cat ? cat + ', pour varier votre assiette.' : txt + ' (pour 100 g, table CIQUAL).'; }
  /* credit photo : obligatoire pour les licences CC BY et CC BY-SA (la photo detouree garde la meme licence) */
  function credit(id){ var c = CREDITS[id]; if(!c) return ''; var lic = String(c.licence || '').toUpperCase().replace('BY-SA', 'BY-SA').replace(/^CC0$/, 'CC0');
    return '<div class="preuve" style="text-transform:none;letter-spacing:.2px;font-size:12px;opacity:.7;margin-top:10px">Photo : ' + esc(c.auteur || 'auteur inconnu') + ', ' + (c.licence_url ? '<a href="' + esc(c.licence_url) + '" target="_blank" rel="noopener" style="color:inherit">' + esc(lic) + '</a>' : esc(lic)) + (c.source_url ? ', <a href="' + esc(c.source_url) + '" target="_blank" rel="noopener" style="color:inherit">source</a>' : '') + (/SA/.test(lic) ? ' ; détourée par vyvre, même licence.' : ' ; détourée par vyvre.') + '</div>'; }
  /* la photo detouree d'un aliment, sinon sa pastille de couleur */
  function photo(f, t){ return '<img src="' + BASE + 'photos/' + f.id + '.png" alt="" style="width:' + t + 'px;height:' + t + 'px;object-fit:contain;flex:none;filter:drop-shadow(0 8px 8px rgba(36,27,21,.18))" onerror="this.outerHTML=\'<i style=&quot;display:inline-block;width:9px;height:9px;border-radius:50%;flex:none;background:' + (TEINTE[f.categorie] || '#999') + '&quot;></i>\'">'; }
  function allegation(f){ var t = f.allegation_UE_autorisee; if(!t || /vitamine A|cuivre|pigmentation/i.test(t)) return null; return t; }   // vitamine A vegetale : avis juridique d'abord ; cuivre : jamais pour les taches
  function saison(f){ var s = (f.saison || []).slice().sort(function(a1, b1){ return a1 - b1; }); if(!s.length) return 'saison non renseignée'; if(s.length >= 12) return 'toute l’année';
    var p = [], d = s[0], pr = s[0]; for(var i = 1; i <= s.length; i++){ if(i < s.length && s[i] === pr + 1){ pr = s[i]; continue; } p.push([d, pr]); if(i < s.length){ d = s[i]; pr = s[i]; } }
    if(p.length > 1 && p[0][0] === 1 && p[p.length - 1][1] === 12){ var last = p.pop(); p[0] = [last[0], p[0][1]]; }
    return p.map(function(z){ return z[0] === z[1] ? 'en ' + MOIS[z[0] - 1] : 'de ' + MOIS[z[0] - 1] + ' à ' + MOIS[z[1] - 1]; }).join(' et '); }

  /* ---- le style : editorial, titres italiques (d'apres Maree) ---- */
  var CSS = '\
#vy-as-entree{display:block!important;grid-column:1/-1;margin:22px 0 0;border-radius:26px;overflow:hidden;background:linear-gradient(180deg,#fbfbfd,#e9ebee)!important;color:#1c2f30!important;padding:30px 24px 26px;position:relative;cursor:pointer;opacity:1!important;transform:none!important;backdrop-filter:none!important;border:0!important;box-shadow:0 40px 80px -40px #000}\
#vy-as-entree *{-webkit-text-fill-color:currentColor;background-clip:border-box}\
#vy-as-entree .m{font:500 11.5px/1 "Helvetica Neue",Arial,sans-serif;letter-spacing:2.2px;text-transform:uppercase}\
#vy-as-entree h3{font:italic 400 58px/.95 Georgia,serif;letter-spacing:-4px;margin:16px 0 10px;color:#183b3e}\
#vy-as-entree p{font:300 14px/1.6 "Helvetica Neue",Arial,sans-serif;color:#3e5f5d;max-width:320px;margin:0}\
#vy-as-entree button{margin-top:20px;width:100%;min-height:50px;border-radius:30px;border:0;background:#173d3f;color:#e3eee7;font:400 14px "Helvetica Neue",Arial,sans-serif;letter-spacing:.3px}\
#vy-as{position:fixed;inset:0;z-index:2000;overflow:auto;-webkit-overflow-scrolling:touch;font-family:Inter,"Helvetica Neue",Arial,sans-serif;background:#06181e;opacity:0;transform:translateY(30px);transition:opacity .6s,transform .8s cubic-bezier(.2,.9,.2,1)}\
#vy-as.on{opacity:1;transform:none}\
#vy-as .ec{min-height:100%;padding:calc(30px + env(safe-area-inset-top)) 24px calc(40px + env(safe-area-inset-bottom));max-width:560px;margin:0 auto}\
#vy-as .nuit{background:#06181e;color:#e7f5f2}\
#vy-as .jour{background:linear-gradient(180deg,#fbfbfd 0%,#f1f2f4 55%,#e9ebee 100%);color:#1c2f30}\
#vy-as[data-fond=jour]{background:linear-gradient(180deg,#fbfbfd 0%,#eceef1 100%)}\
#vy-as button{font-family:inherit}\
#vy-as .puce{min-height:44px;display:inline-flex;align-items:center}\
#vy-as .puce:focus-visible,#vy-as button:focus-visible,#vy-as a:focus-visible{outline:2px solid #173d3f;outline-offset:3px}\
#vy-as .collant{position:sticky;bottom:calc(10px + env(safe-area-inset-bottom));z-index:3;box-shadow:0 18px 40px -18px rgba(0,0,0,.45)}\
#vy-as .plats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:22px 0 4px}\
#vy-as .plats div{background:#fff;border-radius:18px;padding:10px 6px 12px;text-align:center;font-size:12.5px;line-height:1.25;box-shadow:0 16px 34px -24px rgba(0,0,0,.4)}\
#vy-as .plats img{display:block;width:100%;height:64px;object-fit:contain;margin-bottom:6px}\
#vy-as .plats i{display:block;width:30px;height:30px;border-radius:50%;margin:17px auto 23px}\
#vy-as .roue{position:relative;height:232px;overflow:hidden;margin:26px -24px 0;perspective:700px;-webkit-mask-image:linear-gradient(transparent,#000 28%,#000 72%,transparent);mask-image:linear-gradient(transparent,#000 28%,#000 72%,transparent)}\
#vy-as .roue .bande{position:absolute;left:24px;right:24px;top:50%;height:46px;margin-top:-23px;border-top:1px solid rgba(28,47,48,.18);border-bottom:1px solid rgba(28,47,48,.18);pointer-events:none}\
#vy-as .roue .it{position:absolute;left:0;right:0;height:46px;display:flex;align-items:center;justify-content:center;gap:12px;font-weight:300;font-size:24px;letter-spacing:-.4px;will-change:transform,opacity}\
#vy-as .roue .it i{width:9px;height:9px;border-radius:50%;flex:none}\
#vy-as .cases4{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:10px}\
#vy-as .cases4 div{border:1px solid rgba(28,47,48,.16);border-radius:16px;min-height:96px;align-items:center;gap:2px;padding:10px 8px;font-size:12.5px;line-height:1.3;text-align:center;display:flex;flex-direction:column;justify-content:center;transition:background .5s,transform .5s}\
#vy-as .cases4 div.on{background:#fff;box-shadow:0 18px 40px -22px rgba(0,0,0,.35);transform:translateY(-2px)}\
#vy-as .cases4 b{display:block;font:italic 16px Georgia,serif;margin-bottom:4px}\
#vy-as .ec{position:relative}\
#vy-as .fond-tri{position:absolute;inset:0;padding:calc(110px + env(safe-area-inset-top)) 14px 20px;column-count:3;column-gap:12px;font-size:12px;line-height:1.55;color:#1c2f30;opacity:.075;pointer-events:none;overflow:hidden;z-index:0}\
#vy-as .fond-tri div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity .8s}\
#vy-as .fond-tri div.x{opacity:.25;text-decoration:line-through}\
#vy-as .fond-tri div.k{font-weight:700;opacity:1}\
#vy-as .devant{position:relative;z-index:1}\
#vy-as .journal{margin-top:22px;font:400 12.5px/1.9 "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.3px;color:#56696a;min-height:150px}\
#vy-as .journal div{opacity:0;transform:translateY(6px);transition:opacity .45s,transform .45s}\
#vy-as .journal div.on{opacity:1;transform:none}\
#vy-as .haut{display:flex;justify-content:space-between;align-items:center;margin-bottom:34px}\
#vy-as .haut b{font-size:24px;font-weight:300;letter-spacing:-1.3px}\
#vy-as .m{font-size:12px;letter-spacing:2.2px;text-transform:uppercase}\
#vy-as .fermer{background:none;border:1px solid currentColor;color:inherit;border-radius:30px;padding:9px 14px;font-size:12px;letter-spacing:1.6px;opacity:.75}\
#vy-as h1,#vy-as h2,#vy-as h3{color:inherit!important;-webkit-text-fill-color:currentColor!important;background:none!important;text-shadow:none!important}\
#vy-as h1{font:italic 400 76px/.93 Georgia,serif;letter-spacing:-5px;margin:8px 0 18px}\
#vy-as h2{font:italic 400 52px/.95 Georgia,serif;letter-spacing:-3px;margin:46px 0 16px}\
#vy-as .lead{font-size:14.5px;line-height:1.7;font-weight:300;max-width:360px}\
#vy-as .nuit .lead{color:#bed2d0}\
#vy-as .ruban{display:flex;overflow-x:auto;scrollbar-width:none;margin:28px -24px;border-top:1px solid currentColor;border-bottom:1px solid currentColor;border-color:rgba(24,59,62,.2)}\
#vy-as .nuit .ruban{border-color:rgba(212,247,239,.2)}\
#vy-as .ruban span{flex:1 0 auto;padding:16px 12px;white-space:nowrap;text-align:center;font-size:12px;letter-spacing:1.6px;text-transform:uppercase}\
#vy-as .ruban span.on{font-weight:600}\
#vy-as .rit{display:flex;gap:22px;padding:22px 0;border-bottom:1px solid rgba(24,59,62,.2)}\
#vy-as .rit>i{font:italic 28px Georgia,serif;min-width:38px;padding-top:2px}\
#vy-as .rit h3{font-size:22px;font-weight:300;margin:0 0 4px;letter-spacing:-.3px}\
#vy-as .rit .sous{font-size:12.5px;color:#52716f;margin:0 0 10px;letter-spacing:.2px}\
#vy-as .rit p{font-size:13.5px;line-height:1.65;margin:8px 0 0;color:#2d4f4e}\
#vy-as .rit .alleg{font:italic 16px/1.5 Georgia,serif;color:#183b3e;border-left:1px solid #183b3e;padding-left:12px;margin:12px 0}\
#vy-as .rit .preuve{font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#52716f;margin-top:10px}\
#vy-as .rit .prec{font-size:12.5px;color:#8a4b1c;margin-top:8px;line-height:1.55}\
#vy-as details{margin-top:10px}#vy-as summary{font-size:12px;letter-spacing:1.6px;text-transform:uppercase;color:#52716f;cursor:pointer;list-style:none}\
#vy-as summary::-webkit-details-marker{display:none}\
#vy-as details a{display:block;color:#183b3e;font-size:12.5px;line-height:1.5;margin-top:7px;text-decoration:none;border-bottom:1px solid rgba(24,59,62,.15);padding-bottom:6px}\
#vy-as .q{margin:26px 0}#vy-as .q b{display:block;font-weight:300;font-size:18px;line-height:1.35;margin-bottom:12px;letter-spacing:-.2px}\
#vy-as .q b em{font:italic 16px Georgia,serif;margin-right:10px;opacity:.7}\
#vy-as .q small{font-size:12px;letter-spacing:1.6px;margin-left:8px;opacity:.55}\
#vy-as .puces{display:flex;flex-wrap:wrap;gap:8px}\
#vy-as .puce{font-size:13px;padding:10px 13px;border-radius:30px;border:1px solid rgba(24,59,62,.3);cursor:pointer;user-select:none;-webkit-user-select:none}\
#vy-as .puce.on{background:#173d3f;color:#e3eee7;border-color:#173d3f}\
#vy-as .btn{display:block;width:100%;min-height:52px;border-radius:30px;border:0;margin-top:22px;font-size:14px;letter-spacing:.3px;cursor:pointer}\
#vy-as .nuit .btn{background:#d6eee7;color:#12343b}\
#vy-as .jour .btn{background:#173d3f;color:#e3eee7}\
#vy-as .btn.sec{background:none!important;color:inherit!important;border:1px solid currentColor;opacity:.8}\
#vy-as .fine{font-size:12px;line-height:1.7;opacity:.7;margin-top:18px}\
#vy-as .alerte{font-size:13px;line-height:1.55;border:1px solid rgba(138,75,28,.45);color:#6b3a14;border-radius:16px;padding:12px 14px;margin:10px 0}\
#vy-as .prem{margin:34px -24px 0;padding:34px 24px 30px;background:#173d3f;color:#e3eee7}\
#vy-as .prem h2{margin-top:6px}\
#vy-as .prem .rit{border-color:rgba(227,238,231,.18)}\
#vy-as .prem .rit .sous,#vy-as .prem .rit p,#vy-as .prem .rit .preuve,#vy-as .prem summary{color:#b6cdc8}\
#vy-as .prem .rit .alleg{color:#fff;border-color:#e3eee7}\
#vy-as .prem details a{color:#e3eee7}\
#vy-as .prod{display:flex;gap:14px;align-items:center;margin-top:12px;padding:10px;border-radius:16px;background:rgba(255,255,255,.06);text-decoration:none;color:inherit}\
#vy-as .prod img{width:56px;height:70px;object-fit:contain;background:#fff;border-radius:10px;padding:4px;flex:none}\
#vy-as .prod b{display:block;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;opacity:.75}\
#vy-as .prod span{font-size:13.5px;line-height:1.35}\
#vy-as .vague{position:absolute;left:0;right:0;height:200px;pointer-events:none;opacity:.5}\
@media(min-width:700px){#vy-as h1{font-size:110px}#vy-as-entree h3{font-size:72px}}\
#vy-as[data-fond=jour]{background:radial-gradient(circle at 92% 11%,rgba(237,194,172,.37),transparent 23%),radial-gradient(circle at 5% 76%,rgba(214,227,205,.35),transparent 22%),#f5f2ed}\
#vy-as .jour{background:transparent;color:#151413;font-family:Manrope,Inter,"Helvetica Neue",Arial,sans-serif}\
#vy-as .jour h1,#vy-as .jour h2{font-family:"Playfair Display",Georgia,serif;font-style:normal;font-weight:400;letter-spacing:-.065em}\
#vy-as .jour h1{font-size:62px;line-height:.86}#vy-as .jour h2{font-size:44px;line-height:.9}\
#vy-as .jour .m{font:400 12px/1.4 "DM Mono",ui-monospace,monospace;letter-spacing:.18em;color:#6f6a64}\
#vy-as .jour .lead{color:#6f6a64}\
#vy-as .jour .rit{border-bottom-color:rgba(21,20,19,.13)}#vy-as .jour .rit>i{font:400 12.5px "DM Mono",monospace;color:#a78151;min-width:30px;padding-top:6px;font-style:normal}\
#vy-as .jour .rit h3{font-family:"Playfair Display",Georgia,serif;font-size:26px;letter-spacing:-.04em}\
#vy-as .jour .rit .alleg{font-family:"Playfair Display",Georgia,serif;border-left-color:#c6a36b}\
#vy-as .jour .btn{background:#151413;color:#fff;border-radius:2px;box-shadow:0 15px 28px -20px rgba(0,0,0,.65)}\
#vy-as .jour .btn.sec{background:rgba(255,255,255,.35)!important;color:#151413!important;border:1px solid #151413}\
#vy-as .jour .puce{border-color:rgba(21,20,19,.2)}#vy-as .jour .puce.on{background:#151413;color:#fff;border-color:#151413}\
#vy-as .jour .fermer{border-color:rgba(21,20,19,.4)}\
#vy-as .ed-head h1{margin:14px 0 18px}#vy-as .ed-side{font-size:13.5px;line-height:1.65;color:#6f6a64;max-width:44ch}\
#vy-as .ed-grid{display:grid;grid-template-columns:1fr;gap:14px;margin-top:26px}\
#vy-as .ed-card{position:relative;overflow:hidden;border:1px solid rgba(21,20,19,.13);border-radius:28px;background:linear-gradient(145deg,rgba(255,255,255,.76),rgba(255,255,255,.27));box-shadow:inset 0 1px rgba(255,255,255,.92),0 28px 60px -54px rgba(28,20,13,.55);padding:24px}\
#vy-as .ed-score{min-height:360px}#vy-as .ed-score h3{font:400 29px/1 "Playfair Display",Georgia,serif;letter-spacing:-.05em;margin:48px 0 0}\
#vy-as .ed-num{font:400 128px/.78 "Playfair Display",Georgia,serif;letter-spacing:-.09em;margin-top:26px;display:flex;align-items:flex-start}#vy-as .ed-num sup{font:400 12px "DM Mono",monospace;letter-spacing:0;margin:.5em 0 0 .7em}\
#vy-as .ed-disc{position:absolute;width:140px;aspect-ratio:1;border-radius:50%;right:7%;top:24%;background:conic-gradient(from 15deg,#e6d0bc,#d9cfaf,#f4dfb7,#cab9cf,#e6d0bc);animation:vyTour 7.5s linear infinite;box-shadow:0 15px 30px rgba(72,51,37,.14)}\
#vy-as .ed-disc:after{content:"";position:absolute;inset:24%;border-radius:50%;background:linear-gradient(145deg,#f9f6ef,#efe9df);box-shadow:inset 0 1px #fff}\
@keyframes vyTour{to{transform:rotate(360deg)}}\
#vy-as .ed-note{margin-top:22px;font-size:13px;line-height:1.55;color:#6f6a64;max-width:34ch}\
#vy-as .ed-list h3{font:400 31px/1 "Playfair Display",Georgia,serif;letter-spacing:-.06em;margin:12px 0 18px}\
#vy-as .ed-row{display:grid;grid-template-columns:64px 1fr auto;gap:13px;align-items:center;padding:12px 0;border-top:1px solid rgba(21,20,19,.13);text-decoration:none;color:inherit}\
#vy-as .ed-row img{width:58px;height:62px;object-fit:contain;filter:drop-shadow(0 14px 10px rgba(36,27,21,.16))}#vy-as .ed-row i{width:26px;height:26px;border-radius:50%;margin:0 auto}\
#vy-as .ed-row b{display:block;font-size:14px;font-weight:600}#vy-as .ed-row span{display:block;font-size:12.5px;color:#6f6a64;margin-top:3px}#vy-as .ed-row em{font:400 12px "DM Mono",monospace;font-style:normal;color:#a78151}\
#vy-as .ed-btn{display:flex;justify-content:space-between;align-items:center;margin-top:14px;padding:15px 18px;background:#151413;color:#fff;border-radius:2px;text-decoration:none;font-size:13px;box-shadow:0 15px 28px -20px rgba(0,0,0,.65)}\
#vy-as .ed-signals{display:grid;grid-template-columns:1fr;margin-top:14px}\
#vy-as .ed-signals article{display:grid;grid-template-columns:92px 1fr;align-items:center;gap:6px 14px;padding:16px 0;border-top:1px solid rgba(21,20,19,.55)}#vy-as .ed-signals article:nth-child(2){border-top-color:rgba(198,163,107,.72)}\
#vy-as .ed-signals b{grid-row:1/3;font:400 30px/1 "Playfair Display",Georgia,serif;letter-spacing:-.05em}#vy-as .ed-signals p{font-size:12.5px;color:#6f6a64;line-height:1.45;margin:0}\
@media(min-width:900px){#vy-as .ec{max-width:1080px}#vy-as .ed-head{display:flex;justify-content:space-between;align-items:flex-end;gap:30px}#vy-as .ed-grid{grid-template-columns:1.15fr .85fr}#vy-as .ed-score{min-height:440px}#vy-as .ed-num{font-size:220px}#vy-as .ed-disc{width:200px;top:20%}#vy-as .ed-signals{grid-template-columns:repeat(3,1fr);gap:15px}#vy-as .ed-signals article{display:block}#vy-as .ed-signals b{display:block;margin:12px 0 6px}}\
@media(prefers-reduced-motion:reduce){#vy-as{transition:none}}';
  function style(){ if(!document.getElementById('vy-as-fontes')){ var l = document.createElement('link'); l.id = 'vy-as-fontes'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&family=Manrope:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap'; document.head.appendChild(l); }
    if(document.getElementById('vy-as-css')) return; var s = document.createElement('style'); s.id = 'vy-as-css'; s.textContent = CSS; document.head.appendChild(s); }

  /* ---- l'entree, dans les resultats du scan ---- */
  function entree(){ var ind = indicesDuScan(); if(!ind) return; style();
    var grid = document.querySelector('.vyvre-v6 .v6grid'); if(!grid) return;
    var e = document.getElementById('vy-as-entree');
    if(!e){ e = document.createElement('section'); e.id = 'vy-as-entree'; grid.appendChild(e); e.addEventListener('click', ouvrir); }
    e.innerHTML = '<div class="m">Nouveau · Votre assiette</div><h3>Assiette.</h3><p>Jusqu’à quatre aliments, choisis d’après votre lecture : ' + esc(INDICES[ind.i1].toLowerCase()) + (ind.i2 ? ', ' + esc(INDICES[ind.i2].toLowerCase()) : '') + '. Pour chacun, ce que les études montrent. Rien de plus.</p><button type="button">Composer mon assiette</button>';
    if(/[?&]assiette=1/.test(location.search) && !entree.fait){ entree.fait = 1; setTimeout(ouvrir, 900); } }

  /* ---- la feuille plein ecran ---- */
  function feuille(html, cls){ style(); html = html.replace(HAUT_BASE, HAUT_BASE + demo()); if(!ouvert){ ouvert = document.createElement('div'); ouvert.id = 'vy-as'; ouvert.setAttribute('role', 'dialog'); ouvert.setAttribute('aria-label', 'Votre assiette'); document.body.appendChild(ouvert); requestAnimationFrame(function(){ ouvert.classList.add('on'); }); document.documentElement.style.overflow = 'hidden'; }
    ouvert.setAttribute('data-fond', cls); ouvert.innerHTML = '<div class="ec ' + cls + '">' + html + '</div>'; ouvert.scrollTop = 0;
    /* accessibilite : chaque puce est un vrai bouton (clavier, lecteur d'ecran) */
    ouvert.querySelectorAll('.puce').forEach(function(z){ z.setAttribute('role', 'button'); z.tabIndex = 0; z.setAttribute('aria-pressed', z.classList.contains('on') ? 'true' : 'false'); });
    var f = ouvert.querySelector('.fermer'); if(f) f.onclick = fermer; }
  function fermer(){ if(!ouvert) return; var o = ouvert; ouvert = null; o.classList.remove('on'); document.documentElement.style.overflow = ''; setTimeout(function(){ o.remove(); }, 500); }
  var HAUT_BASE = '<div class="haut"><b>vyvre.</b><button class="fermer" type="button">FERMER</button></div>';
  var HAUT = HAUT_BASE;
  function demo(){ return window.__vyDemo ? '<div class="alerte" style="border-color:rgba(21,20,19,.25);color:#151413;background:rgba(255,255,255,.5)">Exemple : aucun scan trouvé sur cet appareil. <a href="/scan/" style="color:inherit">Faites votre scan</a> pour votre vraie assiette.</div>' : ''; }

  var ALLERG = [['fruits_a_coque','Fruits à coque'],['poissons','Poissons'],['cereales_gluten','Gluten ou maladie cœliaque'],['lait','Lait'],['oeufs','Œufs'],['soja','Soja'],['mollusques','Mollusques'],['crustaces','Crustacés'],['arachides','Arachides'],['sesame','Sésame'],['moutarde','Moutarde'],['celeri','Céleri'],['lupin','Lupin'],['sulfites','Sulfites'],['latex','Latex'],['bouleau','Pollen de bouleau'],['autre','Un autre aliment']];
  var NOMS_AL = { fruits_a_coque:'fruits à coque', poissons:'poissons', cereales_gluten:'gluten', lait:'lait', oeufs:'œufs', soja:'soja', mollusques:'mollusques', crustaces:'crustacés', arachides:'arachide', sesame:'sésame', moutarde:'moutarde', celeri:'céleri', lupin:'lupin', sulfites:'sulfites' };
  function phrase(s0){ if(!s0) return 'Touchez ce qui vous concerne, ou « Rien de particulier ».'; if(s0.rien) return 'Une assiette pour moi, sans restriction particulière.';
    var m = [], al = (s0.allergies || []).filter(function(z){ return NOMS_AL[z]; }).map(function(z){ return NOMS_AL[z]; });
    (s0.autres_aliments || []).forEach(function(id){ var f = DATA.filter(function(z){ return z.id === id; })[0]; if(f) al.push(f.nom.split(' (')[0].toLowerCase()); });
    if(al.length) m.push('sans ' + al.join(' ni '));
    if((s0.allergies || []).indexOf('latex') >= 0) m.push('sans avocat, kiwi, banane ni châtaigne');
    if((s0.allergies || []).indexOf('bouleau') >= 0) m.push('attentive au pollen de bouleau');
    if(s0.grossesse) m.push('en tenant compte de la grossesse ou de l’allaitement'); if(s0.anticoagulant) m.push('sans les légumes verts très riches en vitamine K');
    if(s0.reins) m.push('sans les aliments les plus riches en potassium'); if(s0.regime) m.push(s0.regime === 'vegan' ? 'végane' : 'végétarienne');
    if(!m.length) return 'Touchez ce qui vous concerne, ou « Rien de particulier ».';
    var t = m.length > 1 ? m.slice(0, -1).join(', ') + ' et ' + m[m.length - 1] : m[0]; return 'Une assiette pour moi, ' + t + '. Rien d’autre.'; }
  function restants(){ var sv = MODE, rp = REP; MODE = 'normal'; versRep(indicesDuScan()); var n = DATA.length - Object.keys(exclus().x).length; MODE = sv; REP = rp; return n; }
  function valide(s0){ if(!s0) return false; if(s0.rien) return true; var cases = s0._cases || {};
    if(cases.allergie && !((s0.allergies || []).length || (s0.autres_aliments || []).length)) return false;
    if(cases.regime && !s0.regime) return false;
    return !!(cases.allergie || s0.grossesse || s0.anticoagulant || s0.reins || s0.regime); }
  function ageOk(){ try { var g = window.vyPrefs && window.vyPrefs.get && window.vyPrefs.get(); return !!(g && ['25','35','45','55'].indexOf(String(g.age)) >= 0); } catch(e){ return false; } }

  function ouvrir(){ charger().then(function(){ if(!indicesDuScan()) return; var m = lireMemoire();
    if(m){ SANTE = m.sante; PASPOUR = m.paspour || []; REP.q9s = m.rythme && m.rythme.sommeil; REP.q9d = m.rythme && m.rythme.decale; REP.q10p = m.rythme && m.rythme.pas; GARDER = true; pareil(m); }
    else { SANTE = null; GARDER = false; eviter(); } }); }

  function pareil(m){ var d = new Date(m.le); feuille(HAUT + '<div class="m">Vos réponses du ' + d.getDate() + ' ' + MOIS[d.getMonth()] + '</div><h1>Rien n’a changé ?</h1>'
      + '<p class="alleg" style="font:italic 19px/1.5 Georgia,serif;border-left:1px solid;padding-left:14px">« ' + esc(phrase(SANTE)) + ' »</p>'
      + '<button class="btn" type="button" id="vy-as-oui">Oui, voir mon assiette</button><button class="btn sec" type="button" id="vy-as-change">Modifier mes réponses</button>'
      + '<p class="fine" style="display:flex;justify-content:space-between;gap:12px"><a href="#" id="vy-as-autre" style="color:inherit">Pour une autre personne</a><a href="#" id="vy-as-eff" style="color:inherit">Effacer mes réponses de cet appareil</a></p>', 'jour');
    document.getElementById('vy-as-oui').onclick = function(){ MODE = 'normal'; versRep(indicesDuScan()); lancer(); };
    document.getElementById('vy-as-change').onclick = function(){ eviter(JSON.parse(JSON.stringify(SANTE))); };
    document.getElementById('vy-as-autre').onclick = function(ev){ ev.preventDefault(); GARDER = false; PASPOUR = []; SANTE = null; eviter(); };
    document.getElementById('vy-as-eff').onclick = function(ev){ ev.preventDefault(); effacer(); GARDER = false; PASPOUR = []; SANTE = null; eviter(null, 'Vos réponses sont effacées de cet appareil.'); }; }

  function eviter(pre, message){ var s0 = pre || { _cases:{} }; s0._cases = s0._cases || {};
    if(pre){ if((pre.allergies || []).length || (pre.autres_aliments || []).length) s0._cases.allergie = 1; if(pre.regime) s0._cases.regime = 1; }
    var CASES = [['allergie','Une allergie','aliment, latex ou pollen'],['grossesse','Enceinte ou allaitante','ou projet de grossesse'],['anticoagulant','Un anticoagulant','traitement qui fluidifie le sang'],['reins','Une maladie des reins','ou des calculs rénaux'],['regime','Végétarien ou végan','']];
    var AUTRES = DATA.filter(function(f){ return !(f.allergenes_UE || []).length && DEFAUT_EXCLUS.indexOf(f.id) < 0; });
    feuille(HAUT + (message ? '<div class="alerte" style="border-color:rgba(24,59,62,.3);color:#183b3e">' + esc(message) + '</div>' : '')
      + '<div class="m">Une seule question, avant votre assiette</div><h1>Quelque chose à éviter ?</h1><p class="lead">D’abord, nous retirons ce qui ne vous convient pas. Ensuite seulement, nous choisissons.</p>'
      + '<div class="puces" id="vy-as-cases" style="margin-top:22px">' + CASES.map(function(c){ return '<span class="puce" data-c="' + c[0] + '" style="display:flex;flex-direction:column;align-items:flex-start;padding:12px 16px">' + c[1] + (c[2] ? '<small style="font-size:12.5px;opacity:.6;margin-top:3px">' + c[2] + '</small>' : '') + '</span>'; }).join('') + '</div>'
      + '<div id="vy-as-dep"></div>'
      + '<button type="button" id="vy-as-rien" style="display:block;width:100%;margin-top:18px;padding:18px;border-radius:22px;border:1px solid #183b3e;background:none;color:#183b3e;cursor:pointer"><span style="display:block;font-size:17px;font-weight:400">Rien de particulier</span><span style="display:block;font-size:12.5px;opacity:.7;margin-top:4px">ni allergie, ni grossesse, ni anticoagulant, ni maladie des reins, ni régime végétarien ou végan</span></button>'
      + '<div class="q" style="margin:20px 0 0"><b style="font-size:15px">Plutôt du quotidien, ou des découvertes ?<small>FACULTATIF</small></b><div class="puces" id="vy-as-usage"><span class="puce" data-v="quotidien">Des aliments du quotidien</span><span class="puce" data-v="decouverte">Des découvertes</span><span class="puce" data-v="tendance">Les tendances</span><span class="puce on" data-v="">Peu importe</span></div></div>'
      + '<p id="vy-as-phrase" style="font:italic 18px/1.5 Georgia,serif;margin:22px 0 6px"></p><div class="m" id="vy-as-compte" style="opacity:.6"></div>'
      + '<p class="lead" style="font-size:13px;margin-top:22px">' + (ageOk() ? '' : 'Vous avez 18 ans ou plus. ') + 'Vos réponses concernent votre santé. En acceptant, vous nous autorisez à nous en servir pour une seule chose : écarter des aliments et des soins. Elles restent sur cet appareil, ne nous sont jamais envoyées et s’effacent quand vous fermez la page.</p>'
      + '<button class="btn" type="button" id="vy-as-accept" disabled style="opacity:.45" class="btn collant">Accepter et voir mon assiette</button>'
      + '<p class="fine" style="display:flex;justify-content:space-between;gap:12px;font-size:13px"><a href="#" id="vy-as-mineur" style="color:inherit">J’ai moins de 18 ans</a><a href="#" id="vy-as-nr" style="color:inherit">Je préfère ne pas répondre</a></p>'
      + '<p class="fine">Information générale, pas un avis médical. Gonflement du visage ou gêne respiratoire après un repas : appelez le 15 ou le 112.</p>'
      + '<details><summary>Lire l’avertissement complet</summary><p class="fine">Les suggestions d’aliments de vyvre sont des informations générales sur l’alimentation. Elles ne constituent ni un diagnostic, ni un traitement, ni un avis médical ou diététique personnalisé, et ne remplacent pas une consultation. Les indices de votre scan sont des mesures optiques de l’image de votre peau : aucun aliment n’a été étudié pour les modifier, et nous ne promettons aucun résultat. Les aliments proposés s’intègrent dans une alimentation variée et équilibrée et un mode de vie sain. Si vous avez une allergie, une maladie, un traitement en cours, si vous êtes enceinte ou allaitez, ou pour un enfant, demandez l’avis de votre médecin ou de votre pharmacien avant de modifier votre alimentation. En cas de réaction allergique grave (gonflement du visage, gêne respiratoire), appelez le 15 ou le 112.</p></details>', 'jour');
    var maj = function(){
      ouvert.querySelectorAll('#vy-as-cases .puce').forEach(function(z){ var c = z.dataset.c; z.classList.toggle('on', !s0.rien && !!(c === 'allergie' ? s0._cases.allergie : c === 'regime' ? s0._cases.regime : s0[c])); });
      var r = document.getElementById('vy-as-rien'); r.style.background = s0.rien ? '#173d3f' : 'none'; r.style.color = s0.rien ? '#e3eee7' : '#183b3e';
      var dep = '';
      if(s0._cases.allergie && !s0.rien){ dep += '<div class="q"><b>Lesquelles ?<small>PLUSIEURS CHOIX POSSIBLES</small></b><div class="puces" data-g="al">' + ALLERG.map(function(o){ var on = o[0] === 'autre' ? s0._autre : (s0.allergies || []).indexOf(o[0]) >= 0; return '<span class="puce' + (on ? ' on' : '') + '" data-v="' + o[0] + '">' + o[1] + '</span>'; }).join('') + '</div>';
        if(s0._autre) dep += '<b style="margin-top:14px">Parmi nos aliments, lesquels ?</b><p class="fine" style="margin:0 0 10px">Voici tous nos aliments. Touchez ceux qui ne vous conviennent pas : ils n’apparaîtront nulle part, pas même dans une recette.</p><div class="puces" data-g="autre">' + AUTRES.map(function(f){ return '<span class="puce' + ((s0.autres_aliments || []).indexOf(f.id) >= 0 ? ' on' : '') + '" data-v="' + f.id + '">' + esc(f.nom.split(' (')[0]) + '</span>'; }).join('') + '</div>';
        if(((s0.allergies || []).length || (s0.autres_aliments || []).length)) dep += '<p class="fine"><i>Ces aliments disparaissent de l’assiette, des recettes et des combos. Cela ne remplace pas l’avis de votre allergologue.</i></p>';
        else dep += '<p class="fine">Choisissez au moins une réponse, ou touchez de nouveau « Une allergie » pour la retirer.</p>';
        dep += '</div>'; }
      if(s0.grossesse && !s0.rien) dep += '<p class="fine"><i>Nous écartons le thé vert et les soins déconseillés pendant la grossesse, comme les rétinoïdes. Le saumon : seulement bien cuit, jamais fumé. Zéro alcool.</i></p>';
      if(s0.anticoagulant && !s0.rien) dep += '<p class="fine"><i>Nous ne vous proposerons pas d’augmenter les légumes verts riches en vitamine K. Tout changement se discute avec votre médecin.</i></p>';
      if(s0.reins && !s0.rien) dep += '<p class="fine"><i>Nous écartons les aliments riches en potassium, les graines et les épinards. Votre alimentation se fixe avec votre néphrologue.</i></p>';
      if(s0._cases.regime && !s0.rien) dep += '<div class="q"><div class="puces" data-g="regime"><span class="puce' + (s0.regime === 'vegetarien' ? ' on' : '') + '" data-v="vegetarien">Végétarien</span><span class="puce' + (s0.regime === 'vegan' ? ' on' : '') + '" data-v="vegan">Végan</span></div>' + (s0.regime === 'vegan' ? '<p class="fine"><i>Pensez à la vitamine B12 : parlez-en à un professionnel de santé.</i></p>' : '') + '</div>';
      document.getElementById('vy-as-dep').innerHTML = dep;
      var ok = valide(s0), b = document.getElementById('vy-as-accept'); b.disabled = !ok; b.style.opacity = ok ? 1 : .45;
      SANTE = s0; document.getElementById('vy-as-phrase').textContent = ok || s0.rien ? '« ' + phrase(s0) + ' »' : phrase(null);
      document.getElementById('vy-as-compte').textContent = restants() + ' aliments possibles pour votre assiette'; };
    ouvert.querySelector('#vy-as-cases').addEventListener('click', function(ev){ var z = ev.target.closest('.puce'); if(!z) return; var c = z.dataset.c; s0.rien = false;
      if(c === 'allergie') s0._cases.allergie = !s0._cases.allergie, s0._cases.allergie || (s0.allergies = [], s0.autres_aliments = [], s0._autre = false);
      else if(c === 'regime') s0._cases.regime = !s0._cases.regime, s0._cases.regime || (s0.regime = null);
      else s0[c] = !s0[c]; maj(); });
    document.getElementById('vy-as-dep').addEventListener('click', function(ev){ var z = ev.target.closest('.puce'); if(!z) return; var g = z.parentNode.dataset.g, v = z.dataset.v;
      if(g === 'al'){ if(v === 'autre') s0._autre = !s0._autre; else { s0.allergies = s0.allergies || []; var i = s0.allergies.indexOf(v); if(i >= 0) s0.allergies.splice(i, 1); else s0.allergies.push(v); } }
      else if(g === 'autre'){ s0.autres_aliments = s0.autres_aliments || []; var k = s0.autres_aliments.indexOf(v); if(k >= 0) s0.autres_aliments.splice(k, 1); else s0.autres_aliments.push(v); }
      else if(g === 'regime') s0.regime = s0.regime === v ? null : v; maj(); });
    document.getElementById('vy-as-rien').onclick = function(){ s0 = { rien:true, _cases:{} }; maj(); };
    var us = document.getElementById('vy-as-usage'); us.querySelectorAll('.puce').forEach(function(z){ z.classList.toggle('on', (AFFINE.usage || '') === z.dataset.v); });
    us.onclick = function(ev){ var z = ev.target.closest('.puce'); if(!z) return; AFFINE.usage = z.dataset.v || null; us.querySelectorAll('.puce').forEach(function(y){ y.classList.toggle('on', y === z); }); };
    document.getElementById('vy-as-accept').onclick = function(){ if(!valide(s0)) return; var t = JSON.parse(JSON.stringify(s0)); delete t._cases; delete t._autre; SANTE = t; MODE = 'normal'; versRep(indicesDuScan()); lancer(); };
    document.getElementById('vy-as-mineur').onclick = function(ev){ ev.preventDefault(); SANTE = null; MODE = 'mineur'; GARDER = false; versRep(indicesDuScan()); lancer(); };
    document.getElementById('vy-as-nr').onclick = function(ev){ ev.preventDefault(); SANTE = null; MODE = 'prudent'; GARDER = false; versRep(indicesDuScan()); lancer(); };
    maj(); }

  /* ---- COMBO aliment + creme ou serum (premium) : chaque cote a ses preuves, jamais de synergie promise ---- */
  /* les produits du catalogue qui contiennent chaque actif (actifs_produits.json, genere depuis les listes INCI :
     rang = position de l'actif dans la liste, donc sa concentration probable) */
  var PRODUITS = null;
  function catalogue(){ if(PRODUITS) return Promise.resolve(PRODUITS);
    /* 05/10 (audit) : on retire les photos a fond blanc plein (pas de vrai detourage) et on applique la provenance et le budget choisis avant le scan */
    var plein = fetch('/scan/catalogue/fond_plein.json').then(function(r){ return r.json(); }).catch(function(){ return { images:[] }; }),
        marques = fetch('/scan/catalogue/marques.json').then(function(r){ return r.json(); }).catch(function(){ return { marques:{} }; });
    return Promise.all([fetch(BASE + 'actifs_produits.json').then(function(r){ return r.json(); }), plein, marques]).then(function(t){ var ex = {}; (t[1].images || []).forEach(function(u){ ex[u] = 1; });
      var M = t[2].marques || {}, pr = {}; try { pr = JSON.parse(localStorage.getItem('vyvre-prefs-v1') || '{}') || {}; } catch(e){}
      var EU = { DE:1, CH:1, SE:1, BE:1, NL:1, ES:1, IT:1, AT:1, DK:1, PT:1, MC:1, HU:1, IE:1, PL:1 }, region = function(b){ var m = M[b]; return !m ? null : EU[m.pays] ? 'EU' : m.pays; };
      var garde = function(p, lache){ var m = M[p.brand] || {}; if((pr.marques || []).length && lache < 1) return pr.marques.indexOf(p.brand) >= 0; if(lache < 1 && (pr.origine || []).length && pr.origine.indexOf(region(p.brand)) < 0) return false; if(lache < 2 && (pr.univers || []).length && pr.univers.indexOf(m.univers) < 0) return false; return true; };
      PRODUITS = {}; Object.keys(t[0].actifs || {}).forEach(function(k){ var l = (t[0].actifs[k] || []).filter(function(p){ return !ex[String(p.img || '').split('?')[0]]; }), f = l.filter(function(p){ return garde(p, 0); }); if(f.length < 2) f = l.filter(function(p){ return garde(p, 1); }); if(f.length < 2) f = l; PRODUITS[k] = f; });
      return PRODUITS; }).catch(function(){ PRODUITS = {}; return PRODUITS; }); }
  function produitsPour(actif){ var l = (PRODUITS && PRODUITS[actif.id]) || [];
    if(window.vyPrefs && window.vyPrefs.filter){ try { var f = window.vyPrefs.filter(l.map(function(p){ return { id:p.id, brand:p.brand, pays:p.pays, categorie:p.cat, name:p.n }; })); var ok = {}; f.forEach(function(p){ ok[p.id] = 1; }); if(f.length) l = l.filter(function(p){ return ok[p.id]; }); } catch(e){} }
    var serum = l.filter(function(p){ return /serum|sérum/i.test(p.cat || '') ; })[0], creme = l.filter(function(p){ return /creme|crème|soin|hydratant/i.test(p.cat || '') && p !== serum; })[0];
    var out = [serum, creme].filter(Boolean); l.forEach(function(p){ if(out.length < 2 && out.indexOf(p) < 0 && p.cat !== 'contour-yeux' && !/patch|mask|masque/i.test(p.n || '')) out.push(p); })   /* 04/10 : plus de contour des yeux en depannage */; return out.slice(0, 2); }
  function minus(t){ return /^[A-ZÀ-Ý][a-zà-ÿ]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t; }   /* « vitamine C », mais « AHA » */

  /* ---- 04/10 (contour des yeux) : la meme regle que le scan. Un soin contour des yeux seulement si la personne
     l'a demande (besoin « yeux » du parcours, ou objectif « Contour des yeux » avant le scan), ou si le moteur mesure
     une ombre sous l'oeil « marquee » ou « nette » avec une lumiere jugee fiable. Jamais de patchs ni de masques.
     Aucun aliment n'est presente pour les yeux : aucune allegation de sante autorisee (reglement UE 432/2012)
     ne concerne les cernes ou les poches. ---- */
  function cernesMesures(){ var s = window.__vyScores, r = window.vyvreLastScanResult, y = (s && s.yeux) || (r && (r.yeux || (r.scores && r.scores.yeux))), c = y && y.cernes;
    if(!c){ try { c = JSON.parse(localStorage.getItem('vyvre_scan_yeux') || 'null'); } catch(e){ c = null; } }
    return c || null; }
  function regleYeux(){ var dem = ((AFFINE && AFFINE.besoins) || []).indexOf('yeux') >= 0 || !!(window.vyPrefs && window.vyPrefs.yeux && window.vyPrefs.yeux());
    var c = cernesMesures(), mes = !!(c && c.fiable === true && (c.niveau === 'marque' || c.niveau === 'net'));
    return { demande:dem, mesure:mes, oui:dem || mes }; }
  function soinYeux(ind){ var R = regleYeux(); if(!R.oui || MODE === 'mineur' || !PRODUITS) return '';
    /* sur /scan/, le rituel porte deja ce soin : pas de doublon dans l'assiette */
    if((window.__vySelection || []).some(function(p){ return p && p._yeux; })) return '';
    var enceinte = a('q3','enceinte') || a('q3','allaite') || a('q3','projet'), sensible = ind && (ind.i1 === 'rougeurs' || ind.i2 === 'rougeurs') || ((AFFINE && AFFINE.besoins) || []).indexOf('rougeurs') >= 0;
    var actifs = {}; ((COMBOS && COMBOS.actifs) || []).forEach(function(z){ actifs[z.id] = z; });
    var vus = {};
    Object.keys(PRODUITS).forEach(function(aid){ var ac = actifs[aid]; (PRODUITS[aid] || []).forEach(function(p){
      if(p.cat !== 'contour-yeux' || /patch|\bpads?\b|mask|masque|strips?/i.test(p.n || '')) return;
      var e = vus[p.id] || (vus[p.id] = { p:p, ok:true, ac:[] }); if(e.ac.indexOf(aid) < 0) e.ac.push(aid);
      if(!ac || (sensible && ['aha','retinoide'].indexOf(aid) >= 0) || (enceinte && ac.grossesse === 'eviter') || (MODE === 'prudent' && ac.grossesse !== 'ok')) e.ok = false; }); });
    var l = Object.keys(vus).map(function(k){ return vus[k]; }).filter(function(e){ return e.ok; });
    if(window.vyPrefs && window.vyPrefs.filter){ try { var f = window.vyPrefs.filter(l.map(function(e){ return { id:e.p.id, brand:e.p.brand, pays:e.p.pays, categorie:e.p.cat, name:e.p.n }; })); var ok = {}; f.forEach(function(p){ ok[p.id] = 1; }); if(f.length) l = l.filter(function(e){ return ok[e.p.id]; }); } catch(e){} }
    var CERNES = /cerne|dark circle|ojera|occhiaie|augenring|olheira|puff|poche/i;
    l.sort(function(x, y){ return (y.p.img ? 1 : 0) - (x.p.img ? 1 : 0) || (R.mesure ? (CERNES.test(y.p.n || '') ? 1 : 0) - (CERNES.test(x.p.n || '') ? 1 : 0) : 0) || (x.p.pos || 99) - (y.p.pos || 99) || (x.p.id < y.p.id ? -1 : 1); });
    var e = l[0]; if(!e) return '';
    var p = e.p, spf = e.ac.some(function(k){ return actifs[k] && actifs[k].exige_spf; }), avis = enceinte && e.ac.some(function(k){ return actifs[k] && actifs[k].grossesse === 'avis'; });
    var pourquoi = [R.demande ? 'Vous l’avez demandé.' : '', R.mesure ? 'Ombre sous l’œil plus marquée que la joue sur votre image : indicatif.' : ''].filter(Boolean).join(' ');
    return '<div class="prem vy-yeux"><div class="m">Soin · Contour des yeux</div><div class="rit"><i>' + n2(0) + '</i><div><h3>' + esc((p.b ? p.b + ' ' : '') + (p.n || '')) + '</h3><div class="sous">' + esc(pourquoi) + '</div>'
      + '<p>Un soin cosmétique, seul : aucun aliment n’est proposé pour le contour des yeux, car aucune allégation de santé autorisée ne concerne les cernes ou les poches.</p>'
      + (spf ? '<div class="prec" style="color:#f3c9a6">Avec cet actif, une protection solaire chaque matin est indispensable.</div>' : '')
      + (avis ? '<div class="prec" style="color:#f3c9a6">Grossesse ou allaitement : demandez l’avis de votre médecin ou de votre pharmacien avant ce soin.</div>' : '')
      + '<a class="prod" href="' + esc(p.url || '#') + '" target="_blank" rel="noopener"><img src="' + esc(p.img || '') + '" alt="" onerror="this.style.visibility=\'hidden\'"><span><b>' + esc(p.b || '') + ' · Contour des yeux</b>' + esc(p.n || '') + '</span></a>'
      + '</div></div><p class="fine" style="color:#b6cdc8">Soin cosmétique : il agit sur l’aspect de la peau, pas sur une maladie. Testez-le d’abord sur une petite zone, sans l’appliquer dans l’œil.</p></div>'; }
  function combos(ind, pris){ if(!COMBOS || !COMBOS.combos) return '';
    var ids = {}; pris.forEach(function(c){ ids[c.f.id] = 1; });
    var ex = exclus().x, enceinte = a('q3','enceinte') || a('q3','allaite') || a('q3','projet');
    var actifs = {}; (COMBOS.actifs || []).forEach(function(z){ actifs[z.id] = z; });
    var lignes = COMBOS.combos.filter(function(c){ var ac = actifs[c.actif_id]; if(/tomate/.test(c.aliment_id) && c.actif_id === 'protection_solaire') return false; var sensible = ind.i1 === 'rougeurs' || ind.i2 === 'rougeurs' || ((AFFINE && AFFINE.besoins) || []).indexOf('rougeurs') >= 0;   /* 01/10 (audit) : peau reactive, pas d'AHA ni de retinoide */
      return (c.indice === ind.i1 || c.indice === ind.i2) && !ex[c.aliment_id] && ac && !(sensible && ['aha','retinoide','vitamine_c','acide_salicylique'].indexOf(ac.id) >= 0) && !(enceinte && ac.grossesse === 'eviter') && !(MODE === 'prudent' && ac.grossesse !== 'ok') && !(MODE === 'mineur' && ac.id !== 'protection_solaire'); })
      .sort(function(p, q){ return (ids[q.aliment_id] ? 1 : 0) - (ids[p.aliment_id] ? 1 : 0) || (p.ordre || 9) - (q.ordre || 9); }).slice(0, 3);
    var oeil = soinYeux(ind);   /* 04/10 : le contour des yeux, a part, sans aliment */
    if(!lignes.length) return oeil; var dejaProd = {};
    return '<div class="prem"><div class="m">Premium · Un aliment, un soin</div><h2>Combo.</h2><p class="lead" style="color:#b6cdc8">Pour une même cible, un aliment à table et un actif en soin. Chacun a ses propres preuves. Aucune étude n’a testé les deux ensemble : nous ne promettons donc aucun effet combiné.</p>'
      + lignes.map(function(c, k){ var f = DATA.filter(function(z){ return z.id === c.aliment_id; })[0], ac = actifs[c.actif_id]; if(!f) return '';
        var prods = produitsPour(ac).filter(function(p){ if(dejaProd[p.id]) return false; dejaProd[p.id] = 1; return true; });   /* 05/10 : un produit une seule fois dans les combos */
        return '<div class="rit"><i>' + n2(k) + '</i><div>' + (ids[f.id] ? '' : '<div class="preuve" style="margin:0 0 4px">Un autre aliment pour la même cible</div>') + '<h3>' + esc(f.nom.split(' (')[0]) + ' + ' + (prods.length ? esc((prods[0].b ? prods[0].b + ' ' : '') + (prods[0].n || '')) : esc(ac.nom.split(' (')[0])) + '</h3>' + (prods.length ? '<div class="sous" style="margin-top:-2px">' + esc(minus((ac.nom || '').split(' (')[0])) + ' en soin</div>' : '') + '<div class="sous">' + esc(INDICES[c.indice] || c.indice) + ' · aliment : preuve ' + esc(c.grade_aliment || f.niveau_preuve_peau) + ' · soin : preuve ' + esc(c.grade_actif || ac.grade) + '</div>'
          + '<p>À table : ' + esc(f.nom.split(' (')[0].toLowerCase()) + ', ' + esc(composition(f).charAt(0).toLowerCase() + composition(f).slice(1)) + ' En soin : ' + esc(ac.ce_qu_on_peut_dire || '') + '</p>'
          + '<div class="preuve" style="margin-top:14px">Votre rituel</div><p style="margin-top:4px">'
            + (ac.moment === 'soir' ? 'Le soir' : ac.moment === 'matin' ? 'Le matin' : 'Matin ou soir') + ' : ' + esc(minus((ac.nom || '').split(' (')[0])) + '.'
            + (ac.dose_affichee ? '<br><span style="opacity:.8">Dose : ' + esc(ac.dose_affichee) + '</span>' : '')
            + '<br>À table : ' + esc(f.nom.split(' (')[0].toLowerCase()) + ', ' + esc((f.portion_type || '').toLowerCase()) + '. ' + esc(FREQ[f.categorie] || '') + '' + '</p>'
          + (ac.precautions || []).map(function(t){ return '<div class="prec" style="color:#f3c9a6">' + esc(t) + '</div>'; }).join('')
          + (ac.ce_qu_on_peut_dire ? '<div class="alleg">' + esc(ac.ce_qu_on_peut_dire) + '</div>' : '')
          + (ac.exige_spf ? '<div class="prec" style="color:#f3c9a6">Avec cet actif, une protection solaire chaque matin est indispensable.</div>' : '')
          + ((a('q3','enceinte') || a('q3','allaite') || a('q3','projet')) && ac.grossesse === 'avis' ? '<div class="prec" style="color:#f3c9a6">Grossesse ou allaitement : demandez l’avis de votre médecin ou de votre pharmacien avant cet actif.</div>' : '')
          + (prods.length ? '<div class="preuve" style="margin-top:16px">Dans notre catalogue</div>' : '')
          + prods.map(function(p){ var par = /\(([^)]+)\)/.exec(ac.nom || ''), nom = (ac.id === 'humectants' && par ? par[1] : (ac.nom || '').split(' (')[0]).toLowerCase(), CATN = { serum:'Sérum', creme:'Crème', 'solaire-visage':'Solaire visage' }; return '<a class="prod" href="' + esc(p.url || '#') + '" target="_blank" rel="noopener"><img src="' + esc(p.img || '') + '" alt="" onerror="this.style.visibility=\'hidden\'"><span><b>' + esc(p.b || '') + (p.cat ? ' · ' + esc(CATN[p.cat] || p.cat) : '') + '</b>' + esc(p.n || '') + '<br><small style="opacity:.7">' + (ac.id === 'protection_solaire' ? 'Protection solaire du visage' : 'Contient ' + esc(nom) + (p.pos <= 4 ? ', parmi les premiers ingrédients' : '')) + '</small></span></a>'; }).join('')
          + ((ac.etudes || []).length ? '<details><summary>Les études de l’actif (' + ac.etudes.length + ')</summary>' + ac.etudes.map(function(e){ return '<a href="' + esc(e.lien) + '" target="_blank" rel="noopener">' + esc(e.ref) + ' ↗</a>'; }).join('') + '</details>' : '')
          + '</div></div>'; }).join('')
      + '<p class="fine" style="color:#b6cdc8">Soins cosmétiques : ils agissent sur l’aspect de la peau, pas sur une maladie. Testez chaque nouveau soin sur une petite zone. Protection solaire chaque matin, surtout avec un rétinoïde ou un acide exfoliant.</p></div>' + oeil; }

  var CUISINES = [['francaise','Française'],['mediterraneenne','Méditerranéenne'],['orientale','Orientale'],['asiatique','Asiatique'],['latino','Amérique latine'],['africaine','Afrique de l’Ouest'],['nordique','Nordique']];
  function affiner(){ var pu = function(k, v, t, on){ return '<span class="puce' + (on ? ' on' : '') + '" data-af="' + k + '" data-v="' + (v || '') + '" style="flex:none;font-size:12.5px;padding:9px 12px">' + t + '</span>'; };
    return '<div class="m" style="margin:22px 0 8px;opacity:.6">Affiner</div><div class="puces" style="flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -24px;padding:0 24px 4px">'
      + pu('saison', '', 'De saison et de France', AFFINE.saison) + pu('usage', 'quotidien', 'Du quotidien', AFFINE.usage === 'quotidien') + pu('usage', 'decouverte', 'Découvertes', AFFINE.usage === 'decouverte') + pu('usage', 'tendance', 'Les tendances', AFFINE.usage === 'tendance')
      + pu('budget', 'serre', 'Budget serré', AFFINE.budget === 'serre') + pu('budget', 'moyen', 'Budget moyen', AFFINE.budget === 'moyen') + pu('bio', '', 'Bio de préférence', AFFINE.bio)
      + pu('cuis', '', 'Cuisines' + (AFFINE.cuisines.length ? ' (' + AFFINE.cuisines.length + ')' : '') + ' ▾', AFFINE.cuis || AFFINE.cuisines.length)
      + (PASPOUR.length ? '<span class="puce" id="vy-as-pp" style="flex:none;font-size:12.5px;padding:9px 12px">Rétablir les aliments retirés (' + PASPOUR.length + ')</span>' : '') + '</div>'
      + (AFFINE.cuis ? '<div class="puces" style="margin-top:8px">' + CUISINES.map(function(c){ return pu('cuisine', c[0], c[1], AFFINE.cuisines.indexOf(c[0]) >= 0); }).join('') + '<p class="fine" style="width:100%;margin:4px 0 0">Jusqu’à trois cuisines. Les autres ne sont jamais masquées.</p></div>' : '')
      + (AFFINE.bio ? '<p class="fine">Dans notre revue des études, le bio n’a pas montré d’effet propre sur la peau. Il coûte en moyenne plus cher : fruits +61 %, légumes +67 % (Familles Rurales, juin 2026).</p>' : ''); }
  /* le prix, jamais invente (FILTRES.md section 4) */
  function prix(f){ var sy = ['', '€', '€€', '€€€'][f.prix_niveau] || '', r = f.prix_releve;
    if(r && r.valeur){ return sy + ' · prix indicatif : ' + String(r.valeur).replace('.', ',') + ' ' + (r.unite || '') + (r.produit ? ' (' + r.produit.replace(/\s*\(.*\)\s*$/, '').toLowerCase() + ')' : '') + (r.bio_valeur ? ', ' + String(r.bio_valeur).replace('.', ',') + ' en bio' : '') + '. ' + (r.source || '').split(',')[0] + ', ' + (r.periode || '') + ', ' + (r.zone || 'France') + '. Vos prix peuvent varier.'; }
    return sy ? sy + ' · niveau estimé d’après la catégorie ; aucun prix relevé pour cet aliment.' : ''; }
  /* ---- LA COMPOSITION : une roue fait defiler les VRAIS candidats et s'arrete sur les VRAIS choix ;
     le journal montre les vraies etapes du calcul (Charles : « pas simule, vraiment lie ») ---- */
  function lancer(){ var ind = indicesDuScan(); if(!ind) return; var pris = choisir(ind);
    if(!pris.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return assiette();
    var e = exclus(), sv = { S:SANTE, M:MODE, R:REP }; SANTE = { rien:true }; MODE = 'normal'; versRep(ind); var nDef = Object.keys(exclus().x).length; SANTE = sv.S; MODE = sv.M; REP = sv.R;
    var nTot = Object.keys(e.x).length, G = { A:1, B:1, C:1 }, mois = new Date().getMonth() + 1;
    var cand = DATA.filter(function(f){ return !e.x[f.id] && G[f.niveau_preuve_peau] && (f.cibles_peau.indexOf(ind.i1) >= 0 || (ind.i2 && f.cibles_peau.indexOf(ind.i2) >= 0)); });
    var choisis = pris.map(function(c){ return c.f; }), roue = choisis.concat(cand.filter(function(f){ return choisis.indexOf(f) < 0 && CREDITS[f.id]; }).slice(0, 36)).sort(function(){ return Math.random() - .5; });   // les choix sont toujours dans la roue
    while(roue.length < 14) roue = roue.concat(roue);
    var H = 46;
    feuille('<div class="fond-tri" aria-hidden="true">' + DATA.map(function(f){ return '<div data-id="' + f.id + '">' + esc(f.nom.split(' (')[0].split(',')[0]) + '</div>'; }).join('') + '</div><div class="devant">' + HAUT + '<div class="m">Composition de votre assiette</div><h2 style="margin:10px 0 0;font-size:40px;letter-spacing:-2px" id="vy-as-ct">Nous trions.</h2>'
      + '<div class="cases4">' + [0, 1, 2, 3].map(function(k){ return '<div id="vy-as-c' + k + '"><b>' + n2(k) + '</b><span style="opacity:.35">·</span></div>'; }).join('') + '</div>'
      + '<div class="roue"><div class="bande"></div><div id="vy-as-ruban">' + roue.map(function(f){ return '<div class="it">' + photo(f, 34) + esc(f.nom.split(' (')[0]) + '</div>'; }).join('') + '</div></div>'
      + '<div class="journal" id="vy-as-jr"></div><button class="btn sec collant" type="button" id="vy-as-passer" style="margin-top:6px;background:#fbfbfd!important">Voir l’assiette tout de suite</button></div>', 'jour');
    /* le fond suit les vraies etapes : ecartes pour tous, puis d'apres vos reponses, puis hors de vos indices */
    var fond = {}; ouvert.querySelectorAll('.fond-tri div').forEach(function(d){ fond[d.dataset.id] = d; });
    var barrer = function(test){ DATA.forEach(function(f){ if(test(f) && fond[f.id]) fond[f.id].classList.add('x'); }); };
    var ex0 = {}; (function(){ var sv = { S:SANTE, M:MODE, R:REP }; SANTE = { rien:true }; MODE = 'normal'; versRep(ind); ex0 = exclus().x; SANTE = sv.S; MODE = sv.M; REP = sv.R; })();
    setTimeout(function(){ barrer(function(f){ return ex0[f.id]; }); }, 120 + 170);
    setTimeout(function(){ barrer(function(f){ return e.x[f.id]; }); }, 120 + 2*170);
    setTimeout(function(){ barrer(function(f){ return cand.indexOf(f) < 0; }); }, 120 + 4*170);
    var items = [].slice.call(ouvert.querySelectorAll('.roue .it')), N = items.length, pos = 0, fini = false, raf;
    var dessiner = function(){ var hc = 116; items.forEach(function(el, i){ var y = ((i*H - pos) % (N*H) + N*H) % (N*H); if(y > N*H/2) y -= N*H; var d = y / (H*2.6);
      el.style.transform = 'translateY(' + (hc - H/2 + y) + 'px) rotateX(' + (-Math.max(-1.2, Math.min(1.2, d))*38) + 'deg)'; el.style.opacity = Math.max(0, 1 - Math.abs(d)*.55); el.style.fontWeight = Math.abs(y) < H/2 ? 400 : 300; }); };
    dessiner();
    var jr = document.getElementById('vy-as-jr'), ligne = function(t){ var d = document.createElement('div'); d.textContent = t; jr.appendChild(d); requestAnimationFrame(function(){ d.classList.add('on'); }); };
    var etapes = [DATA.length + ' aliments au départ · composition CIQUAL 2020 (ANSES)', '− ' + nDef + ' écartés pour tous, par prudence : algues, soja, pamplemousse, huître, noix du Brésil'];
    if(nTot > nDef) etapes.push('− ' + (nTot - nDef) + ' écartés d’après vos réponses');
    etapes.push('Votre lecture : ' + INDICES[ind.i1] + (ind.i2 ? ' d’abord, puis ' + INDICES[ind.i2] : ''), cand.length + ' aliments étudiés pour ' + (ind.i2 ? 'ces deux indices' : 'cet indice'), 'Classement : les preuves d’abord, puis la saison (' + MOIS[mois - 1] + ') et vos goûts', 'Un aliment par famille, jamais deux fois le même nutriment');
    etapes.forEach(function(t, k){ setTimeout(function(){ if(!fini) ligne(t); }, 120 + k*170); });
    var tourner = function(k){ if(fini) return; if(k >= pris.length){ document.getElementById('vy-as-ct').textContent = 'Votre assiette.'; setTimeout(function(){ if(!fini){ fini = true; assiette(); } }, 600); return; }
      var cible = roue.indexOf(pris[k].f); if(cible < 0) cible = 0;
      var depart = pos, tours = 2 + (k % 2), fin = (Math.ceil(depart/(N*H)) + tours)*N*H + cible*H, t0 = performance.now(), dur = 950;
      document.getElementById('vy-as-ct').textContent = ['Premier', 'Deuxième', 'Troisième', 'Quatrième'][k] + ' choix.';
      (function anim(now){ if(fini) return; var u = Math.min(1, (now - t0)/dur), ez = 1 - Math.pow(1 - u, 4); pos = depart + (fin - depart)*ez; dessiner();
        if(u < 1) raf = requestAnimationFrame(anim);
        else { var f = pris[k].f, c = document.getElementById('vy-as-c' + k); c.classList.add('on'); c.innerHTML = '<b>' + n2(k) + '</b>' + photo(f, 40) + esc(f.nom.split(' (')[0].split(',')[0]);
          if(fond[f.id]) fond[f.id].classList.add('k');
          ligne(n2(k) + ' · ' + f.nom.split(' (')[0] + ' · preuve ' + f.niveau_preuve_peau + ' · ' + INDICES[pris[k].pour] + ((f.saison || []).indexOf(mois) >= 0 && (f.saison || []).length < 12 ? ' · de saison' : ''));
          setTimeout(function(){ tourner(k + 1); }, 380); } })(t0); };
    setTimeout(function(){ tourner(0); }, 150 + etapes.length*170);
    document.getElementById('vy-as-passer').onclick = function(){ fini = true; cancelAnimationFrame(raf); assiette(); }; }

  /* En-tete « Skin Edit » (proposition GPT choisie par Charles le 30/09) : papier chaud, Playfair, disque, liste, reperes */
  function editTete(pris, ind, e, prudent, titres){ var mois = new Date().getMonth() + 1, d = new Date();
    var nSaison = pris.filter(function(c){ var sa = c.f.saison || []; return sa.length && sa.length < 12 && sa.indexOf(mois) >= 0; }).length;
    var grades = pris.map(function(c){ return c.f.niveau_preuve_peau; }).sort(), best = grades[0] || '–';
    var prixMoy = pris.length ? Math.round(pris.reduce(function(t, c){ return t + (c.f.prix_niveau || 1); }, 0)/pris.length) : 1;
    var titre = prudent ? 'Assiette<br>prudente.' : pris.length ? ['', 'Un aliment,<br>pour vous.', 'Deux aliments,<br>pour vous.', 'Trois aliments,<br>pour vous.', 'Quatre aliments,<br>pour vous.'][pris.length] : 'Aucun<br>aliment.';
    var pourquoi = pris.length ? 'Les deux points à soutenir en priorité d’après votre lecture : ' + esc(INDICES[ind.i1].toLowerCase()) + (ind.i2 ? ' et ' + esc(INDICES[ind.i2].toLowerCase()) : '') + '. Parmi ' + DATA.length + ' aliments, nous avons gardé ceux que la littérature relie, même faiblement, à ces aspects de la peau, écarté ' + Object.keys(e.x).length + ' aliments ' + (prudent ? 'par prudence' : 'pour tous ou d’après vos réponses') + ', puis classé par solidité des preuves, saison et goûts. Aucun aliment n’a été étudié sur les indices de votre scan.' : 'Vos réponses écartent tous les aliments étudiés pour vos indices. Plutôt qu’un aliment sans rapport, nous préférons ne rien proposer.';
    return '<div class="ed-head"><div><div class="m">Votre assiette edit / ' + d.getDate() + ' ' + MOIS[d.getMonth()] + '</div><h1>' + titre + '</h1></div><p class="ed-side">' + pourquoi + '</p></div>'
      + (pris.length ? '<div class="ed-grid"><article class="ed-card ed-score"><div class="m">Votre lecture</div><div class="ed-disc"></div><h3>' + esc(INDICES[ind.i1]) + ',<br>d’abord</h3><div class="ed-num"><span class="vy-as-compte" data-n="' + ind.n1 + '">0</span><sup>/100</sup></div><p class="ed-note">' + esc(PHRASE[ind.i1]) + (ind.i2 ? ' Puis ' + esc(INDICES[ind.i2].toLowerCase()) + ', ' + ind.n2 + ' sur 100.' : '') + '</p></article>'
        + '<aside class="ed-card ed-list"><div class="m">Votre assiette / ' + pris.length + ' aliment' + (pris.length > 1 ? 's' : '') + '</div><h3>L’essentiel,<br>dans l’assiette.</h3>'
        + pris.map(function(c, k){ var f = c.f; return '<a class="ed-row" href="#vy-as-f' + k + '"><img src="' + BASE + 'photos/' + f.id + '.png" alt="" onerror="this.outerHTML=\'<i style=&quot;background:' + (TEINTE[f.categorie] || '#999') + '&quot;></i>\'"><div><b>' + esc(f.nom.split(' (')[0].split(',')[0]) + '</b><span>' + esc(NOM_CAT[f.categorie] || '') + ' · ' + esc((f.portion_type || '').split(' (')[0]) + '</span></div><em>0' + (k + 1) + '</em></a>'; }).join('')
        + '<a class="ed-btn" href="#vy-as-detail">Voir le détail <span>→</span></a></aside></div>'
        + '<div class="ed-signals"><article><div class="m">Saison</div><b>' + nSaison + '/' + pris.length + '</b><p>de saison en ' + MOIS[mois - 1] + '.</p></article><article><div class="m">Preuves</div><b>' + best + '</b><p>le niveau de preuve le plus solide de votre assiette.</p></article><article><div class="m">Budget</div><b>' + ['', '€', '€€', '€€€'][prixMoy] + '</b><p>budget indicatif, d’après les prix moyens.</p></article></div>' : ''); }
  function assiette(){ var ind = indicesDuScan(); if(!ind) return; var pris = choisir(ind), e = exclus(), une = false;
    var titres = ['Aucun aliment.','Un aliment.','Deux aliments.','Trois aliments.','Quatre aliments.'], prudent = MODE !== 'normal';
    var al = [];
    if(a('q3','enceinte') || a('q3','allaite') || a('q4','avk') || a('q4','quotidien') || a('q4','thyroide') || a('q5','renale') || a('q5','thyroide')) al.push('Tout changement alimentaire important se discute avec votre médecin ou votre pharmacien.');
    if(a('q4','quotidien')) al.push('Certains aliments interagissent avec des médicaments (le pamplemousse, par exemple) : parlez-en à votre pharmacien.');
    if(a('q8','acne')) al.push('Si vous avez des boutons douloureux, des cicatrices ou une acné qui dure : un médecin ou un dermatologue peut vous aider.');
    if(a('q8','eczema')) al.push('N’éliminez pas d’aliments sans avis médical, surtout chez l’enfant : cela peut créer une allergie.');
    if(a('q8','rosacee')) al.push('Si vous avez des rougeurs qui durent, parlez-en à un médecin ; les déclencheurs les plus cités sont le soleil, le stress, la chaleur, l’alcool, les épices et les boissons chaudes.');
    if((REP.q1 || []).some(function(v){ return v !== 'aucune'; })) al.push('Cela ne remplace pas l’avis de votre allergologue.');
    if(a('q7','vegan')) al.push('Pensez à la vitamine B12 : parlez-en à un professionnel de santé.');
    var h = HAUT + editTete(pris, ind, e, prudent, titres)
      + (prudent ? '<p class="lead">Sans vos réponses, nous ne gardons que des aliments sans aucun des 14 allergènes majeurs ni précaution médicale connue. Pour une assiette sur mesure, répondez à une seule question. <a href="#" id="vy-as-rep2" style="color:inherit">Répondre</a></p>' : '')
      + (prudent ? '' : affiner())
      + (pris.length ? '<div class="m" id="vy-as-detail" style="margin-top:44px">Le détail</div><h2 style="margin-top:8px">Aliment par aliment.</h2>' : '')
      + al.map(function(t){ return '<div class="alerte">' + esc(t) + '</div>'; }).join('')
      + pris.map(function(c, k){ var f = c.f, a2 = allegation(f), fa = fait(f); if(a2) une = true;
          var pr = (e.notes[f.id] || []).concat((f.precautions || []).filter(function(t){ return !/allégation|afficher|juriste/i.test(t); }));   // toutes les precautions de securite s'affichent
          return '<div class="rit" id="vy-as-f' + k + '"><i>' + n2(k) + '</i><div><h3>' + esc(f.nom) + '</h3><div class="sous">Idée pour votre assiette · ' + esc(f.portion_type) + ' · ' + saison(f) + '</div>'
            + (f.accroche ? '<p style="font:italic 400 17px/1.45 \'Playfair Display\',Georgia,serif;color:#151413">' + esc(f.accroche) + '</p>' : '')
            + '<p style="font-size:12.5px;opacity:.75">' + esc(composition(f)) + '</p>'
            + '<div class="preuve" style="margin-top:12px">Combien</div><p style="margin-top:4px">' + esc(f.portion_type) + '. ' + esc(FREQ[f.categorie] || 'Dans une alimentation variée.') + '' + '</p>'
            + (apports(f).length ? '<div class="preuve" style="margin-top:12px">Une portion apporte</div><p style="margin-top:4px">' + apports(f).map(esc).join('<br>') + '</p>' : '')
            + (a2 ? '<div class="alleg">' + esc(a2) + '</div>' : '') 
            + '<div class="preuve">Preuve ' + f.niveau_preuve_peau + ' · ' + PREUVE[f.niveau_preuve_peau] + '</div>'
            + (prix(f) ? '<div class="preuve" style="text-transform:none;letter-spacing:.2px;font-size:12.5px">' + esc(prix(f)) + (AFFINE.bio && f.bio_disponible ? ' Existe en bio.' : '') + '</div>' : '')
            + (f.allergenes_UE.length ? '<div class="prec">Allergènes : ' + f.allergenes_UE.map(function(z){ return AL_NOM[z] || z; }).join(', ') + ((f.allergenes_possibles || []).length ? ' ; selon la marque : ' + f.allergenes_possibles.map(function(z){ return AL_NOM[z] || z; }).join(', ') : '') + '.</div>' : '')
            + pr.map(function(t){ return '<div class="prec">' + esc(t) + '</div>'; }).join('')
            + (f.etudes.length ? '<details><summary>Ce que disent les études (' + f.etudes.length + ')</summary><p style="font-size:12.5px">Les références ci-dessous sont données pour information. Elles ne permettent pas de promettre un effet de cet aliment sur votre peau ; seules les mentions autorisées par l’Union européenne, affichées plus haut, décrivent un rôle d’un nutriment.</p>' + f.etudes.map(function(s){ return '<a href="' + esc(s.lien) + '" target="_blank" rel="noopener">' + esc(s.ref) + ' ↗</a>'; }).join('') + '</details>' : '')
            + credit(f.id)
            + (prudent ? '' : '<a href="#" class="vy-as-pas" data-id="' + f.id + '" style="display:inline-block;margin-top:12px;font-size:12.5px;letter-spacing:1.4px;text-transform:uppercase;color:#52716f">Retirer cet aliment</a>')
            + '</div></div>'; }).join('')
      + (une ? '<p class="fine">À intégrer dans une alimentation variée et équilibrée et un mode de vie sain.</p>' : '')
      + (AFFINE.usage === 'tendance' ? tendances() : '')
      + '<div id="vy-as-geo"></div>'
      + rythme()
      + '<div id="vy-as-combo"></div>'
      + recettes(pris, e.x)
      + (AFFINE.usage === 'tendance' ? '' : tendances())
      + (prudent ? '<button class="btn" type="button" id="vy-as-rep">Répondre à une seule question</button>'
        : '<h2>Vos réponses.</h2><p style="font:italic 18px/1.5 Georgia,serif">« ' + esc(phrase(SANTE)) + ' »</p><button class="btn sec" type="button" id="vy-as-rep">Modifier mes réponses</button>'
          + '<label style="display:flex;gap:12px;align-items:flex-start;margin-top:18px;font-size:14px;line-height:1.5;cursor:pointer"><input type="checkbox" id="vy-as-garder"' + (GARDER ? ' checked' : '') + ' style="margin-top:4px;width:18px;height:18px;accent-color:#173d3f"><span>Garder mes réponses sur cet appareil<br><small style="opacity:.7">La prochaine fois, une seule question vous sera posée. Vos réponses ne quittent pas cet appareil. Effacement automatique dans six mois.</small></span></label>'
          + (GARDER ? '<p class="fine"><a href="#" id="vy-as-effnow" style="color:inherit">Effacer maintenant</a></p>' : ''))
      + '<p class="fine">Eczéma ou psoriasis : n’éliminez aucun aliment sans avis médical, surtout chez l’enfant. Certains aliments interagissent avec des médicaments : parlez-en à votre pharmacien.</p>'
      + '<p class="fine">Information générale, pas un avis médical. Composition : table CIQUAL 2020 (ANSES). Allégations : registre de l’Union européenne, règlement (CE) n° 1924/2006.</p>';
    feuille(h, 'jour'); ecrireMemoire();
    document.getElementById('vy-as-rep').onclick = function(){ eviter(SANTE ? JSON.parse(JSON.stringify(SANTE)) : null); };
    var r2 = document.getElementById('vy-as-rep2'); if(r2) r2.onclick = function(ev){ ev.preventDefault(); eviter(); };
    ouvert.querySelectorAll('[data-af]').forEach(function(z){ z.onclick = function(){ var k = z.dataset.af, v = z.dataset.v;
      if(k === 'saison' || k === 'bio' || k === 'cuis') AFFINE[k] = !AFFINE[k];
      else if(k === 'cuisine'){ var i = AFFINE.cuisines.indexOf(v); if(i >= 0) AFFINE.cuisines.splice(i, 1); else if(AFFINE.cuisines.length < 3) AFFINE.cuisines.push(v); }
      else AFFINE[k] = AFFINE[k] === v ? null : v;
      var y = ouvert.scrollTop; assiette(); ouvert.scrollTop = y; }; });
    var pp = document.getElementById('vy-as-pp'); if(pp) pp.onclick = function(){ PASPOUR = []; ecrireMemoire(); assiette(); };
    ouvert.querySelectorAll('.vy-as-pas').forEach(function(z){ z.onclick = function(ev){ ev.preventDefault(); PASPOUR.push(z.dataset.id); ecrireMemoire(); var y = ouvert.scrollTop; assiette(); ouvert.scrollTop = y; }; });
    var gd = document.getElementById('vy-as-garder'); if(gd) gd.onchange = function(){ GARDER = gd.checked; if(GARDER) ecrireMemoire(); else effacer(); var y = ouvert.scrollTop; assiette(); ouvert.scrollTop = y; };
    var en = document.getElementById('vy-as-effnow'); if(en) en.onclick = function(ev){ ev.preventDefault(); effacer(); GARDER = false; var y = ouvert.scrollTop; assiette(); ouvert.scrollTop = y; };
    ouvert.querySelectorAll('[data-ry]').forEach(function(z){ z.onclick = function(){ var k = z.dataset.ry, v = z.dataset.v; if(k === 'd') REP.q9d = !REP.q9d; else REP[k] = REP[k] === v ? null : v;
      var sv = { q9s:REP.q9s, q9d:REP.q9d, q10p:REP.q10p }; versRep(ind); Object.assign(REP, sv); versRep(ind); ecrireMemoire(); var y = ouvert.scrollTop; assiette(); ouvert.scrollTop = y; }; });
    presDeVous(pris);
    ouvert.querySelectorAll('.vy-as-compte').forEach(function(el){ var fin = +el.dataset.n, t0 = performance.now(); (function k2(n){ var u = Math.min(1, (n - t0)/1400); el.textContent = Math.round(fin*(1 - Math.pow(1 - u, 3))); if(u < 1) requestAnimationFrame(k2); })(t0); });
    ouvert.querySelectorAll('a[href^="#vy-as-"]').forEach(function(z){ z.onclick = function(ev){ var c = document.getElementById(z.getAttribute('href').slice(1)); if(c){ ev.preventDefault(); c.scrollIntoView({ behavior:'smooth', block:'start' }); } }; });
    var brancherRec = function(){ ouvert.querySelectorAll('[data-onglet]').forEach(function(z){ z.onclick = function(){ ONGLET = z.dataset.onglet; OUVERTES = 3; var box = document.getElementById('vy-as-rec'); box.outerHTML = recettes(pris, e.x); brancherRec(); }; });
      var pl = document.getElementById('vy-as-plusrec'); if(pl) pl.onclick = function(){ OUVERTES += 6; var box = document.getElementById('vy-as-rec'); box.outerHTML = recettes(pris, e.x); brancherRec(); }; };
    brancherRec();
    var pt = function(){ var b = document.getElementById('vy-as-plustend'); if(b) b.onclick = function(){ TOUVERT = 99; var box = document.getElementById('vy-as-tend'); box.outerHTML = tendances(); pt(); }; }; pt();
    catalogue().then(function(){ var z = document.getElementById('vy-as-combo'); if(z) z.innerHTML = combos(ind, pris); }); }

  function rythme(){ if(a('q6','moins18')) return '<h2>Rythme.</h2><div class="rit"><i>01</i><div><h3>Bouger</h3><p>Une heure d’activité par jour en moyenne (OMS 2020), en jouant, en marchant, en faisant du sport.</p></div></div>';
    var l = [];
    l.push(['L’assiette', 'Cinq fruits et légumes par jour, des légumes secs au moins deux fois par semaine, un féculent complet par jour, une petite poignée de fruits à coque non salés, du poisson deux fois par semaine dont un gras.', 'Repères PNNS 2019, Santé publique France.']);
    var tca = true;   // QUESTIONNAIRE_V2 : la regle trouble alimentaire s'applique a tous (aucun grammage de restriction, aucun poids)
    l.push(['Plus souvent', 'Plus souvent des légumes secs, du poisson et des végétaux ; la charcuterie et la viande rouge, de temps en temps ; l’eau comme boisson.', 'Repères chiffrés du PNNS : mangerbouger.fr']);
    l.push(['Dormir', a('q9','moins6') || a('q9','6_7') ? 'Visez au moins sept heures par nuit.' : a('q9','plus9') ? 'Plus de neuf heures par nuit, d’habitude ? Cela peut valoir la peine d’en parler à votre médecin.' : 'Au moins sept heures par nuit.', a('q9','irregulier') ? 'Priorité à la régularité : même heure de lever, lumière du jour le matin. Travail de nuit : pas de jeûne ni de repas limités à une plage horaire sans avis médical.' : 'Des horaires réguliers, week-end compris.']);
    l.push(['Bouger', a('q10','moins4000') ? 'Ajoutez 1 000 pas par jour, pour viser environ 7 000.' : 'Environ 7 000 pas par jour.', '150 à 300 minutes d’activité modérée par semaine et deux séances de renforcement (OMS). Maladie du cœur, diabète traité ou reprise après une longue pause : demandez l’avis de votre médecin avant d’augmenter l’effort.']);
    if(a('q3','enceinte') || a('q3','allaite') || a('q3','projet')) l.push(['L’alcool', 'Pendant la grossesse, l’allaitement ou un projet de grossesse : zéro alcool.', 'Recommandation de Santé publique France.']);
    else l.push(['L’alcool', 'Moins, c’est mieux : il n’existe pas de consommation sans risque (OMS 2023).', 'Repère français : au maximum 10 verres par semaine, 2 par jour, et des jours sans. Enceinte, allaitante ou projet de grossesse : zéro alcool.']);
    l.push(['Le tabac', 'Le tabac et le soleil sont les deux premiers facteurs de vieillissement visible de la peau.', 'Pour arrêter : Tabac Info Service, 39 89.']);
    if(a('q6','65') && !a('q5','renale')) l.push(['Les protéines', 'Après 65 ans, des protéines à chaque repas (œufs, poisson, légumineuses) aident à garder vos muscles.', 'Quantité à valider avec votre médecin.']);
    var pu = function(k, v, t){ var on = k === 'd' ? REP.q9d : REP[k] === v; return '<span class="puce' + (on ? ' on' : '') + '" data-ry="' + k + '" data-v="' + v + '" style="font-size:12px;padding:8px 11px">' + t + '</span>'; };
    var ici = { 'Dormir':'<p style="margin-top:12px;font-size:12px;opacity:.75">Et vous, en général ?</p><div class="puces">' + pu('q9s','moins7','Moins de 7 h') + pu('q9s','7_9','7 à 9 h') + pu('q9s','plus9','Plus de 9 h') + pu('d','1','Horaires décalés ou de nuit') + '</div>',
      'Bouger':'<p style="margin-top:12px;font-size:12px;opacity:.75">Et vous, par jour ? Votre téléphone le mesure : app Santé ou Google Fit.</p><div class="puces">' + pu('q10p','moins4000','Moins de 4 000 pas') + pu('q10p','4000_7000','4 000 à 7 000') + pu('q10p','plus7000','Plus de 7 000') + '</div>' };
    return '<h2>Rythme.</h2><p class="lead">Les repères de santé les plus solides des grandes études, adaptés à vos réponses.</p>'
      + l.map(function(z, k){ return '<div class="rit"><i>' + n2(k) + '</i><div><h3>' + z[0] + '</h3><p>' + esc(z[1]) + '</p>' + (z[2] ? '<div class="preuve">' + esc(z[2]) + '</div>' : '') + (ici[z[0]] || '') + '</div></div>'; }).join(''); }

  var TYPES_R = [['jus_boisson','Jus et boissons'],['petit_dejeuner','Petit-déjeuner'],['entree','Entrées'],['plat','Plats'],['dessert','Desserts'],['encas','En-cas']], ONGLET = 'plat', OUVERTES = 3;
  var VERDICT = { prouve:['Prouvé', '#2f6b4f'], plausible:['Plausible', '#8a6a2c'], pas_demontre:['Pas démontré', '#6b6f73'], deconseille:['Déconseillé', '#a3473f'] }, TOUVERT = 4;
  function tendances(){ if(!TEND.length) return '';
    var carte = function(t){ var v = VERDICT[t.verdict] || ['', '#666']; return '<div class="rit"><div style="width:100%"><div style="display:flex;justify-content:space-between;gap:12px;align-items:baseline"><h3>' + esc(t.accroche || t.titre) + '</h3><span style="flex:none;font-size:12px;letter-spacing:1.4px;text-transform:uppercase;color:#fff;background:' + v[1] + ';padding:6px 10px;border-radius:999px">' + v[0] + '</span></div>'
      + '<p>' + esc(t.verdict_texte) + '</p>' + (t.ce_quon_peut_faire ? '<p><b style="font-weight:500">Ce que vous pouvez faire.</b> ' + esc(t.ce_quon_peut_faire) + '</p>' : '') + (t.prudence ? '<div class="prec">' + esc(t.prudence) + '</div>' : '')
      + ((t.etudes || []).length ? '<details><summary>Les études (' + t.etudes.length + ')</summary>' + t.etudes.map(function(e2){ return '<a href="' + esc(e2.lien) + '" target="_blank" rel="noopener">' + esc(e2.ref) + ' ↗</a>'; }).join('') + '</details>' : '') + '</div></div>'; };
    return '<div id="vy-as-tend"><div class="m" style="margin-top:46px">Collagène, matcha, vinaigre de cidre…</div><h2 style="margin-top:6px">Tendances.</h2><p class="lead">Ce que disent vraiment les études sur les tendances du moment. Sans parti pris, sources à l’appui.</p>'
      + TEND.slice(0, TOUVERT).map(carte).join('') + (TEND.length > TOUVERT ? '<button class="btn sec" type="button" id="vy-as-plustend">Voir les ' + (TEND.length - TOUVERT) + ' autres tendances</button>' : '') + '</div>'; }
  function recettesSures(x){ var al = (REP.q1 || []).filter(function(v){ return v !== 'aucune'; }), mois = new Date().getMonth() + 1;
    return RECS.filter(function(r){
      if(r.ingredients.some(function(g){ return g.aliment_id && x[g.aliment_id]; })) return false;
      if((r.allergenes_UE || []).some(function(z){ return al.indexOf(z) >= 0; })) return false;
      if(a('q1','sulfites') && r.ingredients.some(function(g){ return /abricot_sec|raisin_sec|figue_seche|capres/.test(g.aliment_id || ''); })) return false;
      if((a('q3','enceinte') || a('q3','allaite')) && r.oeuf_peu_cuit) return false;
      /* 01/10 (audit) : reins ou calculs, les recettes riches en oxalates ou tres salees sont retirees */
      if(a('q5','renale') && r.ingredients.some(function(g){ return /rhubarbe|th[ée] noir|the_noir|oseille|[ée]pinard|fleur de sel|anchois|c[âa]pre|sauce.?soja|olive noire|olives/i.test((g.libelle || '') + ' ' + (g.aliment_id || '')); })) return false;
      if((r.allergenes_possibles || []).some(function(z){ return al.indexOf(z) >= 0; })) return false;
      if(a('q7','vege') && (r.regimes || []).indexOf('vegetarien') < 0) return false;
      if(a('q7','vegan') && (r.regimes || []).indexOf('vegan') < 0) return false;
      if(a('q5','coeliaque') && (r.regimes || []).indexOf('sans_gluten') < 0) return false;
      if((a('q8','rosacee')) && (r.notes || []).some(function(n){ return /pic/.test(n) && /épic|epice/i.test(n); })) return false;
      return true; }); }
  function recettes(pris, x){ if(!RECS.length) return ''; var ids = pris.map(function(c){ return c.f.id; }), ind = indicesDuScan() || {}, mois = new Date().getMonth() + 1;
    var sures = recettesSures(x), n = sures.length;
    var note = function(r){ var sc = r.ingredients.filter(function(g){ return ids.indexOf(g.aliment_id) >= 0; }).length * 3 + ((r.cibles_peau || []).indexOf(ind.i1) >= 0 ? 1.5 : 0) + ((r.cibles_peau || []).indexOf(ind.i2) >= 0 ? .75 : 0);
      if(AFFINE.saison) sc += (r.saison || []).indexOf(mois) >= 0 ? 1 : ((r.saison || []).length && (r.saison || []).length < 12 ? -1 : 0);
      if(AFFINE.cuisines.length && AFFINE.cuisines.indexOf(r.cuisine) >= 0) sc += 1.5; if(AFFINE.budget === 'serre') sc += ({ 1:1, 2:0, 3:-1.5 })[r.prix_niveau] || 0;
      if(AFFINE.usage === 'quotidien') sc += r.usage === 'quotidien' ? .5 : -1; return sc; };
    var liste = sures.filter(function(r){ return r.type === ONGLET; }).sort(function(p, q){ return note(q) - note(p); });
    var carte = function(r, k){ var cout = ['', '€', '€€', '€€€'][r.prix_niveau] || '';
      /* 30/09 (Charles : « les recettes, il faut des photos ») : une composition faite des vrais ingredients, en photos detourees */
      var vus = {}, ph = r.ingredients.map(function(g){ return g.aliment_id; }).filter(function(id){ if(!id || vus[id] || !CREDITS[id]) return false; vus[id] = 1; return true; }).slice(0, 4);
      var visu = ph.length ? '<div class="rec-visu n' + ph.length + '" aria-hidden="true">' + ph.map(function(id, m){ return '<img src="' + BASE + 'photos/' + id + '.png" alt="" loading="lazy" style="--k:' + m + '">'; }).join('') + '</div>' : '';
      return '<div class="rit rec"><i>' + n2(k) + '</i>' + visu + '<div><h3>' + esc(r.nom) + '</h3>' + (r.accroche ? '<p class="rec-acc">' + esc(r.accroche) + '</p>' : '') + '<div class="sous">' + r.temps_min + ' min · ' + r.personnes + ' pers. · ' + (cout ? esc(cout) + ' · ' : '') + esc((CUISINES.filter(function(c){ return c[0] === r.cuisine; })[0] || ['', 'Universelle'])[1]) + '</div>'
        + '<details><summary>Ingrédients et étapes</summary><p>' + r.ingredients.map(function(g){ return esc(g.quantite + ' ' + g.libelle); }).join(' · ') + '</p>' + r.etapes.map(function(e2, m){ return '<p><b style="font-weight:500">' + (m + 1) + '.</b> ' + esc(e2); }).join('</p>') + '</p>'
        + (r.notes || []).map(function(t){ return '<div class="prec" style="color:#52716f">' + esc(t) + '</div>'; }).join('') + '</details>'
        + '<div class="prec" style="color:#52716f">Allergènes : ' + ((r.allergenes_UE || []).length ? r.allergenes_UE.map(function(z){ return NOMS_AL[z] || z; }).join(', ') : 'aucun des 14 allergènes réglementés') + ((r.allergenes_possibles || []).length ? ' ; selon la marque : ' + r.allergenes_possibles.map(function(z){ return NOMS_AL[z] || z; }).join(', ') : '') + '.</div></div></div>'; };
    return '<div id="vy-as-rec"><div class="m" style="margin-top:46px">' + n + ' recettes pour vous</div><h2 style="margin-top:6px">Recettes.</h2>'
      + '<div class="puces" style="flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -24px 6px;padding:0 24px 4px">' + TYPES_R.map(function(t){ var c = sures.filter(function(r){ return r.type === t[0]; }).length; return '<span class="puce' + (t[0] === ONGLET ? ' on' : '') + '" data-onglet="' + t[0] + '" style="flex:none;font-size:12.5px;padding:9px 12px">' + t[1] + ' · ' + c + '</span>'; }).join('') + '</div>'
      + liste.slice(0, OUVERTES).map(carte).join('')
      + (liste.length > OUVERTES ? '<button class="btn sec" type="button" id="vy-as-plusrec">Voir ' + Math.min(6, liste.length - OUVERTES) + ' recettes de plus</button>' : '')
      + '<p class="fine">Aucune recette ne porte d’allégation de santé. </p></div>'; }

  /* ---- PRES DE VOUS : ou acheter ces aliments, autour de soi (OpenStreetMap, sans compte) ----
     La position est arrondie a environ 1 km avant d'etre envoyee, et n'est jamais enregistree. */
  /* 30/09 (Charles) : pour le moment, seulement les magasins bio et supermarches bio */
  var ENSEIGNES_BIO = "Biocoop|Naturalia|La Vie Claire|Bio c.? ?Bon|Comptoirs de la Bio|Eau Vive|Satoriz|Natur.?O|Biomonde|Marcel ?& ?Fils|Mon Bio";
  var TYPES = [
    { id:'bio', nom:'Magasins bio', q:'nwr["shop"="organic"];nwr["organic"="only"]["shop"];nwr["shop"~"supermarket|convenience|health_food|greengrocer"]["name"~"' + ENSEIGNES_BIO + '",i];nwr["shop"]["brand"~"' + ENSEIGNES_BIO + '",i]', pour:['*'] } ];
  function presDeVous(pris){ var z = document.getElementById('vy-as-geo'); if(!z) return;
    var cats = {}; pris.forEach(function(c){ cats[c.f.categorie] = 1; });
    var types = TYPES.filter(function(t){ return t.pour.indexOf('*') >= 0 || t.pour.some(function(c){ return cats[c]; }); });
    z.innerHTML = '<h2>Près de vous.</h2><p class="lead">Les magasins bio autour de vous, pour trouver ces aliments.</p>'
      + '<button class="btn" type="button" id="vy-as-geo-go">Trouver près de moi</button>'
      + '<p class="fine">Votre position est arrondie à environ 1 km, sert seulement à cette recherche sur la carte ouverte OpenStreetMap, et n’est jamais enregistrée.</p>';
    document.getElementById('vy-as-geo-go').onclick = function(){ var b = this; b.disabled = true; b.textContent = 'Recherche autour de vous…';
      if(!navigator.geolocation){ b.textContent = 'Localisation indisponible sur cet appareil'; return; }
      navigator.geolocation.getCurrentPosition(function(pos){ chercher(z, types, Math.round(pos.coords.latitude*100)/100, Math.round(pos.coords.longitude*100)/100, 1500); },
        function(){ b.disabled = false; b.textContent = 'Trouver près de moi'; var p2 = document.createElement('div'); p2.className = 'alerte'; p2.textContent = 'La localisation est refusée. Vous pouvez l’autoriser dans les réglages du navigateur.'; z.appendChild(p2); },
        { enableHighAccuracy:false, timeout:12000, maximumAge:600000 }); }; }
  function horaires(h){ var J = { Mo:'lun.', Tu:'mar.', We:'mer.', Th:'jeu.', Fr:'ven.', Sa:'sam.', Su:'dim.', PH:'fériés' };
    return String(h).replace(/\b(Mo|Tu|We|Th|Fr|Sa|Su|PH)\b/g, function(m){ return J[m]; }).replace(/(\d{2}):(\d{2})/g, function(m, H, M){ return (+H) + ' h' + (M === '00' ? '' : ' ' + M); })
      .replace(/-/g, '–').replace(/;\s*/g, ' · ').replace(/\boff\b/g, 'fermé'); }
  function distance(a1, o1, a2, o2){ var R = 6371000, r = Math.PI/180, d1 = (a2 - a1)*r, d2 = (o2 - o1)*r, h = Math.sin(d1/2)*Math.sin(d1/2) + Math.cos(a1*r)*Math.cos(a2*r)*Math.sin(d2/2)*Math.sin(d2/2); return 2*R*Math.asin(Math.sqrt(h)); }
  function chercher(z, types, lat, lon, rayon){
    var q = '[out:json][timeout:20];(' + types.map(function(t){ return t.q.split(';').map(function(x){ return x + '(around:' + rayon + ',' + lat + ',' + lon + ');'; }).join(''); }).join('') + ');out center tags 200;';
    var essai = function(url){ return fetch(url + '?data=' + encodeURIComponent(q)).then(function(r){ if(!r.ok) throw 0; return r.json(); }); };
    essai('https://overpass-api.de/api/interpreter').catch(function(){ return essai('https://overpass.kumi.systems/api/interpreter'); }).then(function(j){
      var el = (j.elements || []).map(function(e){ var t = e.tags || {}, la = e.lat || (e.center && e.center.lat), lo = e.lon || (e.center && e.center.lon); if(!la) return null;
        var type = 'bio';
        if(!type) return null; return { type:type, nom:t.name || t.brand || (type === 'marche' ? 'Marché' : ''), h:t.opening_hours || '', la:la, lo:lo, d:distance(lat, lon, la, lo) }; }).filter(function(x){ return x && x.nom; });
      if(el.length < 4 && rayon < 5000) return chercher(z, types, lat, lon, 4000);
      var ios = /iP(hone|ad|od)/.test(navigator.userAgent);
      var lien = function(x){ return ios ? 'https://maps.apple.com/?daddr=' + x.la + ',' + x.lo + '&q=' + encodeURIComponent(x.nom) : 'https://www.google.com/maps/dir/?api=1&destination=' + x.la + ',' + x.lo; };
      var html = types.map(function(t){ var l = el.filter(function(x){ return x.type === t.id; }).sort(function(p, q2){ return p.d - q2.d; }).slice(0, 5); if(!l.length) return '';
        return '<div class="rit"><i>' + t.nom.slice(0, 2).toLowerCase() + '</i><div><h3>' + esc(t.nom) + '</h3>' + l.map(function(x){ return '<a class="prod" style="background:rgba(24,59,62,.06);color:#183b3e" href="' + lien(x) + '" target="_blank" rel="noopener"><span><b>' + (x.d < 1000 ? Math.round(x.d/10)*10 + ' m' : String(Math.round(x.d/100)/10).replace('.', ',') + ' km') + ' · itinéraire</b>' + esc(x.nom) + (x.h ? '<br><small style="opacity:.7">' + esc(horaires(x.h)) + '</small>' : '') + '</span></a>'; }).join('') + '</div></div>'; }).join('');
      z.innerHTML = '<h2>Près de vous.</h2>' + (html || '<p class="lead">Aucun commerce référencé autour de vous sur la carte ouverte.</p>')
        + '<p class="fine">Distances à vol d’oiseau depuis votre position arrondie. Commerces et horaires : © contributeurs OpenStreetMap (licence ODbL), à vérifier avant de vous déplacer.</p>'; })
    .catch(function(){ var b = document.getElementById('vy-as-geo-go'); if(b){ b.disabled = false; b.textContent = 'Réessayer'; } }); }

  /* apercu pour la page de resultats : sans reponses gardees, l'assiette prudente (aucun des 14 allergenes, aucune precaution medicale) */
  function apercu(){ return charger().then(function(){ var ind = indicesDuScan(); if(!ind) return null; var m = lireMemoire();
    if(m){ SANTE = m.sante; MODE = 'normal'; PASPOUR = m.paspour || []; } else { SANTE = null; MODE = 'prudent'; }
    versRep(ind); var pris = choisir(ind);
    return { prudent:MODE !== 'normal', i1:INDICES[ind.i1], i2:ind.i2 ? INDICES[ind.i2] : null, n1:ind.n1, aliments:pris.map(function(c){ var f = c.f; return { id:f.id, nom:f.nom.split(' (')[0].split(',')[0], categorie:NOM_CAT[f.categorie] || '', portion:(f.portion_type || '').split(' (')[0], accroche:f.accroche || '', photo:BASE + 'photos/' + f.id + '.png', teinte:TEINTE[f.categorie] || '#999', saison:saison(f), preuve:f.niveau_preuve_peau }; }) }; }); }

  /* 30/09 (Charles : « il manque la correlation avec la peau, explicite ») : les allegations sante AUTORISEES (registre UE,
     reglement 432/2012) qui parlent de la peau, calculees sur la vraie composition CIQUAL. Condition legale : l'aliment doit etre
     au moins « source » du nutriment (15 % des VNR pour 100 g ; « riche en » a partir de 30 %). Libelles recopies mot pour mot.
     Vitamine A et cuivre restent volontairement absents (decision de la revue science et droit du 29/09). */
  var PEAU_UE = [
    ['vitamine_c_mg', 80, 'vitamine C', 'La vitamine C contribue à la formation normale de collagène pour assurer la fonction normale de la peau.'],
    ['zinc_mg', 10, 'zinc', 'Le zinc contribue au maintien d’une peau normale.'],
    ['riboflavine_mg', 1.4, 'riboflavine (vitamine B2)', 'La riboflavine contribue au maintien d’une peau normale.'],
    ['niacine_mg', 16, 'niacine (vitamine B3)', 'La niacine contribue au maintien d’une peau normale.'],
    ['iode_ug', 150, 'iode', 'L’iode contribue au maintien d’une peau normale.'] ];
  function lienPeau(f){ var t = (f.ciqual && f.ciqual.teneurs_pour_100g) || {}, out = [];
    PEAU_UE.forEach(function(p){ var v = Number(t[p[0]]); if(!isFinite(v)) return; var pct = Math.round(v / p[1] * 100); if(pct < 15) return;
      out.push({ niveau: pct >= 30 ? 'Riche en' : 'Source', nutriment: p[2], pct: pct, allegation: p[3] }); });
    return out.sort(function(a1, b1){ return b1.pct - a1.pct; }); }
  window.AlimentCore = {
    skinLinks:lienPeau,
    load:charger, catalogue:catalogue, choose:choisir, exclusions:exclus, prudentOk:prudentOk,
    indices:indicesDuScan, phrase:phrase, valid:valide, composition:composition, contributions:apports,
    claim:allegation, credit:credit, season:saison, fact:fait, recipes:recettes, safeRecipes:recettesSures,
    rhythm:rythme, combos:combos, trends:tendances, near:presDeVous,
    labels:INDICES, evidence:PREUVE, frequency:FREQ, allergens:ALLERG, allergenNames:NOMS_AL,
    cuisines:CUISINES, recipeTypes:TYPES_R,
    state:function(s,mode,prefs,removed,ry){SANTE=s;MODE=mode;GARDER=false;AFFINE=prefs;PASPOUR=removed||[];if(ry)Object.assign(REP,ry);versRep(indicesDuScan());},
    get:function(){return {data:DATA,credits:CREDITS,recipes:RECS,trends:TEND,combos:COMBOS,products:PRODUITS,rep:REP}},
    recipeTab:function(tab,n){ONGLET=tab;OUVERTES=n||3;},
    trendCount:function(n){TOUVERT=n;}
  };
})();
