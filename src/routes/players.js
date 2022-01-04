const router = require('express').Router()
const { getPlayers } = require('../controllers/playersController')
const { admin } = require('../../middlewares')

router.use(admin)

router.get('/', getPlayers)

module.exports = router
