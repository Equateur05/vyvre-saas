/* VYVRE — LES PAGES DE MARQUE /m/<marque> (12/10/2026)
   La page /m est construite a partir de /scan (scripts/construire-m.mjs) : meme lecture de peau, meme moteur,
   meme choix des soins (vy-choix.js). Ce fichier ajoute seulement la marque.

   LA REGLE B2B (Charles) : sur vyvre.fr/m/caudalie, on ne propose QUE des produits Caudalie, avant et apres
   le scan, choisis d'apres la vraie lecture de peau. Jamais une autre marque.
   - resoudre() : le lien -> le nom de la marque dans le catalogue (brand, puis brand_name) ;
   - filtre()   : les produits dont le brand_name est exactement celui de la marque ;
   - l'apercu avant le scan passe par VyChoix.rituel (memes regles que le rituel du scan) ;
   - sans produit : « Les produits de cette marque arrivent », jamais une autre maison. */
(function (root) {
  'use strict';

  function norme(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  /* les liens deja envoyes dont le nom differe du catalogue */
  var ALIAS = { sturm: 'barbara-sturm', 'dr-barbara-sturm': 'barbara-sturm', givenchy: 'givenchy-beauty' };

  /* le nom de la marque dans le catalogue (brand_name), ou null */
  function resoudre(slug, produits) {
    slug = norme(slug); if (!slug) return null;
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
  function apercu(produits, fondPlein) {
    var V = root.VyChoix; if (!V || !produits || !produits.length) return [];
    var neutre = { wrinkles: 50, firmness: 50, glow: 50, hydration: 50, redness: 50, pores: 50, sebum: 50, pigmentation: 50 };
    var R = V.rituel({ scores: neutre, produits: produits, fondPlein: fondPlein || {}, prefs: null, cibles: [],
      yeux: { demande: false, mesure: false, oui: false }, marque: true });
    return (R && R.selected) || [];
  }
  var API = { norme: norme, resoudre: resoudre, filtre: filtre, apercu: apercu, ALIAS: ALIAS };
  root.vyMarque = API;
  if (typeof document === 'undefined' || root.VY_MARQUE_PUR) return;

  /* ---------- la marque du lien ---------- */
  var q = new URLSearchParams(location.search);
  var b = (q.get('b') || '').toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!b) { var mm = location.pathname.match(/\/m\/([a-z0-9-]+)/i); if (mm && mm[1].toLowerCase() !== 'index') b = mm[1].toLowerCase(); }
  root.VYVRE_MARQUE = b || null; root.VYVRE_MARQUE_NOM = null;
  if (!b) return;

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
  var joli = b.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  function textes(nom) {
    nom = nom || joli; var NOM = nom.toUpperCase();
    var el = document.querySelector('.brand-partner'); if (el) { el.removeAttribute('data-i18n'); el.textContent = NOM; }
    var lb = document.querySelector('#view-hero .label-sm'); if (lb) { lb.removeAttribute('data-i18n'); try { lb.textContent = root.VY.t('b.kick', { n: nom }); } catch (_) {} }
    try { document.title = root.VY.t('b.title', { n: nom }); } catch (_) {}
    var p = document.querySelector('#view-hero p'); if (p) { p.removeAttribute('data-i18n'); try { p.textContent = root.VY.t('b.hero', { n: nom }); } catch (_) {} }
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
      var sel = apercu(mine, fond);
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
