/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Standalone output for better Hostinger deployment
  output: 'standalone',
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  experimental: {
    turbo: {
      resolveAlias: {
        // Three.js fallbacks for client-side
        canvas: false,
        encoding: false,
        fs: false,
        path: false,
        crypto: false,
      },
    },
  },
}

export default nextConfig
