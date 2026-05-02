import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
      },
    ],
  },
  output: "standalone",
  serverExternalPackages: ["@sparticuz/chromium"],
};

export default nextConfig;
