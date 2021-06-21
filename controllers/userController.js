const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db

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
  }

}

module.exports = userController