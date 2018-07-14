const path = require("path");

module.exports = {

  context: path.join(__dirname, "src"),

  entry: {
    app: "./js/app.js"
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
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
