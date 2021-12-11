const express = require('express')
const router = express.Router()

const {
  signinView,
  signinAction,
  logoutAction,
} = require('../controllers/userController')

router.get('/', signinView)
router.post('/', signinAction)
router.get('/logout', logoutAction)

module.exports = router
