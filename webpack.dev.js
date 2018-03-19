const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const config = require("./webpack.config.js");

module.exports = merge(config, {

  devtool: "eval-source-map",

  output: {
    path: path.join(__dirname, "dev/assets/js"),
    publicPath: "/",
    filename: "[name].js"
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("development")
    })
  ]

});
