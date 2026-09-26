/**
 * Journal technique anonyme du scan (26/09).
 *
 * Le scan cheveux echouait sur l'iPhone de Charles sans qu'on sache pourquoi : aucune console
 * lisible sur un telephone. La page envoie ici quelques chiffres (modeles charges, visage vu,
 * part de cheveux vue, nettete, raison du refus, navigateur). Jamais d'image, jamais de nom,
 * jamais d'adresse : on ecrit juste une ligne dans les journaux Vercel.
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const txt = (await req.text()).slice(0, 2000);
    const data = JSON.parse(txt);
    console.log('[journal]', JSON.stringify(data));
  } catch {
    /* on ne renvoie jamais d'erreur a la page : c'est un journal, pas une fonction */
  }
  return new NextResponse(null, { status: 204 });
}
