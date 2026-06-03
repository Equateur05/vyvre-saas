/**
 * VYVRE — Matching produits ⇄ concerns peau.
 *
 * Porté 1:1 de la logique `matchAndRenderDiorProducts` du POC DIOR V3.
 * Réutilisable par /dior (et plus tard par le widget embed).
 *
 * Principe :
 *  - on calcule la sévérité de chaque concern à partir des scores du scan
 *    (score bas = concern présent, sauf sebum/pigmentation où score haut = concern) ;
 *  - on garde les 3 concerns les plus sévères ;
 *  - on note chaque produit : Σ (concern_scores[c] + bonus 0.3 si ciblé) × sévérité ;
 *  - on prend le top `count` en diversifiant par target primaire.
 */

import type { ScanScores, Product } from './scan-types';

export const CONCERN_LABELS: Record<string, string> = {
  wrinkles: 'Anti-Rides',
  firmness: 'Fermeté',
  glow: 'Éclat',
  hydration: 'Hydratation',
  redness: 'Anti-Rougeurs',
  pores: 'Anti-Pores',
  sebum: 'Matifiant',
  pigmentation: 'Anti-Taches',
};

function v(n: number | undefined, fallback = 50): number {
  return typeof n === 'number' && !isNaN(n) ? n : fallback;
}

export function matchProducts(
  scores: ScanScores,
  products: Product[],
  count = 3,
): Product[] {
  if (!products || products.length === 0) return [];

  const concernSeverity: Record<string, number> = {
    wrinkles: 100 - v(scores.wrinkles),
    firmness: 100 - v(scores.firmness),
    glow: 100 - v(scores.glow),
    hydration: 100 - v(scores.hydration),
    redness: 100 - v(scores.redness),
    pores: 100 - v(scores.pores),
    sebum: v(scores.sebum), // sebum élevé = peau grasse = concern
    pigmentation: v(scores.pigmentation), // pigment élevé = taches = concern
  };

  const topConcerns = Object.entries(concernSeverity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([concern, severity]) => ({ concern, severity }));

  const scored: Product[] = products.map((p) => {
    const cs = p.concern_scores || {};
    let matchScore = 0;
    for (const tc of topConcerns) {
      const efficacy = cs[tc.concern] || 0; // [0..1]
      const isTarget = (p.targets || []).includes(tc.concern);
      const targetBonus = isTarget ? 0.3 : 0;
      matchScore += (efficacy + targetBonus) * tc.severity;
    }
    return { ...p, matchScore };
  });

  scored.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

  // Diversifier par target primaire
  const selected: Product[] = [];
  const usedTargets = new Set<string>();
  for (const p of scored) {
    if (selected.length === count) break;
    const primary = (p.targets || [])[0];
    if (selected.length < 2 || !primary || !usedTargets.has(primary) || scored.length < 6) {
      selected.push(p);
      if (primary) usedTargets.add(primary);
    }
  }
  while (selected.length < count && scored.length > selected.length) {
    const next = scored.find((p) => !selected.includes(p));
    if (next) selected.push(next);
    else break;
  }

  return selected;
}
