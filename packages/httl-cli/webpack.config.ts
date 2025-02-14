import path from "path";
// import nodeExternals from "webpack-node-externals";
import webpack from "webpack";

export default {
  entry: "./src/index.ts",
  target: "node",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  output: {
    path: path.resolve(__dirname, "dist"),
    // path: path.resolve(import.meta.dirname, "dist"),
    filename: "index.js",
    clean: true,
    // library: {
    //   type: 'module', // Output ES module
    // },
    // module: true,
    // libraryTarget: 'commonjs2', // Ensures output uses CommonJS
    // libraryTarget: 'module', // Outputs an ES module
  },
  // experiments: {
  //   outputModule: true, // Enables ES module output
  // },
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
      // {
      //   test: /\.(t|j)sx?$/,
      //   // exclude: /node_modules/,
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         '@babel/preset-env',
      //         '@babel/preset-typescript'
      //       ],
      //     },
      //   },
      // },
      // {
      //   test: /\.(t|j)sx?$/,
      //   include: /node_modules/,
      //   // include: filename => {
      //   //   return /node_modules\/chalk/.test(filename)
      //   // },
      //   use: {
      //     loader: 'babel-loader',
      //     options: {
      //       presets: [
      //         ["@babel/preset-env", {
      //           "modules": "commonjs"
      //         }]
      //       ]
      //     }
      //   }
      // },
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: process.env.NODE_ENV === "production" ? false : "source-map",
  externals: [
    // nodeExternals({ allowlist: ["chalk", "ora", "cli-cursor"] }),
  ],
  cache: false,
  plugins: [
    new webpack.BannerPlugin({
      banner: "#!/usr/bin/env node",
      raw: true,
    }),
  ],
};
