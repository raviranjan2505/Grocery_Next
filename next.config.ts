import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.dummyjson.com"], // simple domain whitelist
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
