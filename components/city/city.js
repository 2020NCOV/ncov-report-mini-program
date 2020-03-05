import request from '../../utils/request.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    return_district_path: {
      type: String, //类型
      value: '' //默认值
    },
    current_district_path: String

  },

  /**
   * 组件的初始数据
   */
  data: {
    multiArray: [],
    multiIndex: [0, 0],
    show: 'true',
    citytext: '请选择返回城市'
  },
  /**
   * 组件的方法列表
   */
  attached() {
    this.getIndustry();
  },
  methods: {
    // 获取行业分类checkCorp.industry
    getIndustry() {

      let that = this;
      console.log(this.data.return_district_path)
      if (this.data.return_district_path) {
        that.setData({
          citytext: this.data.return_district_path
        })
      }
      request._get('/district/getall', '', res => {
        // console.log(res.data.data.tree_data)
        // let temporary = { //--------------因为接口数据返回的是从第一项开始的，这里加一个请选择选项放入数据的开头
        //   id: "0",
        //   name: "请选择",
        //   children: [{
        //     name: '',
        //     id: '0'
        //   }]
        // }
        var firstList = res.data.data.tree_data
        // firstList.unshift(temporary);
        // console.log(firstList);
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
    bindMultiPickerChange: function(e) {
      // console.log('picker发送选择改变，携带值为', e.detail.value);
      var secondList = this.data.secondList;
      var select_key = e.detail.value[1]; //去二维数组中第二项的下标取出来，也就是二级下拉菜单的下标值
      this.setData({
        industryTwoId: secondList[select_key]['value'],
        　　　　　　 //  拿到下标值对应的value值就是我们要用的id
        show: false
      })

      this.setData({
        multiIndex: e.detail.value
      });
      // 通过triggerEvent绑定的myEvent方法，把一级下拉的id和二级下拉的id拿出来
      this.triggerEvent('myEvent', {
        industryOneId: this.data.industryOneId,
        industryTwoId: this.data.industryTwoId
      })
    },
  },

})