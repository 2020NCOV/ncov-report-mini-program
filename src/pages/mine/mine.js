import request from '../../utils/request.js'
import common from '../../utils/common.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_registered: 0
  },
  // 解除绑定
  unbound() {
    var that = this;
    wx.showModal({
      title: '',
      content: '是否确认解决绑定',
      success(res) {
        if (res.confirm) {
          var data = {
            uid: app.globalData.uid,
            token: app.globalData.token
          }
          request._post('/login/unbind', data, res => {
            console.log(res)
            if (res.data.errcode == 0) {
              common.SHOWTIPS('解绑成功', 'success')
              app.globalData.is_registered = 0;
              setTimeout(function() {
                common.SWITCHTAB('../dashboard/dashboard')
              }, 1000)
            } else {
              wx.navigateTo({
                url: "../error/error?text=" + res.data.msg
              })
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
  onLoad: function(options) {
    // var that = this;
    // var data = {
    //   uid: app.globalData.uid,
    //   token: app.globalData.token,
    // }
    // request._post('/info/getmyinfo', data, res => {
    //   console.log(res)
    //   if (res.data.errcode == 0) {
    //     that.setData({
    //       name: res.data.name,
    //       phone_num: res.data.phone_num,
    //     })
    //   }
    // }, err => {
    //   console.log(err)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    that.setData({
      is_registered: app.globalData.is_registered
    })
    // 判断是否绑定信息
    if (app.globalData.is_registered == 0) {
      wx.redirectTo({
        url: "../info/info?corpid=" + app.globalData.corpid
      })
    } else {
      var data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: app.globalData.corpid
      }
      request._post('/info/getmyinfo', data, res => {
        console.log(res)
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
          wx.redirectTo({
            url: "../error/error?text=" + res.data.msg
          })
        }
      }, err => {
        console.log(err)
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})