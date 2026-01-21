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
  // Webpack configuration for Three.js compatibility
  webpack: (config, { isServer }) => {
    // Client-side only fallbacks for Three.js
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    return config
  },
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
  // Increase timeout for API routes
  serverRuntimeConfig: {
    maxDuration: 60,
  },
}

export default nextConfig
