const path = require("path");

module.exports = {

  externals: {
    jquery: "jQuery"
  },

  context: path.join(__dirname, "src"),

  entry: {
    app: ["./js/app"]
  },

  module: {
    rules: [
      {
        test: /\.((png)|(eot)|(woff)|(woff2)|(ttf)|(svg)|(gif))(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=/[hash].[ext]"
      },
      {
        test: /\.json$/,
        loader: "json-loader"
      },
      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
        query: {cacheDirectory: true}
      }
    ]
  }

};
