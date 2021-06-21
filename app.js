const express = require('express')
const exphbs = require('express-handlebars') // 引入 handlebars
const db = require('./models')
const app = express()
const port = 3000
const { urlencoded } = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'hbs') // 設定使用 Handlebars 做為樣板引擎

app.use(urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

// 將 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

require('./routes')(app)

module.exports = app