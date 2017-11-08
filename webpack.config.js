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
    devtool: env.sourceMaps ? "source-map" : undefined,
    resolve: {
      extensions: [".ts", ".tsx", ".js"],
      alias: {
        "aphrodite": "aphrodite/no-important"
      }
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
      loaders: [
        {
          test: /\.tsx?/,
          exclude: /node_modules/,
          loaders: compact([
            env.hmr && "react-hot-loader/webpack",
            "awesome-typescript-loader"
          ])
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          loaders: ["style-loader", "css-loader"]
        },
        {
          test: /\.(png|jpe?g|wav)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "file-loader",
              options: {}
            }
          ]
        }
      ]
    },
    devServer: {
      hot: env.hmr
    }
  };
};

function compact (array) {
  return array.filter((item) => item);
}
