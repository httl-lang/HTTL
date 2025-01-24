import type { NextConfig } from "next";
import nextra from 'nextra'

const withNextra = nextra({
  contentDirBasePath: '/docs',
})

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack(config, { isServer, webpack }) {
    if (!isServer) {

      config.resolve.mainFields = ['browser', 'module', 'main', 'exports'];
      config.resolve.fallback = {
        fs: false,
        module: false,
        vm: false,
      }
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: '/docs',
        destination: '/docs/introduction/about-httl',
        permanent: false,
      },
    ];
  },
};

export default withNextra(nextConfig);
