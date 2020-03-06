const CONFIG = require('config.js')
const baseURL = CONFIG.baseURL

const http = (method, url, data, response, error) => {

  wx.showLoading({
    title: '加载中...',
    mask: true
  })

  wx.request({
    method: method,
    url: baseURL + url,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data: data,
    success: res => {
      return response(res)
    },
    complete: info => {
      wx.hideLoading();
    }
  })
}

module.exports = {
  _get: (url, data, response, error) => http('GET', url, data, response, error),
  _post: (url, data, response, error) => http('POST', url, data, response, error)
}