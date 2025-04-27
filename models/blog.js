const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      content: String,
    },
  ],
})

blogSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString()
    if (ret.comments) {
      ret.comments.forEach((c) => {
        c.id = c._id.toString()
        delete c._id
      })
    }
    delete ret._id
    delete ret.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
