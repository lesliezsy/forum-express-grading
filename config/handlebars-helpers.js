// 用來存放所有的自訂 helpers
// key 是 helper 的名稱，value 是處理 helper 邏輯的 function

const moment = require('moment')

module.exports = {

  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
      }
    return options.inverse(this)
  },

  moment: function (time) {
    return moment(time).fromNow()
  }

}