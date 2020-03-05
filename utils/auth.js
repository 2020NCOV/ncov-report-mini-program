
//获取应用实例
const app = getApp()
import request from 'request.js'

function checkUser() {
  var checkList = {
    code: app.globalData.code,
    corpid: app.globalData.corpid,
    uid: app.globalData.uid,
    token: app.globalData.token
  }
  request._post('/login/check_is_registered', checkList, res => {
    if (res.data.errcode == 0) {
      app.globalData.is_registered = res.data.is_registered
      console.log('check_is_registered接口回传的' + app.globalData.is_registered)
    }
  }, err => {
    console.log(err)
  })
}

module.exports = {
  checkUser: checkUser,
}