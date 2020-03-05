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
    buttonText: '开始今日上报',
    corpid: '',
    is_registered: ''
  },
  onLoad: function(options) {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function(res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function() {
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

    updateManager.onUpdateFailed(function() {
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
    // that.setData({
    //   corpid: corpid,
    // })
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
    app.userInfoReadyCallback = res => {
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
        }
      }, err => {
        console.log(err)
      })
      // 检查用户扫描二维码是否为之前绑定公司
      var data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: app.globalData.corpid
      }
      request._post('/info/getmyinfo', data, res => {
        console.log(res)
        // res.data.errcode = 1009;
        if (res.data.errcode == 1009) {
          app.globalData.corpid = res.data.corp_code;
          console.log('上报页面的corpid' + app.globalData.corpid)
          wx.showModal({
            title: '',
            content: res.data.msg,
            success(res) {
              if (res.confirm) {
                common.SWITCHTAB('../mine/mine')
              }
            }
          });
        }
      }, err => {
        console.log(err)
      })
      // var checkBind = {
      //   uid: app.globalData.uid,
      //   token: app.globalData.token
      // }
      // request._post('/info/getbindinfo', checkBind, res => {
      //   console.log(res.data.corp_code)
      //   if (res.data.is_bind == 1) {
      //     app.globalData.corpid = res.data.corp_code
      //     console.log('getbindinfo接口回传的' + app.globalData.corpid)
      //   }
      // }, err => {
      //   console.log(err)
      // })
    }
    // }
    // console.log(that.data.is_registered)
  },
  // 我的资料
  info() {
  },
  // 上报或查看
  report(val) {
    console.log(val)
    if (app.globalData.is_registered == 0) {
      common.NAVIGATE('../dashboard/dashboard'+ app.globalData.corpid)
      // wx.navigateTo({
      //   url: "../info/info?corpid=" + app.globalData.corpid
      // })
    } else {
      common.NAVIGATE("../report/report")
      // wx.navigateTo({
      //   url: "../report/report"
      // })
    }

  },
})