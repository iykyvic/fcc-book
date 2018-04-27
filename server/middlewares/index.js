import devMiddleware from './dev.middleware'
import socket from './socket.middleware'
import passport from './passport.middleware'
import {
  authFields,
  getSchema,
  modifyResolver,
  grantAccess
} from './graphql.middleware'

export function catchBlock (devMode, callback, errorCb) {
  try {
    return callback()
  } catch (error) {
    if (devMode) {
      throw error
    }

    if (errorCb) {
      errorCb()
    }
    throw new Error(error.message)
  }
}

module.exports.passport = passport
module.exports.socket = socket
module.exports.devMiddleware = devMiddleware
module.exports.authFields = authFields
module.exports.modifyResolver = modifyResolver
module.exports.grantAccess = grantAccess
module.exports.getSchema = getSchema
