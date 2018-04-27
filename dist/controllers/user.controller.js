'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.fetchCurrentUserApi = exports.fetchCurrentUser = undefined

var _regenerator = require('babel-runtime/regenerator')

var _regenerator2 = _interopRequireDefault(_regenerator)

var fetchCurrentUser = exports.fetchCurrentUser = (function () {
  var _ref = _asyncToGenerator(/* #__PURE__ */_regenerator2.default.mark(function _callee2 (id) {
    var _this = this

    return _regenerator2.default.wrap(function _callee2$ (_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', (0, _middlewares.catchBlock)(_server.isDevMode, _asyncToGenerator(/* #__PURE__ */_regenerator2.default.mark(function _callee () {
              return _regenerator2.default.wrap(function _callee$ (_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2
                      return _models.User.findOne({ id: id })

                    case 2:
                      return _context.abrupt('return', _context.sent)

                    case 3:
                    case 'end':
                      return _context.stop()
                  }
                }
              }, _callee, _this)
            }))))

          case 1:
          case 'end':
            return _context2.stop()
        }
      }
    }, _callee2, this)
  }))

  return function fetchCurrentUser (_x) {
    return _ref.apply(this, arguments)
  }
}())

var fetchCurrentUserApi = exports.fetchCurrentUserApi = (function () {
  var _ref3 = _asyncToGenerator(/* #__PURE__ */_regenerator2.default.mark(function _callee4 (req, res) {
    var _this2 = this

    return _regenerator2.default.wrap(function _callee4$ (_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            return _context4.abrupt('return', (0, _middlewares.catchBlock)(_server.isDevMode, _asyncToGenerator(/* #__PURE__ */_regenerator2.default.mark(function _callee3 () {
              var user
              return _regenerator2.default.wrap(function _callee3$ (_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2
                      return fetchCurrentUser(req.decoded.id)

                    case 2:
                      user = _context3.sent

                      if (!user) {
                        _context3.next = 5
                        break
                      }

                      return _context3.abrupt('return', res.status(200).json({ status: 'success', data: user }))

                    case 5:
                      return _context3.abrupt('return', res.status(404).json({ status: 'error', message: '404 user not found' }))

                    case 6:
                    case 'end':
                      return _context3.stop()
                  }
                }
              }, _callee3, _this2)
            })), function (message) {
              return res.status(500).json({ status: 'error', message: message })
            }))

          case 1:
          case 'end':
            return _context4.stop()
        }
      }
    }, _callee4, this)
  }))

  return function fetchCurrentUserApi (_x2, _x3) {
    return _ref3.apply(this, arguments)
  }
}())

var _models = require('../models')

var _server = require('../server')

var _middlewares = require('../middlewares')

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

function _asyncToGenerator (fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step (key, arg) { try { var info = gen[key](arg); var value = info.value } catch (error) { reject(error); return } if (info.done) { resolve(value) } else { return Promise.resolve(value).then(function (value) { step('next', value) }, function (err) { step('throw', err) }) } } return step('next') }) } }
