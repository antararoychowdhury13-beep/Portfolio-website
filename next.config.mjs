/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [],
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/agent-home.html" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
