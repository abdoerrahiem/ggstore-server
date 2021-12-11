const fs = require('fs')
const path = require('path')
const Voucher = require('../models/Voucher')
const Category = require('../models/Category')
const Nominal = require('../models/Nominal')

exports.getVouchers = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')

    let alert = { message: alertMessage, status: alertStatus }
    const voucher = await Voucher.find()
      .populate('category')
      .populate('nominals')

    res.render('admin/voucher/view_voucher', {
      voucher,
      alert,
      name: req.session.user.name,
      title: 'Voucher Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/voucher')
  }
}

exports.createVoucherView = async (req, res) => {
  try {
    const category = await Category.find()
    const nominal = await Nominal.find()

    res.render('admin/voucher/create', {
      name: req.session.user.name,
      title: 'Add Voucher Page',
      category,
      nominal,
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/voucher')
  }
}

exports.createVoucherAction = async (req, res) => {
  try {
    const { name, category, nominals } = req.body

    if (req.file) {
      let tmp_path = req.file.path
      let originalExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ]
      let filename = `${req.file.filename}.${originalExt}`
      let target_path = path.resolve(
        path.resolve(__dirname, '../..'),
        `public/uploads/${filename}`
      )

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)

      src.pipe(dest)

      src.on('end', async () => {
        try {
          await Voucher.create({
            name,
            category,
            nominals,
            thumbnail: filename,
          })

          req.flash('alertMessage', 'Voucher added')
          req.flash('alertStatus', 'success')
          res.redirect('/voucher')
        } catch (error) {
          req.flash('alertMessage', `${error.message}`)
          req.flash('alertStatus', 'danger')
          res.redirect('/voucher')
        }
      })
    } else {
      await Voucher.create({
        name,
        category,
        nominals,
      })

      req.flash('alertMessage', 'Voucher added')
      req.flash('alertStatus', 'success')
      res.redirect('/voucher')
    }
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/voucher')
  }
}

exports.updateVoucherView = async (req, res) => {
  try {
    const { id } = req.params
    const category = await Category.find()
    const nominal = await Nominal.find()
    const voucher = await Voucher.findById(id)

    res.render('admin/voucher/edit', {
      name: req.session.user.name,
      title: 'Update Voucher Page',
      voucher,
      nominal,
      category,
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/voucher')
  }
}

exports.updateVoucherAction = async (req, res) => {
  try {
    const { id } = req.params
    const { name, category, nominals } = req.body

    if (req.file) {
      let tmp_path = req.file.path
      let originalExt =
        req.file.originalname.split('.')[
          req.file.originalname.split('.').length - 1
        ]
      let filename = `${req.file.filename}.${originalExt}`
      let target_path = path.resolve(
        path.resolve(__dirname, '../..'),
        `public/uploads/${filename}`
      )

      const src = fs.createReadStream(tmp_path)
      const dest = fs.createWriteStream(target_path)

      src.pipe(dest)

      src.on('end', async () => {
        try {
          const voucher = await Voucher.findById(id)

          let currentImage = `${path.resolve(
            __dirname,
            '../..'
          )}/public/uploads/${voucher.thumbnail}`
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage)
          }

          await Voucher.findByIdAndUpdate(id, {
            name,
            category,
            nominals,
            thumbnail: filename,
          })

          req.flash('alertMessage', 'Voucher updated')
          req.flash('alertStatus', 'success')

          res.redirect('/voucher')
        } catch (err) {
          req.flash('alertMessage', `${err.message}`)
          req.flash('alertStatus', 'danger')
          res.redirect('/voucher')
        }
      })
    } else {
      await Voucher.findByIdAndUpdate(id, {
        name,
        category,
        nominals,
      })

      req.flash('alertMessage', 'Voucher updated')
      req.flash('alertStatus', 'success')

      res.redirect('/voucher')
    }
  } catch (err) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/voucher')
  }
}

exports.deleteVoucherAction = async (req, res) => {
  try {
    const { id } = req.params

    await Voucher.findByIdAndRemove(id)

    req.flash('alertMessage', 'Voucher removed')
    req.flash('alertStatus', 'success')
    res.redirect('/Voucher')
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/voucher')
  }
}

exports.updateStatusAction = async (req, res) => {
  try {
    const { id } = req.params
    let voucher = await Voucher.findById(id)

    let status = voucher.status === 'Y' ? 'N' : 'Y'

    voucher = await Voucher.findByIdAndUpdate(id, { status })

    req.flash('alertMessage', 'Voucher status updated')
    req.flash('alertStatus', 'success')

    res.redirect('/voucher')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/voucher')
  }
}
