import request from '../../utils/request.js'
import common from '../../utils/common.js'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    sureBtn: false,
    formIsShow: true,
    search: false
  },
  // 职工号(学号)
  useridInput(e) {
    this.setData({
      userid: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getData()
  },
  onShow: function() {
    var that = this;
    // 获取用户身份
    var data = {
      uid: app.globalData.uid,
      token: app.globalData.token,
      corpid: app.globalData.corpid,
    }
    request._post('/login/getcorpname', data, res => {
      console.log(res)
      if (res.data.errcode == 0) {
        that.setData({
          corpname: res.data.corpname,
          type_corpname: res.data.type_corpname,
          type_username: res.data.type_username,
        })
      } else {
        common.NAVIGATE("../error/error?text=" + res.data.msg)
      }
    }, err => {
      console.log(err)
    })
  },
  // 提交企业标识和职工号
  sure() {
    var that = this;
    if (that.data.userid == '' || that.data.userid == undefined) {
      common.SHOWTIPS('请输入' + that.data.type_username, 'none')
      return;
    } else {
      var data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: app.globalData.corpid,
        userid: that.data.userid.trim()
      }
      request._post('/login/check_user', data, res => {
        console.log(res)
        if (res.data.errcode == 0) { //0代表不存在需要注册，1代表已存在绑定密码
          that.setData({
            corpid: res.data.corpid,
            userid: res.data.userid,
            disabled: true,
            sureBtn: true,
            is_exist: res.data.is_exist,
            formIsShow: false,
            search: true
          })
          console.log(that.data.is_exist)
        } else {
          common.NAVIGATE("../error/error?text=" + res.data.msg)
        }
      }, err => {
        console.log(err)
      })
    }
  },

  formSubmit: function(e) {
    let that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let list = e.detail.value
    // let reg = /^1(3|4|5|7|8)\d{9}$/;
    if (that.data.is_exist == 1) { //代表已存在（需要跳转到绑定页面
      if (list.password == "" || list.password == null) {
        common.SHOWTIPS('请输入密码', 'none')
        return;
      }
      var data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: that.data.corpid,
        userid: that.data.userid,
        password: e.detail.value.password.trim()
      }
      request._post('/login/bind', data, res => {
        console.log(res)
        if (res.data.is_registered == 2) {
          common.SHOWTIPS('绑定成功', 'success')
          wx.setStorageSync('registered', res.data.is_registered)
          app.globalData.is_registered = res.data.is_registered
          setTimeout(function() {
            common.SWITCHTAB('../dashboard/dashboard')
          }, 5000)

        } else {
          common.NAVIGATE("../error/error?text=" + res.data.msg)
        }
      }, err => {
        console.log(err)
      })
    } else { //1代表不存在（需要跳转到注册页面）
      if (list.name == "" || list.name == null) {
        common.SHOWTIPS('请填写姓名', 'none')
        return;
      } else if (list.phone_num == '' || list.phone_num == null) {
        common.SHOWTIPS('请填写手机号码', 'none')
        return;
      } else if (!common.ISPHONE(list.phone_num)) {
        common.SHOWTIPS('请输入正确的手机号', 'none')
        return;
      }
      let data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: that.data.corpid,
        userid: that.data.userid,
        name: list.name.trim(),
        phone_num: list.phone_num.trim(),

      }
      request._post('/login/register', data, res => {
        // console.log(res.data.is_registered)
        if (res.data.is_registered == 1) {
          common.SHOWTIPS('注册成功', 'success')
          app.globalData.is_registered = res.data.is_registered
          console.log(app.globalData.is_registered)
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
})