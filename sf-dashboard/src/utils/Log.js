import helper from './helper'

const LOG_ENDPOINT = 'https://lgs.pubpowerplatform.io/rls'

class Log {
  constructor() {}

  info(message, fields) {
    this.pushLog(
      {
        level: 'info',
        message: message,
      },
      fields
    )
  }

  warning(message, fields) {
    this.pushLog(
      {
        level: 'warning',
        message: message,
      },
      fields
    )
  }

  async error(message, fields) {
    await this.pushLog(
      {
        level: 'error',
        message: message,
      },
      fields
    )
  }

  alert(message, fields) {
    this.pushLog(
      {
        level: 'alert',
        message: message,
      },
      fields
    )
  }

  emerg(message, fields) {
    this.pushLog(
      {
        level: 'emerg',
        message: message,
      },
      fields
    )
  }

  async pushLog(data, fields) {
    try {
      if (typeof data.message !== 'string') {
        console.error('Log message must be a string')
        return
      }
      if (typeof fields === 'object') {
        data = Object.assign(data, fields)
      }

      if (
        data.message ===
        'ResizeObserver loop completed with undelivered notifications.'
      )
        return

      data.domain = window.location.hostname
      data.pageUrl = window.location.href
      data._app = 'arb'

      await helper.ajaxRequest(
        LOG_ENDPOINT,
        'POST',
        'json',
        2000,
        false,
        JSON.stringify(data)
      )
    } catch (e) {
      console.error(e)
    }
  }

  captureError() {
    let thisClass = this
    window.onerror = function (message, url, line, col, error) {
      // ❌ Bỏ qua lỗi đến từ extension
      if (url?.startsWith('chrome-extension://')) return
      if (url.includes('ads.js')) return
      const string = message.toString().toLowerCase()
      const substring = 'script error'

      if (string.indexOf(substring) > -1) return

      try {
        const messageError = error && error.stack ? String(error.stack) : 'N/A'
        if (
          messageError ===
          'ResizeObserver loop completed with undelivered notifications.'
        )
          return
        thisClass.alert(message, {
          _app: 'arb',
          url: url,
          line: line,
          col: col,
          error: messageError,
          dev: helper.isLocal(),
        })
      } catch (error) {
        console.error(error)
      }
    }
  }
}

var Logging = new Log()
export default Logging
