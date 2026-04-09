import helper from '@/utils/helper'
import $ from 'jquery'
import { fmt, LogObject } from '@/core/fmt'

import {
  MessageApiInjection,
  MessageReactive,
} from 'naive-ui/es/message/src/MessageProvider'
import { MessageOptions } from 'naive-ui/es/message/src/types'
import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
declare global {
  interface Window {
    $: any
    jQuery: any
    clarity: (...args: any[]) => void
    CKEDITOR: any
    Pickr: any
    arb: ARB
    fmt: LogObject
    helper: any
    message: MessageApiInjection
    router: Router
    route: RouteLocationNormalizedLoaded
  }
}

//Quảm lí message ở cấp global tiện cho check, xóa, ...
class LogMessage {
  private campaignStatus?: MessageReactive

  constructor() {}
  CampaignStatus() {
    if (!this.campaignStatus) {
      this.campaignStatus = window.message.error('Campaign not found!')
    }
  }
}
export interface ModeSettings {
  menuLeftMode: boolean
  darkMode: boolean
  bookmark?: boolean
  hardMenu: boolean
  favouriteMenu: boolean
  listKeyFavourite: (string | number)[]
  recentPage?: boolean
  newLayout?: boolean
  recentActivity?: any[]
}
export class ARBUser {
  userId?: number
  userName?: string
  email?: string
  isDev?: boolean
  is_root?: boolean
  is_pub?: boolean
  is_com?: boolean
  is_ant?: boolean
  is_ant_full?: boolean
  is_lead?: boolean
  dataProfile?: any
  modeSettings?: ModeSettings
  recentSettings?: string[]

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (!Object.hasOwn(data, key)) continue
        const element = data[key]
        switch (key) {
          case '__pub':
            this.is_pub = data?.__pub
            break

          case '__lead':
            this.is_lead = data?.__lead
            break

          case '__com':
            this.is_com = data?.__com
          case '__ant':
            this.is_ant = data?.__ant
          case '__ant_f':
            this.is_ant_full = data?.__ant_f

          case 'proPlus':
            this.dataProfile = data?.proPlus
            break
          case 'modeSettings':
            this.changeModeSettings(data?.modeSettings)
          case 'recent_settings':
            this.changeRecentSettings(data?.recent_settings)
            break
          default:
            this[key as keyof ARBUser] = element
            break
        }
      }
    }
  }

  changeModeSettings(data: ModeSettings) {
    try {
      this.modeSettings = data
        ? data
        : {
            menuLeftMode: true,
            hardMenu: false,
            darkMode: false,
            favouriteMenu: false,
            newLayout: false,
            listKeyFavourite: [],
          }
    } catch (error) {
      console.error(error)

      this.modeSettings = {
        menuLeftMode: true,
        hardMenu: false,
        darkMode: false,
        favouriteMenu: false,
        newLayout: false,
        listKeyFavourite: [],
      }
    }

    if (
      this.modeSettings?.favouriteMenu ||
      this.modeSettings?.listKeyFavourite?.length
    ) {
      this.modeSettings.bookmark = true
    }
  }
  changeRecentSettings(data: any) {
    this.recentSettings = data ? JSON.parse(data) : ''
  }

  // menuDefault(): boolean {
  //   return this.menu === 'default' || !this.menu
  // }
  menuLeft(): boolean {
    return this.modeSettings?.menuLeftMode ?? false
  }
}

export class ARB {
  // These variables are initialized once and can be used throughout even after page changes that lose params
  //dev=true
  //debug=true
  //test=true
  //sql=true
  dev?: boolean
  debug?: boolean
  test?: boolean
  sql?: boolean

  log: LogMessage = new LogMessage()

  user: ARBUser = new ARBUser()

  isDark = false

  menuRawInfo?: any

  //

  ajax?: boolean
  payload?: boolean
  already?: string[]
  lang?: string
  message = ref<MessageLang>({
    lang: '',
    mess: {},
  }) // Use ref for reactive message so it updates automatically on changes (or displays correctly even with slow ajax load)

