import type { NextConfig } from "next";
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

class CustomResolver {
  apply(resolver: any) {
    // console.log('CustomResolver', resolver.hooks);

    // console.log("dd", resolver.getHook('resolve'))
    // resolver.hooks.resolve.tapAsync('SimpleCustomResolver', (request: any, resolveContext: any, callback: any) => {
    //   console.log('SimpleCustomResolver', request.request);
    //   // if (request.request === 'some-package') {
    //   //   const resolvedPath = require.resolve('some-package/dist/worker.js');
    //   //   request.request = resolvedPath;
    //   // }
    //   callback();
    // });

    resolver.getHook('resolve').tapAsync('CustomResolver', (request: any, resolveContext: any, callback: any) => {
      // console.log('CustomResolver', request.request);
      // if (request.request.startsWith('gopa')) {

      if((request.request as string).includes('amdX.js')) {
        console.log("gopa", request, resolveContext)
      }

      // const packageJson = require(request.request)
      // if(!packageJson) {
      //   console.log('CustomResolver', request.request);
      // }
      // console.log('CustomResolver', request.request);
      // request.request = "gopa2";
      // const packageJsonPath = path.resolve('node_modules/some-package/package.json');
      // const packageJson = require(packageJsonPath);

      // if (packageJson.exports) {
      //   request.request = path.resolve('node_modules/some-package', packageJson.exports['./worker.js']);
      // }
      // }
      callback();
    });
  }
}

const nextConfig: NextConfig = {
  webpack(config, { isServer, webpack }) {
    if (!isServer) {

      config.resolve.mainFields = ['browser', 'module', 'main', 'exports'];
      config.resolve.fallback = {
        fs: false,
        module: false,
        vm: false,
      }
      // config.plugins.push(
      //   new webpack.ContextReplacementPlugin(
      //     /vscode-oniguruma/, // Match the dynamic require context
      //     path.resolve(__dirname, 'vscode-oniguruma/release/onig.wasm') // Resolve to specific directory
      //   )
      // )
      // config.plugins.push(
      //   new webpack.ContextReplacementPlugin(
      //     /gopa/, // Match the dynamic require context
      //     path.resolve(__dirname, 'vscode-oniguruma/release/onig.wasm') // Resolve to specific directory
      //   )
      // )
      config.resolve.plugins.push(
        // new CustomResolver(),
        // new BundleAnalyzerPlugin()
      );
      // console.log('webpack', config.resolve); // 5.21.2
      // config.module.rules.push({
      //   test: /(\/)?worker(\.js)?$/,
      //   use: {
      //     loader: 'worker-loader',
      //     // options: { inline: true } ,
      //     options: {
      //       filename: 'static/[name].worker.js',
      //       publicPath: '/_next/',
      //     },
      //   },
      // });
    }

    // Enable Web Workers as modules
    // config.experiments.outputModule = true;

    return config;
  },
};

export default nextConfig;
