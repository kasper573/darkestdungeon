const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = function (env = {}) {
  return {
    entry: compact([
      env.hmr && "react-hot-loader/patch",
      path.join(__dirname, "src", "main.tsx"),
    ]),
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    plugins: compact([
      new HtmlWebpackPlugin({title: "Darkest Dungeon"}),
      env.hmr && new webpack.NamedModulesPlugin(),
      env.hmr && new webpack.HotModuleReplacementPlugin()
    ]),
    module: {
      loaders: [{
        test: /\.tsx?/,
        include: path.join(__dirname, "src"),
        loaders: compact([
          env.hmr && "react-hot-loader/webpack",
          "awesome-typescript-loader"
        ])
      }]
    },
    devServer: {
      hot: env.hmr
    }
  };
};

function compact (array) {
  return array.filter((item) => item);
}
