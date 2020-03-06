
//获取应用实例
const app = getApp()
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
    //获取地理位置
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        app.globalData.latitude = res.latitude
        app.globalData.longitude = res.longitude
      }
    })

    console.log(options)
    var that=this;
    that.setData({
      text:options.text
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})