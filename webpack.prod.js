const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const config = require("./webpack.config.js");

module.exports = merge(config, {

  devtool: "source-map",

  output: {
    path: path.join(__dirname, "dist/assets/js"),
    publicPath: "/",
    filename: "[name].js"
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    new UglifyJSPlugin({
      sourceMap: true
    })
  ]

});
