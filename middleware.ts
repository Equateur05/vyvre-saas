/**
 * VYVRE — choix de la langue pour les pages Next.
 *
 * Un layout ne reçoit pas les paramètres d'URL : c'est donc ici qu'on lit
 * ?lang=xx, qu'on le mémorise dans un cookie (la même clé que le moteur du
 * scan) et qu'on transmet la langue retenue au rendu via un en-tête.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LANG, LANG_HEADER, LANG_KEY, fromAcceptLanguage, normalizeLang } from './lib/i18n/langs';

const ONE_YEAR = 60 * 60 * 24 * 365;

export function middleware(req: NextRequest) {
  const fromQuery = normalizeLang(req.nextUrl.searchParams.get('lang'));
  const fromCookie = normalizeLang(req.cookies.get(LANG_KEY)?.value);
  const lang =
    fromQuery || fromCookie || fromAcceptLanguage(req.headers.get('accept-language')) || DEFAULT_LANG;

  const headers = new Headers(req.headers);
  headers.set(LANG_HEADER, lang);

  const res = NextResponse.next({ request: { headers } });

  /* un lien ?lang=xx vaut choix : on le retient pour la suite de la visite */
  if (fromQuery ? fromQuery !== fromCookie : !fromCookie) {
    res.cookies.set(LANG_KEY, lang, {
      path: '/',
      maxAge: ONE_YEAR,
      sameSite: 'lax',
    });
  }
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)'],
};
