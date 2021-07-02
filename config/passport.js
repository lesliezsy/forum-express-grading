const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const { User, Restaurant } = db

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user, cb = done
  (req, username, password, cb) => {
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', 'This email is not registered.'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', 'Email or password incorrect.'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: Restaurant, as: 'FavoritedRestaurants' }, // 取出這位 User最愛餐廳資料
      // 透過 Favorite, 查找 Restaurant 裡這位 User id liked 的餐廳資料
      { model: Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },  // 取出 user 正被誰 follow 的名單
      { model: User, as: 'Followings' } // 取出 user 正在 follow 誰的名單
    ]
  }).then(user => {
    user = user.toJSON() // 此處與影片示範不同
    return cb(null, user)
  })
})

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const { ExtractJwt, Strategy:JwtStrategy } = passportJWT

let jwtOptions = {}
// 設定到哪找 token：指定 authorization header 裡的 bearer 項目
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
// 使用密鑰檢查 token 是否經過纂改
jwtOptions.secretOrKey = process.env.JWT_SECRET

let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: db.Restaurant, as: 'FavoritedRestaurants' },
      { model: db.Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
})
passport.use(strategy)

module.exports = passport