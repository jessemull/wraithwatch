const path = require('path');
const dotenv = require('dotenv');
const TerserPlugin = require('terser-webpack-plugin');

dotenv.config();

module.exports = {
  entry: './src/index.ts',
  devtool: false,
  target: 'node',
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: {
    assert: 'commonjs assert',
    buffer: 'commonjs buffer',
    crypto: 'commonjs crypto',
    events: 'commonjs events',
    fs: 'commonjs fs',
    http: 'commonjs http',
    https: 'commonjs https',
    module: 'commonjs module',
    os: 'commonjs os',
    path: 'commonjs path',
    stream: 'commonjs stream',
    url: 'commonjs url',
    util: 'commonjs util',
    vm: 'commonjs vm',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'none',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        exclude: /index\.ts$/,
        terserOptions: {
          compress: {
            drop_console: true,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
