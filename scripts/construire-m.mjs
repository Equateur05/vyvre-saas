// VYVRE — construit public/m/index.html (les pages de marque /m/<marque>) a partir de public/scan/index.html.
// 12/10/2026 : l'audit du 11/10 a trouve 15 scans sur 15 en scores de secours sur /m : la page etait une copie
// divergente de /scan (repli a 3,5 s, chiffres tires au hasard). /m reprend maintenant /scan tel quel (meme
// lecture, meme moteur, meme choix des soins) et ajoute seulement la marque (public/m/vy-marque.js).
// A relancer apres chaque changement de /scan :  node scripts/construire-m.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
let s = readFileSync(join(racine, 'scan', 'index.html'), 'utf8');
const MARQUE_V = '1';

function remplacer(ancien, nouveau, fois = 1) {
  const n = s.split(ancien).length - 1;
  if (n !== fois) throw new Error(`attendu ${fois} fois, trouve ${n} : ${ancien.slice(0, 90)}`);
  s = s.split(ancien).join(nouveau);
}
function remplacerRe(re, nouveau) {
  if (!re.test(s)) throw new Error('introuvable : ' + re);
  s = s.replace(re, nouveau);
}

// 1. la marque, des le debut (apres le choix des soins)
remplacerRe(/<script src="\/scan\/vy-choix\.js\?v=\d+"><\/script>/, (m) =>
  `<!-- PAGE GENEREE par scripts/construire-m.mjs a partir de /scan/index.html : ne pas modifier a la main -->\n${m}\n<script src="/m/vy-marque.js?v=${MARQUE_V}"></script>`);

// 2. pas les questions d'avant scan (perimetre de marques), pas l'assiette, pas le menu public, pas l'habillage
remplacer('var ACTIF=!/[?&]sansquestions\\b/.test(location.search);', 'var ACTIF=!window.VYVRE_MARQUE&&!/[?&]sansquestions\\b/.test(location.search);');
remplacerRe(/<script src="\/scan\/aliment\/vy-aliment\.js\?v=\d+" defer><\/script>\n?/, '');
remplacerRe(/<script src="\/scan\/vy-menu\.js\?v=\d+" defer><\/script>\n?/, '');
remplacerRe(/<script src="\/wrap\/vy-wrap\.js\?v=\d+" defer><\/script>\n?/, '');
remplacerRe(/<script src="\/wrap\/vy-wrap-pages\.js\?v=\d+" defer><\/script>\n?/, '');

// 3. la regle B2B : apres la lecture, uniquement les produits de la marque ; aucun repli vers une autre maison
remplacer("    try { const r2 = await fetch('/scan/catalogue/charlotte-tilbury.json'); if (r2.ok) products = (await r2.json()).products || []; } catch(_) {}\n    if (!products.length) return; // garde les produits hardcodés",
  "    if (window.VYVRE_MARQUE) { window.vyMarque && window.vyMarque.attente && window.vyMarque.attente(); return; }\n    try { const r2 = await fetch('/scan/catalogue/charlotte-tilbury.json'); if (r2.ok) products = (await r2.json()).products || []; } catch(_) {}\n    if (!products.length) return; // garde les produits hardcodés");
remplacer('  if (products.length === 0) return;\n',
  "  /* page de marque : uniquement les produits de cette marque (comparaison sur brand_name) */\n" +
  "  if (window.VYVRE_MARQUE) { products = window.vyMarque.produits(products); if (!products.length) { window.vyMarque.attente(); return; } }\n" +
  '  if (products.length === 0) return;\n');
remplacer('    yeux: regleYeux\n', '    yeux: regleYeux,\n    marque: !!window.VYVRE_MARQUE\n');
remplacer('window.VyChoix.enregistrer(selected, { scores: scores, marque: null });', 'window.VyChoix.enregistrer(selected, { scores: scores, marque: window.VYVRE_MARQUE || null });');

// 4. le bloc « Pour les marques » (ses styles sont deja dans la page)
const blocMarque = `<section class="sg-marque" id="sg-marque" aria-label="Pour les marques" data-i18n-attr="aria-label:mk.aria">
  <div class="sg-marque-in">
    <div class="sg-mk" data-i18n="mk.k">Pour les marques de beauté</div>
    <h2 class="sg-mh" data-i18n="mk.h">Vos clientes méritent<br><em>cette lecture.</em></h2>
    <p class="sg-mp" data-i18n="mk.p">Ce que vous venez de vivre peut exister sur votre e-shop et dans vos boutiques, sur votre propre catalogue, dans vos propres codes. Commencez par un pilote, ou construisons-le avec vous, sur mesure.</p>
    <div class="sg-mb">
      <a class="sg-mbtn sg-mbtn-a v6cta" href="https://vyvre.fr/pricing/en?from=scan-universel&amp;plan=pilot"><span data-i18n="mk.a">Lancer le pilote</span> <span>→</span></a>
      <a class="sg-mbtn sg-mbtn-b v6cta" href="mailto:contact@vyvre.fr?subject=Vyvre%20%E2%80%94%20bespoke%20skin%20scan" data-i18n="mk.b">Le construire sur mesure</a>
    </div>
    <a class="sg-mprix" href="https://vyvre.fr/pricing/en?from=scan-universel" data-i18n="mk.price">Voir les tarifs</a>
  </div>
</section>
`;
remplacerRe(/<!-- =+\n\s+« LA SALLE » — le detail/, (m) => blocMarque + '\n' + m);

// 5. plus aucune reference a l'ancien site
if (/vyvre-demos\.web\.app/.test(s)) throw new Error('reference a vyvre-demos.web.app dans /scan');

writeFileSync(join(racine, 'm', 'index.html'), s);
console.log('public/m/index.html ecrit (' + s.length + ' octets)');
