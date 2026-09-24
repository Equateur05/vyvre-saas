/**
 * VYVRE — accès aux dictionnaires des pages Next.
 *
 * Tout est chargé côté serveur : la page arrive déjà écrite dans la langue
 * demandée, sans clignotement ni latence côté navigateur.
 */

import fr from './dict/fr';
import en from './dict/en';
import es from './dict/es';
import it from './dict/it';
import de from './dict/de';
import pt from './dict/pt';
import nl from './dict/nl';
import ru from './dict/ru';
import ar from './dict/ar';
import ja from './dict/ja';
import ko from './dict/ko';
import zh from './dict/zh';
import { DEFAULT_LANG, type Lang } from './langs';

export type Key = keyof typeof fr;
export type Dict = Record<Key, string>;

const DICTS: Record<Lang, Partial<Dict>> = { fr, en, es, it, de, pt, nl, ru, ar, ja, ko, zh };

export type T = (key: Key, vars?: Record<string, string | number>) => string;

/** Traducteur d'une langue : repli sur le français clé par clé. */
export function translator(lang: Lang): T {
  const dict = DICTS[lang] || {};
  return (key, vars) => {
    const raw = (dict[key] as string | undefined) ?? (fr[key] as string | undefined) ?? String(key);
    if (!vars) return raw;
    return raw.replace(/\{(\w+)\}/g, (m, k: string) =>
      vars[k] === undefined || vars[k] === null ? m : String(vars[k])
    );
  };
}

export function dictOf(lang: Lang): Partial<Dict> {
  return DICTS[lang] || DICTS[DEFAULT_LANG];
}
