const env = require('dotenv')
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

env.config()
const { NODE_ENV, HOST_NAME } = process.env
const isDevMode = NODE_ENV === 'development'

const config = {
  mode: NODE_ENV,
  devtool: 'inline-source-map',
  entry: './client/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/public/assets'),
    publicPath: '/public/assets/'
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/, /dist/, /server/],
        include: path.join(__dirname, 'client'),
        test: /\.(js|jsx)$/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.s*css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.(jpg|png|svg|gif|ico)$/,
        use: 'url-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(`${HOST_NAME}/api/v1/`),
      HOST_NAME: JSON.stringify(`${HOST_NAME}`),
      NODE_ENV: JSON.stringify(`${NODE_ENV}`)
    }),
    new HtmlWebpackPlugin({
      title: 'FCC STOCK',
      template: './server/public/index.html',
      filename: path.resolve(__dirname, 'dist/public/index.html')
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],

  resolve: { extensions: ['.js', '.jsx'] }
}

if (isDevMode) {
  config.entry = [
    config.entry,
    'webpack-hot-middleware/client?reload=true&quiet=true'
  ]
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
