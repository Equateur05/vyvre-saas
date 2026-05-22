/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Server actions and webhooks need raw body for signature verification
  experimental: { serverComponentsExternalPackages: ['stripe'] },
};

export default nextConfig;
