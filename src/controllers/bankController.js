const Bank = require('../models/Bank')

exports.getBanks = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')

    let alert = { message: alertMessage, status: alertStatus }
    const bank = await Bank.find()

    res.render('admin/bank/view_bank', {
      bank,
      alert,
      name: req.session.user.name,
      title: 'Bank Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/bank')
  }
}

exports.createBankView = async (req, res) => {
  try {
    res.render('admin/bank/create', {
      name: req.session.user.name,
      title: 'Add Bank Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/bank')
  }
}

exports.createBankAction = async (req, res) => {
  try {
    const { name, bankName, accNumber } = req.body

    await Bank.create({
      name,
      bankName,
      accNumber,
    })

    req.flash('alertMessage', 'Bank added')
    req.flash('alertStatus', 'success')
    res.redirect('/bank')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/bank')
  }
}

exports.updateBankView = async (req, res) => {
  try {
    const { id } = req.params

    const bank = await Bank.findById(id)

    res.render('admin/bank/edit', {
      bank,
      name: req.session.user.name,
      title: 'Update Bank Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/bank')
  }
}

exports.updateBankAction = async (req, res) => {
  try {
    const { name, bankName, accNumber } = req.body
    const { id } = req.params

    await Bank.findByIdAndUpdate(id, { name, bankName, accNumber })

    req.flash('alertMessage', 'Bank updated')
    req.flash('alertStatus', 'success')
    res.redirect('/bank')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/bank')
  }
}

exports.deleteBankAction = async (req, res) => {
  try {
    const { id } = req.params

    await Bank.findByIdAndRemove(id)

    req.flash('alertMessage', 'Bank removed')
    req.flash('alertStatus', 'success')
    res.redirect('/bank')
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/bank')
  }
}
