import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["puppeteer"],
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
