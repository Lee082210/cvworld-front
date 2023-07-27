//处理图片上传的格式问题
export default {
  sizeToStr: (size) => {
    let data = ''
    if (size < 0.1 * 1024) {
      //如果小于0.1KB则转化成B
      data = size.toFixed(2) + 'B'
    }
    else if (size < 0.1 * 1024 * 1024) {
      //如果小于0.1MB则转化成KB
      data = (size / 1024).toFixed(2) + 'KB'
    }
    else if (size < 0.1 * 1024 * 1024 * 1024) {
      //如果小于0.1GB则转化成MB
      data = (size / (1024 * 1024)).toFixed(2) + 'MB'
    }
    else {
      //其他转化成GB
      data = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
    }

    let sizestr = data + ''
    let len = sizestr.indexOf('.')
    let dec = sizestr.substr(len + 1, 2)
    if (dec == '00') {
      //当小数点后为00时，去掉小时部分
      return sizestr.substring(0, len) + sizestr.substr(len + 3, 2)
    }
    return sizestr
  }
}