'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateJwt = generateJwt;
exports.getUser = getUser;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JWT_SECRET = process.env.JWT_SECRET;

/**
 * generate Jwt
 *
 * @export
 *
 * @param {object} req the request object
 * @param {object} res the response object
 *
 * @returns {object} the jwt token
 */

function generateJwt(req, res) {
  try {
    var id = req.user.id;

    var token = _jsonwebtoken2.default.sign({ id: id }, JWT_SECRET, { expiresIn: '1h' });

    return res.redirect('/api/v1/auth/facebook/success?token=' + token);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Checks if a user is Logged token is valid
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next the callback function
 *
 * @returns {Object} the next response
 */
function getUser(req, res, next) {
  try {
    req.decoded = _jsonwebtoken2.default.verify(req.headers.authorization, JWT_SECRET);

    return next();
  } catch (error) {
    var message = error.message;

    var statusCode = message === 'jwt expired' ? 401 : 500;
    var status = message === 'jwt expired' ? 'fail' : 'error';

    if (req.headers.authorization) {
      return res.status(statusCode).json({ status: status, message: message });
    }

    req.decoded = { id: null };

    return next();
  }
}

exports.default = getUser;