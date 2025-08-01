const path = require('path');

module.exports = {
  entry: './dist/index.js',
  target: 'node',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'server.js',
    clean: true,
    libraryTarget: 'commonjs2',
  },
  optimization: {
    minimize: true,
    usedExports: true,
    sideEffects: false,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  externals: {
    // Exclude node modules from bundling
    ws: 'commonjs ws',
    cors: 'commonjs cors',
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
