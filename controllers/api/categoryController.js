const adminService = require('../../services/adminService')

const categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => {
      return res.json(data)
    })
  },
}
module.exports = categoryController