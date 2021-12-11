const Category = require('../models/Category')

exports.getCategories = async (req, res) => {
  try {
    const alertMessage = req.flash('alertMessage')
    const alertStatus = req.flash('alertStatus')

    let alert = { message: alertMessage, status: alertStatus }
    const categories = await Category.find()

    res.render('admin/category/view_category', {
      categories,
      alert,
      name: req.session.user.name,
      title: 'Category Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/category')
  }
}

exports.createCategoryView = async (req, res) => {
  try {
    res.render('admin/category/create', {
      name: req.session.user.name,
      title: 'Add Category Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/category')
  }
}

exports.createCategoryAction = async (req, res) => {
  try {
    const { name } = req.body

    await Category.create({
      name,
    })

    req.flash('alertMessage', 'Category added')
    req.flash('alertStatus', 'success')
    res.redirect('/category')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/category')
  }
}

exports.updateCategoryView = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findById(id)

    res.render('admin/category/edit', {
      category,
      name: req.session.user.name,
      title: 'Update Category Page',
    })
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/category')
  }
}

exports.updateCategoryAction = async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params

    await Category.findByIdAndUpdate(id, { name })

    req.flash('alertMessage', 'Category updated')
    req.flash('alertStatus', 'success')
    res.redirect('/category')
  } catch (error) {
    req.flash('alertMessage', `${error.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/category')
  }
}

exports.deleteCategoryAction = async (req, res) => {
  try {
    const { id } = req.params

    await Category.findByIdAndRemove(id)

    req.flash('alertMessage', 'Category removed')
    req.flash('alertStatus', 'success')
    res.redirect('/category')
  } catch (error) {
    req.flash('alertMessage', `${err.message}`)
    req.flash('alertStatus', 'danger')
    res.redirect('/category')
  }
}
