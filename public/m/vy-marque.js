/* VYVRE — LES PAGES DE MARQUE /m/<marque> (12/10/2026)
   La page /m est construite a partir de /scan (scripts/construire-m.mjs) : meme lecture de peau, meme moteur,
   meme choix des soins (vy-choix.js). Ce fichier ajoute seulement la marque.

   LA REGLE B2B (Charles) : sur vyvre.fr/m/caudalie, on ne propose QUE des produits Caudalie, avant et apres
   le scan, choisis d'apres la vraie lecture de peau. Jamais une autre marque.
   - resoudre() : le lien -> le nom de la marque dans le catalogue (brand, puis brand_name) ;
   - filtre()   : les produits dont le brand_name est exactement celui de la marque ;
   - l'apercu avant le scan passe par VyChoix.rituel (memes regles que le rituel du scan) ;
   - sans produit : « Les produits de cette marque arrivent », jamais une autre maison.
   12/10/2026 — LES REVENDEURS (/m/sephora, /m/ulta, /m/space-nk, /m/cult-beauty, /m/oh-my-cream) : un revendeur
   n'est pas une marque. Sa page propose les soins des maisons du catalogue que ce revendeur distribue vraiment
   (liste REVENDEURS ci-dessous, relevee sur son propre site le 12/10/2026), avec un titre honnete
   (« Sélection disponible chez Sephora ») et la diversite des marques du scan universel (marque: false). */
