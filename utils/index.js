// 补0操作
const checkTime = i => {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

/**
 * 获取当前时间
 * @param {Boolean} flag 
 * @returns 2022-06-12 08:09:06 星期日
 */
const getNowDate = (flag = false) => {
	const date = new Date(),
    year = date.getFullYear(),   //  返回的是年份
    month = checkTime(date.getMonth() + 1),  //  返回的月份上个月的月份，记得+1才是当月
    dates = checkTime(date.getDate()),      //  返回的是几号
    day = date.getDay(),         //  周一返回的是1，周六是6，但是周日是0
    week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    h = checkTime(date.getHours()),
    m = checkTime(date.getMinutes()),
    s = checkTime(date.getSeconds());

  return `${year}-${month}-${dates} ${h}:${m}:${s} ${flag ? week[day] : ''}`
}

// 去重
const unique = (arr = [], attrName = 'id') => {
  const res = new Map();
  return arr.filter((v) => !res.has(v[attrName]) && res.set(v[attrName], 1));
}

module.exports = {
  getNowDate,
  unique
}
