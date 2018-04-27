import mongoose from 'mongoose'

const Schema = mongoose.Schema

const requestSchema = new Schema({
  bookId: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: [
      true, 'book id required'
    ]
  },
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [
      true, 'creator required'
    ]
  }
}, { timestamps: true })

requestSchema.index({ bookId: 1, creatorId: 1 }, { background: true })

requestSchema.pre('remove', async function () {
  const book = await this.model('Book').findOne({
    _id: this.bookId,
    'lendingDetails.loanedTo': this.creatorId
  })
  if (book) {
    await book.update({
      'lendingDetails.status': 'AVAILABLE',
      'lendingDetails.loanedTo': null
    })
  }
})

export default requestSchema
