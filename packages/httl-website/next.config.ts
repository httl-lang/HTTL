import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack(config, { isServer }) {
    if (!isServer) {
      config.module.rules.push({
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader',
          // options: { inline: true } ,
          options: {
            filename: 'static/[hash].worker.js',
            publicPath: '/_next/',
          },
        },
      });
    }

    return config;
  },
};

export default nextConfig;
