const db = require('../models')
const { Comment } = db

const commentController = {
  postComment: (req, res) => {
    const { text, restaurantId:RestaurantId } = req.body

    return Comment.create({
        text,
        RestaurantId,
        UserId: req.user.id
      })
      .then((comment) => {
        res.redirect(`/restaurants/${RestaurantId}`)
      })
  }
}

module.exports = commentController