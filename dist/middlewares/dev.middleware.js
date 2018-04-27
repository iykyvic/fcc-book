'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.default = devMiddleware

var _path = require('path')

var _path2 = _interopRequireDefault(_path)

var _webpackDevMiddleware = require('webpack-dev-middleware')

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware)

var _webpackHotMiddleware = require('webpack-hot-middleware')

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware)

var _webpack = require('webpack')

var _webpack2 = _interopRequireDefault(_webpack)

var _webpack3 = require('../../webpack.config')

var _webpack4 = _interopRequireDefault(_webpack3)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

function devMiddleware (app) {
  var compiler = (0, _webpack2.default)(_webpack4.default)
  app.use((0, _webpackDevMiddleware2.default)(compiler, {
    noInfo: true,
    publicPath: _webpack4.default.output.publicPath
  }))
  app.use((0, _webpackHotMiddleware2.default)(compiler))

  app.use('*', function (req, res, next) {
    var filename = _path2.default.join(compiler.outputPath, '../index.html')

    return compiler.outputFileSystem.readFile(filename, function (err, result) {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)

      return res.end()
    })
  })
};
