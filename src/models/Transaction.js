const mongoose = require('mongoose')

let transactionSchema = mongoose.Schema(
  {
    historyVoucherTopup: {
      gameName: { type: String, require: [true, 'Game name is required'] },
      category: { type: String, require: [true, 'Category is required'] },
      thumbnail: { type: String },
      coinName: { type: String, require: [true, 'Coin name is required'] },
      coinQuantity: {
        type: String,
        require: [true, 'Coin quantity is required'],
      },
      price: { type: Number },
    },

    historyPayment: {
      name: { type: String, require: [true, 'Payment name is required'] },
      type: { type: String, require: [true, 'Payment type is required'] },
      bankName: { type: String, require: [true, 'Bank name is required'] },
      accNumber: {
        type: String,
        require: [true, 'Account number is required'],
      },
    },

    name: {
      type: String,
      require: [true, 'Name is required'],
      maxlength: [225, 'Name must be between 3 - 225 characters'],
      minlength: [3, 'Name must be between 3 - 225 characters'],
    },

    accountUser: {
      type: String,
      require: [true, 'Account user is required'],
      maxlength: [225, 'Account user must be between 3 - 225 characters'],
      minlength: [3, 'Account user must be between 3 - 225 characters'],
    },

    tax: {
      type: Number,
      default: 0,
    },

    value: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },

    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },

    historyUser: {
      name: { type: String, require: [true, 'Player name is required'] },
      phoneNumber: {
        type: Number,
        require: [true, 'Phone number is required'],
        maxlength: [13, 'Phone number must be between 9 - 13 characters'],
        minlength: [9, 'Phone number must be between 9 - 13 characters'],
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Transaction', transactionSchema)
