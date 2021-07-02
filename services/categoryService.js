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
}
module.exports = categoryService