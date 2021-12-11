const Transaction = require('../models/Transaction')
const Voucher = require('../models/Voucher')
const Player = require('../models/Player')
const Category = require('../models/Category')

exports.getDashboard = async (req, res) => {
  try {
    const transaction = await Transaction.countDocuments()
    const voucher = await Voucher.countDocuments()
    const player = await Player.countDocuments()
    const category = await Category.countDocuments()
    res.render('admin/dashboard/view_dashboard', {
      name: req.session.user.name,
      title: 'Halaman Dashboard',
      count: {
        transaction,
        player,
        voucher,
        category,
      },
    })
  } catch (err) {
    console.log(err)
  }
}
