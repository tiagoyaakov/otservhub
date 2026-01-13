import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co",
    "*.replit.app",
    "*.riker.replit.dev",
    "127.0.0.1",
    "localhost",
  ],
};

export default nextConfig;
