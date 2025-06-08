import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignorar advertencias durante el build en Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
