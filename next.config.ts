import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { nextRuntime, webpack }) => {
    if (nextRuntime === 'edge') {
      config.plugins.push(
        new webpack.DefinePlugin({ __dirname: '""' })
      );
    }
    return config;
  },
};

export default nextConfig;
