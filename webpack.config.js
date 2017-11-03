const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const webpack = require("webpack");

module.exports = function (env = {}) {
  return {
    entry: compact([
      path.join(__dirname, "polyfills", "index.js"),
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
      env.hmr && new webpack.HotModuleReplacementPlugin(),
      env.minify && new MinifyPlugin(),
      env.prod && new webpack.DefinePlugin({
        "process.env": {
          "NODE_ENV": JSON.stringify("production")
        }
      })
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
