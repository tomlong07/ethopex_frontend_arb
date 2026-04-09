export class FeSettings {
  page_list?: string
  campaign_settings?: Record<string, CampSettings>

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          switch (key) {
            case 'campaign_settings':
              this.campaign_settings = {}
              for (const key in element) {
                if (Object.prototype.hasOwnProperty.call(element, key)) {
                  const e = element[key]
                  this.campaign_settings[key] = new CampSettings(e)
                }
              }
              break

            default:
              this[key as keyof FeSettings] = element

              break
          }
        }
      }
    }
  }

  TrafficHasClone(ts: string) {
    if (!this.campaign_settings) return false
    return this.campaign_settings[ts]?.clone || false
  }

  TrafficHasCloneV2(ts: string) {
    if (!this.campaign_settings) return false
    return this.campaign_settings[ts]?.clone_v2 || false
  }

  TrafficHasCopy(ts: string) {
    if (!this.campaign_settings) return false
    return this.campaign_settings[ts]?.copy || false
  }

  AddURL(ts: string) {
    if (!this.campaign_settings) return ''
    return this.campaign_settings[ts]?.add_rt || ''
  }
}

export class CampSettings {
  clone?: boolean
  clone_v2?: boolean
  add_rt?: string
  copy?: boolean

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue
          this[key as keyof CampSettings] = element
        }
      }
    }
  }
}
