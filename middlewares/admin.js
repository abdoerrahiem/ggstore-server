const admin = (req, res, next) => {
  if (!req.session.user) {
    req.flash('alertMessage', 'Your session has ended. Please login first!')
    req.flash('alertStatus', 'danger')
    res.redirect('/')
  } else {
    next()
  }
}

module.exports = admin
