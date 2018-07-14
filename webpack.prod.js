const path = require("path");
const merge = require("webpack-merge");
const ManifestPlugin = require("webpack-manifest-plugin");
const config = require("./webpack.config.js");

module.exports = merge(config, {

  mode: "production",

  devtool: "source-map",

  output: {
    path: path.join(__dirname, "dist/assets/js"),
    filename: "[name].[chunkhash:10].js"
  },

  plugins: [
    new ManifestPlugin({
      fileName: "webpack-manifest.json"
    })
  ]

});
