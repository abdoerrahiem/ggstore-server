const Transaction = require('../models/Transaction')

exports.getTransactions = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')

    let alert = { message: alertMessage, status: alertStatus }

    const transaction = await Transaction.find().populate('player')

    res.render('admin/transaction/view_transaction', {
      transaction,
      alert,
      name: req.session.user.name,
      title: 'Payment Method Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/transaction')
  }
}

exports.updateStatusAction = async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.query

    await Transaction.findByIdAndUpdate(id, { status })

    req.flash('alertMessage', 'Transaction status updated')
    req.flash('alertStatus', 'success')

    res.redirect('/transaction')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/transaction')
  }
}
