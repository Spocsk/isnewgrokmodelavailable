import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingIncludes: {
    "/opengraph-image": [
      "./assets/fonts/**/*",
      "./public/plates/**/*",
    ],
  },
};

export default nextConfig;
