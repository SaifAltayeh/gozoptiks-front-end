import type { NextConfig } from "next";

const API_URL = process.env.API_URL || "http://localhost:4000";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560, 3840],
    qualities: [75, 95, 100],
  },
  async rewrites() {
    return [{ source: "/uploads/:path*", destination: `${API_URL}/uploads/:path*` }];
  },
};

export default nextConfig;
