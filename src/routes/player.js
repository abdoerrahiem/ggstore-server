const router = require('express').Router()
const multer = require('multer')
const os = require('os')

const {
  updateProfile,
  getProfile,
  getDashboard,
  getLandingPage,
  getDetailPage,
  getCategories,
  checkout,
  getHistories,
  getHistoryDetails,
} = require('../controllers/playerController')
const { auth } = require('../../middlewares')

router.get('/landingpage', getLandingPage)
router.get('/:id/detail', getDetailPage)
router.get('/category', getCategories)
router.post('/checkout', auth, checkout)
router.get('/history', auth, getHistories)
router.get('/history/:id/detail', auth, getHistoryDetails)
router.get('/dashboard', auth, getDashboard)
router.get('/profile', auth, getProfile)
router.put(
  '/profile',
  auth,
  multer({ dest: os.tmpdir() }).single('image'),
  updateProfile
)

module.exports = router
