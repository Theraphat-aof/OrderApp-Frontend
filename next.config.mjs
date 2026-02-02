/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable strict mode to prevent double-effects in dev
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:7000/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
