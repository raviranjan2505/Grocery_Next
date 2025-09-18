import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "forestgarden.nexusitsoftech.com",
        pathname: "/**", // allow all paths
      },
    ],
  },
};

export default nextConfig;
