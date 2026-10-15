/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Server actions and webhooks need raw body for signature verification
  experimental: { serverComponentsExternalPackages: ['stripe'] },
  async redirects() {
    return [
      { source: '/scan-universel', destination: '/scan', permanent: false },
      // l'ancienne page anglaise est devenue la page unique, servie en anglais
      { source: '/pricing/en', destination: '/pricing?lang=en', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/m/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      { source: '/scan/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      /* 16/10 : le catalogue (6 Mo, 0,65 Mo compresse) est appele avec une version fixe ?v= : une heure de cache,
         puis revalidation en arriere-plan ; monter ?v= dans les pages quand il change */
      { source: '/scan/catalogue/all.json', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }] },
      { source: '/manifeste/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      /* la page de travail des animations de chargement n'a plus de route publique ;
         son fichier reste servi par son chemin brut, on interdit au moins l'indexation. */
      { source: '/propals/chargement/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      /* 15/10/2026 (audit du 11/10, point 4) : hors de Google les pages de travail, de test, de demonstration
         et les pages de demarchage /m/<marque> (le nom d'une marque ne doit pas remonter associe a VYVRE). */
      ...[
        '/propals/:path*',
        '/intro/:path*',
        '/m/:path*',
        '/dior/:path*',
        '/dior',
        '/PROTOCOL_DIOR.html',
        '/PROTOCOL_DIOR_BLANC.html',
        '/test-scan-engine.html',
        '/scan/avant/:path*',
        '/wrap/demo.html',
        '/wrap/propales-:page',
        '/widget/:path*',
        '/success',
        '/dashboard/:path*',
      ].map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] })),
      /* polices servies par vyvre.fr : le nom du fichier change avec ?v=, on peut les garder un an */
      { source: '/fonts/:file*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/scan/index.html' },
      ],
      afterFiles: [
      { source: '/scan', destination: '/scan/index.html' },
      { source: '/cheveux', destination: '/cheveux/index.html' },
      { source: '/m/:brand/cheveux', destination: '/cheveux/index.html?b=:brand' },
      { source: '/scan/protocol', destination: '/scan/PROTOCOL_UNIVERSAL.html' },
      { source: '/manifeste', destination: '/manifeste/index.html' },
      /* /chargements retiree le 19/09 : page de travail interne (propales d'animations
         de chargement, mentions « A placer »). Le fichier reste dans
         public/propals/chargement/ et s'ouvre en local, il n'est plus servi en ligne. */
      { source: '/m/:brand', destination: '/m/index.html?b=:brand' },
      { source: '/m/:brand/protocol', destination: '/scan/PROTOCOL_UNIVERSAL.html?b=:brand' },
      /* 07/10/2026 : la fin de chaque Wrap aliments ecrit « liste sur vyvre.fr/wrap/credits » (credits des photos) */
      { source: '/wrap/credits', destination: '/wrap/credits.html' },
      ],
      fallback: [],
    };
  },
};

export default nextConfig;
