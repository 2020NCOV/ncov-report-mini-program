import common from '../../utils/common.js'
import request from '../../utils/request.js'
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    // todayIcon: '../../images/bussiness-man.png',
    // viewIcon: '../../images/icon_calendar.png',
    bg: '../../images/bg.jpg',
    repotrBg: '../../images/report-bg.png',
    buttonText: '开始上报',
    corpid: '',
    is_registered: ''
  },
  onLoad: function(options) {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新版本下载失败
    })
    

    console.log('onload最初全局is_registered' + app.globalData.is_registered)
    var that = this;
    let corpid = "";
    if (options.scene) {
      corpid = decodeURIComponent(options.scene);
      wx.setStorage({
        key: "corpid",
        data: corpid
      })
    } else {
      try {
        corpid = wx.getStorageSync('corpid');
        if (corpid == '') {
          console.log("if");
          corpid = "100000001";
        }
      } catch (e) {
        console.log("catch");
        corpid = "100000001";
      }
    }

    console.log(corpid);

    
    app.globalData.corpid = corpid
    //  获取当前时间和周几
    var date = common.formatTime(new Date());
    let time = common.getDates(7, date);
    for (var i = 0; i < time.length; i++) {
      if (time[i].time == date) {
        that.setData({
          time: time[i].time,
          week: time[i].week
        })
      }
    }

  },
  onShow: function() {
    var that = this;
    console.log('onShow最初全局is_registered' + app.globalData.is_registered)
    // 判断是否绑定信息
    if (app.globalData.is_registered) {
      that.setData({
        is_registered: app.globalData.is_registered,
      })
    } else {
      app.userInfoReadyCallback = res => {
        // that.setData({
        //   is_registered: app.globalData.is_registered,
        // })

        var checkList = {
          code: app.globalData.code,
          corpid: app.globalData.corpid,
          uid: app.globalData.uid,
          token: app.globalData.token
        }
        // 判断当前用户是否注册
        request._post('/login/check_is_registered', checkList, res => {
          console.log(res)
          if (res.data.errcode == 0) {
            app.globalData.is_registered = res.data.is_registered
            console.log('check_is_registered接口回传的' + app.globalData.is_registered)
            // if (app.globalData.is_registered == 0) {
            //   wx.navigateTo({
            //     url: "../info/info?corpid=" + that.data.corpid
            //   })
            // }
          }
        }, err => {
          console.log(err)
        })

      }
    }
    // console.log(that.data.is_registered)
  },
  // 我的资料
  info() {
    // console.log(this.data.userInfo)
    // if (this.data.userInfo) {
    wx.navigateTo({
      url: "../info/info"
    })
    // } else {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '请先去登录',
    //     success: function(res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //         wx.redirectTo({
    //           url: '../authorize/authorize', //授权页面
    //         })
    //       }
    //     }
    //   })
    // }

  },
  // 上报或查看
  report(val) {
    console.log(val)
    if (app.globalData.is_registered == 0) {
      wx.navigateTo({
        url: "../info/info?corpid=" + app.globalData.corpid
      })
    } else {
      wx.navigateTo({
        url: "../report/report"
      })
    }
    // if (this.data.userInfo) {
    // } else {
    //   wx.showModal({
    //     title: '温馨提示',
    //     content: '请先去登录',
    //     success: function(res) {
    //       if (res.confirm) {
    //         console.log('用户点击确定')
    //         wx.redirectTo({
    //           url: '../authorize/authorize', //授权页面
    //         })
    //       }
    //     }
    //   })
    // }

  },
})