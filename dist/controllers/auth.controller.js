'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.generateJwt = generateJwt
exports.verifyToken = verifyToken
exports.ownsPoll = ownsPoll

var _jsonwebtoken = require('jsonwebtoken')

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken)

function _interopRequireDefault (obj) { return obj && obj.__esModule ? obj : { default: obj } }

var JWT_SECRET = process.env.JWT_SECRET

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

function generateJwt (req, res) {
  try {
    var _req$user = req.user,
      id = _req$user.id,
      _id = _req$user._id

    var token = _jsonwebtoken2.default.sign({ id: id, _id: _id }, JWT_SECRET, { expiresIn: '1h' })

    return res.redirect('/login?token=' + token)
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
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
function verifyToken (req, res, next) {
  try {
    req.decoded = _jsonwebtoken2.default.verify(req.headers.authorization, JWT_SECRET)

    return next()
  } catch (error) {
    var message = error.message

    var statusCode = message === 'jwt expired' ? 401 : 500
    var status = message === 'jwt expired' ? 'fail' : 'error'

    return res.status(statusCode).json({ status: status, message: message })
  }
}

exports.default = verifyToken
