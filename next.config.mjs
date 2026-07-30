import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const stubPath = path.resolve(__dirname, "edge-stubs/empty.js");

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
  // The Anthropic SDK's tools/agent-toolset submodules statically import
  // node:child_process / node:fs / node:crypto. On the edge runtime
  // (required by @cloudflare/next-on-pages) webpack has no scheme handler
  // for node: URIs, so it errors even though we never CALL those submodules.
  // Redirect every node:* import to an empty stub.
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
        resource.request = stubPath;
      }),
    );
    return config;
  },
};

export default nextConfig;
