import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // WARNING: 'output: export' does NOT work with API routes!
  // Your app has API routes in /app/api/* that require a Node.js server.
  // 
  // For shared hosting deployment options:
  // 1. Deploy to Vercel/Netlify (free tier available) - they handle Node.js
  // 2. Convert API routes to client-side calls (but exposes API keys!)
  // 3. Use a different hosting solution that supports Node.js
  //
  // Uncomment below ONLY if you remove all /app/api routes:
  // output: 'export',
  // trailingSlash: true,
  
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
