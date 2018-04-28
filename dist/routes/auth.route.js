'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _passport = require('../middlewares/passport.middleware');

var _passport2 = _interopRequireDefault(_passport);

var _auth = require('../controllers/auth.controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JWT_SECRET = process.env.JWT_SECRET;

var auth = _express2.default.Router();

auth.get('/facebook', _passport2.default.authenticate('facebook')).get('/facebook/callback', _passport2.default.authenticate('facebook', {
  failureRedirect: '/facebook/error'
}), _auth.generateJwt).get('/facebook/success', function (req, res) {
  try {
    var token = req.query.token;

    var _jsonwebtoken$verify = _jsonwebtoken2.default.verify(token, JWT_SECRET),
        id = _jsonwebtoken$verify.id;

    return res.redirect('/login?token=' + token + '&id=' + id);
  } catch (error) {
    return res.redirect('/api/v1/auth/facebook/error');
  }
}).get('/facebook/error*', function (req, res) {
  return res.status(401).json({
    status: 'fail',
    message: 'authentication failed'
  });
});

exports.default = auth;