/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
      canvas: false,
      encoding: false
    };
    return config;
  }
};

export default nextConfig;
