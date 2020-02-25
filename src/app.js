import request from 'utils/request.js'

App({
  onLaunch: function(options) {
    var that = this;
    // console.log(decodeURIComponent(options.scene))
    // var corpid = wx.getStorageSync("corpid")
    // console.log(corpid)
    // 登录
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
    
    wx.login({
      success: res => {
        that.globalData.code = res.code;
        var data = {
          code: res.code,
          //type: 1,
          // corpid: decodeURIComponent(options.scene)
        }
        request._post('/login/getcode', data, res => {
          // console.log(res)
          if (res.data.errcode == 0) {
            that.globalData.token = res.data.token;
            that.globalData.uid = res.data.uid; //用户在微信小程序信息库中的编码id
            // that.globalData.is_registered = res.data.is_registered;
          }
          // that.globalData.is_registered = "undefined"
          if (that.userInfoReadyCallback) {
            that.userInfoReadyCallback(res)
          }
        }, err => {
          console.log(err)
        })
      }
    })
  },
  globalData: {
    is_registered: 0, //用户当前状态（0未初始化用户，1为已注册，2为已绑定）
    uid: "", //用户id，以后每次均需要携带该参数
    token: '', //用户token
    audioList: '', //音乐列表
    corpid: '', //网址的参数
    code: '' //当前用户的code,登录时就会返回
  },
})