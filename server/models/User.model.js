import mongoose from 'mongoose'
import { isEmail, isURL, isPostalCode, isMobilePhone } from 'validator'

const Schema = mongoose.Schema
const addressSchema = new Schema({
  street: { type: String, index: true },
  city: { type: String, index: true },
  state: { type: String, index: true },
  zip: {
    type: Number,
    validate: [{
      validator: value => isPostalCode(value, this.country), message: 'zip code must be valid.'
    }] },
  country: { type: String, index: true }
})
const userSchema = new Schema({
  socialId: {
    type: String,
    required: true,
    unique: true,
    match: /\d+/
  },
  displayName: {
    type: String,
    required: [true, 'displayName is required'],
    match: /^([A-Za-z]+((\s[A-Za-z]+)+)?)$/,
    index: true
  },
  emails: [{ value: {
    type: String,
    required: true,
    unique: true,
    validate: [{ validator: value => isEmail(value), message: 'email is invalid.' }]
  } }],
  photos: [{ value: { type: String, validate: { validator: isURL } } }],
  address: addressSchema,
  phone: {
    type: String,
    validate: [{
      validator: value => isMobilePhone(value, this.address.country), message: 'phone is invalid.'
    }]
  },
  role: { type: String, enum: ['ADMIN', 'USER'], required: true, default: 'USER' }
})

export default userSchema
