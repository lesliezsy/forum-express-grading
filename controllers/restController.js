// 負責處理前台餐廳相關
const db = require('../models')
const { Restaurant, Category, Comment, User } = db

const pageLimit = 10 // 一頁有 10 筆資料

const restController = {
  // 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    let offset = 0 // 從哪開始取資料
    const whereQuery = {}
    let categoryId = ''

    // 若前端傳來 page 資訊
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    // 如果前端傳來 category id
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    Restaurant.findAndCountAll({
        raw: true,
        nest: true,
        include: Category,
        where: whereQuery,
        offset: offset,
        limit: pageLimit
      })
      .then(result => {
        // data for pagination

        // 第一次進入首頁時，沒帶任何參數，req.query.page 會回傳 undefined
        // 如果 || 左邊的運算結果是 false 或 undefined，就會拿到 || 右邊的值
        const page = Number(req.query.page) || 1
        const pages = Math.ceil(result.count / pageLimit) // 總共有幾頁
        const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
        const prev = page - 1 < 1 ? 1 : page - 1
        const next = page + 1 > pages ? pages : page + 1
        // result.rows 是所有餐廳資料
        const data = result.rows.map(restaurant => ({
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
            categoryId,
            page,
            totalPage,
            prev,
            next
          })
        })

      })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      // console.log(restaurant.Comments[0].dataValues)
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  },
  getFeeds: (req, res) => {
    // 兩個 promise 都執行完以後，才會進入 then，把資料回傳給前端
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      }),
      Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants,
        comments
      })
    })
  }
}
module.exports = restController