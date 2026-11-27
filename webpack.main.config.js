const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [{ test: /\.png$/, type: 'asset/inline' }]
  },
  plugins: [
    // Optional native add-ons that are loaded inside try/catch; leave them out.
    new webpack.IgnorePlugin({
      resourceRegExp: /^(bufferutil|utf-8-validate|zlib-sync|fsevents)$/
    })
  ]
};
