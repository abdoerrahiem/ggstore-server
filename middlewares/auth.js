const jwt = require('jsonwebtoken')
const Player = require('../src/models/Player')

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.replace('Bearer ', '')
      : null

    const data = jwt.verify(token, config.jwtKey)

    const player = await Player.findOne({ _id: data.player.id })

    if (!player) {
      throw new Error()
    }

    req.player = player
    req.token = token
    next()
  } catch (err) {
    res.status(401).json({
      error: 'Not authorized to acces this resource',
    })
  }
}

module.exports = auth