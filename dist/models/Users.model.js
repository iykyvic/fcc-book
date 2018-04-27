'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _mongoose = require('mongoose')

var _mongoose2 = _interopRequireDefault(_mongoose)

var _validator = require('validator')

var _findOrCreate = require('./find-or-create.plugin')

var _findOrCreate2 = _interopRequireDefault(_findOrCreate)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

var Schema = _mongoose2.default.Schema
var userSchema = new Schema({
  id: {
    type: String,
    required: true,
    match: /\d+/
  },
  displayName: { type: String, required: true, match: /^([A-Za-z]+((\s[A-Za-z]+)+)?)$/ },
  emails: [{ value: {
    type: String,
    required: true,
    unique: true,
    validate: [{ validator: function validator (value) {
      return (0, _validator.isEmail)(value)
    },
      message: 'Invalid email.' }]
  } }],
  photos: [{ value: { type: String, validate: { validator: _validator.isURL } } }]
})

userSchema.plugin(_findOrCreate2.default)
var User = _mongoose2.default.model('User', userSchema)

exports.default = User
