import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/friends-merch',
  assetPrefix: '/friends-merch/',
};

export default nextConfig;
