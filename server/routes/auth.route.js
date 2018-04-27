import express from 'express'
import jsonwebtoken from 'jsonwebtoken'
import passport from '../middlewares/passport.middleware'
import { generateJwt } from '../controllers/auth.controller'
const { JWT_SECRET } = process.env
const auth = express.Router()

auth.get('/facebook', passport.authenticate('facebook'))
  .get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: '/facebook/error'
  }), generateJwt)
  .get('/facebook/success', (req, res) => {
    try {
      const { token } = req.query
      const { id } = jsonwebtoken.verify(token, JWT_SECRET)

      return res.redirect(`/login?token=${token}&id=${id}`)
    } catch (error) {
      return res.redirect('/api/v1/auth/facebook/error')
    }
  })
  .get('/facebook/error*', (req, res) => res.status(401).json({
    status: 'fail',
    message: 'authentication failed'
  }))

export default auth
