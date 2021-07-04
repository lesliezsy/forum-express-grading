// 把原本 adminController 的內容都抽取到 adminService.js 裡
const db = require('../models')
const { Restaurant, Category } = db

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
  createRestaurant: async (req, res, callback) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      callback({ categories })
    } catch (err) {
      console.log(err);
    }
  },
  deleteRestaurant: async (req, res, callback) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      restaurant.destroy()
      callback({ status: 'success', message: '' })
    } catch (err) {
      console.log(err);
    }
  },
  postRestaurant: async (req, res, callback) => {
    // 餐廳名稱為必填，沒填的話會導回去新增餐廳的頁面
    if (!req.body.name) return callback({ status: 'error', message: "Name is required." })

    try {
      const { file } = req // 從網頁傳來的req裡的 file（is a obj）專放圖片，body（is a obj）放文字內容
      // 若存在圖片類型檔案
      if (file) {
        // fs.readFile(file.path, (err, data) => {
        //   if (err) console.log('Error: ', err) // 上傳失誤 
        //   // 將圖檔正式寫入 upload 資料夾
        //   fs.writeFile(`upload/${file.originalname}`, data, () => {

        // 將圖檔直接上傳至 imgur
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : null,
            // image: file ? `/upload/${file.originalname}` : null
            CategoryId: req.body.categoryId
          })
          callback({ status: 'success', message: 'Restaurant was successfully created.' })
          // })
        })

      } else { // 若不存在圖檔
        const restaurant = await Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: req.body.categoryId
        })
        callback({ status: 'success', message: 'Restaurant was successfully created.' })
      }
    } catch (err) {
      console.log(err);
    }
  },
  putRestaurant: async (req, res, callback) => {
    if (!req.body.name) return callback({ status: 'error', message: "Name is required." })

    const { file } = req
    if (file) {
      // 將圖檔直接上傳至 imgur，成功後，http://img.data.link/ 會是剛剛上傳後拿到的圖片網址
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, async (err, img) => {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : restaurant.image,
          CategoryId: req.body.categoryId
        })
        callback({ status: 'success', message: 'Restaurant was updated successfully.' })
      })
    } else {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.update({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: restaurant.image,
        CategoryId: req.body.categoryId
      })
      callback({ status: 'success', message: 'Restaurant was updated successfully.' })
    }
  },
}

module.exports = adminService