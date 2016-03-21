// This helps us find paths!
var path = require('path');

module.exports = {
  entry: {
    doctop: ['./src/doctop.ts'],
    tests: ['./test/doctop.spec.ts']
  },
  output: { // Transpiled and bundled output gets put in `build/bundle.js`.
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',   // Really, you want to upload index.html and assets/bundle.js
    libraryTarget: 'commonjs'
  },

  // This makes it easier to debug scripts by listing line number of whichever file
  // threw the exception or console.log or whathaveyounot.
  devtool: 'inline-source-map',

  // It provides a bit too much info by default.
  devServer: {
    stats: 'errors-only'
  },

  node: {
    process: false
  },

  module: {
    preLoaders: [
      {
        test: /\.ts$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      }
    ],
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  }
}
