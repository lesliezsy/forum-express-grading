//  passport功能，經過封裝，才能在測試環境中模擬使用者登入的狀態
function ensureAuthenticated(req) {
  return req.isAuthenticated();
}

function getUser(req) {
  return req.user;
}

module.exports = {
  ensureAuthenticated,
  getUser,
};