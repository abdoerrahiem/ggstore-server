const router = require('express').Router()
const {
  getBanks,
  createBankView,
  createBankAction,
  updateBankView,
  updateBankAction,
  deleteBankAction,
} = require('../controllers/bankController')
const { admin } = require('../../middlewares')

router.use(admin)

router.get('/', getBanks)
router.get('/create', createBankView)
router.post('/create', createBankAction)
router.get('/edit/:id', updateBankView)
router.put('/edit/:id', updateBankAction)
router.delete('/delete/:id', deleteBankAction)

module.exports = router
