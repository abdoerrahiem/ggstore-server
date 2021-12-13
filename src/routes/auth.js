const multer = require('multer')
const os = require('os')
const router = require('express').Router()
const { register, login } = require('../controllers/authController')

router.post(
  '/register',
  multer({ dest: os.tmpdir() }).single('image'),
  register
)
router.post('/login', login)

module.exports = router