  constructor() {
    this.dev = helper.isDev()
    this.debug = helper.isDebug()
    this.test = helper.isTest()
    this.sql = helper.isSQL()
    this.ajax = helper.isAjax()
    this.payload = helper.isPayload()
    this.already = []

    window.arb = this
  }

  isDev() {
    return this.user?.isDev || false
  }

  isLead() {
    return this.user?.is_lead || false
  }

  isCompany() {
    return this.user?.is_com || false
  }

  isPub() {
    return this.user?.is_pub || false
  }

  isAdmin() {
    return this.user?.is_root || false
  }

  isAnt() {
    return this.user?.is_ant || false
  }

  isAntFull() {
    return this.user?.is_ant_full || false
  }

  apiPlus() {
    return {
      dev: this.dev || undefined,
      debug: this.debug || undefined,
      test: this.test || undefined,
      sql: this.sql || undefined,
    }
  }

  //Lấy mess raw, dùng để hiển thị text, tooltip,....
  mess(key: string) {
    try {
      if (this.message?.value.mess) {
        return this.message?.value.mess[key]?.m || ''
      }
    } catch {
      return ''
    }

    return ''
  }

  addMess(mess: MessageLang) {
    this.message.value = mess

    this.lang = mess.lang

    if (mess.lang) {
      localStorage.setItem('arb-lang', mess.lang)
    }

    fmt.Println(this.message)
  }

  isExist(path: string) {
    return this.already?.includes(path) || false
  }

  addMessByPath(path: string, NewMess: { [key: string]: MessageStruct }) {
    if (this.already?.includes(path)) {
      return
    }

    if (this.message) {
      this.message.value.mess = Object.assign(
        this.message?.value.mess,
        NewMess?.mess
      )
      this.already?.push(path)
      fmt.Println(this.message)
    }
  }

  // Use notifications from Naive UI’s message component directly, no need to import, shortening the code

  // Use Naive UI’s message notifications directly without importing, to keep the code concise
  private resolveMessage(messageOrKey: string) {
    const stored = this.message?.value.mess?.[messageOrKey]?.m
    return stored || messageOrKey || ''
  }

  info(key: string, options?: MessageOptions) {
    return window.message.info(
      this.resolveMessage(key),
      options
    ) as MessageReactive
  }

  infof(key: string, options?: MessageOptions, ...args: any[]) {
    return window.message.info(
      this.formatString(key, ...args) || '',
      options
    ) as MessageReactive
  }

  warning(key: string, options?: MessageOptions) {
    return window.message.warning(
      this.resolveMessage(key),
      options
    ) as MessageReactive
  }

  warningf(key: string, options?: MessageOptions, ...args: any[]) {
    return window.message.warning(
      this.formatString(key, ...args) || '',
      options
    ) as MessageReactive
  }

  success(key: string, options?: MessageOptions) {
    return window.message.success(
      this.resolveMessage(key),
      options
    ) as MessageReactive
  }

  successf(key: string, options?: MessageOptions, ...args: any[]) {
    return window.message.success(
      this.formatString(key, ...args) || '',
      options
    ) as MessageReactive
  }

  error(key: string, options?: MessageOptions) {
    return window.message.error(
      this.resolveMessage(key),
      options
    ) as MessageReactive
  }

  errorf(key: string, options?: MessageOptions, ...args: any[]) {
    return window.message.error(
      this.formatString(key, ...args) || '',
      options
    ) as MessageReactive
  }

  //Sử dụng %v define ở backend để in string ra giống log.Printf và fmt.Printf
  formatString(key: string, ...args: any[]) {
    let i = 0

    return args.length
      ? key.replace(/%v/g, () => args[i++])
      : key.replace(/%v/g, () => '')
  }
}

export const globalARB = new ARB()

interface MessageLang {
  lang: string

  mess: { [key: string]: MessageStruct }
}

interface MessageStruct {
  m: string
}

class WindowProcess {
  constructor() {
    this.initJquery()
    this.initFmt()
    this.initHelper()
  }

  initJquery(): void {
    window.$ = $
    window.jQuery = $
  }

  initFmt() {
    fmt.init()
    window.fmt = fmt
  }

  initHelper() {
    window.helper = helper
  }
}

export default new WindowProcess()
