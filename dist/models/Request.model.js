'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Schema = _mongoose2.default.Schema;

var requestSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [true, 'book id required']
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'creator required']
  }
}, { timestamps: true });

requestSchema.index({ bookId: 1, creatorId: 1 }, { background: true });

requestSchema.pre('remove', _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
  var book;
  return _regenerator2.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return this.model('Book').findOne({
            _id: this.bookId,
            'lendingDetails.loanedTo': this.creatorId
          });

        case 2:
          book = _context.sent;

          if (!book) {
            _context.next = 6;
            break;
          }

          _context.next = 6;
          return book.update({
            'lendingDetails.status': 'AVAILABLE',
            'lendingDetails.loanedTo': null
          });

        case 6:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, this);
})));

exports.default = requestSchema;