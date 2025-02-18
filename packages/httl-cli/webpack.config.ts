import path from "path";
// import nodeExternals from "webpack-node-externals";
import webpack from "webpack";
import TerserPlugin from 'terser-webpack-plugin';

export default (env, argv) => {


  const optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  };
  const tsLoaderOptions = {
    configFile: 'tsconfig.prod.json',
    transpileOnly: true,
    compilerOptions: {
      sourceMap: false,
      declaration: false
    }
  }

  return {
    entry: "./src/index.ts",
    target: "node",
    mode: argv.mode || "development",
    devtool: argv.mode === 'development' ? 'source-map' : false,
    optimization: argv.mode === 'production' ? optimization : undefined,
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".js"],
      // alias: {
      //   "httl-core": require.resolve("httl-core"),
      // },
      // symlinks: false,
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'source-map-loader',
        },
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: argv.mode === 'production' ? tsLoaderOptions : undefined
            }
          ],
          exclude: /node_modules|dist/,
        },
      ],
    },
    externals: [
      // nodeExternals({ allowlist: ["chalk", "ora", "cli-cursor"] }),
      // /^(?!(httl-core)\/).+$/
    ],
    cache: false,
    plugins: [
      new webpack.BannerPlugin({
        banner: "#!/usr/bin/env node",
        raw: true,
      }),
    ],
    watchOptions: {
      ignored: [
        '**/node_modules',
        '**/dist',
      ],
      aggregateTimeout: 1000,
      poll: 1000,
    }
  };
}
