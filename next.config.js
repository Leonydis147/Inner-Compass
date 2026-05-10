/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Allow large API responses (streaming)
  api: {
    responseLimit: false,
  },
  // Vercel deployment optimizations
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
