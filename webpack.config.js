const path = require("path");

module.exports = {

  context: path.join(__dirname, "src"),

  entry: {
    app: "./js/app.js"
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
        query: { cacheDirectory: true }
      }
    ]
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        // Override some of the default 'vendors' behavior for the SplitChunksPlugin.
        vendors: {
          chunks: "initial",
          name: "vendor",
          test: /node_modules/,
          enforce: true
        }
      }
    }
  }

};
