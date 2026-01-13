import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Uncomment and set basePath if deploying to a subdirectory
  // basePath: '/illegalfactions',
};

export default nextConfig;
