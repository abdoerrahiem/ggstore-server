const mongoose = require('mongoose')

const bankSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, 'Name is required'],
    },
    bankName: {
      type: String,
      require: [true, 'Bank name is required'],
    },
    accNumber: {
      type: String,
      require: [true, 'Account Number is required'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Bank', bankSchema)
