import jsonwebtoken from 'jsonwebtoken'
import mongoose from 'mongoose'
import { database } from '../models'

const { JWT_SECRET } = process.env

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
export function generateJwt (req, res) {
  try {
    const { id } = req.user
    const token = jsonwebtoken.sign({ id }, JWT_SECRET, { expiresIn: '1h' })

    return res.redirect(`/api/v1/auth/facebook/success?token=${token}`)
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
export function getUser (req, res, next) {
  try {
    req.decoded = jsonwebtoken.verify(req.headers.authorization, JWT_SECRET)

    return next()
  } catch (error) {
    const { message } = error
    const statusCode = message === 'jwt expired' ? 401 : 500
    const status = message === 'jwt expired' ? 'fail' : 'error'

    if (req.headers.authorization) {
      return res.status(statusCode).json({ status, message })
    }

    req.decoded = { id: null }

    return next()
  }
}

export default getUser
