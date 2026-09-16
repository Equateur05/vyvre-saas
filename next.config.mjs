/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Server actions and webhooks need raw body for signature verification
  experimental: { serverComponentsExternalPackages: ['stripe'] },
  async redirects() {
    return [
      { source: '/scan-universel', destination: '/scan', permanent: false },
    ];
  },
  async headers() {
    return [
      { source: '/m/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      { source: '/scan/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
      { source: '/manifeste/:path*', headers: [{ key: 'Cache-Control', value: 'no-cache, must-revalidate' }] },
    ];
  },
  async rewrites() {
    return [
      { source: '/scan', destination: '/scan/index.html' },
      { source: '/scan/protocol', destination: '/scan/PROTOCOL_UNIVERSAL.html' },
      { source: '/manifeste', destination: '/manifeste/index.html' },
      { source: '/m/:brand', destination: '/m/index.html?b=:brand' },
      { source: '/m/:brand/protocol', destination: '/scan/PROTOCOL_UNIVERSAL.html?b=:brand' },

    ];
  },
};

export default nextConfig;
