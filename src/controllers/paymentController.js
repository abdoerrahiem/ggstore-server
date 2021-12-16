const Payment = require('../models/Payment')
const Bank = require('../models/Bank')

exports.getPayments = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')

    let alert = { message: alertMessage, status: alertStatus }
    const payment = await Payment.find().populate('banks')

    res.render('admin/payment/view_payment', {
      payment,
      alert,
      name: req.session.user.name,
      title: 'Payment Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/payment')
  }
}

exports.createPaymentView = async (req, res) => {
  try {
    const banks = await Bank.find()

    res.render('admin/payment/create', {
      name: req.session.user.name,
      title: 'Add Payment Page',
      banks,
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/payment')
  }
}

exports.createPaymentAction = async (req, res) => {
  try {
    const { banks, type } = req.body

    await Payment.create({
      banks,
      type,
    })

    req.flash('alertMessage', 'Payment added')
    req.flash('alertStatus', 'success')
    res.redirect('/payment')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/payment')
  }
}

exports.updatePaymentView = async (req, res) => {
  try {
    const { id } = req.params

    const payment = await Payment.findById(id)
    const banks = await Bank.find()

    res.render('admin/payment/edit', {
      name: req.session.user.name,
      title: 'Update Payment Page',
      payment,
      banks,
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/payment')
  }
}

exports.updatePaymentAction = async (req, res) => {
  try {
    const { id } = req.params
    const { banks, type } = req.body

    await Payment.findByIdAndUpdate(id, {
      banks,
      type,
    })

    req.flash('alertMessage', 'Payment updated')
    req.flash('alertStatus', 'success')
    res.redirect('/payment')
  } catch (err) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/payment')
  }
}

exports.deletePaymentAction = async (req, res) => {
  try {
    const { id } = req.params

    await Payment.findByIdAndRemove(id)

    req.flash('alertMessage', 'Payment removed')
    req.flash('alertStatus', 'success')
    res.redirect('/payment')
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/payment')
  }
}

exports.updateStatusAction = async (req, res) => {
  try {
    const { id } = req.params
    let payment = await Payment.findById(id)

    let status = payment.status === 'Y' ? 'N' : 'Y'

    payment = await Payment.findByIdAndUpdate(id, { status })

    req.flash('alertMessage', 'Payment status updated')
    req.flash('alertStatus', 'success')

    res.redirect('/payment')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/payment')
  }
}
