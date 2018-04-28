'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grantAccess = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var grantAccess = exports.grantAccess = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var _args2, arg, name, resolver, context, model, isFind, isUpdate, result, hasAccess, currentUser, _result, id, role, isAdmin, _ref3, _id2, _role, _isAdmin, _id, record, oldBook, status;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _args2 = _slicedToArray(args, 4), arg = _args2[0], name = _args2[1], resolver = _args2[2], context = _args2[3];
            model = _mongoose2.default.model(Object.keys(_models.database.models).filter(function (modelName) {
              return name.includes(modelName);
            })[0]);
            isFind = name.includes('Find') && !name.includes('Create');
            isUpdate = name.includes('Update') || name.includes('Remove');

            if (!isFind) {
              _context2.next = 10;
              break;
            }

            _context2.next = 7;
            return resolver();

          case 7:
            _context2.t0 = _context2.sent;
            _context2.next = 11;
            break;

          case 10:
            _context2.t0 = null;

          case 11:
            result = _context2.t0;
            hasAccess = true;

            if (!(isFind && result)) {
              _context2.next = 27;
              break;
            }

            if (!(model.modelName === 'User')) {
              _context2.next = 25;
              break;
            }

            if (!Array.isArray(result)) {
              _context2.next = 22;
              break;
            }

            _context2.next = 18;
            return _models.User.findById(context.decoded.id);

          case 18:
            currentUser = _context2.sent;

            hasAccess = currentUser.role === 'ADMIN';
            _context2.next = 25;
            break;

          case 22:
            _result = result, id = _result.id, role = _result.role;
            isAdmin = role === 'ADMIN';

            hasAccess = context.decoded.id === id || isAdmin;

          case 25:
            _context2.next = 79;
            break;

          case 27:
            if (!isUpdate) {
              _context2.next = 70;
              break;
            }

            if (context.decoded.id) {
              _context2.next = 30;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('you  need a user account for this'));

          case 30:
            _context2.next = 32;
            return _models.User.findById(context.decoded.id);

          case 32:
            _ref3 = _context2.sent;
            _id2 = _ref3.id;
            _role = _ref3.role;
            _isAdmin = _role === 'ADMIN';
            _id = arg.record ? arg.record._id : arg._id;
            _context2.next = 39;
            return model.findById(_id);

          case 39:
            record = _context2.sent;

            hasAccess = _isAdmin || (model.modelName === 'User' ? _id2 === record.id : new RegExp(record.creatorId).test(_id2));

            if (!hasAccess) {
              _context2.next = 68;
              break;
            }

            if (!(!_isAdmin && model.modelName === 'User' && arg.record)) {
              _context2.next = 51;
              break;
            }

            if (!arg.record.role) {
              _context2.next = 47;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('illegal change of role attempted'));

          case 47:
            if (!arg.record.socialId) {
              _context2.next = 49;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('illegal change of login credentials attempted'));

          case 49:
            _context2.next = 58;
            break;

          case 51:
            if (!(_isAdmin && model.modelName === 'User' && _id2 === record.id)) {
              _context2.next = 58;
              break;
            }

            if (!arg.record.role) {
              _context2.next = 56;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('you  need another admin account to do change role'));

          case 56:
            if (!arg.record.socialId) {
              _context2.next = 58;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('you  need another admin account to do change socialId'));

          case 58:
            if (!(model.modelName === 'Book' && arg.record.lendingDetails && arg.record.lendingDetails.status)) {
              _context2.next = 65;
              break;
            }

            _context2.next = 61;
            return _models.Book.findById(arg.record._id);

          case 61:
            oldBook = _context2.sent;
            status = oldBook.status;

            if (!(status === 'DRAFT' && arg.record.lendingDetails.status !== 'UNAVAILABLE')) {
              _context2.next = 65;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('status of book should be available before lending.'));

          case 65:
            _context2.next = 67;
            return resolver(null, arg);

          case 67:
            result = _context2.sent;

          case 68:
            _context2.next = 79;
            break;

          case 70:
            if (!(model.modelName === 'User')) {
              _context2.next = 74;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('new user creation not allowed'));

          case 74:
            if (context.decoded.id) {
              _context2.next = 76;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('you  need a user account for this'));

          case 76:
            _context2.next = 78;
            return resolver(null, arg);

          case 78:
            result = _context2.sent;

          case 79:
            return _context2.abrupt('return', hasAccess ? result : new _graphql.GraphQLError('illegal access'));

          case 80:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function grantAccess() {
    return _ref2.apply(this, arguments);
  };
}();

exports.modifyResolver = modifyResolver;
exports.getSchema = getSchema;

var _graphql = require('graphql');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function modifyResolver(resolver, callback) {
  return Object.assign({}, resolver, {
    resolve: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        for (var _len = arguments.length, resolveParams = Array(_len), _key = 0; _key < _len; _key++) {
          resolveParams[_key] = arguments[_key];
        }

        var _resolveParams, source, args, context, info, result;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _resolveParams = _slicedToArray(resolveParams, 4), source = _resolveParams[0], args = _resolveParams[1], context = _resolveParams[2], info = _resolveParams[3];

                if (!(callback && typeof callback === 'function')) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', callback(args, info.fieldName, resolver.resolve.bind(null, { source: source, args: args, context: context, info: info }), context));

              case 3:
                _context.next = 5;
                return resolver.resolve({ source: source, args: args, context: context, info: info });

              case 5:
                result = _context.sent;
                return _context.abrupt('return', result);

              case 7:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resolve() {
        return _ref.apply(this, arguments);
      }

      return resolve;
    }()
  });
}

function getSchema(schemas, schemaName) {
  return schemas.filter(function (schema) {
    return schema[0] === schemaName;
  });
}