import { createApp } from 'vue'
import Vue from 'vue'
import { createPinia } from 'pinia'
// import naive from 'naive-ui'

import App from '@/App.vue'
import GlobalPlugin from '@/core/global-plugin'

//css
import '/node_modules/tabulator-tables/dist/css/tabulator.css'
import '@/style.css'

import helper from '@/utils/helper'
import Log from '@/utils/Log'
import initRouter from '@/plugins/routes.js'
import api_v2 from '@/core/api_v2'
import useGeneralStore from '@/store/useGeneralStore'
import { ctr_user } from '@/services/ctr_user'
import initWindow from '@/core/window'
import Logging from '@/utils/Log'

import {
  API_DOCUMENT,
  CDN_IMAGE_MINIO_S3_IMAGE,
  LOGIN_URL,
  QUICK_ALT_URL,
} from './constants/urls'
import {
  LOCAL_BACK_URL,
  LOCAL_STORAGE_TOKEN,
  PUB_INFO,
} from './constants/storage'
import { setupAGGridLogger } from '@/plugins/agGridLogger'

Log.captureError()
class Main {
  appName: string

  constructor(appName: string = '#arb-app') {
    this.appName = appName
  }

  createAppElement(): void {
    const arbApp = document.createElement('div')
    arbApp.id = this.appName.replace('#', '')
  }

  preload(): void {
    // eslint-disable-next-line no-unused-expressions
    initWindow
    this.eventC()
    this.changeFavicon()
    setupAGGridLogger()
    fmt.Custom('Main', 'preload')
  }

  initApp(): void {
    fmt.Custom('Main', 'initApp')

    const app = createApp(App)
    this.vueCaptureError(app)

    app.use(createPinia())
    // app.use(naive)

    //khởi tạo gán window.arb vào arb để sử dụng trong template
    app.use(GlobalPlugin)
    //init window
    app.config.globalProperties.window = window
    app.config.globalProperties.fmt = fmt

    this.initService(app)
  }

  async initService(app: Vue.App<Element>): Promise<void> {
    fmt.Custom('Main', 'initService')

    if ([QUICK_ALT_URL, API_DOCUMENT].includes(helper.truePath())) {
      this.startService(app)
      return
    }

    api_v2.initInterceptors()

    if (helper.truePath() !== LOGIN_URL) {
      const pubInfo = helper.getCookie(PUB_INFO)

      await this.pubLogin(pubInfo)
      await helper.sleep(100)

      try {
        const loggedIn = localStorage.getItem(LOCAL_STORAGE_TOKEN)

        const obj = JSON.parse(loggedIn || '{}')

        if (!loggedIn || Number(obj.expire) < Date.now() / 1000) {
          await Logging.error('Expire token', {
            _app: 'arb',
            loggedIn: loggedIn,
            expire: obj.expire,
            now: Date.now() / 1000,
          })

          await helper.sleep(300)
          helper.UserLogOut()

          localStorage.setItem(LOCAL_BACK_URL, helper.pathNow())

          helper.UserLogOut()
          return
        }
      } catch (error) {
        await Logging.error('Login error', {
          _app: 'arb',
          error: error,
        })
        helper.UserLogOut()

        localStorage.setItem(LOCAL_BACK_URL, helper.pathNow())

        helper.UserLogOut()
        return
      }

      const { fetchInfo } = useGeneralStore()
      fmt.Custom('Main', 'fetchMenuNew')

      const ok = await fetchInfo.fetchMenuNew()

      if (!ok) return
    }
    try {
      const general = useGeneralStore()
      general.loadThemeFromStorage()

      this.toggleViewportMeta(!!general.modeSettings.newLayout)
    } catch {}

    this.startService(app)
  }

  toggleViewportMeta(enable: boolean) {
    const metaId = 'dynamic-viewport-meta'
    const existing = document.getElementById(metaId)

    if (enable) {
      console.info('New Layout Mobile!')
      if (!existing) {
        const meta = document.createElement('meta')
        meta.id = metaId
        meta.name = 'viewport'
        meta.content = 'width=device-width, initial-scale=1.0'
        document.head.appendChild(meta)
      }
    } else {
      if (existing) {
        existing.remove()
      }
    }
  }

  async startService(app: Vue.App<Element>): Promise<void> {
    fmt.Custom('Main', 'startService')

    app.use(initRouter())

    app.mount(this.appName)
  }

  async pubLogin(pubInfo: any): Promise<void> {
    if (pubInfo) {
      try {
        const pubCloneInfo = helper.clone(pubInfo)

        const thisDomain =
          window.location.protocol + '//' + window.location.hostname

        const fullInfo = JSON.parse(pubCloneInfo || '{}')

        if (thisDomain == fullInfo.quickLoginURL) {
          localStorage.setItem(
            LOCAL_STORAGE_TOKEN,
            JSON.stringify(fullInfo.uif)
          )

          helper.deleteCookie(PUB_INFO, `domain=.${fullInfo.hostURL};`)
        }
      } catch (error) {
        Logging.error('Pub login error', {
          _app: 'arb',
          error: error,
        })

        await helper.sleep(300)
        helper.UserLogOut()
      }
    }
  }

  vueCaptureError(app: Vue.App<Element>): void {
    const background = `background: #b92b27;background: -webkit-linear-gradient(to right, #1565C0, #b92b27);background: linear-gradient(to right, #1565C0, #b92b27);`
    const style = `display: inline-block; color: #fffff;${background}padding: 1px 4px; border-radius: 3px; font-size:16px;`

    app.config.errorHandler = function (error: any, vm, info) {
      let name

      if (vm && vm.$options) {
        name = vm.$options.name
      }

      window.console.error.apply(console, [`%c${name}: ${info}`, style, error])

      try {
        Log.alert(info, {
          _app: 'arb',
          name: name,
          url: window.location?.href || location?.href,
          line: error.lineNumber,
          col: error.columnNumber,
          error: error && error.stack ? String(error.stack) : 'N/A',
          dev: helper.isLocal(),
        })
      } catch (e) {
        console.error(e)
      }
    }
  }

  eventC(): void {
    try {
      document.addEventListener('copy', function (_event) {
        if (window && localStorage.getItem(LOCAL_STORAGE_TOKEN)) {
          ctr_user.Lac(window?.getSelection()?.toString())
        }
      })
    } catch {}
  }

  async changeFavicon(): Promise<void> {
    let fav: any

    switch (true) {
      case helper.isLocal():
        const apiLink = import.meta.env.VITE_END_POINT || ''
        const isProduction =
          helper.isLocal() &&
          // eslint-disable-next-line unicorn/prefer-string-starts-ends-with
          /^https/.test(apiLink) &&
          !/localhost|127\.0\.0\.1|\.local|api-dev/.test(apiLink)

        if (isProduction) {
          fav = `${CDN_IMAGE_MINIO_S3_IMAGE}/product-local.ico`
          break
        }

        fav = `${CDN_IMAGE_MINIO_S3_IMAGE}/local.svg`

        break

      case helper.isDevelopment():
        fav = `${CDN_IMAGE_MINIO_S3_IMAGE}/deve.svg`

        break

      case helper.isPub():
        fav = `${CDN_IMAGE_MINIO_S3_IMAGE}/pub.png`
        break
      default:
        fav = `${CDN_IMAGE_MINIO_S3_IMAGE}/product.svg`
        break
    }

    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
    if (!link) {
      link = document.createElement('link')
      link.rel = 'icon'
      document.head.appendChild(link)
    }
    link.href = fav
  }
}

const mainProcess = new Main()

mainProcess.preload()

mainProcess.initApp()
