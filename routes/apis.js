const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const categoryController = require('../controllers/api/categoryController.js')
const userController = require('../controllers/api/userController.js')

// passport.authenticate() 是 passport-jwt 提供的方法，封裝成 authenticated，作為 middleware 加入路由
const authenticated = passport.authenticate('jwt', { session: false })
// authenticatedAdmin 檢查使用者是否為管理員
const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// JWT signin
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.post('/admin/restaurants', upload.single('image'), authenticated, authenticatedAdmin, adminController.postRestaurant)
// router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
// router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)
// router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)
// router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)

module.exports = router