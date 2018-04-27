import mongoose from 'mongoose'
import { isURL } from 'validator'

const Schema = mongoose.Schema

const lendSchema = new Schema({
  amount: {
    type: String,
    required: [true, 'lending amount required.'],
    validate: [{
      validator: value => typeof +value === 'number' && +value !== 0,
      message: 'amount greater than 0 required.'
    }]
  },
  currency: {
    type: String,
    required: [
      true,
      'currency symbol required.'
    ],
    validate: [{
      validator: value => value.length < 3 && value.length > 0,
      message: 'currency symbol required.'
    }]
  },
  info: {
    type: String,
    match: [
      /.{50,1000}/,
      'info must be between 50 - 1000 characters.'
    ]
  },
  duration: {
    type: Number,
    required: [true, 'duration must be in numbers of days((1-100)).'],
    validate: [{
      validator: value => value > 0 && value < 100,
      message: 'duration must be in numbers of days((1-100)).'
    }]
  },
  status: {
    type: String,
    required: [true, `status must be 'LENT', 'AVAILABLE', 'UNAVAILABLE'.`],
    enum: ['AVAILABLE', 'LENT', 'UNAVAILABLE'],
    default: 'UNAVAILABLE'
  },
  loanedTo: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })

lendSchema.index({ bookId: 1, creatorId: 1 }, { background: true })

const bookSchema = new Schema({
  title: { type: String,
    required: [true, 'title is required and must be greater than 5 characters..'],
    match: [
      /.{5,40}/,
      'title must be greater than 5 characters.'
    ]
  },
  description: {
    type: String,
    match: [
      /.{5,1000}/,
      'description length must be between  5 - 1000 characters.'
    ]},
  creatorId: { type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [
      true, 'creator id required.'
    ]
  },
  author: {
    type: String,
    required: [
      true, 'author name required.'
    ]
  },
  status: {
    type: String,
    required: [true, `status must be 'DRAFT', 'AVAILABLE'.`],
    enum: ['DRAFT', 'AVAILABLE'],
    default: 'DRAFT'
  },
  image: {
    type: String,
    required: [
      true, 'image url required.'
    ],
    validate: { validator: isURL }
  },
  lendingDetails: lendSchema
}, { timestamps: true })

bookSchema.index({ creatorId: 1, title: 1, description: 1 }, { background: true })

export default bookSchema
