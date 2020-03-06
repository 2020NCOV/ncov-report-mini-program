import common from '../../utils/common.js'
import request from '../../utils/request.js'
//获取应用实例 
const app = getApp()
const LOG = require('../../utils/log.js')
const AUTH = require('../../utils/auth.js')
const TOOLS = require('../../utils/tools.js')
const CONFIG = require('../../utils/config.js')
const baseURL = CONFIG.baseURL
const tmplIds = CONFIG.tmplIds
const df_corpcode = CONFIG.df_corpcode

Page({
  data: {
    userInfo: '',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bg: '../../images/bg.jpg',
    repotrBg: '../../images/report-bg.png',
    buttonText: '开始今日上报',
    corpid: '',
  },
  onLoad: function(options) {
    LOG.info('dashboard onLoad')
    console.log('dashboard onLoad'); 
    var that = this;
    let corpid = df_corpcode;
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
          corpid = df_corpcode;
        }
      } catch (e) {
        corpid = df_corpcode;
      }
    }
    console.log('dashboard onLoad corpid:'+ corpid);
    LOG.info('dashboard onLoad corpid:' +corpid);
    app.globalData.corpid = corpid
  },

  onShow: function() {
    var that = this;
    console.log('dashboard onShow');
    LOG.info('dashboard onShow') // 日志会和当前打开的页面关联，建议在页面的onHide、onShow等生命周期里面打
    console.log('dashboard  onShow开始全局 is_registered:' + app.globalData.is_registered);
    LOG.info('dashboard onShow开始全局 is_registered:' + app.globalData.is_registered)
    console.log('dashboard  onShow开始全局 uid:' + app.globalData.uid);
    LOG.info('dashboard onShow开始全局 uid:' + app.globalData.uid)
    console.log('dashboard  onShow开始全局 token:' + app.globalData.token);
    LOG.info('dashboard onShow开始全局 token:' + app.globalData.token)
    console.log('dashboard  onShow开始全局 corpid:' + app.globalData.corpid);
    LOG.info('dashboard onShow开始全局 corpid:' + app.globalData.corpid)    
    TOOLS.checkUpdate();//每次打开这个页面，自动检测是否有更新
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
    
    //获取用户code值
    wx.login({
      success: res => {
        var data = {
          code: res.code,
        }
        request._post('/login/getcode', data, res => {
          //每次根据用户的code获取用户的uid和openid
          if (res.data.errcode == 0) {
            app.globalData.token = res.data.token;
            app.globalData.uid = res.data.uid; //用户在微信小程序信息库中的编码id
            console.log('dashboard onShow /login/getcode 返回的 uid:' + res.data.uid);

            var data = {
              uid: app.globalData.uid,
              token: app.globalData.token,
              corpid: app.globalData.corpid
            }
            request._post('/info/getmyinfo', data, res => {
              //获取用户的绑定信息，如果已绑定其他企业，则将全局变量保存为已绑定的数据
           
              if (res.data.errcode == 1099 ) {
                app.globalData.corpid = res.data.corp_code;
              } 
              if (res.data.errcode == 1099 || res.data.errcode == 0) {
                app.globalData.template_code = res.data.bind_corp_template_code;
              } 
             
              
              AUTH.checkUser()

              console.log('dashboard  onShow结束后全局 is_registered:' + app.globalData.is_registered);
              LOG.info('dashboard onShow结束后全局 is_registered:' + app.globalData.is_registered)
              console.log('dashboard  onShow结束后全局 uid:' + app.globalData.uid);
              LOG.info('dashboard onShow结束后全局 uid:' + app.globalData.uid)
              console.log('dashboard  onShow结束后全局 token:' + app.globalData.token);
              LOG.info('dashboard onShow结束后全局 token:' + app.globalData.token)
              console.log('dashboard  onShow结束后全局 corpid:' + app.globalData.corpid);
              LOG.info('dashboard onShow结束后全局 corpid:' + app.globalData.corpid)  
            }, err => {
              console.log('err:')
              console.log(err)
            })
          }
        }, err => {
          console.log('err:')
          console.log(err)
        })
      }
    })
  },

 
  // 上报或查看
  report(val) {
    console.log(val)
    // 订阅消息
    let str = tmplIds  //模板id
    wx.requestSubscribeMessage({
      tmplIds: [str], // 此处可填写多个模板 ID，但低版本微信不兼容只能授权一个
      success(res) {
        console.log(res[str])
      }
    })
    if (app.globalData.is_registered == 0) {
      common.NAVIGATE('../info/info?corpid=' + app.globalData.corpid)
    } else if (app.globalData.template_code == "default"){
      common.NAVIGATE("../report/report")
    }else if (app.globalData.template_code == "company") {
      common.NAVIGATE("../report/report")
    }else if (app.globalData.template_code == "other01") {
      common.NAVIGATE("../webview/webview?text=" + baseURL +"template/other01/uid/" + app.globalData.uid + "/token/" + app.globalData.token)
    } else if(app.globalData.template_code == "other02") {
      common.NAVIGATE("../webview/webview?text=" + baseURL +"/template/other02/uid/" + app.globalData.uid + "/token/" + app.globalData.token)
    } else if (app.globalData.template_code == "other03") {
      common.NAVIGATE("../webview/webview?text=" + baseURL +"/template/other03/uid/" + app.globalData.uid + "/token/" + app.globalData.token)
    } else if (app.globalData.template_code == "other04") {
      common.NAVIGATE("../webview/webview?text=" + baseURL +"/template/other04/uid/" + app.globalData.uid + "/token/" + app.globalData.token)
    } else{
      common.SHOWTIPS('无有效的模板', 'none')
    }
  },
})