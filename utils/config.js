
//需要部署server端程序，github地址为https://github.com/2020NCOV/ncov-report
//服务端程序部署好后，请替换你的域名，腾讯小程序要求request请求地址必须为https协议，此域名还需要加入到合法域名中，以及业务域名中，否则无法访问到，如果关联了公众号，请在公众号中设置JS安全域名，以防止webview页面表单的安全性信息提醒
const baseURL = 'https://ncov-sspku.mysspku.com/index';

//缺省的组织ID识别码，在数据库的organization表中的corp_code字段，以防止不带参数进入
const df_corpcode = '100000001';

//消息模版ID，在小程序的模版消息中申请
const tmplIds = 'axyABtv3vllZqVqTKdS3FTYpoMePOplgPuVccRno6HQ'

module.exports = {
  baseURL: baseURL,
  df_corpcode: df_corpcode,
  tmplIds: tmplIds
}