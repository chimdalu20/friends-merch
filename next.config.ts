import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served as plain static files from cPanel (friendsmerch.favtoma.com), not a
  // Node server. No basePath: the export sits at the subdomain root, so asset
  // paths are root-relative. trailingSlash keeps exported paths identical to the
  // URLs Apache serves (it returns <dir>/index.html for a directory request).
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
