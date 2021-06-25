const db = require('../models')
const { Comment } = db

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId: RestaurantId } = req.body

    return Comment.create({
        text,
        RestaurantId,
        UserId: req.user.id
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
            console.log("comment: ", comment);
            res.redirect(`/restaurants/${comment.RestaurantId}`)
          })
      })
  }
  
}

module.exports = commentController