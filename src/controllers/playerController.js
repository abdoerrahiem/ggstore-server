const path = require('path')
const fs = require('fs')
const Voucher = require('../models/Voucher')
const Category = require('../models/Category')
const Bank = require('../models/Bank')
const Payment = require('../models/Payment')
const Nominal = require('../models/Nominal')
const Transaction = require('../models/Transaction')
const Player = require('../models/Player')

exports.getLandingPage = async (req, res) => {
  try {
    const vouchers = await Voucher.find().select(
      '_id name status category thumbnail'
    )

    res.json({ data: vouchers })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.getDetailPage = async (req, res) => {
  try {
    const { id } = req.params

    const voucher = await Voucher.findById(id)
      .populate('category')
      .populate('nominals')
      .populate('user', '_id name phoneNumber')

    if (!voucher)
      return res.status(404).json({ message: 'Game voucher not found' })

    res.json({ data: voucher })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find()

    res.json({ data: categories })
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal server error' })
  }
}

exports.checkout = async (req, res) => {
  try {
    const { nominal, voucher, payment, bank } = req.body

    const res_voucher = await Voucher.findById(voucher)
      .select('name category _id thumbnail user')
      .populate('category')
      .populate('user')

    if (!res_voucher)
      return res.status(404).json({ message: 'Game voucher not found' })

    const res_nominal = await Nominal.findById(nominal)

    if (!res_nominal)
      return res.status(404).json({ message: 'Nominal not found' })

    const res_payment = await Payment.findById(payment)

    if (!res_payment)
      return res.status(404).json({ message: 'Payment not found' })

    const res_bank = await Bank.findById(bank)

    if (!res_bank) return res.status(404).json({ message: 'Bank not found' })

    let tax = (10 / 100) * res_nominal._doc.price
    let value = res_nominal._doc.price - tax

    const payload = {
      historyVoucherTopup: {
        gameName: res_voucher._doc.name,
        category: res_voucher._doc.category
          ? res_voucher._doc.category.name
          : '',
        thumbnail: res_voucher._doc.thumbnail,
        coinName: res_nominal._doc.coinName,
        coinQuantity: res_nominal._doc.coinQuantity,
        price: res_nominal._doc.price,
      },
      historyPayment: {
        name: res_bank._doc.name,
        type: res_payment._doc.type,
        bankName: res_bank._doc.bankName,
        accNumber: res_bank._doc.accNumber,
      },

      name: req.player.name,
      tax,
      value,
      player: req.player._id,
      historyUser: {
        name: res_voucher._doc.user?.name,
        phoneNumber: res_voucher._doc.user?.phoneNumber,
      },

      category: res_voucher._doc.category?._id,
      user: res_voucher._doc.user?._id,
    }

    const transaction = await Transaction.create(payload)

    res.status(201).json({
      data: transaction,
    })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.getHistories = async (req, res) => {
  try {
    const { status = '' } = req.query

    let criteria = {}

    if (status.length) {
      criteria = {
        ...criteria,
        status: { $regex: `${status}`, $options: 'i' },
      }
    }

    if (req.player._id) {
      criteria = {
        ...criteria,
        player: req.player._id,
      }
    }

    const history = await Transaction.find(criteria)

    let total = await Transaction.aggregate([
      { $match: criteria },
      {
        $group: {
          _id: null,
          value: { $sum: '$value' },
        },
      },
    ])

    res.json({
      data: history,
      total: total.length ? total[0].value : 0,
    })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.getHistoryDetails = async (req, res) => {
  try {
    const { id } = req.params

    const history = await Transaction.findById(id)

    if (!history) return res.status(404).json({ message: 'History not found' })

    res.json({ data: history })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.getDashboard = async (req, res) => {
  try {
    const count = await Transaction.aggregate([
      { $match: { player: req.player._id } },
      {
        $group: {
          _id: '$category',
          value: { $sum: '$value' },
        },
      },
    ])

    const categories = await Category.find()

    categories.forEach((element) => {
      count.forEach((data) => {
        if (data._id.toString() === element._id.toString()) {
          data.name = element.name
        }
      })
    })

    const histories = await Transaction.find({ player: req.player._id })
      .populate('category')
      .sort({ updatedAt: -1 })

    res.json({ data: histories, count })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.getProfile = async (req, res) => {
  try {
    const player = {
      id: req.player._id,
      username: req.player.username,
      email: req.player.email,
      name: req.player.name,
      avatar: req.player.avatar,
      phoneNumber: req.player.phoneNumber,
    }

    res.json({ data: player })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.updateProfile = async (req, res, next) => {
  try {
    const { name = '', phoneNumber = '' } = req.body

    const payload = {}

    if (name.length) payload.name = name
    if (phoneNumber.length) payload.phoneNumber = phoneNumber

    if (req.file) {
      let tmp_path = req.file.path
      let originaExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ]
      let filename = req.file.filename + '.' + originaExt
      let target_path = path.resolve(
        path.resolve(__dirname, '../..'),
        `public/uploads/${filename}`
      )

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)

      src.pipe(dest)

      src.on('end', async () => {
        let player = await Player.findOne({ _id: req.player._id })

        let currentImage = `${path.resolve(
          __dirname,
          '../..'
        )}/public/uploads/${player.avatar}`
        if (fs.existsSync(currentImage)) {
          fs.unlinkSync(currentImage)
        }

        player = await Player.findOneAndUpdate(
          {
            _id: req.player._id,
          },
          {
            ...payload,
            avatar: filename,
          },
          { new: true, runValidators: true }
        )

        res.status(201).json({
          data: {
            id: player.id,
            name: player.name,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        })
      })

      src.on('err', async () => {
        next(err)
      })
    } else {
      const player = await Player.findByIdAndUpdate(req.player._id, payload, {
        new: true,
        runValidators: true,
      })

      res.status(201).json({
        data: {
          id: player.id,
          name: player.name,
          phoneNumber: player.phoneNumber,
          avatar: player.avatar,
        },
      })
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      res.status(422).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      })
    } else {
      res.status(500).json({ message: err.message || 'Internal server error' })
    }
  }
}

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate('banks')

    res.json({ data: payments })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}
