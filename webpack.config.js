const path = require('path')
const webpack = require('webpack')

const HtmlWebpackPlugin = require('html-webpack-plugin')

const nodeEnv = process.env['NODE_ENV'] || 'development'
const isProd = nodeEnv === 'production'

const contextPath = path.resolve(__dirname, 'src/app')
const outputPath = path.join(__dirname, 'dist')
const publicPath = 'http://localhost:3000/'

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {NODE_ENV: JSON.stringify(nodeEnv)}
  }),
  new HtmlWebpackPlugin({
    inject: true,
    template: './index.html'
  }),
  new webpack.NamedModulesPlugin()
]

const appEntry = []
if (isProd) {
  // production
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
        // my custom below
        collapse_vars: true,
        reduce_vars: true,
        loops: true,
        booleans: true
      },
      output: {
        comments: false
      }
    })
  )
} else {
  // development
  appEntry.push(
    'react-hot-loader/patch',
    'webpack-hot-middleware/client'
  )
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    })
  )
}
appEntry.push('./index.js')

module.exports = {
  entry: {
    app: appEntry,
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: isProd ? '[chunkhash]-[name]-bundle.js' : '[name]-bundle.js',
    publicPath: '/',
    path: outputPath
  },

  devtool: isProd ? 'source-map' : 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.styl/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      },
    ]
  },
  context: contextPath,
  plugins
}
