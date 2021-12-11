const router = require('express').Router()
const {
  getNominals,
  createNominalView,
  createNominalAction,
  updateNominalView,
  updateNominalAction,
  deleteNominalAction,
} = require('../controllers/nominalController')
const { admin } = require('../../middlewares')

router.use(admin)

router.get('/', getNominals)
router.get('/create', createNominalView)
router.post('/create', createNominalAction)
router.get('/edit/:id', updateNominalView)
router.put('/edit/:id', updateNominalAction)
router.delete('/delete/:id', deleteNominalAction)

module.exports = router
