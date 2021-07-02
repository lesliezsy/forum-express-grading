const helpers = require('../_helpers')

const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Favorite, Followship, Restaurant, Comment, Like } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {

  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', 'Password and confirm password do not match.')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'This email already exists.')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'You have successfully registered! Please log in.')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Logged in successfully.')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Logged out successfully.')
    req.logout()
    res.redirect('/signin')
  },
  getUser: async (req, res) => {
    try {
      // 找到 user info 以及 他的評論 傳到前端。透過評論，利用 RestaurantId 去找到 Restaurant info
      const user = await User.findByPk(req.params.id, {
        include: [{
            model: Comment,
            include: [{
              model: Restaurant,
              attributes: ['id', 'name', 'image'],
            }],
            order: [
              ['createdAt', 'DESC']
            ], // 按照評論產生時間新到舊排序
          }, 
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' },
          { model: Restaurant, as: 'FavoritedRestaurants' }
        ],
      })
      return res.render('profile', {
        user: user.toJSON(),
        self: helpers.getUser(req).id
      })
    } catch (err) {
      console.log(err);
    }
  },
  editUser: (req, res) => {
    User.findOne({
        where: {
          id: helpers.getUser(req).id
        }
      })
      .then((user) => {
        return res.render('profileEdit', {
          user: user.toJSON(),
        })
      })
  },
  putUser: (req, res) => {
    const { file } = req
    // 若有上傳圖檔
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            // console.log("上傳圖，更新的user info: ", user);
            user.update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            }).then((user) => {
              req.flash('success_messages', "Your info was updated successfully.")
              res.redirect(`/users/${req.params.id}`)
            })
          })
      })
    } else { // 若不存在圖檔
      return User.findByPk(req.params.id)
        .then((user) => {
          // console.log("不上傳圖，更新的user info: ", user);
          user.update({
              name: req.body.name,
              image: user.image,
            })
            .then((user) => {
              req.flash('success_messages', 'Your info was updated successfully.')
              res.redirect(`/users/${req.params.id}`)
            })
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  getTopUser: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      const self = helpers.getUser(req).id
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: helpers.getUser(req).Followings.map(follower => follower.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users, self })
    })
  },
  addFollowing: (req, res) => {
    return Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      })
      .then((followship) => {
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },
  addLike: (req, res) => {
    return Like.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.findOne({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      .then((like) => {
        like.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },

}

module.exports = userController