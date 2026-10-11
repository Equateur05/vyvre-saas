/* VYVRE — LE CHOIX DES SOINS, une seule regle (07/10/2026)
   Charge par le scan (/scan/index.html), les pages de marque (/m/<marque>) et le protocole complet
   (/scan/PROTOCOL_UNIVERSAL.html). Decision de Charles : « Un seul cerveau, exactement ; et le soir different. »

   - rituel() : les soins du scan = le matin du protocole (nettoyer, serum, creme, proteger ;
     le contour des yeux remplace le nettoyant quand la regle des yeux le retient).
   - soir()   : le soir du protocole, choisi avec la meme logique ciblee (top 3 des points faibles +
     bonus de cible), sans reprendre un produit du matin.
   - Un seul actif fort (retinoide ou acide exfoliant) sur toute la routine, nettoyant compris ;
     aucun si les rougeurs sont dans les points faibles.
   - Jamais une fiche reservee aux Etats-Unis, jamais une photo de fond_plein.json, jamais un SPF < 30 lisible.
   - enregistrer() / lire() : le rituel du scan reste sur l'appareil, lie au scan qui l'a produit
     (vyvre_rituel + vyvre_rituel_lien : meme scores, meme vyvre_scan_at, meme marque).
   - 11/10/2026 : acne / imperfections (voir profilAcne et acneOk plus bas). Declaree avant le scan, ou deduite
     d'un terrain gras a pores visibles : textures riches, huiles, grains et alcool en tete ecartes, actifs
     utiles privilegies (niacinamide, BHA, azelaique, zinc, retinal ou retinol doux le soir), memes regles
     d'actif fort et de rougeurs. Jamais un medicament (peroxyde de benzoyle, adapalene, tretinoine...). */
