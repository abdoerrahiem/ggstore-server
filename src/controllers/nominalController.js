const Nominal = require('../models/Nominal')

exports.getNominals = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')

    let alert = { message: alertMessage, status: alertStatus }
    const nominals = await Nominal.find()

    res.render('admin/nominal/view_nominal', {
      nominals,
      alert,
      name: req.session.user.name,
      title: 'Nominal Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/nominal')
  }
}

exports.createNominalView = async (req, res) => {
  try {
    res.render('admin/nominal/create', {
      name: req.session.user.name,
      title: 'Add Nominal Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/nominal')
  }
}

exports.createNominalAction = async (req, res) => {
  try {
    const { coinName, coinQuantity, price } = req.body

    await Nominal.create({
      coinName,
      coinQuantity,
      price,
    })

    req.flash('alertMessage', 'Nominal added')
    req.flash('alertStatus', 'success')
    res.redirect('/nominal')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/nominal')
  }
}

exports.updateNominalView = async (req, res) => {
  try {
    const { id } = req.params

    const nominal = await Nominal.findById(id)

    res.render('admin/nominal/edit', {
      nominal,
      name: req.session.user.name,
      title: 'Update Nominal Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/nominal')
  }
}

exports.updateNominalAction = async (req, res) => {
  try {
    const { coinName, coinQuantity, price } = req.body
    const { id } = req.params

    await Nominal.findByIdAndUpdate(id, { coinName, coinQuantity, price })

    req.flash('alertMessage', 'Nominal updated')
    req.flash('alertStatus', 'success')
    res.redirect('/nominal')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/nominal')
  }
}

exports.deleteNominalAction = async (req, res) => {
  try {
    const { id } = req.params

    await Nominal.findByIdAndRemove(id)

    req.flash('alertMessage', 'Nominal removed')
    req.flash('alertStatus', 'success')
    res.redirect('/nominal')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/nominal')
  }
}
