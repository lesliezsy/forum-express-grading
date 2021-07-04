const db = require('../models')
const { Restaurant, Category, User } = db
const adminService = require('../services/adminService')

// const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

// controller 去呼叫 service 提供資料
// callback 執行時，把資料帶入data
const adminController = {
  getRestaurants: (req, res) => {
    // 撈出資料後，需用 { raw: true, nest: true } 轉換成 JS 原生物件
    adminService.getRestaurants(req, res, (data) => {
      // 函式執行時，controller 呼叫了 view 樣板，並且把 data 傳入 view 樣板
      return res.render('admin/restaurants', data)
    })
  },
  // 瀏覽單一餐廳
  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      console.log("餐廳： ", data);
      return res.render('admin/restaurant', data)
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', {
        categories
      })
    })
  },
  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },
  editRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        return res.render('admin/create', {
          categories,
          restaurant: restaurant.toJSON()
        })
      })
    })
  },
  // 更新編輯的餐廳資料
  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      res.redirect('/admin/restaurants')
    })
  },
  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data.status === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: (req, res) => {
    return User.findAll({ raw: true, nest: true })
      .then(users => {
        return res.render('admin/users', { users })
      })
  },
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        // 把User的 isAdmin value設為相反
        user.update({
          isAdmin: !user.isAdmin,
        }).then((user) => {
          req.flash('success_messages', "Changed successfully.")
          return res.redirect('/admin/users')
        })
      })
  },

}

module.exports = adminController