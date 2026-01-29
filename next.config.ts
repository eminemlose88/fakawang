import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      // Handle standard paths
      {
        source: '/api/v1/:path*',
        destination: 'http://18.139.217.127:8000/api/v1/:path*',
      },
      // Proxy static assets for Epusdt
      {
        source: '/static/:path*',
        destination: 'http://18.139.217.127:8000/static/:path*',
      }
    ]
  },
};

export default nextConfig;
