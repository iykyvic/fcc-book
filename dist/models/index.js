'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlSchema = exports.database = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); // This file dynamically imports and creates graphql schemas out of models. model file must be named singular


var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _node = require('graphql-compose-mongoose/node8');

var _graphqlCompose = require('graphql-compose');

var _graphqlTools = require('graphql-tools');

var _findOrCreate = require('./find-or-create.plugin');

var _findOrCreate2 = _interopRequireDefault(_findOrCreate);

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var composeSchemas = [];
var graphqlSchemas = [];
_fs2.default.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && !['find-or-create.plugin.js', 'index.js'].includes(file);
}).forEach(function (file) {
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  var schema = require('./' + file).default;
  var name = file.split('.')[0];
  schema.plugin(_findOrCreate2.default);
  var model = _mongoose2.default.model(name, schema);
  module.exports[name] = model;
  var modelTC = (0, _node.composeWithMongoose)(model);
  composeSchemas.push([name, modelTC, model]);
});

composeSchemas.forEach(function (composedSchema) {
  var _schemaComposer$rootQ, _schemaComposer$rootM;

  var _composedSchema = _slicedToArray(composedSchema, 3),
      name = _composedSchema[0],
      modelTC = _composedSchema[1],
      model = _composedSchema[2];

  var findOrCreateType = modelTC.getResolver('createOne').getArgs();
  var userModelTC = composeSchemas.filter(function (schema) {
    return schema[0] === 'User';
  })[0][1];
  var bookModelTC = composeSchemas.filter(function (schema) {
    return schema[0] === 'Book';
  })[0][1];
  var requestModelTC = composeSchemas.filter(function (schema) {
    return schema[0] === 'Request';
  })[0][1];

  var findManyResolver = function findManyResolver(theModelTC, resolver) {
    return theModelTC.getResolver(resolver).addFilterArg({
      name: 'search',
      type: 'String',
      description: 'Search ' + name + ' contents',
      query: function query(rawQuery, value, resolveParams) {
        return rawQuery['$or'] = ['title', 'desciption', 'displayName', 'city', 'address', 'state', 'zip', 'country'].map(function (field) {
          return _defineProperty({}, field, new RegExp(value.split(' ').join('|'), 'i'));
        });
      }
    }).wrapResolve(function (next) {
      return function (rp) {
        return next(rp);
      };
    });
  };

  modelTC.setResolver('findMany', findManyResolver(modelTC, 'findMany'));
  modelTC.setResolver('pagination', findManyResolver(modelTC, 'pagination'));

  if (name === 'User') {
    modelTC.addRelation('books', {
      resolver: bookModelTC.getResolver('findMany'),
      args: {
        filter: function filter(source) {
          return { creatorId: source._id };
        },
        limit: function limit(source, args) {
          return args.limit;
        }
      },
      projection: { _id: true }
    });

    modelTC.addRelation('requests', {
      resolver: requestModelTC.getResolver('findMany'),
      args: {
        filter: function filter(source) {
          return { creatorId: source._id };
        },
        limit: function limit(source, args) {
          return args.limit;
        }
      },
      projection: { _id: true }
    });
  }

  if (name === 'Book') {
    modelTC.addRelation('creator', {
      resolver: userModelTC.getResolver('findById'),
      prepareArgs: { _id: function _id(source) {
          return source.creatorId;
        } },
      projection: { creatorId: true }
    });

    modelTC.addRelation('requests', {
      resolver: requestModelTC.getResolver('findMany'),
      args: {
        filter: function filter(source) {
          return { bookId: source._id };
        },
        limit: function limit(source, args) {
          return args.limit;
        }
      },
      projection: { _id: true }
    });
  }

  if (name === 'Request') {
    modelTC.addRelation('bookDetails', {
      resolver: bookModelTC.getResolver('findById'),
      prepareArgs: { _id: function _id(source) {
          return source.bookId;
        } },
      projection: { bookId: true }
    });

    modelTC.addRelation('creatorDetails', {
      resolver: userModelTC.getResolver('findById'),
      prepareArgs: { _id: function _id(source) {
          return source.creatorId;
        } },
      projection: { creatorId: true }
    });
  }

  modelTC.addResolver({
    name: 'findOrCreateOne',
    kind: 'mutation',
    type: modelTC.getResolver('createOne').getType(),
    args: Object.assign({ query: { type: findOrCreateType.record.type } }, findOrCreateType),
    resolve: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref2) {
        var source = _ref2.source,
            args = _ref2.args,
            context = _ref2.context,
            info = _ref2.info;

        var _ref4, record;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return model.findOrCreate(args.query, args.record, { new: true });

              case 2:
                _ref4 = _context.sent;
                record = _ref4.doc;
                return _context.abrupt('return', { record: record, recordId: modelTC.getRecordIdFn()(record) });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resolve(_x) {
        return _ref3.apply(this, arguments);
      }

      return resolve;
    }()
  });
  modelTC.setResolver('connection', modelTC.getResolver('connection').addSortArg({
    name: 'DATE_ASC',
    value: { createdAt: 1 }
  }).addSortArg({
    name: 'DATE_DESC',
    value: { createdAt: -1 }
  }));

  modelTC.setResolver('pagination', modelTC.getResolver('pagination').addSortArg({
    name: 'DATE_ASC',
    value: { createdAt: 1 }
  }).addSortArg({
    name: 'DATE_DESC',
    value: { createdAt: -1 }
  }));

  _graphqlCompose.schemaComposer.rootQuery().addFields((_schemaComposer$rootQ = {}, _defineProperty(_schemaComposer$rootQ, name + 'FindOne', (0, _middlewares.modifyResolver)(modelTC.getResolver('findOne'), _middlewares.grantAccess)), _defineProperty(_schemaComposer$rootQ, name + 'FindById', (0, _middlewares.modifyResolver)(modelTC.getResolver('findById'), _middlewares.grantAccess)), _defineProperty(_schemaComposer$rootQ, name + 'FindByIds', (0, _middlewares.modifyResolver)(modelTC.getResolver('findByIds'), _middlewares.grantAccess)), _defineProperty(_schemaComposer$rootQ, name + 'FindMany', (0, _middlewares.modifyResolver)(modelTC.getResolver('findMany'), _middlewares.grantAccess)), _defineProperty(_schemaComposer$rootQ, name + 'Count', modelTC.getResolver('count')), _defineProperty(_schemaComposer$rootQ, name + 'Connection', modelTC.getResolver('connection')), _defineProperty(_schemaComposer$rootQ, name + 'Pagination', modelTC.getResolver('pagination')), _schemaComposer$rootQ));

  _graphqlCompose.schemaComposer.rootMutation().addFields((_schemaComposer$rootM = {}, _defineProperty(_schemaComposer$rootM, name + 'CreateOne', (0, _middlewares.modifyResolver)(modelTC.getResolver('createOne'), _middlewares.grantAccess)), _defineProperty(_schemaComposer$rootM, name + 'FindOrCreateOne', (0, _middlewares.modifyResolver)(modelTC.getResolver('findOrCreateOne'), _middlewares.grantAccess)), _defineProperty(_schemaComposer$rootM, name + 'UpdateById', (0, _middlewares.modifyResolver)(modelTC.getResolver('updateById'), _middlewares.grantAccess)), _defineProperty(_schemaComposer$rootM, name + 'RemoveById', (0, _middlewares.modifyResolver)(modelTC.getResolver('removeById'), _middlewares.grantAccess)), _schemaComposer$rootM));

  graphqlSchemas.push(_graphqlCompose.schemaComposer.buildSchema());
});

_dotenv2.default.config();
_mongoose2.default.Promise = Promise;
_mongoose2.default.connect(process.env.MONGODB_URI);

var database = exports.database = _mongoose2.default.connection;
module.exports.graphqlSchemas = graphqlSchemas;
var graphqlSchema = exports.graphqlSchema = (0, _graphqlTools.mergeSchemas)({
  schemas: graphqlSchemas
});