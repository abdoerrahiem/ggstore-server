const router = require('express').Router()
const {
  getCategories,
  createCategoryView,
  createCategoryAction,
  updateCategoryView,
  updateCategoryAction,
  deleteCategoryAction,
} = require('../controllers/categoryController')
const { admin } = require('../../middlewares')

router.use(admin)

router.get('/', getCategories)
router.get('/create', createCategoryView)
router.post('/create', createCategoryAction)
router.get('/edit/:id', updateCategoryView)
router.put('/edit/:id', updateCategoryAction)
router.delete('/delete/:id', deleteCategoryAction)

module.exports = router
