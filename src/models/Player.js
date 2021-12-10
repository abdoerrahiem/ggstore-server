const mongoose = require('mongoose')

const bcrypt = require('bcryptjs')

const HASH_ROUND = 10

let playerSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, 'Email is required'],
    },
    name: {
      type: String,
      require: [true, 'Name is required'],
      maxlength: [225, 'Name must be between 3 - 225 characters'],
      minlength: [3, 'pName must be between 3 - 225 characters'],
    },
    username: {
      type: String,
      require: [true, 'username is required'],
      maxlength: [225, 'Username must be between 3 - 225 characters'],
      minlength: [3, 'Username must be between 3 - 225 characters'],
    },
    password: {
      type: String,
      require: [true, 'Password is required'],
      maxlength: [225, 'Max password is 225 characters'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['Y', 'N'],
      default: 'Y',
    },
    avatar: { type: String },
    fileName: { type: String },
    phoneNumber: {
      type: String,
      require: [true, 'Phone number is required'],
      maxlength: [13, 'Phone number must be between 9 - 13 characters'],
      minlength: [9, 'Phone number must be between 9 - 13 characters'],
    },

    favorite: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
)

playerSchema.path('email').validate(
  async function (value) {
    try {
      const count = await this.model('Player').countDocuments({ email: value })
      return !count
    } catch (err) {
      throw err
    }
  },
  (attr) => `${attr.value} sudah terdaftar`
)

playerSchema.pre('save', function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND)
  next()
})

module.exports = mongoose.model('Player', playerSchema)
