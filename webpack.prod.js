const path = require("path");
const merge = require("webpack-merge");
const config = require("./webpack.config.js");

module.exports = merge(config, {

  mode: "production",

  devtool: "source-map",

  output: {
    path: path.join(__dirname, "dist/assets/js"),
    publicPath: "/",
    filename: "[name].js"
  }

});
