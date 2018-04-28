'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = devMiddleware;

var _webpackDevMiddleware = require('webpack-dev-middleware');

var _webpackDevMiddleware2 = _interopRequireDefault(_webpackDevMiddleware);

var _webpackHotMiddleware = require('webpack-hot-middleware');

var _webpackHotMiddleware2 = _interopRequireDefault(_webpackHotMiddleware);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _webpack3 = require('../../webpack.config');

var _webpack4 = _interopRequireDefault(_webpack3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function devMiddleware(app) {
  var compiler = (0, _webpack2.default)(_webpack4.default);
  app.use((0, _webpackDevMiddleware2.default)(compiler, {
    noInfo: true,
    publicPath: _webpack4.default.output.publicPath
  }));
  app.use((0, _webpackHotMiddleware2.default)(compiler));

  app.use('*', function (req, res) {
    res.set('content-type', 'text/html');
    return res.send('<!DOCTYPE html>\n    <html lang="en">\n      <head>\n        <title>FCC BOOK</title>\n        <meta name="viewport" content="width=device-width" />\n        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500">\n      </head>\n      <body>\n        <div id="book"></div>\n        <script type="text/javascript" src="/public/assets/bundle.js"></script>\n      </body>\n    </html>\n    ');
  });
};