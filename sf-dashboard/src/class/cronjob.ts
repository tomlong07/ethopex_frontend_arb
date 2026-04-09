import { ONOFF } from '@/enum/campaign'

export class CronjobTask {
  data: string[] = []
  meta: string = ONOFF.ON
  name?: string
  type: string = 'CHANGE_STATUS_CAMPAIGN'

  campaigns: string = ''
  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          if (!element) continue
          this[key as keyof this] = element
        }
      }
    }
  }

  initData() {
    this.data = helper
      .stringToArray(this.campaigns)
      .filter((data: any) => !isNaN(data))
      .map((data: any) => parseInt(data.trim(), 10))
  }
}
