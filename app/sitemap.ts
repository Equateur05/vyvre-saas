/**
 * VYVRE — /sitemap.xml (15/10/2026, audit du 11/10, point 4).
 * Seules les vraies pages publiques. Les pages traduites (?lang=xx, 12 langues)
 * declarent leurs versions par hreflang ; les autres restent en francais seul
 * (/aliment, /manifeste, et le corps des pages juridiques, qui fait foi en francais).
 */
import type { MetadataRoute } from 'next';
import { LANGS } from '../lib/i18n/langs';

const SITE = 'https://vyvre.fr';

/* [chemin, traduite dans les 12 langues ?] */
const PAGES: [string, boolean][] = [
  ['/', true],
  ['/cheveux', true],
  ['/aliment', false],
  ['/manifeste', false],
  ['/pro', true],
  ['/pricing', true],
  ['/marques', true],
  ['/accuracy', true],
  ['/cgv', false],
  ['/mentions-legales', false],
  ['/confidentialite', false],
  ['/dpa', false],
  ['/wrap/credits', false],
];

function langues(chemin: string): Record<string, string> {
  const l: Record<string, string> = {};
  for (const { c } of LANGS) l[c] = `${SITE}${chemin}?lang=${c}`;
  l['x-default'] = `${SITE}${chemin}`;
  return l;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([chemin, traduite]) => ({
    url: `${SITE}${chemin}`,
    changeFrequency: 'weekly',
    priority: chemin === '/' ? 1 : 0.6,
    ...(traduite ? { alternates: { languages: langues(chemin) } } : {}),
  }));
}
