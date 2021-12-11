const router = require('express').Router()
const { getDashboard } = require('../controllers/dashboardController')
const { admin } = require('../../middlewares')

router.use(admin)
router.get('/', getDashboard)

module.exports = router
