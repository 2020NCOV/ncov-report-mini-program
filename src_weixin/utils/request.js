//var hasClick = false;
const baseURL = 'https://ncov-sspku.mysspku.com//index';
const http = (method, url, data, response, error) => {
  // if (hasClick) {
  //   return
  // }
  // hasClick = true

  wx.showLoading({
    title: '加载中...',
    mask: true
  })

  wx.request({
    method: method,
    url: baseURL + url,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'token': wx.getStorageSync("token")
    },
    data: data,
    success: res => {
      return response(res)
    },
    // fail: err => {
    //   return error(err)
    // },
    complete: info => {
      wx.hideLoading();
      // hasClick = false
    }
  })
}

module.exports = {
  _get: (url, data, response, error) => http('GET', url, data, response, error),
  _post: (url, data, response, error) => http('POST', url, data, response, error)
}