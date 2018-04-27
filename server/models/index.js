// This file dynamically imports and creates graphql schemas out of models. model file must be named singular
import dotenv from 'dotenv'
import fs from 'fs'
import mongoose from 'mongoose'
import { composeWithMongoose } from 'graphql-compose-mongoose/node8'
import { schemaComposer } from 'graphql-compose'
import { mergeSchemas } from 'graphql-tools'
import findOrCreate from './find-or-create.plugin'
import {
  modifyResolver,
  grantAccess
} from '../middlewares'

const composeSchemas = []
const graphqlSchemas = []
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && ![
    'find-or-create.plugin.js',
    'index.js'
  ].includes(file))
  .forEach((file) => {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const schema = require(`./${file}`).default
    const name = file.split('.')[0]
    schema.plugin(findOrCreate)
    const model = mongoose.model(name, schema)
    module.exports[name] = model
    const modelTC = composeWithMongoose(model)
    composeSchemas.push([name, modelTC, model])
  })

composeSchemas.forEach((composedSchema) => {
  const [name, modelTC, model] = composedSchema
  const findOrCreateType = modelTC.getResolver('createOne').getArgs()
  const userModelTC = composeSchemas.filter(schema => schema[0] === 'User')[0][1]
  const bookModelTC = composeSchemas.filter(schema => schema[0] === 'Book')[0][1]
  const requestModelTC = composeSchemas.filter(schema => schema[0] === 'Request')[0][1]

  const findManyResolver = (theModelTC, resolver) => theModelTC.getResolver(resolver).addFilterArg({
    name: 'search',
    type: 'String',
    description: `Search ${name} contents`,
    query: (rawQuery, value, resolveParams) => (rawQuery['$or'] = [
      'title', 'desciption', 'displayName', 'city', 'address', 'state', 'zip', 'country'
    ].map(field => ({
      [field]: new RegExp(value.split(' ').join('|'), 'i')
    })))
  }).wrapResolve(next => rp => next(rp))

  modelTC.setResolver('findMany', findManyResolver(modelTC, 'findMany'))
  modelTC.setResolver('pagination', findManyResolver(modelTC, 'pagination'))

  if (name === 'User') {
    modelTC.addRelation('books', {
      resolver: bookModelTC.getResolver('findMany'),
      args: {
        filter: source => ({ creatorId: source._id }),
        limit: (source, args) => args.limit
      },
      projection: { _id: true }
    })

    modelTC.addRelation('requests', {
      resolver: requestModelTC.getResolver('findMany'),
      args: {
        filter: source => ({ creatorId: source._id }),
        limit: (source, args) => args.limit
      },
      projection: { _id: true }
    })
  }

  if (name === 'Book') {
    modelTC.addRelation('creator', {
      resolver: userModelTC.getResolver('findById'),
      prepareArgs: { _id: source => source.creatorId },
      projection: { creatorId: true }
    })

    modelTC.addRelation('requests', {
      resolver: requestModelTC.getResolver('findMany'),
      args: {
        filter: source => ({ bookId: source._id }),
        limit: (source, args) => args.limit
      },
      projection: { _id: true }
    })
  }

  if (name === 'Request') {
    modelTC.addRelation('bookDetails', {
      resolver: bookModelTC.getResolver('findById'),
      prepareArgs: { _id: source => source.bookId },
      projection: { bookId: true }
    })

    modelTC.addRelation('creatorDetails', {
      resolver: userModelTC.getResolver('findById'),
      prepareArgs: { _id: source => source.creatorId },
      projection: { creatorId: true }
    })
  }

  modelTC.addResolver({
    name: 'findOrCreateOne',
    kind: 'mutation',
    type: modelTC.getResolver('createOne').getType(),
    args: { query: { type: findOrCreateType.record.type }, ...findOrCreateType },
    async resolve ({ source, args, context, info }) {
      const { doc: record } = await model.findOrCreate(args.query, args.record, { new: true })

      return { record, recordId: modelTC.getRecordIdFn()(record) }
    }
  })
  modelTC.setResolver('connection', modelTC.getResolver('connection')
    .addSortArg({
      name: 'DATE_ASC',
      value: { createdAt: 1 }
    })
    .addSortArg({
      name: 'DATE_DESC',
      value: { createdAt: -1 }
    })
  )

  modelTC.setResolver('pagination', modelTC.getResolver('pagination')
    .addSortArg({
      name: 'DATE_ASC',
      value: { createdAt: 1 }
    })
    .addSortArg({
      name: 'DATE_DESC',
      value: { createdAt: -1 }
    })
  )

  schemaComposer.rootQuery().addFields({
    [`${name}FindOne`]: modifyResolver(modelTC.getResolver('findOne'), grantAccess),
    [`${name}FindById`]: modifyResolver(modelTC.getResolver('findById'), grantAccess),
    [`${name}FindByIds`]: modifyResolver(modelTC.getResolver('findByIds'), grantAccess),
    [`${name}FindMany`]: modifyResolver(modelTC.getResolver('findMany'), grantAccess),
    [`${name}Count`]: modelTC.getResolver('count'),
    [`${name}Connection`]: modelTC.getResolver('connection'),
    [`${name}Pagination`]: modelTC.getResolver('pagination')
  })

  schemaComposer.rootMutation().addFields({
    [`${name}CreateOne`]: modifyResolver(modelTC.getResolver('createOne'), grantAccess),
    [`${name}FindOrCreateOne`]: modifyResolver(modelTC.getResolver('findOrCreateOne'), grantAccess),
    [`${name}UpdateById`]: modifyResolver(modelTC.getResolver('updateById'), grantAccess),
    [`${name}RemoveById`]: modifyResolver(modelTC.getResolver('removeById'), grantAccess)
  })

  graphqlSchemas.push(schemaComposer.buildSchema())
})

dotenv.config()
mongoose.Promise = Promise
mongoose.connect(process.env.MONGODB_URI)

export const database = mongoose.connection
module.exports.graphqlSchemas = graphqlSchemas
export const graphqlSchema = mergeSchemas({
  schemas: graphqlSchemas
})
