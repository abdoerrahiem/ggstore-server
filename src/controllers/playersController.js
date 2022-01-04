const Player = require('../models/Player')

exports.getPlayers = async (req, res) => {
  try {
    const players = await Player.find()

    res.render('admin/player/view_player', {
      players,
      name: req.session.user.name,
      title: 'Player Page',
    })
  } catch (err) {
    res.redirect('/players')
  }
}
