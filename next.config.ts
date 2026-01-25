import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents disabled - causes build issues with cookie-based auth routes
  // Re-enable once all routes are properly configured for static/dynamic rendering
};

export default nextConfig;
