const path = require('path');

module.exports = {
  entry: './dist/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'server.js',
    clean: true,
  },
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: false,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  stats: {
    errorDetails: true,
  },
};
