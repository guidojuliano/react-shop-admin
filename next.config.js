/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [{ hostname: 'i.imgur.com' }, { hostname: 'placeimg.com' }, { hostname: 'google.com' }],
  },
};

module.exports = nextConfig;
