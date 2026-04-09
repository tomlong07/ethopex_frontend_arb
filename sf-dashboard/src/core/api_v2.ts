import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CanceledError,
  InternalAxiosRequestConfig,
} from 'axios'
import { uif } from '@/types/state/user'
import useGeneralStore from '@/store/useGeneralStore'
import helper from '@/utils/helper'
import axiosRetry from 'axios-retry'
import type { AxiosError } from 'axios'
import DOMPurify from 'dompurify'
import { MessageOptions } from 'naive-ui'
import { LOCAL_STORAGE_TOKEN } from '@/constants/storage'

const apiLink = import.meta.env.VITE_END_POINT || ''

// Notify that local is running production API -> helps prevent errors from forgetting to turn off env file changes
const isProduction =
  helper.isLocal() &&
  apiLink.startsWith('https') &&
  !/localhost|127\.0\.0\.1|\.local|api-dev/.test(apiLink)
if (isProduction) {
  alert(
    `Local Service run with API Production. Please take carefully!!! ${apiLink}`
  )
}

const settingAxios = {
  baseURL: apiLink,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8',
    Accept: 'application/json',
  },
  withCredentials: true,
} as AxiosRequestConfig

var client: AxiosInstance = axios.create(settingAxios)

axiosRetry(client, {
  retries: 2, // Số lần thử lại tối đa
  retryDelay: (retryCount: number) => {
    return Math.pow(2, retryCount) * 1000 // Retry sau 1s, 2s, 4s...
  },
  shouldResetTimeout: true,
  retryCondition: (error: AxiosError) => {
    const url = error.config?.url || '' // Lấy URL của request

    // ❌ Không retry các API create
    if (url.includes('/add') || url === '/report') return false

    // 🌐 Client mất mạng → KHÔNG retry
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false
    }

    // ⏱ Timeout (API restart hay server overload)
    if (error.code === 'ECONNABORTED') {
      return true
    }

    // 🌐 Network error nhưng client vẫn online
    if (error.code === 'ERR_NETWORK') {
      return true
    }

    // 🧨 Server error
    const status = error.response?.status
    if (status && status >= 500) {
      return true
    }

    return false
  },
})

var clientLogin: AxiosInstance = axios.create(settingAxios)

function initInterceptors() {
  const generalStore = useGeneralStore()

  // Add a request interceptor
  client.interceptors.request.use(
    function (config: InternalAxiosRequestConfig | any) {
      // Do something before request is sent
      var uifObj: uif | null = null
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN)
      if (token) {
        uifObj = JSON.parse(token)
      }

      //time number
      const parseTimeNumber: number = Date.now() / 1000
      //compare current time with expire time
      if (!uifObj || (uifObj && uifObj.expire < parseTimeNumber)) {
        if (!generalStore.showModalLogin) {
          generalStore.changeModalLogin(true)
          return Promise.reject(
            new CanceledError('Request canceled, token expired')
          )
        } else {
          return Promise.reject(new CanceledError('canceled'))
        }
      }

      config.headers['X-Token'] = uifObj?.token

      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )

  return client
}

const request = async (
  opts: AxiosRequestConfig & { messageDuration?: number },
  clientNow: AxiosInstance = client,
  log = true
) => {
  if ((!opts || !opts.url) && log) {
    console.error('Please check your API request', opts)
    return
  }

  //Nếu có data thì method là POST
  if (opts.data && !opts.method) opts.method = 'POST'

  //Default GET
  if (!opts.method) opts.method = 'GET'

  if (!opts.params) opts.params = {}

  //Gán thêm params nếu có các params debug, dev, test, sql
  if (helper.isObject(opts.params)) {
    opts.params = { ...opts.params, ...arb.apiPlus() }
  }

  //Log ajax info
  fmt.AjaxLog(opts)

  //Các api add/edit sẽ stop ko call khi có param ajax=true
  const stop = fmt.Payload(opts)
  if (stop) return

  try {
    let result = await clientNow.request(opts)
    if (result.data && opts.responseType === 'blob') return result.data

    if (result?.data?.status) return result.data

    if (result?.data?.message) {
      let configMess = {
        closable: true,
      } as MessageOptions
      if (opts.messageDuration) configMess.duration = opts.messageDuration

      window.message.error(result.data?.message, configMess)
      return result.data
    }

    if (result?.data?.errors?.length > 0) {
      if (result.data?.mode === 'html') {
        const safeHtml = DOMPurify.sanitize(
          result.data.errors.map((item: any) => item.message).join('')
        )

        window.message.error(() => h('div', { innerHTML: safeHtml }), {
          closable: true,
          duration: 15000,
        })
      } else {
        const fullMessages = result.data.errors
          .map((item: any) => item.message)
          .join('<br/>')

        if (!fullMessages.includes('druid/v2') && log) {
          fmt.Log(opts.url, fullMessages)
        }
      }
      return result.data
    }
  } catch (ex: any) {
    if (ex.message === 'canceled') return

    try {
      let messNotify = ex.message
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        messNotify = 'No Internet Connection'
      }
      if (log) fmt.Log(opts.url, messNotify)
    } catch (error) {
      if (log) console.error(error)
    }
  }
}

const requestSilent = async (opts: AxiosRequestConfig) => {
  return request(opts, client, false)
}

export default {
  initInterceptors,
  client,
  clientLogin,
  request,
  requestSilent,
}
