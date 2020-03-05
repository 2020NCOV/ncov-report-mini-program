
//路由跳转
const NAVIGATE = function (_url) {
  wx.navigateTo({ url: _url })
}
const REDIRECT = function (_url) {
  wx.redirectTo({ url: _url })
}
const SWITCHTAB = function (_url) {
  wx.switchTab({ url: _url });
}
const TOBACK = function (_num) {
  wx.navigateBack({ delta: _num });
}

// 获取当前时间
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') 
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//todate默认参数是当前日期，可以传入对应时间 todate格式为2018-10-05
function getDates(days, todate) {
  var dateArry = [];
  for (var i = 0; i < days; i++) {
    var dateObj = dateLater(todate, i);
    dateArry.push(dateObj)
  }
  return dateArry;
}
function dateLater(dates, later) {
  let dateObj = {};
  let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');
  let date = new Date(dates);
  date.setDate(date.getDate() + later);
  let day = date.getDay();
  let yearDate = date.getFullYear();
  let month = ((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1);
  let dayFormate = (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate());
  dateObj.time = yearDate + '-' + month + '-' + dayFormate;
  dateObj.week = show_day[day];
  return dateObj;
}
//正则验证
//验证手机号
const ISPHONE = function (_phone) {
  // let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57]|19[0-9]|16[0-9])[0-9]{8}$/
  let reg = /^\d{8,}$/;
  if (reg.test(_phone)) {
    return true;
  } else {
    return false;
  }
}
// 验证是否输入为数字
const ISNUMBER = function (_number) {
  let reg = /^\d+$|^\d+[.]?\d+$/;
  if (reg.test(_number)) {
    return true;
  } else {
    return false;
  }
}

//消息提示
const SHOWTIPS = function (_msg, _icon, _duration, cb) {
  wx.showToast({
    title: _msg,
    icon: _icon,
    duration: _duration || 1500,
    mask: true,
    success: function (res) {
      return typeof _cb === 'function' && _cb(res);
    },
    fail: function (err) {
      return typeof _cb === 'function' && _cb(false);
    }
  })
}
//验证是否空对象
const ISEMPTYOBJ = function (_obj) {
  for (let k in _obj) {
    return false;
  };
  return true;
};
//加载提示
const LOADTIPS = function (_msg, _cb) {
  wx.showLoading({
    title: _msg,
    mask: true,
    success: function (res) {
      return typeof _cb === 'function' && _cb(res);
    },
    fail: function (err) {
      return typeof _cb === 'function' && _cb(false);
    }
  })
}
//模态弹框
const MODALTIPS = function (_msg, _content, _cb) {
  wx.showModal({
    title: _msg,
    content: _content,
    success: function (res) {
      return typeof _cb === 'function' && _cb(res);
    }
  })
}
module.exports = {
  NAVIGATE: NAVIGATE,
  REDIRECT: REDIRECT,
  SWITCHTAB: SWITCHTAB,
  TOBACK: TOBACK,
  ISPHONE: ISPHONE,
  SHOWTIPS: SHOWTIPS,
  LOADTIPS: LOADTIPS,
  MODALTIPS: MODALTIPS,
  ISNUMBER:ISNUMBER,
  formatTime: formatTime,
  getDates: getDates
}