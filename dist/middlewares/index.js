'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.catchBlock = catchBlock

var _dev = require('./dev.middleware')

var _dev2 = _interopRequireDefault(_dev)

var _socket = require('./socket.middleware')

var _socket2 = _interopRequireDefault(_socket)

var _passport = require('./passport.middleware')

var _passport2 = _interopRequireDefault(_passport)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

function catchBlock (devMode, callback, errorCb) {
  try {
    return callback()
  } catch (error) {
    if (devMode) {
      throw error
    }

    throw new Error(error.message)
  } finally {
    return errorCb ? errorCb.bind(null, error.message)() : null
  }
}

module.exports.passport = _passport2.default
module.exports.socket = _socket2.default
module.exports.devMiddleware = _dev2.default
