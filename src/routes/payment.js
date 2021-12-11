const router = require('express').Router()
const {
  getPayments,
  createPaymentView,
  createPaymentAction,
  updatePaymentView,
  updatePaymentAction,
  deletePaymentAction,
  updateStatusAction,
} = require('../controllers/paymentController')
const { admin } = require('../../middlewares')

router.use(admin)

router.get('/', getPayments)
router.get('/create', createPaymentView)
router.post('/create', createPaymentAction)
router.get('/edit/:id', updatePaymentView)
router.put('/edit/:id', updatePaymentAction)
router.delete('/delete/:id', deletePaymentAction)
router.put('/status/:id', updateStatusAction)

module.exports = router
