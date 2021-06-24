const db = require('../models')
const { Restaurant, Category } = db
// const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminController = {
  getRestaurants: (req, res) => {
    // 撈出資料後，需用 { raw: true, nest: true } 轉換成 JS 原生物件
    return Restaurant.findAll({ raw: true, nest: true, include: [Category] })
      .then(restaurants => {
        return res.render('admin/restaurants', { restaurants })
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
    // 餐廳名稱為必填，沒填的話會導回去新增餐廳的頁面
    if (!req.body.name) {
      req.flash('error_messages', "Name is required.")
      return res.redirect('back')
    }
    const { file } = req // 從網頁傳來的req裡的 file（is a obj）專放圖片，body（is a obj）放文字內容
    // 若存在圖片類型檔案
    if (file) {
      // 將圖檔直接上傳至 imgur
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {

        // fs.readFile(file.path, (err, data) => {
        //   if (err) console.log('Error: ', err) // 上傳失誤 
        //   // 將圖檔正式寫入 upload 資料夾
        //   fs.writeFile(`upload/${file.originalname}`, data, () => {
        //     console.log("上傳的圖片： ", file);
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          // image: file ? `/upload/${file.originalname}` : null
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          req.flash('success_messages', 'Restaurant was successfully created.')
          return res.redirect('/admin/restaurants')
        })
        // })
      })
    } else { // 若不存在圖檔
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        req.flash('success_messages', 'Restaurant was successfully created.')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  // 瀏覽單一餐廳
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] })
      .then(restaurant => {
        // 只處理單筆資料時，用 .toJSON() 把 Sequelize 回傳的整包物件直接轉成 JSON 格式
        return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
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
    if (!req.body.name) {
      req.flash('error_messages', "Name is required.")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      // 將圖檔直接上傳至 imgur，成功後，http://img.data.link/ 會是剛剛上傳後拿到的圖片網址
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        // fs.readFile(file.path, (err, data) => {
        //   if (err) console.log('Error: ', err)
        //   fs.writeFile(`upload/${file.originalname}`, data, () => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              // image: file ? `/upload/${file.originalname}` : restaurant.image
              CategoryId: req.body.categoryId
            }).then((restaurant) => {
              req.flash('success_messages', 'Restaurant was updated successfully.')
              res.redirect('/admin/restaurants')
            })
          })
        // })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: restaurant.image,
              CategoryId: req.body.categoryId
            })
            .then((restaurant) => {
              req.flash('success_messages', 'Restaurant was updated successfully.')
              res.redirect('/admin/restaurants')
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then(() => { res.redirect('/admin/restaurants') })
      })
  }


}

module.exports = adminController