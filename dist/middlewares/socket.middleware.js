'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _server = require('../server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var socketIo = function socketIo(app) {
  var host = process.env.HOST_NAME.replace(/:\d+/, '');
  var port = _server.isDevMode ? ':' + process.env.PORT : ':*';
  var sio = (0, _socket2.default)(app, {
    origins: '' + host + port,
    wsEngine: 'ws',
    transports: ['websocket', 'polling']
  });

  // middleware
  sio.on('connection', function (socket) {});
};

exports.default = socketIo;