const express = require('express')
const exphbs = require('express-handlebars') // 引入 handlebars
const db = require('./models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000
const { urlencoded } = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'hbs') // 設定使用 Handlebars 做為樣板引擎

app.use(urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 將 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

require('./routes')(app, passport)

module.exports = app