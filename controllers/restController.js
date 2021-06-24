// 負責處理前台餐廳相關
const db = require('../models')
const { Restaurant, Category } = db

const restController = {
  // 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    // 如果前端傳來 category id
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAll(({ raw: true, nest: true, include: Category, where: whereQuery }))
      .then(restaurants => {
        const data = restaurants.map(restaurant => ({
          ...restaurant,
          description: restaurant.description.substring(0, 50),
          categoryName: restaurant.Category.name
        }))
        // restaurant.Category.name 可以這樣用是因為在 restaurant model 裡有設關聯性
        Category.findAll({
          raw: true,
          nest: true
        }).then(categories => { // 取出 categoies 
          return res.render('restaurants', {
            restaurants: data,
            categories,
            categoryId
          })
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