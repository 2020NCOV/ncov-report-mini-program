import request from '../../utils/request.js'
import common from '../../utils/common.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // is_registered: 0
  },
  // 解除绑定
  unbound() {
    var that = this;
    wx.showModal({
      title: '',
      content: '是否确认解除绑定',
      success(res) {
        if (res.confirm) {
          var data = {
            uid: app.globalData.uid,
            token: app.globalData.token
          }
          request._post('/login/unbind', data, res => {
            console.log(res)
            if (res.data.errcode == 0) {
              app.globalData.is_registered = 0;
              common.SHOWTIPS('解绑成功', 'success')
              setTimeout(function() {
                common.SWITCHTAB('../dashboard/dashboard')
              }, 1000)
            } else {
              common.NAVIGATE("../error/error?text=" + res.data.msg)
            }
          }, err => {
            console.log(err)
          })
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.setData({
      is_registered: app.globalData.is_registered
    })
    
    if (app.globalData.is_registered == 0) {
      console.log('我的页面判断是否绑定信息' + app.globalData.is_registered)
      common.REDIRECT("../info/info?corpid=" + app.globalData.corpid)
    } else {
      var data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: app.globalData.corpid
      }
      request._post('/info/getmyinfo', data, res => {
        if (res.data.errcode == 1099) {
          console.log('getmyinfo下面的1099的corp_code' + app.globalData.corpid)
          // app.globalData.corpid = res.data.corp_code;
          that.setData({
            name: res.data.name,
            phone_num: res.data.phone_num,
            corpname: res.data.corpname,
            type_corpname: res.data.type_corpname,
            type_username: res.data.type_username,
            userid: res.data.userid
          })
        } else {
          if (res.data.errcode == 0) {
            that.setData({
              name: res.data.name,
              phone_num: res.data.phone_num,
              corpname: res.data.corpname,
              type_corpname: res.data.type_corpname,
              type_username: res.data.type_username,
              userid: res.data.userid
            })
          } else {
            common.NAVIGATE("../error/error?text=" + res.data.msg)
          }
        }

      }, err => {
        console.log(err)
      })
    }
  }
})