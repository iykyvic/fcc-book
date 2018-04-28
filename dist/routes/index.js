'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('./auth.route');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  auth: _auth2.default
};