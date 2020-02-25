import request from '../../utils/request.js'
import common from '../../utils/common.js'
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    genderText: '请选择性别',
    degreeText: '请选择攻读学位',
    classText: '请选择所属年级',
    treeText: '请选择组织机构',
    disabled: false,
    sureBtn: false,
    formIsShow: true,
    search: false
  },
  // 职工号(学号)
  useridInput(e) {
    this.setData({
      userid: e.detail.value
    })
  },
  // 性别
  genderChange(e) {
    let that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      index: e.detail.value,
      genderText: '',
    })
  },
  // 学位
  degreeChange(e) {
    this.setData({
      degree: e.detail.value,
      degreeText: ''
    })
  },
  // 年级
  classChange(e) {
    this.setData({
      class: e.detail.value,
      classText: ''
    })
  },
  // 组织机构
  treeChange(e) {
    this.setData({
      tree: e.detail.value,
      treeText: ''
    })
  },
  // 组织机构
  getDepartmentId(e) {
    let data = e.detail;
    this.setData({
      department_id: data.industryTwoId
    });
    console.log(this.data.department_id);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getData()
    var that = this;
    // 获取用户身份
    var data = {
      uid: app.globalData.uid,
      token: app.globalData.token,
      corpid: app.globalData.corpid,
    }
    request._post('/login/getcorpname', data, res => {
      console.log(res)
      if (res.data.errcode == 0) {
        that.setData({
          corpname: res.data.corpname,
          type_corpname: res.data.type_corpname,
          type_username: res.data.type_username,
        })
      }else{
        wx.navigateTo({
          url: "../error/error?text=" + res.data.msg
        })
      }
    }, err => {
      console.log(err)
    })

  },
  // 提交企业标识和职工号
  sure() {
    var that = this;
    console.log(that.data.userid)
    if (that.data.userid == '' || that.data.userid == undefined) {
      common.SHOWTIPS('请输入职工号(学号)', 'none')
      return;
    } else {
      var data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: app.globalData.corpid,
        userid: that.data.userid
      }
      request._post('/login/check_user', data, res => {
        console.log(res)
        if (res.data.errcode == 0) { //0代表不存在需要注册，1代表已存在绑定密码
          that.setData({
            corpid: res.data.corpid,
            userid: res.data.userid,
            disabled: true,
            sureBtn: true,
            is_exist: res.data.is_exist,
            formIsShow: false,
            search: true
          })
          console.log(that.data.is_exist)
        }else{
          wx.navigateTo({
            url: "../error/error?text=" + res.data.msg
          })
        }
      }, err => {
        console.log(err)
      })
    }
  },
  // getData() {
  //   let that = this;
  //   // 性别
  //   request._get('http://epidemic-report.psy-cloud.com/student/api/system/dic/gender/get', '', res => {
  //     that.setData({
  //       genderOptions: res.data.data.gender_data
  //     });
  //   })
  //   // 学位
  //   request._get('http://epidemic-report.psy-cloud.com/student/api/system/dic/degree/get', '', res => {
  //     // console.log(res.data.data.degree_data)
  //     that.setData({
  //       IDoptions: res.data.data.degree_data
  //     });
  //   })
  //   // 年级
  //   request._get('http://epidemic-report.psy-cloud.com/student/api/system/dic/grade/get', '', res => {
  //     // console.log(res.data.data.grade_data)
  //     that.setData({
  //       classOptions: res.data.data.grade_data
  //     });
  //   })
  // 组织机构
  //   request._get('api/system/department/tree/getall', '', res => {
  //     //组织机构
  //     that.setData({
  //       treeList: res.data.data.tree_data
  //     })
  //   });
  // },
  formSubmit: function(e) {
    let that = this;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let list = e.detail.value
    // let reg = /^1(3|4|5|7|8)\d{9}$/;
    if (that.data.is_exist == 1) { //代表已存在（需要跳转到绑定页面
      if (list.password == "" || list.password == null) {
        common.SHOWTIPS('请输入密码', 'none')
        return;
      }
      var data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: that.data.corpid,
        userid: that.data.userid,
        password: e.detail.value.password
      }
      request._post('/login/bind', data, res => {
        console.log(res)
        if (res.data.is_registered == 2) {
          common.SHOWTIPS('绑定成功', 'success')
          wx.setStorageSync('registered', res.data.is_registered)
          app.globalData.is_registered = res.data.is_registered
          setTimeout(function() {
            common.SWITCHTAB('../dashboard/dashboard')
          }, 5000)

        } else {
          wx.navigateTo({
            url: "../error/error?text=" + res.data.msg
          })
        }
      }, err => {
        console.log(err)
      })
    } else { //1代表不存在（需要跳转到注册页面）
      if (list.name == "" || list.name == null) {
        common.SHOWTIPS('请填写姓名', 'none')
        return;
      } else if (list.phone_num == '' || list.phone_num == null) {
        common.SHOWTIPS('请填写手机号码', 'none')
        return;
      } else if (!common.ISPHONE(list.phone_num)) {
        common.SHOWTIPS('请输入正确的手机号', 'none')
        return;
      }
      let data = {
        uid: app.globalData.uid,
        token: app.globalData.token,
        corpid: that.data.corpid,
        userid: that.data.userid,
        name: list.name,
        phone_num: list.phone_num,
        // gender_value: that.data.genderOptions[list.gender_value].value,
        // degree_value: that.data.IDoptions[list.degree_value].value,
        // grade_value: that.data.classOptions[list.grade_value].value,
        // department_id: that.data.treeList[list.department_id].id
      }
      request._post('/login/register', data, res => {
        // console.log(res.data.is_registered)
        if (res.data.is_registered == 1) {
          common.SHOWTIPS('注册成功', 'success')
          app.globalData.is_registered = res.data.is_registered
          console.log(app.globalData.is_registered)
          setTimeout(function() {
            common.SWITCHTAB('../dashboard/dashboard')
          }, 1000)
        } else {
          wx.navigateTo({
            url: "../error/error?text=" + res.data.msg
          })
        }
      }, err => {
        console.log(err)
      })
    }
    // else if (list.gender_value == '' || list.gender_value == null) {
    //   common.SHOWTIPS('请选择性别', 'none')
    //   return;
    // }
    // else if (list.degree_value == '' || list.degree_value == null) {
    //   common.SHOWTIPS('请选择攻读学位', 'none')
    //   return;
    // } else if (list.grade_value == '' || list.grade_value == null) {
    //   common.SHOWTIPS('请选择所属年级', 'none')
    //   return;
    // } else if (list.department_id == '' || list.department_id == null) {
    //   common.SHOWTIPS('请选择组织机构', 'none')
    //   return;
    // }
    // else {


    // }
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