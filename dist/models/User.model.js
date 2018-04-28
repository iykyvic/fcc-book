'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var addressSchema = new Schema({
  street: { type: String, index: true },
  city: { type: String, index: true },
  state: { type: String, index: true },
  zip: {
    type: Number,
    validate: [{
      validator: function validator(value) {
        return (0, _validator.isPostalCode)(value, undefined.country);
      }, message: 'zip code must be valid.'
    }] },
  country: { type: String, index: true }
});
var userSchema = new Schema({
  socialId: {
    type: String,
    required: true,
    unique: true,
    match: /\d+/
  },
  displayName: {
    type: String,
    required: [true, 'displayName is required'],
    match: /^([A-Za-z]+((\s[A-Za-z]+)+)?)$/,
    index: true
  },
  emails: [{ value: {
      type: String,
      required: true,
      unique: true,
      validate: [{ validator: function validator(value) {
          return (0, _validator.isEmail)(value);
        }, message: 'email is invalid.' }]
    } }],
  photos: [{ value: { type: String, validate: { validator: _validator.isURL } } }],
  address: addressSchema,
  phone: {
    type: String,
    validate: [{
      validator: function validator(value) {
        return (0, _validator.isMobilePhone)(value, undefined.address.country);
      }, message: 'phone is invalid.'
    }]
  },
  role: { type: String, enum: ['ADMIN', 'USER'], required: true, default: 'USER' }
});

exports.default = userSchema;