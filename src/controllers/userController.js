const bcrypt = require('bcryptjs')
const User = require('../models/User')

exports.signinView = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')

    const alert = { message: alertMessage, status: alertStatus }

    if (!req.session.user)
      return res.render('admin/users/view_signin', {
        alert,
        title: 'Login Page',
      })

    res.redirect('/dashboard')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/')
  }
}

exports.signinAction = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      req.flash('alertMessage', 'Account not found')
      req.flash('alertStatus', 'danger')
      res.redirect('/')
      return
    }

    if (user.status !== 'Y') {
      req.flash('alertMessage', 'Your account is not active')
      req.flash('alertStatus', 'danger')
      res.redirect('/')
      return
    }

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
      req.flash('alertMessage', 'Your password not matched with the email')
      req.flash('alertStatus', 'danger')
      res.redirect('/')
      return
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      status: user.status,
      name: user.name,
    }
    res.redirect('/dashboard')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/')
  }
}

exports.logoutAction = async (req, res) => {
  req.session.destroy()
  res.redirect('/')
}
