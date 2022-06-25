export default class DateFormat {
  static format = (date, fmt) => {
    let o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), //日
      'h+': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
      'H+': date.getHours(), //小时
      'm+': date.getMinutes(), //分
      's+': date.getSeconds(), //秒
      'q+': Math.floor((date.getMonth() + 3) / 3), //季度
      S: date.getMilliseconds() //毫秒
    }

    let week = {
      '0': '日',
      '1': '一',
      '2': '二',
      '3': '三',
      '4': '四',
      '5': '五',
      '6': '六'
    }

    let weekEn = {
      '0': 'Sunday',
      '1': 'Monday',
      '2': 'Tuesday',
      '3': 'Wednesday',
      '4': 'Friday',
      '5': 'Saturday',
      '6': 'Sunday'
    }

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }

    if (/(E+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' : '周') : '') +
          week[date.getDay() + '']
      )
    }

    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }

    if (/(e+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, weekEn[date.getDay() + ''])
    }

    return fmt
  }
  static getDateTimeStamp = (date,divide='-')=>{
    let dateArr = date.split(divide)
    let db = new Date()
    db.setUTCFullYear(dateArr[0],dateArr[1]-1,dateArr[2])
    return db.getTime()
  }
  static diffDates  = (begin,end)=>{
    let unixDb = DateFormat.getDateTimeStamp(begin)
    let unixDe = DateFormat.getDateTimeStamp(end)
    let dates = []
    for (let k = unixDb; k <= unixDe;) {
      dates.push({
        fullDate: DateFormat.format(new Date(parseInt(k)), 'yyyy-M-d'),
        date: DateFormat.format(new Date(parseInt(k)), 'M-d'),
        week: DateFormat.format(new Date(parseInt(k)), 'EE')
      })
      k = k + 24 * 60 * 60 * 1000;
    }
    return dates
  }
}
