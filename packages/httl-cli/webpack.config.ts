import path from "path";
import nodeExternals from "webpack-node-externals";

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
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
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  devtool: process.env.NODE_ENV === "production" ? false : "source-map",
  externals: [
    nodeExternals()
  ],
};
