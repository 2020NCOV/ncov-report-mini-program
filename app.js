import request from 'utils/request.js'

const LOG = require('utils/log.js')

App({
  onLaunch: function(options) {
    console.log('app.js onLaunch');
    LOG.info('app.js onLaunch') ;
    
  },
  
  globalData: {
    is_registered: 0, //用户当前状态（0未初始化用户，1为已注册，2为已绑定）
    uid: "", //用户id，以后每次均需要携带该参数
    token: '', //用户token
    audioList: '', //音乐列表
    corpid: '', 
    code: '', 
    template_code: '',
    latitude: '',
    longitude: '',
  },
})