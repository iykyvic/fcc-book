import { GraphQLError } from 'graphql'
import mongoose from 'mongoose'
import { database, User, Book } from '../models'

export function modifyResolver (resolver, callback) {
  return {
    ...resolver,
    async resolve (...resolveParams) {
      const [ source, args, context, info ] = resolveParams
      if (callback && typeof callback === 'function') {
        return callback(args, info.fieldName, resolver.resolve
          .bind(null, { source, args, context, info }), context)
      }

      const result = await resolver.resolve({ source, args, context, info })

      return result
    }
  }
}

export function getSchema (schemas, schemaName) {
  return schemas.filter(schema => schema[0] === schemaName)
}

export async function grantAccess (...args) {
  const [arg, name, resolver, context] = args
  const model = mongoose.model(Object.keys(database.models)
    .filter(modelName => name.includes(modelName))[0])
  const isFind = name.includes('Find') && !name.includes('Create')
  const isUpdate = name.includes('Update') || name.includes('Remove')
  let result = isFind ? await resolver() : null
  let hasAccess = true
  if (isFind && result) {
    if (model.modelName === 'User') {
      if (Array.isArray(result)) {
        const currentUser = await User.findById(context.decoded.id)
        hasAccess = currentUser.role === 'ADMIN'
      } else {
        const { id, role } = result
        const isAdmin = role === 'ADMIN'
        hasAccess = context.decoded.id === id || isAdmin
      }
    }
  } else if (isUpdate) {
    if (!context.decoded.id) {
      return new GraphQLError('you  need a user account for this')
    }
    const { id, role } = await User.findById(context.decoded.id)
    const isAdmin = role === 'ADMIN'
    const _id = arg.record ? arg.record._id : arg._id
    const record = await model.findById(_id)
    hasAccess = isAdmin || (model.modelName === 'User'
      ? id === record.id : new RegExp(record.creatorId).test(id))
    if (hasAccess) {
      if (!isAdmin && model.modelName === 'User' && arg.record) {
        if (arg.record.role) {
          return new GraphQLError('illegal change of role attempted')
        } else if (arg.record.socialId) {
          return new GraphQLError('illegal change of login credentials attempted')
        }
      } else if (isAdmin && model.modelName === 'User' && id === record.id) {
        if (arg.record.role) {
          return new GraphQLError('you  need another admin account to do change role')
        } else if (arg.record.socialId) {
          return new GraphQLError('you  need another admin account to do change socialId')
        }
      }

      if (
        model.modelName === 'Book' &&
        arg.record.lendingDetails &&
        arg.record.lendingDetails.status
      ) {
        const oldBook = await Book.findById(arg.record._id)

        const { status } = oldBook

        if (status === 'DRAFT' && arg.record.lendingDetails.status !== 'UNAVAILABLE') {
          return new GraphQLError('status of book should be available before lending.')
        }
      }

      result = await resolver(null, arg)
    }
  } else {
    if (model.modelName === 'User') {
      return new GraphQLError('new user creation not allowed')
    } else {
      if (!context.decoded.id) {
        return new GraphQLError('you  need a user account for this')
      }

      result = await resolver(null, arg)
    }
  }

  return hasAccess ? result : new GraphQLError('illegal access')
}
