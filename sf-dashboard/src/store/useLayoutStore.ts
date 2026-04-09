import { defineStore } from 'pinia'
import { DS, ONOFF } from '@/enum/campaign'
import { ctr_layout } from '@/services/ctr_layout'
import { URL_UPLOAD } from '@/constants/urls'

export class LayoutItem {
  id?: number | null
  name?: string | null
  content?: string | null
  search?: string | null
  type?: string
  run_on_network?: string
  prelander?: ONOFF
  file_layout?: string
  file_search?: string
  config?: string
  domain_config?: DomainConfigs[]

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          switch (key) {
            case 'domain_config':
              this.domain_config = (element || []).map(
                (item: any) => new DomainConfigs(item)
              )
              break

            default:
              this[key as keyof this] = element

              break
          }
        }
      }
    }

    if (!this.prelander) {
      this.prelander = ONOFF.OFF
    }
  }

  IsContent() {
    return this.type === 'content'
  }
}

export class DomainConfigs {
  domain?: string | null
  image?: string | null

  loading?: boolean = false

  constructor(data?: any) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const element = data[key]

        this[key as keyof this] = element
      }
    }
  }

  imageSrc() {
    if (this.image?.includes('http')) return this.image

    return URL_UPLOAD + this.image
  }
}
export interface LayoutLanding {
  id: number | null
  name: string | null
}

export default defineStore({
  id: 'useLayoutStore',
  state: () => ({
    isRequest: false,

    layoutList: [] as LayoutItem[],
    layoutLanding: [] as LayoutLanding[],
  }),
  actions: {
    async getLayout() {
      const res = await ctr_layout.Layouts({ demand_source: DS.PUBPOWER })
      if (res && res.status) {
        const transformedData = res.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))
        this.layoutLanding = transformedData
        return transformedData
      }
      return null
    },
  },
})
