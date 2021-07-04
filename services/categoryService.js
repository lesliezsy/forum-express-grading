const db = require('../models')
const Category = db.Category

let categoryService = {
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
  postCategory: async (req, res, callback) => {
    const { name } = req.body
    if (!name) {
      callback({ status: 'error', message: 'Name is required.' })
    } else {
      const category = await Category.create({ name })
      callback({ status: 'success', message: `Category: ${name} was successfully created.` })
    }
  },
}
module.exports = categoryService