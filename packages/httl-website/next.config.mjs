// import type { NextConfig } from "next";
import nextra from 'nextra'
import { createHighlighter, } from 'shiki'
import httlGrammars from './src/components/editor/httl-extension/language/grammars.json' assert { type: 'json' };

const withNextra = nextra({
  contentDirBasePath: '/docs',
  mdxOptions: {
    rehypePrettyCodeOptions: {
      getHighlighter: options =>
        createHighlighter({
          ...options,
          langs: [
            ...options.langs,
            httlGrammars
          ]
        })
    }
  }
});

const nextConfig = {
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

    config.module.rules.unshift({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto"
    });

    // console.log(config.module.rules)

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
