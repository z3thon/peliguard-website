import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.squarespace-cdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static1.squarespace.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
