const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");
const webpack = require("webpack");

const fileLoader = {
  loader: "file-loader",
  options: {
    name: "assets/[hash].[ext]"
  }
};

const imageCompressionLoader = {
  loader: "image-webpack-loader",
  options: {
    mozjpeg: {progressive: true, quality: 65},
    optipng: {enabled: false},
    pngquant: {quality: "65-90", speed: 4},
    gifsicle: {interlaced: false},
    webp: {quality: 75}
  }
};

module.exports = function (env = {}) {
  return {
    entry: compact([
      path.join(__dirname, "src", "polyfills", "index.js"),
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
        "aphrodite": "aphrodite/no-important",
        "src": path.resolve(__dirname, "src")
      }
    },
    plugins: compact([
      new HtmlWebpackPlugin({title: "Dankest Dungeon"}),
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
          test: /\.ogg$/,
          exclude: /node_modules/,
          use: [fileLoader]
        },
        {
          test: /\.(png|jpe?g)$/,
          exclude: /node_modules/,
          use: compact([
            fileLoader,
            env.compress && imageCompressionLoader
          ])
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
