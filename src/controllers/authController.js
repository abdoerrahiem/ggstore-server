const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
const Player = require('../models/Player')

exports.register = async (req, res) => {
  try {
    const payload = req.body

    const alreadySignedUp = await Player.findOne({ email: payload.email })

    if (alreadySignedUp)
      return res.status(400).json({ message: 'User already exists' })

    const username = payload.email.split('@')[0]

    if (req.file) {
      let tmp_path = req.file.path
      let originaExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ]
      let filename = req.file.filename + '.' + originaExt
      let target_path = path.resolve(
        path.resolve(__dirname, '../..'),
        `public/uploads/${filename}`
      )

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)

      src.pipe(dest)

      src.on('end', async () => {
        try {
          const player = await Player.create({
            ...payload,
            avatar: filename,
            username,
          })

          delete player._doc.password

          const token = jwt.sign(
            {
              player: {
                id: player.id,
                username: player.username,
                email: player.email,
                nama: player.nama,
                phoneNumber: player.phoneNumber,
                avatar: player.avatar,
              },
            },
            process.env.JWT_SECRET
          )

          res.status(201).json({ data: { player, token } })
        } catch (err) {
          res
            .status(500)
            .json({ message: err.message || 'Internal server error' })
        }
      })
    } else {
      const player = await Player.create({ ...payload, username })

      delete player._doc.password

      const token = jwt.sign(
        {
          player: {
            id: player.id,
            username: player.username,
            email: player.email,
            nama: player.nama,
            phoneNumber: player.phoneNumber,
            avatar: player.avatar,
          },
        },
        process.env.JWT_SECRET
      )

      res.status(201).json({ data: { player, token } })
    }
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const player = await Player.findOne({ email })

    if (!player)
      return res.status(403).json({ message: 'Email is not registered' })

    const matchPassword = await bcrypt.compare(password, player.password)

    if (!matchPassword)
      return res.status(403).json({ message: `Email and password don't match` })

    const token = jwt.sign(
      {
        player: {
          id: player.id,
          username: player.username,
          email: player.email,
          nama: player.nama,
          phoneNumber: player.phoneNumber,
          avatar: player.avatar,
        },
      },
      process.env.JWT_SECRET
    )

    res.json({ data: { token } })
  } catch (err) {
    res.status(500).json({ message: err.message || 'Internal server error' })
  }
}
