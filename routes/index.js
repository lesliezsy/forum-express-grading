// 使用 express routes
let routes = require('./routes');
let apis = require('./apis')


module.exports = (app) => {
  app.use('/', routes); // 將 app 輸出至 routes 這個 middleware
  app.use('/api', apis) // 將 app 輸出至 api/ 這個前綴開頭的路由
}