/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs'],
  },
  // Don't fail build on TypeScript errors (fix them later)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Don't fail build on ESLint errors
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig