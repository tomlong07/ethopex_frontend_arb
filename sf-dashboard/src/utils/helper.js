import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  startOfQuarter,
  endOfQuarter,
  isSameDay,
} from 'date-fns'

import { ctr_user } from '@/services/ctr_user'
import { LOCAL_STORAGE_TOKEN } from '@/constants/storage'
import { CDN_IMAGE_MINIO_S3, LOGIN_URL, URL_UPLOAD } from '@/constants/urls'

/**
 * Khai báo kiểu AsyncLoader dùng cho loader của defineAsyncComponent.
 * @template {import('vue').Component} T
 * @typedef {import('vue').AsyncComponentLoader<T>} AsyncLoader
 */
/**
 * Khai báo kiểu AsyncOptions dùng cho options của defineAsyncComponent.
 * @template {import('vue').Component} T
 * @typedef {import('vue').AsyncComponentOptions<T>} AsyncOptions
 */

// Currency
Number.prototype.formatMoney = function (
  decPlaces,
  thouSeparator,
  decSeparator
) {
  decPlaces = isNaN((decPlaces = Math.abs(decPlaces))) ? 2 : decPlaces
  decSeparator = decSeparator == undefined ? '.' : decSeparator
  thouSeparator = thouSeparator == undefined ? ',' : thouSeparator
  var n = this,
    sign = n < 0 ? '-' : '',
    i = parseInt((n = Math.abs(+n || 0).toFixed(decPlaces))) + '',
    j = (j = i.length) > 3 ? j % 3 : 0
  return (
    sign +
    (j ? i.substr(0, j) + thouSeparator : '') +
    i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thouSeparator) +
    (decPlaces
      ? decSeparator +
        Math.abs(n - i)
          .toFixed(decPlaces)
          .slice(2)
      : '')
  )
}

export default {
  abbreviateNumber(value) {
    var newValue = value
    if (value >= 1000) {
      var suffixes = ['', 'k', 'M', 'B', 'T', 'P', 'E']
      var suffixNum = Math.floor(('' + value).length / 3)
      var shortValue = ''
      for (var precision = 2; precision >= 1; precision--) {
        shortValue = parseFloat(
          (suffixNum != 0
            ? value / Math.pow(1000, suffixNum)
            : value
          ).toPrecision(precision)
        )
        var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g, '')
        if (dotLessShortValue.length <= 2) {
          break
        }
      }
      if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1)
      newValue = shortValue + suffixes[suffixNum]
    }
    return newValue
  },
  formatDateChart(date, _interval = 'DAY') {
    return date
  },
  checkNumNull(num) {
    return num == undefined || num == '' || num == null ? 0 : num
  },
  checkNull(num) {
    return num == undefined || num == '' || num == null
  },

  formatData(data, type) {
    if (type.indexOf('money') != -1) {
      const format = type.replace('money', '')
      const currencyObj = {
        code: 'USD',
        symbol: '$',
      }
      return this.formatCurrencySymbol(
        data,
        currencyObj.code,
        currencyObj.symbol,
        format
      )
    } else if (type == 'number') {
      return this.formatNumber(data)
    } else if (type == 'percent') {
      return this.formatNumber(data) + '%'
    }
  },
  formatCurrencySymbol(num, code, curSymbol, floorNum) {
    return code == 'VND'
      ? this.formatNumber(num, floorNum) + curSymbol
      : curSymbol + this.formatNumber(num, floorNum)
  },
  formatNumber(value, floorNum = 2) {
    if (!value) return '0'
    if (typeof value == 'string') value = parseFloat(value)
    return value.formatMoney(Number.isInteger(value) ? 0 : floorNum, ',', '.')
  },

  formatNumberV2: (input, precision) => {
    let number

    if (typeof input === 'number') {
      number = input

      input = input.toString()
    } else {
      number = parseFloat(input)
      if (isNaN(number)) {
        return input
      }
    }

    if (number === 0) {
      return '-'
    }

    if (precision === null) {
      if (typeof input === 'string' && input.includes('.')) {
        const decimalPart = input.split('.')[1]

        precision = decimalPart ? decimalPart.length : 0
      } else {
        precision = 0
      }

      precision = Math.min(precision, 3)
    }

    const roundedNumber = number.toFixed(precision)
    const formattedNumber = parseFloat(roundedNumber).toLocaleString('en-US', {
      maximumFractionDigits: precision,
    })

    return formattedNumber
  },

  formatCurrencyV2(input, precision) {
    const number = Number(input)
    if (!number) return '-'

    const formatted = this.formatNumberV2(Math.abs(number), precision)

    return number < 0 ? `-$${formatted}` : `$${formatted}`
  },

  formatNumberV3: (input, precision) => {
    let number

    if (typeof input === 'number') {
      number = input

      input = input.toString()
    } else {
      number = parseFloat(input)
      if (isNaN(number)) {
        return input
      }
    }

    if (number === 0) {
      return '-'
    }

    if (precision === null) {
      if (typeof input === 'string' && input.includes('.')) {
        const decimalPart = input.split('.')[1]

        precision = decimalPart ? decimalPart.length : 0
      } else {
        precision = 0
      }

      precision = Math.min(precision, 3)
    }

    const roundedNumber = number.toFixed(precision)
    const formattedNumber = parseFloat(roundedNumber).toLocaleString('en-US', {
      maximumFractionDigits: precision,
      minimumFractionDigits: precision,
    })

    return formattedNumber
  },

  getTotalSizeByDate(start_date, end_date, time_interval) {
    const startDate = new Date(start_date)
    const endDate = new Date(end_date)
    var sizeRes = 0
    if (time_interval == 'hour') {
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
      sizeRes = dateRange.length * 24
    } else if (time_interval == 'day') {
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
      sizeRes = dateRange.length
    } else if (time_interval == 'week') {
      const dateRange = eachWeekOfInterval({
        start: startDate,
        end: endDate,
      })
      sizeRes = dateRange.length
    } else if (time_interval == 'month') {
      const dateRange = eachMonthOfInterval({
        start: startDate,
        end: endDate,
      })
      sizeRes = dateRange.length
    }
    return sizeRes
  },

  isInt(n) {
    return Number(n) === n && n % 1 === 0
  },

  isFloat(n) {
    return Number(n) === n && n % 1 !== 0
  },

  clone(item) {
    return JSON.parse(JSON.stringify(item))
  },

  LogObject(...obj) {
    obj.forEach((element) => {
      //no-console
      console.info(this.clone(element))
    })
  },

  isObject(yourObject) {
    if (
      typeof yourObject === 'object' &&
      !Array.isArray(yourObject) &&
      yourObject !== null
    ) {
      return true
    }
    return false
  },

  getFixed(num, MinFloat = 4) {
    if (num <= 0 || !isFinite(num)) return 0

    const log = Math.log10(num)
    const exponent = Math.floor(log) // ví dụ -4 cho 0.000x
    let fixed = -exponent // số chữ số thập phân cần để phần đầu >=1

    // Nếu số lớn (>=1), fixed=0
    if (fixed < 0) fixed = 0

    // Cap theo MinFloat (tức max fixed)
    if (fixed > MinFloat) fixed = MinFloat

    return fixed
  },

  getMoneyCurrency(input, numberFixed) {
    var currencyNow = { symbol: '$', backPostion: false }

    if (typeof input == 'string' && input.includes(currencyNow.symbol)) {
      return input
    }

    if (input == 'NaN' || input == 'Infinity') {
      input = 0
    }

    var fixed = 2
    // const MinFloat = 4

    if (!numberFixed) {
      fixed = this.getFixed(input)
    } else {
      fixed = numberFixed
    }

    var temp = this.floatWithCommas(input, fixed)
    if (currencyNow.backPostion) {
      return (temp == 0 ? 0 : temp) + ' ' + currencyNow.symbol
    }
    return currencyNow.symbol + (temp == 0 ? 0 : temp)
  },

  calculateRate(a, b) {
    // Tránh chia cho 0
    if (b === 0) {
      return 0
    }

    // Tính rate
    let rate = (a / b) * 100

    // Định dạng rate dựa trên giá trị
    if (rate >= 10) {
      // Lớn thì lấy 2 chữ số thập phân
      return Math.round(rate * 100) / 100
    } else if (rate >= 1) {
      // Nhỏ hơn thì lấy 3 chữ số thập phân
      return Math.round(rate * 1000) / 1000
    } else if (rate > 0.001) {
      // Nhỏ hơn nữa thì lấy 4 chữ số thập phân
      return Math.round(rate * 10000) / 10000
    } else {
      // Nếu quá nhỏ, trả về 0
      return 0
    }
  },

  //Xóa hết các kí tự ngoài số ra (phục vụ convert tiền về số)
  parseCurrency(currencyString) {
    return parseFloat(currencyString.replace(/[^0-9.-]+/g, ''))
  },

  truePath(customPath) {
    let path = customPath || window.location.pathname

    if (path != '/' && this.lastStringOf(path) == '/') {
      return this.removeLastString(path)
    }

    return path
  },

  countText(text) {
    let length = 0
    for (let i = 0; i < text.length; i++) {
      let char = text.charCodeAt(i)
      if (char > 0xff) {
        length += 2 // Ký tự đôi
      } else {
        length += 1 // Ký tự đơn
      }
    }
    return length
  },

  lenChar(char) {
    switch (true) {
      case ['。'].includes(char):
        return 2
      case this.containsCJK(char):
        return 2

      //Đặt emoji thành 4 kí tự (chưa chắc chắn)
      //2 char ở text ghép lại thành 1 char emoji -> 4 kí tự => 2 kí tự từ text gốc thành 4 kí tự mới => +2 kí tự
      case this.isEmoji(char):
        return 4

      default:
        return 1
    }
  },

  countTextV2(text) {
    let length = 0
    for (let char of Array.from(text)) {
      length += this.lenChar(char)
    }

    return length
  },

  truncateString(str, maxLength) {
    let length = 0
    let result = ''

    for (let char of Array.from(str)) {
      // Đảm bảo emoji được xử lý đúng
      let charLen = this.lenChar(char)

      if (length + charLen > maxLength) break

      result += char
      length += charLen
    }

    return result
  },

  // Hàm kiểm tra emoji (regex dựa trên Unicode emoji range)
  isEmoji(char) {
    return /\p{Extended_Pictographic}/u.test(char)
  },

  countCharacters(text) {
    //In expanded text ads, the length limits are the same across all languages. Each character in double-width languages like Korean, Japanese, or Chinese counts as two towards the limit instead of one.
    //https://support.google.com/google-ads/answer/1704389?hl=en
    const regex = /\{([^}]+):([^}]+)\}/g
    const textRegex = text.replace(regex, '$2')

    const realLength = this.countTextV2(textRegex)

    return realLength
  },
  // getTotalTextCountForCJK(str) {
  //   // Unicode grapheme cluster segmentation
  //   const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' })
  //   const graphemes = [...segmenter.segment(str)].map((s) => s.segment)

  //   // Regex nhận diện ký tự CJK (Trung, Nhật, Hàn) và full-width
  //   const fullWidthRegex =
  //     /[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u30FF\u31F0-\u31FF\uAC00-\uD7AF]/
  //   const fullWidthPunctuationRegex = /[。、？！，：；（）［］｛｝【】「」『』]/

  //   // Xử lý emoji đặc biệt theo Google
  //   const emojiSpecialCases = {
  //     '✅': 3,
  //     '🚗': 4,
  //     '🌟': 4,
  //     '🇻🇳': 8,
  //   }

  //   let totalCount = 0

  //   for (const char of graphemes) {
  //     if (emojiSpecialCases[char] !== undefined) {
  //       totalCount += emojiSpecialCases[char]
  //     } else if (
  //       fullWidthRegex.test(char) ||
  //       fullWidthPunctuationRegex.test(char)
  //     ) {
  //       totalCount += 2
  //     } else {
  //       totalCount += 1
  //     }
  //   }

  //   return totalCount
  // },

  getTotalTextCountForCJK(str) {
    const fullWidthRegex =
      /[\u4E00-\u9FFF\u3400-\u4DBF\u3040-\u30FF\u31F0-\u31FF\uAC00-\uD7AF\u1000-\u109F\u102B-\u103E\u1050-\u109F\uAA60-\uAA7F\uA9E0-\uA9FF]/
    const fullWidthPunctuationRegex = /[。、？！，：；（）［］｛｝【】「」『』]/

    // Xử lý emoji đặc biệt theo Google
    const emojiSpecialCases = {
      '✅': 3,
      '🚗': 4,
      '🌟': 4,
      '🇻🇳': 8,
    }

    let totalCount = 0

    // eslint-disable-next-line unicorn/no-useless-spread
    for (const char of [...str]) {
      if (emojiSpecialCases[char] !== undefined) {
        totalCount += emojiSpecialCases[char]
      } else if (
        fullWidthRegex.test(char) ||
        fullWidthPunctuationRegex.test(char)
      ) {
        totalCount += 2
      } else {
        totalCount += 1
      }
    }

    return totalCount
  },

  /**
   * Loại bỏ macro dạng {MacroName:Value} => Value
   * @param {string} input - Chuỗi đầu vào có chứa macro
   * @returns {string} Chuỗi đã được thay thế macro
   */
  removeMacros(input) {
    if (typeof input !== 'string') return input
    return input.replace(/\{[^:{}\s]+:([^{}]+)\}/g, '$1')
  },

  countCharactersV2(text) {
    text = this.removeMacros(text)
    const count1 = this.countCharacters(text)
    const count2 = this.getTotalTextCountForCJK(text)

    return count1 > count2 ? count1 : count2
    // return
    // let count = 0

    // for (const char of text) {
    //   const code = char.codePointAt(0)

    //   if (
    //     (code >= 0x0000 && code <= 0x007f) || // ASCII (chữ Latin, số, dấu câu cơ bản)
    //     (code >= 0xff61 && code <= 0xff9f && code !== 0xff01 && code !== 0xff1a) // Half-width Katakana, trừ ! (U+FF01) và : (U+FF1A)
    //   ) {
    //     count += 1
    //   } else if (
    //     (code >= 0x3040 && code <= 0x30ff) || // Hiragana & Katakana (Nhật)
    //     (code >= 0x4e00 && code <= 0x9fff) || // Kanji (Trung/Nhật)
    //     (code >= 0xac00 && code <= 0xd7af) || // Hangul (Hàn)
    //     (code >= 0xff01 && code <= 0xff60) || // Full-width punctuation
    //     (code >= 0x2000 && code <= 0x206f) || // Dấu câu Unicode đặc biệt
    //     (code >= 0x3000 && code <= 0x303f) // Dấu câu tiếng Nhật như "。" "、"
    //   ) {
    //     count += 2
    //   } else if (code === 0x3000) {
    //     count += 2 // Full-width Space (U+3000)
    //   } else {
    //     count += 1
    //   }
    // }
    // return count
  },

  extractHref(htmlString) {
    // Regular expression to match href attribute
    var regex = /<a[^>]*href="([^"]*)"/
    // Execute the regular expression on the input string
    var match = regex.exec(htmlString)
    // Return the first capturing group if a match is found, otherwise return null
    return match ? match[1] : null
  },

  pathNow() {
    //Encode lại thì mới lấy đc lúc các search params khi login back url
    let location = window.location || location
    return encodeURIComponent(location.pathname + location.search)
  },

  lastStringOf(str) {
    return str.substr(str.length - 1)
  },

  removeLastString(str) {
    return str.substring(0, str.length - 1)
  },

  isEmpty(obj) {
    //Check obj empty
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false
      }
    }

    return JSON.stringify(obj) === JSON.stringify({})
  },

  capitalizeFirstLetter(string) {
    if (!string) {
      return string
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
  },

  beautyStringName(snakeCaseString) {
    return snakeCaseString.replace(/_/g, ' ').replace(/\b\w/g, function (char) {
      return char.toUpperCase()
    })
  },

  getParams(param, location) {
    var url_string = location || window.location.href
    var url = new URL(url_string)
    return url.searchParams.get(param)
  },

  getQueryParams(url) {
    var queryParams = {}
    var queryString = url.split('?')[1]
    if (queryString) {
      queryString.split('&').forEach(function (param) {
        var keyValue = param.split('=')
        var key = decodeURIComponent(keyValue[0])
        var value = decodeURIComponent(keyValue[1]) || ''
        queryParams[key] = value
      })
    }
    return queryParams
  },

  isValidDateString(dateString) {
    // Parse the date string into components
    var parts = dateString.split('-')
    if (parts.length !== 3) {
      return false // Incorrect format
    }

    // Convert the components to integers
    var year = parseInt(parts[0], 10)
    var month = parseInt(parts[1], 10)
    var day = parseInt(parts[2], 10)

    // Create a Date object with the parsed components
    var date = new Date(year, month - 1, day)

    // Check if the input date components match the constructed date
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  },

  buildSearch(params) {
    const searchParams = new URLSearchParams()

    // Loop through each key-value pair in the params object
    Object.keys(params).forEach((key) => {
      searchParams.append(key, params[key])
    })

    // Return the search string
    return searchParams.toString()
  },

  replaceUrlParam(url, paramName, paramValue) {
    if (paramValue == null) {
      paramValue = ''
    }
    var pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)')
    if (url.search(pattern) >= 0) {
      return url.replace(pattern, '$1' + paramValue + '$2')
    }

    url = url.replace(/[?#]$/, '')
    //   return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
    return url + (url.includes('?') ? '&' : '?') + paramName + '=' + paramValue
  },

  isBeta() {
    return this?.isDev() || this?.isLocal() || this?.isTest() || this?.isDebug()
  },

  isTest() {
    return this.getParams('test') == 'true'
  },

  isDev() {
    return this.getParams('dev') == 'true'
  },

  isDebug() {
    return this.getParams('debug') == 'true'
  },

  isSQL() {
    return this.getParams('sql') == 'true'
  },

  isAjax() {
    return this.getParams('ajax') == 'true'
  },

  isPayload() {
    return this.getParams('payload') == 'true'
  },

  isLocal() {
    return (
      window.location.hostname == '127.0.0.1' ||
      window.location.hostname == 'localhost' ||
      window.location.hostname.includes('.local') ||
      window.location.hostname.startsWith('192.')
    )
  },

  isDevelopment() {
    return window.location.hostname.includes('-dev')
  },

  isPub() {
    return window.location.hostname.includes('pub-')
  },

  isProduction() {
    return !this.isLocal()
  },

  getCookie(cookieName) {
    var name = cookieName + '='
    var ca = document.cookie.split(';')
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1)
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length)
      }
    }
    return ''
  },

  deleteCookie(name, custom = '') {
    document.cookie =
      name + '=;' + custom + 'expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  },

  currencyFormatterAuto(value) {
    try {
      const decimalCount = value.toString().split('.')[1]?.length || 0

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimalCount, // Đặt số chữ số thập phân tối thiểu
        maximumFractionDigits: decimalCount, // Đặt số chữ số thập phân tối đa
      }).format(value)
    } catch (error) {
      console.error(error)
      return '0'
    }
  },
  currencyFormatterAuto2(value, decimal = 4) {
    try {
      let decimalCount = value.toString().split('.')[1]?.length || 0

      if (decimalCount > decimal) decimalCount = decimal

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimalCount, // Đặt số chữ số thập phân tối thiểu
        maximumFractionDigits: decimalCount, // Đặt số chữ số thập phân tối đa
      }).format(value)
    } catch (error) {
      console.error(error)

      return '0'
    }
  },

  currencyFormatterAuto3(value) {
    try {
      let decimalCount = value.toString().split('.')[1]?.length || 0

      if (decimalCount > 2) decimalCount = 2

      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimalCount, // Đặt số chữ số thập phân tối thiểu
        maximumFractionDigits: decimalCount, // Đặt số chữ số thập phân tối đa
      }).format(value)
    } catch (error) {
      console.error(error)

      return '0'
    }
  },

  currencyFormatter(data, precision) {
    if (data == 'Loading...') {
      return data
    }
    if (this.IsString(data)) {
      data = parseFloat(data)
    }

    if (!data) {
      data = 0
    }
    if (precision < 0) {
      precision = 0
    }

    const result = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: precision,
    }).format(data)
    return result
  },

  IsString(e) {
    return typeof e === 'string' || e instanceof String
  },

  isNumber(value) {
    return typeof value === 'number' && isFinite(value)
  },

  numberTranform(input, decimal = 2) {
    if (!input) {
      return
    }
    var x = parseFloat(input.toFixed(decimal))
    var parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  },

  getPercent(input, decimal = 1, characterPercent = '%') {
    if (typeof input === 'undefined') {
      return `0${characterPercent}`
    }

    return this.miniHelp(input, characterPercent, decimal)
  },

  miniHelp(input, plus, decimal = 1) {
    if (typeof input == 'string' && input.includes(plus)) {
      return input
    }
    if (input == 'NaN' || input == 'Infinity') {
      input = 0
    }

    var res = input
    try {
      if (input <= 2) {
        decimal = 2
      }

      if (input <= 0.5) {
        decimal = 3
      }

      if (input >= 100) {
        decimal = 0
      }
      res = this.floatWithCommas(input, decimal) + plus
    } catch (error) {
      console.error(error, input)
    }
    return res
  },

  floatWithCommas(input, decimal = 2) {
    if (this.IsString(input)) {
      return input
    }

    var x = parseFloat(input.toFixed(decimal))
    var parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  },

  DiffDays(date1, date2, includesEndDate = true) {
    const startDate = new Date(date1)
    const endDate = new Date(date2)
    const diffTime = Math.abs(endDate - startDate)
    return (
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + (includesEndDate ? 1 : 0)
    )
  },

  formatToUTC(dateString) {
    if (!dateString) return null
    return dateString.slice(0, 16).replace('T', ' ') + ' UTC'
  },

  isMonthPicker(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Check if both start and end dates are the first and last day of the same month.
    return (
      start.getDate() === 1 &&
      end.getDate() ===
        new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate() &&
      start.getMonth() === end.getMonth()
    )
  },

  isQuarterPicker(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Calculate the start and end of the quarter for the start date
    const quarterStart = startOfQuarter(start)
    const quarterEnd = endOfQuarter(start)

    // Check if the start and end dates match the start and end of the quarter
    return isSameDay(start, quarterStart) && isSameDay(end, quarterEnd)
  },

  async ajaxRequest(
    url = '',
    method = 'GET',
    responseType = 'text',
    timeout = 20000,
    withCredentials = false,
    sendData = '',
    resolve = function () {},
    reject = function () {},
    obj = {}
  ) {
    if (!url) {
      reject(Error('URL is required'), obj)
    }
    let request = new XMLHttpRequest()

    request.responseType = responseType
    request.onreadystatechange = function () {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          resolve(request.response, obj)
        } else {
          reject(Error(request.status), obj)
        }
      }
    }
    request.withCredentials = withCredentials
    request.onerror = function () {
      reject(Error('Network Error'), obj)
    }
    request.timeout = timeout
    request.ontimeout = function () {
      reject(Error('Request Timeout'), obj)
    }

    request.open(method, url, true)
    if (obj && obj.headers) {
      obj.headers.forEach((element) => {
        request.setRequestHeader(element.key, element.value)
      })
    }
    request.send(sendData)
    return request
  },

  isOnlyNumber(input) {
    // Use a regular expression to check if the string only contains numbers and commas
    const regex = /^[0-9, \n]+$/
    return regex.test(input)
  },

  formatISOFast(isoString) {
    // "2025-09-27T02:00:03.369Z"
    try {
      const [date, time] = isoString.split('T')
      const [year, month, day] = date.split('-')
      const [hour, minute, second] = time.replace('Z', '').split(':')
      return `${day}/${month}/${year} ${hour}:${minute}:${
        second.split('.')[0]
      } UTC`
    } catch {
      return isoString
    }
  },

  convertTimeV2(input) {
    try {
      if (
        input &&
        input !== '0001-01-01 at 00:00:00' &&
        input !== '0001-01-01T00:00:00Z'
      ) {
        // Tách phần ngày giờ và phần múi giờ
        const [dateTimePart, timezonePart] = input.split(' +')

        // Chuyển đổi phần ngày giờ thành định dạng ISO 8601
        const isoDateTime = dateTimePart.replace(' ', 'T')

        // Kết hợp lại phần ngày giờ và phần múi giờ
        const isoString = `${isoDateTime}+${timezonePart.replace(' ', '')}`

        let d = new Date(isoString)

        if (!isNaN(d.getTime())) {
          return d.toLocaleString()
        }
      }

      return input
    } catch {
      return input
    }
  },

  convertTimeV3(input) {
    try {
      if (
        input &&
        input !== '0001-01-01 at 00:00:00' &&
        input !== '0001-01-01T00:00:00Z'
      ) {
        // Tách phần ngày giờ và phần múi giờ
        const [dateTimePart, timezonePart] = input.split(' +')

        // Chuyển đổi phần ngày giờ thành định dạng ISO 8601
        const isoDateTime = dateTimePart.replace(' ', 'T')

        // Kết hợp lại phần ngày giờ và phần múi giờ
        const isoString = `${isoDateTime}+${timezonePart.replace(' ', '')}`

        let d = new Date(isoString)

        if (!isNaN(d.getTime())) {
          // Chuyển đổi ngày và giờ thành định dạng YYYY-MM-DD HH:mm:ss
          const formattedDateTime = d
            .toLocaleString('en-CA', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })
            .replace(',', '')

          return formattedDateTime
        }
      }

      return input
    } catch (error) {
      console.error(error)
      return input
    }
  },

  stringToArray(inputString, removeEmpty = true) {
    // Tách chuỗi bằng dấu phẩy hoặc xuống dòng
    let resultArray = inputString
      .split(/[\n,]+/)
      .map((element) => element.trim())

    if (removeEmpty) {
      resultArray = resultArray.filter((element) => element !== '')
    }

    return resultArray
  },

  stringToArrayTT(inputString, removeEmpty = true) {
    // Loại bỏ các dấu [ ] có thể xuất hiện nhiều lần
    let cleanedString = inputString
      .trim()
      .replace(/^\[+/, '') // Loại bỏ một hoặc nhiều [ ở đầu
      .replace(/\]+$/, '') // Loại bỏ một hoặc nhiều ] ở cuối
      .trim()

    // Tách chuỗi bằng dấu phẩy hoặc xuống dòng
    let resultArray = cleanedString
      .split(/[\n,]+/)
      .map((element) => element.trim())

    if (removeEmpty) {
      resultArray = resultArray.filter((element) => element !== '')
    }

    return resultArray
  },

  stringToArrayLine(inputString, removeEmpty = true) {
    // Tách chuỗi bằng xuống dòng
    let resultArray = inputString
      .split(/[\n]+/)
      .map((element) => element.trim())

    if (removeEmpty) {
      resultArray = resultArray.filter((element) => element !== '')
    }

    return resultArray
  },

  removeDuplicate(stringsArray) {
    return [...new Set(stringsArray)]
  },

  isValidJSON(str) {
    try {
      JSON.parse(str)
      return true
    } catch {
      return false
    }
  },

  isFunction(v) {
    return typeof v === 'function'
  },

  //Clone có cả function, vue component...
  deepClone(obj, clonedObjects = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') {
      return obj
    }

    if (clonedObjects.has(obj)) {
      return clonedObjects.get(obj)
    }

    if (Array.isArray(obj)) {
      const newArray = []
      clonedObjects.set(obj, newArray)

      for (let i = 0; i < obj.length; i++) {
        newArray[i] = this.deepClone(obj[i], clonedObjects)
      }
      return newArray
    }

    const newObject = {}
    clonedObjects.set(obj, newObject)

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObject[key] = this.deepClone(obj[key], clonedObjects)
      }
    }

    return newObject
  },

  handleBarsCustom(template, objData = {}) {
    if (!template) {
      return null
    }
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
    }
    function replaceAll(str, match, replacement) {
      return str.replace(
        new RegExp(escapeRegExp(match), 'g'),
        () => replacement // prettier/prettier
      )
    }
    for (let key in objData) {
      template = replaceAll(template, '{{{' + key + '}}}', objData[key])
    }
    return template
  },

  containsCJK(text) {
    // Biểu thức chính quy kiểm tra ký tự tiếng Hàn, tiếng Nhật và tiếng Trung Quốc
    const cjkPattern =
      /[\u1100-\u11FF\uAC00-\uD7AF\u3130-\u318F\u3040-\u30FF\u31F0-\u31FF\u4E00-\u9FFF\u3400-\u4DBF\uFF66-\uFF9D]/
    //c

    const specialPattern = /[「」『』【】《》〈〉！]/ // Các ký tự đặc biệt bị đếm sai

    return cjkPattern.test(text) || specialPattern.test(text)
  },

  hightlightDiv(notifyCheckBox, timeout = 500) {
    const values = [true, false, true, false]
    let index = 0

    function toggleNotifyCheckBoxRecursively() {
      if (index >= values.length) {
        return
      }

      const value = values[index]
      notifyCheckBox.value = value

      setTimeout(() => {
        index++
        toggleNotifyCheckBoxRecursively()
      }, timeout)
    }

    toggleNotifyCheckBoxRecursively()
  },

  hightlightDiv2(div, timeout = 500) {
    const values = [true, false, true, false]
    // const values = [true];
    let index = 0

    function toggleNotifyCheckBoxRecursively() {
      if (index >= values.length) {
        return
      }

      const value = values[index]
      if (value) {
        div.classList.add('warning-input-notify')
      } else {
        div.classList.remove('warning-input-notify')
      }

      setTimeout(() => {
        index++
        toggleNotifyCheckBoxRecursively()
      }, timeout)
    }

    toggleNotifyCheckBoxRecursively()
  },

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },

  generateDateRange(startDate, endDate) {
    const dateRange = []
    let currentDate = new Date(startDate)

    while (currentDate <= new Date(endDate)) {
      dateRange.push(new Date(currentDate).toISOString().slice(0, 10))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dateRange
  },

  sortByProp(list, prop) {
    list.sort((a, b) => {
      // Convert names to lowercase for case-insensitive sorting
      let nameA = a[prop]?.toLowerCase() || ''
      let nameB = b[prop]?.toLowerCase() || ''

      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      // Names are equal
      return 0
    })
  },

  buildCustomHtml(input, custom = 'div', className = '') {
    let temp = custom
    if (className != '') {
      temp += ` class="${className}"`
    }
    return `<${temp}>${input}</${custom}>`
  },

  boldHtml(input) {
    return this.buildCustomHtml(input, 'b')
  },

  copyText(text) {
    navigator.clipboard.writeText(text)
    ctr_user.Lac(text)
  },

  hotJar() {
    ;(function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          ;(h.hj.q = h.hj.q || []).push(arguments)
        }
      h._hjSettings = { hjid: 5022600, hjsv: 6 }
      a = o.getElementsByTagName('head')[0]
      r = o.createElement('script')
      r.async = 1
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      a.appendChild(r)
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
  },

  clarity(idCla) {
    const id = idCla || 'vm63ushq2c'
    ;(function (c, l, a, r, i, t, y) {
      c[a] =
        c[a] ||
        function () {
          ;(c[a].q = c[a].q || []).push(arguments)
        }
      t = l.createElement(r)
      t.async = 1
      t.src = 'https://www.clarity.ms/tag/' + i
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(window, document, 'clarity', 'script', id)
  },

  clearLocalStorageExceptV2(...keysToKeep) {
    // Lưu trữ các giá trị của các keys cần giữ
    const valuesToKeep = {}

    // Lặp qua từng key để lấy giá trị và lưu vào đối tượng valuesToKeep
    keysToKeep.forEach((key) => {
      const value = localStorage.getItem(key)
      if (value !== null) {
        valuesToKeep[key] = value
      }
    })

    // Xóa toàn bộ localStorage
    localStorage.clear()

    // Đặt lại các giá trị đã giữ vào localStorage
    Object.keys(valuesToKeep).forEach((key) => {
      localStorage.setItem(key, valuesToKeep[key])
    })
  },

  updateSandboxAttribute(htmlContent) {
    var tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    var iframes = tempDiv.getElementsByTagName('iframe')
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].setAttribute('sandbox', 'allow-scripts allow-same-origin')
    }
    return tempDiv.innerHTML
  },

  removeElementsById(htmlString, ids) {
    // Tạo một div tạm thời để chứa HTML string
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlString

    // Lặp qua mỗi id và loại bỏ phần tử có id đó
    ids.forEach((id) => {
      const element = tempDiv.querySelector(`#${id}`)

      if (element) {
        element.remove()
      }
    })

    // Trả về HTML mới dưới dạng string
    return tempDiv.innerHTML
  },

  deepFreeze(obj) {
    // Lấy tất cả các thuộc tính của đối tượng
    const propNames = Object.getOwnPropertyNames(obj)

    // Freeze các thuộc tính của đối tượng
    propNames.forEach((name) => {
      const value = obj[name]

      // Nếu giá trị là đối tượng, deep freeze nó
      if (value && typeof value === 'object') {
        this.deepFreeze(value)
      }
    })

    // Freeze chính đối tượng
    return Object.freeze(obj)
  },

  cleanIdInput(input) {
    return input
      .trim()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  log(...mess) {
    mess.forEach((element) => {
      //no-console
      console.info(
        `%c ARB SYSTEM ${element} `,
        'color: #ff4500; background-color: #FFFACD; border-color: #b8daff; font-size:16px'
      )
    })
  },

  ensureArrayLength(arr, lengMin = 4) {
    // Đảm bảo arr là một mảng
    if (!Array.isArray(arr)) {
      arr = []
    }

    // Thêm các phần tử "" cho đến khi độ dài của mảng là 4
    while (arr.length < lengMin) {
      arr.push('')
    }

    return arr
  },

  isEUCountry(countryCode) {
    if (countryCode === 'ALL') return true
    const euCountries = [
      'AT',
      'BE',
      'BG',
      'CY',
      'CZ',
      'DE',
      'DK',
      'EE',
      'ES',
      'FI',
      'FR',
      'GF',
      'GP',
      'GR',
      'HR',
      'HU',
      'IE',
      'IT',
      'LT',
      'LU',
      'LV',
      'MQ',
      'MT',
      'NL',
      'PL',
      'PT',
      'RE',
      'RO',
      'SE',
      'SI',
      'SK',
      'YT',
    ]

    // Chuyển mã quốc gia thành chữ in hoa để đảm bảo phù hợp với danh sách
    return euCountries.includes(countryCode.toUpperCase())
  },

  isMinAge18(countryCode) {
    return countryCode.toUpperCase() === 'UK' || this.isEUCountry(countryCode)
  },

  getRootDomain(url) {
    // Sử dụng URL API để phân tích URL
    const parsedUrl = new URL(url)

    // Lấy hostname từ URL (ví dụ: "abc.google.com" hoặc "google.com")
    const hostname = parsedUrl.hostname

    // Tách hostname thành các phần bằng dấu "."
    const parts = hostname.split('.')

    // Nếu hostname chỉ có một hoặc hai phần thì đó chính là root domain
    if (parts.length <= 2) {
      return hostname
    }

    // Nếu có nhiều hơn 2 phần, trả về 2 phần cuối cùng
    return parts.slice(-2).join('.')
  },

  apiURL(info) {
    if (!info) return ''

    const rootDomain = info.domain || this.getRootDomain(window.location.href)

    let api = info.protocol + '://'
    if (info.prefix) {
      api += info.prefix + '.' + rootDomain
    } else {
      api += rootDomain
    }

    if (info.port) {
      api += ':' + info.port
    }

    return api
  },

  escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\//g, '&#47;')
      .replace(/@/g, '&#64;') // Mã hóa '@' thành '&#64;'
  },

  mobileDetect() {
    try {
      if (
        /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      )
        return !0
    } catch (a) {
      console.error(a)
    }
    return !1
  },

  isTablet() {
    const ua = navigator.userAgent.toLowerCase()

    return (
      ua.includes('ipad') ||
      ua.includes('tablet') ||
      (ua.includes('android') && !ua.includes('mobile')) ||
      (ua.includes('windows') &&
        ua.includes('touch') &&
        !ua.includes('tablet pc'))
    )
  },

  isTabletOrSmallOrTouchDevice() {
    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0

    const isSmallScreen = window.innerWidth <= 768

    // Thiết bị là tablet theo UA hoặc màn hình nhỏ + cảm ứng
    return this.isTablet() || isTouchDevice || isSmallScreen
  },

  classRender(text) {
    const value = text.toLowerCase()
    switch (value) {
      case 'on':
      case 'submited':
      case 'success':
      case 'paid':
      case 'done':
      case 'approved':
      case 'active':
      case 'enabled':
      case 'winner':
      case 'passed':
      case 'running':
        return 'success'
      case 'reject':
      case 'rejected':
      case 'off':
      case 'error':
      case 'blocked':
      case 'disabled':
      case 'bot_scan_error':
      case 'suspended':
      case 'issue':
      case 'loser':
      case 'failed':
        return 'error'
      case 'pending':
      case 'disconnect':
      case 'new':
      case 'ab_testing':
        return 'warning'
      case 'pause':
      case 'paused':
      case 'queue':
      case 'notfound':
      case 'waiting':
        return undefined
      default:
        return 'info'
    }
  },

  removeDuplicateYouTubeLinks(urls) {
    const seenVideoIDs = new Set() // Lưu các Video ID đã gặp
    const uniqueLinks = [] // Mảng chứa URL không trùng

    urls.forEach((url) => {
      const match = url.match(
        /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^&\n]{11})/
      )

      if (match) {
        const videoID = match[1]

        if (!seenVideoIDs.has(videoID)) {
          seenVideoIDs.add(videoID) // Thêm ID vào danh sách đã gặp
          uniqueLinks.push(url) // Thêm URL vào danh sách không trùng
        }
      }
    })

    return uniqueLinks
  },

  youtubeVideoID(url) {
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^&\n]{11})/
    )
    return videoIdMatch ? videoIdMatch[1] : null
  },

  UserLogOut() {
    this.clearStorageInfo()

    window.location.href = LOGIN_URL
  },

  clearStorageInfo() {
    localStorage.removeItem('version')
    localStorage.removeItem(LOCAL_STORAGE_TOKEN)
    localStorage.removeItem(LOGIN_URL)
  },

  getMacros(str) {
    const regex = /{{(.*?)}}/g

    // Tìm tất cả các kết quả phù hợp và lưu vào một mảng
    const macros = []
    let match
    while ((match = regex.exec(str)) !== null) {
      macros.push(match[1]) // match[1] là phần bên trong {{ }}
    }

    return macros
  },

  queryStringToObject(queryString) {
    const params = new URLSearchParams(queryString)
    const queryObject = {}

    for (const [key, value] of params.entries()) {
      queryObject[key] = value
    }

    return queryObject
  },

  makeNameUpperCase(str) {
    // Tách chuỗi bằng dấu "_"
    const words = str.split('_')

    // Chuyển đổi chữ cái đầu mỗi từ thành chữ hoa và ghép lại
    const formatted = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return formatted
  },

  generateSlug(v) {
    var title, slug
    title = v

    slug = title.toLowerCase()

    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ|ö/gi, 'o')
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự|ü/gi, 'u')
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    slug = slug.replace(/đ/gi, 'd')
    slug = slug.replace(/[`~!@#|$%^&*()+=,./?><'":;’_-]/gi, '')
    slug = slug.replace(/ /gi, '-')
    slug = slug.replace(/-----/gi, '-')
    slug = slug.replace(/----/gi, '-')
    slug = slug.replace(/---/gi, '-')
    slug = slug.replace(/--/gi, '-')
    slug = '@' + slug + '@'
    slug = slug.replace(/@-|-@|@/gi, '')

    return slug
  },

  convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result) // Base64 kết quả
      reader.onerror = (error) => reject(error) // Báo lỗi nếu có
      reader.readAsDataURL(file) // Đọc file dưới dạng Data URL (Base64)
    })
  },

  async urlToBase64(url) {
    try {
      // Fetch the image as a blob
      const response = await fetch(url)
      const blob = await response.blob()

      // Convert the blob to Base64
      return await this.convertImageToBase64(blob)
    } catch (error) {
      console.error('Error converting URL to Base64:', error)
      return null
    }
  },

  getNameFromFileName(input) {
    if (!input) return ''
    return input.split('.').slice(0, -1).join('.')
  },

  src(path) {
    if (path?.includes('http') || path?.includes('https')) {
      return path
    }

    return `${URL_UPLOAD}${path}`
  },

  getPostID(input) {
    let show = input

    if (show.includes('_')) {
      try {
        show = show.split('_')[1]
      } catch (error) {
        console.error(error)
      }
    }

    return show
  },

  async isAdBlockEnabled() {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = `${CDN_IMAGE_MINIO_S3}/arb/ads/ads.js` // File nội bộ, dễ bị AdBlock chặn
      script.onerror = () => resolve(true) // Nếu bị chặn -> AdBlock bật
      script.onload = () => resolve(false) // Nếu load thành công -> Không có AdBlock
      document.body.appendChild(script)
    })
  },

  convertTimestampToGMT7(timestamp) {
    // Chuyển timestamp từ milliseconds sang Date object
    const date = new Date(Number(timestamp))

    // Chuyển sang GMT+7
    const options = {
      timeZone: 'Asia/Bangkok', // GMT+7
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24h format
    }

    // Format thời gian
    const formattedTime = new Intl.DateTimeFormat('en-GB', options).format(date)

    // Trả về chuỗi với ký hiệu múi giờ
    return `${formattedTime} GMT+7`
  },

  getValueByPath(obj, path) {
    let result = obj
    for (const key of path) {
      if (result[key] === undefined) return undefined
      result = result[key]
    }
    return result
  },

  isValidDate(input) {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/
    return regex.test(input)
  },

  isValidURL(url) {
    const pattern = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i
    return pattern.test(url)
  },

  clearLocalStorageByPrefix(prefix) {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key)
      }
    })
  },

  removeDomainAndParams(url) {
    const input =
      typeof url === 'string'
        ? url
        : typeof url === 'number'
        ? String(url)
        : url?.toString?.() ?? ''

    if (!input) return ''
    try {
      const parsedUrl = new URL(
        input,
        input.startsWith('http') ? undefined : window.location.origin
      )
      return parsedUrl.pathname // Chỉ lấy phần path
    } catch {
      // Nếu là relative path, xử lý thủ công
      const safeInput = typeof input === 'string' ? input : ''
      const [path = ''] = safeInput.split('?') // cắt query
      const [cleanPath = ''] = path.split('#') // cắt hash nếu có
      return cleanPath
    }
  },

  parseCSV(text) {
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',')

    const rows = lines.slice(1).map((line) => {
      const values = line.split(',')
      const row = {}
      headers.forEach((header, index) => {
        row[header.trim()] = values[index]?.trim() || ''
      })
      return row
    })

    return rows
  },

  addStyleOnce(styleId, cssContent) {
    styleId = styleId += '_style'
    if (document.getElementById(styleId)) return // Nếu đã có thì bỏ qua

    const style = document.createElement('style')
    style.id = styleId
    style.type = 'text/css'
    style.appendChild(document.createTextNode(cssContent))
    document.head.appendChild(style)
  },

  formatNumberK(n) {
    if (n >= 1000) {
      return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K'
    }
    return n.toString()
  },

  convertToGMT7(utcISOString) {
    if (!utcISOString) return 'N/A'

    const date = new Date(utcISOString)

    // Cộng thêm 7 tiếng (theo đơn vị mili giây)
    const gmt7OffsetMs = 7 * 60 * 60 * 1000
    const gmt7Date = new Date(date.getTime() + gmt7OffsetMs)

    // Format thành yyyy-MM-dd HH:mm:ss
    const pad = (n) => n.toString().padStart(2, '0')

    const year = gmt7Date.getUTCFullYear()
    const month = pad(gmt7Date.getUTCMonth() + 1)
    const day = pad(gmt7Date.getUTCDate())
    const hours = pad(gmt7Date.getUTCHours())
    const minutes = pad(gmt7Date.getUTCMinutes())
    const seconds = pad(gmt7Date.getUTCSeconds())

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} GMT+7`
  },

  convertUTCToGMT7(datetimeStr) {
    if (!datetimeStr) return 'N/A'

    // Parse thủ công chuỗi "2025-05-16 15:12:05 UTC+0"
    const [datePart, timePart] = datetimeStr.split(' ')
    const [year, month, day] = datePart.split('-').map(Number)
    const [hour, minute, second] = timePart.split(':').map(Number)

    // Tạo Date từ UTC
    const utcDate = new Date(
      Date.UTC(year, month - 1, day, hour, minute, second)
    )

    // Cộng thêm 7 giờ (GMT+7)
    const gmt7Date = new Date(utcDate.getTime() + 7 * 60 * 60 * 1000)

    // Format yyyy-MM-dd HH:mm:ss
    const pad = (n) => n.toString().padStart(2, '0')
    const formatted = `${gmt7Date.getUTCFullYear()}-${pad(
      gmt7Date.getUTCMonth() + 1
    )}-${pad(gmt7Date.getUTCDate())} ${pad(gmt7Date.getUTCHours())}:${pad(
      gmt7Date.getUTCMinutes()
    )}:${pad(gmt7Date.getUTCSeconds())} GMT+7`

    return formatted
  },

  getNestedValue(obj, path) {
    const keys = path.split('.')

    function recursive(current, index) {
      if (current === undefined || current === null) return undefined
      if (index === keys.length) return current
      return recursive(current[keys[index]], index + 1)
    }

    return recursive(obj, 0)
  },

  scrollToAndHighlight(el) {
    if (!el) return

    // Cuộn mượt đến element
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })

    // Xoá class nếu có sẵn, để đảm bảo animation chạy lại
    el.classList.remove('highlight-flash')

    // Trigger lại animation bằng cách force reflow
    void el.offsetWidth

    // Thêm class highlight
    el.classList.add('highlight-flash')

    // Xoá class sau animation để tái sử dụng được
    setTimeout(() => {
      el.classList.remove('highlight-flash')
    }, 2000)
  },

  toTitleCase(input) {
    return input
      .replace(/[-_]+/g, ' ') // thay _ và - bằng khoảng trắng
      .toLowerCase() // chuyển hết về thường
      .replace(/\b\w/g, (char) => char.toUpperCase()) // viết hoa chữ đầu mỗi từ
  },

  randomString(length = 10) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  formatFullDate(input, interval, timeZone = 'UTC') {
    if (interval === 'hour' && typeof input === 'number') {
      return input
    }

    const normalizedInput =
      typeof input === 'string' && input.includes(' ')
        ? input.replace(' ', 'T')
        : input

    const date = new Date(normalizedInput)
    if (isNaN(date)) return '(Invalid date)'

    const weekday = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short',
      timeZone,
    }).format(date)

    return `${weekday}, ${input}`
  },

  convertToVNTime(input) {
    if (!input) return ''

    let dateObj

    if (typeof input === 'number') {
      dateObj = new Date(input)
    } else if (typeof input === 'string') {
      const cleaned = input.replace(/(\.\d{3})\d+/, '$1')
      dateObj = new Date(cleaned)
    } else {
      return 'Invalid input'
    }

    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }

    const options = {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }

    const formatter = new Intl.DateTimeFormat('en-GB', options)
    return `${formatter.format(dateObj)} GMT+7`
  },

  /**
   * Helper to wrap defineAsyncComponent with retry & timeout defaults.
   * dùng async component cho gọn, có xử lý retry khi lỗi (mặc định là lỗi mạng)
   * @template {import('vue').Component} T
   * @param {AsyncLoader<T>} loader
   * @param {(Omit<AsyncOptions<T>, 'loader'> & { maxRetries?: number; shouldRetry?: (error: unknown) => boolean })=} options
   * @returns {T}
   */
  createAsyncComponent(loader, options = {}) {
    const {
      timeout = 20_000, // timeout mặc định 20s
      maxRetries = 3, // retry tối đa 3 lần
      // Mặc định retry khi gặp lỗi mạng (fetch, network, timeout, load failed)
      shouldRetry = (error) => {
        const msg = error?.message?.toLowerCase() || ''
        return (
          msg.includes('fetch') || // "Failed to fetch", "TypeError: fetch failed"
          msg.includes('network') || // "NetworkError", "Network request failed"
          msg.includes('timeout') || // "Timeout exceeded"
          msg.includes('load failed') || // "Error: Load failed", "Loading chunk failed"
          msg.includes('loading chunk') // Webpack chunk load error
        )
      },
      onError: userOnError,
      ...asyncOptions
    } = options

    return defineAsyncComponent({
      loader,
      timeout,
      ...asyncOptions,
      onError(error, retry, fail, attempts) {
        const canRetry =
          typeof shouldRetry === 'function'
            ? shouldRetry(error)
            : Boolean(shouldRetry)

        if (canRetry && attempts <= maxRetries) {
          retry()
          return
        }

        if (typeof userOnError === 'function') {
          userOnError(error, retry, fail, attempts)
          return
        }

        fail(error)
      },
    })
  },

  // => cách dùng: ví dụ

  // const ModalBidding = helper.createAsyncComponent(
  //   () => import('@/components/report-v3/ModalBidding.vue'),
  //   {
  //     timeout: 30_000,   // timeout 30s
  //     maxRetries: 5,    // retry tối đa 5 lần
  //     shouldRetry: (error) => {
  //       const msg = error?.message?.toLowerCase() || ''
  //       // Chỉ retry khi gặp Network Error hoặc Timeout, không retry khi SyntaxError
  //       return msg.includes('network') || msg.includes('timeout')
  //     },
  //   }
  // )
}
