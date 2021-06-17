const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  devServer: {
    open: true,
    port: 3000,
    contentBase: './build',
    hot: true
  },
  devtool: 'cheap-module-source-map',
  entry: {
    main: path.resolve(__dirname, './src/index.tsx')
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({
      extensions: ['.tsx', '.ts', '.js'],
    })]
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: ['ts-loader']
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, {
          loader: 'css-loader',
          options: {
            modules: true
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({}),
    new HtmlWebpackPlugin({
      title: 'Evolution Project',
      inject: true,
      template: path.resolve(__dirname, './public/index.html'),
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {from: 'public/assets', to: 'assets'}
      ]
    })
  ],
}
