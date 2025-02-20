import path from "path";
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
