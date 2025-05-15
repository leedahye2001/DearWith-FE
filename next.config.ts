import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;
