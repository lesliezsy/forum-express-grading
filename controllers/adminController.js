const db = require('../models')
const { Restaurant } = db

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  postRestaurant: (req, res) => {
    // 餐廳名稱為必填，沒填的話會導回去新增餐廳的頁面
    if (!req.body.name) {
      req.flash('error_messages', "Name is required.")
      return res.redirect('back')
    }
    return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description
      })
      .then((restaurant) => {
        req.flash('success_messages', 'Restaurant was successfully created.')
        res.redirect('/admin/restaurants')
      })
  },
  // 瀏覽單一餐廳
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })
  },
  // 更新編輯的餐廳資料
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "Name is required.")
      return res.redirect('back')
    }

    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description
          })
          .then((restaurant) => {
            req.flash('success_messages', 'Restaurant was updated successfully.')
            res.redirect('/admin/restaurants')
          })
      })
  },


}

module.exports = adminController