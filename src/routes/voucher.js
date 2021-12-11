const router = require('express').Router()
const {
  getVouchers,
  createVoucherView,
  createVoucherAction,
  updateVoucherView,
  updateVoucherAction,
  deleteVoucherAction,
  updateStatusAction,
} = require('../controllers/voucherController')
const multer = require('multer')
const os = require('os')
const { admin } = require('../../middlewares')

router.use(admin)

router.get('/', getVouchers)
router.get('/create', createVoucherView)
router.post(
  '/create',
  multer({ dest: os.tmpdir() }).single('image'),
  createVoucherAction
)
router.get('/edit/:id', updateVoucherView)
router.put(
  '/edit/:id',
  multer({ dest: os.tmpdir() }).single('image'),
  updateVoucherAction
)
router.delete('/delete/:id', deleteVoucherAction)
router.put('/status/:id', updateStatusAction)

module.exports = router
