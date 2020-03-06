import request from '../../utils/request.js'
import common from '../../utils/common.js'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    contagionText: '请选择传染途径',
    healthText: '请选择身体状况',
    returnText: '请选择日期',
    planText: '请选择日期',
    currentCityText: '请选择所在城市',
    customItem: '全部',
    region: ['', '', ''],
    is_return_school: '',
    returnData: [],
    multiArray: [],
    multiIndex: [0, 0],
    multiIndex2: [0, 0],
    show: 'true',
    time: '',
  },
  // 是否已返校
  radioChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      is_return_school: e.detail.value
    })
  },
  // 返校时间
  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      returnText: ''
    })
  },
  //返回公司所在地日期
  bindReturnDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      return_date: e.detail.value,
      returnText: ''
    })
  },
  // 计划返回公司所在地日期
  bindPlanDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      plan_date: e.detail.value,
      planText: ''
    })
  },
  // 目前本人身体情况
  healthChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value,
      healthText: ''
    })
  },
  // 从哪个城市返回
  getReturnData(e) {
    let data = e.detail;
    this.setData({
      return_district_value: data.industryTwoId
    });
    console.log(this.data.return_district_value);
  },
  // 重置
  formReset() {
    var that = this;
    that.setData({
      currentCityText: '请选择所在城市',
      current_district_path: '',
      current_district_value: '',
      return_district_path: '',
      return_district_value: '',
      date: '',
      returnText: '请选择返校时间',
      is_return_school: '',
      plan_date: '',
      planText: '请选择日期',
      return_date: '',
      show: true
    })
  },
  // 提交
  formSubmit: function(e) {
    let that = this;
    var reg = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (that.data.template_code == "default") { //学生模板
      if (e.detail.value.is_return_school == '') {
        common.SHOWTIPS('请选择是否返校', 'none')
        return;
      } else if (that.data.is_return_school == 1) { //判断模板字段是否为default，default再判断学生字段
        if (e.detail.value.return_time == '' || e.detail.value.return_time == null) {
          common.SHOWTIPS('请选择返校时间', 'none')
          return;
        } else if (e.detail.value.return_dorm_num == '' || e.detail.value.return_dorm_num == null) {
          common.SHOWTIPS('请填写宿舍号', 'none')
          return;
        } else if (that.data.return_district_value == '' || that.data.return_district_value == null) {
          common.SHOWTIPS('请选择从哪里返校', 'none')
          return;
        } else if (e.detail.value.return_traffic_info == '' || e.detail.value.return_traffic_info == null) {
          common.SHOWTIPS('请填写返校交通信息', 'none')
          return;
        }
      }
    } else { //公司模板
      if (e.detail.value.is_return_school == '') {
        common.SHOWTIPS('请选择是否返回公司所在地', 'none')
        return;
      } else if (that.data.is_return_school == 1) {
        //公司返回公司所在地日期字段非空校验
        if (e.detail.value.return_date == '' || e.detail.value.return_date == null) {
          common.SHOWTIPS('请选择返回公司所在地日期', 'none')
          return;
        }
      } else if (that.data.is_return_school == 2) {
        //公司计划返回公司所在地日期字段非空校验
        if (e.detail.value.plan_date == '' || e.detail.value.plan_date == null) {
          common.SHOWTIPS('请选择计划返回公司所在地日期', 'none')
          return;
        }
      }
    }
    // 以下为共同字段校验
    if (this.data.current_district_value == '' || that.data.current_district_value == null) {
      common.SHOWTIPS('请选择目前所在地', 'none')
      return;
    } else if (e.detail.value.current_health_value == '' || e.detail.value.current_health_value == null) {
      common.SHOWTIPS('请选择目前身体状况', 'none')
      return;
    } else if (e.detail.value.current_contagion_risk_value == "" || e.detail.value.current_contagion_risk_value == null) {
      common.SHOWTIPS('请选择传染途径', 'none')
      return;
    } else if (e.detail.value.current_temperature == "" || e.detail.value.current_temperature == null) {
      common.SHOWTIPS('请输入体温', 'none')
      return;
    } else if (!reg.test(e.detail.value.current_temperature)) {
      common.SHOWTIPS('请输入正确格式的体温', 'none')
      return;
    } else if (e.detail.value.psy_status == '' || e.detail.value.psy_status == null) {
      common.SHOWTIPS('请选择你现在的心理状况', 'none')
      return;
    } else if (e.detail.value.psy_demand == '' || e.detail.value.psy_demand == null) {
      common.SHOWTIPS('请选择心理咨询需求', 'none')
      return;
    } else if (e.detail.value.psy_knowledge == '' || e.detail.value.psy_knowledge == null) {
      common.SHOWTIPS('请选择心理调适知识', 'none')
      return;
    } else if (e.detail.value.psy_knowledge == 6) { //心理调适选项为其他必须填写其他说明
      if (e.detail.value.remarks == '' || e.detail.value.remarks == null) {
        common.SHOWTIPS('请填写其他帮助或想说的', 'none')
        return;
      }
    }
    if (e.detail.value.is_return_school == 2) {
      that.setData({
        return_district_value: ''
      })
    }
    let data = {
      is_return_school: e.detail.value.is_return_school, //是否返校
      return_time: e.detail.value.return_time, //返校时间
      return_dorm_num: e.detail.value.return_dorm_num, //宿舍号
      return_traffic_info: e.detail.value.return_traffic_info, //返校交通信息
      current_health_value: e.detail.value.current_health_value, //身体情况
      current_contagion_risk_value: e.detail.value.current_contagion_risk_value, //传染途径
      return_district_value: that.data.return_district_value, //从哪个城市返回
      current_district_value: that.data.current_district_value, //目前所在地
      current_temperature: e.detail.value.current_temperature.trim(), //体温	
      remarks: e.detail.value.remarks.trim(), //备注
      psy_status: e.detail.value.psy_status, //你现在的心理状况
      psy_demand: e.detail.value.psy_demand, //你对心理咨询的需求
      psy_knowledge: e.detail.value.psy_knowledge, //你需要获得哪方面的心理调适知识
      return_company_date: e.detail.value.return_date, //返回公司所在地日期
      plan_company_date: e.detail.value.plan_date, //计划返回公司所在地日期
    }
    let list = {
      data: JSON.stringify(data),
      token: app.globalData.token,
      uid: app.globalData.uid,
      template_code: that.data.template_code,
    }
    console.log(list)
    request._post('/report/save', list, res => {
      console.log(res)
      if (res.data.errcode == 0) {
        common.SHOWTIPS('上报成功', 'success')
        setTimeout(function() {
          common.SWITCHTAB('../dashboard/dashboard')
        }, 1000)
      } else {
        common.NAVIGATE("../error/error?text=" + res.data.msg)
      }
    }, err => {
      console.log(err)
    })
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
    this.getData()
    this.getIndustry();
    var that = this;
  },
  getData() {
    var that = this;
    // 获取用户身份
    var type = {
      uid: app.globalData.uid,
      token: app.globalData.token,
      corpid: app.globalData.corpid,
    }
    request._post('/login/getcorpname', type, res => {
      console.log(res)
      if (res.data.errcode == 0) {
        that.setData({
          template_code: res.data.template_code //用户模板
        })
        
        var info = {
          uid: app.globalData.uid,
          token: app.globalData.token,
          corpid: app.globalData.corpid
        }
        request._post('/info/getmyinfo', info, res => {
          console.log(res)
        
          if (res.data.errcode == 0) {
            that.setData({
              name: res.data.name,
              phone_num: res.data.phone_num,
              corpname: res.data.corpname,
              type_corpname: res.data.type_corpname,
              type_username: res.data.type_username,
              userid: res.data.userid
            })
          } else {
            common.NAVIGATE("../error/error?text=" + res.data.msg)
          }
        }, err => {
          console.log(err)
        })
        var data = {
          token: app.globalData.token,
          uid: app.globalData.uid
        }
        // 获取最后一次上报的记录
        request._post('/report/getlastdata', data, res => {
          console.log(res)
          var returnSchoolList = [{
              id: '1',
              value: '是',
            },
            {
              id: '2',
              value: '否'
            }
          ]
          var healthOptions = [{
              id: '1',
              name: '已确诊新型肺炎，治疗中'
            },
            {
              id: '2',
              name: '疑似待确诊'
            },
            {
              id: '3',
              name: '有被传染可能，隔离观察中'
            },
            {
              id: '4',
              name: '有发烧、咳嗽等症状，经诊断非新型肺炎'
            },
            {
              id: '5',
              name: '身体无异样'
            }
          ]
          var pathwayOptions = [{
              id: '1',
              name: '回湖北，回家、探亲'
            },
            {
              id: '2',
              name: '去湖北旅游、访友'
            },
            {
              id: '3',
              name: '接触过湖北回来的朋友或者疑似或者高危人'
            },
            {
              id: '4',
              name: '期间有过外出、旅游及聚会，目前参与人都未发现异样，周边也无确认及疑似案例'
            },
            {
              id: '5',
              name: '期间有过外出、旅游及聚会，当地已有确诊案例，存在可能被传染情形'
            },
            {
              id: '6',
              name: '其他可能被传染情形'
            },
            {
              id: '7',
              name: '无高危出行聚会或者聚会等行为，宅家，被传染可能性极小'
            }
          ]
          //你现在的心理状况
          var psyStatusOptions = [{
            id: '1',
            name: '挺好的'
          }, {
            id: '2',
            name: '还可以'
          }, {
            id: '3',
            name: '一般般'
          }, {
            id: '4',
            name: '有点差'
          }, {
            id: '5',
            name: '非常糟'
          }]
          // 心理咨询的需求 
          var demandOptions = [{
            id: '1',
            name: '很需要'
          }, {
            id: '2',
            name: '偶尔需要'
          }, {
            id: '3',
            name: '无所谓'
          }, {
            id: '4',
            name: '暂不需要'
          }, {
            id: '5',
            name: '不需要'
          }]
          // 你需要获得哪方面的心理调适知识
          var knowledgeOptions = [{
            id: '1',
            name: '不需要'
          }, {
            id: '2',
            name: '焦虑减压'
          }, {
            id: '3',
            name: '情绪管理'
          }, {
            id: '4',
            name: '学习成长'
          }, {
            id: '5',
            name: '家人相处'
          }, {
            id: '6',
            name: '其他(请在下题中描述)'
          }]
          console.log(returnSchoolList)
          if (res.data.isEmpty == 0) {
            returnSchoolList[res.data.data.is_return_school - 1].checked = "true";
            healthOptions[res.data.data.current_health_value - 1].checked = "true";
            pathwayOptions[res.data.data.current_contagion_risk_value - 1].checked = "true";
            psyStatusOptions[res.data.data.psy_status - 1].checked = "true";
            demandOptions[res.data.data.psy_demand - 1].checked = "true";
            knowledgeOptions[res.data.data.psy_knowledge - 1].checked = "true";
            that.setData({
              returnSchool: returnSchoolList,
              healthOptions: healthOptions,
              pathwayOptions: pathwayOptions,
              psyStatusOptions: psyStatusOptions,
              demandOptions: demandOptions,
              knowledgeOptions: knowledgeOptions,
              is_return_school: res.data.data.is_return_school,
              returnData: res.data.data,
              return_district_value: res.data.data.return_district_value, //从哪个城市返回,
              return_district_path: res.data.data.return_district_path,
              current_district_value: res.data.data.current_district_value, //目前所在地
              current_district_path: res.data.data.current_district_path,
              currentCityText: res.data.data.current_district_path,
              time: res.data.data.time,
              return_date: res.data.data.return_company_date, //返回公司所在地日期
            })
            console.log(that.data.return_date)
            if (res.data.data.is_return_school == 1) {
              that.setData({
                date: res.data.data.return_time,
                returnText: '',
              })
            } else {
              that.setData({
                planText: '',
                plan_date: res.data.data.plan_company_date //目前是否已返回公司所在地
              })
            }
            if (res.data.data.return_company_date == null && that.data.template_code == "company") {
              that.setData({
                return_date: '',
                returnText: '请选择日期'
              })
            }else{
              that.setData({
                date: '',
                returnText: '请选择日期'
              })
            }
            
            if (res.data.data.plan_company_date == null) {
              that.setData({
                plan_date: '',
                planText: '请选择日期'
              })
            }
          } else {
            console.log('没有数据')
            that.setData({
              returnSchool: returnSchoolList,
              healthOptions: healthOptions,
              pathwayOptions: pathwayOptions,
              psyStatusOptions: psyStatusOptions,
              demandOptions: demandOptions,
              knowledgeOptions: knowledgeOptions
            })
          }
        }, err => {
          console.log(err)
        })
        // }

      }
    }, err => {
      console.log(err)
    })

  },
  /**城市级联开始**/
  getIndustry() {
    let that = this;
    request._get('/district/getall', '', res => {
      var firstList = res.data.data.tree_data
      let industryName = firstList.map(m => {
        return m.name //------------------------获取一级下拉列表的名称
      });
      that.setData({
        multiArray: [industryName, []], //----------- 将一级列表的名称存入二维数组的第一项
        firstList, // ------------一级的完整数据 先存着后面有用
        industryName //---------------一级的名称 先存着后面有用
      });
      let industryOneId = firstList[0]['id']; //  一级菜单默认的value
      if (industryOneId) {
        that.searchClassInfo(industryOneId); //如果存在，去掉取相应数组下的list
      }
    }, err => {
      console.log(err)
    })
  },
  searchClassInfo(value) {
    // console.log(value)
    let that = this;
    if (value) {
      that.setData({
        industryOneId: value //这个是一级列表中用户选中的value
      });
      that.data.firstList.map(m => { //firstList是一级分类的数组，上方代码里有
        if (m.id == value) { //通过比对查出value对应的这一列
          that.setData({
            secondList: m.children //用户选中的一级分类中的children就是第二列的列表
          })
        }
      });
      // console.log(that.data.secondList);
      let industryTwoName = that.data.secondList.map(m => {
        return m.name //再遍历secondList把所有的label取出来放入industryTwoName 中用于二级列表的展示
      });
      // console.log(industryTwoName);
      let industryName = that.data.industryName;
      that.setData({
        multiArray: [industryName, industryTwoName], //这就是一个完整的二级联动展示了
        industryTwoName,
      })
    }
  },
  bindMultiPickerColumnChange: function(e) {
    let that = this;
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: that.data.multiArray,
      multiIndex: that.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value; //从这以上的代码是案例自带的没有删除的。
    /************************************************************/
    let industryOneId_session = that.data.industryOneId; //  先将滚动前的一级菜单id存下来，便于之后做对比
    switch (e.detail.column) {
      case 0:
        let firstList = that.data.firstList;
        var firstId = firstList[e.detail.value]['value'];
        if (industryOneId_session != firstId) { //每次滚动的时候都去和上一个做一次对比
          that.searchClassInfo(firstId); // 只要不一样，就去执行上面searchClassInfo()这个方法
        }
        data.multiIndex[1] = 0;
        break;
    }

  },
  // 目前所在地区
  bindMultiPickerChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value);
    var secondList = this.data.secondList;
    var select_key = e.detail.value[1]; //去二维数组中第二项的下标取出来，也就是二级下拉菜单的下标值
    this.setData({
      current_district_value: secondList[select_key]['value'],
      //  拿到下标值对应的value值就是我们要用的id
      show: false
    })

    this.setData({
      multiIndex: e.detail.value
    });
  }
})