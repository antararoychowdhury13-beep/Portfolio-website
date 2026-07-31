/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [],
  },
  async rewrites() {
    return [
      {
        source: "/agentic",
        destination: "/agentic/index.html",
      },
    ];
  },
};

export default nextConfig;
