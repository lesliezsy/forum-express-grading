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
  }
}

module.exports = adminService