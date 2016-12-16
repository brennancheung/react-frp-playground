const express = require('express')
const http = require('http')

const app = express()
const port = 3000

app.disable('x-powered-by')
console.log('Starting server')

const nodeEnv = process.env.NODE_ENV || 'development'
const isDev = nodeEnv === 'development'

if (isDev) {
  console.log('Webpack working...')
  const webpack = require('webpack')
  const webpackConfig = require('../../webpack.config')
  const compiler = webpack(webpackConfig)

  const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
    noInfo: true
  })
  const webpackHotMiddleware = require('webpack-hot-middleware')(compiler)

  app.use(webpackDevMiddleware)
  app.use(webpackHotMiddleware)
}

const server = http.createServer(app)
server.listen(port)
console.log(`server listenting on port ${port}`)
