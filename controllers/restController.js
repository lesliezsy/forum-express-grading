// 負責處理前台餐廳相關的 request const restController = {
const restController = {
  // 瀏覽餐廳頁面
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController