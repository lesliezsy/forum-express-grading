const db = require('../models')
const { Comment } = db
const helpers = require('../_helpers')

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId: RestaurantId } = req.body

    return Comment.create({
        text,
        RestaurantId,
        UserId: helpers.getUser(req).id
      })
      .then((comment) => {
        res.redirect(`/restaurants/${RestaurantId}`)
      })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id)
      .then((comment) => {
        comment.destroy()
          .then((comment) => {
            res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  }
  
}

module.exports = commentController