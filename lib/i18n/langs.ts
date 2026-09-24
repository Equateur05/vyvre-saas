/**
 * VYVRE — langues du site (pages Next).
 *
 * Même liste, mêmes codes et même clé de mémorisation que le moteur public
 * /scan/vy-i18n.js : le choix fait sur le scan se retrouve sur le site, et
 * inversement. Français par défaut.
 */

export const LANGS = [
  { c: 'fr', n: 'Français' },
  { c: 'en', n: 'English' },
  { c: 'es', n: 'Español' },
  { c: 'it', n: 'Italiano' },
  { c: 'de', n: 'Deutsch' },
  { c: 'pt', n: 'Português' },
  { c: 'nl', n: 'Nederlands' },
  { c: 'ru', n: 'Русский' },
  { c: 'ar', n: 'العربية' },
  { c: 'ja', n: '日本語' },
  { c: 'ko', n: '한국어' },
  { c: 'zh', n: '简体中文' },
] as const;

export type Lang = (typeof LANGS)[number]['c'];

export const DEFAULT_LANG: Lang = 'fr';

/** Langues écrites de droite à gauche. */
export const RTL: Record<string, boolean> = { ar: true };

/** Clé partagée avec le moteur du scan (localStorage + cookie). */
export const LANG_KEY = 'vyvre-lang';

/** En-tête posé par le middleware et relu par le layout. */
export const LANG_HEADER = 'x-vyvre-lang';

const CODES = LANGS.map((l) => l.c) as readonly string[];

export function isLang(v: unknown): v is Lang {
  return typeof v === 'string' && CODES.indexOf(v) >= 0;
}

/** « fr-FR », « ZH_Hant », « en » → code géré, ou null. */
export function normalizeLang(v: unknown): Lang | null {
  if (!v) return null;
  const s = String(v).toLowerCase().replace('_', '-');
  if (s.indexOf('zh') === 0) return 'zh';
  const base = s.split('-')[0];
  return isLang(base) ? base : null;
}

/** Valeur de l'attribut lang du document. */
export function htmlLang(lang: Lang): string {
  return lang === 'zh' ? 'zh-Hans' : lang;
}

export function dirOf(lang: Lang): 'rtl' | 'ltr' {
  return RTL[lang] ? 'rtl' : 'ltr';
}

/** Meilleure langue d'un en-tête Accept-Language. */
export function fromAcceptLanguage(header: string | null | undefined): Lang | null {
  if (!header) return null;
  const parts = header
    .split(',')
    .map((chunk) => {
      const [tag, ...params] = chunk.trim().split(';');
      const q = params
        .map((p) => p.trim())
        .filter((p) => p.startsWith('q='))
        .map((p) => parseFloat(p.slice(2)))[0];
      return { tag: tag.trim(), q: Number.isFinite(q) ? (q as number) : 1 };
    })
    .filter((p) => p.tag)
    .sort((a, b) => b.q - a.q);
  for (const p of parts) {
    const l = normalizeLang(p.tag);
    if (l) return l;
  }
  return null;
}
