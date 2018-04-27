'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.User = exports.database = undefined

var _dotenv = require('dotenv')

var _dotenv2 = _interopRequireDefault(_dotenv)

var _bluebird = require('bluebird')

var _bluebird2 = _interopRequireDefault(_bluebird)

var _mongoose = require('mongoose')

var _mongoose2 = _interopRequireDefault(_mongoose)

var _Users = require('./Users.model')

var _Users2 = _interopRequireDefault(_Users)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

_dotenv2.default.config()
_mongoose2.default.Promise = _bluebird2.default
_mongoose2.default.connect(process.env.MONGODB_URI)

var database = exports.database = _mongoose2.default.connection
var User = exports.User = _Users2.default
