import { AxiosRequestConfig } from 'axios'

type styleLog = {
  text: string
  styleText: string
  styleMessage: string
}

export class LogObject {
  private ok?: boolean
  private ajax?: boolean
  private payload?: boolean
  private payloadLog: string[] = ['/add', '/edit']

  private styleInfo: styleLog = {
    text: 'INFO',
    styleText:
      'color: #2196F3; font-weight: bold; background-color: #E3F2FD; padding: 2px 4px;',
    styleMessage:
      'color: #1976D2; background-color: #E3F2FD; padding: 2px 4px;',
  }

  private styleWarn: styleLog = {
    text: 'WARN',

    styleText:
      'color: #FFC107; font-weight: bold; background-color: #FFF8E1; padding: 2px 4px;',
    styleMessage:
      'color: #FFA000; background-color: #FFF8E1; padding: 2px 4px;',
  }

  private styleError: styleLog = {
    text: 'ERROR',

    styleText:
      'color: #F44336; font-weight: bold; background-color: #FFEBEE; padding: 2px 4px;',
    styleMessage:
      'color: #D32F2F; background-color: #FFEBEE; padding: 2px 4px;',
  }

  private timeMap: { [key: string]: number } = {}

  constructor() {}

  init(): void {
    this.ok = arb && (arb?.dev || arb?.debug)
    this.ajax = arb && arb?.ajax
    this.payload = arb && arb?.payload
  }

  getOK(): boolean {
    return this.ok === true
  }

  private print(style: styleLog, ...mess: any[]): void {
    mess.forEach((element: any) => {
      if (typeof element === 'object' && element !== null) {
        // Log the object using console.info to preserve expandability features
        // eslint-disable-next-line no-console
        console.info(
          `%c[${style.text}]%c (${new Date().toLocaleTimeString()})`,
          style.styleText,
          style.styleMessage
        )
        // eslint-disable-next-line no-console
        console.info(element)
      } else {
        // For other data types, use console.info as before
        // eslint-disable-next-line no-console
        console.info(
          `%c[${style.text}]%c ${element}`,
          style.styleText,
          style.styleMessage
        )
      }
    })
  }

  private name(name: string, ...mess: any[]): void {
    let newStyle = {
      text: name,
      styleText: this.styleInfo.styleText,
      styleMessage: this.styleInfo.styleMessage,
    }
    this.print(newStyle, ...mess)
  }

  private info(...mess: any[]): void {
    this.print(this.styleInfo, ...mess)
  }

  private warn(...mess: any[]): void {
    this.print(this.styleWarn, ...mess)
  }

  private error(...mess: any[]): void {
    this.print(this.styleError, ...mess)
  }

  private isStopAjax(url: string = ''): boolean {
    for (let index = 0; index < this.payloadLog.length; index++) {
      const element = this.payloadLog[index]
      if (url?.includes(element)) {
        return true
      }
    }

    return false
  }

  //Log cho ajax
  AjaxLog(options: AxiosRequestConfig): void {
    if (!this.ajax) return
    this.info(options)
  }

  //Log payload của ajax add, edit không gửi request
  Payload(options: AxiosRequestConfig): boolean {
    if (!this.payload) return false

    const isStop = this.isStopAjax(options.url)

    if (isStop) {
      this.info(options)
    }

    return this.isStopAjax(options.url)
  }

  Println(...mess: any[]): void {
    if (!this.ok) return

    this.info(...mess)
  }

  Time(name: string = 'Default'): void {
    if (!this.ok) return

    this.timeMap[name] = performance.now()
  }

  TimeEnd(name: string = 'Default'): void {
    if (!this.ok) return

    if (!this.timeMap[name]) console.error('Timer not found with name: ', name)

    this.info(`Time ${name}: `, performance.now() - this.timeMap[name])
  }

  //Custom log with prefix name
  Custom(name: string, ...mess: any[]): void {
    if (!this.ok) return

    this.name(name, ...mess)
  }

  Info(...mess: any[]): void {
    if (!this.ok) return

    this.info(...mess)
  }

  Warn(...mess: any[]): void {
    if (!this.ok) return

    this.warn(mess)
  }

  Error(...mess: any[]): void {
    if (!this.ok) return

    this.error(mess)
  }

  url(url: string): string {
    //Nếu debug -> trả về full api link, còn ko thì beauty để hiển thị cho đẹp
    if (this.ok) return url

    if (!helper.IsString(url)) return ''

    const urlArr = url?.split('?')
    if (!urlArr || urlArr.length == 0) {
      return ''
    }
    url = urlArr[0]

    return url
      .replace(/-/g, ' ') // Thay thế dấu - thành dấu cách
      .replace(/\//g, ' - ') // Thay thế dấu / thành -
      .replace(/\b\w/g, (char) => char.toUpperCase()) // Viết hoa các chữ cái đầu của mỗi từ
  }

  //Log chung cho api
  Log(url?: string, message?: any): void {
    if (!url || !message) return
    const safeHtml = `${this.url(url || '')} fetch failed:<br/>${message}`

    window.message.error(() => h('div', { innerHTML: safeHtml }), {
      closable: true,
      duration: 5000,
      keepAliveOnHover: true,
    })
  }
}

export const fmt = new LogObject()
