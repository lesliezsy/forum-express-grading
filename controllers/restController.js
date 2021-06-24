// 負責處理前台餐廳相關
const db = require('../models')
const { Restaurant, Category } = db

const restController = {
  // 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    Restaurant.findAll({ include: Category }).then(restaurants => {
      const data = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        description: restaurant.dataValues.description.substring(0, 50),
        categoryName: restaurant.Category.name
      }))
      // restaurant.Category.name 可以這樣用是因為在 restaurant model 裡有設關聯性
      return res.render('restaurants', {
        restaurants: data
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    }).then(restaurant => {
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  }
}
module.exports = restController