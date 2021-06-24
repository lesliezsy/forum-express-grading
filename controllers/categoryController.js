const db = require('../models')
const { Category } = db
let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', { categories: categories })
    })
  },
  postCategory: (req, res) => {
    const { name } = req.body
    if (!name) {
      req.flash('error_messages', 'Name is required.')
      return res.redirect('back')
    } else {
      return Category.create({
          name
        })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  }
}
module.exports = categoryController