(function (root) {
  'use strict';

  function norme(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  /* les liens deja envoyes dont le nom differe du catalogue */
  var ALIAS = { sturm: 'barbara-sturm', 'dr-barbara-sturm': 'barbara-sturm', givenchy: 'givenchy-beauty',
    'ulta-beauty': 'ulta', spacenk: 'space-nk', cultbeauty: 'cult-beauty', ohmycream: 'oh-my-cream' };
  /* les maisons du catalogue que chaque revendeur distribue (slugs brand), relevees le 12/10/2026 sur :
     Sephora : sitemaps de sephora.fr (pages marque) ; Cult Beauty : cultbeauty.co.uk/c/brands/ ;
     Space NK : spacenk.com/brands ; Oh My Cream : ohmycream.com/marques ; Ulta Beauty : ulta.com/brand/all */
  var REVENDEURS = {
    'sephora': { nom: 'Sephora', source: 'sitemaps sephora.fr (pages marque)', marques: '111skin a-derma aime anua augustinus-bader avene beauty-of-joseon bioderma bobbi-brown byoma chanel charlotte-tilbury clarins clinique decleor dermalogica dior dr-dennis-gross drunk-elephant ducray elizabeth-arden estee-lauder filorga fresh givenchy-beauty glossier glow-recipe guerlain innisfree institut-esthederm klorane la-mer la-prairie lancaster lancome laneige loccitane medicube murad nuxe origins paulas-choice payot pixi polaar respire rhode rituals sand-and-sky seasonly shiseido sisley tatcha the-inkey-list the-ordinary youth-to-the-people' },
    'cult-beauty': { nom: 'Cult Beauty', source: 'cultbeauty.co.uk/c/brands/', marques: '111skin aesop anua augustinus-bader avene barbara-sturm beauty-of-joseon byoma caudalie cerave chantecaille charlotte-tilbury cle-de-peau-beaute cosrx dermalogica dr-dennis-gross drunk-elephant embryolisse fresh glow-recipe guerlain innisfree kiehls la-mer la-prairie la-roche-posay laneige loccitane lyma medicube mediheal medik8 murad nuxe omorovicza paulas-choice pixi shiseido sisley skin1004 skinceuticals sulwhasoo tata-harper the-inkey-list the-ordinary u-beauty weleda youth-to-the-people' },
    'space-nk': { nom: 'Space NK', source: 'spacenk.com/brands', marques: 'aesop anua augustinus-bader barbara-sturm beauty-of-joseon bobbi-brown byoma caudalie chantecaille charlotte-tilbury dermalogica dr-dennis-gross drunk-elephant fresh glossier innisfree institut-esthederm kiehls klairs la-mer la-prairie lancaster laneige loccitane medicube mediheal medik8 murad omorovicza paulas-choice revive shiseido sisley skin1004 skinceuticals some-by-mi tata-harper tatcha the-inkey-list the-ordinary youth-to-the-people' },
    'oh-my-cream': { nom: 'Oh My Cream', source: 'ohmycream.com/marques', marques: 'augustinus-bader axis-y barbara-sturm beauty-of-joseon dermalogica innisfree medicube noble-panacea patyka skin1004 tata-harper torriden' },
    'ulta': { nom: 'Ulta Beauty', source: 'ulta.com/brand/all', marques: 'anua avene axis-y bioderma bobbi-brown bubble-skincare byoma cerave cetaphil chanel charlotte-tilbury clarins clinique cosrx dermalogica dior drunk-elephant elizabeth-arden embryolisse estee-lauder eucerin fresh garnier givenchy-beauty guerlain heimish kiehls klairs la-roche-posay lancome loccitane manyo medicube mediheal mixsoon murad mustela neutrogena nuxe olay origins pixi round-lab sand-and-sky shiseido skin1004 some-by-mi tatcha the-inkey-list the-ordinary tirtir versed vichy' }
  };
  /* le revendeur du lien, ou null */
  function revendeur(slug) {
    slug = norme(slug); var s = ALIAS[slug] || slug;
    var R = REVENDEURS[s]; if (!R) return null;
    if (!R._set) { R._set = {}; R.marques.split(' ').forEach(function (m) { R._set[m] = 1; }); }
    return R;
  }
  function filtreRevendeur(produits, R) {
    return (produits || []).filter(function (p) { return p && R._set[p.brand] && !/sothys/.test(p.brand); });
  }

  /* le nom de la marque dans le catalogue (brand_name), ou null */
  function resoudre(slug, produits) {
    slug = norme(slug); if (!slug) return null;
    var Rv = revendeur(slug); if (Rv) return Rv.nom;
    var s = ALIAS[slug] || slug, L = produits || [], i, p;
    for (i = 0; i < L.length; i++) { p = L[i]; if (p && p.brand === s && p.brand_name) return p.brand_name; }
    for (i = 0; i < L.length; i++) { p = L[i]; if (p && p.brand_name && norme(p.brand_name) === s) return p.brand_name; }
    /* « givenchy » -> « Givenchy Beauty », « sisley » -> « Sisley Paris » : le nom commence par le lien */
    for (i = 0; i < L.length; i++) { p = L[i]; if (p && p.brand_name && norme(p.brand_name).indexOf(s + '-') === 0) return p.brand_name; }
    return null;
  }
  function filtre(produits, nomMarque) {
    var n = norme(nomMarque); if (!n) return [];
    return (produits || []).filter(function (p) { return p && norme(p.brand_name) === n; });
  }
  /* l'apercu avant le scan : le rituel de la marque pour une peau neutre, avec les regles du scan */
  function apercu(produits, fondPlein, estRevendeur) {
    var V = root.VyChoix; if (!V || !produits || !produits.length) return [];
    var neutre = { wrinkles: 50, firmness: 50, glow: 50, hydration: 50, redness: 50, pores: 50, sebum: 50, pigmentation: 50 };
    var R = V.rituel({ scores: neutre, produits: produits, fondPlein: fondPlein || {}, prefs: null, cibles: [],
      yeux: { demande: false, mesure: false, oui: false }, marque: !estRevendeur });
    return (R && R.selected) || [];
  }
  var API = { norme: norme, resoudre: resoudre, filtre: filtre, apercu: apercu, ALIAS: ALIAS,
    REVENDEURS: REVENDEURS, revendeur: revendeur, filtreRevendeur: filtreRevendeur };
  root.vyMarque = API;
  if (typeof document === 'undefined' || root.VY_MARQUE_PUR) return;

  /* ---------- la marque du lien ---------- */
  var q = new URLSearchParams(location.search);
  var b = (q.get('b') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!b) { var mm = location.pathname.match(/\/m\/([a-z0-9-]+)/i); if (mm && mm[1].toLowerCase() !== 'index') b = mm[1].toLowerCase(); }
  root.VYVRE_MARQUE = b || null; root.VYVRE_MARQUE_NOM = null;
  if (!b) return;
  var REV = revendeur(b); root.VYVRE_REVENDEUR = REV ? (ALIAS[b] || b) : null;

  function t(k, d) { try { return (root.VY && root.VY.t(k)) || d; } catch (_) { return d; } }
  API.attente = function () {
    var row = document.getElementById('vyvre-product-row'); if (!row) return;
    row.innerHTML = '<div class="v6card" style="grid-column:1/-1;text-align:center;padding:48px 24px">'
      + '<div class="v6lbl" data-i18n="mq.soon.l" style="margin-bottom:12px">' + t('mq.soon.l', 'Catalogue') + '</div>'
      + '<h3 data-i18n="mq.soon.t" style="font-weight:200;font-size:22px;margin-bottom:10px">' + t('mq.soon.t', 'Les produits de cette marque arrivent.') + '</h3>'
      + '<p data-i18n="mq.soon.p" style="color:rgba(255,255,255,.5);font-size:14px;line-height:1.6">'
      + t('mq.soon.p', 'Votre lecture de peau est complète. La sélection pour cette maison est en cours de publication.') + '</p></div>';
  };
  /* les produits de la marque (nom fixe au premier appel) ; met a jour le nom affiche */
  API.produits = function (tous) {
    if (REV) {
      if (!root.VYVRE_MARQUE_NOM) { root.VYVRE_MARQUE_NOM = REV.nom; try { root.sgTitreMarque && root.sgTitreMarque(); } catch (_) {} }
      return filtreRevendeur(tous, REV);
    }
    if (!root.VYVRE_MARQUE_NOM) {
      var nm = resoudre(b, tous);
      if (nm) { root.VYVRE_MARQUE_NOM = nm; try { root.sgTitreMarque && root.sgTitreMarque(); } catch (_) {} }
    }
    return root.VYVRE_MARQUE_NOM ? filtre(tous, root.VYVRE_MARQUE_NOM) : [];
  };

  /* ---------- les cartes ecrites en dur : effacees des le chargement ---------- */
  function vide() {
    var slots = document.querySelectorAll('[data-vyvre-prod-slot]');
    for (var i = 0; i < slots.length; i++) {
      var c = slots[i];
      var h3 = c.querySelector('h3'); if (h3) { h3.removeAttribute('data-i18n'); h3.textContent = ' '; }
      var pp = c.querySelector('p'); if (pp) { pp.removeAttribute('data-i18n'); pp.textContent = ' '; }
      var im = c.querySelector('img'); if (im) { im.removeAttribute('src'); im.alt = ''; im.style.display = 'none'; }
      var pr = c.querySelector('.v6price'); if (pr) pr.textContent = '';
      c.classList.add('vyvre-slot-attente');
    }
  }

  /* ---------- les textes de la page : le nom de la marque ---------- */
  var joli = REV ? REV.nom : b.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  function textes(nom) {
    nom = nom || joli; var NOM = nom.toUpperCase();
    var el = document.querySelector('.brand-partner'); if (el) { el.removeAttribute('data-i18n'); el.textContent = NOM; }
    /* revendeur : « Sélection disponible chez Sephora », et l'accroche parle des maisons qu'il distribue */
    var kK = REV ? 'b.kickR' : 'b.kick', kH = REV ? 'b.heroR' : 'b.hero';
    var lb = document.querySelector('#view-hero .label-sm'); if (lb) { lb.removeAttribute('data-i18n'); try { lb.textContent = root.VY.t(kK, { n: nom }); } catch (_) {} }
    try { document.title = root.VY.t('b.title', { n: nom }); } catch (_) {}
    var p = document.querySelector('#view-hero p'); if (p) { p.removeAttribute('data-i18n'); try { p.textContent = root.VY.t(kH, { n: nom }); } catch (_) {} }
    var mk = document.querySelector('.sg-mk'); if (mk) { mk.removeAttribute('data-i18n'); try { mk.textContent = root.VY.t('b.mk', { n: nom }); } catch (_) {} }
    var mp = document.querySelector('.sg-mp'); if (mp) { mp.removeAttribute('data-i18n'); try { mp.textContent = root.VY.t('b.mp', { n: nom }); } catch (_) {} }
    var k = document.querySelector('#sg-intro .si-k'); if (k) { k.removeAttribute('data-i18n'); k.textContent = 'Vyvre · ' + nom; }
    document.querySelectorAll('a[href*="from=scan-universel"]').forEach(function (a) { a.href = a.href.replace('from=scan-universel', 'from=' + b); });
    var pr = document.getElementById('vyvre-protocol-link'); if (pr) pr.href = '/m/' + b + '/protocol';
    var ms = document.querySelector('.sg-mbtn-b'); if (ms) ms.href = 'mailto:contact@vyvre.fr?subject=Vyvre%20%C3%97%20' + encodeURIComponent(nom);
  }
  root.sgTitreMarque = function () { textes(root.VYVRE_MARQUE_NOM); };

  /* ---------- l'apercu avant le scan : trois soins de CETTE maison, avec les regles du scan ---------- */
  function pose(list) {
    list.slice(0, 3).forEach(function (prod, idx) {
      var card = document.querySelector('[data-vyvre-prod-slot="' + idx + '"]'); if (!card) return;
      card.style.display = '';
      var h3 = card.querySelector('h3'); if (h3) { h3.removeAttribute('data-i18n'); h3.textContent = prod.name || ''; }
      var pp = card.querySelector('p'); if (pp) { pp.removeAttribute('data-i18n'); pp.textContent = prod.brand_name || root.VYVRE_MARQUE_NOM || ''; }
      var lbl = card.querySelector('.v6lbl'); if (lbl && prod._etape) { lbl.setAttribute('data-i18n', prod._etape); lbl.textContent = t(prod._etape, lbl.textContent); }
      var im = card.querySelector('img'), src = prod.cutout_url || prod.image_url;
      if (im && src) { im.src = src; im.alt = prod.name || ''; im.style.display = ''; }
      var pr = card.querySelector('.v6price'); if (pr) pr.textContent = '';
      card.classList.remove('vyvre-slot-attente');
      card.dataset.marque = prod.brand_name || '';
    });
    for (var k = Math.min(list.length, 3); k < 4; k++) {
      var c = document.querySelector('[data-vyvre-prod-slot="' + k + '"]'); if (c) c.style.display = 'none';
    }
  }
  function apercuPage() {
    /* le meme catalogue que le scan (une seule requete) */
    var cat = root.__vyCatalogue || (root.__vyCatalogue = fetch('/scan/catalogue/all.json').then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); }));
    var fp = fetch('/scan/catalogue/fond_plein.json').then(function (r) { return r.json(); }).catch(function () { return {}; });
    Promise.all([cat, fp]).then(function (v) {
      if (root.vyvreLastScanResult) return; /* le scan a deja pose la vraie selection */
      var mine = API.produits((v[0] && v[0].products) || []);
      if (!mine.length) { API.attente(); return; }
      var fond = {}; ((v[1] && v[1].images) || []).forEach(function (u) { fond[u] = 1; });
      var sel = apercu(mine, fond, !!REV);
      if (sel.length) pose(sel); else API.attente();
    }).catch(function () { API.attente(); });
  }
  /* le nombre de soins affiche suit le nombre de cartes visibles */
  function compte() {
    var row = document.getElementById('vyvre-product-row'); if (!row) return;
    function juste() {
      var n = [].filter.call(document.querySelectorAll('[data-vyvre-prod-slot]'), function (c) { return c.style.display !== 'none'; }).length,
        tx = row.getAttribute('data-ritual') || '', u = tx.replace(/\d+/, n);
      if (n && u !== tx) row.setAttribute('data-ritual', u);
    }
    juste(); new MutationObserver(juste).observe(row, { attributes: true, attributeFilter: ['data-ritual'] });
  }
  function demarrer() { vide(); textes(null); apercuPage(); compte(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer); else demarrer();
})(typeof window !== 'undefined' ? window : globalThis);
