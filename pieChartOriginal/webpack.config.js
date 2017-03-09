var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path');

module.exports = {
  context: path.join(__dirname, "src"),
  //devtool: debug ? "inline-sourcemap" : null,
  devtool: "inline-sourcemap",
  entry: "./js/populationPieChart.js",
  node: {
            fs: 'empty'
    },
    externals: [
        {
            './cptable': 'var cptable'
        }
    ],
  module: {
    loaders: [
      {
        test: /\.jsx?$|\.json?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }
    ]
  },
  output: {
    path: __dirname + "/src/",
    filename: "client.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};
