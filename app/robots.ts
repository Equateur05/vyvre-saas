/**
 * VYVRE — /robots.txt (15/10/2026, audit du 11/10, point 4).
 * Tout reste explorable : les pages de travail, de test et de demarchage portent
 * un « noindex » (next.config.mjs), que Google doit pouvoir lire pour les retirer.
 */
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: 'https://vyvre.fr/sitemap.xml',
    host: 'https://vyvre.fr',
  };
}
