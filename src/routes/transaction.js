const router = require('express').Router()
const {
  getTransactions,
  updateStatusAction,
} = require('../controllers/transactionController')
const { admin } = require('../../middlewares')

router.use(admin)

router.get('/', getTransactions)
router.put('/status/:id', updateStatusAction)

module.exports = router
