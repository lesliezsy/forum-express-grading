// 把原本 adminController 的內容都抽取到 adminService.js 裡
const db = require('../models')
const { Restaurant, Category } = db

// service 取資料、整理資料
// 預備好資料後，執行 callback，把資料傳入 controller 函式中的 data
const adminService = {
  getRestaurants: async (req, res, callback) => {
    try {
      const restaurants = await Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      callback({ restaurants })
    } catch (err) {
      console.log(err);
    }
  },
  getRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category] })
      // 只處理單筆資料時，用 .toJSON() 把 Sequelize 回傳的整包物件直接轉成 JSON 格式
      callback({ restaurant })
    } catch (err) {
      console.log(err);
    }
  },
  getCategories: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        callback({ categories, category })
      } else {
        callback({ categories })
      }

    } catch (err) {
      console.log(err);
    }
  },
}

module.exports = adminService