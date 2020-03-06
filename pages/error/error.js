Page({
  /**
   * 页面的初始数据
   */
  data: {
    error: '../../images/error.png'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    var that=this;
    that.setData({
      text:options.text
    })
  }
})