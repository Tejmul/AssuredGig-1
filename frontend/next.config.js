/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'i.pravatar.cc',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com'
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Add output configuration for Vercel
  output: 'standalone',
  // Add experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Disable server-side rendering for pages that use localStorage
  // This is a workaround for the 500 error
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 