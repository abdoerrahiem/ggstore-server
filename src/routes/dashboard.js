const router = require('express').Router()
const { getDashboard } = require('../controllers/dashboardController')

router.use('/', getDashboard)

module.exports = router
