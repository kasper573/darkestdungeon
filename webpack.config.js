const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = function () {
  return {
    entry: [
      path.join(__dirname, "src", "main.tsx")
    ],
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js"
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
      new HtmlWebpackPlugin({title: "Darkest Dungeon"})
    ],
    module: {
      loaders: [{
        test: /\.tsx?/,
        include: path.join(__dirname, "src"),
        loaders: [
          "awesome-typescript-loader"
        ]
      }]
    }
  };
};
