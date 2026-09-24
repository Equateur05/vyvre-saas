/**
 * VYVRE — langue courante côté serveur.
 *
 * Ordre : ?lang=xx (posé par le middleware) > langue mémorisée (cookie partagé
 * avec le scan) > en-tête Accept-Language > français.
 */

import { cookies, headers } from 'next/headers';
import {
  DEFAULT_LANG,
  LANG_HEADER,
  LANG_KEY,
  dirOf,
  fromAcceptLanguage,
  htmlLang,
  normalizeLang,
  type Lang,
} from './langs';
import { translator, type T } from './index';

export function currentLang(): Lang {
  const h = headers();
  const fromMiddleware = normalizeLang(h.get(LANG_HEADER));
  if (fromMiddleware) return fromMiddleware;
  const fromCookie = normalizeLang(cookies().get(LANG_KEY)?.value);
  if (fromCookie) return fromCookie;
  return fromAcceptLanguage(h.get('accept-language')) || DEFAULT_LANG;
}

/** Tout ce dont une page a besoin, en une ligne. */
export function getPage(): { lang: Lang; t: T; dir: 'rtl' | 'ltr'; htmlLang: string } {
  const lang = currentLang();
  return { lang, t: translator(lang), dir: dirOf(lang), htmlLang: htmlLang(lang) };
}
