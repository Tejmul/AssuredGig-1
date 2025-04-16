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
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Add output configuration for Vercel
  output: 'standalone',
  // Add experimental features for better performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    serverActions: true,
  },
  // Improve performance
  poweredByHeader: false,
  compress: true,
  // Fix potential issues
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig 