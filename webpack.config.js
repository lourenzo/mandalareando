const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
  entry: {
    app: './src/app.js',
  },
  output: {
    filename: '[name].bundle.js',
  },
  devServer: {
    port: 3000,
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new HtmlWebpackPlugin({
      template: './src/index.pug',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: ['pug-loader'],
      },
    ],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
    config.devServer = { contentBase: './dist' };
  }
  if (argv.mode === 'production') {
    config.mode = 'production';
  }

  return config;
};
