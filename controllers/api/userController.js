const bcrypt = require('bcryptjs')
const db = require('../../models')
const { User } = db

// JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const { ExtractJwt, Strategy:JwtStrategy } = passportJWT

const userController = {
  signIn: (req, res) => {

    let { email: username, password } = req.body

    // 檢查必要資料
    if (!username || !password) {
      return res.json({ status: 'error', message: "Required fields didn't exist" })
    }
    // 檢查 user 是否存在與密碼是否正確
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return res.status(401).json({ status: 'error', message: 'No such user found' })
      if (!bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ status: 'error', message: 'Passwords did not match' })
      }
      // 簽發 token
      var payload = { id: user.id }
      // jwt.sign(): 將資料轉為 JSON web token
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    })
  }
}

module.exports = userController