(function (root) {
  'use strict';

  var CRITERES = ['wrinkles', 'firmness', 'glow', 'hydration', 'redness', 'pores', 'sebum', 'pigmentation'];

  /* ---------- la peau ---------- */
  /* sebum et pigmentation : score haut = probleme ; les autres : score bas = probleme */
  function severite(s) {
    s = s || {};
    var n = function (k) { var v = Number(s[k]); return isFinite(v) ? v : 50; };
    return {
      wrinkles: 100 - n('wrinkles'), firmness: 100 - n('firmness'), glow: 100 - n('glow'),
      hydration: 100 - n('hydration'), redness: 100 - n('redness'), pores: 100 - n('pores'),
      sebum: n('sebum'), pigmentation: n('pigmentation')
    };
  }
  function topDe(sev, n) {
    return Object.keys(sev).map(function (k) { return [k, sev[k]]; })
      .sort(function (a, b) { return b[1] - a[1]; })
      .slice(0, n || 3).map(function (e) { return { concern: e[0], severity: e[1] }; });
  }
  function scoresValides(s) {
    if (!s || typeof s !== 'object') return false;
    for (var i = 0; i < CRITERES.length; i++) { var v = s[CRITERES[i]]; if (typeof v !== 'number' || !isFinite(v)) return false; }
    return true;
  }
  function signature(s) { return CRITERES.map(function (k) { return Math.round(Number(s && s[k])); }).join(','); }

  /* ---------- ce que la personne a dit avant le scan (memes regles que l'ecran d'avant-scan) ---------- */
  /* 11/10 : « acne » pese sur les pores seulement (pas sur le sebum : une peau seche peut avoir des boutons) ;
     le reste passe par profilAcne / acneOk */
  var GOALS = { antiage: ['wrinkles', 'firmness'], glow: ['glow'], hydration: ['hydration'], redness: ['redness'], pores: ['pores'], pigmentation: ['pigmentation'], sebum: ['sebum'], acne: ['pores'] };
  var AGE = {
    u25: { wrinkles: -20, firmness: -20, sebum: 10, pores: 10 }, '25': { wrinkles: -10, firmness: -10, glow: 10, pores: 8 },
    '35': { wrinkles: 14, firmness: 10, pigmentation: 10, glow: 6 }, '45': { wrinkles: 20, firmness: 20, pigmentation: 12 },
    '55': { wrinkles: 26, firmness: 28, hydration: 14, pigmentation: 8 }
  };
  function booster(sev, prefs) {
    if (!prefs) return sev;
    (prefs.goals || []).forEach(function (g) { (GOALS[g] || []).forEach(function (c) { if (sev[c] != null) sev[c] += 40; }); });
    var a = AGE[prefs.age]; if (a) for (var c in a) if (sev[c] != null) sev[c] += a[c];
    return sev;
  }
  function cibles(prefs) { var o = []; ((prefs && prefs.goals) || []).forEach(function (g) { o = o.concat(GOALS[g] || []); }); return o; }
  /* famille de maisons + pays + marques ; moins de 3 produits : on relache le pays, puis la famille */
  var EU = { DE: 1, CH: 1, SE: 1, BE: 1, NL: 1, ES: 1, IT: 1, AT: 1, DK: 1, PT: 1, MC: 1, HU: 1, IE: 1, PL: 1 };
  var LADDER = [{}, { origine: 1 }, { origine: 1, univers: 1 }];
  function filtrePrefs(list, prefs, marques) {
    if (!prefs) return { list: list, niveau: 0 };
    marques = marques || {};
    var region = function (slug) { var b = marques[slug]; if (!b) return null; return EU[b.pays] ? 'EU' : b.pays; };
    var M = prefs.marques || [], U = prefs.univers || [], O = prefs.origine || [];
    var ok = function (p, skip) {
      var b = marques[p.brand] || {};
      if (M.length && M.indexOf(p.brand) < 0) return false;
      if (!skip.univers && U.length && U.indexOf(b.univers) < 0) return false;
      if (!skip.origine && O.length && O.indexOf(region(p.brand)) < 0) return false;
      return true;
    };
    for (var i = 0; i < LADDER.length; i++) {
      var out = list.filter(function (p) { return ok(p, LADDER[i]); });
      if (out.length >= 3) return { list: out, niveau: i };
    }
    return { list: list, niveau: -1 };
  }

  /* ---------- ce qu'est un produit ---------- */
  function nom(p) { return String(p._n || p.name || '').toLowerCase(); }
  function raisons(p) { return (p.score_raisons || []).join(' | ').toLowerCase(); }
  function primaire(p) { return (p && p.targets || [])[0] || null; }
  function cs(p) { return (p && p.concern_scores) || {}; }
  var RX = {
    remover: /d[ée]maquill|cleansing (oil|balm|milk|water)|make-?up remov|micellar|micellaire|balm cleanser|oil cleanser/,
    night: /\bnuit\b|night|overnight|\bpm\b|sleeping|nocturne/,
    day: /\bjour\b|\bday\b|daily|\bam\b|morning|matin/,
    spf: /\bspf\b|\bupf\b|solaire|sunscreen|sun ?screen|sun cream|sun protect|\buv\b/,
    retino: /r[ée]tin(?:ol|al|oate|yl)|retinoid|r[ée]tino[iï]de/,
    notRetino: /bakuchiol|alternative/,
    acid: /\bpeel|peeling|\baha\b|\bbha\b|\bpha\b|glycoli|salicyl|lactic|lactique|mandel|resurfa|exfoli|gommage|gommant|scrub|buffing/,
    vitc: /vitamine? c\b|vit\.? ?c\b|\bc[- ]?(?:firma|tetra|e ferulic)|ascorbi/,
    /* pas un geste quotidien du visage */
    pas: /patch|\bpads?\b|\bmask\b|masque|sheet|\blip\b|l[èe]vres|\bstrips?\b/,
    us: /\b(us|usa|u\.s\.)\s*only\b|\bonly\s+(in|for)\s+(the\s+)?(us|usa)\b|^\s*\[subscr/i,
    cernes: /cerne|dark circle|ojera|occhiaie|augenring|olheira|kringen|puff|poche|de-puff/,
    /* 11/10 : un medicament n'est jamais un soin propose (peroxyde de benzoyle : medicament en France, interdit
       en cosmetique dans l'UE ; adapalene, tretinoine, isotretinoine, antibiotiques). Les deux fiches Neutrogena
       au peroxyde de benzoyle ne le disent pas dans leur nom : elles sont nommees ici. */
    medic: /benzoyl|peroxyde de benzoyle|adapal[eè]n|differin|tr[ée]tino[iï]n|isotr[ée]tino|clindamy|[ée]rythromy|antibioti|on-the-spot acne treatment|stubborn acne spot gel/,
    /* acne : textures riches et huiles (nom), gommages a grains, et ce qui dit « sans huile / non comedogene » */
    riche: /\bbaume\b|\bbalm\b|\brich\b|\briche\b|\bbutter\b|\bbeurre\b|\bhuile\b|\boils?\b|cold cream|onguent|ointment/,
    sansHuile: /oil[- ]?free|sans huile|non[- ]?com[ée]dog|oil[- ]?control|anti[- ]?(?:shine|brillance)/,
    grains: /scrub|gommage|grains|beads|microderm|polish|buffing/,
    acneNom: /acn[eé]|blemish|imperfection|bouton|pimple|breakout|effaclar|s[ée]biaclear|cleanance|normaderm|s[ée]bium|keracnyl|hyseac|niacinamid|azela|salicyl|\bbha\b|\bzinc\b|tea tree|succini|soufre|sulfur/
  };
  function exclu(n) {
    return n.indexOf('mains') >= 0 || n.indexOf(' main ') >= 0 || n.indexOf('hand cream') >= 0 || n.indexOf('hand balm') >= 0 ||
      n.indexOf('corps') >= 0 || n.indexOf('body ') >= 0 || n.indexOf(' body') >= 0 ||
      n.indexOf('eau de toilette') >= 0 || n.indexOf('eau de cologne') >= 0 || n.indexOf('parfum') >= 0 || n.indexOf('fragrance') >= 0 ||
      n.indexOf('cheveux') >= 0 || n.indexOf('hair ') >= 0 || n.indexOf('shampoo') >= 0 ||
      n.indexOf('lip balm') >= 0 || n.indexOf('lipstick') >= 0 || n.indexOf('vernis') >= 0 || n.indexOf('nail') >= 0 ||
      n.indexOf('bougie') >= 0 || n.indexOf('candle') >= 0 || n.indexOf('neck') >= 0 || n.indexOf('décolleté') >= 0 || /\bcou\b/.test(n);
  }
  function inciRang(r, re) { var m = r.match(re); return m ? +m[1] : null; }
  function estRetino(p) {
    var n = nom(p), r = raisons(p);
    if (RX.notRetino.test(n)) return false;
    if (RX.retino.test(n)) return true;
    if (/retin(?:ol|al) dans le nom/.test(r)) return true;
    if (/retinol \(texte\)/.test(r) && !/bakuchiol/.test(r)) return true;
    var k = inciRang(r, /retin(?:ol|al|oate)\s*\(inci #(\d+)\)/);
    return k != null && k <= 20;
  }
  function estAcide(p) {
    var n = nom(p), r = raisons(p);
    if (p.categorie === 'exfoliant') return true;
    if (RX.acid.test(n)) return true;
    if (/bha\/salicylique \(texte\) \(nom/.test(r)) return true;
    var k = inciRang(r, /(?:acide salicylique \/ bha|acide glycolique|acide lactique|pha) \(inci #(\d+)\)/);
    return k != null && k <= 15;
  }
  /* l'actif fort : un seul par routine, nettoyant compris */
  function estFort(p) { return estRetino(p) || estAcide(p); }
  function estVitC(p) { return RX.vitc.test(nom(p)) || /vitamine c (pure|stable)/.test(raisons(p)); }
  function estNuit(p) { var r = raisons(p); return RX.night.test(nom(p)) || (/soin de nuit/.test(r) && !/soin de jour/.test(r)); }
  function estDemaq(p) { return RX.remover.test(nom(p)); }
  function niveauSpf(p) { var m = nom(p).match(/\b(?:spf|fps|lsf)\s?(\d{1,3})/); return m ? +m[1] : null; }
  function spfBas(p) { var l = niveauSpf(p); return l != null && l < 30; }
  /* le moment impose par la nature du produit : 'am', 'pm', 'ampm' ou null (libre) */
  function moment(p) {
    var n = nom(p), c = p.categorie, r = raisons(p);
    if (c === 'solaire-visage' || RX.spf.test(n)) return 'am';
    if ((c === 'nettoyant' || c === 'huile') && estDemaq(p)) return 'pm';
    if (estRetino(p)) return 'pm';
    if (c === 'nettoyant') return 'ampm';
    if (estAcide(p)) return 'pm';
    if (c === 'serum' && estVitC(p) && !RX.night.test(n)) return 'am';
    if (c === 'contour-yeux' || c === 'lotion') return RX.night.test(n) ? 'pm' : 'ampm';
    if (estNuit(p)) return 'pm';
    if (c === 'creme' && (RX.day.test(n) || (/soin de jour/.test(r) && !/soin de nuit/.test(r)))) return 'am';
    if (c === 'huile') return 'pm';
    return null;
  }
  /* une creme vraiment hydratante : l'hydratation en premiere ou deuxieme cible, et notee comme telle */
  function hydratante(p) { var t = (p.targets || []).slice(0, 2); return t.indexOf('hydration') >= 0 && (cs(p).hydration || 0) >= 0.7; }
  function photo(p) { return p.cutout_url || p.image_url || ''; }
  function cle(p) { return (String(p.brand || '') + '|' + String(p.name || '')).trim().toLowerCase(); }
  function memeProduit(a, b) { return a.id === b.id || (photo(a) && photo(a) === photo(b)) || cle(a) === cle(b); }
  function note(p, top) {
    var c = cs(p), m = 0, t = p.targets || [];
    for (var i = 0; i < top.length; i++) m += ((c[top[i].concern] || 0) + (t.indexOf(top[i].concern) >= 0 ? 0.3 : 0)) * top[i].severity;
    return m;
  }
  /* les produits qu'on peut montrer : pas les fiches US, une photo, pas une photo a fond plein, un soin du visage */
  function montrables(list, fondPlein) {
    fondPlein = fondPlein || {};
    return (list || []).filter(function (p) {
      if (!p || !p.id || !p.name || RX.us.test(p.name)) return false;
      if (RX.medic.test(nom(p))) return false;
      if (!photo(p)) return false;
      if (fondPlein[String(p.cutout_url || '').split('?')[0]]) return false;
      return !exclu(nom(p));
    });
  }

  /* ---------- ACNE / IMPERFECTIONS (11/10/2026) ----------
     Sources : AAD (Reynolds et al., JAAD 2024 ; fiche « Acne: tips for managing »), EDF/EADV (S3, Nast et al.,
     JEADV 2016), SFD 2015, Araviiskaia & Dreno JEADV 2016, Draelos & DiNardo JAAD 2006 (comedogenicite).
     Detail et tableaux : _audit_acne_scan_2026-10-11.md a la racine du projet.

     DECLAREE : l'objectif « acne » choisi avant le scan (ou dans le questionnaire du protocole).
     DEDUITE  : le scan ne voit pas les boutons. Il lit seulement un TERRAIN a tendance acneique :
                sebum >= 60 (reflets de la zone T, relatifs a la peau ; echelle 10-75)
                ET pores <= 50 (points sombres comptes ; echelle 35-85, valeur neutre 62)
                ET la mesure des pores a vraiment ete lue (scores.analyses.pores.neutre absent).
                Le detecteur clinical.acne du moteur n'est PAS utilise : seuil L* absolu (L < 60), qui vise
                d'office les peaux foncees, jamais valide. Seuils a recaler sur de vrais testeurs.
     SECHE    : acne et sebum < 45, ou peau « seche » dans le protocole : pas de matifiant, d'argile ni d'alcool,
                et AUCUN actif fort (une peau seche a boutons est souvent deja sous traitement assechant :
                on ne cumule pas, on hydrate et on protege ; Araviiskaia & Dreno 2016). */
  var ACNE_SEBUM = 60, ACNE_PORES = 50, ACNE_SEC = 45;
  function profilAcne(scores, goals) {
    if ((goals || []).indexOf('acne') >= 0) return 'declare';
    var s = scores || {}, a = s.analyses || {};
    if (a.pores && a.pores.neutre) return null;
    var seb = Number(s.sebum), po = Number(s.pores);
    return (isFinite(seb) && isFinite(po) && seb >= ACNE_SEBUM && po <= ACNE_PORES) ? 'deduit' : null;
  }
  /* ecarte pour une peau a boutons. dur : huiles, baumes et textures riches nommees, karite ou occlusifs en tete,
     plusieurs huiles vegetales en tete, gommage a grains, alcool en tete de liste. mou (premier passage seulement) :
     « texture riche » lue dans la description, sauf peau seche. */
  function acneOk(p, sec, dur) {
    var n = nom(p), r = raisons(p);
    if (p.categorie === 'huile') return false;
    if (RX.riche.test(n) && !RX.sansHuile.test(n)) return false;
    if (/texture riche \(nom/.test(r) || /(?:beurre de karite|occlusifs) \(inci #[1-5]\)/.test(r) || /[2-9] huile\(s\) vegetale/.test(r)) return false;
    if (RX.grains.test(n) && !/enzym/.test(n)) return false;
    if (/alcool en tete/.test(r)) return false;
    if (!dur && !sec && /texture riche/.test(r)) return false;
    return true;
  }
  /* ce qui aide une peau a boutons, d'apres les champs du catalogue (nom, raisons) : 0 a 2 */
  function acneAtout(p) {
    var n = nom(p), r = raisons(p), k = 0;
    if (RX.acneNom.test(n)) k += 1;
    if (/anti-imperfections/.test(r)) k += 1;
    if (/acide salicylique|bha\/salicylique|niacinamide|zinc|acide azelaique|tea tree|acide succinique|retin(?:al|ol)/.test(r)) k += 0.6;
    if (/purifiant/.test(r)) k += 0.3;
    if (RX.sansHuile.test(n)) k += 0.4;
    return Math.min(k, 2);
  }
  /* asseche une peau deja seche : matifiant en premiere cible, argile, charbon */
  function asseche(p) { var r = raisons(p); return primaire(p) === 'sebum' || /argile|charbon|clay|charcoal/.test(nom(p)) || /argile \/ charbon \(inci #[1-5]\)/.test(r); }
  /* un retinoide « doux » : pas les concentrations hautes ni les noms « max / extreme » */
  function retinoFort(p) { return estRetino(p) && /\b(?:1|1[.,]5|2)\s?%|\bmax\b|extreme|intense/.test(nom(p)); }
  /* le selecteur, pour une peau a boutons : d'abord tout ce qui est ecarte, puis seulement le « dur » ;
     le classement favorise les produits utiles ; rien de plus si rien ne passe (une etape vide plutot qu'un baume) */
  function selecteurAcne(choisir, acne, sec) {
    if (!acne) return choisir;
    return function (cat, ok, rang) {
      var r = function (p) {
        var b = rang ? rang(p) : p.matchScore;
        return b * (1 + 0.35 * acneAtout(p)) * (sec && asseche(p) ? 0.6 : 1) * (retinoFort(p) ? 0.7 : 1);
      };
      return choisir(cat, function (p) { return acneOk(p, sec, false) && (ok ? ok(p) : true); }, r) ||
             choisir(cat, function (p) { return acneOk(p, sec, true) && (ok ? ok(p) : true); }, r);
    };
  }

  /* un selecteur : une categorie, une condition, un classement ; une seule fois chaque produit et chaque marque */
  function selecteur(pool, pris, opt) {
    opt = opt || {};
    var deja = function (p) { return pris.concat(opt.aussi || []).some(function (x) { return memeProduit(x, p); }); };
    return function (cat, ok, rang) {
      var tiers = opt.marque ? [null] : (opt.aussi && opt.aussi.length ? ['tout', 'soir', null] : ['soir', null]);
      for (var i = 0; i < tiers.length; i++) {
        var tier = tiers[i];
        var c = pool.filter(function (p) {
          if (typeof cat === 'function' ? !cat(p) : p.categorie !== cat) return false;
          if (RX.pas.test(nom(p)) || deja(p)) return false;
          if (tier === 'soir' && pris.some(function (x) { return x.brand && x.brand === p.brand; })) return false;
          if (tier === 'tout' && pris.concat(opt.aussi).some(function (x) { return x.brand && x.brand === p.brand; })) return false;
          return ok ? ok(p) : true;
        });
        if (c.length) {
          var sc = c.map(function (p) { return { p: p, s: rang ? rang(p) : p.matchScore }; }).sort(function (a, b) { return b.s - a.s; });
          return sc[0].p;
        }
        /* la diversite des marques se relache seulement si le perimetre est trop etroit */
        if (!opt.relacher) break;
      }
      return null;
    };
  }

  /* ---------- LE RITUEL DU SCAN (= le matin du protocole) ----------
     o : { scores, produits (deja filtres par les preferences), fondPlein, prefs (ou null), cibles,
           goals (objectifs choisis avant le scan, si prefs n'est pas passe),
           yeux: { demande, mesure, oui, seul }, marque: true sur une page de marque } */
  function rituel(o) {
    var sev = severite(o.scores);
    if (o.boost) o.boost(sev); else booster(sev, o.prefs);
    var top = topDe(sev, 3), faibles = top.map(function (t) { return t.concern; });
    var sensible = faibles.indexOf('redness') >= 0;
    var produits = (o.produits || []).filter(function (p) { return p && !RX.us.test(p.name || '') && !RX.medic.test(nom(p)); });
    if (!produits.length) return null;
    /* 11/10 : acne declaree ou deduite (profilAcne), peau seche a boutons */
    var acne = profilAcne(o.scores, o.goals || (o.prefs && o.prefs.goals));
    var acneSec = !!acne && Number((o.scores || {}).sebum) < ACNE_SEC;
    var ci = o.cibles || cibles(o.prefs);
    var Y = o.yeux || { oui: false };

    /* l'ancien classement (repli si le rituel ne peut pas se composer, et pour l'objectif choisi) */
    var scored = produits.map(function (p) { return Object.assign({}, p, { matchScore: note(p, top) }); })
      .sort(function (a, b) { return b.matchScore - a.matchScore; });
    var PAS_UN_SOIN = /cleans|nettoy|d[ée]maquill|micell|face wash|\bwash\b|foam|mousse nettoy|masque|\bmask|sheet|patch|gommage|scrub|\blip\b|l[èe]vres|lip balm/i;
    var soins = scored.filter(function (p) { return !PAS_UN_SOIN.test(p.name || ''); });
    if (soins.length >= 3) scored = soins;
    var sansYeux = scored.filter(function (p) { return p.categorie !== 'contour-yeux'; });

    /* l'objectif choisi avant le scan : la cible du produit le plus proche de cet objectif */
    var cibleObjectif = null;
    if (ci.length) {
      var vise = sansYeux.find(function (p) { return ci.indexOf(primaire(p)) >= 0; }) ||
        sansYeux.filter(function (p) { return (p.targets || []).some(function (t) { return ci.indexOf(t) >= 0; }); })
          .sort(function (a, b) {
            return Math.max.apply(null, ci.map(function (c) { return cs(b)[c] || 0; })) - Math.max.apply(null, ci.map(function (c) { return cs(a)[c] || 0; }));
          })[0];
      if (vise) cibleObjectif = (vise.targets || []).find(function (t) { return ci.indexOf(t) >= 0; }) || null;
    }

    var pool = montrables(produits, o.fondPlein).map(function (p) { return Object.assign({}, p, { matchScore: note(p, top) }); });
    var pris = [], fortPris = false;
    var choisir = selecteurAcne(selecteur(pool, pris, { marque: !!o.marque }), acne, acneSec);
    var garde = function (p) { if (p) { pris.push(p); if (estFort(p)) fortPris = true; } return p; };
    var permis = function (p) { return !(estFort(p) && (fortPris || sensible || acneSec)) && !(sensible && estVitC(p)); };

    /* 1. le serum vise le point faible n°1 (l'objectif choisi d'abord), sinon le n°2, puis le n°3.
          Un soin du soir (retinoide, acide, serum de nuit) n'entre pas dans le rituel du jour. */
    var okSerum = function (p) { return moment(p) !== 'pm' && permis(p); };
    var ordre = []; if (cibleObjectif) ordre.push(cibleObjectif);
    faibles.forEach(function (c) { if (ordre.indexOf(c) < 0) ordre.push(c); });
    var serum = null;
    for (var i = 0; i < ordre.length && !serum; i++) {
      var t = ordre[i];
      serum = choisir('serum', function (p) { return okSerum(p) && primaire(p) === t; }) ||
              choisir('serum', function (p) { return okSerum(p) && (p.targets || []).indexOf(t) >= 0 && (cs(p)[t] || 0) >= 0.6; });
    }
    if (!serum) serum = choisir('serum', okSerum);
    garde(serum);

    /* 2. la creme complete : hydratante si l'hydratation est dans le top 3 ; jamais une creme de nuit le jour */
    var hydra = faibles.indexOf('hydration') >= 0;
    var okCreme = function (p) { return moment(p) !== 'pm' && !estNuit(p) && !spfBas(p) && permis(p); };
    var rangCreme = function (p) { var q = primaire(p); return p.matchScore * (faibles.indexOf(q) >= 0 && q !== primaire(serum) ? 1.15 : 1); };
    var creme = (hydra ? (choisir('creme', function (p) { return okCreme(p) && primaire(p) === 'hydration'; }, rangCreme) ||
                          choisir('creme', function (p) { return okCreme(p) && hydratante(p); }, rangCreme)) : null) ||
      choisir('creme', function (p) { return okCreme(p) && faibles.indexOf(primaire(p)) >= 0; }, rangCreme) ||
      choisir('creme', okCreme, rangCreme);
    garde(creme);

    /* 3. proteger : un vrai solaire, jamais un SPF < 30 quand l'indice est lisible */
    var solaire = choisir('solaire-visage', function (p) { return !estFort(p) && !spfBas(p) && permis(p); });
    if (solaire) solaire = garde(Object.assign({}, solaire, { _etape: 'e.proteger', _pas: 'proteger' }));

    /* 4. le contour des yeux (si la regle le retient) remplace le nettoyant */
    var soinYeux = null;
    if (Y.oui) {
      var PAS_YEUX = /patch|\bpads?\b|mask|masque|strips?|gel pads/;
      soinYeux = choisir('contour-yeux', function (p) { return !PAS_YEUX.test(nom(p)) && moment(p) !== 'pm' && permis(p); },
        function (p) { return (Y.mesure && RX.cernes.test(nom(p)) ? 1e6 : 0) + p.matchScore; });
      if (soinYeux) soinYeux = Object.assign({}, soinYeux, { targets: ['yeux'], _yeux: Y, _pas: 'yeux' });
    }
    var nettoyant = null;
    if (!soinYeux) {
      /* un nettoyant exfoliant le matin prendrait la place de l'actif fort : il passe apres les nettoyants doux */
      /* acne : le nettoyant du matin reste doux, l'actif fort est garde pour le soir (AAD : nettoyant doux) */
      nettoyant = choisir('nettoyant', function (p) { return moment(p) !== 'pm' && permis(p); }, function (p) {
        return p.matchScore * (estFort(p) ? (acne ? 0.3 : 0.7) : 1) * (acne && /exfoliant \(|salicyl/.test(raisons(p)) ? 0.5 : 1); });
      if (nettoyant) nettoyant = Object.assign({}, nettoyant, { _etape: 'e.nettoyer', _pas: 'nettoyer' });
    }
    if (serum) serum = Object.assign({}, serum, { _pas: 'serum' });
    if (creme) creme = Object.assign({}, creme, { _pas: 'creme' });

    var r = [];
    if (nettoyant) r.push(nettoyant);
    if (serum) r.push(serum);
    if (soinYeux) r.push(soinYeux);
    if (creme) r.push(creme);
    if (solaire) r.push(solaire);

    var selected;
    if (r.length >= 3) {
      selected = r.slice(0, 4);
      if (serum && cibleObjectif && primaire(serum) !== cibleObjectif) cibleObjectif = null;
    } else {
      /* repli (catalogue tres etroit) : les soins les mieux notes, une marque une fois, des cibles variees */
      selected = [];
      /* 11/10 (audit acne) : le repli ignorait les regles (deux retinoides, vitamine C avec rougeurs, soins du soir,
         SPF 15). Il garde maintenant les memes regles quand il reste au moins 3 soins : pas de soin du soir, pas de
         SPF < 30, rien de fort ni de vitamine C avec rougeurs (ou peau seche a boutons), les exclusions acne,
         et un seul actif fort. */
      var regle = sansYeux.filter(function (q) {
        return moment(q) !== 'pm' && !spfBas(q) && !(estFort(q) && (sensible || acneSec)) && !(sensible && estVitC(q)) && (!acne || acneOk(q, acneSec, true));
      });
      if (regle.length >= 3) sansYeux = regle;
      var vues = new Set(), marques = new Set(produits.map(function (q) { return q.brand; })).size;
      for (var j = 0; j < sansYeux.length && selected.length < 4; j++) {
        var p = sansYeux[j], pt = primaire(p);
        if (estFort(p) && selected.some(estFort)) continue;
        if (!o.marque && marques >= 3 && selected.some(function (x) { return x.brand && x.brand === p.brand; })) continue;
        if (selected.some(function (x) { return memeProduit(x, p); })) continue;
        if (selected.length < 2 || !vues.has(pt) || sansYeux.length < 6) { selected.push(p); if (pt) vues.add(pt); }
      }
      for (var k = 0; selected.length < 4 && k < sansYeux.length; k++)
        if (!selected.some(function (x) { return memeProduit(x, sansYeux[k]); }) && !(estFort(sansYeux[k]) && selected.some(estFort))) selected.push(sansYeux[k]);
      if (cibleObjectif && !selected.some(function (x) { return primaire(x) === cibleObjectif; })) cibleObjectif = null;
    }
    return { selected: selected, top: top, faibles: faibles, sensible: sensible, cibleObjectif: cibleObjectif, acne: acne, acneSec: acneSec };
  }

  /* ---------- LE SOIR (protocole complet) ----------
     o : { scores, produits (filtres par les preferences), fondPlein, prefs, goals (reponses du protocole),
           peau, reactive, matin: [produits du matin], yeux: bool, mesure: bool, marque: bool, bannis: {id:1} } */
  function soir(o) {
    var sev = severite(o.scores);
    var goals = ((o.prefs && o.prefs.goals) || []).slice();
    (o.goals || []).forEach(function (g) { if (goals.indexOf(g) < 0) goals.push(g); });
    booster(sev, { goals: goals, age: o.prefs ? o.prefs.age : null });
    if (o.peau === 'sèche') sev.hydration += 18;
    if (o.peau === 'grasse') { sev.sebum += 22; sev.pores += 16; }
    if (o.peau === 'mixte') { sev.sebum += 10; sev.hydration += 8; }
    if (o.reactive) sev.redness += 35;
    var top = topDe(sev, 3), faibles = top.map(function (t) { return t.concern; });
    var sensible = faibles.indexOf('redness') >= 0 || !!o.reactive;
    /* 11/10 : la meme lecture acne que le scan ; la reponse « peau » du protocole decide de la peau seche */
    var acne = profilAcne(o.scores, goals);
    var acneSec = !!acne && (o.peau ? o.peau === 'sèche' : Number((o.scores || {}).sebum) < ACNE_SEC);
    var bannis = o.bannis || {};
    var matin = o.matin || [];
    var fortMatin = matin.some(estFort);
    var pool = montrables(o.produits, o.fondPlein).filter(function (p) { return !bannis[p.id]; })
      .map(function (p) { return Object.assign({}, p, { matchScore: note(p, top) }); });
    var pris = [], fortSoir = false;
    var choisir = selecteurAcne(selecteur(pool, pris, { marque: !!o.marque, aussi: matin, relacher: true }), acne, acneSec);
    var garde = function (p) { if (p) { pris.push(p); if (estFort(p)) fortSoir = true; } return p; };
    var permis = function (p) { return !(estFort(p) && (sensible || acneSec || fortMatin || fortSoir)) && !(sensible && estVitC(p)); };
    var serumMatin = matin.filter(function (p) { return p.categorie === 'serum'; })[0];
    var cibleMatin = serumMatin ? primaire(serumMatin) : null;
    var picks = {};

    /* serum de nuit : le point faible que le serum du matin ne traite pas, puis les suivants */
    var okSerum = function (p) { return (p.categorie === 'serum' || (p.categorie === 'huile' && !estDemaq(p))) && moment(p) !== 'am' && permis(p); };
    var rangSerum = function (p) { return p.matchScore * (estNuit(p) ? 1.25 : 1); };
    var ordre = faibles.filter(function (c) { return c !== cibleMatin; });
    if (cibleMatin && faibles.indexOf(cibleMatin) >= 0) ordre.push(cibleMatin);
    var sn = null;
    /* acne : le soir porte l'actif utile (BHA, ou retinal / retinol doux) quand il est permis ; sinon (rougeurs,
       actif deja pris) l'acide azelaique ou la niacinamide passent par le classement ordinaire */
    if (acne && !sensible && !acneSec && !fortMatin)
      sn = choisir(okSerum, function (p) { return okSerum(p) && estFort(p) && acneAtout(p) >= 0.6 && !retinoFort(p) &&
        (p.targets || []).some(function (t) { return faibles.indexOf(t) >= 0 || t === 'pores' || t === 'sebum'; }); }, rangSerum);
    for (var i = 0; i < ordre.length && !sn; i++) {
      var t = ordre[i];
      sn = choisir(okSerum, function (p) { return okSerum(p) && primaire(p) === t; }, rangSerum) ||
           choisir(okSerum, function (p) { return okSerum(p) && (p.targets || []).indexOf(t) >= 0 && (cs(p)[t] || 0) >= 0.6; }, rangSerum);
    }
    if (!sn) sn = choisir(okSerum, null, rangSerum);
    picks['pm-1'] = garde(sn);

    /* creme de nuit : hydratante si l'hydratation est un point faible ou la peau est seche ; les soins de nuit d'abord */
    var hydra = faibles.indexOf('hydration') >= 0 || o.peau === 'sèche';
    var okCreme = function (p) { return p.categorie === 'creme' && !RX.spf.test(nom(p)) && niveauSpf(p) == null && moment(p) !== 'am' && permis(p); };
    var rangCreme = function (p) { var q = primaire(p); return p.matchScore * (estNuit(p) ? 1.5 : 1) * (faibles.indexOf(q) >= 0 && q !== primaire(sn) ? 1.1 : 1); };
    var cn = (hydra ? (choisir(okCreme, function (p) { return primaire(p) === 'hydration'; }, rangCreme) ||
                       choisir(okCreme, hydratante, rangCreme)) : null) ||
      choisir(okCreme, function (p) { return faibles.indexOf(primaire(p)) >= 0; }, rangCreme) ||
      choisir(okCreme, null, rangCreme);
    picks['pm-2'] = garde(cn);

    /* demaquillage : un demaquillant d'abord, jamais le nettoyant du matin */
    var okDemaq = function (p) { return (p.categorie === 'nettoyant' || (p.categorie === 'huile' && estDemaq(p))) && moment(p) !== 'am' && permis(p); };
    picks['pm-0'] = garde(choisir(okDemaq, null, function (p) { return p.matchScore * (estDemaq(p) ? 1.5 : 1); }));

    /* contour des yeux : seulement selon la regle des yeux, et s'il n'est pas deja dans le rituel du matin */
    if (o.yeux && !matin.some(function (p) { return p.categorie === 'contour-yeux'; })) {
      var PAS_YEUX = /patch|\bpads?\b|mask|masque|strips?/;
      picks['pm-3'] = garde(choisir('contour-yeux', function (p) { return !PAS_YEUX.test(nom(p)) && moment(p) !== 'am' && permis(p); },
        function (p) { return (o.mesure && RX.cernes.test(nom(p)) ? 1e6 : 0) + p.matchScore; }));
    }
    return { picks: picks, top: top, faibles: faibles, sensible: sensible, acne: acne, acneSec: acneSec };
  }

  /* ---------- le lien entre le scan et le protocole ---------- */
  function ls() { try { return root.localStorage; } catch (e) { return null; } }
  function enregistrer(selected, o) {
    var L = ls(); if (!L) return;
    o = o || {};
    try {
      L.setItem('vyvre_rituel', JSON.stringify(selected.map(function (p) {
        return { id: p.id, name: p.name, brand: p.brand_name || p.brand, img: p.cutout_url || p.image_url, url: p.url,
                 cible: (p.targets || [])[0] || null, categorie: p.categorie || null, etape: p._pas || null };
      })));
      L.setItem('vyvre_rituel_lien', JSON.stringify({ sig: signature(o.scores), at: L.getItem('vyvre_scan_at') || null, marque: o.marque || null }));
    } catch (e) {}
  }
  /* le rituel enregistre, s'il appartient bien au scan enregistre (memes scores, meme heure, meme marque) */
  function lire(o) {
    var L = ls(); if (!L) return null;
    try {
      var lien = JSON.parse(L.getItem('vyvre_rituel_lien') || 'null');
      var r = JSON.parse(L.getItem('vyvre_rituel') || 'null');
      if (!lien || !Array.isArray(r) || !r.length) return null;
      if (lien.sig !== signature(o.scores)) return null;
      if ((lien.marque || null) !== (o.marque || null)) return null;
      var at = L.getItem('vyvre_scan_at');
      if (lien.at && at && String(lien.at) !== String(at)) return null;
      return r;
    } catch (e) { return null; }
  }
  /* l'etape d'un soin du rituel (pour un rituel enregistre avant le 07/10, sans etape) */
  function etapeDe(p) {
    if (p._pas || p.etape) return p._pas || p.etape;
    return { nettoyant: 'nettoyer', serum: 'serum', creme: 'creme', 'solaire-visage': 'proteger', 'contour-yeux': 'yeux' }[p.categorie] || null;
  }

  root.VyChoix = {
    CRITERES: CRITERES, severite: severite, topDe: topDe, scoresValides: scoresValides, signature: signature,
    booster: booster, cibles: cibles, filtrePrefs: filtrePrefs,
    estFort: estFort, estRetino: estRetino, estAcide: estAcide, estVitC: estVitC, estNuit: estNuit, niveauSpf: niveauSpf,
    moment: moment, montrables: montrables, note: note, memeProduit: memeProduit,
    profilAcne: profilAcne, acneOk: acneOk, acneAtout: acneAtout,
    rituel: rituel, soir: soir, enregistrer: enregistrer, lire: lire, etapeDe: etapeDe
  };
})(typeof window !== 'undefined' ? window : globalThis);
