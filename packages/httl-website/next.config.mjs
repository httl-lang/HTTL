import nextra from 'nextra'
import { createHighlighter, } from 'shiki'
import fs from 'fs/promises';

const httlGrammars = JSON.parse(
  await fs.readFile(new URL('./src/components/editor/httl-extension/language/grammars.json', import.meta.url), 'utf-8')
);

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
        ...config.resolve.fallback,
        fs: false,
        module: false,
        vm: false,
        http: false,
        https: false,
        tls: false,
        net: false,
        zlib: false,
        os: false,
        crypto: false,
        stream: false,
        'form-data': false,
        path: 'path-browserify',
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      );
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
