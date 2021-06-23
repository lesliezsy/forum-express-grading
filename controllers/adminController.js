const db = require('../models')
const { Restaurant } = db
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '5d1a0b467982077'

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
          image: file ? img.data.link : null
          // image: file ? `/upload/${file.originalname}` : null
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
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'Restaurant was successfully created.')
        return res.redirect('/admin/restaurants')
      })
    }
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
              description: req.body.description
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